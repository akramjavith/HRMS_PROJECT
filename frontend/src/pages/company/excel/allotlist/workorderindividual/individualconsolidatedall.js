import React, { useState, useEffect, useRef, useContext } from "react";
import {
    Box, Typography, OutlinedInput, Select, MenuItem, Dialog, TableBody, TableCell, TableRow,
    DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, TextField, IconButton
} from "@mui/material";
import { userStyle, colourStyles } from "../../../../../pageStyle";
import { FaFileCsv, FaFileExcel, FaPrint, FaFilePdf } from "react-icons/fa";
import Selects from "react-select";
import { SERVICE } from '../../../../../services/Baseservice';
import { handleApiError } from "../../../../../components/Errorhandling";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import axios from "axios";
import jsPDF from "jspdf";
import { DataGrid } from '@mui/x-data-grid';
import { AuthContext, UserRoleAccessContext } from "../../../../../context/Appcontext";
import Headtitle from "../../../../../components/Headtitle";
import { styled } from '@mui/system';
import 'jspdf-autotable';
import { useReactToPrint } from "react-to-print";
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
import LoadingButton from "@mui/lab/LoadingButton";

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

const Consolidatedallworkorder = () => {

    const gridRef = useRef(null);

    const { isUserRoleAccess, isUserRoleCompare, allBranch, isAssignBranch, allTeam, allUsersData } = useContext(UserRoleAccessContext);


    //Datatable
    const [pageOverAll, setPageOverAll] = useState(1);
    const [pageSizeOverAll, setPageSizeOverAll] = useState(10);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [copiedData, setCopiedData] = useState('');
    const [isBtn, setIsBtn] = useState(false);

    //filter fields
    const [newcheckbranch, setNewcheckBranch] = useState("Select Branch");
    const [isLoader, setisLoader] = useState(false);
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
    const [branchs, setBranchs] = useState(isAssignBranch?.map(data => ({
        label: data.branch,
        value: data.branch,
      })).filter((item, index, self) => {
        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
      }));
    const [units, setUnits] = useState([]);
    const [unitstabledata, setUnitstabledata] = useState([]);
    const [newcheckunit, setNewcheckUnit] = useState("Select Unit");
    const [newcheckteam, setNewcheckTeam] = useState("Select Team");
    const [users, setUsers] = useState(allUsersData);
    const [tableDataOthers, setTableDataOthers] = useState([]);

    const { auth } = useContext(AuthContext);

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const handleClickOpenerr = () => {
        setIsBtn(false)
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
        setIsBtn(false)
    };
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
            link.download = "Individual_Consolidated_Workorder_Others_All.png";
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
        }
    };

    const dropdowndata = [{ label: 'NOT FOR US', value: 'NOT FOR US' }, { label: 'OTHER-NFU', value: 'OTHER-NFU' }, { label: 'OTHER', value: 'OTHER' }, { label: 'WEB-NFU', value: 'WEB-NFU' }]

    //filter options
    const fetchProjectDropdowns = async () => {
        try {
            let res_project = await axios.get(SERVICE.PROJECTMASTER, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            const ans = [{ label: "ALL", value: "ALL" }]
            const projall = [...ans, ...res_project?.data?.projmaster.map((d) => (
                {
                    ...d,
                    label: d.name,
                    value: d.name
                }
            ))];
            setProjects(projall);
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };


    // get all units
    const fetchDataOrderOthers = async () => {
        try {
            let res_unit = await axios.get(SERVICE.OTHERWORKORDERALL_LIST, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
            setTableDataOthers(res_unit?.data?.result);
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    }

    // CONSWORKORDER_LIST
    // get all units
    const [constworkorder, setconstworkorder] = useState([]);
    const fetchConsWorkOrderList = async () => {
        try {
            let res_unit = await axios.post(SERVICE.CONSOLIDATED_INDIVIDUAL_LIST_ALL, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                companyname: String(isUserRoleAccess.companyname),
                team: String(isUserRoleAccess.team),
            });

            setconstworkorder(res_unit?.data?.finalresult);
            setisLoader(true);
        } catch (err) {setisLoader(true);handleApiError(err, setShowAlert, handleClickOpenerr);}
    }



    // EXCEL_WORK_ORDER_OTHERallFilter
    //On Submit Filtering Data of Excel Datas
    const OnFilterSubmit = async () => {
        setIsBtn(true);
        setisLoader(false);
        try {
            let res_employee = await axios.post(SERVICE.CONSOLIDATED_INDIVIDUAL_LISTFILTER_ALL, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                companyname: String(isUserRoleAccess.companyname),
                team: String(isUserRoleAccess.team),
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

            setconstworkorder(res_employee?.data?.resulted);
            setisLoader(true);
            setIsBtn(false)
        } catch (err) {setisLoader(true);setIsBtn(false);handleApiError(err, setShowAlert, handleClickOpenerr);}

    }

    const handleSubmit = (e) => {
        setisLoader(false);
        e.preventDefault();
        if (allFilters.project === "Please Select Project" && allFilters.vendor === "Please Select Vendor" &&
            allFilters.category === "Please Select Category" && allFilters.subcategory === "Please Select Subcategory" &&
            allFilters.queue === "Please Select Queue" && allFilters.branch === "Please Select Branch" &&
            allFilters.unit === "Please Select Unit" && allFilters.team === "Please Select Team" &&
            allFilters.responsibleperson === "Please Select ResponsiblePerson" && allFilters.sector === "Please Select Sector") {
            setisLoader(true);
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

    const fetchUnits = (branch) =>{
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

    const handleClear = () => {
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
        fetchConsWorkOrderList();

    }


    useEffect(
        () => {
            fetchProjectDropdowns();
            fetchDataOrderOthers();
            fetchConsWorkOrderList();
        }, []);

    const [itemsOverAll, setItemsOverAll] = useState([]);

    const addSerialNumberOverAll = () => {

        const itemsWithSerialNumberOverAll = constworkorder?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
        setItemsOverAll(itemsWithSerialNumberOverAll);
    }

    useEffect(() => {
        addSerialNumberOverAll();
    }, [constworkorder]);

    //table sorting
    const [sortingOverAll, setSortingOverAll] = useState({ column: '', direction: '' });
    //Datatable
    const handlePageChangeOverAll = (newPage) => {
        setPageOverAll(newPage);
    };

    const handlePageSizeChangeOverAll = (event) => {
        setPageSizeOverAll(Number(event.target.value));
        setPageOverAll(1);
    };


    //datatable....
    const [searchQueryOverAll, setSearchQueryOverAll] = useState("");
    const handleSearchChangeOverAll = (event) => {
        setSearchQueryOverAll(event.target.value);
    };
    const filteredDatasOverAll = itemsOverAll?.filter((item) =>
        Object.values(item).some((value) =>
            value !== null &&
            value?.toString()?.toLowerCase()?.startsWith(searchQueryOverAll.toLowerCase())
        )
    );


    const filteredDataOverAll = filteredDatasOverAll?.slice((pageOverAll - 1) * pageSizeOverAll, pageOverAll * pageSizeOverAll);

    const totalPagesOverAll = Math.ceil(filteredDatasOverAll?.length / pageSizeOverAll);

    const visiblePagesOverAll = Math.min(totalPagesOverAll, 3);

    const firstVisiblePageOverAll = Math.max(1, pageOverAll - 1);
    const lastVisiblePageOverAll = Math.min(Math.abs(firstVisiblePageOverAll + visiblePagesOverAll - 1), totalPagesOverAll);
    const pageNumbersOverAll = [];
    const indexOfLastItemOverAll = pageOverAll * pageSizeOverAll;
    const indexOfFirstItemOverAll = indexOfLastItemOverAll - pageSizeOverAll;

    for (let i = firstVisiblePageOverAll; i <= lastVisiblePageOverAll; i++) {
        pageNumbersOverAll.push(i);
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
    const totalcount = filteredDataOverAll && (
        filteredDataOverAll.forEach((item) => {
            overallCount += Number(item.count);
        })
    );
    const columnDataTable = [

        { field: "priority", headerName: <span style={{ fontWeight: 'bold' }}>Priority</span>, flex: 0, width: 75, hide: !columnVisibility.priority },
        { field: "customer", headerName: <span style={{ fontWeight: 'bold' }}>Customer</span>, flex: 0, width: 100, hide: !columnVisibility.customer },
        {
            field: "hyperlink",
            headerName: "Process ",
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
    const rowDataTable = filteredDataOverAll.map((item, index) => {
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
    
    const handleShowAllColumns = () => {
        const updatedVisibility = { ...columnVisibility };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibility(updatedVisibility);
    };

    const filteredColumns = columnDataTable?.filter((column) => {
        if (column.field === 'checkboxSelection') {
            return true;
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
            if (!constworkorder?.length) {
                await fetchConsWorkOrderList();
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
            filteredDataOverAll.forEach((row, index) => {
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
            filteredDataOverAll.forEach((row, index) => {

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
            a.download = 'Individual_Consolidated_Workorder_Others_All.xlsx'; // File name
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
        filteredDataOverAll.forEach((row, index) => {
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
        saveAs(blob, 'Individual_Consolidated_Workorder_Others_All.csv'); // Specify the filename with .csv extension
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

    const downloadPdfOverAll = () => {
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
            body: filteredDataOverAll,
        });
        doc.save("Individual_Consolidated_Workorder_Others_All.pdf");
    };


    //print...OverAll
    const componentRefOverAll = useRef();
    const handleprintOverAll = useReactToPrint({
        content: () => componentRefOverAll.current,
        documentTitle: 'Individual_Consolidated_Workorder_Others_All',
        pageStyle: 'print'
    });



    return (
        <>
            <Headtitle title={'Work Order'} />
            {isUserRoleCompare?.includes("lconsolidatedallindividualworkorderlist")
                && (
                    <>
                        <Box sx={userStyle.container}>
                            <Typography sx={userStyle.SubHeaderText}>Individual Consolidated WorkOrder All List </Typography>
                            <br /><br />

                            <Grid container spacing={2}>
                                <Grid item lg={3} md={3} xs={12} sm={6}>
                                    <Typography>Project</Typography>
                                    <FormControl size="small" fullWidth>
                                        <Selects
                                            options={projects}
                                            styles={colourStyles}
                                            value={{ label: allFilters.project, value: allFilters.project }}
                                            onChange={(e) => { handleProjectChange(e); setAllFilters({ ...allFilters, 
                                                project: e.value, vendor: "Please Select Vendor", 
                                                category: "Please Select Category",
                                                subcategory: "Please Select Subcategory", 
                                                queue: "Please Select Queue" })
                                            setSubCategorys([])
                                            
                                            }}
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
                                            options={[...dropdowndata,...branchs]}
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
                                            options={[...dropdowndata, ...unitstabledata]
                                            }
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
                                    <LoadingButton loading={isBtn} variant="contained" onClick={(e) => handleSubmit(e)} >Filter</LoadingButton>
                                </Grid>
                                <Grid item lg={3} md={3} xs={12} sm={6}>
                                    <Button sx={userStyle.btncancel} onClick={handleClear}>CLEAR</Button>
                                </Grid>
                            </Grid><br></br>
                            <br></br>
                            <br></br>
                            <Grid style={userStyle.dataTablestyle}>
                                <Box>
                                    <label htmlFor="pageSizeSelect">Show entries:</label>
                                    <Select id="pageSizeSelect" defaultValue="" value={pageSizeOverAll} onChange={handlePageSizeChangeOverAll} sx={{ width: "77px" }}>
                                        <MenuItem value={1}>1</MenuItem>
                                        <MenuItem value={5}>5</MenuItem>
                                        <MenuItem value={10}>10</MenuItem>
                                        <MenuItem value={25}>25</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
                                        <MenuItem value={100}>100</MenuItem>
                                        <MenuItem value={(constworkorder?.length)}>All</MenuItem>
                                    </Select>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'end' }}>
                                    <Grid >

                                        {isUserRoleCompare?.includes("csvconsolidatedallindividualworkorderlist")
                                            && (
                                                <>
                                                    <Button sx={userStyle.buttongrp} onClick={downloadCsvSecondary}>&ensp;<FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                                                </>)}
                                        {isUserRoleCompare?.includes("excelconsolidatedallindividualworkorderlist")
                                            && (
                                                <>
                                                    <Button sx={userStyle.buttongrp} onClick={downloadExcelSecondary}>&ensp;<FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                                </>)}
                                        {isUserRoleCompare?.includes("printconsolidatedallindividualworkorderlist")
                                            && (
                                                <>
                                                    <Button sx={userStyle.buttongrp} onClick={handleprintOverAll}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                                </>)}
                                        {isUserRoleCompare?.includes("pdfconsolidatedallindividualworkorderlist")
                                            && (
                                                <>
                                                    <Button sx={userStyle.buttongrp} onClick={() => downloadPdfOverAll()}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                                </>)}
                                        {isUserRoleCompare?.includes("imageconsolidatedallindividualworkorderlist")
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
                                            value={searchQueryOverAll}
                                            onChange={handleSearchChangeOverAll}
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
                                </> :
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
                                            Showing {filteredDataOverAll.length > 0 ? ((pageOverAll - 1) * pageSizeOverAll) + 1 : 0} to {Math.min(pageOverAll * pageSizeOverAll, filteredDatasOverAll?.length)} of {filteredDatasOverAll?.length} entries
                                        </Box>
                                        <Box>
                                            <Button onClick={() => setPageOverAll(1)} disabled={pageOverAll === 1} sx={userStyle.paginationbtn}>
                                                <FirstPageIcon />
                                            </Button>
                                            <Button onClick={() => handlePageChangeOverAll(pageOverAll - 1)} disabled={pageOverAll === 1} sx={userStyle.paginationbtn}>
                                                <NavigateBeforeIcon />
                                            </Button>
                                            {pageNumbersOverAll?.map((pageNumber) => (
                                                <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChangeOverAll(pageNumber)} className={((pageOverAll)) === pageNumber ? 'active' : ''} disabled={pageOverAll === pageNumber}>
                                                    {pageNumber}
                                                </Button>
                                            ))}
                                            {lastVisiblePageOverAll < totalPagesOverAll && <span>...</span>}
                                            <Button onClick={() => handlePageChangeOverAll(pageOverAll + 1)} disabled={pageOverAll === totalPagesOverAll} sx={userStyle.paginationbtn}>
                                                <NavigateNextIcon />
                                            </Button>
                                            <Button onClick={() => setPageOverAll((totalPagesOverAll))} disabled={pageOverAll === totalPagesOverAll} sx={userStyle.paginationbtn}>
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

            {/* print layout OverAll */}
            <TableContainer component={Paper} sx={userStyle.printcls} >
                <Table
                    aria-label="simple table"
                    id="excel"
                    ref={componentRefOverAll}
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
                        {filteredDataOverAll &&
                            (filteredDataOverAll?.map((row, index) => (
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
                        {filteredDataOverAll &&
                            (filteredDataOverAll.map((row, index) => {
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
export default Consolidatedallworkorder;