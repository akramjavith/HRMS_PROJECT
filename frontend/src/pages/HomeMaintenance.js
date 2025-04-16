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


const HomeMaintenance = () => {


    const [btnselect, setBtnSelect] = useState("Original", "Today")

    const [loader, setLoader] = useState(false)


    const { auth } = useContext(AuthContext);

    const { isUserRoleAccess, isUserRoleCompare, listPageAccessMode, pageName, setPageName, buttonStyles, isAssignBranch } = useContext(UserRoleAccessContext);




    // Error Popup model
    const [isErrorOpendialog, setIsErrorOpendialog] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const handleClickOpenerr = () => {
        setIsErrorOpendialog(true);
    };




    const [btnselecttoday, setBtnSelectToday] = useState("Today")


    const [clientUserIDArray, setClientUserIDArray] = useState([]);




    const fetchAchievedAccuracyIndividual = async (e) => {
        setBtnSelectToday(e)
        setLoader(true)
        try {
            let request = await axios.post(SERVICE.MAINTENANCE_HOME, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                selectedFilter: e,

            });
            setClientUserIDArray(request?.data?.result.filter((item, index) => index <= 5));
            setLoader(false)
        } catch (err) { setLoader(false); handleApiError(err, setShowAlert, handleClickOpenerr); }
    }



    useEffect(() => {
        fetchAchievedAccuracyIndividual("Today");
    }, [])



    const getColorFromTitle = (title) => {
        const letter = title?.charAt(0).toUpperCase();
        const colors = {
            A: '#e5d652a8', B: '#e5d652a8', C: '#e5d652a8', D: '#e5d652a8', E: '#e5d652a8', F: '#e5d652a8', L: '#e5d652a8', // Group 1
            G: '#f5888899', H: '#f5888899', I: '#f5888899', J: '#f5888899', K: '#f5888899', T: '#f5888899',               // Group 2
            M: '#82f2c4ab', N: '#82f2c4ab', O: '#82f2c4ab', P: '#82f2c4ab', Q: '#82f2c4ab', R: '#82f2c4ab', Z: '#82f2c4ab', // Group 3
            S: '#88c3f599',                                                                                      // Group 4
            U: '#e184b699', V: '#e184b699', W: '#673ab782', X: '#673ab782', Y: '#673ab782'                             // Group 5 and 6
        };

        return colors[letter] || '#88c3f599';
    };



    const getColorFromTitleLetter = (title) => {
        const letter = title?.charAt(0).toUpperCase();
        const colors = {
            A: '#b5a626', B: '#b5a626', C: '#b5a626', D: '#b5a626', E: '#b5a626', F: '#b5a626', L: '#b5a626', // Group 1
            G: '#d76a6a', H: '#d76a6a', I: '#d76a6a', J: '#d76a6a', K: '#d76a6a', T: '#d76a6a',               // Group 2
            M: '#49b589', N: '#49b589', O: '#49b589', P: '#49b589', Q: '#49b589', R: '#49b589', Z: '#49b589', // Group 3
            S: '#6095c2',                                                                                      // Group 4
            U: '#ce6fa2', V: '#ce6fa2', W: '#7952be', X: '#7952be', Y: '#7952be'                             // Group 5 and 6
        };

        return colors[letter] || '#6095c2';
    };


    return (
        <>
            {isUserRoleCompare?.includes("lmaintenances") && (

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

                        <Typography sx={{ fontWeight: "700" }}>Maintenance</Typography>
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
                                gap: "10px",
                            }}>
                                {["Today", "Tomorrow", "This Week", "This Month"].map((label) => (
                                    <Button
                                        key={label}
                                        variant="outlined"
                                        onClick={() => fetchAchievedAccuracyIndividual(label)}
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
                                    onClick={() => fetchAchievedAccuracyIndividual(label)}
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

                                    {clientUserIDArray?.length === 0 ? (
                                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '150px' }}>
                                            <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>No Data</Typography>
                                        </Grid>
                                    ) : (
                                        <Grid container columnSpacing={2}>
                                            {clientUserIDArray?.map((exercise, index) => (
                                                <Grid item md={6} lg={6} xs={12} sm={12} key={index}>
                                                    <Grid container sx={{ m: 1.5 }}>
                                                        <Grid item md={2} lg={2} xs={2} sm={2}>
                                                            <Chip
                                                                label={exercise.employeenameto?.charAt(0).toUpperCase()}
                                                                sx={{
                                                                    bgcolor: getColorFromTitle(exercise.employeenameto
                                                                    ),
                                                                    color: getColorFromTitleLetter(exercise.employeenameto
                                                                    ),
                                                                    width: 40,
                                                                    height: 40,
                                                                    fontSize: '18px',
                                                                    fontWeight: 'bold',
                                                                }}
                                                            />
                                                        </Grid>
                                                        <Grid item md={6} lg={6} xs={6} sm={6}>
                                                            {/* <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{exercise.name}</Typography> */}
                                                            <Tooltip title={exercise.employeenameto?.length > 10 ? exercise.employeenameto : ''}>
                                                                <Typography
                                                                    sx={{
                                                                        fontWeight: 800,
                                                                        fontSize: {
                                                                            xs: "10px", // Smaller font size for mobile
                                                                            sm: "12px",
                                                                        },
                                                                        textTransform: "uppercase",
                                                                    }}
                                                                >
                                                                    {exercise.employeenameto?.length > 10
                                                                        ? `${exercise.employeenameto.substring(0, 10)}...`
                                                                        : exercise.employeenameto}
                                                                </Typography>
                                                            </Tooltip>
                                                            <Typography variant="body2" color="textSecondary">
                                                                {/* {exercise.target}: */}
                                                                {moment(exercise.date).format("DD/MM/YYYY")}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item md={4} lg={4} xs={4} sm={4}>

                                                            <Typography variant="subtitle2" sx={{ color: '#f2783a', fontWeight: 'bold', fontSize: "11px" }}>{exercise.assetmaterial}</Typography>
                                                            {/* <Typography
                                                                variant="subtitle2"
                                                                sx={{
                                                                    color: exercise.status === "Pending" ? "red" : "blue",
                                                                    fontWeight: 'bold'
                                                                }}
                                                            >
                                                                {exercise.status}
                                                            </Typography> */}

                                                            <Chip
                                                                sx={{
                                                                    height: "20px",
                                                                    borderRadius: "0px",
                                                                    backgroundColor: exercise.status === "Pending" ? "#d70b0bb8" : "#8bc34a",
                                                                    color: "white" // Set the text color to white for better contrast
                                                                }}
                                                                variant="contained"
                                                                label={exercise.status}
                                                            />
                                                            {/* <Typography variant="subtitle2" sx={{ color: '#db8c39', fontWeight: 'bold' }}>{exercise.accuracy}</Typography> */}
                                                        </Grid>



                                                    </Grid>
                                                    <Divider />
                                                </Grid>

                                            ))}
                                        </Grid>


                                    )}
                                </>
                            )}

                        </Grid>
                        {/* Always render the View More button at the bottom */}
                        <br />

                        <Grid container sx={{ justifyContent: "flex-end", marginTop: "auto" }}>

                            <Link to="/maintenancefilterlist" target="_blank">
                                <Button variant="contained" sx={{ backgroundColor: '#ff5e65', borderRadius: "13px", textTransform: "capitalize", fontWeight: "bold" }} size="small">
                                    View More
                                </Button>
                            </Link>
                        </Grid>
                    </Box>
                </Grid>
            )}
        </>
    );
};

export default HomeMaintenance;
