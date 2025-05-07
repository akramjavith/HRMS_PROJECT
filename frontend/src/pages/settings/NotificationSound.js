import React, { useState, useEffect, useRef, useContext } from "react";
import {
    Box,
    Typography,
    FormControl,
    Grid,
    Button,
} from "@mui/material";
import { userStyle, colourStyles } from "../../pageStyle";
import { handleApiError } from "../../components/Errorhandling";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../services/Baseservice";
import { UserRoleAccessContext, AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import Selects from "react-select";
import AlertDialog from "../../components/Alert";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import Beep from "../../components/Sounds/beep.mp3"
import Chelle from "../../components/Sounds/chelle.mp3"
import Chime from "../../components/Sounds/chime.mp3"
import Ding from "../../components/Sounds/ding.mp3"
import Door from "../../components/Sounds/door.mp3"
import Droplet from "../../components/Sounds/droplet.mp3"
import HighBell from "../../components/Sounds/highbell.mp3"
import Seasons from "../../components/Sounds/seasons.mp3"



function NotificationSound() {
    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
    const handleClickOpenPopupMalert = () => {
        // setSubmitLoader(false);
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
    };

    const [notificationSound, setNotificationSound] = useState("Ding");
    const [notificationId, setNotificationId] = useState();
    const [notificationSoundCount, setNotificationSoundCount] = useState(0);
    const [notificationPreview, setNotificationPreview] = useState(Ding);


    const [prioritymasterEdit, setPrioritymasterEdit] = useState([]);
    const { isUserRoleCompare, isUserRoleAccess, pageName,
        setPageName,
        buttonStyles, } = useContext(
            UserRoleAccessContext
        );
    const { auth } = useContext(AuthContext);
    const [isButton, setIsButton] = useState(false);



    useEffect(() => {
        getapi();
        fetchAllNotificationSounds();
    }, []);

    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Settings/Notification Sound"),
            commonid: String(isUserRoleAccess?._id),
            date: String(new Date()),

            addedby: [
                {
                    name: String(isUserRoleAccess?.companyname),
                    date: String(new Date()),
                },
            ],
        });
    };

    const Sounds = [{ label: "Beep", value: "Beep", file: Beep },
    { label: "HighBell", value: "HighBell", file: HighBell },
    { label: "Ding", value: "Ding", file: Ding },
    { label: "Seasons", value: "Seasons", file: Seasons },
    { label: "Chelle", value: "Chelle", file: Chelle },
    { label: "Droplet", value: "Droplet", file: Droplet },
    { label: "Chime", value: "Chime", file: Chime },
    { label: "Door", value: "Door", file: Door },
    ]






    const fetchAllNotificationSounds = async () => {
        try {
            let response = await axios.get(SERVICE.ALL_NOTIFICATION_SOUNDS, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
                setNotificationSoundCount(response?.data?.count);  
                const singleData = response?.data?.notificationsound[response?.data?.notificationsound?.length - 1];
                setNotificationId(singleData)
                setNotificationSound(singleData ? singleData?.sound : "Ding")
                const previewFile = Sounds?.find(data => data?.value === singleData?.sound )
                setNotificationPreview(singleData ? previewFile?.file : Ding)
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };








    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
    };

    // Previewing the Sound
    const handlePreview = () => {
        if (notificationPreview === null || notificationPreview === undefined) {
            setPopupContentMalert('Please Select Sound');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            const audio = new Audio(notificationPreview);
            audio.play();
        }
    };



    //submit option for saving
    const handleSubmit = (e) => {
        e.preventDefault();
        if (notificationSound === undefined || notificationSound === "" || notificationSound === null) {
            setPopupContentMalert('Please Select Sound');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            if(notificationSoundCount === 0){
                sendRequest();
            }else {
                sendEditRequest();
            }

        }
    };

    const handleClear = (e) => {
        e.preventDefault();
        setNotificationSound("Ding");
        setNotificationPreview(Ding)
        setPopupContent('Cleared Successfully');
        setPopupSeverity("success");
        handleClickOpenPopup();
    };



    //Project updateby edit page...
    let updateby = prioritymasterEdit?.updatedby;
    let addedby = prioritymasterEdit?.addedby;

    let subprojectsid = prioritymasterEdit?._id;

    //Submiting the single data...
    const sendRequest = async () => {
        setIsButton(true)
        setPageName(!pageName);
        try {

            let res = await axios.post(
                `${SERVICE.CREATE_NOTIFICATION_SOUND}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    sound: notificationSound,
                    addedby: [
                        {
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),
                        },
                    ],
                }
            );

            setPopupContent('Added Successfully');
            setPopupSeverity("success");
            handleClickOpenPopup();
            setIsButton(false)
        } catch (err) {  setIsButton(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };



    //Submiting the single data...
    const sendEditRequest = async () => {
        setIsButton(true)
        setPageName(!pageName);
        try {

            let res = await axios.put(
                `${SERVICE.NOTIFICATION_SOUND_SINGLE}/${notificationId?._id}`,
                {
                  headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                  },
                  sound: notificationSound ,
                }
              );

            setPopupContent('Updated Successfully');
            setPopupSeverity("success");
            handleClickOpenPopup();
            setIsButton(false)
        } catch (err) {  setIsButton(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };


    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        };
    }, []);


    return (
        <Box>
            <Headtitle title={"NOTIFICATION SOUND"} />
            {/* ****** Header Content ****** */}

            <PageHeading
                title="Notification Sound"
                modulename="Settings"
                submodulename="Notification Sound"
                mainpagename=""
                subpagename=""
                subsubpagename=""
            />
            {isUserRoleCompare?.includes("anotificationsound") && (
                <Box sx={userStyle.dialogbox}>
                    <>
                        <Grid container spacing={2}>
                            <Grid item xs={8}>
                                <Typography sx={userStyle.importheadtext}>
                                    Add Notification Sound
                                </Typography>
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Sounds<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Selects
                                        options={Sounds}
                                        styles={colourStyles}
                                        value={{
                                            label: notificationSound,
                                            value: notificationSound,
                                        }}
                                        onChange={(e) => {
                                            setNotificationSound(e.value);
                                            setNotificationPreview(e.file)
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={2.5} xs={12} sm={6} >
                                <Typography>&nbsp;</Typography>
                                <Button
                                    onClick={handlePreview}
                                    sx={buttonStyles.buttonview}
                                >
                                    <VolumeUpIcon />
                                </Button> &nbsp;

                            </Grid>
                        </Grid>

                        <Grid item md={2.5} xs={12} sm={6} >
                            <Typography>&nbsp;</Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit}
                                disabled={isButton}
                                sx={buttonStyles.buttonsubmit}
                            >
                                Submit
                            </Button> &nbsp;
                            <Button sx={buttonStyles.btncancel} onClick={handleClear}>
                                Clear
                            </Button>
                        </Grid>

                    </>
                </Box>
            )}


            {/* EXTERNAL COMPONENTS -------------- START */}
            {/* VALIDATION */}
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

export default NotificationSound;