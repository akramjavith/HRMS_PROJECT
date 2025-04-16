// import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
// import { ModuleRegistry } from "@ag-grid-community/core";
// import FirstPageIcon from "@mui/icons-material/FirstPage";
// import LastPageIcon from "@mui/icons-material/LastPage";
// import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
// import NavigateNextIcon from "@mui/icons-material/NavigateNext";
// import { Box, Button, Skeleton } from "@mui/material";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-quartz.css";
// import { AgGridReact } from "ag-grid-react";
// import debounce from "lodash/debounce";
// import React, {
//     useCallback,
//     useEffect,
//     useMemo,
//     useRef,
//     useState,
// } from "react";
// import styled from "styled-components";
// import { userStyle } from "../pageStyle";
// import Pagination from "./Pagination";

// const AgGridContainer = styled.div`
//   .ag-theme-quartz {
//     transition: none !important;
//     overflow: auto;
//   }
//   ,
//   .ag-pinned-left {
//     overflow-x: auto !important;
//     max-height: 100%;
//   }
// `;

// const TableSkeleton = ({ rows }) => {
//     return (
//         <Box>
//             {Array.from({ length: rows }).map((_, rowIndex) => (
//                 <Skeleton
//                     key={rowIndex}
//                     variant="rectangular"
//                     width="100%"
//                     height={40} // Adjust row height as needed
//                     style={{ marginBottom: 8, opacity: 0.2 }} // Adds space between skeleton rows
//                     animation="wave"
//                 />
//             ))}
//         </Box>
//     );
// };

// function AggridTable({
//     rowDataTable,
//     columnDataTable,
//     columnVisibility,
//     page,
//     setPage,
//     pageSize,
//     totalPages,
//     setColumnVisibility,
//     isHandleChange,
//     items,
//     selectedRows,
//     setSelectedRows,
//     selectedRowsCat,
//     setSelectedRowsCat,
//     selectedAttModeNameDelt,
//     setSelectedAttModeNameDelt,
//     pagenamecheck,
//     gridRefTable,
//     paginated,
//     filteredDatas,
//     totalDatas,
//     searchQuery,
//     handleShowAllColumns,
//     rowHeight = 50,
//     setFilteredRowData,
//     filteredRowData,
//     setFilteredChanges,
//     filteredChanges,
//     gridRefTableImg,
//     itemsList,
// }) {
//     ModuleRegistry.registerModules([ClientSideRowModelModule]);

//     const [loading, setLoading] = useState(false);


//     const [sortingNames, setSortingNames] = useState(null);
//     const getRowStyle = (params) => {
//         if (params.node.rowIndex % 2 === 0) {
//             return { background: "#f0f0f0" }; // Even row
//         } else {
//             return { background: "#ffffff" }; // Odd row
//         }
//     };
//     const defaultColDef = useMemo(() => {
//         return {
//             filter: true,
//             resizable: true,
//             filterParams: {
//                 buttons: ["apply", "reset", "cancel"], // Show Apply, Reset, and Cancel (X) buttons in the filter popup
//                 closeOnApply: true, // Filter popup closes only when you click "Apply"
//             },
//             // flex: 1,
//             // minWidth: 90,
//             // sortable: true,
//         };
//     }, []);

//     const selection = {
//         mode: "multiRow",
//         headerCheckbox: false,
//     };

//     const [gridApi, setGridApi] = useState(null);
//     const [columnApi, setColumnApi] = useState(null);
//     // const [filteredRowData, setFilteredRowData] = useState([]);
//     // const [filteredChanges, setFilteredChanges] = useState(null);
//     const scrollPositionRef = useRef(0);
//     const FinalPages = paginated ? totalPages : Math.ceil((filteredChanges !== null ? filteredRowData : filteredDatas)?.length / pageSize);


//     const handlePageChange = (newPage) => {
//         // Store current scroll position
//         scrollPositionRef.current =
//             window.scrollY || document.documentElement.scrollTop;
//         setLoading(true);
//         setSortingNames(null)

//         const selectedRowsNewCat = gridRefTable?.current?.api?.getSelectedRows();
//         const selectedRowsAttModeNameDelt = gridRefTable.current.api.getSelectedRows();

//         // const extractedIdsCat = selectedRowsNewCat.map((item) => item.servicenumber);
//         if (pagenamecheck === "EB Services Master List" && selectedRowsNewCat.some((item) => item.servicenumber)) {

//             setSelectedRowsCat([])
//         }

//         // bulk delete check linked for att mode master
//         if (pagenamecheck === "Attendance Mode List" && selectedRowsAttModeNameDelt.some((item) => item.name)) {

//             setSelectedAttModeNameDelt([])
//         }

//         setSelectedRows([])

//         // setSelectedRowsCat([])

//         // If the new page is within the total pages
//         if (newPage >= 1 && newPage <= FinalPages) {
//             setPage(newPage);

//             // Go to the new page (AG Grid is zero-indexed)
//             gridRefTable.current.api.paginationGoToPage(newPage - 1);
//         }

//         // Simulate data fetch delay
//         setTimeout(() => {
//             setLoading(false); // Stop loading after data is fetched

//             // Restore scroll position after the new content is rendered
//             window.requestAnimationFrame(() => {
//                 // Scroll to the previously stored position
//                 window.scrollTo({
//                     top: scrollPositionRef.current,
//                     behavior: "auto", // Change to 'smooth' if you want smooth scrolling
//                 });
//             });
//         }, 50); // Adjust timeout based on the real load time
//     };



//     const handleSelectionChange = () => {
//         const selectedRowsNew = gridRefTable.current.api.getSelectedRows();
//         const selectedRowsNewCat = gridRefTable.current.api.getSelectedRows();
//         const selectedRowsAttModeNameDelt = gridRefTable.current.api.getSelectedRows();

//         const extractedIds = selectedRowsNew.map((item) => item.id);

//         // const extractedIdsCat = selectedRowsNewCat.map((item) => item.servicenumber);
//         if (pagenamecheck === "EB Services Master List" && selectedRowsNewCat.some((item) => item.servicenumber)) {
//             const extractedIdsCat = selectedRowsNewCat.map((item) => item.servicenumber);
//             if (JSON.stringify(extractedIdsCat) !== JSON.stringify(selectedRowsCat)) {
//                 setSelectedRowsCat(extractedIdsCat); // Update the state
//             }
//         }

//         // attenda mode master bulk delete check
//         if (pagenamecheck === "Attendance Mode List" && selectedRowsAttModeNameDelt.some((item) => item.name)) {
//             const extractedIdsCat = selectedRowsAttModeNameDelt.map((item) => item.name);
//             if (JSON.stringify(extractedIdsCat) !== JSON.stringify(selectedAttModeNameDelt)) {
//                 setSelectedAttModeNameDelt(extractedIdsCat); // Update the state
//             }
//         }

//         // Only update if selected rows have changed
//         if (JSON.stringify(extractedIds) !== JSON.stringify(selectedRows)) {
//             setSelectedRows(extractedIds); // Update the state
//         }

//     };


//     const onSortChanged = (params) => {
//         const allColumns = params?.columns[0]?.sort;
//         setSortingNames(allColumns)
//     };
//     useEffect(() => {
//         // Sync the grid selection with the state if necessary
//         const syncSelectionWithState = () => {
//             const selectedIds = new Set(selectedRows);
//             gridRefTable?.current?.api?.forEachNode((node) => {
//                 node.setSelected(selectedIds.has(node.data.id));
//             });
//         };

//         if (gridRefTable.current) {
//             syncSelectionWithState();
//         }
//     }, [rowDataTable]);

//     const columnMoveRef = useRef(0);
//     const columnMoveLimit = 3;

//     const onGridReady = useCallback((params) => {
//         setGridApi(params.api);
//         setColumnApi(params.columnApi);
//     }, []);

//     const handleColumnMoved = useCallback(
//         debounce((event) => {
//             if (!event.columnApi) return;

//             const visible_columns = event.columnApi
//                 .getAllColumns()
//                 .filter((col) => {
//                     const colState = event.columnApi
//                         .getColumnState()
//                         .find((state) => state.colId === col.colId);
//                     return colState && !colState.hide;
//                 })
//                 .map((col) => col.colId);

//             setColumnVisibility((prevVisibility) => {
//                 const updatedVisibility = { ...prevVisibility };

//                 // Ensure columns that are visible stay visible
//                 Object.keys(updatedVisibility).forEach((colId) => {
//                     updatedVisibility[colId] = visible_columns.includes(colId);
//                 });

//                 return updatedVisibility;
//             });
//         }, 300),
//         []
//     );

//     const handleColumnVisible = useCallback((event) => {
//         const colId = event.column.getColId();

//         // Update visibility based on event, but only when explicitly triggered by grid
//         setColumnVisibility((prevVisibility) => ({
//             ...prevVisibility,
//             [colId]: event.visible, // Set visibility directly from the event
//         }));
//     }, []);

//     const onFilterChanged = () => {

//         if (gridApi) {
//             const filterModel = gridApi.getFilterModel(); // Get the current filter model
//             // Check if filters are active
//             if (Object.keys(filterModel).length === 0) {
//                 setFilteredChanges(null)
//                 // No filters active, clear the filtered data state
//                 setFilteredRowData([]);

//             } else {
//                 setFilteredChanges("changes")
//                 // Filters are active, capture filtered data
//                 const filteredData = [];
//                 gridApi.forEachNodeAfterFilterAndSort((node) => {
//                     filteredData.push(node.data); // Collect filtered row data
//                 });

//                 setFilteredRowData(filteredData);
//             }
//         }
//     };

//     // Get visible page numbers for pagination UI
//     const getVisiblePageNumbers = () => {
//         const pageNumbers = [];
//         const visiblePages = Math.min(FinalPages, 3);
//         const startPage = Math.max(1, page - 1); // Start 1 page before the current page
//         const endPage = Math.min(FinalPages, startPage + visiblePages - 1); // Show 3 pages at max

//         // Loop through and add visible page numbers
//         for (let i = startPage; i <= endPage; i++) {
//             pageNumbers.push(i);
//         }

//         // If there are more pages after the last visible page, show ellipsis
//         if (endPage < FinalPages) {
//             pageNumbers.push("...");
//         }

//         return pageNumbers;
//     };

//     const handleColumnPinned = useCallback(
//         (event) => {
//             if (!gridApi) {
//                 console.error("Grid API is not initialized");
//                 return;
//             }

//             // Try to get the column state and log it
//             const columnState = gridApi.getColumnState();

//             // Check if columnState is null or undefined
//             if (!columnState) {
//                 console.error("Column state is null, check column definitions");
//                 return;
//             }

//             // Filter the pinned columns
//             const pinnedColumns = columnState.filter((col) => col.pinned === "left");

//             // If more than 4 columns are pinned, unpin the last one
//             if (pinnedColumns.length > 5) {
//                 alert("Only 4 columns can be pinned.");

//                 handleShowAllColumns();
//                 gridApi.applyColumnState({
//                     state: columnState.map((col) =>
//                         col.colId === event.column.colId ? { ...col, pinned: null } : col
//                     ),
//                     applyOrder: true,
//                 });

//                 // Optionally ensure the column remains visible
//                 gridApi.ensureColumnVisible(event.column.colId);

//                 return;
//             }
//         },
//         [gridApi]
//     );

//     return (
//         <>
//             <Box
//                 style={{
//                     width: "100%",
//                     overflowY: "hidden", // Hide the y-axis scrollbar
//                 }}
//             >
//                 {loading ? (
//                     // Show skeleton loader when loading is true
//                     <TableSkeleton rows={pageSize} />
//                 ) : (
//                     <AgGridContainer>
//                         <div
//                             className={"ag-theme-quartz"}

//                             // style={{
//                             //   height: "100%",
//                             //   width: "100%",
//                             //   transition: "opacity 0.3s ease-in-out",
//                             //   opacity: 1,
//                             // }}
//                             ref={gridRefTableImg}
//                         >
//                             <AgGridReact
//                                 rowData={sortingNames === null ? rowDataTable : paginated ? itemsList : items}
//                                 // columnDefs={columnDataTable.filter(
//                                 //   (column) => columnVisibility[column.field]
//                                 // )}
//                                 columnDefs={
//                                     columnDataTable?.filter(
//                                         (column) => columnVisibility[column.field]
//                                     )?.map((data) => {
//                                         return {
//                                             ...data,
//                                             headerName: data.field === "checkbox" ? "" : data.headerName,
//                                             filter: ["checkbox", 'actions'].includes(data.field) ? false : data.filter // Disable filter for checkbox
//                                         };
//                                     })
//                                 }
//                                 ref={gridRefTable}
//                                 defaultColDef={{
//                                     ...defaultColDef,
//                                     filter: true, // Enable filter by default
//                                 }}
//                                 // ref={gridRefTable}
//                                 // defaultColDef={defaultColDef}
//                                 domLayout={"autoHeight"}
//                                 selection={selection}
//                                 rowSelection="multiple"
//                                 onSelectionChanged={handleSelectionChange}
//                                 getRowStyle={getRowStyle}
//                                 // Pagination settings
//                                 pagination={true} // Enable pagination
//                                 paginationPageSize={pageSize} // Set page size from the dropdown selection
//                                 suppressColumnVirtualisation={true}
//                                 onGridReady={onGridReady}
//                                 onColumnMoved={handleColumnMoved}
//                                 onColumnVisible={handleColumnVisible}
//                                 onFilterChanged={onFilterChanged}
//                                 suppressPaginationPanel={true} // Hide the default pagination panel
//                                 suppressHorizontalScroll={false}
//                                 suppressSizeToFit={true}
//                                 suppressAutoSize={true}
//                                 colResizeDefault={"shift"}
//                                 suppressResizeObserver={false}
//                                 suppressAnimationFrame={true}
//                                 // onColumnPinned={handleColumnPinned}
//                                 getRowHeight={() => rowHeight} // Set a fixed row height
//                                 suppressRowClickSelection={true} // Ensure clicking selects the row without Ctrl/Cmd
//                                 rowMultiSelectWithClick={true}
//                                 onSortChanged={onSortChanged} // Enable multi-selection by clicking multiple rows
//                             />
//                         </div>
//                     </AgGridContainer>
//                 )}
//             </Box>
//             {paginated ? (
//                 <>
//                     <Pagination
//                         page={page}
//                         pageSize={pageSize}
//                         totalPages={searchQuery !== "" ? 1 : totalPages}
//                         onPageChange={handlePageChange}
//                         pageItemLength={filteredDatas?.length}
//                         totalProjects={
//                             searchQuery !== "" ? filteredDatas?.length : totalDatas
//                         }
//                     />
//                 </>
//             ) : (
//                 <>
//                     <Box style={userStyle.dataTablestyle}>
//                         <Box>
//                             Showing{" "}
//                             {filteredChanges !== null ? filteredRowData?.length : filteredRowData.length > 0
//                                 ? filteredRowData.length > 0
//                                     ? (page - 1) * pageSize + 1
//                                     : 0
//                                 : rowDataTable.length > 0
//                                     ? (page - 1) * pageSize + 1
//                                     : 0}{" "}
//                             to{" "}
//                             {filteredChanges !== null ? filteredRowData?.length : filteredRowData.length > 0
//                                 ? Math.min(page * pageSize, filteredRowData.length)
//                                 : Math.min(page * pageSize, filteredDatas.length)}{" "}
//                             of{" "}
//                             {filteredChanges !== null ? filteredRowData?.length : filteredRowData.length > 0
//                                 ? filteredRowData.length
//                                 : items.length}{" "}
//                             entries {/* Use rowDataTable.length here for consistency */}
//                         </Box>

//                         {/* Pagination Controls */}
//                         <Box>
//                             <Button
//                                 onClick={(e) => {
//                                     handlePageChange(1);
//                                     e.preventDefault();
//                                 }}
//                                 disabled={page === 1}
//                                 sx={userStyle.paginationbtn}
//                             >
//                                 <FirstPageIcon />
//                             </Button>
//                             <Button
//                                 onClick={() => handlePageChange(page - 1)}
//                                 disabled={page === 1}
//                                 sx={userStyle.paginationbtn}
//                             >
//                                 <NavigateBeforeIcon />
//                             </Button>

//                             {/* Display the dynamic page numbers */}
//                             {getVisiblePageNumbers().map((pageNumber, index) => (
//                                 <Button
//                                     key={index}
//                                     onClick={() =>
//                                         pageNumber !== "..." && handlePageChange(pageNumber)
//                                     }
//                                     sx={userStyle.paginationbtn}
//                                     className={page === pageNumber ? "active" : ""}
//                                     disabled={page === pageNumber || pageNumber === "..."}
//                                 >
//                                     {pageNumber}
//                                 </Button>
//                             ))}

//                             <Button
//                                 onClick={() => handlePageChange(page + 1)}
//                                 disabled={filteredChanges !== null ? filteredRowData?.length === FinalPages : page === FinalPages}
//                                 sx={userStyle.paginationbtn}
//                             >
//                                 <NavigateNextIcon />
//                             </Button>
//                             <Button
//                                 onClick={() => handlePageChange(FinalPages)}
//                                 disabled={filteredChanges !== null ? filteredRowData?.length === FinalPages : page === FinalPages}
//                                 sx={userStyle.paginationbtn}
//                             >
//                                 <LastPageIcon />
//                             </Button>
//                         </Box>
//                     </Box>
//                 </>
//             )}
//         </>
//     );
// }

// export default AggridTable;








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
    itemsList,
    pageNumbers
}) {
    ModuleRegistry.registerModules([ClientSideRowModelModule]);

    const [loading, setLoading] = useState(false);


    const [sortingNames, setSortingNames] = useState(null);
    const getRowStyle = (params) => {
        if (params.node.rowIndex % 2 === 0) {
            return { background: "#f0f0f0" }; // Even row
        } else {
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
    // const [filteredRowData, setFilteredRowData] = useState([]);
    // const [filteredChanges, setFilteredChanges] = useState(null);
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
            // const extractedIdsCat = selectedRowsNewCat.map((item) => item.servicenumber);
            if (selectedRowsNewCat.some((item) => item.servicenumber)) {
                setSelectedRowsCat([])
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

        // setSelectedRowsCat([])

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
        const selectedRowsAttModeNameDelt = gridRefTable?.current?.api?.getSelectedRows();

        const extractedIds = selectedRowsNew.map((item) => item.id);

        // const extractedIdsCat = selectedRowsNewCat.map((item) => item.servicenumber);
        if (pagenamecheck === "EB Services Master List" && selectedRowsNewCat.some((item) => item.servicenumber)) {
            const extractedIdsCat = selectedRowsNewCat.map((item) => item.servicenumber);
            if (JSON.stringify(extractedIdsCat) !== JSON.stringify(selectedRowsCat)) {
                setSelectedRowsCat(extractedIdsCat); // Update the state
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

    const onFilterChanged = () => {

        if (gridApi) {
            const filterModel = gridApi.getFilterModel(); // Get the current filter model
            // Check if filters are active
            if (Object.keys(filterModel).length === 0) {
                setFilteredChanges(null)
                // No filters active, clear the filtered data state
                setFilteredRowData([]);

            } else {
                setFilteredChanges("changes")
                // Filters are active, capture filtered data
                const filteredData = [];
                gridApi.forEachNodeAfterFilterAndSort((node) => {
                    filteredData.push(node.data); // Collect filtered row data
                });

                setFilteredRowData(filteredData);
            }
        }
    };

    // Get visible page numbers for pagination UI
    // const getVisiblePageNumbers = () => {
    //     const pageNumbers = [];
    //     const visiblePages = Math.min(FinalPages, 3);
    //     const startPage = Math.max(1, page - 1); // Start 1 page before the current page
    //     const endPage = Math.min(FinalPages, startPage + visiblePages - 1); // Show 3 pages at max

    //     // Loop through and add visible page numbers
    //     for (let i = startPage; i <= endPage; i++) {
    //         pageNumbers.push(i);
    //     }

    //     // If there are more pages after the last visible page, show ellipsis
    //     if (endPage < FinalPages) {
    //         pageNumbers.push("...");
    //     }

    //     return pageNumbers;
    // };

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
                                rowData={sortingNames === null ? rowDataTable : paginated ? itemsList : items}
                                // columnDefs={columnDataTable.filter(
                                //   (column) => columnVisibility[column.field]
                                // )}
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
                                    filter: true, // Enable filter by default
                                }}
                                // ref={gridRefTable}
                                // defaultColDef={defaultColDef}
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
                        page={page}
                        pageSize={pageSize}
                        totalPages={searchQuery !== "" ? 1 : totalPages}
                        onPageChange={handlePageChange}
                        pageItemLength={filteredDatas?.length}
                        totalProjects={
                            searchQuery !== "" ? filteredDatas?.length : totalDatas
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
                                disabled={page === 1}
                                sx={userStyle.paginationbtn}
                            >
                                <FirstPageIcon />
                            </Button>
                            <Button
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page === 1}
                                sx={userStyle.paginationbtn}
                            >
                                <NavigateBeforeIcon />
                            </Button>

                            {/* Display the dynamic page numbers */}
                            {pageNumbers.map((pageNumber, index) => (
                                <Button
                                    key={index}
                                    onClick={() =>
                                        pageNumber !== "..." && handlePageChange(pageNumber)
                                    }
                                    sx={userStyle.paginationbtn}
                                    className={page === pageNumber ? "active" : ""}
                                    disabled={page === pageNumber || pageNumber === "..."}
                                >
                                    {pageNumber}
                                </Button>
                            ))}

                            <Button
                                onClick={() => handlePageChange(page + 1)}
                                disabled={filteredChanges !== null ? filteredRowData?.length === FinalPages : page === FinalPages}
                                sx={userStyle.paginationbtn}
                            >
                                <NavigateNextIcon />
                            </Button>
                            <Button
                                onClick={() => handlePageChange(FinalPages)}
                                disabled={filteredChanges !== null ? filteredRowData?.length === FinalPages : page === FinalPages}
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
