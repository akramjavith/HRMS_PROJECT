import React, { useState, useEffect, useContext } from "react";
import { Box, Chip, Grid, Typography } from "@mui/material";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { userStyle } from "../pageStyle";
import axios from "axios";
import { SERVICE } from "../services/Baseservice";
import { handleApiError } from "../components/Errorhandling";
import { UserRoleAccessContext, AuthContext } from "../context/Appcontext";
import IconButton from "@mui/material/IconButton";

const HomeAsset = () => {

    const { auth } = useContext(AuthContext);
    const { isUserRoleAccess, isUserRoleCompare, isAssignBranch } = useContext(UserRoleAccessContext);

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

    const [clientUserIDArray, setClientUserIDArray] = useState("");
    const [overallasset, setOverallAsset] = useState("");
    const [damagelasset, setDamageAsset] = useState("");
    const [repairasset, setRepairAsset] = useState("");

    const [stockmanages, setStockmanage] = useState([]);



    const fetchAll = async () => {


        try {

            let [res_Employee, res_Asset, res_Damage, res_Repair, res_project, res_project_1] = await Promise.all([

                (isUserRoleCompare?.includes("lassets") && isUserRoleCompare?.includes("lemployeeassetdistributionregister")) ?
                    axios.post(SERVICE.EMP_DISTRIBUTION_HOME, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        assignbranch: accessbranch,
                    }) : Promise.resolve([]),

                (isUserRoleCompare?.includes("lassets") && isUserRoleCompare?.includes("lassetmasterlist")) ?
                    axios.post(SERVICE.ASSET_HOME, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        assignbranch: accessbranch,
                    }) : Promise.resolve([]),

                (isUserRoleCompare?.includes("lassets") && isUserRoleCompare?.includes("ldamageasset")) ?
                    axios.post(SERVICE.ASSET_DAMAGE_HOME, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        assignbranch: accessbranch,
                    }) : Promise.resolve([]),
                (isUserRoleCompare?.includes("lassets") && isUserRoleCompare?.includes("lrepairasset")) ?
                    axios.post(SERVICE.ASSET_REPAIR_HOME, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        assignbranch: accessbranch,
                    }) : Promise.resolve([]),
                (isUserRoleCompare?.includes("lassets") && isUserRoleCompare?.includes("lstockpurchaserequest")) ?
                    axios.post(SERVICE.STOCK_MANAGE_FILTER, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        assignbranch: accessbranch,
                    }) : Promise.resolve([]),
                (isUserRoleCompare?.includes("lassets") && isUserRoleCompare?.includes("lstockpurchaserequest")) ?

                    axios.get(SERVICE.ALL_VOMMASTERNAME, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                    }) : Promise.resolve([]),
            ]);




            let codeValues = res_project_1?.data?.vommaster.map((data) => ({
                name: data.name,
                code: data.code,
            }));

            let filteredData = res_project?.data?.result;
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
            setClientUserIDArray(res_Employee?.data?.employeeassets);
            setOverallAsset(res_Asset?.data?.assetdetails)
            setDamageAsset(res_Damage?.data?.assetdetails)
            setRepairAsset(res_Repair?.data?.assetdetails)
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    useEffect(() => {
        fetchAll();
    }, [])
    const links1 = [

        ...((isUserRoleCompare?.includes("lassets") && isUserRoleCompare?.includes("lassetmasterlist")) ? [{
            text: "OverallAsset", url: "/asset/assetlist", count: overallasset
        }] : []),

        ...((isUserRoleCompare?.includes("lassets") && isUserRoleCompare?.includes("lemployeeassetdistributionregister")) ? [{
            text: "Emp Distribution", url: "/asset/employeeassetdistribution", count: clientUserIDArray
        }] : []),


        ...((isUserRoleCompare?.includes("lassets") && isUserRoleCompare?.includes("lassetmasterlist")) ? [{
            text: "Remaining Asset", url: "/asset/assetlist", count: Number(overallasset) - Number(clientUserIDArray)

        }] : []),


        ...((isUserRoleCompare?.includes("lassets") && isUserRoleCompare?.includes("ldamageasset")) ? [{
            text: "Damaged Asset Stock", url: "/asset/damageasset", count: damagelasset
        }] : []),


        ...((isUserRoleCompare?.includes("lassets") && isUserRoleCompare?.includes("lrepairasset")) ? [{
            text: "Reparied Asset Stock", url: "/asset/repairasset", count: repairasset
        }] : []),

        ...((isUserRoleCompare?.includes("lassets") && isUserRoleCompare?.includes("lstockpurchaserequest")) ? [{
            text: "Stock Purchase Request", url: "/stockpurchase/stockpurchaserequest", count: stockmanages.length
        }] : []),
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
                        <br />
                        <br />
                    </Box>
                </Grid>
            )}
        </>
    );
};

export default HomeAsset;
