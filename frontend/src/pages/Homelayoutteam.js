import React, { useState, useEffect, useContext, useRef } from "react";
import { Box, FormControl, Button, Chip, List, ListItem, ListItemText, Avatar, Grid, Typography, Tooltip } from "@mui/material";
import Selects from "react-select";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { userStyle, colourStyles } from "../pageStyle";

import axios from "../axiosInstance";
import { SERVICE } from "../services/Baseservice";
import { Link } from "react-router-dom";
import { handleApiError } from "../components/Errorhandling";
import { UserRoleAccessContext, AuthContext } from "../context/Appcontext";
import IconButton from "@mui/material/IconButton";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import TextSnippetOutlinedIcon from "@mui/icons-material/TextSnippetOutlined";
import EventBusyOutlinedIcon from "@mui/icons-material/EventBusyOutlined";
import PersonOffOutlinedIcon from "@mui/icons-material/PersonOffOutlined";
import LockClockOutlinedIcon from "@mui/icons-material/LockClockOutlined";
import HomeApprove from "./HomeApproveTeam";
import HomeProduction from "./HomeProductionTeam";
import HomeAccuracy from "./HomeAccuracy";
import HomeMinimum from "./Homeminimumteam";
import HomeTask from "./HomeTaskTeam";
import HomeExpenseIncome from "./HomeExpenseIncome";
import HomeAsset from "./HomeAsset";
import HomeInterview from "./HomeInterview";
import HomeTickets from "./HomeTicketsTeam";
import HomeLoginAllot from "./HomeMyLoginAllotTeam";
import HomeMaintenance from "./HomeMaintenanceTeam";

const Homelayout = () => {
  const { auth } = useContext(AuthContext);
  const { isUserRoleAccess, isUserRoleCompare, isAssignBranch, listPageAccessMode } = useContext(UserRoleAccessContext);
  let listpageaccessby =
    listPageAccessMode?.find(
      (data) =>
        data.modulename === "Setup" &&
        data.submodulename === "Team Dashboard" &&
        data.mainpagename === "" &&
        data.subpagename === "" &&
        data.subsubpagename === ""
    )?.listpageaccessmode || "Overall";



  // Error Popup model
  const [isErrorOpendialog, setIsErrorOpendialog] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpendialog(true);
  };

  //  api for  to fetch pagename and username

  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current === false) {
      effectRan.current = true;
    }
    return () => {
      effectRan.current = true;
    };
  }, []);

  let remarkcreate;
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const yesterdayDate = new Date();
  yesterdayDate.setDate(currentDay - 1);

  let maleimage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaHmgseRqO6CI14XWSh5swCN19tzNhtgptvg&s";
  let femaleimage = " https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVmPFyachBpGr2wuhBzg9WtRZVdyJhQzXW8w&";

  const PmodeOpt = [
    { label: "Today", value: "Today" },
    { label: "This Week", value: "Weekly" },
    { label: "This Month", value: "Monthly" },
    { label: "This Year", value: "Yearly" },
  ];

  const [todaymeeting, setTodayMeeting] = useState({ todaymeet: "Today" });
  const [employees, setEmployees] = useState(0);
  const [leavecount, setLeaveCount] = useState(0);
  const [noticeCount, setNoticeCount] = useState(0);
  const [releiveEmp, setReleiveEmp] = useState(0);
  const [notClockIn, setNotClockIn] = useState(0);
  const [meetingArray, setMeetingArray] = useState([]);
  const [newsEvents, setNewsEvents] = useState([]);
  const [candidate, setCandidate] = useState([]);
  const [upcomingInterview, setUpcomingInterview] = useState([]);
  const [buttonEvents, setButtonEvents] = useState("");

  const accessbranchcandidate = isAssignBranch?.map((data) => ({
    branch: data.branch,
    company: data.company,
    // unit: data.unit,
  }));
  const accessbranch = isAssignBranch?.map((data) => ({
    branch: data.branch,
    company: data.company,
    unit: data.unit,
  }));

  const fetchEmployee = async () => {
    try {
      let res = await axios.post(SERVICE.HIERARCHY_TEAM_ATTENDANCE_BASED_CLAIM, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        hierachy: "myallhierarchy",
        sector: "all",
        username: isUserRoleAccess.companyname,
        pagename: "menuteamdashboard",
        listpageaccessmode: listpageaccessby,
      });

      if (res.data.resultAccessFilter.length > 0) {
        const hierarchyempnames = res.data.resultAccessFilter;
        
        let [res_Employee, res_leave, res_notcheckin, res_News, res_candidate, res_upcoming] = await Promise.all([
          isUserRoleCompare?.includes("ltotalemployee") && isUserRoleCompare?.includes("lliveemployeelist")
            ? axios.post(SERVICE.EMPLOYEE_HOME_COUNT_TEAM, {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },
                // pageName: 'Employee',
                hierarchyempnames: hierarchyempnames,
                assignbranch: accessbranch,
              })
            : Promise.resolve([]),

          isUserRoleCompare?.includes("ltodayleave")
            ? axios.post(SERVICE.APPLY_LEAVE_HOME_TEAM, {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },
                hierarchyempnames: hierarchyempnames,
                assignbranch: accessbranch,
              })
            : Promise.resolve([]),

          isUserRoleCompare?.includes("lnotcheckinemp")
            ? axios.post(SERVICE.NOTCLOCKIN_HOME_COUNT_TEAM, {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },
                hierarchyempnames: hierarchyempnames,
                assignbranch: accessbranch,
              })
            : Promise.resolve([]),

          isUserRoleCompare?.includes("lmanageevents") && isUserRoleCompare?.includes("lnews&events")
            ? axios.post(SERVICE.ALL_EVENT_HOME_TEAM, {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },
                hierarchyempnames: hierarchyempnames,
                assignbranch: accessbranch,
              })
            : Promise.resolve([]),
        ]);
        const notcheckinuser = Number(res_notcheckin?.data?.user);
        const applyleavecount = Number(res_leave?.data?.applyleaves);
        console.log(notcheckinuser, applyleavecount, res_Employee?.data?.allusers, "couintchek");

        setEmployees(res_Employee ? res_Employee?.data?.allusers : 0);
        setNotClockIn(Number(res_Employee?.data?.allusers) - (notcheckinuser + applyleavecount));
        setNewsEvents(res_News?.data?.scheduleevent.filter((item, index) => index <= 5));
      }
    } catch (err) {
      console.log(err, "errr");
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //get all data.
  const fetchMeetingfilter = async () => {
    try {
      let res_employee = [];

      if (isUserRoleCompare?.includes("ltodaymeeting") && isUserRoleCompare?.includes("lschedulemeetingfilter")) {
        const response = await axios.post(SERVICE.SCHEDULEMEETINGFILTERFPAGE_HOME, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          assignbranch: accessbranchcandidate,
          // role: isUserRoleAccess.role,
          // companyname: isUserRoleAccess.companyname,
          selectedfilter: todaymeeting.todaymeet,
        });

        res_employee = response?.data?.filteredschedulemeeting || [];
      }

      setMeetingArray(res_employee.filter((item, index) => index <= 5));
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, []);
  useEffect(() => {
    fetchMeetingfilter();
  }, [todaymeeting]);


  return (
    <>
      <Box sx={{ marginTop: "-32px" }}>
        <Box sx={{ heigth: "maxcontent" }}>
          <Grid container spacing={2} sx={{ alignItems: "end", marginTop: "-98px" }}>
            {isUserRoleCompare?.includes("ltotalemployee") && isUserRoleCompare?.includes("lliveemployeelist") && (
              <Grid item md={2.4} xs={12} sm={6}>
                <Box sx={userStyle.taskboxeshome}>
                  <Link
                 to={'/liveemployeelisthome'}
                    target="_blank"
                    style={{ textDecoration: "none", color: "#000000" }}
                  >
                    <Grid container>
                      <Grid item md={8} xs={8} sm={8}>
                        <Box sx={{ height: "40px" }}>
                          <Typography sx={{ fontSize: "12.5px", fontWeight: 400 }}>Total Employee</Typography>
                        </Box>
                        <span style={{ lineHeight: 1, fontSize: "25px", fontWeight: 700 }}>{employees ? employees : 0}</span>
                      </Grid>
                      <Grid item md={4} xs={4} sm={4}>
                        <Box sx={userStyle.totaltaskiconemp}>
                          <PersonOutlineOutlinedIcon style={{ fontSize: "1.9rem" }} />
                        </Box>
                      </Grid>
                    </Grid>
                  </Link>
                </Box>
              </Grid>
            )}
            {isUserRoleCompare?.includes("ltodayleave") && (
              <Grid item md={2.4} xs={12} sm={6}>
                <Box sx={userStyle.taskboxeshome}>
                  <Link to="/todayleaveapprovedteam" target="_blank" style={{ textDecoration: "none", color: "#000000" }}>
                    <Grid container>
                      <Grid item md={8} xs={8} sm={8}>
                        <Box sx={{ height: "40px" }}>
                          <Typography sx={{ fontSize: "12.5px", fontWeight: 400 }}> Today Leave</Typography>
                        </Box>
                        <span style={{ lineHeight: 1, fontSize: "25px", fontWeight: 700 }}>{leavecount}</span>
                        {employees === 0 ? null : <span style={{ fontSize: "20px" }}>/{employees}</span>}
                      </Grid>
                      <Grid item md={4} xs={4} sm={4}>
                        <Box sx={userStyle.totaltaskiconleave}>
                          <EventBusyOutlinedIcon style={{ fontSize: "1.9rem" }} />
                        </Box>
                      </Grid>
                    </Grid>
                  </Link>
                </Box>
              </Grid>
            )}

            {isUserRoleCompare?.includes("lnotcheckinemp") && (
              <Grid item md={2.4} xs={12} sm={6}>
                <Box sx={userStyle.taskboxeshome}>
                  <Link to="/notcheckinemplistteam" target="_blank" style={{ textDecoration: "none", color: "#000000" }}>
                    <Grid container>
                      <Grid item md={8} xs={8} sm={8}>
                        <Box sx={{ height: "40px" }}>
                          <Typography sx={{ fontSize: "12.5px", fontWeight: 400 }}> Not CheckIn Emp</Typography>
                        </Box>
                        <span style={{ lineHeight: 1, fontSize: "25px", fontWeight: 700 }}>{notClockIn}</span>
                        {employees === 0 ? null : <span style={{ fontSize: "20px" }}>/{employees}</span>}
                      </Grid>
                      <Grid item md={4} xs={4} sm={4}>
                        <Box sx={userStyle.totaltaskiconnotcheck}>
                          <LockClockOutlinedIcon style={{ fontSize: "1.9rem" }} />
                        </Box>
                      </Grid>
                    </Grid>
                  </Link>
                </Box>
              </Grid>
            )}
          </Grid>
          <br />
          <Grid container spacing={2}></Grid>
          <br />
          <Grid container spacing={2} sx={{ minHeight: "400px" }}>
            {/* today meeting */}
            {isUserRoleCompare?.includes("ltodaymeeting") && isUserRoleCompare?.includes("lschedulemeetingfilter") && (
              <Grid item xs={12} md={6} sm={8}>
                <Box
                  sx={{
                    ...userStyle?.homepagecontainer,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "100%",
                  }}
                >
                  <Grid container>
                    <Grid item xs={12} md={6} sm={6}>
                      <Typography sx={{ fontWeight: "700" }}>Today Meeting</Typography>
                    </Grid>

                    <Grid item xs={12} md={6} sm={6}>
                      <FormControl fullWidth>
                        <Selects
                          maxMenuHeight={250}
                          options={PmodeOpt}
                          styles={colourStyles}
                          value={{
                            label: todaymeeting.todaymeet,
                            value: todaymeeting.todaymeet,
                          }}
                          onChange={(e) => {
                            setTodayMeeting({
                              ...todaymeeting,
                              todaymeet: e.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                  <br />
                  <Grid container spacing={2}>
                    {meetingArray.length === 0 ? (
                      <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "150px" }}>
                        <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>No Data</Typography>
                      </Grid>
                    ) : (
                      meetingArray.map((item, index) => {
                        const date = new Date(item.date);
                        const day = date.getDate().toString().padStart(2, "0");
                        const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();

                        return (
                          <Grid item xs={12} md={6} sm={6} key={index}>
                            <Grid container>
                              <Grid item xs={4} md={4} sm={4} sx={{ display: "flex", alignItems: "center", justifyContent: "left" }}>
                                <Box
                                  sx={{
                                    borderRadius: "10px",
                                    fontWeight: 800,
                                    backgroundColor: "#dbd6d67a",
                                    height: "50px",
                                    padding: "0px 10px",
                                    border: "1px solid #8080803b",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexDirection: "column",
                                  }}
                                >
                                  <Typography sx={{ fontSize: "10px", fontFamily: "emoji", fontWeight: 900 }}>{day}</Typography>
                                  <Typography sx={{ fontSize: "10px", fontFamily: "emoji", fontWeight: 900 }}>{month}</Typography>
                                </Box>
                              </Grid>
                              <Grid
                                item
                                xs={8}
                                md={8}
                                sm={8}
                                sx={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}
                              >
                                <Tooltip title={item.title}>
                                  <Typography
                                    sx={{
                                      fontWeight: "bold",
                                      fontFamily: "League Spartan, sans-serif",
                                      fontSize: { md: "11px", sm: "10px", xs: "12px" },
                                    }}
                                  >
                                    {item.title.length > 15 ? `${item.title.substring(0, 15)}...` : item.title}
                                  </Typography>
                                </Tooltip>
                                <Tooltip title={item.agenda.replace(/<\/?[^>]+(>|$)/g, "")}>
                                  <Typography sx={{ fontSize: { xs: "9px", sm: "10px", md: "12px" } }}>
                                    {" "}
                                    {item.agenda.replace(/<\/?[^>]+(>|$)/g, "").length > 15
                                      ? `${item.agenda.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 15)}...`
                                      : item.agenda.replace(/<\/?[^>]+(>|$)/g, "")}
                                  </Typography>
                                </Tooltip>
                              </Grid>
                            </Grid>
                          </Grid>
                        );
                      })
                    )}
                  </Grid>

                  {/* Always render the View More button at the bottom */}
                  <Grid container sx={{ justifyContent: "flex-end", marginTop: "auto" }}>
                    <Link to="/schedulemeetingfilterteam" target="_blank">
                      <Button
                        variant="contained"
                        sx={{ backgroundColor: "#ff5e65", borderRadius: "13px", textTransform: "capitalize", fontWeight: "bold" }}
                        size="small"
                      >
                        View More
                      </Button>
                    </Link>
                  </Grid>
                </Box>
              </Grid>
            )}

            {/* new & events */}
            {isUserRoleCompare?.includes("lmanageevents") && isUserRoleCompare?.includes("lnews&events") && (
              <Grid item xs={12} md={6} sm={12}>
                <Box
                  sx={{
                    ...userStyle?.homepagecontainer,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "100%",
                  }}
                >
                  <Typography sx={{ fontWeight: "700" }}>News & Events</Typography>
                  <br />
                  <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                    {newsEvents.length === 0 ? (
                      <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "150px" }}>
                        <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>No Data</Typography>
                      </Grid>
                    ) : (
                      newsEvents.map((item, index) => {
                        const date = new Date(item.date);
                        const day = date.getDate().toString().padStart(2, "0");
                        const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();

                        return (
                          <Grid item xs={12} md={6} sm={6} key={index}>
                            <Grid container>
                              <Grid item xs={4} md={4} sm={4} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Box
                                  sx={{
                                    borderRadius: "10px",
                                    fontWeight: 800,
                                    backgroundColor: "#dbd6d67a",
                                    height: "50px",
                                    padding: "0px 10px",
                                    border: "1px solid #8080803b",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexDirection: "column",
                                  }}
                                >
                                  <Typography sx={{ fontSize: "10px", fontFamily: "emoji", fontWeight: 900 }}>{day}</Typography>
                                  <Typography sx={{ fontSize: "10px", fontFamily: "emoji", fontWeight: 900 }}>{month}</Typography>
                                </Box>
                              </Grid>
                              <Grid
                                item
                                xs={8}
                                md={8}
                                sm={8}
                                sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
                              >
                                <Tooltip title={item.eventname}>
                                  <Typography
                                    sx={{
                                      fontWeight: "bold",
                                      fontFamily: "League Spartan, sans-serif",
                                      fontSize: { md: "11px", sm: "10px", xs: "12px" },
                                    }}
                                  >
                                    {/* {item.eventname} */}
                                    {item.eventname.length > 15 ? `${item.eventname.substring(0, 15)}...` : item.eventname}
                                  </Typography>
                                </Tooltip>
                                <Tooltip title={item.eventdescription}>
                                  <Typography sx={{ fontSize: { xs: "9px", sm: "10px", md: "12px" } }}>
                                    {" "}
                                    {item.eventdescription.length > 15 ? `${item.eventdescription.substring(0, 15)}...` : item.eventdescription}
                                  </Typography>
                                </Tooltip>
                              </Grid>
                            </Grid>
                          </Grid>
                        );
                      })
                    )}
                  </Grid>
                  <Grid container sx={{ justifyContent: "flex-end", marginTop: "auto" }}>
                    <Link to="/setup/events" target="_blank">
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        sx={{ backgroundColor: "#ff5e65", borderRadius: "13px", textTransform: "capitalize", fontWeight: "bold" }}
                      >
                        View More
                      </Button>
                    </Link>
                  </Grid>
                </Box>
              </Grid>
            )}
            {/* recent job */}

            {isUserRoleCompare?.includes("menuapprovals") && <HomeApprove />}
            {isUserRoleCompare?.includes("menuproductions") && <HomeProduction />}
            {isUserRoleCompare?.includes("menuaccuracy") && <HomeAccuracy />}
            {isUserRoleCompare?.includes("menuminimumpointsdashboard") && <HomeMinimum />}
            {isUserRoleCompare?.includes("menutaskstatus") && <HomeTask />}
            {/* {isUserRoleCompare?.includes("menuexpense&income") && <HomeExpenseIncome />} */}
            {/* {isUserRoleCompare?.includes("menuasset&maintenance") && isUserRoleCompare?.includes("menuassets") && <HomeAsset />} */}
            {/* {(isUserRoleCompare?.includes("menurecentjobapplications") || isUserRoleCompare?.includes("menuupcominginterviews")) && <HomeInterview />} */}
            {isUserRoleCompare?.includes("menutickets&checklist") && <HomeTickets />}

            {isUserRoleCompare?.includes("menuasset&maintenance") && isUserRoleCompare?.includes("menumaintenances") && <HomeMaintenance />}

            {isUserRoleCompare?.includes("menumyloginallot") && <HomeLoginAllot />}
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default Homelayout;
