import React, { useState, useEffect, useContext, useRef } from "react";
import {
    Box,
    Dialog,
    DialogContent,
    Button,
    DialogActions,
    DialogTitle,
    DialogContentText,
    Grid, Avatar, Tooltip, Chip, Card, CardContent,
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
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import { useNavigate } from "react-router-dom";
import moment from "moment-timezone";
import LoadingButton from "@mui/lab/LoadingButton";
import BlockIcon from "@mui/icons-material/Block";
import WarningIcon from "@mui/icons-material/Warning";
import Homelayout from "./Homelayout";
import CakeIcon from '@mui/icons-material/Cake';
import WorkIcon from "@mui/icons-material/Work";
import FavoriteIcon from "@mui/icons-material/Favorite";

const HomeBirthday = () => {
    //in work anniversary/birthday reminder/

    const [birthday, setBirthday] = useState();
    const [noBirthDay, setNoBirthDay] = useState();

    const [workAnniversary, setWorkAnniversary] = useState();
    const [noWorkAnniversary, setNoWorkAnniversary] = useState();

    const [marriageAnniversary, setMarriageAnniversary] = useState();
    const [noMarriageAnniversary, setNoMarriageAnniversary] = useState();


    //chatbot
    const [chatBoxLink, setChatBoxLink] = useState("");
    const { auth } = useContext(AuthContext);

    const { isUserRoleAccess, setAllUsersData } = useContext(
        UserRoleAccessContext
    );





    const checkCurrentDate = new Date();

    // get current time
    const currentHours = checkCurrentDate.getHours();
    const currentMinutes = checkCurrentDate.getMinutes();
    // const currentSeconds = checkCurrentDate.getSeconds();

    // Determine whether it's AM or PM
    const currentperiod = currentHours >= 12 ? "PM" : "AM";





    // Error Popup model
    const [isErrorOpendialog, setIsErrorOpendialog] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const handleClickOpenerr = () => {
        setIsErrorOpendialog(true);
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
                            gender: item.gender,
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
                        return {
                            companyname: item.companyname, profileimage: item.profileimage,
                            gender: item.gender, doj: "Today"
                        };
                    } else {
                        const dojdate = itemdojDate.getDate();
                        const dojMonth = itemdojDate.getMonth() + 1;
                        const dojYear = itemdojDate.getFullYear();
                        return {
                            companyname: item.companyname,
                            profileimage: item.profileimage,
                            gender: item.gender,
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
                        return {
                            companyname: item.companyname, profileimage: item.profileimage,
                            gender: item.gender, dom: "Today"
                        };
                    } else {
                        const domdate = itemdomDate.getDate();
                        const domMonth = itemdomDate.getMonth() + 1;
                        const domYear = itemdomDate.getFullYear();
                        return {
                            companyname: item.companyname,
                            profileimage: item.profileimage,
                            gender: item.gender,
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



    let maleimage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaHmgseRqO6CI14XWSh5swCN19tzNhtgptvg&s"
    let femaleimage = " https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVmPFyachBpGr2wuhBzg9WtRZVdyJhQzXW8w&"


    return (
        // birthday

        <Grid container spacing={2} >


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
                        <Typography sx={{ fontWeight: "700" }}>This Week Birthdays
                            &ensp; <span
                                style={{
                                    position: 'absolute',

                                    backgroundColor: '#29b6f6',
                                    borderRadius: '50%',
                                    padding: '2px 5px',

                                }}
                            >

                                <Link to="/calendarview" target="_blank" style={{ marginRight: "0px" }}>
                                    <CakeIcon sx={{ color: 'white', fontSize: "9px", width: "12px", height: "9px" }} />
                                </Link>

                            </span>


                        </Typography>
                        <br />
                        <Grid container spacing={2}>
                            {noBirthDay?.length === 0 ? (
                                <Grid item xs={12} sm={6} md={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '150px' }}>
                                    <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}> No Birthdays this Week</Typography>
                                </Grid>
                            ) : (

                                birthday?.map((item, index) => (
                                    <Grid item xs={12} sm={6} md={12} key={index}>
                                        <Grid container >
                                            <Grid item xs={2} sm={2} md={2} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                {/* <Avatar
                                                    src={
                                                        item.profileimage
                                                            ? item.profileimage
                                                            : item.gender === "Male"
                                                                ? maleimage
                                                                : femaleimage
                                                    }
                                                    alt="Profile"
                                                    sx={{ width: 40, height: 40 }}
                                                /> */}
                                                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                                                    <Avatar
                                                        src={
                                                            item.profileimage
                                                                ? item.profileimage
                                                                : item.gender === "Male"
                                                                    ? maleimage
                                                                    : femaleimage
                                                        } // Replace with your image URL
                                                        sx={{ width: 40, height: 40, margin: '0 auto' }}
                                                    />
                                                    <Box
                                                        sx={{
                                                            position: 'absolute',
                                                            top: '20px',
                                                            right: '-2px',
                                                            backgroundColor: '#29b6f6',
                                                            borderRadius: '50%',
                                                            padding: '3px',

                                                        }}
                                                    >

                                                        <CakeIcon sx={{ color: 'white', fontSize: "8px", width: "12px", height: "10px" }} />

                                                    </Box>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={5} sm={5} md={5} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                <Tooltip title={item.companyname.length > 10 ? item.companyname : ''}>
                                                    <Link to={`/birthdaycard/?name=${item?.companyname
                                                        }&id=${item?._id}&status=${true}`}
                                                        target="_blank"
                                                        style={{
                                                            textDecoration: "none",
                                                            color: "#616161",
                                                        }}>
                                                        <Typography sx={{ fontWeight: 800, fontSize: { xs: '9px', sm: "10px", md: "12px" }, textTransform: 'uppercase' }}>



                                                            {item.companyname.length > 10 ? `${item.companyname.substring(0, 10)}...` : item.companyname}

                                                        </Typography>
                                                    </Link>
                                                </Tooltip>
                                                {/* <Typography sx={{ fontWeight: 600, fontSize: { xs: '9px', sm: "10px", md: "12px" } }}> {item.city}</Typography> */}
                                            </Grid>
                                            <Grid item xs={5} sm={5} md={5} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                <Tooltip title={item.dob}>
                                                    <Chip
                                                        sx={{ height: "38px", background: "#b655196e", borderRadius: "28px", fontSize: "12px" }}
                                                        label={item.dob}
                                                    />
                                                </Tooltip>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                ))

                            )}
                        </Grid>
                    </div>
                </Box>
            </Grid>


            {/* //work anniversary */}

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
                        <Typography sx={{ fontWeight: "700" }}>This Week Work Anniversary
                            &ensp; <span
                                style={{
                                    position: 'absolute',

                                    backgroundColor: '#8BC34A',
                                    borderRadius: '50%',
                                    padding: '2px 5px',

                                }}
                            >
                                <Link to="/calendarview" target="_blank" style={{ marginRight: "0px" }}>
                                    <WorkIcon sx={{ color: 'white', fontSize: "9px", width: "12px", height: "9px" }} />
                                </Link>
                            </span>


                        </Typography>
                        <br />
                        <Grid container spacing={2}>
                            {noWorkAnniversary?.length === 0 ? (
                                <Grid item xs={12} sm={6} md={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '150px' }}>
                                    <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}> No Work Anniversary this Week</Typography>
                                </Grid>
                            ) : (

                                workAnniversary?.map((item, index) => (
                                    <Grid item xs={12} sm={6} md={12} key={index}>
                                        <Grid container >
                                            <Grid item xs={2} sm={2} md={2} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                {/* <Avatar
                                                    src={
                                                        item.profileimage
                                                            ? item.profileimage
                                                            : item.gender === "Male"
                                                                ? maleimage
                                                                : femaleimage
                                                    }
                                                    alt="Profile"
                                                    sx={{ width: 40, height: 40 }}
                                                /> */}
                                                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                                                    <Avatar
                                                        src={
                                                            item.profileimage
                                                                ? item.profileimage
                                                                : item.gender === "Male"
                                                                    ? maleimage
                                                                    : femaleimage
                                                        } // Replace with your image URL
                                                        sx={{ width: 40, height: 40, margin: '0 auto' }}
                                                    />
                                                    <Box
                                                        sx={{
                                                            position: 'absolute',
                                                            top: '20px',
                                                            right: '-2px',
                                                            backgroundColor: '#8BC34A',
                                                            borderRadius: '50%',
                                                            padding: '3px',

                                                        }}
                                                    >
                                                        <WorkIcon sx={{ color: 'white', fontSize: "8px", width: "12px", height: "10px" }} />
                                                    </Box>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={5} sm={5} md={5} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                <Tooltip title={item.companyname.length > 10 ? item.companyname : ''}>
                                                    <Typography sx={{ fontWeight: 800, fontSize: { xs: '9px', sm: "10px", md: "12px" }, textTransform: 'uppercase' }}>
                                                        {item.companyname.length > 10 ? `${item.companyname.substring(0, 10)}...` : item.companyname}
                                                    </Typography>
                                                </Tooltip>
                                                {/* <Typography sx={{ fontWeight: 600, fontSize: { xs: '9px', sm: "10px", md: "12px" } }}> {item.city}</Typography> */}
                                            </Grid>
                                            <Grid item xs={5} sm={5} md={5} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                <Tooltip title={item.doj}>
                                                    <Chip
                                                        sx={{ height: "38px", background: "#b655196e", borderRadius: "28px", fontSize: "12px" }}
                                                        label={item.doj}
                                                    />
                                                </Tooltip>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                ))


                            )}
                        </Grid>
                    </div>

                </Box>
            </Grid>


            {/* Wedding Anniversary */}

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
                        <Typography sx={{ fontWeight: "700" }}> This Week Wedding Anniversary &ensp; <span
                            style={{
                                position: 'absolute',

                                backgroundColor: '#E91E63',
                                borderRadius: '50%',
                                padding: '2px 5px',

                            }}
                        >

                            <Link to="/calendarview" target="_blank" style={{ marginRight: "0px" }}>
                                <FavoriteIcon sx={{ color: 'white', fontSize: "9px", width: "12px", height: "9px" }} />
                            </Link>
                        </span>


                        </Typography>

                        <br />
                        <Grid container spacing={2}>
                            {noMarriageAnniversary?.length === 0 ? (
                                <Grid item xs={12} sm={6} md={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '150px' }}>
                                    <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}> No Wedding Anniversary this Week</Typography>
                                </Grid>
                            ) : (

                                marriageAnniversary?.map((item, index) => (
                                    <Grid item xs={12} sm={6} md={12} key={index}>
                                        <Grid container >
                                            <Grid item xs={2} sm={2} md={2} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                {/* <Avatar
                                                    src={
                                                        item.profileimage
                                                            ? item.profileimage
                                                            : item.gender === "Male"
                                                                ? maleimage
                                                                : femaleimage
                                                    }
                                                    alt="Profile"
                                                    sx={{ width: 40, height: 40 }}
                                                /> */}
                                                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                                                    <Avatar
                                                        src={
                                                            item.profileimage
                                                                ? item.profileimage
                                                                : item.gender === "Male"
                                                                    ? maleimage
                                                                    : femaleimage
                                                        } // Replace with your image URL
                                                        sx={{ width: 40, height: 40, margin: '0 auto' }}
                                                    />
                                                    <Box
                                                        sx={{
                                                            position: 'absolute',
                                                            top: '20px',
                                                            right: '-2px',
                                                            backgroundColor: '#E91E63',
                                                            borderRadius: '50%',
                                                            padding: '3px',

                                                        }}
                                                    >

                                                        <FavoriteIcon sx={{ color: 'white', fontSize: "8px", width: "12px", height: "10px" }} />

                                                    </Box>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={5} sm={5} md={5} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                <Tooltip title={item.companyname.length > 10 ? item.companyname : ''}>
                                                    <Typography sx={{ fontWeight: 800, fontSize: { xs: '9px', sm: "10px", md: "12px" }, textTransform: 'uppercase' }}>
                                                        {item.companyname.length > 10 ? `${item.companyname.substring(0, 10)}...` : item.companyname}
                                                    </Typography>
                                                </Tooltip>
                                                {/* <Typography sx={{ fontWeight: 600, fontSize: { xs: '9px', sm: "10px", md: "12px" } }}> {item.city}</Typography> */}
                                            </Grid>
                                            <Grid item xs={5} sm={5} md={5} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                <Tooltip title={item.dom}>
                                                    <Chip
                                                        sx={{ height: "38px", background: "#b655196e", borderRadius: "28px", fontSize: "12px" }}
                                                        label={item.dom}
                                                    />
                                                </Tooltip>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                ))


                            )}
                        </Grid>
                    </div>


                </Box>
            </Grid>

        </Grid >

    );
};

export default HomeBirthday;
