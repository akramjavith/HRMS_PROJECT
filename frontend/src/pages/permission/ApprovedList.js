import React, { useState, useEffect, useRef, useContext } from "react";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { FaFileExcel, FaFileCsv } from 'react-icons/fa';
import { Box, Typography, OutlinedInput, TableBody, TableRow, TableCell, Select, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton } from "@mui/material";
import { userStyle } from "../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { ExportXL, ExportCSV } from "../../components/Export";
import { handleApiError } from "../../components/Errorhandling";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext, AuthContext } from "../../context/Appcontext";
import StyledDataGrid from "../../components/TableStyle";
import Headtitle from "../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import Resizable from "react-resizable";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import moment from 'moment';

function ApproveList() {
  const { isUserRoleCompare, isUserRoleAccess } = useContext(UserRoleAccessContext);
  const [searchQuery, setSearchQuery] = useState("");

  const [isPermissions, setIsPermissions] = useState([]);

  const { auth } = useContext(AuthContext);

  const [applyleaveCheck, setApplyleavecheck] = useState(false);

  const gridRef = useRef(null);

  const [selectedRows, setSelectedRows] = useState([]);

  const [searchQueryManage, setSearchQueryManage] = useState("");

  useEffect(
    () => {
      fetchApplyPermissions();
    }, []
  )
  const fetchApplyPermissions = async () => {
    try {
      let res_vendor = await axios.get(SERVICE.PERMISSIONS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setApplyleavecheck(true);
      let Approve = isUserRoleAccess?.role?.includes("Manager") || isUserRoleAccess?.role?.includes("HiringManager") || isUserRoleAccess?.role?.includes("HR") || isUserRoleAccess?.role?.includes("Superadmin") ? res_vendor?.data?.permissions.filter((data) => data.status === "Approved") : res_vendor?.data?.permissions.filter((data) => data.employeename === isUserRoleAccess.companyname && data.status === "Approved");
      setIsPermissions(Approve);
    } catch (err) {setApplyleavecheck(true);}
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
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
    requesthours: true,
    fromtime: true,
    endtime: true,
    employeename: true,
    employeeid: true,
    date: true,
    reasonforpermission: true,
    reportingto: true,
    actionby: true,
    status: true,
    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

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

  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = isPermissions?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [isPermissions]);

  //Datatable
  const handlePageChange = (newPage) => {
    setPage(newPage);
    setSelectedRows([]);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setSelectedRows([]);
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

  const filteredData = filteredDatas?.slice((page - 1) * pageSize, page * pageSize);

  const totalPages = Math.ceil(filteredDatas?.length / pageSize);

  const visiblePages = Math.min(totalPages, 3);

  const firstVisiblePage = Math.max(1, page - 1);
  const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

  const pageNumbers = [];

  const indexOfLastItem = page * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;

  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  }

  const columnDataTable = [
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 60,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    { field: "employeename", headerName: "Employee Name", flex: 0, width: 150, hide: !columnVisibility.employeename, headerClassName: "bold-header" },
    { field: "employeeid", headerName: "Employee Id", flex: 0, width: 160, hide: !columnVisibility.employeeid, headerClassName: "bold-header" },
    { field: "date", headerName: "Date", flex: 0, width: 100, hide: !columnVisibility.date, headerClassName: "bold-header" },
    { field: "fromtime", headerName: "From Time", flex: 0, width: 100, hide: !columnVisibility.fromtime, headerClassName: "bold-header" },
    { field: "requesthours", headerName: "Request Hours", flex: 0, width: 80, hide: !columnVisibility.requesthours, headerClassName: "bold-header" },
    { field: "endtime", headerName: "End Time", flex: 0, width: 100, hide: !columnVisibility.endtime, headerClassName: "bold-header" },
    { field: "reasonforpermission", headerName: "Reason for Permission", flex: 0, width: 180, hide: !columnVisibility.reasonforpermission, headerClassName: "bold-header" },
    // {
    //   field: "status",
    //   headerName: "Status",
    //   flex: 0,
    //   width: 100,
    //   hide: !columnVisibility.status,
    //   headerClassName: "bold-header",
    //   renderCell: (params) => (
    //     <Button
    //       variant="contained"
    //       style={{
    //         padding: "5px",
    //         backgroundColor: params.value === "Applied" ? "#FFC300" : params.value === "Rejected" ? "red" : params.value === "Approved" ? "green" : "inherit",
    //         color: params.value === "Applied" ? "black" : params.value === "Rejected" ? "white" : "white",
    //         fontSize: "10px",
    //         width: "90px",
    //         fontWeight: "bold",
    //       }}
    //     >
    //       {params.value}
    //     </Button>
    //   ),
    // },
    { field: isUserRoleAccess?.role?.includes("Manager") || isUserRoleAccess?.role?.includes("HiringManager") || isUserRoleAccess?.role?.includes("HR") || isUserRoleAccess?.role?.includes("Superadmin") ? "actionby" : "", headerName: isUserRoleAccess?.role?.includes("Manager") || isUserRoleAccess?.role?.includes("HiringManager") || isUserRoleAccess?.role?.includes("HR") || isUserRoleAccess?.role?.includes("Superadmin") ? "Approved By" : "", flex: 0, width: 100, hide: !columnVisibility.actionby, headerClassName: "bold-header" },
    {
      field: isUserRoleAccess?.role?.includes("Manager") || isUserRoleAccess?.role?.includes("HiringManager") || isUserRoleAccess?.role?.includes("HR") || isUserRoleAccess?.role?.includes("Superadmin") ? "status" : "",
      headerName: isUserRoleAccess?.role?.includes("Manager") || isUserRoleAccess?.role?.includes("HiringManager") || isUserRoleAccess?.role?.includes("HR") || isUserRoleAccess?.role?.includes("Superadmin") ? "Status" : "",
      flex: 0,
      width: 95,
      hide: !columnVisibility.status,
      headerClassName: "bold-header",
      renderCell: (params) =>
        isUserRoleAccess?.role?.includes("Manager") || isUserRoleAccess?.role?.includes("HiringManager") || isUserRoleAccess?.role?.includes("HR") || isUserRoleAccess?.role?.includes("Superadmin") ? (
          <Button
            variant="contained"
            style={{
              padding: "5px",
              backgroundColor: params.value === "Applied" ? "#FFC300" : params.value === "Rejected" ? "red" : params.value === "Approved" ? "green" : "inherit",
              color: params.value === "Applied" ? "black" : params.value === "Rejected" ? "white" : "white",
              fontSize: "10px",
              width: "90px",
              fontWeight: "bold",
              cursor: 'default'
            }}
          >
            {params.value}
          </Button>
        ) : null,
    },
  ];
  let today = new Date();
  var yyyy = today.getFullYear();
  const rowDataTable = filteredData?.map((item, index) => {
    const militaryTime = item.fromtime;
    const militaryTimeArray = militaryTime.split(":");
    const hours = parseInt(militaryTimeArray[0], 10);
    const minutes = militaryTimeArray[1];

    const convertedTime = new Date(yyyy, 0, 1, hours, minutes).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    return {
      id: item._id,
      serialNumber: item.serialNumber,
      employeeid: item.employeeid,
      employeename: item.employeename,
      fromtime: convertedTime,
      date: moment(item.date).format('DD-MM-YYYY'),
      endtime: item.endtime,
      requesthours: item.requesthours,
      reasonforpermission: item.reasonforpermission,
      actionby: item.actionby,
      status: item.status,
    };
  });

  const rowsWithCheckboxes = rowDataTable?.map((row) => ({
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

  // Excel
  const fileName = "Approve List";
  const [fileFormat, setFormat] = useState('')
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = fileFormat === "xl" ? '.xlsx' : '.csv';
  const exportToCSV = (csvData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  const handleExportXL = (isfilter) => {
    if (isfilter === "filtered") {
      exportToCSV(
        isUserRoleAccess.role.includes("Employee") ?
          rowDataTable?.map((t, index) => ({
            "SNo": index + 1,
            "Employee Name": t.employeename,
            "Employee Id": t.employeeid,
            "Date": t.date,
            "From Time": t.fromtime,
            "Request Hours": t.requesthours,
            "End Time": t.endtime,
            "Reason for Permission": t.reasonforpermission,
          })) :
          rowDataTable?.map((t, index) => ({
            "SNo": index + 1,
            "Employee Name": t.employeename,
            "Employee Id": t.employeeid,
            "Date": t.date,
            "From Time": t.fromtime,
            "Request Hours": t.requesthours,
            "End Time": t.endtime,
            "Reason for Permission": t.reasonforpermission,
            "Status": t.status,
            "Approved By": t.actionby,
          })),
        fileName,
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        isUserRoleAccess.role.includes("Employee") ?
          isPermissions?.map((t, index) => ({
            "SNo": index + 1,
            "Employee Name": t.employeename,
            "Employee Id": t.employeeid,
            "Date": moment(t.date).format('DD-MM-YYYY'),
            "From Time": t.fromtime,
            "Request Hours": t.requesthours,
            "End Time": t.endtime,
            "Reason for Permission": t.reasonforpermission,
          })) :
          isPermissions?.map((t, index) => ({
            "SNo": index + 1,
            "Employee Name": t.employeename,
            "Employee Id": t.employeeid,
            "Date": moment(t.date).format('DD-MM-YYYY'),
            "From Time": t.fromtime,
            "Request Hours": t.requesthours,
            "End Time": t.endtime,
            "Reason for Permission": t.reasonforpermission,
          })),
        fileName,
      );
    }
    setIsFilterOpen(false)
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Approve List",
    pageStyle: "print",
  });

  // pdf.....
  const columns = [
    { title: "SNo", field: "serialNumber" },
    { title: "Employee Id", field: "employeeid" },
    { title: "Employee Name", field: "employeename" },
    { title: "Date", field: "date" },
    { title: "From Time", field: "fromtime" },
    { title: "Request Hours", field: "requesthours" },
    { title: "End Time", field: "endtime" },
    { title: "Status", field: "status" },
    { title: "Approved By", field: "actionby" },
  ];

  const columnsRole = [
    { title: "SNo", field: "serialNumber" },
    { title: "Employee Id", field: "employeeid" },
    { title: "Employee Name", field: "employeename" },
    { title: "Date", field: "date" },
    { title: "From Time", field: "fromtime" },
    { title: "Request Hours", field: "requesthours" },
    { title: "End Time", field: "endtime" },
    { title: "Reason", field: "reasonforpermission" },
  ];

  const downloadPdf = (isfilter) => {

    const doc = new jsPDF();

    // Initialize serial number counter
    let serialNumberCounter = 1;

    const columnsWithSerial = [
      ...columns.map((col) => ({ ...col, dataKey: col.field })),
    ];

    const columnsWithRole = [
      ...columnsRole.map((col) => ({ ...col, dataKey: col.field })),
    ];

    // Modify row data to include serial number
    const dataWithSerial = isfilter === "filtered" ?
      rowDataTable.map(row => ({ ...row, serialNumber: serialNumberCounter++ })) :
      isPermissions.map(row => {
        return {
          ...row,
          serialNumber: serialNumberCounter++,
          date: moment(row.date).format('DD-MM-YYYY'),
        }
      });

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      styles: { fontSize: 5 },
      columns: !(isUserRoleAccess?.role?.includes("Manager") || isUserRoleAccess?.role?.includes("HiringManager") || isUserRoleAccess?.role?.includes("HR") || isUserRoleAccess?.role?.includes("Superadmin")) ? columnsWithRole : columnsWithSerial,
      body: dataWithSerial,
    });

    doc.save("Approve List.pdf");
  };

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "ApproveList.png");
        });
      });
    }
  };

  return (
    <Box>
      <Headtitle title={"Apply Permission"} />
      {/* ****** Header Content ****** */}

      <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lapprovedpermission") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>Approved Permission List</Typography>
            </Grid>
            <br />
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
                    {/* <MenuItem value={isPermissions?.length}>All</MenuItem> */}
                  </Select>
                </Box>
              </Grid>
              <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Box>
                  {isUserRoleCompare?.includes("excelapprovedpermission") && (
                    <>
                      {/* <ExportXL csvData={applyData} fileName={fileName} /> */}
                      <Button onClick={(e) => {
                        setIsFilterOpen(true)
                        setFormat("xl")
                      }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("csvapprovedpermission") && (
                    <>
                      {/* <ExportCSV csvData={applyData} fileName={fileName} /> */}
                      <Button onClick={(e) => {
                        setIsFilterOpen(true)
                        setFormat("csv")
                      }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("printapprovedpermission") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfapprovedpermission") && (
                    <>
                      {/* <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}>
                        <FaFilePdf />
                        &ensp;Export to PDF&ensp;
                      </Button> */}
                      <Button sx={userStyle.buttongrp}
                        onClick={() => {
                          setIsPdfFilterOpen(true)
                        }}
                      ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("imageapprovedpermission") && (
                    <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                      {" "}
                      <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                    </Button>
                  )}
                </Box>
              </Grid>
              <Grid item md={2} xs={6} sm={6}>
                <Box>
                  <FormControl fullWidth size="small">
                    <Typography>Search</Typography>
                    <OutlinedInput id="component-outlined" type="text" value={searchQuery} onChange={handleSearchChange} />
                  </FormControl>
                </Box>
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
            &ensp;
            <br />
            <br />
            {!applyleaveCheck ? (
              <>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                </Box>
              </>
            ) : (
              <>
                <Box
                  style={{
                    width: "100%",
                    overflowY: "hidden", // Hide the y-axis scrollbar
                  }}
                >
                  <StyledDataGrid rows={rowsWithCheckboxes} columns={columnDataTable.filter((column) => columnVisibility[column.field])} onSelectionModelChange={handleSelectionChange} selectionModel={selectedRows} autoHeight={true} ref={gridRef} density="compact" hideFooter getRowClassName={getRowClassName} disableRowSelectionOnClick />
                </Box>
                <Box style={userStyle.dataTablestyle}>
                  <Box>
                    Showing {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, filteredDatas.length)} of {filteredDatas.length} entries
                  </Box>
                  <Box>
                    <Button onClick={() => setPage(1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                      <FirstPageIcon />
                    </Button>
                    <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                      <NavigateBeforeIcon />
                    </Button>
                    {pageNumbers?.map((pageNumber) => (
                      <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChange(pageNumber)} className={page === pageNumber ? "active" : ""} disabled={page === pageNumber}>
                        {pageNumber}
                      </Button>
                    ))}
                    {lastVisiblePage < totalPages && <span>...</span>}
                    <Button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                      <NavigateNextIcon />
                    </Button>
                    <Button onClick={() => setPage(totalPages)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                      <LastPageIcon />
                    </Button>
                  </Box>
                </Box>
              </>
            )}
          </Box>
        </>
      )}

      <br />
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
      {/* Delete Modal */}
      <Box>
        {/* ALERT DIALOG */}

        {/* print layout */}

        <TableContainer component={Paper} sx={userStyle.printcls}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRef}>
            <TableHead>
              <TableRow>
                <TableCell> SNo</TableCell>
                <TableCell> Employee Id</TableCell>
                <TableCell>Employee Name</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>From Time</TableCell>
                <TableCell>Request Hours</TableCell>
                <TableCell>End Time</TableCell>
                <TableCell>Reason For Permission</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Approved By</TableCell>
              </TableRow>
            </TableHead>
            <TableBody align="left">
              {!(isUserRoleAccess?.role?.includes("Manager") || isUserRoleAccess?.role?.includes("HiringManager") || isUserRoleAccess?.role?.includes("HR") || isUserRoleAccess?.role?.includes("Superadmin")) ? (
                <>
                  {rowDataTable &&
                    rowDataTable.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{row.employeeid}</TableCell>
                        <TableCell>{row.employeename}</TableCell>
                        <TableCell>{row.date}</TableCell>
                        <TableCell>{row.fromtime}</TableCell>
                        <TableCell>{row.requesthours}</TableCell>
                        <TableCell>{row.endtime}</TableCell>
                        <TableCell>{row.reasonforpermission}</TableCell>
                      </TableRow>
                    ))}
                </>
              ) : (
                <>
                  {rowDataTable &&
                    rowDataTable.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{row.employeeid}</TableCell>
                        <TableCell>{row.employeename}</TableCell>
                        <TableCell>{row.date}</TableCell>
                        <TableCell>{row.fromtime}</TableCell>
                        <TableCell>{row.requesthours}</TableCell>
                        <TableCell>{row.endtime}</TableCell>
                        <TableCell>{row.reasonforpermission}</TableCell>
                        <TableCell>{row.status}</TableCell>
                        <TableCell>{row.actionby}</TableCell>
                      </TableRow>
                    ))}
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={isFilterOpen} onClose={handleCloseFilterMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>

            <IconButton
              aria-label="close"
              onClick={handleCloseFilterMod}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>

            {fileFormat === 'xl' ?
              <FaFileExcel style={{ fontSize: "70px", color: "green" }} />
              : <FaFileCsv style={{ fontSize: "70px", color: "green" }} />
            }
            <Typography variant="h5" sx={{ textAlign: "center" }}>
              Choose Export
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus variant="contained"
              onClick={(e) => {
                handleExportXL("filtered")
              }}
            >
              Export Filtered Data
            </Button>
            <Button autoFocus variant="contained"
              onClick={(e) => {
                handleExportXL("overall")

              }}
            >
              Export Over All Data
            </Button>
          </DialogActions>
        </Dialog>
        {/*Export pdf Data  */}
        <Dialog open={isPdfFilterOpen} onClose={handleClosePdfFilterMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>
            <IconButton
              aria-label="close"
              onClick={handleClosePdfFilterMod}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>

            <PictureAsPdfIcon sx={{ fontSize: "80px", color: "red" }} />
            <Typography variant="h5" sx={{ textAlign: "center" }}>
              Choose Export
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              onClick={(e) => {
                downloadPdf("filtered")
                setIsPdfFilterOpen(false);
              }}
            >
              Export Filtered Data
            </Button>
            <Button variant="contained"
              onClick={(e) => {
                downloadPdf("overall")
                setIsPdfFilterOpen(false);
              }}
            >
              Export Over All Data
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

export default ApproveList;
