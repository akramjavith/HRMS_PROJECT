import React, { useState, useEffect, useRef, useContext } from 'react';
import { TextField, IconButton, ListItem, List, Checkbox, ListItemText, Popover, Box, Typography, OutlinedInput, TableBody, Select, Paper, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Table, TableHead, TableContainer, Button } from '@mui/material';
import { userStyle } from '../../pageStyle';
import { FaPrint, FaFilePdf, FaFileCsv, FaFileExcel } from 'react-icons/fa';
import { ExportXL, ExportCSV } from '../../components/Export';
import { StyledTableRow, StyledTableCell } from '../../components/Table';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment-timezone';
import axios from '../../axiosInstance';
import { SERVICE } from '../../services/Baseservice';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { useReactToPrint } from 'react-to-print';
import StyledDataGrid from '../../components/TableStyle';
import { UserRoleAccessContext } from '../../context/Appcontext';
import { AuthContext } from '../../context/Appcontext';
import { handleApiError } from '../../components/Errorhandling';
import Headtitle from '../../components/Headtitle';
import { ThreeDots } from 'react-loader-spinner';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import { Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/system';
import Switch from '@mui/material/Switch';
import CloseIcon from '@mui/icons-material/Close';
import html2canvas from 'html2canvas';
import ImageIcon from '@mui/icons-material/Image';
import { saveAs } from 'file-saver';
// import { includes } from "core-js/core/array";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import AlertDialog from '../../components/Alert';
import { DeleteConfirmation, PleaseSelectRow } from '../../components/DeleteConfirmation.js';
import ExportData from '../../components/ExportData';
import InfoPopup from '../../components/InfoPopup.js';
import MessageAlert from '../../components/MessageAlert';
import PageHeading from '../../components/PageHeading';
import AggregatedSearchBar from '../../components/AggregatedSearchBar';
import AggridTable from '../../components/AggridTable';
import domtoimage from 'dom-to-image';

function RaiseTicketUserForwarded() {
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);

  const [searchedString, setSearchedString] = useState('');
  const [isHandleChange, setIsHandleChange] = useState(false);
  const gridRefTable = useRef(null);
  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState('');
  const [popupSeverityMalert, setPopupSeverityMalert] = useState('');
  const handleClickOpenPopupMalert = () => {
    // setSubmitLoader(false);
    setOpenPopupMalert(true);
  };
  const handleClosePopupMalert = () => {
    setOpenPopupMalert(false);
  };
  const [openPopup, setOpenPopup] = useState(false);
  const [popupContent, setPopupContent] = useState('');
  const [popupSeverity, setPopupSeverity] = useState('');
  const handleClickOpenPopup = () => {
    setOpenPopup(true);
  };
  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  let exportColumnNames = ['Status', 'Ticket Number', 'Raised By', 'Raised Date', 'Due Date', 'Ticket Due Date', 'Remaining Hours', 'Reason ', 'Employee Name', 'Employee Code', 'Category', 'Subcategory ', 'Subsubcategory '];
  let exportRowValues = ['raiseself', 'raiseticketcount', 'raisedby', 'raiseddate', 'duedate', 'remainingDate', 'remainingHours', 'textAreaCloseDetails', 'employeename', 'employeecode', 'category', 'subcategory', 'subsubcategory'];

  const [raiseTicketList, setRaiseTicketList] = useState([]);
  const { isUserRoleCompare,listPageAccessMode, isUserRoleAccess, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);
 
 
       let listpageaccessby =
      listPageAccessMode?.find(
        (data) =>
          data.modulename === "Setup" &&
          data.submodulename === "Team Dashboard" &&
          data.mainpagename === "" &&
          data.subpagename === "" &&
          data.subsubpagename === ""
      )?.listpageaccessmode || "Overall";


  const { auth } = useContext(AuthContext);
  const [selectedRows, setSelectedRows] = useState([]);
  const gridRef = useRef(null);
  //Datatable
  const [queueCheck, setQueueCheck] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [queueData, setQueueData] = useState([]);
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQueryManage, setSearchQueryManage] = useState('');

  // Error Popup model
  const [showAlert, setShowAlert] = useState();
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
  const [fileFormat, setFormat] = useState('');
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = fileFormat === 'xl' ? '.xlsx' : '.csv';
  const exportToCSV = (csvData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  const handleOpenManageColumns = (event) => {
    setAnchorEl(event.currentTarget);
    setManageColumnsOpen(true);
  };
  const handleCloseManageColumns = () => {
    setManageColumnsOpen(false);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const getRowClassName = (params) => {
    if (selectedRows.includes(params.row.id)) {
      return 'custom-id-row'; // This is the custom class for rows with item.tat === 'ago'
    }
    return ''; // Return an empty string for other rows
  };

  //get all project.
  const fetchAllRaisedTicketsed = async () => {
    setPageName(!pageName);
    try {
      // let response = await axios.post(SERVICE.RAISE_TICKET_USER_FORWARDED_EMPLOYEES, {
      //   headers: {
      //     Authorization: `Bearer ${auth.APIToken}`,
      //   },
      //   username: isUserRoleAccess?.companyname,
      // });

        let res = await axios.post(SERVICE.HIERARCHY_TEAM_ATTENDANCE_BASED_CLAIM, {
                                      headers: {
                                        Authorization: `Bearer ${auth.APIToken}`,
                                      },
                                      hierachy: "myallhierarchy",
                                      sector: "all",
                                      username: isUserRoleAccess.companyname,
                                      pagename: "menuteamdashboard",
                                      listpageaccessmode: listpageaccessby,
                                    });
    let response = await  axios.post(SERVICE.RAISE_TICKET_FORWARDED_TEAM, {
                    headers: {
                      Authorization: `Bearer ${auth.APIToken}`,
                    },
                   hierarchyempnames: res?.data?.resultAccessFilter,
                  })
      const answer =
        response?.data?.raisetickets?.length > 0
          ? response?.data?.raisetickets?.map((item, index) => ({
              serialNumber: index + 1,
              id: item._id,
              employeename: item.employeename?.map((t, i) => `${i + 1 + '. '}` + t).join('\n'),
              employeecode: item.employeecode?.map((t, i) => `${i + 1 + '. '}` + t).join('\n'),
              category: item.category,
              raiseself: item.raiseself,
              subcategory: item.subcategory,
              subsubcategory: item.subsubcategory === 'Please Select Sub Sub-category' ? '' : item.subsubcategory,
              workstation: item.workstation,
              materialname: item.materialname,
              raiseddate: item.raiseddate,
              type: item.type,
              raisedby: item.raisedby,
              // resolverby: item?.resolverby?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
              duedate: item?.duedate ? item?.duedate : '',
              resolverby: item?.ticketclosed,
              resolvedate: item.resolvedate,
              raiseticketcount: item.raiseticketcount,
              reason: item.textAreaCloseDetails,
              priority: item.priority,
              status: item.status,
              title: item.title,
              description: convertToNumberedList(item.description),
              remainingDate: item.raiseddate && item.duedate ? calculateDate(item.raiseddate, item.duedate) : '',
              remainingHours: item.raiseddate && item.duedate ? RemainingHours(calculateDate(item.raiseddate, item.duedate)) : '',
            }))
          : [];
      setRaiseTicketList(answer);
      setQueueCheck(true);
    } catch (err) {
      setQueueCheck(true);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    fetchAllRaisedTicketsed();
  }, []);

  const [singleDoc, setSingleDoc] = useState({});

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    actions: true,
    checkbox: true,
    serialNumber: true,
    status: true,
    raiseself: true,
    raiseticketcount: true,
    raisedby: true,
    raiseddate: true,
    duedate: true,
    remainingDate: true,
    remainingHours: true,
    category: true,
    subcategory: true,
    subsubcategory: true,
    employeename: true,
    employeecode: true,
    reason: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

  function calculateDate(date, ans) {
    if (ans && date) {
      const [number, time] = ans?.split('-');
      const dateString = date;
      const dateParts = dateString?.split(/[- :]/);
      // Parsing the parts of the date string
      const year = parseInt(dateParts[2]);
      const month = parseInt(dateParts[1]) - 1; // Months are 0-based in JavaScript
      const day = parseInt(dateParts[0]);
      let hour = parseInt(dateParts[3]);
      const minute = parseInt(dateParts[4]);
      const second = parseInt(dateParts[5]);

      // Adjusting for PM time
      if (dateParts[6] === 'pm' && hour !== 12) {
        hour += 12;
      }

      // Creating a new Date object
      const Old = new Date(year, month, day, hour, minute, second);
      const currentDate = new Date(Old);
      let newDate = new Date(currentDate);

      if (time === 'Hours') {
        const hours = parseInt(number);
        newDate.setHours(currentDate.getHours() + hours);
        return moment(newDate).format('DD-MM-YYYY hh:mm:ss a');
      } else if (time === 'Minutes') {
        const minutes = parseInt(number);
        newDate.setMinutes(currentDate.getMinutes() + minutes);
        return moment(newDate).format('DD-MM-YYYY hh:mm:ss a');
      } else if (time === 'Days') {
        const days = parseInt(number);
        newDate.setDate(currentDate.getDate() + days);
        return moment(newDate).format('DD-MM-YYYY hh:mm:ss a');
      } else if (time === 'Immediate') {
        return moment(newDate).format('DD-MM-YYYY hh:mm:ss a');
      }
    } else {
      return 0;
    }
  }

  function RemainingHours(date) {
    if (date) {
      const dateString = date;
      const dateParts = dateString.split(/[- :]/);
      let hour = parseInt(dateParts[3]);

      // If it's PM and not already 12 PM, add 12 hours
      if (dateParts[6] === 'pm' && hour !== 12) {
        hour += 12;
      } else if (dateParts[6] === 'am' && hour === 12) {
        // If it's AM and already 12 AM, set hour to 0
        hour = 0;
      }
      const railwayTime = `${dateParts[0]}-${dateParts[1]}-${dateParts[2]} ${hour}:${dateParts[4]}:${dateParts[5]}`;
      const datePartsnew = railwayTime.split(/[- :]/);
      const targetDate = new Date(parseInt(datePartsnew[2]), parseInt(datePartsnew[1]) - 1, parseInt(datePartsnew[0]), parseInt(datePartsnew[3]), parseInt(datePartsnew[4]), parseInt(datePartsnew[5]));

      const currentDate = new Date();
      const differenceInMilliseconds = targetDate - currentDate;
      const remainingHours = differenceInMilliseconds / (1000 * 60 * 60);
      return Number(remainingHours) > 0 ? `${Number(remainingHours).toFixed(2)} Hours` : 0;
    } else {
      return 0;
    }
  }

  //serial no for listing items
  const addSerialNumber = (data) => {
    setItems(data);
  };

  useEffect(() => {
    addSerialNumber(raiseTicketList);
  }, [raiseTicketList]);

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
  const searchOverTerms = searchQuery?.toLowerCase()?.split(' ');
  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchOverTerms.every((term) => Object.values(item)?.join(' ')?.toLowerCase()?.includes(term));
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
      field: 'checkbox',
      headerName: 'Checkbox', // Default header name
      headerStyle: {
        fontWeight: 'bold', // Apply the font-weight style to make the header text bold
        // Add any other CSS styles as needed
      },

      sortable: false, // Optionally, you can make this column not sortable
      width: 90,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      hide: !columnVisibility.checkbox,
      headerClassName: 'bold-header',
      pinned: 'left',
      lockPinned: true,
    },
    {
      field: 'serialNumber',
      headerName: 'S.No',
      flex: 0,
      width: 100,
      // minHeight: "40px",
      hide: !columnVisibility.serialNumber,
      pinned: 'left',
      lockPinned: true,
    },

    // {
    //     field: "actions",
    //     headerName: "Action",
    //     flex: 0,
    //     width: 150,
    //     sortable: false,
    //     hide: !columnVisibility.actions,
    //     cellRenderer: (params) => (
    //         <Grid sx={{ display: "flex" }}>
    //             {isUserRoleCompare?.includes("vmyactionableticket") && (
    //                 <Link to={`/tickets/raiseticketfilterview/${params.row.id}`} target="_blank" style={{ textDecoration: "none", color: "#fff", minWidth: "0px" }}>
    //                     <Button variant="contained" sx={userStyle.buttonedit} style={{ minWidth: "0px" }}>
    //                         View
    //                     </Button>
    //                 </Link>
    //             )}
    //         </Grid>
    //     ),
    // },
    {
      field: 'raiseself',
      headerName: 'Status',
      flex: 0,
      width: 140,
      minHeight: '40px',
      hide: !columnVisibility.raiseself,
      pinned: 'left',
      lockPinned: true,
      cellRenderer: (params) => (
        <Grid sx={{ display: 'flex' }}>
          <Grid item md={3} xs={12} sm={12}>
            <Typography
              sx={{
                color:
                  params.data.raiseself === 'Open'
                    ? 'red'
                    : params.data.raiseself === 'Resolved'
                    ? 'green'
                    : params.data.raiseself === 'Details Needed'
                    ? 'blue'
                    : params.data.raiseself === 'Closed'
                    ? 'Orange'
                    : params.data.raiseself === 'Forwarded'
                    ? 'palevioletred'
                    : params.data.raiseself === 'Reject'
                    ? 'darkmagenta'
                    : 'violet',
              }}
            >
              {params.data.raiseself}
            </Typography>{' '}
          </Grid>
        </Grid>
      ),
    },
    {
      field: 'raiseticketcount',
      headerName: 'Ticket Number',
      flex: 0,
      width: 140,
      hide: !columnVisibility.raiseticketcount,
    },
    {
      field: 'raisedby',
      headerName: 'Raised By',
      flex: 0,
      width: 140,
      hide: !columnVisibility.raisedby,
    },
    {
      field: 'raiseddate',
      headerName: 'Raised Date/Time',
      flex: 0,
      width: 100,
      hide: !columnVisibility.raiseddate,
    },
    {
      field: 'duedate',
      headerName: 'Due Date',
      flex: 0,
      width: 100,
      hide: !columnVisibility.duedate,
    },
    {
      field: 'remainingDate',
      headerName: 'Ticket Due Date',
      flex: 0,
      width: 200,
      hide: !columnVisibility.remainingDate,
    },
    {
      field: 'remainingHours',
      headerName: 'Remaing Hours',
      flex: 0,
      width: 150,
      hide: !columnVisibility.remainingHours,
    },

    {
      field: 'reason',
      headerName: 'Resolved Reason',
      flex: 0,
      width: 100,
      hide: !columnVisibility.reason,
    },
    {
      field: 'employeename',
      headerName: 'Employee Name',
      flex: 0,
      width: 150,
      hide: !columnVisibility.employeename,
    },
    {
      field: 'employeecode',
      headerName: 'Employee Code',
      flex: 0,
      width: 150,
      hide: !columnVisibility.employeecode,
    },
    {
      field: 'category',
      headerName: 'Category',
      flex: 0,
      width: 100,
      hide: !columnVisibility.category,
    },
    {
      field: 'subcategory',
      headerName: 'Subcategory',
      flex: 0,
      width: 150,

      hide: !columnVisibility.subcategory,
    },
    {
      field: 'subsubcategory',
      headerName: 'Sub 1 category',
      flex: 0,
      width: 150,

      hide: !columnVisibility.subsubcategory,
    },
  ];

  // Function to remove HTML tags and convert to numbered list
  const convertToNumberedList = (htmlContent) => {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = htmlContent;

    const listItems = Array.from(tempElement.querySelectorAll('li'));
    listItems.forEach((li, index) => {
      li.innerHTML = `\u2022 ${li.innerHTML}\n`;
    });

    return tempElement.innerText;
  };

  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item.id,
      serialNumber: item.serialNumber,
      employeename: item.employeename,
      employeecode: item.employeecode,
      category: item.category,
      raiseself: item.raiseself,
      subcategory: item.subcategory,
      remainingDate: item.remainingDate,
      remainingHours: item.remainingHours,
      subsubcategory: item.subsubcategory,
      workstation: item.workstation,
      materialname: item.materialname,
      raiseddate: item.raiseddate,
      type: item.type,
      raisedby: item.raisedby,
      duedate: item?.duedate ? item?.duedate : '',
      resolverby: item?.ticketclosed,
      resolvedate: item.resolvedate,
      raiseticketcount: item.raiseticketcount,
      reason: item.reason,
      priority: item.priority,
      status: item.status,
      title: item.title,
      description: item.description,
    };
  });

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'RaiseTicket_User_Forwarded_Tickets',
    pageStyle: 'print',
  });

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
  const gridRefTableImg = useRef(null);
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage
        .toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, 'Forwarded Ticket List.png');
        })
        .catch((error) => {
          console.error('dom-to-image error: ', error);
        });
    }
  };

  // JSX for the "Manage Columns" popover content
  const manageColumnsContent = (
    <div style={{ padding: '10px', minWidth: '325px' }}>
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
      <Box sx={{ position: 'relative', margin: '10px' }}>
        <TextField label="Find column" variant="standard" fullWidth value={searchQueryManage} onChange={(e) => setSearchQueryManage(e.target.value)} sx={{ marginBottom: 5, position: 'absolute' }} />
      </Box>
      <br />
      <br />
      <DialogContent sx={{ minWidth: 'auto', height: '200px', position: 'relative' }}>
        <List sx={{ overflow: 'auto', height: '100%' }}>
          {filteredColumns.map((column) => (
            <ListItem key={column.field}>
              <ListItemText sx={{ display: 'flex' }} primary={<Switch sx={{ marginTop: '-10px' }} checked={columnVisibility[column.field]} onChange={() => toggleColumnVisibility(column.field)} />} secondary={column.headerName} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Grid container>
          <Grid item md={4}>
            <Button variant="text" sx={{ textTransform: 'none' }} onClick={() => setColumnVisibility(initialColumnVisibility)}>
              Show All
            </Button>
          </Grid>
          <Grid item md={4}></Grid>
          <Grid item md={4}>
            <Button variant="text" sx={{ textTransform: 'none' }} onClick={() => setColumnVisibility({})}>
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </div>
  );

  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ''; // This is required for Chrome support
  };

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener('beforeunload', beforeUnloadHandler);
    return () => {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
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
  const [copiedData, setCopiedData] = useState('');

  return (
    <Box>
      <Headtitle title={'RAISE TICKET TEAMGROUP'} />
      {/* ****** Header Content ****** */}
      <Typography sx={userStyle.HeaderText}>Raise Ticket - User Forwarded Tickets</Typography>

      {isUserRoleCompare?.includes('lmyactionableticket') && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography sx={userStyle.SubHeaderText}>Raise Ticket - User Forwarded Tickets</Typography>
              </Grid>
              {/* <Grid item xs={4}>
                                    {isUserRoleCompare?.includes("araiseticketmaster")
                                        && (
                                            <>
                                                <Link  to={'/tickets/raiseticketmaster'} style={{ textDecoration: 'none', color: 'white', float: 'right' }}><Button variant="contained">ADD</Button></Link>
                                            </>
                                        )}
                                </Grid> */}
            </Grid>
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
                    sx={{ width: '77px' }}
                  >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                  </Select>
                </Box>
              </Grid>
              <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Box>
                  {isUserRoleCompare?.includes('excelmyactionableticket') && (
                    <>
                      <Button
                        onClick={(e) => {
                          setIsFilterOpen(true);
                          setFormat('xl');
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileExcel />
                        &ensp;Export to Excel&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes('csvmyactionableticket') && (
                    <>
                      <Button
                        onClick={(e) => {
                          setIsFilterOpen(true);
                          setFormat('csv');
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileCsv />
                        &ensp;Export to CSV&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes('printmyactionableticket') && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes('pdfmyactionableticket') && (
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
                  {isUserRoleCompare?.includes('imagemyactionableticket') && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                        {' '}
                        <ImageIcon sx={{ fontSize: '15px' }} /> &ensp;Image&ensp;{' '}
                      </Button>
                    </>
                  )}
                </Box>
              </Grid>
              <Grid item md={2} xs={12} sm={12}>
                <AggregatedSearchBar
                  columnDataTable={columnDataTable}
                  setItems={setItems}
                  addSerialNumber={addSerialNumber}
                  setPage={setPage}
                  maindatas={raiseTicketList}
                  setSearchedString={setSearchedString}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  paginated={false}
                  totalDatas={items}
                />
              </Grid>
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
            </Button>{' '}
            &emsp;
            <br />
            <br />
            {!queueCheck ? (
              <Box sx={userStyle.container}>
                <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '350px' }}>
                  <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                </Box>
              </Box>
            ) : (
              <>
                {/* ****** Table start ****** */}
                <Box
                  style={{
                    width: '100%',
                    overflowY: 'hidden', // Hide the y-axis scrollbar
                  }}
                >
                  <AggridTable
                    rowDataTable={rowDataTable}
                    columnDataTable={columnDataTable}
                    columnVisibility={columnVisibility}
                    page={page}
                    setPage={setPage}
                    pageSize={pageSize}
                    totalPages={totalPages}
                    setColumnVisibility={setColumnVisibility}
                    isHandleChange={isHandleChange}
                    items={items}
                    selectedRows={selectedRows}
                    setSelectedRows={setSelectedRows}
                    gridRefTable={gridRefTable}
                    paginated={false}
                    filteredDatas={filteredDatas}
                    // totalDatas={totalProjects}
                    searchQuery={searchedString}
                    handleShowAllColumns={handleShowAllColumns}
                    setFilteredRowData={setFilteredRowData}
                    filteredRowData={filteredRowData}
                    setFilteredChanges={setFilteredChanges}
                    filteredChanges={filteredChanges}
                    gridRefTableImg={gridRefTableImg}
                    itemsList={items}
                  />
                </Box>
              </>
            )}
            {/* ****** Table End ****** */}
          </Box>

          <Popover
            id={id}
            open={isManageColumnsOpen}
            anchorEl={anchorEl}
            onClose={handleCloseManageColumns}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
          >
            {manageColumnsContent}
          </Popover>
        </>
      )}

      <br />
      {/* EXTERNAL COMPONENTS -------------- START */}
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
        filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
        itemsTwo={raiseTicketList ?? []}
        filename={'Forwarded Ticket List'}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      <br />
    </Box>
  );
}

export default RaiseTicketUserForwarded;
