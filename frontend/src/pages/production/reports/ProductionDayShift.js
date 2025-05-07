import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import ImageIcon from '@mui/icons-material/Image';
import { Box, Button, Dialog, DialogActions, DialogContent, FormControl, Grid, IconButton, List, ListItem, ListItemText, MenuItem, OutlinedInput, Popover, Select, TextField, Typography } from '@mui/material';
import Switch from '@mui/material/Switch';
import axios from 'axios';
import * as FileSaver from 'file-saver';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from 'react-icons/fa';
import { ThreeDots } from 'react-loader-spinner';
import { MultiSelect } from 'react-multi-select-component';
import { useReactToPrint } from 'react-to-print';
import * as XLSX from 'xlsx';
import AggregatedSearchBar from '../../../components/AggregatedSearchBar';
import AggridTable from '../../../components/AggridTable';
import AlertDialog from '../../../components/Alert.js';
import { handleApiError } from '../../../components/Errorhandling';
import ExportData from '../../../components/ExportData.js';
import Headtitle from '../../../components/Headtitle';
import MessageAlert from '../../../components/MessageAlert.js';
import PageHeading from '../../../components/PageHeading';
import { AuthContext, UserRoleAccessContext } from '../../../context/Appcontext';
import { colourStyles, userStyle } from '../../../pageStyle';
import { SERVICE } from '../../../services/Baseservice';
import moment from 'moment-timezone';
import domtoimage from 'dom-to-image';

function ProductionDayShift() {

  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);

  const [loading, setLoading] = useState(false);
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + '-' + mm + '-' + dd;

  // get current year
  const currentYear = new Date().getFullYear();

  // get current month in string name
  const monthstring = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const currentMonthIndex = new Date().getMonth();
  const currentMonthObject = { label: monthstring[currentMonthIndex], value: currentMonthIndex + 1 };
  const currentYearObject = { label: currentYear, value: currentYear };
  const years = Array.from(new Array(10), (val, index) => currentYear - index);
  const getyear = years.map((year) => {
    return { value: year, label: year };
  });

  const gridRef = useRef(null);
  const { isUserRoleCompare, isUserRoleAccess, isAssignBranch, allTeam, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);
  const accessbranch = isUserRoleAccess?.role?.includes('Manager')
    ? isAssignBranch?.map((data) => ({
      branch: data.branch,
      company: data.company,
      unit: data.unit,
    }))
    : isAssignBranch
      ?.filter((data) => {
        let fetfinalurl = [];

        if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.mainpagenameurl?.length !== 0 && data?.subpagenameurl?.length !== 0 && data?.subsubpagenameurl?.length !== 0) {
          fetfinalurl = data.subsubpagenameurl;
        } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.mainpagenameurl?.length !== 0 && data?.subpagenameurl?.length !== 0) {
          fetfinalurl = data.subpagenameurl;
        } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.mainpagenameurl?.length !== 0) {
          fetfinalurl = data.mainpagenameurl;
        } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0) {
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
  const [companies, setCompanies] = useState([]);
  const [branches, setBranches] = useState([]);
  const [units, setUnits] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [userShifts, setUserShifts] = useState([]);
  const [items, setItems] = useState([]);
  const [attStatus, setAttStatus] = useState([]);
  const [attModearr, setAttModearr] = useState([]);
  const [showAlert, setShowAlert] = useState();
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const [searchedString, setSearchedString] = useState('');
  const gridRefTable = useRef(null);
  const [isHandleChange, setIsHandleChange] = useState(false);

  const [filterUser, setFilterUser] = useState({
    fromdate: today,
    todate: today,
  });

  const [selectedCompanyFrom, setSelectedCompanyFrom] = useState([]);
  const [selectedBranchFrom, setSelectedBranchFrom] = useState([]);
  const [selectedUnitFrom, setSelectedUnitFrom] = useState([]);
  const [selectedTeamFrom, setSelectedTeamFrom] = useState([]);
  const [selectedEmployeeFrom, setSelectedEmployeeFrom] = useState([]);

  //Company multiselect dropdown changes
  const handleCompanyChangeFrom = (options) => {
    setSelectedCompanyFrom(options);
    setSelectedBranchFrom([]);
    setSelectedUnitFrom([]);
    setSelectedTeamFrom([]);
    setSelectedEmployeeFrom([]);
  };
  const customValueRendererCompanyFrom = (valueCate, _employeename) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(', ') : 'Please select Company';
  };

  //branch multiselect dropdown changes
  const handleBranchChangeFrom = (options) => {
    setSelectedBranchFrom(options);
    setSelectedUnitFrom([]);
    setSelectedTeamFrom([]);
    setSelectedEmployeeFrom([]);
  };
  const customValueRendererBranchFrom = (valueCate, _employeename) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(', ') : 'Please select Branch';
  };

  //unit multiselect dropdown changes
  const handleUnitChangeFrom = (options) => {
    setSelectedUnitFrom(options);
    setSelectedTeamFrom([]);
    setSelectedEmployeeFrom([]);
  };
  const customValueRendererUnitFrom = (valueCate, _employeename) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(', ') : 'Please select Unit';
  };

  //Team multiselect dropdown changes
  const handleTeamChangeFrom = (options) => {
    setSelectedTeamFrom(options);
    setSelectedEmployeeFrom([]);
  };
  const customValueRendererTeamFrom = (valueCate, _employeename) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(', ') : 'Please select Team';
  };

  //employee multiselect dropdown changes
  const handleEmployeeChangeFrom = (options) => {
    setSelectedEmployeeFrom(options);
  };
  const customValueRendererEmployeeFrom = (valueCate, _employeename) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(', ') : 'Please select Employee';
  };

  const [isMonthyear, setIsMonthYear] = useState({ ismonth: currentMonthObject, isyear: currentYearObject });

  //get all months
  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  // Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedData, setCopiedData] = useState('');

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
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

  // page refersh reload
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
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQueryManage, setSearchQueryManage] = useState('');
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
    checkbox: true,
    serialNumber: true,
    empcode: true,
    prodshift: true,
    prodstartdate: true,
    prodstarttime: true,
    prodenddate: true,
    prodendtime: true,
    nextshift: true,
    username: true,
    company: true,
    branch: true,
    unit: true,
    team: true,
    department: true,
    date: true,
    shiftmode: true,
    shift: true,
    clockin: true,
    clockout: true,
    clockinstatus: true,
    clockoutstatus: true,
    attendanceauto: true,
    daystatus: true,
    appliedthrough: true,
    lopcalculation: true,
    modetarget: true,
    paidpresent: true,
    lopday: true,
    paidpresentday: true,
    actions: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

  const [allEmp, setAllEmp] = useState([]);
  const fetchAllEmployee = async () => {
    setPageName(!pageName);
    try {
      let res_vendor = await axios.get(SERVICE.GET_ALL_USER_EMPLOYEE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAllEmp(res_vendor?.data?.users);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String('Production Day Shift'),
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

  useEffect(() => {
    getapi();
    fetchAllEmployee();
  }, []);

  const fetchCompany = async () => {
    setPageName(!pageName);
    try {
      let res_category = await axios.get(SERVICE.COMPANY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      // Remove duplicates from companies
      let uniqueCompanies = Array.from(new Set(res_category?.data?.companies.map((t) => t.name)));
      setCompanies(
        uniqueCompanies.map((t) => ({
          label: t,
          value: t,
        }))
      );
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //get all Attendance Status name.
  const fetchAttMode = async () => {
    setPageName(!pageName);
    try {
      let res_freq = await axios.get(SERVICE.ATTENDANCE_MODE_STATUS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAttModearr(res_freq?.data?.allattmodestatus);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    fetchCompany();
    fetchAttedanceStatus();
    fetchAttMode();
  }, []);

  function getWeekNumberInMonth(date) {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const dayOfWeek = firstDayOfMonth.getDay(); // 0 (Sunday) to 6 (Saturday)

    const adjustment = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    const dayOfMonthAdjusted = date.getDate() + adjustment;

    const weekNumber = Math.ceil(dayOfMonthAdjusted / 7);

    return weekNumber;
  }

  function convertTo12HourFormat(time24) {
    let [hours, minutes, seconds] = time24.split(':');
    let period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert "0" or "12+" hours to 12-hour format
    return `${String(hours).padStart(2, '0')}:${minutes}:${seconds} ${period}`;
  }

  const fetchFilteredUsersStatus = async () => {
    let startMonthDateMinus = new Date(filterUser.fromdate);
    let startdate = startMonthDateMinus.setDate(startMonthDateMinus.getDate() - 1);
    let startMonthDate = new Date(startdate);

    const currentDate = new Date(filterUser.todate);
    const nextDay = new Date(currentDate);
    nextDay.setDate(currentDate.getDate() + 2);
    let endMonthDate = new Date(nextDay);

    const daysArray = [];
    while (startMonthDate <= endMonthDate) {
      const formattedDate = `${String(startMonthDate.getDate()).padStart(2, '0')}/${String(startMonthDate.getMonth() + 1).padStart(2, '0')}/${startMonthDate.getFullYear()}`;
      const dayName = startMonthDate.toLocaleDateString('en-US', { weekday: 'long' });
      const dayCount = startMonthDate.getDate();
      const shiftMode = 'Main Shift';
      const weekNumberInMonth =
        getWeekNumberInMonth(startMonthDate) === 1
          ? `${getWeekNumberInMonth(startMonthDate)}st Week`
          : getWeekNumberInMonth(startMonthDate) === 2
            ? `${getWeekNumberInMonth(startMonthDate)}nd Week`
            : getWeekNumberInMonth(startMonthDate) === 3
              ? `${getWeekNumberInMonth(startMonthDate)}rd Week`
              : getWeekNumberInMonth(startMonthDate) > 3
                ? `${getWeekNumberInMonth(startMonthDate)}th Week`
                : '';

      daysArray.push({ formattedDate, dayName, dayCount, shiftMode, weekNumberInMonth });

      // Move to the next day
      startMonthDate.setDate(startMonthDate.getDate() + 1);
    }

    setPageName(!pageName);
    try {
      setLoading(true);

      let res = await axios.post(SERVICE.USER_PRODUCTION_DAY_SHIFT_FILTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: selectedCompanyFrom.map((d) => d.value),
        branch: selectedBranchFrom.map((d) => d.value),
        unit: selectedUnitFrom.map((d) => d.value),
        team: selectedTeamFrom.map((d) => d.value),
        empname: selectedEmployeeFrom.map((d) => d.value),
        userDates: daysArray,

        fromdate: filterUser.fromdate,
        todate: filterUser.todate,
        assignbranch: accessbranch,
      });

      const currentDate = new Date(filterUser.todate);
      const currdate = new Date(currentDate);
      currdate.setDate(currdate.getDate() + 1);

      const newDay = String(currdate.getDate()).padStart(2, '0');
      const newMonth = String(currdate.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
      const newYear = currdate.getFullYear();

      const nextDateFormatted = `${newDay}/${newMonth}/${newYear}`;

      const currentDateMinus = new Date(filterUser.fromdate);
      const currdateMinus = new Date(currentDateMinus);
      currdateMinus.setDate(currdateMinus.getDate() - 1);

      const newDayMinus = String(currdateMinus.getDate()).padStart(2, '0');
      const newMonthMinus = String(currdateMinus.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
      const newYearMinus = currdateMinus.getFullYear();

      const nextDateFormattedMinus = `${newDayMinus}/${newMonthMinus}/${newYearMinus}`;

      let dateoneaftertwoplus = new Date(filterUser.todate);
      dateoneaftertwoplus.setDate(dateoneaftertwoplus.getDate() + 2);
      let newDateTwoPlus = dateoneaftertwoplus?.toISOString().split('T')[0];

      let dateSelectedFormatTwoPlus = moment(newDateTwoPlus).format('DD/MM/YYYY');

      const allFinalData = res?.data?.finaluser;

      let filtereds = res?.data?.finaluser.filter((d) => d.rowformattedDate != nextDateFormatted && d.rowformattedDate != nextDateFormattedMinus && d.rowformattedDate != dateSelectedFormatTwoPlus && d.shiftMode === 'Main Shift');
      let res_vendor = await axios.get(SERVICE.GET_ATTENDANCE_CONTROL_CRITERIA_LAST_INDEX, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let attendenceControlCriteria = res_vendor?.data?.attendancecontrolcriteria;

      let dayShiftBeforeHrs = attendenceControlCriteria && attendenceControlCriteria.dayactive && attendenceControlCriteria.dayactive == true ? Number(attendenceControlCriteria.calcshifthourday) : 4;
      let dayShiftBeforeMin = attendenceControlCriteria && attendenceControlCriteria.dayactive && attendenceControlCriteria.dayactive == true ? Number(attendenceControlCriteria.calcshiftminday) : 0;
      let nightShiftBeforeHrs = attendenceControlCriteria && attendenceControlCriteria.nightactive && attendenceControlCriteria.nightactive == true ? Number(attendenceControlCriteria.calcshifthournight) : 4;
      let nightShiftBeforeMin = attendenceControlCriteria && attendenceControlCriteria.nightactive && attendenceControlCriteria.nightactive == true ? Number(attendenceControlCriteria.calcshiftminnight) : 0;

      const itemsWithSerialNumber = filtereds?.flatMap((item, index) => {
        const [day, month, year] = item.rowformattedDate.split('/');
        let finalDate = new Date(`${year}-${month}-${day}`);
        let finalDateOnly = `${year}-${month}-${day}`;
        let dateoneafter = new Date(finalDate);
        dateoneafter.setDate(dateoneafter.getDate() + 1);
        let newDateOnePlus = dateoneafter?.toISOString().split('T')[0];

        let datebefore = new Date(finalDate);
        datebefore.setDate(datebefore.getDate() - 1);
        let newDateOneMinus = datebefore?.toISOString().split('T')[0];

        let dateoneafterone = new Date(finalDate);
        dateoneafterone.setDate(dateoneafterone.getDate() + 2);
        let newDateTwoPlus = dateoneafterone?.toISOString().split('T')[0];

        let dateSelectedFormat = item.rowformattedDate;
        let dateSelectedFormatOnePlus = moment(newDateOnePlus).format('DD/MM/YYYY');
        let dateSelectedFormatOneMinus = moment(newDateOneMinus).format('DD/MM/YYYY');

        // console.log([item.rowformattedDate, moment(newDateOnePlus).format("DD/MM/YYYY"), moment(newDateOneMinus).format("DD/MM/YYYY")], "currentdates")
        let filtered = allFinalData.filter((d) => d.username === item.username && [item.rowformattedDate, moment(newDateOnePlus).format('DD/MM/YYYY'), moment(newDateOneMinus).format('DD/MM/YYYY')].includes(item.rowformattedDate));

        const previousEntry = filtered.find((d) => d.rowformattedDate === dateSelectedFormatOneMinus);
        const firstEntry = filtered.find((d) => d.rowformattedDate === dateSelectedFormat);
        const secondEntry = filtered.find((d) => d.rowformattedDate === dateSelectedFormatOnePlus);

        const firstEntryDoubleShiftPM = filtered.find((d) => d.rowformattedDate === dateSelectedFormat && d.shiftMode === 'Second Shift' && d.shifttiming != undefined && d.shifttiming.split('to')[0].includes('PM'));

        // console.log(firstEntry, firstEntryDoubleShift, 'firstEntryDoubleShift');
        const isBeforeDayDoubleShift = filtered.find((d) => d.rowformattedDate === dateSelectedFormatOneMinus && d.shiftMode === 'Second Shift' && d.shifttiming != undefined);
        const isBeforeDayDoubleShiftPM = isBeforeDayDoubleShift && isBeforeDayDoubleShift.shifttiming.split('to')[0].includes('PM');

        const firstEntryDoubleShift = filtered.find((d) => d.rowformattedDate === dateSelectedFormat && d.shiftMode === 'Second Shift' && d.shift != undefined);
        const thirdEntry = filtered.find((d) => d.rowformattedDate === dateSelectedFormatTwoPlus);
        let data = {};

        // console.log(thirdEntry, 'thirdEntry', data);
        // if (!firstEntry) return [];
        if (filtered.length >= 3) {
          const ispreviousShiftWeekoff = previousEntry && previousEntry.shift !== '' && previousEntry.shift == 'Week Off';
          const isFirstShiftWeekoff = firstEntry && firstEntry.shift !== '' && firstEntry.shift == 'Week Off';
          const isSecondShiftWeekoff = secondEntry && secondEntry.shift !== '' && secondEntry.shift == 'Week Off';

          const isFirstShiftPM = firstEntry && firstEntry.shift !== '' && firstEntry.shift != 'Week Off' ? firstEntry.shift.split('to')[0].includes('PM') : '';
          const isPreviousShiftPM = previousEntry && previousEntry.shift !== '' && previousEntry.shift != 'Week Off' ? previousEntry.shift.split('to')[0].includes('PM') : '';
          const issecondShiftPM = secondEntry && secondEntry.shift !== '' && secondEntry.shift != 'Week Off' ? secondEntry.shift.split('to')[0].includes('PM') : '';

          // const isMainShift = firstEntry.shiftMode === "Main Shift";
          // const isPlusShift = firstEntry.plusshift && firstEntry.plusshift != "";

          let shiftFromTime = '';
          let shiftEndTime = '';
          function convertTo24Hour(time) {
            // Remove any extra spaces or unexpected characters
            time = time.trim();

            // Use regular expression to capture time and AM/PM
            const match = time.match(/^(\d{1,2}):(\d{2})(AM|PM)$/);
            if (!match) return null; // Return null if the format is incorrect

            let hours = parseInt(match[1], 10);
            const minutes = match[2];
            const period = match[3];

            // Convert to 24-hour format
            if (period === 'PM' && hours < 12) {
              hours += 12;
            }
            if (period === 'AM' && hours === 12) {
              hours = 0;
            }

            // Format the time as 'HH:MM'
            return `${hours.toString().padStart(2, '0')}:${minutes}`;
          }

          if (isFirstShiftWeekoff && isSecondShiftWeekoff) {
            let newFromTime = isPreviousShiftPM ? new Date(`${finalDateOnly}T10:00:00Z`) : new Date(`${finalDateOnly}T01:00:00Z`);
            let newEndTime = isPreviousShiftPM ? new Date(`${newDateOnePlus}T${convertTo24Hour(previousEntry.shifttiming.split('to')[0])}Z`) : new Date(`${newDateOnePlus}T${convertTo24Hour(previousEntry.shifttiming.split('to')[0])}Z`);

            let finalHrs = isPreviousShiftPM === 'PM' ? nightShiftBeforeHrs : dayShiftBeforeHrs;
            let finalMin = isPreviousShiftPM === 'PM' ? nightShiftBeforeMin : dayShiftBeforeMin;
            shiftEndTime = new Date(newEndTime.getTime() - (finalHrs * 60 * 60 * 1000 + (finalMin + 1) * 60 * 1000));
            shiftFromTime = new Date(newFromTime.getTime() + 60 * 1000);

            shiftEndTime = new Date(shiftEndTime.setSeconds(shiftEndTime.getSeconds() + 59));

            data = { shiftFromTime, shiftEndTime, shiftsts: 'Disable', shifttiming: firstEntry.shift };
            // console.log(shiftFromTime, shiftEndTime, newFromTime, newEndTime, 'shiftFromTime111')
          } else if (isFirstShiftWeekoff && ispreviousShiftWeekoff) {
            let newFromTime = isPreviousShiftPM ? new Date(`${finalDateOnly}T${convertTo24Hour(secondEntry.shifttiming.split('to')[0])}Z`) : new Date(`${finalDateOnly}T${convertTo24Hour(secondEntry.shifttiming.split('to')[0])}Z`);
            let newEndTime = isPreviousShiftPM ? new Date(`${newDateOnePlus}T${convertTo24Hour(secondEntry.shifttiming.split('to')[0])}Z`) : new Date(`${newDateOnePlus}T${convertTo24Hour(secondEntry.shifttiming.split('to')[0])}Z`);

            let finalHrs = isPreviousShiftPM === 'PM' ? nightShiftBeforeHrs : dayShiftBeforeHrs;
            let finalMin = isPreviousShiftPM === 'PM' ? nightShiftBeforeMin : dayShiftBeforeMin;
            shiftEndTime = new Date(newEndTime.getTime() - (finalHrs * 60 * 60 * 1000 + finalMin * 60 * 1000));
            shiftFromTime = new Date(newFromTime.getTime() - (finalHrs * 60 * 60 * 1000 + finalMin * 60 * 1000));

            shiftEndTime = new Date(shiftEndTime.setSeconds(shiftEndTime.getSeconds() - 1));

            data = { shiftFromTime, shiftEndTime, shiftsts: 'Disable', shifttiming: firstEntry.shift };
            // console.log(shiftFromTime, shiftEndTime, newFromTime, newEndTime, 'shiftFromTime111')
          } else if (isFirstShiftWeekoff) {
            let newFromTime = isPreviousShiftPM ? new Date(`${finalDateOnly}T10:00:00Z`) : new Date(`${finalDateOnly}T01:00:00Z`);
            let newEndTime = isPreviousShiftPM ? new Date(`${newDateOnePlus}T${convertTo24Hour(secondEntry.shifttiming.split('to')[0])}Z`) : new Date(`${newDateOnePlus}T${convertTo24Hour(secondEntry.shifttiming.split('to')[0])}Z`);

            let finalHrs = isPreviousShiftPM === 'PM' ? nightShiftBeforeHrs : dayShiftBeforeHrs;
            let finalMin = isPreviousShiftPM === 'PM' ? nightShiftBeforeMin : dayShiftBeforeMin;
            shiftEndTime = new Date(newEndTime.getTime() - (finalHrs * 60 * 60 * 1000 + (finalMin + 1) * 60 * 1000));
            shiftFromTime = new Date(newFromTime.getTime() + 60 * 1000);

            shiftEndTime = new Date(shiftEndTime.setSeconds(shiftEndTime.getSeconds() + 59));

            data = { shiftFromTime, shiftEndTime, shiftsts: 'Disable', shifttiming: firstEntry.shift };
            // console.log(shiftFromTime, shiftEndTime, newFromTime, newEndTime, 'shiftFromTime')
          } else if (isSecondShiftWeekoff) {
            let newFromTime = isFirstShiftPM ? new Date(`${finalDateOnly}T${convertTo24Hour(firstEntry.shifttiming.split('to')[0])}Z`) : new Date(`${finalDateOnly}T${convertTo24Hour(firstEntry.shifttiming.split('to')[0])}Z`);
            let newEndTime = isFirstShiftPM ? new Date(`${newDateOnePlus}T10:00:00Z`) : new Date(`${newDateOnePlus}T01:00:00Z`);

            let finalHrs = isPreviousShiftPM === 'PM' ? nightShiftBeforeHrs : dayShiftBeforeHrs;
            let finalMin = isPreviousShiftPM === 'PM' ? nightShiftBeforeMin : dayShiftBeforeMin;
            shiftEndTime = new Date(newEndTime);
            shiftFromTime = new Date(newFromTime.getTime() - (finalHrs * 60 * 60 * 1000 + finalMin * 60 * 1000));
            shiftEndTime = new Date(shiftEndTime.setSeconds(shiftEndTime.getSeconds() + 59));

            data = { shiftFromTime, shiftEndTime, shiftsts: firstEntry.shiftsts, shifttiming: firstEntry.shifttiming };
            // console.log(shiftFromTime, shiftEndTime, newFromTime, newEndTime, 'shiftFromTimesec')
          } else if (firstEntry.shifttiming === "Not Allotted" && previousEntry && !isBeforeDayDoubleShift) {
            // return data.filter(entry => [dateSelectedFormat, dateSelectedFormatOnePlus].includes(entry.date) && entry.shiftmode === "Main Shift");
            let newFromTime = isPreviousShiftPM ? new Date(`${finalDateOnly}T${convertTo24Hour(previousEntry.shifttiming.split('to')[1])}Z`) : new Date(`${newDateOneMinus}T${convertTo24Hour(previousEntry.shifttiming.split('to')[1])}Z`);
            let newEndTime = issecondShiftPM ? new Date(`${newDateOnePlus}T${convertTo24Hour(secondEntry.shifttiming.split('to')[0])}Z`) : new Date(`${newDateOnePlus}T${convertTo24Hour(secondEntry.shifttiming.split('to')[0])}Z`);

            let finalHrs = isPreviousShiftPM === 'PM' ? nightShiftBeforeHrs : dayShiftBeforeHrs;
            let finalMin = isPreviousShiftPM === 'PM' ? nightShiftBeforeMin : dayShiftBeforeMin;
            shiftEndTime = new Date(newEndTime.getTime() - (finalHrs * 60 * 60 * 1000 + (finalMin + 1) * 60 * 1000));
            // shiftFromTime = new Date(newFromTime.getTime() - (finalHrs * 60 * 60 * 1000 + finalMin * 60 * 1000));
            shiftFromTime = new Date(newFromTime.getTime() + 60 * 1000);
            shiftFromTime = new Date(shiftFromTime.setSeconds(shiftFromTime.getSeconds() - 59));

            shiftEndTime = new Date(shiftEndTime.setSeconds(shiftEndTime.getSeconds() + 59));

            console.log(shiftFromTime, shiftEndTime, firstEntry.shifttiming, 'shiftFromTimesec')
            data = { shiftFromTime, shiftEndTime, shiftsts: 'Disable', shifttiming: firstEntry.shifttiming };
          }
          else if (firstEntryDoubleShift && secondEntry.shifttiming === "Not Allotted") {
            // return data.filter(entry => [dateSelectedFormat, dateSelectedFormatOnePlus].includes(entry.date) && entry.shiftmode === "Main Shift");
            let newFromTime = isFirstShiftPM ? new Date(`${finalDateOnly}T${convertTo24Hour(firstEntry.shifttiming.split('to')[0])}Z`) : new Date(`${finalDateOnly}T${convertTo24Hour(firstEntry.shifttiming.split('to')[0])}Z`);
            let newEndTime = isFirstShiftPM ? new Date(`${newDateOnePlus}T${convertTo24Hour(firstEntryDoubleShift.shifttiming.split('to')[0])}Z`) : new Date(`${finalDateOnly}T${convertTo24Hour(firstEntryDoubleShift.shifttiming.split('to')[0])}Z`);

            let newFromTimeSecondShift = isFirstShiftPM ? new Date(`${newDateOnePlus}T${convertTo24Hour(firstEntryDoubleShift.shifttiming.split('to')[0])}Z`) : new Date(`${finalDateOnly}T${convertTo24Hour(firstEntryDoubleShift.shifttiming.split('to')[0])}Z`);
            let newEndTimeSecondShift = isFirstShiftPM ? new Date(`${newDateOnePlus}T${convertTo24Hour(firstEntryDoubleShift.shifttiming.split('to')[1])}Z`) : new Date(`${newDateOnePlus}T${convertTo24Hour(firstEntryDoubleShift.shifttiming.split('to')[1])}Z`);

            const shiftOnlyFromTimeSecondShift = firstEntryDoubleShiftPM ? new Date(`${finalDateOnly}T${convertTo24Hour(firstEntryDoubleShift.shifttiming.split('to')[0])}Z`) : new Date(`${finalDateOnly}T${convertTo24Hour(firstEntryDoubleShift.shifttiming.split('to')[0])}Z`);
            const shiftOnlyEndTimeSecondShift = firstEntryDoubleShiftPM ? new Date(`${newDateOnePlus}T${convertTo24Hour(firstEntryDoubleShift.shifttiming.split('to')[1])}Z`) : new Date(`${finalDateOnly}T${convertTo24Hour(firstEntryDoubleShift.shifttiming.split('to')[1])}Z`);

            const finalHrs = isPreviousShiftPM === 'PM' ? nightShiftBeforeHrs : dayShiftBeforeHrs;
            const finalMin = isPreviousShiftPM === 'PM' ? nightShiftBeforeMin : dayShiftBeforeMin;
            // shiftFromTime = new Date(newFromTime.getTime() - (finalHrs * 60 * 60 * 1000 + finalMin * 60 * 1000));
            shiftFromTime = new Date(newFromTime.getTime() - (finalHrs * 60 * 60 * 1000 + finalMin * 60 * 1000));


            // shiftEndTime = new Date(newEndTime.setSeconds(newEndTime.getSeconds() + 59));


            let shiftEndTimeFirstShift = newEndTime;

            const shiftFromTimeSecondShift = new Date(newFromTimeSecondShift.setSeconds(newFromTimeSecondShift.getSeconds() + 1));


            // let shiftEndTimeSecondShift = new Date(newEndTimeSecondShift.getTime() - (finalHrs * 60 * 60 * 1000 + (finalMin + 1) * 60 * 1000));
            let shiftEndTimeSecondShift = newEndTimeSecondShift;
            // let shiftEndTimeSecondShift = new Date(newEndTimeSecondShift);
            // shiftEndTimeSecondShift = new Date(shiftEndTimeSecondShift.setSeconds(shiftEndTimeSecondShift.getSeconds() + 59));

            // console.log(shiftFromTime, shiftEndTime,  firstEntry.shifttiming.split("to")[1], 'shiftFromTimesec')
            data = [
              { shiftFromTime, shiftEndTime: shiftEndTimeFirstShift, shiftsts: 'Disable', shifttiming: firstEntry.shifttiming },
              { shiftFromTime: shiftFromTimeSecondShift, shiftEndTime: shiftEndTimeSecondShift, shiftsts: 'Disable', shifttiming: firstEntryDoubleShift.shifttiming, shiftOnlyFromTime: shiftOnlyFromTimeSecondShift, shiftOnlyEndTime: shiftOnlyEndTimeSecondShift },
            ];
          }
          else if (firstEntryDoubleShift) {
            // return data.filter(entry => [dateSelectedFormat, dateSelectedFormatOnePlus].includes(entry.date) && entry.shiftmode === "Main Shift");
            let newFromTime = isFirstShiftPM ? new Date(`${finalDateOnly}T${convertTo24Hour(firstEntry.shifttiming.split('to')[0])}Z`) : new Date(`${finalDateOnly}T${convertTo24Hour(firstEntry.shifttiming.split('to')[0])}Z`);
            let newEndTime = isFirstShiftPM ? new Date(`${newDateOnePlus}T${convertTo24Hour(firstEntryDoubleShift.shifttiming.split('to')[0])}Z`) : new Date(`${finalDateOnly}T${convertTo24Hour(firstEntryDoubleShift.shifttiming.split('to')[0])}Z`);

            let newFromTimeSecondShift = isFirstShiftPM ? new Date(`${newDateOnePlus}T${convertTo24Hour(firstEntryDoubleShift.shifttiming.split('to')[0])}Z`) : new Date(`${finalDateOnly}T${convertTo24Hour(firstEntryDoubleShift.shifttiming.split('to')[0])}Z`);
            let newEndTimeSecondShift = firstEntryDoubleShiftPM ? new Date(`${newDateOnePlus}T${convertTo24Hour(secondEntry.shifttiming.split('to')[0])}Z`) : new Date(`${newDateOnePlus}T${convertTo24Hour(secondEntry.shifttiming.split('to')[0])}Z`);

            const shiftOnlyFromTimeSecondShift = firstEntryDoubleShiftPM ? new Date(`${finalDateOnly}T${convertTo24Hour(firstEntryDoubleShift.shifttiming.split('to')[0])}Z`) : new Date(`${finalDateOnly}T${convertTo24Hour(firstEntryDoubleShift.shifttiming.split('to')[0])}Z`);
            const shiftOnlyEndTimeSecondShift = firstEntryDoubleShiftPM ? new Date(`${newDateOnePlus}T${convertTo24Hour(firstEntryDoubleShift.shifttiming.split('to')[0])}Z`) : new Date(`${finalDateOnly}T${convertTo24Hour(firstEntryDoubleShift.shifttiming.split('to')[0])}Z`);

            const finalHrs = isPreviousShiftPM === 'PM' ? nightShiftBeforeHrs : dayShiftBeforeHrs;
            const finalMin = isPreviousShiftPM === 'PM' ? nightShiftBeforeMin : dayShiftBeforeMin;
            shiftFromTime = new Date(newFromTime.getTime() - (finalHrs * 60 * 60 * 1000 + finalMin * 60 * 1000));

            shiftEndTime = new Date(newEndTime.getTime() - (finalHrs * 60 * 60 * 1000 + (finalMin + 1) * 60 * 1000));
            shiftEndTime = new Date(shiftEndTime.setSeconds(shiftEndTime.getSeconds() + 59));

            let shiftEndTimeSecondShift = new Date(newEndTimeSecondShift.getTime() - (finalHrs * 60 * 60 * 1000 + (finalMin + 1) * 60 * 1000));
            shiftEndTimeSecondShift = new Date(shiftEndTimeSecondShift.setSeconds(shiftEndTimeSecondShift.getSeconds() + 59));

            let shiftEndTimeFirstShift = newEndTime;

            const shiftFromTimeSecondShift = new Date(newFromTimeSecondShift.setSeconds(newFromTimeSecondShift.getSeconds() + 1));
            // let shiftEndTimeSecondShift = new Date(newEndTimeSecondShift);
            // shiftEndTimeSecondShift = new Date(shiftEndTimeSecondShift.setSeconds(shiftEndTimeSecondShift.getSeconds() + 59));

            // console.log(shiftFromTime, shiftEndTime,  firstEntry.shifttiming.split("to")[1], 'shiftFromTimesec')
            data = [
              { shiftFromTime, shiftEndTime: shiftEndTimeFirstShift, shiftsts: 'Disable', shifttiming: firstEntry.shifttiming },
              { shiftFromTime: shiftFromTimeSecondShift, shiftEndTime: shiftEndTimeSecondShift, shiftsts: 'Disable', shifttiming: firstEntryDoubleShift.shifttiming, shiftOnlyFromTime: shiftOnlyFromTimeSecondShift, shiftOnlyEndTime: shiftOnlyEndTimeSecondShift },
            ];
          }
          else if (isBeforeDayDoubleShift && secondEntry && firstEntry.shifttiming === "Not Allotted") {
            console.log("firstentrynotallot")
            // return data.filter(entry => [dateSelectedFormat, dateSelectedFormatOnePlus].includes(entry.date) && entry.shiftmode === "Main Shift");
            let newFromTime = isBeforeDayDoubleShiftPM ? new Date(`${finalDateOnly}T${convertTo24Hour(isBeforeDayDoubleShift.shifttiming.split('to')[1])}Z`) : new Date(`${newDateOneMinus}T${convertTo24Hour(isBeforeDayDoubleShift.shifttiming.split('to')[1])}Z`);
            let newEndTime = issecondShiftPM ? new Date(`${newDateOnePlus}T${convertTo24Hour(secondEntry.shifttiming.split('to')[0])}Z`) : new Date(`${newDateOnePlus}T${convertTo24Hour(secondEntry.shifttiming.split('to')[0])}Z`);

            let finalHrs = isPreviousShiftPM === 'PM' ? nightShiftBeforeHrs : dayShiftBeforeHrs;
            let finalMin = isPreviousShiftPM === 'PM' ? nightShiftBeforeMin : dayShiftBeforeMin;
            shiftEndTime = new Date(newEndTime.getTime() - (finalHrs * 60 * 60 * 1000 + (finalMin + 1) * 60 * 1000));
            // shiftFromTime = new Date(newFromTime.getTime() - (finalHrs * 60 * 60 * 1000 + finalMin * 60 * 1000));
            shiftFromTime = new Date(newFromTime.getTime() + 60 * 1000);
            shiftFromTime = new Date(shiftFromTime.setSeconds(shiftFromTime.getSeconds() - 59));

            shiftEndTime = new Date(shiftEndTime.setSeconds(shiftEndTime.getSeconds() + 59));

            console.log(shiftFromTime, shiftEndTime, firstEntry.shifttiming, 'shiftFromTimesec')
            data = { shiftFromTime, shiftEndTime, shiftsts: 'Disable', shifttiming: firstEntry.shifttiming };
          }
          else if (isBeforeDayDoubleShift && secondEntry) {

            // return data.filter(entry => [dateSelectedFormat, dateSelectedFormatOnePlus].includes(entry.date) && entry.shiftmode === "Main Shift");
            let newFromTime = isFirstShiftPM ? new Date(`${finalDateOnly}T${convertTo24Hour(firstEntry.shifttiming.split('to')[0])}Z`) : new Date(`${finalDateOnly}T${convertTo24Hour(firstEntry.shifttiming.split('to')[0])}Z`);
            let newEndTime = isFirstShiftPM ? new Date(`${newDateOnePlus}T${convertTo24Hour(secondEntry.shifttiming.split('to')[0])}Z`) : new Date(`${newDateOnePlus}T${convertTo24Hour(secondEntry.shifttiming.split('to')[0])}Z`);

            let finalHrs = isPreviousShiftPM === 'PM' ? nightShiftBeforeHrs : dayShiftBeforeHrs;
            let finalMin = isPreviousShiftPM === 'PM' ? nightShiftBeforeMin : dayShiftBeforeMin;
            shiftEndTime = new Date(newEndTime.getTime() - (finalHrs * 60 * 60 * 1000 + (finalMin + 1) * 60 * 1000));

            shiftFromTime = new Date(newFromTime.getTime() - (finalHrs * 60 * 60 * 1000 + finalMin * 60 * 1000));


            shiftEndTime = new Date(shiftEndTime.setSeconds(shiftEndTime.getSeconds() + 59));

            console.log(shiftFromTime, shiftEndTime, firstEntry.shifttiming, 'shiftFromTimesec')
            data = { shiftFromTime, shiftEndTime, shiftsts: 'Disable', shifttiming: firstEntry.shifttiming };
          } else if (firstEntry && secondEntry.shifttiming === "Not Allotted") {
            console.log("this")
            // return data.filter(entry => [dateSelectedFormat, dateSelectedFormatOnePlus].includes(entry.date) && entry.shiftmode === "Main Shift");
            let newFromTime = isFirstShiftPM ? new Date(`${newDateOnePlus}T${convertTo24Hour(firstEntry.shifttiming.split('to')[0])}Z`) : new Date(`${finalDateOnly}T${convertTo24Hour(firstEntry.shifttiming.split('to')[0])}Z`);
            let newEndTime = isFirstShiftPM ? new Date(`${newDateOnePlus}T${convertTo24Hour(firstEntry.shifttiming.split('to')[1])}Z`) : new Date(`${finalDateOnly}T${convertTo24Hour(firstEntry.shifttiming.split('to')[1])}Z`);

            let finalHrs = isPreviousShiftPM === 'PM' ? nightShiftBeforeHrs : dayShiftBeforeHrs;
            let finalMin = isPreviousShiftPM === 'PM' ? nightShiftBeforeMin : dayShiftBeforeMin;
            // shiftEndTime = new Date(newEndTime.getTime() - (finalHrs * 60 * 60 * 1000 + (finalMin + 1) * 60 * 1000));

            shiftFromTime = new Date(newFromTime.getTime() - (finalHrs * 60 * 60 * 1000 + finalMin * 60 * 1000));

            shiftEndTime = newEndTime;

            // console.log(shiftFromTime, shiftEndTime,  firstEntry.shifttiming.split("to")[1], 'shiftFromTimesec')
            data = { shiftFromTime, shiftEndTime, shiftsts: firstEntry.shiftsts, shifttiming: firstEntry.shifttiming };
          }
          else if (firstEntry && secondEntry) {
            console.log("nothis")
            // return data.filter(entry => [dateSelectedFormat, dateSelectedFormatOnePlus].includes(entry.date) && entry.shiftmode === "Main Shift");
            let newFromTime = isFirstShiftPM ? new Date(`${finalDateOnly}T${convertTo24Hour(firstEntry.shifttiming.split('to')[0])}Z`) : new Date(`${finalDateOnly}T${convertTo24Hour(firstEntry.shifttiming.split('to')[0])}Z`);
            let newEndTime = issecondShiftPM ? new Date(`${newDateOnePlus}T${convertTo24Hour(secondEntry.shifttiming.split('to')[0])}Z`) : new Date(`${newDateOnePlus}T${convertTo24Hour(secondEntry.shifttiming.split('to')[0])}Z`);

            let finalHrs = isPreviousShiftPM === 'PM' ? nightShiftBeforeHrs : dayShiftBeforeHrs;
            let finalMin = isPreviousShiftPM === 'PM' ? nightShiftBeforeMin : dayShiftBeforeMin;
            shiftEndTime = new Date(newEndTime.getTime() - (finalHrs * 60 * 60 * 1000 + (finalMin + 1) * 60 * 1000));
            shiftFromTime = new Date(newFromTime.getTime() - (finalHrs * 60 * 60 * 1000 + finalMin * 60 * 1000));

            shiftEndTime = new Date(shiftEndTime.setSeconds(shiftEndTime.getSeconds() + 59));

            // console.log(shiftFromTime, shiftEndTime,  firstEntry.shifttiming.split("to")[1], 'shiftFromTimesec')
            data = { shiftFromTime, shiftEndTime, shiftsts: firstEntry.shiftsts, shifttiming: firstEntry.shifttiming };
          } else {
            data = { shiftFromTime: new Date(shiftFromTime), shiftEndTime: new Date(shiftEndTime), shiftsts: 'Disable' };
          }
        } else {
          // console.log('else 725')
          data = { shiftFromTime: '', shiftEndTime: '', shiftsts: 'Disable', shifttiming: '' };
        }
        // console.log(data, "data123");

        // return {

        //   ...item,
        //   prodshift: filtered.length >= 3 ? `${data.shiftFromTime?.toISOString()?.split('.000Z')[0]}to${data.shiftEndTime?.toISOString()?.split('.000Z')[0]}` : '',

        // };
        if (filtered.find((d) => d.rowformattedDate === dateSelectedFormat && d.shiftMode === 'Second Shift' && d.shifttiming != undefined)) {
          return [
            {
              ...item,
              shift: data[0]?.shifttiming,
              //   userShiftTimings: data[0],
              prodshift: filtered.length >= 3 ? `${data[0].shiftFromTime?.toISOString()?.split('.000Z')[0]}to${data[0].shiftEndTime?.toISOString()?.split('.000Z')[0]}` : '',
            },
            {
              ...item,
              shift: data[1]?.shifttiming,
              prodshift: filtered.length >= 3 ? `${data[1].shiftFromTime?.toISOString()?.split('.000Z')[0]}to${data[1].shiftEndTime?.toISOString()?.split('.000Z')[0]}` : '',
            },
          ];
        } else {
          return {
            ...item,
            shift: data.shifttiming,
            prodshift: filtered.length >= 3 ? `${data.shiftFromTime?.toISOString()?.split('.000Z')[0]}to${data.shiftEndTime?.toISOString()?.split('.000Z')[0]}` : '',
          };
        }
      });

      setUserShifts(
        itemsWithSerialNumber.map((item, index) => {
          let fromdate,
            fromtime,
            enddate,
            endtime = '';
          if (item.prodshift != '') {
            const fromtodate = item.prodshift ? item.prodshift.split('to') : '';
            fromdate = fromtodate ? fromtodate[0].split('T')[0] : '';
            fromtime = fromtodate ? convertTo12HourFormat(fromtodate[0].split('T')[1]) : '';

            enddate = fromtodate ? fromtodate[1].split('T')[0] : '';
            endtime = fromtodate ? convertTo12HourFormat(fromtodate[1].split('T')[1]) : '';
          } else {
            fromdate = '';
            fromtime = '';

            enddate = '';
            endtime = '';
          }
          return {
            ...item,
            serialNumber: index + 1,
            date: item.rowformattedDate,
            prodstartdate: moment(fromdate).format("DD-MM-YYYY"),
            prodstarttime: fromtime,
            prodenddate: moment(enddate).format("DD-MM-YYYY"),
            prodendtime: endtime,
          };
        })
      );
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err, 'errorororo');
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedCompanyFrom.length === 0) {
      setPopupContentMalert('Please Select Company');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (selectedBranchFrom.length === 0) {
      setPopupContentMalert('Please Select Branch');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (selectedUnitFrom.length === 0) {
      setPopupContentMalert('Please Select Unit');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (selectedTeamFrom.length === 0) {
      setPopupContentMalert('Please Select Team');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (selectedEmployeeFrom.length === 0) {
      setPopupContentMalert('Please Select Employeename');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (filterUser.fromdate === '') {
      setPopupContentMalert('Please Select FromDate');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (filterUser.todate === '') {
      setPopupContentMalert('Please Select ToDate');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else {
      fetchFilteredUsersStatus();
    }
  };

  const handleClear = async (e) => {
    e.preventDefault();
    setSelectedCompanyFrom([]);
    setSelectedBranchFrom([]);
    setSelectedUnitFrom([]);
    setSelectedTeamFrom([]);
    setSelectedEmployeeFrom([]);

    setFilterUser({
      ...filterUser,
      fromdate: today,
      todate: today,
    });
    setUserShifts([]);
    setPopupContent('Cleared Successfully');
    setPopupSeverity('success');
    handleClickOpenPopup();
  };


  const addSerialNumber = (datas) => {
    setItems(datas);
  };
  useEffect(() => {
    addSerialNumber(userShifts);
  }, [userShifts]);

  const cellStyles = {
    wordBreak: "break-all", fontSize: '12px', lineHeight: '1.5', display: "flex", alignItems: "center",
    textWrap: "auto",
  }

  const columnDataTable = [
    { field: 'serialNumber', headerName: 'S No', flex: 0, width: 70, hide: !columnVisibility.serialNumber, headerClassName: 'bold-header', cellStyle: cellStyles, wrapHeaderText: true, autoHeaderHeight: true, },
    { field: 'empcode', headerName: 'Emp Code', flex: 0, width: 110, hide: !columnVisibility.empcode, headerClassName: 'bold-header', cellStyle: cellStyles, wrapHeaderText: true, autoHeaderHeight: true, },
    { field: 'username', headerName: 'Employee Name', flex: 0, width: 130, hide: !columnVisibility.username, headerClassName: 'bold-header', cellStyle: cellStyles, wrapHeaderText: true, autoHeaderHeight: true, },
    { field: 'company', headerName: 'Company', flex: 0, width: 80, hide: !columnVisibility.company, headerClassName: 'bold-header', cellStyle: cellStyles, wrapHeaderText: true, autoHeaderHeight: true, },
    { field: 'branch', headerName: 'Branch', flex: 0, width: 110, hide: !columnVisibility.branch, headerClassName: 'bold-header', cellStyle: cellStyles, wrapHeaderText: true, autoHeaderHeight: true, },
    { field: 'unit', headerName: 'Unit', flex: 0, width: 80, hide: !columnVisibility.unit, headerClassName: 'bold-header', cellStyle: cellStyles, wrapHeaderText: true, autoHeaderHeight: true, },
    { field: 'team', headerName: 'Team', flex: 0, width: 85, hide: !columnVisibility.team, headerClassName: 'bold-header', cellStyle: cellStyles, wrapHeaderText: true, autoHeaderHeight: true, },
    { field: 'department', headerName: 'Department', flex: 0, width: 140, hide: !columnVisibility.department, headerClassName: 'bold-header', cellStyle: cellStyles, wrapHeaderText: true, autoHeaderHeight: true, },
    { field: 'date', headerName: 'Date', flex: 0, width: 100, hide: !columnVisibility.date, headerClassName: 'bold-header', cellStyle: cellStyles, wrapHeaderText: true, autoHeaderHeight: true, },
    // { field: "shiftmode", headerName: "Shift Mode", flex: 0, width: 110, hide: !columnVisibility.shiftmode, headerClassName: "bold-header", },
    { field: 'shift', headerName: 'Shift', flex: 0, width: 140, hide: !columnVisibility.shift, headerClassName: 'bold-header', cellStyle: cellStyles, wrapHeaderText: true, autoHeaderHeight: true, },
    // { field: "nextshift", headerName: "Production Shift", flex: 0, width: 150, hide: !columnVisibility.nextshift, headerClassName: "bold-header", },
    { field: 'prodstartdate', headerName: 'Production Shift Start Date', flex: 0, width: 120, hide: !columnVisibility.prodstartdate, wrapHeaderText: true, autoHeaderHeight: true, headerClassName: 'bold-header', cellStyle: cellStyles },
    { field: 'prodstarttime', headerName: 'Production Shift Start Time', flex: 0, width: 120, wrapHeaderText: true, autoHeaderHeight: true, hide: !columnVisibility.prodstarttime, headerClassName: 'bold-header', cellStyle: cellStyles },
    { field: 'prodenddate', headerName: 'Production Shift End Date', flex: 0, width: 120, wrapHeaderText: true, autoHeaderHeight: true, hide: !columnVisibility.prodenddate, headerClassName: 'bold-header', cellStyle: cellStyles },
    { field: 'prodendtime', headerName: 'Production Shift End Time', flex: 0, width: 120, wrapHeaderText: true, autoHeaderHeight: true, hide: !columnVisibility.prodendtime, headerClassName: 'bold-header', cellStyle: cellStyles },
  ];

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

  const filteredData = filteredDatas?.slice((page - 1) * pageSize, page * pageSize);

  const totalPages = Math.ceil(filteredDatas?.length / pageSize);
  const visiblePages = Math.min(totalPages, 3);
  const firstVisiblePage = Math.max(1, page - 1);
  const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);
  const pageNumbers = [];
  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  }

  const rowDataTable = filteredData?.flatMap((item, index) => {
    return {
      id: item.id,
      uniqueid: item.id,
      userid: item.userid,
      serialNumber: item.serialNumber,
      company: item.company,
      branch: item.branch,
      unit: item.unit,
      team: item.team,
      nextshift: item.nextshift,
      department: item.department,
      username: item.username,
      empcode: item.empcode,
      weekoff: item.weekoff,
      boardingLog: item.boardingLog,
      shiftallot: item.shiftallot,
      shift: item.shift,
      date: item.date,
      shiftmode: item.shiftMode,
      prodshift: item.prodshift,

      prodstartdate: item.prodstartdate,
      prodstarttime: item.prodstarttime,
      prodenddate: item.prodenddate,
      prodendtime: item.prodendtime,
    };
  });

  const rowsWithCheckboxes = filteredData.map((row) => ({
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

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
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
      </Box>{' '}
      <br /> <br />
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

  // Excel
  const fileName = 'Production Day Shift';
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



  // print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Production Day Shift',
    pageStyle: 'print',
  });

  let exportColumnNames = ['Emp Code', 'Employee Name', 'Company', 'Branch', 'Unit', 'Team', 'Department', 'Date', 'Shift', 'Production Shift Start Date', 'Production Shift Start Time', 'Production Shift End Date', 'Production Shift End Time'];

  let exportRowValues = ['empcode', 'username', 'company', 'branch', 'unit', 'team', 'department', 'date', 'shift', 'prodstartdate', 'prodstarttime', 'prodenddate', 'prodendtime'];

  const gridRefTableImg = useRef(null);
  // image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Production Day Shift.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };

  return (
    <Box>
      <Headtitle title={'Production Day Shift'} />
      {/* ****** Header Content ****** */}
      <Typography sx={userStyle.HeaderText}></Typography>
      <PageHeading title="Production Day Shift" modulename="Production" submodulename="Report SetUp" mainpagename="Production Day Shift" subpagename="" subsubpagename="" />
      {isUserRoleCompare?.includes("aproductiondayshift") && (
        <>
          <Box sx={userStyle.selectcontainer}>
            <Grid container spacing={2}>
              <>
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
                      styles={colourStyles}
                      value={selectedCompanyFrom}
                      onChange={handleCompanyChangeFrom}
                      valueRenderer={customValueRendererCompanyFrom}
                      labelledBy="Please Select Company"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Branch<b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={accessbranch
                        ?.filter((comp) => selectedCompanyFrom.map((d) => d.value).includes(comp.company))
                        ?.map((data) => ({
                          label: data.branch,
                          value: data.branch,
                        }))
                        .filter((item, index, self) => {
                          return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                        })}
                      value={selectedBranchFrom}
                      onChange={handleBranchChangeFrom}
                      valueRenderer={customValueRendererBranchFrom}
                      labelledBy="Please Select Branch"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Unit<b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={accessbranch
                        ?.filter((comp) => selectedCompanyFrom.map((d) => d.value).includes(comp.company) && selectedBranchFrom.map((item) => item.value).includes(comp.branch))
                        ?.map((data) => ({
                          label: data.unit,
                          value: data.unit,
                        }))
                        .filter((item, index, self) => {
                          return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                        })}
                      value={selectedUnitFrom}
                      onChange={handleUnitChangeFrom}
                      valueRenderer={customValueRendererUnitFrom}
                      labelledBy="Please Select Unit"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Team<b style={{ color: 'red' }}>*</b>
                    </Typography>

                    <MultiSelect
                      options={allTeam
                        ?.filter((comp) => selectedCompanyFrom.map((d) => d.value).includes(comp.company) && selectedBranchFrom.map((item) => item.value).includes(comp.branch) && selectedUnitFrom.map((item) => item.value).includes(comp.unit))
                        ?.map((data) => ({
                          label: data.teamname,
                          value: data.teamname,
                        }))
                        .filter((item, index, self) => {
                          return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                        })}
                      value={selectedTeamFrom}
                      onChange={handleTeamChangeFrom}
                      valueRenderer={customValueRendererTeamFrom}
                      labelledBy="Please Select Team"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Employee Name <b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={allEmp
                        ?.filter(
                          (comp) => selectedCompanyFrom.map((d) => d.value).includes(comp.company) && selectedBranchFrom.map((item) => item.value).includes(comp.branch) && selectedUnitFrom.map((item) => item.value).includes(comp.unit) && selectedTeamFrom.map((item) => item.value).includes(comp.team)
                        )
                        ?.map((com) => ({
                          ...com,
                          label: com.companyname,
                          value: com.companyname,
                        }))}
                      value={selectedEmployeeFrom}
                      onChange={handleEmployeeChangeFrom}
                      valueRenderer={customValueRendererEmployeeFrom}
                      labelledBy="Please Select Employeename"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      {' '}
                      From Date<b style={{ color: 'red' }}>*</b>{' '}
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="date"
                      value={filterUser.fromdate}
                      onChange={(e) => {
                        const selectedDate = e.target.value;
                        // Ensure that the selected date is not in the future
                        const currentDate = new Date()?.toISOString().split('T')[0];
                        if (selectedDate <= currentDate) {
                          setFilterUser({ ...filterUser, fromdate: selectedDate, todate: selectedDate });
                        } else {
                          // Handle the case where the selected date is in the future (optional)
                          // You may choose to show a message or take other actions.
                        }
                      }}
                      // Set the max attribute to the current date
                      inputProps={{ max: new Date()?.toISOString().split('T')[0] }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      {' '}
                      To Date<b style={{ color: 'red' }}>*</b>{' '}
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="date"
                      value={filterUser.todate}
                      onChange={(e) => {
                        const selectedDate = e.target.value;
                        // Ensure that the selected date is not in the future
                        const currentDate = new Date()?.toISOString().split('T')[0];
                        const fromdateval = filterUser.fromdate != '' && new Date(filterUser.fromdate)?.toISOString().split('T')[0];
                        if (filterUser.fromdate == '') {
                          setShowAlert(
                            <>
                              <ErrorOutlineOutlinedIcon sx={{ fontSize: '100px', color: 'orange' }} />
                              <p style={{ fontSize: '20px', fontWeight: 900 }}>{`Please Select From date`}</p>
                            </>
                          );
                          handleClickOpenerr();
                        } else if (selectedDate < fromdateval) {
                          setFilterUser({ ...filterUser, todate: '' });
                          setShowAlert(
                            <>
                              <ErrorOutlineOutlinedIcon sx={{ fontSize: '100px', color: 'orange' }} />
                              <p style={{ fontSize: '20px', fontWeight: 900 }}>{`To Date should be after or equal to From Date`}</p>
                            </>
                          );
                          handleClickOpenerr();
                        } else if (selectedDate <= currentDate) {
                          setFilterUser({ ...filterUser, todate: selectedDate });
                        } else {
                        }
                      }}
                      // Set the max attribute to the current date
                      inputProps={{ max: new Date()?.toISOString().split('T')[0], min: filterUser.fromdate !== '' ? filterUser.fromdate : null }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} xs={12}>
                  <Typography>&nbsp;</Typography>
                  <Grid sx={{ display: 'flex' }}>
                    {/* <Grid item md={1} sm={6} xs={6}> */}
                    <Button sx={buttonStyles.buttonsubmit} variant="contained" onClick={handleSubmit}>
                      {' '}
                      Filter{' '}
                    </Button>
                    {/* </Grid>
                                    
                                    <Grid item md={1} sm={6} xs={6}> */}
                    &nbsp; &nbsp;
                    <Button sx={buttonStyles.btncancel} onClick={handleClear}>
                      {' '}
                      Clear{' '}
                    </Button>
                    {/* </Grid> */}
                  </Grid>
                </Grid>
              </>
            </Grid>
          </Box>

          <br />
          {/* ****** Table Start ****** */}
          {isUserRoleCompare?.includes("lproductiondayshift") && (

            <Box sx={userStyle.container}>
              {/* ******************************************************EXPORT Buttons****************************************************** */}
              <Grid item xs={8}>
                <Typography sx={userStyle.importheadtext}> Production Day Shift </Typography>
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
                      <MenuItem value={userShifts?.length}> All </MenuItem>
                    </Select>
                  </Box>
                </Grid>
                <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Box>
                    {isUserRoleCompare?.includes('excelproductiondayshift') && (
                      <>
                        <Button
                          onClick={(e) => {
                            setIsFilterOpen(true);
                            // fetchUsersStatus()
                            setFormat('xl');
                          }}
                          sx={userStyle.buttongrp}
                        >
                          <FaFileExcel />
                          &ensp;Export to Excel&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes('csvproductiondayshift') && (
                      <>
                        <Button
                          onClick={(e) => {
                            setIsFilterOpen(true);
                            // fetchUsersStatus()
                            setFormat('csv');
                          }}
                          sx={userStyle.buttongrp}
                        >
                          <FaFileCsv />
                          &ensp;Export to CSV&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes('printproductiondayshift') && (
                      <>
                        <Button sx={userStyle.buttongrp} onClick={handleprint}>
                          {' '}
                          &ensp; <FaPrint /> &ensp;Print&ensp;{' '}
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes('pdfproductiondayshift') && (
                      <>
                        {/* <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}  > <FaFilePdf /> &ensp;Export to PDF&ensp; </Button> */}
                        <Button
                          sx={userStyle.buttongrp}
                          onClick={() => {
                            setIsPdfFilterOpen(true);
                            // fetchUsersStatus()
                          }}
                        >
                          <FaFilePdf />
                          &ensp;Export to PDF&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes('imageproductiondayshift') && (
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
                  <AggregatedSearchBar
                    columnDataTable={columnDataTable}
                    setItems={setItems}
                    addSerialNumber={addSerialNumber}
                    setPage={setPage}
                    maindatas={userShifts}
                    setSearchedString={setSearchedString}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    paginated={false}
                    totalDatas={userShifts} />
                </Grid>
                {/* <Grid item md={2} xs={12} sm={12}>
                            <Box>
                                <FormControl fullWidth size="small">
                                    <Typography>Search</Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                    />
                                </FormControl>
                            </Box>
                        </Grid> */}
              </Grid>{' '}
              <br />
              <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
                {' '}
                Show All Columns{' '}
              </Button>{' '}
              &ensp;
              <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
                {' '}
                Manage Columns{' '}
              </Button>{' '}
              <br /> <br />
              {loading ? (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                  </Box>
                </>
              ) : (
                <>
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
                    gridRefTable={gridRefTable}
                    paginated={false}
                    filteredDatas={filteredDatas}
                    searchQuery={searchedString}
                    handleShowAllColumns={handleShowAllColumns}
                    setFilteredRowData={setFilteredRowData}
                    filteredRowData={filteredRowData}
                    setFilteredChanges={setFilteredChanges}
                    filteredChanges={filteredChanges}
                    gridRefTableImg={gridRefTableImg}
                    itemsList={userShifts}
                  />

                  {/* <Box style={{ width: "100%", overflowY: "hidden", }} >
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
                                    Showing{" "}
                                    {filteredDatas.length > 0 ? (page - 1) * pageSize + 1 : 0} to{" "}
                                    {Math.min(page * pageSize, filteredDatas?.length)} of{" "}
                                    {filteredDatas?.length} entries
                                </Box>
                                <Box>
                                    <Button onClick={() => setPage(1)} disabled={page === 1} sx={userStyle.paginationbtn} > <FirstPageIcon /> </Button>
                                    <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1} sx={userStyle.paginationbtn}  >  <NavigateBeforeIcon /> </Button>
                                    {pageNumbers?.map((pageNumber) => (
                                        <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChange(pageNumber)} className={page === pageNumber ? "active" : ""} disabled={page === pageNumber}  > {pageNumber}  </Button>
                                    ))}
                                    {lastVisiblePage < totalPages && <span>...</span>}
                                    <Button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} sx={userStyle.paginationbtn} > <NavigateNextIcon /> </Button>
                                    <Button onClick={() => setPage(totalPages)} disabled={page === totalPages} sx={userStyle.paginationbtn} > <LastPageIcon /> </Button>
                                </Box>
                            </Box> */}
                </>
              )}
            </Box>
          )}
          {/* ****** Table End ****** */}
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

      {/* ALERT DIALOG */}
      <Box>
        <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
            <Typography variant="h6">{showAlert}</Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" style={{ padding: '7px 13px', color: 'white', background: 'rgb(25, 118, 210)' }} onClick={handleCloseerr}>
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
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
        filteredDataTwo={rowDataTable ?? []}
        itemsTwo={items ?? []}
        filename={'Production Day Shift'}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
    </Box>
  );
}

export default ProductionDayShift;