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
import React, { useCallback, useEffect, useMemo, useRef, useState, } from "react";
import styled from "styled-components";
import { userStyle } from "../pageStyle";

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

function AggridTable({ rowDataTable, columnDataTable, columnVisibility, page, setPage, pageSize, totalPages, setColumnVisibility,
    selectedRows, setSelectedRows, gridRefTable, totalDatas, rowHeight = 50, setFilteredRowData,
    filteredRowData, gridRefTableImg, itemsList, selectedRowsAssetList, setSelectedRowsAssetList, pagenamecheck, selectedRowsRequestPurchase,
    setSelectedRowsRequestPurchase,
}) {

    ModuleRegistry.registerModules([ClientSideRowModelModule]);

    const [loading, setLoading] = useState(false);
    const [sortingNames, setSortingNames] = useState(null);
    const [gridApi, setGridApi] = useState(null);
    const [columnApi, setColumnApi] = useState(null);
    const scrollPositionRef = useRef(0);

    const getRowStyle = (params) => {
        if (params.node.rowIndex % 2 === 0) {
            return { background: "#f0f0f0" };
        } else {
            return { background: "#ffffff" };
        }
    };

    const defaultColDef = useMemo(() => {
        return {
            filter: true,
            resizable: true,
            filterParams: {
                buttons: ["apply", "reset", "cancel"],
                closeOnApply: true,
            },
        };
    }, []);

    const selection = {
        mode: "multiRow",
        headerCheckbox: false,
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

    const onGridReady = useCallback((params) => {
        setGridApi(params.api);
        setColumnApi(params.columnApi);

        // If there's a saved filter model, set it back
        const savedFilterModel = localStorage.getItem("filterModel");
        if (savedFilterModel) {
            params.api.setFilterModel(JSON.parse(savedFilterModel));
        }
    }, []);

    const onFilterChanged = () => {

        if (gridApi) {
            const filterModel = gridApi.getFilterModel(); // Get the current filter model
            // Save the filter model in localStorage
            localStorage.setItem("filterModel", JSON.stringify(filterModel));
            // Check if filters are active
            if (Object.keys(filterModel).length === 0) {
                setFilteredRowData([]); // No filters active, clear the filtered data state
                setPage(1)
            } else {

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

                setFilteredRowData(filteredData);
            }
        }
    };

    const handlePageChange = (newPage) => {
        // Store current scroll position
        scrollPositionRef.current =
            window.scrollY || document.documentElement.scrollTop;
        setLoading(true);
        setSortingNames(null)

        if (pagenamecheck === "Asset List") {
            // const selectedRowsAssetList = gridRefTable?.current?.api?.getSelectedRows();
            // if (selectedRowsAssetList.some((item) => item.code)) {
            setSelectedRowsAssetList([])
            // }
        }
        if (pagenamecheck === "Stock Request Purchase") {
            // const selectedRowsRequestPurchase = gridRefTable?.current?.api?.getSelectedRows();
            // if (selectedRowsRequestPurchase.some((item) => item)) {
            setSelectedRowsRequestPurchase([])
            // }
        }

        setSelectedRows([])

        // If the new page is within the total pages
        if (newPage >= 1 && newPage <= totalPages) {
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
        const extractedIds = selectedRowsNew.map((item) => item.id);
        const selectedRowsNewAssetList = gridRefTable?.current?.api?.getSelectedRows();
        const selectedRowsRequestToPurchase = gridRefTable?.current?.api?.getSelectedRows();

        if (pagenamecheck === "Asset List") {
            const extractedIdsAssetList = selectedRowsNewAssetList.map((item) =>
            ({
                company: item.company,
                branch: item.branch,
                unit: item.unit,
                floor: item.floor,
                area: item.area,
                location: item.location,
                code: item.code,
                // workstation: data.workstation,
                assetmaterial: item.material
            })
            );
            if (JSON.stringify(extractedIdsAssetList) !== JSON.stringify(selectedRowsAssetList)) {
                setSelectedRowsAssetList(extractedIdsAssetList);
            }
        }

        if (pagenamecheck === "Stock Request Purchase") {
            const extractedIdsRequestPurchase = selectedRowsRequestToPurchase.map((item) => item);
            if (JSON.stringify(extractedIdsRequestPurchase) !== JSON.stringify(selectedRowsRequestPurchase)) {
                setSelectedRowsRequestPurchase(extractedIdsRequestPurchase); // Update the state
            }
        }


        // Only update if selected rows have changed
        if (JSON.stringify(extractedIds) !== JSON.stringify(selectedRows)) {
            setSelectedRows(extractedIds); // Update the state
        }
    };

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
    const visiblePages = Math.min(totalPages, 3);
    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);
    const pageNumbers = [];

    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }

    return (
        <>
            <Box
                style={{ width: "100%", overflowY: "hidden", }} >
                {loading ? (
                    // Show skeleton loader when loading is true
                    <TableSkeleton rows={pageSize} />
                ) : (
                    <AgGridContainer>
                        <div className={"ag-theme-quartz"} ref={gridRefTableImg} >
                            <AgGridReact
                                // rowData={filteredChanges ? filteredRowData : rowDataTable}
                                rowData={rowDataTable}
                                columnDefs={columnDataTable?.filter(
                                    (column) => columnVisibility[column.field]
                                )?.map((data) => {
                                    return {
                                        ...data,
                                        headerName: data.field === "checkbox" ? "" : data.headerName,
                                        filter: ["checkbox", 'actions'].includes(data.field) ? false : data.filter,
                                        sortable: true // Enable sorting explicitly
                                    };
                                })}
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
                                getRowHeight={() => rowHeight} // Set a fixed row height
                                suppressRowClickSelection={true} // Ensure clicking selects the row without Ctrl/Cmd
                                rowMultiSelectWithClick={true}
                                onSortChanged={onSortChanged} // Enable multi-selection by clicking multiple rows
                            />
                        </div>
                    </AgGridContainer>
                )}
            </Box>
            <Box style={userStyle.dataTablestyle}>
                <Box>
                    Showing {rowDataTable.length > 0 ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, totalDatas)} of {totalDatas} entries
                </Box>
                <Box>
                    <Button onClick={() => setPage(1)} disabled={page === 1 || totalPages === 0} sx={userStyle.paginationbtn}>
                        <FirstPageIcon />
                    </Button>
                    <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1 || totalPages === 0} sx={userStyle.paginationbtn}>
                        <NavigateBeforeIcon />
                    </Button>
                    {pageNumbers.map((pageNumber) => (
                        <Button key={pageNumber} onClick={() => handlePageChange(pageNumber)} className={page === pageNumber ? "active" : ""} disabled={page === pageNumber || totalPages === 0} sx={userStyle.paginationbtn}>
                            {pageNumber}
                        </Button>
                    ))}
                    <Button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages || totalPages === 0} sx={userStyle.paginationbtn}>
                        <NavigateNextIcon />
                    </Button>
                    <Button onClick={() => setPage(totalPages)} disabled={page === totalPages || totalPages === 0} sx={userStyle.paginationbtn}>
                        <LastPageIcon />
                    </Button>
                </Box>
            </Box>
        </>
    );
}

export default AggridTable;