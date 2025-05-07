import React, { useState, useEffect, useContext } from "react";
import { Box, Button, Chip, Grid, Typography } from "@mui/material";
import { ThreeDots } from "react-loader-spinner";
import { userStyle } from "../pageStyle";
import axios from "axios";
import { SERVICE } from "../services/Baseservice";
import { Link } from "react-router-dom";
import { handleApiError } from "../components/Errorhandling";
import { UserRoleAccessContext, AuthContext } from "../context/Appcontext";

const HomeTask = () => {

    const [loader, setLoader] = useState(true)
    const { auth } = useContext(AuthContext);
    const { isUserRoleCompare, isAssignBranch } = useContext(UserRoleAccessContext);


    const accessbranch = isAssignBranch?.map((data) => ({
        branch: data.branch,
        company: data.company,
        unit: data.unit,
    }));
    const [isErrorOpendialog, setIsErrorOpendialog] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const handleClickOpenerr = () => {
        setIsErrorOpendialog(true);
    };

    const [btnselecttoday, setBtnSelectToday] = useState("Today")
    const [assigned, setAssigned] = useState({
        taskforuserAssigned: 0,
        taskforuserPending: 0,
        taskforuserFinished: 0,
        taskforuserApplicable: 0,
        taskforuserPostponed: 0,
        taskforuserPaused: 0,
        taskforuserCompleted: 0
    });

    const fetchAll = async (btnselect) => {
        setBtnSelectToday(btnselect)
        try {
            if ((isUserRoleCompare?.includes("ltaskusersreport") && isUserRoleCompare?.includes("ltaskstatus"))) {
                let res_employee = await axios.post(SERVICE.ASSIGNED_HOME, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    selectedfilter: btnselect,
                });
                setAssigned(res_employee?.data?.taskforuser);
                setLoader(false);
            }
        } catch (err) { setLoader(false); handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    useEffect(() => {
        fetchAll("Last Week");
    }, [])

    const links1 = [
        { text: "Completed", count: assigned.taskforuserCompleted },
        { text: "Assigned", count: assigned.taskforuserAssigned },
        { text: "Pause", count: assigned.taskforuserPaused },
        { text: "Pending", count: assigned.taskforuserPending },
        { text: "PostPoned", count: assigned.taskforuserPostponed },
        { text: "Finished By Others", count: assigned.taskforuserFinished },
        { text: "Not Applicable Time", count: assigned.taskforuserApplicable },
    ];

    return (
        <>

            {(isUserRoleCompare?.includes("ltaskusersreport") && isUserRoleCompare?.includes("ltaskstatus")) && (


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

                        <Typography sx={{ fontWeight: "700" }}>Task</Typography>
                        <br />
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
                                    <Grid container spacing={2} sx={{ padding: "0px 20px" }}>
                                        {links1.map((link, index) => (

                                            <React.Fragment key={index}>
                                                <Grid item xs={6} md={6} lg={6} sm={6} marginTop={1}>

                                                    <Typography color="primary">
                                                        {link.text}

                                                    </Typography>
                                                </Grid>

                                                <Grid item xs={4} md={4} lg={4} sm={4} marginTop={1}>
                                                    <Chip
                                                        sx={{ height: "25px", borderRadius: "0px" }}
                                                        color={"warning"}
                                                        variant="outlined"
                                                        label={link.count}
                                                    />
                                                </Grid>
                                                <Grid item xs={2} md={2} lg={2} sm={2} >
                                                </Grid>
                                            </React.Fragment>
                                        ))}
                                    </Grid>
                                </>
                            )}
                        </Grid>
                        <Grid container sx={{ justifyContent: "flex-end", marginTop: "auto" }}>

                            <Link to="/task/taskforuserreport" target="_blank">
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

export default HomeTask;
