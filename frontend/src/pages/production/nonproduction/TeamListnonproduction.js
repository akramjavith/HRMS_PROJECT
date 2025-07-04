import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import ImageIcon from '@mui/icons-material/Image';
import { Box, Button, Dialog, DialogActions, DialogContent, FormControl, FormControlLabel, Grid, IconButton, InputAdornment, List, ListItem, ListItemText, MenuItem, OutlinedInput, Popover, Radio, RadioGroup, Select, TextField, Tooltip, Typography } from '@mui/material';
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
import { userStyle,colourStyles } from '../../../pageStyle';
import { SERVICE } from '../../../services/Baseservice';
import ListApproved from './TeamListApproved.js';
import ListRejected from './TeamListRejected.js';
import { getCurrentServerTime } from '../../../components/getCurrentServerTime';


function NonproductionList() {

  const [serverTime, setServerTime] = useState(null);
  useEffect(() => {
    const fetchTime = async () => {
      const time = await getCurrentServerTime();
      setServerTime(time);
      setFilterUser({
        ...filterUser,
        fromdate: moment(time).format('YYYY-MM-DD'),
        todate: moment(time).format('YYYY-MM-DD'),
      })
    };

    fetchTime();
  }, []);

  useEffect(() => {
    getCurrentServerTime();

    const interval = setInterval(() => {
      setServerTime((prevTime) => moment(prevTime).add(1, 'second'));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

      const modeDropDowns = [
          { label: "My Hierarchy List", value: "myhierarchy" },
          { label: "All Hierarchy List", value: "allhierarchy" },
          { label: "My + All Hierarchy List", value: "myallhierarchy" },
      ];
      const sectorDropDowns = [
          { label: "Primary", value: "Primary" },
          { label: "Secondary", value: "Secondary" },
          { label: "Tertiary", value: "Tertiary" },
          { label: "All", value: "all" },
      ];
      const [modeselection, setModeSelection] = useState({
          label: "My Hierarchy List",
          value: "myhierarchy",
      });
      const [sectorSelection, setSectorSelection] = useState({
          label: "Primary",
          value: "Primary",
      });

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

  const [totalProjectsApproved, setTotalProjectsApproved] = useState(0);
  const [totalPagesApproved, setTotalPagesApproved] = useState(0);

  const [totalProjectsRejected, setTotalProjectsRejected] = useState(0);
  const [totalPagesRejected, setTotalPagesRejected] = useState(0);

  var today = new Date(serverTime);
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + '-' + mm + '-' + dd;

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

  const gridRefTable = useRef(null);

  const [fileFormat, setFormat] = useState('');
  const [taskcategory, setTaskcategory] = useState({
    base: 'All',
    category: 'Please Select Category',
    subcategory: 'Please Select Sub Category',
  });
  const [taskcategorys, setTaskcategorys] = useState([]);

  const [taskcategorysAssign, setTaskcategorysAssign] = useState([]);
  const [taskcategorysall, setTaskcategorysall] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchQueryAssign, setSearchQueryAssign] = useState('');
  const [searchQueryall, setSearchQueryall] = useState('');
  const { isUserRoleCompare, isUserRoleAccess, listPageAccessMode,isAssignBranch, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);

     let listpageaccessby =
        listPageAccessMode?.find(
            (data) =>
                data.modulename === "Production" &&
                data.submodulename === "Non Production" &&
                data.mainpagename === "Non-Production Reports" &&
                data.subpagename === "Team Non Production List" &&
                data.subsubpagename === ""
        )?.listpageaccessmode || "Overall";
  const { auth } = useContext(AuthContext);
  const [taskcategoryCheck, setTaskcategorycheck] = useState(false);
  const username = isUserRoleAccess.username;
  const gridRef = useRef(null);
  const gridRefAssign = useRef(null);
  const gridRefall = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowsAssign, setSelectedRowsAssign] = useState([]);
  const [selectedRowsall, setSelectedRowsall] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState('');
  const [searchQueryManageAssign, setSearchQueryManageAssign] = useState('');
  const [searchQueryManageall, setSearchQueryManageall] = useState('');
  const [copiedData, setCopiedData] = useState('');
  //image

  const gridRefTableImg = useRef(null);
  // image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage
        .toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, 'Assign List.png');
        })
        .catch((error) => {
          console.error('dom-to-image error: ', error);
        });
    }
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };
  const handleSelectionChangeAssign = (newSelection) => {
    setSelectedRowsAssign(newSelection.selectionModel);
  };
  const handleSelectionChangeall = (newSelection) => {
    setSelectedRowsall(newSelection.selectionModel);
  };
  //Datatable

  const [page, setPage] = useState(1);
  const [pageApproved, setPageApproved] = useState(1);
  const [pageReject, setPageReject] = useState(1);
  const [pageAsssign, setPageAssign] = useState(1);
  const [pageall, setPageall] = useState(1);
  const [pagesizeall, setPageSizeall] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pageSizeApprove, setPageSizeApprove] = useState(10);
  const [pagesizeReject, setPageSizeReject] = useState(10);
  const [isOpenReject, setIsOpenReject] = useState(false);
  const handleClickOpenReject = () => {
    setIsOpenReject(true);
  };
  const handleCloseReject = () => {
    setIsOpenReject(false);
  };
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
  const [isManageColumnsOpenAssign, setManageColumnsOpenAssign] = useState(false);
  const [isManageColumnsOpenall, setManageColumnsOpenall] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElAssign, setAnchorElAssign] = useState(null);
  const [anchorElall, setAnchorElall] = useState(null);
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
    name: true,
    category: true,
    subcategory: true,
    mode: true,
    date: true,
    allotdays: true,
    allothours: true,
    allotmins: true,
    days: true,
    hours: true,
    minutes: true,
    count: true,
    actions: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);
  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ''; // This is required for Chrome support
  };
  const handleIsApprove = () => {
    setShowAlert(
      <>
        <ErrorOutlineOutlinedIcon sx={{ fontSize: '3.5rem', color: 'teal' }} />
        <p style={{ fontSize: '20px', fontWeight: 900 }}>{'Are You Sure to Approve'}</p>
      </>
    );
    handleClickOpenApprove();
  };
  const handleReject = () => {
    setShowAlert(
      <>
        <ErrorOutlineOutlinedIcon sx={{ fontSize: '3.5rem', color: 'teal' }} />
        <p style={{ fontSize: '20px', fontWeight: 900 }}>{'Are You Sure to Reject'}</p>
      </>
    );
    handleClickOpenReject();
  };
  const [nonProduction, setNonProductionData] = useState([]);
  //get single row to edit....
  const getCode = async (e, name) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.NONPRODUCTION_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setNonProductionData(res?.data?.snonproduction);
      if (name == 'approve') {
        handleIsApprove();
      } else {
        handleReject();
      }
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  let exportColumnNames = ['Name', 'Category', 'Sub Category', 'Mode', 'Date', 'Allot Min Days', 'Allot Min Hours', 'Allot Min Minutes', 'Allot Max Days', 'Allot Max Hours', 'Allot Max Minutes', 'Count'];
  let exportRowValues = ['name', 'category', 'subcategory', 'mode', 'date', 'allotdays', 'allothours', 'allotmins', 'days', 'hours', 'minutes', 'count'];

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

  const [taskcategorysForExports, setTaskcategorysForExports] = useState([]);
  const [taskcategorysAssignExports, setTaskcategorysAssignExports] = useState([]);
  const [taskcategorysallExports, setTaskcategorysallExports] = useState([]);

  const handleFilterClickForExports = async () => {
    setPageName(!pageName);

    // console.time("handleFilterClick")
    const queryParams = {
      page: Number(page),
      pageSize: Number(pageSize),
      pageApproved: Number(pageApproved),
      pageSizeApprove: Number(pageSizeApprove),
      pageReject: Number(pageReject),
      pagesizeReject: Number(pagesizeReject),
      fromdate: filterUser.fromdate,
      todate: filterUser.todate,
    };

    const allFilters = [...additionalFilters, { column: selectedColumn, condition: selectedCondition, value: filterValue }];

    if (allFilters.length > 0 && selectedColumn !== '') {
      queryParams.allFilters = allFilters;
      queryParams.logicOperator = logicOperator;
    } else if (searchQuery) {
      queryParams.searchQuery = searchQuery;
    }

    try {

           let res_hir= await axios.post(SERVICE.NONPRODUCTIONFILTERLIST_HIERARCHY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
         hierachy: "myallhierarchy",
        sector: "all",
        username: isUserRoleAccess.companyname,
        pagename: "menuteamnonproductionlist",
        listpageaccessmode: listpageaccessby,

      });
if(res_hir?.data?.resultAccessFilter.length > 0){
   queryParams.name = res_hir?.data?.resultAccessFilter



      let res_vendor = await axios.post(SERVICE.NONPRODUCTIONFILTERLIST_TEAM_EXPORTS, queryParams, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setTaskcategorysForExports(
        res_vendor?.data?.lists?.assignlist?.map((item, index) => ({
          ...item,
          serialNumber: index + 1,
        }))
      );

      setTaskcategorysAssignExports(
        res_vendor?.data?.lists?.approvedlist?.map((item, index) => ({
          ...item,
          serialNumber: index + 1,
        }))
      );

      setTaskcategorysallExports(
        res_vendor?.data?.lists?.rejectlist?.map((item, index) => ({
          ...item,
          serialNumber: index + 1,
        }))
      );

    }
    setTaskcategorysForExports([])
    setTaskcategorysAssignExports([])
    setTaskcategorysallExports([])

      // console.timeEnd("handleFilterClick")
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const handleFilterClick = async () => {
    setPageName(!pageName);
    setPageSize(10);
    setPageSizeApprove(10);
    setPageSizeReject(10);
    setTaskcategorycheck(false);
    setPage(1);
    setPageApproved(1);
    setPageReject(1);
    console.time('handleFilterClick');
    const queryParams = {
      page: Number(page),
      pageSize: Number(pageSize),
      pageApproved: Number(pageApproved),
      pageSizeApprove: Number(pageSizeApprove),
      pageReject: Number(pageReject),
      pagesizeReject: Number(pagesizeReject),
      fromdate: filterUser.fromdate,
      todate: filterUser.todate,
    };

    const allFilters = [...additionalFilters, { column: selectedColumn, condition: selectedCondition, value: filterValue }];

    if (allFilters.length > 0 && selectedColumn !== '') {
      queryParams.allFilters = allFilters;
      queryParams.logicOperator = logicOperator;
    } else if (searchQuery) {
      queryParams.searchQuery = searchQuery;
    }

    try {
          let res_hir= await axios.post(SERVICE.NONPRODUCTIONFILTERLIST_HIERARCHY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
         hierachy: "myallhierarchy",
        sector: "all",
        username: isUserRoleAccess.companyname,
        pagename: "menuteamnonproductionlist",
        listpageaccessmode: listpageaccessby,

      });
if(res_hir?.data?.resultAccessFilter.length > 0){
   queryParams.name = res_hir?.data?.resultAccessFilter
      let res_vendor = await axios.post(SERVICE.NONPRODUCTIONFILTERLIST_TEAM, queryParams, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setTaskcategorys(
        res_vendor?.data?.lists?.assignlist?.map((item, index) => ({
          ...item,
          serialNumber: (page - 1) * pageSize + index + 1,
        }))
      );
      console.log(res_vendor?.data?.lists,"lists")

      setTaskcategorysAssign(res_vendor?.data?.lists?.approvedlist);
      setTaskcategorysall(res_vendor?.data?.lists?.rejectlist);

      setTotalProjects(res_vendor?.data?.lists?.assignlist?.length > 0 ? res_vendor?.data?.counts?.assigned : 0);
      setTotalPages(res_vendor?.data?.lists?.assignlist?.length > 0 ? res_vendor?.data?.pagination?.assigned?.totalPages : 0);
      setPageSize(res_vendor?.data?.lists?.assignlist?.length > 0 ? res_vendor?.data?.pagination?.assigned?.pageSize : 10);
      setPage(res_vendor?.data?.lists?.assignlist?.length > 0 ? res_vendor?.data?.pagination?.assigned?.currentPage : 1);
      //ForApproved
      setTotalProjectsApproved(res_vendor?.data?.lists?.approvedlist?.length > 0 ? res_vendor?.data?.counts?.approved : 0);
      setTotalPagesApproved(res_vendor?.data?.lists?.approvedlist?.length > 0 ? res_vendor?.data?.pagination?.approved?.totalPages : 0);
      setPageSizeApprove(res_vendor?.data?.lists?.approvedlist?.length > 0 ? res_vendor?.data?.pagination?.approved?.pageSize : 10);
      setPageApproved(res_vendor?.data?.lists?.approvedlist?.length > 0 ? res_vendor?.data?.pagination?.approved?.currentPage : 1);
      //ForRejected
      setTotalProjectsRejected(res_vendor?.data?.lists?.rejectlist?.length > 0 ? res_vendor?.data?.counts?.rejected : 0);
      setTotalPagesRejected(res_vendor?.data?.lists?.rejectlist?.length > 0 ? res_vendor?.data?.pagination?.rejected?.totalPages : 0);
      setPageSizeReject(res_vendor?.data?.lists?.rejectlist?.length > 0 ? res_vendor?.data?.pagination?.rejected?.pageSize : 10);
      setPageReject(res_vendor?.data?.lists?.rejectlist?.length > 0 ? res_vendor?.data?.pagination?.rejected?.currentPage : 1);

      setTaskcategorycheck(true);
      setSearchQueryall('');
      setSearchQuery('');
      setSearchQueryAssign('');
    }else{
     setTaskcategorysAssign([]);
      setTaskcategorysall([]);

      setTotalProjects(0);
      setTotalPages(0);
      setPageSize(10);
      setPage(1);
      //ForApproved
      setTotalProjectsApproved(0);
      setTotalPagesApproved(0);
      setPageSizeApprove(10);
      setPageApproved(1);
      //ForRejected
      setTotalProjectsRejected(0);
      setTotalPagesRejected(0);
      setPageSizeReject(10);
      setPageReject(1);

      setTaskcategorycheck(true);
      setSearchQueryall('');
      setSearchQuery('');
      setSearchQueryAssign('');
      console.timeEnd('handleFilterClick');
    }
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const handleFilterClickForAssign = async () => {
    setPageName(!pageName);
    setPageSizeApprove(10);
    setPageSizeReject(10);
    setTaskcategorycheck(false);
    setPageApproved(1);
    setPageReject(1);

    const queryParams = {
      page: Number(page),
      pageSize: Number(pageSize),
      fromdate: filterUser.fromdate,
      todate: filterUser.todate,


    };

    const allFilters = [...additionalFilters, { column: selectedColumn, condition: selectedCondition, value: filterValue }];

    if (allFilters.length > 0 && selectedColumn !== '') {
      queryParams.allFilters = allFilters;
      queryParams.logicOperator = logicOperator;
    } else if (searchQuery) {
      queryParams.searchQuery = searchQuery;
    }

    try {

   let res_hir= await axios.post(SERVICE.NONPRODUCTIONFILTERLIST_HIERARCHY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
  hierachy: "myallhierarchy",
        sector: "all",
        username: isUserRoleAccess.companyname,
        pagename: "menuteamnonproductionlist",
        listpageaccessmode: listpageaccessby,
      });
if(res_hir?.data?.resultAccessFilter.length > 0){
   queryParams.name = res_hir?.data?.resultAccessFilter
      let res_vendor = await axios.post(SERVICE.NONPRODUCTIONFILTERLIST_ASSIGN_TEAM_PAGINATION, queryParams, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setTaskcategorys(
        res_vendor?.data?.lists?.assignlist?.map((item, index) => ({
          ...item,
          serialNumber: (page - 1) * pageSize + index + 1,
        }))
      );
            setTotalProjects(res_vendor?.data?.lists?.assignlist?.length > 0 ? res_vendor?.data?.counts?.assigned : 0);
      setTotalPages(res_vendor?.data?.lists?.assignlist?.length > 0 ? res_vendor?.data?.pagination?.assigned?.totalPages : 0);
      setPageSize(res_vendor?.data?.lists?.assignlist?.length > 0 ? res_vendor?.data?.pagination?.assigned?.pageSize : 10);
      setPage(res_vendor?.data?.lists?.assignlist?.length > 0 ? res_vendor?.data?.pagination?.assigned?.currentPage : 1);
      setTaskcategorycheck(true);
    }
      setTotalProjects( 0);
      setTotalPages(0);
      setPageSize(10);
      setPage(1);
      setTaskcategorycheck(true);

      // console.timeEnd("handleFilterClickForAssign")
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const handleResetSearch = async () => {
    setPageName(!pageName);
    setTaskcategorycheck(false);
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
      base: taskcategory.base,
      fromdate: filterUser.fromdate,
      todate: filterUser.todate,
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

  let res_hir= await axios.post(SERVICE.NONPRODUCTIONFILTERLIST_HIERARCHY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
  hierachy: "myallhierarchy",
        sector: "all",
        username: isUserRoleAccess.companyname,
        pagename: "menuteamnonproductionlist",
        listpageaccessmode: listpageaccessby,
      });
if(res_hir?.data?.resultAccessFilter.length > 0){
   queryParams.name = res_hir?.data?.resultAccessFilter
      let res_vendor = await axios.post(SERVICE.NONPRODUCTIONFILTERLIST_ASSIGN_TEAM_PAGINATION, queryParams, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setTaskcategorys(
        res_vendor?.data?.lists?.assignlist?.map((item, index) => ({
          ...item,
          serialNumber: (page - 1) * pageSize + index + 1,
        }))
      );
            setTotalProjects(res_vendor?.data?.lists?.assignlist?.length > 0 ? res_vendor?.data?.counts?.assigned : 0);
      setTotalPages(res_vendor?.data?.lists?.assignlist?.length > 0 ? res_vendor?.data?.pagination?.assigned?.totalPages : 0);
      setPageSize(res_vendor?.data?.lists?.assignlist?.length > 0 ? res_vendor?.data?.pagination?.assigned?.pageSize : 10);
      setPage(res_vendor?.data?.lists?.assignlist?.length > 0 ? res_vendor?.data?.pagination?.assigned?.currentPage : 1);
      setTaskcategorycheck(true);
    }
      setTotalProjects( 0);
      setTotalPages(0);
      setPageSize(10);
      setPage(1);
      setTaskcategorycheck(true);

      // console.timeEnd("handleFilterClick")
    } catch (err) {
      setTaskcategorycheck(true);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const handleClear = () => {
    setTaskcategory({
      base: 'All',
      category: 'Please Select Category',
      subcategory: 'Please Select Sub Category',
    });
    setFilterUser({
      fromdate: today,
      todate: today,
      day: 'Today',
    });
      setSectorSelection({ label: "Primary", value: "Primary" });
        setModeSelection({ label: "My Hierarchy List", value: "myhierarchy" });
    setselectedcompanyOptionsEdit([]);
    setValueCompanyAdd([]);
    setselectedbranchOptionsEdit([]);
    setValueBranchAdd([]);
    setSubCatOpt([]);
    setTaskcategorys([]);
    setTaskcategorysAssign([]);
    setTaskcategorysall([]);
    setPopupContent('Cleared Successfully');
    setPopupSeverity('success');
    handleClickOpenPopup();
  };
  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Assign List',
    pageStyle: 'print',
  });
  const componentRefAssign = useRef();
  const handleprintAssign = useReactToPrint({
    content: () => componentRefAssign.current,
    documentTitle: 'Approved List',
    pageStyle: 'print',
  });
  const componentRefall = useRef();
  const handleprintall = useReactToPrint({
    content: () => componentRefall.current,
    documentTitle: 'Reject List',
    pageStyle: 'print',
  });

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener('beforeunload', beforeUnloadHandler);
    return () => {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
    };
  }, []);

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String('Non Production List'),
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

  const [selectedcompanyOptionsEdit, setselectedcompanyOptionsEdit] = useState([]);
  const [selectedbranchOptionsEdit, setselectedbranchOptionsEdit] = useState([]);

  let [valueBranchAdd, setValueBranchAdd] = useState('');
  const customValueRendererBranchAdd = (valueBranchAdd, _branches) => {
    return valueBranchAdd.length ? valueBranchAdd.map(({ label }) => label)?.join(',') : <span style={{ color: 'hsl(0, 0%, 20%)' }}>Please Select Sub Category</span>;
  };
  let [valueCompanyAdd, setValueCompanyAdd] = useState('');
  const customValueRendererCompanyAdd = (valueCompanyAdd, _companies) => {
    return valueCompanyAdd.length ? valueCompanyAdd.map(({ label }) => label)?.join(',') : <span style={{ color: 'hsl(0, 0%, 20%)' }}>Please Select Category</span>;
  };

  const handleCompanyChangeAdd = (options) => {
    setValueCompanyAdd(
      options.map((a) => {
        return a.value;
      })
    );
    setselectedcompanyOptionsEdit(options);
    getCategoryAndSubcategory(options);
    setselectedbranchOptionsEdit([]);
  };

  const handleBranchChangeAdd = (options) => {
    setValueBranchAdd(
      options.map((a) => {
        return a.value;
      })
    );
    setselectedbranchOptionsEdit(options);
  };

  const [filterUser, setFilterUser] = useState({
    fromdate: today,
    todate: today,
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

  const [catOpt, setCatOpt] = useState([]);
  const [subCatOpt, setSubCatOpt] = useState([]);
  const getCategory = async () => {
    setPageName(!pageName);
    try {
      let NonProduction = await axios.get(`${SERVICE.NONPRODUCTIONUNITALLOT}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let response = await axios.get(`${SERVICE.CATEGORYANDSUBCATEGORYGETALL}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const CatOptall = [
        ...response?.data?.categoryandsubcategory?.map((t) => ({
          ...t,
          label: t.categoryname,
          value: t.categoryname,
        })),
      ];
      const filterAlloted = NonProduction?.data?.nonproductionunitallot?.filter((item) => item?.employeename?.toLowerCase() === isUserRoleAccess?.companyname?.toLowerCase());
      const CatOpt = filterAlloted?.map((t) => ({
        ...t,
        label: t.category,
        value: t.category,
      }));
      const removeDup = CatOpt.filter((item, index, self) => index === self.findIndex((t) => t.value === item.value));

      if (!isUserRoleAccess.role.includes('Manager')) {
        setCatOpt(removeDup);
      } else {
        setCatOpt(CatOptall);
      }
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const getCategoryAndSubcategory = async (e) => {
    setPageName(!pageName);
    try {
      let NonProduction = await axios.get(`${SERVICE.NONPRODUCTIONUNITALLOT}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let response = await axios.get(`${SERVICE.CATEGORYANDSUBCATEGORYGETALL}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const result = e?.flatMap((t) =>
        t.subcategoryname?.map((name) => ({
          label: name,
          value: name,
        }))
      );

      if (!isUserRoleAccess.role.includes('Manager')) {
        setSubCatOpt(result);
      } else {
        setSubCatOpt(result);
      }
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    getapi();
    getCategory();
    // handleFilterClick()
  }, []);

  useEffect(() => {
    handleFilterClickForAssign();
  }, [page, pageSize, searchQuery]);

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener('beforeunload', beforeUnloadHandler);
    return () => {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
    };
  }, []);
  const [items, setItems] = useState([]);
  const [itemssAssign, setItemsAssign] = useState([]);
  const [itemsall, setItemsall] = useState([]);

  const addSerialNumberApprove = (datas) => {
    setItemsAssign(datas);
  };
  const addSerialNumberall = (datas) => {
    setItemsall(datas);
  };

  const [overallItems, setOverallItems] = useState([]);

  const addSerialNumber = (datas) => {
    setItems(datas);
    setOverallItems(
      datas?.map((item, index) => ({
        ...item,
        id: item._id,
      }))
    );
  };

  useEffect(() => {
    addSerialNumber(taskcategorys);
  }, [taskcategorys]);

  useEffect(() => {
    addSerialNumberApprove(taskcategorysAssign);
  }, [taskcategorysAssign]);

  useEffect(() => {
    addSerialNumberall(taskcategorysall);
  }, [taskcategorysall]);

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setSelectedRows([]);
    // setSelectAllChecked(false)
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
    { field: 'name', headerName: 'Name', flex: 0, width: 100, hide: !columnVisibility.name, headerClassName: 'bold-header', pinned: 'left' },
    { field: 'category', headerName: 'Category', flex: 0, width: 130, hide: !columnVisibility.category, headerClassName: 'bold-header', pinned: 'left' },
    { field: 'subcategory', headerName: 'Sub Category', flex: 0, width: 130, hide: !columnVisibility.subcategory, headerClassName: 'bold-header', pinned: 'left' },
    { field: 'mode', headerName: 'Mode', flex: 0, width: 130, hide: !columnVisibility.mode, headerClassName: 'bold-header' },
    { field: 'date', headerName: 'Date', flex: 0, width: 130, hide: !columnVisibility.date, headerClassName: 'bold-header' },
    { field: 'allotdays', headerName: 'Allot Min Days', flex: 0, width: 130, hide: !columnVisibility.allotdays, headerClassName: 'bold-header' },
    { field: 'allothours', headerName: 'Allot Min Hours', flex: 0, width: 130, hide: !columnVisibility.allothours, headerClassName: 'bold-header' },
    { field: 'allotmins', headerName: 'Allot Min Minutes', flex: 0, width: 130, hide: !columnVisibility.allotmins, headerClassName: 'bold-header' },
    { field: 'days', headerName: 'Allot Max Days', flex: 0, width: 130, hide: !columnVisibility.days, headerClassName: 'bold-header' },
    { field: 'hours', headerName: 'Allot Max Hours', flex: 0, width: 130, hide: !columnVisibility.hours, headerClassName: 'bold-header' },
    { field: 'minutes', headerName: 'Allot Max Minutes', flex: 0, width: 130, hide: !columnVisibility.minutes, headerClassName: 'bold-header' },
    { field: 'count', headerName: 'Count', flex: 0, width: 130, hide: !columnVisibility.count, headerClassName: 'bold-header' },
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
          {isUserRoleCompare?.includes('eteamnonproductionlist') && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.data.id, 'approve');
              }}
            >
              Approve
            </Button>
          )}
          {isUserRoleCompare?.includes('eteamnonproductionlist') && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                getCode(params.data.id, 'reject');
              }}
            >
              Reject
            </Button>
          )}
        </Grid>
      ),
    },
  ];

  const filteredSelectedColumn = columnDataTable.filter((data) => data.field !== 'checkbox' && data.field !== 'actions' && data.field !== 'serialNumber');

  const rowDataTable = filteredDatas.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      name: item.name,
      category: item.category,
      subcategory: item.subcategory,
      mode: item.mode,
      date: item.date,
      allotdays: item.alloteddays,
      allothours: item.allotedhours,
      allotmins: item.allotedminutes,
      days: item.days,
      hours: item.hours,
      minutes: item.minutes,
      count: item.count,
    };
  });

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

  const BaseOpt = [
    { label: 'All', value: 'All' },
    { label: 'Time', value: 'Time' },
    { label: 'Count', value: 'Count' },
  ];
  //add function
  const [isOpenApprove, setIsOpenApprove] = useState(false);
  const handleClickOpenApprove = () => {
    setIsOpenApprove(true);
  };
  const handleCloseApprove = () => {
    setIsOpenApprove(false);
  };
  const sendApproveRequest = async (isApproved) => {
    setPageName(!pageName);
    try {
      let subprojectscreate = await axios.put(`${SERVICE.NONPRODUCTION_SINGLE}/${nonProduction._id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        name: String(nonProduction.name),
        category: String(nonProduction.category),
        subcategory: String(nonProduction.subcategory),
        mode: String(nonProduction.mode),
        count: String(nonProduction.count),
        date: String(nonProduction.date),
        fromtime: String(nonProduction.fromtime),
        totime: String(nonProduction.totime),
        totalhours: String(nonProduction.totalhours),
        alloteddays: String(nonProduction.alloteddays),
        allotedhours: String(nonProduction.allotedhours),
        allotedminutes: String(nonProduction.allotedhours),
        days: String(nonProduction.days),
        hours: String(nonProduction.hours),
        minutes: String(nonProduction.minutes),
        approvestatus: Boolean(isApproved),
        addedby: [
          {
            name: String(username),
            // date: String(new Date(serverTime)),
          },
        ],
      });
      handleCloseApprove();
      handleCloseReject();
      await handleFilterClickForAssign();
      if (isApproved) {
        setPopupContent('Assigned Successfully');
        setPopupSeverity('success');
        handleClickOpenPopup();
      } else {
        setPopupContent('Rejected Successfully');
        setPopupSeverity('success');
        handleClickOpenPopup();
      }
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  return (
    <Box>
      <Headtitle title={'Team Non Production List'} />
      {/* ****** Header Content ****** */}
      <PageHeading title="Non Production List" modulename="Production" submodulename="Non Production" mainpagename="Non-production Setup" subpagename="Non Production List" subsubpagename="" />
      {isUserRoleCompare?.includes('ateamnonproductionlist') && (
        <>
          <Box sx={userStyle.dialogbox}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>Team Non Production Filter List</Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                {listpageaccessby === "Reporting to Based" ? (
                                           <Grid item lg={2} md={2.5} xs={12} sm={6}>
                                               <TextField readOnly size="small" value={listpageaccessby} />
                                           </Grid>
                                       ) : (
                                           <>
                                               <Grid item lg={2} md={2.5} xs={12} sm={6}>
                                                   <Selects
                                                       options={modeDropDowns}
                                                       styles={colourStyles}
                                                       value={{
                                                           label: modeselection.label,
                                                           value: modeselection.value,
                                                       }}
                                                       onChange={(e) => {
                                                           setModeSelection(e);
                                                       }}
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
                                                       onChange={(e) => {
                                                           setSectorSelection(e);
                                                       }}
                                                   />
                                               </Grid>
                                           </>
                                       )}
                <Grid item md={2} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    {/* <Typography sx={{ fontWeight: '500' }}>Days</Typography> */}
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
                <Grid item md={2} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    {/* <Typography> From Date</Typography> */}
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
                <Grid item md={2} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    {/* <Typography>To Date</Typography> */}
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
                <Grid item md={3} xs={12} sm={12} sx={{ marginTop: '24px' }}>
                  <Button
                    sx={buttonStyles.buttonsubmit}
                    onClick={() => {
                      handleFilterClick();
                      handleFilterClickForExports();
                    }}
                  >
                    Filter
                  </Button>
                  &nbsp;
                  <Button sx={buttonStyles.buttonsubmit} onClick={handleClear}>
                    Clear
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
        </>
      )}
      <br />
      {/* ****** Table 1 Start ****** */}
      {isUserRoleCompare?.includes('lteamnonproductionlist') && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>Assign List</Typography>
            </Grid>
            <br />
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
                    <MenuItem value={totalProjects?.length}>All</MenuItem>
                  </Select>
                </Box>
              </Grid>
              <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Box>
                  {isUserRoleCompare?.includes('excelteamnonproductionlist') && (
                    <>
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
                    </>
                  )}
                  {isUserRoleCompare?.includes('csvteamnonproductionlist') && (
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
                  {isUserRoleCompare?.includes('printteamnonproductionlist') && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes('pdfteamnonproductionlist') && (
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
                  {isUserRoleCompare?.includes('imageteamnonproductionlist') && (
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
                  itemsList={taskcategorys}
                />
              </>
            )}
          </Box>
        </>
      )}

      <ListApproved
        listapproved={taskcategorysAssign}
        taskcategoryCheckApproved={taskcategoryCheck}
        totalProjectsApprovedval={totalProjectsApproved}
        totalPagesApprovedval={totalPagesApproved}
        pageApprovedval={pageApproved}
        pageSizeApproveval={pageSizeApprove}
        base={taskcategory.base}
        category={valueCompanyAdd}
        subcategory={valueBranchAdd}
        fromdate={filterUser.fromdate}
        todate={filterUser.todate}
        taskcategorysAssignExports={taskcategorysAssignExports}
      />
      <ListRejected
        listrejected={taskcategorysall}
        taskcategoryCheckrejected={taskcategoryCheck}
        totalProjectsRejectedval={totalProjectsRejected}
        totalPagesRejectedval={totalPagesRejected}
        pageRejectedval={pageReject}
        pageSizeRejectedval={pagesizeReject}
        base={taskcategory.base}
        category={valueCompanyAdd}
        subcategory={valueBranchAdd}
        fromdate={filterUser.fromdate}
        todate={filterUser.todate}
        taskcategorysallExports={taskcategorysallExports}
      />
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
                        handleFilterClickForAssign();
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

      {/* Reject DIALOG */}
      <Box sx={{ width: '350px' }}>
        <Dialog open={isOpenReject} onClose={handleCloseReject} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
            {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} /> */}
            <Typography variant="h6">{showAlert}</Typography>
          </DialogContent>
          <DialogActions>
            <Button
              sx={buttonStyles.buttonsubmit}
              onClick={() => {
                sendApproveRequest(false);
              }}
            >
              ok
            </Button>
            &nbsp;
            <Button
              sx={buttonStyles.btncancel}
              onClick={() => {
                handleCloseReject();
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      {/* Approve DIALOG */}
      <Box sx={{ width: '350px' }}>
        <Dialog open={isOpenApprove} onClose={handleCloseApprove} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
            {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} /> */}
            <Typography variant="h6">{showAlert}</Typography>
          </DialogContent>
          <DialogActions>
            <Button
              sx={buttonStyles.buttonsubmit}
              onClick={() => {
                sendApproveRequest(true);
              }}
            >
              ok
            </Button>
            &nbsp;
            <Button
              sx={buttonStyles.btncancel}
              onClick={() => {
                handleCloseApprove();
              }}
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
      <ExportData
        isFilterOpen={isFilterOpen}
        handleCloseFilterMod={handleCloseFilterMod}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpen}
        isPdfFilterOpen={isPdfFilterOpen}
        setIsPdfFilterOpen={setIsPdfFilterOpen}
        handleClosePdfFilterMod={handleClosePdfFilterMod}
        filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
        itemsTwo={taskcategorysForExports ?? []}
        filename={'Assign List'}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      <AlertDialog openPopup={openPopup} handleClosePopup={handleClosePopup} popupContent={popupContent} popupSeverity={popupSeverity} />
      {/* EXTERNAL COMPONENTS -------------- END */}

      <MessageAlert openPopup={openPopupMalert} handleClosePopup={handleClosePopupMalert} popupContent={popupContentMalert} popupSeverity={popupSeverityMalert} />
    </Box>
  );
}
export default NonproductionList;
