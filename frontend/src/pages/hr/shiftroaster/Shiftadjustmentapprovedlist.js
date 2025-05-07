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

function ShiftAdjustmentApprovedListTable({ allUsersAdjTableApproved, adjApproved, fetchUsers, filteredDataItemsAdjListApproved, setFilteredDataItemsAdjListApproved }) {

    const gridRefTableAdjListApproved = useRef(null);
    const gridRefImageAdjListApproved = useRef(null);
    const { auth } = useContext(AuthContext);
    const { isUserRoleCompare, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);
    const [itemsSetTable, setItemsSetTable] = useState([]);
    const [shiftRoasterAdjStatusEdit, setShiftRoasterAdjStatusEdit] = useState({})

    // State to track advanced filter
    const [advancedFilterAdjListApproved, setAdvancedFilterAdjListApproved] = useState(null);
    const [gridApiAdjListApproved, setGridApiAdjListApproved] = useState(null);
    const [columnApiAdjListApproved, setColumnApiAdjListApproved] = useState(null);
    const [filteredRowDataAdjListApproved, setFilteredRowDataAdjListApproved] = useState([]);

    // Datatable Set Table
    const [pageAdjListApproved, setPageAdjListApproved] = useState(1);
    const [pageSizeAdjListApproved, setPageSizeAdjListApproved] = useState(10);
    const [searchQueryAdjListApproved, setSearchQuerAdjListApproved] = useState("");
    const [totalPagesAdjListApproved, setTotalPagesAdjListApproved] = useState(1);

    // Edit model
    const [openEdit, setOpenEdit] = useState(false);
    const handleClickOpenEdit = () => { setOpenEdit(true); };
    const handleCloseEdit = () => { setOpenEdit(false); setShiftRoasterAdjStatusEdit({ adjstatus: "" }) }

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const handleClickOpenerr = () => { setIsErrorOpen(true); };
    const handleCloseerr = () => { setIsErrorOpen(false); };

    const [isFilterOpenAdjListApproved, setIsFilterOpenAdjListApproved] = useState(false);
    const [isPdfFilterOpenAdjListApproved, setIsPdfFilterOpenAdjListApproved] = useState(false);
    // page refersh reload
    const handleCloseFilterModAdjListApproved = () => { setIsFilterOpenAdjListApproved(false); };
    const handleClosePdfFilterModAdjListApproved = () => { setIsPdfFilterOpenAdjListApproved(false); };

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
    const [searchQueryManageAdjListApproved, setSearchQueryManageAdjListApproved] = useState("");
    const [isManageColumnsOpenAdjListApproved, setManageColumnsOpenAdjListApproved] = useState(false);
    const [anchorElAdjListApproved, setAnchorElAdjListApproved] = useState(null);

    const handleOpenManageColumnsAdjListApproved = (event) => {
        setAnchorElAdjListApproved(event.currentTarget);
        setManageColumnsOpenAdjListApproved(true);
    };
    const handleCloseManageColumnsAdjListApproved = () => {
        setManageColumnsOpenAdjListApproved(false);
        setSearchQueryManageAdjListApproved("");
    };

    const openAdjListApproved = Boolean(anchorElAdjListApproved);
    const idAdjListApproved = openAdjListApproved ? "simple-popover" : undefined;

    // Search bar
    const [anchorElSearchAdjListApproved, setAnchorElSearchAdjListApproved] = React.useState(null);
    const handleClickSearchAdjListApproved = (event) => {
        setAnchorElSearchAdjListApproved(event.currentTarget);
    };
    const handleCloseSearchAdjListApproved = () => {
        setAnchorElSearchAdjListApproved(null);
        setSearchQuerAdjListApproved("");
    };

    const openSearchAdjListApproved = Boolean(anchorElSearchAdjListApproved);
    const idSearchAdjListApproved = openSearchAdjListApproved ? 'simple-popover' : undefined;

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
    const initialColumnVisibilityAdjListApproved = {
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

    const [columnVisibilityAdjListApproved, setColumnVisibilityAdjListApproved] = useState(initialColumnVisibilityAdjListApproved);

    useEffect(() => {
        setFilteredDataItemsAdjListApproved(allUsersAdjTableApproved);
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
    const [AdjListApprovedInnerId, setAdjListApprovedInnterId] = useState("");
    const getCodeForDelete = (e, shifallotid) => {
        setUserOuterId(e);
        setAdjListApprovedInnterId(shifallotid);
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
                innerId: AdjListApprovedInnerId
            });
            await fetchUsers();
            handleCloseMod();
            setPageAdjListApproved(1);
            setPopupContent("Undone Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const addSerialNumberSetTable = () => {
        const itemsWithSerialNumber = allUsersAdjTableApproved?.map((item, index) => ({
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
        setFilteredDataItemsAdjListApproved(itemsWithSerialNumber);
    };

    useEffect(() => {
        addSerialNumberSetTable();
    }, [allUsersAdjTableApproved]);

    const defaultColDef = useMemo(() => {
        return {
            filter: true,
            resizable: true,
            filterParams: {
                buttons: ["apply", "reset", "cancel"],
            },
        };
    }, []);

    const onGridReadyAdjListApproved = useCallback((params) => {
        setGridApiAdjListApproved(params.api);
        setColumnApiAdjListApproved(params.columnApiAdjListApproved);
    }, []);

    // Function to handle filter changes
    const onFilterChangedAdjListApproved = () => {
        if (gridApiAdjListApproved) {
            const filterModel = gridApiAdjListApproved.getFilterModel(); // Get the current filter model

            // Check if filters are active
            if (Object.keys(filterModel).length === 0) {
                // No filters active, clear the filtered data state
                setFilteredRowDataAdjListApproved([]);
            } else {
                // Filters are active, capture filtered data
                const filteredDataAdjListApproved = [];
                gridApiAdjListApproved.forEachNodeAfterFilterAndSort((node) => {
                    filteredDataAdjListApproved.push(node.data); // Collect filtered row data
                });
                setFilteredRowDataAdjListApproved(filteredDataAdjListApproved);
            }
        }
    };

    const onPaginationChangedAdjListApproved = useCallback(() => {
        if (gridRefTableAdjListApproved.current) {
            const gridApiAdjListApproved = gridRefTableAdjListApproved.current.api;
            const currentPage = gridApiAdjListApproved.paginationGetCurrentPage() + 1;
            const totalPagesAdjListApproved = gridApiAdjListApproved.paginationGetTotalPages();
            setPageAdjListApproved(currentPage);
            setTotalPagesAdjListApproved(totalPagesAdjListApproved);
        }
    }, []);

    const columnDataTableAdjListApproved = [
        { field: "serialNumber", headerName: "SNo", flex: 0, width: 80, hide: !columnVisibilityAdjListApproved.serialNumber, headerClassName: "bold-header", pinned: 'left', lockPinned: true },
        { field: "empcode", headerName: "Emp Code", flex: 0, width: 150, hide: !columnVisibilityAdjListApproved.empcode, headerClassName: "bold-header", pinned: 'left', lockPinned: true, },
        { field: "username", headerName: "Name", flex: 0, width: 200, hide: !columnVisibilityAdjListApproved.username, headerClassName: "bold-header", pinned: 'left', lockPinned: true, },
        { field: "branch", headerName: "Branch", flex: 0, width: 120, hide: !columnVisibilityAdjListApproved.branch, headerClassName: "bold-header" },
        { field: "unit", headerName: "Unit", flex: 0, width: 120, hide: !columnVisibilityAdjListApproved.unit, headerClassName: "bold-header" },
        { field: "team", headerName: "Team", flex: 0, width: 120, hide: !columnVisibilityAdjListApproved.team, headerClassName: "bold-header" },
        { field: "adjapplydate", headerName: "Apply Date", flex: 0, width: 160, hide: !columnVisibilityAdjListApproved.adjapplydate, headerClassName: "bold-header" },
        { field: "adjustmenttype", headerName: "Adjustment", flex: 0, width: 150, hide: !columnVisibilityAdjListApproved.adjustmenttype, headerClassName: "bold-header" },
        { field: "request", headerName: "Request", flex: 0, width: 250, hide: !columnVisibilityAdjListApproved.request, headerClassName: "bold-header", autoHeight: true, cellStyle: getColumnStyle, },
        { field: "reason", headerName: "Reason", flex: 0, width: 200, hide: !columnVisibilityAdjListApproved.reason, headerClassName: "bold-header" },
        {
            field: "adjstatus",
            headerName: "Status",
            flex: 0,
            width: 110,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibilityAdjListApproved.adjstatus,
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
            hide: !columnVisibilityAdjListApproved.actions,
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
    const handleSearchChangeAdjListApproved = (e) => {
        const value = e.target.value;
        setSearchQuerAdjListApproved(value);
        applyNormalFilterAdjListApproved(value);
        setFilteredRowDataAdjListApproved([]);
    };

    const applyNormalFilterAdjListApproved = (searchValue) => {
        // Split the search query into individual terms
        const searchTerms = searchValue.toLowerCase().split(" ");

        // Modify the filtering logic to check each term
        const filtered = itemsSetTable?.filter((item) => {
            return searchTerms.every((term) =>
                Object.values(item).join(" ").toLowerCase().includes(term)
            );
        });
        setFilteredDataItemsAdjListApproved(filtered);
        setPageAdjListApproved(1);
    };

    const applyAdvancedFilterAdjListApproved = (filters, logicOperator) => {
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

        setFilteredDataItemsAdjListApproved(filtered); // Update filtered data
        setAdvancedFilterAdjListApproved(filters);
        // handleCloseSearchAdjListApproved(); // Close the popover after search
    };

    // Undo filter funtion
    const handleResetSearchAdjListApproved = () => {
        setAdvancedFilterAdjListApproved(null);
        setSearchQuerAdjListApproved("");
        setFilteredDataItemsAdjListApproved(itemsSetTable);
    };

    // Show filtered combination in the search bar
    const getSearchDisplayAdjListApproved = () => {
        if (advancedFilterAdjListApproved && advancedFilterAdjListApproved.length > 0) {
            return advancedFilterAdjListApproved.map((filter, index) => {
                let showname = columnDataTableAdjListApproved.find(col => col.field === filter.column)?.headerName;
                return `${showname} ${filter.condition} "${filter.value}"`;
            }).join(' ' + (advancedFilterAdjListApproved.length > 1 ? advancedFilterAdjListApproved[1].condition : '') + ' ');
        }
        return searchQueryAdjListApproved;
    };

    const handlePageChangeAdjListApproved = (newPage) => {
        if (newPage >= 1 && newPage <= totalPagesAdjListApproved) {
            setPageAdjListApproved(newPage);
            gridRefTableAdjListApproved.current.api.paginationGoToPage(newPage - 1);
        }
    };

    const handlePageSizeChangeAdjListApproved = (e) => {
        const newSize = Number(e.target.value);
        setPageSizeAdjListApproved(newSize);
        if (gridApiAdjListApproved) {
            gridApiAdjListApproved.paginationSetPageSize(newSize);
        }
    };

    // Show All Columns functionality
    const handleShowAllColumnsAdjListApproved = () => {
        const updatedVisibility = { ...columnVisibilityAdjListApproved };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibilityAdjListApproved(updatedVisibility);
    };

    useEffect(() => {
        // Retrieve column visibility from localStorage (if available)
        const savedVisibility = localStorage.getItem("columnVisibilityAdjListApproved");
        if (savedVisibility) {
            setColumnVisibilityAdjListApproved(JSON.parse(savedVisibility));
        }
    }, []);

    useEffect(() => {
        // Save column visibility to localStorage whenever it changes
        localStorage.setItem("columnVisibilityAdjListApproved", JSON.stringify(columnVisibilityAdjListApproved));
    }, [columnVisibilityAdjListApproved]);

    // // Function to filter columns based on search query
    const filteredColumns = columnDataTableAdjListApproved.filter((column) => column.headerName.toLowerCase().includes(searchQueryManageAdjListApproved.toLowerCase()));

    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // Manage Columns functionality
    const toggleColumnVisibilityAdjListApproved = (field) => {
        if (!gridApiAdjListApproved) return;

        setColumnVisibilityAdjListApproved((prevVisibility) => {
            const newVisibility = !prevVisibility[field];

            // Update the visibility in the grid
            gridApiAdjListApproved.setColumnVisible(field, newVisibility);

            return {
                ...prevVisibility,
                [field]: newVisibility,
            };
        });
    };

    const handleColumnMovedAdjListApproved = useCallback(debounce((event) => {
        if (!event.columnApiAdjListApproved) return;

        const visible_columns = event.columnApiAdjListApproved.getAllColumns().filter(col => {
            const colState = event.columnApiAdjListApproved.getColumnState().find(state => state.colId === col.colId);
            return colState && !colState.hide;
        }).map(col => col.colId);

        setColumnVisibilityAdjListApproved((prevVisibility) => {
            const updatedVisibility = { ...prevVisibility };

            // Ensure columns that are visible stay visible
            Object.keys(updatedVisibility).forEach(colId => {
                updatedVisibility[colId] = visible_columns.includes(colId);
            });

            return updatedVisibility;
        });
    }, 300), []);

    const handleColumnVisibleAdjListApproved = useCallback((event) => {
        const colId = event.column.getColId();

        // Update visibility based on event, but only when explicitly triggered by grid
        setColumnVisibilityAdjListApproved((prevVisibility) => ({
            ...prevVisibility,
            [colId]: event.visible, // Set visibility directly from the event
        }));
    }, []);

    // Excel
    const [fileFormatAdjListApproved, setFormatAdjListApproved] = useState('');
    let exportColumnNamescrt = ["Branch", "Unit", "Team", "Name", "Emp Code", "Apply Date", "Adjustment", "Request", "Reason", "Status",]
    let exportRowValuescrt = ["branch", "unit", "team", "username", "empcode", "adjapplydate", "adjustmenttype", "request", "reason", "adjstatus"]

    // print...
    const componentRefAdjListApproved = useRef();
    const handleprintAdjListApproved = useReactToPrint({
        content: () => componentRefAdjListApproved.current,
        documentTitle: "Adjustment Approved List",
        pageStyle: "print",
    });

    // image
    const handleCaptureImageAdjListApproved = () => {
        if (gridRefImageAdjListApproved.current) {
            domtoimage.toBlob(gridRefImageAdjListApproved.current)
                .then((blob) => {
                    saveAs(blob, "Adjustment Approved List.png");
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

        const startPage = Math.max(1, pageSizeAdjListApproved - 1);
        const endPage = Math.min(totalPagesAdjListApproved, startPage + maxVisiblePages - 1);

        // Loop through and add visible pageSizeAdjListApproved numbers
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        // If there are more pages after the last visible pageSizeAdjListApproved, show ellipsis
        if (endPage < totalPagesAdjListApproved) {
            pageNumbers.push("...");
        }

        return pageNumbers;
    };

    // Pagination for outer filter
    const filteredDataAdjListApproved = filteredDataItemsAdjListApproved?.slice((pageAdjListApproved - 1) * pageSizeAdjListApproved, pageAdjListApproved * pageSizeAdjListApproved);
    const totalPagesAdjListApprovedOuter = Math.ceil(filteredDataItemsAdjListApproved?.length / pageSizeAdjListApproved);
    const visiblePages = Math.min(totalPagesAdjListApprovedOuter, 3);
    const firstVisiblePage = Math.max(1, pageAdjListApproved - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPagesAdjListApprovedOuter);
    const pageNumbers = [];
    const indexOfLastItem = pageAdjListApproved * pageSizeAdjListApproved;
    const indexOfFirstItem = indexOfLastItem - pageSizeAdjListApproved;
    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) { pageNumbers.push(i); }

    return (
        <Box>
            {/* ****** Header Content ****** */}
            <Typography sx={userStyle.HeaderText}>Adjustment Approved List and Status</Typography>

            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lshiftadjustment") && (
                <>
                    <Box sx={userStyle.container}>
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}> Adjustment Approved List and Status </Typography>
                        </Grid>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid container style={userStyle.dataTablestyle}>
                            <Grid item md={2} xs={12} sm={12}>
                                <Box>
                                    <label>Show entries:</label>
                                    <Select size="small"
                                        id="pageSizeSelect"
                                        value={pageSizeAdjListApproved}
                                        MenuProps={{
                                            PaperProps: {
                                                style: {
                                                    maxHeight: 180,
                                                    width: 80,
                                                },
                                            },
                                        }}
                                        onChange={handlePageSizeChangeAdjListApproved}
                                        sx={{ width: "77px" }}
                                    >
                                        <MenuItem value={1}>1</MenuItem>
                                        <MenuItem value={5}>5</MenuItem>
                                        <MenuItem value={10}>10</MenuItem>
                                        <MenuItem value={25}>25</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
                                        <MenuItem value={100}>100</MenuItem>
                                        <MenuItem value={allUsersAdjTableApproved?.length}>All</MenuItem>
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Box>
                                    {isUserRoleCompare?.includes("excelshiftadjustment") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpenAdjListApproved(true)
                                                setFormatAdjListApproved("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvshiftadjustment") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpenAdjListApproved(true)
                                                setFormatAdjListApproved("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printshiftadjustment") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprintAdjListApproved}>
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
                                                    setIsPdfFilterOpenAdjListApproved(true)
                                                }}
                                            ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imageshiftadjustment") && (
                                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImageAdjListApproved}>
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
                                                {advancedFilterAdjListApproved && (
                                                    <IconButton onClick={handleResetSearchAdjListApproved}>
                                                        <MdClose />
                                                    </IconButton>
                                                )}
                                                <Tooltip title="Show search options">
                                                    <span>
                                                        <IoMdOptions style={{ cursor: 'pointer', }} onClick={handleClickSearchAdjListApproved} />
                                                    </span>
                                                </Tooltip>
                                            </InputAdornment>}
                                        aria-describedby="outlined-weight-helper-text"
                                        inputProps={{ 'aria-label': 'weight', }}
                                        type="text"
                                        value={getSearchDisplayAdjListApproved()}
                                        onChange={handleSearchChangeAdjListApproved}
                                        placeholder="Type to search..."
                                        disabled={!!advancedFilterAdjListApproved}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>  <br />
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumnsAdjListApproved}>  Show All Columns </Button>&ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsAdjListApproved}> Manage Columns  </Button><br /><br />
                        {adjApproved ?
                            <>
                                <Box sx={{ display: "flex", justifyContent: "center" }}>
                                    <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                                </Box>
                            </> :
                            <>
                                <Box sx={{ width: "100%", }} className={"ag-theme-quartz"} ref={gridRefImageAdjListApproved} >
                                    <AgGridReact
                                        rowData={filteredDataItemsAdjListApproved}
                                        columnDefs={columnDataTableAdjListApproved.filter((column) => columnVisibilityAdjListApproved[column.field])}
                                        ref={gridRefTableAdjListApproved}
                                        defaultColDef={defaultColDef}
                                        domLayout={"autoHeight"}
                                        getRowStyle={getRowStyle}
                                        getRowHeight={getRowHeight}
                                        pagination={true}
                                        paginationPageSize={pageSizeAdjListApproved}
                                        onPaginationChanged={onPaginationChangedAdjListApproved}
                                        onGridReady={onGridReadyAdjListApproved}
                                        onColumnMoved={handleColumnMovedAdjListApproved}
                                        onColumnVisible={handleColumnVisibleAdjListApproved}
                                        onFilterChanged={onFilterChangedAdjListApproved}
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
                                                (filteredDataItemsAdjListApproved.length > 0 ? (pageAdjListApproved - 1) * pageSizeAdjListApproved + 1 : 0)
                                            ) : (
                                                filteredRowDataAdjListApproved.length > 0 ? (pageAdjListApproved - 1) * pageSizeAdjListApproved + 1 : 0
                                            )
                                        }{" "}to{" "}
                                        {
                                            gridApi && gridApi.getFilterModel() && Object.keys(gridApi.getFilterModel()).length === 0 ? (
                                                Math.min(pageAdjListApproved * pageSizeAdjListApproved, filteredDataItemsAdjListApproved.length)
                                            ) : (
                                                filteredRowDataAdjListApproved.length > 0 ? Math.min(pageAdjListApproved * pageSizeAdjListApproved, filteredRowDataAdjListApproved.length) : 0
                                            )
                                        }{" "}of{" "}
                                        {
                                            gridApi && gridApi.getFilterModel() && Object.keys(gridApi.getFilterModel()).length === 0 ? (
                                                filteredDataItemsAdjListApproved.length
                                            ) : (
                                                filteredRowDataAdjListApproved.length
                                            )
                                        } entries
                                    </Box>
                                    <Box>
                                        <Button onClick={() => handlePageChangeAdjListApproved(1)} disabled={pageAdjListApproved === 1} sx={userStyle.paginationbtn}  > <FirstPageIcon /> </Button>
                                        <Button onClick={() => handlePageChangeAdjListApproved(pageAdjListApproved - 1)} disabled={pageAdjListApproved === 1} sx={userStyle.paginationbtn}  > <NavigateBeforeIcon />  </Button>
                                        {getVisiblePageNumbersAdjListApproved().map((pageNumber, index) => (
                                            <Button
                                                key={index}
                                                onClick={() => pageNumber !== "..." && handlePageChangeAdjListApproved(pageNumber)}
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
                                                className={pageAdjListApproved === pageNumber ? "active" : ""}
                                                disabled={pageAdjListApproved === pageNumber}
                                            >
                                                {pageNumber}
                                            </Button>
                                        ))}
                                        <Button onClick={() => handlePageChangeAdjListApproved(pageAdjListApproved + 1)} disabled={pageAdjListApproved === totalPagesAdjListApproved} sx={userStyle.paginationbtn} > <NavigateNextIcon /> </Button>
                                        <Button onClick={() => handlePageChangeAdjListApproved(totalPagesAdjListApproved)} disabled={pageAdjListApproved === totalPagesAdjListApproved} sx={userStyle.paginationbtn} ><LastPageIcon /> </Button>
                                    </Box>
                                </Box> */}
                            </>
                        }
                    </Box>

                </>
            )}<br />

            {/* Manage Column */}
            <Popover
                id={idAdjListApproved}
                open={isManageColumnsOpenAdjListApproved}
                anchorEl={anchorElAdjListApproved}
                onClose={handleCloseManageColumnsAdjListApproved}
                anchorOrigin={{ vertical: "bottom", horizontal: "left", }}
            >
                <ManageColumnsContent
                    handleClose={handleCloseManageColumnsAdjListApproved}
                    searchQuery={searchQueryManageAdjListApproved}
                    setSearchQuery={setSearchQueryManageAdjListApproved}
                    filteredColumns={filteredColumns}
                    columnVisibility={columnVisibilityAdjListApproved}
                    toggleColumnVisibility={toggleColumnVisibilityAdjListApproved}
                    setColumnVisibility={setColumnVisibilityAdjListApproved}
                    initialColumnVisibility={initialColumnVisibilityAdjListApproved}
                    columnDataTable={columnDataTableAdjListApproved}
                />
            </Popover>

            {/* Search Bar */}
            <Popover
                id={idSearchAdjListApproved}
                open={openSearchAdjListApproved}
                anchorEl={anchorElSearchAdjListApproved}
                onClose={handleCloseSearchAdjListApproved}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }}
            >
                <AdvancedSearchBar columns={columnDataTableAdjListApproved.filter(data => data.field !== 'actions')} onSearch={applyAdvancedFilterAdjListApproved} initialSearchValue={searchQueryAdjListApproved} handleCloseSearch={handleCloseSearchAdjListApproved} />
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
                isFilterOpen={isFilterOpenAdjListApproved}
                handleCloseFilterMod={handleCloseFilterModAdjListApproved}
                fileFormat={fileFormatAdjListApproved}
                setIsFilterOpen={setIsFilterOpenAdjListApproved}
                isPdfFilterOpen={isPdfFilterOpenAdjListApproved}
                setIsPdfFilterOpen={setIsPdfFilterOpenAdjListApproved}
                handleClosePdfFilterMod={handleClosePdfFilterModAdjListApproved}
                filteredDataTwo={(filteredRowDataAdjListApproved.length > 0 ? filteredRowDataAdjListApproved : filteredDataAdjListApproved) ?? []}
                itemsTwo={itemsSetTable ?? []}
                filename={"Adjustment Approved List"}
                exportColumnNames={exportColumnNamescrt}
                exportRowValues={exportRowValuescrt}
                componentRef={componentRefAdjListApproved}
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

export default ShiftAdjustmentApprovedListTable;