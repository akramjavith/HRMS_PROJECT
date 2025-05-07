import React, { useState, useEffect, useRef, useContext } from "react";
import {
    Box, Typography, OutlinedInput, Select, MenuItem, Dialog, TableBody, TableCell, TableRow, DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead, TableContainer, Button,
    List, ListItem, ListItemText, Popover, TextField, IconButton,
} from "@mui/material";
import { userStyle } from "../../../../pageStyle";
import { FaPrint, FaFilePdf, FaFileCsv, FaFileExcel } from "react-icons/fa";
import { SERVICE } from '../../../../services/Baseservice';
import axios from "axios";
import jsPDF from "jspdf";
import { AuthContext } from "../../../../context/Appcontext";
import { DataGrid } from '@mui/x-data-grid';
import Headtitle from "../../../../components/Headtitle";
import { handleApiError } from "../../../../components/Errorhandling";
import { styled } from '@mui/system';
import 'jspdf-autotable';
import CircularProgress, { circularProgressClasses, } from '@mui/material/CircularProgress';
import { useReactToPrint } from "react-to-print";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import ExcelJS from 'exceljs';
import { saveAs } from "file-saver";
import Papa from "papaparse";
import Switch from '@mui/material/Switch';
import CloseIcon from '@mui/icons-material/Close';
import html2canvas from 'html2canvas';
import ImageIcon from '@mui/icons-material/Image';
import { UserRoleAccessContext } from "../../../../context/Appcontext";

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



const Primarworkorder = () => {

    const gridRefOvertat = useRef(null);
    const gridRefNeartat = useRef(null);
    const gridRefPrimary = useRef(null);

    //Datatable
    const [pagePrimary, setPagePrimary] = useState(1);
    const [pageSizePrimary, setPageSizePrimary] = useState(10);

    const { isUserRoleCompare } = useContext(UserRoleAccessContext);

    //Datatable neartat
    const [pageNearTatPrimary, setPageNearTatPrimary] = useState(1);
    const [pageSizeNearTatPrimary, setPageSizeNearTatPrimary] = useState(10);

    //Datatable allprimary
    const [pageAllPrimary, setPageAllPrimary] = useState(1);
    const [pageSizeAllPrimary, setPageSizeAllPrimary] = useState(10);

    const { auth } = useContext(AuthContext);

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const handleClickOpenerr = () => { setIsErrorOpen(true); };
    const handleCloseerr = () => { setIsErrorOpen(false); };

    const [tableDataOverTatPrimary, setTableDataOverTatPrimary] = useState([]);
    const [tableDataNearTatPrimary, setTableDataNearTatPrimary] = useState([]);
    const [tableDataAllPrimary, setTableDataAllPrimary] = useState([]);
    const [checkprimaryovertatdata, setCheckprimaryovertatdata] = useState(false);
    const [checkprimaryneartatdata, setCheckprimaryneartatdata] = useState(false);
    const [checkprimaryalldata, setCheckprimaryalldata] = useState(false);

    //clipboard
    const [copiedDataOvertat, setCopiedDataOvertat] = useState('');
    const [copiedDataNeartat, setCopiedDataNeartat] = useState('');
    const [copiedDataPrimary, setCopiedDataPrimary] = useState('');

    // State for manage columns search query
    const [searchQueryManageOvertat, setSearchQueryManageOvertat] = useState("");
    // Manage Columns
    const [isManageColumnsOpenOvertat, setManageColumnsOpenOvertat] = useState(false);
    const [anchorElOvertat, setAnchorElOvertat] = useState(null)
    const handleOpenManageColumnsOvertat = (event) => {
        setAnchorElOvertat(event.currentTarget);
        setManageColumnsOpenOvertat(true);
    };
    const handleCloseManageColumnsOvertat = () => {
        setManageColumnsOpenOvertat(false);
        setManageColumnsOpenOvertat("")
    };

    const openovertat = Boolean(anchorElOvertat);
    const idovertat = openovertat ? 'simple-popover' : undefined;

    // State for manage columns search query
    const [searchQueryManageNeartat, setSearchQueryManageNeartat] = useState("");
    // Manage Columns
    const [isManageColumnsOpenNeartat, setManageColumnsOpenNeartat] = useState(false);
    const [anchorElNeartat, setAnchorElNeartat] = useState(null)
    const handleOpenManageColumnsNeartat = (event) => {
        setAnchorElNeartat(event.currentTarget);
        setManageColumnsOpenNeartat(true);
    };
    const handleCloseManageColumnsNeartat = () => {
        setManageColumnsOpenNeartat(false);
        setSearchQueryManageNeartat("")
    };

    const openneartat = Boolean(anchorElNeartat);
    const idneartat = openneartat ? 'simple-popover' : undefined;

    // State for manage columns search query
    const [searchQueryManagePrimary, setSearchQueryManagePrimary] = useState("");
    // Manage Columns
    const [isManageColumnsOpenPrimary, setManageColumnsOpenPrimary] = useState(false);
    const [anchorElPrimary, setAnchorElPrimary] = useState(null)
    const handleOpenManageColumnsPrimary = (event) => {
        setAnchorElPrimary(event.currentTarget);
        setManageColumnsOpenPrimary(true);
    };
    const handleCloseManageColumnsPrimary = () => {
        setManageColumnsOpenPrimary(false);
        setSearchQueryManagePrimary("")
    };

    const openprimary = Boolean(anchorElPrimary);
    const idprimary = openprimary ? 'simple-popover' : undefined;
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

    // Show all columns
    const initialColumnVisibilityOvertat = {
        checkboxSelection: true,
        actions: true,
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
    const [columnVisibilityOvertat, setColumnVisibilityOvertat] = useState(initialColumnVisibilityOvertat);

    // Show all columns
    const initialColumnVisibilityNeartat = {
        checkboxSelection: true,
        actions: true,
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
    const [columnVisibilityNeartat, setColumnVisibilityNeartat] = useState(initialColumnVisibilityNeartat);

    // Show all columns
    const initialColumnVisibilityPrimary = {
        checkboxSelection: true,
        actions: true,
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
    const [columnVisibilityPrimary, setColumnVisibilityPrimary] = useState(initialColumnVisibilityPrimary);

    const getRowClassName = (params) => {
        if ((params.row.tat).includes('ago')) {
            return 'custom-ago-row'; // This is the custom class for rows with item.tat === 'ago'
        }
        return ''; // Return an empty string for other rows
    };

    const getRowClassNameNearTat = (params) => {
        if ((params.row.tat)?.includes("an hour") || (params.row.tat)?.includes("minute") || (params.row.tat)?.includes("in 2 hours")) {
            return 'custom-in-row'; // This is the custom class for rows with item.tat === 'ago'
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
        } else if ((params.row.tat)?.includes("an hour") || (params.row.tat)?.includes("minute") || (params.row.tat)?.includes("in 2 hours") || (params.row.tat)?.includes("in 3 hours") || (params.row.tat)?.includes("in 4 hours") || (params.row.tat)?.includes("in 5 hours") || (params.row.tat)?.includes("in 6 hours") || conditionMet) {
            return 'custom-in-row';
        } else {
            return 'custom-others-row';
        }
    };

    const fetchPrimaryWorkOrderOverTatList = async () => {
        try {
            let res = await axios.get(SERVICE.PRIMARYWORKORDEROVERTATDATA, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });

            setTableDataOverTatPrimary(res.data.result);
            setCheckprimaryovertatdata(true);
        } catch (err) {setCheckprimaryovertatdata(true);handleApiError(err, setShowAlert, handleClickOpenerr);}
    }

    const fetchPrimaryWorkOrderAllList = async () => {
        try {
            let res = await axios.get(SERVICE.PRIMARYWORKORDERNEARTATDATA, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });

            setTableDataNearTatPrimary(res.data.result);
            setCheckprimaryneartatdata(true);
        } catch (err) {setCheckprimaryneartatdata(true);handleApiError(err, setShowAlert, handleClickOpenerr);}
    }

    const fetchPrimaryWorkOrderNearTatList = async () => {
        try {
            let res = await axios.get(SERVICE.PRIMARYWORKORDERALL, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });

            setTableDataAllPrimary(res?.data?.result);
            setCheckprimaryalldata(true);
        } catch (err) {setCheckprimaryalldata(true);handleApiError(err, setShowAlert, handleClickOpenerr);}
    }

    useEffect(() => {
        fetchPrimaryWorkOrderOverTatList();
        fetchPrimaryWorkOrderNearTatList();
        fetchPrimaryWorkOrderAllList();
    }, [])

    //datatable....

    const [itemsPrimary, setItemsPrimary] = useState([]);

    const addSerialNumberPrimary = () => {
        const itemsWithSerialNumbePrimary = tableDataOverTatPrimary?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
        setItemsPrimary(itemsWithSerialNumbePrimary);
    }

    useEffect(() => {
        addSerialNumberPrimary();
    }, [tableDataOverTatPrimary]);


    //Primary table
    //table sorting
    const [sortingPrimary, setSortingPrimary] = useState({ column: '', direction: '' });
    //Datatable
    const handlePageChangePrimary = (newPage) => {
        setPagePrimary(newPage);
    };

    const handlePageSizeChangePrimary = (event) => {
        setPageSizePrimary(Number(event.target.value));
        setPagePrimary(1);
    };


    //datatable....
    const [searchQueryPrimary, setSearchQueryPrimary] = useState("");
    const handleSearchChangePrimary = (event) => {
        setSearchQueryPrimary(event.target.value);
    };

    // Split the search query into individual terms
    const searchOverAllTerms = searchQueryPrimary.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatasPrimary = itemsPrimary?.filter((item) => {
        return searchOverAllTerms.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
        );
    });


    const filteredDataPrimary = filteredDatasPrimary?.slice((pagePrimary - 1) * pageSizePrimary, pagePrimary * pageSizePrimary);

    const totalPagesPrimary = Math.ceil(filteredDatasPrimary?.length / pageSizePrimary);

    const visiblePagesPrimary = Math.min(totalPagesPrimary, 3);

    const firstVisiblePagePrimary = Math.max(1, pagePrimary - 1);
    const lastVisiblePagePrimary = Math.min(Math.abs(firstVisiblePagePrimary + visiblePagesPrimary - 1), totalPagesPrimary);


    const pageNumbersPrimary = [];

    const indexOfLastItemPrimary = pagePrimary * pageSizePrimary;
    const indexOfFirstItemPrimary = indexOfLastItemPrimary - pageSizePrimary;


    for (let i = firstVisiblePagePrimary; i <= lastVisiblePagePrimary; i++) {
        pageNumbersPrimary.push(i);
    }


    //neartat data table
    //datatable....

    const [itemsNearTatPrimary, setItemsNearTatPrimary] = useState([]);

    const addSerialNumberNearTatPrimary = () => {
        const itemsWithSerialNumbeNearTatPrimary = tableDataNearTatPrimary?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
        setItemsNearTatPrimary(itemsWithSerialNumbeNearTatPrimary);
    }

    useEffect(() => {
        addSerialNumberNearTatPrimary();
    }, [tableDataNearTatPrimary]);

    let overallCountprimary = 0;
    const totalcount = filteredDataPrimary && (
        filteredDataPrimary.forEach((item) => {
            overallCountprimary += Number(item.count);
        })
    );


    const columnDataTableOvertat = [
        { field: "priority", headerName: "Priority", flex: 0, width: 75, hide: !columnVisibilityPrimary.priority },
        { field: "customer", headerName: "Customer", flex: 0, width: 100, hide: !columnVisibilityPrimary.customer },
        {
            field: "hyperlink",
            headerName: "Process Hyperlink",
            flex: 0,
            width: 340,
            hide: !columnVisibilityPrimary.hyperlink,
            renderCell: (params) => (
                params?.row?.hyperlink?.startsWith('http') ?
                    <a href={params.row.hyperlink} target="_blank">
                        {params.row.process}
                    </a> : params.row.process
            ),
            headerClassName: "bold-header"
        },
        { field: "count", headerName: "Count", flex: 0, width: 75, hide: !columnVisibilityPrimary.count },
        { field: "tat", headerName: "TAT Expiration", flex: 0, width: 150, hide: !columnVisibilityPrimary.tat },
        { field: "created", headerName: "Created", flex: 0, width: 100, hide: !columnVisibilityPrimary.created },
        { field: "branch", headerName: "Branch", flex: 0, width: 100, hide: !columnVisibilityPrimary.branch },
        { field: "resperson", headerName: "Responsible Person", flex: 0, width: 300, hide: !columnVisibilityPrimary.resperson },
        { field: "category", headerName: "Category", flex: 0, width: 300, hide: !columnVisibilityPrimary.category },
        { field: "subcategory", headerName: "Subcategory", flex: 0, width: 150, hide: !columnVisibilityPrimary.subcategory },
        { field: "queue", headerName: "Queue", flex: 0, width: 340, hide: !columnVisibilityPrimary.queue },
        { field: "serialNumber", headerName: "SNo", flex: 0, width: 50, hide: !columnVisibilityPrimary.serialNumber },
        { field: "project", headerName: "Project", flex: 0, width: 200, hide: !columnVisibilityPrimary.project },
        { field: "vendor", headerName: "Vendor", flex: 0, width: 150, hide: !columnVisibilityPrimary.vendor },
        { field: "unit", headerName: "Unit", flex: 0, width: 150, hide: !columnVisibilityPrimary.unit },
        { field: "team", headerName: " Team", flex: 0, width: 100, hide: !columnVisibilityPrimary.team },
        { field: "prioritystatus", headerName: "Sector", flex: 0, width: 100, hide: !columnVisibilityPrimary.prioritystatus },
        { field: "points", headerName: "Points", flex: 0, width: 100, hide: !columnVisibilityPrimary.points },
        { field: "time", headerName: "Time", flex: 0, width: 100, hide: !columnVisibilityPrimary.time },
    ];

    const columnDataTableNeartat = [
        { field: "priority", headerName: "Priority", flex: 0, width: 75, hide: !columnVisibilityPrimary.priority },
        { field: "customer", headerName: "Customer", flex: 0, width: 100, hide: !columnVisibilityPrimary.customer },
        {
            field: "hyperlink",
            headerName: "Process Hyperlink",
            flex: 0,
            width: 340,
            hide: !columnVisibilityPrimary.hyperlink,
            renderCell: (params) => (
                params?.row?.hyperlink?.startsWith('http') ?
                    <a href={params.row.hyperlink} target="_blank">
                        {params.row.process}
                    </a> : params.row.process
            ),
            headerClassName: "bold-header"
        },
        { field: "count", headerName: "Count", flex: 0, width: 75, hide: !columnVisibilityPrimary.count },
        { field: "tat", headerName: "TAT Expiration", flex: 0, width: 150, hide: !columnVisibilityPrimary.tat },
        { field: "created", headerName: "Created", flex: 0, width: 100, hide: !columnVisibilityPrimary.created },
        { field: "branch", headerName: "Branch", flex: 0, width: 100, hide: !columnVisibilityPrimary.branch },
        { field: "resperson", headerName: "Responsible Person", flex: 0, width: 300, hide: !columnVisibilityPrimary.resperson },
        { field: "category", headerName: "Category", flex: 0, width: 300, hide: !columnVisibilityPrimary.category },
        { field: "subcategory", headerName: "Subcategory", flex: 0, width: 150, hide: !columnVisibilityPrimary.subcategory },
        { field: "queue", headerName: "Queue", flex: 0, width: 340, hide: !columnVisibilityPrimary.queue },
        { field: "serialNumber", headerName: "SNo", flex: 0, width: 50, hide: !columnVisibilityPrimary.serialNumber },
        { field: "project", headerName: "Project", flex: 0, width: 200, hide: !columnVisibilityPrimary.project },
        { field: "vendor", headerName: "Vendor", flex: 0, width: 150, hide: !columnVisibilityPrimary.vendor },
        { field: "unit", headerName: "Unit", flex: 0, width: 150, hide: !columnVisibilityPrimary.unit },
        { field: "team", headerName: " Team", flex: 0, width: 100, hide: !columnVisibilityPrimary.team },
        { field: "prioritystatus", headerName: "Sector", flex: 0, width: 100, hide: !columnVisibilityPrimary.prioritystatus },
        { field: "points", headerName: "Points", flex: 0, width: 100, hide: !columnVisibilityPrimary.points },
        { field: "time", headerName: "Time", flex: 0, width: 100, hide: !columnVisibilityPrimary.time },
    ];

    const columnDataTablePrimary = [
        { field: "priority", headerName: "Priority", flex: 0, width: 75, hide: !columnVisibilityPrimary.priority },
        { field: "customer", headerName: "Customer", flex: 0, width: 100, hide: !columnVisibilityPrimary.customer },
        {
            field: "hyperlink",
            headerName: "Process Hyperlink",
            flex: 0,
            width: 340,
            hide: !columnVisibilityPrimary.hyperlink,
            renderCell: (params) => (
                params?.row?.hyperlink?.startsWith('http') ?
                    <a href={params.row.hyperlink} target="_blank">
                        {params.row.process}
                    </a> : params.row.process
            ),
            headerClassName: "bold-header"
        },
        { field: "count", headerName: "Count", flex: 0, width: 75, hide: !columnVisibilityPrimary.count },
        { field: "tat", headerName: "TAT Expiration", flex: 0, width: 150, hide: !columnVisibilityPrimary.tat },
        { field: "created", headerName: "Created", flex: 0, width: 100, hide: !columnVisibilityPrimary.created },
        { field: "branch", headerName: "Branch", flex: 0, width: 100, hide: !columnVisibilityPrimary.branch },
        { field: "resperson", headerName: "Responsible Person", flex: 0, width: 300, hide: !columnVisibilityPrimary.resperson },
        { field: "category", headerName: "Category", flex: 0, width: 300, hide: !columnVisibilityPrimary.category },
        { field: "subcategory", headerName: "Subcategory", flex: 0, width: 150, hide: !columnVisibilityPrimary.subcategory },
        { field: "queue", headerName: "Queue", flex: 0, width: 340, hide: !columnVisibilityPrimary.queue },
        { field: "serialNumber", headerName: "SNo", flex: 0, width: 50, hide: !columnVisibilityPrimary.serialNumber },
        { field: "project", headerName: "Project", flex: 0, width: 200, hide: !columnVisibilityPrimary.project },
        { field: "vendor", headerName: "Vendor", flex: 0, width: 150, hide: !columnVisibilityPrimary.vendor },
        { field: "unit", headerName: "Unit", flex: 0, width: 150, hide: !columnVisibilityPrimary.unit },
        { field: "team", headerName: " Team", flex: 0, width: 100, hide: !columnVisibilityPrimary.team },
        { field: "prioritystatus", headerName: "Sector", flex: 0, width: 100, hide: !columnVisibilityPrimary.prioritystatus },
        { field: "points", headerName: "Points", flex: 0, width: 100, hide: !columnVisibilityPrimary.points },
        { field: "time", headerName: "Time", flex: 0, width: 100, hide: !columnVisibilityPrimary.time },
    ];

    // Create a row data object for the DataGrid
    const rowDataTable = filteredDataPrimary.map((item, index) => {
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


    const handleShowAllColumnsPrimary = () => {
        const updatedVisibilityPrimary = { ...columnVisibilityPrimary };
        for (const columnKey in updatedVisibilityPrimary) {
            updatedVisibilityPrimary[columnKey] = true;
        }
        setColumnVisibilityPrimary(updatedVisibilityPrimary);
    };

    // Manage Columns functionality
    const toggleColumnVisibilityPrimary = (field) => {
        setColumnVisibilityPrimary((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };

    const filteredColumnsPrimary = columnDataTablePrimary?.filter((column) => {
        // Check if headerName is a string
        if (typeof column?.headerName === 'string') {
            return column?.headerName?.toLowerCase()?.includes(searchQueryManagePrimary?.toLowerCase());
        }
        // Check if headerName is JSX with children
        if (typeof column?.headerName === 'object' && column?.headerName?.props?.children) {
            const headerText = column?.headerName?.props?.children;
            return headerText.toLowerCase().includes(searchQueryManagePrimary?.toLowerCase());
        }
        return false;
    });

    // JSX for the "Manage Columns" popover content
    const manageColumnsContentPrimary = (
        <Box sx={{ padding: "10px", minWidth: "325px", '& .MuiDialogContent-root': { padding: '10px 0' } }}>
            <Typography variant="h6">Manage Columns</Typography>
            <IconButton
                aria-label="close"
                onClick={handleCloseManageColumnsPrimary}
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
                    value={searchQueryManagePrimary}
                    onChange={(e) => setSearchQueryManagePrimary(e.target.value)}
                    sx={{ marginBottom: 5, position: 'absolute', }}
                />
            </Box><br /><br />
            <DialogContent sx={{ minWidth: 'auto', height: '200px', position: 'relative' }}>
                <List sx={{ overflow: 'auto', height: '100%', }}>
                    <ListItemText sx={{ display: 'flex', marginLeft: '15px' }}
                        primary={
                            <Switch sx={{ marginTop: "0px" }} size="small"
                                checked={columnVisibilityPrimary.checkboxSelection}
                                onChange={() => toggleColumnVisibilityPrimary('checkboxSelection')}
                            />
                        }
                        secondary={<Typography variant="subtitle1" sx={{ fontSize: "15px", fontWeight: '400' }}>Checkbox Selection</Typography>}
                    />
                    {filteredColumnsPrimary.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText sx={{ display: 'flex' }}
                                primary={
                                    <Switch sx={{ marginTop: "-5px" }} size="small"
                                        checked={columnVisibilityPrimary[column.field]}
                                        onChange={() => toggleColumnVisibilityPrimary(column.field)}
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
                            onClick={() => setColumnVisibilityPrimary(initialColumnVisibilityPrimary)}
                        >
                            Show All
                        </Button>
                    </Grid>
                    <Grid item md={4}></Grid>
                    <Grid item md={4}>
                        <Button
                            variant="text"
                            sx={{ textTransform: 'none', }}
                            onClick={() => setColumnVisibilityPrimary({})}
                        >
                            Hide All
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Box>
    );

    // Show All Columns functionality
    const handleShowAllColumnsOvertat = () => {
        const updatedVisibilityOvertat = { ...columnVisibilityOvertat };
        for (const columnKey in updatedVisibilityOvertat) {
            updatedVisibilityOvertat[columnKey] = true;
        }
        setColumnVisibilityOvertat(updatedVisibilityOvertat);
    };

    // Manage Columns functionality
    const toggleColumnVisibilityOvertat = (field) => {
        setColumnVisibilityOvertat((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };

    // Function to filter columns based on search query
    const filteredColumnsOvertat = columnDataTableOvertat.filter((column) =>
        column.headerName.toLowerCase().includes(searchQueryManageOvertat.toLowerCase())
    );

    // JSX for the "Manage Columns" popover content
    const manageColumnsContentOvertat = (
        <Box sx={{ padding: "10px", minWidth: "325px", '& .MuiDialogContent-root': { padding: '10px 0' } }}>
            <Typography variant="h6">Manage Columns</Typography>
            <IconButton
                aria-label="close"
                onClick={handleCloseManageColumnsOvertat}
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
                    value={searchQueryManageOvertat}
                    onChange={(e) => setSearchQueryManageOvertat(e.target.value)}
                    sx={{ marginBottom: 5, position: 'absolute', }}
                />
            </Box><br /><br />
            <DialogContent sx={{ minWidth: 'auto', height: '200px', position: 'relative' }}>
                <List sx={{ overflow: 'auto', height: '100%', }}>
                    <ListItemText sx={{ display: 'flex', marginLeft: '15px' }}
                        primary={
                            <Switch sx={{ marginTop: "0px" }} size="small"
                                checked={columnVisibilityOvertat.checkboxSelection}
                                onChange={() => toggleColumnVisibilityOvertat('checkboxSelection')}
                            />
                        }
                        secondary={<Typography variant="subtitle1" sx={{ fontSize: "15px", fontWeight: '400' }}>Checkbox Selection</Typography>}
                    />
                    {filteredColumnsOvertat.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText sx={{ display: 'flex' }}
                                primary={
                                    <Switch sx={{ marginTop: "-5px" }} size="small"
                                        checked={columnVisibilityOvertat[column.field]}
                                        onChange={() => toggleColumnVisibilityOvertat(column.field)}
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
                            onClick={() => setColumnVisibilityOvertat(initialColumnVisibilityOvertat)}
                        >
                            Show All
                        </Button>
                    </Grid>
                    <Grid item md={4}></Grid>
                    <Grid item md={4}>
                        <Button
                            variant="text"
                            sx={{ textTransform: 'none', }}
                            onClick={() => setColumnVisibilityOvertat({})}
                        >
                            Hide All
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Box>
    );

    // Show All Columns functionality
    const handleShowAllColumnsNeartat = () => {
        const updatedVisibilityNeartat = { ...columnVisibilityNeartat };
        for (const columnKey in updatedVisibilityNeartat) {
            updatedVisibilityNeartat[columnKey] = true;
        }
        setColumnVisibilityNeartat(updatedVisibilityNeartat);
    };

    // Manage Columns functionality
    const toggleColumnVisibilityNeartat = (field) => {
        setColumnVisibilityNeartat((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };

    // Function to filter columns based on search query
    const filteredColumnsNeartat = columnDataTableNeartat.filter((column) =>
        column.headerName.toLowerCase().includes(searchQueryManageNeartat.toLowerCase())
    );

    // JSX for the "Manage Columns" popover content
    const manageColumnsContentNeartat = (
        <Box sx={{ padding: "10px", minWidth: "325px", '& .MuiDialogContent-root': { padding: '10px 0' } }}>
            <Typography variant="h6">Manage Columns</Typography>
            <IconButton
                aria-label="close"
                onClick={handleCloseManageColumnsNeartat}
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
                    value={searchQueryManageNeartat}
                    onChange={(e) => setSearchQueryManageNeartat(e.target.value)}
                    sx={{ marginBottom: 5, position: 'absolute', }}
                />
            </Box><br /><br />
            <DialogContent sx={{ minWidth: 'auto', height: '200px', position: 'relative' }}>
                <List sx={{ overflow: 'auto', height: '100%', }}>
                    <ListItemText sx={{ display: 'flex', marginLeft: '15px' }}
                        primary={
                            <Switch sx={{ marginTop: "0px" }} size="small"
                                checked={columnVisibilityNeartat.checkboxSelection}
                                onChange={() => toggleColumnVisibilityNeartat('checkboxSelection')}
                            />
                        }
                        secondary={<Typography variant="subtitle1" sx={{ fontSize: "15px", fontWeight: '400' }}>Checkbox Selection</Typography>}
                    />
                    {filteredColumnsNeartat.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText sx={{ display: 'flex' }}
                                primary={
                                    <Switch sx={{ marginTop: "-5px" }} size="small"
                                        checked={columnVisibilityNeartat[column.field]}
                                        onChange={() => toggleColumnVisibilityNeartat(column.field)}
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
                            onClick={() => setColumnVisibilityNeartat(initialColumnVisibilityNeartat)}
                        >
                            Show All
                        </Button>
                    </Grid>
                    <Grid item md={4}></Grid>
                    <Grid item md={4}>
                        <Button
                            variant="text"
                            sx={{ textTransform: 'none', }}
                            onClick={() => setColumnVisibilityNeartat({})}
                        >
                            Hide All
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Box>
    );

    // Excel
    const downloadExcelPrimaryTat = async () => {

        try {
            // Fetch the data if not already fetched
            if (!tableDataNearTatPrimary?.length) {
                await fetchPrimaryWorkOrderOverTatList();
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
            filteredDataNearTatPrimary.forEach((row, index) => {
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
            filteredDataNearTatPrimary.forEach((row, index) => {

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
            a.download = 'Primary_OverTat_List.xlsx'; // File name
            a.click();
        } catch (error) {
            // Handle any errors that may occur during the process
            console.error(error);
        }
    };

    // Function to generate a downloadable CSV file
    const downloadCsvPrimaryTat = () => {
        const csvData = [];

        // Add CSV headers
        const headers = ['Priority', 'Customer', 'Process Hyperlink', 'Count', 'Tat Expiration', 'Created',
            'Branch', 'Responsible Person', 'Category Name', 'Subcategory Name', 'Queue Name', 'S.No', 'Project Name', 'Vendor Name', 'Unit', 'Team', 'Sector', 'Points', 'Time',
        ];
        csvData.push(headers);

        // Add data rows
        filteredDataPrimary.forEach((row, index) => {
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
        saveAs(blob, 'Primary OverTat.csv'); // Specify the filename with .csv extension
    };

    //Excel and Csv for primary near tat
    // Excel
    const downloadExcelPrimaryNearTat = async () => {

        try {
            // Fetch the data if not already fetched
            if (!tableDataNearTatPrimary?.length) {
                await fetchPrimaryWorkOrderNearTatList();
            }
            // downloadCsvSecondary();
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Primary NearTat');

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
            filteredDataNearTatPrimary.forEach((row, index) => {
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
            filteredDataNearTatPrimary.forEach((row, index) => {

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
            a.download = 'Primary_NearTat_List.xlsx'; // File name
            a.click();
        } catch (error) {
            // Handle any errors that may occur during the process
            console.error(error);
        }
    };

    // Function to generate a downloadable CSV file
    const downloadCsvPrimaryNearTat = () => {
        const csvData = [];

        // Add CSV headers
        const headers = ['Priority', 'Customer', 'Process Hyperlink', 'Count', 'Tat Expiration', 'Created',
            'Branch', 'Responsible Person', 'Category Name', 'Subcategory Name', 'Queue Name', 'S.No', 'Project Name', 'Vendor Name', 'Unit', 'Team', 'Sector', 'Points', 'Time',
        ];
        csvData.push(headers);

        // Add data rows
        filteredDataNearTatPrimary.forEach((row, index) => {
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
        saveAs(blob, 'Primary NearTat.csv'); // Specify the filename with .csv extension
    };

    //Excel and Csv for Primary All
    // Excel
    const downloadExcelPrimaryAll = async () => {

        try {
            // Fetch the data if not already fetched
            if (!tableDataAllPrimary?.length) {
                await fetchPrimaryWorkOrderAllList();
            }
            // downloadCsvSecondary();
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('All Primary Tat');

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
            filteredDataAllPrimary.forEach((row, index) => {
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
            filteredDataAllPrimary.forEach((row, index) => {

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
            a.download = 'Consolidated_Primary_All_List.xlsx'; // File name
            a.click();
        } catch (error) {
            // Handle any errors that may occur during the process
            console.error(error);
        }
    };

    // Function to generate a downloadable CSV file
    const downloadCsvPrimaryAll = () => {
        const csvData = [];

        // Add CSV headers
        const headers = ['Priority', 'Customer', 'Process Hyperlink', 'Count', 'Tat Expiration', 'Created',
            'Branch', 'Responsible Person', 'Category Name', 'Subcategory Name', 'Queue Name', 'S.No', 'Project Name', 'Vendor Name', 'Unit', 'Team', 'Sector', 'Points', 'Time',
        ];
        csvData.push(headers);

        // Add data rows
        filteredDataAllPrimary.forEach((row, index) => {
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
        saveAs(blob, 'All Primary Tat.csv'); // Specify the filename with .csv extension
    };


    //NearTatPrimary table

    //Datatable
    const handlePageChangeNearTatPrimary = (newPage) => {
        setPageNearTatPrimary(newPage);
    };

    const handlePageSizeChangeNearTatPrimary = (event) => {
        setPageSizeNearTatPrimary(Number(event.target.value));
        setPageNearTatPrimary(1);
    };


    //datatable....
    const [searchQueryNearTatPrimary, setSearchQueryNearTatPrimary] = useState("");
    const handleSearchChangeNearTatPrimary = (event) => {
        setSearchQueryNearTatPrimary(event.target.value);
    };

    // Split the search query into individual terms
    const searchOverNearTerms = searchQueryNearTatPrimary.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatasNearTatPrimary = itemsNearTatPrimary?.filter((item) => {
        return searchOverNearTerms.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
        );
    });


    const filteredDataNearTatPrimary = filteredDatasNearTatPrimary?.slice((pageNearTatPrimary - 1) * pageSizeNearTatPrimary, pageNearTatPrimary * pageSizeNearTatPrimary);

    const totalPagesNearTatPrimary = Math.ceil(filteredDatasNearTatPrimary?.length / pageSizeNearTatPrimary);

    const visiblePagesNearTatPrimary = Math.min(totalPagesNearTatPrimary, 3);

    const firstVisiblePageNearTatPrimary = Math.max(1, pageNearTatPrimary - 1);
    const lastVisiblePageNearTatPrimary = Math.min(Math.abs(firstVisiblePageNearTatPrimary + visiblePagesNearTatPrimary - 1), totalPagesNearTatPrimary);


    const pageNumbersNearTatPrimary = [];

    const indexOfLastItemNearTatPrimary = pageNearTatPrimary * pageSizeNearTatPrimary;
    const indexOfFirstItemNearTatPrimary = indexOfLastItemNearTatPrimary - pageSizeNearTatPrimary;


    for (let i = firstVisiblePageNearTatPrimary; i <= lastVisiblePageNearTatPrimary; i++) {
        pageNumbersNearTatPrimary.push(i);
    }

    //primarydata all

    //AllPrimary table
    //datatable....

    const [itemsAllPrimary, setItemsAllPrimary] = useState([]);

    const addSerialNumberAllPrimary = () => {
        const itemsWithSerialNumbeAllPrimary = tableDataAllPrimary?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
        setItemsAllPrimary(itemsWithSerialNumbeAllPrimary);
    }

    useEffect(() => {
        addSerialNumberAllPrimary();
    }, [tableDataAllPrimary]);


    let overallCountNear = 0;



    const totalcountnear = filteredDataNearTatPrimary && (
        filteredDataNearTatPrimary.forEach((item) => {
            overallCountNear += Number(item.count);
        })
    )



    //rowdata table for near tat

    const rowDataTableNearTat = filteredDataNearTatPrimary.map((item, index) => {
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

    //table sorting
    const [sortingAllPrimary, setSortingAllPrimary] = useState({ column: '', direction: '' });

    //Datatable
    const handlePageChangeAllPrimary = (newPage) => {
        setPageAllPrimary(newPage);
    };

    const handlePageSizeChangeAllPrimary = (event) => {
        setPageSizeAllPrimary(Number(event.target.value));
        setPageAllPrimary(1);
    };


    //datatable....
    const [searchQueryAllPrimary, setSearchQueryAllPrimary] = useState("");
    const handleSearchChangeAllPrimary = (event) => {
        setSearchQueryAllPrimary(event.target.value);
    };
   
    // Split the search query into individual terms
    const searchOverTerms = searchQueryAllPrimary.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatasAllPrimary = itemsAllPrimary?.filter((item) => {
        return searchOverTerms.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
        );
    });


    const filteredDataAllPrimary = filteredDatasAllPrimary?.slice((pageAllPrimary - 1) * pageSizeAllPrimary, pageAllPrimary * pageSizeAllPrimary);

    const totalPagesAllPrimary = Math.ceil(filteredDatasAllPrimary?.length / pageSizeAllPrimary);

    const visiblePagesAllPrimary = Math.min(totalPagesAllPrimary, 3);

    const firstVisiblePageAllPrimary = Math.max(1, pageAllPrimary - 1);
    const lastVisiblePageAllPrimary = Math.min(Math.abs(firstVisiblePageAllPrimary + visiblePagesAllPrimary - 1), totalPagesAllPrimary);


    const pageNumbersAllPrimary = [];

    const indexOfLastItemAllPrimary = pageAllPrimary * pageSizeAllPrimary;
    const indexOfFirstItemAllPrimary = indexOfLastItemAllPrimary - pageSizeAllPrimary;


    for (let i = firstVisiblePageAllPrimary; i <= lastVisiblePageAllPrimary; i++) {
        pageNumbersAllPrimary.push(i);
    }

    let overallCountPrimaryall = 0;
    const totalcountprimaryall = filteredDataAllPrimary && (
        filteredDataAllPrimary.forEach((item) => {
            overallCountPrimaryall += Number(item.count);
        })
    );

    const rowDataTableAllPrimary = filteredDataAllPrimary.map((item, index) => {
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

    //  PDF
    const columns = [
        { title: "SNO", field: "serialNumber" },
        { title: "Project Name", field: "project" },
        { title: "Vendor Name", field: "vendor" },
        { title: "Priority", field: "priority" },
        { title: "Customer", field: "customer" },
        { title: "Process", field: "process" },
        { title: "Count", field: "count" },
        { title: "Tat", field: "tat" },
        { title: "Created", field: "created" },
        { title: "Category Name", field: "category" },
        { title: "Subcategory Name", field: "subcategory" },
        { title: "Queue Name", field: "queue" },
        { title: "Branch", field: "branch" },
        { title: "Unit", field: "unit" },
        { title: "Team", field: "team" },
        { title: "Resperson", field: "resperson" },
        { title: "Sector", field: "prioritystatus" },
        { title: "Points", field: "points" },
        { title: "time", field: "time" },

    ]

    const downloadPdfPrimary = () => {
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
            body: filteredDataPrimary,
        });
        doc.save("Consolidated_Primary_OverTat_List.pdf");
    };


    //print...Primary
    const componentRefPrimary = useRef();
    const handleprintPrimary = useReactToPrint({
        content: () => componentRefPrimary.current,
        documentTitle: 'Consolidated_Primary_OverTat_List',
        pageStyle: 'print'
    });

    const downloadPdfNearTatPrimary = () => {
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
            body: filteredDataNearTatPrimary,
        });
        doc.save("Consolidated_Primary_NearTat_List.pdf");
    };

    //print...NearTatPrimary
    const componentRefNearTatPrimary = useRef();
    const handleprintNearTatPrimary = useReactToPrint({
        content: () => componentRefNearTatPrimary.current,
        documentTitle: 'Consolidated_Primary_NearTat_List',
        pageStyle: 'print'
    });

    //primary all list EXCEL CSV PRINT PDF

    const downloadPdfAllPrimary = () => {
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
            body: filteredDataAllPrimary,
        });
        doc.save("Consolidated_Primary_All_List.pdf");
    };

    //print...AllPrimary
    const componentRefAllPrimary = useRef();
    const handleprintAllPrimary = useReactToPrint({
        content: () => componentRefAllPrimary.current,
        documentTitle: 'Consolidated_Primary_All_List',
        pageStyle: 'print'
    });



    const [canvasState, setCanvasState] = useState(false)
    const [canvasStatenear, setCanvasStateNear] = useState(false)
    const [canvasStateall, setCanvasStateall] = useState(false)


    //image


    const handleCaptureImageOvertat = () => {
        // Find the table by its ID
        const table = document.getElementById("excelcanvastable");

        // Clone the table element
        const clonedTable = table?.cloneNode(true);

        // Append the cloned table to the document body (it won't be visible)
        clonedTable.style.position = "absolute";
        clonedTable.style.top = "-9999px";
        document.body.appendChild(clonedTable);

        // Use html2canvas to capture the cloned table
        html2canvas(clonedTable).then((canvas) => {
            // Remove the cloned table from the document body
            document.body.removeChild(clonedTable);

            // Convert the canvas to a data URL and create a download link
            const dataURL = canvas.toDataURL("image/jpeg", 0.8);
            const link = document.createElement("a");
            link.href = dataURL;
            link.download = "Primary OverTat.png";
            link.click();
        });
    };



    //image neartat
    const handleCaptureImageNeartat = () => {
        // Find the table by its ID
        const table = document.getElementById("excelnear");

        // Clone the table element
        const clonedTable = table?.cloneNode(true);

        // Append the cloned table to the document body (it won't be visible)
        clonedTable.style.position = "absolute";
        clonedTable.style.top = "-9999px";
        document.body.appendChild(clonedTable);

        // Use html2canvas to capture the cloned table
        html2canvas(clonedTable).then((canvas) => {
            // Remove the cloned table from the document body
            document.body.removeChild(clonedTable);

            // Convert the canvas to a data URL and create a download link
            const dataURL = canvas.toDataURL("image/jpeg", 0.8);
            const link = document.createElement("a");
            link.href = dataURL;
            link.download = "Primary NearTat.png";
            link.click();
        });
    };

    //image primary
    const handleCaptureImagePrimary = () => {
        // Find the table by its ID
        const table = document.getElementById("excelall");

        // Clone the table element
        const clonedTable = table?.cloneNode(true);

        // Append the cloned table to the document body (it won't be visible)
        clonedTable.style.position = "absolute";
        clonedTable.style.top = "-9999px";
        document.body.appendChild(clonedTable);

        // Use html2canvas to capture the cloned table
        html2canvas(clonedTable).then((canvas) => {
            // Remove the cloned table from the document body
            document.body.removeChild(clonedTable);

            // Convert the canvas to a data URL and create a download link
            const dataURL = canvas.toDataURL("image/jpeg", 0.8);
            const link = document.createElement("a");
            link.href = dataURL;
            link.download = "All Primary Tat.png";
            link.click();
        });
    };



    return (
        <>
            <Headtitle title={'primary Work Order'} />
            {isUserRoleCompare?.includes("lprimaryworkorderlist")
                && (
                    <>
                        <Box sx={userStyle.container}>
                            <Typography sx={userStyle.SubHeaderText}>Primary OverTat List</Typography>
                            <br /><br />

                            {!checkprimaryovertatdata ?
                                <>
                                    <Box style={{ display: 'flex', justifyContent: 'center' }}>
                                        <FacebookCircularProgress />
                                    </Box>
                                </>
                                :
                                <>
                                    { /* ****** Header Buttons ****** */}
                                    <Grid style={userStyle.dataTablestyle}>
                                        <Box>
                                            <label htmlFor="pageSizeSelect">Show entries:</label>
                                            <Select id="pageSizeSelect" defaultValue="" value={pageSizePrimary} onChange={handlePageSizeChangePrimary} sx={{ width: "77px" }}>
                                                <MenuItem value={1}>1</MenuItem>
                                                <MenuItem value={5}>5</MenuItem>
                                                <MenuItem value={10}>10</MenuItem>
                                                <MenuItem value={25}>25</MenuItem>
                                                <MenuItem value={50}>50</MenuItem>
                                                <MenuItem value={100}>100</MenuItem>
                                            </Select>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'end' }}>
                                            <Grid container>
                                                {isUserRoleCompare?.includes("csvprimaryworkorderlist")
                                                    && (
                                                        <>
                                                            <Button sx={userStyle.buttongrp} onClick={downloadCsvPrimaryTat}>&ensp;<FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                                        </>)}
                                                {isUserRoleCompare?.includes("excelprimaryworkorderlist")
                                                    && (
                                                        <>
                                                            <Button sx={userStyle.buttongrp} onClick={downloadExcelPrimaryTat}>&ensp;<FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                                        </>)}
                                                {isUserRoleCompare?.includes("printprimaryworkorderlist")
                                                    && (
                                                        <>
                                                            <Button sx={userStyle.buttongrp} onClick={handleprintPrimary}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                                        </>)}
                                                {isUserRoleCompare?.includes("pdfprimaryworkorderlist")
                                                    && (
                                                        <>
                                                            <Button sx={userStyle.buttongrp} onClick={() => downloadPdfPrimary()}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                                        </>)}
                                                {isUserRoleCompare?.includes("imageprimaryworkorderlist")
                                                    && (
                                                        <>
                                                            <Button sx={userStyle.buttongrp} onClick={handleCaptureImageOvertat}> <ImageIcon sx={{ fontSize: "15px" }} />  &ensp;image&ensp; </Button>
                                                        </>)}
                                            </Grid>
                                        </Box>

                                        <Box>
                                            <FormControl fullWidth size="small" >
                                                <Typography>Search</Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    value={searchQueryPrimary}
                                                    onChange={handleSearchChangePrimary}
                                                />
                                            </FormControl>
                                        </Box>
                                    </Grid>
                                    <br />
                                    <Grid container sx={{ diaplay: 'flex', backgroundColor: '#dcdbdb00', postion: 'sticky', padding: '10px 05px'}}>
                                        <Box>
                                            Total Pages
                                        </Box>&ensp;&ensp;&ensp;
                                        <Box >
                                            <span style={{ fontWeight: 'bold', fontSize: '20px' }} >  Count</span> :<span style={{ fontWeight: 'bold', fontSize: '20px' }} >{overallCountprimary}</span>
                                        </Box>
                                    </Grid>
                                    <Button sx={userStyle.buttongrp} onClick={() => { handleShowAllColumnsOvertat(); setColumnVisibilityOvertat(initialColumnVisibilityOvertat) }}>Show All Columns</Button>&ensp;
                                    <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsOvertat}>Manage Columns</Button>
                                    <br /><br />
                                    <Box
                                        style={{ width: '100%', overflowY: 'hidden', }}  >
                                        <StyledDataGrid ref={gridRefOvertat}
                                            rows={rowDataTable}
                                            columns={columnDataTableOvertat.filter((column) => columnVisibilityOvertat[column.field])}
                                            autoHeight={true}
                                            density="compact"
                                            hideFooter
                                            checkboxSelection={columnVisibilityOvertat.checkboxSelection}
                                            getRowClassName={getRowClassName}
                                            disableRowSelectionOnClick
                                            unstable_cellSelection
                                            onClipboardCopy={(copiedString) => setCopiedDataOvertat(copiedString)}
                                            unstable_ignoreValueFormatterDuringExport

                                        />
                                    </Box>
                                    <Grid container sx={{ diaplay: 'flex', backgroundColor: '#dcdbdb00', postion: 'sticky', padding: '10px 05px', boxShadow: '0px 0px 2px grey' }}>
                                        <Box>
                                            Total Pages
                                        </Box>&ensp;&ensp;&ensp;
                                        <Box >
                                            <span style={{ fontWeight: 'bold', fontSize: '20px' }} >  Count</span> :<span style={{ fontWeight: 'bold', fontSize: '20px' }} >{overallCountprimary}</span>
                                        </Box>
                                    </Grid>
                                    <br />
                                    <Box style={userStyle.dataTablestyle}>
                                        <Box>
                                            Showing  {filteredDataPrimary.length > 0 ? ((pagePrimary - 1) * pageSizePrimary) + 1 : 0}  to {Math.min(pagePrimary * pageSizePrimary, filteredDatasPrimary.length)} of {filteredDatasPrimary.length} entries
                                        </Box>
                                        <Box>
                                            <Button onClick={() => setPagePrimary(1)} disabled={pagePrimary === 1} sx={userStyle.paginationbtn}>
                                                <FirstPageIcon />
                                            </Button>
                                            <Button onClick={() => handlePageChangePrimary(pagePrimary - 1)} disabled={pagePrimary === 1} sx={userStyle.paginationbtn}>
                                                <NavigateBeforeIcon />
                                            </Button>
                                            {pageNumbersPrimary?.map((pageNumber) => (
                                                <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChangePrimary(pageNumber)} className={((pagePrimary)) === pageNumber ? 'active' : ''} disabled={pagePrimary === pageNumber}>
                                                    {pageNumber}
                                                </Button>
                                            ))}
                                            {lastVisiblePagePrimary < totalPagesPrimary && <span>...</span>}
                                            <Button onClick={() => handlePageChangePrimary(pagePrimary + 1)} disabled={pagePrimary === totalPagesPrimary} sx={userStyle.paginationbtn}>
                                                <NavigateNextIcon />
                                            </Button>
                                            <Button onClick={() => setPagePrimary((totalPagesPrimary))} disabled={pagePrimary === totalPagesPrimary} sx={userStyle.paginationbtn}>
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
            < Popover
                id={idovertat}
                open={isManageColumnsOpenOvertat}
                anchorEl={anchorElOvertat}
                onClose={handleCloseManageColumnsOvertat}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }
                }
            >
                {manageColumnsContentOvertat}
            </Popover >
            <br />


            {isUserRoleCompare?.includes("lprimaryworkorderlist")
                && (
                    <>
                        <Box sx={userStyle.container}>
                            <Typography sx={userStyle.SubHeaderText}>Primary NearTat List</Typography>
                            <br /><br />

                            {!checkprimaryneartatdata ?
                                <>
                                    <Box style={{ display: 'flex', justifyContent: 'center' }}>
                                        <FacebookCircularProgress />
                                    </Box>
                                </>
                                :
                                <>
                                    { /* ****** Header Buttons ****** */}

                                    <Grid style={userStyle.dataTablestyle}>
                                        <Box>
                                            <label htmlFor="pageSizeSelect">Show entries:</label>
                                            <Select id="pageSizeSelect" defaultValue="" value={pageSizeNearTatPrimary} onChange={handlePageSizeChangeNearTatPrimary} sx={{ width: "77px" }}>
                                                <MenuItem value={1}>1</MenuItem>
                                                <MenuItem value={5}>5</MenuItem>
                                                <MenuItem value={10}>10</MenuItem>
                                                <MenuItem value={25}>25</MenuItem>
                                                <MenuItem value={50}>50</MenuItem>
                                                <MenuItem value={100}>100</MenuItem>
                                            </Select>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'end' }}>
                                            <Grid  >
                                                {isUserRoleCompare?.includes("csvprimaryworkorderlist")
                                                    && (
                                                        <>
                                                            <Button sx={userStyle.buttongrp} onClick={downloadCsvPrimaryNearTat}>&ensp;<FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                                        </>
                                                    )}
                                                {isUserRoleCompare?.includes("excelprimaryworkorderlist")
                                                    && (
                                                        <>
                                                            <Button sx={userStyle.buttongrp} onClick={downloadExcelPrimaryNearTat}>&ensp;<FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                                        </>
                                                    )}
                                                {isUserRoleCompare?.includes("printprimaryworkorderlist")
                                                    && (
                                                        <>
                                                            <Button sx={userStyle.buttongrp} onClick={handleprintNearTatPrimary}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                                        </>
                                                    )}
                                                {isUserRoleCompare?.includes("pdfprimaryworkorderlist")
                                                    && (
                                                        <>
                                                            <Button sx={userStyle.buttongrp} onClick={() => downloadPdfNearTatPrimary()}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                                        </>
                                                    )}
                                                {isUserRoleCompare?.includes("imageprimaryworkorderlist")
                                                    && (
                                                        <>
                                                            <Button sx={userStyle.buttongrp} onClick={handleCaptureImageNeartat}> <ImageIcon sx={{ fontSize: "15px" }} />  &ensp;image&ensp; </Button>
                                                        </>)}
                                            </Grid>
                                        </Box>
                                        <Box>
                                            <FormControl fullWidth size="small" >
                                                <Typography>Search</Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    value={searchQueryNearTatPrimary}
                                                    onChange={handleSearchChangeNearTatPrimary}
                                                />
                                            </FormControl>
                                        </Box>
                                    </Grid>
                                    <br />
                                    <Grid container sx={{ diaplay: 'flex', backgroundColor: '#dcdbdb00', postion: 'sticky', padding: '10px 05px'}}>
                                        <Box>
                                            Total Pages
                                        </Box>&ensp;&ensp;&ensp;
                                        <Box >
                                            <span style={{ fontWeight: 'bold', fontSize: '20px' }} >  Count</span> :<span style={{ fontWeight: 'bold', fontSize: '20px' }} >{overallCountNear}</span>
                                        </Box>
                                    </Grid>
                                    <Button sx={userStyle.buttongrp} onClick={() => { handleShowAllColumnsNeartat(); setColumnVisibilityNeartat(initialColumnVisibilityNeartat) }}>Show All Columns</Button>&ensp;
                                    <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsNeartat}>Manage Columns</Button>
                                    <br /> <br />

                                    <Box style={{ width: '100%', overflowY: 'hidden', }}   >
                                        <StyledDataGrid ref={gridRefNeartat}
                                            rows={rowDataTableNearTat}
                                            columns={columnDataTableNeartat.filter((column) => columnVisibilityNeartat[column.field])}
                                            autoHeight={true}
                                            hideFooter
                                            density="compact"
                                            checkboxSelection={columnVisibilityNeartat.checkboxSelection}
                                            getRowClassName={getRowClassNameNearTat}
                                            disableRowSelectionOnClick
                                            unstable_cellSelection
                                            onClipboardCopy={(copiedString) => setCopiedDataNeartat(copiedString)}
                                            unstable_ignoreValueFormatterDuringExport
                                        />
                                    </Box>
                                    <Grid container sx={{ diaplay: 'flex', backgroundColor: '#dcdbdb00', postion: 'sticky', padding: '10px 05px', boxShadow: '0px 0px 2px grey' }}>
                                        <Box>
                                            Total Pages
                                        </Box>&ensp;&ensp;&ensp;
                                        <Box >
                                            <span style={{ fontWeight: 'bold', fontSize: '20px' }} >  Count</span> :<span style={{ fontWeight: 'bold', fontSize: '20px' }} >{overallCountNear}</span>
                                        </Box>
                                    </Grid>
                                    <br />
                                    <Box style={userStyle.dataTablestyle}>
                                        <Box>
                                            Showing  {filteredDataNearTatPrimary.length > 0 ? ((pageNearTatPrimary - 1) * pageSizeNearTatPrimary) + 1 : 0}  to {Math.min(pageNearTatPrimary * pageSizeNearTatPrimary, filteredDatasNearTatPrimary.length)} of {filteredDatasNearTatPrimary.length} entries
                                        </Box>
                                        <Box>
                                            <Button onClick={() => setPageNearTatPrimary(1)} disabled={pageNearTatPrimary === 1} sx={userStyle.paginationbtn}>
                                                <FirstPageIcon />
                                            </Button>
                                            <Button onClick={() => handlePageChangeNearTatPrimary(pageNearTatPrimary - 1)} disabled={pageNearTatPrimary === 1} sx={userStyle.paginationbtn}>
                                                <NavigateBeforeIcon />
                                            </Button>
                                            {pageNumbersNearTatPrimary?.map((pageNumber) => (
                                                <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChangeNearTatPrimary(pageNumber)} className={((pageNearTatPrimary)) === pageNumber ? 'active' : ''} disabled={pageNearTatPrimary === pageNumber}>
                                                    {pageNumber}
                                                </Button>
                                            ))}
                                            {lastVisiblePageNearTatPrimary < totalPagesNearTatPrimary && <span>...</span>}
                                            <Button onClick={() => handlePageChangeNearTatPrimary(pageNearTatPrimary + 1)} disabled={pageNearTatPrimary === totalPagesNearTatPrimary} sx={userStyle.paginationbtn}>
                                                <NavigateNextIcon />
                                            </Button>
                                            <Button onClick={() => setPageNearTatPrimary((totalPagesNearTatPrimary))} disabled={pageNearTatPrimary === totalPagesNearTatPrimary} sx={userStyle.paginationbtn}>
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
            < Popover
                id={idneartat}
                open={isManageColumnsOpenNeartat}
                anchorEl={anchorElNeartat}
                onClose={handleCloseManageColumnsNeartat}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }
                }
            >
                {manageColumnsContentNeartat}
            </Popover >
            <br />
            {isUserRoleCompare?.includes("lprimaryworkorderlist")
                && (
                    <>
                        <Box sx={userStyle.container}>
                            <Typography sx={userStyle.SubHeaderText}>All Primary List</Typography>
                            <br /><br />

                            {!checkprimaryalldata ?
                                <>
                                    <Box style={{ display: 'flex', justifyContent: 'center' }}>
                                        <FacebookCircularProgress />
                                    </Box>
                                </>
                                :
                                <>

                                    <Grid style={userStyle.dataTablestyle}>
                                        <Box>
                                            <label htmlFor="pageSizeSelect">Show entries:</label>
                                            <Select id="pageSizeSelect" defaultValue="" value={pageSizeAllPrimary} onChange={handlePageSizeChangeAllPrimary} sx={{ width: "77px" }}>
                                                <MenuItem value={1}>1</MenuItem>
                                                <MenuItem value={5}>5</MenuItem>
                                                <MenuItem value={10}>10</MenuItem>
                                                <MenuItem value={25}>25</MenuItem>
                                                <MenuItem value={50}>50</MenuItem>
                                                <MenuItem value={100}>100</MenuItem>
                                            </Select>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'end' }}>
                                            <Grid >
                                                {isUserRoleCompare?.includes("excelprimaryworkorderlist")
                                                    && (
                                                        <>
                                                            <Button sx={userStyle.buttongrp} onClick={downloadCsvPrimaryAll}>&ensp;<FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                                        </>)}
                                                {isUserRoleCompare?.includes("csvprimaryworkorderlist")
                                                    && (
                                                        <>

                                                            <Button sx={userStyle.buttongrp} onClick={downloadExcelPrimaryAll}>&ensp;<FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                                        </>)}
                                                {isUserRoleCompare?.includes("printprimaryworkorderlist")
                                                    && (
                                                        <>
                                                            <Button sx={userStyle.buttongrp} onClick={handleprintAllPrimary}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                                        </>
                                                    )}
                                                {isUserRoleCompare?.includes("pdfprimaryworkorderlist")
                                                    && (
                                                        <>
                                                            <Button sx={userStyle.buttongrp} onClick={() => downloadPdfAllPrimary()}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                                        </>)}
                                                {isUserRoleCompare?.includes("imageprimaryworkorderlist")
                                                    && (
                                                        <>
                                                            <Button sx={userStyle.buttongrp} onClick={handleCaptureImagePrimary}> <ImageIcon sx={{ fontSize: "15px" }} />  &ensp;image&ensp; </Button>
                                                        </>
                                                    )}
                                            </Grid>
                                        </Box>
                                        <Box>
                                            <FormControl fullWidth size="small" >
                                                <Typography>Search</Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    value={searchQueryAllPrimary}
                                                    onChange={handleSearchChangeAllPrimary}
                                                />
                                            </FormControl>
                                        </Box>
                                    </Grid>
                                    <br />
                                    <Grid container sx={{ diaplay: 'flex', backgroundColor: '#dcdbdb00', postion: 'sticky', padding: '10px 05px' }}>
                                        <Box>
                                            Total Pages
                                        </Box>&ensp;&ensp;&ensp;
                                        <Box >
                                            <span style={{ fontWeight: 'bold', fontSize: '20px' }} >  Count</span> :<span style={{ fontWeight: 'bold', fontSize: '20px' }} >{overallCountPrimaryall}</span>
                                        </Box>
                                    </Grid>
                                    <Button sx={userStyle.buttongrp} onClick={() => { handleShowAllColumnsPrimary(); setColumnVisibilityPrimary(initialColumnVisibilityPrimary); }}>Show All Columns</Button>&ensp;
                                    <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsPrimary}>Manage Columns</Button><br /><br />

                                    <Box style={{ width: '100%', overflowY: 'hidden', }}  >
                                        <StyledDataGrid ref={gridRefPrimary}
                                            rows={rowDataTableAllPrimary}
                                            columns={columnDataTablePrimary.filter((column) => columnVisibilityPrimary[column.field])}
                                            autoHeight={true}
                                            density="compact"
                                            hideFooter
                                            checkboxSelection={columnVisibilityPrimary.checkboxSelection}
                                            getRowClassName={getRowClassNameAll}
                                            disableRowSelectionOnClick
                                            unstable_cellSelection
                                            onClipboardCopy={(copiedString) => setCopiedDataPrimary(copiedString)}
                                            unstable_ignoreValueFormatterDuringExport
                                        />
                                    </Box>
                                    <Grid container sx={{ diaplay: 'flex', backgroundColor: '#dcdbdb00', postion: 'sticky', padding: '10px 05px', boxShadow: '0px 0px 2px grey' }}>
                                        <Box>
                                            Total Pages
                                        </Box>&ensp;&ensp;&ensp;
                                        <Box >
                                            <span style={{ fontWeight: 'bold', fontSize: '20px' }} >  Count</span> :<span style={{ fontWeight: 'bold', fontSize: '20px' }} >{overallCountPrimaryall}</span>
                                        </Box>
                                    </Grid>
                                    <br />
                                    <Box style={userStyle.dataTablestyle}>
                                        <Box>
                                            Showing  {filteredDataAllPrimary.length > 0 ? ((pageAllPrimary - 1) * pageSizeAllPrimary) + 1 : 0}  to {Math.min(pageAllPrimary * pageSizeAllPrimary, filteredDatasAllPrimary.length)} of {filteredDatasAllPrimary.length} entries
                                        </Box>
                                        <Box>
                                            <Button onClick={() => setPageAllPrimary(1)} disabled={pageAllPrimary === 1} sx={userStyle.paginationbtn}>
                                                <FirstPageIcon />
                                            </Button>
                                            <Button onClick={() => handlePageChangeAllPrimary(pageAllPrimary - 1)} disabled={pageAllPrimary === 1} sx={userStyle.paginationbtn}>
                                                <NavigateBeforeIcon />
                                            </Button>
                                            {pageNumbersAllPrimary?.map((pageNumber) => (
                                                <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChangeAllPrimary(pageNumber)} className={((pageAllPrimary)) === pageNumber ? 'active' : ''} disabled={pageAllPrimary === pageNumber}>
                                                    {pageNumber}
                                                </Button>
                                            ))}
                                            {lastVisiblePageAllPrimary < totalPagesAllPrimary && <span>...</span>}
                                            <Button onClick={() => handlePageChangeAllPrimary(pageAllPrimary + 1)} disabled={pageAllPrimary === totalPagesAllPrimary} sx={userStyle.paginationbtn}>
                                                <NavigateNextIcon />
                                            </Button>
                                            <Button onClick={() => setPageAllPrimary((totalPagesAllPrimary))} disabled={pageAllPrimary === totalPagesAllPrimary} sx={userStyle.paginationbtn}>
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
            < Popover
                id={idprimary}
                open={isManageColumnsOpenPrimary}
                anchorEl={anchorElPrimary}
                onClose={handleCloseManageColumnsPrimary}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }
                }
            >
                {manageColumnsContentPrimary}
            </Popover >
            <br />
            {/* print layout Primary */}
            <TableContainer component={Paper} sx={userStyle.printcls} >
                <Table
                    aria-label="simple table"
                    id="excel"
                    ref={componentRefPrimary}
                >
                    <TableHead sx={{ fontWeight: "600" }}>
                        <TableRow>
                            <TableCell> SI.No</TableCell>
                            <TableCell> Project Name</TableCell>
                            <TableCell>Vendor Name</TableCell>
                            <TableCell>Priority</TableCell>
                            <TableCell>Customer</TableCell>
                            <TableCell>Process</TableCell>
                            <TableCell>Count</TableCell>
                            <TableCell>Tat</TableCell>
                            <TableCell>Created</TableCell>
                            <TableCell>Category Name</TableCell>
                            <TableCell>Subcategory Name</TableCell>
                            <TableCell>Queue Name</TableCell>
                            <TableCell>Branch </TableCell>
                            <TableCell>Unit</TableCell>
                            <TableCell>Team</TableCell>
                            <TableCell>Resperson</TableCell>
                            <TableCell>Sector</TableCell>
                            <TableCell>Points</TableCell>
                            <TableCell>Time</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredDataPrimary &&
                            (filteredDataPrimary?.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{row.project}</TableCell>
                                    <TableCell>{row.vendor}</TableCell>
                                    <TableCell>{row.priority}</TableCell>
                                    <TableCell>{row.customer}</TableCell>
                                    <TableCell>{row.process}</TableCell>
                                    <TableCell>{row.count}</TableCell>
                                    <TableCell>{row.tat}</TableCell>
                                    <TableCell>{row.created}</TableCell>
                                    <TableCell>{row.category}</TableCell>
                                    <TableCell>{row.subcategory}</TableCell>
                                    <TableCell>{row.queue}</TableCell>
                                    <TableCell>{row.branch}</TableCell>
                                    <TableCell>{row.unit}</TableCell>
                                    <TableCell>{row.team}</TableCell>
                                    <TableCell>{row.resperson}</TableCell>
                                    <TableCell>{row.prioritystatus}</TableCell>
                                    <TableCell>{row.points}</TableCell>
                                    <TableCell>{row.time}</TableCell>
                                </TableRow>
                            )))}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* print layout End */}


            {/* image capture of overtata */}
            <TableContainer component={Paper} style={{
                display: canvasState === false ? 'none' : 'block',
            }} >
                <Table
                    aria-label="simple table"
                    id="excelcanvastable"
                    ref={gridRefOvertat}
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
                        {filteredDataPrimary &&
                            (filteredDataPrimary.map((row, index) => {
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
                            }))}
                    </TableBody>
                </Table>
            </TableContainer>







            {/* print layout Primary */}
            <TableContainer component={Paper} sx={userStyle.printcls} >
                <Table
                    aria-label="simple table"
                    id="excel"
                    ref={componentRefNearTatPrimary}
                >
                    <TableHead sx={{ fontWeight: "600" }}>
                        <TableRow>
                            <TableCell> SI.No</TableCell>
                            <TableCell> Project Name</TableCell>
                            <TableCell>Vendor Name</TableCell>
                            <TableCell>Priority</TableCell>
                            <TableCell>Customer</TableCell>
                            <TableCell>Process</TableCell>
                            <TableCell>Count</TableCell>
                            <TableCell>Tat</TableCell>
                            <TableCell>Created</TableCell>
                            <TableCell>Category Name</TableCell>
                            <TableCell>Subcategory Name</TableCell>
                            <TableCell>Queue Name</TableCell>
                            <TableCell>Branch </TableCell>
                            <TableCell>Unit</TableCell>
                            <TableCell>Team</TableCell>
                            <TableCell>Resperson</TableCell>
                            <TableCell>Sector</TableCell>
                            <TableCell>Points</TableCell>
                            <TableCell>Time</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredDataNearTatPrimary &&
                            (filteredDataNearTatPrimary?.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{row.project}</TableCell>
                                    <TableCell>{row.vendor}</TableCell>
                                    <TableCell>{row.priority}</TableCell>
                                    <TableCell>{row.customer}</TableCell>
                                    <TableCell>{row.process}</TableCell>
                                    <TableCell>{row.count}</TableCell>
                                    <TableCell>{row.tat}</TableCell>
                                    <TableCell>{row.created}</TableCell>
                                    <TableCell>{row.category}</TableCell>
                                    <TableCell>{row.subcategory}</TableCell>
                                    <TableCell>{row.queue}</TableCell>
                                    <TableCell>{row.branch}</TableCell>
                                    <TableCell>{row.unit}</TableCell>
                                    <TableCell>{row.team}</TableCell>
                                    <TableCell>{row.resperson}</TableCell>
                                    <TableCell>{row.prioritystatus}</TableCell>
                                    <TableCell>{row.points}</TableCell>
                                    <TableCell>{row.time}</TableCell>
                                </TableRow>
                            )))}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* print layout End */}
            {/* print layout Primary */}
            <TableContainer component={Paper} sx={userStyle.printcls} >
                <Table
                    aria-label="simple table"
                    id="excel"
                    ref={componentRefAllPrimary}
                >
                    <TableHead sx={{ fontWeight: "600" }}>
                        <TableRow>
                            <TableCell> SI.No</TableCell>
                            <TableCell> Project Name</TableCell>
                            <TableCell>Vendor Name</TableCell>
                            <TableCell>Priority</TableCell>
                            <TableCell>Customer</TableCell>
                            <TableCell>Process</TableCell>
                            <TableCell>Count</TableCell>
                            <TableCell>Tat</TableCell>
                            <TableCell>Created</TableCell>
                            <TableCell>Category Name</TableCell>
                            <TableCell>Subcategory Name</TableCell>
                            <TableCell>Queue Name</TableCell>
                            <TableCell>Branch </TableCell>
                            <TableCell>Unit</TableCell>
                            <TableCell>Team</TableCell>
                            <TableCell>Resperson</TableCell>
                            <TableCell>Sector</TableCell>
                            <TableCell>Points</TableCell>
                            <TableCell>Time</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredDataAllPrimary &&
                            (filteredDataAllPrimary?.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{row.project}</TableCell>
                                    <TableCell>{row.vendor}</TableCell>
                                    <TableCell>{row.priority}</TableCell>
                                    <TableCell>{row.customer}</TableCell>
                                    <TableCell>{row.process}</TableCell>
                                    <TableCell>{row.count}</TableCell>
                                    <TableCell>{row.tat}</TableCell>
                                    <TableCell>{row.created}</TableCell>
                                    <TableCell>{row.category}</TableCell>
                                    <TableCell>{row.subcategory}</TableCell>
                                    <TableCell>{row.queue}</TableCell>
                                    <TableCell>{row.branch}</TableCell>
                                    <TableCell>{row.unit}</TableCell>
                                    <TableCell>{row.team}</TableCell>
                                    <TableCell>{row.resperson}</TableCell>
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
                display: canvasStatenear === false ? 'none' : 'block',
            }} >
                <Table
                    aria-label="simple table"
                    id="excelnear"
                    ref={gridRefNeartat}
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
                        {filteredDataNearTatPrimary &&
                            (filteredDataNearTatPrimary.map((row, index) => {
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
                            }))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TableContainer component={Paper} style={{
                display: canvasStateall === false ? 'none' : 'block',
            }} >
                <Table
                    aria-label="simple table"
                    id="excelall"
                    ref={gridRefPrimary}
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
                        {filteredDataAllPrimary &&
                            (filteredDataAllPrimary.map((row, index) => {
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
                            }))}
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
export default Primarworkorder;