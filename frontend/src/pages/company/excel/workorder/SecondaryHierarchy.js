import React, { useState, useEffect, useRef, useContext } from "react";
import {
    Box, Typography, OutlinedInput, Select, MenuItem, Dialog, TableBody, TableCell, TableRow, DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead, TableContainer, Button,
    List, ListItem, ListItemText, Popover, TextField, IconButton,
} from "@mui/material";
import { userStyle, colourStyles } from "../../../../pageStyle";
import { FaFileCsv, FaFileExcel, FaPrint, FaFilePdf } from "react-icons/fa";
import { SERVICE } from '../../../../services/Baseservice';
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import axios from "axios";
import jsPDF from "jspdf";
import Selects from "react-select";
import { AuthContext } from "../../../../context/Appcontext";
import { DataGrid } from '@mui/x-data-grid';
import Headtitle from "../../../../components/Headtitle";
import { handleApiError } from "../../../../components/Errorhandling";
import { styled } from '@mui/system';
import 'jspdf-autotable';
import { useReactToPrint } from "react-to-print";
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import CircularProgress, { circularProgressClasses, } from '@mui/material/CircularProgress';
import ExcelJS from 'exceljs';
import { saveAs } from "file-saver";
import Papa from "papaparse";
import Switch from '@mui/material/Switch';
import CloseIcon from '@mui/icons-material/Close';
import html2canvas from 'html2canvas';
import ImageIcon from '@mui/icons-material/Image';
import { UserRoleAccessContext } from "../../../../context/Appcontext";
import LoadingButton from "@mui/lab/LoadingButton";
import { ThreeDots } from 'react-loader-spinner';

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


const Seondaryworkorder = () => {
    const gridRef = useRef(null);
    const [isBtn, setIsBtn] = useState(false);
    const [isBtnSubmit, setIsBtnSubmit] = useState(false);
    const [excelDataSecondary, setExcelDataSecondary] = useState([]);
    //Datatable
    const [pageSecondary, setPageSecondary] = useState(1);
    const [pageSizeSecondary, setPageSizeSecondary] = useState(10);
    const [isLoader, setIsLoader] = useState(false)
    const [canvasState, setCanvasState] = useState(false)

    const { auth } = useContext(AuthContext);
    const { isUserRoleCompare , isUserRoleAccess, allUsersData, allTeam, isAssignBranch } = useContext(UserRoleAccessContext);

    //filter fields
    const [newcheckbranch, setNewcheckBranch] = useState("Select Branch");
    const [allFilters, setAllFilters] = useState({
        project: "Please Select Project",
        vendor: "Please Select Vendor",
        category: "Please Select Category",
        subcategory: "Please Select Subcategory",
        queue: "Please Select Queue",
        branch: "Please Select Branch",
        unit: "Please Select Unit",
        team: "Please Select Team",
        responsibleperson: "Please Select ResponsiblePerson",
        sector: "Please Select Sector"
    })
    const [vendors, setVendors] = useState([]);
    const [projects, setProjects] = useState([]);
    const [categorys, setCategorys] = useState([]);
    const [subcategorys, setSubCategorys] = useState([]);
    const [queues, setQueues] = useState([]);
    const [branchs, setBranchs] = useState([]);
    const [units, setUnits] = useState([]);
    const [teams, setTeams] = useState([]);
    const [responsibleperson, setResponsiblePersons] = useState([]);
    const [unitstabledata, setUnitstabledata] = useState([]);
    const [newcheckunit, setNewcheckUnit] = useState("Select Unit");
    const [newcheckteam, setNewcheckTeam] = useState("Select Team");
    const [users, setUsers] = useState([]);

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const handleClickOpenerr = () => { setIsErrorOpen(true);  setIsBtnSubmit(false) };
    const handleCloseerr = () => { setIsErrorOpen(false);   setIsBtnSubmit(false)};
    const [tableDataSecondary, setTableDataSecondary] = useState([]);

    // clipboard
    const [copiedData, setCopiedData] = useState('');

    // State for manage columns search query
    const [searchQueryManage, setSearchQueryManage] = useState("");
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
        '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: " bold !important ",

        },
        '& .custom-id-row': {
            backgroundColor: '#1976d22b !important',
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

    // Show All Columns & Manage Columns 
    const initialColumnVisibility = {
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
        level: true,
        // control: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

    const [tableDataOthers, setTableDataOthers] = useState([]);
    const [itemsOthers, setItemsOthers] = useState([]);


    //project change vendor filter
    const handleProjectChange = async (e) => {
        try {
            const [
                res_vendor,
                res_category
            ] = await Promise.all([
                axios.post(SERVICE.PROJECTVENDOR, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                    project: String(e.value)
                }),
                axios.post(SERVICE.PROJECTCATEGORY, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                    project: String(e.value)
                })
            ]);
            const vendorall = [...res_vendor?.data?.projectvendor.map((d) => (
                {
                    ...d,
                    label: d.name,
                    value: d.name
                }
            ))];
            const categoryall = [...res_category?.data?.projectcategory.map((d) => (
                {
                    ...d,
                    label: d.name,
                    value: d.name
                }
            ))];
            setCategorys(categoryall)
            setVendors(vendorall);
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };
    //category change subcategory filter
    const handleCategorychange = async (e) => {
        try {
            const [
                res_subcategory,
            ] = await Promise.all([
                axios.post(SERVICE.CATEGORYSUBCATEGORY, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                    category: String(e.value),
                    project: String(allFilters.project)
                }),
            ]);
            const subcatall = [...res_subcategory?.data?.catsubtime.map((d) => (
                {
                    ...d,
                    label: d.subcategory,
                    value: d.subcategory
                }
            ))];
            const queueall = [...res_subcategory?.data?.queueCheck.map((d) => (
                {
                    ...d,
                    label: d.queuename,
                    value: d.queuename
                }
            ))];
            setSubCategorys(subcatall)
            setQueues(queueall);
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };
    //branch change unit filter
    const handleChangeBranch = async (e) => {
        if (e.value == "NOT FOR US" || e.value == "OTHER-NFU" || e.value == "OTHER" || e.value == "WEB-NFU") {
            setUnits([...dropdowndata])
        } else {
            try {
                let res_unit = await axios.post(SERVICE.BRANCHUNIT, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                    branch: String(e.value)
                });
                const unitsall = [...dropdowndata, ...res_unit?.data?.branchunits.map((d) => (
                    {
                        ...d,
                        label: d.name,
                        value: d.name
                    }
                ))];
                setUnits(unitsall)
             } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };
}

    const dropdowndata = [{ label: 'NOT FOR US', value: 'NOT FOR US' }, { label: 'OTHER-NFU', value: 'OTHER-NFU' }, { label: 'OTHER', value: 'OTHER' }, { label: 'WEB-NFU', value: 'WEB-NFU' }]
    const prioritys = [{ label: 'NOT FOR US', value: 'NOT FOR US' }, { label: 'OTHER-NFU', value: 'OTHER-NFU' }, { label: 'OTHER', value: 'OTHER' }, { label: 'WEB-NFU', value: 'WEB-NFU' }, { label: 'Primary', value: 'Primary' }, { label: 'Secondary', value: 'Secondary' }, { label: 'Tertiary', value: 'Tertiary' }]


    //filter options
    const fetchProjectDropdowns = async () => {
        try {
            let res_project = await axios.get(SERVICE.PROJECTMASTER, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            const projall = [...res_project?.data?.projmaster.map((d) => (
                {
                    ...d,
                    label: d.name,
                    value: d.name
                }
            ))];
            setProjects(projall);
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const fetchBranchDropdowns = async () => {
            let res_branch = isAssignBranch?.map(data => ({
                label: data.branch,
                value: data.branch,
              })).filter((item, index, self) => {
                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
              })
            const branchall = [...dropdowndata, ...res_branch];
            setBranchs(branchall);
    };

    // get all units
    const fetchUnits = async (branch) => {
        let res = isAssignBranch?.filter(
            (comp) =>
                branch === comp.branch
          )?.map(data => ({
            label: data.unit,
            value: data.unit,
          })).filter((item, index, self) => {
            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
          })
            setUnitstabledata(res);
    }

    // EXCEL_WORK_ORDER_OTHERallFilter
    //On Submit Filtering Data of Excel Datas
    const OnFilterSubmit = async () => {
        setIsLoader(false)
        setIsBtnSubmit(true)
        try {
            let res_employee = await axios.post(SERVICE.SECONDARY_CONSOLIDATED_WORKORDER_FILTER, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                project: allFilters.project === "Please Select Project" ? "" : allFilters.project,
                vendor: allFilters.vendor === "Please Select Vendor" ? "" : allFilters.vendor,
                category: allFilters.category === "Please Select Category" ? "" : allFilters.category,
                subcategory: allFilters.subcategory === "Please Select Subcategory" ? "" : allFilters.subcategory,
                queue: allFilters.queue === "Please Select Queue" ? "" : allFilters.queue,
                branch: allFilters.branch === "Please Select Branch" ? "" : allFilters.branch,
                unit: allFilters.unit === "Please Select Unit" ? "" : allFilters.unit,
                team: allFilters.team === "Please Select Team" ? "" : allFilters.team,
                resperson: allFilters.responsibleperson === "Please Select ResponsiblePerson" ? "" : allFilters.responsibleperson,
                prioritystatus: allFilters.sector === "Please Select Sector" ? "" : allFilters.sector
            });

            setTableDataSecondary(res_employee?.data?.resulted);
            setIsLoader(true)
            setIsBtnSubmit(false)
        } catch (err) {setIsLoader(true);setIsBtnSubmit(false);handleApiError(err, setShowAlert, handleClickOpenerr);}

    }

    const handleSubmit = (e) => {
        setIsLoader(false)
        e.preventDefault();
        if (allFilters.project === "Please Select Project" && allFilters.vendor === "Please Select Vendor" &&
            allFilters.category === "Please Select Category" && allFilters.subcategory === "Please Select Subcategory" &&
            allFilters.queue === "Please Select Queue" && allFilters.branch === "Please Select Branch" &&
            allFilters.unit === "Please Select Unit" && allFilters.team === "Please Select Team" &&
            allFilters.responsibleperson === "Please Select ResponsiblePerson" && allFilters.sector === "Please Select Sector") {
            setIsLoader(true)
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Select Atleast One Field"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else {

            OnFilterSubmit();
        }
    }

    const handleClear = (e) => {
        setAllFilters({
            project: "Please Select Project",
            vendor: "Please Select Vendor",
            category: "Please Select Category",
            subcategory: "Please Select Subcategory",
            queue: "Please Select Queue",
            branch: "Please Select Branch",
            unit: "Please Select Unit",
            team: "Please Select Team",
            responsibleperson: "Please Select ResponsiblePerson",
            sector: "Please Select Sector"
        });
        setVendors([])
        setCategorys([])
        setSubCategorys([])
        setQueues([])
        setNewcheckBranch("")
        setNewcheckUnit("")

        HandleTablesubmit(e);
        setShowAlert(
            <>
                <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Cleared Successfully"}</p>
            </>
        );
        handleClickOpenerr();
    }

    const fetchUsers = async() =>{
        setUsers(allUsersData);
    }
    useEffect(
        () => {
            fetchProjectDropdowns();
            fetchBranchDropdowns();
            fetchUsers();
        }, []);
    //datatable....

    const [itemsSecondary, setItemsSecondary] = useState([]);

    const addSerialNumberSecondary = () => {

        const itemsWithSerialNumberSecondary = tableDataSecondary?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
        setItemsSecondary(itemsWithSerialNumberSecondary);
    }

    useEffect(() => {
        addSerialNumberSecondary();
    }, [tableDataSecondary]);


    //secondary table
    //table sorting
    const [sortingSecondary, setSortingSecondary] = useState({ column: '', direction: '' });

    const handleSortingSecondary = (column) => {
        const direction = sortingSecondary.column === column && sortingSecondary.direction === 'asc' ? 'desc' : 'asc';
        setSortingSecondary({ column, direction });
    };

    const sortedDataSecondary = itemsSecondary.sort((a, b) => {
        if (sortingSecondary.direction === 'asc') {
            return a[sortingSecondary.column] > b[sortingSecondary.column] ? 1 : -1;
        } else if (sortingSecondary.direction === 'desc') {
            return a[sortingSecondary.column] < b[sortingSecondary.column] ? 1 : -1;
        }
        return 0;
    });

    const renderSortingIconSecondary = (column) => {
        if (sortingSecondary.column !== column) {
            return <>
                <Box sx={{ color: '#bbb6b6' }}>
                    <Grid sx={{ height: '6px', fontSize: '1.6rem' }}>
                        <ArrowDropUpOutlinedIcon />
                    </Grid>
                    <Grid sx={{ height: '6px', fontSize: '1.6rem' }}>
                        <ArrowDropDownOutlinedIcon />
                    </Grid>
                </Box>
            </>;
        } else if (sortingSecondary.direction === 'asc') {
            return <>
                <Box >
                    <Grid sx={{ height: '6px' }}>
                        <ArrowDropUpOutlinedIcon style={{ color: 'black', fontSize: '1.6rem' }} />
                    </Grid>
                    <Grid sx={{ height: '6px' }}>
                        <ArrowDropDownOutlinedIcon style={{ color: '#bbb6b6', fontSize: '1.6rem' }} />
                    </Grid>
                </Box>
            </>;
        } else {
            return <>
                <Box >
                    <Grid sx={{ height: '6px' }}>
                        <ArrowDropUpOutlinedIcon style={{ color: '#bbb6b6', fontSize: '1.6rem' }} />
                    </Grid>
                    <Grid sx={{ height: '6px' }}>
                        <ArrowDropDownOutlinedIcon style={{ color: 'black', fontSize: '1.6rem' }} />
                    </Grid>
                </Box>
            </>;
        }
    };
    //Datatable
    const handlePageChangeSecondary = (newPage) => {
        setPageSecondary(newPage);
    };

    const handlePageSizeChangeSecondary = (event) => {
        setPageSizeSecondary(Number(event.target.value));
        setPageSecondary(1);
    };


    //datatable....
    const [searchQuerySecondary, setSearchQuerySecondary] = useState("");
    const handleSearchChangeSecondary = (event) => {
        setSearchQuerySecondary(event.target.value);
    };


    // Split the search query into individual terms
    const searchOverAllTerms = searchQuerySecondary.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatasSecondary = itemsSecondary?.filter((item) => {
        return searchOverAllTerms.every((term) =>
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

    const columnDataTable = [

        { field: "priority", headerName: "Priority", flex: 0, width: 75, hide: !columnVisibility.priority, headerClassName: "bold-header" },

        { field: "customer", headerName: "Customer", flex: 0, width: 100, hide: !columnVisibility.customer, headerClassName: "bold-header" },
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

        { field: "count", headerName: "Count", flex: 0, width: 75, hide: !columnVisibility.count, headerClassName: "bold-header" },
        { field: "tat", headerName: "TAT Expiration", flex: 0, width: 150, hide: !columnVisibility.tat, headerClassName: "bold-header" },
        { field: "created", headerName: "Created", flex: 0, width: 100, hide: !columnVisibility.created, headerClassName: "bold-header" },
        { field: "branch", headerName: "Branch", flex: 0, width: 100, hide: !columnVisibility.branch, headerClassName: "bold-header" },
        { field: "resperson", headerName: "Responsible Person", flex: 0, width: 300, hide: !columnVisibility.resperson, headerClassName: "bold-header" },
        { field: "category", headerName: "Category", flex: 0, width: 300, hide: !columnVisibility.category, headerClassName: "bold-header" },
        { field: "subcategory", headerName: "Subcategory", flex: 0, width: 150, hide: !columnVisibility.subcategory, headerClassName: "bold-header" },
        { field: "queue", headerName: "Queue", flex: 0, width: 340, hide: !columnVisibility.queue, headerClassName: "bold-header" },
        { field: "serialNumber", headerName: "SNo", flex: 0, width: 50, hide: !columnVisibility.serialNumber, headerClassName: "bold-header" },
        { field: "project", headerName: "Project", flex: 0, width: 200, hide: !columnVisibility.project, headerClassName: "bold-header" },
        { field: "vendor", headerName: "Vendor", flex: 0, width: 150, hide: !columnVisibility.vendor, headerClassName: "bold-header" },
        { field: "unit", headerName: "Unit", flex: 0, width: 150, hide: !columnVisibility.unit, headerClassName: "bold-header" },
        { field: "team", headerName: " Team", flex: 0, width: 100, hide: !columnVisibility.team, headerClassName: "bold-header" },
        { field: "prioritystatus", headerName: "Sector", flex: 0, width: 100, hide: !columnVisibility.prioritystatus, headerClassName: "bold-header" },
        { field: "points", headerName: "Points", flex: 0, width: 100, hide: !columnVisibility.points, headerClassName: "bold-header" },
        { field: "time", headerName: "Time", flex: 0, width: 100, hide: !columnVisibility.time, headerClassName: "bold-header" },
        { field: "level", headerName: "Level", flex: 0, width: 100, hide: !columnVisibility.level, headerClassName: "bold-header" },
        // { field: "control", headerName: "Control", flex: 0, width: 100, hide: !columnVisibility.control, headerClassName: "bold-header" },
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
            level: item.level ,
            // control: item.control,
            prioritystatus: item.prioritystatus,
            points: item.points == 'Unallotted' ? 'Unallotted' : Number(item.points),
            time: item.time == 'Unallotted' ? 'Unallotted' : item.time,
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

    // Function to filter columns based on search query
    const filteredColumns = columnDataTable.filter((column) =>
        column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase())
    );

    // JSX for the "Manage Columns" popover content
    const manageColumnsContent = (
        <Box sx={{ padding: "10px", minWidth: "325px", '& .MuiDialogContent-root': { padding: '10px 0' } }}>
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
            <Box sx={{ position: 'relative', margin: '10px', }}>
                <TextField
                    label="Find column"
                    variant="standard"
                    fullWidth
                    value={searchQueryManage}
                    onChange={(e) => setSearchQueryManage(e.target.value)}
                    sx={{ marginBottom: 5, position: 'absolute', }}
                />
            </Box><br /><br />
            <DialogContent sx={{ minWidth: 'auto', height: '200px', position: 'relative', }}>
                <List sx={{ overflow: 'auto', height: '100%', }}>
                    <ListItemText sx={{ display: 'flex', marginLeft: '15px' }}
                        primary={
                            <Switch sx={{ marginTop: "0px", }} size="small"
                                checked={columnVisibility.checkboxSelection}
                                onChange={() => toggleColumnVisibility('checkboxSelection')}
                            />
                        }
                        secondary={<Typography variant="subtitle1" sx={{ fontSize: "15px", fontWeight: '400' }}>Checkbox Selection</Typography>}
                    />
                    {filteredColumns?.map((column) => (
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
                            sx={{ textTransform: 'none', }}
                            onClick={() => setColumnVisibility({})}
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
            if (!tableDataSecondary?.length) {
                // await fetchSecondaryList();
            }
            // downloadCsvSecondary();
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Primary OverTat');

            // Define the columns
            worksheet.columns = [
                { header: 'SNo', key: 'serialNumber', width: 10 },
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
                { header: "level", field: "level", width: 20  },
                // { header: "control", field: "control", width: 20  },
            ];

            // Add data to the worksheet
            filteredDataSecondary.forEach((row, index) => {
                worksheet.addRow({
                    'SNo': (row.serialNumber),
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
                    "Time": row.time == 'Unallotted' ? 0 : row.time,
                    "Level": row.level,
                    // "Control": row.control,
                });
            });

            // Define a hyperlink style
            const hyperlinkStyle = {
                font: { color: { argb: '0000FF' }, underline: true },
            };

            // Add hyperlinks to the worksheet
            filteredDataSecondary?.forEach((row, index) => {

                const cell = worksheet.getCell(`C${index + 2}`); // Process Hyperlink
                const link = {
                    text: row.process,
                    hyperlink: row.hyperlink,
                    tooltip: 'Click to open process',
                };
                cell.value = row?.hyperlink?.startsWith("http") ? link : "";
                cell.style = hyperlinkStyle;

                // Set other cell values for additional columns
                worksheet.getCell(`A${index + 2}`).value = (row.serialNumber);
                worksheet.getCell(`B${index + 2}`).value = parseInt(row.priority);
                worksheet.getCell(`C${index + 2}`).value = row.customer;
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
                worksheet.getCell(`S${index + 2}`).value = row.time == 'Unallotted' ? 0 : row.time;
                worksheet.getCell(`T${index + 2}`).value = row.level;
                // worksheet.getCell(`U${index + 2}`).value = row.control;
            });

            // Create a buffer from the workbook
            const buffer = await workbook.xlsx.writeBuffer();

            // Create a Blob object and initiate the download
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Secondary_Hierarchy_WorkOrder.xlsx'; // File name
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
        const headers = ['SNo','Priority', 'Customer', 'Process Hyperlink', 'Count', 'Tat Expiration', 'Created',
            'Branch', 'Responsible Person', 'Category Name', 'Subcategory Name', 'Queue Name', 'S.No', 'Project Name', 'Vendor Name', 'Unit', 'Team', 'Sector', 'Points', 'Time' ,'Level',
        ];
        csvData.push(headers);

        // Add data rows
        filteredDataSecondary.forEach((row, index) => {
            const rowData = [
                row.serialNumber,
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
                row.level,
                // row.control,
            ];
            csvData.push(rowData);
        });

        // Convert the CSV data to a string
        const csvString = Papa.unparse(csvData);

        // Create a Blob object and initiate the download
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8' });
        saveAs(blob, 'Secondary_Hierarchy_WorkOrder.csv'); // Specify the filename with .csv extension
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
        { title: "level", field: "level" },
        // { title: "control", field: "control" },

    ]

    const downloadPdfSecondary = () => {
        const doc = new jsPDF({
            orientation: 'landscape', // Set the orientation to landscape
        });
        doc.autoTable({
            theme: "grid",
            styles: {
                fontSize: 4,
                cellWidth: 'auto'
            },
            columns: columns.map((col) => ({ ...col, dataKey: col.field })),
            body: filteredDataSecondary,
        });
        doc.save("Secondary_Hierarchy_WorkOrder.pdf");
    };

    // get particular columns for export excel
    const getexcelDatasSecondary = async () => {


        var data = tableDataSecondary.map((t, index) => ({
            "Sno": index + 1,
            "project Name": t.project,
            "Vendor Name": t.vendor,
            "Priority": t.priority,
            "Customer": t.customer,
            "Process": t.process,
            "Count": t.count,
            "Tat": t.tat,
            "created": t.created,
            "Category Name": t.category,
            "Subcategory Name": t.subcategory,
            "Queue Name": t.queue,
            "Branch": t.branch,
            "unit": t.unit,
            "team": t.team,
            "resperson": t.resperson,
            "sector": t.prioritystatus,
            "Points": t.points,
            "Time": t.time,
            "Level": t.level,
            // "Control": t.control,
        }));
        setExcelDataSecondary(data);
    }

    //print...Secondary
    const componentRefSecondary = useRef();
    const handleprintSecondary = useReactToPrint({
        content: () => componentRefSecondary.current,
        documentTitle: 'Secondary_Hierarchy_WorkOrder',
        pageStyle: 'print'
    });

    useEffect(() => {
        getexcelDatasSecondary();
    }, [tableDataSecondary])

    //image


    const handleCaptureImage = () => {
        // Find the table by its ID
        const table = document.getElementById("excelcanvastable");

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
            link.download = "Secondary_Hierarchy_WorkOrder.png";
            link.click();
        });
    };


    const modeDropDowns = [{label:'My Hierarchy List' , value:'myhierarchy'} , {label:'All Hierarchy List' , value:'allhierarchy'} , {label:'My + All Hierarchy List' , value:"myallhierarchy"}];
    const sectorDropDowns = [{label:'Primary' , value:'Primary'} , {label:'Secondary' , value:'Secondary'} , {label:'Tertiary' , value:"Tertiary"}  , {label:'All' , value:"all"}]
const[modeselection , setModeSelection] = useState({label:"My Hierarchy List" , value:"myhierarchy"})
const[sectorSelection , setSectorSelection] = useState({label:"Primary" , value: "Primary" })


const HandleTablesubmit = (e) => 
{
    e?.preventDefault();
        TableFilter();
}



const TableFilter = async () => {
    setIsBtn(true)
    setIsLoader(false)
    try {
        let res_employee = await axios.post(SERVICE.SECONDARY_CONSOLIDATED_HIERARCHY_FILTER, {
            headers: {
                'Authorization': `Bearer ${auth.APIToken}`
            },
            hierachy : modeselection.value,
            sector: sectorSelection.value,
            username : isUserRoleAccess.companyname,
            team: isUserRoleAccess.team
        });
        setTableDataSecondary(res_employee.data.resultAccessFilter);
        setIsBtn(false)
        setIsLoader(true)
    } catch (err) {setIsBtn(false);setIsLoader(true);handleApiError(err, setShowAlert, handleClickOpenerr);}
}



//Default Hierarchy
const FilterSubmitDefault = async ()=>{
    try {
        let res_employee = await axios.post(SERVICE.SECONDARY_DEFAULT_HIERARCHY_FILTER, {
            headers: {
                'Authorization': `Bearer ${auth.APIToken}`
            },
            username : isUserRoleAccess.companyname,
            sector:"Primary"
           
        });
        setTableDataSecondary(res_employee?.data?.resulted);
        setIsLoader(true);
    } catch (err) {setIsLoader(true);handleApiError(err, setShowAlert, handleClickOpenerr);}
}


useEffect(() => {
    FilterSubmitDefault();
}, [])


    return (
        <>
            <Headtitle title={'Secondary Hierarchy WorkOrder List'} />
            {isUserRoleCompare?.includes("lsecondaryhierarchyworkorderlist")
                && (
                    <>
                        <Box sx={userStyle.container}>
                            <Typography sx={userStyle.SubHeaderText}> Secondary Hierarchy WorkOrder List</Typography>
                            <br /><br />

                            {/* <Grid container spacing={2}>
                                <Grid item lg={3} md={3} xs={12} sm={6}>
                                    <Typography>Project</Typography>
                                    <FormControl size="small" fullWidth>
                                        <Selects
                                            options={projects}
                                            styles={colourStyles}
                                            value={{ label: allFilters.project, value: allFilters.project }}
                                            onChange={(e) => { handleProjectChange(e); setAllFilters({ ...allFilters, project: e.value, vendor: "Please Select Vendor", category: "Please Select Category", subcategory: "Please Select Subcategory", queue: "Please Select Queue" }) }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item lg={3} md={3} xs={12} sm={6}>
                                    <Typography>Vendor</Typography>
                                    <FormControl size="small" fullWidth>
                                        <Selects
                                            options={vendors}
                                            styles={colourStyles}
                                            value={{ label: allFilters.vendor, value: allFilters.vendor }}
                                            onChange={(e) => setAllFilters({ ...allFilters, vendor: e.value })}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item lg={3} md={3} xs={12} sm={6}>
                                    <Typography>Category</Typography>
                                    <FormControl size="small" fullWidth>
                                        <Selects
                                            options={categorys}
                                            styles={colourStyles}
                                            value={{ label: allFilters.category, value: allFilters.category }}
                                            onChange={(e) => { setAllFilters({ ...allFilters, category: e.value }); handleCategorychange(e); }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item lg={3} md={3} xs={12} sm={6}>
                                    <Typography>Subcategory</Typography>
                                    <FormControl size="small" fullWidth>
                                        <Selects
                                            options={subcategorys}
                                            styles={colourStyles}
                                            value={{ label: allFilters.subcategory, value: allFilters.subcategory }}
                                            onChange={(e) => { setAllFilters({ ...allFilters, subcategory: e.value }); }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item lg={3} md={3} xs={12} sm={6}>
                                    <Typography>Queue</Typography>
                                    <FormControl size="small" fullWidth>
                                        <Selects
                                            options={queues}
                                            styles={colourStyles}
                                            value={{ label: allFilters.queue, value: allFilters.queue }}
                                            onChange={(e) => { setAllFilters({ ...allFilters, queue: e.value }); }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item lg={3} md={3} xs={12} sm={6}>
                                    <Typography>Branch</Typography>
                                    <FormControl size="small" fullWidth>
                                        <Selects
                                            options={branchs}
                                            styles={colourStyles}
                                            value={{ label: allFilters.branch, value: allFilters.branch }}
                                            onChange={(e) => { setNewcheckBranch(e.value); fetchUnits(e.value); setNewcheckUnit("Select Unit"); handleChangeBranch(e); setAllFilters({ ...allFilters, branch: e.value, unit: "Please Select Unit", team: "Please Select Team", responsibleperson: "Please Select ResponsiblePerson" }) }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item lg={3} md={3} xs={12} sm={6}>
                                    <Typography>Unit</Typography>
                                    <FormControl size="small" fullWidth>
                                        <Selects
                                            options={[...dropdowndata, ...unitstabledata]}
                                            styles={colourStyles}
                                            value={{ label: allFilters.unit, value: allFilters.unit }}
                                            onChange={(e) => {
                                                setNewcheckUnit(e.value); setNewcheckTeam("Select Team");
                                                setAllFilters({ ...allFilters, unit: e.value, team: "Please Select Team", responsibleperson: "Please Select ResponsiblePerson" })
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item lg={3} md={3} xs={12} sm={6}>
                                    <Typography>Team</Typography>
                                    <FormControl size="small" fullWidth>
                                        <Selects
                                            options={[...dropdowndata, ...(allTeam
                                                .filter(team => team.unit === newcheckunit && team.branch === newcheckbranch)
                                                .map(sub => ({
                                                    ...sub,
                                                    label: sub.teamname,
                                                    value: sub.teamname
                                                }
                                                )))]
                                            }
                                            styles={colourStyles}
                                            value={{ label: allFilters.team, value: allFilters.team }}
                                            onChange={(e) => { setAllFilters({ ...allFilters, team: e.value }) }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item lg={3} md={3} xs={12} sm={6}>
                                    <Typography>Responsibleperson</Typography>
                                    <FormControl size="small" fullWidth>
                                        <Selects
                                            options={[...dropdowndata, ...(users
                                                .filter(user => user.unit === newcheckunit && user.branch === newcheckbranch && user.team === allFilters.team)
                                                .map(sub => ({
                                                    ...sub,
                                                    label: sub.companyname,
                                                    value: sub.companyname
                                                }
                                                )))]}
                                            styles={colourStyles}
                                            value={{ label: allFilters.responsibleperson, value: allFilters.responsibleperson }}
                                            onChange={(e) => { setAllFilters({ ...allFilters, responsibleperson: e.value }) }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item lg={3} md={3} xs={12} sm={6}>
                                    <Typography>Sector</Typography>
                                    <FormControl size="small" fullWidth>
                                        <Selects
                                            options={[...dropdowndata, ...[{ label: 'Primary', value: 'Primary' }, { label: 'Secondary', value: 'Secondary' }, { label: 'Tertiary', value: 'Tertiary' }]]}
                                            styles={colourStyles}
                                            value={{ label: allFilters.sector, value: allFilters.sector }}
                                            onChange={(e) => { setAllFilters({ ...allFilters, sector: e.value }) }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item lg={6} md={3} xs={12} sm={6}>
                                </Grid>

                                <Grid item lg={3} md={3} xs={12} sm={6}>
                                    <LoadingButton loading={isBtnSubmit} variant="contained" onClick={(e) => handleSubmit(e)} >FILTER</LoadingButton>
                                </Grid>
                                <Grid item lg={3} md={3} xs={12} sm={6}>
                                    <Button sx={userStyle.btncancel} onClick={handleClear}>CLEAR</Button>
                                </Grid>
                            </Grid><br></br>
                            <br></br> */}
                            <br></br>
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
                                        <MenuItem value={(tableDataSecondary?.length)}>All</MenuItem>
                                    </Select>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'end' }}>
                                    <Grid >
                                        {isUserRoleCompare?.includes("csvsecondaryhierarchyworkorderlist")
                                            && (
                                                <>
                                                    <Button sx={userStyle.buttongrp} onClick={downloadCsvSecondary}>&ensp;<FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                                </>
                                            )}
                                        {isUserRoleCompare?.includes("excelsecondaryhierarchyworkorderlist")
                                            && (
                                                <>
                                                    <Button sx={userStyle.buttongrp} onClick={downloadExcelSecondary}>&ensp;<FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                                </>
                                            )}
                                        {isUserRoleCompare?.includes("printsecondaryhierarchyworkorderlist")
                                            && (
                                                <>
                                                    <Button sx={userStyle.buttongrp} onClick={handleprintSecondary}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                                </>
                                            )}
                                        {isUserRoleCompare?.includes("pdfsecondaryhierarchyworkorderlist")
                                            && (
                                                <>
                                                    <Button sx={userStyle.buttongrp} onClick={() => downloadPdfSecondary()}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                                </>)}
                                        {isUserRoleCompare?.includes("imagesecondaryhierarchyworkorderlist")
                                            && (
                                                <>
                                                    <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}> <ImageIcon sx={{ fontSize: "15px" }} />  &ensp;image&ensp; </Button>
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
                                            value={searchQuerySecondary}
                                            onChange={handleSearchChangeSecondary}
                                        />
                                    </FormControl>
                                </Box>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                            <Grid item lg={1.5} md={1.5} xs={12} sm={6}>
                            <Button sx={userStyle.buttongrp} onClick={() => { handleShowAllColumns(); setColumnVisibility(initialColumnVisibility) }}>Show All Columns</Button>
                            </Grid>
                            <Grid item lg={1.5} md={1} xs={12} sm={6}>
                            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>Manage Columns</Button><br /><br />
                            </Grid>
                            <Grid item lg={2} md={2.5} xs={12} sm={6}>
                            <Selects
                                            options={modeDropDowns}
                                            styles={colourStyles}
                                            value={{ label: modeselection.label, value: modeselection.value }}
                                            onChange={(e) => setModeSelection(e)}
                                        />
                            </Grid>
                            <Grid item lg={2} md={2.5} xs={12} sm={6}>
                            <Selects
                                            options={sectorDropDowns}
                                            styles={colourStyles}
                                            value={{ label: sectorSelection.label, value: sectorSelection.value }}
                                            onChange={(e) => setSectorSelection(e)}
                                        />
                            </Grid>
                            <Grid item lg={3} md={2} xs={12} sm={6}>
<LoadingButton loading={isBtn} variant="contained" onClick={(e)=>HandleTablesubmit(e)}>Filter</LoadingButton>
                            </Grid>


                            </Grid>
                            {!isLoader ?
                                <>
                                    <Box style={{ display: 'flex', justifyContent: 'center' }}>
                                        <FacebookCircularProgress />
                                    </Box>
                                </> :
                                <>
                                    <Box style={{ width: '100%', overflowY: 'hidden', }} >
                                        <StyledDataGrid ref={gridRef}
                                            rows={rowDataTable}
                                            columns={columnDataTable.filter((column) => columnVisibility[column.field])}
                                            autoHeight={true}
                                            density="compact"
                                            hideFooter
                                            checkboxSelection={columnVisibility.checkboxSelection}
                                            getRowClassName={getRowClassNameAll}
                                            disableRowSelectionOnClick
                                            unstable_cellSelection
                                            onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
                                            unstable_ignoreValueFormatterDuringExport
                                        />
                                    </Box>
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
            <br />
            {/* Manage Column */}
            < Popover
                id={id}
                open={isManageColumnsOpen}
                anchorEl={anchorEl}
                onClose={handleCloseManageColumns}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }
                }
            >
                {manageColumnsContent}
            </Popover >
            {/* print layout Secondary */}
            <TableContainer component={Paper} sx={userStyle.printcls} >
                <Table
                    aria-label="simple table"
                    id="excel"
                    ref={componentRefSecondary}
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
                            <TableCell>Level</TableCell>
                            {/* <TableCell>Control</TableCell> */}

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredDataSecondary &&
                            (filteredDataSecondary?.map((row, index) => (
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
                                    <TableCell>{row.level}</TableCell>
                                    {/* <TableCell>{row.control}</TableCell> */}
                                </TableRow>
                            )))}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* print layout End */}
            <TableContainer component={Paper}
                style={{
                    display: canvasState === false ? 'none' : 'block',
                }}
            >
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
                            <TableCell>Level</TableCell>
                            {/* <TableCell>Control</TableCell> */}
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
                                        <TableCell>{row.level}</TableCell>
                                    {/* <TableCell>{row.control}</TableCell> */}
                                    </TableRow>
                                )
                            }))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* ALERT DIALOG */}
            < Box >
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
            </Box >
        </>
    );
}
export default Seondaryworkorder;