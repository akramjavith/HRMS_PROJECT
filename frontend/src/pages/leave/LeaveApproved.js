import React, { useState, useEffect, useRef, useContext } from "react";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { FaFileExcel, FaFileCsv } from 'react-icons/fa';
import { Box, Typography, OutlinedInput, TableBody, TableRow, TableCell, Select, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton } from "@mui/material";
import { userStyle } from "../../pageStyle";
import { FaPrint, FaFilePdf, FaPlus, FaEdit } from "react-icons/fa";
import { ExportXL, ExportCSV } from "../../components/Export";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../components/Errorhandling";
import { UserRoleAccessContext, AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import StyledDataGrid from "../../components/TableStyle";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import Resizable from "react-resizable";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { SERVICE } from "../../services/Baseservice";

function ApprovedLeave() {
  const [searchQuery, setSearchQuery] = useState("");

  const { isUserRoleCompare, isUserRoleAccess } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);
  const [isApplyLeave, setIsApplyLeave] = useState([]);

  const [applyleaveCheck, setApplyleavecheck] = useState(false);
  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [copiedData, setCopiedData] = useState("");

  useEffect(() => {
    fetchApplyleave();
  }, []);

  //get all Sub vendormasters.
  const fetchApplyleave = async () => {
    try {
      let res_vendor = await axios.get(SERVICE.APPLYLEAVE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setApplyleavecheck(true);
      let Approve = isUserRoleAccess?.role?.includes("Manager") || isUserRoleAccess?.role?.includes("HiringManager") || isUserRoleAccess?.role?.includes("HR") || isUserRoleAccess?.role?.includes("Superadmin") ? res_vendor?.data?.applyleaves.filter((data) => data.status === "Approved") : res_vendor?.data?.applyleaves.filter((data) => data.employeename === isUserRoleAccess.companyname && data.status === "Approved");
      setIsApplyLeave(Approve);
    } catch (err) { setApplyleavecheck(true); handleApiError(err, setShowAlert, handleClickOpenerr); }
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

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Leave Approved.png");
        });
      });
    }
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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

  // Styles for the resizable column
  const ResizableColumn = styled(Resizable)`
    .react-resizable-handle {
      width: 10px;
      height: 100%;
      position: absolute;
      right: 0;
      bottom: 0;
      cursor: col-resize;
    }
  `;

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
    employeename: true,
    employeeid: true,
    leavetype: true,
    date: true,
    todate: true,
    numberofdays: true,
    reasonforleave: true,
    reportingto: true,
    actions: true,
    status: true,
    actionby: true,
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
    const itemsWithSerialNumber = isApplyLeave?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [isApplyLeave]);

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

  const filteredData = filteredDatas?.slice((page - 1) * pageSize, page * pageSize);

  const totalPages = Math.ceil(filteredDatas.length / pageSize);

  const visiblePages = Math.min(totalPages, 3);

  const firstVisiblePage = Math.max(1, page - 1);
  const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

  const pageNumbers = [];

  const indexOfLastItem = page * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;

  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  }

  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
    <div>
      <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
    </div>
  );

  const columnDataTable = [
    {
      field: "checkbox",
      headerName: "Checkbox", // Default header name
      headerStyle: {
        fontWeight: "bold", // Apply the font-weight style to make the header text bold
        // Add any other CSS styles as needed
      },
      renderHeader: (params) => (
        <CheckboxHeader
          selectAllChecked={selectAllChecked}
          onSelectAll={() => {
            if (rowDataTable.length === 0) {
              // Do not allow checking when there are no rows
              return;
            }
            if (selectAllChecked) {
              setSelectedRows([]);
            } else {
              const allRowIds = rowDataTable.map((row) => row.id);
              setSelectedRows(allRowIds);
            }
            setSelectAllChecked(!selectAllChecked);
          }}
        />
      ),

      renderCell: (params) => (
        <Checkbox
          checked={selectedRows.includes(params.row.id)}
          onChange={() => {
            let updatedSelectedRows;
            if (selectedRows.includes(params.row.id)) {
              updatedSelectedRows = selectedRows.filter((selectedId) => selectedId !== params.row.id);
            } else {
              updatedSelectedRows = [...selectedRows, params.row.id];
            }

            setSelectedRows(updatedSelectedRows);

            // Update the "Select All" checkbox based on whether all rows are selected
            setSelectAllChecked(updatedSelectedRows.length === filteredData.length);
          }}
        />
      ),
      sortable: false, // Optionally, you can make this column not sortable
      width: 90,

      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header",
    },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 75,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    { field: "employeeid", headerName: "Employee Id", flex: 0, width: 180, hide: !columnVisibility.employeeid, headerClassName: "bold-header" },
    { field: "employeename", headerName: "Employee Name", flex: 0, width: 180, hide: !columnVisibility.employeename, headerClassName: "bold-header" },
    { field: "leavetype", headerName: "Leave Type", flex: 0, width: 180, hide: !columnVisibility.leavetype, headerClassName: "bold-header" },
    { field: "date", headerName: "Date", flex: 0, width: 250, hide: !columnVisibility.date, headerClassName: "bold-header" },
    { field: "numberofdays", headerName: "Number of Days", flex: 0, width: 130, hide: !columnVisibility.numberofdays, headerClassName: "bold-header" },
    { field: "reasonforleave", headerName: "Reason for Leave", flex: 0, width: 250, hide: !columnVisibility.reasonforleave, headerClassName: "bold-header" },
    {
      field: isUserRoleAccess?.role?.includes("Manager") || isUserRoleAccess?.role?.includes("HiringManager") || isUserRoleAccess?.role?.includes("HR") || isUserRoleAccess?.role?.includes("Superadmin") ? "status" : "",
      headerName: isUserRoleAccess?.role?.includes("Manager") || isUserRoleAccess?.role?.includes("HiringManager") || isUserRoleAccess?.role?.includes("HR") || isUserRoleAccess?.role?.includes("Superadmin") ? "Status" : "",
      flex: 0,
      width: 95,
      hide: !columnVisibility.status,
      headerClassName: "bold-header",
      renderCell: (params) => {
        if (!(isUserRoleAccess?.role?.includes("Manager") || isUserRoleAccess?.role?.includes("HiringManager") || isUserRoleAccess?.role?.includes("HR") || isUserRoleAccess?.role?.includes("Superadmin")) && params.row.status === "Applied") {
          return (
            <Button
              variant="contained"
              style={{
                padding: "5px",
                backgroundColor: "#FFC300",
                color: "black",
                fontSize: "10px",
                width: "90px",
                fontWeight: "bold",
              }}
            >
              {"Applied"}
            </Button>
          );
        } else if (!(isUserRoleAccess?.role?.includes("Manager") || isUserRoleAccess?.role?.includes("HiringManager") || isUserRoleAccess?.role?.includes("HR") || isUserRoleAccess?.role?.includes("Superadmin")) && (params.row.status === "Approved" || params.row.status === "Rejected")) {
          return null;
        } else if (isUserRoleAccess?.role?.includes("Manager") || isUserRoleAccess?.role?.includes("HiringManager") || isUserRoleAccess?.role?.includes("HR") || isUserRoleAccess?.role?.includes("Superadmin")) {
          return (
            <Button
              variant="contained"
              sx={{
                padding: "5px",
                backgroundColor: params.value === "Applied" ? "#FFC300" : params.value === "Rejected" ? "red" : params.value === "Approved" ? "green" : "inherit",
                color: params.value === "Applied" ? "black" : params.value === "Rejected" ? "white" : "white",
                fontSize: "10px",
                width: "90px",
                fontWeight: "bold",
              }}
            >
              {params.value}
            </Button>
          );
        }

        return null; // or provide a default return if needed
      },
    },
    { field: isUserRoleAccess?.role?.includes("Manager") || isUserRoleAccess?.role?.includes("HiringManager") || isUserRoleAccess?.role?.includes("HR") || isUserRoleAccess?.role?.includes("Superadmin") ? "actionby" : "", headerName: isUserRoleAccess?.role?.includes("Manager") || isUserRoleAccess?.role?.includes("HiringManager") || isUserRoleAccess?.role?.includes("HR") || isUserRoleAccess?.role?.includes("Superadmin") ? "Approved By" : "", flex: 0, width: 120, hide: !columnVisibility.actionby, headerClassName: "bold-header" },
  ];

  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      employeeid: item.employeeid,
      employeename: item.employeename,
      leavetype: item.leavetype,
      date: item.date.join(','),
      numberofdays: item.numberofdays === "" ? "---" : item.numberofdays,
      reasonforleave: item.reasonforleave,
      status: item.status,
      actionby: item.actionby,
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
  const fileName = "Leave Approved";
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
            "Leave Type": t.leavetype,
            "From Date": t.date,
            "Number of days": t.numberofdays,
            "Reason for Leave": t.reasonforleave,
          })) :
          rowDataTable?.map((t, index) => ({
            "SNo": index + 1,
            "Employee Name": t.employeename,
            "Employee Id": t.employeeid,
            "Leave Type": t.leavetype,
            "From Date": t.date,
            "Number of days": t.numberofdays,
            "Reason for Leave": t.reasonforleave,
            "Status": t.status,
            "Approved By": t.actionby,
          })),
        fileName,
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        isUserRoleAccess.role.includes("Employee") ?
          isApplyLeave?.map((t, index) => ({
            "SNo": index + 1,
            "Employee Name": t.employeename,
            "Employee Id": t.employeeid,
            "Leave Type": t.leavetype,
            "From Date": t.date.join(','),
            "Number of days": t.numberofdays,
            "Reason for Leave": t.reasonforleave,
          })) :
          isApplyLeave?.map((t, index) => ({
            "SNo": index + 1,
            "Employee Name": t.employeename,
            "Employee Id": t.employeeid,
            "Leave Type": t.leavetype,
            "From Date": t.date.join(','),
            "Number of days": t.numberofdays,
            "Reason for Leave": t.reasonforleave,
            "Status": t.status,
            "Approved By": t.actionby,
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
    documentTitle: "Leave Approved",
    pageStyle: "print",
  });

  // pdf.....
  const columns = [
    { title: "SNo", field: "serialNumber" },
    { title: "Employee Id", field: "employeeid" },
    { title: "Employee Name", field: "employeename" },
    { title: "Leavetype", field: "leavetype" },
    { title: "Date", field: "date" },
    { title: "Number of Days", field: "numberofdays" },
    { title: "Reason for leave", field: "reasonforleave" },
    { title: "Status", field: "status" },
    { title: "Approved By", field: "actionby" },
  ];

  const columnsRole = [
    { title: "SNo", field: "serialNumber" },
    { title: "Employee Id", field: "employeeid" },
    { title: "Employee Name", field: "employeename" },
    { title: "Leavetype", field: "leavetype" },
    { title: "Date", field: "date" },
    { title: "Number of Days", field: "numberofdays" },
    { title: "Reason for leave", field: "reasonforleave" },
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
      isApplyLeave.map(row => {
        return {
          ...row,
          serialNumber: serialNumberCounter++,
          date: row.date.join(','),
        }
      });

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      styles: { fontSize: 5 },
      // columns: columnsWithSerial,
      columns: !(isUserRoleAccess?.role?.includes("Manager") || isUserRoleAccess?.role?.includes("HiringManager") || isUserRoleAccess?.role?.includes("HR") || isUserRoleAccess?.role?.includes("Superadmin")) ? columnsWithRole : columnsWithSerial,
      body: dataWithSerial,
    });

    doc.save("Leave Approved.pdf");
  };

  return (
    <Box>
      <Headtitle title={"Apply Leave"} />
      {/* ****** Header Content ****** */}
      <Typography sx={userStyle.HeaderText}>Leave Approved List</Typography>

      <br />

      <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lapprovedleave") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>Apply Leave List</Typography>
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
                    {/* <MenuItem value={isApplyLeave?.length}>All</MenuItem> */}
                  </Select>
                </Box>
              </Grid>
              <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Box>
                  {isUserRoleCompare?.includes("excelapprovedleave") && (
                    <>
                      {/* <ExportXL csvData={applyData} fileName={fileName} /> */}
                      <Button onClick={(e) => {
                        setIsFilterOpen(true)
                        fetchApplyleave()
                        setFormat("xl")
                      }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("csvapprovedleave") && (
                    <>
                      {/* <ExportCSV csvData={applyData} fileName={fileName} /> */}
                      <Button onClick={(e) => {
                        setIsFilterOpen(true)
                        fetchApplyleave()
                        setFormat("csv")
                      }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("printapprovedleave") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfapprovedleave") && (
                    <>
                      {/* <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}>
                        <FaFilePdf />
                        &ensp;Export to PDF&ensp;
                      </Button> */}
                      <Button sx={userStyle.buttongrp}
                        onClick={() => {
                          setIsPdfFilterOpen(true)
                          fetchApplyleave()
                        }}
                      ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("imageapprovedleave") && (
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
            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
              Show All Columns
            </Button>
            &ensp;
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
              Manage Columns
            </Button>
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
                  <StyledDataGrid onClipboardCopy={(copiedString) => setCopiedData(copiedString)} rows={rowsWithCheckboxes} columns={columnDataTable.filter((column) => columnVisibility[column.field])} onSelectionModelChange={handleSelectionChange} selectionModel={selectedRows} autoHeight={true} ref={gridRef} density="compact" hideFooter getRowClassName={getRowClassName} disableRowSelectionOnClick />
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

        {/* this is info view details */}

        {/* print layout */}

        <TableContainer component={Paper} sx={userStyle.printcls}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRef}>
            <TableHead>
              <TableRow>
                <TableCell>SNo</TableCell>
                <TableCell>Employee Id</TableCell>
                <TableCell>Employee Name</TableCell>
                <TableCell>Leave Type</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Number of days</TableCell>
                <TableCell>Reason for leave</TableCell>
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
                        <TableCell>{row.leavetype}</TableCell>
                        <TableCell>{row.date}</TableCell>
                        <TableCell>{row.numberofdays}</TableCell>
                        <TableCell>{row.reasonforleave}</TableCell>
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
                        <TableCell>{row.leavetype}</TableCell>
                        <TableCell>{row.date}</TableCell>
                        <TableCell>{row.numberofdays}</TableCell>
                        <TableCell>{row.reasonforleave}</TableCell>
                        <TableCell>{row.status}</TableCell>
                        <TableCell>{row.actionby}</TableCell>
                      </TableRow>
                    ))}
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

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
              fetchApplyleave()
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

      {/* view model */}

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

      {/* dialog status change */}
    </Box>
  );
}

export default ApprovedLeave;
