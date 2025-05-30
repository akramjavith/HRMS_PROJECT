import React, { useState, useEffect, useRef, useContext } from "react";
import {
    DialogTitle,
    Box,
    Typography,
    OutlinedInput,
    Dialog,
    Select,
    DialogContent,
    DialogActions,
    FormControl,
    Grid,
    Button,
    IconButton,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { handleApiError } from "../components/Errorhandling";
import { userStyle, colourStyles } from "../pageStyle";
import { FaPlus, FaTrash } from "react-icons/fa";
import { SERVICE } from "../services/Baseservice";
import axios from "axios";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import Selects from "react-select";
import { UserRoleAccessContext, AuthContext } from "../context/Appcontext";
import "jspdf-autotable";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { menuItems } from "../components/menuItemsList";
import ReactQuill from "react-quill";
import { useNavigate } from "react-router-dom";
import pdfIcon from "../components/Assets/pdf-icon.png";
import wordIcon from "../components/Assets/word-icon.png";
import excelIcon from "../components/Assets/excel-icon.png";
import csvIcon from "../components/Assets/CSV.png";
import fileIcon from "../components/Assets/file-icons.png";
// import Webcamimage from "../asset/Webcameimageasset";
import { makeStyles } from "@material-ui/core";
// import CategoryMasterPopup from "./CategoryMasterPopup";
import CloseIcon from "@mui/icons-material/Close";
import LoadingButton from "@mui/lab/LoadingButton";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import "react-quill/dist/quill.snow.css";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
    inputs: {
        display: "none",
    },
    preview: {
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        marginTop: theme.spacing(2),
        "& > *": {
            margin: theme.spacing(1),
        },
    },
}));

function ServerTime() {


    const [isOpen, setIsOpen] = useState(false);

    //Delete model
    const handleClickOpen = () => {
        setIsOpen(true);
    };
    const handleCloseMod = () => {
        setIsOpen(false);
    };


    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);

    const [showAlert, setShowAlert] = useState();

    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };

    const classes = useStyles();
    const { isUserRoleCompare, isUserRoleAccess } = useContext(UserRoleAccessContext);

    const { auth } = useContext(AuthContext);

    const username = isUserRoleAccess.username;

    const [serverTime, setServerTime] = useState(moment());

    // Fetch server time initially
    // const getCurrentServerTime = async () => {
    //     try {
    //         const response = await axios.get(SERVICE.GET_CURRENT_SERVER_TIME);
    //         setServerTime(moment(response.data.currentNewDate));
    //     } catch (err) {
    //         console.log("Error fetching server time:", err);
    //     }
    // };


    // useEffect(() => {
    //     getCurrentServerTime();

    //     const interval = setInterval(() => {
    //         setServerTime((prevTime) => moment(prevTime).add(1, "second"));
    //     }, 1000);

    //     return () => clearInterval(interval);
    // }, []);

    if (!isUserRoleAccess?.role?.includes("Manager")) return null;


    if (!serverTime) return <Typography>Loading...</Typography>;


    const secondsDeg = serverTime.seconds() * 6;
    const minutesDeg = serverTime.minutes() * 6;
    const hoursDeg = (serverTime.hours() % 12) * 30 + serverTime.minutes() * 0.5;


    return (

        <Grid container>
            <Grid item xs={12} sm={6} md={4} lg={3}>

                <Box className="small-clock">

                    {[...Array(12)].map((_, i) => (
                        <Box key={i} className="number" style={{ transform: `rotate(${i * 30}deg)` }}>
                            <span style={{ transform: `rotate(-${i * 30}deg)` }}>{i === 0 ? 12 : i}</span>
                        </Box>
                    ))}


                    <Box className="hand hour-hand" style={{ transform: `rotate(${hoursDeg}deg)` }}></Box>
                    <Box className="hand minute-hand" style={{ transform: `rotate(${minutesDeg}deg)` }}></Box>
                    <Box className="hand second-hand" style={{ transform: `rotate(${secondsDeg}deg)` }}></Box>


                    <Box className="center-dot"></Box>
                </Box>


                <Typography variant="body2" sx={{ marginTop: "5px", fontWeight: "bold" }}>
                    {serverTime.format("hh:mm:ss A")}
                </Typography>

            </Grid>

            {/* CSS Styles */}
            <style>
                {`
            .small-clock {
                width: 80px;
                height: 80px;
                border: 4px solid black;
                border-radius: 50%;
                position: relative;
                background: white;
                box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2);
            }

            .number {
                position: absolute;
                width: 100%;
                height: 100%;
                text-align: center;
                font-size: 8px;
                font-weight: bold;
            }

            .number span {
                display: inline-block;
                width: 14px;
                height: 14px;
                line-height: 14px;
                border-radius: 50%;
                background: white;
                position: absolute;
                top: 5px;
                left: 50%;
                transform: translateX(-50%);
            }

            .hand {
                position: absolute;
                bottom: 50%;
                left: 50%;
                transform-origin: bottom;
                transition: transform 0.5s linear;
            }

            .hour-hand {
                width: 3px;
                height: 25px;
                background: black;
                border-radius: 3px;
                transform: translateX(-50%);
            }

            .minute-hand {
                width: 2px;
                height: 32px;
                background: black;
                border-radius: 3px;
                transform: translateX(-50%);
            }

            .second-hand {
                width: 1px;
                height: 38px;
                background: red;
                transform: translateX(-50%);
                transition: transform 0.05s linear;
            }

            .center-dot {
                width: 6px;
                height: 6px;
                background: black;
                border-radius: 50%;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
            `}
            </style>
        </Grid>
    );
}

export default ServerTime;
