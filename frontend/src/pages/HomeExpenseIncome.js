import React, { useState, useEffect, useContext, useRef } from "react";
import {
    Box, TableHead, TableContainer, Table,
    Dialog, FormControl, Divider,
    DialogContent,
    Button,
    Chip, List, ListItem, ListItemText,
    Avatar,
    DialogActions,
    DialogTitle,
    DialogContentText,
    Grid, TableBody, Paper,
    Typography,
    Tooltip,
} from "@mui/material";
import { StyledTableRow, StyledTableCell } from "../components/Table";
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
import moment from "moment-timezone";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";


const HomeExpenseIncome = () => {


    const [loader, setLoader] = useState(false)


    const { auth } = useContext(AuthContext);

    const { isUserRoleAccess, isUserRoleCompare, listPageAccessMode, pageName, setPageName, buttonStyles, isAssignBranch } = useContext(UserRoleAccessContext);




    // Error Popup model
    const [isErrorOpendialog, setIsErrorOpendialog] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const handleClickOpenerr = () => {
        setIsErrorOpendialog(true);
    };

    const [upcomingInterview, setUpcomingInterview] = useState([]);
    const [btnselecttoday, setBtnSelectToday] = useState("Today")
    const [expense, setExpense] = useState([]);
    const [income, setIncome] = useState([]);



    const fetchAll = async (btnselect) => {
        setBtnSelectToday(btnselect)
        try {

            let [request, response] = await Promise.all([

                await

                    axios.post(SERVICE.EXPENSES_HOME, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        selectedfilter: btnselect,
                    }),
                axios.post(SERVICE.INCOME_HOME, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    selectedfilter: btnselect,
                }),
            ]);
            setExpense(request?.data?.total);
            setIncome(response?.data?.total);
        } catch (err) {
            console.log(err, "err")
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };



    useEffect(() => {
        fetchAll("Today");
    }, [])

    // console.log(expense, "expense")



    const links1 = [
        { text: "Expense", url: "/expense/expenselist", count: expense },
        { text: "Income", url: "/expense/income", count: income },
    ];

    return (
        <>

            {isUserRoleCompare?.includes("lexpense&income") && (

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

                        <Typography sx={{ fontWeight: "700" }}>Expense & Income</Typography>
                        <br />

                        {/* <Box
                            sx={{
                                display: "flex",
                                gap: "10px",
                                flexWrap: {
                                    xs: "wrap",
                                },
                                flexDirection: {
                                    xs: "row", // Stack buttons vertically on small screens
                                    sm: "row", // Align buttons in a row on larger screens
                                },
                                alignItems: {
                                    xs: "flex-start", // Align items to start for mobile
                                    sm: "center", // Center items on larger screens
                                    md: "center", // Center items on larger screens
                                    lg: "center", // Center items on larger screens
                                },
                                justifyContent: {
                                    md: "space-between",
                                    lg: "space-between",
                                    xs: "center",
                                    sm: "center",
                                },
                            }}
                        >




                            <Box sx={{
                                display: "flex",
                                gap: "8px",
                            }}>
                                {["Last Month", "Last Week", "Yesterday", "Today", "This Week", "This Month"].map((label) => (
                                    <Button
                                        key={label}
                                        variant="outlined"
                                        onClick={() => fetchAll(label, btnselecttoday)}
                                        sx={{
                                            backgroundColor: btnselecttoday === label ? "#34abab" : "none",
                                            color: btnselecttoday === label ? "white" : "inherit",
                                            "&:hover": {
                                                backgroundColor: btnselecttoday === label ? "#34abab" : "none",
                                                color: btnselecttoday === label ? "white" : "inherit",
                                            },
                                            borderRadius: "28px",
                                            textTransform: "capitalize",
                                            fontSize: {
                                                xs: "12px", // Smaller font size for mobile
                                                sm: "14px", // Larger font size for bigger screens
                                            },
                                        }}
                                        color="primary"
                                    >
                                        {label}
                                    </Button>
                                ))}

                            </Box>
                        </Box> */}





                        <Box
                            sx={{
                                display: "flex",
                                gap: "10px", // Space between buttons
                                flexWrap: "nowrap", // Prevent wrapping to the next row
                                justifyContent: {
                                    xs: "space-around", // Distribute buttons evenly on smaller screens
                                    sm: "space-between", // Adjust spacing for medium screens
                                },
                                alignItems: "center", // Align buttons vertically in the center
                                overflowX: "auto", // Enable horizontal scrolling if the screen is too small
                            }}
                        >
                            {["Last Month", "Last Week", "Yesterday", "Today", "Tomorrow", "This Week", "This Month"].map((label) => (
                                <Button
                                    key={label}
                                    variant="outlined"
                                    onClick={() => fetchAll(label, btnselecttoday)}
                                    sx={{
                                        backgroundColor: btnselecttoday === label ? "#34abab" : "none",
                                        color: btnselecttoday === label ? "white" : "inherit",
                                        "&:hover": {
                                            backgroundColor: btnselecttoday === label ? "#34abab" : "none",
                                            color: btnselecttoday === label ? "white" : "inherit",
                                        },
                                        borderRadius: "28px",
                                        textTransform: "capitalize",
                                        padding: "6px 12px", // Adjust padding for a smaller button
                                        fontSize: {
                                            xs: "08px", // Reduced font size for mobile
                                            sm: "10px", // Slightly larger for small screens
                                            md: "12px", // Default size for medium and above
                                        },
                                        whiteSpace: "nowrap", // Prevent text wrapping within buttons
                                    }}
                                >
                                    {label}
                                </Button>
                            ))}
                        </Box>




                        <br />

                        <br />

                        <Grid container spacing={2} >
                            {/* Conditional rendering if meetingArray is empty */}
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

                                    {expense?.length === 0 ? (
                                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '150px' }}>
                                            <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>No Data</Typography>
                                        </Grid>
                                    ) : (
                                        <Grid container spacing={2} sx={{ padding: "0px 20px" }}>
                                            {links1.map((link, index) => (

                                                <React.Fragment key={index}>
                                                    <Grid item xs={6} md={6} lg={6} sm={6} marginTop={1}>

                                                        <Typography color="primary">
                                                            {link.text}

                                                        </Typography>
                                                    </Grid>

                                                    <Grid item xs={4} md={4} lg={4} sm={4} marginTop={1}>
                                                        {/* <Typography sx={{ fontWeight: 'bold', fontSize: "12px", color: '#ffffff', width: "20px", border: "1px solid #e75353", borderRadius: "50%", backgroundColor: "#fc5d5deb", display: "flex", justifyContent: "center", alignItems: "center" }}> */}

                                                        <Chip
                                                            sx={{ height: "25px", borderRadius: "0px" }}
                                                            color={"warning"}
                                                            variant="outlined"
                                                            label={link.count}
                                                        />

                                                        {/* </Typography> */}
                                                    </Grid>
                                                    <Grid item xs={2} md={2} lg={2} sm={2} >
                                                        <IconButton
                                                            edge="end"
                                                            aria-label="open link"
                                                            href={link.url}
                                                            target="_blank"
                                                            margin
                                                        >
                                                            <OpenInNewIcon size="small" style={{ color: "#9e9e9e" }} />
                                                        </IconButton>

                                                    </Grid>
                                                </React.Fragment>
                                            ))}
                                        </Grid>


                                    )}
                                </>
                            )}

                        </Grid>
                        {/* Always render the View More button at the bottom */}


                        <Grid container sx={{ justifyContent: "flex-end", marginTop: "auto" }}>
                            {/* 
                    <Link to="/expense/expenselist" target="_blank">
                        <Button variant="contained" sx={{ backgroundColor: '#ff5e65', borderRadius: "13px", textTransform: "capitalize", fontWeight: "bold" }} size="small">
                            View More
                        </Button>
                    </Link> */}
                        </Grid>
                    </Box>
                </Grid>
            )}
        </>

    );
};

export default HomeExpenseIncome;
