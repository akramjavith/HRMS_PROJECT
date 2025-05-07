import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    FormControl, Grid,
    IconButton,
    InputAdornment,
    List, ListItem, ListItemText,
    MenuItem,
    OutlinedInput,
    Paper,
    Popover,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    Tooltip, Radio, RadioGroup, FormControlLabel
} from "@mui/material";
import Switch from '@mui/material/Switch';
import axios from "axios";
import domtoimage from 'dom-to-image';
import * as FileSaver from "file-saver";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import 'jspdf-autotable';
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint, FaSearch } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { ThreeDots } from 'react-loader-spinner';
import { useReactToPrint } from "react-to-print";
import * as XLSX from "xlsx";
import AggridTableForPaginationTable from "../../components/AggridTableForPaginationTable.js";
import AlertDialog from "../../components/Alert";
import { handleApiError } from "../../components/Errorhandling";
import ExportData from "../../components/ExportData";
import Headtitle from "../../components/Headtitle";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";
import { AuthContext, UserRoleAccessContext } from '../../context/Appcontext';
import { userStyle } from "../../pageStyle";
import { SERVICE } from '../../services/Baseservice';
import { IoMdOptions } from "react-icons/io";


function UnAllottedChecklist() {

    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);

    const [overallItems, setOverallItems] = useState([]);

    let exportColumnNames = [
        'Module Name',
        'Sub Module Name',
        'Main Page',
        'Sub Page',
        'Sub Sub Page',
        'Category',
        'Sub Category',
        'Check List',
        'Details',
        'Information',
        'Estimation',
        'Estimation Time'
    ];
    let exportRowValues = [
        'module', 'submodule',
        'mainpage', 'subpage',
        'subsubpage', 'category',
        'subcategory', 'checklist',
        'details', 'information',
        'estimation', 'estimationtime'
    ];

    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
    const handleClickOpenPopupMalert = () => {
        setOpenPopupMalert(true);
    };
    const handleClosePopupMalert = () => {
        setOpenPopupMalert(false);
    };
    const [openPopup, setOpenPopup] = useState(false);
    const [popupContent, setPopupContent] = useState("");
    const [popupSeverity, setPopupSeverity] = useState("");
    const handleClickOpenPopup = () => {
        setOpenPopup(true);
    };
    const handleClosePopup = () => {
        setOpenPopup(false);
    };


    const pathname = window.location.pathname;

    const [addRequiredEdit, setAddRequiredEdit] = useState({
        category: "Please Select Category",
        subcategory: "Please Select Sub Category",
        details: "",
        options: "Please Select Check List",
        count: "",
        raiser: true,
        resolver: true,
    });

    //20.11.2024-------------------------------------------------------------------------------------------------------------------
    const [advancedFilter, setAdvancedFilter] = useState(null);
    const [totalPages, setTotalPages] = useState(0);

    const [logicOperator, setLogicOperator] = useState("AND");

    const [selectedColumn, setSelectedColumn] = useState("");
    const [selectedCondition, setSelectedCondition] = useState("Contains");
    const [filterValue, setFilterValue] = useState("");
    const [additionalFilters, setAdditionalFilters] = useState([]);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const conditions = ["Contains", "Does Not Contain", "Equals", "Does Not Equal", "Begins With", "Ends With", "Blank", "Not Blank"]; // AgGrid-like conditions

    // Search bar
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

    // Show filtered combination in the search bar
    const getSearchDisplay = () => {
        if (advancedFilter && advancedFilter.length > 0) {
            return advancedFilter.map((filter, index) => {
                let showname = columnDataTable.find(col => col.field === filter.column)?.headerName;
                return `${showname} ${filter.condition} "${filter.value}"`;
            }).join(' ' + (advancedFilter.length > 1 ? advancedFilter[1].condition : '') + ' ');
        }
        return searchQuery;
    };


    const [checklistverificationEdit, setChecklistverificationEdit] = useState({
        categoryname: "Please Select Category",
        subcategoryname: "Please Select Subcategory",
        checklisttype: "Please Select Checklist Type",
        company: "Please Select Company",
        branch: "Please Select Branch",
        unit: "Please Select Unit",
        team: "Please Select Team",
        employee: "Please Select Responsible Person",
    });

    const [searchedString, setSearchedString] = useState("")


    const [checklistverificationmasters, setChecklistverificationmasters] = useState([]);
    const [isHandleChange, setIsHandleChange] = useState(false);
    const [totalDatas, setTotalDatas] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [allChecklistverificationEdit, setAllChecklistverificationEdit] = useState([]);
    const [checklistverificationCheck, setChecklistverificationCheck] = useState(false);
    const { isUserRoleCompare, isUserRoleAccess, isAssignBranch, allTeam, allUsersData, pageName, setPageName,
        buttonStyles } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    const gridRef = useRef(null);
    const gridRefTable = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [copiedData, setCopiedData] = useState("");
    //image
    const gridRefTableImg = useRef(null);
    // image
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Unallotted Checklist.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
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

    const handleClickOpenview = () => {
        setOpenview(true);
    };

    const handleCloseview = () => {
        setOpenview(false);
    };

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };


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
        category: true,
        subcategory: true,
        checklist: true,
        actions: true,
        details: true,

        module: true,
        submodule: true,
        mainpage: true,
        subpage: true,
        subsubpage: true,

        estimation: true,
        estimationtime: true,

        information: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
    };

    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Unallotted Checklist"),
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
        getapi();
    }, []);


    const [checklisttypeEdit, setChecklisttypeEdit] = useState({ checklist: "", type: "Please Select Type" })

    const getviewCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.CHECKLISTTYPE_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setChecklisttypeEdit(res?.data?.schecklisttype);
            setAddRequiredEdit({ ...res?.data?.schecklisttype, options: res?.data?.schecklisttype?.checklist });
            handleClickOpenview();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    //get all project.
    const fetchChecklistverification = async () => {
        setPageName(!pageName)

        const queryParams = {
            page: Number(page),
            pageSize: Number(pageSize),

        };

        const allFilters = [
            ...additionalFilters,
            { column: selectedColumn, condition: selectedCondition, value: filterValue }
        ];
        // Only include advanced filters if they exist, otherwise just use regular searchQuery
        if (allFilters.length > 0 && selectedColumn !== "") {
            queryParams.allFilters = allFilters
            queryParams.logicOperator = logicOperator;
        } else if (searchQuery) {
            queryParams.searchQuery = searchQuery;
        }

        try {
            let res_status = await axios.post(SERVICE.GETALLCHECKLISTBYPAGINATIONNOTASSIGNED, queryParams, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },

            });
            const ans = res_status?.data?.result?.length > 0 ? res_status?.data?.result : []

            const itemsWithSerialNumber = ans?.map((item, index) => ({
                ...item,
                serialNumber: (page - 1) * pageSize + index + 1,
            }));
            const overallWithSerialNumber = res_status?.data?.overallitems?.map((item, index) => ({
                ...item,
                serialNumber: index + 1,
            }));

            setTotalDatas(ans?.length > 0 ? res_status?.data?.totalProjects : 0);
            setChecklistverificationmasters(itemsWithSerialNumber);
            setOverallItems(overallWithSerialNumber);
            setTotalPages(ans?.length > 0 ? res_status?.data?.totalPages : 0);
            setPageSize((data) => { return ans?.length > 0 ? data : 10 });
            setPage((data) => { return ans?.length > 0 ? data : 1 });
            setTimeout(() => { setChecklistverificationCheck(true) }, 1000);
        } catch (err) { setChecklistverificationCheck(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }

    };


    //get all project.
    const handleResetSearch = async () => {
        setPageName(!pageName)

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
            let res_status = await axios.post(SERVICE.GETALLCHECKLISTBYPAGINATIONNOTASSIGNED, queryParams, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const ans = res_status?.data?.result?.length > 0 ? res_status?.data?.result : []

            const itemsWithSerialNumber = ans?.map((item, index) => ({
                ...item,
                serialNumber: (page - 1) * pageSize + index + 1,
            }));
            const overallWithSerialNumber = res_status?.data?.overallitems?.map((item, index) => ({
                ...item,
                serialNumber: index + 1,
            }));

            setTotalDatas(ans?.length > 0 ? res_status?.data?.totalProjects : 0);
            setChecklistverificationmasters(itemsWithSerialNumber);
            setOverallItems(overallWithSerialNumber);
            setTotalPages(ans?.length > 0 ? res_status?.data?.totalPages : 0);
            setPageSize((data) => { return ans?.length > 0 ? data : 10 });
            setPage((data) => { return ans?.length > 0 ? data : 1 });
            setTimeout(() => { setChecklistverificationCheck(true) }, 1000);
        } catch (err) { setChecklistverificationCheck(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }

    };

    //get all project.
    const fetchChecklistverificationAll = async () => {
        setPageName(!pageName)
        try {
            let res_grp = await axios.get(SERVICE.CHECKLISTVERIFICATIONMASTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setAllChecklistverificationEdit(res_grp?.data?.checklistverificationmasters.filter((item) => item._id !== checklistverificationEdit._id));
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    //------------------------------------------------------

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };

    const [fileFormat, setFormat] = useState("xl");
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = fileFormat === "xl" ? ".xlsx" : ".csv";

    const exportToExcel = (excelData, fileName) => {
        setPageName(!pageName)
        try {
            const ws = XLSX.utils.json_to_sheet(excelData);
            const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

            // Check if the browser supports Blob and FileSaver
            if (!Blob || !FileSaver) {
                console.error('Blob or FileSaver not supported');
                return;
            }

            const data = new Blob([excelBuffer], { type: fileType });

            // Check if FileSaver.saveAs is available
            if (!FileSaver.saveAs) {
                console.error('FileSaver.saveAs is not available');
                return;
            }

            FileSaver.saveAs(data, fileName + fileExtension);
        } catch (error) {
            console.error('Error exporting to Excel', error);
        }
    };

    const formatData = (data) => {
        return data.map((item, index) => {
            return {
                Sno: index + 1,
                "Module Name": item.module || '',
                "Sub Module Name": item.submodule || '',

                "Main Page": item.mainpage || '',
                "Sub Page": item.subpage || '',
                "Sub Sub Page": item.subsubpage || '',
                Category: item.category || '',
                "Sub Category": item.subcategory || '',
                "Check List": item.checklist || '',
                "Details": item.details || '',
                "Estimation": item.estimation || '',
                "Estimation Time": item.estimationtime || '',

            };
        });
    };

    const handleExportXL = (isfilter) => {

        const dataToExport = isfilter === "filtered" ? filteredData : items;

        if (!dataToExport || dataToExport.length === 0) {
            console.error('No data available to export');
            return;
        }

        exportToExcel(formatData(dataToExport), 'Unallotted Checklists');
        setIsFilterOpen(false);
    };

    // pdf.....
    const columns = [
        { title: "Module Name", field: "module" },
        { title: "Sub Module Name", field: "submodule" },
        { title: "Main Page", field: "mainpage" },
        { title: "Sub Page", field: "subpage" },
        { title: "Sub Sub Page", field: "subsubpage" },

        { title: "Category", field: "category" },
        { title: "Sub Category", field: "subcategory" },
        { title: "Check List", field: "checklist" },
        { title: "Details", field: "details" },
        { title: "Information", field: "information" },
        { title: "Estimation", field: "estimation" },
        { title: "Estimation Time", field: "estimationtime" },

    ];

    const downloadPdf = (isfilter) => {
        const doc = new jsPDF();
        const columnsWithSerial = [
            { title: "S.No", dataKey: "serialNumber" }, // Serial number column
            ...columns.map((col) => ({ title: col.title, dataKey: col.field })),
        ];

        // Modify row data to include serial number
        const dataWithSerial =
            isfilter === "filtered"
                ? filteredData.map((t, index) => ({
                    ...t,
                    serialNumber: index + 1,

                }))
                : items?.map((item, index) => ({
                    ...item,
                    serialNumber: index + 1,


                }));

        // Generate PDF
        doc.autoTable({
            theme: "grid",
            columns: columnsWithSerial,
            body: dataWithSerial,
            styles: { fontSize: 5 },
        });

        doc.save("Unallotted Checklists.pdf");
    };

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Unallotted Checklists",
        pageStyle: "print",
    });


    useEffect(() => {
        fetchChecklistverification();
    }, [page, pageSize,searchQuery]);

    useEffect(() => {
        fetchChecklistverificationAll();
    }, [checklistverificationEdit]);

    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        };
    }, []);

    const [items, setItems] = useState([]);

    const addSerialNumber = (datas) => {
        setItems(datas);
    };

    useEffect(() => {
        addSerialNumber(checklistverificationmasters);
    }, [checklistverificationmasters]);

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

    const [selectAllChecked, setSelectAllChecked] = useState(false);

    const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
        <div>
            <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
        </div>
    );


    const columnDataTable = [

        {
            field: "serialNumber", headerName: "SNo",
            flex: 0, width: 100, hide: !columnVisibility.serialNumber, headerClassName: "bold-header", pinned: 'left', lockPinned: true,
        },

        { field: "module", headerName: "Module Name", flex: 0, width: 200, hide: !columnVisibility.module, headerClassName: "bold-header", pinned: 'left', },
        { field: "submodule", headerName: "Sub Module Name", flex: 0, width: 200, hide: !columnVisibility.submodule, headerClassName: "bold-header", pinned: 'left', },
        { field: "mainpage", headerName: "Main Page", flex: 0, width: 200, hide: !columnVisibility.mainpage, headerClassName: "bold-header" },
        { field: "subpage", headerName: "Sub Page", flex: 0, width: 200, hide: !columnVisibility.subpage, headerClassName: "bold-header" },
        { field: "subsubpage", headerName: "Sub Sub Page", flex: 0, width: 200, hide: !columnVisibility.subsubpage, headerClassName: "bold-header" },

        { field: "category", headerName: "Category", flex: 0, width: 200, hide: !columnVisibility.category, headerClassName: "bold-header", },
        { field: "subcategory", headerName: "Sub Category", flex: 0, width: 200, hide: !columnVisibility.category, headerClassName: "bold-header", },
        { field: "checklist", headerName: "Check List", flex: 0, width: 200, hide: !columnVisibility.checklist, headerClassName: "bold-header", },
        { field: "details", headerName: "Details", flex: 0, width: 200, hide: !columnVisibility.details, headerClassName: "bold-header", },
        { field: "information", headerName: "Information", flex: 0, width: 200, hide: !columnVisibility.information, headerClassName: "bold-header", },
        { field: "estimation", headerName: "Estimation", flex: 0, width: 100, hide: !columnVisibility.estimation, headerClassName: "bold-header", },
        { field: "estimationtime", headerName: "Estimation Time", flex: 0, width: 100, hide: !columnVisibility.estimationtime, headerClassName: "bold-header", },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 250,
            minHeight: '40px !important',
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",

            cellRenderer: (params) => (
                <Grid sx={{ display: 'flex' }}>


                    {isUserRoleCompare?.includes("vunallottedchecklist") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {

                                getviewCode(params.data.id);
                            }}
                        >
                            <VisibilityOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttonview} />
                        </Button>
                    )}

                </Grid>
            ),
        },
    ]
    const filteredSelectedColumn = columnDataTable.filter(data => data.field !== 'checkbox' && data.field !== "actions" && data.field !== "serialNumber");
    const rowDataTable = items.map((item, index) => {
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            category: item.category,
            subcategory: item.subcategory,
            details: item.details,
            checklist: item.checklist,
            information: item.information,
            estimation: item.estimation,
            estimationtime: item.estimationtime,
            module: item.module,
            submodule: item.submodule,
            mainpage: item.mainpage,
            subpage: item.subpage,
            subsubpage: item.subsubpage,
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
    return (
        <Box>
            <Headtitle title={"Unallotted Checklists"} />
            {/* ****** Header Content ****** */}

            <PageHeading
                title="Unallotted Checklists"
                modulename="Checklist"
                submodulename="Unallotted Checklist"
                mainpagename=""
                subpagename=""
                subsubpagename=""
            />
            <br />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lunallottedchecklist") && (
                <>
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Unallotted Checklist</Typography>
                        </Grid>

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

                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Box>
                                    {isUserRoleCompare?.includes("excelunallottedchecklist") && (
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
                                    {isUserRoleCompare?.includes("csvunallottedchecklist") && (
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
                                    {isUserRoleCompare?.includes("printunallottedchecklist") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfunallottedchecklist") && (
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
                                    {isUserRoleCompare?.includes("imageunallottedchecklist") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                                                <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;
                                            </Button>
                                        </>
                                    )}
                                </Box>
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
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
                            Show All Columns
                        </Button>
                        &ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
                            Manage Columns
                        </Button>

                        <br />
                        <br />
                        {!checklistverificationCheck ? (
                            <>
                                <Box sx={{ display: "flex", justifyContent: "center" }}>
                                    <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                                </Box>
                            </>
                        ) : (
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
                                    totalDatas={totalDatas}
                                    setFilteredRowData={setFilteredRowData}
                                    filteredRowData={filteredRowData}
                                    gridRefTableImg={gridRefTableImg}
                                    itemsList={overallItems}
                                />
                            </>
                        )}
                    </Box>
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
                                                    fetchChecklistverification();
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

            {/* Delete Modal */}
            <Box>



                {/* print layout */}

                <TableContainer component={Paper} sx={userStyle.printcls}>
                    <Table sx={{ minWidth: 700, }} aria-label="customized table" id="usertable" ref={componentRef}>
                        <TableHead>
                            <TableRow>
                                <TableCell>S.no</TableCell>
                                <TableCell>Module Name </TableCell>
                                <TableCell>Sub Module Name </TableCell>
                                <TableCell>Main Page </TableCell>
                                <TableCell>Sub Page </TableCell>
                                <TableCell>Sub Sub Page </TableCell>

                                <TableCell>Category </TableCell>
                                <TableCell>Sub Category </TableCell>
                                <TableCell>Check List</TableCell>
                                <TableCell>Details</TableCell>
                                <TableCell>Information</TableCell>
                                <TableCell>Estimation</TableCell>
                                <TableCell>Estimation Time</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody align="left">
                            {rowDataTable &&
                                (rowDataTable.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{row.module}</TableCell>
                                        <TableCell>{row.submodule}</TableCell>
                                        <TableCell>{row.mainpage}</TableCell>
                                        <TableCell>{row.subpage}</TableCell>
                                        <TableCell>{row.subsubpage}</TableCell>

                                        <TableCell>{row.category}</TableCell>
                                        <TableCell>{row.subcategory}</TableCell>
                                        <TableCell>{row.checklist}</TableCell>
                                        <TableCell>{row.details}</TableCell>
                                        <TableCell>{row.information}</TableCell>
                                        <TableCell>{row.estimation}</TableCell>
                                        <TableCell>{row.estimationtime}</TableCell>
                                    </TableRow>
                                )))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            <Dialog
                open={openview}
                onClose={handleClickOpenview}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            // maxWidth="lg"
            >
                <Box sx={{ width: "550px", padding: '20px 50px' }}>
                    <>
                        <Typography sx={userStyle.HeaderText}> View Checklist Type</Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Module Name</Typography>
                                    <Typography>{addRequiredEdit?.module}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Sub Module Name</Typography>
                                    <Typography>{addRequiredEdit?.submodule}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Main Page</Typography>
                                    <Typography>{addRequiredEdit?.mainpage}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Sub Page</Typography>
                                    <Typography>{addRequiredEdit?.subpage}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Sub Sub Page</Typography>
                                    <Typography>{addRequiredEdit?.subsubpage}</Typography>
                                </FormControl>
                            </Grid>


                            <Grid item md={6} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Category</Typography>
                                    <Typography>{addRequiredEdit?.category}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Sub Category</Typography>
                                    <Typography>{addRequiredEdit?.subcategory}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Check List</Typography>
                                    <Typography>{addRequiredEdit?.checklist}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Details</Typography>
                                    <Typography>{addRequiredEdit?.details}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Information</Typography>
                                    <Typography>{addRequiredEdit?.information}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Estimation</Typography>
                                    <Typography>{addRequiredEdit?.estimation}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Estimation Time</Typography>
                                    <Typography>{addRequiredEdit?.estimationtime}</Typography>
                                </FormControl>
                            </Grid>

                        </Grid>
                        <br /> <br />  <br />
                        <Grid container spacing={2}>
                            <Button variant="contained" color="primary" onClick={handleCloseview} sx={buttonStyles.btncancel}> Back </Button>
                        </Grid>
                    </>
                </Box>
            </Dialog>



            {/* ALERT DIALOG */}
            <Box>
                <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                        <Typography variant="h6">{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error" onClick={handleCloseerr}>
                            ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
            <ExportData
                isFilterOpen={isFilterOpen}
                handleCloseFilterMod={handleCloseFilterMod}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpen}
                isPdfFilterOpen={isPdfFilterOpen}
                setIsPdfFilterOpen={setIsPdfFilterOpen}
                handleClosePdfFilterMod={handleClosePdfFilterMod}
                filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
                itemsTwo={overallItems ?? []}
                filename={"Unallotted Checklist"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            <MessageAlert
                openPopup={openPopupMalert}
                handleClosePopup={handleClosePopupMalert}
                popupContent={popupContentMalert}
                popupSeverity={popupSeverityMalert}
            />
            {/* SUCCESS */}
            <AlertDialog
                openPopup={openPopup}
                handleClosePopup={handleClosePopup}
                popupContent={popupContent}
                popupSeverity={popupSeverity}
            />
        </Box>
    );
}


export default UnAllottedChecklist;