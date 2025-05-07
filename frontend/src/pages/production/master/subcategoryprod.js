import React, { useState, useEffect, useRef, useContext } from 'react';
import { Box, Typography, FormGroup, FormControlLabel, OutlinedInput, Dialog, Select, MenuItem, DialogContent, DialogActions, FormControl, Grid, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton } from '@mui/material';
import { userStyle } from '../../../pageStyle.js';
import { FaPrint, FaFilePdf } from 'react-icons/fa';
import { SERVICE } from '../../../services/Baseservice.js';
import { FaFileExcel, FaFileCsv } from 'react-icons/fa';
import StyledDataGrid from '../../../components/TableStyle.js';
import { handleApiError } from '../../../components/Errorhandling.js';
import axios from 'axios';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { useReactToPrint } from 'react-to-print';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { UserRoleAccessContext, AuthContext } from '../../../context/Appcontext.js';
import Headtitle from '../../../components/Headtitle.js';
import { ThreeDots } from 'react-loader-spinner';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import Selects from 'react-select';
import { saveAs } from 'file-saver';
import Switch from '@mui/material/Switch';
import CloseIcon from '@mui/icons-material/Close';
import html2canvas from 'html2canvas';
import ImageIcon from '@mui/icons-material/Image';
import LoadingButton from "@mui/lab/LoadingButton";
import ExportData from '../../../components/ExportData.js';
import AlertDialog from '../../../components/Alert.js';
import MessageAlert from '../../../components/MessageAlert.js';
import InfoPopup from '../../../components/InfoPopup.js';
import { MultiSelect } from 'react-multi-select-component';
import { DeleteConfirmation, PleaseSelectRow } from '../../../components/DeleteConfirmation.js';
import PageHeading from '../../../components/PageHeading.js';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';

function SubCategoryMaster() {
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

  let exportColumnNames = ['Project Name', 'category Name', 'Subcategory Name', 'Mode'];
  let exportRowValues = ['project', 'categoryname', 'name', 'mode'];

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };
  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  const [fileFormat, setFormat] = useState('');
  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [copiedData, setCopiedData] = useState('');
  const [searchQueryManage, setSearchQueryManage] = useState('');
  const [projects, setProjects] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategory, setSubcategory] = useState({ name: '', mode: 'Allot', enablepage: false });
  const [subcategoryid, setSubcategoryid] = useState({ name: '', mode: 'Allot', enablepage: false });
  const [selectedProject, setSelectedProject] = useState('Please Select Project');
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Please Select Category');
  const [selectedProjectedit, setSelectedProjectedit] = useState('Please Select Project');
  const [selectedCategoryedit, setSelectedCategoryedit] = useState('Please Select Category');
  const [modulecheck, setmodulecheck] = useState(false);
  const { isUserRoleCompare, isUserRoleAccess, isAssignBranch, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);
  const [allModuleedit, setAllModuleedit] = useState([]);
  const username = isUserRoleAccess.username;
  const [getrowid, setRowGetid] = useState('');

  const [mismatchMode, setMismatchMode] = useState([]);
  const [mismatchModeEdit, setMismatchModeEdit] = useState([]);

  const [totalPages, setTotalPages] = useState(0);
  const [visiblePages, setVisiblePages] = useState(3);
  const [pageNumbers, setPageNumbers] = useState([]);

  const [selectedCompany, setSelectedCompany] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState([]);
  const [selectedProcess, setSelectedProcess] = useState([]);
  const [selectedRowsCate, setSelectedRowsCate] = useState([]);
  const mismatchModes = [
    { label: 'Unit + Flag', value: 'Unit + Flag' },
    { label: 'Unit', value: 'Unit' },
    { label: 'Flag', value: 'Flag' },
    { label: 'Unit + Section', value: 'Unit + Section' },
    { label: 'Flag Mismatched', value: 'Flag Mismatched' },
  ];

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { auth } = useContext(AuthContext);
  //datatable....
  const [searchQuery, setSearchQuery] = useState('');
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    // setPage(1);
  };
  const modes = [
    { label: 'Allot', value: 'Allot' },
    { label: 'Section', value: 'Section' },
  ];
  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  // view model
  const [openview, setOpenview] = useState(false);
  const handleClickOpenview = () => {
    setOpenview(true);
  };
  const handleCloseview = () => {
    setOpenview(false);
  };

  // info model
  const [openInfo, setOpeninfo] = useState(false);
  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };
  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  //Delete model
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
  };

  //Delete model
  const [isDeleteBulkNotLinkedOpen, setisDeleteBulkNotLinkedOpen] = useState({ open: false, data: [] });
  const handleClickBulkNotLinkedOpen = (data) => {
    setisDeleteBulkNotLinkedOpen({ open: true, data: data });
  };
  const handleCloseBulkNotLinkedClose = () => {
    setisDeleteBulkNotLinkedOpen({ open: false, data: [] });
  };

  // Error Popup model
  const [isUnitApprovalOpen, setIsUnitApprovalOpen] = useState(false);

  const handleClickUnitApprovalOpenerr = () => {
    setIsUnitApprovalOpen(true);
  };
  const handleCloseUnitApprovalerr = () => {
    setIsUnitApprovalOpen(false);
  };

  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
  const handleClickOpenalert = async () => {
    if (selectedRows.length === 0) {
      setIsDeleteOpenalert(true);
    } else {
      let res = await axios.post(SERVICE.SUBCATEGORY_OVERALL_CHECK_BULKDELETE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        projectcategory: selectedRowsCate,
      });
      if (res.data.count === 0) {
        setIsDeleteOpencheckbox(true);
      } else {
        let unitratelinks = [...new Set(res.data.unitrate.map((item) => item.subcategory))];

        // Create a helper function to generate a unique key based on the fields
        const createKey = (item) => `${item.project}-${item.category}-${item.subcategory}`;

        // Use a Set to filter out duplicates based on the key
        let allcategoriesLinked = Array.from(new Map(res.data.unitrate.map((item) => [createKey(item), item])).values());

        // Combine both arrays into one (you can keep them separate later if needed)
        let combinedArrayNon = [...allcategoriesLinked, ...selectedRowsCate];

        // Create a Map to track occurrences
        let keyCount = combinedArrayNon.reduce((acc, item) => {
          const key = createKey(item);
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {});

        // Find non-duplicates by filtering out keys that appear more than once
        const nonDupeSelectedCategories = combinedArrayNon.filter((item) => keyCount[createKey(item)] === 1);
        console.log(nonDupeSelectedCategories, 'nonDupeSelectedCategories');

        const unitrates = unitratelinks.length === 1 ? `This ${unitratelinks.join(', ')} Subcategory linked in Unitrate` : `These ${unitratelinks.join(', ')} SubCategories linked in Unitrate`;

        if (nonDupeSelectedCategories.length > 0) {
          setShowAlert(`${unitrates},  Do you want Delete Others ?`);
          handleClickBulkNotLinkedOpen(nonDupeSelectedCategories);
        } else {
          setPopupContentMalert(unitrates);
          setPopupSeverityMalert('warning');
          handleClickOpenPopupMalert();
        }
      }
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

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, 'Production Subcategory.png');
        });
      });
    }
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
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
    project: true,
    categoryname: true,
    name: true,
    mode: true,
    actions: true,
    mismatchmode: true,
    enablepage: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

  const handleProjectChange = (e) => {
    const selectedProject = e.value;
    setSelectedProject(selectedProject);
    setSelectedCategory('Please Select Category');
  };

  const handleMisMatchChange = (options) => {
    setMismatchMode(options);
  };

  const customValueRendererMode = (valueMode, _categoryname) => {
    return valueMode?.length ? valueMode.map(({ label }) => label)?.join(', ') : 'Please Select Mode';
  };

  const handleMisMatchChangeEdit = (options) => {
    setMismatchModeEdit(options);
  };

  const customValueRendererModeEdit = (valueMode, _categoryname) => {
    return valueMode?.length ? valueMode.map(({ label }) => label)?.join(', ') : 'Please Select Mode';
  };

  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ''; // This is required for Chrome support
  };

  //set function to get particular row
  const [deletemodule, setDeletemodule] = useState({});

  const rowData = async (id, name, project, category) => {
    let res = await axios.post(SERVICE.SUBCATEGORY_OVERALL_CHECK_DELETE, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      category: category,
      subcategory: name,
      project: project,
    });

    if (res.data.count === 0) {
      setPageName(!pageName);
      try {
        let res = await axios.get(`${SERVICE.SUBCATEGORYPROD_SINGLE}/${id}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
        setDeletemodule(res?.data?.ssubcategoryprod);

        handleClickOpen();
      } catch (err) {
        handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
      }
    } else {
      setPopupContentMalert(`This ${name} Category linked in Unitrate`);
      setPopupSeverityMalert('warning');
      handleClickOpenPopupMalert();
    }
  };

  //fetching Project for Dropdowns
  const fetchProjectDropdowns = async () => {
    setPageName(!pageName);
    try {
      let res_project = await axios.get(SERVICE.PROJECTMASTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const projall = [
        ...res_project?.data?.projmaster.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];
      setProjects(projall);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const fetchCategoryDropdowns = async () => {
    setPageName(!pageName);
    try {
      let res_project = await axios.get(SERVICE.CATEGORYPROD_LIMITED, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setCategories(res_project?.data?.categoryprod);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // Alert delete popup
  let susbcategoriesexcelid = deletemodule._id;
  const delModule = async () => {
    setPageName(!pageName);
    try {
      await axios.delete(`${SERVICE.SUBCATEGORYPROD_SINGLE}/${susbcategoriesexcelid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await fetchAllSubCategory();
      setPage(1);
      setSelectedRows([]);
      setSelectedRowsCate([]);
      handleCloseMod();
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
        return axios.delete(`${SERVICE.SUBCATEGORYPROD_SINGLE}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });
      // Wait for all delete requests to complete
      await Promise.all(deletePromises);
      await fetchAllSubCategory();
      handleCloseModcheckbox();
      setSelectedRows([]);
      setSelectedRowsCate([]);
      setSelectAllChecked(false);
      setPage(1);
      setPopupContent('Deleted Successfully');
      setPopupSeverity('success');
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //add function...
  const sendRequest = async (unitrate) => {
    const mismatchdata = mismatchMode.map((item) => item.value);
    setPageName(!pageName);
    try {
      if (unitrate === 0) {
        let flagstatusval = categories.find((d) => d.project === selectedProject && d.name === selectedCategory);

        let modulesUnit = await axios.post(SERVICE.PRODUCTION_UNITRATE_CREATE, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          project: String(selectedProject),
          category: String(selectedCategory),
          subcategory: String(subcategory.name),
          mrate: String(0),
          orate: String(0),
          trate: String(0),
          flagcount: String(1),

          flagstatus: flagstatusval ? flagstatusval.flagstatus : 'No',
          conversion: String(8.333333333333333),
          points: String(0),
          addedby: [
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
              fileName: String(''),
            },
          ],
        });
      }
      let modules = await axios.post(SERVICE.SUBCATEGORYPROD_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        project: String(selectedProject),
        categoryname: String(selectedCategory),
        name: String(subcategory.name),
        mode: String(subcategory.mode),
        enablepage: String(subcategory.enablepage),
        mismatchmode: mismatchdata,
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      handleCloseUnitApprovalerr();
      setUnitrateApproval('');
      await fetchAllSubCategory();
      setSubcategory({ ...subcategory, name: '', mode: 'Allot', enablepage: false });
      setPopupContent('Added Successfully');
      setPopupSeverity('success');
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const [defaultMrates, setDefaultMrates] = useState([]);

  const fetchDefaultMrate = async (value) => {
    setSelectedCategory(value)
    try {
      let resSub = await axios.post(SERVICE.GET_DEFAULT_MRATE_CATEGORY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        project:selectedProject,
        category: String(value),
      });
      setDefaultMrates(resSub.data.categoryprod.mrateprimary)
    }catch(err){
      console.log(err,'err')
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  }
const [loadingSubmit, setLoadingSubmit] = useState(false)
  //submit option for saving
  const handleSubmit = async (e) => {
    setLoadingSubmit(true)
    setPageName(!pageName);
 
    try {
      let resSub = await axios.post(SERVICE.CHECKSUBCATEGORY_MANUAL_CREATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        project: String(selectedProject),
        category: String(selectedCategory),
        subcategory: String(subcategory.name),
      });
      const isNameMatch = resSub?.data?.subcategoryprod;
      if (selectedProject === '' || selectedProject == 'Please Select Project') {
        setPopupContentMalert('Please Select Project');
        setPopupSeverityMalert('info');
        handleClickOpenPopupMalert();
        setLoadingSubmit(false)
      } else if (selectedCategory === '' || selectedCategory == 'Please Select Category') {
        setPopupContentMalert('Please Select Category');
        setPopupSeverityMalert('info');
        handleClickOpenPopupMalert();
        setLoadingSubmit(false)
      } else if (subcategory.name === '') {
        setPopupContentMalert('Please Enter Subcategory Name');
        setPopupSeverityMalert('info');
        handleClickOpenPopupMalert();
        setLoadingSubmit(false)
      } else if (mismatchMode.length === 0) {
        setPopupContentMalert('Please Select Mismatch Mode');
        setPopupSeverityMalert('info');
        handleClickOpenPopupMalert();
        setLoadingSubmit(false)
      } else if (isNameMatch > 0) {
        setPopupContentMalert('Data already exist!');
        setPopupSeverityMalert('info');
        handleClickOpenPopupMalert();
        setLoadingSubmit(false)
      } else {
       
        // const getMrateValue = (name) => {
        //   const lowerName = name.toLowerCase(); // Case-insensitive comparison
        //   const rate = defaultMrates || {mrateprimary:[]}; // Ensure rate is an object
        
        //   // Safely access arrays to prevent errors
        //   const primaryRates = rate.mrateprimary || [];
        //   const primaryRatesContains = rate.mrateprimary.filter(d => d.matchcase == "Contains") || [];
        
        //   // Check mrateprimary
        //   let findValue = primaryRates.find((d) => d.matchcase === "Contains" ?  lowerName.includes(d.keyword.toLowerCase()) : lowerName === (d.keyword.toLowerCase())  );
        //   if (findValue) return findValue.mrate;        
        
        //   // Fallback: Return the first available mrate from any list
        //   return (
        //     primaryRatesContains[0]?.mrate ||
        //     0
        //   );
        // };
        
        
        
        // setUnitrateApproval((Number(getMrateValue(subcategory.name))*8.333333333333333).toFixed(4))
        // const getMrateValue = (name) => {

        //   const lowerName = name.toLowerCase(); // Case-insensitive comparison
        //   const rate = defaultMrates || [] ; // Ensure rate is an object
        
        //   // Safely access arrays to prevent errors
        //   const primaryRates = rate || [];
        //   const primaryRatesContains = primaryRates.filter(d => d.matchcase === "Contains") || [];
        
        //   // Check mrateprimary
        //   let findValue = primaryRates.find((d) =>
        //     d.matchcase === "Contains" ? lowerName.includes(d.keyword.toLowerCase()) : lowerName === d.keyword.toLowerCase()
        //   );
        //   if (findValue) return findValue.mrate;
        
        //   // Fallback: Return the first available mrate from any list
        //   return primaryRatesContains[0]?.mrate || 0;
        // };
        
        // // Only set the value if getMrateValue does not return an empty string
        // const mrateValue =defaultMrates.length > 0 ? Number(Number(getMrateValue(subcategory.name)) * 8.333333333333333).toFixed(4) : "";
          
      const getMrateValue = (name) => {

        const lowerName = name.toLowerCase(); // Case-insensitive comparison
        const rate = defaultMrates || [] ; // Ensure rate is an object
      
        // Safely access arrays to prevent errors
        const primaryRates = rate.filter(d => d.matchcase !== "Default") || [];
        const primaryRatesDefault = rate.filter(d => d.matchcase === "Default") || [];
      
        // Check mrateprimary
        let findValue = primaryRates.find((d) =>
          d.matchcase === "Contains" ? lowerName.includes(d.keyword.toLowerCase()) : lowerName === d.keyword.toLowerCase()
        );console.log(findValue,'findValue')
        if (findValue) return findValue.mrate;
        
        // Fallback: Return the first available mrate from any list
        return primaryRatesDefault[0]?.mrate || 0;
      };
      
        const mrateValue =defaultMrates.length > 0 ? Number(Number(getMrateValue(subcategory.name))  * 8.333333333333333 ).toFixed(4): "";
      
        setUnitrateApproval(mrateValue);
        
        handleClickUnitApprovalOpenerr();
        setLoadingSubmit(false)
      }
    } catch (err) {
      setLoadingSubmit(false)
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const handleclear = (e) => {
    e.preventDefault();
    setSelectedProject('Please Select Project');
    setSelectedCategory('Please Select Category');
    setSubcategory('Please Select Subcategory');
    setSelectedVendors([]);
    setSubcategory({ name: '', mode: 'Allot' });
    setMismatchMode([]);
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
  };

  //id for login...
  let loginid = localStorage.LoginUserId;
  let authToken = localStorage.APIToken;
  const [oldname, setOldname] = useState('');
  const [oldproject, setOldProject] = useState('');
  const [oldcate, setOldCate] = useState('');
  //get single row to edit....
  const getCode = async (e, name, project, category) => {
    setPageName(!pageName);
    setOldname(name);
    setOldProject(project);
    setOldCate(category);
    try {
      setRowGetid(e);
      let res = await axios.get(`${SERVICE.SUBCATEGORYPROD_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSubcategoryid({ ...res?.data?.ssubcategoryprod, enablepage: res?.data?.ssubcategoryprod.enablepage ? res?.data?.ssubcategoryprod.enablepage : false });
      setRowGetid(res?.data?.ssubcategoryprod);
      setSelectedProjectedit(res?.data?.ssubcategoryprod.project);
      setSelectedCategoryedit(res?.data?.ssubcategoryprod.categoryname);
      setMismatchModeEdit(
        res?.data?.ssubcategoryprod.mismatchmode.map((item) => ({
          ...item,
          label: item,
          value: item,
        }))
      );
      handleClickOpenEdit();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // get single row to view....
  const getviewCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SUBCATEGORYPROD_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSubcategoryid(res?.data?.ssubcategoryprod);
      handleClickOpenview();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SUBCATEGORYPROD_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSubcategoryid(res?.data?.ssubcategoryprod);
      handleClickOpeninfo();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //subcategory updateby edit page...
  let updateby = subcategoryid?.updatedby;
  let addedby = subcategoryid?.addedby;
  let categoriesid = subcategoryid?._id;

  //BULK EDIT model
  const [isEditBulkOpen, setIsEditBulkOpen] = useState({ open: false, data: [] });
  const handleClickBulkEditOpen = (data) => {
    setIsEditBulkOpen({ open: true, data: data });
  };
  const handleCloseBulkEditMod = () => {
    setIsEditBulkOpen({ open: false, data: [] });
  };

  //editing the single data...
  const sendEditRequest = async () => {
    let checkOverallDel = await axios.post(SERVICE.SUBCATEGORYPROD_OVERALL_EDIT, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      project: oldproject,
      category: oldcate,
      subcategory: oldname,
    });

    setPageName(!pageName);
    if (checkOverallDel.data.count === 0 || oldname === subcategoryid.name) {
      setPageName(!pageName);
      try {
        let res = await axios.put(`${SERVICE.SUBCATEGORYPROD_SINGLE}/${categoriesid}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          project: selectedProjectedit,
          categoryname: selectedCategoryedit,
          name: String(subcategoryid.name),
          mode: String(subcategoryid.mode),
          enablepage: String(subcategoryid.enablepage),
          mismatchmode: mismatchModeEdit.map((item) => item.value),
          updatedby: [
            ...updateby,
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        });

        await fetchAllSubCategory();
        handleCloseModEdit();
        setPopupContent('Updated Successfully');
        setPopupSeverity('success');
        handleClickOpenPopup();
      } catch (err) {
        console.log(err);
        handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
      }
    } else {
      handleClickBulkEditOpen(checkOverallDel.data);
    }
  };

  const editSubmit = async (e) => {
    setPageName(!pageName);
    try {
      let resSub = await axios.post(SERVICE.CHECKSUBCATEGORY_MANUAL_CREATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        project: String(selectedProjectedit),
        category: String(selectedCategoryedit),
        subcategory: String(subcategoryid.name),
        id: subcategoryid._id,
      });
      const isNameMatch = resSub?.data?.subcategoryprod;
      if (selectedProjectedit === '' || selectedProjectedit === 'Please Select Project') {
        setPopupContentMalert('Please Select Project');
        setPopupSeverityMalert('info');
        handleClickOpenPopupMalert();
      } else if (selectedCategoryedit === '' || selectedCategoryedit == 'Please Select Category') {
        setPopupContentMalert('Please Select Category');
        setPopupSeverityMalert('info');
        handleClickOpenPopupMalert();
      } else if (subcategoryid.name === '') {
        setPopupContentMalert('Please Enter subcategory Name');
        setPopupSeverityMalert('info');
        handleClickOpenPopupMalert();
      } else if (mismatchModeEdit.length === 0) {
        setPopupContentMalert('Please Select Mismatch Mode');
        setPopupSeverityMalert('info');
        handleClickOpenPopupMalert();
      } else if (isNameMatch > 0) {
        setPopupContentMalert('Data Already exists!');
        setPopupSeverityMalert('info');
        handleClickOpenPopupMalert();
      } else {
        // let res = await axios.post(SERVICE.CHECKUNITRATE_MANUAL_CREATION, {
        //   headers: {
        //     Authorization: `Bearer ${auth.APIToken}`,
        //   },
        //   project: String(selectedProjectedit),
        //   category: String(selectedCategoryedit),
        //   subcategory: String(subcategoryid.name),
        // });
        // let unitrates = res?.data?.unitsrate;
        // // console.log(res.statusText, 'res.statusText')
        // if (res.statusText === "OK") {
        sendEditRequest();
        // } else {
        //   setPopupContentMalert("Something Went Wrong!");
        //   setPopupSeverityMalert("info");
        //   handleClickOpenPopupMalert();
        // }
      }
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const bulkNotLinkedUpdate = async (data) => {
    try {
      console.log(data, 'data');

      let checkOverallDel = await axios.post(SERVICE.SUBCATEGORY_OVERALL_NONLINK_BULKDELETE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        nonLinkedCategories: data,
      });
      handleCloseBulkNotLinkedClose();
      setSelectedRows([]);
      setSelectedRowsCate([]);
      setPopupContent('Deleted Successfully');
      setPopupSeverity('success');
      handleClickOpenPopup();
      await fetchAllSubCategory();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const [unitrateApproval, setUnitrateApproval] = useState('');
  const handleUnitApprovalUpdate = async (points) => {
    try {
      let resCreate = await axios.post(SERVICE.UNITRATE_MANUAL_APPROVAL_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        project: String(selectedProject),
        category: String(selectedCategory),
        subcategory: String(subcategory.name),
        mrate: (Number(points) / 8.333333333333333).toFixed(4),
        points: points,
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
            fileName: String(''),
          },
        ],
      });

      let res = await axios.post(SERVICE.CHECKUNITRATE_MANUAL_CREATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        project: String(selectedProject),
        category: String(selectedCategory),
        subcategory: String(subcategory.name),
      });
      let unitrates = res?.data?.unitsrate;
      if (res.statusText === 'OK') {
        sendRequest(unitrates);
      } else {
        setPopupContentMalert('Something Went Wrong!');
        setPopupSeverityMalert('info');
        handleClickOpenPopupMalert();
      }
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const hanleBulkOverallEditUpdate = async (data) => {
    // console.log(data);
    try {
      let checkOverallDel = await axios.post(SERVICE.SUBCATEGORYPROD_OVERALL_EDIT_BULKUPDATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        project: oldproject,
        category: oldcate,
        subcategory: oldname,
        updatedsubcategory: subcategoryid.name,
        unitratecount: data.unitratecount,
        // count:
      });
      // let rescheck = await axios.post(SERVICE.CHECKUNITRATE_MANUAL_CREATION, {
      //   headers: {
      //     Authorization: `Bearer ${auth.APIToken}`,
      //   },
      //   project: String(selectedProjectedit),
      //   category: String(selectedCategoryedit),
      //   subcategory: String(subcategoryid.name),
      // });
      // let unitrates = rescheck?.data?.unitsrate;
      // if (unitrates === 0) {
      //   let flagstatusval = categories.find((d) => d.project === selectedProject && d.name === selectedCategory);

      //   let modulesUnit = await axios.post(SERVICE.PRODUCTION_UNITRATE_CREATE, {
      //     headers: {
      //       Authorization: `Bearer ${auth.APIToken}`,
      //     },
      //     project: String(selectedProjectedit),
      //     category: String(selectedCategoryedit),
      //     subcategory: String(subcategoryid.name),
      //     mrate: String(0),
      //     orate: String(0),
      //     flagcount: String(1),
      //     flagstatus: flagstatusval ? flagstatusval.flagstatus : "No",
      //     conversion: String(8.333333333333333),
      //     points: String(0),
      //     addedby: [
      //       {
      //         name: String(isUserRoleAccess.companyname),
      //         date: String(new Date()),
      //         fileName: String(""),
      //       },
      //     ],
      //   });
      // }

      let res = await axios.put(`${SERVICE.SUBCATEGORYPROD_SINGLE}/${categoriesid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        project: selectedProjectedit,
        categoryname: selectedCategoryedit,
        name: String(subcategoryid.name),
        mode: String(subcategoryid.mode),
        enablepage: String(subcategoryid.enablepage),
        mismatchmode: mismatchModeEdit.map((item) => item.value),
        updatedby: [
          ...updateby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await fetchAllSubCategory();

      setPopupContent('Updated Successfully');
      setPopupSeverity('success');
      handleClickOpenPopup();
      handleCloseModEdit();
      handleCloseBulkEditMod();
    } catch (err) {
      console.log(err, 'err');
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  const [subcategoriesCount, setSubcategoriesCount] = useState(0);

  //get all category.
  const fetchAllSubCategory = async () => {
    setPageName(!pageName);
    try {
      let res_module = await axios.post(SERVICE.SUBCATEGORYPROD_LIST_LIMITED_PAGINATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        page: page,
        pageSize: pageSize,
        searchterm: searchQuery,
      });

      let uniquesubRates = res_module?.data.subcategoryprod.sort((a, b) => {
        // Names are the same, sort by category alphabetically
        if (a.categoryname < b.categoryname) return -1;
        if (a.categoryname > b.categoryname) return 1;
        // Categories are the same, sort by priority alphabetically
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });
      let subcates = uniquesubRates.map((d, index) => ({
        ...d,
        serialNumber: (page - 1) * pageSize + index + 1,
      }));
      let subcatescount = res_module?.data?.totalCount;
      setSubcategoriesCount(subcatescount);
      setTotalPages(Math.ceil(subcatescount / pageSize));
      const firstVisiblePage = Math.max(1, page - 1);
      const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, Math.ceil(subcatescount / pageSize));
      const newPageNumbers = [];
      for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        newPageNumbers.push(i);
      }
      setPageNumbers(newPageNumbers);
      let uniqueArrayfinal = subcates;
      setSubcategories(subcates);
      setmodulecheck(true);
    } catch (err) {
      setmodulecheck(true);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    fetchAllSubCategory();
    fetchSubCategoryexcelAll();
  }, [page, searchQuery, pageSize]); //

  // get all modules.
  const fetchSubCategoryexcelAll = async () => {
    setPageName(!pageName);
    try {
      let res_module = await axios.get(SERVICE.SUBCATEGORYPROD, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAllModuleedit(res_module?.data?.subcategoryprod);
    } catch (err) {
      setmodulecheck(true);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Production Subcategory',
    pageStyle: 'print',
  });

  const [items, setItems] = useState([]);

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String('Production Subcategory'),
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
    fetchAllSubCategory();
    fetchProjectDropdowns();
    getapi();
  }, []);

  useEffect(() => {
    fetchCategoryDropdowns();
  }, [isEditOpen]);

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener('beforeunload', beforeUnloadHandler);
    return () => {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
    };
  }, []);

  const addSerialNumber = (datas) => {
    // ?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
    setItems(datas);
  };

  useEffect(() => {
    addSerialNumber(subcategories);
  }, [subcategories]);

  //Datatable
  const handlePageChange = (newPage) => {
    setPage(newPage);
    setSelectedRows([]);
    setSelectedRowsCate([]);
    setSelectAllChecked(false);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setSelectedRows([]);
    setSelectedRowsCate([]);
    setSelectAllChecked(false);
    setPage(1);
  };

  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
    <div>
      <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
    </div>
  );

  const columnDataTable = [
    {
      field: 'checkbox',
      headerName: 'Checkbox', // Default header name
      headerStyle: {
        fontWeight: 'bold', // Apply the font-weight style to make the header text bold
        // Add any other CSS styles as needed
      },
      renderHeader: (params) => (
        <CheckboxHeader
          selectAllChecked={selectAllChecked}
          onSelectAll={() => {
            if (rowDataTable.length === 0) {
              // Do not allow checking when there are no rows
              return;
            }

            if (selectAllChecked) {
              setSelectedRows([]);
              setSelectedRowsCate([]);
            } else {
              const allRowIds = rowDataTable.map((row) => row.id);
              setSelectedRows(allRowIds);
              const allRowIdsCate = rowDataTable.map((row) => ({ subcategory: row.name, category: row.categoryname, project: row.project }));
              setSelectedRowsCate(allRowIdsCate);
            }
            setSelectAllChecked(!selectAllChecked);
          }}
        />
      ),

      renderCell: (params) => (
        <Checkbox
          checked={selectedRows.includes(params.row.id)}
          onChange={() => {
            let updatedSelectedRows;
            let updatedSelectedRowsCate;
            if (selectedRows.includes(params.row.id)) {
              updatedSelectedRows = selectedRows.filter((selectedId) => selectedId !== params.row.id);
              updatedSelectedRowsCate = selectedRowsCate.filter((selectedId) => selectedId.category !== params.row.categoryname && selectedId.subcategory !== params.row.name && selectedId.project !== params.row.project);
            } else {
              updatedSelectedRows = [...selectedRows, params.row.id];
              updatedSelectedRowsCate = [...selectedRowsCate, { category: params.row.categoryname, subcategory: params.row.name, project: params.row.project }];
            }

            setSelectedRows(updatedSelectedRows);
            setSelectedRowsCate(updatedSelectedRowsCate);

            // Update the "Select All" checkbox based on whether all rows are selected
            setSelectAllChecked(updatedSelectedRows.length === items.length);
          }}
        />
      ),
      sortable: false, // Optionally, you can make this column not sortable
      width: 60,

      hide: !columnVisibility.checkbox,
      headerClassName: 'bold-header',
    },
    {
      field: 'serialNumber',
      headerName: 'SNo',
      flex: 0,
      width: 60,
      hide: !columnVisibility.serialNumber,
      headerClassName: 'bold-header',
    },
    { field: 'project', headerName: 'Project Name', flex: 0, width: 120, hide: !columnVisibility.project, headerClassName: 'bold-header' },
    { field: 'categoryname', headerName: 'Category', flex: 0, width: 350, hide: !columnVisibility.categoryname, headerClassName: 'bold-header' },
    { field: 'name', headerName: 'Sub Category', flex: 0, width: 450, hide: !columnVisibility.name, headerClassName: 'bold-header' },
    { field: 'mode', headerName: 'Mode', flex: 0, width: 70, hide: !columnVisibility.mode, headerClassName: 'bold-header' },
    { field: 'enablepage', headerName: 'Enable Page', flex: 0, width: 100, hide: !columnVisibility.enablepage, headerClassName: 'bold-header' },

    { field: 'mismatchmode', headerName: 'Mismatch Mode', flex: 0, width: 220, hide: !columnVisibility.mismatchmode, headerClassName: 'bold-header' },

    {
      field: 'actions',
      headerName: 'Action',
      flex: 0,
      width: 230,
      minHeight: '40px !important',
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: 'bold-header',
      renderCell: (params) => (
        <Grid sx={{ display: 'flex' }}>
          {isUserRoleCompare?.includes('eproductionsubcategory') && (
            <Button
              sx={{ minWidth: '50px', padding: '6px 8px' }}
              onClick={() => {
                getCode(params.row.id, params.row.name, params.row.project, params.row.categoryname);
              }}
            >
              <EditOutlinedIcon sx={buttonStyles.buttonedit} />{' '}
            </Button>
          )}
          {isUserRoleCompare?.includes('dproductionsubcategory') && (
            <Button
              sx={{ minWidth: '50px', padding: '6px 8px' }}
              onClick={(e) => {
                rowData(params.row.id, params.row.name, params.row.project, params.row.categoryname);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />{' '}
            </Button>
          )}
          {isUserRoleCompare?.includes('vproductionsubcategory') && (
            <Button
              sx={{ minWidth: '50px', padding: '6px 8px' }}
              onClick={() => {
                getviewCode(params.row.id);
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />{' '}
            </Button>
          )}
          {isUserRoleCompare?.includes('iproductionsubcategory') && (
            <Button
              sx={{ minWidth: '50px', padding: '6px 8px' }}
              onClick={() => {
                getinfoCode(params.row.id);
              }}
            >
              <InfoOutlinedIcon sx={buttonStyles.buttoninfo} />{' '}
            </Button>
          )}
        </Grid>
      ),
    },
  ];

  const rowDataTable = items.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      project: item.project,
      categoryname: item.categoryname,
      name: item.name,
      mode: item.mode,
      mismatchmode: item.mismatchmode?.toString(),
      enablepage: item.enablepage === true ? 'Yes' : 'No',
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

  return (
    <Box>
      <Headtitle title={'SUBCATEGORY'} />
      {/* ****** Header Content ****** */}
      <PageHeading title="Production Subcategory " modulename="Production" submodulename="SetUp" mainpagename="Production Sub Category" subpagename="" subsubpagename="" />
      {isUserRoleCompare?.includes('aproductionsubcategory') && (
        <Box sx={userStyle.dialogbox}>
          <>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography sx={userStyle.importheadtext}>Add Production Subcategory</Typography>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={2}>
              <Grid item md={4} xs={12} sm={12}>
                <Typography>
                  Project <b style={{ color: 'red' }}>*</b>
                </Typography>
                <FormControl size="small" fullWidth>
                  <Selects options={projects} value={{ label: selectedProject, value: selectedProject }} onChange={handleProjectChange} />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <Typography>
                  Category <b style={{ color: 'red' }}>*</b>
                </Typography>
                <FormControl size="small" fullWidth>
                  <Selects
                    options={[...new Set(categories.filter((d) => d.project === selectedProject).map((d) => d.name))].map((name) => ({
                      label: name,
                      value: name,
                    }))}
                    value={{ label: selectedCategory, value: selectedCategory }}
                    onChange={(e) => { fetchDefaultMrate(e.value); }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Name <b style={{ color: 'red' }}>*</b>
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    value={subcategory.name}
                    placeholder="Please Enter Subcategory name"
                    onChange={(e) => {
                      setSubcategory({ ...subcategory, name: e.target.value });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <Typography>
                  Mode <b style={{ color: 'red' }}>*</b>
                </Typography>
                <FormControl size="small" fullWidth>
                  <Selects
                    options={modes}
                    value={{ label: subcategory.mode, value: subcategory.mode }}
                    onChange={(e) => {
                      setSubcategory({ ...subcategory, mode: e.value });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item lg={4} md={4} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Mismatch Mode <b style={{ color: 'red' }}>*</b>
                  </Typography>
                  <MultiSelect
                    options={mismatchModes}
                    value={mismatchMode}
                    onChange={(e) => {
                      handleMisMatchChange(e);
                    }}
                    valueRenderer={customValueRendererMode}
                    labelledBy="Please Select Mode"
                  />
                </FormControl>
              </Grid>
              <Grid item lg={2} md={2} xs={12} sm={6} marginTop={3}>
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox checked={subcategory.enablepage} />}
                    onChange={(e) =>
                      setSubcategory({
                        ...subcategory,
                        enablepage: !subcategory.enablepage,
                      })
                    }
                    label="Enable Pages"
                  />
                </FormGroup>
              </Grid>
              <Grid item lg={2} md={4} xs={12} sm={6}>
                <Typography>&nbsp;</Typography>
                <LoadingButton sx={buttonStyles.buttonsubmit} loading={loadingSubmit} onClick={handleSubmit}>
                  SUBMIT
                </LoadingButton>
                &nbsp; &nbsp;
                <Button sx={buttonStyles.btncancel} onClick={handleclear}>
                  Clear
                </Button>
              </Grid>
            </Grid>
          </>
        </Box>
      )}
      <Box>
        {/* edit model */}
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
          <Box sx={{ padding: '20px 25px' }}>
            <>
              <Grid container spacing={2}>
                <Grid item md={12} xs={12} sm={12}>
                  <Typography sx={userStyle.HeaderText}>Edit Production Subcategory</Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={6} xs={12} sm={6}>
                  <Typography>
                    Project <b style={{ color: 'red' }}>*</b>
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Selects
                      options={projects}
                      value={{ label: selectedProjectedit, value: selectedProjectedit }}
                      onChange={(e) => {
                        setSelectedProjectedit(e.value);
                        setSelectedCategoryedit('Please Select Category');
                      }}
                    />
                  </FormControl>
                </Grid>
                {/* } */}
                <Grid item md={6} xs={12} sm={6}>
                  <Typography>
                    category <b style={{ color: 'red' }}>*</b>
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <Selects
                      options={[...new Set(categories.filter((d) => d.project === selectedProjectedit).map((d) => d.name))].map((name) => ({
                        label: name,
                        value: name,
                      }))}
                      value={{ label: selectedCategoryedit, value: selectedCategoryedit }}
                      onChange={(e) => setSelectedCategoryedit(e.value)}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Name <b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Subcategory Name"
                      value={subcategoryid.name}
                      onChange={(e) => {
                        setSubcategoryid({ ...subcategoryid, name: e.target.value });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={6}>
                  <Typography>
                    Mode <b style={{ color: 'red' }}>*</b>
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <Selects
                      options={modes}
                      value={{ label: subcategoryid.mode, value: subcategoryid.mode }}
                      onChange={(e) => {
                        setSubcategoryid({ ...subcategoryid, mode: e.value });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Mismatch Mode <b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={mismatchModes}
                      value={mismatchModeEdit}
                      onChange={(e) => {
                        handleMisMatchChangeEdit(e);
                      }}
                      valueRenderer={customValueRendererModeEdit}
                      labelledBy="Please Select Project"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={6} marginTop={3}>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox checked={subcategoryid.enablepage} />}
                      onChange={(e) =>
                        setSubcategoryid({
                          ...subcategoryid,
                          enablepage: !subcategoryid.enablepage,
                        })
                      }
                      label="Enable Pages"
                    />
                  </FormGroup>
                </Grid>
              </Grid>
              <br /> <br />
              <Box sx={{ display: 'flex', justifyContent: 'end', gap: '10px' }}>
                <Button sx={buttonStyles.buttonsubmit} onClick={editSubmit}>
                  {' '}
                  Update
                </Button>
                <Button sx={buttonStyles.btncancel} onClick={handleCloseModEdit}>
                  {' '}
                  Cancel{' '}
                </Button>
              </Box>
            </>
          </Box>
        </Dialog>
      </Box>
      <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes('lproductionsubcategory') && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}> Production Subcategory List</Typography>
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
                    <MenuItem value={subcategoriesCount}>All</MenuItem>
                  </Select>
                </Box>
              </Grid>
              <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Box>
                  {isUserRoleCompare?.includes('excelproductionsubcategory') && (
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
                  {isUserRoleCompare?.includes('csvproductionsubcategory') && (
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
                  {isUserRoleCompare?.includes('printproductionsubcategory') && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes('pdfproductionsubcategory') && (
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
                  {isUserRoleCompare?.includes('imageproductionsubcategory') && (
                    <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                      {' '}
                      <ImageIcon sx={{ fontSize: '15px' }} /> &ensp;Image&ensp;{' '}
                    </Button>
                  )}
                </Box>
              </Grid>
              <Grid item md={2} xs={12} sm={12}>
                <Box>
                  <FormControl fullWidth size="small">
                    <Typography>Search</Typography>
                    <OutlinedInput id="component-outlined" type="text" value={searchQuery} onChange={handleSearchChange} />
                  </FormControl>
                </Box>
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
            {isUserRoleCompare?.includes('bdproductionsubcategory') && (
              <Button sx={buttonStyles.buttonbulkdelete} onClick={handleClickOpenalert}>
                Bulk Delete
              </Button>
            )}
            <br />
            <br />
            {!modulecheck ? (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                </Box>
              </>
            ) : (
              <>
                <br />
                <Box
                  style={{
                    width: '100%',
                    overflowY: 'hidden', // Hide the y-axis scrollbar
                  }}
                >
                  <StyledDataGrid
                    onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
                    rows={rowsWithCheckboxes}
                    columns={columnDataTable.filter((column) => columnVisibility[column.field])}
                    onSelectionModelChange={handleSelectionChange}
                    selectionModel={selectedRows}
                    autoHeight={true}
                    ref={gridRef}
                    density="compact"
                    hideFooter
                    getRowClassName={getRowClassName}
                    disableRowSelectionOnClick
                  />
                </Box>
                <Box style={userStyle.dataTablestyle}>
                  <Box>
                    Showing {items.length > 0 ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, subcategoriesCount)} of {subcategoriesCount} entries
                  </Box>
                  <Box>
                    <Button onClick={() => setPage(1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                      <FirstPageIcon />
                    </Button>
                    <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                      <NavigateBeforeIcon />
                    </Button>
                    {pageNumbers.map((pageNumber) => (
                      <Button key={pageNumber} onClick={() => handlePageChange(pageNumber)} className={page === pageNumber ? 'active' : ''} disabled={page === pageNumber} sx={userStyle.paginationbtn}>
                        {pageNumber}
                      </Button>
                    ))}
                    <Button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                      <NavigateNextIcon />
                    </Button>
                    <Button onClick={() => setPage(totalPages)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                      <LastPageIcon />
                    </Button>
                  </Box>
                </Box>
                {/* ****** Table End ****** */}
              </>
            )}
          </Box>
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
      <Dialog open={openview} onClose={handleCloseview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <Box sx={{ width: '550px', padding: '20px 50px' }}>
          <>
            <Typography sx={userStyle.HeaderText}> View Production Subcategory</Typography>
            <br />
            <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">project</Typography>
                  <Typography>{subcategoryid.project}</Typography>
                </FormControl>
              </Grid>
              <br />
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Category</Typography>
                  <Typography>{subcategoryid.categoryname}</Typography>
                </FormControl>
              </Grid>
              <br />
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Name</Typography>
                  <Typography>{subcategoryid.name}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Mode</Typography>
                  <Typography>{subcategoryid.mode}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Mismatch Mode</Typography>
                  <Typography sx={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>{subcategoryid.mismatchmode?.toString()}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Mode</Typography>
                  <Typography>{subcategoryid.enablepage === true ? 'Yes' : 'No'}</Typography>
                </FormControl>
              </Grid>
              <br />
            </Grid>
            <br /> <br />
            <br />
            <Grid container spacing={2}>
              <Button sx={buttonStyles.btncancel} onClick={handleCloseview}>
                {' '}
                Back{' '}
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>

      <Dialog open={isEditBulkOpen.open} onClose={handleCloseBulkEditMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: '70px', color: 'orange' }} />
          <Typography variant="body2">{`This ${oldname} Subcategory linked in Unitrate`}</Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={() => hanleBulkOverallEditUpdate(isEditBulkOpen.data)}>
            OK
          </Button>
          <Button variant="contained" sx={buttonStyles.btncancel} color="error" onClick={handleCloseBulkEditMod}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isDeleteBulkNotLinkedOpen.open} onClose={handleCloseBulkNotLinkedClose} maxWidth="sm" aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ textAlign: 'center', alignItems: 'center' }}>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: '70px', color: 'orange' }} />

          <Typography variant="body2">{showAlert}</Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={() => bulkNotLinkedUpdate(isDeleteBulkNotLinkedOpen.data)}>
            Ok
          </Button>
          <Button variant="contained" sx={buttonStyles.btncancel} onClick={handleCloseBulkNotLinkedClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isUnitApprovalOpen} onClose={handleCloseUnitApprovalerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
          <Typography variant="h6">{`Please Enter points for this Subcategory`}</Typography>
          <OutlinedInput
            id="component-outlined"
            type="text"
            value={unitrateApproval}
            placeholder="Please Enter Points"
            onChange={(e) => {
              setUnitrateApproval(e.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" sx={buttonStyles.btnsubmit} onClick={() => handleUnitApprovalUpdate(unitrateApproval)}>
            Update
          </Button>
          <Button variant="contained" sx={buttonStyles.btncancel} color="error" onClick={handleCloseUnitApprovalerr}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <br />
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
        filteredDataTwo={subcategories ?? []}
        itemsTwo={allModuleedit ?? []}
        filename={'Production Subcategory'}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup openInfo={openInfo} handleCloseinfo={handleCloseinfo} heading="Production Subcategory Info" addedby={addedby} updateby={updateby} />
      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation open={isDeleteOpen} onClose={handleCloseMod} onConfirm={delModule} title="Are you sure?" confirmButtonText="Yes" cancelButtonText="Cancel" />
      {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation open={isDeleteOpencheckbox} onClose={handleCloseModcheckbox} onConfirm={delProjectcheckbox} title="Are you sure?" confirmButtonText="Yes" cancelButtonText="Cancel" />
      {/* PLEASE SELECT ANY ROW */}
      <PleaseSelectRow open={isDeleteOpenalert} onClose={handleCloseModalert} message="Please Select any Row" iconColor="orange" buttonText="OK" />
      {/* EXTERNAL COMPONENTS -------------- END */}
    </Box>
  );
}

export default SubCategoryMaster;