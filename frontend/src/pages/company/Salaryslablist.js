import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Paper,
  Popover,
  Radio,
  RadioGroup,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import Switch from '@mui/material/Switch';
import axios from 'axios';
import domtoimage from 'dom-to-image';
import * as FileSaver from 'file-saver';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment-timezone';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint, FaSearch } from 'react-icons/fa';
import { IoMdOptions } from 'react-icons/io';
import { MdClose } from 'react-icons/md';
import { ThreeDots } from 'react-loader-spinner';
import Selects from 'react-select';
import { useReactToPrint } from 'react-to-print';
import * as XLSX from 'xlsx';
import AggridTableForPaginationTable from '../../components/AggridTableForPaginationTable.js';
import AlertDialog from '../../components/Alert';
import { handleApiError } from '../../components/Errorhandling';
import ExportData from '../../components/ExportData';
import Headtitle from '../../components/Headtitle';
import MessageAlert from '../../components/MessageAlert';
import PageHeading from '../../components/PageHeading';
import { StyledTableCell, StyledTableRow } from '../../components/Table';
import { AuthContext, UserRoleAccessContext } from '../../context/Appcontext';
import { colourStyles, userStyle } from '../../pageStyle';
import { SERVICE } from '../../services/Baseservice';
import { LoadingButton } from '@mui/lab';
import { MultiSelect } from 'react-multi-select-component';

function SalarySlabList() {
  let exportColumnNames = ['Company', 'Branch', 'Process Queue',
    'Salary Code', 'Basic', 'HRA', 'Conveyance',
    'Medical Allowance', 'Production Allowance',
    'Production Allowance 2', 'Other Allowance',
    'Shift Allowance', 'ESI Deduction', 'PF Deduction',
    'ESI Employee Percentage', 'ESI Employer Percentage', 'PF Employee Percentage',

    'PF Employer Percentage', 'EPF Contribution', 'EPS Pension', 'EDLI Insurance',

    'EPF Admin Charges'


  ];
  let exportRowValues = ['company', 'branch',
    'processqueue', 'salarycode', 'basic', 'hra', 'conveyance',
    'medicalallowance', 'productionallowance', 'productionallowancetwo',
    'otherallowance', 'shiftallowance', 'esideduction', 'pfdeduction',
    'esiemployeepercentage', 'esipercentage', 'pfemployeepercentage', 'pfpercentage',
    'epfcontribution', 'epspension', 'edliinsurance', 'epfadmincharges'

  ];
  const [iteration, setIteration] = useState(0);
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);

  const [overallItems, setOverallItems] = useState([]);

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
  const [openPopup, setOpenPopup] = useState(false);
  const [popupContent, setPopupContent] = useState('');
  const [popupSeverity, setPopupSeverity] = useState('');
  const handleClickOpenPopup = () => {
    setOpenPopup(true);
  };
  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const [loading, setLoading] = useState(false);

  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState('');
  const [selectedprocess, setSelectedprocess] = useState('');
  const [selectedprocessedit, setSelectedprocessedit] = useState('');
  const [selectedprocessqueuedit, setSelectedprocessqueueedit] = useState('Please Select Process');

  // const [isFilterOpen, setIsFilterOpen] = useState(false);
  // const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

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
      pagename: String('Salary Slab List'),
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

  const [salaryexport, setSalaryExport] = useState([]);
  const SalaryExport = async () => {
    let companies = selectedOptionsCom?.map((item) => item.value);
    let branches = selectedOptionsBran?.map((item) => item.value);
    let process = selectedOptionsUnit?.map((item) => item.value);

    let res = axios.post(SERVICE.SALARYSLAB_EXPORT, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      assignbranch: accessbranch,

      companies: companies,
      branches: branches,
      process: process,
    });
    setSalaryExport(res?.data?.salaryslab);
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Salary Slab',
    pageStyle: 'print',
  });

  // useEffect(() => {
  //   SalaryExport()
  // }, [isFilterOpen, isPdfFilterOpen])

  const [isBtn, setIsBtn] = useState(false);

  // company
  const [selectedOptionsCom, setSelectedOptionsCom] = useState([]);
  let [valueComp, setValueComp] = useState('');

  const handleCompanyChange = (options) => {
    setValueComp(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCom(options);
  };

  const customValueRendererCom = (valueComp, _companys) => {
    return valueComp.length ? valueComp.map(({ label }) => label).join(', ') : 'Please Select Company';
  };

  // branch
  const [selectedOptionsBran, setSelectedOptionsBran] = useState([]);
  let [valueBran, setValueBran] = useState('');

  const handleBranchChange = async (options) => {
    setValueBran(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsBran(options);

    try {
      let res = await axios.get(SERVICE.ALL_PROCESSQUEUENAME, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let companies = selectedOptionsCom?.map((item) => item.value);
      let branches = options?.map((item) => item.value);
      // Filter and map the process queue names
      let filteredDatas = res?.data?.processqueuename
        ?.filter((data) => companies?.includes(data?.company) && branches?.includes(data?.branch))
        ?.map((data) => ({
          label: data?.name,
          value: data?.name,
        }));

      // Remove duplicates based on 'label'
      let uniqueFilteredDatas = Array.from(new Map(filteredDatas.map((item) => [item.label, item])).values());

      // Set the filtered and unique data in state
      setProcessOptions(uniqueFilteredDatas);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const customValueRendererBran = (valueBran, _branchs) => {
    return valueBran.length ? valueBran.map(({ label }) => label).join(', ') : 'Please Select Branch';
  };

  // unit
  const [selectedOptionsUnit, setSelectedOptionsUnit] = useState([]);
  let [valueUnit, setValueUnit] = useState('');

  const handleUnitChange = (options) => {
    setValueUnit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsUnit(options);
  };

  const customValueRendererUnit = (valueUnit, _units) => {
    return valueUnit.length ? valueUnit.map(({ label }) => label).join(', ') : 'Please Select Process';
  };

  const [btnSubmit, setBtnSubmit] = useState(false);
  const handleSubmit = (e) => {
    setIsBtn(true);
    if (selectedOptionsCom.length == 0) {
      setPopupContentMalert('Please Select Company');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else {
      setSearchQuery('');
      fetchEmployee('Filtered');
    }
  };

  const handleClear = () => {
    setValueComp([]);
    setValueBran([]);
    setValueUnit([]);
    setSelectedOptionsCom([]);
    setSelectedOptionsBran([]);
    setSelectedOptionsUnit([]);
    setPopupContent('Cleared Successfully');
    setPopupSeverity('success');
    handleClickOpenPopup();
    setSearchQuery('');
    setSalarySlabArray([]);
    setOverallFilterdata([]);
    setOverallItems([]);
    setPage(1);
    setPageSize(10);
    setTotalDatas(0);
    setTotalPages(0);
  };

  let companies = selectedOptionsCom?.map((item) => item.value);
  let branches = selectedOptionsBran?.map((item) => item.value);
  let process = selectedOptionsUnit?.map((item) => item.value);

  //20.11.2024-------------------------------------------------------------------------------------------------------------------
  const [advancedFilter, setAdvancedFilter] = useState(null);

  const [logicOperator, setLogicOperator] = useState('AND');

  const [selectedColumn, setSelectedColumn] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('Contains');
  const [filterValue, setFilterValue] = useState('');
  const [additionalFilters, setAdditionalFilters] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const conditions = ['Contains', 'Does Not Contain', 'Equals', 'Does Not Equal', 'Begins With', 'Ends With', 'Blank', 'Not Blank']; // AgGrid-like conditions

  // Search bar
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

  // Show filtered combination in the search bar
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

  // // page refersh reload
  // const handleCloseFilterMod = () => {
  //   setIsFilterOpen(false);
  // };

  // const handleClosePdfFilterMod = () => {
  //   setIsPdfFilterOpen(false);
  // };

  const [salarySlab, setSalarySlab] = useState({
    company: 'Please Select Company',
    branch: 'Please Select Branch',
    processqueue: 'Please Select Process',
    checkinput: '',
    salarycode: '',
    basic: '',
    hra: '',
    conveyance: '',
    medicalallowance: '',
    productionallowance: '',
    productionallowancetwo: '',
    otherallowance: '',
    shiftallowance: '',
    esideduction: false,
    esipercentage: '',
    esimaxsalary: '',
    esiemployeepercentage: '',
    pfdeduction: false,
    pfpercentage: '',
    epspercentage: '',

    pfemployeepercentage: '',
  });
  const [salarySlabEdit, setSalarySlabEdit] = useState({
    company: 'Please Select Company',
    branch: 'Please Select Branch',
    processqueue: 'Please Select Process',
    checkinput: '',
    salarycode: '',
    basic: '',
    hra: '',
    conveyance: '',
    medicalallowance: '',
    productionallowance: '',
    productionallowancetwo: '',
    otherallowance: '',
    shiftallowance: '',
    esideduction: false,
    esipercentage: '',
    esimaxsalary: '',
    esiemployeepercentage: '',
    pfdeduction: false,
    pfpercentage: '',
    epspercentage: "",
    pfemployeepercentage: '',
    pfemployeepercentage: 0,
    pfpercentage: 0,
    epspercentage: 0,
    esipercentage: 0,
    esimaxsalary: 0,
    esiemployeepercentage: 0,
    pfemployerpercentage: 0,
    productionallowancetwo: 0,
    pfemployeepercentage: 0,
    esiemployerpercentage: 0,
    esiemployeepercentage: 0,
    otherallowance: 0,
    epspension: 0,
    epfadmincharges: 0,
    shiftallowance: 0,
    edliinsurance: 0,
  });
  const [salarySlabArray, setSalarySlabArray] = useState([]);
  const [companyOption, setCompanyOption] = useState([]);
  const [branchOption, setBranchOption] = useState([]);
  const [branchOptionEdit, setBranchOptionEdit] = useState([]);
  const { isUserRoleCompare, isUserRoleAccess, isAssignBranch, allUsersData, allUnit, allTeam, allCompany, allBranch, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);
  const [loader, setLoader] = useState(true);

  console.log(salarySlabArray, 'salarySlabArray');

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

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [isErrorOpensalary, setIsErrorOpenSalary] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [openview, setOpenview] = useState(false);
  const [openInfo, setOpeninfo] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteSalarySlab, setDeleteSalarySlab] = useState({});
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [salarySlabData, setSalarySlabData] = useState([]);
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [allSalarySlabEdit, setAllSalarySlabEdit] = useState([]);
  const [copiedData, setCopiedData] = useState('');
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const [processQueueArray, setProcessQueueArray] = useState([]);
  const [processQueueArrayedit, setProcessQueueArrayEdit] = useState([]);

  //  Datefield
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  today = dd + '-' + mm + '-' + yyyy;

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    company: true,
    branch: true,
    processqueue: true,
    salarycode: true,
    basic: true,
    hra: true,
    conveyance: true,
    medicalallowance: true,
    productionallowance: true,
    productionallowancetwo: true,
    otherallowance: true,
    shiftallowance: true,
    esideduction: true,
    pfdeduction: true,

    esiemployeepercentage: true,
    esipercentage: true,
    pfemployeepercentage: true,
    pfpercentage: true,
    epfcontribution: true,
    epspension: true,
    edliinsurance: true,
    epfadmincharges: true,

    actions: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

  //useEffect
  useEffect(() => {
    addSerialNumber(salarySlabArray);
  }, [salarySlabArray]);

  // useEffect(() => {
  //   getexcelDatas();
  // }, [salarySlabArray]);
  // useEffect(() => {
  //   fetchsalaryedit();
  // }, [isEditOpen, salarySlabEdit]);

  useEffect(() => {
    fetchCompany();
  }, []);

  useEffect(() => {
    if (items.length > 0) {
      fetchEmployee('Filtered');
    }
  }, [isEditOpen, salarySlabEdit]);

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener('beforeunload', beforeUnloadHandler);
    return () => {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
    };
  }, []);
  useEffect(() => {
    // Retrieve column visibility from localStorage (if available)
    const savedVisibility = localStorage.getItem('columnVisibility');
    if (savedVisibility) {
      setColumnVisibility(JSON.parse(savedVisibility));
    }
  }, []);
  useEffect(() => {
    // Save column visibility to localStorage whenever it changes
    localStorage.setItem('columnVisibility', JSON.stringify(columnVisibility));
  }, [columnVisibility]);

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  // Error Popup model
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };

  // Error Popup model saalryslab
  const handleClickOpenerrSalary = () => {
    setIsErrorOpenSalary(true);
  };
  const handleCloseerrSalary = () => {
    setIsErrorOpenSalary(false);
    fetchEmployee('Filtered');
  };

  // view model
  const handleClickOpenview = () => {
    setOpenview(true);
  };
  const handleCloseview = () => {
    setOpenview(false);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
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
  // page refersh reload
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ''; // This is required for Chrome support
  };
  const username = isUserRoleAccess.username;
  // Manage Columns
  const handleOpenManageColumns = (event) => {
    setAnchorEl(event.currentTarget);
    setManageColumnsOpen(true);
  };
  const handleCloseManageColumns = () => {
    setManageColumnsOpen(false);
    setSearchQueryManage('');
  };
  //Delete model
  const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);

  const handleClickOpencheckbox = () => {
    setIsDeleteOpencheckbox(true);
  };
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
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const getRowClassName = (params) => {
    if (selectedRows.includes(params.row.id)) {
      return 'custom-id-row'; // This is the custom class for rows with item.tat === 'ago'
    }
    return ''; // Return an empty string for other rows
  };

  const fetchCompany = async () => {
    setPageName(!pageName);
    try {
      let res_category = await axios.get(SERVICE.COMPANY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const companyall = [
        { label: 'ALL', value: 'ALL' },
        ...res_category?.data?.companies.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];

      setCompanyOption(companyall);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const [processOptions, setProcessOptions] = useState([]);

  const fetchBranchEdit = async (e) => {
    setPageName(!pageName);
    try {
      let res_branch = await axios.get(SERVICE.BRANCH, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let data_set = e.toUpperCase() === 'ALL' ? res_branch.data.branch : res_branch.data.branch.filter((data) => data.company === e);

      const branchall = [
        { label: 'ALL', value: 'ALL' },
        ...data_set.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];

      setBranchOptionEdit(branchall);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const fetchProcessQueueEdit = async (e) => {
    setPageName(!pageName);
    try {
      let res_freq = await axios.get(SERVICE.ALL_PROCESSQUEUENAME, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let data_set = e.toUpperCase() === 'ALL' ? res_freq?.data?.processqueuename : res_freq?.data?.processqueuename.filter((data) => data.branch === e);

      const branchall = [
        ...data_set.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];
      setProcessQueueArrayEdit(branchall);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //set function to get particular row
  const rowData = async (id) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SINGLE_SALARYSLAB}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeleteSalarySlab(res?.data?.ssalaryslab);

      handleClickOpen();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  // Alert delete popup
  let taxid = deleteSalarySlab._id;
  const deltax = async () => {
    setPageName(!pageName);
    try {
      await axios.delete(`${SERVICE.SINGLE_SALARYSLAB}/${taxid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      handleCloseMod();
      setSelectedRows([]);
      setPage(1);
      handleResetSearch();
      setPopupContent('Deleted Successfully');
      setPopupSeverity('success');
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //Edit model...
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === 'backdropClick') return;
    setIsEditOpen(false);
  };
  //get single row to edit....
  const getCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SINGLE_SALARYSLAB}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSalarySlabEdit(res?.data?.ssalaryslab);
      console.log(res?.data?.ssalaryslab);
      setSelectedprocessedit(res?.data?.ssalaryslab.checkinput == 'input' ? res?.data?.ssalaryslab.processqueue : '');
      setSelectedprocessqueueedit(res?.data?.ssalaryslab.checkinput == 'dropdown' ? res?.data?.ssalaryslab.processqueue : '');
      await fetchBranchEdit(res?.data?.ssalaryslab?.company);
      await fetchProcessQueueEdit(res?.data?.ssalaryslab?.branch);

      handleClickOpenEdit();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // const fetchsalaryedit = async (e) => {
  //   let res_freq = await axios.get(SERVICE.ALL_SALARYSLAB, {
  //     headers: {
  //       Authorization: `Bearer ${auth.APIToken}`,
  //     },
  //   });
  //   setAllSalarySlabEdit(res_freq?.data?.salaryslab?.filter((item) => item?._id !== salarySlabEdit._id));
  // }
  // get single row to view....
  const getviewCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SINGLE_SALARYSLAB}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSalarySlabEdit(res?.data?.ssalaryslab);
      handleClickOpenview();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SINGLE_SALARYSLAB}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSalarySlabEdit(res?.data?.ssalaryslab);
      handleClickOpeninfo();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  //frequency master name updateby edit page...
  let updateby = salarySlabEdit.updatedby;
  let addedby = salarySlabEdit.addedby;
  let frequencyId = salarySlabEdit._id;
  //editing the single data...
  const sendEditRequest = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.put(`${SERVICE.SINGLE_SALARYSLAB}/${frequencyId}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: String(salarySlabEdit.company),
        branch: String(salarySlabEdit.branch),
        processqueue: String(selectedprocessedit !== '' ? selectedprocessedit : selectedprocessqueuedit),
        salarycode: String(salarySlabEdit.salarycode),
        basic: Number(salarySlabEdit.basic),
        hra: Number(salarySlabEdit.hra),
        conveyance: Number(salarySlabEdit.conveyance),
        medicalallowance: Number(salarySlabEdit.medicalallowance),
        productionallowance: Number(salarySlabEdit.productionallowance),
        productionallowancetwo: Number(salarySlabEdit.productionallowancetwo),
        otherallowance: Number(salarySlabEdit.otherallowance),
        shiftallowance: Number(salarySlabEdit.shiftallowance),
        grosstotal: Number(salarySlabEdit.basic) + Number(salarySlabEdit.hra) + Number(salarySlabEdit.conveyance) + Number(salarySlabEdit.medicalallowance) + Number(salarySlabEdit.productionallowance),

        esideduction: Boolean(salarySlabEdit.esideduction),
        // esipercentage: Number(salarySlabEdit.esideduction ? salarySlabEdit.esipercentage : ''),
        esimaxsalary: Number(salarySlabEdit.esideduction ? salarySlabEdit.esimaxsalary : ''),

        pfdeduction: Boolean(salarySlabEdit.pfdeduction),
        // pfpercentage: Number(salarySlabEdit.pfpercentage ? salarySlabEdit.pfpercentage : ''),
        epspercentage: Number(salarySlabEdit.epspercentage ? salarySlabEdit.epspercentage : ''),


        // pfemployeepercentage: Number(salarySlabEdit.pfdeduction ? salarySlabEdit.pfemployeepercentage : ''),
        // esiemployeepercentage: Number(salarySlabEdit.esideduction ? salarySlabEdit.esiemployeepercentage : ''),

        esiemployeepercentage: Number(salarySlabEdit.esiemployeepercentage),
        esipercentage: Number(salarySlabEdit.esiemployerpercentage),
        pfemployeepercentage: Number(salarySlabEdit.pfemployeepercentage),
        pfpercentage: Number(salarySlabEdit.pfemployerpercentage),
        epfcontribution: Number(salarySlabEdit.epfcontribution),
        epspension: Number(salarySlabEdit.epspension),
        edliinsurance: Number(salarySlabEdit.edliinsurance),
        epfadmincharges: Number(salarySlabEdit.epfadmincharges),

        updatedby: [
          ...updateby,
          {
            name: String(username),
            date: String(new Date()),
          },
        ],
      });
      // await fetchProfessionalTaxAll();
      await fetchEmployee('Filtered');
      await fetchProfessionalTaxArray();
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
    // fetchProfessionalTaxAll();
    let res_freq = await axios.get(SERVICE.ALL_SALARYSLAB, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
    });

    let getid = res_freq?.data?.salaryslab?.filter((item) => item?._id !== salarySlabEdit._id)
    const isNameMatch = getid?.some((item) => item.company === salarySlabEdit.company &&
      item.branch === salarySlabEdit.branch &&
      item.processqueue.toLowerCase() === salarySlabEdit.processqueue.toLowerCase() && item.salarycode.toLowerCase() === salarySlabEdit.salarycode.toLowerCase());
    if (salarySlabEdit.company === 'Please Select Company') {
      setPopupContentMalert('Please Select Company');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (salarySlabEdit.branch === 'Please Select Branch') {
      setPopupContentMalert('Please Select Branch');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (salarySlabEdit.salarycode === '') {
      setPopupContentMalert('Please Enter Salary Code');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (salarySlabEdit.processqueue === '' && selectedprocessedit === '') {
      setPopupContentMalert('Please Select Process');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert('Salary Slab already exists!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else {
      sendEditRequest();
    }
  };

  const [salarySlabFilterArray, setSalarySlabFilterArray] = useState([]);

  const fetchProfessionalTaxArray = async () => {
    setPageName(!pageName);
    try {
      let res_freq = await axios.get(SERVICE.ALL_SALARYSLAB, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setSalarySlabFilterArray(res_freq?.data?.salaryslab);

      setIsPdfFilterOpen(false);
    } catch (err) {
      setIsPdfFilterOpen(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    fetchProfessionalTaxArray();
  }, [isFilterOpen]);

  const [overallFilterdata, setOverallFilterdata] = useState([]);
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalDatas, setTotalDatas] = useState(0);

  const fetchEmployee = async (e) => {
    setLoader(false);
    setPageName(!pageName);

    let companies = selectedOptionsCom?.map((item) => item.value);
    let branches = selectedOptionsBran?.map((item) => item.value);
    let process = selectedOptionsUnit?.map((item) => item.value);
    const queryParams = {
      page: Number(page),
      pageSize: Number(pageSize),
      assignbranch: accessbranch,
      companies: companies,
      branches: branches,
      process: process,
    };

    const allFilters = [...additionalFilters, { column: selectedColumn, condition: selectedCondition, value: filterValue }];

    // Only include advanced filters if they exist, otherwise just use regular searchQuery
    if (allFilters.length > 0 && selectedColumn !== '') {
      queryParams.allFilters = allFilters;
      queryParams.logicOperator = logicOperator;
    } else if (searchQuery) {
      queryParams.searchQuery = searchQuery; // Use searchQuery for regular search
    }

    try {
      if (e === 'Filtered') {
        let res_employee = await axios.post(SERVICE.ALL_SALARYSLAB_SORTASSIGNBRANCH, queryParams, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });

        const ans = res_employee?.data?.result?.length > 0 ? res_employee?.data?.result : [];

        const itemsWithSerialNumber = ans?.map((item, index) => ({
          ...item,
          serialNumber: (page - 1) * pageSize + index + 1,
          id: item._id,
        }));
        // const overallWithSerialNumber = res_employee?.data?.overallitems?.map((item, index) => ({
        //   ...item,
        //   serialNumber: index + 1,
        //   id: item._id
        // }));
        // if (selectedOptionsCom?.length > 0) {
        setSalarySlabArray(itemsWithSerialNumber);
        setOverallFilterdata(itemsWithSerialNumber);

        // setOverallItems(overallWithSerialNumber)
        setTotalDatas(ans?.length > 0 ? res_employee?.data?.totalProjects : 0);
        setTotalPages(ans?.length > 0 ? res_employee?.data?.totalPages : 0);
        setPageSize((data) => {
          return ans?.length > 0 ? data : 10;
        });
        setPage((data) => {
          return ans?.length > 0 ? data : 1;
        });
        // } else {
        //   setSalarySlabArray([]);
        //   setOverallFilterdata([]);
        //   setOverallItems([])
        //   setPage(1);
        //   setPageSize(10);
        //   setTotalDatas(0);
        //   setTotalPages(0);
        // }
        // setIteration((prev) => prev + 1);
        setLoader(true);
      } else {
        setLoader(false);
      }
    } catch (err) {
      setLoader(true);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    if (items?.length > 0) {
      fetchEmployee('Filtered');
    }
  }, [page, pageSize, searchQuery]);

  const handleResetSearch = async () => {
    setLoader(false);
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

    let companies = selectedOptionsCom?.map((item) => item.value);
    let branches = selectedOptionsBran?.map((item) => item.value);
    let process = selectedOptionsUnit?.map((item) => item.value);

    const queryParams = {
      page: Number(page),
      pageSize: Number(pageSize),
      assignbranch: accessbranch,
      companies: companies,
      branches: branches,
      process: process,
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
      let res_employee = await axios.post(SERVICE.ALL_SALARYSLAB_SORTASSIGNBRANCH, queryParams, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const ans = res_employee?.data?.result?.length > 0 ? res_employee?.data?.result : [];

      const itemsWithSerialNumber = ans?.map((item, index) => ({
        ...item,
        serialNumber: (page - 1) * pageSize + index + 1,
        id: item._id,
      }));
      const overallWithSerialNumber = res_employee?.data?.overallitems?.map((item, index) => ({
        ...item,
        serialNumber: index + 1,
        id: item._id,
      }));

      if (selectedOptionsCom?.length > 0) {
        setSalarySlabArray(itemsWithSerialNumber);
        setOverallFilterdata(itemsWithSerialNumber);

        setOverallItems(overallWithSerialNumber);
        setTotalDatas(ans?.length > 0 ? res_employee?.data?.totalProjects : 0);
        setTotalPages(ans?.length > 0 ? res_employee?.data?.totalPages : 0);
        setPageSize((data) => {
          return ans?.length > 0 ? data : 10;
        });
        setPage((data) => {
          return ans?.length > 0 ? data : 1;
        });
      } else {
        setSalarySlabArray([]);
        setOverallFilterdata([]);
        setOverallItems([]);
        setPage(1);
        setPageSize(10);
        setTotalDatas(0);
        setTotalPages(0);
      }

      setLoader(true);
    } catch (err) {
      setLoader(true);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const delAreagrpcheckbox = async () => {
    setPageName(!pageName);
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.SINGLE_SALARYSLAB}/${item}`, {
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
      handleResetSearch();
      setPopupContent('Deleted Successfully');
      setPopupSeverity('success');
      handleClickOpenPopup();
    } catch (err) {
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
          saveAs(blob, 'Salary Slab List.png');
        })
        .catch((error) => {
          console.error('dom-to-image error: ', error);
        });
    }
  };
  // pdf.....
  const columns = [
    { title: 'Company', field: 'company' },
    { title: 'Branch', field: 'branch' },
    { title: 'Process Queue', field: 'processqueue' },
    { title: 'Salary Code', field: 'salarycode' },
    { title: 'Basic', field: 'basic' },
    { title: 'HRA', field: 'hra' },
    { title: 'Conveyance', field: 'conveyance' },
    { title: 'Medical Allowance', field: 'medicalallowance' },
    { title: 'Production Allowance', field: 'productionallowance' },
    { title: 'Production Allowance 2', field: 'productionallowancetwo' },
    { title: 'Other Allowance', field: 'otherallowance' },
    { title: 'Shift Allowance', field: 'shiftallowance' },
    { title: 'ESI Deduction', field: 'esideduction' },
    { title: 'PF Deduction', field: 'pfdeduction' },
  ];

  // Excel
  const fileName = 'SalarySlab';
  // get particular columns for export excel
  const getexcelDatas = () => {
    setPageName(!pageName);
    try {
      var data = salarySlabArray.map((t, index) => ({
        Sno: index + 1,
        Company: t.company,
        Branch: t.branch,
        ProcessQueue: t.processqueue,
        SalaryCode: t.salarycode,
        Basic: t.basic,
        HRA: t.hra,
        Conveyance: t.conveyance,
        MedicalAllowance: t.medicalallowance,
        ProductionAllowance: t.productionallowance,
        'ProductionAllowance 2': t.productionallowancetwo,
        OtherAllowance: t.otherallowance,
        ShiftAllowance: t.shiftallowance,
        'ESI Deduction': t.esideduction ? 'YES' : 'NO',
        'PF Deduction': t.pfdeduction ? 'YES' : 'NO',
      }));
      setSalarySlabData(data);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //serial no for listing items
  const addSerialNumber = (datas) => {
    // const itemsWithSerialNumber = datas?.map((item, index) => ({
    //   ...item,
    //   serialNumber: index + 1,
    //   esideduction: item.esideduction ? 'YES' : 'NO',
    //   pfdeduction: item.pfdeduction ? 'YES' : 'NO',
    // }));
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
      field: 'checkbox',
      headerName: 'Checkbox',
      headerStyle: {
        fontWeight: 'bold', // Apply the font-weight style to make the header text bold
        // Add any other CSS styles as needed
      },
      headerCheckboxSelection: true,
      checkboxSelection: true,
      pinned: 'left',
      sortable: false, // Optionally, you can make this column not sortable
      width: 90,
      hide: !columnVisibility.checkbox,
      headerClassName: 'bold-header',
    },
    {
      field: 'serialNumber',
      headerName: 'SNo',
      flex: 0,
      width: 80,
      hide: !columnVisibility.serialNumber,
      headerClassName: 'bold-header',
      pinned: 'left',
    },
    {
      field: 'company',
      headerName: 'Company',
      flex: 0,
      width: 100,
      hide: !columnVisibility.company,
      headerClassName: 'bold-header',
      pinned: 'left',
    },
    {
      field: 'branch',
      headerName: 'Branch',
      flex: 0,
      width: 200,
      hide: !columnVisibility.branch,
      headerClassName: 'bold-header',
      pinned: 'left',
    },
    {
      field: 'processqueue',
      headerName: 'Process Queue ',
      flex: 0,
      width: 200,
      hide: !columnVisibility.processqueue,
      headerClassName: 'bold-header',
    },
    {
      field: 'salarycode',
      headerName: 'Salary Code',
      flex: 0,
      width: 130,
      hide: !columnVisibility.salarycode,
      headerClassName: 'bold-header',
    },
    {
      field: 'basic',
      headerName: 'Basic',
      flex: 0,
      width: 100,
      hide: !columnVisibility.basic,
      headerClassName: 'bold-header',
    },
    {
      field: 'hra',
      headerName: 'HRA',
      flex: 0,
      width: 100,
      hide: !columnVisibility.hra,
      headerClassName: 'bold-header',
    },
    {
      field: 'conveyance',
      headerName: 'Conveyance',
      flex: 0,
      width: 120,
      hide: !columnVisibility.conveyance,
      headerClassName: 'bold-header',
    },
    {
      field: 'medicalallowance',
      headerName: 'Medical Allowance',
      flex: 0,
      width: 150,
      hide: !columnVisibility.medicalallowance,
      headerClassName: 'bold-header',
    },
    {
      field: 'productionallowance',
      headerName: 'Production Allowance',
      flex: 0,
      width: 170,
      hide: !columnVisibility.productionallowance,
      headerClassName: 'bold-header',
    },
    {
      field: 'productionallowancetwo',
      headerName: 'Production Allowance 2',
      flex: 0,
      width: 180,
      hide: !columnVisibility.productionallowancetwo,
      headerClassName: 'bold-header',
    },
    {
      field: 'otherallowance',
      headerName: 'Other Allowance',
      flex: 0,
      width: 130,
      hide: !columnVisibility.otherallowance,
      headerClassName: 'bold-header',
    },
    {
      field: 'shiftallowance',
      headerName: 'Shift Allowance',
      flex: 0,
      width: 130,
      hide: !columnVisibility.shiftallowance,
      headerClassName: 'bold-header',
    },
    {
      field: 'esideduction',
      headerName: 'ESI Deduction',
      flex: 0,
      width: 130,
      hide: !columnVisibility.esideduction,
      headerClassName: 'bold-header',
    },
    {
      field: 'pfdeduction',
      headerName: 'PF Deduction',
      flex: 0,
      width: 130,
      hide: !columnVisibility.pfdeduction,
      headerClassName: 'bold-header',
    },
    {
      field: 'esiemployeepercentage',
      headerName: 'ESI Employee Percentage',
      flex: 0,
      width: 130,
      hide: !columnVisibility.esiemployeepercentage,
      headerClassName: 'bold-header',
    },
    {
      field: 'esipercentage',
      headerName: 'ESI Employer Percentage',
      flex: 0,
      width: 130,
      hide: !columnVisibility.esipercentage,
      headerClassName: 'bold-header',
    },
    {
      field: 'pfemployeepercentage',
      headerName: 'PF Employee Percentage',
      flex: 0,
      width: 130,
      hide: !columnVisibility.pfemployeepercentage,
      headerClassName: 'bold-header',
    },
    {
      field: 'pfpercentage',
      headerName: 'PF Employer Percentage',
      flex: 0,
      width: 130,
      hide: !columnVisibility.pfpercentage,
      headerClassName: 'bold-header',
    },
    {
      field: 'epfcontribution',
      headerName: 'EPF Contribution',
      flex: 0,
      width: 130,
      hide: !columnVisibility.epfcontribution,
      headerClassName: 'bold-header',
    },
    {
      field: 'epspension',
      headerName: 'EPS Pension',
      flex: 0,
      width: 130,
      hide: !columnVisibility.epspension,
      headerClassName: 'bold-header',
    },
    {
      field: 'edliinsurance',
      headerName: 'EDLI Insurance',
      flex: 0,
      width: 130,
      hide: !columnVisibility.edliinsurance,
      headerClassName: 'bold-header',
    },
    {
      field: 'epfadmincharges',
      headerName: 'EPF Admin Charges',
      flex: 0,
      width: 130,
      hide: !columnVisibility.epfadmincharges,
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
          {isUserRoleCompare?.includes('esalaryslablist') && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.data.id);
              }}
            >
              <EditOutlinedIcon style={{ fontsize: 'large' }} sx={buttonStyles.buttonedit} />
            </Button>
          )}
          {isUserRoleCompare?.includes('dsalaryslablist') && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.data.id);
              }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontsize: 'large' }} sx={buttonStyles.buttondelete} />
            </Button>
          )}
          {isUserRoleCompare?.includes('vsalaryslablist') && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.data.id);
              }}
            >
              <VisibilityOutlinedIcon style={{ fontsize: 'large' }} sx={buttonStyles.buttonview} />
            </Button>
          )}
          {isUserRoleCompare?.includes('isalaryslablist') && (
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

  const filteredSelectedColumn = columnDataTable.filter((data) => data.field !== 'checkbox' && data.field !== 'actions' && data.field !== 'serialNumber');

  const rowDataTable = filteredDatas.map((item, index) => {
    return {
      ...item,
      id: item.id,
      serialNumber: item.serialNumber,
      company: item.company,
      branch: item.branch,
      processqueue: item.processqueue,
      salarycode: item.salarycode,
      basic: item.basic,
      hra: item.hra,
      conveyance: item.conveyance,
      medicalallowance: item.medicalallowance,
      productionallowance: item.productionallowance,
      productionallowancetwo: item.productionallowancetwo,
      otherallowance: item.otherallowance,
      shiftallowance: item.shiftallowance,
      esideduction: item.esideduction ? 'YES' : 'NO',
      pfdeduction: item.pfdeduction ? 'YES' : 'NO',
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
              {' '}
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
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );

  const [fileFormat, setFormat] = useState('');
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = fileFormat === 'xl' ? '.xlsx' : '.csv';
  const exportToCSV = (csvData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  const handleExportXL = async (isfilter) => {
    try {
      if (isfilter === 'filtered') {
        // Define headers
        let headers = [
          'Company',
          'Branch',
          'Process Queue',
          'Salary Code',
          'Basic',
          'HRA',
          'Conveyance',
          'Medical Allowance',
          'Production Allowance',
          'Production Allowance 2',
          'Other Allowance',
          'Shift Allowance',
          'ESI Deduction',
          'PF Deduction',
          'Salary Amount',
          'Experience',
          'Process Code',
          'Target Points',
        ];

        // Transform data
        const excelData = salarySlabArray.map((entry) => [
          entry.company,
          entry.branch,
          entry.processqueue,
          entry.salarycode,
          entry.basic,
          entry.hra,
          entry.conveyance,
          entry.medicalallowance,
          entry.productionallowance,
          entry.productionallowancetwo,
          entry.otherallowance,
          entry.shiftallowance,
          entry.esideduction,
          entry.pfdeduction,
          entry.totalValue, // Salary Amount
          entry.experience,
          entry.salarycode, // Process Code
          entry.targetPointsValue,
        ]);

        // Combine headers and data
        const finalData = [headers, ...excelData];

        // Create worksheet
        const ws = XLSX.utils.aoa_to_sheet(finalData);

        // Create workbook and export
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        // Save file
        XLSX.writeFile(wb, 'SalarySlabList.xlsx');
        setIsFilterOpen(false);
      } else if (isfilter === 'overall') {
        let result = [];
        setExportLoading(true);

        let response = await axios.post(
          SERVICE.SALARY_SLAB_LIST_EXCELDOWNLOAD,
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },

            assignbranch: accessbranch,
            companies: companies,
            branches: branches,
            process: process,
            // ✅ Ensure Axios returns a Blob
          },
          {
            responseType: 'blob',
          }
        );
        console.log(response, 'response');
        // Create a Blob from the response
        const blob = new Blob([response.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        // Create a download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'SalarySlabList.xlsx';
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
        let headers = [
          'Company',
          'Branch',
          'Process Queue',
          'Salary Code',
          'Basic',
          'HRA',
          'Conveyance',
          'Medical Allowance',
          'Production Allowance',
          'Production Allowance 2',
          'Other Allowance',
          'Shift Allowance',
          'ESI Deduction',
          'PF Deduction',
          'Salary Amount',
          'Experience',
          'Process Code',
          'Target Points',
        ];

        // Transform data
        const excelData = salarySlabArray.map((entry) => [
          entry.company,
          entry.branch,
          entry.processqueue,
          entry.salarycode,
          entry.basic,
          entry.hra,
          entry.conveyance,
          entry.medicalallowance,
          entry.productionallowance,
          entry.productionallowancetwo,
          entry.otherallowance,
          entry.shiftallowance,
          entry.esideduction,
          entry.pfdeduction,
          entry.totalValue, // Salary Amount
          entry.experience,
          entry.salarycode, // Process Code
          entry.targetPointsValue,
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
        link.download = 'SalarySlabList.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (isfilter === 'overall') {
        let result = [];
        setExportLoading(true);

        try {
          let response = await axios.post(
            SERVICE.SALARY_SLAB_LIST_CSVDOWNLOAD,
            {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
              assignbranch: accessbranch,
              companies: companies,
              branches: branches,
              process: process,
            },
            {
              responseType: 'blob',
            }
          );
          // Create a Blob from the response data
          const blob = new Blob([response.data], { type: 'text/csv' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');

          a.href = url;
          a.download = 'SalarySlabList.csv'; // File name
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
    if (isfilter === 'filtered') {
      try {
        let headers = [
          'Company',
          'Branch',
          'Process Queue',
          'Salary Code',
          'Basic',
          'HRA',
          'Conveyance',
          'Medical Allowance',
          'Production Allowance',
          'Production Allowance 2',
          'Other Allowance',
          // "Shift Allowance",
          'ESI Deduction',
          'PF Deduction',
          // "Salary Amount",
          // "Experience",
          'Process Code',
          // "Target Points",
        ];

        // Transform data
        const excelData = salarySlabArray.map((entry) => [
          entry.company,
          entry.branch,
          entry.processqueue,
          entry.salarycode,
          entry.basic,
          entry.hra,
          entry.conveyance,
          entry.medicalallowance,
          entry.productionallowance,
          entry.productionallowancetwo,
          entry.otherallowance,
          // entry.shiftallowance,
          entry.esideduction,
          entry.pfdeduction,
          //  entry.totalValue,
          // entry.experience,
          entry.salarycode,
          //entry.targetPointsValue,
        ]);

        // Combine headers and data
        const tableData = [headers, ...excelData];

        const docDefinition = {
          pageSize: 'A4',
          pageOrientation: 'landscape', // Landscape mode
          content: [
            { text: 'salaryslablist', style: 'header', alignment: 'center' },
            { text: `Generated on: ${new Date().toLocaleString()}`, style: 'subheader', alignment: 'right' },
            '\n',
            {
              table: {
                headerRows: 1,
                widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
                body: tableData,
              },
              layout: 'lightHorizontalLines', // Table styling
            },
          ],
          styles: {
            header: { fontSize: 14, bold: true },
            subheader: { fontSize: 10, italics: true },
          },
          defaultStyle: { fontSize: 8 }, // Reduce font size
        };

        pdfMake.createPdf(docDefinition).download('SalarySlabList.pdf'); // Trigger downloa
        setIsPdfFilterOpen(false);
      } catch (err) {
        console.log(err);
      }
    } else if (isfilter === 'overall') {
      try {
        setExportLoading(true);
        let response = await axios.post(
          SERVICE.SALARY_SLAB_LIST_PDFDOWNLOAD,
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },

            assignbranch: accessbranch,
            companies: companies,
            branches: branches,
            process: process,
          },
          {
            responseType: 'blob',
          }
        );
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'SalarySlabList.pdf';
        link.click();
        URL.revokeObjectURL(link.href);
        setExportLoading(false);
        setIsFilterOpen(false);
      } catch (err) {
        console.log(err, 'errpdf');
        setExportLoading(false);
      }
    }
  };

  return (
    <Box>
      <Headtitle title={'SALARY SLAB LIST'} />
      {/* ****** Header Content ****** */}
      <PageHeading title="Salary Slab List" modulename="PayRoll" submodulename="Salary Slab" mainpagename="Salary Slab List" subpagename="" subsubpagename="" />
      <br /> <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes('asalaryslablist') && (
        <>
          <Box sx={userStyle.dialogbox}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography
                    sx={userStyle.importheadtext}
                    onClick={() => {
                      console.log(page);
                    }}
                  >
                    Filter
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={3} sm={12} xs={12} sx={{ display: 'flex', flexDirection: 'row' }}>
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
                      value={selectedOptionsCom}
                      onChange={(e) => {
                        handleCompanyChange(e);
                        setSelectedOptionsBran([]);
                        setSelectedOptionsUnit([]);
                        setProcessOptions([]);
                      }}
                      valueRenderer={customValueRendererCom}
                      labelledBy="Please Select Company"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} xs={12} sx={{ display: 'flex', flexDirection: 'row' }}>
                  <FormControl fullWidth size="small">
                    <Typography>Branch</Typography>
                    <MultiSelect
                      options={accessbranch
                        ?.filter((comp) => selectedOptionsCom.map((data) => data.value).includes(comp.company))
                        ?.map((data) => ({
                          label: data.branch,
                          value: data.branch,
                        }))
                        .filter((item, index, self) => {
                          return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                        })}
                      value={selectedOptionsBran}
                      onChange={(e) => {
                        handleBranchChange(e);
                        setSelectedOptionsUnit([]);
                      }}
                      valueRenderer={customValueRendererBran}
                      labelledBy="Please Select Branch"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} xs={12} sx={{ display: 'flex', flexDirection: 'row' }}>
                  <FormControl fullWidth size="small">
                    <Typography>Process</Typography>
                    <MultiSelect
                      options={processOptions}
                      value={selectedOptionsUnit}
                      onChange={(e) => {
                        handleUnitChange(e);
                      }}
                      valueRenderer={customValueRendererUnit}
                      labelledBy="Please Select Process"
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <Grid item md={12} sm={12} xs={12}>
                <br />
                <br />
                <Grid
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '15px',
                  }}
                >
                  <LoadingButton variant="contained" onClick={handleSubmit} loading={btnSubmit} sx={buttonStyles.buttonsubmit}>
                    Filter
                  </LoadingButton>
                  <Button sx={buttonStyles.btncancel} onClick={handleClear}>
                    CLEAR
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
        </>
      )}
      <br />
      {isUserRoleCompare?.includes('lsalaryslablist') && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>Salary Slab List</Typography>
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
                    <MenuItem value={overallItems?.length}>All</MenuItem>
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
                  {isUserRoleCompare?.includes('excelsalaryslablist') && (
                    <>
                      <Button
                        onClick={(e) => {
                          setIsFilterOpen(true);
                          // fetchProfessionalTaxArray()
                          setFormat('xl');
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileExcel />
                        &ensp;Export to Excel&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes('csvsalaryslablist') && (
                    <>
                      <Button
                        onClick={(e) => {
                          setIsFilterOpen(true);
                          // fetchProfessionalTaxArray()
                          setFormat('csv');
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileCsv />
                        &ensp;Export to CSV&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes('printsalaryslablist') && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes('pdfsalaryslablist') && (
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
                  {isUserRoleCompare?.includes('imagesalaryslablist') && (
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
            {isUserRoleCompare?.includes('bdsalaryslablist') && (
              <Button variant="contained" color="error" onClick={handleClickOpenalert} sx={buttonStyles.buttonbulkdelete}>
                Bulk Delete
              </Button>
            )}
            <br />
            <br />
            {!loader ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '350px' }}>
                <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
              </Box>
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
                  gridRefTable={gridRef}
                  totalDatas={totalDatas}
                  setFilteredRowData={setFilteredRowData}
                  filteredRowData={filteredRowData}
                  gridRefTableImg={gridRefTableImg}
                  itemsList={overallItems}
                />
              </>
            )}
            {/* ****** Table End ****** */}
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
                            fetchEmployee('Filtered');
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
      {/* ****** Table End ****** */}
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
      {/* print layout */}
      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRef}>
          <TableHead>
            <TableRow>
              <TableCell> SI.No</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Branch</TableCell>
              <TableCell>Process Queue</TableCell>
              <TableCell>Salary Code</TableCell>
              <TableCell>Basic</TableCell>
              <TableCell>HRA</TableCell>
              <TableCell>Conveyance</TableCell>
              <TableCell>Medical Allowance</TableCell>
              <TableCell>Production Allowance</TableCell>
              <TableCell>Production Allowance 2</TableCell>
              <TableCell>Other Allowance</TableCell>
              <TableCell>Shift Allowance</TableCell>
              <TableCell>ESI Deduction</TableCell>
              <TableCell>PF Deduction</TableCell>
            </TableRow>
          </TableHead>
          <TableBody align="left">
            {salarySlabArray &&
              salarySlabArray.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.company}</TableCell>
                  <TableCell>{row.branch}</TableCell>
                  <TableCell>{row.processqueue}</TableCell>
                  <TableCell>{row.salarycode}</TableCell>
                  <TableCell>{row.basic}</TableCell>
                  <TableCell>{row.hra}</TableCell>
                  <TableCell>{row.conveyance}</TableCell>
                  <TableCell>{row.medicalallowance}</TableCell>
                  <TableCell>{row.productionallowance}</TableCell>
                  <TableCell>{row.productionallowancetwo}</TableCell>
                  <TableCell>{row.otherallowance}</TableCell>
                  <TableCell>{row.shiftallowance}</TableCell>
                  <TableCell>{row.esideduction ? 'YES' : 'NO'}</TableCell>
                  <TableCell>{row.pfdeduction ? 'YES' : 'NO'}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* this is info view details */}
      <Dialog open={openInfo} onClose={handleCloseinfo} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <Box sx={{ width: '550px', padding: '20px 50px' }}>
          <>
            <Typography sx={userStyle.HeaderText}>Salary Slab Info</Typography>
            <br />
            <br />
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">addedby</Typography>
                  <br />
                  <Table>
                    <TableHead>
                      <StyledTableCell sx={{ padding: '5px 10px !important' }}>{'SNO'}.</StyledTableCell>
                      <StyledTableCell sx={{ padding: '5px 10px !important' }}>{'UserName'}</StyledTableCell>
                      <StyledTableCell sx={{ padding: '5px 10px !important' }}> {'Date'}</StyledTableCell>
                    </TableHead>
                    <TableBody>
                      {addedby?.map((item, i) => (
                        <StyledTableRow>
                          <StyledTableCell sx={{ padding: '5px 10px !important' }}>{i + 1}.</StyledTableCell>
                          <StyledTableCell sx={{ padding: '5px 10px !important' }}> {item.name}</StyledTableCell>
                          <StyledTableCell sx={{ padding: '5px 10px !important' }}> {moment(item.date).format('DD-MM-YYYY hh:mm:ss a')}</StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Updated by</Typography>
                  <br />
                  <Table>
                    <TableHead>
                      <StyledTableCell sx={{ padding: '5px 10px !important' }}>{'SNO'}.</StyledTableCell>
                      <StyledTableCell sx={{ padding: '5px 10px !important' }}> {'UserName'}</StyledTableCell>
                      <StyledTableCell sx={{ padding: '5px 10px !important' }}> {'Date'}</StyledTableCell>
                    </TableHead>
                    <TableBody>
                      {updateby?.map((item, i) => (
                        <StyledTableRow>
                          <StyledTableCell sx={{ padding: '5px 10px !important' }}>{i + 1}.</StyledTableCell>
                          <StyledTableCell sx={{ padding: '5px 10px !important' }}> {item.name}</StyledTableCell>
                          <StyledTableCell sx={{ padding: '5px 10px !important' }}> {moment(item.date).format('DD-MM-YYYY hh:mm:ss a')}</StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br />
            <br />
            <Grid container spacing={2} sx={{ marginLeft: '-2px' }}>
              <Button variant="contained" onClick={handleCloseinfo} sx={buttonStyles.btncancel}>
                {' '}
                Back{' '}
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>
      {/*DELETE ALERT DIALOG */}
      <Dialog open={isDeleteOpen} onClose={handleCloseMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: '80px', color: 'orange' }} />
          <Typography variant="h5" sx={{ color: 'red', textAlign: 'center' }}>
            Are you sure?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseMod}
            style={{
              backgroundColor: '#f4f4f4',
              color: '#444',
              boxShadow: 'none',
              borderRadius: '3px',
              border: '1px solid #0000006b',
              '&:hover': {
                '& .css-bluauu-MuiButtonBase-root-MuiButton-root': {
                  backgroundColor: '#f4f4f4',
                },
              },
            }}
          >
            Cancel
          </Button>
          <Button autoFocus variant="contained" color="error" onClick={(e) => deltax(taxid)}>
            {' '}
            OK{' '}
          </Button>
        </DialogActions>
      </Dialog>
      {/* view model */}
      <Dialog open={openview} onClose={handleClickOpenview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md" fullWidth={true} sx={{ marginTop: '50px' }}>
        <Box sx={{ padding: '20px 50px' }}>
          <>
            <Typography sx={userStyle.HeaderText}> View Salary Slab</Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Company</Typography>
                  <Typography>{salarySlabEdit.company}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Branch</Typography>
                  <Typography>{salarySlabEdit.branch}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Process Queue</Typography>
                  <Typography>{salarySlabEdit.processqueue}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Salary Code</Typography>
                  <Typography>{salarySlabEdit.salarycode}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">
                    Basic <span>&nbsp; &#8377;</span>
                  </Typography>
                  <Typography>{salarySlabEdit.basic}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">
                    HRA<span>&nbsp; &#8377;</span>
                  </Typography>
                  <Typography>{salarySlabEdit.hra}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">
                    Conveyance<span>&nbsp; &#8377;</span>
                  </Typography>
                  <Typography>{salarySlabEdit.conveyance}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">
                    Medical Allowance<span>&nbsp; &#8377;</span>
                  </Typography>
                  <Typography>{salarySlabEdit.medicalallowance}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">
                    Production Allowance<span>&nbsp; &#8377;</span>
                  </Typography>
                  <Typography>{salarySlabEdit.productionallowance}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">
                    Production Allowance 2<span>&nbsp; &#8377;</span>
                  </Typography>
                  <Typography>{salarySlabEdit.productionallowancetwo}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">
                    Other Allowance<span>&nbsp; &#8377;</span>
                  </Typography>
                  <Typography>{salarySlabEdit.otherallowance}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">
                    Shift Allowance<span>&nbsp; &#8377;</span>
                  </Typography>
                  <Typography>{salarySlabEdit.shiftallowance}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">ESI Deduction</Typography>
                  <Typography>{salarySlabEdit.esideduction ? 'YES' : 'NO'}</Typography>
                </FormControl>
              </Grid>
              {salarySlabEdit.esideduction === 'YES' && (
                <>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography> ESI Max Salary </Typography>

                      <Typography>{salarySlabEdit.esimaxsalary}</Typography>

                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        ESI Employee Percentage<b>&nbsp;%</b>
                      </Typography>
                      <Typography>{salarySlabEdit.esiemployeepercentage}</Typography>


                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        ESI Employer Percentage<b>&nbsp;%</b>
                      </Typography>
                      <Typography>{salarySlabEdit.esipercentage}</Typography>

                    </FormControl>
                  </Grid>
                </>
              )}
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">PF Deduction</Typography>
                  <Typography>{salarySlabEdit.pfdeduction ? 'YES' : 'NO'}</Typography>
                </FormControl>
              </Grid>
              {salarySlabEdit.pfdeduction === 'YES' && (
                <>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        PF Employee Percentage<b>&nbsp;%</b>
                      </Typography>

                      <Typography>{salarySlabEdit.pfemployeepercentage} </Typography>

                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Pf Employer Percentage<b>&nbsp;%</b>
                      </Typography>

                      <Typography>
                        {salarySlabEdit.pfpercentage}
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        EPF Contribution<b>&nbsp;%</b>
                      </Typography>
                      <Typography>
                        {salarySlabEdit.epfcontribution}
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        EPS (Pension)<b>&nbsp;%</b>
                      </Typography>
                      <Typography>{salarySlabEdit.epspension}</Typography>


                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        EDLI(Insurance)<b>&nbsp;%</b>
                      </Typography>
                      <Typography>
                        {salarySlabEdit.edliinsurance}

                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        EPF Admin Charges<b>&nbsp;%</b>
                      </Typography>
                      <Typography>
                        {salarySlabEdit.epfadmincharges}
                      </Typography>
                    </FormControl>
                  </Grid>
                </>
              )}
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2} sx={{ marginLeft: '-2px' }}>
              <Button variant="contained" color="primary" onClick={handleCloseview} sx={buttonStyles.btncancel}>
                Back
              </Button>
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
        <Dialog open={isErrorOpensalary} onClose={handleCloseerrSalary} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
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
              onClick={handleCloseerrSalary}
            >
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      {/* Bulk delete ALERT DIALOG */}
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
      <Box>
        <Dialog open={isDeleteOpencheckbox} onClose={handleCloseModcheckbox} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: '80px', color: 'orange' }} />
            <Typography variant="h5" sx={{ color: 'red', textAlign: 'center' }}>
              Are you sure?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>
              Cancel
            </Button>
            <Button autoFocus variant="contained" color="error" onClick={(e) => delAreagrpcheckbox(e)}>
              {' '}
              OK{' '}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      {/* Edit DIALOG */}
      <Box>
        <Dialog open={isEditOpen} onClose={handleCloseModEdit} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md" fullWidth={true} sx={{ marginTop: '50px' }}>
          <Box sx={{ padding: '20px 50px' }}>
            <>
              <Grid container spacing={2}>
                <Typography sx={userStyle.HeaderText}>Edit Salary Slab</Typography>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Company<b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={companyOption}
                      placeholder="Please Select Company"
                      value={{ label: salarySlabEdit.company, value: salarySlabEdit.company }}
                      onChange={(e) => {
                        console.log(selectedprocessqueuedit);
                        setSalarySlabEdit({
                          ...salarySlabEdit,
                          company: e.value,
                          branch: 'Please Select Branch',
                          processqueue: 'Please Select Process',
                        });

                        fetchBranchEdit(e.value);
                        setSelectedprocessqueueedit('Please Select Process');
                        setProcessQueueArrayEdit([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Branch<b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={branchOptionEdit}
                      placeholder="Please Select Branch"
                      value={{ label: salarySlabEdit.branch, value: salarySlabEdit.branch }}
                      onChange={(e) => {
                        setSalarySlabEdit({
                          ...salarySlabEdit,
                          branch: e.value,
                          processqueue: 'Please Select Process',
                        });
                        fetchProcessQueueEdit(e.value);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Process Code<b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      styles={colourStyles}
                      isDisabled={selectedprocessedit.length > 0}
                      options={processQueueArrayedit}
                      placeholder="Please Select Company"
                      value={{ label: selectedprocessqueuedit, value: selectedprocessqueuedit }}
                      onChange={(e) => setSelectedprocessqueueedit(e.value)}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Process Code<b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      sx={userStyle.input}
                      disabled={selectedprocessqueuedit !== '' && selectedprocessqueuedit !== 'Please Select Process'}
                      placeholder="Please Enter Process "
                      value={selectedprocessedit}
                      onChange={(e) => {
                        setSelectedprocessedit(e.target.value);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Salary Code<b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      sx={userStyle.input}
                      placeholder="Please Enter Salary Code"
                      value={salarySlabEdit.salarycode}
                      onChange={(e) => {
                        setSalarySlabEdit({
                          ...salarySlabEdit,
                          salarycode: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Basic <b>&nbsp; &#8377;</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      sx={userStyle.input}
                      placeholder="Please Enter Basic Amount"
                      value={salarySlabEdit.basic}
                      onChange={(e) => {
                        setSalarySlabEdit({
                          ...salarySlabEdit,
                          basic: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      HRA <b>&nbsp; &#8377;</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      sx={userStyle.input}
                      placeholder="Please Enter HRA"
                      value={salarySlabEdit.hra}
                      onChange={(e) => {
                        setSalarySlabEdit({
                          ...salarySlabEdit,
                          hra: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Conveyance <b>&nbsp; &#8377;</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      sx={userStyle.input}
                      placeholder="Please Enter Conveyance"
                      value={salarySlabEdit.conveyance}
                      onChange={(e) => {
                        setSalarySlabEdit({
                          ...salarySlabEdit,
                          conveyance: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Medical Allowance <b>&nbsp; &#8377;</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      sx={userStyle.input}
                      placeholder="Please Enter Medical Allowance"
                      value={salarySlabEdit.medicalallowance}
                      onChange={(e) => {
                        setSalarySlabEdit({
                          ...salarySlabEdit,
                          medicalallowance: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Production Allowance <b>&nbsp; &#8377;</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      sx={userStyle.input}
                      placeholder="Please Enter Production Allowance"
                      value={salarySlabEdit.productionallowance}
                      onChange={(e) => {
                        setSalarySlabEdit({
                          ...salarySlabEdit,
                          productionallowance: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Production Allowance 2<b>&nbsp; &#8377;</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      sx={userStyle.input}
                      placeholder="Please Enter Production Allowance 2"
                      value={salarySlabEdit.productionallowancetwo}
                      onChange={(e) => {
                        setSalarySlabEdit({
                          ...salarySlabEdit,
                          productionallowancetwo: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Other Allowance<b>&nbsp; &#8377;</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      sx={userStyle.input}
                      placeholder="Please Enter Other Allowance"
                      value={salarySlabEdit.otherallowance}
                      onChange={(e) => {
                        setSalarySlabEdit({
                          ...salarySlabEdit,
                          otherallowance: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Shift Allowance<b>&nbsp; &#8377;</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      sx={userStyle.input}
                      placeholder="Please Enter Shift Allowance"
                      value={salarySlabEdit.shiftallowance}
                      onChange={(e) => {
                        setSalarySlabEdit({
                          ...salarySlabEdit,
                          shiftallowance: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}></Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <Typography> &nbsp; </Typography>
                  <FormGroup>
                    <FormControlLabel control={<Checkbox checked={salarySlabEdit.esideduction} />} onChange={(e) => setSalarySlabEdit({ ...salarySlabEdit, esideduction: !salarySlabEdit.esideduction })} label="ESI Deduction" />
                  </FormGroup>
                </Grid>
                {salarySlabEdit.esideduction && (
                  <>
                    <Grid item md={6} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography> ESI Max Salary </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="number"
                          sx={userStyle.input}
                          placeholder="Please Enter ESI Max Salary"
                          value={salarySlabEdit.esimaxsalary}
                          onChange={(e) => {
                            setSalarySlabEdit({
                              ...salarySlabEdit,
                              esimaxsalary: e.target.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          ESI Employee Percentage<b>&nbsp;%</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="number"
                          sx={userStyle.input}

                          value={salarySlabEdit.esiemployeepercentage}
                          readOnly
                        // onChange={(e) => {
                        //   setSalarySlab({
                        //     ...salarySlab,
                        //     esiemployeepercentage: e.target.value,
                        //   });
                        // }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          ESI Employer Percentage<b>&nbsp;%</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="number"
                          readOnly
                          sx={userStyle.input}
                          value={salarySlabEdit.esipercentage}
                        // onChange={(e) => {
                        //   setSalarySlab({
                        //     ...salarySlab,
                        //     esipercentage: e.target.value,
                        //   });
                        // }}
                        />
                      </FormControl>
                    </Grid>
                  </>
                )}
                <Grid item md={6} xs={12} sm={12}>
                  <Typography> &nbsp; </Typography>
                  <FormGroup>
                    <FormControlLabel control={<Checkbox checked={salarySlabEdit.pfdeduction} />} onChange={(e) => setSalarySlabEdit({ ...salarySlabEdit, pfdeduction: !salarySlabEdit.pfdeduction })} label="PF Deduction" />
                  </FormGroup>
                </Grid>
                {salarySlabEdit.pfdeduction && (
                  <>
                    {/* <Grid item md={6} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          EPF Employer Percentage<b>&nbsp;%</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="number"
                          sx={userStyle.input}
                          placeholder="Please Enter PF Percentage"
                          value={salarySlabEdit.pfpercentage}
                          onChange={(e) => {
                            setSalarySlabEdit({
                              ...salarySlabEdit,
                              pfpercentage: e.target.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>*/}
                    {/* <Grid item md={6} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          EPS Employer Percentage<b>&nbsp;%</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="number"
                          sx={userStyle.input}
                          placeholder="Please Enter PF Percentage"
                          value={salarySlabEdit.epspercentage}
                          onChange={(e) => {
                            setSalarySlabEdit({
                              ...salarySlabEdit,
                              epspercentage: e.target.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>  */}
                    <Grid item md={6} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          PF Employee Percentage<b>&nbsp;%</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="number"
                          sx={userStyle.input}
                          readOnly
                          value={salarySlabEdit.pfemployeepercentage}
                        // onChange={(e) => {
                        //   setSalarySlabEdit({
                        //     ...salarySlabEdit,
                        //     pfemployeepercentage: e.target.value,
                        //   });
                        // }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Pf Employer Percentage<b>&nbsp;%</b><b style={{ color: 'red' }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="number"
                          readOnly
                          sx={userStyle.input}

                          value={salarySlabEdit.pfpercentage}
                        // onChange={(e) => {
                        //   setSalarySlab({
                        //     ...salarySlab,
                        //     pfemployerpercentage:
                        //      e.target.value
                        //      ,
                        //   });
                        // }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          EPF Contribution<b>&nbsp;%</b><b style={{ color: 'red' }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="number"
                          readOnly
                          sx={userStyle.input}
                          value={salarySlabEdit.epfcontribution}
                        // onChange={(e) => {
                        //   const value = Number(e.target.value);

                        //   setSalarySlab({
                        //     ...salarySlab,
                        //     epfcontribution: value,
                        //     pfemployerpercentage: calculatePFEmployerPercentage({ epfcontribution: value }),

                        //     // pfemployerpercentage: Number(e.target.value) + Number(salarySlab.epspension) + Number(salarySlab.edliinsurance) + Number(salarySlab.epfadmincharges),
                        //   });
                        // }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          EPS (Pension)<b>&nbsp;%</b><b style={{ color: 'red' }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="number"
                          sx={userStyle.input}
                          readOnly
                          value={salarySlabEdit.epspension}
                        // onChange={(e) => {
                        //   const value = Number(e.target.value);
                        //   setSalarySlab({
                        //     ...salarySlab,
                        //     epspension: value,
                        //     // pfemployerpercentage: Number(e.target.value) + Number(salarySlab.epfcontribution) + Number(salarySlab.edliinsurance) + Number(salarySlab.epfadmincharges),
                        //     pfemployerpercentage: calculatePFEmployerPercentage({ epspension: value }),

                        //   });
                        // }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          EDLI(Insurance)<b>&nbsp;%</b><b style={{ color: 'red' }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="number"
                          readOnly
                          sx={userStyle.input}
                          value={salarySlabEdit.edliinsurance}
                        // onChange={(e) => {
                        //   const value = Number(e.target.value);
                        //   setSalarySlab({
                        //     ...salarySlab,
                        //     edliinsurance: value,
                        //     // pfemployerpercentage: Number(e.target.value) + Number(salarySlab.epfcontribution) + Number(salarySlab.epspension) + Number(salarySlab.epfadmincharges),
                        //     pfemployerpercentage: calculatePFEmployerPercentage({ edliinsurance: value }),

                        //   });
                        // }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          EPF Admin Charges<b>&nbsp;%</b><b style={{ color: 'red' }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="number"
                          readOnly
                          sx={userStyle.input}
                          value={salarySlabEdit.epfadmincharges}
                        // onChange={(e) => {
                        //   const value = Number(e.target.value);

                        //   setSalarySlab({
                        //     ...salarySlab,
                        //     epfadmincharges: value,
                        //     // pfemployerpercentage: Number(e.target.value) + Number(salarySlab.epfcontribution) + Number(salarySlab.epspension) + Number(salarySlab.edliinsurance),
                        //     pfemployerpercentage: calculatePFEmployerPercentage({ epfadmincharges: value }),

                        //   });
                        // }}
                        />
                      </FormControl>
                    </Grid>
                  </>
                )}
              </Grid>
              <br /> <br />
              <Grid container spacing={2}>
                <Grid item md={6} xs={12} sm={12}>
                  <Button variant="contained" onClick={editSubmit} sx={buttonStyles.buttonsubmit}>
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
      <MessageAlert openPopup={openPopupMalert} handleClosePopup={handleClosePopupMalert} popupContent={popupContentMalert} popupSeverity={popupSeverityMalert} />
      {/* SUCCESS */}
      <AlertDialog openPopup={openPopup} handleClosePopup={handleClosePopup} popupContent={popupContent} popupSeverity={popupSeverity} />
      <ExportData
        // isFilterOpen={isFilterOpen}
        // handleCloseFilterMod={handleCloseFilterMod}
        // fileFormat={fileFormat}
        // setIsFilterOpen={setIsFilterOpen}
        // isPdfFilterOpen={isPdfFilterOpen}
        // setIsPdfFilterOpen={setIsPdfFilterOpen}
        // handleClosePdfFilterMod={handleClosePdfFilterMod}
        filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
        itemsTwo={salarySlabArray ?? []}
        filename={'Salary Slab List'}
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
    </Box>
  );
}
export default SalarySlabList;
