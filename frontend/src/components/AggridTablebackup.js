import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ModuleRegistry } from "@ag-grid-community/core";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Box, Button, Skeleton } from "@mui/material";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridReact } from "ag-grid-react";
import debounce from "lodash/debounce";
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import styled from "styled-components";
import { userStyle } from "../pageStyle";
import Pagination from "./Pagination";

const AgGridContainer = styled.div`
  .ag-theme-quartz {
    transition: none !important;
    overflow: auto;
  }
  ,
  .ag-pinned-left {
    overflow-x: auto !important;
    max-height: 100%;
  }
`;

const TableSkeleton = ({ rows }) => {
    return (
        <Box>
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <Skeleton
                    key={rowIndex}
                    variant="rectangular"
                    width="100%"
                    height={40} // Adjust row height as needed
                    style={{ marginBottom: 8, opacity: 0.2 }} // Adds space between skeleton rows
                    animation="wave"
                />
            ))}
        </Box>
    );
};

function AggridTable({
    rowDataTable,
    columnDataTable,
    columnVisibility,
    page,
    setPage,
    pageSize,
    totalPages,
    setColumnVisibility,
    isHandleChange,
    items,
    selectedRows,
    setSelectedRows,
    selectedRowsCat,
    setSelectedRowsCat,
    selectedRowsGrp,
    setSelectedRowsGrp,
    selectedRowsHead,
    setSelectedRowsHead,
    selectedRowsHeadLinked,
    setSelectedRowsHeadLinked,
    selectedRowsTypeMaster,
    setSelectedRowsTypeMaster,
    selectedRowsAssetMaterial,
    setSelectedRowsAssetMaterial,
    selectedRowsAssetSpecification,
    setSelectedRowsAssetSpecification,
    selectedRowsVendorMaster,
    setSelectedRowsVendorMaster,
    selectedRowsVendorGrouping,
    setSelectedRowsVendorGrouping,
    selectedRowsFrequency,
    setSelectedRowsFrequency,
    selectedRowsUOM,
    setSelectedRowsUOM,
    selectedRowsAssetList,
    setSelectedRowsAssetList,
    selectedAttModeNameDelt,
    setSelectedAttModeNameDelt,
    pagenamecheck,
    gridRefTable,
    paginated,
    filteredDatas,
    totalDatas,
    searchQuery,
    handleShowAllColumns,
    rowHeight = 50,
    setFilteredRowData,
    filteredRowData,
    setFilteredChanges,
    filteredChanges,
    gridRefTableImg,
    itemsList


}) {
    ModuleRegistry.registerModules([ClientSideRowModelModule]);

    const [loading, setLoading] = useState(false);
    const [sortingNames, setSortingNames] = useState(null);


    const getRowStyle = (params) => {

        if (params.node.rowIndex % 2 === 0) {
            if (pagenamecheck === "Validation Error Entry" && (params.node.data.status == "Valid" || params.node.data.status == "Invalid")) {
                return { backgroundColor: '#4caf5057' };
            }
            if (pagenamecheck === "Invaild Error Entry" && params.node.data.invalidcheck == true) {
                return { backgroundColor: '#4caf5057' };
            }
            if (pagenamecheck === "vaild Error Entry" && params.node.data.validcheck == true) {
                return { backgroundColor: '#4caf5057' };
            }
            return { background: "#f0f0f0" }; // Even row
        } else {
            if (pagenamecheck === "Validation Error Entry" && (params.node.data.status == "Valid" || params.node.data.status == "Invalid")) {
                return { backgroundColor: '#4caf5057' };
            }
            if (pagenamecheck === "Invaild Error Entry" && params.node.data.invalidcheck == true) {
                return { backgroundColor: '#4caf5057' };
            }
            if (pagenamecheck === "vaild Error Entry" && params.node.data.validcheck == true) {
                return { backgroundColor: '#4caf5057' };
            }
            return { background: "#ffffff" }; // Odd row
        }
    };

    const defaultColDef = useMemo(() => {
        return {
            filter: true,
            resizable: true,
            filterParams: {
                buttons: ["apply", "reset", "cancel"], // Show Apply, Reset, and Cancel (X) buttons in the filter popup
                closeOnApply: true, // Filter popup closes only when you click "Apply"
            },
            // flex: 1,
            // minWidth: 90,
            // sortable: true,
        };
    }, []);

    const selection = {
        mode: "multiRow",
        headerCheckbox: false,
    };

    const [gridApi, setGridApi] = useState(null);
    const [columnApi, setColumnApi] = useState(null);
    const scrollPositionRef = useRef(0);
    const FinalPages = paginated ? totalPages : Math.ceil((filteredChanges !== null ? filteredRowData : filteredDatas)?.length / pageSize);



    const handlePageChange = (newPage) => {
        // Store current scroll position
        scrollPositionRef.current =
            window.scrollY || document.documentElement.scrollTop;
        setLoading(true);
        setSortingNames(null)

        if (pagenamecheck === "EB Services Master List") {
            const selectedRowsNewCat = gridRefTable?.current?.api?.getSelectedRows();
            if (selectedRowsNewCat.some((item) => item.servicenumber)) {
                setSelectedRowsCat([])
            }
        }
        if (pagenamecheck === "Group Master") {
            const selectedRowsNewGrp = gridRefTable?.current?.api?.getSelectedRows();
            if (selectedRowsNewGrp.some((item) => item.name)) {
                setSelectedRowsGrp([])
            }
        }
        if (pagenamecheck === "Account Head") {
            const selectedRowsHead = gridRefTable?.current?.api?.getSelectedRows();
            if (selectedRowsHead.some((item) => item.accountname)) {
                setSelectedRowsHead([])
            }
        }

        if (pagenamecheck === "Account Head Linked") {
            const selectedRowsHeadLinked = gridRefTable?.current?.api?.getSelectedRows();
            if (selectedRowsHeadLinked.some((item) => item.headname)) {
                setSelectedRowsHeadLinked([])
            }
        }

        if (pagenamecheck === "Type Master") {
            const selectedRowsTypeMaster = gridRefTable?.current?.api?.getSelectedRows();
            if (selectedRowsTypeMaster.some((item) => item.name)) {
                setSelectedRowsTypeMaster([])
            }
        }

        if (pagenamecheck === "Asset Material") {
            const selectedRowsAssetMaterial = gridRefTable?.current?.api?.getSelectedRows();
            if (selectedRowsAssetMaterial.some((item) => item.name)) {
                setSelectedRowsAssetMaterial([])
            }
        }

        if (pagenamecheck === "Asset Specification") {
            const selectedRowsAssetSpecification = gridRefTable?.current?.api?.getSelectedRows();
            const selectedRowsAssetSpecificationsub = gridRefTable?.current?.api?.getSelectedRows();

            if (selectedRowsAssetSpecification.map((item) => ({
                component: item.categoryname, subcomponent: item.subcategoryname
            }))) {
                setSelectedRowsAssetSpecification([])
            }
            // if (selectedRowsAssetSpecificationsub.some((item) => item.subcategorynamelist)) {
            //     setSelectedRowsAssetSpecificationsub([])
            // }
        }


        if (pagenamecheck === "Vendor Details") {
            const selectedRowsVendorMaster = gridRefTable?.current?.api?.getSelectedRows();
            if (selectedRowsVendorMaster.some((item) => item.vendorname)) {
                setSelectedRowsVendorMaster([])
            }
        }
        if (pagenamecheck === "Vendor Grouping") {
            const selectedRowsVendorGrouping = gridRefTable?.current?.api?.getSelectedRows();
            if (selectedRowsVendorGrouping.some((item) => item.name)) {
                setSelectedRowsVendorGrouping([])
            }
        }

        if (pagenamecheck === "Frequency Master") {
            const selectedRowsFrequency = gridRefTable?.current?.api?.getSelectedRows();
            if (selectedRowsFrequency.some((item) => item.name)) {
                setSelectedRowsFrequency([])
            }
        }

        if (pagenamecheck === "Uom Master") {
            const selectedRowsUOM = gridRefTable?.current?.api?.getSelectedRows();
            if (selectedRowsUOM.some((item) => item.name)) {
                setSelectedRowsUOM([])
            }
        }

        if (pagenamecheck === "Asset List") {
            const selectedRowsAssetList = gridRefTable?.current?.api?.getSelectedRows();
            if (selectedRowsAssetList.some((item) => item.code)) {
                setSelectedRowsAssetList([])
            }
        }


        // bulk delete check linked for att mode master
        if (pagenamecheck === "Attendance Mode List") {
            const selectedRowsAttModeNameDelt = gridRefTable?.current?.api?.getSelectedRows();
            if (selectedRowsAttModeNameDelt.some((item) => item.name)) {
                setSelectedAttModeNameDelt([])
            }
        }

        setSelectedRows([])


        // If the new page is within the total pages
        if (newPage >= 1 && newPage <= FinalPages) {
            setPage(newPage);

            // Go to the new page (AG Grid is zero-indexed)
            gridRefTable?.current?.api?.paginationGoToPage(newPage - 1);
        }

        // Simulate data fetch delay
        setTimeout(() => {
            setLoading(false); // Stop loading after data is fetched

            // Restore scroll position after the new content is rendered
            window.requestAnimationFrame(() => {
                // Scroll to the previously stored position
                window.scrollTo({
                    top: scrollPositionRef.current,
                    behavior: "auto", // Change to 'smooth' if you want smooth scrolling
                });
            });
        }, 50); // Adjust timeout based on the real load time
    };

    const handleSelectionChange = () => {
        const selectedRowsNew = gridRefTable?.current?.api?.getSelectedRows();
        const selectedRowsNewCat = gridRefTable?.current?.api?.getSelectedRows();
        const selectedRowsNewGrp = gridRefTable?.current?.api?.getSelectedRows();
        const selectedRowsNewHead = gridRefTable?.current?.api?.getSelectedRows();
        const selectedRowsNewHeadLinked = gridRefTable?.current?.api?.getSelectedRows();
        const selectedRowsNewTypeMaster = gridRefTable?.current?.api?.getSelectedRows();
        const selectedRowsNewAssetMaterial = gridRefTable?.current?.api?.getSelectedRows();
        const selectedRowsNewAssetSpecification = gridRefTable?.current?.api?.getSelectedRows();
        const selectedRowsNewAssetSpecificationsub = gridRefTable?.current?.api?.getSelectedRows();
        const selectedRowsAttModeNameDelt = gridRefTable?.current?.api?.getSelectedRows();

        const selectedRowsNewVendorMaster = gridRefTable?.current?.api?.getSelectedRows();
        const selectedRowsNewVendorGrouping = gridRefTable?.current?.api?.getSelectedRows();
        const selectedRowsNewFrequency = gridRefTable?.current?.api?.getSelectedRows();
        const selectedRowsNewUOM = gridRefTable?.current?.api?.getSelectedRows();
        const selectedRowsNewAssetList = gridRefTable?.current?.api?.getSelectedRows();


        const extractedIds = selectedRowsNew.map((item) => item.id);


        if (pagenamecheck === "EB Services Master List" && selectedRowsNewCat.some((item) => item.servicenumber)) {
            const extractedIdsCat = selectedRowsNewCat.map((item) => item.servicenumber);
            if (JSON.stringify(extractedIdsCat) !== JSON.stringify(selectedRowsCat)) {
                setSelectedRowsCat(extractedIdsCat); // Update the state
            }
        }

        if (pagenamecheck === "Group Master" && selectedRowsNewGrp.some((item) => item.name)) {
            const extractedIdsCat = selectedRowsNewGrp.map((item) => item.name);
            if (JSON.stringify(extractedIdsCat) !== JSON.stringify(selectedRowsGrp)) {
                setSelectedRowsGrp(extractedIdsCat); // Update the state
            }
        }

        if (pagenamecheck === "Account Head" && selectedRowsNewHead.some((item) => item.accountname)) {
            const extractedIdsHead = selectedRowsNewHead.map((item) => item.accountname);

            if (JSON.stringify(extractedIdsHead) !== JSON.stringify(selectedRowsHead)) {
                setSelectedRowsHead(extractedIdsHead); // Update the state
            }
        }

        if (pagenamecheck === "Account Head Linked" && selectedRowsNewHeadLinked.some((item) => item.headname)) {
            const extractedIdsHeadLinked = selectedRowsNewHeadLinked.map((item) => item.headname);
            console.log(extractedIdsHeadLinked, "extractedIdsHeadLinked")
            if (JSON.stringify(extractedIdsHeadLinked) !== JSON.stringify(selectedRowsHeadLinked)) {
                setSelectedRowsHeadLinked(extractedIdsHeadLinked); // Update the state
            }
        }


        if (pagenamecheck === "Type Master" && selectedRowsNewTypeMaster.some((item) => item.name)) {
            const extractedIdsTypeMaster = selectedRowsNewTypeMaster.map((item) => item.name);
            console.log(extractedIdsTypeMaster, "extractedIdsTypeMaster")
            if (JSON.stringify(extractedIdsTypeMaster) !== JSON.stringify(selectedRowsTypeMaster)) {
                setSelectedRowsTypeMaster(extractedIdsTypeMaster);
            }
        }
        if (pagenamecheck === "Asset Material" && selectedRowsNewAssetMaterial.some((item) => item.name)) {
            const extractedIdsAssetMaterial = selectedRowsNewAssetMaterial.map((item) => item.name);
            console.log(extractedIdsAssetMaterial, "extractedIdsAssetMaterial")
            if (JSON.stringify(extractedIdsAssetMaterial) !== JSON.stringify(selectedRowsAssetMaterial)) {
                setSelectedRowsAssetMaterial(extractedIdsAssetMaterial);
            }
        }

        if (pagenamecheck === "Asset Specification" &&
            selectedRowsNewAssetSpecification.some((item) => item.categoryname)
        ) {



            const extractedIdsAssetSpecification = selectedRowsNewAssetSpecification.map((item) => ({ component: item.categoryname, subcomponent: item.subcategoryname }));

            if (JSON.stringify(extractedIdsAssetSpecification) !== JSON.stringify(selectedRowsAssetSpecification)) {
                setSelectedRowsAssetSpecification(extractedIdsAssetSpecification);

            }
        }

        if (pagenamecheck === "Vendor Details" && selectedRowsNewVendorMaster.some((item) => item.vendorname)) {
            const extractedIdsVendorMaster = selectedRowsNewVendorMaster.map((item) => item.vendorname);
            console.log(extractedIdsVendorMaster, "extractedIdsVendorMaster")
            if (JSON.stringify(extractedIdsVendorMaster) !== JSON.stringify(selectedRowsVendorMaster)) {
                setSelectedRowsVendorMaster(extractedIdsVendorMaster);
            }
        }

        if (pagenamecheck === "Vendor Grouping" && selectedRowsNewVendorGrouping.some((item) => item.name)) {
            const extractedIdsVendorGrouping = selectedRowsNewVendorGrouping.map((item) => item.name);
            // console.log(extractedIdsVendorGrouping, "extractedIdsVendorGrouping")
            if (JSON.stringify(extractedIdsVendorGrouping) !== JSON.stringify(selectedRowsVendorGrouping)) {
                setSelectedRowsVendorGrouping(extractedIdsVendorGrouping);
            }
        }

        if (pagenamecheck === "Frequency Master" && selectedRowsNewFrequency.some((item) => item.name)) {
            const extractedIdsFrequency = selectedRowsNewFrequency.map((item) => item.name);
            // console.log(extractedIdsVendorGrouping, "extractedIdsVendorGrouping")
            if (JSON.stringify(extractedIdsFrequency) !== JSON.stringify(selectedRowsFrequency)) {
                setSelectedRowsFrequency(extractedIdsFrequency);
            }
        }
        if (pagenamecheck === "Uom Master" && selectedRowsNewUOM.some((item) => item.name)) {
            const extractedIdsUOM = selectedRowsNewUOM.map((item) => item.name);
            console.log(extractedIdsUOM, "extractedIdsUOM")
            if (JSON.stringify(extractedIdsUOM) !== JSON.stringify(selectedRowsUOM)) {
                setSelectedRowsUOM(extractedIdsUOM);
            }
        }

        if (pagenamecheck === "Asset List" && selectedRowsNewAssetList.some((item) => item.code)) {
            const extractedIdsAssetList = selectedRowsNewAssetList.map((item) => item.code);
            console.log(extractedIdsAssetList, "extractedIdsAssetList")
            if (JSON.stringify(extractedIdsAssetList) !== JSON.stringify(selectedRowsAssetList)) {
                setSelectedRowsAssetList(extractedIdsAssetList);
            }
        }

        // attenda mode master bulk delete check
        if (pagenamecheck === "Attendance Mode List" && selectedRowsAttModeNameDelt.some((item) => item.name)) {
            const extractedIdsCat = selectedRowsAttModeNameDelt.map((item) => item.name);
            if (JSON.stringify(extractedIdsCat) !== JSON.stringify(selectedAttModeNameDelt)) {
                setSelectedAttModeNameDelt(extractedIdsCat); // Update the state
            }
        }

        // Only update if selected rows have changed
        if (JSON.stringify(extractedIds) !== JSON.stringify(selectedRows)) {
            setSelectedRows(extractedIds); // Update the state
        }

    };

    const onSortChanged = (params) => {

        const allColumns = params?.columns[0]?.sort;
        setSortingNames(allColumns)
    };
    useEffect(() => {
        // Sync the grid selection with the state if necessary
        const syncSelectionWithState = () => {
            const selectedIds = new Set(selectedRows);
            gridRefTable?.current?.api?.forEachNode((node) => {
                node.setSelected(selectedIds.has(node.data.id));
            });
        };

        if (gridRefTable.current) {
            syncSelectionWithState();
        }
    }, [rowDataTable]);

    const columnMoveRef = useRef(0);
    const columnMoveLimit = 3;

    const onGridReady = useCallback((params) => {
        setGridApi(params.api);
        setColumnApi(params.columnApi);

    }, []);

    const handleColumnMoved = useCallback(
        debounce((event) => {
            if (!event.columnApi) return;

            const visible_columns = event.columnApi
                .getAllColumns()
                .filter((col) => {
                    const colState = event.columnApi
                        .getColumnState()
                        .find((state) => state.colId === col.colId);
                    return colState && !colState.hide;
                })
                .map((col) => col.colId);

            setColumnVisibility((prevVisibility) => {
                const updatedVisibility = { ...prevVisibility };

                // Ensure columns that are visible stay visible
                Object.keys(updatedVisibility).forEach((colId) => {
                    updatedVisibility[colId] = visible_columns.includes(colId);
                });

                return updatedVisibility;
            });
        }, 300),
        []
    );

    const handleColumnVisible = useCallback((event) => {
        const colId = event.column.getColId();

        // Update visibility based on event, but only when explicitly triggered by grid
        setColumnVisibility((prevVisibility) => ({
            ...prevVisibility,
            [colId]: event.visible, // Set visibility directly from the event
        }));
    }, []);

    const [columFiltershowing, setColumFiltershowing] = useState(false)


    const onFilterChanged = () => {

        if (gridApi) {
            const filterModel = gridApi.getFilterModel(); // Get the current filter model
            // Check if filters are active
            if (Object.keys(filterModel).length === 0) {
                setFilteredChanges(null)
                // No filters active, clear the filtered data state
                setFilteredRowData([]);
                setPage(1)
                setColumFiltershowing(false);
            } else {
                setFilteredChanges("changes")

                const filteredData = itemsList?.filter((item) => {
                    return Object?.keys(filterModel)?.every((field) => {
                        const filterValue = filterModel[field]?.filter;
                        if (!filterValue) return true; // No specific filter, so include all

                        // Simple filter example: adjust based on filter type and requirements
                        return item[field]
                            ?.toString()
                            ?.includes(filterValue);
                    });
                });
                if (filteredData?.length === 0) {
                    setColumFiltershowing(true);
                }
                console.log(filteredData, "filteredData")
                setFilteredRowData(filteredData);
            }
        }
    };
    // Get visible page numbers for pagination UI
    const getVisiblePageNumbers = () => {
        const pageNumbers = [];
        const visiblePages = Math.min(FinalPages, 3);
        const startPage = Math.max(1, page - 1); // Start 1 page before the current page
        const endPage = Math.min(FinalPages, startPage + visiblePages - 1); // Show 3 pages at max

        // Loop through and add visible page numbers
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        // If there are more pages after the last visible page, show ellipsis
        if (endPage < FinalPages) {
            pageNumbers.push("...");
        }

        return pageNumbers;
    };


    const handleColumnPinned = useCallback(
        (event) => {
            if (!gridApi) {
                console.error("Grid API is not initialized");
                return;
            }

            // Try to get the column state and log it
            const columnState = gridApi.getColumnState();

            // Check if columnState is null or undefined
            if (!columnState) {
                console.error("Column state is null, check column definitions");
                return;
            }

            // Filter the pinned columns
            const pinnedColumns = columnState.filter((col) => col.pinned === "left");

            // If more than 4 columns are pinned, unpin the last one
            if (pinnedColumns.length > 5) {
                alert("Only 4 columns can be pinned.");

                handleShowAllColumns();
                gridApi.applyColumnState({
                    state: columnState.map((col) =>
                        col.colId === event.column.colId ? { ...col, pinned: null } : col
                    ),
                    applyOrder: true,
                });

                // Optionally ensure the column remains visible
                gridApi.ensureColumnVisible(event.column.colId);

                return;
            }
        },
        [gridApi]
    );



    return (
        <>
            <Box
                style={{
                    width: "100%",
                    overflowY: "hidden", // Hide the y-axis scrollbar
                }}
            >
                {loading ? (
                    // Show skeleton loader when loading is true
                    <TableSkeleton rows={pageSize} />
                ) : (
                    <AgGridContainer>
                        <div
                            className={"ag-theme-quartz"}

                            // style={{
                            //   height: "100%",
                            //   width: "100%",
                            //   transition: "opacity 0.3s ease-in-out",
                            //   opacity: 1,
                            // }}
                            ref={gridRefTableImg}
                        >
                            <AgGridReact
                                rowData={

                                    sortingNames === null ?
                                        filteredChanges ? filteredRowData : rowDataTable
                                        : paginated ? filteredChanges ? filteredRowData : itemsList
                                            : items

                                }
                                columnDefs={
                                    columnDataTable?.filter(
                                        (column) => columnVisibility[column.field]
                                    )?.map((data) => {
                                        return {
                                            ...data,
                                            headerName: data.field === "checkbox" ? "" : data.headerName,
                                            filter: ["checkbox", 'actions'].includes(data.field) ? false : data.filter // Disable filter for checkbox
                                        };
                                    })
                                }
                                ref={gridRefTable}
                                defaultColDef={{
                                    ...defaultColDef,
                                    filter: true,
                                }}
                                domLayout={"autoHeight"}
                                selection={selection}
                                rowSelection="multiple"
                                onSelectionChanged={handleSelectionChange}
                                getRowStyle={getRowStyle}
                                getRowClass={(params) => {
                                    if (params.data.roleback) {
                                        return "roleback-row";
                                    }
                                    return "";
                                }}
                                // Pagination settings
                                pagination={true} // Enable pagination
                                paginationPageSize={pageSize} // Set page size from the dropdown selection
                                suppressColumnVirtualisation={true}
                                onGridReady={onGridReady}
                                onColumnMoved={handleColumnMoved}
                                onColumnVisible={handleColumnVisible}
                                onFilterChanged={onFilterChanged}
                                suppressPaginationPanel={true} // Hide the default pagination panel
                                suppressHorizontalScroll={false}
                                suppressSizeToFit={true}
                                suppressAutoSize={true}
                                colResizeDefault={"shift"}
                                suppressResizeObserver={false}
                                suppressAnimationFrame={true}
                                // onColumnPinned={handleColumnPinned}
                                getRowHeight={() => rowHeight} // Set a fixed row height
                                suppressRowClickSelection={true} // Ensure clicking selects the row without Ctrl/Cmd
                                rowMultiSelectWithClick={true}
                                onSortChanged={onSortChanged} // Enable multi-selection by clicking multiple rows
                            />
                        </div>
                    </AgGridContainer>
                )}
            </Box>
            {paginated ? (
                <>
                    <Pagination
                        page={columFiltershowing ? 1 : searchQuery !== "" || filteredRowData?.length !== 0 ? 1 : page}
                        pageSize={columFiltershowing ? 0 : pageSize}
                        totalPages={columFiltershowing ? 1 : searchQuery !== "" || filteredRowData?.length !== 0 ? 1 : totalPages}
                        onPageChange={handlePageChange}
                        pageItemLength={columFiltershowing ? 0 : filteredDatas?.length}
                        totalProjects={columFiltershowing ? 0 :
                            searchQuery !== "" ? filteredDatas?.length : filteredRowData?.length !== 0 ? filteredRowData?.length : totalDatas
                        }
                    />
                </>
            ) : (
                <>
                    <Box style={userStyle.dataTablestyle}>
                        <Box>
                            Showing{" "}
                            {filteredChanges !== null ? filteredRowData?.length : filteredRowData.length > 0
                                ? filteredRowData.length > 0
                                    ? (page - 1) * pageSize + 1
                                    : 0
                                : rowDataTable.length > 0
                                    ? (page - 1) * pageSize + 1
                                    : 0}{" "}
                            to{" "}
                            {filteredChanges !== null ? filteredRowData?.length : filteredRowData.length > 0
                                ? Math.min(page * pageSize, filteredRowData.length)
                                : Math.min(page * pageSize, filteredDatas.length)}{" "}
                            of{" "}
                            {filteredChanges !== null ? filteredRowData?.length : filteredRowData.length > 0
                                ? filteredRowData.length
                                : items.length}{" "}
                            entries {/* Use rowDataTable.length here for consistency */}
                        </Box>

                        {/* Pagination Controls */}
                        <Box>
                            <Button
                                onClick={(e) => {
                                    handlePageChange(1);
                                    e.preventDefault();
                                }}
                                disabled={page === 1 || FinalPages === 0}
                                sx={userStyle.paginationbtn}
                            >
                                <FirstPageIcon />
                            </Button>
                            <Button
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page === 1 || FinalPages === 0}
                                sx={userStyle.paginationbtn}
                            >
                                <NavigateBeforeIcon />
                            </Button>

                            {/* Display the dynamic page numbers */}
                            {getVisiblePageNumbers().map((pageNumber, index) => (
                                <Button
                                    key={index}
                                    onClick={() =>
                                        pageNumber !== "..." && handlePageChange(pageNumber)
                                    }
                                    sx={userStyle.paginationbtn}
                                    className={page === pageNumber ? "active" : ""}
                                    disabled={page === pageNumber || pageNumber === "..." || FinalPages === 0}
                                >
                                    {pageNumber}
                                </Button>
                            ))}

                            <Button
                                onClick={() => handlePageChange(page + 1)}
                                disabled={(filteredChanges !== null ? filteredRowData?.length === FinalPages : page === FinalPages) || FinalPages === 0}
                                sx={userStyle.paginationbtn}
                            >
                                <NavigateNextIcon />
                            </Button>
                            <Button
                                onClick={() => handlePageChange(FinalPages)}
                                disabled={(filteredChanges !== null ? filteredRowData?.length === FinalPages : page === FinalPages) || FinalPages === 0}
                                sx={userStyle.paginationbtn}
                            >
                                <LastPageIcon />
                            </Button>
                        </Box>
                    </Box>
                </>
            )}
        </>
    );
}

export default AggridTable;