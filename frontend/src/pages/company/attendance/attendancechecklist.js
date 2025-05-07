import React, { useState, useEffect, useRef, useContext, useMemo, useCallback } from 'react';
import { handleApiError } from '../../../components/Errorhandling';
import { FaFileExcel, FaFileCsv, FaSearch, FaUndoAlt } from 'react-icons/fa';
import { Box, Typography, OutlinedInput, Select, MenuItem, DialogContent, DialogActions, FormControl, Grid, Button, List, ListItem, ListItemText, Popover, TextField, IconButton, InputAdornment, Tooltip, Chip } from '@mui/material';
import { userStyle, colourStyles } from '../../../pageStyle';
import moment from 'moment-timezone';
import { FaPrint, FaFilePdf } from 'react-icons/fa';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import axios from 'axios';
import { SERVICE } from '../../../services/Baseservice';
import { useReactToPrint } from 'react-to-print';
import { UserRoleAccessContext } from '../../../context/Appcontext';
import { AuthContext } from '../../../context/Appcontext';
import Headtitle from '../../../components/Headtitle';
import { ThreeDots } from 'react-loader-spinner';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import Switch from '@mui/material/Switch';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import { saveAs } from 'file-saver';
import LoadingButton from '@mui/lab/LoadingButton';
import { MultiSelect } from 'react-multi-select-component';
import Selects from 'react-select';
import { IoMdOptions } from 'react-icons/io';
import { MdClose } from 'react-icons/md';
import domtoimage from 'dom-to-image';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { DeleteConfirmation } from '../../../components/DeleteConfirmation.js';
import ExportData from '../../../components/ExportData';
import MessageAlert from '../../../components/MessageAlert';
import PageHeading from '../../../components/PageHeading';
import AlertDialog from '../../../components/Alert';
import AdvancedSearchBar from '../../../components/SearchbarEbList.js';
import ManageColumnsContent from '../../../components/ManageColumn';
import ResizeObserver from 'resize-observer-polyfill';
window.ResizeObserver = ResizeObserver;

function AttendanceCheckList() {
  // get current year
  const currentYear = new Date().getFullYear();

  // get current month in string name
  const monthstring = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const currentMonthIndex = new Date().getMonth();
  const currentMonthObject = {
    label: monthstring[currentMonthIndex],
    value: currentMonthIndex + 1,
  };
  const currentYearObject = { label: currentYear, value: currentYear };
  const years = Array.from(new Array(10), (val, index) => currentYear - index);
  const getyear = years.map((year) => {
    return { value: year, label: year };
  });

  const gridRefTableAttCheck = useRef(null);
  const gridRefImageAttCheck = useRef(null);
  const { isUserRoleAccess, isUserRoleCompare, isAssignBranch, allUsersLimit, allTeam, alldepartment, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);
  const [status, setStatus] = useState({});
  const [selectedCompany, setSelectedCompany] = useState([]);
  const [valueCompany, setValueCompany] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [valueBranch, setValueBranch] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState([]);
  const [valueUnit, setValueUnit] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState([]);
  const [valueTeam, setValueTeam] = useState([]);
  const [selectedDep, setSelectedDep] = useState([]);
  const [valueDep, setValueDep] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState([]);
  const [valueEmp, setValueEmp] = useState([]);
  const [userShifts, setUserShifts] = useState([]);
  const [attStatus, setAttStatus] = useState([]);
  const [attModearr, setAttModearr] = useState([]);
  const [attStatusOption, setAttStatusOption] = useState([]);
  const [loader, setLoader] = useState(false);
  // State to track advanced filter
  const [advancedFilter, setAdvancedFilter] = useState(null);
  const [gridApi, setGridApi] = useState(null);
  const [columnApi, setColumnApi] = useState(null);
  const [filteredDataItems, setFilteredDataItems] = useState(userShifts);
  const [filteredRowData, setFilteredRowData] = useState([]);
  const cuurentDate = new Date();

  const [filterUser, setFilterUser] = useState({
    filtertype: 'Individual',
    fromdate: moment(cuurentDate).format('YYYY-MM-DD'),
    todate: moment(cuurentDate).format('YYYY-MM-DD'),
  });
  const [isMonthyear, setIsMonthYear] = useState({
    ismonth: currentMonthObject,
    isyear: currentYearObject,
  });

  // Datatable
  const [pageAttCheck, setPageAttCheck] = useState(1);
  const [pageSizeAttCheck, setPageSizeAttCheck] = useState(10);
  const [searchQueryAttCheck, setSearchQueryAttCheck] = useState('');
  const [totalPagesAttCheck, setTotalPagesAttCheck] = useState(1);

  //Delete model
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
  };

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
  // pageAttCheck refersh reload
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

  // pageAttCheck refersh reload
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

  // Manage Columns
  const [isManageColumnsOpenAttCheck, setManageColumnsOpenAttCheck] = useState(false);
  const [anchorElAttCheck, setAnchorElAttCheck] = useState(null);
  const [searchQueryManageAttCheck, setSearchQueryManageAttCheck] = useState('');
  const handleOpenManageColumnsAttCheck = (event) => {
    setAnchorElAttCheck(event.currentTarget);
    setManageColumnsOpenAttCheck(true);
  };
  const handleCloseManageColumnsAttCheck = () => {
    setManageColumnsOpenAttCheck(false);
    setSearchQueryManageAttCheck('');
  };
  const openAttCheck = Boolean(anchorElAttCheck);
  const idAttCheck = openAttCheck ? 'simple-popover' : undefined;

  // Search bar
  const [anchorElSearchAttCheck, setAnchorElSearchAttCheck] = React.useState(null);
  const handleClickSearchAttCheck = (event) => {
    setAnchorElSearchAttCheck(event.currentTarget);
  };
  const handleCloseSearchAttCheck = () => {
    setAnchorElSearchAttCheck(null);
    setSearchQueryAttCheck('');
  };

  const openSearchAttCheck = Boolean(anchorElSearchAttCheck);
  const idSearchAttCheck = openSearchAttCheck ? 'simple-popover' : undefined;

  const [selectedMode, setSelectedMode] = useState('Today');
  const mode = [
    { label: 'Today', value: 'Today' },
    { label: 'Yesterday', value: 'Yesterday' },
    { label: 'Last Week', value: 'Last Week' },
    { label: 'Last Month', value: 'Last Month' },
    { label: 'Custom', value: 'Custom' },
  ];

  const modeOptions = [
    { label: 'Department', value: 'Department' },
    { label: 'Employee', value: 'Employee' },
  ];

  const [btnSubmit, setBtnSubmit] = useState(false);

  // Show All Columns & Manage Columns
  const initialColumnVisibilityAttCheck = {
    checkbox: true,
    serialNumber: true,
    empcode: true,
    username: true,
    company: true,
    branch: true,
    unit: true,
    department: true,
    date: true,
    shift: true,
    leavestatus: true,
    permissionstatus: true,
    clockin: true,
    clockout: true,
    clockinstatus: true,
    clockoutstatus: true,
    attendance: true,
    actions: true,
  };
  const [columnVisibilityAttCheck, setColumnVisibilityAttCheck] = useState(initialColumnVisibilityAttCheck);

  useEffect(() => {
    fetchAttedanceStatus();
    fetchAttedanceMode();
    // document.getElementById("to-date").min = moment(cuurentDate).format("YYYY-MM-DD");
  }, []);

  // Table row color
  const getRowStyle = (params) => {
    if (params.node.rowIndex % 2 === 0) {
      return { background: '#f0f0f0' }; // Even row
    } else {
      return { background: '#ffffff' }; // Odd row
    }
  };

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
      pagename: String('Attendance Checklist'),
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

  const getDateRange = (mode) => {
    const today = new Date();
    let fromdate, todate;

    const formatDate = (date) => {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };

    switch (mode) {
      case 'Today':
        fromdate = todate = formatDate(today);
        break;
      case 'Yesterday':
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        fromdate = todate = formatDate(yesterday);
        break;
      case 'Last Week':
        const startOfLastWeek = new Date(today);
        startOfLastWeek.setDate(today.getDate() - ((today.getDay() + 6) % 7) - 7); // Last Monday
        const endOfLastWeek = new Date(startOfLastWeek);
        endOfLastWeek.setDate(startOfLastWeek.getDate() + 6); // Last Sunday
        fromdate = formatDate(startOfLastWeek);
        todate = formatDate(endOfLastWeek);
        break;
      case 'Last Month':
        fromdate = formatDate(new Date(today.getFullYear(), today.getMonth() - 1, 1)); // 1st of last month
        todate = formatDate(new Date(today.getFullYear(), today.getMonth(), 0)); // Last day of last month
        break;
      default:
        fromdate = todate = '';
    }

    return { fromdate, todate };
  };

  const formatDateForInput = (date) => {
    if (isNaN(date.getTime())) {
      return '';
    }
    return date.toISOString().split('T')[0];
  };

  //get all Sub vendormasters.
  const fetchAttedanceStatus = async () => {
    setPageName(!pageName);
    try {
      let res_vendor = await axios.get(SERVICE.ATTENDANCE_STATUS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setAttStatus(res_vendor?.data?.attendancestatus);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const fetchAttedanceMode = async () => {
    setPageName(!pageName);
    try {
      let res_vendor = await axios.get(SERVICE.ATTENDANCE_MODE_STATUS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAttModearr(res_vendor?.data?.allattmodestatus);
      let result = res_vendor?.data?.allattmodestatus.filter((data, index) => {
        return data.appliedthrough != 'Auto';
      });

      let finalresult = [
        // { label: 'Remove Clockin', value: 'Remove Clockin' },
        // { label: 'Remove Clockout', value: 'Remove Clockout' },
        { label: 'Remove Clockin/Clockout', value: 'Remove Clockin/Clockout' },
        ...result.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];

      setAttStatusOption(finalresult);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

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
    // Remove duplicates based on the 'company', 'branch', and 'unit' fields
    const uniqueIsAssignBranch = accessbranch?.reduce((acc, current) => {
      const x = acc.find((item) => item.company === current.company && item.branch === current.branch && item.unit === current.unit);
      if (!x) {
        acc.push(current);
      }
      return acc;
    }, []);

    // Create company options
    const company = [...new Set(uniqueIsAssignBranch.map((data) => data.company))].map((data) => ({
      label: data,
      value: data,
    }));
    setSelectedCompany(company);
    setValueCompany(company.map((a) => a.value));

    // Create branch options based on selected company
    const branch = uniqueIsAssignBranch
      .filter((val) => company.some((comp) => comp.value === val.company))
      .map((data) => ({
        label: data.branch,
        value: data.branch,
      }))
      .filter((item, index, self) => {
        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
      });
    setSelectedBranch(branch);
    setValueBranch(branch.map((a) => a.value));

    // Create unit options based on selected branch
    const unit = uniqueIsAssignBranch
      .filter((val) => company.some((comp) => comp.value === val.company) && branch.some((br) => br.value === val.branch))
      .map((data) => ({
        label: data.unit,
        value: data.unit,
      }))
      .filter((item, index, self) => {
        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
      });
    setSelectedUnit(unit);
    setValueUnit(unit.map((a) => a.value));

    // Create team options based on selected company, branch, and unit
    const team = allTeam
      ?.filter((val) => company.some((comp) => comp.value === val.company) && branch.some((br) => br.value === val.branch) && unit.some((uni) => uni.value === val.unit))
      .map((data) => ({
        label: data.teamname,
        value: data.teamname,
      }));
    setSelectedTeam(team);
    setValueTeam(team.map((a) => a.value));

    const allemployees = allUsersLimit
      ?.filter((val) => company.some((comp) => comp.value === val.company) && branch.some((br) => br.value === val.branch) && unit.some((uni) => uni.value === val.unit) && team.some((team) => team.value === val.team))
      .map((data) => ({
        label: data.companyname,
        value: data.companyname,
      }));
    setSelectedEmp(allemployees);
    setValueEmp(allemployees.map((a) => a.value));
  }, [isAssignBranch, allTeam]);

  //company multiselect
  const handleCompanyChange = (options) => {
    setValueCompany(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedCompany(options);
    setSelectedBranch([]);
    setValueBranch([]);
    setSelectedUnit([]);
    setValueUnit([]);
    setSelectedTeam([]);
    setValueTeam([]);
    setSelectedDep([]);
    setValueDep([]);
    setSelectedEmp([]);
    setValueEmp([]);
  };

  const customValueRendererCompany = (valueCompany, _categoryname) => {
    return valueCompany?.length ? valueCompany.map(({ label }) => label)?.join(', ') : 'Please Select Company';
  };

  //branchto multiselect dropdown changes
  const handleBranchChange = (options) => {
    setSelectedBranch(options);
    setValueBranch(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedUnit([]);
    setValueUnit([]);
    setSelectedTeam([]);
    setValueTeam([]);
    setSelectedEmp([]);
    setValueEmp([]);
    setSelectedDep([]);
    setValueDep([]);
  };

  const customValueRendererBranch = (valueCate, _employeename) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(', ') : 'Please select Branch';
  };

  // unitto multiselect dropdown changes
  const handleUnitChange = (options) => {
    setSelectedUnit(options);
    setValueUnit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedTeam([]);
    setValueTeam([]);
    setSelectedEmp([]);
    setValueEmp([]);
  };
  const customValueRendererUnit = (valueCate, _employeename) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(', ') : 'Please select Unit';
  };

  //Teamto multiselect dropdown changes
  const handleTeamChange = (options) => {
    setSelectedTeam(options);
    setValueTeam(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedEmp([]);
    setValueEmp([]);
  };
  const customValueRendererTeam = (valueCate, _employeename) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(', ') : 'Please select Team';
  };

  // Employee
  const handleEmployeeChange = (options) => {
    setSelectedEmp(options);
    setValueEmp(
      options.map((a, index) => {
        return a.value;
      })
    );
  };

  const customValueRendererEmp = (valueCate, _employees) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(', ') : 'Please Select Employee';
  };

  const [searchInputValue, setSearchInputValue] = useState('');
  const [isBoxFocused, setIsBoxFocused] = React.useState(false);

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
  }, [allUsersLimit, valueCompany, valueBranch, valueUnit, valueTeam]);

  const updateEmployees = (pastedNames) => {
    const namesArray = Array.isArray(pastedNames) ? pastedNames : [];

    const availableOptions = allUsersLimit?.filter((comp) => valueCompany?.includes(comp.company) && valueBranch?.includes(comp.branch) && valueUnit?.includes(comp.unit) && valueTeam?.includes(comp.team))?.map((data) => data.companyname.replace(/\s*\.\s*/g, '.').trim());

    const matchedValues = namesArray.filter((name) => availableOptions.includes(name.replace(/\s*\.\s*/g, '.').trim()));

    // Update selected options
    const newOptions = matchedValues.map((value) => ({
      label: value,
      value: value,
    }));

    setSelectedEmp((prev) => {
      const newValues = newOptions.filter((newOpt) => !prev.some((prevOpt) => prevOpt.value === newOpt.value));
      return [...prev, ...newValues];
    });

    // Update other states...
    setValueEmp((prev) => [...new Set([...prev, ...matchedValues])]);
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
    setSelectedEmp((current) => current.filter((emp) => emp.value !== value));
    setValueEmp((current) => current.filter((empValue) => empValue !== value));
  };

  // Department
  const handleDepartmentChange = (options) => {
    setSelectedDep(options);
    setValueDep(
      options.map((a, index) => {
        return a.value;
      })
    );
  };

  const customValueRendererDepartment = (valueDep, _categoryname) => {
    return valueDep?.length ? valueDep.map(({ label }) => label)?.join(', ') : 'Please Select Department';
  };

  const getattendancestatus = (alldata) => {
    // console.log(alldata?.rowformattedDate, alldata?.clockinstatus, alldata?.clockoutstatus, 'attStatus')
    let result = attStatus.filter((data, index) => {
      return data?.clockinstatus === alldata?.clockinstatus && data?.clockoutstatus === alldata?.clockoutstatus;
    });
    // console.log(result[0]?.name)
    return result[0]?.name;
  };

  const getAttModeAppliedThr = (rowdaystatus) => {
    let result = attModearr.filter((data, index) => {
      return data?.name === rowdaystatus
    })
    return result[0]?.appliedthrough
  }

  const getAttModeLop = (rowdaystatus) => {
    let result = attModearr.filter((data, index) => {
      return data?.name === rowdaystatus
    })
    return result[0]?.lop === true ? 'Yes' : 'No';
  }

  const getAttModeLopType = (rowdaystatus) => {
    let result = attModearr.filter((data, index) => {
      return data?.name === rowdaystatus
    })
    return result[0]?.loptype
  }

  const getFinalLop = (rowlop, rowloptype) => {
    return (rowloptype === undefined || rowloptype === "") ? rowlop : (rowlop + ' - ' + rowloptype);
  }

  const getAttModeTarget = (rowdaystatus) => {
    let result = attModearr.filter((data, index) => {
      return data?.name === rowdaystatus
    })
    return result[0]?.target === true ? 'Yes' : 'No';
  }

  const getAttModePaidPresent = (rowdaystatus) => {
    let result = attModearr.filter((data, index) => {
      return data?.name === rowdaystatus
    })
    return result[0]?.paidleave === true ? 'Yes' : 'No';
  }

  const getAttModePaidPresentType = (rowdaystatus) => {
    let result = attModearr.filter((data, index) => {
      return data?.name === rowdaystatus
    })
    return result[0]?.paidleavetype;
  }

  const getFinalPaid = (rowpaid, rowpaidtype) => {
    return (rowpaidtype === undefined || rowpaidtype === "") ? rowpaid : (rowpaid + ' - ' + rowpaidtype);
  }

  const getAssignLeaveDayForLop = (rowlopday) => {
    if (rowlopday === 'Yes - Double Day') {
      return '2'
    } else if (rowlopday === 'Yes - Full Day') {
      return '1';
    } else if (rowlopday === 'Yes - Half Day') {
      return '0.5'
    } else {
      return '0';
    }
  }

  const getAssignLeaveDayForPaid = (rowpaidday) => {
    if (rowpaidday === 'Yes - Double Day') {
      return '2'
    } else if (rowpaidday === 'Yes - Full Day') {
      return '1';
    } else if (rowpaidday === 'Yes - Half Day') {
      return '0.5'
    } else {
      return '0';
    }
  }

  const getIsWeekoff = (rowdaystatus) => {
    let result = attModearr.filter((data, index) => {
      return data?.name === rowdaystatus;
    })
    return result[0]?.weekoff === true ? 'Yes' : 'No';
  }

  const getIsHoliday = (rowdaystatus) => {
    let result = attModearr.filter((data, index) => {
      return data?.name === rowdaystatus;
    })
    return result[0]?.holiday === true ? 'Yes' : 'No';
  }

  // get week for month's start to end
  function getWeekNumberInMonth(date) {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const dayOfWeek = firstDayOfMonth.getDay(); // 0 (Sunday) to 6 (Saturday)

    // If the first day of the month is not Monday (1), calculate the adjustment
    const adjustment = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    // Calculate the day of the month adjusted for the starting day of the week
    const dayOfMonthAdjusted = date.getDate() + adjustment;

    // Calculate the week number based on the adjusted day of the month
    const weekNumber = Math.ceil(dayOfMonthAdjusted / 7);

    return weekNumber;
  }

  function getMonthsInRange(fromdate, todate) {
    const startDate = new Date(fromdate);
    const endDate = new Date(todate);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const result = [];

    // Previous month based on `fromdate`
    const prevMonth = startDate.getMonth() === 0 ? 11 : startDate.getMonth() - 1;
    const prevYear = startDate.getMonth() === 0 ? startDate.getFullYear() - 1 : startDate.getFullYear();
    result.push({ month: monthNames[prevMonth], year: prevYear.toString() });

    // Add selected months between `fromdate` and `todate`
    const currentDate = new Date(startDate);
    currentDate.setDate(1); // Normalize to the start of the month
    while (currentDate.getFullYear() < endDate.getFullYear() || (currentDate.getFullYear() === endDate.getFullYear() && currentDate.getMonth() <= endDate.getMonth())) {
      result.push({
        month: monthNames[currentDate.getMonth()],
        year: currentDate.getFullYear().toString(),
      });
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    // Next month based on `todate`
    const nextMonth = endDate.getMonth() === 11 ? 0 : endDate.getMonth() + 1;
    const nextYear = endDate.getMonth() === 11 ? endDate.getFullYear() + 1 : endDate.getFullYear();
    result.push({ month: monthNames[nextMonth], year: nextYear.toString() });

    return result;
  }

  const fetchFilteredUsersStatus = async () => {
    setPageName(!pageName);
    setUserShifts([]);
    setLoader(true);
    setPageAttCheck(1);
    setPageSizeAttCheck(10);

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;

    // let startMonthDate = new Date(filterUser.fromdate);
    // let endMonthDate = new Date(filterUser.todate);

    // const daysArray = [];
    // while (startMonthDate <= endMonthDate) {
    //   const formattedDate = `${String(startMonthDate.getDate()).padStart(
    //     2,
    //     "0"
    //   )}/${String(startMonthDate.getMonth() + 1).padStart(
    //     2,
    //     "0"
    //   )}/${startMonthDate.getFullYear()}`;
    //   const dayName = startMonthDate.toLocaleDateString("en-US", {
    //     weekday: "long",
    //   });
    //   const dayCount = startMonthDate.getDate();
    //   const shiftMode = "Main Shift";
    //   const weekNumberInMonth =
    //     getWeekNumberInMonth(startMonthDate) === 1
    //       ? `${getWeekNumberInMonth(startMonthDate)}st Week`
    //       : getWeekNumberInMonth(startMonthDate) === 2
    //         ? `${getWeekNumberInMonth(startMonthDate)}nd Week`
    //         : getWeekNumberInMonth(startMonthDate) === 3
    //           ? `${getWeekNumberInMonth(startMonthDate)}rd Week`
    //           : getWeekNumberInMonth(startMonthDate) > 3
    //             ? `${getWeekNumberInMonth(startMonthDate)}th Week`
    //             : "";

    //   daysArray.push({
    //     formattedDate,
    //     dayName,
    //     dayCount,
    //     shiftMode,
    //     weekNumberInMonth,
    //   });

    //   // Move to the next day
    //   startMonthDate.setDate(startMonthDate.getDate() + 1);
    // }

    try {
      let res_emp = await axios.post(SERVICE.USER_FOR_ALL_ATTENDANCE_PAGE_INDIVIDUAL_TYPE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        type: filterUser.filtertype,
        company: [...valueCompany],
        branch: [...valueBranch],
        unit: [...valueUnit],
        team: [...valueTeam],
        employee: [...valueEmp],
        department: [...valueDep],
        assignbranch: accessbranch,
      });

      let res = await axios.get(`${SERVICE.GET_ATTENDANCE_CONTROL_CRITERIA}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let attendanceCriteriaData = res?.data?.attendancecontrolcriteria[0];

      // console.log(res_emp?.data?.users.length, 'userResult')
      function splitArray(array, chunkSize) {
        const resultarr = [];
        for (let i = 0; i < array.length; i += chunkSize) {
          const chunk = array.slice(i, i + chunkSize);
          resultarr.push({
            data: chunk,
          });
        }
        return resultarr;
      }

      let employeelistnames = res_emp?.data?.users.length > 0 ? [...new Set(res_emp?.data?.users.map((item) => item.companyname))] : [];
      const resultarr = splitArray(employeelistnames, 10);
      // console.log(resultarr.length, 'resultarr')

      const montharray = getMonthsInRange(filterUser.fromdate, filterUser.todate);

      async function sendBatchRequest(batch) {
        try {
          let res_applyleave = await axios.post(SERVICE.APPLYLEAVE_APPROVED, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            employee: batch.data,
          });

          let leaveresult = res_applyleave?.data?.applyleaves?.filter(data => data.leavetype !== 'Leave Without Pay (LWP)');
          let leaveresultWithoutPay = res_applyleave?.data?.applyleaves?.filter(data => data.leavetype === 'Leave Without Pay (LWP)');

          let res = await axios.post(SERVICE.USER_CLOCKIN_CLOCKOUT_STATUS_FILTER, {
            employee: batch.data,
            fromdate: filterUser.fromdate,
            todate: filterUser.todate,
            montharray: [...montharray],
          },
            {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
            }
          );

          let res_type = await axios.get(SERVICE.LEAVETYPE, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          });

          let resdatawithlwp = [...res_type?.data?.leavetype, { leavetype: 'Leave Without Pay (LWP)', code: "LWP" }]

          let leavestatusApproved = [];
          resdatawithlwp?.map((type) => {
            res_applyleave?.data?.applyleaves && res_applyleave?.data?.applyleaves?.forEach((d) => {
              if (type.leavetype === d.leavetype && d.tookleavecheckstatus === 'Single' && d.leavestatus === 'Shift') {
                leavestatusApproved.push(type.code + ' ' + d.status)
              }
              if (type.leavetype === d.leavetype && d.tookleavecheckstatus === 'Double' && d.leavestatus === 'Shift') {
                leavestatusApproved.push('DL' + ' - ' + type.code + ' ' + d.status)
              }
              if (type.leavetype === d.leavetype && d.tookleavecheckstatus === 'Double Day' && d.leavestatus === 'Shift') {
                leavestatusApproved.push('DDL' + ' - ' + type.code + ' ' + d.status)
              }
            });
          });

          const rearr = [...new Set(leavestatusApproved)];

          // console.log(rearr, 'rearr')

          const filtered = res?.data?.finaluser?.filter((d) => {
            const formattedDate = new Date(d.finalDate);
            const reasonDate = new Date(d.reasondate);
            const dojDate = new Date(d.doj);

            if (d.reasondate && d.reasondate !== '') {
              return formattedDate <= reasonDate;
            } else if (d.doj && d.doj !== '') {
              return formattedDate >= dojDate;
            } else {
              return d;
            }
          });
          // console.log(filtered, 'filtered')

          const updateResult = filtered?.map((data) => {
            data.attendanceautostatus === '' || data.attendanceautostatus == undefined ? (data.dbattendancestatus = 'NOTFOUND') : (data.dbattendancestatus = 'FOUND');
            data.attendanceautostatus === '' ? (data.attendanceautostatus = getattendancestatus(data)) : (data.attendanceautostatus = data.attendanceautostatus);

            return data;
          });
          // console.log(updateResult, 'updateResult')
          const changedWeekoffResult = updateResult?.map((item) => {
            // Adjust clockinstatus based on lateclockincount
            let updatedClockInStatus = item.clockinstatus;
            // Adjust clockoutstatus based on earlyclockoutcount
            let updatedClockOutStatus = item.clockoutstatus;

            // Filter out only 'Absent' items for the current employee
            const absentItems = updateResult?.filter(d => d.clockinstatus === 'Absent' && d.clockoutstatus === 'Absent' && item.empcode === d.empcode && d.clockin === '00:00:00' && d.clockout === '00:00:00' && item.attendanceautostatus === 'ABSENT');

            // Check if the day before and after a 'Week Off' date is marked as 'Leave' or 'Absent'
            if (item.clockinstatus === 'Week Off' && item.clockoutstatus === 'Week Off') {
              // Define the date format for comparison
              const itemDate = moment(item.rowformattedDate, "DD/MM/YYYY");

              const isPreviousDayLeave = leaveresult.some(leaveItem => moment(leaveItem.date, "DD/MM/YYYY").isSame(itemDate.clone().subtract(1, 'days'), 'day') && leaveItem.empcode === item.empcode);
              const isPreviousDayAbsent = absentItems.some(absentItem => moment(absentItem.rowformattedDate, "DD/MM/YYYY").isSame(itemDate.clone().subtract(1, 'days'), 'day') && absentItem.empcode === item.empcode);

              const isNextDayLeave = leaveresult.some(leaveItem => moment(leaveItem.date, "DD/MM/YYYY").isSame(itemDate.clone().add(1, 'days'), 'day') && leaveItem.empcode === item.empcode);
              const isNextDayAbsent = absentItems.some(absentItem => moment(absentItem.rowformattedDate, "DD/MM/YYYY").isSame(itemDate.clone().add(1, 'days'), 'day') && absentItem.empcode === item.empcode);

              const isPreviousDayLeaveWithoutPay = leaveresultWithoutPay.some(leaveItem => moment(leaveItem.date, "DD/MM/YYYY").isSame(itemDate.clone().subtract(1, 'days'), 'day') && leaveItem.empcode === item.empcode);
              const isNextDayLeaveWithoutPay = leaveresultWithoutPay.some(leaveItem => moment(leaveItem.date, "DD/MM/YYYY").isSame(itemDate.clone().add(1, 'days'), 'day') && leaveItem.empcode === item.empcode);

              if (isPreviousDayLeave) {
                updatedClockInStatus = 'BeforeWeekOffLeave';
                updatedClockOutStatus = 'BeforeWeekOffLeave';
              }
              if (isPreviousDayAbsent) {
                updatedClockInStatus = 'BeforeWeekOffAbsent';
                updatedClockOutStatus = 'BeforeWeekOffAbsent';
              }
              if (isPreviousDayLeaveWithoutPay) {
                updatedClockInStatus = 'BeforeWeekOffAbsent';
                updatedClockOutStatus = 'BeforeWeekOffAbsent';
              }
              if (isNextDayLeave) {
                updatedClockInStatus = 'AfterWeekOffLeave';
                updatedClockOutStatus = 'AfterWeekOffLeave';
              }
              if (isNextDayAbsent) {
                updatedClockInStatus = 'AfterWeekOffAbsent';
                updatedClockOutStatus = 'AfterWeekOffAbsent';
              }
              if (isNextDayLeaveWithoutPay) {
                updatedClockInStatus = 'AfterWeekOffAbsent';
                updatedClockOutStatus = 'AfterWeekOffAbsent';
              }

              if (isPreviousDayLeave && isNextDayLeave) {
                updatedClockInStatus = "BeforeAndAfterWeekOffLeave";
                updatedClockOutStatus = "BeforeAndAfterWeekOffLeave";
              }
              // console.log(isPreviousDayAbsent && isNextDayAbsent, 'isPreviousDayAbsent && isNextDayAbsent')
              if (isPreviousDayAbsent && isNextDayAbsent) {
                updatedClockInStatus = "BeforeAndAfterWeekOffAbsent";
                updatedClockOutStatus = "BeforeAndAfterWeekOffAbsent";
              }
              if (isPreviousDayLeaveWithoutPay && isNextDayLeaveWithoutPay) {
                updatedClockInStatus = "BeforeAndAfterWeekOffAbsent";
                updatedClockOutStatus = "BeforeAndAfterWeekOffAbsent";
              }
            }

            return {
              ...item,
              clockinstatus: updatedClockInStatus,
              clockoutstatus: updatedClockOutStatus,
            };
          });

          const resultBefore = [];

          const empGrouped = {};

          changedWeekoffResult.forEach(item => {
            if (!empGrouped[item.empcode]) empGrouped[item.empcode] = [];
            empGrouped[item.empcode].push(item);
          });

          const leaveStatuses = [
            ...rearr,
            "Absent", "BL - Absent",
          ];

          // console.log(leaveStatuses, 'leaveStatuses')
          Object.keys(empGrouped).forEach(empcode => {
            const records = empGrouped[empcode]
              .sort((a, b) => moment(a.rowformattedDate, "DD/MM/YYYY") - moment(b.rowformattedDate, "DD/MM/YYYY"));

            let streak = [];
            let counterIn = 1;
            let counterOut = 1;

            for (let i = 0; i < records.length; i++) {
              const current = records[i];
              const isWeekOff = current.shift === "Week Off";

              const isLeaveDay =
                current.clockin === "00:00:00" &&
                current.clockout === "00:00:00" &&
                leaveStatuses.includes(current.clockinstatus) &&
                !isWeekOff;

              if (isLeaveDay) {
                streak.push(current);
              } else if (isWeekOff) {
                // Push Week Off directly, don’t reset streak
                resultBefore.push(current);
              } else {
                // Encountered present day, finalize streak
                if (streak.length > attendanceCriteriaData?.longabsentcount) {
                  streak.forEach(day => {
                    let clockinstatus = day.clockinstatus;
                    let clockoutstatus = day.clockoutstatus;

                    if (clockinstatus === "Absent") {
                      clockinstatus = `${counterIn++}Long Absent`;
                    } else if (clockinstatus === "BL - Absent") {
                      clockinstatus = `${counterIn++}Long BL - Absent`;
                    } else if (rearr?.includes(clockinstatus)) {
                      clockinstatus = `${counterIn++}Long Leave ${rearr?.filter(d => d === clockinstatus)}`;
                    }

                    if (clockoutstatus === "Absent") {
                      clockoutstatus = `${counterOut++}Long Absent`;
                    } else if (clockoutstatus === "BL - Absent") {
                      clockoutstatus = `${counterOut++}Long BL - Absent`;
                    } else if (rearr?.includes(clockoutstatus)) {
                      clockoutstatus = `${counterOut++}Long Leave ${rearr?.filter(d => d === clockoutstatus)}`;
                    }

                    resultBefore.push({
                      ...day,
                      clockinstatus,
                      clockoutstatus
                    });
                  });
                } else {
                  resultBefore.push(...streak); // push as-is
                }

                resultBefore.push(current); // current present day
                streak = [];
                counterIn = 1;
                counterOut = 1;
              }
            }

            // Remaining streak at end
            if (streak.length > attendanceCriteriaData?.longabsentcount) {
              streak.forEach(day => {
                let clockinstatus = day.clockinstatus;
                let clockoutstatus = day.clockoutstatus;

                if (clockinstatus === "Absent") {
                  clockinstatus = `${counterIn++}Long Absent`;
                } else if (clockinstatus === "BL - Absent") {
                  clockinstatus = `${counterIn++}Long BL - Absent`;
                } else if (rearr?.includes(clockinstatus)) {
                  clockinstatus = `${counterIn++}Long Leave ${rearr?.filter(d => d === clockinstatus)}`;
                }

                if (clockoutstatus === "Absent") {
                  clockoutstatus = `${counterOut++}Long Absent`;
                } else if (clockoutstatus === "BL - Absent") {
                  clockoutstatus = `${counterOut++}Long BL - Absent`;
                } else if (rearr?.includes(clockoutstatus)) {
                  clockoutstatus = `${counterOut++}Long Leave ${rearr?.filter(d => d === clockoutstatus)}`;
                }

                resultBefore.push({
                  ...day,
                  clockinstatus,
                  clockoutstatus
                });
              });
            } else {
              resultBefore.push(...streak);
            }
          });
          resultBefore.sort((a, b) => moment(a.rowformattedDate, "DD/MM/YYYY") - moment(b.rowformattedDate, "DD/MM/YYYY"));
          // console.log(resultBefore, 'resultBefore')

          // Group data by empcode
          let groupedData = {};
          resultBefore.forEach((item) => {
            if (!groupedData[item.empcode]) {
              groupedData[item.empcode] = {
                attendanceRecords: [],
                departmentDateSet: item.departmentDateSet || [],
              };
            }
            groupedData[item.empcode].attendanceRecords.push(item);
          });
          // console.log(groupedData, 'groupedData')
          let result = [];

          for (let empcode in groupedData) {
            let { attendanceRecords, departmentDateSet } = groupedData[empcode];

            departmentDateSet.forEach((dateRange) => {
              let { fromdate, todate, department } = dateRange;

              let countByEmpcodeClockin = {};
              let countByEmpcodeClockout = {};

              let recordsInDateRange = attendanceRecords.filter((record) => {
                let formattedDate = new Date(record.finalDate);
                return department === record.department && formattedDate >= new Date(fromdate) && formattedDate <= new Date(todate);
              });

              let processedRecords = recordsInDateRange.map((item) => {
                let formattedDate = new Date(item.finalDate);
                let reasonDate = item.reasondate ? new Date(item.reasondate) : null;
                let dojDate = item.doj ? new Date(item.doj) : null;

                let updatedClockInStatus = item.clockinstatus;
                let updatedClockOutStatus = item.clockoutstatus;

                // Check if the date falls within the reasonDate or dojDate
                if (reasonDate && formattedDate <= reasonDate) {
                  return null;
                }
                if (dojDate && formattedDate < dojDate) {
                  return null;
                }

                // Handling Late Clock-in and Early Clock-out
                if (!countByEmpcodeClockin[item.empcode]) {
                  countByEmpcodeClockin[item.empcode] = 1;
                }
                if (!countByEmpcodeClockout[item.empcode]) {
                  countByEmpcodeClockout[item.empcode] = 1;
                }

                if (updatedClockInStatus === "Late - ClockIn") {
                  updatedClockInStatus = `${countByEmpcodeClockin[item.empcode]}Late - ClockIn`;
                  countByEmpcodeClockin[item.empcode]++;
                }

                if (updatedClockOutStatus === "Early - ClockOut") {
                  updatedClockOutStatus = `${countByEmpcodeClockout[item.empcode]}Early - ClockOut`;
                  countByEmpcodeClockout[item.empcode]++;
                }

                // console.log(item.rowformattedDate, updatedClockInStatus, updatedClockOutStatus)

                return {
                  ...item,
                  department,
                  fromdate,
                  todate,
                  clockinstatus: updatedClockInStatus,
                  clockoutstatus: updatedClockOutStatus,
                };
              });

              result.push(...processedRecords.filter(Boolean));
            });
          }
          // console.log(result, 'result')
          // let filteredResult = valueDep.length > 0 ? (result?.filter((data) => valueDep.includes(data.department))) : result;
          return result;
        } catch (err) {
          console.error('Error in POST request for batch:', batch.data, err);
        }
      }

      async function getAllResults() {
        let allResults = [];
        for (let batch of resultarr) {
          const finaldata = await sendBatchRequest(batch);
          allResults = allResults.concat(finaldata);
        }

        return { allResults }; // Return both results as an object
      }

      getAllResults().then(async (results) => {
        const itemsWithSerialNumber = results.allResults?.map((item) => {
          return {
            ...item,
            id: item.id,
            shift: item.changeshift ? item.changeshift : item.shift,
            attendance: getattendancestatus(item),
            // daystatus: item.daystatus ? item.daystatus : item.daystatus,
            daystatus: item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item),
            shiftmode: item.shiftMode,
            appliedthrough: getAttModeAppliedThr(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
            lop: getAttModeLop(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
            loptype: getAttModeLopType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
            lopcalculation: getFinalLop(
              getAttModeLop(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
              getAttModeLopType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item))
            ),
            modetarget: getAttModeTarget(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
            paidpresentbefore: getAttModePaidPresent(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
            paidleavetype: getAttModePaidPresentType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
            paidpresent: getFinalPaid(
              getAttModePaidPresent(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
              getAttModePaidPresentType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item))
            ),
            lopday: getAssignLeaveDayForLop(
              getFinalLop(
                getAttModeLop(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
                getAttModeLopType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item))
              )
            ),
            paidpresentday: getAssignLeaveDayForPaid(
              getFinalPaid(
                getAttModePaidPresent(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
                getAttModePaidPresentType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item))
              )
            ),
            isweekoff: getIsWeekoff(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
            isholiday: getIsHoliday(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
          };
        });
        const weekOption = ['BeforeWeekOffAbsent', 'AfterWeekOffAbsent', 'BeforeWeekOffLeave', 'AfterWeekOffLeave', 'BeforeAndAfterWeekOffAbsent', 'BeforeAndAfterWeekOffLeave'];
        itemsWithSerialNumber.forEach((item, index, array) => {
          const previousItem = array[index - 1];
          const nextItem = array[index + 1];

          if (item.shift === 'Week Off') {

            const isLopRelevant = (entry) => entry && (entry.lopcalculation === 'Yes - Full Day' || entry.lopcalculation === 'Yes - Double Day');

            const isPreviousManualPaidFull =
              previousItem &&
              previousItem.appliedthrough === 'Manual' &&
              previousItem.paidpresent === 'Yes - Full Day';

            const isNextManualPaidFull =
              nextItem &&
              nextItem.appliedthrough === 'Manual' &&
              nextItem.paidpresent === 'Yes - Full Day';

            const isPrevLop = isLopRelevant(previousItem) && !isPreviousManualPaidFull;
            const isNextLop = isLopRelevant(nextItem) && !isNextManualPaidFull;

            if (isPrevLop && isNextLop) {
              item.clockinstatus = 'BeforeAndAfterWeekOffAbsent';
              item.clockoutstatus = 'BeforeAndAfterWeekOffAbsent';
            } else if (isPrevLop) {
              item.clockinstatus = 'BeforeWeekOffAbsent';
              item.clockoutstatus = 'BeforeWeekOffAbsent';
            } else if (isNextLop) {
              item.clockinstatus = 'AfterWeekOffAbsent';
              item.clockoutstatus = 'AfterWeekOffAbsent';
            }

            // Recalculate attendance status if needed
            item.attendance = getattendancestatus(item);
            item.daystatus = item.attendanceautostatus || getattendancestatus(item);
            item.appliedthrough = getAttModeAppliedThr(item.attendanceautostatus || getattendancestatus(item));
            item.lop = getAttModeLop(item.attendanceautostatus || getattendancestatus(item));
            item.loptype = getAttModeLopType(item.attendanceautostatus || getattendancestatus(item));
            item.lopcalculation = getFinalLop(
              getAttModeLop(item.attendanceautostatus || getattendancestatus(item)),
              getAttModeLopType(item.attendanceautostatus || getattendancestatus(item))
            );
            item.modetarget = getAttModeTarget(item.attendanceautostatus || getattendancestatus(item));
            item.paidpresentbefore = getAttModePaidPresent(item.attendanceautostatus || getattendancestatus(item));
            item.paidleavetype = getAttModePaidPresentType(item.attendanceautostatus || getattendancestatus(item));
            item.paidpresent = getFinalPaid(
              getAttModePaidPresent(item.attendanceautostatus || getattendancestatus(item)),
              getAttModePaidPresentType(item.attendanceautostatus || getattendancestatus(item))
            );
            item.lopday = getAssignLeaveDayForLop(
              getFinalLop(
                getAttModeLop(item.attendanceautostatus || getattendancestatus(item)),
                getAttModeLopType(item.attendanceautostatus || getattendancestatus(item))
              )
            );
            item.paidpresentday = getAssignLeaveDayForPaid(
              getFinalPaid(
                getAttModePaidPresent(item.attendanceautostatus || getattendancestatus(item)),
                getAttModePaidPresentType(item.attendanceautostatus || getattendancestatus(item))
              )
            );
            item.isweekoff = getIsWeekoff(item.attendanceautostatus || getattendancestatus(item));
            item.isholiday = getIsHoliday(item.attendanceautostatus || getattendancestatus(item));

          }
          if (attStatusOption.includes(item.daystatus) && item.clockin === "00:00:00" && item.clockout === "00:00:00" && item.appliedthrough === 'Manual' && item.paidpresent === "Yes - Full Day") {

            const hasRelevantStatus = (entry) => entry && ((weekOption.includes(entry.clockinstatus) || weekOption.includes(entry.clockoutstatus)) && entry.shift === 'Week Off');

            if (hasRelevantStatus(previousItem)) {
              if (!weekOption.includes(previousItem.clockinstatus)) {
                previousItem.clockinstatus = 'Week Off';
                previousItem.clockoutstatus = 'Week Off';
                previousItem.attendance = getattendancestatus(previousItem);
                previousItem.daystatus = previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem);
                previousItem.appliedthrough = getAttModeAppliedThr(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
                previousItem.lop = getAttModeLop(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
                previousItem.loptype = getAttModeLopType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
                previousItem.lopcalculation = getFinalLop(
                  getAttModeLop(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)),
                  getAttModeLopType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem))
                );
                previousItem.modetarget = getAttModeTarget(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
                previousItem.paidpresentbefore = getAttModePaidPresent(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
                previousItem.paidleavetype = getAttModePaidPresentType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
                previousItem.paidpresent = getFinalPaid(
                  getAttModePaidPresent(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)),
                  getAttModePaidPresentType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem))
                );
                previousItem.lopday = getAssignLeaveDayForLop(
                  getFinalLop(
                    getAttModeLop(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)),
                    getAttModeLopType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem))
                  )
                );
                previousItem.paidpresentday = getAssignLeaveDayForPaid(
                  getFinalPaid(
                    getAttModePaidPresent(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)),
                    getAttModePaidPresentType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem))
                  )
                );
                previousItem.isweekoff = getIsWeekoff(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
                previousItem.isholiday = getIsHoliday(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
              }
            }
            if (hasRelevantStatus(nextItem)) {
              if (!weekOption.includes(nextItem.clockinstatus)) {
                nextItem.clockinstatus = 'Week Off';
                nextItem.clockoutstatus = 'Week Off';
                nextItem.attendance = getattendancestatus(nextItem);
                nextItem.daystatus = nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem);
                nextItem.appliedthrough = getAttModeAppliedThr(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
                nextItem.lop = getAttModeLop(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
                nextItem.loptype = getAttModeLopType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
                nextItem.lopcalculation = getFinalLop(
                  getAttModeLop(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)),
                  getAttModeLopType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem))
                );
                nextItem.modetarget = getAttModeTarget(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
                nextItem.paidpresentbefore = getAttModePaidPresent(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
                nextItem.paidleavetype = getAttModePaidPresentType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
                nextItem.paidpresent = getFinalPaid(
                  getAttModePaidPresent(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)),
                  getAttModePaidPresentType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem))
                );
                nextItem.lopday = getAssignLeaveDayForLop(
                  getFinalLop(
                    getAttModeLop(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)),
                    getAttModeLopType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem))
                  )
                );
                nextItem.paidpresentday = getAssignLeaveDayForPaid(
                  getFinalPaid(
                    getAttModePaidPresent(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)),
                    getAttModePaidPresentType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem))
                  )
                );
                nextItem.isweekoff = getIsWeekoff(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
                nextItem.isholiday = getIsHoliday(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
              }
            }
          }
        })
        let fianlResult = itemsWithSerialNumber.filter((data) => data.finalDate >= filterUser.fromdate && data.finalDate <= filterUser.todate)?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
        setUserShifts(fianlResult);
        setSearchQueryAttCheck('');
        setTotalPagesAttCheck(Math.ceil(fianlResult.length / pageSizeAttCheck));
        setLoader(false);
      })
        .catch((error) => {
          setLoader(true);
          console.error('Error in getting all results:', error);
        });
    } catch (err) {
      setLoader(true);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    // Update filtered data items efficiently
    setFilteredDataItems(userShifts);
  }, [userShifts]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (filterUser.filtertype === 'Please Select Filter Type' || filterUser.filtertype === '' || filterUser.filtertype === undefined) {
      setPopupContentMalert('Please Select Filter Type for Employee Names');
      setPopupSeverityMalert('warning');
      handleClickOpenPopupMalert();
    } else if (selectedCompany?.length === 0) {
      setPopupContentMalert('Please Select Company');
      setPopupSeverityMalert('warning');
      handleClickOpenPopupMalert();
    } else if (['Individual', 'Team', 'Branch', 'Unit']?.includes(filterUser.filtertype) && selectedBranch.length === 0) {
      setPopupContentMalert('Please Select Branch');
      setPopupSeverityMalert('warning');
      handleClickOpenPopupMalert();
    } else if (['Individual', 'Team', 'Unit']?.includes(filterUser.filtertype) && selectedUnit.length === 0) {
      setPopupContentMalert('Please Select Unit');
      setPopupSeverityMalert('warning');
      handleClickOpenPopupMalert();
    } else if (['Individual', 'Team']?.includes(filterUser.filtertype) && selectedTeam.length === 0) {
      setPopupContentMalert('Please Select Team');
      setPopupSeverityMalert('warning');
      handleClickOpenPopupMalert();
    } else if (['Individual']?.includes(filterUser.filtertype) && selectedEmp.length === 0) {
      setPopupContentMalert('Please Select Employee Names');
      setPopupSeverityMalert('warning');
      handleClickOpenPopupMalert();
    } else if (['Department']?.includes(filterUser.filtertype) && selectedDep.length === 0) {
      setPopupContentMalert('Please Select Department');
      setPopupSeverityMalert('warning');
      handleClickOpenPopupMalert();
    } else if (filterUser.fromdate === '') {
      setPopupContentMalert('Please Select From Date');
      setPopupSeverityMalert('warning');
      handleClickOpenPopupMalert();
    } else if (filterUser.todate === '') {
      setPopupContentMalert('Please Select To Date');
      setPopupSeverityMalert('warning');
      handleClickOpenPopupMalert();
    } else {
      setLoader(false);
      fetchFilteredUsersStatus();
    }
  };

  const handleClear = async (e) => {
    e.preventDefault();
    setFilterUser({
      filtertype: 'Individual',
      fromdate: moment(cuurentDate).format('YYYY-MM-DD'),
      todate: moment(cuurentDate).format('YYYY-MM-DD'),
    });
    setSelectedMode('Today');
    // document.getElementById("to-date").min = moment(cuurentDate).format("YYYY-MM-DD");
    setUserShifts([]);
    setSelectedCompany([]);
    setSelectedBranch([]);
    setSelectedUnit([]);
    setSelectedTeam([]);
    setSelectedDep([]);
    setSelectedEmp([]);
    setValueCompany([]);
    setValueBranch([]);
    setValueUnit([]);
    setValueTeam([]);
    setValueDep([]);
    setValueEmp([]);
    setIsMonthYear({ ismonth: currentMonthObject, isyear: currentYearObject });
    setPageAttCheck(1);
    setPopupContent('Cleared Successfully');
    setPopupSeverity('success');
    handleClickOpenPopup();
  };

  const [undoRowData, setUndoRowData] = useState({});
  const getCodeForDelete = (rowData) => {
    setUndoRowData(rowData);
    handleClickOpen();
  };

  const undoAttendanceStatus = async () => {
    setPageName(!pageName);
    try {
      await axios.post(SERVICE.ATTENDANCE_CHECKLIST_UNDO, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        userid: undoRowData.userid,
        date: moment(undoRowData.rowformattedDate, 'DD/MM/YYYY').format('DD-MM-YYYY'),
        shiftmode: undoRowData.shiftmode,
      });
      await fetchFilteredUsersStatus();
      handleCloseMod();
      setPageAttCheck(1);
      setPopupContent('Undone Successfully');
      setPopupSeverity('success');
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const defaultColDef = useMemo(() => {
    return {
      filter: true,
      resizable: true,
      filterParams: {
        buttons: ['apply', 'reset', 'cancel'],
      },
    };
  }, []);

  const onGridReady = useCallback((params) => {
    setGridApi(params.api);
    setColumnApi(params.columnApi);
  }, []);

  // Function to handle filter changes
  const onFilterChanged = () => {
    if (gridApi) {
      const filterModel = gridApi.getFilterModel(); // Get the current filter model

      // Check if filters are active
      if (Object.keys(filterModel).length === 0) {
        // No filters active, clear the filtered data state
        setFilteredRowData([]);
      } else {
        // Filters are active, capture filtered data
        const filteredData = [];
        gridApi.forEachNodeAfterFilterAndSort((node) => {
          filteredData.push(node.data);
        });
        setFilteredRowData(filteredData);
      }
    }
  };

  const onPaginationChanged = useCallback(() => {
    if (gridRefTableAttCheck.current) {
      const gridApi = gridRefTableAttCheck.current.api;
      const currentPage = gridApi.paginationGetCurrentPage() + 1;
      const totalPagesAttCheck = gridApi.paginationGetTotalPages();
      setPageAttCheck(currentPage);
      setTotalPagesAttCheck(totalPagesAttCheck);
    }
  }, []);

  const formatDateForDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleUpdate = async (e, attendanceautostatus, date, alldata) => {
    let getShiftAdjMatchedId = '';
    alldata?.shiftallot.forEach((value) => {
      if (e === value.userid && value.selectedDate === alldata.rowformattedDate && value.adjdate === alldata.rowformattedDate) {
        getShiftAdjMatchedId = value._id;
      }
    });

    const checkNotAllotted = alldata.shiftallot && alldata.shiftallot.find((item) => item.empcode === alldata.empcode && item.adjdate === alldata.rowformattedDate && item.adjstatus === 'Not Allotted');
    const checkApprovedSingle = alldata.shiftallot && alldata.shiftallot.find((item) => item.empcode === alldata.empcode && item.adjdate === alldata.rowformattedDate && item.adjstatus === 'Approved' && (item.adjustmenttype === 'Change Shift' || item.adjustmenttype === 'Assign Shift'));
    const checkApprovedDoubleAddOn = alldata.shiftallot && alldata.shiftallot.find((item) => item.empcode === alldata.empcode && item.adjdate === alldata.rowformattedDate && item.adjstatus === 'Approved' && item.adjustmenttype === 'Add On Shift');
    const checkApprovedDouble =
      alldata.shiftallot &&
      alldata.shiftallot.find((item) => item.empcode === alldata.empcode && (item.adjdate === alldata.rowformattedDate || item.todate === alldata.rowformattedDate) && item.adjstatus === 'Approved' && (item.adjustmenttype === 'Shift Weekoff Swap' || item.adjustmenttype === 'Shift Adjustment'));
    const checkAdjustmentDoubleAddOn = alldata.shiftallot && alldata.shiftallot.find((item) => item.empcode === alldata.empcode && item.adjdate === alldata.rowformattedDate && item.adjstatus === 'Adjustment' && item.adjustmenttype === 'Add On Shift');
    const checkAdjustmentDouble =
      alldata.shiftallot &&
      alldata.shiftallot.find((item) => item.empcode === alldata.empcode && (item.adjdate === alldata.rowformattedDate || item.todate === alldata.rowformattedDate) && item.adjstatus === 'Adjustment' && (item.adjustmenttype === 'Shift Weekoff Swap' || item.adjustmenttype === 'Shift Adjustment'));

    const currentTime = new Date();
    const formattedTime = format(currentTime, 'h:mm a');

    if (attendanceautostatus !== 'Remove Main Shift' && attendanceautostatus !== 'Remove Second Shift') {
      let findAttendatceStatus = await axios.post(`${SERVICE.FIND_ATTANDANCESTATUS}`, {
        userid: e,
        date: moment(alldata.rowformattedDate.trim(), 'DD/MM/YYYY').format('DD-MM-YYYY'),
        shiftmode: String(alldata.shiftMode),
      });
      // Parse the original date string
      const parsedDate = moment(date, 'DD/MM/YYYY dddd HH');
      // Format the parsed date to "DD-MM-YYYY"
      const formattedDate = moment(alldata.date).format('DD-MM-YYYY');

      setBtnSubmit(true);
      let resdate = moment(alldata.date, 'DD/MM/YYYY').format('DD-MM-YYYY');
      console.log(e, 'eeeee')
      // if (findAttendatceStatus?.data?.found && attendanceautostatus === 'Remove Clockin') {
      //   let endshift = alldata?.shift?.split('to');
      //   try {
      //     let response = await axios.put(`${SERVICE.UPDATE_CLOCKINATTANDANCESTATUS}/${e}`, {
      //       attendancestatus: attendanceautostatus,
      //       date: moment(date, 'DD-MM-YYYY'),
      //       shiftmode: String(alldata.shiftMode),
      //     });

      //     await fetchFilteredUsersStatus();
      //     setStatus({});
      //     setBtnSubmit(false);
      //     setPopupContent('Updated Successfully');
      //     setPopupSeverity('success');
      //     handleClickOpenPopup();
      //   } catch (err) {
      //     handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
      //   }
      // } else if (findAttendatceStatus?.data?.found && attendanceautostatus === 'Remove Clockout') {
      //   let endshift = alldata?.shift?.split('to');
      //   try {
      //     let response = await axios.put(`${SERVICE.UPDATE_CLOCKOUTATTANDANCESTATUS}/${e}`, {
      //       attendancestatus: attendanceautostatus,
      //       date: moment(date, 'DD-MM-YYYY'),
      //       shiftmode: String(alldata.shiftMode),
      //     });

      //     await fetchFilteredUsersStatus();
      //     setStatus({});
      //     setBtnSubmit(false);
      //     setPopupContent('Updated Successfully');
      //     setPopupSeverity('success');
      //     handleClickOpenPopup();
      //   } catch (err) {
      //     handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
      //   }
      // } 
      if (findAttendatceStatus?.data?.found && attendanceautostatus === 'Remove Clockin/Clockout') {
        let endshift = alldata?.shift?.split('to');
        try {
          let response = await axios.post(`${SERVICE.ATTSTATUSCLOCKINOUTREMOVE}`, {
            attendancestatus: attendanceautostatus,
            userid: e,
            date: moment(date, 'DD-MM-YYYY'),
            shiftmode: String(alldata.shiftMode),
          });

          await fetchFilteredUsersStatus();
          setStatus({});
          setBtnSubmit(false);
          setPopupContent('Updated Successfully');
          setPopupSeverity('success');
          handleClickOpenPopup();
        } catch (err) {
          handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
      } else if (findAttendatceStatus?.data?.found) {
        let endshift = alldata?.shift?.split('to');
        try {
          let response = await axios.put(`${SERVICE.UPDATE_ATTANDANCESTATUS}/${e}`, {
            attendancestatus: attendanceautostatus,
            date: moment(date, 'DD-MM-YYYY'),
            shiftmode: String(alldata.shiftMode),
          });

          await fetchFilteredUsersStatus();
          setStatus({});
          setBtnSubmit(false);
          setPopupContent('Updated Successfully');
          setPopupSeverity('success');
          handleClickOpenPopup();
        } catch (err) {
          handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
      } else if (!findAttendatceStatus?.data?.found) {
        try {
          let endshift = alldata?.shift?.split('to');
          let resuser = await axios.get(`${SERVICE.USER_SINGLE}/${alldata.userid}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          });
          let response = await axios.post(`${SERVICE.ATTENDANCE_CLOCKIN_CREATE}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            username: String(resuser?.data?.suser?.username),
            userid: String(alldata.userid),
            clockintime: String('00:00:00'),
            clockouttime: String('00:00:00'),
            clockinipaddress: '',
            clockoutipaddress: '',
            status: true,
            buttonstatus: 'false',
            calculatedshiftend: '',
            shiftname: alldata.shift,
            shiftendtime: endshift[1],
            autoclockout: Boolean(false),
            attendancestatus: attendanceautostatus,
            date: String(resdate),
            shiftmode: String(alldata.shiftMode),
          });
          await fetchFilteredUsersStatus();
          setStatus({});
          setBtnSubmit(false);
          setPopupContent('Updated Successfully');
          setPopupSeverity('success');
          handleClickOpenPopup();
        } catch (err) {
          handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
      }
    }

    // update shiftallot
    if (attendanceautostatus === 'Remove Main Shift' || attendanceautostatus === 'Remove Second Shift') {
      const [day, month, year] = alldata.rowformattedDate?.split('/');
      const formattedDate = `${year}-${month}-${day}`;
      let res = await axios.post(SERVICE.CHECK_ISPRODDAY_CREATED, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        date: formattedDate,
      });

      if (alldata.clockin !== '00:00:00') {
        setPopupContentMalert(`${alldata.username} have already clocked in on "${alldata.rowformattedDate}". You cannot remove shift.`);
        setPopupSeverityMalert('warning');
        handleClickOpenPopupMalert();
      } else if (res.data.count > 0) {
        setPopupContentMalert(`Production day is created. You cannot remove shift.`);
        setPopupSeverityMalert('warning');
        handleClickOpenPopupMalert();
      } else if (checkNotAllotted) {
        setPopupContentMalert(`Shift is "${checkNotAllotted.adjstatus}" on "${checkNotAllotted.adjdate}" for ${checkNotAllotted.username}. You cannot remove shift.`);
        setPopupSeverityMalert('warning');
        handleClickOpenPopupMalert();
      } else if (alldata.shift === 'Week Off') {
        setPopupContentMalert(`You cannot remove "${alldata.shift}" shift.`);
        setPopupSeverityMalert('warning');
        handleClickOpenPopupMalert();
      } else if (checkApprovedSingle) {
        setPopupContentMalert(`"${checkApprovedSingle.adjustmenttype}" have "${checkApprovedSingle.adjstatus}" on "${checkApprovedSingle.adjdate}" for "${checkApprovedSingle.username}". You cannot remove shift.`);
        setPopupSeverityMalert('warning');
        handleClickOpenPopupMalert();
      } else if (checkApprovedDoubleAddOn) {
        setPopupContentMalert(`"${checkApprovedDoubleAddOn.adjustmenttype}" have "${checkApprovedDoubleAddOn.adjstatus}" on "${checkApprovedDoubleAddOn.adjdate}" for "${checkApprovedDoubleAddOn.username}". You cannot remove shift.`);
        setPopupSeverityMalert('warning');
        handleClickOpenPopupMalert();
      } else if (checkApprovedDouble) {
        setPopupContentMalert(`"${checkApprovedDouble.adjustmenttype}" have "${checkApprovedDouble.adjstatus}" on "${checkApprovedDouble.adjdate}" and "${checkApprovedDouble.todate}" for "${checkApprovedDouble.username}". You cannot remove shift.`);
        setPopupSeverityMalert('warning');
        handleClickOpenPopupMalert();
      } else if (checkAdjustmentDoubleAddOn) {
        setPopupContentMalert(`"${checkAdjustmentDoubleAddOn.adjustmenttype}" have "Applied" on "${checkAdjustmentDoubleAddOn.adjdate}" for "${checkAdjustmentDoubleAddOn.username}". You cannot remove shift.`);
        setPopupSeverityMalert('warning');
        handleClickOpenPopupMalert();
      } else if (checkAdjustmentDouble) {
        setPopupContentMalert(`"${checkAdjustmentDouble.adjustmenttype}" have "Applied" on "${checkAdjustmentDouble.adjdate}" and "${checkAdjustmentDouble.todate}" for "${checkAdjustmentDouble.username}". You cannot remove shift.`);
        setPopupSeverityMalert('warning');
        handleClickOpenPopupMalert();
      } else {
        alldata?.shiftallot &&
          alldata?.shiftallot?.map(async (allot) => {
            // console.log(getShiftAdjMatchedId, 'getShiftAdjMatchedId')
            if (allot._id === getShiftAdjMatchedId && (allot.adjdate === alldata.rowformattedDate || allot.adjdate === alldata.selectedDate)) {
              await axios.post(SERVICE.USER_SHIFTALLOT_UPDATE, {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },
                shiftallotsarray: [
                  {
                    ...allot,
                    _id: getShiftAdjMatchedId,
                    adjfirstshiftmode: String(alldata.shift === 'Week Off' ? 'Week Off' : 'First Shift'),
                    adjustmenttype: String(''),
                    adjshiftgrptype: String('Choose Day/Night'),
                    adjchangeshift: String('Choose Shift'),
                    adjchangeshiftime: String(''),
                    adjchangereason: String(''),
                    adjdate: String(alldata.rowformattedDate),
                    adjapplydate: String(''),
                    adjapplytime: String(''),
                    adjstatus: String('Not Allotted'),
                    adjustmentstatus: true,
                    secondmode: String('Choose 2nd Shiftmode'),
                    pluseshift: String(''),
                    todate: String(''),
                    todateshiftmode: String(''),
                    selectedDate: String(alldata.rowformattedDate),
                    selectedShifTime: String(`${alldata.shift?.split('to')[0]} - ${alldata.shift?.split('to')[1]}`),
                    removedshiftdate: String(alldata.rowformattedDate),
                    removedondate: formatDateForDate(currentTime),
                    removedontime: String(formattedTime),
                  },
                ],
              });
              await fetchFilteredUsersStatus();
              setStatus({});
              setBtnSubmit(false);
              setPopupContent('Removed Successfully');
              setPopupSeverity('success');
              handleClickOpenPopup();
            } else if (getShiftAdjMatchedId == '') {
              await axios.put(`${SERVICE.USER_SINGLE_PWD}/${alldata.userid}`, {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },
                shiftallot: [
                  ...alldata.shiftallot,
                  {
                    userid: String(alldata.userid),
                    username: String(alldata.username),
                    empcode: String(alldata.empcode),
                    company: String(alldata.company),
                    branch: String(alldata.branch),
                    unit: String(alldata.unit),
                    team: String(alldata.team),
                    department: String(alldata.department),
                    weekoff: alldata.weekoff,
                    adjfirstshiftmode: String(alldata.shift === 'Week Off' ? 'Week Off' : 'First Shift'),
                    adjustmenttype: String(''),
                    adjshiftgrptype: String('Choose Day/Night'),
                    adjchangeshift: String('Choose Shift'),
                    adjchangeshiftime: String(''),
                    adjchangereason: String(''),
                    adjdate: String(alldata.rowformattedDate),
                    adjapplydate: String(''),
                    adjapplytime: String(''),
                    adjstatus: String('Not Allotted'),
                    adjustmentstatus: true,
                    secondmode: String('Choose 2nd Shiftmode'),
                    pluseshift: String(''),
                    todate: String(''),
                    todateshiftmode: String(''),
                    selectedDate: String(alldata.rowformattedDate),
                    selectedShifTime: String(`${alldata.shift?.split('to')[0]} - ${alldata.shift?.split('to')[1]}`),
                    removedshiftdate: String(alldata.rowformattedDate),
                    removedondate: formatDateForDate(currentTime),
                    removedontime: String(formattedTime),
                  },
                ],
              });
              await fetchFilteredUsersStatus();
              setStatus({});
              setBtnSubmit(false);
              setPopupContent('Removed Successfully');
              setPopupSeverity('success');
              handleClickOpenPopup();
            }
          });
        // shift allot array is empty
        if (alldata?.shiftallot && alldata?.shiftallot.length === 0) {
          await axios.put(`${SERVICE.USER_SINGLE_PWD}/${alldata.userid}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            shiftallot: [
              {
                userid: String(alldata.userid),
                username: String(alldata.username),
                empcode: String(alldata.empcode),
                company: String(alldata.company),
                branch: String(alldata.branch),
                unit: String(alldata.unit),
                team: String(alldata.team),
                department: String(alldata.department),
                weekoff: alldata.weekoff,
                adjfirstshiftmode: String(alldata.shift === 'Week Off' ? 'Week Off' : 'First Shift'),
                adjustmenttype: String(''),
                adjshiftgrptype: String('Choose Day/Night'),
                adjchangeshift: String('Choose Shift'),
                adjchangeshiftime: String(''),
                adjchangereason: String(''),
                adjdate: String(alldata.rowformattedDate),
                adjapplydate: String(''),
                adjapplytime: String(''),
                adjstatus: String('Not Allotted'),
                adjustmentstatus: true,
                secondmode: String('Choose 2nd Shiftmode'),
                pluseshift: String(''),
                todate: String(''),
                todateshiftmode: String(''),
                selectedDate: String(alldata.rowformattedDate),
                selectedShifTime: String(`${alldata.shift?.split('to')[0]} - ${alldata.shift?.split('to')[1]}`),
                removedshiftdate: String(alldata.rowformattedDate),
                removedondate: formatDateForDate(currentTime),
                removedontime: String(formattedTime),
              },
            ],
          });
          await fetchFilteredUsersStatus();
          setStatus({});
          setBtnSubmit(false);
          setPopupContent('Removed Successfully');
          setPopupSeverity('success');
          handleClickOpenPopup();
          console.log('hi');
        }
      }
    }
  };

  const [rowIndex, setRowIndex] = useState();
  const handleAction = (value, rowId, sno) => {
    setStatus((prevStatus) => ({
      ...prevStatus,
      [rowId]: {
        ...prevStatus[rowId],
        attendanceautostatus: value,
        btnShow: true,
      },
    }));
    setRowIndex(sno);
  };

  const columnDataTableAttCheck = [
    { field: 'serialNumber', headerName: 'SNo', flex: 0, width: 80, hide: !columnVisibilityAttCheck.serialNumber, headerClassName: 'bold-header', pinned: 'left', lockPinned: true },
    {
      field: 'actions',
      headerName: 'Attendance Status',
      flex: 0,
      width: 330,
      sortable: false,
      filter: false,
      hide: !columnVisibilityAttCheck.actions,
      pinned: 'left',
      lockPinned: true,
      cellRenderer: (params) => {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - 5);

        const [formatday1, fromatmonth1, formatyear1] = params.data.rowformattedDate?.split('/');
        const columnFormattedDate = new Date(`${fromatmonth1}/${formatday1}/${formatyear1}`);

        const isDisabled = new Date(columnFormattedDate) < currentDate;

        const mainShiftOptions = isDisabled ? attStatusOption : [{ label: 'Remove Main Shift', value: 'Remove Main Shift' }, ...attStatusOption];

        const secondShiftOptions = isDisabled ? attStatusOption : [{ label: 'Remove Second Shift', value: 'Remove Second Shift' }, ...attStatusOption];

        return (
          <Grid sx={{ display: 'flex' }}>
            <>
              <Grid item md={12} xs={12} sm={12}>
                <FormControl size="small" fullWidth>
                  <Select
                    size="small"
                    labelId="demo-select-small"
                    id="demo-select-small"
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 200,
                          width: 'auto',
                        },
                      },
                    }}
                    style={{ minWidth: 150, width: '230px' }}
                    value={status[params.data.id]?.attendanceautostatus ? status[params.data.id]?.attendanceautostatus : params.data.attendanceautostatus}
                    onChange={(e) => {
                      handleAction(e.target.value, params.data.id, params.data.serialNumber);
                    }}
                    inputProps={{ 'aria-label': 'Without label' }}
                  >
                    {params.data.shiftMode === 'Main Shift'
                      ? mainShiftOptions.map((d) => (
                        <MenuItem key={d._id} value={d.value}>
                          {d.label}
                        </MenuItem>
                      ))
                      : secondShiftOptions.map((d) => (
                        <MenuItem key={d._id} value={d.value}>
                          {d.label}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              {/* <br /> <br /> */}
              {status[params.data.id]?.btnShow && rowIndex === params.data.serialNumber ? (
                <>
                  {' '}
                  <LoadingButton
                    size="small"
                    sx={buttonStyles.buttonsubmit}
                    // sx={{
                    //   // ...buttonStyles.buttonedit,
                    //   marginLeft: "10px",
                    //   color: 'white'
                    // }}
                    variant="contained"
                    loading={btnSubmit}
                    // style={{ minWidth: "0px" }}
                    onClick={(e) => handleUpdate(params.data.userid, status[params.data.id]?.attendanceautostatus, params.data.date, params.data)}
                  >
                    SAVE
                  </LoadingButton>
                </>
              ) : (
                <></>
              )}
            </>
            {params.data.dbattendancestatus === 'NOTFOUND' ? null : (
              <Button
                sx={{ marginTop: '10px' }}
                onClick={() => {
                  getCodeForDelete(params.data);
                }}
              >
                <FaUndoAlt style={{ fontsize: 'large', marginLeft: '-12px' }} />
              </Button>
            )}
          </Grid>
        );
      },
    },
    { field: 'empcode', headerName: 'Emp Code', flex: 0, width: 150, hide: !columnVisibilityAttCheck.empcode, headerClassName: 'bold-header', pinned: 'left', lockPinned: true },
    { field: 'username', headerName: 'Employee Name', flex: 0, width: 250, hide: !columnVisibilityAttCheck.username, headerClassName: 'bold-header', pinned: 'left', lockPinned: true },
    { field: 'company', headerName: 'Company', flex: 0, width: 130, hide: !columnVisibilityAttCheck.company, headerClassName: 'bold-header' },
    { field: 'branch', headerName: 'Branch', flex: 0, width: 130, hide: !columnVisibilityAttCheck.branch, headerClassName: 'bold-header' },
    { field: 'unit', headerName: 'Unit', flex: 0, width: 130, hide: !columnVisibilityAttCheck.unit, headerClassName: 'bold-header' },
    { field: 'department', headerName: 'Department', flex: 0, width: 130, hide: !columnVisibilityAttCheck.department, headerClassName: 'bold-header' },
    { field: 'date', headerName: 'Date', flex: 0, width: 110, hide: !columnVisibilityAttCheck.date, headerClassName: 'bold-header' },
    { field: 'shift', headerName: 'Shift Name', flex: 0, width: 150, hide: !columnVisibilityAttCheck.shift, headerClassName: 'bold-header' },
    { field: 'leavestatus', headerName: 'Leave Status', flex: 0, width: 150, hide: !columnVisibilityAttCheck.leavestatus },
    { field: 'permissionstatus', headerName: 'Permission Status', flex: 0, width: 150, hide: !columnVisibilityAttCheck.permissionstatus },
    { field: 'clockinstatus', headerName: 'ClockIn Status', flex: 0, width: 150, hide: !columnVisibilityAttCheck.clockinstatus, headerClassName: 'bold-header' },
    { field: 'clockoutstatus', headerName: 'ClockOut Status', flex: 0, width: 150, hide: !columnVisibilityAttCheck.clockoutstatus, headerClassName: 'bold-header' },
    {
      field: 'attendance',
      headerName: 'Mode',
      flex: 0,
      width: 200,
      hide: !columnVisibilityAttCheck.attendance,
      headerClassName: 'bold-header',
      cellRenderer: (params) => {
        return (
          <Grid>
            <Button
              size="small"
              sx={{
                marginTop: '10px',
                textTransform: 'capitalize',
                borderRadius: '4px',
                boxShadow: 'none',
                fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
                fontWeight: '400',
                fontSize: '0.575rem',
                lineHeight: '1.43',
                letterSpacing: '0.01071em',
                display: 'flex',
                padding: '3px 8px',
                cursor: 'default',
                color: params.data.attendance === 'HOLIDAY' ? 'black' : params.data.attendance === 'ABSENT' ? '#462929' : params.data.attendance === "WEEKOFF" ? 'white' : '#052106',
                backgroundColor: params.data.attendance === 'HOLIDAY' ? '#B6FFFA' : params.data.attendance === "ABSENT" ? '#ff00007d' : params.data.attendance === "WEEKOFF" ? '#6b777991' : 'rgb(156 239 156)',
                '&:hover': {
                  color: params.data.attendance === 'HOLIDAY' ? 'black' : params.data.attendance === 'ABSENT' ? '#462929' : params.data.attendance === "WEEKOFF" ? 'white' : '#052106',
                  backgroundColor: params.data.attendance === 'HOLIDAY' ? '#B6FFFA' : params.data.attendance === "ABSENT" ? '#ff00007d' : params.data.attendance === "WEEKOFF" ? '#6b777991' : 'rgb(156 239 156)',
                }
              }}
            >
              {params.data.attendance}
            </Button>
          </Grid>
        );
      },
    },
  ];

  //Datatable
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQueryAttCheck(value);
    applyNormalFilter(value);
    setFilteredRowData([]);
  };

  const applyNormalFilter = (searchValue) => {
    // Split the search query into individual terms
    const searchTerms = searchValue.toLowerCase().split(' ');

    // Modify the filtering logic to check each term
    const filtered = userShifts?.filter((item) => {
      return searchTerms.every((term) => Object.values(item).join(' ').toLowerCase().includes(term));
    });
    setFilteredDataItems(filtered);
    setPageAttCheck(1);
  };

  const applyAdvancedFilter = (filters, logicOperator) => {
    // Apply filtering logic with multiple conditions
    const filtered = userShifts?.filter((item) => {
      return filters.reduce((acc, filter, index) => {
        const { column, condition, value } = filter;
        const itemValue = String(item[column])?.toLowerCase();
        const filterValue = String(value).toLowerCase();

        let match;
        switch (condition) {
          case 'Contains':
            match = itemValue.includes(filterValue);
            break;
          case 'Does Not Contain':
            match = !itemValue?.includes(filterValue);
            break;
          case 'Equals':
            match = itemValue === filterValue;
            break;
          case 'Does Not Equal':
            match = itemValue !== filterValue;
            break;
          case 'Begins With':
            match = itemValue.startsWith(filterValue);
            break;
          case 'Ends With':
            match = itemValue.endsWith(filterValue);
            break;
          case 'Blank':
            match = !itemValue;
            break;
          case 'Not Blank':
            match = !!itemValue;
            break;
          default:
            match = true;
        }

        // Combine conditions with AND/OR logic
        if (index === 0) {
          return match; // First filter is applied directly
        } else if (logicOperator === 'AND') {
          return acc && match;
        } else {
          return acc || match;
        }
      }, true);
    });

    setFilteredDataItems(filtered);
    setAdvancedFilter(filters);
    // handleCloseSearchAttCheck();
  };

  // Undo filter funtion
  const handleResetSearch = () => {
    setAdvancedFilter(null);
    setSearchQueryAttCheck('');
    setFilteredDataItems(userShifts);
  };

  // Show filtered combination in the search bar
  const getSearchDisplay = () => {
    if (advancedFilter && advancedFilter.length > 0) {
      return advancedFilter
        .map((filter, index) => {
          let showname = columnDataTableAttCheck.find((col) => col.field === filter.column)?.headerName;
          return `${showname} ${filter.condition} "${filter.value}"`;
        })
        .join(' ' + (advancedFilter.length > 1 ? advancedFilter[1].condition : '') + ' ');
    }
    return searchQueryAttCheck;
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPagesAttCheck) {
      setPageAttCheck(newPage);
      gridRefTableAttCheck.current.api.paginationGoToPage(newPage - 1);
    }
  };

  const handlePageSizeChange = (e) => {
    const newSize = Number(e.target.value);
    setPageSizeAttCheck(newSize);
    if (gridApi) {
      gridApi.paginationSetPageSize(newSize);
    }
  };

  // Show All Columns functionality
  const handleShowAllColumns = () => {
    const updatedVisibility = { ...columnVisibilityAttCheck };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibilityAttCheck(updatedVisibility);
  };

  // Function to filter columns based on search query
  const filteredColumns = columnDataTableAttCheck.filter((column) => column.headerName.toLowerCase().includes(searchQueryManageAttCheck.toLowerCase()));

  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  // Manage Columns functionality
  const toggleColumnVisibility = (field) => {
    if (!gridApi) return;

    setColumnVisibilityAttCheck((prevVisibility) => {
      const newVisibility = !prevVisibility[field];

      // Update the visibility in the grid
      gridApi.setColumnVisible(field, newVisibility);

      return {
        ...prevVisibility,
        [field]: newVisibility,
      };
    });
  };

  const handleColumnMoved = useCallback(
    debounce((event) => {
      if (!event.columnApi) return;

      const visible_columns = event.columnApi
        .getAllColumns()
        .filter((col) => {
          const colState = event.columnApi.getColumnState().find((state) => state.colId === col.colId);
          return colState && !colState.hide;
        })
        .map((col) => col.colId);

      setColumnVisibilityAttCheck((prevVisibility) => {
        const updatedVisibility = { ...prevVisibility };

        // Ensure columns that are visible stay visible
        Object.keys(updatedVisibility).forEach((colId) => {
          updatedVisibility[colId] = visible_columns.includes(colId);
        });

        return updatedVisibility;
      });
    }, 300),
    []
  );

  const handleColumnVisible = useCallback((event) => {
    const colId = event.column.getColId();

    // Update visibility based on event, but only when explicitly triggered by grid
    setColumnVisibilityAttCheck((prevVisibility) => ({
      ...prevVisibility,
      [colId]: event.visible, // Set visibility directly from the event
    }));
  }, []);

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
        onClick={handleCloseManageColumnsAttCheck}
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
        <TextField label="Find column" variant="standard" fullWidth value={searchQueryManageAttCheck} onChange={(e) => setSearchQueryManageAttCheck(e.target.value)} sx={{ marginBottom: 5, position: 'absolute' }} />
      </Box>{' '}
      <br /> <br />
      <DialogContent sx={{ minWidth: 'auto', height: '200px', position: 'relative' }}>
        <List sx={{ overflow: 'auto', height: '100%' }}>
          {filteredColumns.map((column) => (
            <ListItem key={column.field}>
              <ListItemText sx={{ display: 'flex' }} primary={<Switch sx={{ marginTop: '-5px' }} size="small" checked={columnVisibilityAttCheck[column.field]} onChange={() => toggleColumnVisibility(column.field)} />} secondary={column.field === 'checkbox' ? 'Checkbox' : column.headerName} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Grid container>
          <Grid item md={4}>
            <Button variant="text" sx={{ textTransform: 'none' }} onClick={() => setColumnVisibilityAttCheck(initialColumnVisibilityAttCheck)}>
              {' '}
              Show All{' '}
            </Button>
          </Grid>
          <Grid item md={4}></Grid>
          <Grid item md={4}>
            <Button
              variant="text"
              sx={{ textTransform: 'none' }}
              onClick={() => {
                const newColumnVisibility = {};
                columnDataTableAttCheck.forEach((column) => {
                  newColumnVisibility[column.field] = false; // Set hide property to true
                });
                setColumnVisibilityAttCheck(newColumnVisibility);
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

  // Excel
  const [fileFormat, setFormat] = useState('');
  let exportColumnNamescrt = ['Emp Code', 'Employee Name', 'Company', 'Branch', 'Unit', 'Department', 'Date', 'Shift', 'Leave Status', 'Permission Status', 'ClockIn Status', 'ClockOut Status', 'Mode', 'Attendance Status'];
  let exportRowValuescrt = ['empcode', 'username', 'company', 'branch', 'unit', 'department', 'date', 'shift', 'leavestatus', 'permissionstatus', 'clockinstatus', 'clockoutstatus', 'attendance', 'attendanceautostatus'];

  // print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Attendance Check List',
    pageStyle: 'print',
  });

  // image
  const handleCaptureImage = () => {
    if (gridRefImageAttCheck.current) {
      domtoimage
        .toBlob(gridRefImageAttCheck.current)
        .then((blob) => {
          saveAs(blob, 'Attendance Check List.png');
        })
        .catch((error) => {
          console.error('dom-to-image error: ', error);
        });
    }
  };

  // Pagination for innter filter
  const getVisiblePageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 3;

    const startPage = Math.max(1, pageAttCheck - 1);
    const endPage = Math.min(totalPagesAttCheck, startPage + maxVisiblePages - 1);

    // Loop through and add visible pageAttCheck numbers
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    // If there are more pages after the last visible pageAttCheck, show ellipsis
    if (endPage < totalPagesAttCheck) {
      pageNumbers.push('...');
    }

    return pageNumbers;
  };

  // Pagination for outer filter
  const filteredData = filteredDataItems?.slice((pageAttCheck - 1) * pageSizeAttCheck, pageAttCheck * pageSizeAttCheck);
  const totalPagesAttCheckOuter = Math.ceil(filteredDataItems?.length / pageSizeAttCheck);
  const visiblePages = Math.min(totalPagesAttCheckOuter, 3);
  const firstVisiblePage = Math.max(1, pageAttCheck - 1);
  const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPagesAttCheckOuter);
  const pageNumbers = [];
  const indexOfLastItem = pageAttCheck * pageSizeAttCheck;
  const indexOfFirstItem = indexOfLastItem - pageSizeAttCheck;
  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  }

  return (
    <Box>
      <Headtitle title={'ATTENDANCE CHECKLIST'} />
      {/* ****** Header Content ****** */}
      <PageHeading title="Attendance Check List" modulename="Human Resources" submodulename="HR" mainpagename="Attendance" subpagename="Attendance Update" subsubpagename="Attendance Checklist" />
      {isUserRoleCompare?.includes('lattendancechecklist') && (
        <>
          <Box sx={userStyle.selectcontainer}>
            <Grid container spacing={2}>
              <Grid item md={12} sm={12} xs={12}>
                <Typography sx={userStyle.importheadtext}> Attendance Check List </Typography>
              </Grid>
              {/* <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Mode<b style={{ color: "red" }}>*</b></Typography>
                    <Selects
                      options={modeOptions}
                      styles={colourStyles}
                      value={{ label: filterUser.mode, value: filterUser.mode }}
                      onChange={(e) => {
                        setFilterUser({ ...filterUser, mode: e.value, });
                        setSelectedDep([]);
                        setValueDep([]);
                        setSelectedEmp([]);
                        setValueEmp([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <Typography>
                    Company<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <MultiSelect
                      options={accessbranch?.map(data => ({
                        label: data.company,
                        value: data.company,
                      })).filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })}
                      value={selectedCompany}
                      onChange={(e) => {
                        handleCompanyChange(e);
                      }}
                      valueRenderer={customValueRendererCompany}
                      labelledBy="Please Select Company"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography> Branch<b style={{ color: "red" }}>*</b></Typography>
                    <MultiSelect
                      options={accessbranch?.filter(
                        (comp) =>
                          valueCompany?.includes(comp.company)
                      )?.map(data => ({
                        label: data.branch,
                        value: data.branch,
                      })).filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })}
                      value={selectedBranch}
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
                    <Typography> Unit<b style={{ color: "red" }}>*</b></Typography>
                    <MultiSelect
                      options={accessbranch?.filter(
                        (comp) =>
                          valueCompany?.includes(comp.company) && valueBranch?.includes(comp.branch)
                      )?.map(data => ({
                        label: data.unit,
                        value: data.unit,
                      })).filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })}
                      value={selectedUnit}
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
                    <Typography>Team<b style={{ color: "red" }}>*</b></Typography>
                    <MultiSelect
                      options={allTeam
                        ?.filter((u) => valueCompany?.includes(u.company) && valueBranch?.includes(u.branch) && valueUnit?.includes(u.unit))
                        .map((u) => ({
                          ...u,
                          label: u.teamname,
                          value: u.teamname,
                        }))}
                      value={selectedTeam}
                      onChange={(e) => {
                        handleTeamChange(e);
                      }}
                      valueRenderer={customValueRendererTeam}
                      labelledBy="Please Select Team"
                    />
                  </FormControl>
                </Grid> */}
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    {' '}
                    Type<b style={{ color: 'red' }}>*</b>{' '}
                  </Typography>
                  <Selects
                    options={[
                      { label: 'Individual', value: 'Individual' },
                      { label: 'Company', value: 'Company' },
                      { label: 'Branch', value: 'Branch' },
                      { label: 'Unit', value: 'Unit' },
                      { label: 'Team', value: 'Team' },
                      { label: 'Department', value: 'Department' },
                    ]}
                    styles={colourStyles}
                    value={{ label: filterUser.filtertype, value: filterUser.filtertype }}
                    onChange={(e) => {
                      setFilterUser({ ...filterUser, filtertype: e.value });
                      setSelectedCompany([]);
                      setValueCompany([]);
                      setSelectedBranch([]);
                      setValueBranch([]);
                      setSelectedUnit([]);
                      setValueUnit([]);
                      setSelectedTeam([]);
                      setValueTeam([]);
                      setSelectedEmp([]);
                      setValueEmp([]);
                      setSelectedDep([]);
                      setValueDep([]);
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
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
                    value={selectedCompany}
                    onChange={(e) => {
                      handleCompanyChange(e);
                    }}
                    valueRenderer={customValueRendererCompany}
                    labelledBy="Please Select Company"
                  />
                </FormControl>
              </Grid>
              {['Individual', 'Team']?.includes(filterUser.filtertype) ? (
                <>
                  {/* Branch Unit Team */}
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        {' '}
                        Branch<b style={{ color: 'red' }}>*</b>{' '}
                      </Typography>
                      <MultiSelect
                        options={accessbranch
                          ?.filter((comp) => valueCompany?.includes(comp.company))
                          ?.map((data) => ({
                            label: data.branch,
                            value: data.branch,
                          }))
                          .filter((item, index, self) => {
                            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                          })}
                        value={selectedBranch}
                        onChange={handleBranchChange}
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
                          ?.filter((comp) => valueCompany?.includes(comp.company) && valueBranch?.includes(comp.branch))
                          ?.map((data) => ({
                            label: data.unit,
                            value: data.unit,
                          }))
                          .filter((item, index, self) => {
                            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                          })}
                        value={selectedUnit}
                        onChange={handleUnitChange}
                        valueRenderer={customValueRendererUnit}
                        labelledBy="Please Select Branch"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        {' '}
                        Team<b style={{ color: 'red' }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={allTeam
                          ?.filter((u) => valueCompany?.includes(u.company) && valueBranch?.includes(u.branch) && valueUnit?.includes(u.unit))
                          .map((u) => ({
                            ...u,
                            label: u.teamname,
                            value: u.teamname,
                          }))}
                        value={selectedTeam}
                        onChange={handleTeamChange}
                        valueRenderer={customValueRendererTeam}
                        labelledBy="Please Select Branch"
                      />
                    </FormControl>
                  </Grid>
                </>
              ) : ['Branch']?.includes(filterUser.filtertype) ? (
                <>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        {' '}
                        Branch<b style={{ color: 'red' }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={accessbranch
                          ?.filter((comp) => valueCompany?.includes(comp.company))
                          ?.map((data) => ({
                            label: data.branch,
                            value: data.branch,
                          }))
                          .filter((item, index, self) => {
                            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                          })}
                        value={selectedBranch}
                        onChange={handleBranchChange}
                        valueRenderer={customValueRendererBranch}
                        labelledBy="Please Select Branch"
                      />
                    </FormControl>
                  </Grid>
                </>
              ) : ['Unit']?.includes(filterUser.filtertype) ? (
                <>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        {' '}
                        Branch<b style={{ color: 'red' }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={accessbranch
                          ?.filter((comp) => valueCompany?.includes(comp.company))
                          ?.map((data) => ({
                            label: data.branch,
                            value: data.branch,
                          }))
                          .filter((item, index, self) => {
                            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                          })}
                        value={selectedBranch}
                        onChange={handleBranchChange}
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
                          ?.filter((comp) => valueCompany?.includes(comp.company) && valueBranch?.includes(comp.branch))
                          ?.map((data) => ({
                            label: data.unit,
                            value: data.unit,
                          }))
                          .filter((item, index, self) => {
                            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                          })}
                        value={selectedUnit}
                        onChange={handleUnitChange}
                        valueRenderer={customValueRendererUnit}
                        labelledBy="Please Select Branch"
                      />
                    </FormControl>
                  </Grid>
                </>
              ) : ['Individual', 'Department']?.includes(filterUser.filtertype) ? (
                <>
                  {/* Department */}
                  <Grid item md={3} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Department<b style={{ color: 'red' }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={alldepartment
                          ?.map((data) => ({
                            label: data.deptname,
                            value: data.deptname,
                          }))
                          .filter((item, index, self) => {
                            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                          })}
                        value={selectedDep}
                        onChange={(e) => {
                          handleDepartmentChange(e);
                        }}
                        valueRenderer={customValueRendererDepartment}
                        labelledBy="Please Select Department"
                      />
                    </FormControl>
                  </Grid>
                </>
              ) : (
                ''
              )}
              {['Individual']?.includes(filterUser.filtertype) && (
                <Grid item md={3} sm={12} xs={12} sx={{ display: 'flex', flexDirection: 'row' }}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Employee<b style={{ color: 'red' }}>*</b>{' '}
                    </Typography>
                    <div onPaste={handlePasteForEmp} style={{ position: 'relative' }}>
                      <MultiSelect
                        options={allUsersLimit
                          ?.filter((comp) => valueCompany?.includes(comp.company) && selectedBranch?.map((data) => data.value)?.includes(comp.branch) && selectedUnit?.map((data) => data.value)?.includes(comp.unit) && selectedTeam?.map((data) => data.value)?.includes(comp.team))
                          ?.map((data) => ({
                            label: data.companyname,
                            value: data.companyname,
                          }))
                          .filter((item, index, self) => {
                            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                          })}
                        value={selectedEmp}
                        onChange={(e) => {
                          handleEmployeeChange(e);
                        }}
                        valueRenderer={customValueRendererEmp}
                        labelledBy="Please Select Employee"
                        inputValue={searchInputValue} // Add this state if needed
                        onInputChange={(newValue) => setSearchInputValue(newValue)}
                      />
                    </div>
                  </FormControl>
                </Grid>
              )}
              {['Individual']?.includes(filterUser.filtertype) && (
                <Grid item md={6} sm={12} xs={12} sx={{ display: 'flex', flexDirection: 'row' }}>
                  <FormControl fullWidth size="small">
                    <Typography>Selected Employees</Typography>
                    <Box
                      id="paste-box"
                      tabIndex={0}
                      sx={{
                        border: '1px solid #ccc',
                        borderRadius: '3.75px',
                        height: '110px',
                        overflow: 'auto',
                        '& .MuiChip-clickable': {
                          margin: '1px',
                          cursor: 'pointer',
                          userSelect: 'none',
                          background: '#e0e0e0',
                        },
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
                        <Chip key={value} label={value} clickable sx={{ margin: 2, backgroundColor: '#FFF' }} onDelete={(e) => handleDelete(e, value)} onClick={() => console.log('clicked chip')} />
                      ))}
                    </Box>
                  </FormControl>
                </Grid>
              )}
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    {' '}
                    Filter Mode<b style={{ color: 'red' }}>*</b>{' '}
                  </Typography>
                  <Selects
                    labelId="mode-select-label"
                    options={mode}
                    value={{ label: selectedMode, value: selectedMode }}
                    onChange={(selectedOption) => {
                      // Reset the date fields to empty strings
                      let fromdate = '';
                      let todate = '';

                      // If a valid option is selected, get the date range
                      if (selectedOption.value) {
                        const dateRange = getDateRange(selectedOption.value);
                        fromdate = dateRange.fromdate; // Already formatted in 'dd-MM-yyyy'
                        todate = dateRange.todate; // Already formatted in 'dd-MM-yyyy'
                      }
                      // Set the state with formatted dates
                      setFilterUser({
                        ...filterUser,
                        fromdate: formatDateForInput(new Date(fromdate.split('-').reverse().join('-'))), // Convert to 'yyyy-MM-dd'
                        todate: formatDateForInput(new Date(todate.split('-').reverse().join('-'))), // Convert to 'yyyy-MM-dd'
                      });
                      setSelectedMode(selectedOption.value); // Update the mode
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
                    disabled={selectedMode != 'Custom'}
                    value={filterUser.fromdate}
                    onChange={(e) => {
                      const selectedDate = e.target.value;
                      // Ensure that the selected date is not in the future
                      const currentDate = new Date().toISOString().split("T")[0];
                      if (selectedDate <= currentDate) {
                        setFilterUser({ ...filterUser, fromdate: selectedDate, todate: selectedDate });
                      } else {
                        // Handle the case where the selected date is in the future (optional)
                        // You may choose to show a message or take other actions.
                      }
                    }}
                    // Set the max attribute to the current date
                    inputProps={{ max: new Date().toISOString().split("T")[0] }}
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
                    disabled={selectedMode != 'Custom'}
                    value={filterUser.todate}
                    onChange={(e) => {
                      const selectedDate = e.target.value;
                      // Ensure that the selected date is not in the future
                      const currentDate = new Date().toISOString().split("T")[0];
                      const fromdateval = filterUser.fromdate != "" && new Date(filterUser.fromdate).toISOString().split("T")[0];
                      if (filterUser.fromdate == "") {
                        setPopupContentMalert("Please Select From Date");
                        setPopupSeverityMalert("warning");
                        handleClickOpenPopupMalert();
                      } else if (selectedDate < fromdateval) {
                        setFilterUser({ ...filterUser, todate: "" });
                        setPopupContentMalert("To Date should be after or equal to From Date");
                        setPopupSeverityMalert("warning");
                        handleClickOpenPopupMalert();
                      } else if (selectedDate <= currentDate) {
                        setFilterUser({ ...filterUser, todate: selectedDate });
                      } else {
                      }
                    }}
                    // Set the max attribute to the current date
                    inputProps={{ max: new Date().toISOString().split("T")[0], min: filterUser.fromdate !== "" ? filterUser.fromdate : null }}
                  />
                </FormControl>
              </Grid>
              {/* {filterUser.mode === 'Department' ?
                  <Grid item md={3} sx={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography> Department<b style={{ color: "red" }}>*</b> </Typography>
                      <MultiSelect
                        options={alldepartment?.map(data => ({
                          label: data.deptname,
                          value: data.deptname,
                        })).filter((item, index, self) => {
                          return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                        })}
                        value={selectedDep}
                        onChange={(e) => {
                          handleDepChangeFrom(e);
                        }}
                        valueRenderer={customValueRendererDepFrom}
                        labelledBy="Please Select Department"
                      />
                    </FormControl>
                  </Grid>
                  : null}
                {filterUser.mode === 'Employee' ?
                  <Grid item md={3} sx={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Employee Name<b style={{ color: "red" }}>*</b></Typography>
                      <MultiSelect
                        options={allUsersLimit
                          ?.filter(
                            (u) =>
                              valueCompany?.includes(u.company) &&
                              valueBranch?.includes(u.branch) &&
                              valueUnit?.includes(u.unit) &&
                              valueTeam?.includes(u.team)
                          )
                          .map((u) => ({
                            ...u,
                            label: u.companyname,
                            value: u.companyname,
                          }))}
                        value={selectedEmp}
                        onChange={handleCategoryChange}
                        valueRenderer={customValueRendererCate}
                        labelledBy="Please Select Employee Name"
                      />
                    </FormControl>
                  </Grid>
                  : null} */}
            </Grid>
            <Grid container spacing={1}>
              <Grid item lg={1} md={2} sm={2} xs={6}>
                <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0 } })}>
                  <Button sx={buttonStyles.buttonsubmit} variant="contained" onClick={handleSubmit}>
                    {' '}
                    Filter{' '}
                  </Button>
                </Box>
              </Grid>
              <Grid item lg={1} md={2} sm={2} xs={6}>
                <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0 } })}>
                  <Button sx={buttonStyles.btncancel} onClick={handleClear}>
                    {' '}
                    Clear{' '}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
          <br />
          {/* ****** Table Start ****** */}
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}> Attendance Check List </Typography>
            </Grid>
            <Grid container spacing={2} style={userStyle.dataTablestyle}>
              <Grid item md={2} xs={12} sm={12}>
                <Box>
                  <label>Show entries:</label>
                  <Select
                    id="pageSizeSelect"
                    value={pageSizeAttCheck}
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
                    <MenuItem value={userShifts?.length}>All</MenuItem>
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
                  {isUserRoleCompare?.includes('excelattendancechecklist') && (
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
                  {isUserRoleCompare?.includes('csvattendancechecklist') && (
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
                  {isUserRoleCompare?.includes('printattendancechecklist') && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        {' '}
                        &ensp; <FaPrint /> &ensp;Print&ensp;{' '}
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes('pdfattendancechecklist') && (
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
                  {isUserRoleCompare?.includes('imageattendancechecklist') && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                        {' '}
                        <ImageIcon sx={{ fontSize: '15px' }} /> &ensp;Image&ensp;{' '}
                      </Button>
                    </>
                  )}
                </Box>
              </Grid>
              <Grid item md={2} xs={12} sm={12}>
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
                            <IoMdOptions style={{ cursor: 'pointer' }} onClick={handleClickSearchAttCheck} />
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
            </Grid>{' '}
            <br />
            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
              {' '}
              Show All Columns{' '}
            </Button>
            &ensp;
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsAttCheck}>
              {' '}
              Manage Columns{' '}
            </Button>
            <br />
            <br />
            {loader ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '350px' }}>
                <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
              </Box>
            ) : (
              <>
                <Box sx={{ width: '100%' }} className={'ag-theme-quartz'} ref={gridRefImageAttCheck}>
                  <AgGridReact
                    rowData={filteredDataItems}
                    columnDefs={columnDataTableAttCheck.filter((column) => columnVisibilityAttCheck[column.field])}
                    ref={gridRefTableAttCheck}
                    defaultColDef={defaultColDef}
                    domLayout={'autoHeight'}
                    getRowStyle={getRowStyle}
                    pagination={true}
                    paginationPageSize={pageSizeAttCheck}
                    onPaginationChanged={onPaginationChanged}
                    onGridReady={onGridReady}
                    onColumnMoved={handleColumnMoved}
                    onColumnVisible={handleColumnVisible}
                    onFilterChanged={onFilterChanged}
                    // suppressPaginationPanel={true}
                    suppressSizeToFit={true}
                    suppressAutoSize={true}
                    suppressColumnVirtualisation={true}
                    colResizeDefault={'shift'}
                    cellSelection={true}
                    copyHeadersToClipboard={true}
                  />
                </Box>
                {/* show and hide based on the inner filter and outer filter */}
                {/* <Box style={userStyle.dataTablestyle}>
                  <Box>
                    Showing{" "}
                    {
                      gridApi && gridApi.getFilterModel() && Object.keys(gridApi.getFilterModel()).length === 0 ? (
                        (filteredDataItems.length > 0 ? (pageAttCheck - 1) * pageSizeAttCheck + 1 : 0)
                      ) : (
                        filteredRowData.length > 0 ? (pageAttCheck - 1) * pageSizeAttCheck + 1 : 0
                      )
                    }{" "}to{" "}
                    {
                      gridApi && gridApi.getFilterModel() && Object.keys(gridApi.getFilterModel()).length === 0 ? (
                        Math.min(pageAttCheck * pageSizeAttCheck, filteredDataItems.length)
                      ) : (
                        filteredRowData.length > 0 ? Math.min(pageAttCheck * pageSizeAttCheck, filteredRowData.length) : 0
                      )
                    }{" "}of{" "}
                    {
                      gridApi && gridApi.getFilterModel() && Object.keys(gridApi.getFilterModel()).length === 0 ? (
                        filteredDataItems.length
                      ) : (
                        filteredRowData.length
                      )
                    } entries
                  </Box>
                  <Box>
                    <Button onClick={() => handlePageChange(1)} disabled={pageAttCheck === 1} sx={userStyle.paginationbtn}  > <FirstPageIcon /> </Button>
                    <Button onClick={() => handlePageChange(pageAttCheck - 1)} disabled={pageAttCheck === 1} sx={userStyle.paginationbtn}  > <NavigateBeforeIcon />  </Button>
                    {getVisiblePageNumbers().map((pageNumber, index) => (
                      <Button
                        key={index}
                        onClick={() => pageNumber !== "..." && handlePageChange(pageNumber)}
                        sx={{
                          ...userStyle.paginationbtn,
                          ...(pageNumber === "..." && {
                            cursor: "default",
                            color: "black",
                            fontSize: '12px',
                            fontWeight: 'bold',
                            backgroundColor: "transparent",
                            border: "none",
                            "&:hover": {
                              backgroundColor: "transparent",
                              boxShadow: "none",
                            },
                          }),
                        }}
                        className={pageAttCheck === pageNumber ? "active" : ""}
                        disabled={pageAttCheck === pageNumber}
                      >
                        {pageNumber}
                      </Button>
                    ))}
                    <Button onClick={() => handlePageChange(pageAttCheck + 1)} disabled={pageAttCheck === totalPagesAttCheck} sx={userStyle.paginationbtn} > <NavigateNextIcon /> </Button>
                    <Button onClick={() => handlePageChange(totalPagesAttCheck)} disabled={pageAttCheck === totalPagesAttCheck} sx={userStyle.paginationbtn} ><LastPageIcon /> </Button>
                  </Box>
                </Box> */}
              </>
            )}
          </Box>
          {/* ****** Table End ****** */}
        </>
      )}

      {/* Manage Column */}
      <Popover id={idAttCheck} open={isManageColumnsOpenAttCheck} anchorEl={anchorElAttCheck} onClose={handleCloseManageColumnsAttCheck} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
        <ManageColumnsContent
          handleClose={handleCloseManageColumnsAttCheck}
          searchQuery={searchQueryManageAttCheck}
          setSearchQuery={setSearchQueryManageAttCheck}
          filteredColumns={filteredColumns}
          columnVisibility={columnVisibilityAttCheck}
          toggleColumnVisibility={toggleColumnVisibility}
          setColumnVisibility={setColumnVisibilityAttCheck}
          initialColumnVisibility={initialColumnVisibilityAttCheck}
          columnDataTable={columnDataTableAttCheck}
        />
      </Popover>

      {/* Search Bar */}
      <Popover id={idSearchAttCheck} open={openSearchAttCheck} anchorEl={anchorElSearchAttCheck} onClose={handleCloseSearchAttCheck} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <AdvancedSearchBar columns={columnDataTableAttCheck.filter((data) => data.field !== 'actions')} onSearch={applyAdvancedFilter} initialSearchValue={searchQueryAttCheck} handleCloseSearch={handleCloseSearchAttCheck} />
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
        filteredDataTwo={(filteredRowData.length > 0 ? filteredRowData : filteredData) ?? []}
        itemsTwo={userShifts ?? []}
        filename={'Attendance Check List'}
        exportColumnNames={exportColumnNamescrt}
        exportRowValues={exportRowValuescrt}
        componentRef={componentRef}
      />
      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation open={isDeleteOpen} onClose={handleCloseMod} onConfirm={undoAttendanceStatus} title="Are you sure?" confirmButtonText="Yes" cancelButtonText="Cancel" />
    </Box>
  );
}

export default AttendanceCheckList;