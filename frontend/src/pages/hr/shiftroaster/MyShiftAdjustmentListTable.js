import React, { useState, useEffect, useRef, useContext, useMemo, useCallback } from "react";
import { FaFileExcel, FaFileCsv, FaPrint, FaFilePdf, FaSearch } from 'react-icons/fa';
import { Box, Typography, OutlinedInput, Select, MenuItem, FormControl, Grid, Button, List, Popover, IconButton, InputAdornment, Tooltip } from "@mui/material";
import { userStyle } from "../../../pageStyle";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useReactToPrint } from "react-to-print";
import moment from "moment";
import { UserRoleAccessContext } from "../../../context/Appcontext";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { saveAs } from "file-saver";
import ImageIcon from "@mui/icons-material/Image";
import { IoMdOptions } from "react-icons/io";
import { MdClose } from "react-icons/md";
import domtoimage from 'dom-to-image';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import ExportData from "../../../components/ExportData";
import AdvancedSearchBar from '../../../components/SearchbarEbList';
import ManageColumnsContent from "../../../components/ManageColumn";
import ResizeObserver from 'resize-observer-polyfill';
window.ResizeObserver = ResizeObserver;

function MyShiftAdjustmentListTable({ allUsersAdjTable, adjApply, filteredDataItemsMyAdjList, setFilteredDataItemsMyAdjList }) {

    const gridRefTableMyAdjList = useRef(null);
    const gridRefImageMyAdjList = useRef(null);
    const { isUserRoleCompare } = useContext(UserRoleAccessContext);
    const [itemsSetTable, setItemsSetTable] = useState([])

    // State to track advanced filter
    const [advancedFilterMyAdjList, setAdvancedFilterMyAdjList] = useState(null);
    const [gridApiMyAdjList, setGridApiMyAdjList] = useState(null);
    const [columnApiMyAdjList, setColumnApiMyAdjList] = useState(null);
    const [filteredRowDataMyAdjList, setFilteredRowDataMyAdjList] = useState([]);

    // Datatable Set Table
    const [pageMyAdjList, setPageMyAdjList] = useState(1);
    const [pageSizeMyAdjList, setPageSizeMyAdjList] = useState(10);
    const [searchQueryMyAdjList, setSearchQueryMyAdjList] = useState("");
    const [totalPagesMyAdjList, setTotalPagesMyAdjList] = useState(1);

    const [isFilterOpenMyAdjList, setIsFilterOpenMyAdjList] = useState(false);
    const [isPdfFilterOpenMyAdjList, setIsPdfFilterOpenMyAdjList] = useState(false);
    // page refersh reload
    const handleCloseFilterModMyAdjList = () => { setIsFilterOpenMyAdjList(false); };
    const handleClosePdfFilterModMyAdjList = () => { setIsPdfFilterOpenMyAdjList(false); };

    // Manage Columns
    const [searchQueryManageMyAdjList, setSearchQueryManageMyAdjList] = useState("");
    const [isManageColumnsOpenMyAdjList, setManageColumnsOpenMyAdjList] = useState(false);
    const [anchorElMyAdjList, setAnchorElMyAdjList] = useState(null);

    const handleOpenManageColumnsMyAdjList = (event) => {
        setAnchorElMyAdjList(event.currentTarget);
        setManageColumnsOpenMyAdjList(true);
    };
    const handleCloseManageColumnsMyAdjList = () => {
        setManageColumnsOpenMyAdjList(false);
        setSearchQueryManageMyAdjList("");
    };

    const openMyAdjList = Boolean(anchorElMyAdjList);
    const idMyAdjList = openMyAdjList ? "simple-popover" : undefined;

    // Search bar
    const [anchorElSearchMyAdjList, setAnchorElSearchMyAdjList] = React.useState(null);
    const handleClickSearchMyAdjList = (event) => {
        setAnchorElSearchMyAdjList(event.currentTarget);
    };
    const handleCloseSearchMyAdjList = () => {
        setAnchorElSearchMyAdjList(null);
        setSearchQueryMyAdjList("");
    };

    const openSearchMyAdjList = Boolean(anchorElSearchMyAdjList);
    const idSearchMyAdjList = openSearchMyAdjList ? 'simple-popover' : undefined;

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
    const initialColumnVisibilityMyAdjList = {
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

    const [columnVisibilityMyAdjList, setColumnVisibilityMyAdjList] = useState(initialColumnVisibilityMyAdjList);

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
        setFilteredDataItemsMyAdjList(itemsWithSerialNumber);
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

    const onGridReadyMyAdjList = useCallback((params) => {
        setGridApiMyAdjList(params.api);
        setColumnApiMyAdjList(params.columnApiMyAdjList);
    }, []);

    // Function to handle filter changes
    const onFilterChangedMyAdjList = () => {
        if (gridApiMyAdjList) {
            const filterModel = gridApiMyAdjList.getFilterModel(); // Get the current filter model

            // Check if filters are active
            if (Object.keys(filterModel).length === 0) {
                // No filters active, clear the filtered data state
                setFilteredRowDataMyAdjList([]);
            } else {
                // Filters are active, capture filtered data
                const filteredDataMyAdjList = [];
                gridApiMyAdjList.forEachNodeAfterFilterAndSort((node) => {
                    filteredDataMyAdjList.push(node.data); // Collect filtered row data
                });
                setFilteredRowDataMyAdjList(filteredDataMyAdjList);
            }
        }
    };

    const onPaginationChangedMyAdjList = useCallback(() => {
        if (gridRefTableMyAdjList.current) {
            const gridApiMyAdjList = gridRefTableMyAdjList.current.api;
            const currentPage = gridApiMyAdjList.paginationGetCurrentPage() + 1;
            const totalPagesMyAdjList = gridApiMyAdjList.paginationGetTotalPages();
            setPageMyAdjList(currentPage);
            setTotalPagesMyAdjList(totalPagesMyAdjList);
        }
    }, []);

    const columnDataTableMyAdjList = [
        { field: "serialNumber", headerName: "SNo", flex: 0, width: 80, hide: !columnVisibilityMyAdjList.serialNumber, headerClassName: "bold-header", pinned: 'left', lockPinned: true, },
        { field: "empcode", headerName: "Emp Code", flex: 0, width: 150, hide: !columnVisibilityMyAdjList.empcode, headerClassName: "bold-header", pinned: 'left', lockPinned: true, },
        { field: "username", headerName: "Name", flex: 0, width: 250, hide: !columnVisibilityMyAdjList.username, headerClassName: "bold-header", pinned: 'left', lockPinned: true, },
        { field: "adjapplydate", headerName: "Apply Date", flex: 0, width: 160, hide: !columnVisibilityMyAdjList.adjapplydate, headerClassName: "bold-header" },
        { field: "branch", headerName: "Branch", flex: 0, width: 120, hide: !columnVisibilityMyAdjList.branch, headerClassName: "bold-header" },
        { field: "unit", headerName: "Unit", flex: 0, width: 120, hide: !columnVisibilityMyAdjList.unit, headerClassName: "bold-header" },
        { field: "team", headerName: "Team", flex: 0, width: 120, hide: !columnVisibilityMyAdjList.team, headerClassName: "bold-header" },
        { field: "adjustmenttype", headerName: "Adjustment", flex: 0, width: 150, hide: !columnVisibilityMyAdjList.adjustmenttype, headerClassName: "bold-header" },
        { field: "request", headerName: "Request", flex: 0, width: 250, hide: !columnVisibilityMyAdjList.request, headerClassName: "bold-header", autoHeight: true, cellStyle: getColumnStyle, },
        { field: "reason", headerName: "Reason", flex: 0, width: 200, hide: !columnVisibilityMyAdjList.reason, headerClassName: "bold-header" },
        {
            field: "adjstatus",
            headerName: "Status",
            flex: 0,
            width: 110,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibilityMyAdjList.adjstatus,
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
    ];

    // Datatable
    const handleSearchChangeMyAdjList = (e) => {
        const value = e.target.value;
        setSearchQueryMyAdjList(value);
        applyNormalFilterMyAdjList(value);
        setFilteredRowDataMyAdjList([]);
    };

    const applyNormalFilterMyAdjList = (searchValue) => {
        // Split the search query into individual terms
        const searchTerms = searchValue.toLowerCase().split(" ");

        // Modify the filtering logic to check each term
        const filtered = itemsSetTable?.filter((item) => {
            return searchTerms.every((term) =>
                Object.values(item).join(" ").toLowerCase().includes(term)
            );
        });
        setFilteredDataItemsMyAdjList(filtered);
        setPageMyAdjList(1);
    };

    const applyAdvancedFilterMyAdjList = (filters, logicOperator) => {
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

        setFilteredDataItemsMyAdjList(filtered); // Update filtered data
        setAdvancedFilterMyAdjList(filters);
        // handleCloseSearchMyAdjList(); // Close the popover after search
    };

    // Undo filter funtion
    const handleResetSearchMyAdjList = () => {
        setAdvancedFilterMyAdjList(null);
        setSearchQueryMyAdjList("");
        setFilteredDataItemsMyAdjList(itemsSetTable);
    };

    // Show filtered combination in the search bar
    const getSearchDisplayMyAdjList = () => {
        if (advancedFilterMyAdjList && advancedFilterMyAdjList.length > 0) {
            return advancedFilterMyAdjList.map((filter, index) => {
                let showname = columnDataTableMyAdjList.find(col => col.field === filter.column)?.headerName;
                return `${showname} ${filter.condition} "${filter.value}"`;
            }).join(' ' + (advancedFilterMyAdjList.length > 1 ? advancedFilterMyAdjList[1].condition : '') + ' ');
        }
        return searchQueryMyAdjList;
    };

    const handlePageChangeMyAdjList = (newPage) => {
        if (newPage >= 1 && newPage <= totalPagesMyAdjList) {
            setPageMyAdjList(newPage);
            gridRefTableMyAdjList.current.api.paginationGoToPage(newPage - 1);
        }
    };

    const handlePageSizeChangeMyAdjList = (e) => {
        const newSize = Number(e.target.value);
        setPageSizeMyAdjList(newSize);
        if (gridApiMyAdjList) {
            gridApiMyAdjList.paginationSetPageSize(newSize);
        }
    };

    // Show All Columns functionality
    const handleShowAllColumnsMyAdjList = () => {
        const updatedVisibility = { ...columnVisibilityMyAdjList };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibilityMyAdjList(updatedVisibility);
    };

    useEffect(() => {
        // Retrieve column visibility from localStorage (if available)
        const savedVisibility = localStorage.getItem("columnVisibilityMyAdjList");
        if (savedVisibility) {
            setColumnVisibilityMyAdjList(JSON.parse(savedVisibility));
        }
    }, []);

    useEffect(() => {
        // Save column visibility to localStorage whenever it changes
        localStorage.setItem("columnVisibilityMyAdjList", JSON.stringify(columnVisibilityMyAdjList));
    }, [columnVisibilityMyAdjList]);

    // // Function to filter columns based on search query
    const filteredColumnsMyAdjList = columnDataTableMyAdjList.filter((column) => column.headerName.toLowerCase().includes(searchQueryManageMyAdjList.toLowerCase()));

    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // Manage Columns functionality
    const toggleColumnVisibilityMyAdjList = (field) => {
        if (!gridApiMyAdjList) return;

        setColumnVisibilityMyAdjList((prevVisibility) => {
            const newVisibility = !prevVisibility[field];

            // Update the visibility in the grid
            gridApiMyAdjList.setColumnVisible(field, newVisibility);

            return {
                ...prevVisibility,
                [field]: newVisibility,
            };
        });
    };

    const handleColumnMovedMyAdjList = useCallback(debounce((event) => {
        if (!event.columnApiMyAdjList) return;

        const visible_columns = event.columnApiMyAdjList.getAllColumns().filter(col => {
            const colState = event.columnApiMyAdjList.getColumnState().find(state => state.colId === col.colId);
            return colState && !colState.hide;
        }).map(col => col.colId);

        setColumnVisibilityMyAdjList((prevVisibility) => {
            const updatedVisibility = { ...prevVisibility };

            // Ensure columns that are visible stay visible
            Object.keys(updatedVisibility).forEach(colId => {
                updatedVisibility[colId] = visible_columns.includes(colId);
            });

            return updatedVisibility;
        });
    }, 300), []);

    const handleColumnVisibleMyAdjList = useCallback((event) => {
        const colId = event.column.getColId();

        // Update visibility based on event, but only when explicitly triggered by grid
        setColumnVisibilityMyAdjList((prevVisibility) => ({
            ...prevVisibility,
            [colId]: event.visible, // Set visibility directly from the event
        }));
    }, []);

    // Excel
    const [fileFormatMyAdjList, setFormatMyAdjList] = useState('');
    let exportColumnNamescrt = ["Branch", "Unit", "Team", "Name", "Emp Code", "Apply Date", "Adjustment", "Request", "Reason", "Status",]
    let exportRowValuescrt = ["branch", "unit", "team", "username", "empcode", "adjapplydate", "adjustmenttype", "request", "reason", "adjstatus"]

    // print...
    const componentRefMyAdjList = useRef();
    const handleprintMyAdjList = useReactToPrint({
        content: () => componentRefMyAdjList.current,
        documentTitle: "Adjustment Apply List",
        pageStyle: "print",
    });

    // image
    const handleCaptureImageMyAdjList = () => {
        if (gridRefImageMyAdjList.current) {
            domtoimage.toBlob(gridRefImageMyAdjList.current)
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

        const startPage = Math.max(1, pageMyAdjList - 1);
        const endPage = Math.min(totalPagesMyAdjList, startPage + maxVisiblePages - 1);

        // Loop through and add visible pageMyAdjList numbers
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        // If there are more pages after the last visible pageMyAdjList, show ellipsis
        if (endPage < totalPagesMyAdjList) {
            pageNumbers.push("...");
        }

        return pageNumbers;
    };

    // Pagination for outer filter
    const filteredDataMyAdjList = filteredDataItemsMyAdjList?.slice((pageMyAdjList - 1) * pageSizeMyAdjList, pageMyAdjList * pageSizeMyAdjList);
    const totalPagesMyAdjListOuter = Math.ceil(filteredDataItemsMyAdjList?.length / pageSizeMyAdjList);
    const visiblePages = Math.min(totalPagesMyAdjListOuter, 3);
    const firstVisiblePage = Math.max(1, pageMyAdjList - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPagesMyAdjListOuter);
    const pageNumbers = [];
    const indexOfLastItem = pageMyAdjList * pageSizeMyAdjList;
    const indexOfFirstItem = indexOfLastItem - pageSizeMyAdjList;
    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) { pageNumbers.push(i); }

    return (
        <Box>
            {/* ****** Header Content ****** */}
            <Typography sx={userStyle.HeaderText}>Adjustment Apply List and Status</Typography>

            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lmyshiftroaster") && (
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
                                        value={pageSizeMyAdjList}
                                        MenuProps={{
                                            PaperProps: {
                                                style: {
                                                    maxHeight: 180,
                                                    width: 80,
                                                },
                                            },
                                        }}
                                        onChange={handlePageSizeChangeMyAdjList}
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
                                    {isUserRoleCompare?.includes("excelmyshiftroaster") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpenMyAdjList(true)
                                                setFormatMyAdjList("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvmyshiftroaster") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpenMyAdjList(true)
                                                setFormatMyAdjList("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printmyshiftroaster") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprintMyAdjList}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfmyshiftroaster") && (
                                        <>
                                            <Button sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpenMyAdjList(true)
                                                }}
                                            ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imagemyshiftroaster") && (
                                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImageMyAdjList}>
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
                                                {advancedFilterMyAdjList && (
                                                    <IconButton onClick={handleResetSearchMyAdjList}>
                                                        <MdClose />
                                                    </IconButton>
                                                )}
                                                <Tooltip title="Show search options">
                                                    <span>
                                                        <IoMdOptions style={{ cursor: 'pointer', }} onClick={handleClickSearchMyAdjList} />
                                                    </span>
                                                </Tooltip>
                                            </InputAdornment>}
                                        aria-describedby="outlined-weight-helper-text"
                                        inputProps={{ 'aria-label': 'weight', }}
                                        type="text"
                                        value={getSearchDisplayMyAdjList()}
                                        onChange={handleSearchChangeMyAdjList}
                                        placeholder="Type to search..."
                                        disabled={!!advancedFilterMyAdjList}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>  <br />
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumnsMyAdjList}>  Show All Columns </Button>&ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsMyAdjList}> Manage Columns  </Button><br /><br />
                        {adjApply ?
                            <>
                                <Box sx={{ display: "flex", justifyContent: "center" }}>
                                    <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                                </Box>
                            </> :
                            <>
                                <Box sx={{ width: "100%", }} className={"ag-theme-quartz"} ref={gridRefImageMyAdjList} >
                                    <AgGridReact
                                        rowData={filteredDataItemsMyAdjList}
                                        columnDefs={columnDataTableMyAdjList.filter((column) => columnVisibilityMyAdjList[column.field])}
                                        ref={gridRefTableMyAdjList}
                                        defaultColDef={defaultColDef}
                                        domLayout={"autoHeight"}
                                        getRowStyle={getRowStyle}
                                        getRowHeight={getRowHeight}
                                        pagination={true}
                                        paginationPageSize={pageSizeMyAdjList}
                                        onPaginationChanged={onPaginationChangedMyAdjList}
                                        onGridReady={onGridReadyMyAdjList}
                                        onColumnMoved={handleColumnMovedMyAdjList}
                                        onColumnVisible={handleColumnVisibleMyAdjList}
                                        onFilterChanged={onFilterChangedMyAdjList}
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
                                                (filteredDataItemsMyAdjList.length > 0 ? (pageMyAdjList - 1) * pageSizeMyAdjList + 1 : 0)
                                            ) : (
                                                filteredRowDataMyAdjList.length > 0 ? (pageMyAdjList - 1) * pageSizeMyAdjList + 1 : 0
                                            )
                                        }{" "}to{" "}
                                        {
                                            gridApi && gridApi.getFilterModel() && Object.keys(gridApi.getFilterModel()).length === 0 ? (
                                                Math.min(pageMyAdjList * pageSizeMyAdjList, filteredDataItemsMyAdjList.length)
                                            ) : (
                                                filteredRowDataMyAdjList.length > 0 ? Math.min(pageMyAdjList * pageSizeMyAdjList, filteredRowDataMyAdjList.length) : 0
                                            )
                                        }{" "}of{" "}
                                        {
                                            gridApi && gridApi.getFilterModel() && Object.keys(gridApi.getFilterModel()).length === 0 ? (
                                                filteredDataItemsMyAdjList.length
                                            ) : (
                                                filteredRowDataMyAdjList.length
                                            )
                                        } entries
                                    </Box>
                                    <Box>
                                        <Button onClick={() => handlePageChangeMyAdjList(1)} disabled={pageMyAdjList === 1} sx={userStyle.paginationbtn}  > <FirstPageIcon /> </Button>
                                        <Button onClick={() => handlePageChangeMyAdjList(pageMyAdjList - 1)} disabled={pageMyAdjList === 1} sx={userStyle.paginationbtn}  > <NavigateBeforeIcon />  </Button>
                                        {getVisiblePageNumbers().map((pageNumber, index) => (
                                            <Button
                                                key={index}
                                                onClick={() => pageNumber !== "..." && handlePageChangeMyAdjList(pageNumber)}
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
                                                className={pageMyAdjList === pageNumber ? "active" : ""}
                                                disabled={pageMyAdjList === pageNumber}
                                            >
                                                {pageNumber}
                                            </Button>
                                        ))}
                                        <Button onClick={() => handlePageChangeMyAdjList(pageMyAdjList + 1)} disabled={pageMyAdjList === totalPagesMyAdjList} sx={userStyle.paginationbtn} > <NavigateNextIcon /> </Button>
                                        <Button onClick={() => handlePageChangeMyAdjList(totalPagesMyAdjList)} disabled={pageMyAdjList === totalPagesMyAdjList} sx={userStyle.paginationbtn} ><LastPageIcon /> </Button>
                                    </Box>
                                </Box> */}
                            </>
                        }
                    </Box>
                </>
            )}<br />

            {/* Manage Column */}
            <Popover
                id={idMyAdjList}
                open={isManageColumnsOpenMyAdjList}
                anchorEl={anchorElMyAdjList}
                onClose={handleCloseManageColumnsMyAdjList}
                anchorOrigin={{ vertical: "bottom", horizontal: "left", }}
            >
                <ManageColumnsContent
                    handleClose={handleCloseManageColumnsMyAdjList}
                    searchQuery={searchQueryManageMyAdjList}
                    setSearchQuery={setSearchQueryManageMyAdjList}
                    filteredColumns={filteredColumnsMyAdjList}
                    columnVisibility={columnVisibilityMyAdjList}
                    toggleColumnVisibility={toggleColumnVisibilityMyAdjList}
                    setColumnVisibility={setColumnVisibilityMyAdjList}
                    initialColumnVisibility={initialColumnVisibilityMyAdjList}
                    columnDataTable={columnDataTableMyAdjList}
                />
            </Popover>

            {/* Search Bar */}
            <Popover
                id={idSearchMyAdjList}
                open={openSearchMyAdjList}
                anchorEl={anchorElSearchMyAdjList}
                onClose={handleCloseSearchMyAdjList}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }}
            >
                <AdvancedSearchBar columns={columnDataTableMyAdjList} onSearch={applyAdvancedFilterMyAdjList} initialSearchValue={searchQueryMyAdjList} handleCloseSearch={handleCloseSearchMyAdjList} />
            </Popover>

            {/* EXTERNAL COMPONENTS -------------- END */}
            {/* PRINT PDF EXCEL CSV */}
            <ExportData
                isFilterOpen={isFilterOpenMyAdjList}
                handleCloseFilterMod={handleCloseFilterModMyAdjList}
                fileFormat={fileFormatMyAdjList}
                setIsFilterOpen={setIsFilterOpenMyAdjList}
                isPdfFilterOpen={isPdfFilterOpenMyAdjList}
                setIsPdfFilterOpen={setIsPdfFilterOpenMyAdjList}
                handleClosePdfFilterMod={handleClosePdfFilterModMyAdjList}
                filteredDataTwo={(filteredRowDataMyAdjList.length > 0 ? filteredRowDataMyAdjList : filteredDataMyAdjList) ?? []}
                itemsTwo={itemsSetTable ?? []}
                filename={"Adjustment Apply List"}
                exportColumnNames={exportColumnNamescrt}
                exportRowValues={exportRowValuescrt}
                componentRef={componentRefMyAdjList}
            />
        </Box >
    );
}

export default MyShiftAdjustmentListTable;