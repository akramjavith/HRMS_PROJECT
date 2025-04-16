import React, { useState, useEffect, useRef, useContext } from "react";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { FaFileExcel, FaFileCsv } from 'react-icons/fa';
import { Box, Typography, OutlinedInput, TableBody, TableRow, TableCell, Select, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton } from "@mui/material";
import { userStyle } from "../../pageStyle";
import { FaPrint, FaFilePdf, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { ExportXL, ExportCSV } from "../../components/Export";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../services/Baseservice";
import { handleApiError } from "../../components/Errorhandling";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import StyledDataGrid from "../../components/TableStyle";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext, AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import Resizable from "react-resizable";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import Selects from "react-select";
import { MultiSelect } from "react-multi-select-component";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import LoadingButton from "@mui/lab/LoadingButton";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

function LeaveBlockDayList() {

    const [leavecriteriaEdit, setLeavecriteriaEdit] = useState({});

    // // get current year
    // const currentYear = new Date().getFullYear();
    // const years = Array.from(new Array(10), (val, index) => currentYear + index);

    const [leavecriterias, setLeavecriterias] = useState([]);
    const [leavecriteriasAllEdit, setLeavecriteriasAllEdit] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    const { isUserRoleCompare, isUserRoleAccess } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);

    const [leavecriteriaCheck, setLeavecriteriacheck] = useState(false);

    const [todosCheck, setTodosCheck] = useState([]);
    const [editingIndexCheck, setEditingIndexCheck] = useState(-1);
    const [selectedOptionsDayEdit, setSelectedOptionsDayEdit] = useState([]);
    const [valueDayEdit, setValueDayEdit] = useState([]);
    const [todoSubmit, setTodoSubmit] = useState(false);

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };

    const days = [
        { label: 'Monday', value: "Monday" },
        { label: 'Tuesday', value: "Tuesday" },
        { label: 'Wednesday', value: "Wednesday" },
        { label: 'Thursday', value: "Thursday" },
        { label: 'Friday', value: "Friday" },
        { label: 'Saturday', value: "Saturday" },
        { label: 'Sunday', value: "Sunday" },
    ];
    const monthstring = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentMonthIndex = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const getCurrentWeekOfMonth = () => {
        const date = new Date();
        const startWeekDayIndex = 1; // Assuming week starts on Monday
        const firstDate = new Date(date.getFullYear(), date.getMonth(), 1);
        const firstDay = firstDate.getDay();
        const offset = (firstDay - startWeekDayIndex + 7) % 7;
        return Math.ceil((date.getDate() + offset) / 7);
    };

    const currentWeek = getCurrentWeekOfMonth();

    const username = isUserRoleAccess.username;

    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [copiedData, setCopiedData] = useState("");

    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "Leave Block Day.png");
                });
            });
        }
    };

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };

    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // view model
    const [openview, setOpenview] = useState(false);
    const handleClickOpenview = () => { setOpenview(true); setEditingIndexCheck(-1); };
    const handleCloseview = () => {
        setOpenview(false);
        setSelectedOptionsDayEdit([]);
        setEditingIndexCheck(-1);
    };

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const handleClickOpenerr = () => { setIsErrorOpen(true); };
    const handleCloseerr = () => { setIsErrorOpen(false); };

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
        if (selectedRows.includes(params.row.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };


    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        company: true,
        branch: true,
        unit: true,
        team: true,
        employee: true,
        department: true,
        designation: true,
        leavetype: true,
        tookleavecheck: true,
        weekstartday: true,
        // tookleave: true,
        actions: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
    };

    const handleDayChangeEdit = (options) => {

        setValueDayEdit(
            options.map((a, index) => {
                return a.value;
            })
        );

        setSelectedOptionsDayEdit(options);
    };

    const customValueRendererDayEdit = (valueDayEdit, _documents) => {
        return valueDayEdit?.length ? valueDayEdit.map(({ label }) => label).join(", ") : "Please Select Day";
    };

    const handleDeleteTodoCheck = (index) => {
        const newTodoscheck = [...todosCheck];
        newTodoscheck.splice(index, 1);
        setTodosCheck(newTodoscheck);
    };

    const handleEditTodoCheck = (index) => {
        setEditingIndexCheck(index);

        setValueDayEdit(
            todosCheck[index]?.day?.map((a, index) => {
                return a?.value;
            })
        );
        setSelectedOptionsDayEdit(todosCheck[index].day.map((item) => ({
            ...item,
            label: item,
            value: item,
        })));


    };

    const handleUpdateTodoCheck = () => {

        const day = selectedOptionsDayEdit ? selectedOptionsDayEdit.map(item => item.value) : "";

        const newTodoscheck = [...todosCheck];

        newTodoscheck[editingIndexCheck].day = day;

        setTodosCheck(newTodoscheck);
        setEditingIndexCheck(-1);
        setValueDayEdit("")

    };

    // get single row to view....
    const getviewCode = async (e) => {
        try {
            let res = await axios.get(`${SERVICE.LEAVECRITERIA_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setLeavecriteriaEdit(res?.data?.sleavecriteria);
            let uniqueDayNames = Array.from(new Set(res?.data?.sleavecriteria?.tookleave.map((t) => t.day)));

            const mergedTodoList = res?.data?.sleavecriteria?.tookleave.reduce((acc, current) => {
                const existingEntry = acc.find(
                    item => item.year === current.year && item.month === current.month && item.week === current.week
                );

                if (existingEntry) {
                    existingEntry.day.push(current.day);
                } else {
                    acc.push({
                        year: current.year,
                        month: current.month,
                        week: current.week,
                        day: [current.day]
                    });
                }

                return acc;
            }, []);

            setTodosCheck(mergedTodoList);
            setSelectedOptionsDayEdit(uniqueDayNames.map((t) => ({
                label: t,
                value: t
            })));
            setValueDayEdit(uniqueDayNames);

        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    //Project updateby edit page...
    let updateby = leavecriteriaEdit?.updatedby;
    let subprojectsid = leavecriteriaEdit?._id;

    //editing the single data...
    const sendEditRequest = async () => {

        let newTodoCheckList = [];
        todosCheck.map((todo) => {
            todo.day.map((day) => {
                newTodoCheckList.push({
                    year: todo.year,
                    month: todo.month,
                    week: todo.week,
                    day: day
                });
            })
        })

        try {
            let res = await axios.put(`${SERVICE.LEAVECRITERIA_SINGLE}/${subprojectsid}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                tookleave: newTodoCheckList,
                updatedby: [
                    ...updateby,
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            await fetchLeavecriteria();
            handleCloseview();
            setShowAlert(
                <>
                    <CheckCircleOutline sx={{ fontSize: "100px", color: "green" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>Updated Successfully!</p>
                </>
            );
            handleClickOpenerr();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const editSubmit = async (e) => {
        e.preventDefault();
        if (selectedOptionsDayEdit.length === 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Day!"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (todoSubmit === true) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Update the todo and Submit!"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else {
            sendEditRequest();
        }
    };

    //get all Sub vendormasters.
    const fetchLeavecriteria = async () => {
        try {
            let res_vendor = await axios.get(SERVICE.LEAVECRITERIA, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setLeavecriteriacheck(true);
            setLeavecriterias(res_vendor?.data?.leavecriterias);
        } catch (err) { setLeavecriteriacheck(true); handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    //id for login...
    let loginid = localStorage.LoginUserId;
    let authToken = localStorage.APIToken;

    useEffect(() => {
        fetchLeavecriteria();
    }, []);

    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        };
    }, []);

    const [items, setItems] = useState([]);

    const addSerialNumber = () => {
        const itemsWithSerialNumber = leavecriterias?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
        setItems(itemsWithSerialNumber);
    };

    useEffect(() => {
        addSerialNumber();
    }, [leavecriterias]);

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

    const [selectAllChecked, setSelectAllChecked] = useState(false);

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
                        setSelectAllChecked(updatedSelectedRows.length === filteredData.length);
                    }}
                />
            ),
            sortable: false, // Optionally, you can make this column not sortable
            width: 90,

            hide: !columnVisibility.checkbox,
            headerClassName: "bold-header",
        },
        { field: "serialNumber", headerName: "SNo", flex: 0, width: 90, hide: !columnVisibility.serialNumber, headerClassName: "bold-header", },
        { field: "department", headerName: "Department", flex: 0, width: 90, hide: !columnVisibility.department, headerClassName: "bold-header" },
        { field: "designation", headerName: "Designation", flex: 0, width: 90, hide: !columnVisibility.designation, headerClassName: "bold-header" },
        { field: "company", headerName: "Company", flex: 0, width: 90, hide: !columnVisibility.company, headerClassName: "bold-header" },
        { field: "branch", headerName: "Branch", flex: 0, width: 90, hide: !columnVisibility.branch, headerClassName: "bold-header" },
        { field: "unit", headerName: "Unit", flex: 0, width: 90, hide: !columnVisibility.unit, headerClassName: "bold-header" },
        { field: "team", headerName: "Team", flex: 0, width: 90, hide: !columnVisibility.team, headerClassName: "bold-header" },
        { field: "employee", headerName: "Employee", flex: 0, width: 90, hide: !columnVisibility.employee, headerClassName: "bold-header" },
        { field: "leavetype", headerName: "Leavetype", flex: 0, width: 90, hide: !columnVisibility.leavetype, headerClassName: "bold-header" },
        { field: "tookleavecheck", headerName: "Took Leave", flex: 0, width: 90, hide: !columnVisibility.tookleavecheck, headerClassName: "bold-header" },
        { field: "weekstartday", headerName: "Week Start Day", flex: 0, width: 90, hide: !columnVisibility.weekstartday, headerClassName: "bold-header" },
        // { field: "tookleave", headerName: "Took Leave Day", flex: 0, width: 90, hide: !columnVisibility.tookleave, headerClassName: "bold-header" },
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
                    {isUserRoleCompare?.includes("vblockdayslist") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                handleClickOpenview();
                                getviewCode(params.row.id);
                            }}
                        >
                            <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
                        </Button>
                    )}
                </Grid>
            ),
        },
    ];

    const rowDataTable = filteredData.map((item, index) => {
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            team: item.team,
            employee: item.employee,
            department: item.department,
            designation: item.designation,
            leavetype: item.leavetype,
            tookleavecheck: item.tookleavecheck ? "YES" : "NO",
            weekstartday: item.weekstartday,
            // tookleave: item.tookleave.map(d => d),
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

    // Excel
    const fileName = "Leave Block Day";
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
                rowDataTable?.map((t, index) => ({
                    "SNo": index + 1,
                    "Company": Array.isArray(t.company) ? t.company.join(',') : "",
                    "Branch": Array.isArray(t.branch) ? t.branch.join(',') : "",
                    "Unit": Array.isArray(t.unit) ? t.unit.join(',') : "",
                    "Team": Array.isArray(t.team) ? t.team.join(',') : "",
                    "Employee": Array.isArray(t.employee) ? t.employee.join(',') : "",
                    "Department": Array.isArray(t.department) ? t.department.join(',') : "",
                    "Designation": Array.isArray(t.designation) ? t.designation.join(',') : "",
                    "Leave Type": t.leavetype,
                    "Took Leave": t.tookleavecheck,
                    "Week Start Day": t.weekstartday,
                })),
                fileName,
            );
        } else if (isfilter === "overall") {
            exportToCSV(
                leavecriterias.map((t, index) => ({
                    "SNo": index + 1,
                    "Company": Array.isArray(t.company) ? t.company.join(',') : "",
                    "Branch": Array.isArray(t.branch) ? t.branch.join(',') : "",
                    "Unit": Array.isArray(t.unit) ? t.unit.join(',') : "",
                    "Team": Array.isArray(t.team) ? t.team.join(',') : "",
                    "Employee": Array.isArray(t.employee) ? t.employee.join(',') : "",
                    "Department": Array.isArray(t.department) ? t.department.join(',') : "",
                    "Designation": Array.isArray(t.designation) ? t.designation.join(',') : "",
                    "Leave Type": t.leavetype,
                    "Took Leave": t.tookleavecheck ? "YES" : "NO",
                    "Week Start Day": t.weekstartday,
                })),
                fileName,
            );
        }
        setIsFilterOpen(false)
    };

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Leave Block Day",
        pageStyle: "print",
    });

    // pdf.....
    const columns = [
        { title: "SNo", field: "serialNumber" },
        { title: "Company", field: "company" },
        { title: "Branch", field: "branch" },
        { title: "Unit", field: "unit" },
        { title: "Team", field: "team" },
        { title: "Employee", field: "employee" },
        { title: "Department", field: "department" },
        { title: "Designation", field: "designation" },
        { title: "Leavetype", field: "leavetype" },
        { title: "Leave Todate", field: "leavetodate" },
        { title: "Took Leave", field: "tookleavecheck" },
        { title: "Week Start Day", field: "weekstartday" },
    ];

    const downloadPdf = (isfilter) => {

        const doc = new jsPDF();

        // Initialize serial number counter
        let serialNumberCounter = 1;

        // Modify row data to include serial number
        const dataWithSerial = isfilter === "filtered" ?
            rowDataTable.map((item, index) => ({
                ...item,
                serialNumber: serialNumberCounter++,
                company: item.company,
                branch: item.branch,
                unit: item.unit,
                team: item.team,
                employee: item.employee,
                department: item.department,
                designation: item.designation,
                leavetype: item.leavetype,
                tookleavecheck: item.tookleavecheck,
                weekstartday: item.weekstartday,
            }))
            :
            leavecriterias.map((item, index) => ({
                ...item,
                serialNumber: serialNumberCounter++,
                company: item.company,
                branch: item.branch,
                unit: item.unit,
                team: item.team,
                employee: item.employee,
                department: item.department,
                designation: item.designation,
                leavetype: item.leavetype,
                tookleavecheck: item.tookleavecheck ? "YES" : "NO",
                weekstartday: item.weekstartday,
            }))

        // Generate PDF
        doc.autoTable({
            theme: "grid",
            styles: { fontSize: 5 },
            // columns: columnsWithSerial,
            columns: columns.map((col) => ({ ...col, dataKey: col.field })),
            body: dataWithSerial,
            columnStyles: {
                serialNumber: { cellWidth: 10 },
                company: { cellWidth: 20 },
                branch: { cellWidth: 20 },
                unit: { cellWidth: 20 },
                team: { cellWidth: 20 },
                employee: { cellWidth: 20 },
                department: { cellWidth: 20 },
                designation: { cellWidth: 20 },
                leavetype: { cellWidth: 10 },
                tookleavecheck: { cellWidth: 10 },
                weekstartday: { cellWidth: 20 },
            },
            margin: { top: 20 },
            startY: 20,
        });

        doc.save("Leave Block Day.pdf");
    };

    return (
        <Box>
            <Headtitle title={"Leave Block Day"} />
            {/* ****** Header Content ****** */}
            <Typography sx={userStyle.HeaderText}>Leave Block Day</Typography>
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lblockdayslist") && (
                <>
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Leave Block Day List</Typography>
                        </Grid>
                        <br />
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
                                        {/* <MenuItem value={leavecriterias?.length}>All</MenuItem> */}
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Box>
                                    {isUserRoleCompare?.includes("excelblockdayslist") && (
                                        <>
                                            {/* <ExportXL csvData={leaveData} fileName={fileName} /> */}
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                fetchLeavecriteria()
                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvblockdayslist") && (
                                        <>
                                            {/* <ExportCSV csvData={leaveData} fileName={fileName} /> */}
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                fetchLeavecriteria()
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printblockdayslist") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfblockdayslist") && (
                                        <>
                                            {/* <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}>
                                                <FaFilePdf />
                                                &ensp;Export to PDF&ensp;
                                            </Button> */}
                                            <Button sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true)
                                                    fetchLeavecriteria()
                                                }}
                                            ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imageblockdayslist") && (
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
                        <br />
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}> Show All Columns </Button>  &ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}> Manage Columns </Button>  &ensp;
                        <br /> <br />
                        {!leavecriteriaCheck ? (
                            <>
                                <Box sx={{ display: "flex", justifyContent: "center" }}>

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
                                    <StyledDataGrid onClipboardCopy={(copiedString) => setCopiedData(copiedString)} rows={rowsWithCheckboxes} columns={columnDataTable.filter((column) => columnVisibility[column.field])} onSelectionModelChange={handleSelectionChange} selectionModel={selectedRows} autoHeight={true} ref={gridRef} density="compact" hideFooter getRowClassName={getRowClassName} disableRowSelectionOnClick />
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

            {/* Print Layout */}
            <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRef}>
                    <TableHead>
                        <TableRow>
                            <TableCell>SNo</TableCell>
                            <TableCell>Company</TableCell>
                            <TableCell>Branch</TableCell>
                            <TableCell>Unit</TableCell>
                            <TableCell>Team</TableCell>
                            <TableCell>Employee</TableCell>
                            <TableCell>Deaprtment</TableCell>
                            <TableCell>Designation</TableCell>
                            <TableCell>Leavetype</TableCell>
                            <TableCell>Took Leave</TableCell>
                            <TableCell>Week Start Day</TableCell>
                            {/* <TableCell>Took Leave Day</TableCell> */}
                        </TableRow>
                    </TableHead>
                    <TableBody align="left">
                        {rowDataTable &&
                            rowDataTable.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{Array.isArray(row.company) ? row.company.join(',') : ""}</TableCell>
                                    <TableCell>{Array.isArray(row.branch) ? row.branch.join(',') : ""}</TableCell>
                                    <TableCell>{Array.isArray(row.unit) ? row.unit.join(',') : ""}</TableCell>
                                    <TableCell>{Array.isArray(row.team) ? row.team.join(',') : ""}</TableCell>
                                    <TableCell>{Array.isArray(row.employee) ? row.employee.join(',') : ""}</TableCell>
                                    <TableCell>{Array.isArray(row.department) ? row.department.join(',') : ""}</TableCell>
                                    <TableCell>{Array.isArray(row.designation) ? row.designation.join(',') : ""}</TableCell>
                                    <TableCell>{row.leavetype}</TableCell>
                                    <TableCell>{row.tookleavecheck}</TableCell>
                                    <TableCell>{row.weekstartday}</TableCell>
                                    {/* <TableCell>{row.tookleave.map(d => d.day).join(',')}</TableCell> */}
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
                            fetchLeavecriteria()
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

            {/* View Model */}
            <Dialog open={openview} onClose={handleClickOpenview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md">
                <DialogContent >
                    <Box sx={{ padding: '20px 20px', width: "800px" }}>
                        <Typography sx={userStyle.HeaderText}>
                            <b>View Leave Block Day</b>{" "}
                        </Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={12} sm={12} xs={12}>
                                <Grid container spacing={2}>
                                    <Grid item md={1.5} sm={12} xs={12}>
                                        <Typography><b>Year</b></Typography>
                                    </Grid>
                                    <Grid item md={1.5} sm={12} xs={12}>
                                        <Typography><b>Month</b></Typography>
                                    </Grid>
                                    <Grid item md={1.5} sm={12} xs={12}>
                                        <Typography><b>Week</b></Typography>
                                    </Grid>
                                    <Grid item md={3.5} sm={12} xs={12}>
                                        <Typography><b>Day</b></Typography>
                                    </Grid>
                                </Grid><br />

                                {todosCheck?.length > 0 &&
                                    todosCheck.map((todo, index) => {
                                        const todoMonthIndex = monthstring.indexOf(todo.month);
                                        const todoWeekNumber = parseInt(todo.week.match(/\d+/)[0], 10);
                                        const isFutureMonth = (parseInt(todo.year) > currentYear) || (parseInt(todo.year) === currentYear && todoMonthIndex > currentMonthIndex);
                                        const isFutureWeek = (parseInt(todo.year) === currentYear && todoMonthIndex === currentMonthIndex && todoWeekNumber > currentWeek);

                                        return (
                                            < div key={index} >
                                                {editingIndexCheck === index ? (
                                                    <Grid container spacing={2}>
                                                        <Grid item md={1.5} sm={6} xs={12}>
                                                            <Typography>{todo.year}</Typography>
                                                        </Grid>
                                                        <Grid item md={1.5} sm={6} xs={12}>
                                                            <Typography>{todo.month}</Typography>
                                                        </Grid>
                                                        <Grid item md={1.5} sm={6} xs={12}>
                                                            <Typography>{todo.week}</Typography>
                                                        </Grid>
                                                        <Grid item md={3.5} sm={6} xs={12} sx={{ display: "flex" }}>
                                                            <FormControl size="small" sx={{ width: "100%", maxWidth: "400px" }}>
                                                                <MultiSelect
                                                                    options={days}
                                                                    value={selectedOptionsDayEdit}
                                                                    onChange={handleDayChangeEdit}
                                                                    valueRenderer={customValueRendererDayEdit}
                                                                    labelledBy="Please Select Branch"
                                                                />
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item md={1} sm={1} xs={1}>
                                                            <Button
                                                                variant="contained"
                                                                style={{
                                                                    minWidth: "20px",
                                                                    minHeight: "41px",
                                                                    background: "transparent",
                                                                    boxShadow: "none",
                                                                    marginTop: "-3px !important",
                                                                    "&:hover": {
                                                                        background: "#f4f4f4",
                                                                        borderRadius: "50%",
                                                                        minHeight: "41px",
                                                                        minWidth: "20px",
                                                                        boxShadow: "none",
                                                                    },
                                                                }}
                                                                onClick={() => { handleUpdateTodoCheck(); setTodoSubmit(false) }}
                                                            >
                                                                <CheckCircleIcon

                                                                    style={{
                                                                        color: "#216d21",
                                                                        fontSize: "1.5rem",
                                                                    }}
                                                                />
                                                            </Button>
                                                        </Grid>
                                                        <Grid item md={1} sm={1} xs={1}>
                                                            <Button
                                                                variant="contained"
                                                                style={{
                                                                    minWidth: "20px",
                                                                    minHeight: "41px",
                                                                    background: "transparent",
                                                                    boxShadow: "none",
                                                                    marginTop: "-3px !important",
                                                                    "&:hover": {
                                                                        background: "#f4f4f4",
                                                                        borderRadius: "50%",
                                                                        minHeight: "41px",
                                                                        minWidth: "20px",
                                                                        boxShadow: "none",
                                                                    },
                                                                }}
                                                                onClick={() => { setEditingIndexCheck(-1); setTodoSubmit(false); }}
                                                            >
                                                                <CancelIcon
                                                                    style={{
                                                                        color: "#b92525",
                                                                        fontSize: "1.5rem",
                                                                    }}
                                                                />
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                ) : (
                                                    <Grid container spacing={2}>
                                                        <Grid item md={1.5} sm={6} xs={12}>
                                                            <Typography>{todo.year}</Typography>
                                                        </Grid>
                                                        <Grid item md={1.5} sm={6} xs={12}>
                                                            <Typography>{todo.month}</Typography>
                                                        </Grid>
                                                        <Grid item md={1.5} sm={6} xs={12}>
                                                            <Typography>{todo.week}</Typography>
                                                        </Grid>
                                                        <Grid item md={3.5} sm={6} xs={12} sx={{ display: "flex" }}>
                                                            <Typography>{todo.day.join(',')}</Typography>
                                                        </Grid>
                                                        {(isFutureMonth || isFutureWeek) ? (
                                                            <Grid item md={1} sm={6} xs={6}>
                                                                <Button
                                                                    variant="contained"
                                                                    style={{
                                                                        minWidth: "20px",
                                                                        // minHeight: "41px",
                                                                        background: "transparent",
                                                                        boxShadow: "none",
                                                                        marginTop: "-13px !important",
                                                                        "&:hover": {
                                                                            background: "#f4f4f4",
                                                                            borderRadius: "50%",
                                                                            minHeight: "41px",
                                                                            minWidth: "20px",
                                                                            boxShadow: "none",
                                                                        },
                                                                    }}
                                                                    onClick={() => { handleEditTodoCheck(index); setTodoSubmit(true); }}
                                                                >
                                                                    <FaEdit
                                                                        style={{
                                                                            color: "#1976d2",
                                                                            fontSize: "1.2rem",
                                                                        }}
                                                                    />
                                                                </Button>
                                                            </Grid>
                                                        ) : null}
                                                        {/* <Grid item md={1} sm={6} xs={6}>
                                                            <Button
                                                                variant="contained"
                                                                style={{
                                                                    minWidth: "20px",
                                                                    minHeight: "41px",
                                                                    background: "transparent",
                                                                    boxShadow: "none",
                                                                    marginTop: "-13px !important",
                                                                    "&:hover": {
                                                                        background: "#f4f4f4",
                                                                        borderRadius: "50%",
                                                                        minHeight: "41px",
                                                                        minWidth: "20px",
                                                                        boxShadow: "none",
                                                                    },
                                                                }}
                                                                onClick={() => handleDeleteTodoCheck(index)}
                                                            >
                                                                <FaTrash
                                                                    style={{
                                                                        color: "#b92525",
                                                                        fontSize: "1.2rem",
                                                                    }}
                                                                />
                                                            </Button>
                                                        </Grid> */}
                                                    </Grid>
                                                )}
                                                <br />
                                            </div>
                                        )
                                    })}
                            </Grid>
                        </Grid>
                        <br /> < br />
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={6} sm={6}>
                                <Button variant="contained" onClick={editSubmit}>
                                    {" "}
                                    Update{" "}
                                </Button>
                            </Grid>
                            <Grid item md={6} xs={6} sm={6}>
                                <Button sx={userStyle.btncancel} onClick={handleCloseview}>
                                    Cancel
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
            </Dialog>

            {/* ALERT DIALOG */}
            <Box>
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
            </Box>
        </Box >
    );
}

export default LeaveBlockDayList;