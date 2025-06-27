import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import { Box, Button, Checkbox, DialogActions, DialogContent, FormControl, FormControlLabel, Grid, IconButton, InputAdornment, List, ListItem, ListItemText, MenuItem, OutlinedInput, Popover, Radio, RadioGroup, Select, TextField, Tooltip, Typography } from '@mui/material';
import Switch from '@mui/material/Switch';
import axios from '../../../axiosInstance';
import domtoimage from 'dom-to-image';
import { saveAs } from 'file-saver';
import 'jspdf-autotable';
import moment from 'moment-timezone';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint, FaSearch } from 'react-icons/fa';
import { IoMdOptions } from 'react-icons/io';
import { MdClose } from 'react-icons/md';
import { ThreeDots } from 'react-loader-spinner';
import { MultiSelect } from 'react-multi-select-component';
import Selects from 'react-select';
import { useReactToPrint } from 'react-to-print';
import AggridTableForPaginationTable from '../../../components/AggridTableForPaginationTable.js';
import AlertDialog from '../../../components/Alert';
import { handleApiError } from '../../../components/Errorhandling';
import ExportData from '../../../components/ExportData';
import Headtitle from '../../../components/Headtitle';
import MessageAlert from '../../../components/MessageAlert';
import PageHeading from '../../../components/PageHeading';
import { AuthContext, UserRoleAccessContext } from '../../../context/Appcontext';
import { userStyle } from '../../../pageStyle';
import { SERVICE } from '../../../services/Baseservice';
import { getCurrentServerTime } from '../../../components/getCurrentServerTime';


function Nonproductionfilterlist() {
  const [serverTime, setServerTime] = useState(null);
  useEffect(() => {
    const fetchTime = async () => {
      const time = await getCurrentServerTime();
      setServerTime(time);
      setFilterUser({
        ...filterUser,
        fromdate: moment(time).format("YYYY-MM-DD"),
        todate: moment(time).format("YYYY-MM-DD"),
      });
    };

    fetchTime();
  }, []);


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

  var today = new Date(serverTime);
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + '-' + mm + '-' + dd;

  const [fileFormat, setFormat] = useState('');
  const [nonProductionfilterlist, setNonProductionFilterList] = useState({
    fromdate: '',
    todate: '',
  });
  const [selectedOptionsCompany, setSelectedOptionsCompany] = useState([]);
  let [valueCompanyCat, setValueCompanyCat] = useState([]);
  const [selectedOptionsBranch, setSelectedOptionsBranch] = useState([]);
  let [valueBranchCat, setValueBranchCat] = useState([]);
  const [selectedOptionsUnit, setSelectedOptionsUnit] = useState([]);
  let [valueUnitCat, setValueUnitCat] = useState([]);
  const [selectedOptionsTeam, setSelectedOptionsTeam] = useState([]);
  let [valueTeamCat, setValueTeamCat] = useState([]);
  const [selectedOptionsEmployee, setSelectedOptionsEmployee] = useState([]);
  let [valueEmployeeCat, setValueEmployeeCat] = useState([]);
  const customValueRendererCompany = (valueCompanyCat, _categoryname) => {
    return valueCompanyCat?.length ? valueCompanyCat.map(({ label }) => label)?.join(', ') : 'Please Select Company';
  };
  const customValueRendererBranch = (valueBranchCat, _categoryname) => {
    return valueBranchCat?.length ? valueBranchCat.map(({ label }) => label)?.join(', ') : 'Please Select Branch';
  };
  const customValueRendererUnit = (valueUnitCat, _categoryname) => {
    return valueUnitCat?.length ? valueUnitCat.map(({ label }) => label)?.join(', ') : 'Please Select Unit';
  };
  const customValueRendererTeam = (valueTeamCat, _categoryname) => {
    return valueTeamCat?.length ? valueTeamCat.map(({ label }) => label)?.join(', ') : 'Please Select Team';
  };
  const customValueRendererEmployee = (valueEmployeeCat, _categoryname) => {
    return valueEmployeeCat?.length ? valueEmployeeCat.map(({ label }) => label)?.join(', ') : 'Please Select Employee';
  };
  const [isActive, setIsActive] = useState(false);
  const [sources, setAssignedby] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { isUserRoleCompare, isUserRoleAccess, isAssignBranch, allTeam, allUsersData, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);
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
  const [sourceCheck, setSourcecheck] = useState(false);
  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState('');
  const [copiedData, setCopiedData] = useState('');
  //image

  const gridRefTableImg = useRef(null);
  const gridRefTable = useRef(null);

  // image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage
        .toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, 'Non Production.png');
        })
        .catch((error) => {
          console.error('dom-to-image error: ', error);
        });
    }
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
    setIsActive(false);
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
    name: true,
    empcode: true,
    fromdate: true,
    todate: true,
    mode: true,
    count: true,
    actions: false,
  };
  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);
  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ''; // This is required for Chrome support
  };
  const [deleteSource, setDeleteSource] = useState('');
  let exportColumnNames = ['Employee Name', 'Emp Code', 'Date', 'Mode', 'Count'];
  let exportRowValues = ['name', 'empcode', 'fromdate', 'mode', 'count'];
  // Alert delete popup
  let Sourcesid = deleteSource?._id;
  const [overallNonProductionFlter, setOverallNonProductionFlter] = useState([]);
  //add function
  const [taskcategoryCheck, settaskcategoryCheck] = useState(true);

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
    settaskcategoryCheck(false);
    setPageName(!pageName);
    console.time('sendRequest');

    const queryParams = {
      page: Number(page),
      pageSize: Number(pageSize),
      fromdate: String(filterUser.fromdate),
      todate: String(filterUser.todate),
      company: valueCompanyCat,
      branch: valueBranchCat,
      unit: valueUnitCat,
      team: valueTeamCat,
      employee: valueEmployeeCat,
      assignbranch: accessbranch,
    };

    const allFilters = [...additionalFilters, { column: selectedColumn, condition: selectedCondition, value: filterValue }];

    if (allFilters.length > 0 && selectedColumn !== '') {
      queryParams.allFilters = allFilters;
      queryParams.logicOperator = logicOperator;
    } else if (searchQuery) {
      queryParams.searchQuery = searchQuery;
    }

    try {
      let res_vendor = await axios.post(SERVICE.GETFILTERDATA, queryParams, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAssignedby(res_vendor?.data?.filterdatanonproduction);
      console.log(res_vendor?.data?.filterdatanonproduction);
      setOverallNonProductionFlter(res_vendor?.data?.filterdatanonproduction);
      setTotalProjects(res_vendor?.data?.filterdatanonproduction?.length > 0 ? res_vendor?.data?.totalProjects : 0);
      setTotalPages(res_vendor?.data?.filterdatanonproduction?.length > 0 ? res_vendor?.data?.totalPages : 0);
      setPageSize((data) => {
        return res_vendor?.data?.filterdatanonproduction?.length > 0 ? data : 10;
      });
      setPage((data) => {
        return res_vendor?.data?.filterdatanonproduction?.length > 0 ? data : 1;
      });
      settaskcategoryCheck(true);
      console.timeEnd('sendRequest');
    } catch (err) {
      settaskcategoryCheck(true);

      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const sendRequestForSearch = async () => {
    settaskcategoryCheck(false);
    setPageName(!pageName);
    console.time('sendRequest');

    const queryParams = {
      page: Number(page),
      pageSize: Number(pageSize),
      fromdate: String(filterUser.fromdate),
      todate: String(filterUser.todate),
      company: valueCompanyCat,
      branch: valueBranchCat,
      unit: valueUnitCat,
      team: valueTeamCat,
      employee: valueEmployeeCat,
      assignbranch: accessbranch,
    };

    const allFilters = [...additionalFilters, { column: selectedColumn, condition: selectedCondition, value: filterValue }];

    if (allFilters.length > 0 && selectedColumn !== '') {
      queryParams.allFilters = allFilters;
      queryParams.logicOperator = logicOperator;
    } else if (searchQuery) {
      queryParams.searchQuery = searchQuery;
    }

    try {
      let res_vendor = await axios.post(SERVICE.GETFILTERDATA, queryParams, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAssignedby(res_vendor?.data?.filterdatanonproduction);
      setOverallNonProductionFlter(res_vendor?.data?.filterdatanonproduction);

      setTotalProjects(res_vendor?.data?.filterdatanonproduction?.length > 0 ? res_vendor?.data?.totalProjects : 0);
      setTotalPages(res_vendor?.data?.filterdatanonproduction?.length > 0 ? res_vendor?.data?.totalPages : 0);
      setPageSize((data) => {
        return res_vendor?.data?.filterdatanonproduction?.length > 0 ? data : 10;
      });
      setPage((data) => {
        return res_vendor?.data?.filterdatanonproduction?.length > 0 ? data : 1;
      });
      settaskcategoryCheck(true);
      console.timeEnd('sendRequest');
    } catch (err) {
      settaskcategoryCheck(true);

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
      fromdate: String(filterUser.fromdate),
      todate: String(filterUser.todate),
      company: valueCompanyCat,
      branch: valueBranchCat,
      unit: valueUnitCat,
      team: valueTeamCat,
      employee: valueEmployeeCat,
      assignbranch: accessbranch,
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
      let res_vendor = await axios.post(SERVICE.GETFILTERDATA, queryParams, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAssignedby(res_vendor?.data?.filterdatanonproduction);
      setOverallNonProductionFlter(res_vendor?.data?.filterdatanonproduction);

      setTotalProjects(res_vendor?.data?.filterdatanonproduction?.length > 0 ? res_vendor?.data?.totalProjects : 0);
      setTotalPages(res_vendor?.data?.filterdatanonproduction?.length > 0 ? res_vendor?.data?.totalPages : 0);
      setPageSize((data) => {
        return res_vendor?.data?.filterdatanonproduction?.length > 0 ? data : 10;
      });
      setPage((data) => {
        return res_vendor?.data?.result?.length > 0 ? data : 1;
      });
      settaskcategoryCheck(true);
      console.timeEnd('sendRequest');
    } catch (err) {
      settaskcategoryCheck(true);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsActive(true);
    if (filterUser.fromdate !== '' && filterUser.todate === '') {
      setPopupContentMalert('Please Select To Date');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (filterUser.fromdate === '' && filterUser.todate !== '') {
      setPopupContentMalert('Please Select From Date');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (filterUser.fromdate === '' && filterUser.todate === '' && selectedOptionsCompany.length === 0 && selectedOptionsBranch.length === 0 && selectedOptionsUnit.length === 0 && selectedOptionsTeam.length === 0 && selectedOptionsEmployee.length === 0) {
      setPopupContentMalert('Please Select Any One Field');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else {
      sendRequest();
    }
  };
  const handleClear = (e) => {
    e.preventDefault();
    setProdFilter(false);
    setNonProductionFilterList({
      fromdate: '',
      todate: '',
    });
    setFilterUser({
      fromdate: today,
      todate: today,
      type: 'Please Select Type',
      percentage: '',
      day: 'Today',
    });
    setSelectedOptionsBranch([]);
    setSelectedOptionsUnit([]);
    setSelectedOptionsTeam([]);
    setSelectedOptionsCompany([]);
    setSelectedOptionsEmployee([]);
    setValueCompanyCat([]);
    setValueBranchCat([]);
    setValueUnitCat([]);
    setValueTeamCat([]);
    setValueEmployeeCat([]);
    setAssignedby([]);
    setOverallNonProductionFlter([]);
    setPopupContent('Cleared Successfully');
    setPopupSeverity('success');
    handleClickOpenPopup();
  };
  //Edit model...
  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Non Production Filter List',
    pageStyle: 'print',
  });
  const handleCompanyChange = (options) => {
    setValueCompanyCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCompany(options);
  };
  const handleBranchChange = (options) => {
    setValueBranchCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsBranch(options);
  };
  const handleUnitChange = (options) => {
    setValueUnitCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsUnit(options);
  };
  const handleTeamChange = (options) => {
    setValueTeamCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsTeam(options);
  };
  const handleEmployeeChangeFrom = (options) => {
    setValueEmployeeCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsEmployee(options);
  };

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener('beforeunload', beforeUnloadHandler);
    return () => {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
    };
  }, []);
  const [items, setItems] = useState([]);
  const addSerialNumber = () => {
    const itemsWithSerialNumber = sources?.map((item, index) => ({ ...item }));
    setItems(itemsWithSerialNumber);
  };

  const [prodFilter, setProdFilter] = useState(false);

  useEffect(() => {
    getapi();
  }, []);

  useEffect(() => {
    if (prodFilter) {
      sendRequestForSearch();
    }
  }, [page, pageSize, searchQuery]);

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String('Non Production Filter List'),
      commonid: String(isUserRoleAccess?._id),
      date: String(new Date(serverTime)),

      addedby: [
        {
          name: String(isUserRoleAccess?.username),
          // date: String(new Date(serverTime)),
        },
      ],
    });
  };

  useEffect(() => {
    addSerialNumber();
  }, [sources]);
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
  };
  // Split the search query into individual terms
  const searchTerms = searchQuery.toLowerCase().split(' ');
  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchTerms.every((term) => Object.values(item).join(' ').toLowerCase().includes(term));
  });

  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
    <div>
      <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
    </div>
  );
  const columnDataTable = [
    {
      field: 'serialNumber',
      headerName: 'SNo',
      flex: 0,
      width: 80,
      hide: !columnVisibility.serialNumber,
      headerClassName: 'bold-header',
    },
    { field: 'name', headerName: 'Employee Name', flex: 0, width: 250, hide: !columnVisibility.name, headerClassName: 'bold-header' },
    { field: 'empcode', headerName: 'Emp Code', flex: 0, width: 250, hide: !columnVisibility.empcode, headerClassName: 'bold-header' },
    { field: 'fromdate', headerName: 'Date', flex: 0, width: 140, hide: !columnVisibility.fromdate, headerClassName: 'bold-header' },
    { field: 'mode', headerName: 'Mode', flex: 0, width: 140, hide: !columnVisibility.mode, headerClassName: 'bold-header' },
    { field: 'count', headerName: 'Count', flex: 0, width: 140, hide: !columnVisibility.count, headerClassName: 'bold-header' },
  ];

  const filteredSelectedColumn = columnDataTable.filter((data) => data.field !== 'checkbox' && data.field !== 'actions' && data.field !== 'serialNumber');

  const rowDataTable = filteredDatas.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      name: item.name,
      empcode: item.empcode,
      fromdate: moment(item.date).format('DD-MM-YYYY'),
      mode: item.mode,
      count: item.count,
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

  const [filterUser, setFilterUser] = useState({
    company: 'Please Select Company',
    branch: 'Please Select Branch',
    fromdate: today,
    todate: today,
    type: 'Please Select Type',
    percentage: '',
    day: 'Today',
  });

  const daysoptions = [
    { label: 'Yesterday', value: 'Yesterday' },
    { label: 'Last Week', value: 'Last Week' },
    { label: 'Last Month', value: 'Last Month' },
    { label: 'Today', value: 'Today' },
    { label: 'This Week', value: 'This Week' },
    { label: 'This Month', value: 'This Month' },
    { label: 'Custom Fields', value: 'Custom Fields' },
  ];

  const handleChangeFilterDate = (e) => {
    let fromDate = '';
    let toDate = moment().format('YYYY-MM-DD');
    switch (e.value) {
      case 'Today':
        setFilterUser((prev) => ({ ...prev, fromdate: toDate, todate: toDate }));
        break;
      case 'Yesterday':
        fromDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
        toDate = fromDate; // Yesterday’s date
        setFilterUser((prev) => ({ ...prev, fromdate: fromDate, todate: toDate }));
        break;

      case 'Last Week':
        fromDate = moment().subtract(1, 'weeks').startOf('week').format('YYYY-MM-DD');
        toDate = moment().subtract(1, 'weeks').endOf('week').format('YYYY-MM-DD');
        setFilterUser((prev) => ({ ...prev, fromdate: fromDate, todate: toDate }));
        break;

      case 'This Week':
        fromDate = moment().startOf('week').format('YYYY-MM-DD');
        toDate = moment().endOf('week').format('YYYY-MM-DD');
        setFilterUser((prev) => ({ ...prev, fromdate: fromDate, todate: toDate }));
        break;

      case 'Last Month':
        fromDate = moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD');
        toDate = moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD');
        setFilterUser((prev) => ({ ...prev, fromdate: fromDate, todate: toDate }));
        break;

      case 'This Month':
        fromDate = moment().startOf('month').format('YYYY-MM-DD');
        toDate = moment().endOf('month').format('YYYY-MM-DD');
        setFilterUser((prev) => ({ ...prev, fromdate: fromDate, todate: toDate }));
        break;

      case 'Custom Fields':
        setFilterUser((prev) => ({ ...prev, fromdate: '', todate: '' }));
        break;
      default:
        return;
    }
  };

  const handleAutoSelect = async () => {
    setPageName(!pageName);

    try {
      let selectedValues = isAssignBranch
        ?.map((data) => ({
          company: data.company,
          branch: data.branch,
          unit: data.unit,
        }))
        .filter((value, index, self) => index === self.findIndex((t) => t.company === value.company && t.branch === value.branch && t.unit === value.unit));
      let selectedCompany = selectedValues
        ?.filter((value, index, self) => index === self.findIndex((t) => t.company === value.company))
        .map((a, index) => {
          return a.company;
        });

      let mappedCompany = selectedValues
        ?.filter((value, index, self) => index === self.findIndex((t) => t.company === value.company))
        ?.map((data) => ({
          label: data?.company,
          value: data?.company,
        }));

      setValueCompanyCat(selectedCompany);
      setSelectedOptionsCompany(mappedCompany);

      let selectedBranch = selectedValues
        .filter((value, index, self) => index === self.findIndex((t) => t.company === value.company && t.branch === value.branch))
        .map((a, index) => {
          return a.branch;
        });

      let mappedBranch = selectedValues
        .filter((value, index, self) => index === self.findIndex((t) => t.company === value.company && t.branch === value.branch))
        ?.map((data) => ({
          label: data?.branch,
          value: data?.branch,
        }));

      setValueBranchCat(selectedBranch);
      setSelectedOptionsBranch(mappedBranch);

      let selectedUnit = selectedValues
        .filter((value, index, self) => index === self.findIndex((t) => t.company === value.company && t.branch === value.branch && t.unit === value.unit))
        .map((a, index) => {
          return a.unit;
        });

      let mappedUnit = selectedValues
        .filter((value, index, self) => index === self.findIndex((t) => t.company === value.company && t.branch === value.branch && t.unit === value.unit))
        ?.map((data) => ({
          label: data?.unit,
          value: data?.unit,
        }));

      setValueUnitCat(selectedUnit);
      setSelectedOptionsUnit(mappedUnit);

      let mappedTeam = allTeam
        ?.filter((u) => selectedCompany?.includes(u.company) && selectedBranch?.includes(u.branch) && selectedUnit?.includes(u.unit))
        .map((u) => ({
          label: u.teamname,
          value: u.teamname,
        }));

      let selectedTeam = allTeam?.filter((u) => selectedCompany?.includes(u.company) && selectedBranch?.includes(u.branch) && selectedUnit?.includes(u.unit)).map((u) => u.teamname);
      setValueTeamCat(selectedTeam);
      setSelectedOptionsTeam(mappedTeam);

      let mappedemployees = allUsersData
        ?.filter((u) => selectedCompany?.includes(u.company) && selectedBranch?.includes(u.branch) && selectedUnit?.includes(u.unit) && selectedTeam?.includes(u.team))
        .map((u) => ({
          label: u.companyname,
          value: u.companyname,
        }));

      let employeess = allUsersData?.filter((u) => selectedCompany?.includes(u.company) && selectedBranch?.includes(u.branch) && selectedUnit?.includes(u.unit) && selectedTeam?.includes(u.team)).map((u) => u.companyname);

      setValueEmployeeCat(employeess);
      setSelectedOptionsEmployee(mappedemployees);

      //   setAllAssignCompany(selectedCompany);

      //   setAllAssignBranch(selectedBranch);

      //   setAllAssignUnit(selectedUnit);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    handleAutoSelect();
  }, [isAssignBranch]);

  return (
    <Box>
      <Headtitle title={'Non Production Filter List'} />
      {/* ****** Header Content ****** */}
      <PageHeading title="Non Production Filter" modulename="Production" submodulename="Non Production" mainpagename="Non-production Setup" subpagename="Non Production Filter List" subsubpagename="" />
      {isUserRoleCompare?.includes('anonproductionfilterlist') && (
        <>
          <Box sx={userStyle.dialogbox}>
            <>
              <Grid container spacing={2}>
                <Grid item md={12} xs={12} sm={12}>
                  <Typography>Non Production Filter List</Typography>
                </Grid>

                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography sx={{ fontWeight: '500' }}>
                      Days<b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <Selects
                      options={daysoptions}
                      // styles={colourStyles}
                      value={{ label: filterUser.day, value: filterUser.day }}
                      onChange={(e) => {
                        handleChangeFilterDate(e);
                        setFilterUser((prev) => ({ ...prev, day: e.value }));
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      {' '}
                      From Date<b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="from-date"
                      type="date"
                      disabled={filterUser.day !== 'Custom Fields'}
                      value={filterUser.fromdate}
                      onChange={(e) => {
                        const newFromDate = e.target.value;
                        setFilterUser((prevState) => ({
                          ...prevState,
                          fromdate: newFromDate,
                          todate: prevState.todate && new Date(prevState.todate) > new Date(newFromDate) ? prevState.todate : '',
                        }));
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      To Date<b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="to-date"
                      type="date"
                      value={filterUser.todate}
                      disabled={filterUser.day !== 'Custom Fields'}
                      onChange={(e) => {
                        const selectedToDate = new Date(e.target.value);
                        const selectedFromDate = new Date(filterUser.fromdate);
                        const formattedDatePresent = new Date(); // Assuming you have a function to format the current date
                        if (selectedToDate >= selectedFromDate && selectedToDate >= new Date(selectedFromDate)) {
                          setFilterUser({
                            ...filterUser,
                            todate: e.target.value,
                          });
                        } else {
                          setFilterUser({
                            ...filterUser,
                            todate: '', // Reset to empty string if the condition fails
                          });
                        }
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Company <b style={{ color: 'red' }}>*</b>
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
                      value={selectedOptionsCompany}
                      onChange={(e) => {
                        handleCompanyChange(e);
                        setSelectedOptionsBranch([]);
                        setSelectedOptionsUnit([]);
                        setSelectedOptionsTeam([]);
                        setSelectedOptionsEmployee([]);
                      }}
                      valueRenderer={customValueRendererCompany}
                      labelledBy="Please Select Company"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Branch <b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={accessbranch
                        ?.filter((comp) => valueCompanyCat.includes(comp.company))
                        ?.map((data) => ({
                          label: data.branch,
                          value: data.branch,
                        }))
                        .filter((item, index, self) => {
                          return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                        })}
                      value={selectedOptionsBranch}
                      onChange={(e) => {
                        handleBranchChange(e);
                        setSelectedOptionsTeam([]);
                        setSelectedOptionsUnit([]);
                        setSelectedOptionsEmployee([]);
                      }}
                      valueRenderer={customValueRendererBranch}
                      labelledBy="Please Select Branch"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Unit <b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={accessbranch
                        ?.filter((comp) => valueCompanyCat.includes(comp.company) && valueBranchCat.includes(comp.branch))
                        ?.map((data) => ({
                          label: data.unit,
                          value: data.unit,
                        }))
                        .filter((item, index, self) => {
                          return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                        })}
                      value={selectedOptionsUnit}
                      onChange={(e) => {
                        handleUnitChange(e);
                        setSelectedOptionsTeam([]);
                        setSelectedOptionsEmployee([]);
                      }}
                      valueRenderer={customValueRendererUnit}
                      labelledBy="Please Select Unit"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Team <b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={allTeam
                        ?.filter((comp) => valueCompanyCat.includes(comp.company) && valueBranchCat.includes(comp.branch) && valueUnitCat.includes(comp.unit))
                        ?.map((data) => ({
                          label: data.teamname,
                          value: data.teamname,
                        }))
                        .filter((item, index, self) => {
                          return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                        })}
                      value={selectedOptionsTeam}
                      onChange={(e) => {
                        handleTeamChange(e);
                        setSelectedOptionsEmployee([]);
                      }}
                      valueRenderer={customValueRendererTeam}
                      labelledBy="Please Select Team"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <Typography>
                    Employee<b style={{ color: 'red' }}>*</b>
                  </Typography>
                  <FormControl fullWidth size="small">
                    <MultiSelect
                      options={allUsersData
                        ?.filter((comp) => valueTeamCat.includes(comp.team) && valueCompanyCat.includes(comp.company) && valueBranchCat.includes(comp.branch) && valueUnitCat.includes(comp.unit))
                        ?.map((data) => ({
                          label: data.companyname,
                          value: data.companyname,
                        }))
                        .filter((item, index, self) => {
                          return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                        })}
                      value={selectedOptionsEmployee}
                      onChange={handleEmployeeChangeFrom}
                      valueRenderer={customValueRendererEmployee}
                      labelledBy="Please Select Employee"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                  <Typography>&nbsp;</Typography>
                  <Grid
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: '15px',
                    }}
                  >
                    <Button
                      variant="contained"
                      onClick={(e) => {
                        handleSubmit(e);
                        setProdFilter(true);
                      }}
                      sx={buttonStyles.buttonsubmit}
                    >
                      Filter
                    </Button>
                    <Button sx={buttonStyles.btncancel} onClick={handleClear}>
                      CLEAR
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </>
          </Box>
        </>
      )}
      <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes('lnonproductionfilterlist') && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            {/* <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Log List</Typography>
                        </Grid> */}
            <Grid container spacing={2}>
              <Grid item xs={5} sx={{ marginTop: '20px' }}>
                <Typography sx={userStyle.SubHeaderText}>Non Production Filter List</Typography>
              </Grid>
            </Grid>
            <br />
            <Grid item md={12} xs={12} sm={12} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <Grid item md={2} xs={12} sm={12}>
                <Typography>&nbsp;</Typography>
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
                  </Select>
                </Box>
              </Grid>
              <Grid item md={8} xs={12} sm={12}>
                <Typography>&nbsp;</Typography>
                <Box>
                  {isUserRoleCompare?.includes('excelnonproductionfilterlist') && (
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
                  {isUserRoleCompare?.includes('csvnonproductionfilterlist') && (
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
                  {isUserRoleCompare?.includes('printnonproductionfilterlist') && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint /> &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes('pdfnonproductionfilterlist') && (
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
                  {isUserRoleCompare?.includes('imagenonproductionfilterlist') && (
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
            <br />
            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
              Show All Columns
            </Button>
            &ensp;
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
              Manage Columns
            </Button>
            &ensp;
            <br />
            <br />
            {!taskcategoryCheck ? (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                </Box>
              </>
            ) : (
              <>
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
                  itemsList={sources}
                />
              </>
            )}
          </Box>
        </>
      )}
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
                        sendRequestForSearch();
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
        filteredDataTwo={rowDataTable ?? []}
        itemsTwo={overallNonProductionFlter ?? []}
        filename={'Non Production Filter list'}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
    </Box>
  );
}
export default Nonproductionfilterlist;
