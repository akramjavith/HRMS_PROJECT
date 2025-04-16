import React, { useState, useCallback, useEffect, useRef, useContext } from 'react';
import { Box, Typography, OutlinedInput, TableBody, Chip, TableRow, TableCell, Select, MenuItem, DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton } from '@mui/material';
import { userStyle, colourStyles } from '../../../pageStyle.js';
import { FaPrint, FaFilePdf, FaFileExcel, FaFileCsv } from 'react-icons/fa';
// import StyledDataGrid from "../../../components/TableStyle.js";
import axios from 'axios';
import { SERVICE } from '../../../services/Baseservice.js';
import Selects from "react-select";
import moment from "moment-timezone";
import { useReactToPrint } from 'react-to-print';
import { UserRoleAccessContext, AuthContext } from '../../../context/Appcontext.js';
import Headtitle from '../../../components/Headtitle.js';
import { ThreeDots } from 'react-loader-spinner';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import { saveAs } from 'file-saver';
import Switch from '@mui/material/Switch';
import CloseIcon from '@mui/icons-material/Close';
import html2canvas from 'html2canvas';
import ImageIcon from '@mui/icons-material/Image';
import { MultiSelect } from 'react-multi-select-component';
import ExportData from '../../../components/ExportData.js';
import PageHeading from '../../../components/PageHeading.js';
import MessageAlert from '../../../components/MessageAlert.js';
import AlertDialog from '../../../components/Alert.js';
import { handleApiError } from '../../../components/Errorhandling.js';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import domtoimage from 'dom-to-image';


const CustomRateField = ({ value, row, column, updateRowData }) => {
    const [rate, setRate] = useState(value);

    const handleChange = (event) => {
        setRate(event.target.value);
    };

    const handleBlur = () => {

        updateRowData({ ...row, [column.field]: rate });
    };

    return (
        <OutlinedInput
            type="number"
            value={rate}
            onChange={handleChange}
            onBlur={handleBlur} // Trigger the update when user leaves the field
            style={{ width: '100%' }}
        />
    );
};

function RejectList() {
    let today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;
    let now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    let currtime = `${hours}:${minutes}`;
    const [productionFilter, setProductionFilter] = useState([]);

    const [selectedProject, setSelectedProject] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [selectedSubCategory, setSelectedSubCategory] = useState([]);
    const [quickFilterText, setQuickFilterText] = useState("");
    const gridRefTable = useRef(null);
    const gridRefTableImg = useRef(null);

    const [projmaster, setProjmaster] = useState([]);
    const [selectedMode, setSelectedMode] = useState("Today");

    const [fromdate, setFromdate] = useState(today)
    const [todate, setTodate] = useState(today)

    const mode = [
        { label: "Today", value: "Today" },
        { label: "Tomorrow", value: "Tomorrow" },
        { label: "Yesterday", value: "Yesterday" },
        { label: "This Week", value: "This Week" },
        { label: "This Month", value: "This Month" },
        { label: "Last Week", value: "Last Week" },
        { label: "Last Month", value: "Last Month" },
        { label: "Custom", value: "Custom" }
    ]

    let exportColumnNames =
        ['Vendor',
            'Date',
            'Time',
            'Category',
            'Sub Category',
            'Identifier',
            'Login Id',
            'Section',
            'Flag Count',
            'Doc Number',
            'Status',
            'Approval Status',
            'Late Entry Status'];

    let exportRowValues =
        ['vendor', 'fromdate',
            'time', 'filename',
            'category', 'unitid',
            'user', 'section',
            'flagcount', 'docnumber',
            'status', 'approvalstatus',
            'lateentrystatus'];



    const [searchQuery, setSearchQuery] = useState('');
    const [searchQueryManage, setSearchQueryManage] = useState('');

    const [projectOpt, setProjmasterOpt] = useState([]);
    const [categoryOpt, setCategoryOpt] = useState([]);
    const [subCategoryOpt, setSubCategoryOpt] = useState([]);

    const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);

    const [sourceCheck, setSourcecheck] = useState(false);

    const gridRef = useRef(null);

    const [selectedRows, setSelectedRows] = useState([]);

    const [rows, setRows] = useState([]);

    const [fileFormat, setFormat] = useState('');
    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState('');
    const [popupSeverityMalert, setPopupSeverityMalert] = useState('');
    const handleClickOpenPopupMalert = () => {
        setOpenPopupMalert(true);
    };
    const handleClosePopupMalert = () => {
        setOpenPopupMalert(false);
    };
    const [openPopup, setOpenPopup] = useState(false);
    const [popupContent, setPopupContent] = useState('');
    const [popupSeverity, setPopupSeverity] = useState('');
    const handleClickOpenPopup = () => {
        setOpenPopup(true);
    };
    const handleClosePopup = () => {
        setOpenPopup(false);
    };
    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();

    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };




    const fetchProductionFilter = async () => {
        setPageName(!pageName)
        try {
            setSourcecheck(true);
            let res_project = await axios.post(SERVICE.PRODUCTION_INDIVIDUAL_DATEFILTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                status: String("Rejected"),
                fromdate: fromdate,
                todate: todate
            });

            const ans = res_project?.data?.productionIndividualdate?.length > 0 ? res_project?.data?.productionIndividualdate : []

            let res1 = await axios.get(SERVICE.GET_ATTENDANCE_CONTROL_CRITERIA_LAST_INDEX);
            let dataFromControlPanel = res1?.data?.attendancecontrolcriteria;


            const itemsWithSerialNumber = ans?.map((item, index) => {

                const fromDate = new Date(item.createdAt);

                const fromDaten = new Date(`${item.fromdate}T${item.time}:00`);

                let approvaldays = Number(dataFromControlPanel.approvalstatusDays) > 0 ? Number(dataFromControlPanel.approvalstatusDays) * 24 : 1
                let approvalhours = Number(dataFromControlPanel.approvalstatusHour) > 0 ? Number(dataFromControlPanel.approvalstatusHour) * 60 : 1
                let approvalmins = Number(dataFromControlPanel.approvalstatusMin) > 0 ? Number(dataFromControlPanel.approvalstatusMin) * 60 : 1

                let entrydays = Number(dataFromControlPanel.entrystatusDays) > 0 ? Number(dataFromControlPanel.entrystatusDays) * 24 : 1
                let entryhours = Number(dataFromControlPanel.entrystatusHour) > 0 ? Number(dataFromControlPanel.entrystatusHour) * 60 : 1
                let entrymins = Number(dataFromControlPanel.entrystatusMin) > 0 ? Number(dataFromControlPanel.entrystatusMin) * 60 : 1
                const fromDatePlus48Hours = new Date(fromDaten.getTime() + approvaldays * approvalhours * approvalmins * 1000);
                const currentDateTime = new Date();

                const fromDatePlus24Hours = new Date(fromDate.getTime() + entrydays * entryhours * entrymins * 1000);

                return {
                    ...item,
                    id: item._id,
                    serialNumber: (page - 1) * pageSize + index + 1,
                    fromdateold: item.fromdate,
                    fromdate: (item.fromdate === "" || item.fromdate === undefined || item.fromdate === "undefined") ? "" : moment(item.fromdate).format("DD/MM/YYYY"),
                    lateentrystatus: item.lateentrystatus ? item.lateentrystatus : (fromDate > fromDatePlus48Hours) ? "Late Entry" : "On Entry",
                    approvalstatus: item.approvalstatus ? item.approvalstatus : (item.approvaldate === "" || item.approvaldate === null || item.approvaldate === undefined) && item.status === "Approved" ? "" :
                        ((new Date() <= fromDatePlus24Hours) && (item.approvaldate === "" || item.approvaldate === null || item.approvaldate === undefined)) ? "Pending" :
                            ((new Date() > fromDatePlus24Hours) && (item.approvaldate === "" || item.approvaldate === null || item.approvaldate === undefined)) ? "Late Not Approval" :
                                ((new Date(item.approvaldate) > fromDatePlus24Hours) && item.approvaldate) ? "Late Approval" :
                                    "On Approval"
                }
            });
            const result = Object.values(
                itemsWithSerialNumber.reduce((acc, { uniqueid }) => {
                    if (!acc[uniqueid]) {
                        acc[uniqueid] = { uniqueid, count: 0 };
                    }
                    acc[uniqueid].count++;
                    return acc;
                }, {})
            );
            setStatus({})
            setRows(itemsWithSerialNumber);
            setSourcecheck(false);
        } catch (err) { setSourcecheck(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }

    };


    //image
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, 'Reject_List .png');
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Manage Columns
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleOpenManageColumns = (event) => {
        setAnchorEl(event.currentTarget);
        setManageColumnsOpen(true);
    };
    const handleCloseManageColumns = () => {
        setManageColumnsOpen(false);
        setSearchQueryManage('');
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const getRowClassName = (params) => {
        if (selectedRows.includes(params.row.id)) {
            return 'custom-id-row'; // This is the custom class for rows with item.tat === 'ago'
        }
        return ''; // Return an empty string for other rows
    };

    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        vendor: true,
        fromdate: true,
        filename: true,
        category: true,
        unitid: true,
        user: true,
        section: true,
        flagcount: true,
        alllogin: true,
        docnumber: true,
        status: true,
        actions: true,
        lateentrystatus: true,
        approvalstatus: true,
        actionsstatus: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ''; // This is required for Chrome support
    };

    const handleClear = (e) => {
        e.preventDefault();
        setSelectedProject([]);
        setSelectedCategory([]);
        setSelectedSubCategory([]);
        setProductionFilter([]);
        setRows([])
        setPopupContent('Cleared Successfully');
        setPopupSeverity('success');
        handleClickOpenPopup();
    };

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Reject List',
        pageStyle: 'print',
    });

    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener('beforeunload', beforeUnloadHandler);
        return () => {
            window.removeEventListener('beforeunload', beforeUnloadHandler);
        };
    }, []);

    // Handle page change
    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    // Handle search change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setPage(1); // Reset to the first page when search changes
    };

    // Handle page size change
    const handlePageSizeChange = (e) => {
        setPageSize(e.target.value);
        setPage(1); // Reset to the first page when page size changes
    };

    // Filter data based on search query
    const filteredData = rows.filter((row) => {
        return Object.values(row)?.some((value) => value?.toString()?.toLowerCase()?.includes(searchQuery?.toLowerCase()));
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredData.length / pageSize);
    const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);
    const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);
    const maxVisiblePages = 3;

    const calculatePageNumbers = (totalPages, currentPage, maxVisiblePages) => {
        const pageNumbers = [];
        // Number of pages to show at a time
        const halfVisible = Math.floor(maxVisiblePages / 2);

        // Determine the start and end of the visible range
        let start = Math.max(1, currentPage - halfVisible);
        let end = Math.min(totalPages, currentPage + halfVisible);

        // Adjust range if close to the start or end
        if (currentPage <= halfVisible) {
            end = Math.min(maxVisiblePages, totalPages);
        } else if (currentPage > totalPages - halfVisible) {
            start = Math.max(1, totalPages - maxVisiblePages + 1);
        }

        for (let i = start; i <= end; i++) {
            pageNumbers.push(i);
        }

        return pageNumbers;
    };

    const handleCellEdit = (params) => {
        const updatedRows = rows.map((row) => (row.id === params.data.id ? { ...row, [params.colDef.field]: params.newValue } : row));
        setRows(updatedRows); // Update only the modified row.
    };

    const updateRowData = (updatedRow) => {
        const updatedRows = rows.map((row) => (row.id === updatedRow.id ? updatedRow : row));
        setRows(updatedRows); // Efficiently update the row data.
    };

    const gridApi = useRef(null);
    const columnApi = useRef(null);

    let minRowHeight = 25;
    let currentRowHeight;
    const onGridReady = useCallback((params) => {
        gridApi.current = params.api;
        columnApi.current = params.columnApi;
        minRowHeight = params.api.getSizesForCurrentTheme().rowHeight;
        currentRowHeight = minRowHeight;
    }, []);



    const [rowIndex, setRowIndex] = useState();
    const [status, setStatus] = useState({});
    const [rowIndexnew, setRowIndexnew] = useState();
    const [statusnew, setStatusnew] = useState({});
    const handleAction = (value, rowId, sno) => {

        setStatus((prevStatus) => ({
            ...prevStatus,
            [rowId]: {
                ...prevStatus[rowId],
                status: value,
            },
        }));

        setRowIndex(sno);
    };

    const handleActionNew = (value, rowId, sno) => {

        setStatusnew((prevStatus) => ({
            ...prevStatus,
            [rowId]: {
                ...prevStatus[rowId],
                statusnew: value,
            },
        }));
        setRowIndexnew(sno);
    };

    const columns = [
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 100,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
        },
        { field: "vendor", headerName: "Vendor", flex: 0, width: 150, hide: !columnVisibility.vendor, headerClassName: "bold-header" },
        { field: "fromdate", headerName: "Date", flex: 0, width: 150, hide: !columnVisibility.fromdate, headerClassName: "bold-header" },
        { field: "filename", headerName: "Category", flex: 0, width: 150, hide: !columnVisibility.filename, headerClassName: "bold-header" },
        { field: "category", headerName: "SubCategory", flex: 0, width: 150, hide: !columnVisibility.category, headerClassName: "bold-header" },
        { field: "unitid", headerName: "Identifier", flex: 0, width: 150, hide: !columnVisibility.unitid, headerClassName: "bold-header" },
        { field: "user", headerName: "Login Id", flex: 0, width: 150, hide: !columnVisibility.user, headerClassName: "bold-header" },
        { field: "section", headerName: "Section", flex: 0, width: 150, hide: !columnVisibility.section, headerClassName: "bold-header" },


        // { field: "flagcount", headerName: "Flag Count", flex: 0, width: 150, hide: !columnVisibility.flagcount, headerClassName: "bold-header" },



        ...(!isUserRoleAccess.role.includes("Manager")
            ? [
                {
                    field: "flagcount", headerName: "Flag Count",
                    flex: 0, width: 150, hide: !columnVisibility.flagcount,
                    headerClassName: "bold-header"
                },
            ]
            : []),

        { field: "alllogin", headerName: "All Login", flex: 0, width: 150, hide: !columnVisibility.alllogin, headerClassName: "bold-header" },
        { field: "docnumber", headerName: "Doc Number", flex: 0, width: 150, hide: !columnVisibility.docnumber, headerClassName: "bold-header" },


        ...(!isUserRoleAccess.role.includes("Manager")
            ? [
                {
                    field: "actionsstatus",
                    headerName: "Entry And Approval Status",
                    flex: 0,
                    width: 300,
                    minHeight: "40px !important",
                    sortable: false,
                    hide: !columnVisibility.actionsstatus,
                    headerClassName: "bold-header",
                    cellRenderer: (params) => (
                        <>
                            <Chip
                                sx={{ height: "25px", borderRadius: "0px" }}
                                color={"warning"}
                                variant="outlined"
                                label={params.data.approvalstatus}
                            />
                            &ensp;
                            <Chip
                                sx={{ height: "25px", borderRadius: "0px" }}
                                color={"success"}
                                variant="outlined"
                                label={params.data.lateentrystatus}
                            />
                        </>
                    )
                },
            ]
            : []),

        ...(isUserRoleAccess.role.includes("Manager")
            ? [
                {
                    field: "actionsstatus",
                    headerName: "Entry And Approval Status",
                    flex: 0,
                    width: 500,
                    minHeight: "40px !important",
                    sortable: false,
                    hide: !columnVisibility.actionsstatus,
                    headerClassName: "bold-header",
                    cellRenderer: (params) => (
                        <>

                            <Grid sx={{ display: "flex", alignItems: "center" }}>
                                <Grid item md={9} xs={12} sm={12}>
                                    <FormControl size="large" fullWidth>
                                        <Select
                                            labelId="demo-select-small"
                                            id="demo-select-small"
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 200,
                                                        width: "auto",
                                                    },
                                                },
                                            }}
                                            style={{ minWidth: 150, width: 200, overflow: "hidden" }}
                                            value={
                                                status[params.data.id]?.status
                                                    ? status[params.data.id]?.status
                                                    : params.data.approvalstatus
                                            }
                                            onChange={(e) => {
                                                handleAction(
                                                    e.target.value,
                                                    params.data.id,
                                                    params.data.serialNumber
                                                );
                                            }}
                                            inputProps={{ "aria-label": "Without label" }}
                                        >
                                            <MenuItem value="On Approval">On Approval</MenuItem>
                                            <MenuItem value="Late Approval">Late Approval</MenuItem>
                                            <MenuItem value="Pending">Pending</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                &ensp;
                                <Grid item md={9} xs={12} sm={12}>
                                    <FormControl size="large" fullWidth>
                                        <Select
                                            labelId="demo-select-small"
                                            id="demo-select-small"
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 200,
                                                        width: "auto",
                                                    },
                                                },
                                            }}
                                            style={{ minWidth: 150, width: 200, overflow: "hidden" }}
                                            value={
                                                statusnew[params.data.id]?.statusnew
                                                    ? statusnew[params.data.id]?.statusnew
                                                    : params.data.lateentrystatus
                                            }
                                            onChange={(e) => {
                                                handleActionNew(
                                                    e.target.value,
                                                    params?.data?.id,
                                                    params.data.serialNumber
                                                );
                                            }}
                                            inputProps={{ "aria-label": "Without label" }}
                                        >
                                            <MenuItem value="On Entry">On Entry</MenuItem>
                                            <MenuItem value="Late Entry">Late Entry</MenuItem>

                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </>
                    )
                },
            ]
            : []),

        //flagcount editable
        // ...(isUserRoleAccess.role.includes("Manager")
        //     ? [
        //         {
        //             headerName: "Flag Count (Editable)",
        //             field: "flagcount",
        //             width: 150,
        //             editable: true,
        //             suppressClickEdit: true,
        //             sortable: true,
        //             filter: true,
        //             resizable: true,
        //             cellEditor: "agTextCellEditor",
        //             suppressDestroy: true,

        //         },
        //     ]
        //     : []),

        ...(isUserRoleAccess.role.includes("Manager")
            ? [
                {
                    field: "flagcount", headerName: "Flag Count(Editable)",
                    flex: 0, width: 150, hide: !columnVisibility.flagcount,
                    headerClassName: "bold-header",
                    cellRenderer: (params) =>
                        <CustomRateField value={params.value}
                            row={params.data} column={params.colDef} updateRowData={updateRowData} />,
                },
            ]
            : []),

        //update

        ...(isUserRoleAccess.role.includes("Manager")
            ? [
                {
                    field: "actions",
                    headerName: "Action",
                    flex: 0,
                    width: 250,
                    minHeight: "40px !important",
                    sortable: false,
                    hide: !columnVisibility.actions,
                    headerClassName: "bold-header",
                    cellRenderer: (params) => (
                        <>
                            {isUserRoleAccess.role.includes("Manager") && isUserRoleCompare?.includes("eapprovelist") && (


                                <Grid sx={{ display: "flex" }}>

                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        size="small"
                                        onClick={() => {
                                            sendEditRequest(params.data.id, params.data.fromdateold, status[params.data.id]?.status
                                                ? status[params.data.id]?.status
                                                : params.data.approvalstatus, statusnew[params.data.id]?.statusnew
                                                ? statusnew[params.data.id]?.statusnew
                                                : params.data.lateentrystatus, params.data.flagcount);
                                        }}
                                    >
                                        UPDATE
                                    </Button>

                                </Grid>


                            )}
                        </>
                    ),
                },
            ]
            : []),







        {
            field: "status",
            headerName: "Status",
            flex: 0,
            width: 200,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.status,
            headerClassName: "bold-header",
            cellRenderer: (params) => (

                <Grid container spacing={1}>
                    <Grid item md={6} xs={6} sm={6}>

                        <Button variant="contained" color="error" size="small"

                        >
                            {params.data.status}
                        </Button>

                    </Grid>


                </Grid >

            ),
        },
    ];

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
        const savedVisibility = localStorage.getItem('columnVisibility');
        if (savedVisibility) {
            setColumnVisibility(JSON.parse(savedVisibility));
        }
    }, []);

    useEffect(() => {
        // Save column visibility to localStorage whenever it changes
        localStorage.setItem('columnVisibility', JSON.stringify(columnVisibility));
    }, [columnVisibility]);

    // // Function to filter columns based on search query
    const filteredColumns = columns.filter((column) => {
        if (searchQueryManage.toLowerCase() === 'checkbox') {
            return column.headerName === '';
        }

        return column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase());
    });

    // Manage Columns functionality
    const toggleColumnVisibility = (field) => {
        setColumnVisibility((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };

    // JSX for the "Manage Columns" popover content
    const manageColumnsContent = (
        <Box style={{ padding: '10px', minWidth: '325px', '& .MuiDialogContent-root': { padding: '10px 0' } }}>
            <Typography variant="h6">Manage Columns</Typography>
            <IconButton
                aria-label="close"
                onClick={handleCloseManageColumns}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>
            <Box sx={{ position: 'relative', margin: '10px' }}>
                <TextField label="Find column" variant="standard" fullWidth value={searchQueryManage} onChange={(e) => setSearchQueryManage(e.target.value)} sx={{ marginBottom: 5, position: 'absolute' }} />
            </Box>
            <br />
            <br />
            <DialogContent sx={{ minWidth: 'auto', height: '200px', position: 'relative' }}>
                <List sx={{ overflow: 'auto', height: '100%' }}>
                    {filteredColumns.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText
                                sx={{ display: 'flex' }}
                                primary={<Switch sx={{ marginTop: '-5px' }} size="small" checked={columnVisibility[column.field]} onChange={() => toggleColumnVisibility(column.field)} />}
                                secondary={column.field === 'checkbox' ? 'Checkbox' : column.headerName}
                            // secondary={column.headerName }
                            />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Grid container>
                    <Grid item md={4}>
                        <Button variant="text" sx={{ textTransform: 'none' }} onClick={() => setColumnVisibility(initialColumnVisibility)}>
                            Show All
                        </Button>
                    </Grid>
                    <Grid item md={4}></Grid>
                    <Grid item md={4}>
                        <Button
                            variant="text"
                            sx={{ textTransform: 'none' }}
                            onClick={() => {
                                const newColumnVisibility = {};
                                columns.forEach((column) => {
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
            case "Tomorrow":
                const tomorrow = new Date(today);
                tomorrow.setDate(today.getDate() + 1);
                fromdate = todate = formatDate(tomorrow);
                break;
            case "Yesterday":
                const yesterday = new Date(today);
                yesterday.setDate(today.getDate() - 1);
                fromdate = todate = formatDate(yesterday);
                break;
            case "This Week":
                const startOfThisWeek = new Date(today);
                startOfThisWeek.setDate(today.getDate() - (today.getDay() + 6) % 7); // Monday
                const endOfThisWeek = new Date(startOfThisWeek);
                endOfThisWeek.setDate(startOfThisWeek.getDate() + 6); // Sunday
                fromdate = formatDate(startOfThisWeek);
                todate = formatDate(endOfThisWeek);
                break;
            case "This Month":
                fromdate = formatDate(new Date(today.getFullYear(), today.getMonth(), 1));
                todate = formatDate(new Date(today.getFullYear(), today.getMonth() + 1, 0));
                break;
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
    const handleclear = async (e) => {
        e.preventDefault();
        setFromdate(today)
        setTodate(today)
        setSelectedMode("Today")
        let res_project = await axios.post(SERVICE.PRODUCTION_INDIVIDUAL_DATEFILTER, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            status: String("Rejected"),
            fromdate: today,
            todate: today
        });

        setProjmaster(res_project?.data?.productionIndividualdate);
        setRows([])
        setPopupContentMalert("Cleared Successfully!");
        setPopupSeverityMalert("success");
        handleClickOpenPopupMalert();

    };


    const sendEditRequest = async (id, date, approvalstatus, lateentrystatus, flagcount) => {
        console.log(id, approvalstatus, lateentrystatus, flagcount, "check")
        // setLoader(true)
        let editid = id;
        setPageName(!pageName)
        try {
            const [res_Day, res_Day_Point] = await Promise.all([
                axios.post(SERVICE.CHECK_ISPRODDAY_CREATED, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    date: date,
                }),
                axios.post(SERVICE.CHECK_ISDAYPOINT_CREATED, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    date: date,
                }),
            ]);
            if (res_Day.data.count > 0 && res_Day_Point.data.count > 0) {
                setPopupContentMalert('Production day & Day Point was Already created for this date');
                setPopupSeverityMalert('warning');
                handleClickOpenPopupMalert();
            }
            else if (res_Day.data.count > 0) {
                setPopupContentMalert('Production day was Already created for this date');
                setPopupSeverityMalert('warning');
                handleClickOpenPopupMalert();
            }
            else if (res_Day_Point.data.count > 0) {
                setPopupContentMalert('Day Point was Already created for this date');
                setPopupSeverityMalert('warning');
                handleClickOpenPopupMalert();
            }


            else if (flagcount === "" || flagcount === undefined || flagcount === "undefined" || flagcount === "null" || flagcount === null) {

                setPopupContentMalert("Please Enter FlagCount");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else {


                let res = await axios.put(`${SERVICE.PRODUCTION_INDIVIDUAL_SINGLE}/${editid}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },

                    approvalstatus: String(approvalstatus),
                    lateentrystatus: String(lateentrystatus),
                    flagcount: String(flagcount),

                });

                await fetchProductionFilter();

            }
            // setLoader(false)
        } catch (err) {
            // setLoader(false);
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };


    return (
        <Box>
            <Headtitle title={"Reject List"} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Manage Reject"
                modulename="Production"
                submodulename="Manual Entry"
                mainpagename="Reject List"
                subpagename=""
                subsubpagename=""
            />

            <>
                <Box sx={userStyle.selectcontainer}>
                    <Grid item xs={8}>
                        <Typography sx={userStyle.importheadtext}>Reject</Typography>
                    </Grid>
                    <>
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Filter Mode<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Selects
                                        labelId="mode-select-label"
                                        options={mode}
                                        style={colourStyles}
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
                                            // setEbreadingdetailFilter({
                                            //   ...ebreadingdetailFilter,
                                            //   fromdate: formatDateForInput(new Date(fromdate.split('-').reverse().join('-'))), // Convert to 'yyyy-MM-dd'
                                            //   todate: formatDateForInput(new Date(todate.split('-').reverse().join('-'))), // Convert to 'yyyy-MM-dd'
                                            // });


                                            setFromdate(formatDateForInput(new Date(fromdate.split('-').reverse().join('-'))))
                                            setTodate(formatDateForInput(new Date(todate.split('-').reverse().join('-'))))

                                            setSelectedMode(selectedOption.value); // Update the mode
                                        }}
                                    />
                                </FormControl>


                            </Grid>


                            <Grid item md={3} sm={6} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        From Date
                                    </Typography>
                                    <OutlinedInput
                                        id="component-outlinedname"
                                        type="date"
                                        value={fromdate}
                                        disabled={selectedMode != "Custom"}
                                        onChange={(e) => {
                                            setFromdate(e.target.value);
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} sm={6} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        To  Date
                                    </Typography>
                                    <OutlinedInput
                                        id="component-outlinedname"
                                        type="date"
                                        value={todate}
                                        disabled={selectedMode != "Custom"}
                                        onChange={(e) => {
                                            setTodate(e.target.value);
                                        }}
                                    />
                                </FormControl>

                            </Grid>
                            <Grid item lg={1} md={2} sm={2} xs={12} >
                                <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0, } })}>
                                    <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={fetchProductionFilter}>
                                        Filter
                                    </Button>
                                </Box>
                            </Grid>
                            <Grid item lg={1} md={2} sm={2} xs={12} >
                                <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0, } })}>
                                    <Button sx={buttonStyles.btncancel} onClick={handleclear}>
                                        Clear
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </>
                </Box>
            </>


            <br />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes('lrejectlist') && (
                <>
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        {/* <Grid item xs={8}> */}
                        <Typography sx={userStyle.importheadtext}>Reject List</Typography>
                        {/* </Grid> */}
                        <Grid container style={userStyle.dataTablestyle}>
                            <Grid item md={2} xs={12} sm={12}>
                                <Box>
                                    <Typography>Show entries:</Typography>
                                    <Select
                                        id="pageSizeSelect"
                                        value={pageSize}
                                        onChange={handlePageSizeChange}
                                        MenuProps={{
                                            PaperProps: {
                                                style: {
                                                    maxHeight: 180,
                                                    width: 80,
                                                },
                                            },
                                        }}
                                        sx={{ width: '77px' }}
                                    >
                                        <MenuItem value={1}>1</MenuItem>
                                        <MenuItem value={5}>5</MenuItem>
                                        <MenuItem value={10}>10</MenuItem>
                                        <MenuItem value={25}>25</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
                                        <MenuItem value={100}>100</MenuItem>
                                        <MenuItem value={rows.length}>All</MenuItem>
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Box>
                                    {isUserRoleCompare?.includes("excelrejectlist") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvrejectlist") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printrejectlist") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfrejectlist") && (
                                        <>
                                            <Button
                                                sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true)
                                                }}
                                            >
                                                <FaFilePdf />
                                                &ensp;Export to PDF&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imagerejectlist") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
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
                        <Popover
                            id={id}
                            open={isManageColumnsOpen}
                            anchorEl={anchorEl}
                            onClose={handleCloseManageColumns}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                        >
                            {manageColumnsContent}
                        </Popover>
                        <br />
                        <br />
                        {sourceCheck ? (
                            <>
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                    {/* <CircularProgress color="inherit" />  */}
                                    <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                                </Box>
                            </>
                        ) : (
                            <>
                                <Box
                                    style={{
                                        width: '100%',
                                    }}
                                    className="ag-theme-quartz"
                                    ref={gridRefTableImg}
                                >
                                    <AgGridReact
                                        rowData={paginatedData}
                                        columnDefs={columns}
                                        defaultColDef={{
                                            flex: 1,
                                            resizable: true,
                                            filter: true,
                                        }}
                                        ref={gridRef}
                                        onCellEditingStopped={handleCellEdit} // Triggers when cell editing is complete.
                                        suppressRowClickSelection={true}
                                        rowSelection="multiple"
                                        onGridReady={onGridReady}
                                        onSelectionChanged={(event) => {
                                            const selectedRowsData = event.api.getSelectedRows();
                                            setSelectedRows(selectedRowsData);
                                        }}
                                        pagination={false}
                                        quickFilterText={quickFilterText}
                                        getQuickFilterText={(params) => {
                                            // Include custom logic to include hidden fields
                                            const { vendor, fromdate, filename, category, unitid, user, section, flagcount, alllogin, docnumber, status, lateentrystatus, approvalstatus } = params.data;
                                            return `${vendor} ${fromdate} ${filename} ${category}  ${unitid} ${user} ${section} ${flagcount}  ${alllogin} ${docnumber} ${status} ${lateentrystatus} ${approvalstatus}`;
                                        }}
                                        domLayout="autoHeight"
                                        getRowId={(params) => params.data.id}
                                        getRowNodeId={(data) => data.id}
                                    />
                                </Box>
                                <Box sx={userStyle.dataTablestyle}>
                                    <Box>
                                        Showing {paginatedData.length > 0 ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, filteredData.length)} of {filteredData.length} entries
                                    </Box>
                                    <Box>
                                        <Button onClick={() => setPage(1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                                            <FirstPageIcon />
                                        </Button>
                                        <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                                            <NavigateBeforeIcon />
                                        </Button>

                                        {page > Math.floor(maxVisiblePages / 2) + 1 && <span>...</span>}
                                        {calculatePageNumbers(totalPages, page, maxVisiblePages).map((pageNumber) => (
                                            <Button key={pageNumber} onClick={() => handlePageChange(pageNumber)} disabled={page === pageNumber} className={page === pageNumber ? 'active' : ''} sx={userStyle.paginationbtn}>
                                                {pageNumber}
                                            </Button>
                                        ))}

                                        {totalPages > 3 && page < totalPages - 2 && <span>...</span>}

                                        <Button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                                            <NavigateNextIcon />
                                        </Button>
                                        <Button onClick={() => setPage(Number(totalPages))} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                                            <LastPageIcon />
                                        </Button>
                                    </Box>
                                </Box>
                            </>
                        )}
                    </Box>
                </>
            )}

            {/* Delete Modal */}
            <Box>
                {/* print layout */}
                <TableContainer component={Paper} sx={userStyle.printcls}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRef}>
                        <TableHead>
                            <TableRow>
                                <TableCell> SI.No</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Project</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell>SubCategory</TableCell>
                                <TableCell>Production</TableCell>
                                <TableCell>Mode</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody align="left">
                            {rows &&
                                rows.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{row.datenew}</TableCell>
                                        <TableCell>{row.project}</TableCell>
                                        <TableCell>{row.filename}</TableCell>
                                        <TableCell>{row.category}</TableCell>
                                        <TableCell>{row.productioncount}</TableCell>
                                        <TableCell>{row.mode}</TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* PRINT PDF EXCEL CSV */}
            <ExportData
                isFilterOpen={isFilterOpen}
                handleCloseFilterMod={handleCloseFilterMod}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpen}
                isPdfFilterOpen={isPdfFilterOpen}
                setIsPdfFilterOpen={setIsPdfFilterOpen}
                handleClosePdfFilterMod={handleClosePdfFilterMod}
                filteredDataTwo={paginatedData ?? []}
                itemsTwo={rows ?? []}
                filename={'Reject List'}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            <MessageAlert openPopup={openPopupMalert} handleClosePopup={handleClosePopupMalert} popupContent={popupContentMalert} popupSeverity={popupSeverityMalert} />
            {/* SUCCESS */}
            <AlertDialog openPopup={openPopup} handleClosePopup={handleClosePopup} popupContent={popupContent} popupSeverity={popupSeverity} />
        </Box>
    );
}

export default RejectList;