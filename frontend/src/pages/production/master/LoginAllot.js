import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import MenuIcon from '@mui/icons-material/Menu';
import { Box, Button, Dialog, DialogActions, DialogContent, FormControl, Grid, IconButton, List, ListItem, ListItemText, MenuItem, OutlinedInput, Popover, Select, TextField, Typography, InputAdornment, Tooltip, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import Switch from '@mui/material/Switch';
import axios from '../../../axiosInstance';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import 'jspdf-autotable';
import moment from 'moment-timezone';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { FaEdit, FaFileCsv, FaFileExcel, FaFilePdf, FaPrint, FaSearch } from 'react-icons/fa';
import { ThreeDots } from 'react-loader-spinner';
import { MultiSelect } from 'react-multi-select-component';
import Selects from 'react-select';
import { useReactToPrint } from 'react-to-print';
import AggregatedSearchBar from '../../../components/AggregatedSearchBar';
import AggridTable from '../../../components/AggridTable';
import { handleApiError } from '../../../components/Errorhandling';
import AlertDialog from '../../../components/Alert.js';
import ExportData from '../../../components/ExportData';
import MessageAlert from '../../../components/MessageAlert.js';
import Headtitle from '../../../components/Headtitle';
import PageHeading from '../../../components/PageHeading';
import { AuthContext, UserRoleAccessContext } from '../../../context/Appcontext';
import { userStyle } from '../../../pageStyle';
import { SERVICE } from '../../../services/Baseservice';
import LoginAllotedList from '../LoginNotAllot';
import domtoimage from 'dom-to-image';
import { MdClose } from 'react-icons/md';
import { IoMdOptions } from 'react-icons/io';
import AggridTableForPaginationTable from '../../../components/AggridTableForPaginationTable.js';

function LoginAllot() {
  const [advancedFilter, setAdvancedFilter] = useState(null);
  const [additionalFilters, setAdditionalFilters] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const conditions = ['Contains', 'Does Not Contain', 'Equals', 'Does Not Equal', 'Begins With', 'Ends With', 'Blank', 'Not Blank']; // AgGrid-like conditions
  const [selectedColumn, setSelectedColumn] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('Contains');
  const [logicOperator, setLogicOperator] = useState('AND');
  const [filterValue, setFilterValue] = useState('');
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);

  const [totalProjects, setTotalProjects] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [loginAllotFilter, setLoginAllotFilter] = useState([]);
  const [loader, setLoader] = useState(false);
  const [allottedListLoad, setAllottedListLoad] = useState('');

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  const [searchedString, setSearchedString] = useState('');
  const gridRefTable = useRef(null);
  const [isHandleChange, setIsHandleChange] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };
  const [fileFormat, setFormat] = useState('');

  let exportColumnNames = ['User ID', 'Password', 'Project Vendor'];
  let exportRowValues = ['userid', 'password', 'projectvendor'];

  let today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var yyyy = today.getFullYear();
  let formattedDate = yyyy + '-' + mm + '-' + dd;

  const [filteredBranchOptions, setFilteredBranchOptions] = useState([]);
  const [vendorMaster, setVendorMaster] = useState([]);
  const [vendorMasterValue, setVendorMasterValue] = useState([]);
  const [filteredUnitOptions, setFilteredUnitOptions] = useState([]);
  const [filteredTeamOptions, setFilteredTeamOptions] = useState([]);
  const [employeenames, setEmployeenames] = useState([]);
  const [loginNotAllot, setLoginNotAllot] = useState({
    company: 'Please Select Company',
    userId: '',
    branch: 'Please Select Branch',
    unit: 'Please Select Unit',
    team: 'Please Select Team',
    empname: 'Please Select Person',
    time: 'HH:MM',
    date: formattedDate,
    empcode: '',
  });
  const [excelData, setExcelData] = useState([]);
  const [loginNotAllotEdit, setLoginNotAllotEdit] = useState({ name: '' });

  const [searchQuery, setSearchQuery] = useState('');
  const { isUserRoleCompare, isUserRoleAccess, isAssignBranch, allTeam, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);

  const accessbranch = isUserRoleAccess?.role?.includes('Manager')
    ? isAssignBranch?.map((data) => ({
        branch: data.branch,
        company: data.company,
        unit: data.unit,
      }))
    : isAssignBranch
        ?.filter((data) => {
          let fetfinalurl = [];

          if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.mainpagenameurl?.length !== 0 && data?.subpagenameurl?.length !== 0 && data?.subsubpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)) {
            fetfinalurl = data.subsubpagenameurl;
          } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.mainpagenameurl?.length !== 0 && data?.subpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)) {
            fetfinalurl = data.subpagenameurl;
          } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.mainpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)) {
            fetfinalurl = data.mainpagenameurl;
          } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)) {
            fetfinalurl = data.submodulenameurl;
          } else if (data?.modulenameurl?.length !== 0) {
            fetfinalurl = data.modulenameurl;
          } else {
            fetfinalurl = [];
          }

          const remove = [window.location.pathname?.substring(1), window.location.pathname];
          return fetfinalurl?.some((item) => remove?.includes(item));
        })
        ?.map((data) => ({
          branch: data.branch,
          company: data.company,
          unit: data.unit,
        }));

  const { auth } = useContext(AuthContext);
  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState('');
  const [copiedData, setCopiedData] = useState('');
  const [openviewalert, setOpenviewalert] = useState(false);

  // view model
  const handleClickOpenviewalert = () => {
    setOpenviewalert(true);
  };

  const handleCloseviewalert = () => {
    setOpenviewalert(false);
  };

  const gridRefTableImg = useRef(null);
  // image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage
        .toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, 'Login Not Allot List.png');
        })
        .catch((error) => {
          console.error('dom-to-image error: ', error);
        });
    }
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
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Error Popup model
  const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
  const [showAlertpop, setShowAlertpop] = useState();
  const handleClickOpenerrpop = () => {
    setIsErrorOpenpop(true);
  };
  const handleCloseerrpop = () => {
    setIsErrorOpenpop(false);
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

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    userid: true,
    projectvendor: true,
    password: true,
    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ''; // This is required for Chrome support
  };

  const ProjectVendors = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.get(SERVICE.VENDORMASTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setVendorMaster(
        res?.data?.vendormaster.map((data) => ({
          ...data,
          label: data.projectname + '-' + data.name,
          value: data.projectname + '-' + data.name,
        }))
      );
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const filterBranch = async (e) => {
    setPageName(!pageName);
    try {
      let branchall;
      if (e === 'ALL') {
        branchall = accessbranch
          .map((u, index) => ({
            ...u,
            label: u.branch,
            value: u.branch,
            index: index,
          }))
          .filter((item, index, arr) => index === arr.findIndex((el) => el.branch === item.branch));
        setFilteredBranchOptions([...(isUserRoleAccess?.role?.includes('Manager') ? [{ label: 'ALL', value: 'ALL' }] : []), ...branchall]);
      } else {
        branchall = accessbranch
          ?.filter((u) => u.company === e)
          .map((u, index) => ({
            ...u,
            label: u.branch,
            value: u.branch,
            index: index,
          }))
          .filter((item, index, arr) => index === arr.findIndex((el) => el.branch === item.branch));
        setFilteredBranchOptions([...(isUserRoleAccess?.role?.includes('Manager') ? [{ label: 'ALL', value: 'ALL' }] : []), ...branchall]);
      }
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const filterUnit = async (company, e) => {
    setPageName(!pageName);
    try {
      let unitall;
      if (company === 'ALL' && e === 'ALL') {
        unitall = accessbranch.map((u) => ({
          ...u,
          label: u.unit,
          value: u.unit,
        }));
        setFilteredUnitOptions([...(isUserRoleAccess?.role?.includes('Manager') ? [{ label: 'ALL', value: 'ALL' }] : []), ...unitall]);
      } else if (company !== 'ALL' && e === 'ALL') {
        unitall = accessbranch.map((u) => ({
          ...u,
          label: u.unit,
          value: u.unit,
        }));
        setFilteredUnitOptions([...(isUserRoleAccess?.role?.includes('Manager') ? [{ label: 'ALL', value: 'ALL' }] : []), ...unitall]);
      } else if (company === 'ALL' && e !== 'ALL') {
        unitall = accessbranch
          ?.filter((u) => u.branch === e)
          .map((u) => ({
            ...u,
            label: u.unit,
            value: u.unit,
          }));
        setFilteredUnitOptions([...(isUserRoleAccess?.role?.includes('Manager') ? [{ label: 'ALL', value: 'ALL' }] : []), ...unitall]);
      } else if (company !== 'ALL' && e !== 'ALL') {
        unitall = accessbranch
          ?.filter((u) => u.branch === e)
          .map((u) => ({
            ...u,
            label: u.unit,
            value: u.unit,
          }));
        setFilteredUnitOptions([...(isUserRoleAccess?.role?.includes('Manager') ? [{ label: 'ALL', value: 'ALL' }] : []), ...unitall]);
      }
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const filterTeam = async (company, branch, e) => {
    setPageName(!pageName);
    try {
      let teamall;
      if (company === 'ALL' && branch === 'ALL' && e === 'ALL') {
        teamall = allTeam.map((u) => ({
          ...u,
          label: u.teamname,
          value: u.teamname,
        }));
        setFilteredTeamOptions([...(isUserRoleAccess?.role?.includes('Manager') ? [{ label: 'ALL', value: 'ALL' }] : []), ...teamall]);
      } else if (company !== 'ALL' && branch === 'ALL' && e === 'ALL') {
        teamall = allTeam
          ?.filter((u) => u.company === company)
          .map((u) => ({
            ...u,
            label: u.teamname,
            value: u.teamname,
          }));
        setFilteredTeamOptions([...(isUserRoleAccess?.role?.includes('Manager') ? [{ label: 'ALL', value: 'ALL' }] : []), ...teamall]);
      } else if (company !== 'ALL' && branch === 'ALL' && e !== 'ALL') {
        teamall = allTeam
          ?.filter((u) => u.company === company && u.unit === e)
          .map((u) => ({
            ...u,
            label: u.teamname,
            value: u.teamname,
          }));
        setFilteredTeamOptions([...(isUserRoleAccess?.role?.includes('Manager') ? [{ label: 'ALL', value: 'ALL' }] : []), ...teamall]);
      } else if (company !== 'ALL' && branch !== 'ALL' && e === 'ALL') {
        teamall = allTeam
          ?.filter((u) => u.company === company && u.branch === branch)
          .map((u) => ({
            ...u,
            label: u.teamname,
            value: u.teamname,
          }));
        setFilteredTeamOptions([...(isUserRoleAccess?.role?.includes('Manager') ? [{ label: 'ALL', value: 'ALL' }] : []), ...teamall]);
      } else if (company === 'ALL' && branch !== 'ALL' && e !== 'ALL') {
        teamall = allTeam
          ?.filter((u) => u.branch === branch && u.unit === e)
          .map((u) => ({
            ...u,
            label: u.teamname,
            value: u.teamname,
          }));
        setFilteredTeamOptions([...(isUserRoleAccess?.role?.includes('Manager') ? [{ label: 'ALL', value: 'ALL' }] : []), ...teamall]);
      } else if (company === 'ALL' && branch !== 'ALL' && e === 'ALL') {
        teamall = allTeam
          ?.filter((u) => u.branch === branch)
          .map((u) => ({
            ...u,
            label: u.teamname,
            value: u.teamname,
          }));
        setFilteredTeamOptions([...(isUserRoleAccess?.role?.includes('Manager') ? [{ label: 'ALL', value: 'ALL' }] : []), ...teamall]);
      } else if (company === 'ALL' && branch === 'ALL' && e !== 'ALL') {
        teamall = allTeam
          ?.filter((u) => u.unit === e)
          .map((u) => ({
            ...u,
            label: u.teamname,
            value: u.teamname,
          }));
        setFilteredTeamOptions([...(isUserRoleAccess?.role?.includes('Manager') ? [{ label: 'ALL', value: 'ALL' }] : []), ...teamall]);
      } else {
        teamall = allTeam
          ?.filter((u) => u.company === company && u.branch === branch && u.unit === e)
          .map((u) => ({
            ...u,
            label: u.teamname,
            value: u.teamname,
          }));
        setFilteredTeamOptions([...(isUserRoleAccess?.role?.includes('Manager') ? [{ label: 'ALL', value: 'ALL' }] : []), ...teamall]);
      }
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  //get all Employeename.
  const fetchAllEmployee = async (e) => {
    setPageName(!pageName);
    try {
      let res_module = await axios.post(SERVICE.USEREMP_TEAMGROUP, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        branch: loginNotAllot.branch,
        unit: loginNotAllot.unit,
        company: loginNotAllot.company,
        date: loginNotAllot.date,
        team: e.value,
      });
      setEmployeenames(
        res_module.data.userteamgroup.map((data) => ({
          // ...data,
          label: data.companyname,
          value: data.companyname,
          empcode: data.empcode,
          company: data.company,
          branch: data.branch,
          unit: data.unit,
          team: data.team,
        }))
      );
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String('Login Allot'),
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

  useEffect(() => {
    ProjectVendors();
    getapi();
  }, []);

  const [forFilter, setForFilter] = useState(false);

  useEffect(() => {
    if (forFilter) {
      sendRequest();
    }
  }, [page, pageSize, searchQuery]);

  const [loginAllotFilterOverall, setLoginAllotFilterOverall] = useState([]);

  const [anchorElSearch, setAnchorElSearch] = React.useState(null);
  const handleClickSearch = (event) => {
    setAnchorElSearch(event.currentTarget);
    localStorage.removeItem('filterModel');
  };
  const handleCloseSearch = () => {
    setAnchorElSearch(null);
    setSearchQuery('');
  };

  const openSearch = Boolean(anchorElSearch);
  const idSearch = openSearch ? 'simple-popover' : undefined;

  const handleAddFilter = () => {
    if ((selectedColumn && filterValue) || ['Blank', 'Not Blank'].includes(selectedCondition)) {
      setAdditionalFilters([...additionalFilters, { column: selectedColumn, condition: selectedCondition, value: filterValue }]);
      setSelectedColumn('');
      setSelectedCondition('Contains');
      setFilterValue('');
    }
  };

  const getSearchDisplay = () => {
    if (advancedFilter && advancedFilter.length > 0) {
      return advancedFilter
        .map((filter, index) => {
          let showname = columnDataTable.find((col) => col.field === filter.column)?.headerName;
          return `${showname} ${filter.condition} "${filter.value}"`;
        })
        .join(' ' + (advancedFilter.length > 1 ? advancedFilter[1].condition : '') + ' ');
    }
    return searchQuery;
  };

  const sendRequest = async () => {
    setPageName(!pageName);
    console.time('fetchNonProductionUnitRate');
    const queryParams = {
      page: Number(page),
      pageSize: Number(pageSize),
    };

    const allFilters = [...additionalFilters, { column: selectedColumn, condition: selectedCondition, value: filterValue }];

    if (allFilters.length > 0 && selectedColumn !== '') {
      queryParams.allFilters = allFilters;
      queryParams.logicOperator = logicOperator;
    } else if (searchQuery) {
      queryParams.searchQuery = searchQuery;
    }

    try {
      let grpcreate = await axios.post(SERVICE.ALL_CLIENTUSERIDDATA_FOR_UNALLOTED_PAGINATION, queryParams, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const answer = grpcreate.data.clientuserids?.map((item, index) => ({
        ...item,
        serialNumber: (page - 1) * pageSize + index + 1,
      }));

      setLoginAllotFilter(answer);
      setLoginAllotFilterOverall(answer);

      setTotalProjects(grpcreate?.data?.clientuserids?.length > 0 ? grpcreate?.data?.totalProjects : 0);
      setTotalPages(grpcreate?.data?.clientuserids?.length > 0 ? grpcreate?.data?.totalPages : 0);
      setPageSize((data) => {
        return grpcreate?.data?.clientuserids?.length > 0 ? data : 10;
      });
      setPage((data) => {
        return grpcreate?.data?.clientuserids?.length > 0 ? data : 1;
      });
      setLoader(false);
      console.timeEnd('fetchNonProductionUnitRate');
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const [loginAllotFilterExports, setLoginAllotFilterExports] = useState([]);

  const sendRequestExports = async () => {
    setPageName(!pageName);
    console.time('fetchNonProductionUnitRateExports');

    try {
      let grpcreate = await axios.get(SERVICE.ALL_CLIENTUSERIDDATA_FOR_UNALLOTED_PAGINATION_EXPORTS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const answer = grpcreate.data.clientuserids?.map((item, index) => ({
        ...item,
        serialNumber: index + 1,
      }));

      setLoginAllotFilterExports(answer);

      console.timeEnd('fetchNonProductionUnitRate');
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const handleResetSearch = async () => {
    setPageName(!pageName);
    // Reset all filters and pagination state
    setAdvancedFilter(null);
    setAdditionalFilters([]);
    setSearchQuery('');
    setIsSearchActive(false);
    setSelectedColumn('');
    setSelectedCondition('Contains');
    setFilterValue('');
    setLogicOperator('AND');
    setFilteredChanges(null);

    const queryParams = {
      page: Number(page),
      pageSize: Number(pageSize),
    };

    const allFilters = [];
    // Only include advanced filters if they exist, otherwise just use regular searchQuery
    if (allFilters.length > 0 && selectedColumn !== '') {
      queryParams.allFilters = allFilters;
      queryParams.logicOperator = logicOperator;
    } else if (searchQuery) {
      queryParams.searchQuery = searchQuery; // Use searchQuery for regular search
    }

    try {
      let grpcreate = await axios.post(SERVICE.ALL_CLIENTUSERIDDATA_FOR_UNALLOTED_PAGINATION, queryParams, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const answer = grpcreate.data.clientuserids?.map((item, index) => ({
        ...item,
        serialNumber: (page - 1) * pageSize + index + 1,
      }));

      setLoginAllotFilter(answer);
      setLoginAllotFilterOverall(answer);

      setTotalProjects(grpcreate?.data.clientuserids?.length > 0 ? grpcreate?.data?.totalProjects : 0);
      setTotalPages(grpcreate?.data.clientuserids?.length > 0 ? grpcreate?.data?.totalPages : 0);
      setPageSize((data) => {
        return grpcreate?.data.clientuserids?.length > 0 ? data : 10;
      });
      setPage((data) => {
        return grpcreate?.data.clientuserids?.length > 0 ? data : 1;
      });
      // setTaskcategorycheck(true);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (vendorMasterValue?.length === 0) {
      setPopupContentMalert('Please Select Project Vendor');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else {
      sendRequest(e);
      sendRequestExports();
    }
  };

  const [searchQueryclear, setSearchQueryclear] = useState('');
  const [clearForAlloted, setClearForAlloted] = useState(false);

  const handleClear = () => {
    setForFilter(false);
    setVendorMasterValue([]);
    setIsProjectvendor([]);
    setLoginAllotFilter([]);
    setLoader(false);
    setSearchQuery('');
    setTotalProjects(0);
    setPage(1);
    setPageSize(10);
    setTotalPages(0);
    setClearForAlloted(true);
    setSearchQueryclear('Clear');
    setPopupContent('Cleared Successfully');
    setPopupSeverity('success');
    handleClickOpenPopup();
  };
  //Edit model...
  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === 'backdropClick') return;
    setIsEditOpen(false);
    setLoginNotAllot({
      company: 'Please Select Company',
      date: formattedDate,
      userId: '',
      branch: 'Please Select Branch',
      unit: 'Please Select Unit',
      team: 'Please Select Team',
      empname: 'Please Select Person',
      time: 'HH:MM',
    });
    setFilteredBranchOptions([]);
    setFilteredUnitOptions([]);
    setFilteredTeamOptions([]);
    setEmployeenames([]);
  };

  //get single row to edit....
  const getCode = async (e, name) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SINGLE_CLIENTUSERID}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setLoginNotAllotEdit(res?.data?.sclientuserid);
      handleClickOpenEdit();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //Project updateby edit page...
  let updateby = loginNotAllotEdit.updatedby;

  let projectsid = loginNotAllotEdit._id;

  //editing the single data...
  const sendEditRequest = async () => {
    setPageName(!pageName);
    try {
      setAllottedListLoad('BeforeChanges');
      let res = await axios.put(`${SERVICE.SINGLE_CLIENTUSERID}/${projectsid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: String(loginNotAllot?.employeecompany),
        branch: String(loginNotAllot?.employeebranch),
        unit: String(loginNotAllot?.employeeunit),
        team: String(loginNotAllot?.employeeteam),
        empname: String(loginNotAllot.empname),
        empcode: String(loginNotAllot.empcode),
        date: String(loginNotAllot.date),
        time: String(moment().format('HH:mm')),
        allotted: 'allotted',
        loginallotlog: [
          {
            company: String(loginNotAllot?.employeecompany),
            branch: String(loginNotAllot?.employeebranch),
            unit: String(loginNotAllot?.employeeunit),
            team: String(loginNotAllot?.employeeteam),
            empname: String(loginNotAllot.empname),

            empcode: String(loginNotAllot.empcode),
            date: String(loginNotAllot.date),
            time: String(moment().format('HH:mm')),
            userid: loginNotAllotEdit.userid, // Fixed the field names
          },
        ],
        updatedby: [
          ...updateby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      setLoginNotAllot({
        company: 'Please Select Company',
        date: formattedDate,
        userId: '',
        branch: 'Please Select Branch',
        unit: 'Please Select Unit',
        team: 'Please Select Team',
        empname: 'Please Select Person',
        time: 'HH:MM',
      });
      await sendRequest();
      await sendRequestExports();
      setAllottedListLoad('Changes');
      setFilteredBranchOptions([]);
      setFilteredUnitOptions([]);
      setFilteredTeamOptions([]);
      setEmployeenames([]);
      handleCloseModEdit();
      setPopupContent('Updated Successfully');
      setPopupSeverity('success');
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const editSubmit = (e) => {
    e.preventDefault();
    if (loginNotAllot.company === 'Please Select Company' || loginNotAllot.company === '') {
      setPopupContentMalert('Please Select Company');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (loginNotAllot.branch === 'Please Select Branch') {
      setPopupContentMalert('Please Select Branch');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (loginNotAllot.unit === 'Please Select Unit' || loginNotAllot.unit === '') {
      setPopupContentMalert('Please Select Unit');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (loginNotAllot.team === 'Please Select Team' || loginNotAllot.team === '') {
      setPopupContentMalert('Please Select Team');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (loginNotAllot.empname === 'Please Select Person' || loginNotAllot.empname === '') {
      setPopupContentMalert('Please Select Person');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (loginNotAllot.date === '' || !loginNotAllot.date) {
      setPopupContentMalert('Please Select Date');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else {
      sendEditRequest();
    }
  };

  // Excel
  const fileName = 'LoginNotAlloted';
  // get particular columns for export excel
  const getexcelDatas = async () => {
    setPageName(!pageName);
    try {
      var data = loginAllotFilter.map((t, i) => ({
        Sno: i + 1,
        'User ID': t.userid,
        Password: t.password,
        'Project Vendor': t.projectvendor,
      }));
      setExcelData(data);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const [isProjectvendor, setIsProjectvendor] = useState([]);
  const [isProjectvendorLoginNotAllot, setIsProjectvendorLoginNotAllot] = useState([]);
  const hsndlechangeProject = (options) => {
    setVendorMasterValue(options);
    setIsProjectvendor(
      options.map((a, index) => {
        return a.value;
      })
    );
  };

  const customValueRendererCate = (valueCate) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(', ') : 'Please Select Project Vendor';
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Login Not Allot List',
    pageStyle: 'print',
  });

  useEffect(() => {
    getexcelDatas();
  }, [loginNotAllotEdit, loginAllotFilter]);

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener('beforeunload', beforeUnloadHandler);
    return () => {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
    };
  }, []);

  const [items, setItems] = useState([]);

  const addSerialNumber = (datas) => {
    setItems(datas);
  };
  useEffect(() => {
    addSerialNumber(loginAllotFilter);
  }, [loginAllotFilter]);

  //table sorting
  const [sorting, setSorting] = useState({ column: '', direction: '' });

  items?.sort((a, b) => {
    if (sorting.direction === 'asc') {
      return a[sorting.column] > b[sorting.column] ? 1 : -1;
    } else if (sorting.direction === 'desc') {
      return a[sorting.column] < b[sorting.column] ? 1 : -1;
    }
    return 0;
  });

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setSelectedRows([]);
    setSelectAllChecked(false);
    setPage(1);
  };

  //datatable....
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Split the search query into individual terms
  const searchTerms = searchQuery.toLowerCase().split(' ');
  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchTerms.every((term) => Object.values(item).join(' ').toLowerCase().includes(term));
  });

  // const filteredData = filteredDatas.slice(
  //   (page - 1) * pageSize,
  //   page * pageSize
  // );

  // const totalPages = Math.ceil(filteredDatas.length / pageSize);

  // const visiblePages = Math.min(totalPages, 3);

  // const firstVisiblePage = Math.max(1, page - 1);
  // const lastVisiblePage = Math.min(
  //   firstVisiblePage + visiblePages - 1,
  //   totalPages
  // );

  // const pageNumbers = [];

  // const indexOfLastItem = page * pageSize;
  // const indexOfFirstItem = indexOfLastItem - pageSize;

  // for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
  //   pageNumbers.push(i);
  // }

  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const columnDataTable = [
    {
      field: 'serialNumber',
      headerName: 'SNo',
      flex: 0,
      width: 100,
      hide: !columnVisibility.serialNumber,
      headerClassName: 'bold-header',
      pinned: 'left',
    },
    {
      field: 'userid',
      headerName: 'User Id',
      flex: 0,
      width: 250,
      hide: !columnVisibility.userid,
      headerClassName: 'bold-header',
      pinned: 'left',
    },
    {
      field: 'password',
      headerName: 'Password',
      flex: 0,
      width: 250,
      hide: !columnVisibility.password,
      headerClassName: 'bold-header',
    },
    {
      field: 'projectvendor',
      headerName: 'Project Vendor',
      flex: 0,
      width: 250,
      hide: !columnVisibility.projectvendor,
      headerClassName: 'bold-header',
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
          {isUserRoleCompare?.includes('vloginallot') && params?.data?.loginallotlog && (
            <Button
              variant="contained"
              sx={{
                minWidth: '15px',
                padding: '6px 5px',
              }}
              onClick={() => {
                window.open(`/updatepages/loginnotallotedlist/${params.data.id}`);
              }}
            >
              <MenuIcon style={{ fontsize: 'small' }} />
            </Button>
          )}
          &ensp;
          {isUserRoleCompare?.includes('eloginallot') && (
            <Button
              style={{
                backgroundColor: 'red',
                minWidth: '15px',
                padding: '6px 5px',
              }}
              onClick={(e) => {
                getCode(params.data.id, params.data.name);
              }}
            >
              <FaEdit style={{ color: 'white', fontSize: '18px' }} />
            </Button>
          )}
        </Grid>
      ),
    },
  ];

  const filteredSelectedColumn = columnDataTable.filter((data) => data.field !== 'checkbox' && data.field !== 'actions' && data.field !== 'serialNumber');

  const rowDataTable = filteredDatas?.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      userid: item.userid,
      password: item.password,
      projectvendor: item.projectvendor,
      loginallotlog: item.loginallotlog?.length > 0,
    };
  });

  // Show All Columns functionality
  const handleShowAllColumns = () => {
    setColumnVisibility(initialColumnVisibility);
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
  return (
    <Box>
      <Headtitle title={'Login Allot'} />
      <PageHeading title="Login Allot" modulename="Production" submodulename="SetUp" mainpagename="Login Allot" subpagename="" subsubpagename="" />
      {/* ****** Header Content ****** */}
      {isUserRoleCompare?.includes('aloginallot') && (
        <>
          <Box sx={userStyle.dialogbox}>
            <>
              <Grid container spacing={2}></Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={1.5} xs={12} sm={6}>
                  <Typography sx={userStyle.importheadtext}>Project Vendor</Typography>
                </Grid>
                <Grid item md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <MultiSelect options={vendorMaster} value={vendorMasterValue} valueRenderer={customValueRendererCate} onChange={hsndlechangeProject} />
                  </FormControl>
                </Grid>
                <Grid item md={2} xs={12} sm={6}>
                  <Button
                    sx={buttonStyles.buttonsubmit}
                    onClick={(e) => {
                      setIsProjectvendorLoginNotAllot(isProjectvendor);
                      handleSubmit(e);
                      setForFilter(true);
                      setClearForAlloted(false);
                    }}
                  >
                    Get Client List
                  </Button>
                </Grid>
                <Grid item md={2} xs={12} sm={6}>
                  <Button sx={buttonStyles.btncancel} onClick={handleClear}>
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
          fullWidth={true}
          maxWidth="lg"
          sx={{
            overflow: 'visible',
            '& .MuiPaper-root': {
              overflow: 'visible',
            },
          }}
        >
          <Box sx={{ padding: '20px' }}>
            {/* <DialogContent sx={{ padding: "20px" }}> */}
            <Typography sx={userStyle.HeaderText}>Login Allot Entry</Typography>
            <Grid container spacing={2}>
              <Grid item md={3} xs={12} sm={12}>
                <Typography>User Id</Typography>
                <FormControl fullWidth size="small">
                  <OutlinedInput id="component-outlined" type="text" placeholder="User Id" value={loginNotAllotEdit.userid} />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <Typography>
                  Date<b style={{ color: 'red' }}>*</b>
                </Typography>
                <FormControl fullWidth size="small">
                  <OutlinedInput
                    id="component-outlined"
                    type="date"
                    placeholder="Date"
                    value={loginNotAllot.date}
                    onChange={(e) => {
                      setLoginNotAllot({
                        ...loginNotAllot,
                        date: e.target.value,
                        company: 'Please Select Company',
                        branch: 'Please Select Branch',
                        unit: 'Please Select Unit',
                        team: 'Please Select Team',
                        empname: 'Please Select Person',
                      });

                      setEmployeenames([]);
                      setFilteredUnitOptions([]);
                      setFilteredTeamOptions([]);
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <Typography>
                  Company<b style={{ color: 'red' }}>*</b>
                </Typography>
                <FormControl fullWidth size="small">
                  <Selects
                    options={[
                      ...(isUserRoleAccess?.role?.includes('Manager') ? [{ label: 'ALL', value: 'ALL' }] : []),
                      ...accessbranch
                        ?.map((data) => ({
                          label: data.company,
                          value: data.company,
                        }))
                        .filter((item, index, self) => {
                          return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                        }),
                    ]}
                    value={{
                      label: loginNotAllot.company,
                      value: loginNotAllot.company,
                    }}
                    onChange={(e) => {
                      setLoginNotAllot({
                        ...loginNotAllot,
                        company: e.value,
                        branch: 'Please Select Branch',
                        unit: 'Please Select Unit',
                        team: 'Please Select Team',
                        empname: 'Please Select Person',
                      });
                      filterBranch(e.value);
                      setEmployeenames([]);
                      setFilteredUnitOptions([]);
                      setFilteredTeamOptions([]);
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <Typography>
                  Branch<b style={{ color: 'red' }}>*</b>
                </Typography>
                <FormControl fullWidth size="small">
                  <Selects
                    options={filteredBranchOptions}
                    value={{
                      label: loginNotAllot.branch,
                      value: loginNotAllot.branch,
                    }}
                    onChange={(e) => {
                      setLoginNotAllot({
                        ...loginNotAllot,
                        branch: e.value,
                        unit: 'Please Select Unit',
                        team: 'Please Select Team',
                        empname: 'Please Select Person',
                      });
                      setEmployeenames([]);
                      filterUnit(loginNotAllot.company, e.value);
                      setFilteredTeamOptions([]);
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <Typography>
                  Unit<b style={{ color: 'red' }}>*</b>
                </Typography>
                <FormControl fullWidth size="small">
                  <Selects
                    options={filteredUnitOptions}
                    value={{
                      label: loginNotAllot.unit,
                      value: loginNotAllot.unit,
                    }}
                    onChange={(e) => {
                      setLoginNotAllot({
                        ...loginNotAllot,
                        unit: e.value,
                        team: 'Please Select Team',
                        empname: 'Please Select Person',
                      });
                      filterTeam(loginNotAllot.company, loginNotAllot.branch, e.value);
                      setEmployeenames([]);
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <Typography>
                  Team<b style={{ color: 'red' }}>*</b>
                </Typography>
                <FormControl fullWidth size="small">
                  <Selects
                    options={filteredTeamOptions}
                    value={{
                      label: loginNotAllot.team,
                      value: loginNotAllot.team,
                    }}
                    onChange={(e) => {
                      setLoginNotAllot({
                        ...loginNotAllot,
                        team: e.value,
                        empname: 'Please Select Person',
                      });
                      fetchAllEmployee(e);
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <Typography>
                  Employee Name<b style={{ color: 'red' }}>*</b>
                </Typography>
                <FormControl fullWidth size="small">
                  <Selects
                    options={employeenames}
                    value={{
                      label: loginNotAllot.empname,
                      value: loginNotAllot.empname,
                    }}
                    onChange={(e) => {
                      setLoginNotAllot({
                        ...loginNotAllot,
                        empname: e.label,
                        empcode: e.empcode,
                        employeecompany: e.company,
                        employeebranch: e.branch,
                        employeeunit: e.unit,
                        employeeteam: e.team,
                      });
                    }}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <br />
            <br />

            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <Button variant="contained" onClick={editSubmit} sx={buttonStyles.buttonsubmit}>
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
          </Box>
        </Dialog>
      </Box>
      <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes('lloginallot') && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>Login Not Allot List</Typography>
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
                    <MenuItem value={totalProjects}>All</MenuItem>
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
                  {isUserRoleCompare?.includes('excelloginallot') && (
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
                  {isUserRoleCompare?.includes('csvloginallot') && (
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
                  {isUserRoleCompare?.includes('printloginallot') && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes('pdfloginallot') && (
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
                  {isUserRoleCompare?.includes('imageloginallot') && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                        <ImageIcon sx={{ fontSize: '15px' }} />
                        &ensp;Image&ensp;
                      </Button>
                    </>
                  )}
                </Box>
              </Grid>
              {/* <Grid item md={2} xs={6} sm={6}>

                <AggregatedSearchBar
                  columnDataTable={columnDataTable}
                  setItems={setItems}
                  addSerialNumber={addSerialNumber}
                  setPage={setPage}
                  maindatas={loginAllotFilter}
                  setSearchedString={setSearchedString}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  paginated={false}
                  totalDatas={loginAllotFilterOverall}
                />
              </Grid> */}

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
                            <IoMdOptions style={{ cursor: 'pointer' }} onClick={handleClickSearch} />
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
            </Grid>
            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
              Show All Columns
            </Button>
            &ensp;
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
              Manage Columns
            </Button>
            <br />
            <br />
            {loader ? (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                </Box>
              </>
            ) : (
              <>
                {/* <AggridTable
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
                  // totalDatas={totalProjects}
                  searchQuery={searchedString}
                  handleShowAllColumns={handleShowAllColumns}
                  setFilteredRowData={setFilteredRowData}
                  filteredRowData={filteredRowData}
                  setFilteredChanges={setFilteredChanges}
                  filteredChanges={filteredChanges}
                  gridRefTableImg={gridRefTableImg}
                  itemsList={loginAllotFilterOverall}
                /> */}
                <AggridTableForPaginationTable
                  rowDataTable={rowDataTable}
                  columnDataTable={columnDataTable}
                  columnVisibility={columnVisibility}
                  page={page}
                  setPage={setPage}
                  pageSize={pageSize}
                  totalPages={totalPages}
                  setColumnVisibility={setColumnVisibility}
                  selectedRows={selectedRows}
                  setSelectedRows={setSelectedRows}
                  gridRefTable={gridRefTable}
                  totalDatas={totalProjects}
                  setFilteredRowData={setFilteredRowData}
                  filteredRowData={filteredRowData}
                  gridRefTableImg={gridRefTableImg}
                  itemsList={loginAllotFilterOverall}
                />
              </>
            )}
          </Box>
          <Popover id={idSearch} open={openSearch} anchorEl={anchorElSearch} onClose={handleCloseSearch} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
            <Box style={{ padding: '10px', maxWidth: '450px' }}>
              <Typography variant="h6">Advance Search</Typography>
              <IconButton
                aria-label="close"
                onClick={handleCloseSearch}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
              <DialogContent sx={{ width: '100%' }}>
                <Box
                  sx={{
                    width: '350px',
                    maxHeight: '400px',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  <Box
                    sx={{
                      maxHeight: '300px',
                      overflowY: 'auto',
                      // paddingRight: '5px'
                    }}
                  >
                    <Grid container spacing={1}>
                      <Grid item md={12} sm={12} xs={12}>
                        <Typography>Columns</Typography>
                        <Select
                          fullWidth
                          size="small"
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 200,
                                width: 'auto',
                              },
                            },
                          }}
                          style={{ minWidth: 150 }}
                          value={selectedColumn}
                          onChange={(e) => setSelectedColumn(e.target.value)}
                          displayEmpty
                        >
                          <MenuItem value="" disabled>
                            Select Column
                          </MenuItem>
                          {filteredSelectedColumn.map((col) => (
                            <MenuItem key={col.field} value={col.field}>
                              {col.headerName}
                            </MenuItem>
                          ))}
                        </Select>
                      </Grid>
                      <Grid item md={12} sm={12} xs={12}>
                        <Typography>Operator</Typography>
                        <Select
                          fullWidth
                          size="small"
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 200,
                                width: 'auto',
                              },
                            },
                          }}
                          style={{ minWidth: 150 }}
                          value={selectedCondition}
                          onChange={(e) => setSelectedCondition(e.target.value)}
                          disabled={!selectedColumn}
                        >
                          {conditions.map((condition) => (
                            <MenuItem key={condition} value={condition}>
                              {condition}
                            </MenuItem>
                          ))}
                        </Select>
                      </Grid>
                      <Grid item md={12} sm={12} xs={12}>
                        <Typography>Value</Typography>
                        <TextField
                          fullWidth
                          size="small"
                          value={['Blank', 'Not Blank'].includes(selectedCondition) ? '' : filterValue}
                          onChange={(e) => setFilterValue(e.target.value)}
                          disabled={['Blank', 'Not Blank'].includes(selectedCondition)}
                          placeholder={['Blank', 'Not Blank'].includes(selectedCondition) ? 'Disabled' : 'Enter value'}
                          sx={{
                            '& .MuiOutlinedInput-root.Mui-disabled': {
                              backgroundColor: 'rgb(0 0 0 / 26%)',
                            },
                            '& .MuiOutlinedInput-input.Mui-disabled': {
                              cursor: 'not-allowed',
                            },
                          }}
                        />
                      </Grid>
                      {additionalFilters.length > 0 && (
                        <>
                          <Grid item md={12} sm={12} xs={12}>
                            <RadioGroup row value={logicOperator} onChange={(e) => setLogicOperator(e.target.value)}>
                              <FormControlLabel value="AND" control={<Radio />} label="AND" />
                              <FormControlLabel value="OR" control={<Radio />} label="OR" />
                            </RadioGroup>
                          </Grid>
                        </>
                      )}
                      {additionalFilters.length === 0 && (
                        <Grid item md={4} sm={12} xs={12}>
                          <Button variant="contained" onClick={handleAddFilter} sx={{ textTransform: 'capitalize' }} disabled={['Blank', 'Not Blank'].includes(selectedCondition) ? false : !filterValue || selectedColumn.length === 0}>
                            Add Filter
                          </Button>
                        </Grid>
                      )}

                      <Grid item md={2} sm={12} xs={12}>
                        <Button
                          variant="contained"
                          onClick={() => {
                            sendRequest();
                            setIsSearchActive(true);
                            setAdvancedFilter([...additionalFilters, { column: selectedColumn, condition: selectedCondition, value: filterValue }]);
                          }}
                          sx={{ textTransform: 'capitalize' }}
                          disabled={['Blank', 'Not Blank'].includes(selectedCondition) ? false : !filterValue || selectedColumn.length === 0}
                        >
                          Search
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </DialogContent>
            </Box>
          </Popover>
        </>
      )}

      {/* Second Page */}
      <LoginAllotedList clearForAlloted={clearForAlloted} isProjectvendor={isProjectvendorLoginNotAllot} checkLoad={allottedListLoad} searchQueryclear={searchQueryclear} setSearchQueryclear={setSearchQueryclear} />

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

      {/* ALERT DIALOG */}
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

      {/* Reason of Leaving  */}
      <Dialog open={openviewalert} onClose={handleClickOpenviewalert} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <Box sx={{ width: '550px', padding: '20px 50px' }}>
          <>
            <Typography sx={userStyle.HeaderText}> </Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Name</Typography>
                </FormControl>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={8} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6"></Typography>

                    <FormControl size="small" fullWidth>
                      <TextField />
                    </FormControl>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={2} xs={12} sm={12}>
                <Button variant="contained" color="primary" onClick={handleCloseviewalert}>
                  Save
                </Button>
              </Grid>

              <Grid item md={0.2} xs={12} sm={12}></Grid>
              <Grid item md={2} xs={12} sm={12}>
                <Button variant="contained" color="primary" onClick={handleCloseviewalert}>
                  {' '}
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
      <ExportData
        isFilterOpen={isFilterOpen}
        handleCloseFilterMod={handleCloseFilterMod}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpen}
        isPdfFilterOpen={isPdfFilterOpen}
        setIsPdfFilterOpen={setIsPdfFilterOpen}
        handleClosePdfFilterMod={handleClosePdfFilterMod}
        filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
        itemsTwo={loginAllotFilterExports ?? []}
        filename={'Login Not Allot List'}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      <MessageAlert openPopup={openPopupMalert} handleClosePopup={handleClosePopupMalert} popupContent={popupContentMalert} popupSeverity={popupSeverityMalert} />
      {/* SUCCESS */}
      <AlertDialog openPopup={openPopup} handleClosePopup={handleClosePopup} popupContent={popupContent} popupSeverity={popupSeverity} />
    </Box>
  );
}

export default LoginAllot;
