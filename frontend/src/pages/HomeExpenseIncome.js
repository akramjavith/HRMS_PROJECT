import React, { useState, useEffect, useContext } from "react";
import {
    Box, Button,
    Chip, Grid, Typography,
} from "@mui/material";
import { ThreeDots } from "react-loader-spinner";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { userStyle } from "../pageStyle";
import axios from "axios";
import { SERVICE } from "../services/Baseservice";
import { handleApiError } from "../components/Errorhandling";
import { UserRoleAccessContext, AuthContext } from "../context/Appcontext";
import IconButton from "@mui/material/IconButton";
const HomeExpenseIncome = () => {


    const [loader, setLoader] = useState(true)
    const { auth } = useContext(AuthContext);
    const { isUserRoleCompare, isAssignBranch } = useContext(UserRoleAccessContext);

    const accessbranch = isAssignBranch?.map((data) => ({
        branch: data.branch,
        company: data.company,
        unit: data.unit,
    }));

    // Error Popup model
    const [isErrorOpendialog, setIsErrorOpendialog] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const handleClickOpenerr = () => {
        setIsErrorOpendialog(true);
    };

    const [btnselecttoday, setBtnSelectToday] = useState("Today")
    const [expense, setExpense] = useState([]);
    const [income, setIncome] = useState([]);

    const fetchAll = async (btnselect) => {
        setBtnSelectToday(btnselect)
        try {

            let [request, response] = await Promise.all([
                (isUserRoleCompare?.includes("lexpense&income") && isUserRoleCompare?.includes("llistexpense")) ?
                    axios.post(SERVICE.EXPENSES_HOME, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        selectedfilter: btnselect,
                        assignbranch: accessbranch,
                    }) : Promise.resolve([]),

                (isUserRoleCompare?.includes("lexpense&income") && isUserRoleCompare?.includes("llistincome")) ?
                    axios.post(SERVICE.INCOME_HOME, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        selectedfilter: btnselect,
                        assignbranch: accessbranch,
                    }) : Promise.resolve([]),
            ]);
            setExpense(request?.data?.total);
            setIncome(response?.data?.total);
            setLoader(false);
        } catch (err) {
            setLoader(false);
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };



    useEffect(() => {
        fetchAll("Last Week");
    }, [])

    const links1 = [

        ...((isUserRoleCompare?.includes("lexpense&income") && isUserRoleCompare?.includes("llistexpense")) ? [{
            text: "Expense", url: "/expense/expenselist",
            count: expense
        }] : []),

        ...(
            (isUserRoleCompare?.includes("lexpense&income") && isUserRoleCompare?.includes("llistincome")) ? [{
                text: "Income", url: "/expense/listincome", count: income
            }] : []),

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
                        <Box
                            sx={{
                                display: "flex",
                                gap: "10px",
                                flexWrap: "nowrap",
                                justifyContent: {
                                    xs: "space-around",
                                    sm: "space-between",
                                },
                                alignItems: "center",
                                overflowX: "auto",
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
                                        padding: "6px 12px",
                                        fontSize: {
                                            xs: "08px",
                                            sm: "10px",
                                            md: "12px",
                                        },
                                        whiteSpace: "nowrap",
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
                                                        <Chip
                                                            sx={{ height: "25px", borderRadius: "0px" }}
                                                            color={"warning"}
                                                            variant="outlined"
                                                            label={link.count}
                                                        />
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
