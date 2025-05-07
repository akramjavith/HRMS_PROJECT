import React, { useState, useEffect, useContext } from "react";
import Navbar from "./Navbar";
import { Box, Paper, MenuItem, FormControl, Grid, Button } from "@mui/material";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import { MultiSelect } from "react-multi-select-component";
import { handleApiError } from "./Errorhandling";
import Popper from "@mui/material/Popper";
import MenuList from "@mui/material/MenuList";
import { UserRoleAccessContext, AuthContext } from "../context/Appcontext";
import Stack from "@mui/material/Stack";
import { userStyle } from "../pageStyle";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AUTH } from "../services/Authservice";
import Badge from "@mui/material/Badge";
import Menu from "@mui/material/Menu";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import moment from "moment-timezone";
import { useLoading } from "./ApiStatusContext";
import { SERVICE } from "../services/Baseservice";

const ITEM_HEIGHT = 40;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 5.5 + ITEM_PADDING_TOP,
      width: 200,
    },
  },
};

const Navnew = ({ headerHeight }) => {

  const { auth, setAuth } = useContext(AuthContext);

  const {
    isUserRoleAccess,
    isUserRoleCompare,
    setIsAssignBranch,
    isAssignBranch,
    listPageAccessMode,
  } = useContext(UserRoleAccessContext);

  const { v4: uuidv4 } = require('uuid');

  const accessbranchs = isUserRoleAccess?.role?.includes("Manager")
    ? isAssignBranch?.map((data) => ({
      branch: data.branch,
      company: data.company,
      unit: data.unit,
    }))
    : isAssignBranch
      ?.filter((data) => {
        let fetfinalurl = [];

        if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.mainpagenameurl?.length !== 0 &&
          data?.subpagenameurl?.length !== 0 &&
          data?.subsubpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.subsubpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.mainpagenameurl?.length !== 0 &&
          data?.subpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.subpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.mainpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.mainpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.submodulenameurl;
        } else if (data?.modulenameurl?.length !== 0) {
          fetfinalurl = data.modulenameurl;
        } else {
          fetfinalurl = [];
        }

        const remove = [
          "/settings/templatelist",
          "settings/templatelist",
        ];
        return fetfinalurl?.some((item) => remove?.includes(item));
      })
      ?.map((data) => ({
        branch: data.branch,
        company: data.company,
        unit: data.unit,
      }));

  const [widthsize, setWidthsize] = useState("");
  let listpageaccessby =
    listPageAccessMode?.find(
      (data) =>
        data.modulename === "Human Resources" &&
        data.submodulename === "HR" &&
        data.mainpagename === "Employee" &&
        data.subpagename === "Notice Period" &&
        data.subsubpagename === "Notice Period List Hierarchy"
    )?.listpageaccessmode || "Overall";

  const backPage = useNavigate();

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [raiseTicketList, setRaiseTicketList] = useState("");
  const [autoLogoutSwitch, setAutoLogoutSwitch] = useState("");
  const [autoLogoutMins, setAutoLogoutMins] = useState("");
  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  //AUTO LOGOUT IF USER INACTIVE
  useEffect(() => {
    fetchAllNotificationDatas();
    fetchAutoLogout();
    fetchOverAllSettings();

  }, []);

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);

  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  const [overallSettings, setOverAllsettingsCount] = useState({});

  const fetchOverAllSettings = async () => {
    try {
      let res = await axios.get(`${SERVICE.GET_OVERALL_SETTINGS}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setOverAllsettingsCount(res?.data?.overallsettings[0]);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const fetchAutoLogout = async () => {
    try {
      let res = await axios.get(`${SERVICE.GET_AUTOLOGOUT}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let singleData = res?.data?.autologout[
        res?.data?.autologout.length - 1
      ]?.todos?.find((item) => item?.employeedbid === isUserRoleAccess?._id);

      if (singleData !== undefined) {
        setAutoLogoutMins(singleData?.autologoutmins);
        setAutoLogoutSwitch(singleData?.autologoutswitch);
      } else {
        setAutoLogoutMins(
          res?.data?.autologout[res?.data?.autologout.length - 1]
            ?.autologoutmins
        );
        setAutoLogoutSwitch(
          res?.data?.autologout[res?.data?.autologout.length - 1]
            ?.autologoutswitch
        );
      }
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const inactivityTimeout = autoLogoutMins * 60 * 1000;
  let inactivityTimer;
  // const handleUserActivity = () => {
  //     clearTimeout(inactivityTimer);
  //     inactivityTimer = setTimeout(logOut, inactivityTimeout);
  // };
  // useEffect(() => {
  //     const startAutoLogout = () => {
  //         if (autoLogoutSwitch) {
  //             window.addEventListener("mousemove", handleUserActivity);
  //             window.addEventListener("keydown", handleUserActivity);
  //             inactivityTimer = setTimeout(logOut, inactivityTimeout);
  //         }
  //     };

  //     const stopAutoLogout = () => {
  //         window.removeEventListener("mousemove", handleUserActivity);
  //         window.removeEventListener("keydown", handleUserActivity);
  //         clearTimeout(inactivityTimer);
  //     };

  //     startAutoLogout();

  //     return () => {
  //         stopAutoLogout();
  //     };
  // }, [autoLogoutSwitch, autoLogoutMins]);

  const { loading } = useLoading();

  const handleUserActivity = () => {
    // Log the current loading state for debugging

    // Clear the previous timer on user activity
    clearTimeout(inactivityTimer);

    // Only restart the timer if the app is not loading
    if (!loading) {
      inactivityTimer = setTimeout(logOut, inactivityTimeout);
    } else {
    }
  };

  useEffect(() => {
    const startAutoLogout = () => {
      if (autoLogoutSwitch) {
        // Attach event listeners to detect user activity
        window.addEventListener("mousemove", handleUserActivity);
        window.addEventListener("keydown", handleUserActivity);

        // If not loading, start the inactivity timer
        if (!loading) {
          inactivityTimer = setTimeout(logOut, inactivityTimeout);
        }
      }
    };

    const stopAutoLogout = () => {
      // Remove the event listeners
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);

      // Clear any existing inactivity timer
      clearTimeout(inactivityTimer);
    };

    startAutoLogout();

    // Cleanup function
    return () => {
      stopAutoLogout();
    };
  }, [autoLogoutSwitch, autoLogoutMins, loading]);
  //get all project.
  const fetchAllRaisedTicketsed = async () => {
    try {
      const [res_queue, res_category] = await Promise.all([
        axios.get(SERVICE.RAISETICKET_WITHOUT_CLOSED, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
        axios.get(SERVICE.TEAMGROUPING, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
      ]);

      const updatedAns1 = res_queue?.data.raisetickets.map((item) => {
        if (
          item.raiseTeamGroup === "Manual" &&
          item.forwardedemployee.length < 1
        ) {
          return {
            ...item,
            resolverperson: [...item.employeenameRaise, item.teamgroupname],
          };
        } else if (item.forwardedemployee.length > 0) {
          return {
            ...item,
            resolverperson: item.forwardedemployee,
          };
        } else {
          const matchingItem = res_category?.data?.teamgroupings.find(
            (bItem) =>
              bItem.categoryfrom.includes(item.category) &&
              bItem.subcategoryfrom.includes(item.subcategory) &&
              bItem.typefrom.includes(item.type) &&
              ["Open", "Forwarded", "Hold"].includes(item.raiseself) &&
              bItem.employeenamefrom.some((emp) =>
                item.employeename.includes(emp)
              )
          );
          if (matchingItem) {
            return {
              ...item,
              resolverperson: matchingItem.employeenameto,
            };
          }
        }
      });
      const filteredArray = updatedAns1.filter(
        (element) => element !== undefined
      );

      //General
      let allraiseres = res_queue?.data.raisetickets;

      let answerRaiseFilter = filteredArray?.filter(
        (data, index) =>
          data.raiseself !== "Resolved" &&
          data.raiseself !== "Reject" &&
          data.raiseself !== "Closed" &&
          data.resolverperson.includes(isUserRoleAccess.companyname)
      );
      setRaiseTicketList(
        isUserRoleAccess?.role?.includes("Manager")
          ? allraiseres.length
          : answerRaiseFilter.length
      );
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const updateIdleEndTime = async () => {
    await axios.post(SERVICE.USER_IDLETIME_UPDATE_ENDTIME, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      userId: localStorage.LoginUserId,
      endTime: new Date(),
    });
  }

  const logOut = async () => {
    try {
      await axios.get(AUTH.LOGOUT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      updateIdleEndTime();
      //change login state
      backPage("/signin");
      setAuth({ ...auth, loginState: false });
      localStorage.clear();
      // Clear the login tabs array from localStorage
      localStorage.removeItem('loginTabs');
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [usageCountAll, setUsageCountAll] = useState([])

  const fetchUsageAll = async () => {
    try {
      let res_usagecount = await axios.post(SERVICE.STOCKPURCHASELIMITED_USAGE_COUNT_NOTIFICATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        username: isUserRoleAccess?.companyname,
      });
      setUsageCountAll(res_usagecount.data?.stock)

    } catch (err) {


    }
  }

  useEffect(() => {
    fetchAllRaisedTicketsed();
    // fetchLeaveVerification();
    getScreenedCandidate();
    fetchMyVerification();
    fetchNoticeApplyHierarchy();
    fetchMyAsset();
    fetchApplyleave();
    fetchTeamShiftVerification();
    fetchApplyPermission();
    fetchAppovalStatusDocument();
    fetchUsageAll();


  }, []);

  const [leaveCount, setLeaveCount] = useState(0);
  const [shiftcount, setShiftcount] = useState(0);
  const [permissionCount, setPermissionCount] = useState(0);
  const [myinterviewCount, setMyInterviewCount] = useState(0);
  const [myVerificationCount, setMyVerificationCount] = useState(0);
  const [myNoticePeriodCount, setmyNoticePeriodCount] = useState(0);
  const [myDocumentsPending, setMyDocumentsPending] = useState(0);
  const [myVerificationChecklistCount, setMyVerificationChecklistCount] =
    useState(0);
  const [noticeperiodScheduledInterviewCount, setNoticeperiodScheduledInterviewCount] =
    useState(0);
  const [exitInterviewCount, setExitInterviewCount] =
    useState(0);
  const [isInterviewer, setIsInterviewer] = useState(false);
  const [myAssetCount, setMyAssetCount] =
    useState(0);
  const fetchAllNotificationDatas = async () => {
    const accessbranch = isAssignBranch?.map(({ branch, company, unit }) => ({
      branch,
      company,
      unit,
    }));

    const aggregationPipeline = [
      {
        $match: {
          meetingscheduled: true,
          $or: [
            { meetingcompleted: false },
            { meetingcompleted: { $exists: false } }
          ]

        },
      },
      {
        $project: {
          empname: 1,
          empcode: 1,
          companyname: 1,
          hrupload: 1,
          reasonleavingname: 1,
          noticedate: 1,
          approvenoticereq: 1,
          company: 1,
          branch: 1,
          unit: 1,
          team: 1,
          department: 1,
          noticedate: 1,
          status: 1,
          requestdate: 1,
          requestdatereason: 1,
          requestdatestatus: 1,
          cancelstatus: 1,
          continuestatus: 1,
          meetingscheduled: 1,
          meetingremarks: 1,
          meetingcompleted: 1,
          interviewer: 1,
          interviewscheduled: 1,
          interviewForm: 1
        },
      },
    ];

    try {
      console.time("startNew");

      const [res, resNew, resScheduled] = await Promise.all([
        axios.post(
          SERVICE.FETCHALLNOTIFICATIONDATAS,
          { assignbranch: accessbranch },
          { headers: { Authorization: `Bearer ${auth.APIToken}` } }
        ),
        axios.post(
          SERVICE.PENDINGLONGABSENTCHECKLIST,
          {
            assignbranch: accessbranch,
          },
          { headers: { Authorization: `Bearer ${auth.APIToken}` } }
        ),
        axios.post(
          SERVICE.DYNAMICNOTICEPERIODAPPLIES,
          {
            aggregationPipeline,
          },
          { headers: { Authorization: `Bearer ${auth.APIToken}` } }
        ),
      ]);

      let iterviewDatas = resScheduled?.data?.users?.filter((item) => {
        return item?.interviewscheduled && (!item?.interviewForm || item?.interviewForm?.length === 0)
      });

      let meetingDatas = resScheduled?.data?.users?.filter((item) => {
        return item?.meetingscheduled && (!item?.meetingcompleted || item?.meetingcompleted === false)
      });


      let countingDatasMeeting = meetingDatas?.reduce((acc, current) => {
        if (current?.empname === isUserRoleAccess?.companyname) {
          acc += 1;
        }
        if (current?.interviewer?.includes(isUserRoleAccess?.companyname)) {
          acc += 1;
        }
        return acc;
      }, 0);

      let countingDatasInterview = iterviewDatas?.reduce((acc, current) => {
        if (current?.empname === isUserRoleAccess?.companyname) {
          acc += 1;
        }
        if (current?.interviewer?.includes(isUserRoleAccess?.companyname)) {
          acc += 1;
          setIsInterviewer(true);
        }
        return acc;
      }, 0);


      setNoticeperiodScheduledInterviewCount(countingDatasMeeting);
      setExitInterviewCount(countingDatasInterview);

      // Reusable function to process derived data
      const filterEmptyGroups = (dataArray) =>
        (dataArray || [])
          .map(({ groups, empname }) => ({
            empname,
            groups: groups?.filter((item) =>
              item.checklist === "Attachments" ? !item.files : !item.data
            ),
          }))
          .filter(({ groups }) => groups.length > 0)
          .filter(({ groups }) =>
            groups.some((group) =>
              group?.employee?.includes(isUserRoleAccess?.companyname)
            )
          );

      // Process derived data
      const filteredDatasExit = filterEmptyGroups(res?.data?.derivedDatasExit);


      const filteredDatasLeave = filterEmptyGroups(
        res?.data?.derivedDatasLeave
      );


      const filteredDatasPermission = filterEmptyGroups(
        res?.data?.derivedDatasPermission
      );


      const filteredDatasWfh = filterEmptyGroups(
        res?.data?.derivedDatasWfh
      );
      const filteredDatasLongAbsent = filterEmptyGroups(
        resNew?.data?.derivedDatas
      );



      // Set verification checklist count
      setMyVerificationChecklistCount(
        filteredDatasExit.length +
        filteredDatasLeave.length +
        filteredDatasPermission.length +
        filteredDatasLongAbsent.length +
        filteredDatasWfh.length
      );

      console.timeEnd("startNew");
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };



  const fetchMyVerification = async () => {
    try {
      let res_TemplateList = await axios.post(`${SERVICE.MYVERIFICATIONASSIGNEDBRANCH}`, {
        assignbranch: accessbranchs
      }, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      })
      let res_Users = await axios.post(`${SERVICE.USERASSIGNBRANCH}`, {
        assignbranch: accessbranchs
      }, {
        headers: {
          Authorization: `Bearer ${auth.APITolen}`,
        }
      })
      let users = res_Users?.data?.users;
      let templateList = res_TemplateList?.data?.templateList;
      let filterArray = [];
      templateList?.forEach(templateUser => {
        templateUser?.employeename?.forEach(empName => {
          users?.forEach(user => {
            if (user.companyname === empName) {
              let extendedUser = {
                id: user?._id,
                templateId: templateUser?._id,
                verified: templateUser?.verifiedInfo,
                corrected: templateUser?.correctedInfo,
                company: user?.company,
                branch: user?.branch,
                unit: user?.unit,
                team: user?.team,
                employeename: user?.companyname,
                filename: templateUser?.filename,
                information: templateUser?.informationstring,
                verifyInfo: templateUser?.verifiedInfo
              };
              filterArray.push(extendedUser);
            }
          });
        });
      });
      const generateNewIds = async (array) => {
        return array.map(item => {
          return {
            ...item,
            commonid: uuidv4() // Generate a new UUID for each object
          };
        });
      };
      let needToVerify = filterArray.filter(data =>
        isUserRoleAccess.companyname === data.employeename
      )
      const transformArray = (array) => {
        let result = [];
        array?.forEach((obj) => {
          obj.verifyInfo?.forEach((info) => {
            if (!info.edited && !info.corrected) {
              // Create a new object for each information value
              const newObject = {
                ...obj,
                information: info.name // Assign a single value from the information array
              };
              result.push(newObject);
            }
          })
        });
        return result;
      };
      // Transform the array
      const transformedArray = transformArray(needToVerify);
      const arrayWithNewIds = await generateNewIds(transformedArray);
      let valid = arrayWithNewIds.filter(item => {
        return (item.information !== "Boarding Information" && item.information !== "Process Allot" && item.information !== "Login Details");
      })
      const removeDuplicateNames = (array) => {
        const names = array.map(item => item.information); // Extract names
        const uniqueNames = [...new Set(names)]; // Filter unique names

        return array.filter((item, index) => {
          return uniqueNames.includes(item.information) && uniqueNames.splice(uniqueNames.indexOf(item.information), 1);
        });
      };

      // Use the function
      const uniqueData = removeDuplicateNames(valid);

      setMyVerificationCount(uniqueData?.length);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };


  const fetchApplyleave = async () => {
    try {
      let response_hierarchy = await axios.post(SERVICE.ACTIVEAPPLYLEAVE_HIERARCHYBASED, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        role: isUserRoleAccess.role,
        username: isUserRoleAccess.companyname,
        sector: "all",
        hierachy: "myallhierarchy",
        pagename: "menuteamleaveverification",
      });
      let answer = response_hierarchy?.data?.count;
      setLeaveCount(answer);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };


  const fetchTeamShiftVerification = async () => {
    try {
      let response_hierarchy = await axios.post(SERVICE.TEAM_SHIFT_HIERARCHY_NOTIFICATION_COUNT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        // role: isUserRoleAccess.role,
        username: isUserRoleAccess.companyname,
        sector: "all",
        hierachy: "myallhierarchy",
        pagename: "menuteamshiftverification",
      });
      let answer = response_hierarchy?.data?.count;
      setShiftcount(answer);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const fetchApplyPermission = async () => {
    try {
      let response_hierarchy = await axios.post(SERVICE.ACTIVEPERMISSIONS_HIERARCHYBASED, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        role: isUserRoleAccess.role,
        username: isUserRoleAccess.companyname,
        sector: "all",
        hierachy: "myallhierarchy",
        pagename: "menuteampermissionverification",
      });
      // let answer = response_hierarchy?.data?.count;

      // let allApplied = res_vendor?.data?.permissions;

      // let smallApplied = allApplied?.filter((data) =>
      //   permissionverificationdata?.includes(data.employeename)
      // );

      let answer = response_hierarchy?.data?.count;
      // isUserRoleAccess?.role?.includes("Manager") ||
      //   isUserRoleAccess?.role?.includes("HiringManager") ||
      //   isUserRoleAccess?.role?.includes("HR") ||
      //   isUserRoleAccess?.role?.includes("Superadmin")
      //   ? allApplied?.length > 0
      //     ? allApplied?.length
      //     : 0
      //   : smallApplied?.length > 0
      //     ? smallApplied?.length
      //     : 0;

      setPermissionCount(answer);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const fetchAppovalStatusDocument = async () => {
    try {
      let res = await axios.post(SERVICE.USER_PENDING_APPROVAL_DOCUMENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        companyname: isUserRoleAccess?.companyname
      });
      let answer = res.data.count;
      setMyDocumentsPending(answer);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };



  const fetchNoticeApplyHierarchy = async () => {
    try {
      let res_vendor = await axios.post(SERVICE.NOTICE_HIERARCHY_LIST, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        username: isUserRoleAccess.companyname,
        sector: "all",
        listpageaccessmode: listpageaccessby,
      });
      let answer = res_vendor.data.resultAccessFilter;

      setmyNoticePeriodCount(answer.length);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const fetchMyAsset = async () => {
    try {
      let response = await axios.get(`${SERVICE.INDIVIDUAL_EMPLOYEE_ASSET}/?employeename=${isUserRoleAccess?.companyname}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let datas =
        response?.data?.singleuserdata?.filter(data => data?.status === "Yet To Accept")
      setMyAssetCount(datas?.length)
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const getScreenedCandidate = async () => {
    try {
      const [response, res_meet] = await Promise.all([
        axios.get(SERVICE.INTERVIEWCANDIDATES, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
        axios.get(SERVICE.ROUNDMASTER, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
      ]);

      const roundName = res_meet?.data?.roundmasters?.map(
        (item) => item.nameround
      );

      const InterviewCandFilter = isUserRoleAccess?.role?.includes("Manager")
        ? response?.data?.candidates?.filter((item) => {
          const lastRound =
            item.interviewrounds?.[item?.interviewrounds?.length - 1];
          return (
            roundName.includes(item.overallstatus) &&
            lastRound?.roundanswerstatus !== "Rejected" &&
            lastRound?.roundanswerstatus !== "Selected" &&
            item?.roleback === undefined
          );
        })
        : response?.data?.candidates?.filter((candidate) => {
          if (candidate.interviewrounds) {
            const lastRound =
              candidate.interviewrounds?.[
              candidate?.interviewrounds?.length - 1
              ];
            return (
              lastRound?.interviewer?.includes(
                isUserRoleAccess?.companyname
              ) &&
              lastRound?.roundanswerstatus !== "Rejected" &&
              lastRound?.roundanswerstatus !== "Selected" &&
              candidate?.roleback === undefined
            );
          }
          return false;
        });

      const uniqueIds = new Set();
      let serialNumber = 0;

      const filterData = InterviewCandFilter.flatMap((item, index) => {
        return item?.interviewrounds
          ?.map((round) => {
            if (uniqueIds.has(item._id)) return null;

            const rounds =
              item?.interviewrounds[item?.interviewrounds?.length - 1]
                .roundname;
            uniqueIds.add(item._id);
            serialNumber++;
            return {
              id: item._id,
              serialNumber: serialNumber,
              name: item.fullname,
              company: round.company,
              branch: round.branch,
              designation: round.designation,
              round: rounds,
              reportingdatetime:
                moment(round.date).format("DD-MM-YYYY") + "/" + round.time,
              deadlinedatetime:
                moment(round.deadlinedate).format("DD-MM-YYYY") +
                "/" +
                round.deadlinetime,
            };
          })
          .filter(Boolean);
      });

      setMyInterviewCount(filterData.length);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [anchorElNew, setAnchorElNew] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorElNew(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorElNew(null);
  };

  const navigate = useNavigate();

  const handleRedirect = (path) => {
    navigate(path);
    handleMenuClose();
  };

  const [selectedOptionsCate, setSelectedOptionsCate] = useState([]);

  const handleCategoryChange = (options) => {
    const ans = options?.map(({ value }) => value);
    if (ans?.length > 0) {
      let check = isUserRoleAccess?.accessbranch?.filter((data) =>
        ans?.includes(data?._id)
      );
      setIsAssignBranch(check);
    } else {
      setIsAssignBranch(isUserRoleAccess?.accessbranch);
    }

    setSelectedOptionsCate(options);
  };

  const customValueRendererCate = (valueCateEdit, _area) => {
    if (isUserRoleAccess?.accessbranch?.length === 0) {
      return "No Branch Allotted";
    }
    if (!valueCateEdit.length) {
      return "Please Select Access";
    }
    return valueCateEdit.map(({ label }) => label).join(", ");
  };

  console.log(isUserRoleCompare?.includes("lnoticeperiodscheduledmeetinglist"))

  return (
    <>
      <Box
        className="nav-areanew"
        sx={{
          position: "fixed", // Fixes the component below the header
          top: `${headerHeight + 7}px`, // Adjusts the position based on the header height
          right: "0",
          zIndex: 1499, // Keeps it under the header but above other content
          // backgroundColor: "#fff", // Optional: Set background
          // boxShadow: "0px 2px 10px rgba(0,0,0,0.1)", // Optional: add a shadow for depth>
          // top: {
          //   lg: `${headerHeight + 7}px`,
          //   "@media (min-width: 900px) and (max-width: 1300px)": {
          //     top: `${headerHeight + 5}px`,
          //   },
          // }
        }
        }
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "right",
            width: "100%",
            justifyContent: "right",
          }}
        >
          <FormControl
            sx={{
              // ...userStyle.topdropdown,
              fontSize: "0.5rem !important",
              color: "Black",
              width: "100%",
              maxWidth: "150px",
              textOverflow: "ellipsis",
              marginTop: '10px'
            }}
            fullWidth
          >
            <MultiSelect
              options={isUserRoleAccess?.accessbranch?.map((data) => ({
                label: data.company + "-" + data.branch + "-" + data.unit,
                value: data._id,
              }))}
              value={selectedOptionsCate}
              onChange={handleCategoryChange}
              valueRenderer={customValueRendererCate}
              labelledBy="Please Select Accesss"
              menuPortalTarget={document.body} // Ensures the menu is appended to the body
              styles={{
                menu: (provided) => ({
                  ...provided,
                  zIndex: 2000, // Set a higher z-index for the menu
                }),
              }}
            />
          </FormControl>

          <Badge
            color="error"
            sx={{ marginRight: "15px", marginTop: "10px" }}
            badgeContent={
              Number(isUserRoleCompare?.includes("lmyactionableticket") ? raiseTicketList : 0) +
              Number(isUserRoleCompare?.includes("lteamleaveverification") ? leaveCount : 0) +
              Number(isUserRoleCompare?.includes("lteampermissionverification") ? permissionCount : 0) +
              Number(isUserRoleCompare?.includes("lmyinterview") ? myinterviewCount : 0) +
              Number(isUserRoleCompare?.includes("lverifiedlist") ? myVerificationCount : 0) +
              Number(isUserRoleCompare?.includes("lnoticeperiodlisthierarchy") ? myNoticePeriodCount : 0) +
              Number(isUserRoleCompare?.includes("lmychecklist") ? myVerificationChecklistCount : 0) +
              Number(isUserRoleCompare?.includes("lindividualassetacceptancelist") ? myAssetCount : 0) +
              Number(isUserRoleCompare?.includes("lnoticeperiodscheduledmeetinglist") ? noticeperiodScheduledInterviewCount + exitInterviewCount : 0) +
              Number(myDocumentsPending > 0 ? myDocumentsPending : 0) +
              Number(usageCountAll > 0 ? usageCountAll : 0)
            }
          >
            <NotificationsNoneIcon
              size="large"
              onClick={handleMenuOpen}
              sx={{ cursor: "Pointer" }}
            />
          </Badge>
          <Menu
            anchorEl={anchorElNew}
            open={Boolean(anchorElNew)}
            onClose={handleMenuClose}
          >
            {isUserRoleCompare?.includes("lmyactionableticket") && raiseTicketList > 0 && (
              <MenuItem onClick={handleMenuClose} component={Link} to="/tickets/raiseticketteam">
                Tickets{" "}
                <Badge
                  badgeContent={Number(raiseTicketList)}

                  color="primary"
                  max={9999}
                  style={{ marginLeft: "15px" }}
                />
              </MenuItem>
            )}
            {isUserRoleCompare?.includes("lteamleaveverification") && leaveCount > 0 && (
              <MenuItem onClick={handleMenuClose} component={Link} to="/leave/teamleaveverification">
                Leave
                <Badge
                  badgeContent={Number(leaveCount)}
                  color="primary"
                  max={9999}
                  style={{ marginLeft: "15px" }}
                />{" "}
              </MenuItem>
            )}
            {isUserRoleCompare?.includes("lteamshiftverification") && shiftcount > 0 && (
              <MenuItem onClick={handleMenuClose} component={Link} to="/teamshiftverification">
                Shift
                <Badge
                  badgeContent={Number(shiftcount)}
                  color="primary"
                  max={9999}
                  style={{ marginLeft: "15px" }}
                />{" "}
              </MenuItem>
            )}
            {isUserRoleCompare?.includes("lteampermissionverification") && permissionCount > 0 && (
              <MenuItem onClick={handleMenuClose}
                component={Link}
                to="/permission/teampermissionverification"
              >
                {" "}
                Permission{" "}
                <Badge
                  badgeContent={Number(permissionCount)}
                  max={9999}
                  color="primary"
                  style={{ marginLeft: "15px" }}
                />
              </MenuItem>
            )}
            {isUserRoleCompare?.includes("lmyinterview") && myinterviewCount > 0 && (
              <MenuItem onClick={handleMenuClose} component={Link} to="/interview/myinterview">
                My Interview
                <Badge
                  badgeContent={Number(myinterviewCount)}
                  color="primary"
                  max={9999}
                  style={{ marginLeft: "15px" }}
                />
              </MenuItem>
            )}
            {isUserRoleCompare?.includes("lnoticeperiodlisthierarchy") && myNoticePeriodCount > 0 && (
              <MenuItem onClick={handleMenuClose} component={Link} to="/hr/noticeperiodhierarchy">
                Notice Period
                <Badge
                  badgeContent={Number(myNoticePeriodCount)}
                  max={9999}
                  color="primary"
                  style={{ marginLeft: "15px" }}
                />
              </MenuItem>
            )}
            {isUserRoleCompare?.includes("lverifiedlist") && myVerificationCount > 0 && (
              <MenuItem onClick={handleMenuClose} component={Link} to="/myverification">
                My Verification
                <Badge
                  badgeContent={Number(myVerificationCount)}
                  color="primary" max={9999}
                  style={{ marginLeft: "15px" }}
                />{" "}
              </MenuItem>
            )}
            {isUserRoleCompare?.includes("lmychecklist") && myVerificationChecklistCount > 0 && (
              <MenuItem onClick={handleMenuClose} component={Link} to="/interview/myinterviewchecklist">
                My Checklist
                <Badge
                  badgeContent={Number(myVerificationChecklistCount)}
                  max={999}
                  color="primary"
                  style={{ marginLeft: "15px" }}
                />{" "}
              </MenuItem>
            )}
            {isUserRoleCompare?.includes("lnoticeperiodscheduledmeetinglist") && noticeperiodScheduledInterviewCount > 0 && (
              <MenuItem onClick={handleMenuClose} component={Link} to="/updatepages/noticeperiodscheduledmeetinglist">
                Notice Scheduled Meeting
                <Badge
                  badgeContent={Number(noticeperiodScheduledInterviewCount)}
                  max={999}
                  color="primary"
                  style={{ marginLeft: "15px" }}
                />{" "}
              </MenuItem>
            )}
            {isUserRoleCompare?.includes("lnoticeperiodscheduledmeetinglist") && exitInterviewCount > 0 && (
              <MenuItem onClick={handleMenuClose} component={Link} to={isInterviewer ? "/recruitment/exitconfirmationlist" : "/updatepages/noticeperiodscheduledmeetinglist"}>
                Exit Interview
                <Badge
                  badgeContent={Number(exitInterviewCount)}
                  max={999}
                  color="primary"
                  style={{ marginLeft: "15px" }}
                />{" "}
              </MenuItem>
            )}
            {isUserRoleCompare?.includes("lindividualassetacceptancelist") && myAssetCount > 0 && (
              <MenuItem onClick={handleMenuClose} component={Link} to="/asset/inidividualemployeeassetdistribution">
                My Asset
                <Badge
                  badgeContent={Number(myAssetCount)}
                  max={999}
                  color="primary"
                  style={{ marginLeft: "15px" }}
                />{" "}
              </MenuItem>
            )}
            {myDocumentsPending > 0 &&
              <MenuItem onClick={handleMenuClose} component={Link} to="/">
                My Documents Approval
                <Badge
                  badgeContent={Number(myDocumentsPending)}
                  max={999}
                  color="primary"
                  style={{ marginLeft: "15px" }}
                />{" "}
              </MenuItem>
            }
            {usageCountAll > 0 &&
              <MenuItem onClick={handleMenuClose} component={Link} to="/stocknotficationlist">
                My Stock
                <Badge
                  badgeContent={Number(usageCountAll)}
                  max={999}
                  color="primary"
                  style={{ marginLeft: "15px" }}
                />{" "}
              </MenuItem>
            }
          </Menu>
          <Stack direction="row" spacing={2} sx={{ cursor: "pointer" }}>
            <div>
              <Box
                component="img"
                onClick={handleToggle}
                ref={anchorRef}
                id="composition-button"
                aria-controls={open ? "composition-menu" : undefined}
                aria-expanded={open ? "true" : undefined}
                aria-haspopup="true"
                sx={{
                  height: 40,
                  width: 40,
                  borderRadius: "50%",
                  marginRight: "15px",
                  marginTop: "2px",
                  maxHeight: { xs: 233, md: 167 },
                  maxWidth: { xs: 350, md: 250 },
                }}
                // alt="The house from the offer."
                // src={
                //   isUserRoleAccess?.profileimage &&
                //   isUserRoleAccess.profileimage !== ""
                //     ? isUserRoleAccess.profileimage
                //     : // : "https://t4.ftcdn.net/jpg/03/59/58/91/360_F_359589186_JDLl8dIWoBNf1iqEkHxhUeeOulx0wOC5.jpg"
                //       "https://www.w3schools.com/w3images/avatar2.png"
                // }
                src={
                  isUserRoleAccess?.profileimage &&
                    isUserRoleAccess.profileimage !== ""
                    ? isUserRoleAccess.profileimage
                    : isUserRoleAccess?.gender === "Male"
                      ? "https://www.w3schools.com/w3images/avatar2.png" // male avatar
                      : isUserRoleAccess?.gender === "Female"
                        ? "https://www.w3schools.com/howto/img_avatar2.png" // female avatar
                        : isUserRoleAccess?.gender === "Others"
                          ? "https://www.w3schools.com/w3images/avatar6.png" // others avatar
                          : "https://t4.ftcdn.net/jpg/03/59/58/91/360_F_359589186_JDLl8dIWoBNf1iqEkHxhUeeOulx0wOC5.jpg" // default no profile  avatar
                }
              />
              <Grid item md={3} xs={12}></Grid>
              <Popper
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                placement="bottom-start"
                transition
                sx={{ zIndex: "99999" }}
                disablePortal
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin:
                        placement === "bottom-start"
                          ? "left top"
                          : "left bottom",
                    }}
                  >
                    <Paper>
                      <ClickAwayListener onClickAway={handleClose}>
                        <MenuList
                          autoFocusItem={open}
                          id="composition-menu"
                          aria-labelledby="composition-button"
                          onKeyDown={handleListKeyDown}
                        >
                          <MenuItem>{isUserRoleAccess.username}</MenuItem>
                          <Link
                            to={`/profile/${isUserRoleAccess._id}`}
                            style={{ textDecoration: "none", color: "black" }}
                          >
                            <MenuItem onClick={handleClose}>Profile</MenuItem>
                          </Link>
                          <MenuItem onClick={logOut}>Logout</MenuItem>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </div>
          </Stack>
        </Box>

      </Box >
    </>
  );
};

export default Navnew;