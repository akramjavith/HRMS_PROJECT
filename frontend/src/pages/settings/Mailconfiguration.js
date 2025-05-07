import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
    Box,
    Button,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
    OutlinedInput,
    Typography, Checkbox, FormControlLabel, FormGroup,
} from "@mui/material";
import axios from "axios";
import "cropperjs/dist/cropper.css";
import React, { useContext, useEffect, useState } from "react";
import "react-image-crop/dist/ReactCrop.css";
import { ThreeDots } from "react-loader-spinner";
import "react-quill/dist/quill.snow.css";
import { Link } from "react-router-dom";
import Selects from "react-select";
import AlertDialog from "../../components/Alert";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";

function Mailconfiguration() {

    const [selectedDb, setSelectedDb] = useState('');

    const handleChange = (db) => {
        setSelectedDb((prev) => (prev === db ? '' : db));
    };

    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
    const handleClickOpenPopupMalert = () => {
        setOpenPopupMalert(true);
    };
    const handleClosePopupMalert = () => {
        setOpenPopupMalert(false);
    };
    const [openPopup, setOpenPopup] = useState(false);
    const [popupContent, setPopupContent] = useState("");
    const [popupSeverity, setPopupSeverity] = useState("");
    const handleClickOpenPopup = () => {
        setOpenPopup(true);
    };
    const handleClosePopup = () => {
        setOpenPopup(false);
    }

    const [configurationtype, setConfigurationtype] = useState("Postfixadmin")
    const [hostname, setHostname] = useState("")
    const [username, setUsername] = useState("")
    const [databasename, setDatabaseName] = useState("Postfixadmin")
    const [port, setPort] = useState("")
    const [quotaallocation, setQuotaallocation] = useState("60")

    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };


    const { isUserRoleCompare, isUserRoleAccess, setPageName, pageName, buttonStyles } = useContext(UserRoleAccessContext);
    const [overAllsettingsCount, setOverAllsettingsCount] = useState();
    const [overAllsettingsID, setOverAllsettingsID] = useState();
    const [loading, setLoading] = useState(true);
    const { auth } = useContext(AuthContext);




    const fetchOverAllSettings = async () => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.MAILCONFIGURATIONALL}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            // setLoading(true);

            if (res?.data?.count === 0) {
                setOverAllsettingsCount(res?.data?.count);
            } else {
                const lastObject =
                    res?.data?.mailconfiguration[res?.data?.mailconfiguration?.length - 1];
                const lastObjectId = lastObject?._id;
                setOverAllsettingsID(lastObjectId);

                setConfigurationtype(
                    res?.data?.mailconfiguration[res?.data?.mailconfiguration?.length - 1]?.configurationtype
                );
                setHostname(
                    res?.data?.mailconfiguration[res?.data?.mailconfiguration?.length - 1]?.hostname
                );
                setUsername(
                    res?.data?.mailconfiguration[res?.data?.mailconfiguration?.length - 1]?.username
                );
                setPassword(
                    res?.data?.mailconfiguration[res?.data?.mailconfiguration?.length - 1]?.password
                );
                setDatabaseName(
                    res?.data?.mailconfiguration[res?.data?.mailconfiguration?.length - 1]?.databasename
                );
                setPort(
                    res?.data?.mailconfiguration[res?.data?.mailconfiguration?.length - 1]?.port
                );
                setSelectedDb(
                    res?.data?.mailconfiguration[res?.data?.mailconfiguration?.length - 1]?.dbtype
                );
                setQuotaallocation(
                    res?.data?.mailconfiguration[res?.data?.mailconfiguration?.length - 1]?.quotaallocation
                );
                setOverAllsettingsCount(res?.data?.count);

            }
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    useEffect(() => {
        fetchOverAllSettings();
    }, []);

    const sendRequest = async () => {
        setPageName(!pageName)
        try {
            await axios.post(`${SERVICE.MAILCONFIGURATION_CREATE}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                configurationtype: String(configurationtype),
                hostname: String(hostname),
                username: String(username),
                password: String(password),
                databasename: String(databasename),
                port: String(port),
                dbtype: String(selectedDb),
                quotaallocation: String(quotaallocation),
                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            await fetchOverAllSettings();
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const checkPostFixConnection = async () => {
        try {
            let res;
            if (selectedDb === "mysql") {
                res = await axios.post(
                    `${SERVICE.TESTPOSTFIXMAILCONNECTIONMYSQL}`,
                    {
                        host: String(hostname),
                        user: String(username),
                        password: String(password),
                        database: String(databasename),
                        port: String(port),

                    }, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
                );

            } else {
                res = await axios.post(
                    `${SERVICE.TESTPOSTFIXMAILCONNECTION}`,
                    {
                        host: String(hostname),
                        user: String(username),
                        password: String(password),
                        database: String(databasename),
                        port: String(port),

                    }, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
                );
            }
            if (res?.data?.status) {
                setPopupContent(res?.data?.message);
                setPopupSeverity("success");
                handleClickOpenPopup();
            } else {
                setPopupContentMalert("Connection Not Successful. Please Check Credentials!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    }

    const sendEditRequest = async () => {
        setPageName(!pageName)
        try {
            await axios.put(
                `${SERVICE.MAILCONFIGURATION_SINGLE}/${overAllsettingsID}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    configurationtype: String(configurationtype),
                    hostname: String(hostname),
                    username: String(username),
                    password: String(password),
                    databasename: String(databasename),
                    port: String(port),
                    quotaallocation: String(quotaallocation),
                    dbtype: String(selectedDb),
                    updatedby: [
                        {
                            name: String(isUserRoleAccess.username),
                            date: String(new Date()),
                        },
                    ],
                }
            );

            await fetchOverAllSettings();
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };


    function isValidIPAddress(ip) {
        const regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        return regex.test(ip);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        let res;
        if (selectedDb === "mysql") {
            res = await axios.post(
                `${SERVICE.TESTPOSTFIXMAILCONNECTIONMYSQL}`,
                {
                    host: String(hostname),
                    user: String(username),
                    password: String(password),
                    database: String(databasename),
                    port: String(port),

                }, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            }
            );

        } else {
            res = await axios.post(
                `${SERVICE.TESTPOSTFIXMAILCONNECTION}`,
                {
                    host: String(hostname),
                    user: String(username),
                    password: String(password),
                    database: String(databasename),
                    port: String(port),

                }, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            }
            );
        }


        if (configurationtype === "") {
            setPopupContentMalert("Please Select Type");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (hostname === "") {
            setPopupContentMalert("Please Enter Host IP");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (username === "") {
            setPopupContentMalert("Please Enter User Name");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (password === "") {
            setPopupContentMalert("Please Enter Password");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (databasename === "") {
            setPopupContentMalert("Please Enter Database Name");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (port === "") {
            setPopupContentMalert("Please Enter Port");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (port?.length < 4) {
            setPopupContentMalert("Please Enter Valid Port");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (quotaallocation === "") {
            setPopupContentMalert("Please Enter Quota Allocation");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (!isValidIPAddress(hostname)) {
            setPopupContentMalert("Please Enter Valid Host IP");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (!res?.data?.status) {
            setPopupContentMalert("Connection Not Successful. Please Check Credentials!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            if (overAllsettingsCount === 0) {
                sendRequest();
            } else {
                sendEditRequest();
            }
        }
    };



    const configurationtypeOptions = [
        { label: "Postfixadmin", value: "Postfixadmin" }
    ]



    return (
        <Box>
            <Headtitle title={"MAIL CONFIGURATION"} />
            <PageHeading
                title="Mail Configuration"
                modulename="Settings"
                submodulename="Mail Configuration"
                mainpagename=""
                subpagename=""
                subsubpagename=""
            />
            {!loading ? (
                <Box sx={userStyle.container}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            minHeight: "350px",
                        }}
                    >
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
                    </Box>
                </Box>
            ) : (
                <Box sx={userStyle.container}>
                    {isUserRoleCompare?.includes("amailconfiguration") && (
                        <form onSubmit={handleSubmit}>
                            <Typography sx={userStyle.SubHeaderText}>
                                Mail Configuration Settings
                            </Typography>
                            <br />
                            <br />
                            <br />
                            <Grid container spacing={2}>

                                <Grid item md={3} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Type<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            id="component-outlined"
                                            type="text"
                                            options={configurationtypeOptions}
                                            value={{
                                                label: configurationtype,
                                                value: configurationtype,
                                            }}
                                            placeholder="Please Select Type"
                                            onChange={(e) => {
                                                setConfigurationtype(e.value);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Host IP<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            placeholder="Please Enter Host IP Address"
                                            value={hostname}
                                            onChange={(e) => {
                                                const value = e.target.value;

                                                // Allow input in the format "233.992.477.567" with three digits per segment
                                                if (/^\d{0,3}(\.\d{0,3}){0,3}$/.test(value)) {
                                                    // Split input by dots to validate each segment
                                                    const segments = value.split('.');
                                                    const isValid = segments.every(segment => {
                                                        if (segment === '') return true; // Allow partial input
                                                        const num = parseInt(segment, 10);
                                                        return num >= 0 && num <= 255;
                                                    });

                                                    // Set hostname if input is valid or partial input
                                                    if (isValid) {
                                                        setHostname(value);
                                                    }
                                                }
                                            }}
                                            inputProps={{ inputMode: 'decimal', maxLength: 15 }}
                                        />                                    </FormControl>
                                </Grid>

                                <Grid item md={3} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            User Name<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            placeholder="Please Enter User Name"
                                            value={username}
                                            onChange={(e) => {
                                                setUsername(e.target.value,);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} sm={12} xs={12}>
                                    <FormControl fullWidth size="small" variant="outlined">
                                        <Typography>
                                            Password<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Please Enter Password"
                                            value={password}
                                            onChange={(e) => {
                                                setPassword(e.target.value);
                                            }}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Database Name<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            placeholder="Please Enter Database Name"
                                            value={databasename}
                                            onChange={(e) => {
                                                setDatabaseName(e.target.value,);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Port<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            placeholder="Please Enter Port"
                                            value={port}
                                            onChange={(e) => {
                                                const value = e.target.value;

                                                // Only allow numbers and validate port range
                                                if (/^\d*$/.test(value)) {
                                                    const numValue = parseInt(value, 10);

                                                    // Check if the parsed number is within the valid port range
                                                    if (numValue >= 0 && numValue <= 65535) {
                                                        setPort(value);
                                                    } else if (value === '') {
                                                        // Allow empty input to clear the field
                                                        setPort(value);
                                                    }
                                                }
                                            }}
                                            inputProps={{ inputMode: 'numeric' }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Quota Allocation<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            placeholder="Please Enter Quota"
                                            value={quotaallocation}
                                            onChange={(e) => {
                                                const value = e.target.value;

                                                // Allow only numeric input
                                                if (/^\d*$/.test(value)) {
                                                    setQuotaallocation(value);
                                                }
                                            }}
                                            inputProps={{ inputMode: 'numeric' }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} sm={12} xs={12}>
                                    <Typography variant="subtitle1" gutterBottom>
                                        Select Database
                                    </Typography>
                                    <FormGroup row sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={selectedDb === 'mysql'}
                                                    onChange={() => handleChange('mysql')}
                                                />
                                            }
                                            label="MySQL"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={selectedDb === 'postgres'}
                                                    onChange={() => handleChange('postgres')}
                                                />
                                            }
                                            label="PostgreSQL"
                                        />
                                    </FormGroup>
                                </Grid>
                                <Grid item md={3} sm={12} xs={12} mt={3}>
                                    <Button sx={buttonStyles.buttonsubmit} color="secondary" onClick={(e) => {
                                        checkPostFixConnection();
                                    }}>
                                        Check Connection
                                    </Button>
                                </Grid>
                            </Grid>

                            <br />
                            <br />
                            <br />
                            <br />
                            <Grid
                                container
                                sx={{ justifyContent: "center", display: "flex" }}
                                spacing={2}
                            >
                                <Grid item>
                                    <Button sx={buttonStyles.buttonsubmit} color="primary" type="submit">
                                        Update
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Link
                                        to="/dashboard"
                                        style={{ textDecoration: "none", color: "white" }}
                                    >
                                        {" "}
                                        <Button sx={buttonStyles.btncancel}> Cancel </Button>{" "}
                                    </Link>
                                </Grid>
                            </Grid>
                        </form>
                    )}
                </Box>
            )}


            <MessageAlert
                openPopup={openPopupMalert}
                handleClosePopup={handleClosePopupMalert}
                popupContent={popupContentMalert}
                popupSeverity={popupSeverityMalert}
            />
            {/* SUCCESS */}
            <AlertDialog
                openPopup={openPopup}
                handleClosePopup={handleClosePopup}
                popupContent={popupContent}
                popupSeverity={popupSeverity}
            />
        </Box>
    );
}
export default Mailconfiguration;