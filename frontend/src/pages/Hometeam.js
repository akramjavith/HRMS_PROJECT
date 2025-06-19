import React, { useState, useEffect, useContext, useRef } from 'react';
import { Box, Dialog, DialogContent, Button, DialogActions, DialogTitle, DialogContentText, Grid, Typography, TextareaAutosize } from '@mui/material';
import { userStyle } from '../pageStyle';
import axios from '../axiosInstance';
import { SERVICE } from '../services/Baseservice';
import { Link } from 'react-router-dom';
import { handleApiError } from '../components/Errorhandling';
import { format, addDays, subDays, differenceInDays } from 'date-fns';
import { UserRoleAccessContext, AuthContext } from '../context/Appcontext';
import ChatIcon from '@mui/icons-material/Chat';
import DriveFileMoveRoundedIcon from '@mui/icons-material/DriveFileMoveRounded';
import celebration from '../images/celebration.png';
import birthdayicongif from '../images/birthdayicongif.gif';
import birthdayiconimg from '../images/birthdayiconimg.png';
import WorkIcon from '@mui/icons-material/Work';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded';
import { useNavigate } from 'react-router-dom';
import moment from 'moment-timezone';
import LoadingButton from '@mui/lab/LoadingButton';
import BlockIcon from '@mui/icons-material/Block';
import WarningIcon from '@mui/icons-material/Warning';
import Homelayout from './Homelayoutteam.js';
import HomeBirthday from './HomeBirthday';
import { AUTH, BASE_URL } from '../services/Authservice';
import Servertime from '../components/Servertime';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import UserSurveyDialog from './UserSurveyDialog.js';
const Home = () => {
  //in work anniversary/birthday reminder/
  const getCurrentServerTime = async () => {
    try {
      const response = await axios.get(SERVICE.GET_CURRENT_SERVER_TIME);

      let serverTime = response.data;
      console.log(response.data.formatted, 'Current Server Time');
      console.log(moment().format('DD-MM-YYYY HH:mm:ss a'), 'frontend time');
      // formatted,
      // currentNewDate,
      // currenttoLocaleTimeString

      return serverTime;
    } catch (err) {
      console.log(err, 'err getting server time');
    }
  };

  const [openStatusDialog, setOpenStatusDialog] = useState(false);

  // All data controlled by one state object
  const [dialogData, setDialogData] = useState({
    icon: <CheckCircleIcon sx={{ fontSize: 60, color: '#4caf50' }} />,
    title: 'Clocked In',
    message: 'You have successfully clocked in.',
  });

  const [birthday, setBirthday] = useState();
  const [noBirthDay, setNoBirthDay] = useState();

  const [workAnniversary, setWorkAnniversary] = useState();
  const [noWorkAnniversary, setNoWorkAnniversary] = useState();

  const [marriageAnniversary, setMarriageAnniversary] = useState();
  const [noMarriageAnniversary, setNoMarriageAnniversary] = useState();

  const [showClockin, setShowClockin] = useState(true);

  const [IP, setIP] = useState('');
  const [clockinIPDetails, setClockinIPDetails] = useState([]);
  const [showButton, setShowButton] = useState('');

  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [calculatedTime, setCalculatedTime] = useState('');
  const [userInfoData, setUserInfoData] = useState({});
  const [shiftEndTime, setShiftEndTime] = useState();

  //chatbot
  const [chatBoxLink, setChatBoxLink] = useState('');
  const { auth } = useContext(AuthContext);

  const { isUserRoleAccess, setAllUsersData, buttonStyles } = useContext(UserRoleAccessContext);

  const [quickFolderName, setQuickFolderName] = useState([]);
  const [openQuickLink, setOpenQuickLink] = useState(false);
  const handleClickOpenQuickLinkview = () => {
    setOpenQuickLink(true);
  };

  const handleCloseQuickLinkview = () => {
    setOpenQuickLink(false);
  };
  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);

  // Password Remaining days showing
  const [remainingDays, setRemainingDays] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleOpenPopup = () => {
    setShowPopup(true);
  };
  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const [showPopupNewEmployee, setShowPopupNewEmployee] = useState(false);

  const handleOpenPopupNewEmployee = () => {
    setShowPopupNewEmployee(true);
  };
  const handleClosePopupNewEmployee = () => {
    setShowPopupNewEmployee(false);
  };
  const [showPopupPendingAppDoc, setShowPopupPendingAppDoc] = useState(false);
  const handleOpenPopupPendingAppDoc = () => {
    setShowPopupPendingAppDoc(true);
  };
  const handleClosePopupPendingAppDoc = () => {
    setShowPopupPendingAppDoc(false);
  };

  //more tham 100 pending task clockout alert
  const [openRestrictClockout, setOpenRestrictClockout] = useState(false);
  const handleClickOpenRestrictClockout = () => {
    setOpenRestrictClockout(true);
  };
  const handleClickCloseRestrictClockout = () => {
    setOpenRestrictClockout(false);
  };
  //less than 100 pending task clockout alert
  const [openWarningClockout, setOpenWarningClockout] = useState(false);
  const [warningShowed, setWarningShowed] = useState(false);
  const handleClickOpenWarningClockout = () => {
    setOpenWarningClockout(true);
  };
  const handleClickCloseWarningClockout = () => {
    setWarningShowed(true);
    setOpenWarningClockout(false);
  };

  const [showScroll, setShowScroll] = useState(false);
  // Scroll-to-top functionality
  const handleScroll = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Show Scroll-to-top button when scrolled down
  useEffect(() => {
    const checkScrollTop = () => {
      if (window.pageYOffset > 300) {
        setShowScroll(true);
      } else {
        setShowScroll(false);
      }
    };
    window.addEventListener('scroll', checkScrollTop);
    return () => window.removeEventListener('scroll', checkScrollTop);
  }, []);

  const [passwordAlert, setPasswordAlert] = useState(false);
  const [isPasswordExp, setIsPasswordExp] = useState(false);
  const [reminderDate, setReminderDate] = useState('');

  const passwordUpdateCheck = async () => {
    try {
      let response = await axios.get(`${SERVICE.USER_SINGLE}/${isUserRoleAccess._id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let res = await axios.get(`${SERVICE.GET_OVERALL_SETTINGS}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const calculateDaysUntilAlert = (alertStartDate, today) => {
        let diff = differenceInDays(alertStartDate, today);
        return diff >= 0 ? diff + 1 : 0; // Add 1 only for future dates
      };

      if (!isUserRoleAccess.role.includes('Manager')) {
        if (response?.data?.suser?.newEmployeePassUpdateCheck || response?.data?.suser?.newEmployeePassUpdateCheck === undefined) {
          // handleOpenPopupNewEmployee();
        } else {
          const paswordupdateday = res?.data?.overallsettings[0]?.passwordupdatedays; // Total days to update the password
          const paswordupdatealertday = res?.data?.overallsettings[0]?.passwordupdatealertdays; // Days before expiry to start the alert

          const lastUpdateDate = response?.data?.suser?.passexpdate ? new Date(response?.data?.suser?.passexpdate) : new Date(response?.data?.suser?.createdAt);
          const alertStartDates = subDays(new Date(lastUpdateDate), Number(paswordupdatealertday));
          const alertStartDate = addDays(alertStartDates, 1);

          const passwordChecktotal = lastUpdateDate;

          const today = new Date();

          const ExpDate = moment(passwordChecktotal).format('DD-MM-YYYY');
          const TodayDate = moment(today).format('DD-MM-YYYY');

          setReminderDate(ExpDate === TodayDate ? 'Today' : ExpDate);

          const daysUntilAlert = calculateDaysUntilAlert(alertStartDates, today);
          const daysUntilExpiration = calculateDaysUntilAlert(passwordChecktotal, today);

          if (daysUntilExpiration <= 0 && daysUntilAlert <= 0) {
            // handleOpenPopupNewEmployee();
            setIsPasswordExp(true);
          } else if (daysUntilAlert <= 0 && daysUntilExpiration >= 1) {
            setPasswordAlert(false);
            setShowPopup(true);
            setRemainingDays(daysUntilExpiration);
            // handleOpenPopup(true);
          } else if (daysUntilExpiration <= 0) {
            setPasswordAlert(true);
            setShowPopup(true);
            setRemainingDays(0);
          } else {
            setPasswordAlert(false);
            setRemainingDays(daysUntilExpiration);
            setShowPopup(false);
          }
        }
      }
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  // Error Popup model
  const [isErrorOpendialog, setIsErrorOpendialog] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpendialog(true);
  };

  const handleCloseerrtodo = () => {};

  const navigate = useNavigate();

  const buttonStyle = {
    color: 'black',
    '&:hover': {
      backgroundColor: 'transparent',
    },
  };

  //clockout alert
  const [isErrorOpenclockout, setIsErrorOpenclockout] = useState(false);
  const handleClickOpenclockout = () => {
    setIsErrorOpenclockout(true);
  };
  const handleCloseclockout = () => {
    setIsErrorOpenclockout(false);
  };

  const fetchIP = async () => {
    try {
      const response = await axios.get('https://api.ipify.org?format=json');
      setIP(response?.data?.ip);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const isCurrentTimeInShift = async (shifts, servertitme) => {
    if (!shifts) return false; // Return false if shifts array is not provided

    const now = new Date(servertitme);
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentInMinutes = currentHour * 60 + currentMinute;

    for (let shift of shifts) {
      if (!shift.shift) continue; // Skip "Week Off" shifts
      if (shift.shift === 'Week Off') continue; // Skip "Week Off" shifts

      const [startTime, endTime] = shift?.shift?.split('to');

      // Check if the shift starts in PM and ends in AM
      const isStartInPM = startTime.includes('PM');
      const isEndInAM = endTime.includes('AM');

      if (isStartInPM && isEndInAM) {
        // Function to convert time string to hours and minutes
        const parseTime = (time) => {
          if (!time) {
            return { hours: 0, minutes: 0 };
          }
          let [hours, minutes] = time
            ?.match(/(\d+):(\d+)(AM|PM)/)
            ?.slice(1, 3)
            ?.map(Number);
          const period = time.slice(-2);
          if (period === 'PM' && hours !== 12) hours += 12;
          if (period === 'AM' && hours === 12) hours = 0;
          return { hours, minutes };
        };

        // Set start to 12:00AM and use end time from the shift
        const start = parseTime('12:00AM');
        const end = parseTime(endTime);

        // Calculate the start and end times in minutes
        const startInMinutes = start.hours * 60 + start.minutes; // 0 minutes
        const endInMinutes = end.hours * 60 + end.minutes;

        // Check if the current time is between 12:00AM and the shift's end time
        if (currentInMinutes >= startInMinutes && currentInMinutes <= endInMinutes) {
          return true;
        }
      }
    }

    return false; // Return false if no shifts match the conditions
  };

  //  api for  to fetch pagename and username

  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current === false) {
      getapi();
      effectRan.current = true;
    }
    return () => {
      effectRan.current = true;
    };
  }, []);

  const getapi = async () => {
    const currentUrl = window.location.pathname; // Get the current path
    const pathSegments = currentUrl.split('/'); // Split the pathname by '/'
    const lastSegment = pathSegments[pathSegments.length - 1];

    try {
      let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        empcode: String(isUserRoleAccess?.empcode),
        companyname: String(isUserRoleAccess?.companyname),
        pagename: String(lastSegment),
        commonid: String(isUserRoleAccess?._id),
        date: String(new Date()),

        addedby: [
          {
            name: String(isUserRoleAccess?.username),
            date: String(new Date()),
          },
        ],
      });
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [clockinLoader, setClockinLoader] = useState(true);
  const [clockoutLoader, setClockoutLoader] = useState(false);

  const [userShiftDetails, setUserShiftDetails] = useState('');
  const [updatedShiftDetails, setUpdatedShiftDetails] = useState('');
  const [updatedStartShiftDetailsMinus2Hours, setUpdatedStartShiftDetailsMinus2Hours] = useState('');
  const [updatedEndShiftDetailsAdd4Hours, setUpdatedEndShiftDetailsAdd4Hours] = useState('');

  const checkCurrentDate = new Date();
  const [leaveData, setLeaveData] = useState(null);
  const [todayLeave, setTodayLeave] = useState(false);
  const getTodayLeaveData = async () => {
    try {
      let res = await axios.post(SERVICE.GET_LEAVE_DURING_CLOCKIN, {
        employeename: isUserRoleAccess?.companyname,
      });

      setTodayLeave(res?.data?.isinleave);
      if (res?.data?.isinleave) {
        setLeaveData(res.data);
      } else {
        setLeaveData(null);
      }
    } catch (error) {
      console.error('Error checking leave status:', error);
    }
  };
  // get current time
  const currentHours = checkCurrentDate.getHours();
  const currentMinutes = checkCurrentDate.getMinutes();
  // const currentSeconds = checkCurrentDate.getSeconds();

  // Determine whether it's AM or PM
  const currentperiod = currentHours >= 12 ? 'PM' : 'AM';

  // Format the current time manually
  const formattedHours = currentHours % 12 || 12; // Convert 0 to 12 for 12-hour format
  const formattedMinutes = currentMinutes >= 10 ? currentMinutes : '0' + currentMinutes;
  // const formattedSeconds = currentSeconds >= 10 ? currentSeconds : '0' + currentSeconds;
  const currentTime = `${formattedHours}:${formattedMinutes}${currentperiod}`;
  const [shiftMode, setShiftMode] = useState('Main Shift');

  const newcurrentTime = new Date();
  const currentHour = newcurrentTime.getHours();
  const currentMinute = newcurrentTime.getMinutes();
  const period = currentHour >= 12 ? 'PM' : 'AM';

  const convertTo24HourFormat = (time) => {
    let [hours, minutes] = time?.slice(0, -2)?.split(':');
    hours = parseInt(hours, 10);
    if (time?.slice(-2) === 'PM' && hours !== 12) {
      hours += 12;
    }
    return `${String(hours).padStart(2, '0')}:${minutes}`;
  };
  const [weekOffShow, setWeekOffShow] = useState(true);
  const [holidayShow, setHolidayShow] = useState(true);
  const [currentUserShiftName, setCurrentUserShiftName] = useState({});
  const currDate = new Date();
  const currDay = currDate.getDay();

  const [buttonHideShow, setButtonHideShow] = useState([]);
  const [loginuserId, setLoginUserid] = useState('');
  async function fetchCheckinStatus(loginid, shifttime, from) {
    try {
      const res = await axios.post(SERVICE.LOGINOUT_USERID, {
        loginid: loginid,
        shifttime,
      });
      localStorage.setItem('currentaddedshifttime', shifttime);
      let buttonHideShow = res?.data?.attstatus[res?.data?.attstatus?.length - 1];
      await getTodayLeaveData();
      setButtonHideShow(buttonHideShow);
      setLoginUserid(buttonHideShow?._id);
      setClockinLoader(false);

      return buttonHideShow;
    } catch (err) {
      setClockinLoader(false);
    }
  }

  const fetchUsers = async () => {
    try {
      const serverTime = await getCurrentServerTime();
      const currentServerDate = moment(serverTime?.currentNewDate).format('YYYY-MM-DD');
      let { afterAddHours, prevAddHours } = await fetchOverAllSettings();
      var today = new Date(serverTime?.currentNewDate);
      var todayDate = new Date(serverTime?.currentNewDate);
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
      var yyyy = today.getFullYear();
      today = yyyy + '-' + mm + '-' + dd;
      var todayDateFormat = `${dd}/${mm}/${yyyy}`;

      // Get yesterday's date
      var yesterday = new Date(todayDate);
      yesterday.setDate(todayDate.getDate() - 1);
      var ddp = String(yesterday.getDate()).padStart(2, '0');
      var mmp = String(yesterday.getMonth() + 1).padStart(2, '0'); // January is 0!
      var yyyyp = yesterday.getFullYear();

      var yesterdayDate = yyyyp + '-' + mmp + '-' + ddp;
      var yesterdayDateFormat = `${ddp}/${mmp}/${yyyyp}`;

      const currDate = new Date(serverTime?.currentNewDate);
      const currDay = currDate.getDay();
      let startMonthDate = new Date(yesterdayDate);
      let endMonthDate = new Date(today);

      const daysArray = [];

      while (startMonthDate <= endMonthDate) {
        const formattedDate = `${String(startMonthDate.getDate()).padStart(2, '0')}/${String(startMonthDate.getMonth() + 1).padStart(2, '0')}/${startMonthDate.getFullYear()}`;
        const dayName = startMonthDate.toLocaleDateString('en-US', {
          weekday: 'long',
        });
        const dayCount = startMonthDate.getDate();
        const shiftModes = 'Main Shift';

        daysArray.push({ formattedDate, dayName, dayCount, shiftModes });

        // Move to the next day
        startMonthDate.setDate(startMonthDate.getDate() + 1);
      }
      console.log(daysArray, 'daysArray');
      const [res_status, loginusershift] = await Promise.all([
        axios.get(SERVICE.TODAY_HOLIDAY, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
        axios.post(SERVICE.USER_CLOCKIN_CLOCKOUT_STATUS_CHECKLOGIN, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          userDates: daysArray,
          empcode: isUserRoleAccess?.empcode,
        }),
      ]);

      const holidayDate = res_status?.data?.holiday.filter((data, index) => {
        return (
          (data.company.includes(isUserRoleAccess.company) && data.applicablefor.includes(isUserRoleAccess.branch) && data.unit.includes(isUserRoleAccess.unit) && data.team.includes(isUserRoleAccess.team) && data.employee.includes(isUserRoleAccess.companyname)) ||
          (data.company.includes(isUserRoleAccess.company) && data.applicablefor.includes(isUserRoleAccess.branch) && data.unit.includes(isUserRoleAccess.unit) && data.team.includes(isUserRoleAccess.team) && data.employee.includes('ALL'))
        );
      });
      console.log(holidayDate, 'holidayDate');
      const yesrtedayShifts = loginusershift?.data?.finaluser?.filter((data) => data?.formattedDate === yesterdayDateFormat);

      const todayShifts = loginusershift?.data?.finaluser?.filter((data) => data?.formattedDate === todayDateFormat);

      const isInYesterdayShift = await isCurrentTimeInShift(yesrtedayShifts?.length > 0 ? [yesrtedayShifts[yesrtedayShifts?.length - 1]] : [], serverTime?.currentNewDate);

      // const finalShift = isInYesterdayShift ? yesrtedayShifts : todayShifts;

      const findedShift = isInYesterdayShift ? yesrtedayShifts : todayShifts;

      const parseTimeToNumber = (timeStr) => {
        const match = timeStr.match(/^(\d{1,2}):(\d{2})(AM|PM)$/i);
        if (!match) return NaN;

        let [, hour, minute, period] = match;
        hour = parseInt(hour, 10);
        minute = parseInt(minute, 10);
        period = period.toUpperCase();

        if (period === 'PM' && hour !== 12) hour += 12;
        if (period === 'AM' && hour === 12) hour = 0;

        return hour + minute / 60;
      };

      // Step 1: Filter non-empty shifts
      const filtered = findedShift?.filter((item) => item.shift && item.shift.trim() !== '');

      // Step 2: Sort by start time
      const finalShift = filtered.sort((a, b) => {
        const aStart = parseTimeToNumber(a.shift.split('to')[0].trim());
        const bStart = parseTimeToNumber(b.shift.split('to')[0].trim());

        return aStart - bStart;
      });

      const mainshifttimespl = finalShift[0]?.shift != 'Week Off' ? finalShift[0]?.shift?.split('to') : '';
      const secondshifttimespl = finalShift?.length > 1 ? finalShift[1]?.shift?.split('to') : '';

      const getTimeRanges = (timeRange) => {
        const [start, end] = timeRange.split('-');
        return { start, end };
      };
      const isCurrentTimeInRange = (start, end) => {
        const now = moment(serverTime?.currentNewDate);
        // const startTime = moment(start, "hh:mmA");
        // const endTime = moment(end, "hh:mmA");
        const startTime = moment(`${currentServerDate} ${start}`, 'YYYY-MM-DD hh:mmA').subtract(afterAddHours, 'hours');
        const endTime = moment(`${currentServerDate} ${end}`, 'YYYY-MM-DD hh:mmA').add(prevAddHours, 'hours');

        if (endTime.isBefore(startTime)) {
          // Handles overnight ranges
          return now.isBetween(startTime, moment(serverTime?.currentNewDate).endOf('day')) || now.isBetween(moment(serverTime?.currentNewDate).startOf('day'), endTime);
        } else {
          return now.isBetween(startTime, endTime);
        }
      };
      const addHours = (time, hours) => {
        return moment(time, 'hh:mmA').add(hours, 'hours').format('hh:mmA');
      };
      const updatedMainShiftTiming = mainshifttimespl?.length > 0 ? [addHours(mainshifttimespl[0], 0), addHours(mainshifttimespl[1], 0)] : [];
      const updatedSecondShiftTiming = secondshifttimespl?.length > 0 ? [addHours(secondshifttimespl[0], 0), addHours(secondshifttimespl[1], 0)] : [];
      const { start: start1, end: end1 } = getTimeRanges(updatedMainShiftTiming[0] + '-' + updatedMainShiftTiming[1]);
      const { start: start2, end: end2 } = getTimeRanges(updatedSecondShiftTiming[0] + '-' + updatedSecondShiftTiming[1]);
      // const { start: start1, end: end1 } = getTimeRanges(mainshifttimespl[0] + '-' + mainshifttimespl[1]);
      // const { start: start2, end: end2 } = getTimeRanges(secondshifttimespl[0] + '-' + secondshifttimespl[1]);
      let secondshiftmode = finalShift?.length > 1 ? (mainshifttimespl[1] === secondshifttimespl[0] ? 'Continuous Shift' : 'Double Shift') : '';
      console.log(secondshiftmode, 'secondshiftmode');
      const addedFirstShiftInRange = isCurrentTimeInRange(start1, end1, 'three');
      const addedSecondShiftInRange = isCurrentTimeInRange(start2, end2, 'four');
      console.log(addedFirstShiftInRange, 'addedFirstShiftInRange');
      console.log(addedSecondShiftInRange, 'addedSecondShiftInRange');
      let shiftModeClockin = addedSecondShiftInRange ? 'Second Shift' : 'Main Shift';
      console.log(shiftModeClockin, 'shiftModeClockin');
      const isCurrentTimeInRangeNew = (start, end, from) => {
        console.log(start, end, from, 'start, end, from');
        const now = moment(serverTime?.currentNewDate);
        let startTime = moment(start, 'hh:mmA').set({
          year: now.year(),
          month: now.month(),
          date: now.date(),
        });
        let endTime = moment(end, 'hh:mmA').set({
          year: now.year(),
          month: now.month(),
          date: now.date(),
        });

        // If the end time is in AM and before the start time, assume the shift spans overnight
        if (endTime.isBefore(startTime)) {
          endTime.add(1, 'days'); // Treat start time as yesterday
          console.log(startTime, endTime);
        }

        return now.isBetween(startTime, endTime);
      };
      // const isCurrentTimeInRangeNew = (start, end, from) => {
      //   console.log(start, end, from)
      //   const now = moment(serverTime?.currentNewDate);
      //   const nowY = moment(serverTime?.currentNewDate)?.format('YYYY-MM-DD');
      //   let startTime = moment(`${nowY} ${start}`, 'YYYY-MM-DD hh:mmA').set({
      //     year: now.year(),
      //     month: now.month(),
      //     date: now.date(),
      //   });
      //   let endTime = moment(`${nowY} ${end}`, 'YYYY-MM-DD hh:mmA').set({
      //     year: now.year(),
      //     month: now.month(),
      //     date: now.date(),
      //   });

      //   // If the end time is in AM and before the start time, assume the shift spans overnight
      //   if (endTime.isBefore(startTime)) {
      //     endTime.add(1, 'days'); // Treat start time as yesterday
      //   }

      //   return now.isBetween(startTime, endTime);
      // };

      //for continouos shift
      // const addedTimeinFirstShiftStart = moment(`${currentServerDate} ${start1}`, 'YYYY-MM-DD hh:mmA').subtract(afterAddHours, 'hours');
      // const addedTimeinSecondShiftStart = moment(`${currentServerDate} ${start2}`, 'YYYY-MM-DD hh:mmA').subtract(afterAddHours, 'hours');
      // const addedTimeinFirstShiftEnd = moment(`${currentServerDate} ${end1}`, 'YYYY-MM-DD hh:mmA').add(prevAddHours, 'hours');
      // const addedTimeinSecondShiftEnd = moment(`${currentServerDate} ${end2}`, 'YYYY-MM-DD hh:mmA').add(prevAddHours, 'hours');
      //for continouos shift
      const addedTimeinFirstShiftStart = moment(start1, 'hh:mmA').subtract(afterAddHours, 'hours');
      const addedTimeinSecondShiftStart = moment(start2, 'hh:mmA').subtract(afterAddHours, 'hours');
      const addedTimeinFirstShiftEnd = moment(end1, 'hh:mmA').add(prevAddHours, 'hours');
      const addedTimeinSecondShiftEnd = moment(end2, 'hh:mmA').add(prevAddHours, 'hours');
      console.log(addedTimeinFirstShiftStart, 'addedTimeinFirstShiftStart');
      console.log(addedTimeinSecondShiftStart, ' addedTimeinSecondShiftStart,');
      console.log(addedTimeinFirstShiftEnd, '          addedTimeinFirstShiftEnd,');
      console.log(addedTimeinSecondShiftEnd, '          addedTimeinSecondShiftEnd');
      const addedFirstShiftInRangeWithoutGrace = (secondshiftmode === 'Continuous Shift' || secondshiftmode === 'Double Shift') && isCurrentTimeInRangeNew(addedTimeinFirstShiftStart, mainshifttimespl[1], 'onenew');
      const addedSecondShiftInRangeWithoutGrace = (secondshiftmode === 'Continuous Shift' || secondshiftmode === 'Double Shift') && isCurrentTimeInRangeNew(secondshifttimespl[0], addedTimeinSecondShiftEnd, 'twomew');
      console.log(addedFirstShiftInRangeWithoutGrace, 'addedFirstShiftInRangeWithoutGrace');
      console.log(addedSecondShiftInRangeWithoutGrace, 'addedSecondShiftInRangeWithoutGrace');
      let buttonHideShow;
      const isUserData = {
        company: isUserRoleAccess?.company,
        branch: isUserRoleAccess?.branch,
        unit: isUserRoleAccess?.unit,
        team: isUserRoleAccess?.team,
        doj: isUserRoleAccess?.doj,
        companyname: isUserRoleAccess?.companyname,
        designation: isUserRoleAccess?.designation,
        department: isUserRoleAccess?.department,
        userdayshift: finalShift,
        mainshiftname: '',
        mainshifttiming: mainshifttimespl[0] + '-' + mainshifttimespl[1],
        issecondshift: finalShift?.length > 1 ? true : false,
        secondshiftmode: finalShift?.length > 1 ? (mainshifttimespl[1] === secondshifttimespl[0] ? 'Continuous Shift' : 'Double Shift') : '',
        secondshiftname: '',
        secondshifttiming: finalShift?.length > 1 ? secondshifttimespl[0] + '-' + secondshifttimespl[1] : '',
      };
      console.log(finalShift, 'finalShift');
      setUserInfoData(isUserData);
      console.table({
        addedFirstShiftInRangeWithoutGrace,
        addedSecondShiftInRangeWithoutGrace,
        addedFirstShiftInRange,
        addedSecondShiftInRange,
      });

      if (addedFirstShiftInRangeWithoutGrace) {
        console.log('if 1');
        setShiftMode(finalShift[0]?.shiftMode || 'Main Shift');
        setCurrentUserShiftName(finalShift[0]);
        buttonHideShow = await fetchCheckinStatus(isUserRoleAccess?._id, `${moment(addedTimeinFirstShiftStart, 'hh:mmA').format('HH:mm')} - ${moment(mainshifttimespl[1], 'hh:mmA').format('HH:mm')}`, 'one');
        setShiftEndTime(moment(mainshifttimespl[1], 'hh:mmA').format('HH:mm'));
      } else if (addedSecondShiftInRangeWithoutGrace) {
        console.log('if 2');
        setShiftMode(finalShift[1]?.shiftMode || 'Second Shift');
        setCurrentUserShiftName(finalShift[1]);
        buttonHideShow = await fetchCheckinStatus(isUserRoleAccess?._id, `${moment(secondshifttimespl[0], 'hh:mmA').format('HH:mm')} - ${moment(addedTimeinSecondShiftEnd, 'hh:mmA').format('HH:mm')}`, 'two');
        setShiftEndTime(moment(addedTimeinSecondShiftEnd, 'hh:mmA').format('HH:mm'));
      } else if (addedFirstShiftInRange && secondshiftmode !== 'Continuous Shift' && secondshiftmode !== 'Double Shift') {
        console.log('if 3');
        setShiftMode(finalShift[0]?.shiftMode || 'Main Shift');
        setCurrentUserShiftName(finalShift[0]);
        buttonHideShow = await fetchCheckinStatus(isUserRoleAccess?._id, `${moment(addedTimeinFirstShiftStart, 'hh:mmA').format('HH:mm')} - ${moment(addedTimeinFirstShiftEnd, 'hh:mmA').format('HH:mm')}`, 'three');
        setShiftEndTime(moment(addedTimeinFirstShiftEnd, 'hh:mmA').format('HH:mm'));
      } else if (addedSecondShiftInRange && secondshiftmode !== 'Continuous Shift' && secondshiftmode !== 'Double Shift') {
        console.log('if 4');
        setShiftMode(finalShift[1]?.shiftMode || 'Second Shift');
        setCurrentUserShiftName(finalShift[1]);
        buttonHideShow = await fetchCheckinStatus(isUserRoleAccess?._id, `${moment(addedTimeinSecondShiftStart, 'hh:mmA').format('HH:mm')} - ${moment(addedTimeinSecondShiftEnd, 'hh:mmA').format('HH:mm')}`, 'four');
        setShiftEndTime(moment(addedTimeinSecondShiftEnd, 'hh:mmA').format('HH:mm'));
      } else {
        console.log('if 5');
        setButtonHideShow({ buttonname: 'SHIFT CLOSED' });
        setLoginUserid('');
      }
      let buttonName = buttonHideShow?.buttonname;
      if (holidayDate?.some((item) => moment(item.date).format('DD-MM-YYYY') == moment(serverTime?.currentNewDate).format('DD-MM-YYYY'))) {
        console.log('sadjasbndjkasbdajksb');
        setHolidayShow(false);
      } else if (
        // loginusershift?.data?.finaluser[1]?.shift?.includes("Week Off")
        finalShift[0]?.shift === 'Week Off'
      ) {
        setWeekOffShow(false);
      }
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, [isUserRoleAccess]);

  useEffect(() => {
    // Calculate before 2 hours from the user's shift start time
    const userShiftDetailsStartTime = userShiftDetails.match(/\b\d{2}:\d{2}[APMapm]{2}\b/);
    const startTime = userShiftDetailsStartTime ? userShiftDetailsStartTime[0] : '';
    if (startTime) {
      const originalTime = startTime?.slice(0, -2);
      const period = startTime?.slice(-2);

      const [hours, minutes] = originalTime?.split(':').map(Number);

      // Subtract 2 hours
      const newHours = hours - 2;

      // Format the new time manually
      const formattedHours = newHours >= 10 ? newHours : '0' + newHours;
      const newTime = `${formattedHours}:${minutes < 10 ? '0' : ''}${minutes}`;

      setUpdatedShiftDetails(`${newTime}${period}`);
    } else {
      // console.log("Invalid or missing start time in userShiftDetails");
    }

    // Add 10 min to the start time
    const updatedShiftDetailsTime = userShiftDetails?.match(/\b\d{2}:\d{2}[APMapm]{2}\b/);
    const shiftTime = updatedShiftDetailsTime ? updatedShiftDetailsTime[0] : '';

    if (shiftTime) {
      const originalTime = shiftTime?.slice(0, -2);
      const period = shiftTime?.slice(-2);

      const [hours, minutes] = originalTime?.split(':').map(Number);

      // Convert to 24-hour format
      const hours24 = period === 'PM' && hours !== 12 ? hours + 12 : hours;

      // Add 10 minutes
      const newMinutes = minutes + 10;

      // Format the new time manually
      const newHours = hours24 < 10 ? '0' + hours24 : hours24;
      const newTime = `${newHours}:${newMinutes < 10 ? '0' : ''}${newMinutes}`;

      setUpdatedStartShiftDetailsMinus2Hours(`${newTime}${period}`);
    } else {
      // console.log("Invalid or missing shift time in updatedShiftDetails");
    }

    // Calculate before 4 hours from the user's shift end time
    const userShiftDetailsEndTime = userShiftDetails.match(/\b\d{2}:\d{2}[APMapm]{2}\b/g);
    const endTime = userShiftDetailsEndTime ? userShiftDetailsEndTime[1] : '';

    if (endTime) {
      const originalTime = endTime?.slice(0, -2);
      const period = endTime?.slice(-2);

      const [hours, minutes] = originalTime?.split(':').map(Number);

      // Add 4 hours
      const newHours = hours + 4;

      // Format the new time manually
      const formattedHours = newHours >= 10 ? newHours : '0' + newHours;
      const newTime = `${formattedHours}:${minutes < 10 ? '0' : ''}${minutes}:00`;

      setUpdatedEndShiftDetailsAdd4Hours(`${newTime} ${period}`);
    } else {
      // console.log("Invalid or missing end time in userShiftDetails");
    }
  }, [updatedShiftDetails, updatedStartShiftDetailsMinus2Hours, updatedEndShiftDetailsAdd4Hours]);

  const fetchQuickFolderNames = async () => {
    try {
      let res = await axios.get(SERVICE.ALL_FILESHARE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      // await fetchFileLinks();
      let fldrname = res?.data?.fileshare?.filter(
        (item) =>
          item.company === isUserRoleAccess?.company &&
          item.branch.some((data) => data === isUserRoleAccess?.branch) &&
          item.unit.some((data) => data === isUserRoleAccess?.unit) &&
          item.team.some((data) => data === isUserRoleAccess?.team) &&
          item.employeename.some((data) => data === isUserRoleAccess?.companyname)
      );

      setQuickFolderName([
        ...fldrname.map((d) => ({
          ...d,
          url: d.url,
          filename: d.foldername,
        })),
      ]);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [pendingApproval, setPendingApproval] = useState([]);
  const fetchAppovalStatusDocument = async () => {
    try {
      let res = await axios.post(SERVICE.USER_PENDING_APPROVAL_DOCUMENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        companyname: isUserRoleAccess?.companyname,
      });
      const pendingApprovalcount = res?.data?.count;
      if (pendingApprovalcount > 0) {
        setPendingApproval(res?.data?.documentPreparation);
        handleOpenPopupPendingAppDoc();
      }
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  useEffect(() => {
    fetchAppovalStatusDocument();
    fetchUserSurvey();
  }, []);

  const [userSurveyData, setUserSurveyData] = useState([]);
  const [serverDateSS, setServerDateSS] = useState('');
  const [openSurveyPopup, setOpenSurveyPopup] = useState(false);
  const fetchUserSurvey = async () => {
    try {
      let response = await axios.post(
        SERVICE.INDIVIDUAL_USER_SURVEY,
        {
          company: isUserRoleAccess?.company,
          branch: isUserRoleAccess?.branch,
          unit: isUserRoleAccess?.unit,
          team: isUserRoleAccess?.team,
          department: isUserRoleAccess?.department,
          designation: isUserRoleAccess?.designation,
          companyname: isUserRoleAccess?.companyname,
          employeeid: isUserRoleAccess?._id,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      const responseTime = await axios.get(SERVICE.GET_CURRENT_SERVER_TIME);
      const currentServerDate = moment(responseTime?.data?.currentNewDate).format('YYYY-MM-DD');
      setServerDateSS(currentServerDate);
      const resData = response?.data?.individualUserSurvey?.filter((data) => {
        const isUnanswered = !data?.responseexist;
        const isForwarded = data?.teststatus === 'Forwarded';
        const hasValidDates = data?.startdate && data?.enddate;
        const isEmployeeNotInTestDetails = !data?.testdetails?.some((detail) => detail?.employeename === isUserRoleAccess?.companyname);
        const today = new Date(currentServerDate);
        const startDate = new Date(data?.startdate);

        const isStartDateReached = startDate <= today;

        return isUnanswered && isForwarded && hasValidDates && isStartDateReached && isEmployeeNotInTestDetails;
      });
      const count = resData?.length;
      if (count > 0) {
        setUserSurveyData(resData);
        setOpenSurveyPopup(true);
      } else {
        setUserSurveyData([]);
        setOpenSurveyPopup(false);
      }
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const [shiftTimings, setShiftTimings] = useState('');
  const combinedArray = [];

  const [showSnackbar, setShowSnackbar] = useState(false);

  let today;

  const ClockInButton = () => {
    const handleClick = () => {
      setShowSnackbar(true);
      setTimeout(() => {
        setShowSnackbar(false);
      }, 3000);
    };

    const [open, setOpen] = useState(false);

    const checkLeaveBeforeClockIn = async () => {
      try {
        if (todayLeave) {
          setOpen(true); // Open MUI Dialog for confirmation
        } else {
          handleClockIn();
        }
      } catch (error) {
        console.error('Error checking leave status:', error);
      }
    };

    const handleConfirm = async () => {
      setOpen(false); // Close modal before executing further

      if (leaveData?.newData?.length > 0) {
        await Promise.all(
          leaveData.newData.map(async (leave) => {
            await axios.post(SERVICE.APPLYLEAVE_CREATE, { ...leave });
          })
        );
      }

      if (leaveData?.remainingData?.length > 0) {
        await Promise.all(
          leaveData.remainingData.map(async (leave) => {
            await axios.put(`${SERVICE.APPLYLEAVE_SINGLE}/${leave._id}`, { ...leave });
          })
        );
      }

      handleClockIn(); // Proceed with clock-in
    };

    function getCenterTimeAmPm(range) {
      const [start, end] = range.split('to');

      function toMinutes(timeStr) {
        const match = timeStr.match(/(\d{1,2}):(\d{2})(AM|PM)/i);
        if (!match) return null;

        let [_, hour, minute, period] = match;
        hour = parseInt(hour);
        minute = parseInt(minute);

        if (period.toUpperCase() === 'PM' && hour !== 12) hour += 12;
        if (period.toUpperCase() === 'AM' && hour === 12) hour = 0;

        return hour * 60 + minute;
      }

      function toAmPm(minutes) {
        minutes = minutes % (24 * 60); // wrap around 24 hours
        let hours = Math.floor(minutes / 60);
        let mins = minutes % 60;
        const period = hours >= 12 ? 'PM' : 'AM';

        if (hours === 0) hours = 12;
        else if (hours > 12) hours -= 12;

        return `${hours}:${String(mins).padStart(2, '0')}${period}`;
      }

      let startMin = toMinutes(start);
      let endMin = toMinutes(end);

      if (endMin < startMin) {
        endMin += 24 * 60; // span across midnight
      }

      const midMin = Math.floor((startMin + endMin) / 2);

      return toAmPm(midMin);
    }
    function convertToMinutes(timeStr) {
      const match = timeStr.match(/(\d{1,2}):(\d{2})(?::\d{2})?\s?(AM|PM)/i);
      if (!match) return null;

      let [_, hours, minutes, period] = match;
      hours = parseInt(hours);
      minutes = parseInt(minutes);
      if (period.toUpperCase() === 'PM' && hours !== 12) hours += 12;
      if (period.toUpperCase() === 'AM' && hours === 12) hours = 0;

      return hours * 60 + minutes;
    }

    function convertToDateTime(date, timeStr) {
      const match = timeStr.match(/(\d{1,2}):(\d{2})\s?(AM|PM)/i);
      if (!match) return null;

      let [_, hour, minute, period] = match;
      hour = parseInt(hour);
      minute = parseInt(minute);
      if (period.toUpperCase() === 'PM' && hour !== 12) hour += 12;
      if (period.toUpperCase() === 'AM' && hour === 12) hour = 0;

      const dateTime = new Date(date);
      dateTime.setHours(hour);
      dateTime.setMinutes(minute);
      dateTime.setSeconds(0);
      dateTime.setMilliseconds(0);

      return dateTime;
    }
    const handleClockIn = async () => {
      try {
        const serverTime = await getCurrentServerTime();
        const serverDate = new Date(serverTime?.currentNewDate); // include both date and time

        let [startStr, endStr] = currentUserShiftName?.shift.split('to').map((s) => s.trim());

        const shiftStart = convertToDateTime(serverDate, startStr);
        let shiftEnd = convertToDateTime(serverDate, endStr);

        // If shift ends before it starts, it's overnight -> move end time to next day
        const isOvernight = shiftEnd < shiftStart;
        if (isOvernight) {
          shiftEnd.setDate(shiftEnd.getDate() + 1);
        }

        // Calculate midpoint
        const midpoint = new Date((shiftStart.getTime() + shiftEnd.getTime()) / 2);
        if (serverDate > midpoint) {
          // if (serverMinutes > midpointMinutes) {
          setOpenStatusDialog(true);

          // All data controlled by one state object
          setDialogData({
            icon: <ErrorOutlineIcon sx={{ fontSize: 60, color: '#ff9800' }} />,
            title: 'Clock In Restricted',
            message: 'You Have Reached the HalfDay of Shift StartTime, Clockin Restricted! Please Contact Administrator!',
          });
          return;
        }

        const response = await axios.get('https://api.ipify.org?format=json');
        const currentTime = new Date(serverTime?.currentNewDate).toLocaleTimeString();
        const currentDate = new Date(serverTime?.currentNewDate);
        var dd = String(currentDate.getDate()).padStart(2, '0');
        var mm = String(currentDate.getMonth() + 1).padStart(2, '0');
        var yyyy = currentDate.getFullYear();

        today = dd + '-' + mm + '-' + yyyy;
        localStorage.setItem('clockInTime', currentTime);
        localStorage.setItem('IpAddress', response.data.ip);
        localStorage.setItem('clockStatus', 'clockedIn');
        localStorage.setItem('clockInDate', today);
        localStorage.setItem('username', isUserRoleAccess.username);
        localStorage.setItem('buttonstatus', 'true');

        // handleClick();
        const calculatedshiftend = await addFutureTimeToCurrentTime(shiftEndTime, serverTime?.currentNewDate);
        await fetchLoginStatus(calculatedshiftend, serverTime?.currentNewDate);
      } catch (err) {
        handleApiError(err, setShowAlert, handleClickOpenerr);
      }
    };

    function addFutureTimeToCurrentTime(futureTime, servertime) {
      console.log(futureTime, 'futureTime');
      // Parse the future time string into hours and minutes
      const [futureHours, futureMinutes] = futureTime?.split(':').map(Number);

      // Get the current time
      const currentTime = new Date(servertime);

      // Get the current date
      const currentDate = currentTime.getDate();

      // Get the current hours and minutes
      const currentHours = currentTime.getHours();
      const currentMinutes = currentTime.getMinutes();

      // Calculate the time difference
      let timeDifferenceHours = futureHours - currentHours;
      let timeDifferenceMinutes = futureMinutes - currentMinutes;

      // Adjust for negative time difference
      if (timeDifferenceMinutes < 0) {
        timeDifferenceHours--;
        timeDifferenceMinutes += 60;
      }

      // Check if the future time falls on the next day
      if (timeDifferenceHours < 0) {
        // Add 1 day to the current date
        currentTime.setDate(currentDate + 1);
        timeDifferenceHours += 24;
      }

      const newDate = new Date(servertime);
      newDate.setHours(newDate.getHours() + timeDifferenceHours);
      newDate.setMinutes(newDate.getMinutes() + timeDifferenceMinutes);

      return newDate;
    }
    return (
      <>
        {isUserRoleAccess.role.includes('Manager') ? (
          <LoadingButton
            loading={clockinLoader}
            variant="contained"
            className="glow-button"
            onClick={() => {
              checkLeaveBeforeClockIn();
            }}
            size="small"
            sx={{
              marginLeft: '3px',
              fontSize: '11px',
              padding: '4px 8px',
              minWidth: '0px',
              height: '32px',
            }}
          >
            Clock In
          </LoadingButton>
        ) : !isUserRoleAccess.role.includes('Manager') && clockinIPDetails.includes(IP) && weekOffShow && holidayShow && showClockin ? (
          <LoadingButton
            loading={clockinLoader}
            variant="contained"
            className="glow-button"
            onClick={() => {
              checkLeaveBeforeClockIn();
            }}
            size="small"
            sx={{
              marginLeft: '3px',
              fontSize: '11px',
              padding: '4px 8px',
              minWidth: '0px',
              height: '32px',
            }}
          >
            Clock In
          </LoadingButton>
        ) : !isUserRoleAccess.role.includes('Manager') && showButton === 'SHOW' && weekOffShow && holidayShow && showClockin ? (
          <LoadingButton
            loading={clockinLoader}
            variant="contained"
            className="glow-button"
            onClick={() => {
              checkLeaveBeforeClockIn();
            }}
            size="small"
            sx={{
              marginLeft: '3px',
              fontSize: '11px',
              padding: '4px 8px',
              minWidth: '0px',
              height: '32px',
            }}
          >
            Clock In
          </LoadingButton>
        ) : (
          <></>
        )}

        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle sx={{ textAlign: 'center' }}>Leave Confirmation</DialogTitle>

          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <WarningAmberIcon sx={{ fontSize: 50, color: 'orange' }} /> {/* Warning Icon */}
              <Typography variant="body1" sx={{ textAlign: 'center' }}>
                You applied for leave today. Do you want to cancel the leave and clock in?
              </Typography>
            </Box>
          </DialogContent>

          <DialogActions sx={{ justifyContent: 'center' }}>
            {' '}
            {/* Centering Buttons */}
            <Button onClick={() => setOpen(false)} color="secondary" variant="outlined">
              No, Stay on Leave
            </Button>
            <Button onClick={handleConfirm} color="primary" variant="contained" autoFocus>
              Yes, Cancel Leave
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  };

  useEffect(() => {
    fetchClockinDetails();
    fetchPendingTaskCount();
    fetchIP();
    fetchQuickFolderNames();
    fetchChatBoxLink();
    passwordUpdateCheck();
    fetchAllusers();
  }, []);
  const fetchAllusers = async () => {
    try {
      let allusersdata = await axios.get(`${SERVICE.ALLUSERSDATA}`, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      setAllUsersData(allusersdata?.data?.usersstatus);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const fetchClockinDetails = async () => {
    try {
      let response = await axios.get(`${SERVICE.CLOCKINIP}`, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      const selectedBranchData = response?.data?.clockinip?.find((item) => item.branch === isUserRoleAccess.branch);
      let matchinguser = response?.data?.individualsettings?.find((item) => item.companyname.includes(isUserRoleAccess?.companyname));
      let lastIpCheck = matchinguser ? matchinguser?.ipswitch : response?.data?.adminIPswitch;
      let lastMobileCheck = matchinguser ? matchinguser?.mobileipswitch : response?.data?.adminMobileswitch;

      if (lastIpCheck && lastMobileCheck) {
        if (selectedBranchData) {
          setClockinIPDetails(selectedBranchData.ipaddress);
          setShowButton('NOTSHOW');
        } else {
          setClockinIPDetails([]);
          setShowButton('SHOW');
        }
        const handleResize = () => {
          lastMobileCheck ? setShowClockin(window.innerWidth >= 1000) : setShowClockin(true);
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      } else if (lastMobileCheck) {
        setShowButton('SHOW');
        const handleResize = () => {
          lastMobileCheck ? setShowClockin(window.innerWidth >= 1000) : setShowClockin(true);
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      } else if (lastIpCheck) {
        if (selectedBranchData) {
          setClockinIPDetails(selectedBranchData.ipaddress);
          setShowButton('NOTSHOW');
        } else {
          setClockinIPDetails([]);
          setShowButton('SHOW');
        }
        const handleResize = () => {
          lastMobileCheck ? setShowClockin(window.innerWidth >= 1000) : setShowClockin(true);
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      } else {
        setShowButton('SHOW');
      }
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const [pendingTaskCount, setPendingTaskCount] = useState(0);
  const [attendanceDaysTaskCount, setAttendanceDaysTaskCount] = useState(0);
  const [attendanceTaskStatus, setAttendanceTaskStatus] = useState('');
  const fetchPendingTaskCount = async () => {
    try {
      const [response, taskDateCount] = await Promise.all([
        axios.get(`${SERVICE.PENDING_TASK_COUNT}/?username=${isUserRoleAccess?.companyname}`, {
          headers: { Authorization: `Bearer ${auth.APIToken}` },
        }),
        axios.get(`${SERVICE.PENDING_TASK_COUNT_USERNAME}/?username=${isUserRoleAccess?.companyname}`, {
          headers: { Authorization: `Bearer ${auth.APIToken}` },
        }),
      ]);
      setPendingTaskCount(response?.data?.count);
      setAttendanceDaysTaskCount(taskDateCount?.data?.count);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const fetchLoginStatus = async (shitend, servertime) => {
    try {
      let shiftendtiming = currentUserShiftName?.shift != 'Week Off' ? currentUserShiftName?.shift?.split('to') : [];

      let res = await axios.post(SERVICE.LOGINOUT_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        username: String(isUserRoleAccess.username),
        userid: String(isUserRoleAccess._id),
        clockintime: new Date(servertime).toLocaleTimeString(),
        date: localStorage.clockInDate,
        clockinipaddress: localStorage.IpAddress,
        status: true,
        buttonstatus: 'true',
        calculatedshiftend: shitend ?? '',
        shiftname: String(currentUserShiftName?.shift ?? ''),
        autoclockout: Boolean(false),
        shiftendtime: String(shiftendtiming[1] ?? ''),
        shiftmode: String(shiftMode),
        clockouttime: '',
        attendancemanual: Boolean(false),
        weekoffpresentstatus: Boolean(false),
      });
      console.log('triggered');

      setOpenStatusDialog(true);

      // All data controlled by one state object
      setDialogData({
        icon: <CheckCircleIcon sx={{ fontSize: 60, color: '#4caf50' }} />,
        title: 'Clocked In',
        message: 'You have successfully clocked in.',
      });
      // await fetchBackendFilter(isUserRoleAccess._id, calculatedTime, shiftMode);
      await fetchCheckinStatus(isUserRoleAccess._id, localStorage.currentaddedshifttime);

      await fetchtaskandTrainingsTriggered();
    } catch (err) {
      console.log(err, 'err');
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const fetchtaskandTrainingsTriggered = async () => {
    try {
      let res = await axios.post(SERVICE.TASK_FOR_USER_TRIGGERED, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        isUserRoleAccess: userInfoData,
        cin: calculatedTime ? calculatedTime?.clockin : '00',
        cout: calculatedTime ? calculatedTime?.clockout : '00',
        weekOffShow: weekOffShow,
        holidayShow: holidayShow,
        checkShiftTiming: 'Morning',
        userShiftDetails: userInfoData?.mainshifttiming,
      });
    } catch (err) {
      console.log(err, 'errr');
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  let remarkcreate;

  const ClockOutButton = () => {
    const [remark, setRemark] = useState({ reason: '' });
    const handleClockOutlast = async () => {
      try {
        setAttendanceTaskStatus('');
        const serverTime = await getCurrentServerTime();

        const response = await axios.get('https://api.ipify.org?format=json');
        const currentTime = new Date(serverTime?.currentNewDate).toLocaleTimeString();
        const currentDate = new Date(serverTime?.currentNewDate);
        var dd = String(currentDate.getDate()).padStart(2, '0');
        var mm = String(currentDate.getMonth() + 1).padStart(2, '0');
        var yyyy = currentDate.getFullYear();
        today = dd + '-' + mm + '-' + yyyy;
        localStorage.setItem('clockOutTime', currentTime);
        localStorage.setItem('clockStatus', 'clockedOut');
        localStorage.setItem('IpAddress', response.data.ip);
        localStorage.setItem('buttonstatus', 'false');
        sendUpdateClockStatus();
      } catch (err) {
        handleApiError(err, setShowAlert, handleClickOpenerr);
      }
    };

    const handleClockOut = async () => {
      try {
        if (calculatedTime?.tasklimitcount && Number(calculatedTime?.tasklimitcount) !== 0 && pendingTaskCount >= Number(calculatedTime?.tasklimitcount)) {
          setAttendanceTaskStatus('count');
          handleClickOpenRestrictClockout();
        } else if (calculatedTime?.tasklimitcountinday && Number(calculatedTime?.tasklimitcountinday) !== 0 && attendanceDaysTaskCount >= Number(calculatedTime?.tasklimitcountinday)) {
          setAttendanceTaskStatus('days');
          handleClickOpenRestrictClockout();
        } else if (calculatedTime?.tasklimitcount && Number(calculatedTime?.tasklimitcount) !== 0 && pendingTaskCount !== 0 && pendingTaskCount < Number(calculatedTime?.tasklimitcount) && !warningShowed) {
          setAttendanceTaskStatus('count');
          handleClickOpenWarningClockout();
        } else if (calculatedTime?.tasklimitcountinday && Number(calculatedTime?.tasklimitcountinday) !== 0 && attendanceDaysTaskCount !== 0 && attendanceDaysTaskCount < Number(calculatedTime?.tasklimitcountinday) && !warningShowed) {
          setAttendanceTaskStatus('days');
          handleClickOpenWarningClockout();
        } else {
          handleClockOutlast();
        }
      } catch (err) {
        handleApiError(err, setShowAlert, handleClickOpenerr);
      }
    };

    const sendRequest = async () => {
      try {
        combinedArray.map(
          (item) =>
            (remarkcreate = axios.post(SERVICE.REMARK_CREATE, {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
              reason: String(remark.reason),
              taskname: String(item.taskfield != 'testing' ? item.taskname : item.taskname + '(Testing)'),
              date: String(new Date()),
            }))
        );

        handleClockOutlast();
        handleCloseclockout();
        setRemark({ reason: '' });
      } catch (err) {
        handleApiError(err, setShowAlert, handleClickOpenerr);
      }
    };

    return (
      <>
        <>
          {isUserRoleAccess.role.includes('Manager') ? (
            <LoadingButton
              loading={clockoutLoader}
              variant="contained"
              style={{ backgroundColor: 'red' }}
              className="glow-button"
              onClick={handleClockOut}
              size="small"
              sx={{
                marginLeft: '3px',
                fontSize: '11px',
                padding: '4px 8px',
                minWidth: '0px',
                height: '32px',
              }}
            >
              Clock Out
            </LoadingButton>
          ) : !isUserRoleAccess.role.includes('Manager') && clockinIPDetails.includes(IP) && showClockin ? (
            <>
              <LoadingButton
                loading={clockoutLoader}
                variant="contained"
                style={{ backgroundColor: 'red' }}
                className="glow-button"
                onClick={handleClockOut}
                size="small"
                sx={{
                  marginLeft: '3px',
                  fontSize: '11px',
                  padding: '4px 8px',
                  minWidth: '0px',
                  height: '32px',
                }}
              >
                Clock Out
              </LoadingButton>
            </>
          ) : !isUserRoleAccess.role.includes('Manager') && showButton === 'SHOW' && showClockin ? (
            <>
              <LoadingButton
                loading={clockoutLoader}
                variant="contained"
                style={{ backgroundColor: 'red' }}
                className="glow-button"
                onClick={handleClockOut}
                size="small"
                sx={{
                  marginLeft: '3px',
                  fontSize: '11px',
                  padding: '4px 8px',
                  minWidth: '0px',
                  height: '32px',
                }}
              >
                Clock Out
              </LoadingButton>
            </>
          ) : (
            <></>
          )}
        </>
        <Box>
          <Dialog open={isErrorOpenclockout} onClose={handleCloseclockout} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
              <Typography variant="h6">you have a pending task</Typography>
              <Typography style={{ fontWeight: 900 }}>Reason</Typography>
              <TextareaAutosize
                aria-label="maximum height"
                minRows={5}
                style={{ width: '100%' }}
                value={remark.reason}
                onChange={(e) => {
                  setRemark({
                    ...remark,
                    reason: e.target.value,
                  });
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                color="error"
                onClick={(e) => {
                  sendRequest();
                }}
              >
                ok
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </>
    );
  };

  const id = isUserRoleAccess._id;

  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const yesterdayDate = new Date();
  yesterdayDate.setDate(currentDay - 1);

  // const fetchUserDates = async () => {
  //   try {
  //     let response = await axios.get(`${SERVICE.GETUSERDATES}`, {
  //       headers: { Authorization: `Bearer ${auth.APIToken}` },
  //     });
  //     let sortedDates = response?.data?.userbirthday.sort(
  //       (a, b) => new Date(a.dob) - new Date(b.dob)
  //     );
  //     let sortedDoj = response?.data?.userdateofjoining.sort(
  //       (a, b) => new Date(a.doj) - new Date(b.doj)
  //     );
  //     let sortedDom = response?.data?.userdateofmarriage.sort(
  //       (a, b) => new Date(a.dom) - new Date(b.dom)
  //     );
  //     //birthday
  //     if (response?.data?.userbirthday.length != 0) {
  //       const displayDates = sortedDates?.map((item) => {
  //         const itemDate = new Date(item.dob);
  //         const isToday =
  //           itemDate.getDate() === currentDate.getDate() &&
  //           itemDate.getMonth() === currentDate.getMonth() &&
  //           itemDate.getFullYear() === currentDate.getFullYear();
  //         if (isToday) {
  //           return {
  //             companyname: item.companyname,
  //             dob: "Today",
  //             _id: item._id,
  //           };
  //         } else {
  //           const birthdate = itemDate.getDate();
  //           const birthMonth = itemDate.getMonth() + 1;
  //           const birthYear = itemDate.getFullYear();
  //           return {
  //             companyname: item.companyname,
  //             dob: `${birthdate}-${birthMonth}-${birthYear}`,
  //             _id: item._id,
  //           };
  //         }
  //       });
  //       setNoBirthDay(false);
  //       setBirthday(displayDates);
  //     } else {
  //       setBirthday([]);
  //       setNoBirthDay(true);
  //     }
  //     //work anniversary
  //     if (response?.data?.userdateofjoining.length != 0) {
  //       const dojDates = sortedDoj?.map((item) => {
  //         const itemdojDate = new Date(item.doj);
  //         const isTodaydoj =
  //           itemdojDate.getDate() === currentDate.getDate() &&
  //           itemdojDate.getMonth() === currentDate.getMonth() &&
  //           itemdojDate.getFullYear() === currentDate.getFullYear();
  //         if (isTodaydoj) {
  //           return { companyname: item.companyname, doj: "Today" };
  //         } else {
  //           const dojdate = itemdojDate.getDate();
  //           const dojMonth = itemdojDate.getMonth() + 1;
  //           const dojYear = itemdojDate.getFullYear();
  //           return {
  //             companyname: item.companyname,
  //             doj: `${dojdate}-${dojMonth}-${dojYear}`,
  //           };
  //         }
  //       });
  //       setNoWorkAnniversary(false);
  //       setWorkAnniversary(dojDates);
  //     } else {
  //       setWorkAnniversary([]);
  //       setNoWorkAnniversary(true);
  //     }

  //     //marriage anniversary
  //     if (response?.data?.userdateofmarriage.length != 0) {
  //       const domDates = sortedDom?.map((item) => {
  //         const itemdomDate = new Date(item.dom);
  //         const isTodaydom =
  //           itemdomDate.getDate() === currentDate.getDate() &&
  //           itemdomDate.getMonth() === currentDate.getMonth() &&
  //           itemdomDate.getFullYear() === currentDate.getFullYear();
  //         if (isTodaydom) {
  //           return { companyname: item.companyname, dom: "Today" };
  //         } else {
  //           const domdate = itemdomDate.getDate();
  //           const domMonth = itemdomDate.getMonth() + 1;
  //           const domYear = itemdomDate.getFullYear();
  //           return {
  //             companyname: item.companyname,
  //             dom: `${domdate}-${domMonth}-${domYear}`,
  //           };
  //         }
  //       });
  //       setNoMarriageAnniversary(false);
  //       setMarriageAnniversary(domDates);
  //     } else {
  //       setMarriageAnniversary([]);
  //       setNoMarriageAnniversary(true);
  //     }
  //   } catch (err) {
  //     handleApiError(err, setShowAlert, handleClickOpenerr);
  //   }
  // };

  const fetchUserDates = async () => {
    try {
      let response = await axios.get(`${SERVICE.GETUSERDATES}`, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      let sortedDates = response?.data?.userbirthday.sort((a, b) => new Date(a.dob) - new Date(b.dob));
      let sortedDoj = response?.data?.userdateofjoining.sort((a, b) => new Date(a.doj) - new Date(b.doj));
      let sortedDom = response?.data?.userdateofmarriage.sort((a, b) => new Date(a.dom) - new Date(b.dom));
      //birthday
      if (response?.data?.userbirthday.length != 0) {
        const displayDates = sortedDates?.map((item) => {
          const itemDate = new Date(item.dob);
          const isToday = itemDate.getDate() === currentDate.getDate() && itemDate.getMonth() === currentDate.getMonth() && itemDate.getFullYear() === currentDate.getFullYear();
          if (isToday) {
            return {
              companyname: item.companyname,
              dob: 'Today',
              profileimage: item.profileimage,

              _id: item._id,
            };
          } else {
            const birthdate = itemDate.getDate();
            const birthMonth = itemDate.getMonth() + 1;
            const birthYear = itemDate.getFullYear();
            return {
              companyname: item.companyname,
              profileimage: item.profileimage,
              dob: `${birthdate}-${birthMonth}-${birthYear}`,
              _id: item._id,
            };
          }
        });
        setNoBirthDay(false);
        setBirthday(displayDates);
      } else {
        setBirthday([]);
        setNoBirthDay(true);
      }
      //work anniversary
      if (response?.data?.userdateofjoining.length != 0) {
        const dojDates = sortedDoj?.map((item) => {
          const itemdojDate = new Date(item.doj);
          const isTodaydoj = itemdojDate.getDate() === currentDate.getDate() && itemdojDate.getMonth() === currentDate.getMonth() && itemdojDate.getFullYear() === currentDate.getFullYear();
          if (isTodaydoj) {
            return { companyname: item.companyname, doj: 'Today' };
          } else {
            const dojdate = itemdojDate.getDate();
            const dojMonth = itemdojDate.getMonth() + 1;
            const dojYear = itemdojDate.getFullYear();
            return {
              companyname: item.companyname,
              doj: `${dojdate}-${dojMonth}-${dojYear}`,
            };
          }
        });
        setNoWorkAnniversary(false);
        setWorkAnniversary(dojDates);
      } else {
        setWorkAnniversary([]);
        setNoWorkAnniversary(true);
      }

      //marriage anniversary
      if (response?.data?.userdateofmarriage.length != 0) {
        const domDates = sortedDom?.map((item) => {
          const itemdomDate = new Date(item.dom);
          const isTodaydom = itemdomDate.getDate() === currentDate.getDate() && itemdomDate.getMonth() === currentDate.getMonth() && itemdomDate.getFullYear() === currentDate.getFullYear();
          if (isTodaydom) {
            return { companyname: item.companyname, dom: 'Today' };
          } else {
            const domdate = itemdomDate.getDate();
            const domMonth = itemdomDate.getMonth() + 1;
            const domYear = itemdomDate.getFullYear();
            return {
              companyname: item.companyname,
              dom: `${domdate}-${domMonth}-${domYear}`,
            };
          }
        });
        setNoMarriageAnniversary(false);
        setMarriageAnniversary(domDates);
      } else {
        setMarriageAnniversary([]);
        setNoMarriageAnniversary(true);
      }
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    fetchUserDates();
  }, []);

  let getCloutToday;
  const sendUpdateClockStatus = async () => {
    setClockoutLoader(true);
    try {
      const serverTime = await getCurrentServerTime();

      const currentDate = new Date(serverTime?.currentNewDate);

      const currentTime = new Date(serverTime?.currentNewDate).toLocaleTimeString();
      localStorage.setItem('clockOutTime', currentTime);
      var dd = String(currentDate.getDate()).padStart(2, '0');
      var mm = String(currentDate.getMonth() + 1).padStart(2, '0');
      var yyyy = currentDate.getFullYear();

      getCloutToday = dd + '-' + mm + '-' + yyyy;
      let res = await axios?.put(`${SERVICE.LOGINOUT_SINGLE}/${loginuserId}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        clockouttime: localStorage.clockOutTime.toUpperCase(),
        clockoutipaddress: localStorage.IpAddress,
        buttonstatus: 'false',
        autoclockout: Boolean(false),
        attendancemanual: Boolean(false),
        weekoffpresentstatus: Boolean(false),
        ckoutstatus: 'home',
      });
      // await fetchBackendFilter(
      //   isUserRoleAccess?._id,
      //   calculatedTime,
      //   shiftMode
      // );

      setOpenStatusDialog(true);

      // All data controlled by one state object
      setDialogData({
        icon: <LogoutIcon sx={{ fontSize: 60, color: '#f44336' }} />,
        title: 'Clocked Out',
        message: 'You have successfully clocked out.',
      });
      await fetchCheckinStatus(isUserRoleAccess._id, localStorage.currentaddedshifttime);
      setClockoutLoader(false);
      handleCloseerrtodo();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const ClockComponent = () => {
    return (
      <>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            width: '90px',
          }}
        >
          {buttonHideShow?.buttonname === 'CLOCKOUT' || (localStorage.buttonstatus === 'true' && isUserRoleAccess.username === localStorage.username) ? (
            <Grid
              item
              xs={12}
              md={12} // Adjust for smaller screens
              sx={{
                textAlign: 'center',
                width: '90px',
                marginRight: {
                  xs: 0, // No margin on extra small screens
                  sm: '500px', // Margin for small screens
                  md: '350px', // Default margin for medium screens
                  lg: '500px', // Margin for large screens
                  '@media (min-width: 900px) and (max-width: 1300px)': {
                    marginRight: '550px', // Custom margin for 900px-1300px screens
                  },
                },
              }}
              // sx={{ textAlign: "center", marginRight: "150px" }}
            >
              {' '}
              <ClockOutButton />{' '}
            </Grid>
          ) : buttonHideShow?.buttonname === 'SHIFT CLOSED' || (localStorage.buttonstatus === 'false' && isUserRoleAccess.username === localStorage.username) ? (
            <>
              <Grid item md={12} sx={{ textAlign: 'center' }}>
                {!weekOffShow ? (
                  <Button variant="contained" color="success">
                    WEEKOFF
                  </Button>
                ) : (
                  <Typography sx={{ fontSize: '18PX' }}>Shift Closed</Typography>
                )}
              </Grid>
            </>
          ) : (
            <>
              <Grid
                item
                md={12}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between', // Separate buttons horizontally
                  alignItems: 'center',
                  cursor: 'pointer',
                  gap: 2,
                }}
              >
                <ClockInButton />
              </Grid>
            </>
          )}
        </Grid>

        <div className="snackbar-container">
          {showSnackbar && (
            <div className="snackbar">
              <span>You have Clocked in</span>
            </div>
          )}
        </div>
      </>
    );
  };

  //also call this function in
  const fetchChatBoxLink = async () => {
    try {
      let res = await axios.get(`${SERVICE.GET_OVERALL_SETTINGS}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setChatBoxLink(res?.data?.overallsettings[res?.data?.overallsettings.length - 1]?.chatboxlink);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const fetchOverAllSettings = async () => {
    try {
      let response = await axios.get(`${SERVICE.GET_ATTENDANCE_CONTROL_CRITERIA}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const attendanceExtraTime = response?.data?.attendancecontrolcriteria?.length > 0 ? response?.data?.attendancecontrolcriteria[response?.data?.attendancecontrolcriteria?.length - 1] : '';

      setCalculatedTime(attendanceExtraTime);
      const prevAddHours = attendanceExtraTime ? Number(attendanceExtraTime?.clockout) : 0;
      const afterAddHours = attendanceExtraTime ? Number(attendanceExtraTime?.clockin) : 0;

      setStartTime(afterAddHours);
      setEndTime(prevAddHours);

      return { afterAddHours, prevAddHours };
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const getGreeting = () => {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
      return 'Good Morning';
    } else if (currentHour >= 12 && currentHour < 16) {
      return 'Good Afternoon';
    } else if (currentHour >= 16 && currentHour < 22) {
      return 'Good Evening';
    } else {
      return 'Welcome';
    }
  };

  return (
    <>
      <Box
        sx={{
          marginTop: {
            md: '-25px',
            sm: '0px',
            xs: '0px',
          },
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} sm={12}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                display: 'flex',
                justifyContent: 'flex-start',
                fontSize: {
                  xs: '1rem', // Font size for extra small screens
                  sm: '1.25rem', // Font size for small screens
                  md: '1.5rem', // Font size for medium screens (default)
                },
              }}
            >
              {getGreeting()}! {isUserRoleAccess?.username}
            </Typography>
            <b style={{ color: 'red' }}>Shift: {currentUserShiftName?.shift}</b>
          </Grid>
          <Grid item sx={{ display: 'flex' }} xs={12} md={6} sm={12}>
            &nbsp;&nbsp;&nbsp;
            {!holidayShow ? (
              <Button variant="contained" color="success" size="small">
                HOLIDAY
              </Button>
            ) : (
              <ClockComponent />
            )}
            &nbsp;&nbsp;&nbsp; &nbsp;
            {/* server time */}
            {isUserRoleAccess?.role?.includes('Manager') && <Servertime />}
          </Grid>
        </Grid>
      </Box>
      <>
        <br />
        <br />
        <br />
        <br />
        <br />
        <Homelayout />
      </>

      {/* chatbox icon */}
      <Box>
        <Link to={chatBoxLink} target="_blank">
          <Button
            variant="contained"
            sx={{
              position: 'fixed',
              bottom: showScroll === false ? '6.5rem' : '10.5rem',
              right: '2rem',
              height: '4rem',
              width: '4rem',
              fontSize: '5rem',
              borderRadius: '50%',
              cursor: 'pointer',
              transition: 'margin-top 1s ease',
            }}
          >
            <ChatIcon style={{ fontSize: '2rem', color: 'white' }} />
          </Button>
        </Link>
      </Box>
      <Box>
        <Link to="/tickets/raiseticketmaster" target="_blank">
          <Button
            variant="contained"
            sx={{
              position: 'fixed',
              bottom: '2rem',
              left: '2rem',
              height: '4rem',
              width: '4rem',
              fontSize: '5rem',
              borderRadius: '50%',
              cursor: 'pointer',
            }}
          >
            <SupportAgentRoundedIcon style={{ fontSize: '2rem', color: 'white' }} />
          </Button>
        </Link>
      </Box>

      <Box>
        <Button
          variant="contained"
          sx={{
            // position: "fixed",
            // bottom: "6.5rem",
            // right: "2rem",
            // height: "4rem",
            // width: "4rem",
            // fontSize: "5rem",
            // borderRadius: "50%",
            // cursor: "pointer",
            // marginTop: "5px",
            position: 'fixed',
            bottom: '6.5rem',
            left: '2rem',
            height: '4rem',
            width: '4rem',
            fontSize: '5rem',
            borderRadius: '50%',
            cursor: 'pointer',
          }}
          onClick={() => handleClickOpenQuickLinkview()}
        >
          <DriveFileMoveRoundedIcon style={{ fontSize: '2rem', color: 'white' }} />
        </Button>
      </Box>
      <Grid container spacing={2}>
        {/* <Grid item md={4} xs={12} sm={12}>
          <Box sx={userStyle?.homepagecontainer}>
            <Grid
              container
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">This Week Birthdays</Typography>
              <Button
                sx={buttonStyle}
                onClick={() => navigate("/calendarview")}
                onMouseEnter={() => {
                  document.getElementById(
                    "birthday-icon-gif"
                  ).style.visibility = "visible";
                  document.getElementById(
                    "birthday-icon-img"
                  ).style.visibility = "hidden";
                }}
                onMouseLeave={() => {
                  document.getElementById(
                    "birthday-icon-gif"
                  ).style.visibility = "hidden";
                  document.getElementById(
                    "birthday-icon-img"
                  ).style.visibility = "visible";
                }}
              >
                <img
                  id="birthday-icon-img"
                  src={birthdayiconimg}
                  alt="Birthday Icon Image"
                  style={{
                    width: "46px",
                    height: "auto",
                    fontWeight: "bold",
                    visibility: "visible",
                    position: "absolute",
                  }}
                />
                <img
                  id="birthday-icon-gif"
                  src={birthdayicongif}
                  alt="Birthday Icon Gif"
                  style={{
                    width: "46px",
                    height: "auto",
                    fontWeight: "bold",
                    visibility: "hidden",
                    position: "absolute",
                  }}
                />
              </Button>
            </Grid>
            <br />
            <hr />
            <br />
            {true ? (
              <>
                {!noBirthDay ? (
                  <ol>
                    {birthday?.map((item, index) => (
                      <>
                        <Grid container key={index} alignItems="center">
                          <Grid item xs={8}>
                            <Typography
                              style={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                maxWidth: "100%",
                              }}
                              title={item?.companyname}
                            >
                              <Link
                                to={`/birthdaycard/?name=${
                                  item?.companyname
                                }&id=${item?._id}&status=${true}`}
                                target="_blank"
                                style={{
                                  textDecoration: "none",
                                  color: "#616161",
                                }}
                              >
                                {index + 1}.{item?.companyname}
                              </Link>
                            </Typography>
                          </Grid>

                          <Grid item xs={1}>
                            <Typography>-</Typography>
                          </Grid>
                          <Grid item xs={3}>
                            <Typography>{item?.dob}</Typography>
                          </Grid>
                        </Grid>
                        <br />
                      </>
                    ))}
                  </ol>
                ) : (
                  <>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                      }}
                    >
                      <img src={celebration} />

                      <br />
                      <Typography> No Birthdays this Week</Typography>
                    </Box>
                  </>
                )}
              </>
            ) : null}
          </Box>
        </Grid>
        <Grid item md={4} xs={12} sm={12}>
          <Box sx={userStyle?.homepagecontainer}>
            <Grid
              container
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">This Week Work Anniversary</Typography>
              <Button
                sx={buttonStyle}
                onClick={() => navigate("/calendarview")}
              >
                <WorkIcon />
              </Button>
            </Grid>
            <br />
            <hr />
            <br />
            {true ? (
              <>
                {!noWorkAnniversary ? (
                  <ol>
                    {workAnniversary?.map((item, index) => (
                      <>
                        <Grid container key={index} alignItems="center">
                          <Grid item xs={8}>
                            <Typography
                              style={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                maxWidth: "100%",
                              }}
                              title={item?.companyname}
                            >
                              {index + 1}.{item?.companyname}
                            </Typography>
                          </Grid>
                          <Grid item xs={1}>
                            <Typography>-</Typography>
                          </Grid>
                          <Grid item xs={3}>
                            <Typography>{item?.doj}</Typography>
                          </Grid>
                        </Grid>
                        <br />
                      </>
                    ))}
                  </ol>
                ) : (
                  <>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                      }}
                    >
                      <img src={celebration} />
                      <br />
                      <Typography> No Work Anniversary this Week</Typography>
                    </Box>
                  </>
                )}
              </>
            ) : null}
          </Box>
        </Grid>
        <Grid item md={4} xs={12} sm={12}>
          <Box sx={userStyle?.homepagecontainer}>
            <Grid
              container
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">
                This Week Wedding Anniversary
              </Typography>
              <Button
                sx={buttonStyle}
                onClick={() => navigate("/calendarview")}
              >
                <FavoriteIcon />
              </Button>
            </Grid>
            <br />
            <hr />
            <br />
            {true ? (
              <>
                {!noMarriageAnniversary ? (
                  <ol>
                    {marriageAnniversary?.map((item, index) => (
                      <>
                        <Grid container key={index} alignItems="center">
                          <Grid item xs={8}>
                            <Typography
                              style={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                maxWidth: "100%",
                              }}
                              title={item?.companyname}
                            >
                              {index + 1}.{item?.companyname}
                            </Typography>
                          </Grid>
                          <Grid item xs={1}>
                            <Typography> - </Typography>
                          </Grid>
                          <Grid item xs={3}>
                            <Typography>{item?.dom}</Typography>
                          </Grid>
                        </Grid>
                        <br />
                      </>
                    ))}
                  </ol>
                ) : (
                  <>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                      }}
                    >
                      <img src={celebration} />
                      <br />
                      <Typography> No Wedding Anniversary this Week</Typography>
                    </Box>
                  </>
                )}
              </>
            ) : null}
          </Box>
        </Grid> */}
        <HomeBirthday />
      </Grid>

      {/* quick links popup */}
      <Dialog maxWidth="sm" open={openQuickLink} onClose={handleCloseQuickLinkview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <Box sx={{ width: '400px', padding: '20px 50px' }}>
          <>
            <Grid container spacing={2}>
              <Grid item md={11} sm={11} xs={11}>
                <Typography sx={userStyle.HeaderText}> Quick Folder Links</Typography>
              </Grid>
              <Grid item md={1} sm={1} xs={1}>
                <IconButton edge="end" color="inherit" onClick={handleCloseQuickLinkview} aria-label="close">
                  <CloseIcon />
                </IconButton>
              </Grid>
            </Grid>
            <br /> <br />
            <Grid container spacing={2}>
              <Box>
                {true ? (
                  <>
                    {quickFolderName?.length > 0 ? (
                      <ol>
                        {quickFolderName?.map((item, index) => (
                          <>
                            <Grid item md={12} sm={12} xs={12}>
                              {index + 1}.&nbsp;
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  color: 'blue',
                                  textDecoration: 'none',
                                }}
                              >
                                {item.filename}
                              </a>
                            </Grid>
                            <br />
                          </>
                        ))}
                      </ol>
                    ) : (
                      <>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <Typography>!! Not Yet Shared, Contact Administration !!</Typography>
                        </Box>
                      </>
                    )}
                  </>
                ) : null}
              </Box>
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Button variant="contained" color="primary" onClick={handleCloseQuickLinkview} sx={{ marginLeft: '15px' }}>
                Back
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>
      {/* Password alert box */}
      <Dialog
        // open={showPopup}
        open={showPopup}
        onClose={handleClosePopup}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="sm"
        fullWidth={true}
      >
        <Box
          sx={{
            padding: '10px 15px',
            textAlign: 'center',
            alignItems: 'center',
          }}
        >
          <>
            <DialogTitle id="alert-dialog-title">
              <h3>Password Update Reminder</h3>
            </DialogTitle>{' '}
            <br />
            {/* <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}> */}
            <DialogContentText
              id="alert-dialog-description"
              sx={{
                fontSize: '1.25rem',
                textAlign: 'center',
                alignItems: 'center',
              }}
            >
              <b style={{ color: 'orange' }}>
                {' '}
                {passwordAlert ? (
                  'Password update needed'
                ) : (
                  <span style={{ fontWeight: '700', color: 'black' }}>
                    {`Your Login Password Will Expire on`}
                    &nbsp;
                    <span style={{ fontWeight: 'bold', color: 'red' }}>{`${reminderDate}`}</span>
                    &nbsp;
                    {`Please ChangeYour Login Password For Uninterrupted Access`}
                  </span>
                )}
              </b>
            </DialogContentText>
            <br></br>
            {/* </DialogContent> */}
            <DialogActions
              sx={{
                fontSize: '1.25rem',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Button onClick={handleClosePopup} variant="contained" color="error" sx={buttonStyles?.buttonsubmit} autoFocus>
                <Link to={`/profile/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  Change Now
                </Link>
              </Button>
              <Button onClick={handleClosePopup} variant="contained" color="error" sx={buttonStyles?.btncancel} autoFocus>
                Change Later
              </Button>
            </DialogActions>
          </>
        </Box>
      </Dialog>

      {/* Password alert box */}
      {/* <Dialog
        // open={showPopup}
        open={showPopupNewEmployee}
        // onClose={handleClosePopupNewEmployee}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="sm"
        fullWidth={true}
        sx={{
          zIndex: 5000, // Ensure the Dialog itself has a high z-index
        }}
      >
        <Box
          sx={{
            padding: "10px 15px",
            textAlign: "center",
            alignItems: "center",
          }}
        >
          <>
            <DialogTitle id="alert-dialog-title">
              <h3>Password Update Reminder</h3>
            </DialogTitle>{" "}
            <br />
            {/* <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}> 
            <DialogContentText
              id="alert-dialog-description"
              sx={
                {
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  zIndex: 5000,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white",
                  fontSize: "24px",
                }
              }
            >
              {isPasswordExp ?
                <b style={{ color: "orange" }}>
                  You Need To Update Password
                </b> :
                <span style={{ fontWeight: "700", color: "orange" }}>
                  {`New Employee Password Update`}
                  &nbsp;
                </span>

              }
            </DialogContentText>
            {/* </DialogContent> 
            <br></br>
            <DialogActions
              sx={{
                fontSize: "1.25rem",
                display: "flex",
                justifyContent: "end",
              }}
            >
              <Link to={`/profile/${id}`}
              >
                <Button
                  onClick={handleClosePopupNewEmployee}
                  color="primary"
                  sx={buttonStyles?.buttonsubmit}
                  autoFocus
                >
                  Update Now
                </Button>
              </Link>
            </DialogActions>
          </>
        </Box>
      </Dialog> */}
      {/* {isPasswordExp && ( */}
      <Dialog
        // open={false}
        open={showPopupNewEmployee}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="sm"
        fullWidth={true}
        sx={{
          zIndex: 5000, // Ensure the Dialog itself has a high z-index
        }}
      >
        <Box
          sx={{
            padding: '10px 15px',
            textAlign: 'center',
            alignItems: 'center',
          }}
        >
          <>
            <DialogTitle id="alert-dialog-title">
              <h3>Password Update Reminder</h3>
            </DialogTitle>
            <br />
            <DialogContentText
              id="alert-dialog-description"
              sx={{
                padding: '10px 15px',
                textAlign: 'center',
                alignItems: 'center',
              }}
            >
              {isPasswordExp ? (
                <span
                  style={{
                    fontWeight: '700',
                    color: 'orange',
                    fontSize: '1.25rem',
                    fontSize: '1.25rem',
                  }}
                >
                  {`You Need To Update Password, Your Login Password Was Expired`}
                  &nbsp;
                </span>
              ) : (
                <span
                  style={{
                    fontWeight: '700',
                    color: 'orange',
                    fontSize: '1.25rem',
                    fontSize: '1.25rem',
                  }}
                >
                  {`New Employee Password Update`}
                  &nbsp;
                </span>
              )}
            </DialogContentText>
            <br />
            <DialogActions
              sx={{
                fontSize: '1.25rem',
                display: 'flex',
                justifyContent: 'end',
              }}
            >
              <Link to={`/profile/${id}/passupdate`}>
                <Button onClick={handleClosePopupNewEmployee} color="primary" sx={buttonStyles?.buttonsubmit} autoFocus>
                  Update Now
                </Button>
              </Link>
            </DialogActions>
          </>
        </Box>
      </Dialog>
      {/* )} */}
      <Dialog
        // open={false}
        open={showPopupPendingAppDoc}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="sm"
        fullWidth={true}
        sx={{
          zIndex: 5000, // Ensure the Dialog itself has a high z-index
        }}
      >
        <Box
          sx={{
            padding: '10px 15px',
            textAlign: 'center',
            alignItems: 'center',
          }}
        >
          <>
            <DialogTitle id="alert-dialog-title">
              <h3>Document Approval Remainder</h3>
            </DialogTitle>
            <br />
            <DialogContentText
              id="alert-dialog-description"
              sx={{
                padding: '10px 15px',
                textAlign: 'center',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  fontWeight: '700',
                  color: 'orange',
                  fontSize: '1.25rem',
                  fontSize: '1.25rem',
                }}
              >
                {`You have documents pending approval. Review the list below and click 'Go to Document' to proceed.`}
                &nbsp;
              </span>
              <br />
              <div
                style={{
                  maxHeight: '150px', // Fixed height to accommodate 3 items (adjust as needed)
                  overflowY: 'auto', // Enable vertical scrolling if content exceeds height
                  paddingRight: '5px', // Prevent scrollbar from overlapping content
                }}
              >
                {pendingApproval?.map((data, index) => {
                  return (
                    <div
                      key={data?._id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '8px',
                        minHeight: '40px',
                      }}
                    >
                      <span
                        style={{
                          fontWeight: '150',
                          color: data?.remainingDays <= 1 ? 'red' : 'black',
                          fontSize: '0.70rem',
                          flex: 1,
                        }}
                      >
                        {index + 1}. {data?.documentname} - Remaining Days: {data?.remainingDays} day(s)
                      </span>
                      <Button variant="contained" color="primary" size="small" onClick={() => (window.location.href = `${BASE_URL}/employeedocumentsapproval/${data?._id}`)} style={{ marginLeft: '5px', padding: '4px 8px', fontSize: '0.8rem' }}>
                        Go to Document
                      </Button>
                    </div>
                  );
                })}
              </div>
            </DialogContentText>
            <br />
            {pendingApproval?.every((data) => data?.remainingDays >= 1) && (
              <DialogActions
                sx={{
                  fontSize: '1.25rem',
                  display: 'flex',
                  justifyContent: 'end',
                }}
              >
                <Button onClick={handleClosePopupPendingAppDoc} variant="contained" color="error" sx={buttonStyles?.btncancel} autoFocus>
                  Approve Later
                </Button>
              </DialogActions>
            )}
          </>
        </Box>
      </Dialog>
      {/* More than 100 pending task clock out restriction dialog box */}
      <Dialog open={openRestrictClockout} onClose={handleClickCloseRestrictClockout} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="xs" fullWidth>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mt: 2,
          }}
        >
          <BlockIcon sx={{ fontSize: 40, marginRight: '10px', color: 'red' }} />
          <DialogTitle id="alert-dialog-title">
            <b style={{ fontWeight: '800', color: 'red' }}> Clock Out Restricted</b>
          </DialogTitle>
        </Box>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            sx={{
              textAlign: 'center',
            }}
          >
            <b>You have more than {attendanceTaskStatus === 'days' ? `${calculatedTime?.tasklimitcountinday}  days of` : calculatedTime?.tasklimitcount} pending tasks. Please complete the tasks and clock out.</b>{' '}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickCloseRestrictClockout} variant="contained" color="error">
            OK
          </Button>
        </DialogActions>
      </Dialog>
      {/* less than 100 pending task clock out warning dialog box */}

      <Dialog open={openWarningClockout} onClose={handleClickCloseWarningClockout} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="xs" fullWidth>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mt: 2,
          }}
        >
          <WarningIcon color="warning" sx={{ fontSize: 40, marginRight: '10px' }} />
          <DialogTitle id="alert-dialog-title">
            <b style={{ fontWeight: '800', color: '#ed6c02' }}>Pending Task Warning</b>
          </DialogTitle>
        </Box>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            sx={{
              textAlign: 'center',
            }}
          >
            <b>{`You have ${pendingTaskCount} pending tasks. Please try to complete as soon as possible.`}</b>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickCloseWarningClockout} variant="contained" color="warning">
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openStatusDialog} onClose={() => setOpenStatusDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', pb: 0 }}>{dialogData.icon}</DialogTitle>
        <DialogContent sx={{ textAlign: 'center' }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {dialogData.title}
          </Typography>
          <Typography variant="body1">{dialogData.message}</Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button variant="contained" onClick={() => setOpenStatusDialog(false)} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
      <UserSurveyDialog open={openSurveyPopup} onClose={() => setOpenSurveyPopup(false)} surveyData={userSurveyData} serverDate={serverDateSS} employeeData={isUserRoleAccess} getCurrentServerTime={getCurrentServerTime} fetchUserSurvey={fetchUserSurvey} />
    </>
  );
};

export default Home;
