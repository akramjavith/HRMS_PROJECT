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


const HomeAsset = () => {

    function getWeekNumberInMonth(date) {
        const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const dayOfWeek = firstDayOfMonth.getDay(); // 0 (Sunday) to 6 (Saturday)

        // If the first day of the month is not Monday (1), calculate the adjustment
        const adjustment = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

        // Calculate the day of the month adjusted for the starting day of the week
        const dayOfMonthAdjusted = date.getDate() + adjustment;

        // Calculate the week number based on the adjusted day of the month
        const weekNumber = Math.ceil(dayOfMonthAdjusted / 7);

        return weekNumber;
    }


    const getattendancestatus = (alldata, attS) => {

        let result = attS.filter((data, index) => {

            return data?.clockinstatus === alldata?.clockinstatus && data?.clockoutstatus === alldata?.clockoutstatus
        })

        return result[0]?.name
    }

    const [loader, setLoader] = useState(false)


    const { auth } = useContext(AuthContext);

    const { isUserRoleAccess, isUserRoleCompare, listPageAccessMode, pageName, setPageName, buttonStyles, isAssignBranch } = useContext(UserRoleAccessContext);




    // Error Popup model
    const [isErrorOpendialog, setIsErrorOpendialog] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const handleClickOpenerr = () => {
        setIsErrorOpendialog(true);
    };

    const [clientUserIDArray, setClientUserIDArray] = useState("");
    const [overallasset, setOverallAsset] = useState("");
    const [damagelasset, setDamageAsset] = useState("");
    const [repairasset, setRepairAsset] = useState("");

    const [stockmanages, setStockmanage] = useState([]);
    const [stock, setStock] = useState([]);
    const [stocktable, setStockTable] = useState([]);

    const pathname = window.location.pathname;

    const accessbranch = isAssignBranch
        ?.filter((data) => {
            let fetfinalurl = [];
            // Check if user is a Manager, in which case return all branches
            if (isUserRoleAccess?.role?.includes("Manager")) {
                return true; // Skip filtering, return all data for Manager
            }
            if (
                data?.modulenameurl?.length !== 0 &&
                data?.submodulenameurl?.length !== 0 &&
                data?.mainpagenameurl?.length !== 0 &&
                data?.subpagenameurl?.length !== 0 &&
                data?.subsubpagenameurl?.length !== 0
            ) {
                fetfinalurl = data.subsubpagenameurl;
            } else if (
                data?.modulenameurl?.length !== 0 &&
                data?.submodulenameurl?.length !== 0 &&
                data?.mainpagenameurl?.length !== 0 &&
                data?.subpagenameurl?.length !== 0
            ) {
                fetfinalurl = data.subpagenameurl;
            } else if (
                data?.modulenameurl?.length !== 0 &&
                data?.submodulenameurl?.length !== 0 &&
                data?.mainpagenameurl?.length !== 0
            ) {
                fetfinalurl = data.mainpagenameurl;
            } else if (
                data?.modulenameurl?.length !== 0 &&
                data?.submodulenameurl?.length !== 0
            ) {
                fetfinalurl = data.submodulenameurl;
            } else if (data?.modulenameurl?.length !== 0) {
                fetfinalurl = data.modulenameurl;
            } else {
                fetfinalurl = [];
            }

            // Check if the pathname exists in the URL
            return fetfinalurl?.includes(window.location.pathname);
        })
        ?.map((data) => ({
            branch: data.branch,
            company: data.company,
            unit: data.unit,
        }));


    const fetchAll = async () => {


        try {

            let [res_Employee, res_Asset, res_Damage, res_Repair] = await Promise.all([


                axios.get(SERVICE.EMP_DISTRIBUTION_HOME, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }),
                axios.get(SERVICE.ASSET_HOME, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }),
                axios.get(SERVICE.ASSET_DAMAGE_HOME, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }),
                axios.post(SERVICE.ASSET_REPAIR_HOME, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    assignbranch: accessbranch,
                }),


            ]);
            setClientUserIDArray(res_Employee?.data?.employeeassets);
            setOverallAsset(res_Asset.data.assetdetails)
            setDamageAsset(res_Damage.data.assetdetails)
            setRepairAsset(res_Repair.data.assetdetails)
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };





    //get all project.
    const fetchStock = async () => {



        try {
            // let res_project = await axios.get(SERVICE.STOCKMANAGEFILTERED, {
            let res_project = await axios.post(SERVICE.STOCK_MANAGE_FILTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                assignbranch: accessbranch,
            });

            let filteredData = res_project?.data?.stockmanage;

            let res_project_1 = await axios.get(SERVICE.ALL_VOMMASTERNAME, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let codeValues = res_project_1?.data?.vommaster.map((data) => ({
                name: data.name,
                code: data.code,
            }));

            let setData = filteredData.map((item) => {
                const matchingItem = codeValues.find(
                    (item1) => item.uom === item1.name
                );

                const matchingItem1 = codeValues.find(
                    (item1) => item.uomnew === item1.name
                );

                if (matchingItem) {
                    return { ...item, uomcode: matchingItem.code };
                } else if (matchingItem1) {
                    return { ...item, uomcode: matchingItem1.code };
                } else {
                    return { ...item };
                }
            });


            setStockmanage(setData);
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }

    }


    const fetchStockpurchase = async () => {

        try {
            // let res_project = await axios.get(SERVICE.STOCKPURCHASE, {
            let res_project = await axios.post(SERVICE.STOCK_ACCESS, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                assignbranch: accessbranch,
            });

            let filteredData = res_project?.data?.stock.filter((data) => {
                return data.requestmode === "Asset Material";
            });

            let res_project_1 = await axios.get(SERVICE.ALL_VOMMASTERNAME, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let codeValues = res_project_1?.data?.vommaster.map((data) => ({
                name: data.name,
                code: data.code,
            }));
            // setuomcodes(codeValues);

            let setData = filteredData.map((item) => {
                // Find the corresponding item in codeValues array
                const matchingItem = codeValues.find(
                    (item1) => item.uom === item1.name
                );

                // If matchingItem is found, return item with uomcode set to its code, otherwise set it to an empty string
                return matchingItem
                    ? { ...item, uomcode: matchingItem.code }
                    : { ...item, uomcode: "" };
            });

            setStock(setData);

        }


        catch (err) {

            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };


    const fetchStockTable = async () => {
        const accessmodule = [];

        try {
            // let res_project = await axios.get(SERVICE.STOCKPURCHASE, {

            let res_project = await axios.post(SERVICE.STOCK_ACCESS, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                assignbranch: accessbranch,
            });


            let filteredData = res_project?.data?.stock.filter((data) => {
                return (
                    data.requestmode === "Stock Material" || data.status === "Transfer"
                );
            });
            let res_project_1 = await axios.get(SERVICE.ALL_VOMMASTERNAME, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let codeValues = res_project_1?.data?.vommaster.map((data) => ({
                name: data.name,
                code: data.code,
            }));
            // setuomcodes(codeValues);

            let setData = filteredData.map((item) => {
                // Find the corresponding item in codeValues array
                const matchingItem = codeValues.find(
                    (item1) => item.uomnew === item1.name
                );

                // If matchingItem is found, return item with uomcode set to its code, otherwise set it to an empty string
                return matchingItem
                    ? { ...item, uomcode: matchingItem.code }
                    : { ...item, uomcode: "" };
            });
            setStockTable(setData);
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }

    }



    useEffect(() => {
        fetchAll();
        fetchStock();
        fetchStockpurchase();
        fetchStockTable();
    }, [])
    // console.log(overallasset, clientUserIDArray, damagelasset, repairasset, "check")

    const links1 = [
        { text: "OverallAsset", url: "/asset/assetlist", count: overallasset },
        { text: "Emp Distribution", url: "/asset/employeeassetdistribution", count: clientUserIDArray },
        { text: "Remaining Asset", url: "/asset/assetlist", count: Number(overallasset) - Number(clientUserIDArray) },
        { text: "Damaged Asset Stock", url: "/asset/damageasset", count: damagelasset },
        { text: "Reparied Asset Stock", url: "/asset/repairasset", count: repairasset },
        { text: "Stock Request", url: "/stockpurchase/stock", count: Number(stock.length) + Number(stocktable.length) },
        { text: "Transfer Stock", url: "/stockpurchase/managestocktransfer", count: 0 },
        { text: "Stock Purchase Request", url: "/stockpurchase/stockpurchaserequest", count: stockmanages.length },
    ];

    return (
        <>

            {isUserRoleCompare?.includes("lassets") && (


                <Grid item xs={12} md={5} sm={5} >

                    <Box sx={{ ...userStyle?.homepagecontainer, padding: "16px 5px" }}>
                        <Typography sx={{ fontWeight: "700", paddingLeft: "16px", paddingTop: "16px" }}>Asset</Typography>
                        <br />

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
                    </Box>



                </Grid>
            )}
        </>

    );
};

export default HomeAsset;
