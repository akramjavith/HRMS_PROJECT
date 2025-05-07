import React, { useState, useEffect, useContext } from "react";
import { Box, Typography, OutlinedInput, TextareaAutosize, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, Grid, Button } from "@mui/material";
import { userStyle, colourStyles } from "../../../pageStyle";
import "jspdf-autotable";
import axios from "axios";
import Selects from "react-select";
import { useNavigate, useParams } from "react-router-dom";

import { SERVICE } from "../../../services/Baseservice";
import { handleApiError } from "../../../components/Errorhandling";
import { UserRoleAccessContext } from "../../../context/Appcontext";
import { AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import PageHeading from "../../../components/PageHeading";
import AlertDialog from "../../../components/Alert";
import MessageAlert from "../../../components/MessageAlert";
import csvIcon from "../../../components/Assets/CSV.png";
import excelIcon from "../../../components/Assets/excel-icon.png";
import fileIcon from "../../../components/Assets/file-icons.png";
import pdfIcon from "../../../components/Assets/pdf-icon.png";
import wordIcon from "../../../components/Assets/word-icon.png";
import Webcamimage from "../../asset/Webcameimageasset";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { FaTrash } from "react-icons/fa";
import dayjs from "dayjs";
import { Space, TimePicker } from "antd";
import { makeStyles } from "@material-ui/core";
import customParseFormat from "dayjs/plugin/customParseFormat";


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

function ProductionIndividualEdit() {

    dayjs.extend(customParseFormat);

    let ids = useParams().id
    const classes = useStyles();
    let name = "create";
    let allUploadedFiles = [];
    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [loader, setLoader] = useState(false);
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
    };
    //    today date fetching
    let today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    // today = yyyy + "-" + mm + "-" + dd;
    const formattedToday = `${yyyy}-${mm}-${dd}`;
    const backPage = useNavigate();
    const [projectmaster, setProjectMaster] = useState(false);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [loginAllotFilter, setLoginAllotFilter] = useState([]);
    const [clientUserIDArray, setClientUserIDArray] = useState([]);

    const [vendors, setVendors] = useState([]);
    const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    const [projectCheck, setProjectCheck] = useState(false);

    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();

    let now = new Date();

    let hours = now.getHours();
    let minutes = String(now.getMinutes()).padStart(2, "0");
    let seconds = String(now.getSeconds()).padStart(2, "0");

    // Determine AM or PM
    let ampm = hours >= 12 ? "PM" : "AM";

    // Convert 24-hour format to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // If hours is 0, set it to 12 (midnight or noon)
    hours = String(hours).padStart(2, "0");

    let currtime = `${hours}:${minutes}:${seconds} ${ampm}`;

    const [ProducionIndividual, setProducionIndividual] = useState({
        vendor: "Please Select Vendor",
        fromdate: formattedToday,

        fromtime24Hrs: dayjs(currtime, "h:mm:ss A"),

        time: dayjs(currtime, "h:mm:ss A").format("HH:mm:ss"),

        starttime24Hrs: dayjs(currtime, "h:mm:ss A"),
        starttime: dayjs(currtime, "h:mm:ss A").format("HH:mm:ss"),

        enddatemode: "Auto",
        datemode: "Auto",
        datetimezone: "",
        category: "Please Select Subcategory",
        filename: "Please Select Category",
        startbuttonstatus: false,
        remarks: "",
        creationstatus: "New",
        unitid: "",
        alllogin: "Please Select AllLogin",
        user: "Please Select Loginid",
        mode: "",
        docnumber: "",
        doclink: "",

        statusmode: "Please Select Status",
        flagcount: 0,
        section: "1",
        addedby: "",
        updatedby: "",
        pendingpages: "",
        notes: "",
        totalpages: 0,
        completepages: 0,
        startpage: "",
        reason: "",
        startdate: formattedToday,
        startdatemode: "Auto",
    });

    const status = [
        { label: "Completed", value: "Completed" },
        { label: "In Complete", value: "In Complete" },
        { label: "Partial Complete", value: "Partial Complete" },
    ];

    const [projmasterDup, setProjmasterDup] = useState([]);

    // Calculate the date two months ago
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(today.getMonth() - 2);
    const ddPast = String(twoMonthsAgo.getDate()).padStart(2, "0");
    const mmPast = String(twoMonthsAgo.getMonth() + 1).padStart(2, "0");
    const yyyyPast = twoMonthsAgo.getFullYear();
    const formattedTwoMonthsAgo = `${yyyyPast}-${mmPast}-${ddPast}`;

    const handleTimeChange = (time, timeString) => {
        // Check if timeString is a valid time format
        const isValidTime = dayjs(timeString, "h:mm:ss A").isValid();

        if (isValidTime) {
            setProducionIndividual({
                ...ProducionIndividual,
                fromtime24Hrs: dayjs(timeString, "h:mm:ss A"),
                time: dayjs(timeString, "h:mm:ss A").format("HH:mm:ss"),
            });
            if (projectmaster && ProducionIndividual.creationstatus === "Already Completed") {
                // Compare end time with start time
                const { startdate, fromdate, starttime, time } = ProducionIndividual;

                let fromDatetime = `${startdate} ${starttime}`;
                let endDatetime = `${fromdate} ${dayjs(timeString, "h:mm:ss A").format("HH:mm:ss")}`;

                if (fromDatetime && endDatetime) {
                    if (new Date(fromDatetime) > new Date(endDatetime)) {
                        setPopupContentMalert("End time cannot be earlier than start time!");
                        setPopupSeverityMalert("warning");
                        handleClickOpenPopupMalert();
                        setProducionIndividual({
                            ...ProducionIndividual,
                            fromtime24Hrs: "",
                            time: "",
                        });
                    }
                }
            }
        }
    };

    const handleBlurTimeChange = (time, timeString) => {
        const isValidTime = dayjs(timeString, "h:mm:ss A").isValid();
        let fromDatetime = `${ProducionIndividual.startdate} ${ProducionIndividual.starttime}`;
        let endDatetime = `${ProducionIndividual.fromdate} ${dayjs(timeString, "h:mm:ss A").format("HH:mm:ss")}`;

        if (isValidTime && new Date(fromDatetime) < new Date(endDatetime)) {
            setPopupContentMalert("Please select end time correctly");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else {
            setProducionIndividual({
                ...ProducionIndividual,
                fromtime24Hrs: dayjs(timeString, "h:mm:ss A"),
                time: dayjs(timeString, "h:mm:ss A").format("HH:mm:ss"),
            });
        }
    };

    const handleModeChange = (value) => {
        // Check if timeString is a valid time format
        let today = new Date();
        var dd = String(today.getDate()).padStart(2, "0");
        var mm = String(today.getMonth() + 1).padStart(2, "0");
        var yyyy = today.getFullYear();
        // today = yyyy + "-" + mm + "-" + dd;

        const Today = `${yyyy}-${mm}-${dd}`;

        let now = new Date();

        let hours = now.getHours();
        let minutes = String(now.getMinutes()).padStart(2, "0");
        let seconds = String(now.getSeconds()).padStart(2, "0");

        // Determine AM or PM
        let ampm = hours >= 12 ? "PM" : "AM";

        // Convert 24-hour format to 12-hour format
        hours = hours % 12;
        hours = hours ? hours : 12; // If hours is 0, set it to 12 (midnight or noon)
        hours = String(hours).padStart(2, "0");

        let currTime = `${hours}:${minutes}:${seconds} ${ampm}`;

        if (value === "Auto") {
            setProducionIndividual({
                ...ProducionIndividual,
                datemode: value,
                fromdate: Today,
                fromtime24Hrs: dayjs(currTime, "h:mm:ss A"),
                time: dayjs(currTime, "h:mm:ss A").format("HH:mm:ss"),
            });
        } else {
            setProducionIndividual({
                ...ProducionIndividual,
                datemode: value,
                fromdate: "",
                fromtime24Hrs: "",
                time: "",
            });
        }
    };

    const handleStartTimeChange = (time, timeString) => {
        // Check if timeString is a valid time format
        const isValidTime = dayjs(timeString, "h:mm:ss A").isValid();

        if (isValidTime) {
            setProducionIndividual({
                ...ProducionIndividual,
                starttime24Hrs: dayjs(timeString, "h:mm:ss A"),
                starttime: dayjs(timeString, "h:mm:ss A").format("HH:mm:ss"),
                fromtime24Hrs: dayjs(timeString, "h:mm:ss A"),
                time: dayjs(timeString, "h:mm:ss A").format("HH:mm:ss"),
                // totime24Hrs: dayjs(timeString, "h:mm:ss A"),
                // totime: dayjs(timeString, "h:mm:ss A").format("HH:mm:ss"),
            });
        }
    };

    const handleStartDateModeChange = (value) => {
        // Check if timeString is a valid time format
        let today = new Date();
        var dd = String(today.getDate()).padStart(2, "0");
        var mm = String(today.getMonth() + 1).padStart(2, "0");
        var yyyy = today.getFullYear();
        // today = yyyy + "-" + mm + "-" + dd;

        const Today = `${yyyy}-${mm}-${dd}`;

        let now = new Date();

        let hours = now.getHours();
        let minutes = String(now.getMinutes()).padStart(2, "0");
        let seconds = String(now.getSeconds()).padStart(2, "0");

        // Determine AM or PM
        let ampm = hours >= 12 ? "PM" : "AM";

        // Convert 24-hour format to 12-hour format
        hours = hours % 12;
        hours = hours ? hours : 12; // If hours is 0, set it to 12 (midnight or noon)
        hours = String(hours).padStart(2, "0");

        let currTime = `${hours}:${minutes}:${seconds} ${ampm}`;
        if (value === "Auto") {
            setProducionIndividual({
                ...ProducionIndividual,
                startdatemode: value,
                fromdate: Today,
                startdate: Today,
                fromtime24Hrs: dayjs(currTime, "h:mm:ss A"),
                time: dayjs(currTime, "h:mm:ss A").format("HH:mm:ss"),
                starttime24Hrs: dayjs(currTime, "h:mm:ss A"),
                starttime: dayjs(currTime, "h:mm:ss A").format("HH:mm:ss"),
            });
        } else {
            setProducionIndividual({
                ...ProducionIndividual,
                startdatemode: value,
                fromdate: "",
                startdate: "",
                fromtime24Hrs: "",
                time: "",
                starttime24Hrs: "",
                starttime: "",
            });
        }
    };
    const handleEndDateModeChange = (value) => {
        // Check if timeString is a valid time format
        let today = new Date();
        var dd = String(today.getDate()).padStart(2, "0");
        var mm = String(today.getMonth() + 1).padStart(2, "0");
        var yyyy = today.getFullYear();
        // today = yyyy + "-" + mm + "-" + dd;

        const Today = `${yyyy}-${mm}-${dd}`;

        let now = new Date();

        let hours = now.getHours();
        let minutes = String(now.getMinutes()).padStart(2, "0");
        let seconds = String(now.getSeconds()).padStart(2, "0");

        // Determine AM or PM
        let ampm = hours >= 12 ? "PM" : "AM";

        // Convert 24-hour format to 12-hour format
        hours = hours % 12;
        hours = hours ? hours : 12; // If hours is 0, set it to 12 (midnight or noon)
        hours = String(hours).padStart(2, "0");

        let currtime = `${hours}:${minutes}:${seconds} ${ampm}`;
        if (value === "Auto") {
            setProducionIndividual({
                ...ProducionIndividual,
                enddatemode: value,
                fromdate: Today,
                fromtime24Hrs: dayjs(currtime, "h:mm:ss A"),
                time: dayjs(currtime, "h:mm:ss A").format("HH:mm:ss"),
            });
        } else {
            setProducionIndividual({
                ...ProducionIndividual,
                enddatemode: value,
                fromtime24Hrs: "",
                time: "",
                fromdate: "",
            });
        }
    };

    const handleDateChange = (e) => {
        const selectedDate = new Date(e.target.value);
        const minDate = new Date(formattedTwoMonthsAgo);
        const maxDate = new Date(formattedToday);

        if (ProducionIndividual.datemode === "Manual") {
            if (selectedDate >= minDate && selectedDate <= maxDate) {
                setProducionIndividual({ ...ProducionIndividual, fromdate: e.target.value });
            } else {
                setPopupContentMalert("Please select a date within the past two months and not in the future");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
        } else {
            setProducionIndividual({ ...ProducionIndividual, fromdate: e.target.value });
        }
    };

    const handleEndDateChange = (e) => {
        const selectedDate = new Date(e.target.value);
        const currentDate = new Date(); // Current date and time

        // Ensure only date comparison without time
        const fromDate = new Date(ProducionIndividual.startdate || currentDate);
        fromDate.setHours(0, 0, 0, 0); // Reset time portion to midnight
        selectedDate.setHours(0, 0, 0, 0); // Reset time portion to midnight
        currentDate.setHours(0, 0, 0, 0); // Reset time portion to midnight

        setProducionIndividual({ ...ProducionIndividual, fromdate: e.target.value, time: "" });
    };
    const handleEndDateBlueChange = (e) => {
        // const selectedEndDate = new Date(e.target.value);

        // Compare end time with start time
        const { startdate, fromdate } = ProducionIndividual;

        let fromDatetime = `${startdate}`;
        let endDatetime = `${fromdate}`;

        if (fromDatetime && endDatetime) {
            if (new Date(fromDatetime) > new Date(endDatetime)) {
                setPopupContentMalert("End Date cannot be earlier than start Date!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
                setProducionIndividual({
                    ...ProducionIndividual,
                    fromtime24Hrs: "",
                    time: "",
                });
                setProducionIndividual({ ...ProducionIndividual, fromdate: "", time: "" });
            } else {
                setProducionIndividual({ ...ProducionIndividual, fromdate: e.target.value, time: "" });
            }
        }
    };

    const handleDateChangeStart = (e) => {
        const selectedDate = new Date(e.target.value);
        const minDate = new Date(formattedTwoMonthsAgo);
        const maxDate = new Date(formattedToday);

        if (ProducionIndividual.datemode === "Manual") {
            if (selectedDate >= minDate && selectedDate <= maxDate) {
                setProducionIndividual({ ...ProducionIndividual, startdate: e.target.value });
            } else {
                setPopupContentMalert("Please select a date within the past two months and not in the future");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
        } else {
            setProducionIndividual({ ...ProducionIndividual, startdate: e.target.value });
        }
    };

    // const [ProducionIndividual, setProducionIndividual] = useState({
    //   vendor: "Please Select Vendor",
    //   fromdate: formattedToday,
    //   time: currtime,
    //   enddatemode: "Auto",
    //   datemode: "Auto",
    //   datetimezone: "",
    //   category: "Please Select Subcategory",
    //   filename: "Please Select Category",
    //   startbuttonstatus: false,
    //   remarks: "",
    //   creationstatus: "New",
    //   unitid: "",
    //   alllogin: "Please Select AllLogin",
    //   user: "Please Select Loginid",
    //   mode: "",
    //   docnumber: "",
    //   doclink: "",

    //   statusmode: "Please Select Status",
    //   flagcount: 0,
    //   section: "1",
    //   addedby: "",
    //   updatedby: "",
    //   pendingpages: "",
    //   notes: "",
    //   totalpages: 0,
    //   completepages: 0,
    //   startpage: "",
    //   reason: "",
    //   startdate: formattedToday,
    //   starttime: currtime,
    //   startdatemode: "Auto",
    // });

    //change form

    const handleChangephonenumber = (e) => {
        // Regular expression to match only positive numeric values
        const regex = /^[0-9]+$/; // Only allows positive integers
        // const regex = /^\d*\.?\d*$/;

        const inputValue = e.target.value;

        // Check if the input value matches the regex or if it's empty (allowing backspace)
        if (regex.test(inputValue) || inputValue === "") {
            // Update the state with the valid numeric value
            setProducionIndividual({ ...ProducionIndividual, section: inputValue });
        }
    };

    const handleChangephonenumberflag = (e) => {
        // Regular expression to match only positive numeric values
        const regex = /^[0-9]+$/; // Only allows positive integers

        const inputValue = e.target.value;

        // Check if the input value matches the regex or if it's empty (allowing backspace)
        if (regex.test(inputValue) || inputValue === "") {
            // Check if the input value exceeds totalpages

            // Update the state with the valid numeric value
            setProducionIndividual({ ...ProducionIndividual, flagcount: inputValue });
        }
    };

    const handleChangephonenumberflagCompleted = (e) => {
        // Regular expression to match only positive numeric values
        const regex = /^[0-9]+$/; // Only allows positive integers

        const inputValue = e.target.value;

        // Check if the input value matches the regex or if it's empty (allowing backspace)
        if (regex.test(inputValue) || inputValue === "") {
            let difference = Number(ProducionIndividual.totalpages) - Number(inputValue);

            const getstpage = Array.from({ length: inputValue - 0 }, (_, index) => {
                const startPageNumber = Number(inputValue) + index;
                return startPageNumber;
            });
            // Check if the input value exceeds totalpages
            if (parseInt(inputValue) > parseInt(ProducionIndividual.totalpages)) {
                setPopupContentMalert("Completed pages cannot be greater than total pages");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            } else {
                // Update the state with the valid numeric value
                setProducionIndividual({ ...ProducionIndividual, flagcount: inputValue, startpage: getstpage[0] + 1, pendingpages: difference });
            }
        }
    };

    const handleChangephonenumbertotal = (e) => {
        // Regular expression to match only positive numeric values
        const regex = /^[0-9]+$/; // Only allows positive integers
        // const regex = /^\d*\.?\d*$/;

        const inputValue = e.target.value;

        // Check if the input value matches the regex or if it's empty (allowing backspace)
        if (regex.test(inputValue) || inputValue === "") {
            // Update the state with the valid numeric value
            let difference = Number(inputValue) - Number(0);
            const getstpage = Array.from({ length: inputValue - 0 }, (_, index) => {
                const startPageNumber = Number(0) + 1 + index;
                return startPageNumber;
            });
            setProducionIndividual({ ...ProducionIndividual, totalpages: inputValue, startpage: getstpage[0], flagcount: 0, pendingpages: difference });
        }
    };

    let datemodes =
        isUserRoleCompare.includes("lproductionindividualusers") ||
            isUserRoleAccess.role.includes("Manager") ||
            isUserRoleAccess.role.includes("Director") ||
            isUserRoleAccess.role.includes("Admin") ||
            isUserRoleAccess.role.includes("SuperAdmin") ||
            isUserRoleAccess.role.includes("ADMIN")
            ? [
                { label: "Auto", value: "Auto" },
                { label: "Manual", value: "Manual" },
            ]
            : [{ label: "Auto", value: "Auto" }];

    const creationmode = [
        { label: "New", value: "New" },
        { label: "Already Completed", value: "Already Completed" },
    ];

    // Error Popup model

    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };
    let updateby = ProducionIndividual?.updatedby;
    //add function
    const sendRequest = async () => {
        setPageName(!pageName);
        try {
            const fromDate = new Date(`${ProducionIndividual.fromdate}T${ProducionIndividual.time}:00`);
            const fromDatePlus48Hours = new Date(fromDate.getTime() + 48 * 60 * 60 * 1000);

            // let projectscreate = await axios.post(SERVICE.PRODUCTION_INDIVIDUAL_CREATE, {
            //     headers: {
            //         Authorization: `Bearer ${auth.APIToken}`,
            //     },
            let projectscreate = await axios.put(`${SERVICE.PRODUCTION_INDIVIDUAL_SINGLE}/${ids}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },

                vendor: String(ProducionIndividual.vendor),
                datemode: String(ProducionIndividual.datemode),
                fromdate: String(ProducionIndividual.fromdate),
                time: String(ProducionIndividual.time),
                filename: String(ProducionIndividual.filename),
                category: String(ProducionIndividual.category),
                unitid: String(ProducionIndividual.unitid),
                user: String(ProducionIndividual.user),
                creationstatus: projectmaster ? String(ProducionIndividual.creationstatus) : "",
                remarks: String(ProducionIndividual.remarks),
                startbuttonstatus: projectmaster ? (ProducionIndividual.creationstatus === "New" ? true : false) : false,
                enddatemode: String(ProducionIndividual.enddatemode),
                mode: "Manual",
                section: String(ProducionIndividual.section),
                flagcount: String(ProducionIndividual.flagcount),
                alllogin: String(ProducionIndividual.alllogin),
                docnumber: String(ProducionIndividual.docnumber),
                doclink: String(ProducionIndividual.doclink),
                startmode: projectmaster ? String(ProducionIndividual.startdatemode) : "",
                startdate: String(ProducionIndividual.startdate),
                starttime: String(ProducionIndividual.starttime),
                statusmode: projectmaster ? (ProducionIndividual.creationstatus === "New" ? "Started" : String(ProducionIndividual.statusmode)) : String(ProducionIndividual.statusmode),
                totalpages: String(ProducionIndividual.totalpages),
                pendingpages: Number(ProducionIndividual.pendingpages),
                startpage: String(ProducionIndividual.startpage),
                reason: String(ProducionIndividual.reason),
                notes: String(ProducionIndividual.notes),
                // approvalstatus: "",
                // approvaldate: "",
                // lateentrystatus: new Date() > fromDatePlus48Hours ? "Late Entry" : "On Entry",
                files: allUploadedFiles.concat(refImage, refImageDrag, capturedImages),
                updatedby: [
                    ...updateby,
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            setPopupContent(projectmaster && ProducionIndividual?.creationstatus === "New" ? "Started Successfully" : "Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            backPage('/production/productionindividuallist');

        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    //submit option for saving
    const handleSubmit = async (e) => {
        setPageName(!pageName);

        let res_Dupe = await axios.post(SERVICE.PRODUCTION_MANUALENTRY_DUPECHECK, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            vendor: ProducionIndividual.vendor,
            filename: ProducionIndividual.filename,
            category: ProducionIndividual.category,
            user: ProducionIndividual.user,
            unitid: ProducionIndividual.unitid,
            fromdate: ProducionIndividual.fromdate,
        });
        let checkDupe = res_Dupe?.data?.productionIndividual;

        if (ProducionIndividual.vendor === "Please Select Vendor") {
            setPopupContentMalert("Please Select Vendor!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (ProducionIndividual.filename === "Please Select Category") {
            setPopupContentMalert("Please Select Category !");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (ProducionIndividual.category === "Please Select Subcategory") {
            setPopupContentMalert("Please Select SubCategory !");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (ProducionIndividual.datemode === "") {
            setPopupContentMalert("Please Select Date Mode!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (ProducionIndividual.datemode === "Manual" && ProducionIndividual.fromdate === "") {
            setPopupContentMalert("Please Select Date!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (ProducionIndividual.datemode === "Manual" && ProducionIndividual.time === "") {
            setPopupContentMalert("Please Select Time!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (!projectmaster && (ProducionIndividual.flagcount === "" || ProducionIndividual.flagcount === 0)) {
            setPopupContentMalert("Please Enter FlagCount !");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (ProducionIndividual.unitid === "") {
            setPopupContentMalert("Please Enter Identifier !");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (ProducionIndividual.user === "Please Select Loginid") {
            setPopupContentMalert("Please Select Login Id !");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (ProducionIndividual.section === "") {
            setPopupContentMalert("Please Enter Section !");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        ///NEW
        else if (projectmaster && ProducionIndividual.startdatemode === "Manual" && ProducionIndividual.startdate === "") {
            setPopupContentMalert("Please Select Start Date !");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (projectmaster && ProducionIndividual.startdatemode === "Manual" && ProducionIndividual.starttime === "") {
            setPopupContentMalert("Please Select Start Time !");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }

        //alreadycompleted
        else if (projectmaster && ProducionIndividual.enddatemode === "Manual" && ProducionIndividual?.creationstatus === "Already Completed" && ProducionIndividual.fromdate === "") {
            setPopupContentMalert("Please Select End Date !");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (projectmaster && ProducionIndividual.enddatemode === "Manual" && ProducionIndividual?.creationstatus === "Already Completed" && ProducionIndividual.time === "") {
            setPopupContentMalert("Please Select End Time !");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (projectmaster && (ProducionIndividual.totalpages === "" || ProducionIndividual.totalpages === 0)) {
            setPopupContentMalert("Please Enter Total Pages !");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (projectmaster && ProducionIndividual?.creationstatus === "Already Completed" && (ProducionIndividual.flagcount === "" || ProducionIndividual.flagcount === 0)) {
            setPopupContentMalert("Please Enter Completed Pages !");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (projectmaster && ProducionIndividual?.creationstatus === "Already Completed" && ProducionIndividual.flagcount !== ProducionIndividual.totalpages) {
            setPopupContentMalert("Completed Pages and Total pages count didn't match!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (projectmaster && ProducionIndividual?.creationstatus === "Already Completed" && ProducionIndividual.pendingpages === "") {
            setPopupContentMalert("Please Enter Pending Pages !");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (projectmaster && ProducionIndividual?.creationstatus === "Already Completed" && ProducionIndividual.statusmode === "Please Select Status") {
            setPopupContentMalert("Please Select Status !");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (projectmaster && ProducionIndividual?.creationstatus === "Already Completed" && new Date(ProducionIndividual.startdate) > new Date(ProducionIndividual.fromdate)) {
            setPopupContentMalert("End Date should be after or equal to Start Date!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (projectmaster && ProducionIndividual.startdatemode === "") {
            setPopupContentMalert("Please Select Start Date Mode !");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (projectmaster && ProducionIndividual.enddatemode === "Manual" && ProducionIndividual?.creationstatus === "Already Completed" && ProducionIndividual.fromdate === "") {
            setPopupContentMalert("Please Select End Date !");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (projectmaster && ProducionIndividual.enddatemode === "Manual" && ProducionIndividual?.creationstatus === "Already Completed" && ProducionIndividual.time === "") {
            setPopupContentMalert("Please Enter End Time !");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (projectmaster && ProducionIndividual?.creationstatus === "Already Completed" && ProducionIndividual.pendingpages > 0 && ProducionIndividual.startpage === "") {
            setPopupContentMalert("Please Enter Start Page !");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        //  else if (checkDupe > 0) {
        //     setPopupContentMalert("Data Already Exist !");
        //     setPopupSeverityMalert("warning");
        //     handleClickOpenPopupMalert();
        // } 
        else if (projectmaster && ProducionIndividual?.creationstatus === "Already Completed" && ProducionIndividual?.startdatemode === "Auto" && ProducionIndividual.enddatemode === "Auto") {
            setPopupContentMalert("End Date/Time End Date must be greater than Start Date/Time!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else {
            sendRequest();
        }
    };

    const handleclear = (e) => {
        // e.preventDefault();
        let now = new Date();

        let hours = now.getHours();
        let minutes = String(now.getMinutes()).padStart(2, "0");
        let seconds = String(now.getSeconds()).padStart(2, "0");

        // Determine AM or PM
        let ampm = hours >= 12 ? "PM" : "AM";

        // Convert 24-hour format to 12-hour format
        hours = hours % 12;
        hours = hours ? hours : 12; // If hours is 0, set it to 12 (midnight or noon)
        hours = String(hours).padStart(2, "0");

        let currtime = `${hours}:${minutes}:${seconds} ${ampm}`;

        let today = new Date();
        var dd = String(today.getDate()).padStart(2, "0");
        var mm = String(today.getMonth() + 1).padStart(2, "0");
        var yyyy = today.getFullYear();
        // today = yyyy + "-" + mm + "-" + dd;
        const formattedToday = `${yyyy}-${mm}-${dd}`;

        setProducionIndividual({
            vendor: "Please Select Vendor",
            fromdate: formattedToday,

            fromtime24Hrs: dayjs(currtime, "h:mm:ss A"),

            time: dayjs(currtime, "h:mm:ss A").format("HH:mm:ss"),

            starttime24Hrs: dayjs(currtime, "h:mm:ss A"),
            starttime: dayjs(currtime, "h:mm:ss A").format("HH:mm:ss"),

            enddatemode: "Auto",
            datemode: "Auto",
            datetimezone: "",
            category: "Please Select Subcategory",
            filename: "Please Select Category",
            startbuttonstatus: false,
            remarks: "",
            creationstatus: "New",
            unitid: "",
            alllogin: "Please Select AllLogin",
            user: "Please Select Loginid",
            mode: "",
            docnumber: "",
            doclink: "",

            statusmode: "Please Select Status",
            flagcount: 0,
            section: "1",
            addedby: "",
            updatedby: "",
            pendingpages: "",
            notes: "",
            totalpages: 0,
            completepages: 0,
            startpage: "",
            reason: "",
            startdate: formattedToday,
            startdatemode: "Auto",
        });
        setSubcategories([]);
        setCategories([]);
        setClientUserIDArray([]);
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
    };

    console.log(ProducionIndividual, "ProducionIndividual")

    //get all project.
    const fetchProductionIndividual = async () => {
        setPageName(!pageName);
        setProjectCheck(true);
        try {
            let res_project = await axios.post(SERVICE.PRODUCTION_INDIVIDUAL_LIMITED, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                username: isUserRoleAccess.username,
                access: isUserRoleAccess.role,
            });

            setProjmasterDup(res_project?.data?.result);
            setProjectCheck(false);
        } catch (err) {
            setProjectCheck(false);
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const fetchVendors = async () => {
        try {
            let res_vendor = await axios.get(SERVICE.VENDORMASTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let vendorall = res_vendor?.data?.vendormaster.map((d) => ({
                ...d,
                label: d.projectname + "-" + d.name,
                value: d.projectname + "-" + d.name,
            }));

            setVendors(vendorall);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const fetchProjMaster = async (project, cate, sub) => {
        try {
            let res_project = await axios.post(SERVICE.FETCH_ENABLEPAGES_BASED_PROJ_CATE_SUB, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                project: project.split("-")[0],
                category: cate,
                subcategory: sub,
                // name: e.split("-")[0],
            });
            setProjectMaster(res_project?.data?.result);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    // const fetchAllCategory = async (provendoe) => {
    //   try {
    //     let res_vendor = await axios.get(SERVICE.CATEGORYPROD, {
    //       headers: {
    //         Authorization: `Bearer ${auth.APIToken}`,
    //       },
    //     });
    //     let resvendor = provendoe.split("-");
    //     let vendorall = res_vendor?.data?.categoryprod.filter((data, index) => {
    //       return data.project === resvendor[0];
    //     });
    //     let resall = vendorall.map((d) => ({
    //       ...d,
    //       label: d.name,
    //       value: d.name,
    //     }));
    //     const uniqueArray = resall.filter((item, index, self) => {
    //       return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
    //     });
    //     setCategories(uniqueArray);
    //   } catch (err) {
    //     handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    //   }
    // };

    // const fetchAllSubCategory = async (e) => {
    //   try {
    //     let res_vendor = await axios.get(SERVICE.SUBCATEGORYPROD_LIST_LIMITED, {
    //       headers: {
    //         Authorization: `Bearer ${auth.APIToken}`,
    //       },
    //     });

    //     let result = res_vendor?.data?.subcategoryprod.filter((d) => d.categoryname === e);

    //     let subbrandid = result.map((d) => ({
    //       ...d,
    //       label: d.name,
    //       value: d.name,
    //     }));

    //     const uniqueArray = subbrandid.filter((item, index, self) => {
    //       return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
    //     });
    //     setSubcategories(uniqueArray);
    //   } catch (err) {
    //     handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    //   }
    // };
    const fetchAllCategory = async (provendoe) => {
        // setProducionIndividual({ ...ProducionIndividual, vendor: provendoe, alllogin: "Please Select AllLogin", filename: "Please Select Category", category: "Please Select Subcategory" });

        try {
            let res_vendor = await axios.post(SERVICE.CATEGORY_PROD_LIMITED_NAMEONLY, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                // role: isUserRoleAccess.role,
                project: provendoe,
                // companyname: isUserRoleAccess.companyname,
                // date: ProducionIndividual.fromdate,
            });

            let resall = [...new Set(res_vendor?.data?.categoryprod.map((item) => item.name))].map((d) => ({
                ...d,
                label: d,
                value: d,
            }));
            setCategories(resall);

            // let result = res_vendor_cLIENT?.data?.clientuserid;

            // let vendorall = result.map((d) => ({
            //   ...d,
            //   label: d.userid,
            //   value: d.userid,
            // }));
            // setClientUserIDArray(vendorall);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const fetchAllSubCategory = async (project, category) => {
        try {
            let res_vendor = await axios.post(SERVICE.SUBCATEGORYPROD_LIMITED_BYPROJ_CATE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                project: project,
                category: category,
            });

            let result = [...new Set(res_vendor?.data?.subcategoryprod.map((item) => item.name))];
            // let result = res_vendor?.data?.subcategoryprod.filter((d) => d.categoryname === e);

            let subbrandid = result.map((d) => ({
                ...d,
                label: d,
                value: d,
            }));

            // const uniqueArray = subbrandid.filter((item, index, self) => {
            //   return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
            // });
            setSubcategories(subbrandid);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    // //get all Sub vendormasters.
    // const fetchAllLogins = async () => {
    //   try {
    //     let res_vendor = await axios.get(SERVICE.ALL_CLIENTUSERIDDATA, {
    //       headers: {
    //         Authorization: `Bearer ${auth.APIToken}`,
    //       },
    //     });

    //     let alluseridNames = res_vendor?.data?.clientuserid
    //       .filter((item) => item.empname == isUserRoleAccess.companyname)
    //       .map((d) => ({
    //         ...d,
    //         label: d.userid,
    //         value: d.userid,
    //       }));
    //     let alluseridNamesadmin = res_vendor?.data?.clientuserid.map((d) => ({
    //       ...d,
    //       label: d.userid,
    //       value: d.userid,
    //     }));

    //     let rolebylist =
    //       isUserRoleAccess.role.includes("Manager") || isUserRoleAccess.role.includes("Director") || isUserRoleAccess.role.includes("Admin") || isUserRoleAccess.role.includes("SuperAdmin") || isUserRoleAccess.role.includes("ADMIN")
    //         ? alluseridNamesadmin
    //         : alluseridNames;
    //     setLoginAllotFilter(rolebylist);
    //   } catch (err) {
    //     handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    //   }
    // };
    //get all Sub vendormasters.
    const fetchAllLogins = async () => {
        try {
            if (ProducionIndividual.fromdate !== "") {
                let res_vendor = await axios.post(SERVICE.CLIENTUSERID_LIMITED_BYCOMPNYNAME, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    role: isUserRoleAccess.role,
                    project: ProducionIndividual.vendor,
                    companyname: isUserRoleAccess.companyname,
                    date: ProducionIndividual.fromdate,
                });

                // let alluseridNames = res_vendor?.data?.clientuserid;
                let alluseridNamesadmin = res_vendor?.data?.clientuserid.map((d) => ({
                    ...d,
                    label: d.userid,
                    value: d.userid,
                }));

                setLoginAllotFilter(alluseridNamesadmin);
            }
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    useEffect(() => {
        fetchAllLogins();
    }, [ProducionIndividual.fromdate, ProducionIndividual.vendor]);

    const fetchClientUserID = async (e) => {
        try {
            let res_vendor = await axios.get(SERVICE.ALL_CLIENTUSERIDDATA, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let result = res_vendor?.data?.clientuserid.filter((d) => d.projectvendor === e);

            let vendorall = result.map((d) => ({
                ...d,
                label: d.userid,
                value: d.userid,
            }));
            setClientUserIDArray(vendorall);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    useEffect(() => {
        fetchProductionIndividual();
        fetchVendors();
        fetchAllLogins();
    }, []);

    const pathname = window.location.pathname;
    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Production Manual Entry"),
            commonid: String(isUserRoleAccess?._id),
            date: String(new Date()),

            addedby: [
                {
                    name: String(isUserRoleAccess?.username),
                    date: String(new Date()),
                },
            ],
        });
    };

    useEffect(() => {
        getapi();
    }, []);

    const [refImage, setRefImage] = useState([]);
    const [previewURL, setPreviewURL] = useState(null);
    const [refImageDrag, setRefImageDrag] = useState([]);
    const [valNum, setValNum] = useState(0);
    //webcam
    const [isWebcamOpen, setIsWebcamOpen] = useState(false);
    const [capturedImages, setCapturedImages] = useState([]);
    const [getImg, setGetImg] = useState(null);
    const [isWebcamCapture, setIsWebcamCapture] = useState(false);
    const webcamOpen = () => {
        setIsWebcamOpen(true);
    };
    const webcamClose = () => {
        setIsWebcamOpen(false);
        setGetImg("");
    };
    const webcamDataStore = () => {
        setIsWebcamCapture(true);
        webcamClose();
        setGetImg("");
    };
    const showWebcam = () => {
        webcamOpen();
    };
    // Upload Popup
    const [uploadPopupOpen, setUploadPopupOpen] = useState(false);
    const handleClickUploadPopupOpen = () => {
        setUploadPopupOpen(true);
    };
    const handleUploadPopupClose = () => {
        setUploadPopupOpen(false);
        setGetImg("");
        setRefImage([]);
        setPreviewURL(null);
        setRefImageDrag([]);
        setCapturedImages([]);
    };
    const getFileIcon = (fileName) => {
        const extension1 = fileName?.split(".").pop();
        switch (extension1) {
            case "pdf":
                return pdfIcon;
            case "doc":
            case "docx":
                return wordIcon;
            case "xls":
            case "xlsx":
                return excelIcon;
            case "csv":
                return csvIcon;
            default:
                return fileIcon;
        }
    };

    //reference images
    const handleInputChange = (event) => {
        const files = event.target.files;
        let newSelectedFiles = [...refImage];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            // Check if the file is an image
            if (file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = () => {
                    newSelectedFiles.push({
                        name: file.name,
                        size: file.size,
                        type: file.type,
                        preview: reader.result,
                        base64: reader.result.split(",")[1],
                    });
                    setRefImage(newSelectedFiles);
                };
                reader.readAsDataURL(file);
            } else {
                setPopupContentMalert("Only Accept Images!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
        }
    };
    const handleDeleteFile = (index) => {
        const newSelectedFiles = [...refImage];
        newSelectedFiles.splice(index, 1);
        setRefImage(newSelectedFiles);
    };
    const renderFilePreview = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };
    const removeCapturedImage = (index) => {
        const newCapturedImages = [...capturedImages];
        newCapturedImages.splice(index, 1);
        setCapturedImages(newCapturedImages);
    };
    const resetImage = () => {
        setGetImg("");
        setRefImage([]);
        setPreviewURL(null);
        setRefImageDrag([]);
        setCapturedImages([]);
    };
    const handleDragOver = (event) => {
        event.preventDefault();
    };
    const handleDrop = (event) => {
        event.preventDefault();
        previewFile(event.dataTransfer.files[0]);
        const files = event.dataTransfer.files;
        let newSelectedFilesDrag = [...refImageDrag];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = () => {
                    newSelectedFilesDrag.push({
                        name: file.name,
                        size: file.size,
                        type: file.type,
                        preview: reader.result,
                        base64: reader.result.split(",")[1],
                    });
                    setRefImageDrag(newSelectedFilesDrag);
                };
                reader.readAsDataURL(file);
            } else {
                setPopupContentMalert("Only Accept Images!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
        }
    };
    const handleUploadOverAll = () => {
        setUploadPopupOpen(false);
    };
    const previewFile = (file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewURL(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };
    const handleRemoveFile = (index) => {
        const newSelectedFiles = [...refImageDrag];
        newSelectedFiles.splice(index, 1);
        setRefImageDrag(newSelectedFiles);
    };
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


    const getCode = async () => {
        try {
            let res = await axios.get(`${SERVICE.PRODUCTION_INDIVIDUAL_SINGLE}/${ids}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            // console.log(res?.data?.sProductionIndividual, "getcode")
            let timefind = res?.data?.sProductionIndividual.time
            let starttimefind = res?.data?.sProductionIndividual.starttime
            // setProducionIndividual(res?.data?.sProductionIndividual)
            setProducionIndividual({
                ...res?.data?.sProductionIndividual, startdatemode: res?.data?.sProductionIndividual.startmode,


                fromtime24Hrs: dayjs(timefind, "HH:mm:ss")?.isValid()
                    ? dayjs(timefind, "HH:mm:ss")
                    : "",

                time: dayjs(timefind, "HH:mm:ss"),

                starttime24Hrs: dayjs(starttimefind, "HH:mm:ss")?.isValid()
                    ? dayjs(starttimefind, "HH:mm:ss")
                    : "",
                starttime: dayjs(starttimefind, "HH:mm:ss"),
            });


            fetchProjMaster(res?.data?.sProductionIndividual.vendor, res?.data?.sProductionIndividual.filename, res?.data?.sProductionIndividual.category)
            fetchAllCategory(res?.data?.sProductionIndividual?.vendor)
            fetchAllSubCategory(res?.data?.sProductionIndividual?.vendor, res?.data?.sProductionIndividual?.filename)
            // fetchAllLogins(res?.data?.sProductionIndividual)
            setRefImage(res?.data?.sProductionIndividual.files);
            setRefImageDrag(res?.data?.sProductionIndividual.files);
            setCapturedImages(res?.data?.sProductionIndividual.files);
            // setAllUploadedFiles(res?.data?.sProductionIndividual.files);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    useEffect(() => {
        getCode()
    }, [ids])



    return (
        <Box>
            <Headtitle title={"Production Manual Entry"} />
            {/* ****** Header Content ****** */}
            <PageHeading title="Production Manual Entry Edit" modulename="Production" submodulename="Manual Entry" mainpagename="Production Manual Entry" subpagename="" subsubpagename="" />
            {/* {isUserRoleCompare?.includes("aproductionmanualentry") && (
                <> */}

            <Box sx={userStyle.selectcontainer}>
                <>
                    <Grid container spacing={2}>
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Add Production Manual Entry</Typography>
                        </Grid>
                    </Grid>
                    <br />
                    <Grid container spacing={2}>
                        <Grid item md={3} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography>
                                    Vendor <b style={{ color: "red" }}>*</b>
                                </Typography>
                                <Selects
                                    options={vendors}
                                    styles={colourStyles}
                                    value={{ label: ProducionIndividual.vendor, value: ProducionIndividual.vendor }}
                                    onChange={(e) => {
                                        fetchAllCategory(e.value);
                                        setProducionIndividual({
                                            ...ProducionIndividual, vendor: e.value,
                                            alllogin: "Please Select AllLogin",
                                            user: "Please Select Loginid",
                                            filename: "Please Select Category",
                                            category: "Please Select Subcategory"
                                        });
                                        // fetchClientUserID(e.value);
                                        // fetchProjMaster(e.value);
                                        setSubcategories([]);
                                    }}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item md={3} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography>
                                    Category <b style={{ color: "red" }}>*</b>
                                </Typography>
                                <Selects
                                    options={categories}
                                    styles={colourStyles}
                                    value={{ label: ProducionIndividual.filename, value: ProducionIndividual.filename }}
                                    onChange={(e) => {
                                        setProducionIndividual({ ...ProducionIndividual, filename: e.value, category: "Please Select Subcategory" });
                                        fetchAllSubCategory(ProducionIndividual.vendor, e.value);
                                        // setSubcategories([]);
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography>
                                    Sub Category <b style={{ color: "red" }}>*</b>
                                </Typography>
                                <Selects
                                    options={subcategories}
                                    styles={colourStyles}
                                    value={{ label: ProducionIndividual.category, value: ProducionIndividual.category }}
                                    onChange={(e) => {
                                        fetchProjMaster(ProducionIndividual.vendor, ProducionIndividual.filename, e.value);

                                        setProducionIndividual({ ...ProducionIndividual, category: e.value });
                                    }}
                                />
                            </FormControl>
                        </Grid>

                        {!projectmaster && (
                            <>
                                <Grid item md={3} xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Date Mode <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={datemodes}
                                            value={{ label: ProducionIndividual.datemode, value: ProducionIndividual.datemode }}
                                            onChange={(e) => {
                                                // setProducionIndividual({
                                                //   ...ProducionIndividual,
                                                //   datemode: e.value,
                                                //   fromdate: e.value === "Auto" ? formattedToday : "",
                                                //   time: e.value === "Auto" ? currtime : "",
                                                // });
                                                handleModeChange(e.value);
                                            }}
                                        ></Selects>
                                    </FormControl>
                                </Grid>

                                <Grid item md={3} xs={12} sm={6}>
                                    <Grid container spacing={2}>
                                        <Grid item md={6} sm={6} xs={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Date <b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <OutlinedInput
                                                    id="component-outlinedname"
                                                    type="date"
                                                    disabled={ProducionIndividual.datemode === "Auto"}
                                                    value={ProducionIndividual.fromdate}
                                                    // onChange={(e) => {
                                                    //     setProducionIndividual({ ...ProducionIndividual, fromdate: e.target.value });
                                                    // }}
                                                    onChange={handleDateChange}
                                                    inputProps={{
                                                        max: ProducionIndividual.datemode === "Manual" ? formattedToday : undefined,
                                                        min: ProducionIndividual.datemode === "Manual" ? formattedTwoMonthsAgo : undefined,
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={6} sm={6} xs={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Time <b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                {/* <OutlinedInput
                              id="component-outlinedname"
                              type="time"
                              disabled={ProducionIndividual.datemode === "Auto"}
                              value={ProducionIndividual.time}
                              onChange={(e) => {
                                setProducionIndividual({ ...ProducionIndividual, time: e.target.value });
                              }}
                            /> */}
                                                <Space wrap>
                                                    <TimePicker
                                                        style={{ width: "100%" }}
                                                        className="custom-timepicker-bulkmanual"
                                                        disabled={ProducionIndividual.datemode === "Auto"}
                                                        fullWidth
                                                        use12Hours
                                                        // format="h:mm:ss A"
                                                        size="large"
                                                        value={ProducionIndividual.fromtime24Hrs}
                                                        onChange={handleTimeChange}
                                                        allowClear={false}
                                                    />
                                                </Space>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </>
                        )}

                        {projectmaster && (
                            <>
                                <Grid item md={3} xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Creation Status <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={creationmode}
                                            value={{ label: ProducionIndividual.creationstatus, value: ProducionIndividual.creationstatus }}
                                            onChange={(e) => {
                                                setProducionIndividual({
                                                    ...ProducionIndividual,
                                                    creationstatus: e.value,
                                                    statusmode: "Completed",
                                                });
                                            }}
                                        ></Selects>
                                    </FormControl>
                                </Grid>

                                <Grid item md={3} xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Start Date Mode <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={datemodes}
                                            value={{ label: ProducionIndividual.startdatemode, value: ProducionIndividual.startdatemode }}
                                            onChange={(e) => {
                                                // setProducionIndividual({
                                                //   ...ProducionIndividual,
                                                //   startdatemode: e.value,
                                                //   startdate: e.value === "Auto" ? formattedToday : "",
                                                //   starttime: e.value === "Auto" ? currtime : "",
                                                // });
                                                handleStartDateModeChange(e.value);
                                            }}
                                        ></Selects>
                                    </FormControl>
                                </Grid>

                                <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                        <Grid item md={6} sm={6} xs={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Start Date <b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <OutlinedInput
                                                    id="component-outlinedname"
                                                    type="date"
                                                    disabled={ProducionIndividual.startdatemode === "Auto"}
                                                    value={ProducionIndividual.startdate}
                                                    onChange={handleDateChangeStart}
                                                    inputProps={{
                                                        max: ProducionIndividual.startdatemode === "Manual" ? formattedToday : undefined,
                                                        min: ProducionIndividual.startdatemode === "Manual" ? formattedTwoMonthsAgo : undefined,
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={6} sm={6} xs={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Start Time <b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                {/* <OutlinedInput
                              id="component-outlinedname"
                              type="time"
                              disabled={ProducionIndividual.startdatemode === "Auto"}
                              value={ProducionIndividual.starttime}
                              onChange={(e) => {
                                setProducionIndividual({ ...ProducionIndividual, starttime: e.target.value });
                              }}
                            /> */}
                                                <Space wrap>
                                                    <TimePicker
                                                        style={{ width: "100%" }}
                                                        className="custom-timepicker-bulkmanual"
                                                        disabled={ProducionIndividual.startdatemode === "Auto"}
                                                        fullWidth
                                                        use12Hours
                                                        format="h:mm:ss A"
                                                        size="large"
                                                        value={ProducionIndividual.starttime24Hrs}
                                                        // defaultValue={dayjs("00:00:00", "HH:mm:ss a")}
                                                        onChange={handleStartTimeChange}
                                                        allowClear={false}
                                                    />
                                                </Space>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </>
                        )}

                        <Grid item md={3} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography>
                                    Identifier <b style={{ color: "red" }}>*</b>
                                </Typography>
                                <OutlinedInput
                                    id="component-outlinedname"
                                    type="text"
                                    placeholder="Please Enter Identifier"
                                    value={ProducionIndividual.unitid}
                                    onChange={(e) => {
                                        setProducionIndividual({ ...ProducionIndividual, unitid: e.target.value });
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography>
                                    Login Id <b style={{ color: "red" }}>*</b>
                                </Typography>
                                <Selects
                                    options={loginAllotFilter}
                                    styles={colourStyles}
                                    value={{ label: ProducionIndividual.user, value: ProducionIndividual.user }}
                                    onChange={(e) => {
                                        setProducionIndividual({ ...ProducionIndividual, user: e.value, alllogin: e.value });
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography>
                                    All Login <b style={{ color: "red" }}>*</b>
                                </Typography>
                                <Selects
                                    options={clientUserIDArray}
                                    styles={colourStyles}
                                    value={{ label: ProducionIndividual.alllogin, value: ProducionIndividual.vendor }}
                                    onChange={(e) => {
                                        setProducionIndividual({ ...ProducionIndividual, alllogin: e.value });
                                    }}
                                />
                            </FormControl>
                        </Grid>

                        {!projectmaster && (
                            <>
                                <Grid item md={3} xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Flag Count<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput id="component-outlinedname" type="text" placeholder="Please Enter Completed Pages" value={ProducionIndividual.flagcount} onChange={(e) => handleChangephonenumberflag(e)} />
                                    </FormControl>
                                </Grid>
                            </>
                        )}

                        {projectmaster && (
                            <>
                                <Grid item md={3} xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Total Pages <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput id="component-outlinedname" type="text" placeholder="Please Enter Total Pages" value={ProducionIndividual.totalpages} onChange={(e) => handleChangephonenumbertotal(e)} />
                                    </FormControl>
                                </Grid>
                            </>
                        )}
                        <Grid item md={3} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography>
                                    Section <b style={{ color: "red" }}>*</b>
                                </Typography>
                                <OutlinedInput id="component-outlinedname" type="text" placeholder="Please Enter Section" value={ProducionIndividual.section} onChange={(e) => handleChangephonenumber(e)} />
                            </FormControl>
                        </Grid>
                        {projectmaster && ProducionIndividual?.creationstatus === "Already Completed" && (
                            <>
                                <Grid item md={3} xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Completed Pages <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput id="component-outlinedname" type="text" placeholder="Please Enter Completed Pages" value={ProducionIndividual.flagcount} onChange={(e) => handleChangephonenumberflagCompleted(e)} />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Pending Pages <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput id="component-outlinedname" type="text" value={ProducionIndividual.pendingpages} />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Start Page
                                            <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput id="component-outlinedname" type="text" value={ProducionIndividual.startpage} />
                                        {/* <Selects
                                                    options={
                                                        Array.from(
                                                            { length: ProducionIndividual.totalpages - ProducionIndividual.flagcount },
                                                            (_, index) => {
                                                                const startPageNumber = Number(ProducionIndividual.flagcount) + 1 + index;
                                                                return { label: startPageNumber, value: startPageNumber };
                                                            }
                                                        )
                                                    }
                                                    styles={colourStyles}
                                                    value={{ label: ProducionIndividual.startpage, value: ProducionIndividual.startpage }}
                                                    onChange={(e) => {
                                                        setProducionIndividual({ ...ProducionIndividual, startpage: e.value });


                                                    }}
                                                /> */}
                                    </FormControl>
                                </Grid>
                            </>
                        )}

                        {projectmaster && ProducionIndividual?.creationstatus === "Already Completed" ? (
                            <>
                                <Grid item md={3} xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Doc Number</Typography>
                                        <OutlinedInput
                                            id="component-outlinedname"
                                            type="text"
                                            placeholder="Please Enter Doc Number"
                                            value={ProducionIndividual.docnumber}
                                            onChange={(e) => {
                                                setProducionIndividual({ ...ProducionIndividual, docnumber: e.target.value });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Doc Link</Typography>
                                        <OutlinedInput
                                            id="component-outlinedname"
                                            type="text"
                                            placeholder="Please Enter Doc Link"
                                            value={ProducionIndividual.doclink}
                                            onChange={(e) => {
                                                setProducionIndividual({ ...ProducionIndividual, doclink: e.target.value });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </>
                        ) : projectmaster && ProducionIndividual?.creationstatus === "New" ? (
                            ""
                        ) : (
                            <>
                                <Grid item md={3} xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Doc Number</Typography>
                                        <OutlinedInput
                                            id="component-outlinedname"
                                            type="text"
                                            placeholder="Please Enter Doc Number"
                                            value={ProducionIndividual.docnumber}
                                            onChange={(e) => {
                                                setProducionIndividual({ ...ProducionIndividual, docnumber: e.target.value });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Doc Link</Typography>
                                        <OutlinedInput
                                            id="component-outlinedname"
                                            type="text"
                                            placeholder="Please Enter Doc Link"
                                            value={ProducionIndividual.doclink}
                                            onChange={(e) => {
                                                setProducionIndividual({ ...ProducionIndividual, doclink: e.target.value });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </>
                        )}

                        {projectmaster && ProducionIndividual?.creationstatus === "Already Completed" && (
                            <>
                                <Grid item md={3} xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Status <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput id="component-outlinedname" type="text" value={ProducionIndividual.statusmode} />
                                        {/* <Selects
                                                    options={status}
                                                    styles={colourStyles}
                                                    value={{ label: ProducionIndividual.statusmode, value: ProducionIndividual.statusmode }}
                                                    onChange={(e) => {
                                                        setProducionIndividual({ ...ProducionIndividual, statusmode: e.value });
                                                    }}
                                                /> */}
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            End Date Mode <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={datemodes}
                                            value={{ label: ProducionIndividual.enddatemode, value: ProducionIndividual.enddatemode }}
                                            onChange={(e) => {
                                                // setProducionIndividual({
                                                //   ...ProducionIndividual,
                                                //   enddatemode: e.value,
                                                //   fromdate: e.value === "Auto" ? formattedToday : "",
                                                //   time: e.value === "Auto" ? currtime : "",
                                                // });
                                                handleEndDateModeChange(e.value);
                                            }}
                                        ></Selects>
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={6}>
                                    <Grid container spacing={2}>
                                        <Grid item md={6} sm={6} xs={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    End Date <b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <OutlinedInput
                                                    id="component-outlinedname"
                                                    type="date"
                                                    disabled={ProducionIndividual.enddatemode === "Auto"}
                                                    value={ProducionIndividual.fromdate}
                                                    onChange={handleEndDateChange}
                                                    onBlur={handleEndDateBlueChange}
                                                // inputProps={{
                                                //     max: ProducionIndividual.enddatemode === 'Manual' ? formattedToday : undefined,
                                                //     // min: ProducionIndividual.enddatemode === 'Manual' ? formattedTwoMonthsAgo : undefined
                                                // }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={6} sm={6} xs={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    End Time <b style={{ color: "red" }}>*</b>
                                                </Typography>

                                                <Space wrap>
                                                    <TimePicker
                                                        style={{ width: "100%" }}
                                                        className="custom-timepicker-bulkmanual"
                                                        disabled={ProducionIndividual.enddatemode === "Auto"}
                                                        fullWidth
                                                        use12Hours
                                                        format="h:mm:ss A"
                                                        size="large"
                                                        // handleBlur={handleBlurTimeChange}
                                                        value={ProducionIndividual.fromtime24Hrs}
                                                        onChange={handleTimeChange}
                                                        allowClear={false}
                                                    />
                                                </Space>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item md={3} xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <Typography>Remarks</Typography>
                                        <TextareaAutosize
                                            aria-label="minimum height"
                                            minRows={5}
                                            value={ProducionIndividual.remarks}
                                            onChange={(e) => {
                                                setProducionIndividual({ ...ProducionIndividual, remarks: e.target.value });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <Typography>Notes</Typography>
                                        <TextareaAutosize
                                            aria-label="minimum height"
                                            minRows={5}
                                            value={ProducionIndividual.notes}
                                            onChange={(e) => {
                                                setProducionIndividual({ ...ProducionIndividual, notes: e.target.value });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={6}>
                                    <Typography>Attachment</Typography>
                                    <Box sx={{ display: "flex", justifyContent: "left" }}>
                                        <Button variant="contained" onClick={handleClickUploadPopupOpen}>
                                            Upload
                                        </Button>
                                    </Box>
                                </Grid>
                            </>
                        )}
                    </Grid>
                    <br />
                    <Grid container>
                        <Grid item md={3} xs={12} sm={6}>
                            <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={handleSubmit}>
                                {projectmaster && ProducionIndividual?.creationstatus === "New" ? "Start" : "Update"}
                            </Button>
                        </Grid>
                        <Grid item md={3} xs={12} sm={6}>
                            <Button sx={buttonStyles.btncancel} onClick={() => { backPage('/production/productionindividuallist') }}>
                                Cancel
                            </Button>
                        </Grid>
                    </Grid>
                </>
            </Box>
            {/* </>
            )} */}

            <br />

            {/* ALERT DIALOG */}
            <Box>
                <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                        <Typography variant="h6">{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="contained"
                            style={{
                                padding: "7px 13px",
                                color: "white",
                                background: "rgb(25, 118, 210)",
                            }}
                            onClick={handleCloseerr}
                        >
                            ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>

            {/* UPLOAD IMAGE DIALOG */}
            <Dialog open={uploadPopupOpen} onClose={handleUploadPopupClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md" sx={{ marginTop: "95px" }}>
                <DialogTitle id="customized-dialog-title1" sx={{ backgroundColor: "#e0e0e0", color: "#000", display: "flex" }}>
                    Upload Image
                </DialogTitle>
                <DialogContent sx={{ minWidth: "750px", height: "850px" }}>
                    <Grid container spacing={2}>
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            <Typography variant="body2" style={{ marginTop: "5px" }}>
                                {/* Max File size: 5MB */}
                            </Typography>
                            <div onDragOver={handleDragOver} onDrop={handleDrop}>
                                {previewURL && refImageDrag.length > 0 ? (
                                    <>
                                        {refImageDrag.map((file, index) => (
                                            <>
                                                <img
                                                    src={file.preview}
                                                    alt={file.name}
                                                    style={{
                                                        maxWidth: "70px",
                                                        maxHeight: "70px",
                                                        marginTop: "10px",
                                                    }}
                                                />
                                                <Button onClick={() => handleRemoveFile(index)} style={{ marginTop: "0px", color: "red" }}>
                                                    X
                                                </Button>
                                            </>
                                        ))}
                                    </>
                                ) : (
                                    <div
                                        style={{
                                            marginTop: "10px",
                                            marginLeft: "0px",
                                            border: "1px dashed #ccc",
                                            padding: "0px",
                                            width: "100%",
                                            height: "150px",
                                            display: "flex",
                                            alignContent: "center",
                                            textAlign: "center",
                                        }}
                                    >
                                        <div style={{ display: "flex", margin: "50px auto" }}>
                                            <ContentCopyIcon /> Drag and drop
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Grid>
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            <br />
                            <FormControl size="small" fullWidth>
                                <Grid sx={{ display: "flex" }}>
                                    <Button variant="contained" component="label" sx={userStyle.uploadbtn}>
                                        Upload
                                        <input type="file" multiple id="productimage" accept="image/*" hidden onChange={handleInputChange} />
                                    </Button>
                                    &ensp;
                                    <Button variant="contained" onClick={showWebcam} sx={userStyle.uploadbtn}>
                                        Webcam
                                    </Button>
                                </Grid>
                            </FormControl>
                        </Grid>
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            {isWebcamCapture == true &&
                                capturedImages.map((image, index) => (
                                    <Grid container key={index}>
                                        <Grid item md={2} sm={2} xs={12}>
                                            <Box
                                                style={{
                                                    isplay: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    marginLeft: "37px",
                                                }}
                                            >
                                                <img src={image.preview} alt={image.name} height={50} style={{ maxWidth: "-webkit-fill-available" }} />
                                            </Box>
                                        </Grid>
                                        <Grid
                                            item
                                            md={7}
                                            sm={7}
                                            xs={12}
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Typography variant="subtitle2"> {image.name} </Typography>
                                        </Grid>
                                        <Grid item md={1} sm={1} xs={12}>
                                            <Grid sx={{ display: "flex" }}>
                                                <Button
                                                    sx={{
                                                        marginTop: "15px !important",
                                                        padding: "14px 14px",
                                                        minWidth: "40px !important",
                                                        borderRadius: "50% !important",
                                                        ":hover": {
                                                            backgroundColor: "#80808036", // theme.palette.primary.main
                                                        },
                                                    }}
                                                    onClick={() => renderFilePreview(image)}
                                                >
                                                    <VisibilityOutlinedIcon
                                                        style={{
                                                            fontsize: "12px",
                                                            color: "#357AE8",
                                                            marginTop: "35px !important",
                                                        }}
                                                    />
                                                </Button>
                                                <Button
                                                    sx={{
                                                        marginTop: "15px !important",
                                                        padding: "14px 14px",
                                                        minWidth: "40px !important",
                                                        borderRadius: "50% !important",
                                                        ":hover": {
                                                            backgroundColor: "#80808036",
                                                        },
                                                    }}
                                                    onClick={() => removeCapturedImage(index)}
                                                >
                                                    <FaTrash
                                                        style={{
                                                            color: "#a73131",
                                                            fontSize: "12px",
                                                            marginTop: "35px !important",
                                                        }}
                                                    />
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                ))}
                            {refImage.map((file, index) => (
                                <Grid container key={index}>
                                    <Grid item md={2} sm={2} xs={2}>
                                        <Box
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                            {file.type.includes("image/") ? (
                                                <img
                                                    src={file.preview}
                                                    alt={file.name}
                                                    height={50}
                                                    style={{
                                                        maxWidth: "-webkit-fill-available",
                                                    }}
                                                />
                                            ) : (
                                                <img className={classes.preview} src={getFileIcon(file.name)} height="10" alt="file icon" />
                                            )}
                                        </Box>
                                    </Grid>
                                    <Grid
                                        item
                                        md={7}
                                        sm={7}
                                        xs={7}
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Typography variant="subtitle2"> {file.name} </Typography>
                                    </Grid>
                                    <Grid item md={1} sm={1} xs={1}>
                                        <Grid sx={{ display: "flex" }}>
                                            <Button
                                                sx={{
                                                    padding: "14px 14px",
                                                    minWidth: "40px !important",
                                                    borderRadius: "50% !important",
                                                    ":hover": {
                                                        backgroundColor: "#80808036", // theme.palette.primary.main
                                                    },
                                                }}
                                                onClick={() => renderFilePreview(file)}
                                            >
                                                <VisibilityOutlinedIcon style={{ fontsize: "12px", color: "#357AE8" }} />
                                            </Button>
                                            <Button
                                                sx={{
                                                    padding: "14px 14px",
                                                    minWidth: "40px !important",
                                                    borderRadius: "50% !important",
                                                    ":hover": {
                                                        backgroundColor: "#80808036", // theme.palette.primary.main
                                                    },
                                                }}
                                                onClick={() => handleDeleteFile(index)}
                                            >
                                                <FaTrash style={{ color: "#a73131", fontSize: "12px" }} />
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleUploadOverAll} variant="contained">
                        Ok
                    </Button>
                    <Button onClick={resetImage} sx={userStyle.btncancel}>
                        Reset
                    </Button>
                    <Button onClick={handleUploadPopupClose} sx={userStyle.btncancel}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            {/* webcam alert start */}
            <Dialog open={isWebcamOpen} onClose={webcamClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="sm" fullWidth={true}>
                <DialogContent
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        textAlign: "center",
                        alignItems: "center",
                    }}
                >
                    <Webcamimage name={name} getImg={getImg} setGetImg={setGetImg} valNum={valNum} setValNum={setValNum} capturedImages={capturedImages} setCapturedImages={setCapturedImages} setRefImage={setRefImage} setRefImageDrag={setRefImageDrag} />
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="success" onClick={webcamDataStore}>
                        OK
                    </Button>
                    <Button variant="contained" color="error" onClick={webcamClose}>
                        CANCEL
                    </Button>
                </DialogActions>
            </Dialog>

            <MessageAlert openPopup={openPopupMalert} handleClosePopup={handleClosePopupMalert} popupContent={popupContentMalert} popupSeverity={popupSeverityMalert} />
            {/* SUCCESS */}
            <AlertDialog openPopup={openPopup} handleClosePopup={handleClosePopup} popupContent={popupContent} popupSeverity={popupSeverity} />
        </Box>
    );
}

export default ProductionIndividualEdit;