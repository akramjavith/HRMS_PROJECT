import React, { useState, useEffect, useRef, useContext } from "react";
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { Box, Typography, OutlinedInput, TableBody, TableRow, TableCell, Select, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton } from "@mui/material";
import { userStyle, colourStyles } from "../../../pageStyle";
import { FaPrint, FaFilePdf, FaFileExcel, FaFileCsv } from "react-icons/fa";
import { StyledTableCell } from "../../../components/Table";
import { useParams } from "react-router-dom";
import { CSVLink } from 'react-csv';
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import { handleApiError } from "../../../components/Errorhandling";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext, AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import Selects from "react-select";
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

function SetList() {

    const gridRefSetTable = useRef(null);
    const { auth } = useContext(AuthContext);
    const { isUserRoleCompare, isUserRoleAccess } = useContext(UserRoleAccessContext);
    const [allUserDates, setAllUserDates] = useState([])
    const [comparedUsers, setComparedUsers] = useState([]);
    const [filter, setFilter] = useState({ weeks: "1st Week" })
    const [showFilter, setShowFilter] = useState(false)
    const [shifts, setShifts] = useState([]);
    const [shiftsFiltered, setShiftsFiltered] = useState([])
    const [itemsSetTable, setItemsSetTable] = useState([])
    const [allShifts, setAllShifts] = useState([])
    const [shiftTime, setShiftTime] = useState("");
    const [secondShiftTime, setSecondShiftTime] = useState("")
    const [shiftAllows, setShiftAllows] = useState("");
    const [getUpdateID, setGetUpdateID] = useState("")
    const [getShiftAllot, setShiftAllot] = useState({})
    const [selectedRows, setSelectedRows] = useState([]);
    const [copiedData, setCopiedData] = useState("");
    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const [allSetCheck, setAllSetCheck] = useState(false);
    const [shiftRoasterEdit, setShiftRoasterEdit] = useState({})

    // Datatable Set Table
    const [pageSetTable, setPageSetTable] = useState(1);
    const [pageSizeSetTable, setPageSizeSetTable] = useState(10);
    const [searchQuerySetTable, setSearchQuerySetTable] = useState("");

    // Edit model
    const [openEdit, setOpenEdit] = useState(false);
    const handleClickOpenEdit = () => { setOpenEdit(true); };
    const handleCloseEdit = () => { setOpenEdit(false); }

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const handleClickOpenerr = () => { setIsErrorOpen(true); };
    const handleCloseerr = () => { setIsErrorOpen(false); };

    // Manage Columns
    const [searchQueryManage, setSearchQueryManage] = useState("");
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
        if (selectedRows.includes(params.row.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
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

    const filteroptions = [
        { label: "1st Week", value: "1st Week" },
        { label: "2nd Week", value: "2nd Week" },
        { label: "3rd Week", value: "3rd Week" },
        { label: "4th Week", value: "4th Week" },
        { label: "5th Week", value: "5th Week" },
    ];

    const modeoptions = [
        { label: "Shift", value: "Shift" },
        { label: "Week Off", value: "Week Off" },
        { label: "Others", value: "Others" },
    ];

    const secondmodeoptions = [
        { label: "Double Shift", value: "Double Shift" },
        { label: "Continue Shift", value: "Continue Shift" },
    ];

    const getid = useParams().id;

    //get single row to edit....
    const fetchSingleShiftRoasterSet = async () => {

        try {
            let res = await axios.get(`${SERVICE.SHIFTROASTER_SINGLE}/${getid}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            res?.data?.sshiftroaster.shifttype == "This Month" ? setShowFilter(true) : setShowFilter(false)

            let resuser = await axios.get(SERVICE.USER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            // Convert res?.data?.sshiftroaster to an array with a single object
            const shiftRoaster = res?.data?.sshiftroaster || {};
            const shiftRoasterArray = [shiftRoaster];

            // Assuming res_shiftroaster?.data?.shiftroasters is an array of shift roasters
            const shiftRoasters = shiftRoasterArray || [];

            // Assuming res?.data?.users is an array of users
            const users = resuser?.data?.users || [];

            let result = users.filter((user) =>
                shiftRoasters.some(
                    (shiftRoaster) =>
                        user.company === shiftRoaster.company &&
                        user.branch === shiftRoaster.branch &&
                        user.unit === shiftRoaster.unit &&
                        user.team === shiftRoaster.team &&
                        user.department === shiftRoaster.department
                )
            )
                .map((matchedUser) => {
                    const matchingShiftRoasters = shiftRoasters.filter(
                        (shiftRoaster) =>
                            matchedUser.company === shiftRoaster.company &&
                            matchedUser.branch === shiftRoaster.branch &&
                            matchedUser.unit === shiftRoaster.unit &&
                            matchedUser.team === shiftRoaster.team &&
                            matchedUser.department === shiftRoaster.department
                    );

                    // Assuming matchedUser.weekoff is an array of week-off days like ["Sunday", "Monday"]
                    const isWeekOff = matchedUser.weekoff && (
                        matchedUser.weekoff.includes("Sunday") ||
                        matchedUser.weekoff.includes("Monday") ||
                        matchedUser.weekoff.includes("Tuesday") ||
                        matchedUser.weekoff.includes("Wednesday") ||
                        matchedUser.weekoff.includes("Thursday") ||
                        matchedUser.weekoff.includes("Friday") ||
                        matchedUser.weekoff.includes("Saturday")
                    );

                    return matchingShiftRoasters.map((shiftRoaster) => ({
                        userid: matchedUser._id,
                        company: matchedUser.company,
                        branch: matchedUser.branch,
                        unit: matchedUser.unit,
                        team: matchedUser.team,
                        department: matchedUser.department,
                        username: matchedUser.companyname,
                        empcode: matchedUser.empcode,
                        shifttiming: matchedUser.shifttiming,
                        shifttype: shiftRoaster.shifttype,
                        fromdate: shiftRoaster.fromdate,
                        todate: shiftRoaster.todate,
                        status: isWeekOff ? "Week Off" : "Not Allot",
                        weekoff: matchedUser.weekoff,
                    }));
                })
                .flat(); // Flatten the nested array            
            setComparedUsers(result);
            setAllSetCheck(true)
        } catch (err) {setAllSetCheck(true);handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    useEffect(() => {
        fetchSingleShiftRoasterSet();
    }, [getid]);

    // get all shifts
    const fetchShift = async () => {
        try {
            let res_shift = await axios.get(SERVICE.SHIFT, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
            const shiftall = [
                ...res_shift?.data?.shifts?.map((d) => ({
                    ...d,
                    label: d.name,
                    value: d.name,
                })),
            ];
            setShifts(shiftall);
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    useEffect(() => {
        fetchShift();
    }, [])

    const getShiftTime = async (value) => {
        try {
            let res_shift = await axios.get(SERVICE.SHIFT, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
            setAllShifts(res_shift?.data?.shifts)
            res_shift?.data?.shifts.map((d) => {
                if (d.name == value) {
                    if (shiftRoasterEdit.secondmode !== 'Double Shift') {
                        setShiftTime(`${d.fromhour}:${d.frommin}${d.fromtime} - ${d.tohour}:${d.tomin}${d.totime}`)
                        setShiftAllows(d.isallowance)
                    }
                    else {
                        setSecondShiftTime(`${d.fromhour}:${d.frommin}${d.fromtime} - ${d.tohour}:${d.tomin}${d.totime}`)
                    }
                }
            })
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    }

    // Function to calculate working hours between two time strings
    const calculateWorkingHours = (startTime, endTime) => {

        const parseTime = (timeString) => {
            const [time, period] = timeString.split(/([aApP][mM])/);
            const [hours, minutes] = time.split(':').map(Number);

            return {
                hours,
                minutes,
                period: period ? period.toUpperCase() : undefined,
            };
        };

        const { hours: startHour, minutes: startMinute, period: startPeriod } = parseTime(startTime);
        const { hours: endHour, minutes: endMinute, period: endPeriod } = parseTime(endTime);

        // Convert both start and end times to minutes
        const startMinutes = (startPeriod === 'PM' && startHour !== 12 ? startHour + 12 : startHour) * 60 + startMinute;
        const endMinutes = (endPeriod === 'PM' && endHour !== 12 ? endHour + 12 : endHour) * 60 + endMinute;

        // Calculate the difference in minutes
        let differenceInMinutes = endMinutes - startMinutes;

        // Handle cases where end time is before start time (e.g., night shifts)
        if (differenceInMinutes < 0) {
            differenceInMinutes += 24 * 60; // Assuming a 24-hour day
        }

        // Convert the difference back to hours and minutes
        const hours = Math.floor(differenceInMinutes / 60);
        const minutes = differenceInMinutes % 60;

        return `${hours}:${minutes}`;
    };

    const handleSecondModeChange = (e) => {
        if (e.value === 'Double Shift') {
            setShiftRoasterEdit({ ...shiftRoasterEdit, secondmode: e.value, shift: "Choose Shift" });
            const shiftTimeParts = shiftTime.split(' - ');

            if (shiftTimeParts.length === 2) {
                const startTime = shiftTimeParts[0];
                const endTime = shiftTimeParts[1];

                // Convert the time strings to 24-hour format
                const convertTo24HourFormat = (timeString) => {
                    const [time, period] = timeString.split(/([aApP][mM])/);
                    const [hours, minutes] = time.split(':').map(Number);
                    return period.toUpperCase() === 'PM' ? { hours: hours + 12, minutes } : { hours, minutes };
                };

                const start24 = convertTo24HourFormat(startTime);
                const end24 = convertTo24HourFormat(endTime);

                // Create Date objects manually
                const startDate = new Date(2000, 0, 1, start24.hours, start24.minutes);
                const endDate = new Date(2000, 0, 1, end24.hours, end24.minutes);

                // Extract hours and minutes from Date objects
                const startHour = startDate.getHours();
                const startMinute = startDate.getMinutes();
                const endHour = endDate.getHours();
                const endMinute = endDate.getMinutes();

                // Convert both start and end times to minutes
                const startMinutes = startHour * 60 + startMinute;
                const endMinutes = endHour * 60 + endMinute;

                // Calculate the difference in minutes
                let differenceInMinutes = endMinutes - startMinutes;

                // Handle cases where end time is before start time (e.g., night shifts)
                if (differenceInMinutes < 0) {
                    differenceInMinutes += 24 * 60; // Assuming a 24-hour day
                }

                // Convert the difference back to hours and minutes
                const hours = Math.floor(differenceInMinutes / 60);
                const minutes = differenceInMinutes % 60;

                const workingHours = `${hours}:${minutes}`;

                // Filter shifts with the same working hours
                const filteredWorkingHours = allShifts?.filter((shift) => {
                    const shiftStartTime = `${shift.fromhour}:${shift.frommin}${shift.fromtime}`;
                    const shiftEndTime = `${shift.tohour}:${shift.tomin}${shift.totime}`;

                    const shiftWorkingHours = calculateWorkingHours(shiftStartTime, shiftEndTime);

                    // Compare working hours using the calculated working hours
                    return shiftWorkingHours === workingHours;
                });

                // Now, filter out shifts that start after the calculated end time
                const filteredShiftsAfterEndTime = filteredWorkingHours?.filter((shift) => {
                    const shiftStartTime = `${shift.fromhour}:${shift.frommin}${shift.fromtime}`;
                    const shiftEndTime = `${shift.tohour}:${shift.tomin}${shift.totime}`;

                    const shiftStartTime24 = convertTo24HourFormat(shiftStartTime);
                    const shiftEndTime24 = convertTo24HourFormat(shiftEndTime);

                    const shiftStartMinutes = shiftStartTime24.hours * 60 + shiftStartTime24.minutes;
                    const shiftEndMinutes = shiftEndTime24.hours * 60 + shiftEndTime24.minutes;

                    if ((shiftEndMinutes < shiftStartMinutes) && shiftStartMinutes >= endMinutes || shiftEndMinutes > endMinutes) {
                        
                        return true;
                    }

                });

                const filteredShifts = filteredShiftsAfterEndTime?.map((shift) => ({
                    ...shift,
                    label: shift.name,
                    value: shift.name,
                })) || [];

                setShiftsFiltered(filteredShifts);

            } else {
            }
        }
        else {

            const filteredShifts = shifts?.map((shift) => ({
                ...shift,
                label: shift.name,
                value: shift.name,
            })) || [];

            setShifts(filteredShifts);
        };
    }

    const getWeekOfMonth = (date) => {
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const days = date.getDate() + firstDay.getDay() - 1;
        return Math.ceil(days / 7);
    };

    const renderDateColumns = (fromDate, toDate, shiftType, selectedWeek, empCode) => {

        const columns = [];
        let currentDate = new Date(fromDate);
        let dayCount = 1;

        while (currentDate <= new Date(toDate)) {

            columns.push({
                date: currentDate.toISOString(),
                formattedDate: `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`,
                dayName: currentDate.toLocaleDateString('en-US', { weekday: 'long' }),
                weekOfMonth: getWeekOfMonth(currentDate),
                dayCount: dayCount,
                empCode: empCode,
            });
            currentDate.setDate(currentDate.getDate() + 1);
            dayCount++;
        }

        // If shift type is "This Month", filter columns based on the selected week
        if (shiftType === 'This Month') {
            return columns.filter((column) => column.weekOfMonth === selectedWeek);
        }

        return columns;
    };

    const filteredColumnsSetTable = renderDateColumns(
        comparedUsers[0]?.fromdate,
        comparedUsers[0]?.todate,
        comparedUsers[0]?.shifttype,
        parseInt(filter.weeks[0], 10),
        comparedUsers[0]?.empcode,
    );

    // print...
    const componentRefSetTable = useRef();
    const handleprintSetTable = useReactToPrint({
        content: () => componentRefSetTable.current,
        documentTitle: "Set Table",
        pageStyle: "print",
    });

    // pdf.....
    const downloadPdfSetTable = () => {
        const doc = new jsPDF();
        doc.autoTable({
            theme: "grid",
            styles: { fontSize: 4, },
            html: '#settablepdf'
        })
        doc.save("Set Table.pdf");
    };

    // image
    const handleCaptureImageSetTable = () => {
        if (gridRefSetTable.current) {
            html2canvas(gridRefSetTable.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "Set Table.png");
                });
            });
        }
    };

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };

    const addSerialNumberSetTable = () => {
        const itemsWithSerialNumber = comparedUsers?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
        setItemsSetTable(itemsWithSerialNumber);
    };

    useEffect(() => {
        addSerialNumberSetTable();
    }, [comparedUsers]);

    // Datatable
    const handlePageChangeSetTable = (newPage) => {
        setPageSetTable(newPage);
    };

    const handlePageSizeChangeSetTable = (event) => {
        setPageSizeSetTable(Number(event.target.value));
        setPageSetTable(1);
    };

    // datatable....
    const handleSearchChangeSetTable = (event) => {
        setSearchQuerySetTable(event.target.value);
    };

    // Split the search query into individual terms
    const searchTermsSetTable = searchQuerySetTable.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatasSetTable = itemsSetTable?.filter((item) => {
        return searchTermsSetTable.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
    });

    const filteredDataSetTable = filteredDatasSetTable?.slice((pageSetTable - 1) * pageSizeSetTable, pageSetTable * pageSizeSetTable);

    const totalPagesSetTable = Math.ceil(filteredDatasSetTable?.length / pageSizeSetTable);

    const visiblePagesSetTable = Math.min(totalPagesSetTable, 3);

    const firstVisiblePageSetTable = Math.max(1, pageSetTable - 1);
    const lastVisiblePageSetTable = Math.min(firstVisiblePageSetTable + visiblePagesSetTable - 1, totalPagesSetTable);

    const pageNumbersSetTable = [];

    const indexOfLastItemSetTable = pageSetTable * pageSizeSetTable;
    const indexOfFirstItemSetTable = indexOfLastItemSetTable - pageSizeSetTable;

    for (let i = firstVisiblePageSetTable; i <= lastVisiblePageSetTable; i++) {
        pageNumbersSetTable.push(i);
    }

    // Extracting headers from filteredColumnsSetTable
    const headers = [
        'S.No',
        'Company',
        'Branch',
        'Unit',
        'Team',
        'Department',
        'Name',
        'Shift',
        // Add headers for date columns dynamically
        ...filteredColumnsSetTable.map(column => `${column.formattedDate} ${column.dayName} ${column.dayCount}`),
    ];

    // Constructing data in the required format
    const data = [
        headers, // First row should be headers
        ...filteredDataSetTable.map((row, index) => [
            index + 1,
            row.company,
            row.branch,
            row.unit,
            row.team,
            row.department,
            row.username,
            row.shifttiming,
            // Add data for date columns dynamically           
            ...filteredColumnsSetTable.map(column => {
                let filteredRowData = allUserDates.filter(val => val.empcode === row.empcode);
                const matchingItem = filteredRowData.find(item => item.date === column.formattedDate);
                const isWeekOff = row.weekoff?.includes(column.dayName);
                return matchingItem ? matchingItem.status : (isWeekOff ? 'Week Off' : 'Not Allot');
            }),
        ]),
    ];

    const handleShiftAllot = (data, rowdata) => {
        handleClickOpenEdit();
        let newobj = {
            ...data,
            userid: rowdata.userid,
            company: rowdata.company,
            branch: rowdata.branch,
            unit: rowdata.unit,
            team: rowdata.team,
            department: rowdata.department,
            empcode: rowdata.empcode,
            shifttiming: rowdata.shifttiming,
            username: rowdata.username,
            weekoff: rowdata.weekoff,
            mode: "Shift",
            shift: "Choose Shift",
            firstshift: "",
            secondmode: "Choose Second Shift",
            pluseshift: "",
            status: "",
        }

        setShiftRoasterEdit(newobj)
        getCode(rowdata.empcode)
    }

    // Clear
    const handleClear = () => {
        setShiftTime("");
        setSecondShiftTime("");
        setShiftRoasterEdit({
            ...shiftRoasterEdit,
            mode: "Shift", shift: "Choose Shift", firstshift: "", secondmode: "Choose Second Shift", pluseshift: ""
        });

    };

    //get single row to edit....
    const getCode = async (value) => {
        try {
            let res = await axios.get(SERVICE.USER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            res?.data?.users?.filter((user) => {
                if (user.empcode == value) {
                    setGetUpdateID(user._id);
                    setShiftAllot(user.shiftallot)
                }
            })
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const fetchUsers = async () => {
        try {
            let res = await axios.get(SERVICE.USER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let resultshiftallot = []
            res.data.users.map(user =>
                user.shiftallot.map(allot => {
                    resultshiftallot.push({ ...allot })
                })
            );
            setAllUserDates(resultshiftallot)
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    }

    useEffect(() => {
        fetchUsers();
    }, [])

    const sendRequest = async () => {
        try {
            let res = await axios.put(`${SERVICE.USER_SINGLE_PWD}/${getUpdateID}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                shiftallot: [
                    ...getShiftAllot,
                    {
                        userid: String(shiftRoasterEdit.userid),
                        company: String(shiftRoasterEdit.company),
                        branch: String(shiftRoasterEdit.branch),
                        unit: String(shiftRoasterEdit.unit),
                        team: String(shiftRoasterEdit.team),
                        department: String(shiftRoasterEdit.department),
                        username: String(shiftRoasterEdit.username),
                        empcode: String(shiftRoasterEdit.empcode),
                        shifttiming: String(shiftRoasterEdit.shifttiming),
                        date: String(shiftRoasterEdit.formattedDate),
                        day: String(shiftRoasterEdit.dayName),
                        daycount: String(shiftRoasterEdit.dayCount),
                        mode: String(shiftRoasterEdit.mode),
                        shift: String(shiftRoasterEdit.shift),
                        firstshift: String(shiftTime),
                        secondmode: String(shiftRoasterEdit.secondmode),
                        pluseshift: String(secondShiftTime),
                        status: String("Alloted"),
                        shiftallows: String(shiftAllows),
                        weekoff: [...shiftRoasterEdit.weekoff],
                    }
                ],
            });
            await fetchUsers();
            handleCloseEdit();
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        company: true,
        branch: true,
        unit: true,
        team: true,
        department: true,
        username: true,
        shifttiming: true,
        ...filteredColumnsSetTable.reduce((acc, day, index) => {
            acc[`${day.formattedDate} ${day.dayName} Day ${day.dayCount}`] = true;
            return acc;
        }, {}),
    };

    const [columnVisibility, setColumnVisibility] = useState({
        serialNumber: true,
        checkbox: true,
        company: true,
        branch: true,
        unit: true,
        team: true,
        department: true,
        username: true,
        shifttiming: true,
        ...filteredColumnsSetTable.reduce((acc, day, index) => {
            const dateKey = `${day.formattedDate} ${day.dayName} Day ${day.dayCount}`;
            acc[dateKey] = true;
            return acc;
        }, {}),
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
            headerStyle: { fontWeight: "bold", },
            renderHeader: (params) => (
                <CheckboxHeader
                    selectAllChecked={selectAllChecked}
                    onSelectAll={() => {
                        if (rowDataTable?.length === 0) {
                            // Do not allow checking when there are no rows
                            return;
                        }
                        if (selectAllChecked) {
                            setSelectedRows([]);
                        } else {
                            const allRowIds = rowDataTable?.map((row) => row.id);
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
                        setSelectAllChecked(updatedSelectedRows?.length === filteredDataSetTable?.length);
                    }}
                />
            ),
            sortable: false, // Optionally, you can make this column not sortable
            width: 75,
            hide: !columnVisibility.checkbox,
            headerClassName: "bold-header",
        },
        { field: "serialNumber", headerName: "SNo", flex: 0, width: 75, hide: !columnVisibility.serialNumber, headerClassName: "bold-header", },
        { field: "company", headerName: "Company", flex: 0, width: 120, hide: !columnVisibility.company, headerClassName: "bold-header" },
        { field: "branch", headerName: "Branch", flex: 0, width: 120, hide: !columnVisibility.branch, headerClassName: "bold-header" },
        { field: "unit", headerName: "Unit", flex: 0, width: 120, hide: !columnVisibility.unit, headerClassName: "bold-header" },
        { field: "team", headerName: "Team", flex: 0, width: 120, hide: !columnVisibility.team, headerClassName: "bold-header" },
        { field: "department", headerName: "Department", flex: 0, width: 120, hide: !columnVisibility.department, headerClassName: "bold-header" },
        { field: "username", headerName: "Name", flex: 0, width: 100, hide: !columnVisibility.username, headerClassName: "bold-header" },
        { field: "shifttiming", headerName: "Shift", flex: 0, width: 100, hide: !columnVisibility.shifttiming, headerClassName: "bold-header" },
        ...filteredColumnsSetTable.map((column, index) => ({
            field: `${column.formattedDate} ${column.dayName} Day ${column.dayCount}`,
            headerName: `${column.formattedDate} ${column.dayName} Day ${column.dayCount}`,
            hide: !columnVisibility[`${column.formattedDate} ${column.dayName} Day ${column.dayCount}`],
            flex: 0,
            width: 100,
            sortable: false,
            renderCell: (params) => {
                // Move the variable declaration outside the JSX
                let filteredRowData = allUserDates.filter((val) => val.empcode == params.row.empcode);
                const matchingItem = filteredRowData.find(item => item.date == column.formattedDate);


                return (
                    <StyledTableCell>
                        <Button
                            color={matchingItem && matchingItem.status === 'Alloted' ? 'success' : params.row.weekoff?.includes(column.dayName) ? 'warning' : 'error'}
                            variant="contained"
                            size="small"
                            sx={{
                                fontSize: '10px',
                                textTransform: 'capitalize',
                                borderRadius: '10px',
                                height: '20px',
                                padding: '1px 8px',
                                pointerEvents: matchingItem && matchingItem.status === 'Alloted' || params.row.weekoff?.includes(column.dayName) ? 'none' : 'auto',
                            }}
                            onClick={(e) => {
                                if (matchingItem && matchingItem.status === 'Alloted' || params.row.weekoff?.includes(column.dayName)) {
                                    // Handle the case when the status is 'Alloted'
                                } else {
                                    handleShiftAllot(column, params.row); // Use params.row instead of item
                                }

                            }}
                        >
                            {params.row.days[index].status}
                        </Button>
                    </StyledTableCell>
                );
            },
        })),
    ];

    const rowDataTable = filteredDataSetTable?.map((item, index) => {
        return {
            id: item.userid,
            userid: item.userid,
            serialNumber: item.serialNumber,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            team: item.team,
            department: item.department,
            username: item.username,
            shifttiming: item.shifttiming,
            empcode: item.empcode,
            weekoff: item.weekoff,
            // days: filteredColumnsSetTable.map((column, index) => {
            //     let filteredRowData = allUserDates.filter((val) => val.empcode == item.empcode);
            //     const matchingItem = filteredRowData.find(item => item.date == column.formattedDate);

            //     return {
            //         status: matchingItem ? matchingItem.status : "Not Allot",
            //         empCode: item.empcode, // Include empCode in each day
            //     };
            // }),
            days: filteredColumnsSetTable.map((column, index) => {
                let filteredRowData = allUserDates.filter((val) => val.empcode == item.empcode);
                const matchingItem = filteredRowData.find(item => item.date == column.formattedDate);

                // Check if the dayName is Sunday or Monday
                const isWeekOff = item.weekoff?.includes(column.dayName);

                return {
                    status: matchingItem ? matchingItem.status : (isWeekOff ? 'Week Off' : 'Not Allot'),
                    empCode: item.empcode,
                };
            }),
        };
    });

    const rowsWithCheckboxes = rowDataTable?.map((row) => ({
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
                    {filteredColumns?.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText
                                sx={{ display: "flex" }}
                                primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibility[column.field]} onChange={() => toggleColumnVisibility(column.field)} />}
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

    return (
        <Box>
            <Headtitle title={"SET SHIFT"} />
            {/* ****** Header Content ****** */}
            <Typography sx={userStyle.HeaderText}>Set</Typography>

            <br />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("eshiftroaster") && (
                <>
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid container style={userStyle.dataTablestyle}>
                            <Grid md={10}>
                                <Typography sx={userStyle.importheadtext}>Shift Allot</Typography>
                            </Grid>
                            {showFilter ? (
                                <Grid md={2}>
                                    <Typography> Filter Week </Typography>
                                    <Selects
                                        options={filteroptions}
                                        styles={colourStyles}
                                        value={{ label: filter.weeks, value: filter.weeks }}
                                        onChange={(e) => { setFilter({ ...filter, weeks: e.value }); }}
                                    />
                                </Grid>
                            ) : null}
                        </Grid>
                        <br /><br />
                        <Grid container style={userStyle.dataTablestyle}>
                            <Grid item md={2} xs={12} sm={12}>
                                <Box>
                                    <label>Show entries:</label>
                                    <Select size="small"
                                        id="pageSizeSelect"
                                        value={pageSizeSetTable}
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
                                        <MenuItem value={comparedUsers?.length}>All</MenuItem>
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Box>
                                    {isUserRoleCompare?.includes("excelshiftroaster") && (
                                        <>
                                            <Button sx={userStyle.buttongrp}>
                                                <FaFileExcel />&ensp;
                                                <ReactHTMLTableToExcel
                                                    id="test-table-xls-button"
                                                    className="download-table-xls-button"
                                                    table="settablepdf"
                                                    filename="SetTable"
                                                    sheet="Sheet"
                                                    buttonText="Export To Excel"
                                                />
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvshiftroaster") && (
                                        <>
                                            <CSVLink style={{
                                                backgroundColor: "#f4f4f4",
                                                color: "#444",
                                                borderRadius: "3px",
                                                boxShadow: "none",
                                                fontSize: "12px",
                                                padding: "8px 6px",
                                                textTransform: "capitalize",
                                                border: "1px solid #8080808f",
                                                textDecoration: 'none',
                                                color: "#444",
                                                borderRadius: "3px",
                                                boxShadow: "none",
                                                fontSize: "12px",
                                                padding: "8px 6px",
                                                marginRight: '0px',
                                                fontFamily: "Roboto,Helvetica,Arial,sans-serif"
                                            }}
                                                data={data}
                                                filename="SetTable.csv"
                                            >
                                                <FaFileCsv />&ensp;Export To CSV
                                            </CSVLink>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printshiftroaster") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprintSetTable}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfshiftroaster") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={() => downloadPdfSetTable()}>
                                                <FaFilePdf />
                                                &ensp;Export to PDF&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imageshiftroaster") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleCaptureImageSetTable}>
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
                                        <OutlinedInput id="component-outlined" type="text" value={searchQuerySetTable} onChange={handleSearchChangeSetTable} />
                                    </FormControl>
                                </Box>
                            </Grid>
                        </Grid>  <br />

                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}> Show All Columns </Button>  &ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>  Manage Columns </Button> &ensp;
                        {/* <Button variant="contained" color="error" onClick={handleClickOpenalert}> Bulk Delete  </Button>  */}
                        <br /> <br />
                        {!allSetCheck ? (
                            <>
                                <Box sx={{ display: "flex", justifyContent: "center" }}>
                                    <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                                </Box>
                            </>
                        ) : (
                            <>
                                <Box style={{ width: "100%", overflowY: "hidden", }}>
                                    <StyledDataGrid onClipboardCopy={(copiedString) => setCopiedData(copiedString)} rows={rowsWithCheckboxes} columns={columnDataTable.filter((column) => columnVisibility[column.field])} onSelectionModelChange={handleSelectionChange} selectionModel={selectedRows} autoHeight={true} ref={gridRefSetTable} id="settableexcel" density="compact" hideFooter getRowClassName={getRowClassName} disableRowSelectionOnClick />
                                </Box>
                                <Box style={userStyle.dataTablestyle}>
                                    <Box>
                                        Showing {filteredDataSetTable?.length > 0 ? (pageSetTable - 1) * pageSizeSetTable + 1 : 0} to {Math.min(pageSetTable * pageSizeSetTable, filteredDatasSetTable?.length)} of {filteredDatasSetTable?.length} entries
                                    </Box>
                                    <Box>
                                        <Button onClick={() => setPageSetTable(1)} disabled={pageSetTable === 1} sx={userStyle.paginationbtn}>
                                            <FirstPageIcon />
                                        </Button>
                                        <Button onClick={() => handlePageChangeSetTable(pageSetTable - 1)} disabled={pageSetTable === 1} sx={userStyle.paginationbtn}>
                                            <NavigateBeforeIcon />
                                        </Button>
                                        {pageNumbersSetTable?.map((pageNumberSetTable) => (
                                            <Button key={pageNumberSetTable} sx={userStyle.paginationbtn} onClick={() => handlePageChangeSetTable(pageNumberSetTable)} className={pageSetTable === pageNumberSetTable ? "active" : ""} disabled={pageSetTable === pageNumberSetTable}>
                                                {pageNumberSetTable}
                                            </Button>
                                        ))}
                                        {lastVisiblePageSetTable < totalPagesSetTable && <span>...</span>}
                                        <Button onClick={() => handlePageChangeSetTable(pageSetTable + 1)} disabled={pageSetTable === totalPagesSetTable} sx={userStyle.paginationbtn}>
                                            <NavigateNextIcon />
                                        </Button>
                                        <Button onClick={() => setPageSetTable(totalPagesSetTable)} disabled={pageSetTable === totalPagesSetTable} sx={userStyle.paginationbtn}>
                                            <LastPageIcon />
                                        </Button>
                                    </Box>
                                </Box>
                            </>
                        )}
                    </Box><br />
                </>
            )}

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

            {/* Print layout for Set Table */}
            <TableContainer component={Paper} sx={userStyle.printcls} >
                <Table sx={{ minWidth: 700 }} aria-label="customized table" ref={componentRefSetTable} id="settablepdf">
                    <TableHead>
                        <TableRow >
                            <TableCell sx={{ fontSize: '14px', fontWeight: "550", }}>S.No</TableCell>
                            <TableCell sx={{ fontSize: '14px', fontWeight: "550", }}>Company</TableCell>
                            <TableCell sx={{ fontSize: '14px', fontWeight: "550", }}>Branch</TableCell>
                            <TableCell sx={{ fontSize: '14px', fontWeight: "550", }}>Unit</TableCell>
                            <TableCell sx={{ fontSize: '14px', fontWeight: "550", }}>Team</TableCell>
                            <TableCell sx={{ fontSize: '14px', fontWeight: "550", }}>Department</TableCell>
                            <TableCell sx={{ fontSize: '14px', fontWeight: "550", }}>Name</TableCell>
                            <TableCell sx={{ fontSize: '14px', fontWeight: "550", }}>Shift</TableCell>
                            {/* Render date columns dynamically */}
                            {filteredColumnsSetTable.map((column, index) => {
                                return (
                                    <React.Fragment key={index}>
                                        <StyledTableCell>
                                            <Box sx={userStyle.tableheadstyle}>
                                                {column.formattedDate}<br />
                                                {column.dayName}<br />
                                                {`Day ${column.dayCount}`}
                                            </Box>
                                        </StyledTableCell>
                                    </React.Fragment>
                                );
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody align="left">
                        {filteredDataSetTable &&
                            filteredDataSetTable.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell sx={{ fontSize: '14px' }}>{index + 1}</TableCell>
                                    <TableCell sx={{ fontSize: '14px' }}>{row.company}</TableCell>
                                    <TableCell sx={{ fontSize: '14px' }}>{row.branch}</TableCell>
                                    <TableCell sx={{ fontSize: '14px' }}>{row.unit}</TableCell>
                                    <TableCell sx={{ fontSize: '14px' }}>{row.team}</TableCell>
                                    <TableCell sx={{ fontSize: '14px' }}>{row.department}</TableCell>
                                    <TableCell sx={{ fontSize: '14px' }}>{row.username}</TableCell>
                                    <TableCell sx={{ fontSize: '14px' }}>{row.shifttiming}</TableCell>
                                    {/* Render "Not Allot" for each date column */}
                                    {filteredColumnsSetTable && (
                                        filteredColumnsSetTable.map((column, index) => {
                                            let filteredRowData = allUserDates.filter((val) => val.empcode == row.empcode)

                                            // Find the corresponding status for the current formattedDate
                                            const matchingItem = filteredRowData.find(item => item.date == column.formattedDate);
                                            const isWeekOff = row.weekoff?.includes(column.dayName);

                                            return (
                                                <React.Fragment key={index}>
                                                    <StyledTableCell>
                                                        <Button color={matchingItem && matchingItem.status === 'Alloted' ? 'success' : isWeekOff ? 'warning' : 'error'} variant="contained" size="small"
                                                            sx={{
                                                                fontSize: '10px', textTransform: 'capitalize', borderRadius: '15px', height: '20px', padding: '1px 8px',
                                                                display: 'flex',
                                                            }}
                                                        >
                                                            {matchingItem ? matchingItem.status : (isWeekOff ? 'Week Off' : 'Not Allot')}
                                                        </Button>
                                                    </StyledTableCell>
                                                </React.Fragment>
                                            );
                                        })
                                    )}
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Edit Model */}
            <Dialog open={openEdit} onClose={handleClickOpenEdit} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" 
            maxWidth="lg"
            sx={{
                overflow: 'visible',
                '& .MuiPaper-root': {
                  overflow: 'visible',
                },
              }}
              >
                <Box sx={{ padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}> Shift Allot</Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={1.5} sm={12} xs={12} >
                                <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Employee</Typography>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <TextField readOnly size="small" value={shiftRoasterEdit.username} />
                                    <TextField readOnly size="small" value={shiftRoasterEdit.empcode} sx={{ display: 'none' }} />
                                </FormControl>
                            </Grid>
                            <Grid item md={1.5} sm={12} xs={12} >
                                <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Date</Typography>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} sx={{ display: 'flex' }}>
                                <FormControl fullWidth size="small" >
                                    <TextField readOnly size="small" value={shiftRoasterEdit.formattedDate} />
                                </FormControl>
                                <FormControl fullWidth size="small" >
                                    <TextField readOnly size="small" value={`Day ${shiftRoasterEdit.dayCount}`} />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}></Grid>
                            <Grid item md={1.5} xs={12} sm={12} >
                                <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Mode</Typography>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Selects size="small"
                                        options={modeoptions}
                                        styles={colourStyles}
                                        value={{ label: shiftRoasterEdit.mode, value: shiftRoasterEdit.mode }}
                                        onChange={(e) => {
                                            setShiftRoasterEdit({ ...shiftRoasterEdit, mode: e.value });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            {shiftRoasterEdit.mode == "Shift" ? (
                                <>
                                    <Grid item md={1.5} xs={12} sm={12}>
                                        <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Shift</Typography>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12} >
                                        <FormControl fullWidth size="small">
                                            <Selects size="small"
                                                options={shiftRoasterEdit.secondmode == "Double Shift" ? shiftsFiltered : shifts}
                                                styles={colourStyles}
                                                value={{ label: shiftRoasterEdit.shift, value: shiftRoasterEdit.shift }}
                                                onChange={(e) => {
                                                    setShiftRoasterEdit({ ...shiftRoasterEdit, shift: e.value });
                                                    getShiftTime(e.value);
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}></Grid>
                                    <Grid item md={1.5} xs={12} sm={12} >
                                        <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>First Shift</Typography>
                                    </Grid>
                                    <Grid item md={2.5} xs={12} sm={12} >
                                        <FormControl fullWidth size="small">
                                            <TextField readOnly size="small" value={shiftTime} />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={1.5} xs={12} sm={12} >
                                        <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>2nd ShiftMode</Typography>
                                    </Grid>
                                    <Grid item md={2.5} xs={12} sm={12} >
                                        <FormControl fullWidth size="small">
                                            <Selects
                                                size="small"
                                                options={secondmodeoptions}
                                                styles={colourStyles}
                                                value={{ label: shiftRoasterEdit.secondmode, value: shiftRoasterEdit.secondmode }}
                                                onChange={handleSecondModeChange}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={1.5} xs={12} sm={12}>
                                        <Typography sx={{ fontSize: '14px', marginTop: '10px', }}>Pluse Shift</Typography>
                                    </Grid>
                                    <Grid item md={2.5} xs={12} sm={12} >
                                        <FormControl fullWidth size="small">
                                            <TextField readOnly size="small" value={secondShiftTime} />
                                        </FormControl>
                                    </Grid>
                                </>
                            ) : null}
                        </Grid>
                        <br /> <br /> <br />
                        <Grid container >
                            <Grid item md={1}>
                                <Button variant="contained" color="primary" onClick={sendRequest}> {" "} Save{" "}  </Button>
                            </Grid>
                            <Grid item md={1}>
                                <Button variant="contained" sx={userStyle.btncancel} onClick={handleClear}> {" "} Clear{" "} </Button>
                            </Grid>
                            <Grid item md={1}>
                                <Button variant="contained" sx={userStyle.btncancel} onClick={handleCloseEdit}> {" "} Close{" "} </Button>
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

export default SetList;