import { Grid, Typography, Button, Dialog, InputAdornment, IconButton, DialogContent, DialogActions, Box, FormControl, InputLabel, OutlinedInput } from "@mui/material";
import moment from "moment-timezone";
import React, { useEffect, useState, useContext } from "react";
import { loginSignIn } from "./Loginstyle";
import axios from "axios";
import { AuthContext, UserRoleAccessContext } from "../context/Appcontext";
import { AUTH } from "../services/Authservice";
import { SERVICE } from "../services/Baseservice";
import PersonIcon from "@mui/icons-material/Person";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import LinearProgress from "@mui/material/LinearProgress";
import loginimg from "./crap-img.png";
import google from "./google.png";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/footer/footer";

const Signin = () => {
  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [islogin, setislogin] = useState();
  const [userNameFetch, setUserNameFetch] = useState("");
  const [
    showAlert,
    //  setShowAlert
  ] = useState();
  // const handleClickOpenerr = () => {
  //   setIsErrorOpen(true);
  // };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };
  let systemUsername;
  let linkExpiryDate;
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

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const url = window.location.href;
  function decryptString(str) {
    const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const shift = 3; // You should use the same shift value used in encryption
    let decrypted = "";
    for (let i = 0; i < str.length; i++) {
      let charIndex = characters.indexOf(str[i]);
      if (charIndex === -1) {
        // If character is not found, add it directly to the decrypted string
        decrypted += str[i];
      } else {
        // Reverse the shift for decryption
        charIndex = (charIndex - shift + characters.length) % characters.length;
        decrypted += characters[charIndex];
      }
    }
    return decrypted;
  }
  // Function to get query parameters from the URL
  function getQueryParams(url) {
    const params = {};
    const queryString = url.split("?")[1]; // Get everything after the '?'
    if (queryString) {
      const pairs = queryString.split("&");
      pairs.forEach((pair) => {
        const [key, value] = pair.split("=");
        params[key] = decodeURIComponent(value); // Decode the value
      });
    }
    return params;
  }

  // Get the systemInfo parameter from the URL
  const queryParams = getQueryParams(url);
  const systemInfoString = queryParams.systemInfo;

  // Parse the JSON string into an object
  if (systemInfoString) {
    const systemInfo = JSON.parse(systemInfoString);
    systemUsername = decryptString(systemInfo.username);
    const dateExpiry = decryptString(systemInfo.expirydate);
    linkExpiryDate = new Date(dateExpiry);
  } else {
    console.log("No systemInfo parameter found in the URL");
  }
  console.log(linkExpiryDate, "linkExpiryDate");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    document.body.classList.add("signinbackground");
    return () => {
      document.body.classList.remove("signinbackground");
    };
  }, []);

  const [signin, setSignin] = useState({
    username: "",
    password: "",
    twofaotp: "",
    publicIP: "",
  });
  const [showTwofa, setShowTwofa] = useState(false);
  const {
    setIsUserRoleAccess,
    setIsUserRoleCompare,
    setalltaskLimit,
    setAllprojects,
    setallTasks,
    setIsAssignBranch,
    setallUsersLimit,
    setAllUsersData,
    setAllCompany,
    setAllBranch,
    setAllLocation,
    setAllArea,
    setAllFloor,
    setAllAreagrouping,
    setAllUnit,
    setAllTeam,
    setAllLocationgrouping,
    setAllDepartment,
    setAllDesignation,
    setTooltip,
    setListPageAccessMode,
  } = useContext(UserRoleAccessContext);
  const { auth, setAuth, setQrImage, qrImage } = useContext(AuthContext);

  const backPage = useNavigate();

  useEffect(() => {
    fetchIP();
  }, []);

  // get all assignBranches
  const fetchAllAssignBranch = async (name, code) => {
    try {
      let res = await axios.post(SERVICE.GETUSERASSIGNBRANCH, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        empcode: code,
        empname: name,
      });

      const ansswer = res?.data?.assignbranch.map((data, index) => {
        return {
          tocompany: data.company,
          tobranch: data.branch,
          tounit: data.unit,
          companycode: data.companycode,
          branchcode: data.branchcode,
          branchemail: data.branchemail,
          branchaddress: data.branchaddress,
          branchstate: data.branchstate,
          branchcity: data.branchcity,
          branchcountry: data.branchcountry,
          branchpincode: data.branchpincode,
          unitcode: data.unitcode,
          employee: data.employee,
          employeecode: data.employeecode,
          company: data.fromcompany,
          branch: data.frombranch,
          unit: data.fromunit,
          _id: data._id,
        };
      });
      return ansswer?.length > 0 ? ansswer : [];
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        console.log(messages);
      } else {
        console.log(messages);
      }
    }
  };

  const [ipAddress, setIpAddress] = useState("");

  useEffect(() => {
    const getLocalIP = async () => {
      const RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
      const pc = new RTCPeerConnection({ iceServers: [] });
      pc.createDataChannel("");
      pc.createOffer().then((sdp) => pc.setLocalDescription(sdp));

      pc.onicecandidate = (ice) => {
        if (!ice || !ice.candidate || !ice.candidate.candidate) return;
        const myIP = /([0-9]{1,3}(\.[0-9]{1,3}){3})/.exec(ice.candidate.candidate);
        if (myIP) setIpAddress(myIP[1]);
        pc.onicecandidate = null;
      };
    };

    getLocalIP();
  }, []);

  const fetchIP = async () => {
    const response = await axios.get("https://api.ipify.org?format=json");
    setSignin({ ...signin, publicIP: response?.data?.ip });
  };

  const isCurrentTimeInShift = async (shifts) => {
    if (!shifts) return false; // Return false if shifts array is not provided

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentInMinutes = currentHour * 60 + currentMinute;

    for (let shift of shifts) {
      if (shift.shift === "Week Off") continue; // Skip "Week Off" shifts

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
        if (currentInMinutes >= startInMinutes && currentInMinutes <= endInMinutes) {
          return true;
        }
      }
    }

    return false; // Return false if no shifts match the conditions
  };

  async function fetchCheckinStatus(loginid, shifttime, from) {
    try {
      const res = await axios.post(SERVICE.LOGINOUT_USERID, {
        loginid: loginid,
        shifttime,
      });
      localStorage.setItem("currentaddedshifttime", shifttime);
      let buttonHideShow = res?.data?.attstatus[res?.data?.attstatus?.length - 1];

      return buttonHideShow;
    } catch (err) {
      console.log(err);
    }
  }

  const fetchHandler = async () => {
    let holiday = false;

    try {
      const currDate = new Date();
      const currDay = currDate.getDay();
      let startMonthDate = new Date(yesterdayDate);
      let endMonthDate = new Date(today);

      const daysArray = [];

      while (startMonthDate <= endMonthDate) {
        const formattedDate = `${String(startMonthDate.getDate()).padStart(2, "0")}/${String(startMonthDate.getMonth() + 1).padStart(2, "0")}/${startMonthDate.getFullYear()}`;
        const dayName = startMonthDate.toLocaleDateString("en-US", {
          weekday: "long",
        });
        const dayCount = startMonthDate.getDate();
        const shiftMode = "Main Shift";

        daysArray.push({ formattedDate, dayName, dayCount, shiftMode });

        // Move to the next day
        startMonthDate.setDate(startMonthDate.getDate() + 1);
      }
      console.log(window.location.hostname, "window.location.hostname");
      const [response, res_status] = await Promise.all([
        axios.post(`${AUTH.LOGINCHECK}`, {
          username: String(signin.username),
          password: String(signin.password),
          publicIP: String(signin.publicIP),
          otp: String(signin.twofaotp),
          hostname: "none",
          macAddress: "none",
          version: "1.4.0",
          applogin: false,
          currenturl: String(window.location.hostname),
        }),
        axios.get(SERVICE.TODAY_HOLIDAY),
      ]);
      // console.log(response?.data?.loginapprestriction, "response?.data?.loginapprestriction");
      const sigindate = response?.data?.suser?.sigindate;

      const attendanceExtraTime = response?.data?.controlcriteria?.length > 0 ? response?.data?.controlcriteria[response?.data?.controlcriteria?.length - 1] : "";
      const prevAddHours = attendanceExtraTime ? Number(attendanceExtraTime?.clockout) : 0;
      const afterAddHours = attendanceExtraTime ? Number(attendanceExtraTime?.clockin) : 0;

      const userId = response?.data?.result?._id;
      if (response?.data?.loginapprestriction === "loginrestirct" && !response?.data?.result?.role?.includes("Manager")) {
        // console.log(1)
        setErrorMessage("Login Restricted.Please Try Again Later..");
        setislogin(true);
      }
      //  else if (
      //   response?.data?.loginapprestriction === "desktopapponly" &&
      //   (systemUsername === undefined || systemUsername === null)
      // ) {
      //   // console.log(2)
      //   setErrorMessage("Login Restricted.Please SignIn Via HRMS App..");
      //   setislogin(true);
      // }
      // else if (
      //   response?.data?.result?.loginUserStatus?.length === 0 &&
      //   response?.data?.loginapprestriction !== "urlonlywithoutauthentication"
      // ) {
      //   // console.log(3)
      //   setErrorMessage(
      //     "Login Restricted Temporarily.Please SignIn Via HRMS App.."
      //   );
      //   setislogin(true);
      // }
      // else if (
      //   systemUsername != undefined &&
      //   systemUsername != signin.username
      // ) {
      //   // console.log(8)
      //   setErrorMessage("Login Restricted due to different username");
      //   setislogin(true);
      // }
      // else if (response?.data?.loginapprestriction === "desktopurl" && systemUsername != undefined && linkExpiryDate <= new Date()) {
      //   setErrorMessage("RedirectionLink Expired.Login Again Using App");
      //   setislogin(true);
      // }
      // else if (response?.data?.loginapprestriction === "desktopapponly" && systemUsername != undefined && linkExpiryDate <= new Date()) {
      //   setErrorMessage("RedirectionLink Expired.Login Again Using App");
      //   setislogin(true);
      // }
      else {
        const [resuseratt, loginusershift] = await Promise.all([
          axios.post(`${AUTH.GETUSERATTINV}`, {
            userid: String(response?.data?.result?._id),
          }),
          axios.post(SERVICE.USER_CLOCKIN_CLOCKOUT_STATUS_CHECKLOGIN, {
            userDates: daysArray,
            empcode: response?.data?.result?.empcode,
          }),
        ]);

        const yesrtedayShifts = loginusershift?.data?.finaluser?.filter((data) => data?.formattedDate === yesterdayDateFormat);
        // console.log(yesrtedayShifts, "yesrtedayShifts");
        const todayShifts = loginusershift?.data?.finaluser?.filter((data) => data?.formattedDate === todayDateFormat);

        const isInYesterdayShift = await isCurrentTimeInShift(yesrtedayShifts?.length > 0 ? [yesrtedayShifts[yesrtedayShifts?.length - 1]] : []);
        // console.log(isInYesterdayShift, "isInYesterdayShift");
        const finalShift = isInYesterdayShift ? yesrtedayShifts : todayShifts;
        // console.log(finalShift, "finalShift");
        const mainshifttimespl = finalShift[0]?.shift != "Week Off" ? finalShift[0]?.shift?.split("to") : "";
        const secondshifttimespl = finalShift?.length > 1 ? finalShift[1]?.shift?.split("to") : "";

        const addHours = (time, hours) => {
          return moment(time, "hh:mmA").add(hours, "hours").format("hh:mmA");
        };
        const updatedMainShiftTiming = mainshifttimespl?.length > 0 ? [addHours(mainshifttimespl[0], 0), addHours(mainshifttimespl[1], 0)] : [];

        const updatedSecondShiftTiming = secondshifttimespl?.length > 0 ? [addHours(secondshifttimespl[0], 0), addHours(secondshifttimespl[1], 0)] : [];
        const getTimeRanges = (timeRange) => {
          const [start, end] = timeRange.split("-");
          return { start, end };
        };
        const isCurrentTimeInRange = (start, end) => {
          const now = moment();
          // const startTime = moment(start, "hh:mmA");
          // const endTime = moment(end, "hh:mmA");
          const startTime = moment(start, "hh:mmA").subtract(afterAddHours, "hours");
          const endTime = moment(end, "hh:mmA").add(prevAddHours, "hours");

          if (endTime.isBefore(startTime)) {
            // Handles overnight ranges
            return now.isBetween(startTime, moment().endOf("day")) || now.isBetween(moment().startOf("day"), endTime);
          } else {
            return now.isBetween(startTime, endTime);
          }
        };
        const { start: start1, end: end1 } = getTimeRanges(updatedMainShiftTiming[0] + "-" + updatedMainShiftTiming[1]);
        const { start: start2, end: end2 } = getTimeRanges(updatedSecondShiftTiming[0] + "-" + updatedSecondShiftTiming[1]);

        let secondshiftmode = finalShift?.length > 1 ? (mainshifttimespl[1] === secondshifttimespl[0] ? "Continuous Shift" : "Double Shift") : "";
        // console.
        // console.log(start1, end1);
        // console.log(start2, end2);
        const updateCheckMainTiming = isCurrentTimeInRange(start1, end1) || isCurrentTimeInRange(start2, end2);
        const addedFirstShiftInRange = isCurrentTimeInRange(start1, end1, "three");
        const addedSecondShiftInRange = isCurrentTimeInRange(start2, end2, "four");
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
        const addedTimeinFirstShiftStart = moment(start1, "hh:mmA").subtract(afterAddHours, "hours");
        const addedTimeinSecondShiftStart = moment(start2, "hh:mmA").subtract(afterAddHours, "hours");
        const addedTimeinFirstShiftEnd = moment(end1, "hh:mmA").add(prevAddHours, "hours");
        const addedTimeinSecondShiftEnd = moment(end2, "hh:mmA").add(prevAddHours, "hours");
        const addedFirstShiftInRangeWithoutGrace = (secondshiftmode === "Continuous Shift" || secondshiftmode === "Double Shift") && isCurrentTimeInRangeNew(addedTimeinFirstShiftStart, mainshifttimespl[1], "onenew");
        const addedSecondShiftInRangeWithoutGrace = (secondshiftmode === "Continuous Shift" || secondshiftmode === "Double Shift") && isCurrentTimeInRangeNew(secondshifttimespl[0], addedTimeinSecondShiftEnd, "twomew");

        let buttonHideShow;
        if (addedFirstShiftInRangeWithoutGrace) {
          buttonHideShow = await fetchCheckinStatus(response?.data?.result?._id, `${moment(addedTimeinFirstShiftStart, "hh:mmA").format("HH:mm")} - ${moment(mainshifttimespl[1], "hh:mmA").format("HH:mm")}`, "one");
        } else if (addedSecondShiftInRangeWithoutGrace) {
          buttonHideShow = await fetchCheckinStatus(response?.data?.result?._id, `${moment(secondshifttimespl[0], "hh:mmA").format("HH:mm")} - ${moment(addedTimeinSecondShiftEnd, "hh:mmA").format("HH:mm")}`, "two");
        } else if (addedFirstShiftInRange) {
          buttonHideShow = await fetchCheckinStatus(response?.data?.result?._id, `${moment(addedTimeinFirstShiftStart, "hh:mmA").format("HH:mm")} - ${moment(addedTimeinFirstShiftEnd, "hh:mmA").format("HH:mm")}`, "three");
        } else if (addedSecondShiftInRange) {
          buttonHideShow = await fetchCheckinStatus(response?.data?.result?._id, `${moment(addedTimeinSecondShiftStart, "hh:mmA").format("HH:mm")} - ${moment(addedTimeinSecondShiftEnd, "hh:mmA").format("HH:mm")}`, "four");
        }
        let buttonName = buttonHideShow?.buttonname;

        const reslogstatus = response?.data?.result?.loginUserStatus.filter((data, index) => {
          return data.macaddress != "none";
        });
        const currentDay = new Date().toLocaleDateString("en-US", {
          weekday: "long",
        });
        // // Check if the current day matches any day in the array
        const currentDateStatusFinalUser = loginusershift?.data?.finaluser?.find((data) => data?.dayName === currentDay);
        const isCurrentDayInArray = response?.data?.result?.weekoff?.includes(currentDay) == true ? currentDateStatusFinalUser?.shift === "Week Off" : false;

        const holidayDate = res_status?.data?.holiday.filter((data, index) => {
          return (
            (data.company.includes(response?.data?.result?.company) &&
              data.applicablefor.includes(response?.data?.result?.branch) &&
              data.unit.includes(response?.data?.result?.unit) &&
              data.team.includes(response?.data?.result?.team) &&
              data.employee.includes(response?.data?.result?.companyname)) ||
            (data.company.includes(response?.data?.result?.company) &&
              data.applicablefor.includes(response?.data?.result?.branch) &&
              data.unit.includes(response?.data?.result?.unit) &&
              data.team.includes(response?.data?.result?.team) &&
              data.employee.includes("ALL"))
          );
        });
        if (holidayDate?.some((item) => moment(item.date).format("DD-MM-YYYY") == moment(currDate).format("DD-MM-YYYY"))) {
          holiday = true;
        }
        // if (response?.data?.result?.role?.includes("Manager")) {
        handleLogin(response, loginusershift);
        // }
        //  else if (
        //   (systemUsername === undefined || systemUsername === null) &&
        //   response?.data?.loginapprestriction === "desktopapponly"
        // ) {
        //   setErrorMessage("Login Restricted.Please SignIn Via HRMS App..");
        //   setislogin(true);
        // } else if (
        //   (systemUsername === undefined || systemUsername === null) &&
        //   response?.data?.loginapprestriction === "desktopurl" &&
        //   reslogstatus?.length === 0
        // ) {
        //   setErrorMessage("Login Restricted.Please SignIn Via HRMS App..");
        //   setislogin(true);
        // } else if (
        //   (systemUsername === undefined || systemUsername === null) &&
        //   response?.data?.loginapprestriction === "desktopurl" &&
        //   (resuseratt?.data?.attandances?.buttonstatus == "false" ||
        //     resuseratt?.data?.attandances == {} ||
        //     resuseratt?.data?.attandances?.buttonstatus === undefined) &&
        //   reslogstatus?.length === 0
        // ) {
        //   setErrorMessage("Login Restricted.Please SignIn Via HRMS App..");
        //   setislogin(true);
        // } else if (
        //   (systemUsername === undefined || systemUsername === null) &&
        //   response?.data?.loginapprestriction == "urlonly" &&
        //   reslogstatus?.length === 0
        // ) {
        //   setErrorMessage("Login Restricted.Please SignIn Via HRMS App..");
        //   setislogin(true);
        // } else if (
        //   systemUsername != undefined &&
        //   systemUsername != signin.username
        // ) {
        //   setErrorMessage("Login Restricted due to different username");
        //   setislogin(true);
        // } else if (!response?.data?.result?.role?.includes("Manager") && holiday) {
        //   console.log("1");
        //   if (
        //     response?.data?.result?.extrastatus &&
        //     (response?.data?.result?.extraTimeStatus?.length < 1 ||
        //       response?.data?.result?.extraTimeStatus?.length === undefined) &&
        //     (response?.data?.result?.extratimestatus === undefined ||
        //       response?.data?.result?.extratimestatus === "" ||
        //       ["permanent-used"].includes(
        //         response?.data?.result?.extratimestatus
        //       )) &&
        //     response?.data?.result?.extrapermanentdate !==
        //     moment().format("DD-MM-YYYY")
        //   ) {
        //     console.log("506");
        //     const date = new Date();
        //     const extraHoursMin = response?.data?.result?.extratime;
        //     const [hours, minutes] = extraHoursMin.split(":").map(Number);
        //     // Add hours and minutes to the date
        //     date.setHours(date.getHours() + hours);
        //     date.setMinutes(date.getMinutes() + minutes);
        //     const expDate = date;
        //     if (response?.data?.result?.extrastatus === "One Time") {
        //       let res = await axios.put(
        //         `${SERVICE.USER_SINGLE_PWD}/${userId}`,
        //         {
        //           extraTimeStatus: {
        //             sigindate: new Date(),
        //             status: "Active",
        //             resetstatus: response?.data?.result?.extrastatus,
        //             expireddate: expDate,
        //           },
        //           extratimestatus: "onetime-using",
        //         }
        //       );
        //       handleLogin(response, loginusershift);
        //     } else if (response?.data?.result?.extrastatus === "Permanent") {
        //       let res = await axios.put(
        //         `${SERVICE.USER_SINGLE_PWD}/${userId}`,
        //         {
        //           extraTimeStatus: {
        //             sigindate: new Date(),
        //             status: "Active",
        //             resetstatus: response?.data?.result?.extrastatus,
        //             expireddate: expDate,
        //           },
        //           extratimestatus: "permanent-using",
        //           extrapermanentdate: moment().format("DD-MM-YYYY"),
        //         }
        //       );
        //       handleLogin(response, loginusershift);
        //     }
        // else if (
        //       response?.data?.result?.extrastatus === "Manual" &&
        //       moment().format("YYYY-MM-DD") ===
        //       response?.data?.result?.extradate
        //     ) {
        //       let res = await axios.put(
        //         `${SERVICE.USER_SINGLE_PWD}/${userId}`,
        //         {
        //           extraTimeStatus: {
        //             sigindate: new Date(),
        //             status: "Active",
        //             resetstatus: response?.data?.result?.extrastatus,
        //             expireddate: expDate,
        //           },
        //           extratimestatus: "manual-using",
        //         }
        //       );
        //       handleLogin(response, loginusershift);
        //     } else {
        //       console.log("553");
        //       setErrorMessage("Today Holiday! Login Restricted");
        //       setislogin(true);
        //     }
        // }
        //   else if (
        //     response?.data?.result?.extrastatus &&
        //     response?.data?.result?.extraTimeStatus?.length > 0 &&
        //     !["onetime-used", "manual-used"]?.includes(
        //       response?.data?.result?.extratimestatus
        //     )
        //   ) {
        //     console.log("560");
        //     const ExpiredStatusData =
        //       response?.data?.result?.extraTimeStatus[0];
        //     if (
        //       response?.data?.result?.extrastatus === "One Time" &&
        //       new Date(ExpiredStatusData?.expireddate) >= new Date()
        //     ) {
        //       // console.log("21")
        //       handleLogin(response, loginusershift);
        //     } else if (
        //       response?.data?.result?.extrastatus === "Permanent" &&
        //       new Date(ExpiredStatusData?.expireddate) >= new Date()
        //     ) {
        //       // console.log("22")
        //       handleLogin(response, loginusershift);
        //     } else if (
        //       response?.data?.result?.extrastatus === "Manual" &&
        //       moment().format("YYYY-MM-DD") ===
        //       response?.data?.result?.extradate &&
        //       new Date(ExpiredStatusData?.expireddate) >= new Date()
        //     ) {
        //       console.log("580");
        //       handleLogin(response, loginusershift);
        //     } else {
        //       let res = await axios.put(
        //         `${SERVICE.USER_SINGLE_PWD}/${userId}`,
        //         {
        //           extraTimeStatus: [],
        //           extratimestatus:
        //             response?.data?.result?.extrastatus === "One Time"
        //               ? "onetime-used"
        //               : response?.data?.result?.extrastatus === "Permanent"
        //                 ? "permanent-used"
        //                 : response?.data?.result?.extrastatus === "Manual"
        //                   ? "manual-used"
        //                   : "",
        //         }
        //       );
        //       setErrorMessage("Today Holiday! Login Restricted");
        //       setislogin(true);
        //     }
        //   } else {
        //     console.log("600");
        //     setErrorMessage("Today Holiday! Login Restricted");
        //     setislogin(true);
        //   }
        // } else if (!response?.data?.result?.role?.includes("Manager") &&
        //   finalShift[0]?.shift === "Week Off"
        // ) {
        //   // console.log("2")
        //   if (
        //     response?.data?.result?.extrastatus &&
        //     (response?.data?.result?.extraTimeStatus?.length < 1 ||
        //       response?.data?.result?.extraTimeStatus?.length === undefined) &&
        //     (response?.data?.result?.extratimestatus === undefined ||
        //       response?.data?.result?.extratimestatus === "" ||
        //       ["permanent-used"].includes(
        //         response?.data?.result?.extratimestatus
        //       )) &&
        //     response?.data?.result?.extrapermanentdate !==
        //     moment().format("DD-MM-YYYY")
        //   ) {
        //     const date = new Date();
        //     const extraHoursMin = response?.data?.result?.extratime;
        //     const [hours, minutes] = extraHoursMin.split(":").map(Number);
        //     // Add hours and minutes to the date
        //     date.setHours(date.getHours() + hours);
        //     date.setMinutes(date.getMinutes() + minutes);
        //     const expDate = date;
        //     if (response?.data?.result?.extrastatus === "One Time") {
        //       let res = await axios.put(
        //         `${SERVICE.USER_SINGLE_PWD}/${userId}`,
        //         {
        //           extraTimeStatus: {
        //             sigindate: new Date(),
        //             status: "Active",
        //             resetstatus: response?.data?.result?.extrastatus,
        //             expireddate: expDate,
        //           },
        //           extratimestatus: "onetime-using",
        //         }
        //       );
        //       handleLogin(response, loginusershift);
        //     } else if (response?.data?.result?.extrastatus === "Permanent") {
        //       let res = await axios.put(
        //         `${SERVICE.USER_SINGLE_PWD}/${userId}`,
        //         {
        //           extraTimeStatus: {
        //             sigindate: new Date(),
        //             status: "Active",
        //             resetstatus: response?.data?.result?.extrastatus,
        //             expireddate: expDate,
        //           },
        //           extratimestatus: "permanent-using",
        //           extrapermanentdate: moment().format("DD-MM-YYYY"),
        //         }
        //       );
        //       handleLogin(response, loginusershift);
        //     } else if (
        //       response?.data?.result?.extrastatus === "Manual" &&
        //       moment().format("YYYY-MM-DD") ===
        //       response?.data?.result?.extradate
        //     ) {
        //       let res = await axios.put(
        //         `${SERVICE.USER_SINGLE_PWD}/${userId}`,
        //         {
        //           extraTimeStatus: {
        //             sigindate: new Date(),
        //             status: "Active",
        //             resetstatus: response?.data?.result?.extrastatus,
        //             expireddate: expDate,
        //           },
        //           extratimestatus: "manual-using",
        //         }
        //       );
        //       handleLogin(response, loginusershift);
        //     } else {
        //       setErrorMessage("Today WeekOff! Login Restricted!..");
        //       setislogin(true);
        //     }
        //   } else if (
        //     response?.data?.result?.extrastatus &&
        //     response?.data?.result?.extraTimeStatus?.length > 0 &&
        //     !["onetime-used", "manual-used"]?.includes(
        //       response?.data?.result?.extratimestatus
        //     )
        //   ) {
        //     const ExpiredStatusData =
        //       response?.data?.result?.extraTimeStatus[0];
        //     if (
        //       response?.data?.result?.extrastatus === "One Time" &&
        //       new Date(ExpiredStatusData?.expireddate) >= new Date()
        //     ) {
        //       handleLogin(response, loginusershift);
        //     } else if (
        //       response?.data?.result?.extrastatus === "Permanent" &&
        //       new Date(ExpiredStatusData?.expireddate) >= new Date()
        //     ) {
        //       handleLogin(response, loginusershift);
        //     } else if (
        //       response?.data?.result?.extrastatus === "Manual" &&
        //       moment().format("YYYY-MM-DD") ===
        //       response?.data?.result?.extradate &&
        //       new Date(ExpiredStatusData?.expireddate) >= new Date()
        //     ) {
        //       handleLogin(response, loginusershift);
        //     } else {
        //       let res = await axios.put(
        //         `${SERVICE.USER_SINGLE_PWD}/${userId}`,
        //         {
        //           extraTimeStatus: [],
        //           extratimestatus:
        //             response?.data?.result?.extrastatus === "One Time"
        //               ? "onetime-used"
        //               : response?.data?.result?.extrastatus === "Permanent"
        //                 ? "permanent-used"
        //                 : response?.data?.result?.extrastatus === "Manual"
        //                   ? "manual-used"
        //                   : "",
        //         }
        //       );
        //       setErrorMessage("Today WeekOff! Login Restricted!..");
        //       setislogin(true);
        //     }
        //   } else {
        //     setErrorMessage("Today WeekOff! Login Restricted!..");
        //     setislogin(true);
        //   }
        // } else if (updateCheckMainTiming && !holiday && !isCurrentDayInArray) {
        //   // console.log("3")
        //   if (
        //     Number(response?.data?.result?.employeecount) === 0 ||
        //     response?.data?.result?.employeecount === undefined
        //   ) {
        //     setErrorMessage(
        //       "System is not alloted.Please Contact Administrator"
        //     );
        //     setislogin(true);
        //   } else {
        //     handleLogin(response, loginusershift);
        //   }
        // } else {
        //   // console.log("4")
        //   if (
        //     response?.data?.result?.extrastatus &&
        //     (response?.data?.result?.extraTimeStatus?.length < 1 ||
        //       response?.data?.result?.extraTimeStatus?.length === undefined) &&
        //     (response?.data?.result?.extratimestatus === undefined ||
        //       response?.data?.result?.extratimestatus === "" ||
        //       ["permanent-used"].includes(
        //         response?.data?.result?.extratimestatus
        //       )) &&
        //     response?.data?.result?.extrapermanentdate !==
        //     moment().format("DD-MM-YYYY")
        //   ) {
        //     // console.log("4 1")
        //     const date = new Date();
        //     const extraHoursMin = response?.data?.result?.extratime;
        //     const [hours, minutes] = extraHoursMin.split(":").map(Number);
        //     // Add hours and minutes to the date
        //     date.setHours(date.getHours() + hours);
        //     date.setMinutes(date.getMinutes() + minutes);
        //     const expDate = date;

        //     if (response?.data?.result?.extrastatus === "One Time") {
        //       let res = await axios.put(
        //         `${SERVICE.USER_SINGLE_PWD}/${userId}`,
        //         {
        //           extraTimeStatus: {
        //             sigindate: new Date(),
        //             status: "Active",
        //             resetstatus: response?.data?.result?.extrastatus,
        //             expireddate: expDate,
        //           },
        //           extratimestatus: "onetime-using",
        //         }
        //       );
        //       handleLogin(response, loginusershift);
        //     } else if (response?.data?.result?.extrastatus === "Permanent") {
        //       let res = await axios.put(
        //         `${SERVICE.USER_SINGLE_PWD}/${userId}`,
        //         {
        //           extraTimeStatus: {
        //             sigindate: new Date(),
        //             status: "Active",
        //             resetstatus: response?.data?.result?.extrastatus,
        //             expireddate: expDate,
        //           },
        //           extratimestatus: "permanent-using",
        //           extrapermanentdate: moment().format("DD-MM-YYYY"),
        //         }
        //       );
        //       handleLogin(response, loginusershift);
        //     } else if (
        //       response?.data?.result?.extrastatus === "Manual" &&
        //       moment().format("YYYY-MM-DD") ===
        //       response?.data?.result?.extradate
        //     ) {
        //       let res = await axios.put(
        //         `${SERVICE.USER_SINGLE_PWD}/${userId}`,
        //         {
        //           extraTimeStatus: {
        //             sigindate: new Date(),
        //             status: "Active",
        //             resetstatus: response?.data?.result?.extrastatus,
        //             expireddate: expDate,
        //           },
        //           extratimestatus: "manual-using",
        //         }
        //       );
        //       handleLogin(response, loginusershift);
        //     } else if (
        //       response?.data?.result?.extrastatus === "" ||
        //       undefined
        //     ) {
        //       handleLogin(response, loginusershift);
        //     }
        //   } else if (
        //     response?.data?.result?.extrastatus &&
        //     response?.data?.result?.extraTimeStatus?.length > 0 &&
        //     !["onetime-used", "manual-used"]?.includes(
        //       response?.data?.result?.extratimestatus
        //     )
        //   ) {
        //     const ExpiredStatusData =
        //       response?.data?.result?.extraTimeStatus[0];
        //     if (
        //       response?.data?.result?.extrastatus === "One Time" &&
        //       new Date(ExpiredStatusData?.expireddate) >= new Date()
        //     ) {
        //       handleLogin(response, loginusershift);
        //     } else if (
        //       response?.data?.result?.extrastatus === "Permanent" &&
        //       new Date(ExpiredStatusData?.expireddate) >= new Date()
        //     ) {
        //       handleLogin(response, loginusershift);
        //     } else if (
        //       response?.data?.result?.extrastatus === "Manual" &&
        //       moment().format("YYYY-MM-DD") ===
        //       response?.data?.result?.extradate &&
        //       new Date(ExpiredStatusData?.expireddate) >= new Date()
        //     ) {
        //       handleLogin(response, loginusershift);
        //     } else if (
        //       response?.data?.result?.extrastatus === "" ||
        //       undefined
        //     ) {
        //       handleLogin(response, loginusershift);
        //     } else {
        //       // console.log("33");

        //       let res = await axios.put(
        //         `${SERVICE.USER_SINGLE_PWD}/${userId}`,
        //         {
        //           extraTimeStatus: [],
        //           extratimestatus:
        //             response?.data?.result?.extrastatus === "One Time"
        //               ? "onetime-used"
        //               : response?.data?.result?.extrastatus === "Permanent"
        //                 ? "permanent-used"
        //                 : response?.data?.result?.extrastatus === "Manual"
        //                   ? "manual-used"
        //                   : "",
        //         }
        //       );

        //       setErrorMessage("Shift Is Not Allotted.Contact Administrator");
        //       setislogin(true);
        //     }
        //   } else if (!response?.data?.result?.role?.includes("Manager") &&
        //     buttonName === "SHIFT CLOSED" &&
        //     new Date() < new Date(buttonHideShow?.calculatedshiftend) &&
        //     buttonHideShow?.buttonstatus === "false" &&
        //     response?.data?.loginapprestriction !== "urlonlywithoutauthentication"
        //   ) {
        //     setErrorMessage("Login Restricted!You Have Clocked Out!");
        //     setislogin(true);
        //     return;
        //   } else {
        //     setErrorMessage("Shift Is Not Allotted.Contact Administrator");
        //     setislogin(true);
        //   }
        // }
      }
    } catch (err) {
      console.log(err, "err");
      setislogin(true);
      const messages = err?.response?.data?.message;
      if (messages) {
        setErrorMessage(messages);
      } else {
        setErrorMessage("Something went wrong. Please check your connection!");
      }
      backPage("/signin");
    }
  };

  const handleLogin = async (response, loginusershift) => {
    // console.log(9)
    localStorage.setItem("APIToken", response?.data?.token);
    localStorage.setItem("LoginUserId", response?.data?.result?._id);
    localStorage.setItem("LoginUserrole", response?.data?.result?.role);
    localStorage.setItem("LoginUsercode", response?.data?.result?.empcode);

    const userId = response?.data?.result?._id;
    const userrole = response?.data?.result?.role;
    const userempcode = response?.data?.result?.empcode;

    const [
      loginuserdata,
      userroles,
      documents,
      allcompany,
      allbranch,
      allunit,
      allteam,
      allfloor,
      allarea,
      allareagrouping,
      alllocation,
      alllocationgrouping,
      alldepartment,
      alldesignation,
      alltooltip,
      listpageaccessmode,
      // allusersdata
    ] = await Promise.all([
      axios.get(`${AUTH.GETUSER}/${userId}`),
      axios.post(AUTH.GETAUTHROLE, {
        userrole: userrole,
      }),
      axios.post(AUTH.GETDOCUMENTS, {
        commonid: userId,
      }),
      axios.get(SERVICE.COMPANY),
      axios.get(SERVICE.BRANCH),
      axios.get(SERVICE.UNIT),
      axios.get(SERVICE.TEAMS),
      axios.get(SERVICE.FLOOR),
      axios.get(SERVICE.AREAS),
      axios.get(SERVICE.AREAGROUPING),
      axios.get(SERVICE.LOCATION),
      axios.get(SERVICE.LOCATIONGROUPING),
      axios.get(SERVICE.DEPARTMENT),
      axios.get(SERVICE.DESIGNATION),
      axios.get(SERVICE.TOOLTIPDESCRIPTIONS),
      axios.get(SERVICE.LISTPAGEACCESSMODES),
      // axios.get(SERVICE.ALLUSERSDATA)
    ]);
    const yesrtedayShifts = loginusershift?.data?.finaluser?.filter((data) => data?.formattedDate === yesterdayDateFormat);
    const todayShifts = loginusershift?.data?.finaluser?.filter((data) => data?.formattedDate === todayDateFormat);

    const isInYesterdayShift = await isCurrentTimeInShift(yesrtedayShifts?.length > 0 ? [yesrtedayShifts[yesrtedayShifts?.length - 1]] : []);

    const finalShift = isInYesterdayShift ? yesrtedayShifts : todayShifts;

    const mainshifttimespl = finalShift[0]?.shift != "Week Off" ? finalShift[0]?.shift?.split("to") : "";
    const secondshifttimespl = finalShift?.length > 1 ? finalShift[1]?.shift?.split("to") : "";

    const userassign = await fetchAllAssignBranch(loginuserdata?.data?.suser?.companyname, loginuserdata?.data?.suser?.empcode);
    let managerassign = [];
    await allcompany?.data?.companies.forEach((comp) => {
      allbranch?.data?.branch
        .filter((br) => br.company === comp.name)
        .forEach((br) => {
          allunit?.data?.units
            .filter((un) => un.branch === br.name)
            .forEach((un) => {
              managerassign.push({
                company: comp?.name,
                companycode: comp?.code,
                branch: br?.name,
                branchcode: br?.code,
                branchemail: br?.email,
                branchaddress: br?.address,
                branchstate: br?.state,
                branchcity: br?.city,
                branchcountry: br?.country,
                branchpincode: br?.pincode,
                unit: un?.name,
                unitcode: un?.code,
                _id: un?._id,
              });
            });
        });
    });
    setAllCompany(allcompany?.data?.companies);
    setAllBranch(allbranch?.data?.branch);
    setAllUnit(allunit?.data?.units);
    setListPageAccessMode(listpageaccessmode?.data?.listpageaccessmode);
    const answer = loginuserdata?.data?.suser?.role?.includes("Manager") ? managerassign : userassign;
    if (documents && documents.data) {
      setIsUserRoleAccess({
        ...loginuserdata?.data?.suser,
        files: documents?.data?.semployeedocument?.files,
        loginusershift: loginusershift?.data?.finaluser,
        profileimage: documents?.data?.semployeedocument?.profileimage,
        userdayshift: finalShift,
        mainshiftname: "",
        mainshifttiming: mainshifttimespl[0] + "-" + mainshifttimespl[1],
        issecondshift: finalShift?.length > 1 ? true : false,
        secondshiftmode: finalShift?.length > 1 ? (mainshifttimespl[1] === secondshifttimespl[0] ? "Continuous Shift" : "Double Shift") : "",
        secondshiftname: "",
        secondshifttiming: finalShift?.length > 1 ? secondshifttimespl[0] + "-" + secondshifttimespl[1] : "",
        accessbranch: answer,
      });
      setIsAssignBranch(answer);
    } else {
      setIsUserRoleAccess({
        ...loginuserdata?.data?.suser,
        files: [],
        profileimage: "",
        userdayshift: finalShift,
        mainshiftname: "",
        loginusershift: loginusershift?.data?.finaluser,
        mainshifttiming: mainshifttimespl[0] + "-" + mainshifttimespl[1],
        issecondshift: finalShift?.length > 1 ? true : false,
        secondshiftmode: finalShift?.length > 1 ? (mainshifttimespl[1] === secondshifttimespl[0] ? "Continuous Shift" : "Double Shift") : "",
        secondshiftname: "",
        secondshifttiming: finalShift?.length > 1 ? secondshifttimespl[0] + "-" + secondshifttimespl[1] : "",
        accessbranch: answer,
      });
      setIsAssignBranch(answer);
    }

    setAllTeam(allteam?.data?.teamsdetails);
    setIsUserRoleCompare(userroles?.data?.result);

    setAllFloor(allfloor?.data?.floors);
    setAllArea(allarea?.data?.areas);
    setAllAreagrouping(allareagrouping?.data?.areagroupings);
    setAllLocation(alllocation?.data?.locationdetails);
    setAllLocationgrouping(alllocationgrouping?.data?.locationgroupings);
    setAllDepartment(alldepartment?.data?.departmentdetails);
    setAllDesignation(alldesignation?.data?.designation);
    setTooltip(alltooltip?.data?.tooldescription);
    // Change login state
    setAuth({
      ...auth,
      loginState: true,
      APIToken: response.data.token,
      loginuserid: userId,
      loginuserrole: userrole,
      loginusercode: userempcode,
    });

    setislogin(true);
    backPage("/dashboard");
    const allusersdata = axios.get(SERVICE.ALLUSERSDATA);
    setAllUsersData(allusersdata?.data?.usersstatus);
    setSignin(response);

    // Perform remaining API requests asynchronously
    axios.get(AUTH.PROJECTLIMIT).then((response) => setAllprojects(response.data.projects));
    // .catch(err);

    axios.get(AUTH.ALLUSERLIMIT).then((response) => setallUsersLimit(response.data.users));
    // .catch(err);

    axios.get(AUTH.ALLTASKS).then((response) => setallTasks(response.data.task));
    // .catch(err);

    axios
      .post(AUTH.TASKSLIMIT, {
        userrole: String(userroles?.data?.result[0]?.accesss),
        userid: String(userId),
      })
      .then((response) => setalltaskLimit(response.data.taskfilter));
    // }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (signin.username === "" || signin.password === "") {
      setislogin(true);
      setErrorMessage("Please enter username and password");
    } else {
      setislogin(false);
      fetchHandler();
    }
  };
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 700);
    };

    handleResize(); // Call the handleResize function once to set the initial state
    window.addEventListener("resize", handleResize); // Listen for window resize events
    return () => {
      window.removeEventListener("resize", handleResize); // Clean up the event listener on component unmount
    };
  }, []);

  return (
    <>
      <Box
        sx={{
          marginY: "5%",
        }}
      >
        {isMobile ? (
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <br /> <br /> <br /> <br />
            <Box sx={loginSignIn.loginboxmedia}>
              {/* <Grid sx={{ display: "flex" }}> */}
              {islogin == false ? (
                <Box sx={{ width: "100%" }}>
                  <LinearProgress style={{ borderRadius: "9px" }} />
                </Box>
              ) : null}
              {/* </Grid> */}
              <Grid
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <form onSubmit={handleSubmit}>
                  <Typography variant="h4" sx={{ textAlign: "center", fontWeight: "bold" }}>
                    HI-HRMS
                  </Typography>
                  <br />
                  <br />
                  <br />
                  {/* <InputLabel htmlFor="outlined-adornment-amount">User Name</InputLabel> */}
                  <FormControl variant="outlined" fullWidth sx={{ maxWidth: "100%" }}>
                    <OutlinedInput
                      placeholder="User Name"
                      sx={{ paddingRight: "8px" }}
                      id="outlined-adornment-weight"
                      value={signin.username}
                      onChange={(e) => {
                        setSignin({ ...signin, username: e.target.value });
                        setErrorMessage("");
                      }}
                      endAdornment={
                        <InputAdornment position="end">
                          <PersonIcon sx={{ fontSize: "25px" }} />
                        </InputAdornment>
                      }
                      aria-describedby="outlined-weight-helper-text"
                      inputProps={{
                        "aria-label": "weight",
                      }}
                    />
                  </FormControl>
                  <br />
                  <br />
                  <br />
                  {/* <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel> */}
                  <FormControl variant="outlined" fullWidth sx={{ maxWidth: "100%" }}>
                    <OutlinedInput
                      placeholder="Password"
                      id="outlined-adornment-password"
                      type={showPassword ? "text" : "password"}
                      value={signin.password}
                      onChange={(e) => {
                        setSignin({ ...signin, password: e.target.value });
                        setErrorMessage("");
                      }}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end">
                            {!showPassword ? <VisibilityOff sx={{ fontSize: "25px" }} /> : <Visibility sx={{ fontSize: "25px" }} />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                  <br />
                  <br />
                  <br />
                  {showTwofa && (
                    <>
                      <FormControl variant="outlined" fullWidth sx={{ maxWidth: "100%" }}>
                        <OutlinedInput
                          placeholder="Please Enter 2FA OTP"
                          sx={{ paddingRight: "8px" }}
                          id="outlined-adornment-weight"
                          value={signin.twofaotp}
                          onChange={(e) => {
                            setSignin({ ...signin, twofaotp: e.target.value });
                            setErrorMessage("");
                          }}
                          endAdornment={
                            <InputAdornment position="end">
                              <PersonIcon sx={{ fontSize: "25px" }} />
                            </InputAdornment>
                          }
                          aria-describedby="outlined-weight-helper-text"
                          inputProps={{
                            "aria-label": "weight",
                          }}
                        />
                      </FormControl>
                      <br />
                      <br />
                      <br />
                    </>
                  )}
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Button variant="contained" type="submit" size="small" sx={loginSignIn.signinBtn}>
                      Sign in
                    </Button>
                    &emsp;
                  </Box>
                  {errorMessage && (
                    <div
                      className="alert alert-danger"
                      style={{
                        color: "red",
                        fontSize: "10px !important",
                        textAlign: "center",
                      }}
                    >
                      {errorMessage}
                    </div>
                  )}
                </form>
              </Grid>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              margin: "0 auto",
            }}
          >
            <br /> <br /> <br /> <br />
            <Box sx={loginSignIn.loginbox}>
              {/* <Grid sx={{ display: "flex" }}> */}
              {islogin == false ? (
                <Box sx={{ width: "100%" }}>
                  <LinearProgress style={{ borderRadius: "9px" }} />
                </Box>
              ) : null}
              {/* </Grid> */}
              <Grid
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "10px 40px 10px 5px",
                  "& .css-1mktpz ": { backgroundColor: "red" },
                }}
              >
                <img src={loginimg} style={{ width: "60%" }} />
                <form onSubmit={handleSubmit}>
                  <Typography variant="h4" sx={{ textAlign: "center", fontWeight: "bold" }}>
                    HI-HRMS
                  </Typography>
                  <br />
                  <br />
                  {/* <InputLabel htmlFor="outlined-adornment-amount">User Name</InputLabel> */}
                  <FormControl variant="outlined" fullWidth sx={{ maxWidth: "100%" }}>
                    <OutlinedInput
                      placeholder="User Name"
                      sx={{ paddingRight: "8px" }}
                      id="outlined-adornment-weight"
                      value={signin.username}
                      onChange={(e) => {
                        setSignin({ ...signin, username: e.target.value });
                        setErrorMessage("");
                      }}
                      endAdornment={
                        <InputAdornment position="end">
                          <PersonIcon sx={{ fontSize: "25px" }} />
                        </InputAdornment>
                      }
                      aria-describedby="outlined-weight-helper-text"
                      inputProps={{
                        "aria-label": "weight",
                      }}
                    />
                  </FormControl>
                  <br />
                  <br />
                  {/* <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel> */}
                  <FormControl variant="outlined" fullWidth sx={{ maxWidth: "100%" }}>
                    <OutlinedInput
                      placeholder="Password"
                      id="outlined-adornment-password"
                      type={showPassword ? "text" : "password"}
                      value={signin.password}
                      onChange={(e) => {
                        setSignin({ ...signin, password: e.target.value });
                        setErrorMessage("");
                      }}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end">
                            {!showPassword ? <VisibilityOff sx={{ fontSize: "25px" }} /> : <Visibility sx={{ fontSize: "25px" }} />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                  <br />
                  <br />
                  {showTwofa && (
                    <>
                      <FormControl variant="outlined" fullWidth sx={{ maxWidth: "100%" }}>
                        <OutlinedInput
                          placeholder="Please Enter 2FA OTP"
                          sx={{ paddingRight: "8px" }}
                          id="outlined-adornment-weight"
                          value={signin.twofaotp}
                          onChange={(e) => {
                            setSignin({ ...signin, twofaotp: e.target.value });
                            setErrorMessage("");
                          }}
                          endAdornment={
                            <InputAdornment position="end">
                              <PersonIcon sx={{ fontSize: "25px" }} />
                            </InputAdornment>
                          }
                          aria-describedby="outlined-weight-helper-text"
                          inputProps={{
                            "aria-label": "weight",
                          }}
                        />
                      </FormControl>
                      <br />
                      <br />
                      <br />
                    </>
                  )}
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Button variant="contained" type="submit" size="small" sx={loginSignIn.signinBtn}>
                      Sign in
                    </Button>
                    &emsp;
                  </Box>
                  {errorMessage && (
                    <div
                      className="alert alert-danger"
                      style={{
                        color: "red",
                        fontSize: "10px !imporant",
                        textAlign: "center",
                      }}
                    >
                      {errorMessage}
                    </div>
                  )}
                </form>
              </Grid>
            </Box>
            <br />
            <br />
          </Box>
        )}
        <br />
        <br />
        <Box>
          {/* ALERT DIALOG */}
          <Box>
            <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
              <DialogContent
                sx={{
                  width: "350px",
                  textAlign: "center",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6">{showAlert}</Typography>
              </DialogContent>
              <DialogActions>
                <Button variant="contained" color="error" onClick={handleCloseerr}>
                  ok
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </Box>
        <Footer />
      </Box>
    </>
  );
};
export default Signin;