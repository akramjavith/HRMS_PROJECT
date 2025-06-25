import React, { useState, useEffect, useRef, useContext } from 'react';
import { Box, Typography, OutlinedInput, Select, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton, FormGroup, FormControlLabel, TextareaAutosize } from '@mui/material';
import { userStyle } from '../../pageStyle';
import { reminderOption } from '../../components/Componentkeyword';
import { handleApiError } from '../../components/Errorhandling';
import { FaPrint, FaFilePdf } from 'react-icons/fa';
import 'jspdf-autotable';
import axios from '../../axiosInstance';
import { SERVICE } from '../../services/Baseservice';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import moment from 'moment-timezone';
import { useReactToPrint } from 'react-to-print';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { UserRoleAccessContext } from '../../context/Appcontext';
import { AuthContext } from '../../context/Appcontext';
import { BASE_URL } from '../../services/Authservice';
import Headtitle from '../../components/Headtitle';
import { ThreeDots } from 'react-loader-spinner';
import Switch from '@mui/material/Switch';
import CloseIcon from '@mui/icons-material/Close';
import html2canvas from 'html2canvas';
import ImageIcon from '@mui/icons-material/Image';
import Selects from 'react-select';
import { saveAs } from 'file-saver';
import DeleteIcon from '@mui/icons-material/Delete';
import { MultiSelect } from 'react-multi-select-component';
import * as XLSX from 'xlsx';
import { FaFileExcel, FaFileCsv } from 'react-icons/fa';
import PageHeading from '../../components/PageHeading';
import ExportData from '../../components/ExportData';
import AlertDialog from '../../components/Alert';
import MessageAlert from '../../components/MessageAlert';
import InfoPopup from '../../components/InfoPopup.js';
import { DeleteConfirmation, PleaseSelectRow } from '../../components/DeleteConfirmation.js';
import AggregatedSearchBar from '../../components/AggregatedSearchBar';
import AggridTable from '../../components/AggridTable';
import domtoimage from 'dom-to-image';
import { v4 as uuidv4 } from 'uuid';
import { getCurrentServerTime } from '../../components/getCurrentServerTime';

function Events() {
  const pathname = window.location.pathname;
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const [isHandleChange, setIsHandleChange] = useState(false);
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

  let exportColumnNames = ['Company', 'Branch', 'Unit', 'Team', 'Event Name', 'Event Description', 'Date', 'Time', 'Duration', 'Area', 'Reminder', 'Participants'];
  let exportRowValues = ['company', 'branch', 'unit', 'team', 'eventname', 'eventdescription', 'date', 'time', 'duration', 'area', 'reminder', 'participants'];

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  // servertime add code
  const [serverTime, setServerTime] = useState(null);

  useEffect(() => {
    const fetchTime = async () => {
      const time = await getCurrentServerTime();
      setServerTime(time);
    };
    fetchTime();
  }, []);

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String('Manage Events'),
      commonid: String(isUserRoleAccess?._id),
      date: String(new Date(serverTime)),
      addedby: [
        {
          name: String(isUserRoleAccess?.username),
          date: String(new Date(serverTime)),
        },
      ],
    });
  };

  useEffect(() => {
    getapi();
  }, []);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };
  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  const [fileFormat, setFormat] = useState('');

  const gridRef = useRef(null);
  const gridRefTable = useRef(null);
  //useStates
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState('');
  //state to handle meeting values
  const [eventState, setEventState] = useState({
    branch: 'Please Select Branch',
    unit: 'Please Select Unit',
    team: 'Please Select Team',
    eventname: '',
    eventdescription: '',
    date: '',
    time: '',
    duration: '00:00',
    area: 'Please Select Area',
    reminder: 'Please Select Reminder',
    insideoffice: true,
    files: '',
  });
  //state to handle edit meeting values
  const [meetingEdit, setMeetingEdit] = useState([]);
  const [meetingArray, setMeetingArray] = useState([]);
  const [meetingArrayList, setMeetingArrayList] = useState([]);
  const [allStatusEdit, setAllStatusEdit] = useState([]);
  const { isUserRoleCompare,listPageAccessMode, isUserRoleAccess, isAssignBranch, allUsersData, allTeam, allarea, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);
  

    const[hierarchyemployee,setHierarchyemployee] = useState([])
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
  const [meetingCheck, setMeetingCheck] = useState(false);
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedString, setSearchedString] = useState('');
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [openview, setOpenview] = useState(false);
  const [openInfo, setOpeninfo] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteMeeting, setDeleteMeeting] = useState({});
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    company: true,
    branch: true,
    unit: true,
    team: true,
    eventname: true,
    eventdescription: true,
    date: true,
    time: true,
    duration: true,
    area: true,
    reminder: true,
    participants: true,
    document: true,
    actions: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [hrsOption, setHrsOption] = useState([]);
  const [minsOption, setMinsOption] = useState([]);
  const [locationOption, setLocationOption] = useState([]);
  const [hours, setHours] = useState('Hrs');
  const [minutes, setMinutes] = useState('Mins');
  const [upload, setUpload] = useState([]);
  const [selectedOptionsCate, setSelectedOptionsCate] = useState([]);
  const [valueCate, setValueCate] = useState('');
  const [selectedOptionsCateEdit, setSelectedOptionsCateEdit] = useState([]);
  const [valueCateEdit, setValueCateEdit] = useState('');


    const accessbranch = isAssignBranch?.map((data) => ({
      branch: data.branch,
      company: data.company,
      unit: data.unit,
    }));

//   const accessbranch = isUserRoleAccess?.role?.includes('Manager')
//     ? isAssignBranch?.map((data) => ({
//         branch: data.branch,
//         company: data.company,
//         unit: data.unit,
//       }))
//     : isAssignBranch
//         ?.filter((data) => {
//           let fetfinalurl = [];

//           if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.mainpagenameurl?.length !== 0 && data?.subpagenameurl?.length !== 0 && data?.subsubpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)) {
//             fetfinalurl = data.subsubpagenameurl;
//           } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.mainpagenameurl?.length !== 0 && data?.subpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)) {
//             fetfinalurl = data.subpagenameurl;
//           } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.mainpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)) {
//             fetfinalurl = data.mainpagenameurl;
//           } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)) {
//             fetfinalurl = data.submodulenameurl;
//           } else if (data?.modulenameurl?.length !== 0) {
//             fetfinalurl = data.modulenameurl;
//           } else {
//             fetfinalurl = [];
//           }

//           const remove = [window.location.pathname?.substring(1), window.location.pathname];
//           return fetfinalurl?.some((item) => remove?.includes(item));
//         })
//         ?.map((data) => ({
//           branch: data.branch,
//           company: data.company,
//           unit: data.unit,
//         }));

  // const getFileIcon = (fileName) => {
  //   const extension1 = fileName?.split(".").pop();
  //   switch (extension1) {
  //     case "pdf":
  //       return pdfIcon;
  //     case "doc":
  //     case "docx":
  //       return wordIcon;
  //     case "xls":
  //     case "xlsx":
  //       return excelIcon;
  //     case "csv":
  //       return csvIcon;
  //     default:
  //       return fileIcon;
  //   }
  // };

  //useEffect

  const getFileIcon = (filename) => {
    const ext = filename?.split('.').pop().toLowerCase();
    switch (ext) {
      case 'pdf':
        return '/icons/pdf-icon.png';
      case 'xls':
      case 'xlsx':
        return '/icons/excel-icon.png';
      case 'doc':
      case 'docx':
        return '/icons/word-icon.png';
      case 'zip':
      case 'rar':
        return '/icons/zip-icon.png';
      default:
        return '/icons/file-icon.png'; // fallback generic file icon
    }
  };

  useEffect(() => {
    generateHrsOptions();
    generateMinsOptions();
    fetchAllLocation();
  }, []);
  useEffect(() => {
    addSerialNumber(meetingArray);
  }, [meetingArray]);
  useEffect(() => {
    fetchMeetingAll();
  }, [isEditOpen]);
  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener('beforeunload', beforeUnloadHandler);
    return () => {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
    };
  }, []);

  //function to generate hrs
  const generateHrsOptions = () => {
    const hrsOpt = [];
    for (let i = 0; i <= 23; i++) {
      if (i < 10) {
        i = '0' + i;
      }
      hrsOpt.push({ value: i.toString(), label: i.toString() });
    }
    setHrsOption(hrsOpt);
  };
  //function to generate mins
  const generateMinsOptions = () => {
    const minsOpt = [];
    for (let i = 0; i <= 59; i++) {
      if (i < 10) {
        i = '0' + i;
      }
      minsOpt.push({ value: i.toString(), label: i.toString() });
    }
    setMinsOption(minsOpt);
  };
  //Delete model
  const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);

  const handleCloseModcheckbox = () => {
    setIsDeleteOpencheckbox(false);
  };
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
  const handleClickOpenalert = () => {
    setIsHandleChange(true);
    if (selectedRows.length === 0) {
      setIsDeleteOpenalert(true);
    } else {
      setIsDeleteOpencheckbox(true);
    }
  };
  const handleCloseModalert = () => {
    setIsDeleteOpenalert(false);
  };

  //company multiselect
  const [selectedOptionsCompany, setSelectedOptionsCompany] = useState([]);
  let [valueCompanyCat, setValueCompanyCat] = useState([]);
  const [selectedCompanyOptionsCateEdit, setSelectedCompanyOptionsCateEdit] = useState([]);
  const [companyValueCateEdit, setCompanyValueCateEdit] = useState('');

  const handleCompanyChange = (options) => {
    setValueCompanyCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCompany(options);
    setValueBranchCat([]);
    setSelectedOptionsBranch([]);
    setValueUnitCat([]);
    setSelectedOptionsUnit([]);
    setValueTeamCat([]);
    setSelectedOptionsTeam([]);
    setValueCate([]);
    setSelectedOptionsCate([]);
  };

  const customValueRendererCompany = (valueCompanyCat, _categoryname) => {
    return valueCompanyCat?.length ? valueCompanyCat.map(({ label }) => label)?.join(', ') : 'Please Select Company';
  };

  const handleCompanyChangeEdit = (options) => {
    setCompanyValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedCompanyOptionsCateEdit(options);
    setBranchValueCateEdit([]);
    setSelectedBranchOptionsCateEdit([]);
    setUnitValueCateEdit([]);
    setSelectedUnitOptionsCateEdit([]);
    setTeamValueCateEdit([]);
    setSelectedTeamOptionsCateEdit([]);
    setValueCateEdit([]);
    setSelectedOptionsCateEdit([]);
  };
  const customValueRendererCompanyEdit = (companyValueCateEdit, _employeename) => {
    return companyValueCateEdit?.length ? companyValueCateEdit.map(({ label }) => label)?.join(', ') : 'Please Select Company';
  };

  //branch multiselect
  const [selectedOptionsBranch, setSelectedOptionsBranch] = useState([]);
  let [valueBranchCat, setValueBranchCat] = useState([]);
  const [selectedBranchOptionsCateEdit, setSelectedBranchOptionsCateEdit] = useState([]);
  const [branchValueCateEdit, setBranchValueCateEdit] = useState('');

  const handleBranchChange = (options) => {
    setValueBranchCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsBranch(options);
    setValueUnitCat([]);
    setSelectedOptionsUnit([]);
    setValueTeamCat([]);
    setSelectedOptionsTeam([]);
    setValueCate([]);
    setSelectedOptionsCate([]);
  };

  const customValueRendererBranch = (valueBranchCat, _categoryname) => {
    return valueBranchCat?.length ? valueBranchCat.map(({ label }) => label)?.join(', ') : 'Please Select Branch';
  };

  const handleBranchChangeEdit = (options) => {
    setBranchValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedBranchOptionsCateEdit(options);
    setUnitValueCateEdit([]);
    setSelectedUnitOptionsCateEdit([]);
    setTeamValueCateEdit([]);
    setSelectedTeamOptionsCateEdit([]);
    setValueCateEdit([]);
    setSelectedOptionsCateEdit([]);
  };
  const customValueRendererBranchEdit = (branchValueCateEdit, _employeename) => {
    return branchValueCateEdit?.length ? branchValueCateEdit.map(({ label }) => label)?.join(', ') : 'Please Select Branch';
  };

  //unit multiselect
  const [selectedOptionsUnit, setSelectedOptionsUnit] = useState([]);
  let [valueUnitCat, setValueUnitCat] = useState([]);
  const [selectedUnitOptionsCateEdit, setSelectedUnitOptionsCateEdit] = useState([]);
  const [unitValueCateEdit, setUnitValueCateEdit] = useState('');

  const handleUnitChange = (options) => {
    setValueUnitCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsUnit(options);
    setValueTeamCat([]);
    setSelectedOptionsTeam([]);
    setValueCate([]);
    setSelectedOptionsCate([]);
  };

  const customValueRendererUnit = (valueUnitCat, _categoryname) => {
    return valueUnitCat?.length ? valueUnitCat.map(({ label }) => label)?.join(', ') : 'Please Select Unit';
  };

  const handleUnitChangeEdit = (options) => {
    setUnitValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedUnitOptionsCateEdit(options);
    setTeamValueCateEdit([]);
    setSelectedTeamOptionsCateEdit([]);
    setValueCateEdit([]);
    setSelectedOptionsCateEdit([]);
  };
  const customValueRendererUnitEdit = (unitValueCateEdit, _employeename) => {
    return unitValueCateEdit?.length ? unitValueCateEdit.map(({ label }) => label)?.join(', ') : 'Please Select Unit';
  };

  //team multiselect
  const [selectedOptionsTeam, setSelectedOptionsTeam] = useState([]);
  let [valueTeamCat, setValueTeamCat] = useState([]);
  const [selectedTeamOptionsCateEdit, setSelectedTeamOptionsCateEdit] = useState([]);
  const [teamValueCateEdit, setTeamValueCateEdit] = useState('');

  const [employeeLength, setEmployeeLength] = useState([]);

  const handleTeamChange = (options) => {
    let team = options.map((a, index) => {
      return a.value;
    });

    setValueTeamCat(team);
    setSelectedOptionsTeam(options);
    setValueCate([]);
    setSelectedOptionsCate([]);

    let emplength = [
      ...allUsersData
        ?.filter((u) => valueCompanyCat?.includes(u.company) && valueBranchCat?.includes(u.branch) && valueUnitCat?.includes(u.unit) && team?.includes(u.team))
        .map((u) => ({
          ...u,
          label: u.companyname,
          value: u.companyname,
        })),
    ];
    setEmployeeLength(emplength);
  };

  const customValueRendererTeam = (valueTeamCat, _categoryname) => {
    return valueTeamCat?.length ? valueTeamCat.map(({ label }) => label)?.join(', ') : 'Please Select Team';
  };
  const [employeeLengthEdit, setEmployeeLengthEdit] = useState([]);
  const handleTeamChangeEdit = (options) => {
    let team = options.map((a, index) => {
      return a.value;
    });

    setTeamValueCateEdit(team);
    setSelectedTeamOptionsCateEdit(options);
    setValueCateEdit([]);
    setSelectedOptionsCateEdit([]);

    let emplength = [
      ...allUsersData
        ?.filter((u) => companyValueCateEdit?.includes(u.company) && branchValueCateEdit?.includes(u.branch) && unitValueCateEdit?.includes(u.unit) && team?.includes(u.team))
        .map((u) => ({
          ...u,
          label: u.companyname,
          value: u.companyname,
        })),
    ];
    setEmployeeLengthEdit(emplength);
  };
  const customValueRendererTeamEdit = (teamValueCateEdit, _employeename) => {
    return teamValueCateEdit?.length ? teamValueCateEdit.map(({ label }) => label)?.join(', ') : 'Please Select Team';
  };

  //get locations
  const fetchAllLocation = async () => {
    setPageName(!pageName);
    try {
      setLocationOption([
        ...allarea?.map((t) => ({
          ...t,
          label: t.name,
          value: t.name,
        })),
      ]);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const handleResumeUpload = (event) => {
    const resume = event.target.files;
    for (let i = 0; i < resume.length; i++) {
      const reader = new FileReader();
      const file = resume[i];
      reader.readAsDataURL(file);
      reader.onload = () => {
        setUpload((prevFiles) => [
          ...prevFiles,
          {
            name: file.name,
            preview: reader.result,
            data: reader.result.split(',')[1],
            remark: 'resume file',
          },
        ]);
      };
    }
  };
  const renderFilePreview = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    window.open(link, '_blank');
  };
  const handleFileDelete = (index) => {
    setUpload((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };
  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };
  // Error Popup model
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };
  // view model
  const handleClickOpenview = () => {
    setOpenview(true);
  };
  const handleCloseview = () => {
    setOpenview(false);
    setUpload([]);
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
  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ''; // This is required for Chrome support
  };
  const username = isUserRoleAccess.username;
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
  const getRowClassName = (params) => {
    if (selectedRows.includes(params.row.id)) {
      return 'custom-id-row'; // This is the custom class for rows with item.tat === 'ago'
    }
    return ''; // Return an empty string for other rows
  };

  //set function to get particular row
  const rowData = async (id, name) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SINGLE_EVENT}/${id}`, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      setDeleteMeeting(res?.data?.sscheduleevent);
      handleClickOpen();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  // Alert delete popup
  let meetingid = deleteMeeting._id;
  const delMeeting = async () => {
    setPageName(!pageName);
    try {
      await axios.delete(`${SERVICE.SINGLE_EVENT}/${meetingid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      // await handleFileDeleteOld(deleteMeeting.files.map((d) => `${deleteMeeting.uniqueId}$events$${d}`));

      await fetchMeetingAll();
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

  const bulkdeletefunction = async () => {
    setPageName(!pageName);
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.SINGLE_EVENT}/${item}`, {
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
      await fetchMeetingAll();
      setPopupContent('Deleted Successfully');
      setPopupSeverity('success');
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const [isBtn, setIsBtn] = useState(false);

  //add function
  const sendRequest = async () => {
    setPageName(!pageName);
    setIsBtn(true);
    const uniqueId = uuidv4();
    try {
      let eventCreate = await axios.post(SERVICE.CREATE_EVENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: [...valueCompanyCat],
        branch: [...valueBranchCat],
        unit: [...valueUnitCat],
        team: [...valueTeamCat],
        eventname: String(eventState.eventname),
        eventdescription: String(eventState.eventdescription),
        date: String(eventState.date),
        time: String(eventState.time),
        duration: String(eventState.duration),
        area: String(eventState.area),
        reminder: String(eventState.reminder),
        insideoffice: Boolean(eventState.insideoffice),
        participants: [...valueCate],
        // files: [...upload],
        files: upload?.map((item) => item.name),
        uniqueId: uniqueId,
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            // date: String(new Date(serverTime))
          },
        ],
      });
      await handleFileUpload(upload, 'events', uniqueId);

      await fetchMeetingAll();
      const area = String(eventState.area);
      const isCityInArray = locationOption.some((option) => option.value === area);
      if (isCityInArray) {
        setEventState({
          ...eventState,
          eventname: '',
          eventdescription: '',
          date: '',
          time: '',
          insideoffice: true,
          files: '',
        });
      } else {
        setEventState({
          ...eventState,
          eventname: '',
          eventdescription: '',
          date: '',
          time: '',
          insideoffice: false,
          files: '',
        });
      }
      // setUpload('');
      setUpload([]);
      setPopupContent('Added Successfully');
      setPopupSeverity('success');
      handleClickOpenPopup();
      setIsBtn(false);
    } catch (err) {
      console.log(err, 'll');
      setIsBtn(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  function base64ToFile(base64String, filename, mimeType) {
    const byteString = atob(base64String.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new File([ab], filename, { type: mimeType });
  }

  const handleFileUpload = async (selectedFilesall, type, uniqueId) => {
    try {
      // console.log(selectedFilesall, "selectedFilesall");
      // let selectedFiles = selectedFilesall;
      // const selectedFiles = selectedFilesall.map(file =>
      //   base64ToFile(file.preview, file.name, file.type)
      // );

      const selectedFiles = selectedFilesall.map((file) => base64ToFile(file.preview, file.name, file.type));
      console.log(selectedFiles, 'selectedFiles');

      const uploadFiles = async () => {
        for (const selectedFile of selectedFiles) {
          // console.log(selectedFile, "selectedFile");
          const chunkSize = 5 * 1024 * 1024; // 5MB (adjust based on your requirements)
          const totalChunks = Math.ceil(selectedFile.size / chunkSize);
          const chunkProgress = 100 / totalChunks;
          let chunkNumber = 0;
          let start = 0;
          let end = 0;

          const uploadNextChunk = async () => {
            try {
              if (end < selectedFile.size) {
                end = start + chunkSize;
                if (end > selectedFile.size) {
                  end = selectedFile.size;
                }

                const chunk = selectedFile.slice(start, end, selectedFile.type);
                // console.log(chunk, "chunk");

                const formData = new FormData();
                formData.append('file', chunk);
                formData.append('chunkNumber', chunkNumber);
                formData.append('totalChunks', totalChunks);
                formData.append('filesize', selectedFile.size);
                formData.append('originalname', `${uniqueId}$${type}$${selectedFile.name}`);

                // console.log(formData, "formData");

                try {
                  const response = await axios.post(SERVICE.UPLOAD_CHUNK_EVENTS, formData, {
                    headers: {
                      'Content-Type': 'multipart/form-data',
                    },
                  });
                  // console.log(response, "response");
                  const temp = `Chunk ${chunkNumber + 1}/${totalChunks} uploaded successfully for ${selectedFile.name}`;

                  start = end;
                  chunkNumber++;

                  uploadNextChunk();
                } catch (err) {
                  console.log(err, 'ERrer');
                  handleApiError(err, setShowAlert, handleClickOpenerr);
                }
              } else {
                // setProgress(100);
                console.log(`File upload completed for ${selectedFile.name}`);
              }
            } catch (err) {
              console.log(err, 'asdfse');
            }
          };

          await uploadNextChunk();
        }
        // setSelectedFiles([]);
        // console.log("All file uploads completed");
      };

      uploadFiles();
    } catch (err) {
      console.log(err, 'errfile');
    }
  };

  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();
    let compopt = selectedOptionsCompany.map((item) => item.value);
    let branchopt = selectedOptionsBranch.map((item) => item.value);
    let unitopt = selectedOptionsUnit.map((item) => item.value);
    let teamopt = selectedOptionsTeam.map((item) => item.value);
    let empopt = selectedOptionsCate.map((item) => item.value);
    const isNameMatch = meetingArrayList.some(
      (item) =>
        item.company.some((data) => compopt.includes(data)) &&
        item.branch.some((data) => branchopt.includes(data)) &&
        item.unit.some((data) => unitopt.includes(data)) &&
        item.team.some((data) => teamopt.includes(data)) &&
        item.participants.some((data) => empopt.includes(data)) &&
        item.eventname?.toLowerCase() === eventState.eventname?.toLowerCase() &&
        item.eventdescription?.toLowerCase() === eventState.eventdescription?.toLowerCase() &&
        item.date === eventState.date &&
        item.time === eventState.time &&
        item.duration === eventState.duration &&
        item.area === eventState.area &&
        item.reminder === eventState.reminder
    );
    if (valueCompanyCat?.length == 0) {
      setPopupContentMalert('Please Select Company');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (valueBranchCat?.length == 0) {
      setPopupContentMalert('Please Select Branch');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (valueUnitCat?.length == 0) {
      setPopupContentMalert('Please Select Unit');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (valueTeamCat?.length == 0) {
      setPopupContentMalert('Please Select Team');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (eventState.eventname === '') {
      setPopupContentMalert('Please Enter Event Name');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (eventState.eventdescription === '') {
      setPopupContentMalert('Please Enter Event Description');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (eventState.date === '') {
      setPopupContentMalert('Please Select Date');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (eventState.time === '') {
      setPopupContentMalert('Please Select Time');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (eventState.duration === '00:00' || eventState.duration.includes('Mins')) {
      setPopupContentMalert('Please Select Duration');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (eventState.area === 'Please Select Area' || eventState.area === '') {
      const alertMessage = eventState.area === '' ? 'Please Enter Area' : 'Please Select Area';
      setPopupContentMalert(alertMessage);
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (eventState.reminder === 'Please Select Reminder') {
      setPopupContentMalert('Please Select Reminder');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (valueCate.length === 0) {
      setPopupContentMalert('Please Select Participants');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert('Event Already Exists');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else {
      sendRequest();
    }
  };

  const handleCategoryChange = (options) => {
    if (employeeLength.length === options.length) {
      const filteredOptions = options.filter((option) => option.value !== 'ALL');
      setSelectedOptionsCate(filteredOptions);
      setValueCate(filteredOptions.map((option) => option.value));
    }
    // Check if "ALL" is selected
    else if (options.some((option) => option.value === 'ALL')) {
      // Set "ALL" as the only selected option
      setSelectedOptionsCate([{ value: 'ALL', label: 'ALL' }]);
      setValueCate(['ALL']);
    } else {
      // Filter out "ALL" if any other option is selected
      const filteredOptions = options.filter((option) => option.value !== 'ALL');
      setSelectedOptionsCate(filteredOptions);
      setValueCate(filteredOptions.map((option) => option.value));
    }
  };

  const customValueRendererCate = (valueCate, _employeename) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(', ') : 'Please Select Participants';
  };
  //multiselect edit

  const handleCategoryChangeEdit = (options) => {
    if (employeeLengthEdit.length === options.length) {
      const filteredOptions = options.filter((option) => option.value !== 'ALL');
      setSelectedOptionsCateEdit(filteredOptions);
      setValueCateEdit(filteredOptions.map((option) => option.value));
    }
    // Check if "ALL" is selected
    else if (options.some((option) => option.value === 'ALL')) {
      // Set "ALL" as the only selected option
      setSelectedOptionsCateEdit([{ value: 'ALL', label: 'ALL' }]);
      setValueCateEdit(['ALL']);
    } else {
      // Filter out "ALL" if any other option is selected
      const filteredOptions = options.filter((option) => option.value !== 'ALL');
      setSelectedOptionsCateEdit(filteredOptions);
      setValueCateEdit(filteredOptions.map((option) => option.value));
    }
  };

  const customValueRendererCateEdit = (valueCateEdit, _employeename) => {
    return valueCateEdit.length ? valueCateEdit.map(({ label }) => label).join(', ') : 'Please Select Participants';
  };
  const handleclear = (e) => {
    e.preventDefault();
    setEventState({
      branch: 'Please Select Branch',
      unit: 'Please Select Unit',
      team: 'Please Select Team',
      eventname: '',
      eventdescription: '',
      date: '',
      time: '',
      duration: '00:00',
      area: 'Please Select Area',
      reminder: 'Please Select Reminder',
      insideoffice: true,
      files: '',
    });
    setHours('Hrs');
    setMinutes('Mins');
    setUpload([]);
    setSelectedOptionsCate([]);
    setValueCate([]);

    setValueCompanyCat([]);
    setSelectedOptionsCompany([]);
    setValueBranchCat([]);
    setSelectedOptionsBranch([]);
    setValueUnitCat([]);
    setSelectedOptionsUnit([]);
    setValueTeamCat([]);
    setSelectedOptionsTeam([]);
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
    setHours('Hrs');
    setMinutes('Mins');
    setUpload([]);
  };

  const [oldfileNamesBill, setoldfileNamesBill] = useState([]);

  const getMultipleFilesAsObjects = async (filenames, type, uniqueId) => {
    const files = [];

    for (const name of filenames) {
      const res = await axios.post(
        SERVICE.EVENTS_EDIT_FETCH,
        { filename: `${uniqueId}$${type}$${name}` },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          responseType: 'blob',
        }
      );

      const blob = res.data;
      const file = new File([blob], name, { type: blob.type });
      files.push(file);
    }

    return files;
  };

  const [getimgbillcode, setGetImgbillcode] = useState([]);

  const handleFetchBill = (data, remarks) => {
    const files = Array.from(data); // Ensure it's an array
    // const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    // if (imageFiles.length !== files.length) {
    //   setPopupContentMalert("Only Accept Images!");
    //   setPopupSeverityMalert("info");
    //   handleClickOpenPopupMalert();
    // }

    const fileReaders = [];
    const newSelectedFiles = [];

    // imageFiles.forEach((file) => {
    files.forEach((file) => {
      const reader = new FileReader();

      const readerPromise = new Promise((resolve) => {
        reader.onload = () => {
          const fileData = {
            name: file.name,
            size: file.size,
            type: file.type,
            preview: reader.result,
          };
          newSelectedFiles.push(fileData);
          resolve(file);
        };
      });

      reader.readAsDataURL(file);
      fileReaders.push(readerPromise);
    });

    Promise.all(fileReaders).then((originalFiles) => {
      setUpload(newSelectedFiles);
      setGetImgbillcode(newSelectedFiles);
      // setRefImgbillfilenamesEdit(newSelectedFiles.map((d) => d.name));
      // setRefImgWarrantyBillEdit((existingFiles) => [...existingFiles, originalFiles]);
    });
  };

  //get single row to edit....
  const getCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SINGLE_EVENT}/${e}`, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      setMeetingEdit(res?.data?.sscheduleevent);
      // setUpload(res?.data?.sscheduleevent?.files);
      handleClickOpenEdit();
      const [hours, minutes] = res?.data?.sscheduleevent.duration.split(':');
      setHours(hours);
      setMinutes(minutes);

      setCompanyValueCateEdit(res?.data?.sscheduleevent?.company);
      setSelectedCompanyOptionsCateEdit([
        ...res?.data?.sscheduleevent?.company.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      setBranchValueCateEdit(res?.data?.sscheduleevent?.branch);
      setSelectedBranchOptionsCateEdit([
        ...res?.data?.sscheduleevent?.branch.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      setUnitValueCateEdit(res?.data?.sscheduleevent?.unit);
      setSelectedUnitOptionsCateEdit([
        ...res?.data?.sscheduleevent?.unit.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      setTeamValueCateEdit(res?.data?.sscheduleevent?.team);
      setSelectedTeamOptionsCateEdit([
        ...res?.data?.sscheduleevent?.team.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);

      setValueCateEdit(res?.data?.sscheduleevent.participants);
      setSelectedOptionsCateEdit([
        ...res?.data?.sscheduleevent?.participants.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);

      let emplength = [
        ...allUsersData
          ?.filter((u) => res?.data?.sscheduleevent?.company?.includes(u.company) && res?.data?.sscheduleevent?.branch?.includes(u.branch) && res?.data?.sscheduleevent?.unit?.includes(u.unit) && res?.data?.sscheduleevent?.team?.includes(u.team))
          .map((u) => ({
            ...u,
            label: u.companyname,
            value: u.companyname,
          })),
      ];
      setEmployeeLengthEdit(emplength);

      const filesbill = await getMultipleFilesAsObjects(res?.data?.sscheduleevent?.files, 'events', res?.data?.sscheduleevent?.uniqueId);
      setoldfileNamesBill(res?.data?.sscheduleevent?.files.map((d) => `${res?.data?.sscheduleevent?.uniqueId}$events$${d}`));

      handleFetchBill(filesbill, res?.data?.sscheduleevent?.files);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  // get single row to view....
  const getviewCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SINGLE_EVENT}/${e}`, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      setMeetingEdit(res?.data?.sscheduleevent);
      // setUpload(res?.data?.sscheduleevent?.files);

      const filesbill = await getMultipleFilesAsObjects(res?.data?.sscheduleevent?.files, 'events', res?.data?.sscheduleevent?.uniqueId);
      setoldfileNamesBill(res?.data?.sscheduleevent?.files.map((d) => `${res?.data?.sscheduleevent?.uniqueId}$events$${d}`));

      handleFetchBill(filesbill, res?.data?.sscheduleevent?.files);
      handleClickOpenview();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SINGLE_EVENT}/${e}`, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      setMeetingEdit(res?.data?.sscheduleevent);
      handleClickOpeninfo();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  // updateby edit page...
  let updateby = meetingEdit.updatedby;
  let addedby = meetingEdit.addedby;
  let meetingId = meetingEdit._id;
  //editing the single data...
  const sendEditRequest = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.put(`${SERVICE.SINGLE_EVENT}/${meetingId}`, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
        company: [...companyValueCateEdit],
        branch: [...branchValueCateEdit],
        unit: [...unitValueCateEdit],
        team: [...teamValueCateEdit],
        eventname: String(meetingEdit.eventname),
        eventdescription: String(meetingEdit.eventdescription),
        date: String(meetingEdit.date),
        time: String(meetingEdit.time),
        duration: String(meetingEdit.duration),
        area: String(meetingEdit.area),
        reminder: String(meetingEdit.reminder),
        insideoffice: Boolean(meetingEdit.insideoffice),
        participants: [...valueCateEdit],
        // files: [...upload],
        uniqueId: meetingEdit.uniqueId,
        files: upload?.map((item) => item.name),
        updatedby: [
          ...updateby,
          {
            name: String(isUserRoleAccess.companyname),
            // date: String(new Date(serverTime))
          },
        ],
      });

      await handleFileDeleteOld(oldfileNamesBill);
      await handleFileUpload(upload, 'events', meetingEdit.uniqueId);

      await fetchMeetingAll();
      setHours('Hrs');
      setMinutes('Mins');
      setUpload([]);
      handleCloseModEdit();
      setValueCateEdit('');
      setSelectedOptionsCateEdit([]);
      setPopupContent('Updated Successfully');
      setPopupSeverity('success');
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const handleFileDeleteOld = async (filenames) => {
    try {
      let res_project = await axios.post(SERVICE.EDIT_OLDDATA_DELETE_EVENTS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        filenames: filenames,
      });
    } catch (err) {
      console.log(err, 'errfile');
    }
  };

  const editSubmit = (e) => {
    e.preventDefault();
    fetchMeetingAll();
    let compopt = selectedCompanyOptionsCateEdit.map((item) => item.value);
    let branchopt = selectedBranchOptionsCateEdit.map((item) => item.value);
    let unitopt = selectedUnitOptionsCateEdit.map((item) => item.value);
    let teamopt = selectedTeamOptionsCateEdit.map((item) => item.value);
    let empopt = selectedOptionsCateEdit.map((item) => item.value);
    const isNameMatch = allStatusEdit.some(
      (item) =>
        item.company.some((data) => compopt.includes(data)) &&
        item.branch.some((data) => branchopt.includes(data)) &&
        item.unit.some((data) => unitopt.includes(data)) &&
        item.team.some((data) => teamopt.includes(data)) &&
        item.participants.some((data) => empopt.includes(data)) &&
        item.eventname?.toLowerCase() === meetingEdit.eventname?.toLowerCase() &&
        item.eventdescription?.toLowerCase() === meetingEdit.eventdescription?.toLowerCase() &&
        item.date === meetingEdit.date &&
        item.time === meetingEdit.time &&
        item.duration === meetingEdit.duration &&
        item.area === meetingEdit.area &&
        item.reminder === meetingEdit.reminder
    );
    if (companyValueCateEdit?.length == 0) {
      setPopupContentMalert('Please Select Company');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (branchValueCateEdit?.length == 0) {
      setPopupContentMalert('Please Select Branch');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (unitValueCateEdit?.length == 0) {
      setPopupContentMalert('Please Select Unit');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (teamValueCateEdit?.length == 0) {
      setPopupContentMalert('Please Select Team');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (meetingEdit.eventname === '') {
      setPopupContentMalert('Please Enter Event Name');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (meetingEdit.eventdescription === '') {
      setPopupContentMalert('Please Enter Event Description');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (meetingEdit.date === '') {
      setPopupContentMalert('Please Select Date');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (meetingEdit.time === '') {
      setPopupContentMalert('Please Select Time');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (meetingEdit.duration === '00:00' || meetingEdit.duration.includes('Mins')) {
      setPopupContentMalert('Please Select Duration');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (meetingEdit.area === 'Please Select Area' || meetingEdit.area === '') {
      const alertMessage = meetingEdit.area === '' ? 'Please Enter Area' : 'Please Select Area';
      setPopupContentMalert(alertMessage);
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (meetingEdit.reminder === 'Please Select Reminder') {
      setPopupContentMalert('Please Select Reminder');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (valueCateEdit.length === 0) {
      setPopupContentMalert('Please Select Participants');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert('Event Already Exists');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else {
      sendEditRequest();
    }
  };

  //get all data.
  const fetchMeetingAll = async () => {
    setPageName(!pageName);
    setMeetingCheck(true);

    try {

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
      let res_status = await axios.post(SERVICE.SCHEDULE_EVENTS_LIST_HOME_TEAM, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        assignbranch: accessbranch,
          hierarchyempnames: res?.data?.resultAccessFilter,
      });
      const result = res_status?.data?.scheduleevent.filter((data, index) => {
        return (
          data.company.includes(isUserRoleAccess.company) && data.branch.includes(isUserRoleAccess.branch) && data.unit.includes(isUserRoleAccess.unit) && data.team.includes(isUserRoleAccess.team) && (data.participants.includes(isUserRoleAccess.companyname) || data.participants.includes('ALL'))
        );
      });

      const resdata = isUserRoleAccess.role.includes('Manager') ? res_status?.data?.scheduleevent : result;
      setMeetingArrayList(resdata);
      setMeetingArray(
        resdata.map((item, index) => ({
          ...item,
          serialNumber: index + 1,
          company: item.company?.map((t, i) => `${i + 1 + '. '}` + t).toString(),
          branch: item.branch?.map((t, i) => `${i + 1 + '. '}` + t).toString(),
          unit: item.unit?.map((t, i) => `${i + 1 + '. '}` + t).toString(),
          team: item.team?.map((t, i) => `${i + 1 + '. '}` + t).toString(),
          participants: item.participants?.map((t, i) => `${i + 1 + '. '}` + t).toString(),
          date: moment(item.date).format('DD-MM-YYYY'),
        }))
      );
      setAllStatusEdit(res_status?.data?.scheduleevent.filter((item) => item._id !== meetingEdit?._id));
      setMeetingCheck(false);
    } catch (err) {
      setMeetingCheck(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const gridRefTableImg = useRef(null);
  // image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage
        .toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, 'Events.png');
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
    documentTitle: 'Events List',
    pageStyle: 'print',
  });
  //serial no for listing items
  const addSerialNumber = (datas) => {
    setItems(datas);
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
  const searchOverAllTerms = searchQuery.toLowerCase().split(' ');
  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchOverAllTerms.every((term) => Object.values(item).join(' ').toLowerCase().includes(term));
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
  const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
    <div>
      <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
    </div>
  );

  // const getDownloadFile = (data) => {
  //   console.log(data, 'dataass')
  //   data.forEach((d) => {
  //     // const fileExtension = getFileExtension(d.name);
  //     const url = `${BASE_URL}/event_files/${d}`; // Construct the URL based on your server setup
  //     window.open(url, '_blank');

  //     // if (
  //     //   fileExtension === "xlsx" ||
  //     //   fileExtension === "xls" ||
  //     //   fileExtension === "csv"
  //     // ) {
  //     //   readExcel(d.data)
  //     //     .then((excelData) => {
  //     //       const newTab = window.open();
  //     //       newTab.document.open();
  //     //       newTab.document.write(
  //     //         "<html><head><title>Excel File</title></head><body></body></html>"
  //     //       );
  //     //       newTab.document.close();
  //     //       const htmlTable = generateHtmlTable(excelData);
  //     //       newTab.document.body.innerHTML = htmlTable;
  //     //     })
  //     //     .catch((error) => {
  //     //       console.error("Error:", error);
  //     //     });
  //     // } else if (fileExtension === "pdf") {
  //     //   const newTab = window.open();
  //     //   newTab.document.write(
  //     //     '<iframe width="100%" height="100%" src="' + d.preview + '"></iframe>'
  //     //   );
  //     // } else if (fileExtension === "png" || fileExtension === "jpg") {
  //     //   const response = await fetch(d.preview);
  //     //   const blob = await response.blob();
  //     //   const url = window.URL.createObjectURL(blob);
  //     //   const newTab = window.open(url, "_blank");
  //     // }
  //   });

  //   function getFileExtension(filename) {
  //     return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
  //   }

  //   function readExcel(base64Data) {
  //     return new Promise((resolve, reject) => {
  //       const bufferArray = Uint8Array.from(atob(base64Data), (c) =>
  //         c.charCodeAt(0)
  //       ).buffer;
  //       const wb = XLSX.read(bufferArray, { type: "buffer" });
  //       const wsname = wb.SheetNames[0];
  //       const ws = wb.Sheets[wsname];
  //       const data = XLSX.utils.sheet_to_json(ws);
  //       resolve(data);
  //     });
  //   }

  //   function generateHtmlTable(data) {
  //     const headers = Object.keys(data[0]);
  //     const tableHeader = `<tr>${headers
  //       .map(
  //         (header) =>
  //           `<th style="padding: 4px; background-color: #f2f2f2;">${header}</th>`
  //       )
  //       .join("")}</tr>`;
  //     const tableRows = data.map((row, index) => {
  //       const rowStyle = index % 2 === 0 ? "background-color: #f9f9f9;" : "";
  //       const cells = headers
  //         .map(
  //           (header) =>
  //             `<td style="padding: 4px;${rowStyle}">${row[header]}</td>`
  //         )
  //         .join("");
  //       return `<tr>${cells}</tr>`;
  //     });
  //     return `<table style="border-collapse: collapse; width: 100%;" border="1"; overflow :"scroll">${tableHeader}${tableRows.join(
  //       ""
  //     )}</table>`;
  //   }
  // };

  // list view option code
  const [isimgviewbill, setImgviewbill] = useState(false);
  const handleImgcodeviewbill = () => {
    setImgviewbill(true);
  };
  const handlecloseImgcodeviewbill = () => {
    setImgviewbill(false);
  };

  const getDownloadFile = async (id) => {
    let res = await axios.get(`${SERVICE.SINGLE_EVENT}/${id}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
    });
    const filesbill = await getMultipleFilesAsObjects(res?.data?.sscheduleevent?.files, 'events', res?.data?.sscheduleevent?.uniqueId);
    setoldfileNamesBill(res?.data?.sscheduleevent?.files.map((d) => `${res?.data?.sscheduleevent?.uniqueId}$events$${d}`));

    handleFetchBill(filesbill, res?.data?.sscheduleevent?.files);

    // setGetImgbillcode(res?.data?.sscheduleevent.files);
    handleImgcodeviewbill();
  };

  const columnDataTable = [
    {
      field: 'checkbox',
      headerName: 'Checkbox',
      headerStyle: { fontWeight: 'bold' },

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
      headerName: 'SNo',
      flex: 0,
      width: 100,
      hide: !columnVisibility.serialNumber,
      headerClassName: 'bold-header',
      pinned: 'left',
      lockPinned: true,
    },
    {
      field: 'company',
      headerName: 'Company',
      flex: 0,
      width: 150,
      hide: !columnVisibility.company,
      headerClassName: 'bold-header',
      pinned: 'left',
      lockPinned: true,
    },
    {
      field: 'branch',
      headerName: 'Branch',
      flex: 0,
      width: 150,
      hide: !columnVisibility.branch,
      headerClassName: 'bold-header',
    },
    {
      field: 'unit',
      headerName: 'Unit',
      flex: 0,
      width: 150,
      hide: !columnVisibility.unit,
      headerClassName: 'bold-header',
    },
    {
      field: 'team',
      headerName: 'Team',
      flex: 0,
      width: 150,
      hide: !columnVisibility.team,
      headerClassName: 'bold-header',
    },
    {
      field: 'eventname',
      headerName: 'Event Name',
      flex: 0,
      width: 150,
      hide: !columnVisibility.eventname,
      headerClassName: 'bold-header',
    },
    {
      field: 'eventdescription',
      headerName: 'Event Description',
      flex: 0,
      width: 150,
      hide: !columnVisibility.eventdescription,
      headerClassName: 'bold-header',
    },
    {
      field: 'date',
      headerName: 'Date',
      flex: 0,
      width: 100,
      hide: !columnVisibility.date,
      headerClassName: 'bold-header',
    },
    {
      field: 'time',
      headerName: 'Time',
      flex: 0,
      width: 100,
      hide: !columnVisibility.time,
      headerClassName: 'bold-header',
    },
    {
      field: 'duration',
      headerName: 'Duration',
      flex: 0,
      width: 100,
      hide: !columnVisibility.duration,
      headerClassName: 'bold-header',
    },
    {
      field: 'area',
      headerName: 'Area',
      flex: 0,
      width: 100,
      hide: !columnVisibility.area,
      headerClassName: 'bold-header',
    },
    {
      field: 'reminder',
      headerName: 'Reminder',
      flex: 0,
      width: 100,
      hide: !columnVisibility.reminder,
      headerClassName: 'bold-header',
    },
    {
      field: 'participants',
      headerName: 'Participants',
      flex: 0,
      width: 180,
      hide: !columnVisibility.participants,
      headerClassName: 'bold-header',
    },
    {
      field: 'document',
      headerName: 'Document',
      sortable: false,
      flex: 0,
      width: 180,
      minHeight: '40px',
      hide: !columnVisibility.document,
      cellRenderer: (params) => (
        <Grid>
          {/* <Button
            variant="text"
            sx={userStyle.buttonview}
            onClick={() => {
              getDownloadFile(params.data.document);
            }}

          >
            {params.data.document?.length > 0 ? "View" : " "}
          </Button> */}
          <Button
            sx={{
              padding: '14px 14px',
              minWidth: '40px !important',
              borderRadius: '50% !important',
              ':hover': {
                backgroundColor: '#80808036', // theme.palette.primary.main
              },
            }}
            onClick={() => getDownloadFile(params.data.id)}
          >
            view
          </Button>
        </Grid>
      ),
    },
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
          {isUserRoleCompare?.includes('emanageevents') && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.data.id);
              }}
            >
              <EditOutlinedIcon sx={buttonStyles.buttonedit} />{' '}
            </Button>
          )}
          {isUserRoleCompare?.includes('dmanageevents') && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.data.id);
              }}
            >
              {' '}
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />{' '}
            </Button>
          )}
          {isUserRoleCompare?.includes('vmanageevents') && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.data.id);
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
            </Button>
          )}
          {isUserRoleCompare?.includes('imanageevents') && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getinfoCode(params.data.id);
              }}
            >
              <InfoOutlinedIcon sx={buttonStyles.buttoninfo} />
            </Button>
          )}
        </Grid>
      ),
    },
  ];
  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      company: item.company,
      branch: item.branch,
      unit: item.unit,
      team: item.team,
      participants: item.participants,
      date: item.date,
      eventname: item.eventname,
      eventdescription: item.eventdescription,
      time: item.time,
      duration: item.duration,
      area: item.area,
      reminder: item.reminder,
      document: item.files,
    };
  });
  const rowsWithCheckboxes = rowDataTable.map((row) => ({
    ...row,
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
              Hide All{' '}
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );
  return (
    <Box>
      <Headtitle title={'EVENTS'} />
      <PageHeading title="Manage Events" modulename="Human Resources" submodulename="HR" mainpagename="Events" subpagename="Manage Events" subsubpagename="" />
     
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes('lmanageevents') && (
        <>
          <Box sx={userStyle.container}>
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>List Events</Typography>
            </Grid>
            <Grid container spacing={2} style={userStyle.dataTablestyle}>
              <Grid item md={2} xs={12} sm={12}>
                <Box>
                  <label>Show entries:</label>
                  <Select
                    id="pageSizeSelect"
                    value={pageSize}
                    MenuProps={{
                      PaperProps: { style: { maxHeight: 180, width: 80 } },
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
                    <MenuItem value={meetingArray?.length}>All</MenuItem>
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
                  {isUserRoleCompare?.includes('excelmanageevents') && (
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
                  {isUserRoleCompare?.includes('csvmanageevents') && (
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
                  {isUserRoleCompare?.includes('printmanageevents') && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp; <FaPrint /> &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes('pdfmanageevents') && (
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
                  {isUserRoleCompare?.includes('imagemanageevents') && (
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
                  maindatas={meetingArray}
                  setSearchedString={setSearchedString}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  paginated={false}
                  totalDatas={meetingArray}
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
            &ensp;
            {isUserRoleCompare?.includes('bdmanageevents') && (
              <Button variant="contained" sx={buttonStyles.buttonbulkdelete} onClick={handleClickOpenalert}>
                Bulk Delete
              </Button>
            )}
            <br />
            {meetingCheck ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  minHeight: '350px',
                }}
              >
                <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
              </Box>
            ) : (
              <Box style={{ width: '100%', overflowY: 'hidden' }}>
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
                    gridRefTable={gridRefTable}
                    paginated={false}
                    filteredDatas={filteredDatas}
                    // totalDatas={totalDatas}
                    searchQuery={searchedString}
                    handleShowAllColumns={handleShowAllColumns}
                    setFilteredRowData={setFilteredRowData}
                    filteredRowData={filteredRowData}
                    setFilteredChanges={setFilteredChanges}
                    filteredChanges={filteredChanges}
                    gridRefTableImg={gridRefTableImg}
                    itemsList={meetingArray}
                  />
                </>
              </Box>
            )}
          </Box>
        </>
      )}

      {/* Manage Column */}
      <Popover id={id} open={isManageColumnsOpen} anchorEl={anchorEl} onClose={handleCloseManageColumns} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
        {' '}
        {manageColumnsContent}
      </Popover>

      {/* view model */}
      <Dialog open={openview} onClose={handleClickOpenview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md" sx={{ marginTop: '47px' }}>
        <Box sx={{ padding: '20px 50px' }}>
          <>
            <Typography sx={userStyle.HeaderText}> View Event List</Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Company</Typography>
                  <Typography>{meetingEdit.company?.map((t, i) => `${i + 1 + '. '}` + t).toString()}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Branch</Typography>
                  <Typography>{meetingEdit.branch?.map((t, i) => `${i + 1 + '. '}` + t).toString()}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Unit</Typography>
                  <Typography>{meetingEdit.unit?.map((t, i) => `${i + 1 + '. '}` + t).toString()}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Team</Typography>
                  <Typography>{meetingEdit.team?.map((t, i) => `${i + 1 + '. '}` + t).toString()}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Event Name</Typography>
                  <Typography>{meetingEdit.eventname}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Event Description</Typography>
                  <Typography>{meetingEdit.eventdescription}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Date</Typography>
                  <Typography>{moment(meetingEdit.date).format('DD-MM-YYYY')}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Time</Typography>
                  <Typography>{meetingEdit.time}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Duration</Typography>
                  <Typography>{meetingEdit.duration}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Area</Typography>
                  <Typography>{meetingEdit.area}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Reminder</Typography>
                  <Typography>{meetingEdit.reminder}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Participants</Typography>
                  <Typography>{meetingEdit.participants?.map((t, i) => `${i + 1 + '. '}` + t).toString()}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={12} sm={12} xs={12}>
                <Typography variant="h6">Attachment</Typography>
                <Grid marginTop={2}>
                  {upload?.length > 0 &&
                    upload?.map((file, index) => (
                      <>
                        <Grid container spacing={2}>
                          <Grid item lg={4} md={8} sm={8} xs={8}>
                            <Typography>{file.name}</Typography>
                          </Grid>
                          <Grid item lg={1} md={1} sm={1} xs={1}>
                            <VisibilityOutlinedIcon
                              style={{
                                fontsize: 'large',
                                color: '#357AE8',
                                cursor: 'pointer',
                              }}
                              onClick={() => renderFilePreview(file)}
                            />
                          </Grid>
                        </Grid>
                      </>
                    ))}
                </Grid>
              </Grid>
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Button variant="contained" sx={buttonStyles.btncancel} onClick={handleCloseview}>
                Back
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>
      {/* Edit DIALOG */}
      <Box>
        <Dialog open={isEditOpen} onClose={handleCloseModEdit} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md" sx={{ marginTop: '47px' }}>
          <Box sx={{ padding: '20px 50px' }}>
            <>
              <Grid container spacing={2}>
                <Typography sx={userStyle.HeaderText}> Edit Event List </Typography>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Company<b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={accessbranch
                        ?.map((data) => ({
                          label: data.company,
                          value: data.company,
                        }))
                        .filter((item, index, self) => {
                          return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                        })}
                      value={selectedCompanyOptionsCateEdit}
                      onChange={handleCompanyChangeEdit}
                      valueRenderer={customValueRendererCompanyEdit}
                      labelledBy="Please Select Company"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Branch<b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={accessbranch
                        ?.filter((comp) => companyValueCateEdit?.includes(comp.company))
                        ?.map((data) => ({
                          label: data.branch,
                          value: data.branch,
                        }))
                        .filter((item, index, self) => {
                          return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                        })}
                      value={selectedBranchOptionsCateEdit}
                      onChange={handleBranchChangeEdit}
                      valueRenderer={customValueRendererBranchEdit}
                      labelledBy="Please Select Branch"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Unit<b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={accessbranch
                        ?.filter((comp) => companyValueCateEdit?.includes(comp.company) && branchValueCateEdit?.includes(comp.branch))
                        ?.map((data) => ({
                          label: data.unit,
                          value: data.unit,
                        }))
                        .filter((item, index, self) => {
                          return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                        })}
                      value={selectedUnitOptionsCateEdit}
                      onChange={handleUnitChangeEdit}
                      valueRenderer={customValueRendererUnitEdit}
                      labelledBy="Please Select Unit"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Team<b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={allTeam
                        ?.filter((u) => companyValueCateEdit?.includes(u.company) && branchValueCateEdit?.includes(u.branch) && unitValueCateEdit?.includes(u.unit))
                        .map((u) => ({
                          ...u,
                          label: u.teamname,
                          value: u.teamname,
                        }))}
                      value={selectedTeamOptionsCateEdit}
                      onChange={handleTeamChangeEdit}
                      valueRenderer={customValueRendererTeamEdit}
                      labelledBy="Please Select Team"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <FormControl fullWidth size="small">
                      <Typography>
                        Event Name<b style={{ color: 'red' }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Please Enter Event Name"
                        value={meetingEdit.eventname}
                        onChange={(e) => {
                          setMeetingEdit({
                            ...meetingEdit,
                            eventname: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Event Description<b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <TextareaAutosize
                      aria-label="minimum height"
                      minRows={3}
                      value={meetingEdit.eventdescription}
                      onChange={(e) => {
                        setMeetingEdit({
                          ...meetingEdit,
                          eventdescription: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Date<b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="date"
                      value={meetingEdit.date}
                      onChange={(e) => {
                        setMeetingEdit({
                          ...meetingEdit,
                          date: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Time<b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="time"
                      placeholder="HH:MM:AM/PM"
                      value={meetingEdit.time}
                      onChange={(e) => {
                        setMeetingEdit({
                          ...meetingEdit,
                          time: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <Typography>
                    Duration<b style={{ color: 'red' }}>*</b>
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid item md={6} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Selects
                          maxMenuHeight={300}
                          options={hrsOption}
                          placeholder="Hrs"
                          value={{ label: hours, value: hours }}
                          onChange={(e) => {
                            setHours(e.value);
                            setMeetingEdit({
                              ...meetingEdit,
                              duration: `${e.value}:${minutes}`,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Selects
                          maxMenuHeight={300}
                          options={minsOption}
                          placeholder="Mins"
                          value={{ label: minutes, value: minutes }}
                          onChange={(e) => {
                            setMinutes(e.value);
                            setMeetingEdit({
                              ...meetingEdit,
                              duration: `${hours}:${e.value}`,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                {meetingEdit.insideoffice ? (
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Area<b style={{ color: 'red' }}>*</b>
                      </Typography>
                      <Selects
                        maxMenuHeight={300}
                        options={locationOption}
                        placeholder="Please Select Area"
                        value={{
                          label: meetingEdit.area,
                          value: meetingEdit.area,
                        }}
                        onChange={(e) => {
                          setMeetingEdit({ ...meetingEdit, area: e.value });
                        }}
                      />
                    </FormControl>
                    <Grid>
                      <FormGroup>
                        <FormControlLabel
                          control={<Checkbox checked={meetingEdit.insideoffice} />}
                          onChange={(e) =>
                            setMeetingEdit({
                              ...meetingEdit,
                              insideoffice: !meetingEdit.insideoffice,
                              area: '',
                            })
                          }
                          label="Inside Office"
                        />
                      </FormGroup>
                    </Grid>
                  </Grid>
                ) : (
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Area<b style={{ color: 'red' }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Please Enter Area"
                        value={meetingEdit.area}
                        onChange={(e) => {
                          setMeetingEdit({
                            ...meetingEdit,
                            area: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                    <Grid>
                      <FormGroup>
                        <FormControlLabel
                          control={<Checkbox checked={meetingEdit.insideoffice} />}
                          onChange={(e) =>
                            setMeetingEdit({
                              ...meetingEdit,
                              insideoffice: !meetingEdit.insideoffice,
                              area: 'Please Select Area',
                            })
                          }
                          label="Inside Office"
                        />
                      </FormGroup>
                    </Grid>
                  </Grid>
                )}
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Reminder<b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={reminderOption}
                      placeholder="Please Select Reminder"
                      value={{
                        label: meetingEdit.reminder,
                        value: meetingEdit.reminder,
                      }}
                      onChange={(e) => {
                        setMeetingEdit({ ...meetingEdit, reminder: e.value });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Participants<b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={[
                        { label: 'ALL', value: 'ALL' },
                        ...allUsersData
                          ?.filter((u) => companyValueCateEdit?.includes(u.company) && branchValueCateEdit?.includes(u.branch) && unitValueCateEdit?.includes(u.unit) && teamValueCateEdit?.includes(u.team))
                          .map((u) => ({
                            ...u,
                            label: u.companyname,
                            value: u.companyname,
                          })),
                      ]}
                      value={selectedOptionsCateEdit}
                      onChange={handleCategoryChangeEdit}
                      valueRenderer={customValueRendererCateEdit}
                      labelledBy="Please Select Participants"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={12} xs={12} sm={12}></Grid>
                <br />
                <Grid item xs={12} sx={{ margin: '20px 0px 10px 0px' }}>
                  <Typography sx={userStyle.importheadtext}>
                    {' '}
                    <b>Upload Attachments</b>{' '}
                  </Typography>
                </Grid>
                <Grid item lg={2} md={2} xs={12} sm={12} sx={{ marginTop: '20px' }}>
                  <Button variant="outlined" size="small" sx={buttonStyles.buttonsubmit} component="label">
                    Upload
                    <input type="file" id="resume" multiple accept=".pdf, .doc, .txt," name="file" hidden onChange={handleResumeUpload} />{' '}
                  </Button>
                </Grid>
                <Grid item lg={6} md={6} xs={12} sm={12} sx={{ marginTop: '20px' }}>
                  {upload?.length > 0 &&
                    upload?.map((file, index) => (
                      <>
                        <Grid container spacing={2}>
                          <Grid item lg={8} md={8} sm={8} xs={8}>
                            <Typography>{file.name}</Typography>
                          </Grid>
                          <Grid item lg={1} md={1} sm={1} xs={1}>
                            <VisibilityOutlinedIcon
                              style={{
                                fontsize: 'large',
                                color: '#357AE8',
                                cursor: 'pointer',
                              }}
                              onClick={() => renderFilePreview(file)}
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
                              onClick={() => handleFileDelete(index)}
                            >
                              <DeleteIcon />
                            </Button>
                          </Grid>
                        </Grid>
                      </>
                    ))}
                </Grid>
              </Grid>
              <br /> <br />
              <Grid container spacing={2}></Grid>
              <DialogActions>
                <Button variant="contained" onClick={editSubmit} sx={buttonStyles.buttonsubmit}>
                  {' '}
                  Update
                </Button>
                <Button sx={buttonStyles.btncancel} onClick={handleCloseModEdit}>
                  {' '}
                  Cancel{' '}
                </Button>
              </DialogActions>
            </>
          </Box>
        </Dialog>
      </Box>
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
              {' '}
              ok{' '}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      <Dialog open={isimgviewbill} onClose={handlecloseImgcodeviewbill} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md" fullWidth>
        <DialogContent>
          <Typography variant="h6">Document Files</Typography>
          <Grid container>
            <Grid item md={4} sm={10} xs={10} sx={{ display: 'flex', alignItems: 'center' }}>
              {' '}
              <Typography variant="h6">File Name</Typography>{' '}
            </Grid>
            {/* <Grid
              item
              md={4}
              sm={10}
              xs={10}
              sx={{ display: "flex", alignItems: "center" }}
            > <Typography variant="h6">Remarks</Typography>    </Grid> */}
          </Grid>
          {getimgbillcode.map((imagefilebill, index) => (
            <Grid container key={index}>
              <Grid item md={3} sm={10} xs={10}>
                {/* {imagefilebill.type.includes("image/") ? (
                  <img
                    src={imagefilebill.preview}
                    alt={imagefilebill.name}
                    height={40}
                    style={{
                      maxWidth: "70px",
                      maxHeight: "70px",
                      marginTop: "10px",
                    }}
                  />
                ) : (
                  <img
                    className={classes.preview}
                    src={getFileIcon(imagefilebill.name)}
                    height={40}
                    alt="file icon"
                  />
                )} */}

                {/* {imagefilebill.type.includes("image/") ? (
                  <img
                    src={imagefilebill.preview}
                    alt={imagefilebill.name}
                    height={40}
                    style={{ maxWidth: "70px", maxHeight: "70px", marginTop: "10px" }}
                  />
                ) : imagefilebill.type === "application/pdf" ? (
                  <embed
                    src={imagefilebill.preview}
                    type="application/pdf"
                    width="70"
                    height="70"
                    style={{ marginTop: "10px" }}
                  />
                ) : (
                  <img
                    src={getFileIcon(imagefilebill.name)}
                    alt="file icon"
                    height={40}
                    style={{ maxWidth: "70px", maxHeight: "70px", marginTop: "10px" }}
                  />
                )} */}

                {imagefilebill.type.includes('image/') ? (
                  <img
                    src={imagefilebill.preview}
                    alt={imagefilebill.name}
                    height={40}
                    style={{
                      maxWidth: '70px',
                      maxHeight: '70px',
                      marginTop: '10px',
                    }}
                  />
                ) : imagefilebill.type === 'application/pdf' ? (
                  <embed src={imagefilebill.preview} type="application/pdf" width="70" height="70" style={{ marginTop: '10px' }} />
                ) : (
                  <img
                    src={getFileIcon(imagefilebill.name)}
                    alt="file icon"
                    height={40}
                    style={{
                      maxWidth: '70px',
                      maxHeight: '70px',
                      marginTop: '10px',
                    }}
                  />
                )}
              </Grid>

              <Grid item md={4} sm={10} xs={10} sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography>{imagefilebill.name}</Typography>
              </Grid>
              {/* <Grid
                item
                md={4}
                sm={10}
                xs={10}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Typography>{imagefilebill.remarks}</Typography>
              </Grid> */}
              <Grid item md={1} sm={1} xs={1}>
                <Button
                  sx={{
                    padding: '14px 14px',
                    minWidth: '40px !important',
                    borderRadius: '50% !important',
                    ':hover': {
                      backgroundColor: '#80808036', // theme.palette.primary.main
                    },
                  }}
                  onClick={() => renderFilePreview(imagefilebill)}
                >
                  <VisibilityOutlinedIcon
                    style={{
                      fontsize: '12px',
                      color: '#357AE8',
                      marginTop: '35px !important',
                    }}
                  />
                </Button>
              </Grid>
            </Grid>
          ))}
        </DialogContent>

        <DialogActions>
          <Button onClick={handlecloseImgcodeviewbill} sx={userStyle.btncancel}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

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
        itemsTwo={meetingArray ?? []}
        filename={'Events'}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup openInfo={openInfo} handleCloseinfo={handleCloseinfo} heading="Event Info" addedby={addedby} updateby={updateby} />
      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation open={isDeleteOpen} onClose={handleCloseMod} onConfirm={delMeeting} title="Are you sure?" confirmButtonText="Yes" cancelButtonText="Cancel" />
      {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation open={isDeleteOpencheckbox} onClose={handleCloseModcheckbox} onConfirm={bulkdeletefunction} title="Are you sure?" confirmButtonText="Yes" cancelButtonText="Cancel" />
      {/* PLEASE SELECT ANY ROW */}
      <PleaseSelectRow open={isDeleteOpenalert} onClose={handleCloseModalert} message="Please Select any Row" iconColor="orange" buttonText="OK" />
      {/* EXTERNAL COMPONENTS -------------- END */}
      <br />
    </Box>
  );
}
export default Events;
