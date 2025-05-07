import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, FormControl, Grid, IconButton, InputLabel, List, ListItem, ListItemText, MenuItem, OutlinedInput, Paper, Select, Table, TableBody, TableContainer, TableHead, TextareaAutosize, TextField, Typography, Chip } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import MuiInput from '@mui/material/Input';
import Popover from '@mui/material/Popover';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/system';
import axios from 'axios';
import ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment-timezone';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from 'react-icons/fa';
import { ThreeDots } from 'react-loader-spinner';
import Selects from 'react-select';
import { useReactToPrint } from 'react-to-print';
import { handleApiError } from '../../../components/Errorhandling';
import Headtitle from '../../../components/Headtitle';
import { StyledTableCell, StyledTableRow } from '../../../components/Table';
import { AuthContext, UserRoleAccessContext } from '../../../context/Appcontext';
import { colourStyles, userStyle } from '../../../pageStyle';
import { SERVICE } from '../../../services/Baseservice';
import Webcamimage from './Webcamprofile';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

import { LoadingButton } from '@mui/lab';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import AlertDialog from '../../../components/Alert';
import { DeleteConfirmation } from '../../../components/DeleteConfirmation.js';

import Switch from '@mui/material/Switch';

import ButtonGroup from '@mui/material/ButtonGroup';
import domtoimage from 'dom-to-image';
import { MultiSelect } from 'react-multi-select-component';
import AggregatedSearchBar from '../../../components/AggregatedSearchBar';
import AggridTable from '../../../components/AggridTable';
import MessageAlert from '../../../components/MessageAlert';
import PageHeading from '../../../components/PageHeading';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';

const Loader = ({ loading, message }) => {
  return (
    <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 999 }} open={loading}>
      <div style={{ textAlign: 'center' }}>
        <CircularProgress sx={{ color: '#edf1f7' }} />
        <Typography variant="h6" sx={{ mt: 2, color: '#edf1f7' }}>
          {message}
        </Typography>
      </div>
    </Backdrop>
  );
};

const Input = styled(MuiInput)(({ theme }) => ({
  '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
    display: 'none !important',
  },
  '& input[type=number]': {
    MozAppearance: 'textfield',
  },
}));

function PendingReleaveExitList() {
  const [openQueue, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);

  const [overallItems, setOverallItems] = useState([]);

  const [hierarchyConditions, setHierarchyConditions] = useState([]);
  const [isHandleChange, setIsHandleChange] = useState(false);
  const [searchedString, setSearchedString] = useState('');

  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState('');
  const [popupSeverityMalert, setPopupSeverityMalert] = useState('');
  const handleClickOpenPopupMalert = () => {
    setOpenPopupMalert(true);
    setIsBoarding(true);
  };
  const handleClosePopupMalert = () => {
    setOpenPopupMalert(false);
  };

  const [deletebtn, setDeleteBtn] = useState(false);
  const [deletebtnDisable, setDeleteBtnDisable] = useState(true);
  const [openPopup, setOpenPopup] = useState(false);
  const [popupContent, setPopupContent] = useState('');
  const [popupSeverity, setPopupSeverity] = useState('');
  const handleClickOpenPopup = () => {
    setOpenPopup(true);
  };
  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  //Delete model
  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
  };

  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Please Wait...!');

  const handleCopy = (message) => {
    NotificationManager.success(`${message} 👍`, '', 2000);
  };

  const [isAssigned, setIsAssigned] = useState(false);

  const isChecklistAssigned = async () => {
    try {
      const res = await axios.get(`${SERVICE.MODULEBASEDASSIGNMENTCHECKLIST}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      // Check if the response contains the required data
      const isAvailable = res?.data?.checklistverificationmasters?.some((item) => item.subsubpage === 'Action Employee List');
      if (isAvailable) {
        setIsAssigned(true);
      } else {
        setIsAssigned(false);
      }
    } catch (err) {
      console.error('API Error:', err); // For easier debugging
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const [employees, setEmployees] = useState([]);
  const [clientId, setClientId] = useState([]);
  const [employeesList, setEmployeesList] = useState([]);
  const [replaceName, setReplaceName] = useState('Please Choose Replace name');

  const { isUserRoleAccess, isUserRoleCompare, alldesignation, allUsersData, pageName, setPageName, allTeam, buttonStyles, isAssignBranch } = useContext(UserRoleAccessContext);

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

  useEffect(() => {
    getapi();
    isChecklistAssigned();
  }, []);

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String('Pending Releave Exit List'),
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

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ''; // This is required for Chrome support
  };

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener('beforeunload', beforeUnloadHandler);
    return () => {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
    };
  }, []);

  const [filterState, setFilterState] = useState({
    type: 'Individual',
    employeestatus: 'Please Select Employee Status',
    employee: 'Please Select Employee',
    branch: '',
    unit: '',
    team: '',
  });
  const TypeOptions = [
    { label: 'Individual', value: 'Individual' },
    { label: 'Department', value: 'Department' },
    { label: 'Company', value: 'Company' },
    { label: 'Branch', value: 'Branch' },
    { label: 'Unit', value: 'Unit' },
    { label: 'Team', value: 'Team' },
  ];
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
  useEffect(() => {
    fetchDepartments();
  }, []);

  //department multiselect
  const [selectedOptionsDepartment, setSelectedOptionsDepartment] = useState([]);
  let [valueDepartmentCat, setValueDepartmentCat] = useState([]);
  const [valueEmp, setValueEmp] = React.useState([]); // State for employees
  const [isBoxFocused, setIsBoxFocused] = React.useState(false); // Track focus state

  const handleDepartmentChange = (options) => {
    setValueDepartmentCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsDepartment(options);
    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);
    setValueEmp([]);
  };

  const customValueRendererDepartment = (valueDepartmentCat, _categoryname) => {
    return valueDepartmentCat?.length ? valueDepartmentCat.map(({ label }) => label)?.join(', ') : 'Please Select Department';
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
    setValueEmp(
      options.map((a, index) => {
        return a.value;
      })
    );

    setSelectedOptionsEmployee(options);
  };

  const customValueRendererEmployee = (valueEmployeeCat, _categoryname) => {
    return valueEmployeeCat?.length ? valueEmployeeCat.map(({ label }) => label)?.join(', ') : 'Please Select Employee';
  };

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
    setValueEmp([]);
    setFilterState((prev) => ({
      ...prev,
      employee: 'Please Select Employee',
      branch: '',
      unit: '',
      team: '',
    }));
  };

  const customValueRendererCompany = (valueCompanyCat, _categoryname) => {
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
    setFilterState((prev) => ({
      ...prev,
      employee: 'Please Select Employee',
      branch: '',
      unit: '',
      team: '',
    }));
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
    setValueTeamCat([]);
    setSelectedOptionsTeam([]);
    setFilterState((prev) => ({
      ...prev,
      employee: 'Please Select Employee',
      branch: '',
      unit: '',
      team: '',
    }));
  };

  const customValueRendererUnit = (valueUnitCat, _categoryname) => {
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
    setFilterState((prev) => ({
      ...prev,
      employee: 'Please Select Employee',
      branch: '',
      unit: '',
      team: '',
    }));
  };

  const customValueRendererTeam = (valueTeamCat, _categoryname) => {
    return valueTeamCat?.length ? valueTeamCat.map(({ label }) => label)?.join(', ') : 'Please Select Team';
  };

  //------------------------------------------------------------------------------------------
  const [selectedOptionsCompanyNew, setSelectedOptionsCompanyNew] = useState([]);
  let [valueCompanyCatNew, setValueCompanyCatNew] = useState([]);

  const handleCompanyChangeNew = (options) => {
    setValueCompanyCatNew(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCompanyNew(options);
    setValueBranchCatNew([]);
    setSelectedOptionsBranchNew([]);
    setValueUnitCatNew([]);
    setSelectedOptionsUnitNew([]);
    setValueTeamCatNew([]);
    setSelectedOptionsTeamNew([]);
  };

  const customValueRendererCompanyNew = (valueCompanyCatNew, _categoryname) => {
    return valueCompanyCatNew?.length ? valueCompanyCatNew.map(({ label }) => label)?.join(', ') : 'Please Select Company';
  };

  //branch multiselect
  const [selectedOptionsBranchNew, setSelectedOptionsBranchNew] = useState([]);
  let [valueBranchCatNew, setValueBranchCatNew] = useState([]);

  const handleBranchChangeNew = (options) => {
    setValueBranchCatNew(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsBranchNew(options);
    setValueUnitCatNew([]);
    setSelectedOptionsUnitNew([]);
    setValueTeamCatNew([]);
    setSelectedOptionsTeamNew([]);
  };

  const customValueRendererBranchNew = (valueBranchCatNew, _categoryname) => {
    return valueBranchCatNew?.length ? valueBranchCatNew.map(({ label }) => label)?.join(', ') : 'Please Select Branch';
  };

  //unit multiselect
  const [selectedOptionsUnitNew, setSelectedOptionsUnitNew] = useState([]);
  let [valueUnitCatNew, setValueUnitCatNew] = useState([]);

  const handleUnitChangeNew = (options) => {
    setValueUnitCatNew(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsUnitNew(options);
    setValueTeamCatNew([]);
    setSelectedOptionsTeamNew([]);
  };

  const customValueRendererUnitNew = (valueUnitCatNew, _categoryname) => {
    return valueUnitCatNew?.length ? valueUnitCatNew.map(({ label }) => label)?.join(', ') : 'Please Select Unit';
  };

  //team multiselect
  const [selectedOptionsTeamNew, setSelectedOptionsTeamNew] = useState([]);
  let [valueTeamCatNew, setValueTeamCatNew] = useState([]);

  const handleTeamChangeNew = (options) => {
    setValueTeamCatNew(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsTeamNew(options);
  };

  const customValueRendererTeamNew = (valueTeamCatNew, _categoryname) => {
    return valueTeamCatNew?.length ? valueTeamCatNew.map(({ label }) => label)?.join(', ') : 'Please Select Team';
  };

  const [allAssignCompany, setAllAssignCompany] = useState([]);
  const [allAssignBranch, setAllAssignBranch] = useState([]);
  const [allAssignUnit, setAllAssignUnit] = useState([]);

  const handleFilter = () => {
    setIsBoarding(false);
    if (filterState?.type === 'Please Select Type' || filterState?.type === '') {
      setPopupContentMalert('Please Select Type!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (selectedOptionsCompany?.length === 0) {
      setPopupContentMalert('Please Select Company!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (['Individual', 'Branch', 'Unit', 'Team']?.includes(filterState?.type) && selectedOptionsBranch?.length === 0) {
      setPopupContentMalert('Please Select Branch!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (['Individual', 'Unit', 'Team']?.includes(filterState?.type) && selectedOptionsUnit?.length === 0) {
      setPopupContentMalert('Please Select Unit!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (['Individual', 'Team']?.includes(filterState?.type) && selectedOptionsTeam?.length === 0) {
      setPopupContentMalert('Please Select Team!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (filterState?.type === 'Individual' && selectedOptionsEmployee?.length === 0) {
      setPopupContentMalert('Please Select Employee!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (filterState?.type === 'Department' && selectedOptionsDepartment?.length === 0) {
      setPopupContentMalert('Please Select Department!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else {
      setSearchQuery('');

    }
  };
  const [notEmployees, setNotEmployees] = useState([]);
  //auto select all dropdowns
  const handleAutoSelect = async () => {
    setPageName(!pageName);
    try {
      let filteredDatas = allUsersData?.filter((item) => item?.workmode !== 'Internship');
      setNotEmployees(filteredDatas);
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

      let mappedTeam = allTeam
        ?.filter((u) => selectedCompany?.includes(u.company) && selectedBranch?.includes(u.branch) && selectedUnit?.includes(u.unit))
        .map((u) => ({
          label: u.teamname,
          value: u.teamname,
        }));

      let selectedTeam = allTeam?.filter((u) => selectedCompany?.includes(u.company) && selectedBranch?.includes(u.branch) && selectedUnit?.includes(u.unit)).map((u) => u.teamname);
      //----------------------------
      let mappedemployees = filteredDatas
        ?.filter((u) => selectedCompany?.includes(u.company) && selectedBranch?.includes(u.branch) && selectedUnit?.includes(u.unit) && selectedTeam?.includes(u.team) && u.workmode !== 'Internship')
        .map((u) => ({
          label: u.companyname,
          value: u.companyname,
        }));

      let employees = filteredDatas?.filter((u) => selectedCompany?.includes(u.company) && selectedBranch?.includes(u.branch) && selectedUnit?.includes(u.unit) && selectedTeam?.includes(u.team)).map((u) => u.companyname);
      setValueEmployeeCat(employees);
      setSelectedOptionsEmployee(mappedemployees);
      setValueEmp(mappedemployees?.map((item) => item?.value));

      //-----------------
      setValueTeamCat(selectedTeam);
      setSelectedOptionsTeam(mappedTeam);
      setAllAssignCompany(selectedCompany);

      setAllAssignBranch(selectedBranch);

      setAllAssignUnit(selectedUnit);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    handleAutoSelect();
  }, [isAssignBranch]);

  const [searchInputValue, setSearchInputValue] = useState('');

  const handlePasteForEmp = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');

    // Process the pasted text
    const pastedNames = pastedText
      .split(/[\n,]+/)
      .map((name) => name.trim())
      .filter((name) => name !== '');

    // Update the state
    updateEmployees(pastedNames);

    // Clear the search input after paste
    setSearchInputValue('');

    // Refocus the element
    e.target.focus();
  };

  useEffect(() => {
    updateEmployees([]); // Pass an empty array instead of an empty string
  }, [allUsersData, valueCompanyCat, valueBranchCat, valueUnitCat, valueTeamCat]);

  const updateEmployees = (pastedNames) => {
    // Your existing update logic...
    const namesArray = Array.isArray(pastedNames) ? pastedNames : [];

    const availableOptions = allUsersData
      ?.filter((comp) => valueCompanyCat?.includes(comp.company) && valueBranchCat?.includes(comp.branch) && valueUnitCat?.includes(comp.unit) && valueTeamCat?.includes(comp.team) && comp?.workmode !== 'Internship')
      ?.map((data) => data.companyname.replace(/\s*\.\s*/g, '.').trim());

    const matchedValues = namesArray.filter((name) => availableOptions.includes(name.replace(/\s*\.\s*/g, '.').trim()));

    // Update selected options
    const newOptions = matchedValues.map((value) => ({
      label: value,
      value: value,
    }));

    setSelectedOptionsEmployee((prev) => {
      const newValues = newOptions.filter((newOpt) => !prev.some((prevOpt) => prevOpt.value === newOpt.value));
      return [...prev, ...newValues];
    });

    // Update other states...
    setValueEmp((prev) => [...new Set([...prev, ...matchedValues])]);
    setValueEmployeeCat((prev) => [...new Set([...prev, ...matchedValues])]);
  };
  // Handle clicks outside the Box
  useEffect(() => {
    const handleClickOutside = (e) => {
      const boxElement = document.getElementById('paste-box'); // Add an ID to the Box
      if (boxElement && !boxElement.contains(e.target)) {
        setIsBoxFocused(false); // Reset focus state if clicking outside the Box
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDelete = (e, value) => {
    e.preventDefault();
    setSelectedOptionsEmployee((current) => current.filter((emp) => emp.value !== value));
    setValueEmp((current) => current.filter((empValue) => empValue !== value));
    setValueEmployeeCat((current) => current.filter((empValue) => empValue !== value));
  };

  const handleClearFilter = () => {
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
    setValueEmp([]);
    setEmployees([]);
    setFilterState({
      type: 'Individual',
      employeestatus: 'Please Select Employee Status',
      employee: 'Please Select Employee',
      branch: '',
      unit: '',
      team: '',
    });
    setPopupContent('Cleared Successfully');
    setPopupSeverity('success');
    handleClickOpenPopup();
    setSearchQuery('');
  };

  const handleClear = () => {
    setValueCompanyCatNew([]);
    setSelectedOptionsCompanyNew([]);
    setValueBranchCatNew([]);
    setSelectedOptionsBranchNew([]);
    setValueUnitCatNew([]);
    setSelectedOptionsUnitNew([]);
    setValueTeamCatNew([]);
    setSelectedOptionsTeamNew([]);
    setFilterState((prev) => ({
      ...prev,
      employee: 'Please Select Employee',
      branch: '',
      unit: '',
      team: '',
    }));
    setPopupContent('Cleared Successfully');
    setPopupSeverity('success');
    handleClickOpenPopup();
    setSearchQuery('');
  };

  const handleClearNew = () => {
    setValueCompanyCat([]);
    setSelectedOptionsCompany([]);
    setValueBranchCat([]);
    setSelectedOptionsBranch([]);
    setValueUnitCat([]);
    setSelectedOptionsUnit([]);
    setValueTeamCat([]);
    setSelectedOptionsTeam([]);
    setFilterState((prev) => ({
      ...prev,
      employee: 'Please Select Employee',
      branch: '',
      unit: '',
      team: '',
    }));

    setSearchQuery('');
    handleClose();
  };

  const handleReplaceUser = async () => {
    if (!valueCompanyCatNew || valueCompanyCatNew.length === 0) {
      setPopupContentMalert('Please Select Company!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (!valueBranchCatNew || valueBranchCatNew.length === 0) {
      setPopupContentMalert('Please Select Branch!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (!valueUnitCatNew || valueUnitCatNew.length === 0) {
      setPopupContentMalert('Please Select Unit!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (!valueTeamCatNew || valueTeamCatNew.length === 0) {
      setPopupContentMalert('Please Select Team!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (!filterState.employee || filterState.employee === 'Please Select Employee') {
      setPopupContentMalert('Please Select Employee!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else {
      // console.log(filterState);
      replaceQueueDatas();
    }
  };

  const replaceQueueDatas = async () => {
    handleClose();
    setLoading(true);
    try {
      let response = await axios.post(
        `${SERVICE.QUEUEPRIORITYUSERSMODIFICATION}`,
        {
          oldbranch: userDetails?.branch,
          oldunit: userDetails?.unit,
          oldteam: userDetails?.team,
          oldcompanyname: userDetails?.companyname,
          branch: filterState?.branch,
          unit: filterState?.unit,
          team: filterState?.team,
          companyname: filterState?.employee,
          updatedbydatas: oldTodoDatas,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );

      sendRequestReason();
    } catch (err) {
      setLoading(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const fetchHandler = async () => {
    setPageName(!pageName);
    setLoading(true);
    try {
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      // console.log(startOfToday, "startOfToday");
      const aggregationPipeline = [
        {
          $match: {
            $or: [
              // { exitstatus: true },
              { approvenoticereq: { $lt: startOfToday } }
            ]

          },
        },
        {
          $project: {
            empname: 1,
            approvenoticereq: 1

          },
        },
      ];

      const resNew = await axios.post(
        SERVICE.DYNAMICNOTICEPERIODAPPLIES,
        {
          aggregationPipeline,
        },
        { headers: { Authorization: `Bearer ${auth.APIToken}` } }
      );

      let collectedUsers = resNew?.data?.users?.map((item) => item?.empname)

      // console.log(resNew?.data?.users, "resNew?.data?.users");

      const matchCriteria = {
        $and: [
          // Enquiry status filter
          {
            resonablestatus: {
              $nin: ['Releave Employee', 'Absconded', 'Hold', 'Terminate'],
            },
          },
          {
            workmode: { $ne: 'Internship' },
          },

          { companyname: { $in: collectedUsers } },
        ],
      };



      let res = await axios.post(
        `${SERVICE.MYCHECKLISTVIEW}`,
        {
          companyname: isUserRoleAccess?.companyname,
          role: isUserRoleAccess?.role,
          modulename: 'Human Resources',
          submodule: 'HR',
          mainpage: 'Employee',
          subpage: "Employee Action Details",
          subsubpage: "Action Employee List",
          aggregationPipeline: matchCriteria,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );

      setEmployees(res?.data?.configuredUsers?.map((item) => {
        let foundData = resNew?.data?.users?.find((itemNew) => itemNew?.empname === item?.companyname)

        return {
          ...item, approvenoticereq: moment(foundData?.approvenoticereq).format('DD-MM-YYYY'),
        }
      }));
      // console.log(res?.data?.configuredUsers);
      setThisPageDatas(res?.data?.toViewDatas);
      setLoading(false);
      setIsBoarding(true);
    } catch (err) {
      setLoading(false);
      setIsBoarding(true);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { auth } = useContext(AuthContext);

  const [empaddform, setEmpaddform] = useState({});

  let today = new Date();

  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var yyyy = today.getFullYear();
  let formattedDate = yyyy + '-' + mm + '-' + dd;

  const [isBoarding, setIsBoarding] = useState(true);

  //    popup for releaving
  const [openviewReleave, setOpenviewReleave] = useState(false);
  const handleClickOpenviewReleave = () => {
    setOpenviewReleave(true);
    handleCloseManageColumns();
  };

  const handleCloseviewReleave = () => {
    setReplaceName('Please Choose Replace name');
    setOpenviewReleave(false);
    setIsCheckedListOverall(false);
  };

  const [getId, setGetId] = useState('');

  // popover content
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleOpenManageColumns = (event, idval) => {
    setManageColumnsOpen(true);
    setGetId(idval);
  };
  const handleCloseManageColumns = () => {
    setAnchorEl(null);
    setManageColumnsOpen(false);
  };
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const [isCheckedList, setIsCheckedList] = useState([]);
  const [isCheckedListOverall, setIsCheckedListOverall] = useState(false);
  const overallCheckListChange = () => {
    let newArrayChecked = isCheckedList.map((item) => (item = !isCheckedListOverall));

    if (groupDetails) {
      let returnOverall = groupDetails?.map((row) => {
        {
          if (row.checklist === 'DateTime') {
            if (((row.data !== undefined && row.data !== '') || row.files !== undefined) && row.data.length === 16) {
              return true;
            } else {
              return false;
            }
          } else if (row.checklist === 'Date Multi Span') {
            if (((row.data !== undefined && row.data !== '') || row.files !== undefined) && row.data.length === 21) {
              return true;
            } else {
              return false;
            }
          } else if (row.checklist === 'Date Multi Span Time') {
            if (((row.data !== undefined && row.data !== '') || row.files !== undefined) && row.data.length === 33) {
              return true;
            } else {
              return false;
            }
          } else if (row.checklist === 'Date Multi Random Time') {
            if (((row.data !== undefined && row.data !== '') || row.files !== undefined) && row.data.length === 16) {
              return true;
            } else {
              return false;
            }
          } else if ((row.data !== undefined && row.data !== '') || row.files !== undefined) {
            return true;
          } else {
            return false;
          }
        }
      });

      let allcondition = returnOverall?.every((item) => item == true);

      if (allcondition) {
        setIsCheckedList(newArrayChecked);
        setIsCheckedListOverall(!isCheckedListOverall);
      } else {
        setPopupContentMalert('Please Fill all the Fields');
        setPopupSeverityMalert('info');
        handleClickOpenPopupMalert();
      }
    } else {
      setPopupContentMalert('Please Add Check List');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    }
  };
  const handleCheckboxChange = (index) => {
    let currentItem = groupDetails[index];
    let data = () => {
      if (currentItem.checklist === 'DateTime') {
        if (((currentItem.data !== undefined && currentItem.data !== '') || currentItem.files !== undefined) && currentItem.data.length === 16) {
          return true;
        } else {
          return false;
        }
      } else if (currentItem.checklist === 'Date Multi Span') {
        if (((currentItem.data !== undefined && currentItem.data !== '') || currentItem.files !== undefined) && currentItem.data.length === 21) {
          return true;
        } else {
          return false;
        }
      } else if (currentItem.checklist === 'Date Multi Span Time') {
        if (((currentItem.data !== undefined && currentItem.data !== '') || currentItem.files !== undefined) && currentItem.data.length === 33) {
          return true;
        } else {
          return false;
        }
      } else if (currentItem.checklist === 'Date Multi Random Time') {
        if (((currentItem.data !== undefined && currentItem.data !== '') || currentItem.files !== undefined) && currentItem.data.length === 16) {
          return true;
        } else {
          return false;
        }
      } else if ((currentItem.data !== undefined && currentItem.data !== '') || currentItem.files !== undefined) {
        return true;
      } else {
        return false;
      }
    };
    let statusFor = data();

    if (statusFor) {
      const newCheckedState = [...isCheckedList];
      newCheckedState[index] = !newCheckedState[index];
      setIsCheckedList(newCheckedState);
      handleDataChange(newCheckedState[index], index, 'Check Box');
      let overallChecked = newCheckedState.every((item) => item === true);

      if (overallChecked) {
        setIsCheckedListOverall(true);
      } else {
        setIsCheckedListOverall(false);
      }
    } else {
      setPopupContentMalert('Please Fill the Field');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    }
  };

  let name = 'create';

  //webcam
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const [getImg, setGetImg] = useState(null);
  const [isWebcamCapture, setIsWebcamCapture] = useState(false);
  const [capturedImages, setCapturedImages] = useState([]);
  const [valNum, setValNum] = useState(0);

  const webcamOpen = () => {
    setIsWebcamOpen(true);
  };
  const webcamClose = () => {
    setIsWebcamOpen(false);
  };
  const webcamDataStore = () => {
    setIsWebcamCapture(true);
    //popup close
    webcamClose();
  };

  //add webcamera popup
  const showWebcam = () => {
    webcamOpen();
  };

  const deleteChecklist = async () => {
    setDeleteBtn(true);
    const searchItem = datasAvailedDB.find((item) => item.commonid === postID && item.module === 'Human Resources' && item.submodule === 'HR' && item.mainpage === 'Employee' && item.subpage === 'Employee Action Details' && item.subsubpage === 'Action Employee List');
    setPageName(!pageName);
    try {
      await axios.delete(`${SERVICE.MYCHECKLIST_SINGLE}/${searchItem?._id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      handleCloseMod();
      setPopupContent('Deleted Successfully');
      setPopupSeverity('success');
      handleClickOpenPopup();
      handleCloseviewReleave();
      setDeleteBtn(false);
      setDeleteBtnDisable(true);
      setIsCheckedListOverall(false);
    } catch (err) {
      setDeleteBtn(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const renderFilePreviewEdit = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    window.open(link, '_blank');
  };
  const handleFileDeleteEdit = (index) => {
    let getData = groupDetails[index];
    delete getData.files;
    let finalData = getData;

    let updatedTodos = [...groupDetails];
    updatedTodos[index] = finalData;
    setGroupDetails(updatedTodos);
  };

  const [assignDetails, setAssignDetails] = useState();
  const [groupDetails, setGroupDetails] = useState();
  const [datasAvailedDB, setDatasAvailedDB] = useState();
  const [disableInput, setDisableInput] = useState([]);
  const [getDetails, setGetDetails] = useState();
  const [dateValue, setDateValue] = useState([]);
  const [timeValue, setTimeValue] = useState([]);
  const [dateValueRandom, setDateValueRandom] = useState([]);
  const [timeValueRandom, setTimeValueRandom] = useState([]);
  const [dateValueMultiFrom, setDateValueMultiFrom] = useState([]);
  const [dateValueMultiTo, setDateValueMultiTo] = useState([]);
  const [postID, setPostID] = useState();

  const [firstDateValue, setFirstDateValue] = useState([]);
  const [firstTimeValue, setFirstTimeValue] = useState([]);
  const [secondDateValue, setSecondDateValue] = useState([]);
  const [secondTimeValue, setSecondTimeValue] = useState([]);

  let completedbyName = isUserRoleAccess.companyname;

  const updateIndividualData = async (index) => {
    setDeleteBtnDisable(false);
    let searchItem = datasAvailedDB.find((item) => item.commonid == postID && item.module == 'Human Resources' && item.submodule == 'HR' && item.mainpage == 'Employee' && item.subpage == 'Employee Action Details' && item.subsubpage == 'Action Employee List');

    let combinedGroups = groupDetails?.map((data) => {
      let check = (data.data !== undefined && data.data !== '') || data.files !== undefined;

      if (check) {
        return {
          ...data,
          completedby: completedbyName,
          completedat: new Date(),
        };
      } else {
        return {
          ...data,
          completedby: '',
          completedat: '',
        };
      }
    });
    setPageName(!pageName);
    try {
      let objectID = combinedGroups[index]?._id;
      let objectData = combinedGroups[index];
      if (searchItem) {
        let assignbranches = await axios.put(`${SERVICE.MYCHECKLIST_SINGLEBYOBJECTID}/${objectID}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          data: String(objectData?.data),
          lastcheck: objectData?.lastcheck,
          newFiles: objectData?.files !== undefined ? objectData?.files : '',
          completedby: objectData?.completedby,
          completedat: objectData?.completedat,
        });
        await fecthDBDatas();
      } else {
        let assignbranches = await axios.post(`${SERVICE.MYCHECKLIST_CREATE}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          commonid: postID,
          module: thisPageDatas[0]?.modulename,
          submodule: thisPageDatas[0]?.submodule,
          mainpage: thisPageDatas[0]?.mainpage,
          subpage: thisPageDatas[0]?.subpage,
          subsubpage: thisPageDatas[0]?.subsubpage,
          category: thisPageDatas[0]?.category,
          subcategory: thisPageDatas[0]?.subcategory,
          candidatename: assignDetails?.companyname,
          status: 'progress',
          groups: Array.isArray(combinedGroups) ? [...combinedGroups] : [],
          addedby: [
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        });
        await fecthDBDatas();
      }
      setPopupContent('Updated Successfully');
      setPopupSeverity('success');
      handleClickOpenPopup();
    } catch (err) {
      setDeleteBtnDisable(true);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  async function fecthDBDatas() {
    setPageName(!pageName);
    try {
      let res = await axios.get(SERVICE.MYCHECKLIST);
      setDatasAvailedDB(res?.data?.mychecklist);

      let foundData = res?.data?.mychecklist.find((item) => item.commonid == postID && item.subsubpage == 'Action Employee List');
      setGroupDetails(foundData?.groups);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  }

  const updateDateValuesAtIndex = (value, index) => {
    setDateValue((prevArray) => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, 'DateTime', 'date');
  };

  const updateTimeValuesAtIndex = (value, index) => {
    setTimeValue((prevArray) => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, 'DateTime', 'time');
  };
  //---------------------------------------------------------------------------------------------------------------

  const updateFromDateValueAtIndex = (value, index) => {
    setDateValueMultiFrom((prevArray) => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, 'Date Multi Span', 'fromdate');
  };

  const updateToDateValueAtIndex = (value, index) => {
    setDateValueMultiTo((prevArray) => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, 'Date Multi Span', 'todate');
  };
  //---------------------------------------------------------------------------------------------------------------------------------
  const updateDateValueAtIndex = (value, index) => {
    setDateValueRandom((prevArray) => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, 'Date Multi Random Time', 'date');
  };

  const updateTimeValueAtIndex = (value, index) => {
    setTimeValueRandom((prevArray) => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, 'Date Multi Random Time', 'time');
  };
  //---------------------------------------------------------------------------------------------------------------------------------------

  const updateFirstDateValuesAtIndex = (value, index) => {
    setFirstDateValue((prevArray) => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, 'Date Multi Span Time', 'fromdate');
  };

  const updateFirstTimeValuesAtIndex = (value, index) => {
    setFirstTimeValue((prevArray) => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, 'Date Multi Span Time', 'fromtime');
  };

  const updateSecondDateValuesAtIndex = (value, index) => {
    setSecondDateValue((prevArray) => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, 'Date Multi Span Time', 'todate');
  };

  const updateSecondTimeValuesAtIndex = (value, index) => {
    setSecondTimeValue((prevArray) => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, 'Date Multi Span Time', 'totime');
  };

  //------------------------------------------------------------------------------------------------------------

  const handleDataChange = (e, index, from, sub) => {
    let getData;
    let finalData;
    let updatedTodos;
    switch (from) {
      case 'Check Box':
        getData = groupDetails[index];
        finalData = {
          ...getData,
          lastcheck: e,
        };

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case 'Text Box':
        getData = groupDetails[index];
        finalData = {
          ...getData,
          data: e.target.value,
        };

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case 'Text Box-number':
        getData = groupDetails[index];
        finalData = {
          ...getData,
          data: e.target.value,
        };

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case 'Text Box-alpha':
        getData = groupDetails[index];
        finalData = {
          ...getData,
          data: e.target.value,
        };

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case 'Text Box-alphanumeric':
        getData = groupDetails[index];
        finalData = {
          ...getData,
          data: e.target.value,
        };

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case 'Attachments':
        getData = groupDetails[index];
        finalData = {
          ...getData,
          files: e,
        };

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case 'Pre-Value':
        break;
      case 'Date':
        getData = groupDetails[index];
        finalData = {
          ...getData,
          data: e.target.value,
        };

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case 'Time':
        getData = groupDetails[index];
        finalData = {
          ...getData,
          data: e.target.value,
        };

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case 'DateTime':
        if (sub == 'date') {
          getData = groupDetails[index];
          finalData = {
            ...getData,
            data: `${e} ${timeValue[index]}`,
          };

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        } else {
          getData = groupDetails[index];
          finalData = {
            ...getData,
            data: `${dateValue[index]} ${e}`,
          };

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        }

        break;
      case 'Date Multi Span':
        if (sub == 'fromdate') {
          getData = groupDetails[index];
          finalData = {
            ...getData,
            data: `${e} ${dateValueMultiTo[index]}`,
          };

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        } else {
          getData = groupDetails[index];
          finalData = {
            ...getData,
            data: `${dateValueMultiFrom[index]} ${e}`,
          };

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        }
        break;
      case 'Date Multi Span Time':
        if (sub == 'fromdate') {
          getData = groupDetails[index];
          finalData = {
            ...getData,
            data: `${e} ${firstTimeValue[index]}/${secondDateValue[index]} ${secondTimeValue[index]}`,
          };

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        } else if (sub == 'fromtime') {
          getData = groupDetails[index];
          finalData = {
            ...getData,
            data: `${firstDateValue[index]} ${e}/${secondDateValue[index]} ${secondTimeValue[index]}`,
          };

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        } else if (sub == 'todate') {
          getData = groupDetails[index];
          finalData = {
            ...getData,
            data: `${firstDateValue[index]} ${firstTimeValue[index]}/${e} ${secondTimeValue[index]}`,
          };

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        } else {
          getData = groupDetails[index];
          finalData = {
            ...getData,
            data: `${firstDateValue[index]} ${firstTimeValue[index]}/${secondDateValue[index]} ${e}`,
          };

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        }
        break;
      case 'Date Multi Random':
        getData = groupDetails[index];
        finalData = {
          ...getData,
          data: e.target.value,
        };

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case 'Date Multi Random Time':
        if (sub == 'date') {
          getData = groupDetails[index];
          finalData = {
            ...getData,
            data: `${e} ${timeValueRandom[index]}`,
          };

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        } else {
          getData = groupDetails[index];
          finalData = {
            ...getData,
            data: `${dateValueRandom[index]} ${e}`,
          };

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        }
        break;
      case 'Radio':
        getData = groupDetails[index];
        finalData = {
          ...getData,
          data: e.target.value,
        };

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
    }
  };

  const handleChangeImage = (event, index) => {
    const maxFileSize = 1 * 1024 * 1024; // 1MB in bytes
    const resume = event.target.files;

    const file = resume[0];
    if (file?.size < maxFileSize) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        handleDataChange(
          {
            name: file.name,
            preview: reader.result,
            data: reader.result.split(',')[1],
            remark: 'resume file',
          },
          index,
          'Attachments'
        );
      };
    } else {
      setPopupContentMalert('File size is greater than 1MB, please upload a file below 1MB.');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    }
  };

  const handleCheckListSubmit = async () => {
    setLoading(true);
    if (isAssigned) {
      if (groupDetails) {
        let nextStep = isCheckedList.every((item) => item == true);

        if (hierarchyDeleteData.length > 0 && replaceName === 'Please Choose Replace name') {
          setLoading(false);
          setPopupContentMalert('Please Select Replace Name');
          setPopupSeverityMalert('info');
          handleClickOpenPopupMalert();
        } else if (!reason.date || reason.date === '') {
          setLoading(false);
          setPopupContentMalert('Please Select Date');
          setPopupSeverityMalert('info');
          handleClickOpenPopupMalert();
        } else if (hierarchyConditions?.hierarchySupempSame?.length > 0) {
          setLoading(false);
          setPopupContentMalert(`The EmployeeName in the hierarchy data is the same as the ReplaceName.`);
          setPopupSeverityMalert('info');
          handleClickOpenPopupMalert();
        } else if (hierarchyConditions?.hierarchyEmpSupSame?.length > 0) {
          setLoading(false);
          setPopupContentMalert(`The Supervisor in the hierarchy data is the same as the ReplaceName.`);
          setPopupSeverityMalert('info');
          handleClickOpenPopupMalert();
        } else if (hierarchyConditions?.hierarchyemp) {
          setLoading(false);
          setPopupContentMalert(`The employee name can't be replaced, as it already matches the data in the hierarchy.`);
          setPopupSeverityMalert('info');
          handleClickOpenPopupMalert();
        } else if (hierarchyConditions?.hierarchysup) {
          setLoading(false);
          setPopupContentMalert(`The supervisor name can't be replaced, as it already matches the data in the hierarchy.`);
          setPopupSeverityMalert('info');
          handleClickOpenPopupMalert();
        } else if (!reason?.date) {
          setLoading(false);
          setPopupContentMalert('Please Select Date!');
          setPopupSeverityMalert('info');
          handleClickOpenPopupMalert();
        } else if (!nextStep) {
          setLoading(false);
          setPopupContentMalert('Please Check All the Fields!');
          setPopupSeverityMalert('info');
          handleClickOpenPopupMalert();
        } else {
          if (vpnUser) {
            sendDeleteVpnRequest();
          }

          checkQueuePriorityUsersList();
        }
      } else if (hierarchyDeleteData.length > 0 && replaceName === 'Please Choose Replace name') {
        setLoading(false);
        setPopupContentMalert('Please Select Replace Name');
        setPopupSeverityMalert('info');
        handleClickOpenPopupMalert();
      } else {
        setLoading(false);
        setPopupContentMalert('Please Add Check List');
        setPopupSeverityMalert('info');
        handleClickOpenPopupMalert();
      }
    } else {
      if (hierarchyDeleteData.length > 0 && replaceName === 'Please Choose Replace name') {
        setLoading(false);
        setPopupContentMalert('Please Select Replace Name');
        setPopupSeverityMalert('info');
        handleClickOpenPopupMalert();
      } else if (!reason.date || reason.date === '') {
        setLoading(false);
        setPopupContentMalert('Please Select Date');
        setPopupSeverityMalert('info');
        handleClickOpenPopupMalert();
      } else if (hierarchyConditions?.hierarchySupempSame?.length > 0) {
        setLoading(false);
        setPopupContentMalert(`The EmployeeName in the hierarchy data is the same as the ReplaceName.`);
        setPopupSeverityMalert('info');
        handleClickOpenPopupMalert();
      } else if (hierarchyConditions?.hierarchyEmpSupSame?.length > 0) {
        setLoading(false);
        setPopupContentMalert(`The Supervisor in the hierarchy data is the same as the ReplaceName.`);
        setPopupSeverityMalert('info');
        handleClickOpenPopupMalert();
      } else if (hierarchyConditions?.hierarchyemp) {
        setLoading(false);
        setPopupContentMalert(`The employee name can't be replaced, as it already matches the data in the hierarchy.`);
        setPopupSeverityMalert('info');
        handleClickOpenPopupMalert();
      } else if (hierarchyConditions?.hierarchysup) {
        setLoading(false);
        setPopupContentMalert(`The supervisor name can't be replaced, as it already matches the data in the hierarchy.`);
        setPopupSeverityMalert('info');
        handleClickOpenPopupMalert();
      } else if (!reason?.date) {
        setLoading(false);
        setPopupContentMalert('Please Select Date!');
        setPopupSeverityMalert('info');
        handleClickOpenPopupMalert();
      } else {
        setLoading(false);
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: '100px', color: 'orange' }} />
            <p style={{ fontSize: '20px', fontWeight: 900 }}>{'Checklist is Not Assigned for this Page. Wish to continue?'}</p>
          </>
        );
        handleClickOpenerr();
      }
    }
  };

  const handleWithoutChecklistAssign = async () => {
    setLoading(true);
    if (vpnUser) {
      sendDeleteVpnRequest();
    }

    checkQueuePriorityUsersList();
  };
  const [oldTodoDatas, setOldTodoDatas] = useState([]);
  const checkQueuePriorityUsersList = async () => {
    try {
      let response = await axios.post(
        `${SERVICE.QUEUEPRIORITYUSERSGETLIST}`,
        {
          branch: userDetails?.branch,
          unit: userDetails?.unit,
          team: userDetails?.team,
          companyname: userDetails?.companyname,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      let mappedDatas = response?.data?.data?.map((item) => {
        return {
          _id: item?._id,
          updatedby: [
            ...item.updatedby,
            {
              name: String(isUserRoleAccess.companyname),
              todo: item.todo,
              date: String(new Date()),
            },
          ],
        };
      });
      setOldTodoDatas(mappedDatas);
      if (response?.data?.isThere) {
        setLoading(false);
        handleOpen();
      } else {
        sendRequestReason();
      }
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const [searchQueryManage, setSearchQueryManage] = useState('');

  const [selectedRows, setSelectedRows] = useState([]);
  // for new table
  const initialColumnVisibility = {
    actions: true,
    serialNumber: true,
    empcode: true,
    companyname: true,
    department: true,
    dateofbirth: true,
    contactpersonal: true,
    dateofjoining: true,
    experience: true,
    // profileimage: true,
    reportingto: true,
    workmode: true,
    dob: true,
    doj: true,
    lastworkingdate: true,
    mode: true,
    approvenoticereq: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

  const [reason, setReason] = useState({ date: '', reasonname: '' });
  const [lastWorkday, setLastworkday] = useState({});

  let bor = empaddform._id;
  let companyname = empaddform.companyname;

  const [statusemployee, setstatusemployee] = useState('');
  //add function
  const sendDeleteVpnRequest = async () => {
    try {
      await axios.post(
        `${SERVICE.DELETE_MIKROTIK_SECRET}`,
        {
          id: vpnUser?.id,
          url: vpnUser?.url,
          username: vpnUser?.username,
          password: vpnUser?.password,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
    } catch (err) {
      //  handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const checkRocketChat = async () => {
    try {
      let response = await axios.get(`${SERVICE.CHECK_ROCKETCHAT_HEALTH}}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      return response?.data?.rockectchatlive;
    } catch (error) {
      return false;
    }
  };
  const sendRequestReason = async () => {
    let combinedGroups = groupDetails?.map((data) => {
      let check = (data.data !== undefined && data.data !== '') || data.files !== undefined;

      if (check) {
        return {
          ...data,
          completedby: completedbyName,
          completedat: new Date(),
        };
      } else {
        return {
          ...data,
          completedby: '',
          completedat: '',
        };
      }
    });

    let previousRelievedDetails = getDetails.relieveddetails ? getDetails.relieveddetails : [];

    const searchItem = datasAvailedDB.find((item) => item.commonid === postID && item.module === 'Human Resources' && item.submodule === 'HR' && item.mainpage === 'Employee' && item.subpage === 'Employee Action Details' && item.subsubpage === 'Action Employee List');

    const headers = {
      Authorization: `Bearer ${auth.APIToken}`,
    };

    const createOrUpdateChecklist = async () => {
      const url = searchItem ? `${SERVICE.MYCHECKLIST_SINGLE}/${searchItem._id}` : SERVICE.MYCHECKLIST_CREATE;
      const method = searchItem ? 'put' : 'post';

      const data = searchItem
        ? {
          commonid: assignDetails?.commonid,
          module: assignDetails?.module,
          submodule: assignDetails?.submodule,
          mainpage: assignDetails?.mainpage,
          subpage: assignDetails?.subpage,
          subsubpage: assignDetails?.subsubpage,
          category: assignDetails?.category,
          subcategory: assignDetails?.subcategory,
          candidatename: assignDetails?.fullname,
          status: 'completed',
          groups: Array.isArray(combinedGroups) ? [...combinedGroups] : [],
          updatedby: [
            ...searchItem?.updatedby,
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        }
        : {
          commonid: postID,
          module: thisPageDatas[0]?.modulename,
          submodule: thisPageDatas[0]?.submodule,
          mainpage: thisPageDatas[0]?.mainpage,
          subpage: thisPageDatas[0]?.subpage,
          subsubpage: thisPageDatas[0]?.subsubpage,
          category: thisPageDatas[0]?.category,
          subcategory: thisPageDatas[0]?.subcategory,
          candidatename: assignDetails?.companyname,
          status: 'completed',
          groups: Array.isArray(combinedGroups) ? [...combinedGroups] : [],
          addedby: [
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        };

      await axios[method](url, data, { headers });
    };

    const updateProjectStatus = async () => {
      await axios.put(
        `${SERVICE.USER_SINGLE_PWD}/${bor}`,
        {
          resonablestatus: statusemployee,
          reasondate: moment(reason?.date || '').format('YYYY-MM-DD'),
          reasonname: reason.reasonname,
          lastworkday: moment(lastWorkday).format('YYYY-MM-DD'),
          relieveddetails: [
            ...previousRelievedDetails,
            {
              dateofrelieving: moment(reason?.date || '').format('YYYY-MM-DD'),
              reasonforrelieving: reason.reasonname,
              dateofjoining: getDetails?.doj,
            },
          ],
        },
        { headers }
      );
    };

    const deleteUserInLDAP = async () => {
      await axios.post(`${SERVICE.DELETEDOMAINSINGLEUSER}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        username: getDetails?.username,
      });
    };

    const deactivateRocketChatAccount = async () => {
      await axios.post(
        `${SERVICE.ACTIVESTATUS_ROCKETCHAT_USER}`,
        {
          roccketchatUserId: empaddform?.rocketchatid,
          activeStatus: false,
        },
        { headers }
      );
    };

    const unassignClientUsers = async () => {
      if (clientId?.length > 0) {
        await Promise.all(
          clientId.map((data) =>
            axios.put(
              `${SERVICE.SINGLE_CLIENTUSERID}/${data?._id}`,
              {
                allotted: 'unallotted',
                empname: '',
                empcode: '',
                company: '',
                branch: '',
                unit: '',
                team: '',
                time: '',
                date: '',
                updatelastlog: true,
              },
              { headers }
            )
          )
        );
      }
    };

    const removeExistingUser = async () => {
      await axios.post(`${SERVICE.REMOVEOVERALLEMPLOYEENAME}`, {
        companyname,
      });
    };

    setPageName(!pageName);
    try {
      handleCloseerr();
      if (isAssigned) {
        await createOrUpdateChecklist();
      }
      if (userPresentInLDAP) {
        await deleteUserInLDAP();
      }
      const projectscreate = await updateProjectStatus();
      const rocketChatAlive = await checkRocketChat();

      if (empaddform?.rocketchatid && rocketChatAlive) {
        await deactivateRocketChatAccount();
      }
      await unassignClientUsers();
      await removeExistingUser();

      setReason(projectscreate?.data);
      setLastworkday(projectscreate?.data);
      setReason({ date: '', reasonname: '' });
      setLastworkday({});
      await fetchUnassignedCandidates();
      handleCloseviewReleave();
      await hierarchyCheckDelete(empaddform.companyname, statusemployee);
      await handleActionSubmit();
      setIsCheckedListOverall(false);
      setLoading(false);
      setReplaceName('Please Choose Replace Name');
      await fetchHandler();
      setValueCompanyCatNew([]);
      setSelectedOptionsCompanyNew([]);
      setValueBranchCatNew([]);
      setSelectedOptionsBranchNew([]);
      setValueUnitCatNew([]);
      setSelectedOptionsUnitNew([]);
      setValueTeamCatNew([]);
      setSelectedOptionsTeamNew([]);
      setFilterState((prev) => ({
        ...prev,
        employee: 'Please Select Employee',
        branch: '',
        unit: '',
        team: '',
      }));
    } catch (err) {
      console.log(err);
      setLoading(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const sendBulkUpdateRequest = async () => {
    let combinedGroups = groupDetails?.map((data) => {
      let check = (data.data !== undefined && data.data !== '') || data.files !== undefined;

      if (check) {
        return {
          ...data,
          completedby: completedbyName,
          completedat: new Date(),
        };
      } else {
        return {
          ...data,
          completedby: '',
          completedat: '',
        };
      }
    });

    const searchItem = datasAvailedDB.find((item) => item.commonid === postID && item.module === 'Human Resources' && item.submodule === 'HR' && item.mainpage === 'Employee' && item.subpage === 'Employee Action Details' && item.subsubpage === 'Action Employee List');

    const headers = {
      Authorization: `Bearer ${auth.APIToken}`,
    };

    const createOrUpdateChecklist = async () => {
      const url = searchItem ? `${SERVICE.MYCHECKLIST_SINGLE}/${searchItem._id}` : SERVICE.MYCHECKLIST_CREATE;
      const method = searchItem ? 'put' : 'post';

      const data = searchItem
        ? {
          commonid: assignDetails?.commonid,
          module: assignDetails?.module,
          submodule: assignDetails?.submodule,
          mainpage: assignDetails?.mainpage,
          subpage: assignDetails?.subpage,
          subsubpage: assignDetails?.subsubpage,
          category: assignDetails?.category,
          subcategory: assignDetails?.subcategory,
          candidatename: assignDetails?.fullname,
          status: 'Progress',
          groups: Array.isArray(combinedGroups) ? [...combinedGroups] : [],
          updatedby: [
            ...searchItem?.updatedby,
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        }
        : {
          commonid: postID,
          module: thisPageDatas[0]?.modulename,
          submodule: thisPageDatas[0]?.submodule,
          mainpage: thisPageDatas[0]?.mainpage,
          subpage: thisPageDatas[0]?.subpage,
          subsubpage: thisPageDatas[0]?.subsubpage,
          category: thisPageDatas[0]?.category,
          subcategory: thisPageDatas[0]?.subcategory,
          candidatename: assignDetails?.companyname,
          status: 'Progress',
          groups: Array.isArray(combinedGroups) ? [...combinedGroups] : [],
          addedby: [
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        };

      await axios[method](url, data, { headers });
    };

    setPageName(!pageName);
    try {
      await createOrUpdateChecklist();

      await fetchUnassignedCandidates();
      await fecthDBDatas();
      setPopupContent('Updated Successfully');
      setPopupSeverity('success');
      handleClickOpenPopup();

      setLoading(false);
    } catch (err) {
      setLoading(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //cancel for reason section
  const handleClearreason = () => {
    setReplaceName('Please Choose Replace name');
    setReason({ date: '', reasonname: '' });
    setLastworkday({});
  };

  const [userDetails, setUserDetails] = useState({});
  const [isDgroup, setisDgroup] = useState('');
  const [profileSrc, setProfileSrc] = useState('');
  const fetchProfileImage = async (empid) => {
    try {
      let resNew = await axios.post(`${SERVICE.GETDOCUMENTS}`, {
        commonid: empid,
      });
      let availedData = Object.keys(resNew?.data)?.length;

      if (availedData != 0) {
        let profile = resNew?.data?.semployeedocument?.profileimage;
        setProfileSrc(profile);
      } else {
        setProfileSrc('');
      }
    } catch (err) {
      console.log(err, '2222');
    }
  };
  const [userPresentInLDAP, setUserPresentInLDAP] = useState(false);
  const getCode = async (e, name, details) => {
    setLoading(true);
    setGetDetails(details);
    setUserDetails(details);
    setLastworkday(details?.lastworkingdate);

    setPageName(!pageName);
    try {
      const [res, res1, resNew] = await Promise?.all([
        axios.get(`${SERVICE.USER_SINGLE}/${details?.id}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
        axios.get(SERVICE.MYCHECKLIST),
        axios.post(SERVICE.CHECKUSERPRESENTINLDAP, {
          username: details?.username,
        }),
      ]);
      setUserPresentInLDAP(resNew?.data?.status);
      setDatasAvailedDB(res1?.data?.mychecklist);
      await checkVpnUserDetails(res?.data?.suser?.companyname);
      await checkUserBiometricAvailability(res?.data?.suser);
      await fetchProfileImage(details?.id);
      let searchItem = res1?.data?.mychecklist.find((item) => item.commonid == details?.id && item.module == 'Human Resources' && item.submodule == 'HR' && item.mainpage == 'Employee' && item.subpage == 'Employee Action Details' && item.subsubpage == 'Action Employee List');

      if (searchItem) {
        setDeleteBtnDisable(false);
        setAssignDetails(searchItem);

        setPostID(searchItem?.commonid);
        let datasNew = searchItem.groups.map((item) => {
          switch (item.details) {
            case 'LEGALNAME':
              return {
                ...item,
                data: details.companyname,
              };
              break;
            case 'USERNAME':
              return {
                ...item,
                data: details.username,
              };
              break;
            case 'PASSWORD':
              return {
                ...item,
                data: details.originalpassword,
              };
              break;
            case 'DATE OF BIRTH':
              return {
                ...item,
                data: details.dob,
              };
              break;
            case 'EMAIL':
              return {
                ...item,
                data: details.email,
              };
              break;
            case 'PHONE NUMBER':
              return {
                ...item,
                data: details.contactpersonal,
              };
              break;
            case 'FIRST NAME':
              return {
                ...item,
                data: details.firstname,
              };
              break;
            case 'LAST NAME':
              return {
                ...item,
                data: details.lastname,
              };
              break;
            case 'AADHAAR NUMBER':
              return {
                ...item,
                data: details.aadhar,
              };
              break;
            case 'PAN NUMBER':
              return {
                ...item,
                data: details.panno,
              };
              break;
            case 'CURRENT ADDRESS':
              return {
                ...item,
                data: details.currentaddress,
              };
              break;
            default:
              return {
                ...item,
              };
          }
        });
        setGroupDetails(
          datasNew?.map((data) => ({
            ...data,
            lastcheck: false,
          }))
        );

        setIsCheckedList(searchItem?.groups?.map((data) => data.lastcheck));

        let forFillDetails = datasNew?.map((data) => {
          if (data.checklist === 'Date Multi Random Time') {
            if (data?.data && data?.data !== '') {
              const [date, time] = data?.data?.split(' ');
              return { date, time };
            }
          } else {
            return { date: '0', time: '0' };
          }
        });

        let forDateSpan = datasNew?.map((data) => {
          if (data.checklist === 'Date Multi Span') {
            if (data?.data && data?.data !== '') {
              const [fromdate, todate] = data?.data?.split(' ');
              return { fromdate, todate };
            }
          } else {
            return { fromdate: '0', todate: '0' };
          }
        });

        let forDateTime = datasNew?.map((data) => {
          if (data.checklist === 'DateTime') {
            if (data?.data && data?.data !== '') {
              const [date, time] = data?.data?.split(' ');
              return { date, time };
            }
          } else {
            return { date: '0', time: '0' };
          }
        });

        let forDateMultiSpanTime = datasNew?.map((data) => {
          if (data.checklist === 'Date Multi Span Time') {
            if (data?.data && data?.data !== '') {
              const [from, to] = data?.data?.split('/');
              const [fromdate, fromtime] = from?.split(' ');
              const [todate, totime] = to?.split(' ');
              return { fromdate, fromtime, todate, totime };
            }
          } else {
            return { fromdate: '0', fromtime: '0', todate: '0', totime: '0' };
          }
        });

        setDateValueMultiFrom(forDateSpan.map((item) => item?.fromdate));
        setDateValueMultiTo(forDateSpan.map((item) => item?.todate));

        setDateValueRandom(forFillDetails.map((item) => item?.date));
        setTimeValueRandom(forFillDetails.map((item) => item?.time));

        setDateValue(forDateTime.map((item) => item?.date));
        setTimeValue(forDateTime.map((item) => item?.time));

        setFirstDateValue(forDateMultiSpanTime.map((item) => item?.fromdate));
        setFirstTimeValue(forDateMultiSpanTime.map((item) => item?.fromtime));
        setSecondDateValue(forDateMultiSpanTime.map((item) => item?.todate));
        setSecondTimeValue(forDateMultiSpanTime.map((item) => item?.totime));
      } else {
        setDeleteBtnDisable(true);
        setAssignDetails(details);
        setPostID(details?.id);
        let datasNew = details?.groups?.map((item) => {
          switch (item.details) {
            case 'LEGALNAME':
              return {
                ...item,
                data: details.companyname,
              };
              break;
            case 'USERNAME':
              return {
                ...item,
                data: details.username,
              };
              break;
            case 'PASSWORD':
              return {
                ...item,
                data: details.originalpassword,
              };
              break;
            case 'DATE OF BIRTH':
              return {
                ...item,
                data: details.dob,
              };
              break;
            case 'EMAIL':
              return {
                ...item,
                data: details.email,
              };
              break;
            case 'PHONE NUMBER':
              return {
                ...item,
                data: details.contactpersonal,
              };
              break;
            case 'FIRST NAME':
              return {
                ...item,
                data: details.firstname,
              };
              break;
            case 'LAST NAME':
              return {
                ...item,
                data: details.lastname,
              };
              break;
            case 'AADHAAR NUMBER':
              return {
                ...item,
                data: details.aadhar,
              };
              break;
            case 'PAN NUMBER':
              return {
                ...item,
                data: details.panno,
              };
              break;
            case 'CURRENT ADDRESS':
              return {
                ...item,
                data: details.currentaddress,
              };
              break;
            default:
              return {
                ...item,
              };
          }
        });

        setGroupDetails(
          datasNew?.map((data) => ({
            ...data,
            lastcheck: false,
          }))
        );

        setIsCheckedList(new Array(datasNew?.length).fill(false));

        setDateValueRandom(new Array(details?.groups?.length).fill(0));
        setTimeValueRandom(new Array(details?.groups?.length).fill(0));

        setDateValueMultiFrom(new Array(details?.groups?.length).fill(0));
        setDateValueMultiTo(new Array(details?.groups?.length).fill(0));

        setDateValue(new Array(details?.groups?.length).fill(0));
        setTimeValue(new Array(details?.groups?.length).fill(0));

        setFirstDateValue(new Array(details?.groups?.length).fill(0));
        setFirstTimeValue(new Array(details?.groups?.length).fill(0));
        setSecondDateValue(new Array(details?.groups?.length).fill(0));
        setSecondTimeValue(new Array(details?.groups?.length).fill(0));

        setDisableInput(new Array(details?.groups?.length).fill(true));
      }

      let designationGrpName = alldesignation?.find((data) => res?.data?.suser?.designation === data?.name)?.group;
      setisDgroup(designationGrpName);
      setEmpaddform(res?.data?.suser);
      // setReplaceName(res?.data?.suser?.companyname);
      setstatusemployee(name);
      setLoading(false);
      handleClickOpenviewReleave();
      await hierarchyCheck(res?.data?.suser?.companyname);
      fetchEmployeeList(res?.data?.suser?.companyname);
      UserCheckClientId(res?.data?.suser);
    } catch (err) {
      console.log(err, 'error');
      setLoading(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const UserCheckClientId = async (user) => {
    let clientIds = await axios.post(`${SERVICE.CLIENTUSERID_CHECK_USER}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empname: user,
    });

    setClientId(clientIds?.data?.clientuserid);
  };

  const [vpnUser, setVpnUser] = useState({});

  const checkVpnUserDetails = async (user) => {
    try {
      const response = await axios.post(
        SERVICE.CHECK_VPN_DETAILS,
        {
          employeename: user,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );

      setVpnUser(response.data.user);
    } catch (err) {
      console.log(err, 'errorr1');
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  const [UnmatchedUserData, setUnmatchedUserData] = useState({});
  const checkUserBiometricAvailability = async (user) => {
    try {
      const response = await axios.post(
        SERVICE.BIOMETRIC_USERS_DATA_INDIVIDUAL_CHECK,
        {
          company: user?.company,
          branch: user?.branch,
          unit: user?.unit,
          team: user?.team,
          companyname: user?.companyname,
          username: user?.username,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      setUnmatchedUserData(response?.data?.biometricData);
    } catch (err) {
      console.log(err, 'errorr1');
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  const handleActionSubmit = async () => {
    setPageName(!pageName);
    try {
      if (UnmatchedUserData?.length > 0) {
        for (const data of UnmatchedUserData) {
          try {
            const res = await axios.put(
              `${SERVICE.BIOMETRIC_EDIT_UNMATCHED_USER_DATA}/${data?._id}`,
              {
                cloudIDC: data?.CloudIDC,
                biometricUserIDC: data?.biometricUserIDC,
                isEnabledC: 'No',
                updatedby: [
                  ...data?.updatedby,
                  {
                    name: String(isUserRoleAccess.companyname),
                    date: new Date().toISOString(),
                  },
                ],
              },
              {
                headers: { Authorization: `Bearer ${auth.APIToken}` },
              }
            );

            if (res?.data?.success) {
              await axios.post(
                SERVICE.BIOMETRIC_GET_SEND_COMMAND,
                {
                  CloudIDC: data?.cloudIDC,
                  biometricUserIDC: data?.biometricUserIDC,
                  deviceCommandN: '7',
                },
                {
                  headers: { Authorization: `Bearer ${auth.APIToken}` },
                }
              );
            }
          } catch (error) {
            console.error('Error updating unmatched user:', error);
          }
        }
      }

      // handleCloseModEdit();
      // setPopupContent("Updated Successfully");
      // setPopupSeverity("success");
      // handleClickOpenPopup();
      // setUnmatchedName("");
      // handleCloseModAction();
      // sendRequest();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const [hierarchyDeleteData, setHierarchyDeleteData] = useState([]);
  const [hierarchyDeleteEmployee, setHierarchyDeleteEmployee] = useState([]);

  //getting the datas while clicking options
  const hierarchyCheck = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.HIRERARCHI}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let answer = res?.data?.hirerarchi.filter((data) => data.supervisorchoose.includes(e));
      let answerEmployeename = res?.data?.hirerarchi.filter((data) => data.employeename.includes(e));
      setHierarchyDeleteData(answer);
      setHierarchyDeleteEmployee(answerEmployeename);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //while clicking save it happens
  const hierarchyCheckDelete = async (e, status) => {
    setPageName(!pageName);
    try {
      if (status !== 'Hold') {
        //Updating The SuperVisor based onn the supervisor array length
        let DeleteSuperVisor =
          hierarchyDeleteData.length > 0 &&
          hierarchyDeleteData.map((data, i) => {
            const checkSame = data.employeename.includes(replaceName);
            const checkSamesup = data.supervisorchoose.includes(replaceName);

            //if the supervisor array contains more than one element without the orginal releiveing name
            if (data.supervisorchoose.length > 1 && !checkSame && !checkSamesup) {
              const superVisor = data.supervisorchoose;
              const supervisorCheck = superVisor.filter((item) => item !== e);

              const ans = [...supervisorCheck, replaceName];
              const response = axios.put(`${SERVICE.HIRERARCHI_SINGLE}/${data._id}`, {
                supervisorchoose: ans,
              });
            } else if (data.supervisorchoose.length > 1 && checkSame && !checkSamesup) {
              const superVisor = data.supervisorchoose;
              const supervisorCheck = superVisor.filter((item) => item !== e);

              const ans = [...supervisorCheck];
              const response = axios.put(`${SERVICE.HIRERARCHI_SINGLE}/${data._id}`, {
                supervisorchoose: ans,
              });
            } else if (data.supervisorchoose.length > 1 && !checkSame && checkSamesup) {
              const superVisor = data.supervisorchoose;
              const supervisorCheck = superVisor.filter((item) => item !== e);

              const ans = [...supervisorCheck];
              const response = axios.put(`${SERVICE.HIRERARCHI_SINGLE}/${data._id}`, {
                supervisorchoose: ans,
              });
            } else if (data.supervisorchoose.length > 1 && checkSame && checkSamesup) {
              const superVisor = data.supervisorchoose;
              const supervisorCheck = superVisor.filter((item) => item !== e);

              const ans = [...supervisorCheck];
              const response = axios.put(`${SERVICE.HIRERARCHI_SINGLE}/${data._id}`, {
                supervisorchoose: ans,
              });
            }
            //if the supervisor array contains only the orginal releiveing name
            else if (!checkSame && data.supervisorchoose.length == 1) {
              const superVisor = data.supervisorchoose;
              const supervisorCheck = superVisor.filter((item) => item !== e);
              const ans = [...supervisorCheck];
              const response = axios.put(`${SERVICE.HIRERARCHI_SINGLE}/${data._id}`, {
                supervisorchoose: replaceName,
              });
            } else if (checkSame && data.supervisorchoose.length == 1) {
              let res = axios.delete(`${SERVICE.HIRERARCHI_SINGLE}/${data._id}`, {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },
              });
            }
          });

        //Updating The EmployeeName based onn the Employeename array length
        let DeleteemployeeName =
          hierarchyDeleteEmployee.length > 0 &&
          hierarchyDeleteEmployee.map((data) => {
            //if the employeename array contains more than one element without the orginal releiveing name
            if (data.employeename.length > 1) {
              const superVisor = data.employeename;
              const supervisorCheck = superVisor.filter((item) => item !== e);
              const response = axios.put(`${SERVICE.HIRERARCHI_SINGLE}/${data._id}`, {
                employeename: supervisorCheck,
              });
            } else {
              let res = axios.delete(`${SERVICE.HIRERARCHI_SINGLE}/${data._id}`, {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },
              });
            }
          });
        const userUpdateReportingTo = await axios.post(`${SERVICE.USER_REPORTINGTO_CHANGE}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          replacename: replaceName,
          oldname: empaddform.companyname,
        });
      }
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // info model
  const [openInfo, setOpeninfo] = useState(false);

  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };

  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  //get all employees list details
  const fetchEmployeeList = async (e) => {
    setPageName(!pageName);
    try {
      let Designation = allUsersData.find((item) => {
        return e === item?.companyname;
      });

      let answer = allUsersData.filter((data) => data.companyname !== e && Designation?.designation === data?.designation && (data?.resonablestatus === '' || data?.resonablestatus === undefined));
      setEmployeesList(
        answer?.length === 0
          ? [{ label: 'No Supervisor', value: 'No Supervisor' }]
          : answer.map((data) => ({
            ...data,
            label: data.companyname,
            value: data.companyname,
          }))
      );
    } catch (err) {
      setIsBoarding(true);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const handleCheckInHierarchy = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.post(`${SERVICE.HIRERARCHI_ACTION_EMPLOYEELIST}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        user: e,
        oldname: empaddform.companyname,
      });
      setHierarchyConditions(res?.data);
      console.log(res?.data, 'res_action');
    } catch (err) {
      setIsBoarding(true);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const [thisPageDatas, setThisPageDatas] = useState([]);

  const fetchUnassignedCandidates = async () => {
    setPageName(!pageName);
    try {
      // let res = await axios.post(
      //   `${SERVICE.MYCHECKLISTVIEW}`, {
      //   companyname: isUserRoleAccess?.companyname,
      //   role: isUserRoleAccess?.role,
      //   modulename: "Human Resources",
      //   submodule: "HR",
      //   mainpage: "Employee",
      //   subpage: "Employee Action Details",
      //   subsubpage: "Action Employee List"
      // },
      //   {
      //     headers: {
      //       Authorization: `Bearer ${auth.APIToken}`,
      //     },
      //   }
      // );
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    fetchHandler();
    fetchUnassignedCandidates();
  }, []);

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  //Boardingupadate updateby edit page...
  let updateby = empaddform?.updatedby;
  let addedby = empaddform?.addedby;

  const gridRef = useRef(null);
  //image
  const gridRefTableImg = useRef(null);
  // image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage
        .toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, 'Pending Releave Exit List.png');
        })
        .catch((error) => {
          console.error('dom-to-image error: ', error);
        });
    }
  };

  //------------------------------------------------------

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  const calculateExperience = (doj) => {
    const startDate = new Date(doj);
    const currentDate = new Date();
    let months = (currentDate.getFullYear() - startDate.getFullYear()) * 12;
    months -= startDate.getMonth();
    months += currentDate.getMonth();
    return Math.max(0, months);
  };

  const [fileFormat, setFormat] = useState('xl');
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = fileFormat === 'xl' ? '.xlsx' : '.csv';

  const exportToExcel = async (csvData, fileName) => {
    if (!csvData || !csvData.length) {
      return;
    }

    if (!fileName) {
      return;
    }

    setPageName(!pageName);
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Data');

      // Define columns
      worksheet.columns = [
        { header: 'S.No', key: 'serial', width: 10 },

        { header: 'Empcode', key: 'empcode', width: 15 },
        { header: 'Name', key: 'companyname', width: 30 },
        { header: 'Department', key: 'department', width: 30 },
        { header: 'Work Mode', key: 'workmode', width: 30 },
        { header: 'DOB', key: 'dob', width: 20 },
        { header: 'Personal Number', key: 'contactpersonal', width: 20 },

        { header: 'Doj', key: 'doj', width: 20 },
        { header: 'Last Working Day', key: 'lastworkingdate', width: 20 },
        { header: 'Experience', key: 'experience', width: 20 },
        { header: 'Reportint To', key: 'reportingto', width: 20 },

        // { header: 'Image', key: 'image', width: 20 }
      ];

      worksheet.getRow(1).eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFF00' }, // Yellow background
        };
        cell.font = {
          bold: true,
          color: { argb: '000' }, // Red text color
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });

      // Add rows and images
      for (let i = 0; i < csvData.length; i++) {
        const item = csvData[i];
        const row = worksheet.addRow({
          serial: i + 1,
          empcode: item.empcode || '',
          companyname: item.companyname || '',
          department: item.department || '',
          workmode: item.workmode || '',
          dob: item.dob || '',
          contactpersonal: item.contactpersonal || '',

          doj: item.doj || '',
          lastworkingdate: item.lastworkingdate || '',
          experience: item.experience || '',
          reportingto: item.reportingto || '',
        });

        // Center align the text in each cell of the row
        // row.eachCell({ includeEmpty: true }, (cell) => {
        //   cell.alignment = { vertical: 'middle', horizontal: 'center' };

        //   cell.border = {
        //     top: { style: 'thin' },
        //     left: { style: 'thin' },
        //     bottom: { style: 'thin' },
        //     right: { style: 'thin' }
        //   };

        // });

        if (item.profileimage) {
          const base64Image = item.profileimage.split(',')[1];
          const imageId = workbook.addImage({
            base64: base64Image,
            extension: 'png',
          });

          const rowIndex = row.number;

          // Adjust row height to fit the image
          worksheet.getRow(rowIndex).height = 80;

          // Add image to the worksheet
          worksheet.addImage(imageId, {
            tl: { col: 9, row: rowIndex - 1 },
            ext: { width: 100, height: 80 },
          });

          // Center align the image cell
          worksheet.getCell(`H${rowIndex}`).alignment = {
            vertical: 'middle',
            horizontal: 'center',
          };
        }
      }

      // Generate Excel file
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      FileSaver.saveAs(blob, `${fileName}${fileExtension}`);
    } catch (error) { }
  };

  const handleExportXL = (isfilter) => {
    const dataToExport = isfilter === 'filtered' ? (filteredChanges !== null ? filteredRowData : filteredData) : items;

    if (!dataToExport || dataToExport.length === 0) {
      return;
    }

    exportToExcel(dataToExport, 'Pending Releave Exit List');
    setIsFilterOpen(false);
  };

  //  PDF
  // pdf.....
  const columns = [
    { title: 'S.No', field: 'serialNumber' },
    { title: 'Empcode', field: 'empcode' },
    { title: 'Name', field: 'companyname' },
    { title: 'Department', field: 'department' },
    { title: 'Work Mode', field: 'workmode' },
    { title: 'Dob', field: 'dob' },
    { title: 'PersonalNo', field: 'contactpersonal' },
    { title: 'DOJ', field: 'doj' },
    { title: 'Last Working Day', field: 'lastworkingdate' },
    { title: 'Experience', field: 'experience' },
    { title: 'Reportingto', field: 'reportingto' },
    // { title: "Image", field: "imageBase64" }
  ];

  const downloadPdf = async (isfilter) => {
    const doc = new jsPDF();
    const tableColumn = columns.map((col) => col.title);
    const tableRows = [];
    const imagesToLoad = [];
    let newOne = filteredChanges !== null ? filteredRowData : filteredData;
    let datatoPdf = isfilter === 'filtered' ? newOne : items;

    datatoPdf.forEach((item, index) => {
      const rowData = [index + 1, item.empcode || '', item.companyname || '', item.department || '', item.workmode || '', item.dob || '', item.contactpersonal || '', item.doj || '', item.lastworkingdate || '', item.experience || '', item.reportingto || ''];

      tableRows.push(rowData);

      // if (item.profileimage) {
      //   imagesToLoad.push({ index, imageBase64: item.profileimage });
      // }
    });

    const loadImage = (imageBase64) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = imageBase64;
      });
    };

    const loadedImages = await Promise.all(imagesToLoad.map((item) => loadImage(item.imageBase64).then((img) => ({ ...item, img }))));

    // Calculate the required row height based on image height
    const rowHeight = 10; // Set desired row height

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      didDrawCell: (data) => {
        // Ensure that the cell belongs to the body section and it's the image column
        if (data.section === 'body' && data.column.index === columns.length - 1) {
          const imageInfo = loadedImages.find((image) => image.index === data.row.index);
          if (imageInfo) {
            const imageHeight = 10; // Desired image height
            const imageWidth = 10; // Desired image width
            const xOffset = (data.cell.width - imageWidth) / 2; // Center the image horizontally
            const yOffset = (rowHeight - imageHeight) / 2; // Center the image vertically

            doc.addImage(imageInfo.img, 'PNG', data.cell.x + xOffset, data.cell.y + yOffset, imageWidth, imageHeight);

            // Adjust cell styles to increase height
            data.cell.height = rowHeight; // Set custom height
          }
        }
      },
      headStyles: {
        minCellHeight: 5, // Set minimum cell height for header cells
        fontSize: 4, // You can adjust the font size if needed
        cellPadding: { top: 2, right: 1, bottom: 2, left: 1 }, // Adjust padding for header cells
      },
      bodyStyles: {
        fontSize: 4,
        minCellHeight: rowHeight, // Set minimum cell height for body cells
        cellPadding: { top: 4, right: 1, bottom: 0, left: 1 }, // Adjust padding for body cells
      },
      // columnStyles: {
      //   [tableColumn.length - 1]: { cellWidth: 12 } // Increase width of the image column
      // },
    });

    doc.save('Pending Releave Exit List.pdf');
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Pending Releave Exit List',
    pageStyle: 'print',
  });
  //table entries ..,.
  const [items, setItems] = useState([]);

  const addSerialNumber = (datas) => {
    const itemsWithSerialNumber = datas?.map((item, index) => {
      // let ans = item?.attandances[item?.attandances?.length - 1]?.date
      //   ? item?.attandances[item?.attandances?.length - 1]?.date?.split("-")
      //   : "";

      function getTimeDifference(clockIn, clockOut) {
        const formatTime = (timeStr) => {
          // Convert to 24-hour format using Date object
          return new Date(`01/01/2000 ${timeStr}`);
        };

        const inTime = formatTime(clockIn);
        const outTime = formatTime(clockOut);

        const diffMs = outTime - inTime; // difference in milliseconds

        const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        return diffHrs;
      }

      let ansNew;
      let count = item?.attandances?.length - 1;

      for (let i = count; i > 0; i--) {
        let currentItem = item?.attandances[i];
        let clockIN = currentItem?.clockintime;
        let clockOUT = currentItem?.clockouttime;
        let timeDiff = clockOUT && getTimeDifference(clockIN, clockOUT);
        if (clockOUT && timeDiff >= 5) {
          ansNew = currentItem?.date?.split('-');
          break;
        }
      }
      let day = ansNew && ansNew[0];
      let month = ansNew && ansNew[1];
      let year = ansNew && ansNew[2];
      let finaldate = day && month && year ? `${year}-${month}-${day}` : item?.doj;
      return {
        ...item,
        serialNumber: index + 1,
        dob: item?.dob ? moment(item.dob, 'YYYY-MM-DD').format('DD-MM-YYYY') : '',
        doj: item?.doj ? moment(item.doj, 'YYYY-MM-DD').format('DD-MM-YYYY') : '',
        experience: calculateExperience(item.doj),
        lastworkingdate: moment(finaldate).format('DD-MM-YYYY'),
      };
    });
    setItems(itemsWithSerialNumber);
    setOverallItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber(employees);
  }, [employees]);

  //table sorting
  const [sorting, setSorting] = useState({ column: '', direction: '' });

  const handleSorting = (column) => {
    const direction = sorting.column === column && sorting.direction === 'asc' ? 'desc' : 'asc';
    setSorting({ column, direction });
  };

  items.sort((a, b) => {
    if (sorting.direction === 'asc') {
      return a[sorting.column] > b[sorting.column] ? 1 : -1;
    } else if (sorting.direction === 'desc') {
      return a[sorting.column] < b[sorting.column] ? 1 : -1;
    }
    return 0;
  });

  const renderSortingIcon = (column) => {
    if (sorting.column !== column) {
      return (
        <>
          <Box sx={{ color: '#bbb6b6' }}>
            <Grid sx={{ height: '6px', fontSize: '1.6rem' }}>
              <ArrowDropUpOutlinedIcon />
            </Grid>
            <Grid sx={{ height: '6px', fontSize: '1.6rem' }}>
              <ArrowDropDownOutlinedIcon />
            </Grid>
          </Box>
        </>
      );
    } else if (sorting.direction === 'asc') {
      return (
        <>
          <Box>
            <Grid sx={{ height: '6px' }}>
              <ArrowDropUpOutlinedIcon style={{ color: 'black', fontSize: '1.6rem' }} />
            </Grid>
            <Grid sx={{ height: '6px' }}>
              <ArrowDropDownOutlinedIcon style={{ color: '#bbb6b6', fontSize: '1.6rem' }} />
            </Grid>
          </Box>
        </>
      );
    } else {
      return (
        <>
          <Box>
            <Grid sx={{ height: '6px' }}>
              <ArrowDropUpOutlinedIcon style={{ color: '#bbb6b6', fontSize: '1.6rem' }} />
            </Grid>
            <Grid sx={{ height: '6px' }}>
              <ArrowDropDownOutlinedIcon style={{ color: 'black', fontSize: '1.6rem' }} />
            </Grid>
          </Box>
        </>
      );
    }
  };

  //Datatable
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setPage(1);
  };

  //datatable....
  const [searchQuery, setSearchQuery] = useState('');
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

  const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);

  const totalPages = Math.ceil(employees.length / pageSize);

  const visiblePages = Math.min(totalPages, 3);

  const firstVisiblePage = Math.max(1, page - 1);
  const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

  const pageNumbers = [];

  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  }

  const rowDataTable = filteredData.map((item) => {
    return {
      ...item,
      id: item._id,
      serialNumber: item.serialNumber,
      empcode: item.empcode,
      companyname: item.companyname,
      department: item.department,
      dob: item.dob,
      contactpersonal: item.contactpersonal,
      doj: item.doj,
      experience: item?.experience,
      reportingto: item?.reportingto,
      // profileimage: item?.profileimage,
      attandances: item?.attandances,
      groups: item?.groups,
      originalpassword: item?.originalpassword,
      email: item?.email,
      firstname: item?.firstname,
      lastname: item?.lastname,
      aadhar: item?.aadhar,
      panno: item?.panno,
      username: item?.username,
      workmode: item?.workmode,
      currentaddress: item?.currentaddress,
      lastworkingdate: item?.lastworkingdate,
      relieveddetails: item?.relieveddetails,
      rejoineddetails: item?.rejoineddetails,
    };
  });

  const columnDataTable = [
    {
      field: 'serialNumber',
      headerName: 'SNo',
      flex: 0,
      width: 90,
      hide: !columnVisibility.serialNumber,
      headerClassName: 'bold-header',
      pinned: 'left',
    },
    {
      field: 'empcode',
      headerName: 'Emp Code',
      flex: 0,
      width: 180,
      hide: !columnVisibility.empcode,
      headerClassName: 'bold-header',
      pinned: 'left',
      cellRenderer: (params) => (
        <Grid sx={{ display: 'flex' }}>
          <ListItem
            sx={{
              '&:hover': {
                cursor: 'pointer',
                color: 'blue',
                textDecoration: 'underline',
              },
            }}
          >
            <CopyToClipboard
              onCopy={() => {
                handleCopy('Copied Emp Code!');
              }}
              options={{ message: 'Copied Emp Code!' }}
              text={params?.data?.empcode}
            >
              <ListItemText primary={params?.data?.empcode} />
            </CopyToClipboard>
          </ListItem>
        </Grid>
      ),
    },
    {
      field: 'companyname',
      headerName: 'Company Name',
      flex: 0,
      width: 200,
      hide: !columnVisibility.companyname,
      headerClassName: 'bold-header',
      cellRenderer: (params) => (
        <Grid sx={{ display: 'flex' }}>
          <ListItem
            sx={{
              '&:hover': {
                cursor: 'pointer',
                color: 'blue',
                textDecoration: 'underline',
              },
            }}
          >
            <CopyToClipboard
              onCopy={() => {
                handleCopy('Copied Company Name!');
              }}
              options={{ message: 'Copied Company Name!' }}
              text={params?.data?.companyname}
            >
              <ListItemText primary={params?.data?.companyname} />
            </CopyToClipboard>
          </ListItem>
        </Grid>
      ),
    },
    {
      field: 'department',
      headerName: 'Department',
      flex: 0,
      width: 200,
      hide: !columnVisibility.department,
      headerClassName: 'bold-header',
    },
    {
      field: 'workmode',
      headerName: 'Work Mode',
      flex: 0,
      width: 200,
      hide: !columnVisibility.workmode,
      headerClassName: 'bold-header',
    },
    {
      field: 'dob',
      headerName: 'DOB',
      flex: 0,
      width: 150,
      hide: !columnVisibility.dob,
      headerClassName: 'bold-header',
    },
    {
      field: 'contactpersonal',
      headerName: 'Contact Personal',
      flex: 0,
      width: 200,
      hide: !columnVisibility.contactpersonal,
      headerClassName: 'bold-header',
    },
    {
      field: 'doj',
      headerName: 'DOJ',
      flex: 0,
      width: 150,
      hide: !columnVisibility.doj,
      headerClassName: 'bold-header',
    },
    {
      field: 'lastworkingdate',
      headerName: 'Last Working Date',
      flex: 0,
      width: 150,
      hide: !columnVisibility.lastworkingdate,
      headerClassName: 'bold-header',
    },
    {
      field: 'approvenoticereq',
      headerName: 'Release Date',
      flex: 0,
      width: 150,
      hide: !columnVisibility.approvenoticereq,
      headerClassName: 'bold-header',
    },
    {
      field: 'experience',
      headerName: 'Experience',
      flex: 0,
      width: 100,
      hide: !columnVisibility.experience,
      headerClassName: 'bold-header',
    },
    {
      field: 'reportingto',
      headerName: 'Reporting To',
      flex: 0,
      width: 200,
      hide: !columnVisibility.reportingto,
      headerClassName: 'bold-header',
    },
    // {
    //   field: "profileimage",
    //   headerName: "Profile",
    //   flex: 0,
    //   width: 100,
    //   hide: !columnVisibility.profileimage,
    //   headerClassName: "bold-header",
    //   cellRenderer: (params) => {

    //     return params.value !== "" ? (
    //       <img
    //         src={params.value}
    //         alt="Profile"
    //         style={{ width: "100%", height: "auto" }}
    //       />
    //     ) : (
    //       <></>
    //     );
    //   },
    // },
    {
      field: 'actions',
      headerName: 'Action',
      flex: 0,
      width: 400,
      minHeight: '40px !important',
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: 'bold-header',
      cellRenderer: (params) => (
        <>
          <Grid sx={{ display: 'flex' }}>
            <ButtonGroup size="small" variant="contained" aria-label="Small button group">
              <Button
                sx={{ fontSize: '0.6rem', backgroundColor: '#0fa1ff' }}
                onClick={(e) => {
                  getCode(getId, 'Releave Employee', params?.data);
                }}
              >
                Releave Employee
              </Button>
              {/* <Button
                sx={{ fontSize: '0.6rem', backgroundColor: '#ff0f20' }}
                onClick={(e) => {
                  getCode(getId, 'Absconded', params?.data);
                }}
              >
                Absconded
              </Button>
              <Button
                sx={{
                  fontSize: '0.6rem',
                  backgroundColor: '#ffe40f',
                  color: 'black',
                }}
                onClick={(e) => {
                  getCode(getId, 'Hold', params?.data);
                }}
              >
                Hold
              </Button>
              <Button
                sx={{
                  fontSize: '0.6rem',
                  backgroundColor: '#ff3a0f',
                  color: 'white',
                }}
                onClick={() => {
                  getCode(getId, 'Terminate', params?.data);
                }}
              >
                Terminate
              </Button> */}
            </ButtonGroup>
          </Grid>
        </>
      ),
    },
  ];

  // Show All Columns functionality
  const handleShowAllColumns = () => {
    setColumnVisibility(initialColumnVisibility);
  };

  useEffect(() => {
    const savedVisibility = localStorage.getItem('columnVisibility');
    if (savedVisibility) {
      setColumnVisibility(JSON.parse(savedVisibility));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('columnVisibility', JSON.stringify(columnVisibility));
  }, [columnVisibility]);
  const filteredColumns = columnDataTable.filter((column) => column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase()));

  // Manage Columns functionality
  const toggleColumnVisibility = (field) => {
    setColumnVisibility((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };

  // Manage Columns
  const [isManageColumnsOpenNew, setManageColumnsOpenNew] = useState(false);
  const [anchorElNew, setAnchorElNew] = useState(null);

  const handleOpenManageColumnsNew = (event) => {
    setAnchorElNew(event.currentTarget);
    setManageColumnsOpenNew(true);
  };
  const handleCloseManageColumnsNew = () => {
    setManageColumnsOpenNew(false);
    setSearchQueryManage('');
  };

  const openNew = Boolean(anchorElNew);
  const idNew = openNew ? 'simple-popover' : undefined;

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
        onClick={handleCloseManageColumnsNew}
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
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );

  return (
    <Box>
      <NotificationContainer />
      {/* ****** Header Content ****** */}
      <Headtitle title={'Pending Releave Exit List'} />
      <PageHeading title="Pending Releave Exit List" modulename="Human Resources" submodulename="HR" mainpagename="Employee" subpagename="Notice Period" subsubpagename="Pending Releave Exit List" />
      <br />
      {/*{isUserRoleCompare?.includes('lactionemployeelist') && (
        <>
          <Box sx={userStyle.selectcontainer}>
            <Grid container spacing={2}>
              <>
                <Grid item xs={12}>
                  <Typography sx={userStyle.importheadtext}>Filters</Typography>
                </Grid>
                <br />
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Type<b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <Selects
                      options={TypeOptions}
                      styles={colourStyles}
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
                        setValueEmp([]);
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
                      <div onPaste={handlePasteForEmp} style={{ position: 'relative' }}>
                        <MultiSelect
                          options={allUsersData
                            ?.filter((u) => valueCompanyCat?.includes(u.company) && valueBranchCat?.includes(u.branch) && valueUnitCat?.includes(u.unit) && valueTeamCat?.includes(u.team) && u?.workmode !== 'Internship')
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
                        
                          inputValue={searchInputValue} 
                          onInputChange={(newValue) => setSearchInputValue(newValue)}
                        />
                      </div>
                    </FormControl>
                  </Grid>
                )}
                {['Individual']?.includes(filterState.type) && (
                  <Grid item md={6} sm={12} xs={12} sx={{ display: 'flex', flexDirection: 'row' }}>
                    <FormControl fullWidth size="small">
                      <Typography>Selected Employees</Typography>
                      <div
                        id="paste-box"
                        tabIndex={0} 
                        style={{
                          border: '1px solid #ccc',
                          borderRadius: '3.75px',
                          height: '110px',
                          overflow: 'auto',
                        }}
                        onPaste={handlePasteForEmp}
                        onFocus={() => setIsBoxFocused(true)} 
                        onBlur={(e) => {
                          if (isBoxFocused) {
                            e.target.focus(); 
                          }
                        }}
                      >
                        {valueEmp.map((value) => (
                          <Chip key={value} label={value} clickable sx={{ margin: 0.2, backgroundColor: '#FFF' }} onDelete={(e) => handleDelete(e, value)} onClick={() => console.log('clicked chip')} />
                        ))}
                      </div>
                    </FormControl>
                  </Grid>
                )}
              </>
            </Grid>
            <br />
            <br />
            <br />
            <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Grid item lg={1} md={2} sm={2} xs={12}>
                <Button sx={buttonStyles.buttonsubmit} variant="contained" onClick={handleFilter}>
                  {' '}
                  Filter{' '}
                </Button>
              </Grid>
              <Grid item lg={1} md={2} sm={2} xs={12}>
                <Button sx={buttonStyles.btncancel} onClick={handleClearFilter}>
                  {' '}
                  Clear{' '}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </>
)}*/}
      <br />
      <br />
      {isUserRoleCompare?.includes('lactionemployeelist') && (
        <>
          <Box sx={userStyle.container}>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography sx={userStyle.SubHeaderText}>Pending Releave Exit List</Typography>
              </Grid>
            </Grid>
            <br />
            {!isBoarding ? (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                </Box>
              </>
            ) : (
              <>
                <Grid container sx={{ justifyContent: 'center' }}>
                  <Grid>
                    {isUserRoleCompare?.includes('csvactionemployeelist') && (
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
                    {isUserRoleCompare?.includes('excelactionemployeelist') && (
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
                    {isUserRoleCompare?.includes('printactionemployeelist') && (
                      <>
                        <Button sx={userStyle.buttongrp} onClick={handleprint}>
                          &ensp;
                          <FaPrint />
                          &ensp;Print&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes('pdfactionemployeelist') && (
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
                    {isUserRoleCompare?.includes('imageactionemployeelist') && (
                      <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                        {' '}
                        <ImageIcon sx={{ fontSize: '15px' }} /> &ensp;Image&ensp;{' '}
                      </Button>
                    )}
                  </Grid>
                </Grid>
                <br />
                {/* added to the pagination grid */}
                <Grid style={userStyle.dataTablestyle}>
                  <Box>
                    <label htmlFor="pageSizeSelect">Show entries:</label>
                    <Select id="pageSizeSelect" value={pageSize} onChange={handlePageSizeChange} sx={{ width: '77px' }}>
                      <MenuItem value={1}>1</MenuItem>
                      <MenuItem value={5}>5</MenuItem>
                      <MenuItem value={10}>10</MenuItem>
                      <MenuItem value={25}>25</MenuItem>
                      <MenuItem value={50}>50</MenuItem>
                      <MenuItem value={100}>100</MenuItem>
                    </Select>
                  </Box>
                  <Box>
                    <AggregatedSearchBar
                      columnDataTable={columnDataTable}
                      setItems={setItems}
                      addSerialNumber={addSerialNumber}
                      setPage={setPage}
                      maindatas={employees}
                      setSearchedString={setSearchedString}
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                      paginated={false}
                      totalDatas={overallItems}
                    />
                  </Box>
                </Grid>
                <br />
                <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
                  Show All Columns
                </Button>
                &ensp;
                <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsNew}>
                  Manage Columns
                </Button>
                &ensp;
                {/* ****** Table Grid Container ****** */}
                <Grid container>
                  <Grid md={4} sm={2} xs={1}></Grid>
                  <Grid md={8} sm={10} xs={10} sx={{ align: 'center' }}></Grid>
                </Grid>
                <br />
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
                  gridRefTable={gridRef}
                  paginated={false}
                  filteredDatas={filteredDatas}
                  handleShowAllColumns={handleShowAllColumns}
                  setFilteredRowData={setFilteredRowData}
                  filteredRowData={filteredRowData}
                  setFilteredChanges={setFilteredChanges}
                  filteredChanges={filteredChanges}
                  gridRefTableImg={gridRefTableImg}
                  itemsList={overallItems}
                />
                {/* Manage Column */}
                <Popover
                  id={idNew}
                  open={isManageColumnsOpenNew}
                  anchorEl={anchorElNew}
                  onClose={handleCloseManageColumnsNew}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                >
                  {manageColumnsContent}
                </Popover>
              </>
            )}
          </Box>
        </>
      )}
      <br />
      {/* ****** Table End ****** */}

      {/* this is info view details */}

      <Dialog open={openInfo} onClose={handleCloseinfo} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="lg">
        <Box sx={{ width: '550px', padding: '20px 50px' }}>
          <>
            <Typography sx={userStyle.HeaderText}> Boarding Info</Typography>
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
                      <StyledTableCell sx={{ padding: '5px 10px !important' }}> {'UserName'}</StyledTableCell>
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
              <br />
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
            <Grid container spacing={2}>
              <Button variant="contained" onClick={handleCloseinfo}>
                {' '}
                Back{' '}
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>

      {/* this is the alert for the popover ation button in Reason Employee */}
      <Dialog open={openviewReleave} onClose={handleClickOpenviewReleave} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="xl" sx={{ marginTop: '100px' }}>
        <Box sx={{ padding: '20px 50px' }}>
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography
                sx={userStyle.HeaderText}
                onClick={(e) => {
                  // checkQueuePriorityUsersList();
                }}
              >
                {' '}
                Pending Releave Exit List
              </Typography>
              <Tooltip title="Delete Saved Check List For This Person">
                <LoadingButton
                  variant="contained"
                  color="error"
                  sx={{
                    paddingTop: '0 !important',
                    paddingBottom: '0 !important',
                    height: '30px',
                  }}
                  startIcon={<DeleteIcon />}
                  onClick={() => {
                    handleClickOpen();
                  }}
                  loading={deletebtn}
                  disabled={deletebtnDisable}
                >
                  Delete
                </LoadingButton>
              </Tooltip>
            </div>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography sx={userStyle.SubHeaderText}>
                    <b>Reason Apply</b>
                  </Typography>
                  <Typography>{statusemployee}</Typography>
                </FormControl>
              </Grid>

              {hierarchyDeleteData.length > 0 ? (
                <>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography sx={userStyle.SubHeaderText}>
                        <b>Replace</b>
                        {/* <b style={{ color: "red" }}>*</b>{" "} */}
                      </Typography>
                      <Selects
                        options={employeesList}
                        styles={colourStyles}
                        value={{ label: replaceName, value: replaceName }}
                        onChange={(e) => {
                          setReplaceName(e.value);
                          handleCheckInHierarchy(e);
                        }}
                      />
                    </FormControl>
                  </Grid>
                </>
              ) : (
                ''
              )}
            </Grid>
            <br />
            <Grid container spacing={2}>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography sx={userStyle.SubHeaderText}>
                    <b>Employee code</b>
                  </Typography>
                  <Typography>{empaddform.empcode}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography sx={userStyle.SubHeaderText}>
                    <b>Employee Name</b>
                  </Typography>
                  <Typography>{empaddform.companyname}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography sx={userStyle.SubHeaderText}>
                    <b>Designation</b>
                  </Typography>
                  <Typography>{empaddform.designation}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography sx={userStyle.SubHeaderText}>
                    <b>Designation Group</b>
                  </Typography>
                  <Typography>{isDgroup}</Typography>
                </FormControl>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={2}>
              <Grid item md={1} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">
                    <b>Date</b> <b style={{ color: 'red' }}>*</b>
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl size="small" fullWidth>
                  <OutlinedInput
                    id="component-outlined"
                    type="date"
                    value={reason.date}
                    // value={lastWorkday}
                    onChange={(e) => {
                      setReason({ ...reason, date: e.target.value });
                    }}
                    inputProps={{
                      min: moment(lastWorkday, 'DD-MM-YYYY')?.format('YYYY-MM-DD') || '1970-01-01',
                    }}
                  />
                </FormControl>
              </Grid>

              <Grid item md={2} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">
                    <b>Reason</b>{' '}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl size="small" fullWidth>
                  <TextareaAutosize
                    aria-label="minimum height"
                    minRows={5}
                    value={reason.reasonname}
                    onChange={(e) => {
                      setReason({ ...reason, reasonname: e.target.value });
                    }}
                  />
                </FormControl>
              </Grid>
              {/* Profile Image Column */}
              <Grid item md={3} xs={12} sm={12}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="h6">
                    <b>Profile Image</b>
                  </Typography>
                  <Box
                    sx={{
                      border: '1px solid black',
                      width: '153px',
                      height: '153px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: '8px',
                      overflow: 'hidden',
                      borderRadius: '8px',
                    }}
                  >
                    <img src={profileSrc ? profileSrc : 'https://t4.ftcdn.net/jpg/03/59/58/91/360_F_359589186_JDLl8dIWoBNf1iqEkHxhUeeOulx0wOC5.jpg'} alt="Profile" width="100%" height="100%" style={{ objectFit: 'cover' }} />
                  </Box>
                </Box>
              </Grid>
            </Grid>
            <br />
            {/* Last working day */}
            <Grid container spacing={2}>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">
                    <b>Last Working Day</b>{' '}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl size="small" fullWidth>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    // value={formattedDate}
                    // value={lastWorkday}
                    value={lastWorkday}
                    readOnly
                  // onChange={(e) => {
                  //   setLastworkday(e.target.value);
                  // }}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <br />
            <Box sx={{ padding: '20px 10px', width: '100%' }}>
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ ...userStyle.SubHeaderText, fontWeight: '600' }}>My Check List</Typography>
                  <div>
                    <Tooltip title="Update All the Values simultaneously">
                      <Button
                        onClick={() => {
                          sendBulkUpdateRequest();
                        }}
                        variant="contained"
                        color="success"
                      >
                        Bulk Update
                      </Button>
                    </Tooltip>
                  </div>
                </div>
                <br />
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ fontSize: '1.2rem' }}>
                          <Checkbox
                            onChange={() => {
                              overallCheckListChange();
                            }}
                            checked={isCheckedListOverall}
                          />
                        </TableCell>
                        <TableCell style={{ fontSize: '1.2rem' }}>Details</TableCell>
                        <TableCell style={{ fontSize: '1.2rem' }}>Field</TableCell>
                        <TableCell style={{ fontSize: '1.2rem' }}>Allotted To</TableCell>
                        <TableCell style={{ fontSize: '1.2rem' }}>Completed BY</TableCell>
                        <TableCell style={{ fontSize: '1.2rem' }}>Completed At</TableCell>
                        <TableCell style={{ fontSize: '1.2rem' }}>Status</TableCell>
                        <TableCell style={{ fontSize: '1.2rem' }}>Action</TableCell>
                        <TableCell style={{ fontSize: '1.2rem' }}>Category</TableCell>
                        <TableCell style={{ fontSize: '1.2rem' }}>Sub Category</TableCell>

                        {/* Add more table headers as needed */}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {groupDetails?.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell style={{ fontSize: '1.2rem' }}>
                            <Checkbox
                              onChange={() => {
                                handleCheckboxChange(index);
                              }}
                              checked={isCheckedList[index]}
                            />
                          </TableCell>

                          <TableCell>{row.details}</TableCell>
                          {(() => {
                            switch (row.checklist) {
                              case 'Text Box':
                                return (
                                  <TableCell>
                                    <OutlinedInput
                                      style={{ height: '32px' }}
                                      value={row.data}
                                      // disabled={disableInput[index]}
                                      onChange={(e) => {
                                        handleDataChange(e, index, 'Text Box');
                                      }}
                                    />
                                  </TableCell>
                                );
                              case 'Text Box-number':
                                return (
                                  <TableCell>
                                    <Input
                                      value={row.data}
                                      style={{ height: '32px' }}
                                      type="number"
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        if (value === '' || /^\d*$/.test(value)) {
                                          handleDataChange(e, index, 'Text Box-number');
                                        }
                                      }}
                                    />
                                  </TableCell>
                                );
                              case 'Text Box-alpha':
                                return (
                                  <TableCell>
                                    <OutlinedInput
                                      style={{ height: '32px' }}
                                      value={row.data}
                                      onChange={(e) => {
                                        const inputValue = e.target.value;
                                        if (/^[a-zA-Z]*$/.test(inputValue)) {
                                          handleDataChange(e, index, 'Text Box-alpha');
                                        }
                                      }}
                                    />
                                  </TableCell>
                                );
                              case 'Text Box-alphanumeric':
                                return (
                                  <TableCell>
                                    <OutlinedInput
                                      style={{ height: '32px' }}
                                      value={row.data}
                                      onChange={(e) => {
                                        const inputValue = e.target.value;
                                        if (/^[a-zA-Z0-9]*$/.test(inputValue)) {
                                          handleDataChange(e, index, 'Text Box-alphanumeric');
                                        }
                                      }}
                                      inputProps={{ pattern: '[A-Za-z0-9]*' }}
                                    />
                                  </TableCell>
                                );
                              case 'Attachments':
                                return (
                                  <TableCell>
                                    <div>
                                      <InputLabel sx={{ m: 1 }}>File</InputLabel>

                                      <div>
                                        <Box
                                          sx={{
                                            display: 'flex',
                                            marginTop: '10px',
                                            gap: '10px',
                                          }}
                                        >
                                          <Box item md={4} sm={4}>
                                            <section>
                                              <input
                                                type="file"
                                                accept="*/*"
                                                id={index}
                                                onChange={(e) => {
                                                  handleChangeImage(e, index);
                                                }}
                                                style={{ display: 'none' }}
                                              />
                                              <label htmlFor={index}>
                                                <Typography sx={userStyle.uploadbtn}>Upload</Typography>
                                              </label>
                                              <br />
                                            </section>
                                          </Box>

                                          <Box item md={4} sm={4}>
                                            <Button onClick={showWebcam} variant="contained" sx={userStyle.uploadbtn}>
                                              <CameraAltIcon />
                                            </Button>
                                          </Box>
                                        </Box>
                                        {row.files && (
                                          <Grid container spacing={2}>
                                            <Grid item lg={8} md={8} sm={8} xs={8}>
                                              <Typography>{row.files.name}</Typography>
                                            </Grid>
                                            <Grid item lg={2} md={2} sm={2} xs={2}>
                                              <VisibilityOutlinedIcon
                                                style={{
                                                  fontsize: 'large',
                                                  color: '#357AE8',
                                                  cursor: 'pointer',
                                                }}
                                                onClick={() => renderFilePreviewEdit(row.files)}
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
                                                onClick={() => handleFileDeleteEdit(index)}
                                              >
                                                <DeleteIcon />
                                              </Button>
                                            </Grid>
                                          </Grid>
                                        )}
                                      </div>
                                      <Dialog open={isWebcamOpen} onClose={webcamClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                                        <DialogContent
                                          sx={{
                                            textAlign: 'center',
                                            alignItems: 'center',
                                          }}
                                        >
                                          <Webcamimage getImg={getImg} setGetImg={setGetImg} capturedImages={capturedImages} valNum={valNum} setValNum={setValNum} name={name} />
                                        </DialogContent>
                                        <DialogActions>
                                          <Button variant="contained" color="success" onClick={webcamDataStore}>
                                            OK
                                          </Button>
                                          <Button variant="contained" color="error" onClick={webcamClose}>
                                            CANCEL
                                          </Button>
                                        </DialogActions>
                                      </Dialog>
                                    </div>
                                  </TableCell>
                                );
                              case 'Pre-Value':
                                return (
                                  <TableCell>
                                    <Typography>{row?.data}</Typography>
                                  </TableCell>
                                );
                              case 'Date':
                                return (
                                  <TableCell>
                                    <OutlinedInput
                                      style={{ height: '32px' }}
                                      type="date"
                                      value={row.data}
                                      onChange={(e) => {
                                        handleDataChange(e, index, 'Date');
                                      }}
                                    />
                                  </TableCell>
                                );
                              case 'Time':
                                return (
                                  <TableCell>
                                    <OutlinedInput
                                      style={{ height: '32px' }}
                                      type="time"
                                      value={row.data}
                                      onChange={(e) => {
                                        handleDataChange(e, index, 'Time');
                                      }}
                                    />
                                  </TableCell>
                                );
                              case 'DateTime':
                                return (
                                  <TableCell>
                                    <Stack direction="row" spacing={2}>
                                      <OutlinedInput
                                        style={{ height: '32px' }}
                                        type="date"
                                        value={dateValue[index]}
                                        onChange={(e) => {
                                          updateDateValuesAtIndex(e.target.value, index);
                                        }}
                                      />
                                      <OutlinedInput
                                        type="time"
                                        style={{ height: '32px' }}
                                        value={timeValue[index]}
                                        onChange={(e) => {
                                          updateTimeValuesAtIndex(e.target.value, index);
                                        }}
                                      />
                                    </Stack>
                                  </TableCell>
                                );
                              case 'Date Multi Span':
                                return (
                                  <TableCell>
                                    <Stack direction="row" spacing={2}>
                                      <OutlinedInput
                                        style={{ height: '32px' }}
                                        type="date"
                                        value={dateValueMultiFrom[index]}
                                        onChange={(e) => {
                                          updateFromDateValueAtIndex(e.target.value, index);
                                        }}
                                      />
                                      <OutlinedInput
                                        type="date"
                                        style={{ height: '32px' }}
                                        value={dateValueMultiTo[index]}
                                        onChange={(e) => {
                                          updateToDateValueAtIndex(e.target.value, index);
                                        }}
                                      />
                                    </Stack>
                                  </TableCell>
                                );
                              case 'Date Multi Span Time':
                                return (
                                  <TableCell>
                                    <div
                                      style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '10px',
                                      }}
                                    >
                                      <Stack direction="row" spacing={2}>
                                        <OutlinedInput
                                          style={{ height: '32px' }}
                                          type="date"
                                          value={firstDateValue[index]}
                                          onChange={(e) => {
                                            updateFirstDateValuesAtIndex(e.target.value, index);
                                          }}
                                        />
                                        <OutlinedInput
                                          type="time"
                                          style={{ height: '32px' }}
                                          value={firstTimeValue[index]}
                                          onChange={(e) => {
                                            updateFirstTimeValuesAtIndex(e.target.value, index);
                                          }}
                                        />
                                      </Stack>
                                      <Stack direction="row" spacing={2}>
                                        <OutlinedInput
                                          type="date"
                                          style={{ height: '32px' }}
                                          value={secondDateValue[index]}
                                          onChange={(e) => {
                                            updateSecondDateValuesAtIndex(e.target.value, index);
                                          }}
                                        />
                                        <OutlinedInput
                                          style={{ height: '32px' }}
                                          type="time"
                                          value={secondTimeValue[index]}
                                          onChange={(e) => {
                                            updateSecondTimeValuesAtIndex(e.target.value, index);
                                          }}
                                        />
                                      </Stack>
                                    </div>
                                  </TableCell>
                                );
                              case 'Date Multi Random':
                                return (
                                  <TableCell>
                                    <OutlinedInput
                                      style={{ height: '32px' }}
                                      type="date"
                                      value={row.data}
                                      onChange={(e) => {
                                        handleDataChange(e, index, 'Date Multi Random');
                                      }}
                                    />
                                  </TableCell>
                                );
                              case 'Date Multi Random Time':
                                return (
                                  <TableCell>
                                    <Stack direction="row" spacing={2}>
                                      <OutlinedInput
                                        style={{ height: '32px' }}
                                        type="date"
                                        value={dateValueRandom[index]}
                                        onChange={(e) => {
                                          updateDateValueAtIndex(e.target.value, index);
                                        }}
                                      />
                                      <OutlinedInput
                                        type="time"
                                        style={{ height: '32px' }}
                                        value={timeValueRandom[index]}
                                        onChange={(e) => {
                                          updateTimeValueAtIndex(e.target.value, index);
                                        }}
                                      />
                                    </Stack>
                                  </TableCell>
                                );
                              case 'Radio':
                                return (
                                  <TableCell>
                                    <FormControl component="fieldset">
                                      <RadioGroup
                                        value={row.data}
                                        sx={{
                                          display: 'flex',
                                          flexDirection: 'row !important',
                                        }}
                                        onChange={(e) => {
                                          handleDataChange(e, index, 'Radio');
                                        }}
                                      >
                                        <FormControlLabel value="No" control={<Radio />} label="No" />
                                        <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                                      </RadioGroup>
                                    </FormControl>
                                  </TableCell>
                                );

                              default:
                                return <TableCell></TableCell>; // Default case
                            }
                          })()}
                          <TableCell>{row?.employee && row?.employee?.map((data, index) => <Typography key={index} variant="body1">{`${index + 1}.${data}, `}</Typography>)}</TableCell>
                          <TableCell>{row.completedby}</TableCell>
                          <TableCell>{row.completedat && moment(row.completedat).format('DD-MM-YYYY hh:mm:ss A')}</TableCell>

                          <TableCell>
                            {row.checklist === 'DateTime' ? (
                              ((row.data !== undefined && row.data !== '') || row.files !== undefined) && row.data.length === 16 ? (
                                <Typography>Completed</Typography>
                              ) : (
                                <Typography>Pending</Typography>
                              )
                            ) : row.checklist === 'Date Multi Span' ? (
                              ((row.data !== undefined && row.data !== '') || row.files !== undefined) && row.data.length === 21 ? (
                                <Typography>Completed</Typography>
                              ) : (
                                <Typography>Pending</Typography>
                              )
                            ) : row.checklist === 'Date Multi Span Time' ? (
                              ((row.data !== undefined && row.data !== '') || row.files !== undefined) && row.data.length === 33 ? (
                                <Typography>Completed</Typography>
                              ) : (
                                <Typography>Pending</Typography>
                              )
                            ) : row.checklist === 'Date Multi Random Time' ? (
                              ((row.data !== undefined && row.data !== '') || row.files !== undefined) && row.data.length === 16 ? (
                                <Typography>Completed</Typography>
                              ) : (
                                <Typography>Pending</Typography>
                              )
                            ) : (row.data !== undefined && row.data !== '') || row.files !== undefined ? (
                              <Typography>Completed</Typography>
                            ) : (
                              <Typography>Pending</Typography>
                            )}
                          </TableCell>

                          <TableCell>
                            {row.checklist === 'DateTime' ? (
                              ((row.data !== undefined && row.data !== '') || row.files !== undefined) && row.data.length === 16 ? (
                                <>
                                  <IconButton
                                    sx={{ color: 'green', cursor: 'pointer' }}
                                    onClick={() => {
                                      updateIndividualData(index);
                                    }}
                                  >
                                    <CheckCircleIcon />
                                  </IconButton>
                                </>
                              ) : (
                                <IconButton
                                  sx={{ color: '#1565c0', cursor: 'pointer' }}
                                  onClick={() => {
                                    let itemValue = disableInput[index];
                                    itemValue = false;
                                    let spreadData = [...disableInput];
                                    spreadData[index] = false;
                                    setDisableInput(spreadData);
                                  }}
                                >
                                  <CheckCircleIcon />
                                </IconButton>
                              )
                            ) : row.checklist === 'Date Multi Span' ? (
                              ((row.data !== undefined && row.data !== '') || row.files !== undefined) && row.data.length === 21 ? (
                                <>
                                  <IconButton
                                    sx={{ color: 'green', cursor: 'pointer' }}
                                    onClick={() => {
                                      updateIndividualData(index);
                                    }}
                                  >
                                    <CheckCircleIcon />
                                  </IconButton>
                                </>
                              ) : (
                                <IconButton
                                  sx={{ color: '#1565c0', cursor: 'pointer' }}
                                  onClick={() => {
                                    let itemValue = disableInput[index];
                                    itemValue = false;
                                    let spreadData = [...disableInput];
                                    spreadData[index] = false;
                                    setDisableInput(spreadData);
                                  }}
                                >
                                  <CheckCircleIcon />
                                </IconButton>
                              )
                            ) : row.checklist === 'Date Multi Span Time' ? (
                              ((row.data !== undefined && row.data !== '') || row.files !== undefined) && row.data.length === 33 ? (
                                <>
                                  <IconButton
                                    sx={{ color: 'green', cursor: 'pointer' }}
                                    onClick={() => {
                                      updateIndividualData(index);
                                    }}
                                  >
                                    <CheckCircleIcon />
                                  </IconButton>
                                </>
                              ) : (
                                <IconButton
                                  sx={{ color: '#1565c0', cursor: 'pointer' }}
                                  onClick={() => {
                                    let itemValue = disableInput[index];
                                    itemValue = false;
                                    let spreadData = [...disableInput];
                                    spreadData[index] = false;
                                    setDisableInput(spreadData);
                                  }}
                                >
                                  <CheckCircleIcon />
                                </IconButton>
                              )
                            ) : row.checklist === 'Date Multi Random Time' ? (
                              ((row.data !== undefined && row.data !== '') || row.files !== undefined) && row.data.length === 16 ? (
                                <>
                                  <IconButton
                                    sx={{ color: 'green', cursor: 'pointer' }}
                                    onClick={() => {
                                      updateIndividualData(index);
                                    }}
                                  >
                                    <CheckCircleIcon />
                                  </IconButton>
                                </>
                              ) : (
                                <IconButton
                                  sx={{ color: '#1565c0', cursor: 'pointer' }}
                                  onClick={() => {
                                    let itemValue = disableInput[index];
                                    itemValue = false;
                                    let spreadData = [...disableInput];
                                    spreadData[index] = false;
                                    setDisableInput(spreadData);
                                  }}
                                >
                                  <CheckCircleIcon />
                                </IconButton>
                              )
                            ) : (row.data !== undefined && row.data !== '') || row.files !== undefined ? (
                              <>
                                <IconButton
                                  sx={{ color: 'green', cursor: 'pointer' }}
                                  onClick={() => {
                                    updateIndividualData(index);
                                  }}
                                >
                                  <CheckCircleIcon />
                                </IconButton>
                              </>
                            ) : (
                              <IconButton
                                sx={{ color: '#1565c0', cursor: 'pointer' }}
                                onClick={() => {
                                  let itemValue = disableInput[index];
                                  itemValue = false;
                                  let spreadData = [...disableInput];
                                  spreadData[index] = false;
                                  setDisableInput(spreadData);
                                }}
                              >
                                <CheckCircleIcon />
                              </IconButton>
                            )}
                          </TableCell>
                          <TableCell>{row.category}</TableCell>
                          <TableCell>{row.subcategory}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <br /> <br /> <br />
              </>
            </Box>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={2} xs={12} sm={12}>
                <Button variant="contained" color="primary" onClick={handleCheckListSubmit} sx={buttonStyles.buttonsubmit}>
                  Save
                </Button>
              </Grid>
              <Grid item md={2} xs={12} sm={12}>
                <Button variant="contained" color="primary" onClick={handleClearreason} sx={buttonStyles.btncancel}>
                  {' '}
                  Clear
                </Button>
              </Grid>
              <Grid item md={0.2} xs={12} sm={12}></Grid>
              <Grid item md={2} xs={12} sm={12}>
                <Button variant="contained" color="primary" onClick={handleCloseviewReleave} sx={buttonStyles.btncancel}>
                  {' '}
                  Close
                </Button>
              </Grid>
            </Grid>
          </>
        </Box>
      </Dialog>

      {/* print layout */}
      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table aria-label="simple table" id="branch" ref={componentRef}>
          <TableHead sx={{ fontWeight: '600' }}>
            <StyledTableRow>
              <StyledTableCell>SI.NO</StyledTableCell>
              <StyledTableCell>Empcode</StyledTableCell>
              <StyledTableCell>Name </StyledTableCell>
              <StyledTableCell>Department</StyledTableCell>
              <StyledTableCell>Work Mode</StyledTableCell>
              <StyledTableCell>Dob</StyledTableCell>
              <StyledTableCell>Personal Number</StyledTableCell>
              <StyledTableCell>Doj</StyledTableCell>
              <StyledTableCell>Experience</StyledTableCell>
              <StyledTableCell>Reporting To</StyledTableCell>
              {/* <StyledTableCell>Image</StyledTableCell> */}
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {filteredData &&
              filteredData.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>{row.empcode} </StyledTableCell>
                  <StyledTableCell> {row.companyname}</StyledTableCell>
                  <StyledTableCell>{row.department}</StyledTableCell>
                  <StyledTableCell>{row.workmode}</StyledTableCell>
                  <StyledTableCell>{row.dob ? moment(row.dob, 'YYYY-MM-DD').format('DD-MM-YYYY') : ''}</StyledTableCell>
                  <StyledTableCell>{row.contactpersonal}</StyledTableCell>
                  <StyledTableCell>{row.doj ? moment(row.doj, 'YYYY-MM-DD').format('DD-MM-YYYY') : ''}</StyledTableCell>
                  <StyledTableCell>{row.experience}</StyledTableCell>
                  <StyledTableCell>{row.reportingto}</StyledTableCell>
                  {/* <StyledTableCell>{row?.profileimage ? <img src={row?.profileimage} alt="temp" style={{ height: "100px", width: "100px" }} /> : ""}</StyledTableCell> */}
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ALERT DIALOG */}
      <Box>
        <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: '450px', textAlign: 'center', alignItems: 'center' }}>
            <Typography variant="h6">{showAlert}</Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" color="error" onClick={handleCloseerr}>
              Close
            </Button>
            <Button variant="contained" color="error" onClick={handleWithoutChecklistAssign}>
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      {/*Export XL Data  */}
      <Dialog open={isFilterOpen} onClose={handleCloseFilterMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent
          sx={{
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {fileFormat === 'xl' ? (
            <>
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

              <FaFileExcel style={{ fontSize: '80px', color: 'green' }} />
              <Typography variant="h5" sx={{ textAlign: 'center' }}>
                Choose Export
              </Typography>
            </>
          ) : (
            <>
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

              <FaFileCsv style={{ fontSize: '80px', color: 'green' }} />
              <Typography variant="h5" sx={{ textAlign: 'center' }}>
                Choose Export
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            variant="contained"
            onClick={(e) => {
              handleExportXL('filtered');
            }}
          >
            Export Filtered Data
          </Button>
          <Button
            autoFocus
            variant="contained"
            onClick={(e) => {
              handleExportXL('overall');
            }}
          >
            Export Over All Data
          </Button>
        </DialogActions>
      </Dialog>
      {/*Export pdf Data  */}
      <Dialog open={isPdfFilterOpen} onClose={handleClosePdfFilterMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent
          sx={{
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
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
              setIsPdfFilterOpen(false);
            }}
          >
            Export Filtered Data
          </Button>
          <Button
            variant="contained"
            onClick={(e) => {
              downloadPdf('overall');
              setIsPdfFilterOpen(false);
            }}
          >
            Export Over All Data
          </Button>
        </DialogActions>
      </Dialog>

      <Loader loading={loading} message={loadingMessage} />
      <DeleteConfirmation open={isDeleteOpen} onClose={handleCloseMod} onConfirm={deleteChecklist} title="Are you sure?" confirmButtonText="Yes" cancelButtonText="Cancel" />
      {/* SUCCESS */}
      <AlertDialog openPopup={openPopup} handleClosePopup={handleClosePopup} popupContent={popupContent} popupSeverity={popupSeverity} />
      <MessageAlert openPopup={openPopupMalert} handleClosePopup={handleClosePopupMalert} popupContent={popupContentMalert} popupSeverity={popupSeverityMalert} />

      <Dialog
        open={openQueue}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        fullWidth={true}
        sx={{
          marginTop: '50px',
          overflow: 'visible',
          '& .MuiPaper-root': {
            overflow: 'visible',
          },
        }}
      >
        <Box sx={{ padding: '20px 50px' }}>
          <>
            <Box sx={{ padding: '20px 30px' }}>
              <Grid container spacing={2}>
                <Grid item md={12} xs={12} sm={12}>
                  <Typography variant="h5" sx={{ color: 'black' }}>
                    This user is present in the queue priorities. Please choose a replacement user
                  </Typography>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <Typography>
                    Company<b style={{ color: 'red' }}>*</b>
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <MultiSelect
                      options={[
                        ...accessbranch?.map((data) => ({
                          label: data.company,
                          value: data.company,
                        })),
                      ].filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })}
                      value={selectedOptionsCompanyNew}
                      onChange={(e) => {
                        handleCompanyChangeNew(e);
                      }}
                      valueRenderer={customValueRendererCompanyNew}
                      labelledBy="Please Select Company"
                    />
                  </FormControl>
                </Grid>

                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography> Branch</Typography>
                    <MultiSelect
                      options={accessbranch
                        ?.filter((comp) => valueCompanyCatNew?.includes(comp.company))
                        ?.map((data) => ({
                          label: data.branch,
                          value: data.branch,
                        }))
                        .filter((item, index, self) => {
                          return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                        })}
                      value={selectedOptionsBranchNew}
                      onChange={(e) => {
                        handleBranchChangeNew(e);
                      }}
                      valueRenderer={customValueRendererBranchNew}
                      labelledBy="Please Select Branch"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography> Unit</Typography>
                    <MultiSelect
                      options={accessbranch
                        ?.filter((comp) => valueCompanyCatNew?.includes(comp.company) && valueBranchCatNew?.includes(comp.branch))
                        ?.map((data) => ({
                          label: data.unit,
                          value: data.unit,
                        }))
                        .filter((item, index, self) => {
                          return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                        })}
                      value={selectedOptionsUnitNew}
                      onChange={(e) => {
                        handleUnitChangeNew(e);
                      }}
                      valueRenderer={customValueRendererUnitNew}
                      labelledBy="Please Select Unit"
                      MenuProps={{
                        disablePortal: false, // Ensure the dropdown is rendered outside the dialog
                        style: { zIndex: 9999 }, // Ensure the dropdown appears above the dialog
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>Team</Typography>
                    <MultiSelect
                      options={allTeam
                        ?.filter((u) => valueCompanyCatNew?.includes(u.company) && valueBranchCatNew?.includes(u.branch) && valueUnitCatNew?.includes(u.unit))
                        .map((u) => ({
                          ...u,
                          label: u.teamname,
                          value: u.teamname,
                        }))}
                      value={selectedOptionsTeamNew}
                      onChange={(e) => {
                        handleTeamChangeNew(e);
                      }}
                      valueRenderer={customValueRendererTeamNew}
                      labelledBy="Please Select Team"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Employee</Typography>
                    <Selects
                      options={allUsersData
                        ?.filter((u) => valueCompanyCatNew?.includes(u.company) && valueBranchCatNew?.includes(u.branch) && valueUnitCatNew?.includes(u.unit) && valueTeamCatNew?.includes(u.team) && u?.workmode !== 'Internship')
                        .map((u) => ({
                          ...u,
                          label: u.companyname,
                          value: u.companyname,
                        }))}
                      value={{
                        label: filterState.employee,
                        value: filterState.employee,
                      }}
                      onChange={(e) => {
                        setFilterState((prev) => ({
                          ...prev,
                          employee: e.value,
                          branch: e.branch,
                          unit: e.unit,
                          team: e.team,
                        }));
                      }}
                      MenuProps={{
                        disablePortal: false, // Ensure the dropdown is rendered outside the dialog
                        style: { zIndex: 9999 }, // Ensure the dropdown appears above the dialog
                      }}
                    />
                  </FormControl>
                </Grid>

                <Grid
                  item
                  md={6}
                  xs={12}
                  sm={6}
                  mt={2}
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',

                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Grid>
                    <LoadingButton
                      // loading={btnLoading}
                      sx={buttonStyles.buttonsubmit}
                      onClick={handleReplaceUser}
                    >
                      Save
                    </LoadingButton>
                    &nbsp; &nbsp;
                    <Button sx={buttonStyles.btncancel} onClick={handleClear}>
                      {' '}
                      Clear{' '}
                    </Button>
                    &nbsp; &nbsp;
                    <Button sx={buttonStyles.btncancel} onClick={handleClearNew}>
                      {' '}
                      Cancel{' '}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </>
        </Box>
      </Dialog>
    </Box>

    //    another table
  );
}

export default PendingReleaveExitList;
