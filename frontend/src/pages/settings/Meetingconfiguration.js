import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
    Box,
    Button,
    FormControl,
    FormGroup,
    Grid,
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
import Selects from "react-select";
import AlertDialog from "../../components/Alert";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";

function Meetingconfiguration() {

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

    const [meetprovider, setMeetprovider] = useState("Jitsi")
    const [domainurl, setDomainUrl] = useState("")

    const { isUserRoleCompare, isUserRoleAccess, setPageName, pageName, buttonStyles } = useContext(UserRoleAccessContext);
    const [overAllsettingsCount, setOverAllsettingsCount] = useState();
    const [overAllsettingsID, setOverAllsettingsID] = useState();
    const [loading, setLoading] = useState(true);
    const { auth } = useContext(AuthContext);




    const fetchOverAllSettings = async () => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.MEETINGCONFIGURATIONALL}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            // setLoading(true);

            console.log(res?.data)
            if (res?.data?.count === 0) {
                setOverAllsettingsCount(res?.data?.count);
            } else {
                const lastObject =
                    res?.data?.meetingconfiguration[res?.data?.meetingconfiguration?.length - 1];
                const lastObjectId = lastObject?._id;
                setOverAllsettingsID(lastObjectId);
                setMeetprovider(
                    res?.data?.meetingconfiguration[res?.data?.meetingconfiguration?.length - 1]?.meetprovider
                );
                setDomainUrl(
                    res?.data?.meetingconfiguration[res?.data?.meetingconfiguration?.length - 1]?.domainurl
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
            await axios.post(`${SERVICE.MEETINGCONFIGURATION_CREATE}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                meetprovider: String(meetprovider),
                domainurl: String(domainurl),
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
                `${SERVICE.MEETINGCONFIGURATION_SINGLE}/${overAllsettingsID}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    meetprovider: String(meetprovider),
                    domainurl: String(domainurl),
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

        function isValidURL(url) {
            try {
                const regex = /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/[^\s]*)?$/;

                const match = url.match(regex);
                return match !== null;
            } catch (error) {
                return false;
            }
        }

        const validurl = isValidURL(domainurl)



        if (meetprovider === "") {
            setPopupContentMalert("Please Select Meet Provider");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (domainurl === "") {
            setPopupContentMalert("Please Enter URL");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (!validurl) {
            setPopupContentMalert("Please Enter Valid URL");
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


    const meetproviderOptions = [
        { label: "Jitsi", value: "Jitsi" }
    ]

    return (
        <Box>
            <Headtitle title={"MEETING CONFIGURATION"} />
            <PageHeading
                title="Meeting Configuration"
                modulename="Settings"
                submodulename="Meeting Configuration"
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
                    {isUserRoleCompare?.includes("ameetingconfiguration") && (
                        <form onSubmit={handleSubmit}>
                            <Typography sx={userStyle.SubHeaderText}>
                                Meeting Configuration Settings
                            </Typography>
                            <br />
                            <br />
                            <br />
                            <Grid container spacing={2}>

                                <Grid item md={3} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Meet Provider<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            id="component-outlined"
                                            type="text"
                                            options={meetproviderOptions}
                                            value={{
                                                label: meetprovider,
                                                value: meetprovider,
                                            }}
                                            placeholder="Please Select Type"
                                            onChange={(e) => {
                                                setMeetprovider(e.value);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
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
                                    <Grid >
                                        <FormGroup sx={{ display: "flex", flexDirection: "row", alignContent: "center" }}>
                                            <Typography >
                                                <InfoOutlinedIcon sx={buttonStyles.buttoninfo} />
                                            </Typography>
                                            &nbsp;
                                            <Typography sx={{ fontSize: "14px", fontFamily: "monospace" }} >
                                                Note: Your Domain Name
                                            </Typography>
                                        </FormGroup>
                                    </Grid>
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
export default Meetingconfiguration;