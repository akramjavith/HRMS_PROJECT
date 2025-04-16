import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Box, Typography, OutlinedInput, Select, MenuItem, Dialog, TableBody, TableCell, TableRow, DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead, TableContainer, Button,
  List, ListItem, ListItemText, Popover, TextField, IconButton,
} from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { handleApiError } from "../../../components/Errorhandling";
import { FaPrint, FaFilePdf, FaFileCsv, FaFileExcel, } from "react-icons/fa";
import { SERVICE } from '../../../services/Baseservice';
import { styled } from '@mui/system';
import { DataGrid } from '@mui/x-data-grid';
import axios from "axios";
import jsPDF from "jspdf";
import 'jspdf-autotable';
import Headtitle from "../../../components/Headtitle";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext, AuthContext } from '../../../context/Appcontext';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import ExcelJS from 'exceljs';
import { saveAs } from "file-saver";
import Papa from "papaparse";
import CircularProgress, { circularProgressClasses, } from '@mui/material/CircularProgress';
import Switch from '@mui/material/Switch';
import CloseIcon from '@mui/icons-material/Close';
import html2canvas from 'html2canvas';
import ImageIcon from '@mui/icons-material/Image';

function FacebookCircularProgress(props) {
  return (
    <Box style={{ position: 'relative' }}>
      <CircularProgress
        variant="determinate"
        style={{
          color: (theme) =>
            theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
        }}
        size={40}
        thickness={4}
        {...props}
        value={100}
      />
      <CircularProgress
        variant="indeterminate"
        disableShrink
        style={{
          color: (theme) => (theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8'),
          animationDuration: '550ms',
          position: 'absolute',
          left: 0,
          [`& .${circularProgressClasses.circle}`]: {
            strokeLinecap: 'round',
          },
        }}
        size={40}
        thickness={4}
        {...props}
      />
    </Box>
  );
}


const Exceltable = () => {

  const gridRef = useRef(null);
  const [excels, setExcels] = useState([]);
  const [isLoader, setIsLoader] = useState(false)

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { auth } = useContext(AuthContext);
  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState()
  const handleClickOpenerr = () => { setIsErrorOpen(true); };
  const handleCloseerr = () => { setIsErrorOpen(false); };

  const { isUserRoleCompare } = useContext(UserRoleAccessContext);

  // clipboard
  const [copiedData, setCopiedData] = useState('');

  // State for manage columns search query
  const [searchQueryManage, setSearchQueryManage] = useState("");
  // Manage Columns
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null)
  const handleOpenManageColumns = (event) => {
    setAnchorEl(event.currentTarget);
    setManageColumnsOpen(true);
  };
  const handleCloseManageColumns = () => {
    setManageColumnsOpen(false);
    setSearchQueryManage("")
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    '& .MuiDataGrid-virtualScroller': {
      overflowY: 'hidden',
    },
    '& .custom-ago-row': {
      backgroundColor: '#ff00004a !important',
    },
    '& .custom-in-row': {
      backgroundColor: '#ffff0061 !important',
    },
    '& .custom-others-row': {
      backgroundColor: '#0080005e !important',
    },
    '& .MuiDataGrid-row.Mui-selected': {
      '& .custom-ago-row, & .custom-in-row, & .custom-others-row': {
        backgroundColor: 'unset !important', // Clear the background color for selected rows
      },
    },
    '&:hover': {
      '& .custom-ago-row:hover': {
        backgroundColor: '#ff00004a !important',
      },
      '& .custom-in-row:hover': {
        backgroundColor: '#ffff0061 !important',
      },
      '& .custom-others-row:hover': {
        backgroundColor: '#0080005e !important',
      },
    },
  }));

  // Show All Columns & Manage Columns 
  const initialColumnVisibility = {
    checkboxSelection: true,
    actions: true,
    serialNumber: true,
    priority: true,
    customer: true,
    process: true,
    hyperlink: true,
    count: true,
    tat: true,
    project: true,
    vendor: true,
    date: true,
    time: true,
    created: true,

  };
  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);


  const getRowClassName = (params) => {
    if ((params.row.tat).includes('ago')) {
      return 'custom-ago-row'; // This is the custom class for rows with item.tat === 'ago'
    }
    return ''; // Return an empty string for other rows
  };

  const getRowClassNameAll = (params) => {

    const itemTat = params.row.tat || "";
    const containsIn = itemTat.includes("in") && !itemTat.includes("day") && !itemTat.includes("days");
    const timeInHours = containsIn
      ? parseFloat(itemTat.split("in")[1]?.trim())
      : NaN;

    const conditionMet = containsIn && !isNaN(timeInHours) && timeInHours < 15;

    if ((params.row.tat).includes('ago')) {
      return 'custom-ago-row'; // This is the custom class for rows with item.tat === 'ago'
    } else if ((params.row.tat)?.includes("an hour") || (params.row.tat)?.includes("minute") || (params.row.tat)?.includes("in 2 hours") || conditionMet) {
      return 'custom-in-row';
    } else {
      return 'custom-others-row';
    }
  };

  // get all branches
  const fetchExcel = async () => {

    try {
      let res = await axios.get(SERVICE.EXCELFILTERED, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        }
      });

      setExcels(res?.data?.excels);
      setIsLoader(true)
    } catch (err) {setIsLoader(true);handleApiError(err, setShowAlert, handleClickOpenerr);}
  }

  //datatable....
  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = excels?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
    setItems(itemsWithSerialNumber);
  }

  useEffect(() => {
    addSerialNumber();
  }, [excels]);


  //Datatable
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setPage(1);
  };

  //datatable....
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  // Split the search query into individual terms
  const searchOverTerms = searchQuery?.toLowerCase()?.split(" ");
  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchOverTerms.every((term) =>
      Object.values(item)?.join(" ")?.toLowerCase()?.includes(term)
    );
  });

  const filteredData = filteredDatas?.slice((page - 1) * pageSize, page * pageSize);

  const totalPages = Math.ceil(filteredDatas?.length / pageSize);

  const visiblePages = Math.min(totalPages, 3);

  const firstVisiblePage = Math.max(1, page - 1);
  const lastVisiblePage = Math.min(Math.abs(firstVisiblePage + visiblePages - 1), totalPages);


  const pageNumbers = [];

  const indexOfLastItem = page * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;


  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  }

  let overallCount = 0;
  const totalcount = filteredData && (
    filteredData.forEach((item) => {
      overallCount += Number(item.count);
    })
  );
  const columnDataTable = [

    { field: "serialNumber", headerName: "SNo", flex: 0, width: 75, hide: !columnVisibility.serialNumber, headerClassName: "bold-header" },
    { field: "priority", headerName: "Priority", flex: 0, width: 75, hide: !columnVisibility.priority, headerClassName: "bold-header" },
    { field: "customer", headerName: "Customer", flex: 0, width: 150, hide: !columnVisibility.customer, headerClassName: "bold-header" },

    {
      field: "hyperlink",
      headerName: "Process Hyperlink",
      flex: 0,
      width: 340,
      hide: !columnVisibility.hyperlink,
      renderCell: (params) => (
        params?.row?.hyperlink?.startsWith('http') ?
          <a href={params.row.hyperlink} target="_blank">
            {params.row.process}
          </a> : params.row.process
      ),
      headerClassName: "bold-header"
    },

    { field: "count", headerName: "Count", flex: 0, width: 75, hide: !columnVisibility.count, headerClassName: "bold-header" },
    { field: "tat", headerName: "TAT Expiration", flex: 0, width: 100, hide: !columnVisibility.tat, headerClassName: "bold-header" },
    { field: "project", headerName: "Project", flex: 0, width: 200, hide: !columnVisibility.project, headerClassName: "bold-header" },
    { field: "vendor", headerName: "Vendor", flex: 0, width: 100, hide: !columnVisibility.vendor, headerClassName: "bold-header" },
    { field: "date", headerName: " Date", flex: 0, width: 100, hide: !columnVisibility.date, headerClassName: "bold-header" },
    { field: "time", headerName: "Time", flex: 0, width: 100, hide: !columnVisibility.time, headerClassName: "bold-header" },
    { field: "created", headerName: "Created", flex: 0, width: 100, hide: !columnVisibility.created, headerClassName: "bold-header" },
  ];

  // Create a row data object for the DataGrid
  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item._id,
      serialNumber: Number(item.serialNumber),
      priority: item.priority,
      customer: item.customer,
      process: item.process,
      hyperlink: item.hyperlink,
      count: item.count,
      tat: item.tat,
      project: item.project,
      vendor: item.vendor,
      date: item.date,
      time: item.time,
      created: item.created
    }
  });

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
  const filteredColumns = columnDataTable.filter((column) =>
    column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase())
  );

  // JSX for the "Manage Columns" popover content
  const manageColumnsContent = (
    <Box sx={{ padding: "10px", minWidth: "325px", '& .MuiDialogContent-root': { padding: '10px 0' } }}>
      <Typography variant="h6">Manage Columns</Typography>
      <IconButton
        aria-label="close"
        onClick={handleCloseManageColumns}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <Box sx={{ position: 'relative', margin: '10px', }}>
        <TextField
          label="Find column"
          variant="standard"
          fullWidth
          value={searchQueryManage}
          onChange={(e) => setSearchQueryManage(e.target.value)}
          sx={{ marginBottom: 5, position: 'absolute', }}
        />
      </Box><br /><br />
      <DialogContent sx={{ minWidth: 'auto', height: '200px', position: 'relative', }}>
        <List sx={{ overflow: 'auto', height: '100%', }}>
          <ListItemText sx={{ display: 'flex', marginLeft: '15px' }}
            primary={
              <Switch sx={{ marginTop: "0px", }} size="small"
                checked={columnVisibility.checkboxSelection}
                onChange={() => toggleColumnVisibility('checkboxSelection')}
              />
            }
            secondary={<Typography variant="subtitle1" sx={{ fontSize: "15px", fontWeight: '400' }}>Checkbox Selection</Typography>}
          />
          {filteredColumns?.map((column) => (
            <ListItem key={column.field}>
              <ListItemText sx={{ display: 'flex' }}
                primary={
                  <Switch sx={{ marginTop: "-5px" }} size="small"
                    checked={columnVisibility[column.field]}
                    onChange={() => toggleColumnVisibility(column.field)}
                  />
                }
                secondary={column.headerName}
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Grid container>
          <Grid item md={4}>
            <Button
              variant="text"
              sx={{ textTransform: 'none', }}
              onClick={() => setColumnVisibility(initialColumnVisibility)}
            >
              Show All
            </Button>
          </Grid>
          <Grid item md={4}></Grid>
          <Grid item md={4}>
            <Button
              variant="text"
              sx={{ textTransform: 'none', }}
              onClick={() => setColumnVisibility({})}
            >
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );


  const checkexceldata = excels?.map((item, index) => ({
    ...item,
    sno: index + 1,
    priority: Number(item.priority),
    customer: item.customer,
    process: item.process,
    hyperlink: item.hyperlink,
    count: item.count,
    tat_expiration: item.tat,
    projectname: item.project,
    vendorname: item.vendor,
    date: item.date,
    time: item.time,
    created: item.created
  }));

  //  PDF
  const columns = [
    { title: "SNO", field: "sno" },
    { title: "Priority", field: "priority" },
    { title: "Customer", field: "customer" },
    { title: "Process", field: "process" },
    { title: "Count", field: 'count', },
    { title: "Tat Expiration", field: 'tat' },
    { title: "Project Name", field: 'project', },
    { title: "Vendor Name", field: 'vendor' },
    { title: "Date", field: 'date', },
    { title: "Time", field: 'time' },
    { title: "Created", field: 'created' },
  ]


  const downloadPdf = () => {
    const doc = new jsPDF();
    doc.autoTable({
      theme: "grid",
      styles: {
        fontSize: 6, // Set the font size to 10
      },
      columns: columns.map((col) => ({ ...col, dataKey: col.field })),
      body: checkexceldata,
    });
    doc.save("exceldata.pdf");
  };


  const downloadExcelSecondary = async () => {

    try {
      // Fetch the data if not already fetched
      if (!excels?.length) {
        await fetchExcel();
      }
      // downloadCsvSecondary();
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Excel Data');

      // Define the columns
      worksheet.columns = [
        { header: 'S.No', key: 'serialNumber', width: 10 },
        { header: 'Priority', key: 'priority', width: 10 },
        { header: 'Customer', key: 'customer', width: 20 },
        { header: "Process Hyperlink", key: 'process', width: 20 },
        { header: "Count", key: 'count', width: 10 },
        { header: "Tat Expiration", key: 'tat', width: 10 },
        { header: 'Project Name', key: 'project', width: 20 },
        { header: 'Vendor Name', key: 'vendor', width: 20 },
        { header: 'Date', key: 'date', width: 20 },
        { header: "Time", key: 'time', width: 20 },
        { header: "Created", key: 'created', width: 20 }
      ];

      // Add data to the worksheet
      filteredData?.forEach((row, index) => {
        worksheet.addRow({
          'S.No': index + 1,
          'priority': parseInt(row.priority),
          "customer": row.customer,
          "process": row.process,
          "hyperlink": row.hyperlink,
          "count": parseInt(row.count),
          "tat_expiration": row.tat,
          "projectname": row.project,
          "vendorname": row.vendor,
          "date": row.date,
          "time": row.time,
          "created": row.created
        });
      });

      // Define a hyperlink style
      const hyperlinkStyle = {
        font: { color: { argb: '0000FF' }, underline: true },
      };

      // Add hyperlinks to the worksheet
      filteredData?.forEach((row, index) => {

        const cell = worksheet.getCell(`D${index + 2}`); // Process Hyperlink
        const link = {
          text: row.process,
          hyperlink: row.hyperlink,
          tooltip: 'Click to open process',
        };
        cell.value = row?.hyperlink?.startsWith("http") ? link : row.process;
        cell.style = hyperlinkStyle;

        // Set other cell values for additional columns
        worksheet.getCell(`A${index + 2}`).value = index + 1;
        worksheet.getCell(`B${index + 2}`).value = parseInt(row.priority);
        worksheet.getCell(`C${index + 2}`).value = row.customer;
        worksheet.getCell(`E${index + 2}`).value = parseInt(row.count);
        worksheet.getCell(`F${index + 2}`).value = row.tat;
        worksheet.getCell(`G${index + 2}`).value = row.project;
        worksheet.getCell(`H${index + 2}`).value = row.vendor;
        worksheet.getCell(`I${index + 2}`).value = row.date;
        worksheet.getCell(`J${index + 2}`).value = row.time;
        worksheet.getCell(`K${index + 2}`).value = row.created;
      });

      // Create a buffer from the workbook
      const buffer = await workbook.xlsx.writeBuffer();

      // Create a Blob object and initiate the download
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Excel_Data.xlsx'; // File name
      a.click();
    } catch (error) {
      // Handle any errors that may occur during the process
      console.error(error);
    }
  };

  const downloadCsvSecondary = () => {
    const csvData = [];

    // Add CSV headers
    const headers = ['S.No', 'Customer', 'Process Hyperlink', 'Count',
      'Tat', 'Project Name', 'Vendor Name', 'Date', 'Time', 'Created'
    ];
    csvData.push(headers);

    // Add data rows
    filteredData?.forEach((row, index) => {
      const rowData = [
        index + 1,
        parseInt(row.priority),
        row.customer,
        row?.hyperlink?.startsWith("http") ? `=HYPERLINK("${row.hyperlink}", "${row.process}")` : row.process, // This creates a clickable link in Excel
        parseInt(row.count),
        row.tat,
        row.project,
        row.vendor,
        row.date,
        row.time,
        row.created,
      ];
      csvData.push(rowData);
    });

    // Convert the CSV data to a string
    const csvString = Papa.unparse(csvData);

    // Create a Blob object and initiate the download
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'Excel_Data.csv'); // Specify the filename with .csv extension
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Excel',
    pageStyle: 'print'
  });

  useEffect(() => {
    fetchExcel();
  }, [])

  const [canvasState, setCanvasState] = useState(false)

  //image
  const handleCaptureImage = () => {
    // Find the table by its ID
    const table = document.getElementById("excelcanvastable");

    // Clone the table element
    const clonedTable = table.cloneNode(true);

    // Append the cloned table to the document body (it won't be visible)
    clonedTable.style.position = "absolute";
    clonedTable.style.top = "-9999px";
    document.body.appendChild(clonedTable);

    // Use html2canvas to capture the cloned table
    html2canvas(clonedTable).then((canvas) => {
      // Remove the cloned table from the document body
      document.body.removeChild(clonedTable);

      // Convert the canvas to a data URL and create a download link
      const dataURL = canvas.toDataURL("image/jpeg", 0.8);
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "Excel_Data.png";
      link.click();
    });
  };

  return (
    <>
      <Headtitle title={'Excel Data List'} />
      {isUserRoleCompare?.includes("lexceldata")
        && (
          <>
            <Box sx={userStyle.container}>
              <Typography sx={userStyle.SubHeaderText}>  Excel Data List </Typography>
              <br /><br />


              { /* ****** Header Buttons ****** */}
              <Grid container sx={{ justifyContent: "center" }} >
                <Grid >

                  {isUserRoleCompare?.includes("excelexceldata")
                    && (
                      <>
                        <Button sx={userStyle.buttongrp} onClick={downloadCsvSecondary}>&ensp;<FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                      </>
                    )}
                  {isUserRoleCompare?.includes("csvexceldata")
                    && (
                      <>
                        <Button sx={userStyle.buttongrp} onClick={downloadExcelSecondary}>&ensp;<FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                      </>
                    )}
                  {isUserRoleCompare?.includes("printexceldata")
                    && (
                      <>
                        <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                      </>
                    )}
                  {isUserRoleCompare?.includes("pdfexceldata")
                    && (
                      <>
                        <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                      </>
                    )}
                  {isUserRoleCompare?.includes("imageexceldata")
                    && (
                      <>
                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}> <ImageIcon sx={{ fontSize: "15px" }} />  &ensp;image&ensp; </Button>
                      </>
                    )}
                </Grid>
              </Grid><br />
              <Grid style={userStyle.dataTablestyle}>
                <Box>
                  <label htmlFor="pageSizeSelect">Show entries:</label>
                  <Select id="pageSizeSelect" defaultValue="" value={pageSize} onChange={handlePageSizeChange} sx={{ width: "77px" }}>
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                    <MenuItem value={(excels?.length)}>All</MenuItem>
                  </Select>
                </Box>
                <Box>
                  <FormControl fullWidth size="small" >
                    <Typography>Search</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                    />
                  </FormControl>
                </Box>
              </Grid>
              <br />
              <br />
              <Grid container sx={{ diaplay: 'flex', backgroundColor: '#dcdbdb00', postion: 'sticky', padding: '10px 05px' }}>
                    <Box>
                      Total Pages
                    </Box>&ensp;&ensp;&ensp;
                    <Box >
                      <span style={{ fontWeight: 'bold', fontSize: '20px' }} >  Count</span> :<span style={{ fontWeight: 'bold', fontSize: '20px' }} >{overallCount}</span>
                    </Box>
                  </Grid>
              <Button sx={userStyle.buttongrp} onClick={() => { handleShowAllColumns(); setColumnVisibility(initialColumnVisibility) }}>Show All Columns</Button>&ensp;
              <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>Manage Columns</Button><br /><br />
              

              {!isLoader ?
                <>
                  <Box style={{ display: 'flex', justifyContent: 'center' }}>
                    <FacebookCircularProgress />
                  </Box>
                </>
                :

                <>
                  <Box
                    style={{
                      width: '100%',
                      overflowY: 'hidden', // Hide the y-axis scrollbar
                      overflowX: 'hidden !important', // Hide the X-axis scrollbar
                    }}
                  >
                    <StyledDataGrid ref={gridRef}
                      rows={rowDataTable}
                      columns={columnDataTable.filter((column) => columnVisibility[column.field])}
                      autoHeight={true}
                      density="compact"
                      hideFooter
                      checkboxSelection={columnVisibility.checkboxSelection}
                      getRowClassName={getRowClassNameAll}
                      disableRowSelectionOnClick
                      unstable_cellSelection
                      onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
                      unstable_ignoreValueFormatterDuringExport
                    />
                  </Box>
                  <Grid container sx={{ diaplay: 'flex', backgroundColor: '#dcdbdb00', postion: 'sticky', padding: '10px 05px', boxShadow: '0px 0px 2px grey' }}>
                    <Box>
                      Total Pages
                    </Box>&ensp;&ensp;&ensp;
                    <Box >
                      <span style={{ fontWeight: 'bold', fontSize: '20px' }} >  Count</span> :<span style={{ fontWeight: 'bold', fontSize: '20px' }} >{overallCount}</span>
                    </Box>
                  </Grid>
                  <br />
                  <Box style={userStyle.dataTablestyle}>
                    <Box>
                      Showing {filteredData.length > 0 ? ((page - 1) * pageSize) + 1 : 0} to {Math.min(page * pageSize, filteredDatas?.length)} of {filteredDatas?.length} entries
                    </Box>
                    <Box>
                      <Button onClick={() => setPage(1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                        <FirstPageIcon />
                      </Button>
                      <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                        <NavigateBeforeIcon />
                      </Button>
                      {pageNumbers?.map((pageNumber) => (
                        <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChange(pageNumber)} className={((page)) === pageNumber ? 'active' : ''} disabled={page === pageNumber}>
                          {pageNumber}
                        </Button>
                      ))}
                      {lastVisiblePage < totalPages && <span>...</span>}
                      <Button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                        <NavigateNextIcon />
                      </Button>
                      <Button onClick={() => setPage((totalPages))} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                        <LastPageIcon />
                      </Button>
                    </Box>
                  </Box>  <br />  <br />

                </>
              }

              <>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  {/* <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} /> */}
                </Box>
              </>
            </Box>
          </>
        )}
      {/* Manage Column */}
      < Popover
        id={id}
        open={isManageColumnsOpen}
        anchorEl={anchorEl}
        onClose={handleCloseManageColumns}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }
        }
      >
        {manageColumnsContent}
      </Popover >


      {/* print layout */}
      {/* ****** Table start ****** */}
      <TableContainer component={Paper} sx={userStyle.printcls} >
        <Table
          aria-label="simple table"
          id="excel"
          ref={componentRef}
        >
          <TableHead sx={{ fontWeight: "600" }}>
            <TableRow>
              <TableCell>SNO</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Customer </TableCell>
              <TableCell>Process </TableCell>
              <TableCell>Count</TableCell>
              <TableCell>Tat Expiration</TableCell>
              <TableCell>Project Name </TableCell>
              <TableCell>Vendor Name </TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {excels &&
              (excels?.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.priority} </TableCell>
                  <TableCell>{row.customer} </TableCell>
                  <TableCell><a href={row.hyperlink} target="_blank" />{row.process}</TableCell>
                  <TableCell>{row.count}</TableCell>
                  <TableCell>{row.tat} </TableCell>
                  <TableCell>{row.project} </TableCell>
                  <TableCell>{row.vendor}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.time} </TableCell>
                  <TableCell>{row.created}</TableCell>
                </TableRow>
              )))}
          </TableBody>
        </Table>
      </TableContainer>

      <TableContainer component={Paper} style={{
        display: canvasState === false ? 'none' : 'block',
      }} >
        <Table
          aria-label="simple table"
          id="excelcanvastable"
          ref={gridRef}
        >
          <TableHead sx={{ fontWeight: "600" }}>
            <TableRow>
              <TableCell>SNO</TableCell>
              <TableCell>Priority </TableCell>
              <TableCell>Customer </TableCell>
              <TableCell>Process </TableCell>
              <TableCell>Count</TableCell>
              <TableCell>Tat Expiration</TableCell>
              <TableCell>Project Name </TableCell>
              <TableCell>Vendor Name </TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData &&
              (filteredData?.map((row, index) => {
                const itemTat = row.tat || "";
                const containsIn = itemTat.includes("in") && !itemTat.includes("day") && !itemTat.includes("days");
                const timeInHours = containsIn
                  ? parseFloat(itemTat.split("in")[1]?.trim())
                  : NaN;

                const conditionMet = containsIn && !isNaN(timeInHours) && timeInHours < 15;
                return (


                  <TableRow key={index} sx={{ background: (row.tat).includes('ago') ? "#ff00004a !important" : (row.tat).includes("an hour") || (row.tat).includes(" minute") || (row.tat).includes("in 2 hours") || conditionMet ? "#ffff0061 !important " : "#0080005e !important" }}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.priority} </TableCell>
                    <TableCell>{row.customer} </TableCell>
                    <TableCell><a href={row.hyperlink} target="_blank" />{row.process}</TableCell>
                    <TableCell>{row.count}</TableCell>
                    <TableCell>{row.tat} </TableCell>
                    <TableCell>{row.project} </TableCell>
                    <TableCell>{row.vendor}</TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.time} </TableCell>
                    <TableCell>{row.created}</TableCell>
                  </TableRow>
                )
              }

              ))}
          </TableBody>
        </Table>
      </TableContainer>




      {/* Table End */}
      {/* ALERT DIALOG */}
      <Box>
        <Dialog
          open={isErrorOpen}
          onClose={handleCloseerr}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
            {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} /> */}
            <Typography variant="h6" >{showAlert}</Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error" onClick={handleCloseerr}>ok</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}
export default Exceltable;