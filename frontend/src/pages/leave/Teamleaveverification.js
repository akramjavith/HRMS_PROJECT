import React, { useContext, useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { FaEdit, FaFileCsv, FaFileExcel, FaFilePdf, FaPrint, FaSearch } from 'react-icons/fa';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import ImageIcon from '@mui/icons-material/Image';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Popover,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextareaAutosize,
  Typography,
  InputAdornment,
  Tooltip,
} from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import axios from 'axios';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment-timezone';
import { ThreeDots } from 'react-loader-spinner';
import Selects from 'react-select';
import { useReactToPrint } from 'react-to-print';
import { handleApiError } from '../../components/Errorhandling';
import Headtitle from '../../components/Headtitle';
import { AuthContext, UserRoleAccessContext } from '../../context/Appcontext';
import { userStyle, colourStyles } from '../../pageStyle';
import { SERVICE } from '../../services/Baseservice';
import Webcamimage from '../hr/webcamprofile';
import { IoMdOptions } from 'react-icons/io';
import { MdClose } from 'react-icons/md';
import CompletedTeamLeaveVerification from './CompletedTeamLeaveVerification';
import CloseIcon from '@mui/icons-material/Close';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ExcelJS from 'exceljs';
import domtoimage from 'dom-to-image';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import ExportData from '../../components/ExportData';
import MessageAlert from '../../components/MessageAlert';
import PageHeading from '../../components/PageHeading';
import AlertDialog from '../../components/Alert';
import AdvancedSearchBar from '../../components/SearchbarEbList';
import ManageColumnsContent from '../../components/ManageColumn';
import ResizeObserver from 'resize-observer-polyfill';
window.ResizeObserver = ResizeObserver;

function TeamLeaveVerification() {
  let cellStyles = {
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    lineHeight: 'normal',
    // fontSize: "12px"
  };

  let today = new Date();

  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var yyyy = today.getFullYear();
  let formattedDate = yyyy + '-' + mm + '-' + dd;

  const gridRefTableTeamLveVerif = useRef(null);
  const gridRefImageTeamLveVerif = useRef(null);
  const [isBtn, setIsBtn] = useState(false);
  const [Accessdrop, setAccesDrop] = useState('Employee');
  const modeDropDowns = [
    { label: 'My Hierarchy List', value: 'myhierarchy' },
    { label: 'All Hierarchy List', value: 'allhierarchy' },
    { label: 'My + All Hierarchy List', value: 'myallhierarchy' },
  ];
  const sectorDropDowns = [
    { label: 'Primary', value: 'Primary' },
    { label: 'Secondary', value: 'Secondary' },
    { label: 'Tertiary', value: 'Tertiary' },
    { label: 'All', value: 'all' },
  ];
  const [modeselection, setModeSelection] = useState({
    label: 'My Hierarchy List',
    value: 'myhierarchy',
  });
  const [sectorSelection, setSectorSelection] = useState({
    label: 'Primary',
    value: 'Primary',
  });
  const [appleave, setAppleave] = useState({
    employeename: 'Please Select Employee Name',
    employeeid: '',
    leavetype: 'Please Select LeaveType',
    date: '',
    todate: '',
    reasonforleave: '',
    reportingto: '',
    department: '',
    designation: '',
    doj: '',
    availabledays: '',
    durationtype: 'Random',
    weekoff: '',
    workmode: '',
  });

  const [appleaveEdit, setAppleaveEdit] = useState([]);
  const [selectStatus, setSelectStatus] = useState({});
  const [isApplyLeave, setIsApplyLeave] = useState([]);
  const [isInidvidualStatus, setIsInidvidualStatus] = useState({});

  const [applyleaves, setApplyleaves] = useState([]);
  const [completedApplyleaves, setCompletedApplyleaves] = useState([]);
  const [updated, setUpdated] = useState(null);

  // State to track advanced filter
  const [advancedFilter, setAdvancedFilter] = useState(null);
  const [gridApi, setGridApi] = useState(null);
  const [columnApi, setColumnApi] = useState(null);
  const [filteredDataItems, setFilteredDataItems] = useState(applyleaves);
  const [filteredRowData, setFilteredRowData] = useState([]);

  const [leave, setLeave] = useState('Please Select LeaveType');
  const [leaveEdit, setLeaveEdit] = useState('Please Select LeaveType');

  const { isUserRoleCompare, allProjects, isUserRoleAccess, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);

  const [applyleaveCheck, setApplyleavecheck] = useState(true);

  const [selectedRows, setSelectedRows] = useState([]);

  const [statusOpen, setStatusOpen] = useState(false);
  const handleStatusOpen = () => {
    setStatusOpen(true);
  };
  const handleStatusClose = () => {
    setStatusOpen(false);
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
  const [pageTeamLveVerif, setPageTeamLveVerif] = useState(1);
  const [pageSizeTeamLveVerif, setPageSizeTeamLveVerif] = useState(10);
  const [searchQueryTeamLveVerif, setSearchQueryTeamLveVerif] = useState('');
  const [totalPagesTeamLveVerif, setTotalPagesTeamLveVerif] = useState(1);

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  // Manage Columns
  const [searchQueryManageTeamLveVerif, setSearchQueryManageTeamLveVerif] = useState('');
  const [isManageColumnsOpenTeamLveVerif, setManageColumnsOpenTeamLveVerif] = useState(false);
  const [anchorElTeamLveVerif, setAnchorElTeamLveVerif] = useState(null);

  const handleOpenManageColumnsTeamLveVerif = (event) => {
    setAnchorElTeamLveVerif(event.currentTarget);
    setManageColumnsOpenTeamLveVerif(true);
  };
  const handleCloseManageColumnsTeamLveVerif = () => {
    setManageColumnsOpenTeamLveVerif(false);
    setSearchQueryManageTeamLveVerif('');
  };

  const openTeamLveVerif = Boolean(anchorElTeamLveVerif);
  const idTeamLveVerif = openTeamLveVerif ? 'simple-popover' : undefined;

  // Search bar
  const [anchorElSearchTeamLveVerif, setAnchorElSearchTeamLveVerif] = React.useState(null);
  const handleClickSearchTeamLveVerif = (event) => {
    setAnchorElSearchTeamLveVerif(event.currentTarget);
  };
  const handleCloseSearchTeamLveVerif = () => {
    setAnchorElSearchTeamLveVerif(null);
    setSearchQueryTeamLveVerif('');
  };

  const openSearchTeamLveVerif = Boolean(anchorElSearchTeamLveVerif);
  const idSearchTeamLveVerif = openSearchTeamLveVerif ? 'simple-popover' : undefined;

  // Table row color
  const getRowStyle = (params) => {
    if (params.node.rowIndex % 2 === 0) {
      return { background: '#f0f0f0' }; // Even row
    } else {
      return { background: '#ffffff' }; // Odd row
    }
  };

  const [isAssigned, setIsAssigned] = useState(false);

  const isChecklistAssigned = async () => {
    try {
      const res = await axios.get(`${SERVICE.MODULEBASEDASSIGNMENTCHECKLIST}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      // Check if the response contains the required data
      const isAvailable = res?.data?.checklistverificationmasters?.some((item) => item.mainpage === 'Apply Leave');
      if (isAvailable) {
        setIsAssigned(true);
      } else {
        setIsAssigned(false);
      }
    } catch (err) {
      console.error('API Error:', err); // For easier debugging
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    getapi();
    isChecklistAssigned();
  }, []);

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String('Team Leave Verification'),
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

  const [isEditOpenCheckList, setIsEditOpenCheckList] = useState(false);
  const handleClickOpenEditCheckList = () => {
    setIsEditOpenCheckList(true);
  };
  const handleCloseModEditCheckList = (e, reason) => {
    if (reason && reason === 'backdropClick') return;
    setIsEditOpenCheckList(false);
  };

  // Update history
  const [isOpenHistoryUpdate, setIsOpenHistoryUpdate] = useState(false);
  const handleClickOpenHistoryUpdate = () => {
    setIsOpenHistoryUpdate(true);
  };
  const handleCloseModHistoryUpdate = (e, reason) => {
    if (reason && reason === 'backdropClick') return;
    setIsOpenHistoryUpdate(false);
  };

  const [isCheckedList, setIsCheckedList] = useState([]);
  const [isCheckedListOverall, setIsCheckedListOverall] = useState(false);
  const overallCheckListChange = () => {
    let newArrayChecked = isCheckedList.map((item) => (item = !isCheckedListOverall));

    let returnOverall = groupDetails.map((row) => {
      {
        if (row.checklist === 'DateTime') {
          if (((row.data !== undefined && row.data !== '') || row.files !== undefined) && row.data.length === 16) {
            return true;
          } else {
            return false;
          }
        } else if (row.checklist === 'Date Multi Span') {
          if (((row.data !== undefined && row.data !== '') || row.files !== undefined) && row.data.length === 21) {
            return true;
          } else {
            return false;
          }
        } else if (row.checklist === 'Date Multi Span Time') {
          if (((row.data !== undefined && row.data !== '') || row.files !== undefined) && row.data.length === 33) {
            return true;
          } else {
            return false;
          }
        } else if (row.checklist === 'Date Multi Random Time') {
          if (((row.data !== undefined && row.data !== '') || row.files !== undefined) && row.data.length === 16) {
            return true;
          } else {
            return false;
          }
        } else if ((row.data !== undefined && row.data !== '') || row.files !== undefined) {
          return true;
        } else {
          return false;
        }
      }
    });

    let allcondition = returnOverall.every((item) => item == true);

    if (allcondition) {
      setIsCheckedList(newArrayChecked);
      setIsCheckedListOverall(!isCheckedListOverall);
    } else {
      setPopupContentMalert('Please Fill all the Fields');
      setPopupSeverityMalert('warning');
      handleClickOpenPopupMalert();
    }
  };

  const handleCheckboxChange = (index) => {
    const newCheckedState = [...isCheckedList];
    newCheckedState[index] = !newCheckedState[index];

    let currentItem = groupDetails[index];

    let data = () => {
      if (currentItem.checklist === 'DateTime') {
        if (((currentItem.data !== undefined && currentItem.data !== '') || currentItem.files !== undefined) && currentItem.data.length === 16) {
          return true;
        } else {
          return false;
        }
      } else if (currentItem.checklist === 'Date Multi Span') {
        if (((currentItem.data !== undefined && currentItem.data !== '') || currentItem.files !== undefined) && currentItem.data.length === 21) {
          return true;
        } else {
          return false;
        }
      } else if (currentItem.checklist === 'Date Multi Span Time') {
        if (((currentItem.data !== undefined && currentItem.data !== '') || currentItem.files !== undefined) && currentItem.data.length === 33) {
          return true;
        } else {
          return false;
        }
      } else if (currentItem.checklist === 'Date Multi Random Time') {
        if (((currentItem.data !== undefined && currentItem.data !== '') || currentItem.files !== undefined) && currentItem.data.length === 16) {
          return true;
        } else {
          return false;
        }
      } else if ((currentItem.data !== undefined && currentItem.data !== '') || currentItem.files !== undefined) {
        return true;
      } else {
        return false;
      }
    };

    if (data()) {
      setIsCheckedList(newCheckedState);
      handleDataChange(newCheckedState[index], index, 'Check Box');
      let overallChecked = newCheckedState.every((item) => item === true);

      if (overallChecked) {
        setIsCheckedListOverall(true);
      } else {
        setIsCheckedListOverall(false);
      }
    } else {
      setPopupContentMalert('Please Fill the Field');
      setPopupSeverityMalert('warning');
      handleClickOpenPopupMalert();
    }
  };

  let name = 'create';

  //webcam
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const [getImg, setGetImg] = useState(null);
  const [isWebcamCapture, setIsWebcamCapture] = useState(false);
  const [capturedImages, setCapturedImages] = useState([]);
  const [valNum, setValNum] = useState(0);

  const webcamOpen = () => {
    setIsWebcamOpen(true);
  };
  const webcamClose = () => {
    setIsWebcamOpen(false);
  };
  const webcamDataStore = () => {
    setIsWebcamCapture(true);
    //popup close
    webcamClose();
  };

  //add webcamera popup
  const showWebcam = () => {
    webcamOpen();
  };

  const renderFilePreviewEdit = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    window.open(link, '_blank');
  };
  const handleFileDeleteEdit = (index) => {
    let getData = groupDetails[index];
    delete getData.files;
    let finalData = getData;

    let updatedTodos = [...groupDetails];
    updatedTodos[index] = finalData;
    setGroupDetails(updatedTodos);
  };

  const [assignDetails, setAssignDetails] = useState();
  const [groupDetails, setGroupDetails] = useState();
  const [datasAvailedDB, setDatasAvailedDB] = useState();
  const [disableInput, setDisableInput] = useState([]);
  const [getDetails, setGetDetails] = useState();

  const [dateValue, setDateValue] = useState([]);
  const [timeValue, setTimeValue] = useState([]);

  const [dateValueRandom, setDateValueRandom] = useState([]);
  const [timeValueRandom, setTimeValueRandom] = useState([]);

  const [dateValueMultiFrom, setDateValueMultiFrom] = useState([]);
  const [dateValueMultiTo, setDateValueMultiTo] = useState([]);
  const [postID, setPostID] = useState();
  const [pagesDetails, setPagesDetails] = useState({});
  const [fromWhere, setFromWhere] = useState('');

  const [firstDateValue, setFirstDateValue] = useState([]);
  const [firstTimeValue, setFirstTimeValue] = useState([]);
  const [secondDateValue, setSecondDateValue] = useState([]);
  const [secondTimeValue, setSecondTimeValue] = useState([]);

  const [isCheckList, setIsCheckList] = useState(true);

  let completedbyName = isUserRoleAccess.companyname;

  const updateIndividualData = async (index) => {
    setPageName(!pageName);
    let searchItem = datasAvailedDB.find((item) => item.commonid == postID && item.module == 'Leave&Permission' && item.submodule == 'Leave' && item.mainpage == 'Apply Leave' && item.status.toLowerCase() !== 'completed');

    let combinedGroups = groupDetails?.map((data) => {
      let check = (data.data !== undefined && data.data !== '') || data.files !== undefined;

      if (check) {
        return {
          ...data,
          completedby: completedbyName,
          completedat: new Date(),
        };
      } else {
        return {
          ...data,
          completedby: '',
          completedat: '',
        };
      }
    });

    try {
      let objectID = combinedGroups[index]?._id;
      let objectData = combinedGroups[index];
      if (searchItem) {
        let assignbranches = await axios.put(`${SERVICE.MYCHECKLIST_SINGLEBYOBJECTID}/${objectID}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          data: String(objectData?.data),
          lastcheck: objectData?.lastcheck,
          newFiles: objectData?.files,
          completedby: objectData?.completedby,
          completedat: objectData?.completedat,
        });
        await fecthDBDatas();
      } else {
        let assignbranches = await axios.post(`${SERVICE.MYCHECKLIST_CREATE}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          commonid: postID,
          module: pagesDetails?.module,
          submodule: pagesDetails?.submodule,
          mainpage: pagesDetails?.mainpage,
          subpage: pagesDetails?.subpage,
          subsubpage: pagesDetails?.subsubpage,
          category: assignDetails?.category,
          subcategory: assignDetails?.subcategory,
          candidatename: assignDetails?.fullname,
          status: 'progress',
          groups: combinedGroups,
          addedby: [
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        });
        await fecthDBDatas();
      }
      setPopupContent('Updated Successfully');
      setPopupSeverity('success');
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  async function fecthDBDatas() {
    setPageName(!pageName);
    try {
      let res = await axios.get(SERVICE.MYCHECKLIST);
      setDatasAvailedDB(res?.data?.mychecklist);

      let foundData = res?.data?.mychecklist.find((item) => item.commonid == postID);
      setGroupDetails(foundData?.groups);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  }

  const updateDateValuesAtIndex = (value, index) => {
    setDateValue((prevArray) => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, 'DateTime', 'date');
  };

  const updateTimeValuesAtIndex = (value, index) => {
    setTimeValue((prevArray) => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, 'DateTime', 'time');
  };
  //---------------------------------------------------------------------------------------------------------------

  const updateFromDateValueAtIndex = (value, index) => {
    setDateValueMultiFrom((prevArray) => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, 'Date Multi Span', 'fromdate');
  };

  const updateToDateValueAtIndex = (value, index) => {
    setDateValueMultiTo((prevArray) => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, 'Date Multi Span', 'todate');
  };
  //---------------------------------------------------------------------------------------------------------------------------------
  const updateDateValueAtIndex = (value, index) => {
    setDateValueRandom((prevArray) => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, 'Date Multi Random Time', 'date');
  };

  const updateTimeValueAtIndex = (value, index) => {
    setTimeValueRandom((prevArray) => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, 'Date Multi Random Time', 'time');
  };
  //---------------------------------------------------------------------------------------------------------------------------------------

  const updateFirstDateValuesAtIndex = (value, index) => {
    setFirstDateValue((prevArray) => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, 'Date Multi Span Time', 'fromdate');
  };

  const updateFirstTimeValuesAtIndex = (value, index) => {
    setFirstTimeValue((prevArray) => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, 'Date Multi Span Time', 'fromtime');
  };

  const updateSecondDateValuesAtIndex = (value, index) => {
    setSecondDateValue((prevArray) => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, 'Date Multi Span Time', 'todate');
  };

  const updateSecondTimeValuesAtIndex = (value, index) => {
    setSecondTimeValue((prevArray) => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, 'Date Multi Span Time', 'totime');
  };

  //------------------------------------------------------------------------------------------------------------

  const handleDataChange = (e, index, from, sub) => {
    let getData;
    let finalData;
    let updatedTodos;
    switch (from) {
      case 'Check Box':
        getData = groupDetails[index];
        finalData = {
          ...getData,
          lastcheck: e,
        };

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case 'Text Box':
        getData = groupDetails[index];
        finalData = {
          ...getData,
          data: e.target.value,
        };

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case 'Text Box-number':
        getData = groupDetails[index];
        finalData = {
          ...getData,
          data: e.target.value,
        };

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case 'Text Box-alpha':
        getData = groupDetails[index];
        finalData = {
          ...getData,
          data: e.target.value,
        };

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case 'Text Box-alphanumeric':
        getData = groupDetails[index];
        finalData = {
          ...getData,
          data: e.target.value,
        };

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case 'Attachments':
        getData = groupDetails[index];
        finalData = {
          ...getData,
          files: e,
        };

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case 'Pre-Value':
        break;
      case 'Date':
        getData = groupDetails[index];
        finalData = {
          ...getData,
          data: e.target.value,
        };

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case 'Time':
        getData = groupDetails[index];
        finalData = {
          ...getData,
          data: e.target.value,
        };

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case 'DateTime':
        if (sub == 'date') {
          getData = groupDetails[index];
          finalData = {
            ...getData,
            data: `${e} ${timeValue[index]}`,
          };

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        } else {
          getData = groupDetails[index];
          finalData = {
            ...getData,
            data: `${dateValue[index]} ${e}`,
          };

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        }

        break;
      case 'Date Multi Span':
        if (sub == 'fromdate') {
          getData = groupDetails[index];
          finalData = {
            ...getData,
            data: `${e} ${dateValueMultiTo[index]}`,
          };

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        } else {
          getData = groupDetails[index];
          finalData = {
            ...getData,
            data: `${dateValueMultiFrom[index]} ${e}`,
          };

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        }
        break;
      case 'Date Multi Span Time':
        if (sub == 'fromdate') {
          getData = groupDetails[index];
          finalData = {
            ...getData,
            data: `${e} ${firstTimeValue[index]}/${secondDateValue[index]} ${secondTimeValue[index]}`,
          };

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        } else if (sub == 'fromtime') {
          getData = groupDetails[index];
          finalData = {
            ...getData,
            data: `${firstDateValue[index]} ${e}/${secondDateValue[index]} ${secondTimeValue[index]}`,
          };

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        } else if (sub == 'todate') {
          getData = groupDetails[index];
          finalData = {
            ...getData,
            data: `${firstDateValue[index]} ${firstTimeValue[index]}/${e} ${secondTimeValue[index]}`,
          };

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        } else {
          getData = groupDetails[index];
          finalData = {
            ...getData,
            data: `${firstDateValue[index]} ${firstTimeValue[index]}/${secondDateValue[index]} ${e}`,
          };

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        }
        break;
      case 'Date Multi Random':
        getData = groupDetails[index];
        finalData = {
          ...getData,
          data: e.target.value,
        };

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case 'Date Multi Random Time':
        if (sub == 'date') {
          getData = groupDetails[index];
          finalData = {
            ...getData,
            data: `${e} ${timeValueRandom[index]}`,
          };

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        } else {
          getData = groupDetails[index];
          finalData = {
            ...getData,
            data: `${dateValueRandom[index]} ${e}`,
          };

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        }
        break;
      case 'Radio':
        getData = groupDetails[index];
        finalData = {
          ...getData,
          data: e.target.value,
        };

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
    }
  };

  const handleChangeImage = (event, index) => {
    const resume = event.target.files;

    const reader = new FileReader();
    const file = resume[0];
    reader.readAsDataURL(file);

    reader.onload = () => {
      handleDataChange(
        {
          name: file.name,
          preview: reader.result,
          data: reader.result.split(',')[1],
          remark: 'resume file',
        },
        index,
        'Attachments'
      );
    };
  };

  const getCodeNew = async (details) => {
    setPageName(!pageName);
    setGetDetails(details);
    try {
      let res = await axios.get(SERVICE.MYCHECKLIST);
      setDatasAvailedDB(res?.data?.mychecklist);
      let searchItem = res?.data?.mychecklist.find((item) => item.commonid == details?.id && item.module == 'Leave&Permission' && item.submodule == 'Leave' && item.mainpage == 'Apply Leave' && item.status.toLowerCase() !== 'completed');

      if (searchItem) {
        setAssignDetails(searchItem);

        setPostID(searchItem?.commonid);

        setGroupDetails(
          searchItem?.groups?.map((data) => ({
            ...data,
            lastcheck: false,
          }))
        );

        setIsCheckedList(searchItem?.groups?.map((data) => data.lastcheck));

        let forFillDetails = searchItem?.groups?.map((data) => {
          if (data.checklist === 'Date Multi Random Time') {
            if (data?.data && data?.data !== '') {
              const [date, time] = data?.data?.split(' ');
              return { date, time };
            }
          } else {
            return { date: '0', time: '0' };
          }
        });

        let forDateSpan = searchItem?.groups?.map((data) => {
          if (data.checklist === 'Date Multi Span') {
            if (data?.data && data?.data !== '') {
              const [fromdate, todate] = data?.data?.split(' ');
              return { fromdate, todate };
            }
          } else {
            return { fromdate: '0', todate: '0' };
          }
        });

        let forDateTime = searchItem?.groups?.map((data) => {
          if (data.checklist === 'DateTime') {
            if (data?.data && data?.data !== '') {
              const [date, time] = data?.data?.split(' ');
              return { date, time };
            }
          } else {
            return { date: '0', time: '0' };
          }
        });

        let forDateMultiSpanTime = searchItem?.groups?.map((data) => {
          if (data.checklist === 'Date Multi Span Time') {
            if (data?.data && data?.data !== '') {
              const [from, to] = data?.data?.split('/');
              const [fromdate, fromtime] = from?.split(' ');
              const [todate, totime] = to?.split(' ');
              return { fromdate, fromtime, todate, totime };
            }
          } else {
            return { fromdate: '0', fromtime: '0', todate: '0', totime: '0' };
          }
        });

        setDateValueMultiFrom(forDateSpan.map((item) => item?.fromdate));
        setDateValueMultiTo(forDateSpan.map((item) => item?.todate));

        setDateValueRandom(forFillDetails.map((item) => item?.date));
        setTimeValueRandom(forFillDetails.map((item) => item?.time));

        setDateValue(forDateTime.map((item) => item?.date));
        setTimeValue(forDateTime.map((item) => item?.time));

        setFirstDateValue(forDateMultiSpanTime.map((item) => item?.fromdate));
        setFirstTimeValue(forDateMultiSpanTime.map((item) => item?.fromtime));
        setSecondDateValue(forDateMultiSpanTime.map((item) => item?.todate));
        setSecondTimeValue(forDateMultiSpanTime.map((item) => item?.totime));

        setDisableInput(new Array(details?.groups?.length).fill(true));
      } else {
        setIsCheckList(false);
      }
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const handleCheckListSubmit = async () => {
    let nextStep = isCheckedList.every((item) => item == true);

    if (!nextStep) {
      setPopupContentMalert('Please Check All the Fields');
      setPopupSeverityMalert('warning');
      handleClickOpenPopupMalert();
    } else {
      sendRequestCheckList();
    }
  };

  const sendRequestCheckList = async () => {
    setPageName(!pageName);
    let combinedGroups = groupDetails?.map((data) => {
      let check = (data.data !== undefined && data.data !== '') || data.files !== undefined;

      if (check) {
        return {
          ...data,
          completedby: completedbyName,
          completedat: new Date(),
        };
      } else {
        return {
          ...data,
          completedby: '',
          completedat: '',
        };
      }
    });

    try {
      let assignbranches = await axios.put(`${SERVICE.MYCHECKLIST_SINGLE}/${assignDetails?._id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        commonid: assignDetails?.commonid,
        module: assignDetails?.module,
        submodule: assignDetails?.submodule,
        mainpage: assignDetails?.mainpage,
        subpage: assignDetails?.subpage,
        subsubpage: assignDetails?.subsubpage,
        category: assignDetails?.category,
        subcategory: assignDetails?.subcategory,
        candidatename: assignDetails?.fullname,
        status: 'Completed',
        groups: combinedGroups,
        updatedby: [
          ...assignDetails?.updatedby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      handleCloseModEditCheckList();
      setIsCheckedListOverall(false);
      sendEditStatus();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // Show All Columns & Manage Columns
  const initialColumnVisibilityTeamLveVerif = {
    serialNumber: true,
    checkbox: true,
    employeename: true,
    employeeid: true,
    leavetype: true,
    date: true,
    todate: true,
    numberofdays: true,
    reasonforleave: true,
    reportingto: true,
    actions: true,
    status: true,
    history: true,
    overallhistory: true,
    monthhistory: true,
  };

  const [columnVisibilityTeamLveVerif, setColumnVisibilityTeamLveVerif] = useState(initialColumnVisibilityTeamLveVerif);

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ''; // This is required for Chrome support
  };

  let dateselect = new Date();
  dateselect.setDate(dateselect.getDate() + 3);
  var ddt = String(dateselect.getDate()).padStart(2, '0');
  var mmt = String(dateselect.getMonth() + 1).padStart(2, '0');
  var yyyyt = dateselect.getFullYear();
  let formattedDatet = yyyyt + '-' + mmt + '-' + ddt;

  let datePresent = new Date();
  var ddp = String(datePresent.getDate());
  var mmp = String(datePresent.getMonth() + 1);
  var yyyyp = datePresent.getFullYear();
  let formattedDatePresent = yyyyp + '-' + mmp + '-' + ddp;

  const getinfoCodeStatus = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.APPLYLEAVE_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSelectStatus(res?.data?.sapplyleave);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const [selectedEmpData, setSelectedEmpData] = useState({});
  const [selectedEmpDataUpdate, setSelectedEmpDataUpdate] = useState({});
  const [historyOverAllData, setHistoryOverAllData] = useState([]);
  const [historyMonthData, setHistoryMonthData] = useState([]);
  const [historyOverAllDataUpdate, setHistoryOverAllDataUpdate] = useState([]);
  const [historyMonthDataUpdate, setHistoryMonthDataUpdate] = useState([]);

  const fetchLeaveHistoryUpdate = async (empid, empname) => {
    if (selectStatus.status === 'Rejected' && selectStatus.rejectedreason === '') {
      setPopupContentMalert('Please Enter Reason');
      setPopupSeverityMalert('warning');
      handleClickOpenPopupMalert();
    } else {
      try {
        // Get the current month and year
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();
        let res_vendor = await axios.post(SERVICE.APPLYLEAVE_EMPLOYEEID_FILTER, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          employeeid: empid,
        });

        let uninformResult = res_vendor?.data?.applyleaves;

        if (uninformResult?.length > 0) {
          // Filter for the current month's data
          const monthlyData = uninformResult.filter((item) => {
            return item.date.some((date) => {
              const leaveDate = new Date(date.split('/').reverse().join('-'));

              return leaveDate.getMonth() + 1 === currentMonth && leaveDate.getFullYear() === currentYear;
            });
          });

          // Function to calculate leave counts grouped by leavetype
          const calculateLeaveCounts = (data, type) => {
            return data.reduce((acc, item) => {
              const key = `${item.employeeid}_${item.leavetype}`;

              if (!acc[key]) {
                acc[key] = {
                  employeename: item.employeename,
                  employeeid: item.employeeid,
                  leavetype: item.leavetype,
                  approvedCount: 0,
                  appliedCount: 0,
                  rejectedCount: 0,
                  uninformedCount: 0,
                };
              }
              // Loop through all dates to count leaves separately for each date
              item.date.forEach((date) => {
                const leaveDate = new Date(date.split('/').reverse().join('-'));

                if (type === 'Month' && leaveDate.getMonth() + 1 === currentMonth && leaveDate.getFullYear() === currentYear) {
                  // Count Approved, Applied, and Rejected statuses
                  if (item.status === 'Approved') {
                    acc[key].approvedCount += 1;
                  } else if (item.status === 'Applied') {
                    acc[key].appliedCount += 1;
                  } else if (item.status === 'Rejected') {
                    acc[key].rejectedCount += 1;
                  }
                } else {
                  // Count Approved, Applied, and Rejected statuses
                  if (item.status === 'Approved') {
                    acc[key].approvedCount += 1;
                  } else if (item.status === 'Applied') {
                    acc[key].appliedCount += 1;
                  } else if (item.status === 'Rejected') {
                    acc[key].rejectedCount += 1;
                  }
                }
                if (item.commonuninformedleavestatus === 'Uninformed') {
                  acc[key].uninformedCount += 1;
                }
                setSelectedEmpDataUpdate({
                  employeename: item.employeename,
                  employeeid: item.employeeid,
                });
              });
              return acc;
            }, {});
          };

          // Calculate leave counts for overall and monthly data
          const overallLeaveCounts = calculateLeaveCounts(uninformResult, 'Overall');
          const monthlyLeaveCounts = calculateLeaveCounts(monthlyData, 'Month');

          // Transform the counts object into an array format
          const transformCounts = (counts) => Object.values(counts);

          setHistoryOverAllDataUpdate(transformCounts(overallLeaveCounts));
          setHistoryMonthDataUpdate(transformCounts(monthlyLeaveCounts));
        } else {
          setSelectedEmpData({ employeename: empname, employeeid: empid });
          setHistoryOverAllData([]);
          setHistoryMonthData([]);
        }
        handleClickOpenHistoryUpdate();
      } catch (err) {
        handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
      }
    }
  };

  //Project updateby edit page...
  let updatedByStatus = selectStatus.updatedby;

  //editing the single data...

  const sendEditStatus = async () => {
    handleCloseerr();
    setPageName(!pageName);
    try {
      let res = await axios.put(`${SERVICE.APPLYLEAVE_SINGLE}/${selectStatus._id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        status: String(selectStatus.status),
        rejectedreason: String(selectStatus.status === 'Rejected' ? selectStatus.rejectedreason : ''),
        actionby: String(isUserRoleAccess.companyname),
        updatedby: [
          ...updatedByStatus,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await fetchApplyleave();
      handleStatusClose();
      setPopupContent('Updated Successfully');
      setPopupSeverity('success');
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const editStatus = () => {
    handleCloseModHistoryUpdate();
    if (selectStatus.status === 'Rejected') {
      if (selectStatus.rejectedreason == '') {
        setPopupContentMalert('Please Enter Reject Reason');
        setPopupSeverityMalert('warning');
        handleClickOpenPopupMalert();
      } else {
        sendEditStatus();
      }
    } else if (selectStatus.status == 'Approved') {
      if (isAssigned) {
        if (isCheckList) {
          handleClickOpenEditCheckList();
        } else {
          setPopupContentMalert(
            <>
              Please Fill the Checklist. Click this link:{' '}
              <a href="/interview/myinterviewchecklist" target="_blank" rel="noopener noreferrer">
                My Checklist
              </a>
            </>
          );
          setPopupSeverityMalert('warning');
          handleClickOpenPopupMalert();
        }
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: '100px', color: 'orange' }} />
            <p style={{ fontSize: '20px', fontWeight: 900 }}>{'Checklist is Not Assigned for this Page. Wish to continue?'}</p>
          </>
        );
        handleClickOpenerr();
      }
    } else {
      sendEditStatus();
    }
  };

  //get all Sub vendormasters.
  const fetchApplyleave = async () => {
    setApplyleavecheck(false);
    setPageName(!pageName);
    try {
      let res_employee = await axios.post(SERVICE.APPLYLEAVE_FILTERED_HIERARCHY_PAGE_BASED, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        hierachy: modeselection.value,
        sector: sectorSelection.value,
        username: isUserRoleAccess.companyname,
        team: isUserRoleAccess.team,
        pagename: 'menuteamleaveverification',
      });

      setApplyleavecheck(true);
      if (res_employee?.data?.resultedTeam?.length > 0 && res_employee?.data?.resultAccessFilter?.length < 1 && ['myallhierarchy', 'allhierarchy']?.includes(modeselection.value)) {
        setIsBtn(false);
        setApplyleavecheck(true);
        setUpdated(null);
        alert('Some employees have not been given access to this page.');
      }
      let answer = res_employee?.data?.resultAccessFilter?.length > 0 ? res_employee?.data?.resultAccessFilter?.filter((data) => data?.updatestatus === 'Not Completed') : [];
      let answerCompleted = res_employee?.data?.resultAccessFilter?.length > 0 ? res_employee?.data?.resultAccessFilter?.filter((data) => data?.updatestatus === 'Completed') : [];

      // Get the current month and year
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();

      let res_vendor = await axios.get(SERVICE.APPLYLEAVE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let uninformResult = res_vendor?.data?.applyleaves;
      let overallLeaveCounts = {};
      let monthlyLeaveCounts = {};

      if (uninformResult?.length > 0) {
        // Filter for the current month's data
        const monthlyData = uninformResult.filter((item) => {
          return item.date.some((date) => {
            const leaveDate = new Date(date.split('/').reverse().join('-'));

            return leaveDate.getMonth() + 1 === currentMonth && leaveDate.getFullYear() === currentYear;
          });
        });

        // Function to calculate leave counts grouped by leavetype
        const calculateLeaveCounts = (data, type) => {
          return data.reduce((acc, item) => {
            // const key = `${item.employeeid}_${item.leavetype}`;
            const key = item.employeeid;

            if (!acc[key]) {
              acc[key] = {
                employeename: item.employeename,
                employeeid: item.employeeid,
                leavetype: item.leavetype,
                status: item.status,
                approvedCount: 0,
                appliedCount: 0,
                rejectedCount: 0,
              };
            }

            // Loop through all dates to count leaves separately for each date
            item.date.forEach((date) => {
              const leaveDate = new Date(date.split('/').reverse().join('-')); // Convert DD/MM/YYYY to YYYY-MM-DD
              // console.log(date, 'date')
              if (type === 'Month' && leaveDate.getMonth() + 1 === currentMonth && leaveDate.getFullYear() === currentYear) {
                // Increment counts for each valid leave date
                // console.log(item.status)
                if (item.status === 'Approved') {
                  acc[key].approvedCount += 1;
                } else if (item.status === 'Applied') {
                  acc[key].appliedCount += 1;
                } else if (item.status === 'Rejected') {
                  acc[key].rejectedCount += 1;
                }
              }
              if (type === 'Overall') {
                if (item.status === 'Approved') {
                  acc[key].approvedCount += 1;
                } else if (item.status === 'Applied') {
                  acc[key].appliedCount += 1;
                } else if (item.status === 'Rejected') {
                  acc[key].rejectedCount += 1;
                }
              }
            });
            return acc;
          }, {});
        };

        // Calculate leave counts for overall and monthly data
        overallLeaveCounts = calculateLeaveCounts(uninformResult, 'Overall');
        monthlyLeaveCounts = calculateLeaveCounts(monthlyData, 'Month');
      }

      const itemsWithSerialNumberNotCompleted = answer.map((item, index) => {
        // const groupedItemOverAllNotCompleted = overallLeaveCounts[`${item.employeeid}_${item.leavetype}`];
        // const groupedItemMonthNotCompleted = monthlyLeaveCounts[`${item.employeeid}_${item.leavetype}`];

        const groupedItemOverAllNotCompleted = overallLeaveCounts[item.employeeid];
        const groupedItemMonthNotCompleted = monthlyLeaveCounts[item.employeeid];

        return {
          ...item,
          id: item._id,
          serialNumber: index + 1,
          // overAllappliedCount: groupedItemOverAllNotCompleted?.appliedCount ? `${groupedItemOverAllNotCompleted?.leavetype}_${groupedItemOverAllNotCompleted?.status}_${groupedItemOverAllNotCompleted?.appliedCount}` : 0,
          // overAllapprovedCount: groupedItemOverAllNotCompleted?.approvedCount ? `${groupedItemOverAllNotCompleted?.leavetype}_${groupedItemOverAllNotCompleted?.status}_${groupedItemOverAllNotCompleted?.approvedCount}` : 0,
          // overAllrejectedCount: groupedItemOverAllNotCompleted?.rejectedCount ? `${groupedItemOverAllNotCompleted?.leavetype}_${groupedItemOverAllNotCompleted?.status}_${groupedItemOverAllNotCompleted?.rejectedCount}` : 0,
          // monthlyappliedCount: groupedItemMonthNotCompleted?.appliedCount ? `${groupedItemMonthNotCompleted?.leavetype}_${groupedItemOverAllNotCompleted?.status}_${groupedItemOverAllNotCompleted?.appliedCount}` : 0,
          // monthlyapprovedCount: groupedItemMonthNotCompleted?.approvedCount ? `${groupedItemMonthNotCompleted?.leavetype}_${groupedItemOverAllNotCompleted?.status}_${groupedItemOverAllNotCompleted?.approvedCount}` : 0,
          // monthlyrejectedCount: groupedItemMonthNotCompleted?.rejectedCount ? `${groupedItemMonthNotCompleted?.leavetype}_${groupedItemOverAllNotCompleted?.status}_${groupedItemOverAllNotCompleted?.rejectedCount}` : 0,

          overAllappliedCount: groupedItemOverAllNotCompleted?.appliedCount || 0,
          overAllapprovedCount: groupedItemOverAllNotCompleted?.approvedCount || 0,
          overAllrejectedCount: groupedItemOverAllNotCompleted?.rejectedCount || 0,
          monthlyappliedCount: groupedItemMonthNotCompleted?.appliedCount || 0,
          monthlyapprovedCount: groupedItemMonthNotCompleted?.approvedCount || 0,
          monthlyrejectedCount: groupedItemMonthNotCompleted?.rejectedCount || 0,
        };
      });

      // console.log(itemsWithSerialNumberNotCompleted, 'itemsWithSerialNumberNotCompleted');
      const itemsWithSerialNumberCompleted = answerCompleted?.map((item, index) => {
        const groupedItemOverAllCompleted = overallLeaveCounts[item.employeeid];
        const groupedItemMonthCompleted = monthlyLeaveCounts[item.employeeid];
        return {
          ...item,
          id: item._id,
          serialNumber: index + 1,
          overAllappliedCount: groupedItemOverAllCompleted?.appliedCount || 0,
          overAllapprovedCount: groupedItemOverAllCompleted?.approvedCount || 0,
          overAllrejectedCount: groupedItemOverAllCompleted?.rejectedCount || 0,
          monthlyappliedCount: groupedItemMonthCompleted?.appliedCount || 0,
          monthlyapprovedCount: groupedItemMonthCompleted?.approvedCount || 0,
          monthlyrejectedCount: groupedItemMonthCompleted?.rejectedCount || 0,
        };
      });

      setApplyleaves(itemsWithSerialNumberNotCompleted);
      setCompletedApplyleaves(itemsWithSerialNumberCompleted);
      // setApplyleaves(answer.map((item, index) => ({ ...item, serialNumber: index + 1 })));
      // setCompletedApplyleaves(answerCompleted.map((item, index) => ({ ...item, serialNumber: index + 1 })));
      setTotalPagesTeamLveVerif(Math.ceil(answer.length / pageSizeTeamLveVerif));
      setUpdated(null);
      setIsApplyLeave([]);
    } catch (err) {
      setApplyleavecheck(true);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    if (updated !== null) {
      fetchApplyleave();
    }
  }, [updated]);

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener('beforeunload', beforeUnloadHandler);
    return () => {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
    };
  }, []);

  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = applyleaves?.map((item, index) => ({
      ...item,
      id: item._id,
      serialNumber: item.serialNumber,
      employeeid: item.employeeid,
      employeename: item.employeename,
      leavetype: item.leavetype,
      // date: item.date + "--" + item.todate,
      date: item.date,
      numberofdays: item.numberofdays === '' ? '---' : item.numberofdays,
      reasonforleave: item.reasonforleave,
      status: item.status,
    }));
    setItems(itemsWithSerialNumber);
    setFilteredDataItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [applyleaves]);

  const defaultColDef = useMemo(() => {
    return {
      filter: true,
      resizable: true,
      filterParams: {
        buttons: ['apply', 'reset', 'cancel'],
      },
    };
  }, []);

  const onGridReady = useCallback((params) => {
    setGridApi(params.api);
    setColumnApi(params.columnApi);
  }, []);

  // Function to handle filter changes
  const onFilterChanged = () => {
    if (gridApi) {
      const filterModel = gridApi.getFilterModel(); // Get the current filter model

      // Check if filters are active
      if (Object.keys(filterModel).length === 0) {
        // No filters active, clear the filtered data state
        setFilteredRowData([]);
      } else {
        // Filters are active, capture filtered data
        const filteredData = [];
        gridApi.forEachNodeAfterFilterAndSort((node) => {
          filteredData.push(node.data); // Collect filtered row data
        });
        setFilteredRowData(filteredData);
      }
    }
  };

  const onPaginationChanged = useCallback(() => {
    if (gridRefTableTeamLveVerif.current) {
      const gridApi = gridRefTableTeamLveVerif.current.api;
      const currentPage = gridApi.paginationGetCurrentPage() + 1;
      const totalPagesTeamLveVerif = gridApi.paginationGetTotalPages();
      setPageTeamLveVerif(currentPage);
      setTotalPagesTeamLveVerif(totalPagesTeamLveVerif);
    }
  }, []);

  // Pagination for innter filter
  const getVisiblePageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 3;

    const startPage = Math.max(1, pageTeamLveVerif - 1);
    const endPage = Math.min(totalPagesTeamLveVerif, startPage + maxVisiblePages - 1);

    // Loop through and add visible pageTeamLveVerif numbers
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    // If there are more pages after the last visible pageTeamLveVerif, show ellipsis
    if (endPage < totalPagesTeamLveVerif) {
      pageNumbers.push('...');
    }

    return pageNumbers;
  };

  // Pagination for outer filter
  const filteredData = filteredDataItems?.slice((pageTeamLveVerif - 1) * pageSizeTeamLveVerif, pageTeamLveVerif * pageSizeTeamLveVerif);
  const totalPagesTeamLveVerifOuter = Math.ceil(filteredDataItems?.length / pageSizeTeamLveVerif);
  const visiblePages = Math.min(totalPagesTeamLveVerifOuter, 3);
  const firstVisiblePage = Math.max(1, pageTeamLveVerif - 1);
  const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPagesTeamLveVerifOuter);
  const pageNumbers = [];
  const indexOfLastItem = pageTeamLveVerif * pageSizeTeamLveVerif;
  const indexOfFirstItem = indexOfLastItem - pageSizeTeamLveVerif;
  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  }

  const columnDataTableTeamLveVerif = [
    {
      field: 'serialNumber',
      headerName: 'SNo',
      flex: 0,
      width: 80,
      hide: !columnVisibilityTeamLveVerif.serialNumber,
      headerClassName: 'bold-header',
      pinned: 'left',
      lockPinned: true,
    },
    {
      field: 'employeeid',
      headerName: 'Employee Id',
      flex: 0,
      width: 150,
      hide: !columnVisibilityTeamLveVerif.employeeid,
      headerClassName: 'bold-header',
      pinned: 'left',
      lockPinned: true,
    },
    {
      field: 'employeename',
      headerName: 'Employee Name',
      flex: 0,
      width: 270,
      hide: !columnVisibilityTeamLveVerif.employeename,
      headerClassName: 'bold-header',
      pinned: 'left',
      lockPinned: true,
    },
    {
      field: 'leavetype',
      headerName: 'Leave Type',
      flex: 0,
      width: 170,
      hide: !columnVisibilityTeamLveVerif.leavetype,
      headerClassName: 'bold-header',
    },
    {
      field: 'date',
      headerName: 'Date',
      flex: 0,
      width: 120,
      hide: !columnVisibilityTeamLveVerif.date,
      headerClassName: 'bold-header',
    },
    {
      field: 'numberofdays',
      headerName: 'Number of Days',
      flex: 0,
      width: 170,
      hide: !columnVisibilityTeamLveVerif.numberofdays,
      headerClassName: 'bold-header',
    },
    {
      field: 'reasonforleave',
      headerName: 'Reason For Leave',
      flex: 0,
      width: 250,
      hide: !columnVisibilityTeamLveVerif.reasonforleave,
      headerClassName: 'bold-header',
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0,
      width: 150,
      hide: !columnVisibilityTeamLveVerif.status,
      headerClassName: 'bold-header',
      cellRenderer: (params) => {
        if (!(isUserRoleAccess?.role?.includes('Manager') || isUserRoleAccess?.role?.includes('HiringManager') || isUserRoleAccess?.role?.includes('HR') || isUserRoleAccess?.role?.includes('Superadmin')) && !['Approved'].includes(params.data.status)) {
          return (
            <Grid sx={{ display: 'flex' }}>
              <Button
                variant="contained"
                style={{
                  margin: '5px',
                  backgroundColor: params.value === 'Applied' ? '#FFC300' : params.value === 'Approved' ? 'green' : 'inherit',
                  color: params.value === 'Applied' ? 'black' : 'white',
                  fontSize: '10px',
                  width: '60px',
                  fontWeight: 'bold',
                }}
              >
                {params.value}
              </Button>
            </Grid>
          );
        } else {
          return (
            <Grid sx={{ display: 'flex' }}>
              <Button
                variant="contained"
                style={{
                  margin: '5px',
                  backgroundColor: params.value === 'Applied' ? '#FFC300' : params.value === 'Approved' ? 'green' : 'inherit',
                  color: params.value === 'Applied' ? 'black' : 'white',
                  fontSize: '10px',
                  width: '60px',
                  fontWeight: 'bold',
                }}
              >
                {params.value}
              </Button>
            </Grid>
          );
        }
      },
    },
    {
      field: 'overallhistory',
      headerName: 'History',
      flex: 0,
      width: 250,
      hide: !columnVisibilityTeamLveVerif.overallhistory,
      cellStyle: cellStyles,
      headerClass: 'header-wrap',
      cellRenderer: (params) => (
        <Grid>
          <Typography variant="body2">Total Applied: {params.data.overAllappliedCount}</Typography>
          <Typography variant="body2">Total Approved: {params.data.overAllapprovedCount}</Typography>
          <Typography variant="body2">Total Rejected: {params.data.overAllrejectedCount}</Typography>
        </Grid>
      ),
    },
    {
      field: 'monthhistory',
      headerName: 'Current Month History',
      flex: 0,
      width: 250,
      hide: !columnVisibilityTeamLveVerif.monthhistory,
      cellStyle: cellStyles,
      headerClass: 'header-wrap',
      cellRenderer: (params) => (
        <Grid>
          <Typography variant="body2">Total Applied: {params.data.monthlyappliedCount}</Typography>
          <Typography variant="body2">Total Approved: {params.data.monthlyapprovedCount}</Typography>
          <Typography variant="body2">Total Rejected: {params.data.monthlyrejectedCount}</Typography>
        </Grid>
      ),
    },
    {
      field: 'actions',
      headerName: 'Action',
      flex: 0,
      width: 100,
      minHeight: '40px !important',
      filter: false,
      sortable: false,
      hide: !columnVisibilityTeamLveVerif.actions,
      headerClassName: 'bold-header',
      cellRenderer: (params) => (
        <Grid sx={{ display: 'flex' }}>
          {isUserRoleCompare?.includes('iteamleaveverification') && (
            <Button
              variant="contained"
              style={{
                margin: '5px',
                backgroundColor: 'red',
                minWidth: '15px',
                padding: '6px 5px',
              }}
              onClick={(e) => {
                getinfoCodeStatus(params.data.id);
                handleStatusOpen();
                setIsInidvidualStatus(params.data);
                getCodeNew(params.data);
              }}
            >
              <FaEdit style={{ color: 'white', fontSize: '17px' }} />
            </Button>
          )}
        </Grid>
      ),
    },
  ];

  // Datatable
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQueryTeamLveVerif(value);
    applyNormalFilter(value);
    setFilteredRowData([]);
  };

  const DateFrom = (isUserRoleAccess.role.includes('HiringManager') || isUserRoleAccess.role.includes('Manager') || isUserRoleCompare.includes('lteamleaveverification')) && Accessdrop === 'HR' ? formattedDatePresent : formattedDatet;

  const applyNormalFilter = (searchValue) => {
    // Split the search query into individual terms
    const searchTerms = searchValue.toLowerCase().split(' ');

    // Modify the filtering logic to check each term
    const filtered = items?.filter((item) => {
      return searchTerms.every((term) => Object.values(item).join(' ').toLowerCase().includes(term));
    });
    setFilteredDataItems(filtered);
    setPageTeamLveVerif(1);
  };

  const applyAdvancedFilter = (filters, logicOperator) => {
    // Apply filtering logic with multiple conditions
    const filtered = items?.filter((item) => {
      return filters.reduce((acc, filter, index) => {
        const { column, condition, value } = filter;
        const itemValue = String(item[column])?.toLowerCase();
        const filterValue = String(value).toLowerCase();

        let match;
        switch (condition) {
          case 'Contains':
            match = itemValue.includes(filterValue);
            break;
          case 'Does Not Contain':
            match = !itemValue?.includes(filterValue);
            break;
          case 'Equals':
            match = itemValue === filterValue;
            break;
          case 'Does Not Equal':
            match = itemValue !== filterValue;
            break;
          case 'Begins With':
            match = itemValue.startsWith(filterValue);
            break;
          case 'Ends With':
            match = itemValue.endsWith(filterValue);
            break;
          case 'Blank':
            match = !itemValue;
            break;
          case 'Not Blank':
            match = !!itemValue;
            break;
          default:
            match = true;
        }

        // Combine conditions with AND/OR logic
        if (index === 0) {
          return match; // First filter is applied directly
        } else if (logicOperator === 'AND') {
          return acc && match;
        } else {
          return acc || match;
        }
      }, true);
    });

    setFilteredDataItems(filtered);
    setAdvancedFilter(filters);
    // handleCloseSearchTeamLveVerif();
  };

  // Undo filter funtion
  const handleResetSearch = () => {
    setAdvancedFilter(null);
    setSearchQueryTeamLveVerif('');
    setFilteredDataItems(applyleaves);
  };

  // Show filtered combination in the search bar
  const getSearchDisplay = () => {
    if (advancedFilter && advancedFilter.length > 0) {
      return advancedFilter
        .map((filter, index) => {
          let showname = columnDataTableTeamLveVerif.find((col) => col.field === filter.column)?.headerName;
          return `${showname} ${filter.condition} "${filter.value}"`;
        })
        .join(' ' + (advancedFilter.length > 1 ? advancedFilter[1].condition : '') + ' ');
    }
    return searchQueryTeamLveVerif;
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPagesTeamLveVerif) {
      setPageTeamLveVerif(newPage);
      gridRefTableTeamLveVerif.current.api.paginationGoToPage(newPage - 1);
    }
  };

  const handlePageSizeChange = (e) => {
    const newSize = Number(e.target.value);
    setPageSizeTeamLveVerif(newSize);
    if (gridApi) {
      gridApi.paginationSetPageSize(newSize);
    }
  };

  // Show All Columns functionality
  const handleShowAllColumns = () => {
    const updatedVisibility = { ...columnVisibilityTeamLveVerif };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibilityTeamLveVerif(updatedVisibility);
  };

  // // Function to filter columns based on search query
  const filteredColumns = columnDataTableTeamLveVerif.filter((column) => column.headerName.toLowerCase().includes(searchQueryManageTeamLveVerif.toLowerCase()));

  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  // Manage Columns functionality
  const toggleColumnVisibility = (field) => {
    if (!gridApi) return;

    setColumnVisibilityTeamLveVerif((prevVisibility) => {
      const newVisibility = !prevVisibility[field];

      // Update the visibility in the grid
      gridApi.setColumnVisible(field, newVisibility);

      return {
        ...prevVisibility,
        [field]: newVisibility,
      };
    });
  };

  const handleColumnMoved = useCallback(
    debounce((event) => {
      if (!event.columnApi) return;

      const visible_columns = event.columnApi
        .getAllColumns()
        .filter((col) => {
          const colState = event.columnApi.getColumnState().find((state) => state.colId === col.colId);
          return colState && !colState.hide;
        })
        .map((col) => col.colId);

      setColumnVisibilityTeamLveVerif((prevVisibility) => {
        const updatedVisibility = { ...prevVisibility };

        // Ensure columns that are visible stay visible
        Object.keys(updatedVisibility).forEach((colId) => {
          updatedVisibility[colId] = visible_columns.includes(colId);
        });

        return updatedVisibility;
      });
    }, 300),
    []
  );

  const handleColumnVisible = useCallback((event) => {
    const colId = event.column.getColId();

    // Update visibility based on event, but only when explicitly triggered by grid
    setColumnVisibilityTeamLveVerif((prevVisibility) => ({
      ...prevVisibility,
      [colId]: event.visible, // Set visibility directly from the event
    }));
  }, []);

  // Excel
  const [fileFormat, setFormat] = useState('');
  // let exportColumnNamescrt = ["Employee Id", "Employee Name", "Leavetype", "Date", "Number of Days", "Reason for leave", "Status"]
  // let exportRowValuescrt = ["employeeid", "employeename", "leavetype", "date", "numberofdays", "reasonforleave", "status"]

  const fileExtension = fileFormat === 'xl' ? 'xlsx' : 'csv';
  const handleExportXL = async (isfilter) => {
    let formattedData = [];
    let resultdata = (filteredRowData.length > 0 ? filteredRowData : filteredData) ?? [];

    if (isfilter === 'filtered') {
      formattedData = resultdata.map((row, index) => {
        const overallHistory = [`Total Applied: ${row.overAllappliedCount || ''}`, `Total Approved: ${row.overAllapprovedCount || ''}`, `Total Rejected: ${row.overAllrejectedCount || ''}`].join('\n');

        const monthHistory = [`Total Applied: ${row.monthlyappliedCount || ''}`, `Total Approved: ${row.monthlyapprovedCount || ''}`, `Total Rejected: ${row.monthlyrejectedCount || ''}`].join('\n');

        return {
          SNo: index + 1,
          'Employee Id': row.employeeid,
          'Employee Name': row.employeename,
          'Leave Type': row.leavetype,
          Date: row.date.join(','),
          'Number of Days': row.noofshift,
          'Reason for leave': row.reasonforleave,
          Status: row.status,
          History: overallHistory,
          'Current Month History': monthHistory,
        };
      });
    } else if (isfilter === 'overall') {
      formattedData = items.map((row, index) => {
        const overallHistory = [`Total Applied: ${row.overAllappliedCount || ''}`, `Total Approved: ${row.overAllapprovedCount || ''}`, `Total Rejected: ${row.overAllrejectedCount || ''}`].join('\n');

        const monthHistory = [`Total Applied: ${row.monthlyappliedCount || ''}`, `Total Approved: ${row.monthlyapprovedCount || ''}`, `Total Rejected: ${row.monthlyrejectedCount || ''}`].join('\n');

        return {
          SNo: index + 1,
          'Employee Id': row.employeeid,
          'Employee Name': row.employeename,
          'Leave Type': row.leavetype,
          Date: row.date.join(','),
          'Number of Days': row.noofshift,
          'Reason for leave': row.reasonforleave,
          Status: row.status,
          History: overallHistory,
          'Current Month History': monthHistory,
        };
      });
    }

    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Table Data');

    // Add column headers
    worksheet.columns = [
      { header: 'SNo', key: 'SNo', width: 10 },
      { header: 'Employee Id', key: 'Employee Id', width: 15 },
      { header: 'Employee Name', key: 'Employee Name', width: 20 },
      { header: 'Leave Type', key: 'Leave Type', width: 15 },
      { header: 'Date', key: 'Date', width: 20 },
      { header: 'Number of Days', key: 'Number of Days', width: 25 },
      { header: 'Reason for leave', key: 'Reason for leave', width: 20 },
      { header: 'Status', key: 'Status', width: 15 },
      { header: 'History', key: 'History', width: 40 },
      {
        header: 'Current Month History',
        key: 'Current Month History',
        width: 40,
      },
    ];

    // Add rows
    formattedData.forEach((data) => {
      worksheet.addRow(data);
    });

    // Apply text wrapping for specific columns
    worksheet.getColumn('History').eachCell((cell) => {
      cell.alignment = { wrapText: true, vertical: 'top' };
    });

    worksheet.getColumn('Current Month History').eachCell((cell) => {
      cell.alignment = { wrapText: true, vertical: 'top' };
    });

    // Export the file
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `Team Leave Verification.${fileExtension}`);
    setIsFilterOpen(false);
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Team Leave Verification',
    pageStyle: 'print',
  });

  // pdf
  const downloadPdf = (isfilter) => {
    const doc = new jsPDF({ orientation: 'landscape' });

    // Define the table headers
    const headers = ['SNo', 'Employee Id', 'Employee Name', 'Leavetype', 'Date', 'Number of Days', 'Reason for leave', 'Status', 'History', 'Current Month History'];

    let data = [];
    let resultdata = (filteredRowData.length > 0 ? filteredRowData : filteredData) ?? [];

    if (isfilter === 'filtered') {
      data = resultdata.map((row, index) => {
        const overallHistory = [`Total Applied: ${row.overAllappliedCount || ''}`, `Total Approved: ${row.overAllapprovedCount || ''}`, `Total Rejected: ${row.overAllrejectedCount || ''}`].join('\n');

        const monthHistory = [`Total Applied: ${row.monthlyappliedCount || ''}`, `Total Approved: ${row.monthlyapprovedCount || ''}`, `Total Rejected: ${row.monthlyrejectedCount || ''}`].join('\n');

        return [index + 1, row.employeeid, row.employeename, row.leavetype, row.date.join(','), row.noofshift, row.reasonforleave, row.status, overallHistory, monthHistory];
      });
    } else if (isfilter === 'overall') {
      data = items.map((row, index) => {
        const overallHistory = [`Total Applied: ${row.overAllappliedCount || ''}`, `Total Approved: ${row.overAllapprovedCount || ''}`, `Total Rejected: ${row.overAllrejectedCount || ''}`].join('\n');

        const monthHistory = [`Total Applied: ${row.monthlyappliedCount || ''}`, `Total Approved: ${row.monthlyapprovedCount || ''}`, `Total Rejected: ${row.monthlyrejectedCount || ''}`].join('\n');

        return [index + 1, row.employeeid, row.employeename, row.leavetype, row.date.join(','), row.noofshift, row.reasonforleave, row.status, overallHistory, monthHistory];
      });
    }

    // Split data into chunks to fit on pages
    const columnsPerSheet = 10; // Number of columns per sheet
    const chunks = [];

    for (let i = 0; i < headers.length; i += columnsPerSheet) {
      const chunkHeaders = headers.slice(i, i + columnsPerSheet);
      const chunkData = data.map((row) => row.slice(i, i + columnsPerSheet + 1));

      chunks.push({ headers: chunkHeaders, data: chunkData });
    }

    chunks.forEach((chunk, index) => {
      if (index > 0) {
        doc.addPage({ orientation: 'landscape' });
      }

      doc.autoTable({
        theme: 'grid',
        styles: { fontSize: 8 },
        head: [chunk.headers],
        body: chunk.data,
        startY: 20,
        margin: { top: 20, left: 10, right: 10, bottom: 10 },
      });
    });

    doc.save('Team Leave Verification.pdf');
  };

  // image
  const handleCaptureImage = () => {
    if (gridRefImageTeamLveVerif.current) {
      domtoimage
        .toBlob(gridRefImageTeamLveVerif.current)
        .then((blob) => {
          saveAs(blob, 'Team Leave Verification.png');
        })
        .catch((error) => {
          console.error('dom-to-image error: ', error);
        });
    }
  };

  return (
    <Box>
      <Headtitle title={'TEAM LEAVE VERIFICATION'} />
      {/* ****** Header Content ****** */}
      <PageHeading title="Team Leave Verification" modulename="Leave&Permission" submodulename="Leave" mainpagename="Team Leave Verification" subpagename="" subsubpagename="" />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes('lteamleaveverification') && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>Team Leave Verification List</Typography>
            </Grid>
            <Grid container spacing={2} style={userStyle.dataTablestyle}>
              <Grid item md={2} xs={12} sm={12}>
                <Box>
                  <label>Show entries:</label>
                  <Select
                    id="pageSizeSelect"
                    value={pageSizeTeamLveVerif}
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
                    <MenuItem value={applyleaves?.length}>All</MenuItem>
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
                  {isUserRoleCompare?.includes('excelteamleaveverification') && (
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
                  {isUserRoleCompare?.includes('csvteamleaveverification') && (
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
                  {isUserRoleCompare?.includes('printteamleaveverification') && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes('pdfteamleaveverification') && (
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
                  {isUserRoleCompare?.includes('imageteamleaveverification') && (
                    <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                      {' '}
                      <ImageIcon sx={{ fontSize: '15px' }} /> &ensp;Image&ensp;{' '}
                    </Button>
                  )}
                </Box>
              </Grid>
              <Grid item md={2} xs={6} sm={6}>
                <FormControl fullWidth size="small">
                  <OutlinedInput
                    size="small"
                    id="outlined-adornment-weight"
                    startAdornment={
                      <InputAdornment position="start">
                        <FaSearch />
                      </InputAdornment>
                    }
                    endAdornment={
                      <InputAdornment position="end">
                        {advancedFilter && (
                          <IconButton onClick={handleResetSearch}>
                            <MdClose />
                          </IconButton>
                        )}
                        <Tooltip title="Show search options">
                          <span>
                            <IoMdOptions style={{ cursor: 'pointer' }} onClick={handleClickSearchTeamLveVerif} />
                          </span>
                        </Tooltip>
                      </InputAdornment>
                    }
                    aria-describedby="outlined-weight-helper-text"
                    inputProps={{ 'aria-label': 'weight' }}
                    type="text"
                    value={getSearchDisplay()}
                    onChange={handleSearchChange}
                    placeholder="Type to search..."
                    disabled={!!advancedFilter}
                  />
                </FormControl>
              </Grid>
            </Grid>{' '}
            <br />
            <Grid container spacing={2}>
              <Grid item lg={1.5} md={1} xs={12} sm={6}>
                <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
                  Show All Columns
                </Button>
              </Grid>
              <Grid item lg={1.5} md={1} xs={12} sm={6}>
                <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsTeamLveVerif}>
                  Manage Columns
                </Button>
              </Grid>
              <Grid item lg={2} md={2.5} xs={12} sm={6}>
                <Selects
                  options={modeDropDowns}
                  styles={colourStyles}
                  value={{
                    label: modeselection.label,
                    value: modeselection.value,
                  }}
                  onChange={(e) => setModeSelection(e)}
                />
              </Grid>
              <Grid item lg={2} md={2.5} xs={12} sm={6}>
                <Selects
                  options={sectorDropDowns}
                  styles={colourStyles}
                  value={{
                    label: sectorSelection.label,
                    value: sectorSelection.value,
                  }}
                  onChange={(e) => setSectorSelection(e)}
                />
              </Grid>
              <Grid item lg={3} md={2} xs={12} sm={6}>
                <LoadingButton loading={isBtn} variant="contained" onClick={(e) => fetchApplyleave(e)}>
                  Filter
                </LoadingButton>
              </Grid>
            </Grid>
            {!applyleaveCheck ? (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                </Box>
              </>
            ) : (
              <>
                <Box sx={{ width: '100%' }} className={'ag-theme-quartz'} ref={gridRefImageTeamLveVerif}>
                  <AgGridReact
                    rowData={filteredDataItems}
                    columnDefs={columnDataTableTeamLveVerif.filter((column) => columnVisibilityTeamLveVerif[column.field])}
                    ref={gridRefTableTeamLveVerif}
                    defaultColDef={defaultColDef}
                    domLayout={'autoHeight'}
                    getRowStyle={getRowStyle}
                    pagination={true}
                    paginationPageSize={pageSizeTeamLveVerif}
                    onPaginationChanged={onPaginationChanged}
                    onGridReady={onGridReady}
                    onColumnMoved={handleColumnMoved}
                    onColumnVisible={handleColumnVisible}
                    onFilterChanged={onFilterChanged}
                    // suppressPaginationPanel={true}
                    suppressSizeToFit={true}
                    suppressAutoSize={true}
                    suppressColumnVirtualisation={true}
                    colResizeDefault={'shift'}
                    cellSelection={true}
                    copyHeadersToClipboard={true}
                    rowHeight={85}
                  />
                </Box>
              </>
            )}
            <br /> <br />
            <CompletedTeamLeaveVerification data={completedApplyleaves} setUpdated={setUpdated} />
          </Box>
        </>
      )}

      {/* Manage Column */}
      <Popover id={idTeamLveVerif} open={isManageColumnsOpenTeamLveVerif} anchorEl={anchorElTeamLveVerif} onClose={handleCloseManageColumnsTeamLveVerif} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
        <ManageColumnsContent
          handleClose={handleCloseManageColumnsTeamLveVerif}
          searchQuery={searchQueryManageTeamLveVerif}
          setSearchQuery={setSearchQueryManageTeamLveVerif}
          filteredColumns={filteredColumns}
          columnVisibility={columnVisibilityTeamLveVerif}
          toggleColumnVisibility={toggleColumnVisibility}
          setColumnVisibility={setColumnVisibilityTeamLveVerif}
          initialColumnVisibility={initialColumnVisibilityTeamLveVerif}
          columnDataTable={columnDataTableTeamLveVerif}
        />
      </Popover>

      {/* Search Bar */}
      <Popover id={idSearchTeamLveVerif} open={openSearchTeamLveVerif} anchorEl={anchorElSearchTeamLveVerif} onClose={handleCloseSearchTeamLveVerif} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <AdvancedSearchBar columns={columnDataTableTeamLveVerif?.filter((data) => data.field && data.field !== 'actions')} onSearch={applyAdvancedFilter} initialSearchValue={searchQueryTeamLveVerif} handleCloseSearch={handleCloseSearchTeamLveVerif} />
      </Popover>

      {/* dialog status change */}
      <Box>
        <Dialog maxWidth="lg" open={statusOpen} onClose={handleStatusClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent
            sx={{
              width: '700px',
              height: selectStatus.status == 'Rejected' ? '450px' : '400px',
              overflow: 'visible',
              '& .MuiPaper-root': {
                overflow: 'visible',
              },
            }}
          >
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sm={12}>
                <Typography sx={userStyle.HeaderText}>Edit Apply Status</Typography>
              </Grid>
              <Grid item md={6} xs={12} sm={6}>
                <Typography>
                  <b>Name:</b>
                  <b style={{ color: 'red' }}>{isInidvidualStatus?.employeename}</b>
                </Typography>
              </Grid>
              <Grid item md={6} xs={12} sm={6}>
                <Typography>
                  <b>Date:</b>
                  <b style={{ color: 'red' }}>{isInidvidualStatus?.date}</b>
                </Typography>
              </Grid>
              <Grid item md={4} xs={12} sm={4}>
                <Typography>
                  <b>No.of.Days:</b>
                  <b style={{ color: 'red' }}>{isInidvidualStatus?.numberofdays}</b>
                </Typography>
              </Grid>
              <Grid item md={8} xs={12} sm={8}>
                <Typography>
                  <b>LeaveType:</b>
                  <b style={{ color: 'red' }}>{isInidvidualStatus?.leavetype}</b>
                </Typography>
              </Grid>
              <Grid item md={12} xs={12} sm={12}>
                <Typography>
                  <b>OverallHistory:</b>
                  <b style={{ color: 'red' }}>
                    Applied:{isInidvidualStatus?.overAllappliedCount} / Approved:{isInidvidualStatus?.overAllapprovedCount} / Rejected:{isInidvidualStatus?.overAllrejectedCount}
                  </b>
                </Typography>
              </Grid>
              <Grid item md={12} xs={12} sm={12}>
                <Typography>
                  <b>CurrentMonthHistory:</b>
                  <b style={{ color: 'red' }}>
                    Applied:{isInidvidualStatus?.monthlyappliedCount} / Approved:{isInidvidualStatus?.monthlyapprovedCount} / Rejected:{isInidvidualStatus?.monthlyrejectedCount}
                  </b>
                </Typography>
              </Grid>
              <Grid item md={6} sm={6} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Status<b style={{ color: 'red' }}>*</b>
                  </Typography>
                  <Selects
                    fullWidth
                    options={[
                      { label: 'Approved', value: 'Approved' },
                      { label: 'Rejected', value: 'Rejected' },
                      { label: 'Applied', value: 'Applied' },
                      { label: 'Cancelled', value: 'Cancelled' },
                    ]}
                    value={{
                      label: selectStatus.status,
                      value: selectStatus.value,
                    }}
                    onChange={(e) => {
                      setSelectStatus({ ...selectStatus, status: e.value });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={12}>
                {selectStatus.status == 'Rejected' ? (
                  <FormControl fullWidth size="small">
                    <Typography>
                      Reason for Rejected<b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <TextareaAutosize
                      aria-label="minimum height"
                      minRows={5}
                      value={selectStatus.rejectedreason}
                      onChange={(e) => {
                        setSelectStatus({
                          ...selectStatus,
                          rejectedreason: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                ) : null}
              </Grid>
            </Grid>
          </DialogContent>
          <br />
          <DialogActions>
            <Button
              variant="contained"
              // style={{
              //   padding: "7px 13px",
              //   color: "white",
              //   background: "rgb(25, 118, 210)",
              // }}
              sx={buttonStyles.buttonsubmit}
              // onClick={() => {
              //   editStatus();
              //   // handleCloseerrpop();
              // }}
              onClick={() => fetchLeaveHistoryUpdate(selectStatus.employeeid, selectStatus.employeename)}
            >
              Update
            </Button>
            <Button
              // style={{
              //   backgroundColor: "#f4f4f4",
              //   color: "#444",
              //   boxShadow: "none",
              //   borderRadius: "3px",
              //   padding: "7px 13px",
              //   border: "1px solid #0000006b",
              //   "&:hover": {
              //     "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
              //       backgroundColor: "#f4f4f4",
              //     },
              //   },
              // }}
              sx={buttonStyles.btncancel}
              onClick={() => {
                handleStatusClose();
                setSelectStatus({});
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <Box>
        <Dialog
          open={isEditOpenCheckList}
          onClose={handleCloseModEditCheckList}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="xl"
          fullWidth={true}
          sx={{
            overflow: 'visible',
            '& .MuiPaper-root': {
              overflow: 'auto',
            },
            marginTop: '50px',
          }}
        >
          <Box sx={{ padding: '20px 50px' }}>
            <>
              <Typography sx={userStyle.SubHeaderText}>My Check List</Typography>
              <br />
              <br />
              <Grid container spacing={2}>
                <Grid item md={12} xs={12} sm={12}>
                  <FormControl
                    fullWidth
                    size="small"
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      border: '1px solid black',
                      borderRadius: '20px',
                    }}
                  >
                    <Typography sx={{ fontSize: '1rem', textAlign: 'center' }}>
                      Employee Name:{' '}
                      <span
                        style={{
                          fontWeight: '500',
                          fontSize: '1.2rem',
                          display: 'inline-block',
                          textAlign: 'center',
                        }}
                      >
                        {' '}
                        {`${getDetails?.employeename}`}
                      </span>
                    </Typography>
                  </FormControl>
                </Grid>
              </Grid>
              <br />
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ fontSize: '1.2rem' }}>
                        <Checkbox
                          onChange={() => {
                            overallCheckListChange();
                          }}
                          checked={isCheckedListOverall}
                        />
                      </TableCell>
                      <TableCell style={{ fontSize: '1.2rem' }}>Details</TableCell>
                      <TableCell style={{ fontSize: '1.2rem' }}>Field</TableCell>
                      <TableCell style={{ fontSize: '1.2rem' }}>Completed By</TableCell>
                      <TableCell style={{ fontSize: '1.2rem' }}>Completed At</TableCell>
                      <TableCell style={{ fontSize: '1.2rem' }}>Status</TableCell>
                      <TableCell style={{ fontSize: '1.2rem' }}>Action</TableCell>
                      <TableCell style={{ fontSize: '1.2rem' }}>Assigned Person</TableCell>
                      <TableCell style={{ fontSize: '1.2rem' }}>Category</TableCell>
                      <TableCell style={{ fontSize: '1.2rem' }}>Sub Category</TableCell>

                      {/* Add more table headers as needed */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {groupDetails?.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell style={{ fontSize: '1.2rem' }}>
                          <Checkbox
                            onChange={() => {
                              handleCheckboxChange(index);
                            }}
                            checked={isCheckedList[index]}
                          />
                        </TableCell>

                        <TableCell>{row.details}</TableCell>
                        {(() => {
                          switch (row.checklist) {
                            case 'Text Box':
                              return (
                                <TableCell>
                                  <OutlinedInput
                                    style={{ height: '32px' }}
                                    value={row.data}
                                    // disabled={disableInput[index]}
                                    onChange={(e) => {
                                      handleDataChange(e, index, 'Text Box');
                                    }}
                                  />
                                </TableCell>
                              );
                            case 'Text Box-number':
                              return (
                                <TableCell>
                                  <OutlinedInput
                                    value={row.data}
                                    style={{ height: '32px' }}
                                    type="text"
                                    onChange={(e) => {
                                      const inputValue = e.target.value;
                                      if (/^[0-9]*$/.test(inputValue)) {
                                        handleDataChange(e, index, 'Text Box-number');
                                      }
                                    }}
                                  />
                                </TableCell>
                              );
                            case 'Text Box-alpha':
                              return (
                                <TableCell>
                                  <OutlinedInput
                                    style={{ height: '32px' }}
                                    value={row.data}
                                    onChange={(e) => {
                                      const inputValue = e.target.value;
                                      if (/^[a-zA-Z]*$/.test(inputValue)) {
                                        handleDataChange(e, index, 'Text Box-alpha');
                                      }
                                    }}
                                  />
                                </TableCell>
                              );
                            case 'Text Box-alphanumeric':
                              return (
                                <TableCell>
                                  <OutlinedInput
                                    style={{ height: '32px' }}
                                    value={row.data}
                                    onChange={(e) => {
                                      const inputValue = e.target.value;
                                      if (/^[a-zA-Z0-9]*$/.test(inputValue)) {
                                        handleDataChange(e, index, 'Text Box-alphanumeric');
                                      }
                                    }}
                                    inputProps={{ pattern: '[A-Za-z0-9]*' }}
                                  />
                                </TableCell>
                              );
                            case 'Attachments':
                              return (
                                <TableCell>
                                  <div>
                                    <InputLabel sx={{ m: 1 }}>File</InputLabel>

                                    <div>
                                      <Box
                                        sx={{
                                          display: 'flex',
                                          marginTop: '10px',
                                          gap: '10px',
                                        }}
                                      >
                                        <Box item md={4} sm={4}>
                                          <section>
                                            <input
                                              type="file"
                                              accept="*/*"
                                              id={index}
                                              onChange={(e) => {
                                                handleChangeImage(e, index);
                                              }}
                                              style={{ display: 'none' }}
                                            />
                                            <label htmlFor={index}>
                                              <Typography sx={userStyle.uploadbtn}>Upload</Typography>
                                            </label>
                                            <br />
                                          </section>
                                        </Box>

                                        <Box item md={4} sm={4}>
                                          <Button onClick={showWebcam} variant="contained" sx={userStyle.uploadbtn}>
                                            <CameraAltIcon />
                                          </Button>
                                        </Box>
                                        {row.files && (
                                          <Grid container spacing={2}>
                                            <Grid item lg={8} md={8} sm={8} xs={8}>
                                              <Typography>{row.files.name}</Typography>
                                            </Grid>
                                            <Grid item lg={1.5} md={1} sm={1} xs={1} sx={{ cursor: 'pointer' }} onClick={() => renderFilePreviewEdit(row.files)}>
                                              <VisibilityOutlinedIcon
                                                style={{
                                                  fontsize: 'large',
                                                  color: '#357AE8',
                                                  cursor: 'pointer',
                                                }}
                                                onClick={() => renderFilePreviewEdit(row.files)}
                                              />
                                            </Grid>
                                            <Grid item lg={1} md={1} sm={1} xs={1}>
                                              <Button
                                                style={{
                                                  fontsize: 'large',
                                                  color: '#357AE8',
                                                  cursor: 'pointer',
                                                  marginTop: '-5px',
                                                }}
                                                onClick={() => handleFileDeleteEdit(index)}
                                              >
                                                <DeleteIcon />
                                              </Button>
                                            </Grid>
                                          </Grid>
                                        )}
                                      </Box>
                                    </div>
                                    <Dialog open={isWebcamOpen} onClose={webcamClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                                      <DialogContent
                                        sx={{
                                          textAlign: 'center',
                                          alignItems: 'center',
                                        }}
                                      >
                                        <Webcamimage getImg={getImg} setGetImg={setGetImg} capturedImages={capturedImages} valNum={valNum} setValNum={setValNum} name={name} />
                                      </DialogContent>
                                      <DialogActions>
                                        <Button variant="contained" color="success" onClick={webcamDataStore}>
                                          OK
                                        </Button>
                                        <Button variant="contained" color="error" onClick={webcamClose}>
                                          CANCEL
                                        </Button>
                                      </DialogActions>
                                    </Dialog>
                                  </div>
                                </TableCell>
                              );
                            case 'Pre-Value':
                              return (
                                <TableCell>
                                  <Typography>{row?.data}</Typography>
                                </TableCell>
                              );
                            case 'Date':
                              return (
                                <TableCell>
                                  <OutlinedInput
                                    style={{ height: '32px' }}
                                    type="date"
                                    value={row.data}
                                    onChange={(e) => {
                                      handleDataChange(e, index, 'Date');
                                    }}
                                  />
                                </TableCell>
                              );
                            case 'Time':
                              return (
                                <TableCell>
                                  <OutlinedInput
                                    style={{ height: '32px' }}
                                    type="time"
                                    value={row.data}
                                    onChange={(e) => {
                                      handleDataChange(e, index, 'Time');
                                    }}
                                  />
                                </TableCell>
                              );
                            case 'DateTime':
                              return (
                                <TableCell>
                                  <Stack direction="row" spacing={2}>
                                    <OutlinedInput
                                      style={{ height: '32px' }}
                                      type="date"
                                      value={dateValue[index]}
                                      onChange={(e) => {
                                        updateDateValuesAtIndex(e.target.value, index);
                                      }}
                                    />
                                    <OutlinedInput
                                      type="time"
                                      style={{ height: '32px' }}
                                      value={timeValue[index]}
                                      onChange={(e) => {
                                        updateTimeValuesAtIndex(e.target.value, index);
                                      }}
                                    />
                                  </Stack>
                                </TableCell>
                              );
                            case 'Date Multi Span':
                              return (
                                <TableCell>
                                  <Stack direction="row" spacing={2}>
                                    <OutlinedInput
                                      style={{ height: '32px' }}
                                      type="date"
                                      value={dateValueMultiFrom[index]}
                                      onChange={(e) => {
                                        updateFromDateValueAtIndex(e.target.value, index);
                                      }}
                                    />
                                    <OutlinedInput
                                      type="date"
                                      style={{ height: '32px' }}
                                      value={dateValueMultiTo[index]}
                                      onChange={(e) => {
                                        updateToDateValueAtIndex(e.target.value, index);
                                      }}
                                    />
                                  </Stack>
                                </TableCell>
                              );
                            case 'Date Multi Span Time':
                              return (
                                <TableCell>
                                  <div
                                    style={{
                                      display: 'flex',
                                      flexDirection: 'column',
                                      gap: '10px',
                                    }}
                                  >
                                    <Stack direction="row" spacing={2}>
                                      <OutlinedInput
                                        style={{ height: '32px' }}
                                        type="date"
                                        value={firstDateValue[index]}
                                        onChange={(e) => {
                                          updateFirstDateValuesAtIndex(e.target.value, index);
                                        }}
                                      />
                                      <OutlinedInput
                                        type="time"
                                        style={{ height: '32px' }}
                                        value={firstTimeValue[index]}
                                        onChange={(e) => {
                                          updateFirstTimeValuesAtIndex(e.target.value, index);
                                        }}
                                      />
                                    </Stack>
                                    <Stack direction="row" spacing={2}>
                                      <OutlinedInput
                                        type="date"
                                        style={{ height: '32px' }}
                                        value={secondDateValue[index]}
                                        onChange={(e) => {
                                          updateSecondDateValuesAtIndex(e.target.value, index);
                                        }}
                                      />
                                      <OutlinedInput
                                        style={{ height: '32px' }}
                                        type="time"
                                        value={secondTimeValue[index]}
                                        onChange={(e) => {
                                          updateSecondTimeValuesAtIndex(e.target.value, index);
                                        }}
                                      />
                                    </Stack>
                                  </div>
                                </TableCell>
                              );
                            case 'Date Multi Random':
                              return (
                                <TableCell>
                                  <OutlinedInput
                                    style={{ height: '32px' }}
                                    type="date"
                                    value={row.data}
                                    onChange={(e) => {
                                      handleDataChange(e, index, 'Date Multi Random');
                                    }}
                                  />
                                </TableCell>
                              );
                            case 'Date Multi Random Time':
                              return (
                                <TableCell>
                                  <Stack direction="row" spacing={2}>
                                    <OutlinedInput
                                      style={{ height: '32px' }}
                                      type="date"
                                      value={dateValueRandom[index]}
                                      onChange={(e) => {
                                        updateDateValueAtIndex(e.target.value, index);
                                      }}
                                    />
                                    <OutlinedInput
                                      type="time"
                                      style={{ height: '32px' }}
                                      value={timeValueRandom[index]}
                                      onChange={(e) => {
                                        updateTimeValueAtIndex(e.target.value, index);
                                      }}
                                    />
                                  </Stack>
                                </TableCell>
                              );
                            case 'Radio':
                              return (
                                <TableCell>
                                  <FormControl component="fieldset">
                                    <RadioGroup
                                      value={row.data}
                                      sx={{
                                        display: 'flex',
                                        flexDirection: 'row !important',
                                      }}
                                      onChange={(e) => {
                                        handleDataChange(e, index, 'Radio');
                                      }}
                                    >
                                      <FormControlLabel value="No" control={<Radio />} label="No" />
                                      <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                                    </RadioGroup>
                                  </FormControl>
                                </TableCell>
                              );

                            default:
                              return <TableCell></TableCell>; // Default case
                          }
                        })()}
                        <TableCell>
                          <Typography>{row?.completedby}</Typography>
                        </TableCell>
                        <TableCell>{row.completedat && moment(row.completedat).format('DD-MM-YYYY hh:mm:ss A')}</TableCell>
                        <TableCell>
                          {row.checklist === 'DateTime' ? (
                            ((row.data !== undefined && row.data !== '') || row.files !== undefined) && row.data.length === 16 ? (
                              <Typography>Completed</Typography>
                            ) : (
                              <Typography>Pending</Typography>
                            )
                          ) : row.checklist === 'Date Multi Span' ? (
                            ((row.data !== undefined && row.data !== '') || row.files !== undefined) && row.data.length === 21 ? (
                              <Typography>Completed</Typography>
                            ) : (
                              <Typography>Pending</Typography>
                            )
                          ) : row.checklist === 'Date Multi Span Time' ? (
                            ((row.data !== undefined && row.data !== '') || row.files !== undefined) && row.data.length === 33 ? (
                              <Typography>Completed</Typography>
                            ) : (
                              <Typography>Pending</Typography>
                            )
                          ) : row.checklist === 'Date Multi Random Time' ? (
                            ((row.data !== undefined && row.data !== '') || row.files !== undefined) && row.data.length === 16 ? (
                              <Typography>Completed</Typography>
                            ) : (
                              <Typography>Pending</Typography>
                            )
                          ) : (row.data !== undefined && row.data !== '') || row.files !== undefined ? (
                            <Typography>Completed</Typography>
                          ) : (
                            <Typography>Pending</Typography>
                          )}
                        </TableCell>

                        <TableCell>
                          {row.checklist === 'DateTime' ? (
                            ((row.data !== undefined && row.data !== '') || row.files !== undefined) && row.data.length === 16 ? (
                              <>
                                <IconButton
                                  sx={{ color: 'green', cursor: 'pointer' }}
                                  onClick={() => {
                                    updateIndividualData(index);
                                  }}
                                >
                                  <CheckCircleIcon />
                                </IconButton>
                              </>
                            ) : (
                              <IconButton
                                sx={{ color: '#1565c0', cursor: 'pointer' }}
                                onClick={() => {
                                  let itemValue = disableInput[index];
                                  itemValue = false;
                                  let spreadData = [...disableInput];
                                  spreadData[index] = false;
                                  setDisableInput(spreadData);
                                }}
                              >
                                <CheckCircleIcon />
                              </IconButton>
                            )
                          ) : row.checklist === 'Date Multi Span' ? (
                            ((row.data !== undefined && row.data !== '') || row.files !== undefined) && row.data.length === 21 ? (
                              <>
                                <IconButton
                                  sx={{ color: 'green', cursor: 'pointer' }}
                                  onClick={() => {
                                    updateIndividualData(index);
                                  }}
                                >
                                  <CheckCircleIcon />
                                </IconButton>
                              </>
                            ) : (
                              <IconButton
                                sx={{ color: '#1565c0', cursor: 'pointer' }}
                                onClick={() => {
                                  let itemValue = disableInput[index];
                                  itemValue = false;
                                  let spreadData = [...disableInput];
                                  spreadData[index] = false;
                                  setDisableInput(spreadData);
                                }}
                              >
                                <CheckCircleIcon />
                              </IconButton>
                            )
                          ) : row.checklist === 'Date Multi Span Time' ? (
                            ((row.data !== undefined && row.data !== '') || row.files !== undefined) && row.data.length === 33 ? (
                              <>
                                <IconButton
                                  sx={{ color: 'green', cursor: 'pointer' }}
                                  onClick={() => {
                                    updateIndividualData(index);
                                  }}
                                >
                                  <CheckCircleIcon />
                                </IconButton>
                              </>
                            ) : (
                              <IconButton
                                sx={{ color: '#1565c0', cursor: 'pointer' }}
                                onClick={() => {
                                  let itemValue = disableInput[index];
                                  itemValue = false;
                                  let spreadData = [...disableInput];
                                  spreadData[index] = false;
                                  setDisableInput(spreadData);
                                }}
                              >
                                <CheckCircleIcon />
                              </IconButton>
                            )
                          ) : row.checklist === 'Date Multi Random Time' ? (
                            ((row.data !== undefined && row.data !== '') || row.files !== undefined) && row.data.length === 16 ? (
                              <>
                                <IconButton
                                  sx={{ color: 'green', cursor: 'pointer' }}
                                  onClick={() => {
                                    updateIndividualData(index);
                                  }}
                                >
                                  <CheckCircleIcon />
                                </IconButton>
                              </>
                            ) : (
                              <IconButton
                                sx={{ color: '#1565c0', cursor: 'pointer' }}
                                onClick={() => {
                                  let itemValue = disableInput[index];
                                  itemValue = false;
                                  let spreadData = [...disableInput];
                                  spreadData[index] = false;
                                  setDisableInput(spreadData);
                                }}
                              >
                                <CheckCircleIcon />
                              </IconButton>
                            )
                          ) : (row.data !== undefined && row.data !== '') || row.files !== undefined ? (
                            <>
                              <IconButton
                                sx={{ color: 'green', cursor: 'pointer' }}
                                onClick={() => {
                                  updateIndividualData(index);
                                }}
                              >
                                <CheckCircleIcon />
                              </IconButton>
                            </>
                          ) : (
                            <IconButton
                              sx={{ color: '#1565c0', cursor: 'pointer' }}
                              onClick={() => {
                                let itemValue = disableInput[index];
                                itemValue = false;
                                let spreadData = [...disableInput];
                                spreadData[index] = false;
                                setDisableInput(spreadData);
                              }}
                            >
                              <CheckCircleIcon />
                            </IconButton>
                          )}
                        </TableCell>
                        <TableCell>
                          <span>{row?.employee && row?.employee?.map((data, index) => <Typography key={index} variant="body1">{`${index + 1}.${data}, `}</Typography>)}</span>
                        </TableCell>
                        <TableCell>{row.category}</TableCell>
                        <TableCell>{row.subcategory}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <br /> <br /> <br />
              <Grid container>
                <Grid item md={1} sm={1}></Grid>
                <Button variant="contained" onClick={handleCheckListSubmit}>
                  Submit
                </Button>
                <Grid item md={1} sm={1}></Grid>
                <Button sx={userStyle.btncancel} onClick={handleCloseModEditCheckList}>
                  Cancel
                </Button>
              </Grid>
            </>
          </Box>
        </Dialog>
      </Box>

      {/* Update History Popup */}
      <Dialog open={isOpenHistoryUpdate} onClose={handleCloseModHistoryUpdate} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="lg" fullWidth={true} sx={{ marginTop: '95px' }}>
        <Box sx={{ padding: '20px 50px' }}>
          <>
            <Typography sx={userStyle.HeaderText}>Employee Leave History</Typography>
            <br />
            <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">
                    Employee Name:&ensp;
                    <span
                      style={{
                        fontWeight: '500',
                        fontSize: '1.2rem',
                        display: 'inline-block',
                      }}
                    >
                      {selectedEmpDataUpdate?.employeename}
                    </span>
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">
                    Employee ID:&ensp;
                    <span
                      style={{
                        fontWeight: '500',
                        fontSize: '1.2rem',
                        display: 'inline-block',
                      }}
                    >
                      {selectedEmpDataUpdate?.employeeid}
                    </span>
                  </Typography>
                </FormControl>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sm={12}>
                <Typography sx={userStyle.HeaderText}>Overall</Typography>
                <br />
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <b>Leave Type</b>
                        </TableCell>
                        <TableCell>
                          <b>Applied Count</b>
                        </TableCell>
                        <TableCell>
                          <b>Approved Count</b>
                        </TableCell>
                        <TableCell>
                          <b>Rejected Count</b>
                        </TableCell>
                        <TableCell>
                          <b>Uninformed Count</b>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {historyOverAllDataUpdate.length > 0 ? (
                        historyOverAllDataUpdate.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell>{row?.leavetype}</TableCell>
                            <TableCell>{row?.appliedCount}</TableCell>
                            <TableCell>{row?.approvedCount}</TableCell>
                            <TableCell>{row?.rejectedCount}</TableCell>
                            <TableCell>{row?.uninformedCount}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} align="center">
                            No Data Available
                          </TableCell>{' '}
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sm={12}>
                <Typography sx={userStyle.HeaderText}>Month</Typography>
                <br />
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <b>Leave Type</b>
                        </TableCell>
                        <TableCell>
                          <b>Applied Count</b>
                        </TableCell>
                        <TableCell>
                          <b>Approved Count</b>
                        </TableCell>
                        <TableCell>
                          <b>Rejected Count</b>
                        </TableCell>
                        <TableCell>
                          <b>Uninformed Count</b>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {historyMonthDataUpdate.length > 0 ? (
                        historyMonthDataUpdate.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell>{row?.leavetype}</TableCell>
                            <TableCell>{row?.appliedCount}</TableCell>
                            <TableCell>{row?.approvedCount}</TableCell>
                            <TableCell>{row?.rejectedCount}</TableCell>
                            <TableCell>{row?.uninformedCount}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} align="center">
                            No Data Available
                          </TableCell>{' '}
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={2}>
              <Grid item md={1} sm={1}>
                <Button sx={buttonStyles.buttonsubmit} onClick={editStatus}>
                  Ok
                </Button>
              </Grid>
              <Grid item md={1} sm={1}>
                <Button sx={buttonStyles.btncancel} onClick={handleCloseModHistoryUpdate}>
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </>
        </Box>
      </Dialog>

      {/* ALERT DIALOG */}
      <Box>
        <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: '450px', textAlign: 'center', alignItems: 'center' }}>
            <Typography variant="h6">{showAlert}</Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" color="error" onClick={handleCloseerr}>
              Close
            </Button>
            <Button variant="contained" color="error" onClick={sendEditStatus}>
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <MessageAlert openPopup={openPopupMalert} handleClosePopup={handleClosePopupMalert} popupContent={popupContentMalert} popupSeverity={popupSeverityMalert} />

      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRef}>
          <TableHead>
            <TableRow>
              <TableCell>SNo</TableCell>
              <TableCell>Employee Id</TableCell>
              <TableCell>Employee Name</TableCell>
              <TableCell>Leave Type</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Number of Days</TableCell>
              <TableCell>Reason for leave</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>History</TableCell>
              <TableCell>Current Month History</TableCell>
            </TableRow>
          </TableHead>
          <TableBody align="left">
            {filteredData &&
              filteredData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.employeeid}</TableCell>
                  <TableCell>{row.employeename}</TableCell>
                  <TableCell>{row.leavetype}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.noofshift}</TableCell>
                  <TableCell>{row.reasonforleave}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>
                    <Box>
                      <Typography>Total Applied: {row.overAllappliedCount}</Typography>
                      <Typography>Total Approved: {row.overAllapprovedCount}</Typography>
                      <Typography>Total Rejected: {row.overAllrejectedCount}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography>Total Applied: {row.monthlyappliedCount}</Typography>
                      <Typography>Total Approved: {row.monthlyapprovedCount}</Typography>
                      <Typography>Total rejectedreason: {row.monthlyrejectedCount}</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* EXTERNAL COMPONENTS -------------- END */}
      <Dialog open={isFilterOpen} onClose={handleCloseFilterMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent
          sx={{
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
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

          {fileFormat === 'xl' ? <FaFileExcel style={{ fontSize: '70px', color: 'green' }} /> : <FaFileCsv style={{ fontSize: '70px', color: 'green' }} />}
          <Typography variant="h5" sx={{ textAlign: 'center' }}>
            Choose Export
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            variant="contained"
            onClick={(e) => {
              handleExportXL('filtered');
            }}
          >
            Export Filtered Data
          </Button>
          <Button
            autoFocus
            variant="contained"
            onClick={(e) => {
              handleExportXL('overall');
            }}
          >
            Export Over All Data
          </Button>
        </DialogActions>
      </Dialog>
      {/*Export pdf Data  */}
      <Dialog open={isPdfFilterOpen} onClose={handleClosePdfFilterMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent
          sx={{
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
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
              setIsPdfFilterOpen(false);
            }}
          >
            Export Filtered Data
          </Button>
          <Button
            variant="contained"
            onClick={(e) => {
              downloadPdf('overall');
              setIsPdfFilterOpen(false);
            }}
          >
            Export Over All Data
          </Button>
        </DialogActions>
      </Dialog>

      {/* SUCCESS */}
      <AlertDialog openPopup={openPopup} handleClosePopup={handleClosePopup} popupContent={popupContent} popupSeverity={popupSeverity} />
      {/* EXTERNAL COMPONENTS -------------- END */}
      {/* PRINT PDF EXCEL CSV */}
      {/* <ExportData
        isFilterOpen={isFilterOpen}
        handleCloseFilterMod={handleCloseFilterMod}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpen}
        isPdfFilterOpen={isPdfFilterOpen}
        setIsPdfFilterOpen={setIsPdfFilterOpen}
        handleClosePdfFilterMod={handleClosePdfFilterMod}
        filteredDataTwo={(filteredRowData.length > 0 ? filteredRowData : filteredData) ?? []}
        itemsTwo={items ?? []}
        filename={"Team Leave Verification"}
        exportColumnNames={exportColumnNamescrt}
        exportRowValues={exportRowValuescrt}
        componentRef={componentRef}
      /> */}
    </Box>
  );
}

export default TeamLeaveVerification;
