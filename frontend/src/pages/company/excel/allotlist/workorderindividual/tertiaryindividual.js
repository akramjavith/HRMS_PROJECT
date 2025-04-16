import React, { useState, useEffect, useRef, useContext } from "react";
import {
    Box, Typography, OutlinedInput, Select, MenuItem, Dialog, TableBody, TableCell, TableRow, DialogContent,
    DialogActions, FormControl, Grid, Paper, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, TextField, IconButton
} from "@mui/material";
import { userStyle } from "../../../../../pageStyle";
import { FaFileCsv, FaFileExcel, FaPrint, FaFilePdf } from "react-icons/fa";
import { SERVICE } from '../../../../../services/Baseservice';
import axios from "axios";
import jsPDF from "jspdf";
import { DataGrid } from '@mui/x-data-grid';
import { AuthContext, UserRoleAccessContext } from "../../../../../context/Appcontext";
import Headtitle from "../../../../../components/Headtitle";
import { handleApiError } from "../../../../../components/Errorhandling";
import 'jspdf-autotable';
import { useReactToPrint } from "react-to-print";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import { styled } from '@mui/system';
import ExcelJS from 'exceljs';
import { saveAs } from "file-saver";
import Papa from "papaparse";
import Switch from '@mui/material/Switch';
import CloseIcon from '@mui/icons-material/Close';
import html2canvas from 'html2canvas';
import CircularProgress, { circularProgressClasses, } from '@mui/material/CircularProgress';
import ImageIcon from '@mui/icons-material/Image';


function FacebookCircularProgress(props) {
    return (
        <Box style={{ position: 'relative' }}>
            <CircularProgress
                variant="determinate"
                style={{
                    color: (theme) =>
                        theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
                }}
                size={40}
                thickness={4}
                {...props}
                value={100}
            />
            <CircularProgress
                variant="indeterminate"
                disableShrink
                style={{
                    color: (theme) => (theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8'),
                    animationDuration: '550ms',
                    position: 'absolute',
                    left: 0,
                    [`& .${circularProgressClasses.circle}`]: {
                        strokeLinecap: 'round',
                    },
                }}
                size={40}
                thickness={4}
                {...props}
            />
        </Box>
    );
}

const TertiaryIndividual = () => {

    const [indWorkReport, setIndWorkReport] = useState([])

    const gridRef = useRef(null);

    //Datatable
    const [pageSecondary, setPageSecondary] = useState(1);
    const [pageSizeSecondary, setPageSizeSecondary] = useState(10);
    const [items, setItems] = useState([]);
    const [searchQuerySecondary, setSearchQuerySecondary] = useState("");

    const { auth } = useContext(AuthContext);
    const { isUserRoleAccess, isUserRoleCompare } = useContext(UserRoleAccessContext);
    const [isLoader, setIsLoader] = useState(false);
    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const handleClickOpenerr = () => { setIsErrorOpen(true); };
    const handleCloseerr = () => { setIsErrorOpen(false); };
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [copiedData, setCopiedData] = useState('');
    const [canvasState, setCanvasState] = useState(false)
    //image
    const handleCaptureImage = () => {
        const table = document.getElementById("excelcanvastable");
        const clonedTable = table.cloneNode(true);
        clonedTable.style.position = "absolute";
        clonedTable.style.top = "-9999px";
        document.body.appendChild(clonedTable);
        html2canvas(clonedTable).then((canvas) => {
            document.body.removeChild(clonedTable);
            const dataURL = canvas.toDataURL("image/jpeg", 0.8);
            const link = document.createElement("a");
            link.href = dataURL;
            link.download = "Tertiary_WorkOrder_Individual_list.png";
            link.click();
        });
    };

    // Manage Columns
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null)

    const handleOpenManageColumns = (event) => {
        setAnchorEl(event.currentTarget);
        setManageColumnsOpen(true);
    };
    const handleCloseManageColumns = () => {
        setManageColumnsOpen(false);
        setSearchQueryManage("")
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    const getRowClassName = (params) => {
        if ((params.row.tat).includes('ago')) {
            return 'custom-ago-row'; // This is the custom class for rows with item.tat === 'ago'
        }
        return ''; // Return an empty string for other rows
    };
    const getRowClassNameAll = (params) => {
        const itemTat = params.row.tat || "";
        const containsIn = itemTat.includes("in") && !itemTat.includes("day") && !itemTat.includes("days");
        const timeInHours = containsIn
            ? parseFloat(itemTat.split("in")[1]?.trim())
            : NaN;
        const conditionMet = containsIn && !isNaN(timeInHours) && timeInHours < 15;
        if ((params.row.tat).includes('ago')) {
            return 'custom-ago-row'; // This is the custom class for rows with item.tat === 'ago'
        } else if ((params.row.tat)?.includes("an hour") || (params.row.tat)?.includes("minute") || (params.row.tat)?.includes("in 2 hours") || conditionMet) {
            return 'custom-in-row';
        } else {
            return 'custom-others-row';
        }
    };

    const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
        '& .MuiDataGrid-virtualScroller': {
            overflowY: 'hidden',
        },
        '& .custom-ago-row': {
            backgroundColor: '#ff00004a !important',
        },
        '& .custom-in-row': {
            backgroundColor: '#ffff0061 !important',
        },
        '& .custom-others-row': {
            backgroundColor: '#0080005e !important',
        },
        '& .MuiDataGrid-row.Mui-selected': {
            '& .custom-ago-row, & .custom-in-row, & .custom-others-row': {
                backgroundColor: 'unset !important', // Clear the background color for selected rows
            },
        },
        '&:hover': {
            '& .custom-ago-row:hover': {
                backgroundColor: '#ff00004a !important',
            },
            '& .custom-in-row:hover': {
                backgroundColor: '#ffff0061 !important',
            },
            '& .custom-others-row:hover': {
                backgroundColor: '#0080005e !important',
            },
        },
    }));

    const initialColumnVisibility = {
        actions: true,
        checkboxSelection: true,
        serialNumber: true,
        project: true,
        vendor: true,
        priority: true,
        process: true,
        customer: true,
        hyperlink: true,
        count: true,
        branch: true,
        resperson: true,
        tat: true,
        created: true,
        category: true,
        subcategory: true,
        queue: true,
        unit: true,
        team: true,
        prioritystatus: true,
        points: true,
        time: true,

    };

    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);


    // get all Individual Workorder List form excelmapdatarespeople db
    const fetchIndividualReport = async () => {
        try {
            let res = await axios.post(SERVICE.TERTIARY_INDIVIDUALWORKORDER, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                companyname: String(isUserRoleAccess.companyname),
                team: String(isUserRoleAccess.team),
            });

            setIndWorkReport(res?.data?.finalresult)
            setIsLoader(true)
        } catch (err) {setIsLoader(true);handleApiError(err, setShowAlert, handleClickOpenerr);}
    }

    useEffect(() => {
        fetchIndividualReport();
    }, [])

    //datatable....
    const addSerialNumberSecondary = () => {
        const itemsWithSerialNumberSecondary = indWorkReport?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
        setItems(itemsWithSerialNumberSecondary);
    }

    useEffect(() => {
        addSerialNumberSecondary();
    }, [indWorkReport]);

    //Datatable
    const handlePageChangeSecondary = (newPage) => {
        setPageSecondary(newPage);
    };

    const handlePageSizeChangeSecondary = (event) => {
        setPageSizeSecondary(Number(event.target.value));
        setPageSecondary(1);
    };

    //datatable....   
    const handleSearchChangeSecondary = (event) => {
        setSearchQuerySecondary(event.target.value);
    };

    // Split the search query into individual terms
    const searchOverTerms = searchQuerySecondary.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatasSecondary = items?.filter((item) => {
        return searchOverTerms.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
        );
    });

    const filteredDataSecondary = filteredDatasSecondary?.slice((pageSecondary - 1) * pageSizeSecondary, pageSecondary * pageSizeSecondary);

    const totalPagesSecondary = Math.ceil(filteredDatasSecondary?.length / pageSizeSecondary);

    const visiblePagesSecondary = Math.min(totalPagesSecondary, 3);

    const firstVisiblePageSecondary = Math.max(1, pageSecondary - 1);
    const lastVisiblePageSecondary = Math.min(Math.abs(firstVisiblePageSecondary + visiblePagesSecondary - 1), totalPagesSecondary);

    const pageNumbersSecondary = [];

    const indexOfLastItemSecondary = pageSecondary * pageSizeSecondary;
    const indexOfFirstItemSecondary = indexOfLastItemSecondary - pageSizeSecondary;

    for (let i = firstVisiblePageSecondary; i <= lastVisiblePageSecondary; i++) {
        pageNumbersSecondary.push(i);
    }

    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ''; // This is required for Chrome support
    };

    useEffect(
        () => {
            const beforeUnloadHandler = (event) => handleBeforeUnload(event);
            window.addEventListener('beforeunload', beforeUnloadHandler);
            return () => {
                window.removeEventListener('beforeunload', beforeUnloadHandler);
            };
        }, []);

    let overallCount = 0;
    const totalcount = filteredDataSecondary && (
        filteredDataSecondary.forEach((item) => {
            overallCount += Number(item.count);
        })
    );


    const columnDataTable = [

        { field: "priority", headerName: <span style={{ fontWeight: 'bold' }}>Priority</span>, flex: 0, width: 75, hide: !columnVisibility.priority },

        { field: "customer", headerName: <span style={{ fontWeight: 'bold' }}>Customer</span>, flex: 0, width: 100, hide: !columnVisibility.customer },
        {
            field: "hyperlink",
            headerName: "Process Hyperlink",
            flex: 0,
            width: 340,
            hide: !columnVisibility.hyperlink,
            renderCell: (params) => (
                params?.row?.hyperlink?.startsWith('http') ?
                    <a href={params.row.hyperlink} target="_blank">
                        {params.row.process}
                    </a> : params.row.process
            ),
            headerClassName: "bold-header"
        },
        { field: "count", headerName: <span style={{ fontWeight: 'bold' }}>Count</span>, flex: 0, width: 75, hide: !columnVisibility.count },
        { field: "tat", headerName: <span style={{ fontWeight: 'bold' }}>TAT Expiration</span>, flex: 0, width: 150, hide: !columnVisibility.tat },
        { field: "created", headerName: <span style={{ fontWeight: 'bold' }}>Created</span>, flex: 0, width: 100, hide: !columnVisibility.created },
        { field: "branch", headerName: <span style={{ fontWeight: 'bold' }}>Branch</span>, flex: 0, width: 100, hide: !columnVisibility.branch },
        { field: "resperson", headerName: <span style={{ fontWeight: 'bold' }}>Responsible Person</span>, flex: 0, width: 300, hide: !columnVisibility.resperson },
        { field: "category", headerName: <span style={{ fontWeight: 'bold' }}>Category</span>, flex: 0, width: 300, hide: !columnVisibility.category },
        { field: "subcategory", headerName: <span style={{ fontWeight: 'bold' }}>Subcategory</span>, flex: 0, width: 150, hide: !columnVisibility.subcategory },
        { field: "queue", headerName: <span style={{ fontWeight: 'bold' }}>Queue</span>, flex: 0, width: 340, hide: !columnVisibility.queue },
        { field: "serialNumber", headerName: <span style={{ fontWeight: 'bold' }}>SNo</span>, flex: 0, width: 50, hide: !columnVisibility.serialNumber },
        { field: "project", headerName: <span style={{ fontWeight: 'bold' }}>Project</span>, flex: 0, width: 200, hide: !columnVisibility.project },
        { field: "vendor", headerName: <span style={{ fontWeight: 'bold' }}>Vendor</span>, flex: 0, width: 150, hide: !columnVisibility.vendor },
        { field: "unit", headerName: <span style={{ fontWeight: 'bold' }}>Unit</span>, flex: 0, width: 150, hide: !columnVisibility.unit },
        { field: "team", headerName: <span style={{ fontWeight: 'bold' }}> Team</span>, flex: 0, width: 100, hide: !columnVisibility.team },
        { field: "prioritystatus", headerName: <span style={{ fontWeight: 'bold' }}>Sector</span>, flex: 0, width: 100, hide: !columnVisibility.prioritystatus },
        { field: "points", headerName: <span style={{ fontWeight: 'bold' }}>Points</span>, flex: 0, width: 100, hide: !columnVisibility.points },
        { field: "time", headerName: <span style={{ fontWeight: 'bold' }}>Time</span>, flex: 0, width: 100, hide: !columnVisibility.time },
    ];

    // Create a row data object for the DataGrid
    const rowDataTable = filteredDataSecondary.map((item, index) => {
        return {
            id: index,
            serialNumber: item.serialNumber,
            project: item.project,
            vendor: item.vendor,
            priority: Number(item.priority),
            process: item.process,
            customer: item.customer,
            hyperlink: item?.hyperlink,
            count: Number(item.count),
            branch: item.branch,
            resperson: item.resperson,
            tat: item.tat,
            created: item.created,
            category: item.category,
            subcategory: item.subcategory,
            queue: item.queue,
            unit: item.unit,
            team: item.team,
            prioritystatus: item.prioritystatus,
            points: item.points == 'Unallotted' ? 'Unallotted' : Number(item.points),
            time: item.time,
        }
    });

    const handleShowAllColumns = () => {
        const updatedVisibility = { ...columnVisibility };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibility(updatedVisibility);
    };

    const filteredColumns = columnDataTable?.filter((column) => {
        if (column.field === 'checkboxSelection') {
            // If you want to include the checkbox column, return true.
            // If you want to exclude it from filtering, return false.
            return true; // Include the checkbox column
        }
        if (typeof column?.headerName === 'string') {
            return column?.headerName?.toLowerCase()?.includes(searchQueryManage?.toLowerCase());
        }
        if (typeof column?.headerName === 'object' && column?.headerName?.props?.children) {
            const headerText = typeof column.headerName.props.children === 'string'
                ? column.headerName.props.children
                : '';
            return headerText.toLowerCase().includes(searchQueryManage?.toLowerCase());
        }
        return false;
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
        <Box style={{ padding: "10px", minWidth: "325px", '& .MuiDialogContent-root': { padding: '10px 0' } }} >
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
                <TextField
                    label="Find column"
                    variant="standard"
                    fullWidth
                    value={searchQueryManage}
                    onChange={(e) => setSearchQueryManage(e.target.value)}
                    sx={{ marginBottom: 5, position: 'absolute', }}
                />
            </Box><br /><br />
            <DialogContent sx={{ minWidth: 'auto', height: '200px', position: 'relative' }}>
                <List sx={{ overflow: 'auto', height: '100%', }}>
                    <ListItemText sx={{ display: 'flex', marginLeft: '15px' }}
                        primary={
                            <Switch sx={{ marginTop: "0px" }} size="small"
                                checked={columnVisibility.checkboxSelection}
                                onChange={() => toggleColumnVisibility('checkboxSelection')}
                            />
                        }
                        secondary={<Typography variant="subtitle1" sx={{ fontSize: "15px", fontWeight: '400' }}>Checkbox Selection</Typography>}
                    />
                    {filteredColumns.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText sx={{ display: 'flex' }}
                                primary={
                                    <Switch sx={{ marginTop: "-5px" }} size="small"
                                        checked={columnVisibility[column.field]}
                                        onChange={() => toggleColumnVisibility(column.field)}
                                    />
                                }
                                secondary={column.headerName}
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
                            sx={{ textTransform: 'none', }}
                            onClick={() => setColumnVisibility(initialColumnVisibility)}
                        >
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
    const downloadExcelSecondary = async () => {

        try {
            // Fetch the data if not already fetched
            if (!indWorkReport?.length) {
                await fetchIndividualReport();
            }
            // downloadCsvSecondary();
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Primary OverTat');

            // Define the columns
            worksheet.columns = [
                { header: 'Priority', key: 'priority', width: 10 },
                { header: 'Customer', key: 'customer', width: 20 },
                { header: "Process Hyperlink", key: 'process', width: 20 },
                { header: "Count", key: 'count', width: 10 },
                { header: "Tat", key: 'tat', width: 20 },
                { header: "Created", key: 'created', width: 20 },
                { header: "Branch", key: 'branch', width: 20 },
                { header: "Responsible Person", key: 'resperson', width: 20 },
                { header: "Category Name", key: 'category', width: 20 },
                { header: "Subcategory Name", key: 'subcategory', width: 20 },
                { header: "Queue Name", key: 'queue', width: 20 },
                { header: 'S.No', key: 'serialNumber', width: 10 },
                { header: 'Project Name', key: 'project', width: 20 },
                { header: 'Vendor Name', key: 'vendor', width: 20 },
                { header: "Unit", key: 'unit', width: 20 },
                { header: "Team", key: 'team', width: 20 },
                { header: "Sector", key: 'prioritystatus', width: 20 },
                { header: "Points", key: 'points', width: 20 },
                { header: "Time", key: 'time', width: 20 },
            ];

            // Add data to the worksheet
            filteredDataSecondary.forEach((row, index) => {
                worksheet.addRow({
                    'Priority': parseInt(row.priority),
                    'Customer': row.customer,
                    "Process Hyperlink": row.process,
                    "Count": parseInt(row.count),
                    "Tat": row.tat,
                    "Created": row.created,
                    "Branch": row.branch,
                    "Responsible Person": row.resperson,
                    "Category Name": row.category,
                    "Subcategory Name": row.subcategory,
                    "Queue Name": row.queue,
                    'S.No': index + 1,
                    'Project Name': row.project,
                    'Vendor Name': row.vendor,
                    "Unit": row.unit,
                    "Team": row.team,
                    "Sector": row.prioritystatus,
                    "Points": row.points,
                    "Time": row.time,
                });
            });

            // Define a hyperlink style
            const hyperlinkStyle = {
                font: { color: { argb: '0000FF' }, underline: true },
            };

            // Add hyperlinks to the worksheet
            filteredDataSecondary.forEach((row, index) => {

                const cell = worksheet.getCell(`C${index + 2}`); // Process Hyperlink
                const link = {
                    text: row.process,
                    hyperlink: row.hyperlink,
                    tooltip: 'Click to open process',
                };
                cell.value = row?.hyperlink?.startsWith("http") ? link : row.process;
                cell.style = hyperlinkStyle;

                // Set other cell values for additional columns
                worksheet.getCell(`A${index + 2}`).value = parseInt(row.priority);
                worksheet.getCell(`B${index + 2}`).value = row.customer;
                worksheet.getCell(`D${index + 2}`).value = parseInt(row.count);
                worksheet.getCell(`E${index + 2}`).value = row.tat;
                worksheet.getCell(`F${index + 2}`).value = row.created;
                worksheet.getCell(`G${index + 2}`).value = row.branch;
                worksheet.getCell(`H${index + 2}`).value = row.resperson;
                worksheet.getCell(`I${index + 2}`).value = row.category;
                worksheet.getCell(`J${index + 2}`).value = row.subcategory;
                worksheet.getCell(`K${index + 2}`).value = row.queue;
                worksheet.getCell(`L${index + 2}`).value = index + 1;
                worksheet.getCell(`M${index + 2}`).value = row.project;
                worksheet.getCell(`N${index + 2}`).value = row.vendor;
                worksheet.getCell(`O${index + 2}`).value = row.unit;
                worksheet.getCell(`P${index + 2}`).value = row.team;
                worksheet.getCell(`Q${index + 2}`).value = row.prioritystatus;
                worksheet.getCell(`R${index + 2}`).value = row.points == 'Unallotted' ? '0.0000' : parseFloat(row.points);
                worksheet.getCell(`S${index + 2}`).value = row.time;
            });

            // Create a buffer from the workbook
            const buffer = await workbook.xlsx.writeBuffer();

            // Create a Blob object and initiate the download
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Tertiary_WorkOrder_Individual_list.xlsx'; // File name
            a.click();
        } catch (error) {
            // Handle any errors that may occur during the process
            console.error(error);
        }
    };

    // Function to generate a downloadable CSV file
    const downloadCsvSecondary = () => {
        const csvData = [];

        // Add CSV headers
        const headers = ['Priority', 'Customer', 'Process Hyperlink', 'Count', 'Tat Expiration', 'Created',
            'Branch', 'Responsible Person', 'Category Name', 'Subcategory Name', 'Queue Name', 'S.No', 'Project Name', 'Vendor Name', 'Unit', 'Team', 'Sector', 'Points', 'Time',
        ];
        csvData.push(headers);

        // Add data rows
        filteredDataSecondary.forEach((row, index) => {
            const rowData = [
                parseInt(row.priority),
                row.customer,
                row?.hyperlink?.startsWith("http") ? `=HYPERLINK("${row.hyperlink}", "${row.process}")` : row.process, // This creates a clickable link in Excel
                parseInt(row.count),
                row.tat,
                row.created,
                row.branch,
                row.resperson,
                row.category,
                row.subcategory,
                row.queue,
                index + 1,
                row.project,
                row.vendor,
                row.unit,
                row.team,
                row.prioritystatus,
                row.points == 'Unallotted' ? '0.0000' : parseFloat(row.points),
                row.time,
            ];
            csvData.push(rowData);
        });

        // Convert the CSV data to a string
        const csvString = Papa.unparse(csvData);

        // Create a Blob object and initiate the download
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8' });
        saveAs(blob, 'Tertiary_WorkOrder_Individual_list.csv'); // Specify the filename with .csv extension
    };

    // Print...Secondary
    const componentRefSecondary = useRef();
    const handleprintSecondary = useReactToPrint({
        content: () => componentRefSecondary.current,
        documentTitle: 'Tertiary_WorkOrder_Individual_list',
        pageStyle: 'print'
    });

    //  PDF
    const columns = [
        { title: "S.NO", field: "serialNumber" },
        { title: "Project Name", field: "project" },
        { title: "Vendor Name", field: "vendor" },
        { title: "Priority", field: "priority" },
        { title: "Customer", field: "customer" },
        { title: "Process Hyperlink", field: "process" },
        { title: "Count", field: "count" },
        { title: "Tat", field: "tat" },
        { title: "Created", field: "created" },
        { title: "Category Name", field: "category" },
        { title: "Subcategory Name", field: "subcategory" },
        { title: "Queue Name", field: "queue" },
        { title: "Branch", field: "branch" },
        { title: "Unit", field: "unit" },
        { title: "Team", field: "team" },
        { title: "Responsible Person", field: "resperson" },
        { title: "Sector", field: "prioritystatus" },
        { title: "Points", field: "points" },
        { title: "Time", field: "time" },
    ]

    const downloadPdfSecondary = () => {
        const doc = new jsPDF({
            orientation: 'landscape', // Set the orientation to landscape
        });
        doc.autoTable({
            theme: "grid",
            styles: {
                fontSize: 6,
                cellWidth: 'auto'
            },
            columns: columns.map((col) => ({ ...col, dataKey: col.field })),
            body: filteredDataSecondary,
        });
        doc.save("Tertiary_WorkOrder_Individual_list.pdf");
    };

    return (
        <>
            <Headtitle title={'Work Order Individual Tertiary'} />
            {isUserRoleCompare?.includes("ltertiaryindividualworkorderlist")
                && (
                    <>
                        <Box sx={userStyle.container}>
                            <Typography sx={userStyle.SubHeaderText}>Tertiary WorkOrder List Individual</Typography>
                            <br /><br />
                            { /* ****** Header Buttons ****** */}

                            <Grid style={userStyle.dataTablestyle}>
                                <Box>
                                    <label htmlFor="pageSizeSelect">Show entries:</label>
                                    <Select id="pageSizeSelect" defaultValue="" value={pageSizeSecondary} onChange={handlePageSizeChangeSecondary} sx={{ width: "77px" }}>
                                        <MenuItem value={1}>1</MenuItem>
                                        <MenuItem value={5}>5</MenuItem>
                                        <MenuItem value={10}>10</MenuItem>
                                        <MenuItem value={25}>25</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
                                        <MenuItem value={100}>100</MenuItem>
                                        <MenuItem value={(indWorkReport?.length)}>All</MenuItem>
                                    </Select>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'end' }}>
                                    <Grid >
                                        {isUserRoleCompare?.includes("csvtertiaryindividualworkorderlist")
                                            && (
                                                <>
                                                    <Button sx={userStyle.buttongrp} onClick={downloadCsvSecondary}>&ensp;<FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                                                </>)}
                                        {isUserRoleCompare?.includes("exceltertiaryindividualworkorderlist")
                                            && (
                                                <>
                                                    <Button sx={userStyle.buttongrp} onClick={downloadExcelSecondary}>&ensp;<FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                                </>)}
                                        {isUserRoleCompare?.includes("printtertiaryindividualworkorderlist")
                                            && (
                                                <>
                                                    <Button sx={userStyle.buttongrp} onClick={handleprintSecondary}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                                </>)}
                                        {isUserRoleCompare?.includes("pdftertiaryindividualworkorderlist")
                                            && (
                                                <>
                                                    <Button sx={userStyle.buttongrp} onClick={() => downloadPdfSecondary()}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                                </>)}
                                        {isUserRoleCompare?.includes("imagetertiaryindividualworkorderlist")
                                            && (
                                                <>
                                                    <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}> <ImageIcon sx={{ fontSize: "15px" }} />  &ensp;Image&ensp; </Button>

                                                </>)}
                                    </Grid>
                                </Box>
                                <Box>
                                    <FormControl fullWidth size="small" >
                                        <Typography>Search</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={searchQuerySecondary}
                                            onChange={handleSearchChangeSecondary}
                                        />
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid container sx={{ diaplay: 'flex', backgroundColor: '#dcdbdb00', postion: 'sticky', padding: '10px 05px' }}>
                                        <Box>
                                            Total Pages
                                        </Box>&ensp;&ensp;&ensp;
                                        <Box >
                                            <span style={{ fontWeight: 'bold', fontSize: '20px' }} >  Count</span> :<span style={{ fontWeight: 'bold', fontSize: '20px' }} >{overallCount}</span>
                                        </Box>
                                    </Grid>
                            <Button sx={userStyle.buttongrp} onClick={() => { handleShowAllColumns(); setColumnVisibility(initialColumnVisibility) }}>Show All Columns</Button> &ensp;
                            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>Manage Columns</Button>
                            <br />
                            <br />

                            {!isLoader ?
                                <>
                                    <Box style={{ display: 'flex', justifyContent: 'center' }}>
                                        <FacebookCircularProgress />
                                    </Box>
                                </>
                                :
                                <>
                                    <Box
                                        style={{
                                            // height: calculateDataGridHeightPrimaryAll(),
                                            width: '100%',
                                            overflowY: 'hidden', // Hide the y-axis scrollbar
                                        }}
                                    >
                                        <StyledDataGrid
                                            onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
                                            rows={rowDataTable}
                                            columns={columnDataTable.filter((column) => columnVisibility[column.field])}
                                            autoHeight={true}
                                            ref={gridRef}
                                            density="compact"
                                            hideFooter
                                            disableRowSelectionOnClick
                                            unstable_cellSelection
                                            unstable_ignoreValueFormatterDuringExport
                                            checkboxSelection={columnVisibility.checkboxSelection} // Set checkboxSelection based on visibility state
                                            getRowClassName={getRowClassNameAll}
                                        />
                                    </Box>
                                    <Grid container sx={{ diaplay: 'flex', backgroundColor: '#dcdbdb00', postion: 'sticky', padding: '10px 05px', boxShadow: '0px 0px 2px grey' }}>
                                        <Box>
                                            Total Pages
                                        </Box>&ensp;&ensp;&ensp;
                                        <Box >
                                            <span style={{ fontWeight: 'bold', fontSize: '20px' }} >  Count</span> :<span style={{ fontWeight: 'bold', fontSize: '20px' }} >{overallCount}</span>
                                        </Box>
                                    </Grid>
                                    <br />
                                    <Box style={userStyle.dataTablestyle}>
                                        <Box>
                                            Showing  {filteredDataSecondary.length > 0 ? ((pageSecondary - 1) * pageSizeSecondary) + 1 : 0}  to {Math.min(pageSecondary * pageSizeSecondary, filteredDatasSecondary.length)} of {filteredDatasSecondary.length} entries
                                        </Box>
                                        <Box>
                                            <Button onClick={() => setPageSecondary(1)} disabled={pageSecondary === 1} sx={userStyle.paginationbtn}>
                                                <FirstPageIcon />
                                            </Button>
                                            <Button onClick={() => handlePageChangeSecondary(pageSecondary - 1)} disabled={pageSecondary === 1} sx={userStyle.paginationbtn}>
                                                <NavigateBeforeIcon />
                                            </Button>
                                            {pageNumbersSecondary?.map((pageNumber) => (
                                                <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChangeSecondary(pageNumber)} className={((pageSecondary)) === pageNumber ? 'active' : ''} disabled={pageSecondary === pageNumber}>
                                                    {pageNumber}
                                                </Button>
                                            ))}
                                            {lastVisiblePageSecondary < totalPagesSecondary && <span>...</span>}
                                            <Button onClick={() => handlePageChangeSecondary(pageSecondary + 1)} disabled={pageSecondary === totalPagesSecondary} sx={userStyle.paginationbtn}>
                                                <NavigateNextIcon />
                                            </Button>
                                            <Button onClick={() => setPageSecondary((totalPagesSecondary))} disabled={pageSecondary === totalPagesSecondary} sx={userStyle.paginationbtn}>
                                                <LastPageIcon />
                                            </Button>
                                        </Box>
                                    </Box>
                                    {/* ****** Table End ****** */}
                                </>

                            }

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
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                {manageColumnsContent}
            </Popover>
            <br />

            {/* print layout Secondary */}
            <TableContainer component={Paper} sx={userStyle.printcls} >
                <Table
                    aria-label="simple table"
                    id="excel"
                    ref={componentRefSecondary}
                >
                    <TableHead sx={{ fontWeight: "600" }}>
                        <TableRow>
                            <TableCell>S.No</TableCell>
                            <TableCell>Project Name</TableCell>
                            <TableCell>Vendor Name</TableCell>
                            <TableCell>Priority</TableCell>
                            <TableCell>Customer</TableCell>
                            <TableCell>Process Hyperlink</TableCell>
                            <TableCell>Count</TableCell>
                            <TableCell>Branch </TableCell>
                            <TableCell>Resperson</TableCell>
                            <TableCell>Tat</TableCell>
                            <TableCell>Created</TableCell>
                            <TableCell>Category Name</TableCell>
                            <TableCell>Subcategory Name</TableCell>
                            <TableCell>Queue Name</TableCell>
                            <TableCell>Unit</TableCell>
                            <TableCell>Team</TableCell>
                            <TableCell>Sector</TableCell>
                            <TableCell>Points</TableCell>
                            <TableCell>Time</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredDataSecondary &&
                            (filteredDataSecondary.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{row.project}</TableCell>
                                    <TableCell>{row.vendor}</TableCell>
                                    <TableCell>{row.priority}</TableCell>
                                    <TableCell>{row.customer}</TableCell>
                                    <TableCell>{row?.hyperlink?.includes("http") ? (<a href={row.hyperlink} target="_blank" style={{ color: '#3769bf', fontSize: '13px' }}>{row.process} </a>) : row.process} </TableCell>
                                    <TableCell>{row.count}</TableCell>
                                    <TableCell>{row.branch}</TableCell>
                                    <TableCell>{row.tat}</TableCell>
                                    <TableCell>{row.created}</TableCell>
                                    <TableCell>{row.category}</TableCell>
                                    <TableCell>{row.subcategory}</TableCell>
                                    <TableCell>{row.queue}</TableCell>
                                    <TableCell>{row.resperson}</TableCell>
                                    <TableCell>{row.unit}</TableCell>
                                    <TableCell>{row.team}</TableCell>
                                    <TableCell>{row.prioritystatus}</TableCell>
                                    <TableCell>{row.points}</TableCell>
                                    <TableCell>{row.time}</TableCell>
                                </TableRow>
                            )))}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* print layout End */}


            <TableContainer component={Paper} style={{
                display: canvasState === false ? 'none' : 'block',
            }} >
                <Table
                    aria-label="simple table"
                    id="excelcanvastable"
                    ref={gridRef}
                >
                    <TableHead sx={{ fontWeight: "600" }}>
                        <TableRow>
                            <TableCell>Priority</TableCell>
                            <TableCell>Customer</TableCell>
                            <TableCell>Process Hyperlink</TableCell>
                            <TableCell>Count</TableCell>
                            <TableCell>Tat</TableCell>
                            <TableCell>Created</TableCell>
                            <TableCell>Branch</TableCell>
                            <TableCell>Responsible Person </TableCell>
                            <TableCell>Category Name </TableCell>
                            <TableCell>Subcategory Name </TableCell>
                            <TableCell>Queue Name</TableCell>
                            <TableCell>S.No</TableCell>
                            <TableCell>Project</TableCell>
                            <TableCell>Vendor</TableCell>
                            <TableCell>Unit</TableCell>
                            <TableCell>Team</TableCell>
                            <TableCell>Sector</TableCell>
                            <TableCell>Points</TableCell>
                            <TableCell>Time</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {filteredDataSecondary &&
                            (filteredDataSecondary.map((row, index) => {
                                const itemTat = row.tat || "";
                                const containsIn = itemTat.includes("in") && !itemTat.includes("day") && !itemTat.includes("days");
                                const timeInHours = containsIn
                                    ? parseFloat(itemTat.split("in")[1]?.trim())
                                    : NaN;

                                const conditionMet = containsIn && !isNaN(timeInHours) && timeInHours < 15;
                                return (


                                    <TableRow key={index} sx={{ background: (row.tat).includes('ago') ? "#ff00004a !important" : (row.tat).includes("an hour") || (row.tat).includes(" minute") || (row.tat).includes("in 2 hours") || conditionMet ? "#ffff0061 !important " : "#0080005e !important" }}>

                                        <TableCell>{row.priority}</TableCell>
                                        <TableCell>{row.customer}</TableCell>
                                        <TableCell>{row.process} </TableCell>
                                        <TableCell>{row.count}</TableCell>
                                        <TableCell>{row.tat}</TableCell>
                                        <TableCell>{row.created}</TableCell>
                                        <TableCell>{row.branch}</TableCell>
                                        <TableCell>{row.resperson}</TableCell>
                                        <TableCell>{row.category}</TableCell>
                                        <TableCell>{row.subcategory}</TableCell>
                                        <TableCell>{row.queue}</TableCell>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{row.project}</TableCell>
                                        <TableCell>{row.vendor}</TableCell>
                                        <TableCell>{row.unit}</TableCell>
                                        <TableCell>{row.team}</TableCell>
                                        <TableCell>{row.prioritystatus}</TableCell>
                                        <TableCell>{row.points}</TableCell>
                                        <TableCell>{row.time}</TableCell>
                                    </TableRow>
                                )
                            }

                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* ALERT DIALOG */}
            <Box>
                <Dialog
                    open={isErrorOpen}
                    onClose={handleCloseerr}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        <Typography variant="h6" >{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error" onClick={handleCloseerr}>ok</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </>
    );
}
export default TertiaryIndividual;