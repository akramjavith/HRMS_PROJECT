import React, { useState, useEffect, useRef, useContext, useMemo, useCallback } from "react";
import { FaFileExcel, FaFileCsv, FaPrint, FaFilePdf, FaUndoAlt, FaSearch } from 'react-icons/fa';
import { Box, Typography, OutlinedInput, Select, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Button, Popover, IconButton, InputAdornment, Tooltip } from "@mui/material";
import { userStyle, colourStyles } from "../../../pageStyle";
import { StyledTableCell } from "../../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import { handleApiError } from "../../../components/Errorhandling";
import { useReactToPrint } from "react-to-print";
import moment from "moment";
import { UserRoleAccessContext, AuthContext } from "../../../context/Appcontext";
import { ThreeDots } from "react-loader-spinner";
import Selects from "react-select";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import { DeleteConfirmation } from "../../../components/DeleteConfirmation.js";
import { IoMdOptions } from "react-icons/io";
import { MdClose } from "react-icons/md";
import domtoimage from 'dom-to-image';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import ExportData from "../../../components/ExportData";
import MessageAlert from "../../../components/MessageAlert";
import AlertDialog from "../../../components/Alert";
import AdvancedSearchBar from '../../../components/SearchbarEbList.js';
import ManageColumnsContent from "../../../components/ManageColumn";
import ResizeObserver from 'resize-observer-polyfill';
window.ResizeObserver = ResizeObserver;

function ShiftAdjustmentListTable({ allUsersAdjTable, adjApply, fetchUsers, filteredDataItemsAdjList, setFilteredDataItemsAdjList }) {

    const gridRefTableAdjList = useRef(null);
    const gridRefImageAdjList = useRef(null);
    const { auth } = useContext(AuthContext);
    const { isUserRoleCompare, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);
    const [itemsSetTable, setItemsSetTable] = useState([]);
    const [shiftRoasterAdjStatusEdit, setShiftRoasterAdjStatusEdit] = useState({})

    // State to track advanced filter
    const [advancedFilterAdjList, setAdvancedFilterAdjList] = useState(null);
    const [gridApiAdjList, setGridApiAdjList] = useState(null);
    const [columnApiAdjList, setColumnApiAdjList] = useState(null);
    const [filteredRowDataAdjList, setFilteredRowDataAdjList] = useState([]);

    // Datatable Set Table
    const [pageAdjList, setPageAdjList] = useState(1);
    const [pageSizeAdjList, setPageSizeAdjList] = useState(10);
    const [searchQueryAdjList, setSearchQuerAdjList] = useState("");
    const [totalPagesAdjList, setTotalPagesAdjList] = useState(1);

    // Edit model
    const [openEdit, setOpenEdit] = useState(false);
    const handleClickOpenEdit = () => { setOpenEdit(true); };
    const handleCloseEdit = () => { setOpenEdit(false); setShiftRoasterAdjStatusEdit({ adjstatus: "" }) }

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const handleClickOpenerr = () => { setIsErrorOpen(true); };
    const handleCloseerr = () => { setIsErrorOpen(false); };

    const [isFilterOpenAdjList, setIsFilterOpenAdjList] = useState(false);
    const [isPdfFilterOpenAdjList, setIsPdfFilterOpenAdjList] = useState(false);
    // page refersh reload
    const handleCloseFilterModAdjList = () => { setIsFilterOpenAdjList(false); };
    const handleClosePdfFilterModAdjList = () => { setIsPdfFilterOpenAdjList(false); };

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

    //Delete model
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const handleClickOpen = () => { setIsDeleteOpen(true); };
    const handleCloseMod = () => { setIsDeleteOpen(false); };

    // Manage Columns
    const [searchQueryManageAdjList, setSearchQueryManageAdjList] = useState("");
    const [isManageColumnsOpenAdjList, setManageColumnsOpenAdjList] = useState(false);
    const [anchorElAdjList, setAnchorElAdjList] = useState(null);

    const handleOpenManageColumnsAdjList = (event) => {
        setAnchorElAdjList(event.currentTarget);
        setManageColumnsOpenAdjList(true);
    };
    const handleCloseManageColumnsAdjList = () => {
        setManageColumnsOpenAdjList(false);
        setSearchQueryManageAdjList("");
    };

    const openAdjList = Boolean(anchorElAdjList);
    const idAdjList = openAdjList ? "simple-popover" : undefined;

    // Search bar
    const [anchorElSearchAdjList, setAnchorElSearchAdjList] = React.useState(null);
    const handleClickSearchAdjList = (event) => {
        setAnchorElSearchAdjList(event.currentTarget);
    };
    const handleCloseSearchAdjList = () => {
        setAnchorElSearchAdjList(null);
        setSearchQuerAdjList("");
    };

    const openSearchAdjList = Boolean(anchorElSearchAdjList);
    const idSearchAdjList = openSearchAdjList ? 'simple-popover' : undefined;

    // Table row color
    const getRowStyle = (params) => {
        if (params.node.rowIndex % 2 === 0) {
            return { background: '#f0f0f0' }; // Even row
        } else {
            return { background: '#ffffff' }; // Odd row
        }
    }

    const getColumnStyle = (params) => {
        if (params.data.adjustmenttype === 'Shift Adjustment' || params.data.adjustmenttype === 'Shift Weekoff Swap' || params.data.adjustmenttype === 'WeekOff Adjustment') {
            return { 'white-space': 'pre-wrap', lineHeight: '1.5' };
        }
        return null;  // Default style if not matched
    };

    const getRowHeight = (params) => {
        // If found, return the desired row height
        if (params.node.data.adjustmenttype === 'Shift Adjustment' || params.node.data.adjustmenttype === 'Shift Weekoff Swap' || params.node.data.adjustmenttype === 'WeekOff Adjustment') {
            return 80; // Adjust this value as needed
        }

        // Return null to use default row height for other rows
        return 50;
    };

    // Show All Columns & Manage Columns
    const initialColumnVisibilityAdjList = {
        serialNumber: true,
        checkbox: true,
        branch: true,
        unit: true,
        team: true,
        username: true,
        empcode: true,
        adjapplydate: true,
        adjustmenttype: true,
        request: true,
        reason: true,
        adjstatus: true,
        actions: true,
    };

    const [columnVisibilityAdjList, setColumnVisibilityAdjList] = useState(initialColumnVisibilityAdjList);

    useEffect(() => {
        setFilteredDataItemsAdjList(allUsersAdjTable);
    }, []);

    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
    };

    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        };
    }, []);

    const adjtypeoptions = [
        { label: "Approved", value: "Approved" },
        { label: "Reject", value: "Reject" },
    ];

    //get single row to edit....
    const getCode = async (e, shifallotid) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            res?.data?.suser.shiftallot.filter((d) => {
                if (d._id == shifallotid) {
                    setShiftRoasterAdjStatusEdit({
                        ...d,
                        adjstatus: d.adjstatus == "Adjustment" ? "Not Approved" : ""
                    })
                }
            })

        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const [userOuterId, setUserOuterId] = useState("");
    const [AdjListInnerId, setAdjListInnterId] = useState("");
    const getCodeForDelete = (e, shifallotid) => {
        setUserOuterId(e);
        setAdjListInnterId(shifallotid);
        handleClickOpen();
    };

    const sendRequest = async () => {
        setPageName(!pageName)
        try {

            let res = await axios.post(SERVICE.USER_SHIFTALLOT_UPDATE_STATUS, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                shiftallotsarray: [
                    {
                        ...shiftRoasterAdjStatusEdit,
                        adjstatus: String(shiftRoasterAdjStatusEdit.adjstatus),
                    }
                ]
            })
            fetchUsers();
            handleCloseEdit();

        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const deleteShiftAllot = async () => {
        setPageName(!pageName);
        try {
            await axios.post(SERVICE.USER_SHIFTALLOT_DELETE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                outerId: userOuterId,
                innerId: AdjListInnerId
            });
            await fetchUsers();
            handleCloseMod();
            setPageAdjList(1);
            setPopupContent("Undone Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const addSerialNumberSetTable = () => {
        const itemsWithSerialNumber = allUsersAdjTable?.map((item, index) => ({
            ...item,
            serialNumber: index + 1,
            id: item._id,
            adjapplydate: item.adjstatus === "Not Allotted" ? moment(item.removedondate).format("DD-MM-YYYY") + " " + item.removedontime : moment(item.adjapplydate).format("DD-MM-YYYY") + " " + item.adjapplytime,
            reason: item.adjchangereason,
            adjustmenttype: item.adjstatus === "Not Allotted" ? "Not Allotted" : item.adjustmenttype,
            adjstatus: item.adjstatus === "Not Allotted" ? "Not Allotted" : item.adjstatus === "Approved" ? "Approved" : item.adjstatus === "Reject" ? "Reject" : "Not Approved",
            request: item.adjstatus === "Not Allotted" ?
                (`Not Allotted : ${item.adjdate}`) :
                item.adjustmenttype === "Shift Weekoff Swap" ?
                    (`Allot Weekoff Date : ${item.adjdate} Swap To : ${item.todate} Shift : Weekoff Request Shift 1st : ${item.adjchangeshiftime}`) :
                    item.adjustmenttype === "WeekOff Adjustment" ?
                        (`Week off Date : ${item.adjdate} Adjustment For : ${item.todate} Shift : ${item.selectedShifTime} Request Shift 1st : ${item.adjchangeshiftime}`) :
                        item.adjustmenttype === "Shift Adjustment" ?
                            (`Date : ${item.selectedDate} Shift : ${item.selectedShifTime} Adjustment to : ${item.adjdate} 2nd : ${item.pluseshift}`)
                            : (`${item.adjustmenttype} : ${item.adjdate}`),
        }));
        setItemsSetTable(itemsWithSerialNumber);
        setFilteredDataItemsAdjList(itemsWithSerialNumber);
    };

    useEffect(() => {
        addSerialNumberSetTable();
    }, [allUsersAdjTable]);

    const defaultColDef = useMemo(() => {
        return {
            filter: true,
            resizable: true,
            filterParams: {
                buttons: ["apply", "reset", "cancel"],
            },
        };
    }, []);

    const onGridReadyAdjList = useCallback((params) => {
        setGridApiAdjList(params.api);
        setColumnApiAdjList(params.columnApiAdjList);
    }, []);

    // Function to handle filter changes
    const onFilterChangedAdjList = () => {
        if (gridApiAdjList) {
            const filterModel = gridApiAdjList.getFilterModel(); // Get the current filter model

            // Check if filters are active
            if (Object.keys(filterModel).length === 0) {
                // No filters active, clear the filtered data state
                setFilteredRowDataAdjList([]);
            } else {
                // Filters are active, capture filtered data
                const filteredDataAdjList = [];
                gridApiAdjList.forEachNodeAfterFilterAndSort((node) => {
                    filteredDataAdjList.push(node.data); // Collect filtered row data
                });
                setFilteredRowDataAdjList(filteredDataAdjList);
            }
        }
    };

    const onPaginationChangedAdjList = useCallback(() => {
        if (gridRefTableAdjList.current) {
            const gridApiAdjList = gridRefTableAdjList.current.api;
            const currentPage = gridApiAdjList.paginationGetCurrentPage() + 1;
            const totalPagesAdjList = gridApiAdjList.paginationGetTotalPages();
            setPageAdjList(currentPage);
            setTotalPagesAdjList(totalPagesAdjList);
        }
    }, []);

    const columnDataTableAdjList = [
        { field: "serialNumber", headerName: "SNo", flex: 0, width: 80, hide: !columnVisibilityAdjList.serialNumber, headerClassName: "bold-header", pinned: 'left', lockPinned: true },
        { field: "empcode", headerName: "Emp Code", flex: 0, width: 150, hide: !columnVisibilityAdjList.empcode, headerClassName: "bold-header", pinned: 'left', lockPinned: true, },
        { field: "username", headerName: "Name", flex: 0, width: 200, hide: !columnVisibilityAdjList.username, headerClassName: "bold-header", pinned: 'left', lockPinned: true, },
        { field: "branch", headerName: "Branch", flex: 0, width: 120, hide: !columnVisibilityAdjList.branch, headerClassName: "bold-header" },
        { field: "unit", headerName: "Unit", flex: 0, width: 120, hide: !columnVisibilityAdjList.unit, headerClassName: "bold-header" },
        { field: "team", headerName: "Team", flex: 0, width: 120, hide: !columnVisibilityAdjList.team, headerClassName: "bold-header" },
        { field: "adjapplydate", headerName: "Apply Date", flex: 0, width: 160, hide: !columnVisibilityAdjList.adjapplydate, headerClassName: "bold-header" },
        { field: "adjustmenttype", headerName: "Adjustment", flex: 0, width: 150, hide: !columnVisibilityAdjList.adjustmenttype, headerClassName: "bold-header" },
        { field: "request", headerName: "Request", flex: 0, width: 250, hide: !columnVisibilityAdjList.request, headerClassName: "bold-header", autoHeight: true, cellStyle: getColumnStyle, },
        { field: "reason", headerName: "Reason", flex: 0, width: 200, hide: !columnVisibilityAdjList.reason, headerClassName: "bold-header" },
        {
            field: "adjstatus",
            headerName: "Status",
            flex: 0,
            width: 110,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibilityAdjList.adjstatus,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    <Grid >
                        <Button variant="contained" sx={{ padding: '0px 5px', fontSize: '11px', textTransform: 'capitalize', opacity: '0.9', pointerEvents: "none" }} color={params.data.adjstatus === 'Not Approved' ? 'warning' : params.data.adjstatus === 'Approved' ? 'success' : 'error'}>
                            {params.data.adjstatus}
                        </Button>
                    </Grid>
                </Grid>
            ),
        },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 95,
            minHeight: "40px !important",
            filter: false,
            sortable: false,
            hide: !columnVisibilityAdjList.actions,
            headerClassName: "bold-header",
            cellRenderer: (params) => {
                return (
                    params.data.adjstatus === "Not Approved" ? (
                        <Grid sx={{ display: "flex" }}>
                            {isUserRoleCompare?.includes("eshiftadjustment") && (
                                <StyledTableCell>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        size="small"
                                        sx={{ marginTop: '10px', fontSize: '35px', height: '25px', minWidth: "15px", marginTop: '0px', marginRight: '5px' }}
                                        onClick={() => {
                                            handleClickOpenEdit();
                                            getCode(params.data.userid, params.data.id);
                                        }}
                                    >
                                        <Typography sx={{ fontSize: '50px', marginTop: '-28px !important' }}>.</Typography>
                                    </Button>
                                </StyledTableCell>
                            )}
                        </Grid >
                    ) : (
                        <Grid sx={{ display: "flex" }}>
                            {isUserRoleCompare?.includes("dshiftadjustment") && (
                                <Button sx={{ marginTop: '10px' }} onClick={() => { getCodeForDelete(params.data.userid, params.data.id); }}>
                                    <FaUndoAlt style={{ fontsize: "large", marginLeft: '-12px' }} />
                                </Button>
                            )}
                        </Grid >
                    )
                );
            },
        },
    ];

    // Datatable
    const handleSearchChangeAdjList = (e) => {
        const value = e.target.value;
        setSearchQuerAdjList(value);
        applyNormalFilterAdjList(value);
        setFilteredRowDataAdjList([]);
    };

    const applyNormalFilterAdjList = (searchValue) => {
        // Split the search query into individual terms
        const searchTerms = searchValue.toLowerCase().split(" ");

        // Modify the filtering logic to check each term
        const filtered = itemsSetTable?.filter((item) => {
            return searchTerms.every((term) =>
                Object.values(item).join(" ").toLowerCase().includes(term)
            );
        });
        setFilteredDataItemsAdjList(filtered);
        setPageAdjList(1);
    };

    const applyAdvancedFilterAdjList = (filters, logicOperator) => {
        // Apply filtering logic with multiple conditions
        const filtered = itemsSetTable?.filter((item) => {
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

        setFilteredDataItemsAdjList(filtered); // Update filtered data
        setAdvancedFilterAdjList(filters);
        // handleCloseSearchAdjList(); // Close the popover after search
    };

    // Undo filter funtion
    const handleResetSearchAdjList = () => {
        setAdvancedFilterAdjList(null);
        setSearchQuerAdjList("");
        setFilteredDataItemsAdjList(itemsSetTable);
    };

    // Show filtered combination in the search bar
    const getSearchDisplayAdjList = () => {
        if (advancedFilterAdjList && advancedFilterAdjList.length > 0) {
            return advancedFilterAdjList.map((filter, index) => {
                let showname = columnDataTableAdjList.find(col => col.field === filter.column)?.headerName;
                return `${showname} ${filter.condition} "${filter.value}"`;
            }).join(' ' + (advancedFilterAdjList.length > 1 ? advancedFilterAdjList[1].condition : '') + ' ');
        }
        return searchQueryAdjList;
    };

    const handlePageChangeAdjList = (newPage) => {
        if (newPage >= 1 && newPage <= totalPagesAdjList) {
            setPageAdjList(newPage);
            gridRefTableAdjList.current.api.paginationGoToPage(newPage - 1);
        }
    };

    const handlePageSizeChangeAdjList = (e) => {
        const newSize = Number(e.target.value);
        setPageSizeAdjList(newSize);
        if (gridApiAdjList) {
            gridApiAdjList.paginationSetPageSize(newSize);
        }
    };

    // Show All Columns functionality
    const handleShowAllColumnsAdjList = () => {
        const updatedVisibility = { ...columnVisibilityAdjList };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibilityAdjList(updatedVisibility);
    };

    useEffect(() => {
        // Retrieve column visibility from localStorage (if available)
        const savedVisibility = localStorage.getItem("columnVisibilityAdjList");
        if (savedVisibility) {
            setColumnVisibilityAdjList(JSON.parse(savedVisibility));
        }
    }, []);

    useEffect(() => {
        // Save column visibility to localStorage whenever it changes
        localStorage.setItem("columnVisibilityAdjList", JSON.stringify(columnVisibilityAdjList));
    }, [columnVisibilityAdjList]);

    // // Function to filter columns based on search query
    const filteredColumns = columnDataTableAdjList.filter((column) => column.headerName.toLowerCase().includes(searchQueryManageAdjList.toLowerCase()));

    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // Manage Columns functionality
    const toggleColumnVisibilityAdjList = (field) => {
        if (!gridApiAdjList) return;

        setColumnVisibilityAdjList((prevVisibility) => {
            const newVisibility = !prevVisibility[field];

            // Update the visibility in the grid
            gridApiAdjList.setColumnVisible(field, newVisibility);

            return {
                ...prevVisibility,
                [field]: newVisibility,
            };
        });
    };

    const handleColumnMovedAdjList = useCallback(debounce((event) => {
        if (!event.columnApiAdjList) return;

        const visible_columns = event.columnApiAdjList.getAllColumns().filter(col => {
            const colState = event.columnApiAdjList.getColumnState().find(state => state.colId === col.colId);
            return colState && !colState.hide;
        }).map(col => col.colId);

        setColumnVisibilityAdjList((prevVisibility) => {
            const updatedVisibility = { ...prevVisibility };

            // Ensure columns that are visible stay visible
            Object.keys(updatedVisibility).forEach(colId => {
                updatedVisibility[colId] = visible_columns.includes(colId);
            });

            return updatedVisibility;
        });
    }, 300), []);

    const handleColumnVisibleAdjList = useCallback((event) => {
        const colId = event.column.getColId();

        // Update visibility based on event, but only when explicitly triggered by grid
        setColumnVisibilityAdjList((prevVisibility) => ({
            ...prevVisibility,
            [colId]: event.visible, // Set visibility directly from the event
        }));
    }, []);

    // Excel
    const [fileFormatAdjList, setFormatAdjList] = useState('');
    let exportColumnNamescrt = ["Branch", "Unit", "Team", "Name", "Emp Code", "Apply Date", "Adjustment", "Request", "Reason", "Status",]
    let exportRowValuescrt = ["branch", "unit", "team", "username", "empcode", "adjapplydate", "adjustmenttype", "request", "reason", "adjstatus"]

    // print...
    const componentRefAdjList = useRef();
    const handleprintAdjList = useReactToPrint({
        content: () => componentRefAdjList.current,
        documentTitle: "Adjustment Apply List",
        pageStyle: "print",
    });

    // image
    const handleCaptureImageAdjList = () => {
        if (gridRefImageAdjList.current) {
            domtoimage.toBlob(gridRefImageAdjList.current)
                .then((blob) => {
                    saveAs(blob, "Adjustment Apply List.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    // Pagination for innter filter
    const getVisiblePageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 3;

        const startPage = Math.max(1, pageSizeAdjList - 1);
        const endPage = Math.min(totalPagesAdjList, startPage + maxVisiblePages - 1);

        // Loop through and add visible pageSizeAdjList numbers
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        // If there are more pages after the last visible pageSizeAdjList, show ellipsis
        if (endPage < totalPagesAdjList) {
            pageNumbers.push("...");
        }

        return pageNumbers;
    };

    // Pagination for outer filter
    const filteredDataAdjList = filteredDataItemsAdjList?.slice((pageAdjList - 1) * pageSizeAdjList, pageAdjList * pageSizeAdjList);
    const totalPagesAdjListOuter = Math.ceil(filteredDataItemsAdjList?.length / pageSizeAdjList);
    const visiblePages = Math.min(totalPagesAdjListOuter, 3);
    const firstVisiblePage = Math.max(1, pageAdjList - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPagesAdjListOuter);
    const pageNumbers = [];
    const indexOfLastItem = pageAdjList * pageSizeAdjList;
    const indexOfFirstItem = indexOfLastItem - pageSizeAdjList;
    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) { pageNumbers.push(i); }

    return (
        <Box>
            {/* ****** Header Content ****** */}
            <Typography sx={userStyle.HeaderText}>Adjustment Apply List and Status</Typography>

            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lshiftadjustment") && (
                <>
                    <Box sx={userStyle.container}>
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}> Adjustment Apply List and Status </Typography>
                        </Grid>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid container style={userStyle.dataTablestyle}>
                            <Grid item md={2} xs={12} sm={12}>
                                <Box>
                                    <label>Show entries:</label>
                                    <Select size="small"
                                        id="pageSizeSelect"
                                        value={pageSizeAdjList}
                                        MenuProps={{
                                            PaperProps: {
                                                style: {
                                                    maxHeight: 180,
                                                    width: 80,
                                                },
                                            },
                                        }}
                                        onChange={handlePageSizeChangeAdjList}
                                        sx={{ width: "77px" }}
                                    >
                                        <MenuItem value={1}>1</MenuItem>
                                        <MenuItem value={5}>5</MenuItem>
                                        <MenuItem value={10}>10</MenuItem>
                                        <MenuItem value={25}>25</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
                                        <MenuItem value={100}>100</MenuItem>
                                        <MenuItem value={allUsersAdjTable?.length}>All</MenuItem>
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Box>
                                    {isUserRoleCompare?.includes("excelshiftadjustment") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpenAdjList(true)
                                                setFormatAdjList("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvshiftadjustment") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpenAdjList(true)
                                                setFormatAdjList("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printshiftadjustment") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprintAdjList}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfshiftadjustment") && (
                                        <>
                                            <Button sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpenAdjList(true)
                                                }}
                                            ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imageshiftadjustment") && (
                                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImageAdjList}>
                                            {" "}
                                            <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
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
                                                {advancedFilterAdjList && (
                                                    <IconButton onClick={handleResetSearchAdjList}>
                                                        <MdClose />
                                                    </IconButton>
                                                )}
                                                <Tooltip title="Show search options">
                                                    <span>
                                                        <IoMdOptions style={{ cursor: 'pointer', }} onClick={handleClickSearchAdjList} />
                                                    </span>
                                                </Tooltip>
                                            </InputAdornment>}
                                        aria-describedby="outlined-weight-helper-text"
                                        inputProps={{ 'aria-label': 'weight', }}
                                        type="text"
                                        value={getSearchDisplayAdjList()}
                                        onChange={handleSearchChangeAdjList}
                                        placeholder="Type to search..."
                                        disabled={!!advancedFilterAdjList}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>  <br />
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumnsAdjList}>  Show All Columns </Button>&ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsAdjList}> Manage Columns  </Button><br /><br />
                        {adjApply ?
                            <>
                                <Box sx={{ display: "flex", justifyContent: "center" }}>
                                    <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                                </Box>
                            </> :
                            <>
                                <Box sx={{ width: "100%", }} className={"ag-theme-quartz"} ref={gridRefImageAdjList} >
                                    <AgGridReact
                                        rowData={filteredDataItemsAdjList}
                                        columnDefs={columnDataTableAdjList.filter((column) => columnVisibilityAdjList[column.field])}
                                        ref={gridRefTableAdjList}
                                        defaultColDef={defaultColDef}
                                        domLayout={"autoHeight"}
                                        getRowStyle={getRowStyle}
                                        getRowHeight={getRowHeight}
                                        pagination={true}
                                        paginationPageSize={pageSizeAdjList}
                                        onPaginationChanged={onPaginationChangedAdjList}
                                        onGridReady={onGridReadyAdjList}
                                        onColumnMoved={handleColumnMovedAdjList}
                                        onColumnVisible={handleColumnVisibleAdjList}
                                        onFilterChanged={onFilterChangedAdjList}
                                        // suppressPaginationPanel={true}
                                        suppressSizeToFit={true}
                                        suppressAutoSize={true}
                                        suppressColumnVirtualisation={true}
                                        colResizeDefault={"shift"}
                                        cellSelection={true}
                                        copyHeadersToClipboard={true}
                                    />
                                </Box>
                                {/* show and hide based on the inner filter and outer filter */}
                                {/* <Box style={userStyle.dataTablestyle}>
                                    <Box>
                                        Showing{" "}
                                        {
                                            gridApi && gridApi.getFilterModel() && Object.keys(gridApi.getFilterModel()).length === 0 ? (
                                                (filteredDataItemsAdjList.length > 0 ? (pageAdjList - 1) * pageSizeAdjList + 1 : 0)
                                            ) : (
                                                filteredRowDataAdjList.length > 0 ? (pageAdjList - 1) * pageSizeAdjList + 1 : 0
                                            )
                                        }{" "}to{" "}
                                        {
                                            gridApi && gridApi.getFilterModel() && Object.keys(gridApi.getFilterModel()).length === 0 ? (
                                                Math.min(pageAdjList * pageSizeAdjList, filteredDataItemsAdjList.length)
                                            ) : (
                                                filteredRowDataAdjList.length > 0 ? Math.min(pageAdjList * pageSizeAdjList, filteredRowDataAdjList.length) : 0
                                            )
                                        }{" "}of{" "}
                                        {
                                            gridApi && gridApi.getFilterModel() && Object.keys(gridApi.getFilterModel()).length === 0 ? (
                                                filteredDataItemsAdjList.length
                                            ) : (
                                                filteredRowDataAdjList.length
                                            )
                                        } entries
                                    </Box>
                                    <Box>
                                        <Button onClick={() => handlePageChangeAdjList(1)} disabled={pageAdjList === 1} sx={userStyle.paginationbtn}  > <FirstPageIcon /> </Button>
                                        <Button onClick={() => handlePageChangeAdjList(pageAdjList - 1)} disabled={pageAdjList === 1} sx={userStyle.paginationbtn}  > <NavigateBeforeIcon />  </Button>
                                        {getVisiblePageNumbersAdjList().map((pageNumber, index) => (
                                            <Button
                                                key={index}
                                                onClick={() => pageNumber !== "..." && handlePageChangeAdjList(pageNumber)}
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
                                                className={pageAdjList === pageNumber ? "active" : ""}
                                                disabled={pageAdjList === pageNumber}
                                            >
                                                {pageNumber}
                                            </Button>
                                        ))}
                                        <Button onClick={() => handlePageChangeAdjList(pageAdjList + 1)} disabled={pageAdjList === totalPagesAdjList} sx={userStyle.paginationbtn} > <NavigateNextIcon /> </Button>
                                        <Button onClick={() => handlePageChangeAdjList(totalPagesAdjList)} disabled={pageAdjList === totalPagesAdjList} sx={userStyle.paginationbtn} ><LastPageIcon /> </Button>
                                    </Box>
                                </Box> */}
                            </>
                        }
                    </Box>

                </>
            )}<br />

            {/* Manage Column */}
            <Popover
                id={idAdjList}
                open={isManageColumnsOpenAdjList}
                anchorEl={anchorElAdjList}
                onClose={handleCloseManageColumnsAdjList}
                anchorOrigin={{ vertical: "bottom", horizontal: "left", }}
            >
                <ManageColumnsContent
                    handleClose={handleCloseManageColumnsAdjList}
                    searchQuery={searchQueryManageAdjList}
                    setSearchQuery={setSearchQueryManageAdjList}
                    filteredColumns={filteredColumns}
                    columnVisibility={columnVisibilityAdjList}
                    toggleColumnVisibility={toggleColumnVisibilityAdjList}
                    setColumnVisibility={setColumnVisibilityAdjList}
                    initialColumnVisibility={initialColumnVisibilityAdjList}
                    columnDataTable={columnDataTableAdjList}
                />
            </Popover>

            {/* Search Bar */}
            <Popover
                id={idSearchAdjList}
                open={openSearchAdjList}
                anchorEl={anchorElSearchAdjList}
                onClose={handleCloseSearchAdjList}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }}
            >
                <AdvancedSearchBar columns={columnDataTableAdjList.filter(data => data.field !== 'actions')} onSearch={applyAdvancedFilterAdjList} initialSearchValue={searchQueryAdjList} handleCloseSearch={handleCloseSearchAdjList} />
            </Popover>

            {/* ALERT DIALOG */}
            < Box >
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
            </Box >
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
                isFilterOpen={isFilterOpenAdjList}
                handleCloseFilterMod={handleCloseFilterModAdjList}
                fileFormat={fileFormatAdjList}
                setIsFilterOpen={setIsFilterOpenAdjList}
                isPdfFilterOpen={isPdfFilterOpenAdjList}
                setIsPdfFilterOpen={setIsPdfFilterOpenAdjList}
                handleClosePdfFilterMod={handleClosePdfFilterModAdjList}
                filteredDataTwo={(filteredRowDataAdjList.length > 0 ? filteredRowDataAdjList : filteredDataAdjList) ?? []}
                itemsTwo={itemsSetTable ?? []}
                filename={"Adjustment Apply List"}
                exportColumnNames={exportColumnNamescrt}
                exportRowValues={exportRowValuescrt}
                componentRef={componentRefAdjList}
            />
            {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
            <DeleteConfirmation
                open={isDeleteOpen}
                onClose={handleCloseMod}
                onConfirm={deleteShiftAllot}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />

            {/* Edit Adjustment*/}
            <Dialog open={openEdit} onClose={handleClickOpenEdit} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="sm" fullWidth={true}>
                <Box sx={userStyle.dialogbox}>
                    <>
                        <Typography sx={userStyle.HeaderText}> Status Update</Typography>
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={5} xs={12} sm={12} >
                                <Typography sx={{ fontSize: '14px', }}>Status</Typography>
                                <FormControl fullWidth size="small">
                                    <Selects fullWidth
                                        size="small"
                                        options={adjtypeoptions}
                                        styles={colourStyles}
                                        value={{ label: shiftRoasterAdjStatusEdit.adjstatus, value: shiftRoasterAdjStatusEdit.adjstatus }}
                                        onChange={(e) => setShiftRoasterAdjStatusEdit({ ...shiftRoasterAdjStatusEdit, adjstatus: e.value })}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br /> <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={2}>
                                <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={sendRequest}> {" "} Update{" "}  </Button>
                            </Grid>
                            <Grid item md={2}>
                                <Button variant="contained" sx={buttonStyles.btncancel} onClick={handleCloseEdit}> {" "} Cancel{" "} </Button>
                            </Grid>
                        </Grid>
                    </>
                </Box>
            </Dialog >
        </Box >
    );
}

export default ShiftAdjustmentListTable;