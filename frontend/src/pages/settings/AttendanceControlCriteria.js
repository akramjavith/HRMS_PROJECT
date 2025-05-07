import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { Box, Button, Dialog, Checkbox, DialogActions, DialogContent, Divider, FormControl, FormControlLabel, FormGroup, Grid, OutlinedInput, Switch, Typography, Tooltip } from '@mui/material';
import axios from 'axios';
import 'cropperjs/dist/cropper.css';
import React, { useContext, useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import 'react-image-crop/dist/ReactCrop.css';
import { ThreeDots } from 'react-loader-spinner';
import { MultiSelect } from 'react-multi-select-component';
import { Link } from 'react-router-dom';
import Selects from 'react-select';
import { Bounce, Slide, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AlertDialog from '../../components/Alert';
import { handleApiError } from '../../components/Errorhandling';
import Headtitle from '../../components/Headtitle';
import MessageAlert from '../../components/MessageAlert';
import PageHeading from '../../components/PageHeading';
import { AuthContext, UserRoleAccessContext } from '../../context/Appcontext';
import { userStyle } from '../../pageStyle';
import { SERVICE } from '../../services/Baseservice';
import PermCompensationTable from './AttendanceControlCriteriaTable/PermCompensation';
import GraceTimeTable from './AttendanceControlCriteriaTable/GraceTimeTable';
import OthoursTable from './AttendanceControlCriteriaTable/OThoursTable';
import WeekOffTable from './AttendanceControlCriteriaTable/WeekOffTable';
import InfoIcon from '@mui/icons-material/Info';

function AttendanceControlCriteria() {
  let toastId = null; // Store toast ID to control it

  const showToast = () => {
    toastId = toast.info(
      <div>
        <p style={{ marginBottom: '10px', fontSize: '14px', fontWeight: 'bold' }}>You have made changes. Please update!</p>
        <button
          onClick={handleSubmit}
          style={{
            backgroundColor: 'gold',
            border: 'none',
            padding: '8px 16px',
            cursor: 'pointer',
            borderRadius: '5px',
            fontWeight: 'bold',
            marginRight: '10px',
            transition: 'background-color 0.3s ease, transform 0.2s ease',
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#e6b800';
            e.target.style.transform = 'scale(1.05)';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = 'gold';
            e.target.style.transform = 'scale(1)';
          }}
        >
          Update
        </button>
      </div>,
      {
        position: 'top-right',
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        theme: 'dark',
        transition: Slide,
        closeButton: false,
      }
    );
  };

  // Function to close the toast manually
  const closeToast = () => {
    if (toastId == null) {
      toast.dismiss(toastId);
    }
  };

  const dateTYpeOption = [
    { label: '01', value: '01' },
    { label: '02', value: '02' },
    { label: '03', value: '03' },
    { label: '04', value: '04' },
    { label: '05', value: '05' },
    { label: '06', value: '06' },
    { label: '07', value: '07' },
    { label: '08', value: '08' },
    { label: '09', value: '09' },
    { label: '10', value: '10' },
    { label: '11', value: '11' },
    { label: '12', value: '12' },
    { label: '13', value: '13' },
    { label: '14', value: '14' },
    { label: '15', value: '15' },
    { label: '16', value: '16' },
    { label: '17', value: '17' },
    { label: '18', value: '18' },
    { label: '19', value: '19' },
    { label: '20', value: '20' },
    { label: '21', value: '21' },
    { label: '22', value: '22' },
    { label: '23', value: '23' },
    { label: '24', value: '24' },
    { label: '25', value: '25' },
    { label: '26', value: '26' },
    { label: '27', value: '27' },
    { label: '28', value: '28' },
    { label: '29', value: '29' },
    { label: '30', value: '30' },
    { label: '31', value: '31' },
  ];

  const [shifType, setShifType] = useState({
    startShiftDay: 'Day Shift',
    startTimeDay: 'Before',
    startHourDay: '00',
    startMinDay: '00',

    startShiftNight: 'Night Shift',
    startTimeNight: 'Before',
    startHourNight: '00',
    startMinNight: '00',
    dayactive: 'In-Active',
    nightactive: 'In-Active',

    entrystatusDays: '0',
    entrystatusHour: '00',
    entrystatusMin: '00',

    approvalstatusDays: '0',
    approvalstatusHour: '00',
    approvalstatusMin: '00',

    payrollamount: '',
  });

  const [shifTypeDup, setShifTypeDup] = useState({
    startShiftDay: 'Day Shift',
    startTimeDay: 'Before',
    startHourDay: '00',
    startMinDay: '00',

    startShiftNight: 'Night Shift',
    startTimeNight: 'Before',
    startHourNight: '00',
    startMinNight: '00',
    dayactive: 'In-Active',
    nightactive: 'In-Active',

    entrystatusDays: '0',
    entrystatusHour: '00',
    entrystatusMin: '00',

    approvalstatusDays: '0',
    approvalstatusHour: '00',
    approvalstatusMin: '00',

    payrollamount: '',
  });
  const [timeType, setTimeType] = useState('');

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
  const { isUserRoleCompare, isAssignBranch, allUsersData, allTeam, pageName, setPageName, isUserRoleAccess, buttonStyles } = useContext(UserRoleAccessContext);
  const accessbranch = isUserRoleAccess?.role?.includes('Manager')
    ? isAssignBranch?.map((data) => ({
      branch: data.branch,
      company: data.company,
      unit: data.unit,
      branchaddress: data?.branchaddress,
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
        branchaddress: data?.branchaddress,
      }));

  const [overAllsettingsCount, setOverAllsettingsCount] = useState();
  const [overAllsettingsID, setOverAllsettingsID] = useState();
  const [loading, setLoading] = useState(false);
  const { auth } = useContext(AuthContext);
  const [allTodo, setAllTodo] = useState([]);
  const [allTodoPermCompensation, setAllTodoPermCompensation] = useState([]);
  const [allTodoDup, setAllTodoDup] = useState([]);
  const [allTodoPermCompensationDup, setAllTodoPermCompensationDup] = useState([]);
  const [allWeekOffTodo, setAllWeekOffTodo] = useState([]);
  const [allWeekOffTodoDup, setAllWeekOffTodoDup] = useState([]);

  const [allTodoOthours, setAllTodoOthours] = useState([]);
  const [allTodoOthoursDup, setAllTodoOthoursDup] = useState([]);

  const [allData, setAllData] = useState({
    clockin: '',
    clockout: '',
    gracetime: '',
    onclockout: '',
    earlyclockin: '',
    lateclockin: '',
    earlyclockout: '',
    afterlateclockin: '',
    beforeearlyclockout: '',
    //
    longabsentcount: '',
    // longleavecount: '',
    allowedautoclockoutcount: '',
    tasklimitcount: '',
    tasklimitcountinday: '',
    //
    enableshiftbeforeothours: false,
    enableshitafterothours: false,
    enableshiftbeforeothoursvalue: '',
    enableshitafterothoursvalue: '',
    //
    lateclockincount: '',
    lateclockinreduces: 'Half day',
    lateclockinmorethanthat: 'Half day',
    //
    earlyclockoutcount: '',
    earlyclockoutreduces: 'Half day',
    earlyclockoutmorethanthat: 'Half day',
    //
    permissionperdayduration: '00:00',
    permissionpermonthduration: '',
    enablepermcompensation: false,
    enablebranchlimit: false,
    //
    leaverespecttoweekoff: false,
    leaverespecttotraining: false,
    //
    uninformedleave: false,
    uninformedleavecount: '',
    //
    leavefornoticeperiod: false,
    leavefornoticeperiodcount: '',
    //
    sunday: false,
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    //
    relievingfromdate: '',
    relievingtodate: '',
  });

  const [allDataDup, setAllDataDup] = useState({
    clockin: '',
    clockout: '',
    gracetime: '',
    onclockout: '',
    earlyclockin: '',
    lateclockin: '',
    earlyclockout: '',
    afterlateclockin: '',
    beforeearlyclockout: '',
    enableshiftbeforeothours: false,
    enableshitafterothours: false,
    enableshiftbeforeothoursvalue: '',
    enableshitafterothoursvalue: '',
    lateclockincount: '',
    lateclockinreduces: 'Half day',
    lateclockinmorethanthat: 'Half day',
    earlyclockoutcount: '',
    earlyclockoutreduces: 'Half day',
    earlyclockoutmorethanthat: 'Half day',
    permissionperdayduration: '00:00',
    permissionpermonthduration: '',
    enablepermcompensation: false,
    enablebranchlimit: false,
    leaverespecttoweekoff: false,
    leaverespecttotraining: false,
    uninformedleave: false,
    uninformedleavecount: '',
    leavefornoticeperiod: false,
    leavefornoticeperiodcount: '',
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    relievingfromdate: '',
    relievingtodate: '',
  });

  const [openview, setOpenview] = useState(false);

  // const handleClickOpenview = () => {
  //   setOpenview(true);
  // };
  const handleCloseview = () => {
    setOpenview(false);
  };

  const compareData = (data1, data2) => {
    for (let key in data1) {
      if (data1[key] !== data2[key]) {
        return true; // Return true if any value is different
      }
    }
    return false; // Return false if all values are the same
  };

  const hasChanges = compareData(allData, allDataDup);
  const hasChangesShifttype = compareData(shifType, shifTypeDup);

  const compareDataTodo = (data1, data2) => {
    if (!Array.isArray(data1) || !Array.isArray(data2)) return true; // Ensure both are arrays

    if (data1.length !== data2.length) return true; // Different lengths mean different data

    return data1.some((obj1, index) => {
      const obj2 = data2[index]; // Compare corresponding objects
      if (!obj2) return true; // If obj2 is undefined, arrays are different

      const keys1 = Object.keys(obj1).filter((key) => key !== '_id' && key !== 'employeegracetime'); // Exclude `_id`
      const keys2 = Object.keys(obj2).filter((key) => key !== '_id' && key !== 'employeegracetime'); // Exclude `_id`

      if (keys1.length !== keys2.length) return true; // Different keys count

      return keys1.some((key) => obj1[key] !== obj2[key]); // If any value differs
    });
  };

  const hasChangesTodo = compareDataTodo(allTodo, allTodoDup);
  const hasChangesTodoPermCompensation = compareDataTodo(allTodoPermCompensation, allTodoPermCompensationDup);
  const hasChangesTodoWeekTodo = compareDataTodo(allWeekOffTodo, allWeekOffTodoDup);
  const hasChangesTodoOthours = compareDataTodo(allTodoOthours, allTodoOthoursDup);

  useEffect(() => {
    if (hasChanges || hasChangesTodo || hasChangesTodoWeekTodo || hasChangesTodoOthours || hasChangesShifttype) {
      showToast();
    } else {
      closeToast();
    }
  }, [hasChanges, hasChangesTodo, hasChangesTodoWeekTodo, hasChangesTodoOthours, hasChangesShifttype]);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  //Delete model
  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
  };

  const [isDeleteOpenOthours, setIsDeleteOpenOthours] = useState(false);
  //Delete model
  const handleClickOpenOthours = () => {
    setIsDeleteOpenOthours(true);
  };
  const handleCloseModOthours = () => {
    setIsDeleteOpenOthours(false);
  };

  const [isDeleteOpenPermCompensation, setIsDeleteOpenPermCompensation] = useState(false);
  //Delete model
  const handleClickOpenPermCompensation = () => {
    setIsDeleteOpenPermCompensation(true);
  };
  const handleCloseModPermCompensation = () => {
    setIsDeleteOpenPermCompensation(false);
  };

  const [isDeleteOpenWeekOff, setIsDeleteOpenWeekOff] = useState(false);
  //Delete model
  const handleClickOpenWeekOff = () => {
    setIsDeleteOpenWeekOff(true);
  };
  const handleCloseModWeekOff = () => {
    setIsDeleteOpenWeekOff(false);
  };

  const [deleteIndex, setDeleteIndex] = useState('');
  const [deleteIndexweekoff, setDeleteIndexWeekoff] = useState('');
  const [deleteIndexOthours, setDeleteIndexOThours] = useState('');
  const [deleteIndexPermCompensation, setDeleteIndexPermCompensation] = useState('');
  const [singleTodo, setSingleTodo] = useState({
    company: 'Please Select Company',
    branch: 'Please Select Branch',
    unit: 'Please Select Unit',
    team: 'Please Select Team',
    employeename: 'Please Select Employee Name',
    employeedbid: '',
    employeeleaverespecttoweekoff: false,
    employeegracetime: '',
  });
  const [singleWeekOffTodo, setSingleWeekOffTodo] = useState({
    company: 'Please Select Company',
    branch: 'Please Select Branch',
    unit: 'Please Select Unit',
    team: 'Please Select Team',
    employeename: 'Please Select Employee Name',
    employeedbid: '',
    employeeleaverespecttoweekoff: false,
    enableweekoff: false,
    enableHoliday: false,
  });
  const [singleOthours, setSingleOthours] = useState({
    company: 'Please Select Company',
    branch: 'Please Select Branch',
    unit: 'Please Select Unit',
    team: 'Please Select Team',
    employeename: 'Please Select Employee Name',
    employeedbid: '',
    enableshiftbeforeothours: false,
    enableshiftbeforeothoursvalue: '',
    enableshitafterothours: false,
    enableshitafterothoursvalue: '',
  });

  const [singlePermCompensation, setSinglePermCompensation] = useState({
    company: 'Please Select Company',
    branch: 'Please Select Branch',
    unit: 'Please Select Unit',
    team: 'Please Select Team',
    employeename: 'Please Select Employee Name',
    employeedbid: '',
    empcode: '',
    enablepermcompensation: false,
    permissionperdayduration: '00:00',
  });

  const [weekOfEmployeeGracetime, setWeekOfEmployeeGracetime] = useState([]);
  const [weekOfEmployeeOthours, setWeekOfEmployeeOthours] = useState([]);
  const [employeePermCompensation, setEmployeePermCompensation] = useState([]);

  const addTodoOthours = () => {
    const isNameMatch = allTodoOthours?.some((item) => weekOfEmployeeOthours?.some((emp) => item.company === emp.company && item.branch === emp.branch && item.unit === emp.unit && item.team === emp.team && item.employeename === emp.employeename && item.employeedbid === emp.employeedbid));

    if (selectedOptionsCompanyOthours?.length === 0) {
      setPopupContentMalert('Please Select Company');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (selectedOptionsBranchOthours?.length === 0) {
      setPopupContentMalert('Please Select Branch');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (selectedOptionsUnitOthours?.length === 0) {
      setPopupContentMalert('Please Select Unit');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (selectedOptionsTeamOthours?.length === 0) {
      setPopupContentMalert('Please Select Team');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (selectedOptionsEmployeeOthours?.length === 0) {
      setPopupContentMalert('Please Select Employee');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (singleOthours?.enableshiftbeforeothours && singleOthours?.enableshiftbeforeothoursvalue === '') {
      setPopupContentMalert('Please Enter Shift Before OT Hours');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (singleOthours?.enableshitafterothours && singleOthours?.enableshitafterothoursvalue === '') {
      setPopupContentMalert('Please Enter Shift After OT Hours');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert('Employee already Exists!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (singleOthours !== '') {
      const setEnabletodoOthours = weekOfEmployeeOthours?.map((item) => ({
        ...item,
        enableshiftbeforeothours: singleOthours.enableshiftbeforeothours,
        enableshiftbeforeothoursvalue: singleOthours.enableshiftbeforeothoursvalue,
        enableshitafterothours: singleOthours.enableshitafterothours,
        enableshitafterothoursvalue: singleOthours.enableshitafterothoursvalue,
      }));
      setAllTodoOthours([...allTodoOthours, ...setEnabletodoOthours]);
      setSingleOthours({
        company: 'Please Select Company',
        branch: 'Please Select Branch',
        unit: 'Please Select Unit',
        team: 'Please Select Team',
        employeename: 'Please Select Employee Name',
        employeedbid: '',
        enableshiftbeforeothours: false,
        enableshiftbeforeothoursvalue: '',
        enableshitafterothours: false,
        enableshitafterothoursvalue: '',
      });
      setSelectedOptionsEmployeeOthours([]);
      setValueEmployeeCatOthours([]);
      setValueTeamCatOthours([]);
      setSelectedOptionsTeamOthours([]);
      setSelectedOptionsUnitOthours([]);
      setValueUnitCatOthours([]);
      setValueBranchCatOthours([]);
      setSelectedOptionsBranchOthours([]);
      setSelectedOptionsCompanyOthours([]);
      setValueCompanyCatOthours([]);
      setPopupContent('Added Successfully');
      setPopupSeverity('success');
      handleClickOpenPopup();
    }
  };

  const addTodo = () => {
    const isNameMatch = allTodo?.some((item) => weekOfEmployeeGracetime?.some((emp) => item.company === emp.company && item.branch === emp.branch && item.unit === emp.unit && item.team === emp.team && item.employeename === emp.employeename && item.employeedbid === emp.employeedbid));

    if (selectedOptionsCompanyGracetime?.length === 0) {
      setPopupContentMalert('Please Select Company');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (selectedOptionsBranchGracetime?.length === 0) {
      setPopupContentMalert('Please Select Branch');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (selectedOptionsUnitGracetime?.length === 0) {
      setPopupContentMalert('Please Select Unit');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (selectedOptionsTeamGracetime?.length === 0) {
      setPopupContentMalert('Please Select Team');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (selectedOptionsEmployeeGracetime?.length === 0) {
      setPopupContentMalert('Please Select Employee');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (singleTodo.employeegracetime === '' || Number(singleTodo.employeegracetime) <= 0) {
      setPopupContentMalert('Please Enter Grace Time');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert('Employee already Exists!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (singleTodo !== '') {
      const setEnabletodo = weekOfEmployeeGracetime?.map((item) => ({
        ...item,
        employeegracetime: singleTodo.employeegracetime,
      }));
      setAllTodo([...allTodo, ...setEnabletodo]);
      setSingleTodo({
        company: 'Please Select Company',
        branch: 'Please Select Branch',
        unit: 'Please Select Unit',
        team: 'Please Select Team',
        employeename: 'Please Select Employee Name',
        employeedbid: '',
        employeeleaverespecttoweekoff: false,
        employeegracetime: '',
      });
      setSelectedOptionsEmployeeGracetime([]);
      setValueEmployeeCatGracetime([]);
      setValueTeamCatGracetime([]);
      setSelectedOptionsTeamGracetime([]);
      setSelectedOptionsUnitGracetime([]);
      setValueUnitCatGracetime([]);
      setValueBranchCatGracetime([]);
      setSelectedOptionsBranchGracetime([]);
      setSelectedOptionsCompanyGracetime([]);
      setValueCompanyCatGracetime([]);
      setPopupContent('Added Successfully');
      setPopupSeverity('success');
      handleClickOpenPopup();
    }
  };

  const addTodoPermCompensation = () => {
    const isNameMatch = allTodoPermCompensation?.some((item) =>
      employeePermCompensation?.some((emp) => item.company === emp.company && item.branch === emp.branch && item.unit === emp.unit && item.team === emp.team && item.employeename === emp.employeename && item.employeedbid === emp.employeedbid)
    );

    if (selectedOptionsCompanyPermCompensation?.length === 0) {
      setPopupContentMalert('Please Select Company');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (selectedOptionsBranchPermCompensation?.length === 0) {
      setPopupContentMalert('Please Select Branch');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (selectedOptionsUnitPermCompensation?.length === 0) {
      setPopupContentMalert('Please Select Unit');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (selectedOptionsTeamPermCompensation?.length === 0) {
      setPopupContentMalert('Please Select Team');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (selectedOptionsEmployeePermCompensation?.length === 0) {
      setPopupContentMalert('Please Select Employee');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert('Employee already Exists!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (singlePermCompensation !== '') {
      const setEnabletodo = employeePermCompensation?.map((item) => ({
        ...item,
        enablepermcompensation: singlePermCompensation.enablepermcompensation,
        permissionperdayduration: allData.permissionperdayduration,
        permissionpermonthduration: allData.permissionpermonthduration,
        enablebranchlimit: allData.enablebranchlimit,
      }));
      setAllTodoPermCompensation([...allTodoPermCompensation, ...setEnabletodo]);
      setSinglePermCompensation({
        company: 'Please Select Company',
        branch: 'Please Select Branch',
        unit: 'Please Select Unit',
        team: 'Please Select Team',
        employeename: 'Please Select Employee Name',
        employeedbid: '',
        empcode: '',
        enablepermcompensation: false,
        permissionperdayduration: '00:00',
      });
      setSelectedOptionsEmployeePermCompensation([]);
      setValueEmployeeCatPermCompensation([]);
      setValueTeamCatPermCompensation([]);
      setSelectedOptionsTeamPermCompensation([]);
      setSelectedOptionsUnitPermCompensation([]);
      setValueUnitCatPermCompensation([]);
      setValueBranchCatPermCompensation([]);
      setSelectedOptionsBranchPermCompensation([]);
      setSelectedOptionsCompanyPermCompensation([]);
      setValueCompanyCatPermCompensation([]);
      setPopupContent('Added Successfully');
      setPopupSeverity('success');
      handleClickOpenPopup();
    }
  };

  const [weekOfEmployee, setWeekOfEmployee] = useState([]);

  const addTodoWeekOff = () => {
    const isNameMatch = allWeekOffTodo?.some((item) => weekOfEmployee?.some((emp) => item.company === emp.company && item.branch === emp.branch && item.unit === emp.unit && item.team === emp.team && item.employeename === emp.employeename && item.employeedbid === emp.employeedbid));

    if (selectedOptionsCompany?.length === 0) {
      setPopupContentMalert('Please Select Company');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (selectedOptionsBranch?.length === 0) {
      setPopupContentMalert('Please Select Branch');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (selectedOptionsUnit?.length === 0) {
      setPopupContentMalert('Please Select Unit');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (selectedOptionsTeam?.length === 0) {
      setPopupContentMalert('Please Select Team');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (selectedOptionsEmployee?.length === 0) {
      setPopupContentMalert('Please Select Employee');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert('Employee already Exists!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (singleWeekOffTodo !== '') {
      const setEnabletodo = weekOfEmployee?.map((item) => ({
        ...item,
        enableweekoff: singleWeekOffTodo?.enableweekoff,
        enableHoliday: singleWeekOffTodo?.enableHoliday,
      }));
      setAllWeekOffTodo([...allWeekOffTodo, ...setEnabletodo]);
      setSingleWeekOffTodo({
        company: 'Please Select Company',
        branch: 'Please Select Branch',
        unit: 'Please Select Unit',
        team: 'Please Select Team',
        employeename: 'Please Select Employee Name',
        employeedbid: '',
        employeeleaverespecttoweekoff: false,
        enableweekoff: false,
        enableHoliday: false,
      });
      setSelectedOptionsEmployee([]);
      setValueEmployeeCat([]);
      setValueTeamCat([]);
      setSelectedOptionsTeam([]);
      setSelectedOptionsUnit([]);
      setValueUnitCat([]);
      setValueBranchCat([]);
      setSelectedOptionsBranch([]);
      setSelectedOptionsCompany([]);
      setValueCompanyCat([]);
      setPopupContent('Added Successfully');
      setPopupSeverity('success');
      handleClickOpenPopup();
    }
  };
  const deleteTodo = (index) => {
    const newTasks = [...allTodo];
    newTasks.splice(index, 1);
    handleCloseMod();
    setAllTodo(newTasks);
    setPopupContent('Deleted Successfully');
    setPopupSeverity('success');
    handleClickOpenPopup();
  };

  const deleteTodoOthours = (index) => {
    const newTasks = [...allTodoOthours];
    newTasks.splice(index, 1);
    handleCloseModOthours();
    setAllTodoOthours(newTasks);
    setPopupContent('Deleted Successfully');
    setPopupSeverity('success');
    handleClickOpenPopup();
  };

  const deleteTodoPermCompensation = (index) => {
    const newTasks = [...allTodoPermCompensation];
    newTasks.splice(index, 1);
    handleCloseModPermCompensation();
    setAllTodoPermCompensation(newTasks);
    setPopupContent('Deleted Successfully');
    setPopupSeverity('success');
    handleClickOpenPopup();
  };

  const deleteWeekOffTodo = async (index) => {
    const newTasks = [...allWeekOffTodo];
    newTasks.splice(index, 1);

    handleCloseModWeekOff();
    const response = await axios.post(
      SERVICE.DELETE_HOLIDAYWEEKOFF_RESTRICTION,
      {
        companyname: allWeekOffTodo[index]?.employeename,
        type: 'attendance',
      },
      {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      }
    );
    setAllWeekOffTodo(newTasks);
    setPopupContent('Deleted Successfully');
    setPopupSeverity('success');
    handleClickOpenPopup();
  };
  const [hrsOption, setHrsOption] = useState([]);
  const [minsOption, setMinsOption] = useState([]);
  const [hours, setHours] = useState('Hrs');
  const [minutes, setMinutes] = useState('Mins');
  const [hoursMonths, setHoursMonths] = useState('Hrs');
  const [minutesMonths, setMinutesMonths] = useState('Mins');
  //function to generate hrs
  const generateHrsOptions = () => {
    const hrsOpt = [];
    for (let i = 0; i <= 23; i++) {
      if (i < 10) {
        i = '0' + i;
      }
      hrsOpt.push({ value: i.toString(), label: i.toString() });
    }
    setHrsOption(hrsOpt);
  };
  //function to generate mins
  const generateMinsOptions = () => {
    const minsOpt = [];
    for (let i = 0; i <= 59; i++) {
      if (i < 10) {
        i = '0' + i;
      }
      minsOpt.push({ value: i.toString(), label: i.toString() });
    }
    setMinsOption(minsOpt);
  };
  const reduceOptions = [
    { label: 'Half Day', value: 'Half Day' },
    { label: 'Full Day', value: 'Full Day' },
  ];

  const fetchOverAllSettings = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.post(
        `${SERVICE.GET_ATTENDANCE_CONTROL_CRITERIAASSIGNBRANCH}`,
        {
          assignbranch: accessbranch,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      setLoading(true);
      if (res?.data?.count === 0) {
        setOverAllsettingsCount(res?.data?.count);
      } else {
        const lastObject = res?.data?.attendancecontrolcriteria[res?.data?.attendancecontrolcriteria.length - 1];
        const lastObjectId = lastObject._id;
        setOverAllsettingsID(lastObjectId);
        setAllData(res?.data?.attendancecontrolcriteria[res?.data?.attendancecontrolcriteria.length - 1]);
        setAllDataDup(res?.data?.attendancecontrolcriteria[res?.data?.attendancecontrolcriteria.length - 1]);
        setAllTodo(res?.data?.attendancecontrolcriteria[res?.data?.attendancecontrolcriteria.length - 1]?.todos);
        setAllTodoDup(res?.data?.attendancecontrolcriteria[res?.data?.attendancecontrolcriteria.length - 1]?.todos);
        setAllTodoPermCompensation(res?.data?.attendancecontrolcriteria[res?.data?.attendancecontrolcriteria.length - 1]?.permissiontodos);
        setAllTodoPermCompensationDup(res?.data?.attendancecontrolcriteria[res?.data?.attendancecontrolcriteria.length - 1]?.permissiontodos);
        setAllWeekOffTodo(res?.data?.attendancecontrolcriteria[res?.data?.attendancecontrolcriteria.length - 1]?.weekofftodos);
        setAllWeekOffTodoDup(res?.data?.attendancecontrolcriteria[res?.data?.attendancecontrolcriteria.length - 1]?.weekofftodos);
        setAllTodoOthours(res?.data?.attendancecontrolcriteria[res?.data?.attendancecontrolcriteria.length - 1]?.othourstodos);
        setAllTodoOthoursDup(res?.data?.attendancecontrolcriteria[res?.data?.attendancecontrolcriteria.length - 1]?.othourstodos);
        const [hours, minutes] = res?.data?.attendancecontrolcriteria[res?.data?.attendancecontrolcriteria.length - 1].permissionperdayduration.split(':');
        setHours(hours);
        setMinutes(minutes);
        const [hoursmonth, minutesmonth] = res?.data?.attendancecontrolcriteria[res?.data?.attendancecontrolcriteria.length - 1].permissionpermonthduration;
        setHoursMonths(hoursmonth);
        setMinutesMonths(minutesmonth);
        setShifType({
          ...shifType,

          startShiftDay: lastObject.calcshiftday ? lastObject.calcshiftday : shifType.startShiftDay,
          startTimeDay: lastObject.calcshifttimeday ? lastObject.calcshifttimeday : shifType.startTimeDay,
          startHourDay: lastObject.calcshifthourday ? lastObject.calcshifthourday : shifType.startHourDay,
          startMinDay: lastObject.calcshiftminday ? lastObject.calcshiftminday : shifType.startMinDay,

          startShiftNight: lastObject.calcshiftnight ? lastObject.calcshiftnight : shifType.startShiftNight,
          startTimeNight: lastObject.calcshifttimenight ? lastObject.calcshifttimenight : shifType.startTimeDay,
          startHourNight: lastObject.calcshifthournight ? lastObject.calcshifthournight : shifType.startHourNight,
          startMinNight: lastObject.calcshiftminnight ? lastObject.calcshiftminnight : shifType.startMinNight,

          dayactive: lastObject.dayactive ? (lastObject.dayactive === true ? 'Active' : 'In-Active') : shifType.dayactive,
          nightactive: lastObject.nightactive ? (lastObject.nightactive === true ? 'Active' : 'In-Active') : shifType.nightactive,

          entrystatusDays: lastObject.entrystatusDays ? lastObject.entrystatusDays : shifType.entrystatusDays,
          entrystatusHour: lastObject.entrystatusHour ? lastObject.entrystatusHour : shifType.entrystatusHour,
          entrystatusMin: lastObject.entrystatusMin ? lastObject.entrystatusMin : shifType.entrystatusMin,

          approvalstatusDays: lastObject.approvalstatusDays ? lastObject.approvalstatusDays : shifType.approvalstatusDays,
          approvalstatusHour: lastObject.approvalstatusHour ? lastObject.approvalstatusHour : shifType.approvalstatusHour,
          approvalstatusMin: lastObject.approvalstatusMin ? lastObject.approvalstatusMin : shifType.approvalstatusMin,
          payrollamount: lastObject.payrollamount ? lastObject.payrollamount : shifType.payrollamount,
        });

        setShifTypeDup({
          ...shifType,

          startShiftDay: lastObject.calcshiftday ? lastObject.calcshiftday : shifType.startShiftDay,
          startTimeDay: lastObject.calcshifttimeday ? lastObject.calcshifttimeday : shifType.startTimeDay,
          startHourDay: lastObject.calcshifthourday ? lastObject.calcshifthourday : shifType.startHourDay,
          startMinDay: lastObject.calcshiftminday ? lastObject.calcshiftminday : shifType.startMinDay,

          startShiftNight: lastObject.calcshiftnight ? lastObject.calcshiftnight : shifType.startShiftNight,
          startTimeNight: lastObject.calcshifttimenight ? lastObject.calcshifttimenight : shifType.startTimeDay,
          startHourNight: lastObject.calcshifthournight ? lastObject.calcshifthournight : shifType.startHourNight,
          startMinNight: lastObject.calcshiftminnight ? lastObject.calcshiftminnight : shifType.startMinNight,

          dayactive: lastObject.dayactive ? (lastObject.dayactive === true ? 'Active' : 'In-Active') : shifType.dayactive,
          nightactive: lastObject.nightactive ? (lastObject.nightactive === true ? 'Active' : 'In-Active') : shifType.nightactive,

          entrystatusDays: lastObject.entrystatusDays ? lastObject.entrystatusDays : shifType.entrystatusDays,
          entrystatusHour: lastObject.entrystatusHour ? lastObject.entrystatusHour : shifType.entrystatusHour,
          entrystatusMin: lastObject.entrystatusMin ? lastObject.entrystatusMin : shifType.entrystatusMin,

          approvalstatusDays: lastObject.approvalstatusDays ? lastObject.approvalstatusDays : shifType.approvalstatusDays,
          approvalstatusHour: lastObject.approvalstatusHour ? lastObject.approvalstatusHour : shifType.approvalstatusHour,
          approvalstatusMin: lastObject.approvalstatusMin ? lastObject.approvalstatusMin : shifType.approvalstatusMin,
          payrollamount: lastObject.payrollamount ? lastObject.payrollamount : shifType.payrollamount,
        });
      }
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
      pagename: String('AttendanceControlCriteria'),
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

  useEffect(() => {
    fetchOverAllSettings();
    generateHrsOptions();
    generateMinsOptions();
    getapi();
  }, []);
  const sendRequest = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.post(`${SERVICE.CREATE_ATTENDANCE_CONTROL_CRITERIA}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        clockin: String(allData.clockin),
        clockout: String(allData.clockout),
        gracetime: String(allData.gracetime),
        onclockout: String(allData.onclockout),
        earlyclockin: String(allData.earlyclockin),
        lateclockin: String(allData.lateclockin),
        earlyclockout: String(allData.earlyclockout),
        //
        afterlateclockin: String(allData.afterlateclockin),
        beforeearlyclockout: String(allData.beforeearlyclockout),
        //
        enableshiftbeforeothours: String(allData.enableshiftbeforeothours),
        enableshitafterothours: String(allData.enableshitafterothours),
        enableshiftbeforeothoursvalue: String(allData.enableshiftbeforeothoursvalue),
        enableshitafterothoursvalue: String(allData.enableshitafterothoursvalue),
        //
        lateclockincount: String(allData.lateclockincount),
        lateclockinreduces: String(allData.lateclockinreduces),
        lateclockinmorethanthat: String(allData.lateclockinmorethanthat),
        //
        earlyclockoutcount: String(allData.earlyclockoutcount),
        earlyclockoutreduces: String(allData.earlyclockoutreduces),
        earlyclockoutmorethanthat: String(allData.earlyclockoutmorethanthat),
        //
        permissionperdayduration: String(allData.permissionperdayduration),
        permissionpermonthduration: String(allData.permissionpermonthduration),
        enablepermcompensation: Boolean(allData.enablepermcompensation),
        enablebranchlimit: Boolean(allData.enablebranchlimit),
        //
        leaverespecttoweekoff: Boolean(allData.leaverespecttoweekoff),
        leaverespecttotraining: Boolean(allData.leaverespecttotraining),
        //
        uninformedleave: Boolean(allData.uninformedleave),
        uninformedleavecount: String(allData.uninformedleavecount),

        longabsentcount: Number(allData.longabsentcount),
        // longleavecount: Number(allData.longleavecount),
        allowedautoclockoutcount: Number(allData.allowedautoclockoutcount),
        tasklimitcount: Number(allData.tasklimitcount),
        tasklimitcountinday: Number(allData.tasklimitcountinday),

        //
        leavefornoticeperiod: Boolean(allData.leavefornoticeperiod),
        leavefornoticeperiodcount: String(allData.leavefornoticeperiodcount),
        //
        monday: Boolean(allData.monday),
        tuesday: Boolean(allData.tuesday),
        wednesday: Boolean(allData.wednesday),
        thursday: Boolean(allData.thursday),
        friday: Boolean(allData.friday),
        saturday: Boolean(allData.saturday),
        sunday: Boolean(allData.sunday),
        //
        relievingfromdate: String(allData.relievingfromdate),
        relievingtodate: String(allData.relievingtodate),
        //
        todos: [...allTodo],
        weekofftodos: [...allWeekOffTodo],
        othourstodos: [...allTodoOthours],
        permissiontodos: [...allTodoPermCompensation],
      });
      await fetchOverAllSettings();
      setPopupContent('Updated Successfully');
      setPopupSeverity('success');
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  const sendEditRequest = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.put(`${SERVICE.SINGLE_ATTENDANCE_CONTROL_CRITERIA}/${overAllsettingsID}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        clockin: String(allData.clockin),
        clockout: String(allData.clockout),
        gracetime: String(allData.gracetime),
        onclockout: String(allData.onclockout),
        earlyclockin: String(allData.earlyclockin),
        lateclockin: String(allData.lateclockin),
        earlyclockout: String(allData.earlyclockout),
        //
        afterlateclockin: String(allData.afterlateclockin),
        beforeearlyclockout: String(allData.beforeearlyclockout),
        //
        enableshiftbeforeothours: Boolean(allData.enableshiftbeforeothours),
        enableshitafterothours: Boolean(allData.enableshitafterothours),
        enableshiftbeforeothoursvalue: String(allData.enableshiftbeforeothoursvalue),
        enableshitafterothoursvalue: String(allData.enableshitafterothoursvalue),
        //
        lateclockincount: String(allData.lateclockincount),
        lateclockinreduces: String(allData.lateclockinreduces),
        lateclockinmorethanthat: String(allData.lateclockinmorethanthat),
        //
        earlyclockoutcount: String(allData.earlyclockoutcount),
        earlyclockoutreduces: String(allData.earlyclockoutreduces),
        earlyclockoutmorethanthat: String(allData.earlyclockoutmorethanthat),
        //
        permissionperdayduration: String(allData.permissionperdayduration),
        permissionpermonthduration: String(allData.permissionpermonthduration),
        enablepermcompensation: Boolean(allData.enablepermcompensation),
        enablebranchlimit: Boolean(allData.enablebranchlimit),
        //
        leaverespecttoweekoff: Boolean(allData.leaverespecttoweekoff),
        leaverespecttotraining: Boolean(allData.leaverespecttotraining),
        //
        longabsentcount: Number(allData.longabsentcount),
        // longleavecount: Number(allData.longleavecount),
        allowedautoclockoutcount: Number(allData.allowedautoclockoutcount),
        tasklimitcount: Number(allData.tasklimitcount),
        tasklimitcountinday: Number(allData.tasklimitcountinday),

        //
        uninformedleave: Boolean(allData.uninformedleave),
        uninformedleavecount: String(allData.uninformedleavecount),
        //
        leavefornoticeperiod: Boolean(allData.leavefornoticeperiod),
        leavefornoticeperiodcount: String(allData.leavefornoticeperiodcount),
        //
        monday: Boolean(allData.monday),
        tuesday: Boolean(allData.tuesday),
        wednesday: Boolean(allData.wednesday),
        thursday: Boolean(allData.thursday),
        friday: Boolean(allData.friday),
        saturday: Boolean(allData.saturday),
        sunday: Boolean(allData.sunday),
        //
        relievingfromdate: String(allData.relievingfromdate),
        relievingtodate: String(allData.relievingtodate),
        //
        todos: [...allTodo],
        weekofftodos: [...allWeekOffTodo],
        othourstodos: [...allTodoOthours],
        permissiontodos: [...allTodoPermCompensation],

        calcshiftday: shifType.startShiftDay,
        calcshifttimeday: shifType.startTimeDay,
        calcshifthourday: shifType.startHourDay,
        calcshiftminday: shifType.startMinDay,

        entrystatusDays: shifType.entrystatusDays,
        entrystatusHour: shifType.entrystatusHour,
        entrystatusMin: shifType.entrystatusMin,
        approvalstatusDays: shifType.approvalstatusDays,
        approvalstatusHour: shifType.approvalstatusHour,
        approvalstatusMin: shifType.approvalstatusMin,
        payrollamount: shifType.payrollamount,

        calcshiftnight: shifType.startShiftNight,
        calcshifttimenight: shifType.startTimeNight,
        calcshifthournight: shifType.startHourNight,
        calcshiftminnight: shifType.startMinNight,

        dayactive: Boolean(shifType.dayactive === 'Active' ? true : false),
        nightactive: Boolean(shifType.nightactive === 'Active' ? true : false),
      });
      await fetchOverAllSettings();
      setPopupContent('Updated Successfully');
      setPopupSeverity('success');
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (allData?.enableshiftbeforeothours && allData?.enableshiftbeforeothoursvalue === '') {
      setPopupContentMalert('Please Enter Shift Before OT Hours');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (allData?.enableshitafterothours && allData?.enableshitafterothoursvalue === '') {
      setPopupContentMalert('Please Enter Shift After OT Hours');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (overAllsettingsCount === 0) {
      sendRequest();
    } else {
      sendEditRequest();
    }
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
    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);
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
    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);
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
    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);
  };

  const customValueRendererUnit = (valueUnitCat, _categoryname) => {
    return valueUnitCat?.length ? valueUnitCat.map(({ label }) => label)?.join(', ') : 'Please Select Unit';
  };

  //team multiselect
  const [selectedOptionsTeam, setSelectedOptionsTeam] = useState([]);
  let [valueTeamCat, setValueTeamCat] = useState([]);

  const customValueRendererTeam = (valueTeamCat, _categoryname) => {
    return valueTeamCat?.length ? valueTeamCat.map(({ label }) => label)?.join(', ') : 'Please Select Team';
  };

  const handleTeamChange = (options) => {
    setValueTeamCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsTeam(options);
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

  //PermCompensationcompany multiselect
  const [selectedOptionsCompanyPermCompensation, setSelectedOptionsCompanyPermCompensation] = useState([]);
  let [valueCompanyCatPermCompensation, setValueCompanyCatPermCompensation] = useState([]);

  const handleCompanyChangePermCompensation = (options) => {
    setValueCompanyCatPermCompensation(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCompanyPermCompensation(options);
    setValueBranchCatPermCompensation([]);
    setSelectedOptionsBranchPermCompensation([]);
    setValueUnitCatPermCompensation([]);
    setSelectedOptionsUnitPermCompensation([]);
    setValueTeamCatPermCompensation([]);
    setSelectedOptionsTeamPermCompensation([]);
    setValueEmployeeCatPermCompensation([]);
    setSelectedOptionsEmployeePermCompensation([]);
  };

  const customValueRendererCompanyPermCompensation = (valueCompanyCatPermCompensation, _categoryname) => {
    return valueCompanyCatPermCompensation?.length ? valueCompanyCatPermCompensation.map(({ label }) => label)?.join(', ') : 'Please Select Company';
  };

  //PermCompensationbranch multiselect
  const [selectedOptionsBranchPermCompensation, setSelectedOptionsBranchPermCompensation] = useState([]);
  let [valueBranchCatPermCompensation, setValueBranchCatPermCompensation] = useState([]);

  const handleBranchChangePermCompensation = (options) => {
    setValueBranchCatPermCompensation(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsBranchPermCompensation(options);
    setValueUnitCatPermCompensation([]);
    setSelectedOptionsUnitPermCompensation([]);
    setValueTeamCatPermCompensation([]);
    setSelectedOptionsTeamPermCompensation([]);
    setValueEmployeeCatPermCompensation([]);
    setSelectedOptionsEmployeePermCompensation([]);
  };

  const customValueRendererBranchPermCompensation = (valueBranchCatPermCompensation, _categoryname) => {
    return valueBranchCatPermCompensation?.length ? valueBranchCatPermCompensation.map(({ label }) => label)?.join(', ') : 'Please Select Branch';
  };

  //PermCompensationunit multiselect
  const [selectedOptionsUnitPermCompensation, setSelectedOptionsUnitPermCompensation] = useState([]);
  let [valueUnitCatPermCompensation, setValueUnitCatPermCompensation] = useState([]);

  const handleUnitChangePermCompensation = (options) => {
    setValueUnitCatPermCompensation(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsUnitPermCompensation(options);
    setValueTeamCatPermCompensation([]);
    setSelectedOptionsTeamPermCompensation([]);
    setValueEmployeeCatPermCompensation([]);
    setSelectedOptionsEmployeePermCompensation([]);
  };

  const customValueRendererUnitPermCompensation = (valueUnitCatPermCompensation, _categoryname) => {
    return valueUnitCatPermCompensation?.length ? valueUnitCatPermCompensation.map(({ label }) => label)?.join(', ') : 'Please Select Unit';
  };

  //PermCompensationteam multiselect
  const [selectedOptionsTeamPermCompensation, setSelectedOptionsTeamPermCompensation] = useState([]);
  let [valueTeamCatPermCompensation, setValueTeamCatPermCompensation] = useState([]);

  const customValueRendererTeamPermCompensation = (valueTeamCatPermCompensation, _categoryname) => {
    return valueTeamCatPermCompensation?.length ? valueTeamCatPermCompensation.map(({ label }) => label)?.join(', ') : 'Please Select Team';
  };

  const handleTeamChangePermCompensation = (options) => {
    setValueTeamCatPermCompensation(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsTeamPermCompensation(options);
  };

  //PermCompensationemployee multiselect
  const [selectedOptionsEmployeePermCompensation, setSelectedOptionsEmployeePermCompensation] = useState([]);
  let [valueEmployeeCatPermCompensation, setValueEmployeeCatPermCompensation] = useState([]);

  const handleEmployeeChangePermCompensation = (options) => {
    setValueEmployeeCatPermCompensation(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsEmployeePermCompensation(options);
  };

  const customValueRendererEmployeePermCompensation = (valueEmployeeCatPermCompensation, _categoryname) => {
    return valueEmployeeCatPermCompensation?.length ? valueEmployeeCatPermCompensation.map(({ label }) => label)?.join(', ') : 'Please Select Employee';
  };

  //Gracetimecompany multiselect
  const [selectedOptionsCompanyGracetime, setSelectedOptionsCompanyGracetime] = useState([]);
  let [valueCompanyCatGracetime, setValueCompanyCatGracetime] = useState([]);

  const handleCompanyChangeGracetime = (options) => {
    setValueCompanyCatGracetime(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCompanyGracetime(options);
    setValueBranchCatGracetime([]);
    setSelectedOptionsBranchGracetime([]);
    setValueUnitCatGracetime([]);
    setSelectedOptionsUnitGracetime([]);
    setValueTeamCatGracetime([]);
    setSelectedOptionsTeamGracetime([]);
    setValueEmployeeCatGracetime([]);
    setSelectedOptionsEmployeeGracetime([]);
  };

  const customValueRendererCompanyGracetime = (valueCompanyCatGracetime, _categoryname) => {
    return valueCompanyCatGracetime?.length ? valueCompanyCatGracetime.map(({ label }) => label)?.join(', ') : 'Please Select Company';
  };

  //Gracetimebranch multiselect
  const [selectedOptionsBranchGracetime, setSelectedOptionsBranchGracetime] = useState([]);
  let [valueBranchCatGracetime, setValueBranchCatGracetime] = useState([]);

  const handleBranchChangeGracetime = (options) => {
    setValueBranchCatGracetime(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsBranchGracetime(options);
    setValueUnitCatGracetime([]);
    setSelectedOptionsUnitGracetime([]);
    setValueTeamCatGracetime([]);
    setSelectedOptionsTeamGracetime([]);
    setValueEmployeeCatGracetime([]);
    setSelectedOptionsEmployeeGracetime([]);
  };

  const customValueRendererBranchGracetime = (valueBranchCatGracetime, _categoryname) => {
    return valueBranchCatGracetime?.length ? valueBranchCatGracetime.map(({ label }) => label)?.join(', ') : 'Please Select Branch';
  };

  //Gracetimeunit multiselect
  const [selectedOptionsUnitGracetime, setSelectedOptionsUnitGracetime] = useState([]);
  let [valueUnitCatGracetime, setValueUnitCatGracetime] = useState([]);

  const handleUnitChangeGracetime = (options) => {
    setValueUnitCatGracetime(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsUnitGracetime(options);
    setValueTeamCatGracetime([]);
    setSelectedOptionsTeamGracetime([]);
    setValueEmployeeCatGracetime([]);
    setSelectedOptionsEmployeeGracetime([]);
  };

  const customValueRendererUnitGracetime = (valueUnitCatGracetime, _categoryname) => {
    return valueUnitCatGracetime?.length ? valueUnitCatGracetime.map(({ label }) => label)?.join(', ') : 'Please Select Unit';
  };

  //Gracetimeteam multiselect
  const [selectedOptionsTeamGracetime, setSelectedOptionsTeamGracetime] = useState([]);
  let [valueTeamCatGracetime, setValueTeamCatGracetime] = useState([]);

  const customValueRendererTeamGracetime = (valueTeamCatGracetime, _categoryname) => {
    return valueTeamCatGracetime?.length ? valueTeamCatGracetime.map(({ label }) => label)?.join(', ') : 'Please Select Team';
  };

  const handleTeamChangeGracetime = (options) => {
    setValueTeamCatGracetime(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsTeamGracetime(options);
  };

  //Gracetimeemployee multiselect
  const [selectedOptionsEmployeeGracetime, setSelectedOptionsEmployeeGracetime] = useState([]);
  let [valueEmployeeCatGracetime, setValueEmployeeCatGracetime] = useState([]);

  const handleEmployeeChangeGracetime = (options) => {
    setValueEmployeeCatGracetime(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsEmployeeGracetime(options);
  };

  const customValueRendererEmployeeGracetime = (valueEmployeeCatGracetime, _categoryname) => {
    return valueEmployeeCatGracetime?.length ? valueEmployeeCatGracetime.map(({ label }) => label)?.join(', ') : 'Please Select Employee';
  };

  //Othourscompany multiselect
  const [selectedOptionsCompanyOthours, setSelectedOptionsCompanyOthours] = useState([]);
  let [valueCompanyCatOthours, setValueCompanyCatOthours] = useState([]);

  const handleCompanyChangeOthours = (options) => {
    setValueCompanyCatOthours(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCompanyOthours(options);
    setValueBranchCatOthours([]);
    setSelectedOptionsBranchOthours([]);
    setValueUnitCatOthours([]);
    setSelectedOptionsUnitOthours([]);
    setValueTeamCatOthours([]);
    setSelectedOptionsTeamOthours([]);
    setValueEmployeeCatOthours([]);
    setSelectedOptionsEmployeeOthours([]);
  };

  const customValueRendererCompanyOthours = (valueCompanyCatOthours, _categoryname) => {
    return valueCompanyCatOthours?.length ? valueCompanyCatOthours.map(({ label }) => label)?.join(', ') : 'Please Select Company';
  };

  //Othoursbranch multiselect
  const [selectedOptionsBranchOthours, setSelectedOptionsBranchOthours] = useState([]);
  let [valueBranchCatOthours, setValueBranchCatOthours] = useState([]);

  const handleBranchChangeOthours = (options) => {
    setValueBranchCatOthours(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsBranchOthours(options);
    setValueUnitCatOthours([]);
    setSelectedOptionsUnitOthours([]);
    setValueTeamCatOthours([]);
    setSelectedOptionsTeamOthours([]);
    setValueEmployeeCatOthours([]);
    setSelectedOptionsEmployeeOthours([]);
  };

  const customValueRendererBranchOthours = (valueBranchCatOthours, _categoryname) => {
    return valueBranchCatOthours?.length ? valueBranchCatOthours.map(({ label }) => label)?.join(', ') : 'Please Select Branch';
  };

  //OThoursunit multiselect
  const [selectedOptionsUnitOthours, setSelectedOptionsUnitOthours] = useState([]);
  let [valueUnitCatOthours, setValueUnitCatOthours] = useState([]);

  const handleUnitChangeOthours = (options) => {
    setValueUnitCatOthours(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsUnitOthours(options);
    setValueTeamCatOthours([]);
    setSelectedOptionsTeamOthours([]);
    setValueEmployeeCatOthours([]);
    setSelectedOptionsEmployeeOthours([]);
  };

  const customValueRendererUnitOthours = (valueUnitCatOthours, _categoryname) => {
    return valueUnitCatOthours?.length ? valueUnitCatOthours.map(({ label }) => label)?.join(', ') : 'Please Select Unit';
  };

  //OThoursteam multiselect
  const [selectedOptionsTeamOthours, setSelectedOptionsTeamOthours] = useState([]);
  let [valueTeamCatOthours, setValueTeamCatOthours] = useState([]);

  const customValueRendererTeamOthours = (valueTeamCatOthours, _categoryname) => {
    return valueTeamCatOthours?.length ? valueTeamCatOthours.map(({ label }) => label)?.join(', ') : 'Please Select Team';
  };

  const handleTeamChangeOthours = (options) => {
    setValueTeamCatOthours(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsTeamOthours(options);
  };

  //OThoursemployee multiselect
  const [selectedOptionsEmployeeOthours, setSelectedOptionsEmployeeOthours] = useState([]);
  let [valueEmployeeCatOthours, setValueEmployeeCatOthours] = useState([]);

  const handleEmployeeChangeOthours = (options) => {
    setValueEmployeeCatOthours(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsEmployeeOthours(options);
  };

  const customValueRendererEmployeeOthours = (valueEmployeeCatOthours, _categoryname) => {
    return valueEmployeeCatOthours?.length ? valueEmployeeCatOthours.map(({ label }) => label)?.join(', ') : 'Please Select Employee';
  };

  return (
    <Box>
      <Headtitle title={'ATTENDANCE CONTROL CRITERIA'} />
      <PageHeading title="Attendance Control Criteria" modulename="Settings" submodulename="Attendance Control Criteria" mainpagename="" subpagename="" subsubpagename="" />
      {!loading ? (
        <Box sx={userStyle.container}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              minHeight: '350px',
            }}
          >
            <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
          </Box>
        </Box>
      ) : (
        <Box sx={userStyle.selectcontainer}>
          {isUserRoleCompare?.includes('aattendancecontrolcriteria') && (
            <form onSubmit={handleSubmit}>
              <Typography sx={userStyle.SubHeaderText}>Add Attendance Control Criteria</Typography>
              <br />
              <br />
              <Grid container spacing={2}>
                <Grid item md={2} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>ClockIn (hours)</Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={hrsOption}
                      placeholder="Hrs"
                      value={{ label: allData.clockin, value: allData.clockin }}
                      onChange={(e) => {
                        setAllData({
                          ...allData,
                          clockin: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={2} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>ClockOut (hours)</Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={hrsOption}
                      placeholder="Hrs"
                      value={{
                        label: allData.clockout,
                        value: allData.clockout,
                      }}
                      onChange={(e) => {
                        setAllData({
                          ...allData,
                          clockout: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={2} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Grace Time (minutes)</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Grace Time in Minutes"
                      value={allData.gracetime}
                      onChange={(e) => {
                        const enteredValue = e.target.value.replace(/\D/g, '').slice(0, 3);
                        if (enteredValue === '' || /^\d+$/.test(enteredValue)) {
                          setAllData({
                            ...allData,
                            gracetime: enteredValue,
                          });
                        }
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={2} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>On ClockOut (minutes)</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter On Clockout in Minutes"
                      value={allData.onclockout}
                      onChange={(e) => {
                        const enteredValue = e.target.value.replace(/\D/g, '').slice(0, 3);
                        if (enteredValue === '' || /^\d+$/.test(enteredValue)) {
                          setAllData({
                            ...allData,
                            onclockout: enteredValue,
                          });
                        }
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={2} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Early ClockIn (minutes)</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Early ClockIn in Minutes"
                      value={allData.earlyclockin}
                      onChange={(e) => {
                        const enteredValue = e.target.value.replace(/\D/g, '').slice(0, 3);
                        if (enteredValue === '' || /^\d+$/.test(enteredValue)) {
                          setAllData({
                            ...allData,
                            earlyclockin: enteredValue,
                          });
                        }
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Late Clockin (minutes)</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Late Clockin in Minutes"
                      value={allData.lateclockin}
                      onChange={(e) => {
                        const enteredValue = e.target.value.replace(/\D/g, '').slice(0, 3);
                        if (enteredValue === '' || /^\d+$/.test(enteredValue)) {
                          setAllData({
                            ...allData,
                            lateclockin: enteredValue,
                          });
                        }
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Early Clockout (minutes)</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Early ClockIn in Minutes"
                      value={allData.earlyclockout}
                      onChange={(e) => {
                        const enteredValue = e.target.value.replace(/\D/g, '').slice(0, 3);
                        if (enteredValue === '' || /^\d+$/.test(enteredValue)) {
                          setAllData({
                            ...allData,
                            earlyclockout: enteredValue,
                          });
                        }
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      After Late Clockin (minutes)
                      <Tooltip
                        title="ClockIn Time calculation based on after late clockin hours. For exp: If clockin time between 09.35AM to 11.05AM(90-Min) (Grace Time => 08:05AM(5-Min), Late clockin => 08:05AM - 09:35AM(90-Min)) it will consider as 'HLOP' for the shift '08:00AMto06:00PM"
                        placement="top-start"
                      >
                        <InfoIcon />
                      </Tooltip>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Early ClockIn in Minutes"
                      value={allData.afterlateclockin}
                      onChange={(e) => {
                        const enteredValue = e.target.value.replace(/\D/g, '').slice(0, 3);
                        if (enteredValue === '' || /^\d+$/.test(enteredValue)) {
                          setAllData({
                            ...allData,
                            afterlateclockin: enteredValue,
                          });
                        }
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Before Early Clockout (minutes)
                      <Tooltip title="Clockout Time calculation based on after early clockout hours. For exp: If clockout time between 01.00PM to 05.00PM(240-Min) (Early clockout => 5:00PM - 06:00PM(60-Min)) it will consider as 'HLOP' for the shift '08:00AMto06:00PM" placement="top-start">
                        <InfoIcon />
                      </Tooltip>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Early ClockIn in Minutes"
                      value={allData.beforeearlyclockout}
                      onChange={(e) => {
                        const enteredValue = e.target.value.replace(/\D/g, '').slice(0, 3);
                        if (enteredValue === '' || /^\d+$/.test(enteredValue)) {
                          setAllData({
                            ...allData,
                            beforeearlyclockout: enteredValue,
                          });
                        }
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12} marginTop={3}>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={allData.enableshiftbeforeothours}
                          onChange={(e) =>
                            setAllData({
                              ...allData,
                              enableshiftbeforeothours: !allData.enableshiftbeforeothours,
                              enableshiftbeforeothoursvalue: '',
                            })
                          }
                        />
                      }
                      label="Enable Shift Before OT Hours"
                    />
                  </FormGroup>
                </Grid>
                {allData.enableshiftbeforeothours && (
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Shift Before OT Hours(Minutes)<b style={{ color: 'red' }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Please Enter Shift Before OT Hours"
                        value={allData.enableshiftbeforeothoursvalue}
                        onChange={(e) => {
                          const enteredValue = e.target.value.replace(/\D/g, '').slice(0, 3);
                          if (enteredValue === '' || /^\d+$/.test(enteredValue)) {
                            setAllData({
                              ...allData,
                              enableshiftbeforeothoursvalue: enteredValue,
                            });
                          }
                        }}
                      />
                    </FormControl>
                  </Grid>
                )}
                <Grid item md={3} xs={12} sm={12} marginTop={3}>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={allData.enableshitafterothours}
                          onChange={(e) =>
                            setAllData({
                              ...allData,
                              enableshitafterothours: !allData.enableshitafterothours,
                              enableshitafterothoursvalue: '',
                            })
                          }
                        />
                      }
                      label="Enable Shift After OT Hours"
                    />
                  </FormGroup>
                </Grid>
                {allData.enableshitafterothours && (
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Shift After OT Hours(Minutes)<b style={{ color: 'red' }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Please Enter Before Shift After OT Hours"
                        value={allData.enableshitafterothoursvalue}
                        onChange={(e) => {
                          const enteredValue = e.target.value.replace(/\D/g, '').slice(0, 3);
                          if (enteredValue === '' || /^\d+$/.test(enteredValue)) {
                            setAllData({
                              ...allData,
                              enableshitafterothoursvalue: enteredValue,
                            });
                          }
                        }}
                      />
                    </FormControl>
                  </Grid>
                )}
                <Grid item md={12} xs={12} sm={12} sx={{ display: 'flex', gap: '16px' }}>
                  <Grid item md={2} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        <b>Allowed Late ClockIn Count (per month) </b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Please Enter Late ClockIn Count"
                        value={allData.lateclockincount}
                        onChange={(e) => {
                          const enteredValue = e.target.value.replace(/\D/g, '').slice(0, 3);
                          if (enteredValue === '' || /^\d+$/.test(enteredValue)) {
                            setAllData({
                              ...allData,
                              lateclockincount: enteredValue,
                            });
                          }
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={2} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        <b>Allowed Early ClockOut Count (per month) </b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Please Enter Early ClockOut Count"
                        value={allData.earlyclockoutcount}
                        onChange={(e) => {
                          const enteredValue = e.target.value.replace(/\D/g, '').slice(0, 3);
                          if (enteredValue === '' || /^\d+$/.test(enteredValue)) {
                            setAllData({
                              ...allData,
                              earlyclockoutcount: enteredValue,
                            });
                          }
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={2} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        <b>Allowed LongAbsent&Leave Count (per month) </b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Please Enter LongAbsent Count"
                        value={allData.longabsentcount}
                        onChange={(e) => {
                          const enteredValue = e.target.value.replace(/\D/g, '').slice(0, 3);
                          if (enteredValue === '' || /^\d+$/.test(enteredValue)) {
                            setAllData({
                              ...allData,
                              longabsentcount: enteredValue,
                            });
                          }
                        }}
                      />
                    </FormControl>
                  </Grid>
                  {/* <Grid item md={2} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        <b>Allowed LongLeave Count (per month) </b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Please Enter LongLeave Count"
                        value={allData.longleavecount}
                        onChange={(e) => {
                          const enteredValue = e.target.value.replace(/\D/g, '').slice(0, 3);
                          if (enteredValue === '' || /^\d+$/.test(enteredValue)) {
                            setAllData({
                              ...allData,
                              longleavecount: enteredValue,
                            });
                          }
                        }}
                      />
                    </FormControl>
                  </Grid> */}
                  <Grid item md={2} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        <b>Allowed AutoClockout Count (per month) </b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Please Enter AutoClockout Count"
                        value={allData.allowedautoclockoutcount}
                        onChange={(e) => {
                          const enteredValue = e.target.value.replace(/\D/g, '').slice(0, 3);
                          if (enteredValue === '' || /^\d+$/.test(enteredValue)) {
                            setAllData({
                              ...allData,
                              allowedautoclockoutcount: enteredValue,
                            });
                          }
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <Divider />
                <Grid item md={8} xs={12} sm={12}>
                  <Typography>
                    <b>Allowed Permission </b>
                  </Typography>
                </Grid>

                <Grid item md={8} xs={12} sm={12}>
                  <Grid container spacing={2}>
                    <Grid item md={3.5} xs={12} sm={12}>
                      <Typography>Per Day(HRS:MIN)</Typography>
                      <Grid container spacing={1}>
                        <Grid item md={6} xs={12} sm={6}>
                          <FormControl fullWidth size="small">
                            <Selects
                              maxMenuHeight={300}
                              options={hrsOption}
                              placeholder="Hrs"
                              value={{ label: hours, value: hours }}
                              onChange={(e) => {
                                setHours(e.value);
                                setAllData({
                                  ...allData,
                                  permissionperdayduration: `${e.value}:${minutes}`,
                                });
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={6} xs={12} sm={6}>
                          <FormControl fullWidth size="small">
                            <Selects
                              maxMenuHeight={300}
                              options={minsOption}
                              placeholder="Mins"
                              value={{ label: minutes, value: minutes }}
                              onChange={(e) => {
                                setMinutes(e.value);
                                setAllData({
                                  ...allData,
                                  permissionperdayduration: `${hours}:${e.value}`,
                                });
                              }}
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item md={2.5} xs={12} sm={12}>
                      <Typography>Per Month Count</Typography>
                      <Grid container spacing={1}>
                        <Grid item md={6} xs={12} sm={6}>
                          <FormControl fullWidth size="small">
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              placeholder="Please Enter Count"
                              value={allData.permissionpermonthduration}
                              onChange={(e) => {
                                const enteredValue = e.target.value.replace(/\D/g, '').slice(0, 2);
                                if (enteredValue === '' || /^\d+$/.test(enteredValue)) {
                                  setAllData({
                                    ...allData,
                                    permissionpermonthduration: enteredValue,
                                  });
                                }
                              }}
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={allData.enablepermcompensation}
                              onChange={(e) =>
                                setAllData({
                                  ...allData,
                                  enablepermcompensation: !allData.enablepermcompensation,
                                })
                              }
                            />
                          }
                          label="Enable Permission Compensation"
                        />
                      </FormGroup>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={allData.enablebranchlimit}
                              onChange={(e) =>
                                setAllData({
                                  ...allData,
                                  enablebranchlimit: !allData.enablebranchlimit,
                                })
                              }
                            />
                          }
                          label="Enable Branch Limit"
                        />
                      </FormGroup>
                    </Grid>
                  </Grid>
                </Grid>

                <Divider />
                <Grid item md={12} sm={12} xs={12}>
                  <Typography>
                    {' '}
                    <b>Permission Compensation</b>
                  </Typography>
                </Grid>
                <Grid item md={1.5} xs={12} sm={12}>
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
                      value={selectedOptionsCompanyPermCompensation}
                      onChange={(e) => {
                        handleCompanyChangePermCompensation(e);
                      }}
                      valueRenderer={customValueRendererCompanyPermCompensation}
                      labelledBy="Please Select Company"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={2} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      {' '}
                      Branch<b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={accessbranch
                        ?.filter((comp) => valueCompanyCatPermCompensation?.includes(comp.company))
                        ?.map((data) => ({
                          label: data.branch,
                          value: data.branch,
                        }))
                        .filter((item, index, self) => {
                          return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                        })}
                      value={selectedOptionsBranchPermCompensation}
                      onChange={(e) => {
                        handleBranchChangePermCompensation(e);
                      }}
                      valueRenderer={customValueRendererBranchPermCompensation}
                      labelledBy="Please Select Branch"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={2} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      {' '}
                      Unit <b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={accessbranch
                        ?.filter((comp) => valueCompanyCatPermCompensation?.includes(comp.company) && valueBranchCatPermCompensation?.includes(comp.branch))
                        ?.map((data) => ({
                          label: data.unit,
                          value: data.unit,
                        }))
                        .filter((item, index, self) => {
                          return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                        })}
                      value={selectedOptionsUnitPermCompensation}
                      onChange={(e) => {
                        handleUnitChangePermCompensation(e);
                      }}
                      valueRenderer={customValueRendererUnitPermCompensation}
                      labelledBy="Please Select Unit"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={2} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Team<b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={allTeam
                        ?.filter((u) => valueCompanyCatPermCompensation?.includes(u.company) && valueBranchCatPermCompensation?.includes(u.branch) && valueUnitCatPermCompensation?.includes(u.unit))
                        .map((u) => ({
                          ...u,
                          label: u.teamname,
                          value: u.teamname,
                        }))}
                      value={selectedOptionsTeamPermCompensation}
                      onChange={(e) => {
                        handleTeamChangePermCompensation(e);
                      }}
                      valueRenderer={customValueRendererTeamPermCompensation}
                      labelledBy="Please Select Team"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={2} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Employee<b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={allUsersData
                        ?.filter((u) => valueCompanyCatPermCompensation?.includes(u.company) && valueBranchCatPermCompensation?.includes(u.branch) && valueUnitCatPermCompensation?.includes(u.unit) && valueTeamCatPermCompensation?.includes(u.team))
                        .map((u) => ({
                          label: u.companyname,
                          value: u.companyname,
                          company: u.company,
                          branch: u.branch,
                          unit: u.unit,
                          team: u.team,
                          _id: u._id,
                          empcode: u.empcode,
                        }))}
                      value={selectedOptionsEmployeePermCompensation}
                      onChange={(e) => {
                        handleEmployeeChangePermCompensation(e);
                        const newTodos = e?.map((item) => ({
                          company: item.company,
                          branch: item.branch,
                          unit: item.unit,
                          team: item.team,
                          employeename: item.value,
                          employeedbid: item._id,
                          empcode: item.empcode,
                          _id: item._id,
                          enablepermcompensation: false,
                          permissionperdayduration: allData.permissionperdayduration,
                          permissionpermonthduration: allData.permissionpermonthduration,
                          enablebranchlimit: false,
                        }));

                        setEmployeePermCompensation(newTodos);

                        // Add new todos to the existing state
                      }}
                      valueRenderer={customValueRendererEmployeePermCompensation}
                      labelledBy="Please Select Employee"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={2} xs={12} sm={12}>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={singlePermCompensation.enablepermcompensation}
                          onChange={(e) =>
                            setSinglePermCompensation({
                              ...singlePermCompensation,
                              enablepermcompensation: !singlePermCompensation.enablepermcompensation,
                            })
                          }
                        />
                      }
                      label="Enable Permission Compensation"
                    />
                  </FormGroup>
                </Grid>

                <Grid item md={0.5} sm={6} xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{
                      height: '30px',
                      minWidth: '20px',
                      padding: '19px 13px',
                      marginTop: '25px',
                    }}
                    onClick={addTodoPermCompensation}
                  >
                    <FaPlus />
                  </Button>
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                  <PermCompensationTable taskcategorys={allTodoPermCompensation} setDeleteIndexPermCompensation={setDeleteIndexPermCompensation} handleClickOpenPermCompensation={handleClickOpenPermCompensation} />
                </Grid>
                <Divider />
                <Grid item md={12} sm={12} xs={12}>
                  <Typography>
                    {' '}
                    <b>Grace Time</b>
                  </Typography>
                </Grid>
                <Grid item md={1.5} xs={12} sm={12}>
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
                      value={selectedOptionsCompanyGracetime}
                      onChange={(e) => {
                        handleCompanyChangeGracetime(e);
                      }}
                      valueRenderer={customValueRendererCompanyGracetime}
                      labelledBy="Please Select Company"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={2} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      {' '}
                      Branch<b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={accessbranch
                        ?.filter((comp) => valueCompanyCatGracetime?.includes(comp.company))
                        ?.map((data) => ({
                          label: data.branch,
                          value: data.branch,
                        }))
                        .filter((item, index, self) => {
                          return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                        })}
                      value={selectedOptionsBranchGracetime}
                      onChange={(e) => {
                        handleBranchChangeGracetime(e);
                      }}
                      valueRenderer={customValueRendererBranchGracetime}
                      labelledBy="Please Select Branch"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={2} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      {' '}
                      Unit <b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={accessbranch
                        ?.filter((comp) => valueCompanyCatGracetime?.includes(comp.company) && valueBranchCatGracetime?.includes(comp.branch))
                        ?.map((data) => ({
                          label: data.unit,
                          value: data.unit,
                        }))
                        .filter((item, index, self) => {
                          return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                        })}
                      value={selectedOptionsUnitGracetime}
                      onChange={(e) => {
                        handleUnitChangeGracetime(e);
                      }}
                      valueRenderer={customValueRendererUnitGracetime}
                      labelledBy="Please Select Unit"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={2} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Team<b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={allTeam
                        ?.filter((u) => valueCompanyCatGracetime?.includes(u.company) && valueBranchCatGracetime?.includes(u.branch) && valueUnitCatGracetime?.includes(u.unit))
                        .map((u) => ({
                          ...u,
                          label: u.teamname,
                          value: u.teamname,
                        }))}
                      value={selectedOptionsTeamGracetime}
                      onChange={(e) => {
                        handleTeamChangeGracetime(e);
                      }}
                      valueRenderer={customValueRendererTeamGracetime}
                      labelledBy="Please Select Team"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={2} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Employee<b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={allUsersData
                        ?.filter((u) => valueCompanyCatGracetime?.includes(u.company) && valueBranchCatGracetime?.includes(u.branch) && valueUnitCatGracetime?.includes(u.unit) && valueTeamCatGracetime?.includes(u.team))
                        .map((u) => ({
                          label: u.companyname,
                          value: u.companyname,
                          company: u.company,
                          branch: u.branch,
                          unit: u.unit,
                          team: u.team,
                          _id: u._id,
                        }))}
                      value={selectedOptionsEmployeeGracetime}
                      onChange={(e) => {
                        handleEmployeeChangeGracetime(e);
                        const newTodos = e?.map((item) => ({
                          company: item.company,
                          branch: item.branch,
                          unit: item.unit,
                          team: item.team,
                          employeename: item.value,
                          employeedbid: item._id,
                          _id: item._id,
                          employeeleaverespecttoweekoff: false,
                          employeegracetime: '',
                        }));

                        setWeekOfEmployeeGracetime(newTodos);

                        // Add new todos to the existing state
                      }}
                      valueRenderer={customValueRendererEmployeeGracetime}
                      labelledBy="Please Select Employee"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={2} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Grace Time (minutes)<b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Grace Time in Minutes"
                      value={singleTodo.employeegracetime}
                      onChange={(e) => {
                        const enteredValue = e.target.value.replace(/\D/g, '').slice(0, 3);
                        if (enteredValue === '' || /^\d+$/.test(enteredValue)) {
                          setSingleTodo({
                            ...singleTodo,
                            employeegracetime: enteredValue,
                          });
                        }
                      }}
                    />
                  </FormControl>
                </Grid>

                <Grid item md={0.5} sm={6} xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{
                      height: '30px',
                      minWidth: '20px',
                      padding: '19px 13px',
                      marginTop: '25px',
                    }}
                    onClick={addTodo}
                  >
                    <FaPlus />
                  </Button>
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <GraceTimeTable taskcategorys={allTodo} setDeleteIndex={setDeleteIndex} handleClickOpen={handleClickOpen} />
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                  <Typography>
                    <b>Week Off/Holiday</b>
                  </Typography>
                </Grid>
                <Grid item md={1.5} xs={12} sm={6}>
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
                <Grid item md={2} xs={12} sm={6}>
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
                <Grid item md={2} xs={12} sm={6}>
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
                <Grid item md={2} xs={12} sm={6}>
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
                <Grid item md={2} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Employee<b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={allUsersData
                        ?.filter((u) => valueCompanyCat?.includes(u.company) && valueBranchCat?.includes(u.branch) && valueUnitCat?.includes(u.unit) && valueTeamCat?.includes(u.team))
                        .map((u) => ({
                          label: u.companyname,
                          value: u.companyname,
                          company: u.company,
                          branch: u.branch,
                          unit: u.unit,
                          team: u.team,
                          _id: u._id,
                        }))}
                      value={selectedOptionsEmployee}
                      onChange={(e) => {
                        handleEmployeeChange(e);
                        const newTodos = e?.map((item) => ({
                          company: item.company,
                          branch: item.branch,
                          unit: item.unit,
                          team: item.team,
                          employeename: item.value,
                          employeedbid: item._id,
                          _id: item._id,
                          employeeleaverespecttoweekoff: false,
                          employeegracetime: '',
                        }));

                        setWeekOfEmployee(newTodos);

                        // Add new todos to the existing state
                      }}
                      valueRenderer={customValueRendererEmployee}
                      labelledBy="Please Select Employee"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={1} xs={12} sm={6}>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={singleWeekOffTodo.enableweekoff}
                          onChange={(e) =>
                            setSingleWeekOffTodo({
                              ...singleWeekOffTodo,
                              enableweekoff: !singleWeekOffTodo.enableweekoff,
                            })
                          }
                        />
                      }
                      label="Enable Week Off"
                    />
                  </FormGroup>
                </Grid>
                <Grid item md={1} xs={12} sm={6}>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={singleWeekOffTodo.enableHoliday}
                          onChange={(e) =>
                            setSingleWeekOffTodo({
                              ...singleWeekOffTodo,
                              enableHoliday: !singleWeekOffTodo.enableHoliday,
                            })
                          }
                        />
                      }
                      label="Enable Holiday"
                    />
                  </FormGroup>
                </Grid>
                <Grid item md={0.5} sm={6} xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{
                      height: '30px',
                      minWidth: '20px',
                      padding: '19px 13px',
                      marginTop: '25px',
                    }}
                    onClick={addTodoWeekOff}
                  >
                    <FaPlus />
                  </Button>
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <WeekOffTable taskcategorys={allWeekOffTodo} setDeleteIndexWeekoff={setDeleteIndexWeekoff} handleClickOpenWeekOff={handleClickOpenWeekOff} />
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                  <Typography>
                    {' '}
                    <b>OT Hours</b>
                  </Typography>
                </Grid>
                <Grid item md={2.4} xs={12} sm={12}>
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
                      value={selectedOptionsCompanyOthours}
                      onChange={(e) => {
                        handleCompanyChangeOthours(e);
                      }}
                      valueRenderer={customValueRendererCompanyOthours}
                      labelledBy="Please Select Company"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={2.4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      {' '}
                      Branch<b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={accessbranch
                        ?.filter((comp) => valueCompanyCatOthours?.includes(comp.company))
                        ?.map((data) => ({
                          label: data.branch,
                          value: data.branch,
                        }))
                        .filter((item, index, self) => {
                          return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                        })}
                      value={selectedOptionsBranchOthours}
                      onChange={(e) => {
                        handleBranchChangeOthours(e);
                      }}
                      valueRenderer={customValueRendererBranchOthours}
                      labelledBy="Please Select Branch"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={2.4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      {' '}
                      Unit <b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={accessbranch
                        ?.filter((comp) => valueCompanyCatOthours?.includes(comp.company) && valueBranchCatOthours?.includes(comp.branch))
                        ?.map((data) => ({
                          label: data.unit,
                          value: data.unit,
                        }))
                        .filter((item, index, self) => {
                          return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                        })}
                      value={selectedOptionsUnitOthours}
                      onChange={(e) => {
                        handleUnitChangeOthours(e);
                      }}
                      valueRenderer={customValueRendererUnitOthours}
                      labelledBy="Please Select Unit"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={2.4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Team<b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={allTeam
                        ?.filter((u) => valueCompanyCatOthours?.includes(u.company) && valueBranchCatOthours?.includes(u.branch) && valueUnitCatOthours?.includes(u.unit))
                        .map((u) => ({
                          ...u,
                          label: u.teamname,
                          value: u.teamname,
                        }))}
                      value={selectedOptionsTeamOthours}
                      onChange={(e) => {
                        handleTeamChangeOthours(e);
                      }}
                      valueRenderer={customValueRendererTeamOthours}
                      labelledBy="Please Select Team"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={2.4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Employee<b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={allUsersData
                        ?.filter((u) => valueCompanyCatOthours?.includes(u.company) && valueBranchCatOthours?.includes(u.branch) && valueUnitCatOthours?.includes(u.unit) && valueTeamCatOthours?.includes(u.team))
                        .map((u) => ({
                          label: u.companyname,
                          value: u.companyname,
                          company: u.company,
                          branch: u.branch,
                          unit: u.unit,
                          team: u.team,
                          _id: u._id,
                        }))}
                      value={selectedOptionsEmployeeOthours}
                      onChange={(e) => {
                        handleEmployeeChangeOthours(e);
                        const newTodos = e?.map((item) => ({
                          company: item.company,
                          branch: item.branch,
                          unit: item.unit,
                          team: item.team,
                          employeename: item.value,
                          employeedbid: item._id,
                          _id: item._id,
                          employeeleaverespecttoweekoff: false,
                        }));

                        setWeekOfEmployeeOthours(newTodos);

                        // Add new todos to the existing state
                      }}
                      valueRenderer={customValueRendererEmployeeOthours}
                      labelledBy="Please Select Employee"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12} marginTop={3}>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={singleOthours.enableshiftbeforeothours}
                          onChange={(e) =>
                            setSingleOthours({
                              ...singleOthours,
                              enableshiftbeforeothours: !singleOthours.enableshiftbeforeothours,
                              enableshiftbeforeothoursvalue: '',
                            })
                          }
                        />
                      }
                      label="Enable Shift Before OT Hours"
                    />
                  </FormGroup>
                </Grid>
                {singleOthours.enableshiftbeforeothours && (
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Shift Before OT Hours(Minutes)<b style={{ color: 'red' }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Please Enter Shift Before OT Hours"
                        value={singleOthours.enableshiftbeforeothoursvalue}
                        onChange={(e) => {
                          const enteredValue = e.target.value.replace(/\D/g, '').slice(0, 3);
                          if (enteredValue === '' || /^\d+$/.test(enteredValue)) {
                            setSingleOthours({
                              ...singleOthours,
                              enableshiftbeforeothoursvalue: enteredValue,
                            });
                          }
                        }}
                      />
                    </FormControl>
                  </Grid>
                )}
                <Grid item md={3} xs={12} sm={12} marginTop={3}>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={singleOthours.enableshitafterothours}
                          onChange={(e) =>
                            setSingleOthours({
                              ...singleOthours,
                              enableshitafterothours: !singleOthours.enableshitafterothours,
                              enableshitafterothoursvalue: '',
                            })
                          }
                        />
                      }
                      label="Enable Shift After OT Hours"
                    />
                  </FormGroup>
                </Grid>
                {singleOthours.enableshitafterothours && (
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Shift After OT Hours(Minutes)<b style={{ color: 'red' }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Please Enter Before Shift After OT Hours"
                        value={singleOthours.enableshitafterothoursvalue}
                        onChange={(e) => {
                          const enteredValue = e.target.value.replace(/\D/g, '').slice(0, 3);
                          if (enteredValue === '' || /^\d+$/.test(enteredValue)) {
                            setSingleOthours({
                              ...singleOthours,
                              enableshitafterothoursvalue: enteredValue,
                            });
                          }
                        }}
                      />
                    </FormControl>
                  </Grid>
                )}

                <Grid item md={0.5} sm={6} xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{
                      height: '30px',
                      minWidth: '20px',
                      padding: '19px 13px',
                      marginTop: '25px',
                    }}
                    onClick={addTodoOthours}
                  >
                    <FaPlus />
                  </Button>
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <OthoursTable taskcategorys={allTodoOthours} setDeleteIndexWeekoff={setDeleteIndexOThours} handleClickOpenWeekOff={handleClickOpenOthours} />
                </Grid>
              </Grid>

              <Divider />
              <Grid container spacing={2}>
                <Grid item md={12} xs={12} sm={12}>
                  <Typography>
                    <b>Reliveing Days</b>
                  </Typography>
                </Grid>
                <Grid item md={0.8} xs={12} sm={6}>
                  <Checkbox
                    sx={{ '& .MuiSvgIcon-root': { fontSize: 40 } }}
                    checked={allData.sunday}
                    value={allData.sunday}
                    onChange={(e) => {
                      setAllData({ ...allData, sunday: !allData.sunday });
                    }}
                  />
                </Grid>
                <Grid item md={0.8} xs={12} sm={12} marginTop={2}>
                  Sunday
                </Grid>
                <Grid item md={0.8} xs={12} sm={6}>
                  <Checkbox
                    sx={{ '& .MuiSvgIcon-root': { fontSize: 40 } }}
                    checked={allData.monday}
                    value={allData.monday}
                    onChange={(e) => {
                      setAllData({ ...allData, monday: !allData.monday });
                    }}
                  />
                </Grid>
                <Grid item md={0.8} xs={12} sm={12} marginTop={2}>
                  Monday
                </Grid>
                <Grid item md={0.8} xs={12} sm={6}>
                  <Checkbox
                    sx={{ '& .MuiSvgIcon-root': { fontSize: 40 } }}
                    checked={allData.tuesday}
                    value={allData.tuesday}
                    onChange={(e) => {
                      setAllData({ ...allData, tuesday: !allData.tuesday });
                    }}
                  />
                </Grid>
                <Grid item md={0.8} xs={12} sm={12} marginTop={2}>
                  Tuesday
                </Grid>
                <Grid item md={0.8} xs={12} sm={6}>
                  <Checkbox
                    sx={{ '& .MuiSvgIcon-root': { fontSize: 40 } }}
                    checked={allData.wednesday}
                    value={allData.wednesday}
                    onChange={(e) => {
                      setAllData({ ...allData, wednesday: !allData.wednesday });
                    }}
                  />
                </Grid>
                <Grid item md={0.8} xs={12} sm={12} marginTop={2}>
                  Wednesday
                </Grid>
                <Grid item md={0.8} xs={12} sm={6}>
                  <Checkbox
                    sx={{ '& .MuiSvgIcon-root': { fontSize: 40 } }}
                    checked={allData.thursday}
                    value={allData.thursday}
                    onChange={(e) => {
                      setAllData({ ...allData, thursday: !allData.thursday });
                    }}
                  />
                </Grid>
                <Grid item md={0.8} xs={12} sm={12} marginTop={2}>
                  Thursday
                </Grid>
                <Grid item md={0.8} xs={12} sm={6}>
                  <Checkbox
                    sx={{ '& .MuiSvgIcon-root': { fontSize: 40 } }}
                    checked={allData.friday}
                    value={allData.friday}
                    onChange={(e) => {
                      setAllData({ ...allData, friday: !allData.friday });
                    }}
                  />
                </Grid>
                <Grid item md={0.8} xs={12} sm={12} marginTop={2}>
                  Friday
                </Grid>
                <Grid item md={0.8} xs={12} sm={6}>
                  <Checkbox
                    sx={{ '& .MuiSvgIcon-root': { fontSize: 40 } }}
                    checked={allData.saturday}
                    value={allData.saturday}
                    onChange={(e) => {
                      setAllData({ ...allData, saturday: !allData.saturday });
                    }}
                  />
                </Grid>
                <Grid item md={0.8} xs={12} sm={12} marginTop={2}>
                  Saturday
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item md={12} xs={12} sm={12}>
                  <Typography>
                    <b>Reliveing Should In Every Month </b>
                  </Typography>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <Grid container spacing={2}>
                    <Grid item md={6} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>From Date</Typography>
                        <Selects
                          maxMenuHeight={300}
                          options={dateTYpeOption}
                          placeholder="00"
                          value={{ label: allData.relievingfromdate, value: allData.relievingfromdate }}
                          onChange={(e) => {
                            setAllData({ ...allData, relievingfromdate: e.value });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>To Date</Typography>
                        <Selects
                          maxMenuHeight={300}
                          options={dateTYpeOption}
                          placeholder="00"
                          value={{ label: allData.relievingtodate, value: allData.relievingtodate }}
                          onChange={(e) => {
                            setAllData({ ...allData, relievingtodate: e.value });
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item md={12} sm={12} xs={12}>
                  <Typography>
                    {' '}
                    <b>Production Day Calculation</b>
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item md={2.4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          ShiftType<b style={{ color: 'red' }}>*</b>
                        </Typography>
                        <OutlinedInput
                          readOnly
                          value={shifType.startShiftDay}
                          onChange={(e) => {
                            setShifType({ ...shifType, startShiftDay: e.target.value });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={2.4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Shift Time<b style={{ color: 'red' }}>*</b>
                        </Typography>
                        <OutlinedInput
                          readOnly
                          value={shifType.startTimeDay}
                          onChange={(e) => {
                            setShifType({ ...shifType, startTimeDay: e.target.value });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <Grid container spacing={1}>
                        <Grid item md={6} xs={12} sm={6}>
                          <Typography>Hours</Typography>
                          <FormControl fullWidth size="small">
                            <Selects
                              maxMenuHeight={300}
                              options={hrsOption}
                              placeholder="Hrs"
                              value={{ label: shifType.startHourDay, value: shifType.startHourDay }}
                              onChange={(e) => {
                                setShifType({ ...shifType, startHourDay: e.value });
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={6} xs={12} sm={6}>
                          <Typography>Mintues</Typography>
                          <FormControl fullWidth size="small">
                            <Selects
                              maxMenuHeight={300}
                              options={minsOption}
                              placeholder="Mins"
                              value={{ label: shifType.startMinDay, value: shifType.startMinDay }}
                              onChange={(e) => {
                                setShifType({ ...shifType, startMinDay: e.value });
                              }}
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item md={2} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Activate Status<b style={{ color: 'red' }}>*</b>
                        </Typography>
                        <Selects
                          options={[
                            { label: 'Active', value: 'Active' },
                            { label: 'In-Active', value: 'In-Active' },
                          ]}
                          value={{ label: shifType.dayactive, value: shifType.dayactive }}
                          onChange={(e) => {
                            setShifType({ ...shifType, dayactive: e.value });
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                  <br />
                  <Grid container spacing={2}>
                    <Grid item md={2.4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          ShiftType<b style={{ color: 'red' }}>*</b>
                        </Typography>
                        <OutlinedInput
                          readOnly
                          value={shifType.startShiftNight}
                          onChange={(e) => {
                            setShifType({ ...shifType, startShiftNight: e.target.value });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={2.4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Shift Time<b style={{ color: 'red' }}>*</b>
                        </Typography>
                        <OutlinedInput
                          readOnly
                          value={shifType.startTimeNight}
                          onChange={(e) => {
                            setShifType({ ...shifType, startTimeNight: e.target.value });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <Grid container spacing={1}>
                        <Grid item md={6} xs={12} sm={6}>
                          <Typography>Hours</Typography>
                          <FormControl fullWidth size="small">
                            <Selects
                              maxMenuHeight={300}
                              options={hrsOption}
                              placeholder="Hrs"
                              value={{ label: shifType.startHourNight, value: shifType.startHourNight }}
                              onChange={(e) => {
                                setShifType({ ...shifType, startHourNight: e.value });
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={6} xs={12} sm={6}>
                          <Typography>Mintues</Typography>
                          <FormControl fullWidth size="small">
                            <Selects
                              maxMenuHeight={300}
                              options={minsOption}
                              placeholder="Mins"
                              value={{ label: shifType.startMinNight, value: shifType.startMinNight }}
                              onChange={(e) => {
                                setShifType({ ...shifType, startMinNight: e.value });
                              }}
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item md={2} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Activate Status<b style={{ color: 'red' }}>*</b>
                        </Typography>
                        <Selects
                          options={[
                            { label: 'Active', value: 'Active' },
                            { label: 'In-Active', value: 'In-Active' },
                          ]}
                          value={{ label: shifType.nightactive, value: shifType.nightactive }}
                          onChange={(e) => {
                            setShifType({ ...shifType, nightactive: e.value });
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item md={12} sm={12} xs={12}>
                  <Typography>
                    {' '}
                    <b>Production Manual Entry</b>
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item md={6} xs={12} sm={12}>
                      <Typography>
                        <strong>Entry status</strong>
                      </Typography>
                      <Grid container spacing={1}>
                        <Grid item md={3} xs={12} sm={6}>
                          <Typography>Days</Typography>
                          <FormControl fullWidth size="small">
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              placeholder="Please Enter Days"
                              value={shifType.entrystatusDays}
                              onChange={(e) => {
                                const enteredValue = e.target.value.replace(/\D/g, '').slice(0, 2);
                                if (enteredValue === '' || /^\d+$/.test(enteredValue)) {
                                  setShifType({
                                    ...shifType,
                                    entrystatusDays: enteredValue,
                                  });
                                }
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={6}>
                          <Typography>Hours</Typography>
                          <FormControl fullWidth size="small">
                            <Selects
                              maxMenuHeight={300}
                              options={hrsOption}
                              placeholder="Hrs"
                              value={{ label: shifType.entrystatusHour, value: shifType.entrystatusHour }}
                              onChange={(e) => {
                                setShifType({ ...shifType, entrystatusHour: e.value });
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={6}>
                          <Typography>Mintues</Typography>
                          <FormControl fullWidth size="small">
                            <Selects
                              maxMenuHeight={300}
                              options={minsOption}
                              placeholder="Mins"
                              value={{ label: shifType.entrystatusMin, value: shifType.entrystatusMin }}
                              onChange={(e) => {
                                setShifType({ ...shifType, entrystatusMin: e.value });
                              }}
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item md={6} xs={12} sm={12}>
                      <Typography>
                        <strong>Approval status</strong>
                      </Typography>
                      <Grid container spacing={1}>
                        <Grid item md={3} xs={12} sm={6}>
                          <Typography>Days</Typography>
                          <FormControl fullWidth size="small">
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              placeholder="Please Enter Days"
                              value={shifType.approvalstatusDays}
                              onChange={(e) => {
                                const enteredValue = e.target.value.replace(/\D/g, '').slice(0, 2);
                                if (enteredValue === '' || /^\d+$/.test(enteredValue)) {
                                  setShifType({
                                    ...shifType,
                                    approvalstatusDays: enteredValue,
                                  });
                                }
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={6}>
                          <Typography>Hours</Typography>
                          <FormControl fullWidth size="small">
                            <Selects
                              maxMenuHeight={300}
                              options={hrsOption}
                              placeholder="Hrs"
                              value={{ label: shifType.approvalstatusHour, value: shifType.approvalstatusHour }}
                              onChange={(e) => {
                                setShifType({ ...shifType, approvalstatusHour: e.value });
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={6}>
                          <Typography>Mintues</Typography>
                          <FormControl fullWidth size="small">
                            <Selects
                              maxMenuHeight={300}
                              options={minsOption}
                              placeholder="Mins"
                              value={{ label: shifType.approvalstatusMin, value: shifType.approvalstatusMin }}
                              onChange={(e) => {
                                setShifType({ ...shifType, approvalstatusMin: e.value });
                              }}
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item md={12} sm={12} xs={12}>
                  <Typography>
                    {' '}
                    <b>Payroll Exemption Amount</b>
                  </Typography>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  {/* <Typography>Days</Typography> */}
                  <FormControl fullWidth size="small">
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Amount"
                      value={shifType.payrollamount}
                      onChange={(e) => {
                        const enteredValue = e.target.value.replace(/\D/g, '');
                        if (enteredValue === '' || /^\d+$/.test(enteredValue)) {
                          setShifType({
                            ...shifType,
                            payrollamount: enteredValue,
                          });
                        }
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item md={12} sm={12} xs={12}>
                  <Typography>
                    {' '}
                    <b>Task Clockout Limit</b>
                  </Typography>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <Typography>Task Clockout Limit Count</Typography>
                  <FormControl fullWidth size="small">
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Task Clockout Limit Count"
                      value={allData.tasklimitcount}
                      onChange={(e) => {
                        const enteredValue = e.target.value.replace(/\D/g, '').slice(0, 3);
                        if (enteredValue === '' || /^\d+$/.test(enteredValue)) {
                          setAllData({
                            ...allData,
                            tasklimitcount: enteredValue,
                          });
                        }
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <Typography>Task Clockout Limit Days</Typography>
                  <FormControl fullWidth size="small">
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Task Clockout Limit Days"
                      value={allData.tasklimitcountinday}
                      onChange={(e) => {
                        const enteredValue = e.target.value.replace(/\D/g, '').slice(0, 2);
                        if (enteredValue === '' || /^\d+$/.test(enteredValue)) {
                          setAllData({
                            ...allData,
                            tasklimitcountinday: enteredValue,
                          });
                        }
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <br />
              <br />
              <Grid container sx={{ justifyContent: 'center', display: 'flex' }} spacing={2}>
                <Grid item>
                  <Button sx={buttonStyles.buttonsubmit} type="submit">
                    Update
                  </Button>
                </Grid>
                <Grid item>
                  <Link to="/dashboard" style={{ textDecoration: 'none', color: 'white' }}>
                    {' '}
                    <Button sx={buttonStyles.btncancel}> Cancel </Button>{' '}
                  </Link>
                </Grid>
              </Grid>
            </form>
          )}
        </Box>
      )}

      <Dialog open={isDeleteOpen} onClose={handleCloseMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: '3.5rem', color: 'teal' }} />
          <Typography variant="h5" sx={{ textAlign: 'center' }}>
            Are you sure? Do You Want to remove <span style={{ color: 'red' }}>{allTodo[deleteIndex]?.employeename}</span> ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMod} sx={buttonStyles.btncancel}>
            No
          </Button>
          <Button autoFocus sx={buttonStyles.buttonsubmit} onClick={(e) => deleteTodo(deleteIndex)}>
            {' '}
            Yes{' '}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isDeleteOpenWeekOff} onClose={handleCloseModWeekOff} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: '3.5rem', color: 'teal' }} />
          <Typography variant="h5" sx={{ textAlign: 'center' }}>
            Are you sure? Do You Want to remove <span style={{ color: 'red' }}>{allWeekOffTodo[deleteIndexweekoff]?.employeename}</span> ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModWeekOff} sx={buttonStyles.btncancel}>
            No
          </Button>
          <Button autoFocus sx={buttonStyles.buttonsubmit} onClick={(e) => deleteWeekOffTodo(deleteIndexweekoff)}>
            {' '}
            Yes{' '}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isDeleteOpenOthours} onClose={handleCloseModOthours} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: '3.5rem', color: 'teal' }} />
          <Typography variant="h5" sx={{ textAlign: 'center' }}>
            Are you sure? Do You Want to remove <span style={{ color: 'red' }}>{allTodoOthours[deleteIndexOthours]?.employeename}</span> ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModOthours} sx={buttonStyles.btncancel}>
            No
          </Button>
          <Button autoFocus sx={buttonStyles.buttonsubmit} onClick={(e) => deleteTodoOthours(deleteIndexOthours)}>
            {' '}
            Yes{' '}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isDeleteOpenPermCompensation} onClose={handleCloseModPermCompensation} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: '3.5rem', color: 'teal' }} />
          <Typography variant="h5" sx={{ textAlign: 'center' }}>
            Are you sure? Do You Want to remove <span style={{ color: 'red' }}>{allTodoPermCompensation[deleteIndexPermCompensation]?.employeename}</span> ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModPermCompensation} sx={buttonStyles.btncancel}>
            No
          </Button>
          <Button autoFocus sx={buttonStyles.buttonsubmit} onClick={(e) => deleteTodoPermCompensation(deleteIndexPermCompensation)}>
            {' '}
            Yes{' '}
          </Button>
        </DialogActions>
      </Dialog>

      {/* view model */}
      <Dialog open={openview} onClose={handleCloseview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" minWidth="sm" fullWidth={true}>
        <Box sx={{ padding: '20px 50px' }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {' '}
              <strong>Update Attendance Control Criteria Changes</strong>
            </Typography>
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Name</Typography>
                  {/* <Typography>{interactorTypeEdit.name}</Typography> */}
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Button sx={buttonStyles.btncancel} onClick={handleCloseview}>
                Back
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>

      <MessageAlert openPopup={openPopupMalert} handleClosePopup={handleClosePopupMalert} popupContent={popupContentMalert} popupSeverity={popupSeverityMalert} />
      {/* SUCCESS */}
      <AlertDialog openPopup={openPopup} handleClosePopup={handleClosePopup} popupContent={popupContent} popupSeverity={popupSeverity} />
      <ToastContainer transition={Bounce} />
    </Box>
  );
}
export default AttendanceControlCriteria;
