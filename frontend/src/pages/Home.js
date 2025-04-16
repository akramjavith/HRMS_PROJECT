import React, { useState, useEffect, useContext, useRef } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  Button, Avatar, Tooltip, Chip,
  DialogActions,
  DialogTitle,
  DialogContentText,
  Grid,
  Typography,
  TextareaAutosize,
} from "@mui/material";
import { userStyle } from "../pageStyle";
import axios from "axios";
import { SERVICE } from "../services/Baseservice";
import { Link } from "react-router-dom";
import { handleApiError } from "../components/Errorhandling";
import { format, addDays, differenceInDays } from "date-fns";
import { UserRoleAccessContext, AuthContext } from "../context/Appcontext";
import ChatIcon from "@mui/icons-material/Chat";
import DriveFileMoveRoundedIcon from "@mui/icons-material/DriveFileMoveRounded";
import celebration from "../images/celebration.png";
import birthdayicongif from "../images/birthdayicongif.gif";
import birthdayiconimg from "../images/birthdayiconimg.png";
import WorkIcon from "@mui/icons-material/Work";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import { useNavigate } from "react-router-dom";
import moment from "moment-timezone";
import LoadingButton from "@mui/lab/LoadingButton";
import BlockIcon from "@mui/icons-material/Block";
import WarningIcon from "@mui/icons-material/Warning";
import Homelayout from "./Homelayout";
import HomeBirthday from "./HomeBirthday";

const Home = () => {
  //in work anniversary/birthday reminder/

  const [birthday, setBirthday] = useState();
  const [noBirthDay, setNoBirthDay] = useState();

  const [workAnniversary, setWorkAnniversary] = useState();
  const [noWorkAnniversary, setNoWorkAnniversary] = useState();

  const [marriageAnniversary, setMarriageAnniversary] = useState();
  const [noMarriageAnniversary, setNoMarriageAnniversary] = useState();

  const [showClockin, setShowClockin] = useState(true);

  const [IP, setIP] = useState("");
  const [clockinIPDetails, setClockinIPDetails] = useState([]);
  const [showButton, setShowButton] = useState("");

  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [calculatedTime, setCalculatedTime] = useState();
  const [shiftEndTime, setShiftEndTime] = useState();

  //chatbot
  const [chatBoxLink, setChatBoxLink] = useState("");
  const { auth } = useContext(AuthContext);

  const { isUserRoleAccess, setAllUsersData } = useContext(
    UserRoleAccessContext
  );
  // console.log(isUserRoleAccess, "jkgbkjbdsa");

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

  const [passwordAlert, setPasswordAlert] = useState(false);

  const passwordUpdateCheck = async () => {
    try {
      let response = await axios.get(
        `${SERVICE.USER_SINGLE}/${isUserRoleAccess._id}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );

      const lastUpdateDate = new Date(response?.data?.suser?.createdAt);
      const nextReminderDate = addDays(lastUpdateDate, 90);
      const passwordCheck = response?.data?.suser?.passexpdate
        ? new Date(response?.data?.suser?.passexpdate)
        : nextReminderDate;

      const today = new Date();
      const daysRemaining = differenceInDays(passwordCheck, today);
      if (daysRemaining <= 0) {
        setPasswordAlert(true);
        setShowPopup(true);
      } else {
        setPasswordAlert(false);
        setRemainingDays(daysRemaining);
        setShowPopup(true); // Show the popup
        handleOpenPopup(true);
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
    setClockinLoader(false);
    setIsErrorOpendialog(true);
  };

  const handleCloseerrtodo = () => { };

  const navigate = useNavigate();

  const buttonStyle = {
    color: "black",
    "&:hover": {
      backgroundColor: "transparent",
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
      const response = await axios.get("https://api.ipify.org?format=json");
      setIP(response?.data?.ip);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const isCurrentTimeInShift = async (shifts) => {
    if (!shifts) return false; // Return false if shifts array is not provided

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentInMinutes = currentHour * 60 + currentMinute;
    for (let shift of shifts) {
      if (!shift?.shift) continue; // Skip if no shift
      if (shift?.shift === "Week Off") continue; // Skip "Week Off" shifts

      const [startTime, endTime] = shift?.shift?.split("to");

      // Check if the shift starts in PM and ends in AM
      const isStartInPM = startTime.includes("PM");
      const isEndInAM = endTime.includes("AM");

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
          if (period === "PM" && hours !== 12) hours += 12;
          if (period === "AM" && hours === 12) hours = 0;
          return { hours, minutes };
        };

        // Set start to 12:00AM and use end time from the shift
        const start = parseTime("12:00AM");
        const end = parseTime(endTime);

        // Calculate the start and end times in minutes
        const startInMinutes = start.hours * 60 + start.minutes; // 0 minutes
        const endInMinutes = end.hours * 60 + end.minutes;

        // Check if the current time is between 12:00AM and the shift's end time
        if (
          currentInMinutes >= startInMinutes &&
          currentInMinutes <= endInMinutes
        ) {
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
    const pathSegments = currentUrl.split("/"); // Split the pathname by '/'
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

  const [userShiftDetails, setUserShiftDetails] = useState("");
  const [updatedShiftDetails, setUpdatedShiftDetails] = useState("");
  const [
    updatedStartShiftDetailsMinus2Hours,
    setUpdatedStartShiftDetailsMinus2Hours,
  ] = useState("");
  const [updatedEndShiftDetailsAdd4Hours, setUpdatedEndShiftDetailsAdd4Hours] =
    useState("");

  const checkCurrentDate = new Date();

  // get current time
  const currentHours = checkCurrentDate.getHours();
  const currentMinutes = checkCurrentDate.getMinutes();
  // const currentSeconds = checkCurrentDate.getSeconds();

  // Determine whether it's AM or PM
  const currentperiod = currentHours >= 12 ? "PM" : "AM";

  // Format the current time manually
  const formattedHours = currentHours % 12 || 12; // Convert 0 to 12 for 12-hour format
  const formattedMinutes =
    currentMinutes >= 10 ? currentMinutes : "0" + currentMinutes;
  // const formattedSeconds = currentSeconds >= 10 ? currentSeconds : '0' + currentSeconds;
  const currentTime = `${formattedHours}:${formattedMinutes}${currentperiod}`;
  const [shiftMode, setShiftMode] = useState("Main Shift");

  const newcurrentTime = new Date();
  const currentHour = newcurrentTime.getHours();
  const currentMinute = newcurrentTime.getMinutes();
  const period = currentHour >= 12 ? "PM" : "AM";

  const convertTo24HourFormat = (time) => {
    let [hours, minutes] = time?.slice(0, -2)?.split(":");
    hours = parseInt(hours, 10);
    if (time?.slice(-2) === "PM" && hours !== 12) {
      hours += 12;
    }
    return `${String(hours).padStart(2, "0")}:${minutes}`;
  };
  const [weekOffShow, setWeekOffShow] = useState(true);
  const [holidayShow, setHolidayShow] = useState(true);
  const [currentUserShiftName, setCurrentUserShiftName] = useState({});
  const currDate = new Date();
  const currDay = currDate.getDay();
  // console.log(isUserRoleAccess, "isUserRoleAccess");
  // console.log(moment().format("hh:mm:ss a"), "isUserRoleAccess");
  const [buttonHideShow, setButtonHideShow] = useState([]);
  const [loginuserId, setLoginUserid] = useState("");
  async function fetchCheckinStatus(loginid, shifttime, from) {
    try {
      const res = await axios.post(SERVICE.LOGINOUT_USERID, {
        loginid: loginid,
        shifttime,
      });
      localStorage.setItem("currentaddedshifttime", shifttime);
      let buttonHideShow =
        res?.data?.attstatus[res?.data?.attstatus?.length - 1];

      setButtonHideShow(buttonHideShow);
      setLoginUserid(buttonHideShow?._id);
      setClockinLoader(false);

      return buttonHideShow;
    } catch (err) {
      setClockinLoader(false);
      console.log(err);
    }
  }

  const fetchUsers = async () => {
    try {
      let { afterAddHours, prevAddHours } = await fetchOverAllSettings();
      // console.log(afterAddHours, prevAddHours, "afterAddHours, prevAddHours");
      var today = new Date();
      var todayDate = new Date();
      var dd = String(today.getDate()).padStart(2, "0");
      var mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
      var yyyy = today.getFullYear();
      today = yyyy + "-" + mm + "-" + dd;
      var todayDateFormat = `${dd}/${mm}/${yyyy}`;

      // Get yesterday's date
      var yesterday = new Date(todayDate);
      yesterday.setDate(todayDate.getDate() - 1);
      var ddp = String(yesterday.getDate()).padStart(2, "0");
      var mmp = String(yesterday.getMonth() + 1).padStart(2, "0"); // January is 0!
      var yyyyp = yesterday.getFullYear();

      var yesterdayDate = yyyyp + "-" + mmp + "-" + ddp;
      var yesterdayDateFormat = `${ddp}/${mmp}/${yyyyp}`;

      const currDate = new Date();
      const currDay = currDate.getDay();
      let startMonthDate = new Date(yesterdayDate);
      let endMonthDate = new Date(today);

      const daysArray = [];

      while (startMonthDate <= endMonthDate) {
        const formattedDate = `${String(startMonthDate.getDate()).padStart(
          2,
          "0"
        )}/${String(startMonthDate.getMonth() + 1).padStart(
          2,
          "0"
        )}/${startMonthDate.getFullYear()}`;
        const dayName = startMonthDate.toLocaleDateString("en-US", {
          weekday: "long",
        });
        const dayCount = startMonthDate.getDate();
        const shiftModes = "Main Shift";

        daysArray.push({ formattedDate, dayName, dayCount, shiftModes });

        // Move to the next day
        startMonthDate.setDate(startMonthDate.getDate() + 1);
      }
      // console.log(daysArray, "daysArray");
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
          (data.company.includes(isUserRoleAccess.company) &&
            data.applicablefor.includes(isUserRoleAccess.branch) &&
            data.unit.includes(isUserRoleAccess.unit) &&
            data.team.includes(isUserRoleAccess.team) &&
            data.employee.includes(isUserRoleAccess.companyname)) ||
          (data.company.includes(isUserRoleAccess.company) &&
            data.applicablefor.includes(isUserRoleAccess.branch) &&
            data.unit.includes(isUserRoleAccess.unit) &&
            data.team.includes(isUserRoleAccess.team) &&
            data.employee.includes("ALL"))
        );
      });
      // console.log(
      //   loginusershift?.data?.finaluser,
      //   "loginusershift?.data?.finaluser"
      // );
      const yesrtedayShifts = loginusershift?.data?.finaluser?.filter(
        (data) => data?.formattedDate === yesterdayDateFormat
      );
      // console.log(yesrtedayShifts, "yesrtedayShifts");
      const todayShifts = loginusershift?.data?.finaluser?.filter(
        (data) => data?.formattedDate === todayDateFormat
      );
      // console.log(yesrtedayShifts, "yesrtedayShifts");
      // console.log(todayShifts, "todayShifts");

      const isInYesterdayShift = await isCurrentTimeInShift(
        yesrtedayShifts?.length > 0
          ? [yesrtedayShifts[yesrtedayShifts?.length - 1]]
          : []
      );

      const finalShift = isInYesterdayShift ? yesrtedayShifts : todayShifts;
      // console.log(finalShift, "finalShift");
      // console.log(finalShift, "finalShift");
      const mainshifttimespl =
        finalShift[0]?.shift != "Week Off"
          ? finalShift[0]?.shift?.split("to")
          : "";
      const secondshifttimespl =
        finalShift?.length > 1 ? finalShift[1]?.shift?.split("to") : "";

      const getTimeRanges = (timeRange) => {
        const [start, end] = timeRange.split("-");
        return { start, end };
      };
      const isCurrentTimeInRange = (start, end) => {
        const now = moment();
        // const startTime = moment(start, "hh:mmA");
        // const endTime = moment(end, "hh:mmA");
        const startTime = moment(start, "hh:mmA").subtract(
          afterAddHours,
          "hours"
        );
        const endTime = moment(end, "hh:mmA").add(prevAddHours, "hours");

        if (endTime.isBefore(startTime)) {
          // Handles overnight ranges
          return (
            now.isBetween(startTime, moment().endOf("day")) ||
            now.isBetween(moment().startOf("day"), endTime)
          );
        } else {
          return now.isBetween(startTime, endTime);
        }
      };
      const { start: start1, end: end1 } = getTimeRanges(
        mainshifttimespl[0] + "-" + mainshifttimespl[1]
      );
      const { start: start2, end: end2 } = getTimeRanges(
        secondshifttimespl[0] + "-" + secondshifttimespl[1]
      );
      let secondshiftmode =
        finalShift?.length > 1
          ? mainshifttimespl[1] === secondshifttimespl[0]
            ? "Continuous Shift"
            : "Double Shift"
          : "";
      const addedFirstShiftInRange = isCurrentTimeInRange(
        start1,
        end1,
        "three"
      );
      const addedSecondShiftInRange = isCurrentTimeInRange(
        start2,
        end2,
        "four"
      );
      let shiftModeClockin = addedSecondShiftInRange
        ? "Second Shift"
        : "Main Shift";
      setShiftMode(shiftModeClockin);
      const isCurrentTimeInRangeNew = (start, end, from) => {
        const now = moment();
        let startTime = moment(start, "hh:mmA").set({
          year: now.year(),
          month: now.month(),
          date: now.date(),
        });
        let endTime = moment(end, "hh:mmA").set({
          year: now.year(),
          month: now.month(),
          date: now.date(),
        });

        // If the end time is in AM and before the start time, assume the shift spans overnight
        if (endTime.isBefore(startTime)) {
          startTime.subtract(1, "days"); // Treat start time as yesterday
        }

        return now.isBetween(startTime, endTime);
      };

      //for continouos shift
      const addedTimeinFirstShiftStart = moment(start1, "hh:mmA").subtract(
        afterAddHours,
        "hours"
      );
      const addedTimeinSecondShiftStart = moment(start2, "hh:mmA").subtract(
        afterAddHours,
        "hours"
      );
      const addedTimeinFirstShiftEnd = moment(end1, "hh:mmA").add(
        prevAddHours,
        "hours"
      );
      const addedTimeinSecondShiftEnd = moment(end2, "hh:mmA").add(
        prevAddHours,
        "hours"
      );
      const addedFirstShiftInRangeWithoutGrace =
        (secondshiftmode === "Continuous Shift" ||
          secondshiftmode === "Double Shift") &&
        isCurrentTimeInRangeNew(
          addedTimeinFirstShiftStart,
          mainshifttimespl[1],
          "onenew"
        );
      const addedSecondShiftInRangeWithoutGrace =
        (secondshiftmode === "Continuous Shift" ||
          secondshiftmode === "Double Shift") &&
        isCurrentTimeInRangeNew(
          secondshifttimespl[0],
          addedTimeinSecondShiftEnd,
          "twomew"
        );

      let buttonHideShow;
      console.table({
        addedFirstShiftInRangeWithoutGrace: addedFirstShiftInRangeWithoutGrace,
        addedSecondShiftInRangeWithoutGrace:
          addedSecondShiftInRangeWithoutGrace,
        addedFirstShiftInRange: addedFirstShiftInRange,
        addedSecondShiftInRange: addedSecondShiftInRange,
      });
      if (addedFirstShiftInRangeWithoutGrace) {
        setCurrentUserShiftName(finalShift[0]);
        buttonHideShow = await fetchCheckinStatus(
          isUserRoleAccess?._id,
          `${moment(addedTimeinFirstShiftStart, "hh:mmA").format(
            "HH:mm"
          )} - ${moment(mainshifttimespl[1], "hh:mmA").format("HH:mm")}`,
          "one"
        );
        setShiftEndTime(moment(mainshifttimespl[1], "hh:mmA").format("HH:mm"));
      } else if (addedSecondShiftInRangeWithoutGrace) {
        setCurrentUserShiftName(finalShift[1]);
        buttonHideShow = await fetchCheckinStatus(
          isUserRoleAccess?._id,
          `${moment(secondshifttimespl[0], "hh:mmA").format(
            "HH:mm"
          )} - ${moment(addedTimeinSecondShiftEnd, "hh:mmA").format("HH:mm")}`,
          "two"
        );
        setShiftEndTime(
          moment(addedTimeinSecondShiftEnd, "hh:mmA").format("HH:mm")
        );
      } else if (addedFirstShiftInRange) {
        setCurrentUserShiftName(finalShift[0]);
        buttonHideShow = await fetchCheckinStatus(
          isUserRoleAccess?._id,
          `${moment(addedTimeinFirstShiftStart, "hh:mmA").format(
            "HH:mm"
          )} - ${moment(addedTimeinFirstShiftEnd, "hh:mmA").format("HH:mm")}`,
          "three"
        );
        setShiftEndTime(
          moment(addedTimeinFirstShiftEnd, "hh:mmA").format("HH:mm")
        );
      } else if (addedSecondShiftInRange) {
        setCurrentUserShiftName(finalShift[1]);
        buttonHideShow = await fetchCheckinStatus(
          isUserRoleAccess?._id,
          `${moment(addedTimeinSecondShiftStart, "hh:mmA").format(
            "HH:mm"
          )} - ${moment(addedTimeinSecondShiftEnd, "hh:mmA").format("HH:mm")}`,
          "four"
        );
        setShiftEndTime(
          moment(addedTimeinSecondShiftEnd, "hh:mmA").format("HH:mm")
        );
      } else {
        setButtonHideShow({ buttonname: "SHIFT CLOSED" });
        setLoginUserid("");
      }
      let buttonName = buttonHideShow?.buttonname;
      // console.log(buttonName, "buttonName");
      if (
        holidayDate?.some(
          (item) =>
            moment(item.date).format("DD-MM-YYYY") ==
            moment(currDate).format("DD-MM-YYYY")
        )
      ) {
        setHolidayShow(false);
      } else if (
        // loginusershift?.data?.finaluser[1]?.shift?.includes("Week Off")
        finalShift[0]?.shift === "Week Off"
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
    const userShiftDetailsStartTime = userShiftDetails.match(
      /\b\d{2}:\d{2}[APMapm]{2}\b/
    );
    const startTime = userShiftDetailsStartTime
      ? userShiftDetailsStartTime[0]
      : "";
    if (startTime) {
      const originalTime = startTime?.slice(0, -2);
      const period = startTime?.slice(-2);

      const [hours, minutes] = originalTime?.split(":").map(Number);

      // Subtract 2 hours
      const newHours = hours - 2;

      // Format the new time manually
      const formattedHours = newHours >= 10 ? newHours : "0" + newHours;
      const newTime = `${formattedHours}:${minutes < 10 ? "0" : ""}${minutes}`;

      setUpdatedShiftDetails(`${newTime}${period}`);
    } else {
      // console.log("Invalid or missing start time in userShiftDetails");
    }

    // Add 10 min to the start time
    const updatedShiftDetailsTime = userShiftDetails?.match(
      /\b\d{2}:\d{2}[APMapm]{2}\b/
    );
    const shiftTime = updatedShiftDetailsTime ? updatedShiftDetailsTime[0] : "";

    if (shiftTime) {
      const originalTime = shiftTime?.slice(0, -2);
      const period = shiftTime?.slice(-2);

      const [hours, minutes] = originalTime?.split(":").map(Number);

      // Convert to 24-hour format
      const hours24 = period === "PM" && hours !== 12 ? hours + 12 : hours;

      // Add 10 minutes
      const newMinutes = minutes + 10;

      // Format the new time manually
      const newHours = hours24 < 10 ? "0" + hours24 : hours24;
      const newTime = `${newHours}:${newMinutes < 10 ? "0" : ""}${newMinutes}`;

      setUpdatedStartShiftDetailsMinus2Hours(`${newTime}${period}`);
    } else {
      // console.log("Invalid or missing shift time in updatedShiftDetails");
    }

    // Calculate before 4 hours from the user's shift end time
    const userShiftDetailsEndTime = userShiftDetails.match(
      /\b\d{2}:\d{2}[APMapm]{2}\b/g
    );
    const endTime = userShiftDetailsEndTime ? userShiftDetailsEndTime[1] : "";

    if (endTime) {
      const originalTime = endTime?.slice(0, -2);
      const period = endTime?.slice(-2);

      const [hours, minutes] = originalTime?.split(":").map(Number);

      // Add 4 hours
      const newHours = hours + 4;

      // Format the new time manually
      const formattedHours = newHours >= 10 ? newHours : "0" + newHours;
      const newTime = `${formattedHours}:${minutes < 10 ? "0" : ""
        }${minutes}:00`;

      setUpdatedEndShiftDetailsAdd4Hours(`${newTime} ${period}`);
    } else {
      // console.log("Invalid or missing end time in userShiftDetails");
    }
  }, [
    updatedShiftDetails,
    updatedStartShiftDetailsMinus2Hours,
    updatedEndShiftDetailsAdd4Hours,
  ]);

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
          item.employeename.some(
            (data) => data === isUserRoleAccess?.companyname
          )
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

  const [shiftTimings, setShiftTimings] = useState("");
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

    const handleClockIn = async () => {
      try {
        const response = await axios.get("https://api.ipify.org?format=json");
        const currentTime = new Date().toLocaleTimeString();
        const currentDate = new Date();
        var dd = String(currentDate.getDate()).padStart(2, "0");
        var mm = String(currentDate.getMonth() + 1).padStart(2, "0");
        var yyyy = currentDate.getFullYear();

        today = dd + "-" + mm + "-" + yyyy;
        localStorage.setItem("clockInTime", currentTime);
        localStorage.setItem("IpAddress", response.data.ip);
        localStorage.setItem("clockStatus", "clockedIn");
        localStorage.setItem("clockInDate", today);
        localStorage.setItem("username", isUserRoleAccess.username);
        localStorage.setItem("buttonstatus", "true");

        handleClick();
        const calculatedshiftend = await addFutureTimeToCurrentTime(
          shiftEndTime
        );
        await fetchLoginStatus(calculatedshiftend);
      } catch (err) {
        handleApiError(err, setShowAlert, handleClickOpenerr);
      }
    };

    function addFutureTimeToCurrentTime(futureTime) {
      // Parse the future time string into hours and minutes
      const [futureHours, futureMinutes] = futureTime?.split(":").map(Number);

      // Get the current time
      const currentTime = new Date();

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

      const newDate = new Date();
      newDate.setHours(newDate.getHours() + timeDifferenceHours);
      newDate.setMinutes(newDate.getMinutes() + timeDifferenceMinutes);

      return newDate;
    }
    return (
      <>
        {isUserRoleAccess.role.includes("Manager") ? (
          <LoadingButton
            loading={clockinLoader}
            variant="contained"
            className="glow-button"
            onClick={() => {
              handleClockIn();
            }}
            size="small"
            sx={{
              marginLeft: "3px",
              fontSize: "11px",
              padding: "4px 8px",
              minWidth: "0px",
              height: "32px",
            }}
          >
            Clock In
          </LoadingButton>
        ) : !isUserRoleAccess.role.includes("Manager") && !weekOffShow ? (
          <Button variant="contained" color="success">
            WEEKOFF{" "}
          </Button>
        ) : !isUserRoleAccess.role.includes("Manager") && !holidayShow ? (
          <Button variant="contained" color="success">
            HOLIDAY{" "}
          </Button>
        ) : !isUserRoleAccess.role.includes("Manager") &&
          clockinIPDetails.includes(IP) &&
          weekOffShow &&
          holidayShow &&
          showClockin ? (
          <LoadingButton
            loading={clockinLoader}
            variant="contained"
            className="glow-button"
            onClick={() => {
              handleClockIn();
            }}
            size="small"
            sx={{
              marginLeft: "3px",
              fontSize: "11px",
              padding: "4px 8px",
              minWidth: "0px",
              height: "32px",
            }}
          >
            Clock In
          </LoadingButton>
        ) : !isUserRoleAccess.role.includes("Manager") &&
          showButton === "SHOW" &&
          weekOffShow &&
          holidayShow &&
          showClockin ? (
          <LoadingButton
            loading={clockinLoader}
            variant="contained"
            className="glow-button"
            onClick={() => {
              handleClockIn();
            }}
            size="small"
            sx={{
              marginLeft: "3px",
              fontSize: "11px",
              padding: "4px 8px",
              minWidth: "0px",
              height: "32px",
            }}
          >
            Clock In
          </LoadingButton>
        ) : (
          <></>
        )}
      </>
    );
  };

  useEffect(() => {
    fetchClockinDetails();
    fetchPendingTaskCount();
    fetchUserDates();
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
      const selectedBranchData = response?.data?.clockinip?.find(
        (item) => item.branch === isUserRoleAccess.branch
      );
      let matchinguser = response?.data?.individualsettings?.find((item) =>
        item.companyname.includes(isUserRoleAccess?.companyname)
      );
      let lastIpCheck = matchinguser
        ? matchinguser?.ipswitch
        : response?.data?.adminIPswitch;
      let lastMobileCheck = matchinguser
        ? matchinguser?.mobileipswitch
        : response?.data?.adminMobileswitch;

      if (lastIpCheck && lastMobileCheck) {
        if (selectedBranchData) {
          setClockinIPDetails(selectedBranchData.ipaddress);
          setShowButton("NOTSHOW");
        } else {
          setClockinIPDetails([]);
          setShowButton("SHOW");
        }
        const handleResize = () => {
          lastMobileCheck
            ? setShowClockin(window.innerWidth >= 1000)
            : setShowClockin(true);
        };
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => {
          window.removeEventListener("resize", handleResize);
        };
      } else if (lastMobileCheck) {
        setShowButton("SHOW");
        const handleResize = () => {
          lastMobileCheck
            ? setShowClockin(window.innerWidth >= 1000)
            : setShowClockin(true);
        };
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => {
          window.removeEventListener("resize", handleResize);
        };
      } else if (lastIpCheck) {
        if (selectedBranchData) {
          setClockinIPDetails(selectedBranchData.ipaddress);
          setShowButton("NOTSHOW");
        } else {
          setClockinIPDetails([]);
          setShowButton("SHOW");
        }
        const handleResize = () => {
          lastMobileCheck
            ? setShowClockin(window.innerWidth >= 1000)
            : setShowClockin(true);
        };
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => {
          window.removeEventListener("resize", handleResize);
        };
      } else {
        setShowButton("SHOW");
      }
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const [pendingTaskCount, setPendingTaskCount] = useState(0);
  const fetchPendingTaskCount = async () => {
    try {
      let response = await axios.get(
        `${SERVICE.PENDING_TASK_COUNT}/?username=${isUserRoleAccess?.companyname}`,
        {
          headers: { Authorization: `Bearer ${auth.APIToken}` },
        }
      );
      setPendingTaskCount(response?.data?.count);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const fetchLoginStatus = async (shitend) => {
    try {
      let shiftendtiming =
        currentUserShiftName?.shift != "Week Off"
          ? currentUserShiftName?.shift?.split("to")
          : [];

      let res = await axios.post(SERVICE.LOGINOUT_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        username: String(isUserRoleAccess.username),
        userid: String(isUserRoleAccess._id),
        clockintime: new Date().toLocaleTimeString(),
        date: localStorage.clockInDate,
        clockinipaddress: localStorage.IpAddress,
        status: true,
        buttonstatus: "true",
        calculatedshiftend: shitend ?? "",
        shiftname: String(currentUserShiftName?.shift ?? ""),
        autoclockout: Boolean(false),
        shiftendtime: String(shiftendtiming[1] ?? ""),
        shiftmode: String(shiftMode),
        clockouttime: "",
        attendancemanual: Boolean(false),
        weekoffpresentstatus: Boolean(false),
      });
      // await fetchBackendFilter(isUserRoleAccess._id, calculatedTime, shiftMode);
      await fetchCheckinStatus(
        isUserRoleAccess._id,
        localStorage.currentaddedshifttime
      );
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  let remarkcreate;

  const ClockOutButton = () => {
    const [remark, setRemark] = useState({ reason: "" });
    const handleClockOutlast = async () => {
      try {
        const response = await axios.get("https://api.ipify.org?format=json");
        const currentTime = new Date().toLocaleTimeString();
        const currentDate = new Date();
        var dd = String(currentDate.getDate()).padStart(2, "0");
        var mm = String(currentDate.getMonth() + 1).padStart(2, "0");
        var yyyy = currentDate.getFullYear();
        today = dd + "-" + mm + "-" + yyyy;
        localStorage.setItem("clockOutTime", currentTime);
        localStorage.setItem("clockStatus", "clockedOut");
        localStorage.setItem("IpAddress", response.data.ip);
        localStorage.setItem("buttonstatus", "false");
        sendUpdateClockStatus();
      } catch (err) {
        handleApiError(err, setShowAlert, handleClickOpenerr);
      }
    };

    const handleClockOut = async () => {
      try {
        if (pendingTaskCount >= 100) {
          // handleClickOpenclockout();
          handleClickOpenRestrictClockout();
        } else if (
          pendingTaskCount !== 0 &&
          pendingTaskCount < 100 &&
          !warningShowed
        ) {
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
            taskname: String(
              item.taskfield != "testing"
                ? item.taskname
                : item.taskname + "(Testing)"
            ),
            date: String(new Date()),
          }))
        );

        handleClockOutlast();
        handleCloseclockout();
        setRemark({ reason: "" });
      } catch (err) {
        handleApiError(err, setShowAlert, handleClickOpenerr);
      }
    };

    return (
      <>
        <>
          {isUserRoleAccess.role.includes("Manager") ? (
            <LoadingButton
              loading={clockoutLoader}
              variant="contained"
              style={{ backgroundColor: "red" }}
              className="glow-button"
              onClick={handleClockOut}
              size="large"
              sx={{
                marginLeft: "3px",
                fontSize: "11px",
                padding: "4px 8px",
                minWidth: "0px",
                height: "32px",
              }}
            >
              Clock Out
            </LoadingButton>
          ) : !isUserRoleAccess.role.includes("Manager") && !weekOffShow ? (
            <Button variant="contained" color="success">
              WEEKOFF{" "}
            </Button>
          ) : !isUserRoleAccess.role.includes("Manager") && !holidayShow ? (
            <Button variant="contained" color="success">
              HOLIDAY{" "}
            </Button>
          ) : !isUserRoleAccess.role.includes("Manager") &&
            clockinIPDetails.includes(IP) &&
            showClockin ? (
            <>
              <LoadingButton
                loading={clockoutLoader}
                variant="contained"
                style={{ backgroundColor: "red" }}
                className="glow-button"
                onClick={handleClockOut}
                size="large"
                sx={{
                  marginLeft: "3px",
                  fontSize: "11px",
                  padding: "4px 8px",
                  minWidth: "0px",
                  height: "32px",
                }}
              >
                Clock Out
              </LoadingButton>
            </>
          ) : !isUserRoleAccess.role.includes("Manager") &&
            showButton === "SHOW" &&
            showClockin ? (
            <>
              <LoadingButton
                loading={clockoutLoader}
                variant="contained"
                style={{ backgroundColor: "red" }}
                className="glow-button"
                onClick={handleClockOut}
                size="large"
                sx={{
                  marginLeft: "3px",
                  fontSize: "11px",
                  padding: "4px 8px",
                  minWidth: "0px",
                  height: "32px",
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
          <Dialog
            open={isErrorOpenclockout}
            onClose={handleCloseclockout}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogContent
              sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
            >
              <Typography variant="h6">you have a pending task</Typography>
              <Typography style={{ fontWeight: 900 }}>Reason</Typography>
              <TextareaAutosize
                aria-label="maximum height"
                minRows={5}
                style={{ width: "100%" }}
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

  const fetchUserDates = async () => {
    try {
      let response = await axios.get(`${SERVICE.GETUSERDATES}`, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      let sortedDates = response?.data?.userbirthday.sort(
        (a, b) => new Date(a.dob) - new Date(b.dob)
      );
      let sortedDoj = response?.data?.userdateofjoining.sort(
        (a, b) => new Date(a.doj) - new Date(b.doj)
      );
      let sortedDom = response?.data?.userdateofmarriage.sort(
        (a, b) => new Date(a.dom) - new Date(b.dom)
      );
      //birthday
      if (response?.data?.userbirthday.length != 0) {
        const displayDates = sortedDates?.map((item) => {
          const itemDate = new Date(item.dob);
          const isToday =
            itemDate.getDate() === currentDate.getDate() &&
            itemDate.getMonth() === currentDate.getMonth() &&
            itemDate.getFullYear() === currentDate.getFullYear();
          if (isToday) {
            return {
              companyname: item.companyname,
              dob: "Today",
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
          const isTodaydoj =
            itemdojDate.getDate() === currentDate.getDate() &&
            itemdojDate.getMonth() === currentDate.getMonth() &&
            itemdojDate.getFullYear() === currentDate.getFullYear();
          if (isTodaydoj) {
            return { companyname: item.companyname, doj: "Today" };
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
          const isTodaydom =
            itemdomDate.getDate() === currentDate.getDate() &&
            itemdomDate.getMonth() === currentDate.getMonth() &&
            itemdomDate.getFullYear() === currentDate.getFullYear();
          if (isTodaydom) {
            return { companyname: item.companyname, dom: "Today" };
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

  let maleimage = "data:image/png;base64,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"
  let femaleimage = " https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVmPFyachBpGr2wuhBzg9WtRZVdyJhQzXW8w&"


  // console.log(birthday, "birthday")
  let getCloutToday;
  const sendUpdateClockStatus = async () => {
    setClockoutLoader(true);
    try {
      const currentDate = new Date();

      const currentTime = new Date().toLocaleTimeString();
      localStorage.setItem("clockOutTime", currentTime);
      var dd = String(currentDate.getDate()).padStart(2, "0");
      var mm = String(currentDate.getMonth() + 1).padStart(2, "0");
      var yyyy = currentDate.getFullYear();

      getCloutToday = dd + "-" + mm + "-" + yyyy;
      let res = await axios?.put(`${SERVICE.LOGINOUT_SINGLE}/${loginuserId}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        clockouttime: localStorage.clockOutTime.toUpperCase(),
        clockoutipaddress: localStorage.IpAddress,
        buttonstatus: "false",
        autoclockout: Boolean(false),
        attendancemanual: Boolean(false),
        weekoffpresentstatus: Boolean(false),
      });
      // await fetchBackendFilter(
      //   isUserRoleAccess?._id,
      //   calculatedTime,
      //   shiftMode
      // );
      await fetchCheckinStatus(
        isUserRoleAccess._id,
        localStorage.currentaddedshifttime
      );
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
            display: "flex",
            flexWrap: "wrap",
            width: "90px",
          }}
        >
          {buttonHideShow?.buttonname === "CLOCKOUT" ||
            (localStorage.buttonstatus === "true" &&
              isUserRoleAccess.username === localStorage.username) ? (
            <Grid
              item
              xs={12}
              md={12} // Adjust for smaller screens
              sx={{
                textAlign: "center",
                width: "90px",
                marginRight: {
                  xs: 0, // No margin on extra small screens
                  sm: "500px", // Margin for small screens
                  md: "350px", // Default margin for medium screens
                  lg: "500px", // Margin for large screens
                  "@media (min-width: 900px) and (max-width: 1300px)": {
                    marginRight: "550px", // Custom margin for 900px-1300px screens
                  },
                },
              }}
            // sx={{ textAlign: "center", marginRight: "150px" }}
            >
              {" "}
              <ClockOutButton />{" "}
            </Grid>
          ) : buttonHideShow?.buttonname === "SHIFT CLOSED" ||
            (localStorage.buttonstatus === "false" &&
              isUserRoleAccess.username === localStorage.username) ? (
            <>
              <Grid item md={12} sx={{ textAlign: "center" }}>
                <Typography sx={{ fontSize: "18PX" }}>Shift Closed</Typography>
              </Grid>
            </>
          ) : (
            <>
              <Grid
                item
                md={12}
                sx={{
                  display: "flex",
                  justifyContent: "space-between", // Separate buttons horizontally
                  alignItems: "center",
                  cursor: "pointer",
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
      setChatBoxLink(
        res?.data?.overallsettings[res?.data?.overallsettings.length - 1]
          ?.chatboxlink
      );
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const fetchOverAllSettings = async () => {
    try {
      let response = await axios.get(
        `${SERVICE.GET_ATTENDANCE_CONTROL_CRITERIA}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );

      const attendanceExtraTime =
        response?.data?.attendancecontrolcriteria?.length > 0
          ? response?.data?.attendancecontrolcriteria[
          response?.data?.attendancecontrolcriteria?.length - 1
          ]
          : "";
      const prevAddHours = attendanceExtraTime
        ? Number(attendanceExtraTime?.clockout)
        : 0;
      const afterAddHours = attendanceExtraTime
        ? Number(attendanceExtraTime?.clockin)
        : 0;

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
      return "Good Morning";
    } else if (currentHour >= 12 && currentHour < 16) {
      return "Good Afternoon";
    } else if (currentHour >= 16 && currentHour < 22) {
      return "Good Evening";
    } else {
      return "Welcome";
    }
  };

  return (
    <>
      <Box
        sx={{
          marginTop: {
            md: "-45px",
            sm: "0px",
            xs: "0px",
          },
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} sm={12}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                display: "flex",
                justifyContent: "flex-start",
                fontSize: {
                  xs: "1rem", // Font size for extra small screens
                  sm: "1.25rem", // Font size for small screens
                  md: "1.5rem", // Font size for medium screens (default)
                },
              }}
            >
              {getGreeting()}! {isUserRoleAccess?.username}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} sm={12}>
            <ClockComponent />
          </Grid>
        </Grid>
      </Box>
      {/* {isUserRoleAccess?.role?.includes("Manager") && ( */}
      <>
        <br /><br /><br /><br /><br />
        <Homelayout />
      </>
      {/* )} */}
      {/* chatbox icon */}
      <Box>
        <Link to={chatBoxLink} target="_blank">
          <Button
            variant="contained"
            sx={{
              position: "fixed",
              bottom: "6.5rem",
              right: "2rem",
              height: "4rem",
              width: "4rem",
              fontSize: "5rem",
              borderRadius: "50%",
              cursor: "pointer",
            }}
          >
            <ChatIcon style={{ fontSize: "2rem", color: "white" }} />
          </Button>
        </Link>
      </Box>
      <Box>
        <Link to="/tickets/raiseticketmaster" target="_blank">
          <Button
            variant="contained"
            sx={{
              position: "fixed",
              bottom: "2rem",
              left: "2rem",
              height: "4rem",
              width: "4rem",
              fontSize: "5rem",
              borderRadius: "50%",
              cursor: "pointer",
            }}
          >
            <SupportAgentRoundedIcon
              style={{ fontSize: "2rem", color: "white" }}
            />
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
            position: "fixed",
            bottom: "6.5rem",
            left: "2rem",
            height: "4rem",
            width: "4rem",
            fontSize: "5rem",
            borderRadius: "50%",
            cursor: "pointer",
          }}
          onClick={() => handleClickOpenQuickLinkview()}
        >
          <DriveFileMoveRoundedIcon
            style={{ fontSize: "2rem", color: "white" }}
          />
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
                                to={`/birthdaycard/?name=${item?.companyname
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
        </Grid> */}


        <HomeBirthday />





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
      </Grid>

      {/* quick links popup */}
      <Dialog
        maxWidth="sm"
        open={openQuickLink}
        onClose={handleCloseQuickLinkview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Box sx={{ width: "400px", padding: "20px 50px" }}>
          <>
            <Grid container spacing={2}>
              <Grid item md={11} sm={11} xs={11}>
                <Typography sx={userStyle.HeaderText}>
                  {" "}
                  Quick Folder Links
                </Typography>
              </Grid>
              <Grid item md={1} sm={1} xs={1}>
                <IconButton
                  edge="end"
                  color="inherit"
                  onClick={handleCloseQuickLinkview}
                  aria-label="close"
                >
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
                                  color: "blue",
                                  textDecoration: "none",
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
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Typography>
                            !! Not Yet Shared, Contact Administration !!
                          </Typography>
                        </Box>
                      </>
                    )}
                  </>
                ) : null}
              </Box>
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCloseQuickLinkview}
                sx={{ marginLeft: "15px" }}
              >
                Back
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>
      {/* Password alert box */}
      <Dialog
        // open={showPopup}
        open={false}
        onClose={handleClosePopup}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="sm"
        fullWidth={true}
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
              <b>Password Update Reminder</b>
            </DialogTitle>{" "}
            <br />
            {/* <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}> */}
            <DialogContentText
              id="alert-dialog-description"
              sx={{
                fontSize: "1.25rem",
                textAlign: "center",
                alignItems: "center",
              }}
            >
              <b style={{ color: "orange" }}>
                {" "}
                {passwordAlert
                  ? "Password update needed"
                  : `Password update will be active in ${remainingDays} days`}
              </b>
            </DialogContentText>
            {/* </DialogContent> */}
            <DialogActions>
              <Button
                onClick={handleClosePopup}
                variant="contained"
                color="error"
                autoFocus
              >
                OK
              </Button>
            </DialogActions>
          </>
        </Box>
      </Dialog>
      {/* More than 100 pending task clock out restriction dialog box */}
      <Dialog
        open={openRestrictClockout}
        onClose={handleClickCloseRestrictClockout}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="xs"
        fullWidth
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mt: 2,
          }}
        >
          <BlockIcon sx={{ fontSize: 40, marginRight: "10px", color: "red" }} />
          <DialogTitle id="alert-dialog-title">
            <b style={{ fontWeight: "800", color: "red" }}>
              {" "}
              Clock Out Restricted
            </b>
          </DialogTitle>
        </Box>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            sx={{
              textAlign: "center",
            }}
          >
            <b>
              You have more than 100 pending tasks. Please complete the tasks
              and clock out.
            </b>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClickCloseRestrictClockout}
            variant="contained"
            color="error"
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
      {/* less than 100 pending task clock out warning dialog box */}

      <Dialog
        open={openWarningClockout}
        onClose={handleClickCloseWarningClockout}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="xs"
        fullWidth
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mt: 2,
          }}
        >
          <WarningIcon
            color="warning"
            sx={{ fontSize: 40, marginRight: "10px" }}
          />
          <DialogTitle id="alert-dialog-title">
            <b style={{ fontWeight: "800", color: "#ed6c02" }}>
              Pending Task Warning
            </b>
          </DialogTitle>
        </Box>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            sx={{
              textAlign: "center",
            }}
          >
            <b>
              {`You have ${pendingTaskCount} pending tasks. Please try to complete as soon as possible.`}
            </b>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClickCloseWarningClockout}
            variant="contained"
            color="warning"
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Home;
