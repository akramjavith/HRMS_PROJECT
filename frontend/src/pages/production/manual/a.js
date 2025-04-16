import React, { useState, useCallback, useEffect, useRef, useContext } from 'react';
import { Box, Typography, OutlinedInput, TableBody, TableRow, TableCell, Select, MenuItem, DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton } from '@mui/material';
import { userStyle } from '../../../pageStyle.js';
import { FaPrint, FaFilePdf, FaFileExcel, FaFileCsv } from 'react-icons/fa';
// import StyledDataGrid from "../../../components/TableStyle.js";
import axios from 'axios';
import { SERVICE } from '../../../services/Baseservice.js';
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

const CustomRateField = ({ value, row, column, updateRowData }) => {
    const [rate, setRate] = useState(value); // Local state for input field

    const handleChange = (event) => {
        setRate(event.target.value); // Update local state, not the whole table
    };

    const handleBlur = () => {
        // let otherFieldValue = rate;

        // let fieldName = "mrate";
        // Only update parent state (table data) when input loses focus (onBlur)
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

function UnitrateUnallottedList() {
    const [productionFilter, setProductionFilter] = useState([]);

    const [selectedProject, setSelectedProject] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [selectedSubCategory, setSelectedSubCategory] = useState([]);

    const [searchQuery, setSearchQuery] = useState('');
    const [searchQueryManage, setSearchQueryManage] = useState('');

    const [projectOpt, setProjmasterOpt] = useState([]);
    const [categoryOpt, setCategoryOpt] = useState([]);
    const [subCategoryOpt, setSubCategoryOpt] = useState([]);

    const { isUserRoleCompare, isUserRoleAccess } = useContext(UserRoleAccessContext);
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

    let exportColumnNames = ['Project', 'Category', 'SubCategory', 'Mrate'];
    let exportRowValues = ['project', 'category', 'subcategory', 'mrate'];

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };

    const fetchAllCategory = async (projects) => {
        try {
            let res_vendor = await axios.post(SERVICE.CATEGORYPROD_LIMITED_UNALLOT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                project: projects.map((item) => item.value),
            });

            // Extracting unique categories using a Set
            const uniqueCategories = Array.from(new Set(res_vendor?.data?.categoryprod.map((d) => d.name)));

            // Formatting categories with label and value properties
            const vendorall = uniqueCategories.map((category) => ({
                label: category,
                value: category,
            }));
            setCategoryOpt(vendorall);
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    const fetchAllSubCategory = async (cates) => {
        try {
            let res_vendor = await axios.post(SERVICE.SUBCATEGORYPROD_LIMITED_UNALLOT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                project: selectedProject.map((item) => item.value),
                category: cates.map((item) => item.value),
            });
            // Extracting unique categories using a Set
            const uniqueCategories = Array.from(new Set(res_vendor?.data?.subcategoryprod.map((d) => d.name)));

            // Formatting categories with label and value properties
            const vendorall = uniqueCategories.map((sc) => ({
                label: sc,
                value: sc,
            }));
            setSubCategoryOpt(vendorall);
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    const handleProjectChange = (options) => {
        setSelectedProject(options);
        setSelectedCategory([]);
        fetchAllCategory(options);
    };
    const customValueRendererProject = (valueProject, _categoryname) => {
        return valueProject?.length ? valueProject.map(({ label }) => label)?.join(', ') : 'Please Select Project';
    };

    const handleCategoryChange = (options) => {
        setSelectedCategory(options);
        fetchAllSubCategory(options);
        setSelectedSubCategory([]);
    };
    const customValueRendererCategory = (valueProject, _categoryname) => {
        return valueProject?.length ? valueProject.map(({ label }) => label)?.join(', ') : 'Please Select Category';
    };

    const handleSubCategoryChange = (options) => {
        setSelectedSubCategory(options);
    };
    const customValueRendererSubCategory = (valueProject, _categoryname) => {
        return valueProject?.length ? valueProject.map(({ label }) => label)?.join(', ') : 'Please Select SubCategory';
    };

    const fetchProductionFilterList = async () => {
        try {
            let res_project = await axios.get(SERVICE.UNITRATE_UNALLOTTED_LIST, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            const itemsWithSerialNumber = res_project?.data?.unitrates?.map((item, index) => ({
                ...item,
                serialNumber: index + 1,
                id: item._id,
            }));
            setProductionFilter(itemsWithSerialNumber);
            setRows(itemsWithSerialNumber);
        } catch (err) {
            setSourcecheck(false);
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };
    const fetchProductionFilter = async () => {
        try {
            let res_project = await axios.post(SERVICE.UNITRATE_UNALLOTTED_LIST_FILTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                project: selectedProject.map((item) => item.value),
                category: selectedCategory.map((item) => item.value),
                subcategory: selectedSubCategory.map((item) => item.value),
            });

            const itemsWithSerialNumber = res_project?.data?.unitrates?.map((item, index) => ({
                ...item,
                serialNumber: index + 1,
                id: item._id,
            }));
            setProductionFilter(itemsWithSerialNumber);
            setRows(itemsWithSerialNumber);
            setPage(1);
        } catch (err) {
            setSourcecheck(false);
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    //get all project.
    const fetchProjMaster = async () => {
        try {
            let res_project = await axios.get(SERVICE.PROJECTMASTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            const projectopt = [
                ...res_project?.data?.projmaster.map((item) => ({
                    ...item,
                    label: item.name,
                    value: item.name,
                })),
            ];

            setProjmasterOpt(projectopt);
        } catch (err) {
            setSourcecheck(false);
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    useEffect(() => {
        fetchProjMaster();
        fetchProductionFilterList();
    }, []);

    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, 'Production_Unit_Rate_UnAllot.png');
                });
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
        category: true,
        project: true,
        subcategory: true,
        mrate: true,
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

        setPopupContent('Cleared Successfully');
        setPopupSeverity('success');
        handleClickOpenPopup();
    };

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Unitrate UnAllotted List',
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
        return Object.values(row).some((value) => value.toString().toLowerCase().includes(searchQuery.toLowerCase()));
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

    const handleUpdate = async (data) => {
        console.log(data, 'data');
        if (data.mrate === '') {
            setPopupContentMalert('Please Enter Mrate');
            setPopupSeverityMalert('warning');
            handleClickOpenPopupMalert();
        } else if (Number(data.mrate) === 0) {
            setPopupContentMalert('Please Enter Non Zero Value in Mrate');
            setPopupSeverityMalert('warning');
            handleClickOpenPopupMalert();
        } else {
            try {
                let resCreate = await axios.post(SERVICE.UNITRATE_UNALLOT_SINGLE_UPDATE, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    mrate: String(data.mrate),
                    id: String(data.id),
                    // updatedby: {
                    name: String(isUserRoleAccess.companyname),
                    date: new Date(),
                    // },
                });
                const updatedRows = rows.map((row) => {
                    // If the row id matches, update it with the new data
                    if (row.id === data.id) {
                        return { ...row, isedited: true }; // Update only the mrate or other fields as necessary
                    }
                    return row; // Keep other rows unchanged
                });

                const updatedRemovedRows = updatedRows.filter((row) => row.isedited !== true);
                setRows(updatedRemovedRows);
                setPopupContent('Updated Successfully');
                setPopupSeverity('success');
                handleClickOpenPopup();
            } catch (err) {
                console.log(err, 'err');
            }
        }
    };

    const columns = [
        {
            field: 'checkbox',
            headerName: '',
            headerCheckboxSelection: true,
            checkboxSelection: true,
            flex: 0,
            width: 60,
            hide: !columnVisibility.checkbox,
            // pinned: "left",
        },
        {
            field: 'serialNumber',
            headerName: 'SNo',
            flex: 0,
            width: 70,
            filterable: true,

            hide: !columnVisibility.serialNumber,
            headerClassName: 'bold-header',
        },
        {
            field: 'project',
            headerName: 'Project',
            flex: 0,
            width: 140,
            filterable: true,

            hide: !columnVisibility.project,
            headerClassName: 'bold-header',
        },
        {
            field: 'category',
            headerName: 'Category',
            flex: 0,
            width: 330,
            filterable: true,

            hide: !columnVisibility.category,
            headerClassName: 'bold-header',
        },
        {
            field: 'subcategory',
            headerName: 'Subcategory',
            flex: 0,
            width: 390,
            filterable: true,

            hide: !columnVisibility.subcategory,
            headerClassName: 'bold-header',
        },

        {
            field: 'mrate',
            headerName: 'Mrate',
            flex: 0,
            width: 160,
            filterable: true,

            hide: !columnVisibility.subcategory,
            cellRenderer: (params) =>
                <CustomRateField value={params.value}
                    row={params.data} column={params.colDef} updateRowData={updateRowData} />,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 0,
            width: 120,
            cellRenderer: (params) => (
                <Button variant="contained"
                    sx={{ textTransform: 'capitalize' }}
                    size="small" onClick={() => handleUpdate(params.data)}>
                    Update
                </Button>
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

    return (
        <Box>
            <Headtitle title={'Unitrate Unallotted List'} />
            {/* ****** Header Content ****** */}
            <PageHeading title="Unitrate Unallotted List" modulename="Production" submodulename="Upload" mainpagename="Original" subpagename="Unitrate Unallotted List" subsubpagename="" />
            {isUserRoleCompare?.includes('aunitrateunallottedlist') && (
                <>
                    <Box sx={userStyle.dialogbox}>
                        <Grid container spacing={2}>
                            <Grid item md={3} xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <Typography>
                                        Project
                                        <b style={{ color: 'red' }}>*</b>
                                    </Typography>

                                    <MultiSelect
                                        options={projectOpt}
                                        value={selectedProject}
                                        onChange={(e) => {
                                            handleProjectChange(e);
                                        }}
                                        valueRenderer={customValueRendererProject}
                                        labelledBy="Please Select Project"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <Typography>
                                        Category
                                        <b style={{ color: 'red' }}>*</b>
                                    </Typography>

                                    <MultiSelect
                                        options={categoryOpt}
                                        value={selectedCategory}
                                        onChange={(e) => {
                                            handleCategoryChange(e);
                                        }}
                                        valueRenderer={customValueRendererCategory}
                                        labelledBy="Please Select Category"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <Typography>
                                        SubCategory
                                        <b style={{ color: 'red' }}>*</b>
                                    </Typography>

                                    <MultiSelect
                                        options={subCategoryOpt}
                                        value={selectedSubCategory}
                                        onChange={(e) => {
                                            handleSubCategoryChange(e);
                                        }}
                                        valueRenderer={customValueRendererSubCategory}
                                        labelledBy="Please Select SubCategory"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={2} xs={12} sm={6} marginTop={3}>
                                <Grid sx={{ display: 'flex', justifyContent: 'left', gap: '15px' }}>
                                    <Button
                                        variant="contained"
                                        onClick={(e) => {
                                            fetchProductionFilter(e);
                                        }}
                                    >
                                        {' '}
                                        Filter
                                    </Button>
                                    <Button sx={userStyle.btncancel} onClick={handleClear}>
                                        {' '}
                                        CLEAR
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </>
            )}
            <br />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes('lunitrateunallottedlist') && (
                <>
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        {/* <Grid item xs={8}> */}
                        <Typography sx={userStyle.importheadtext}>Unitrate UnAllotted List</Typography>
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
                                    {isUserRoleCompare?.includes('excelunitrateunallottedlist') && (
                                        <>
                                            <Button
                                                onClick={(e) => {
                                                    setIsFilterOpen(true);

                                                    setFormat('xl');
                                                }}
                                                sx={userStyle.buttongrp}
                                            >
                                                <FaFileExcel />
                                                &ensp;Export to Excel&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes('csvunitrateunallottedlist') && (
                                        <>
                                            <Button
                                                onClick={(e) => {
                                                    setIsFilterOpen(true);
                                                    setFormat('csv');
                                                }}
                                                sx={userStyle.buttongrp}
                                            >
                                                <FaFileCsv />
                                                &ensp;Export to CSV&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes('printunitrateunallottedlist') && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes('pdfunitrateunallottedlist') && (
                                        <>
                                            <Button
                                                sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true);
                                                }}
                                            >
                                                <FaFilePdf />
                                                &ensp;Export to PDF&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes('imageunitrateunallottedlist') && (
                                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                                            {' '}
                                            <ImageIcon sx={{ fontSize: '15px' }} /> &ensp;Image&ensp;{' '}
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
                                >
                                    <AgGridReact
                                        rowData={paginatedData}
                                        columnDefs={columns}
                                        defaultColDef={{
                                            flex: 1,
                                            resizable: true,
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
                itemsTwo={productionFilter ?? []}
                filename={'Unitrate Unallotted List'}
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

export default UnitrateUnallottedList;