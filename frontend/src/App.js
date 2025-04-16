import React, { useState, useMemo, useEffect, Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthContext, UserRoleAccessContext } from "./context/Appcontext";
import { AUTH } from "./services/Authservice";
import { SERVICE } from "./services/Baseservice";
import Webstock from "./routes/Webroutes";
import axios from "axios";
import Loading from "./Loading";
import { LoadingProvider, useLoading } from './components/ApiStatusContext';
import { setupAxiosInterceptors } from './components/AxiosInterceptors';
import {
  Box,
  Dialog,
  DialogContent,
  Button,
  DialogActions,
  Grid,
  Typography,
  TextareaAutosize,
} from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
const Applicationstack = React.lazy(() => import("./routes/Applicationstack"));
const Authstack = React.lazy(() => import("./routes/Authstack"));

function App() {
  const [auth, setAuth] = useState({

    loader: false,
    loginState: false,
    APIToken: "",
    loginuserid: "",
    loginusercode: "",
  });
  const [isUserRoleAccess, setIsUserRoleAccess] = useState({});
  const [allProjects, setAllprojects] = useState([]);
  const [alltaskLimit, setalltaskLimit] = useState([]);
  const [allTasks, setallTasks] = useState([]);
  const [allUsersLimit, setallUsersLimit] = useState([]);
  const [isUserRoleCompare, setIsUserRoleCompare] = useState([]);
  const [control, setcontrol] = useState({ loginapprestriction: "" });
  const [individual, setIndividual] = useState({ loginapprestriction: "" });
  const [pageName, setPageName] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [qrImage, setQrImage] = useState("");
  const [isAssignBranch, setIsAssignBranch] = useState([]);
  const [workStationSystemName, setWorkStationSystemName] = useState([]);
  const [allUsersData, setAllUsersData] = useState([]);
  const [allCompany, setAllCompany] = useState([]);
  const [allBranch, setAllBranch] = useState([]);
  const [allUnit, setAllUnit] = useState([]);
  const [allTeam, setAllTeam] = useState([]);
  const [allfloor, setAllFloor] = useState([]);
  const [allarea, setAllArea] = useState([]);
  const [allareagrouping, setAllAreagrouping] = useState([]);
  const [alllocation, setAllLocation] = useState([]);
  const [alllocationgrouping, setAllLocationgrouping] = useState([]);
  const [alldepartment, setAllDepartment] = useState([]);
  const [alldesignation, setAllDesignation] = useState([]);
  const [toolTip, setTooltip] = useState([]);
  const [listPageAccessMode, setListPageAccessMode] = useState({});
  const [buttonStyles, setButtonStyles] = useState({});


  const authContextData = useMemo(() => {
    return { auth, setAuth, qrImage, setQrImage };
  }, [
    auth,
    allProjects,
    isUserRoleCompare,
    alltaskLimit,
    allTasks,
    isAssignBranch,
    isUserRoleAccess,
    allUsersLimit,
    qrImage,
  ]);
  const applicationContextData = useMemo(() => {
    return {
      allUsersData,
      setAllUnit,
      setAllTeam,
      allBranch,
      setAllBranch,
      allTeam,
      setAllCompany,
      setAllUsersData,
      allUnit,
      allCompany,
      isUserRoleAccess,
      setIsUserRoleAccess,
      isAssignBranch,
      setIsAssignBranch,
      isUserRoleCompare,
      setIsUserRoleCompare,
      allProjects,
      setAllprojects,
      allUsersLimit,
      setallUsersLimit,
      alltaskLimit,
      setalltaskLimit,
      allTasks,
      setallTasks,
      allfloor, setAllFloor,
      allarea, setAllArea,
      allareagrouping, setAllAreagrouping,
      alllocation, setAllLocation,
      alllocationgrouping, setAllLocationgrouping,
      alldepartment, setAllDepartment,
      alldesignation, setAllDesignation,
      pageName, setPageName,
      toolTip,
      setTooltip, listPageAccessMode, setListPageAccessMode, buttonStyles, setButtonStyles
    };
  }, [
    pageName,
    auth,
    allUsersData,
    allBranch,
    allTeam,
    allUnit,
    allfloor,
    allCompany,
    allarea,
    allareagrouping,
    alllocation,
    alllocationgrouping,
    alldepartment,
    alldesignation,
    allProjects,
    isUserRoleCompare,
    alltaskLimit,
    allTasks,
    isUserRoleAccess,
    isAssignBranch,
    allUsersLimit,
    toolTip
  ]);

  const handleClickOpenerr = () => {
    setIsErrorOpen(!isUserRoleAccess?.role?.includes("Manager")
      &&
      individual ? (individual.loginapprestriction === "loginrestirct") : control.loginapprestriction === "loginrestirct"
    );
  };
  const handleCloseerr = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsErrorOpen(false);
    setcontrol({ ...control, loginapprestriction: "" }); // Clear loginapprestriction
    setIndividual({ ...individual, loginapprestriction: "" }); // Clear loginapprestriction
    logOut(); // Log out the user
  };
  useEffect(() => {
    setIsUserRoleAccess({ ...isUserRoleAccess, role: "Manager" })
  }, [])
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
  const fetchAllIndividualSettings = async () => {
    try {
      if (localStorage.length > 0) {
        let res = await axios.post(SERVICE.INDIVIDUAL_SETTINGS_COMPANY, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          companyname: isUserRoleAccess?.companyname
        });
        setPageName(!pageName)

        if (!isUserRoleAccess?.role?.includes("Manager")) {

          const ansswer = res?.data?.individualsettings;
          setIndividual(ansswer);
        } else {

          setIndividual({ ...individual, loginapprestriction: "" });
        }
        handleClickOpenerr()
      }
    } catch (err) {

      const messages = err?.response?.data?.message;
      if (messages) {
        console.log(messages, 'errrrrr');
      } else {
        console.log(messages, 'errr2');
      }
    }
  };
  // const fetchAllControlSettings = async () => {
  //   try {
  //     if (localStorage.length > 0) {
  //       let res = await axios.get(SERVICE.CONTROL_SETTINGS_LAST_INDEX, {
  //         headers: {
  //           Authorization: `Bearer ${auth.APIToken}`,
  //         },
  //       });
  //       // setIsUserRoleAccess({ ...isUserRoleAccess, role: "Manager" })
  //       setPageName(!pageName)

  //       if (!isUserRoleAccess?.role?.includes("Manager")) {

  //         const ansswer = res?.data?.overallsettings;
  //         setcontrol(ansswer);
  //       } else {

  //         setcontrol({ ...control, loginapprestriction: "" });
  //       }
  //       handleClickOpenerr()
  //     }
  //   } catch (err) {
  //     const messages = err?.response?.data?.message;
  //     if (messages) {
  //       console.log(messages);
  //     } else {
  //       console.log(messages);
  //     }
  //   }
  // };



  const fetchAllControlSettings = async () => {
    try {
      if (localStorage.length > 0) {
        let res = await axios.get(SERVICE.CONTROL_SETTINGS_LAST_INDEX, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
        const ansswer = res?.data?.overallsettings;

        setButtonStyles({
          btncancel: {
            backgroundColor:
              ansswer?.colorsandfonts?.clearcancelbgcolour || "#f4f4f4",
            color: ansswer?.colorsandfonts?.clearcancelfontcolour || "#444",
            boxShadow: "none",
            borderRadius: "3px",
            border: "1px solid #0000006b",
            "&:hover": {
              backgroundColor:
                ansswer?.colorsandfonts?.clearcancelbgcolour || "#f4f4f4", // Same as default
              color: ansswer?.colorsandfonts?.clearcancelfontcolour || "#444", // Same as default
            },
          },
          buttonsubmit: {
            backgroundColor:
              ansswer?.colorsandfonts?.submitbgcolour || "#1976d2",
            color: ansswer?.colorsandfonts?.submitfontcolour || "#ffffff",
            "&:hover": {
              backgroundColor:
                ansswer?.colorsandfonts?.submitbgcolour || "#1976d2",
              color: ansswer?.colorsandfonts?.submitfontcolour || "#ffffff",
            },
          },
          buttonbulkdelete: {
            backgroundColor:
              ansswer?.colorsandfonts?.bulkdeletebgcolour || "#d32f2f",
            color: ansswer?.colorsandfonts?.bulkdeletefontcolour || "#ffffff",
            textTransform: "capitalize",
            "&:hover": {
              backgroundColor:
                ansswer?.colorsandfonts?.bulkdeletebgcolour || "#d32f2f",
              color:
                ansswer?.colorsandfonts?.bulkdeletefontcolour || "#ffffff",
            },
          },
          buttonedit: {
            color: ansswer?.colorsandfonts?.editiconcolour || "#f4f4f4",
            fontSize: "large",
          },
          buttondelete: {
            color: ansswer?.colorsandfonts?.deleteiconcolour || "#f4f4f4",
            fontSize: "large",
          },
          buttonview: {
            color: ansswer?.colorsandfonts?.viewiconcolour || "#f4f4f4",
            fontSize: "large",
          },
          buttoninfo: {
            color: ansswer?.colorsandfonts?.infoiconcolour || "#f4f4f4",
            fontSize: "large",
          },
          pageheading: {
            fontSize: (() => {
              switch (
              ansswer?.colorsandfonts?.pageheadingfontsize ||
              "medium"
              ) {
                case "small":
                  return "15px"; // or your preferred size for "small"
                case "medium":
                  return "24px"; // or your preferred size for "medium"
                case "large":
                  return "30px"; // or your preferred size for "large"
                default:
                  return "24px"; // default to "medium" size
              }
            })(),
          },

          navbar: {
            backgroundColor:
              ansswer?.colorsandfonts?.navbgcolour || "#1976d2",
            color: ansswer?.colorsandfonts?.navfontcolour || "#ffffff",
          },
          companylogo: {
            backgroundColor:
              ansswer?.colorsandfonts?.companylogobfcolour || "#1976d2",
          },
        });
        setPageName(!pageName)

        if (!isUserRoleAccess?.role?.includes("Manager")) {

          const ansswer = res?.data?.overallsettings;
          setcontrol(ansswer);
        } else {

          setcontrol({ ...control, loginapprestriction: "" });
        }
        handleClickOpenerr()
      }
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        console.log(messages);
      } else {
        console.log(messages);
      }
    }
  };




  const logOut = async () => {
    try {
      await axios.get(AUTH.LOGOUT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      //change login state
      // backPage("/signin");
      window.location.href = `/signin`;
      setAuth({ ...auth, loginState: false });
      localStorage.clear();
      setcontrol({ ...control, loginapprestriction: "" })
      setIndividual({ ...individual, loginapprestriction: "" })


    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        console.log(messages);
      } else {
        console.log(messages);
      }
    }
  };

  useEffect(() => {

    fetchListPageAccessMode();
  }, []);

  useEffect(() => {
    fetchAllControlSettings();
    fetchAllIndividualSettings();
  }, []);


  const fetchListPageAccessMode = async () => {
    try {
      let res = await axios.get(`${SERVICE.LISTPAGEACCESSMODES}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let sorted = res?.data?.listpageaccessmode;
      setListPageAccessMode(sorted);
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        console.log(messages);
      } else {
        console.log(messages);
      }
    }
  };
  // get all assignBranches
  // const fetchAllAssignBranch = async (name, code) => {
  //   try {
  //     let res = await axios.post(SERVICE.GETUSERASSIGNBRANCH, {
  //       headers: {
  //         Authorization: `Bearer ${auth.APIToken}`,
  //       },
  //       empcode: code,
  //       empname: name
  //     });

  //     const ansswer = res?.data?.assignbranch.map((data, index)=>{
  //       return {tocompany:data.company, tobranch:data.branch, tounit:data.unit,companycode:data.companycode,
  //         branchcode:data.branchcode, branchemail:data.branchemail,branchaddress:data.branchaddress, branchstate:data.branchstate,
  //         branchcity:data.branchcity,branchcountry:data.branchcountry, branchpincode:data.branchpincode, unitcode:data.unitcode,
  //         employee:data.employee, employeecode:data.employeecode,company:data.fromcompany,branch:data.frombranch,
  //         unit:data.fromunit, _id:data._id
  //       }
  //     });
  //     return ansswer?.length > 0 ? ansswer : [];
  //   } catch (err) {
  //     const messages = err?.response?.data?.message;
  //     if (messages) {
  //       console.log(messages);
  //     } else {
  //       console.log(messages);
  //     }
  //   }
  // };


  const fetchAllAssignBranch = async (name, code) => {
    try {
      let res = await axios.post(SERVICE.GETUSERASSIGNBRANCH, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        empcode: code,
        empname: name
      });

      const ansswer = res?.data?.assignbranch.map((data, index) => {
        return {
          tocompany: data.company, tobranch: data.branch, tounit: data.unit, companycode: data.companycode,
          branchcode: data.branchcode, branchemail: data.branchemail, branchaddress: data.branchaddress, branchstate: data.branchstate,
          branchcity: data.branchcity, branchcountry: data.branchcountry, branchpincode: data.branchpincode, unitcode: data.unitcode,
          employee: data.employee, employeecode: data.employeecode, company: data.fromcompany, branch: data.frombranch,
          unit: data.fromunit,
          modulenameurl: data.modulenameurl,
          submodulenameurl: data.submodulenameurl,
          mainpagenameurl: data.mainpagenameurl,
          subpagenameurl: data.subpagenameurl,
          subsubpagenameurl: data.subsubpagenameurl,
          _id: data._id
        }
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

  useEffect(() => {
    isCheckUserLogin();
  }, []);

  const isCurrentTimeInShift = async (shifts) => {
    if (shifts) {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentInMinutes = currentHour * 60 + currentMinute;

      for (let shift of shifts) {
        if (shift?.shift === "Week Off") {
          continue;
        }
        const [startTime, endTime] = shift?.shift?.split("to");

        // Function to convert time string to hour and minute

        const parseTime = (time) => {
          if (!time) {
            // Return a default value or null
            return { hours: 0, minutes: 0 };
          }

          const match = time.match(/(\d+):(\d+)(AM|PM)/);
          if (!match) {
            // Return a default value or null
            return { hours: 0, minutes: 0 };
          }

          let [hours, minutes] = match.slice(1, 3).map(Number);
          const period = match[3];

          if (period === "PM" && hours !== 12) hours += 12;
          if (period === "AM" && hours === 12) hours = 0;

          return { hours, minutes };
        };

        const start = parseTime(startTime);
        const end = parseTime(endTime);

        // Check if the shift starts in PM and ends in AM
        if (start.hours >= 12 && end.hours < 12) {
          // Calculate the end time in minutes
          const endInMinutes = end.hours * 60 + end.minutes;

          // Check if current time falls within 12:00 AM to end time
          if (currentInMinutes < endInMinutes) {
            return true;
          }
        }
      }
      return false;
    } else {
      return false;
    }
  };
  const isCheckUserLogin = async () => {
    setAuth({ ...auth, loader: true });
    let getApiToken = localStorage.getItem("APIToken");
    let getLoginUserid = localStorage.getItem("LoginUserId");
    let getLoginUserRole = localStorage.getItem("LoginUserrole");
    let getLoginUserCode = localStorage.getItem("LoginUsercode");
    const outputArray = getLoginUserRole?.split(",");
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
      const shiftMode = "Main Shift";

      daysArray.push({ formattedDate, dayName, dayCount, shiftMode });

      // Move to the next day
      startMonthDate.setDate(startMonthDate.getDate() + 1);
    }
    if (getApiToken) {
      try {
        const [
          loginuserdata,
          userrole,
          documents,
          loginusershift,
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
          allusersdata
        ] = await Promise.all([
          axios.get(`${AUTH.GETUSER}/${getLoginUserid}`, {
            headers: {
              Authorization: `Bearer ${getApiToken}`,
            },
          }),
          axios.post(AUTH.GETAUTHROLE, {
            userrole: outputArray,
          }),
          axios.post(AUTH.GETDOCUMENTS, {
            commonid: getLoginUserid,
          }),
          axios.post(SERVICE.USER_CLOCKIN_CLOCKOUT_STATUS_CHECKLOGIN, {
            userDates: daysArray,
            empcode: getLoginUserCode,
          }),
          axios.get(SERVICE.COMPANY, {
            headers: {
              Authorization: `Bearer ${getApiToken}`,
            },
          }),
          axios.get(SERVICE.BRANCH, {
            headers: {
              Authorization: `Bearer ${getApiToken}`,
            },
          }),
          axios.get(SERVICE.UNIT, {
            headers: {
              Authorization: `Bearer ${getApiToken}`,
            },
          }),
          axios.get(SERVICE.TEAMS, {
            headers: {
              Authorization: `Bearer ${getApiToken}`,
            },
          }),
          axios.get(SERVICE.FLOOR, {
            headers: {
              Authorization: `Bearer ${getApiToken}`,
            },
          }),
          axios.get(SERVICE.AREAS, {
            headers: {
              Authorization: `Bearer ${getApiToken}`,
            },
          }),
          axios.get(SERVICE.AREAGROUPING, {
            headers: {
              Authorization: `Bearer ${getApiToken}`,
            },
          }),
          axios.get(SERVICE.LOCATION, {
            headers: {
              Authorization: `Bearer ${getApiToken}`,
            },
          }),
          axios.get(SERVICE.LOCATIONGROUPING, {
            headers: {
              Authorization: `Bearer ${getApiToken}`,
            },
          }),
          axios.get(SERVICE.DEPARTMENT, {
            headers: {
              Authorization: `Bearer ${getApiToken}`,
            },
          }),
          axios.get(SERVICE.DESIGNATION, {
            headers: {
              Authorization: `Bearer ${getApiToken}`,
            },
          }),
          axios.get(SERVICE.TOOLTIPDESCRIPTIONS, {
            headers: {
              Authorization: `Bearer ${getApiToken}`,
            },
          }),
          axios.get(SERVICE.ALLUSERSDATA, {
            headers: {
              Authorization: `Bearer ${getApiToken}`,
            },
          }),
        ]);

        const yesrtedayShifts = loginusershift?.data?.finaluser?.filter(
          (data) => data?.formattedDate === yesterdayDateFormat
        );
        const todayShifts = loginusershift?.data?.finaluser?.filter(
          (data) => data?.formattedDate === todayDateFormat
        );

        const isInYesterdayShift = await isCurrentTimeInShift(
          yesrtedayShifts?.length > 0
            ? [yesrtedayShifts[yesrtedayShifts?.length - 1]]
            : []
        );

        const finalShift = isInYesterdayShift ? yesrtedayShifts : todayShifts;

        const mainshifttimespl =
          finalShift[0]?.shift != "Week Off"
            ? finalShift[0]?.shift?.split("to")
            : "";
        const secondshifttimespl =
          finalShift?.length > 1 ? finalShift[1]?.shift?.split("to") : "";
        const userassign = await fetchAllAssignBranch(
          loginuserdata?.data?.suser?.companyname,
          loginuserdata?.data?.suser?.empcode
        );
        let managerassign = [];
        await allcompany?.data?.companies.forEach(comp => {
          allbranch?.data?.branch
            .filter(br => br.company === comp.name)
            .forEach(br => {
              allunit?.data?.units
                .filter(un => un.branch === br.name)
                .forEach(un => {
                  managerassign.push({
                    company: comp.name,
                    companycode: comp.code,
                    branch: br.name,
                    branchcode: br.code,
                    branchemail: br.email,
                    branchaddress: br.address,
                    branchstate: br.state,
                    branchcity: br.city,
                    branchcountry: br.country,
                    branchpincode: br.pincode,
                    unit: un.name,
                    unitcode: un.code
                  });
                });
            });
        });
        const answer = loginuserdata?.data?.suser?.role?.includes("Manager") ? managerassign : userassign
        if (documents && documents.data) {
          setIsUserRoleAccess({
            ...loginuserdata?.data?.suser,
            files: documents?.data?.semployeedocument?.files,
            profileimage: documents?.data?.semployeedocument?.profileimage,
            userdayshift: finalShift,
            mainshiftname: "",
            loginusershift: loginusershift?.data?.finaluser,
            mainshifttiming: mainshifttimespl[0] + "-" + mainshifttimespl[1],
            issecondshift: finalShift?.length > 1 ? true : false,
            secondshiftmode:
              finalShift?.length > 1
                ? mainshifttimespl[1] === secondshifttimespl[0]
                  ? "Continuous Shift"
                  : "Double Shift"
                : "",
            secondshiftname: "",
            secondshifttiming:
              finalShift?.length > 1
                ? secondshifttimespl[0] + "-" + secondshifttimespl[1]
                : "",
            accessbranch: answer,
          });
          setIsAssignBranch(answer);
        } else {
          setIsUserRoleAccess({
            ...loginuserdata?.data?.suser,
            files: [],
            profileimage: "",
            loginusershift: loginusershift?.data?.finaluser,
            userdayshift: finalShift,
            mainshiftname: "",
            mainshifttiming: mainshifttimespl[0] + "-" + mainshifttimespl[1],
            issecondshift: finalShift?.length > 1 ? true : false,
            secondshiftmode:
              finalShift?.length > 1
                ? mainshifttimespl[1] === secondshifttimespl[0]
                  ? "Continuous Shift"
                  : "Double Shift"
                : "",
            secondshiftname: "",
            secondshifttiming:
              finalShift?.length > 1
                ? secondshifttimespl[0] + "-" + secondshifttimespl[1]
                : "",
            accessbranch: answer,
          });
          setIsAssignBranch(answer);
        }
        setAllUsersData(allusersdata?.data?.usersstatus);
        setAllTeam(allteam?.data?.teamsdetails);
        setAllFloor(allfloor?.data?.floors);
        setAllArea(allarea?.data?.areas);
        setAllAreagrouping(allareagrouping?.data?.areagroupings);
        setAllLocation(alllocation?.data?.locationdetails);
        setAllLocationgrouping(alllocationgrouping?.data?.locationgroupings);
        setAllDepartment(alldepartment?.data?.departmentdetails);
        setAllDesignation(alldesignation?.data?.designation);
        setIsUserRoleCompare(userrole?.data?.result);
        setAllCompany(allcompany?.data?.companies);
        setAllBranch(allbranch?.data?.branch);
        setAllUnit(allunit?.data?.units);
        setTooltip(alltooltip?.data?.tooldescription);

        setAuth((prevAuth) => {
          return {
            ...prevAuth,
            loader: false,
            loginState: true,
            APIToken: getApiToken,
            loginuserid: getLoginUserid,
            loginuserrole: getLoginUserRole,
            loginusercode: getLoginUserCode,
          };
        });
        axios
          .get(AUTH.ALLUSERLIMIT)
          .then((response) => setallUsersLimit(response.data.users));

      } catch (err) {
        setAuth({ ...auth, loader: false, loginState: false });
        const messages = err?.response?.data?.message;
        if (messages) {
          console.log(messages);
        } else {
          console.log("Something went wrong check connection!");
        }
      }
    } else {
      setAuth({ ...auth, loader: false, loginState: false });
    }
  };
  const { setLoading } = useLoading();

  useEffect(() => {
    setupAxiosInterceptors(setLoading);
  }, [setLoading]);

  return (
    <>
      <div>
        <AuthContext.Provider value={authContextData}>
          <UserRoleAccessContext.Provider value={applicationContextData}>
            <BrowserRouter basename={process.env.PUBLIC_URL}>
              {!auth.loginState ? (
                <Suspense fallback={<Loading />}>
                  <Authstack />
                </Suspense>
              ) : (
                <Suspense fallback={<Loading />}>
                  {" "}
                  <Applicationstack />
                </Suspense>
              )}
            </BrowserRouter>
          </UserRoleAccessContext.Provider>
        </AuthContext.Provider>
      </div>
      <Box>
        <Dialog
          open={isErrorOpen}

          onClose={handleCloseerr}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent
            sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
          >

            <LockOutlinedIcon sx={{ color: "#b34343" }} />

            <Typography variant="h6" sx={{ display: "flex", paddingTop: "9px", alignItems: "center", justifyContent: "center" }}>

              {"Login Restricted"}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error" size="small" onClick={handleCloseerr}>
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}

export default function RootApp() {
  return (
    <>

      <LoadingProvider>
        <App />
      </LoadingProvider>
      <Webstock />
    </>

  );
}