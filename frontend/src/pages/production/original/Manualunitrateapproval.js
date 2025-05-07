import React, { useState, useEffect, useRef, useContext, useCallback, useMemo } from "react";
// import { DataGrid } from "@mui/x-data-grid";
import { userStyle } from "../../../pageStyle.js";
import { FaPrint, FaFilePdf, FaFileCsv, FaFileExcel } from "react-icons/fa";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import ImageIcon from "@mui/icons-material/Image";
import { Button, Box, Popover, DialogContent, ListItem, List, ListItemText, TextField, Checkbox, Typography, IconButton, DialogActions, FormControl, OutlinedInput, Grid, Select, MenuItem } from "@mui/material";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import LastPageIcon from "@mui/icons-material/LastPage";
import axios from "axios";
import { styled } from "@mui/system";
import { handleApiError } from "../../../components/Errorhandling";
import { SERVICE } from "../../../services/Baseservice.js";
import Headtitle from "../../../components/Headtitle.js";
import { UserRoleAccessContext, AuthContext } from "../../../context/Appcontext.js";
import PageHeading from "../../../components/PageHeading.js";
import { useReactToPrint } from "react-to-print";
// import ExportData from "../../../components/ExportData.js";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

import { Suspense, lazy } from "react";

// Lazy loading components
const MessageAlert = lazy(() => import("../../../components/MessageAlert.js"));
const AlertDialog = lazy(() => import("../../../components/Alert.js"));
const ExportData = lazy(() => import("../../../components/ExportData.js"));

const CustomRateField = ({ value, row, column, updateRowData }) => {
  const [rate, setRate] = useState(value); // Local state for input field

  const handleChange = (event) => {
    setRate(event.target.value); // Update local state, not the whole table
  };

  const handleBlur = () => {
    let otherFieldValue = column.field === "points" ? rate / 8.3333333333333 : rate * 8.3333333333333;

    let fieldName = column.field === "points" ? "mrate" : "points";
    // Only update parent state (table data) when input loses focus (onBlur)
    updateRowData({ ...row, [column.field]: rate, [fieldName]: otherFieldValue.toFixed(4) });
  };

  return (
    <OutlinedInput
      type="number"
      value={rate}
      onChange={handleChange}
      onBlur={handleBlur} // Trigger the update when user leaves the field
      style={{ width: "100%" }}
    />
  );
};

const ManualUnitrateApproval = () => {
  const { isUserRoleCompare, isUserRoleAccess, isAssignBranch, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);
  const gridRef = useRef(null);
  const [fileFormat, setFormat] = useState("");

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

  const [manualApprovals, setManualApprovals] = useState([]);
  const [rows, setRows] = useState([]);
  const [tableloading, settableLoading] = useState(false);
  const { auth } = useContext(AuthContext);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };
  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Production Category.png");
        });
      });
    }
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Production Category ",
    pageStyle: "print",
  });

  const fetchEmployee = async () => {
    settableLoading(false);

    try {
      let res_module = await axios.get(SERVICE.UNITRATE_MANUAL_NOTAPPROVALS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const ans = res_module?.data?.unitratemanualapproval;
      const itemsWithSerialNumber = ans?.map((item, index) => ({
        ...item,
        serialNumber: index + 1,
        id: item._id,
      }));
      // setAcpointCalculation(res_vendor?.data?.acpointcalculation);
      // const uniqueArray = itemsWithSerialNumber.filter((item, index, self) => index === self.findIndex((t) => t.name === item.name));
      setManualApprovals(itemsWithSerialNumber);
      setRows(itemsWithSerialNumber);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, []);

  let exportColumnNames = ["Project", "Category", "Sub Category", "Mrate"];
  let exportRowValues = ["project", "category", "subcategory", "mrate"];

  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

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

  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowsCate, setSelectedRowsCate] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
    <div>
      <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
    </div>
  );

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

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    project: true,
    category: true,
    subcategory: true,
    mrate: true,
    points: true,
    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

  const handleUpdate = async (data) => {
    console.log(data, "data");
    if (data.mrate === "") {
      setPopupContentMalert("Please Enter Mrate");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (data.points === "") {
      setPopupContentMalert("Please Enter Points");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (data.mrate === "0" || data.mrate === "0.0000" || data.mrate === 0) {
      setPopupContentMalert("Please Enter Non Zero Value in Mrate");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (data.points === "0" || data.points === "0.0000" || data.points === 0) {
      setPopupContentMalert("Please Enter Non Zero Value in Points");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else {
      try {
        let resCreate = await axios.post(SERVICE.UNITRATE_MANUAL_MRATE_UPDATE, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          project: String(data.project),
          category: String(data.category),
          subcategory: String(data.subcategory),
          mrate: String(data.mrate),
          points: String(data.points),
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
      } catch (err) {
        console.log(err, "err");
      }
    }
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

  const columns = [
    // {
    //   field: "checkbox",
    //   headerName: "Checkbox",
    //   width: 60,
    //   sortable: false,
    //   renderHeader: (params) => (
    //     <CheckboxHeader
    //       selectAllChecked={selectAllChecked}
    //       onSelectAll={() => {
    //         if (rows.length === 0) return;
    //         const allRowIds = rows.map((row) => row.id);
    //         const allRowIdsCate = rows.map((row) => ({ category: row.name, project: row.project }));

    //         if (selectAllChecked) {
    //           setSelectedRows([]);
    //           setSelectedRowsCate([]);
    //         } else {
    //           setSelectedRows(allRowIds);
    //           setSelectedRowsCate(allRowIdsCate);
    //         }
    //         setSelectAllChecked(!selectAllChecked);
    //       }}
    //     />
    //   ),
    //   renderCell: (params) => (
    //     <Checkbox
    //       checked={selectedRows.includes(params.row.id)}
    //       onChange={() => {
    //         let updatedSelectedRows = selectedRows.includes(params.row.id) ? selectedRows.filter((id) => id !== params.row.id) : [...selectedRows, params.row.id];
    //         let updatedSelectedRowsCate = selectedRowsCate.includes(params.row.id)
    //           ? selectedRowsCate.filter((row) => row.category !== params.row.name && row.project !== params.row.project)
    //           : [...selectedRowsCate, { category: params.row.name, project: params.row.project }];

    //         setSelectedRows(updatedSelectedRows);
    //         setSelectedRowsCate(updatedSelectedRowsCate);
    //         setSelectAllChecked(updatedSelectedRows.length === pageSize);
    //       }}
    //     />
    //   ),
    //   hide: !columnVisibility.checkbox,
    // },
    // Other columns...
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 70,
      filterable: true,

      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    {
      field: "project",
      headerName: "Project",
      flex: 0,
      width: 130,
      filterable: true,

      hide: !columnVisibility.project,
      headerClassName: "bold-header",
    },
    {
      field: "category",
      headerName: "Category",
      flex: 0,
      width: 290,
      filterable: true,

      hide: !columnVisibility.category,
      headerClassName: "bold-header",
    },
    {
      field: "subcategory",
      headerName: "Subcategory",
      flex: 0,
      width: 350,
      filterable: true,

      hide: !columnVisibility.subcategory,
      headerClassName: "bold-header",
    },

    {
      field: "points",
      headerName: "Points",
      flex: 0,
      width: 140,
      filterable: true,

      hide: !columnVisibility.subcategory,
      // hide: !columnVisibility.points,
      cellRenderer: (params) => <CustomRateField value={params.value} row={params.data} column={params.colDef} updateRowData={updateRowData} />,
    },
    {
      field: "mrate",
      headerName: "Mrate",
      flex: 0,
      width: 140,
      filterable: true,

      hide: !columnVisibility.subcategory,
      cellRenderer: (params) => <CustomRateField value={params.value} row={params.data} column={params.colDef} updateRowData={updateRowData} />,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0,
      width: 120,
      cellRenderer: (params) => (
        <Button variant="contained" sx={{ textTransform: "capitalize" }} size="small" onClick={() => handleUpdate(params.data)}>
          Approve
        </Button>
      ),
    },
  ];

  const handleShowAllColumns = () => {
    const updatedVisibility = { ...columnVisibility };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibility(updatedVisibility);
  };

  // // Function to filter columns based on search query
  const filteredColumns = columns.filter((column) => column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase()));

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
                // secondary={column.headerName }
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
      <Headtitle title={"Unitrate Manual Approval"} />
      {/* ****** Header Content ****** */}
      <PageHeading title="Unitrate Manual Approval" modulename="Production" submodulename="SetUp" mainpagename="Unitrate Manual Approval" subpagename="" subsubpagename="" />
      <Box sx={userStyle.container}>
        <Box sx={{ marginBottom: 2 }}>
          <Grid container spacing={2}>
            <Grid item md={2} sm={2} xs={12}>
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
                  sx={{ width: "77px" }}
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
            <Grid item md={7} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Box>
                {isUserRoleCompare?.includes("excelproductionsubcategory") && (
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
                {isUserRoleCompare?.includes("csvproductionsubcategory") && (
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
                {isUserRoleCompare?.includes("printproductionsubcategory") && (
                  <>
                    <Button sx={userStyle.buttongrp} onClick={handleprint}>
                      &ensp;
                      <FaPrint />
                      &ensp;Print&ensp;
                    </Button>
                  </>
                )}
                {isUserRoleCompare?.includes("pdfproductionsubcategory") && (
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
                {isUserRoleCompare?.includes("imageproductionsubcategory") && (
                  <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                    {" "}
                    <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                  </Button>
                )}
              </Box>
            </Grid>
            <Grid item md={3} sm={3} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>Search</Typography>
                <OutlinedInput id="search-field" type="text" value={searchQuery} onChange={handleSearchChange} placeholder="Search..." />
              </FormControl>
            </Grid>
          </Grid>
        </Box>
        <br />
        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
          Show All Columns
        </Button>
        &ensp;
        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
          Manage Columns
        </Button>
        <br />
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
        <Box
          style={{
            // height: 300,

            width: "100%",
            // overflowY: "hidden", // Hide the y-axis scrollbar
          }}
          className="ag-theme-quartz"
        >
          {/* <CustomStyledDataGrid
            rows={paginatedData}
            ref={gridRef}
            columns={columns}
            pageSize={pageSize}
            hideFooter
            hideFooterPagination
            autoHeight
            rowsPerPageOptions={[]}
            //  onCellEditCommit={handleEditCellChange}
          /> */}
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
            // rowSelection="multiple"
            onGridReady={onGridReady}
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

            {/* Pagination Buttons */}
            {page > Math.floor(maxVisiblePages / 2) + 1 && <span>...</span>}
            {calculatePageNumbers(totalPages, page, maxVisiblePages).map((pageNumber) => (
              <Button key={pageNumber} onClick={() => handlePageChange(pageNumber)} disabled={page === pageNumber} className={page === pageNumber ? "active" : ""} sx={userStyle.paginationbtn}>
                {pageNumber}
              </Button>
            ))}

            {totalPages > 3 && page < totalPages - 2 && <span>...</span>}

            <Button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
              <NavigateNextIcon />
            </Button>
            <Button onClick={() => setPage(totalPages)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
              <LastPageIcon />
            </Button>
          </Box>
        </Box>
      </Box>
      {/* VALIDATION */}
      <MessageAlert openPopup={openPopupMalert} handleClosePopup={handleClosePopupMalert} popupContent={popupContentMalert} popupSeverity={popupSeverityMalert} />
      {/* SUCCESS */}
      <AlertDialog openPopup={openPopup} handleClosePopup={handleClosePopup} popupContent={popupContent} popupSeverity={popupSeverity} />
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
        itemsTwo={manualApprovals ?? []}
        filename={"Production Category"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
    </Box>
  );
};

export default ManualUnitrateApproval;