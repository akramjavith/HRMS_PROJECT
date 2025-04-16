import React, { useState, useEffect, useRef, useContext } from "react";
import {
    Box, Typography, OutlinedInput, TableBody, TableRow, TableCell, Select, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid,
    Paper, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton,
} from "@mui/material";
import { userStyle } from "../../../pageStyle.js";
import { FaPrint, FaFilePdf, FaFileExcel, FaFileCsv } from "react-icons/fa";
import StyledDataGrid from "../../../components/TableStyle.js";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice.js";
import { useReactToPrint } from "react-to-print";
import moment from "moment-timezone";
import { UserRoleAccessContext, AuthContext } from "../../../context/Appcontext.js";
import Headtitle from "../../../components/Headtitle.js";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";

import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
// import {
//   DeleteConfirmation,
//   PleaseSelectRow,
// } from "../../components/DeleteConfirmation.js";

import ExportData from "../../../components/ExportData.js";
import ExportDataDay from "../../../components/ExportData.js";
import ExportDataCategory from "../../../components/ExportData.js";
import ExportDataNonProd from "../../../components/ExportData.js";
import ExportDataView from "../../../components/ExportData.js";

import InfoPopup from "../../../components/InfoPopup.js";
import MessageAlert from "../../../components/MessageAlert.js";
import { handleApiError } from "../../../components/Errorhandling.js";



function EmployeePoints() {

    let today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;


    const CustomStyledDataGrid = styled(StyledDataGrid)(({ theme }) => ({
        "& .MuiDataGrid-columnHeaderTitle": {
            fontSize: "14px",
            fontWeight: "bold !important",
            lineHeight: "15px",
            whiteSpace: "normal", // Wrap text within the available space
            overflow: "visible", // Allow overflowed text to be visible
            minWidth: "20px",
        },
        "& .MuiDataGrid-columnHeaders": {
            minHeight: "50px !important",
            maxHeight: "50px",
        },
        "& .MuiDataGrid-row": {
            fontSize: "12px", // Change the font size for row data
            minWidth: "20px",
            color: "#000000de",
            // minHeight: "50px !important",
            // Add any other styles you want to apply to the row data
        },
        '& .MuiDataGrid-cell': {
            whiteSpace: 'normal !important',
            wordWrap: 'break-word !important',
            lineHeight: '1.2 !important',  // Optional: Adjusts line height for better readability
        },
        '& .MuiDataGrid-row:nth-of-type(odd)': {
            backgroundColor: '#f5f5f5',  // Light grey for odd rows
        },
        '& .MuiDataGrid-row:nth-of-type(even)': {
            backgroundColor: '#ffffff',  // White for even rows
        },


    }));


    const [employeePoints, setEmployeePoints] = useState([]);
    const [employeePointsDay, setEmployeePointsDay] = useState([]);
    const [employeePointsCategory, setEmployeePointsCategory] = useState([]);
    const [employeePointsNonProd, setEmployeePointsCategoryNonProd] = useState([]);

    const [isEmpCheck, setIsEmpCheck] = useState(false);
    const [isEmpCheckDay, setIsEmpCheckDay] = useState(false);
    const [isEmpCheckCategory, setIsEmpCheckCategory] = useState(false);
    const [isEmpCheckNonProd, setIsEmpCheckNonProd] = useState(false);
    const [isCheckView, setIsCheckView] = useState(false);

    const [showAlert, setShowAlert] = useState();

    const [attStatus, setAttStatus] = useState([]);
    const [attModearr, setAttModearr] = useState([]);

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const handleClickOpenerr = () => { setIsErrorOpen(true); };
    const handleCloseerr = () => { setIsErrorOpen(false); };

    const [isViewDialog, setIsViewDialog] = useState(false);

    const handleViewDialogOpen = (event) => {
        setPageView(1);
        setSearchQueryView("");
        setPageSizeView(10);
        setIsViewDialog(true);
    };
    const handleViewDialogClose = () => {
        setIsViewDialog(false);
    };



    const [fileFormat, setFormat] = useState('')

    let exportColumnNames = [
        'Name',
        'Emp Code', 'From Date', 'To Date', 'Days', 'Target Points',
        'Production', 'Manual Production', 'Non Production', 'Total Points', 'Average Per'

    ]
    let exportRowValues = [
        'empname',
        'empcode',
        'fromdate',
        'todate',
        'days',
        'targetpoints',
        'production',
        'manualproduction',
        'nonproduction',
        'totalpoints',
        'averageper'
    ]

    let exportColumnNamesDay = [
        'Name',
        'Emp Code', 'Branch', 'Unit', 'Team', 'Date', 'Target', 'WeekOff',
        'Production', 'Manual', 'Non Production', 'Point', 'Avg.Point'

    ]
    let exportRowValuesDay = [
        'name',
        'empcode',
        'branch',
        'unit',
        'team',
        'date',
        'target',
        'weekoff',
        'production',
        'manual',
        'nonproduction',
        'point',
        'avgpoint'
    ]

    let exportColumnNamesCategory = [
        'Mode', 'Name',
        'Emp Code', 'Branch', 'Unit', 'Team', 'Date', 'Vendor Name', 'Category', 'Process', 'Target', 'Point',
        'Avg.point', 'A.Process', 'Con.Target', 'Con.Point', 'Con.Avg'

    ]
    let exportRowValuesCategory = [
        'mode', 'empname', 'empcode', 'branch', 'unit', 'team', 'date',
        'vendor', 'category', 'processcode', 'target', 'points', 'avgpoint', 'aprocess',
        'contarget', 'conpoints', 'conavg'
    ]

    let exportColumnNamesNonProd = ['Mode', 'Name', 'Emp Code', 'Date', 'Category', 'Target', 'Point', 'Avg.point',]
    let exportRowValuesNonProd = ['mode', 'name', 'empcode', 'date', 'category', 'target', 'point', 'avgpoint']


    let exportColumnNamesView = [
        'Mode',
        'Vendor', 'Login Id', 'Date', 'Category', 'Sub Category',
        'Identify Name', 'Flag Count', 'section',

    ]
    let exportRowValuesView = [
        'mode',
        'vendor',
        'user',
        'dateval',
        'filename',
        'category',
        'unitid',
        'flagcount',
        'section',
    ]

    //month list
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };

    //Day list
    const [isFilterOpenDay, setIsFilterOpenDay] = useState(false);
    const [isPdfFilterOpenDay, setIsPdfFilterOpenDay] = useState(false);

    // page refersh reload
    const handleCloseFilterModDay = () => {
        setIsFilterOpenDay(false);
    };

    const handleClosePdfFilterModDay = () => {
        setIsFilterOpenDay(false);
    };

    //Category list
    const [isFilterOpenCategory, setIsFilterOpenCategory] = useState(false);
    const [isPdfFilterOpenCategory, setIsPdfFilterOpenCategory] = useState(false);

    // page refersh reload
    const handleCloseFilterModCategory = () => {
        setIsFilterOpenCategory(false);
    };

    const handleClosePdfFilterModCategory = () => {
        setIsFilterOpenCategory(false);
    };

    //NonProd list
    const [isFilterOpenNonProd, setIsFilterOpenNonProd] = useState(false);
    const [isPdfFilterOpenNonProd, setIsPdfFilterOpenNonProd] = useState(false);

    // page refersh reload
    const handleCloseFilterModNonProd = () => {
        setIsFilterOpenNonProd(false);
    };

    const handleClosePdfFilterModNonProd = () => {
        setIsFilterOpenNonProd(false);
    };


    //View list
    const [isFilterOpenView, setIsFilterOpenView] = useState(false);
    const [isPdfFilterOpenView, setIsPdfFilterOpenView] = useState(false);

    // page refersh reload
    const handleCloseFilterModView = () => {
        setIsFilterOpenView(false);
    };

    const handleClosePdfFilterModView = () => {
        setIsFilterOpenView(false);
    };


    const { isUserRoleCompare, isUserRoleAccess } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);


    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const gridRef = useRef(null);

    const [searchQueryDay, setSearchQueryDay] = useState("");
    const [searchQueryManageDay, setSearchQueryManageDay] = useState("");
    const gridRefDay = useRef(null);

    const [searchQueryCategory, setSearchQueryCategory] = useState("");
    const [searchQueryManageCategory, setSearchQueryManageCategory] = useState("");
    const gridRefCategory = useRef(null);

    const [searchQueryNonProd, setSearchQueryNonProd] = useState("");
    const [searchQueryManageNonProd, setSearchQueryManageNonProd] = useState("");
    const gridRefNonProd = useRef(null);

    const [searchQueryView, setSearchQueryView] = useState("");
    const [searchQueryManageView, setSearchQueryManageView] = useState("");
    const gridRefView = useRef(null);

    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "Production Month Points.png");
                });
            });
        }
    };
    //image
    const handleCaptureImageDay = () => {
        if (gridRefDay.current) {
            html2canvas(gridRefDay.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "Day Production Points.png");
                });
            });
        }
    };

    //image
    const handleCaptureImageCategory = () => {
        if (gridRefCategory.current) {
            html2canvas(gridRefCategory.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "Category Production Points.png");
                });
            });
        }
    };

    //image
    const handleCaptureImageNonProd = () => {
        if (gridRefNonProd.current) {
            html2canvas(gridRefNonProd.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "NonProd Production Points.png");
                });
            });
        }
    };


    //image
    const handleCaptureImageView = () => {
        if (gridRefNonProd.current) {
            html2canvas(gridRefNonProd.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "NonProd Production Points.png");
                });
            });
        }
    };




    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    //Datatable Day
    const [pageDay, setPageDay] = useState(1);
    const [pageSizeDay, setPageSizeDay] = useState(10);

    //Datatable Category
    const [pageCategory, setPageCategory] = useState(1);
    const [pageSizeCategory, setPageSizeCategory] = useState(10);

    //Datatable NonProd
    const [pageNonProd, setPageNonProd] = useState(1);
    const [pageSizeNonProd, setPageSizeNonProd] = useState(10);


    //Datatable View
    const [pageView, setPageView] = useState(1);
    const [pageSizeView, setPageSizeView] = useState(10);

    // Manage Columns
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

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

    };


    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        empname: true,
        empcode: true,
        fromdate: true,
        todate: true,
        days: true,
        targetpoints: true,
        production: true,
        manualproduction: true,
        nonproduction: true,
        totalpoints: true,
        averageper: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);


    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
    };

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Employee Points",
        pageStyle: "print",
    });

    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        };
    }, []);

    const [items, setItems] = useState([]);

    const addSerialNumber = () => {

        const itemsWithSerialNumber = employeePoints.sort((a, b) => new Date(b.fromdate) - new Date(a.fromdate))?.map((item, index) => {

            return {
                ...item,
                serialNumber: index + 1,
                production: parseFloat(item.production).toFixed(2),
                totalpoints: parseFloat(item.totalpoints).toFixed(2),
                // averageper: parseFloat(item.averageper).toFixed(2),
            };
        });
        setItems(itemsWithSerialNumber);
    };

    useEffect(() => {
        addSerialNumber();
    }, [employeePoints]);

    //Datatable
    const handlePageChange = (newPage) => {
        setPage(newPage);

    };

    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
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
    const filteredDatas = items?.filter((item) => {
        return searchTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
    });

    const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);

    const totalPages = Math.ceil(filteredDatas.length / pageSize);

    const visiblePages = Math.min(totalPages, 3);

    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

    const pageNumbers = [];

    const indexOfLastItem = page * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;

    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }


    const getattendancestatus = (alldata, attS) => {

        let result = attS.filter((data, index) => {

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

    const fetchEmployeePoints = async () => {
        setIsEmpCheck(true);
        setIsEmpCheckDay(true);
        setIsEmpCheckCategory(true);
        try {
            let res_vendor = await axios.get(SERVICE.ATTENDANCE_STATUS, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            let res_Emp = await axios.post(SERVICE.GET_EMPLOYEE_PRODUCTION_LAST_THREEMONHTS, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                empname: isUserRoleAccess.companyname,
                department: isUserRoleAccess.department,
            });

            let res_Prod_Day = await axios.post(SERVICE.GET_PRODUCTIONDAY_LAST_THREEMONTHS, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                empname: isUserRoleAccess.companyname,
                department: isUserRoleAccess.department,
            });

            let dayPointsData = res_Emp.data.daypointsupload.map(item => item.uploaddata).flat().filter(d => d.name === isUserRoleAccess.companyname);

            let fromToDate = res_Emp.data.finalFromToDate;
            let deptQuery = res_Emp.data.query;


            let userids = [...new Set(res_Prod_Day.data.productiondaylists.map(item => item.user))];

            let res_Production_Upload_Data = await axios.post(SERVICE.GET_PRODUCTIONUPDATE_CURRMONTH, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                empname: isUserRoleAccess.companyname,
                department: isUserRoleAccess.department,
                user: userids,
            });
            let userProductions = [...res_Production_Upload_Data.data.productions, ...res_Production_Upload_Data.data.productionsManual];

            let finalCategoryData = res_Prod_Day.data.productiondaylists.map(item => {
                let fromDatetoDate = item.fromtodate?.split("$");
                let itemfromDate = fromDatetoDate ? fromDatetoDate[0] : "";
                let itemtoDate = fromDatetoDate ? fromDatetoDate[1] : "";
                const itemfinalFilename = item.mode === "Manual" ? item.filename : item.filename?.split(".x")[0];

                const filteredEntries = userProductions.filter(entry => {
                    const finalFilename = entry.mode === "Manual" ? entry.filename : entry.filename?.split(".x")[0];

                    const finalDateval = entry.mode === "Manual" ? `${entry.fromdate} ${entry.time}` : entry.dateval?.split(" IST")[0];
                    const entryDate = entry.mode === "Manual" ? new Date(`${finalDateval?.split(" ")[0]}T${finalDateval?.split(" ")[1]}:00.000Z`) :
                        new Date(`${finalDateval?.split(" ")[0]}T${finalDateval?.split(" ")[1]}.000Z`);

                    const fromDate = new Date(itemfromDate);
                    const toDate = new Date(itemtoDate);
                    // Check if entry date is within the range
                    return entryDate >= fromDate && entryDate <= toDate && itemfinalFilename === finalFilename && item.user === entry.user;
                });

                const count = filteredEntries ? filteredEntries.length : 0;
                const ids = filteredEntries ? filteredEntries.map(item => item._id) : [];
                return {
                    ...item,
                    totalcountcategory: count,
                    ids: ids
                }
            })


            setEmployeePointsCategory(finalCategoryData);

            const todayDate = new Date()
            let startMonthDate = new Date(fromToDate[0].fromdate);
            let endMonthDate = todayDate;


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

            let res = await axios.post(SERVICE.GET_WEEOFF_DAYS_FORUSER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                empname: isUserRoleAccess.companyname,
                empcode: isUserRoleAccess.empcode,
                username: isUserRoleAccess.username,
                department: isUserRoleAccess.department,
                userDates: daysArray,
                deptQuery: deptQuery,
                fromdate: fromToDate ? fromToDate[0].fromdate : "",
            });

            let res_applyleave = await axios.post(SERVICE.APPLYLEAVE_APPROVED, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                status: String("Approved"),
            });

            let filtered = res?.data?.finaluser?.filter(d => {
                const [day, month, year] = d.rowformattedDate.split("/");
                const formattedDate = new Date(`${year}-${month}-${day}`);

                const reasonDate = new Date(d.reasondate);
                if (d.reasondate && d.reasondate != "") {
                    return (
                        formattedDate <= reasonDate
                    )
                } else {
                    return d
                }
            })

            let leaveresult = res_applyleave?.data?.applyleaves;

            let countByEmpcodeClockin = {}; // Object to store count for each empcode
            let countByEmpcodeClockout = {};

            const itemsWithSerialNumber = filtered?.map((item, index) => {
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
                const absentItems = res?.data?.finaluser?.filter(d => d.clockinstatus === 'Absent' && item.empcode === d.empcode && d.clockin === '00:00:00' && d.clockout === '00:00:00');

                // Check if the day before and after a 'Week Off' date is marked as 'Leave' or 'Absent'
                if (item.clockinstatus === 'Week Off' && item.clockoutstatus === 'Week Off') {
                    // Define the date format for comparison
                    const itemDate = moment(item.rowformattedDate, "DD/MM/YYYY");

                    const isPreviousDayLeave = leaveresult.some(leaveItem => moment(leaveItem.date, "DD/MM/YYYY").isSame(itemDate.clone().subtract(1, 'days'), 'day') && leaveItem.empcode === item.empcode);
                    const isPreviousDayAbsent = absentItems.some(absentItem => moment(absentItem.rowformattedDate, "DD/MM/YYYY").isSame(itemDate.clone().subtract(1, 'days'), 'day'));

                    const isNextDayLeave = leaveresult.some(leaveItem => moment(leaveItem.date, "DD/MM/YYYY").isSame(itemDate.clone().add(1, 'days'), 'day') && leaveItem.empcode === item.empcode);
                    const isNextDayAbsent = absentItems.some(absentItem => moment(absentItem.rowformattedDate, "DD/MM/YYYY").isSame(itemDate.clone().add(1, 'days'), 'day'));

                    if (isPreviousDayLeave) {
                        updatedClockInStatus = 'AfterWeekOffLeave';
                        updatedClockOutStatus = 'AfterWeekOffLeave';
                    }
                    if (isPreviousDayAbsent) {
                        updatedClockInStatus = 'AfterWeekOffAbsent';
                        updatedClockOutStatus = 'AfterWeekOffAbsent';
                    }
                    if (isNextDayLeave) {
                        updatedClockInStatus = 'BeforeWeekOffLeave';
                        updatedClockOutStatus = 'BeforeWeekOffLeave';
                    }
                    if (isNextDayAbsent) {
                        updatedClockInStatus = 'BeforeWeekOffAbsent';
                        updatedClockOutStatus = 'BeforeWeekOffAbsent';
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
                    clockinstatus: updatedClockInStatus,
                    clockoutstatus: updatedClockOutStatus,
                };
            });

            const rowDataTableData = itemsWithSerialNumber?.map((item, index) => {

                return {
                    id: item.id,
                    uniqueid: item.id,
                    userid: item.userid,
                    serialNumber: item.serialNumber,
                    company: item.company,
                    branch: item.branch,
                    unit: item.unit,
                    team: item.team,
                    department: item.department,
                    username: item.username,
                    empcode: item.empcode,
                    weekoff: item.weekoff,
                    boardingLog: item.boardingLog,
                    shiftallot: item.shiftallot,
                    shift: item.shift,
                    date: item.date,
                    shiftmode: item.shiftMode,
                    clockin: item.clockin,
                    clockinstatus: item.clockinstatus,
                    lateclockincount: item.lateclockincount,
                    earlyclockoutcount: item.earlyclockoutcount,
                    clockout: item.clockout,
                    clockoutstatus: item.clockoutstatus,
                    attendanceauto: getattendancestatus(item, res_vendor?.data?.attendancestatus),
                    daystatus: item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item, res_vendor?.data?.attendancestatus),
                    // appliedthrough: getAttModeAppliedThr(item.attendanceautostatus ? item.attendanceautostatus  : getattendancestatus(item)),
                    // lop: getAttModeLop(item.attendanceautostatus ? item.attendanceautostatus  : getattendancestatus(item)),
                    // loptype: getAttModeLopType(item.attendanceautostatus ? item.attendanceautostatus  : getattendancestatus(item)),
                    // lopcalculation: getFinalLop(
                    //     getAttModeLop(item.attendanceautostatus ? item.attendanceautostatus  : getattendancestatus(item)),
                    //     getAttModeLopType(item.attendanceautostatus ? item.attendanceautostatus  : getattendancestatus(item))
                    // ),
                    // modetarget: getAttModeTarget(item.attendanceautostatus ? item.attendanceautostatus  : getattendancestatus(item)),
                    // paidpresentbefore: getAttModePaidPresent(item.attendanceautostatus ? item.attendanceautostatus  : getattendancestatus(item)),
                    // paidleavetype: getAttModePaidPresentType(item.attendanceautostatus ? item.attendanceautostatus  : getattendancestatus(item)),
                    // paidpresent: getFinalPaid(
                    //     getAttModePaidPresent(item.attendanceautostatus ? item.attendanceautostatus  : getattendancestatus(item)),
                    //     getAttModePaidPresentType(item.attendanceautostatus ? item.attendanceautostatus  : getattendancestatus(item))
                    // ),
                    // lopday: getAssignLeaveDayForLop(
                    //     getFinalLop(
                    //         getAttModeLop(item.attendanceautostatus ? item.attendanceautostatus  : getattendancestatus(item)),
                    //         getAttModeLopType(item.attendanceautostatus ? item.attendanceautostatus  : getattendancestatus(item))
                    //     )
                    // ),
                    // paidpresentday: getAssignLeaveDayForPaid(
                    //     getFinalPaid(
                    //         getAttModePaidPresent(item.attendanceautostatus ? item.attendanceautostatus  : getattendancestatus(item)),
                    //         getAttModePaidPresentType(item.attendanceautostatus ? item.attendanceautostatus  : getattendancestatus(item))
                    //     )
                    // ),
                };
            });

            if (dayPointsData.length > 0) {
                const result = fromToDate.map(interval => {

                    const filteredEntries = dayPointsData.filter(entry => {
                        const entryDate = new Date(entry.date);
                        const fromDate = new Date(interval.fromdate);
                        const toDate = new Date(interval.todate);
                        // Check if entry date is within the range
                        return entryDate >= fromDate && entryDate <= toDate;
                    });
                    const filteredEntriesDept = rowDataTableData.filter(d => {
                        const [day, month, year] = d.date?.split(" ")[0].split("/");
                        let formattedDate = `${year}-${month}-${day}`;
                        // console.log(formattedDate, 'formattedDate')
                        const entryDate = new Date(formattedDate);
                        const fromDate = new Date(interval.fromdate);
                        const toDate = new Date(interval.todate);
                        // Check if entry date is within the range
                        return entryDate >= fromDate && entryDate <= toDate;
                    });
                    // console.log(filteredEntriesDept, 'filteredEntriesDept')
                    if (filteredEntries.length > 0) {
                        // Sum the points for the filtered entries
                        const production = filteredEntries.reduce((sum, entry) => sum + parseFloat(entry.point, 10), 0);
                        const manualpoints = filteredEntries.reduce((sum, entry) => sum + parseFloat(entry.manual, 10), 0);
                        const empname = filteredEntries.length > 0 ? filteredEntries[0].name : null;
                        const empcode = filteredEntries.length > 0 ? filteredEntries[0].empcode : null;
                        const id = filteredEntries.length > 0 ? filteredEntries[0]._id : null;
                        const target = filteredEntries.length > 0 ? filteredEntries[0].target : null;
                        const days = filteredEntriesDept.filter(item => item.shift !== "Week Off").length;
                        const averageper = ((production + manualpoints) / (target * days)) * 100;

                        return {
                            fromdate: interval.fromdate,
                            todate: interval.todate,
                            totalpoints: production + manualpoints,
                            production: production,
                            manualproduction: manualpoints,
                            targetpoints: target * days,
                            id,
                            days,
                            empcode,
                            empname,
                            averageper: days != 0 ? averageper.toFixed(2) : "",
                            // entries: filteredEntries // Include all matching entries
                        };
                    }
                    else {
                        return null
                    }
                }).filter(resultItem => resultItem !== null);
                setEmployeePoints(result);
            }


            function getDatesBetween(fromDate, toDate) {
                const dates = [];
                let currentDate = new Date(fromDate);

                // Convert toDate to a Date object
                const endDate = new Date(toDate);

                // Loop until the currentDate is greater than endDate
                while (currentDate <= endDate) {
                    // Push the formatted date string to the dates array
                    dates.push(currentDate.toISOString().split("T")[0]);

                    // Increment currentDate by 1 day
                    currentDate.setDate(currentDate.getDate() + 1);
                }

                return dates; // Return the array of date strings
            }
            let findldates = res_Emp.data.result
            const datesArrayForWeekOff = getDatesBetween(findldates ? findldates.fromdate : "", findldates ? findldates.todate : "");

            // console.log(datesArray, 'datesArray')

            let finalData = dayPointsData.map(item => {
                const [year, month, day] = item.date?.split("-");
                let formattedDate = `${day}/${month}/${year}`
                return {
                    ...item,
                    daystatus: rowDataTableData.find(d => d.date.split(" ")[0] === formattedDate)?.daystatus,
                    shift: rowDataTableData.find(d => d.date.split(" ")[0] === formattedDate)?.shift,
                    weekoff: rowDataTableData.find(d => d.date.split(" ")[0] === formattedDate)?.shift === "Week Off" ? "Week Off" : ""
                }
            });
            if (finalData.length > 0) {
                // Add missing dates with "week off" to finalData
                datesArrayForWeekOff.forEach(date => {
                    const [year, month, day] = date.split("-");
                    let formattedDate = `${day}/${month}/${year}`;

                    const dayPoint = dayPointsData.find(item => item.date === date);
                    const maxDateInDayPoints = dayPointsData.reduce((max, item) => {
                        return new Date(item.date) > new Date(max) ? item.date : max;
                    }, dayPointsData[0]?.date || date);

                    // If the date is missing in dayPointsData and is not greater than the max date in dayPointsData
                    if (!dayPoint && new Date(date) <= new Date(maxDateInDayPoints)) {
                        const weekOffData = rowDataTableData.find(d => d.date.split(" ")[0] === formattedDate && d.shift === "Week Off");
                        const finalDataWithoutWeekoff = finalData.find(item => item.weekoff !== "Week Off")
                        if (weekOffData) {
                            finalData.push({
                                name: finalDataWithoutWeekoff?.name || "",
                                empcode: finalDataWithoutWeekoff?.empcode || '',
                                branch: finalDataWithoutWeekoff?.branch || '',
                                unit: finalDataWithoutWeekoff?.unit || '',
                                team: finalDataWithoutWeekoff?.team || '',
                                date: finalDataWithoutWeekoff?.date || '',
                                target: finalDataWithoutWeekoff?.target || '',
                                production: 0,
                                manual: 0,
                                nonproduction: 0,
                                point: 0,
                                avgpoint: 0,
                                date: date,
                                daystatus: weekOffData.daystatus,
                                shift: weekOffData.shift,
                                weekoff: "Week Off"
                            });
                        }
                    }
                });
            }

            setEmployeePointsDay(finalData);
            setIsEmpCheck(false);
            setIsEmpCheckDay(false);
            setIsEmpCheckCategory(false);

        } catch (err) {
            setIsEmpCheck(false);
            setIsEmpCheckDay(false);
            setIsEmpCheckCategory(false);
            console.log(err)
        }


    }

    useEffect(() => {
        fetchEmployeePoints()
    }, [])


    const columnDataTable = [

        { field: "serialNumber", headerName: "SNo", flex: 0, width: 60, hide: !columnVisibility.serialNumber, headerClassName: "bold-header", },
        { field: "empname", headerName: "Name", flex: 0, width: 230, hide: !columnVisibility.empname, headerClassName: "bold-header" },
        { field: "empcode", headerName: "Emp Code", flex: 0, width: 100, hide: !columnVisibility.empcode, headerClassName: "bold-header" },
        { field: "fromdate", headerName: "From Date", flex: 0, width: 100, hide: !columnVisibility.fromdate, headerClassName: "bold-header" },
        { field: "todate", headerName: "To Date", flex: 0, width: 100, hide: !columnVisibility.todate, headerClassName: "bold-header" },
        { field: "targetpoints", headerName: "Target Points", flex: 0, width: 90, hide: !columnVisibility.targetpoints, headerClassName: "bold-header" },
        { field: "days", headerName: "Days", flex: 0, width: 70, hide: !columnVisibility.days, headerClassName: "bold-header" },
        { field: "production", headerName: "Production", flex: 0, width: 100, hide: !columnVisibility.production, headerClassName: "bold-header" },
        { field: "manualproduction", headerName: "Manual Production", flex: 0, width: 100, hide: !columnVisibility.manualproduction, headerClassName: "bold-header" },
        { field: "nonproduction", headerName: "Non Production", flex: 0, width: 100, hide: !columnVisibility.nonproduction, headerClassName: "bold-header" },
        { field: "totalpoints", headerName: "Total Points", flex: 0, width: 100, hide: !columnVisibility.totalpoints, headerClassName: "bold-header" },
        { field: "averageper", headerName: "Avg", flex: 0, width: 90, hide: !columnVisibility.averageper, headerClassName: "bold-header" },
    ];

    const rowDataTable = filteredData.map((item, index) => {

        return {
            ...item,
            // id: item._id,

        };
    });


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

    useEffect(() => {
        // Save column visibility to localStorage whenever it changes
        localStorage.setItem("columnVisibility", JSON.stringify(columnVisibility));
    }, [columnVisibility]);

    // // Function to filter columns based on search query
    const filteredColumns = columnDataTable.filter((column) => column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase()));

    // Manage Columns functionality
    const toggleColumnVisibility = (field) => {
        setColumnVisibility((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };

    // JSX for the "Manage Columns" popover content
    const manageColumnsContent = (
        <Box style={{ padding: "10px", minWidth: "325px", "& .MuiDialogContent-root": { padding: "10px 0" } }}>
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
                <TextField label="Find column" variant="standard" fullWidth value={searchQueryManage} onChange={(e) => setSearchQueryManage(e.target.value)} sx={{ marginBottom: 5, position: "absolute" }} />
            </Box>
            <br />
            <br />
            <DialogContent sx={{ minWidth: "auto", height: "200px", position: "relative" }}>
                <List sx={{ overflow: "auto", height: "100%" }}>
                    {filteredColumns.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText
                                sx={{ display: "flex" }}
                                primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibility[column.field]} onChange={() => toggleColumnVisibility(column.field)} />}
                                secondary={column.field === "checkbox" ? "Checkbox" : column.headerName}
                            // secondary={column.headerName }
                            />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Grid container>
                    <Grid item md={4}>
                        <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibility(initialColumnVisibility)}>
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
                                columnDataTable.forEach((column) => {
                                    newColumnVisibility[column.field] = false; // Set hide property to true
                                });
                                setColumnVisibility(newColumnVisibility);
                            }}
                        >
                            Hide All
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Box>
    );

    //DATATABLE DAY DATSS

    // Manage Columns
    const [isManageColumnsOpenDay, setManageColumnsOpenDay] = useState(false);
    const [anchorElDay, setAnchorElDay] = useState(null);

    const handleOpenManageColumnsDay = (event) => {
        setAnchorElDay(event.currentTarget);
        setManageColumnsOpenDay(true);
    };
    const handleCloseManageColumnsDay = () => {
        setManageColumnsOpenDay(false);
        setSearchQueryManageDay("");
    };

    const openDay = Boolean(anchorElDay);
    const idDay = openDay ? "simple-popover" : undefined;
    // Show All Columns & Manage Columns
    const initialColumnVisibilityDay = {
        serialNumber: true,
        name: true,
        empcode: true,
        branch: true,
        unit: true,
        team: true,
        date: true,
        shift: true,
        weekoff: true,
        target: true,
        daystatus: true,
        production: true,
        manual: true,
        nonproduction: true,
        point: true,
        avgpoint: true,
    };

    const [columnVisibilityDay, setColumnVisibilityDay] = useState(initialColumnVisibilityDay);

    //print...
    const componentRefDay = useRef();
    const handleprintDay = useReactToPrint({
        content: () => componentRefDay.current,
        documentTitle: "Employee Points",
        pageStyle: "print",
    });

    const [itemsDay, setItemsDay] = useState([]);

    const addSerialNumberDay = () => {

        const itemsWithSerialNumber = employeePointsDay.sort((a, b) => new Date(b.date) - new Date(a.date))?.map((item, index) => {

            return {
                ...item,
                serialNumber: index + 1,
                production: parseFloat(item.production).toFixed(2),
                point: parseFloat(item.point).toFixed(6),
                avgpoint: parseFloat(item.avgpoint).toFixed(6),
            };
        });
        setItemsDay(itemsWithSerialNumber);
    };

    useEffect(() => {
        addSerialNumberDay();
    }, [employeePointsDay]);

    //Datatable
    const handlePageChangeDay = (newPage) => {
        setPageDay(newPage);
    };

    const handlePageSizeChangeDay = (event) => {
        setPageSizeDay(Number(event.target.value));
        setPageDay(1);
    };

    //datatable....
    const handleSearchChangeDay = (event) => {
        setSearchQueryDay(event.target.value);
        setPageDay(1);
    };
    // Split the search query into individual terms
    const searchTermsDay = searchQueryDay.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatasDay = itemsDay?.filter((item) => {
        return searchTermsDay.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
    });

    const filteredDataDay = filteredDatasDay.slice((pageDay - 1) * pageSizeDay, pageDay * pageSizeDay);

    const totalPagesDay = Math.ceil(filteredDatasDay.length / pageSizeDay);

    const visiblePagesDay = Math.min(totalPagesDay, 3);

    const firstVisiblePageDay = Math.max(1, pageDay - 1);
    const lastVisiblePageDay = Math.min(firstVisiblePageDay + visiblePagesDay - 1, totalPagesDay);

    const pageNumbersDay = [];

    const indexOfLastItemDay = pageDay * pageSizeDay;
    const indexOfFirstItemDay = indexOfLastItemDay - pageSizeDay;

    for (let i = firstVisiblePageDay; i <= lastVisiblePageDay; i++) {
        pageNumbersDay.push(i);
    }



    const columnDataTableDay = [
        { field: "serialNumber", headerName: "SNo", flex: 0, width: 60, hide: !columnVisibilityDay.serialNumber, headerClassName: "bold-header", },
        { field: "name", headerName: "Name", flex: 0, width: 170, hide: !columnVisibilityDay.empcode, headerClassName: "bold-header" },
        { field: "empcode", headerName: "Emp Code", flex: 0, width: 100, hide: !columnVisibilityDay.empcode, headerClassName: "bold-header" },
        { field: "branch", headerName: "Branch", flex: 0, width: 100, hide: !columnVisibilityDay.branch, headerClassName: "bold-header" },
        { field: "unit", headerName: "Unit", flex: 0, width: 70, hide: !columnVisibilityDay.unit, headerClassName: "bold-header" },
        { field: "team", headerName: "Team", flex: 0, width: 80, hide: !columnVisibilityDay.team, headerClassName: "bold-header" },
        { field: "date", headerName: "Date", flex: 0, width: 90, hide: !columnVisibilityDay.date, headerClassName: "bold-header" },
        { field: "target", headerName: "Target", flex: 0, width: 65, hide: !columnVisibilityDay.target, headerClassName: "bold-header" },
        { field: "shift", headerName: "Shift", flex: 0, width: 80, hide: !columnVisibilityDay.target, headerClassName: "bold-header" },
        { field: "weekoff", headerName: "WeekOff", flex: 0, width: 85, hide: !columnVisibilityDay.weekoff, headerClassName: "bold-header" },
        { field: "daystatus", headerName: "Day Status", flex: 0, width: 85, hide: !columnVisibilityDay.weekoff, headerClassName: "bold-header" },
        { field: "production", headerName: "Production", flex: 0, width: 90, hide: !columnVisibilityDay.production, headerClassName: "bold-header" },
        { field: "manual", headerName: "Manual", flex: 0, width: 80, hide: !columnVisibilityDay.manualproduction, headerClassName: "bold-header" },
        { field: "nonproduction", headerName: "Non Production", flex: 0, width: 85, hide: !columnVisibilityDay.nonproduction, headerClassName: "bold-header" },
        { field: "point", headerName: "Point", flex: 0, width: 85, hide: !columnVisibilityDay.point, headerClassName: "bold-header" },
        { field: "avgpoint", headerName: "Avg.Point", flex: 0, width: 85, hide: !columnVisibilityDay.averageper, headerClassName: "bold-header" },
    ];

    const rowDataTableDay = filteredDataDay.map((item, index) => {

        return {
            ...item,
            id: item.serialNumber,
            point: parseFloat(item.point).toFixed(6),
            avgpoint: parseFloat(item.avgpoint).toFixed(6),
        };
    });


    // Show All Columns functionality
    const handleShowAllColumnsDay = () => {
        const updatedVisibility = { ...columnVisibilityDay };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibilityDay(updatedVisibility);
    };

    useEffect(() => {
        // Retrieve column visibility from localStorage (if available)
        const savedVisibility = localStorage.getItem("columnVisibilityDay");
        if (savedVisibility) {
            setColumnVisibilityDay(JSON.parse(savedVisibility));
        }
    }, []);

    useEffect(() => {
        // Save column visibility to localStorage whenever it changes
        localStorage.setItem("columnVisibilityDay", JSON.stringify(columnVisibilityDay));
    }, [columnVisibilityDay]);

    // // Function to filter columns based on search query
    const filteredColumnsDay = columnDataTableDay.filter((column) => column.headerName.toLowerCase().includes(searchQueryManageDay.toLowerCase()));

    // Manage Columns functionality
    const toggleColumnVisibilityDay = (field) => {
        setColumnVisibilityDay((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };

    // JSX for the "Manage Columns" popover content
    const manageColumnsContentDay = (
        <Box style={{ padding: "10px", minWidth: "325px", "& .MuiDialogContent-root": { padding: "10px 0" } }}>
            <Typography variant="h6">Manage Columns</Typography>
            <IconButton
                aria-label="close"
                onClick={handleCloseManageColumnsDay}
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
                <TextField label="Find column" variant="standard" fullWidth value={searchQueryManageDay} onChange={(e) => setSearchQueryManageDay(e.target.value)} sx={{ marginBottom: 5, position: "absolute" }} />
            </Box>
            <br />
            <br />
            <DialogContent sx={{ minWidth: "auto", height: "200px", position: "relative" }}>
                <List sx={{ overflow: "auto", height: "100%" }}>
                    {filteredColumnsDay.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText
                                sx={{ display: "flex" }}
                                primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibilityDay[column.field]} onChange={() => toggleColumnVisibilityDay(column.field)} />}
                                secondary={column.field === "checkbox" ? "Checkbox" : column.headerName}
                            // secondary={column.headerName }
                            />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Grid container>
                    <Grid item md={4}>
                        <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibilityDay(initialColumnVisibilityDay)}>
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
                                columnDataTableDay.forEach((column) => {
                                    newColumnVisibility[column.field] = false; // Set hide property to true
                                });
                                setColumnVisibilityDay(newColumnVisibility);
                            }}
                        >
                            Hide All
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Box>
    );


    // DATATATABLE CATEGORY 
    const [isManageColumnsOpenCategory, setManageColumnsOpenCategory] = useState(false);
    const [anchorElCategory, setAnchorElCategory] = useState(null);

    const handleOpenManageColumnsCategory = (event) => {
        setAnchorElCategory(event.currentTarget);
        setManageColumnsOpenCategory(true);
    };
    const handleCloseManageColumnsCategory = () => {
        setManageColumnsOpenCategory(false);
        setSearchQueryManageCategory("");
    };

    const openCategory = Boolean(anchorElCategory);
    const idCategory = openCategory ? "simple-popover" : undefined;
    // Show All Columns & Manage Columns
    const initialColumnVisibilityCategory = {
        serialNumber: true,
        mode: true,
        empname: true,
        empcode: true,
        branch: true,
        unit: true,
        team: true,
        date: true,
        filename: true,
        vendor: true,
        category: true,
        processcode: true,
        target: true,
        points: true,
        avgpoint: true,
        aprocess: true,
        contarget: true,
        totalcountcategory: true,
        conpoints: true,
        conavg: true,
        action: true,
    };

    const [columnVisibilityCategory, setColumnVisibilityCategory] = useState(initialColumnVisibilityCategory);

    //print...
    const componentRefCategory = useRef();
    const handleprintCategory = useReactToPrint({
        content: () => componentRefCategory.current,
        documentTitle: "Employee Points",
        pageStyle: "print",
    });

    const [itemsCategory, setItemsCategory] = useState([]);

    const addSerialNumberCategory = () => {

        const itemsWithSerialNumber = employeePointsCategory.sort((a, b) => new Date(b.fromtodate.split("T")[0]) - new Date(a.fromtodate.split("T")[0]))?.map((item, index) => {

            return {
                ...item,
                serialNumber: index + 1,
                date: item.fromtodate.split("T")[0],
            };
        });
        setItemsCategory(itemsWithSerialNumber);
    };

    useEffect(() => {
        addSerialNumberCategory();
    }, [employeePointsCategory]);

    //Datatable
    const handlePageChangeCategory = (newPage) => {
        setPageCategory(newPage);

    };

    const handlePageSizeChangeCategory = (event) => {
        setPageSizeCategory(Number(event.target.value));
        setPageCategory(1);
    };

    //datatable....
    const handleSearchChangeCategory = (event) => {
        setSearchQueryCategory(event.target.value);
        setPageCategory(1);
    };
    // Split the search query into individual terms
    const searchTermsCategory = searchQueryCategory.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatasCategory = itemsCategory?.filter((item) => {
        return searchTermsCategory.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
    });

    const filteredDataCategory = filteredDatasCategory.slice((pageCategory - 1) * pageSizeCategory, pageCategory * pageSizeCategory);

    const totalPagesCategory = Math.ceil(filteredDatasCategory.length / pageSizeCategory);

    const visiblePagesCategory = Math.min(totalPagesCategory, 3);

    const firstVisiblePageCategory = Math.max(1, pageCategory - 1);
    const lastVisiblePageCategory = Math.min(firstVisiblePageCategory + visiblePagesCategory - 1, totalPagesCategory);

    const pageNumbersCategory = [];

    const indexOfLastItemCategory = pageCategory * pageSizeCategory;
    const indexOfFirstItemCategory = indexOfLastItemCategory - pageSizeCategory;

    for (let i = firstVisiblePageCategory; i <= lastVisiblePageCategory; i++) {
        pageNumbersCategory.push(i);
    }

    const [viewData, setViewData] = useState([]);


    const handleView = async (params) => {
        setIsCheckView(true)
        try {
            let res_Production_Upload_Data = await axios.post(SERVICE.GET_PRODUCTIONUPDATE_CURRMONTH_VIEW, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                ids: params.row.ids,
            });
            let combinedData = [...res_Production_Upload_Data.data.productiondaylists, ...res_Production_Upload_Data.data.productiondaylistsManual]
            setViewData(combinedData);
            handleViewDialogOpen();
            setIsCheckView(false)
            // console.log(res_Production_Upload_Data.data.productiondaylists);
        } catch (err) {
            setIsCheckView(false)
            console.log(err)
        }
    }

    const columnDataTableCategory = [

        { field: "serialNumber", headerName: "SNo", flex: 0, width: 50, hide: !columnVisibilityCategory.serialNumber, headerClassName: "bold-header", },
        { field: "mode", headerName: "Mode", flex: 0, width: 81, hide: !columnVisibilityCategory.mode, headerClassName: "bold-header", },
        { field: "empname", headerName: "Name", flex: 0, width: 130, hide: !columnVisibilityCategory.empname, headerClassName: "bold-header" },
        { field: "empcode", headerName: "Emp Code", flex: 0, width: 100, hide: !columnVisibilityCategory.empcode, headerClassName: "bold-header" },
        { field: "branch", headerName: "Branch", flex: 0, width: 75, hide: !columnVisibilityCategory.branch, headerClassName: "bold-header" },
        { field: "unit", headerName: "Unit", flex: 0, width: 70, hide: !columnVisibilityCategory.unit, headerClassName: "bold-header" },
        { field: "team", headerName: "Team", flex: 0, width: 70, hide: !columnVisibilityCategory.team, headerClassName: "bold-header" },
        { field: "date", headerName: "Date", flex: 0, width: 88, hide: !columnVisibilityCategory.date, headerClassName: "bold-header" },
        { field: "vendor", headerName: "Vendor Name", flex: 0, width: 100, hide: !columnVisibilityCategory.vendor, headerClassName: "bold-header" },
        { field: "filename", headerName: "Category", flex: 0, width: 165, hide: !columnVisibilityCategory.category, headerClassName: "bold-header" },
        { field: "totalcountcategory", headerName: "Total Count", flex: 0, width: 60, hide: !columnVisibilityCategory.totalcountcategory, headerClassName: "bold-header" },
        { field: "processcode", headerName: "Process", flex: 0, width: 85, hide: !columnVisibilityCategory.processcode, headerClassName: "bold - header" },
        { field: "target", headerName: "Target", flex: 0, width: 55, hide: !columnVisibilityCategory.target, headerClassName: "bold-header" },
        { field: "points", headerName: "Point", flex: 0, width: 65, hide: !columnVisibilityCategory.points, headerClassName: "bold-header" },
        { field: "avgpoint", headerName: "Avg Point", flex: 0, width: 65, hide: !columnVisibilityCategory.avgpoint, headerClassName: "bold-header" },
        { field: "aprocess", headerName: "A Process", flex: 0, width: 85, hide: !columnVisibilityCategory.aprocess, headerClassName: "bold-header" },
        { field: "contarget", headerName: "Con Target", flex: 0, width: 55, hide: !columnVisibilityCategory.contarget, headerClassName: "bold-header" },
        { field: "conpoints", headerName: "Con Points", flex: 0, width: 78, hide: !columnVisibilityCategory.conpoints, headerClassName: "bold-header" },
        { field: "conavg", headerName: "Con Avg", flex: 0, width: 80, hide: !columnVisibilityCategory.conavg, headerClassName: "bold-header" },
        {
            field: "action", headerName: "Action", flex: 0, width: 80, hide: !columnVisibilityCategory.action, headerClassName: "bold-header", renderCell: (params) => (
                <Grid sx={{ display: "flex", gap: "20px" }}>
                    {isUserRoleCompare?.includes("vemployeepoints") && (
                        <Button variant="contained" sx={{ minWidth: "30px", textTransform: "capitalize" }} onClick={() => handleView(params)}>
                            View
                        </Button>
                    )}
                </Grid>
            ),
        },
    ];

    const rowDataTableCategory = filteredDataCategory.map((item, index) => {

        return {
            ...item,
            id: item._id,


        };
    });


    // Show All Columns functionality
    const handleShowAllColumnsCategory = () => {
        const updatedVisibility = { ...columnVisibilityCategory };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibilityCategory(updatedVisibility);
    };

    useEffect(() => {
        // Retrieve column visibility from localStorage (if available)
        const savedVisibility = localStorage.getItem("columnVisibilityCategory");
        if (savedVisibility) {
            setColumnVisibilityCategory(JSON.parse(savedVisibility));
        }
    }, []);

    useEffect(() => {
        // Save column visibility to localStorage whenever it changes
        localStorage.setItem("columnVisibilityCategory", JSON.stringify(columnVisibilityCategory));
    }, [columnVisibilityCategory]);

    // // Function to filter columns based on search query
    const filteredColumnsCategory = columnDataTableCategory.filter((column) => column.headerName.toLowerCase().includes(searchQueryManageCategory.toLowerCase()));

    // Manage Columns functionality
    const toggleColumnVisibilityCategory = (field) => {
        setColumnVisibilityCategory((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };

    // JSX for the "Manage Columns" popover content
    const manageColumnsContentCategory = (
        <Box style={{ padding: "10px", minWidth: "325px", "& .MuiDialogContent-root": { padding: "10px 0" } }}>
            <Typography variant="h6">Manage Columns</Typography>
            <IconButton
                aria-label="close"
                onClick={handleCloseManageColumnsCategory}
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
                <TextField label="Find column" variant="standard" fullWidth value={searchQueryManageCategory} onChange={(e) => setSearchQueryManageCategory(e.target.value)} sx={{ marginBottom: 5, position: "absolute" }} />
            </Box>
            <br />
            <br />
            <DialogContent sx={{ minWidth: "auto", height: "200px", position: "relative" }}>
                <List sx={{ overflow: "auto", height: "100%" }}>
                    {filteredColumnsCategory.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText
                                sx={{ display: "flex" }}
                                primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibilityCategory[column.field]} onChange={() => toggleColumnVisibilityCategory(column.field)} />}
                                secondary={column.field === "checkbox" ? "Checkbox" : column.headerName}
                            // secondary={column.headerName }
                            />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Grid container>
                    <Grid item md={4}>
                        <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibilityCategory(initialColumnVisibilityCategory)}>
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
                                columnDataTableCategory.forEach((column) => {
                                    newColumnVisibility[column.field] = false; // Set hide property to true
                                });
                                setColumnVisibilityCategory(newColumnVisibility);
                            }}
                        >
                            Hide All
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Box>
    );

    // DATATATABLE CATEGORY 
    const [isManageColumnsOpenNonProd, setManageColumnsOpenNonProd] = useState(false);
    const [anchorElNonProd, setAnchorElNonProd] = useState(null);

    const handleOpenManageColumnsNonProd = (event) => {
        setAnchorElNonProd(event.currentTarget);
        setManageColumnsOpenNonProd(true);
    };
    const handleCloseManageColumnsNonProd = () => {
        setManageColumnsOpenNonProd(false);
        setSearchQueryManageNonProd("");
    };

    const openNonProd = Boolean(anchorElNonProd);
    const idNonProd = openNonProd ? "simple-popover" : undefined;
    // Show All Columns & Manage Columns
    const initialColumnVisibilityNonProd = {
        serialNumber: true,
        mode: true,
        empname: true,
        empcode: true,
        date: true,
        category: true,
        target: true,
        points: true,
        avgpoint: true,
    };

    const [columnVisibilityNonProd, setColumnVisibilityNonProd] = useState(initialColumnVisibilityNonProd);

    //print...
    const componentRefNonProd = useRef();
    const handleprintNonProd = useReactToPrint({
        content: () => componentRefNonProd.current,
        documentTitle: "Employee Points",
        pageStyle: "print",
    });

    const [itemsNonProd, setItemsNonProd] = useState([]);

    const addSerialNumberNonProd = () => {

        const itemsWithSerialNumber = employeePointsNonProd?.map((item, index) => {

            return {
                ...item,
                serialNumber: index + 1,
                date: item.fromtodate.split("T")[0],
            };
        });
        setItemsNonProd(itemsWithSerialNumber);
    };

    useEffect(() => {
        addSerialNumberNonProd();
    }, [employeePointsNonProd]);

    //Datatable
    const handlePageChangeNonProd = (newPage) => {
        setPageNonProd(newPage);

    };

    const handlePageSizeChangeNonProd = (event) => {
        setPageSizeNonProd(Number(event.target.value));
        setPageNonProd(1);
    };

    //datatable....
    const handleSearchChangeNonProd = (event) => {
        setSearchQueryNonProd(event.target.value);
        setPageNonProd(1);
    };
    // Split the search query into individual terms
    const searchTermsNonProd = searchQueryNonProd.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatasNonProd = itemsNonProd?.filter((item) => {
        return searchTermsNonProd.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
    });

    const filteredDataNonProd = filteredDatasNonProd.slice((pageNonProd - 1) * pageSizeNonProd, pageNonProd * pageSizeNonProd);

    const totalPagesNonProd = Math.ceil(filteredDatasNonProd.length / pageSizeNonProd);

    const visiblePagesNonProd = Math.min(totalPagesNonProd, 3);

    const firstVisiblePageNonProd = Math.max(1, pageNonProd - 1);
    const lastVisiblePageNonProd = Math.min(firstVisiblePageNonProd + visiblePagesNonProd - 1, totalPagesNonProd);

    const pageNumbersNonProd = [];

    const indexOfLastItemNonProd = pageNonProd * pageSizeNonProd;
    const indexOfFirstItemNonProd = indexOfLastItemNonProd - pageSizeNonProd;

    for (let i = firstVisiblePageNonProd; i <= lastVisiblePageNonProd; i++) {
        pageNumbersNonProd.push(i);
    }



    const columnDataTableNonProd = [

        { field: "serialNumber", headerName: "SNo", flex: 0, width: 80, hide: !columnVisibilityNonProd.serialNumber, headerClassName: "bold-header", },
        { field: "mode", headerName: "Mode", flex: 0, width: 100, hide: !columnVisibilityNonProd.mode, headerClassName: "bold-header", },
        { field: "empname", headerName: "Name", flex: 0, width: 280, hide: !columnVisibilityNonProd.empname, headerClassName: "bold-header" },
        { field: "empcode", headerName: "Emp Code", flex: 0, width: 110, hide: !columnVisibilityNonProd.empcode, headerClassName: "bold-header" },
        { field: "date", headerName: "Date", flex: 0, width: 100, hide: !columnVisibilityNonProd.date, headerClassName: "bold-header" },
        { field: "category", headerName: "NonProd", flex: 0, width: 100, hide: !columnVisibilityNonProd.category, headerClassName: "bold-header" },
        { field: "target", headerName: "Target", flex: 0, width: 100, hide: !columnVisibilityNonProd.target, headerClassName: "bold-header" },
        { field: "points", headerName: "Point", flex: 0, width: 100, hide: !columnVisibilityNonProd.points, headerClassName: "bold-header" },
        { field: "avgpoint", headerName: "Avg Point", flex: 0, width: 100, hide: !columnVisibilityNonProd.avgpoint, headerClassName: "bold-header" },

    ];

    const rowDataTableNonProd = filteredDataNonProd.map((item, index) => {

        return {
            ...item,
            id: item._id,


        };
    });


    // Show All Columns functionality
    const handleShowAllColumnsNonProd = () => {
        const updatedVisibility = { ...columnVisibilityNonProd };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibilityNonProd(updatedVisibility);
    };

    useEffect(() => {
        // Retrieve column visibility from localStorage (if available)
        const savedVisibility = localStorage.getItem("columnVisibilityNonProd");
        if (savedVisibility) {
            setColumnVisibilityNonProd(JSON.parse(savedVisibility));
        }
    }, []);

    useEffect(() => {
        // Save column visibility to localStorage whenever it changes
        localStorage.setItem("columnVisibilityNonProd", JSON.stringify(columnVisibilityNonProd));
    }, [columnVisibilityNonProd]);

    // // Function to filter columns based on search query
    const filteredColumnsNonProd = columnDataTableNonProd.filter((column) => column.headerName.toLowerCase().includes(searchQueryManageNonProd.toLowerCase()));

    // Manage Columns functionality
    const toggleColumnVisibilityNonProd = (field) => {
        setColumnVisibilityNonProd((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };

    // JSX for the "Manage Columns" popover content
    const manageColumnsContentNonProd = (
        <Box style={{ padding: "10px", minWidth: "325px", "& .MuiDialogContent-root": { padding: "10px 0" } }}>
            <Typography variant="h6">Manage Columns</Typography>
            <IconButton
                aria-label="close"
                onClick={handleCloseManageColumnsNonProd}
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
                <TextField label="Find column" variant="standard" fullWidth value={searchQueryManageNonProd} onChange={(e) => setSearchQueryManageNonProd(e.target.value)} sx={{ marginBottom: 5, position: "absolute" }} />
            </Box>
            <br />
            <br />
            <DialogContent sx={{ minWidth: "auto", height: "200px", position: "relative" }}>
                <List sx={{ overflow: "auto", height: "100%" }}>
                    {filteredColumnsNonProd.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText
                                sx={{ display: "flex" }}
                                primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibilityNonProd[column.field]} onChange={() => toggleColumnVisibilityNonProd(column.field)} />}
                                secondary={column.field === "checkbox" ? "Checkbox" : column.headerName}
                            // secondary={column.headerName }
                            />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Grid container>
                    <Grid item md={4}>
                        <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibilityNonProd(initialColumnVisibilityNonProd)}>
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
                                columnDataTableNonProd.forEach((column) => {
                                    newColumnVisibility[column.field] = false; // Set hide property to true
                                });
                                setColumnVisibilityNonProd(newColumnVisibility);
                            }}
                        >
                            Hide All
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Box>
    );

    //DATATABLE VIEW
    // DATATATABLE VIEW 
    const [isManageColumnsOpenView, setManageColumnsOpenView] = useState(false);
    const [anchorElView, setAnchorElView] = useState(null);

    const handleOpenManageColumnsView = (event) => {
        setAnchorElView(event.currentTarget);
        setManageColumnsOpenView(true);
    };
    const handleCloseManageColumnsView = () => {
        setManageColumnsOpenView(false);
        setSearchQueryManageView("");
    };

    const openView = Boolean(anchorElView);
    const idView = openView ? "simple-popover" : undefined;
    // Show All Columns & Manage Columns
    const initialColumnVisibilityView = {
        serialNumber: true,
        mode: true,
        vendor: true,
        user: true,
        dateval: true,
        category: true,
        filename: true,
        unitid: true,
        flagcount: true,
        section: true,
    };

    const [columnVisibilityView, setColumnVisibilityView] = useState(initialColumnVisibilityView);

    //print...
    const componentRefView = useRef();
    const handleprintView = useReactToPrint({
        content: () => componentRefView.current,
        documentTitle: "Employee Points",
        pageStyle: "print",
    });

    const [itemsView, setItemsView] = useState([]);

    const addSerialNumberView = () => {

        const itemsWithSerialNumber = viewData?.map((item, index) => {

            return {
                ...item,
                serialNumber: index + 1,
                mode: item.mode === "Manual" ? "Manual" : "Production",
                dateval: item.mode === "Manual" ? `${item.fromdate} ${item.time}:00` : item.dateval,
                filename: item.mode === "Manual" ? item.filename : item.filename.split(".x")[0]
            };
        });
        setItemsView(itemsWithSerialNumber);
    };

    useEffect(() => {
        addSerialNumberView();
    }, [viewData]);

    //Datatable
    const handlePageChangeView = (newPage) => {
        setPageView(newPage);
    };

    const handlePageSizeChangeView = (event) => {
        setPageSizeView(Number(event.target.value));
        setPageView(1);
    };

    //datatable....
    const handleSearchChangeView = (event) => {
        setSearchQueryView(event.target.value);
        setPageView(1);
    };
    // Split the search query into individual terms
    const searchTermsView = searchQueryView.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatasView = itemsView?.filter((item) => {
        return searchTermsView.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
    });

    const filteredDataView = filteredDatasView.slice((pageView - 1) * pageSizeView, pageView * pageSizeView);

    const totalPagesView = Math.ceil(filteredDatasView.length / pageSizeView);

    const visiblePagesView = Math.min(totalPagesView, 3);

    const firstVisiblePageView = Math.max(1, pageView - 1);
    const lastVisiblePageView = Math.min(firstVisiblePageView + visiblePagesView - 1, totalPagesView);

    const pageNumbersView = [];

    const indexOfLastItemView = pageView * pageSizeView;
    const indexOfFirstItemView = indexOfLastItemView - pageSizeView;

    for (let i = firstVisiblePageView; i <= lastVisiblePageView; i++) {
        pageNumbersView.push(i);
    }



    const columnDataTableView = [

        { field: "serialNumber", headerName: "SNo", flex: 0, width: 60, hide: !columnVisibilityView.serialNumber, headerClassName: "bold-header", },
        { field: "mode", headerName: "Mode", flex: 0, width: 90, hide: !columnVisibilityView.mode, headerClassName: "bold-header", },
        { field: "vendor", headerName: "Vendor", flex: 0, width: 180, hide: !columnVisibilityView.vendor, headerClassName: "bold-header" },
        { field: "user", headerName: "User", flex: 0, width: 110, hide: !columnVisibilityView.user, headerClassName: "bold-header" },
        { field: "dateval", headerName: "Date", flex: 0, width: 180, hide: !columnVisibilityView.dateval, headerClassName: "bold-header" },
        { field: "filename", headerName: "Category", flex: 0, width: 290, hide: !columnVisibilityView.filename, headerClassName: "bold-header" },
        { field: "category", headerName: "Subcategory", flex: 0, width: 420, hide: !columnVisibilityView.category, headerClassName: "bold-header" },
        { field: "unitid", headerName: "IdentifyName", flex: 0, width: 170, hide: !columnVisibilityView.unitid, headerClassName: "bold-header" },
        { field: "flagcount", headerName: "FlagCount", flex: 0, width: 90, hide: !columnVisibilityView.flagcount, headerClassName: "bold-header" },
        { field: "section", headerName: "Section", flex: 0, width: 80, hide: !columnVisibilityView.section, headerClassName: "bold-header" },

    ];

    const rowDataTableView = filteredDataView.map((item, index) => {
        return {
            ...item,
            id: item._id,
        };
    });


    // Show All Columns functionality
    const handleShowAllColumnsView = () => {
        const updatedVisibility = { ...columnVisibilityView };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibilityView(updatedVisibility);
    };

    useEffect(() => {
        // Retrieve column visibility from localStorage (if available)
        const savedVisibility = localStorage.getItem("columnVisibilityView");
        if (savedVisibility) {
            setColumnVisibilityView(JSON.parse(savedVisibility));
        }
    }, []);

    useEffect(() => {
        // Save column visibility to localStorage whenever it changes
        localStorage.setItem("columnVisibilityView", JSON.stringify(columnVisibilityView));
    }, [columnVisibilityView]);

    // // Function to filter columns based on search query
    const filteredColumnsView = columnDataTableView.filter((column) => column.headerName.toLowerCase().includes(searchQueryManageView.toLowerCase()));

    // Manage Columns functionality
    const toggleColumnVisibilityView = (field) => {
        setColumnVisibilityView((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };

    // JSX for the "Manage Columns" popover content
    const manageColumnsContentView = (
        <Box style={{ padding: "10px", minWidth: "325px", "& .MuiDialogContent-root": { padding: "10px 0" } }}>
            <Typography variant="h6">Manage Columns</Typography>
            <IconButton
                aria-label="close"
                onClick={handleCloseManageColumnsView}
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
                <TextField label="Find column" variant="standard" fullWidth value={searchQueryManageView} onChange={(e) => setSearchQueryManageView(e.target.value)} sx={{ marginBottom: 5, position: "absolute" }} />
            </Box>
            <br />
            <br />
            <DialogContent sx={{ minWidth: "auto", height: "200px", position: "relative" }}>
                <List sx={{ overflow: "auto", height: "100%" }}>
                    {filteredColumnsView.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText
                                sx={{ display: "flex" }}
                                primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibilityView[column.field]} onChange={() => toggleColumnVisibilityView(column.field)} />}
                                secondary={column.field === "checkbox" ? "Checkbox" : column.headerName}
                            // secondary={column.headerName }
                            />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Grid container>
                    <Grid item md={4}>
                        <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibilityView(initialColumnVisibilityView)}>
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
                                columnDataTableView.forEach((column) => {
                                    newColumnVisibility[column.field] = false; // Set hide property to true
                                });
                                setColumnVisibilityView(newColumnVisibility);
                            }}
                        >
                            Hide All
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Box>
    );


    return (
        <Box>
            <Headtitle title={"Employee Points"} />

            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lemployeepoints") && (
                <>
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={{ ...userStyle.importHeaderText, fontWeight: 700, marginBottom: "10px" }}>Production Month List</Typography>
                        </Grid>

                        <Grid container style={userStyle.dataTablestyle}>
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
                                        <MenuItem value={employeePoints?.length}>All</MenuItem>
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Box>
                                    {isUserRoleCompare?.includes("excelemployeepoints") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)

                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvemployeepoints") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true);
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printemployeepoints") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfemployeepoints") && (
                                        <>
                                            <Button sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true)

                                                }}
                                            ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imageemployeepoints") && (
                                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                                            {" "}
                                            <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                                        </Button>
                                    )}
                                </Box>
                            </Grid>
                            <Grid item md={2} xs={6} sm={6}>
                                <Box>
                                    <FormControl fullWidth size="small">
                                        <Typography>Search</Typography>
                                        <OutlinedInput id="component-outlined" type="text" value={searchQuery} onChange={handleSearchChange} />
                                    </FormControl>
                                </Box>
                            </Grid>
                        </Grid>
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
                            Show All Columns
                        </Button>
                        &ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
                            Manage Columns
                        </Button>

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

                        {isEmpCheck ? (
                            <>
                                <Box sx={{ display: "flex", justifyContent: "center" }}>
                                    {/* <CircularProgress color="inherit" />  */}
                                    <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                                </Box>
                            </>
                        ) : (
                            <>
                                <Box
                                    style={{
                                        width: "100%",
                                        overflowY: "hidden", // Hide the y-axis scrollbar
                                        marginTop: "10px"
                                    }}
                                >
                                    <CustomStyledDataGrid
                                        // onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
                                        rows={rowDataTable}
                                        columns={columnDataTable.filter((column) => columnVisibility[column.field])}
                                        // onSelectionModelChange={handleSelectionChange}
                                        // selectionModel={selectedRows}
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
                                        Showing {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, filteredDatas.length)} of {filteredDatas.length} entries
                                    </Box>
                                    <Box>
                                        <Button onClick={() => setPage(1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                                            <FirstPageIcon />
                                        </Button>
                                        <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                                            <NavigateBeforeIcon />
                                        </Button>
                                        {pageNumbers?.map((pageNumber) => (
                                            <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChange(pageNumber)} className={page === pageNumber ? "active" : ""} disabled={page === pageNumber}>
                                                {pageNumber}
                                            </Button>
                                        ))}
                                        {lastVisiblePage < totalPages && <span>...</span>}
                                        <Button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                                            <NavigateNextIcon />
                                        </Button>
                                        <Button onClick={() => setPage(totalPages)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                                            <LastPageIcon />
                                        </Button>
                                    </Box>
                                </Box>
                            </>
                        )}
                    </Box>
                </>
            )}
            <br />
            {isUserRoleCompare?.includes("lemployeepoints") && (
                <>
                    <Box sx={userStyle.container}>
                        <Grid item xs={8}>
                            <Typography sx={{ ...userStyle.importHeaderText, fontWeight: 700, marginBottom: "10px" }}> Day Production List</Typography>
                        </Grid>

                        <Grid container style={userStyle.dataTablestyle}>
                            <Grid item md={2} xs={12} sm={12}>
                                <Box>
                                    <label>Show entries:</label>
                                    <Select
                                        id="pageSizeSelectDay"
                                        value={pageSizeDay}
                                        MenuProps={{
                                            PaperProps: {
                                                style: {
                                                    maxHeight: 180,
                                                    width: 80,
                                                },
                                            },
                                        }}
                                        onChange={handlePageSizeChangeDay}
                                        sx={{ width: "77px" }}
                                    >
                                        <MenuItem value={1}>1</MenuItem>
                                        <MenuItem value={5}>5</MenuItem>
                                        <MenuItem value={10}>10</MenuItem>
                                        <MenuItem value={25}>25</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
                                        <MenuItem value={100}>100</MenuItem>
                                        <MenuItem value={employeePointsDay?.length}>All</MenuItem>
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Box>
                                    {isUserRoleCompare?.includes("excelemployeepoints") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpenDay(true)

                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvemployeepoints") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpenDay(true);
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printemployeepoints") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprintDay}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfemployeepoints") && (
                                        <>
                                            <Button sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpenDay(true)

                                                }}
                                            ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imageemployeepoints") && (
                                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImageDay}>
                                            {" "}
                                            <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                                        </Button>
                                    )}
                                </Box>
                            </Grid>
                            <Grid item md={2} xs={6} sm={6}>
                                <Box>
                                    <FormControl fullWidth size="small">
                                        <Typography>Search</Typography>
                                        <OutlinedInput id="component-outlined" type="text" value={searchQueryDay} onChange={handleSearchChangeDay} />
                                    </FormControl>
                                </Box>
                            </Grid>
                        </Grid>
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumnsDay}>
                            Show All Columns
                        </Button>
                        &ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsDay}>
                            Manage Columns
                        </Button>

                        {/* Manage Column */}
                        <Popover
                            id={idDay}
                            open={isManageColumnsOpenDay}
                            anchorEl={anchorElDay}
                            onClose={handleCloseManageColumnsDay}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                            }}
                        >
                            {manageColumnsContentDay}
                        </Popover>

                        {isEmpCheckDay ? (
                            <>
                                <Box sx={{ display: "flex", justifyContent: "center" }}>
                                    {/* <CircularProgress color="inherit" />  */}
                                    <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                                </Box>
                            </>
                        ) : (
                            <>
                                <Box
                                    style={{
                                        width: "100%",
                                        overflowY: "hidden", // Hide the y-axis scrollbar
                                        marginTop: "10px"
                                    }}
                                >
                                    <CustomStyledDataGrid
                                        // onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
                                        rows={rowDataTableDay}
                                        columns={columnDataTableDay.filter((column) => columnVisibilityDay[column.field])}

                                        autoHeight={true}
                                        ref={gridRefDay}
                                        density="compact"
                                        hideFooter
                                        rowHeight={60}
                                        // getRowClassName={getRowClassNameDay}
                                        disableRowSelectionOnClick
                                    />
                                </Box>
                                <Box style={userStyle.dataTablestyle}>
                                    <Box>
                                        Showing {filteredDataDay.length > 0 ? (pageDay - 1) * pageSizeDay + 1 : 0} to {Math.min(pageDay * pageSizeDay, filteredDatasDay.length)} of {filteredDatasDay.length} entries
                                    </Box>
                                    <Box>
                                        <Button onClick={() => setPageDay(1)} disabled={pageDay === 1} sx={userStyle.paginationbtn}>
                                            <FirstPageIcon />
                                        </Button>
                                        <Button onClick={() => handlePageChangeDay(pageDay - 1)} disabled={pageDay === 1} sx={userStyle.paginationbtn}>
                                            <NavigateBeforeIcon />
                                        </Button>
                                        {pageNumbersDay?.map((pageNumberDay) => (
                                            <Button key={pageNumberDay} sx={userStyle.paginationbtn} onClick={() => handlePageChangeDay(pageNumberDay)} className={pageDay === pageNumberDay ? "active" : ""} disabled={pageDay === pageNumberDay}>
                                                {pageNumberDay}
                                            </Button>
                                        ))}
                                        {lastVisiblePageDay < totalPagesDay && <span>...</span>}
                                        <Button onClick={() => handlePageChangeDay(pageDay + 1)} disabled={pageDay === totalPagesDay} sx={userStyle.paginationbtn}>
                                            <NavigateNextIcon />
                                        </Button>
                                        <Button onClick={() => setPageDay(totalPagesDay)} disabled={pageDay === totalPagesDay} sx={userStyle.paginationbtn}>
                                            <LastPageIcon />
                                        </Button>
                                    </Box>
                                </Box>
                            </>
                        )}
                    </Box>
                </>
            )}

            <br />
            {isUserRoleCompare?.includes("lemployeepoints") && (
                <>
                    <Box sx={userStyle.container}>
                        <Grid item xs={8}>
                            <Typography sx={{ ...userStyle.importHeaderText, fontWeight: 700, marginBottom: "10px" }}> Current Production List</Typography>
                        </Grid>

                        <Grid container style={userStyle.dataTablestyle}>
                            <Grid item md={2} xs={12} sm={12}>
                                <Box>
                                    <label>Show entries:</label>
                                    <Select
                                        id="pageSizeSelectCategory"
                                        value={pageSizeCategory}
                                        MenuProps={{
                                            PaperProps: {
                                                style: {
                                                    maxHeight: 180,
                                                    width: 80,
                                                },
                                            },
                                        }}
                                        onChange={handlePageSizeChangeCategory}
                                        sx={{ width: "77px" }}
                                    >
                                        <MenuItem value={1}>1</MenuItem>
                                        <MenuItem value={5}>5</MenuItem>
                                        <MenuItem value={10}>10</MenuItem>
                                        <MenuItem value={25}>25</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
                                        <MenuItem value={100}>100</MenuItem>
                                        <MenuItem value={employeePointsCategory?.length}>All</MenuItem>
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Box>
                                    {isUserRoleCompare?.includes("excelemployeepoints") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpenCategory(true)

                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvemployeepoints") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpenCategory(true);
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printemployeepoints") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprintCategory}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfemployeepoints") && (
                                        <>
                                            <Button sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpenCategory(true)

                                                }}
                                            ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imageemployeepoints") && (
                                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImageCategory}>
                                            {" "}
                                            <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                                        </Button>
                                    )}
                                </Box>
                            </Grid>
                            <Grid item md={2} xs={6} sm={6}>
                                <Box>
                                    <FormControl fullWidth size="small">
                                        <Typography>Search</Typography>
                                        <OutlinedInput id="component-outlined" type="text" value={searchQueryCategory} onChange={handleSearchChangeCategory} />
                                    </FormControl>
                                </Box>
                            </Grid>
                        </Grid>
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumnsCategory}>
                            Show All Columns
                        </Button>
                        &ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsCategory}>
                            Manage Columns
                        </Button>

                        {/* Manage Column */}
                        <Popover
                            id={idCategory}
                            open={isManageColumnsOpenCategory}
                            anchorEl={anchorElCategory}
                            onClose={handleCloseManageColumnsCategory}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                            }}
                        >
                            {manageColumnsContentCategory}
                        </Popover>

                        {isEmpCheckCategory ? (
                            <>
                                <Box sx={{ display: "flex", justifyContent: "center" }}>
                                    {/* <CircularProgress color="inherit" />  */}
                                    <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                                </Box>
                            </>
                        ) : (
                            <>
                                <Box
                                    style={{
                                        width: "100%",
                                        overflowY: "hidden", // Hide the y-axis scrollbar
                                        marginTop: "10px",
                                        height: "max-content"
                                    }}
                                >
                                    <CustomStyledDataGrid
                                        // onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
                                        rows={rowDataTableCategory}
                                        columns={columnDataTableCategory.filter((column) => columnVisibilityCategory[column.field])}

                                        autoHeight={true}
                                        ref={gridRefCategory}
                                        density="compact"
                                        hideFooter
                                        rowHeight={80}
                                        // getRowClassName={getRowClassNameCategory}
                                        disableRowSelectionOnClick
                                    />
                                </Box>
                                <Box style={userStyle.dataTablestyle}>
                                    <Box>
                                        Showing {filteredDataCategory.length > 0 ? (pageCategory - 1) * pageSizeCategory + 1 : 0} to {Math.min(pageCategory * pageSizeCategory, filteredDatasCategory.length)} of {filteredDatasCategory.length} entries
                                    </Box>
                                    <Box>
                                        <Button onClick={() => setPageCategory(1)} disabled={pageCategory === 1} sx={userStyle.paginationbtn}>
                                            <FirstPageIcon />
                                        </Button>
                                        <Button onClick={() => handlePageChangeCategory(pageCategory - 1)} disabled={pageCategory === 1} sx={userStyle.paginationbtn}>
                                            <NavigateBeforeIcon />
                                        </Button>
                                        {pageNumbersCategory?.map((pageNumberCategory) => (
                                            <Button key={pageNumberCategory} sx={userStyle.paginationbtn} onClick={() => handlePageChangeCategory(pageNumberCategory)} className={pageCategory === pageNumberCategory ? "active" : ""} disabled={pageCategory === pageNumberCategory}>
                                                {pageNumberCategory}
                                            </Button>
                                        ))}
                                        {lastVisiblePageCategory < totalPagesCategory && <span>...</span>}
                                        <Button onClick={() => handlePageChangeCategory(pageCategory + 1)} disabled={pageCategory === totalPagesCategory} sx={userStyle.paginationbtn}>
                                            <NavigateNextIcon />
                                        </Button>
                                        <Button onClick={() => setPageCategory(totalPagesCategory)} disabled={pageCategory === totalPagesCategory} sx={userStyle.paginationbtn}>
                                            <LastPageIcon />
                                        </Button>
                                    </Box>
                                </Box>
                            </>
                        )}
                    </Box>
                </>
            )}
            <br />
            {isUserRoleCompare?.includes("lemployeepoints") && (
                <>
                    <Box sx={userStyle.container}>
                        <Grid item xs={8}>
                            <Typography sx={{ ...userStyle.importHeaderText, fontWeight: 700, marginBottom: "10px" }}> Current Non Production List</Typography>
                        </Grid>

                        <Grid container style={userStyle.dataTablestyle}>
                            <Grid item md={2} xs={12} sm={12}>
                                <Box>
                                    <label>Show entries:</label>
                                    <Select
                                        id="pageSizeSelectNonProd"
                                        value={pageSizeNonProd}
                                        MenuProps={{
                                            PaperProps: {
                                                style: {
                                                    maxHeight: 180,
                                                    width: 80,
                                                },
                                            },
                                        }}
                                        onChange={handlePageSizeChangeNonProd}
                                        sx={{ width: "77px" }}
                                    >
                                        <MenuItem value={1}>1</MenuItem>
                                        <MenuItem value={5}>5</MenuItem>
                                        <MenuItem value={10}>10</MenuItem>
                                        <MenuItem value={25}>25</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
                                        <MenuItem value={100}>100</MenuItem>
                                        <MenuItem value={employeePointsNonProd?.length}>All</MenuItem>
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Box>
                                    {isUserRoleCompare?.includes("excelemployeepoints") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpenNonProd(true)

                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvemployeepoints") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpenNonProd(true);
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printemployeepoints") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprintNonProd}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfemployeepoints") && (
                                        <>
                                            <Button sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpenNonProd(true)

                                                }}
                                            ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imageemployeepoints") && (
                                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImageNonProd}>
                                            {" "}
                                            <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                                        </Button>
                                    )}
                                </Box>
                            </Grid>
                            <Grid item md={2} xs={6} sm={6}>
                                <Box>
                                    <FormControl fullWidth size="small">
                                        <Typography>Search</Typography>
                                        <OutlinedInput id="component-outlined" type="text" value={searchQueryNonProd} onChange={handleSearchChangeNonProd} />
                                    </FormControl>
                                </Box>
                            </Grid>
                        </Grid>
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumnsNonProd}>
                            Show All Columns
                        </Button>
                        &ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsNonProd}>
                            Manage Columns
                        </Button>

                        {/* Manage Column */}
                        <Popover
                            id={idNonProd}
                            open={isManageColumnsOpenNonProd}
                            anchorEl={anchorElNonProd}
                            onClose={handleCloseManageColumnsNonProd}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                            }}
                        >
                            {manageColumnsContentNonProd}
                        </Popover>

                        {isEmpCheckNonProd ? (
                            <>
                                <Box sx={{ display: "flex", justifyContent: "center" }}>
                                    {/* <CircularProgress color="inherit" />  */}
                                    <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                                </Box>
                            </>
                        ) : (
                            <>
                                <Box
                                    style={{
                                        width: "100%",
                                        overflowY: "hidden", // Hide the y-axis scrollbar
                                        marginTop: "10px"
                                    }}
                                >
                                    <CustomStyledDataGrid
                                        // onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
                                        rows={rowDataTableNonProd}
                                        columns={columnDataTableNonProd.filter((column) => columnVisibilityNonProd[column.field])}

                                        autoHeight={true}
                                        ref={gridRefNonProd}
                                        density="compact"
                                        hideFooter
                                        rowHeight={60}
                                        // getRowClassName={getRowClassNameNonProd}
                                        disableRowSelectionOnClick
                                    />
                                </Box>
                                <Box style={userStyle.dataTablestyle}>
                                    <Box>
                                        Showing {filteredDataNonProd.length > 0 ? (pageNonProd - 1) * pageSizeNonProd + 1 : 0} to {Math.min(pageNonProd * pageSizeNonProd, filteredDatasNonProd.length)} of {filteredDatasNonProd.length} entries
                                    </Box>
                                    <Box>
                                        <Button onClick={() => setPageNonProd(1)} disabled={pageNonProd === 1} sx={userStyle.paginationbtn}>
                                            <FirstPageIcon />
                                        </Button>
                                        <Button onClick={() => handlePageChangeNonProd(pageNonProd - 1)} disabled={pageNonProd === 1} sx={userStyle.paginationbtn}>
                                            <NavigateBeforeIcon />
                                        </Button>
                                        {pageNumbersNonProd?.map((pageNumberNonProd) => (
                                            <Button key={pageNumberNonProd} sx={userStyle.paginationbtn} onClick={() => handlePageChangeNonProd(pageNumberNonProd)} className={pageNonProd === pageNumberNonProd ? "active" : ""} disabled={pageNonProd === pageNumberNonProd}>
                                                {pageNumberNonProd}
                                            </Button>
                                        ))}
                                        {lastVisiblePageNonProd < totalPagesNonProd && <span>...</span>}
                                        <Button onClick={() => handlePageChangeNonProd(pageNonProd + 1)} disabled={pageNonProd === totalPagesNonProd} sx={userStyle.paginationbtn}>
                                            <NavigateNextIcon />
                                        </Button>
                                        <Button onClick={() => setPageNonProd(totalPagesNonProd)} disabled={pageNonProd === totalPagesNonProd} sx={userStyle.paginationbtn}>
                                            <LastPageIcon />
                                        </Button>
                                    </Box>
                                </Box>
                            </>
                        )}
                    </Box>
                </>
            )}



            <Dialog open={isViewDialog} onClose={handleViewDialogClose} aria-labelledby="alert-dialog-title" maxWidth="1400px" fullWidth={true} aria-describedby="alert-dialog-description">
                <DialogContent sx={{ padding: "20px" }}>
                    <Typography variant="h6">{"View List"}</Typography>
                    <Grid container style={userStyle.dataTablestyle}>
                        <Grid item md={2} xs={12} sm={12}>
                            <Box>
                                <label>Show entries:</label>
                                <Select
                                    id="pageSizeViewSelect"
                                    size="small"
                                    value={pageSizeView}
                                    MenuProps={{
                                        PaperProps: {
                                            style: {
                                                maxHeight: 180,
                                                width: 80,
                                            },
                                        },
                                    }}
                                    onChange={handlePageSizeChangeView}
                                    sx={{ width: "77px" }}
                                >
                                    <MenuItem value={1}>1</MenuItem>
                                    <MenuItem value={5}>5</MenuItem>
                                    <MenuItem value={10}>10</MenuItem>
                                    <MenuItem value={25}>25</MenuItem>
                                    <MenuItem value={50}>50</MenuItem>
                                    <MenuItem value={100}>100</MenuItem>
                                    <MenuItem value={viewData?.length}>All</MenuItem>
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
                                {isUserRoleCompare?.includes("excelproductionday") && (

                                    <>
                                        <Button onClick={(e) => {
                                            setIsFilterOpenView(true);
                                            setFormat("xl");
                                        }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                    </>


                                )}
                                {isUserRoleCompare?.includes("csvproductionday") && (

                                    <>
                                        <Button onClick={(e) => {
                                            setIsFilterOpenView(true);
                                            setFormat("csv")
                                        }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                                    </>
                                )}
                                {isUserRoleCompare?.includes("printproductionday") && (
                                    <>
                                        <Button sx={userStyle.buttongrp} onClick={handleprintView}>
                                            &ensp;
                                            <FaPrint />
                                            &ensp;Print&ensp;
                                        </Button>
                                    </>
                                )}
                                {isUserRoleCompare?.includes("pdfproductionday") && (
                                    // <>
                                    //   <Button sx={userStyle.buttongrp} onClick={() => downloadPdfView()}>
                                    //     <FaFilePdf />
                                    //     &ensp;Export to PDF&ensp;
                                    //   </Button>
                                    // </>
                                    <>
                                        <Button sx={userStyle.buttongrp}
                                            onClick={() => {
                                                setIsPdfFilterOpenView(true)

                                            }}
                                        ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                    </>
                                )}
                                {isUserRoleCompare?.includes("imageproductionday") && (
                                    <>
                                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImageView}>
                                            {" "}
                                            <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                                        </Button>
                                    </>
                                )}
                            </Box>
                        </Grid>
                        <Grid item md={2} xs={6} sm={6}>
                            <Box>
                                <FormControl fullWidth size="small">
                                    <Typography>Search</Typography>
                                    <OutlinedInput id="component-outlined" type="text" value={searchQueryView} onChange={handleSearchChangeView} />
                                </FormControl>
                            </Box>
                        </Grid>
                    </Grid>
                    <br />
                    <Button sx={userStyle.buttongrp} onClick={handleShowAllColumnsView}>
                        Show All Columns
                    </Button>
                    &ensp;
                    <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsView}>
                        Manage Columns
                    </Button>
                    &ensp;
                    <br />
                    <br />
                    {/* Manage Column */}
                    <Popover
                        id={id}
                        open={isManageColumnsOpenView}
                        anchorEl={anchorEl}
                        onClose={handleCloseManageColumnsView}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "left",
                        }}
                    >
                        {manageColumnsContentView}
                    </Popover>
                    {isCheckView ? (
                        <>
                            <Box sx={{ display: "flex", justifyContent: "center" }}>
                                {/* <CircularProgress color="inherit" />  */}
                                <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                            </Box>
                        </>
                    ) : (
                        <>
                            <Box
                                style={{
                                    width: "100%",
                                    overflowY: "hidden", // Hide the y-axis scrollbar
                                }}
                            >
                                <StyledDataGrid
                                    // onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
                                    ref={gridRefView}
                                    rows={rowDataTableView}
                                    columns={columnDataTableView.filter((column) => columnVisibilityView[column.field])}
                                    // onSelectionModelChange={handleSelectionChange}
                                    autoHeight={true}
                                    density="compact"
                                    hideFooter
                                    getRowClassName={getRowClassName}
                                    disableRowSelectionOnClick
                                />
                            </Box>

                            <Box style={userStyle.dataTablestyle}>
                                <Box>
                                    Showing {filteredDataView.length > 0 ? (pageView - 1) * pageSizeView + 1 : 0} to {Math.min(pageView * pageSizeView, filteredDatasView.length)} of {filteredDatasView.length} entries
                                </Box>
                                <Box>
                                    <Button onClick={() => setPageView(1)} disabled={pageView === 1} sx={userStyle.paginationbtn}>
                                        <FirstPageIcon />
                                    </Button>
                                    <Button onClick={() => handlePageChangeView(pageView - 1)} disabled={pageView === 1} sx={userStyle.paginationbtn}>
                                        <NavigateBeforeIcon />
                                    </Button>
                                    {pageNumbersView?.map((pageViewNumberView) => (
                                        <Button key={pageViewNumberView} sx={userStyle.paginationbtn} onClick={() => handlePageChangeView(pageViewNumberView)} className={pageView === pageViewNumberView ? "active" : ""} disabled={pageView === pageViewNumberView}>
                                            {pageViewNumberView}
                                        </Button>
                                    ))}
                                    {lastVisiblePageView < totalPagesView && <span>...</span>}
                                    <Button onClick={() => handlePageChangeView(pageView + 1)} disabled={pageView === totalPagesView} sx={userStyle.paginationbtn}>
                                        <NavigateNextIcon />
                                    </Button>
                                    <Button onClick={() => setPageView(totalPagesView)} disabled={pageView === totalPagesView} sx={userStyle.paginationbtn}>
                                        <LastPageIcon />
                                    </Button>
                                </Box>
                            </Box>
                        </>
                    )}
                    <Box sx={{ display: "flex", justifyContent: "end" }}>
                        <Button variant="contained" color="error" onClick={handleViewDialogClose}>
                            Close
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>


            {/* PRINT PDF EXCEL CSV */}
            <ExportData
                isFilterOpen={isFilterOpen}
                handleCloseFilterMod={handleCloseFilterMod}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpen}
                isPdfFilterOpen={isPdfFilterOpen}
                setIsPdfFilterOpen={setIsPdfFilterOpen}
                handleClosePdfFilterMod={handleClosePdfFilterMod}
                filteredDataTwo={rowDataTable ?? []}
                itemsTwo={items ?? []}
                filename={"Production Month List"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            {/* PRINT PDF EXCEL CSV */}
            <ExportDataDay
                isFilterOpen={isFilterOpenDay}
                handleCloseFilterMod={handleCloseFilterModDay}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpenDay}
                isPdfFilterOpen={isPdfFilterOpenDay}
                setIsPdfFilterOpen={setIsPdfFilterOpenDay}
                handleClosePdfFilterMod={handleClosePdfFilterModDay}
                filteredDataTwo={rowDataTableDay ?? []}
                itemsTwo={itemsDay ?? []}
                filename={"Day Production List"}
                exportColumnNames={exportColumnNamesDay}
                exportRowValues={exportRowValuesDay}
                componentRef={componentRefDay}
            />
            {/* PRINT PDF EXCEL CSV */}
            <ExportDataCategory
                isFilterOpen={isFilterOpenCategory}
                handleCloseFilterMod={handleCloseFilterModCategory}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpenCategory}
                isPdfFilterOpen={isPdfFilterOpenCategory}
                setIsPdfFilterOpen={setIsPdfFilterOpenCategory}
                handleClosePdfFilterMod={handleClosePdfFilterModCategory}
                filteredDataTwo={rowDataTableCategory ?? []}
                itemsTwo={itemsCategory ?? []}
                filename={"Current Production List"}
                exportColumnNames={exportColumnNamesCategory}
                exportRowValues={exportRowValuesCategory}
                componentRef={componentRefCategory}
            />
            <ExportDataNonProd
                isFilterOpen={isFilterOpenNonProd}
                handleCloseFilterMod={handleCloseFilterModNonProd}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpenNonProd}
                isPdfFilterOpen={isPdfFilterOpenNonProd}
                setIsPdfFilterOpen={setIsPdfFilterOpenNonProd}
                handleClosePdfFilterMod={handleClosePdfFilterModNonProd}
                filteredDataTwo={rowDataTableNonProd ?? []}
                itemsTwo={itemsNonProd ?? []}
                filename={"Current Non Production List"}
                exportColumnNames={exportColumnNamesNonProd}
                exportRowValues={exportRowValuesNonProd}
                componentRef={componentRefNonProd}
            />

            <ExportDataView
                isFilterOpen={isFilterOpenView}
                handleCloseFilterMod={handleCloseFilterModView}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpenView}
                isPdfFilterOpen={isPdfFilterOpenView}
                setIsPdfFilterOpen={setIsPdfFilterOpenView}
                handleClosePdfFilterMod={handleClosePdfFilterModView}
                filteredDataTwo={rowDataTableView ?? []}
                itemsTwo={itemsView ?? []}
                filename={"Current Production List"}
                exportColumnNames={exportColumnNamesView}
                exportRowValues={exportRowValuesView}
                componentRef={componentRefView}
            />
        </Box>
    );
}

export default EmployeePoints;