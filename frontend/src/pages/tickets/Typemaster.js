import React, { useState, useEffect, useRef, useContext } from 'react';
import { Box, Typography, OutlinedInput, Select, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton } from '@mui/material';
import { userStyle, colourStyles } from '../../pageStyle';
import { FaPrint, FaFilePdf, FaFileCsv, FaFileExcel } from 'react-icons/fa';
import 'jspdf-autotable';
import axios from '../../axiosInstance';
import { MultiSelect } from 'react-multi-select-component';
import { SERVICE } from '../../services/Baseservice';
import { handleApiError } from '../../components/Errorhandling';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useReactToPrint } from 'react-to-print';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { UserRoleAccessContext } from '../../context/Appcontext';
import { AuthContext } from '../../context/Appcontext';
import Headtitle from '../../components/Headtitle';
import { ThreeDots } from 'react-loader-spinner';
import { saveAs } from 'file-saver';
import Switch from '@mui/material/Switch';
import CloseIcon from '@mui/icons-material/Close';
import html2canvas from 'html2canvas';
import ImageIcon from '@mui/icons-material/Image';
import Selects from 'react-select';
import LoadingButton from '@mui/lab/LoadingButton';
import ExportData from '../../components/ExportData';
import AlertDialog from '../../components/Alert';
import MessageAlert from '../../components/MessageAlert';
import InfoPopup from '../../components/InfoPopup.js';
import { DeleteConfirmation, PleaseSelectRow } from '../../components/DeleteConfirmation.js';
import PageHeading from '../../components/PageHeading';
import AggregatedSearchBar from '../../components/AggregatedSearchBar';
import AggridTable from '../../components/AggridTable';
import domtoimage from 'dom-to-image';
import { getCurrentServerTime } from '../../components/getCurrentServerTime';

function Typemaster() {
  const [serverTime, setServerTime] = useState(null);
    useEffect(() => {
      const fetchTime = async () => {
        const time = await getCurrentServerTime();
        setServerTime(time);
      };
  
      fetchTime();
    }, []);
  
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

  let exportColumnNames = ['Type Name', 'Department', 'Action', 'Nature Type'];
  let exportRowValues = ['typename', 'department', 'action', 'naturetype'];

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String('Type  Master'),
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

  const gridRef = useRef(null);
  const gridRefTable = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState('');
  const [department, setDeparttment] = useState([]);
  const [projectCheck, setProjectCheck] = useState(false);
  const [projectmaster, setProjectmaster] = useState({
    typename: '',
    department: 'Please Select Department',
    action: 'Please Select Action',
    naturetype: 'Please Select Nature',
    addedby: '',
    updatedby: '',
  });
  const [projEdit, setProjedit] = useState({
    typename: '',
    department: 'Please Select Department',
    action: 'Please Select Action',
    naturetype: 'Please Select Nature',
  });
  const [projmaster, setProjmaster] = useState([]);
  const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);

  const actionsdrop = [
    // { label: 'Level', value: "Level" },
    { label: 'Required', value: 'Required' },
    { label: 'Not Required', value: 'Not Required' },
  ];
  const naturedrop = [
    // { label: 'Level', value: "Level" },
    { label: 'Remote', value: 'Remote' },
    { label: 'Facility', value: 'Facility' },
  ];
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedString, setSearchedString] = useState('');
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [openview, setOpenview] = useState(false);
  const [openInfo, setOpeninfo] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteproject, setDeleteproject] = useState({});
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isBtn, setIsBtn] = useState(false);
  const [copiedData, setCopiedData] = useState('');
  const [selectedOptionsDpt, setSelectedOptionsDpt] = useState([]);
  let [valueCat, setValueCat] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
  const [fileFormat, setFormat] = useState('');

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };
  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  const gridRefTableImg = useRef(null);
  // image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage
        .toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, 'Type Master.png');
        })
        .catch((error) => {
          console.error('dom-to-image error: ', error);
        });
    }
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
  };

  //check delete model
  const [isCheckOpen, setisCheckOpen] = useState(false);
  const handleClickOpenCheck = () => {
    setisCheckOpen(true);
  };
  const handleCloseCheck = () => {
    setisCheckOpen(false);
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

  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

  const handleClickOpenalert = () => {
    setIsHandleChange(true);
    if (selectedRows.length === 0) {
      setIsDeleteOpenalert(true);
    } else {
      getOverallEditSectionOverallDelete(selectedRows);
    }
  };

  const [selectedRowsCount, setSelectedRowsCount] = useState(0);
  //overall edit section for all pages
  const getOverallEditSectionOverallDelete = async (ids) => {
    try {
      let res = await axios.post(SERVICE.OVERALL_BULK_TYPEMASTER_TICKET_DELETE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        id: ids,
      });
      setSelectedRows(res?.data?.result);
      setSelectedRowsCount(res?.data?.count);
      setSelectAllChecked(res?.data?.count === filteredData.length);
      setIsDeleteOpencheckbox(true);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
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

  // Error Popup model
  const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
  const [showAlertpop, setShowAlertpop] = useState();
  const handleClickOpenerrpop = () => {
    setIsErrorOpenpop(true);
  };
  const handleCloseerrpop = () => {
    setIsErrorOpenpop(false);
  };

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ''; // This is required for Chrome support
  };

  const username = isUserRoleAccess.username;
  const userData = {
    name: username,
    date: new Date(serverTime),
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

  const handleCategoryChange = (options) => {
    setValueCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsDpt(options);
  };

  const getRowClassName = (params) => {
    if (selectedRows.includes(params.row.id)) {
      return 'custom-id-row'; // This is the custom class for rows with item.tat === 'ago'
    }
    return ''; // Return an empty string for other rows
  };

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    typename: true,
    department: true,
    action: true,
    naturetype: true,
    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

  //set function to get particular row
  const rowData = async (id, name) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.TYPETICKETMASTER_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeleteproject(res?.data?.sticketmastertype);
      setOvProjDelete(res?.data?.sticketmastertype?.typename);
      getOverallEditSectionDelete(res?.data?.sticketmastertype?.typename);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //overall edit section for all pages
  const getOverallEditSectionDelete = async (e) => {
    try {
      let res = await axios.post(SERVICE.OVERALL_TYPEMASTER_TICKET_DELETE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        oldname: e,
      });
      setOvProjCountDelete(res?.data?.count);
      setGetOverallCountDelete(`The Type Master data is linked in 
         ${res?.data?.reason?.length > 0 ? 'Reason Master,' : ''}
         ${res?.data?.resolver?.length > 0 ? 'Resolver Reason Master,' : ''}
         ${res?.data?.selfcheck?.length > 0 ? 'Self CheckPoint Master,' : ''}
         ${res?.data?.check?.length > 0 ? 'CheckPoint Master Master,' : ''}
         ${res?.data?.teamgroup?.length > 0 ? 'TeamGrouping Master,' : ''}
         ${res?.data?.priority?.length > 0 ? 'Priority Master,' : ''}
         ${res?.data?.duedate?.length > 0 ? 'DueDate Master,' : ''}
         ${res?.data?.typegroup?.length > 0 ? 'Type Group Master,' : ''}
         ${res?.data?.raiseticket?.length > 0 ? 'Raise Ticket Master,' : ''}`);

      if (res?.data?.count > 0) {
        handleClickOpenCheck();
      } else {
        handleClickOpen();
      }
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // Alert delete popup
  let projectid = deleteproject._id;
  const delProject = async () => {
    setPageName(!pageName);
    try {
      await axios.delete(`${SERVICE.TYPETICKETMASTER_SINGLE}/${projectid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await fetchProjMaster();
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

  const delProjectcheckbox = async () => {
    setPageName(!pageName);
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.TYPETICKETMASTER_SINGLE}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });
      // Wait for all delete requests to complete
      await Promise.all(deletePromises);
      setIsHandleChange(false);
      await fetchProjMaster();
      handleCloseModcheckbox();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);
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
      valueCat.forEach((data, index) => {
        axios.post(SERVICE.TYPETICKETMASTER_CREATE, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          typename: String(projectmaster.typename),
          department: String(data),
          action: String(projectmaster.action),
          naturetype: String(projectmaster.naturetype),
          addedby: [
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date(serverTime)),
            },
          ],
        });
      });
      await fetchProjMaster();
      setProjectmaster({ ...projectmaster, typename: '' });
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
  const handleSubmit = (e) => {
    e.preventDefault();
    // const isNameMatch = projmaster?.some(item => item.name?.toLowerCase() === (projectmaster.name)?.toLowerCase());
    let departments = selectedOptionsDpt.map((item) => item.value);
    const isNameMatch = projmaster.some(
      (item) =>
        item.typename.toLowerCase() === String(projectmaster.typename).toLowerCase() &&
        // item.department === String(projectmaster.department) &&
        departments.includes(item.department) &&
        item.action === String(projectmaster.action) &&
        item.naturetype === String(projectmaster.naturetype)
    );
    if (projectmaster.typename === '') {
      setPopupContentMalert('Please Enter Type Name');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (valueCat?.length == 0) {
      setPopupContentMalert('Please Select Department');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (projectmaster.action === '' || projectmaster.action === 'Please Select Action') {
      setPopupContentMalert('Please Select  Action');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (projectmaster.naturetype === '' || projectmaster.naturetype === 'Please Select Nature') {
      setPopupContentMalert('Please Select  Nature');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert('Already Added!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else {
      sendRequest();
    }
  };

  const handleclear = (e) => {
    e.preventDefault();
    setValueCat([]);
    setSelectedOptionsDpt([]);
    setProjectmaster({ typename: '', department: 'Please Select Department', action: 'Please Select Action', naturetype: 'Please Select Nature' });
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
    setProjedit({
      typename: '',
      department: 'Please Select Department',
      action: 'Please Select Action',
      naturetype: 'Please Select Nature',
    });
  };

  const [ovProj, setOvProj] = useState('');
  const [getOverAllCount, setGetOverallCount] = useState('');
  const [ovProjCount, setOvProjCount] = useState('');
  const [ovProjDelete, setOvProjDelete] = useState('');
  const [getOverAllCountDelete, setGetOverallCountDelete] = useState('');
  const [ovProjCountDelete, setOvProjCountDelete] = useState('');

  //get single row to edit....
  const getCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.TYPETICKETMASTER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setProjedit(res?.data?.sticketmastertype);
      setOvProj(res?.data?.sticketmastertype?.typename);
      getOverallEditSection(res?.data?.sticketmastertype?.typename);
      handleClickOpenEdit();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //overall edit section for all pages
  const getOverallEditSection = async (e) => {
    try {
      let res = await axios.post(SERVICE.OVERALL_TYPEMASTER_TICKET, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        oldname: e,
      });
      setOvProjCount(res?.data?.count);
      setGetOverallCount(`The ${e} is linked in 
         ${res?.data?.reason?.length > 0 ? 'Reason Master,' : ''}
         ${res?.data?.resolver?.length > 0 ? 'Resolver Reason Master,' : ''}
         ${res?.data?.selfcheck?.length > 0 ? 'Self CheckPoint Master,' : ''}
         ${res?.data?.check?.length > 0 ? 'CheckPoint Master Master,' : ''}
         ${res?.data?.teamgroup?.length > 0 ? 'TeamGrouping Master,' : ''}
         ${res?.data?.priority?.length > 0 ? 'Priority Master,' : ''}
         ${res?.data?.duedate?.length > 0 ? 'DueDate Master,' : ''}
         ${res?.data?.raiseticket?.length > 0 ? 'Raise Ticket Master,' : ''}
         ${res?.data?.typegroup?.length > 0 ? 'Type Group Master,' : ''}
          whether you want to do changes ..??`);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //overall edit section for all pages
  const getOverallEditSectionUpdate = async () => {
    try {
      let res = await axios.post(SERVICE.OVERALL_TYPEMASTER_TICKET, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        oldname: ovProj,
      });
      sendEditRequestOverall(res?.data?.reason, res?.data?.resolver, res?.data?.selfcheck, res?.data?.teamgroup, res?.data?.priority, res?.data?.duedate, res?.data?.check, res?.data?.raiseticket, res?.data?.typegroup);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const sendEditRequestOverall = async (reason, resolver, selfcheck, teamgroup, priority, duedate, check, raiseticket, typegroup) => {
    try {
      if (reason?.length > 0) {
        let answ = reason.map((d, i) => {
          let res = axios.put(`${SERVICE.REASONMASTER_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            typereason: projEdit.typename,
          });
        });
      }
      if (resolver.length > 0) {
        let answ = resolver.map((d, i) => {
          let res = axios.put(`${SERVICE.RESOLVERREASONMASTER_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            typereason: projEdit.typename,
          });
        });
      }
      if (selfcheck.length > 0) {
        let answ = selfcheck.map((d, i) => {
          let res = axios.put(`${SERVICE.SELFCHECKPOINTTICKET_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            type: projEdit.typename,
          });
        });
      }
      if (check.length > 0) {
        let answ = check.map((d, i) => {
          let res = axios.put(`${SERVICE.CHECKPOINTTICKET_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            type: projEdit.typename,
          });
        });
      }
      if (teamgroup.length > 0) {
        let answ = teamgroup.map((d, i) => {
          const type = d?.typefrom?.filter((data) => data !== ovProj);
          let res = axios.put(`${SERVICE.TEAMGROUPING_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            typefrom: [...type, projEdit.typename],
          });
        });
      }
      if (priority.length > 0) {
        let answ = priority.map((d, i) => {
          let res = axios.put(`${SERVICE.PRIORITYMASTER_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            type: projEdit.typename,
          });
        });
      }
      if (duedate.length > 0) {
        let answ = duedate.map((d, i) => {
          let res = axios.put(`${SERVICE.DUEDATE_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            type: projEdit.typename,
          });
        });
      }
      if (raiseticket.length > 0) {
        let answ = raiseticket.map((d, i) => {
          let res = axios.put(`${SERVICE.RAISETICKET_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            type: projEdit.typename,
          });
        });
      }
      if (typegroup.length > 0) {
        let answ = typegroup.map((d, i) => {
          let res = axios.put(`${SERVICE.TYPEMASTER_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            nametype: projEdit.typename,
          });
        });
      }
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // get single row to view....
  const getviewCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.TYPETICKETMASTER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setProjedit(res?.data?.sticketmastertype);
      handleClickOpenview();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.TYPETICKETMASTER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setProjedit(res?.data?.sticketmastertype);
      handleClickOpeninfo();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //Project updateby edit page...
  let updateby = projEdit?.updatedby;
  let addedby = projEdit.addedby;
  let projectsid = projEdit._id;

  //editing the single data...
  const sendEditRequest = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.put(`${SERVICE.TYPETICKETMASTER_SINGLE}/${projectsid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        typename: String(projEdit.typename),
        department: String(projEdit.department),
        action: String(projEdit.action),
        naturetype: String(projEdit.naturetype),
        updatedby: [
          ...updateby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date(serverTime)),
          },
        ],
      });
      // setProjedit(res.data);
      await getOverallEditSectionUpdate();
      fetchProjMaster();
      handleCloseModEdit();
      setPopupContent('Updated Successfully');
      setPopupSeverity('success');
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const editSubmit = async (e) => {
    e.preventDefault();
    let resdata = await fetchProjMasterAll();
    const isNameMatch = resdata.some((item) => item.typename.toLowerCase() === projEdit.typename.toLowerCase() && item.department == projEdit.department && item.action === projEdit.action && item.naturetype === projEdit.naturetype);
    if (projEdit.typename === '') {
      setPopupContentMalert('Please Enter Type Name');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (projEdit.department === '' || projEdit.department === 'Please Select Department') {
      setPopupContentMalert('Please Select  Department');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (projEdit.action === '' || projEdit.action === 'Please Select Action') {
      setPopupContentMalert('Please Select  Action');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (projEdit.naturetype === '' || projEdit.naturetype === 'Please Select Nature') {
      setPopupContentMalert('Please Select  Nature');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert('Already Added!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (projEdit.typename != ovProj && ovProjCount > 0) {
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

  //get all project.
  const fetchProjMaster = async () => {
    setPageName(!pageName);
    try {
      let res_project = await axios.get(SERVICE.TYPETICKETMASTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setProjectCheck(true);
      setProjmaster(res_project?.data?.ticketmastertype.map((item, index) => ({ ...item, serialNumber: index + 1 })));
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //get all project.
  const fetchProjMasterAll = async () => {
    setPageName(!pageName);
    try {
      let res_project = await axios.get(SERVICE.TYPETICKETMASTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      return res_project?.data?.ticketmastertype.filter((item) => item._id !== projEdit._id);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Type Master',
    pageStyle: 'print',
  });

  //serial no for listing items
  const addSerialNumber = (datas) => {
    setItems(datas);
  };

  useEffect(() => {
    addSerialNumber(projmaster);
  }, [projmaster]);

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
  const filteredDatas = items?.filter((item) => Object.values(item).some((value) => value.toString().toLowerCase().startsWith(searchQuery.toLowerCase())));

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

  useEffect(() => {
    fetchProjMaster();
  }, []);

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener('beforeunload', beforeUnloadHandler);
    return () => {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
    };
  }, []);

  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
    <div>
      <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
    </div>
  );

  const customValueRendererCat = (valueCat, _categoryname) => {
    return valueCat.length ? valueCat.map(({ label }) => label).join(', ') : 'Please Select Department';
  };

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
      headerName: 'SNo',
      flex: 0,
      width: 100,
      hide: !columnVisibility.serialNumber,
      headerClassName: 'bold-header',
    },
    { field: 'typename', headerName: 'Type Name', flex: 0, width: 250, hide: !columnVisibility.typename, headerClassName: 'bold-header' },
    { field: 'department', headerName: 'Department', flex: 0, width: 250, hide: !columnVisibility.department, headerClassName: 'bold-header' },
    { field: 'action', headerName: 'Action', flex: 0, width: 250, hide: !columnVisibility.action, headerClassName: 'bold-header' },
    { field: 'naturetype', headerName: 'Nature Type', flex: 0, width: 250, hide: !columnVisibility.naturetype, headerClassName: 'bold-header' },

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
          {isUserRoleCompare?.includes('etickettypemaster') && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.data.id);
              }}
            >
              <EditOutlinedIcon sx={buttonStyles.buttonedit} />
            </Button>
          )}

          {isUserRoleCompare?.includes('dtickettypemaster') && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.data.id);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
            </Button>
          )}
          {isUserRoleCompare?.includes('vtickettypemaster') && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.data.id);
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
            </Button>
          )}
          {isUserRoleCompare?.includes('itickettypemaster') && (
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
      typename: item.typename,
      department: item.department,
      action: item.action,
      naturetype: item.naturetype,
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

  const fetchDepartments = async () => {
    try {
      let dep = await axios.get(SERVICE.DEPARTMENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const deptall = [
        ...dep?.data?.departmentdetails?.map((d) => ({
          ...d,
          label: d.deptname,
          value: d.deptname,
        })),
      ];
      setDeparttment(deptall);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <Box>
      <Headtitle title={'TYPE TICKET MASTER'} />
      <PageHeading title="Type Master" modulename="Tickets" submodulename="Master" mainpagename="Type  Master" subpagename="" subsubpagename="" />
      {/* ****** Header Content ****** */}
      {isUserRoleCompare?.includes('atickettypemaster') && (
        <>
          <Box sx={userStyle.selectcontainer}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>Add Type Master</Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Type Name <b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Name"
                      value={projectmaster.typename}
                      onChange={(e) => {
                        setProjectmaster({ ...projectmaster, typename: e.target.value });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl size="small" fullWidth>
                    <Typography>
                      Department <b style={{ color: 'red' }}>*</b>{' '}
                    </Typography>
                    {/* <Selects
                                        options={department}
                                        styles={colourStyles}
                                        value={{ label: projectmaster.department, value: projectmaster.department }}
                                        onChange={(e) => {
                                            setProjectmaster({ ...projectmaster, department: e.value });
                                        }}

                                    /> */}
                    <MultiSelect
                      options={department}
                      value={selectedOptionsDpt}
                      onChange={(e) => {
                        handleCategoryChange(e);
                      }}
                      valueRenderer={customValueRendererCat}
                      labelledBy="Please Select Department"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Action<b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <Selects
                      options={actionsdrop}
                      styles={colourStyles}
                      value={{ label: projectmaster.action, value: projectmaster.action }}
                      onChange={(e) => {
                        setProjectmaster({
                          ...projectmaster,
                          action: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Nature Type<b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <Selects
                      options={naturedrop}
                      styles={colourStyles}
                      value={{ label: projectmaster.naturetype, value: projectmaster.naturetype }}
                      onChange={(e) => {
                        setProjectmaster({
                          ...projectmaster,
                          naturetype: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <br />
              <br />

              <Grid container>
                <Grid item md={3} xs={12} sm={6}>
                  <LoadingButton variant="contained" sx={buttonStyles.buttonsubmit} onClick={handleSubmit} loading={isBtn}>
                    Submit
                  </LoadingButton>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <Button sx={buttonStyles.btncancel} onClick={handleclear}>
                    Clear
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
        </>
      )}
      <Box>
        {/* Edit DIALOG */}
        <Dialog
          open={isEditOpen}
          onClose={handleCloseModEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="md"
          fullWidth={true}
          sx={{
            overflow: 'visible',
            '& .MuiPaper-root': {
              overflow: 'visible',
            },
          }}
        >
          <Box sx={{ padding: '20px 50px' }}>
            <>
              <Grid container spacing={2}>
                <Typography sx={userStyle.HeaderText}>Edit Type Master</Typography>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Type Name <b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Name"
                      value={projEdit.typename}
                      onChange={(e) => {
                        setProjedit({ ...projEdit, typename: e.target.value });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl size="small" fullWidth>
                    <Typography>
                      Department <b style={{ color: 'red' }}>*</b>{' '}
                    </Typography>
                    <Selects
                      options={department}
                      styles={colourStyles}
                      value={{ label: projEdit.department, value: projEdit.department }}
                      onChange={(e) => {
                        setProjedit({ ...projEdit, department: e.value });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Action<b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <Selects
                      options={actionsdrop}
                      value={{ label: projEdit.action, value: projEdit.action }}
                      onChange={(e) => {
                        setProjedit({
                          ...projEdit,
                          action: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Nature Type<b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <Selects
                      options={naturedrop}
                      value={{ label: projEdit.naturetype, value: projEdit.naturetype }}
                      onChange={(e) => {
                        setProjedit({
                          ...projEdit,
                          naturetype: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <br /> <br />
              <Grid container spacing={2}>
                <Grid item md={6} xs={12} sm={12}>
                  <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={editSubmit}>
                    {' '}
                    Update
                  </Button>
                </Grid>
                <br />
                <Grid item md={6} xs={12} sm={12}>
                  <Button sx={buttonStyles.btncancel} onClick={handleCloseModEdit}>
                    {' '}
                    Cancel{' '}
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
        </Dialog>
      </Box>
      <br />

      {isUserRoleCompare?.includes('ltickettypemaster') && (
        <>
          {!projectCheck ? (
            <Box sx={userStyle.container}>
              <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '350px' }}>
                <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                {/* <FacebookCircularProgress /> */}
              </Box>
            </Box>
          ) : (
            <>
              <Box sx={userStyle.container}>
                {/* ******************************************************EXPORT Buttons****************************************************** */}
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}> Type Master List</Typography>
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
                        <MenuItem value={projmaster?.length}>All</MenuItem>
                      </Select>
                    </Box>
                  </Grid>
                  <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Box>
                      {isUserRoleCompare?.includes('exceltickettypemaster') && (
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
                      {isUserRoleCompare?.includes('csvtickettypemaster') && (
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
                      {isUserRoleCompare?.includes('printtickettypemaster') && (
                        <>
                          <Button sx={userStyle.buttongrp} onClick={handleprint}>
                            &ensp;
                            <FaPrint />
                            &ensp;Print&ensp;
                          </Button>
                        </>
                      )}
                      {isUserRoleCompare?.includes('pdftickettypemaster') && (
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
                      {isUserRoleCompare?.includes('imagetickettypemaster') && (
                        <>
                          <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                            {' '}
                            <ImageIcon sx={{ fontSize: '15px' }} /> &ensp;Image&ensp;{' '}
                          </Button>
                        </>
                      )}
                    </Box>
                  </Grid>
                  <Grid item md={2} xs={6} sm={6}>
                    <AggregatedSearchBar
                      columnDataTable={columnDataTable}
                      setItems={setItems}
                      addSerialNumber={addSerialNumber}
                      setPage={setPage}
                      maindatas={projmaster}
                      setSearchedString={setSearchedString}
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                      paginated={false}
                      totalDatas={projmaster}
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
                {isUserRoleCompare?.includes('bdtickettypemaster') && (
                  <Button variant="contained" sx={buttonStyles.buttonbulkdelete} onClick={handleClickOpenalert}>
                    Bulk Delete
                  </Button>
                )}
                <br />
                <Box
                  style={{
                    width: '100%',
                    overflowY: 'hidden', // Hide the y-axis scrollbar
                  }}
                >
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
                      itemsList={projmaster}
                    />
                  </>
                </Box>
              </Box>
            </>
          )}
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

      {/* view model */}
      <Dialog open={openview} onClose={handleClickOpenview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="sm" fullWidth={true}>
        <Box sx={{ padding: '20px 30px' }}>
          <>
            <Typography sx={userStyle.HeaderText}> View Type Master</Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Type Name</Typography>
                  <Typography>{projEdit.typename}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Department</Typography>
                  <Typography>{projEdit.department}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Action</Typography>
                  <Typography>{projEdit.action}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Nature Type</Typography>
                  <Typography>{projEdit.naturetype}</Typography>
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

      {/* ALERT DIALOG */}
      <Box>
        <Dialog open={isErrorOpenpop} onClose={handleCloseerrpop} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
            <Typography variant="h6">{showAlertpop}</Typography>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              style={{ padding: '7px 13px', color: 'white', background: 'rgb(25, 118, 210)' }}
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

      <Box>
        <Dialog open={isDeleteOpencheckbox} onClose={handleCloseModcheckbox} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: '80px', color: 'orange' }} />
            {selectedRowsCount > 0 ? (
              <Typography variant="h5" sx={{ color: 'red', textAlign: 'center' }}>
                Some of the Data's are Linked in other pages. Do You want to Delete the Remaining.?
              </Typography>
            ) : (
              <Typography variant="h5" sx={{ color: 'red', textAlign: 'center' }}>
                This Data is Linked in Some pages
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            {selectedRowsCount > 0 ? (
              <>
                <Button onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>
                  Cancel
                </Button>
                <Button variant="contained" color="error" onClick={(e) => delProjectcheckbox(e)}>
                  {' '}
                  OK{' '}
                </Button>
              </>
            ) : (
              <Button variant="contained" color="error" onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>
                Ok
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </Box>

      <Box>
        {/* ALERT DIALOG */}
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
      </Box>
      {/* Check delete Modal */}
      <Box>
        <>
          <Box>
            {/* ALERT DIALOG */}
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
                  {getOverAllCountDelete}
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseCheck} autoFocus variant="contained" color="error">
                  {' '}
                  OK{' '}
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </>
      </Box>

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
        itemsTwo={projmaster ?? []}
        filename={'Type Master'}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup openInfo={openInfo} handleCloseinfo={handleCloseinfo} heading="Type Master Info" addedby={addedby} updateby={updateby} />
      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation open={isDeleteOpen} onClose={handleCloseMod} onConfirm={delProject} title="Are you sure?" confirmButtonText="Yes" cancelButtonText="Cancel" />

      {/* EXTERNAL COMPONENTS -------------- END */}
      <br />
    </Box>
  );
}

export default Typemaster;
