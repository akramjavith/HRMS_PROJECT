import React, { useState, useEffect, useRef, useContext } from 'react';
import { handleApiError } from '../../../components/Errorhandling';
import { FaFileExcel, FaFileCsv, FaPrint, FaFilePdf } from 'react-icons/fa';
import { Box, Typography, OutlinedInput, Select, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Button, Popover, Checkbox } from '@mui/material';
import { userStyle, colourStyles } from '../../../pageStyle';
import LoadingButton from '@mui/lab/LoadingButton';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import axios from 'axios';
import { SERVICE } from '../../../services/Baseservice';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useReactToPrint } from 'react-to-print';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { UserRoleAccessContext } from '../../../context/Appcontext';
import { AuthContext } from '../../../context/Appcontext';
import Headtitle from '../../../components/Headtitle';
import { ThreeDots } from 'react-loader-spinner';
import ImageIcon from '@mui/icons-material/Image';
import { saveAs } from 'file-saver';
import Selects from 'react-select';
import domtoimage from 'dom-to-image';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import ExportData from '../../../components/ExportData';
import MessageAlert from '../../../components/MessageAlert';
import PageHeading from '../../../components/PageHeading';
import AlertDialog from '../../../components/Alert';
import InfoPopup from '../../../components/InfoPopup.js';
import { DeleteConfirmation, PleaseSelectRow } from '../../../components/DeleteConfirmation.js';
import ManageColumnsContent from '../../../components/ManageColumn';
import AggregatedSearchBar from '../../../components/AggregatedSearchBar.js';
import AggridTable from '../../../components/AggridTable.js';
import ResizeObserver from 'resize-observer-polyfill';
window.ResizeObserver = ResizeObserver;

function AttendanceModeMaster() {
  const gridRefTableAttMode = useRef(null);
  const gridRefImageAttMode = useRef(null);

  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedAttModeNameDelt, setSelectedAttModeNameDelt] = useState([]);
  const [searchQueryManageAttMode, setSearchQueryManageAttMode] = useState('');
  const [attMode, setAttmode] = useState({
    // modedaystatus: 'Present Day',
    name: '',
    description: '',
    appliedthrough: 'Auto',
    lop: false,
    loptype: 'Half Day',
    criteria: '',
    target: true,
    paidleave: true,
    weekoff: false,
    holiday: false,
    paidleavetype: 'Half Day',
  });

  const appliedThrough = [
    { label: 'Auto', value: 'Auto' },
    { label: 'Manual', value: 'Manual' },
    { label: 'Auto/Manual', value: 'Auto/Manual' },
  ];
  const reduceOptions = [
    { label: 'Half Day', value: 'Half Day' },
    { label: 'Full Day', value: 'Full Day' },
    { label: 'Double Day', value: 'Double Day' },
    { label: 'Double Half Day', value: 'Double Half Day' },
  ];
  const modedaysOptions = [
    { label: 'Leave Day', value: 'Leave Day' },
    { label: 'Present Day', value: 'Present Day' },
    { label: 'Present/LOP Day', value: 'Present/LOP Day' },
    { label: 'Weekoff Day', value: 'Weekoff Day' },
    { label: 'Absent Day', value: 'Absent Day' },
    { label: 'LOP Day', value: 'LOP Day' },
    { label: 'Holiday', value: 'Holiday' },
  ];
  const reducePaidValueOptions = [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ];

  const reducePaidOptions = [
    { label: 'Half Day', value: 'Half Day' },
    { label: 'Full Day', value: 'Full Day' },
    { label: 'Double Day', value: 'Double Day' },
    { label: 'Double Half Day', value: 'Double Half Day' },
  ];

  const [isCheckOpen, setisCheckOpen] = useState(false);
  const [selectedRowsCat, setSelectedRowsCat] = useState([]);

  const [ovProj, setOvProj] = useState('');
  const [ovProjCount, setOvProjCount] = useState('');
  const [getOverAllCount, setGetOverallCount] = useState('');

  // Error Popup model
  const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
  const [showAlertpop, setShowAlertpop] = useState();
  const handleClickOpenerrpop = () => {
    setIsErrorOpenpop(true);
  };
  const handleCloseerrpop = () => {
    setIsErrorOpenpop(false);
  };

  //check delete model
  const [isbulkCheckOpen, setisCheckOpenbulk] = useState(false);
  const handleClickOpenCheckbulk = () => {
    setisCheckOpenbulk(true);
  };
  const handlebulkCloseCheck = () => {
    setSelectedRows([]);
    setSelectedRowsCat([]);
    setisCheckOpenbulk(false);
    setSelectAllChecked(false);
  };

  const [overalldeletecheck, setOveraldeletecheck] = useState({ ebuse: [] });
  const handleClickOpenCheck = (data) => {
    setisCheckOpen(true);
    // setOveraldeletecheck(data);
  };
  const handleCloseCheck = () => {
    setisCheckOpen(false);
  };

  const [attModeedit, setAttmodeEdit] = useState({});
  const [attModearr, setAttModearr] = useState([]);
  const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);
  const [loader, setLoader] = useState(false);

  //Datatable
  const [pageAttMode, setPageAttMode] = useState(1);
  const [pageSizeAttMode, setPageSizeAttMode] = useState(10);
  const [totalPagesAttMode, setTotalPagesAttMode] = useState('');
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [openview, setOpenview] = useState(false);
  const [openInfo, setOpeninfo] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteAttMode, setDeleteAttMode] = useState({});
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [searchQueryAttMode, setSearchQueryAttMode] = useState('');
  const [allAttModeEdit, setAllAttModeEdit] = useState([]);
  const [isManageColumnsOpenAttMode, setManageColumnsOpenAttMode] = useState(false);
  const [anchorElAttMode, setAnchorElAttMode] = useState(null);

  // State to track advanced filter
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const [isHandleChange, setIsHandleChange] = useState(false);
  const [searchedString, setSearchedString] = useState('');

  // Show All Columns & Manage Columns
  const initialColumnVisibilityAttMode = {
    serialNumber: true,
    checkbox: true,
    name: true,
    // modedaystatus: true,
    description: true,
    appliedthrough: true,
    lop: true,
    loptype: true,
    criteria: true,
    target: true,
    weekoff: true,
    holiday: true,
    paidleave: true,
    paidleavetype: true,
    actions: true,
  };
  const [columnVisibilityAttMode, setColumnVisibilityAttMode] = useState(initialColumnVisibilityAttMode);

  // Exports
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };
  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

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

  useEffect(() => {
    addSerialNumber(attModearr);
  }, [attModearr]);

  useEffect(() => {
    fetchAttMode();
  }, []);

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener('beforeunload', beforeUnloadHandler);
    return () => {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
    };
  }, []);

  // Error Popup model
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
    setBtnSubmit(false);
  };
  // view model
  const handleClickOpenview = () => {
    setOpenview(true);
  };
  const handleCloseview = () => {
    setOpenview(false);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  // info model
  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };
  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  //Delete model
  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
  };

  // page refersh reload description
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ''; // This is required for Chrome support
  };
  // Manage Columns
  const handleOpenManageColumnsAttMode = (event) => {
    setAnchorElAttMode(event.currentTarget);
    setManageColumnsOpenAttMode(true);
  };
  const handleCloseManageColumnsAttMode = () => {
    setManageColumnsOpenAttMode(false);
    setSearchQueryManageAttMode('');
  };

  //Delete model
  const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);
  const handleClickOpencheckbox = () => {
    setIsDeleteOpencheckbox(true);
  };
  const handleCloseModcheckbox = () => {
    setIsDeleteOpencheckbox(false);
  };

  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

  // const handleClickOpenalert = () => {
  //     if (selectedRows.length === 0) {
  //         setIsDeleteOpenalert(true);
  //     } else {
  //         setIsDeleteOpencheckbox(true);
  //     }
  // };

  const handleClickOpenalert = async () => {
    let value = [...new Set(selectedAttModeNameDelt.flat())];

    if (selectedRows.length === 0) {
      setIsDeleteOpenalert(true);
    } else {
      const [resebuse] = await Promise.all([
        axios.post(SERVICE.ATTENDANCE_STATUS_OVERALL_DELETE, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          checkstatus: value,
        }),
      ]);

      setCheckUnit(resebuse?.data?.attendancestatusmaster);

      let Ebuse = resebuse?.data?.attendancestatusmaster.map((t) => t.name).flat();

      if ((resebuse?.data?.attendancestatusmaster).length > 0) {
        handleClickOpenCheckbulk();
        // setOveraldeletecheck({ ...overalldeletecheck, ebuse: resebuse?.data?.ebuse, ebread: resebread?.data?.ebread, ebmaterial: resebmaterial?.data?.ebmaterial })
        setOveraldeletecheck({ ...overalldeletecheck, ebuse: [...new Set(Ebuse)] });

        setCheckUnit([]);
      } else {
        setIsDeleteOpencheckbox(true);
      }
    }
  };

  const handleCloseModalert = () => {
    setIsDeleteOpenalert(false);
  };
  const openAttMode = Boolean(anchorElAttMode);
  const idAttMode = openAttMode ? 'simple-popover' : undefined;

  // Search bar
  const [anchorElSearchAttMode, setAnchorElSearchAttMode] = React.useState(null);
  const handleClickSearchAttMode = (event) => {
    setAnchorElSearchAttMode(event.currentTarget);
  };
  const handleCloseSearchAttMode = () => {
    setAnchorElSearchAttMode(null);
    setSearchQueryAttMode('');
  };

  const openSearchAttMode = Boolean(anchorElSearchAttMode);
  const idSearchAttMode = openSearchAttMode ? 'simple-popover' : undefined;

  // Table row color
  const getRowStyle = (params) => {
    if (params.node.rowIndex % 2 === 0) {
      return { background: '#f0f0f0' }; // Even row
    } else {
      return { background: '#ffffff' }; // Odd row
    }
  };

  const [checkUnit, setCheckUnit] = useState();
  //set function to get particular row
  const rowData = async (id, name) => {
    try {
      let res = await axios.get(`${SERVICE.ATTENDANCE_MODE_STATUS_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeleteAttMode(res?.data?.sattendancemodestatus);
      let resdev = await axios.post(SERVICE.ATTENDANCE_STATUS_OVERALL_DELETE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        checkstatus: [name],
      });
      setCheckUnit(resdev?.data?.attendancestatusmaster);
      if (resdev?.data?.attendancestatusmaster?.length > 0) {
        handleClickOpenCheck();
      } else {
        handleClickOpen();
      }
      // handleClickOpen();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  // Alert delete popup
  let assetid = deleteAttMode._id;
  const delBrand = async () => {
    try {
      await axios.delete(`${SERVICE.ATTENDANCE_MODE_STATUS_SINGLE}/${assetid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await fetchAttMode();
      handleCloseMod();
      setSelectedRows([]);
      setPageAttMode(1);
      setPopupContent('Deleted Successfully');
      setPopupSeverity('success');
      handleClickOpenPopup();
      setIsHandleChange(false);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    getapi();
  }, []);

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String('Attendance Mode Master'),
      commonid: String(isUserRoleAccess?._id),
      date: String(new Date()),
      addedby: [
        {
          name: String(isUserRoleAccess?.username),
          date: String(new Date()),
        },
      ],
    });
  };

  //add function
  const sendRequest = async () => {
    setPageName(!pageName);
    setBtnSubmit(true);
    try {
      let brandCreate = await axios.post(SERVICE.ATTENDANCE_MODE_STATUS_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        // modedaystatus: String(attMode.modedaystatus),
        name: String(attMode.name),
        description: String(attMode.description),
        appliedthrough: String(attMode.appliedthrough),
        lop: Boolean(attMode.lop),
        loptype: attMode.lop ? String(attMode.loptype) : '',
        criteria: String(attMode.criteria),
        target: Boolean(attMode.target),
        paidleave: Boolean(attMode.paidleave),
        weekoff: Boolean(attMode.weekoff),
        holiday: Boolean(attMode.holiday),
        paidleavetype: attMode.paidleave ? String(attMode.paidleavetype) : '',
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      setBtnSubmit(false);
      await fetchAttMode();
      setAttmode({
        // modedaystatus: 'Present Day',
        name: '',
        description: '',
        appliedthrough: 'Auto',
        lop: false,
        loptype: 'Half Day',
        criteria: '',
        target: true,
        holiday: false,
        weekoff: false,
        paidleave: true,
        paidleavetype: 'Half Day',
      });
      setPageAttMode(1);
      setPageSizeAttMode(10);
      setPopupContent('Added Successfully');
      setPopupSeverity('success');
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  const [btnSubmit, setBtnSubmit] = useState(false);
  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();
    const isNameMatch = attModearr?.some((item) => item.name?.toLowerCase() === attMode.name?.toLowerCase());
    if (attMode.name === '') {
      setPopupContentMalert('Please Enter Name');
      setPopupSeverityMalert('warning');
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert('Name Already Exists!');
      setPopupSeverityMalert('warning');
      handleClickOpenPopupMalert();
    } else {
      sendRequest();
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    setAttmode({
      // modedaystatus: 'Present Day',
      name: '',
      description: '',
      appliedthrough: 'Auto',
      lop: false,
      holiday: false,
      weekoff: false,
      loptype: 'Half Day',
      criteria: '',
      target: true,
      paidleave: true,
      paidleavetype: 'Half Day',
    });
    setPopupContent('Cleared Successfully');
    setPopupSeverity('success');
    handleClickOpenPopup();
  };
  //Edit model...
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === 'backdropClick') return;
    setIsEditOpen(false);
  };
  //get single row to edit....
  const getCode = async (e, name) => {
    try {
      let res = await axios.get(`${SERVICE.ATTENDANCE_MODE_STATUS_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      fetchAttModeAll();
      setAttmodeEdit(res?.data?.sattendancemodestatus);
      setOvProj(name);
      getOverallEditSection(name);
      handleClickOpenEdit();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // get single row to view....
  const getviewCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.ATTENDANCE_MODE_STATUS_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAttmodeEdit(res?.data?.sattendancemodestatus);
      handleClickOpenview();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  // get single row to view....
  const getinfoCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.ATTENDANCE_MODE_STATUS_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAttmodeEdit(res?.data?.sattendancemodestatus);
      handleClickOpeninfo();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  //frequency master name updateby edit page...
  let updateby = attModeedit.updatedby;
  let addedby = attModeedit.addedby;
  let frequencyId = attModeedit._id;

  const getOverallEditSection = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.post(SERVICE.ATTENDANCE_STATUS_OVERALL_EDIT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        oldname: e,
      });
      setOvProjCount(res?.data?.count);
      setGetOverallCount(`The ${e} is linked in
         ${res?.data?.ebuse?.length > 0 ? 'Attendance Status Master' : ''}
       
             whether you want to do changes ..??`);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //overall edit section for all pages
  const getOverallEditSectionUpdate = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.post(SERVICE.ATTENDANCE_STATUS_OVERALL_EDIT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        oldname: ovProj,
      });
      sendEditRequestOverall(res?.data?.ebuse);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const sendEditRequestOverall = async (ebuse) => {
    try {
      if (ebuse.length > 0) {
        let answ = ebuse.map((d, i) => {
          let res = axios.put(`${SERVICE.ATTENDANCE_STATUS_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            name: String(attModeedit.name),
          });
        });
      }
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //editing the single data...
  const sendEditRequest = async () => {
    try {
      let res = await axios.put(`${SERVICE.ATTENDANCE_MODE_STATUS_SINGLE}/${frequencyId}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        // modedaystatus: String(attModeedit.modedaystatus),
        name: String(attModeedit.name),
        description: String(attModeedit.description),
        appliedthrough: String(attModeedit.appliedthrough),
        lop: Boolean(attModeedit.lop),
        loptype: attModeedit.lop ? String(attModeedit.loptype === '' ? 'Half Day' : attModeedit.loptype) : '',
        criteria: String(attModeedit.criteria),
        target: Boolean(attModeedit.target),
        paidleave: Boolean(attModeedit.paidleave),
        weekoff: Boolean(attModeedit.weekoff),
        holiday: Boolean(attModeedit.holiday),
        paidleavetype: attModeedit.paidleave ? String(attModeedit.paidleavetype === '' ? 'Half Day' : attModeedit.paidleavetype) : '',
        updatedby: [
          ...updateby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await fetchAttMode();
      handleCloseModEdit();
      getOverallEditSectionUpdate();
      setPopupContent('Updated Successfully');
      setPopupSeverity('success');
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  const editSubmit = async (e) => {
    e.preventDefault();
    fetchAttModeAll();
    let res_freq = await axios.get(SERVICE.ATTENDANCE_MODE_STATUS, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
    });
    let result = res_freq?.data?.allattmodestatus.filter((item) => item._id !== attModeedit._id);
    const isNameMatch = result?.some((item) => item.name?.toLowerCase() === attModeedit.name?.toLowerCase());
    if (attModeedit.name === '') {
      setPopupContentMalert('Please Enter Name');
      setPopupSeverityMalert('warning');
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert('Name Already Exists!');
      setPopupSeverityMalert('warning');
      handleClickOpenPopupMalert();
    } else if (attModeedit.name != ovProj && ovProjCount > 0) {
      setShowAlertpop(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: '100px', color: 'orange' }} />
          <p style={{ fontSize: '20px', fontWeight: 900 }}>{getOverAllCount}</p>
        </>
      );
      handleClickOpenerrpop();
    } else {
      sendEditRequest();
    }
  };
  //get all Attendance Status name.
  const fetchAttMode = async () => {
    try {
      let res_freq = await axios.get(SERVICE.ATTENDANCE_MODE_STATUS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const itemsWithSerialNumber = res_freq?.data?.allattmodestatus?.map((item, index) => ({
        ...item,
        serialNumber: index + 1,
        lop: item.lop ? 'Yes' : 'No',
        target: item.target ? 'Yes' : 'No',
        paidleave: item.paidleave ? 'Yes' : 'No',
        weekoff: item.weekoff ? 'Yes' : 'No',
        holiday: item.holiday ? 'Yes' : 'No',
        id: item._id,
      }));
      setAttModearr(itemsWithSerialNumber);
      setLoader(true);
      setSearchQueryAttMode('');
      setTotalPagesAttMode(Math.ceil(res_freq?.data?.allattmodestatus.length / pageSizeAttMode));
    } catch (err) {
      setLoader(true);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const delAreagrpcheckbox = async () => {
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.ATTENDANCE_MODE_STATUS_SINGLE}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });
      // Wait for all delete requests to complete
      await Promise.all(deletePromises);
      handleCloseModcheckbox();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setIsHandleChange(false);
      setPageAttMode(1);

      await fetchAttModeAll();
      setPopupContent('Deleted Successfully');
      setPopupSeverity('success');
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const delEbservicecheckboxWithoutLink = async () => {
    try {
      let valfilter = [...overalldeletecheck.ebuse];

      let filtered = filteredData.filter((d) => !valfilter.some((item) => d.name === item))?.flatMap((d) => selectedRows?.filter((item) => d.id === item));

      const deletePromises = filtered?.map((item) => {
        return axios.delete(`${SERVICE.ATTENDANCE_MODE_STATUS_SINGLE}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });

      // Wait for all delete requests to complete
      await Promise.all(deletePromises);

      handlebulkCloseCheck();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPageAttMode(1);
      setPopupContent('Deleted Successfully');
      setPopupSeverity('success');
      handleClickOpenPopup();

      await fetchAttModeAll();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const getLinkedLabelItem = (overalldeletecheck) => {
    const { ebuse = [] } = overalldeletecheck;
    const labels = [];

    ebuse.forEach((item) => labels.push(item));

    // Remove duplicates using a Set
    const uniqueLabels = [...new Set(labels)];

    return uniqueLabels.join(', ');
  };

  const getLinkedLabel = (overalldeletecheck) => {
    const { ebuse = [] } = overalldeletecheck;
    const labels = [];

    if (ebuse.length > 0) labels.push('Attendance Status Master');

    return labels.join(', ');
  };

  const getFilteredUnits = (attModearr, selectedRows, overalldeletecheck) => {
    const { ebuse = [] } = overalldeletecheck;
    const allConditions = [...new Set([...ebuse])];

    return attModearr.filter((d) => selectedRows?.includes(d._id) && !allConditions.includes(d.name));
  };

  const shouldShowDeleteMessage = (attModearr, selectedRows, overalldeletecheck) => {
    return getFilteredUnits(attModearr, selectedRows, overalldeletecheck).length > 0;
  };

  const shouldEnableOkButton = (attModearr, selectedRows, overalldeletecheck) => {
    return getFilteredUnits(attModearr, selectedRows, overalldeletecheck).length === 0;
  };

  //get all Brand Type Name.
  const fetchAttModeAll = async () => {
    setPageName(!pageName);
    try {
      let res_freq = await axios.get(SERVICE.ATTENDANCE_MODE_STATUS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      // setAttModearr(res_freq?.data?.allattmodestatus);
      setAllAttModeEdit(res_freq?.data?.allattmodestatus.filter((item) => item._id !== attModeedit._id));
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //serial no for listing items
  const addSerialNumber = (data) => {
    setItems(data);
  };
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  // Split the search query into individual terms
  const searchTerms = searchQueryAttMode.toLowerCase().split(' ');
  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchTerms.every((term) => Object.values(item).join(' ').toLowerCase().includes(term));
  });

  // Pagination for outer filter
  const filteredData = filteredDatas?.slice((pageAttMode - 1) * pageSizeAttMode, pageAttMode * pageSizeAttMode);
  const totalPagesAttModeOuter = Math.ceil(filteredDatas?.length / pageSizeAttMode);
  const visiblePages = Math.min(totalPagesAttModeOuter, 3);
  const firstVisiblePage = Math.max(1, pageAttMode - 1);
  const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPagesAttModeOuter);
  const pageNumbers = [];
  const indexOfLastItem = pageAttMode * pageSizeAttMode;
  const indexOfFirstItem = indexOfLastItem - pageSizeAttMode;
  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  }

  const columnDataTableAttMode = [
    {
      field: 'checkbox',
      headerName: '', // Default header name
      headerStyle: {
        fontWeight: 'bold',
      },
      sortable: false,
      width: 75,
      filter: false,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      hide: !columnVisibilityAttMode.checkbox,
      headerClassName: 'bold-header',
      pinned: 'left',
    },
    {
      field: 'serialNumber',
      headerName: 'SNo',
      flex: 0,
      width: 80,
      hide: !columnVisibilityAttMode.serialNumber,
      headerClassName: 'bold-header',
    },
    // {
    //   field: 'modedaystatus',
    //   headerName: 'DayStatusMode',
    //   flex: 0,
    //   width: 120,
    //   hide: !columnVisibilityAttMode.modedaystatus,
    //   headerClassName: 'bold-header',
    // },
    {
      field: 'name',
      headerName: 'Name',
      flex: 0,
      width: 120,
      hide: !columnVisibilityAttMode.name,
      headerClassName: 'bold-header',
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 0,
      width: 150,
      hide: !columnVisibilityAttMode.description,
      headerClassName: 'bold-header',
    },
    {
      field: 'appliedthrough',
      headerName: 'Applied Through',
      flex: 0,
      width: 100,
      hide: !columnVisibilityAttMode.appliedthrough,
      headerClassName: 'bold-header',
    },
    {
      field: 'weekoff',
      headerName: 'Weekoff',
      flex: 0,
      width: 100,
      hide: !columnVisibilityAttMode.weekoff,
      headerClassName: 'bold-header',
    },
    {
      field: 'holiday',
      headerName: 'Holiday',
      flex: 0,
      width: 100,
      hide: !columnVisibilityAttMode.holiday,
      headerClassName: 'bold-header',
    },
    {
      field: 'lop',
      headerName: 'LOP',
      flex: 0,
      width: 100,
      hide: !columnVisibilityAttMode.lop,
      headerClassName: 'bold-header',
    },
    {
      field: 'loptype',
      headerName: 'LOP Type',
      flex: 0,
      width: 120,
      hide: !columnVisibilityAttMode.loptype,
      headerClassName: 'bold-header',
    },
    {
      field: 'criteria',
      headerName: 'Criteria',
      flex: 0,
      width: 100,
      hide: !columnVisibilityAttMode.criteria,
      headerClassName: 'bold-header',
    },
    {
      field: 'target',
      headerName: 'Target',
      flex: 0,
      width: 100,
      hide: !columnVisibilityAttMode.target,
      headerClassName: 'bold-header',
    },
    {
      field: 'paidleave',
      headerName: 'Paid Present',
      flex: 0,
      width: 120,
      hide: !columnVisibilityAttMode.paidleave,
      headerClassName: 'bold-header',
    },
    {
      field: 'paidleavetype',
      headerName: 'Paid Present Type',
      flex: 0,
      width: 120,
      hide: !columnVisibilityAttMode.paidleavetype,
      headerClassName: 'bold-header',
    },
    {
      field: 'actions',
      headerName: 'Action',
      flex: 0,
      width: 260,
      minHeight: '40px !important',
      filter: false,
      sortable: false,
      hide: !columnVisibilityAttMode.actions,
      headerClassName: 'bold-header',
      cellRenderer: (params) => (
        <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box>
            {isUserRoleCompare?.includes('eattendancemodemaster') && (
              <Button
                sx={userStyle.buttonedit}
                onClick={() => {
                  getCode(params.data.id, params.data.name);
                }}
              >
                <EditOutlinedIcon sx={buttonStyles.buttonedit} />
              </Button>
            )}
            {isUserRoleCompare?.includes('dattendancemodemaster') && (
              <Button
                sx={userStyle.buttondelete}
                onClick={(e) => {
                  rowData(params.data.id, params.data.name);
                }}
              >
                <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
              </Button>
            )}
            {isUserRoleCompare?.includes('vattendancemodemaster') && (
              <Button
                sx={userStyle.buttonedit}
                onClick={() => {
                  getviewCode(params.data.id);
                }}
              >
                <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
              </Button>
            )}
            {isUserRoleCompare?.includes('iattendancemodemaster') && (
              <Button
                sx={userStyle.buttonedit}
                onClick={() => {
                  getinfoCode(params.data.id);
                }}
              >
                <InfoOutlinedIcon sx={buttonStyles.buttoninfo} />
              </Button>
            )}
          </Box>
        </Grid>
      ),
    },
  ];

  const rowDataTable = filteredData.map((item, index) => {
    return {
      ...item,
      id: item._id,
      serialNumber: item.serialNumber,
    };
  });

  // Datatable
  const handlePageSizeChange = (event) => {
    setPageSizeAttMode(Number(event.target.value));
    setSelectedRows([]);
    setSelectAllChecked(false);
    setPageAttMode(1);
  };

  // Show All Columns functionality
  const handleShowAllColumns = () => {
    const updatedVisibility = { ...columnVisibilityAttMode };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibilityAttMode(updatedVisibility);
  };

  // Function to filter columns based on search query
  const filteredColumns = columnDataTableAttMode.filter((column) => column.headerName.toLowerCase().includes(searchQueryManageAttMode.toLowerCase()));

  // Manage Columns functionality
  const toggleColumnVisibility = (field) => {
    setColumnVisibilityAttMode((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };

  // Excel
  const [fileFormat, setFormat] = useState('');
  let exportColumnNamescrt = ['Name ', 'Description ', 'Applied Through', 'Weekoff', 'Holiday', 'LOP', 'LOP Type', 'Criteria', 'Target', 'Paid Present', 'Paid Present Type'];
  let exportRowValuescrt = ['name', 'description', 'appliedthrough', 'weekoff', 'holiday', 'lop', 'loptype', 'criteria', 'target', 'paidleave', 'paidleavetype'];

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Attendance Mode',
    pageStyle: 'print',
  });

  // image
  const handleCaptureImage = () => {
    if (gridRefImageAttMode.current) {
      domtoimage
        .toBlob(gridRefImageAttMode.current)
        .then((blob) => {
          saveAs(blob, 'Attendance Mode.png');
        })
        .catch((error) => {
          console.error('dom-to-image error: ', error);
        });
    }
  };

  return (
    <Box>
      <Headtitle title={'ATTENDANCE MODE MASTER'} />
      {/* ****** Header Content ****** */}
      <PageHeading title="Manage Attendance Mode" modulename="Human Resources" submodulename="HR" mainpagename="Attendance" subpagename="Attendance Setup" subsubpagename="Attendance Mode Master" />

      {isUserRoleCompare?.includes('aattendancemodemaster') && (
        <Box sx={userStyle.selectcontainer}>
          <Grid container spacing={2}>
            <Grid item md={12} sm={12} xs={12}>
              <Typography sx={userStyle.importheadtext}>Add Attendance Mode</Typography>
            </Grid>
            {/* <Grid item md={4} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Day Status Mode</Typography>
                <Selects
                  styles={colourStyles}
                  options={modedaysOptions}
                  value={{
                    label: attMode.modedaystatus,
                    value: attMode.modedaystatus,
                  }}
                  onChange={(e) => {
                    setAttmode({
                      ...attMode,
                      modedaystatus: e.value,
                    });
                  }}
                />
              </FormControl>
            </Grid> */}
            <Grid item md={4} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  Name <b style={{ color: 'red' }}>*</b>
                </Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  placeholder="Please Enter Name"
                  value={attMode.name}
                  onChange={(e) => {
                    setAttmode({
                      ...attMode,
                      name: e.target.value,
                    });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Description</Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  placeholder="Please Enter Description"
                  value={attMode.description}
                  onChange={(e) => {
                    setAttmode({
                      ...attMode,
                      description: e.target.value,
                    });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Applied Through</Typography>
                <Selects
                  styles={colourStyles}
                  options={appliedThrough}
                  value={{
                    label: attMode.appliedthrough,
                    value: attMode.appliedthrough,
                  }}
                  onChange={(e) => {
                    setAttmode({
                      ...attMode,
                      appliedthrough: e.value,
                    });
                  }}
                />
              </FormControl>
            </Grid>

            <Grid item md={2} xs={12} sm={12}>
              <Typography>
                <b>LOP </b>
              </Typography>
              <Grid container spacing={2}>
                <Grid item md={4} xs={12} sm={6}>
                  <Checkbox
                    sx={{ '& .MuiSvgIcon-root': { fontSize: 40 } }}
                    disabled={attMode.weekoff === true ? true : attMode.holiday === true ? true : false}
                    checked={attMode.lop}
                    value={attMode.lop}
                    onChange={(e) => {
                      setAttmode({
                        ...attMode,
                        lop: !attMode.lop,
                        weekoff: !attMode.lop === true ? false : attMode.weekoff,
                        holiday: !attMode.lop === true ? false : attMode.holiday,
                        paidleavetype: !attMode.lop === true ? "Half Day" : "Half Day",
                      });
                    }}
                  />
                </Grid>
                <Grid item md={2} xs={12} sm={12} marginTop={2}>
                  {attMode.lop ? <span>Yes</span> : <span>No</span>}
                </Grid>
              </Grid>
            </Grid>

            <Grid item md={2} xs={12} sm={12}>
              <Typography>
                <b>Holiday </b>
              </Typography>
              <Grid container spacing={2}>
                <Grid item md={4} xs={12} sm={6}>
                  <Checkbox
                    sx={{ '& .MuiSvgIcon-root': { fontSize: 40 } }}
                    disabled={attMode.weekoff === true ? true : attMode.lop === true ? true : false}
                    checked={attMode.holiday}
                    value={attMode.holiday}
                    onChange={(e) => {
                      setAttmode({
                        ...attMode,
                        holiday: !attMode.holiday,
                        weekoff: !attMode.holiday === true ? false : attMode.weekoff,
                        lop: !attMode.holiday === true ? false : attMode.lop,
                        paidleavetype: !attMode.holiday === true ? "Full Day" : "Half Day",
                      });
                    }}
                  />
                </Grid>
                <Grid item md={2} xs={12} sm={12} marginTop={2}>
                  {attMode.holiday ? <span>Yes</span> : <span>No</span>}
                </Grid>
              </Grid>
            </Grid>

            <Grid item md={2} xs={12} sm={12}>
              <Typography>
                <b>WeekOff </b>
              </Typography>
              <Grid container spacing={2}>
                <Grid item md={4} xs={12} sm={6}>
                  <Checkbox
                    sx={{ '& .MuiSvgIcon-root': { fontSize: 40 } }}
                    checked={attMode.weekoff}
                    disabled={attMode.lop === true ? true : attMode.holiday === true ? true : false}
                    value={attMode.weekoff}
                    onChange={(e) => {
                      setAttmode({
                        ...attMode,
                        weekoff: !attMode.weekoff,
                        holiday: !attMode.weekoff === true ? false : attMode.holiday,
                        lop: !attMode.weekoff === true ? false : attMode.lop,
                        paidleavetype: !attMode.weekoff === true ? "Full Day" : "Half Day",
                      });
                    }}
                  />
                </Grid>
                <Grid item md={2} xs={12} sm={12} marginTop={2}>
                  {attMode.weekoff ? <span>Yes</span> : <span>No</span>}
                </Grid>
              </Grid>
            </Grid>
            {attMode.lop ? (
              <Grid item md={2} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>LOP Type</Typography>
                  <Selects
                    maxMenuHeight={300}
                    options={reduceOptions}
                    value={{
                      label: attMode.loptype,
                      value: attMode.loptype,
                    }}
                    onChange={(e) => {
                      setAttmode({
                        ...attMode,
                        loptype: e.value,
                      });
                    }}
                  />
                </FormControl>
              </Grid>
            ) : (
              <Grid item md={2} xs={12} sm={12}>
                {' '}
              </Grid>
            )}

            <Grid item md={4} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Criteria</Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  placeholder="Please Enter Criteria"
                  value={attMode.criteria}
                  onChange={(e) => {
                    setAttmode({
                      ...attMode,
                      criteria: e.target.value,
                    });
                  }}
                />
              </FormControl>
            </Grid>

            <Grid item md={4} xs={12} sm={12}>
              <Typography>
                <b>Target </b>
              </Typography>
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={6}>
                  <Checkbox
                    sx={{ '& .MuiSvgIcon-root': { fontSize: 40 } }}
                    checked={attMode.target}
                    value={attMode.target}
                    onChange={(e) => {
                      setAttmode({
                        ...attMode,
                        target: !attMode.target,
                      });
                    }}
                  />
                </Grid>
                <Grid item md={3} xs={12} sm={12} marginTop={2}>
                  {attMode.target ? <span>Yes</span> : <span>No</span>}
                </Grid>
              </Grid>
            </Grid>

            <Grid item md={4} xs={12} sm={12}>
              <Typography>
                <b>Paid Present </b>
              </Typography>
              <Grid container spacing={2}>
                <Grid item md={6} xs={12} sm={6}>
                  <Selects
                    maxMenuHeight={300}
                    options={reducePaidValueOptions}
                    value={{
                      label: attMode.paidleave ? 'Yes' : 'No',
                      value: attMode.paidleave ? 'Yes' : 'No',
                    }}
                    onChange={(e) => {
                      setAttmode({
                        ...attMode,
                        paidleave: e.value === 'Yes' ? true : false,
                      });
                    }}
                  />
                </Grid>
                <Grid item md={3} xs={12} sm={12} marginTop={2}></Grid>
              </Grid>
            </Grid>

            {attMode.paidleave && attMode.weekoff === false && attMode.holiday === false ? (
              <Grid item md={2} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>Paid Present Type</Typography>
                  <Selects
                    maxMenuHeight={300}
                    options={reducePaidOptions}
                    value={{
                      label: attMode.paidleavetype,
                      value: attMode.paidleavetype,
                    }}
                    onChange={(e) => {
                      setAttmode({
                        ...attMode,
                        paidleavetype: e.value,
                      });
                    }}
                  />
                </FormControl>
              </Grid>
            ) : (
              <Grid item md={2} xs={12} sm={12}></Grid>
            )}
            {attMode.weekoff === true ? (
              <Grid item md={2} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Paid Present Type <b style={{ color: 'red' }}>*</b>
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    placeholder="Please Enter Name"
                    value={attMode.paidleavetype}
                    onChange={(e) => {
                      setAttmode({
                        ...attMode,
                        name: e.target.value,
                      });
                    }}
                  />
                </FormControl>
              </Grid>
            ) : attMode.holiday === true ? (
              <Grid item md={2} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Paid Present Type <b style={{ color: 'red' }}>*</b>
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    placeholder="Please Enter Name"
                    value={attMode.paidleavetype}
                    onChange={(e) => {
                      setAttmode({
                        ...attMode,
                        name: e.target.value,
                      });
                    }}
                  />
                </FormControl>
              </Grid>
            ) : (<Grid item md={2} xs={12} sm={12}></Grid>)}

            <Grid item lg={1} md={2} sm={2} xs={12}>
              <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0 } })}>
                <LoadingButton
                  sx={{
                    ...buttonStyles.buttonsubmit,
                    marginLeft: '10px',
                  }}
                  variant="contained"
                  loading={btnSubmit}
                  style={{ minWidth: '0px' }}
                  onClick={handleSubmit}
                >
                  SAVE
                </LoadingButton>
              </Box>
            </Grid>
            <Grid item lg={1} md={2} sm={2} xs={12}>
              <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0 } })}>
                <Button sx={buttonStyles.btncancel} onClick={handleClear}>
                  {' '}
                  Clear{' '}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}
      <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes('lattendancemodemaster') && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>Attendance Mode List</Typography>
            </Grid>
            <Grid container spacing={2} style={userStyle.dataTablestyle}>
              <Grid item md={2} xs={12} sm={12}>
                <Box>
                  <label>Show entries:</label>
                  <Select
                    id="pageSizeSelect"
                    value={pageSizeAttMode}
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
                    <MenuItem value={items?.length}>All</MenuItem>
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
                  {isUserRoleCompare?.includes('excelattendancemodemaster') && (
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
                  {isUserRoleCompare?.includes('csvattendancemodemaster') && (
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
                  {isUserRoleCompare?.includes('printattendancemodemaster') && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes('pdfattendancemodemaster') && (
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
                  {isUserRoleCompare?.includes('imageattendancemodemaster') && (
                    <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                      {' '}
                      <ImageIcon sx={{ fontSize: '15px' }} /> &ensp;Image&ensp;{' '}
                    </Button>
                  )}
                </Box>
              </Grid>
              <Grid item md={2} xs={12} sm={12}>
                <AggregatedSearchBar
                  columnDataTable={columnDataTableAttMode}
                  setItems={setItems}
                  addSerialNumber={addSerialNumber}
                  setPage={setPageAttMode}
                  maindatas={attModearr}
                  setSearchedString={setSearchedString}
                  searchQuery={searchQueryAttMode}
                  setSearchQuery={setSearchQueryAttMode}
                  paginated={false}
                  totalDatas={attModearr}
                />
              </Grid>
            </Grid>
            <br />
            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
              {' '}
              Show All Columns{' '}
            </Button>
            &ensp;
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsAttMode}>
              {' '}
              Manage Columns{' '}
            </Button>
            &ensp;
            {isUserRoleCompare?.includes('bdattendancemodemaster') && (
              <Button variant="contained" sx={buttonStyles.buttonbulkdelete} onClick={handleClickOpenalert}>
                Bulk Delete{' '}
              </Button>
            )}
            <br />
            <br />
            {!loader ? (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
              </Box>
            ) : (
              <>
                <Box sx={{ width: '100%' }} className={'ag-theme-quartz'} ref={gridRefImageAttMode}>
                  <AggridTable
                    rowDataTable={rowDataTable}
                    columnDataTable={columnDataTableAttMode}
                    columnVisibility={columnVisibilityAttMode}
                    page={pageAttMode}
                    setPage={setPageAttMode}
                    pageSize={pageSizeAttMode}
                    totalPages={totalPagesAttMode}
                    setColumnVisibility={setColumnVisibilityAttMode}
                    isHandleChange={isHandleChange}
                    items={items}
                    selectedRows={selectedRows}
                    setSelectedRows={setSelectedRows}
                    selectedAttModeNameDelt={selectedAttModeNameDelt}
                    setSelectedAttModeNameDelt={setSelectedAttModeNameDelt}
                    pagenamecheck={'Attendance Mode List'}
                    gridRefTable={gridRefTableAttMode}
                    gridRefTableImg={gridRefImageAttMode}
                    paginated={false}
                    filteredDatas={filteredDatas}
                    // totalDatas={totalDatas}
                    searchQuery={searchedString}
                    handleShowAllColumns={handleShowAllColumns}
                    setFilteredRowData={setFilteredRowData}
                    filteredRowData={filteredRowData}
                    setFilteredChanges={setFilteredChanges}
                    filteredChanges={filteredChanges}
                    itemsList={attModearr}
                  />
                </Box>
              </>
            )}
            {/* ****** Table End ****** */}
          </Box>
        </>
      )}
      {/* ****** Table End ****** */}
      {/* Manage Column */}
      <Popover id={idAttMode} open={isManageColumnsOpenAttMode} anchorEl={anchorElAttMode} onClose={handleCloseManageColumnsAttMode} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
        <ManageColumnsContent
          handleClose={handleCloseManageColumnsAttMode}
          searchQuery={searchQueryManageAttMode}
          setSearchQuery={setSearchQueryManageAttMode}
          filteredColumns={filteredColumns}
          columnVisibility={columnVisibilityAttMode}
          toggleColumnVisibility={toggleColumnVisibility}
          setColumnVisibility={setColumnVisibilityAttMode}
          initialColumnVisibility={initialColumnVisibilityAttMode}
          columnDataTable={columnDataTableAttMode}
        />
      </Popover>

      {/* Alert  */}
      <Box>
        <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
            <Typography variant="h6">{showAlert}</Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error" onClick={handleCloseerr}>
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <MessageAlert openPopup={openPopupMalert} handleClosePopup={handleClosePopupMalert} popupContent={popupContentMalert} popupSeverity={popupSeverityMalert} />
      {/* SUCCESS */}
      <AlertDialog openPopup={openPopup} handleClosePopup={handleClosePopup} popupContent={popupContent} popupSeverity={popupSeverity} />
      {/* EXTERNAL COMPONENTS -------------- END */}
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
        itemsTwo={attModearr ?? []}
        filename={'Attendance Mode'}
        exportColumnNames={exportColumnNamescrt}
        exportRowValues={exportRowValuescrt}
        componentRef={componentRef}
      />
      <InfoPopup openInfo={openInfo} handleCloseinfo={handleCloseinfo} heading="Attendance Mode Info" addedby={addedby} updateby={updateby} />
      <DeleteConfirmation open={isDeleteOpen} onClose={handleCloseMod} onConfirm={delBrand} title="Are you sure?" confirmButtonText="Yes" cancelButtonText="Cancel" />
      <DeleteConfirmation open={isDeleteOpencheckbox} onClose={handleCloseModcheckbox} onConfirm={delAreagrpcheckbox} title="Are you sure?" confirmButtonText="Yes" cancelButtonText="Cancel" />
      <PleaseSelectRow open={isDeleteOpenalert} onClose={handleCloseModalert} message="Please Select any Row" iconColor="orange" buttonText="OK" />
      {/* view model */}
      <Dialog open={openview} onClose={handleClickOpenview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" fullWidth="md" sx={{ marginTop: '95px' }}>
        <Box sx={{ padding: '20px 50px' }}>
          <>
            <Typography sx={userStyle.HeaderText}> View Attendance Mode</Typography>
            <br />
            <Grid container spacing={2}>
              {/* <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Day Status Mode</Typography>
                  <Typography>{attModeedit.modedaystatus}</Typography>
                </FormControl>
              </Grid> */}
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Name</Typography>
                  <Typography>{attModeedit.name}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Description</Typography>
                  <Typography>{attModeedit.description}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Applied Through</Typography>
                  <Typography>{attModeedit.appliedthrough}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Holiday</Typography>
                  <Typography>{attModeedit.holiday ? 'Yes' : 'No'}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">WeekOff</Typography>
                  <Typography>{attModeedit.weekoff ? 'Yes' : 'No'}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">LOP</Typography>
                  <Typography>{attModeedit.lop ? 'Yes' : 'No'}</Typography>
                </FormControl>
              </Grid>
              {attModeedit.lop && (
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">LOP Type</Typography>
                    <Typography>{attModeedit.loptype}</Typography>
                  </FormControl>
                </Grid>
              )}
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Criteria</Typography>
                  <Typography>{attModeedit.criteria}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Target</Typography>
                  <Typography>{attModeedit.target ? 'Yes' : 'No'}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Paid Present</Typography>
                  <Typography>{attModeedit.paidleave ? 'Yes' : 'No'}</Typography>
                </FormControl>
              </Grid>
              {attModeedit.paidleave && (
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Paid Present Type</Typography>
                    <Typography>{attModeedit.paidleavetype}</Typography>
                  </FormControl>
                </Grid>
              )}
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2} sx={{ marginLeft: '-2px' }}>
              <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={handleCloseview}>
                Back
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>

      {/* Edit DIALOG */}
      <Box>
        <Dialog open={isEditOpen} onClose={handleCloseModEdit} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md" fullWidth={true} sx={{ marginTop: '95px' }}>
          <Box sx={{ padding: '20px 50px' }}>
            <>
              <Grid container spacing={2}>
                <Typography sx={userStyle.HeaderText}>Edit Attendance Mode</Typography>
              </Grid>
              <br />
              <Grid container spacing={2}>
                {/* <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Day Status Mode</Typography>
                    <Selects
                      styles={colourStyles}
                      options={modedaysOptions}
                      value={{
                        label: attModeedit.modedaystatus,
                        value: attModeedit.modedaystatus,
                      }}
                      onChange={(e) => {
                        setAttmodeEdit({
                          ...attModeedit,
                          modedaystatus: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid> */}
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Name <b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Name"
                      value={attModeedit.name}
                      onChange={(e) => {
                        setAttmodeEdit({
                          ...attModeedit,
                          name: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Description</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Description"
                      value={attModeedit.description}
                      onChange={(e) => {
                        setAttmodeEdit({
                          ...attModeedit,
                          description: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Applied Through</Typography>
                    <Selects
                      styles={colourStyles}
                      options={appliedThrough}
                      value={{
                        label: attModeedit.appliedthrough,
                        value: attModeedit.appliedthrough,
                      }}
                      onChange={(e) => {
                        setAttmodeEdit({
                          ...attModeedit,
                          appliedthrough: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <Typography>
                    <b>LOP </b>
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item md={4} xs={12} sm={6}>
                      <Checkbox
                        sx={{ '& .MuiSvgIcon-root': { fontSize: 40 } }}
                        disabled={attModeedit.weekoff === true ? true : attModeedit.holiday === true ? true : false} checked={attModeedit.lop}
                        value={attModeedit.lop}
                        onChange={(e) => {
                          setAttmodeEdit({
                            ...attModeedit,
                            lop: !attModeedit.lop,
                            weekoff: !attModeedit.lop === true ? false : attModeedit.weekoff,
                            holiday: !attModeedit.lop === true ? false : attModeedit.holiday,
                            paidleavetype: !attModeedit.lop === true ? "Half Day" : "Half Day",
                          });
                        }}
                      />
                    </Grid>
                    <Grid item md={2} xs={12} sm={12} marginTop={2}>
                      {attModeedit.lop ? <span>Yes</span> : <span>No</span>}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <Typography>
                    <b>Holiday </b>
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item md={4} xs={12} sm={6}>
                      <Checkbox
                        sx={{ '& .MuiSvgIcon-root': { fontSize: 40 } }}
                        disabled={attModeedit.weekoff === true ? true : attModeedit.lop === true ? true : false}
                        checked={attModeedit.holiday}
                        value={attModeedit.holiday}
                        onChange={(e) => {
                          setAttmodeEdit({
                            ...attModeedit,
                            holiday: !attModeedit.holiday,
                            weekoff: !attModeedit.holiday === true ? false : attModeedit.weekoff,
                            lop: !attModeedit.holiday === true ? false : attModeedit.lop,
                            paidleavetype: !attModeedit.holiday === true ? "Full Day" : "Half Day",
                          });
                        }}
                      />
                    </Grid>
                    <Grid item md={2} xs={12} sm={12} marginTop={2}>
                      {attModeedit.holiday ? <span>Yes</span> : <span>No</span>}
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item md={3} xs={12} sm={12}>
                  <Typography>
                    <b>WeekOff </b>
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item md={4} xs={12} sm={6}>
                      <Checkbox
                        sx={{ '& .MuiSvgIcon-root': { fontSize: 40 } }}
                        checked={attModeedit.weekoff}
                        disabled={attModeedit.lop === true ? true : attModeedit.holiday === true ? true : false}
                        value={attModeedit.weekoff}
                        onChange={(e) => {
                          setAttmodeEdit({
                            ...attModeedit,
                            weekoff: !attModeedit.weekoff,
                            holiday: !attModeedit.weekoff === true ? false : attModeedit.holiday,
                            lop: !attModeedit.weekoff === true ? false : attModeedit.lop,
                            paidleavetype: !attModeedit.weekoff === true ? "Full Day" : "Half Day",
                          });
                        }}
                      />
                    </Grid>
                    <Grid item md={2} xs={12} sm={12} marginTop={2}>
                      {attModeedit.weekoff ? <span>Yes</span> : <span>No</span>}
                    </Grid>
                  </Grid>
                </Grid>



                {attModeedit.lop && (
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>LOP Type</Typography>
                      <Selects
                        maxMenuHeight={300}
                        options={reduceOptions}
                        value={{
                          label: attModeedit.loptype === '' ? 'Half Day' : attModeedit.loptype,
                          value: attModeedit.loptype === '' ? 'Half Day' : attModeedit.loptype,
                        }}
                        onChange={(e) => {
                          setAttmodeEdit({
                            ...attModeedit,
                            loptype: e.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                )}

                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Criteria</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Criteria"
                      value={attModeedit.criteria}
                      onChange={(e) => {
                        setAttmodeEdit({
                          ...attModeedit,
                          criteria: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>

                <Grid item md={6} xs={12} sm={12}>
                  <Typography>
                    <b>Target </b>
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item md={3} xs={12} sm={6}>
                      <Checkbox
                        sx={{ '& .MuiSvgIcon-root': { fontSize: 40 } }}
                        checked={attModeedit.target}
                        value={attModeedit.target}
                        onChange={(e) => {
                          setAttmodeEdit({
                            ...attModeedit,
                            target: !attModeedit.target,
                          });
                        }}
                      />
                    </Grid>
                    <Grid item md={2} xs={12} sm={12} marginTop={2}>
                      {attModeedit.target ? <span>Yes</span> : <span>No</span>}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <Typography>
                    <b>Paid Present </b>
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item md={8} xs={12} sm={6}>
                      <Selects
                        maxMenuHeight={300}
                        options={reducePaidValueOptions}
                        value={{
                          label: attModeedit.paidleave ? 'Yes' : 'No',
                          value: attModeedit.paidleave ? 'Yes' : 'No',
                        }}
                        onChange={(e) => {
                          setAttmodeEdit({
                            ...attModeedit,
                            paidleave: e.value === 'Yes' ? true : false,
                          });
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                {attModeedit.paidleave && attModeedit.weekoff === false && attModeedit.holiday === false ? (
                  <Grid item md={2} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Paid Present Type</Typography>
                      <Selects
                        maxMenuHeight={300}
                        options={reducePaidOptions}
                        value={{
                          label: attModeedit.paidleavetype,
                          value: attModeedit.paidleavetype,
                        }}
                        onChange={(e) => {
                          setAttmodeEdit({
                            ...attMode,
                            paidleavetype: e.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                ) : (
                  <Grid item md={2} xs={12} sm={12}></Grid>
                )}
                {attModeedit.weekoff === true ? (
                  <Grid item md={2} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Paid Present Type <b style={{ color: 'red' }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Please Enter Name"
                        value={attModeedit.paidleavetype}
                        onChange={(e) => {
                          setAttmodeEdit({
                            ...attModeedit,
                            name: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                ) : attModeedit.holiday === true ? (
                  <Grid item md={2} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Paid Present Type <b style={{ color: 'red' }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Please Enter Name"
                        value={attModeedit.paidleavetype}
                        onChange={(e) => {
                          setAttmodeEdit({
                            ...attModeedit,
                            name: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                ) : (<Grid item md={2} xs={12} sm={12}></Grid>)}

              </Grid>
              <br />
              <br />
              <Grid container spacing={1}>
                <Grid item md={3} xs={12} sm={12}>
                  <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={editSubmit}>
                    {' '}
                    Update
                  </Button>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <Button sx={buttonStyles.btncancel} onClick={handleCloseModEdit}>
                    {' '}
                    Cancel{' '}
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
        </Dialog>

        <Dialog open={isCheckOpen} onClose={handleCloseCheck} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent
            sx={{
              width: '350px',
              textAlign: 'center',
              alignItems: 'center',
            }}
          >
            <ErrorOutlineOutlinedIcon sx={{ fontSize: '80px', color: 'orange' }} />
            <Typography variant="h6" sx={{ color: 'black', textAlign: 'center' }}>
              {checkUnit?.length > 0 ? (
                <>
                  <span style={{ fontWeight: '700', color: '#777' }}>{`${deleteAttMode.name} `}</span>
                  was linked in <span style={{ fontWeight: '700' }}>Attendance Status Master</span>
                </>
              ) : (
                ''
              )}

              {/* {overalldeletecheck?.length > 0 ? (
                    <>
                      <span
                        style={{ fontWeight: "700", color: "#777" }}
                      >{`${overalldeletecheck.map(
                        (item) => item.categoryname
                      )} `}</span>
                      was linked in{" "}
                      <span style={{ fontWeight: "700" }}>IP Master</span>{" "}
                      {categoryList.filter(
                        (d) =>
                          !overalldeletecheck.some(
                            (item) => d.categoryname === item.categoryname
                          )
                      ).length > 0 && (
                          <Typography>
                            Do You want to Delete others?...
                          </Typography>
                        )}
                    </>
                  ) : (
                    ""
                  )} */}
            </Typography>
          </DialogContent>
          <DialogActions>
            {checkUnit?.length > 0 ? (
              // ||
              //   categoryList.filter(
              //     (d) =>
              //       !overalldeletecheck.ipcategory.some(
              //         (item) => d.categoryname === item.categoryname
              //       )
              //   ).length === 0
              <Button onClick={handleCloseCheck} autoFocus variant="contained" color="error">
                {' '}
                OK{' '}
              </Button>
            ) : (
              ''
            )}
            {/* {overalldeletecheck?.length > 0 &&
                  categoryList.filter(
                    (d) =>
                      !overalldeletecheck.some(
                        (item) => d.categoryname === item.categoryname
                      )
                  ).length > 0 ? (
                  <>
                    <Button
                      onClick={delReasoncheckboxWithoutLink}
                      variant="contained"
                    >
                      {" "}
                      Yes{" "}
                    </Button>
                    <Button
                      onClick={handleCloseCheck}
                      autoFocus
                      variant="contained"
                      color="error"
                    >
                      {" "}
                      Cancel{" "}
                    </Button>
                  </>
                ) : (
                  ""
                )} */}
          </DialogActions>
        </Dialog>

        <Dialog open={isbulkCheckOpen} onClose={handlebulkCloseCheck} aria-labelledby="alert-dialog-title" maxWidth="sm" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ textAlign: 'center', alignItems: 'center' }}>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: '80px', color: 'orange' }} />
            <Typography variant="h6" sx={{ color: 'black', textAlign: 'center' }}>
              {overalldeletecheck.ebuse?.length > 0 && (
                <>
                  <span style={{ fontWeight: '700', color: '#777' }}>{getLinkedLabelItem(overalldeletecheck)}</span> was linked in <span style={{ fontWeight: '700', color: '#777' }}>{getLinkedLabel(overalldeletecheck)}</span>
                  {shouldShowDeleteMessage(attModearr, selectedRows, overalldeletecheck) && <Typography>Do you want to delete others?...</Typography>}
                </>
              )}
            </Typography>
          </DialogContent>
          <DialogActions>
            {shouldEnableOkButton(attModearr, selectedRows, overalldeletecheck) ? (
              <Button onClick={handlebulkCloseCheck} autoFocus variant="contained" color="error">
                {' '}
                OK{' '}
              </Button>
            ) : null}
            {shouldShowDeleteMessage(attModearr, selectedRows, overalldeletecheck) && (
              <>
                <Button onClick={delEbservicecheckboxWithoutLink} variant="contained">
                  {' '}
                  Yes{' '}
                </Button>
                <Button onClick={handlebulkCloseCheck} autoFocus variant="contained" color="error">
                  Cancel
                </Button>
              </>
            )}
          </DialogActions>
        </Dialog>

        <Box>
          <Dialog open={isErrorOpenpop} onClose={handleCloseerrpop} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
              <Typography variant="h6">{showAlertpop}</Typography>
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                style={{
                  padding: '7px 13px',
                  color: 'white',
                  background: 'rgb(25, 118, 210)',
                }}
                onClick={() => {
                  sendEditRequest();
                  handleCloseerrpop();
                }}
              >
                ok
              </Button>
              <Button
                style={{
                  backgroundColor: '#f4f4f4',
                  color: '#444',
                  boxShadow: 'none',
                  borderRadius: '3px',
                  padding: '7px 13px',
                  border: '1px solid #0000006b',
                  '&:hover': {
                    '& .css-bluauu-MuiButtonBase-root-MuiButton-root': {
                      backgroundColor: '#f4f4f4',
                    },
                  },
                }}
                onClick={handleCloseerrpop}
              >
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </Box>
  );
}

export default AttendanceModeMaster;
