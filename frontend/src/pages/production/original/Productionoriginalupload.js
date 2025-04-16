import React, { useState, useEffect, useRef, useContext } from 'react';
import { Box, Zoom, Tooltip, Typography, OutlinedInput, TableBody, Table, TableContainer, Paper, TableHead, TableRow, TableCell, Select, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Button } from '@mui/material';
import Selects from 'react-select';
import { userStyle } from '../../../pageStyle';
import { useLocation, Link } from 'react-router-dom';
import { ThreeDots } from 'react-loader-spinner';
import ImageIcon from '@mui/icons-material/Image';
import { useReactToPrint } from 'react-to-print';
import { saveAs } from 'file-saver';
import moment from 'moment-timezone';
import StyledDataGrid from '../../../components/TableStyle';
import html2canvas from 'html2canvas';
import TipsAndUpdatesTwoToneIcon from '@mui/icons-material/TipsAndUpdatesTwoTone';
import { FaTrash, FaPrint, FaFilePdf, FaFileExcel } from 'react-icons/fa';
import { handleApiError } from '../../../components/Errorhandling';
import 'jspdf-autotable';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { SERVICE } from '../../../services/Baseservice';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { UserRoleAccessContext, AuthContext } from '../../../context/Appcontext';
import Headtitle from '../../../components/Headtitle';
import ExportData from '../../../components/ExportData';
import { CircularProgress } from '@mui/material';
import AlertDialog from '../../../components/Alert';
import MessageAlert from '../../../components/MessageAlert';
import PageHeading from '../../../components/PageHeading';
import { v4 as uuidv4 } from 'uuid';

const LinearProgressBar = ({ progress }) => {
  return (
    <div style={{ width: '100%', height: '20px', border: '1px solid #ccc', borderRadius: '5px', overflow: 'hidden' }}>
      <div
        style={{
          width: `${progress}%`,
          height: '100%',
          backgroundColor: '#1976d2b0',
          color: 'white',
          textAlign: 'center',
          lineHeight: '20px',
        }}
      >
        {progress}%
      </div>
    </div>
  );
};

function ProductionOriginalUpload() {
  const datetimeZoneOptions = [
    { value: 'India Standard Time', label: 'India Standard Time' },
    { value: '(GMT +5:30) Bombay, Calcutta, Madras, New Delhi', label: '(GMT +5:30) Bombay, Calcutta, Madras, New Delhi' },
    { value: '(GMT -12:00) Eniwetok, Kwajalein', label: '(GMT -12:00) Eniwetok, Kwajalein' },
    { value: '(GMT -11:00) Midway Island, Samoa', label: '(GMT -11:00) Midway Island, Samoa' },
    { value: '(GMT -10:00) Hawaii', label: '(GMT -10:00) Hawaii' },
    { value: '(GMT -9:30) Taiohae', label: '(GMT -9:30) Taiohae' },
    { value: '(GMT -9:00) Alaska', label: '(GMT -9:00) Alaska' },
    { value: '(GMT -8:00) Pacific Time (US & Canada)', label: '(GMT -8:00) Pacific Time (US & Canada)' },
    { value: '(GMT -7:00) Mountain Time (US & Canada)', label: '(GMT -7:00) Mountain Time (US & Canada)' },
    { value: '(GMT -6:00) Central Time (US & Canada), Mexico City', label: '(GMT -6:00) Central Time (US & Canada), Mexico City' },
    { value: '(GMT -5:00) Eastern Time (US & Canada), Bogota, Lima', label: '(GMT -5:00) Eastern Time (US & Canada), Bogota, Lima' },
    { value: '(GMT -4:30) Caracas', label: '(GMT -4:30) Caracas' },
    { value: '(GMT -4:00) Atlantic Time (Canada), Caracas, La Paz', label: '(GMT -4:00) Atlantic Time (Canada), Caracas, La Paz' },
    { value: '(GMT -3:30) Newfoundland', label: '(GMT -3:30) Newfoundland' },
    { value: '(GMT -3:00) Brazil, Buenos Aires, Georgetown', label: '(GMT -3:00) Brazil, Buenos Aires, Georgetown' },
    { value: '(GMT -2:00) Mid-Atlantic', label: '(GMT -2:00) Mid-Atlantic' },
    { value: '(GMT -1:00) Azores, Cape Verde Islands', label: '(GMT -1:00) Azores, Cape Verde Islands' },
    { value: '(GMT) Western Europe Time, London, Lisbon, Casablanca', label: '(GMT) Western Europe Time, London, Lisbon, Casablanca' },
    { value: '(GMT +1:00) Brussels, Copenhagen, Madrid, Paris', label: '(GMT +1:00) Brussels, Copenhagen, Madrid, Paris' },
    { value: '(GMT +2:00) Kaliningrad, South Africa', label: '(GMT +2:00) Kaliningrad, South Africa' },
    { value: '(GMT +3:00) Baghdad, Riyadh, Moscow, St. Petersburg', label: '(GMT +3:00) Baghdad, Riyadh, Moscow, St. Petersburg' },
    { value: '(GMT +3:30) Tehran', label: '(GMT +3:30) Tehran' },
    { value: '(GMT +4:00) Abu Dhabi, Muscat, Baku, Tbilisi', label: '(GMT +4:00) Abu Dhabi, Muscat, Baku, Tbilisi' },
    { value: '(GMT +4:30) Kabul', label: '(GMT +4:30) Kabul' },
    { value: '(GMT +5:00) Ekaterinburg, Islamabad, Karachi, Tashkent', label: '(GMT +5:00) Ekaterinburg, Islamabad, Karachi, Tashkent' },
    { value: '(GMT +5:45) Kathmandu, Pokhara', label: '(GMT +5:45) Kathmandu, Pokhara' },
    { value: '(GMT +6:00) Almaty, Dhaka, Colombo', label: '(GMT +6:00) Almaty, Dhaka, Colombo' },
    { value: '(GMT +6:30) Yangon, Mandalay', label: '(GMT +6:30) Yangon, Mandalay' },
    { value: '(GMT +7:00) Bangkok, Hanoi, Jakarta', label: '(GMT +7:00) Bangkok, Hanoi, Jakarta' },
    { value: '(GMT +8:00) Beijing, Perth, Singapore, Hong Kong', label: '(GMT +8:00) Beijing, Perth, Singapore, Hong Kong' },
    { value: '(GMT +8:45) Eucla', label: '(GMT +8:45) Eucla' },
    { value: '(GMT +9:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk', label: '(GMT +9:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk' },
    { value: '(GMT +9:30) Adelaide, Darwin', label: '(GMT +9:30) Adelaide, Darwin' },
    { value: '(GMT +10:00) Eastern Australia, Guam, Vladivostok', label: '(GMT +10:00) Eastern Australia, Guam, Vladivostok' },
    { value: '(GMT +10:30) Lord Howe Island', label: '(GMT +10:30) Lord Howe Island' },
    { value: '(GMT +11:00) Magadan, Solomon Islands, New Caledonia', label: '(GMT +11:00) Magadan, Solomon Islands, New Caledonia' },
    { value: '(GMT +11:30) Norfolk Island', label: '(GMT +11:30) Norfolk Island' },
    { value: '(GMT +12:00) Auckland, Wellington, Fiji, Kamchatka', label: '(GMT +12:00) Auckland, Wellington, Fiji, Kamchatka' },
    { value: '(GMT +12:45) Chatham Islands', label: '(GMT +12:45) Chatham Islands' },
    { value: '(GMT +13:00) Apia, Nukualofa', label: '(GMT +13:00) Apia, Nukualofa' },
    { value: '(GMT +14:00) Line Islands, Tokelau', label: '(GMT +14:00) Line Islands, Tokelau' },
  ];

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

  const istTimeZoneall = datetimeZoneOptions.find((option) => option.label.includes('India Standard Time'));
  const istTimeZone = istTimeZoneall.label;

  const gridRef = useRef(null);

  const [productionoriginal, setProductionoriginal] = useState({ nameround: '', datetimezone: istTimeZone, vendor: 'Please Select Vendor', fromdate: '', todate: '', sheetnumber: 'Details 1' });

  const [productionsOriginal, setProductionsOriginal] = useState([]);
  const [vendors, setVendors] = useState([]);

  const [yeardrop, setYeardrop] = useState('yyyy');
  const [monthdrop, setMonthdrop] = useState('MM');
  const [datedrop, setDatedrop] = useState('dd');
  const [symboldrop, setSymboldrop] = useState('-');
  const [hoursdrop, setHoursdrop] = useState('24 Hours');
  const [progress, setProgress] = useState(0);
  const [progressbar, setProgressbar] = useState(0);
  const [excelArray, setExcelArray] = useState([]);
  const [dataupdated, setDataupdated] = useState('');
  const [fileLength, setFileLength] = useState(0);
  const [submitAction, setSubmitAction] = useState('yes');

  const { isUserRoleCompare, isUserRoleAccess } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);

  const [productionCheck, setProductioncheck] = useState(false);

  const username = isUserRoleAccess.username;
  const companyname = isUserRoleAccess.companyname;

  const location = useLocation();
  const currentPath = location.pathname;
  const [categoriesDatas, setCategoriesDatas] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoriesFlagCalc, setCategoriesFlagCalc] = useState([]);

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Production Unmatch Unit',
    pageStyle: 'print',
  });

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, 'Production Unmatch Unit.png');
        });
      });
    }
  };

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState('');
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = async (e, reason) => {
    if (reason && reason === 'backdropClick') return;
    setIsErrorOpen(false);
    await fetchProductionoriginal();
  };

  // Error Popup model
  const [dupeAlert, setDupeAlert] = useState(false);
  const [showDupeAlert, setShowDupeAlert] = useState([]);
  const handleClickOpenDupe = () => {
    setDupeAlert(true);
  };
  const handleCloseDupe = async (e, reason) => {
    if (reason && reason === 'backdropClick') return;
    setDataupdated('uploaded');
    setDupeAlert(false);
  };
  const [uniqueFileLength, setUniqueFileLength] = useState(0);
  const handleCloseDupeWithDupe = async () => {
    setExcelArray(allDatas);
    setFileLength(fileLength);
    setOverallCount(allDatas.map((d) => d.data).flat().length);
    setDupeAlert(false);
    setDataupdated('uploaded');
  };
  const handleCloseDupeWithoutDupe = async () => {
    setExcelArray(uniqueDatas);
    setFileLength(uniqueDatas.length);
    setOverallCount(uniqueDatas.map((d) => d.data).flat().length);
    setDupeAlert(false);
    setDataupdated('uploaded');
  };

  // Error Popup model
  const [isErrorOpenempty, setIsErrorOpenempty] = useState(false);
  const handleClickOpenerrempty = () => {
    setIsErrorOpenempty(true);
  };
  const handleCloseerrempty = async (e, reason) => {
    if (reason && reason === 'backdropClick') return;
    setIsErrorOpenempty(false);
    setExcelArray([]);
    setFileLength();
    setDataupdated('');
    setSelectedFiles([]);
    setSubmitAction('');
    setgetDates([]);
    await fetchProductionoriginal();
  };

  // Error Popup model
  const [completeOpen, setCompleteOpen] = useState(false);
  const handleCompleteClickOpenerr = (e, reason) => {
    if (reason && reason === 'backdropClick') return;
    setDataupdated('');
    setCheckingSts('');
    setCompleteOpen(true);
  };
  const handleCompleteCloseerr = async () => {
    await fetchUploads();
    await fetchProductionoriginal();
    setCompleteOpen(false);
    setSubmitAction('');
    setProgressbar(0);
    setExcelArray([]);
    readExcel([]);
    setCheckingSts('');
    setFileLength();
    setDataupdated('');
    setSelectedFiles([]);
    setgetDates([]);
    setprogfinal('');
    setProgress(0);
    setChunksize(0);
  };

  // Error Popup model
  const [loadingMessage, setLoadingMessage] = useState(false);
  const handleOpenLoadingMessage = (val, progress, reason) => {
    setprogfinal(val);
    setProgressbar(progress.toFixed(2));
    setShowAlert(progress.toFixed(2));
    if (reason && reason === 'backdropClick') return;
    setLoadingMessage(true);
  };
  const handleCloseLoadingMessage = async () => {
    setLoadingMessage(false);
  };
  const [fileFormat, setFormat] = useState('');
  const [productionoriginalid, setProductionoriginalid] = useState(1);

  const fetchUploads = async () => {
    try {
      let Res = await axios.get(SERVICE.PRODUCTION_ORGINAL_UNIQID, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setProductionoriginalid(Res.data.productionoriginal);
      setDataupdated('');
      setCheckingSts('');
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // const fetchUnitRate = async () => {
  //   try {
  //     let Res = await axios.get(SERVICE.PRODUCTION_UNITRATE_PRODUPLOAD_LIMITED, {
  //       headers: {
  //         Authorization: `Bearer ${auth.APIToken}`,
  //       },
  //     });
  //     setUnitsRate(Res.data.unitsrate);
  //     setDataupdated("");
  //     setCheckingSts("");
  //   } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  // };

  // const fetchExcelCategory = async () => {
  //   try {
  //     let res_module = await axios.get(SERVICE.CATEGORYPROD_LIMITED, {
  //       headers: {
  //         Authorization: `Bearer ${auth.APIToken}`,
  //       },
  //     });

  //     setCategories(res_module?.data?.categoryprod);
  //   } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  // };

  // const fetchExcelSubCategory = async () => {
  //   try {
  //     let res_module = await axios.get(SERVICE.SUBCATEGORYPROD_LIMITED, {
  //       headers: {
  //         Authorization: `Bearer ${auth.APIToken}`,
  //       },
  //     });
  //     setSubCategories(res_module?.data?.subcategoryprod);
  //   } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  // };

  useEffect(() => {
    fetchUploads();
  }, []);

  // useEffect(() => {
  // fetchUnitRate();
  //   fetchExcelCategory();
  //   fetchExcelSubCategory();
  // }, []);

  const [newCategories, setNewCategories] = useState([]);
  const [newSubCategories, setNewSubCategories] = useState([]);
  const [newUnitrates, setNewUnitrates] = useState([]);
  const [newUnitratesOratelog, setnewUnitratesOratelog] = useState([]);
  const [newUnitratesTrate, setnewUnitratesTrate] = useState([]);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [getDates, setgetDates] = useState([]);
  const [progfinal, setprogfinal] = useState([]);
  const [checkingSts, setCheckingSts] = useState('');

  const [allDatas, setAllDatas] = useState([]);
  const [uniqueDatas, setUniqueDatas] = useState([]);

  // const [storedIds, setStoredIds] = useState('');

  // useEffect(() => {
  //   const storedIdsJSON = localStorage.getItem('sheetname');
  //   if (storedIdsJSON) {
  //     setStoredIds(JSON.parse(storedIdsJSON));
  //   }
  // }, []);

  let exportColumnNames = ['Category', 'SubCategory', 'Date', 'Login ID', 'IdentifyNumber'];
  let exportRowValues = ['category', 'subcategory', 'date', 'user', 'unitid'];

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };
  const [checkDate, setcheckDate] = useState(0);
  const [checkDatedaypoint, setcheckDatedaypoint] = useState(0);

  const checkProductionDay = async () => {
    try {
      const [res_Day, res_Day_Point] = await Promise.all([
        axios.post(SERVICE.CHECK_ISPRODDAY_CREATED, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          date: productionoriginal.fromdate,
        }),
        axios.post(SERVICE.CHECK_ISDAYPOINT_CREATED, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          date: productionoriginal.fromdate,
        }),
      ]);

      setcheckDate(res_Day.data.count);
      setcheckDatedaypoint(res_Day_Point.data.count);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    checkProductionDay();
  }, [productionoriginal.fromdate]);

  // console.log(dataupdated, checkingSts, 'fd')
  const [checkUniqueDatas, setCheckUniqueDatas] = useState([]);
  const [selectedFilesDatas, setSelectedFilesDatas] = useState([]);
  const [selectedFilesDatasDupe, setSelectedFilesDatasDupe] = useState([]);
  const readExcel = (e) => {
    if (productionoriginal.vendor === 'Please Select Vendor' || productionoriginal.vendor === '') {
      setPopupContentMalert('Please Select Vendor');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (productionoriginal.fromdate === '') {
      setPopupContentMalert('Please Select Fromdate');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (productionoriginal.todate === '') {
      setPopupContentMalert('Please Select Todate');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (checkDate > 0 && checkDatedaypoint > 0) {
      setPopupContentMalert('Production day & Day Point was Already created for this date');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (checkDate > 0) {
      setPopupContentMalert('Production day was Already created for this date');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    }
    //  else if (checkDatedaypoint > 0) {
    //   setPopupContentMalert("Day Point was Already created for this date");
    //   setPopupSeverityMalert("info");
    //   handleClickOpenPopupMalert();
    // }
    else {
      const files = [...e];
      // setSelectedFiles(files);
      // setSelectedFilesDatasDupe(files);
      // const sheetName = ['Details', 'Details 1', productionoriginal.sheetnumber];
      const sheetName = productionoriginal.sheetnumber;
      let today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0');
      var yyyy = today.getFullYear();
      const promises = files.map((file, index) => {
        handleProgressUpdate(index, files.length);

        const promise = new Promise((resolve, reject) => {
          const fileReader = new FileReader();
          fileReader.readAsArrayBuffer(file);

          fileReader.onload = async (e) => {
            const bufferArray = e.target.result;
            const wb = XLSX.read(bufferArray, { type: 'buffer' });

            // let wsname = sheetName && wb.SheetNames.includes(sheetName) ? sheetName : wb.SheetNames[0];
            // Find the first matching sheet name
            // const sheetKey = Object.keys(wb.Sheets).find((key) => sheetName.some((name) => key.includes(name)));
            // let wsname = sheetKey ? sheetKey : wb.SheetNames[0];
            // // console.log(wb.SheetNames[0],wb.Sheets[sheetKey], 'wb.SheetNames[0]');
            // // Access the sheet if found
            // let firstshettname = wb.SheetNames[0];
            // const ws = sheetKey ? wb.Sheets[sheetKey] : wb.Sheets[firstshettname];
            // localStorage.setItem('sheetname', JSON.stringify(wsname));

            let wsname = sheetName && wb.SheetNames.includes(sheetName) ? sheetName : wb.SheetNames[0];
            const ws = wb.Sheets[wsname];

            let firstSheetData;
            let data;
            // Reject if the file name is "Payment Totals Summary"
            if (file.name.includes('Payment Totals Summary')) {
              resolve(null);
              return;
            }

            if (wb.SheetNames.includes(sheetName)) {
              // Load both the first sheet and the second sheet named "Details"
              const firstSheetName = wb.SheetNames[0];
              const firstSheet = wb.Sheets[firstSheetName];

              // Get data from both sheets
              firstSheetData = XLSX.utils.sheet_to_json(firstSheet);

              // Find the range of the sheet
              const range = XLSX.utils.decode_range(ws['!ref']);

              // Limit the number of rows to process
              const maxRows = Math.min(range.e.r + 1, 300);

              let rowIndex = 0;
              let headingsFound = false;

              // Iterate through rows to find headings
              while (!headingsFound && rowIndex < maxRows) {
                // Assuming headings are within the first 100 rows
                const cellValueA = ws[XLSX.utils.encode_cell({ r: rowIndex, c: 0 })]?.v;
                const cellValueB = ws[XLSX.utils.encode_cell({ r: rowIndex, c: 1 })]?.v;
                const cellValueC = ws[XLSX.utils.encode_cell({ r: rowIndex, c: 2 })]?.v;
                const cellValueD = ws[XLSX.utils.encode_cell({ r: rowIndex, c: 3 })]?.v;
                const cellValueE = ws[XLSX.utils.encode_cell({ r: rowIndex, c: 4 })]?.v;
                // console.log(cellValueA, cellValueB, cellValueC, cellValueD, cellValueE, 'cellValueE');
                if (
                  (cellValueA === 'Category' && (cellValueB === 'Unit Identifier' || cellValueB === 'User') && cellValueC === 'User' && cellValueD === 'Date' && cellValueE === 'Unit Rate') ||
                  (cellValueA === 'Category' && cellValueC === 'Date' && cellValueD === 'Unit Rate')
                ) {
                  headingsFound = true;
                } else {
                  rowIndex++;
                }
              }

              if (!headingsFound) {
                // Handle case where headings are not found
                resolve(null);
                return;
              }

              const startRow = rowIndex + 1;
              const startCol = XLSX.utils.encode_col(0); // A
              const endCol = XLSX.utils.encode_col(5); // E
              const dataRange = `${startCol}${startRow}:${endCol}${range.e.r + 1}`;

              data = XLSX.utils.sheet_to_json(ws, { range: dataRange });
            } else if (sheetName == 1) {
              console.log('123');

              // Find the row index where the specified headings are present
              let rowIndex = 0;
              let headingsFound = false;

              while (!headingsFound && rowIndex < 350) {
                // Assuming headings are within the first 100 rows
                const cellValueA = ws[XLSX.utils.encode_cell({ r: rowIndex, c: 0 })]?.v;
                const cellValueB = ws[XLSX.utils.encode_cell({ r: rowIndex, c: 1 })]?.v;
                const cellValueC = ws[XLSX.utils.encode_cell({ r: rowIndex, c: 2 })]?.v;
                const cellValueD = ws[XLSX.utils.encode_cell({ r: rowIndex, c: 3 })]?.v;
                const cellValueE = ws[XLSX.utils.encode_cell({ r: rowIndex, c: 4 })]?.v;

                if (cellValueA === 'Category' && (cellValueB === 'Unit Identifier' || cellValueB === 'User') && cellValueC === 'User' && cellValueD === 'Date' && cellValueE === 'Unit Rate') {
                  headingsFound = true;
                } else if (cellValueA === 'Category' && cellValueC === 'Date' && cellValueD === 'Unit Rate') {
                  headingsFound = true;
                } else {
                  rowIndex++;
                }
              }

              if (!headingsFound) {
                // console.log('headingsFound');
                setFileLength(0);
                setDataupdated('');
                setExcelArray([]);
                setProgress(0);
                setPopupContentMalert(`Please select a valid sheet name. The sheet number '${sheetName}' you selected contains no valid data."`);
                setPopupSeverityMalert('warning');
                handleClickOpenPopupMalert();
                // Handle case where headings are not found
                resolve(null);
                return;
              }

              const startCol = XLSX.utils.encode_col(0); // A
              const endCol = XLSX.utils.encode_col(5); // E
              const range = `${startCol}${rowIndex + 1}:${endCol}${XLSX.utils.decode_range(ws['!ref']).e.r}`;

              data = XLSX.utils.sheet_to_json(ws, { range });

              // Check if the data array is empty
              if (data.length === 0) {
                // Omit the Excel sheet if it has no values
                console.log(`Sheet has no values.`);
                resolve(null);
                return;
              }

              // Find the row index where the specified headings are present for the second set of data
              let secondRowIndex = 0;
              let secondHeadingsFound = false;

              while (!secondHeadingsFound && secondRowIndex < 450) {
                // Assuming headings are within the first 100 rows
                const cellValueA = ws[XLSX.utils.encode_cell({ r: secondRowIndex, c: 0 })]?.v;
                const cellValueB = ws[XLSX.utils.encode_cell({ r: secondRowIndex, c: 1 })]?.v;
                const cellValueC = ws[XLSX.utils.encode_cell({ r: secondRowIndex, c: 2 })]?.v;
                const cellValueD = ws[XLSX.utils.encode_cell({ r: secondRowIndex, c: 3 })]?.v;

                if (cellValueA === 'Category' && cellValueB === 'Quantity' && cellValueC === 'Rate' && cellValueD === 'Total Payment') {
                  secondHeadingsFound = true;
                } else {
                  secondRowIndex++;
                }
              }

              if (!secondHeadingsFound) {
                // Handle case where second set of headings are not found
                resolve(null);
                return;
              }

              // Extract data for the second set of headings
              const startCol2 = XLSX.utils.encode_col(0); // A
              const endCol2 = XLSX.utils.encode_col(3); // D
              const range2 = `${startCol2}${secondRowIndex + 1}:${endCol2}${XLSX.utils.decode_range(ws['!ref']).e.r}`;
              firstSheetData = XLSX.utils.sheet_to_json(ws, { range: range2 });
            } else {
              setFileLength(0);
              setDataupdated('');
              setExcelArray([]);
              setProgress(0);
              setPopupContentMalert(`This selected ${sheetName} Sheetname not found`);
              setPopupSeverityMalert('warning');
              handleClickOpenPopupMalert();
            }

            let FinalMatchData = firstSheetData
              .filter((data) => data.Category !== undefined)
              .filter((row, index, self) => {
                // Find the index of the first occurrence of the current Category
                const firstIndex = self.findIndex((r) => r.Category.toLowerCase() === row.Category.toLowerCase());
                // Only include the row if its index matches the first occurrence of the Category
                return firstIndex === index;
              })
              .map((row) => {
                let findCate = categoriesFlagCalc.find((d) => d.name.toLowerCase() === row.Category.toLowerCase() && d.project === productionoriginal.vendor.split('-')[0]);

                if (findCate) {
                  return {
                    ...row,
                    Category: findCate.name,
                    Rate: Number(findCate.flagmanualcalcorg), // Ensure this is a valid number
                  };
                } else {
                  return row;
                }
              });

            // Create a map of "Category" to "Unitrate" from the second sheet ("Details")
            data.forEach((row1) => {
              // Find the matching category in data2
              const matchedRow2 = FinalMatchData.find((row2) => row2.Category.toLowerCase() === row1.Category.toLowerCase());
              if (matchedRow2) {
                row1.trate = matchedRow2.Rate; // Copy Rate value to trate
              }
            });

            if (data.length === 0) {
              // Omit the Excel sheet if it has no values
              resolve(null);
              return;
            }

            function updateDupeStatus(arr, filename) {
              // Extract the base filename once
              const baseFilename = filename.split('.x')[0];

              // Create a map to track seen entries
              const seen = new Map();

              // Iterate over the array and update 'dupe' status
              arr.forEach((item, index) => {
                // let finalCategory = item["Category"].includes("BALANCING") ? item["Category"].split(" BALANCING")[0] : item["Category"];
                // Generate a unique key based on the object's fields
                const key = `${baseFilename}$${item['Category']}$${item.Date}$${item['User']}$${item['Unit Identifier'] ? item['Unit Identifier'] : ''}`;

                // Check if the key has been seen before
                if (seen.has(key)) {
                  // If seen, mark the current object as a duplicate
                  arr[index].filename = baseFilename;
                  arr[index].uniqueKey = key;
                  arr[index].dupe = 'yes';
                } else {
                  // If not seen, mark as not duplicate and add to seen map
                  arr[index].filename = baseFilename;
                  arr[index].uniqueKey = key;
                  arr[index].dupe = 'no';
                  seen.set(key, true);
                }
              });

              return arr;
            }

            const resultData = updateDupeStatus(data, file.name);

            setSelectedFiles((existingFiles) => [...existingFiles, file]);
            setSelectedFilesDatasDupe((existingFiles) => [...existingFiles, file]);

            resolve({ data: resultData, filename: file.name });
            setDataupdated('uploading');
            setCheckingSts('File Readed...');
          };

          fileReader.onerror = (error) => {
            reject(error);
          };
        });

        return promise;
      });

      Promise.all(promises)
        .then(async (allData) => {
          allData = allData.filter((item) => item != null);
          if (allData.length > 0) {
            setDataupdated('updating');

            setCheckingSts('Checking Duplicates');

            let fileLength = allData.length;
            let finalData = allData.map((d) => d.data).flat();

            const checkUnique = finalData.map((item) => item.uniqueKey);

            // const batchSize = checkUnique.length < 100 ? 50 : checkUnique.length < 500 ? 250 : checkUnique.length < 1000 ? 500 : checkUnique.length < 25000 ? 10000 : 25000;
            const batchSize = 25000;
            const batches = [];

            for (let i = 0; i < checkUnique.length; i += batchSize) {
              handleProgressUpdate(i, checkUnique.length);
              const batch = checkUnique.slice(i, i + batchSize);

              try {
                const response = await axios.post(
                  SERVICE.PRODUCTION_UPLOAD_OVERALL_FETCH_LIMITEDNEW,
                  {
                    checkunique: batch,
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${auth.APIToken}`,
                    },
                  }
                );
                // batches.push([...response.data.productionupload]);
                if (Array.isArray(response.data.productionupload)) {
                  batches.push(...response.data.productionupload);
                  handleProgressUpdate(i, checkUnique.length);
                } else {
                  // console.error("Response data is not an array:", response.data.productionupload);
                  console.error('Response data is not an array:');
                  // Handle error as needed
                }
              } catch (err) {
                handleApiError(err, setShowAlert, handleClickOpenerr);
              }
            }

            let dupeData = batches;

            setCheckUniqueDatas(dupeData);
            if (dupeData.length === 0) {
              const updatedAllData = allData.map((file) => {
                const updatedFileData = file.data.map((item) => {
                  let checkCategory = categoriesDatas.find((d) => d.name === item.filename && d.project === productionoriginal.vendor?.split('-')[0])?.keyword;

                  const keywords = Array.isArray(checkCategory) ? checkCategory : [];
                  for (let keyword of keywords) {
                    if (!item.Category.includes(keyword) && keyword) {
                      const balancingCategory = `${item.Category} ${keyword}`;
                      const match = file.data.find(
                        (otherItem) =>
                          otherItem.Category === balancingCategory &&
                          otherItem['Unit Identifier'] === item['Unit Identifier'] &&
                          otherItem.User === item.User &&
                          otherItem.Date === item.Date &&
                          otherItem.filename === item.filename &&
                          otherItem.uniqueKey !== item.uniqueKey
                      );

                      if (match) {
                        return { ...item, dupe: 'yes', reviewdupe: 'yes' };
                      }
                    }
                  }

                  return item;
                });

                return { ...file, data: updatedFileData };
              });

              const nonEmptySheets = updatedAllData;
              // const nonEmptySheets = allData;

              setExcelArray(nonEmptySheets);
              setOverallCount(finalData.length);

              if (['Details', 'Details 1'].includes(productionoriginal.sheetnumber)) {
                const findandupdate = finalData.filter((item, index, self) => index === self.findIndex((t) => t.filename === item.filename && t.Category === item.Category));

                // const removedupesSub = findandupdate.map((d) => ({
                //   filename: d.filename,
                //   Category: d.Category,
                // }));
                const removedupesSub = findandupdate.flatMap((d) => {
                  // Create an array with the current item
                  const items = [
                    {
                      filename: d.filename,
                      Category: d.Category,
                    },
                  ];

                  // Check if the filename matches and add "Snippet Verification" if true
                  if (d.filename === 'Snippet Verification') {
                    items.push({
                      filename: 'SmartZone Verify',
                      Category: d.Category,
                    });
                  }

                  return items; // Return the array of items
                });

                const removedupesCate = [...new Set(removedupesSub.map((d) => d.filename))];

                const projectall = productionoriginal.vendor?.split('-');
                const projectname = projectall[0];

                let res_Cate = await axios.post(SERVICE.PRODUCTION_CATEGORY_CHECK_PRODUPLOAD, {
                  headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                  },

                  project: projectname,
                  category: removedupesCate,
                });
                const categoriesData = res_Cate.data.categoryprod;

                let nonDuplicatescategory = removedupesCate
                  .map((data) => ({ ...data, project: projectname, name: data }))
                  .filter(
                    (ur) =>
                      !categoriesData.some((oldItem) => {
                        return projectname === oldItem.project && ur.name === oldItem.name;
                      })
                  );

                const nonDuplicatesWithAlternativeNamescate = nonDuplicatescategory.map((item) => {
                  return {
                    project: item.project,
                    name: item.name,
                    production: 'production',
                    flagstatus: 'No',
                    flagstatusorg: 'No',
                    flagstatustemp: 'No',
                    keyword: [],
                    enablepage: false,
                    flagmanualcalctemp: '',

                    flagmanualcalcorg: '',
                    addedby: [
                      {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                      },
                    ],
                  };
                });
                setNewCategories(nonDuplicatesWithAlternativeNamescate);

                let res_SubCate = await axios.post(SERVICE.PRODUCTION_SUBCATEGORY_CHECK_PRODUPLOAD, {
                  headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                  },

                  project: projectname,
                  subs: removedupesSub,
                });

                let nonDuplicatessubcategory = removedupesSub.filter(
                  (ur) =>
                    !res_SubCate.data.subcategoryprod.some((oldItem) => {
                      return projectname === oldItem.project && ur.filename === oldItem.categoryname && ur.Category === oldItem.name;
                    })
                );

                // console.log(nonDuplicatessubcategory, 'nonDuplicatessubcategory')

                const nonDuplicatesWithAlternativeNamessubcate = nonDuplicatessubcategory.map((item) => {
                  return {
                    project: projectname,
                    categoryname: item.filename,
                    name: item.Category,
                    mode: 'Allot',
                    production: 'production',
                    mismatchmode: ['Unit + Flag', 'Unit', 'Flag', 'Unit + Section'],
                    addedby: [
                      {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                      },
                    ],
                  };
                });

                setNewSubCategories(nonDuplicatesWithAlternativeNamessubcate);

                let res_Unitrate = await axios.post(SERVICE.PRODUCTION_UNITRATE_CHECK_PRODUPLOAD, {
                  headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                  },

                  project: projectname,
                  subs: removedupesSub,
                });
                let unitsRateData = res_Unitrate.data.unitsrate;

                const nonDuplicates = findandupdate.filter(
                  (ur) =>
                    !unitsRateData.some((oldItem) => {
                      return ur.Category === oldItem.subcategory && oldItem.category === ur.filename && projectname === oldItem.project;
                    })
                );

                let nonDuplicatesWithAlternativeNames = nonDuplicates.map((item) => {
                  let getfindflagsts = categoriesData.find((d) => projectname === d.project && d.name === item.filename);
                  let fingflagstsval = getfindflagsts && getfindflagsts.flagstatus ? getfindflagsts.flagstatus : 'No';
                  return {
                    project: projectname,
                    category: item.filename, // Make sure 'filenamelist' is defined somewhere
                    subcategory: item.Category,
                    orate: Number(item['Unit Rate']),
                    mrate: Number(item['Unit Rate']),
                    flagcount: 1,
                    trate: '',
                    flagstatus: fingflagstsval ? fingflagstsval : 'No',
                    conversion: '8.333333333333333',
                    points: (Number(item['Unit Rate']) * 8.333333333333333).toFixed(4),
                    oratelog: [
                      {
                        orate: Number(item['Unit Rate']),
                        trate: '',
                        filefrom: 'Original',
                        dateval: item.Date,
                        date: String(new Date()),
                        filename: item.filename,
                        vendor: productionoriginal.vendor,
                        name: String(companyname),
                      },
                    ],
                    addedby: [
                      {
                        name: String(isUserRoleAccess.companyname),
                        filename: item.filename,
                        date: String(new Date()),
                      },
                    ],
                  };
                });
                //REMOVE DUPLICATES BEFORE POSTCALL FOR UNIT RATE create POST
                // const RemovedDupcatefromOwnnonDuplicatesWithAlternativeNames = nonDuplicatesWithAlternativeNames.filter((item, index, self) => {
                //   return index === self.findIndex((t) => t.project === item.project && t.category === item.category && t.subcategory === item.subcategory);
                // });
                setNewUnitrates(nonDuplicatesWithAlternativeNames);

                // console.log(findandupdate, "findandupdate");
                //UPDATE UNITRATE TRATE LOG UPDATElet duplicatesFromUnitRateTrateUpdate =
                let duplicatesFromUnitRateTrateUpdateall = unitsRateData.filter((ur) => {
                  let matchObject = findandupdate.find((oldItem) => {
                    return ur.subcategory === oldItem.Category && ur.category === oldItem.filename && projectname === oldItem.project;
                  });
                  let getfindflagsts = categoriesData.find((d) => projectname === d.project && d.name === ur.category);
                  let fingflagstsval = getfindflagsts && getfindflagsts.flagstatus ? getfindflagsts.flagstatus : 'No';

                  if ((matchObject && (ur.orate === '' || ur.mrate === '' || ur.mrate === undefined || ur.mrate == null || ur.orate === undefined)) || (matchObject && fingflagstsval !== ur.flagstatus)) {
                    ur.orate = ur.trate;
                    ur.points = Number(ur.trate) * 8.333333333333333;
                    ur.mrate = ur.mrate === '' || ur.mrate === undefined || ur.mrate === null || ur.mrate === 0 ? ur.trate : ur.mrate;
                    // oldItem.filename = oldItem.filename;
                    // oldItem.Category = oldItem.Category;
                    ur.id = ur._id;
                    ur.flagstatus = fingflagstsval;
                    ur.oratelog = [
                      ...ur.oratelog,
                      {
                        orate: ur.trate,
                        trate: '',
                        filefrom: 'Original',
                        dateval: matchObject.Date,
                        date: String(new Date()),
                        filename: matchObject.filename,
                        vendor: productionoriginal.vendor,
                        name: String(isUserRoleAccess.companyname),
                      },
                    ];
                    ur.updatedby = [
                      ...matchObject.updatedby,
                      {
                        name: String(isUserRoleAccess.companyname),
                        filename: ur.category,
                        date: String(new Date()),
                      },
                    ];
                    return true; // Include ur in the filtered array
                  } else {
                    return false; // Exclude ur from the filtered array
                  }
                });

                let duplicatesFromUnitRateTrateUpdate = unitsRateData.filter((ur) => {
                  let matchObject = findandupdate.find((oldItem) => {
                    return projectname === ur.project && ur.subcategory === oldItem.Category && ur.category === 'SmartZone Verify' && oldItem.filename === 'Snippet Verification';
                  });
                  let getfindflagsts = categoriesData.find((d) => projectname === d.project && d.name === 'SmartZone Verify');
                  let fingflagstsval = getfindflagsts && getfindflagsts.flagstatus ? getfindflagsts.flagstatus : 'No';

                  if ((matchObject && (ur.orate === '' || ur.mrate === '' || ur.mrate === undefined || ur.mrate == null || ur.orate === undefined)) || (matchObject && fingflagstsval !== ur.flagstatus)) {
                    ur.orate = ur.trate; // Update the trate property of ur
                    ur.mrate = ur.mrate === '' || ur.mrate === undefined || ur.mrate === null || ur.mrate === 0 ? ur.trate : ur.mrate;
                    ur.points = ur.trate * 8.333333333333333;
                    // ur.filename = oldItem.filename;
                    // ur.Category = oldItem.Category;
                    ur.flagstatus = fingflagstsval;
                    ur.id = ur._id;
                    ur.oratelog = [
                      ...ur.oratelog,
                      {
                        orate: ur.trate,
                        trate: '',
                        filefrom: 'Original',
                        dateval: matchObject.Date,
                        date: String(new Date()),
                        filename: matchObject.filename,
                        vendor: productionoriginal.vendor,
                        name: String(isUserRoleAccess.companyname),
                      },
                    ];
                    ur.updatedby = [
                      ...ur.updatedby,
                      {
                        name: String(isUserRoleAccess.companyname),
                        filename: matchObject.filename,
                        date: String(new Date()),
                      },
                    ];
                    return true; // Include ur in the filtered array
                  } else {
                    return false; // Exclude ur from the filtered array
                  }
                });
                // console.log(duplicatesFromUnitRateTrateUpdate, "dfdfg");

                const duplicatesFromUnitRateTrateUpdateWithCateFlagsts = [...duplicatesFromUnitRateTrateUpdateall, ...duplicatesFromUnitRateTrateUpdate].filter((item, index, self) => {
                  return index === self.findIndex((t) => t.project === item.project && t.category === item.category && t.subcategory === item.subcategory);
                });
                setnewUnitratesTrate(duplicatesFromUnitRateTrateUpdateWithCateFlagsts);

                // console.log(duplicatesFromUnitRateTrateUpdateWithCateFlagsts, "duplicatesFromUnitRateTrateUpdateWithCateFlagsts");

                //UPDATE UNITRATE ORATE LOG UPDATE
                let duplicatesFromUnitRate = findandupdate.filter((oldItem) => {
                  return unitsRateData.some((ur) => {
                    const oldURate = Number(oldItem['Unit Rate']);

                    return (
                      projectname === ur.project &&
                      oldItem.Category === ur.subcategory &&
                      (ur.category === oldItem.filename || (oldItem.Category === 'Snippet Verification' && oldItem.filename === 'SmartZone Verify')) &&
                      Number(ur.orate) !== Number(oldURate)
                    );
                  });
                });

                const duplicatesFromUnitRateFinalORATELOG = duplicatesFromUnitRate.filter((oldItem) => {
                  let matchObject = unitsRateData.find((ur) => {
                    return projectname === ur.project && oldItem.Category === ur.subcategory && (ur.category === oldItem.filename || (oldItem.Category === 'Snippet Verification' && oldItem.filename === 'SmartZone Verify'));
                  });
                  let getfindflagsts = categoriesData.find((d) => projectname === d.project && oldItem.filename === d.name);

                  let fingflagstsval = getfindflagsts && getfindflagsts.flagstatus ? getfindflagsts.flagstatus : 'No';
                  if (matchObject) {
                    oldItem.orate = Number(oldItem['Unit Rate']); // Update the trate property of ur
                    oldItem.mrate = matchObject.mrate === '' ? Number(oldItem['Unit Rate']) : matchObject.mrate;
                    oldItem.points = Number(oldItem['Unit Rate']) * 8.333333333333333;
                    oldItem.flagstatus = fingflagstsval ? fingflagstsval : 'No';
                    oldItem.id = matchObject._id;
                    oldItem.oratelog = [
                      ...matchObject.oratelog,
                      {
                        orate: Number(oldItem['Unit Rate']),
                        trate: '',
                        filefrom: 'Original',
                        dateval: oldItem.Date,
                        date: String(new Date()),
                        filename: oldItem.filename,
                        vendor: productionoriginal.vendor,
                        name: String(companyname),
                      },
                    ];
                    oldItem.updatedby = [
                      ...matchObject.updatedby,
                      {
                        name: String(isUserRoleAccess.companyname),
                        filename: oldItem.filename,
                        date: String(new Date()),
                      },
                    ];
                    return true;
                  } else {
                    return false;
                  }
                });

                setnewUnitratesOratelog(duplicatesFromUnitRateFinalORATELOG);
              }
              setFileLength(fileLength);
              setDataupdated('uploaded');
            } else {
              const updatedAllData = allData.map((file) => {
                const updatedFileData = file.data.map((item) => {
                  let checkCategory = categoriesDatas.find((d) => d.name === item.filename && d.project === productionoriginal.vendor?.split('-')[0])?.keyword;

                  const keywords = Array.isArray(checkCategory) ? checkCategory : [];
                  for (let keyword of keywords) {
                    if (!item.Category.includes(keyword) && keyword) {
                      const balancingCategory = `${item.Category} ${keyword}`;
                      const match = file.data.find(
                        (otherItem) =>
                          otherItem.Category === balancingCategory &&
                          otherItem['Unit Identifier'] === item['Unit Identifier'] &&
                          otherItem.User === item.User &&
                          otherItem.Date === item.Date &&
                          otherItem.filename === item.filename &&
                          otherItem.uniqueKey !== item.uniqueKey
                      );

                      if (match) {
                        return { ...item, dupe: 'yes', reviewdupe: 'yes' };
                      }
                    }
                  }

                  return item;
                });

                return { ...file, data: updatedFileData };
              });

              const uniqueAllData = [];
              let filteredAlldata = updatedAllData.filter((d) => d != null);
              setAllDatas(filteredAlldata);
              setFileLength(filteredAlldata.length);

              for (let i = 0; i < filteredAlldata.length; i++) {
                const entry = filteredAlldata[i];
                handleProgressUpdate(i, filteredAlldata.length); // Assuming handleProgressUpdate is defined elsewhere
                const filename = entry.filename;
                const uniqueRecords = [];
                const processedKeys = []; // Track processed keys to avoid duplicates

                for (const record of entry.data) {
                  const key = `${record.uniqueKey}`;
                  if (!dupeData.some((item) => item.checkunique === key) && !processedKeys.includes(key)) {
                    uniqueRecords.push(record);
                    processedKeys.push(key);
                  } else {
                  }
                }
                const entryData = uniqueRecords.length === 0 ? null : { filename, data: uniqueRecords };
                uniqueAllData.push(entryData);
              }

              const nonEmptySheets = uniqueAllData.filter((result) => result !== null);
              // const nonEmptySheetsall = allData.filter((result) => result !== null);

              if (['Details', 'Details 1'].includes(productionoriginal.sheetnumber)) {
                const findandupdate = finalData.filter((item, index, self) => index === self.findIndex((t) => t.filename === item.filename && t.Category === item.Category));

                const removedupesSub = findandupdate.flatMap((d) => {
                  // Create an array with the current item
                  const items = [
                    {
                      filename: d.filename,
                      Category: d.Category,
                    },
                  ];

                  // Check if the filename matches and add "Snippet Verification" if true
                  if (d.filename === 'Snippet Verification') {
                    items.push({
                      filename: 'SmartZone Verify',
                      Category: d.Category,
                    });
                  }

                  return items; // Return the array of items
                });

                const removedupesCate = [...new Set(removedupesSub.map((d) => d.filename))];

                const projectall = productionoriginal.vendor?.split('-');
                const projectname = projectall[0];

                let res_Cate = await axios.post(SERVICE.PRODUCTION_CATEGORY_CHECK_PRODUPLOAD, {
                  headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                  },

                  project: projectname,
                  category: removedupesCate,
                });
                const categoriesData = res_Cate.data.categoryprod;

                let nonDuplicatescategory = removedupesCate
                  .map((data) => ({ ...data, project: projectname, name: data }))
                  .filter(
                    (ur) =>
                      !categoriesData.some((oldItem) => {
                        return projectname === oldItem.project && ur.name === oldItem.name;
                      })
                  );

                const nonDuplicatesWithAlternativeNamescate = nonDuplicatescategory.map((item) => {
                  return {
                    project: item.project,
                    name: item.name,
                    production: 'production',
                    flagstatus: 'No',
                    addedby: [
                      {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                      },
                    ],
                  };
                });
                setNewCategories(nonDuplicatesWithAlternativeNamescate);

                let res_SubCate = await axios.post(SERVICE.PRODUCTION_SUBCATEGORY_CHECK_PRODUPLOAD, {
                  headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                  },

                  project: projectname,
                  subs: removedupesSub,
                });

                let nonDuplicatessubcategory = removedupesSub.filter(
                  (ur) =>
                    !res_SubCate.data.subcategoryprod.some((oldItem) => {
                      return projectname === oldItem.project && ur.filename === oldItem.categoryname && ur.Category === oldItem.name;
                    })
                );

                // console.log(nonDuplicatessubcategory, 'nonDuplicatessubcategory')

                const nonDuplicatesWithAlternativeNamessubcate = nonDuplicatessubcategory.map((item) => {
                  return {
                    project: projectname,
                    categoryname: item.filename,
                    name: item.Category,
                    mode: 'Allot',
                    production: 'production',
                    mismatchmode: ['Unit + Flag', 'Unit', 'Flag', 'Unit + Section'],
                    addedby: [
                      {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                      },
                    ],
                  };
                });

                setNewSubCategories(nonDuplicatesWithAlternativeNamessubcate);

                let res_Unitrate = await axios.post(SERVICE.PRODUCTION_UNITRATE_CHECK_PRODUPLOAD, {
                  headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                  },

                  project: projectname,
                  subs: removedupesSub,
                });
                let unitsRateData = res_Unitrate.data.unitsrate;

                const nonDuplicates = findandupdate.filter(
                  (ur) =>
                    !unitsRateData.some((oldItem) => {
                      return ur.Category === oldItem.subcategory && oldItem.category === ur.filename && projectname === oldItem.project;
                    })
                );

                let nonDuplicatesWithAlternativeNames = nonDuplicates.map((item) => {
                  let getfindflagsts = categoriesData.find((d) => projectname === d.project && d.name === item.filename);
                  let fingflagstsval = getfindflagsts && getfindflagsts.flagstatus ? getfindflagsts.flagstatus : 'No';
                  return {
                    project: projectname,
                    category: item.filename, // Make sure 'filenamelist' is defined somewhere
                    subcategory: item.Category,
                    orate: Number(item['Unit Rate']),
                    mrate: Number(item['Unit Rate']),
                    flagcount: 1,
                    trate: '',
                    flagstatus: fingflagstsval ? fingflagstsval : 'No',
                    conversion: '8.333333333333333',
                    points: (Number(item['Unit Rate']) * 8.333333333333333).toFixed(4),
                    oratelog: [
                      {
                        orate: Number(item['Unit Rate']),
                        trate: '',
                        filefrom: 'Original',
                        dateval: item.Date,
                        date: String(new Date()),
                        filename: item.filename,
                        vendor: productionoriginal.vendor,
                        name: String(companyname),
                      },
                    ],
                    addedby: [
                      {
                        name: String(isUserRoleAccess.companyname),
                        filename: item.filename,
                        date: String(new Date()),
                      },
                    ],
                  };
                });
                //REMOVE DUPLICATES BEFORE POSTCALL FOR UNIT RATE create POST
                // const RemovedDupcatefromOwnnonDuplicatesWithAlternativeNames = nonDuplicatesWithAlternativeNames.filter((item, index, self) => {
                //   return index === self.findIndex((t) => t.project === item.project && t.category === item.category && t.subcategory === item.subcategory);
                // });
                setNewUnitrates(nonDuplicatesWithAlternativeNames);

                //UPDATE UNITRATE TRATE LOG UPDATElet duplicatesFromUnitRateTrateUpdate =
                let duplicatesFromUnitRateTrateUpdateall = unitsRateData.filter((ur) => {
                  let matchObject = findandupdate.find((oldItem) => {
                    return ur.subcategory === oldItem.Category && ur.category === oldItem.filename && projectname === oldItem.project;
                  });
                  let getfindflagsts = categoriesData.find((d) => projectname === d.project && d.name === ur.category);
                  let fingflagstsval = getfindflagsts && getfindflagsts.flagstatus ? getfindflagsts.flagstatus : 'No';

                  if ((matchObject && (ur.orate === '' || ur.mrate === '' || ur.mrate === undefined || ur.mrate == null || ur.orate === undefined)) || (matchObject && fingflagstsval !== ur.flagstatus)) {
                    ur.orate = ur.trate;
                    ur.points = Number(ur.trate) * 8.333333333333333;
                    ur.mrate = ur.mrate === '' || ur.mrate === undefined || ur.mrate === null || ur.mrate === 0 ? ur.trate : ur.mrate;
                    // oldItem.filename = oldItem.filename;
                    // oldItem.Category = oldItem.Category;
                    ur.id = ur._id;
                    ur.flagstatus = fingflagstsval;
                    ur.oratelog = [
                      ...ur.oratelog,
                      {
                        orate: ur.trate,
                        trate: '',
                        filefrom: 'Original',
                        dateval: matchObject.Date,
                        date: String(new Date()),
                        filename: matchObject.filename,
                        vendor: productionoriginal.vendor,
                        name: String(isUserRoleAccess.companyname),
                      },
                    ];
                    ur.updatedby = [
                      ...matchObject.updatedby,
                      {
                        name: String(isUserRoleAccess.companyname),
                        filename: ur.category,
                        date: String(new Date()),
                      },
                    ];
                    return true; // Include ur in the filtered array
                  } else {
                    return false; // Exclude ur from the filtered array
                  }
                });

                let duplicatesFromUnitRateTrateUpdate = unitsRateData.filter((ur) => {
                  let matchObject = findandupdate.find((oldItem) => {
                    return projectname === ur.project && ur.subcategory === oldItem.Category && ur.category === 'SmartZone Verify' && oldItem.filename === 'Snippet Verification';
                  });
                  let getfindflagsts = categoriesData.find((d) => projectname === d.project && d.name === 'SmartZone Verify');
                  let fingflagstsval = getfindflagsts && getfindflagsts.flagstatus ? getfindflagsts.flagstatus : 'No';

                  if ((matchObject && (ur.orate === '' || ur.mrate === '' || ur.mrate === undefined || ur.mrate == null || ur.orate === undefined)) || (matchObject && fingflagstsval !== ur.flagstatus)) {
                    ur.orate = ur.trate; // Update the trate property of ur
                    ur.mrate = ur.mrate === '' || ur.mrate === undefined || ur.mrate === null || ur.mrate === 0 ? ur.trate : ur.mrate;
                    ur.points = ur.trate * 8.333333333333333;
                    // ur.filename = oldItem.filename;
                    // ur.Category = oldItem.Category;
                    ur.flagstatus = fingflagstsval;
                    ur.id = ur._id;
                    ur.oratelog = [
                      ...ur.oratelog,
                      {
                        orate: ur.trate,
                        trate: '',
                        filefrom: 'Original',
                        dateval: matchObject.Date,
                        date: String(new Date()),
                        filename: matchObject.filename,
                        vendor: productionoriginal.vendor,
                        name: String(isUserRoleAccess.companyname),
                      },
                    ];
                    ur.updatedby = [
                      ...ur.updatedby,
                      {
                        name: String(isUserRoleAccess.companyname),
                        filename: matchObject.filename,
                        date: String(new Date()),
                      },
                    ];
                    return true; // Include ur in the filtered array
                  } else {
                    return false; // Exclude ur from the filtered array
                  }
                });
                const duplicatesFromUnitRateTrateUpdateWithCateFlagsts = [...duplicatesFromUnitRateTrateUpdateall, ...duplicatesFromUnitRateTrateUpdate].filter((item, index, self) => {
                  return index === self.findIndex((t) => t.project === item.project && t.category === item.category && t.subcategory === item.subcategory);
                });
                setnewUnitratesTrate(duplicatesFromUnitRateTrateUpdateWithCateFlagsts);
                // console.log(duplicatesFromUnitRateTrateUpdateWithCateFlagsts, 'duplicatesFromUnitRateTrateUpdateWithCateFlagsts')

                //UPDATE UNITRATE ORATE LOG UPDATE
                let duplicatesFromUnitRate = findandupdate.filter((oldItem) => {
                  return unitsRateData.some((ur) => {
                    const oldURate = Number(oldItem['Unit Rate']);

                    return (
                      projectname === ur.project &&
                      oldItem.Category === ur.subcategory &&
                      (ur.category === oldItem.filename || (oldItem.Category === 'Snippet Verification' && oldItem.filename === 'SmartZone Verify')) &&
                      Number(ur.orate) !== Number(oldURate)
                    );
                  });
                });

                const duplicatesFromUnitRateFinalORATELOG = duplicatesFromUnitRate.filter((oldItem) => {
                  let matchObject = unitsRateData.find((ur) => {
                    return projectname === ur.project && oldItem.Category === ur.subcategory && (ur.category === oldItem.filename || (oldItem.Category === 'Snippet Verification' && oldItem.filename === 'SmartZone Verify'));
                  });
                  let getfindflagsts = categoriesData.find((d) => projectname === d.project && oldItem.filename === d.name);

                  let fingflagstsval = getfindflagsts && getfindflagsts.flagstatus ? getfindflagsts.flagstatus : 'No';
                  if (matchObject) {
                    oldItem.orate = Number(oldItem['Unit Rate']); // Update the trate property of ur
                    oldItem.mrate = matchObject.mrate === '' ? Number(oldItem['Unit Rate']) : matchObject.mrate;
                    oldItem.points = Number(oldItem['Unit Rate']) * 8.333333333333333;
                    oldItem.flagstatus = fingflagstsval ? fingflagstsval : 'No';
                    oldItem.id = matchObject._id;
                    oldItem.oratelog = [
                      ...matchObject.oratelog,
                      {
                        orate: Number(oldItem['Unit Rate']),
                        trate: '',
                        filefrom: 'Original',
                        dateval: oldItem.Date,
                        date: String(new Date()),
                        filename: oldItem.filename,
                        vendor: productionoriginal.vendor,
                        name: String(companyname),
                      },
                    ];
                    oldItem.updatedby = [
                      ...matchObject.updatedby,
                      {
                        name: String(isUserRoleAccess.companyname),
                        filename: oldItem.filename,
                        date: String(new Date()),
                      },
                    ];
                    return true;
                  } else {
                    return false;
                  }
                });

                setnewUnitratesOratelog(duplicatesFromUnitRateFinalORATELOG);
              }

              setUniqueDatas(nonEmptySheets);
              setAllDatas(filteredAlldata);
              setFileLength(filteredAlldata.length);
              setUniqueFileLength(uniqueAllData.length);
              setShowDupeAlert(dupeData);
              handleClickOpenDupe();
            }
          } else {
            setFileLength(0);
            setDataupdated('');
            setExcelArray([]);
            setProgress(0);
          }
        })
        .catch((error) => {
          // Handle errors here
          console.error('Error processing promises:', error);
          setFileLength(0);
          setDataupdated('');
          setExcelArray([]);
          setProgress(0);
        });
    }
  };
  // console.log(selectedFilesDatas, "selectedFilesDatas");

  const [overallCount, setOverallCount] = useState(0);
  const handleProgressUpdate = (index, files) => {
    const newProgress = ((index / (files - 1)) * 100).toFixed(0);

    setProgress(isNaN(newProgress) ? 1 : newProgress);
  };

  const [chunkSize, setChunksize] = useState(0);

  const sendJSON = async () => {
    const now = new Date();
    let today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    let formattedDate = dd + '/' + mm + '/' + yyyy;
    let formattedDate1 = dd + mm + yyyy;
    let fileuploaddate = new Date(productionoriginal.fromdate);
    var filedd = String(fileuploaddate.getDate()).padStart(2, '0');
    var filemm = String(fileuploaddate.getMonth() + 1).padStart(2, '0');
    var fileyyyy = fileuploaddate.getFullYear();
    let fileformatdate = dd + mm + yyyy;
    const uniqueId = uuidv4();
    setDataupdated('');
    setSubmitAction('start');
    setProgressbar(1);
    handleOpenLoadingMessage('', 0);

    const productionuploaddata = [
      {
        uniqueid: productionoriginalid ? productionoriginalid + 1 : 1,
        vendor: productionoriginal.vendor,
        fromdate: productionoriginal.fromdate,
        todate: productionoriginal.todate,
        datetimezone: productionoriginal.datetimezone,
        yeardrop: yeardrop,
        monthdrop: monthdrop,
        datedrop: datedrop,
        symboldrop: symboldrop,
        overallcount: overallCount,
        hoursdrop: hoursdrop,
        createddate: formattedDate + ' ' + now.toLocaleTimeString(),
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            companyname: String(companyname),
            date: String(new Date()),
          },
        ],
      },
    ];

    const handleFileProcessing = (file, fileDataFromExcelArray) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });

            const sheetName = ['Details', 'Details 1', productionoriginal.sheetnumber];

            const sheetKey = Object.keys(workbook.Sheets).find((key) => sheetName.some((name) => key.includes(name)));
            // let wsname = sheetKey ? workbook.Sheets[sheetKey] : workbook.SheetNames[0];

            // Find the sheet named "Details"
            // const detailsSheetName = workbook.SheetNames.find((sheetName) => ['Details', 'Details 1'].includes(sheetName));
            // console.log(workbook.SheetNames, 'detailsSheetName');

            if (['Details', 'Details 1'].includes(productionoriginal.sheetnumber)) {
              const headersExl = ['Category', 'Unit Identifier', 'User', 'Date', 'Unit Rate', 'Flag Count'];

              // Rename the sheet to "Details"
              const updatedSheetKey = 'Details';
              if (sheetKey !== updatedSheetKey) {
                // Clone and rename the sheet
                workbook.Sheets[updatedSheetKey] = workbook.Sheets[sheetKey];
                delete workbook.Sheets[sheetKey];

                // Update the workbook's SheetNames array
                const sheetIndex = workbook.SheetNames.indexOf(sheetKey);
                if (sheetIndex !== -1) {
                  workbook.SheetNames[sheetIndex] = updatedSheetKey;
                }
              }

              // Prepare the data array to replace the "Details" sheet
              const arrayOfArrays = [
                headersExl,
                ...fileDataFromExcelArray
                  .map((d) => {
                    const resultObjectCate = categories.find((i) => i.project === productionoriginal.vendor.split('-')[0] && i.name === d.filename);
                    let flagstatusorgval = resultObjectCate && resultObjectCate.flagstatusorg ? resultObjectCate.flagstatusorg : 'No';
                    let flagstatusval = resultObjectCate && resultObjectCate.flagstatus ? resultObjectCate.flagstatus : 'No';
                    let flagcalc = flagstatusorgval === 'Yes' ? Math.round(Number(d['Unit Rate']) / Number(d.trate)) : d['Flag Count'] === undefined ? 1 : d['Flag Count'];

                    return {
                      ...d,
                      'Flag Count': flagcalc,
                      'Unit Rate': flagstatusorgval === 'Yes' ? d.trate : d['Unit Rate'],
                      dupe: checkUniqueDatas.map((d) => d.checkunique).includes(d.uniqueKey) || d.dupe === 'yes' ? 'Yes' : 'No',
                    };
                  })
                  .filter((d) => d.dupe === 'No')
                  .map((obj) => headersExl.map((header) => obj[header])),
              ];
              const updatedSheet = XLSX.utils.aoa_to_sheet(arrayOfArrays);

              // Replace the "Details" sheet with the updated data
              workbook.Sheets[updatedSheetKey] = updatedSheet;

              // Generate a new file with the updated workbook
              const updatedWorkbookData = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
              const updatedFile = new File([updatedWorkbookData], file.name, { type: file.type });

              resolve(updatedFile); // Resolve with the updated file
            } else {
              // const updatedFile = new File([], file.name, { type: file.type });
              // resolve(updatedFile);
              // console.error('The workbook does not contain a sheet named "Details".');
              // // reject(new Error('The workbook does not contain a sheet named "Details".'));

              // Find the sheet named "Details"
              const detailsSheetName = workbook.SheetNames[0];

              if (detailsSheetName) {
                const worksheet = workbook.Sheets[detailsSheetName];
                const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                const headersExl = ['Category', 'Unit Identifier', 'User', 'Date', 'Unit Rate', 'Flag Count'];

                // Find the index of the second heading
                const secondHeadingIndex = sheetData.findIndex((row) => row[0] === headersExl[0] && row[1] === headersExl[1] && row[2] === headersExl[2] && row[3] === headersExl[3] && row[4] === headersExl[4]);

                if (secondHeadingIndex !== -1) {
                  // Prepare the data array to replace the section under the second heading
                  const updatedData = [
                    headersExl,
                    ...fileDataFromExcelArray
                      .map((d) => {
                        const resultObjectCate = categories.find((i) => i.project === productionoriginal.vendor.split('-')[0] && i.name === d.filename);
                        let flagstatustempval = resultObjectCate && resultObjectCate.flagstatustemp ? resultObjectCate.flagstatustemp : 'No';
                        let flagstatusval = resultObjectCate && resultObjectCate.flagstatus ? resultObjectCate.flagstatus : 'No';
                        let flagcalc = flagstatusval === 'Yes' || flagstatustempval === 'Yes' ? Number(d['Unit Rate']) / Number(d.trate) : 1;
                        return {
                          ...d,
                          'Unit Rate': Number(d.trate),
                          'Flag Count': Math.round(flagcalc),
                          dupe: checkUniqueDatas.map((d) => d.checkunique).includes(d.uniqueKey) || d.dupe === 'yes' ? 'Yes' : 'No',
                        };
                      })
                      .filter((d) => d.dupe === 'No') // Remove entries that have duplicates marked as "Yes"
                      .map((obj) => headersExl.map((header) => obj[header])),
                  ];

                  // Clear the rows after the second heading before inserting the new data
                  sheetData.splice(secondHeadingIndex, sheetData.length - secondHeadingIndex);

                  // Add the updated data below the second heading
                  sheetData.push(...updatedData);

                  // Convert the updated data back into a sheet
                  const updatedSheet = XLSX.utils.aoa_to_sheet(sheetData);

                  // Replace the "Details" sheet with the updated data
                  workbook.Sheets[detailsSheetName] = updatedSheet;

                  // Generate a new file with the updated workbook
                  const updatedWorkbookData = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
                  const updatedFile = new File([updatedWorkbookData], file.name, { type: file.type });

                  resolve(updatedFile); // Resolve with the updated file
                } else {
                  console.error('Second heading not found in the sheet.');
                  reject(new Error('Second heading not found in the sheet.'));
                }
              }
            }
          } catch (error) {
            console.error('Error processing file:', error);
            reject(error);
          }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsArrayBuffer(file);
      });
    };

    const updatedFilesPromises = selectedFilesDatasDupe.map((file) => {
      // Find the corresponding data in excelArray for the current file
      const fileDataFromExcelArray = excelArray.find((excelData) => excelData.filename === file.name) ? excelArray.find((excelData) => excelData.filename === file.name).data : [];

      if (fileDataFromExcelArray) {
        // Process the file only if corresponding data is found in excelArray
        return handleFileProcessing(file, fileDataFromExcelArray);
      } else {
        console.error(`No matching data found in excelArray for file: ${file.name}`);
        return Promise.resolve(null); // Return null if no matching data is found
      }
    });

    const updatedFiles = await Promise.all(updatedFilesPromises);

    // Filter out any null values in case some files didn't have matching data
    const filteredUpdatedFiles = updatedFiles.filter((file) => file !== null);

    // setSelectedFilesDatas((existingFiles) => [...existingFiles, ...filteredUpdatedFiles]);

    if (excelArray.length > 0) {
      try {
        const productionResponse = await axios.post(SERVICE.PRODUCTION_ORGINAL_CREATE, productionuploaddata, {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
          },
        });

        // CATEGORY ADD
        if (newCategories.length > 0) {
          const responsecate = await axios.post(SERVICE.CATEGORYPROD_CREATE, newCategories, {
            headers: {
              'Content-Type': 'application/json;charset=UTF-8',
            },
          });
        }
        //SUBCATEGORY ADD
        if (newSubCategories.length > 0) {
          const responsecatesub = await axios.post(SERVICE.SUBCATEGORYPROD_CREATE, newSubCategories, {
            headers: {
              'Content-Type': 'application/json;charset=UTF-8',
            },
          });
        }
        if (newUnitrates.length > 0) {
          const responseunit = await axios.post(SERVICE.PRODUCTION_UNITRATE_CREATE, newUnitrates, {
            headers: {
              'Content-Type': 'application/json;charset=UTF-8',
            },
          });
        }
        if (newUnitratesTrate.length > 0) {
          await Promise.all(
            newUnitratesTrate.map(async (item) => {
              try {
                await axios.put(
                  `${SERVICE.PRODUCTION_UNITRATE_SINGLE}/${item.id}`,
                  {
                    mrate: item.mrate,
                    orate: item.orate,
                    points: item.points,
                    flagstatus: item.flagstatus,
                    updatedby: item.updatedby,
                  },
                  {
                    headers: {
                      'Content-Type': 'application/json;charset=UTF-8',
                    },
                  }
                );
              } catch (err) {
                handleApiError(err, setShowAlert, handleClickOpenerr);
              }
            })
          );
        }
        if (newUnitratesOratelog.length > 0) {
          await Promise.all(
            newUnitratesOratelog.map(async (item) => {
              try {
                await axios.put(
                  `${SERVICE.PRODUCTION_UNITRATE_SINGLE}/${item.id}`,
                  {
                    mrate: String(item.mrate),
                    orate: String(item.orate),
                    flagstatus: item.flagstatus,
                    points: item.points,
                    updatedby: item.updatedby,
                    oratelog: item.oratelog,
                  },
                  {
                    headers: {
                      'Content-Type': 'application/json;charset=UTF-8',
                    },
                  }
                );
              } catch (err) {
                handleApiError(err, setShowAlert, handleClickOpenerr);
              }
            })
          );
        }
        if (productionResponse.statusText === 'OK') {
          const uploadData = async (filename, items, index, onProgress) => {
            setProgressbar(0);
            const batchSize = items.length < 10000 ? items.length : 10000;
            const totalItems = items.length;
            const totalBatches = Math.ceil(totalItems / batchSize);

            for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
              const startIdx = batchIndex * batchSize;
              const endIdx = Math.min((batchIndex + 1) * batchSize, totalItems);
              setChunksize(index);

              const batchItems = items.slice(startIdx, endIdx);

              const batchRequestBody = batchItems.map((item) => {
                const [uploaddate, uploadtime] = item['Date'].split(' ');
                // Given CST date and time
                const cstDate = new Date(`${uploaddate}T${uploadtime}`);

                // Function to add hours and minutes to a date
                function addTime(date, hours, minutes) {
                  // Add hours
                  date.setHours(date.getHours() + hours);
                  // Add minutes
                  date.setMinutes(date.getMinutes() + minutes);
                  return date;
                }

                // Add 10 hours and 30 minutes
                const resultDate = addTime(cstDate, 10, 30);

                // Format the result to "YYYY-MM-DD HH:MM:SS"
                function formatDate(date) {
                  const year = date.getFullYear();
                  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
                  const day = String(date.getDate()).padStart(2, '0');
                  const hours = String(date.getHours()).padStart(2, '0');
                  const minutes = String(date.getMinutes()).padStart(2, '0');
                  const seconds = String(date.getSeconds()).padStart(2, '0');

                  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
                }

                const formattedResult = formatDate(resultDate);
                // const storedSheetNameJSON = localStorage.getItem('sheetname');

                let timString = ['Details', 'Details 1'].includes(productionoriginal.sheetnumber) ? `${item.Date.split(' ')[0]}T${item.Date.split(' ')[1]}` : `${(formattedResult + ' IST').split(' ')[0]}T${(formattedResult + ' IST').split(' ')[1]}`;
                // Convert to a Date object
                let dateStringPlus530 = new Date(timString);

                // Add 5 hours and 30 minutes
                dateStringPlus530.setHours(dateStringPlus530.getHours() + 5);
                dateStringPlus530.setMinutes(dateStringPlus530.getMinutes() + 30);

                // Format the result back to a string in the desired format
                let yearPlus530 = dateStringPlus530.getFullYear();
                let monthPlus530 = String(dateStringPlus530.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
                let dayPlus530 = String(dateStringPlus530.getDate()).padStart(2, '0');
                let hoursPlus530 = String(dateStringPlus530.getHours()).padStart(2, '0');
                let minutesPlus530 = String(dateStringPlus530.getMinutes()).padStart(2, '0');
                let secondsPlus530 = String(dateStringPlus530.getSeconds()).padStart(2, '0');

                let resultPlus530 = `${yearPlus530}-${monthPlus530}-${dayPlus530}T${hoursPlus530}:${minutesPlus530}:${secondsPlus530}`;
                const getUniqueid = productionoriginalid ? productionoriginalid + 1 : 1;

                const resultObjectCate = categories.find((i) => i.project === productionoriginal.vendor.split('-')[0] && i.name === item.filename);
                let flagstatusorgval = resultObjectCate && resultObjectCate.flagstatusorg ? resultObjectCate.flagstatusorg : 'No';
                let flagstatusval = resultObjectCate && resultObjectCate.flagstatus ? resultObjectCate.flagstatus : 'No';
                let flagcalc = flagstatusorgval === 'Yes' || (productionoriginal.sheetnumber == 1 && flagstatusval === 'Yes') ? Math.round(Number(item['Unit Rate']) / Number(item.trate)) : item['Flag Count'] === undefined ? 1 : item['Flag Count'];

                return {
                  // category: item["Category"],
                  unitid: item['Unit Identifier'],
                  user: item['User'],
                  unitrate: flagstatusorgval === 'Yes' || (productionoriginal.sheetnumber == 1 && flagstatusval === 'Yes') ? item.trate : Number(item['Unit Rate']),
                  olddateval: item.Date,
                  dateval: ['Details', 'Details 1'].includes(productionoriginal.sheetnumber) ? item.Date : formattedResult + ' IST',

                  vendor: productionoriginal.vendor,
                  fromdate: productionoriginal.fromdate,
                  todate: productionoriginal.todate,
                  formatteddate: ['Details', 'Details 1'].includes(productionoriginal.sheetnumber) ? item.Date.split(' ')[0] : (formattedResult + ' IST').split(' ')[0],
                  formattedtime: ['Details', 'Details 1'].includes(productionoriginal.sheetnumber) ? item.Date.split(' ')[1] : (formattedResult + ' IST').split(' ')[1],
                  dateobjformatdate: resultPlus530,

                  datetimezone: productionoriginal.datetimezone,
                  // flagcount: item["Flag Count"] === undefined ? 1 : item["Flag Count"],
                  // flagstatus: item["Flag Count"] === undefined ? "No" : "Yes",
                  // flagcount: Math.round(flagcalc),
                  flagcount: flagcalc,
                  flagstatus: flagstatusval || flagstatusorgval ? 'Yes' : 'No',
                  yeardrop: yeardrop,
                  monthdrop: monthdrop,
                  datedrop: datedrop,
                  reviewdupe: item.reviewdupe,
                  trate: '',
                  symboldrop: symboldrop,
                  hoursdrop: hoursdrop,

                  category: item['Category'],
                  // checkunique: `${item["Category"]} ${item.Date + item["User"]} ${item["Unit Identifier"] ? item["Unit Identifier"] : ""}`,
                  checkunique: item.uniqueKey,
                  uniqueid: getUniqueid,
                  filename: filename,
                  dupe: item.dupe,
                  filenameupdated: item.filename,
                  filenamenew: `${getUniqueid}$${uniqueId}$org$${filename}`,
                  addedby: [
                    {
                      name: String(isUserRoleAccess.companyname),
                      filename: filename,
                      date: String(new Date()),
                    },
                  ],
                };
              });

              try {
                if (batchRequestBody.length > 0) {
                  if (batchRequestBody.length > 0) {
                    // const res = await fetch(SERVICE.PRODUCTION_UPLOAD_CREATE, {
                    //   method: "POST",
                    //   headers: {
                    //     "Content-Type": "application/json;charset=UTF-8",
                    //   },
                    //   body: JSON.stringify(batchRequestBody),
                    // });
                    const res = await axios.post(SERVICE.PRODUCTION_UPLOAD_CREATE, batchRequestBody, {
                      headers: {
                        'Content-Type': 'application/json;charset=UTF-8',
                      },
                    });
                  }
                }
              } catch (err) {
                handleApiError(err, setShowAlert, handleClickOpenerr);
              }

              const percentComplete = Number(((index * totalBatches + batchIndex + 1) / (excelArray.length * totalBatches)) * 100);
              const indFileProgressval = Number(((batchIndex + 1) / totalBatches) * 100);

              onProgress(filename, percentComplete, indFileProgressval); // Callback for real-time progress
            }
          };

          const uploadAllFiles = async () => {
            // Upload files one by one
            for (let index = 0; index < excelArray.length; index++) {
              const item = excelArray[index];
              const filename = item.filename;

              const items = item.data.map((d) => ({
                ...d,
                dupe: checkUniqueDatas.map((d) => d.checkunique).includes(d.uniqueKey) || d.dupe === 'yes' ? 'Yes' : 'No',
              }));

              await uploadData(filename, items, index, (filename, progress, indFileProgress) => {
                // Log real-time progress
                // console.log(`${filename} progress: ${progress}`);
                let value = index + 1 + ')  ' + filename + ' - ' + indFileProgress.toFixed(2) + '%';
                handleOpenLoadingMessage(value, progress);
              });
            }
            await handleFileUpload(fileformatdate, uniqueId);
            await handleFileUploadSecond(fileformatdate, uniqueId, filteredUpdatedFiles);
            // Log completion message after the loop ends
            handleCloseLoadingMessage();
            setCheckingSts('');
            setFileLength(0);
            setExcelArray([]);
            setCompleteOpen(false);
            setSubmitAction('');
            setProgressbar(0);
            setExcelArray([]);
            setCheckingSts('');
            setFileLength();
            readExcel([]);
            setDataupdated('');

            setgetDates([]);
            setprogfinal('');
            setProgress(0);
            setChunksize(0);

            await fetchProductionoriginal();
            await fetchUploads();

            // setPopupContent("Uploaded Successfully");
            // setPopupSeverity("success");
            // handleClickOpenPopup();
            setShowAlert('Uploaded Successfully');
            handleCompleteClickOpenerr();
            // await fetchUnitRate();
            // await fetchExcelCategory();
            // await fetchExcelSubCategory();
          };
          localStorage.removeItem('sheetname');
          // Call the function to upload all files
          uploadAllFiles();
        } else {
          console.error('Error uploading production data:', productionResponse.statusText);
          handleApiError(productionResponse.statusText, setShowAlert, handleClickOpenerr);
        }
      } catch (err) {
        handleApiError(err, setShowAlert, handleClickOpenerr);
      }
    } else {
      setPopupContentMalert('No data to Upload');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    }
  };

  const handleFileUpload = async (date, uniqueId) => {
    if (!selectedFiles || selectedFiles.length === 0) {
      console.log('Please select one or more files to upload.');
      // return;
    }
    let getuniqudid = productionoriginalid ? productionoriginalid + 1 : 1;

    const uploadFiles = async () => {
      for (const selectedFile of selectedFiles) {
        const chunkSize = 5 * 1024 * 1024; // 5MB (adjust based on your requirements)
        const totalChunks = Math.ceil(selectedFile.size / chunkSize);
        const chunkProgress = 100 / totalChunks;
        let chunkNumber = 0;
        let start = 0;
        let end = 0;

        const uploadNextChunk = async () => {
          if (end < selectedFile.size) {
            end = start + chunkSize;
            if (end > selectedFile.size) {
              end = selectedFile.size;
            }

            const chunk = selectedFile.slice(start, end, selectedFile.type);
            const formData = new FormData();
            formData.append('file', chunk);
            formData.append('chunkNumber', chunkNumber);
            formData.append('totalChunks', totalChunks);
            formData.append('filesize', selectedFile.size);
            formData.append('originalname', `${getuniqudid}$${uniqueId}$org$${selectedFile.name}`);

            try {
              const response = await axios.post(SERVICE.EXCELFILEUPLOADSTORE, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              });

              const temp = `Chunk ${chunkNumber + 1}/${totalChunks} uploaded successfully for ${selectedFile.name}`;

              start = end;
              chunkNumber++;

              uploadNextChunk();
            } catch (err) {
              handleApiError(err, setShowAlert, handleClickOpenerr);
            }
          } else {
            // setProgress(100);
            // console.log(`File upload completed for ${selectedFile.name}`);
          }
        };

        await uploadNextChunk();
      }
      setSelectedFiles([]);
      console.log('All file uploads completed');
    };

    uploadFiles();
  };
  const handleFileUploadSecond = async (date, uniqueId, allfiles) => {
    if (!allfiles || allfiles.length === 0) {
      console.log('Please select one or more files to upload.');
    }
    let getuniqudid = productionoriginalid ? productionoriginalid + 1 : 1;

    const uploadFiles = async () => {
      for (const selectedFile of allfiles) {
        const chunkSize = 5 * 1024 * 1024; // 5MB (adjust based on your requirements)
        const totalChunks = Math.ceil(selectedFile.size / chunkSize);
        const chunkProgress = 100 / totalChunks;
        let chunkNumber = 0;
        let start = 0;
        let end = 0;

        const uploadNextChunk = async () => {
          if (end < selectedFile.size) {
            end = start + chunkSize;
            if (end > selectedFile.size) {
              end = selectedFile.size;
            }

            const chunk = selectedFile.slice(start, end, selectedFile.type);
            const formData = new FormData();
            formData.append('file', chunk);
            formData.append('chunkNumber', chunkNumber);
            formData.append('totalChunks', totalChunks);
            formData.append('filesize', selectedFile.size);
            formData.append('originalname', `${getuniqudid}$${uniqueId}$orgWtDupe$${selectedFile.name}`);

            try {
              const response = await axios.post(SERVICE.EXCELFILEUPLOADSTORE, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              });

              const temp = `Chunk ${chunkNumber + 1}/${totalChunks} uploaded successfully for ${selectedFile.name}`;

              start = end;
              chunkNumber++;

              uploadNextChunk();
            } catch (err) {
              handleApiError(err, setShowAlert, handleClickOpenerr);
            }
          } else {
            // setProgress(100);
            // console.log(`File upload completed for ${selectedFile.name}`);
          }
        };

        await uploadNextChunk();
      }
      setSelectedFilesDatas([]);
      console.log('All file uploads completed');
    };

    uploadFiles();
  };

  // Function to fetch the existing production data
  const fetchProductionoriginal = async () => {
    try {
      let res_vendor = await axios.get(SERVICE.PRODUCTION_ORGINAL_LIMITED_LASTTHREE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setProductionsOriginal(res_vendor?.data?.productionoriginal);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //get all Sub vendormasters.
  const fetchVendors = async () => {
    try {
      const [res_vendor, RES_CATE, RES_PROD_CATE, RES_ORG_FLAGCALC] = await Promise.all([
        axios.get(SERVICE.VENDORMASTER, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
        axios.get(SERVICE.CATEGORYPROD_LIMITED_UPLOAD, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),

        axios.get(SERVICE.CATEGORYPROD_LIMITED_ORIGINAL, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
        axios.get(SERVICE.CATEGORYPROD_LIMITED_ORIGINAL_FLAGCALC, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
      ]);

      let vendorall = res_vendor?.data?.vendormaster.map((d) => ({
        ...d,
        label: d.projectname + '-' + d.name,
        value: d.projectname + '-' + d.name,
      }));
      const categoriesData = RES_CATE.data.categoryprod;
      setCategoriesDatas(categoriesData);

      setCategories(RES_PROD_CATE?.data?.categoryprod);
      setCategoriesFlagCalc(RES_ORG_FLAGCALC?.data?.categoryprod);
      setVendors(vendorall);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    count: true,
    filename: true,
    category: true,
    subcategory: true,
    date: true,
    user: true,
    unitid: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = showDupeAlert?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
      category: item.checkunique.split('$')[0],
      subcategory: item.checkunique.split('$')[1],
      date: item.checkunique.split('$')[2],
      user: item.checkunique.split('$')[3],
      unitid: item.checkunique.split('$')[4],
    }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [showDupeAlert]);

  //Datatable
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
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

  const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);

  const totalPages = Math.ceil(filteredDatas.length / pageSize);

  const visiblePages = Math.min(totalPages, 3);

  const firstVisiblePage = Math.max(1, page - 1);
  const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

  const pageNumbers = [];

  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  }

  const columnDataTable = [
    {
      field: 'serialNumber',
      headerName: 'SNo',
      flex: 0,
      width: 70,
      hide: !columnVisibility.serialNumber,
      headerClassName: 'bold-header',
    },
    { field: 'category', headerName: 'Category', flex: 0, width: 250, hide: !columnVisibility.category, headerClassName: 'bold-header' },
    { field: 'subcategory', headerName: 'Subcategory', flex: 0, width: 400, hide: !columnVisibility.subcategory, headerClassName: 'bold-header' },
    { field: 'date', headerName: 'Date', flex: 0, width: 180, hide: !columnVisibility.date, headerClassName: 'bold-header' },
    { field: 'user', headerName: 'Login id', flex: 0, width: 100, hide: !columnVisibility.user, headerClassName: 'bold-header' },
    { field: 'unitid', headerName: 'Identifer Name', flex: 0, width: 200, hide: !columnVisibility.unitid, headerClassName: 'bold-header' },
  ];

  const rowDataTable = filteredData.map((item, index) => {
    return {
      ...item,
      id: item.serialNumber,
      // serialNumber: item.serialNumber,
      // count: item.checkunique,
      // filename: item.filename,
    };
  });

  useEffect(() => {
    fetchProductionoriginal();
    fetchVendors();
  }, []);

  const clearFileSelection = () => {
    setExcelArray([]);
    setFileLength();
    setDataupdated('');
    setSelectedFiles([]);
    setSelectedFilesDatas([]);
    setProgress(0);
    setgetDates([]);
    setSubmitAction('');
  };

  const clearAll = () => {
    setProductionoriginal({ ...productionoriginal, vendor: 'Please Select Vendor', fromdate: '', todate: '', datetimezone: 'India Standard Time' });
    setYeardrop('yyyy');
    setMonthdrop('MM');
    setDatedrop('dd');
    setSymboldrop('-');
    setHoursdrop('24 Hours');
    setExcelArray([]);
    setFileLength();
    setDataupdated('');
    setSelectedFiles([]);
    setSubmitAction('');
    setgetDates([]);
    setprogfinal('');
    setProgress(0);
    setChunksize(0);
  };

  return (
    <Box>
      <Headtitle title={'Production Original Upload'} />
      <PageHeading title=" Production Original Upload" modulename="Production" submodulename="Upload" mainpagename="Original" subpagename="Production Original Upload" subsubpagename="" />
      {/* ****** Header Content ****** */}
      {/* <Typography sx={userStyle.HeaderText}>Production Original Upload</Typography> */}
      {isUserRoleCompare?.includes('aproductionoriginalupload') && (
        <>
          <Box sx={userStyle.dialogbox}>
            <>
              <Grid container>
                <Grid item md={3.5} sm={8} xs={12}>
                  <Typography sx={userStyle.importheadtext}>Manage Production Original Upload</Typography>
                </Grid>
                <Grid item md={6.8} sm={12} xs={12} sx={{ border: '1px solid #3cbbb333', borderRadius: '4px' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      backgroundColor: '#eef8f7',
                      borderLeft: '4px solid #00a69c',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      margin: 0,

                      // maxWidth: '500px',
                    }}
                  >
                    {/* Icon */}
                    <Box sx={{ display: { sm: 'none', xs: 'none', md: 'flex' }, marginRight: '10px', color: '#00a69c', fontSize: 24 }}>
                      <TipsAndUpdatesTwoToneIcon fontSize="large" />
                    </Box>

                    {/* Text */}
                    <Box sx={{ width: '100%' }}>
                      <Tooltip TransitionComponent={Zoom} arrow placement="top" sx={{ margin: '0px' }} title="Last Four Uploaded Data">
                        <>
                          {[...[{ vendor: 'Vendor', fromdate: 'From-To-Date', percent: '%', createddate: 'CreatedDate', addedby: [{ name: 'Added By' }] }], ...productionsOriginal].map((item, ind) => {
                            return (
                              <Grid container spacing={1}>
                                <Grid item md={2.5} sm={2.5} xs={2.5} sx={{ wordBreak: 'break-all' }}>
                                  <Typography sx={{ fontSize: item.vendor === 'Vendor' ? '12px' : '10px' }}>{item.vendor === 'Vendor' ? 'Vendor' : `${ind}). ${item.vendor}`}</Typography>
                                </Grid>
                                <Grid item md={2.5} sm={2.5} xs={2.5} sx={{ wordBreak: 'break-all' }}>
                                  <Typography sx={{ fontSize: item.fromdate === 'From-To-Date' ? '12px' : '10px' }}>
                                    {' '}
                                    {item.fromdate === 'From-To-Date' ? 'From-To-Date' : `${moment(item.fromdate)?.format('DD-MM-YYYY')} - ${moment(item.todate)?.format('DD-MM-YYYY')}`}
                                  </Typography>
                                </Grid>
                                <Grid item md={2.5} sm={2.5} xs={2.5} sx={{ wordBreak: 'break-all' }}>
                                  <Typography sx={{ fontSize: item.createddate === 'CreatedDate' ? '12px' : '10px' }}>{item.createddate}</Typography>
                                </Grid>
                                <Grid item md={3.5} sm={3.5} xs={3.5} sx={{ wordBreak: 'break-all' }}>
                                  <Typography sx={{ fontSize: (item.addedby ? item.addedby[0]?.name : '') === 'Added By' ? '12px' : '10px' }}>
                                    {' '}
                                    {(item.addedby ? item.addedby[0]?.name : '').length > 25 ? `${(item.addedby ? item.addedby[0]?.name : '').substring(0, 25)}...` : item.addedby ? item.addedby[0]?.name : ''}
                                  </Typography>
                                </Grid>
                                <Grid item md={1} sm={1} xs={1} sx={{ wordBreak: 'break-all' }}>
                                  <Typography sx={{ fontSize: item.percent === '%' ? '12px' : '10px' }}>{item.percent}</Typography>
                                </Grid>
                              </Grid>
                            );
                          })}
                        </>
                      </Tooltip>
                    </Box>
                  </Box>
                </Grid>
                {/* <Grid item md={6.3} sm={10} xs={12}>
                  <Tooltip TransitionComponent={Zoom} arrow placement="top" sx={{ margin: "0px" }} title="Last Four Uploaded Data">
                    <Grid container sx={{ backgroundColor: "#e9be1533", display: "flex", alignItems: "center", fontSize: "11px", color: "#9c5a1f", padding: "4px 15px" }}>
                      <Grid item md={12} sm={12} xs={12}>
                        {[...[{ vendor: "Vendor", fromdate: "From-To-Date", createddate: "CreatedDate", addedby: [{ name: "Added By" }] }], ...productionsOriginal].map((item, ind) => {
                          return (
                            <Grid container spacing={1}>
                              <Grid item md={2.5} sm={2.5} xs={2.5} sx={{ wordBreak: "break-all" }}>
                                {item.vendor === "Vendor" ? "Vendor" : `${ind}). ${item.vendor}`}
                              </Grid>
                              <Grid item md={2.5} sm={2.5} xs={2.5}>
                                {item.fromdate === "From-To-Date" ? "From-To-Date" : `${moment(item.fromdate)?.format("DD-MM-YYYY")} - ${moment(item.todate)?.format("DD-MM-YYYY")}`}
                              </Grid>
                              <Grid item md={2.5} sm={2.5} xs={2.5}>
                                {item.createddate}
                              </Grid>
                              <Grid item md={4.5} sm={4.5} xs={4.5}>
                                {item.addedby ? item.addedby[0]?.name : ""}
                              </Grid>
                            </Grid>
                          );
                        })}
                      </Grid>
                    </Grid>
                  </Tooltip>
                </Grid> */}
                <Grid item md={1.7} sm={12} xs={12} sx={{ display: 'flex', justifyContent: 'end' }}>
                  <Link to="/production/productionupload">
                    <Button variant="contained" disabled={excelArray.length > 0 || dataupdated === 'uploading' || loadingMessage === true} style={{ padding: '7px 14px', borderRadius: '4px' }}>
                      Go to List
                    </Button>
                  </Link>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={3}>
                <Grid item md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Vendor<b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <Selects
                      options={vendors}
                      disabled={fileLength > 0}
                      value={{ label: productionoriginal.vendor, value: productionoriginal.vendor }}
                      onChange={(e) => {
                        setProductionoriginal({ ...productionoriginal, vendor: e.value });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <Grid container spacing={2}>
                    <Grid item md={6} xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          From Date <b style={{ color: 'red' }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="date"
                          value={productionoriginal.fromdate}
                          // onChange={(e) => {
                          //   setProductionoriginal({ ...productionoriginal, fromdate: e.target.value });
                          // }}
                          disabled={fileLength > 0}
                          onChange={(e) => {
                            const selectedDate = e.target.value;
                            // Ensure that the selected date is not in the future
                            const currentDate = new Date().toISOString().split('T')[0];
                            if (selectedDate <= currentDate) {
                              setProductionoriginal({ ...productionoriginal, fromdate: selectedDate, todate: selectedDate });
                            } else {
                              setPopupContentMalert('Please select a date that is today or earlier, not a future date.');
                              setPopupSeverityMalert('info');
                              handleClickOpenPopupMalert();
                            }
                          }}
                          // Set the max attribute to the current date
                          inputProps={{ max: new Date().toISOString().split('T')[0] }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          To Date <b style={{ color: 'red' }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="date"
                          value={productionoriginal.todate}
                          disabled={fileLength > 0}
                          onChange={(e) => {
                            const selectedDate = e.target.value;
                            // Ensure that the selected date is not in the future
                            const currentDate = new Date().toISOString().split('T')[0];
                            const fromdateval = productionoriginal.fromdate != '' && new Date(productionoriginal.fromdate).toISOString().split('T')[0];
                            if (productionoriginal.fromdate == '') {
                              setPopupContentMalert('Please Select From date');
                              setPopupSeverityMalert('info');
                              handleClickOpenPopupMalert();
                            } else if (selectedDate < fromdateval) {
                              setPopupContentMalert('To Date should be after or equal to From Date');
                              setPopupSeverityMalert('info');
                              handleClickOpenPopupMalert();
                              setProductionoriginal({ ...productionoriginal, todate: '' });
                            } else if (selectedDate <= currentDate) {
                              setProductionoriginal({ ...productionoriginal, todate: selectedDate });
                            } else {
                              setPopupContentMalert('Please select a date that is today or earlier, not a future date.');
                              setPopupSeverityMalert('info');
                              handleClickOpenPopupMalert();
                            }
                          }}
                          // Set the max attribute to the current date
                          inputProps={{ max: new Date().toISOString().split('T')[0], min: productionoriginal.fromdate !== '' ? productionoriginal.fromdate : null }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Date Time Zone<b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      disabled={fileLength > 0}
                      options={datetimeZoneOptions}
                      placeholder="Please Select Time Zone"
                      value={{ label: productionoriginal.datetimezone, value: productionoriginal.datetimezone }}
                      onChange={(e) => {
                        setProductionoriginal({ ...productionoriginal, datetimezone: e.value });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <Typography>Excel Date Format</Typography>
                  <Grid container spacing={0.3}>
                    <Grid item md={2.5} xs={4} sm={2.5}>
                      <FormControl fullWidth size="small">
                        <Select
                          fullWidth
                          labelId="demo-select-small"
                          id="demo-select-small"
                          disabled={fileLength > 0}
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 200,
                                width: 80,
                              },
                            },
                          }}
                          value={yeardrop}
                          onChange={(e) => {
                            setYeardrop(e.target.value);
                          }}
                          displayEmpty
                          inputProps={{ 'aria-label': 'Without label' }}
                        >
                          <MenuItem value="Year" disabled>
                            {' '}
                            {'Year'}{' '}
                          </MenuItem>
                          <MenuItem value="dd"> {'dd'} </MenuItem>
                          <MenuItem value="d"> {'d'} </MenuItem>
                          <MenuItem value="MM"> {'MM'} </MenuItem>
                          <MenuItem value="M"> {'M'} </MenuItem>
                          <MenuItem value="MMM"> {'MMM'} </MenuItem>
                          <MenuItem value="MMMM"> {'MMMM'} </MenuItem>
                          <MenuItem value="yyyy"> {'yyyy'} </MenuItem>
                          <MenuItem value="yy"> {'yy'} </MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item md={2.7} xs={4} sm={2.7}>
                      <FormControl fullWidth size="small">
                        {/* <Typography>Excel Date Format</Typography> */}
                        <Select
                          fullWidth
                          labelId="demo-select-small"
                          id="demo-select-small"
                          disabled={fileLength > 0}
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 200,
                                width: 80,
                              },
                            },
                          }}
                          value={monthdrop}
                          onChange={(e) => {
                            setMonthdrop(e.target.value);
                          }}
                          displayEmpty
                          inputProps={{ 'aria-label': 'Without label' }}
                        >
                          <MenuItem value="Month" disabled>
                            {' '}
                            {'Month'}{' '}
                          </MenuItem>
                          <MenuItem value="MM"> {'MM'} </MenuItem>
                          <MenuItem value="M"> {'M'} </MenuItem>
                          <MenuItem value="MMM"> {'MMM'} </MenuItem>
                          <MenuItem value="MMMM"> {'MMMM'} </MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item md={2} xs={4} sm={2}>
                      <FormControl fullWidth size="small">
                        {/* <Typography>Excel Date Format</Typography> */}
                        <Select
                          fullWidth
                          labelId="demo-select-small"
                          id="demo-select-small"
                          disabled={fileLength > 0}
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 200,
                                width: 80,
                              },
                            },
                          }}
                          value={datedrop}
                          onChange={(e) => {
                            setDatedrop(e.target.value);
                          }}
                          displayEmpty
                          inputProps={{ 'aria-label': 'Without label' }}
                        >
                          <MenuItem value="Date" disabled>
                            {' '}
                            {'Date'}{' '}
                          </MenuItem>
                          <MenuItem value="dd"> {'dd'} </MenuItem>
                          <MenuItem value="d"> {'d'} </MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item md={1.8} xs={3} sm={1.8}>
                      <FormControl fullWidth size="small">
                        {/* <Typography>Excel Date Format</Typography> */}
                        <Select
                          fullWidth
                          labelId="demo-select-small"
                          id="demo-select-small"
                          disabled={fileLength > 0}
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 200,
                                width: 80,
                              },
                            },
                          }}
                          value={symboldrop}
                          onChange={(e) => {
                            setSymboldrop(e.target.value);
                          }}
                          displayEmpty
                          inputProps={{ 'aria-label': 'Without label' }}
                        >
                          <MenuItem value="/" disabled>
                            {' '}
                            {'/'}{' '}
                          </MenuItem>
                          <MenuItem value="/"> {'/'} </MenuItem>
                          <MenuItem value="."> {'.'} </MenuItem>
                          <MenuItem value="-"> {'-'} </MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={4} sm={3}>
                      <FormControl fullWidth size="small">
                        {/* <Typography>Excel Date Format</Typography> */}
                        <Select
                          fullWidth
                          labelId="demo-select-small"
                          id="demo-select-small"
                          disabled={fileLength > 0}
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 200,
                                width: 80,
                              },
                            },
                          }}
                          value={hoursdrop}
                          onChange={(e) => {
                            setHoursdrop(e.target.value);
                          }}
                          displayEmpty
                          inputProps={{ 'aria-label': 'Without label' }}
                        >
                          <MenuItem value="Hours" disabled>
                            {'Hours'}{' '}
                          </MenuItem>
                          <MenuItem value="12 Hours"> {'12 Hours'} </MenuItem>
                          <MenuItem value="24 Hours"> {'24 Hours'} </MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>Sheet Name/Number </Typography>

                    <Selects
                      options={[
                        { label: 'Details 1', value: 'Details 1' },
                        { label: 'Details', value: 'Details' },
                        { label: '1', value: '1' },
                      ]}
                      disabled={fileLength > 0}
                      value={{ label: productionoriginal.sheetnumber, value: productionoriginal.sheetnumber }}
                      onChange={(e) => {
                        setProductionoriginal({ ...productionoriginal, sheetnumber: e.value });
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <br /> <br />
              <Grid container>
                <Grid item md={7} sm={6} xs={12}>
                  <Box sx={{ display: 'flex', gap: '20px' }}>
                    <Button variant="contained" disabled={chunkSize > 1} component="label" sx={{ textTransform: 'capitalize' }}>
                      Choose File
                      <input
                        hidden
                        type="file"
                        accept=".xlsx, .xls, .csv"
                        onChange={(e) => {
                          const file = e.target.files;
                          readExcel(file);
                          e.target.value = null;
                        }}
                        multiple
                      />
                    </Button>

                    {dataupdated != 'uploaded' && (
                      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                        <CircularProgress variant="determinate" value={progress} />
                        <Box
                          sx={{
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            position: 'absolute',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Typography variant="caption" component="div" color="text.secondary">
                            {progress}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                    {dataupdated == 'updating' && (
                      <Box>
                        <Typography variant="caption" component="div" color="text.secondary">
                          {checkingSts}
                        </Typography>
                        <ThreeDots visible={true} height="15" width="15" color="#4fa94d" radius="2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClass="" />
                      </Box>
                    )}
                    {dataupdated === 'uploaded' && excelArray.length > 0 && (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography color="text.secondary"> {fileLength}</Typography>
                        <Button sx={{ minWidth: '41px', borderRadius: '50%', padding: '12px' }} disabled={chunkSize > 1} onClick={(e) => clearFileSelection(e)}>
                          <FaTrash style={{ color: chunkSize > 1 ? '#00000042' : '#b23737', fontSize: '15px' }} />
                        </Button>
                      </Box>
                    )}
                  </Box>
                </Grid>

                <Grid item md={5} sm={6} xs={12}>
                  <Grid container>
                    <Grid item md={0} sm={2} xs={0}>
                      {' '}
                    </Grid>
                    <Grid item md={12} sm={10} xs={12} sx={{ display: 'flex', justifyContent: 'end' }}>
                      <Box sx={{ display: 'flex', gap: '10px' }}>
                        <Button
                          variant="contained"
                          disabled={dataupdated !== 'uploaded' || excelArray.length === 0 || fileLength === 0}
                          onClick={(e) => {
                            handleOpenLoadingMessage('', 0);
                            sendJSON();
                          }}
                        >
                          Submit
                        </Button>
                        <Button sx={userStyle.btncancel} disabled={dataupdated == 'uploading' || dataupdated == 'updating' || excelArray.length > 1} onClick={() => clearAll()}>
                          clear All
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <br />
              {/* <Grid container>
                <Grid item md={12}>
                <Typography>{progfinal}</Typography> <br/>
                  {submitAction === "start"  && <>  <LinearProgressBar progress={progressbar} /> </>}
                </Grid>
              </Grid> */}
            </>
          </Box>
        </>
      )}

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

      {/* DUPE ALERT DIALOG */}

      <Dialog open={dupeAlert} onClose={handleCloseDupe} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth={'lg'} fullWidth={true}>
        <DialogContent>
          <Typography sx={userStyle.HeaderText}>Duplicate Datas</Typography>
          <Grid container spacing={2}>
            <Grid item md={12} xs={12} sm={12}>
              <Grid container style={userStyle.dataTablestyle}>
                <Grid item md={2} xs={12} sm={12}>
                  <Box>
                    <label>Show entries:</label>
                    <Select
                      id="pageSizeSelect"
                      size="small"
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
                      <MenuItem value={filteredDatas?.length}>All</MenuItem>
                    </Select>
                  </Box>
                </Grid>
                <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Box>
                    {/* {isUserRoleCompare?.includes("excelproductionoriginalupload") && ( */}
                    {/* <>
                      <ExportXL
                        csvData={rowDataTable.map((item) => ({
                          "S No": item.serialNumber,
                          Count: item.count,
                          Filename: item.filename,
                        }))}
                        fileName={"Duplicate Datas"}
                      />
                    </> */}
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
                    {/* )} */}
                    {/* {isUserRoleCompare?.includes("csvproductionoriginalupload") && ( */}
                    {/* <>
                      <ExportCSV
                        csvData={rowDataTable.map((item) => ({
                          "S No": item.serialNumber,
                          Count: item.count,
                          Filename: item.filename,
                        }))}
                        fileName={"Duplicate Datas"}
                      />
                    </> */}
                    <>
                      <Button
                        onClick={(e) => {
                          setIsFilterOpen(true);

                          setFormat('csv');
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileExcel />
                        &ensp;Export to Excel&ensp;
                      </Button>
                    </>
                    {/* )} */}
                    {/* {isUserRoleCompare?.includes("printproductionoriginalupload") && ( */}
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                    {/* )} */}
                    {/* {isUserRoleCompare?.includes("pdfproductionoriginalupload") && ( */}
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
                    {/* )} */}
                    {/* {isUserRoleCompare?.includes("imageproductionoriginalupload") && ( */}
                    <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                      {' '}
                      <ImageIcon sx={{ fontSize: '15px' }} /> &ensp;Image&ensp;{' '}
                    </Button>
                    {/* )} */}
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
                <br />
              </Grid>
              <Box
                style={{
                  width: '100%',
                  overflowY: 'hidden', // Hide the y-axis scrollbar
                }}
              >
                <StyledDataGrid rows={rowDataTable} columns={columnDataTable.filter((column) => columnVisibility[column.field])} autoHeight={true} density="compact" hideFooter disableRowSelectionOnClick />
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
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="error" onClick={handleCloseDupeWithDupe}>
            {' '}
            Add With Duplicates
          </Button>
          <Button variant="contained" color="success" onClick={handleCloseDupeWithoutDupe}>
            Add Without Duplicates
          </Button>
        </DialogActions>
      </Dialog>

      {/* ALERT DIALOG */}
      <Box>
        <Dialog open={isErrorOpenempty} onClose={handleCloseerrempty} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
            {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} /> */}
            <Typography variant="h6">{showAlert}</Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error" onClick={handleCloseerrempty}>
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      <Dialog open={completeOpen} onClose={handleCompleteCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
          <CheckCircleOutlineIcon sx={{ fontSize: '100px', color: 'green' }} />
          {/* <Typography variant="h6">{showAlert}</Typography> */}
          <p style={{ fontSize: '20px', fontWeight: 900 }}>{showAlert}</p>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="error" onClick={handleCompleteCloseerr}>
            ok
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={loadingMessage}
        onClose={(event, reason) => {
          // Only close the dialog if the reason is not a backdrop click
          if (reason !== 'backdropClick') {
            handleCloseLoadingMessage();
          }
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={'sm'}
        fullWidth={true}
      >
        <DialogContent sx={{ textAlign: 'center', alignItems: 'center' }}>
          {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} /> */}
          <Typography sx={{ fontSize: '14px' }} variant="caption">
            {progfinal}
          </Typography>
          <Typography variant="h6">{showAlert + '%'}</Typography>
          <LinearProgressBar progress={showAlert} />
        </DialogContent>
        {/* <DialogActions>
          <Button variant="contained" color="error" onClick={handleCloseLoadingMessage}>
            ok
          </Button>
        </DialogActions> */}
      </Dialog>

      {/* print layout */}
      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRef}>
          <TableHead>
            <TableRow>
              <TableCell>S.no</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody align="left">
            {rowDataTable &&
              rowDataTable.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.count}</TableCell>
                  <TableCell>{row.filename}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* PRINT PDF EXCEL CSV */}
      <ExportData
        isFilterOpen={isFilterOpen}
        handleCloseFilterMod={handleCloseFilterMod}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpen}
        isPdfFilterOpen={isPdfFilterOpen}
        setIsPdfFilterOpen={setIsPdfFilterOpen}
        handleClosePdfFilterMod={handleClosePdfFilterMod}
        filteredDataTwo={rowDataTable ?? []}
        itemsTwo={items ?? []}
        filename={'Duplicate Datas'}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />

      {/* VALIDATION */}
      <MessageAlert openPopup={openPopupMalert} handleClosePopup={handleClosePopupMalert} popupContent={popupContentMalert} popupSeverity={popupSeverityMalert} />
      {/* SUCCESS */}
      <AlertDialog openPopup={openPopup} handleClosePopup={handleClosePopup} popupContent={popupContent} popupSeverity={popupSeverity} />
    </Box>
  );
}

export default ProductionOriginalUpload;