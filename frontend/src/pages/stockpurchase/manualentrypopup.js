import { makeStyles } from '@material-ui/core';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import ImageIcon from '@mui/icons-material/Image';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LastPageIcon from '@mui/icons-material/LastPage';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { MultiSelect } from 'react-multi-select-component';
import { StyledTableCell, StyledTableRow } from '../../components/Table';
import ManageStockItemsPopup from '../expenses/ManageStockItemsPopup';
import StockCategoryPopup from '../expenses/StockCategoryPopup';
import {
  Backdrop,
  Box,
  Button,
  Divider,
  Checkbox,
  Dialog,
  TableBody,
  TableFooter,
  TableHead,
  Table,
  Paper,
  TableContainer,
  DialogActions,
  DialogContent,
  DialogTitle,
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
  Popover,
  Radio,
  RadioGroup,
  Select,
  TextField,
  TextareaAutosize,
  Tooltip,
  Typography,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Switch from '@mui/material/Switch';
import { styled } from '@mui/system';
import axios from '../../axiosInstance';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import 'jspdf-autotable';
import moment from 'moment-timezone';
import React, { useState, useEffect, useRef, useContext, useMemo, useCallback } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint, FaSearch, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { ThreeDots } from 'react-loader-spinner';
import Resizable from 'react-resizable';
import Selects from 'react-select';
import { useReactToPrint } from 'react-to-print';
import csvIcon from '../../components/Assets/CSV.png';
import excelIcon from '../../components/Assets/excel-icon.png';
import fileIcon from '../../components/Assets/file-icons.png';
import pdfIcon from '../../components/Assets/pdf-icon.png';
import wordIcon from '../../components/Assets/word-icon.png';
import { handleApiError } from '../../components/Errorhandling';
import Headtitle from '../../components/Headtitle';
import StyledDataGrid from '../../components/TableStyle';
import { AuthContext, UserRoleAccessContext } from '../../context/Appcontext';
import { colourStyles, userStyle } from '../../pageStyle';
import { SERVICE } from '../../services/Baseservice';
import VendorPopup from '../asset/VendorPopup';
import ManuaStockTable from './manualstocktable';
import PageHeading from '../../components/PageHeading';
import AlertDialog from '../../components/Alert';
import { DeleteConfirmation, PleaseSelectRow } from '../../components/DeleteConfirmation.js';
import ExportData from '../../components/ExportData';
import InfoPopup from '../../components/InfoPopup.js';
import MessageAlert from '../../components/MessageAlert';

//new table
import { IoMdOptions } from 'react-icons/io';
import { MdClose } from 'react-icons/md';
import domtoimage from 'dom-to-image';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import AdvancedSearchBar from '../../components/Searchbar';
import AggregatedSearchBar from '../../components/AggregatedSearchBar';
import AggridTable from '../../components/AggridTable';
import AggridTableForPaginationTable from '../../components/AggridTableForPaginationTable.js';
import LoadingButton from '@mui/lab/LoadingButton';
import { v4 as uuidv4 } from 'uuid';
import { paidOpt, statusOpt } from '../../components/Componentkeyword';

const useStyles = makeStyles((theme) => ({
  inputs: {
    display: 'none',
  },
  preview: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: theme.spacing(2),
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

function ManualMaster({ sendDataToParentUIManual, stockmaterialedit, handleCloseviewalertvendormanual }) {
  let Expensetotal = 0;
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const [searchedString, setSearchedString] = useState('');
  const [isHandleChange, setIsHandleChange] = useState(false);
  const gridRefTableImg = useRef(null);
  const gridRefTable = useRef(null);
  const [totalAmount, setAmount] = useState(0);
  const [totalAmountEdit, setAmountEdit] = useState(0);
  const [frequencyValue, setFrequencyValue] = useState('');
  const [frequencyValueedit, setFrequencyValueedit] = useState('');

  const [refImgWarrantyEdit, setRefImgWarrantyEdit] = useState([]);
  const [refImgWarrantyBillEdit, setRefImgWarrantyBillEdit] = useState([]);

  const [refImgWarrantyfilenamesEdit, setRefImgWarrantyfilenamesEdit] = useState([]);
  const [refImgbillfilenamesEdit, setRefImgbillfilenamesEdit] = useState([]);

  const [groupedVendorNamesedit, setGroupedVendorNamesedit] = useState([]);



  // State to track advanced filter
  const [advancedFilter, setAdvancedFilter] = useState(null);
  const [gridApi, setGridApi] = useState(null);
  const [columnApi, setColumnApi] = useState(null);
  const [filteredDataItems, setFilteredDataItems] = useState([]);
  //  const [filteredRowData, setFilteredRowData] = useState([]);
  const [logicOperator, setLogicOperator] = useState('AND');

  const [selectedColumn, setSelectedColumn] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('Contains');
  const [filterValue, setFilterValue] = useState('');
  const [additionalFilters, setAdditionalFilters] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const conditions = ['Contains', 'Does Not Contain', 'Equals', 'Does Not Equal', 'Begins With', 'Ends With', 'Blank', 'Not Blank']; // AgGrid-like conditions

  const [overallFilterdata, setOverallFilterdata] = useState([]);
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const particularModeOptions = [
    { label: 'Stock Material', value: 'Stock Material' },
    // { label: "Others", value: "Others" },
  ];

  const [stockCategoryAuto, setStockCategoryAuto] = useState('');
  const [stockItemAuto, setStockItemAuto] = useState('');

  const [isErrorOpenAmount, setIsErrorOpenAmount] = useState(false);

  //amount mismatch Popup model
  const handleClickOpenerrAmount = () => {
    setIsErrorOpenAmount(true);
  };
  const handleCloseerrAmount = () => {
    setIsErrorOpenAmount(false);
  };

  //state and method to show current date onload
  let today1 = new Date();
  var dd = String(today1.getDate()).padStart(2, '0');
  var mm = String(today1.getMonth() + 1).padStart(2, '0');
  var yyyy = today1.getFullYear();
  let formattedDate = yyyy + '-' + mm + '-' + dd;
  //useStates
  const [date, setDate] = useState(formattedDate);
  const [expensecreate, setExpensecreate] = useState({
    expansecategory: 'Please Select Expense Category',
    expansesubcategory: 'Please Select Expense Sub Category',
    referenceno: '',
    company: 'Please Select Company',
    branch: 'Please Select Branch',
    unit: 'Please Select Unit',
    vendorname: 'Please Select Vendor',
    purpose: 'Please Select Purpose',
    totalbillamount: '',
    date,
    files: '',
    vendorfrequency: '',
    paidstatus: 'Not Paid',
    duedate: '',
    expansenote: '',
    paidmode: 'Please Select Paid Mode',
    expensetotal: '',
    balanceamount: '',
    paidamount: '',
  });

  const [expensecreateedit, setExpensecreateedit] = useState({
    expansecategory: 'Please Select Expense Category',
    expansesubcategory: 'Please Select Expense Sub Category',
    referenceno: '',
    company: 'Please Select Company',
    branch: 'Please Select Branch',
    unit: 'Please Select Unit',
    vendorname: 'Please Select Vendor',
    purpose: 'Please Select Purpose',
    totalbillamount: '',
    date,
    files: '',
    duedate: "",
    vendorfrequency: '',
    paidstatus: 'Not Paid',
    duedate: '',
    expansenote: '',
    paidmode: 'Please Select Paid Mode',
    expensetotal: '',
    balanceamount: '',
    paidamount: '',
  });

  const [vendorstockedit, setVendorNewstockedit] = useState({
    bankname: '',
    bankbranchname: '',
    accountholdername: '',
    accountnumber: '',
    ifsccode: '',
    upinumber: '',
    chequenumber: '',
    cardnumber: '',
    cardholdername: '',
    cardtransactionnumber: '',
    cardtype: '',
    cardmonth: '',
    cardyear: '',
    cardsecuritycode: '',
  });

  const [todoDetails, setTodoDetails] = useState({
    particularmode: 'Please Select Particular Mode',
    category: 'Please Select Category',
    subcategory: 'Please Select Sub Category',
    materialnew: 'Please Select Item Name',
    uomnew: '',
    rate: '',
    quantitynew: '',
    amount: '',
    productdetailsnew: '',
  });

  const [vendorstock, setVendorNewstock] = useState({
    bankname: '',
    bankbranchname: '',
    accountholdername: '',
    accountnumber: '',
    ifsccode: '',
    upinumber: '',
    chequenumber: '',
    cardnumber: '',
    cardholdername: '',
    cardtransactionnumber: '',
    cardtype: '',
    cardmonth: '',
    cardyear: '',
    cardsecuritycode: '',
  });

  const [educationtodo, setEducationtodo] = useState([]);
  const [upload, setUpload] = useState([]);
  const [expanseOpt, setExpanse] = useState([]);
  const [expansesubOpt, setExpanseSub] = useState([]);
  const [groupedVendorNames, setGroupedVendorNames] = useState([]);
  const [vendorId, setVendorId] = useState('');
  const [vendorModeOfPayments, setVendorModeOfPayments] = useState([]);
  const [espenseCheck, setExpenseCheck] = useState(false);
  const [purposes, setPurposes] = useState([]);

  const [stockCategoryOptions, setStockCategoryOptions] = useState([]);
  const [allStockValues, setAllStockValues] = useState([]);
  const [allStockCategory, setAllStockCategory] = useState([]);
  const [itemAllShow, setItemAllShow] = useState(true);

  //get stock items.
  const fetchStockItems = async () => {
    try {
      let res_status = await axios.get(SERVICE.MANAGESTOCKITEMS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setAllStockValues(res_status?.data?.managestockitems);
      setStockItemAuto('');
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const getStockCategory = async () => {
    try {
      let response = await axios.get(`${SERVICE.STOCKCATEGORY}`, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      setStockCategoryOptions(
        response?.data?.stockcategory.map((item) => {
          return {
            label: item.categoryname,
            value: item.categoryname,
          };
        })
      );
      setAllStockCategory(response?.data?.stockcategory);
      setStockCategoryAuto('');
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    getStockCategory();
    fetchStockItems();
  }, []);

  const [stock, setStock] = useState([]);
  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState('');
  const [popupSeverityMalert, setPopupSeverityMalert] = useState('');
  const handleClickOpenPopupMalert = () => {
    setOpenPopupMalert(true);
    setBtnSubmit(false);
  };
  const handleClosePopupMalert = () => {
    setOpenPopupMalert(false);
    setBtnSubmit(false);
  };
  const [openPopup, setOpenPopup] = useState(false);
  const [popupContent, setPopupContent] = useState('');
  const [popupSeverity, setPopupSeverity] = useState('');
  const handleClickOpenPopup = () => {
    setOpenPopup(true);
    setBtnSubmit(false);
    setBtnSubmit(false);
  };
  const handleClosePopup = () => {
    setOpenPopup(false);
    setBtnSubmit(false);
  };

  const { isUserRoleCompare, buttonStyles, isAssignBranch, isUserRoleAccess, pageName, setPageName, allCompany, allBranch, allUnit, allTeam } = useContext(UserRoleAccessContext);

  let exportColumnNames = [
    'Company',
    'Branch',
    'Unit',
    'Floor',
    'Area',
    'Location',
    'Request Mode For',
    'Asset Head',
    'Material',
    'Warranty',
    'Purchasedate',
    'Dealer Name',
    'Gst No',
    'Bill Number',
    'Product Details',
    'Warranty Details',
    'Quantity',
    'Quantity & UOM',
    'Rate',
    'Bill Amount',
    'Bill Date',
    'Vendor Group',
    'Vendor Name',
  ];
  let exportRowValues = [
    'company',
    'branch',
    'unit',
    'floor',
    'area',
    'location',
    'requestmode',
    'producthead',
    'productname',
    'warranty',
    'purchasedate',
    'vendorname',
    'gstno',
    'billno',
    'productdetails',
    'warrantydetails',
    'quantity',
    'uom',
    'rate',
    'totalbillamount',
    'billdate',
    'vendorgroup',
    'vendorname',
  ];

  //Access Module
  const pathname = window.location.pathname;
  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String('Manual Stock Entry'),
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
    getapi();
  }, []);

  const [assetSpecificationType, setAssetSpecificationType] = useState({
    name: '',
    code: '',
  });
  const [assetModel, setAssetModel] = useState({ name: '', code: '' });
  const [assetSize, setAssetSize] = useState({ name: '', code: '' });
  const [assetVariant, setAssetVariant] = useState({ name: '', code: '' });
  const [brandMaster, setBrandMaster] = useState({ name: '', code: '' });

  const [btnSubmit, setBtnSubmit] = useState(false);

  const [vendorOpt, setVendoropt] = useState([]);
  const [vendorOptEdit, setVendoroptEdit] = useState([]);

  //new changes
  const requestModeOptions = [
    { label: 'Asset Material', value: 'Asset Material' },
    { label: 'Stock Material', value: 'Stock Material' },
  ];
  const vendorModeOptions = [
    { label: 'Manual', value: 'Manual', _id: '' },
    { label: 'Old Stock', value: 'Old Stock', _id: '' },
    { label: 'Unknown', value: 'Unknown', _id: '' },
  ];

  const [isStockMaterial, setIsStockMaterial] = useState(false);
  const [categoryOption, setCategoryOption] = useState([]);
  const [subcategoryOpt, setSubcategoryOption] = useState([]);
  const [materialOptNew, setMaterialoptNew] = useState([]);
  const [uomOpt, setUomOpt] = useState([]);

  const [changeTable, setChangeTable] = useState([]);

  const [stockmaster, setStockmaster] = useState({
 company: stockmaterialedit.company,
    branch: stockmaterialedit.branch,
    unit: stockmaterialedit.unit,
    floor: stockmaterialedit.floor,
    area: stockmaterialedit.area,
    location: stockmaterialedit.location,
    totalbillamount: '',
    workstation: 'Please Select Workstation',
    workcheck: false,
    producthead: '',
    totalbillamount: '',
    vendorname: 'Please Select Vendor',
    productname: 'Please Select Material',
    component: 'Please Select Component',
    gstno: '',
    billno: '',
    assettype: '',
    asset: '',
    productdetails: '',
    warrantydetails: '',
    uom: 'Please Select UOM',
    quantity: 1,
    rate: '',
    billdate: '',
    files: '',
    warrantyfiles: '',

    warranty: 'Yes',
    warrantycalculation: '',
    estimation: '',
    estimationtime: 'Days',
    purchasedate: '',

    addedby: '',
    updatedby: '',

    requestmode: 'Stock Material',
    stockcategory: 'Please Select Stock Category',
    stocksubcategory: 'Please Select Stock Sub Category',
    uomnew: '',
    quantitynew: 1,
    materialnew: 'Please Select Material',
    productdetailsnew: '',
  });

  const [stockmasteredit, setStockmasteredit] = useState({
    company: 'Please Select Company',
    branch: 'Please Select Branch',
    unit: 'Please Select Unit',
    floor: 'Please Select Floor',
    area: 'Please Select Area',
    location: 'Please Select Location',
    workstation: 'Please Select Workstation',
    producthead: '',
    vendorname: 'Please Select Vendor',

    productname: 'Please Select Material',

    component: 'Please Select Component',
    gstno: '',
    billno: '',
    productdetails: '',
    warrantydetails: '',
    uom: 'Please Select UOM',
    quantity: 1,
    rate: '',
    billdate: '',
    files: '',
    warrantyfiles: '',

    warranty: '',
    warrantycalculation: '',
    estimation: '',
    estimationtime: '',
    purchasedate: '',

    requestmode: 'Please Select Stock Mode For',
    stockcategory: 'Please Select Stock Category',
    stocksubcategory: 'Please Select Stock Sub Category',
    uomnew: '',
    quantitynew: 1,
    materialnew: 'Please Select Material',
    productdetailsnew: '',
  });

  const [stockArray, setStockArray] = useState([]);
  const [uomcodes, setuomcodes] = useState([]);

  const [vendorGroup, setVendorGroup] = useState('Choose Vendor Group');
  const [vendorGroupOpt, setVendorGroupopt] = useState([]);
  const [vendorOverall, setVendorOverall] = useState([]);
  const [vendorGroupEdit, setVendorGroupEdit] = useState('Choose Vendor Group');
  const handleStockArray = () => {
    const isNameMatch = stockArray.some((item) => item.materialnew == stockmaster.materialnew && item.uomnew === String(stockmaster.uomnew) && item.quantitynew == stockmaster.quantitynew);
    if (stockmaster.stockcategory === 'Please Select Stock Category' || stockmaster.stockcategory === '') {
      setPopupContentMalert('Please Select Stock Category!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (stockmaster.stocksubcategory === 'Please Select Stock Sub Category' || stockmaster.stocksubcategory === '') {
      setPopupContentMalert('Please Select Stock Sub Category!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (stockmaster.materialnew === 'Please Select Material' || stockmaster.materialnew === '') {
      setPopupContentMalert('Please Select Material!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (stockmaster.uomnew === '' || stockmaster.uomnew === undefined) {
      setPopupContentMalert('Please Enter UOM!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (stockmaster.quantitynew === '' || stockmaster.quantitynew === undefined) {
      setPopupContentMalert('Please Enter Quantityy!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    }
    // else if (stockmaster.productdetailsnew === "" || stockmaster.productdetailsnew === undefined) {
    //   setShowAlert(
    //     <>
    //       {" "}
    //       <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}>Please Enter Product Details</p>{" "}
    //     </>
    //   );
    //   handleClickOpenerr();
    // }
    else if (isNameMatch) {
      setPopupContentMalert('Todo Data Already Exist!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else {
      try {
        let findData = uomcodes.find((item) => item.name === stockmaster.uomnew);

        setStockArray([
          ...stockArray,
          {
            uomnew: stockmaster.uomnew,
            quantitynew: stockmaster.quantitynew,
            materialnew: stockmaster.materialnew,
            productdetailsnew: stockmaster.productdetailsnew,
            totalbillamount: totalAmount,
            uomcodenew: findData.code,
          },
        ]);

        setStockmaster({
          ...stockmaster,
          uomnew: '',
          quantitynew: 1,
          materialnew: 'Please Select Material',
          productdetailsnew: '',
        });
      } catch (e) {
        setPopupContentMalert('UOM is not found! Hence cannot get a UOM Code!');
        setPopupSeverityMalert('info');
        handleClickOpenPopupMalert();
      }
    }
  };

  const deleteTodo = (index) => {
    setStockArray(
      stockArray.filter((data, indexcurrent) => {
        return indexcurrent !== index;
      })
    );
  };

  //get all branches.
  const fetchCategoryAll = async () => {
    try {
      let res_location = await axios.get(SERVICE.STOCKCATEGORY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setCategoryOption([
        ...res_location?.data?.stockcategory?.map((t) => ({
          ...t,
          label: t.categoryname,
          value: t.categoryname,
        })),
      ]);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const [vendorOptInd, setVendoroptInd] = useState([]);
  const handleChangeGroupNameIndexBased = async (e, index) => {
    let foundDatas = vendorOverall
      .filter((data) => {
        return data.name == e.value;
      })
      .map((item) => item.vendor);

    let res = await axios.get(SERVICE.ALL_VENDORDETAILS, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
    });
    const all = [
      ...res?.data?.vendordetails.map((d) => ({
        ...d,
        label: d.vendorname,
        value: d.vendorname,
      })),
    ];

    let final = all.filter((data) => {
      return foundDatas.includes(data.value);
    });

    let spreaded = [...vendorOptInd];
    spreaded[index] = final;

    setVendoroptInd(spreaded);
  };

  const [vendorOptIndEdit, setVendoroptIndEdit] = useState([]);

  const handleChangeGroupNameIndexBasedEdit = async (e, index) => {
    let foundDatas = vendorOverall
      .filter((data) => {
        return data.name == e.value;
      })
      .map((item) => item.vendor);

    let res = await axios.get(SERVICE.ALL_VENDORDETAILS, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
    });
    const all = [
      ...res?.data?.vendordetails.map((d) => ({
        ...d,
        label: d.vendorname,
        value: d.vendorname,
      })),
    ];

    let final = all.filter((data) => {
      return foundDatas.includes(data.value);
    });

    let spreaded = [...vendorOptInd];
    spreaded[index] = final;

    setVendoroptIndEdit(spreaded);
  };

  const [stockMaterial, setStockMaterial] = useState([]);
  //get all project.
  const fetchStockStockMaterial = async () => {
    try {
      let res_project = await axios.get(SERVICE.MANUAL_STOCKPURCHASE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      // setProjectCheck(true);
      let filteredData = res_project?.data?.manualstock.filter((data) => {
        return data.requestmode === 'Stock Material';
      });
      setStockMaterial(filteredData);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //get all vom master name.
  const fetchVomMaster = async (e) => {
    try {
      let res_vom = await axios.get(SERVICE.MANAGESTOCKITEMS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let getdata = res_vom.data.managestockitems.filter((data) => {
        return data.itemname === e.value && data.stockcategory === stockmaster.stockcategory && data.stocksubcategory === stockmaster.stocksubcategory;
      });

      setStockmaster((prev) => ({
        ...prev,
        uomnew: getdata[0].uom,
      }));
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const fetchSubcategoryBased = async (e) => {
    try {
      let res_category = await axios.get(SERVICE.STOCKCATEGORY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let data_set = res_category.data.stockcategory.filter((data) => {
        return e.value === data.categoryname;
      });

      let subcatOpt = data_set
        ?.map((item) => {
          return item.subcategoryname.map((subcategory) => {
            return {
              label: subcategory,
              value: subcategory,
            };
          });
        })
        .flat();
      setSubcategoryOption(subcatOpt);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const fetchMaterialNew = async (e) => {
    try {
      let res = await axios.get(SERVICE.MANAGESTOCKITEMS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const resultall = res.data.managestockitems.filter((data) => {
        return data.stockcategory === stockmaster.stockcategory && data.stocksubcategory === e.value;
      });

      const assetmaterialuniqueArray = resultall.map((item) => ({
        label: item.itemname,
        value: item.itemname,
      }));

      setMaterialoptNew(assetmaterialuniqueArray);
      // setMaterialoptEditNew(assetmaterialuniqueArray);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //alert model for Type details
  const [openCapacity, setOpenCapacity] = useState(false);
  // view model
  const handleClickOpenCapacity = () => {
    setOpenCapacity(true);
  };

  const handleClickCloseCapacity = () => {
    setOpenCapacity(false);
    setcapacityname('');
  };

  //alert model for Type details
  const [opentype, setOpenType] = useState(false);
  // view model
  const handleClickOpenType = () => {
    setOpenType(true);
  };

  const handleClickCloseType = () => {
    setOpenType(false);
    setAssetSpecificationType({ name: '', code: '' });
  };

  //alert model for Model details
  const [openmodel, setOpenmodel] = useState(false);
  // view model
  const handleClickOpenModel = () => {
    setOpenmodel(true);
  };

  const handleClickCloseModel = () => {
    setOpenmodel(false);
    setAssetModel({ name: '', code: '' });
  };

  //alert model for Size details
  const [opensize, setOpensize] = useState(false);
  // view model
  const handleClickOpenSize = () => {
    setOpensize(true);
  };

  const handleClickCloseSize = () => {
    setOpensize(false);
    setAssetSize({ name: '', code: '' });
  };

  //alert model for Variant details
  const [openvariant, setOpenvariant] = useState(false);
  // view model
  const handleClickOpenVariant = () => {
    setOpenvariant(true);
  };

  const handleClickCloseVariant = () => {
    setOpenvariant(false);
    setAssetVariant({ name: '', code: '' });
  };

  //alert model for Brand details
  const [openbrand, setOpenbrand] = useState(false);
  // view model
  const handleClickOpenBrand = () => {
    setOpenbrand(true);
  };

  const handleClickCloseBrand = () => {
    setOpenbrand(false);
    setBrandMaster({ name: '', code: '' });
  };

  //  Datefield
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + '-' + mm + '-' + dd;

  const gridRef = useRef(null);

  const [vomMaster, setVomMaster] = useState({
    name: '',
  });
  const [vomMasterget, setVomMasterget] = useState([]);

  const [assetmaster, setAssetmaster] = useState([]);

  const [asset, setAsset] = useState({
    name: '',
    materialcode: '',
    assethead: '',
  });
  const [vendorAuto, setVendorAuto] = useState('');
  const [selectedassethead, setSelectedAssethead] = useState('Please Select Assethead');

  const handleAssetChange = (e) => {
    const selectedassethead = e.value;
    setSelectedAssethead(selectedassethead);
  };

  const [vendor, setVendor] = useState({
    vendorname: '',
    emailid: '',
    phonenumber: '',
    whatsappnumber: '',
    contactperson: '',
    address: '',
    gstnumber: '',
    bankname: 'Please Select Bank Name',
    accountname: '',
    accountnumber: '',
    ifsccode: '',
    phonecheck: false,
  });

  const maxLength = 15;

  //bank name options
  const accounttypes = [
    { value: 'ALLAHABAD BANK', label: 'ALLAHABAD BANK' },
    { value: 'ANDHRA BANK', label: 'ANDHRA BANK' },
    { value: 'AXIS BANK', label: 'AXIS BANK' },
    { value: 'STATE BANK OF INDIA', label: 'STATE BANK OF INDIA' },
    { value: 'BANK OF BARODA', label: 'BANK OF BARODA' },
    { value: 'CITY UNION BANK', label: 'CITY UNION BANK' },
    { value: 'UCO BANK', label: 'UCO BANK' },
    { value: 'TMB BANK', label: 'TMB BANK' },
    { value: 'UNION BANK OF INDIA', label: 'UNION BANK OF INDIA' },
    { value: 'BANK OF INDIA', label: 'BANK OF INDIA' },
    { value: 'BANDHAN BANK LIMITED', label: 'BANDHAN BANK LIMITED' },
    { value: 'CANARA BANK', label: 'CANARA BANK' },
    { value: 'GRAMIN VIKASH BANK', label: 'GRAMIN VIKASH BANK' },
    { value: 'CORPORATION BANK', label: 'CORPORATION BANK' },
    { value: 'INDIAN BANK', label: 'INDIAN BANK' },
    { value: 'INDIAN OVERSEAS BANK', label: 'INDIAN OVERSEAS BANK' },
    { value: 'ORIENTAL BANK OF COMMERCE', label: 'ORIENTAL BANK OF COMMERCE' },
    { value: 'PUNJAB AND SIND BANK', label: 'PUNJAB AND SIND BANK' },
    { value: 'PUNJAB NATIONAL BANK', label: 'PUNJAB NATIONAL BANK' },
    { value: 'RESERVE BANK OF INDIA', label: 'RESERVE BANK OF INDIA' },
    { value: 'SOUTH INDIAN BANK', label: 'SOUTH INDIAN BANK' },
    { value: 'UNITED BANK OF INDIA', label: 'UNITED BANK OF INDIA' },
    { value: 'CENTRAL BANK OF INDIA', label: 'CENTRAL BANK OF INDIA' },
    { value: 'VIJAYA BANK', label: 'VIJAYA BANK' },
    { value: 'DENA BANK', label: 'DENA BANK' },
    {
      value: 'BHARATIYA MAHILA BANK LIMITED',
      label: 'BHARATIYA MAHILA BANK LIMITED',
    },
    { value: 'FEDERAL BANK LTD', label: 'FEDERAL BANK LTD' },
    { value: 'HDFC BANK LTD', label: 'HDFC BANK LTD' },
    { value: 'ICICI BANK LTD', label: 'ICICI BANK LTD' },
    { value: 'IDBI BANK LTD', label: 'IDBI BANK LTD' },
    { value: 'PAYTM BANK', label: 'PAYTM BANK' },
    { value: 'FINO PAYMENT BANK', label: 'FINO PAYMENT BANK' },
    { value: 'INDUSIND BANK LTD', label: 'INDUSIND BANK LTD' },
    { value: 'KARNATAKA BANK LTD', label: 'KARNATAKA BANK LTD' },
    { value: 'KOTAK MAHINDRA BANK', label: 'KOTAK MAHINDRA BANK' },
    { value: 'YES BANK LTD', label: 'YES BANK LTD' },
    { value: 'SYNDICATE BANK', label: 'SYNDICATE BANK' },
    { value: 'BANK OF MAHARASHTRA', label: 'BANK OF MAHARASHTRA' },
    { value: 'DCB BANK', label: 'DCB BANK' },
    { value: 'IDFC BANK', label: 'IDFC BANK' },
    {
      value: 'JAMMU AND KASHMIR BANK BANK',
      label: 'JAMMU AND KASHMIR BANK BANK',
    },
    { value: 'KARUR VYSYA BANK', label: 'KARUR VYSYA BANK' },
    { value: 'RBL BANK', label: 'RBL BANK' },
    { value: 'DHANLAXMI BANK', label: 'DHANLAXMI BANK' },
    { value: 'CSB BANK', label: 'CSB BANK' },
  ];

  const getPhoneNumber = () => {
    if (vendor.phonecheck) {
      setVendor({ ...vendor, whatsappnumber: vendor.phonenumber });
    } else {
      setVendor({ ...vendor, whatsappnumber: '' });
    }
  };

  useEffect(() => {
    getPhoneNumber();
  }, [vendor.phonecheck, vendor.phonenumber]);

  //Bill upload create

  const [getImg, setGetImg] = useState(null);
  const [refImage, setRefImage] = useState([]);
  const [previewURL, setPreviewURL] = useState(null);
  const [file, setFile] = useState();

  // Upload Popup
  const [uploadPopupOpen, setUploadPopupOpen] = useState(false);
  const handleClickUploadPopupOpen = () => {
    setUploadPopupOpen(true);
  };
  const handleUploadPopupClose = () => {
    setUploadPopupOpen(false);
  };

  //first allexcel....
  const getFileIcon = (fileName) => {
    const extension1 = fileName?.split('.').pop();
    switch (extension1) {
      case 'pdf':
        return pdfIcon;
      case 'doc':
      case 'docx':
        return wordIcon;
      case 'xls':
      case 'xlsx':
        return excelIcon;
      case 'csv':
        return csvIcon;
      default:
        return fileIcon;
    }
  };

  const [refImgWarranty, setRefImgWarranty] = useState([]);
  const [refImgWarrantyBill, setRefImgWarrantyBill] = useState([]);

  const [refImgWarrantyfilenames, setRefImgWarrantyfilenames] = useState([]);
  const [refImgbillfilenames, setRefImgbillfilenames] = useState([]);

  //reference images
  // const handleInputChange = (event) => {
  //   const files = event.target.files;
  //   let newSelectedFiles = [...refImage];

  //   for (let i = 0; i < files.length; i++) {
  //     const file = files[i];
  //     // Check if the file is an image
  //     if (file.type.startsWith("image/")) {
  //       if (file.size <= 5 * 1024 * 1024) {
  //         const reader = new FileReader();
  //         reader.onload = () => {
  //           newSelectedFiles.push({
  //             name: file.name,
  //             size: file.size,
  //             type: file.type,
  //             preview: reader.result,
  //             base64: reader.result.split(",")[1],
  //           });
  //           setRefImage(newSelectedFiles);
  //         };
  //         reader.readAsDataURL(file);
  //       } else {
  //         setPopupContentMalert("File size should be less than 5MB!");
  //         setPopupSeverityMalert("info");
  //         handleClickOpenPopupMalert();
  //       }
  //     } else {
  //       setPopupContentMalert("Only Accept Images!");
  //       setPopupSeverityMalert("info");
  //       handleClickOpenPopupMalert();
  //     }
  //   }
  // };

  const handleInputChange = (event) => {
    const files = event.target.files;
    let newSelectedFiles = [...refImage];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Check if the file is an image
      if (file.type.startsWith('image/')) {
        if (file.size <= 5 * 1024 * 1024) {
          const reader = new FileReader();
          reader.onload = () => {
            newSelectedFiles.push({
              name: file.name,
              size: file.size,
              type: file.type,
              preview: reader.result,
              base64: reader.result.split(',')[1],
            });
            setRefImage(newSelectedFiles);
            setRefImgbillfilenames(newSelectedFiles.map((d) => d.name));

            setRefImgWarrantyBill((existingFiles) => [...existingFiles, file]);
          };
          reader.readAsDataURL(file);
        } else {
          setPopupContentMalert('File size should be less than 5MB!');
          setPopupSeverityMalert('info');
          handleClickOpenPopupMalert();
        }
      } else {
        setPopupContentMalert('Only Accept Images!');
        setPopupSeverityMalert('info');
        handleClickOpenPopupMalert();
      }
    }
  };

  //first deletefile
  const handleDeleteFile = (index) => {
    const newSelectedFiles = [...refImage];
    newSelectedFiles.splice(index, 1);
    setRefImage(newSelectedFiles);
  };

  const renderFilePreview = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    window.open(link, '_blank');
  };

  const resetImage = () => {
    setGetImg('');
    setFile('');
    setRefImage([]);
    setPreviewURL(null);
  };

  const handleUploadOverAll = () => {
    setUploadPopupOpen(false);
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewURL(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  // upload warranty

  const [getImgwarranty, setGetImgwarranty] = useState(null);
  const [refImagewarranty, setRefImagewarranty] = useState([]);
  const [previewURLwarranty, setPreviewURLwarranty] = useState(null);
  const [valNumwarranty, setValNumwarranty] = useState(0);
  const [filewarranty, setFilewarranty] = useState();

  // Upload Popup
  const [uploadPopupOpenwarranty, setUploadPopupOpenwarranty] = useState(false);
  const handleClickUploadPopupOpenwarranty = () => {
    setUploadPopupOpenwarranty(true);
  };
  const handleUploadPopupClosewarranty = () => {
    setUploadPopupOpenwarranty(false);
    // setGetImgwarranty("");
    // setFilewarranty("");
    // setPreviewURLwarranty(null);
  };

  //first allexcel....
  const getFileIconwarranty = (fileName) => {
    const extension1 = fileName?.split('.').pop();
    switch (extension1) {
      case 'pdf':
        return pdfIcon;
      case 'doc':
      case 'docx':
        return wordIcon;
      case 'xls':
      case 'xlsx':
        return excelIcon;
      case 'csv':
        return csvIcon;
      default:
        return fileIcon;
    }
  };

  //reference images
  // const handleInputChangewarranty = (event) => {
  //   const files = event.target.files;
  //   let newSelectedFiles = [...refImagewarranty];

  //   for (let i = 0; i < files.length; i++) {
  //     const file = files[i];
  //     // Check if the file is an image
  //     if (file.type.startsWith("image/")) {
  //       if (file.size <= 5 * 1024 * 1024) {
  //         const reader = new FileReader();
  //         reader.onload = () => {
  //           newSelectedFiles.push({
  //             name: file.name,
  //             size: file.size,
  //             type: file.type,
  //             preview: reader.result,
  //             base64: reader.result.split(",")[1],
  //           });
  //           setRefImagewarranty(newSelectedFiles);
  //         };
  //         reader.readAsDataURL(file);
  //       } else {
  //         setPopupContentMalert("File size should be less than 5MB!");
  //         setPopupSeverityMalert("info");
  //         handleClickOpenPopupMalert();
  //       }

  //     } else {
  //       setPopupContentMalert("Only Accept Images!");
  //       setPopupSeverityMalert("info");
  //       handleClickOpenPopupMalert();
  //     }
  //   }
  // };

  const handleInputChangewarranty = (event) => {
    const files = event.target.files;
    let newSelectedFiles = [...refImagewarranty];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Check if the file is an image
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          newSelectedFiles.push({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: reader.result,
            base64: reader.result.split(',')[1],
          });
          setRefImagewarranty(newSelectedFiles);
          setRefImgWarrantyfilenames(newSelectedFiles.map((d) => d.name));
          setRefImgWarranty((existingFiles) => [...existingFiles, file]);
        };
        reader.readAsDataURL(file);
      } else {
        setPopupContentMalert('Only Accept Images!');
        setPopupSeverityMalert('info');
        handleClickOpenPopupMalert();
      }
    }
  };

  //first deletefile
  const handleDeleteFilewarranty = (index) => {
    const newSelectedFiles = [...refImagewarranty];
    newSelectedFiles.splice(index, 1);
    setRefImagewarranty(newSelectedFiles);
  };

  const renderFilePreviewwarranty = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    window.open(link, '_blank');
  };

  const resetImagewarranty = () => {
    setGetImgwarranty('');
    setFilewarranty('');
    setRefImagewarranty([]);
    setPreviewURLwarranty(null);
  };

  const handleUploadOverAllwarranty = () => {
    setUploadPopupOpenwarranty(false);
  };

  const previewFilewarranty = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewURLwarranty(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  //warraty upload edit

  const [getImgwarrantyedit, setGetImgwarrantyedit] = useState(null);
  const [refImagewarrantyedit, setRefImagewarrantyedit] = useState([]);
  const [previewURLwarrantyedit, setPreviewURLwarrantyedit] = useState(null);
  const [valNumwarrantyedit, setValNumwarrantyedit] = useState(0);
  const [filewarrantyedit, setFilewarrantyedit] = useState();

  // Upload Popup
  const [uploadPopupOpenwarrantyedit, setUploadPopupOpenwarrantyedit] = useState(false);
  const handleClickUploadPopupOpenwarrantyedit = () => {
    setUploadPopupOpenwarrantyedit(true);
  };
  const handleUploadPopupClosewarrantyedit = () => {
    setUploadPopupOpenwarrantyedit(false);
    setGetImgwarrantyedit('');
    setFilewarrantyedit('');
    setPreviewURLwarrantyedit(null);
  };

  //first allexcel....
  const getFileIconwarrantyedit = (fileName) => {
    const extension1 = fileName?.split('.').pop();
    switch (extension1) {
      case 'pdf':
        return pdfIcon;
      case 'doc':
      case 'docx':
        return wordIcon;
      case 'xls':
      case 'xlsx':
        return excelIcon;
      case 'csv':
        return csvIcon;
      default:
        return fileIcon;
    }
  };

  //reference images
  // const handleInputChangewarrantyedit = (event) => {
  //   const files = event.target.files;
  //   let newSelectedFiles = [...refImagewarrantyedit];

  //   for (let i = 0; i < files.length; i++) {
  //     const file = files[i];
  //     // Check if the file is an image
  //     if (file.type.startsWith("image/")) {
  //       if (file.size <= 5 * 1024 * 1024) {
  //         const reader = new FileReader();
  //         reader.onload = () => {
  //           newSelectedFiles.push({
  //             name: file.name,
  //             size: file.size,
  //             type: file.type,
  //             preview: reader.result,
  //             base64: reader.result.split(",")[1],
  //           });
  //           setRefImagewarrantyedit(newSelectedFiles);
  //         };
  //         reader.readAsDataURL(file);
  //       } else {
  //         setPopupContentMalert("File size should be less than 5MB!");
  //         setPopupSeverityMalert("info");
  //         handleClickOpenPopupMalert();
  //       }
  //     } else {
  //       setPopupContentMalert("Only Accept Images!");
  //       setPopupSeverityMalert("info");
  //       handleClickOpenPopupMalert();
  //     }
  //   }
  // };

  const handleInputChangewarrantyedit = (event) => {
    const files = event.target.files;
    let newSelectedFiles = Array.isArray(refImagewarrantyedit) ? refImagewarrantyedit : [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Check if the file is an image
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          newSelectedFiles.push({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: reader.result,
            base64: reader.result.split(',')[1],
          });
          setRefImagewarrantyedit(newSelectedFiles);
          setRefImgWarrantyfilenamesEdit(newSelectedFiles.map((d) => d.name));
          setRefImgWarrantyEdit((existingFiles) => [...existingFiles, file]);
        };
        reader.readAsDataURL(file);
      } else {
        setPopupContentMalert('Only Accept Images!');
        setPopupSeverityMalert('info');
        handleClickOpenPopupMalert();
      }
    }
  };

  const handleFetchWarranty = (data) => {
    const files = Array.from(data); // Ensure it's an array
    const imageFiles = files.filter((file) => file.type.startsWith('image/'));

    // if (imageFiles.length !== files.length) {
    //   setPopupContentMalert('Only Accept Images!');
    //   setPopupSeverityMalert('info');
    //   handleClickOpenPopupMalert();
    // }

    const fileReaders = [];
    const newSelectedFiles = [];

    imageFiles.forEach((file) => {
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
      // console.log(newSelectedFiles, "newSelectedFiles");
      setRefImagewarrantyedit(newSelectedFiles);
      setRefImgWarrantyfilenamesEdit(newSelectedFiles.map((d) => d.name));
      setRefImgWarrantyEdit((existingFiles) => [...existingFiles, ...originalFiles]);
    });
  };

  //first deletefile
  const handleDeleteFilewarrantyedit = (index) => {
    const newSelectedFiles = refImagewarrantyedit;
    newSelectedFiles.splice(index, 1);
    setRefImagewarrantyedit(newSelectedFiles);

    setRefImgWarrantyfilenamesEdit(newSelectedFiles.map((d) => d.name));

    const newSelectedFilesUpload = [...refImgWarrantyEdit];
    newSelectedFilesUpload.splice(index, 1);
    setRefImgWarrantyEdit(newSelectedFilesUpload);
  };

  const renderFilePreviewwarrantyedit = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    window.open(link, '_blank');
  };

  const resetImagewarrantyedit = () => {
    setGetImgwarrantyedit('');
    setFilewarrantyedit('');
    setRefImagewarrantyedit([]);
    setPreviewURLwarrantyedit(null);
  };

  const handleUploadOverAllwarrantyedit = () => {
    setUploadPopupOpenwarrantyedit(false);
  };

  const previewFilewarrantyedit = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewURLwarrantyedit(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  //bill upload edit

  const [getImgedit, setGetImgedit] = useState(null);
  const [refImageedit, setRefImageedit] = useState([]);
  const [previewURLedit, setPreviewURLedit] = useState(null);
  const [valNumedit, setValNumedit] = useState(0);
  const [fileedit, setFileedit] = useState();

  // Upload Popup
  const [uploadPopupOpenedit, setUploadPopupOpenedit] = useState(false);
  const handleClickUploadPopupOpenedit = () => {
    setUploadPopupOpenedit(true);
  };
  const handleUploadPopupCloseedit = () => {
    setUploadPopupOpenedit(false);
    setGetImgedit('');
    setFileedit('');
    setPreviewURLedit(null);
  };

  //first allexcel....
  const getFileIconedit = (fileName) => {
    const extension1 = fileName?.split('.').pop();
    switch (extension1) {
      case 'pdf':
        return pdfIcon;
      case 'doc':
      case 'docx':
        return wordIcon;
      case 'xls':
      case 'xlsx':
        return excelIcon;
      case 'csv':
        return csvIcon;
      default:
        return fileIcon;
    }
  };

  //reference images
  // const handleInputChangeedit = (event) => {
  //   const files = event.target.files;
  //   let newSelectedFiles = [...refImageedit];

  //   for (let i = 0; i < files.length; i++) {
  //     const file = files[i];
  //     // Check if the file is an image
  //     if (file.type.startsWith("image/")) {
  //       if (file.size <= 5 * 1024 * 1024) {
  //         const reader = new FileReader();
  //         reader.onload = () => {
  //           newSelectedFiles.push({
  //             name: file.name,
  //             size: file.size,
  //             type: file.type,
  //             preview: reader.result,
  //             base64: reader.result.split(",")[1],
  //           });
  //           setRefImageedit(newSelectedFiles);
  //         };
  //         reader.readAsDataURL(file);
  //       } else {
  //         setPopupContentMalert("File size should be less than 5MB!");
  //         setPopupSeverityMalert("info");
  //         handleClickOpenPopupMalert();
  //       }
  //     } else {
  //       setPopupContentMalert("Only Accept Images!");
  //       setPopupSeverityMalert("info");
  //       handleClickOpenPopupMalert();
  //     }
  //   }
  // };

  const handleInputChangeedit = (event) => {
    const files = event.target.files;
    let newSelectedFiles = [...refImageedit];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Check if the file is an image
      if (file.type.startsWith('image/')) {
        if (file.size <= 5 * 1024 * 1024) {
          const reader = new FileReader();
          reader.onload = () => {
            newSelectedFiles.push({
              name: file.name,
              size: file.size,
              type: file.type,
              preview: reader.result,
              base64: reader.result.split(',')[1],
            });
            setRefImageedit(newSelectedFiles);
            setRefImgbillfilenamesEdit(newSelectedFiles.map((d) => d.name));
            setRefImgWarrantyBillEdit((existingFiles) => [...existingFiles, file]);
          };
          reader.readAsDataURL(file);
        } else {
          setPopupContentMalert('File size should be less than 5MB!');
          setPopupSeverityMalert('info');
          handleClickOpenPopupMalert();
        }
      } else {
        setPopupContentMalert('Only Accept Images!');
        setPopupSeverityMalert('info');
        handleClickOpenPopupMalert();
      }
    }
  };

  //first deletefile

  const handleFetchBill = (data) => {
    const files = Array.from(data); // Ensure it's an array
    const imageFiles = files.filter((file) => file.type.startsWith('image/'));

    // if (imageFiles.length !== files.length) {
    //   setPopupContentMalert('Only Accept Images!');
    //   setPopupSeverityMalert('info');
    //   handleClickOpenPopupMalert();
    // }

    const fileReaders = [];
    const newSelectedFiles = [];

    imageFiles.forEach((file) => {
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
      // console.log(newSelectedFiles, "newSelectedFiles");

      setRefImageedit(newSelectedFiles);
      setRefImgbillfilenamesEdit(newSelectedFiles.map((d) => d.name));
      setRefImgWarrantyBillEdit((existingFiles) => [...existingFiles, originalFiles]);
    });
  };

  const handleDeleteFileedit = (index) => {
    const newSelectedFiles = [...refImageedit];
    newSelectedFiles.splice(index, 1);
    setRefImageedit(newSelectedFiles);

    setRefImgbillfilenamesEdit(newSelectedFiles.map((d) => d.name));

    const newSelectedFilesupload = [...refImgWarrantyBillEdit];
    newSelectedFilesupload.splice(index, 1);
    setRefImgWarrantyBillEdit(newSelectedFilesupload);
  };

  const renderFilePreviewedit = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    window.open(link, '_blank');
  };

  const resetImageedit = () => {
    setGetImgedit('');
    setFileedit('');
    setRefImageedit([]);
    setPreviewURLedit(null);
  };

  const handleUploadOverAlledit = () => {
    setUploadPopupOpenedit(false);
  };

  const previewFileedit = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewURLedit(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const [selectedRows, setSelectedRows] = useState([]);
  const [teamstabledata, setTeamstableData] = useState([]);
  const [account, setAccount] = useState([]);

  const [selectedBranch, setSelectedBranch] = useState('Please Select Branch');
  const [selectedBranchedit, setSelectedBranchedit] = useState('Please Select Branch');
  const [selectedUnit, setSelectedUnit] = useState('Please Select Unit');
  const [selectedUnitedit, setSelectedUnitedit] = useState('Please Select Unit');

  const [assetType, setAssetType] = useState([]);
  const [selectedassetType, setSelectedAssetType] = useState('');
  const [selectedassetTypeEdit, setSelectedAssetTypeEdit] = useState('');

  const [selectedProducthead, setSelectedProducthead] = useState('Please Select Assethead');
  const [selectedProductheadedit, setSelectedProductheadedit] = useState('Please Select Assethead');
  const [selectedProductname, setSelectedProductname] = useState('Please Select Materila Name');
  const [selectedProductnameedit, setSelectedProductnameedit] = useState('Please Select Materila Name');

  const [searchQueryManage, setSearchQueryManage] = useState('');

  //  Datefield
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + '-' + mm + '-' + dd;

  const [selectedPurchaseDate, setSelectedPurchaseDate] = useState('');
  const [selectedPurchaseDateEdit, setSelectedPurchaseDateEdit] = useState('');

  //change form
  const handleChangephonenumber = (e) => {
    // const regex = /^[0-9]+$/;  // Only allows positive integers
    const regex = /^\d*\.?\d*$/;
    const inputValue = e.target.value;
    // Check if the input value matches the regex or if it's empty (allowing backspace)
    if (regex.test(inputValue) || inputValue === '') {
      // Update the state with the valid numeric value
      setStockmaster({ ...stockmaster, estimation: inputValue });
    }
  };

  const handleChangephonenumberEdit = (e) => {
    // const regex = /^[0-9]+$/;  // Only allows positive integers
    const regex = /^\d*\.?\d*$/;
    const inputValue = e.target.value;
    // Check if the input value matches the regex or if it's empty (allowing backspace)
    if (regex.test(inputValue) || inputValue === '') {
      // Update the state with the valid numeric value
      setStockmasteredit({ ...stockmasteredit, estimation: inputValue });
    }
  };

  const handleEstimationChangeEdit = (e) => {
    const { value } = e.target;
    setStockmasteredit({ ...stockmasteredit, estimationtime: value });
    // calculateExpiryDate(value, stockmasteredit.purchasedate);
  };

  const handleEstimationChange = (e) => {
    const { value } = e.target;
    setStockmaster({ ...stockmaster, estimationtime: value });
  };

  const handlePurchaseDateChange = (e) => {
    const { value } = e.target;
    setStockmaster({ ...stockmaster, purchasedate: value });
    setSelectedPurchaseDate(value);
  };

  const handlePurchaseDateChangeEdit = (e) => {
    const { value } = e.target;
    setStockmasteredit({ ...stockmasteredit, purchasedate: value });
    setSelectedPurchaseDateEdit(value);
    // calculateExpiryDateEdit(stockmasterEdit.estimationtime, value);
  };

  const formatDateString = (date) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const calculateExpiryDate = () => {
    if (stockmaster.estimationtime !== '' && stockmaster.purchasedate) {
      const currentDate = new Date(stockmaster.purchasedate);
      let expiryDate = new Date(currentDate);

      if (stockmaster.estimationtime === 'Days') {
        expiryDate.setDate(currentDate.getDate() + parseInt(stockmaster.estimation));
      } else if (stockmaster.estimationtime === 'Month') {
        expiryDate.setMonth(currentDate.getMonth() + parseInt(stockmaster.estimation));
      } else if (stockmaster.estimationtime === 'Year') {
        expiryDate.setFullYear(currentDate.getFullYear() + parseInt(stockmaster.estimation));
      }

      const formattedExpiryDate = formatDateString(expiryDate);

      let formattedempty = formattedExpiryDate.includes('NaN-NaN-NaN') ? '' : formattedExpiryDate;

      setStockmaster({
        ...stockmaster,
        warrantycalculation: formattedempty, // Format date as needed
      });
    }
  };

  useEffect(() => {
    calculateExpiryDate();
  }, [stockmaster.estimationtime, stockmaster.estimation, stockmaster.purchasedate]);

  useEffect(() => {
    calculateExpiryDateEdit();
  }, [stockmasteredit.estimationtime, stockmasteredit.estimation, stockmasteredit.purchasedate]);

  const calculateExpiryDateEdit = () => {
    if (stockmasteredit.estimationtime && stockmasteredit.purchasedate) {
      const currentDate = new Date(stockmasteredit.purchasedate);
      let expiryDate = new Date(currentDate);

      if (stockmasteredit.estimationtime === 'Days') {
        expiryDate.setDate(currentDate.getDate() + parseInt(stockmasteredit.estimation));
      } else if (stockmasteredit.estimationtime === 'Month') {
        expiryDate.setMonth(currentDate.getMonth() + parseInt(stockmasteredit.estimation));
      } else if (stockmasteredit.estimationtime === 'Year') {
        expiryDate.setFullYear(currentDate.getFullYear() + parseInt(stockmasteredit.estimation));
      }

      const formattedExpiryDate = formatDateString(expiryDate);

      let formattedempty = formattedExpiryDate.includes('NaN-NaN-NaN') ? '' : formattedExpiryDate;

      setStockmasteredit({
        ...stockmasteredit,
        warrantycalculation: formattedempty, // Format date as needed
      });
    }
  };

  const fetchAssetType = async () => {
    try {
      let res_account = await axios.get(SERVICE.ALL_ASSETTYPEMASTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const projall = [
        ...res_account?.data?.assettypemaster?.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];
      const aeestuniqueArray = projall.filter((item, index, self) => {
        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
      });
      setAssetType(aeestuniqueArray);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const [stockEdit, setStockEdit] = useState([]);

  //filter fields
  const [companys, setCompanys] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [assettypes, setAssettypes] = useState([]);
  const [branchs, setBranchs] = useState([]);
  const [units, setUnits] = useState([]);
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [newcheckbranch, setNewcheckBranch] = useState('Choose Branch');
  const [floors, setFloors] = useState([]);

  //filter fields
  const [companysEdit, setCompanysEdit] = useState([]);
  const [assettypesEdit, setAssetypesEdit] = useState([]);
  const [branchsEdit, setBranchsEdit] = useState([]);
  const [unitsEdit, setUnitsEdit] = useState([]);

  const [capacities, setCapacities] = useState([]);
  const [capacityname, setcapacityname] = useState('');

  const [areas, setAreas] = useState([]);
  const [locations, setLocations] = useState([{ label: 'ALL', value: 'ALL' }]);
  const [areasEdit, setAreasEdit] = useState([]);
  const [locationsEdit, setLocationsEdit] = useState([{ label: 'ALL', value: 'ALL' }]);
  const [floorsEdit, setFloorEdit] = useState([]);
  const [workStationOpt, setWorkStationOpt] = useState([]);
  const [Specification, setSpecification] = useState([]);
  const [Specificationedit, setSpecificationedit] = useState([]);

  const [materialOpt, setMaterialopt] = useState([]);
  const [materialOptEdit, setMaterialoptEdit] = useState('Please Select Material');

  // const handleVendorChange = (e) => {
  //     const selectedvendorname = e.value;
  //     setSelectedVendorname(selectedvendorname);
  // };

  //alert model for vendor details
  const [openviewalertvendor, setOpenviewalertvendro] = useState(false);
  // view model
  const handleClickOpenviewalertvendor = () => {
    setOpenviewalertvendro(true);
  };

  const handleCloseviewalertvendor = () => {
    setOpenviewalertvendro(false);
  };

  const handleDataFromChild = () => {
    fetchVendorGrouping();
  };

  //alert model for Uom details
  const [openviewalertUom, setOpenviewalertUom] = useState(false);
  // view model
  const handleClickOpenviewalertUom = () => {
    setOpenviewalertUom(true);
  };

  const handleCloseviewalertUom = () => {
    setOpenviewalertUom(false);
  };

  //alert model for Asset details
  const [openviewalertAsset, setOpenviewalertAsset] = useState(false);
  // view model
  const handleClickOpenviewalertAsset = () => {
    setOpenviewalertAsset(true);
  };

  const handleCloseviewalertAsset = () => {
    setOpenviewalertAsset(false);
  };

  const { auth, setAuth } = useContext(AuthContext);
  const [projectCheck, setProjectCheck] = useState(false);
  // const accessbranch = isAssignBranch
  //   ?.map((data) => ({
  //     branch: data.branch,
  //     company: data.company,
  //     unit: data.unit,
  //   }))

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

  const handleBranchChange = (e) => {
    const selectedBranch = e.value;
    setSelectedBranch(selectedBranch);
    setSelectedUnit('Please Select Unit');
  };

  const handleProductChange = (e) => {
    const selectedProducthead = e.value;
    setSelectedProducthead(selectedProducthead);
    setSelectedProductname('Please Select Materila Name');
  };

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();

  const [openview, setOpenview] = useState(false);
  const [openInfo, setOpeninfo] = useState(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteproject, setDeleteproject] = useState({});
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [projectData, setProjectData] = useState([]);
  const [items, setItems] = useState([]);
  const [sorting, setSorting] = useState({ column: '', direction: '' });
  const [searchQuery, setSearchQuery] = useState('');

  const [ovProj, setOvProj] = useState('');
  const [getOverAllCount, setGetOverallCount] = useState('');
  const [ovProjcount, setOvProjcount] = useState(0);
  const [allProjectedit, setAllProjectedit] = useState([]);

  const [checkvendor, setCheckvendor] = useState();
  const [checkcategory, setCheckcategory] = useState();
  const [checksubcategory, setChecksubcategory] = useState();
  const [checktimepoints, setChecktimepoints] = useState();

  const [copiedData, setCopiedData] = useState('');

  const [canvasState, setCanvasState] = useState(false);

  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage
        .toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, 'Asset Purchase.png');
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
    setBtnSubmit(false);
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
    if (selectedRows.length == 0) {
      setIsDeleteOpenalert(true);
    } else {
      setIsDeleteOpencheckbox(true);
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

  const [vendorgetid, setVendorgetid] = useState({});
  const [vendornameid, setVendornameid] = useState('');

  const vendorid = async (id) => {
    try {
      if (id) {
        let res = await axios.get(`${SERVICE.SINGLE_VENDORDETAILS}/${id}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
        setVendorgetid(res?.data?.svendordetails);
        setVendornameid(id);
      } else {
        setVendorgetid({
          ...vendorgetid,
          gstnumber: '',
          address: '',
          phonenumber: '',
        });
        setVendornameid('');
      }
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ''; // This is required for Chrome support
  };

  const username = isUserRoleAccess.username;
  const userData = {
    name: username,
    date: new Date(),
  };

  const classes = useStyles();

  let printsno = 1;

  // Manage Columns
  const [isManageColumnsOpen1, setManageColumnsOpen1] = useState(false);
  const [anchorEl1, setAnchorEl1] = useState(null);

  const handleOpenManageColumns1 = (event) => {
    setAnchorEl1(event.currentTarget);
    setManageColumnsOpen1(true);
  };
  const handleCloseManageColumns1 = () => {
    setManageColumnsOpen1(false);
    setSearchQueryManage('');
  };

  const open = Boolean(anchorEl1);
  const id = open ? 'simple-popover' : undefined;

  // Styles for the resizable column
  const ResizableColumn = styled(Resizable)`
    .react-resizable-handle {
      width: 10px;
      height: 100%;
      position: absolute;
      right: 0;
      bottom: 0;
      cursor: col-resize;
    }
  `;

  const getRowClassName = (params) => {
    if (selectedRows.includes(params.data.id)) {
      return 'custom-id-row'; // This is the custom class for rows with item.tat === 'ago'
    }
    return ''; // Return an empty string for other rows
  };

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    company: true,
    branch: true,
    unit: true,
    floor: true,
    totalbillamount: true,
    area: true,
    location: true,
    requestmode: true,
    gstno: 'true',
    assettype: 'true',
    producthead: 'true',
    productdetails: 'true',
    productname: true,
    vendorname: true,
    billno: true,
    billdate: true,
    quantity: true,
    uom: true,
    rate: true,
    warrantydetails: true,
    warranty: true,
    purchasedate: true,
    asset: true,
    assettype: true,
    material: true,
    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

  const fetchExcelLimited = async () => {
    try {
      let res1 = await axios.get(SERVICE.MANUAL_STOCK_EXCEL_ASSET, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setOverallFilterdata(res1.data.manualstock);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const fetchVendorGrouping = async () => {
    try {
      let res1 = await axios.get(SERVICE.ALL_VENDORGROUPING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setVendorOverall(res1?.data?.vendorgrouping);
      let datas = [
        ...res1?.data?.vendorgrouping?.map((t) => ({
          ...t,
          label: t.name,
          value: t.name,
        })),
      ];
      setVendorGroupopt(datas);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const handleChangeGroupName = async (e) => {
    let foundDatas = vendorOverall
      .filter((data) => {
        return data.name == e.value;
      })
      .map((item) => item.vendor);

    let res = await axios.get(SERVICE.ALL_VENDORDETAILS, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
    });
    const all = [
      ...res?.data?.vendordetails.map((d) => ({
        ...d,
        label: d.vendorname,
        value: d.vendorname,
      })),
    ];

    let final = all.filter((data) => {
      return foundDatas.includes(data.value);
    });
    setVendoropt([
      ...res?.data?.vendordetails
        ?.filter((item) => item.vendorstatus === 'Active')
        ?.map((t) => ({
          ...t,
          label: t.vendorname,
          value: t.vendorname,
        })),
    ]);
    // setVendoropt(final);
  };

  const handleChangeGroupNameEdit = async (e) => {
    console.log(e.value, "valuie")
    let foundDatas = vendorOverall
      .filter((data) => {
        return data.name == e.value;
      })
      .map((item) => item.vendor);

    let res = await axios.get(SERVICE.ALL_VENDORDETAILS, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
    });
    const all = [
      ...res?.data?.vendordetails.map((d) => ({
        ...d,
        label: d.vendorname,
        value: d.vendorname,
      })),
    ];

    let final = all.filter((data) => {
      return foundDatas.includes(data.value);
    });
    setVendoroptEdit([
      ...res?.data?.vendordetails
        ?.filter((item) => item.vendorstatus === 'Active')
        ?.map((t) => ({
          ...t,
          label: t.vendorname,
          value: t.vendorname,
        })),
    ]);

  };

  //set function to get particular row
  const rowData = async (id) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.MANUAL_STOCKPURCHASE_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeleteproject(res?.data?.smanualstock);
      handleClickOpen();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // Alert delete popup
  let projectid = deleteproject._id;
  const delProject = async () => {
    setPageName(!pageName);
    try {
      await axios.delete(`${SERVICE.MANUAL_STOCKPURCHASE_SINGLE}/${projectid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await fetchStock('Filtered');
      await fetchStockStockMaterial();
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
        return axios.delete(`${SERVICE.MANUAL_STOCKPURCHASE_SINGLE}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });

      // Wait for all delete requests to complete
      await Promise.all(deletePromises);

      await fetchStock('Filtered');
      await fetchStockStockMaterial();
      handleCloseModcheckbox();
      setSelectedRows([]);
      setPopupContent('Deleted Successfully');
      setPopupSeverity('success');
      handleClickOpenPopup();
      setSelectAllChecked(false);
      setPage(1);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //add function
  const sendRequest = async () => {
    setPageName(!pageName);
    setChangeTable('new');
    const uniqueId = uuidv4();
    try {
      let stockcreate = await axios.post(SERVICE.MANUAL_STOCKPURCHASE_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: String(stockmaster.company),
        branch: String(stockmaster.branch),
        unit: String(stockmaster.unit),
        floor: String(stockmaster.floor),
        location: String(stockmaster.location),
        area: String(stockmaster.area),
        // totalbillamount: Number(stockmaster.quantity) * Number(stockmaster.rate),
        totalbillamountstock: stockmaster.totalbillamount,
        duedate: String(expensecreate.duedate ? expensecreate.duedate : ""),

        // workstation: String(
        //   stockmaster.workcheck ? stockmaster.workstation : ""
        // ),
        // workcheck: String(stockmaster.workcheck),
        assettype: String(stockmaster.assettype === undefined ? '' : stockmaster.assettype),
        // asset: String(stockmaster.asset),
        productname: String(stockmaster.productname === 'Please Select Material' ? '' : stockmaster.productname),

        component: String(stockmaster.component === 'Please Select Component' ? '' : stockmaster.component),

        producthead: String(stockmaster.producthead === 'Please Select Assethead' ? '' : stockmaster.producthead),

        vendorgroup: String(vendorGroup),
        vendorname: String(vendorNew),
        vendorfrequency: String(frequencyValue === undefined ? '' : frequencyValue),

        vendorid: String(vendornameid) ? String(vendornameid) : '',
        gstno: String(vendorgetid.gstnumber === undefined ? '' : vendorgetid.gstnumber),
        address: String(vendorgetid.address),
        phonenumber: String(vendorgetid.phonenumber),
        billno: Number(stockmaster.billno),
        productdetails: String(stockmaster.productdetails),
        warrantydetails: String(stockmaster.warrantydetails),
        uom: stockmaster.uom === 'Please Select UOM' ? '' : String(stockmaster.uom),
        quantity: Number(stockmaster.quantity),
        rate: Number(stockmaster.rate),
        billdate: String(stockmaster.billdate),
        subcomponent: todos ? [...todos] : [],
        // files: [...refImage],
        // warrantyfiles: [...refImagewarranty],
        warranty: String(stockmaster.warranty),
        estimation: String(stockmaster.estimation),
        estimationtime: String(stockmaster.estimationtime) ? stockmaster.estimationtime : 'Days',
        warrantycalculation: String(stockmaster.warrantycalculation),
        purchasedate: selectedPurchaseDate,
        requestmode: String(stockmaster.requestmode),
        // stockcategory:
        //   stockmaster.stockcategory === "Please Select Stock Category"
        //     ? ""
        //     : String(stockmaster.stockcategory),
        // stocksubcategory:
        //   stockmaster.stocksubcategory === "Please Select Stock Sub Category"
        //     ? ""
        //     : String(stockmaster.stocksubcategory),
        // stockmaterialarray: stockArray,
        filenames: refImgWarrantyfilenames,
        filenamesbill: refImgbillfilenames,

        uniqueId: uniqueId,
        // files: [...refImage],
        // warrantyfiles: [...refImagewarranty],
        warranty: String(stockmaster.warranty),
        estimation: String(stockmaster.estimation),
        estimationtime: String(stockmaster.estimationtime) ? stockmaster.estimationtime : 'Days',
        warrantycalculation: String(stockmaster.warrantycalculation),
        purchasedate: selectedPurchaseDate,

        requestmode: String(stockmaster.requestmode),
        // stockcategory: stockmaster.stockcategory === "Please Select Stock Category" ? "" : String(stockmaster.stockcategory),
        // stocksubcategory: stockmaster.stocksubcategory === "Please Select Stock Sub Category" ? "" : String(stockmaster.stocksubcategory),
        // stockmaterialarray: stockArray,

        tododetails: [...educationtodo],
        paidstatus: String(expensecreate.paidstatus),

        bankname: expensecreate.paidmode === 'Bank Transfer' ? String(vendorstock.bankname) : '',
        bankbranchname: expensecreate.paidmode === 'Bank Transfer' ? String(vendorstock.bankbranchname) : '',
        accountholdername: expensecreate.paidmode === 'Bank Transfer' ? String(vendorstock.accountholdername) : '',
        accountnumber: expensecreate.paidmode === 'Bank Transfer' ? String(vendorstock.accountnumber) : '',
        ifsccode: expensecreate.paidmode === 'Bank Transfer' ? String(vendorstock.ifsccode) : '',

        upinumber: expensecreate.paidmode === 'UPI' ? String(vendorstock.upinumber) : '',

        cardnumber: expensecreate.paidmode === 'Card' ? String(vendorstock.cardnumber) : '',
        cardholdername: expensecreate.paidmode === 'Card' ? String(vendorstock.cardholdername) : '',
        cardtransactionnumber: expensecreate.paidmode === 'Card' ? String(vendorstock.cardtransactionnumber) : '',
        cardtype: expensecreate.paidmode === 'Card' ? String(vendorstock.cardtype) : '',
        cardmonth: expensecreate.paidmode === 'Card' ? String(vendorstock.cardmonth) : '',
        cardyear: expensecreate.paidmode === 'Card' ? String(vendorstock.cardyear) : '',
        cardsecuritycode: expensecreate.paidmode === 'Card' ? String(vendorstock.cardsecuritycode) : '',

        chequenumber: expensecreate.paidmode === 'Cheque' ? String(vendor.chequenumber) : '',

        cash: expensecreate.paidmode === 'Cash' ? String('Cash') : '',

        paidmode: String(expensecreate.paidstatus === 'Not Paid' ? '' : expensecreate.paidmode),
        paidamount: Number(expensecreate.paidstatus === 'Not Paid' ? 0 : expensecreate.paidamount),
        balanceamount: Number(expensecreate.paidstatus === 'Not Paid' ? stockmaster.totalbillamount : expensecreate.balanceamount),
        sortdate: String(expensecreate.paidstatus === 'Not Paid' ? '' : new Date()),
        billstatus: expensecreate.paidstatus === 'Not Paid' ? 'InComplete' : expensecreate.paidstatus === 'Paid' && Number(expensecreate.paidamount) !== Number(Expensetotal) ? 'Partially Paid' : 'Completed',
        paymentduereminderlog:
          expensecreate.paidstatus === 'Paid'
            ? [
              {
                balanceamount: Number(expensecreate.paidstatus === 'Not Paid' ? stockmaster.totalbillamount : expensecreate.balanceamount),
                expensetotal: stockmaster.totalbillamount,
                modeofpayments: expensecreate.paidmode,
                payamountdate: expensecreate.date,
                payamount: Number(expensecreate.paidstatus === 'Not Paid' ? 0 : expensecreate.paidamount),
                bankname: expensecreate.paidmode === 'Bank Transfer' ? String(vendorstock.bankname) : '',
                bankbranchname: expensecreate.paidmode === 'Bank Transfer' ? vendorstock.bankbranchname : '',
                accountholdername: expensecreate.paidmode === 'Bank Transfer' ? vendorstock.accountholdername : '',
                accountnumber: expensecreate.paidmode === 'Bank Transfer' ? vendorstock.accountnumber : '',
                ifsccode: expensecreate.paidmode === 'Bank Transfer' ? vendorstock.ifsccode : '',

                upinumber: expensecreate.paidmode === 'UPI' ? vendorstock.upinumber : '',

                cardnumber: expensecreate.paidmode === 'Card' ? vendorstock.cardnumber : '',
                cardholdername: expensecreate.paidmode === 'Card' ? vendorstock.cardholdername : '',
                cardtransactionnumber: expensecreate.paidmode === 'Card' ? vendorstock.cardtransactionnumber : '',
                cardtype: expensecreate.paidmode === 'Card' ? vendorstock.cardtype : '',
                cardmonth: expensecreate.paidmode === 'Card' ? vendorstock.cardmonth : '',
                cardyear: expensecreate.paidmode === 'Card' ? vendorstock.cardyear : '',
                cardsecuritycode: expensecreate.paidmode === 'Card' ? vendorstock.cardsecuritycode : '',
                chequenumber: expensecreate.paidmode === 'Cheque' ? vendorstock.chequenumber : '',
                addedby: [
                  {
                    name: String(isUserRoleAccess.companyname),
                    date: String(new Date()),
                  },
                ],
              },
            ]
            : [],
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      setBtnSubmit(false);
      await handleFileUpload(refImgWarranty, 'todo', uniqueId);
      await handleFileUpload(refImgWarrantyBill, 'bill', uniqueId);
      setRefImgWarrantyfilenames([]);
       handleCloseviewalertvendormanual();
         sendDataToParentUIManual(true);
      setRefImgbillfilenames([]);
      setPopupContent('Added Successfully');
      setPopupSeverity('success');
      handleClickOpenPopup();
      // setStockmaster(stockcreate.data);

      setStockArray([]);
      setStockmaster({
        ...stockmaster,
        gstno: '',
        billno: '',
        productname: '',
        productdetails: '',
        warrantydetails: '',
        quantity: 1,
        rate: '',
        billdate: '',
        warrantyfiles: '',
        addedby: '',
        updatedby: '',

        warranty: 'Yes',
        warrantycalculation: '',
        estimation: '',
        estimationtime: 'Days',
        purchasedate: '',

        vendorname: 'Please Select Vendor',
        productname: 'Please Select Material',
        component: 'Please Select Component',
      });

      setRefImage([]);
      setFile('');
      setGetImg(null);
      setRefImagewarranty([]);
      setFilewarranty('');
      setGetImgwarranty(null);
      setTodos([]);
      setChangeTable('old');
      setSelectedPurchaseDate('');
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const handleFileUpload = async (selectedFilesall, type, uniqueId) => {
    try {
      // console.log(selectedFilesall, "selectedFilesall");
      let selectedFiles = selectedFilesall;
      // .flatMap(t => [{ ...t.files, uniqueId: t.uniqueId }])
      // let uniqueId = selectedFilesall[0].uniqueId
      // let selectedFiles = selectedFilesall.flatMap(t =>
      //   Array.from(t.files).map(file => ({ ...file, uniqueId: t.uniqueId }))
      // );

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
                  const response = await axios.post(SERVICE.UPLOAD_CHUNK_MANUAL, formData, {
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
  const handleSubmit = async (e) => {
    setBtnSubmit(true);
    setPageName(!pageName);
    e.preventDefault();

    // await fetchStock("Filtered");

    // let vendorEmpty = todos.some((item) => item.vendor == "Choose Vendor");


      const isNameMatch = stockMaterial.some(
        (item) =>
          item.company == stockmaster.company &&
          item.branch == stockmaster.branch &&
          item.unit == stockmaster.unit &&
          item.floor == stockmaster.floor &&
          item.area == stockmaster.area &&
          item.location == stockmaster.location &&
          item.vendorname == stockmaster.vendorname &&
          Number(item.billno) == Number(stockmaster.billno) &&
          // item.productdetailsnew.toLowerCase() == stockmaster.productdetailsnew.toLowerCase() &&
          item.requestmode == stockmaster.requestmode
        // item.stockcategory == stockmaster.stockcategory &&
        // item.stocksubcategory == stockmaster.stocksubcategory &&
        // item.warrantydetails.toLowerCase() == stockmaster.warrantydetails.toLowerCase() &&

        // item.uomnew == stockmaster.uomnew &&
        // item.quantitynew == stockmaster.quantitynew &&
        // item.materialnew == stockmaster.materialnew &&

        // item.rate == stockmaster.rate
        // &&
        // item.billdate == stockmaster.billdate
      );

      if (stockmaster.company === 'Please Select Company') {
        setPopupContentMalert('Please Select Company!');
        setPopupSeverityMalert('info');
        handleClickOpenPopupMalert();
      } else if (stockmaster.branch === 'Please Select Branch') {
        setPopupContentMalert('Please Select Branch!');
        setPopupSeverityMalert('info');
        handleClickOpenPopupMalert();
      } else if (stockmaster.unit === 'Please Select Unit') {
        setPopupContentMalert('Please Select Unit!');
        setPopupSeverityMalert('info');
        handleClickOpenPopupMalert();
      } else if (stockmaster.floor === 'Please Select Floor') {
        setPopupContentMalert('Please Select Floor!');
        setPopupSeverityMalert('info');
        handleClickOpenPopupMalert();
      } else if (stockmaster.area === 'Please Select Area') {
        setPopupContentMalert('Please Select Area!');
        setPopupSeverityMalert('info');
        handleClickOpenPopupMalert();
      } else if (stockmaster.location === 'Please Select Location') {
        setPopupContentMalert('Please Select Location!');
        setPopupSeverityMalert('info');
        handleClickOpenPopupMalert();
      }
      // else if (stockmaster.vendorname === "" || stockmaster.vendorname === "Please Select Vendor") {
      //   setShowAlert(
      //     <>
      //       <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
      //       <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Vendor"}</p>
      //     </>
      //   );
      //   handleClickOpenerr();
      // }
      // else if (stockmaster.gstno === "") {
      //   setShowAlert(
      //     <>
      //       <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
      //       <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter GST No"}</p>
      //     </>
      //   );
      //   handleClickOpenerr();
      // }
      else if (stockmaster.requestmode === 'Please Select Stock Mode' || stockmaster.requestmode === '') {
        setPopupContentMalert('Please Select Stock Mode For!');
        setPopupSeverityMalert('info');
        handleClickOpenPopupMalert();
      }
      // else if (
      //   stockmaster.stockcategory === "Please Select Stock Category" ||
      //   stockmaster.stockcategory === ""
      // ) {
      //   setPopupContentMalert("Please Select Stock Category!");
      //   setPopupSeverityMalert("info");
      //   handleClickOpenPopupMalert();
      // } else if (
      //   stockmaster.stocksubcategory === "Please Select Stock Sub Category" ||
      //   stockmaster.stocksubcategory === ""
      // ) {
      //   setPopupContentMalert("Please Select Stock Sub Category!");
      //   setPopupSeverityMalert("info");
      //   handleClickOpenPopupMalert();
      // }
      // else if (stockmaster.uomnew === "" || stockmaster.uomnew === "Please Select UOM") {
      //   setShowAlert(
      //     <>
      //       <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
      //       <p style={{ fontSize: "20px", fontWeight: 900 }}>{"UOM is Empty!"}</p>
      //     </>
      //   );
      //   handleClickOpenerr();
      // }
      // else if (stockmaster.materialnew === "" || stockmaster.materialnew === "Please Select Material") {
      //   setShowAlert(
      //     <>
      //       <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
      //       <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Material"}</p>
      //     </>
      //   );
      //   handleClickOpenerr();
      // } else if (stockmaster.quantitynew === "") {
      //   setShowAlert(
      //     <>
      //       <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
      //       <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Quantity"}</p>
      //     </>
      //   );
      //   handleClickOpenerr();
      // }
      // else if (stockmaster.productdetailsnew === "") {
      //   setShowAlert(
      //     <>
      //       <ErrorOutlineOutlinedIcon sx={{ font
      // Size: "100px", color: "orange" }} />
      //       <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Productdetails"}</p>
      //     </>
      //   );
      //   handleClickOpenerr();
      // }
      else if (stockmaster.totalbillamount === '') {
        setPopupContentMalert('Please Enter Totalbillamount!');
        setPopupSeverityMalert('info');
        handleClickOpenPopupMalert();
      } else if (educationtodo.length == 0) {
        setPopupContentMalert('Please Insert Todo!');
        setPopupSeverityMalert('info');
        handleClickOpenPopupMalert();
      } else if (expensecreate.paidstatus === 'Paid' && expensecreate.paidmode === 'Please Select Paid Mode') {
        setPopupContentMalert('Please Select Paid Mode!');
        setPopupSeverityMalert('info');
        handleClickOpenPopupMalert();
      } else if (expensecreate.paidstatus === 'Paid' && expensecreate.paidamount === '') {
        setPopupContentMalert('Please Enter Paid Amount!');
        setPopupSeverityMalert('info');
        handleClickOpenPopupMalert();
      } else if (expensecreate.paidstatus === 'Paid' && Number(expensecreate.paidamount) !== Number(Expensetotal)) {
        handleClickOpenerrAmount();
      } else if (isNameMatch) {
        setPopupContentMalert('Data Already Exist!');
        setPopupSeverityMalert('info');
        handleClickOpenPopupMalert();
      } else {
        sendRequest();
      }
 
  };

  const handleclear = (e) => {
    setPageName(!pageName);
    e.preventDefault();

    setStockmaster({
      company: 'Please Select Company',
      branch: 'Please Select Branch',
      unit: 'Please Select Unit',
      floor: 'Please Select Floor',
      area: 'Please Select Area',
      location: 'Please Select Location',
      workstation: 'Please Select Workstation',
      workcheck: false,
      producthead: '',
      vendorname: 'Please Select Vendor',
      productname: 'Please Select Material',
      component: 'Please Select Component',
      gstno: '',
      billno: '',
      assettype: '',
      asset: '',
      productdetails: '',
      warrantydetails: '',
      uom: 'Please Select UOM',
      quantity: 1,
      rate: '',
      billdate: '',
      files: '',
      warrantyfiles: '',

      warranty: 'Yes',
      warrantycalculation: '',
      estimation: '',
      estimationtime: 'Days',
      purchasedate: '',

      addedby: '',
      updatedby: '',

      requestmode: 'Please Select Stock Mode For',
      stockcategory: 'Please Select Stock Category',
      stocksubcategory: 'Please Select Stock Sub Category',
      uomnew: '',
      quantitynew: 1,
      materialnew: 'Please Select Material',
      productdetailsnew: '',
    });
    setExpensecreate({
      totalbillamount: '',

      paidstatus: 'Not Paid',

      paidmode: 'Please Select Paid Mode',
    });
    setTodoDetails({
      particularmode: 'Please Select Particular Mode',
      category: 'Please Select Category',
      subcategory: 'Please Select Sub Category',
      materialnew: 'Please Select Item Name',
      uomnew: '',
      rate: '',
      quantitynew: '',
      amount: '',
    });
    setEducationtodo([]);
    setVendorModeOfPayments('');
    setCategoryOption([]);
    setRefImgWarrantyfilenames([]);
    setRefImgbillfilenames([]);

    setSubcategoryOption([]);
    setCategoryOption([]);
    setSubcategoryOption([]);
    setMaterialoptNew([]);
    setTodos([]);
    setVendorNew('Choose Vendor');
    setVendorGroup('Choose Vendor Group');
    setVendoropt([]);
    setBranchs([]);
    setUnits([]);
    setFloors([]);
    setStockArray([]);
    setAreas([]);
    setLocations([{ label: 'ALL', value: 'ALL' }]);
    setSelectedBranch('Please Select Branch');
    setSelectedUnit('Please Select Unit');
    setSelectedProducthead('Please Select Assethead');
    setSelectedProductname('Please Select Materila Name');
    setSelectedPurchaseDate('');
    setAccount([]);
    setFile('');
    setRefImage([]);
    setGetImg(null);
    setVendorgetid({ gstnumber: '', address: '', phonenumber: '' });
    setPopupContent('Cleared Successfully');
    setPopupSeverity('success');
    handleClickOpenPopup();
  };

  // vendro details create
  //add function
  const sendRequestvendor = async () => {
    try {
      let addVendorDetails = await axios.post(SERVICE.ADD_VENDORDETAILS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        vendorname: String(vendor.vendorname),
        emailid: String(vendor.emailid),
        phonenumber: Number(vendor.phonenumber),
        whatsappnumber: Number(vendor.whatsappnumber),
        phonecheck: Boolean(vendor.phonecheck),
        contactperson: String(vendor.contactperson),
        address: String(vendor.address),
        gstnumber: String(vendor.gstnumber),
        bankname: String(vendor.bankname === 'Please Select Bank Name' ? '' : vendor.bankname),
        accountname: String(vendor.accountname),
        accountnumber: Number(vendor.accountnumber),
        ifsccode: String(vendor.ifsccode),
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await fetchVendorGrouping();
      setVendor({
        vendorname: '',
        emailid: '',
        phonenumber: '',
        whatsappnumber: '',
        contactperson: '',
        address: '',
        gstnumber: '',
        bankname: 'Please Select Bank Name',
        accountname: '',
        accountnumber: '',
        ifsccode: '',
        phonecheck: false,
      });
      handleCloseviewalertvendor();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  //valid email verification
  const validateEmail = (email) => {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email);
  };
  //post call for UOM
  //add function
  const sendRequestuom = async () => {
    try {
      let vomnamecreate = await axios.post(SERVICE.CREATE_VOMMASTERNAME, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        name: String(vomMaster.name),
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      setVomMaster(vomnamecreate.data);
      await fetchUom();
      setVomMaster({ name: '' });
      handleCloseviewalertUom();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //submit option for saving
  const handleSubmituom = (e) => {
    e.preventDefault();
    const isNameMatch = vomMasterget?.some((item) => item.name?.toLowerCase() === vomMaster.name?.toLowerCase());
    if (vomMaster.name === '') {
      setPopupContentMalert('Please Enter VOM Master Name!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert('Data Already Exist!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else {
      sendRequestuom();
    }
  };

  const handleclearuom = (e) => {
    e.preventDefault();
    setVomMaster({ name: '' });
  };

  //post call for asset material

  //add function
  const sendRequestasset = async () => {
    try {
      let subprojectscreate = await axios.post(SERVICE.ASSET_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        assethead: selectedassethead,
        name: String(asset.name),
        materialcode: String(asset.materialcode),
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await fetchAsset();
      setAsset(subprojectscreate.data);
      setAsset({ ...asset, name: '', materialcode: '' });
      handleCloseviewalertAsset();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //submit option for saving
  const handleSubmitasset = (e) => {
    e.preventDefault();

    // const isNameMatch = assetmaster?.some(item => item?.name?.toLowerCase() === (asset.name)?.toLowerCase() && item.assethead === selectedassethead);
    // const isCodeMatch = assetmaster?.some(item => item?.headcode?.toLowerCase() === (asset.headcode)?.toLowerCase() && item.name?.toLowerCase() === (asset.name)?.toLowerCase() && item?.assethead === selectedassethead);
    const isNameMatch = assetmaster?.some((item) => item?.name?.toLowerCase() === asset.name?.toLowerCase() && item.assethead === selectedassethead);
    const isCodeMatch = assetmaster?.some((item) => item?.materialcode?.toLowerCase() === asset.materialcode?.toLowerCase() && item.assethead === selectedassethead);

    if (selectedassethead === '' || selectedassethead == 'Please Select Assethead') {
      setPopupContentMalert('Please Select Assethead!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (asset.materialcode === '') {
      setPopupContentMalert('Please Enter Material Code!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (asset.name === '') {
      setPopupContentMalert('Please Enter Material Name!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert('Data Already Exist!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (isCodeMatch) {
      setPopupContentMalert('Code already exits!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else {
      sendRequestasset();
    }
  };
  const handleClearasset = (e) => {
    e.preventDefault();
    setSelectedAssethead('Please Select Assethead');
    setAsset({ materialcode: '', name: '' });
  };

  //Edit model...
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === 'backdropClick') return;
    setIsEditOpen(false);
    setStockmasteredit({
      vendorname: 'Please Select Vendor',
      gstno: '',
      billno: '',
      productdetails: '',
      warrantydetails: '',
      uom: '',
      quantity: 1,
      warranty: '',
      rate: '',
      billdate: '',
      files: '',
      warrantyfiles: '',
    });
    setSelectedBranch('Please Select Branch');
    setSelectedUnit('Please Select Unit');
    setSelectedProducthead('Please Select Assethead');
    setSelectedProductname('Please Select Materila Name');
    setVendorgetid({ gstnumber: '' });
  };

  const [vendorNew, setVendorNew] = useState('Choose Vendor');
  const [vendorNewEdit, setVendorNewEdit] = useState('Choose Vendor');

  //   const getMultipleFilesAsObjects = async (filenames, type, uniqueId) => {
  //     const files = [];

  //     for (const name of filenames) {
  //       const res = await axios.post(
  //         SERVICE.MANUAL_TODO_EDIT_FETCH,
  //         { filename: `${uniqueId}$${type}$${name}` },
  //         {
  //           headers: {
  //             Authorization: `Bearer ${auth.APIToken}`,
  //           },
  //           responseType: 'blob',
  //         }
  //       );
  // if(res.data.message == "File not found"){
  //   return [];
  // }
  // else{
  //       const blob = res.data;
  //       const file = new File([blob], name, { type: blob.type });
  //       files.push(file);

  //     return files;
  // }
  //   };

  const getMultipleFilesAsObjects = async (filenames, type, uniqueId) => {
    const files = [];

    for (const name of filenames) {
      try {
        const res = await axios.post(
          SERVICE.MANUAL_TODO_EDIT_FETCH,
          { filename: `${uniqueId}$${type}$${name}` },
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            responseType: 'blob',
          }
        );

        // Check for "File not found" in blob content
        const contentType = res.headers['content-type'];
        if (contentType.includes('application/json')) {
          const text = await res.data.text();
          const json = JSON.parse(text);
          if (json.message === 'File not found') {
            continue; // Skip this file
          }
        }

        const blob = res.data;
        const file = new File([blob], name, { type: blob.type });
        files.push(file);
      } catch (err) {
        console.error(`Error fetching file ${name}:`, err);
      }
    }

    return files;
  };

  const [oldfileNamesWar, setOldfileNamesWar] = useState([]);
  const [oldfileNamesBill, setoldfileNamesBill] = useState([]);
  //get single row to edit....
  const getCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.MANUAL_STOCKPURCHASE_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const alldata = { ...res?.data?.smanualstock, calculationbalamount: Number(res?.data?.smanualstock?.balanceamount) };

      setAmountEdit(res?.data?.smanualstock?.totalbillamount);
      setStockmasteredit(res?.data?.smanualstock);
      setFrequencyValueedit(res?.data?.smanualstock?.vendorfrequency === undefined ? '' : res?.data?.smanualstock?.vendorfrequency);
      setGroupedVendorNamesedit(vendorOverall?.filter((item) => item.name === res?.data?.smanualstock?.vendorgroup)?.map((data) => data?.vendor));

      setSelectedBranchedit(res?.data?.smanualstock.branch);
      setVendorGroupEdit(res?.data?.smanualstock?.vendorgroup);
      setVendorNewEdit(res?.data?.smanualstock?.vendorname);
      handleChangeGroupNameEdit({
        value: res?.data?.smanualstock?.vendorgroup,
      });

      setoldfileNamesBill(res?.data?.smanualstock?.filenamesbill.map((d) => `${res?.data?.smanualstock?.uniqueId}$bill$${d}`));
      setOldfileNamesWar(res?.data?.smanualstock?.filenames.map((d) => `${res?.data?.smanualstock?.uniqueId}$todo$${d}`));

      const fileswarranty = await getMultipleFilesAsObjects(res?.data?.smanualstock?.filenames, 'todo', res?.data?.smanualstock?.uniqueId);

      handleFetchWarranty(fileswarranty);

      const filesbill = await getMultipleFilesAsObjects(res?.data?.smanualstock?.filenamesbill, 'bill', res?.data?.smanualstock?.uniqueId);

      handleFetchBill(filesbill);

      setVendoroptIndEdit(new Array(res?.data?.smanualstock?.subcomponent?.length).fill([]));
      for (let i = 0; i < res?.data?.smanualstock?.subcomponent?.length; i++) {
        await handleChangeGroupNameIndexBasedEdit({ value: res?.data?.smanualstock?.subcomponent[i]?.vendorgroup }, i);
      }
      setSelectedUnitedit(res?.data?.smanualstock.unit);
      setSelectedProductheadedit(res?.data?.smanualstock.producthead);
      setSelectedProductnameedit(res?.data?.smanualstock.productname);
      // setRefImageedit(res?.data?.smanualstock?.files);
      // setRefImagewarrantyedit(
      //   res?.data?.smanualstock?.warrantyfiles
      //     ? res?.data?.smanualstock?.warrantyfiles
      //     : []
      // );
      setSelectedAssetTypeEdit(res?.data?.smanualstock?.assettype);

      setSelectedPurchaseDateEdit(res?.data?.smanualstock.purchasedate);
      // setTodosEdit(res?.data?.smanualstock?.subcomponent);

      await fetchBranchDropdownsEdit(res?.data?.smanualstock?.company);
      await fetchUnitsEdit(res?.data?.smanualstock.branch);
      await fetchFloorEdit(res?.data?.smanualstock?.branch);
      await fetchAreaEdit(res?.data?.smanualstock?.branch, res?.data?.smanualstock?.floor);
      await fetchAllLocationEdit(res?.data?.smanualstock?.branch, res?.data?.smanualstock?.floor, res?.data?.smanualstock?.area);

      if (res?.data?.smanualstock.vendorid) {
        let resv = await axios.get(`${SERVICE.SINGLE_VENDORDETAILS}/${res?.data?.smanualstock.vendorid}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
        setVendorgetid(resv?.data?.svendordetails);
      } else {
        setVendorgetid({
          ...vendorgetid,
          gstnumber: '',
          address: '',
          phonenumber: '',
        });
      }
      // let res1 = await axios.get(SERVICE.ASSETWORKSTAION, {
      //   headers: {
      //     Authorization: `Bearer ${auth.APIToken}`,
      //   },
      // });

      // let result = res1.data.assetworkstation.filter(
      //   (d) => d.workstation === res?.data?.smanualstock.component
      // );

      // const resultall = result?.map((d) => ({
      //   ...d,
      //   label: d.categoryname,
      //   value: d.categoryname,
      // }));
      // setSpecificationedit(resultall);
      await fetchspecificationEdit(res?.data?.smanualstock.component);
      handleClickOpenEdit();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const handleAssetTypeChange = (e) => {
    const selectedassetType = e.value;
    setSelectedAssetType(selectedassetType);
  };
  // get single row to view....
  const getviewCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.MANUAL_STOCKPURCHASE_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let res_project_1 = await axios.get(SERVICE.ALL_VOMMASTERNAME, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let codeValues = res_project_1?.data?.vommaster.map((data) => ({
        name: data.name,
        code: data.code,
      }));

      let setDataOne = codeValues.find((item1) => res?.data?.smanualstock.uom === item1.name);

      let setData = {
        ...res?.data?.smanualstock,
        uomcode: setDataOne ? setDataOne.code : '',
      };

      setStockmasteredit(setData);
      handleClickOpenview();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.MANUAL_STOCKPURCHASE_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setStockmasteredit(res?.data?.smanualstock);
      handleClickOpeninfo();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const fetchEmployee = async () => {
    try {
      let res_employee = await axios.get(SERVICE.USERALLLIMIT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setUsers(res_employee.data.users);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //get all teams
  const fetchteams = async () => {
    try {
      let teams = await axios.get(SERVICE.TEAMS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setTeamstableData(teams.data.teamsdetails);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //Project updateby edit page...
  let updateby = stockmasteredit?.updatedby;
  let addedby = stockmasteredit?.addedby;

  let maintenanceid = stockmasteredit?._id;


  const handleFileDeleteOld = async (filenames) => {
    try {
      let res_project = await axios.post(SERVICE.EDIT_OLDDATA_DELETE_MANUAL, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        filenames: filenames,
      });
    } catch (err) {
      console.log(err, 'errfile');
    }
  };

 

  const fetchCompanyDropdowns = async () => {
    try {
      let res_category = await axios.get(SERVICE.COMPANY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const companyall = [
        ...res_category?.data?.companies.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];
      setCompanys(companyall);
      setCompanysEdit(companyall);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const fetchWorkStation = async () => {
    try {
      let res = await axios.get(SERVICE.WORKSTATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setWorkStationOpt(res?.data?.locationgroupings);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    fetchCompanyDropdowns();
    fetchWorkStation();
    fetchMaterialAll();
    fetchWorkStation();
    fetchCategoryAll();
    fetchStockStockMaterial();
    // fetchVomMaster();
  }, []);

  const fetchBranchDropdowns = async (e) => {
    try {
      let res_branch = await axios.get(SERVICE.BRANCH, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let result = res_branch.data.branch.filter((d) => d.company === e.value);
      const branchall = result.map((d) => ({
        ...d,
        label: d.name,
        value: d.name,
      }));
      setBranchs(branchall);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  const fetchUnits = async (e) => {
    try {
      let res_unit = await axios.get(SERVICE.UNIT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let result = res_unit?.data?.units.filter((d) => d.branch === e.value);
      const unitall = result.map((d) => ({
        ...d,
        label: d.name,
        value: d.name,
      }));
      setUnits(unitall);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  const fetchFloor = async (e) => {
    try {
      let res_floor = await axios.get(SERVICE.FLOOR, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let result = res_floor.data.floors.filter((d) => d.branch === e);
      const floorall = result.map((d) => ({
        ...d,
        label: d.name,
        value: d.name,
      }));
      setFloors(floorall);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  const fetchArea = async (branch, floor) => {
    try {
      let res_type = await axios.get(SERVICE.AREAGROUPING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let result = res_type.data.areagroupings.filter((d) => d.branch === branch && d.floor === floor).map((data) => data.area);
      let ji = [].concat(...result);
      let jiii = ji.map((data) => data);
      const all = ji.map((d) => ({
        ...d,
        label: d,
        value: d,
      }));
      setAreas(all);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  const fetchLocation = async (branch, floor, area) => {
    try {
      let res_type = await axios.get(SERVICE.LOCATIONGROUPING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let result = res_type.data.locationgroupings.filter((d) => d.branch === branch && d.floor === floor && d.area === area).map((data) => data.location);
      let ji = [].concat(...result);
      let jiii = ji.map((data) => data);
      const all = [
        { label: 'ALL', value: 'ALL' },
        ...ji.map((d) => ({
          ...d,
          label: d,
          value: d,
        })),
      ];
      setLocations(all);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  const fetchUnitsEdit = async (e) => {
    try {
      let res_unit = await axios.get(SERVICE.UNIT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let result = res_unit?.data?.units.filter((d) => d.branch === e);
      const unitall = result.map((d) => ({
        ...d,
        label: d.name,
        value: d.name,
      }));
      setUnitsEdit(unitall);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  const fetchFloorEdit = async (e) => {
    try {
      let res_floor = await axios.get(SERVICE.FLOOR, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let result = res_floor.data.floors.filter((d) => d.branch === e);
      const floorall = result.map((d) => ({
        ...d,
        label: d.name,
        value: d.name,
      }));
      setFloorEdit(floorall);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  const fetchAreaEdit = async (a, e) => {
    try {
      let res_type = await axios.get(SERVICE.AREAGROUPING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let result = res_type.data.areagroupings.filter((d) => d.branch === a && d.floor === e).map((data) => data.area);
      let ji = [].concat(...result);
      const all = ji.map((d) => ({
        ...d,
        label: d,
        value: d,
      }));
      setAreasEdit(all);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  const fetchBranchDropdownsEdit = async (e) => {
    try {
      let res_branch = await axios.get(SERVICE.BRANCH, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let result = res_branch.data.branch.filter((d) => d.company === e);
      const branchall = result.map((d) => ({
        ...d,
        label: d.name,
        value: d.name,
      }));
      setBranchsEdit(branchall);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  //get all Locations edit.
  const fetchAllLocationEdit = async (a, b, c) => {
    try {
      let res_type = await axios.get(SERVICE.LOCATIONGROUPING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let result = res_type.data.locationgroupings.filter((d) => d.branch === a && d.floor === b && d.area === c).map((data) => data.location);
      let ji = [].concat(...result);
      const all = [
        { label: 'ALL', value: 'ALL' },
        ...ji.map((d) => ({
          ...d,
          label: d,
          value: d,
        })),
      ];
      setLocationsEdit(all);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    fetchAllLocationEdit();
  }, [isEditOpen, stockmasteredit.floor]);

    useEffect(() => {
      fetchBranchDropdowns(stockmaterialedit.company);
      fetchUnits(stockmaterialedit.branch);
      fetchFloor(stockmaterialedit.branch);
      fetchArea(stockmaterialedit.branch, stockmaterialedit.floor);
      fetchLocation(stockmaterialedit.branch, stockmaterialedit.floor, stockmaterialedit.area);
    }, [stockmaterialedit, isEditOpen]);

  const fetchAssetTypeDropdowns = async () => {
    try {
      let res_asset = await axios.get(SERVICE.ALL_ASSETTYPEMASTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      // let result = res_asset.data.assetMaster.filter((d) => d.asset === e.value);

      let assetall = res_asset.data.assettypemaster.map((d) => ({
        ...d,
        label: d.name,
        value: d.name,
      }));
      const aeestuniqueArray = assetall.filter((item, index, self) => {
        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
      });
      setAssettypes(aeestuniqueArray);
      setAssetypesEdit(aeestuniqueArray);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const fetchMaterialAll = async () => {
    try {
      let res = await axios.get(SERVICE.ASSETS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      // let result = res.data.assetmaterial.filter((d) => d.assethead === e.value);

      const resultall = res.data.assetmaterial.map((d) => ({
        ...d,
        label: d.name,
        value: d.name,
        assettype: d.assettype,
        asset: d.assethead,
      }));

      const assetmaterialuniqueArray = resultall.filter((item, index, self) => {
        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
      });

      setMaterialopt(assetmaterialuniqueArray);
      setMaterialoptEdit(assetmaterialuniqueArray);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const fetchspecification = async (e) => {
    try {
      let res = await axios.get(SERVICE.ASSETWORKSTAION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let result = res.data.assetworkstation.filter((d) => d.workstation === e.value);

      const resultall = result.map((d) => ({
        ...d,
        label: d.categoryname,
        value: d.categoryname,
      }));

      setSpecification(resultall);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const fetchspecificationEdit = async (e) => {
    try {
      let res = await axios.get(SERVICE.ASSETWORKSTAION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let result = res.data.assetworkstation?.filter((d) => d.workstation === e);

      const resultall = result?.map((d) => ({
        ...d,
        label: d.categoryname,
        value: d.categoryname,
      }));

      setSpecificationedit(resultall);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const [specificationGrouping, setSpecificationGrouping] = useState([]);
  const [specificationGroupingEdit, setSpecificationGroupingEdit] = useState([]);

  const fetchSpecificationGrouping = async () => {
    try {
      let res = await axios.get(SERVICE.ALL_ASSETSPECIFICATIONGROUPING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let getvalues = res?.data?.assetspecificationgrouping.filter((item) => item.assetmaterial === stockmaster.productname && stockmaster.component === item.component);

      setSpecificationGrouping(getvalues);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const fetchSpecificationGroupingEdit = async () => {
    try {
      let res = await axios.get(SERVICE.ALL_ASSETSPECIFICATIONGROUPING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let getvalues = res?.data?.assetspecificationgrouping.filter((item) => item.assetmaterial === stockmasteredit.productname && stockmasteredit.component === item.component);

      setSpecificationGroupingEdit(getvalues);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    fetchSpecificationGrouping();
  }, [stockmaster.component]);

  useEffect(() => {
    fetchSpecificationGroupingEdit();
  }, [isEditOpen, stockmasteredit.component]);

  //fetching departments whole list
  const fetchAccount = async (e) => {
    let resulthead = [];
    try {
      let res_account = await axios.get(SERVICE.ALL_ASSETTYPEGROUPING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const itAssetsObject = res_account?.data?.assettypegrouping.filter((item) => item.name === e);
      //filter products
      let dataallstocks = itAssetsObject?.map((data, index) => {
        return data.accounthead;
      });
      //individual products
      dataallstocks.forEach((value) => {
        value.forEach((valueData) => {
          resulthead.push(valueData);
        });
      });
      const projall = [
        ...resulthead?.map((d) => ({
          ...d,
          label: d,
          value: d,
        })),
      ];
      setAccount(projall);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const fetchAsset = async () => {
    try {
      let res_vendor = await axios.get(SERVICE.ASSETS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const deptall = [
        ...res_vendor?.data?.assetmaterial.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];
      setAssetmaster(deptall);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //get all project.
  const fetchUom = async () => {
    try {
      let res_project = await axios.get(SERVICE.ALL_VOMMASTERNAME, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let codeValues = res_project?.data?.vommaster.map((data) => ({
        name: data.name,
        code: data.code,
      }));
      setuomcodes(codeValues);

      const deptall = [
        ...res_project?.data?.vommaster.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];
      setVomMasterget(deptall);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const fetchStock = async (e) => {
    setPageName(!pageName);
    setProjectCheck(true);
    const queryParams = {
      page: Number(page),
      pageSize: Number(pageSize),
      assignbranch: accessbranch,
      company: valueCompanyCat,
      branch: valueBranchCat,
      unit: valueUnitCat,
    };

    const allFilters = [...additionalFilters, { column: selectedColumn, condition: selectedCondition, value: filterValue }];
    // Only include advanced filters if they exist, otherwise just use regular searchQuery
    if (allFilters.length > 0 && selectedColumn !== '') {
      queryParams.allFilters = allFilters;
      queryParams.logicOperator = logicOperator;
    } else if (searchQuery) {
      queryParams.searchQuery = searchQuery;
    }

    try {
      // let res_project = await axios.get(SERVICE.STOCKMANAGE, {
      if (e === 'Filtered') {
        let res_employee = await axios.post(SERVICE.MANUAL_STOCK_ACCESS, queryParams, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });

        const ans = res_employee?.data?.result?.length > 0 ? res_employee?.data?.result : [];

        // let filteredData = ans.filter((data) => {
        //   return data.requestmode === "Asset Material";
        // });

        let res_project_1 = await axios.get(SERVICE.ALL_VOMMASTERNAME, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });

        let codeValues = res_project_1?.data?.vommaster.map((data) => ({
          name: data.name,
          code: data?.code,
        }));
        // setuomcodes(codeValues);

        let setData = ans.map((item) => {
          // Find the corresponding item in codeValues array
          const matchingItem = codeValues.find((item1) => item.uom === item1.name);

          // If matchingItem is found, return item with uomcode set to its code, otherwise set it to an empty string
          return matchingItem ? { ...item, uomcode: matchingItem?.code } : { ...item, uomcode: '' };
        });

        const itemsWithSerialNumber = setData?.map((item, index) => ({
          ...item,
          id: item._id,
          serialNumber: (page - 1) * pageSize + index + 1,
          uom: item.uom !== '' ? `${item.quantity}#${item.uom}` : item.quantity,
          billdate: item.billdate === '' ? '' : moment(item.billdate).format('DD/MM/YYYY'),
          purchasedate: item.purchasedate != '' ? moment(item.purchasedate).format('DD/MM/YYYY') : '',
        }));

        setStock(itemsWithSerialNumber);

        setStockEdit(ans.filter((item) => item._id !== stockmasteredit._id));

        // setOverallFilterdata(res_employee?.data?.totalProjectsData?.length > 0 ?
        //   res_employee?.data?.totalProjectsData?.map((item, index) => {
        //     return {
        //       ...item,
        //       serialNumber: (page - 1) * pageSize + index + 1,
        //       uom: item.uom !== "" ? `${item.quantity}#${item.uom}` : item.quantity,
        //       billdate: item.billdate === "" ? "" : moment(item.billdate).format("DD/MM/YYYY"),
        //       purchasedate:
        //         item.purchasedate != ""
        //           ? moment(item.purchasedate).format("DD/MM/YYYY")
        //           : "",

        //     }
        //   }

        //   ) : []
        // );

        setTotalProjects(ans?.length > 0 ? res_employee?.data?.totalProjects : 0);
        setTotalPages(ans?.length > 0 ? res_employee?.data?.totalPages : 0);
        setPageSize((data) => {
          return ans?.length > 0 ? data : 10;
        });
        setPage((data) => {
          return ans?.length > 0 ? data : 1;
        });
        setProjectCheck(false);
      } else {
        setProjectCheck(false);
      }
    } catch (err) {
      setProjectCheck(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    if (items?.length > 0) {
      fetchStock('Filtered');
    }
  }, [page, pageSize, searchQuery]);
  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Asset Purchase',
    pageStyle: 'print',
  });

  // serial no for listing items
  const addSerialNumber = (datas) => {
    // const itemsWithSerialNumber = datas?.map((item, index) => ({
    //   ...item,
    //   id: item._id,
    //   serialNumber: index + 1,
    //   uom: item.uom !== "" ? `${item.quantity}#${item.uom}` : item.quantity,
    //   billdate: item.billdate === "" ? "" : moment(item.billdate).format("DD/MM/YYYY"),
    //   purchasedate:
    //     item.purchasedate != ""
    //       ? moment(item.purchasedate).format("DD/MM/YYYY")
    //       : "",
    // }));
    setItems(datas);
  };

  useEffect(() => {
    addSerialNumber(stock);
  }, [stock]);

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
    setFilterValue(event.target.value);
    setPage(1);
  };
  // Split the search query into individual terms
  const searchTerms = searchQuery.toLowerCase().split(' ');
  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchTerms.every((term) => Object.values(item).join(' ').toLowerCase().includes(term));
  });

  const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);

  // const totalPages = Math.ceil(filteredDatas.length / pageSize);

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
    fetchUom();
    // fetchStock("Filtered");
    fetchCompanyDropdowns();
    // fetchAccount();
    // fetchAsset();
    fetchAssetType();
    fetchteams();
    fetchEmployee();
    fetchVendorGrouping();
    fetchMaterialAll();
    fetchAssetTypeDropdowns();
  }, []);
  useEffect(() => {
    fetchVendorGrouping();
  }, [vendorAuto]);

  // useEffect(() => {
  //   fetchStock("Filtered");
  // }, [isEditOpen, stockmasteredit]);

  useEffect(() => {
    fetchAsset();
  }, [selectedProducthead, openviewalertAsset]);

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

  const columnDataTable = [
    // {
    //   field: "checkbox",
    //   headerName: "Checkbox", // Default header name
    //   headerStyle: {
    //     fontWeight: "bold", // Apply the font-weight style to make the header text bold
    //     // Add any other CSS styles as needed
    //   },
    //   headerComponent: (params) => (
    //     <CheckboxHeader
    //       selectAllChecked={selectAllChecked}
    //       onSelectAll={() => {
    //         if (rowDataTable.length === 0) {
    //           // Do not allow checking when there are no rows
    //           return;
    //         }

    //         if (selectAllChecked) {
    //           setSelectedRows([]);
    //         } else {
    //           const allRowIds = rowDataTable.map((row) => row.id);
    //           setSelectedRows(allRowIds);
    //         }
    //         setSelectAllChecked(!selectAllChecked);
    //       }}
    //     />
    //   ),

    //   cellRenderer: (params) => (
    //     <Checkbox
    //       checked={selectedRows.includes(params.data.id)}
    //       onChange={() => {
    //         let updatedSelectedRows;
    //         if (selectedRows.includes(params.data.id)) {
    //           updatedSelectedRows = selectedRows.filter(
    //             (selectedId) => selectedId !== params.data.id
    //           );
    //         } else {
    //           updatedSelectedRows = [...selectedRows, params.data.id];
    //         }

    //         setSelectedRows(updatedSelectedRows);

    //         // Update the "Select All" checkbox based on whether all rows are selected
    //         setSelectAllChecked(
    //           updatedSelectedRows.length === filteredData.length
    //         );
    //       }}
    //     />
    //   ),
    //   sortable: false, // Optionally, you can make this column not sortable
    //   width: 90,

    //   hide: !columnVisibility.checkbox,
    //   headerClassName: "bold-header",
    // },
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
      pinned: 'left',
      lockPinned: true,
    },
    {
      field: 'company',
      headerName: 'Company',
      flex: 0,
      width: 100,
      hide: !columnVisibility.company,
      headerClassName: 'bold-header',
      pinned: 'left',
      lockPinned: true,
    },
    {
      field: 'branch',
      headerName: 'Branch',
      flex: 0,
      width: 100,
      hide: !columnVisibility.branch,
      headerClassName: 'bold-header',
      pinned: 'left',
      lockPinned: true,
    },
    {
      field: 'unit',
      headerName: 'Unit',
      flex: 0,
      width: 100,
      hide: !columnVisibility.unit,
      headerClassName: 'bold-header',
    },
    {
      field: 'floor',
      headerName: 'Floor',
      flex: 0,
      width: 100,
      hide: !columnVisibility.floor,
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
      field: 'location',
      headerName: 'Location',
      flex: 0,
      width: 100,
      hide: !columnVisibility.location,
      headerClassName: 'bold-header',
    },
    {
      field: 'requestmode',
      headerName: 'Request Mode For',
      flex: 0,
      width: 100,
      hide: !columnVisibility.requestmode,
      headerClassName: 'bold-header',
    },
    {
      field: 'vendorname',
      headerName: 'Dealers Name',
      flex: 0,
      width: 120,
      hide: !columnVisibility.vendorname,
      headerClassName: 'bold-header',
    },
    {
      field: 'gstno',
      headerName: 'Gst No',
      flex: 0,
      width: 120,
      hide: !columnVisibility.gstno,
      headerClassName: 'bold-header',
    },
    {
      field: 'billno',
      headerName: 'Bill Number',
      flex: 0,
      width: 120,
      hide: !columnVisibility.billno,
      headerClassName: 'bold-header',
    },
    {
      field: 'producthead',
      headerName: 'Asset Head',
      flex: 0,
      width: 150,
      hide: !columnVisibility.producthead,
      headerClassName: 'bold-header',
    },
    {
      field: 'productname',
      headerName: 'Material',
      flex: 0,
      width: 200,
      hide: !columnVisibility.productname,
      headerClassName: 'bold-header',
    },
    // { field: "material", headerName: "Material", flex: 0, width: 150, hide: !columnVisibility.material, headerClassName: "bold-header" },
    {
      field: 'component',
      headerName: 'Component',
      flex: 0,
      width: 150,
      hide: !columnVisibility.component,
      headerClassName: 'bold-header',
    },
    {
      field: 'warranty',
      headerName: 'Warranty',
      flex: 0,
      width: 100,
      hide: !columnVisibility.warranty,
      headerClassName: 'bold-header',
    },
    {
      field: 'purchasedate',
      headerName: 'Purchasedate',
      flex: 0,
      width: 150,
      hide: !columnVisibility.purchasedate,
      headerClassName: 'bold-header',
    },
    {
      field: 'productdetails',
      headerName: 'Product Details',
      flex: 0,
      width: 130,
      hide: !columnVisibility.productdetails,
      headerClassName: 'bold-header',
    },
    {
      field: 'warrantydetails',
      headerName: 'Warranty Details',
      flex: 0,
      width: 130,
      hide: !columnVisibility.warrantydetails,
      headerClassName: 'bold-header',
    },

    {
      field: 'quantity',
      headerName: 'Quantity',
      flex: 0,
      width: 80,
      hide: !columnVisibility.quantity,
      headerClassName: 'bold-header',
    },
    {
      field: 'uom',
      headerName: 'Quantity & UOM',
      flex: 0,
      width: 100,
      hide: !columnVisibility.uom,
      headerClassName: 'bold-header',
    },
    {
      field: 'rate',
      headerName: 'Rate',
      flex: 0,
      width: 100,
      hide: !columnVisibility.rate,
      headerClassName: 'bold-header',
    },
    {
      field: 'totalbillamount',
      headerName: 'Bill Amount',
      flex: 0,
      width: 100,
      hide: !columnVisibility.totalbillamount,
      headerClassName: 'bold-header',
    },
    {
      field: 'billdate',
      headerName: 'Bill Date',
      flex: 0,
      width: 120,
      hide: !columnVisibility.billdate,
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
          {isUserRoleCompare?.includes('emanualstockentry') && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                // handleClickOpenEdit();
                getCode(params.data.id);
              }}
            >
              <EditOutlinedIcon sx={buttonStyles.buttonedit} />
            </Button>
          )}

          {isUserRoleCompare?.includes('dmanualstockentry') && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.data.id);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
            </Button>
          )}
          {isUserRoleCompare?.includes('vmanualstockentry') && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.data.id);
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
            </Button>
          )}
          {isUserRoleCompare?.includes('imanualstockentry') && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                // handleClickOpeninfo();
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
  const filteredSelectedColumn = columnDataTable.filter((data) => data.field !== 'checkbox' && data.field !== 'actions' && data.field !== 'serialNumber');

  const rowDataTable = items.map((item, index) => {
    return {
      ...item,
      totalbillamount: item.totalbillamount,
      id: item._id,
      serialNumber: item.serialNumber,
      company: item.company,
      branch: item.branch,
      unit: item.unit,
      floor: item.floor,
      area: item.area,
      location: item.location,
      requestmode: item.requestmode,
      vendorgroup: item.vendorgroup,
      vendorname: item.vendorname,
      producthead: item.producthead,
      productname: item.productname,
      component: item.component,
      gstno: item.gstno,
      billno: item.billno,
      asset: item.asset,
      assettype: item.assettype,
      producthead: item.producthead,
      productname: item.productname,
      productdetails: item.productdetails,
      warrantydetails: item.warrantydetails,
      uom: item.uom,
      quantity: item.quantity,
      rate: item.rate,
      billdate: item.billdate,
      material: item.material,
      warranty: item.warranty,
      purchasedate: item.purchasedate,
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
        onClick={handleCloseManageColumns1}
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
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );

  //TODOS
  const [todos, setTodos] = useState([]);
  const [todosEdit, setTodosEdit] = useState([]);

  const handleAddInput = (e) => {
    let specificationItem = Specification.find((item) => e === item.categoryname);
    let filtersub = specificationItem?.subcategoryname;
    let result;
    if (filtersub.length > 0) {
      result = filtersub?.map((sub, index) => ({
        subname: sub.subcomponent,
        sub: `${index + 1}.${sub.subcomponent}`,
        subcomponentcheck: false,
        type: sub.type ? 'Choose Type' : '',
        model: sub.model ? 'Choose Model' : '',
        size: sub.size ? 'Choose Size' : '',
        variant: sub.variant ? 'Choose variant' : '',
        brand: sub.brand ? 'Choose Brand' : '',
        serial: sub.serial ? '' : undefined,
        other: sub.other ? '' : undefined,
        capacity: sub.capacity ? 'Choose Capacity' : '',
        hdmiport: sub.hdmiport ? '' : undefined,
        vgaport: sub.vgaport ? '' : undefined,
        dpport: sub.dpport ? '' : undefined,
        usbport: sub.usbport ? '' : undefined,
        paneltypescreen: sub.paneltypescreen ? 'Choose Panel Type' : '',
        resolution: sub.resolution ? 'Choose Screen Resolution' : '',
        connectivity: sub.connectivity ? 'Choose Connectivity' : '',
        daterate: sub.daterate ? 'Choose Data Rate' : '',
        compatibledevice: sub.compatibledevice ? 'Choose Compatible Device' : '',
        outputpower: sub.outputpower ? 'Choose Output Power' : '',
        collingfancount: sub.collingfancount ? 'Choose Cooling Fan Count' : '',
        clockspeed: sub.clockspeed ? 'Choose Clock Speed' : '',
        core: sub.core ? 'Choose Core' : '',
        speed: sub.speed ? 'Choose Speed' : '',
        frequency: sub.frequency ? 'Choose Frequency' : '',
        output: sub.output ? 'Choose Output' : '',
        ethernetports: sub.ethernetports ? 'Choose Ethernet Ports' : '',
        distance: sub.distance ? 'Choose Distance' : '',
        lengthname: sub.lengthname ? 'Choose Length' : '',
        slot: sub.slot ? 'Choose Slot' : '',
        noofchannels: sub.noofchannels ? 'Choose No. Of Channels' : '',
        colours: sub.colours ? 'Choose Colour' : '',

        warranty: stockmaster.warranty ? stockmaster.warranty : undefined,
        estimation: stockmaster.estimation ? stockmaster.estimation : undefined,
        estimationtime: stockmaster.estimationtime ? stockmaster.estimationtime : undefined,
        warrantycalculation: stockmaster.warrantycalculation ? stockmaster.warrantycalculation : undefined,
        purchasedate: selectedPurchaseDate ? selectedPurchaseDate : undefined,
        vendorgroup: vendorGroup ? vendorGroup : undefined,
        vendor: vendorNew ? vendorNew : undefined,
        phonenumber: vendorgetid.phonenumber ? vendorgetid.phonenumber : undefined,
        vendorid: vendornameid ? vendornameid : undefined,
        address: vendorgetid.address ? vendorgetid.address : undefined,
      }));
    } else if (
      filtersub.length === 0 &&
      !(
        !specificationItem.type &&
        !specificationItem.model &&
        !specificationItem.size &&
        !specificationItem.variant &&
        !specificationItem.brand &&
        !specificationItem.serial &&
        !specificationItem.other &&
        !specificationItem.capacity &&
        !specificationItem.hdmiport &&
        !specificationItem.vgaport &&
        !specificationItem.dpport &&
        !specificationItem.usbport
      )
    ) {
      result = [
        {
          // sub: `${index + 1}.${sub.subcomponent}`,
          subcomponentcheck: false,
          type: specificationItem.type ? 'Choose Type' : '',
          model: specificationItem.model ? 'Choose Model' : '',
          size: specificationItem.size ? 'Choose Size' : '',
          variant: specificationItem.variant ? 'Choose variant' : '',
          brand: specificationItem.brand ? 'Choose Brand' : '',
          serial: specificationItem.serial ? '' : undefined,
          other: specificationItem.other ? '' : undefined,
          capacity: specificationItem.capacity ? 'Choose Capacity' : '',
          hdmiport: specificationItem.hdmiport ? '' : undefined,
          vgaport: specificationItem.vgaport ? '' : undefined,
          dpport: specificationItem.dpport ? '' : undefined,
          usbport: specificationItem.usbport ? '' : undefined,
          paneltypescreen: specificationItem.paneltypescreen ? 'Choose Panel Type' : '',
          resolution: specificationItem.resolution ? 'Choose Screen Resolution' : '',
          connectivity: specificationItem.connectivity ? 'Choose Connectivity' : '',
          daterate: specificationItem.daterate ? 'Choose Data Rate' : '',
          compatibledevice: specificationItem.compatibledevice ? 'Choose Compatible Device' : '',
          outputpower: specificationItem.outputpower ? 'Choose Output Power' : '',
          collingfancount: specificationItem.collingfancount ? 'Choose Cooling Fan Count' : '',
          clockspeed: specificationItem.clockspeed ? 'Choose Clock Speed' : '',
          core: specificationItem.core ? 'Choose Core' : '',
          speed: specificationItem.speed ? 'Choose Speed' : '',
          frequency: specificationItem.frequency ? 'Choose Frequency' : '',
          output: specificationItem.output ? 'Choose Output' : '',
          ethernetports: specificationItem.ethernetports ? 'Choose Ethernet Ports' : '',
          distance: specificationItem.distance ? 'Choose Distance' : '',
          lengthname: specificationItem.lengthname ? 'Choose Length' : '',
          slot: specificationItem.slot ? 'Choose Slot' : '',
          noofchannels: specificationItem.noofchannels ? 'Choose No. Of Channels' : '',
          colours: specificationItem.colours ? 'Choose Colour' : '',

          warranty: stockmaster.warranty ? stockmaster.warranty : undefined,
          estimation: stockmaster.estimation ? stockmaster.estimation : undefined,
          estimationtime: stockmaster.estimationtime ? stockmaster.estimationtime : undefined,
          warrantycalculation: stockmaster.warrantycalculation ? stockmaster.warrantycalculation : undefined,
          purchasedate: selectedPurchaseDate ? selectedPurchaseDate : undefined,
          vendorgroup: vendorGroup ? vendorGroup : undefined,
          vendor: vendorNew ? vendorNew : undefined,
          phonenumber: vendorgetid.phonenumber ? vendorgetid.phonenumber : undefined,
          vendorid: vendornameid ? vendornameid : undefined,
          address: vendorgetid.address ? vendorgetid.address : undefined,
        },
      ];
    }

    setTodos(result);
    setVendoroptInd(new Array(result?.length).fill(vendorOpt));
  };

  const handleChange = async (index, name, value, id) => {
    const updatedTodos = [...todos];
    updatedTodos[index] = {
      ...updatedTodos[index],
      [name]: value,
    };
    setTodos(updatedTodos);

    // Calculate expiry date for the updated todo
    const updatedTodo = updatedTodos[index];
    if (updatedTodo.estimationtime !== '' && updatedTodo.purchasedate && updatedTodo.estimation !== '') {
      const currentDate = new Date(updatedTodo.purchasedate);
      let expiryDate = new Date(currentDate);

      if (updatedTodo.estimationtime === 'Days') {
        expiryDate.setDate(currentDate.getDate() + parseInt(updatedTodo.estimation));
      } else if (updatedTodo.estimationtime === 'Month') {
        expiryDate.setMonth(currentDate.getMonth() + parseInt(updatedTodo.estimation));
      } else if (updatedTodo.estimationtime === 'Year') {
        expiryDate.setFullYear(currentDate.getFullYear() + parseInt(updatedTodo.estimation));
      }

      const formattedExpiryDate = formatDateString(expiryDate);
      let formattedempty = formattedExpiryDate.includes('NaN-NaN-NaN') ? '' : formattedExpiryDate;

      // Update the calculated expiry date in the todo
      const updatedTodosCopy = [...updatedTodos];
      updatedTodosCopy[index] = {
        ...updatedTodosCopy[index],
        warrantycalculation: formattedempty,
        vendorid: vendornameid,
      };
      setTodos(updatedTodosCopy);
    }

    const updatedTodovendor = updatedTodos[index];
    if (updatedTodovendor.vendorname !== '' && id) {
      // Fix: Add await here to wait for the result of the axios call
      const res = await axios.get(`${SERVICE.SINGLE_VENDORDETAILS}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      // Update the todo with vendor details
      const updatedTodosCopy = [...updatedTodos];
      updatedTodosCopy[index] = {
        ...updatedTodosCopy[index],
        address: res?.data?.svendordetails.address,
        phonenumber: res?.data?.svendordetails.phonenumber,
      };
      setTodos(updatedTodosCopy);
    }
  };
  const handleDelete = (index) => {
    const updatedTodos = [...todos];
    updatedTodos.splice(index, 1);
    setTodos(updatedTodos);
    setStockmaster({
      ...stockmaster,
      component: 'Please Select Component',
    });
  };

  //todo edit

  const handleAddInputEdit = (e) => {
    let specificationItem = Specificationedit.find((item) => e === item.categoryname);
    let filtersub = specificationItem?.subcategoryname;
    let result;
    if (filtersub.length > 0) {
      result = filtersub?.map((sub, index) => ({
        sub: `${index + 1}.${sub.subcomponent}`,
        subname: sub.subcomponent,
        type: sub.type ? 'Choose Type' : '',
        subcomponentcheck: false,
        model: sub.model ? 'Choose Model' : '',
        size: sub.size ? 'Choose Size' : '',
        variant: sub.variant ? 'Choose variant' : '',
        brand: sub.brand ? 'Choose Brand' : '',
        serial: sub.serial ? '' : undefined,
        other: sub.other ? '' : undefined,
        capacity: sub.capacity ? 'Choose Capacity' : '',
        hdmiport: sub.hdmiport ? '' : undefined,
        vgaport: sub.vgaport ? '' : undefined,
        dpport: sub.dpport ? '' : undefined,
        usbport: sub.usbport ? '' : undefined,
        paneltypescreen: sub.paneltypescreen ? 'Choose Panel Type' : '',
        resolution: sub.resolution ? 'Choose Screen Resolution' : '',
        connectivity: sub.connectivity ? 'Choose Connectivity' : '',
        daterate: sub.daterate ? 'Choose Data Rate' : '',
        compatibledevice: sub.compatibledevice ? 'Choose Compatible Device' : '',
        outputpower: sub.outputpower ? 'Choose Output Power' : '',
        collingfancount: sub.collingfancount ? 'Choose Cooling Fan Count' : '',
        clockspeed: sub.clockspeed ? 'Choose Clock Speed' : '',
        core: sub.core ? 'Choose Core' : '',
        speed: sub.speed ? 'Choose Speed' : '',
        frequency: sub.frequency ? 'Choose Frequency' : '',
        output: sub.output ? 'Choose Output' : '',
        ethernetports: sub.ethernetports ? 'Choose Ethernet Ports' : '',
        distance: sub.distance ? 'Choose Distance' : '',
        lengthname: sub.lengthname ? 'Choose Length' : '',
        slot: sub.slot ? 'Choose Slot' : '',
        noofchannels: sub.noofchannels ? 'Choose No. Of Channels' : '',
        colours: sub.colours ? 'Choose Colour' : '',

        warranty: stockmaster.warranty ? stockmaster.warranty : undefined,
        estimation: stockmaster.estimation ? stockmaster.estimation : undefined,
        estimationtime: stockmaster.estimationtime ? stockmaster.estimationtime : undefined,
        warrantycalculation: stockmaster.warrantycalculation ? stockmaster.warrantycalculation : undefined,
        purchasedate: selectedPurchaseDate ? selectedPurchaseDate : undefined,
        vendor: stockmaster.vendorname ? stockmaster.vendorname : undefined,
        phonenumber: vendorgetid.phonenumber ? vendorgetid.phonenumber : undefined,
        vendorid: vendornameid ? vendornameid : undefined,
        address: vendorgetid.address ? vendorgetid.address : undefined,
      }));
    } else if (
      filtersub.length === 0 &&
      !(
        !specificationItem.type &&
        !specificationItem.model &&
        !specificationItem.size &&
        !specificationItem.variant &&
        !specificationItem.brand &&
        !specificationItem.serial &&
        !specificationItem.other &&
        !specificationItem.capacity &&
        !specificationItem.hdmiport &&
        !specificationItem.vgaport &&
        !specificationItem.dpport &&
        !specificationItem.usbport
      )
    ) {
      result = [
        {
          // sub: `${index + 1}.${sub.subcomponent}`,
          subcomponentcheck: false,
          type: specificationItem.type ? 'Choose Type' : '',
          model: specificationItem.model ? 'Choose Model' : '',
          size: specificationItem.size ? 'Choose Size' : '',
          variant: specificationItem.variant ? 'Choose variant' : '',
          brand: specificationItem.brand ? 'Choose Brand' : '',
          serial: specificationItem.serial ? '' : undefined,
          other: specificationItem.other ? '' : undefined,
          capacity: specificationItem.capacity ? 'Choose Capacity' : '',
          hdmiport: specificationItem.hdmiport ? '' : undefined,
          vgaport: specificationItem.vgaport ? '' : undefined,
          dpport: specificationItem.dpport ? '' : undefined,
          usbport: specificationItem.usbport ? '' : undefined,
          paneltypescreen: specificationItem.paneltypescreen ? 'Choose Panel Type' : '',
          resolution: specificationItem.resolution ? 'Choose Screen Resolution' : '',
          connectivity: specificationItem.connectivity ? 'Choose Connectivity' : '',
          daterate: specificationItem.daterate ? 'Choose Data Rate' : '',
          compatibledevice: specificationItem.compatibledevice ? 'Choose Compatible Device' : '',
          outputpower: specificationItem.outputpower ? 'Choose Output Power' : '',
          collingfancount: specificationItem.collingfancount ? 'Choose Cooling Fan Count' : '',
          clockspeed: specificationItem.clockspeed ? 'Choose Clock Speed' : '',
          core: specificationItem.core ? 'Choose Core' : '',
          speed: specificationItem.speed ? 'Choose Speed' : '',
          frequency: specificationItem.frequency ? 'Choose Frequency' : '',
          output: specificationItem.output ? 'Choose Output' : '',
          ethernetports: specificationItem.ethernetports ? 'Choose Ethernet Ports' : '',
          distance: specificationItem.distance ? 'Choose Distance' : '',
          lengthname: specificationItem.lengthname ? 'Choose Length' : '',
          slot: specificationItem.slot ? 'Choose Slot' : '',
          noofchannels: specificationItem.noofchannels ? 'Choose No. Of Channels' : '',
          colours: specificationItem.colours ? 'Choose Colour' : '',

          warranty: stockmaster.warranty ? stockmaster.warranty : undefined,
          estimation: stockmaster.estimation ? stockmaster.estimation : undefined,
          estimationtime: stockmaster.estimationtime ? stockmaster.estimationtime : undefined,
          warrantycalculation: stockmaster.warrantycalculation ? stockmaster.warrantycalculation : undefined,
          purchasedate: selectedPurchaseDate ? selectedPurchaseDate : undefined,
          vendor: stockmaster.vendorname ? stockmaster.vendorname : undefined,
          phonenumber: vendorgetid.phonenumber ? vendorgetid.phonenumber : undefined,
          vendorid: vendornameid ? vendornameid : undefined,
          address: vendorgetid.address ? vendorgetid.address : undefined,
        },
      ];
    }

    setTodosEdit(result);
  };

  const handleChangeEdit = async (index, name, value, id) => {
    const updatedTodos = [...todosEdit];
    updatedTodos[index] = {
      ...updatedTodos[index],
      [name]: value,
    };
    setTodosEdit(updatedTodos);

    // Calculate expiry date for the updated todo
    const updatedTodo = updatedTodos[index];
    if (updatedTodo.estimationtime !== '' && updatedTodo.purchasedate && updatedTodo.estimation !== '') {
      const currentDate = new Date(updatedTodo.purchasedate);
      let expiryDate = new Date(currentDate);

      if (updatedTodo.estimationtime === 'Days') {
        expiryDate.setDate(currentDate.getDate() + parseInt(updatedTodo.estimation));
      } else if (updatedTodo.estimationtime === 'Month') {
        expiryDate.setMonth(currentDate.getMonth() + parseInt(updatedTodo.estimation));
      } else if (updatedTodo.estimationtime === 'Year') {
        expiryDate.setFullYear(currentDate.getFullYear() + parseInt(updatedTodo.estimation));
      }

      const formattedExpiryDate = formatDateString(expiryDate);
      let formattedempty = formattedExpiryDate.includes('NaN-NaN-NaN') ? '' : formattedExpiryDate;

      // Update the calculated expiry date in the todo
      const updatedTodosCopy = [...updatedTodos];
      updatedTodosCopy[index] = {
        ...updatedTodosCopy[index],
        warrantycalculation: formattedempty,
      };
      setTodosEdit(updatedTodosCopy);
    }

    const updatedTodovendor = updatedTodos[index];
    if (updatedTodovendor.vendorname !== '' && id) {
      // Fix: Add await here to wait for the result of the axios call
      const res = await axios.get(`${SERVICE.SINGLE_VENDORDETAILS}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      // Update the todo with vendor details
      const updatedTodosCopy = [...updatedTodos];
      updatedTodosCopy[index] = {
        ...updatedTodosCopy[index],
        address: res?.data?.svendordetails.address,
        phonenumber: res?.data?.svendordetails.phonenumber,
      };
      setTodosEdit(updatedTodosCopy);
    }
  };
  const handleDeleteEdit = (index) => {
    const updatedTodos = [...todosEdit];
    updatedTodos?.splice(index, 1);
    setTodosEdit(updatedTodos);
  };

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  useEffect(() => {
    fetchExcelLimited();
  }, [isFilterOpen]);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  const [fileFormat, setFormat] = useState('');

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

  // Disable the search input if the search is active
  const isSearchDisabled = isSearchActive || additionalFilters.length > 0;

  const handleResetSearch = async () => {
    setProjectCheck(true);

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

    setPageName(!pageName);
    try {
      // let res_project = await axios.get(SERVICE.STOCKMANAGE, {
      let res_employee = await axios.post(SERVICE.MANUAL_STOCK_ACCESS, queryParams, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const ans = res_employee?.data?.result?.length > 0 ? res_employee?.data?.result : [];

      // let filteredData = ans.filter((data) => {
      //   return data.requestmode === "Asset Material";
      // });

      let res_project_1 = await axios.get(SERVICE.ALL_VOMMASTERNAME, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let codeValues = res_project_1?.data?.vommaster.map((data) => ({
        name: data.name,
        code: data?.code,
      }));
      // setuomcodes(codeValues);

      let setData = ans.map((item) => {
        // Find the corresponding item in codeValues array
        const matchingItem = codeValues.find((item1) => item.uom === item1.name);

        // If matchingItem is found, return item with uomcode set to its code, otherwise set it to an empty string
        return matchingItem ? { ...item, uomcode: matchingItem?.code } : { ...item, uomcode: '' };
      });

      const itemsWithSerialNumber = setData?.map((item, index) => ({
        ...item,
        id: item._id,
        serialNumber: (page - 1) * pageSize + index + 1,
        totalbillamount: Number(item.quantity) * Number(item.rate),
        uom: item.uom !== '' ? `${item.quantity}#${item.uom}` : item.quantity,
        billdate: item.billdate === '' ? '' : moment(item.billdate).format('DD/MM/YYYY'),
        purchasedate: item.purchasedate != '' ? moment(item.purchasedate).format('DD/MM/YYYY') : '',
      }));

      setStock(itemsWithSerialNumber);

      setStockEdit(ans.filter((item) => item._id !== stockmasteredit._id));

      setOverallFilterdata(
        res_employee?.data?.totalProjectsData?.length > 0
          ? res_employee?.data?.totalProjectsData?.map((item, index) => {
            return {
              ...item,
              serialNumber: (page - 1) * pageSize + index + 1,
              uom: item.uom !== '' ? `${item.quantity}#${item.uom}` : item.quantity,
              billdate: item.billdate === '' ? '' : moment(item.billdate).format('DD/MM/YYYY'),
              purchasedate: item.purchasedate != '' ? moment(item.purchasedate).format('DD/MM/YYYY') : '',
            };
          })
          : []
      );

      setTotalProjects(ans?.length > 0 ? res_employee?.data?.totalProjects : 0);
      setTotalPages(ans?.length > 0 ? res_employee?.data?.totalPages : 0);
      setPageSize((data) => {
        return ans?.length > 0 ? data : 10;
      });
      setPage((data) => {
        return ans?.length > 0 ? data : 1;
      });
      setProjectCheck(false);
    } catch (err) {
      setProjectCheck(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //company multiselect
  //team multiselect
  const [selectedOptionsCompany, setSelectedOptionsCompany] = useState([]);
  let [valueCompanyCat, setValueCompanyCat] = useState([]);

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
  };

  const customValueRendererCompany = (valueCompanyCat, _categoryname) => {
    return valueCompanyCat?.length ? valueCompanyCat.map(({ label }) => label)?.join(', ') : 'Please Select Company';
  };

  //branch multiselect
  const [selectedOptionsBranch, setSelectedOptionsBranch] = useState([]);
  let [valueBranchCat, setValueBranchCat] = useState([]);

  const handleBranchChangeFilter = (options) => {
    setValueBranchCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsBranch(options);
    setValueUnitCat([]);
    setSelectedOptionsUnit([]);
  };

  const customValueRendererBranch = (valueBranchCat, _categoryname) => {
    return valueBranchCat?.length ? valueBranchCat.map(({ label }) => label)?.join(', ') : 'Please Select Branch';
  };

  //unit multiselect
  const [selectedOptionsUnit, setSelectedOptionsUnit] = useState([]);
  let [valueUnitCat, setValueUnitCat] = useState([]);

  const handleUnitChange = (options) => {
    setValueUnitCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsUnit(options);
  };

  const customValueRendererUnit = (valueUnitCat, _categoryname) => {
    return valueUnitCat?.length ? valueUnitCat.map(({ label }) => label)?.join(', ') : 'Please Select Unit';
  };

  //auto select all dropdowns
  const handleAutoSelect = async () => {
    setPageName(!pageName);
    try {
      let selectedValues = accessbranch
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
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    handleAutoSelect();
  }, [isAssignBranch]);

  const handleSubmitFilter = (e) => {
    e.preventDefault();
    if (selectedOptionsCompany?.length === 0 && selectedOptionsBranch?.length === 0 && selectedOptionsUnit?.length === 0) {
      setPopupContentMalert('Please Select Any One');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else {
      fetchStock('Filtered');
    }
  };

  const handleClearFilter = () => {
    setStock([]);
    setItems([]);
    setPage(1);
    setTotalProjects(0);
    setTotalPages(0);
    setPageSize(10);
    setOverallFilterdata([]);
    setSelectedOptionsCompany([]);
    setSelectedOptionsBranch([]);
    setSelectedOptionsUnit([]);
    setValueCompanyCat([]);
    setValueBranchCat([]);
    setValueUnitCat([]);
    setPopupContent('Cleared Successfully');
    setPopupSeverity('success');
    handleClickOpenPopup();
  };
  //alert model for stock category
  const [openviewalertstockcategory, setOpenviewalertstockcategory] = useState(false);
  // view model
  const handleClickOpenviewalertstockcategory = () => {
    setOpenviewalertstockcategory(true);
  };

  const handleCloseviewalertstockcategory = () => {
    setOpenviewalertstockcategory(false);
  };
  //alert model for manage stock Item
  const [openviewalertstockitem, setOpenviewalertstockitem] = useState(false);
  // view model
  const handleClickOpenviewalertstockitem = () => {
    setOpenviewalertstockitem(true);
  };

  const handleCloseviewalertstockitem = () => {
    setOpenviewalertstockitem(false);
  };

  const educationTodo = () => {
    const isNameMatch = educationtodo?.some((item) => {
      if (stockmaster?.requestmode === 'Stock Material') {
        return item?.category === todoDetails?.category && item?.subcategory === todoDetails?.subcategory && item?.itemname?.toLowerCase() === todoDetails?.materialnew?.toLowerCase() && item?.uomnew?.toLowerCase() === todoDetails?.uomnew?.toLowerCase();
      } else {
        return item?.materialnew?.toLowerCase() === todoDetails?.materialnew?.toLowerCase() && item?.uomnew?.toLowerCase() === todoDetails?.uomnew?.toLowerCase();
      }
    });
    // if (todoDetails.particularmode === "Please Select Particular Mode") {
    //   setPopupContentMalert("Please Select Particular Mode!");
    //   setPopupSeverityMalert("info");
    //   handleClickOpenPopupMalert();
    // } else
    if (todoDetails.category === 'Please Select Category') {
      setPopupContentMalert('Please Select Category!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (todoDetails.subcategory === 'Please Select Sub Category') {
      setPopupContentMalert('Please Select Sub Category!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (todoDetails.materialnew === 'Please Select Item Name') {
      setPopupContentMalert('Please Select Item Name!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (todoDetails.uomnew === '') {
      setPopupContentMalert('Please Enter UOM!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (todoDetails.rate === '' || todoDetails.rate == 0) {
      setPopupContentMalert('Please Enter Rate!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (todoDetails.quantitynew === '' || todoDetails.quantitynew == 0) {
      setPopupContentMalert('Please Enter Quantity!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (todoDetails.amount === '' || todoDetails.amount == 0) {
      setPopupContentMalert('Please Enter Amount!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (todoDetails.productdetailsnew === '') {
      setPopupContentMalert('Please Enter Product Details!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert('Item Already Exists!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (Number(todoDetails.amount) + Number(Expensetotal) > Number(stockmaster.totalbillamount)) {
      setPopupContentMalert('Amount Exceeds Total Bill Amount!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (todoDetails !== '') {
      setEducationtodo([...educationtodo, todoDetails]);
      setTodoDetails({
        ...todoDetails,

        rate: '',
        quantitynew: '',
        amount: '',
      });
    }
  };
  const educationTodoremove = (index) => {
    const newTasks = [...educationtodo];
    newTasks.splice(index, 1);
    setEducationtodo(newTasks);
    setExpensecreate({
      ...expensecreate,
      paidstatus: 'Not Paid',
      paidmode: 'Please Select Paid Mode',
      paidamount: '',
      balanceamount: '',
    });
  };

  const [holidays, setHolidays] = useState([])
  const fetchHoliday = async () => {
    setPageName(!pageName);
    try {
      let res_status = await axios.post(SERVICE.ALL_HOLIDAY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        assignbranch: accessbranch,
      });



      setHolidays(res_status?.data?.holiday);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  // Helper function to find the next available date that's not a Sunday or a holiday
  const getNextValidDate = (date, holidays) => {
    const holidaysSet = new Set(holidays); // Store holidays for quick lookup
    let nextDate = moment(date); // Convert the date to a Moment instance

    // Increment the date until it's not a Sunday or a holiday
    while (nextDate.day() === 0 || holidaysSet.has(nextDate.format("YYYY-MM-DD"))) {
      nextDate.add(1, 'day'); // Move to the next day
    }

    return nextDate;
  };



  const setDueDate = (e) => {
    let dueDate = ""; // Default value if not monthly
    if (e.paymentfrequency === "Monthly" && e.monthlyfrequency) {
      // Get the current month and year
      const today = moment();
      let proposedDate = moment(`${today.year()}-${today.month() + 1}-${e.monthlyfrequency}`, "YYYY-MM-DD");

      // If proposedDate is in the past, set it to next month
      if (proposedDate.isBefore(today, 'day')) {
        proposedDate.add(1, 'month');
      }

      // Filter holidays specific to the selected company, branch, and unit
      let mappedHolidays = holidays
        ?.filter(data =>
          data.company?.includes(stockmaster?.company) &&
          data.applicablefor?.includes(stockmaster?.branch) &&
          data.unit?.includes(stockmaster?.unit)
        )
        ?.map(item => item?.date);


      // Get the valid due date (not Sunday or a holiday)
      const validDueDate = getNextValidDate(proposedDate, mappedHolidays);
      dueDate = validDueDate.format("YYYY-MM-DD"); // Format as YYYY-MM-DD
    } else if (e.paymentfrequency === "Weekly" && e.weeklyfrequency) {
      // Set today to "2024-05-17"
      const today = moment(expensecreate?.date);

      // Map days of the week to their numeric values (Sunday = 0, Monday = 1, ..., Saturday = 6)
      const dayMapping = {
        Sunday: 0,
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6
      };

      // Get the numeric value of the desired day
      const targetDay = dayMapping[e.weeklyfrequency];

      // Calculate the next target day from today
      let proposedDate = today.clone().isoWeekday(targetDay);

      // If the proposed day is earlier than today, move to the next week
      if (proposedDate.isBefore(today, 'day')) {
        proposedDate.add(1, 'week');
      }

      // Filter holidays specific to the selected company, branch, and unit
      let mappedHolidays = holidays
        ?.filter(data =>
          data.company?.includes(stockmaster?.company) &&
          data.applicablefor?.includes(stockmaster?.branch) &&
          data.unit?.includes(stockmaster?.unit)
        )
        ?.map(item => item?.date);

      // Get the valid due date (not a holiday)
      const validDueDate = getNextValidDate(proposedDate, mappedHolidays);
      dueDate = validDueDate.format("YYYY-MM-DD"); // Format as YYYY-MM-DD
    }

    setExpensecreate({
      ...expensecreate,
      vendorname: e.value,
      vendorfrequency: e.paymentfrequency,
      duedate: dueDate
    });
  };

  const setDueDateEdit = (e) => {
    let dueDate = ""; // Default value if not monthly
    if (e.paymentfrequency === "Monthly" && e.monthlyfrequency) {
      // Get the current month and year
      const today = moment();
      let proposedDate = moment(`${today.year()}-${today.month() + 1}-${e.monthlyfrequency}`, "YYYY-MM-DD");

      // If proposedDate is in the past, set it to next month
      if (proposedDate.isBefore(today, 'day')) {
        proposedDate.add(1, 'month');
      }

      // Filter holidays specific to the selected company, branch, and unit
      let mappedHolidays = holidays
        ?.filter(data =>
          data.company?.includes(stockmasteredit?.company) &&
          data.applicablefor?.includes(stockmasteredit?.branch) &&
          data.unit?.includes(stockmasteredit?.unit)
        )
        ?.map(item => item?.date);


      // Get the valid due date (not Sunday or a holiday)
      const validDueDate = getNextValidDate(proposedDate, mappedHolidays);
      dueDate = validDueDate.format("YYYY-MM-DD"); // Format as YYYY-MM-DD
    } else if (e.paymentfrequency === "Weekly" && e.weeklyfrequency) {
      // Set today to "2024-05-17"
      const today = moment(expensecreateedit?.date);

      // Map days of the week to their numeric values (Sunday = 0, Monday = 1, ..., Saturday = 6)
      const dayMapping = {
        Sunday: 0,
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6
      };

      // Get the numeric value of the desired day
      const targetDay = dayMapping[e.weeklyfrequency];

      // Calculate the next target day from today
      let proposedDate = today.clone().isoWeekday(targetDay);

      // If the proposed day is earlier than today, move to the next week
      if (proposedDate.isBefore(today, 'day')) {
        proposedDate.add(1, 'week');
      }

      // Filter holidays specific to the selected company, branch, and unit
      let mappedHolidays = holidays
        ?.filter(data =>
          data.company?.includes(stockmasteredit?.company) &&
          data.applicablefor?.includes(stockmasteredit?.branch) &&
          data.unit?.includes(stockmasteredit?.unit)
        )
        ?.map(item => item?.date);

      // Get the valid due date (not a holiday)
      const validDueDate = getNextValidDate(proposedDate, mappedHolidays);
      dueDate = validDueDate.format("YYYY-MM-DD"); // Format as YYYY-MM-DD
    }

    setExpensecreateedit({
      ...expensecreateedit,
      vendorname: e.value,
      vendorfrequency: e.paymentfrequency,
      duedate: dueDate
    });
  };

  useEffect(() => {
    fetchHoliday()
  }, []);

  return (
    <Box>
      <Headtitle title={'Manual Stock Manual Purchase'} />
      {/* ****** Header Content ****** */}
      <PageHeading title="Manual Stock Purchase" modulename="Asset" submodulename="Stock" mainpagename="Manual Stock Entry" subpagename="" subsubpagename="" />
      {isUserRoleCompare?.includes('amanualstockentry') && (
        <>
          <Box sx={userStyle.selectcontainer}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>Add Manual Stock Purchase Details</Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Company<b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <Selects
                      // options={companys}
                      options={accessbranch
                        ?.map((data) => ({
                          label: data.company,
                          value: data.company,
                        }))
                        .filter((item, index, self) => {
                          return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                        })}
                      styles={colourStyles}
                      value={{
                        label: stockmaster.company,
                        value: stockmaster.company,
                      }}
                      onChange={(e) => {
                        setStockmaster({
                          ...stockmaster,
                          company: e.value,
                          branch: 'Please Select Branch',
                          unit: 'Please Select Unit',
                          floor: 'Please Select Floor',
                          area: 'Please Select Area',
                          location: 'Please Select Location',
                        });
                        // setBranchs([]);
                        setUnits([]);
                        setFloors([]);
                        setAreas([]);
                        setLocations([{ label: 'ALL', value: 'ALL' }]);
                        fetchBranchDropdowns(e);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Branch<b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <Selects
                      // options={branchs}
                      options={accessbranch
                        ?.filter((comp) => stockmaster.company === comp.company)
                        ?.map((data) => ({
                          label: data.branch,
                          value: data.branch,
                        }))
                        .filter((item, index, self) => {
                          return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                        })}
                      styles={colourStyles}
                      value={{
                        label: stockmaster.branch,
                        value: stockmaster.branch,
                      }}
                      onChange={(e) => {
                        setNewcheckBranch(e.value);
                        setStockmaster({
                          ...stockmaster,
                          branch: e.value,
                          unit: 'Please Select Unit',
                          floor: 'Please Select Floor',
                          area: 'Please Select Area',
                          location: 'Please Select Location',
                        });
                        // setUnits([]);
                        // setFloors([]);
                        setAreas([]);
                        setLocations([{ label: 'ALL', value: 'ALL' }]);
                        fetchUnits(e);
                        fetchFloor(e.value);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Unit<b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <Selects
                      // options={units}
                      options={accessbranch
                        ?.filter((comp) => stockmaster.company === comp.company && stockmaster.branch === comp.branch)
                        ?.map((data) => ({
                          label: data.unit,
                          value: data.unit,
                        }))
                        .filter((item, index, self) => {
                          return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                        })}
                      styles={colourStyles}
                      value={{
                        label: stockmaster.unit,
                        value: stockmaster.unit,
                      }}
                      onChange={(e) => {
                        setStockmaster({
                          ...stockmaster,
                          unit: e.value,
                          floor: 'Please Select Floor',
                          area: 'Please Select Area',
                          location: 'Please Select Location',
                        });
                        // setFloors([]);
                        setAreas([]);
                        setLocations([{ label: 'ALL', value: 'ALL' }]);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Floor<b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <Selects
                      options={floors}
                      styles={colourStyles}
                      value={{
                        label: stockmaster.floor,
                        value: stockmaster.floor,
                      }}
                      onChange={(e) => {
                        setStockmaster({
                          ...stockmaster,
                          floor: e.value,
                          workstation: '',
                          area: 'Please Select Area',
                        });
                        // setAreas([]);
                        setLocations([{ label: 'ALL', value: 'ALL' }]);
                        fetchArea(stockmaster.branch, e.value);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Area<b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <Selects
                      options={areas}
                      styles={colourStyles}
                      value={{
                        label: stockmaster.area,
                        value: stockmaster.area,
                      }}
                      onChange={(e) => {
                        setStockmaster({
                          ...stockmaster,
                          area: e.value,
                          workstation: '',
                          location: 'Please Select Location',
                        });
                        setLocations([{ label: 'ALL', value: 'ALL' }]);
                        fetchLocation(stockmaster.branch, stockmaster.floor, stockmaster.area, e.value);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Location<b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <Selects
                      options={locations}
                      styles={colourStyles}
                      value={{
                        label: stockmaster.location,
                        value: stockmaster.location,
                      }}
                      onChange={(e) => {
                        setStockmaster({
                          ...stockmaster,
                          location: e.value,
                          workstation: '',
                        });
                      }}
                    />
                  </FormControl>
                </Grid>

                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Warranty</Typography>
                    <Select
                      fullWidth
                      labelId="demo-select-small"
                      id="demo-select-small"
                      value={stockmaster.warranty}
                      onChange={(e) => {
                        setStockmaster({
                          ...stockmaster,
                          warranty: e.target.value,
                        });
                      }}
                    >
                      <MenuItem value="" disabled>
                        {' '}
                        Please Select
                      </MenuItem>
                      <MenuItem value="Yes"> {'Yes'} </MenuItem>
                      <MenuItem value="No"> {'No'} </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                {stockmaster.warranty === 'Yes' && (
                  <>
                    <Grid item md={3} xs={12} sm={12}>
                      <Grid container>
                        <Grid item md={6} xs={6} sm={6}>
                          <Typography>Warranty Time</Typography>
                          <FormControl fullWidth size="small">
                            <OutlinedInput id="component-outlined" type="text" placeholder="Enter Time" value={stockmaster.estimation} onChange={(e) => handleChangephonenumber(e)} />
                          </FormControl>
                        </Grid>
                        <Grid item md={6} xs={6} sm={6}>
                          <Typography>Estimation</Typography>
                          <Select
                            fullWidth
                            labelId="demo-select-small"
                            id="demo-select-small"
                            value={stockmaster.estimationtime}
                            // onChange={(e) => {
                            //   setStockmaster({ ...stockmaster, estimationtime: e.target.value });
                            // }}
                            onChange={handleEstimationChange}
                          >
                            <MenuItem value="" disabled>
                              {' '}
                              Please Select
                            </MenuItem>
                            <MenuItem value="Days"> {'Days'} </MenuItem>
                            <MenuItem value="Month"> {'Month'} </MenuItem>
                            <MenuItem value="Year"> {'Year'} </MenuItem>
                          </Select>
                        </Grid>
                      </Grid>
                    </Grid>
                  </>
                )}
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Purchase date </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="date"
                      value={selectedPurchaseDate}
                      // onChange={(e) => {
                      //   setStockmaster({ ...stockmaster, purchasedate: e.target.value });
                      // }}
                      onChange={handlePurchaseDateChange}
                    />
                  </FormControl>
                </Grid>
                {stockmaster.warranty === 'Yes' && (
                  <>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Expiry Date </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder=""
                          value={stockmaster.warrantycalculation}
                        // onChange={(e) => {
                        //   setStockmaster({ ...stockmaster, warrantyCalculation: e.target.value });
                        // }}
                        />
                      </FormControl>
                    </Grid>
                  </>
                )}

                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      {' '}
                      Vendor Group Name
                      {/* <b style={{ color: "red" }}>*</b>{" "} */}
                    </Typography>
                    <Selects
                      // options={[...vendorModeOptions, ...vendorGroupOpt]}
                      options={[
                        ...vendorModeOptions,
                        ...vendorGroupOpt.filter((item, index, self) => {
                          return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                        }),
                      ]}
                      styles={colourStyles}
                      value={{ label: vendorGroup, value: vendorGroup }}
                      onChange={(e) => {
                        handleChangeGroupName(e);
                        setExpensecreate({
                          ...expensecreate,
                          vendorgrouping: e.value,
                          vendorname: 'Please Select Vendor',
                          vendorfrequency: '',
                          duedate: '',
                          paidmode: 'Please Select Paid Mode',
                        });
                        setVendorGroup(e.value);
                        setFrequencyValue('');
                        setGroupedVendorNames(vendorGroupOpt?.filter((item) => item.name === e.value)?.map((data) => data?.vendor));
                        setVendorModeOfPayments('');
                        setVendorNew('Choose Vendor');
                      }}
                    />
                  </FormControl>
                </Grid>

                <Grid item md={2.5} xs={12} sm={12}>
                  <FormControl size="small" fullWidth>
                    <Typography>
                      Vendor Name
                      {/* <b style={{ color: "red" }}>*</b>{" "} */}
                    </Typography>
                    <Selects
                      // options={[...vendorModeOptions, ...vendorOpt]}
                      options={[
                        ...vendorModeOptions,
                        ...vendorOpt?.filter((data) => groupedVendorNames?.includes?.(data?.value))
                      ]}
                      styles={colourStyles}
                      value={{ label: vendorNew, value: vendorNew }}
                      onChange={(e) => {
                        setDueDate(e)
                        setVendorNew(e.value);
                        setFrequencyValue(e.paymentfrequency);
                        setVendorModeOfPayments(e?.modeofpayments);
                        setVendorNewstock((prev) => ({
                          ...prev,
                          ...e,
                        }));
                        vendorid(e._id);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={0.5} sm={1} xs={1}>
                  <Button
                    variant="contained"
                    style={{
                      height: '30px',
                      minWidth: '20px',
                      padding: '19px 13px',
                      color: 'white',
                      marginTop: '23px',
                      marginLeft: '-10px',
                      background: 'rgb(25, 118, 210)',
                    }}
                    onClick={() => {
                      handleClickOpenviewalertvendor();
                    }}
                  >
                    <FaPlus style={{ fontSize: '15px' }} />
                  </Button>
                </Grid>
                <Grid item lg={3} md={3} xs={12} sm={6}>
                  <FormControl size="small" fullWidth>
                    <Typography>Frequency</Typography>
                    <OutlinedInput id="component-outlined" type="text" sx={userStyle.input} placeholder="Please Enter Frequency" value={frequencyValue} readOnly />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>GST No</Typography>
                    <OutlinedInput id="component-outlined" type="text" value={vendorgetid?.gstnumber} readOnly />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Bill No</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      sx={userStyle.input}
                      placeholder="Please Enter Billno"
                      value={stockmaster.billno}
                      onChange={(e) => {
                        setStockmaster({
                          ...stockmaster,
                          billno: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>

                {stockmaster.warranty === 'Yes' && (
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Warranty Details</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={stockmaster.warrantydetails}
                        sx={userStyle.input}
                        placeholder="Please Enter Warranty Details"
                        onChange={(e) => {
                          setStockmaster({
                            ...stockmaster,
                            warrantydetails: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                )}




                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Bill Date</Typography>
                    <TextField
                      size="small"
                      type="date"
                      value={stockmaster.billdate}
                      onChange={(e) => {
                        setStockmaster({
                          ...stockmaster,
                          billdate: e.target.value,
                          duedate: ''
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={2} md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>Due Date</Typography>
                    <OutlinedInput
                      id="to-date"
                      type="date"
                      value={expensecreate.duedate}
                      onChange={(e) => {
                        setExpensecreate({
                          ...expensecreate,
                          duedate: e.target.value,
                        });
                      }}
                      inputProps={{
                        min: stockmaster.date,
                        // max: today
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={1.5} xs={12} sm={12}>
                  <Typography>Bill</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'left' }}>
                    <Button variant="contained" onClick={handleClickUploadPopupOpen}>
                      Upload
                    </Button>
                  </Box>
                </Grid>
                {stockmaster.warranty === 'Yes' && (
                  <Grid item md={1.5} xs={12} sm={12}>
                    <Typography>Warranty Card </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'left' }}>
                      <Button variant="contained" onClick={handleClickUploadPopupOpenwarranty}>
                        Upload
                      </Button>
                    </Box>
                  </Grid>
                )}

                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Stock Mode For<b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <Selects
                      options={requestModeOptions}
                      styles={colourStyles}
                      value={{
                        label: stockmaster.requestmode,
                        value: stockmaster.requestmode,
                      }}
                      onChange={(e) => {
                        // fetchAsset();
                        setStockmaster({
                          ...stockmaster,
                          requestmode: e.value,
                          productname: 'Please Select Material',
                          component: 'Please Select Component',

                          assettype: '',
                          asset: '',
                          productdetails: '',

                          uom: 'Please Select UOM',
                          quantity: 1,

                          files: '',
                          warrantyfiles: '',

                          // warranty: "Yes",
                          // warrantycalculation: "",
                          // estimation: "",
                          // estimationtime: "Days",
                          purchasedate: '',

                          addedby: '',
                          updatedby: '',

                          stockcategory: 'Please Select Stock Category',
                          stocksubcategory: 'Please Select Stock Sub Category',
                          uomnew: '',
                          quantitynew: 1,
                          materialnew: 'Please Select Material',
                          productdetailsnew: '',
                        });
                        if (e.value === 'Stock Material') {
                          setIsStockMaterial(true);
                        } else {
                          setIsStockMaterial(false);
                        }
                        setTodos([]);
                        setSubcategoryOption([]);
                        setMaterialoptNew([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                {stockmaster.requestmode === 'Asset Material' && (
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Rate<b style={{ color: 'red' }}>*</b>{' '}
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="number"
                        sx={userStyle.input}
                        placeholder="Please Enter Rate"
                        value={stockmaster.rate}
                        onChange={(e) => {
                          const quantity = stockmaster.requestmode == 'Stock Material' ? Number(stockmaster.quantitynew) : Number(stockmaster.quantity);
                          setStockmaster({
                            ...stockmaster,
                            rate: e.target.value,
                          });
                          setAmount(Number(e.target.value) * Number(quantity));
                        }}
                      />
                    </FormControl>
                  </Grid>
                )}

                {/* {stockmaster.requestmode === 'Asset Material' && (
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Bill Amount<b style={{ color: 'red' }}>*</b>{' '}
                      </Typography>
                      <OutlinedInput id="component-outlined" type="number" sx={userStyle.input} value={Number(totalAmount)} />
                    </FormControl>
                  </Grid>
                )}
                {stockmaster.requestmode === 'Stock Material' && (
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Total Bill Amount<b style={{ color: 'red' }}>*</b>{' '}
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="number"
                        sx={userStyle.input}
                        // value={Number(totalAmount)}
                        value={stockmaster.totalbillamount}
                        onChange={(e) => {
                          setStockmaster({
                            ...stockmaster,
                            totalbillamount: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                )} */}
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Total Bill Amount<b style={{ color: 'red' }}>*</b>{' '}
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      sx={userStyle.input}

                      value={stockmaster.requestmode === 'Stock Material' ? stockmaster.totalbillamount : Number(totalAmount)}

                      // onChange={(e) => {
                      //   setStockmaster({
                      //     ...stockmaster,
                      //     totalbillamount: e.target.value,
                      //   });
                      // }}
                      onChange={
                        stockmaster.requestmode === 'Stock Material'
                          ? (e) =>
                            setStockmaster({
                              ...stockmaster,
                              totalbillamount: e.target.value,
                            })
                          : undefined
                      }


                    />
                  </FormControl>
                </Grid>
              </Grid>
              <br />

            

              {/* stock todo */}
              {stockmaster.requestmode === 'Stock Material' && (
                <>
                  <Grid item md={12} xs={12} sm={12}>
                    {' '}
                    <Typography variant="h6">Stock Purchase Todo List</Typography>
                  </Grid>
                  <Grid item md={12} sm={12} xs={12}>
                    <Grid container spacing={3} sx={{ display: 'flex' }}>
                      {stockmaster.requestmode === 'Stock Material' && (
                        <>
                          <Grid item md={2.5} sm={6} xs={12}>
                            <FormControl fullWidth size="small">
                              <Typography>Category</Typography>
                              <Selects
                                options={stockCategoryOptions}
                                styles={colourStyles}
                                value={{
                                  label: todoDetails.category,
                                  value: todoDetails.category,
                                }}
                                onChange={(e) => {
                                  setItemAllShow(false);
                                  setTodoDetails({
                                    ...todoDetails,
                                    category: e.value,
                                    subcategory: 'Please Select Sub Category',
                                    materialnew: todoDetails.particularmode === 'Others' ? '' : 'Please Select Item Name',
                                    uomnew: '',
                                    rate: '',
                                    quantitynew: '',
                                    amount: '',
                                  });
                                }}
                              />
                            </FormControl>
                          </Grid>
                          {isUserRoleCompare?.includes('astockcategory') && (
                            <Grid item md={0.5} sm={1} xs={1}>
                              <Button
                                variant="contained"
                                style={{
                                  height: '30px',
                                  minWidth: '20px',
                                  padding: '19px 13px',
                                  color: 'white',
                                  marginTop: '23px',
                                  marginLeft: '-10px',
                                  background: 'rgb(25, 118, 210)',
                                }}
                                onClick={() => {
                                  handleClickOpenviewalertstockcategory();
                                }}
                              >
                                <FaPlus style={{ fontSize: '15px' }} />
                              </Button>
                            </Grid>
                          )}
                          <Grid item md={3} sm={6} xs={12}>
                            <FormControl fullWidth size="small">
                              <Typography>Sub Category</Typography>
                              <Selects
                                options={allStockCategory
                                  .filter((item) => item.categoryname === todoDetails.category)
                                  .map((item) => {
                                    return item.subcategoryname.map((subCatName) => ({
                                      label: subCatName,
                                      value: subCatName,
                                    }));
                                  })
                                  .flat()}
                                styles={colourStyles}
                                value={{
                                  label: todoDetails.subcategory,
                                  value: todoDetails.subcategory,
                                }}
                                onChange={(e) => {
                                  if (e.value !== 'Please Select Sub Category') {
                                    setItemAllShow(false);
                                  } else {
                                    setItemAllShow(true);
                                  }
                                  setTodoDetails({
                                    ...todoDetails,
                                    subcategory: e.value,
                                    materialnew: todoDetails.particularmode === 'Others' ? '' : 'Please Select Item Name',
                                    uomnew: '',
                                    rate: '',
                                    quantitynew: '',
                                    productdetailsnew: '',
                                    amount: '',
                                  });
                                }}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item md={2.5} sm={6} xs={12}>
                            <FormControl fullWidth size="small">
                              <Typography>
                                Item Name <b style={{ color: 'red' }}>*</b>
                              </Typography>
                              <Selects
                                options={
                                  !itemAllShow
                                    ? allStockValues
                                      .filter((item) => item.stockcategory === todoDetails.category && item.stocksubcategory === todoDetails.subcategory)
                                      .map((item) => ({
                                        label: item.itemname,
                                        value: item.itemname,
                                        uom: item.uom,
                                      }))
                                    : allStockValues.map((item) => ({
                                      label: item.itemname,
                                      value: item.itemname,
                                      uom: item.uom,
                                    }))
                                }
                                styles={colourStyles}
                                value={{
                                  label: todoDetails.materialnew,
                                  value: todoDetails.materialnew,
                                }}
                                onChange={(e) => {
                                  setTodoDetails({
                                    ...todoDetails,
                                    materialnew: e.value,
                                    uomnew: e.uom,
                                    rate: '',
                                    quantitynew: '',
                                    productdetailsnew: '',
                                    amount: '',
                                  });
                                }}
                              />
                            </FormControl>
                          </Grid>
                          {isUserRoleCompare?.includes('amanagestockitems') && (
                            <Grid item md={0.5} sm={1} xs={1}>
                              <Button
                                variant="contained"
                                style={{
                                  height: '30px',
                                  minWidth: '20px',
                                  padding: '19px 13px',
                                  color: 'white',
                                  marginTop: '23px',
                                  marginLeft: '-10px',
                                  background: 'rgb(25, 118, 210)',
                                }}
                                onClick={() => {
                                  handleClickOpenviewalertstockitem();
                                }}
                              >
                                <FaPlus style={{ fontSize: '15px' }} />
                              </Button>
                            </Grid>
                          )}
                          <Grid item md={3} sm={6} xs={12}>
                            <FormControl fullWidth size="small">
                              <Typography>UOM</Typography>
                              <OutlinedInput id="component-outlined" type="text" placeholder="Please Enter UOM" value={todoDetails.uomnew} readOnly />
                            </FormControl>
                          </Grid>
                        </>
                      )}

                      <Grid item md={3} sm={6} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Rate <b style={{ color: 'red' }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            placeholder="Please Enter Rate"
                            inputMode="decimal"
                            pattern="[0-9]*"
                            value={todoDetails.rate}
                            onChange={(e) => {
                              const value = e.target.value;
                              const regex = /^\d*\.?\d{0,2}$/;
                              if (regex.test(value) || value === '') {
                                setTodoDetails({
                                  ...todoDetails,
                                  rate: value,
                                  amount: Number(value) * Number(todoDetails.quantitynew),
                                });
                              }
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} sm={6} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Quantity <b style={{ color: 'red' }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            placeholder="Please Enter Quantity"
                            value={todoDetails.quantitynew}
                            onChange={(e) => {
                              const input = e.target.value;
                              if (/^\d*\.?\d*$/.test(input) && input >= 0) {
                                setTodoDetails({
                                  ...todoDetails,
                                  quantitynew: input,
                                  amount: Number(input) * Number(todoDetails.rate),
                                });
                              }
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} sm={6} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Amount<b style={{ color: 'red' }}>*</b>
                          </Typography>
                          <OutlinedInput id="component-outlined" type="number" placeholder="Please Enter Amount" sx={userStyle.input} value={todoDetails.amount} readOnly />
                        </FormControl>
                      </Grid>
                      <Grid item md={todoDetails.particularmode !== 'Others' ? 2.5 : 3} sm={6} xs={12}>
                        <Typography>
                          Product Details<b style={{ color: 'red' }}>*</b>
                        </Typography>
                        <TextareaAutosize
                          aria-label="minimum height"
                          minRows={3}
                          minCols={10}
                          value={todoDetails.productdetailsnew}
                          placeholder="Please Enter Product Details"
                          onChange={(e) => {
                            setTodoDetails({
                              ...todoDetails,
                              productdetailsnew: e.target.value,
                            });
                          }}
                        />
                      </Grid>
                      <Grid item md={0.1} sm={6} xs={12} sx={{ marginTop: '-20px' }}>
                        <Button
                          variant="contained"
                          color="success"
                          style={{
                            height: '30px',
                            minWidth: '20px',
                            padding: '19px 13px',
                            marginTop: '25px',
                          }}
                          onClick={educationTodo}
                        >
                          <FaPlus />
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>{' '}
                  <br />
                  <Grid container spacing={2}>
                    <Grid item md={12} xs={12} sm={12}>
                      <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable">
                          <TableHead sx={{ fontWeight: '600' }}>
                            <StyledTableRow>
                              <StyledTableCell>SNo</StyledTableCell>
                              <StyledTableCell>Item Name</StyledTableCell>
                              <StyledTableCell>UOM</StyledTableCell>
                              <StyledTableCell>Rate</StyledTableCell>
                              <StyledTableCell>Quantity</StyledTableCell>
                              <StyledTableCell>Amount</StyledTableCell>
                              <StyledTableCell>Product Details</StyledTableCell>
                              <StyledTableCell>Actions</StyledTableCell>
                            </StyledTableRow>
                          </TableHead>
                          <TableBody align="left">
                            {educationtodo?.length > 0 ? (
                              educationtodo?.map((row, index) => (
                                <StyledTableRow>
                                  <StyledTableCell>{index + 1}</StyledTableCell>
                                  <StyledTableCell>{row.materialnew}</StyledTableCell>
                                  <StyledTableCell>{row.uomnew}</StyledTableCell>
                                  <StyledTableCell>{row.rate}</StyledTableCell>
                                  <StyledTableCell>{row.quantitynew}</StyledTableCell>
                                  <StyledTableCell>{row.amount}</StyledTableCell>
                                  <StyledTableCell>{row.productdetailsnew}</StyledTableCell>
                                  <StyledTableCell>
                                    <CloseIcon
                                      sx={{ color: 'red', cursor: 'pointer' }}
                                      onClick={() => {
                                        educationTodoremove(index);
                                      }}
                                    />
                                  </StyledTableCell>
                                </StyledTableRow>
                              ))
                            ) : (
                              <StyledTableRow>
                                {' '}
                                <StyledTableCell colSpan={8} align="center">
                                  No Data Available
                                </StyledTableCell>{' '}
                              </StyledTableRow>
                            )}
                            <StyledTableRow></StyledTableRow>
                          </TableBody>
                          <TableFooter sx={{ backgroundColor: '#9591914f', height: '50px' }}>
                            {educationtodo &&
                              educationtodo.forEach((item) => {
                                Expensetotal += +item.amount;
                              })}
                            <StyledTableRow className="table2_total">
                              <StyledTableCell align="left" colSpan={4}></StyledTableCell>
                              <StyledTableCell align="left">Manual Total (Rs.)</StyledTableCell>
                              <StyledTableCell align="left">{Expensetotal.toFixed(2)}</StyledTableCell>
                              <StyledTableCell align="left"></StyledTableCell>
                              <StyledTableCell align="left"></StyledTableCell>
                            </StyledTableRow>
                          </TableFooter>
                        </Table>
                      </TableContainer>{' '}
                    </Grid>
                  </Grid>
                  <br />
                  <Grid container spacing={2} sx={{ display: 'flex' }}>
                    <Grid item lg={3} md={4} xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Paid Status<b style={{ color: 'red' }}>*</b>
                        </Typography>
                        <Selects
                          maxMenuHeight={250}
                          options={statusOpt}
                          placeholder="Please Select Status"
                          value={{
                            label: expensecreate.paidstatus,
                            value: expensecreate.paidstatus,
                          }}
                          onChange={(e) => {
                            setExpensecreate({
                              ...expensecreate,
                              paidstatus: e.value,
                              paidmode: 'Please Select Paid Mode',
                            });
                          }}
                          isDisabled={Number(Expensetotal) !== Number(stockmaster.totalbillamount)}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item lg={3} md={4} xs={12} sm={6}>
                      {expensecreate.paidstatus === 'Paid' && (
                        <FormControl fullWidth size="small">
                          <Typography>
                            Paid Mode<b style={{ color: 'red' }}>*</b>
                          </Typography>
                          <Selects
                            maxMenuHeight={250}
                            options={paidOpt?.filter((data) => vendorModeOfPayments?.includes(data?.label))}
                            placeholder="Please Select Paid Mode"
                            value={{
                              label: expensecreate.paidmode,
                              value: expensecreate.paidmode,
                            }}
                            onChange={(e) => {
                              setExpensecreate({
                                ...expensecreate,
                                paidmode: e.value,
                              });
                            }}
                          />
                        </FormControl>
                      )}
                    </Grid>
                    <Grid item lg={3} md={4} xs={12} sm={6}>
                      {expensecreate.paidstatus === 'Paid' && (
                        <FormControl fullWidth size="small">
                          <Typography>
                            Paid Amount<b style={{ color: 'red' }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="number"
                            placeholder="Please Enter Paid Amount"
                            sx={userStyle.input}
                            value={expensecreate.paidamount}
                            onChange={(e) => {
                              if (Number(e.target.value) <= Number(stockmaster.totalbillamount)) {
                                setExpensecreate({
                                  ...expensecreate,
                                  paidamount: e.target.value,
                                  balanceamount: stockmaster.totalbillamount - e.target.value,
                                });
                              }
                            }}
                          />
                        </FormControl>
                      )}
                    </Grid>
                    <Grid item lg={3} md={4} xs={12} sm={6}>
                      {expensecreate.paidstatus === 'Paid' && (
                        <FormControl fullWidth size="small">
                          <Typography>
                            Balance Amount<b style={{ color: 'red' }}>*</b>
                          </Typography>
                          <OutlinedInput readOnly id="component-outlined" type="number" sx={userStyle.input} placeholder="Please Enter Balance Amount" value={expensecreate.balanceamount} />
                        </FormControl>
                      )}
                    </Grid>
                    <br /> <br />
                    {expensecreate.paidstatus === 'Paid' && expensecreate.paidmode === 'Cash' && (
                      <>
                        <br />
                        <br />
                        <br />

                        <Grid item md={4} lg={3} xs={12} sm={12} sx={{ display: 'flex' }}>
                          <FormControl fullWidth size="small">
                            <Typography sx={{ fontWeight: 'bold' }}>Cash</Typography>
                            <br />

                            <OutlinedInput id="component-outlined" type="text" readOnly={true} value={'Cash'} onChange={(e) => { }} />
                          </FormControl>
                        </Grid>
                      </>
                    )}
                    <br />
                    <br />
                    {expensecreate.paidmode === 'Bank Transfer' && expensecreate.paidstatus === 'Paid' && (
                      <>
                        <br />
                        <br />

                        <Grid item md={12} xs={8}>
                          <Typography sx={{ fontWeight: 'bold' }}>Bank Details</Typography>
                        </Grid>

                        <br />
                        <br />

                        <Grid item md={4} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Bank Name</Typography>
                            <OutlinedInput readOnly={true} value={vendorstock.bankname} />
                          </FormControl>
                        </Grid>
                        <Grid item md={4} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Bank Branch Name</Typography>
                            <OutlinedInput readOnly={true} value={vendorstock.bankbranchname} />
                          </FormControl>
                        </Grid>
                        <Grid item md={4} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Account Holder Name</Typography>
                            <OutlinedInput readOnly={true} value={vendorstock.accountholdername} />
                          </FormControl>
                        </Grid>
                        <Grid item md={4} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Account Number</Typography>
                            <OutlinedInput readOnly={true} value={vendorstock.accountnumber} />
                          </FormControl>
                        </Grid>
                        <Grid item md={4} xs={12} sm={12} sx={{ display: 'flex' }}>
                          <FormControl fullWidth size="small">
                            <Typography>IFSC Code</Typography>
                            <OutlinedInput readOnly={true} value={vendor.ifsccode} />
                          </FormControl>
                        </Grid>
                      </>
                    )}
                    <br /> <br />
                    {expensecreate.paidmode === 'UPI' && expensecreate.paidstatus === 'Paid' && (
                      <>
                        <Grid item md={12} xs={8}>
                          <Typography sx={{ fontWeight: 'bold' }}>UPI Details</Typography>
                        </Grid>

                        <br />
                        <br />

                        <Grid item md={3} xs={12} sm={12} sx={{ display: 'flex' }}>
                          <FormControl fullWidth size="small">
                            <Typography>UPI Number</Typography>
                            <OutlinedInput readOnly={true} value={vendorstock.upinumber} />
                          </FormControl>
                        </Grid>
                      </>
                    )}
                    <br /> <br />
                    {expensecreate.paidmode === 'Card' && expensecreate.paidstatus === 'Paid' && (
                      <>
                        <Grid md={12} item xs={8}>
                          <Typography sx={{ fontWeight: 'bold' }}>Card Details</Typography>
                        </Grid>

                        <br />
                        <Grid item md={3} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Card Number</Typography>
                            <OutlinedInput readOnly={true} value={vendorstock.cardnumber} />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Card Holder Name</Typography>
                            <OutlinedInput readOnly={true} value={vendorstock.cardholdername} />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Card Transaction Number</Typography>
                            <OutlinedInput readOnly={true} value={vendorstock.cardtransactionnumber} />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Card Type</Typography>
                            <OutlinedInput readOnly={true} value={vendorstock.cardtype} />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={6}>
                          <Typography>Expire At</Typography>
                          <Grid container spacing={1}>
                            <Grid item md={6} xs={12} sm={6}>
                              <FormControl fullWidth size="small">
                                <OutlinedInput readOnly={true} value={vendorstock.cardmonth} />
                              </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={6}>
                              <FormControl fullWidth size="small">
                                <OutlinedInput readOnly={true} value={vendorstock.cardyear} />
                              </FormControl>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12} sx={{ display: 'flex' }}>
                          <FormControl fullWidth size="small">
                            <Typography>Security Code</Typography>
                            <OutlinedInput readOnly={true} value={vendorstock.cardsecuritycode} />
                          </FormControl>
                        </Grid>
                      </>
                    )}
                    <br />
                    <br />
                    {expensecreate.paidmode === 'Cheque' && expensecreate.paidstatus === 'Paid' && (
                      <>
                        <Grid item md={12} xs={8}>
                          <Typography sx={{ fontWeight: 'bold' }}>Cheque Details</Typography>
                        </Grid>

                        <br />

                        <Grid item md={3} xs={12} sm={12} sx={{ display: 'flex' }}>
                          <FormControl fullWidth size="small">
                            <Typography>Cheque Number</Typography>
                            <OutlinedInput readOnly={true} value={vendorstock.chequenumber} />
                          </FormControl>
                        </Grid>
                      </>
                    )}
                  </Grid>
                </>
              )}

              <Grid container spacing={2}>
                <Grid item lg={1} md={2} sm={2} xs={12} marginTop={3}>
                  {/* {btnSubmit ? (
                    <Box sx={{ display: "flex" }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <> */}
                  <LoadingButton loading={btnSubmit} variant="contained" sx={buttonStyles.buttonsubmit} onClick={handleSubmit}>
                    Create
                  </LoadingButton>
                  {/* </>
                  )} */}
                </Grid>
                <Grid item lg={1} md={2} sm={2} xs={12} marginTop={3}>
                  <Button sx={buttonStyles.btncancel} onClick={handleclear}>
                    Clear
                  </Button>
                </Grid>
                 <Grid item lg={1} md={2} sm={2} xs={12} marginTop={3}>
                  <Button sx={buttonStyles.btncancel} onClick={handleCloseviewalertvendormanual}>
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
        </>
      )}
  

 


      {/* dialog box for vendor details */}

      <Dialog
        open={openviewalertvendor}
        onClose={handleClickOpenviewalertvendor}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        sx={{
          marginTop: '95px',
        }}
        fullWidth={true}
      >
        <VendorPopup setVendorAuto={setVendorAuto} handleCloseviewalertvendor={handleCloseviewalertvendor} sendDataToParent={handleDataFromChild} />
      </Dialog>

      {/* dialog box for uom details */}
      <Dialog
        open={openviewalertUom}
        onClose={handleClickOpenviewalertUom}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        sx={{
          overflow: 'visible',
          '& .MuiPaper-root': {
            overflow: 'visible',
          },
        }}
        fullWidth={true}
      >
        <Box sx={userStyle.dialogbox}>
          <>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography sx={userStyle.importheadtext}>Manage UOM</Typography>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={2}>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Name<b style={{ color: 'red' }}>*</b>
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    placeholder="Please Enter Name"
                    value={vomMaster.name}
                    onChange={(e) => {
                      setVomMaster({ ...vomMaster, name: e.target.value });
                    }}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <br />
            <br />

            <Grid container>
              <Grid item md={3} xs={12} sm={6}>
                <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={handleSubmituom}>
                  Submit
                </Button>
              </Grid>
              <Grid item md={3} xs={12} sm={6}>
                <Button sx={buttonStyles.btncancel} onClick={handleclearuom}>
                  Clear
                </Button>
              </Grid>
              <Grid item md={3} xs={12} sm={6}>
                <Button sx={buttonStyles.btncancel} onClick={handleCloseviewalertUom}>
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </>
        </Box>
      </Dialog>

      <Dialog
        open={openviewalertAsset}
        onClose={handleClickOpenviewalertAsset}
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
        <Grid item md={2.5} xs={12} sm={6}>
          <Button sx={userStyle.btncancel} onClick={handleCloseviewalertAsset}>
            Cancel
          </Button>
        </Grid>
      </Dialog>

      {/* UPLOAD BILL CREATE IMAGE DIALOG */}
      <Dialog open={uploadPopupOpen} onClose={handleUploadPopupClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md" sx={{ marginTop: '95px' }}>
        <DialogTitle id="customized-dialog-title1" sx={{ backgroundColor: '#e0e0e0', color: '#000', display: 'flex' }}>
          Upload Image
        </DialogTitle>
        <DialogContent sx={{ minWidth: '750px', height: '850px' }}>
          <Grid container spacing={2}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <br />
              <FormControl size="small" fullWidth>
                <Grid sx={{ display: 'flex' }}>
                  <Button variant="contained" component="label" sx={userStyle.uploadbtn}>
                    Upload
                    <input type="file" multiple id="productimage" accept="image/*" hidden onChange={handleInputChange} />
                  </Button>
                  &ensp;
                </Grid>
              </FormControl>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              {refImage.map((file, index) => (
                <Grid container key={index}>
                  <Grid item md={2} sm={2} xs={2}>
                    <Box
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      {file.type.includes('image/') ? (
                        <img
                          src={file.preview}
                          alt={file.name}
                          height={50}
                          style={{
                            maxWidth: '-webkit-fill-available',
                          }}
                        />
                      ) : (
                        <img className={classes.preview} src={getFileIcon(file.name)} height="10" alt="file icon" />
                      )}
                    </Box>
                  </Grid>
                  <Grid
                    item
                    md={7}
                    sm={7}
                    xs={7}
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="subtitle2"> {file.name} </Typography>
                  </Grid>
                  <Grid item md={1} sm={1} xs={1}>
                    <Grid sx={{ display: 'flex' }}>
                      <Button
                        sx={{
                          padding: '14px 14px',
                          minWidth: '40px !important',
                          borderRadius: '50% !important',
                          ':hover': {
                            backgroundColor: '#80808036', // theme.palette.primary.main
                          },
                        }}
                        onClick={() => renderFilePreview(file)}
                      >
                        <VisibilityOutlinedIcon style={{ fontsize: '12px', color: '#357AE8' }} />
                      </Button>
                      <Button
                        sx={{
                          padding: '14px 14px',
                          minWidth: '40px !important',
                          borderRadius: '50% !important',
                          ':hover': {
                            backgroundColor: '#80808036', // theme.palette.primary.main
                          },
                        }}
                        onClick={() => handleDeleteFile(index)}
                      >
                        <FaTrash style={{ color: '#a73131', fontSize: '12px' }} />
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUploadOverAll} variant="contained">
            Ok
          </Button>
          <Button onClick={resetImage} sx={userStyle.btncancel}>
            Reset
          </Button>
          <Button onClick={handleUploadPopupClose} sx={userStyle.btncancel}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* UPLOAD BILL IMAGE DIALOG EDIT*/}
      <Dialog open={uploadPopupOpenedit} onClose={handleUploadPopupCloseedit} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md" sx={{ marginTop: '95px' }}>
        <DialogTitle id="customized-dialog-title1" sx={{ backgroundColor: '#e0e0e0', color: '#000', display: 'flex' }}>
          Upload Image
        </DialogTitle>
        <DialogContent sx={{ minWidth: '750px', height: '850px' }}>
          <Grid container spacing={2}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <br />
              <FormControl size="small" fullWidth>
                <Grid sx={{ display: 'flex' }}>
                  <Button variant="contained" component="label" sx={userStyle.uploadbtn}>
                    Upload
                    <input type="file" multiple id="productimage" accept="image/*" hidden onChange={handleInputChangeedit} />
                  </Button>
                  &ensp;
                </Grid>
              </FormControl>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              {refImageedit.map((file, index) => (
                <Grid container key={index}>
                  <Grid item md={2} sm={2} xs={2}>
                    <Box
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      {file.type.includes('image/') ? (
                        <img
                          src={file.preview}
                          alt={file.name}
                          height={50}
                          style={{
                            maxWidth: '-webkit-fill-available',
                          }}
                        />
                      ) : (
                        <img className={classes.preview} src={getFileIconedit(file.name)} height="10" alt="file icon" />
                      )}
                    </Box>
                  </Grid>
                  <Grid
                    item
                    md={7}
                    sm={7}
                    xs={7}
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="subtitle2"> {file.name} </Typography>
                  </Grid>
                  <Grid item md={1} sm={1} xs={1}>
                    <Grid sx={{ display: 'flex' }}>
                      <Button
                        sx={{
                          padding: '14px 14px',
                          minWidth: '40px !important',
                          borderRadius: '50% !important',
                          ':hover': {
                            backgroundColor: '#80808036', // theme.palette.primary.main
                          },
                        }}
                        onClick={() => renderFilePreviewedit(file)}
                      >
                        <VisibilityOutlinedIcon style={{ fontsize: '12px', color: '#357AE8' }} />
                      </Button>
                      <Button
                        sx={{
                          padding: '14px 14px',
                          minWidth: '40px !important',
                          borderRadius: '50% !important',
                          ':hover': {
                            backgroundColor: '#80808036', // theme.palette.primary.main
                          },
                        }}
                        onClick={() => handleDeleteFileedit(index)}
                      >
                        <FaTrash style={{ color: '#a73131', fontSize: '12px' }} />
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUploadOverAlledit} variant="contained">
            Ok
          </Button>
          <Button onClick={resetImageedit} sx={userStyle.btncancel}>
            Reset
          </Button>
          <Button onClick={handleUploadPopupCloseedit} sx={userStyle.btncancel}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* UPLOAD WARRANTY IMAGE DIALOG    CREATE*/}
      <Dialog open={uploadPopupOpenwarranty} onClose={handleUploadPopupClosewarranty} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md" sx={{ marginTop: '95px' }}>
        <DialogTitle id="customized-dialog-title1" sx={{ backgroundColor: '#e0e0e0', color: '#000', display: 'flex' }}>
          Upload Image
        </DialogTitle>
        <DialogContent sx={{ minWidth: '750px', height: '850px' }}>
          <Grid container spacing={2}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <br />
              <FormControl size="small" fullWidth>
                <Grid sx={{ display: 'flex' }}>
                  <Button variant="contained" component="label" sx={userStyle.uploadbtn}>
                    Upload
                    <input type="file" multiple id="productimage" accept="image/*" hidden onChange={handleInputChangewarranty} />
                  </Button>
                  &ensp;
                </Grid>
              </FormControl>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              {refImagewarranty.map((file, index) => (
                <Grid container key={index}>
                  <Grid item md={2} sm={2} xs={2}>
                    <Box
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      {file.type.includes('image/') ? (
                        <img
                          src={file.preview}
                          alt={file.name}
                          height={50}
                          style={{
                            maxWidth: '-webkit-fill-available',
                          }}
                        />
                      ) : (
                        <img className={classes.preview} src={getFileIconwarranty(file.name)} height="10" alt="file icon" />
                      )}
                    </Box>
                  </Grid>
                  <Grid
                    item
                    md={7}
                    sm={7}
                    xs={7}
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="subtitle2"> {file.name} </Typography>
                  </Grid>
                  <Grid item md={1} sm={1} xs={1}>
                    <Grid sx={{ display: 'flex' }}>
                      <Button
                        sx={{
                          padding: '14px 14px',
                          minWidth: '40px !important',
                          borderRadius: '50% !important',
                          ':hover': {
                            backgroundColor: '#80808036', // theme.palette.primary.main
                          },
                        }}
                        onClick={() => renderFilePreviewwarranty(file)}
                      >
                        <VisibilityOutlinedIcon style={{ fontsize: '12px', color: '#357AE8' }} />
                      </Button>
                      <Button
                        sx={{
                          padding: '14px 14px',
                          minWidth: '40px !important',
                          borderRadius: '50% !important',
                          ':hover': {
                            backgroundColor: '#80808036', // theme.palette.primary.main
                          },
                        }}
                        onClick={() => handleDeleteFilewarranty(index)}
                      >
                        <FaTrash style={{ color: '#a73131', fontSize: '12px' }} />
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUploadOverAllwarranty} variant="contained">
            Ok
          </Button>
          <Button onClick={resetImagewarranty} sx={userStyle.btncancel}>
            Reset
          </Button>
          <Button onClick={handleUploadPopupClosewarranty} sx={userStyle.btncancel}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* dialog box for capacity */}
      <Dialog
        open={openCapacity}
        onClose={handleClickOpenCapacity}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        sx={{
          overflow: 'visible',
          '& .MuiPaper-root': {
            overflow: 'visible',
          },
        }}
        fullWidth={true}
      >
        {isUserRoleCompare?.includes('aassetcapacity') ? (
          <Box sx={userStyle.dialogbox}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>Manage Capacity</Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Name <b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Name"
                      value={capacityname}
                      onChange={(e) => {
                        setcapacityname(e.target.value);
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <br />
              <br />
              <Grid container>
                <Grid item md={3} xs={12} sm={6}>
                  <Button
                    variant="contained"
                    sx={buttonStyles.buttonsubmit}
                  //  onClick={handleSubmitCapacity}
                  >
                    Submit
                  </Button>
                </Grid>
                <br />
                <Grid item md={3} xs={12} sm={6}>
                  <Button
                    sx={buttonStyles.btncancel}
                  // onClick={handleclearCapacity}
                  >
                    Clear
                  </Button>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <Button sx={buttonStyles.btncancel} onClick={handleClickCloseCapacity}>
                    Close
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
        ) : (
          <>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>Manage Capacity</Typography>
                </Grid>
              </Grid>
              <br />
              <br />
              <Box sx={{ textAlign: 'center' }}>
                <Typography>No Access</Typography>
              </Box>
              <br />
              <br />
            </DialogContent>
            <DialogActions>
              <Button sx={userStyle.btncancel} onClick={handleClickCloseCapacity}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* UPLOAD WARRANTY IMAGE DIALOG EDIT*/}
      <Dialog open={uploadPopupOpenwarrantyedit} onClose={handleUploadPopupClosewarrantyedit} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md" sx={{ marginTop: '95px' }}>
        <DialogTitle id="customized-dialog-title1" sx={{ backgroundColor: '#e0e0e0', color: '#000', display: 'flex' }}>
          Upload Image
        </DialogTitle>
        <DialogContent sx={{ minWidth: '750px', height: '850px' }}>
          <Grid container spacing={2}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <br />
              <FormControl size="small" fullWidth>
                <Grid sx={{ display: 'flex' }}>
                  <Button variant="contained" component="label" sx={userStyle.uploadbtn}>
                    Upload
                    <input type="file" multiple id="productimage" accept="image/*" hidden onChange={handleInputChangewarrantyedit} />
                  </Button>
                  &ensp;
                </Grid>
              </FormControl>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              {refImagewarrantyedit?.map((file, index) => (
                <Grid container key={index}>
                  <Grid item md={2} sm={2} xs={2}>
                    <Box
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      {file.type.includes('image/') ? (
                        <img
                          src={file.preview}
                          alt={file.name}
                          height={50}
                          style={{
                            maxWidth: '-webkit-fill-available',
                          }}
                        />
                      ) : (
                        <img className={classes.preview} src={getFileIconwarrantyedit(file.name)} height="10" alt="file icon" />
                      )}
                    </Box>
                  </Grid>
                  <Grid
                    item
                    md={7}
                    sm={7}
                    xs={7}
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="subtitle2"> {file.name} </Typography>
                  </Grid>
                  <Grid item md={1} sm={1} xs={1}>
                    <Grid sx={{ display: 'flex' }}>
                      <Button
                        sx={{
                          padding: '14px 14px',
                          minWidth: '40px !important',
                          borderRadius: '50% !important',
                          ':hover': {
                            backgroundColor: '#80808036', // theme.palette.primary.main
                          },
                        }}
                        onClick={() => renderFilePreviewwarrantyedit(file)}
                      >
                        <VisibilityOutlinedIcon style={{ fontsize: '12px', color: '#357AE8' }} />
                      </Button>
                      <Button
                        sx={{
                          padding: '14px 14px',
                          minWidth: '40px !important',
                          borderRadius: '50% !important',
                          ':hover': {
                            backgroundColor: '#80808036', // theme.palette.primary.main
                          },
                        }}
                        onClick={() => handleDeleteFilewarrantyedit(index)}
                      >
                        <FaTrash style={{ color: '#a73131', fontSize: '12px' }} />
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUploadOverAllwarrantyedit} variant="contained">
            Ok
          </Button>
          <Button onClick={resetImagewarrantyedit} sx={userStyle.btncancel}>
            Reset
          </Button>
          <Button onClick={handleUploadPopupClosewarrantyedit} sx={userStyle.btncancel}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <br />
      <br />
      {/* <ManuaStockTable vendorAuto={changeTable} /> */}

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
        itemsTwo={overallFilterdata ?? []}
        filename={'AssetPurchase'}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup openInfo={openInfo} handleCloseinfo={handleCloseinfo} heading="Asset Purchase Info" addedby={addedby} updateby={updateby} />
      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation open={isDeleteOpen} onClose={handleCloseMod} onConfirm={delProject} title="Are you sure?" confirmButtonText="Yes" cancelButtonText="Cancel" />
      {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation open={isDeleteOpencheckbox} onClose={handleCloseModcheckbox} onConfirm={delProjectcheckbox} title="Are you sure?" confirmButtonText="Yes" cancelButtonText="Cancel" />
      {/* PLEASE SELECT ANY ROW */}
      <PleaseSelectRow open={isDeleteOpenalert} onClose={handleCloseModalert} message="Please Select any Row" iconColor="orange" buttonText="OK" />
      {/* EXTERNAL COMPONENTS -------------- END */}

      <Dialog open={openviewalertstockcategory} onClose={handleClickOpenviewalertstockcategory} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="lg" sx={{ marginTop: '50px' }} fullWidth={true}>
        <StockCategoryPopup setStockCategoryAuto={setStockCategoryAuto} handleCloseviewalertstockcategory={handleCloseviewalertstockcategory} />
      </Dialog>
      {/* dialog box for manage stock items */}

      <Dialog
        open={openviewalertstockitem}
        onClose={handleClickOpenviewalertstockitem}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        sx={{
          overflow: 'visible',
          '& .MuiPaper-root': {
            overflow: 'visible',
          },
        }}
        fullWidth={true}
      >
        <ManageStockItemsPopup setStockItemAuto={setStockItemAuto} handleCloseviewalertstockitem={handleCloseviewalertstockitem} />
      </Dialog>

      <Dialog open={isErrorOpenAmount} onClose={handleCloseerrAmount} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent
          sx={{
            width: '350px',
            textAlign: 'center',
            alignItems: 'center',
          }}
        >
          <ErrorOutlineOutlinedIcon sx={{ fontSize: '100px', color: 'orange' }} />
          <Typography variant="h6" style={{ color: 'red' }}>
            {'Are you sure? Paid Amount is less than Total Bill Amount.Do you want to save?'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button sx={buttonStyles.btncancel} onClick={handleCloseerrAmount}>
            Cancel
          </Button>
          &nbsp;
          <Button
            variant="contained"
            style={{
              padding: '7px 13px',
              color: 'white',
              background: 'rgb(25, 118, 210)',
            }}
            onClick={sendRequest}
          >
            ok
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ManualMaster;