import React, { useState, useEffect, useRef, useContext } from "react";
import {
    Box, Typography, OutlinedInput, Select, MenuItem, Dialog, TableBody, TableCell, TableRow,
    DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, TextField, IconButton
} from "@mui/material";
import { userStyle } from "../../../../../pageStyle";
import { FaPrint, FaFilePdf, FaFileCsv, FaFileExcel } from "react-icons/fa";
import { SERVICE } from '../../../../../services/Baseservice';
import axios from "axios";
import jsPDF from "jspdf";
import { DataGrid } from '@mui/x-data-grid';
import { handleApiError } from "../../../../../components/Errorhandling";
import { AuthContext, UserRoleAccessContext } from "../../../../../context/Appcontext";
import Headtitle from "../../../../../components/Headtitle";
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

const PrimaryIndividual = () => {

    const gridRef = useRef(null);
    const gridRefNear = useRef(null);
    const gridRefAll = useRef(null);

    //Datatable
    const [pagePrimary, setPagePrimary] = useState(1);
    const [pageSizePrimary, setPageSizePrimary] = useState(10);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [searchQueryManageNear, setSearchQueryManageNear] = useState("");
    const [searchQueryManageAll, setSearchQueryManageAll] = useState("");
    const [copiedData, setCopiedData] = useState('');

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
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };
    const [canvasState, setCanvasState] = useState(false)
    //image
    const handleCaptureImage = () => {
        const table = document.getElementById("excelcanvastable");
        const clonedTable = table.cloneNode(true);
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
            link.download = "Individual_Primary_OverTat.png";
            link.click();
        });
    };

    const handleCaptureImageNear = () => {
        const table = document.getElementById("excelcanvastablenear");

        // Clone the table element
        const clonedTable = table.cloneNode(true);

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
            link.download = "Individual Primary NearTat List.png";
            link.click();
        });
    };

    const handleCaptureImageAll = () => {
        const table = document.getElementById("excelcanvastableall");

        // Clone the table element
        const clonedTable = table.cloneNode(true);

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
            link.download = "All Individual Primary List.png";
            link.click();
        });
    };


    const [tableDataOverTatPrimary, setTableDataOverTatPrimary] = useState([]);
    const [tableDataNearTatPrimary, setTableDataNearTatPrimary] = useState([]);
    const [tableDataAllPrimary, setTableDataAllPrimary] = useState([]);
    const [checkprimaryovertatdata, setCheckprimaryovertatdata] = useState(false);
    const [checkprimaryneartatdata, setCheckprimaryneartatdata] = useState(false);
    const [checkprimaryalldata, setCheckprimaryalldata] = useState(false);

    const { isUserRoleAccess, isUserRoleCompare } = useContext(UserRoleAccessContext);

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

    // Manage Columns
    const [isManageColumnsOpenNear, setManageColumnsOpenNear] = useState(false);
    const [anchorElNear, setAnchorElNear] = useState(null)

    const handleOpenManageColumnsNear = (event) => {
        setAnchorElNear(event.currentTarget);
        setManageColumnsOpenNear(true);
    };
    const handleCloseManageColumnsNear = () => {
        setManageColumnsOpenNear(false);
        setSearchQueryManageNear("")
    };


    // Manage Columns
    const [isManageColumnsOpenAll, setManageColumnsOpenAll] = useState(false);
    const [anchorElAll, setAnchorElAll] = useState(null)

    const handleOpenManageColumnsAll = (event) => {
        setAnchorElAll(event.currentTarget);
        setManageColumnsOpenAll(true);
    };
    const handleCloseManageColumnsALL = () => {
        setManageColumnsOpenAll(false);
        setSearchQueryManageAll("")
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    const opennear = Boolean(anchorElNear);
    const idnear = opennear ? 'simple-popover' : undefined;
    const openall = Boolean(anchorElAll);
    const idall = openall ? 'simple-popover' : undefined;

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
        } else if ((params.row.tat)?.includes("an hour") || (params.row.tat)?.includes("minute") || (params.row.tat)?.includes("in 2 hours") || (params.row.tat)?.includes("in 3 hours") || (params.row.tat)?.includes("in 4 hours") || (params.row.tat)?.includes("in 5 hours") || (params.row.tat)?.includes("in 6 hours") || conditionMet) {
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
    // Show all columns
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

    // Show all columns
    const initialColumnVisibilityNear = {
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

    const [columnVisibilityNear, setColumnVisibilityNear] = useState(initialColumnVisibilityNear);

    // Show all columns
    const initialColumnVisibilityAll = {
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

    const [columnVisibilityAll, setColumnVisibilityAll] = useState(initialColumnVisibilityAll);
    const fetchPrimaryWorkOrderOverTatList = async () => {
        try {
            let res = await axios.post(SERVICE.EXCELINDIVIDUALPRIMARYWORKORDER, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                companyname: String(isUserRoleAccess.companyname),
                team: String(isUserRoleAccess.team),
            });

            setTableDataOverTatPrimary(res?.data?.finalresult);
            setCheckprimaryovertatdata(true);
        } catch (err) {setCheckprimaryovertatdata(true);handleApiError(err, setShowAlert, handleClickOpenerr);}
    }

    const fetchPrimaryWorkOrderAllList = async () => {
        try {
            let res = await axios.post(SERVICE.EXCELINDIVIDUALPRIMARYWORKORDER_NEARTAT, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                companyname: String(isUserRoleAccess.companyname),
                team: String(isUserRoleAccess.team),
            });
            setTableDataNearTatPrimary(res?.data?.finalresult);
            setCheckprimaryneartatdata(true);
        } catch (err) {setCheckprimaryneartatdata(true);handleApiError(err, setShowAlert, handleClickOpenerr);}
    }

    const fetchPrimaryWorkOrderNearTatList = async () => {
        try {
            let res = await axios.post(SERVICE.EXCELINDIVIDUALPRIMARYWORKORDER_ALLLIST, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                companyname: String(isUserRoleAccess.companyname),
                team: String(isUserRoleAccess.team),
            });

            setTableDataAllPrimary(res?.data?.finalresult);
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
    const searchOverTerms = searchQueryPrimary.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatasPrimary = itemsPrimary?.filter((item) => {
        return searchOverTerms.every((term) =>
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


    let overallCountOver = 0;



    const totalcountover = filteredDataPrimary && (
        filteredDataPrimary.forEach((item) => {
            overallCountOver += Number(item.count);
        })
    );

    const columnDataTable = [


        { field: "priority", headerName: "Priority", flex: 0, width: 75, headerClassName: "bold-header", hide: !columnVisibility.priority },

        { field: "customer", headerName: "Customer", flex: 0, width: 100, headerClassName: "bold-header", hide: !columnVisibility.customer },
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

        { field: "count", headerName: "Count", flex: 0, width: 75, headerClassName: "bold-header", hide: !columnVisibility.count },
        { field: "tat", headerName: "TAT Expiration", flex: 0, width: 150, headerClassName: "bold-header", hide: !columnVisibility.tat },
        { field: "created", headerName: "Created", flex: 0, width: 100, headerClassName: "bold-header", hide: !columnVisibility.created },
        { field: "branch", headerName: "Branch", flex: 0, width: 100, headerClassName: "bold-header", hide: !columnVisibility.branch },
        { field: "resperson", headerName: "Responsible Person", flex: 0, width: 300, headerClassName: "bold-header", hide: !columnVisibility.resperson },
        { field: "category", headerName: "Category", flex: 0, width: 300, headerClassName: "bold-header", hide: !columnVisibility.category },
        { field: "subcategory", headerName: "Subcategory", flex: 0, width: 150, headerClassName: "bold-header", hide: !columnVisibility.subcategory },
        { field: "queue", headerName: "Queue", flex: 0, width: 340, headerClassName: "bold-header", hide: !columnVisibility.queue },
        { field: "serialNumber", headerName: "SNo", flex: 0, width: 50, headerClassName: "bold-header", hide: !columnVisibility.serialNumber },
        { field: "project", headerName: "Project", flex: 0, width: 200, headerClassName: "bold-header", hide: !columnVisibility.project },
        { field: "vendor", headerName: "Vendor", flex: 0, width: 150, headerClassName: "bold-header", hide: !columnVisibility.vendor },
        { field: "unit", headerName: "Unit", flex: 0, width: 150, headerClassName: "bold-header", hide: !columnVisibility.unit },
        { field: "team", headerName: "Team", flex: 0, width: 100, headerClassName: "bold-header", hide: !columnVisibility.team },
        { field: "prioritystatus", headerName: "Sector", flex: 0, width: 100, headerClassName: "bold-header", hide: !columnVisibility.prioritystatus },
        { field: "points", headerName: "Points", flex: 0, width: 100, headerClassName: "bold-header", hide: !columnVisibility.points },
        { field: "time", headerName: "Time", flex: 0, width: 100, headerClassName: "bold-header", hide: !columnVisibility.time },
    ];

    const columnDataTableNear = [

        { field: "priority", headerName: "Priority", flex: 0, width: 75, headerClassName: "bold-header", hide: !columnVisibility.priority },

        { field: "customer", headerName: "Customer", flex: 0, width: 100, headerClassName: "bold-header", hide: !columnVisibility.customer },
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

        { field: "count", headerName: "Count", flex: 0, width: 75, headerClassName: "bold-header", hide: !columnVisibility.count },
        { field: "tat", headerName: "TAT Expiration", flex: 0, width: 150, headerClassName: "bold-header", hide: !columnVisibility.tat },
        { field: "created", headerName: "Created", flex: 0, width: 100, headerClassName: "bold-header", hide: !columnVisibility.created },
        { field: "branch", headerName: "Branch", flex: 0, width: 100, headerClassName: "bold-header", hide: !columnVisibility.branch },
        { field: "resperson", headerName: "Responsible Person", flex: 0, width: 300, headerClassName: "bold-header", hide: !columnVisibility.resperson },
        { field: "category", headerName: "Category", flex: 0, width: 300, headerClassName: "bold-header", hide: !columnVisibility.category },
        { field: "subcategory", headerName: "Subcategory", flex: 0, width: 150, headerClassName: "bold-header", hide: !columnVisibility.subcategory },
        { field: "queue", headerName: "Queue", flex: 0, width: 340, headerClassName: "bold-header", hide: !columnVisibility.queue },
        { field: "serialNumber", headerName: "SNo", flex: 0, width: 50, headerClassName: "bold-header", hide: !columnVisibility.serialNumber },
        { field: "project", headerName: "Project", flex: 0, width: 200, headerClassName: "bold-header", hide: !columnVisibility.project },
        { field: "vendor", headerName: "Vendor", flex: 0, width: 150, headerClassName: "bold-header", hide: !columnVisibility.vendor },
        { field: "unit", headerName: "Unit", flex: 0, width: 150, headerClassName: "bold-header", hide: !columnVisibility.unit },
        { field: "team", headerName: "Team", flex: 0, width: 100, headerClassName: "bold-header", hide: !columnVisibility.team },
        { field: "prioritystatus", headerName: "Sector", flex: 0, width: 100, headerClassName: "bold-header", hide: !columnVisibility.prioritystatus },
        { field: "points", headerName: "Points", flex: 0, width: 100, headerClassName: "bold-header", hide: !columnVisibility.points },
        { field: "time", headerName: "Time", flex: 0, width: 100, headerClassName: "bold-header", hide: !columnVisibility.time },
    ];

    const columnDataTableAll = [

        { field: "priority", headerName: "Priority", flex: 0, width: 75, headerClassName: "bold-header", hide: !columnVisibility.priority },

        { field: "customer", headerName: "Customer", flex: 0, width: 100, headerClassName: "bold-header", hide: !columnVisibility.customer },

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

        { field: "count", headerName: "Count", flex: 0, width: 75, headerClassName: "bold-header", hide: !columnVisibility.count },
        { field: "tat", headerName: "TAT Expiration", flex: 0, width: 150, headerClassName: "bold-header", hide: !columnVisibility.tat },
        { field: "created", headerName: "Created", flex: 0, width: 100, headerClassName: "bold-header", hide: !columnVisibility.created },
        { field: "branch", headerName: "Branch", flex: 0, width: 100, headerClassName: "bold-header", hide: !columnVisibility.branch },
        { field: "resperson", headerName: "Responsible Person", flex: 0, width: 300, headerClassName: "bold-header", hide: !columnVisibility.resperson },
        { field: "category", headerName: "Category", flex: 0, width: 300, headerClassName: "bold-header", hide: !columnVisibility.category },
        { field: "subcategory", headerName: "Subcategory", flex: 0, width: 150, headerClassName: "bold-header", hide: !columnVisibility.subcategory },
        { field: "queue", headerName: "Queue", flex: 0, width: 340, headerClassName: "bold-header", hide: !columnVisibility.queue },
        { field: "serialNumber", headerName: "SNo", flex: 0, width: 50, headerClassName: "bold-header", hide: !columnVisibility.serialNumber },
        { field: "project", headerName: "Project", flex: 0, width: 200, headerClassName: "bold-header", hide: !columnVisibility.project },
        { field: "vendor", headerName: "Vendor", flex: 0, width: 150, headerClassName: "bold-header", hide: !columnVisibility.vendor },
        { field: "unit", headerName: "Unit", flex: 0, width: 150, headerClassName: "bold-header", hide: !columnVisibility.unit },
        { field: "team", headerName: "Team", flex: 0, width: 100, headerClassName: "bold-header", hide: !columnVisibility.team },
        { field: "prioritystatus", headerName: "Sector", flex: 0, width: 100, headerClassName: "bold-header", hide: !columnVisibility.prioritystatus },
        { field: "points", headerName: "Points", flex: 0, width: 100, headerClassName: "bold-header", hide: !columnVisibility.points },
        { field: "time", headerName: "Time", flex: 0, width: 100, headerClassName: "bold-header", hide: !columnVisibility.time },
    ]

    // Create a row data object for the DataGrid
    const rowDataTableOvertat = filteredDataPrimary.map((item, index) => {
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

    // Manage Columns functionality
    const toggleColumnVisibility = (field) => {
        setColumnVisibility((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));

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

    const filteredColumnsNear = columnDataTableNear?.filter((column) => {
        if (column.field === 'checkboxSelection') {
            // If you want to include the checkbox column, return true.
            // If you want to exclude it from filtering, return false.
            return true; // Include the checkbox column
        }
        if (typeof column?.headerName === 'string') {
            return column?.headerName?.toLowerCase()?.includes(searchQueryManageNear?.toLowerCase());
        }
        if (typeof column?.headerName === 'object' && column?.headerName?.props?.children) {
            const headerText = typeof column.headerName.props.children === 'string'
                ? column.headerName.props.children
                : '';
            return headerText.toLowerCase().includes(searchQueryManageNear?.toLowerCase());
        }
        return false;
    });

    const filteredColumnsAll = columnDataTableAll?.filter((column) => {
        if (column.field === 'checkboxSelection') {
            // If you want to include the checkbox column, return true.
            // If you want to exclude it from filtering, return false.
            return true; // Include the checkbox column
        }
        if (typeof column?.headerName === 'string') {
            return column?.headerName?.toLowerCase()?.includes(searchQueryManageAll?.toLowerCase());
        }
        if (typeof column?.headerName === 'object' && column?.headerName?.props?.children) {
            const headerText = typeof column.headerName.props.children === 'string'
                ? column.headerName.props.children
                : '';
            return headerText.toLowerCase().includes(searchQueryManageAll?.toLowerCase());
        }
        return false;
    });


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

    // JSX for the "Manage Columns" popover content
    const manageColumnsContentNear = (
        <div style={{ padding: "10px", minWidth: "325px" }}>
            <Typography variant="h6">Manage Columns</Typography>
            <IconButton
                aria-label="close"
                onClick={handleCloseManageColumnsNear}
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
                    value={searchQueryManageNear}
                    onChange={(e) => setSearchQueryManageNear(e.target.value)}
                    sx={{ marginBottom: 5, position: 'absolute', }}
                />
            </Box><br /><br />
            <DialogContent sx={{ minWidth: 'auto', height: '200px', position: 'relative' }}>
                <List sx={{ overflow: 'auto', height: '100%', }}>
                    <ListItemText sx={{ display: 'flex', marginLeft: '15px' }}
                        primary={
                            <Switch sx={{ marginTop: "-5px" }}
                                checked={columnVisibilityNear.checkboxSelection}
                                onChange={() => toggleColumnVisibilityNear('checkboxSelection')}
                            />
                        }
                        secondary={<Typography variant="subtitle1" sx={{ fontSize: "15px", fontWeight: '400' }}>Checkbox Selection</Typography>}
                    />
                    {filteredColumnsNear.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText sx={{ display: 'flex' }}
                                primary={
                                    <Switch sx={{ marginTop: "-10px" }}
                                        checked={columnVisibilityNear[column.field]}
                                        onChange={() => toggleColumnVisibilityNear(column.field)}
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
                            onClick={() => setColumnVisibilityNear(initialColumnVisibilityNear)}
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
                                const newColumnVisibilityNear = {};
                                columnDataTableNear.forEach((column) => {
                                    newColumnVisibilityNear[column.field] = false; // Set hide property to true
                                });
                                setColumnVisibilityNear(newColumnVisibilityNear);
                            }}
                        >
                            Hide All
                        </Button>

                    </Grid>
                </Grid>
            </DialogActions>
        </div>
    );

    // JSX for the "Manage Columns" popover content
    const manageColumnsContentAll = (
        <div style={{ padding: "10px", minWidth: "325px" }}>
            <Typography variant="h6">Manage Columns</Typography>
            <IconButton
                aria-label="close"
                onClick={handleCloseManageColumnsALL}
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
                    value={searchQueryManageAll}
                    onChange={(e) => setSearchQueryManageAll(e.target.value)}
                    sx={{ marginBottom: 5, position: 'absolute', }}
                />
            </Box><br /><br />
            <DialogContent sx={{ minWidth: 'auto', height: '200px', position: 'relative' }}>
                <List sx={{ overflow: 'auto', height: '100%', }}>
                    <ListItemText sx={{ display: 'flex', marginLeft: '15px' }}
                        primary={
                            <Switch sx={{ marginTop: "-5px" }}
                                checked={columnVisibilityAll.checkboxSelection}
                                onChange={() => toggleColumnVisibilityAll('checkboxSelection')}
                            />
                        }
                        secondary={<Typography variant="subtitle1" sx={{ fontSize: "15px", fontWeight: '400' }}>Checkbox Selection</Typography>}
                    />
                    {filteredColumnsAll.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText sx={{ display: 'flex' }}
                                primary={
                                    <Switch sx={{ marginTop: "-10px" }}
                                        checked={columnVisibilityAll[column.field]}
                                        onChange={() => toggleColumnVisibilityAll(column.field)}
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
                            onClick={() => setColumnVisibilityAll(initialColumnVisibilityAll)}
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
                                const newColumnVisibilityAll = {};
                                columnDataTableAll.forEach((column) => {
                                    newColumnVisibilityAll[column.field] = false; // Set hide property to true
                                });
                                setColumnVisibilityAll(newColumnVisibilityAll);
                            }}
                        >
                            Hide All
                        </Button>

                    </Grid>
                </Grid>
            </DialogActions>
        </div>
    );

    // Excel
    const downloadExcelOvertat = async () => {

        try {
            // Fetch the data if not already fetched
            if (!tableDataOverTatPrimary?.length) {
                await fetchPrimaryWorkOrderOverTatList();
            }
            // downloadCsvSecondary();
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Primary IndividualOverTat');

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
            filteredDataPrimary?.forEach((row, index) => {
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
            filteredDataPrimary?.forEach((row, index) => {

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
            a.download = 'Individual_Primary_OverTat.xlsx'; // File name
            a.click();
        } catch (error) {
            // Handle any errors that may occur during the process
            console.error(error);
        }
    };

    // Function to generate a downloadable CSV file
    const downloadCsvOvertat = () => {
        const csvData = [];

        // Add CSV headers
        const headers = ['Priority', 'Customer', 'Process Hyperlink', 'Count', 'Tat Expiration', 'Created',
            'Branch', 'Responsible Person', 'Category Name', 'Subcategory Name', 'Queue Name', 'S.No', 'Project Name', 'Vendor Name', 'Unit', 'Team', 'Sector', 'Points', 'Time',
        ];
        csvData.push(headers);

        // Add data rows
        filteredDataPrimary?.forEach((row, index) => {
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
        saveAs(blob, 'Individual_Primary_OverTat.csv'); // Specify the filename with .csv extension
    };


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
    const searchOvernearTerms = searchQueryNearTatPrimary.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatasNearTatPrimary = itemsNearTatPrimary?.filter((item) => {
        return searchOvernearTerms.every((term) =>
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

    let overallCountNear = 0;



    const totalcountnear = filteredDataNearTatPrimary && (
        filteredDataNearTatPrimary.forEach((item) => {
            overallCountNear += Number(item.count);
        })
    );

    // Create a row data object for the DataGrid
    const rowDataTableNeartat = filteredDataNearTatPrimary.map((item, index) => {
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

    // Show All Columns functionality
    const handleShowAllColumnsNear = () => {
        const updatedVisibilityNear = { ...columnVisibilityNear };
        for (const columnKey in updatedVisibilityNear) {
            updatedVisibilityNear[columnKey] = true;
        }
        setColumnVisibilityNear(updatedVisibilityNear);
    };

    // Manage Columns functionality
    const toggleColumnVisibilityNear = (field) => {
        setColumnVisibilityNear((prevVisibilityNear) => ({
            ...prevVisibilityNear,
            [field]: !prevVisibilityNear[field],
        }));

    };
    const downloadExcelNeartat = async () => {

        try {
            // Fetch the data if not already fetched
            if (!tableDataNearTatPrimary?.length) {
                await fetchPrimaryWorkOrderOverTatList();
            }
            // downloadCsvSecondary();
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Primary IndividualOverTat');

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
                    "Points": row.points == 'Unallotted' ? '0.0000' : parseFloat(row.points),
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
            a.download = 'Individual_Primary_NearTat.xlsx'; // File name
            a.click();
        } catch (error) {
            // Handle any errors that may occur during the process
            console.error(error);
        }
    };

    // Function to generate a downloadable CSV file
    const downloadCsvNeartat = () => {
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
        saveAs(blob, 'Individual_Primary_NearTat.csv'); // Specify the filename with .csv extension
    };



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
    const searchQuery = searchQueryAllPrimary.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatasAllPrimary = itemsAllPrimary?.filter((item) => {
        return searchQuery.every((term) =>
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

    let overallCountAll = 0;



    const totalcount = filteredDataAllPrimary && (
        filteredDataAllPrimary.forEach((item) => {
            overallCountAll += Number(item.count);
        })
    );



    // Create a row data object for the DataGrid
    const rowDataTableAll = filteredDataAllPrimary.map((item, index) => {
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


    // Show All Columns functionality
    const handleShowAllColumnsAll = () => {
        const updatedVisibilityAll = { ...columnVisibilityAll };
        for (const columnKey in updatedVisibilityAll) {
            updatedVisibilityAll[columnKey] = true;
        }
        setColumnVisibilityAll(updatedVisibilityAll);
    };

    // Manage Columns functionality
    const toggleColumnVisibilityAll = (field) => {
        setColumnVisibilityAll((prevVisibilityAll) => ({
            ...prevVisibilityAll,
            [field]: !prevVisibilityAll[field],
        }));

    };

    const downloadExcelAll = async () => {

        try {
            // Fetch the data if not already fetched
            if (!tableDataAllPrimary?.length) {
                await fetchPrimaryWorkOrderOverTatList();
            }
            // downloadCsvSecondary();
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Primary IndividualAll');

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
                    "Points": row.points == 'Unallotted' ? '0.0000' : parseFloat(row.points),
                    "Time": row.time,
                });
            });

            // Define a hyperlink style
            const hyperlinkStyle = {
                font: { color: { argb: '0000FF' }, underline: true },
            };

            // Add hyperlinks to the worksheet
            filteredDataAllPrimary?.forEach((row, index) => {

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
            a.download = 'All_Individual_Primary.xlsx'; // File name
            a.click();
        } catch (error) {
            // Handle any errors that may occur during the process
            console.error(error);
        }
    };

    // Function to generate a downloadable CSV file
    const downloadCsvAll = () => {
        const csvData = [];

        // Add CSV headers
        const headers = ['Priority', 'Customer', 'Process Hyperlink', 'Count', 'Tat Expiration', 'Created',
            'Branch', 'Responsible Person', 'Category Name', 'Subcategory Name', 'Queue Name', 'S.No', 'Project Name', 'Vendor Name', 'Unit', 'Team', 'Sector', 'Points', 'Time',
        ];
        csvData.push(headers);

        // Add data rows
        filteredDataAllPrimary?.forEach((row, index) => {
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
        saveAs(blob, 'All_Individual_Primary.csv'); // Specify the filename with .csv extension
    };

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
        doc.save("Individual_Primary_OverTat.pdf");
    };

    //print...Primary
    const componentRefPrimary = useRef();
    const handleprintPrimary = useReactToPrint({
        content: () => componentRefPrimary.current,
        documentTitle: 'Individual_Primary_OverTat',
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
        doc.save("Individual_Primary_NearTat.pdf");
    };

    //print...NearTatPrimary
    const componentRefNearTatPrimary = useRef();
    const handleprintNearTatPrimary = useReactToPrint({
        content: () => componentRefNearTatPrimary.current,
        documentTitle: 'Individual_Primary_NearTat',
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
        doc.save("All_Individual_Primary.pdf");
    };

    //print...AllPrimary
    const componentRefAllPrimary = useRef();
    const handleprintAllPrimary = useReactToPrint({
        content: () => componentRefAllPrimary.current,
        documentTitle: 'All_Individual_Primary',
        pageStyle: 'print'
    });

    return (

        <>
            <Headtitle title={'Work Order'} />
            {isUserRoleCompare?.includes("lprimaryindividualworkorderlist")
                && (
                    <>
                        <Box sx={userStyle.container}>
                            <Typography sx={userStyle.SubHeaderText}> Individual Primary OverTat List</Typography>
                            <br /><br />

                            {!checkprimaryovertatdata ?
                                <>
                                    <Box style={{ display: 'flex', justifyContent: 'center' }}>
                                        <FacebookCircularProgress />
                                    </Box>
                                </>
                                :
                                <>

                                    <Grid container spacing={2} style={userStyle.dataTablestyle}>
                                        <Grid item md={2} xs={12} sm={12}>
                                            <Box>
                                                <label htmlFor="pageSizeSelect">Show entries:</label>
                                                <Select id="pageSizeSelect" defaultValue="" value={pageSizePrimary} onChange={handlePageSizeChangePrimary} sx={{ width: "77px" }}>
                                                    <MenuItem value={1}>1</MenuItem>
                                                    <MenuItem value={5}>5</MenuItem>
                                                    <MenuItem value={10}>10</MenuItem>
                                                    <MenuItem value={25}>25</MenuItem>
                                                    <MenuItem value={50}>50</MenuItem>
                                                    <MenuItem value={100}>100</MenuItem>
                                                    <MenuItem value={(tableDataOverTatPrimary?.length)}>All</MenuItem>
                                                </Select>
                                            </Box>
                                        </Grid>
                                        <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                                            <Box >
                                                {isUserRoleCompare?.includes("csvprimaryindividualworkorderlist")
                                                    && (
                                                        <>
                                                            <Button sx={userStyle.buttongrp} onClick={downloadCsvOvertat}>&ensp;<FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                                                        </>)}
                                                {isUserRoleCompare?.includes("excelprimaryindividualworkorderlist")
                                                    && (
                                                        <>
                                                            <Button sx={userStyle.buttongrp} onClick={downloadExcelOvertat}>&ensp;<FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                                        </>)}
                                                {isUserRoleCompare?.includes("printprimaryindividualworkorderlist")
                                                    && (
                                                        <>
                                                            <Button sx={userStyle.buttongrp} onClick={handleprintPrimary}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                                        </>)}
                                                {isUserRoleCompare?.includes("pdfprimaryindividualworkorderlist")
                                                    && (
                                                        <>
                                                            <Button sx={userStyle.buttongrp} onClick={() => downloadPdfPrimary()}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                                        </>)}
                                                {isUserRoleCompare?.includes("imageprimaryindividualworkorderlist")
                                                    && (
                                                        <>
                                                            <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}> <ImageIcon sx={{ fontSize: "15px" }} />  &ensp;Image&ensp; </Button>

                                                        </>)}
                                            </Box>
                                        </Grid>
                                        <Grid item md={2} xs={12} sm={12}>
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
                                    </Grid>
                                    <br />
                                    <Grid container sx={{ diaplay: 'flex', backgroundColor: '#dcdbdb00', postion: 'sticky', padding: '10px 05px' }}>
                                        <Box>
                                            Total Pages
                                        </Box>&ensp;&ensp;&ensp;
                                        <Box >
                                            <span style={{ fontWeight: 'bold', fontSize: '20px' }} >  Count</span> :<span style={{ fontWeight: 'bold', fontSize: '20px' }} >{overallCountOver}</span>
                                        </Box>
                                    </Grid>
                                    <Button sx={userStyle.buttongrp} onClick={() => { handleShowAllColumns(); setColumnVisibility(initialColumnVisibility) }}>Show All Columns</Button> &ensp;
                                    <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>Manage Columns</Button>
                                    <br />
                                    <br />
                                    <Box
                                        style={{
                                            // height: calculateDataGridHeightPrimaryAll(),
                                            width: '100%',
                                            overflowY: 'hidden', // Hide the y-axis scrollbar
                                        }}
                                    >
                                        <StyledDataGrid
                                            rows={rowDataTableOvertat}
                                            // columns={columnDataTable}
                                            columns={columnDataTable.filter((column) => columnVisibility[column.field])}
                                            // autoHeight={pageSizeAllPrimary === 'All'}
                                            autoHeight={true}
                                            ref={gridRef}
                                            density="compact"
                                            onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
                                            disableRowSelectionOnClick
                                            unstable_cellSelection
                                            unstable_ignoreValueFormatterDuringExport
                                            hideFooter
                                            checkboxSelection={columnVisibility.checkboxSelection} // Set checkboxSelection based on visibility state
                                            getRowClassName={getRowClassNameAll}
                                        />
                                    </Box>

                                    <Grid container sx={{ diaplay: 'flex', backgroundColor: '#dcdbdb00', postion: 'sticky', padding: '10px 05px', boxShadow: '0px 0px 2px grey' }}>
                                        <Box>
                                            Total Pages
                                        </Box>&ensp;&ensp;&ensp;
                                        <Box >
                                            <span style={{ fontWeight: 'bold', fontSize: '20px' }} >  Count</span> :<span style={{ fontWeight: 'bold', fontSize: '20px' }} >{overallCountOver}</span>
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
            <br />
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
            {isUserRoleCompare?.includes("lprimaryindividualworkorderlist")
                && (
                    <>
                        <Box sx={userStyle.container}>
                            <Typography sx={userStyle.SubHeaderText}>Individual Primary NearTat List</Typography>
                            <br /><br />

                            {!checkprimaryneartatdata ?
                                <>
                                    <Box style={{ display: 'flex', justifyContent: 'center' }}>
                                        <FacebookCircularProgress />
                                    </Box>
                                </>
                                :
                                <>

                                    <Grid container spacing={2} style={userStyle.dataTablestyle}>
                                        <Grid item md={2} xs={12} sm={12}>
                                            <Box>
                                                <label htmlFor="pageSizeSelect">Show entries:</label>
                                                <Select id="pageSizeSelect" defaultValue="" value={pageSizeNearTatPrimary} onChange={handlePageSizeChangeNearTatPrimary} sx={{ width: "77px" }}>
                                                    <MenuItem value={1}>1</MenuItem>
                                                    <MenuItem value={5}>5</MenuItem>
                                                    <MenuItem value={10}>10</MenuItem>
                                                    <MenuItem value={25}>25</MenuItem>
                                                    <MenuItem value={50}>50</MenuItem>
                                                    <MenuItem value={100}>100</MenuItem>
                                                    <MenuItem value={(tableDataNearTatPrimary?.length)}>All</MenuItem>
                                                </Select>
                                            </Box>
                                        </Grid>
                                        { /* ****** Header Buttons ****** */}
                                        <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                                            <Box >
                                                {isUserRoleCompare?.includes("csvprimaryindividualworkorderlist")
                                                    && (
                                                        <>
                                                            <Button sx={userStyle.buttongrp} onClick={downloadCsvNeartat}>&ensp;<FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                                                        </>)}
                                                {isUserRoleCompare?.includes("excelprimaryindividualworkorderlist")
                                                    && (
                                                        <>
                                                            <Button sx={userStyle.buttongrp} onClick={downloadExcelNeartat}>&ensp;<FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                                        </>)}
                                                {isUserRoleCompare?.includes("printprimaryindividualworkorderlist")
                                                    && (
                                                        <>
                                                            <Button sx={userStyle.buttongrp} onClick={handleprintNearTatPrimary}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                                        </>)}
                                                {isUserRoleCompare?.includes("pdfprimaryindividualworkorderlist")
                                                    && (
                                                        <>
                                                            <Button sx={userStyle.buttongrp} onClick={() => downloadPdfNearTatPrimary()}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                                        </>)}
                                                {isUserRoleCompare?.includes("imageprimaryindividualworkorderlist")
                                                    && (
                                                        <>
                                                            <Button sx={userStyle.buttongrp} onClick={handleCaptureImageNear}> <ImageIcon sx={{ fontSize: "15px" }} />  &ensp;Image&ensp; </Button>

                                                        </>)}
                                            </Box>
                                        </Grid>

                                        <Grid item md={2} xs={12} sm={12}>
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
                                    <Button sx={userStyle.buttongrp} onClick={() => { handleShowAllColumnsNear(); setColumnVisibilityNear(initialColumnVisibilityNear) }}>Show All Columns</Button>&ensp;
                                    <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsNear}>Manage Columns</Button>
                                    <br />
                                    <br />
                                    <Box
                                        style={{
                                            // height: calculateDataGridHeightPrimaryAll(),
                                            width: '100%',
                                            overflowY: 'hidden', // Hide the y-axis scrollbar
                                        }}
                                    >
                                        <StyledDataGrid
                                            rows={rowDataTableNeartat}
                                            columns={columnDataTableNear.filter((column) => columnVisibilityNear[column.field])}
                                            autoHeight={true}
                                            ref={gridRefNear}
                                            density="compact"
                                            onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
                                            disableRowSelectionOnClick
                                            unstable_cellSelection
                                            unstable_ignoreValueFormatterDuringExport
                                            hideFooter
                                            checkboxSelection={columnVisibilityNear.checkboxSelection} // Set checkboxSelection based on visibility state
                                            getRowClassName={getRowClassNameAll}
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
                                            Showing  {filteredDataNearTatPrimary?.length > 0 ? ((pageNearTatPrimary - 1) * pageSizeNearTatPrimary) + 1 : 0}  to {Math.min(pageNearTatPrimary * pageSizeNearTatPrimary, filteredDatasNearTatPrimary.length)} of {filteredDatasNearTatPrimary.length} entries
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
            <br />
            {/* Manage Column */}
            <Popover
                id={idnear}
                open={isManageColumnsOpenNear}
                anchorEl={anchorElNear}
                onClose={handleCloseManageColumnsNear}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                {manageColumnsContentNear}
            </Popover>
            {isUserRoleCompare?.includes("lprimaryindividualworkorderlist")
                && (
                    <>
                        <Box sx={userStyle.container}>
                            <Typography sx={userStyle.SubHeaderText}>All Individual Primary List</Typography>
                            <br /><br />

                            {!checkprimaryalldata ?
                                <>
                                    <Box style={{ display: 'flex', justifyContent: 'center' }}>
                                        <FacebookCircularProgress />
                                    </Box>
                                </>
                                :
                                <>

                                    <Grid container spacing={2} style={userStyle.dataTablestyle}>
                                        <Grid item md={2} xs={12} sm={12}>
                                            <Box>
                                                <label htmlFor="pageSizeSelect">Show entries:</label>
                                                <Select id="pageSizeSelect" defaultValue="" value={pageSizeAllPrimary} onChange={handlePageSizeChangeAllPrimary} sx={{ width: "77px" }}>
                                                    <MenuItem value={1}>1</MenuItem>
                                                    <MenuItem value={5}>5</MenuItem>
                                                    <MenuItem value={10}>10</MenuItem>
                                                    <MenuItem value={25}>25</MenuItem>
                                                    <MenuItem value={50}>50</MenuItem>
                                                    <MenuItem value={100}>100</MenuItem>
                                                    <MenuItem value={(tableDataAllPrimary?.length)}>All</MenuItem>
                                                </Select>
                                            </Box>
                                        </Grid>
                                        <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                                            <Box >
                                                {isUserRoleCompare?.includes("csvprimaryindividualworkorderlist")
                                                    && (
                                                        <>
                                                            <Button sx={userStyle.buttongrp} onClick={downloadCsvAll}>&ensp;<FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                                                        </>)}
                                                {isUserRoleCompare?.includes("excelprimaryindividualworkorderlist")
                                                    && (
                                                        <>
                                                            <Button sx={userStyle.buttongrp} onClick={downloadExcelAll}>&ensp;<FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                                        </>)}
                                                {isUserRoleCompare?.includes("printprimaryindividualworkorderlist")
                                                    && (
                                                        <>
                                                            <Button sx={userStyle.buttongrp} onClick={handleprintAllPrimary}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                                        </>)}
                                                {isUserRoleCompare?.includes("pdfprimaryindividualworkorderlist")
                                                    && (
                                                        <>
                                                            <Button sx={userStyle.buttongrp} onClick={() => downloadPdfAllPrimary()}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                                        </>)}
                                                {isUserRoleCompare?.includes("imageprimaryindividualworkorderlist")
                                                    && (
                                                        <>
                                                            <Button sx={userStyle.buttongrp} onClick={handleCaptureImageAll}> <ImageIcon sx={{ fontSize: "15px" }} />  &ensp;Image&ensp; </Button>

                                                        </>)}
                                            </Box>
                                        </Grid>

                                        <Grid item md={2} xs={12} sm={12}>
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
                                    </Grid>
                                    <br />
                                    <Grid container sx={{ diaplay: 'flex', backgroundColor: '#dcdbdb00', postion: 'sticky', padding: '10px 05px'}}>
                                        <Box>
                                            Total Pages
                                        </Box>&ensp;&ensp;&ensp;
                                        <Box >
                                            <span style={{ fontWeight: 'bold', fontSize: '20px' }} >  Count</span> :<span style={{ fontWeight: 'bold', fontSize: '20px' }} >{overallCountAll}</span>
                                        </Box>
                                    </Grid>
                                    <Button sx={userStyle.buttongrp} onClick={() => { handleShowAllColumnsAll(); setColumnVisibilityAll(initialColumnVisibilityAll) }}>Show All Columns</Button>&ensp;
                                    <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsAll}>Manage Columns</Button>
                                    <br />
                                    <br />
                                    <Box
                                        style={{
                                            // height: calculateDataGridHeightPrimaryAll(),
                                            width: '100%',
                                            overflowY: 'hidden', // Hide the y-axis scrollbar
                                        }}
                                    >
                                        <StyledDataGrid
                                            rows={rowDataTableAll}
                                            columns={columnDataTableAll.filter((column) => columnVisibilityAll[column.field])}
                                            autoHeight={true}
                                            ref={gridRefAll}
                                            density="compact"
                                            onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
                                            disableRowSelectionOnClick
                                            unstable_cellSelection
                                            unstable_ignoreValueFormatterDuringExport
                                            hideFooter
                                            checkboxSelection={columnVisibilityAll.checkboxSelection} // Set checkboxSelection based on visibility state
                                            getRowClassName={getRowClassNameAll}
                                        />
                                    </Box>
                                    <Grid container sx={{ diaplay: 'flex', backgroundColor: '#dcdbdb00', postion: 'sticky', padding: '10px 05px', boxShadow: '0px 0px 2px grey' }}>
                                        <Box>
                                            Total Pages
                                        </Box>&ensp;&ensp;&ensp;
                                        <Box >
                                            <span style={{ fontWeight: 'bold', fontSize: '20px' }} >  Count</span> :<span style={{ fontWeight: 'bold', fontSize: '20px' }} >{overallCountAll}</span>
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
            <Popover
                id={idall}
                open={isManageColumnsOpenAll}
                anchorEl={anchorElNear}
                onClose={handleCloseManageColumnsALL}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                {manageColumnsContentAll}
            </Popover>
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


            <TableContainer component={Paper} style={{
                display: canvasState === false ? 'none' : 'block',
            }} >
                <Table
                    aria-label="simple table"
                    id="excelcanvastablenear"
                    ref={gridRefNear}
                >
                    <TableHead sx={{ fontWeight: "600" }}>
                        <TableRow>
                            <TableCell>Priority</TableCell>
                            <TableCell>Customer</TableCell>
                            <TableCell>Process </TableCell>
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
                display: canvasState === false ? 'none' : 'block',
            }} >
                <Table
                    aria-label="simple table"
                    id="excelcanvastableall"
                    ref={gridRefAll}
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
export default PrimaryIndividual;