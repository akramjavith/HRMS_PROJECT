import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ImageIcon from '@mui/icons-material/Image';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, FormControl, FormControlLabel, Grid, IconButton, InputAdornment, List, ListItem, ListItemText, MenuItem, OutlinedInput, Popover, Radio, RadioGroup, Select, TextField, Tooltip, Typography } from '@mui/material';
import Switch from '@mui/material/Switch';
import axios from 'axios';
import domtoimage from 'dom-to-image';
import { saveAs } from 'file-saver';
import 'jspdf-autotable';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPlus, FaPrint, FaSearch } from 'react-icons/fa';
import { IoMdOptions } from 'react-icons/io';
import { MdClose } from 'react-icons/md';
import { ThreeDots } from 'react-loader-spinner';
import { MultiSelect } from 'react-multi-select-component';
import Selects from 'react-select';
import { useReactToPrint } from 'react-to-print';
import AggridTableForPaginationTable from '../../components/AggridTableForPaginationTable.js';
import AlertDialog from '../../components/Alert';
import { DeleteConfirmation, PleaseSelectRow } from '../../components/DeleteConfirmation.js';
import { handleApiError } from '../../components/Errorhandling';
import ExportData from '../../components/ExportData';
import Headtitle from '../../components/Headtitle';
import InfoPopup from '../../components/InfoPopup.js';
import MessageAlert from '../../components/MessageAlert';
import PageHeading from '../../components/PageHeading';
import { AuthContext, UserRoleAccessContext } from '../../context/Appcontext';
import { userStyle } from '../../pageStyle';
import { SERVICE } from '../../services/Baseservice';

function RolesAndResponsiblities() {
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

  const gridRefTable = useRef(null);
  const [isHandleChange, setIsHandleChange] = useState(false);
  //Delete model
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
  };
  const [fileFormat, setFormat] = useState('');
  const CurrentDate = new Date();

  const [nonProductionEdit, setNonProductionEdit] = useState({
    category: 'Please Select Category',
    subcategory: 'Please Select Sub Category',
    mode: '',
    count: '1',
    date: '',
    fromtime: '',
    totime: '',
    totalhours: '',
  });
  const [taskcategorys, setTaskcategorys] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { isUserRoleCompare, isUserRoleAccess, isAssignBranch, pageName, setPageName, buttonStyles, allTeam } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);
  const [taskcategoryCheck, setTaskcategorycheck] = useState(false);
  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState('');

  const accessbranch = isUserRoleAccess?.role?.includes('Manager')
    ? isAssignBranch?.map((data) => ({
      branch: data.branch,
      company: data.company,
      unit: data.unit,
    }))
    : isAssignBranch
      ?.filter((data) => {
        let fetfinalurl = [];
        if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.mainpagenameurl?.length !== 0 && data?.subpagenameurl?.length !== 0 && data?.subsubpagenameurl?.length !== 0 && data?.submodulenameurl?.includes(window.location.pathname)) {
          fetfinalurl = data.subsubpagenameurl;
        } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.mainpagenameurl?.length !== 0 && data?.subpagenameurl?.length !== 0 && data?.submodulenameurl?.includes(window.location.pathname)) {
          fetfinalurl = data.subpagenameurl;
        } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.mainpagenameurl?.length !== 0 && data?.submodulenameurl?.includes(window.location.pathname)) {
          fetfinalurl = data.mainpagenameurl;
        } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.submodulenameurl?.includes(window.location.pathname)) {
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

  const gridRefTableImg = useRef(null);
  // image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage
        .toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, 'Employee Designation Requirements.png');
        })
        .catch((error) => {
          console.error('dom-to-image error: ', error);
        });
    }
  };

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  // view model
  const [openview, setOpenview] = useState(false);
  const handleClickOpenview = () => {
    setOpenview(true);
  };
  const handleCloseview = () => {
    setOpenview(false);
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
  //Delete model
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
  //Delete model
  const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);
  const handleClickOpencheckbox = () => {
    setIsDeleteOpencheckbox(true);
  };
  const handleCloseModcheckbox = () => {
    setIsDeleteOpencheckbox(false);
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
    mode: true,
    type: true,
    company: true,
    branch: true,
    unit: true,
    team: true,
    employee: true,
    department: true,
    designation: true,
    jobroles: true,
    description: true,
    actions: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);
  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ''; // This is required for Chrome support
  };
  const [deleteCategroy, setDeleteCategory] = useState('');
  const rowData = async (id, name) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.ROLESANDRESPONSIBILITIES_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeleteCategory(res?.data?.srolesandresponsibilities);
      handleClickOpen();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  // Alert delete popup
  let taskcategorysid = deleteCategroy?._id;
  const delTaskCategory = async () => {
    setPageName(!pageName);
    try {
      if (taskcategorysid) {
        await axios.delete(`${SERVICE.ROLESANDRESPONSIBILITIES_SINGLE}/${taskcategorysid}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
        await fetchTaskcategoryForPagination();
        await fetchAllRolesResponsForExports();

        handleCloseMod();
        setSelectedRows([]);
        setPage(1);
        setPopupContent('Deleted Successfully');
        setPopupSeverity('success');
        handleClickOpenPopup();
      }
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  const delTaskCatecheckbox = async () => {
    setPageName(!pageName);
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.ROLESANDRESPONSIBILITIES_SINGLE}/${item}`, {
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
      await fetchTaskcategoryForPagination();
      await fetchAllRolesResponsForExports();

      setPopupContent('Deleted Successfully');
      setPopupSeverity('success');
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  //add function
  const [isBtn, setBtn] = useState(false);

  const [jobRoles, setJobRoles] = useState('');
  const [jobRolesTodo, setJobRolesTodo] = useState([]);

  const [description, setDescription] = useState('');
  const [descriptionTodo, setDescriptionTodo] = useState([]);


  const [jobRolesEdit, setJobRolesEdit] = useState('');
  const [jobRolesTodoEdit, setJobRolesTodoEdit] = useState([]);

  const [descriptionEdit, setDescriptionEdit] = useState('');
  const [descriptionTodoEdit, setDescriptionTodoEdit] = useState([]);

  const sendRequest = async () => {
    setBtn(true);
    setPageName(!pageName);
    try {
      let subprojectscreate = await axios.post(SERVICE.ROLESANDRESPONSIBILITIES_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        mode: filterState.mode !== "" ? [filterState.mode] : [],
        type: String(filterState.type),
        company: valueCompanyCat,
        branch: valueBranchCat,
        unit: valueUnitCat,
        team: valueTeamCat,
        employee: valueEmployeeCat,
        department: valueDepartmentCat,
        designation: valueDesignationCat,
        jobroles: jobRolesTodo,
        description: descriptionTodo,
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await fetchTaskcategoryForPagination();
      await fetchAllRolesResponsForExports();
      // setNonProductionState({
      //   ...nonProductionState,
      //   count: "1",
      //   date: moment(CurrentDate).format("YYYY-MM-DD"),
      //   fromtime: "",
      //   totime: "",
      //   totalhours: ""
      // })

      setFilterState({
        type: 'Individual',
        mode: "",
      });
      setSelectedOptionsEmployee([]);
      setValueCompanyCat([]);
      setSelectedOptionsCompany([]);
      setValueBranchCat([]);
      setSelectedOptionsBranch([]);
      setValueUnitCat([]);
      setSelectedOptionsUnit([]);
      setValueTeamCat([]);
      setSelectedOptionsTeam([]);
      setJobRolesTodo([]);
      setDescriptionTodo([]);
      setSelectedOptionsDesignation([]);
      setValueDesignationCat([]);
      setSelectedOptionsDepartment([]);
      setValueDepartmentCat([]);

      setPopupContent('Added Successfully');
      setPopupSeverity('success');
      handleClickOpenPopup();
      setBtn(false);
    } catch (err) {
      setBtn(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();

    const NameMatch = (() => {
      const commonConditions = (item) =>
        item?.mode?.some((modeItem) => filterState?.mode === modeItem) &&
        item?.company?.some((companyItem) => valueCompanyCat?.includes(companyItem)) &&
        item?.jobroles?.some((branchItem) => jobRolesTodo?.includes(branchItem)) &&
        item?.description?.some((branchItem) => descriptionTodo?.includes(branchItem));

      const typeConditions = {
        Individual: (item) =>
          item?.branch?.some((branchItem) => valueBranchCat?.includes(branchItem)) &&
          item?.unit?.some((branchItem) => valueUnitCat?.includes(branchItem)) &&
          item?.team?.some((branchItem) => valueTeamCat?.includes(branchItem)) &&
          item?.employee?.some((branchItem) => valueEmployeeCat?.includes(branchItem)),
        Department: (item) => item?.department?.some((branchItem) => valueDepartmentCat?.includes(branchItem)),
        Designation: (item) => item?.designation?.some((branchItem) => valueDesignationCat?.includes(branchItem)),
        Company: (item) => true, // No additional conditions beyond common ones
        Branch: (item) => item?.branch?.some((branchItem) => valueBranchCat?.includes(branchItem)),
        Unit: (item) => item?.branch?.some((branchItem) => valueBranchCat?.includes(branchItem)) && item?.unit?.some((branchItem) => valueUnitCat?.includes(branchItem)),
        default: (item) => item?.branch?.some((branchItem) => valueBranchCat?.includes(branchItem)) && item?.unit?.some((branchItem) => valueUnitCat?.includes(branchItem)) && item?.team?.some((branchItem) => valueTeamCat?.includes(branchItem)),
      };

      const conditionFn = typeConditions[filterState.type] || typeConditions.default;

      return allRolesandRespon?.some((item) => commonConditions(item) && conditionFn(item));
    })();

    const hasDuplicates = (arr) => new Set(arr.map((s) => s.toLowerCase())).size !== arr.length;

    if (filterState?.mode === "") {
      setPopupContentMalert('Please Select Mode');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    }
    else if (selectedOptionsCompany?.length === 0) {
      setPopupContentMalert('Please Select Company');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    }
    else if (['Individual', 'Branch', 'Unit', 'Team']?.includes(filterState?.type) && selectedOptionsBranch?.length === 0) {
      setPopupContentMalert('Please Select Branch');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (['Individual', 'Unit', 'Team']?.includes(filterState?.type) && selectedOptionsUnit?.length === 0) {
      setPopupContentMalert('Please Select Unit');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (['Individual', 'Team']?.includes(filterState?.type) && selectedOptionsTeam?.length === 0) {
      setPopupContentMalert('Please Select Team');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (filterState?.type === 'Individual' && selectedOptionsEmployee?.length === 0) {
      setPopupContentMalert('Please Select Employee Names');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (filterState?.type === 'Department' && selectedOptionsDepartment?.length === 0) {
      setPopupContentMalert('Please Select Department!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (jobRolesTodo?.length === 0) {
      setPopupContentMalert('Please Add Job Roles');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (descriptionTodo?.length === 0) {
      setPopupContentMalert('Please Add Description');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (jobRolesTodo?.some((item) => item === '')) {
      setPopupContentMalert('Job Roles Cannot be Empty!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (descriptionTodo?.some((item) => item === '')) {
      setPopupContentMalert('Description Cannot be Empty!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (hasDuplicates(jobRolesTodo)) {
      setPopupContentMalert('Job Roles Cannot be Same!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (hasDuplicates(descriptionTodo)) {
      setPopupContentMalert('Description Cannot be Same!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (NameMatch) {
      setPopupContentMalert('Data already exists!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else {
      sendRequest();
    }
  };

  const handleClear = (e) => {
    e.preventDefault();

    setFilterState({
      type: 'Individual',
      mode: "",
    });
    setSelectedOptionsEmployee([]);
    setValueCompanyCat([]);
    setSelectedOptionsCompany([]);
    setValueBranchCat([]);
    setSelectedOptionsBranch([]);
    setValueUnitCat([]);
    setSelectedOptionsUnit([]);
    setValueTeamCat([]);
    setSelectedOptionsTeam([]);
    setJobRolesTodo([]);
    setDescriptionTodo([]);
    setSelectedOptionsDesignation([]);
    setValueDesignationCat([]);

    setSelectedOptionsDepartment([]);
    setValueDepartmentCat([]);
    setSearchQuery('');
    setPageSize(10);
    setFilteredChanges(null);
    setFilteredRowData([]);
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
  // info model
  const [openInfo, setOpeninfo] = useState(false);
  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };
  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  const [editDuplicate, setEditDuplicate] = useState([]);

  //get single row to edit....
  const getCode = async (e, name) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.ROLESANDRESPONSIBILITIES_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setEditDuplicate(allRolesandRespon?.filter((item) => item?._id !== e));
      setNonProductionEdit(res?.data?.srolesandresponsibilities);
      setFilterStateEdit({
        type: res?.data?.srolesandresponsibilities?.type,
        mode: res?.data?.srolesandresponsibilities?.mode?.length > 0 ? res?.data?.srolesandresponsibilities?.mode[0] : "",
      });

      setSelectedOptionsCompanyEdit(
        res?.data?.srolesandresponsibilities?.company?.map((item) => ({
          label: item,
          value: item,
        }))
      );
      setValueCompanyCatEdit(res?.data?.srolesandresponsibilities?.company);

      setSelectedOptionsBranchEdit(
        res?.data?.srolesandresponsibilities?.branch?.map((item) => ({
          label: item,
          value: item,
        }))
      );
      setValueBranchCatEdit(res?.data?.srolesandresponsibilities?.branch);

      setSelectedOptionsUnitEdit(
        res?.data?.srolesandresponsibilities?.unit?.map((item) => ({
          label: item,
          value: item,
        }))
      );
      setValueUnitCatEdit(res?.data?.srolesandresponsibilities?.unit);

      setSelectedOptionsTeamEdit(
        res?.data?.srolesandresponsibilities?.team?.map((item) => ({
          label: item,
          value: item,
        }))
      );
      setValueTeamCatEdit(res?.data?.srolesandresponsibilities?.team);

      setSelectedOptionsDepartmentEdit(
        res?.data?.srolesandresponsibilities?.department?.map((item) => ({
          label: item,
          value: item,
        }))
      );
      setValueDepartmentCatEdit(res?.data?.srolesandresponsibilities?.department);

      setSelectedOptionsDesignationEdit(
        res?.data?.srolesandresponsibilities?.designation?.map((item) => ({
          label: item,
          value: item,
        }))
      );
      setValueDesignationCatEdit(res?.data?.srolesandresponsibilities?.designation);

      setSelectedOptionsEmployeeEdit(
        res?.data?.srolesandresponsibilities?.employee?.map((item) => ({
          label: item,
          value: item,
        }))
      );
      setValueEmployeeCatEdit(res?.data?.srolesandresponsibilities?.employee);

      setJobRolesTodoEdit(res?.data?.srolesandresponsibilities?.jobroles);
      setDescriptionTodoEdit(res?.data?.srolesandresponsibilities?.description);

      // setModeEdit(res?.data?.srolesandresponsibilities?.mode)
      // setCountEdit(res?.data?.srolesandresponsibilities?.count)
      // getCategoryAndSubcategoryEdit(res?.data?.srolesandresponsibilities?.category)

      // handleSubCategory(res?.data?.snonproduction?.category)
      handleClickOpenEdit();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  // get single row to view....
  const getviewCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.ROLESANDRESPONSIBILITIES_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setNonProductionEdit(res?.data?.srolesandresponsibilities);
      handleClickOpenview();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.ROLESANDRESPONSIBILITIES_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setNonProductionEdit(res?.data?.srolesandresponsibilities);
      handleClickOpeninfo();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  //Project updateby edit page...
  let updateby = nonProductionEdit?.updatedby;
  let addedby = nonProductionEdit?.addedby;
  let subprojectsid = nonProductionEdit?._id;
  //editing the single data...
  const sendEditRequest = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.put(`${SERVICE.ROLESANDRESPONSIBILITIES_SINGLE}/${subprojectsid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        mode: filterStateEdit.mode !== "" ? [filterStateEdit.mode] : [],
        type: String(filterStateEdit.type),
        company: valueCompanyCatEdit,
        branch: valueBranchCatEdit,
        unit: valueUnitCatEdit,
        team: valueTeamCatEdit,
        employee: valueEmployeeCatEdit,
        department: valueDepartmentCatEdit,
        designation: valueDesignationCatEdit,
        jobroles: jobRolesTodoEdit,
        description: descriptionTodoEdit,
        updatedby: [
          ...updateby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await fetchTaskcategoryForPagination();
      await fetchAllRolesResponsForExports();

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

    const NameMatch = (() => {
      const commonConditions = (item) =>
        item?.mode?.some((modeItem) => filterStateEdit?.mode === modeItem) &&
        item?.company?.some((companyItem) => valueCompanyCatEdit?.includes(companyItem)) &&
        item?.jobroles?.some((branchItem) => jobRolesTodoEdit?.includes(branchItem)) && item?.description?.some((branchItem) => descriptionTodoEdit?.includes(branchItem));

      const typeConditions = {
        Individual: (item) =>
          item?.branch?.some((branchItem) => valueBranchCatEdit?.includes(branchItem)) &&
          item?.unit?.some((branchItem) => valueUnitCatEdit?.includes(branchItem)) &&
          item?.team?.some((branchItem) => valueTeamCatEdit?.includes(branchItem)) &&
          item?.employee?.some((branchItem) => valueEmployeeCatEdit?.includes(branchItem)),
        Department: (item) => item?.department?.some((branchItem) => valueDepartmentCatEdit?.includes(branchItem)),
        Designation: (item) => item?.designation?.some((branchItem) => valueDesignationCatEdit?.includes(branchItem)),
        Company: (item) => true, // No additional conditions beyond common ones
        Branch: (item) => item?.branch?.some((branchItem) => valueBranchCatEdit?.includes(branchItem)),
        Unit: (item) => item?.branch?.some((branchItem) => valueBranchCatEdit?.includes(branchItem)) && item?.unit?.some((branchItem) => valueUnitCatEdit?.includes(branchItem)),
        default: (item) => item?.branch?.some((branchItem) => valueBranchCatEdit?.includes(branchItem)) && item?.unit?.some((branchItem) => valueUnitCatEdit?.includes(branchItem)) && item?.team?.some((branchItem) => valueTeamCatEdit?.includes(branchItem)),
      };

      const conditionFn = typeConditions[filterState.type] || typeConditions.default;

      return editDuplicate?.some((item) => commonConditions(item) && conditionFn(item));
    })();

    const hasDuplicates = (arr) => new Set(arr.map((s) => s.toLowerCase())).size !== arr.length;

    if (filterStateEdit?.mode === "") {
      setPopupContentMalert('Please Select Mode');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (selectedOptionsCompanyEdit?.length === 0) {
      setPopupContentMalert('Please Select Company');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (['Individual', 'Branch', 'Unit', 'Team']?.includes(filterStateEdit?.type) && selectedOptionsBranchEdit?.length === 0) {
      setPopupContentMalert('Please Select Branch');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (['Individual', 'Unit', 'Team']?.includes(filterStateEdit?.type) && selectedOptionsUnitEdit?.length === 0) {
      setPopupContentMalert('Please Select Unit');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (['Individual', 'Team']?.includes(filterStateEdit?.type) && selectedOptionsTeamEdit?.length === 0) {
      setPopupContentMalert('Please Select Team');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (filterStateEdit?.type === 'Individual' && selectedOptionsEmployeeEdit?.length === 0) {
      setPopupContentMalert('Please Select Employee Names');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (filterStateEdit?.type === 'Department' && selectedOptionsDepartmentEdit?.length === 0) {
      setPopupContentMalert('Please Select Department!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (jobRolesTodoEdit?.length === 0) {
      setPopupContentMalert('Please Add Job Roles');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (descriptionTodoEdit?.length === 0) {
      setPopupContentMalert('Please Add Description');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (jobRolesTodoEdit?.some((item) => item === '')) {
      setPopupContentMalert('Job Roles Cannot be Empty!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (descriptionTodoEdit?.some((item) => item === '')) {
      setPopupContentMalert('Description Cannot be Empty!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (hasDuplicates(jobRolesTodoEdit)) {
      setPopupContentMalert('Job Roles Cannot be Same!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (hasDuplicates(descriptionTodoEdit)) {
      setPopupContentMalert('Description Cannot be Same!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (NameMatch) {
      setPopupContentMalert('Data already exists!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else {
      sendEditRequest();
    }
  };

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String('Employee Designation Requirements'),
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
    fetchAllUsers();
    fetchAllRolesRespons();
    fetchAllRolesResponsForExports();
  }, []);

  let exportColumnNames = ['Mode', 'Type', 'Company', 'Branch', 'Unit', 'Team', 'Employee', 'Department', 'Designation', 'Job Roles', 'Description'];
  let exportRowValues = ['mode', 'type', 'company', 'branch', 'unit', 'team', 'employee', 'department', 'designation', 'jobroles', 'description'];
  //get all Sub vendormasters.

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

  const fetchTaskcategoryForPagination = async () => {
    setPageName(!pageName);

    console.time('fetchTaskcategoryForPagination');

    const queryParams = {
      page: Number(page),
      pageSize: Number(pageSize),
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
      let res_vendor = await axios.post(SERVICE.ALLROLESANDRESPONSIBILITIES_PAGINATION, queryParams, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setTaskcategorycheck(true);
      setTaskcategorys(
        res_vendor?.data?.result?.map((item, index) => ({
          ...item,
          serialNumber: (page - 1) * pageSize + index + 1,
          mode: item?.mode && item?.mode?.length > 0 ? item?.mode?.join(",") : ""
        }))
      );

      setTotalProjects(res_vendor?.data?.result?.length > 0 ? res_vendor?.data?.totalProjects : 0);
      setTotalPages(res_vendor?.data?.result?.length > 0 ? res_vendor?.data?.totalPages : 0);
      setPageSize((data) => {
        return res_vendor?.data?.result?.length > 0 ? data : 10;
      });
      setPage((data) => {
        return res_vendor?.data?.result?.length > 0 ? data : 1;
      });
      console.timeEnd('fetchTaskcategoryForPagination');
    } catch (err) {
      setTaskcategorycheck(true);
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
      let res_vendor = await axios.post(SERVICE.ALLROLESANDRESPONSIBILITIES_PAGINATION, queryParams, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setTaskcategorycheck(true);
      const Data = res_vendor?.data?.result;
      setItems(
        res_vendor?.data?.result?.map((t, index) => ({
          ...t,
          serialNumber: (page - 1) * pageSize + index + 1,
          mode: t?.mode && t?.mode?.length > 0 ? t?.mode?.join(",") : ""
        }))
      );
      setTaskcategorys(
        res_vendor?.data?.result?.map((t, index) => ({
          ...t,
          serialNumber: (page - 1) * pageSize + index + 1,
          mode: t?.mode && t?.mode?.length > 0 ? t?.mode?.join(",") : ""
        }))
      );

      setTotalProjects(res_vendor?.data?.result?.length > 0 ? res_vendor?.data?.totalProjects : 0);
      setTotalPages(res_vendor?.data?.result?.length > 0 ? res_vendor?.data?.totalPages : 0);
      setPageSize((data) => {
        return res_vendor?.data?.result?.length > 0 ? data : 10;
      });
      setPage((data) => {
        return res_vendor?.data?.result?.length > 0 ? data : 1;
      });
    } catch (err) {
      setTaskcategorycheck(true);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Employee Designation Requirements',
    pageStyle: 'print',
  });
  useEffect(() => {
    fetchTaskcategoryForPagination();
    // fetchUserAllotBy();
  }, [page, pageSize, searchQuery]);
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
    addSerialNumber(taskcategorys);
  }, [taskcategorys]);
  //Datatable

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
      width: 90,
      hide: !columnVisibility.serialNumber,
      headerClassName: 'bold-header',
      pinned: 'left',
    },
    { field: 'mode', headerName: 'Mode', flex: 0, width: 130, hide: !columnVisibility.mode, headerClassName: 'bold-header', pinned: 'left' },
    { field: 'type', headerName: 'Type', flex: 0, width: 130, hide: !columnVisibility.type, headerClassName: 'bold-header', pinned: 'left' },
    { field: 'company', headerName: 'Company', flex: 0, width: 150, hide: !columnVisibility.company, headerClassName: 'bold-header', pinned: 'left' },
    { field: 'branch', headerName: 'Branch', flex: 0, width: 150, hide: !columnVisibility.branch, headerClassName: 'bold-header', pinned: 'left' },
    { field: 'unit', headerName: 'Unit', flex: 0, width: 150, hide: !columnVisibility.unit, headerClassName: 'bold-header' },
    { field: 'team', headerName: 'Team', flex: 0, width: 150, hide: !columnVisibility.team, headerClassName: 'bold-header' },
    { field: 'employee', headerName: 'Employee', flex: 0, width: 150, hide: !columnVisibility.employee, headerClassName: 'bold-header' },
    { field: 'department', headerName: 'Department', flex: 0, width: 150, hide: !columnVisibility.department, headerClassName: 'bold-header' },
    { field: 'designation', headerName: 'Designation', flex: 0, width: 150, hide: !columnVisibility.designation, headerClassName: 'bold-header' },
    { field: 'jobroles', headerName: 'Job Roles', flex: 0, width: 150, hide: !columnVisibility.jobroles, headerClassName: 'bold-header' },
    { field: 'description', headerName: 'Description', flex: 0, width: 150, hide: !columnVisibility.description, headerClassName: 'bold-header' },
    {
      field: 'actions',
      headerName: 'Action',
      flex: 0,
      width: 280,
      minHeight: '40px !important',
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: 'bold-header',
      cellRenderer: (params) => (
        <Grid sx={{ display: 'flex' }}>
          {isUserRoleCompare?.includes('eemployeedesignationrequirements') && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.data.id, params.data.name);
              }}
            >
              <EditOutlinedIcon sx={buttonStyles.buttonedit} />{' '}
            </Button>
          )}
          {isUserRoleCompare?.includes('demployeedesignationrequirements') && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.data.id, params.data.name);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />{' '}
            </Button>
          )}
          {isUserRoleCompare?.includes('vemployeedesignationrequirements') && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.data.id);
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />{' '}
            </Button>
          )}
          {isUserRoleCompare?.includes('iemployeedesignationrequirements') && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getinfoCode(params.data.id);
              }}
            >
              <InfoOutlinedIcon sx={buttonStyles.buttoninfo} />{' '}
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
      mode: item?.mode || "",
      type: item.type,
      company: item.company,
      branch: item.branch,
      unit: item.unit,
      team: item.team,
      employee: item.employee,
      department: item.department,
      designation: item.designation,
      jobroles: item.jobroles,
      description: item.description,
    };
  });

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

  let modeOptions = [
    { label: "Job Description", value: "Job Description" },
    { label: "Job Requirements", value: "Job Requirements" },
    { label: "Job Benefits", value: "Job Benefits" },
    { label: "Role And Responsibilities", value: "Role And Responsibilities" },
  ]

  const [filterState, setFilterState] = useState({
    type: 'Individual',
    mode: "",
  });

  const [filterStateEdit, setFilterStateEdit] = useState({
    type: 'Individual',
    mode: "",
  });

  const TypeOptions = [
    { label: 'Individual', value: 'Individual' },
    { label: 'Department', value: 'Department' },
    { label: 'Designation', value: 'Designation' },
    { label: 'Company', value: 'Company' },
    { label: 'Branch', value: 'Branch' },
    { label: 'Unit', value: 'Unit' },
    { label: 'Team', value: 'Team' },
  ];

  //company multiselect
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
    setValueTeamCat([]);
    setSelectedOptionsTeam([]);
    setValueDepartmentCat([]);
    setSelectedOptionsDepartment([]);
    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);
  };

  const customValueRendererCompany = (valueCompanyCat, _categoryname) => {
    return valueCompanyCat?.length ? valueCompanyCat.map(({ label }) => label)?.join(', ') : 'Please Select Company';
  };

  const [selectedOptionsCompanyEdit, setSelectedOptionsCompanyEdit] = useState([]);
  let [valueCompanyCatEdit, setValueCompanyCatEdit] = useState([]);

  const handleCompanyChangeEdit = (options) => {
    setValueCompanyCatEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCompanyEdit(options);
    setValueBranchCatEdit([]);
    setSelectedOptionsBranchEdit([]);
    setValueUnitCatEdit([]);
    setSelectedOptionsUnitEdit([]);
    setValueTeamCatEdit([]);
    setSelectedOptionsTeamEdit([]);
    setValueDepartmentCatEdit([]);
    setSelectedOptionsDepartmentEdit([]);
    setValueEmployeeCatEdit([]);
    setSelectedOptionsEmployeeEdit([]);
  };

  const customValueRendererCompanyEdit = (valueCompanyCat, _categoryname) => {
    return valueCompanyCat?.length ? valueCompanyCat.map(({ label }) => label)?.join(', ') : 'Please Select Company';
  };

  //branch multiselect
  const [selectedOptionsBranch, setSelectedOptionsBranch] = useState([]);
  let [valueBranchCat, setValueBranchCat] = useState([]);

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
    setValueDepartmentCat([]);
    setSelectedOptionsDepartment([]);
    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);
  };

  const customValueRendererBranch = (valueBranchCat, _categoryname) => {
    return valueBranchCat?.length ? valueBranchCat.map(({ label }) => label)?.join(', ') : 'Please Select Branch';
  };

  const [selectedOptionsBranchEdit, setSelectedOptionsBranchEdit] = useState([]);
  let [valueBranchCatEdit, setValueBranchCatEdit] = useState([]);

  const handleBranchChangeEdit = (options) => {
    setValueBranchCatEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsBranchEdit(options);
    setValueUnitCatEdit([]);
    setSelectedOptionsUnitEdit([]);
    setValueTeamCatEdit([]);
    setSelectedOptionsTeamEdit([]);
    setValueDepartmentCatEdit([]);
    setSelectedOptionsDepartmentEdit([]);
    setValueEmployeeCatEdit([]);
    setSelectedOptionsEmployeeEdit([]);
  };

  const customValueRendererBranchEdit = (valueBranchCat, _categoryname) => {
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
    setValueTeamCat([]);
    setSelectedOptionsTeam([]);
    setValueDepartmentCat([]);
    setSelectedOptionsDepartment([]);
    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);
  };

  const customValueRendererUnit = (valueUnitCat, _categoryname) => {
    return valueUnitCat?.length ? valueUnitCat.map(({ label }) => label)?.join(', ') : 'Please Select Unit';
  };

  const [selectedOptionsUnitEdit, setSelectedOptionsUnitEdit] = useState([]);
  let [valueUnitCatEdit, setValueUnitCatEdit] = useState([]);

  const handleUnitChangeEdit = (options) => {
    setValueUnitCatEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsUnitEdit(options);
    setValueTeamCatEdit([]);
    setSelectedOptionsTeamEdit([]);
    setValueDepartmentCatEdit([]);
    setSelectedOptionsDepartmentEdit([]);
    setValueEmployeeCatEdit([]);
    setSelectedOptionsEmployeeEdit([]);
  };

  const customValueRendererUnitEdit = (valueUnitCat, _categoryname) => {
    return valueUnitCat?.length ? valueUnitCat.map(({ label }) => label)?.join(', ') : 'Please Select Unit';
  };

  //team multiselect
  const [selectedOptionsTeam, setSelectedOptionsTeam] = useState([]);
  let [valueTeamCat, setValueTeamCat] = useState([]);

  const handleTeamChange = (options) => {
    setValueTeamCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsTeam(options);
    setValueDepartmentCat([]);
    setSelectedOptionsDepartment([]);
    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);
  };

  const customValueRendererTeam = (valueTeamCat, _categoryname) => {
    return valueTeamCat?.length ? valueTeamCat.map(({ label }) => label)?.join(', ') : 'Please Select Team';
  };

  const [selectedOptionsTeamEdit, setSelectedOptionsTeamEdit] = useState([]);
  let [valueTeamCatEdit, setValueTeamCatEdit] = useState([]);

  const handleTeamChangeEdit = (options) => {
    setValueTeamCatEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsTeamEdit(options);
    setValueDepartmentCatEdit([]);
    setSelectedOptionsDepartmentEdit([]);
    setValueEmployeeCatEdit([]);
    setSelectedOptionsEmployeeEdit([]);
  };

  const customValueRendererTeamEdit = (valueTeamCat, _categoryname) => {
    return valueTeamCat?.length ? valueTeamCat.map(({ label }) => label)?.join(', ') : 'Please Select Team';
  };

  //department multiselect
  const [selectedOptionsDepartment, setSelectedOptionsDepartment] = useState([]);
  let [valueDepartmentCat, setValueDepartmentCat] = useState([]);

  const handleDepartmentChange = (options) => {
    setValueDepartmentCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsDepartment(options);
    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);
  };

  const customValueRendererDepartment = (valueDepartmentCat, _categoryname) => {
    return valueDepartmentCat?.length ? valueDepartmentCat.map(({ label }) => label)?.join(', ') : 'Please Select Department';
  };

  const [selectedOptionsDepartmentEdit, setSelectedOptionsDepartmentEdit] = useState([]);
  let [valueDepartmentCatEdit, setValueDepartmentCatEdit] = useState([]);

  const handleDepartmentChangeEdit = (options) => {
    setValueDepartmentCatEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsDepartmentEdit(options);
    setValueEmployeeCatEdit([]);
    setSelectedOptionsEmployeeEdit([]);
  };

  const customValueRendererDepartmentEdit = (valueDepartmentCat, _categoryname) => {
    return valueDepartmentCat?.length ? valueDepartmentCat.map(({ label }) => label)?.join(', ') : 'Please Select Department';
  };

  //designation multiselect
  const [selectedOptionsDesignation, setSelectedOptionsDesignation] = useState([]);
  let [valueDesignationCat, setValueDesignationCat] = useState([]);

  const handleDesignationChange = (options) => {
    setValueDesignationCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsDesignation(options);
    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);
  };

  const customValueRendererDesignation = (valueDesignationCat, _categoryname) => {
    return valueDesignationCat?.length ? valueDesignationCat.map(({ label }) => label)?.join(', ') : 'Please Select Designation';
  };

  const [selectedOptionsDesignationEdit, setSelectedOptionsDesignationEdit] = useState([]);
  let [valueDesignationCatEdit, setValueDesignationCatEdit] = useState([]);

  const handleDesignationChangeEdit = (options) => {
    setValueDesignationCatEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsDesignationEdit(options);
    setValueEmployeeCatEdit([]);
    setSelectedOptionsEmployeeEdit([]);
  };

  const customValueRendererDesignationEdit = (valueDesignationCatEdit, _categoryname) => {
    return valueDesignationCatEdit?.length ? valueDesignationCatEdit.map(({ label }) => label)?.join(', ') : 'Please Select Designation';
  };

  //employee multiselect
  const [selectedOptionsEmployee, setSelectedOptionsEmployee] = useState([]);
  let [valueEmployeeCat, setValueEmployeeCat] = useState([]);

  const handleEmployeeChange = (options) => {
    setValueEmployeeCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsEmployee(options);
  };

  const customValueRendererEmployee = (valueEmployeeCat, _categoryname) => {
    return valueEmployeeCat?.length ? valueEmployeeCat.map(({ label }) => label)?.join(', ') : 'Please Select Employee';
  };

  const [selectedOptionsEmployeeEdit, setSelectedOptionsEmployeeEdit] = useState([]);
  let [valueEmployeeCatEdit, setValueEmployeeCatEdit] = useState([]);

  const handleEmployeeChangeEdit = (options) => {
    setValueEmployeeCatEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsEmployeeEdit(options);
  };

  const customValueRendererEmployeeEdit = (valueEmployeeCat, _categoryname) => {
    return valueEmployeeCat?.length ? valueEmployeeCat.map(({ label }) => label)?.join(', ') : 'Please Select Employee';
  };

  useEffect(() => {
    fetchDepartments();
    fetchDesignation();
  }, []);

  const [departmentOptions, setDepartmentOptions] = useState([]);
  const fetchDepartments = async () => {
    try {
      let req = await axios.get(SERVICE.DEPARTMENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDepartmentOptions(
        req?.data?.departmentdetails?.map((data) => ({
          label: data?.deptname,
          value: data?.deptname,
        }))
      );
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const [designationOptions, setDesignationOptions] = useState([]);
  const fetchDesignation = async () => {
    try {
      let req = await axios.get(SERVICE.DESIGNATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDesignationOptions(
        req?.data?.designation?.map((data) => ({
          label: data?.name,
          value: data?.name,
        }))
      );
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const [isAllUsers, setIsAllUsers] = useState([]);

  const fetchAllUsers = async (id, name) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.ALLUSERENQLIVE}`, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      setIsAllUsers(res?.data?.users);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const [allRolesandRespon, setIsAllRolesandRespon] = useState([]);

  const fetchAllRolesRespons = async (id, name) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.ALLROLESANDRESPONSIBILITIES}`, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      setIsAllRolesandRespon(res?.data?.rolesandresponsibilities);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const [allRolesandResponAllExports, setIsAllRolesandResponAllExports] = useState([]);

  const fetchAllRolesResponsForExports = async (id, name) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.ALLROLESANDRESPONSIBILITIES_EXPORTS}`, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      setIsAllRolesandResponAllExports(res?.data?.result);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const addTodo = () => {
    // getCategoryList();
    const isSubNameMatch = jobRolesTodo.some((item) => item?.toLowerCase() === jobRoles?.toLowerCase());
    // const isSubNameMatch = categoryList.some((item) => item.subcategoryname.includes(subcategory));
    if (jobRoles === '') {
      setPopupContentMalert('Please Enter Job Roles!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (isSubNameMatch) {
      setPopupContentMalert('Already Added ! Please Enter Another Job Roles!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else {
      setJobRolesTodo([...jobRolesTodo, jobRoles]);
      setJobRoles('');
    }
  };

  console.log(jobRolesTodo, descriptionTodo, "jobRolesTodo,descriptionTodo")

  const addTodoDescription = () => {

    // getCategoryList();
    const isSubNameMatchDes = descriptionTodo.some((item) => item?.toLowerCase() === description?.toLowerCase());
    // const isSubNameMatch = categoryList.some((item) => item.subcategoryname.includes(subcategory));


    // getCategoryList();
    const isSubNameMatch = jobRolesTodo.some((item) => item?.toLowerCase() === jobRoles?.toLowerCase());
    // const isSubNameMatch = categoryList.some((item) => item.subcategoryname.includes(subcategory));
    if (jobRoles === '') {
      setPopupContentMalert('Please Enter Job Roles!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (description === '') {
      setPopupContentMalert('Please Enter Description!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (isSubNameMatch) {
      setPopupContentMalert('Already Added ! Please Enter Another Job Roles!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    }
    else if (isSubNameMatchDes) {
      setPopupContentMalert('Already Added ! Please Enter Another Description!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else {

      setJobRolesTodo([...jobRolesTodo, jobRoles]);
      setJobRoles('');


      setDescriptionTodo([...descriptionTodo, description]);
      setDescription('');
    }
  };

  const handleJobrolesTodoEdit = (index, newValue) => {
    const isDuplicate = jobRolesTodo.some((item, i) => i !== index && item.toLowerCase() === newValue.toLowerCase());
    const updatedTodos = [...jobRolesTodo];
    updatedTodos[index] = newValue;
    setJobRolesTodo(updatedTodos);
  };

  const deleteTodoJobroles = (index) => {
    const updatedTodos = [...jobRolesTodo];
    updatedTodos.splice(index, 1);
    setJobRolesTodo(updatedTodos);
  };

  const handleDescriptionTodoEdit = (index, newValue) => {
    const isDuplicate = descriptionTodo.some((item, i) => i !== index && item.toLowerCase() === newValue.toLowerCase());
    const updatedTodos = [...descriptionTodo];
    updatedTodos[index] = newValue;
    setDescriptionTodo(updatedTodos);
  };

  const deleteTodoDescription = (index) => {

    const updatedTodos = [...jobRolesTodo];
    updatedTodos.splice(index, 1);
    setJobRolesTodo(updatedTodos);


    const updatedTodosDes = [...descriptionTodo];
    updatedTodosDes.splice(index, 1);
    setDescriptionTodo(updatedTodosDes);
  };

  const addTodoEdit = () => {
    // getCategoryList();
    const isSubNameMatch = jobRolesTodoEdit.some((item) => item?.toLowerCase() === jobRolesEdit?.toLowerCase());
    // const isSubNameMatch = categoryList.some((item) => item.subcategoryname.includes(subcategory));
    if (jobRolesEdit === '') {
      setPopupContentMalert('Please Enter Job Roles!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (isSubNameMatch) {
      setPopupContentMalert('Already Added ! Please Enter Another Job Roles!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else {
      setJobRolesTodoEdit([...jobRolesTodoEdit, jobRolesEdit]);
      setJobRolesEdit('');
    }
  };

  const addTodoDescriptionEdit = () => {
    // getCategoryList();
    const isSubNameMatchDesc = descriptionTodoEdit.some((item) => item?.toLowerCase() === descriptionEdit?.toLowerCase());
    // const isSubNameMatch = categoryList.some((item) => item.subcategoryname.includes(subcategory));
    const isSubNameMatch = jobRolesTodoEdit.some((item) => item?.toLowerCase() === jobRolesEdit?.toLowerCase());
    // const isSubNameMatch = categoryList.some((item) => item.subcategoryname.includes(subcategory));
    if (jobRolesEdit === '') {
      setPopupContentMalert('Please Enter Job Roles!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (descriptionEdit === '') {
      setPopupContentMalert('Please Enter Description!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (isSubNameMatch) {
      setPopupContentMalert('Already Added ! Please Enter Another Job Roles!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (isSubNameMatchDesc) {
      setPopupContentMalert('Already Added ! Please Enter Another Description!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else {

      setJobRolesTodoEdit([...jobRolesTodoEdit, jobRolesEdit]);
      setJobRolesEdit('');

      setDescriptionTodoEdit([...descriptionTodoEdit, descriptionEdit]);
      setDescriptionEdit('');
    }
  };

  const handleJobrolesTodoforEdit = (index, newValue) => {
    const isDuplicate = jobRolesTodoEdit.some((item, i) => i !== index && item.toLowerCase() === newValue.toLowerCase());
    const updatedTodos = [...jobRolesTodoEdit];
    updatedTodos[index] = newValue;
    setJobRolesTodoEdit(updatedTodos);
  };

  const deleteTodoJobrolesEdit = (index) => {
    const updatedTodos = [...jobRolesTodoEdit];
    updatedTodos.splice(index, 1);
    setJobRolesTodoEdit(updatedTodos);
  };

  const handleDescriptionTodoForEdit = (index, newValue) => {
    const isDuplicate = descriptionTodoEdit.some((item, i) => i !== index && item.toLowerCase() === newValue.toLowerCase());
    const updatedTodos = [...descriptionTodoEdit];
    updatedTodos[index] = newValue;
    setDescriptionTodoEdit(updatedTodos);
  };

  const deleteTodoDescriptionEdit = (index) => {

    const updatedTodos = [...jobRolesTodoEdit];
    updatedTodos.splice(index, 1);
    setJobRolesTodoEdit(updatedTodos);


    const updatedTodosDesc = [...descriptionTodoEdit];
    updatedTodosDesc.splice(index, 1);
    setDescriptionTodoEdit(updatedTodosDesc);
  };

  return (
    <Box>
      <Headtitle title={'EMPLOYEE DESIGNATION REQUIREMENTS'} />
      {/* ****** Header Content ****** */}
      <PageHeading title="Employee Designation Requirements" modulename="Human Resources" submodulename="HR" mainpagename="HR Setup" subpagename="Employee Designation Requirements" subsubpagename="" />
      {isUserRoleCompare?.includes('aemployeedesignationrequirements') && (
        <>
          <Box sx={userStyle.dialogbox}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>Add Employee Designation Requirements</Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Mode<b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <Selects
                      options={modeOptions}
                      // styles={colourStyles}
                      value={{
                        label: filterState.mode === "" ? 'Please Select Mode' : filterState.mode,
                        value: filterState.mode === "" ? 'Please Select Mode' : filterState.mode,
                      }}
                      onChange={(e) => {
                        setFilterState((prev) => ({
                          ...prev,
                          mode: e.value,
                        }));
                        // setValueCompanyCat([]);
                        // setSelectedOptionsCompany([]);
                        // setValueBranchCat([]);
                        // setSelectedOptionsBranch([]);
                        // setValueUnitCat([]);
                        // setSelectedOptionsUnit([]);
                        // setValueTeamCat([]);
                        // setSelectedOptionsTeam([]);
                        // setValueDepartmentCat([]);
                        // setSelectedOptionsDepartment([]);
                        // setValueEmployeeCat([]);
                        // setSelectedOptionsEmployee([]);
                        // setDescriptionTodo([]);
                        // setJobRolesTodo([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Type<b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <Selects
                      options={TypeOptions}
                      // styles={colourStyles}
                      value={{
                        label: filterState.type ?? 'Please Select Type',
                        value: filterState.type ?? 'Please Select Type',
                      }}
                      onChange={(e) => {
                        setFilterState((prev) => ({
                          ...prev,
                          type: e.value,
                        }));
                        setValueCompanyCat([]);
                        setSelectedOptionsCompany([]);
                        setValueBranchCat([]);
                        setSelectedOptionsBranch([]);
                        setValueUnitCat([]);
                        setSelectedOptionsUnit([]);
                        setValueTeamCat([]);
                        setSelectedOptionsTeam([]);
                        setValueDepartmentCat([]);
                        setSelectedOptionsDepartment([]);
                        setValueEmployeeCat([]);
                        setSelectedOptionsEmployee([]);
                        setDescriptionTodo([]);
                        setJobRolesTodo([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <Typography>
                    Company<b style={{ color: 'red' }}>*</b>
                  </Typography>
                  <FormControl size="small" fullWidth>
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
                      }}
                      valueRenderer={customValueRendererCompany}
                      labelledBy="Please Select Company"
                    />
                  </FormControl>
                </Grid>
                {['Individual', 'Team']?.includes(filterState.type) ? (
                  <>
                    {/* Branch Unit Team */}
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          {' '}
                          Branch <b style={{ color: 'red' }}>*</b>
                        </Typography>
                        <MultiSelect
                          options={accessbranch
                            ?.filter((comp) => valueCompanyCat?.includes(comp.company))
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
                          }}
                          valueRenderer={customValueRendererBranch}
                          labelledBy="Please Select Branch"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          {' '}
                          Unit<b style={{ color: 'red' }}>*</b>
                        </Typography>
                        <MultiSelect
                          options={accessbranch
                            ?.filter((comp) => valueCompanyCat?.includes(comp.company) && valueBranchCat?.includes(comp.branch))
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
                          }}
                          valueRenderer={customValueRendererUnit}
                          labelledBy="Please Select Unit"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Team<b style={{ color: 'red' }}>*</b>
                        </Typography>
                        <MultiSelect
                          options={allTeam
                            ?.filter((u) => valueCompanyCat?.includes(u.company) && valueBranchCat?.includes(u.branch) && valueUnitCat?.includes(u.unit))
                            .map((u) => ({
                              ...u,
                              label: u.teamname,
                              value: u.teamname,
                            }))}
                          value={selectedOptionsTeam}
                          onChange={(e) => {
                            handleTeamChange(e);
                          }}
                          valueRenderer={customValueRendererTeam}
                          labelledBy="Please Select Team"
                        />
                      </FormControl>
                    </Grid>
                  </>
                ) : ['Department']?.includes(filterState.type) ? (
                  <>
                    {/* Department */}
                    <Grid item md={3} xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Department<b style={{ color: 'red' }}>*</b>
                        </Typography>
                        <MultiSelect
                          options={departmentOptions}
                          value={selectedOptionsDepartment}
                          onChange={(e) => {
                            handleDepartmentChange(e);
                          }}
                          valueRenderer={customValueRendererDepartment}
                          labelledBy="Please Select Department"
                        />
                      </FormControl>
                    </Grid>
                  </>
                ) : ['Designation']?.includes(filterState.type) ? (
                  <>
                    {/* Department */}
                    <Grid item md={3} xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Designation<b style={{ color: 'red' }}>*</b>
                        </Typography>
                        <MultiSelect
                          options={designationOptions}
                          value={selectedOptionsDesignation}
                          onChange={(e) => {
                            handleDesignationChange(e);
                          }}
                          valueRenderer={customValueRendererDesignation}
                          labelledBy="Please Select Designation"
                        />
                      </FormControl>
                    </Grid>
                  </>
                ) : ['Branch']?.includes(filterState.type) ? (
                  <>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          {' '}
                          Branch <b style={{ color: 'red' }}>*</b>
                        </Typography>
                        <MultiSelect
                          options={accessbranch
                            ?.filter((comp) => valueCompanyCat?.includes(comp.company))
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
                          }}
                          valueRenderer={customValueRendererBranch}
                          labelledBy="Please Select Branch"
                        />
                      </FormControl>
                    </Grid>
                  </>
                ) : ['Unit']?.includes(filterState.type) ? (
                  <>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          {' '}
                          Branch<b style={{ color: 'red' }}>*</b>
                        </Typography>
                        <MultiSelect
                          options={accessbranch
                            ?.filter((comp) => valueCompanyCat?.includes(comp.company))
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
                          }}
                          valueRenderer={customValueRendererBranch}
                          labelledBy="Please Select Branch"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          {' '}
                          Unit <b style={{ color: 'red' }}>*</b>
                        </Typography>
                        <MultiSelect
                          options={accessbranch
                            ?.filter((comp) => valueCompanyCat?.includes(comp.company) && valueBranchCat?.includes(comp.branch))
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
                          }}
                          valueRenderer={customValueRendererUnit}
                          labelledBy="Please Select Unit"
                        />
                      </FormControl>
                    </Grid>
                  </>
                ) : (
                  ''
                )}
                {['Individual']?.includes(filterState.type) && (
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Employee<b style={{ color: 'red' }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={isAllUsers
                          ?.filter((u) => valueCompanyCat?.includes(u.company) && valueBranchCat?.includes(u.branch) && valueUnitCat?.includes(u.unit) && valueTeamCat?.includes(u.team))
                          .map((u) => ({
                            label: u.companyname,
                            value: u.companyname,
                          }))}
                        value={selectedOptionsEmployee}
                        onChange={(e) => {
                          handleEmployeeChange(e);
                        }}
                        valueRenderer={customValueRendererEmployee}
                        labelledBy="Please Select Employee"
                      />
                    </FormControl>
                  </Grid>
                )}
                <Grid item md={3} sm={12} xs={12} sx={{ display: 'flex' }}>
                  <FormControl fullWidth size="small">
                    {' '}
                    <Typography>
                      {' '}
                      Job Roles <b style={{ color: 'red' }}>*</b>{' '}
                    </Typography>
                    <OutlinedInput id="component-outlined" placeholder="Please Enter Job Roles" value={jobRoles} onChange={(e) => setJobRoles(e.target.value)} />
                  </FormControl>
                  {/* &emsp;
                  <Button variant="contained" color="success" onClick={addTodo} type="button" sx={{ height: '30px', minWidth: '30px', marginTop: '28px', padding: '6px 10px' }}>
                    <FaPlus />
                  </Button> */}
                </Grid>
                <Grid item md={3} sm={12} xs={12} sx={{ display: 'flex' }}>
                  <FormControl fullWidth size="small">
                    {' '}
                    <Typography>
                      {' '}
                      Description <b style={{ color: 'red' }}>*</b>{' '}
                    </Typography>
                    <OutlinedInput id="component-outlined" placeholder="Please Enter Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                  </FormControl>
                  &emsp;
                  <Button variant="contained" color="success" onClick={addTodoDescription} type="button" sx={{ height: '30px', minWidth: '30px', marginTop: '28px', padding: '6px 10px' }}>
                    <FaPlus />
                  </Button>
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                  <Grid container spacing={2}>
                    <Grid item md={3} sm={12} xs={12}>
                      {jobRolesTodo.length > 0 && (
                        <ul type="none">
                          {jobRolesTodo.map((item, index) => {
                            return (
                              <li key={index}>
                                <br />
                                <Grid sx={{ display: 'flex' }}>
                                  <FormControl fullWidth size="small">
                                    <Typography>
                                      Job Roles <b style={{ color: 'red' }}>*</b>
                                    </Typography>
                                    <OutlinedInput id="component-outlined" placeholder="Please Enter Job Roles" value={item} onChange={(e) => handleJobrolesTodoEdit(index, e.target.value)} />
                                  </FormControl>
                                  {/* &emsp;
                              <Button variant="contained" color="error" type="button" onClick={(e) => deleteTodoJobroles(index)} sx={{ height: '30px', minWidth: '30px', marginTop: '28px', padding: '6px 10px' }}>
                                <AiOutlineClose />{' '}
                              </Button> */}
                                </Grid>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      {descriptionTodo.length > 0 && (
                        <ul type="none">
                          {descriptionTodo.map((item, index) => {
                            return (
                              <li key={index}>
                                <br />
                                <Grid sx={{ display: 'flex' }}>
                                  <FormControl fullWidth size="small">
                                    <Typography>
                                      Description <b style={{ color: 'red' }}>*</b>
                                    </Typography>
                                    <OutlinedInput id="component-outlined" placeholder="Please Enter Description" value={item} onChange={(e) => handleDescriptionTodoEdit(index, e.target.value)} />
                                  </FormControl>
                                  &emsp;
                                  <Button variant="contained" color="error" type="button" onClick={(e) => deleteTodoDescription(index)} sx={{ height: '30px', minWidth: '30px', marginTop: '28px', padding: '6px 10px' }}>
                                    <AiOutlineClose />{' '}
                                  </Button>
                                </Grid>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item md={12} sm={12} xs={12}></Grid>
                <Grid item md={4} sm={12} xs={12}>
                  <Typography>&nbsp;</Typography>
                  <Grid
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: '15px',
                    }}
                  >
                    <Button sx={buttonStyles.buttonsubmit} onClick={handleSubmit} disabled={isBtn}>
                      SAVE
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
      <Box>
        {/* Edit DIALOG */}
        <Dialog
          open={isEditOpen}
          onClose={handleCloseModEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth={true}
          maxWidth="md"
          sx={{
            marginTop: '80px',
          }}
        >
          <Box sx={{ padding: '20px 50px' }}>
            <>
              <form onSubmit={editSubmit}>
                {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}
                <Grid container spacing={2}>
                  <Grid item md={12} xs={12} sm={12}>
                    <Typography sx={userStyle.HeaderText}>Edit Employee Designation Requirements</Typography>
                  </Grid>
                </Grid>
                <br />
                <Grid container spacing={2}>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Mode<b style={{ color: 'red' }}>*</b>
                      </Typography>
                      <Selects
                        options={modeOptions}
                        // styles={colourStyles}
                        value={{
                          label: filterStateEdit.mode === "" ? 'Please Select Mode' : filterStateEdit.mode,
                          value: filterStateEdit.mode === "" ? 'Please Select Mode' : filterStateEdit.mode,
                        }}
                        onChange={(e) => {
                          setFilterStateEdit((prev) => ({
                            ...prev,
                            mode: e.value,
                          }));
                          // setValueCompanyCatEdit([]);
                          // setSelectedOptionsCompanyEdit([]);
                          // setValueBranchCatEdit([]);
                          // setSelectedOptionsBranchEdit([]);
                          // setValueUnitCatEdit([]);
                          // setSelectedOptionsUnitEdit([]);
                          // setValueTeamCatEdit([]);
                          // setSelectedOptionsTeamEdit([]);
                          // setValueDepartmentCatEdit([]);
                          // setSelectedOptionsDepartmentEdit([]);
                          // setValueEmployeeCatEdit([]);
                          // setSelectedOptionsEmployeeEdit([]);
                          // setDescriptionTodoEdit([]);
                          // setJobRolesTodoEdit([]);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Type<b style={{ color: 'red' }}>*</b>
                      </Typography>
                      <Selects
                        options={TypeOptions}
                        // styles={colourStyles}
                        value={{
                          label: filterStateEdit.type ?? 'Please Select Type',
                          value: filterStateEdit.type ?? 'Please Select Type',
                        }}
                        onChange={(e) => {
                          setFilterStateEdit((prev) => ({
                            ...prev,
                            type: e.value,
                          }));
                          setValueCompanyCatEdit([]);
                          setSelectedOptionsCompanyEdit([]);
                          setValueBranchCatEdit([]);
                          setSelectedOptionsBranchEdit([]);
                          setValueUnitCatEdit([]);
                          setSelectedOptionsUnitEdit([]);
                          setValueTeamCatEdit([]);
                          setSelectedOptionsTeamEdit([]);
                          setValueDepartmentCatEdit([]);
                          setSelectedOptionsDepartmentEdit([]);
                          setValueEmployeeCatEdit([]);
                          setSelectedOptionsEmployeeEdit([]);
                          setDescriptionTodoEdit([]);
                          setJobRolesTodoEdit([]);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <Typography>
                      Company<b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <FormControl size="small" fullWidth>
                      <MultiSelect
                        options={accessbranch
                          ?.map((data) => ({
                            label: data.company,
                            value: data.company,
                          }))
                          .filter((item, index, self) => {
                            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                          })}
                        value={selectedOptionsCompanyEdit}
                        onChange={(e) => {
                          handleCompanyChangeEdit(e);
                        }}
                        valueRenderer={customValueRendererCompanyEdit}
                        labelledBy="Please Select Company"
                      />
                    </FormControl>
                  </Grid>
                  {['Individual', 'Team']?.includes(filterStateEdit.type) ? (
                    <>
                      {/* Branch Unit Team */}
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            {' '}
                            Branch <b style={{ color: 'red' }}>*</b>
                          </Typography>
                          <MultiSelect
                            options={accessbranch
                              ?.filter((comp) => valueCompanyCatEdit?.includes(comp.company))
                              ?.map((data) => ({
                                label: data.branch,
                                value: data.branch,
                              }))
                              .filter((item, index, self) => {
                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                              })}
                            value={selectedOptionsBranchEdit}
                            onChange={(e) => {
                              handleBranchChangeEdit(e);
                            }}
                            valueRenderer={customValueRendererBranchEdit}
                            labelledBy="Please Select Branch"
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            {' '}
                            Unit<b style={{ color: 'red' }}>*</b>
                          </Typography>
                          <MultiSelect
                            options={accessbranch
                              ?.filter((comp) => valueCompanyCatEdit?.includes(comp.company) && valueBranchCatEdit?.includes(comp.branch))
                              ?.map((data) => ({
                                label: data.unit,
                                value: data.unit,
                              }))
                              .filter((item, index, self) => {
                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                              })}
                            value={selectedOptionsUnitEdit}
                            onChange={(e) => {
                              handleUnitChangeEdit(e);
                            }}
                            valueRenderer={customValueRendererUnitEdit}
                            labelledBy="Please Select Unit"
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Team<b style={{ color: 'red' }}>*</b>
                          </Typography>
                          <MultiSelect
                            options={allTeam
                              ?.filter((u) => valueCompanyCatEdit?.includes(u.company) && valueBranchCatEdit?.includes(u.branch) && valueUnitCatEdit?.includes(u.unit))
                              .map((u) => ({
                                ...u,
                                label: u.teamname,
                                value: u.teamname,
                              }))}
                            value={selectedOptionsTeamEdit}
                            onChange={(e) => {
                              handleTeamChangeEdit(e);
                            }}
                            valueRenderer={customValueRendererTeamEdit}
                            labelledBy="Please Select Team"
                          />
                        </FormControl>
                      </Grid>
                    </>
                  ) : ['Department']?.includes(filterStateEdit.type) ? (
                    <>
                      {/* Department */}
                      <Grid item md={3} xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Department<b style={{ color: 'red' }}>*</b>
                          </Typography>
                          <MultiSelect
                            options={departmentOptions}
                            value={selectedOptionsDepartmentEdit}
                            onChange={(e) => {
                              handleDepartmentChangeEdit(e);
                            }}
                            valueRenderer={customValueRendererDepartmentEdit}
                            labelledBy="Please Select Department"
                          />
                        </FormControl>
                      </Grid>
                    </>
                  ) : ['Designation']?.includes(filterStateEdit.type) ? (
                    <>
                      {/* Department */}
                      <Grid item md={3} xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Designation<b style={{ color: 'red' }}>*</b>
                          </Typography>
                          <MultiSelect
                            options={designationOptions}
                            value={selectedOptionsDesignationEdit}
                            onChange={(e) => {
                              handleDesignationChangeEdit(e);
                            }}
                            valueRenderer={customValueRendererDesignationEdit}
                            labelledBy="Please Select Designation"
                          />
                        </FormControl>
                      </Grid>
                    </>
                  ) : ['Branch']?.includes(filterStateEdit.type) ? (
                    <>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            {' '}
                            Branch <b style={{ color: 'red' }}>*</b>
                          </Typography>
                          <MultiSelect
                            options={accessbranch
                              ?.filter((comp) => valueCompanyCatEdit?.includes(comp.company))
                              ?.map((data) => ({
                                label: data.branch,
                                value: data.branch,
                              }))
                              .filter((item, index, self) => {
                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                              })}
                            value={selectedOptionsBranchEdit}
                            onChange={(e) => {
                              handleBranchChangeEdit(e);
                            }}
                            valueRenderer={customValueRendererBranchEdit}
                            labelledBy="Please Select Branch"
                          />
                        </FormControl>
                      </Grid>
                    </>
                  ) : ['Unit']?.includes(filterStateEdit.type) ? (
                    <>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            {' '}
                            Branch<b style={{ color: 'red' }}>*</b>
                          </Typography>
                          <MultiSelect
                            options={accessbranch
                              ?.filter((comp) => valueCompanyCatEdit?.includes(comp.company))
                              ?.map((data) => ({
                                label: data.branch,
                                value: data.branch,
                              }))
                              .filter((item, index, self) => {
                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                              })}
                            value={selectedOptionsBranchEdit}
                            onChange={(e) => {
                              handleBranchChangeEdit(e);
                            }}
                            valueRenderer={customValueRendererBranchEdit}
                            labelledBy="Please Select Branch"
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            {' '}
                            Unit <b style={{ color: 'red' }}>*</b>
                          </Typography>
                          <MultiSelect
                            options={accessbranch
                              ?.filter((comp) => valueCompanyCatEdit?.includes(comp.company) && valueBranchCatEdit?.includes(comp.branch))
                              ?.map((data) => ({
                                label: data.unit,
                                value: data.unit,
                              }))
                              .filter((item, index, self) => {
                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                              })}
                            value={selectedOptionsUnitEdit}
                            onChange={(e) => {
                              handleUnitChangeEdit(e);
                            }}
                            valueRenderer={customValueRendererUnitEdit}
                            labelledBy="Please Select Unit"
                          />
                        </FormControl>
                      </Grid>
                    </>
                  ) : (
                    ''
                  )}
                  {['Individual']?.includes(filterStateEdit.type) && (
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Employee<b style={{ color: 'red' }}>*</b>
                        </Typography>
                        <MultiSelect
                          options={isAllUsers
                            ?.filter((u) => valueCompanyCatEdit?.includes(u.company) && valueBranchCatEdit?.includes(u.branch) && valueUnitCatEdit?.includes(u.unit) && valueTeamCatEdit?.includes(u.team))
                            .map((u) => ({
                              label: u.companyname,
                              value: u.companyname,
                            }))}
                          value={selectedOptionsEmployeeEdit}
                          onChange={(e) => {
                            handleEmployeeChangeEdit(e);
                          }}
                          valueRenderer={customValueRendererEmployeeEdit}
                          labelledBy="Please Select Employee"
                        />
                      </FormControl>
                    </Grid>
                  )}
                  <Grid item md={3} sm={12} xs={12} sx={{ display: 'flex' }}>
                    <FormControl fullWidth size="small">
                      {' '}
                      <Typography>
                        {' '}
                        Job Roles <b style={{ color: 'red' }}>*</b>{' '}
                      </Typography>
                      <OutlinedInput id="component-outlined" placeholder="Please Enter Job Roles" value={jobRolesEdit} onChange={(e) => setJobRolesEdit(e.target.value)} />
                    </FormControl>
                    {/* &emsp;
                    <Button variant="contained" color="success" onClick={addTodoEdit} type="button" sx={{ height: '30px', minWidth: '30px', marginTop: '28px', padding: '6px 10px' }}>
                      <FaPlus />
                    </Button> */}
                  </Grid>
                  <Grid item md={3} sm={12} xs={12} sx={{ display: 'flex' }}>
                    <FormControl fullWidth size="small">
                      {' '}
                      <Typography>
                        {' '}
                        Description <b style={{ color: 'red' }}>*</b>{' '}
                      </Typography>
                      <OutlinedInput id="component-outlined" placeholder="Please Enter Description" value={descriptionEdit} onChange={(e) => setDescriptionEdit(e.target.value)} />
                    </FormControl>
                    &emsp;
                    <Button variant="contained" color="success" onClick={addTodoDescriptionEdit} type="button" sx={{ height: '30px', minWidth: '30px', marginTop: '28px', padding: '6px 10px' }}>
                      <FaPlus />
                    </Button>
                  </Grid>
                  <Grid item md={12} sm={12} xs={12}>
                    <Grid container spacing={2}>
                      <Grid item md={3} sm={12} xs={12}>
                        {jobRolesTodoEdit.length > 0 && (
                          <ul type="none">
                            {jobRolesTodoEdit.map((item, index) => {
                              return (
                                <li key={index}>
                                  <br />
                                  <Grid sx={{ display: 'flex' }}>
                                    <FormControl fullWidth size="small">
                                      <Typography>
                                        Job Roles <b style={{ color: 'red' }}>*</b>
                                      </Typography>
                                      <OutlinedInput id="component-outlined" placeholder="Please Enter Description" value={item} onChange={(e) => handleJobrolesTodoforEdit(index, e.target.value)} />
                                    </FormControl>
                                    {/* &emsp;
                                <Button variant="contained" color="error" type="button" onClick={(e) => deleteTodoJobrolesEdit(index)} sx={{ height: '30px', minWidth: '30px', marginTop: '28px', padding: '6px 10px' }}>
                                  <AiOutlineClose />{' '}
                                </Button> */}
                                  </Grid>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </Grid>
                      <Grid item md={3} sm={12} xs={12}>
                        {descriptionTodoEdit.length > 0 && (
                          <ul type="none">
                            {descriptionTodoEdit.map((item, index) => {
                              return (
                                <li key={index}>
                                  <br />
                                  <Grid sx={{ display: 'flex' }}>
                                    <FormControl fullWidth size="small">
                                      <Typography>
                                        Description <b style={{ color: 'red' }}>*</b>
                                      </Typography>
                                      <OutlinedInput id="component-outlined" placeholder="Please Enter Description" value={item} onChange={(e) => handleDescriptionTodoForEdit(index, e.target.value)} />
                                    </FormControl>
                                    &emsp;
                                    <Button variant="contained" color="error" type="button" onClick={(e) => deleteTodoDescriptionEdit(index)} sx={{ height: '30px', minWidth: '30px', marginTop: '28px', padding: '6px 10px' }}>
                                      <AiOutlineClose />{' '}
                                    </Button>
                                  </Grid>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <br />
                <br />
                <Grid container spacing={2}>
                  <Grid item md={6} xs={6} sm={6}>
                    <Button sx={buttonStyles.buttonsubmit} type="submit" onClick={editSubmit}>
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
              </form>
            </>
          </Box>
        </Dialog>
      </Box>
      <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes('lemployeedesignationrequirements') && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>Employee Designation Requirements List</Typography>
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
                    <MenuItem value={totalProjects}>All</MenuItem>
                  </Select>
                </Box>
              </Grid>
              <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Box>
                  {isUserRoleCompare?.includes('excelemployeedesignationrequirements') && (
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
                  {isUserRoleCompare?.includes('csvemployeedesignationrequirements') && (
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
                  {isUserRoleCompare?.includes('printemployeedesignationrequirements') && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint /> &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes('pdfemployeedesignationrequirements') && (
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
                  {isUserRoleCompare?.includes('imageemployeedesignationrequirements') && (
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
            {isUserRoleCompare?.includes('bdemployeedesignationrequirements') && (
              <Button sx={buttonStyles.buttonbulkdelete} onClick={handleClickOpenalert}>
                Bulk Delete
              </Button>
            )}
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
                        fetchTaskcategoryForPagination();
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
      {/* view model */}
      <Dialog open={openview} onClose={handleClickOpenview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md" fullWidth={true} sx={{ marginTop: '80px' }}>
        <Box sx={{ padding: '20px 50px' }}>
          <>
            <Typography sx={userStyle.HeaderText}> View Employee Designation Requirements</Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Mode</Typography>
                  <Typography>{nonProductionEdit?.mode && nonProductionEdit?.mode?.length > 0 ? nonProductionEdit?.mode?.join(",") : ""}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Type</Typography>
                  <Typography>{nonProductionEdit.type}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Company</Typography>
                  <Typography>{nonProductionEdit.company?.map((t, i) => `${i + 1 + '. '}` + t).join('\n')}</Typography>
                </FormControl>
              </Grid>
              {['Individual', 'Team']?.includes(nonProductionEdit.type) ? (
                <>
                  {/* Branch Unit Team */}
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Branch</Typography>
                      <Typography>{nonProductionEdit.branch?.map((t, i) => `${i + 1 + '. '}` + t).join('\n')}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Unit</Typography>
                      <Typography>{nonProductionEdit.unit?.map((t, i) => `${i + 1 + '. '}` + t).join('\n')}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Team</Typography>
                      <Typography>{nonProductionEdit.team?.map((t, i) => `${i + 1 + '. '}` + t).join('\n')}</Typography>
                    </FormControl>
                  </Grid>
                </>
              ) : ['Department']?.includes(nonProductionEdit.type) ? (
                <>
                  {/* Department */}
                  <Grid item md={3} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Department</Typography>
                      <Typography>{nonProductionEdit.department?.map((t, i) => `${i + 1 + '. '}` + t).join('\n')}</Typography>
                    </FormControl>
                  </Grid>
                </>
              ) : ['Designation']?.includes(nonProductionEdit.type) ? (
                <>
                  {/* Department */}
                  <Grid item md={3} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Designation</Typography>
                      <Typography>{nonProductionEdit.designation?.map((t, i) => `${i + 1 + '. '}` + t).join('\n')}</Typography>
                    </FormControl>
                  </Grid>
                </>
              ) : ['Branch']?.includes(nonProductionEdit.type) ? (
                <>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Branch</Typography>
                      <Typography>{nonProductionEdit.branch?.map((t, i) => `${i + 1 + '. '}` + t).join('\n')}</Typography>
                    </FormControl>
                  </Grid>
                </>
              ) : ['Unit']?.includes(nonProductionEdit.type) ? (
                <>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Branch</Typography>
                      <Typography>{nonProductionEdit.branch?.map((t, i) => `${i + 1 + '. '}` + t).join('\n')}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Unit</Typography>
                      <Typography>{nonProductionEdit.unit?.map((t, i) => `${i + 1 + '. '}` + t).join('\n')}</Typography>
                    </FormControl>
                  </Grid>
                </>
              ) : (
                ''
              )}
              {['Individual']?.includes(nonProductionEdit.type) && (
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Employee</Typography>
                    <Typography>{nonProductionEdit.employee?.map((t, i) => `${i + 1 + '. '}` + t).join('\n')}</Typography>
                  </FormControl>
                </Grid>
              )}
              <Grid item xs={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6" gutterBottom>Job Roles & Descriptions</Typography>
                  {nonProductionEdit.jobroles?.map((role, index) => (
                    <Box key={index} mb={2}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {index + 1}. {role}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" ml={2}>
                        {nonProductionEdit.description?.[index] || "No description provided."}
                      </Typography>
                    </Box>
                  ))}
                </FormControl>
              </Grid>

              {/* <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Job Roles</Typography>
                  <Typography>{nonProductionEdit.jobroles?.map((t, i) => `${i + 1 + '. '}` + t).join('\n')}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Description </Typography>
                  <Typography>{nonProductionEdit.description?.map((t, i) => `${i + 1 + '. '}` + t).join('\n')}</Typography>
                </FormControl>
              </Grid> */}
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Button sx={buttonStyles.btncancel} onClick={handleCloseview}>
                {' '}
                Back{' '}
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>
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
        filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
        itemsTwo={allRolesandResponAllExports ?? []}
        filename={'Employee Designation Requirements'}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      <InfoPopup openInfo={openInfo} handleCloseinfo={handleCloseinfo} heading="Employee Designation Requirements Info" addedby={addedby} updateby={updateby} />
      <DeleteConfirmation open={isDeleteOpen} onClose={handleCloseMod} onConfirm={delTaskCategory} title="Are you sure?" confirmButtonText="Yes" cancelButtonText="Cancel" />
      <DeleteConfirmation open={isDeleteOpencheckbox} onClose={handleCloseModcheckbox} onConfirm={delTaskCatecheckbox} title="Are you sure?" confirmButtonText="Yes" cancelButtonText="Cancel" />
      <PleaseSelectRow open={isDeleteOpenalert} onClose={handleCloseModalert} message="Please Select any Row" iconColor="orange" buttonText="OK" />
    </Box>
  );
}
export default RolesAndResponsiblities;
