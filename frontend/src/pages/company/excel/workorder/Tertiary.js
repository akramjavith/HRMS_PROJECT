import React, { useState, useEffect, useRef, useContext } from "react";
import {
    Box, Typography, OutlinedInput, Select, MenuItem, Dialog, TableBody, TableCell, TableRow, DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead, TableContainer, Button,
    List, ListItem, ListItemText, Popover, TextField, IconButton,
} from "@mui/material";
import { userStyle, colourStyles } from "../../../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
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
import { ExportXL, ExportCSV } from "../../../../components/Export";
import { useReactToPrint } from "react-to-print";
import CircularProgress, { circularProgressClasses, } from '@mui/material/CircularProgress';
import ExcelJS from 'exceljs';
import { saveAs } from "file-saver";
import Papa from "papaparse";
import TertiaryConsolidated from "./Tertiaryconsolidated";
import Switch from '@mui/material/Switch';
import CloseIcon from '@mui/icons-material/Close';
import html2canvas from 'html2canvas';
import ImageIcon from '@mui/icons-material/Image';
import { UserRoleAccessContext } from "../../../../context/Appcontext";
import Pagination from '../../../../components/Pagination';

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

const Tertiaryworkorder = () => {

    const gridRef = useRef(null);

    const { isUserRoleCompare, isAssignBranch, allTeam, allUsersData } = useContext(UserRoleAccessContext);
    const [totalProjects, setTotalProjects] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoader, setIsLoader] = useState(false);     //filter fields
    const [updateComp, setUpdateComp] = useState('Change');     //filter fields
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
    const [unitstabledata, setUnitstabledata] = useState([]);
    const [newcheckunit, setNewcheckUnit] = useState("Select Unit");
    const [newcheckteam, setNewcheckTeam] = useState("Select Team");
    const [users, setUsers] = useState([]);

    //Datatable
    const [pageTertiary, setPageTertiary] = useState(1);
    const [pageSizeTertiary, setPageSizeTertiary] = useState(10);


    const { auth } = useContext(AuthContext);

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const handleClickOpenerr = () => { setIsErrorOpen(true); };
    const handleCloseerr = () => { setIsErrorOpen(false); };

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

    };
    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

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

    const [tableDataTertiary, setTableDataTertiary] = useState([]);
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

    //On Submit Filtering Data of Excel Datas
    const OnFilterSubmit = async (e) => {
        setIsLoader(false)
        try {
            let res_employee = await axios.post(SERVICE.TERTIARY_CONSOLIDATED_WORKORDER_FILTER, {
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
                prioritystatus: allFilters.sector === "Please Select Sector" ? "" : allFilters.sector,
                page: pageTertiary,
                pageSize: pageSizeTertiary,
                value: e
            });


            const ans = res_employee?.data?.resulted?.length > 0 ? res_employee?.data?.resulted : []
            const itemsWithSerialNumberSecondary = ans?.map((item, index) => ({ ...item, 
                serialNumber: (pageTertiary - 1) * pageSizeTertiary + index + 1,}));

            setTotalProjects(ans?.length > 0 ? res_employee?.data?.totalProjects : 0);
            setTotalPages(ans?.length > 0 ? res_employee?.data?.totalPages : 0);
            setPageSizeTertiary((data) => { return ans?.length > 0 ? data : 10 });
            setPageTertiary((data) => { return ans?.length > 0 ? data : 1 });
            setTableDataTertiary(itemsWithSerialNumberSecondary);
            setIsLoader(true)
        } catch (err) {setIsLoader(true);handleApiError(err, setShowAlert, handleClickOpenerr);}

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

            OnFilterSubmit("true");
        }
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
         OnFilterSubmit("cleared")
         setShowAlert(
            <>
                <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Cleared Successfully"}</p>
            </>
        );
        handleClickOpenerr();
    }
    const fetchUsers = async () =>{
        setUsers(allUsersData);
    }
    useEffect(
        () => {
            fetchProjectDropdowns();
            fetchBranchDropdowns();
            fetchUsers();
        }, []);

    useEffect(() => {
         OnFilterSubmit("false")
    }, [pageSizeTertiary , pageTertiary])
    useEffect(() => {
         OnFilterSubmit("false")
    }, [updateComp])



    //Tertiary table
    //table sorting
    const [sortingTertiary, setSortingTertiary] = useState({ column: '', direction: '' });

    //Datatable
    const handlePageChangeTertiary = (newPage) => {
        setPageTertiary(newPage);
    };

    const handlePageSizeChangeTertiary = (event) => {
        setPageSizeTertiary(Number(event.target.value));
        setPageTertiary(1);
    };


    //datatable....
    const [searchQueryTertiary, setSearchQueryTertiary] = useState("");
    const handleSearchChangeTertiary = (event) => {
        setSearchQueryTertiary(event.target.value);
    };
    
    // Split the search query into individual terms
    const searchOverAllTerms = searchQueryTertiary.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatasTertiary = tableDataTertiary?.filter((item) => {
        return searchOverAllTerms.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
        );
    });
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



    const totalcount = filteredDatasTertiary && (
        filteredDatasTertiary.forEach((item) => {
            overallCount += Number(item.count);
        })
    );


    const columnDataTable = [

        { field: "priority", headerName: "Priority", flex: 0, width: 75, hide: !columnVisibility.priority },

        { field: "customer", headerName: "Customer", flex: 0, width: 100, hide: !columnVisibility.customer },
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

        { field: "count", headerName: "Count", flex: 0, width: 75, hide: !columnVisibility.count },
        { field: "tat", headerName: "TAT Expiration", flex: 0, width: 150, hide: !columnVisibility.tat },
        { field: "created", headerName: "Created", flex: 0, width: 100, hide: !columnVisibility.created },
        { field: "branch", headerName: "Branch", flex: 0, width: 100, hide: !columnVisibility.branch },
        { field: "resperson", headerName: "Responsible Person", flex: 0, width: 300, hide: !columnVisibility.resperson },
        { field: "category", headerName: "Category", flex: 0, width: 300, hide: !columnVisibility.category },
        { field: "subcategory", headerName: "Subcategory", flex: 0, width: 150, hide: !columnVisibility.subcategory },
        { field: "queue", headerName: "Queue", flex: 0, width: 340, hide: !columnVisibility.queue },
        { field: "serialNumber", headerName: "SNo", flex: 0, width: 50, hide: !columnVisibility.serialNumber },
        { field: "project", headerName: "Project", flex: 0, width: 200, hide: !columnVisibility.project },
        { field: "vendor", headerName: "Vendor", flex: 0, width: 150, hide: !columnVisibility.vendor },
        { field: "unit", headerName: "Unit", flex: 0, width: 150, hide: !columnVisibility.unit },
        { field: "team", headerName: " Team", flex: 0, width: 100, hide: !columnVisibility.team },
        { field: "prioritystatus", headerName: "Sector", flex: 0, width: 100, hide: !columnVisibility.prioritystatus },
        { field: "points", headerName: "Points", flex: 0, width: 100, hide: !columnVisibility.points },
        { field: "time", headerName: "Time", flex: 0, width: 100, hide: !columnVisibility.time },
    ];

    // Create a row data object for the DataGrid
    const rowDataTable = filteredDatasTertiary.map((item, index) => {
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

    const downloadPdfTertiary = () => {
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
            body: filteredDatasTertiary,
        });
        doc.save("Consolidated_Workorder_Tertiary_List.pdf");
    };


    const fileNameTertiary = "Consolidated_Workorder_Tertiary_List";


    //print...Tertiary
    const componentRefTertiary = useRef();
    const handleprintTertiary = useReactToPrint({
        content: () => componentRefTertiary.current,
        documentTitle: 'Work_Order_Tertiary',
        pageStyle: 'print'
    });



    const [canvasState, setCanvasState] = useState(false)


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
            link.download = "Workorder Tertiary List.png";
            link.click();
        });
    };


    return (
        <>
            <Headtitle title={'WorkOrder List Tertiary'} />
            {isUserRoleCompare?.includes("ltertiaryworkorderlist")
                && (
                    <>
                        <Box sx={userStyle.container}>
                            <Typography sx={userStyle.SubHeaderText}> WorkOrder List Tertiary</Typography>
                            <br /><br />
                            <Grid container spacing={2}>
                                <Grid item lg={3} md={3} xs={12} sm={6}>
                                    <Typography>Project</Typography>
                                    <FormControl size="small" fullWidth>
                                        <Selects
                                            options={projects}
                                            styles={colourStyles}
                                            value={{ label: allFilters.project, value: allFilters.project }}
                                            onChange={(e) => { handleProjectChange(e); setAllFilters({ ...allFilters, project: e.value, 
                                                vendor: "Please Select Vendor", 
                                                category: "Please Select Category", 
                                                subcategory: "Please Select Subcategory", 
                                                queue: "Please Select Queue" })
                                                setSubCategorys([])
                                                setQueues([])
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
                                            onChange={(e) => { setAllFilters({ ...allFilters, category: e.value ,
                                                subcategory: "Please Select Subcategory",
                                                queue: "Please Select Queue" 
                                             }); handleCategorychange(e); }}
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
                                    <Button variant="contained" onClick={(e) => handleSubmit(e)} >Filter</Button>
                                </Grid>
                                <Grid item lg={3} md={3} xs={12} sm={6}>
                                    <Button sx={userStyle.btncancel} onClick={handleClear}>CLEAR</Button>
                                </Grid>
                            </Grid><br></br>
                            <br></br>
                            <br></br>
                            { /* ****** Header Buttons ****** */}
                            <Grid container sx={{ justifyContent: "center" }} >
                                <Grid >
                                    {isUserRoleCompare?.includes("csvtertiaryworkorderlist")
                                        && (
                                            <>
                                                <ExportCSV csvData={filteredDatasTertiary.map((t, index) => ({
                                                    "Sno": index + 1,
                                                    "project Name": t.project,
                                                    "Vendor Name": t.vendor,
                                                    "Priority": parseInt(t.priority),
                                                    "Customer": t.customer,
                                                    "Process": t.process,
                                                    "Count": parseInt(t.count),
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
                                                    "Points": parseFloat(t.points),
                                                    "Time": t.time,
                                                }))} fileName={fileNameTertiary} />
                                            </>)}
                                    {isUserRoleCompare?.includes("exceltertiaryworkorderlist")
                                        && (
                                            <>
                                                <ExportXL csvData={filteredDatasTertiary.map((t, index) => ({
                                                    "Sno": index + 1,
                                                    "project Name": t.project,
                                                    "Vendor Name": t.vendor,
                                                    "Priority": parseInt(t.priority),
                                                    "Customer": t.customer,
                                                    "Process": t.process,
                                                    "Count": parseInt(t.count),
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
                                                    "Points": parseFloat(t.points),
                                                    "Time": t.time,
                                                }))} fileName={fileNameTertiary} />
                                            </>)}
                                    {isUserRoleCompare?.includes("printtertiaryworkorderlist")
                                        && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={handleprintTertiary}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                            </>)}
                                    {isUserRoleCompare?.includes("pdftertiaryworkorderlist")
                                        && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={() => downloadPdfTertiary()}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                            </>)}
                                    {isUserRoleCompare?.includes("imagetertiaryworkorderlist")
                                        && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}> <ImageIcon sx={{ fontSize: "15px" }} />  &ensp;image&ensp; </Button>
                                            </>)}

                                </Grid>
                            </Grid><br />
                            <Grid style={userStyle.dataTablestyle}>
                                <Box>
                                    <label htmlFor="pageSizeSelect">Show entries:</label>
                                    <Select id="pageSizeSelect" defaultValue="" value={pageSizeTertiary} onChange={handlePageSizeChangeTertiary} sx={{ width: "77px" }}>
                                        <MenuItem value={1}>1</MenuItem>
                                        <MenuItem value={5}>5</MenuItem>
                                        <MenuItem value={10}>10</MenuItem>
                                        <MenuItem value={25}>25</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
                                        <MenuItem value={100}>100</MenuItem>
                                    </Select>
                                </Box>
                                <Box>
                                    <FormControl fullWidth size="small" >
                                        <Typography>Search</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={searchQueryTertiary}
                                            onChange={handleSearchChangeTertiary}
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
                            <Button sx={userStyle.buttongrp} onClick={() => { handleShowAllColumns(); setColumnVisibility(initialColumnVisibility) }}>Show All Columns</Button>&ensp;
                            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>Manage Columns</Button><br /><br />

                            {!isLoader ?
                                <>
                                    <Box style={{ display: 'flex', justifyContent: 'center' }}>
                                        <FacebookCircularProgress />
                                    </Box>
                                </>
                                :
                                <>
                                    <Box style={{ width: '100%', overflowY: 'hidden', }}   >
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

                                    <Grid container sx={{ diaplay: 'flex', backgroundColor: '#dcdbdb00', postion: 'sticky', padding: '10px 05px', boxShadow: '0px 0px 2px grey' }}>
                                        <Box>
                                            Total Pages
                                        </Box>&ensp;&ensp;&ensp;
                                        <Box >
                                            <span style={{ fontWeight: 'bold', fontSize: '20px' }} >  Count</span> :<span style={{ fontWeight: 'bold', fontSize: '20px' }} >{overallCount}</span>
                                        </Box>
                                    </Grid>
                                    <br />
                                    <Box>
                                        <Pagination
                                            page={ searchQueryTertiary !== "" ? 1 : pageTertiary}
                                            pageSize={pageSizeTertiary}
                                            totalPages={searchQueryTertiary !== "" ? 1 : totalPages}
                                            onPageChange={handlePageChangeTertiary}
                                            pageItemLength={filteredDatasTertiary?.length}
                                            totalProjects={
                                                searchQueryTertiary !== "" ? filteredDatasTertiary?.length : totalProjects
                                            }
                                        />                     
                                    </Box>
                                    
                                </>
                            }
                            {/* ****** Table End ****** */}
                        </Box>
                    </>
                )}
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
            <br />
            <TertiaryConsolidated comp ={updateComp} setComp = {setUpdateComp} />

            {/* print layout Tertiary */}
            <TableContainer component={Paper} sx={userStyle.printcls} >
                <Table
                    aria-label="simple table"
                    id="excelcanvastable"
                    ref={componentRefTertiary}
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
                        {filteredDatasTertiary &&
                            (filteredDatasTertiary?.map((row, index) => (
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
                        {filteredDatasTertiary &&
                            (filteredDatasTertiary.map((row, index) => {
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
export default Tertiaryworkorder;