import ImageIcon from "@mui/icons-material/Image";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import LoadingButton from "@mui/lab/LoadingButton";
import {
    Box, Button,
    Dialog, DialogActions, DialogContent, FormControl, Grid, IconButton,
    InputAdornment,
    MenuItem, OutlinedInput,
    Popover, Select,
    Tooltip,
    Typography
} from "@mui/material";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridReact } from "ag-grid-react";
import axios from "axios";
import domtoimage from 'dom-to-image';
import { saveAs } from "file-saver";
import "jspdf-autotable";
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint, FaSearch } from 'react-icons/fa';
import { IoMdOptions } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { ThreeDots } from "react-loader-spinner";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import ResizeObserver from 'resize-observer-polyfill';
import AlertDialog from "../../components/Alert";
import { handleApiError } from "../../components/Errorhandling";
import ExportData from "../../components/ExportData";
import Headtitle from "../../components/Headtitle";
import ManageColumnsContent from "../../components/ManageColumn";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";
import AdvancedSearchBar from '../../components/Searchbar';
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { colourStyles, userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";
window.ResizeObserver = ResizeObserver;

function OverAllStockCount({ stockDatas }) {

    let today = new Date();

    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    let formattedDate = yyyy + "-" + mm + "-" + dd;

    const gridRefTableTeamLveVerif = useRef(null);
    const gridRefImageTeamLveVerif = useRef(null);
    const [isBtn, setIsBtn] = useState(false);
    const [Accessdrop, setAccesDrop] = useState("Employee");
    const [AccessdropEdit, setAccesDropEdit] = useState("Employee");
    const modeDropDowns = [
        { label: "Asset", value: "Asset" },
        { label: "Stock", value: "Stock" },
    ];
    const sectorDropDowns = [
        { label: "Primary", value: "Primary" },
        { label: "Secondary", value: "Secondary" },
        { label: "Tertiary", value: "Tertiary" },
        { label: "All", value: "all" },
    ];
    const [modeselection, setModeSelection] = useState({
        label: "Asset",
        value: "Asset",
    });
    const [sectorSelection, setSectorSelection] = useState({
        label: "Primary",
        value: "Primary",
    });
    const [appleave, setAppleave] = useState({
        employeename: "Please Select Employee Name",
        employeeid: "",
        leavetype: "Please Select LeaveType",
        date: "",
        todate: "",
        reasonforleave: "",
        reportingto: "",
        department: "",
        designation: "",
        doj: "",
        availabledays: "",
        durationtype: "Random",
        weekoff: "",
        workmode: "",
    });

    const [appleaveEdit, setAppleaveEdit] = useState([]);
    const [selectStatus, setSelectStatus] = useState({});
    const [isApplyLeave, setIsApplyLeave] = useState([]);

    //   const [applyleaves, setApplyleaves] = useState([]);

    // State to track advanced filter
    const [advancedFilter, setAdvancedFilter] = useState(null);
    const [gridApi, setGridApi] = useState(null);
    const [columnApi, setColumnApi] = useState(null);
    const [filteredDataItems, setFilteredDataItems] = useState(stockDatas);
    const [filteredRowData, setFilteredRowData] = useState([]);

    const [leave, setLeave] = useState("Please Select LeaveType");
    const [leaveEdit, setLeaveEdit] = useState("Please Select LeaveType");

    const { isUserRoleCompare, allProjects, isUserRoleAccess, pageName, setPageName, buttonStyles, isAssignBranch } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    const accessbranch = isUserRoleAccess?.role?.includes("Manager")
        ? isAssignBranch?.map((data) => ({
            branch: data.branch,
            company: data.company,
            unit: data.unit,
        }))
        : isAssignBranch
            ?.filter((data) => {
                let fetfinalurl = [];

                if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 &&
                    data?.mainpagenameurl?.length !== 0 &&
                    data?.subpagenameurl?.length !== 0 &&
                    data?.subsubpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
                ) {
                    fetfinalurl = data.subsubpagenameurl;
                } else if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 &&
                    data?.mainpagenameurl?.length !== 0 &&
                    data?.subpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
                ) {
                    fetfinalurl = data.subpagenameurl;
                } else if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 &&
                    data?.mainpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
                ) {
                    fetfinalurl = data.mainpagenameurl;
                } else if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
                ) {
                    fetfinalurl = data.submodulenameurl;
                } else if (data?.modulenameurl?.length !== 0) {
                    fetfinalurl = data.modulenameurl;
                } else {
                    fetfinalurl = [];
                }

                const remove = [
                    "asset/assetlist",
                    "/asset/assetlist",
                ];
                return fetfinalurl?.some((item) => remove?.includes(item));
            })
            ?.map((data) => ({
                branch: data.branch,
                company: data.company,
                unit: data.unit,
            }));
    const accessbranchstock = isUserRoleAccess?.role?.includes("Manager")
        ? isAssignBranch?.map((data) => ({
            branch: data.branch,
            company: data.company,
            unit: data.unit,
        }))
        : isAssignBranch
            ?.filter((data) => {
                let fetfinalurl = [];

                if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 &&
                    data?.mainpagenameurl?.length !== 0 &&
                    data?.subpagenameurl?.length !== 0 &&
                    data?.subsubpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
                ) {
                    fetfinalurl = data.subsubpagenameurl;
                } else if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 &&
                    data?.mainpagenameurl?.length !== 0 &&
                    data?.subpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
                ) {
                    fetfinalurl = data.subpagenameurl;
                } else if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 &&
                    data?.mainpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
                ) {
                    fetfinalurl = data.mainpagenameurl;
                } else if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
                ) {
                    fetfinalurl = data.submodulenameurl;
                } else if (data?.modulenameurl?.length !== 0) {
                    fetfinalurl = data.modulenameurl;
                } else {
                    fetfinalurl = [];
                }

                const remove = [
                    "stockpurchase/manualstock",
                    "/stockpurchase/manualstock",
                    "stockpurchase/stock",
                    "/stockpurchase/stock",
                ];
                return fetfinalurl?.some((item) => remove?.includes(item));
            })
            ?.map((data) => ({
                branch: data.branch,
                company: data.company,
                unit: data.unit,
            }));

    const [applyleaveCheck, setApplyleavecheck] = useState(true);

    const [selectedRows, setSelectedRows] = useState([]);

    const [statusOpen, setStatusOpen] = useState(false);
    const handleStatusOpen = () => { setStatusOpen(true); };
    const handleStatusClose = () => { setStatusOpen(false); };

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
    // page refersh reload
    const handleCloseFilterMod = () => { setIsFilterOpen(false); };
    const handleClosePdfFilterMod = () => { setIsPdfFilterOpen(false); };

    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
    const handleClickOpenPopupMalert = () => { setOpenPopupMalert(true); };
    const handleClosePopupMalert = () => { setOpenPopupMalert(false); };

    const [openPopup, setOpenPopup] = useState(false);
    const [popupContent, setPopupContent] = useState("");
    const [popupSeverity, setPopupSeverity] = useState("");
    const handleClickOpenPopup = () => { setOpenPopup(true); };
    const handleClosePopup = () => { setOpenPopup(false); }

    //Datatable
    const [pageTeamLveVerif, setPageTeamLveVerif] = useState(1);
    const [pageSizeTeamLveVerif, setPageSizeTeamLveVerif] = useState(10);
    const [searchQueryTeamLveVerif, setSearchQueryTeamLveVerif] = useState("");
    const [totalPagesTeamLveVerif, setTotalPagesTeamLveVerif] = useState(1);

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const handleClickOpenerr = () => { setIsErrorOpen(true); };
    const handleCloseerr = () => { setIsErrorOpen(false); };

    // Manage Columns
    const [searchQueryManageTeamLveVerif, setSearchQueryManageTeamLveVerif] = useState("");
    const [isManageColumnsOpenTeamLveVerif, setManageColumnsOpenTeamLveVerif] = useState(false);
    const [anchorElTeamLveVerif, setAnchorElTeamLveVerif] = useState(null);

    const handleOpenManageColumnsTeamLveVerif = (event) => {
        setAnchorElTeamLveVerif(event.currentTarget);
        setManageColumnsOpenTeamLveVerif(true);
    };
    const handleCloseManageColumnsTeamLveVerif = () => {
        setManageColumnsOpenTeamLveVerif(false);
        setSearchQueryManageTeamLveVerif("");
    };

    const openTeamLveVerif = Boolean(anchorElTeamLveVerif);
    const idTeamLveVerif = openTeamLveVerif ? "simple-popover" : undefined;

    // Search bar
    const [anchorElSearchTeamLveVerif, setAnchorElSearchTeamLveVerif] = React.useState(null);
    const handleClickSearchTeamLveVerif = (event) => {
        setAnchorElSearchTeamLveVerif(event.currentTarget);
    };
    const handleCloseSearchTeamLveVerif = () => {
        setAnchorElSearchTeamLveVerif(null);
        setSearchQueryTeamLveVerif("");
    };

    const openSearchTeamLveVerif = Boolean(anchorElSearchTeamLveVerif);
    const idSearchTeamLveVerif = openSearchTeamLveVerif ? 'simple-popover' : undefined;

    // Table row color
    const getRowStyle = (params) => {
        if (params.node.rowIndex % 2 === 0) {
            return { background: '#f0f0f0' }; // Even row
        } else {
            return { background: '#ffffff' }; // Odd row
        }
    }

    useEffect(() => {
        getapi();
    }, []);

    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                'Authorization': `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("All Stock Details"),
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



    //webcam



    //add webcamera popup










    //---------------------------------------------------------------------------------------------------------------


    //------------------------------------------------------------------------------------------------------------






    // Show All Columns & Manage Columns
    const initialColumnVisibilityTeamLveVerif = {
        serialNumber: true,
        itemname: true,
        materialcode: true,
        totalCount: true,
        transferedCount: true,
        balanceCount: true,

        actions: true,
    };

    const [columnVisibilityTeamLveVerif, setColumnVisibilityTeamLveVerif] = useState(initialColumnVisibilityTeamLveVerif);

    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
    };








    //Project updateby edit page...

    //editing the single data...

    //get all Sub vendormasters.


    //get all Sub vendormasters.

    //id for login...

    useEffect(() => {
    }, [appleaveEdit, appleave,]);

    useEffect(() => {
        // fetchLeaveVerification();

    }, []);

    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        };
    }, []);

    const [items, setItems] = useState([]);

    const addSerialNumber = () => {
        const itemsWithSerialNumber = stockDatas;
        setItems(itemsWithSerialNumber);
        setFilteredDataItems(itemsWithSerialNumber);
    };

    useEffect(() => {
        addSerialNumber();
    }, [stockDatas]);


    const defaultColDef = useMemo(() => {
        return {
            filter: true,
            resizable: true,
            filterParams: {
                buttons: ["apply", "reset", "cancel"],
            },
        };
    }, []);

    const onGridReady = useCallback((params) => {
        setGridApi(params.api);
        setColumnApi(params.columnApi);
    }, []);

    // Function to handle filter changes
    const onFilterChanged = () => {
        if (gridApi) {
            const filterModel = gridApi.getFilterModel(); // Get the current filter model

            // Check if filters are active
            if (Object.keys(filterModel).length === 0) {
                // No filters active, clear the filtered data state
                setFilteredRowData([]);
            } else {
                // Filters are active, capture filtered data
                const filteredData = [];
                gridApi.forEachNodeAfterFilterAndSort((node) => {
                    filteredData.push(node.data); // Collect filtered row data
                });
                setFilteredRowData(filteredData);
            }
        }
    };

    const onPaginationChanged = useCallback(() => {
        if (gridRefTableTeamLveVerif.current) {
            const gridApi = gridRefTableTeamLveVerif.current.api;
            const currentPage = gridApi.paginationGetCurrentPage() + 1;
            const totalPagesTeamLveVerif = gridApi.paginationGetTotalPages();
            setPageTeamLveVerif(currentPage);
            setTotalPagesTeamLveVerif(totalPagesTeamLveVerif);
        }
    }, []);



    // Pagination for outer filter
    const filteredData = filteredDataItems?.slice((pageTeamLveVerif - 1) * pageSizeTeamLveVerif, pageTeamLveVerif * pageSizeTeamLveVerif);
    const totalPagesTeamLveVerifOuter = Math.ceil(filteredDataItems?.length / pageSizeTeamLveVerif);
    const visiblePages = Math.min(totalPagesTeamLveVerifOuter, 3);
    const firstVisiblePage = Math.max(1, pageTeamLveVerif - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPagesTeamLveVerifOuter);
    const pageNumbers = [];
    const indexOfLastItem = pageTeamLveVerif * pageSizeTeamLveVerif;
    const indexOfFirstItem = indexOfLastItem - pageSizeTeamLveVerif;
    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) { pageNumbers.push(i); }







    const columnDataTableTeamLveVerif = [
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 80,
            hide: !columnVisibilityTeamLveVerif.serialNumber,
            headerClassName: "bold-header", pinned: 'left', lockPinned: true,
        },

        {
            field: "itemname",
            headerName: "Stock Name",
            flex: 0,
            width: 200,
            hide: !columnVisibilityTeamLveVerif.itemname,
            headerClassName: "bold-header",
        },
        // {
        //     field: "materialcode",
        //     headerName: "Material Code",
        //     flex: 0,
        //     width: 200,
        //     hide: !columnVisibilityTeamLveVerif.materialcode,
        //     headerClassName: "bold-header",
        // },
        {
            field: "totalCount",
            headerName: "Total Count",
            flex: 0,
            width: 150,
            hide: !columnVisibilityTeamLveVerif.totalCount,
            headerClassName: "bold-header",
        },

        {
            field: "transferedCount",
            headerName: "Transfered Count",
            flex: 0,
            width: 200,
            hide: !columnVisibilityTeamLveVerif.transferedCount,
            headerClassName: "bold-header",
        },
        {
            field: "balanceCount",
            headerName: "Balance Count",
            flex: 0,
            width: 200,
            hide: !columnVisibilityTeamLveVerif.balanceCount,
            headerClassName: "bold-header",
        },




        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 200,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibilityTeamLveVerif.actions,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>



                    {isUserRoleCompare?.includes("vallstockdetails") && params?.data?.filter === "stock" && (

                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                window.open(`/asset/allstocklist/${params?.data?.id}`);
                            }}
                        >
                            <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
                        </Button>
                    )}


                </Grid>
            ),
        },

    ];

    // Datatable
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQueryTeamLveVerif(value);
        applyNormalFilter(value);
        setFilteredRowData([]);
    };



    const applyNormalFilter = (searchValue) => {

        // Split the search query into individual terms
        const searchTerms = searchValue.toLowerCase().split(" ");

        // Modify the filtering logic to check each term
        const filtered = items?.filter((item) => {
            return searchTerms.every((term) =>
                Object.values(item).join(" ").toLowerCase().includes(term)
            );
        });
        setFilteredDataItems(filtered);
        setPageTeamLveVerif(1);
    };

    const applyAdvancedFilter = (filters, logicOperator) => {
        // Apply filtering logic with multiple conditions
        const filtered = items?.filter((item) => {
            return filters.reduce((acc, filter, index) => {
                const { column, condition, value } = filter;
                const itemValue = String(item[column])?.toLowerCase();
                const filterValue = String(value).toLowerCase();

                let match;
                switch (condition) {
                    case "Contains":
                        match = itemValue.includes(filterValue);
                        break;
                    case "Does Not Contain":
                        match = !itemValue?.includes(filterValue);
                        break;
                    case "Equals":
                        match = itemValue === filterValue;
                        break;
                    case "Does Not Equal":
                        match = itemValue !== filterValue;
                        break;
                    case "Begins With":
                        match = itemValue.startsWith(filterValue);
                        break;
                    case "Ends With":
                        match = itemValue.endsWith(filterValue);
                        break;
                    case "Blank":
                        match = !itemValue;
                        break;
                    case "Not Blank":
                        match = !!itemValue;
                        break;
                    default:
                        match = true;
                }

                // Combine conditions with AND/OR logic
                if (index === 0) {
                    return match; // First filter is applied directly
                } else if (logicOperator === "AND") {
                    return acc && match;
                } else {
                    return acc || match;
                }
            }, true);
        });

        setFilteredDataItems(filtered);
        setAdvancedFilter(filters);
        // handleCloseSearchTeamLveVerif(); 
    };

    // Undo filter funtion
    const handleResetSearch = () => {
        setAdvancedFilter(null);
        setSearchQueryTeamLveVerif("");
        setFilteredDataItems(stockDatas);
    };

    // Show filtered combination in the search bar
    const getSearchDisplay = () => {
        if (advancedFilter && advancedFilter.length > 0) {
            return advancedFilter.map((filter, index) => {
                let showname = columnDataTableTeamLveVerif.find(col => col.field === filter.column)?.headerName;
                return `${showname} ${filter.condition} "${filter.value}"`;
            }).join(' ' + (advancedFilter.length > 1 ? advancedFilter[1].condition : '') + ' ');
        }
        return searchQueryTeamLveVerif;
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPagesTeamLveVerif) {
            setPageTeamLveVerif(newPage);
            gridRefTableTeamLveVerif.current.api.paginationGoToPage(newPage - 1);
        }
    };

    const handlePageSizeChange = (e) => {
        const newSize = Number(e.target.value);
        setPageSizeTeamLveVerif(newSize);
        if (gridApi) {
            gridApi.paginationSetPageSize(newSize);
        }
    };

    // Show All Columns functionality
    const handleShowAllColumns = () => {
        setColumnVisibilityTeamLveVerif(initialColumnVisibilityTeamLveVerif);
    };

    useEffect(() => {
        // Retrieve column visibility from localStorage (if available)
        const savedVisibility = localStorage.getItem("columnVisibilityTeamLveVerif");
        if (savedVisibility) {
            setColumnVisibilityTeamLveVerif(JSON.parse(savedVisibility));
        }
    }, []);

    useEffect(() => {
        // Save column visibility to localStorage whenever it changes
        localStorage.setItem("columnVisibilityTeamLveVerif", JSON.stringify(columnVisibilityTeamLveVerif));
    }, [columnVisibilityTeamLveVerif]);

    // // Function to filter columns based on search query
    const filteredColumns = columnDataTableTeamLveVerif.filter((column) =>
        column.headerName.toLowerCase().includes(searchQueryManageTeamLveVerif.toLowerCase())
    );

    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // Manage Columns functionality
    const toggleColumnVisibility = (field) => {
        if (!gridApi) return;

        setColumnVisibilityTeamLveVerif((prevVisibility) => {
            const newVisibility = !prevVisibility[field];

            // Update the visibility in the grid
            gridApi.setColumnVisible(field, newVisibility);

            return {
                ...prevVisibility,
                [field]: newVisibility,
            };
        });
    };

    const handleColumnMoved = useCallback(debounce((event) => {
        if (!event.columnApi) return;

        const visible_columns = event.columnApi.getAllColumns().filter(col => {
            const colState = event.columnApi.getColumnState().find(state => state.colId === col.colId);
            return colState && !colState.hide;
        }).map(col => col.colId);

        setColumnVisibilityTeamLveVerif((prevVisibility) => {
            const updatedVisibility = { ...prevVisibility };

            // Ensure columns that are visible stay visible
            Object.keys(updatedVisibility).forEach(colId => {
                updatedVisibility[colId] = visible_columns.includes(colId);
            });

            return updatedVisibility;
        });
    }, 300), []);

    const handleColumnVisible = useCallback((event) => {
        const colId = event.column.getColId();

        // Update visibility based on event, but only when explicitly triggered by grid
        setColumnVisibilityTeamLveVerif((prevVisibility) => ({
            ...prevVisibility,
            [colId]: event.visible, // Set visibility directly from the event
        }));
    }, []);

    // Excel
    const [fileFormat, setFormat] = useState('');
    let exportColumnNamescrt = [
        "Stock Name",
        // "Material Code",
        "Total Count",
        "Transfered Count",
        "Balance Count",
    ]
    let exportRowValuescrt = [
        "itemname",
        // "materialcode",
        "totalCount",
        "transferedCount",
        "balanceCount",
    ]

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "OverAll Stock Count",
        pageStyle: "print",
    });


    // image
    const handleCaptureImage = () => {
        if (gridRefImageTeamLveVerif.current) {
            domtoimage.toBlob(gridRefImageTeamLveVerif.current)
                .then((blob) => {
                    saveAs(blob, "OverAllStockCount.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    return (
        <Box>
            <Headtitle title={"OVERALL STOCK COUNT"} />

            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lallstockdetails") && (
                <>
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>
                                OverAll Stock Count
                            </Typography>
                        </Grid>
                        <Grid container spacing={2} style={userStyle.dataTablestyle}>
                            <Grid item md={2} xs={12} sm={12}>
                                <Box>
                                    <label>Show entries:</label>
                                    <Select
                                        id="pageSizeSelect"
                                        value={pageSizeTeamLveVerif}
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
                                        <MenuItem value={stockDatas?.length}>All</MenuItem>
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid
                                item
                                md={8}
                                xs={12}
                                sm={12}
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Box>
                                    {isUserRoleCompare?.includes(
                                        "excelallstockdetails"
                                    ) && (
                                            <>
                                                <Button onClick={(e) => {
                                                    setIsFilterOpen(true)
                                                    setFormat("xl")
                                                }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                            </>
                                        )}
                                    {isUserRoleCompare?.includes("csvallstockdetails") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes(
                                        "printallstockdetails"
                                    ) && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                    &ensp;
                                                    <FaPrint />
                                                    &ensp;Print&ensp;
                                                </Button>
                                            </>
                                        )}
                                    {isUserRoleCompare?.includes("pdfallstockdetails") && (
                                        <>
                                            <Button sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true)
                                                }}
                                            ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes(
                                        "imageallstockdetails"
                                    ) && (
                                            <Button
                                                sx={userStyle.buttongrp}
                                                onClick={handleCaptureImage}
                                            >
                                                {" "}
                                                <ImageIcon
                                                    sx={{ fontSize: "15px" }}
                                                /> &ensp;Image&ensp;{" "}
                                            </Button>
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
                                                        <IoMdOptions style={{ cursor: 'pointer', }} onClick={handleClickSearchTeamLveVerif} />
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
                        </Grid>  <br />
                        <Grid container spacing={1}>
                            <Grid item lg={1.5} md={1} xs={12} sm={6}>
                                <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
                                    Show All Columns
                                </Button>

                            </Grid>
                            <Grid item lg={1.5} md={1} xs={12} sm={6}>
                                <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsTeamLveVerif}>
                                    Manage Columns
                                </Button>
                            </Grid>
                        </Grid>
                        <br />
                        {!applyleaveCheck ? (
                            <>
                                <Box sx={{ display: "flex", justifyContent: "center" }}>
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
                        ) : (
                            <>
                                <Box sx={{ width: "100%", }} className={"ag-theme-quartz"} ref={gridRefImageTeamLveVerif} >
                                    <AgGridReact
                                        rowData={filteredDataItems}
                                        columnDefs={columnDataTableTeamLveVerif.filter((column) => columnVisibilityTeamLveVerif[column.field])}
                                        ref={gridRefTableTeamLveVerif}
                                        defaultColDef={defaultColDef}
                                        domLayout={"autoHeight"}
                                        getRowStyle={getRowStyle}
                                        pagination={true}
                                        paginationPageSize={pageSizeTeamLveVerif}
                                        onPaginationChanged={onPaginationChanged}
                                        onGridReady={onGridReady}
                                        onColumnMoved={handleColumnMoved}
                                        onColumnVisible={handleColumnVisible}
                                        onFilterChanged={onFilterChanged}
                                        // suppressPaginationPanel={true}
                                        suppressSizeToFit={true}
                                        suppressAutoSize={true}
                                        suppressColumnVirtualisation={true}
                                        colResizeDefault={"shift"}
                                        cellSelection={true}
                                        copyHeadersToClipboard={true}
                                    />
                                </Box>
                                {/* <Box style={userStyle.dataTablestyle}>
                  <Box>
                    Showing{" "}
                    {
                      gridApi && gridApi.getFilterModel() && Object.keys(gridApi.getFilterModel()).length === 0 ? (
                        (filteredDataItems.length > 0 ? (pageTeamLveVerif - 1) * pageSizeTeamLveVerif + 1 : 0)
                      ) : (
                        filteredRowData.length > 0 ? (pageTeamLveVerif - 1) * pageSizeTeamLveVerif + 1 : 0
                      )
                    }{" "}to{" "}
                    {
                      gridApi && gridApi.getFilterModel() && Object.keys(gridApi.getFilterModel()).length === 0 ? (
                        Math.min(pageTeamLveVerif * pageSizeTeamLveVerif, filteredDataItems.length)
                      ) : (
                        filteredRowData.length > 0 ? Math.min(pageTeamLveVerif * pageSizeTeamLveVerif, filteredRowData.length) : 0
                      )
                    }{" "}of{" "}
                    {
                      gridApi && gridApi.getFilterModel() && Object.keys(gridApi.getFilterModel()).length === 0 ? (
                        filteredDataItems.length
                      ) : (
                        filteredRowData.length
                      )
                    } entries
                  </Box>
                  <Box>
                    <Button onClick={() => handlePageChange(1)} disabled={pageTeamLveVerif === 1} sx={userStyle.paginationbtn}  > <FirstPageIcon /> </Button>
                    <Button onClick={() => handlePageChange(pageTeamLveVerif - 1)} disabled={pageTeamLveVerif === 1} sx={userStyle.paginationbtn}  > <NavigateBeforeIcon />  </Button>
                    {getVisiblePageNumbers().map((pageNumber, index) => (
                      <Button
                        key={index}
                        onClick={() => pageNumber !== "..." && handlePageChange(pageNumber)}
                        sx={{
                          ...userStyle.paginationbtn,
                          ...(pageNumber === "..." && {
                            cursor: "default",
                            color: "black",
                            fontSize: '12px',
                            fontWeight: 'bold',
                            backgroundColor: "transparent",
                            border: "none",
                            "&:hover": {
                              backgroundColor: "transparent",
                              boxShadow: "none",
                            },
                          }),
                        }}
                        className={pageTeamLveVerif === pageNumber ? "active" : ""}
                        disabled={pageTeamLveVerif === pageNumber}
                      >
                        {pageNumber}
                      </Button>
                    ))}
                    <Button onClick={() => handlePageChange(pageTeamLveVerif + 1)} disabled={pageTeamLveVerif === totalPagesTeamLveVerif} sx={userStyle.paginationbtn} > <NavigateNextIcon /> </Button>
                    <Button onClick={() => handlePageChange(totalPagesTeamLveVerif)} disabled={pageTeamLveVerif === totalPagesTeamLveVerif} sx={userStyle.paginationbtn} ><LastPageIcon /> </Button>
                  </Box>
                </Box> */}
                            </>
                        )}
                    </Box>
                </>
            )}

            {/* Manage Column */}
            <Popover
                id={idTeamLveVerif}
                open={isManageColumnsOpenTeamLveVerif}
                anchorEl={anchorElTeamLveVerif}
                onClose={handleCloseManageColumnsTeamLveVerif}
                anchorOrigin={{ vertical: "bottom", horizontal: "left", }}
            >
                <ManageColumnsContent
                    handleClose={handleCloseManageColumnsTeamLveVerif}
                    searchQuery={searchQueryManageTeamLveVerif}
                    setSearchQuery={setSearchQueryManageTeamLveVerif}
                    filteredColumns={filteredColumns}
                    columnVisibility={columnVisibilityTeamLveVerif}
                    toggleColumnVisibility={toggleColumnVisibility}
                    setColumnVisibility={setColumnVisibilityTeamLveVerif}
                    initialColumnVisibility={initialColumnVisibilityTeamLveVerif}
                    columnDataTable={columnDataTableTeamLveVerif}
                />
            </Popover>

            {/* Search Bar */}
            <Popover
                id={idSearchTeamLveVerif}
                open={openSearchTeamLveVerif}
                anchorEl={anchorElSearchTeamLveVerif}
                onClose={handleCloseSearchTeamLveVerif}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }}
            >
                <AdvancedSearchBar columns={columnDataTableTeamLveVerif?.filter(data => data.field && data.field !== 'actions')} onSearch={applyAdvancedFilter} initialSearchValue={searchQueryTeamLveVerif} handleCloseSearch={handleCloseSearchTeamLveVerif} />
            </Popover>



            {/* ALERT DIALOG */}
            <Box>
                <Dialog
                    open={isErrorOpen}
                    onClose={handleCloseerr}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}          >
                        <Typography variant="h6">{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error" onClick={handleCloseerr}>
                            ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
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
                filteredDataTwo={(filteredRowData.length > 0 ? filteredRowData : filteredData) ?? []}
                itemsTwo={items ?? []}
                filename={"OverAllStockCount"}
                exportColumnNames={exportColumnNamescrt}
                exportRowValues={exportRowValuescrt}
                componentRef={componentRef}
            />


        </Box>
    );
}

export default OverAllStockCount;