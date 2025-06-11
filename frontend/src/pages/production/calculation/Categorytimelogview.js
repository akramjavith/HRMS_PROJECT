import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, Grid, IconButton, List, ListItem, ListItemText, MenuItem, Paper, Popover, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import Switch from '@mui/material/Switch';
// import axios from "axios";
import axios from '../../../axiosInstance';

import * as FileSaver from 'file-saver';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment-timezone';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from 'react-icons/fa';
import { ThreeDots } from 'react-loader-spinner';
import { useParams, Link } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import * as XLSX from 'xlsx';
import AggregatedSearchBar from '../../../components/AggregatedSearchBar';
import AggridTable from '../../../components/AggridTable';
import { handleApiError } from '../../../components/Errorhandling';
import Headtitle from '../../../components/Headtitle';
import { AuthContext, UserRoleAccessContext } from '../../../context/Appcontext';
import { userStyle } from '../../../pageStyle';
import { SERVICE } from '../../../services/Baseservice';
import domtoimage from 'dom-to-image';
import ExportData from '../../../components/ExportData';
import MessageAlert from '../../../components/MessageAlert';

function CategoryTimeLogView() {
  let exportColumnNames = [
    'Company',
    'Branch',
    'Unit',
    'Team',
    'Process Code',
    'Name',
    'Emp Code',
    'From Date',
    'To Date',
    'Vendor Name',
    'Process',
    'Total Field',
    'Auto Error',
    'Manual Error',
    'Upload Error',
    'Moved',
    'Not Upload',
    'Penalty',
    'Non Penalty',
    'Bulk Upload',
    'Bulk Keying',
    'Edited1',
    'Edited2',
    'Edited3',
    'Edited4',
    'Reject1',
    'Reject2',
    'Reject3',
    'Reject4',
    'Not Validate',
    'Validate Error',
    'Waiver% Error',
    'Net Error',
    // 'Per%',
    'Percentage',
    'Amount',
    'Not Approved',
    'Client Amount',
    'Waiver Amount',
    'Total Amount',
  ];
  let exportRowValues = [
    'company',
    'branch',
    'unit',
    'team',
    'processcode',
    'name',
    'empcode',
    'fromdate',
    'todate',
    'vendorname',
    'process',
    'totalfield',
    'autoerror',
    'manualerror',
    'uploaderror',
    'moved',
    'notupload',
    'penalty',
    'nonpenalty',
    'bulkupload',
    'bulkkeying',
    'edited1',
    'edited2',
    'edited3',
    'edited4',
    'reject1',
    'reject2',
    'reject3',
    'reject4',
    'notvalidate',
    'validateerror',
    'waivererror',
    'neterror',
    // 'per',
    'percentage',
    'amount',
    'notapprovedcount',
    'clientamount',
    'waiveramount',
    'totalamount',
  ];

  let exportColumnNamesviewall = [
    'Company',
    'Branch',
    'Unit',
    'Team',
    'Process Code',
    'Name',
    'Emp Code',
    'From Date',
    'Vendor Name',
    'Process',
    'Total Field',
    'Auto Error',
    'Manual Error',
    'Upload Error',
    'Moved',
    'Not Upload',
    'Penalty',
    'Non Penalty',
    'Bulk Upload',
    'Bulk Keying',
    'Edited1',
    'Edited2',
    'Edited3',
    'Edited4',
    'Reject1',
    'Reject2',
    'Reject3',
    'Reject4',
    'Not Validate',
    'Validate Error',
    'Waiver% Error',
    'Net Error',
    //  'Per%',
    'Percentage',
    'Amount',
    'Not Approved',
    'Client Amount',
    'Waiver Amount',
    'Total Amount',
  ];
  let exportRowValuesviewall = [
    'company',
    'branch',
    'unit',
    'team',
    'processcode',
    'name',
    'empcode',
    'date',
    'vendorname',
    'process',
    'totalfield',
    'autoerror',
    'manualerror',
    'uploaderror',
    'moved',
    'notupload',
    'penalty',
    'nonpenalty',
    'bulkupload',
    'bulkkeying',
    'edited1',
    'edited2',
    'edited3',
    'edited4',
    'reject1',
    'reject2',
    'reject3',
    'reject4',
    'notvalidate',
    'validateerror',
    'waivererror',
    'neterror',
    // 'per',
    'percentage',
    'amount',
    'notapprovedcount',
    'clientamount',
    'waiveramount',
    'totalamount',
  ];
  const [clientUserIDFilterArray, setClientUserIDFilterArray] = useState([]);
  const [clientUserIDFilterArrayview, setClientUserIDFilterArrayview] = useState([]);
  const [clientUserIDFilterArrayviewcheck, setClientUserIDFilterArrayviewcheck] = useState(false);

  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState('');
  const [popupSeverityMalert, setPopupSeverityMalert] = useState('');
  const handleClickOpenPopupMalert = () => {
    setOpenPopupMalert(true);
  };
  const handleClosePopupMalert = () => {
    setOpenPopupMalert(false);
  };
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);

  const [filteredRowDataviewall, setFilteredRowDataviewall] = useState([]);
  const [filteredChangesviewall, setFilteredChangesviewall] = useState(null);

  const gridRef = useRef(null);
  const [isHandleChange, setIsHandleChange] = useState(false);
  const [searchedString, setSearchedString] = useState('');

  const [isHandleChangeviewall, setIsHandleChangeviewall] = useState(false);
  const [searchedStringviewall, setSearchedStringviewall] = useState('');

  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState('');
  const [searchQueryManageviewall, setSearchQueryManageviewall] = useState('');
  const [clientUserIDArray, setClientUserIDArray] = useState([]);
  const { isUserRoleCompare, buttonStyles, isUserRoleAccess, pageName, setPageName, isAssignBranch } = useContext(UserRoleAccessContext);
  const gridRefviewall = useRef(null);
  const { auth } = useContext(AuthContext);

  const [openviewAll, setOpenviewAll] = useState(false);
  const handleClickOpenviewAll = (e, reason) => {
    if (reason && reason === 'backdropClick') return;
    setOpenviewAll(true);
  };
  const handleCloseviewAll = () => {
    setOpenviewAll(false);
    setSearchQueryviewall('');
    setPageviewall(1);
    setColumnVisibilityviewall(initialColumnVisibilityviewall);
  };
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pageviewall, setPageviewall] = useState(1);
  const [pageSizeviewall, setPageSizeviewall] = useState(10);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };
  const [showAlert, setShowAlert] = useState();
  const [openview, setOpenview] = useState(false);
  const [openInfo, setOpeninfo] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [itemsviewall, setItemsviewall] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchQueryviewall, setSearchQueryviewall] = useState('');
  const [copiedData, setCopiedData] = useState('');
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [copiedDataviewall, setCopiedDataviewall] = useState('');
  const [isManageColumnsOpenviewall, setManageColumnsOpenviewall] = useState(false);
  const [anchorElviewall, setAnchorElviewall] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordEdit, setShowPasswordEdit] = useState(false);
  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    company: true,
    branch: true,
    unit: true,
    team: true,
    processcode: true,
    name: true,
    empcode: true,
    notapproved: true,
    clientamount: true,
    netamount: true,
    date: true,
    fromdate: true,
    todate: true,
    vendorname: true,
    process: true,
    totalfield: true,
    autoerror: true,
    manualerror: true,
    uploaderror: true,
    moved: true,
    notupload: true,
    penalty: true,
    nonpenalty: true,
    bulkupload: true,
    bulkkeying: true,
    edited1: true,
    edited2: true,
    edited3: true,
    edited4: true,
    reject1: true,
    reject1: true,
    reject2: true,
    reject3: true,
    reject4: true,
    notvalidate: true,
    validateerror: true,
    waivererror: true,
    neterror: true,
    per: true,
    percentage: true,
    amount: true,
    clientamount: true,
    waiveramount: true,
    totalamount: true,
    notapprovedcount: true,
    actions: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

  const initialColumnVisibilityviewall = {
    serialNumber: true,
    checkbox: true,
    company: true,
    branch: true,
    unit: true,
    notapproved: true,
    clientamount: true,
    netamount: true,
    team: true,
    processcode: true,
    name: true,
    fromdate: true,
    todate: true,
    empcode: true,
    date: true,
    vendorname: true,
    process: true,
    totalfield: true,
    autoerror: true,
    manualerror: true,
    uploaderror: true,
    moved: true,
    notupload: true,
    penalty: true,
    nonpenalty: true,
    bulkupload: true,
    bulkkeying: true,
    edited1: true,
    edited2: true,
    edited3: true,
    edited4: true,
    reject1: true,
    reject1: true,
    reject2: true,
    reject3: true,
    reject4: true,
    notvalidate: true,
    validateerror: true,
    waivererror: true,
    neterror: true,
    per: true,
    percentage: true,
    amount: true,
    clientamount: true,
    waiveramount: true,
    totalamount: true,
    notapprovedcount: true,
    actions: true,
  };
  const [columnVisibilityviewall, setColumnVisibilityviewall] = useState(initialColumnVisibilityviewall);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  const [isFilterOpenviewall, setIsFilterOpenviewall] = useState(false);
  const [isPdfFilterOpenviewall, setIsPdfFilterOpenviewall] = useState(false);

  // page refersh reload
  const handleCloseFilterModviewall = () => {
    setIsFilterOpenviewall(false);
  };

  const handleClosePdfFilterModviewall = () => {
    setIsPdfFilterOpenviewall(false);
  };

  //useEffect
  useEffect(() => {
    addSerialNumber(clientUserIDFilterArray);
  }, [clientUserIDFilterArray]);

  useEffect(() => {
    addSerialNumberviewall(clientUserIDFilterArrayview);
  }, [clientUserIDFilterArrayview]);

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener('beforeunload', beforeUnloadHandler);
    return () => {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
    };
  }, []);

  // page refersh reload password
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ''; // This is required for Chrome support
  };
  const username = isUserRoleAccess.username;
  // Manage Columns
  const handleOpenManageColumns = (event) => {
    setAnchorEl(event.currentTarget);
    setManageColumnsOpen(true);
  };
  const handleCloseManageColumns = () => {
    setManageColumnsOpen(false);
    setSearchQueryManage('');
  };

  // Manage Columns
  const handleOpenManageColumnsviewall = (event) => {
    setAnchorElviewall(event.currentTarget);
    setManageColumnsOpenviewall(true);
  };
  const handleCloseManageColumnsviewall = () => {
    setManageColumnsOpenviewall(false);
    setSearchQueryManageviewall('');
  };

  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

  const handleCloseModalert = () => {
    setIsDeleteOpenalert(false);
  };
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const openviewall = Boolean(anchorElviewall);
  const idviewall = openviewall ? 'simple-popover' : undefined;

  const getRowClassName = (params) => {
    if (selectedRows.includes(params.row.id)) {
      return 'custom-id-row'; // This is the custom class for rows with item.tat === 'ago'
    }
    return ''; // Return an empty string for other rows
  };

  //Edit model...
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === 'backdropClick') return;
    setIsEditOpen(false);
  };

  const ids = useParams().id;
  //get all client user id.
  const [loading, setLoading] = useState(false);
  const accessbranch = isUserRoleAccess?.role?.includes('Manager')
    ? isAssignBranch?.map((data) => ({
        branch: data.branch,
        company: data.company,
        unit: data.unit,
      }))
    : isAssignBranch
        ?.filter((data) => {
          let fetfinalurl = [];

          if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.mainpagenameurl?.length !== 0 && data?.subpagenameurl?.length !== 0 && data?.subsubpagenameurl?.length !== 0) {
            fetfinalurl = data.subsubpagenameurl;
          } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.mainpagenameurl?.length !== 0 && data?.subpagenameurl?.length !== 0) {
            fetfinalurl = data.subpagenameurl;
          } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.mainpagenameurl?.length !== 0) {
            fetfinalurl = data.mainpagenameurl;
          } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0) {
            fetfinalurl = data.submodulenameurl;
          } else if (data?.modulenameurl?.length !== 0) {
            fetfinalurl = data.modulenameurl;
          } else {
            fetfinalurl = [];
          }

          // Check if the pathname exists in the URL
          return fetfinalurl?.includes(window.location.pathname);
        })
        ?.map((data) => ({
          branch: data.branch,
          company: data.company,
          unit: data.unit,
        }));

  const fetchProductionListsArray = async () => {
    setLoading(true);
    setPageName(!pageName);
    try {
      const res_freq = await axios.get(`${SERVICE.PENALTYAMOUNTCONSOLIDATED_SINGLE}/${ids}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const res = await axios.post(
        `${SERVICE.PENALTY_AMOUNT_CONSOLIDATED_VIEW}`,
        {
          fromdate: res_freq.data.spenaltyamountconsolidate.fromdate,
          todate: res_freq.data.spenaltyamountconsolidate.todate,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );

      const final = res?.data?.penaltymonth?.map((item, index) => ({
        ...item,
        serialNumber: index + 1,
        fromdate: moment(item.fromdate).format('DD-MM-YYYY'),
        todate: moment(item.todate).format('DD-MM-YYYY'),
        oldfromdate: item.fromdate,
        oldtodate: item.todate,
        waiveramount: item.amountclient?.toFixed(2) || 0.0,
        totalamount: (item.clientamount - item.amountclient).toFixed(2) || 0.0,
      }));

      setClientUserIDFilterArray(final);
      setLoading(false);
    } catch (err) {
      handleApiError(err, setLoading(false), setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    fetchProductionListsArray();
  }, []);

  const gridRefTableImg = useRef(null);
  const gridRefTableImgviewall = useRef(null);
  // image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage
        .toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, 'Category TimeLog View.png');
        })
        .catch((error) => {
          console.error('dom-to-image error: ', error);
        });
    }
  };

  const handleCaptureImageviewall = () => {
    if (gridRefTableImgviewall.current) {
      domtoimage
        .toBlob(gridRefTableImgviewall.current)
        .then((blob) => {
          saveAs(blob, 'Category TimeLog View Individual.png');
        })
        .catch((error) => {
          console.error('dom-to-image error: ', error);
        });
    }
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Penalty Amount Consolidated View',
    pageStyle: 'print',
  });

  const componentRefviewall = useRef();
  const handleprintviewall = useReactToPrint({
    content: () => componentRefviewall.current,
    documentTitle: 'Penalty Amount Consolidated View',
    pageStyle: 'print',
  });

  //serial no for listing items
  const addSerialNumber = (datas) => {
    const itemsWithSerialNumber = datas;
    setItems(itemsWithSerialNumber);
  };

  //serial no for listing items
  const addSerialNumberviewall = (datas) => {
    const itemsWithSerialNumber = datas;
    setItemsviewall(itemsWithSerialNumber);
  };
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
    setPage(1);
  };

  // Split the search query into individual terms
  const searchTerms = searchQuery.toLowerCase().split(' ');

  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchTerms.every((term) => Object.values(item).join(' ').toLowerCase().includes(term));
  });

  const filteredData = filteredDatas?.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filteredDatas?.length / pageSize);
  const visiblePages = Math.min(totalPages, 3);
  const firstVisiblePage = Math.max(1, page - 1);
  const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);
  const pageNumbers = [];
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
    // {
    //     field: "checkbox",
    //     headerName: "Checkbox",
    //     headerStyle: {
    //         fontWeight: "bold", // Apply the font-weight style to make the header text bold
    //         // Add any other CSS styles as needed
    //     },

    //     sortable: false, // Optionally, you can make this column not sortable
    //     width: 50,
    //     hide: !columnVisibility.checkbox,
    //     headerClassName: "bold-header",
    //     headerCheckboxSelection: true,
    //     checkboxSelection: true,
    //     pinned: 'left',
    //     lockPinned: true,
    // },
    {
      field: 'serialNumber',
      headerName: 'SNo',
      flex: 0,
      width: 90,
      hide: !columnVisibility.serialNumber,
      headerClassName: 'bold-header',
      pinned: 'left',
    },
    {
      field: 'company',
      headerName: 'Name',
      flex: 0,
      width: 150,
      hide: !columnVisibility.company,
      headerClassName: 'bold-header',
      pinned: 'left',
    },
    {
      field: 'branch',
      headerName: 'Start Date',
      flex: 0,
      width: 150,
      hide: !columnVisibility.branch,
      headerClassName: 'bold-header',
    },
    {
      field: 'unit',
      headerName: 'End Date',
      flex: 0,
      width: 150,
      hide: !columnVisibility.unit,
      headerClassName: 'bold-header',
    },
    {
      field: 'team',
      headerName: 'Category',
      flex: 0,
      width: 190,
      hide: !columnVisibility.team,
      headerClassName: 'bold-header',
    },
    {
      field: 'processcode',
      headerName: 'Sub Category',
      flex: 0,
      width: 195,
      hide: !columnVisibility.processcode,
      headerClassName: 'bold-header',
    },
    {
      field: 'name',
      headerName: 'Count',
      flex: 0,
      width: 150,
      hide: !columnVisibility.name,
      headerClassName: 'bold-header',
    },
    {
      field: 'empcode',
      headerName: 'Allot Hours',
      flex: 0,
      width: 150,
      hide: !columnVisibility.empcode,
      headerClassName: 'bold-header',
    },
   
    // {
    //   field: 'actions',
    //   headerName: 'Action',
    //   flex: 0,
    //   width: 250,
    //   minHeight: '40px !important',
    //   sortable: false,
    //   hide: !columnVisibility.actions,
    //   headerClassName: 'bold-header',
    //   cellRenderer: (params) => (
    //     <Grid sx={{ display: 'flex' }}>
    //       {isUserRoleCompare?.includes('vpenaltyamountconsolidate') && (
    //         <Button
    //           sx={userStyle.buttonedit}
    //           onClick={() => {
    //             rowdatasingleview(params.data.id, params.data);
    //           }}
    //         >
    //           <VisibilityOutlinedIcon style={{ fontsize: 'large' }} sx={buttonStyles.buttonview} />
    //         </Button>
    //       )}
    //     </Grid>
    //   ),
    // },
  ];

  const rowDataTable = filteredData.map((item, index) => {
    return {
      ...item,
      id: item.serialNumber,
      serialNumber: item.serialNumber,
      company: item.company,
      branch: item.branch,
      unit: item.unit,
      team: item.team,
      processcode: item.processcode,
      name: item.name,
      empcode: item.empcode,
      date: moment(item.date).format('DD-MM-YYYY'),
      vendorname: item.vendorname,
      fromdate: item.fromdate,
      todate: item.todate,
      oldfromdate: item.oldfromdate,
      oldtodate: item.oldtodate,
      process: item.process,
      totalfield: item.totalfield,
      autoerror: item.autoerror,
      manualerror: item.manualerror,
      uploaderror: item.uploaderror,
      moved: item.moved,
      notupload: item.notupload,
      penalty: item.penalty,
      nonpenalty: item.nonpenalty,
      bulkupload: item.bulkupload,
      bulkkeying: item.bulkkeying,
      edited1: item.edited1,
      edited2: item.edited2,
      edited3: item.edited3,
      edited4: item.edited4,
      reject1: item.reject1,
      reject2: item.reject2,
      reject3: item.reject3,
      reject4: item.reject4,
      notvalidate: item.notvalidate,
      validateerror: item.validateerror,
      waivererror: item.waivererror,
      neterror: item.neterror,
      per: item.per,
      percentage: item.percentage,
      amount: item.amount,
      clientamount: item?.clientamount,
      netamount: item?.netamount,
      notapproved: item?.notapproved,
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
  // Function to filter columns based on search query
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
    <Box
      style={{
        padding: '10px',
        minWidth: '325px',
        '& .MuiDialogContent-root': { padding: '10px 0' },
      }}
    >
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
              <ListItemText sx={{ display: 'flex' }} primary={<Switch sx={{ marginTop: '-5px' }} size="small" checked={columnVisibility[column.field]} onChange={() => toggleColumnVisibility(column.field)} />} secondary={column.field === 'checkbox' ? 'Checkbox' : column.headerName} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Grid container>
          <Grid item md={4}>
            <Button variant="text" sx={{ textTransform: 'none' }} onClick={() => setColumnVisibility(initialColumnVisibility)}>
              {' '}
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
              {' '}
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );

  const [fileFormat, setFormat] = useState('');

  //view alltable
  //Datatable
  const handlePageChangeviewall = (newPage) => {
    setPageviewall(newPage);
    setSelectedRows([]);
    setSelectAllCheckedviewall(false);
  };
  const handlePageSizeChangeviewall = (event) => {
    setPageSizeviewall(Number(event.target.value));
    setSelectedRows([]);
    setSelectAllCheckedviewall(false);
    setPageviewall(1);
  };
  //datatable....
  const handleSearchChangeviewall = (event) => {
    setSearchQueryviewall(event.target.value);
    setPageviewall(1);
  };

  // Split the search query into individual terms
  const searchTermsviewall = searchQueryviewall.toLowerCase().split(' ');

  // Modify the filtering logic to check each term
  const filteredDatasviewall = itemsviewall?.filter((item) => {
    return searchTermsviewall.every((term) => Object.values(item).join(' ').toLowerCase().includes(term));
  });

  const filteredDataviewall = filteredDatasviewall?.slice((pageviewall - 1) * pageSizeviewall, pageviewall * pageSizeviewall);
  const totalPagesviewall = Math.ceil(filteredDatasviewall?.length / pageSizeviewall);
  console.log(totalPagesviewall, 'totalPagesviewall');
  const visiblePagesviewall = Math.min(totalPagesviewall, 3);
  const firstVisiblePageviewall = Math.max(1, pageviewall - 1);
  const lastVisiblePageviewall = Math.min(firstVisiblePageviewall + visiblePagesviewall - 1, totalPagesviewall);
  const pageNumbersviewall = [];
  for (let i = firstVisiblePageviewall; i <= lastVisiblePageviewall; i++) {
    pageNumbersviewall.push(i);
  }

  const [selectAllCheckedviewall, setSelectAllCheckedviewall] = useState(false);
  const CheckboxHeaderviewall = ({ selectAllCheckedviewall, onSelectAllviewall }) => (
    <div>
      <Checkbox checked={selectAllCheckedviewall} onChange={onSelectAllviewall} />
    </div>
  );
  const columnDataTableviewall = [
    // {
    //     field: "checkbox",
    //     headerName: "Checkbox",
    //     headerStyle: {
    //         fontWeight: "bold", // Apply the font-weight style to make the header text bold
    //         // Add any other CSS styles as needed
    //     },

    //     sortable: false, // Optionally, you can make this column not sortable
    //     width: 50,
    //     hide: !columnVisibilityviewall.checkbox,
    //     headerClassName: "bold-header",
    //     headerCheckboxSelection: true,
    //     checkboxSelection: true,
    //     pinned: 'left',
    //     lockPinned: true,
    // },
    {
      field: 'serialNumber',
      headerName: 'SNo',
      flex: 0,
      width: 80,
      hide: !columnVisibility.serialNumber,
      headerClassName: 'bold-header',
      pinned: 'left',
    },
    {
      field: 'company',
      headerName: 'Company',
      flex: 0,
      width: 100,
      hide: !columnVisibilityviewall.company,
      headerClassName: 'bold-header',
      pinned: 'left',
    },
    {
      field: 'branch',
      headerName: 'Branch',
      flex: 0,
      width: 120,
      hide: !columnVisibilityviewall.branch,
      headerClassName: 'bold-header',
    },
    {
      field: 'unit',
      headerName: 'Unit',
      flex: 0,
      width: 120,
      hide: !columnVisibilityviewall.unit,
      headerClassName: 'bold-header',
    },
    {
      field: 'team',
      headerName: 'Team',
      flex: 0,
      width: 120,
      hide: !columnVisibilityviewall.team,
      headerClassName: 'bold-header',
    },
    {
      field: 'processcode',
      headerName: 'Process Code',
      flex: 0,
      width: 120,
      hide: !columnVisibilityviewall.processcode,
      headerClassName: 'bold-header',
    },
    {
      field: 'name',
      headerName: 'Name',
      flex: 0,
      width: 120,
      hide: !columnVisibilityviewall.name,
      headerClassName: 'bold-header',
    },
    {
      field: 'empcode',
      headerName: 'Emp Code',
      flex: 0,
      width: 120,
      hide: !columnVisibilityviewall.empcode,
      headerClassName: 'bold-header',
    },
    {
      field: 'date',
      headerName: 'Date',
      flex: 0,
      width: 100,
      hide: !columnVisibilityviewall.date,
      headerClassName: 'bold-header',
    },

    {
      field: 'vendorname',
      headerName: 'Vendor Name',
      flex: 0,
      width: 100,
      hide: !columnVisibilityviewall.vendorname,
      headerClassName: 'bold-header',
    },
    {
      field: 'process',
      headerName: 'Process',
      flex: 0,
      width: 100,
      hide: !columnVisibilityviewall.process,
      headerClassName: 'bold-header',
    },
    {
      field: 'totalfield',
      headerName: 'Total Field',
      flex: 0,
      width: 100,
      hide: !columnVisibilityviewall.totalfield,
      headerClassName: 'bold-header',
    },
    {
      field: 'autoerror',
      headerName: 'Auto Error',
      flex: 0,
      width: 100,
      hide: !columnVisibilityviewall.autoerror,
      headerClassName: 'bold-header',
    },
    {
      field: 'manualerror',
      headerName: 'Manual Error',
      flex: 0,
      width: 100,
      hide: !columnVisibilityviewall.manualerror,
      headerClassName: 'bold-header',
    },
    {
      field: 'uploaderror',
      headerName: 'Upload Error',
      flex: 0,
      width: 100,
      hide: !columnVisibilityviewall.uploaderror,
      headerClassName: 'bold-header',
    },
    {
      field: 'moved',
      headerName: 'Moved',
      flex: 0,
      width: 100,
      hide: !columnVisibilityviewall.moved,
      headerClassName: 'bold-header',
    },
    {
      field: 'notupload',
      headerName: 'Not Upload',
      flex: 0,
      width: 100,
      hide: !columnVisibilityviewall.notupload,
      headerClassName: 'bold-header',
    },
    {
      field: 'penalty',
      headerName: 'Penalty',
      flex: 0,
      width: 100,
      hide: !columnVisibilityviewall.penalty,
      headerClassName: 'bold-header',
    },
    {
      field: 'nonpenalty',
      headerName: 'Non Penalty',
      flex: 0,
      width: 100,
      hide: !columnVisibilityviewall.nonpenalty,
      headerClassName: 'bold-header',
    },
    {
      field: 'bulkupload',
      headerName: 'Bulk Upload',
      flex: 0,
      width: 100,
      hide: !columnVisibilityviewall.bulkupload,
      headerClassName: 'bold-header',
    },
    {
      field: 'bulkkeying',
      headerName: 'Bulk Keying',
      flex: 0,
      width: 100,
      hide: !columnVisibilityviewall.bulkkeying,
      headerClassName: 'bold-header',
    },
    {
      field: 'edited1',
      headerName: 'Edited1',
      flex: 0,
      width: 100,
      hide: !columnVisibilityviewall.edited1,
      headerClassName: 'bold-header',
    },
    {
      field: 'edited2',
      headerName: 'Edited2',
      flex: 0,
      width: 100,
      hide: !columnVisibilityviewall.edited2,
      headerClassName: 'bold-header',
    },
    {
      field: 'edited3',
      headerName: 'Edited3',
      flex: 0,
      width: 100,
      hide: !columnVisibilityviewall.edited3,
      headerClassName: 'bold-header',
    },
    {
      field: 'edited4',
      headerName: 'Edited4',
      flex: 0,
      width: 100,
      hide: !columnVisibilityviewall.edited4,
      headerClassName: 'bold-header',
    },
    {
      field: 'reject1',
      headerName: 'Reject1',
      flex: 0,
      width: 100,
      hide: !columnVisibilityviewall.reject1,
      headerClassName: 'bold-header',
    },
    {
      field: 'reject2',
      headerName: 'Reject2',
      flex: 0,
      width: 100,
      hide: !columnVisibilityviewall.reject2,
      headerClassName: 'bold-header',
    },
    {
      field: 'reject3',
      headerName: 'Reject3',
      flex: 0,
      width: 100,
      hide: !columnVisibilityviewall.reject3,
      headerClassName: 'bold-header',
    },
    {
      field: 'reject4',
      headerName: 'Reject4',
      flex: 0,
      width: 100,
      hide: !columnVisibilityviewall.reject4,
      headerClassName: 'bold-header',
    },
    {
      field: 'notvalidate',
      headerName: 'Not Validate',
      flex: 0,
      width: 100,
      hide: !columnVisibilityviewall.notvalidate,
      headerClassName: 'bold-header',
    },
    {
      field: 'validateerror',
      headerName: 'Validate Error',
      flex: 0,
      width: 100,
      hide: !columnVisibilityviewall.validateerror,
      headerClassName: 'bold-header',
    },
    {
      field: 'waivererror',
      headerName: 'Waiver% Error',
      flex: 0,
      width: 100,
      hide: !columnVisibilityviewall.waivererror,
      headerClassName: 'bold-header',
    },
    {
      field: 'neterror',
      headerName: 'Net Error',
      flex: 0,
      width: 100,
      hide: !columnVisibilityviewall.neterror,
      headerClassName: 'bold-header',
    },
    // {
    //     field: "per",
    //     headerName: "Per%",
    //     flex: 0,
    //     width: 100,
    //     hide: !columnVisibilityviewall.per,
    //     headerClassName: "bold-header",
    // },
    {
      field: 'percentage',
      headerName: 'Percentage',
      flex: 0,
      width: 100,
      hide: !columnVisibilityviewall.percentage,
      headerClassName: 'bold-header',
    },
    {
      field: 'amount',
      headerName: 'Amount',
      flex: 0,
      width: 100,
      hide: !columnVisibilityviewall.amount,
      headerClassName: 'bold-header',
    },

    {
      field: 'notapprovedcount',
      headerName: 'Not Approved',
      flex: 0,
      width: 120,
      hide: !columnVisibility.notapprovedcount,
      headerClassName: 'bold-header',
    },
    { field: 'clientamount', headerName: 'Client Amount', flex: 0, width: 130, hide: !columnVisibility.clientamount },
    { field: 'waiveramount', headerName: 'Waiver Amount', flex: 0, width: 130, hide: !columnVisibility.waiveramount },
    { field: 'totalamount', headerName: 'Total Amount', flex: 0, width: 120, hide: !columnVisibility.totalamount },
  ];

  const rowDataTableviewall = filteredDataviewall.map((item, index) => {
    return {
      ...item,
      id: item.serialNumber,
      serialNumber: item.serialNumber,
      company: item.company,
      branch: item.branch,
      unit: item.unit,
      team: item.team,
      processcode: item.processcode,
      name: item.name,
      empcode: item.empcode,
      date: item.date,
      vendorname: item.vendorname,
      process: item.process,
      totalfield: item.totalfield,
      autoerror: item.autoerror,
      manualerror: item.manualerror,
      uploaderror: item.uploaderror,
      moved: item.moved,
      notupload: item.notupload,
      penalty: item.penalty,
      nonpenalty: item.nonpenalty,
      bulkupload: item.bulkupload,
      bulkkeying: item.bulkkeying,
      edited1: item.edited1,
      edited2: item.edited2,
      edited3: item.edited3,
      edited4: item.edited4,
      reject1: item.reject1,
      reject2: item.reject2,
      reject3: item.reject3,
      reject4: item.reject4,
      notvalidate: item.notvalidate,
      validateerror: item.validateerror,
      waivererror: item.waivererror,
      neterror: item.neterror,
      per: item.per,
      percentage: item.percentage,
      amount: item.amount,
      clientamount: item?.clientamount,
      netamount: item?.netamount,
      notapproved: item?.notapproved,
    };
  });
  const rowsWithCheckboxesviewall = rowDataTableviewall.map((row) => ({
    ...row,
    // Create a custom field for rendering the checkbox
    checkbox: selectedRows.includes(row.id),
  }));
  // Show All Columns functionality
  const handleShowAllColumnsviewall = () => {
    const updatedVisibilityviewall = { ...columnVisibilityviewall };
    for (const columnKey in updatedVisibilityviewall) {
      updatedVisibilityviewall[columnKey] = true;
    }
    setColumnVisibilityviewall(updatedVisibilityviewall);
  };
  // Function to filter columns based on search query
  const filteredColumnsviewall = columnDataTableviewall.filter((column) => column.headerName.toLowerCase().includes(searchQueryManageviewall.toLowerCase()));
  // Manage Columns functionality
  const toggleColumnVisibilityviewall = (field) => {
    setColumnVisibilityviewall((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };
  // JSX for the "Manage Columns" popover content
  const manageColumnsContentviewall = (
    <Box
      style={{
        padding: '10px',
        minWidth: '325px',
        '& .MuiDialogContent-root': { padding: '10px 0' },
      }}
    >
      <Typography variant="h6">Manage Columns</Typography>
      <IconButton
        aria-label="close"
        onClick={handleCloseManageColumnsviewall}
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
        <TextField label="Find column" variant="standard" fullWidth value={searchQueryManageviewall} onChange={(e) => setSearchQueryManageviewall(e.target.value)} sx={{ marginBottom: 5, position: 'absolute' }} />
      </Box>
      <br />
      <br />
      <DialogContent sx={{ minWidth: 'auto', height: '200px', position: 'relative' }}>
        <List sx={{ overflow: 'auto', height: '100%' }}>
          {filteredColumnsviewall.map((column) => (
            <ListItem key={column.field}>
              <ListItemText sx={{ display: 'flex' }} primary={<Switch sx={{ marginTop: '-5px' }} size="small" checked={columnVisibilityviewall[column.field]} onChange={() => toggleColumnVisibilityviewall(column.field)} />} secondary={column.field === 'checkbox' ? 'Checkbox' : column.headerName} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Grid container>
          <Grid item md={4}>
            <Button variant="text" sx={{ textTransform: 'none' }} onClick={() => setColumnVisibilityviewall(initialColumnVisibilityviewall)}>
              {' '}
              Show All
            </Button>
          </Grid>
          <Grid item md={4}></Grid>
          <Grid item md={4}>
            <Button
              variant="text"
              sx={{ textTransform: 'none' }}
              onClick={() => {
                const newColumnVisibilityviewall = {};
                columnDataTableviewall.forEach((column) => {
                  newColumnVisibilityviewall[column.field] = false; // Set hide property to true
                });
                setColumnVisibilityviewall(newColumnVisibilityviewall);
              }}
            >
              {' '}
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );

  const rowdatasingleview = async (id, data) => {
    console.log(data, 'data');
    setPageName(!pageName);
    setClientUserIDFilterArrayviewcheck(true);
    try {
      const res = await axios.post(
        `${SERVICE.PENALTY_AMOUNT_CONSOLIDATED_VIEW_INDIVIDUAL}`,
        {
          fromdate: data.oldfromdate,
          todate: data.oldtodate,
          name: data.name,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );

      setClientUserIDFilterArrayview(
        res?.data?.penaltymonth?.map((item, index) => ({
          ...item,
          serialNumber: index + 1,
          fromdate: moment(item.fromdate).format('DD-MM-YYYY'),
          todate: moment(item.todate).format('DD-MM-YYYY'),
          date: moment(item.date).format('DD-MM-YYYY'),
          waiveramount: Number(Number(item.amountclient)?.toFixed(2)) || 0.0,
          totalamount: Number(Number(item.clientamount - item.amountclient).toFixed(2)) || 0.0,
        }))
      );
      handleClickOpenviewAll();
      setClientUserIDFilterArrayviewcheck(false);
    } catch (err) {
      handleApiError(err, setClientUserIDFilterArrayviewcheck(false), setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  console.log(clientUserIDFilterArrayview, 'clientUserIDFilterArrayview');
  return (
    <Box>
      <Headtitle title={'Category TimeLog View'} />
      {/* ****** Header Content ****** */}
      <Typography sx={userStyle.HeaderText}>Category TimeLog View</Typography>
      <br /> <br />
      {/* ****** Table Start ****** */}
      {!clientUserIDArray ? (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
          </Box>
        </>
      ) : (
        <>
          {isUserRoleCompare?.includes('lpenaltyamountconsolidate') && (
            <>
              <Box sx={userStyle.container}>
                {/* ******************************************************EXPORT Buttons****************************************************** */}
                <Grid container>
                  <Grid item xs={8}>
                    <Typography sx={userStyle.importheadtext}>Category TimeLog View List</Typography>
                  </Grid>

                  <Grid item md={2} xs={12} sm={12}>
                    <Link to={`/production/categorytimelog`}>
                      <Button variant="contained" color="primary">
                        BACK
                      </Button>
                    </Link>
                  </Grid>
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
                        <MenuItem value={clientUserIDArray?.length}>All</MenuItem>
                      </Select>
                    </Box>
                  </Grid>
                  <Grid
                    item
                    md={8}
                    xs={12}
                    sm={12}
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Box>
                      {isUserRoleCompare?.includes('excelpenaltyamountconsolidate') && (
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
                      {isUserRoleCompare?.includes('csvpenaltyamountconsolidate') && (
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
                      {isUserRoleCompare?.includes('printpenaltyamountconsolidate') && (
                        <>
                          <Button sx={userStyle.buttongrp} onClick={handleprint}>
                            &ensp;
                            <FaPrint />
                            &ensp;Print&ensp;
                          </Button>
                        </>
                      )}
                      {isUserRoleCompare?.includes('pdfpenaltyamountconsolidate') && (
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
                      {isUserRoleCompare?.includes('imagepenaltyamountconsolidate') && (
                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                          {' '}
                          <ImageIcon sx={{ fontSize: '15px' }} /> &ensp;Image&ensp;{' '}
                        </Button>
                      )}
                    </Box>
                  </Grid>
                  <Grid item md={2} xs={12} sm={12}>
                    <AggregatedSearchBar
                      columnDataTable={columnDataTable}
                      setItems={setItems}
                      addSerialNumber={addSerialNumber}
                      setPage={setPage}
                      maindatas={clientUserIDFilterArray}
                      setSearchedString={setSearchedString}
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                      paginated={false}
                      totalDatas={clientUserIDFilterArray}
                    />
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
                <br />
                <br />
                {loading ? (
                  <>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                    </Box>
                  </>
                ) : (
                  <>
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
                      gridRefTable={gridRef}
                      paginated={false}
                      filteredDatas={filteredDatas}
                      handleShowAllColumns={handleShowAllColumns}
                      setFilteredRowData={setFilteredRowData}
                      filteredRowData={filteredRowData}
                      setFilteredChanges={setFilteredChanges}
                      filteredChanges={filteredChanges}
                      gridRefTableImg={gridRefTableImg}
                      itemsList={clientUserIDFilterArray}
                    />
                  </>
                )}
              </Box>
            </>
          )}
          {/* ****** Table End ****** */}
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
        </>
      )}
      {/* print layout */}
      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRef}>
          <TableHead>
            <TableRow>
              <TableCell> SI.No</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Branch</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Team</TableCell>
              <TableCell>Process Code</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Emp Code</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Vendor Name</TableCell>
              <TableCell>Total Field</TableCell>
              <TableCell>Auto Error</TableCell>
              <TableCell>Manual Error</TableCell>
              <TableCell>Upload Error</TableCell>
              <TableCell>Moved</TableCell>
              <TableCell>Not Upload</TableCell>
              <TableCell>Penalty</TableCell>
              <TableCell>Non Penalty</TableCell>
              <TableCell>Bulk Upload</TableCell>
              <TableCell>Bulk Keying</TableCell>
              <TableCell>Edited1</TableCell>
              <TableCell>Edited2</TableCell>
              <TableCell>Edited3</TableCell>
              <TableCell>Edited4</TableCell>
              <TableCell>Reject1</TableCell>
              <TableCell>Reject2</TableCell>
              <TableCell>Reject3</TableCell>
              <TableCell>Reject4</TableCell>
              <TableCell>Not Validate</TableCell>
              <TableCell>Validate Error</TableCell>
              <TableCell>Waiver% Error</TableCell>
              <TableCell>Net Error</TableCell>
              <TableCell>Per%</TableCell>
              <TableCell>Percentage</TableCell>
              <TableCell>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody align="left">
            {filteredData &&
              filteredData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.company}</TableCell>
                  <TableCell>{row.branch}</TableCell>
                  <TableCell>{row.unit}</TableCell>
                  <TableCell>{row.team}</TableCell>
                  <TableCell>{row.processcode}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.empcode}</TableCell>
                  <TableCell>{moment(row.date).format('DD-MM-YYYY')}</TableCell>
                  <TableCell>{row.vendorname}</TableCell>
                  <TableCell>{row.process}</TableCell>
                  <TableCell>{row.totalfield}</TableCell>
                  <TableCell>{row.autoerror}</TableCell>
                  <TableCell>{row.manualerror}</TableCell>
                  <TableCell>{row.uploaderror}</TableCell>
                  <TableCell>{row.moved}</TableCell>
                  <TableCell>{row.penalty}</TableCell>
                  <TableCell>{row.nonpenalty}</TableCell>
                  <TableCell>{row.bulkupload}</TableCell>
                  <TableCell>{row.bulkkeying}</TableCell>
                  <TableCell>{row.edited1}</TableCell>
                  <TableCell>{row.edited2}</TableCell>
                  <TableCell>{row.edited3}</TableCell>
                  <TableCell>{row.edited4}</TableCell>
                  <TableCell>{row.reject1}</TableCell>
                  <TableCell>{row.reject2}</TableCell>
                  <TableCell>{row.reject3}</TableCell>
                  <TableCell>{row.reject4}</TableCell>
                  <TableCell>{row.notvalidate}</TableCell>
                  <TableCell>{row.validateerror}</TableCell>
                  <TableCell>{row.waivererror}</TableCell>
                  <TableCell>{row.neterror}</TableCell>
                  <TableCell>{row.per}</TableCell>
                  <TableCell>{row.percentage}</TableCell>
                  <TableCell>{row.amount}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openviewAll} onClose={handleClickOpenviewAll} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" fullWidth={true} maxWidth="lg" sx={{ marginTop: '50px' }}>
        <DialogContent sx={{ marginTop: '70px' }}>
          <>
            <Typography sx={userStyle.HeaderText}>{'Penalty Amount Consolidated Individual User'}</Typography>
            {/* <br /> */}
            <Grid container style={userStyle.dataTablestyle}>
              <Grid item md={2} xs={12} sm={12}>
                <Box>
                  <label>Show entries:</label>
                  <Select
                    id="pageSizeSelect"
                    value={pageSizeviewall}
                    size="small"
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 180,
                          width: 80,
                        },
                      },
                    }}
                    onChange={handlePageSizeChangeviewall}
                    sx={{ width: '77px' }}
                  >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                    <MenuItem value={clientUserIDFilterArrayview?.length}>All</MenuItem>
                  </Select>
                </Box>
              </Grid>
              <Grid
                item
                md={8}
                xs={12}
                sm={12}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Box>
                  {isUserRoleCompare?.includes('excelpenaltyamountconsolidate') && (
                    <>
                      <Button
                        onClick={(e) => {
                          setIsFilterOpenviewall(true);
                          setFormat('xl');
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileExcel />
                        &ensp;Export to Excel&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes('csvpenaltyamountconsolidate') && (
                    <>
                      <Button
                        onClick={(e) => {
                          setIsFilterOpenviewall(true);
                          setFormat('csv');
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileCsv />
                        &ensp;Export to CSV&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes('printpenaltyamountconsolidate') && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprintviewall}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes('pdfpenaltyamountconsolidate') && (
                    <>
                      <Button
                        sx={userStyle.buttongrp}
                        onClick={() => {
                          setIsPdfFilterOpenviewall(true);
                        }}
                      >
                        <FaFilePdf />
                        &ensp;Export to PDF&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes('imagepenaltyamountconsolidate') && (
                    <Button sx={userStyle.buttongrp} onClick={handleCaptureImageviewall}>
                      {' '}
                      <ImageIcon sx={{ fontSize: '15px' }} /> &ensp;Image&ensp;{' '}
                    </Button>
                  )}
                </Box>
              </Grid>
              <Grid item md={2} xs={6} sm={6}>
                <AggregatedSearchBar
                  columnDataTable={columnDataTableviewall}
                  setItems={setItemsviewall}
                  addSerialNumber={addSerialNumberviewall}
                  setPage={setPageviewall}
                  maindatas={clientUserIDFilterArrayview}
                  setSearchedString={setSearchedStringviewall}
                  searchQuery={searchQueryviewall}
                  setSearchQuery={setSearchQueryviewall}
                  paginated={false}
                  totalDatas={clientUserIDFilterArrayview}
                />
              </Grid>
            </Grid>
            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumnsviewall}>
              Show All Columns
            </Button>
            &ensp;
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsviewall}>
              Manage Columns
            </Button>
            <br />
            <br></br>
            {/* Manage Column */}
            <Popover
              id={idviewall}
              open={isManageColumnsOpenviewall}
              anchorEl={anchorElviewall}
              onClose={handleCloseManageColumnsviewall}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              {manageColumnsContentviewall}
            </Popover>
            {/* <br /> */}
            {clientUserIDFilterArrayviewcheck ? (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                </Box>
              </>
            ) : (
              <>
                <AggridTable
                  rowDataTable={rowDataTableviewall}
                  columnDataTable={columnDataTableviewall}
                  columnVisibility={columnVisibilityviewall}
                  page={pageviewall}
                  setPage={setPageviewall}
                  pageSize={pageSizeviewall}
                  totalPages={totalPagesviewall}
                  setColumnVisibility={setColumnVisibilityviewall}
                  isHandleChange={isHandleChangeviewall}
                  items={itemsviewall}
                  selectedRows={selectedRows}
                  setSelectedRows={setSelectedRows}
                  gridRefTable={gridRefviewall}
                  filteredDatas={filteredDatasviewall}
                  handleShowAllColumns={handleShowAllColumnsviewall}
                  paginated={false}
                  setFilteredRowData={setFilteredRowDataviewall}
                  filteredRowData={filteredRowDataviewall}
                  setFilteredChanges={setFilteredChangesviewall}
                  filteredChanges={filteredChangesviewall}
                  gridRefTableImg={gridRefTableImgviewall}
                  itemsList={clientUserIDFilterArrayview}
                />
              </>
            )}
          </>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={handleCloseviewAll} sx={buttonStyles.btncancel}>
            Back
          </Button>
        </DialogActions>
      </Dialog>
      <ExportData
        isFilterOpen={isFilterOpen}
        handleCloseFilterMod={handleCloseFilterMod}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpen}
        isPdfFilterOpen={isPdfFilterOpen}
        setIsPdfFilterOpen={setIsPdfFilterOpen}
        handleClosePdfFilterMod={handleClosePdfFilterMod}
        filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
        itemsTwo={clientUserIDFilterArray ?? []}
        filename={'Penalty Amount Consolidated View'}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      <ExportData
        isFilterOpen={isFilterOpenviewall}
        handleCloseFilterMod={handleCloseFilterModviewall}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpenviewall}
        isPdfFilterOpen={isPdfFilterOpenviewall}
        setIsPdfFilterOpen={setIsPdfFilterOpenviewall}
        handleClosePdfFilterMod={handleClosePdfFilterModviewall}
        filteredDataTwo={(filteredChangesviewall !== null ? filteredRowDataviewall : rowDataTableviewall) ?? []}
        itemsTwo={clientUserIDFilterArrayview ?? []}
        filename={'Penalty Amount Consolidated View Individual Users'}
        exportColumnNames={exportColumnNamesviewall}
        exportRowValues={exportRowValuesviewall}
        componentRef={componentRefviewall}
      />
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
      <MessageAlert openPopup={openPopupMalert} handleClosePopup={handleClosePopupMalert} popupContent={popupContentMalert} popupSeverity={popupSeverityMalert} />
      {/* Bulk delete ALERT DIALOG */}
      <Dialog open={isDeleteOpenalert} onClose={handleCloseModalert} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: '70px', color: 'orange' }} />
          <Typography variant="h6" sx={{ color: 'black', textAlign: 'center' }}>
            Please Select any Row
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus variant="contained" color="error" onClick={handleCloseModalert}>
            {' '}
            OK{' '}
          </Button>
        </DialogActions>
      </Dialog>
      <Box></Box>
      <br />
    </Box>
  );
}

export default CategoryTimeLogView;
