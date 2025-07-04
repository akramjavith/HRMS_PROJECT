import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import ImageIcon from '@mui/icons-material/Image';
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, FormControl, FormControlLabel, Grid, IconButton, InputAdornment, List, ListItem, ListItemText, MenuItem, OutlinedInput, Popover, Radio, RadioGroup, Select, TextField, Tooltip, Typography } from '@mui/material';
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
import { useReactToPrint } from 'react-to-print';
import AggridTableForPaginationTable from '../../../components/AggridTableForPaginationTable.js';
import AlertDialog from '../../../components/Alert';
import { handleApiError } from '../../../components/Errorhandling';
import ExportData from '../../../components/ExportData';
import MessageAlert from '../../../components/MessageAlert';
import { AuthContext, UserRoleAccessContext } from '../../../context/Appcontext';
import { userStyle } from '../../../pageStyle';
import { SERVICE } from '../../../services/Baseservice';
import { getCurrentServerTime } from '../../../components/getCurrentServerTime';


function ListRejected({ listrejected, taskcategoryCheckrejected, totalProjectsRejectedval, totalPagesRejectedval, base, category, subcategory, fromdate, todate, taskcategorysallExports }) {

  const [serverTime, setServerTime] = useState(null);
  useEffect(() => {
    const fetchTime = async () => {
      const time = await getCurrentServerTime();
      setServerTime(time);
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

  const [totalProjectsRejected, setTotalProjectsRejected] = useState(0);
  const [totalPagesRejected, setTotalPagesRejected] = useState(0);

  var today = new Date(serverTime);
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + '-' + mm + '-' + dd;

  const [filteredRowDataAssign, setFilteredRowDataAssign] = useState([]);
  const [filteredChangesAssign, setFilteredChangesAssign] = useState(null);

  const [filteredRowDataReject, setFilteredRowDataReject] = useState([]);
  const [filteredChangesReject, setFilteredChangesReject] = useState(null);

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
  const [isFilterOpenone, setIsFilterOpenone] = useState(false);
  const [isPdfFilterOpenone, setIsPdfFilterOpenone] = useState(false);
  // page refersh reload
  const handleCloseFilterModone = () => {
    setIsFilterOpenone(false);
  };
  const handleClosePdfFilterModone = () => {
    setIsPdfFilterOpenone(false);
  };
  const [isFilterOpentwo, setIsFilterOpentwo] = useState(false);
  const [isPdfFilterOpentwo, setIsPdfFilterOpentwo] = useState(false);
  // page refersh reload
  const handleCloseFilterModtwo = () => {
    setIsFilterOpentwo(false);
  };
  const handleClosePdfFilterModtwo = () => {
    setIsPdfFilterOpentwo(false);
  };

  const [searchedString, setSearchedString] = useState('');
  const [searchedStringApprove, setSearchedStringApprove] = useState('');
  const [searchedStringReject, setSearchedStringReject] = useState('');
  const gridRefTable = useRef(null);
  const gridRefTableAssigned = useRef(null);
  const gridRefTableReject = useRef(null);

  const [isHandleChange, setIsHandleChange] = useState(false);
  const [isHandleChangeApproved, setIsHandleChangeApproved] = useState(false);
  const [isHandleChangeReject, setIsHandleChangeReject] = useState(false);

  const [fileFormat, setFormat] = useState('');
  const [fileFormatone, setFormatone] = useState('');
  const [fileFormattwo, setFormattwo] = useState('');

  const [taskcategorys, setTaskcategorys] = useState([]);
  const [taskcategorysAssign, setTaskcategorysAssign] = useState([]);
  const [taskcategorysall, setTaskcategorysall] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchQueryAssign, setSearchQueryAssign] = useState('');
  const [searchQueryall, setSearchQueryall] = useState('');
  const { isUserRoleCompare, isUserRoleAccess,listPageAccessMode, isAssignBranch, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);


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

  const gridRefTableImgApprove = useRef(null);

  const handleCaptureImageAssign = () => {
    if (gridRefTableImgApprove.current) {
      domtoimage
        .toBlob(gridRefTableImgApprove.current)
        .then((blob) => {
          saveAs(blob, 'Approved List.png');
        })
        .catch((error) => {
          console.error('dom-to-image error: ', error);
        });
    }
  };

  const gridRefTableImgReject = useRef(null);

  const handleCaptureImageAll = () => {
    if (gridRefTableImgReject.current) {
      domtoimage
        .toBlob(gridRefTableImgReject.current)
        .then((blob) => {
          saveAs(blob, 'Reject List.png');
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
  const handleOpenManageColumnsAssign = (event) => {
    setAnchorElAssign(event.currentTarget);
    setManageColumnsOpenAssign(true);
  };
  const handleOpenManageColumnsall = (event) => {
    setAnchorElall(event.currentTarget);
    setManageColumnsOpenall(true);
  };
  const handleCloseManageColumns = () => {
    setManageColumnsOpen(false);
    setSearchQueryManage('');
  };
  const handleCloseManageColumnsAssign = () => {
    setManageColumnsOpenAssign(false);
    setSearchQueryManageAssign('');
  };
  const handleCloseManageColumnsall = () => {
    setManageColumnsOpenall(false);
    setSearchQueryManageall('');
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
  // Show All Columns & Manage Columns
  const initialColumnVisibilityAssign = {
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
    // reason: true,
  };
  const [columnVisibilityAssign, setColumnVisibilityAssign] = useState(initialColumnVisibilityAssign);
  // Show All Columns & Manage Columns
  const initialColumnVisibilityall = {
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
    // reason: true,
    actions: true,
  };
  const [columnVisibilityall, setColumnVisibilityall] = useState(initialColumnVisibilityall);
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
  let exportColumnNamesone = ['Name', 'Category', 'Sub Category', 'Mode', 'Date', 'Allot Min Days', 'Allot Min Hours', 'Allot Min Minutes', 'Allot Max Days', 'Allot Max Hours', 'Allot Max Minutes', 'Count'];
  let exportRowValuesone = ['name', 'category', 'subcategory', 'mode', 'date', 'allotdays', 'allothours', 'allotmins', 'days', 'hours', 'minutes', 'count'];
  let exportColumnNamestwo = ['Name', 'Category', 'Sub Category', 'Mode', 'Date', 'Allot Min Days', 'Allot Min Hours', 'Allot Min Minutes', 'Allot Max Days', 'Allot Max Hours', 'Allot Max Minutes', 'Count'];
  let exportRowValuestwo = ['name', 'category', 'subcategory', 'mode', 'date', 'allotdays', 'allothours', 'allotmins', 'days', 'hours', 'minutes', 'count'];

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
          let showname = columnDataTableall.find((col) => col.field === filter.column)?.headerName;
          return `${showname} ${filter.condition} "${filter.value}"`;
        })
        .join(' ' + (advancedFilter.length > 1 ? advancedFilter[1].condition : '') + ' ');
    }
    return searchQueryall;
  };

  const handleFilterClick = () => {
    setPageName(!pageName);
    setPageSizeReject(10);
    setPageReject(1);
    console.log(listrejected,"851")
    try {
      setTaskcategorysall(listrejected);
      setTaskcategorycheck(taskcategoryCheckrejected);
      setTotalProjectsRejected(listrejected?.length > 0 ? totalProjectsRejectedval : 0);
      setTotalPagesRejected(listrejected?.length > 0 ? totalPagesRejectedval : 0);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const handleFilterClickForRejected = async () => {
    setPageName(!pageName);
    // setPageSizeApprove(10)
    setTaskcategorycheck(false);
    // setPageApproved(1)

    const queryParams = {
      pageReject: Number(pageReject),
      pagesizeReject: Number(pagesizeReject),
      
      fromdate: fromdate,
      todate: todate,

    };

    const allFilters = [...additionalFilters, { column: selectedColumn, condition: selectedCondition, value: filterValue }];

    if (allFilters.length > 0 && selectedColumn !== '') {
      queryParams.allFilters = allFilters;
      queryParams.logicOperator = logicOperator;
    } else if (searchQueryall) {
      queryParams.searchQueryall = searchQueryall;
    }
console.log("abc")
    try {
     let res_hir = await axios.post(SERVICE.NONPRODUCTIONFILTERLIST_HIERARCHY, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          hierachy: "myallhierarchy",
          sector: "all",
          username: isUserRoleAccess.companyname,
          pagename: "menuteamnonproductionlist",
          listpageaccessmode: listpageaccessby,
        });
        if (res_hir?.data?.resultAccessFilter.length > 0) {
    queryParams.name = res_hir?.data?.resultAccessFilter
      let res_vendor = await axios.post(SERVICE.NONPRODUCTIONFILTERLIST_REJECTED_TEAM_PAGINATION, queryParams, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setTaskcategorysall(
        res_vendor?.data?.lists?.rejectlist?.map((item, index) => ({
          ...item,
          serialNumber: (pageReject - 1) * pagesizeReject + index + 1,
        }))
      );

      setTotalProjectsRejected(res_vendor?.data?.lists?.rejectlist?.length > 0 ? res_vendor?.data?.counts?.rejected : 0);
      setTotalPagesRejected(res_vendor?.data?.lists?.rejectlist?.length > 0 ? res_vendor?.data?.pagination?.rejected?.totalPages : 0);
      setPageSizeReject(res_vendor?.data?.lists?.rejectlist?.length > 0 ? res_vendor?.data?.pagination?.rejected?.pageSize : 10);
      setPageReject(res_vendor?.data?.lists?.rejectlist?.length > 0 ? res_vendor?.data?.pagination?.rejected?.currentPage : 1);
      setTaskcategorycheck(true);
    }else{
     setTotalProjectsRejected( 0);
          setTotalPagesRejected(0);
          setPageSizeReject(10);
          setPageReject(1);
          setTaskcategorycheck(true);
    }

      // console.timeEnd("handleFilterClickForAssign")
    } catch (err) {
        console.log(err,"errreject")
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
      pageReject: Number(pageReject),
      pagesizeReject: Number(pagesizeReject),
      
      fromdate: fromdate,
      todate: todate,
    };

    const allFilters = [];
    // Only include advanced filters if they exist, otherwise just use regular searchQueryall
    if (allFilters.length > 0 && selectedColumn !== '') {
      queryParams.allFilters = allFilters;
      queryParams.logicOperator = logicOperator;
    } else if (searchQueryall) {
      queryParams.searchQueryall = searchQueryall; // Use searchQueryall for regular search
    }

    try {
     let res_hir = await axios.post(SERVICE.NONPRODUCTIONFILTERLIST_HIERARCHY, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          hierachy: "myallhierarchy",
          sector: "all",
          username: isUserRoleAccess.companyname,
          pagename: "menuteamnonproductionlist",
          listpageaccessmode: listpageaccessby,
        });
        if (res_hir?.data?.resultAccessFilter.length > 0) {
    queryParams.name = res_hir?.data?.resultAccessFilter
      let res_vendor = await axios.post(SERVICE.NONPRODUCTIONFILTERLIST_REJECTED_TEAM_PAGINATION, queryParams, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setTaskcategorysall(
        res_vendor?.data?.lists?.rejectlist?.map((item, index) => ({
          ...item,
          serialNumber: (pageReject - 1) * pagesizeReject + index + 1,
        }))
      );

      setTotalProjectsRejected(res_vendor?.data?.lists?.rejectlist?.length > 0 ? res_vendor?.data?.counts?.rejected : 0);
      setTotalPagesRejected(res_vendor?.data?.lists?.rejectlist?.length > 0 ? res_vendor?.data?.pagination?.rejected?.totalPages : 0);
      setPageSizeReject(res_vendor?.data?.lists?.rejectlist?.length > 0 ? res_vendor?.data?.pagination?.rejected?.pageSize : 10);
      setPageReject(res_vendor?.data?.lists?.rejectlist?.length > 0 ? res_vendor?.data?.pagination?.rejected?.currentPage : 1);
      setTaskcategorycheck(true);
    }else{
     setTotalProjectsRejected( 0);
          setTotalPagesRejected(0);
          setPageSizeReject(10);
          setPageReject(1);
          setTaskcategorycheck(true);
    }

      // console.timeEnd("handleFilterClickForAssign")
    } catch (err) {
      setTaskcategorycheck(true);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

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
    handleFilterClick();
  }, [listrejected,taskcategoryCheckrejected]);

  useEffect(() => {
    handleFilterClickForRejected();
  }, [pageReject, pagesizeReject, searchQueryall]);

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener('beforeunload', beforeUnloadHandler);
    return () => {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
    };
  }, []);
//   const [items, setItems] = useState([]);
//   const [itemssAssign, setItemsAssign] = useState([]);
  const [itemsall, setItemsall] = useState([]);

//   const addSerialNumberApprove = (datas) => {
//     setItemsAssign(datas);
//   };
  const addSerialNumberall = (datas) => {
    setItemsall(datas);
  };


//   useEffect(() => {
//     addSerialNumber(taskcategorys);
//   }, [taskcategorys]);

//   useEffect(() => {
//     addSerialNumberApprove(taskcategorysAssign);
//   }, [taskcategorysAssign]);

  useEffect(() => {
    addSerialNumberall(taskcategorysall);
  }, [taskcategorysall]);

  const handlePageSizeChangeReject = (event) => {
    setPageSizeReject(Number(event.target.value));
    setSelectedRowsall([]);
    setSelectAllCheckedall(false);
    setPageReject(1);
  };

  const handleSearchChangeall = (event) => {
    setSearchQueryall(event.target.value);
  };
  // Split the search query into individual terms
  const searchTermsall = searchQueryall.toLowerCase().split(' ');

  const filteredDatasalls = itemsall?.filter((item) => {
    return searchTermsall.every((term) => Object.values(item).join(' ').toLowerCase().includes(term));
  });

  const [selectAllCheckedall, setSelectAllCheckedall] = useState(false);
  const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
    <div>
      <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
    </div>
  );

  const columnDataTableall = [
    {
      field: 'serialNumber',
      headerName: 'SNo',
      flex: 0,
      width: 100,
      hide: !columnVisibilityall.serialNumber,
      headerClassName: 'bold-header',
      pinned: 'left',
    },
    { field: 'name', headerName: 'Name', flex: 0, width: 100, hide: !columnVisibilityall.name, headerClassName: 'bold-header', pinned: 'left' },
    { field: 'category', headerName: 'Category', flex: 0, width: 130, hide: !columnVisibilityall.category, headerClassName: 'bold-header', pinned: 'left' },
    { field: 'subcategory', headerName: 'Sub Category', flex: 0, width: 130, hide: !columnVisibilityall.subcategory, headerClassName: 'bold-header', pinned: 'left' },
    { field: 'mode', headerName: 'Mode', flex: 0, width: 130, hide: !columnVisibilityall.mode, headerClassName: 'bold-header' },
    { field: 'date', headerName: 'Date', flex: 0, width: 130, hide: !columnVisibilityall.date, headerClassName: 'bold-header' },
    { field: 'allotdays', headerName: 'Allot Min Days', flex: 0, width: 130, hide: !columnVisibilityall.allotdays, headerClassName: 'bold-header' },
    { field: 'allothours', headerName: 'Allot Min Hours', flex: 0, width: 130, hide: !columnVisibilityall.allothours, headerClassName: 'bold-header' },
    { field: 'allotmins', headerName: 'Allot Min Minutes', flex: 0, width: 130, hide: !columnVisibilityall.allotmins, headerClassName: 'bold-header' },
    { field: 'days', headerName: 'Allot Max Days', flex: 0, width: 130, hide: !columnVisibilityall.days, headerClassName: 'bold-header' },
    { field: 'hours', headerName: 'Allot Max Hours', flex: 0, width: 130, hide: !columnVisibilityall.hours, headerClassName: 'bold-header' },
    { field: 'minutes', headerName: 'Allot Max Minutes', flex: 0, width: 130, hide: !columnVisibilityall.minutes, headerClassName: 'bold-header' },
    { field: 'count', headerName: 'Count', flex: 0, width: 130, hide: !columnVisibilityall.count, headerClassName: 'bold-header' },
  ];

  const filteredSelectedColumn = columnDataTableall.filter((data) => data.field !== 'checkbox' && data.field !== 'actions' && data.field !== 'serialNumber');

  const rowDataTableall = filteredDatasalls.map((item, index) => {
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

  const handleShowAllColumnsall = () => {
    const updatedVisibility = { ...columnVisibilityall };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibilityall(updatedVisibility);
  };

  const filteredColumnsall = columnDataTableall.filter((column) => column.headerName.toLowerCase().includes(searchQueryManageall.toLowerCase()));

  const toggleColumnVisibilityall = (field) => {
    setColumnVisibilityall((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };

  // JSX for the "Manage Columns" popover content
  const manageColumnsContentall = (
    <Box style={{ padding: '10px', minWidth: '325px', '& .MuiDialogContent-root': { padding: '10px 0' } }}>
      <Typography variant="h6">Manage Columns</Typography>
      <IconButton
        aria-label="close"
        onClick={handleCloseManageColumnsall}
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
        <TextField label="Find column" variant="standard" fullWidth value={searchQueryManageall} onChange={(e) => setSearchQueryManageall(e.target.value)} sx={{ marginBottom: 5, position: 'absolute' }} />
      </Box>
      <br />
      <br />
      <DialogContent sx={{ minWidth: 'auto', height: '200px', position: 'relative' }}>
        <List sx={{ overflow: 'auto', height: '100%' }}>
          {filteredColumnsall.map((column) => (
            <ListItem key={column.field}>
              <ListItemText
                sx={{ display: 'flex' }}
                primary={<Switch sx={{ marginTop: '-5px' }} size="small" checked={columnVisibilityall[column.field]} onChange={() => toggleColumnVisibilityall(column.field)} />}
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
            <Button variant="text" sx={{ textTransform: 'none' }} onClick={() => setColumnVisibilityall(initialColumnVisibilityall)}>
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
                columnDataTableall.forEach((column) => {
                  newColumnVisibility[column.field] = false; // Set hide property to true
                });
                setColumnVisibilityall(newColumnVisibility);
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
      await handleFilterClickForRejected();
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
      {/* ****** Header Content ****** */}

      <br />
      {/* ****** Table 2 Start ****** */}
      {isUserRoleCompare?.includes('lnonproductionlist') && (
        <>
          <Box sx={userStyle.container}>
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>Reject List</Typography>
            </Grid>
            <br />
            <Grid container spacing={2} style={userStyle.dataTablestyle}>
              <Grid item md={2} xs={12} sm={12}>
                <Box>
                  <label>Show entries:</label>
                  <Select
                    id="pageSizeSelect"
                    value={pagesizeReject}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 180,
                          width: 80,
                        },
                      },
                    }}
                    onChange={handlePageSizeChangeReject}
                    sx={{ width: '77px' }}
                  >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                    <MenuItem value={totalProjectsRejected?.length}>All</MenuItem>
                  </Select>
                </Box>
              </Grid>
              <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Box>
                  {isUserRoleCompare?.includes('excelnonproductionlist') && (
                    <>
                      <Button
                        onClick={(e) => {
                          setIsFilterOpentwo(true);
                          setFormattwo('xl');
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileExcel />
                        &ensp;Export to Excel&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes('csvnonproductionlist') && (
                    <>
                      <Button
                        onClick={(e) => {
                          setIsFilterOpentwo(true);
                          setFormattwo('csv');
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileCsv />
                        &ensp;Export to CSV&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes('printnonproductionlist') && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprintall}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes('pdfnonproductionlist') && (
                    <>
                      <Button
                        sx={userStyle.buttongrp}
                        onClick={() => {
                          setIsPdfFilterOpentwo(true);
                        }}
                      >
                        <FaFilePdf />
                        &ensp;Export to PDF&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes('imagenonproductionlist') && (
                    <Button sx={userStyle.buttongrp} onClick={handleCaptureImageAll}>
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
                    onChange={handleSearchChangeall}
                    placeholder="Type to search..."
                    disabled={!!advancedFilter}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <br />
            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumnsall}>
              Show All Columns
            </Button>
            &ensp;
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsall}>
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
                  rowDataTable={rowDataTableall}
                  columnDataTable={columnDataTableall}
                  columnVisibility={columnVisibilityall}
                  page={pageReject}
                  setPage={setPageReject}
                  pageSize={pagesizeReject}
                  totalPages={totalPagesRejected}
                  setColumnVisibility={setColumnVisibilityall}
                  selectedRows={selectedRowsall}
                  setSelectedRows={setSelectedRowsall}
                  gridRefTable={gridRefTableReject}
                  totalDatas={totalProjectsRejected}
                  setFilteredRowData={setFilteredRowDataReject}
                  filteredRowData={filteredRowDataReject}
                  gridRefTableImg={gridRefTableImgReject}
                  itemsList={taskcategorysall}
                />
              </>
            )}
          </Box>
        </>
      )}

      {/* Manage Column */}
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
                        handleFilterClickForRejected();
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
        open={isManageColumnsOpenall}
        anchorEl={anchorElall}
        onClose={handleCloseManageColumnsall}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        {manageColumnsContentall}
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

      <AlertDialog openPopup={openPopup} handleClosePopup={handleClosePopup} popupContent={popupContent} popupSeverity={popupSeverity} />
      {/* EXTERNAL COMPONENTS -------------- END */}

      <ExportData
        isFilterOpen={isFilterOpentwo}
        handleCloseFilterMod={handleCloseFilterModtwo}
        fileFormat={fileFormattwo}
        setIsFilterOpen={setIsFilterOpentwo}
        isPdfFilterOpen={isPdfFilterOpentwo}
        setIsPdfFilterOpen={setIsPdfFilterOpentwo}
        handleClosePdfFilterMod={handleClosePdfFilterModtwo}
        filteredDataTwo={(filteredChangesReject !== null ? filteredRowDataReject : rowDataTableall) ?? []}
        // filteredDataTwo={rowDataTableall ?? []}
        itemsTwo={taskcategorysallExports ?? []}
        filename={'Reject List'}
        exportColumnNames={exportColumnNamestwo}
        exportRowValues={exportRowValuestwo}
        componentRef={componentRefall}
      />
      <MessageAlert openPopup={openPopupMalert} handleClosePopup={handleClosePopupMalert} popupContent={popupContentMalert} popupSeverity={popupSeverityMalert} />
    </Box>
  );
}
export default ListRejected;
