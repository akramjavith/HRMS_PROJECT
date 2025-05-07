import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import {
    Box,
    Button,
    DialogActions,
    DialogContent,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    InputAdornment,
    List, ListItem, ListItemText,
    MenuItem,
    OutlinedInput,
    Popover,
    Radio,
    RadioGroup,
    Select,
    TextField,
    Tooltip,
    Typography,
    Dialog
} from "@mui/material";
import Switch from '@mui/material/Switch';
import axios from "axios";
import domtoimage from 'dom-to-image';
import { saveAs } from "file-saver";
import 'jspdf-autotable';
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint, FaSearch } from "react-icons/fa";
import { IoMdOptions } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { ThreeDots } from 'react-loader-spinner';
import { useReactToPrint } from "react-to-print";
import AggridTableForPaginationTable from "../../components/AggridTableForPaginationTable.js";
import { handleApiError } from "../../components/Errorhandling";
import ExportData from "../../components/ExportData";
import Headtitle from "../../components/Headtitle";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";
import { AuthContext, UserRoleAccessContext } from '../../context/Appcontext';
import { userStyle } from "../../pageStyle";
import { SERVICE } from '../../services/Baseservice';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

function MyRolesAndResponsiblities() {

    const [advancedFilter, setAdvancedFilter] = useState(null);
    const [additionalFilters, setAdditionalFilters] = useState([]);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const conditions = ["Contains", "Does Not Contain", "Equals", "Does Not Equal", "Begins With", "Ends With", "Blank", "Not Blank"]; // AgGrid-like conditions
    const [selectedColumn, setSelectedColumn] = useState("");
    const [selectedCondition, setSelectedCondition] = useState("Contains");
    const [logicOperator, setLogicOperator] = useState("AND");
    const [filterValue, setFilterValue] = useState("");
    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);

    const [totalProjects, setTotalProjects] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };
    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };

    const [nonProductionEdit, setNonProductionEdit] = useState({
        category: "Please Select Category",
    })

    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
    const handleClickOpenPopupMalert = () => {
        setOpenPopupMalert(true);
    };
    const handleClosePopupMalert = () => {
        setOpenPopupMalert(false);
    };


    const gridRefTable = useRef(null);
    //Delete model

    const [fileFormat, setFormat] = useState("");
    const CurrentDate = new Date()
    const [taskcategorys, setTaskcategorys] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const { isUserRoleCompare, isUserRoleAccess, isAssignBranch, pageName, setPageName, buttonStyles, allTeam } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    const [taskcategoryCheck, setTaskcategorycheck] = useState(false);
    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [copiedData, setCopiedData] = useState('');

    const gridRefTableImg = useRef(null);
    // image
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "My Roles & Responsibilities.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    // view model
    const [openview, setOpenview] = useState(false);
    const handleClickOpenview = () => {
        setOpenview(true);
    };
    const handleCloseview = () => {
        setOpenview(false);
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

    // Show All Columns & Manage Columns 
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        jobroles: true,
        mode: true,
        description: true,
        actions: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);
    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ''; // This is required for Chrome support
    };

    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("My Roles & Responsibilities"),
            commonid: String(isUserRoleAccess?._id),
            date: String(new Date()),

            addedby: [
                {
                    name: String(isUserRoleAccess?.username),
                    date: String(new Date()),
                },
            ],
        });

    }

    useEffect(() => {
        getapi()
        fetchAllRolesRespons();
        fetchAllRolesResponsForExports()
        fetchTaskcategoryForPaginationExports()
    }, [])

    let exportColumnNames = ["Mode", "Job Roles", "Description"];
    let exportRowValues = ['mode', "jobroles", "description"];
    //get all Sub vendormasters.


    const [anchorElSearch, setAnchorElSearch] = React.useState(null);
    const handleClickSearch = (event) => {
        setAnchorElSearch(event.currentTarget);
        localStorage.removeItem("filterModel");
    };
    const handleCloseSearch = () => {
        setAnchorElSearch(null);
        setSearchQuery("");
    };

    const openSearch = Boolean(anchorElSearch);
    const idSearch = openSearch ? 'simple-popover' : undefined;

    const handleAddFilter = () => {
        if (selectedColumn && filterValue || ["Blank", "Not Blank"].includes(selectedCondition)) {
            setAdditionalFilters([
                ...additionalFilters,
                { column: selectedColumn, condition: selectedCondition, value: filterValue }
            ]);
            setSelectedColumn("");
            setSelectedCondition("Contains");
            setFilterValue("");
        }
    };

    const getSearchDisplay = () => {
        if (advancedFilter && advancedFilter.length > 0) {
            return advancedFilter.map((filter, index) => {
                let showname = columnDataTable.find(col => col.field === filter.column)?.headerName;
                return `${showname} ${filter.condition} "${filter.value}"`;
            }).join(' ' + (advancedFilter.length > 1 ? advancedFilter[1].condition : '') + ' ');
        }
        return searchQuery;
    };

    console.log(searchQuery, "searchQuery")

    const [taskcategorysExports, setTaskcategorysExports] = useState([])

    const fetchTaskcategoryForPaginationExports = async () => {
        setPageName(!pageName)

        console.time("fetchTaskcategoryForPagination")

        const queryParams = {
            company: isUserRoleAccess?.company,
            branch: isUserRoleAccess?.branch,
            unit: isUserRoleAccess?.unit,
            team: isUserRoleAccess?.team,
            employee: isUserRoleAccess?.companyname,
            department: isUserRoleAccess?.department,
            designation: isUserRoleAccess?.designation,
        };

        try {
            let res_vendor = await axios.post(SERVICE.ALLROLESANDRESPONSIBILITIES_PAGINATION_MYROLERES_EXPORTS, queryParams, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });

            setTaskcategorysExports(res_vendor?.data?.result?.map((item, index) => ({
                ...item,
                serialNumber: index + 1,
            })));

            console.timeEnd("fetchTaskcategoryForPagination")
        } catch (err) { setTaskcategorycheck(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }

    const fetchTaskcategoryForPagination = async () => {
        setPageName(!pageName)

        console.time("fetchTaskcategoryForPagination")

        const queryParams = {
            page: Number(page),
            pageSize: Number(pageSize),
            company: isUserRoleAccess?.company,
            branch: isUserRoleAccess?.branch,
            unit: isUserRoleAccess?.unit,
            team: isUserRoleAccess?.team,
            employee: isUserRoleAccess?.companyname,
            department: isUserRoleAccess?.department,
            designation: isUserRoleAccess?.designation,

        };


        const allFilters = [
            ...additionalFilters,
            { column: selectedColumn, condition: selectedCondition, value: filterValue }
        ];

        if (allFilters.length > 0 && selectedColumn !== "") {
            queryParams.allFilters = allFilters
            queryParams.logicOperator = logicOperator;
        } else if (searchQuery) {
            queryParams.searchQuery = searchQuery;
        }

        try {
            let res_vendor = await axios.post(SERVICE.ALLROLESANDRESPONSIBILITIES_PAGINATION_MYROLERES, queryParams, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });

            console.log(res_vendor, "res_vendor")
            setTaskcategorycheck(true)
            setTaskcategorys(res_vendor?.data?.result?.map((item, index) => ({
                ...item,
                serialNumber: (page - 1) * pageSize + index + 1,
                mode: item?.mode && item?.mode?.length > 0 ? item?.mode?.join(",") : ""
            })));

            setTotalProjects(res_vendor?.data?.result?.length > 0 ? res_vendor?.data?.totalProjects : 0);
            setTotalPages(res_vendor?.data?.result?.length > 0 ? res_vendor?.data?.totalPages : 0);
            setPageSize((data) => {
                return res_vendor?.data?.result?.length > 0 ? data : 10;
            });
            setPage((data) => {
                return res_vendor?.data?.result?.length > 0 ? data : 1;
            });
            console.timeEnd("fetchTaskcategoryForPagination")
        } catch (err) { setTaskcategorycheck(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }

    const handleResetSearch = async () => {
        setPageName(!pageName)
        setTaskcategorycheck(false);
        // Reset all filters and pagination state
        setAdvancedFilter(null);
        setAdditionalFilters([]);
        setSearchQuery("");
        setIsSearchActive(false);
        setSelectedColumn("");
        setSelectedCondition("Contains");
        setFilterValue("");
        setLogicOperator("AND");
        setFilteredChanges(null);

        const queryParams = {
            page: Number(page),
            pageSize: Number(pageSize),
            company: isUserRoleAccess?.company,
            branch: isUserRoleAccess?.branch,
            unit: isUserRoleAccess?.unit,
            team: isUserRoleAccess?.team,
            employee: isUserRoleAccess?.companyname,
            department: isUserRoleAccess?.department,
            designation: isUserRoleAccess?.designation,
        };

        const allFilters = [];
        // Only include advanced filters if they exist, otherwise just use regular searchQuery
        if (allFilters.length > 0 && selectedColumn !== "") {
            queryParams.allFilters = allFilters
            queryParams.logicOperator = logicOperator;
        } else if (searchQuery) {
            queryParams.searchQuery = searchQuery;  // Use searchQuery for regular search
        }

        try {
            let res_vendor = await axios.post(SERVICE.ALLROLESANDRESPONSIBILITIES_PAGINATION_MYROLERES, queryParams, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setTaskcategorycheck(true)
            const Data = res_vendor?.data?.result
            setItems(res_vendor?.data?.result?.map((t, index) => ({
                ...t,
                serialNumber: (page - 1) * pageSize + index + 1,
                mode: t?.mode && t?.mode?.length > 0 ? t?.mode?.join(",") : ""
            })));
            setTaskcategorys(res_vendor?.data?.result?.map((t, index) => ({
                ...t,
                serialNumber: (page - 1) * pageSize + index + 1,
                mode: t?.mode && t?.mode?.length > 0 ? t?.mode?.join(",") : ""
            })));

            setTotalProjects(res_vendor?.data?.result?.length > 0 ? res_vendor?.data?.totalProjects : 0);
            setTotalPages(res_vendor?.data?.result?.length > 0 ? res_vendor?.data?.totalPages : 0);
            setPageSize((data) => {
                return res_vendor?.data?.result?.length > 0 ? data : 10;
            });
            setPage((data) => {
                return res_vendor?.data?.result?.length > 0 ? data : 1;
            });

        } catch (err) {
            setTaskcategorycheck(true);
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'My Roles & Responsibilities',
        pageStyle: 'print'
    });
    useEffect(() => {
        fetchTaskcategoryForPagination();
    }, [page, pageSize, searchQuery])
    useEffect(
        () => {
            const beforeUnloadHandler = (event) => handleBeforeUnload(event);
            window.addEventListener('beforeunload', beforeUnloadHandler);
            return () => {
                window.removeEventListener('beforeunload', beforeUnloadHandler);
            };
        }, []);
    const [items, setItems] = useState([]);


    const addSerialNumber = (datas) => {
        setItems(datas);
    };
    useEffect(() => {
        addSerialNumber(taskcategorys);
    }, [taskcategorys]);

    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setSelectedRows([]);
        setSelectAllChecked(false)
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
        return searchTerms.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
        );
    });

    const [selectAllChecked, setSelectAllChecked] = useState(false);

    const columnDataTable = [
        {
            field: "serialNumber", headerName: "SNo",
            flex: 0, width: 90, hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header", pinned: 'left',
        },
        { field: "mode", headerName: "Mode", flex: 0, width: 250, hide: !columnVisibility.mode, headerClassName: "bold-header" },
        { field: "jobroles", headerName: "Job Roles", flex: 0, width: 350, hide: !columnVisibility.jobroles, headerClassName: "bold-header" },
        { field: "description", headerName: "Description", flex: 0, width: 350, hide: !columnVisibility.description, headerClassName: "bold-header" },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 280,
            minHeight: '40px !important',
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: 'flex' }}>
                    {isUserRoleCompare?.includes("vmyroles&responsibilities") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getviewCode(params.data.id);
                            }}
                        >
                            <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />                        </Button>
                    )}
                </Grid>
            ),
        },
    ]
    const filteredSelectedColumn = columnDataTable.filter(data => data.field !== 'checkbox' && data.field !== "actions" && data.field !== "serialNumber");

    const rowDataTable = filteredDatas.map((item, index) => {
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            type: item.type,
            company: item.company,
            mode: item?.mode || "",
            branch: item.branch,
            unit: item.unit,
            team: item.team,
            employee: item.employee,
            jobroles: item.jobroles,
            description: item.description,
        }
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
    // // Function to filter columns based on search query
    const filteredColumns = columnDataTable.filter((column) =>
        column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase())
    );
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
                    {filteredColumns.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText sx={{ display: 'flex' }}
                                primary={
                                    <Switch sx={{ marginTop: "-5px" }} size="small"
                                        checked={columnVisibility[column.field]}
                                        onChange={() => toggleColumnVisibility(column.field)}
                                    />
                                }
                                secondary={(column.field === "checkbox") ? "Checkbox" : column.headerName}
                            // secondary={column.headerName }
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


    const [allRolesandRespon, setIsAllRolesandRespon] = useState([])

    const fetchAllRolesRespons = async (id, name) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.ALLROLESANDRESPONSIBILITIES}`, {
                headers: { Authorization: `Bearer ${auth.APIToken}` },
            });
            setIsAllRolesandRespon(res?.data?.rolesandresponsibilities);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const [allRolesandResponAllExports, setIsAllRolesandResponAllExports] = useState([])

    const fetchAllRolesResponsForExports = async (id, name) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.ALLROLESANDRESPONSIBILITIES_EXPORTS}`, {
                headers: { Authorization: `Bearer ${auth.APIToken}` },
            });
            setIsAllRolesandResponAllExports(res?.data?.result);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const getviewCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.ROLESANDRESPONSIBILITIES_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setNonProductionEdit(res?.data?.srolesandresponsibilities);
            handleClickOpenview();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    return (
        <Box>
            <Headtitle title={'My Roles & Responsibilities'} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="My Roles & Responsibilities"
                modulename="Human Resources"
                submodulename="HR"
                mainpagename="HR Setup"
                subpagename="My Roles & Responsibilities"
                subsubpagename=""
            />


            <br />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lmyroles&responsibilities") && (
                <>
                    <Box sx={userStyle.container}>
                        { /* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>My Roles & Responsibilities List</Typography>
                        </Grid>
                        <br />
                        <Grid container spacing={2} style={userStyle.dataTablestyle}>
                            <Grid item md={2} xs={12} sm={12}>
                                <Box>
                                    <label >Show entries:</label>
                                    <Select id="pageSizeSelect" value={pageSize}
                                        MenuProps={{
                                            PaperProps: {
                                                style: {
                                                    maxHeight: 180,
                                                    width: 80,
                                                },
                                            },
                                        }}
                                        onChange={handlePageSizeChange} sx={{ width: "77px" }}>
                                        <MenuItem value={1}>1</MenuItem>
                                        <MenuItem value={5}>5</MenuItem>
                                        <MenuItem value={10}>10</MenuItem>
                                        <MenuItem value={25}>25</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
                                        <MenuItem value={100}>100</MenuItem>
                                        <MenuItem value={totalProjects}>All</MenuItem>
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Box >
                                    {isUserRoleCompare?.includes("excelmyroles&responsibilities") && (
                                        <>
                                            <Button
                                                onClick={(e) => {
                                                    setIsFilterOpen(true);
                                                    setFormat("xl");
                                                }}
                                                sx={userStyle.buttongrp}
                                            >
                                                <FaFileExcel />
                                                &ensp;Export to Excel&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvmyroles&responsibilities") && (
                                        <>
                                            <Button
                                                onClick={(e) => {
                                                    setIsFilterOpen(true);
                                                    setFormat("csv");
                                                }}
                                                sx={userStyle.buttongrp}
                                            >
                                                <FaFileCsv />
                                                &ensp;Export to CSV&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printmyroles&responsibilities") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint /> &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfmyroles&responsibilities") && (
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
                                    {isUserRoleCompare?.includes("imagemyroles&responsibilities") && (
                                        <>
                                            <Button
                                                sx={userStyle.buttongrp}
                                                onClick={handleCaptureImage}
                                            >
                                                {" "}
                                                <ImageIcon sx={{ fontSize: "15px" }} />{" "}
                                                &ensp;Image&ensp;{" "}
                                            </Button>
                                        </>
                                    )}
                                </Box >
                            </Grid>
                            <Grid item md={2} xs={6} sm={6}>


                                <FormControl fullWidth size="small">
                                    <OutlinedInput size="small"
                                        id="outlined-adornment-weight"
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <FaSearch />
                                            </InputAdornment>
                                        }
                                        endAdornment={
                                            <InputAdornment position="end">
                                                {advancedFilter && (
                                                    <IconButton onClick={handleResetSearch}>
                                                        <MdClose />
                                                    </IconButton>
                                                )}
                                                <Tooltip title="Show search options">
                                                    <span>
                                                        <IoMdOptions style={{ cursor: 'pointer', }} onClick={handleClickSearch} />
                                                    </span>
                                                </Tooltip>
                                            </InputAdornment>}
                                        aria-describedby="outlined-weight-helper-text"
                                        inputProps={{ 'aria-label': 'weight', }}
                                        type="text"
                                        value={getSearchDisplay()}
                                        onChange={handleSearchChange}
                                        placeholder="Type to search..."
                                        disabled={!!advancedFilter}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br />
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>Show All Columns</Button>&ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>Manage Columns</Button>&ensp;
                        <br />
                        <br />
                        {!taskcategoryCheck ?
                            <>
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <ThreeDots
                                        height="80"
                                        width="80"
                                        radius="9"
                                        color="#1976d2"
                                        ariaLabel="three-dots-loading"
                                        wrapperStyle={{}}
                                        wrapperClassName=""
                                        visible={true}
                                    />
                                </Box>
                            </>
                            :
                            <>
                                <AggridTableForPaginationTable
                                    rowDataTable={rowDataTable}
                                    columnDataTable={columnDataTable}
                                    columnVisibility={columnVisibility}
                                    page={page}
                                    setPage={setPage}
                                    pageSize={pageSize}
                                    totalPages={totalPages}
                                    setColumnVisibility={setColumnVisibility}
                                    selectedRows={selectedRows}
                                    setSelectedRows={setSelectedRows}
                                    gridRefTable={gridRefTable}
                                    totalDatas={totalProjects}
                                    setFilteredRowData={setFilteredRowData}
                                    filteredRowData={filteredRowData}
                                    gridRefTableImg={gridRefTableImg}
                                    itemsList={taskcategorys}
                                />
                            </>}
                    </Box>
                </>
            )
            }
            {/* view model */}
            <Dialog
                open={openview}
                onClose={handleClickOpenview}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="md"
                fullWidth={true}
                sx={{ marginTop: "80px" }}
            >
                <Box sx={{ padding: '20px 50px' }}>
                    <>
                        <Typography sx={userStyle.HeaderText}> View My Roles & Responsibilities</Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={12} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Mode</Typography>
                                    <Typography>{nonProductionEdit?.mode?.length > 0 ? nonProductionEdit?.mode?.map((t, i) => `${i + 1 + ". "}` + t).join("\n") : ""}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6" gutterBottom>Job Roles & Descriptions</Typography>
                                    {nonProductionEdit.jobroles?.map((role, index) => (
                                        <Box key={index} mb={2}>
                                            <Typography variant="subtitle1" fontWeight="bold">
                                                {index + 1}. {role}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" ml={2}>
                                                {nonProductionEdit.description?.[index] || "No description provided."}
                                            </Typography>
                                        </Box>
                                    ))}
                                </FormControl>
                            </Grid>

                            {/* <Grid item md={6} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Job Roles</Typography>
                                    <Typography>{nonProductionEdit.jobroles?.map((t, i) => `${i + 1 + ". "}` + t).join("\n")}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Description</Typography>
                                    <Typography>{nonProductionEdit.description?.map((t, i) => `${i + 1 + ". "}` + t).join("\n")}</Typography>
                                </FormControl>
                            </Grid> */}
                        </Grid>
                        <br /> <br />  <br />
                        <Grid container spacing={2}>
                            <Button sx={buttonStyles.btncancel} onClick={handleCloseview}> Back </Button>
                        </Grid>
                    </>
                </Box>
            </Dialog>

            <Popover
                id={idSearch}
                open={openSearch}
                anchorEl={anchorElSearch}
                onClose={handleCloseSearch}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }}
            >
                <Box style={{ padding: "10px", maxWidth: '450px' }}>
                    <Typography variant="h6">Advance Search</Typography>
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseSearch}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <DialogContent sx={{ width: "100%" }}>
                        <Box sx={{
                            width: '350px',
                            maxHeight: '400px',
                            overflow: 'hidden',
                            position: 'relative'
                        }}>
                            <Box sx={{
                                maxHeight: '300px',
                                overflowY: 'auto',
                                // paddingRight: '5px'
                            }}>
                                <Grid container spacing={1}>
                                    <Grid item md={12} sm={12} xs={12}>
                                        <Typography>Columns</Typography>
                                        <Select fullWidth size="small"
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 200,
                                                        width: "auto",
                                                    },
                                                },
                                            }}
                                            style={{ minWidth: 150 }}
                                            value={selectedColumn}
                                            onChange={(e) => setSelectedColumn(e.target.value)}
                                            displayEmpty
                                        >
                                            <MenuItem value="" disabled>Select Column</MenuItem>
                                            {filteredSelectedColumn.map((col) => (
                                                <MenuItem key={col.field} value={col.field}>
                                                    {col.headerName}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </Grid>
                                    <Grid item md={12} sm={12} xs={12}>
                                        <Typography>Operator</Typography>
                                        <Select fullWidth size="small"
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 200,
                                                        width: "auto",
                                                    },
                                                },
                                            }}
                                            style={{ minWidth: 150 }}
                                            value={selectedCondition}
                                            onChange={(e) => setSelectedCondition(e.target.value)}
                                            disabled={!selectedColumn}
                                        >
                                            {conditions.map((condition) => (
                                                <MenuItem key={condition} value={condition}>
                                                    {condition}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </Grid>
                                    <Grid item md={12} sm={12} xs={12}>
                                        <Typography>Value</Typography>
                                        <TextField fullWidth size="small"
                                            value={["Blank", "Not Blank"].includes(selectedCondition) ? "" : filterValue}
                                            onChange={(e) => setFilterValue(e.target.value)}
                                            disabled={["Blank", "Not Blank"].includes(selectedCondition)}
                                            placeholder={["Blank", "Not Blank"].includes(selectedCondition) ? "Disabled" : "Enter value"}
                                            sx={{
                                                '& .MuiOutlinedInput-root.Mui-disabled': {
                                                    backgroundColor: 'rgb(0 0 0 / 26%)',
                                                },
                                                '& .MuiOutlinedInput-input.Mui-disabled': {
                                                    cursor: 'not-allowed',
                                                },
                                            }}
                                        />
                                    </Grid>
                                    {additionalFilters.length > 0 && (
                                        <>
                                            <Grid item md={12} sm={12} xs={12}>
                                                <RadioGroup
                                                    row
                                                    value={logicOperator}
                                                    onChange={(e) => setLogicOperator(e.target.value)}
                                                >
                                                    <FormControlLabel value="AND" control={<Radio />} label="AND" />
                                                    <FormControlLabel value="OR" control={<Radio />} label="OR" />
                                                </RadioGroup>
                                            </Grid>
                                        </>
                                    )}
                                    {additionalFilters.length === 0 && (
                                        <Grid item md={4} sm={12} xs={12} >
                                            <Button variant="contained" onClick={handleAddFilter} sx={{ textTransform: "capitalize" }} disabled={["Blank", "Not Blank"].includes(selectedCondition) ? false : !filterValue || selectedColumn.length === 0}>
                                                Add Filter
                                            </Button>
                                        </Grid>
                                    )}

                                    <Grid item md={2} sm={12} xs={12}>
                                        <Button variant="contained" onClick={() => {
                                            fetchTaskcategoryForPagination();
                                            setIsSearchActive(true);
                                            setAdvancedFilter([
                                                ...additionalFilters,
                                                { column: selectedColumn, condition: selectedCondition, value: filterValue }
                                            ])
                                        }} sx={{ textTransform: "capitalize" }} disabled={["Blank", "Not Blank"].includes(selectedCondition) ? false : !filterValue || selectedColumn.length === 0}>
                                            Search
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </DialogContent>
                </Box>
            </Popover>
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

            <MessageAlert
                openPopup={openPopupMalert}
                handleClosePopup={handleClosePopupMalert}
                popupContent={popupContentMalert}
                popupSeverity={popupSeverityMalert}
            />
            {/* EXTERNAL COMPONENTS -------------- END */}
            {/* PRINT PDF EXCEL CSV */}
            <ExportData
                isFilterOpen={isFilterOpen}
                handleCloseFilterMod={handleCloseFilterMod}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpen}
                isPdfFilterOpen={isPdfFilterOpen}
                setIsPdfFilterOpen={setIsPdfFilterOpen}
                handleClosePdfFilterMod={handleClosePdfFilterMod}
                filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
                itemsTwo={taskcategorysExports ?? []}
                filename={"My Roles & Responsibilities"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />

        </Box>
    );
}
export default MyRolesAndResponsiblities;
