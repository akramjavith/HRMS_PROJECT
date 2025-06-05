import React, { useState, useEffect, useRef, useContext } from 'react';
import { Box, Typography, OutlinedInput, Select, MenuItem, FormControl, Grid, Divider, Button, Popover, Checkbox, IconButton, TextField, DialogContent, List, ListItem, ListItemText, Switch, DialogActions, Dialog } from '@mui/material';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { userStyle } from '../../../pageStyle';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { handleApiError } from '../../../components/Errorhandling';
import { FaDownload, FaTrash, FaFilePdf, FaFileExcel, FaFileCsv, FaPrint } from 'react-icons/fa';
import { MultiSelect } from 'react-multi-select-component';
import axios from '../../../axiosInstance';
import { SERVICE } from '../../../services/Baseservice';
import LoadingButton from '@mui/lab/LoadingButton';
import { CsvBuilder } from 'filefy';
import { UserRoleAccessContext, AuthContext } from '../../../context/Appcontext';
import Headtitle from '../../../components/Headtitle';
import Selects from 'react-select';
import SendToServer from '../../sendtoserver';
import * as XLSX from 'xlsx';
import AlertDialog from '../../../components/Alert';
import MessageAlert from '../../../components/MessageAlert';
import PageHeading from '../../../components/PageHeading';
import AggregatedSearchBar from '../../../components/AggregatedSearchBar';
import AggridTable from '../../../components/AggridTable';
import domtoimage from 'dom-to-image';
import { saveAs } from 'file-saver';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ImageIcon from '@mui/icons-material/Image';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { useReactToPrint } from 'react-to-print';
import { ThreeDots } from 'react-loader-spinner';
import InfoPopup from '../../../components/InfoPopup.js';
import { DeleteConfirmation, PleaseSelectRow } from '../../../components/DeleteConfirmation.js';
import ExportData from '../../../components/ExportData.js';

function PaidStatusFix() {
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);

  const [isHandleChange, setIsHandleChange] = useState(false);
  const [searchedString, setSearchedString] = useState('');

  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState('');
  const [popupSeverityMalert, setPopupSeverityMalert] = useState('');
  const handleClickOpenPopupMalert = () => {
    setOpenPopupMalert(true);
  };
  const handleClosePopupMalert = () => {
    setOpenPopupMalert(false);
  };
  const [updateSheet, setUpdatesheet] = useState([]);
  const [valueCate, setValueCate] = useState('');
  const [openPopup, setOpenPopup] = useState(false);
  const [popupContent, setPopupContent] = useState('');
  const [popupSeverity, setPopupSeverity] = useState('');
  const handleClickOpenPopup = () => {
    setOpenPopup(true);
  };
  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  let exportColumnNames = ['Department', 'Frequency', 'Absent Mode', 'From Value', 'To Value', 'Achieved mode', 'From Point', 'To Point', 'Current Absent Mode', 'Current Absend Value', 'Current Achieved Modes', 'Current Achieved Value', 'Paid Status'];
  let exportRowValues = ['department', 'frequency', 'absentmodes', 'fromvalue', 'tovalue', 'achievedmodes', 'frompoint', 'topoint', 'currentabsentmodes', 'currentabsentvalue', 'currentachievedmodes', 'currentachievedvalue', 'paidstatus'];

  const [fileFormat, setFormat] = useState('');
  // const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
  // // page refersh reload
  // const handleCloseFilterMod = () => {
  //   setIsFilterOpen(false);
  // };
  // const handleClosePdfFilterMod = () => {
  //   setIsPdfFilterOpen(false);
  // };

  const [exportLoading, setExportLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
    // setloadingdeloverall(false);
    setExportLoading(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
    setExportLoading(false);
  };

  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Paid Status Fix Month Set',
    pageStyle: 'print',
  });

  //get current month
  let month = new Date().getMonth() + 1;
  let year = new Date().getFullYear();
  const ans = new Date().getMonth();
  //get current year
  const currentYear = new Date().getFullYear();
  const years = Array.from(new Array(10), (val, index) => currentYear - index);
  const getyear = years.map((year) => {
    return { value: year, label: year };
  });

  //get all months
  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];
  const check = months.find((item) => item.value === ans + 1);
  const [paidstatusfix, setPaidstatusfix] = useState({
    department: 'Please Select Department',
    month: check.label,
    year: year,
    frequency: '',
    absentmodes: 'Between',
    fromvalue: '',
    tovalue: '',
    achievedmodes: 'Between',
    frompoint: '',
    topoint: '',
    currentabsentmodes: 'Less Than or Equal',
    currentabsentvalue: '',
    currentachievedmodes: 'Less Than or Equal',
    currentachievedvalue: '',
    paidstatus: '',
  });

  const [paidstatusfixs, setPaidstatusfixs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);
  const [absentmodes, setAbsentmodes] = useState('Between');
  const [achievedmodes, setAchievedmodes] = useState('Between');
  const [currentabsentmodes, setCurrentabsentmodes] = useState('Less Than or Equal');
  const [currentachievedmodes, setCurrentachievedmodes] = useState('Less Than or Equal');
  const [isXeroxLoad, setIsXeroxLoad] = useState(false);

  // excelupload
  const [fileUploadName, setFileUploadName] = useState('');
  const [sheets, setSheets] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState('Please Select Sheet');
  const [splitArray, setSplitArray] = useState([]);
  const [selectedSheetindex, setSelectedSheetindex] = useState();
  const [loading, setLoading] = useState(false);
  const [dataupdated, setDataupdated] = useState('');
  //  Datefield
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  today = dd + '-' + mm + '-' + yyyy;
  let currentdate = new Date();
  let currentyear = currentdate.getFullYear();
  // get current month in string name
  const monthstring = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  let monthname = monthstring[new Date().getMonth()];
  const ExportsHead = () => {
    const columns = ['Department', 'Frequency', 'Absent Mode', 'Absent From Value', 'Absent To Value', 'Achieved Mode', 'Achieved From Value', 'Achieved To Value', 'Current Absent Mode', 'Current Absent Value', 'Current Achieved Mode', 'Current Achieved Value', 'Paid Status'];
    const capitalizedColumns = columns.map((column) => {
      // Capitalize the first letter of each word in the column name
      const words = column.split(' ');
      const capitalizedWords = words.map((word) => word.charAt(0)?.toUpperCase() + word.slice(1)?.toLowerCase());
      return capitalizedWords.join(' ');
    });
    const dataRow = ['', '', 'Between', '', '', 'Between', '', '', 'Less Than or Equal', '', 'Less Than or Equal', '', ''];
    if (selectedOptionsCate.length == 0) {
      let alertMsg = 'Please Select Department';
      setPopupContentMalert(alertMsg);
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else {
      new CsvBuilder(`Filename_ ${today}`).setColumns(capitalizedColumns).addRow(dataRow).exportFile();
    }
  };
  const readExcel = (file) => {
    if (selectedOptionsCate.length === 0) {
      setPopupContentMalert('Please Select Department');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
      return;
    }
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = (e) => {
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray, { type: 'buffer' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        // Check for missing required fields
        const invalidEntries = data.filter((item) => !item.Frequency || !item['Paid Status']);
        if (invalidEntries.length > 0) {
          setPopupContentMalert('Frequency and Paid Status Must be Required');
          setPopupSeverityMalert('info');
          handleClickOpenPopupMalert();
          return;
        }
        // Check for incorrect format in Paid Status
        const incorrectFormatEntries = data.filter((item) => item['Paid Status'] && !item['Paid Status'].includes('_'));
        if (incorrectFormatEntries.length > 0) {
          setPopupContentMalert('Please Enter Paid Status Format Correctly');
          setPopupSeverityMalert('info');
          handleClickOpenPopupMalert();
          return;
        }
        // Remove duplicates within the Excel file itself
        const uniqueData = data.reduce((acc, current) => {
          const isDuplicate = acc.some(
            (item) =>
              item.Frequency === current.Frequency &&
              item['Paid Status'] === current['Paid Status'] &&
              item['Absent Mode'] === current['Absent Mode'] &&
              item['Absent From Value'] === current['Absent From Value'] &&
              item['Absent To Value'] === current['Absent To Value'] &&
              item['Achieved Mode'] === current['Achieved Mode'] &&
              item['Achieved From Value'] === current['Achieved From Value'] &&
              item['Achieved To Value'] === current['Achieved To Value'] &&
              item['Current Absent Mode'] === current['Current Absent Mode'] &&
              item['Current Absent Value'] === current['Current Absent Value'] &&
              item['Current Achieved Mode'] === current['Current Achieved Mode'] &&
              item['Current Achieved Value'] === current['Current Achieved Value']
          );
          if (!isDuplicate) {
            acc.push(current);
          }
          return acc;
        }, []);
        resolve(uniqueData);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
    promise.then((data) => {
      // Check for duplicates against existing data
      const uniqueArray = data.filter(
        (item) =>
          !paidstatusfixsDup.some(
            (tp) =>
              tp.department.some((dep) => valueCate.includes(dep)) &&
              tp.frequency === item.Frequency &&
              tp.absentmodes === item['Absent Mode'] &&
              tp.fromvalue === String(item['Absent From Value']) &&
              tp.tovalue === String(item['Absent To Value']) &&
              tp.achievedmodes === item['Achieved Mode'] &&
              tp.frompoint === String(item['Achieved From Value']) &&
              tp.topoint === String(item['Achieved To Value']) &&
              tp.currentabsentmodes === item['Current Absent Mode'] &&
              tp.currentabsentvalue === String(item['Current Absent Value']) &&
              tp.currentachievedmodes === item['Current Achieved Mode'] &&
              tp.currentachievedvalue === String(item['Current Achieved Value']) &&
              tp.paidstatus === item['Paid Status']
          )
      );
      console.log(uniqueArray);
      if (uniqueArray.length === 0) {
        setPopupContentMalert('Already Added The Upload Data');
        setPopupSeverityMalert('info');
        handleClickOpenPopupMalert();
        return;
      } else if (uniqueArray.length !== data.length) {
        setPopupContentMalert('Duplicate & Not a Number Value Removed');
        setPopupSeverityMalert('info');
        handleClickOpenPopupMalert();
      }
      const dataArray = uniqueArray.map((item) => ({
        department: valueCate,
        month: item.Month,
        year: item.Year,
        frequency: item.Frequency,
        absentmodes: item['Absent Mode'],
        fromvalue: item['Absent From Value'],
        tovalue: item['Absent To Value'],
        achievedmodes: item['Achieved Mode'],
        frompoint: item['Achieved From Value'],
        topoint: item['Achieved To Value'],
        currentabsentmodes: item['Current Absent Mode'],
        currentabsentvalue: item['Current Absent Value'],
        currentachievedmodes: item['Current Achieved Mode'],
        currentachievedvalue: item['Current Achieved Value'],
        paidstatus: item['Paid Status'],
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      }));
      setUpdatesheet([]);
      // Split data into chunks of 1000 entries
      const subarraySize = 1000;
      const splitedArray = [];
      for (let i = 0; i < dataArray.length; i += subarraySize) {
        const subarray = dataArray.slice(i, i + subarraySize);
        splitedArray.push(subarray);
      }
      setSplitArray(splitedArray);
    });
  };
  const clearFileSelection = () => {
    setUpdatesheet([]);
    setFileUploadName('');
    setSplitArray([]);
    readExcel(null);
    setDataupdated('');
    setSheets([]);
    setSelectedSheet('Please Select Sheet');
  };
  const [departments, setDepartments] = useState([]);
  // Multi Select Create
  const [selectedOptionsCate, setSelectedOptionsCate] = useState([]);
  const handleCategoryChange = (options) => {
    setValueCate(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCate(options);
    setFileUploadName('');
    setSplitArray([]);
    setDataupdated('');
    setSheets([]);
    setSelectedSheet('Please Select Sheet');
  };
  const customValueRendererCate = (valueCate, _department) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(', ') : 'Please Select Department';
  };

  //get all Areas.
  const fetchDepartmentDropdown = async () => {
    setPageName(!pageName);
    try {
      let res_dept = await axios.get(SERVICE.DEPARTMENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const deptall = [
        ...res_dept?.data?.departmentdetails.map((d) => ({
          ...d,
          label: d.deptname,
          value: d.deptname,
        })),
      ];
      setDepartments(deptall);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsXeroxLoad(false);
    setIsErrorOpen(true);
  };
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ''; // This is required for Chrome support
  };

  const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);
  const handleClickOpencheckbox = () => {
    setIsDeleteOpencheckbox(true);
  };
  const handleCloseModcheckbox = () => {
    setIsDeleteOpencheckbox(false);
  };

  const delPaidstatuscheckbox = async () => {
    setPageName(!pageName);
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.PAIDSTATUSFIXMONTHSET_SINGLE}/${item}`, {
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
      setPage(1);
      // await fetchEmployee();
      // await fetchPaidStatusfixDup();
      await fetchPenaltyErrorUpload();
      // await sendRequestFilter('filtered');
      setPopupContent('Deleted Successfully');
      setPopupSeverity('success');
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
  const handleClickOpenalert = () => {
    setIsHandleChange(true);
    if (selectedRows?.length === 0) {
      setIsDeleteOpenalert(true);
    } else {
      setIsDeleteOpencheckbox(true);
    }
  };
  const handleCloseModalert = () => {
    setIsDeleteOpenalert(false);
  };
  const gridRef = useRef(null);
  const [sourceCheck, setSourcecheck] = useState(false);

  const getSheetExcel = () => {
    if (!Array.isArray(splitArray) || (splitArray.length === 0 && fileUploadName === '')) {
      setPopupContentMalert('Please Upload a file');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else {
      let getsheets = splitArray.map((d, index) => ({
        label: 'Sheet' + (index + 1),
        value: 'Sheet' + (index + 1),
        index: index,
      }));
      setSheets(getsheets);
    }
  };
  const sendJSON = async () => {
    let uploadExceldata = splitArray[selectedSheetindex];
    let uniqueArray = uploadExceldata.filter(
      (item) =>
        !paidstatusfixs.some(
          (tp) =>
            tp.department.some((item) => valueCate.map((item) => item).includes(item)) &&
            tp.frequency == item.frequency &&
            tp.absentmodes == item.absentmodes &&
            // tp.fromvalue == item.fromvalue &&
            // tp.tovalue == item.tovalue &&
            tp.achievedmodes == item.achievedmodes &&
            // tp.frompoint == item.frompoint &&
            // tp.topoint == item.topoint &&
            tp.currentabsentmodes == item.currentabsentmodes &&
            tp.currentabsentvalue == item.currentabsentvalue &&
            tp.currentachievedmodes == item.currentachievedmodes &&
            tp.currentachievedvalue == item.currentachievedvalue &&
            tp.paidstatus == item.paidstatus
        )
    );
    // Ensure that items is an array of objects before sending
    if (fileUploadName === '' || !Array.isArray(uniqueArray) || uniqueArray.length === 0 || selectedSheet === 'Please Select Sheet') {
      setPopupContentMalert(fileUploadName === '' ? 'Please Upload File' : selectedSheet === 'Please Select Sheet' ? 'Please Select Sheet' : 'No data to upload');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (selectedOptionsCate.length == 0) {
      setPopupContentMalert('Please Select Department');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else {
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
        }
      };
      setPageName(!pageName);
      try {
        setLoading(true); // Set loading to true when starting the upload
        xmlhttp.open('POST', SERVICE.PAIDSTATUSFIXMONTHSET_CREATE);
        xmlhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xmlhttp.send(JSON.stringify(uniqueArray));
        setSelectedSheet('Please Select Sheet');
        await fetchEmployee();
        await fetchPaidStatusfixDup();
      } catch (err) {
      } finally {
        setLoading(false); // Set loading back to false when the upload is complete
        setPopupContent('Updated Successfully');
        setPopupSeverity('success');
        handleClickOpenPopup();
        setSelectedSheet('Please Select Sheet');
        setUpdatesheet((prev) => [...prev, selectedSheetindex]);
        await fetchEmployee();
        await fetchPaidStatusfixDup();
      }
    }
  };
  //add function
  const sendRequest = async () => {
    setIsXeroxLoad(true);
    setPageName(!pageName);
    try {
      let subprojectscreate = await axios.post(SERVICE.PAIDSTATUSFIXMONTHSET_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        department: [...valueCate],
        frequency: String(paidstatusfix.frequency),
        absentmodes: String(absentmodes),
        fromvalue: String(paidstatusfix.fromvalue),
        tovalue: String(paidstatusfix.tovalue),
        achievedmodes: String(achievedmodes),
        frompoint: String(paidstatusfix.frompoint),
        topoint: String(paidstatusfix.topoint),
        currentabsentmodes: String(currentabsentmodes),
        currentabsentvalue: String(paidstatusfix.currentabsentvalue),
        currentachievedmodes: String(currentachievedmodes),
        currentachievedvalue: String(paidstatusfix.currentachievedvalue),
        paidstatus: String(paidstatusfix.paidstatus),
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await fetchEmployee();
      await fetchPaidStatusfixDup();
      await fetchPenaltyErrorUpload();
      setPaidstatusfix({
        ...paidstatusfix,
        department: 'Please Select Department',
        month: check.label,
        year: year,
        frequency: '',
        absentmodes: 'Between',
        fromvalue: '',
        tovalue: '',
        achievedmodes: 'Between',
        frompoint: '',
        topoint: '',
        currentabsentmodes: 'Less Than or Equal',
        currentabsentvalue: '',
        currentachievedmodes: 'Less Than or Equal',
        currentachievedvalue: '',
        paidstatus: '',
      });
      setPopupContent('Added Successfully');
      setPopupSeverity('success');
      handleClickOpenPopup();
      setIsXeroxLoad(false);
    } catch (err) {
      setIsXeroxLoad(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const [paidstatusfixsDup, setPaidstatusfixsDup] = useState([]);
  let departmen = selectedOptionsCate.map((item) => item.value);
  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();
    let departments = selectedOptionsCate.map((item) => item.value);
    const isNameMatch = paidstatusfixsDup.some(
      (item) =>
        item.frequency?.toLowerCase() === paidstatusfix.frequency?.toLowerCase() &&
        item.absentmodes?.toLowerCase() === absentmodes?.toLowerCase() &&
        item.achievedmodes?.toLowerCase() === achievedmodes?.toLowerCase() &&
        item.currentabsentmodes?.toLowerCase() === currentabsentmodes?.toLowerCase() &&
        item.currentachievedmodes?.toLowerCase() === currentachievedmodes?.toLowerCase() &&
        item.paidstatus?.toLowerCase() === paidstatusfix.paidstatus?.toLowerCase() &&
        item.department.some((data) => departments.includes(data))
    );
    if (selectedOptionsCate.length == 0) {
      setPopupContentMalert('Please Select Department');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (fileUploadName != '' && selectedSheet === 'Please Select Sheet') {
      setPopupContentMalert('Please Select Sheet');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (paidstatusfix.frequency === '') {
      setPopupContentMalert('Please Enter Frequency');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (paidstatusfix.paidstatus === '') {
      setPopupContentMalert('Please Enter Paid Status');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (!paidstatusfix.paidstatus.includes('_')) {
      setPopupContentMalert('Please Enter Paid Status Format Correctly');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert('Data already exists!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else {
      sendRequest();
    }
  };
  const handleClear = (e) => {
    e.preventDefault();
    setPaidstatusfix({
      department: 'Please Select Department',
      month: check.label,
      year: year,
      frequency: '',
      absentmodes: 'Between',
      fromvalue: '',
      tovalue: '',
      achievedmodes: 'Between',
      frompoint: '',
      topoint: '',
      currentabsentmodes: 'Less Than or Equal',
      currentabsentvalue: '',
      currentachievedmodes: 'Less Than or Equal',
      currentachievedvalue: '',
      paidstatus: '',
    });
    setSelectedOptionsCate([]);
    setAchievedmodes('Between');
    setAbsentmodes('Between');
    setCurrentabsentmodes('Less Than or Equal');
    setCurrentachievedmodes('Less Than or Equal');
    setSelectedSheet('Please Select Sheet');
    setSheets([]);
    setSplitArray([]);
    setSelectedSheetindex('');
    setFileUploadName('');
    readExcel(null);
    setPopupContent('Cleared Successfully');
    setPopupSeverity('success');
    handleClickOpenPopup();
  };
  //get all Sub vendormasters.
  const fetchPaidStatusfixDup = async () => {
    setPageName(!pageName);
    try {
      let res_vendor = await axios.get(SERVICE.PAIDSTATUSFIXMONTHSET, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setPaidstatusfixsDup(res_vendor?.data?.paidstatusfixs);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const [paidstatusfixsFilterArray, setPaidstatusfixsFilterArray] = useState([]);
  const fetchPaidStatusfixArray = async () => {
    setPageName(!pageName);
    try {
      let res_vendor = await axios.get(SERVICE.PAIDSTATUSFIXMONTHSET, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setPaidstatusfixsFilterArray(res_vendor?.data?.paidstatusfixs);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  useEffect(() => {
    fetchPaidStatusfixArray();
  }, [isFilterOpen]);
  const [overallFilterdata, setOverallFilterdata] = useState([]);
  const [totalProjects, setTotalProjects] = useState(0);
  const fetchEmployee = async () => {
    setPageName(!pageName);
    try {
      let res_employee = await axios.post(SERVICE.PAIDSTATUSFIX_SORT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        page: Number(page),
        pageSize: Number(pageSize),
        searchQuery: searchQuery,
      });
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    fetchDepartmentDropdown();
  }, []);
  useEffect(() => {
    fetchEmployee();
    fetchPaidStatusfixDup();
  }, []);
  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener('beforeunload', beforeUnloadHandler);
    return () => {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
    };
  }, []);

  const [penaltyErrorUpload, setPenaltyErrorUpload] = useState([]);
  const [overallItems, setOverallItems] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState('');
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const fetchPenaltyErrorUpload = async () => {
    setPageName(!pageName);
    setSourcecheck(false);

    try {
      let res = await axios.get(SERVICE.PAIDSTATUSFIXMONTHSET_LIMITED, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSourcecheck(true);
      console.log(res?.data?.paidstatusfixs);
      setPenaltyErrorUpload(res?.data?.paidstatusfixs.map((item, index) => ({ ...item, serialNumber: index + 1 })));
    } catch (err) {
      setSourcecheck(true);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const [paidstatusfixEdit, setPaidstatusfixEdit] = useState({
    department: 'Please Select Department',
    month: '',
    year: '',
    frequency: '',
    absentmodes: 'Between',
    fromvalue: '',
    tovalue: '',
    achievedmodes: 'Between',
    frompoint: '',
    topoint: '',
    currentabsentmodes: 'Less Than or Equal',
    currentabsentvalue: '',
    currentachievedmodes: 'Less Than or Equal',
    currentachievedvalue: '',
    paidstatus: '',
  });

  const [selectedOptionsCateEdit, setSelectedOptionsCateEdit] = useState([]);
  const [absentmodesEdit, setAbsentmodesEdit] = useState('Between');
  const [currentabsentmodesEdit, setCurrentabsentmodesEdit] = useState('Less Than or Equal');
  const [currentachievedmodesEdit, setCurrentachievedmodesEdit] = useState('Less Than or Equal');
  const [ovProj, setOvProj] = useState('');
  const [ovProjj, setOvProjj] = useState('');
  const [achievedmodesEdit, setAchievedmodesEdit] = useState('Between');

  //Edit model...
  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === 'backdropClick') return;
    setIsEditOpen(false);
  };
  // info model
  const [openInfo, setOpeninfo] = useState(false);
  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };
  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  // view model
  const [openview, setOpenview] = useState(false);
  const handleClickOpenview = () => {
    setOpenview(true);
  };
  const handleCloseview = () => {
    setOpenview(false);
  };

  //Project updateby edit page...
  let updateby = paidstatusfixEdit?.updatedby;
  let addedby = paidstatusfixEdit?.addedby;
  let subprojectsid = paidstatusfixEdit?._id;

  const sendEditRequest = async () => {
    let empCate = selectedOptionsCateEdit.map((item) => item.value);
    setPageName(!pageName);
    try {
      let res = await axios.put(
        `${SERVICE.PAIDSTATUSFIXMONTHSET_SINGLE}/${subprojectsid}`,
        {
          department: [...empCate],
          frequency: String(paidstatusfixEdit.frequency),
          absentmodes: String(absentmodesEdit),
          fromvalue: String(paidstatusfixEdit.fromvalue === undefined ? '' : paidstatusfixEdit.fromvalue),
          tovalue: String(paidstatusfixEdit.tovalue === undefined ? '' : paidstatusfixEdit.tovalue),
          achievedmodes: String(achievedmodesEdit),
          frompoint: String(paidstatusfixEdit.frompoint === undefined ? '' : paidstatusfixEdit.frompoint),
          topoint: String(paidstatusfixEdit.topoint === undefined ? '' : paidstatusfixEdit.topoint),
          currentabsentmodes: String(currentabsentmodesEdit),
          currentabsentvalue: String(paidstatusfixEdit.currentabsentvalue === undefined ? '' : paidstatusfixEdit.currentabsentvalue),
          currentachievedmodes: String(currentachievedmodesEdit),
          currentachievedvalue: String(paidstatusfixEdit.currentachievedvalue === undefined ? '' : paidstatusfixEdit.currentachievedvalue),
          paidstatus: String(paidstatusfixEdit.paidstatus),
          updatedby: [
            ...updateby,
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      // await sendRequestFilter("filtered");;
      // await fetchPaidStatusfixDup();
      await fetchPenaltyErrorUpload();

      handleCloseModEdit();
      setPopupContent('Updated Successfully');
      setPopupSeverity('success');
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  const [allPaidstatusfixedit, setAllPaidstatusfixedit] = useState([]);
  const editSubmit = (e) => {
    e.preventDefault();
    // fetch();
    let departmentsEditt = selectedOptionsCateEdit.map((item) => item.value);
    const isNameMatch = allPaidstatusfixedit.some(
      (item) =>
        item.frequency?.toLowerCase() === paidstatusfixEdit.frequency?.toLowerCase() &&
        item.absentmodes === absentmodesEdit &&
        item.achievedmodes === achievedmodesEdit &&
        item.currentabsentmodes === currentabsentmodesEdit &&
        item.paidstatus.toLowerCase() === paidstatusfixEdit.paidstatus.toLowerCase() &&
        item.department.some((data) => departmentsEditt.includes(data))
    );
    if (selectedOptionsCateEdit.length == 0) {
      setPopupContentMalert('Please Select Department');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (paidstatusfixEdit.frequency === '') {
      setPopupContentMalert('Please Enter Frequency');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (paidstatusfixEdit.paidstatus === '') {
      setPopupContentMalert('Please Enter Paid Status');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (!paidstatusfixEdit.paidstatus.includes('_')) {
      setPopupContentMalert('Please Enter Paid Status Format Correctly');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert('Data already exits!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else {
      sendEditRequest();
    }
  };

  const [deletePaidstatus, setDeletePaidstatus] = useState('');
  //Delete model
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
  };

  // Alert delete popup
  let Paidstatussid = deletePaidstatus?._id;
  const delPaidstatus = async (e) => {
    setPageName(!pageName);
    try {
      await axios.delete(`${SERVICE.PAIDSTATUSFIXMONTHSET_SINGLE}/${Paidstatussid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      // await fetchEmployee();
      // await fetchPaidStatusfixDup();
      await fetchPenaltyErrorUpload();
      // await sendRequestFilter('filtered');
      handleCloseMod();
      setSelectedRows([]);
      setPage(1);
      setPopupContent('Deleted Successfully');
      setPopupSeverity('success');
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const rowData = async (id, paidstatus) => {
    setPageName(!pageName);
    try {
      const [res] = await Promise.all([
        axios.get(`${SERVICE.PAIDSTATUSFIXMONTHSET_SINGLE}/${id}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
      ]);
      setDeletePaidstatus(res?.data?.spaidstatusfix);

      handleClickOpen();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const getCode = async (e, name) => {
    setPageName(!pageName);
    try {
      const [res, resNew] = await Promise.all([
        await axios.get(`${SERVICE.PAIDSTATUSFIXMONTHSET_SINGLE}/${e}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
        axios.get(SERVICE.PAIDSTATUSFIXMONTHSET, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
      ]);
      setAllPaidstatusfixedit(resNew?.data?.paidstatusfixs?.filter((item) => item?._id !== e));
      setPaidstatusfixEdit(res?.data?.spaidstatusfix);
      setSelectedOptionsCateEdit(
        res?.data?.spaidstatusfix.department.map((item) => ({
          ...item,
          label: item,
          value: item,
        }))
      );
      setAbsentmodesEdit(res?.data?.spaidstatusfix.absentmodes);
      setAchievedmodesEdit(res?.data?.spaidstatusfix.achievedmodes);
      setCurrentabsentmodesEdit(res?.data?.spaidstatusfix.currentabsentmodes);
      setCurrentachievedmodesEdit(res?.data?.spaidstatusfix.currentachievedmodes);
      setOvProj(res?.data?.spaidstatusfix?.paidstatus);
      setOvProjj(res?.data?.spaidstatusfix?.department);
      handleClickOpenEdit();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  // get single row to view....
  const getviewCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.PAIDSTATUSFIXMONTHSET_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setPaidstatusfixEdit(res?.data?.spaidstatusfix);
      handleClickOpenview();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.PAIDSTATUSFIXMONTHSET_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setPaidstatusfixEdit(res?.data?.spaidstatusfix);
      handleClickOpeninfo();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    fetchPenaltyErrorUpload();
  }, []);
  const addSerialNumber = (datas) => {
    setItems(datas);
    setOverallItems(datas);
  };
  useEffect(() => {
    addSerialNumber(penaltyErrorUpload);
  }, [penaltyErrorUpload]);
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

  const gridRefTableImg = useRef(null);
  // image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage
        .toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, 'Paid Status Fix Month Set.png');
        })
        .catch((error) => {
          console.error('dom-to-image error: ', error);
        });
    }
  };

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,

    department: true,
    frequency: true,
    absentmodes: true,
    fromvalue: true,
    tovalue: true,
    achievedmodes: true,
    frompoint: true,
    topoint: true,
    currentabsentmodes: true,
    currentabsentvalue: true,
    currentachievedmodes: true,
    currentachievedvalue: true,
    paidstatus: true,

    actions: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

  const searchTerms = searchQuery.toLowerCase().split(' ');
  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchTerms.every((term) => Object.values(item).join(' ').toLowerCase().includes(term));
  });
  const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);
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
      headerCheckboxSelection: true,
      checkboxSelection: true,
      pinned: 'left',
      lockPinned: true,
      sortable: false, // Optionally, you can make this column not sortable
      width: 90,
      hide: !columnVisibility.checkbox,
      headerClassName: 'bold-header',
    },
    {
      field: 'serialNumber',
      headerName: 'SNo',
      flex: 0,
      width: 100,
      hide: !columnVisibility.serialNumber,
      headerClassName: 'bold-header',
      pinned: 'left',
    },
    { field: 'department', headerName: 'Department', flex: 0, width: 150, hide: !columnVisibility.department, headerClassName: 'bold-header', pinned: 'left' },
    { field: 'frequency', headerName: 'Frequency', flex: 0, width: 100, hide: !columnVisibility.frequency, headerClassName: 'bold-header', pinned: 'left' },
    { field: 'absentmodes', headerName: 'Absent Modes', flex: 0, width: 150, hide: !columnVisibility.absentmodes, headerClassName: 'bold-header' },
    { field: 'fromvalue', headerName: 'From Value', flex: 0, width: 150, hide: !columnVisibility.fromvalue, headerClassName: 'bold-header' },
    { field: 'tovalue', headerName: 'To Value', flex: 0, width: 150, hide: !columnVisibility.tovalue, headerClassName: 'bold-header' },
    { field: 'achievedmodes', headerName: 'Achieved Modes', flex: 0, width: 100, hide: !columnVisibility.achievedmodes, headerClassName: 'bold-header' },
    { field: 'frompoint', headerName: 'From Point', flex: 0, width: 100, hide: !columnVisibility.frompoint, headerClassName: 'bold-header' },

    { field: 'topoint', headerName: 'To Point', flex: 0, width: 100, hide: !columnVisibility.topoint, headerClassName: 'bold-header' },
    { field: 'currentabsentmodes', headerName: 'Current Absent Modes', flex: 0, width: 200, hide: !columnVisibility.currentabsentmodes, headerClassName: 'bold-header' },
    { field: 'currentabsentvalue', headerName: 'Current Absent Value', flex: 0, width: 100, hide: !columnVisibility.currentabsentvalue, headerClassName: 'bold-header' },
    { field: 'currentachievedmodes', headerName: 'Current Archived Modes', flex: 0, width: 200, hide: !columnVisibility.currentachievedmodes, headerClassName: 'bold-header' },
    { field: 'currentachievedvalue', headerName: 'Current Archived Value', flex: 0, width: 100, hide: !columnVisibility.currentachievedvalue, headerClassName: 'bold-header' },
    { field: 'paidstatus', headerName: 'Paid Status', flex: 0, width: 200, hide: !columnVisibility.paidstatus, headerClassName: 'bold-header' },
    {
      field: 'actions',
      headerName: 'Action',
      flex: 0,
      width: 250,
      minHeight: '40px !important',
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: 'bold-header',
      cellRenderer: (params) => (
        <Grid sx={{ display: 'flex' }}>
          {isUserRoleCompare?.includes('epaidstatusfixmonthset') && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.data.id);
              }}
            >
              <EditOutlinedIcon style={{ fontsize: 'large' }} sx={buttonStyles.buttonedit} />
            </Button>
          )}
          {isUserRoleCompare?.includes('dpaidstatusfixmonthset') && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.data.id, params.data.paidstatus);
              }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontsize: 'large' }} sx={buttonStyles.buttondelete} />
            </Button>
          )}
          {isUserRoleCompare?.includes('vpaidstatusfixmonthset') && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.data.id);
              }}
            >
              <VisibilityOutlinedIcon style={{ fontsize: 'large' }} sx={buttonStyles.buttonview} />
            </Button>
          )}
          {isUserRoleCompare?.includes('ipaidstatusfixmonthset') && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getinfoCode(params.data.id);
              }}
            >
              <InfoOutlinedIcon style={{ fontsize: 'large' }} sx={buttonStyles.buttoninfo} />
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
  useEffect(() => {
    // Save column visibility to localStorage whenever it changes
    localStorage.setItem('columnVisibility', JSON.stringify(columnVisibility));
  }, [columnVisibility]);

  useEffect(() => {
    // Retrieve column visibility from localStorage (if available)
    const savedVisibility = localStorage.getItem('columnVisibility');
    if (savedVisibility) {
      setColumnVisibility(JSON.parse(savedVisibility));
    }
  }, []);

  // // Function to filter columns based on search query
  const filteredColumns = columnDataTable.filter((column) => column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase()));
  // Manage Columns functionality
  const toggleColumnVisibility = (field) => {
    setColumnVisibility((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
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

  const handleExportXL = async (isfilter) => {
    try {
      if (isfilter === 'filtered') {
        // Define headers
        let headers = ['Department', 'Frequency', 'Absent Modes', 'From Value', 'To Value', 'Achieved Modes', 'From Point', 'To Point', 'Current Absent Modes', 'Current Absent Value', 'Current Archived Modes', 'Current Archived Value', 'Paid Status'];

        // Transform data
        const excelData = rowDataTable.map((doc) => [
          doc.department ?? '',
          doc.frequency ?? '',
          doc.absentmodes ?? '',
          doc.fromvalue ?? '',
          doc.tovalue ?? '',
          doc.achievedmodes ?? '',
          doc.frompoint ?? '',
          doc.topoint ?? '',
          doc.currentabsentmodes ?? '',
          doc.currentabsentvalue ?? '',
          doc.currentachievedmodes ?? '',
          doc.currentachievedvalue ?? '',
          doc.paidstatus ?? '',
        ]);

        // Combine headers and data
        const finalData = [headers, ...excelData];

        // Create worksheet
        const ws = XLSX.utils.aoa_to_sheet(finalData);

        // Create workbook and export
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        // Save file
        XLSX.writeFile(wb, 'Paidstatusfixmonthset.xlsx');
        setIsFilterOpen(false);
      } else if (isfilter === 'overall') {
        let result = [];
        setExportLoading(true);

        let response = await axios.get(SERVICE.PAID_MONTHSET_EXCELDOWNLOAD, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },

          responseType: 'blob',
        });
        console.log(response, 'response');
        // Create a Blob from the response
        const blob = new Blob([response.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        // Create a download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Paidstatusfixmonthset.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        // Assuming response.data is the binary data for the Excel file

        setExportLoading(false);
        setIsFilterOpen(false);
      }
    } catch (err) {
      setExportLoading(false);
    }
  };

  const downloadCSV = async (isfilter) => {
    try {
      if (isfilter === 'filtered') {
        let headers = ['Department', 'Frequency', 'Absent Modes', 'From Value', 'To Value', 'Achieved Modes', 'From Point', 'To Point', 'Current Absent Modes', 'Current Absent Value', 'Current Archived Modes', 'Current Archived Value', 'Paid Status'];

        // Transform data
        const excelData = rowDataTable.map((doc) => [
          doc.department ?? '',
          doc.frequency ?? '',
          doc.absentmodes ?? '',
          doc.fromvalue ?? '',
          doc.tovalue ?? '',
          doc.achievedmodes ?? '',
          doc.frompoint ?? '',
          doc.topoint ?? '',
          doc.currentabsentmodes ?? '',
          doc.currentabsentvalue ?? '',
          doc.currentachievedmodes ?? '',
          doc.currentachievedvalue ?? '',
          doc.paidstatus ?? '',
        ]);
        // Combine headers and data
        const finalData = [headers, ...excelData];
        // Convert to CSV
        const ws = XLSX.utils.aoa_to_sheet(finalData);
        const csvOutput = XLSX.utils.sheet_to_csv(ws);

        // Trigger CSV file download in browser
        const blob = new Blob([csvOutput], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'Paidstatusfixmonthset.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setIsFilterOpen(false);
      } else if (isfilter === 'overall') {
        let result = [];
        setExportLoading(true);

        try {
          let response = await axios.get(SERVICE.PAID_MONTHSET_CSVDOWNLOAD, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            responseType: 'blob',
          });
          // Create a Blob from the response data
          const blob = new Blob([response.data], { type: 'text/csv' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');

          a.href = url;
          a.download = 'Paidstatusfixmonthset.csv'; // File name
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url); // Clean up
          setExportLoading(false);
          setIsFilterOpen(false);
        } catch (error) {
          console.error('Error downloading CSV:', error);
        }
      }
    } catch (err) {
      setExportLoading(false);
    }
  };

  const downloadPdf = async (isfilter) => {
    try {
      if (isfilter === 'filtered') {
        // try {
        //   let headers = [
        //     "Department", "Frequency", "Absent Modes", "From Value", "To Value",
        //     "Achieved Modes", "From Point", "To Point", "Current Absent Modes",
        //     "Current Absent Value", "Current Archived Modes", "Current Archived Value",
        //     "Paid Status"
        //   ];

        //   // Transform data
        //   const excelData = rowDataTable.map((doc) => [
        //     doc.department ?? "",
        //     doc.frequency ?? "",
        //     doc.absentmodes ?? "",
        //     doc.fromvalue ?? "",
        //     doc.tovalue ?? "",
        //     doc.achievedmodes ?? "",
        //     doc.frompoint ?? "",
        //     doc.topoint ?? "",
        //     doc.currentabsentmodes ?? "",
        //     doc.currentabsentvalue ?? "",
        //     doc.currentachievedmodes ?? "",
        //     doc.currentachievedvalue ?? "",
        //     doc.paidstatus ?? "",

        //   ]);

        //   // Combine headers and data
        //   const tableData = [headers, ...excelData];

        //   const docDefinition = {
        //     pageSize: "A4",
        //     pageOrientation: "landscape", // Landscape mode
        //     content: [
        //       { text: "paidstatusfixmonthset", style: "header", alignment: "center" },
        //       { text: `Generated on: ${new Date().toLocaleString()}`, style: "subheader", alignment: "right" },
        //       "\n",
        //       {
        //         table: {
        //           headerRows: 1,
        //           widths: ["auto", "auto", "auto",
        //             "auto", "auto", "auto",
        //             "auto", "auto", "auto",
        //             "auto", "auto", "auto", "auto"],
        //           body: tableData,
        //         },
        //         layout: "lightHorizontalLines", // Table styling
        //       },
        //     ],
        //     styles: {
        //       header: { fontSize: 14, bold: true },
        //       subheader: { fontSize: 10, italics: true },
        //     },
        //     defaultStyle: { fontSize: 8 }, // Reduce font size
        //   };

        //   pdfMake.createPdf(docDefinition).download("Paidstatusfixmonthset.pdf"); // Trigger downloa
        //   setIsPdfFilterOpen(false);
        // } catch (err) {
        //   console.log(err);
        // }

        try {
          let headers = ['Department', 'Frequency', 'Absent Modes', 'From Value', 'To Value', 'Achieved Modes', 'From Point', 'To Point', 'Current Absent Modes', 'Current Absent Value', 'Current Archived Modes', 'Current Archived Value', 'Paid Status'];

          // Ensure all data is in string format
          const excelData = rowDataTable.map((doc) => [
            String(doc.department ?? ''),
            String(doc.frequency ?? ''),
            String(doc.absentmodes ?? ''),
            String(doc.fromvalue ?? ''),
            String(doc.tovalue ?? ''),
            String(doc.achievedmodes ?? ''),
            String(doc.frompoint ?? ''),
            String(doc.topoint ?? ''),
            String(doc.currentabsentmodes ?? ''),
            String(doc.currentabsentvalue ?? ''),
            String(doc.currentachievedmodes ?? ''),
            String(doc.currentachievedvalue ?? ''),
            String(doc.paidstatus ?? ''),
          ]);

          const tableData = [headers, ...excelData];

          console.log('Table Data: ', tableData); // Debugging output

          const docDefinition = {
            pageSize: 'A4',
            pageOrientation: 'landscape',
            content: [
              { text: 'paidstatusfixmonthset', style: 'header', alignment: 'center' },
              { text: `Generated on: ${new Date().toLocaleString()}`, style: 'subheader', alignment: 'right' },
              '\n',
              {
                table: {
                  headerRows: 1,
                  widths: Array(headers.length).fill('auto'),
                  body: tableData,
                },
                layout: 'lightHorizontalLines',
              },
            ],
            styles: {
              header: { fontSize: 14, bold: true },
              subheader: { fontSize: 10, italics: true },
            },
            defaultStyle: { fontSize: 8 },
          };

          pdfMake.createPdf(docDefinition).download('Paidstatusfixmonthset.pdf');
          setIsPdfFilterOpen(false);
        } catch (err) {
          console.error('Error generating PDF:', err);
        }
      } else if (isfilter === 'overall') {
        setExportLoading(true);
        let response = await axios.get(SERVICE.PAID_MONTHSET_PDFDOWNLOAD, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          responseType: 'blob',
        });
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'Paidstatusfixmonthset.pdf';
        link.click();
        URL.revokeObjectURL(link.href);
        setExportLoading(false);
        setIsPdfFilterOpen(false);
      }
    } catch (err) {
      console.log(err, 'errpdf');
      setExportLoading(false);
    }
  };

  return (
    <Box>
      <Headtitle title={'Paid Status Fix Month Set'} />
      {/* ****** Header Content ****** */}
      <PageHeading title="Paid Status Fix Month Set" modulename="PayRoll" submodulename="PayRoll Setup" mainpagename="Paid Status Fix Month Set" subpagename="" subsubpagename="" />
      {isUserRoleCompare?.includes('apaidstatusfix') && (
        <>
          <Box sx={userStyle.dialogbox}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>Add Paid Status Fix Month Set</Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={5} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Department<b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <MultiSelect options={departments} value={selectedOptionsCate} onChange={handleCategoryChange} valueRenderer={customValueRendererCate} labelledBy="Please Select Area" />
                  </FormControl>
                </Grid>
              </Grid>
              <br />
              <Divider />
              <br />
              <Grid container spacing={2}>
                <Grid item md={6} xs={12} sm={6}>
                  <Button variant="contained" color="success" sx={{ textTransform: 'Capitalize' }} onClick={(e) => ExportsHead()}>
                    <FaDownload />
                    &ensp;Download template file
                  </Button>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={4} xs={12} sm={6} marginTop={3}>
                  <Grid container spacing={2}>
                    <Grid item md={4.5} xs={12} sm={6}>
                      <Button
                        variant="contained"
                        disabled={
                          paidstatusfix.frequency !== '' ||
                          paidstatusfix.fromvalue !== '' ||
                          paidstatusfix.tovalue != '' ||
                          paidstatusfix.frompoint != '' ||
                          paidstatusfix.topoint !== '' ||
                          paidstatusfix.currentabsentvalue !== '' ||
                          paidstatusfix.currentachievedvalue !== '' ||
                          paidstatusfix.paidstatus !== ''
                        }
                        component="label"
                        sx={{ textTransform: 'capitalize' }}
                      >
                        Choose File
                        <input
                          hidden
                          type="file"
                          accept=".xlsx, .xls , .csv"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            setDataupdated('uploaded');
                            readExcel(file);
                            setFileUploadName(file.name);
                            e.target.value = null;
                            setSplitArray([]);
                            setSheets([]);
                            setSelectedSheet('Please Select Sheet');
                          }}
                        />
                      </Button>
                    </Grid>
                    <Grid item md={6.5} xs={12} sm={6}>
                      {fileUploadName != '' && splitArray.length > 0 ? (
                        <Box sx={{ display: 'flex', justifyContent: 'left' }}>
                          <p>{fileUploadName}</p>
                          <Button sx={{ minWidth: '36px', borderRadius: '50%' }} onClick={() => clearFileSelection()}>
                            <FaTrash style={{ color: 'red' }} />
                          </Button>
                        </Box>
                      ) : null}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>Sheet</Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={sheets.filter((d) => !updateSheet.includes(d.index))}
                      value={{ label: selectedSheet, value: selectedSheet }}
                      onChange={(e) => {
                        setSelectedSheet(e.value);
                        setSelectedSheetindex(e.index);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={5} xs={12} sm={6} marginTop={3}>
                  <Grid container>
                    <Grid item md={7} xs={12} sm={8}>
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={
                          paidstatusfix.frequency !== '' ||
                          paidstatusfix.fromvalue !== '' ||
                          paidstatusfix.tovalue != '' ||
                          paidstatusfix.frompoint != '' ||
                          paidstatusfix.topoint !== '' ||
                          paidstatusfix.currentabsentvalue !== '' ||
                          paidstatusfix.currentachievedvalue !== '' ||
                          paidstatusfix.paidstatus !== ''
                        }
                        onClick={getSheetExcel}
                        sx={{ textTransform: 'capitalize' }}
                      >
                        Get Sheet
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <br />
              <Divider />
              <br />
              <br />
              <Grid container spacing={2}>
                {/* <Grid item md={3} sm={6} xs={12}>
                  <Typography>Select Month</Typography>
                  <FormControl fullWidth size="small">
                    <Selects
                      maxMenuHeight={200}
                      isDisabled={fileUploadName != "" && splitArray.length > 0}
                      value={{
                        label: paidstatusfix.month,
                        value: paidstatusfix.month,
                      }}
                      onChange={(e) => {
                        setPaidstatusfix({ ...paidstatusfix, month: e.label });
                      }}
                      options={months}
                    />
                  </FormControl>
                </Grid> */}
                {/* <Grid item md={3} sm={6} xs={12}>
                  <Typography> Select Year</Typography>
                  <FormControl fullWidth size="small">
                    <Selects
                      maxMenuHeight={200}
                      isDisabled={fileUploadName != "" && splitArray.length > 0}
                      value={{
                        label: paidstatusfix.year,
                        value: paidstatusfix.year,
                      }}
                      onChange={(e) => {
                        setPaidstatusfix({ ...paidstatusfix, year: e.value });
                      }}
                      options={getyear}
                    />
                  </FormControl>
                </Grid> */}
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Frequency <b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      disabled={fileUploadName != '' && splitArray.length > 0}
                      value={paidstatusfix.frequency}
                      onChange={(e) => {
                        setPaidstatusfix({
                          ...paidstatusfix,
                          frequency: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Absent Mode </Typography>
                    <Select
                      fullWidth
                      labelId="demo-select-small"
                      id="demo-select-small"
                      disabled={fileUploadName != '' && splitArray.length > 0}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 200,
                            width: 80,
                          },
                        },
                      }}
                      value={absentmodes}
                      onChange={(e) => {
                        setAbsentmodes(e.target.value);
                      }}
                      displayEmpty
                      inputProps={{ 'aria-label': 'Without label' }}
                    >
                      <MenuItem value="Between"> {'Between'} </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>From Value </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      disabled={fileUploadName != '' && splitArray.length > 0}
                      value={paidstatusfix.fromvalue}
                      onChange={(e) => {
                        setPaidstatusfix({
                          ...paidstatusfix,
                          fromvalue: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>To Value </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      disabled={fileUploadName != '' && splitArray.length > 0}
                      value={paidstatusfix.tovalue}
                      onChange={(e) => {
                        setPaidstatusfix({
                          ...paidstatusfix,
                          tovalue: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Achieved Mode</Typography>
                    <Select
                      fullWidth
                      labelId="demo-select-small"
                      id="demo-select-small"
                      disabled={fileUploadName != '' && splitArray.length > 0}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 200,
                            width: 80,
                          },
                        },
                      }}
                      value={achievedmodes}
                      onChange={(e) => {
                        setAchievedmodes(e.target.value);
                      }}
                      displayEmpty
                      inputProps={{ 'aria-label': 'Without label' }}
                    >
                      <MenuItem value="Between"> {'Between'} </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>From Point </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      disabled={fileUploadName != '' && splitArray.length > 0}
                      value={paidstatusfix.frompoint}
                      onChange={(e) => {
                        setPaidstatusfix({
                          ...paidstatusfix,
                          frompoint: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>To Point </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      disabled={fileUploadName != '' && splitArray.length > 0}
                      value={paidstatusfix.topoint}
                      onChange={(e) => {
                        setPaidstatusfix({
                          ...paidstatusfix,
                          topoint: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Current Absent Mode</Typography>
                    <Select
                      fullWidth
                      labelId="demo-select-small"
                      id="demo-select-small"
                      disabled={fileUploadName != '' && splitArray.length > 0}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 200,
                            width: 80,
                          },
                        },
                      }}
                      value={currentabsentmodes}
                      onChange={(e) => {
                        setCurrentabsentmodes(e.target.value);
                      }}
                      displayEmpty
                      inputProps={{ 'aria-label': 'Without label' }}
                    >
                      <MenuItem value="Less Than or Equal"> {'Less Than or Equal'} </MenuItem>
                      <MenuItem value="Less Than"> {'Less Than'} </MenuItem>
                      <MenuItem value="Greater Than"> {'Greater Than'} </MenuItem>
                      <MenuItem value="Greater Than  or Equal"> {'Greater Than or Equal'} </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Current Absent Value </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      disabled={fileUploadName != '' && splitArray.length > 0}
                      value={paidstatusfix.currentabsentvalue}
                      onChange={(e) => {
                        setPaidstatusfix({
                          ...paidstatusfix,
                          currentabsentvalue: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Current Achieved Mode </Typography>
                    <Select
                      fullWidth
                      labelId="demo-select-small"
                      id="demo-select-small"
                      disabled={fileUploadName != '' && splitArray.length > 0}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 200,
                            width: 80,
                          },
                        },
                      }}
                      value={currentachievedmodes}
                      onChange={(e) => {
                        setCurrentachievedmodes(e.target.value);
                      }}
                      displayEmpty
                      inputProps={{ 'aria-label': 'Without label' }}
                    >
                      <MenuItem value="Less Than or Equal"> {'Less Than or Equal'} </MenuItem>
                      <MenuItem value="Less Than"> {'Less Than'} </MenuItem>
                      <MenuItem value="Greater Than"> {'Greater Than'} </MenuItem>
                      <MenuItem value="Greater Than  or Equal"> {'Greater Than or Equal'} </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Current Achieved Value </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      disabled={fileUploadName != '' && splitArray.length > 0}
                      value={paidstatusfix.currentachievedvalue}
                      onChange={(e) => {
                        setPaidstatusfix({
                          ...paidstatusfix,
                          currentachievedvalue: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Paid Status<b style={{ color: 'red' }}>*</b>{' '}
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      disabled={fileUploadName != '' && splitArray.length > 0}
                      value={paidstatusfix.paidstatus}
                      onChange={(e) => {
                        setPaidstatusfix({
                          ...paidstatusfix,
                          paidstatus: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <br /> <br />
              <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Grid item lg={1} md={2} sm={2} xs={12}>
                  {!loading ? (
                    fileUploadName != '' && splitArray.length > 0 && selectedSheet !== 'Please Select Sheet' ? (
                      <>
                        <div readExcel={readExcel}>
                          <SendToServer sendJSON={sendJSON} />
                        </div>
                      </>
                    ) : (
                      <Button variant="contained" disabled={isXeroxLoad === true} onClick={handleSubmit}>
                        Submit
                      </Button>
                    )
                  ) : (
                    <LoadingButton
                      // onClick={handleClick}
                      loading={loading}
                      loadingPosition="start"
                      variant="contained"
                    >
                      <span>Send</span>
                    </LoadingButton>
                  )}
                </Grid>
                <Grid item lg={1} md={2} sm={2} xs={12}>
                  <Button sx={userStyle.btncancel} onClick={handleClear}>
                    Clear
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
          <br />
          {isUserRoleCompare?.includes('lpaidstatusfixmonthset') && (
            <>
              <Box sx={userStyle.container}>
                {/* ******************************************************EXPORT Buttons****************************************************** */}
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>List Paid Status Fix Month Set</Typography>
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
                        <MenuItem value={penaltyErrorUpload?.length}>All</MenuItem>
                      </Select>
                    </Box>
                  </Grid>
                  <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Box>
                      {isUserRoleCompare?.includes('excelpaidstatusfixmonthset') && (
                        <>
                          <Button
                            onClick={(e) => {
                              setIsFilterOpen(true);
                              // fetchPenaltyErrorUploadArray()
                              setFormat('xl');
                            }}
                            sx={userStyle.buttongrp}
                          >
                            <FaFileExcel />
                            &ensp;Export to Excel&ensp;
                          </Button>
                        </>
                      )}
                      {isUserRoleCompare?.includes('csvpaidstatusfixmonthset') && (
                        <>
                          <Button
                            onClick={(e) => {
                              setIsFilterOpen(true);
                              // fetchPenaltyErrorUploadArray()
                              setFormat('csv');
                            }}
                            sx={userStyle.buttongrp}
                          >
                            <FaFileCsv />
                            &ensp;Export to CSV&ensp;
                          </Button>
                        </>
                      )}
                      {isUserRoleCompare?.includes('printpaidstatusfixmonthset') && (
                        <>
                          <Button sx={userStyle.buttongrp} onClick={handleprint}>
                            &ensp;
                            <FaPrint />
                            &ensp;Print&ensp;
                          </Button>
                        </>
                      )}
                      {isUserRoleCompare?.includes('pdfpaidstatusfixmonthset') && (
                        <>
                          <Button
                            sx={userStyle.buttongrp}
                            onClick={() => {
                              setIsPdfFilterOpen(true);
                              // fetchPenaltyErrorUploadArray()
                            }}
                          >
                            <FaFilePdf />
                            &ensp;Export to PDF&ensp;
                          </Button>
                        </>
                      )}
                      {isUserRoleCompare?.includes('imagepaidstatusfixmonthset') && (
                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                          {' '}
                          <ImageIcon sx={{ fontSize: '15px' }} /> &ensp;Image&ensp;{' '}
                        </Button>
                      )}
                    </Box>
                  </Grid>
                  <Grid item md={2} xs={6} sm={6}>
                    <AggregatedSearchBar
                      columnDataTable={columnDataTable}
                      setItems={setItems}
                      addSerialNumber={addSerialNumber}
                      setPage={setPage}
                      maindatas={penaltyErrorUpload}
                      setSearchedString={setSearchedString}
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                      paginated={false}
                      totalDatas={overallItems}
                    />
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
                {isUserRoleCompare?.includes('bderrortype') && (
                  <Button variant="contained" color="error" onClick={handleClickOpenalert} sx={buttonStyles.buttonbulkdelete}>
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
                      // totalDatas={totalProjects}
                      searchQuery={searchQuery}
                      handleShowAllColumns={handleShowAllColumns}
                      setFilteredRowData={setFilteredRowData}
                      filteredRowData={filteredRowData}
                      setFilteredChanges={setFilteredChanges}
                      filteredChanges={filteredChanges}
                      gridRefTableImg={gridRefTableImg}
                      itemsList={overallItems}
                    />
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
              vertical: 'bottom',
              horizontal: 'left',
            }}
          >
            {manageColumnsContent}
          </Popover>
        </>
      )}

      {/* EXTERNAL COMPONENTS -------------- START */}
      {/* VALIDATION */}
      <MessageAlert openPopup={openPopupMalert} handleClosePopup={handleClosePopupMalert} popupContent={popupContentMalert} popupSeverity={popupSeverityMalert} />
      {/* SUCCESS */}
      <AlertDialog openPopup={openPopup} handleClosePopup={handleClosePopup} popupContent={popupContent} popupSeverity={popupSeverity} />

      {/* view model */}
      <Dialog open={openview} onClose={handleClickOpenview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="lg" sx={{ marginTop: '50px' }}>
        <Box sx={{ width: 'auto', padding: '20px 50px' }}>
          <>
            <Typography sx={userStyle.HeaderText}> View Paid Status Fix List</Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Department</Typography>
                  <Typography>{paidstatusfixEdit.department + ','}</Typography>
                </FormControl>
              </Grid>
              {/* <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Select Month</Typography>
                  <Typography>{paidstatusfixEdit.month}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Select Year</Typography>
                  <Typography>{paidstatusfixEdit.year}</Typography>
                </FormControl>
              </Grid> */}
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Frequency</Typography>
                  <Typography>{paidstatusfixEdit.frequency}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Absent Mode</Typography>
                  <Typography>{paidstatusfixEdit.absentmodes}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">From Value</Typography>
                  <Typography>{paidstatusfixEdit.fromvalue}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">To Value</Typography>
                  <Typography>{paidstatusfixEdit.tovalue}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Achieved Mode</Typography>
                  <Typography>{paidstatusfixEdit.achievedmodes}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">From Point</Typography>
                  <Typography>{paidstatusfixEdit.frompoint}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">To Point</Typography>
                  <Typography>{paidstatusfixEdit.topoint}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Current Absent Mode</Typography>
                  <Typography>{paidstatusfixEdit.currentabsentmodes}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Current Absent Value</Typography>
                  <Typography>{paidstatusfixEdit.currentabsentvalue}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Current Achieved Mode</Typography>
                  <Typography>{paidstatusfixEdit.currentachievedmodes}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Current Achieved Value </Typography>
                  <Typography>{paidstatusfixEdit.currentachievedvalue}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Paid Status</Typography>
                  <Typography>{paidstatusfixEdit.paidstatus}</Typography>
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Button variant="contained" color="primary" onClick={handleCloseview} sx={buttonStyles.btncancel}>
                {' '}
                Back{' '}
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>
      <InfoPopup openInfo={openInfo} handleCloseinfo={handleCloseinfo} heading="Paid Status Fix Month Set List Info" addedby={addedby} updateby={updateby} />

      <Box>
        {/* Edit DIALOG */}
        <Dialog
          open={isEditOpen}
          onClose={handleCloseModEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth={true}
          maxWidth="md"
          sx={{
            overflow: 'visible',
            '& .MuiPaper-root': {
              overflow: 'visible',
              marginTop: '50px',
            },
          }}
        >
          <Box sx={{ padding: '20px' }}>
            <>
              <form onSubmit={editSubmit}>
                {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}
                <Grid container spacing={2}>
                  <Grid item md={12} xs={12} sm={12}>
                    <Typography sx={userStyle.HeaderText}>Edit Paid Status Fix List</Typography>
                  </Grid>
                </Grid>
                <br />
                <Grid container spacing={2}>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Department </Typography>
                      <OutlinedInput id="component-outlined" type="text" value={paidstatusfixEdit.department} />
                    </FormControl>
                    {/* <FormControl fullWidth size="small">
                      <Typography>
                        Department<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={departmentsEdit}
                        value={selectedOptionsCateEdit}
                        // onChange={handleCategoryChangeEdit}
                        readOnly
                        valueRenderer={customValueRendererCateEdit}
                        labelledBy="Please Select Department"
                      // className="scrollable-multiselect"
                      />
                    </FormControl> */}
                  </Grid>
                  {/* <Grid item md={3} sm={6} xs={12}>
                    <Typography>Select Month</Typography>
                    <FormControl fullWidth size="small">
                      <Selects
                        maxMenuHeight={200}
                        value={{
                          label: paidstatusfixEdit.month,
                          value: paidstatusfixEdit.month,
                        }}
                        onChange={(e) => {
                          setPaidstatusfixEdit({
                            ...paidstatusfixEdit,
                            month: e.label,
                          });
                        }}
                        options={months}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={6} xs={12}>
                    <Typography> Select Year</Typography>
                    <FormControl fullWidth size="small">
                      <Selects
                        maxMenuHeight={200}
                        value={{
                          label: paidstatusfixEdit.year,
                          value: paidstatusfixEdit.year,
                        }}
                        onChange={(e) => {
                          setPaidstatusfixEdit({
                            ...paidstatusfixEdit,
                            year: e.value,
                          });
                        }}
                        options={getyear}
                      />
                    </FormControl>
                  </Grid> */}
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Frequency <b style={{ color: 'red' }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={paidstatusfixEdit.frequency}
                        onChange={(e) => {
                          setPaidstatusfixEdit({
                            ...paidstatusfixEdit,
                            frequency: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Absent Mode </Typography>
                      <Select
                        fullWidth
                        labelId="demo-select-small"
                        id="demo-select-small"
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 200,
                              width: 80,
                            },
                          },
                        }}
                        value={absentmodesEdit}
                        onChange={(e) => {
                          setAbsentmodesEdit(e.target.value);
                        }}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                      >
                        <MenuItem value="Between"> {'Between'} </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>From Value </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={paidstatusfixEdit.fromvalue}
                        onChange={(e) => {
                          setPaidstatusfixEdit({
                            ...paidstatusfixEdit,
                            fromvalue: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>To Value </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={paidstatusfixEdit.tovalue}
                        onChange={(e) => {
                          setPaidstatusfixEdit({
                            ...paidstatusfixEdit,
                            tovalue: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Achieved Mode </Typography>
                      <Select
                        fullWidth
                        labelId="demo-select-small"
                        id="demo-select-small"
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 200,
                              width: 80,
                            },
                          },
                        }}
                        value={achievedmodesEdit}
                        onChange={(e) => {
                          setAchievedmodesEdit(e.target.value);
                        }}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                      >
                        <MenuItem value="Between"> {'Between'} </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>From Point </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={paidstatusfixEdit.frompoint}
                        onChange={(e) => {
                          setPaidstatusfixEdit({
                            ...paidstatusfixEdit,
                            frompoint: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>To Point </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={paidstatusfixEdit.topoint}
                        onChange={(e) => {
                          setPaidstatusfixEdit({
                            ...paidstatusfixEdit,
                            topoint: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Current Absent Mode </Typography>
                      <Select
                        fullWidth
                        labelId="demo-select-small"
                        id="demo-select-small"
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 200,
                              width: 80,
                            },
                          },
                        }}
                        value={currentabsentmodesEdit}
                        onChange={(e) => {
                          setCurrentabsentmodesEdit(e.target.value);
                        }}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                      >
                        <MenuItem value="Less Than or Equal"> {'Less Than or Equal'} </MenuItem>
                        <MenuItem value="Less Than"> {'Less Than'} </MenuItem>
                        <MenuItem value="Greater Than"> {'Greater Than'} </MenuItem>
                        <MenuItem value="Greater Than  or Equal"> {'Greater Than or Equal'} </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Current Absent Value </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={paidstatusfixEdit.currentabsentvalue}
                        onChange={(e) => {
                          setPaidstatusfixEdit({
                            ...paidstatusfixEdit,
                            currentabsentvalue: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Current Achieved Mode </Typography>
                      <Select
                        fullWidth
                        labelId="demo-select-small"
                        id="demo-select-small"
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 200,
                              width: 80,
                            },
                          },
                        }}
                        value={currentachievedmodesEdit}
                        onChange={(e) => {
                          setCurrentachievedmodesEdit(e.target.value);
                        }}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                      >
                        <MenuItem value="Less Than or Equal"> {'Less Than or Equal'} </MenuItem>
                        <MenuItem value="Less Than"> {'Less Than'} </MenuItem>
                        <MenuItem value="Greater Than"> {'Greater Than'} </MenuItem>
                        <MenuItem value="Greater Than  or Equal"> {'Greater Than or Equal'} </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Current Achieved Value </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={paidstatusfixEdit.currentachievedvalue}
                        onChange={(e) => {
                          setPaidstatusfixEdit({
                            ...paidstatusfixEdit,
                            currentachievedvalue: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Paid Status<b style={{ color: 'red' }}>*</b>{' '}
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={paidstatusfixEdit.paidstatus}
                        onChange={(e) => {
                          setPaidstatusfixEdit({
                            ...paidstatusfixEdit,
                            paidstatus: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <br />
                <br />
                <Grid container spacing={2}>
                  <Grid item md={6} xs={6} sm={6}>
                    <Button variant="contained" type="submit" sx={buttonStyles.buttonsubmit}>
                      Update
                    </Button>
                  </Grid>
                  <Grid item md={6} xs={6} sm={6}>
                    <Button sx={buttonStyles.btncancel} onClick={handleCloseModEdit}>
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
                {/* </DialogContent> */}
              </form>
            </>
          </Box>
        </Dialog>
      </Box>

      <DeleteConfirmation open={isDeleteOpen} onClose={handleCloseMod} onConfirm={delPaidstatus} title="Are you sure?" confirmButtonText="Yes" cancelButtonText="Cancel" />

      <PleaseSelectRow open={isDeleteOpenalert} onClose={handleCloseModalert} message="Please Select any Row" iconColor="orange" buttonText="OK" />

      <DeleteConfirmation open={isDeleteOpencheckbox} onClose={handleCloseModcheckbox} onConfirm={delPaidstatuscheckbox} title="Are you sure?" confirmButtonText="Yes" cancelButtonText="Cancel" />

      <ExportData
        // isFilterOpen={isFilterOpen}
        // handleCloseFilterMod={handleCloseFilterMod}
        // fileFormat={fileFormat}
        // setIsFilterOpen={setIsFilterOpen}
        // isPdfFilterOpen={isPdfFilterOpen}
        // setIsPdfFilterOpen={setIsPdfFilterOpen}
        // handleClosePdfFilterMod={handleClosePdfFilterMod}
        filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
        // itemsTwo={paidstatusfixsFilterArray ?? []}
        itemsTwo={penaltyErrorUpload ?? []}
        filename={'Paid Status Fix Month Set List'}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />

      {/*Export XL Data  */}
      <Dialog open={isFilterOpen} onClose={handleCloseFilterMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ textAlign: 'center', alignItems: 'center', justifyContent: 'center' }}>
          <IconButton
            aria-label="close"
            onClick={handleCloseFilterMod}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          {fileFormat === 'xl' ? <FaFileExcel style={{ fontSize: '80px', color: 'green' }} /> : <FaFileCsv style={{ fontSize: '80px', color: 'green' }} />}
          <Typography variant="h5" sx={{ textAlign: 'center' }}>
            Choose Export
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            variant="contained"
            onClick={(e) => {
              fileFormat === 'xl' ? handleExportXL('filtered') : downloadCSV('filtered');
            }}
          >
            Export Filtered Data
          </Button>
          <LoadingButton
            autoFocus
            loading={exportLoading}
            variant="contained"
            onClick={(e) => {
              fileFormat === 'xl' ? handleExportXL('overall') : downloadCSV('overall');
            }}
          >
            Export Over All Data
          </LoadingButton>
        </DialogActions>
      </Dialog>

      <Dialog open={isPdfFilterOpen} onClose={handleClosePdfFilterMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ textAlign: 'center', alignItems: 'center', justifyContent: 'center' }}>
          <IconButton
            aria-label="close"
            onClick={handleClosePdfFilterMod}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <PictureAsPdfIcon sx={{ fontSize: '80px', color: 'red' }} />
          <Typography variant="h5" sx={{ textAlign: 'center' }}>
            Choose Export
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={(e) => {
              downloadPdf('filtered');
            }}
          >
            Export Filtered Data
          </Button>
          <LoadingButton
            variant="contained"
            loading={exportLoading}
            onClick={(e) => {
              downloadPdf('overall');
            }}
          >
            Export Over All Data
          </LoadingButton>
        </DialogActions>
      </Dialog>

      {/* EXTERNAL COMPONENTS -------------- END */}
    </Box>
  );
}

export default PaidStatusFix;
