import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, OutlinedInput, TableBody, TableRow, TableCell, Select, Paper, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton, FormControlLabel } from "@mui/material";
import { userStyle, colourStyles } from "../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { AuthContext } from "../../context/Appcontext";
import { UserRoleAccessContext } from "../../context/Appcontext";
import { handleApiError } from "../../components/Errorhandling";
import StyledDataGrid from "../../components/TableStyle";
import Headtitle from "../../components/Headtitle";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import Selects from "react-select";
import { saveAs } from "file-saver";

import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Pagination from '../../components/Pagination';

const Loader = ({ loading, message }) => {
    return (
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
            <div style={{ textAlign: 'center' }}>
                <CircularProgress sx={{ color: '#edf1f7' }} />
                <Typography variant="h6" sx={{ mt: 2, color: '#edf1f7' }}>
                    {message}
                </Typography>
            </div>
        </Backdrop>
    );
};

function DepartmentMonthSetAuto() {

    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('Please Wait...!');

    let today = new Date();
    var yyyy = today.getFullYear();
    const years = [];
    for (let year = yyyy; year >= 1977; year--) {
        years.push({ value: year, label: year.toString() });
    }

    // department month set
    const [departmentset, setDepartmentSet] = useState({
        department: "Select Department",
        year: "", startdate: "", salary: false, proftaxstop: false, penalty: false, esistop: false, pfstop: false
        //  month: "Please Select Month", days: "Please Select Days"
    });
    const [deptmonthsets, setDeptmonthsets] = useState([])
    const [selectedYear, setSelectedYear] = useState("Select Year");

    const gridRef = useRef(null);

    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [branchOption, setBranchOption] = useState([]);
    const [holidayArray, setHolidayArray] = useState([]);
    const { isUserRoleCompare, isUserRoleAccess } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    const [statusCheck, setStatusCheck] = useState(false);
    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const [openview, setOpenview] = useState(false);
    const [openInfo, setOpeninfo] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [holidayData, setHolidayData] = useState([]);
    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [allStatusEdit, setAllStatusEdit] = useState([]);
    const [copiedData, setCopiedData] = useState("");

    //Delete model
    const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

    const handleClickOpenalert = () => {
        if (selectedRows.length === 0) {
            setIsDeleteOpenalert(true);
        } else {
            setIsDeleteOpencheckbox(true);
        }
    };
    const handleCloseModalert = () => {
        setIsDeleteOpenalert(false);
    };

    //Delete model
    const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);

    const handleClickOpencheckbox = () => {
        setIsDeleteOpencheckbox(true);
    };
    const handleCloseModcheckbox = () => {
        setIsDeleteOpencheckbox(false);
    };

    // Manage Columns
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        department: true,
        year: true,
        // month: true,
        // days: true,
        startdate: true,
        salary: true,
        proftaxstop: true,
        penalty: true,
        esistop: true,
        pfstop: true,
        actions: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);
    const [selectAllChecked, setSelectAllChecked] = useState(false);


    const [singleDepMonth, setSingleMonthSet] = useState({});
    const [departmentNames, setDeparmentNames] = useState([]);

    const [selectedMonth, setSelectedMonth] = useState("");
    const [selectmonthname, setSelectMonthName] = useState("Select Month");
    const [selectedDate, setSelectedDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [totalDays, setTotalDays] = useState(null);
    const [alldepartmentSet, setAllDepartmentSet] = useState([]);
    const [departmentSetCompare, setDepartmentSetCompare] = useState([]);

    // edit states
    const [selectedYearEdit, setSelectedYearEdit] = useState("");
    const [selectedMonthEdit, setSelectedMonthEdit] = useState("");
    const [selectmonthnameEdit, setSelectMonthNameEdit] = useState("");
    const [selectedDateEdit, setSelectedDateEdit] = useState("");
    const [toDateEdit, setToDateEdit] = useState("");
    const [totalDaysEdit, setTotalDaysEdit] = useState(null);
    const [selectDepartment, setSelectDepartment] = useState("");

    const handleYearChange = (event) => {
        setSelectedYear(event.value);
        updateDateValue(event.value, selectedMonth);
    };


    const updateDateValue = (year, month) => {
        const currentDate = new Date();
        const monthShow = currentDate.getMonth();
        currentDate.setFullYear(year);
        currentDate.setMonth(month === "" ? monthShow : month - 1);
        currentDate.setDate(1);

        const selectedDate = currentDate.toISOString().split("T")[0];

        // Set selected month, previous month, and next month
        const previousMonth = new Date(currentDate);
        previousMonth.setMonth(currentDate.getMonth() - 1);

        const nextMonth = new Date(currentDate);
        nextMonth.setMonth(currentDate.getMonth() + 1);

        const minimumDate = previousMonth.toISOString().split("T")[0];
        const maxSet = nextMonth.toISOString().split("T")[0];

        // Update your UI or other logic as needed
        const dateFromInput = document.getElementById("datefrom");
        const dateToDate = document.getElementById("todate");

        if (dateFromInput) {
            dateFromInput.min = minimumDate;
            dateFromInput.max = maxSet;
        }

        if (dateToDate) {
            dateToDate.min = minimumDate;
            dateToDate.max = maxSet;
        }


    };

    const updateDateValueEdit = (year, month) => {
        const monthNumber = month || new Date().getMonth() + 1;
        const currentDate = new Date();

        currentDate.setFullYear(year);
        currentDate.setMonth(monthNumber - 1);
        currentDate.setDate(1);

        const selectedDateEdit = currentDate.toISOString().split("T")[0];

        // Calculate the last day of the current month
        const lastDayOfMonth = new Date(year, monthNumber, 0).getDate();

        const toDateFormat = new Date(currentDate);
        toDateFormat.setMonth(toDateFormat.getMonth() + 1);
        toDateFormat.setDate(lastDayOfMonth);
        const toDateEdit = toDateFormat.toISOString().split("T")[0];

        setSelectedDateEdit(selectedDateEdit);
        setToDateEdit(toDateEdit);

        // Minimum and Maximum date setting
        const previousMonthLastDay = new Date(year, monthNumber - 1, 0).getDate();
        const minimumDate = new Date(year, monthNumber - 1, 1).toISOString().split("T")[0];
        const maxSet = new Date(year, monthNumber - 1, previousMonthLastDay).toISOString().split("T")[0];

        const dateFromInput = document.getElementById("datefromEdit");
        const dateToDate = document.getElementById("todateEdit");

        if (dateFromInput) {
            dateFromInput.min = minimumDate;
            dateFromInput.max = maxSet;
        }

        if (dateToDate) {
            dateToDate.min = minimumDate;
            dateToDate.max = maxSet;
        }
    };

    useEffect(() => {
        fetchDepartmentSet();
    }, [page, pageSize, searchQuery]);

    useEffect(() => {
        getexcelDatas();
    }, [alldepartmentSet]);

    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        };
    }, []);
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

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };
    // Error Popup model
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };
    // view model
    const handleClickOpenview = () => {
        setOpenview(true);
    };
    const handleCloseview = () => {
        setOpenview(false);
    };
    // info model
    const handleClickOpeninfo = () => {
        setOpeninfo(true);
    };
    const handleCloseinfo = () => {
        setOpeninfo(false);
    };
    //Delete model
    const handleClickOpen = () => {
        setIsDeleteOpen(true);
    };
    const handleCloseMod = () => {
        setIsDeleteOpen(false);
    };
    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
    };
    const username = isUserRoleAccess.username;
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
    
    const [filteredyear, setFilteredyear] = useState([])
    //set function to get particular row
    const rowData = async (id, year, dept) => {
        try {
            let res = await axios.get(`${SERVICE.DEPMONTHSETAUTO_SINGLE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            setSingleMonthSet(res?.data?.sdeptmonthsetauto);
            let filtereddept = deptmonthsets.filter(item => item.year == year && item.department == dept)
            setFilteredyear(filtereddept)
            handleClickOpen();
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };
    // Alert delete popup
    let holidayid = singleDepMonth._id;

    const delHoliday = async (holidayid) => {
        try {
            await axios.delete(`${SERVICE.DEPMONTHSETAUTO_SINGLE}/${holidayid}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            const deletePromises = filteredyear?.map((item) => {
                return axios.delete(`${SERVICE.DEPMONTHSET_SINGLE}/${item._id}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });
            });

            // Wait for all delete requests to complete
            await Promise.all(deletePromises);

            await fetchDepartmentSet();
            handleCloseMod();
            setSelectedRows([]);
            setPage(1);
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Deleted Successfully"}
                    </p>
                </>
            );
            handleClickOpenerr();
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const delDeptmentcheckbox = async () => {
        try {
            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.DEPMONTHSETAUTO_SINGLE}/${item}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });
            });

            // Wait for all delete requests to complete
            await Promise.all(deletePromises);

            handleCloseModcheckbox();
            setSelectedRows([]);
            setSelectAllChecked(false);
            setPage(1);

            await fetchDepartmentSet();
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    function getDaysInMonth(month, year) {
        return new Date(year, month + 1, 0).getDate();
    }

    const startYear = selectedYear;
    const endYear = yyyy

    let monthsarray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    let result = [];

    for (let year = startYear; year <= endYear; year++) {
        let results = monthsarray.map((month, index) => {
            return {
                month: month,
                days: getDaysInMonth(index, year),
            };
        });
        result.push({ year: year, data: results });

    }

    const resultarrayval = [];
    if (departmentset.startdate) {


        let currentDate = new Date(departmentset.startdate);

        for (const yearData of result) {
            const year = yearData.year;
            const months = yearData.data;

            for (const monthData of months) {
                const month = monthData.month;
                const days = monthData.days;

                const endDate = new Date(currentDate);
                endDate.setDate(currentDate.getDate() + days - 1); // Calculate end date based on start date and days count

                resultarrayval.push({
                    year: year,
                    month: month,
                    days: days,
                    startdate: currentDate.toISOString().split('T')[0],
                    todate: endDate.toISOString().split('T')[0]
                });

                currentDate = new Date(endDate);
                currentDate.setDate(currentDate.getDate() + 1); // Move to the next month
            }
        }
    }
    let deptdecember = deptmonthsets.filter(item => item.monthname === "December")


    // Initialize result array
    let resultarrayvalStartdates = [];

    // Loop over start dates
    for (const { todate, department } of deptdecember) {
        let currentDate = new Date(todate);
        currentDate.setDate(currentDate.getDate() + 1); // Get the next day of the previous month's todate

        let resultarrayval = [];

        for (let i = 0; i < result.length; i++) {
            let month = result[i].month;
            let days = result[i].days;

            let todate;

            if (i === 0) {
                // For January, use the specified start date
                todate = new Date(currentDate);
                todate.setDate(todate.getDate() + days - 1); // -1 because we want the last day of the month
            } else {
                let beforemonthtodate = new Date(resultarrayval[i - 1].todate); // Get the previous month's todate
                beforemonthtodate.setDate(beforemonthtodate.getDate() + 1); // Get the next day of the previous month's todate
                currentDate = new Date(beforemonthtodate); // Set currentDate to the next day
                todate = new Date(currentDate);
                todate.setDate(todate.getDate() + days - 1); // Calculate the end date
            }

            let totaldays = Math.ceil((todate - currentDate) / (1000 * 60 * 60 * 24)) + 1;

            resultarrayval.push({
                department: department,
                month: month,
                days: days,
                startdate: `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`,
                todate: `${todate.getFullYear()}-${(todate.getMonth() + 1).toString().padStart(2, '0')}-${todate.getDate().toString().padStart(2, '0')}`,
                totaldays: totaldays
            });

            // Move to the next month's start date
            currentDate.setDate(currentDate.getDate() + 1);
        }

        // Push result array for the current department
        resultarrayvalStartdates = resultarrayvalStartdates.concat(resultarrayval);
    }



    //add function
    const sendRequest = async () => {
        try {

            let createauto = await axios.post(SERVICE.DEPMONTHSETAUTO_CREATE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                department: String(departmentset.department),
                year: String(selectedYear),
                startdate: String(departmentset.startdate),
                salary: String(departmentset.salary),
                proftaxstop: String(departmentset.proftaxstop),
                penalty: String(departmentset.penalty),
                esistop: String(departmentset.esistop),
                pfstop: String(departmentset.pfstop),
                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            await Promise.all(resultarrayval.map(async (item, index) => {
                await axios.post(SERVICE.DEPMONTHSET_CREATE, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    department: String(departmentset.department),
                    year: String(item.year),
                    startdate: String(departmentset.startdate),
                    salary: String(departmentset.salary),
                    proftaxstop: String(departmentset.proftaxstop),
                    penalty: String(departmentset.penalty),
                    esistop: String(departmentset.esistop),
                    pfstop: String(departmentset.pfstop),
                    fromdate: String(item.startdate),
                    todate: String(item.todate),
                    monthname: String(item.month),
                    totaldays: String(item.days),
                    month: String(index + 1),
                    addedby: [
                        {
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),
                        },
                    ],
                });
            }));

            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Added Successfully"}</p>
                </>
            );
            handleClickOpenerr();
            fetchDepartmentSet();
            setDepartmentSet({ ...departmentset, startdate: "", salary: false, proftaxstop: false, penalty: false, esistop: false, pfstop: false });
            setSelectedYear("Select Year");
            setSelectedDate("");
            setToDate("");
            setTotalDays("");
            updateDateValue("", "");
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Added Successfully"}
                    </p>
                </>
            );
            handleClickOpenerr();
        } catch (err) {fetchDepartmentSet();handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const fetchDepartmentSetall = async () => {
        try {
            let res_status = await axios.get(SERVICE.DEPMONTHSET_ALL, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            setDeptmonthsets(res_status.data.departmentdetails);
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    useEffect(() => {
        fetchDepartmentSetall()
    }, [])


    //submit option for saving
    const handleSubmit = (e) => {
        e.preventDefault();

        let [, splitmonth] = departmentset.startdate.split("-")

        if (departmentset.department === "Select Department") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Department"}</p>
                </>
            );
            handleClickOpenerr();
        } else if (selectedYear === "Select Year") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Year"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (departmentset.startdate === "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Startdate"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (splitmonth !== "01" && splitmonth !== "12") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Choose Start Date December or January Month"}</p>
                </>
            );
            handleClickOpenerr();
        }

        else {
            sendRequest();
        }
    };
    const handleclear = (e) => {
        e.preventDefault();
        setDepartmentSet({
            ...departmentset, department: "Select Department",
            year: "", startdate: "", salary: false, proftaxstop: false, penalty: false, esistop: false, pfstop: false
            //  month: "Please Select Month", days: "Please Select Days"
        });
        setSelectedYear("Select Year");
        setShowAlert(
            <>
                <ErrorOutlineOutlinedIcon
                    sx={{ fontSize: "100px", color: "orange" }}
                />
                <p style={{ fontSize: "20px", fontWeight: 900 }}>
                    {"Cleared Successfully"}
                </p>
            </>
        );
        handleClickOpenerr();
    };
    //Edit model...
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpen(false);
    };

    // get single row to view....
    const getviewCode = async (e) => {
        try {
            let res = await axios.get(`${SERVICE.DEPMONTHSETAUTO_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setSingleMonthSet(res?.data?.sdeptmonthsetauto);
            handleClickOpenview();
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };
    // get single row to view....
    const getinfoCode = async (e) => {
        try {
            let res = await axios.get(`${SERVICE.DEPMONTHSETAUTO_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setSingleMonthSet(res?.data?.sdeptmonthsetauto);
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };
    // updateby edit page...
    let updateby = singleDepMonth.updatedby;
    let addedby = singleDepMonth.addedby;
    let holidayId = singleDepMonth._id;

    //editing the single data...
    const sendEditRequest = async () => {
        try {
            let res = await axios.put(`${SERVICE.DEPMONTHSETAUTO_SINGLE}/${holidayId}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                department: String(singleDepMonth.department),
                year: String(selectedYearEdit),
               
                startdate: String(singleDepMonth.startdate),
                salary: String(singleDepMonth.salary),
                proftaxstop: String(singleDepMonth.proftaxstop),
                penalty: String(singleDepMonth.penalty),
                esistop: String(singleDepMonth.esistop),
                pfstop: String(singleDepMonth.pfstop),
                updatedby: [
                    ...updateby,
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            await fetchDepartmentSet();
            handleCloseModEdit();
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Updated Successfully"}
                    </p>
                </>
            );
            handleClickOpenerr();
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const [totalPages, setTotalPages] = useState(0);
    const [totalDatas, setTotalDatas] = useState(0);

    //get all data.
    const fetchDepartmentSet = async () => {
        try {
            let res_status = await axios.post(SERVICE.GETDEPARTMENTMONTHSETAUTOBYPAGINATION, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                page: Number(page),
                pageSize: Number(pageSize),
                searchQuery: searchQuery
            });
            setStatusCheck(true);

            const ans = res_status?.data?.deptmonthsetauto?.length > 0 ? res_status?.data?.result : []

            const itemsWithSerialNumber = ans?.map((item, index) => ({
                ...item,
                serialNumber: (page - 1) * pageSize + index + 1,
                startdate: moment(item.startdate).format("DD-MM-YYYY"),
                salary: item.salary ? "YES" : "NO",
                proftaxstop: item.proftaxstop ? "YES" : "NO",
                penalty: item.penalty ? "YES" : "NO",
                esistop: item.esistop ? "YES" : "NO",
                pfstop: item.pfstop ? "YES" : "NO",

            }));

            setTotalDatas(ans?.length > 0 ? res_status?.data?.totalDatas : 0);

            setTotalPages(ans?.length > 0 ? res_status?.data?.totalPages : 0);

            setPageSize((data) => { return ans?.length > 0 ? data : 10 });
            setPage((data) => { return ans?.length > 0 ? data : 1 });

            setAllDepartmentSet(itemsWithSerialNumber);
            setDepartmentSetCompare(itemsWithSerialNumber);
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    //get all data.
    const fetchDepartmentNames = async () => {
        try {
            let res_status = await axios.get(SERVICE.DEPARTMENT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let dep_datas = res_status.data.departmentdetails
                .map((data) => data.deptname)
                .map((d) => ({
                    ...d,
                    label: d,
                    value: d,
                }));
            setDeparmentNames(dep_datas);
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };
    useEffect(() => {
        fetchDepartmentNames();
    }, []);

    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "DepartmentMonthSet.png");
                });
            });
        }
    };

    //------------------------------------------------------

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };

    const [fileFormat, setFormat] = useState("xl");
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = fileFormat === "xl" ? ".xlsx" : ".csv";

    const exportToExcel = (excelData, fileName) => {
        try {
            const ws = XLSX.utils.json_to_sheet(excelData);
            const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

            // Check if the browser supports Blob and FileSaver
            if (!Blob || !FileSaver) {
                console.error('Blob or FileSaver not supported');
                return;
            }

            const data = new Blob([excelBuffer], { type: fileType });

            // Check if FileSaver.saveAs is available
            if (!FileSaver.saveAs) {
                console.error('FileSaver.saveAs is not available');
                return;
            }

            FileSaver.saveAs(data, fileName + fileExtension);
        } catch (error) {
            console.error('Error exporting to Excel', error);
        }
    };

    const formatData = (data) => {
        return data.map((item, index) => {
            return {
                Sno: index + 1,
                "Department": item.department || '',
                Year: item.year || '',

                Startdate: item.startdate || '',
                Salary: item.salary || '',
                "Prof-Tax-Stop": item.proftaxstop || '',
                Penalty: item.penalty || '',
                "Esi-Stop": item.esistop || '',
                "Pf-Stop": item.pfstop || '',

            };
        });
    };

    const handleExportXL = async (isfilter) => {
        setIsFilterOpen(false);
        setLoading(true);
        setLoadingMessage('Fetching data...');

        let overallDatas;

        if (isfilter !== "filtered") {
            try {
                const res = await axios.get(SERVICE.DEPMONTHSETAUTO_ALL, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });

                overallDatas = res?.data?.deptmonthsetauto?.map((item) => ({
                    ...item,
                    salary: item.salary ? "YES" : "NO",
                    proftaxstop: item.proftaxstop ? "YES" : "NO",
                    penalty: item.penalty ? "YES" : "NO",
                    esistop: item.esistop ? "YES" : "NO",
                    pfstop: item.pfstop ? "YES" : "NO",
                    startdate: moment(item.startdate).format("DD-MM-YYYY"),

                }));
            } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
        }

        setLoadingMessage('Preparing data for export...');

        const dataToExport = isfilter === "filtered" ? filteredDatas : overallDatas;

        if (!dataToExport || dataToExport.length === 0) {
            console.error('No data available to export');
            setLoading(false);
            return;
        }

        exportToExcel(formatData(dataToExport), 'DepartmentMonthSet Auto');

        setLoading(false);
    };

    // pdf.....
    const columns = [
        { title: "Department ", field: "department" },
        { title: "Year ", field: "year" },
        { title: "Startdate ", field: "startdate" },
        { title: "salary ", field: "salary" },
        { title: "proftaxstop ", field: "proftaxstop" },
        { title: "penalty ", field: "penalty" },
        { title: "esistop ", field: "esistop" },
        { title: "pfstop ", field: "pfstop" }

    ];

    const downloadPdf = async (isfilter) => {
        setLoading(true);
        setLoadingMessage('Fetching data...');

        let overallDatas;

        if (isfilter !== "filtered") {
            try {
                const res = await axios.get(SERVICE.DEPMONTHSETAUTO_ALL, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });

                overallDatas = res?.data?.deptmonthsetauto?.map((item) => ({
                    ...item,
                    salary: item.salary ? "YES" : "NO",
                    proftaxstop: item.proftaxstop ? "YES" : "NO",
                    penalty: item.penalty ? "YES" : "NO",
                    esistop: item.esistop ? "YES" : "NO",
                    pfstop: item.pfstop ? "YES" : "NO",
                    startdate: moment(item.startdate).format("DD-MM-YYYY"),

                }));
            } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
        }

        const doc = new jsPDF();

        // Initialize serial number counter
        // Modify columns to include serial number column
        const columnsWithSerial = [
            { title: "S.No", dataKey: "serialNumber" }, // Serial number column
            ...columns.map((col) => ({ title: col.title, dataKey: col.field })),
        ];

        // Modify row data to include serial number
        const dataWithSerial =
            isfilter === "filtered"
                ? filteredDatas.map((t, index) => ({
                    ...t,
                    serialNumber: index + 1,

                }))
                : overallDatas?.map((item, index) => ({
                    ...item,
                    serialNumber: index + 1,


                }));

        setLoadingMessage('Preparing data for export...');

        // Generate PDF
        doc.autoTable({
            theme: "grid",
            columns: columnsWithSerial,
            body: dataWithSerial,
            styles: { fontSize: 5 },
        });

        doc.save("DepartmentMonthSet Auto.pdf");
        setLoading(false);
    };


    // get particular columns for export excel
    const getexcelDatas = () => {
            var data = alldepartmentSet.map((t, index) => ({
                Sno: index + 1,
                Department: t.department,
                Year: t.year,
                Month: t.month,
                Days: t.days,
            }));
            setHolidayData(data);
    };
    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "DepartmentMonthSet Auto",
        pageStyle: "print",
    });

    //Datatable
    const handlePageChange = (newPage) => {
        setPage(newPage);
        setSelectedRows([]);
        setSelectAllChecked(false);
        fetchDepartmentSet();
    };
    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setSelectedRows([]);
        setSelectAllChecked(false);
        setPage(1);
        fetchDepartmentSet();
    };
    //datatable....
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setPage(1);
    };
    // Split the search query into individual terms
    const searchOverAllTerms = searchQuery.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatas = alldepartmentSet?.filter((item) => {
        return searchOverAllTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
    });

    const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
        <div>
            <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
        </div>
    );
    const columnDataTable = [
        {
            field: "checkbox",
            headerName: "Checkbox", // Default header name
            headerStyle: {
                fontWeight: "bold", // Apply the font-weight style to make the header text bold
                // Add any other CSS styles as needed
            },
            renderHeader: (params) => (
                <CheckboxHeader
                    selectAllChecked={selectAllChecked}
                    onSelectAll={() => {
                        if (rowDataTable.length === 0) {
                            // Do not allow checking when there are no rows
                            return;
                        }
                        if (selectAllChecked) {
                            setSelectedRows([]);
                        } else {
                            const allRowIds = rowDataTable.map((row) => row.id);
                            setSelectedRows(allRowIds);
                        }
                        setSelectAllChecked(!selectAllChecked);
                    }}
                />
            ),
            renderCell: (params) => (
                <Checkbox
                    checked={selectedRows.includes(params.row.id)}
                    onChange={() => {
                        let updatedSelectedRows;
                        if (selectedRows.includes(params.row.id)) {
                            updatedSelectedRows = selectedRows.filter((selectedId) => selectedId !== params.row.id);
                        } else {
                            updatedSelectedRows = [...selectedRows, params.row.id];
                        }
                        setSelectedRows(updatedSelectedRows);
                        // Update the "Select All" checkbox based on whether all rows are selected
                        setSelectAllChecked(updatedSelectedRows.length === filteredDatas.length);
                    }}
                />
            ),
            sortable: false, // Optionally, you can make this column not sortable
            width: 70,
            hide: !columnVisibility.checkbox,
            headerClassName: "bold-header",
        },
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 80,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
        },
        { field: "department", headerName: "Department", flex: 0, width: 140, hide: !columnVisibility.department, headerClassName: "bold-header" },
        { field: "year", headerName: "Year", flex: 0, width: 90, hide: !columnVisibility.year, headerClassName: "bold-header" },
        // { field: "month", headerName: "Month", flex: 0, width: 100, hide: !columnVisibility.month, headerClassName: "bold-header" },
        // { field: "days", headerName: "Days", flex: 0, width: 100, hide: !columnVisibility.days, headerClassName: "bold-header" },
        { field: "startdate", headerName: "Startdate", flex: 0, width: 100, hide: !columnVisibility.startdate, headerClassName: "bold-header" },
        { field: "salary", headerName: "Salary", flex: 0, width: 100, hide: !columnVisibility.salary, headerClassName: "bold-header" },
        { field: "proftaxstop", headerName: "Prof-Tax-Stop", flex: 0, width: 130, hide: !columnVisibility.proftaxstop, headerClassName: "bold-header" },
        { field: "penalty", headerName: "Penalty", flex: 0, width: 100, hide: !columnVisibility.penalty, headerClassName: "bold-header" },
        { field: "esistop", headerName: "Esi-Stop", flex: 0, width: 100, hide: !columnVisibility.esistop, headerClassName: "bold-header" },
        { field: "pfstop", headerName: "Pf-Stop", flex: 0, width: 100, hide: !columnVisibility.pfstop, headerClassName: "bold-header" },

        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 250,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",
            renderCell: (params) => (
                <Grid sx={{ display: "flex" }}>
                    {isUserRoleCompare?.includes("ddepartmentmonthsetauto") && (
                        <Button
                            sx={userStyle.buttondelete}
                            onClick={(e) => {
                                rowData(params.row.id, params.row.year, params.row.department);
                            }}
                        >
                            <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
                        </Button>
                    )}
                    {/* {isUserRoleCompare?.includes("vdepartmentmonthsetauto") && ( */}
                    <Button
                        sx={userStyle.buttonedit}
                        onClick={() => {
                            getviewCode(params.row.id);
                        }}
                    >
                        <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
                    </Button>
                    {/* // )} */}
                    {/* // {isUserRoleCompare?.includes("idepartmentmonthsetauto") && ( */}
                    <Button
                        sx={userStyle.buttonedit}
                        onClick={() => {
                            handleClickOpeninfo();
                            getinfoCode(params.row.id);
                        }}
                    >
                        <InfoOutlinedIcon style={{ fontsize: "large" }} />
                    </Button>
                    {/* )} */}
                </Grid>
            ),
        },
    ];
    const rowDataTable = filteredDatas.map((item, index) => {
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            department: item.department,
            year: item.year,
            // month: item.month,
            // days: item.days,
            startdate: item.startdate,
            salary: item.salary,
            proftaxstop: item.proftaxstop ,
            penalty: item.penalty ,
            esistop: item.esistop ,
            pfstop: item.pfstop ,
        };
    });
    const rowsWithCheckboxes = rowDataTable.map((row) => ({
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
    // Function to filter columns based on search query
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
                            <ListItemText sx={{ display: "flex" }} primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibility[column.field]} onChange={() => toggleColumnVisibility(column.field)} />} secondary={column.field === "checkbox" ? "Checkbox" : column.headerName} />
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

    let [, splitmonth] = departmentset.startdate.split("-")

    return (
        <Box>
            <Headtitle title={"Department Month Set Auto"} />
            {/* ****** Header Content ****** */}
            <Typography sx={userStyle.HeaderText}>Department Month Set Auto</Typography>

            {/* {isUserRoleCompare?.includes("adepartmentmonthsetauto") && ( */}
            <Box sx={userStyle.selectcontainer}>
                <>
                    <Grid container spacing={2}>
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Add Department Month Set Auto</Typography>
                        </Grid>
                    </Grid>
                    <br />
                    <Grid container spacing={2}>
                        <Grid item md={4} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Typography>
                                    Department <b style={{ color: "red" }}>*</b>
                                </Typography>
                                <Selects
                                    options={departmentNames}
                                    styles={colourStyles}
                                    value={{ label: departmentset.department, value: departmentset.department }}
                                    onChange={(e) => {
                                        setDepartmentSet({ ...departmentset, department: e.value });
                                        setSelectDepartment(e.value);
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={4} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Typography>
                                    Year<b style={{ color: "red" }}>*</b>
                                </Typography>
                                <Selects options={years} styles={colourStyles} value={{ label: selectedYear, value: selectedYear }} onChange={handleYearChange} />
                            </FormControl>
                        </Grid>
                        <Grid item md={4} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography>
                                    Start Date<b style={{ color: "red" }}>*</b>
                                </Typography>
                                <OutlinedInput
                                    value={departmentset.startdate}
                                    type="date"
                                    onChange={(e) => {
                                        setDepartmentSet({ ...departmentset, startdate: e.target.value });
                                    }}
                                // id="datefrom"
                                />
                            </FormControl>
                        </Grid>

                        <Grid item md={4} xs={12} sm={6}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={Boolean(departmentset.salary)}
                                        onClick={(e) => {
                                            setDepartmentSet({ ...departmentset, salary: e.target.checked });
                                        }}
                                        sx={{ "& .MuiSvgIcon-root": { fontSize: "33px" } }}
                                    />
                                }
                                label="Salary"
                            />
                        </Grid>
                        <Grid item md={4} xs={12} sm={6}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={Boolean(departmentset.proftaxstop)}
                                        onClick={(e) => {
                                            setDepartmentSet({ ...departmentset, proftaxstop: e.target.checked });
                                        }}
                                        sx={{ "& .MuiSvgIcon-root": { fontSize: "33px" } }}
                                    />
                                }
                                label="Prof-Tax-Stop"
                            />
                        </Grid>
                        <Grid item md={4} xs={12} sm={6}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={Boolean(departmentset.penalty)}
                                        onClick={(e) => {
                                            setDepartmentSet({ ...departmentset, penalty: e.target.checked });
                                        }}
                                        sx={{ "& .MuiSvgIcon-root": { fontSize: "33px" } }}
                                    />
                                }
                                label="Penalty"
                            />
                        </Grid>
                        <Grid item md={4} xs={12} sm={6}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={Boolean(departmentset.esistop)}
                                        onClick={(e) => {
                                            setDepartmentSet({ ...departmentset, esistop: e.target.checked });
                                        }}
                                        sx={{ "& .MuiSvgIcon-root": { fontSize: "33px" } }}
                                    />
                                }
                                label="ESI-Stop"
                            />
                        </Grid>
                        <Grid item md={4} xs={12} sm={6}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={Boolean(departmentset.pfstop)}
                                        onClick={(e) => {
                                            setDepartmentSet({ ...departmentset, pfstop: e.target.checked });
                                        }}
                                        sx={{ "& .MuiSvgIcon-root": { fontSize: "33px" } }}
                                    />
                                }
                                label="PF-Stop"
                            />
                        </Grid>

                    </Grid>
                    <br />
                    <br />
                    <Grid container>
                        <Grid item md={3} xs={12} sm={6}>
                            <Button variant="contained" color="primary" onClick={handleSubmit}>
                                Submit
                            </Button>
                        </Grid>
                        <Grid item md={3} xs={12} sm={6}>
                            <Button sx={userStyle.btncancel} onClick={handleclear}>
                                Clear
                            </Button>
                        </Grid>
                    </Grid>
                </>
            </Box>
            {/* // )} */}
            <br />
            {/* ****** Table Start ****** */}
            {/* {isUserRoleCompare?.includes("ldepartmentmonthsetauto") && ( */}
            <>
                <Box sx={userStyle.container}>
                    <Grid item xs={8}>
                        <Typography sx={userStyle.importheadtext}>List Department Month Set Auto</Typography>
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
                                </Select>
                            </Box>
                        </Grid>
                        <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <Box>
                                {/* {isUserRoleCompare?.includes("exceldepartmentmonthsetauto") && ( */}
                                <>
                                    <Button
                                        onClick={(e) => {
                                            setIsFilterOpen(true);
                                            setFormat("xl");
                                        }}
                                        sx={userStyle.buttongrp}
                                    >
                                        <FaFileExcel />
                                        &ensp;Export to Excel&ensp;
                                    </Button>
                                </>
                                {/* )}
                                    {isUserRoleCompare?.includes("csvdepartmentmonthsetauto") && ( */}
                                <>
                                    <Button
                                        onClick={(e) => {
                                            setIsFilterOpen(true);
                                            setFormat("csv");
                                        }}
                                        sx={userStyle.buttongrp}
                                    >
                                        <FaFileCsv />
                                        &ensp;Export to CSV&ensp;
                                    </Button>
                                </>
                                {/* )}
                                    {isUserRoleCompare?.includes("printdepartmentmonthsetauto") && ( */}
                                <>
                                    <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                        &ensp;
                                        <FaPrint />
                                        &ensp;Print&ensp;
                                    </Button>
                                </>
                                {/* )}
                                    {isUserRoleCompare?.includes("pdfdepartmentmonthsetauto") && ( */}
                                <>
                                    <Button
                                        sx={userStyle.buttongrp}
                                        onClick={() => {
                                            setIsPdfFilterOpen(true);
                                        }}
                                    >
                                        <FaFilePdf />
                                        &ensp;Export to PDF&ensp;
                                    </Button>
                                </>
                                {/* )}
                                    {isUserRoleCompare?.includes("imagedepartmentmonthsetauto") && ( */}
                                <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                                    {" "}
                                    <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                                </Button>
                                {/* )} */}
                            </Box>
                        </Grid>
                        <Grid item md={2} xs={12} sm={12}>
                            <Box>
                                <FormControl fullWidth size="small">
                                    <Typography>Search</Typography>
                                    <OutlinedInput id="component-outlined" type="text" value={searchQuery} onChange={handleSearchChange} />
                                </FormControl>
                            </Box>
                        </Grid>
                    </Grid>
                    <br />
                    <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
                        Show All Columns
                    </Button>
                    &ensp;
                    <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
                        Manage Columns
                    </Button>
                    &ensp;
                    <br />
                    <br />
                    <Box
                        style={{
                            width: "100%",
                            overflowY: "hidden", // Hide the y-axis scrollbar
                        }}
                    >
                        <StyledDataGrid onClipboardCopy={(copiedString) => setCopiedData(copiedString)} rows={rowsWithCheckboxes} columns={columnDataTable.filter((column) => columnVisibility[column.field])} onSelectionModelChange={handleSelectionChange} selectionModel={selectedRows} autoHeight={true} ref={gridRef} density="compact" hideFooter getRowClassName={getRowClassName} disableRowSelectionOnClick />
                    </Box>
                    <Box>
                        <Pagination page={page} pageSize={pageSize} totalPages={searchQuery !== "" ? 1 : totalPages} onPageChange={handlePageChange} pageItemLength={filteredDatas?.length} totalProjects={
                            searchQuery !== "" ? filteredDatas?.length : totalDatas
                        } />

                    </Box>
                    {/* ****** Table End ****** */}
                </Box>
            </>
            {/* // )} */}
            {/* ****** Table End ****** */}

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
            {/*DELETE ALERT DIALOG */}
            <Dialog open={isDeleteOpen} onClose={handleCloseMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" fullWidth maxWidth={"md"}>
                <DialogContent sx={{ textAlign: "center", alignItems: "center" }}>
                    {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} /> */}
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"SNO"}.</StyledTableCell>
                                <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Department"}</StyledTableCell>
                                <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Year"}</StyledTableCell>
                                <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Month"}</StyledTableCell>
                                <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"From Date"}</StyledTableCell>
                                <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"To Date"}</StyledTableCell>
                            </TableHead>
                            <TableBody>
                                {filteredyear?.map((item, i) => (
                                    <StyledTableRow>
                                        <StyledTableCell sx={{ padding: "5px 10px !important" }}>{i + 1}.</StyledTableCell>
                                        <StyledTableCell sx={{ padding: "5px 10px !important" }}> {item.department}</StyledTableCell>
                                        <StyledTableCell sx={{ padding: "5px 10px !important" }}> {item.year}</StyledTableCell>
                                        <StyledTableCell sx={{ padding: "5px 10px !important" }}> {item.month}</StyledTableCell>
                                        <StyledTableCell sx={{ padding: "5px 10px !important" }}> {moment(item.fromdate).format("DD-MM-YYYY")}</StyledTableCell>
                                        <StyledTableCell sx={{ padding: "5px 10px !important" }}> {moment(item.todate).format("DD-MM-YYYY")}</StyledTableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Typography variant="h6" sx={{ color: "red", textAlign: "center", size: "small" }}>
                        This data has also been deleted in the Department Monthset? Are you sure you want to proceed with the deletion?"
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCloseMod}
                        style={{
                            backgroundColor: "#f4f4f4",
                            color: "#444",
                            boxShadow: "none",
                            borderRadius: "3px",
                            border: "1px solid #0000006b",
                            "&:hover": {
                                "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                                    backgroundColor: "#f4f4f4",
                                },
                            },
                        }}
                    >
                        Cancel
                    </Button>
                    <Button autoFocus variant="contained" color="error" onClick={(e) => delHoliday(holidayid)}>
                        {" "}
                        OK{" "}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* this is info view details */}
            <Dialog open={openInfo} onClose={handleCloseinfo} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <Box sx={{ padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}>Department Month Set Auto List Info</Typography>
                        <br />
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={12} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">addedby</Typography>
                                    <br />
                                    <Table>
                                        <TableHead>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"SNO"}.</StyledTableCell>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"UserName"}</StyledTableCell>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Date"}</StyledTableCell>
                                        </TableHead>
                                        <TableBody>
                                            {addedby?.map((item, i) => (
                                                <StyledTableRow>
                                                    <StyledTableCell sx={{ padding: "5px 10px !important" }}>{i + 1}.</StyledTableCell>
                                                    <StyledTableCell sx={{ padding: "5px 10px !important" }}> {item.name}</StyledTableCell>
                                                    <StyledTableCell sx={{ padding: "5px 10px !important" }}> {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}</StyledTableCell>
                                                </StyledTableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </FormControl>
                            </Grid>
                            <Grid item md={12} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Updated by</Typography>
                                    <br />
                                    <Table>
                                        <TableHead>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"SNO"}.</StyledTableCell>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"UserName"}</StyledTableCell>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Date"}</StyledTableCell>
                                        </TableHead>
                                        <TableBody>
                                            {updateby?.map((item, i) => (
                                                <StyledTableRow>
                                                    <StyledTableCell sx={{ padding: "5px 10px !important" }}>{i + 1}.</StyledTableCell>
                                                    <StyledTableCell sx={{ padding: "5px 10px !important" }}> {item.name}</StyledTableCell>
                                                    <StyledTableCell sx={{ padding: "5px 10px !important" }}> {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}</StyledTableCell>
                                                </StyledTableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br /> <br />
                        <br />
                        <Grid container spacing={2}>
                            <Button variant="contained" onClick={handleCloseinfo}>
                                {" "}
                                Back{" "}
                            </Button>
                        </Grid>
                    </>
                </Box>
            </Dialog>
            {/* print layout */}
            <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRef}>
                    <TableHead>
                        <TableRow>
                            <TableCell> SI.No</TableCell>
                            <TableCell>Department</TableCell>
                            <TableCell>Year</TableCell>
                            <TableCell>Start DAte</TableCell>
                            <TableCell>Salary</TableCell>
                            <TableCell>Prof-Tax-Shop</TableCell>
                            <TableCell>Penalty</TableCell>
                            <TableCell>Esi-stop</TableCell>
                            <TableCell>Pf-Stop</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody align="left">
                        {rowDataTable &&
                            rowDataTable.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{row.department}</TableCell>
                                    <TableCell>{row.year}</TableCell>
                                    <TableCell>{row.startdate}</TableCell>
                                    <TableCell>{row.salary}</TableCell>
                                    <TableCell>{row.proftaxstop}</TableCell>
                                    <TableCell>{row.penalty}</TableCell>
                                    <TableCell>{row.esistop}</TableCell>
                                    <TableCell>{row.pfstop}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* view model */}
            <Dialog open={openview} onClose={handleCloseview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md" fullWidth={true}>
                <Box sx={{ padding: "20px 50px" }}>
                    <>
                        <Grid container spacing={2}>
                            <Grid item xs={8}>
                                <Typography sx={userStyle.HeaderText}>View Department Month Set Auto</Typography>
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Department
                                    </Typography>
                                    <Typography>{singleDepMonth.department}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Year
                                    </Typography>
                                    <Typography>{singleDepMonth.year}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Start Date
                                    </Typography>
                                    <Typography>{(moment(singleDepMonth.startdate).format("DD-MM-YYYY"))}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControlLabel control={<Checkbox checked={Boolean(singleDepMonth.salary)} sx={{ "& .MuiSvgIcon-root": { fontSize: "33px" } }} />} label="Salary" />
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControlLabel control={<Checkbox checked={Boolean(singleDepMonth.proftaxstop)} sx={{ "& .MuiSvgIcon-root": { fontSize: "33px" } }} />} label="Prof-Tax-Stop" />
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControlLabel control={<Checkbox checked={Boolean(singleDepMonth.penalty)} sx={{ "& .MuiSvgIcon-root": { fontSize: "33px" } }} />} label="Penalty" />
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControlLabel control={<Checkbox checked={Boolean(singleDepMonth.esistop)} sx={{ "& .MuiSvgIcon-root": { fontSize: "33px" } }} />} label="ESI-Stop" />
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControlLabel control={<Checkbox checked={Boolean(singleDepMonth.pfstop)} sx={{ "& .MuiSvgIcon-root": { fontSize: "33px" } }} />} label="PF-Stop" />
                            </Grid>
                        </Grid>
                        <br />
                        <br />
                        <Grid container>
                            <Grid item md={3} xs={12} sm={6}>
                                <Button variant="contained" onClick={handleCloseview}>
                                    Back
                                </Button>
                            </Grid>
                            <Grid item md={3} xs={12} sm={6}></Grid>
                        </Grid>
                    </>
                </Box>
            </Dialog>

            <Box>
                <Dialog open={isDeleteOpencheckbox} onClose={handleCloseModcheckbox} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
                        <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
                            Are you sure?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>
                            Cancel
                        </Button>
                        <Button autoFocus variant="contained" color="error" onClick={(e) => delDeptmentcheckbox(e)}>
                            {" "}
                            OK{" "}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
            <Box>
                {/* ALERT DIALOG */}
                <Dialog open={isDeleteOpenalert} onClose={handleCloseModalert} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "70px", color: "orange" }} />
                        <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
                            Please Select any Row
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus variant="contained" color="error" onClick={handleCloseModalert}>
                            {" "}
                            OK{" "}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>


            {/* ALERT DIALOG */}
            <Box>
                <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
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
            {/*Export XL Data  */}
            <Dialog
                open={isFilterOpen}
                onClose={handleCloseFilterMod}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent
                    sx={{
                        textAlign: "center",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                    }}
                >
                    {fileFormat === "xl" ? (
                        <>
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

                            <FaFileExcel style={{ fontSize: "80px", color: "green" }} />
                            <Typography variant="h5" sx={{ textAlign: "center" }}>
                                Choose Export
                            </Typography>
                        </>
                    ) : (
                        <>
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

                            <FaFileCsv style={{ fontSize: "80px", color: "green" }} />
                            <Typography variant="h5" sx={{ textAlign: "center" }}>
                                Choose Export
                            </Typography>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        autoFocus
                        variant="contained"
                        onClick={(e) => {
                            handleExportXL("filtered");
                        }}
                    >
                        Export Filtered Data
                    </Button>
                    <Button
                        autoFocus
                        variant="contained"
                        onClick={(e) => {
                            handleExportXL("overall");

                        }}
                    >
                        Export Over All Data
                    </Button>
                </DialogActions>
            </Dialog>
            {/*Export pdf Data  */}
            <Dialog
                open={isPdfFilterOpen}
                onClose={handleClosePdfFilterMod}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent
                    sx={{
                        textAlign: "center",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                    }}
                >
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
                            downloadPdf("filtered");
                            setIsPdfFilterOpen(false);
                        }}
                    >
                        Export Filtered Data
                    </Button>
                    <Button
                        variant="contained"
                        onClick={(e) => {
                            downloadPdf("overall");
                            setIsPdfFilterOpen(false);
                        }}
                    >
                        Export Over All Data
                    </Button>
                </DialogActions>
            </Dialog>
            <Loader loading={loading} message={loadingMessage} />
        </Box>
    );
}

export default DepartmentMonthSetAuto;