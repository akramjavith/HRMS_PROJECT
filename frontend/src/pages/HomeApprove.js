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
import { ThreeDots } from "react-loader-spinner";


const HomeApprove = () => {

    const [loader, setLoader] = useState(false)

    const { auth } = useContext(AuthContext);

    const { isUserRoleAccess, isUserRoleCompare, listPageAccessMode, pageName, setPageName, buttonStyles, isAssignBranch } = useContext(UserRoleAccessContext);

    let listpageaccessby =
        listPageAccessMode?.find(
            (data) =>
                data.modulename === "Production" &&
                data.submodulename === "Manual Entry" &&
                data.mainpagename === "Production Manual Entry Filter" &&
                data.subpagename === "" &&
                data.subsubpagename === ""
        )?.listpageaccessmode || "Overall";





    // Error Popup model
    const [isErrorOpendialog, setIsErrorOpendialog] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const handleClickOpenerr = () => {
        setIsErrorOpendialog(true);
    };



    const [prodHierarchy, setProdHierarchy] = useState(0);
    const [leaveHome, setLeaveHome] = useState(0);
    const [permission, setPermission] = useState(0);
    const [longabsent, setLongAbsent] = useState(0);
    const [advance, setAdvance] = useState(0);
    const [loan, setLoan] = useState(0);
    // console.log(isUserRoleAccess, "isUserRoleAccess")
    const fetchEmployee = async () => {
        setLoader(true)
        try {

            let [res_prodhierarchy,
                //  res_leavehome,
                // res_permission,
                res_longabsent, res_advance, res_loan] = await Promise.all([

                    await axios.post(SERVICE.PRODUCTION_INDIVIDUAL_HIERARCHYFILTER_HOME, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },

                        username: isUserRoleAccess.companyname,
                        hierachy: "myallhierarchy",
                        sector: "all",
                        listpageaccessmode: listpageaccessby,
                    }),
                    // axios.post(SERVICE.APPLYLEAVE_FILTERED_HOME_COUNT, {
                    //     headers: {
                    //         Authorization: `Bearer ${auth.APIToken}`,
                    //     },
                    //     role: isUserRoleAccess.role,
                    //     username: isUserRoleAccess.companyname
                    // }),
                    // axios.get(SERVICE.PERMISSIONS_HOME, {
                    //     headers: {
                    //         Authorization: `Bearer ${auth.APIToken}`,
                    //     },
                    // }),
                    await axios.post(SERVICE.LONG_ABSENT_HOME, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        filterin: "Employee",
                        username: isUserRoleAccess.companyname,
                        hierachy: "My + All Hierarchy List",
                        sector: "all",
                        listpageaccessmode: listpageaccessby,
                        team: isUserRoleAccess.team,
                        module: "Human Resources",
                        submodule: "HR",
                        mainpage: "Employee",
                        subpage: "Employee Status Details",
                        subsubpage: "Long Absent Restriction List",
                        status: "completed",
                    }),
                    axios.get(SERVICE.ADVANCE_HOME, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                    }),
                    axios.get(SERVICE.LOAN_HOME, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                    }),
                ]);
            setProdHierarchy(res_prodhierarchy?.data?.resultAccessFilter.length)
            // setLeaveHome(res_leavehome?.data?.applyleaves)
            // setPermission(res_permission?.data?.permissions)
            setLongAbsent(res_longabsent?.data?.filterallDatauser)
            setAdvance(res_advance?.data?.advance)
            setLoan(res_loan?.data?.loan)
            setLoader(false)
        } catch (err) {
            // console.log(err, "err")
            setLoader(false);
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };


    const fetchleave = async () => {
        try {
            let res = await axios.post(SERVICE.APPLYLEAVE_FILTERED_HOME_COUNT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                role: isUserRoleAccess.role,
                username: isUserRoleAccess.companyname
            });
            setLeaveHome(res?.data?.applyleaves)
        } catch (err) {
            console.log(err, "error")
        }
    }

    const fetchPermission = async () => {
        try {
            let res = await axios.post(SERVICE.PERMISSIONS_HOME, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                role: isUserRoleAccess.role,
                username: isUserRoleAccess.companyname
            });
            setPermission(res?.data?.permissions)
        }
        catch (err) {
            console.log(err, "eror")
        }
    }



    useEffect(() => {
        fetchEmployee();
        fetchleave();
        fetchPermission();
    }, [])

    // console.log(leaveHome, "leave")


    const links1 = [


        // { text: "Production Approved", url: "/production/productionindividualfilter", count: prodHierarchy },
        ...(isUserRoleCompare?.includes("lproductionapproved") ? [{
            text: "Production Approved",
            url: "/production/productionindividualfilter",
            count: prodHierarchy
        }] : []),

        ...(isUserRoleCompare?.includes("lleave") ? [{
            text: "Leave", url: "/leave/teamleaveverification", count: leaveHome
        }] : []),


        ...(isUserRoleCompare?.includes("lpermission") ? [{
            text: "Permission", url: "/permission/teampermissionverification", count: permission

        }] : []),


        ...(isUserRoleCompare?.includes("llongabsent") ? [{
            text: "Long Absent", url: "/employee/longabsentrestrictionhierarchylist", count: longabsent
        }] : []),


        ...(isUserRoleCompare?.includes("ladvance") ? [{
            text: "Advance", url: "/advancehomelist", count: advance
        }] : []),

        ...(isUserRoleCompare?.includes("lloan") ? [{
            text: "Loan", url: "/loanrequest", count: loan
        }] : []),
    ];



    return (


        <Grid item xs={12} md={4} sm={4} >
            <Box sx={{ ...userStyle?.homepagecontainer, padding: "16px 5px" }}>
                <Typography sx={{ fontWeight: "700", paddingLeft: "16px", paddingTop: "16px" }}>
                    Approvals
                </Typography>
                <br />

                <>
                    {loader ? (
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

                                    <Grid item xs={2} md={2} lg={2} sm={2}>
                                        <IconButton
                                            edge="end"
                                            aria-label="open link"
                                            href={link.url}
                                            target="_blank"
                                        >
                                            <OpenInNewIcon size="small" style={{ color: "#9e9e9e" }} />
                                        </IconButton>
                                    </Grid>
                                </React.Fragment>
                            ))}
                        </Grid>

                    )}
                </>
            </Box>




        </Grid>


    );
};

export default HomeApprove;
