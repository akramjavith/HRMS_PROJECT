import React, { useState, useEffect, useRef, useContext } from "react";
import { TextField, IconButton, ListItem, List, Checkbox, ListItemText, Popover, Box, Typography, OutlinedInput, TableBody, Select, Paper, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Table, TableHead, TableContainer, Button } from "@mui/material";
import {  userStyle } from "../../pageStyle";
import { FaPrint, FaFilePdf, FaFileCsv, FaFileExcel, } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import moment from "moment-timezone";
import { useReactToPrint } from "react-to-print";
import StyledDataGrid from "../../components/TableStyle";
import { handleApiError } from "../../components/Errorhandling";
import { UserRoleAccessContext } from "../../context/Appcontext";
import { AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { saveAs } from "file-saver";
import { makeStyles } from "@material-ui/core";
import pdfIcon from "../../components/Assets/pdf-icon.png";
import wordIcon from "../../components/Assets/word-icon.png";
import excelIcon from "../../components/Assets/excel-icon.png";
import csvIcon from "../../components/Assets/CSV.png";
import fileIcon from "../../components/Assets/file-icons.png";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Pagination from '../../components/Pagination';

const useStyles = makeStyles((theme) => ({
  inputs: {
    display: "none",
  },
  preview: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: theme.spacing(2),
    "& > *": {
      margin: theme.spacing(1),
    },
    complete: {
      textTransform: "capitalize !IMPORTANT",
      padding: "7px 19px",
      backgroundColor: "#00905d",
      height: "fit-content",
    },
  },
}));

function IndividualRaiseTicketReport() {
  const classes = useStyles();
  const [raiseTicketList, setRaiseTicketList] = useState([]);
  const { isUserRoleCompare, isUserRoleAccess } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);
  const [selectedRows, setSelectedRows] = useState([]);
  const gridRef = useRef(null);
  //Datatable
  const [queueCheck, setQueueCheck] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQueryManage, setSearchQueryManage] = useState("");

  // Error Popup model
  const [showAlert, setShowAlert] = useState();
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  const [capturedImages, setCapturedImages] = useState([]);
  const [refImage, setRefImage] = useState([]);
  const [refImageDrag, setRefImageDrag] = useState([]);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
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

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };
  const handleExportXL = async (isfilter) => {
    if (isfilter === "filtered") {
      exportToCSV(
        filteredDatas?.map((item, index) => ({
          "Sno": index + 1,
          "Employee Name": item.employeename,
          "Employee Code": (item.employeecode),
          "Raise Date": item?.date,
          "Raise Time": item?.time,
          'Status': item.raiseself,
          "Closed By": item.ticketclosed,
        })),
        fileName,
      );
    } else if (isfilter === "overall") {
      let res_task = await axios.post(SERVICE.RAISETICKET_REPORT_OVERALL, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        username : isUserRoleAccess.companyname,
        role : false,

      });
      exportToCSV(
        res_task?.data?.result?.map((item, index) => ({
          "Sno": index + 1,
          "Employee Name": (item.employeename)?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
          "Employee Code": (item.employeecode)?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
          "Raise Date": moment(item?.createdAt).format("DD-MM-YYYY"),
          "Raise Time": new Date(item?.createdAt).toLocaleTimeString(),
          'Status': item.raiseself,
          "Closed By": item.ticketclosed ? item.ticketclosed : "-",
        })),
        fileName,
      );

    }

    setIsFilterOpen(false)
  };



  const downloadPdf = async (isfilter) => {
    const doc = new jsPDF();
    // Initialize serial number counter
    let serialNumberCounter = 1;

    // Modify columns to include serial number column
    const columnsWithSerial = [
      { title: "SNo", dataKey: "serialNumber" }, // Serial number column
      ...columns.map((col) => ({ ...col, dataKey: col.field })),
    ];

    let overall;
    if(isfilter === "overall"){
      let res_task = await axios.post(SERVICE.RAISETICKET_REPORT_OVERALL, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        username : isUserRoleAccess.companyname,
        role : false,

      });
            overall =   res_task?.data?.result?.map(item => ({
                serialNumber: serialNumberCounter++,
                employeename: (item.employeename)?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
                employeecode: (item.employeecode)?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
                date: moment(item?.createdAt).format("DD-MM-YYYY"),
                time: new Date(item?.createdAt).toLocaleTimeString(),
                raiseself: item.raiseself,
                ticketclosed: item.ticketclosed ? item.ticketclosed : "-",
            }));

    }



    // Modify row data to include serial number
    const dataWithSerial = isfilter === "filtered" ?
      filteredDatas.map(item => ({
        serialNumber: serialNumberCounter++,
        employeename: item.employeename,
        employeecode: (item.employeecode),
        date: item?.date,
        time: item?.time,
        raiseself: item.raiseself,
        ticketclosed: item.ticketclosed,
      })) :
      overall

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      styles: {
        fontSize: 4,
      },
      columns: columnsWithSerial,
      body: dataWithSerial,
    });

    doc.save("IndividualRaiseTicketReport.pdf");
  };

  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

  const handleClickOpenalert = () => {
    if (selectedRows.length === 0) {
      setIsDeleteOpenalert(true);
    } else {
    }
  };
  const handleCloseModalert = () => {
    setIsDeleteOpenalert(false);
  };

  const handleOpenManageColumns = (event) => {
    setAnchorEl(event.currentTarget);
    setManageColumnsOpen(true);
  };
  const handleCloseManageColumns = () => {
    setManageColumnsOpen(false);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const getRowClassName = (params) => {
    if (selectedRows.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };

  const [allUploadedFiles, setAllUploadedFiles] = useState([]);
  //get all project.
  const fetchAllRaisedTickets = async () => {
    try {
      let res_task = await axios.post(SERVICE.RAISETICKET_REPORT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        username : isUserRoleAccess.companyname,
        role : false,
        page : page,
        pageSize : pageSize

      });

      const ans = res_task?.data?.result?.length > 0 ? res_task?.data?.result : []
      const itemsWithSerialNumber = ans?.map((item, index) => ({
          ...item,
          serialNumber: (page - 1) * pageSize + index + 1,
          employeename: (item.employeename)?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
          employeecode: (item.employeecode)?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
          date: moment(item?.createdAt).format("DD-MM-YYYY"),
          time: new Date(item?.createdAt).toLocaleTimeString(),
          raiseself: item.raiseself,
          ticketclosed: item.ticketclosed ? item.ticketclosed : "-",
      }));
      setRaiseTicketList(itemsWithSerialNumber);
      setTotalProjects(ans?.length > 0 ? res_task?.data?.totalProjects : 0);
      setTotalPages(ans?.length > 0 ? res_task?.data?.totalPages : 0);
      setPageSize((data) => { return ans?.length > 0 ? data : 10 });
      setPage((data) => { return ans?.length > 0 ? data : 1 });

      setQueueCheck(true);
    } catch (err) {setQueueCheck(true);handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  useEffect(() => {
    fetchAllRaisedTickets();
  }, [page , pageSize]);

  // Combine all arrays into a single array
  let combinedArray = allUploadedFiles.concat(refImage, refImageDrag, capturedImages);

  // Create an empty object to keep track of unique values
  let uniqueValues = {};

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    checkbox: true,
    serialNumber: true,
    employeename: true,
    employeecode: true,
    date: true,
    time: true,
    raiseself: true,
    ticketclosed: true,

  };
  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);


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
    setPage(1);
  };

  // Split the search query into individual terms
  const searchOverTerms = searchQuery?.toLowerCase()?.split(" ");
  // Modify the filtering logic to check each term
  const filteredDatas = raiseTicketList?.filter((item) => {
    return searchOverTerms.every((term) => Object.values(item)?.join(" ")?.toLowerCase()?.includes(term));
  });

 

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
            setSelectAllChecked(updatedSelectedRows.length === filteredDatas.length);
          }}
        />
      ),
      sortable: false, // Optionally, you can make this column not sortable
      width: 50,

      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header",
    },
    {
      field: "serialNumber",
      headerName: "S.No",
      flex: 0,
      width: 50,
      hide: !columnVisibility.serialNumber,
    },

    {
      field: "employeename",
      headerName: "Raised By",
      flex: 0,
      width: 250,
      hide: !columnVisibility.employeename,
    },
    {
      field: "employeecode",
      headerName: "Employee Code",
      flex: 0,
      width: 300,
      hide: !columnVisibility.employeecode,
    },
    {
      field: "date",
      headerName: "Raise Date",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.date,
    },
    {
      field: "time",
      headerName: "Raise Time",
      flex: 0,
      width: 150,
      hide: !columnVisibility.time,
    },
    {
      field: "raiseself",
      headerName: "Status",
      flex: 0,
      width: 180,
      hide: !columnVisibility.raiseself,
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          <Grid item md={3} xs={12} sm={12}>
            <Typography sx={{
              color: params.row.raiseself === "Open" ? "red" :
                params.row.raiseself === "Resolved" ? "green" :
                  params.row.raiseself === "Details Needed" ? "blue" :
                    params.row.raiseself === "Closed" ? 'Orange' :
                      params.row.raiseself === "Forwarded" ? "palevioletred" :
                        params.row.raiseself === "Reject" ? "darkmagenta" : 'violet'
            }}>{params.row.raiseself}</Typography>                </Grid>

        </Grid>

      ),
    },
    {
      field: "ticketclosed",
      headerName: "Closed By",
      flex: 0,
      width: 180,
      hide: !columnVisibility.ticketclosed,
    },
   
  ];

  const rowDataTable = filteredDatas.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      employeename: item.employeename,
      employeecode: (item.employeecode),
      date: item?.date,
      time: item?.time,
      raiseself: item.raiseself,
      ticketclosed: item.ticketclosed,
    };
  });

  // Excel
  const fileName = "IndividualRaiseTicketReport";
  let snos = 1;


  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "IndividualRaiseTicketReport",
    pageStyle: "print",
  });

  const columns = [
    { title: "Raised By", field: "employeename" },
    { title: "Employee Code", field: "employeecode" },
    { title: "Raise Date", field: "date" },
    { title: "Raise Time ", field: "time" },
    { title: "Status ", field: "raiseself" },
    { title: "Closed By ", field: "ticketclosed" },
  ];



  // Show All Columns functionality
  const handleShowAllColumns = () => {
    const updatedVisibility = { ...columnVisibility };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibility(updatedVisibility);
  };

  // Manage Columns functionality
  const toggleColumnVisibility = (field) => {
    setColumnVisibility((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };

  // Function to filter columns based on search query
  const filteredColumns = columnDataTable.filter((column) => column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase()));

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "IndividualRaiseTicket_Report.png");
        });
      });
    }
  };

  // JSX for the "Manage Columns" popover content
  const manageColumnsContent = (
    <div style={{ padding: "10px", minWidth: "325px" }}>
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
              <ListItemText sx={{ display: "flex" }} primary={<Switch sx={{ marginTop: "-10px" }} checked={columnVisibility[column.field]} onChange={() => toggleColumnVisibility(column.field)} />} secondary={column.headerName} />
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
            <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibility({})}>
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </div>
  );

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

  const rowsWithCheckboxes = rowDataTable.map((row) => ({
    ...row,
    // Create a custom field for rendering the checkbox
    checkbox: selectedRows.includes(row.id),
  }));
  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
    <div>
      <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
    </div>
  );

  const [copiedData, setCopiedData] = useState("");

  return (
    <Box>
      <Headtitle title={"INDIVIDUAL RAISE TICKET REPORT"} />
      {/* ****** Header Content ****** */}
      <Typography sx={userStyle.HeaderText}>Individual Raise Ticket Report</Typography>

      {!queueCheck ? (
        <Box sx={userStyle.container}>
          <Box sx={{ display: "flex", justifyContent: "center", minHeight: "350px" }}>
            <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
          </Box>
        </Box>
      ) : (
        <>
          {isUserRoleCompare?.includes("lindividualticketreport") && (
            <>
              <Box sx={userStyle.container}>
                {/* ******************************************************EXPORT Buttons****************************************************** */}
                <Grid container spacing={2}>
                  <Grid item xs={8}>
                    <Typography sx={userStyle.SubHeaderText}>Individual Raise Ticket Report</Typography>
                  </Grid>

                </Grid>
                <br></br><br></br><br></br>
               
                <Grid container sx={{ justifyContent: "center" }}>
                  <Grid>
                    {isUserRoleCompare?.includes("excelindividualticketreport") && (
                
                      <>
                        <Button onClick={(e) => {
                          setIsFilterOpen(true)
                          setFormat("xl")
                        }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("csvindividualticketreport") && (
                   

                      <>
                        <Button onClick={(e) => {
                          setIsFilterOpen(true)
                          setFormat("csv")
                        }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                      </>
                    )}
                    {isUserRoleCompare?.includes("printindividualticketreport") && (
                      <>
                        <Button sx={userStyle.buttongrp} onClick={handleprint}>
                          &ensp;
                          <FaPrint />
                          &ensp;Print&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("pdfindividualticketreport") && (
      
                      <>
                        <Button sx={userStyle.buttongrp}
                          onClick={() => {
                            setIsPdfFilterOpen(true)
                          }}                                                ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("imageindividualticketreport") && (
                      <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                        {" "}
                        <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                      </Button>
                    )}
                  </Grid>
                </Grid>
                <br />
                {/* ****** Table Grid Container ****** */}
                <Grid style={userStyle.dataTablestyle}>
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
                    </Select>
                  </Box>
                  <Box>
                    <FormControl fullWidth size="small">
                      <Typography>Search</Typography>
                      <OutlinedInput id="component-outlined" type="text" value={searchQuery} onChange={handleSearchChange} />
                    </FormControl>
                  </Box>
                </Grid>
                <br />
                <br />
                <Button
                  sx={userStyle.buttongrp}
                  onClick={() => {
                    handleShowAllColumns();
                    setColumnVisibility(initialColumnVisibility);
                  }}
                >
                  Show All Columns
                </Button>
                &emsp;
                <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
                  Manage Columns
                </Button>{" "}
                &emsp;
                <br />
                <br />
                {/* ****** Table start ****** */}
                <Box
                  style={{
                    width: "100%",
                    overflowY: "hidden", // Hide the y-axis scrollbar
                  }}
                >
                  <StyledDataGrid onClipboardCopy={(copiedString) => setCopiedData(copiedString)} rows={rowsWithCheckboxes} columns={columnDataTable.filter((column) => columnVisibility[column.field])} onSelectionModelChange={handleSelectionChange} selectionModel={selectedRows} autoHeight={true} ref={gridRef} density="compact" hideFooter getRowClassName={getRowClassName} disableRowSelectionOnClick />
                </Box>
                <Box>
                                <Pagination
                                    page={page}
                                    pageSize={pageSize}
                                    totalPages={searchQuery !== "" ? 1 : totalPages}
                                    onPageChange={handlePageChange}
                                    pageItemLength={filteredDatas?.length}
                                    totalProjects={
                                        searchQuery !== "" ? filteredDatas?.length : totalProjects
                                    }
                                />                                    {/* <Pagination page={page} pageSize={pageSize} totalPagesCount={totalPages} onPageChange={handlePageChange} pageItemLength={employees} /> */}
                            </Box>
                {/* ****** Table End ****** */}
              </Box>
              <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table aria-label="customized table" id="raisetickets" ref={componentRef}>
                  <TableHead sx={{ fontWeight: "600" }}>
                    <StyledTableRow>
                      <StyledTableCell>S.No</StyledTableCell>
                      <StyledTableCell>Raised By</StyledTableCell>
                      <StyledTableCell>Employee Code</StyledTableCell>
                      <StyledTableCell>Date</StyledTableCell>
                      <StyledTableCell>Time</StyledTableCell>
                      <StyledTableCell>Status</StyledTableCell>
                      <StyledTableCell>Closed By</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {rowDataTable?.length > 0 ? (
                      rowDataTable?.map((row, index) => (
                        <StyledTableRow key={index}>
                          <StyledTableCell>{index + 1}</StyledTableCell>
                          <StyledTableCell>{(row.employeename)}</StyledTableCell>
                          <StyledTableCell>{(row.employeecode)}</StyledTableCell>
                          <StyledTableCell>{row?.date}</StyledTableCell>
                          <StyledTableCell>{row?.time}</StyledTableCell>
                          <StyledTableCell>{row.raiseself}</StyledTableCell>
                          <StyledTableCell>{row?.ticketclosed}</StyledTableCell>
                        </StyledTableRow>
                      ))
                    ) : (
                      <StyledTableRow>
                        {" "}
                        <StyledTableCell colSpan={7} align="center">
                          No Data Available
                        </StyledTableCell>{" "}
                      </StyledTableRow>
                    )}
                    <StyledTableRow></StyledTableRow>
                  </TableBody>
                </Table>
              </TableContainer>

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
            </>
          )}
        </>
      )}

      <Box>
        {/* ALERT DIALOG */}
        <Dialog open={isDeleteOpenalert} onClose={handleCloseModalert} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent
            sx={{
              width: "350px",
              textAlign: "center",
              alignItems: "center",
            }}
          >
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "70px", color: "orange" }} />
            <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
              Please Select any Row
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button autoFocus variant="contained" color="error" onClick={handleCloseModalert}>
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* ALERT DIALOG */}
      <Box>
        <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
            <Typography variant="h6">{showAlert}</Typography>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              style={{
                padding: "7px 13px",
                color: "white",
                background: "rgb(25, 118, 210)",
              }}
              onClick={handleCloseerr}
            >
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>




      {/*Export XL Data  */}
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
          {fileFormat === "xl" ? <FaFileExcel style={{ fontSize: "80px", color: "green" }} />
            :
            <FaFileCsv style={{ fontSize: "80px", color: "green" }} />
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
      <br />
      <br />
    </Box>
  );
}

export default IndividualRaiseTicketReport;
