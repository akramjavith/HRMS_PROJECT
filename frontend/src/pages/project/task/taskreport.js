import React, { useState, useEffect, useMemo, useContext } from "react";
import { Box, Grid, Typography, OutlinedInput, Dialog, DialogActions, DialogContent, FormControl, Button } from "@mui/material";
import CanvasJSReact from './canvasjs.react';
import { userStyle } from "../../../pageStyle";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import { handleApiError } from "../../../components/Errorhandling";
import { UserRoleAccessContext, AuthContext } from '../../../context/Appcontext';
import PageHeading from "../../../components/PageHeading";


var CanvasJSChart = CanvasJSReact.CanvasJSChart;


const TaskReport = () => {

    const { auth } = useContext(AuthContext);

    const { isUserRoleAccess, isUserRoleCompare, pageName, setPageName } = useContext(UserRoleAccessContext);

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };


    //Added the date filter state
    const [dateFilter, setDateFilter] = useState({
        startdate: "", enddate: "",
    })

    let userId = localStorage.LoginUserId;


    const userName = isUserRoleAccess.username;


    const [taskdevincomplete, settaskdevincomplete] = useState();
    const [taskdevincompletecount, settaskdevincompletecount] = useState();
    const [taskdevcomplete, settaskdevcomplete] = useState();
    const [taskdevcompletecount, settaskdevcompletecount] = useState();
    const [tasktestercomplete, settasktestercomplete] = useState();
    const [tasktesterincomplete, settasktesterincomplete] = useState();



    //DateFilter Added 
    const fetchDate = async () => {
        setPageName(!pageName);
        if (dateFilter.startdate && dateFilter.enddate != "") {
            try {

                let request = await axios.post(SERVICE.TASKREPORTINCOMPLETE, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                    startdate: String(dateFilter.startdate),
                    enddate: String(dateFilter.enddate),
                    loginname: String(isUserRoleAccess.username),
                    loginreportacess: String(isUserRoleCompare[0]?.access)
                })

                settaskdevincomplete(request?.data?.taskss);
                settaskdevincompletecount(request?.data?.totalcount);

                let requestdev = await axios.post(SERVICE.TASKREPORTCOMPLETE, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                    startdate: String(dateFilter.startdate),
                    enddate: String(dateFilter.enddate),
                    loginname: String(isUserRoleAccess.username),
                    loginreportacess: String(isUserRoleCompare[0]?.access)
                })
                settaskdevcomplete(requestdev?.data?.taskss)
                settaskdevcompletecount(requestdev?.data?.totalcount);

                let requesttes = await axios.post(SERVICE.TASKREPORTTESTCOMPLETE, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                    startdate: String(dateFilter.startdate),
                    enddate: String(dateFilter.enddate),
                    loginname: String(isUserRoleAccess.username),
                    loginreportacess: String(isUserRoleCompare[0]?.access)
                })
                settasktestercomplete(requesttes?.data?.totalcount)


                let requesttest = await axios.post(SERVICE.TASKREPORTTESTINCOMPLETE, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                    startdate: String(dateFilter.startdate),
                    enddate: String(dateFilter.enddate),
                    loginname: String(isUserRoleAccess.username),
                    loginreportacess: String(isUserRoleCompare[0]?.access)
                })
                settasktesterincomplete(requesttest?.data?.totalcount)



            } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }

        } else {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Enter Date"}</p>
                </>
            );
            handleClickOpenerr();
        }
    };


    let completelist = taskdevcompletecount + tasktestercomplete

    let incompletelist = taskdevincompletecount + tasktesterincomplete;

    let Totallist = Number(completelist) + Number(incompletelist)


    //BAR CHART....

    const [lastfivemonthcomplete, setLastfivemonthcomplete] = useState([])
    const [lastfivemonthincomplete, setLastfivemonthincomplete] = useState([])
    const currentMonth = new Date().getMonth();

    const getlastfivemonthcomplete = async () => {
        setPageName(!pageName);
        try {
            let res = await axios.get(SERVICE.TASKFIVECOMPLETE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setLastfivemonthcomplete(res?.data?.newData);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    }



    const getlastfivemonthincomplete = async () => {
        setPageName(!pageName);
        try {
            let res1 = await axios.get(SERVICE.TASKFIVEINCOMPLETE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setLastfivemonthincomplete(res1?.data?.newData);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    }





    useEffect(() => {
        getlastfivemonthcomplete();
        getlastfivemonthincomplete();
    }, []);



    //bar chart

    const optionsPurchase1 = useMemo(() => {

        const monthRange = [];
        let monthIndex = currentMonth;
        for (let i = 0; i < 5; i++) {
            monthIndex--;
            if (monthIndex === -1) {
                monthIndex = 11;
            }
            monthRange.unshift(monthIndex);
        }



        // Filter the complete data for the last 5 months except the current month
        const filteredCompleteData = lastfivemonthcomplete.filter((item) => {
            const assignedMonth = new Date(item.assigneddate).getMonth();
            return monthRange.includes(assignedMonth);
            //   return assignedMonth !== currentMonth && currentMonth - assignedMonth <= 5;

        });



        // Filter the incomplete data for the last 5 months except the current month
        const filteredIncompleteData = lastfivemonthincomplete.filter((item) => {
            const assignedMonth = new Date(item.assigneddate).getMonth();
            // Add an additional check for the presence of assigned developers

            //   return assignedMonth !== currentMonth && currentMonth - assignedMonth <= 5 && item.assignedtodeveloper.length > 0;
            return (
                monthRange.includes(assignedMonth) &&
                item.assignedtodeveloper.length > 0
            );
        });


        // Create an object to store the count for each month
        const monthCount = {};

        // Calculate the count for complete tasks for each month
        filteredCompleteData.forEach((item) => {
            const assignedMonth = new Date(item.assigneddate).toLocaleString('default', { month: 'short' });
            if (monthCount.hasOwnProperty(assignedMonth)) {
                monthCount[assignedMonth].complete++;
            } else {
                monthCount[assignedMonth] = { incomplete: 0, complete: 1 };
            }
        });

        // Calculate the count for incomplete tasks for each month
        filteredIncompleteData.forEach((item) => {
            const assignedMonth = new Date(item.assigneddate).toLocaleString('default', { month: 'short' });
            if (monthCount.hasOwnProperty(assignedMonth)) {
                monthCount[assignedMonth].incomplete++;
            } else {
                monthCount[assignedMonth] = { incomplete: 1, complete: 0 };
            }
        });


        const completeCount = monthRange.map((monthIndex) => {
            const label = new Date(0, monthIndex).toLocaleString("default", {
                month: "short",
            });
            return monthCount[label] ? monthCount[label].complete : 0;
        });

        const incompleteCount = monthRange.map((monthIndex) => {
            const label = new Date(0, monthIndex).toLocaleString("default", {
                month: "short",
            });
            return monthCount[label] ? monthCount[label].incomplete : 0;
        });

        const maxCount = Math.max(Math.max(...completeCount), Math.max(...incompleteCount));



        const newOptionsPurchase1 = {
            animationEnabled: true,
            exportEnabled: true,
            theme: "light1",
            title: {
                text: "Last 5 Month Task Report",
                fontSize: 25,
            },
            axisX: {
                title: "Months",
                interval: 1,
                labelFontSize: 12,
                labelAngle: -45,
                valueFormatString: "MMM",
            },
            axisY: {
                title: "Task Count",
                includeZero: true,
                interval: 1,
                labelFontSize: 12,
                valueFormatString: "0",
                maximum: maxCount,
            },
            data: [{
                type: "column",
                name: "Task Assigned",
                legendText: "Count of Completed",
                color: '#2a9df4',
                showInLegend: true,
                dataPoints: monthRange.map((monthIndex) => {
                    const label = new Date(0, monthIndex).toLocaleString("default", {
                        month: "short",
                    });
                    return {
                        label,
                        y: monthCount[label] ? monthCount[label].complete : 0,
                    };
                }),
            },
            {
                type: "column",
                name: "Task Assigned",
                legendText: "Count of Incompleted",
                axisYType: "secondary",
                showInLegend: true,
                color: 'silver',
                dataPoints: monthRange.map((monthIndex) => {
                    const label = new Date(0, monthIndex).toLocaleString("default", {
                        month: "short",
                    });
                    return {
                        label,
                        y: monthCount[label] ? monthCount[label].incomplete : 0,
                    };
                }),
            }
            ]
        };
        return newOptionsPurchase1;
    }, [lastfivemonthcomplete, lastfivemonthincomplete, currentMonth]);


    //pie chart...........................
    const [currentmonthincomplete, setcurrentmonthincomplete] = useState([]);
    const [currentmonthincompletecount, setcurrentmonthincompletecount] = useState([]);
    const [currentmonthcomplete, setcurrentmonthcomplete] = useState([]);
    const [currentmonthcompletecount, setcurrentmonthcompletecount] = useState([]);
    const [currentmonthtesterincomplete, setcurrentmonthtesterincomplete] = useState([]);
    const [currentmonthtesterincompletecount, setcurrentmonthtesterincompletecount] = useState([]);
    const [currentmonthtestercomplete, setcurrentmonthtestercomplete] = useState([]);
    const [currentmonthtestercompletecount, setcurrentmonthtestercompletecount] = useState([]);


    const getCurrentmonthincomplete = async () => {
        setPageName(!pageName);
        try {
            let res1 = await axios.post(SERVICE.TASKCURRENTINCOMPLETE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                homeuserlogin: isUserRoleAccess.username,
                homeuseraccess: isUserRoleCompare[0]?.access
            });
            setcurrentmonthincomplete(res1?.data?.tasks);
            setcurrentmonthincompletecount(res1?.data?.totalcount)

        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    }



    const getCurrentmonthcomplete = async () => {
        setPageName(!pageName);
        try {
            let res1 = await axios.post(SERVICE.TASKCURRENTCOMPLETE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                homeuserlogin: isUserRoleAccess.username,
                homeuseraccess: isUserRoleCompare[0]?.access
            });
            setcurrentmonthcomplete(res1?.data?.tasks);
            setcurrentmonthcompletecount(res1?.data?.totalcount);

        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    }


    const getCurrentmonthtesterincomplete = async () => {
        setPageName(!pageName);
        try {
            let res1 = await axios.post(SERVICE.TASKCURRENTTESTERINCOMPLETE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                homeuserlogin: isUserRoleAccess.username,
                homeuseraccess: isUserRoleCompare[0]?.access
            });
            setcurrentmonthtesterincomplete(res1?.data?.tasks);
            setcurrentmonthtesterincompletecount(res1?.data?.totalcount);

        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    }



    const getCurrentmonthtestercomplete = async () => {
        setPageName(!pageName);
        try {
            let res1 = await axios.post(SERVICE.TASKCURRENTTESTERCOMPLETE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                homeuserlogin: isUserRoleAccess.username,
                homeuseraccess: isUserRoleCompare[0]?.access
            });
            setcurrentmonthtestercomplete(res1?.data?.tasks);
            setcurrentmonthtestercompletecount(res1?.data?.totalcount);

        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    }


    let complete_count = Number(currentmonthcompletecount) + Number(currentmonthtestercompletecount)
    let incomplete_count = Number(currentmonthincompletecount) + Number(currentmonthtesterincompletecount)


    useEffect(() => {
        getCurrentmonthincomplete();
        getCurrentmonthcomplete();
        getCurrentmonthtesterincomplete();
        getCurrentmonthtestercomplete();
    }, []);


    //pie chart...
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "Auguest", "september", "octomber", "November", "December"];


    const getcmonth = new Date();
    const valnmonth = monthNames[getcmonth.getMonth()];

    const options = {
        animationEnabled: true,
        exportEnabled: true,
        theme: "light1",
        title: {
            text: `Current Task Report (${valnmonth})`,
            fontSize: 20,
        },
        data: [
            {
                type: "pie",
                startAngle: 200,
                indexLabel: "{label} {y}",
                name: " Task Assigned",
                showInLegend: true,
                dataPoints: [
                    {
                        label: "Complete",
                        y: complete_count,
                        color: '#2a9df4',
                        legendText: `Complete (${complete_count})`,
                    },
                    {
                        label: "Incomplete",
                        y: incomplete_count,
                        color: 'silver',
                        legendText: `Incomplete (${incomplete_count})`,
                    },
                ],
            },
        ],
    };



    return (
        <>
            <Box>
                <Grid container spacing={2}>
                    <Grid item md={6} xs={12} sm={6}>
                        {/* <Typography variant="h5" sx={{ fontWeight: 600 }}>
                            Task Report
                        </Typography> */}
                        <PageHeading                       
                            title={<b>Task Board Admin</b>}
                            modulename="Projects"
                            submodulename="Tasks"
                            mainpagename="Task Report"
                            subpagename=""
                            subsubpagename=""
                        />
                    </Grid>
                    <Grid item md={6} xs={12} sm={6}>
                        <Box container>
                            <Grid container spacing={2}>
                                <Grid item={5} xs={12} sm={5}>
                                    <Typography>From Date</Typography>
                                    <FormControl fullWidth size="small">
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="date"
                                            value={dateFilter.startdate}
                                            onChange={(e) => { setDateFilter({ ...dateFilter, startdate: e.target.value }) }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item={5} xs={12} sm={5}>
                                    <Typography>To Date</Typography>
                                    <FormControl fullWidth size="small">
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="date"
                                            value={dateFilter.enddate}
                                            onChange={(e) => { setDateFilter({ ...dateFilter, enddate: e.target.value }) }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item lg={2} md={2} sm={2} xs={12}>
                                    <Button variant='contained' color='primary' type="submit" sx={{ marginTop: '24px' }} onClick={() => fetchDate()} >Filter</Button>
                                </Grid>
                            </Grid>

                        </Box>
                    </Grid>
                </Grid>
                <br /><br /><br />
                <Grid container spacing={2}>
                    <Grid item md={3} xs={12} sm={6}>
                        <Box sx={userStyle.taskboxes}>
                            <Grid container>
                                <Grid item md={8} xs={8} sm={8}>
                                    <Typography sx={{ fontSize: "18PX" }}>Completed Task</Typography>
                                    <Typography
                                        variant="h5"
                                        sx={{ lineHeight: 2.334, fontWeight: 600 }}
                                    >

                                        {completelist ? completelist : 0}
                                    </Typography>
                                </Grid>
                                <Grid item md={4} xs={4} sm={4}>
                                    <Box sx={userStyle.taskboxesicons}>
                                        <AssignmentTurnedInIcon style={{ fontSize: "2.2rem" }} />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                    <Grid item md={3} xs={12} sm={6}>
                        <Box sx={userStyle.taskboxes}>
                            <Grid container>
                                <Grid item md={8} xs={8} sm={8}>
                                    <Typography sx={{ fontSize: "18PX" }}>
                                        Pending Task
                                    </Typography>
                                    <Typography
                                        variant="h5"
                                        sx={{ lineHeight: 2.334, fontWeight: 600 }}
                                    >

                                        {incompletelist ? incompletelist : 0}
                                    </Typography>
                                </Grid>
                                <Grid item md={4} xs={4} sm={4}>
                                    <Box sx={userStyle.taskboxesiconsone}>
                                        <AssignmentIcon style={{ fontSize: "2.2rem" }} />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                    <Grid item md={3} xs={12} sm={6}>
                        <Box sx={userStyle.taskboxes}>
                            <Grid container>
                                <Grid item md={8} xs={8} sm={8}>
                                    <Typography sx={{ fontSize: "18PX" }}>
                                        Total Task
                                    </Typography>
                                    <Typography
                                        variant="h5"
                                        sx={{ lineHeight: 2.334, fontWeight: 600 }}
                                    >

                                        {Totallist ? Totallist : 0}

                                    </Typography>
                                </Grid>
                                <Grid item md={4} xs={4} sm={4}>
                                    <Box sx={userStyle.totaltaskicon}>
                                        <AssignmentIndIcon style={{ fontSize: "2.2rem" }} />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            <br /> <br />
            <Grid container spacing={3}>
                <Grid item md={6} xs={12} sm={12}>
                    <Box sx={userStyle.homepagecontainer}>
                        <div>
                            {optionsPurchase1 && (
                                <CanvasJSChart sx={{ width: '100%' }} options={optionsPurchase1} />
                            )}
                            <br />
                        </div>
                    </Box>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                    <Box sx={userStyle.homepagecontainer}>
                        <div >
                            <CanvasJSChart sx={{ width: '100%' }} options={options} /><br />
                        </div>
                    </Box>
                </Grid>
            </Grid>

            {/* ALERT DIALOG */}
            <Box>
                <Dialog
                    open={isErrorOpen}
                    onClose={handleCloseerr}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent
                        style={{ width: "350px", textAlign: "center", alignItems: "center" }}
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
        </>
    );
};

export default TaskReport;                                           