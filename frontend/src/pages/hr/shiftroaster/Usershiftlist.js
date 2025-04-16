import React, { useState, useEffect, useRef, useContext } from "react";
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { Box, Typography, OutlinedInput, TableBody, TableRow, TableCell, Select, Badge, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton } from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { FaPrint, FaFilePdf, FaFileExcel, FaFileCsv } from "react-icons/fa";
import { CSVLink } from 'react-csv';
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { useReactToPrint } from "react-to-print";
import moment from "moment";
import { UserRoleAccessContext, AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import { handleApiError } from "../../../components/Errorhandling";
import { ThreeDots } from "react-loader-spinner";
import Selects from "react-select";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import StyledDataGrid from "../../../components/TableStyle";
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
import { format } from 'date-fns';

function UserShiftListTable() {

    const gridRefFinalAdj = useRef(null);
    const { auth } = useContext(AuthContext);
    const { isUserRoleCompare } = useContext(UserRoleAccessContext);
    const [allUsers, setAllUsers] = useState([]);
    const [itemsFinalAdj, setItemsFinalAdj] = useState([])
    const [selectedRowsFinalAdj, setSelectedRowsFinalAdj] = useState([]);
    const [copiedDataFinalAdj, setCopiedDataFinalAdj] = useState("");
    const [selectAllCheckedFinalAdj, setSelectAllCheckedFinalAdj] = useState(false);
    const [allFinalAdj, setAllFinalAdj] = useState(false);
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

    //get all Users
    const fetchUsers = async () => {
        try {
            let res = await axios.get(SERVICE.USER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let useraccess = res?.data?.users?.filter((user) => {
                if (!user?.role?.includes('Manager') || !user?.role?.includes('Superadmin') || !user?.role?.includes('HR') || !user?.role?.includes('HiringManager')) {
                    if (auth.loginuserid == user._id) {
                        return user
                    }
                }
                return user
            })

            let groupedUsers = useraccess?.reduce((acc, user) => {
                user.shiftallot.forEach((allot) => {
                    const existingUser = acc.find((item) => item.userid === user._id);

                    if (existingUser) {
                        existingUser.days.push({
                            date: allot.date,
                            day: allot.day,
                            daycount: allot.daycount,
                            mode: allot.mode,
                            shift: allot.mode,
                            firstshift: allot.firstshift,
                            secondmode: allot.secondmode,
                            pluseshift: allot.pluseshift,
                            status: allot.status,
                            shiftallows: allot.shiftallows,
                            _id: allot._id,
                            adjapplydate: allot.adjapplydate == undefined ? "" : allot.adjapplydate,
                            adjapplytime: allot.adjapplytime == undefined ? "" : allot.adjapplytime,
                            adjchangereason: allot.adjchangereason == undefined ? "" : allot.adjchangereason,
                            adjchangeshift: allot.adjchangeshift == undefined ? "" : allot.adjchangeshift,
                            adjchangeshiftime: allot.adjchangeshiftime == undefined ? "" : allot.adjchangeshiftime,
                            adjdate: allot.adjdate == undefined ? "" : allot.adjdate,
                            adjfirstshiftmode: allot.adjfirstshiftmode == undefined ? "" : allot.adjfirstshiftmode,
                            adjfirstshifttime: allot.adjfirstshifttime == undefined ? "" : allot.adjfirstshifttime,
                            adjstatus: allot.adjstatus == undefined ? "" : allot.adjstatus,
                            adjtypereason: allot.adjtypereason == undefined ? "" : allot.adjtypereason,
                            adjtypeshift: allot.adjtypeshift == undefined ? "" : allot.adjtypeshift,
                            adjtypeshifttime: allot.adjtypeshifttime == undefined ? "" : allot.adjtypeshifttime,
                            adjustmentstatus: allot.adjustmentstatus == undefined ? "" : allot.adjustmentstatus,
                            adjustmenttype: allot.adjustmenttype == undefined ? "" : allot.adjustmenttype,
                        });
                    } else {
                        acc.push({
                            userid: user._id,
                            company: user.company,
                            branch: user.branch,
                            unit: user.unit,
                            team: user.team,
                            department: user.department,
                            username: user.companyname,
                            empcode: user.empcode,
                            shifttiming: user.shifttiming,
                            weekoff: user.weekoff,
                            days: [
                                {
                                    date: allot.date,
                                    day: allot.day,
                                    daycount: allot.daycount,
                                    mode: allot.mode,
                                    shift: allot.mode,
                                    firstshift: allot.firstshift,
                                    secondmode: allot.secondmode,
                                    pluseshift: allot.pluseshift,
                                    status: allot.status,
                                    shiftallows: allot.shiftallows,
                                    _id: allot._id,
                                    adjapplydate: allot.adjapplydate == undefined ? "" : allot.adjapplydate,
                                    adjapplytime: allot.adjapplytime == undefined ? "" : allot.adjapplytime,
                                    adjchangereason: allot.adjchangereason == undefined ? "" : allot.adjchangereason,
                                    adjchangeshift: allot.adjchangeshift == undefined ? "" : allot.adjchangeshift,
                                    adjchangeshiftime: allot.adjchangeshiftime == undefined ? "" : allot.adjchangeshiftime,
                                    adjdate: allot.adjdate == undefined ? "" : allot.adjdate,
                                    adjfirstshiftmode: allot.adjfirstshiftmode == undefined ? "" : allot.adjfirstshiftmode,
                                    adjfirstshifttime: allot.adjfirstshifttime == undefined ? "" : allot.adjfirstshifttime,
                                    adjstatus: allot.adjstatus == undefined ? "" : allot.adjstatus,
                                    adjtypereason: allot.adjtypereason == undefined ? "" : allot.adjtypereason,
                                    adjtypeshift: allot.adjtypeshift == undefined ? "" : allot.adjtypeshift,
                                    adjtypeshifttime: allot.adjtypeshifttime == undefined ? "" : allot.adjtypeshifttime,
                                    adjustmentstatus: allot.adjustmentstatus == undefined ? "" : allot.adjustmentstatus,
                                    adjustmenttype: allot.adjustmenttype == undefined ? "" : allot.adjustmenttype,
                                },
                            ],
                        });
                    }
                });
                return acc;
            }, []);

            setAllUsers(groupedUsers);
            setAllFinalAdj(true);
        } catch (err) {setAllFinalAdj(true);handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    useEffect(() => {
        fetchUsers();
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

    const currentDate = new Date(); // Get the current date
  
    // Get the total number of days in the month
    const daysInMonth = getDaysInMonth(isMonthyear.isyear, isMonthyear.ismonth);

    // Create an array of days from 1 to the total number of days in the month
    const daysArray = Array.from(new Array(daysInMonth), (val, index) => {
        const dayOfMonth = index + 1;
        const currentDate = new Date(isMonthyear.isyear, isMonthyear.ismonth - 1, dayOfMonth);
        const formattedDate = format(currentDate, 'dd/MM/yyyy');
        const dayName = format(currentDate, 'EEEE'); // EEEE gives the full day name (e.g., Monday)
        return { dayOfMonth, formattedDate, dayName };
    });

    const handleSelectionChange = (newSelection) => {
        setSelectedRowsFinalAdj(newSelection.selectionModel);
    };

    const addSerialNumberSetTable = () => {
        const itemsWithSerialNumber = allUsers?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
        setItemsFinalAdj(itemsWithSerialNumber);
    };

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
        branch: true,
        unit: true,
        ...daysArray.reduce((acc, day, index) => {
            acc[`${index + 1}`] = true;
            return acc;
        }, {}),
    };

    const [columnVisibilityFinalAdj, setColumnVisibilityFinalAdj] = useState(initialColumnVisibilityFinalAdj);

    const formatDate = (inputDate) => {
        // Assuming inputDate is in the format "dd-mm-yyyy"
        const [day, month, year] = inputDate.split('/');

        // Use padStart to add leading zeros
        const formattedDay = String(day).padStart(2, '0');
        const formattedMonth = String(month).padStart(2, '0');

        return `${formattedDay}/${formattedMonth}/${year}`;
    };

    const CheckboxHeader = ({ selectAllCheckedFinalAdj, onSelectAll }) => (
        <div>
            <Checkbox checked={selectAllCheckedFinalAdj} onChange={onSelectAll} />
        </div>
    );

    const columnDataTableFinalAdj = [
        {
            field: "checkbox",
            headerName: "Checkbox", // Default header name
            headerStyle: { fontWeight: "bold", },
            renderHeader: (params) => (
                <CheckboxHeader
                    selectAllCheckedFinalAdj={selectAllCheckedFinalAdj}
                    onSelectAll={() => {
                        if (rowDataTableFinalAdj?.length === 0) {
                            // Do not allow checking when there are no rows
                            return;
                        }
                        if (selectAllCheckedFinalAdj) {
                            setSelectedRowsFinalAdj([]);
                        } else {
                            const allRowIds = rowDataTableFinalAdj?.map((row) => row.id);
                            setSelectedRowsFinalAdj(allRowIds);
                        }
                        setSelectAllCheckedFinalAdj(!selectAllCheckedFinalAdj);
                    }}
                />
            ),

            renderCell: (params) => (
                <Checkbox
                    checked={selectedRowsFinalAdj.includes(params.row.id)}
                    onChange={() => {
                        let updatedSelectedRows;
                        if (selectedRowsFinalAdj.includes(params.row.id)) {
                            updatedSelectedRows = selectedRowsFinalAdj.filter((selectedId) => selectedId !== params.row.id);
                        } else {
                            updatedSelectedRows = [...selectedRowsFinalAdj, params.row.id];
                        }

                        setSelectedRowsFinalAdj(updatedSelectedRows);

                        // Update the "Select All" checkbox based on whether all rows are selected
                        setSelectAllCheckedFinalAdj(updatedSelectedRows?.length === filteredDataFinalAdj?.length);
                    }}
                />
            ),
            sortable: false, // Optionally, you can make this column not sortable
            width: 70,
            hide: !columnVisibilityFinalAdj.checkbox,
            headerClassName: "bold-header",
        },
        { field: "serialNumber", headerName: "SNo", flex: 0, width: 75, hide: !columnVisibilityFinalAdj.serialNumber, headerClassName: "bold-header", },
        { field: "empcode", headerName: "Emp Code", flex: 0, width: 150, hide: !columnVisibilityFinalAdj.empcode, headerClassName: "bold-header" },
        { field: "username", headerName: "Name", flex: 0, width: 150, hide: !columnVisibilityFinalAdj.username, headerClassName: "bold-header" },
        { field: "branch", headerName: "Branch", flex: 0, width: 150, hide: !columnVisibilityFinalAdj.branch, headerClassName: "bold-header" },
        { field: "unit", headerName: "Unit", flex: 0, width: 100, hide: !columnVisibilityFinalAdj.unit, headerClassName: "bold-header" },
        ...daysArray.map((column, index) => ({
            field: `${index + 1}`,
            headerName: `${column.formattedDate}\n${column.dayName}`,
            flex: 0,
            width: 150,
            sortable: false,
            renderCell: (params) => {
                const dayData = params.row.days[daysArray[index].formattedDate];

                return (
                    <TableCell>
                        <Typography variant="subtitle1" sx={{ fontSize: '12px' }}>
                            {dayData}
                        </Typography>
                    </TableCell>
                )
            },
        })),
    ];

    const rowDataTableFinalAdj = filteredDataFinalAdj?.map((item) => {
        const rowData = {
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
        };

        // Create an object to store data for each day
        const dayData = {};

        daysArray.forEach((column) => {
            // Check if the current day is Sunday
            const isSunday = column.dayName === "Sunday";

            // If it's Sunday, set the default value to "Week Off"
            if (isSunday) {
                dayData[column.formattedDate] = (
                    <Box sx={{ background: '#6EDCD9', color: 'white', borderRadius: '20px', padding: '1px 8px', fontSize: '10px', fontWeight: 'bold', height: '20px' }}>
                        {"Week Off"}
                    </Box>
                )
                return; // Move to the next iteration
            }

            // Find the dayData corresponding to the current date
            const matchingDay = item.days.find((day) =>
                moment(day.adjdate).format("DD/MM/YYYY") === column.formattedDate
            );

            const matchingDay2 = item.days.find((day) =>
                formatDate(day.date) === column.formattedDate
            );

            // Use the matchingDay data to populate the dayData object 2e7d32 b6e388
            if (matchingDay && matchingDay.adjstatus === "Approved") {
                dayData[column.formattedDate] = (
                    matchingDay.adjtypeshifttime ? (
                        <Box sx={{ background: '#65b741', color: 'white', borderRadius: '10px', padding: '1px 8px', fontSize: '10px', fontWeight: 'bold', height: '20px' }}>
                            {matchingDay.adjtypeshifttime}
                        </Box>
                    ) : (
                        <Box sx={{ background: 'red', color: 'white', borderRadius: '10px', padding: '1px 8px', fontSize: '10px', fontWeight: 'bold', height: '20px' }}>
                            No Data
                        </Box>
                    )
                );
            }
            else if (matchingDay2 && (matchingDay2.adjstatus === undefined || matchingDay2.adjstatus === "" || matchingDay2.adjstatus === "Reject" || matchingDay2.adjstatus === "Not Approved")) {

                dayData[column.formattedDate] = (
                    matchingDay2.firstshift ?
                        <Box sx={{ background: '#e7b10a', color: 'white', borderRadius: '10px', padding: '1px 8px', fontSize: '10px', fontWeight: 'bold', height: '20px' }}>
                            {(`${matchingDay2.firstshift.split(' - ')[0]} to ${matchingDay2.firstshift.split(' - ')[1]}`)} <br />
                            {(`${matchingDay2.pluseshift.split(' - ')[0]} to ${matchingDay2.pluseshift.split(' - ')[1]}`)}
                        </Box>
                        :
                        <Box sx={{ background: '#6EDCD9', color: 'white', borderRadius: '20px', padding: '2px 10px', fontSize: '10px', fontWeight: 'bold' }}>
                            {matchingDay2.mode}
                        </Box>
                )

            }
            else {
                item.days.map((day) => {
                    if (day.adjstatus === "Approved") {
                        if (formatDate(day.date) === column.formattedDate) {
                            dayData[column.formattedDate] = (
                                item.weekoff?.includes(column.dayName) ?
                                    <Box sx={{ background: '#6EDCD9', color: 'white', borderRadius: '20px', padding: '1px 8px', fontSize: '10px', fontWeight: 'bold', height: '20px' }}>
                                        {"Week Off"}
                                    </Box>
                                    :
                                    <Badge color="secondary" badgeContent={"Adjusted"}
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                            right: '8px',
                                            top: "-2px",
                                            fontSize: '7px',
                                            height: '15px',
                                        }}
                                    >
                                        <Box sx={{ background: '#827397', color: 'white', borderRadius: '10px', padding: '1px 8px', fontSize: '10px', fontWeight: 'bold', height: '20px' }}>
                                            {item.shifttiming}
                                        </Box>
                                    </Badge>
                            )
                        } else {
                            dayData[column.formattedDate] = (
                                item.weekoff?.includes(column.dayName) ?
                                    <Box sx={{ background: '#6EDCD9', color: 'white', borderRadius: '20px', padding: '1px 8px', fontSize: '10px', fontWeight: 'bold', height: '20px' }}>
                                        {"Week Off"}
                                    </Box>
                                    :
                                    <Box sx={{ background: '#827397', color: 'white', borderRadius: '10px', padding: '1px 8px', fontSize: '10px', fontWeight: 'bold', height: '20px' }}>
                                        {item.shifttiming}
                                    </Box>
                            )
                        }
                    }
                })
            }
        });

        // Add the dayData object to the rowData object
        rowData.days = dayData;

        return rowData;
    });

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
    const headers = [
        'S.No',
        'Emp Code',
        'Name',
        'Branch',
        'Unit',
        // Add headers for date columns dynamically
        ...daysArray.map(column => `${column.formattedDate}\n${column.dayName}`),
    ];

    // Constructing data in the required format
    const data = [
        headers, // First row should be headers
        ...filteredDataFinalAdj.map((item) => {
            const rowData = [
                item.serialNumber,
                item.empcode,
                item.username,
                item.branch,
                item.unit,
            ];

            // Create an object to store data for each day
            const dayData = {};

            daysArray.forEach((column) => {
                // // Check if the current day is Sunday
                // const isSunday = column.dayName === "Sunday";

                // // If it's Sunday, set the default value to "Week Off"
                // if (isSunday) {
                //     rowData.push("Week Off");
                //     return; // Move to the next iteration
                // }

                // Find the dayData corresponding to the current date
                const matchingDay = item.days.find(
                    (day) =>
                        moment(day.adjdate).format("DD/MM/YYYY") === column.formattedDate
                );

                const matchingDay2 = item.days.find(
                    (day) => formatDate(day.date) === column.formattedDate
                );


                let dayValue = "";

                // Use the matchingDay data to populate the dayData object
                if (matchingDay && matchingDay.adjstatus === "Approved") {
                    dayValue = matchingDay.adjtypeshifttime || "No Data";
                } else if (
                    matchingDay2 &&
                    (matchingDay2.adjstatus === undefined ||
                        matchingDay2.adjstatus === "" ||
                        matchingDay2.adjstatus === "Reject" ||
                        matchingDay2.adjstatus === "Not Approved")
                ) {
                    dayValue = matchingDay2.firstshift
                        ? `${matchingDay2.firstshift.split(' - ')[0]} to ${matchingDay2.firstshift.split(' - ')[1]}\n${matchingDay2.pluseshift.split(' - ')[0]} to ${matchingDay2.pluseshift.split(' - ')[1]}`
                        : matchingDay2.mode;
                } else {
                    item.days.map((day) => {
                        if (day.adjstatus === "Approved") {
                            if (formatDate(day.date) === column.formattedDate) {
                                dayValue = item.weekoff?.includes(column.dayName) ? "Week Off" : `Adjusted\n${item.shifttiming}`;
                            } else {
                                dayValue = item.weekoff?.includes(column.dayName) ? "Week Off" : item.shifttiming;
                            }
                        }
                    })
                }

                rowData.push(dayValue);
            });

            return rowData;
        }),
    ];

    // print...
    const componentRefSetTable = useRef();
    const handleprintSetTable = useReactToPrint({
        content: () => componentRefSetTable.current,
        documentTitle: "User Shift List",
        pageStyle: "print",
    });

    // // pdf.....
    // const downloadPdfSetTable = () => {
    //     const doc = new jsPDF({ orientation: "landscape" });
    //     doc.autoTable({
    //         theme: "grid",
    //         styles: { fontSize: 4, },
    //         width: 'max-content',
    //         html: '#usershiftlistpdf'
    //     })
    //     doc.save("User Shift List.pdf");
    // };

    const downloadPdfSetTable = () => {
        const doc = new jsPDF({ orientation: "landscape" });

        // Define the table headers
        const headers = ["S.No", "Emp Code", "Name", "Branch", "Unit", ...daysArray.map(column => `${column.formattedDate}\n${column.dayName}`),];

        // Constructing data in the required format
        const data = [
            // First row should be headers
            ...filteredDataFinalAdj.map((item) => {
                const rowData = [
                    item.serialNumber,
                    item.empcode,
                    item.username,
                    item.branch,
                    item.unit,
                ];

                // Create an object to store data for each day
                const dayData = {};

                daysArray.forEach((column) => {
                    // // Check if the current day is Sunday
                    // const isSunday = column.dayName === "Sunday";

                    // // If it's Sunday, set the default value to "Week Off"
                    // if (isSunday) {
                    //     rowData.push("Week Off");
                    //     return; // Move to the next iteration
                    // }

                    // Find the dayData corresponding to the current date
                    const matchingDay = item.days.find(
                        (day) =>
                            moment(day.adjdate).format("DD/MM/YYYY") === column.formattedDate
                    );

                    const matchingDay2 = item.days.find(
                        (day) => formatDate(day.date) === column.formattedDate
                    );

                    let dayValue = ""; // Default value

                    // Use the matchingDay data to populate the dayData object
                    if (matchingDay && matchingDay.adjstatus === "Approved") {
                        dayValue = matchingDay.adjtypeshifttime;
                    } else if (
                        matchingDay2 &&
                        (matchingDay2.adjstatus === undefined ||
                            matchingDay2.adjstatus === "" ||
                            matchingDay2.adjstatus === "Reject" ||
                            matchingDay2.adjstatus === "Not Approved")
                    ) {
                        dayValue = matchingDay2.firstshift
                            ? `${matchingDay2.firstshift.split(' - ')[0]} to ${matchingDay2.firstshift.split(' - ')[1]}`
                            : matchingDay2.mode;
                    } else {
                        item.days.map((day) => {
                            if (day.adjstatus === "Approved") {
                                if (formatDate(day.date) === column.formattedDate) {
                                    dayValue = item.weekoff?.includes(column.dayName) ? "Week Off" : `Adjusted\n${item.shifttiming}`;
                                } else {
                                    dayValue = item.weekoff?.includes(column.dayName) ? "Week Off" : item.shifttiming;
                                }
                            }
                        })
                    }

                    rowData.push(dayValue);
                });

                return rowData;
            }),
        ];

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
                margin: { top: 20, left: 10, right: 10, bottom: 10 } // Adjust margin as needed
            });
        });

        doc.save("User Shift List.pdf");
    };

    // image
    const handleCaptureImageSetTable = () => {
        if (gridRefFinalAdj.current) {
            html2canvas(gridRefFinalAdj.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "User Shift List.png");
                });
            });
        }
    };

    return (
        <Box>
            <Headtitle title={"USER SHIFT LIST"} />
            {/* ****** Header Content ****** */}
            <Typography sx={userStyle.HeaderText}>User Shift List</Typography> <br />

            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lshiftadjustment") && (
                <>
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}

                        <Grid container spacing={2}>
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
                        </Grid><br /><br /><br />
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
                                        <MenuItem value={allUsers?.length}>All</MenuItem>
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
                                                    table="usershiftlistpdf"
                                                    filename="User Shift List"
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
                                                filename="User Shift List.csv"
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
                                        <OutlinedInput id="component-outlined" type="text" value={searchQueryFinalAdj} onChange={handleSearchChangeSetTable} />
                                    </FormControl>
                                </Box>
                            </Grid>
                        </Grid>  <br />
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumnsFinalAdj}> Show All Columns </Button>  &ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsFinalAdj}>  Manage Columns </Button> &ensp;
                        {/* <Button variant="contained" color="error" onClick={handleClickOpenalert}> Bulk Delete  </Button>  */}
                        <br /> <br />
                        {!allFinalAdj ? (
                            <>
                                <Box sx={{ display: "flex", justifyContent: "center" }}>
                                    <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                                </Box>
                            </>
                        ) : (
                            <>
                                <Box style={{ width: "100%", overflowY: "hidden", }}>
                                    <StyledDataGrid onClipboardCopy={(copiedString) => setCopiedDataFinalAdj(copiedString)} rows={rowsWithCheckboxesFinalAdj} columns={columnDataTableFinalAdj.filter((column) => columnVisibilityFinalAdj[column.field])} onSelectionModelChange={handleSelectionChange} selectionModel={selectedRowsFinalAdj} autoHeight={true} ref={gridRefFinalAdj} id="settableexcel" density="compact" hideFooter getRowClassName={getRowClassName} disableRowSelectionOnClick />
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
                        )}
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
                <Table sx={{ minWidth: 700 }} aria-label="customized table" ref={componentRefSetTable} id="usershiftlistpdf">
                    <TableHead>
                        <TableRow >
                            <TableCell sx={{ fontSize: '14px', fontWeight: "550", }}>S.No</TableCell>
                            <TableCell sx={{ fontSize: '14px', fontWeight: "550", }}>Emp Code</TableCell>
                            <TableCell sx={{ fontSize: '14px', fontWeight: "550", }}>Name</TableCell>
                            <TableCell sx={{ fontSize: '14px', fontWeight: "550", }}>Branch</TableCell>
                            <TableCell sx={{ fontSize: '14px', fontWeight: "550", }}>Unit</TableCell>
                            {daysArray && (
                                daysArray.map(({ formattedDate, dayName }, i) => (
                                    <React.Fragment key={i}>
                                        <TableCell sx={{ fontSize: '14px', fontWeight: "550", }}>{formattedDate} <br />{dayName}</TableCell>
                                    </React.Fragment>
                                ))
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody align="left">
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

                                daysArray.forEach((column) => {
                                    // const isSunday = column.dayName === "Sunday";

                                    // if (isSunday) {
                                    //     rowData.push("Week Off");
                                    //     return;
                                    // }

                                    const matchingDay = item.days.find(
                                        (day) =>
                                            moment(day.adjdate).format("DD/MM/YYYY") ===
                                            column.formattedDate
                                    );

                                    const matchingDay2 = item.days.find(
                                        (day) => formatDate(day.date) === column.formattedDate
                                    );

                                    let dayValue = "";

                                    if (matchingDay && matchingDay.adjstatus === "Approved") {
                                        dayValue = matchingDay.adjtypeshifttime || "No Data";
                                    }
                                    else if (
                                        matchingDay2 &&
                                        (matchingDay2.adjstatus === undefined ||
                                            matchingDay2.adjstatus === "" ||
                                            matchingDay2.adjstatus === "Reject" ||
                                            matchingDay2.adjstatus === "Not Approved")
                                    ) {
                                        dayValue = matchingDay2.firstshift
                                            ? `${matchingDay2.firstshift.split(' - ')[0]} to ${matchingDay2.firstshift.split(' - ')[1]}\n${matchingDay2.pluseshift.split(' - ')[0]} to ${matchingDay2.pluseshift.split(' - ')[1]}`
                                            : matchingDay2.mode;
                                    }
                                    else {
                                        item.days.map((day) => {
                                            if (day.adjstatus === "Approved") {
                                                if (formatDate(day.date) === column.formattedDate) {
                                                    dayValue = item.weekoff?.includes(column.dayName) ? "Week Off" : `Adjusted\n${item.shifttiming}`;
                                                } else {
                                                    dayValue = item.weekoff?.includes(column.dayName) ? "Week Off" : item.shifttiming;
                                                }
                                            }
                                        })
                                    }

                                    // Push plain text values with color codes
                                    rowData.push(dayValue);
                                });

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
                    </TableBody>
                </Table>
            </TableContainer>

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

export default UserShiftListTable;