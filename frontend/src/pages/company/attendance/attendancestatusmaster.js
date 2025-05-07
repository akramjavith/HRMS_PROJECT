import React, { useState, useEffect, useRef, useContext } from 'react';
import { FaFileExcel, FaFileCsv, FaPrint, FaFilePdf } from 'react-icons/fa';
import { Box, Typography, OutlinedInput, Select, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Button, Popover } from '@mui/material';
import { userStyle, colourStyles } from '../../../pageStyle';
import { handleApiError } from '../../../components/Errorhandling';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import axios from 'axios';
import { SERVICE } from '../../../services/Baseservice';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { useReactToPrint } from 'react-to-print';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { UserRoleAccessContext, AuthContext } from '../../../context/Appcontext';
import Headtitle from '../../../components/Headtitle';
import { ThreeDots } from 'react-loader-spinner';
import { saveAs } from 'file-saver';
import ImageIcon from '@mui/icons-material/Image';
import Selects from 'react-select';
import domtoimage from 'dom-to-image';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import AggregatedSearchBar from '../../../components/AggregatedSearchBar.js';
import AggridTable from '../../../components/AggridTable.js';
import ExportData from '../../../components/ExportData';
import MessageAlert from '../../../components/MessageAlert';
import PageHeading from '../../../components/PageHeading';
import AlertDialog from '../../../components/Alert';
import InfoPopup from '../../../components/InfoPopup.js';
import { DeleteConfirmation, PleaseSelectRow } from '../../../components/DeleteConfirmation.js';
import ManageColumnsContent from '../../../components/ManageColumn';
import ResizeObserver from 'resize-observer-polyfill';
window.ResizeObserver = ResizeObserver;

function Attedancestatusmaster() {
  const gridRefTableAttStatus = useRef(null);
  const gridRefImageAttStatus = useRef(null);
  const [attendanceStatus, setAttendanceStatus] = useState({
    clockinstatus: 'Please Select Clock In Status',
    clockoutstatus: 'Please Select Clock Out Status',
    defalutclockinstatus: '',
    defaultclockoutstatus: '',
    name: 'Please Select Name',
    clockincount: '',
    clockoutcount: '',
    clockincountstart: '',
    clockoutcountstart: '',
    clockincountend: '',
    clockoutcountend: '',
  });
  const [isBtn, setIsBtn] = useState(false);
  const [attendanceEdit, setAttendanceEdit] = useState({
    clockinstatus: 'Please Select Clock In Status',
    clockoutstatus: 'Please Select Clock Out Status',
    defalutclockinstatus: '',
    defaultclockoutstatus: '',
    name: 'Please Select Name',
    clockincount: '',
    clockoutcount: '',
    clockincountstart: '',
    clockoutcountstart: '',
    clockincountend: '',
    clockoutcountend: '',
  });

  const [attModearr, setAttModearr] = useState([]);
  const [leavetypeData, setLeaveTypeData] = useState([]);
  const [leavetypeDataOut, setLeaveTypeDataOut] = useState([]);
  const [sources, setSources] = useState([]);

  const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);
  const [sourceCheck, setSourcecheck] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [items, setItems] = useState([]);

  // State to track advanced filter
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const [searchedString, setSearchedString] = useState('');

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
  // pageAttStatus refersh reload
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

  //Datatable
  const [pageAttStatus, setPageAttStatus] = useState(1);
  const [pageSizeAttStatus, setPageSizeAttStatus] = useState(10);
  const [searchQueryAttStatus, setSearchQueryAttStatus] = useState('');
  const [totalPagesAttStatus, setTotalPagesAttStatus] = useState('');
  const [isHandleChange, setIsHandleChange] = useState(false);

  // view model
  const [openview, setOpenview] = useState(false);
  const handleClickOpenview = () => {
    setOpenview(true);
  };
  const handleCloseview = () => {
    setOpenview(false);
  };

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  //Delete model
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
  };

  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
  const handleClickOpenalert = () => {
    if (selectedRows.length === 0) {
      setIsDeleteOpenalert(true);
    } else {
      setIsDeleteOpencheckbox(true);
    }
  };
  const handleCloseModalert = () => {
    setIsDeleteOpenalert(false);
  };

  //Delete model
  const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);
  const handleClickOpencheckbox = () => {
    setIsDeleteOpencheckbox(true);
  };
  const handleCloseModcheckbox = () => {
    setIsDeleteOpencheckbox(false);
  };

  // Manage Columns
  const [searchQueryManageAttStatus, setSearchQueryManageAttStatus] = useState('');
  const [isManageColumnsOpenAttStatus, setManageColumnsOpenAttStatus] = useState(false);
  const [anchorElAttStatus, setAnchorElAttStatus] = useState(null);

  const handleOpenManageColumnsAttStatus = (event) => {
    setAnchorElAttStatus(event.currentTarget);
    setManageColumnsOpenAttStatus(true);
  };
  const handleCloseManageColumnsAttStatus = () => {
    setManageColumnsOpenAttStatus(false);
    setSearchQueryManageAttStatus('');
  };

  const openAttStatus = Boolean(anchorElAttStatus);
  const idAttStatus = openAttStatus ? 'simple-popover' : undefined;

  // Search bar
  const [anchorElSearchAttStatus, setAnchorElSearchAttStatus] = React.useState(null);
  const handleClickSearchAttStatus = (event) => {
    setAnchorElSearchAttStatus(event.currentTarget);
  };
  const handleCloseSearchAttStatus = () => {
    setAnchorElSearchAttStatus(null);
    setSearchQueryAttStatus('');
  };

  const openSearchAttStatus = Boolean(anchorElSearchAttStatus);
  const idSearchAttStatus = openSearchAttStatus ? 'simple-popover' : undefined;

  // Table row color
  const getRowStyle = (params) => {
    if (params.node.rowIndex % 2 === 0) {
      return { background: '#f0f0f0' }; // Even row
    } else {
      return { background: '#ffffff' }; // Odd row
    }
  };

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    clockinstatus: true,
    clockoutstatus: true,
    name: true,
    actions: true,
  };

  const [columnVisibilityAttStatus, setColumnVisibilityAttStatus] = useState(initialColumnVisibility);

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
      pagename: String('Attendance Status Master'),
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

  // pageAttStatus refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ''; // This is required for Chrome support
  };

  const [deleteSource, setDeleteSource] = useState('');

  const rowData = async (id, name) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.ATTENDANCE_STATUS_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeleteSource(res?.data?.sattendancestatus);
      handleClickOpen();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // Alert delete popup
  let Sourcesid = deleteSource?._id;
  const delSource = async () => {
    setPageName(!pageName);
    try {
      if (Sourcesid) {
        await axios.delete(`${SERVICE.ATTENDANCE_STATUS_SINGLE}/${Sourcesid}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
        await fetchAttedanceStatus();
        setIsHandleChange(false);
        handleCloseMod();
        setSelectedRows([]);
        setPageAttStatus(1);
      }
      setPopupContent('Deleted Successfully');
      setPopupSeverity('success');
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const delSourcecheckbox = async () => {
    setPageName(!pageName);
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.ATTENDANCE_STATUS_SINGLE}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });

      // Wait for all delete requests to complete
      await Promise.all(deletePromises);
      setIsHandleChange(false);
      handleCloseModcheckbox();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPageAttStatus(1);

      await fetchAttedanceStatus();
      setPopupContent('Deleted Successfully');
      setPopupSeverity('success');
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //add function
  const sendRequest = async () => {
    setPageName(!pageName);
    setIsBtn(true);
    try {
      let subprojectscreate = await axios.post(SERVICE.ATTENDANCE_STATUS_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },

        clockincount: String(attendanceStatus.clockincount),
        clockincountstatus: Boolean(attendanceStatus.clockinstatus === 'Late - ClockIn' ? true : false),
        clockoutcountstatus: Boolean(attendanceStatus.clockoutstatus === 'Early - ClockOut' ? true : false),
        clockoutcount: String(attendanceStatus.clockoutcount),
        clockinstatus: String(attendanceStatus.clockinstatus),
        clockoutstatus: String(attendanceStatus.clockoutstatus),
        defalutclockinstatus: String(attendanceStatus.clockinstatus),
        defaultclockoutstatus: String(attendanceStatus.clockoutstatus),
        name: String(attendanceStatus.name),
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await fetchAttedanceStatus();
      setAttendanceStatus({
        ...attendanceStatus,
        name: 'Please Select Name',
      });
      setPageAttStatus(1);
      setPageSizeAttStatus(10);
      setPopupContent('Added Successfully');
      setPopupSeverity('success');
      handleClickOpenPopup();
      setIsBtn(false);
    } catch (err) {
      setIsBtn(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //Late Clockin request
  const sendClkLateRequest = async (resultArray) => {
    setPageName(!pageName);
    setIsBtn(true);
    try {
      resultArray.forEach((data, index) => {
        const isNameMatch = sources.some(
          (item) => item.name.toLowerCase() === attendanceStatus.name.toLowerCase() && item.clockinstatus.toLowerCase() === (data === 0 ? '' : data + attendanceStatus.clockinstatus).toLowerCase() && item.clockoutstatus.toLowerCase() === attendanceStatus.clockoutstatus.toLowerCase()
        );
        if (isNameMatch) {
          setPopupContentMalert('Name Already Exists!');
          setPopupSeverityMalert('warning');
          handleClickOpenPopupMalert();
        } else {
          axios.post(SERVICE.ATTENDANCE_STATUS_CREATE, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            clockincount: String(data),
            clockoutcount: String(attendanceStatus.clockoutcount),
            clockinstatus: String(data + attendanceStatus.clockinstatus),
            clockoutstatus: String(attendanceStatus.clockoutstatus),
            defalutclockinstatus: String(attendanceStatus.clockinstatus),
            defaultclockoutstatus: String(attendanceStatus.clockoutstatus),
            name: String(attendanceStatus.name),
            clockincountstatus: Boolean(attendanceStatus.clockinstatus === 'Late - ClockIn' ? true : false),
            clockoutcountstatus: Boolean(attendanceStatus.clockoutstatus === 'Early - ClockOut' ? true : false),
            addedby: [
              {
                name: String(isUserRoleAccess.companyname),
                date: String(new Date()),
              },
            ],
          });

          fetchAttedanceStatus();
        }
      });

      await fetchAttedanceStatus();
      setAttendanceStatus({
        ...attendanceStatus,
        name: 'Please Select Name',
      });
      setPopupContent('Added Successfully');
      setPopupSeverity('success');
      handleClickOpenPopup();
      setIsBtn(false);
    } catch (err) {
      setIsBtn(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  const sendClkLateCokEarlyRequest = async (cinresultArray, coutresultArray) => {
    setPageName(!pageName);
    setIsBtn(true);
    try {
      cinresultArray.forEach((data, index) => {
        coutresultArray.forEach((cata, cindex) => {
          const isNameMatch = sources.some(
            (item) =>
              item.name.toLowerCase() === attendanceStatus.name.toLowerCase() &&
              item.clockinstatus.toLowerCase() === (data === 0 ? '' : data + attendanceStatus.clockinstatus).toLowerCase() &&
              item.clockoutstatus.toLowerCase() === (cata === 0 ? '' : cata + attendanceStatus.clockoutstatus).toLowerCase()
          );
          if (isNameMatch) {
            setPopupContentMalert('Name Already Exists!');
            setPopupSeverityMalert('warning');
            handleClickOpenPopupMalert();
          } else {
            axios.post(SERVICE.ATTENDANCE_STATUS_CREATE, {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
              clockincount: String(data),
              clockoutcount: String(cata),
              clockinstatus: String(data + attendanceStatus.clockinstatus),
              clockoutstatus: String(cata + attendanceStatus.clockoutstatus),
              defalutclockinstatus: String(attendanceStatus.clockinstatus),
              defaultclockoutstatus: String(attendanceStatus.clockoutstatus),
              name: String(attendanceStatus.name),
              clockincountstatus: Boolean(attendanceStatus.clockinstatus === 'Late - ClockIn' ? true : false),
              clockoutcountstatus: Boolean(attendanceStatus.clockoutstatus === 'Early - ClockOut' ? true : false),
              addedby: [
                {
                  name: String(isUserRoleAccess.companyname),
                  date: String(new Date()),
                },
              ],
            });

            fetchAttedanceStatus();
          }
        });
      });

      await fetchAttedanceStatus();

      setAttendanceStatus({
        ...attendanceStatus,
        name: 'Please Select Name',
      });
      setPopupContent('Added Successfully');
      setPopupSeverity('success');
      handleClickOpenPopup();
      setIsBtn(false);
    } catch (err) {
      setIsBtn(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  //early Clockout request
  const sendCokEarlyRequest = async (resultArray) => {
    setPageName(!pageName);
    setIsBtn(true);
    try {
      resultArray.forEach((data, index) => {
        const isNameMatch = sources.some(
          (item) => item.name.toLowerCase() === attendanceStatus.name.toLowerCase() && item.clockinstatus.toLowerCase() === attendanceStatus.clockinstatus.toLowerCase() && item.clockoutstatus.toLowerCase() === (data === 0 ? '' : data + attendanceStatus.clockoutstatus).toLowerCase()
        );
        if (isNameMatch) {
          setPopupContentMalert('Name Already Exists!');
          setPopupSeverityMalert('warning');
          handleClickOpenPopupMalert();
        } else {
          axios.post(SERVICE.ATTENDANCE_STATUS_CREATE, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            clockincount: String(attendanceStatus.clockincount),
            clockoutcount: String(data),
            clockinstatus: String(attendanceStatus.clockinstatus),
            clockoutstatus: String(data + attendanceStatus.clockoutstatus),
            name: String(attendanceStatus.name),
            defalutclockinstatus: String(attendanceStatus.clockinstatus),
            defaultclockoutstatus: String(attendanceStatus.clockoutstatus),
            clockincountstatus: Boolean(attendanceStatus.clockinstatus === 'Late - ClockIn' ? true : false),
            clockoutcountstatus: Boolean(attendanceStatus.clockoutstatus === 'Early - ClockOut' ? true : false),
            addedby: [
              {
                name: String(isUserRoleAccess.companyname),
                date: String(new Date()),
              },
            ],
          });

          fetchAttedanceStatus();
        }
      });

      await fetchAttedanceStatus();
      setAttendanceStatus({
        ...attendanceStatus,
        name: 'Please Select Name',
      });
      setPopupContent('Added Successfully');
      setPopupSeverity('success');
      handleClickOpenPopup();
      setIsBtn(false);
    } catch (err) {
      setIsBtn(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //long absent & long leave concept 
  const sendLongAbsenLeaveRequest = async (resultArray) => {
    setPageName(!pageName);
    setIsBtn(true);
    try {
      resultArray.forEach((data, index) => {
        const isNameMatch = sources.some(
          (item) => item.name.toLowerCase() === attendanceStatus.name.toLowerCase() && item.clockinstatus.toLowerCase() === data + attendanceStatus.clockinstatus.toLowerCase() && item.clockoutstatus.toLowerCase() === data + attendanceStatus.clockoutstatus.toLowerCase()
        );
        if (isNameMatch) {
          setPopupContentMalert('Name Already Exists!');
          setPopupSeverityMalert('warning');
          handleClickOpenPopupMalert();
        } else {
          axios.post(SERVICE.ATTENDANCE_STATUS_CREATE, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            clockincount: String(attendanceStatus.clockincount),
            clockoutcount: String(data),
            clockinstatus: String(data + attendanceStatus.clockinstatus),
            clockoutstatus: String(data + attendanceStatus.clockoutstatus),
            name: String(attendanceStatus.name),
            defalutclockinstatus: String(attendanceStatus.clockinstatus),
            defaultclockoutstatus: String(attendanceStatus.clockoutstatus),
            clockincountstatus: Boolean(true),
            clockoutcountstatus: Boolean(true),
            addedby: [
              {
                name: String(isUserRoleAccess.companyname),
                date: String(new Date()),
              },
            ],
          });

          fetchAttedanceStatus();
        }
      });

      await fetchAttedanceStatus();
      setAttendanceStatus({
        ...attendanceStatus,
        name: 'Please Select Name',
      });
      setPopupContent('Added Successfully');
      setPopupSeverity('success');
      handleClickOpenPopup();
      setIsBtn(false);
    } catch (err) {
      setIsBtn(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //submit option for saving
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isNameMatch = sources.some(
      (item) =>
        item.name.toLowerCase() === attendanceStatus.name.toLowerCase() &&
        item.clockinstatus.toLowerCase() === (attendanceStatus.clockincount + attendanceStatus.clockinstatus).toLowerCase() &&
        item.clockoutstatus.toLowerCase() === (attendanceStatus.clockoutcount + attendanceStatus.clockoutstatus).toLowerCase()
    );

    if (attendanceStatus.clockinstatus === 'Please Select Clock In Status') {
      setPopupContentMalert('Please Select Clock In Status');
      setPopupSeverityMalert('warning');
      handleClickOpenPopupMalert();
    } else if (attendanceStatus.clockoutstatus === 'Please Select Clock Out Status') {
      setPopupContentMalert('Please Select Clock Out Status');
      setPopupSeverityMalert('warning');
      handleClickOpenPopupMalert();
    } else if (attendanceStatus.name === 'Please Select Name') {
      setPopupContentMalert('Please Select Name');
      setPopupSeverityMalert('warning');
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert('Name Already Exists!');
      setPopupSeverityMalert('warning');
      handleClickOpenPopupMalert();
    } else if (attendanceStatus.clockinstatus === 'Late - ClockIn' && attendanceStatus.clockoutstatus != 'Early - ClockOut') {
      if (attendanceStatus.clockincountstart === '' && attendanceStatus.clockincountend === '') {
        sendRequest();
      } else if (!(Number(attendanceStatus.clockincountstart) < Number(attendanceStatus.clockincountend))) {
        setPopupContentMalert('End Count Must Greater than Start Count!!');
        setPopupSeverityMalert('warning');
        handleClickOpenPopupMalert();
      } else {
        const startValue = parseInt(attendanceStatus.clockincountstart, 10);
        const endValue = parseInt(attendanceStatus.clockincountend, 10);

        if (!isNaN(startValue) && !isNaN(endValue)) {
          // Ensure that startValue and endValue are valid numbers
          let resultArray = [];
          for (let i = startValue; i <= endValue; i++) {
            resultArray.push(i);
          }

          await sendClkLateRequest(resultArray);
        } else {
          setPopupContentMalert('Invalid start or end value!');
          setPopupSeverityMalert('warning');
          handleClickOpenPopupMalert();
        }
      }
    } else if (attendanceStatus.clockinstatus != 'Late - ClockIn' && attendanceStatus.clockoutstatus === 'Early - ClockOut') {
      if (attendanceStatus.clockoutcountstart === '' && attendanceStatus.clockoutcountend === '') {
        sendRequest();
      } else if (!(Number(attendanceStatus.clockoutcountstart) < Number(attendanceStatus.clockoutcountend))) {
        setPopupContentMalert('End Count Must Greater than Start Count!!');
        setPopupSeverityMalert('warning');
        handleClickOpenPopupMalert();
      } else {
        const startValue = parseInt(attendanceStatus.clockoutcountstart, 10);
        const endValue = parseInt(attendanceStatus.clockoutcountend, 10);

        if (!isNaN(startValue) && !isNaN(endValue)) {
          // Ensure that startValue and endValue are valid numbers
          let resultArray = [];
          for (let i = startValue; i <= endValue; i++) {
            resultArray.push(i);
          }

          await sendCokEarlyRequest(resultArray);
        } else {
          setPopupContentMalert('Invalid start or end value!');
          setPopupSeverityMalert('warning');
          handleClickOpenPopupMalert();
        }
      }
    } else if (attendanceStatus.clockinstatus === 'Late - ClockIn' && attendanceStatus.clockoutstatus === 'Early - ClockOut') {
      if (attendanceStatus.clockoutcountstart === '' && attendanceStatus.clockoutcountend === '' && attendanceStatus.clockoutcountstart === '' && attendanceStatus.clockoutcountend === '') {
        sendRequest();
      } else {
        const startValue = parseInt(attendanceStatus.clockincountstart, 10);
        const endValue = parseInt(attendanceStatus.clockincountend, 10);
        const co1startValue = parseInt(attendanceStatus.clockoutcountstart, 10);
        const co2endValue = parseInt(attendanceStatus.clockoutcountend, 10);
        let cinresultArray = [];
        let coutresultArray = [];
        if (isNaN(startValue) && isNaN(endValue)) {
          setPopupContentMalert('Clock In Invalid start or end value!');
          setPopupSeverityMalert('warning');
          handleClickOpenPopupMalert();
        } else if (isNaN(co1startValue) && isNaN(co2endValue)) {
          setPopupContentMalert('Clock Out Invalid start or end value!');
          setPopupSeverityMalert('warning');
          handleClickOpenPopupMalert();
        } else {
          for (let i = startValue; i <= endValue; i++) {
            cinresultArray.push(i);
          }
          for (let i = co1startValue; i <= co2endValue; i++) {
            coutresultArray.push(i);
          }
          await sendClkLateCokEarlyRequest(cinresultArray, coutresultArray);
        }
      }
    } else if (attendanceStatus.clockinstatus != 'Late - ClockIn' && attendanceStatus.clockoutstatus === 'Early - ClockOut') {
      if (attendanceStatus.clockoutcountstart === '' && attendanceStatus.clockoutcountend === '') {
        sendRequest();
      } else if (!(Number(attendanceStatus.clockoutcountstart) < Number(attendanceStatus.clockoutcountend))) {
        setPopupContentMalert('End Count Must Greater than Start Count!!');
        setPopupSeverityMalert('warning');
        handleClickOpenPopupMalert();
      } else {
        const startValue = parseInt(attendanceStatus.clockoutcountstart, 10);
        const endValue = parseInt(attendanceStatus.clockoutcountend, 10);

        if (!isNaN(startValue) && !isNaN(endValue)) {
          // Ensure that startValue and endValue are valid numbers
          let resultArray = [];
          for (let i = startValue; i <= endValue; i++) {
            resultArray.push(i);
          }

          await sendCokEarlyRequest(resultArray);
        } else {
          setPopupContentMalert('Invalid start or end value!');
          setPopupSeverityMalert('warning');
          handleClickOpenPopupMalert();
        }
      }
    } else if (["Long Leave", "Long Absent", "Long BL - Absent"].some(status => attendanceStatus.clockinstatus?.includes(status))) {
      if (!(Number(attendanceStatus.clockincountstart) < Number(attendanceStatus.clockincountend))) {
        setPopupContentMalert('End Count Must Greater than Start Count!!');
        setPopupSeverityMalert('warning');
        handleClickOpenPopupMalert();
      } else {
        const startValue = parseInt(attendanceStatus.clockincountstart, 10);
        const endValue = parseInt(attendanceStatus.clockincountend, 10);

        if (!isNaN(startValue) && !isNaN(endValue)) {
          // Ensure that startValue and endValue are valid numbers
          let resultArray = [];
          for (let i = startValue; i <= endValue; i++) {
            resultArray.push(i);
          }

          await sendLongAbsenLeaveRequest(resultArray);
        } else {
          setPopupContentMalert('Invalid start or end value!');
          setPopupSeverityMalert('warning');
          handleClickOpenPopupMalert();
        }
      }
    } else {
      sendRequest();
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    setAttendanceStatus({
      clockinstatus: 'Please Select Clock In Status',
      clockoutstatus: 'Please Select Clock Out Status',
      defalutclockinstatus: '',
      defaultclockoutstatus: '',
      name: 'Please Select Name',
      clockincount: '',
      clockoutcount: '',
      clockincountstart: '',
      clockoutcountstart: '',
      clockincountend: '',
      clockoutcountend: '',
    });
    setPopupContent('Cleared Successfully');
    setPopupSeverity('success');
    handleClickOpenPopup();
  };

  // info model
  const [openInfo, setOpeninfo] = useState(false);
  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };
  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  // get single row to view....
  const getviewCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.ATTENDANCE_STATUS_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAttendanceEdit(res?.data?.sattendancestatus);
      handleClickOpenview();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  // get single row to view....
  const getinfoCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.ATTENDANCE_STATUS_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAttendanceEdit(res?.data?.sattendancestatus);
      handleClickOpeninfo();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //Project updateby edit pageAttStatus...
  let updateby = attendanceEdit?.updatedby;
  let addedby = attendanceEdit?.addedby;
  let subprojectsid = attendanceEdit?._id;

  //get all Sub vendormasters.
  const fetchAttedanceStatus = async () => {
    setPageName(!pageName);
    try {
      let res_vendor = await axios.get(SERVICE.ATTENDANCE_STATUS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSourcecheck(true);
      const itemsWithSerialNumber = res_vendor?.data?.attendancestatus?.map((item, index) => ({ ...item, id: item._id, serialNumber: index + 1 }));
      setSources(itemsWithSerialNumber);
      setSearchQueryAttStatus('');
      setTotalPagesAttStatus(Math.ceil(res_vendor?.data?.attendancestatus.length / pageSizeAttStatus));
    } catch (err) {
      setSourcecheck(true);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const fetchLeaveType = async () => {
    setPageName(!pageName);
    const rearr = [];
    const perarr = [];
    try {
      let res_type = await axios.get(SERVICE.LEAVETYPE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let leavestatusarr = ['Approved'];
      let leavestatushp = ['DHA', 'DDL', 'DDHB', 'DDHA', 'DHB', 'HA', 'HB', 'DL'];
      let leavedaystatus = ['DDL', 'DL']
      res_type?.data?.leavetype.forEach((data, index) => {
        let resdata = leavestatusarr.map((leavestatus, i) => {
          rearr.push(data.code + ' ' + leavestatus);
        });
      });
      res_type?.data?.leavetype.forEach((data, index) => {
        let resdata = leavestatusarr.map((leavestatus, i) => {
          let resdaysleave = leavedaystatus.map((dayval, rindex) => {
            perarr.push(`Long Leave ${dayval} - ${data.code} ${leavestatus}`);
          });

          perarr.push(`Long Leave ${data.code} ${leavestatus}`);

          let resleave = leavestatushp.map((red, rindex) => {
            perarr.push(`${red} - ${data.code} ${leavestatus}`);

          });
        });
      });
      let sumresclockin = [...clockInOpt, ...rearr, ...perarr];
      let finalresclockin = sumresclockin
        .map((t) => ({
          ...t,
          label: t,
          value: t,
        }))
        .filter((item, index, self) => {
          return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
        });
      let sumresclockout = [...clockOutOpt, ...rearr, ...perarr];
      let finalresclockout = sumresclockout
        .map((t) => ({
          ...t,
          label: t,
          value: t,
        }))
        .filter((item, index, self) => {
          return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
        });
      setLeaveTypeData(finalresclockin);
      setLeaveTypeDataOut(finalresclockout);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    fetchAttStatus();
    fetchLeaveType();
  }, []);

  useEffect(() => {
    fetchAttedanceStatus();
  }, []);

  const handleClockStart = (e) => {
    const regex = /^\d*\.?\d*$/;
    let num = e.target.value.slice(0, 3);
    setAttendanceStatus({ ...attendanceStatus, clockincountstart: Number(num) });
  };

  const handleClockEnd = (e) => {
    const regex = /^\d*\.?\d*$/;
    let num = e.target.value.slice(0, 3);
    setAttendanceStatus({ ...attendanceStatus, clockincountend: Number(num) });
  };
  const handleCoutStart = (e) => {
    const regex = /^\d*\.?\d*$/;
    let num = e.target.value.slice(0, 3);
    setAttendanceStatus({ ...attendanceStatus, clockoutcountstart: Number(num) });
  };
  const handleCoutEnd = (e) => {
    const regex = /^\d*\.?\d*$/;
    let num = e.target.value.slice(0, 3);
    setAttendanceStatus({ ...attendanceStatus, clockoutcountend: Number(num) });
  };

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener('beforeunload', beforeUnloadHandler);
    return () => {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
    };
  }, []);

  const addSerialNumber = (datas) => {
    setItems(datas);
  };

  useEffect(() => {
    addSerialNumber(sources);
  }, [sources]);

  const fetchAttStatus = async () => {
    setPageName(!pageName);
    try {
      let res_freq = await axios.get(SERVICE.ATTENDANCE_MODE_STATUS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let modeall = [
        ...res_freq?.data?.allattmodestatus.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];
      setAttModearr(modeall);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // Split the search query into individual terms
  const searchTerms = searchQueryAttStatus.toLowerCase().split(' ');
  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchTerms.every((term) => Object.values(item).join(' ').toLowerCase().includes(term));
  });

  // Pagination for outer filter
  const filteredData = filteredDatas?.slice((pageAttStatus - 1) * pageSizeAttStatus, pageAttStatus * pageSizeAttStatus);
  const totalPagesAttStatusOuter = Math.ceil(filteredDatas?.length / pageSizeAttStatus);
  const visiblePages = Math.min(totalPagesAttStatusOuter, 3);
  const firstVisiblePage = Math.max(1, pageAttStatus - 1);
  const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPagesAttStatusOuter);
  const pageNumbers = [];
  const indexOfLastItem = pageAttStatus * pageSizeAttStatus;
  const indexOfFirstItem = indexOfLastItem - pageSizeAttStatus;
  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  }

  const columnDataTableAttStatus = [
    {
      field: 'checkbox',
      headerName: 'Checkbox',
      sortable: false,
      width: 90,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      hide: !columnVisibilityAttStatus.checkbox,
      pinned: 'left',
      lockPinned: true,
    },
    { field: 'serialNumber', headerName: 'SNo', flex: 0, width: 80, hide: !columnVisibilityAttStatus.serialNumber },
    { field: 'clockinstatus', headerName: 'Clock In Status', flex: 0, width: 250, hide: !columnVisibilityAttStatus.clockinstatus },
    { field: 'clockoutstatus', headerName: 'Clock Out Status', flex: 0, width: 250, hide: !columnVisibilityAttStatus.clockoutstatus },
    { field: 'name', headerName: 'Name', flex: 0, width: 250, hide: !columnVisibilityAttStatus.name },
    {
      field: 'actions',
      headerName: 'Action',
      flex: 0,
      width: 250,
      minHeight: '40px !important',
      filter: false,
      sortable: false,
      hide: !columnVisibilityAttStatus.actions,
      cellRenderer: (params) => (
        <Grid sx={{ display: 'flex' }}>
          <Box>
            {isUserRoleCompare?.includes('dattendancestatusmaster') && (
              <Button
                sx={userStyle.buttondelete}
                onClick={(e) => {
                  rowData(params.data.id, params.data.name);
                }}
              >
                <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
              </Button>
            )}
            {isUserRoleCompare?.includes('vattendancestatusmaster') && (
              <Button
                sx={userStyle.buttonedit}
                onClick={() => {
                  getviewCode(params.data.id);
                }}
              >
                <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
              </Button>
            )}
            {isUserRoleCompare?.includes('iattendancestatusmaster') && (
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
    setPageSizeAttStatus(Number(event.target.value));
    setSelectedRows([]);
    setSelectAllChecked(false);
    setPageAttStatus(1);
  };

  // Show All Columns functionality
  const handleShowAllColumns = () => {
    const updatedVisibility = { ...columnVisibilityAttStatus };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibilityAttStatus(updatedVisibility);
  };

  // // Function to filter columns based on search query
  const filteredColumns = columnDataTableAttStatus.filter((column) => column.headerName.toLowerCase().includes(searchQueryManageAttStatus.toLowerCase()));

  // Manage Columns functionality
  const toggleColumnVisibility = (field) => {
    setColumnVisibilityAttStatus((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };
  const clockInOpt = [
    'Shift Not Started',
    'Early - ClockIn',
    'Not Allotted',
    'Week Off Present',
    'Long Leave LWP Approved',
    'Long Leave DL - LWP Approved',
    'Long Leave DDL - LWP Approved',
    'Long Absent',
    'Long BL - Absent',
    // 'Pending...',
    'BeforeAndAfterWeekOffAbsent',
    'BeforeAndAfterWeekOffLeave',
    'Pending',
    'BL - Absent',
    // 'DDHA - LWP Applied',
    // 'DDHB - LWP Applied',
    // 'DDL - LWP Applied',
    // 'DHA - LWP Applied',
    // 'DHB - LWP Applied',
    // 'HA - LWP Applied',
    // 'HB - LWP Applied',
    // 'DL - LWP Applied',
    'DDHA - LWP Approved',
    'DDHB - LWP Approved',
    'DDL - LWP Approved',
    'DHA - LWP Approved',
    'DHB - LWP Approved',
    'HA - LWP Approved',
    'HB - LWP Approved',
    'DL - LWP Approved',
    // 'DDHA - LWP Rejected',
    // 'DDHB - LWP Rejected',
    // 'DDL - LWP Rejected',
    // 'DHA - LWP Rejected',
    // 'DHB - LWP Rejected',
    // 'HA - LWP Rejected',
    // 'HB - LWP Rejected',
    // 'DL - LWP Rejected',
    // 'LWP Applied',
    'LWP Approved',
    // 'LWP Rejected',
    'On - Present',
    'BeforeWeekOffAbsent',
    'AfterWeekOffAbsent',
    // 'PERAPPR',
    // 'PERAPPL',
    // 'PERREJ',
    'PERAPPR - IN',
    'COMP - PERAPPRIN',
    // 'COMP - PERAPPR',
    // 'COMP - PERAPPL',
    // 'HB Applied',
    'HB Approved',
    // 'HB Rejected',
    // 'HA Applied',
    'HA Approved',
    // 'HA Rejected',
    // 'DL Applied',
    'DL Approved',
    // 'DL Rejected',
    // 'DHB Applied',
    'DHB Approved',
    // 'DHB Rejected',
    // 'DHA Applied',
    'DHA Approved',
    // 'DHA Rejected',
    'HBLOP',
    'FLOP',
    'Grace - ClockIn',
    'Late - ClockIn',
    'Present',
    'Absent',
    'Week Off',
    'Mis - ClockIn',
    'Holiday',
    'Leave',
    'BeforeWeekOffLeave',
    'AfterWeekOffLeave',
  ];

  const clockOutOpt = [
    'Shift Not Started',
    'Early - ClockOut',
    'Over - ClockOut',
    'Long Leave LWP Approved',
    'Long Leave DL - LWP Approved',
    'Long Leave DDL - LWP Approved',
    'Long Absent',
    'Long BL - Absent',
    'Not Allotted',
    // 'LWP Applied',
    'LWP Approved',
    // 'LWP Rejected',
    'BL - Absent',
    // 'Pending...',
    'Week Off Present',
    'BeforeAndAfterWeekOffAbsent',
    'BeforeAndAfterWeekOffLeave',
    'Pending',
    // 'DDHA - LWP Applied',
    // 'DDHB - LWP Applied',
    // 'DDL - LWP Applied',
    // 'DHA - LWP Applied',
    // 'DHB - LWP Applied',
    // 'HA - LWP Applied',
    // 'HB - LWP Applied',
    // 'DL - LWP Applied',
    'DDHA - LWP Approved',
    'DDHB - LWP Approved',
    'DDL - LWP Approved',
    'DHA - LWP Approved',
    'DHB - LWP Approved',
    'HA - LWP Approved',
    'HB - LWP Approved',
    'DL - LWP Approved',
    // 'DDHA - LWP Rejected',
    // 'DDHB - LWP Rejected',
    // 'DDL - LWP Rejected',
    // 'DHA - LWP Rejected',
    // 'DHB - LWP Rejected',
    // 'HA - LWP Rejected',
    // 'HB - LWP Rejected',
    // 'DL - LWP Rejected',
    // 'PERAPPR',
    // 'PERAPPL',
    // 'PERREJ',
    // 'COMP - PERAPPR',
    // 'COMP - PERAPPL',
    'PERAPPR - OUT',
    'COMP - PERAPPROUT',
    // 'HB Applied',
    'HB Approved',
    // 'HB Rejected',
    // 'HA Applied',
    'HA Approved',
    // 'HA Rejected',
    // 'DL Applied',
    'DL Approved',
    // 'DL Rejected',
    // 'DHB Applied',
    'DHB Approved',
    // 'DHB Rejected',
    // 'DHA Applied',
    'DHA Approved',
    // 'DHA Rejected',
    'BeforeWeekOffAbsent',
    'AfterWeekOffAbsent',
    'HALOP',
    'On - ClockOut',
    'Auto Mis - ClockOut',
    'Pending',
    'Present',
    'Absent',
    'Week Off',
    'Mis - ClockOut',
    'Holiday',
    'Leave',
    'FLOP',
    'BeforeWeekOffLeave',
    'AfterWeekOffLeave',
  ];

  // Excel
  const [fileFormat, setFormat] = useState('');
  let exportColumnNamescrt = ['Clock In Status', 'Clock Out Status', 'Name'];
  let exportRowValuescrt = ['clockinstatus', 'clockoutstatus', 'name'];

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Attendance Status Master',
    pageStyle: 'print',
  });

  // image
  const handleCaptureImage = () => {
    if (gridRefImageAttStatus.current) {
      domtoimage
        .toBlob(gridRefImageAttStatus.current)
        .then((blob) => {
          saveAs(blob, 'Attendance Status Master.png');
        })
        .catch((error) => {
          console.error('dom-to-image error: ', error);
        });
    }
  };

  return (
    <Box>
      <Headtitle title={'Attendance Status Master'} />
      {/* ****** Header Content ****** */}
      <PageHeading title="Attendance Status Master" modulename="Human Resources" submodulename="HR" mainpagename="Attendance" subpagename="Attendance Setup" subsubpagename="Attendance Status Master" />
      {isUserRoleCompare?.includes('aattendancestatusmaster') && (
        <>
          <Box sx={userStyle.dialogbox}>
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sx={12}>
                <Typography sx={userStyle.importheadtext}>Add Attendance Status Master</Typography>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <Typography>
                  Clock In Status<b style={{ color: 'red' }}>*</b>
                </Typography>
                <FormControl size="small" fullWidth>
                  <Selects
                    styles={colourStyles}
                    options={leavetypeData}
                    value={{ label: attendanceStatus.clockinstatus, value: attendanceStatus.clockinstatus }}
                    onChange={(e) => {
                      setAttendanceStatus({
                        ...attendanceStatus,
                        clockoutstatus: ["Long Leave", "Long Absent", "Long BL - Absent"].some(status => e.value?.includes(status)) ? e.value : "Please Select Clock Out Status",
                        clockinstatus: e.value,
                        clockincount: '',
                        clockincountstart: '',
                        clockincountend: '',
                      });
                    }}
                  />
                </FormControl>
              </Grid>
              {attendanceStatus.clockinstatus === 'Late - ClockIn' && (
                <>
                  <Grid item md={3} xs={12} sm={12}>
                    <Typography>Clock In Status Start Count</Typography>
                    <FormControl size="small" fullWidth>
                      <OutlinedInput
                        id="component-outlined"
                        type="number"
                        sx={userStyle.input}
                        placeholder="Please Enter Count"
                        value={attendanceStatus.clockincountstart}
                        onChange={(e) => {
                          handleClockStart(e);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <Typography>Clock In Status End Count</Typography>
                    <FormControl size="small" fullWidth>
                      <OutlinedInput
                        id="component-outlined"
                        type="number"
                        sx={userStyle.input}
                        placeholder="Please Enter Count"
                        value={attendanceStatus.clockincountend}
                        onChange={(e) => {
                          handleClockEnd(e);
                        }}
                      />
                    </FormControl>
                  </Grid>
                </>
              )}
              {["Long Leave", "Long Absent", "Long BL - Absent"].some(status => attendanceStatus.clockinstatus?.includes(status)) && (
                <>
                  <Grid item md={3} xs={12} sm={12}>
                    <Typography>Clock In Status Start Count</Typography>
                    <FormControl size="small" fullWidth>
                      <OutlinedInput
                        id="component-outlined"
                        type="number"
                        sx={userStyle.input}
                        placeholder="Please Enter Count"
                        value={attendanceStatus.clockincountstart}
                        onChange={(e) => {
                          handleClockStart(e);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <Typography>Clock In Status End Count</Typography>
                    <FormControl size="small" fullWidth>
                      <OutlinedInput
                        id="component-outlined"
                        type="number"
                        sx={userStyle.input}
                        placeholder="Please Enter Count"
                        value={attendanceStatus.clockincountend}
                        onChange={(e) => {
                          handleClockEnd(e);
                        }}
                      />
                    </FormControl>
                  </Grid>
                </>
              )}
              {["Long Leave", "Long Absent", "Long BL - Absent"].some(status => attendanceStatus.clockinstatus?.includes(status)) ? (
                <Grid item md={3} xs={12} sm={12}>
                  <Typography>
                    Clock Out Status<b style={{ color: 'red' }}>*</b>
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      sx={userStyle.input}
                      value={attendanceStatus.clockoutstatus}
                    />
                  </FormControl>
                </Grid>
              ) : (
                <Grid item md={3} xs={12} sm={12}>
                  <Typography>
                    Clock Out Status<b style={{ color: 'red' }}>*</b>
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <Selects
                      styles={colourStyles}
                      options={leavetypeDataOut}
                      value={{ label: attendanceStatus.clockoutstatus, value: attendanceStatus.clockoutstatus }}
                      onChange={(e) => {
                        setAttendanceStatus({
                          ...attendanceStatus,
                          clockoutstatus: e.value,
                          clockoutcount: '',
                          clockoutcountstart: '',
                          clockoutcountend: '',
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
              )}

              {attendanceStatus.clockoutstatus === 'Early - ClockOut' && (
                <>
                  <Grid item md={3} xs={12} sm={12}>
                    <Typography>Clock Out Status Start Count</Typography>
                    <FormControl size="small" fullWidth>
                      <OutlinedInput
                        id="component-outlined"
                        type="number"
                        sx={userStyle.input}
                        placeholder="Please Enter Count"
                        value={attendanceStatus.clockoutcountstart}
                        onChange={(e) => {
                          handleCoutStart(e);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <Typography>Clock Out Status End Count</Typography>
                    <FormControl size="small" fullWidth>
                      <OutlinedInput
                        id="component-outlined"
                        type="number"
                        sx={userStyle.input}
                        placeholder="Please Enter Count"
                        value={attendanceStatus.clockoutcountend}
                        onChange={(e) => {
                          handleCoutEnd(e);
                        }}
                      />
                    </FormControl>
                  </Grid>
                </>
              )}
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Name<b style={{ color: 'red' }}>*</b>
                  </Typography>
                  <Selects
                    options={attModearr}
                    styles={colourStyles}
                    placeholder={'Please Select Name'}
                    value={{ label: attendanceStatus.name, value: attendanceStatus.name }}
                    onChange={(e) => {
                      setAttendanceStatus({ ...attendanceStatus, name: e.value });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item lg={1} md={2} sm={2} xs={12}>
                <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0 } })}>
                  <Button sx={buttonStyles.buttonsubmit} variant="contained" onClick={handleSubmit} disabled={isBtn}>
                    SAVE
                  </Button>
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
        </>
      )}{' '}
      <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes('lattendancestatusmaster') && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>Attendance Status Master List</Typography>
            </Grid>
            <Grid container spacing={2} style={userStyle.dataTablestyle}>
              <Grid item md={2} xs={12} sm={12}>
                <Box>
                  <label>Show entries:</label>
                  <Select
                    id="pageSizeSelect"
                    value={pageSizeAttStatus}
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
              <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Box>
                  {isUserRoleCompare?.includes('excelattendancestatusmaster') && (
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
                  {isUserRoleCompare?.includes('csvattendancestatusmaster') && (
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
                  {isUserRoleCompare?.includes('printattendancestatusmaster') && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes('pdfattendancestatusmaster') && (
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
                  {isUserRoleCompare?.includes('imageattendancestatusmaster') && (
                    <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                      {' '}
                      <ImageIcon sx={{ fontSize: '15px' }} /> &ensp;Image&ensp;{' '}
                    </Button>
                  )}
                </Box>
              </Grid>
              <Grid item md={2} xs={6} sm={6}>
                <AggregatedSearchBar
                  columnDataTable={columnDataTableAttStatus}
                  setItems={setItems}
                  addSerialNumber={addSerialNumber}
                  setPage={setPageAttStatus}
                  maindatas={sources}
                  setSearchedString={setSearchedString}
                  searchQuery={searchQueryAttStatus}
                  setSearchQuery={setSearchQueryAttStatus}
                  paginated={false}
                  totalDatas={sources}
                />
              </Grid>
            </Grid>{' '}
            <br />
            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
              {' '}
              Show All Columns{' '}
            </Button>
            &ensp;
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsAttStatus}>
              {' '}
              Manage Columns{' '}
            </Button>
            &ensp;
            {isUserRoleCompare?.includes('bdattendancestatusmaster') && (
              <Button variant="contained" sx={buttonStyles.buttonbulkdelete} onClick={handleClickOpenalert}>
                Bulk Delete
              </Button>
            )}
            <br />
            <br />
            {!sourceCheck ? (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                </Box>
              </>
            ) : (
              <>
                <Box sx={{ width: '100%' }} className={'ag-theme-quartz'} ref={gridRefImageAttStatus}>
                  <AggridTable
                    rowDataTable={rowDataTable}
                    columnDataTable={columnDataTableAttStatus}
                    columnVisibility={columnVisibilityAttStatus}
                    page={pageAttStatus}
                    setPage={setPageAttStatus}
                    pageSize={pageSizeAttStatus}
                    totalPages={totalPagesAttStatus}
                    setColumnVisibility={setColumnVisibilityAttStatus}
                    isHandleChange={isHandleChange}
                    items={items}
                    selectedRows={selectedRows}
                    setSelectedRows={setSelectedRows}
                    gridRefTable={gridRefTableAttStatus}
                    gridRefTableImg={gridRefImageAttStatus}
                    paginated={false}
                    filteredDatas={filteredDatas}
                    // totalDatas={totalDatas}
                    searchQuery={searchedString}
                    handleShowAllColumns={handleShowAllColumns}
                    setFilteredRowData={setFilteredRowData}
                    filteredRowData={filteredRowData}
                    setFilteredChanges={setFilteredChanges}
                    filteredChanges={filteredChanges}
                    itemsList={sources}
                  />
                </Box>
              </>
            )}
          </Box>
        </>
      )}
      {/* Manage Column */}
      <Popover id={idAttStatus} open={isManageColumnsOpenAttStatus} anchorEl={anchorElAttStatus} onClose={handleCloseManageColumnsAttStatus} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
        <ManageColumnsContent
          handleClose={handleCloseManageColumnsAttStatus}
          searchQuery={searchQueryManageAttStatus}
          setSearchQuery={setSearchQueryManageAttStatus}
          filteredColumns={filteredColumns}
          columnVisibility={columnVisibilityAttStatus}
          toggleColumnVisibility={toggleColumnVisibility}
          setColumnVisibility={setColumnVisibilityAttStatus}
          initialColumnVisibility={initialColumnVisibility}
          columnDataTable={columnDataTableAttStatus}
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
        itemsTwo={sources ?? []}
        filename={'Attendance Status Master'}
        exportColumnNames={exportColumnNamescrt}
        exportRowValues={exportRowValuescrt}
        componentRef={componentRef}
      />
      <InfoPopup openInfo={openInfo} handleCloseinfo={handleCloseinfo} heading="Attendance Status Master Info" addedby={addedby} updateby={updateby} />
      <DeleteConfirmation open={isDeleteOpen} onClose={handleCloseMod} onConfirm={delSource} title="Are you sure?" confirmButtonText="Yes" cancelButtonText="Cancel" />
      <DeleteConfirmation open={isDeleteOpencheckbox} onClose={handleCloseModcheckbox} onConfirm={delSourcecheckbox} title="Are you sure?" confirmButtonText="Yes" cancelButtonText="Cancel" />
      <PleaseSelectRow open={isDeleteOpenalert} onClose={handleCloseModalert} message="Please Select any Row" iconColor="orange" buttonText="OK" />
      {/* view model */}
      <Dialog open={openview} onClose={handleClickOpenview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md">
        <Box sx={{ width: '450px', padding: '20px 50px' }}>
          <>
            <Typography sx={userStyle.HeaderText}>Attendance Status Master View</Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Clock In Status</Typography>
                  <Typography>{attendanceEdit.clockinstatus}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Clock Out Status</Typography>
                  <Typography>{attendanceEdit.clockoutstatus}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Name</Typography>
                  <Typography>{attendanceEdit.name}</Typography>
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Button variant="contained" sx={buttonStyles.btncancel} onClick={handleCloseview}>
                {' '}
                Back{' '}
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>
    </Box>
  );
}

export default Attedancestatusmaster;
