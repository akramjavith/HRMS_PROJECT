import React, { useState, useEffect, useContext, useRef } from "react";
import {
    Box,
    Dialog, FormControl,
    DialogContent,
    Button,
    Chip, List, ListItem, ListItemText,
    Avatar,
    DialogActions,
    DialogTitle,
    DialogContentText,
    Grid,
    Typography,
    Tooltip,
} from "@mui/material";
import { ThreeDots } from "react-loader-spinner";
import Selects from "react-select";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { userStyle, colourStyles } from "../pageStyle";
import axios from "axios";
import { SERVICE } from "../services/Baseservice";
import { Link } from "react-router-dom";
import { handleApiError } from "../components/Errorhandling";
import { format, addDays, differenceInDays } from "date-fns";
import { UserRoleAccessContext, AuthContext } from "../context/Appcontext";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import BlockIcon from "@mui/icons-material/Block";
import WarningIcon from "@mui/icons-material/Warning";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';
import PersonOffOutlinedIcon from '@mui/icons-material/PersonOffOutlined';
import LockClockOutlinedIcon from '@mui/icons-material/LockClockOutlined';
import HomeApprove from "./HomeApprove";
import HomeProduction from "./HomeProduction"
import HomeAccuracy from "./HomeAccuracy"
import HomeMinimum from "./HomeMinimum"
import HomeTask from "./HomeTask"
import HomeExpenseIncome from "./HomeExpenseIncome"
import HomeAsset from "./HomeAsset"
import HomeInterview from "./HomeInterview"
import HomeTickets from "./HomeTickets"
import HomeLoginAllot from "./HomeMyLoginAllot"
import HomeMaintenance from "./HomeMaintenance"


const Homelayout = () => {

    const [loader, setLoader] = useState(false)


    const links1 = [
        { text: "Apply Leave", url: "/leave/applyleave" },
        { text: "My Attendance", url: "/attendance/myindividualstatuslist" },
        { text: "My Tickets", url: "/tickets/individuallist" },
        { text: "My Login Allot", url: "/updatepages/individualloginallotlist" },
        { text: "My Interview", url: "/interview/myinterview" },
    ];

    const { auth } = useContext(AuthContext);

    const { isUserRoleAccess, isUserRoleCompare, isAssignBranch } = useContext(UserRoleAccessContext);
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

    useEffect(() => {
        passwordUpdateCheck();
    }, []);


    let remarkcreate;
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const yesterdayDate = new Date();
    yesterdayDate.setDate(currentDay - 1);


    let maleimage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaHmgseRqO6CI14XWSh5swCN19tzNhtgptvg&s"
    let femaleimage = " https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVmPFyachBpGr2wuhBzg9WtRZVdyJhQzXW8w&"

    const PmodeOpt = [
        { label: "Today", value: "Today" },
        { label: "This Week", value: "Weekly" },
        { label: "This Month", value: "Monthly" },
        { label: "This Year", value: "Yearly" }]

    const [todaymeeting, setTodayMeeting] = useState({ todaymeet: "Today" })


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


    const fetchEmployee = async () => {
        const accessbranch = isAssignBranch?.map((data) => ({
            branch: data.branch,
            company: data.company,
            unit: data.unit,
        }));

        try {

            let [res_Employee, res_leave, res_notice, res_relieve, res_notcheckin, res_News, res_candidate, res_upcoming, res_prodhierarchy] = await Promise.all([

                axios.post(SERVICE.EMPLOYEE_HOME_COUNT, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    pageName: "Employee",
                }),
                axios.get(SERVICE.LEAVE_HOME, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }),
                axios.get(SERVICE.NOTICEPERIODAPPLY, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }),
                axios.get(SERVICE.RELEIVE_HOME_COUNT, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }),
                axios.get(SERVICE.NOTCLOCKIN_HOME_COUNT, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }),
                axios.post(SERVICE.ALL_EVENT, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    assignbranch: accessbranch,
                }),
                axios.get(SERVICE.CANDIDATES_ALL_COUNT_HOME, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }),
                axios.post(SERVICE.CANDIDATES_ALL_UPCOMING, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    selectedfilter: buttonEvents,
                }),



            ]);
            let ans = res_notice?.data?.noticeperiodapply.filter(
                (data) =>
                    data.approvedStatus === "true" &&
                    data.cancelstatus === false &&
                    data.continuestatus === false
            );
            console.log(

                res_Employee?.data?.allusers, "leave count"
            )
            setNoticeCount(ans);
            setReleiveEmp(res_relieve?.data?.user);
            setLeaveCount(res_leave?.data?.applyleaves);
            setEmployees(res_Employee?.data?.allusers);
            setNotClockIn(res_Employee?.data?.allusers - res_notcheckin?.data?.user - res_leave?.data?.applyleaves);
            setNewsEvents(res_News?.data?.scheduleevent.filter((item, index) => index <= 5))
            setCandidate(res_candidate?.data?.candidates)
            setUpcomingInterview(res_upcoming?.data?.candidates)

        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };



    //get all data.
    const fetchMeetingfilter = async () => {
        try {
            let res_employee = await axios.post(SERVICE.SCHEDULEMEETINGFILTERFPAGE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },

                role: isUserRoleAccess.role,
                companyname: isUserRoleAccess.companyname,
                selectedfilter: todaymeeting.todaymeet,
            });
            setMeetingArray(res_employee?.data?.filteredschedulemeeting.filter((item, index) => index <= 5));
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    const [btnselect, setBtnSelect] = useState("")


    //get all data.
    const fetchButtonEvents = async (e) => {

        setBtnSelect(e)
        setLoader(true)
        try {
            let res_employee = await axios.post(SERVICE.CANDIDATES_ALL_UPCOMING, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                selectedfilter: e,
            });
            setUpcomingInterview(res_employee?.data?.candidates.length > 0 ? res_employee?.data?.candidates : [])
            setLoader(false)
        } catch (err) { setLoader(false); handleApiError(err, setShowAlert, handleClickOpenerr); }
    };



    useEffect(() => {
        fetchEmployee();
    }, [])
    useEffect(() => {
        fetchMeetingfilter();
    }, [todaymeeting])





    return (
        <>
            <Box sx={{ marginTop: "-32px" }}>
                <Box sx={{ heigth: "maxcontent" }}>
                    {/* <Grid container spacing={2} sx={{ alignItems: "end", justifyContent: "center", marginTop: "-98px", }}>


                        {isUserRoleCompare?.includes("ltotalemployee") && (


                            <Grid item md={2.4} xs={12} sm={6}>
                                <Box sx={userStyle.taskboxeshome}>


                                    <Link to="/liveemployeelist" target="_blank" style={{ textDecoration: "none", color: "#000000" }}>
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


                                    <Link to="/todayleave" target="_blank" style={{ textDecoration: "none", color: "#000000" }}>
                                        <Grid container>
                                            <Grid item md={8} xs={8} sm={8}>
                                                <Box sx={{ height: "40px" }}>
                                                    <Typography sx={{ fontSize: "12.5px", fontWeight: 400 }}>  Today Leave</Typography>
                                                </Box>
                                                <span style={{ lineHeight: 1, fontSize: "25px", fontWeight: 700 }}>
                                                    {leavecount}
                                                </span>
                                                {employees === 0 ?
                                                    null
                                                    :
                                                    <span style={{ fontSize: "20px", }}>/{employees}</span>
                                                }

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

                        {isUserRoleCompare?.includes("lnoticeperiodemp") && (

                            <Grid item md={2.4} xs={12} sm={6}>
                                <Box sx={userStyle.taskboxeshome}>


                                    <Link to="/noticeperiodapprovelist" target="_blank" style={{ textDecoration: "none", color: "#000000" }}>
                                        <Grid container>
                                            <Grid item md={8} xs={8} sm={8}>
                                                <Box sx={{ height: "40px" }}>
                                                    <Typography sx={{ fontSize: "12.5px", fontWeight: 400 }}>   Notice Period Emp</Typography>
                                                </Box>
                                                <span style={{ lineHeight: 1, fontSize: "25px", fontWeight: 700 }}>{noticeCount ? noticeCount.length : 0}</span>
                                                {employees === 0 ?
                                                    null
                                                    :
                                                    <span style={{ fontSize: "20px", }}>/{employees}</span>
                                                }
                                            </Grid>
                                            <Grid item md={4} xs={4} sm={4}>
                                                <Box sx={userStyle.totaltaskiconnotice}>
                                                    <TextSnippetOutlinedIcon style={{ fontSize: "1.9rem" }} />
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Link>

                                </Box>
                            </Grid>
                        )}
                        {isUserRoleCompare?.includes("lreleiveemployee") && (


                            <Grid item md={2.4} xs={12} sm={6}>
                                <Box sx={userStyle.taskboxeshome}>


                                    <Link to="/updatepages/deactivateemployeeslist" target="_blank" style={{ textDecoration: "none", color: "#000000" }}>
                                        <Grid container>
                                            <Grid item md={8} xs={8} sm={8}>
                                                <Box sx={{ height: "40px" }}>
                                                    <Typography sx={{ fontSize: "12.5px", fontWeight: 400 }}>  Releive Employee</Typography>
                                                </Box>
                                                <span style={{ lineHeight: 1, fontSize: "25px", fontWeight: 700 }}>{releiveEmp}</span>
                                                {employees === 0 && releiveEmp === 0 ?
                                                    null
                                                    :
                                                    <span style={{ fontSize: "20px", }}>/{employees + releiveEmp}</span>
                                                }


                                            </Grid>
                                            <Grid item md={4} xs={4} sm={4}>
                                                <Box sx={userStyle.totaltaskiconrelieve}>
                                                    <PersonOffOutlinedIcon style={{ fontSize: "1.9rem" }} />
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

                                    <Link to="/notcheckinemplist" target="_blank" style={{ textDecoration: "none", color: "#000000" }}>
                                        <Grid container>
                                            <Grid item md={8} xs={8} sm={8}>
                                                <Box sx={{ height: "40px" }}>
                                                    <Typography sx={{ fontSize: "12.5px", fontWeight: 400 }}> Not CheckIn Emp</Typography>
                                                </Box>
                                                <span style={{ lineHeight: 1, fontSize: "25px", fontWeight: 700 }}>{notClockIn}</span>
                                                {employees === 0 ?
                                                    null
                                                    :
                                                    <span style={{ fontSize: "20px", }}>/{employees}</span>
                                                }
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
                    </Grid> */}
                    <br />
                    {/* <Grid container spacing={2}>



                    </Grid> */}
                    <br />
                    {/* <Grid container spacing={2} sx={{ minHeight: "400px" }}>


                     

                        {isUserRoleCompare?.includes("ltodaymeeting") && (

                            <Grid item xs={12} md={4.5} sm={8}>
                                <Box
                                    sx={{
                                        ...userStyle?.homepagecontainer,
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between",
                                        height: "100%",
                                    }}
                                >
                                    <Grid container >
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

                                    <Grid container spacing={2} >
                                        {meetingArray.length === 0 ? (
                                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '150px' }}>
                                                <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>No Data</Typography>
                                            </Grid>
                                        ) : (
                                            meetingArray.map((item, index) => {
                                                const date = new Date(item.date);
                                                const day = date.getDate().toString().padStart(2, '0');
                                                const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();

                                                return (
                                                    <Grid item xs={12} md={6} sm={6} key={index}>
                                                        <Grid container>
                                                            <Grid item xs={4} md={4} sm={4} sx={{ display: "flex", alignItems: "center", justifyContent: "left" }} >
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
                                                            <Grid item xs={8} md={8} sm={8} sx={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
                                                                <Tooltip title={item.title}>
                                                                    <Typography sx={{ fontWeight: "bold", fontFamily: "League Spartan, sans-serif", fontSize: { md: "11px", sm: "10px", xs: "12px" } }}>
                                                                        {item.title.length > 15 ? `${item.title.substring(0, 15)}...` : item.title}

                                                                    </Typography>
                                                                </Tooltip>
                                                                <Tooltip title={item.agenda.replace(/<\/?[^>]+(>|$)/g, "")}>
                                                                    <Typography sx={{ fontSize: { xs: '9px', sm: "10px", md: "12px" } }}> {item.agenda.replace(/<\/?[^>]+(>|$)/g, "").length > 15
                                                                        ? `${item.agenda.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 15)}...`
                                                                        : item.agenda.replace(/<\/?[^>]+(>|$)/g, "")}</Typography>
                                                                </Tooltip>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                );
                                            })
                                        )}
                                    </Grid>

                                    <Grid container sx={{ justifyContent: "flex-end", marginTop: "auto" }}>
                                        <Link to="/setup/schedulemeetingfilter" target="_blank">
                                            <Button variant="contained" sx={{ backgroundColor: '#ff5e65', borderRadius: "13px", textTransform: "capitalize", fontWeight: "bold" }} size="small">
                                                View More
                                            </Button>
                                        </Link>
                                    </Grid>
                                </Box>
                            </Grid>

                        )}


                        {isUserRoleCompare?.includes("lquickactions") && (

                            <Grid item xs={12} md={3} sm={4} >

                                <Box sx={{ ...userStyle?.homepagecontainer, padding: "16px 5px" }}>
                              
                                    <Typography sx={{ fontWeight: "700", paddingLeft: "16px", paddingTop: "16px" }}>Quick Actions</Typography>
                                    <br />
                                    <Box>

                                        <List>
                                            {links1.map((link, index) => (
                                                <ListItem
                                                    key={index}
                                                    secondaryAction={
                                                        <IconButton
                                                            edge="end"
                                                            aria-label="open link"
                                                            href={link.url}
                                                            target="_blank"
                                                        >
                                                            <OpenInNewIcon size="small" style={{ color: "#9e9e9e" }} />
                                                        </IconButton>
                                                    }
                                                >
                                                    <ListItemText primary={<Typography color="primary">{link.text}</Typography>} />
                                                </ListItem>
                                            ))}
                                        </List>


                                    </Box>
                                </Box>



                            </Grid>

                        )}

                        {isUserRoleCompare?.includes("lnews&events") && (

                            <Grid item xs={12} md={4.5} sm={12} >

                                <Box sx={{
                                    ...userStyle?.homepagecontainer,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    height: "100%",

                                }}>
                                    <Typography sx={{ fontWeight: "700" }}>News & Events</Typography>
                                    <br />
                                    <Grid container spacing={2} sx={{ flexGrow: 1 }}>

                                        {newsEvents.length === 0 ? (
                                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '150px' }}>
                                                <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>No Data</Typography>
                                            </Grid>
                                        ) : (
                                            newsEvents.map((item, index) => {
                                                const date = new Date(item.date);
                                                const day = date.getDate().toString().padStart(2, '0');
                                                const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();

                                                return (
                                                    <Grid item xs={12} md={6} sm={6} key={index}>
                                                        <Grid container>
                                                            <Grid item xs={4} md={4} sm={4} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                                <Box sx={{
                                                                    borderRadius: "10px", fontWeight: 800, backgroundColor: "#dbd6d67a",
                                                                    height: "50px",
                                                                    padding: "0px 10px",
                                                                    border: "1px solid #8080803b",
                                                                    display: "flex",
                                                                    justifyContent: "center",
                                                                    alignItems: "center",
                                                                    flexDirection: "column",
                                                                }}>
                                                                    <Typography sx={{ fontSize: "10px", fontFamily: "emoji", fontWeight: 900 }}>{day}</Typography>
                                                                    <Typography sx={{ fontSize: "10px", fontFamily: "emoji", fontWeight: 900 }}>{month}</Typography>
                                                                </Box>
                                                            </Grid>
                                                            <Grid item xs={8} md={8} sm={8} sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                                                <Tooltip title={item.eventname}>
                                                                    <Typography sx={{ fontWeight: "bold", fontFamily: "League Spartan, sans-serif", fontSize: { md: "11px", sm: "10px", xs: "12px" } }}>
                                                                        {item.eventname.length > 15 ? `${item.eventname.substring(0, 15)}...` : item.eventname}

                                                                    </Typography>
                                                                </Tooltip>
                                                                <Tooltip title={item.eventdescription}>
                                                                    <Typography sx={{ fontSize: { xs: '9px', sm: "10px", md: "12px" } }}> {item.eventdescription.length > 15 ? `${item.eventdescription.substring(0, 15)}...` : item.eventdescription}</Typography>
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
                                            <Button variant="contained" color="primary" size="small" sx={{ backgroundColor: '#ff5e65', borderRadius: "13px", textTransform: "capitalize", fontWeight: "bold" }}>
                                                View More
                                            </Button>
                                        </Link>
                                    </Grid>
                                </Box>
                            </Grid>
                        )}




                        {isUserRoleCompare?.includes("lrecentjobapplications") && (

                            <Grid item xs={12} md={4} sm={12}>
                                <Box
                                    sx={{
                                        ...userStyle?.homepagecontainer,
                                        minHeight: "552px",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between",
                                        height: "100%",
                                    }}
                                >
                                    <div>
                                        <Typography sx={{ fontWeight: "700" }}>Recent Job Applications</Typography>
                                        <br />
                                        <Grid container spacing={2}>
                                            {candidate.length === 0 ? (
                                                <Grid item xs={12} sm={6} md={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '150px' }}>
                                                    <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>No Data</Typography>
                                                </Grid>
                                            ) : (

                                                candidate.map((item, index) => (
                                                    <Grid item xs={12} sm={6} md={12} key={index}>
                                                        <Grid container >
                                                            <Grid item xs={2} sm={2} md={2} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                                <Avatar
                                                                    src={
                                                                        item.uploadedimage
                                                                            ? item.uploadedimage
                                                                            : item.gender === "Male"
                                                                                ? maleimage
                                                                                : femaleimage
                                                                    }
                                                                    alt="Profile"
                                                                    sx={{ width: 40, height: 40 }}
                                                                />
                                                            </Grid>
                                                            <Grid item xs={5} sm={5} md={5} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                                <Tooltip title={item.fullname.length > 10 ? item.fullname : ''}>
                                                                    <Typography sx={{ fontWeight: 800, fontSize: { xs: '9px', sm: "10px", md: "12px" }, textTransform: 'uppercase' }}>
                                                                        {item.fullname.length > 10 ? `${item.fullname.substring(0, 10)}...` : item.fullname}
                                                                    </Typography>
                                                                </Tooltip>
                                                                <Typography sx={{ fontWeight: 600, fontSize: { xs: '9px', sm: "10px", md: "12px" } }}> {item.city}</Typography>
                                                            </Grid>
                                                            <Grid item xs={5} sm={5} md={5} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                                <Tooltip title={item.role}>
                                                                    <Chip
                                                                        sx={{ height: "38px", background: "#b655196e", borderRadius: "28px", fontSize: "12px" }}
                                                                        label={item.role}
                                                                    />
                                                                </Tooltip>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                ))


                                            )}
                                        </Grid>
                                    </div>

                                    <Grid container sx={{ justifyContent: "flex-end", marginTop: "auto" }}>
                                        <Link to="/recruitment/assignedcandidates" target="_blank">
                                            <Button variant="contained" color="primary" size="small" sx={{ backgroundColor: '#ff5e65', borderRadius: "13px", textTransform: "capitalize", fontWeight: "bold" }}>
                                                View More
                                            </Button>
                                        </Link>
                                    </Grid>
                                </Box>
                            </Grid>

                        )}

                        {isUserRoleCompare?.includes("lupcominginterviews") && (

                            <Grid item xs={12} md={8} sm={12}>
                                <Box
                                    sx={{
                                        ...userStyle?.homepagecontainer,
                                        minHeight: "552px",
                                        display: "flex",
                                        flexDirection: "column",
                                    }}
                                >
                                    <div>
                                        <Typography sx={{ fontWeight: "700" }}>Upcoming Interviews</Typography>
                                        <br />

                                       
                                        <Box
                                            sx={{
                                                display: "flex",
                                                gap: "10px",
                                                flexWrap: "wrap",
                                                justifyContent: {
                                                    xs: "center", 
                                                    sm: "space-evenly", 
                                                },
                                                alignItems: "center", 
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    gap: "8px",
                                                    flexWrap: "wrap", 
                                                    justifyContent: "center",
                                                }}
                                            >
                                                {["Last Month", "Last Week", "Yesterday", "Today", "Tomorrow", "This Week", "This Month"].map((label) => (
                                                    <Button
                                                        key={label}
                                                        variant="outlined"
                                                        onClick={() => fetchButtonEvents(label)}
                                                        sx={{
                                                            backgroundColor: btnselect === label ? "#34abab" : "none",
                                                            color: btnselect === label ? "white" : "inherit",
                                                            "&:hover": {
                                                                backgroundColor: btnselect === label ? "#34abab" : "none",
                                                                color: btnselect === label ? "white" : "inherit",
                                                            },
                                                            borderRadius: "28px",
                                                            textTransform: "capitalize",
                                                            padding: "6px 12px", 
                                                            fontSize: {
                                                                xs: "08px", 
                                                                sm: "10px", 
                                                                md: "12px"
                                                            },
                                                        }}
                                                    >
                                                        {label}
                                                    </Button>
                                                ))}
                                            </Box>
                                        </Box>

                                        <br />

                                        {loader ? (
                                            <>
                                                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '150px' }}>
                                                    <ThreeDots
                                                        height="80"
                                                        width="80"
                                                        radius="9"
                                                        color="#1976d2"
                                                        ariaLabel="three-dots-loading"
                                                        wrapperStyle={{}}
                                                        wrapperClassName=""
                                                        visible={true}
                                                    />
                                                </Grid>
                                            </>
                                        ) : (
                                            <>

                                                {upcomingInterview.length === 0 ? (
                                                    <Grid
                                                        item
                                                        xs={12}
                                                        sx={{
                                                            display: "flex",
                                                            justifyContent: "center",
                                                            alignItems: "center",
                                                            height: "150px",
                                                        }}
                                                    >
                                                        <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                                                            No Data
                                                        </Typography>
                                                    </Grid>
                                                ) : (
                                                    <Grid container spacing={2}>
                                                        {upcomingInterview.map((item, index) => (
                                                            <Grid item xs={12} md={6} sm={6} key={index}>
                                                                <Grid
                                                                    container
                                                                    sx={{
                                                                        background: "#f1f1f19e",
                                                                        borderRadius: "28px",
                                                                        padding: "10px",
                                                                    }}
                                                                >
                                                                    <Grid item xs={2} md={2} sm={2} sx={{
                                                                        display: "flex",
                                                                        justifyContent: "center",
                                                                        alignItems: "center",
                                                                        paddingBottom: {
                                                                            xs: "10px", 
                                                                            sm: "0",
                                                                        },
                                                                    }}
                                                                    >
                                                                        <Avatar
                                                                            src={
                                                                                item.uploadedimage
                                                                                    ? item.uploadedimage
                                                                                    : item.gender === "Male"
                                                                                        ? maleimage
                                                                                        : femaleimage
                                                                            }
                                                                            alt="Profile"
                                                                            sx={{
                                                                                width: {
                                                                                    xs: "30px", 
                                                                                    sm: "35px",
                                                                                    md: "40px"
                                                                                },
                                                                                height: {
                                                                                    xs: "30px",
                                                                                    sm: "35px",
                                                                                    md: "40px"
                                                                                },
                                                                            }}
                                                                        />
                                                                    </Grid>

                                                                    <Grid item xs={5} md={5} sm={5} sx={{
                                                                        display: "flex",
                                                                        flexDirection: "column",
                                                                        alignItems: {
                                                                            xs: "center",
                                                                            sm: "center",
                                                                        },
                                                                    }}
                                                                    >
                                                                        <Tooltip title={item.fullname.length > 10 ? item.fullname : ''}>
                                                                            <Typography
                                                                                sx={{
                                                                                    fontWeight: 800,
                                                                                    fontSize: {
                                                                                        xs: "10px",
                                                                                        sm: "12px",
                                                                                    },
                                                                                    textTransform: "uppercase",
                                                                                }}
                                                                            >
                                                                                {item.fullname.length > 10
                                                                                    ? `${item.fullname.substring(0, 10)}...`
                                                                                    : item.fullname}
                                                                            </Typography>
                                                                        </Tooltip>
                                                                        <Typography
                                                                            sx={{ fontWeight: 600, fontSize: "12px" }}
                                                                        >
                                                                            {item.city}
                                                                        </Typography>
                                                                    </Grid>

                                                                    <Grid item xs={5} md={5} sm={5} sx={{
                                                                        display: "flex",
                                                                        flexDirection: "column",
                                                                        alignItems: {
                                                                            sm: "flex-end",
                                                                            md: "center",
                                                                            xs: "center",
                                                                        },

                                                                    }}
                                                                    >
                                                                        <Chip
                                                                            sx={{
                                                                                height: {
                                                                                    xs: "30px", 
                                                                                    sm: "34px",
                                                                                    sm: "38px",
                                                                                },
                                                                                background: "#d35a89",
                                                                                borderRadius: "28px",
                                                                                fontSize: {
                                                                                    xs: "10px",
                                                                                    sm: "11px",
                                                                                    md: "12px",
                                                                                },
                                                                            }}
                                                                            label={item.interviewrounds[0].timeRange}
                                                                        />
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                        ))}
                                                    </Grid>
                                                )}
                                            </>
                                        )}
                                    </div>

                                    <Grid
                                        item
                                        xs={12}
                                        sx={{
                                            display: "flex",
                                            justifyContent: "flex-end",
                                            marginTop: "auto",
                                        }}
                                    >
                                        <Link to="/interview/myinterview">
                                            <Button
                                                variant="contained"
                                                sx={{ backgroundColor: '#ff5e65', borderRadius: "13px", textTransform: "capitalize", fontWeight: "bold" }}
                                                size="small"
                                            >
                                                View More
                                            </Button>
                                        </Link>
                                    </Grid>
                                </Box>
                            </Grid>
                        )}
                        <HomeApprove />
                        <HomeProduction />
                        <HomeAccuracy />
                        <HomeMinimum />
                        <HomeTask />
                        <HomeExpenseIncome />
                        <HomeAsset />
                        <HomeInterview />
                        <HomeTickets />
                        <HomeMaintenance />
                        <HomeLoginAllot />

                    </Grid> */}
                </Box>
            </Box >

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
        </>

    );
};

export default Homelayout;
