import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { Box, Typography, OutlinedInput, Select, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Button, List, ListItem, ListItemText, Popover, TextField, IconButton } from '@mui/material';
import { userStyle, colourStyles } from '../../../pageStyle';
import { FaPrint, FaFilePdf } from 'react-icons/fa';
// import jsPDF from 'jspdf';
import Selects from 'react-select';
import 'jspdf-autotable';
import axios from 'axios';
import { SERVICE } from '../../../services/Baseservice';
import { handleApiError } from '../../../components/Errorhandling';
// import moment from 'moment-timezone';
import { useReactToPrint } from 'react-to-print';
import { UserRoleAccessContext } from '../../../context/Appcontext';
import { AuthContext } from '../../../context/Appcontext';
import Headtitle from '../../../components/Headtitle';
import { ThreeDots } from 'react-loader-spinner';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import { saveAs } from 'file-saver';
import Switch from '@mui/material/Switch';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import { FaFileExcel, FaFileCsv } from 'react-icons/fa';
import PageHeading from '../../../components/PageHeading';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import domtoimage from 'dom-to-image';
import ExportData from '../../../components/ExportData';
import MessageAlert from '../../../components/MessageAlert';
import AlertDialog from '../../../components/Alert';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import LoadingButton from '@mui/lab/LoadingButton';
import { MultiSelect } from 'react-multi-select-component';

const CustomRateField = ({ value, row, column, updateRowData }) => {
  const [rate, setRate] = useState(value); // Local state for input field

  const handleChange = (event) => {
    setRate(event.target.value); // Update local state, not the whole table
  };

  const handleUpdate = () => {
    // let otherFieldValue = rate;

    // let fieldName = "mrate";
    // Only update parent state (table data) when input loses focus (onBlur)
    updateRowData({ ...row, [column.field]: rate });
  };

  return (
    <OutlinedInput
      type="number"
      value={rate}
      onChange={handleChange}
      onBlur={handleUpdate} // Trigger update when input loses focus
      onMouseLeave={handleUpdate}
      style={{ width: '100%' }}
    />
  );
};

function NewrateUpdate() {
  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState('');
  const [popupSeverityMalert, setPopupSeverityMalert] = useState('');
  const handleClickOpenPopupMalert = () => {
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

  const gridRef = useRef(null);

  const gridRefAssigned = useRef(null);

  const gridRefImg = useRef(null);

  const gridRefAssignedImg = useRef(null);
  const [selectedProject, setSelectedProject] = useState([]);

  const [projectOpt, setProjmasterOpt] = useState([]);
  const [selectedMode, setSelectedMode] = useState('Today');
  const [rows, setRows] = useState([]);
  const [rowsAssigned, setRowsAssigned] = useState([]);

  const mode = [
    { label: 'Today', value: 'Today' },
    { label: 'Tomorrow', value: 'Tomorrow' },
    { label: 'Yesterday', value: 'Yesterday' },
    { label: 'This Week', value: 'This Week' },
    { label: 'This Month', value: 'This Month' },
    { label: 'Last Week', value: 'Last Week' },
    { label: 'Last Month', value: 'Last Month' },
    { label: 'Custom', value: 'Custom' },
  ];

  let exportColumnNames = ['Vendor', 'Category', 'Sub Category', 'New Rate'];
  let exportRowValues = ['vendor', 'filenameupdated', 'category', 'newrate'];

  let exportColumnNamesAssigned = ['Vendor', 'Category', 'Sub Category', 'New Rate'];
  let exportRowValuesAssigned = ['vendor', 'category', 'subcategory', 'newrate'];

  //    today date fetching
  let today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var yyyy = today.getFullYear();
  today = yyyy + '-' + mm + '-' + dd;
  let now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  let currtime = `${hours}:${minutes}`;

  const [selectedRows, setSelectedRows] = useState([]);

  const [searchQueryManage, setSearchQueryManage] = useState('');

  const [selectedRowsAssigned, setSelectedRowsAssigned] = useState([]);

  const [searchQueryManageAssigned, , setSearchQueryManageAssigned] = useState('');

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  const [isFilterOpenAssigned, setIsFilterOpenAssigned] = useState(false);
  const [isPdfFilterOpenAssigned, setIsPdfFilterOpenAssigned] = useState(false);

  // page refersh reload
  const handleCloseFilterModAssigned = () => {
    setIsFilterOpenAssigned(false);
  };

  const handleClosePdfFilterModAssigned = () => {
    setIsPdfFilterOpenAssigned(false);
  };

  const [fromdate, setFromdate] = useState(today);
  const [todate, setTodate] = useState(today);

  const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);
  const [projectCheck, setProjectCheck] = useState(false);
  const [projectCheckAssigned, setProjectCheckAssigned] = useState(false);

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  //Datatable
  const [pageAssigned, setPageAssigned] = useState(1);
  const [pageSizeAssigned, setPageSizeAssigned] = useState(10);

  // const [itemsAssigned, setItemsAssigned] = useState([]);
  const [searchQueryAssigned, setSearchQueryAssigned] = useState('');

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  //image

  const handleCaptureImage = () => {
    if (gridRefImg.current) {
      domtoimage
        .toBlob(gridRefImg.current)
        .then((blob) => {
          saveAs(blob, 'UnAssignedList.png');
        })
        .catch((error) => {
          console.error('dom-to-image error: ', error);
        });
    }
  };

  const handleCaptureImageAssigned = () => {
    if (gridRefAssignedImg.current) {
      domtoimage
        .toBlob(gridRefAssignedImg.current)
        .then((blob) => {
          saveAs(blob, 'AssignedList.png');
        })
        .catch((error) => {
          console.error('dom-to-image error: ', error);
        });
    }
  };
  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ''; // This is required for Chrome support
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
    setSearchQueryManage('');
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  // Manage Columns
  const [isManageColumnsOpenAssigned, setManageColumnsOpenAssigned] = useState(false);
  const [anchorElAssigned, setAnchorElAssigned] = useState(null);

  const handleOpenManageColumnsAssigned = (event) => {
    setAnchorElAssigned(event.currentTarget);
    setManageColumnsOpenAssigned(true);
  };
  const handleCloseManageColumnsAssigned = () => {
    setManageColumnsOpenAssigned(false);
    setSearchQueryManageAssigned('');
  };

  const openAssigned = Boolean(anchorElAssigned);
  const idAssigned = openAssigned ? 'simple-popover' : undefined;

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    vendor: true,
    formatteddate: true,
    filenameupdated: true,
    category: true,
    newrate: true,
    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

  // Show All Columns & Manage Columns
  const initialColumnVisibilityAssigned = {
    serialNumber: true,
    checkbox: true,
    vendor: true,
    subcategory: true,
    category: true,
    newrate: true,
    actions: true,
  };

  const [columnVisibilityAssigned, setColumnVisibilityAssigned] = useState(initialColumnVisibilityAssigned);
  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedProject.length === 0) {
      setPopupContentMalert('Please Select Project!');
      setPopupSeverityMalert('warning');
      handleClickOpenPopupMalert();
    } else {
      fetchProductionIndividual();
      fetchProductionIndividualAssigned();
    }
  };

  //get all project.
  const fetchProjMaster = async () => {
    try {
      let res_project = await axios.get(SERVICE.PROJECTMASTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const projectopt = [
        ...res_project?.data?.projmaster.map((item) => ({
          ...item,
          label: item.name,
          value: item.name,
        })),
      ];
      setSelectedProject(projectopt);
      setProjmasterOpt(projectopt);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    fetchProductionIndividualAssigned();
    fetchProjMaster();
  }, []);

  const handleclear = async (e) => {
    setPageName(!pageName);
    e.preventDefault();
    setSelectedProject([]);

    setRows([]);
    setPopupContentMalert('Cleared Successfully!');
    setPopupSeverityMalert('success');
    handleClickOpenPopupMalert();
  };

  const [totalcount, setTotalcount] = useState(0);
  const [totalcountAssigned, setTotalcountAssigned] = useState(0);

  const handleProjectChange = (options) => {
    setSelectedProject(options);
  };
  const customValueRendererProject = (valueProject, _categoryname) => {
    return valueProject?.length ? valueProject.map(({ label }) => label)?.join(', ') : 'Please Select Project';
  };

  const fetchProductionIndividual = async () => {
    setRows([]);
    setProjectCheck(true);
    try {
      const response = await axios.post(
        SERVICE.PRODUCTION_UPLOAD_RAWDATA_FILTER_NEWRATE,
        {
          projectvendor: selectedProject.map((item) => item.value),
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );

      if (response.data.count === 0) {
        setProjectCheck(false);
      } else {
        setTotalcount(response.data.productionupload.length);
        const filtered = response.data.productionupload.map((item, index) => ({
          ...item,
          serialNumber: index + 1,
          id: item._id,
        }));
        console.log(filtered.length);
        setRows(filtered);
        setProjectCheck(false);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setProjectCheck(false);
    }
  };

  const fetchProductionIndividualAssigned = async () => {
    setRowsAssigned([]);
    setProjectCheckAssigned(true);

    try {
      const response = await axios.get(SERVICE.UPDATED_NEWRATE_LIMITED, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setTotalcountAssigned(response.data.updatedunitrates.length);
      const filtered = response.data.updatedunitrates.map((item, index) => ({
        ...item,
        serialNumber: index + 1,
        id: item._id,
      }));
      console.log(filtered.length);
      setRowsAssigned(filtered);
      setProjectCheckAssigned(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setProjectCheck(false);
    }
  };

  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'UnAssigned List',
    pageStyle: 'print',
  });

  //print...
  const componentRefAssigned = useRef();
  const handleprintAssigned = useReactToPrint({
    content: () => componentRefAssigned.current,
    documentTitle: 'Assigned List',
    pageStyle: 'print',
  });

  //Datatable
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
  const totalPages = Math.ceil(totalcount / pageSize);
  // const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);
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

  const handleCellEdit = (params) => {
    const updatedRows = rows.map((row) => (row.id === params.data.id ? { ...row, [params.colDef.field]: params.newValue } : row));
    setRows(updatedRows); // Update only the modified row.
  };

  const gridApi = useRef(null);
  const columnApi = useRef(null);

  let minRowHeight = 25;

  const onGridReady = useCallback((params) => {
    gridApi.current = params.api;
    columnApi.current = params.columnApi;
  }, []);

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener('beforeunload', beforeUnloadHandler);
    return () => {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
    };
  }, []);

  const updateRowData = (updatedRow) => {
    const updatedRows = rows.map((row) => (row.id === updatedRow.id ? updatedRow : row));
    setRows(updatedRows); // Efficiently update the row data.
  };

  const handleUpdate = async (data) => {
    console.log(data, 'data');
    if (data.newrate === '' || data.newrate == undefined) {
      setPopupContentMalert('Please Enter NewRate');
      setPopupSeverityMalert('warning');
      handleClickOpenPopupMalert();
    } else if (Number(data.newrate) === 0) {
      setPopupContentMalert('Please Enter Non Zero Value in NewRate');
      setPopupSeverityMalert('warning');
      handleClickOpenPopupMalert();
    } else if (Number(data.newrate) < 0) {
      setPopupContentMalert('Please Enter Valid NewRate');
      setPopupSeverityMalert('warning');
      handleClickOpenPopupMalert();
    } else {
      setisupdatenewrate(data.id)
      try {
        let resCheck = await axios.post(SERVICE.UPDATED_NEWRATE_DUPECHECK, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          vendor: data.vendor,
          category: data.filenameupdated,
          subcategory: data.category,

        })
        if(resCheck.data.count ===0){

    
        let resCreate = await axios.post(SERVICE.UPDATED_NEWRATE_CREATE, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          vendor: data.vendor,
          category: data.filenameupdated,
          subcategory: data.category,
          newrate: Number(data.newrate),
          addedby: [
            {
              name: String(isUserRoleAccess.username),
              date: String(new Date()),
            },
          ],
        });
        const updatedRows = rows.map((row) => {
          // If the row id matches, update it with the new data
          if (row.id === data._id) {
            return { ...row, isedited: true }; // Update only the mrate or other fields as necessary
          }
          return row; // Keep other rows unchanged
        });
      
        // const updatedRemovedRows = updatedRows.filter((row) => row.isedited !== true);
        setRows(updatedRows);
        setPopupContent('Updated Successfully');
        setPopupSeverity('success');
        handleClickOpenPopup();
        setisupdatenewrate("")
      }else{
        setisupdatenewrate("")
        setPopupContentMalert('Already Updated');
        setPopupSeverityMalert('warning');
        handleClickOpenPopupMalert();
      }
      } catch (err) {
        setisupdatenewrate("")
        console.log(err, 'err');
      }
    }
  };

  const columnDataTable = [
    {
      field: 'serialNumber',
      headerName: 'SNo',
      flex: 0,
      width: 90,
      hide: !columnVisibility.serialNumber,
      headerClassName: 'bold-header',
    },
    { field: 'vendor', headerName: 'Vendor', flex: 0, width: 165, hide: !columnVisibility.vendor, headerClassName: 'bold-header' },
    { field: 'filenameupdated', headerName: 'Category', flex: 0, width: 300, hide: !columnVisibility.filenameupdated, headerClassName: 'bold-header' },
    { field: 'category', headerName: 'SubCategory', flex: 0, width: 400, hide: !columnVisibility.category, headerClassName: 'bold-header' },
    {
      field: 'newrate',
      headerName: 'NewRate',
      flex: 0,
      width: 150,
      hide: !columnVisibility.newrate,
      headerClassName: 'bold-header',

      cellRenderer: (params) => <CustomRateField value={params.value} row={params.data} column={params.colDef} updateRowData={updateRowData} />,
    },
    {
      field: 'actions',
      headerName: 'Action',
      flex: 0,
      width: 100,
      minHeight: '40px !important',
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: 'bold-header',
      cellRenderer: (params) => (
        <Grid sx={{ display: 'flex', alignItems: 'center' }}>
          <LoadingButton disabled={params.data.isedited === true || isupdatenewrate === params.data.id} loading={isupdatenewrate=== params.data.id} variant="contained" onClick={() => handleUpdate(params.data)}>
            Allot
          </LoadingButton>
        </Grid>
      ),
    },
  ];

  // const rowDataTable = filteredData.map((item, index) => {
  //   return {
  //     ...item,
  //   };
  // });

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
  // Manage Columns functionality
  const toggleColumnVisibility = (field) => {
    setColumnVisibility((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };

  // JSX for the "Manage Columns" popover content
  const manageColumnsContent = (
    <Box style={{ padding: '10px', minWidth: '325px', '& .MuiDialogContent-root': { padding: '10px 0' } }}>
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
              <ListItemText
                sx={{ display: 'flex' }}
                primary={<Switch sx={{ marginTop: '-5px' }} size="small" checked={columnVisibility[column.field]} onChange={() => toggleColumnVisibility(column.field)} />}
                secondary={column.field === 'checkbox' ? 'Checkbox' : column.headerName}
                // secondary={column.headerName }
              />
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
            <Button
              variant="text"
              sx={{ textTransform: 'none' }}
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
  // DATATATABLE ASSIGNED TABLE
  const [fileFormat, setFormat] = useState('');
  //Datatable
  // Handle page change
  const handlePageChangeAssigned = (newPage) => {
    if (newPage > 0 && newPage <= totalPagesAssigned) {
      setPageAssigned(newPage);
    }
  };

  // Handle search change
  const handleSearchChangeAssigned = (e) => {
    setSearchQueryAssigned(e.target.value);
    setPageAssigned(1); // Reset to the first page when search changes
  };

  // Handle page size change
  const handlePageSizeChangeAssigned = (e) => {
    setPageSizeAssigned(e.target.value);
    setPageAssigned(1); // Reset to the first page when page size changes
  };

  // Filter data based on search query
  const filteredDataAssigned = rowsAssigned.filter((row) => {
    return Object.values(row).some((value) => value.toString().toLowerCase().includes(searchQueryAssigned.toLowerCase()));
  });

  // Pagination logic
  const totalPagesAssigned = Math.ceil(filteredDataAssigned.length / pageSize);
  // const pageNumbersAssigned = Array.from({ length: totalPagesAssigned }, (_, index) => index + 1);
  const paginatedDataAssigned = filteredDataAssigned.slice((pageAssigned - 1) * pageSizeAssigned, pageAssigned * pageSizeAssigned);
  const maxVisiblePagesAssigned = 3;

  const handleCellEditAssigned = (params) => {
    const updatedRows = rowsAssigned.map((row) => (row.id === params.data.id ? { ...row, [params.colDef.field]: params.newValue } : row));
    setRowsAssigned(updatedRows); // Update only the modified row.
  };

  const gridApiAssigned = useRef(null);
  const columnApiAssigned = useRef(null);

  const onGridReadyAssigned = useCallback((params) => {
    gridApiAssigned.current = params.api;
    columnApiAssigned.current = params.columnApi;
  }, []);

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener('beforeunload', beforeUnloadHandler);
    return () => {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
    };
  }, []);

  const updateRowDataAssigned = (updatedRow) => {
    const updatedRows = rowsAssigned.map((row) => (row.id === updatedRow.id ? updatedRow : row));
    setRowsAssigned(updatedRows); // Efficiently update the row data.
  };
const[isupdatenewrate, setisupdatenewrate] = useState(false)
  const handleUpdateAssigned = async (data) => {

    console.log(data, 'data');
    if (data.newrate === '' || data.newrate == undefined) {
      setPopupContentMalert('Please Enter NewRate');
      setPopupSeverityMalert('warning');
      handleClickOpenPopupMalert();
    } else if (Number(data.newrate) === 0) {
      setPopupContentMalert('Please Enter Non Zero Value in NewRate');
      setPopupSeverityMalert('warning');
      handleClickOpenPopupMalert();
    } else if (Number(data.newrate) < 0) {
      setPopupContentMalert('Please Enter Valid NewRate');
      setPopupSeverityMalert('warning');
      handleClickOpenPopupMalert();
    } else {
    
      try {
        let resCreate = await axios.put(`${SERVICE.UPDATED_NEWRATE_SINGLE}/${data._id}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          newrate: Number(data.newrate),
          // },
        });
       

        setPopupContent('Updated Successfully');
        setPopupSeverity('success');
        handleClickOpenPopup();
      
      } catch (err) {
        setisupdatenewrate(false)
        console.log(err, 'err');
      }
    }
  };

  const columnDataTableAssigned = [
    {
      field: 'serialNumber',
      headerName: 'SNo',
      flex: 0,
      width: 100,
      hide: !columnVisibilityAssigned.serialNumber,
      headerClassName: 'bold-header',
    },
    { field: 'vendor', headerName: 'Vendor', flex: 0, width: 170, hide: !columnVisibilityAssigned.vendor, headerClassName: 'bold-header' },
    { field: 'category', headerName: 'Category', flex: 0, width: 300, hide: !columnVisibilityAssigned.category, headerClassName: 'bold-header' },
    { field: 'subcategory', headerName: 'SubCategory', flex: 0, width: 400, hide: !columnVisibilityAssigned.subcategory, headerClassName: 'bold-header' },
    {
      field: 'newrate',
      headerName: 'NewRate',
      flex: 0,
      width: 150,
      hide: !columnVisibilityAssigned.newrate,
      headerClassName: 'bold-header',

      cellRenderer: (params) => <CustomRateField value={params.value} row={params.data} column={params.colDef} updateRowData={updateRowDataAssigned} />,
    },
    {
      field: 'actions',
      headerName: 'Action',
      flex: 0,
      width: 100,
      minHeight: '40px !important',
      sortable: false,
      hide: !columnVisibilityAssigned.actions,
      headerClassName: 'bold-header',
      cellRenderer: (params) => (
        <Grid sx={{ display: 'flex', alignItems: 'center' }}>
          <Button disabled={params.data.isedited === true}  variant="contained" onClick={() => handleUpdateAssigned(params.data)}>
            update
          </Button>
        </Grid>
      ),
    },
  ];

  // Show All Columns functionality
  const handleShowAllColumnsAssigned = () => {
    const updatedVisibilityAssigned = { ...columnVisibilityAssigned };
    for (const columnKey in updatedVisibilityAssigned) {
      updatedVisibilityAssigned[columnKey] = true;
    }
    setColumnVisibilityAssigned(updatedVisibilityAssigned);
  };

  useEffect(() => {
    // Retrieve column VisibilityAssigned from localStorage (if available)
    const savedVisibilityAssigned = localStorage.getItem('columnVisibilityAssigned');
    if (savedVisibilityAssigned) {
      setColumnVisibilityAssigned(JSON.parse(savedVisibilityAssigned));
    }
  }, []);

  useEffect(() => {
    // Save column VisibilityAssigned to localStorage whenever it changes
    localStorage.setItem('columnVisibilityAssigned', JSON.stringify(columnVisibilityAssigned));
  }, [columnVisibilityAssigned]);

  // // Function to filter columns based on search query
  const filteredColumnsAssigned = columnDataTableAssigned.filter((column) => column.headerName.toLowerCase().includes(searchQueryManageAssigned.toLowerCase()));
  // Manage Columns functionality
  const toggleColumnVisibilityAssigned = (field) => {
    setColumnVisibilityAssigned((prevVisibilityAssigned) => ({
      ...prevVisibilityAssigned,
      [field]: !prevVisibilityAssigned[field],
    }));
  };

  // JSX for the "Manage Columns" popover content
  const manageColumnsContentAssigned = (
    <Box style={{ padding: '10px', minWidth: '325px', '& .MuiDialogContent-root': { padding: '10px 0' } }}>
      <Typography variant="h6">Manage Columns</Typography>
      <IconButton
        aria-label="close"
        onClick={handleCloseManageColumnsAssigned}
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
        <TextField label="Find column" variant="standard" fullWidth value={searchQueryManageAssigned} onChange={(e) => setSearchQueryManageAssigned(e.target.value)} sx={{ marginBottom: 5, position: 'absolute' }} />
      </Box>
      <br />
      <br />
      <DialogContent sx={{ minWidth: 'auto', height: '200px', position: 'relative' }}>
        <List sx={{ overflow: 'auto', height: '100%' }}>
          {filteredColumnsAssigned.map((column) => (
            <ListItem key={column.field}>
              <ListItemText
                sx={{ display: 'flex' }}
                primary={<Switch sx={{ marginTop: '-5px' }} size="small" checked={columnVisibilityAssigned[column.field]} onChange={() => toggleColumnVisibilityAssigned(column.field)} />}
                secondary={column.field === 'checkbox' ? 'Checkbox' : column.headerName}
                // secondary={column.headerName }
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Grid container>
          <Grid item md={4}>
            <Button variant="text" sx={{ textTransform: 'none' }} onClick={() => setColumnVisibilityAssigned(initialColumnVisibilityAssigned)}>
              Show All
            </Button>
          </Grid>
          <Grid item md={4}></Grid>
          <Grid item md={4}>
            <Button
              variant="text"
              sx={{ textTransform: 'none' }}
              onClick={() => {
                const newColumnVisibilityAssigned = {};
                columnDataTableAssigned.forEach((column) => {
                  newColumnVisibilityAssigned[column.field] = false; // Set hide property to true
                });
                setColumnVisibilityAssigned(newColumnVisibilityAssigned);
              }}
            >
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );

  const getDateRange = (mode) => {
    const today = new Date();
    let fromdate, todate;

    const formatDate = (date) => {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };

    switch (mode) {
      case 'Today':
        fromdate = todate = formatDate(today);
        break;
      case 'Tomorrow':
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        fromdate = todate = formatDate(tomorrow);
        break;
      case 'Yesterday':
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        fromdate = todate = formatDate(yesterday);
        break;
      case 'This Week':
        const startOfThisWeek = new Date(today);
        startOfThisWeek.setDate(today.getDate() - ((today.getDay() + 6) % 7)); // Monday
        const endOfThisWeek = new Date(startOfThisWeek);
        endOfThisWeek.setDate(startOfThisWeek.getDate() + 6); // Sunday
        fromdate = formatDate(startOfThisWeek);
        todate = formatDate(endOfThisWeek);
        break;
      case 'This Month':
        fromdate = formatDate(new Date(today.getFullYear(), today.getMonth(), 1));
        todate = formatDate(new Date(today.getFullYear(), today.getMonth() + 1, 0));
        break;
      case 'Last Week':
        const startOfLastWeek = new Date(today);
        startOfLastWeek.setDate(today.getDate() - ((today.getDay() + 6) % 7) - 7); // Last Monday
        const endOfLastWeek = new Date(startOfLastWeek);
        endOfLastWeek.setDate(startOfLastWeek.getDate() + 6); // Last Sunday
        fromdate = formatDate(startOfLastWeek);
        todate = formatDate(endOfLastWeek);
        break;
      case 'Last Month':
        fromdate = formatDate(new Date(today.getFullYear(), today.getMonth() - 1, 1)); // 1st of last month
        todate = formatDate(new Date(today.getFullYear(), today.getMonth(), 0)); // Last day of last month
        break;
      default:
        fromdate = todate = '';
    }

    return { fromdate, todate };
  };

  const formatDateForInput = (date) => {
    if (isNaN(date.getTime())) {
      return ''; // Return empty if the date is invalid
    }
    return date.toISOString().split('T')[0]; // Converts date to 'yyyy-MM-dd' format
  };

  // const getapi = async () => {
  //   let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
  //     headers: {
  //       Authorization: `Bearer ${auth.APIToken}`,
  //     },
  //     empcode: String(isUserRoleAccess?.empcode),
  //     companyname: String(isUserRoleAccess?.companyname),
  //     pagename: String('Approve List'),
  //     commonid: String(isUserRoleAccess?._id),
  //     date: String(new Date()),

  //     addedby: [
  //       {
  //         name: String(isUserRoleAccess?.username),
  //         date: String(new Date()),
  //       },
  //     ],
  //   });
  // };

  // useEffect(() => {
  //   getapi();
  // }, []);

  return (
    <Box>
      <Headtitle title={'UnAssigned List'} />
      {/* ****** Header Content ****** */}
      <PageHeading title="UnAssigned List" modulename="Production" submodulename="Setup" mainpagename="Zero Unitrate Master assigned/unassigned" subpagename="" subsubpagename="" />

      <>
        <Box sx={userStyle.selectcontainer}>
          {/* <Grid item xs={8}>
            <Typography sx={userStyle.importheadtext}>Approve</Typography>
          </Grid> */}
          <>
            <br />
            <Grid container spacing={2}>
              <Grid item md={3} xs={12} sm={6}>
                <FormControl fullWidth>
                  <Typography>
                    Project
                    <b style={{ color: 'red' }}>*</b>
                  </Typography>

                  <MultiSelect
                    options={projectOpt}
                    value={selectedProject}
                    onChange={(e) => {
                      handleProjectChange(e);
                    }}
                    valueRenderer={customValueRendererProject}
                    labelledBy="Please Select Project"
                  />
                </FormControl>
              </Grid>
              <Grid item lg={1} md={2} sm={2} xs={12}>
                <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0 } })}>
                  <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={handleSubmit}>
                    Filter
                  </Button>
                </Box>
              </Grid>
              <Grid item lg={1} md={2} sm={2} xs={12}>
                <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0 } })}>
                  <Button sx={buttonStyles.btncancel} onClick={handleclear}>
                    Clear
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </>
        </Box>
      </>

      <br />

      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes('lzerounitratemasterassigned/unassigned') && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>UnAssigned List</Typography>
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
                    {/* <MenuItem value={Number(totalPages)}>All</MenuItem> */}
                  </Select>
                </Box>
              </Grid>
              <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Box>
                  {isUserRoleCompare?.includes('excelzerounitratemasterassigned/unassigned') && (
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
                  {isUserRoleCompare?.includes('csvzerounitratemasterassigned/unassigned') && (
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
                  {isUserRoleCompare?.includes('printzerounitratemasterassigned/unassigned') && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes('pdfzerounitratemasterassigned/unassigned') && (
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
                  {isUserRoleCompare?.includes('imagezerounitratemasterassigned/unassigned') && (
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
                <Box>
                  <FormControl fullWidth size="small">
                    <Typography>Search</Typography>
                    <OutlinedInput id="component-outlined" type="text" value={searchQuery} onChange={handleSearchChange} />
                  </FormControl>{' '}
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
            &ensp;
            {/* Show "Load More" button if there's more data */}
            {/* {hasMoreData && !isLoading && rows.length > 0 && (
              <Button variant="contained" onClick={loadMore}>
                Load More
              </Button>
            )} */}
            &ensp; Total Count :- <span>{totalcount}</span>
            {/* Manage Column */}
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
            <br />
            {projectCheck ? (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                </Box>
              </>
            ) : (
              <>
                <Box
                  style={{
                    // height: 300,

                    width: '100%',
                    // overflowY: "hidden", // Hide the y-axis scrollbar
                  }}
                  className="ag-theme-quartz"
                  ref={gridRefImg}
                >
                  <AgGridReact
                    rowData={paginatedData}
                    columnDefs={columnDataTable}
                    defaultColDef={{
                      flex: 1,
                      resizable: true,
                    }}
                    ref={gridRef}
                    onCellEditingStopped={handleCellEdit} // Triggers when cell editing is complete.
                    suppressRowClickSelection={true}
                    rowSelection="multiple"
                    onGridReady={onGridReady}
                    onSelectionChanged={(event) => {
                      const selectedRowsData = event.api.getSelectedRows();
                      setSelectedRows(selectedRowsData);
                    }}
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
                    {page > Math.floor(maxVisiblePages / 2) + 1 && <span>...</span>}
                    {calculatePageNumbers(totalPages, page, maxVisiblePages).map((pageNumber) => (
                      <Button key={pageNumber} onClick={() => handlePageChange(pageNumber)} disabled={page === pageNumber} className={page === pageNumber ? 'active' : ''} sx={userStyle.paginationbtn}>
                        {pageNumber}
                      </Button>
                    ))}

                    {totalPages > 3 && page < totalPages - 2 && <span>...</span>}

                    <Button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                      <NavigateNextIcon />
                    </Button>
                    <Button onClick={() => setPage(Number(totalPages))} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                      <LastPageIcon />
                    </Button>
                  </Box>
                </Box>
              </>
            )}
            {/* ****** Table End ****** */}
          </Box>
        </>
      )}
      {/* ****** Table End ****** */}

      <br />

      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes('lzerounitratemasterassigned/unassigned') && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>Assigned List</Typography>
            </Grid>
            <Grid container spacing={2} style={userStyle.dataTablestyle}>
              <Grid item md={2} xs={12} sm={12}>
                <Box>
                  <label>Show entries:</label>
                  <Select
                    id="pageSizeSelect"
                    value={pageSizeAssigned}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 180,
                          width: 80,
                        },
                      },
                    }}
                    onChange={handlePageSizeChangeAssigned}
                    sx={{ width: '77px' }}
                  >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                    {/* <MenuItem value={Number(totalPagesAssigned)}>All</MenuItem> */}
                  </Select>
                </Box>
              </Grid>
              <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Box>
                  {isUserRoleCompare?.includes('excelzerounitratemasterassigned/unassigned') && (
                    <>
                      <Button
                        onClick={(e) => {
                          setIsFilterOpenAssigned(true);
                          setFormat('xl');
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileExcel />
                        &ensp;Export to Excel&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes('csvzerounitratemasterassigned/unassigned') && (
                    <>
                      <Button
                        onClick={(e) => {
                          setIsFilterOpenAssigned(true);
                          setFormat('csv');
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileCsv />
                        &ensp;Export to CSV&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes('printzerounitratemasterassigned/unassigned') && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprintAssigned}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes('pdfzerounitratemasterassigned/unassigned') && (
                    <>
                      <Button
                        sx={userStyle.buttongrp}
                        onClick={() => {
                          setIsPdfFilterOpenAssigned(true);
                        }}
                      >
                        <FaFilePdf />
                        &ensp;Export to PDF&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes('imagezerounitratemasterassigned/unassigned') && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleCaptureImageAssigned}>
                        {' '}
                        <ImageIcon sx={{ fontSize: '15px' }} /> &ensp;Image&ensp;{' '}
                      </Button>
                    </>
                  )}
                </Box>
              </Grid>
              <Grid item md={2} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>Search</Typography>
                  <OutlinedInput id="component-outlined" type="text" value={searchQueryAssigned} onChange={handleSearchChangeAssigned} />
                </FormControl>
              </Grid>
            </Grid>
            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumnsAssigned}>
              Show All Columns
            </Button>
            &ensp;
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsAssigned}>
              Manage Columns
            </Button>
            &ensp;
            {/* Manage Column */}
            <Popover
              id={idAssigned}
              open={isManageColumnsOpenAssigned}
              anchorEl={anchorElAssigned}
              onClose={handleCloseManageColumnsAssigned}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              {manageColumnsContentAssigned}
            </Popover>
            <br />
            {projectCheckAssigned ? (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                </Box>
              </>
            ) : (
              <>
                <Box
                  style={{
                    // height: 300,

                    width: '100%',
                    // overflowY: "hidden", // Hide the y-axis scrollbar
                  }}
                  className="ag-theme-quartz"
                  ref={gridRefAssignedImg}
                >
                  <AgGridReact
                    rowData={paginatedDataAssigned}
                    columnDefs={columnDataTableAssigned}
                    defaultColDef={{
                      flex: 1,
                      resizable: true,
                    }}
                    ref={gridRefAssigned}
                    onCellEditingStopped={handleCellEditAssigned} // Triggers when cell editing is complete.
                    suppressRowClickSelection={true}
                    rowSelection="multiple"
                    onGridReady={onGridReadyAssigned}
                    onSelectionChanged={(event) => {
                      const selectedRowsData = event.api.getSelectedRows();
                      setSelectedRowsAssigned(selectedRowsData);
                    }}
                    domLayout="autoHeight"
                    getRowId={(params) => params.data.id}
                    getRowNodeId={(data) => data.id}
                  />
                </Box>
                <Box sx={userStyle.dataTablestyle}>
                  <Box>
                    Showing {paginatedDataAssigned.length > 0 ? (pageAssigned - 1) * pageSizeAssigned + 1 : 0} to {Math.min(pageAssigned * pageSizeAssigned, filteredDataAssigned.length)} of {filteredDataAssigned.length} entries
                  </Box>
                  <Box>
                    <Button onClick={() => setPageAssigned(1)} disabled={pageAssigned === 1} sx={userStyle.paginationbtn}>
                      <FirstPageIcon />
                    </Button>
                    <Button onClick={() => handlePageChangeAssigned(pageAssigned - 1)} disabled={pageAssigned === 1} sx={userStyle.paginationbtn}>
                      <NavigateBeforeIcon />
                    </Button>
                    {pageAssigned > Math.floor(maxVisiblePages / 2) + 1 && <span>...</span>}
                    {calculatePageNumbers(totalPagesAssigned, pageAssigned, maxVisiblePages).map((pageNumber) => (
                      <Button key={pageNumber} onClick={() => handlePageChangeAssigned(pageNumber)} disabled={pageAssigned === pageNumber} className={pageAssigned === pageNumber ? 'active' : ''} sx={userStyle.paginationbtn}>
                        {pageNumber}
                      </Button>
                    ))}

                    {totalPagesAssigned > 3 && pageAssigned < totalPagesAssigned - 2 && <span>...</span>}

                    <Button onClick={() => handlePageChangeAssigned(pageAssigned + 1)} disabled={pageAssigned === totalPagesAssigned} sx={userStyle.paginationbtn}>
                      <NavigateNextIcon />
                    </Button>
                    <Button onClick={() => setPageAssigned(Number(totalPagesAssigned))} disabled={pageAssigned === totalPagesAssigned} sx={userStyle.paginationbtn}>
                      <LastPageIcon />
                    </Button>
                  </Box>
                </Box>
              </>
            )}
            {/* ****** Table End ****** */}
          </Box>
        </>
      )}
      {/* ****** Table End ****** */}

      {/* ALERT DIALOG */}
      <Box>
        <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
            <Typography variant="h6">{showAlert}</Typography>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              style={{
                padding: '7px 13px',
                color: 'white',
                background: 'rgb(25, 118, 210)',
              }}
              onClick={handleCloseerr}
            >
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

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
        itemsTwo={rows ?? []}
        filename={'Unassigned List'}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* PRINT PDF EXCEL CSV */}
      <ExportData
        isFilterOpen={isFilterOpenAssigned}
        handleCloseFilterMod={handleCloseFilterModAssigned}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpenAssigned}
        isPdfFilterOpen={isPdfFilterOpenAssigned}
        setIsPdfFilterOpen={setIsPdfFilterOpenAssigned}
        handleClosePdfFilterMod={handleClosePdfFilterModAssigned}
        filteredDataTwo={paginatedDataAssigned ?? []}
        itemsTwo={rowsAssigned ?? []}
        filename={'Assigned List'}
        exportColumnNames={exportColumnNamesAssigned}
        exportRowValues={exportRowValuesAssigned}
        componentRef={componentRefAssigned}
      />

      {/* VALIDATION */}
      <MessageAlert openPopup={openPopupMalert} handleClosePopup={handleClosePopupMalert} popupContent={popupContentMalert} popupSeverity={popupSeverityMalert} />
      {/* SUCCESS */}
      <AlertDialog openPopup={openPopup} handleClosePopup={handleClosePopup} popupContent={popupContent} popupSeverity={popupSeverity} />
    </Box>
  );
}

export default NewrateUpdate;