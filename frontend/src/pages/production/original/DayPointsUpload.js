import React, { useState, useEffect, useRef, useContext } from 'react';
import { userStyle } from '../../../pageStyle';
import jsPDF from 'jspdf';
// import { DataGrid } from "@mui/x-data-grid";
import { saveAs } from 'file-saver';
// import { styled } from "@mui/system";
import moment from 'moment-timezone';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { FaDownload, FaTrash } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import { CsvBuilder } from 'filefy';
import CloseIcon from '@mui/icons-material/Close';
import Switch from '@mui/material/Switch';
import Alert from '@mui/material/Alert';
import { useReactToPrint } from 'react-to-print';
import { styled } from '@mui/system';
import SendToServer from '../../sendtoserver';
import StyledDataGrid from '../../../components/TableStyle';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { toast } from 'react-toastify';
import { FaPrint, FaFilePdf, FaFileExcel } from 'react-icons/fa';
// import { ExportXL, ExportCSV } from '../../../components/Export';
import { useNavigate, Link } from 'react-router-dom';
import Divider from '@mui/material/Divider';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import {
  Box,
  Typography,
  OutlinedInput,
  TableBody,
  TableRow,
  TableCell,
  Select,
  Paper,
  MenuItem,
  Dialog,
  DialogContent,
  DialogActions,
  FormControl,
  Grid,
  Table,
  TableHead,
  TableContainer,
  Button,
  List,
  ListItem,
  ListItemText,
  Popover,
  Checkbox,
  TextField,
  IconButton,
} from '@mui/material';
import html2canvas from 'html2canvas';
import ImageIcon from '@mui/icons-material/Image';
import { SERVICE } from '../../../services/Baseservice';
import 'jspdf-autotable';
import { UserRoleAccessContext, AuthContext } from '../../../context/Appcontext';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import Headtitle from '../../../components/Headtitle';
import { ThreeDots } from 'react-loader-spinner';
import axios from 'axios';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import LoadingButton from '@mui/lab/LoadingButton';
import CircularProgress, { circularProgressClasses } from '@mui/material/CircularProgress';
import { handleApiError } from '../../../components/Errorhandling';
import MessageAlert from '../../../components/MessageAlert.js';
import PageHeading from '../../../components/PageHeading';
import AlertDialog from '../../../components/Alert.js';
import ExportData from '../../../components/ExportData';
import ExportDataView from '../../../components/ExportData';
import ExportDataViewAll from '../../../components/ExportData';

// Inspired by the former Facebook spinners.
function FacebookCircularProgress(props) {
  return (
    <Box sx={{ position: 'relative' }}>
      <CircularProgress
        variant="determinate"
        sx={{
          color: (theme) => theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
        }}
        size={40}
        thickness={4}
        {...props}
        value={100}
      />
      <CircularProgress
        variant="indeterminate"
        disableShrink
        sx={{
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

function DayPointsUpload() {
  const gridRef = useRef(null);
  const gridRefView = useRef(null);
  const [items, setItems] = useState([]);
  const [itemsList, setItemsList] = useState([]);
  const [deleteClientUserID, setDeleteClientUserID] = useState({});
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [attStatus, setAttStatus] = useState([]);
  const [attModearr, setAttModearr] = useState([]);

  const [daypointslist, setDayPointsList] = useState([]);
  const [show, setShow] = useState(false);
  const [AlertButton, setAlertButton] = useState(false);
  const [fileupload, setFileupload] = useState([]);
  const [fileName, setFileName] = useState('');
  const [fileNameView, setFileNameView] = useState('');
  const [fileNameID, setFileNameID] = useState('');
  const { auth } = useContext(AuthContext);
  const [dataupdated, setDataupdated] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);

  const [copiedData, setCopiedData] = useState('');

  const [documentFiles, setdocumentFiles] = useState([]);
  const [itemsListView, setItemsListView] = useState([]);
  const [fileFormat, setFormat] = useState('');

  const [isloading, setIsloading] = useState(false);

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchQueryManage, setSearchQueryManage] = useState('');

  //Datatable View
  const [pageView, setPageView] = useState(1);
  const [pageSizeView, setPageSizeView] = useState(10);
  const [searchQueryView, setSearchQueryView] = useState('');
  const [searchQueryManageView, setSearchQueryManageView] = useState('');

  let today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var yyyy = today.getFullYear();
  let formattedDate = yyyy + '-' + mm + '-' + dd;
  // Manage Columns
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleOpenManageColumns = (event) => {
    setAnchorEl(event.currentTarget);
    setManageColumnsOpen(true);
  };
  const handleCloseManageColumns = () => {
    setManageColumnsOpen(false);
    setSearchQueryManage('');
  };

  const getattendancestatus = (alldata) => {
    let result = attStatus.filter((data, index) => {
      return data?.clockinstatus === alldata?.clockinstatus && data?.clockoutstatus === alldata?.clockoutstatus;
    });
    return result[0]?.name;
  };

  const getAttModeAppliedThr = (rowdaystatus) => {
    let result = attModearr.filter((data, index) => {
      return data?.name === rowdaystatus;
    });
    return result[0]?.appliedthrough;
  };

  const getAttModeLop = (rowdaystatus) => {
    let result = attModearr.filter((data, index) => {
      return data?.name === rowdaystatus;
    });
    return result[0]?.lop === true ? 'YES' : 'No';
  };

  const getAttModeLopType = (rowdaystatus) => {
    let result = attModearr.filter((data, index) => {
      return data?.name === rowdaystatus;
    });
    return result[0]?.loptype;
  };

  const getFinalLop = (rowlop, rowloptype) => {
    return rowloptype === undefined || rowloptype === '' ? rowlop : rowlop + ' - ' + rowloptype;
  };

  const getAttModeTarget = (rowdaystatus) => {
    let result = attModearr.filter((data, index) => {
      return data?.name === rowdaystatus;
    });
    return result[0]?.target === true ? 'YES' : 'No';
  };

  const getAttModePaidPresent = (rowdaystatus) => {
    let result = attModearr.filter((data, index) => {
      return data?.name === rowdaystatus;
    });
    return result[0]?.paidleave === true ? 'YES' : 'No';
  };

  const getAttModePaidPresentType = (rowdaystatus) => {
    let result = attModearr.filter((data, index) => {
      return data?.name === rowdaystatus;
    });
    return result[0]?.paidleavetype;
  };

  const getFinalPaid = (rowpaid, rowpaidtype) => {
    return rowpaidtype === undefined || rowpaidtype === '' ? rowpaid : rowpaid + ' - ' + rowpaidtype;
  };

  const getAssignLeaveDayForLop = (rowlopday) => {
    if (rowlopday === 'YES - Double Day') {
      return '2';
    } else if (rowlopday === 'YES - Full Day') {
      return '1';
    } else if (rowlopday === 'YES - Half Day') {
      return '0.5';
    } else {
      return '0';
    }
  };

  const getAssignLeaveDayForPaid = (rowpaidday) => {
    if (rowpaidday === 'YES - Double Day') {
      return '2';
    } else if (rowpaidday === 'YES - Full Day') {
      return '1';
    } else if (rowpaidday === 'YES - Half Day') {
      return '0.5';
    } else {
      return '0';
    }
  };

  // get week for month's start to end
  function getWeekNumberInMonth(date) {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const dayOfWeek = firstDayOfMonth.getDay(); // 0 (Sunday) to 6 (Saturday)

    // If the first day of the month is not Monday (1), calculate the adjustment
    const adjustment = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    // Calculate the day of the month adjusted for the starting day of the week
    const dayOfMonthAdjusted = date.getDate() + adjustment;

    // Calculate the week number based on the adjusted day of the month
    const weekNumber = Math.ceil(dayOfMonthAdjusted / 7);

    return weekNumber;
  }

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

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };
  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  const [isFilterOpenView, setIsFilterOpenView] = useState(false);
  // const [isPdfFilterOpenView, setIsPdfFilterOpenView] = useState(false);
  // page refersh reload
  const handleCloseFilterModView = () => {
    setIsFilterOpenView(false);
  };
  // const handleClosePdfFilterModView = () => {
  //   setIsPdfFilterOpenView(false);
  // };

  const [isFilterOpenViewAll, setIsFilterOpenViewAll] = useState(false);
  // const [isPdfFilterOpenView, setIsPdfFilterOpenView] = useState(false);
  // page refersh reload
  const handleCloseFilterModViewAll = () => {
    setIsFilterOpenViewAll(false);
  };
  // const handleClosePdfFilterModView = () => {
  //   setIsPdfFilterOpenView(false);
  // };

  let exportColumnNames = ['Date', 'File Name'];
  let exportRowValues = ['date', 'filename'];

  let exportColumnNamesViewAll = [
    'Name',
    'Empcode',
    'Company',
    'Branch',
    'Unit',
    'Team',
    'Date',
    'LoginId',
    'Identity Name',
    'Category',
    'Subcategory',
    'Experience',
    'Target',
    'Points',
    'Avg',
    'Processcode',
    'P process',
    'S process',
    'Con Target',
    'Con Points',
    'Con Avg',
  ];
  let exportRowValuesViewAll = [
    'name',
    'empcode',
    'company',
    'branch',
    'unit',
    'unit',
    'dateval',
    'user',
    'unitid',
    'filename',
    'category',
    'exper',
    'target',
    'points',
    'avg',
    'processcode',
    'aprocess',
    'sprocess',
    'contarget',
    'conpoints',
    'conavg',
  ];
  let exportColumnNamesView = ['Name', 'Employee Code', 'Company', 'Branch', 'Unit', 'Team', 'Date', 'Exper', 'Target', 'Production', 'Manual', 'Point', 'Allowance Point', 'Non-Allowance Point', 'Average Point'];
  let exportRowValuesView = ['name', 'empcode', 'companyname', 'branch', 'unit', 'team', 'date', 'exper', 'target', 'production', 'manual', 'point', 'allowancepoint', 'nonallowancepoint', 'avgpoint'];

  // Manage Columns
  const [isManageColumnsOpenView, setManageColumnsOpenView] = useState(false);
  const [anchorElView, setAnchorElView] = useState(null);
  const openView = Boolean(anchorElView);
  const idView = openView ? 'simple-popover' : undefined;

  const handleOpenManageColumnsView = (event) => {
    setAnchorElView(event.currentTarget);
    setManageColumnsOpenView(true);
  };
  const handleCloseManageColumnsView = () => {
    setManageColumnsOpenView(false);
    setSearchQueryManageView('');
  };

  //Delete model
  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
    // fetchAllDayPoints();
  };

  const [daypointsupload, setDayPointsUpload] = useState({
    date: formattedDate,
  });

  const backLPage = useNavigate();

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
    ResetFunc();
    // fetchAllDayPoints();
  };

  // Access
  const { isUserRoleCompare, isUserRoleAccess } = useContext(UserRoleAccessContext);
  const [dataArrayLength, setDataArrayLength] = useState([]);

  // viewAll model

  const initialColumnVisibilityviewAll = {
    serialNumber: true,
    name: true,
    empcode: true,
    companyname: true,
    branch: true,
    unit: true,
    team: true,
    date: true,
    exper: true,
    target: true,
    production: true,
    manual: true,
    point: true,
    allowancepoint: true,
    nonallowancepoint: true,
    avgpoint: true,
    actions: true,
  };

  const initialColumnVisibilityView = {
    serialNumber: true,
    name: true,
    datenew: true,
    empcode: true,
    company: true,
    branch: true,
    unit: true,
    unitid: true,
    user: true,
    team: true,
    dateval: true,
    exper: true,
    target: true,
    mode: true,
    points: true,
    avg: true,
    contarget: true,
    conpoints: true,
    aprocess: true,
    sprocess: true,
    conavg: true,
    processcode: true,
    filename: true,
    category: true,
  };
  const [columnVisibilityView, setColumnVisibilityView] = useState(initialColumnVisibilityView);

  const [openviewAll, setOpenviewAll] = useState(false);

  const handleClickOpenviewAll = (e, reason) => {
    if (reason && reason === 'backdropClick') return;
    setOpenviewAll(true);
    setPageviewAll(1);
    setPageSizeviewAll(10);
  };

  const [openSingleUserView, setOpenSingleUserView] = useState(false);

  const handleClickSingleUserOpenView = (e, reason) => {
    if (reason && reason === 'backdropClick') return;

    setPageView(1);
    setPageSizeView(10);
    setSearchQueryView('');
    setOpenSingleUserView(true);
  };
  const handleClickSingleUserCloseView = (e, reason) => {
    setSingleUserDataView([]);
    setOpenSingleUserView(false);
  };

  // view all codes

  const [itemsviewAll, setItemsviewAll] = useState([]);
  const [productionoriginalviewAll, setProductionoriginalViewAll] = useState([]);
  const addSerialNumberviewAll = () => {
    // console.log(productionoriginalviewAll, "productionoriginalviewAll");
    const itemsWithSerialNumber = productionoriginalviewAll?.map((item, index) => {
      let [year, month, date] = item.date.split('-');

      let diff = item.type === 'Created' ? (item.shiftsts === 'Enable' ? Number(Number(item.point).toFixed(3)) - Number(Number(item.conshiftpoints).toFixed(3)) : Number(item.point)) : item.nonallowancepoint;
      return {
        ...item,
        serialNumber: index + 1,
        date: `${date}-${month}-${year}`,
        point: Number(item.point).toFixed(3),
        production: Number(Number(item.production).toFixed(3)),
        manual: Number(Number(item.manual).toFixed(3)),
        avgpoint: Number(Number(item.avgpoint).toFixed(3)),
        exper: Number(item.exper),
        target: item.daypointsts === "WEEKOFF" ? 0 : Number(item.target),

        // filename:filenamespiliteed,
        // nonallowancepoint: Number(item.point) - Number(item.conshiftpoints) ,
        // allowancepoint:item.shiftsts === "Enable" ?  Number(item.conshiftpoints) : 0
        allowancepoint: item.type === 'Created' ? (item.shiftsts === 'Enable' ? Number(Number(item.conshiftpoints).toFixed(3)) : 0) : Number(item.allowancepoint),
        nonallowancepoint: diff < 1e-1 ? 0 : Number(diff) > 0 ? Number(Number(diff).toFixed(3)) : 0,
      };
    });

    setItemsviewAll(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumberviewAll();
  }, [productionoriginalviewAll]);

  const [searchQueryviewAll, setSearchQueryviewAll] = useState('');
  const [searchQueryManageviewAll, setSearchQueryManageviewAll] = useState('');
  const [pageviewAll, setPageviewAll] = useState(1);

  const [columnVisibilityviewAll, setColumnVisibilityviewAll] = useState(initialColumnVisibilityviewAll);
  const [pageSizeviewAll, setPageSizeviewAll] = useState(10);
  const handleCloseviewAll = () => {
    setOpenviewAll(false);
    setProductionoriginalViewAll([]);
    setSearchQueryviewAll('');
    setPageviewAll(1);
    setColumnVisibilityviewAll(initialColumnVisibilityviewAll);
  };

  // get single row to view....
  const getviewCodeall = async (id, type) => {
    try {
      handleClickOpenviewAll();
      setProductionfirstViewcheck(false);

      let res = await axios.get(`${SERVICE.SINGLE_DAY_POINTS}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      // console.log(res?.data?.sdaypointsupload?.uploaddata[0])
      setProductionoriginalViewAll(res?.data?.sdaypointsupload?.uploaddata.map((item) => ({ ...item, type: type })));
      setFileNameView(res?.data?.sdaypointsupload?.filename);
      setFileNameID(res?.data?.sdaypointsupload?._id);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    } finally {
      setProductionfirstViewcheck(true);
      setPageviewAll(1);
      setColumnVisibilityviewAll(initialColumnVisibilityviewAll);
    }
  };

  //Datatable
  const handlePageChangeviewAll = (newPage) => {
    setPageviewAll(newPage);
  };

  const handlePageSizeChangeviewAll = (event) => {
    setPageSizeviewAll(Number(event.target.value));
    setPageviewAll(1);
  };

  //datatable....
  const handleSearchChangeviewAll = (event) => {
    setSearchQueryviewAll(event.target.value);
    setPageviewAll(1);
  };

  // Show All Columns functionality
  const handleShowAllColumnsviewAll = () => {
    const updatedVisibility = { ...columnVisibilityviewAll };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibilityviewAll(updatedVisibility);
  };

  // Manage Columnsviewall
  const [isManageColumnsOpenviewAll, setManageColumnsOpenviewAll] = useState(false);
  const [anchorElviewAll, setAnchorElviewAll] = useState(null);

  const handleOpenManageColumnsviewAll = (event) => {
    setAnchorElviewAll(event.currentTarget);
    setManageColumnsOpenviewAll(true);
  };
  const handleCloseManageColumnsviewAll = () => {
    setManageColumnsOpenviewAll(false);
    setSearchQueryManageviewAll('');
  };

  const openviewpopall = Boolean(anchorElviewAll);
  const idviewall = openviewpopall ? 'simple-popover' : undefined;

  useEffect(() => {
    // Retrieve column visibility from localStorage (if available)
    const savedVisibility = localStorage.getItem('columnVisibilityviewAll');
    if (savedVisibility) {
      setColumnVisibilityviewAll(JSON.parse(savedVisibility));
    }
  }, []);

  useEffect(() => {
    // Save column visibility to localStorage whenever it changes
    localStorage.setItem('columnVisibilityviewAll', JSON.stringify(columnVisibilityviewAll));
  }, [columnVisibilityviewAll]);
  // Split the search query into individual terms
  const searchTermsviewAll = searchQueryviewAll.toLowerCase().split(' ');
  // Modify the filtering logic to check each term
  const filteredDataviewAlls = itemsviewAll?.filter((item) => {
    return searchTermsviewAll.every((term) => Object.values(item).join(' ').toLowerCase().includes(term));
  });

  const filteredDataviewAll = filteredDataviewAlls.slice((pageviewAll - 1) * pageSizeviewAll, pageviewAll * pageSizeviewAll);

  const totalPagesviewAll = Math.ceil(filteredDataviewAlls.length / pageSizeviewAll);

  const visiblePagesviewAll = Math.min(totalPagesviewAll, 3);

  const firstVisiblePageviewAll = Math.max(1, pageviewAll - 1);
  const lastVisiblePageviewAll = Math.min(firstVisiblePageviewAll + visiblePagesviewAll - 1, totalPagesviewAll);

  const pageNumbersviewall = [];

  const indexOfLastItemviewAll = pageviewAll * pageSizeviewAll;
  const indexOfFirstItemviewAll = indexOfLastItemviewAll - pageSizeviewAll;

  for (let i = firstVisiblePageviewAll; i <= lastVisiblePageviewAll; i++) {
    pageNumbersviewall.push(i);
  }

  //print.view.all.
  const componentRefviewall = useRef();
  const handleprintviewall = useReactToPrint({
    content: () => componentRefviewall.current,
    documentTitle: fileNameView,
    pageStyle: 'print',
  });

  // pdf.....
  const columnsviewall = [
    { title: 'Sno', field: 'serialNumber' },
    { title: 'Name', field: 'name' },
    { title: 'Employee Code', field: 'empcode' },
    { title: 'Company', field: 'companyname' },
    { title: 'Branch', field: 'branch' },
    { title: 'Unit', field: 'unit' },
    { title: 'Team', field: 'team' },
    { title: 'Date', field: 'date' },
    { title: 'Exper', field: 'exper' },
    { title: 'Target', field: 'target' },
    { title: 'Production', field: 'production' },
    { title: 'Manual', field: 'manual' },
    { title: 'Point', field: 'point' },
    { title: 'Allowance Point', field: 'allowancepoint' },
    { title: 'Non-Allowance Point', field: 'nonallowancepoint' },
    { title: 'Average Point', field: 'avgpoint' },
  ];

  const downloadPdfviewall = () => {
    const doc = new jsPDF({ orientation: 'lanscape' });
    doc.autoTable({
      theme: 'grid',
      columns: columnsviewall.map((col) => ({ ...col, dataKey: col.field })),
      body: rowDataTableviewAll,
      styles: {
        fontSize: 5,
      },
    });
    doc.save(fileNameView);
  };

  const gridRefviewall = useRef(null);
  //image view all
  const handleCaptureImageviewall = () => {
    if (gridRefviewall.current) {
      html2canvas(gridRefviewall.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, fileNameView);
        });
      });
    }
  };

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    date: true,
    type: true,
    filename: true,
    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

  // datavallist:datavallist,
  const columnDataTableviewAll = [
    {
      field: 'serialNumber',
      headerName: 'SNo',
      flex: 0,
      width: 70,
      hide: !columnVisibilityviewAll.serialNumber,
      headerClassName: 'bold-header',
    },
    {
      field: 'name',
      headerName: 'Name',
      flex: 0,
      width: 220,
      hide: !columnVisibilityviewAll.name,
      headerClassName: 'bold-header',
    },
    {
      field: 'empcode',
      headerName: 'Emp Code',
      flex: 0,
      width: 120,
      hide: !columnVisibilityviewAll.empcode,
      headerClassName: 'bold-header',
    },
    {
      field: 'companyname',
      headerName: 'Company',
      flex: 0,
      width: 90,
      hide: !columnVisibilityviewAll.companyname,
      headerClassName: 'bold-header',
    },
    {
      field: 'branch',
      headerName: 'Branch',
      flex: 0,
      width: 120,
      hide: !columnVisibilityviewAll.branch,
      headerClassName: 'bold-header',
    },
    {
      field: 'unit',
      headerName: 'Unit',
      flex: 0,
      width: 100,
      hide: !columnVisibilityviewAll.unit,
      headerClassName: 'bold-header',
    },
    {
      field: 'team',
      headerName: 'Team',
      flex: 0,
      width: 120,
      hide: !columnVisibilityviewAll.team,
      headerClassName: 'bold-header',
    },
    {
      field: 'date',
      headerName: 'Date',
      flex: 0,
      width: 100,
      hide: !columnVisibilityviewAll.date,
      headerClassName: 'bold-header',
    },
    {
      field: 'exper',
      headerName: 'Exper',
      flex: 0,
      width: 90,
      hide: !columnVisibilityviewAll.exper,
      headerClassName: 'bold-header',
    },
    {
      field: 'target',
      headerName: 'Target',
      flex: 0,
      width: 90,
      hide: !columnVisibilityviewAll.target,
      headerClassName: 'bold-header',
    },
    {
      field: 'production',
      headerName: 'Production',
      flex: 0,
      width: 100,
      hide: !columnVisibilityviewAll.production,
      headerClassName: 'bold-header',
    },
    {
      field: 'manual',
      headerName: 'Manual',
      flex: 0,
      width: 100,
      hide: !columnVisibilityviewAll.manual,
      headerClassName: 'bold-header',
    },
    {
      field: 'point',
      headerName: 'Point',
      flex: 0,
      width: 100,
      hide: !columnVisibilityviewAll.point,
      headerClassName: 'bold-header',
    },
    {
      field: 'allowancepoint',
      headerName: 'Allowance Point',
      flex: 0,
      width: 100,
      hide: !columnVisibilityviewAll.allowancepoint,
      headerClassName: 'bold-header',
    },
    {
      field: 'nonallowancepoint',
      headerName: 'Non-Allowance Point',
      flex: 0,
      width: 100,
      hide: !columnVisibilityviewAll.nonallowancepoint,
      headerClassName: 'bold-header',
    },
    {
      field: 'avgpoint',
      headerName: 'Average Point',
      flex: 0,
      width: 100,
      hide: !columnVisibilityviewAll.avgpoint,
      headerClassName: 'bold-header',
    },
    {
      field: 'actions',
      headerName: 'Action',
      flex: 0,
      width: 180,
      minHeight: '40px !important',
      sortable: false,
      hide: !columnVisibilityviewAll.actions,
      headerClassName: 'bold-header',
      renderCell: (params) => (
        <Grid sx={{ display: 'flex', gap: '20px' }}>
          {isUserRoleCompare?.includes('edaypointsupload') && (
            <Link to={`/production/daypointsuploadedit/${params.row.id}/${fileNameID}`}>
              <Button sx={{ minWidth: '40px' }}>
                <EditOutlinedIcon style={{ fontsize: 'large' }} />
              </Button>
            </Link>
          )}

          {isUserRoleCompare?.includes('ddaypointsupload') && (
            <Button
              sx={{ minWidth: '40px' }}
              variant="contained"
              onClick={(e) => {
                rowDataViewIndividualUser(
                  params.row.date,
                  params.row.name,
                  params.row.type,
                  params.row.users,
                  params.row.fromtodate,
                  params.row.companyname,
                  params.row.branch,
                  params.row.unit,
                  params.row.team,
                  params.row.empcode,
                  params.row.exper,
                  params.row.target,
                  params.row.processcode
                );
              }}
            >
              View
            </Button>
          )}
        </Grid>
      ),
    },
  ];
  // console.log(filteredDataviewAll, "filteredDataviewAll");
  const rowDataTableviewAll = filteredDataviewAll.map((item, index) => {
    // const filenamelistviewAll = item.filename?.split(".x");
    // const filenamelist = filenamelistviewAll[0];
    // const dateObject = new Date(item.dateval);
    // const datavallist = dateObject?.toISOString()?.split('T')[0];
    //     const ISTDateString = dateObject.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });

    return {
      id: item._id,
      serialNumber: item.serialNumber,
      name: item.name,
      empcode: item.empcode,
      companyname: item.companyname,
      fromtodate: item.fromtodate,
      branch: item.branch,
      unit: item.unit,
      team: item.team,
      date: item.date,
      exper: item.exper,
      target: item.target,
      production: item.production,
      manual: item.manual,
      point: item.point,
      allowancepoint: item.allowancepoint,
      users: item.users,
      type: item.type,
      processcode: item.processcode,
      // filenamelist: filenamelist,
      nonallowancepoint: item.nonallowancepoint,
      avgpoint: item.avgpoint,
      // datavallist:datavallist,
    };
  });
  // // Function to filter columns based on search query
  const filteredColumnsviewAll = columnDataTableviewAll.filter((column) => column.headerName.toLowerCase().includes(searchQueryManageviewAll.toLowerCase()));

  // Manage Columns functionality
  const toggleColumnVisibilityviewAll = (field) => {
    setColumnVisibilityviewAll((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };

  // JSX for the "Manage Columns" popover content
  const manageColumnsContentviewAll = (
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
        onClick={handleCloseManageColumnsviewAll}
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
        <TextField label="Find column" variant="standard" fullWidth value={searchQueryManageviewAll} onChange={(e) => setSearchQueryManageviewAll(e.target.value)} sx={{ marginBottom: 5, position: 'absolute' }} />
      </Box>
      <br />
      <br />
      <DialogContent sx={{ minWidth: 'auto', height: '200px', position: 'relative' }}>
        <List sx={{ overflow: 'auto', height: '100%' }}>
          {filteredColumnsviewAll.map((column) => (
            <ListItem key={column.field}>
              <ListItemText
                sx={{ display: 'flex' }}
                primary={<Switch sx={{ marginTop: '-5px' }} size="small" checked={columnVisibilityviewAll[column.field]} onChange={() => toggleColumnVisibilityviewAll(column.field)} />}
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
            <Button variant="text" sx={{ textTransform: 'none' }} onClick={() => setColumnVisibilityviewAll(initialColumnVisibilityviewAll)}>
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
                columnDataTableviewAll.forEach((column) => {
                  newColumnVisibility[column.field] = false; // Set hide property to true
                });
                setColumnVisibilityviewAll(newColumnVisibility);
              }}
            >
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );

  const [productionfirstViewCheck, setProductionfirstViewcheck] = useState(false);
  const username = isUserRoleAccess.username;

  const readExcel = async (file, name, e) => {
    try {
      let res_queue = await axios.get(SERVICE.GET_DAY_POINTS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      console.log(file);
      // setDayPointsList(res_queue.data.daypointsupload);
      let answer = res_queue?.data?.daypointsupload.map((data) => data.uploaddata).flat();
      // setDayPointsUploadOverallData(answer);
      if (name?.split('.')[1] === 'xlsx' || name?.split('.')[1] === 'xls' || name?.split('.')[1] === 'csv') {
        const resume = file;

        let documentarray;
        const reader = new FileReader();
        const files = resume;
        reader.readAsDataURL(files);
        reader.onload = () => {
          documentarray = [
            {
              name: files.name,
              preview: reader.result,
              data: reader.result.split(',')[1],
              remark: 'resume file',
            },
          ];
        };

        const promise = new Promise((resolve, reject) => {
          const fileReader = new FileReader();
          fileReader.readAsArrayBuffer(file);

          fileReader.onload = (e) => {
            const bufferArray = e.target.result;
            const wb = XLSX.read(bufferArray, { type: 'buffer' });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];

            // Convert the sheet to JSON
            const data = XLSX.utils.sheet_to_json(ws);

            resolve(data);
          };
          fileReader.onerror = (error) => {
            // reject(error);
            console.log(error);
          };
        });
        promise.then((d) => {
          const dataArray = d.map((item, index) => ({
            date: daypointsupload.date,
            name: item.Name,
            empcode: item['Emp Code'],
            branch: item['Branch Name'],
            unit: String(item.Unit),
            team: String(item.Team),
            datenew: daypointsupload.date,
            filename: name.split('.')[0],
            companyname: item['Company Name'],
            exper: item.Exper,
            target: item.Target,
            weekoff: item.WeekOff,
            production: item.Production,
            manual: item.Manual,
            nonproduction: item['Non Production'] ? item['Non Production'] : 0,
            point: item.Point,
            allowancepoint: item['Allowance Point'],
            nonallowancepoint: item['Non Allowance Point'],
            avgpoint: item['Avg.Point'],
          }));

          const uniqueCombinationstime = new Set();

          // Filter and deduplicate CATEGORIES
          const filteredArray1time = answer.filter((item) => {
            const combination = `${item.name}-${item.empcode}-${item.branch}-${item.unit}-${item.team}-${item.companyname}-${item.date}-${item.exper}-${item.target}-${item.weekoff}-${item.production}-${item.manual}-${item.nonproduction}-${item.point}-${item.allowancepoint} -${item.nonallowancepoint}-${item.avgpoint}`;
            if (!uniqueCombinationstime.has(combination)) {
              uniqueCombinationstime.add(combination);
              return true;
            }
            return false;
          });
          // Filter and deduplicate EXCEL DATA
          const filteredArray2time = dataArray.some((data) => data.name !== undefined)
            ? dataArray.filter((item) => {
              const combination = `${item.name}-${item.empcode}-${item.branch}-${item.unit}-${item.team}-${item.companyname}-${item.date}-${item.exper}-${item.target}-${item.weekoff}-${item.production}-${item.manual}-${item.nonproduction}-${item.point}-${item.allowancepoint} -${item.nonallowancepoint}-${item.avgpoint}`;
              if (!uniqueCombinationstime.has(combination)) {
                uniqueCombinationstime.add(combination);
                return true;
              }
              return false;
            })
            : [];
          // const name =
          const ans = [
            {
              filename: name.split('.')[0],
              date: daypointsupload.date,
              uploaddata: filteredArray2time,
              type: 'excel',
              document: documentarray,
              addedby: [
                {
                  name: String(username),
                  date: String(new Date()),
                },
              ],
            },
          ];
          console.log(ans, 'ans');
          setItems(ans);
          setShow(true);
          setAlertButton(true);
          setDataArrayLength(filteredArray2time.length);
        });
      }
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  // //get all client user id.
  // const fetchProductionLists = async () => {
  //   try {
  //     let res_freq = await axios.get(SERVICE.GET_DAY_POINTS, {
  //       headers: {
  //         Authorization: `Bearer ${auth.APIToken}`,
  //       },
  //     });
  //     // setLoader(true);

  //     // setProductionPoints(answer);
  //   } catch (err) {
  //        handleApiError(err, setShowAlert, handleClickOpenerr);
  //   }
  // };
  // useEffect(() => {
  //   fetchProductionLists();
  // }, []);

  //get all Time Loints List.
  const fetchAllDayPoints = async () => {
    try {
      let res_queue = await axios.get(SERVICE.GET_DAY_POINTS_LIMITED, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let sorted = res_queue.data.daypointsupload.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);

        if (dateA > dateB) return -1; // For descending date order
        if (dateA < dateB) return 1; // For descending date order
      });
      setDayPointsList(sorted);
      // let answer = res_queue?.data?.daypointsupload
      //   .map((data) => data.uploaddata)
      //   .flat();
      // setDayPointsUploadOverallData(answer);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const ResetFunc = () => {
    // fetchAllDayPoints();
    setItems([]);
    setFileName('');
    setShow(false);
    setFileupload('');
    setAlertButton(false);
    setDataArrayLength('');
  };

  useEffect(() => {
    fetchAllDayPoints();
  }, [isloading]);

  useEffect(() => {
    fetchTargetCategoryProcessMap();
  }, []);

  const clearFileSelection = () => {
    setFileupload([]);
    setFileName('');
    setItems('');
    readExcel(null);
    setShow(false);
    setAlertButton(false);
    setDataupdated('');

    setdocumentFiles([]);
  };

  const ExportsHead = () => {
    new CsvBuilder('ADD DAY POINTS-FILE UPLOAD')
      .setColumns(['Name', 'Emp Code', 'Company Name', 'Branch Name', 'Unit', 'Team', 'Exper', 'Target', 'WeekOff', 'Production', 'Manual', 'Non Production', 'Point', 'Allowance Point', 'Non Allowance Point', 'Avg.Point'])
      .exportFile();
  };

  const sendJSON = async () => {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
      }
    };

    // Ensure that items is an array of objects before sending
    if (dataArrayLength === 0 && daypointsupload.date === '') {
      toast.warning('No data to upload!');
      return;
    }

    try {
      // setLoading(true); // Set loading to true when starting the upload
      xmlhttp.open('POST', SERVICE.ADD_DAY_POINTS);
      xmlhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
      xmlhttp.send(JSON.stringify(items));
      await fetchAllDayPoints();
      setdocumentFiles([]);
    } catch (err) {
    } finally {
      // setLoading(false); // Set loading back to false when the upload is complete
      setShowAlert(
        <>
          <CheckCircleOutlineIcon sx={{ fontSize: '100px', color: '#7ac767' }} />
          <p style={{ fontSize: '20px', fontWeight: 900 }}>{'Uploaded Successfully 👍'}</p>
        </>
      );
      handleClickOpenerr();
      await fetchAllDayPoints();
    }
  };

  const handleCheck = () => {
    toast.warning('Upload files!');
  };
  //set function to get particular row
  const rowData = async (id, date) => {
    try {
      let resCheckPayrun = await axios.post(SERVICE.CHECK_PAYRUN_GENERATED, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        date: date,
      });
      const isPayrunGenerated = resCheckPayrun.data.payruncontrol > 0
      if (isPayrunGenerated) {

        setPopupContentMalert(`Payrun Already Generated`);
        setPopupSeverityMalert('warning');
        handleClickOpenPopupMalert();
      } else {
        let res = await axios.get(`${SERVICE.SINGLE_DAY_POINTS}/${id}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
        setDeleteClientUserID(res?.data?.sdaypointsupload);
        handleClickOpen();
      }
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [singleUserDataView, setSingleUserDataView] = useState([]);
  const [isSingleLoader, setIsSingleLoader] = useState(false);
  //set function to get particular row
  const rowDataViewIndividualUser = async (date, name, type, users, fromtodate, company, branch, unit, team, empcode, exper, target, processcode) => {
    handleClickSingleUserOpenView();
    setIsSingleLoader(true);
    try {
      if (type !== 'Created') {
        let res_queue = await axios.post(SERVICE.GET_LOGINALLOT_ID_DETAILS, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          name: name,
          date: date,
        });
        console.log(
          date,
          name,
          res_queue.data.clientuserid.map((item) => item.userid),
          'ids'
        );
        setIsSingleLoader(false);
      } else {
        let res = await axios.post(SERVICE.GET_PRODUCTION_SINGLE_DAYUSER, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          date: fromtodate,
          users: users,
        });

        // let res_module = await axios.get(SERVICE.CATEGORYPROD_LIMITED_ORIGINAL, {
        //   headers: {
        //     Authorization: `Bearer ${auth.APIToken}`,
        //   },
        // });
        // const uniqueArray = res_module?.data?.categoryprod;
        // console.log(res.data.productionupload.length, res.data.productionuploadManual.length, fromtodate, "res.data.productionupload");

        let [firstDate, secondDate] = fromtodate.split('$');
        let [fromdate, fromtime] = firstDate.split('T');

        let checkfromdate = `${fromdate} ${fromtime.split('.000Z')[0]}`;
        // console.log(firstDate, checkfromdate, 'checkfromdate');

        let [todate, totime] = secondDate.split('T');

        let checktodate = `${todate} ${totime.split('.000Z')[0]}`;

        console.log(checkfromdate, checktodate, new Date(checkfromdate), new Date(checktodate), 'checkfromdate');

        let datafiltered = [...res.data.productionupload, ...res.data.productionuploadManual].map((item) => {
          let UploadDateVal = item.mode === 'Manual' ? '' : item.dateval?.split(' IST')[0];
          let toDateonly = item.mode === 'Manual' ? `${item.fromdate} ${item.time}` : `${UploadDateVal.split(' ')[0]} ${UploadDateVal.split(' ')[1]}`;

          // console.log(new Date(toDateonly), 'checktodate');

          let filenameupdated = item.mode === 'Manual' ? item.filename : item.filename?.split('.x')[0];

          // let findFlagSts = uniqueArray.find((d) => d.project === item.vendor.split("-")[0] && d.name === filenameupdated);
          let finalunitrate = item.updatedunitrate ? Number(item.updatedunitrate) : Number(item.unitrate);
          let finalflag = item.updatedflag ? Number(item.updatedflag) : Number(item.flagcount);
          let finalpoints = finalunitrate * finalflag * 8.333333333333333;
          let datenew = item.mode === 'Manual' ? `${item.fromdate} ${item.time}` : item.dateval?.split(' IST')[0];

          let lateEntryPointsRemove = item.mode === 'Manual' && item.lateentrystatus === 'Late Entry';

          // console.log(new Date(toDateonly) , new Date(checkfromdate) , new Date(checktodate))
          if (new Date(toDateonly) >= new Date(checkfromdate) && new Date(toDateonly) <= new Date(checktodate)) {
            return {
              ...item,
              filename: filenameupdated,
              date: date,
              datenew: datenew,
              points: lateEntryPointsRemove ? 0 : finalunitrate * finalflag * 8.333333333333333,
              company: company,
              branch: branch,
              unit: unit,
              team: team,
              processcode: processcode,
              name: name,
              empcode: empcode,
              exper: exper,
              target: target,
            };
          }
        });
        // console.log(datafiltered.filter(d => d !== undefined))
        let sorted = datafiltered
          .filter((d) => d !== undefined)
          .sort((a, b) => {
            return new Date(a.datenew) - new Date(b.datenew);
          });
        console.log(sorted, 'sorted');
        setSingleUserDataView(sorted);
      }
    } catch (err) {
      setIsSingleLoader(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  // console.log(singleUserDataView);
  // Alert delete popup
  let brandid = deleteClientUserID._id;
  const delBrand = async () => {
    try {
      await axios.delete(`${SERVICE.SINGLE_DAY_POINTS}/${brandid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      // await readExcel(null)

      await fetchAllDayPoints();
      setAlertButton(false);
      handleCloseMod();
      setSelectedRows([]);
      setPage(1);
      setShowAlert(
        <>
          <CheckCircleOutlineIcon sx={{ fontSize: '100px', color: '#7ac767' }} />
          <p style={{ fontSize: '20px', fontWeight: 900 }}>{'Deleted Successfully 👍'}</p>
        </>
      );
      handleClickOpenerr();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //datatable....
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  // Split the search query into individual terms
  const searchTerms = searchQuery.toLowerCase().split(' ');
  // Modify the filtering logic to check each term
  const filteredDatas = itemsList?.filter((item) => {
    return searchTerms.every((term) => Object.values(item).join(' ').toLowerCase().includes(term));
  });

  const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);

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
      field: 'checkbox',
      headerName: 'Checkbox', // Default header name
      headerStyle: {
        fontWeight: 'bold', // Apply the font-weight style to make the header text bold
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
      headerClassName: 'bold-header',
    },
    {
      field: 'serialNumber',
      headerName: 'SNo',
      flex: 0,
      width: 150,
      hide: !columnVisibility.serialNumber,
      headerClassName: 'bold-header',
    },
    {
      field: 'date',
      headerName: 'Date',
      flex: 0,
      width: 250,
      hide: !columnVisibility.date,
      headerClassName: 'bold-header',
    },
    {
      field: 'filename',
      headerName: 'File Name',
      flex: 0,
      width: 350,
      hide: !columnVisibility.filename,
      headerClassName: 'bold-header',
    },
    {
      field: 'type',
      headerName: 'Type',
      flex: 0,
      width: 200,
      hide: !columnVisibility.type,
      headerClassName: 'bold-header',
    },
    {
      field: 'actions',
      headerName: 'Action',
      flex: 0,
      width: 200,
      minHeight: '40px !important',
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: 'bold-header',
      renderCell: (params) => (
        <Grid sx={{ display: 'flex' }}>
          {isUserRoleCompare?.includes('dclientuserid') && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.row.id, params.row.dateold);
              }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontsize: 'large' }} />
            </Button>
          )}
          {isUserRoleCompare?.includes('vclientuserid') && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCodeall(params.row.id, params.row.type);
              }}
            >
              <VisibilityOutlinedIcon style={{ fontsize: 'large' }} />{' '}
            </Button>
          )}
        </Grid>
      ),
    },
  ];

  const rowDataTable = filteredData.map((item, index) => {
    return {
      ...item,
      id: item._id,
      serialNumber: item.serialNumber,
      type: item.type,
      date: item.date,
      filename: item.filename,
    };
  });

  const CustomStyledDataGrid = styled(StyledDataGrid)(({ theme }) => ({
    '& .custom-id-lateentry': {
      color: 'red !important',
    },
  }));

  const getRowClassName = (params) => {
    if (selectedRows.includes(params.row.id)) {
      return 'custom-id-row'; // This is the custom class for rows with item.tat === 'ago'
    }
    return ''; // Return an empty string for other rows
  };

  const getRowClassNameCategoryview = (params) => {
    if (params.row.lateentrystatus === 'Late Entry') {
      return 'custom-id-lateentry';
    }
    return '';
  };

  const rowsWithCheckboxes = rowDataTable.map((row) => ({
    ...row,
    // Create a custom field for rendering the checkbox
    checkbox: selectedRows.includes(row.id),
  }));
  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  // pdf.....
  const columns = [
    { title: 'Sno', field: 'serialNumber' },
    { title: 'Date', field: 'date' },
    { title: 'File Name', field: 'filename' },
  ];

  //  pdf download functionality
  const downloadPdf = () => {
    const doc = new jsPDF();

    doc.autoTable({
      theme: 'grid',
      styles: {
        fontSize: 6,
        cellWidth: 'auto',
      },
      columns: columns.map((col) => ({ ...col, dataKey: col.field })),
      body: itemsList,
    });
    doc.save('DataPointsUpload.pdf');
  };

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, 'Day_points.png');
        });
      });
    }
  };
  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Day_points',
    pageStyle: 'print',
  });

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

  const addSerialNumber = () => {
    const itemsWithSerialNumber = daypointslist?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
      type: item.type === 'nonexcel' ? 'Created' : 'Uploaded',
      date: moment(item.date).format('DD-MM-YYYY'),
      dateold: item.date,
    }));
    setItemsList(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
    // getexcelDatas();
  }, [daypointslist]);

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

  const handleFilterSave = async () => {
    let isDateMatch = daypointslist.find((d) => d.date === daypointsupload.date);
    if (daypointsupload.date === '') {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: '100px', color: 'orange' }} />
          <p style={{ fontSize: '20px', fontWeight: 900 }}>{'Please Select Date'}</p>
        </>
      );
      handleClickOpenerr();
    } else if (isDateMatch) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: '100px', color: 'orange' }} />
          <p style={{ fontSize: '20px', fontWeight: 900 }}>{'Already This Date Created'}</p>
        </>
      );
      handleClickOpenerr();
    } else {
      setIsloading(true);
      let res_Day = await axios.post(SERVICE.PRODUCTION_DAYS_GETLIST_BY_DATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        date: daypointsupload.date,
      });

      let finaldate = moment(daypointsupload.date).format('DDMMYYYY');

      let finalData = res_Day.data.result.map((item) => {
        // console.log((Number(item.points)) - (Number((item.conshiftpoints).toFixed(5))));
        // let diff =  Number(item.points) - Number(item.conshiftpoints)
        return {
          ...item,
          date: daypointsupload.date,

          avgpoint: (Number(item.points) / Number(item.target)) * 100,
          point: item.points,
          companyname: item.company,
          name: item.empname,
        };
      });

      console.log(finalData, 'finalData');

      if (finalData.length > 0) {
        let startMonthDate = new Date(daypointsupload.date);
        let endMonthDate = new Date(daypointsupload.date);

        const daysArray = [];
        while (startMonthDate <= endMonthDate) {
          const formattedDate = `${String(startMonthDate.getDate()).padStart(2, '0')}/${String(startMonthDate.getMonth() + 1).padStart(2, '0')}/${startMonthDate.getFullYear()}`;
          const dayName = startMonthDate.toLocaleDateString('en-US', { weekday: 'long' });
          const dayCount = startMonthDate.getDate();
          const shiftMode = 'Main Shift';
          const weekNumberInMonth =
            getWeekNumberInMonth(startMonthDate) === 1
              ? `${getWeekNumberInMonth(startMonthDate)}st Week`
              : getWeekNumberInMonth(startMonthDate) === 2
                ? `${getWeekNumberInMonth(startMonthDate)}nd Week`
                : getWeekNumberInMonth(startMonthDate) === 3
                  ? `${getWeekNumberInMonth(startMonthDate)}rd Week`
                  : getWeekNumberInMonth(startMonthDate) > 3
                    ? `${getWeekNumberInMonth(startMonthDate)}th Week`
                    : '';

          daysArray.push({ formattedDate, dayName, dayCount, shiftMode, weekNumberInMonth });

          // Move to the next day
          startMonthDate.setDate(startMonthDate.getDate() + 1);
        }

        let res_applyleave = await axios.post(SERVICE.APPLYLEAVE_APPROVED, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          status: String('Approved'),
        });

        let leaveresult = res_applyleave?.data?.applyleaves;

        let res_emp = await axios.post(SERVICE.USER_FOR_ALL_ATTENDANCE_PAGE_PROD_DAYPOINT, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          date: daypointsupload.date,
          employee: finalData.map((item) => item.name),
        });

        function splitArray(array, chunkSize) {
          const resultarr = [];
          for (let i = 0; i < array.length; i += chunkSize) {
            const chunk = array.slice(i, i + chunkSize);
            resultarr.push({
              data: chunk,
            });
          }
          return resultarr;
        }

        let employeelistnames = res_emp?.data?.users.length > 0 ? [...new Set(res_emp?.data?.users.map((item) => item.companyname))] : [];
        const resultarr = splitArray(employeelistnames, 10);

        async function sendBatchRequest(batch) {
          try {
            let res = await axios.post(
              SERVICE.USER_CLOCKIN_CLOCKOUT_STATUS_FILTER_PROD_DAYPOINT,
              {
                employee: batch.data,
                userDates: daysArray,
                date: daypointsupload.date,
              },
              {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },
              }
            );

            // const filteredBatch = res?.data?.finaluser?.filter((d) => {
            //   const [day, month, year] = d.rowformattedDate.split('/');
            //   const formattedDate = new Date(`${year}-${month}-${day}`);
            //   const reasonDate = new Date(d.reasondate);
            //   const dojDate = new Date(d.doj);

            //   if (d.reasondate && d.reasondate !== '') {
            //     return formattedDate <= reasonDate;
            //   } else if (d.doj && d.doj !== '') {
            //     return formattedDate >= dojDate;
            //   } else {
            //     return d;
            //   }
            // });

            let filtered = res?.data?.finaluser;

            let countByEmpcodeClockin = {}; // Object to store count for each empcode
            let countByEmpcodeClockout = {};

            const result = filtered?.map((item, index) => {
              // Initialize count for empcode if not already present
              if (!countByEmpcodeClockin[item.empcode]) {
                countByEmpcodeClockin[item.empcode] = 1;
              }
              if (!countByEmpcodeClockout[item.empcode]) {
                countByEmpcodeClockout[item.empcode] = 1;
              }

              // Adjust clockinstatus based on lateclockincount
              let updatedClockInStatus = item.clockinstatus;
              // Adjust clockoutstatus based on earlyclockoutcount
              let updatedClockOutStatus = item.clockoutstatus;

              // Filter out only 'Absent' items for the current employee
              const absentItems = filtered?.filter((d) => d.clockinstatus === 'Absent' && item.empcode === d.empcode && d.clockin === '00:00:00' && d.clockout === '00:00:00');

              // Check if the day before and after a 'Week Off' date is marked as 'Leave' or 'Absent'
              if (item.clockinstatus === 'Week Off' && item.clockoutstatus === 'Week Off') {
                // Define the date format for comparison
                const itemDate = moment(item.rowformattedDate, 'DD/MM/YYYY');

                const isPreviousDayLeave = leaveresult.some((leaveItem) => moment(leaveItem.date, 'DD/MM/YYYY').isSame(itemDate.clone().subtract(1, 'days'), 'day') && leaveItem.empcode === item.empcode);
                const isPreviousDayAbsent = absentItems.some((absentItem) => moment(absentItem.rowformattedDate, 'DD/MM/YYYY').isSame(itemDate.clone().subtract(1, 'days'), 'day'));

                const isNextDayLeave = leaveresult.some((leaveItem) => moment(leaveItem.date, 'DD/MM/YYYY').isSame(itemDate.clone().add(1, 'days'), 'day') && leaveItem.empcode === item.empcode);
                const isNextDayAbsent = absentItems.some((absentItem) => moment(absentItem.rowformattedDate, 'DD/MM/YYYY').isSame(itemDate.clone().add(1, 'days'), 'day'));

                if (isPreviousDayLeave) {
                  updatedClockInStatus = 'BeforeWeekOffLeave';
                  updatedClockOutStatus = 'BeforeWeekOffLeave';
                }
                if (isPreviousDayAbsent) {
                  updatedClockInStatus = 'BeforeWeekOffAbsent';
                  updatedClockOutStatus = 'BeforeWeekOffAbsent';
                }
                if (isNextDayLeave) {
                  updatedClockInStatus = 'AfterWeekOffLeave';
                  updatedClockOutStatus = 'AfterWeekOffLeave';
                }
                if (isNextDayAbsent) {
                  updatedClockInStatus = 'AfterWeekOffAbsent';
                  updatedClockOutStatus = 'AfterWeekOffAbsent';
                }
              }

              // Check if 'Late - ClockIn' count exceeds the specified limit
              if (updatedClockInStatus === 'Late - ClockIn') {
                updatedClockInStatus = `${countByEmpcodeClockin[item.empcode]}Late - ClockIn`;
                countByEmpcodeClockin[item.empcode]++; // Increment count for current empcode
              }
              // Check if 'Early - ClockOut' count exceeds the specified limit
              if (updatedClockOutStatus === 'Early - ClockOut') {
                updatedClockOutStatus = `${countByEmpcodeClockout[item.empcode]}Early - ClockOut`;
                countByEmpcodeClockout[item.empcode]++; // Increment count for current empcode
              }

              return {
                ...item,
                clockinstatus: updatedClockInStatus,
                clockoutstatus: updatedClockOutStatus,
              };
            });

            return result;
          } catch (err) {
            console.error('Error in POST request for batch:', batch.data, err);
          }
        }

        async function getAllResults() {
          let allResults = [];
          for (let batch of resultarr) {
            const finaldata = await sendBatchRequest(batch);
            allResults = allResults.concat(finaldata);
          }

          return { allResults }; // Return both results as an object
        }

        getAllResults()
          .then(async (results) => {
            const itemsWithSerialNumber = results.allResults?.map((item, index) => ({
              ...item,
              serialNumber: index + 1,
              // attendanceauto: getattendancestatus(item),
              daystatus: item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item),
              // appliedthrough: getAttModeAppliedThr(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
              // lop: getAttModeLop(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
              // loptype: getAttModeLopType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
              // lopcalculation: getFinalLop(getAttModeLop(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)), getAttModeLopType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item))),
              // modetarget: getAttModeTarget(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
              // paidpresentbefore: getAttModePaidPresent(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
              // paidleavetype: getAttModePaidPresentType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
              // paidpresent: getFinalPaid(
              //   getAttModePaidPresent(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
              //   getAttModePaidPresentType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item))
              // ),
              // lopday: getAssignLeaveDayForLop(
              //   getFinalLop(getAttModeLop(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)), getAttModeLopType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)))
              // ),
              // paidpresentday: getAssignLeaveDayForPaid(
              //   getFinalPaid(getAttModePaidPresent(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)), getAttModePaidPresentType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)))
              // ),
            }));

            const res_MonthSet = await axios.post(SERVICE.DEPTMONTHSET_PROD_LIMITED, {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
              date: daypointsupload.date,
            });

            let filteredMonthsets = res_MonthSet.data.departmentdetails;

            let itemsWithSerialNumberKeyChanged = itemsWithSerialNumber.map((data) => {
              let findMonthStartDate = filteredMonthsets.find((d) => new Date(daypointsupload.date) >= new Date(d.fromdate) && new Date(daypointsupload.date) <= new Date(d.todate) && d.department === data.department);

              let findDate = findMonthStartDate ? findMonthStartDate.fromdate : daypointsupload.date;
              const groupedByMonthProcs = {};

              // Group items by month
              data.assignExpLog &&
                data.assignExpLog.forEach((d) => {
                  const monthYear = d.updatedate?.split('-').slice(0, 2).join('-');
                  if (!groupedByMonthProcs[monthYear]) {
                    groupedByMonthProcs[monthYear] = [];
                  }
                  groupedByMonthProcs[monthYear].push(d);
                });

              // Extract the last item of each group
              const lastItemsForEachMonthPros = Object.values(groupedByMonthProcs).map((group) => group[group.length - 1]);

              // Filter the data array based on the month and year
              lastItemsForEachMonthPros.sort((a, b) => {
                return new Date(a.updatedate) - new Date(b.updatedate);
              });
              // Find the first item in the sorted array that meets the criteria
              let filteredItem = null;

              for (let i = 0; i < lastItemsForEachMonthPros.length; i++) {
                const date = lastItemsForEachMonthPros[i].updatedate;

                if (daypointsupload.date >= date) {
                  filteredItem = lastItemsForEachMonthPros[i];
                } else {
                  break;
                }
              }
              // let modevalue = item.assignExpLog[item.assignExpLog.length - 1];
              let modevalue = filteredItem;

              const calculateMonthsBetweenDates = (startDate, endDate) => {
                if (startDate && endDate) {
                  const start = new Date(startDate);
                  const end = new Date(endDate);

                  let years = end.getFullYear() - start.getFullYear();
                  let months = end.getMonth() - start.getMonth();
                  let days = end.getDate() - start.getDate();

                  // Convert years to months
                  months += years * 12;

                  // Adjust for negative days
                  if (days < 0) {
                    months -= 1; // Subtract a month
                    days += new Date(end.getFullYear(), end.getMonth(), 0).getDate(); // Add days of the previous month
                  }

                  // Adjust for days 15 and above
                  if (days >= 15) {
                    months += 1; // Count the month if 15 or more days have passed
                  }

                  return months;
                }

                return 0; // Return 0 if either date is missing
              };

              // Calculate difference in months between findDate and data.doj
              let differenceInMonths, differenceInMonthsexp, differenceInMonthstar;
              if (modevalue) {
                //findexp end difference yes/no
                if (modevalue.endexp === 'Yes') {
                  differenceInMonthsexp = calculateMonthsBetweenDates(data.doj, modevalue.endexpdate);
                  //  Math.floor((new Date(modevalue.endexpdate) - new Date(data.doj)) / (30 * 24 * 60 * 60 * 1000));
                  if (modevalue.expmode === 'Add') {
                    differenceInMonthsexp += parseInt(modevalue.expval);
                  } else if (modevalue.expmode === 'Minus') {
                    differenceInMonthsexp -= parseInt(modevalue.expval);
                  } else if (modevalue.expmode === 'Fix') {
                    differenceInMonthsexp = parseInt(modevalue.expval);
                  }
                } else {
                  differenceInMonthsexp = calculateMonthsBetweenDates(data.doj, findDate);
                  // Math.floor((new Date(findDate) - new Date(data.doj)) / (30 * 24 * 60 * 60 * 1000));
                  if (modevalue.expmode === 'Add') {
                    differenceInMonthsexp += parseInt(modevalue.expval);
                  } else if (modevalue.expmode === 'Minus') {
                    differenceInMonthsexp -= parseInt(modevalue.expval);
                  } else if (modevalue.expmode === 'Fix') {
                    differenceInMonthsexp = parseInt(modevalue.expval);
                  } else {
                    // differenceInMonths = parseInt(modevalue.expval);
                    differenceInMonthsexp = calculateMonthsBetweenDates(data.doj, findDate);
                  }
                }

                //findtar end difference yes/no
                if (modevalue.endtar === 'Yes') {
                  differenceInMonthstar = calculateMonthsBetweenDates(data.doj, modevalue.endtardate);
                  //  Math.floor((new Date(modevalue.endtardate) - new Date(data.doj)) / (30 * 24 * 60 * 60 * 1000));
                  if (modevalue.expmode === 'Add') {
                    differenceInMonthstar += parseInt(modevalue.expval);
                  } else if (modevalue.expmode === 'Minus') {
                    differenceInMonthstar -= parseInt(modevalue.expval);
                  } else if (modevalue.expmode === 'Fix') {
                    differenceInMonthstar = parseInt(modevalue.expval);
                  }
                } else {
                  differenceInMonthstar = calculateMonthsBetweenDates(data.doj, findDate);
                  if (modevalue.expmode === 'Add') {
                    differenceInMonthstar += parseInt(modevalue.expval);
                  } else if (modevalue.expmode === 'Minus') {
                    differenceInMonthstar -= parseInt(modevalue.expval);
                  } else if (modevalue.expmode === 'Fix') {
                    differenceInMonthstar = parseInt(modevalue.expval);
                  } else {
                    // differenceInMonths = parseInt(modevalue.expval);
                    differenceInMonthstar = calculateMonthsBetweenDates(data.doj, findDate);
                  }
                }

                differenceInMonths = calculateMonthsBetweenDates(data.doj, findDate);
                if (modevalue.expmode === 'Add') {
                  differenceInMonths += parseInt(modevalue.expval);
                } else if (modevalue.expmode === 'Minus') {
                  differenceInMonths -= parseInt(modevalue.expval);
                } else if (modevalue.expmode === 'Fix') {
                  differenceInMonths = parseInt(modevalue.expval);
                } else {
                  // differenceInMonths = parseInt(modevalue.expval);
                  differenceInMonths = calculateMonthsBetweenDates(data.doj, findDate);
                }
              } else {
                differenceInMonthsexp = calculateMonthsBetweenDates(data.doj, findDate);
                differenceInMonthstar = calculateMonthsBetweenDates(data.doj, findDate);
                differenceInMonths = calculateMonthsBetweenDates(data.doj, findDate);
              }

              let filteredItemProcess = null;

              if (data && data.processlog) {
                const groupedByMonthProcs = {};

                // Group items by month
                // userInfo.processlog &&
                data.processlog.forEach((d) => {
                  const monthYear = d.date?.split('-').slice(0, 2).join('-');
                  if (!groupedByMonthProcs[monthYear]) {
                    groupedByMonthProcs[monthYear] = [];
                  }
                  groupedByMonthProcs[monthYear].push(d);
                });

                // Extract the last item of each group
                const lastItemsForEachMonthPros = Object.values(groupedByMonthProcs).map((group) => group[group.length - 1]);

                // Filter the data array based on the month and year
                lastItemsForEachMonthPros.sort((a, b) => {
                  return new Date(a.date) - new Date(b.date);
                });
                // Find the first item in the sorted array that meets the criteria

                for (let i = 0; i < lastItemsForEachMonthPros.length; i++) {
                  const date = lastItemsForEachMonthPros[i].date;

                  if (daypointsupload.date >= date) {
                    filteredItemProcess = lastItemsForEachMonthPros[i];
                  } else {
                    break;
                  }
                }
              }
              let getprocess = filteredItemProcess != undefined || filteredItemProcess != null ? filteredItemProcess.process : '';
              let findexpval = differenceInMonthstar < 1 ? '00' : differenceInMonthstar <= 9 ? '0' + differenceInMonthstar : differenceInMonthstar;

              let getprocessCode = getprocess + findexpval;

              let findSalDetails = targetPoints.find((d) => d.branch === data.branch && d.company === data.company && d.processcode === getprocessCode);

              let findTargetVal = findSalDetails ? Number(findSalDetails.points) : 0;

              return {
                name: data.username,
                points: 0,
                point: 0,
                target: findTargetVal,
                date: daypointsupload.date,
                empname: data.username,
                empcode: data.empcode,
                company: data.company,
                fromtodate: '2000-11-11T00:00:00.000Z$2000-11-11T00:00:00.000Z',
                unit: data.unit,
                team: data.team,
                dateval: '',
                processcode: getprocess,
                exper: differenceInMonthstar < 1 ? 0 : differenceInMonthstar,

                branch: data.branch,
                shiftsts: 'Disable',
                daypointsts: data.daystatus ? data.daystatus : 'not defined',
                production: 0,
                manual: 0,
                shiftpoints: 0,
                conshiftpoints: 0,
                users: [],
                count: 0,
                avgpoint: 0,
                companyname: data.company,
              };
            });

            let pointEmployeesWithWeekOff = [...finalData, ...itemsWithSerialNumberKeyChanged];
            console.log(pointEmployeesWithWeekOff, 'pointEmployeesWithWeekOff');

            const ans = [
              {
                filename: `ORIGINAL_DAYPOINT_${finaldate}`,
                date: daypointsupload.date,
                uploaddata: pointEmployeesWithWeekOff,
                type: 'nonexcel',
                document: [],
                addedby: [
                  {
                    name: String(username),
                    date: String(new Date()),
                  },
                ],
              },
            ];

            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function () {
              if (this.readyState === 4 && this.status === 200) {
              }
            };

            xmlhttp.open('POST', SERVICE.ADD_DAY_POINTS);
            xmlhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
            xmlhttp.send(JSON.stringify(ans));
            await fetchAllDayPoints();
            setdocumentFiles([]);
            setIsloading(false);
            setShowAlert(
              <>
                <CheckCircleOutlineIcon sx={{ fontSize: '100px', color: '#7ac767' }} />
                <p style={{ fontSize: '20px', fontWeight: 900 }}>{'Created Successfully 👍'}</p>
              </>
            );
            handleClickOpenerr();
          })
          .catch((error) => {
            setIsloading(false);
            console.error('Error in getting all results:', error);
          });
      } else {
        setIsloading(false);
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: '100px', color: 'orange' }} />
            <p style={{ fontSize: '20px', fontWeight: 900 }}>{'Please Create production Day'}</p>
          </>
        );
        handleClickOpenerr();
      }


    }
  };

  // viewdata table
  //datatable....
  const handleSearchChangeView = (event) => {
    setPageView(1);
    setSearchQueryView(event.target.value);
  };
  // Split the search query into individual terms
  const searchTermsView = searchQueryView.toLowerCase().split(' ');
  // Modify the filtering logic to check each term
  const filteredDatasView = itemsListView?.filter((item) => {
    return searchTermsView.every((term) => Object.values(item).join(' ').toLowerCase().includes(term));
  });

  const filteredDataView = filteredDatasView.slice((pageView - 1) * pageSizeView, pageView * pageSizeView);

  const totalPagesView = Math.ceil(filteredDatasView.length / pageSizeView);

  const visiblePagesView = Math.min(totalPagesView, 3);

  const firstVisiblePageView = Math.max(1, pageView - 1);
  const lastVisiblePageView = Math.min(firstVisiblePageView + visiblePagesView - 1, totalPagesView);

  const pageNumbersView = [];

  const indexOfLastItemView = pageView * pageSizeView;
  const indexOfFirstItemView = indexOfLastItemView - pageSizeView;

  for (let i = firstVisiblePageView; i <= lastVisiblePageView; i++) {
    pageNumbersView.push(i);
  }

  const columnDataTableView = [
    {
      field: 'serialNumber',
      headerName: 'SNo',
      flex: 0,
      width: 80,
      hide: !columnVisibilityView.serialNumber,
      headerClassName: 'bold-header',
    },
    {
      field: 'name',
      headerName: 'Name',
      flex: 0,
      width: 250,
      hide: !columnVisibilityView.name,
      headerClassName: 'bold-header',
    },
    {
      field: 'empcode',
      headerName: 'Emp Code',
      flex: 0,
      width: 110,
      hide: !columnVisibilityView.empcode,
      headerClassName: 'bold-header',
    },
    {
      field: 'company',
      headerName: 'Company',
      flex: 0,
      width: 100,
      hide: !columnVisibilityView.company,
      headerClassName: 'bold-header',
    },
    {
      field: 'branch',
      headerName: 'Branch',
      flex: 0,
      width: 120,
      hide: !columnVisibilityView.branch,
      headerClassName: 'bold-header',
    },
    {
      field: 'unit',
      headerName: 'Unit',
      flex: 0,
      width: 90,
      hide: !columnVisibilityView.unit,
      headerClassName: 'bold-header',
    },
    {
      field: 'team',
      headerName: 'Team',
      flex: 0,
      width: 90,
      hide: !columnVisibilityView.team,
      headerClassName: 'bold-header',
    },
    {
      field: 'datenew',
      headerName: 'Date',
      flex: 0,
      width: 220,
      hide: !columnVisibilityView.datenew,
      headerClassName: 'bold-header',
    },
    {
      field: 'filename',
      headerName: 'Category',
      flex: 0,
      width: 250,
      hide: !columnVisibilityView.filename,
      headerClassName: 'bold-header',
    },
    {
      field: 'category',
      headerName: 'Sub Category',
      flex: 0,
      width: 300,
      hide: !columnVisibilityView.category,
      headerClassName: 'bold-header',
    },
    {
      field: 'unitid',
      headerName: 'Identity Name',
      flex: 0,
      width: 120,
      hide: !columnVisibilityView.unitid,
      headerClassName: 'bold-header',
    },
    {
      field: 'user',
      headerName: 'LoginID',
      flex: 0,
      width: 100,
      hide: !columnVisibilityView.user,
      headerClassName: 'bold-header',
    },
    {
      field: 'processcode',
      headerName: 'Process',
      flex: 0,
      width: 100,
      hide: !columnVisibilityView.processcode,
      headerClassName: 'bold-header',
    },
    {
      field: 'exper',
      headerName: 'Experience',
      flex: 0,
      width: 90,
      hide: !columnVisibilityView.exper,
      headerClassName: 'bold-header',
    },
    {
      field: 'target',
      headerName: 'Target',
      flex: 0,
      width: 90,
      hide: !columnVisibilityView.target,
      headerClassName: 'bold-header',
    },
    {
      field: 'points',
      headerName: 'Point',
      flex: 0,
      width: 90,
      hide: !columnVisibilityView.points,
      headerClassName: 'bold-header',
    },
    {
      field: 'avg',
      headerName: 'Avg',
      flex: 0,
      width: 90,
      hide: !columnVisibilityView.avg,
      headerClassName: 'bold-header',
    },
    {
      field: 'aprocess',
      headerName: 'P Process',
      flex: 0,
      width: 100,
      hide: !columnVisibilityView.aprocess,
      headerClassName: 'bold-header',
    },
    {
      field: 'sprocess',
      headerName: 'S Process',
      flex: 0,
      width: 100,
      hide: !columnVisibilityView.sprocess,
      headerClassName: 'bold-header',
    },
    {
      field: 'contarget',
      headerName: 'Con Target',
      flex: 0,
      width: 90,
      hide: !columnVisibilityView.contarget,
      headerClassName: 'bold-header',
    },
    {
      field: 'conpoints',
      headerName: 'Con Points',
      flex: 0,
      width: 90,
      hide: !columnVisibilityView.conpoints,
      headerClassName: 'bold-header',
    },
    {
      field: 'conavg',
      headerName: 'Con Avg',
      flex: 0,
      width: 90,
      hide: !columnVisibilityView.conavg,
      headerClassName: 'bold-header',
    },
  ];

  const rowDataTableView = filteredDataView.map((item, index) => {
    return {
      ...item,
      id: item.serialNumber,
      datenew: item.datenew,
      serialNumber: item.serialNumber,
      company: item.company,
      branch: item.branch,
      unit: item.unit,
      unitid: item.unitid,
      user: item.user,
      team: item.team,
      name: item.name,
      empcode: item.empcode,
      filename: item.filename,
      category: item.category,
      exper: item.exper,
      target: item.target,
      points: Number(item.points),
      dateval: item.dateval,
      processcode: item.processcode,
      aprocess: item.aprocess,
      sprocess: item.sprocess,
      avg: item.avg,
      contarget: item.contarget,
      conpoints: item.conpoints,
      conavg: item.conavg,
    };
  });

  // pdf.....
  const columnsView = [
    { title: 'Sno', field: 'serialNumber' },
    { title: 'Name', field: 'name' },
    { title: 'Empcode', field: 'empcode' },
    { title: 'Company', field: 'company' },
    { title: 'Branch', field: 'branch' },
    { title: 'Unit', field: 'unit' },
    { title: 'Team', field: 'unit' },
    { title: 'Date', field: 'dateval' },
    { title: 'LoginId', field: 'user' },
    { title: 'Identity Name', field: 'unitid' },
    { title: 'Category', field: 'filename' },
    { title: 'Subcategory', field: 'category' },
    { title: 'Experience', field: 'exper' },
    { title: 'Target', field: 'target' },
    { title: 'Points', field: 'points' },
    { title: 'Avg', field: 'avg' },
    { title: 'Processcode', field: 'processcode' },
    { title: 'P process', field: 'aprocess' },
    { title: 'S process', field: 'sprocess' },
    { title: 'Con Target', field: 'contarget' },
    { title: 'Con Points', field: 'conpoints' },
    { title: 'Con Avg', field: 'conavg' },
  ];

  //  pdf download functionality
  const downloadPdfView = () => {
    const doc = new jsPDF();

    doc.autoTable({
      theme: 'grid',
      styles: {
        fontSize: 6,
        cellWidth: 'auto',
      },
      columns: columnsView.map((col) => ({ ...col, dataKey: col.field })),
      body: rowDataTableView,
    });
    doc.save('DataPointsUpload.pdf');
  };

  //image
  const handleCaptureImageView = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, 'Day_points.png');
        });
      });
    }
  };
  //print...
  const componentRefview = useRef();
  const handleprintview = useReactToPrint({
    content: () => componentRefview.current,
    documentTitle: 'Day_points',
    pageStyle: 'print',
  });

  //Datatable
  const handlePageChangeView = (newPage) => {
    setPageView(newPage);
  };

  const handlePageSizeChangeView = (event) => {
    setPageSizeView(Number(event.target.value));
    setPageView(1);
  };

  const [targetPoints, setTargetPoints] = useState([]);
  const [categoryProcessMap, setCategoryProcessMap] = useState([]);

  const fetchTargetCategoryProcessMap = async () => {
    try {
      const [resTarget, resCate, resVendor, resFreq] = await Promise.all([
        axios.get(SERVICE.TARGETPOINTS_LIMITED, {
          headers: { Authorization: `Bearer ${auth.APIToken}` },
        }),
        axios.get(SERVICE.CATEGORYPROCESSMAP_LIMITED, {
          headers: { Authorization: `Bearer ${auth.APIToken}` },
        }),
        axios.get(SERVICE.ATTENDANCE_STATUS, {
          headers: { Authorization: `Bearer ${auth.APIToken}` },
        }),
        axios.get(SERVICE.ATTENDANCE_MODE_STATUS, {
          headers: { Authorization: `Bearer ${auth.APIToken}` },
        }),
      ]);

      setTargetPoints(resTarget.data.targetpoints);
      setCategoryProcessMap(resCate.data.categoryprocessmaps);
      setAttStatus(resVendor?.data?.attendancestatus);
      setAttModearr(resFreq?.data?.allattmodestatus);
    } catch (err) {
      console.log(err);
      setIsSingleLoader(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const addSerialNumberView = async () => {
    try {
      setIsSingleLoader(true);

      // console.log(singleUserDataView[0],'singleUserDataView')
      const itemsWithSerialNumber = singleUserDataView?.map((item, index) => {
        let roundedPoints = Number(item.points.toFixed(5));

        let avgPointValue = item.target > 0 ? Number(((roundedPoints / item.target) * 100).toFixed(3)) : '';

        const [findProj] = item.vendor.split('-');
        const filenamesplited = item.filename;

        let findPrimaryProcess = categoryProcessMap.find(
          (d) =>
            // console.log( d.company === item.company , d.branch === item.branch , d.processtypes === "Primary" , d.process.slice(-4) === item.processcode?.slice(-4) , findProj === d.project , d.categoryname.toLowerCase(), filenamesplited.toLowerCase())
            d.company === item.company && d.branch === item.branch && d.processtypes === 'Primary' && d.process.slice(-4) === item.processcode?.slice(-4) && findProj === d.project && d.categoryname.toLowerCase() === filenamesplited.toLowerCase()
        );
        let findSecondayProcess = categoryProcessMap.find(
          (d) => d.company === item.company && d.branch === item.branch && d.processtypes === 'Secondary' && d.process === item.processcode && findProj === d.project && d.categoryname.toLowerCase() === filenamesplited.toLowerCase()
        );

        let AprocessValue = findPrimaryProcess && findPrimaryProcess.processtypes === 'Primary' ? findPrimaryProcess.process : '';
        let SprocessValue = findSecondayProcess && findSecondayProcess.processtypes === 'Secondary' ? findSecondayProcess.process : '';

        let AlterProcessCode = AprocessValue + (Number(item.exper) < 9 ? `0${item.exper}` : item.exper);

        let conTargetValue = 0;
        let conPoints = 0;

        let conavg = 0;
        if (AprocessValue === '' && SprocessValue === '') {
          conTargetValue = 0;
          conPoints = 0;

          conavg = 0;
        } else {
          let findSalDetailsForAlterProcess = targetPoints.find((d) => d.branch === item.branch && d.company === item.company && d.processcode === AlterProcessCode);

          // console.log(findSalDetailsForAlterProcess)
          let findTargetValForAlterProcess = findSalDetailsForAlterProcess ? Number(findSalDetailsForAlterProcess.points) : '';

          conTargetValue = SprocessValue === '' && AprocessValue !== item.processcode ? findTargetValForAlterProcess : item.target;
          conPoints = SprocessValue === '' && AprocessValue !== item.processcode && conTargetValue > 0 ? (item.target / findTargetValForAlterProcess) * item.points : item.points;

          conavg = SprocessValue === '' && AprocessValue !== item.processcode && conTargetValue > 0 ? (((item.target / findTargetValForAlterProcess) * item.points) / item.target) * 100 : avgPointValue;
        }

        return {
          ...item,
          serialNumber: index + 1,
          // avg:(Number(item.points) / Number(item.target)) * 100,
          exper: Number(item.exper),
          target: Number(item.target),
          aprocess: AprocessValue,
          filename: item.filename.split('.x')[0],
          sprocess: SprocessValue,
          points: Number(roundedPoints),
          avg: Number(avgPointValue),
          contarget: Number(conTargetValue),
          conpoints: item.mode === 'Manual' && item.lateentrystatus === 'Late Entry' ? 0 : conPoints > 0 ? Number(conPoints).toFixed(6) : conPoints,
          conavg: item.mode === 'Manual' && item.lateentrystatus === 'Late Entry' ? 0 : conavg > 0 ? Number(conavg).toFixed(6) : conavg,
        };
      });
      setItemsListView(itemsWithSerialNumber);
      // console.log(itemsWithSerialNumber[0])
      setIsSingleLoader(false);
    } catch (err) {
      setIsSingleLoader(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    addSerialNumberView();
  }, [singleUserDataView]);

  // Show All Columns functionality
  const handleShowAllColumnsView = () => {
    const updatedVisibilityView = { ...columnVisibilityView };
    for (const columnKey in updatedVisibilityView) {
      updatedVisibilityView[columnKey] = true;
    }
    setColumnVisibilityView(updatedVisibilityView);
  };

  useEffect(() => {
    // Retrieve column visibility from localStorage (if available)
    const savedVisibilityView = localStorage.getItem('columnVisibilityView');
    if (savedVisibilityView) {
      setColumnVisibilityView(JSON.parse(savedVisibilityView));
    }
  }, []);

  useEffect(() => {
    // Save column visibility to localStorage whenever it changes
    localStorage.setItem('columnVisibilityView', JSON.stringify(columnVisibilityView));
  }, [columnVisibilityView]);

  // // Function to filter columns based on search query
  const filteredColumnsView = columnDataTableView.filter((column) => column.headerName.toLowerCase().includes(searchQueryManageView.toLowerCase()));

  // Manage Columns functionality
  const toggleColumnVisibilityView = (field) => {
    setColumnVisibilityView((prevVisibilityView) => ({
      ...prevVisibilityView,
      [field]: !prevVisibilityView[field],
    }));
  };

  // JSX for the "Manage Columns" popover content
  const manageColumnsContentView = (
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
        onClick={handleCloseManageColumnsView}
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
        <TextField label="Find column" variant="standard" fullWidth value={searchQueryManageView} onChange={(e) => setSearchQueryManageView(e.target.value)} sx={{ marginBottom: 5, position: 'absolute' }} />
      </Box>
      <br />
      <br />
      <DialogContent sx={{ minWidth: 'auto', height: '200px', position: 'relative' }}>
        <List sx={{ overflow: 'auto', height: '100%' }}>
          {filteredColumnsView.map((column) => (
            <ListItem key={column.field}>
              <ListItemText
                sx={{ display: 'flex' }}
                primary={<Switch sx={{ marginTop: '-5px' }} size="small" checked={columnVisibilityView[column.field]} onChange={() => toggleColumnVisibilityView(column.field)} />}
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
            <Button variant="text" sx={{ textTransform: 'none' }} onClick={() => setColumnVisibilityView(initialColumnVisibilityView)}>
              Show All
            </Button>
          </Grid>
          <Grid item md={4}></Grid>
          <Grid item md={4}>
            <Button
              variant="text"
              sx={{ textTransform: 'none' }}
              onClick={() => {
                const newColumnVisibilityView = {};
                columnDataTableView.forEach((column) => {
                  newColumnVisibilityView[column.field] = false; // Set hide property to true
                });
                setColumnVisibilityView(newColumnVisibilityView);
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
      <Headtitle title={'DAY POINTS UPLOAD'} />
      <PageHeading title="Manage Production Points-Upload" modulename="Production" submodulename="Upload" mainpagename="Original" subpagename="Day Points Uplaod" subsubpagename="" />
      {isUserRoleCompare?.includes('ldaypointsupload') && (
        <Box sx={userStyle.container}>
          <Grid container spacing={2}>
            <Grid item md={2} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  Date <b style={{ color: 'red' }}>*</b>
                </Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="date"
                  placeholder="Please Enter Name"
                  value={daypointsupload.date}
                  onChange={(e) => {
                    setDayPointsUpload({
                      ...daypointsupload,
                      date: e.target.value,
                    });

                    setItems([]);
                    setFileName('');
                    setShow(false);
                    setFileupload('');
                    setAlertButton(false);
                    setDataArrayLength('');
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={2} xs={12} sm={12} marginTop={3}>
              {/* <Button variant="contained" disabled={items.length > 0} }>
                Create
              </Button> */}
              <LoadingButton
                disabled={dataArrayLength > 0}
                loading={isloading}
                onClick={() => handleFilterSave()}
                color="primary"
                // size="small"
                // sx={{ textTransform: "capitalize" }}
                loadingPosition="end"
                variant="contained"
              >
                {' '}
                Create
              </LoadingButton>
            </Grid>
          </Grid>
          <br />
          <Grid container>
            <Grid item md={5.7} sm={5.7} lg={5.7} xs={5.7} marginTop={1}>
              <Divider />
            </Grid>
            <Grid item md={0.6} sm={0.6} lg={0.6} xs={0.6} sx={{ display: 'flex', justifyContent: 'center' }}>
              {' '}
              <Typography>(OR)</Typography>
            </Grid>
            <Grid item md={5.7} sm={5.7} lg={5.7} xs={5.7} marginTop={1}>
              {' '}
              <Divider />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            {dataArrayLength > 0 && AlertButton ? <Alert severity="success">File Accepted!</Alert> : null}
            {dataArrayLength == 0 && dataupdated == 'uploaded' && AlertButton ? <Alert severity="error">No data to upload!</Alert> : null}
          </Box>
          <br />
          <Grid container spacing={2}>
            <Grid item md={2}>
              <Button variant="contained" component="label" sx={userStyle.uploadBtn}>
                Upload
                <input
                  id="resume"
                  name="file"
                  hidden
                  type="file"
                  accept=".xlsx, .xls , .csv"
                  onChange={(e) => {
                    // handleResumeUpload(e);
                    const file = e.target.files[0];
                    setFileupload(file);
                    setDataupdated('uploaded');
                    readExcel(file, file.name, e);
                    setFileName(file.name);
                    e.target.value = null;
                  }}
                />
              </Button>
            </Grid>
            <Grid item md={7}>
              {fileName && dataArrayLength > 0 ? (
                <Box sx={{ display: 'flex', justifyContent: 'left' }}>
                  <p>{fileName}</p>
                  <Button onClick={() => clearFileSelection()}>
                    <FaTrash style={{ color: 'red' }} />
                  </Button>
                </Box>
              ) : null}
            </Grid>
            <Grid item md={2}>
              {show && dataArrayLength > 0 && (
                <>
                  <div>
                    <div readExcel={readExcel} />
                    <SendToServer sendJSON={sendJSON} />
                  </div>
                </>
              )}
            </Grid>
          </Grid>
          <br />
          <Button variant="contained" color="success" sx={{ textTransform: 'Capitalize' }} onClick={(e) => ExportsHead()}>
            <FaDownload />
            &ensp;Download template file
          </Button>
        </Box>
      )}
      <br />
      {/* ALERT DIALOG */}
      <Box>
        <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
            {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} /> */}
            <Typography variant="h6">{showAlert}</Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error" onClick={handleCloseerr}>
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes('ldaypointsupload') && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>List Day Point-File Upload</Typography>
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
                    <MenuItem value={daypointslist?.length}>All</MenuItem>
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
                  {isUserRoleCompare?.includes('exceldaypointsupload') && (
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
                  {isUserRoleCompare?.includes('csvdaypointsupload') && (
                    <>
                      <Button
                        onClick={(e) => {
                          setIsFilterOpen(true);
                          setFormat('csv');
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileExcel />
                        &ensp;Export to CSV&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes('printdaypointsupload') && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes('pdfdaypointsupload') && (
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
                  {isUserRoleCompare?.includes('imagedaypointsupload') && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                        <ImageIcon sx={{ fontSize: '15px' }} /> &ensp;Image&ensp;
                      </Button>
                    </>
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
            &ensp;
            {!daypointslist ? (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  {/* <CircularProgress color="inherit" />  */}
                  <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                </Box>
              </>
            ) : (
              <>
                <Box
                  style={{
                    width: '100%',
                    overflowY: 'hidden', // Hide the y-axis scrollbar
                  }}
                >
                  <StyledDataGrid
                    onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
                    rows={rowsWithCheckboxes}
                    columns={columnDataTable.filter((column) => columnVisibility[column.field])}
                    onSelectionModelChange={handleSelectionChange}
                    selectionModel={selectedRows}
                    autoHeight={true}
                    ref={gridRef}
                    density="compact"
                    hideFooter
                    getRowClassName={getRowClassName}
                    disableRowSelectionOnClick
                  />
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
                      <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChange(pageNumber)} className={page === pageNumber ? 'active' : ''} disabled={page === pageNumber}>
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
      {/*DELETE ALERT DIALOG */}
      <Dialog open={isDeleteOpen} onClose={handleCloseMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: '80px', color: 'orange' }} />
          <Typography variant="h5" sx={{ color: 'red', textAlign: 'center' }}>
            Are you sure?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseMod}
            style={{
              backgroundColor: '#f4f4f4',
              color: '#444',
              boxShadow: 'none',
              borderRadius: '3px',
              border: '1px solid #0000006b',
              '&:hover': {
                '& .css-bluauu-MuiButtonBase-root-MuiButton-root': {
                  backgroundColor: '#f4f4f4',
                },
              },
            }}
          >
            Cancel
          </Button>
          <Button autoFocus variant="contained" color="error" onClick={(e) => delBrand(brandid)}>
            {' '}
            OK{' '}
          </Button>
        </DialogActions>
      </Dialog>
      {/* print layout */}
      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRef}>
          <TableHead>
            <TableRow>
              <TableCell> SI.No</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Filename</TableCell>
            </TableRow>
          </TableHead>
          <TableBody align="left">
            {daypointslist &&
              daypointslist.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{moment(row.date).format('DD-MM-YYYY')}</TableCell>
                  <TableCell>{row.filename}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* print layout 2*/}
      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRefviewall}>
          <TableHead>
            <TableRow>
              <TableCell>S.no</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Employee Code</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Branch</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Team</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Exper</TableCell>
              <TableCell>Target</TableCell>
              <TableCell>Production</TableCell>
              <TableCell>Manual</TableCell>
              <TableCell>Point</TableCell>
              <TableCell>Allowance Point</TableCell>
              <TableCell>Non-Allowance Point</TableCell>
              <TableCell>Average Point</TableCell>
            </TableRow>
          </TableHead>
          <TableBody align="left">
            {rowDataTableviewAll &&
              rowDataTableviewAll.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.empcode}</TableCell>
                  <TableCell>{row.companyname}</TableCell>
                  <TableCell>{row.branch}</TableCell>
                  <TableCell>{row.unit}</TableCell>
                  <TableCell>{row.team}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.exper}</TableCell>
                  <TableCell>{row.target}</TableCell>
                  <TableCell>{row.production}</TableCell>
                  <TableCell>{row.manual}</TableCell>
                  <TableCell>{row.point}</TableCell>
                  <TableCell>{row.allowancepoint}</TableCell>
                  <TableCell>{row.nonallowancepoint}</TableCell>
                  <TableCell>{row.avgpoint}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* print layout 3*/}

      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRefview}>
          <TableHead>
            <TableRow>
              <TableCell>S.no</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Employee Code</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Branch</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Team</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>LoginId</TableCell>
              <TableCell>Identity Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Subcategory</TableCell>
              <TableCell>Experience</TableCell>
              <TableCell>Target</TableCell>
              <TableCell>Points</TableCell>
              <TableCell>Avg</TableCell>
              <TableCell>Processcode</TableCell>
              <TableCell>P process</TableCell>
              <TableCell>S process</TableCell>
              <TableCell>Con Target</TableCell>
              <TableCell>Con Points</TableCell>
              <TableCell>Con Avg</TableCell>
            </TableRow>
          </TableHead>
          <TableBody align="left">
            {rowDataTableviewAll &&
              rowDataTableviewAll.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.empcode}</TableCell>
                  <TableCell>{row.company}</TableCell>
                  <TableCell>{row.branch}</TableCell>
                  <TableCell>{row.unit}</TableCell>
                  <TableCell>{row.team}</TableCell>
                  <TableCell>{row.dateval}</TableCell>
                  <TableCell>{row.user}</TableCell>
                  <TableCell>{row.unitid}</TableCell>
                  <TableCell>{row.filename}</TableCell>
                  <TableCell>{row.category}</TableCell>
                  <TableCell>{row.exper}</TableCell>
                  <TableCell>{row.target}</TableCell>
                  <TableCell>{row.points}</TableCell>
                  <TableCell>{row.avg}</TableCell>
                  <TableCell>{row.processcode}</TableCell>
                  <TableCell>{row.aprocess}</TableCell>
                  <TableCell>{row.sprocess}</TableCell>
                  <TableCell>{row.contarget}</TableCell>
                  <TableCell>{row.conpoints}</TableCell>
                  <TableCell>{row.conavg}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ****** Instructions Box Ends ****** */}

      {/* viewAll model */}
      <Dialog open={openviewAll} onClose={handleClickOpenviewAll} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" fullWidth={true} maxWidth="1400px">
        <DialogContent>
          <>
            <Typography sx={userStyle.HeaderText}>{fileNameView}</Typography>
            {/* <br /> */}
            <Grid container style={userStyle.dataTablestyle}>
              <Grid item md={2} xs={12} sm={12}>
                <Box>
                  <label>Show entries:</label>
                  <Select
                    id="pageSizeSelect"
                    value={pageSizeviewAll}
                    size="small"
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 180,
                          width: 80,
                        },
                      },
                    }}
                    onChange={handlePageSizeChangeviewAll}
                    sx={{ width: '77px' }}
                  >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                    <MenuItem value={productionoriginalviewAll?.length}>All</MenuItem>
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
                  {isUserRoleCompare?.includes('exceldaypointsupload') && (
                    <>
                      <>
                        <Button
                          onClick={(e) => {
                            setIsFilterOpenView(true);

                            setFormat('xl');
                          }}
                          sx={userStyle.buttongrp}
                        >
                          <FaFileExcel />
                          &ensp;Export to Excel&ensp;
                        </Button>
                      </>
                    </>
                  )}
                  {isUserRoleCompare?.includes('csvdaypointsupload') && (
                    <>
                      <Button
                        onClick={(e) => {
                          setIsFilterOpenView(true);
                          setFormat('csv');
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileExcel />
                        &ensp;Export to CSV&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes('printdaypointsupload') && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprintviewall}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes('pdfdaypointsupload') && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={() => downloadPdfviewall()}>
                        <FaFilePdf />
                        &ensp;Export to PDF&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes('imagedaypointsupload') && (
                    <Button sx={userStyle.buttongrp} onClick={handleCaptureImageviewall}>
                      {' '}
                      <ImageIcon sx={{ fontSize: '15px' }} /> &ensp;Image&ensp;{' '}
                    </Button>
                  )}
                </Box>
              </Grid>
              <Grid item md={2} xs={6} sm={6}>
                <Box>
                  <FormControl fullWidth size="small">
                    <Typography>Search</Typography>
                    <OutlinedInput id="component-outlined" type="text" value={searchQueryviewAll} onChange={handleSearchChangeviewAll} />
                  </FormControl>
                </Box>
              </Grid>
            </Grid>
            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumnsviewAll}>
              Show All Columns
            </Button>
            &ensp;
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsviewAll}>
              Manage Columns
            </Button>
            <br />
            {/* Manage Column */}
            <Popover
              id={idviewall}
              open={isManageColumnsOpenviewAll}
              anchorEl={anchorElviewAll}
              onClose={handleCloseManageColumnsviewAll}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              {manageColumnsContentviewAll}
            </Popover>
            {/* <br /> */}
            {!productionfirstViewCheck ? (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <FacebookCircularProgress />
                </Box>
              </>
            ) : (
              <>
                <Box
                  style={{
                    overflowY: 'hidden', // Hide the y-axis scrollbar
                  }}
                >
                  <StyledDataGrid
                    onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
                    rows={rowDataTableviewAll}
                    columns={columnDataTableviewAll.filter((column) => columnVisibilityviewAll[column.field])}
                    onSelectionModelChange={handleSelectionChange}
                    autoHeight={true}
                    ref={gridRefviewall}
                    density="compact"
                    hideFooter
                    getRowClassName={getRowClassName}
                    disableRowSelectionOnClick
                  />
                </Box>
                <Box style={userStyle.dataTablestyle}>
                  <Box>
                    Showing {filteredDataviewAlls.length > 0 ? (pageviewAll - 1) * pageSizeviewAll + 1 : 0} to {Math.min(pageviewAll * pageSizeviewAll, filteredDataviewAlls.length)} of {filteredDataviewAlls.length} entries
                  </Box>
                  <Box>
                    <Button onClick={() => setPageviewAll(1)} disabled={pageviewAll === 1} sx={userStyle.paginationbtn}>
                      <FirstPageIcon />
                    </Button>
                    <Button onClick={() => handlePageChangeviewAll(pageviewAll - 1)} disabled={pageviewAll === 1} sx={userStyle.paginationbtn}>
                      <NavigateBeforeIcon />
                    </Button>
                    {pageNumbersviewall?.map((pageNumberviewAll) => (
                      <Button key={pageNumberviewAll} sx={userStyle.paginationbtn} onClick={() => handlePageChangeviewAll(pageNumberviewAll)} className={pageviewAll === pageNumberviewAll ? 'active' : ''} disabled={pageviewAll === pageNumberviewAll}>
                        {pageNumberviewAll}
                      </Button>
                    ))}
                    {lastVisiblePageviewAll < totalPagesviewAll && <span>...</span>}
                    <Button onClick={() => handlePageChangeviewAll(pageviewAll + 1)} disabled={pageviewAll === totalPages} sx={userStyle.paginationbtn}>
                      <NavigateNextIcon />
                    </Button>
                    <Button onClick={() => setPageviewAll(totalPagesviewAll)} disabled={pageviewAll === totalPagesviewAll} sx={userStyle.paginationbtn}>
                      <LastPageIcon />
                    </Button>
                  </Box>
                </Box>
              </>
            )}
          </>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={handleCloseviewAll}>
            Back
          </Button>
        </DialogActions>
      </Dialog>

      {/* LIST VIEW SINGLE USER */}

      {/* View model */}
      <Dialog open={openSingleUserView} onClose={handleClickSingleUserOpenView} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" fullWidth={true} maxWidth="1400px">
        <DialogContent>
          <>
            <Typography sx={userStyle.HeaderText}>Production Points</Typography>
            {/* <br /> */}
            <Grid container style={userStyle.dataTablestyle}>
              <Grid item md={2} xs={12} sm={12}>
                <Box>
                  <label>Show entries:</label>
                  <Select
                    id="pageSizeSelect"
                    value={pageSizeView}
                    size="small"
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 180,
                          width: 80,
                        },
                      },
                    }}
                    onChange={handlePageSizeChangeView}
                    sx={{ width: '77px' }}
                  >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                    <MenuItem value={singleUserDataView?.length}>All</MenuItem>
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
                  {isUserRoleCompare?.includes('exceldaypointsupload') && (
                    <>
                      <Button
                        onClick={(e) => {
                          setIsFilterOpenViewAll(true);
                          setFormat('xl');
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileExcel />
                        &ensp;Export to Excel&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes('csvdaypointsupload') && (
                    <>
                      <Button
                        onClick={(e) => {
                          setIsFilterOpenViewAll(true);
                          setFormat('csv');
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileExcel />
                        &ensp;Export to CSV&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes('printdaypointsupload') && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprintview}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes('pdfdaypointsupload') && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={() => downloadPdfView()}>
                        <FaFilePdf />
                        &ensp;Export to PDF&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes('imagedaypointsupload') && (
                    <Button sx={userStyle.buttongrp} onClick={handleCaptureImageView}>
                      {' '}
                      <ImageIcon sx={{ fontSize: '15px' }} /> &ensp;Image&ensp;{' '}
                    </Button>
                  )}
                </Box>
              </Grid>
              <Grid item md={2} xs={6} sm={6}>
                <Box>
                  <FormControl fullWidth size="small">
                    <Typography>Search</Typography>
                    <OutlinedInput id="component-outlined" type="text" value={searchQueryView} onChange={handleSearchChangeView} />
                  </FormControl>
                </Box>
              </Grid>
            </Grid>
            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumnsView}>
              Show All Columns
            </Button>
            &ensp;
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsView}>
              Manage Columns
            </Button>
            <br />
            {/* Manage Column */}
            <Popover
              id={idView}
              open={isManageColumnsOpenView}
              anchorEl={anchorElView}
              onClose={handleCloseManageColumnsView}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              {manageColumnsContentView}
            </Popover>
            {/* <br /> */}
            {isSingleLoader ? (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <FacebookCircularProgress />
                </Box>
              </>
            ) : (
              <>
                <Box
                  style={{
                    overflowY: 'hidden', // Hide the y-axis scrollbar
                  }}
                >
                  <CustomStyledDataGrid
                    onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
                    rows={rowDataTableView}
                    columns={columnDataTableView.filter((column) => columnVisibilityView[column.field])}
                    autoHeight={true}
                    ref={gridRefView}
                    density="compact"
                    hideFooter
                    getRowClassName={getRowClassNameCategoryview}
                    disableRowSelectionOnClick
                  />
                </Box>
                <Box style={userStyle.dataTablestyle}>
                  <Box>
                    Showing {filteredDataView.length > 0 ? (pageView - 1) * pageSizeView + 1 : 0} to {Math.min(pageView * pageSizeView, filteredDatasView.length)} of {filteredDatasView.length} entries
                  </Box>
                  <Box>
                    <Button onClick={() => setPageView(1)} disabled={pageView === 1} sx={userStyle.paginationbtn}>
                      <FirstPageIcon />
                    </Button>
                    <Button onClick={() => handlePageChangeView(pageView - 1)} disabled={pageView === 1} sx={userStyle.paginationbtn}>
                      <NavigateBeforeIcon />
                    </Button>
                    {pageNumbersView?.map((pageNumberView) => (
                      <Button key={pageNumberView} sx={userStyle.paginationbtn} onClick={() => handlePageChangeView(pageNumberView)} className={pageView === pageNumberView ? 'active' : ''} disabled={pageView === pageNumberView}>
                        {pageNumberView}
                      </Button>
                    ))}
                    {lastVisiblePageView < totalPagesView && <span>...</span>}
                    <Button onClick={() => handlePageChangeView(pageView + 1)} disabled={pageView === totalPages} sx={userStyle.paginationbtn}>
                      <NavigateNextIcon />
                    </Button>
                    <Button onClick={() => setPageView(totalPagesView)} disabled={pageView === totalPagesView} sx={userStyle.paginationbtn}>
                      <LastPageIcon />
                    </Button>
                  </Box>
                </Box>
              </>
            )}
          </>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={handleClickSingleUserCloseView}>
            Back
          </Button>
        </DialogActions>
      </Dialog>

      <MessageAlert openPopup={openPopupMalert} handleClosePopup={handleClosePopupMalert} popupContent={popupContentMalert} popupSeverity={popupSeverityMalert} />
      {/* SUCCESS */}
      <AlertDialog openPopup={openPopup} handleClosePopup={handleClosePopup} popupContent={popupContent} popupSeverity={popupSeverity} />

      <ExportData
        isFilterOpen={isFilterOpen}
        handleCloseFilterMod={handleCloseFilterMod}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpen}
        isPdfFilterOpen={isPdfFilterOpen}
        setIsPdfFilterOpen={setIsPdfFilterOpen}
        handleClosePdfFilterMod={handleClosePdfFilterMod}
        filteredDataTwo={rowDataTable ?? []}
        itemsTwo={itemsList ?? []}
        filename={'Production Day Point'}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      <ExportDataView
        isFilterOpen={isFilterOpenView}
        handleCloseFilterMod={handleCloseFilterModView}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpenView}
        // isPdfFilterOpen={isPdfFilterOpenView}
        // setIsPdfFilterOpen={setIsPdfFilterOpenView}
        // handleClosePdfFilterMod={handleClosePdfFilterMod}
        filteredDataTwo={rowDataTableviewAll ?? []}
        itemsTwo={itemsviewAll ?? []}
        filename={'Production Day Points'}
        exportColumnNames={exportColumnNamesView}
        exportRowValues={exportRowValuesView}
        componentRef={componentRefview}
      />
      <ExportDataViewAll
        isFilterOpen={isFilterOpenViewAll}
        handleCloseFilterMod={handleCloseFilterModViewAll}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpenViewAll}
        // isPdfFilterOpen={isPdfFilterOpenView}
        // setIsPdfFilterOpen={setIsPdfFilterOpenView}
        // handleClosePdfFilterMod={handleClosePdfFilterMod}
        filteredDataTwo={rowDataTableView ?? []}
        itemsTwo={itemsListView ?? []}
        filename={'Production Day Points'}
        exportColumnNames={exportColumnNamesViewAll}
        exportRowValues={exportRowValuesViewAll}
        componentRef={componentRefviewall}
      />
    </Box>
  );
}

export default DayPointsUpload;