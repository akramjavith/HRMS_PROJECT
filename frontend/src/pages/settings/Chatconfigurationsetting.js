import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
    Box,
    Button,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
    OutlinedInput,
    Typography
} from "@mui/material";
import axios from "axios";
import "cropperjs/dist/cropper.css";
import React, { useContext, useEffect, useState } from "react";
import "react-image-crop/dist/ReactCrop.css";
import { ThreeDots } from "react-loader-spinner";
import "react-quill/dist/quill.snow.css";
import { Link } from "react-router-dom";
import AlertDialog from "../../components/Alert";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";

function ChatConfigurationsettings() {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
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

    const [domainurl, setDomainUrl] = useState("")

    const { isUserRoleCompare, isUserRoleAccess, setPageName, pageName, buttonStyles } = useContext(UserRoleAccessContext);
    const [overAllsettingsCount, setOverAllsettingsCount] = useState();
    const [overAllsettingsID, setOverAllsettingsID] = useState();
    const [loading, setLoading] = useState(true);
    const { auth } = useContext(AuthContext);




    const fetchOverAllSettings = async () => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.CHATCONFIGURATIONALL}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            // setLoading(true);

            setOverAllsettingsCount(res?.data?.count);

            const lastObject =
                res?.data?.chatconfiguration[res?.data?.chatconfiguration?.length - 1];
            const lastObjectId = lastObject?._id;
            setOverAllsettingsID(lastObjectId);
            setUsername(
                res?.data?.chatconfiguration[res?.data?.chatconfiguration?.length - 1]?.username
            );
            setPassword(
                res?.data?.chatconfiguration[res?.data?.chatconfiguration?.length - 1]?.password
            );
            setDomainUrl(
                res?.data?.chatconfiguration[res?.data?.chatconfiguration?.length - 1]?.domainurl
            );
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };


    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
    };

    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        };
    }, []);


    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Chat Configuration"),
            commonid: String(isUserRoleAccess?._id),
            date: String(new Date()),

            addedby: [
                {
                    name: String(isUserRoleAccess?.username),
                    date: String(new Date()),
                },
            ],
        });

    }

    useEffect(() => {
        fetchOverAllSettings();
        getapi();
    }, []);

    const sendRequest = async () => {
        setPageName(!pageName)
        try {
            await axios.post(`${SERVICE.CHATCONFIGURATION_CREATE}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                domainurl: String(domainurl),
                username: String(username),
                password: String(password),
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

    const sendEditRequest = async () => {
        setPageName(!pageName)
        try {
            await axios.put(
                `${SERVICE.CHATCONFIGURATION_SINGLE}/${overAllsettingsID}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    domainurl: String(domainurl),
                    username: String(username),
                    password: String(password),
                    updatedby: [
                        {
                            name: String(isUserRoleAccess.companyname),
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


    const handleSubmit = async (e) => {
        e.preventDefault();

        function isValidURL(clientURL) {
            setPageName(!pageName);
            try {
                new URL(clientURL);
                return true;
            } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
        }

        if (domainurl && !isValidURL(domainurl)) {
            setPopupContentMalert("Please Enter Valid URL");
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
        else {
            if (overAllsettingsCount === 0) {
                sendRequest();
            } else {
                sendEditRequest();
            }
        }
    };

    return (
        <Box>
            <Headtitle title={"MEETING CONFIGURATION"} />
            <PageHeading
                title="ConnectTTS - Chat Configuration"
                modulename="Settings"
                submodulename="Chat Configuration"
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
                    {isUserRoleCompare?.includes("achatconfiguration") && (
                        <form onSubmit={handleSubmit}>
                            <Typography sx={userStyle.SubHeaderText}>
                                Chat Configuration Settings
                            </Typography>
                            <br />
                            <br />
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={3} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            URL<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            placeholder="Please Enter URL"
                                            value={domainurl}
                                            onChange={(e) => {
                                                setDomainUrl(e.target.value,);
                                            }}
                                        />
                                    </FormControl>

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
export default ChatConfigurationsettings;