import React, { useState, useEffect, useRef, useContext } from "react";
import {
    Box, Typography, OutlinedInput, TextareaAutosize,
    Chip, TableCell, Select, Paper, MenuItem, Dialog, DialogTitle, Radio, InputAdornment, FormControlLabel, RadioGroup, Tooltip,
    DialogContent, DialogActions, FormControl, Grid, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton
} from "@mui/material";
import { userStyle, colourStyles } from "../../../pageStyle";
import { FaPrint, FaFilePdf, FaTrash, FaSearch } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import Selects from "react-select";
import { SERVICE } from "../../../services/Baseservice";
import { handleApiError } from "../../../components/Errorhandling";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import moment from "moment-timezone";
import Headtitle from "../../../components/Headtitle";
import PageHeading from "../../../components/PageHeading";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext } from "../../../context/Appcontext";
import { AuthContext } from "../../../context/Appcontext";
import { ThreeDots } from "react-loader-spinner";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { FaFileExcel, FaFileCsv } from 'react-icons/fa';
import AggregatedSearchBar from "../../../components/AggregatedSearchBar";
import AggridTable from "../../../components/AggridTable";
import domtoimage from 'dom-to-image';
import AlertDialog from "../../../components/Alert";
import MessageAlert from "../../../components/MessageAlert";
import LoadingButton from "@mui/lab/LoadingButton";
import { makeStyles } from "@material-ui/core";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import csvIcon from "../../../components/Assets/CSV.png";
import excelIcon from "../../../components/Assets/excel-icon.png";
import fileIcon from "../../../components/Assets/file-icons.png";
import pdfIcon from "../../../components/Assets/pdf-icon.png";
import wordIcon from "../../../components/Assets/word-icon.png";
import Webcamimage from "../../asset/Webcameimageasset";
import ExportData from "../../../components/ExportData";
import AggridTableForPaginationTable from "../../../components/AggridTableForPaginationTable.js";
import { MdClose } from "react-icons/md";
import { IoMdOptions } from "react-icons/io";



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


function PendingManualentrylist() {
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



    // State to track advanced filter
    const [advancedFilter, setAdvancedFilter] = useState(null);
    const [gridApi, setGridApi] = useState(null);
    const [columnApi, setColumnApi] = useState(null);
    const [filteredDataItems, setFilteredDataItems] = useState([]);
    //  const [filteredRowData, setFilteredRowData] = useState([]);
    const [logicOperator, setLogicOperator] = useState("AND");

    const [selectedColumn, setSelectedColumn] = useState("");
    const [selectedCondition, setSelectedCondition] = useState("Contains");
    const [filterValue, setFilterValue] = useState("");
    const [additionalFilters, setAdditionalFilters] = useState([]);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const conditions = ["Contains", "Does Not Contain", "Equals", "Does Not Equal", "Begins With", "Ends With", "Blank", "Not Blank"]; // AgGrid-like conditions




    let nameedit = "edit";
    const classes = useStyles();
    const [allUploadedFilesedit, setAllUploadedFilesedit] = useState([]);


    const [loadingdeloverall, setloadingdeloverall] = useState(false);
    const [loadingPdfExport, setLoadingPdfExport] = useState(false);

    const gridRef = useRef(null);



    let exportColumnNames = [
        'Vendor', 'From Date',
        'Date', 'Time',
        'Category', 'SubCategory',
        'Identifier', 'Login Id',
        'Section', 'Flag Count',
        'Doc Number', 'Doc Link',
        'Start Date Mode', 'Start Date',
        'Start Time', 'Status Mode',
        'Total Pages', 'Pending Pages',
        'Start Page', 'Remarks/Notes',
        'Approval Status', 'Late Entry Status'
    ];
    let exportRowValues = [
        'vendor', 'datemode',
        'fromdate', 'time',
        'filename', 'category',
        'unitid', 'user',
        'section', 'flagcount',
        'docnumber', 'doclink',
        'startmode', 'startdate',
        'starttime', 'statusmode',
        'totalpages', 'pendingpages',
        'startpage', 'notes',
        'approvalstatus', 'lateentrystatus'
    ];




    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
    const [searchedString, setSearchedString] = useState("");
    const [isHandleChange, setIsHandleChange] = useState(false);
    const gridRefTableImg = useRef(null);
    const gridRefTable = useRef(null);


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
    };

    const statuschange = [
        { label: "Completed", value: "Completed" },
        { label: "In Complete", value: "In Complete" },
        { label: "Partial Complete", value: "Partial Complete" },
        { label: "Started", value: "Started" },
        { label: "Stop", value: "Stop" },
        { label: "Pause", value: "Pause" },
        { label: "Reject", value: "Reject" },
        { label: "Cancel", value: "Cancel" },
    ];

    //    today date fetching
    let today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    // today = yyyy + "-" + mm + "-" + dd;
    const formattedToday = `${yyyy}-${mm}-${dd}`;
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
        setloadingdeloverall(false);

    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };

    const [projmasterDup, setProjmasterDup] = useState([])


    // Calculate the date two months ago
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(today.getMonth() - 2);
    const ddPast = String(twoMonthsAgo.getDate()).padStart(2, "0");
    const mmPast = String(twoMonthsAgo.getMonth() + 1).padStart(2, "0");
    const yyyyPast = twoMonthsAgo.getFullYear();
    const formattedTwoMonthsAgo = `${yyyyPast}-${mmPast}-${ddPast}`;

    const handleDateChange = (e) => {
        const selectedDate = new Date(e.target.value);
        const minDate = new Date(formattedTwoMonthsAgo);
        const maxDate = new Date(formattedToday);

        if (ProducionIndividual.datemode === 'Manual') {
            if (selectedDate >= minDate && selectedDate <= maxDate) {
                setProducionIndividual({ ...ProducionIndividual, fromdate: e.target.value });
            } else {
                setPopupContent("Please select a date within the past two months and not in the future");
                setPopupSeverity("warning");
                handleClickOpenPopup();

            }
        } else {
            setProducionIndividual({ ...ProducionIndividual, fromdate: e.target.value });
        }
    };


    const handleDateChangeEdit = (e) => {
        const selectedDate = new Date(e.target.value);
        const currentDate = new Date(); // Current date and time

        // Ensure only date comparison without time
        const fromDate = new Date(ProducionIndividualChange.startdate || currentDate);
        fromDate.setHours(0, 0, 0, 0); // Reset time portion to midnight
        selectedDate.setHours(0, 0, 0, 0); // Reset time portion to midnight
        currentDate.setHours(0, 0, 0, 0); // Reset time portion to midnight


        if (ProducionIndividualChange.enddatemode === 'Manual') {
            if (selectedDate < fromDate) {
                // setPopupContent("End Date should be after or equal to Start Date!");
                // setPopupSeverity("warning");
                // handleClickOpenPopup();
                setPopupContentMalert("End Date should be after or equal to Start Date !");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
                setProducionIndividualChange({ ...ProducionIndividualChange, fromdate: "", time: "" });
            } else if (selectedDate >= fromDate) {
                setProducionIndividualChange({ ...ProducionIndividualChange, fromdate: e.target.value, time: "" });
            } else {
                // setPopupContent("End Date cannot be in the past!");
                // setPopupSeverity("warning");
                // handleClickOpenPopup();

                setPopupContentMalert("End Date cannot be in the past!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();


            }
        } else {
            setProducionIndividualChange({ ...ProducionIndividualChange, fromdate: e.target.value });
        }
    };

    let now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    let currtime = `${hours}:${minutes}`;


    const [selectedRows, setSelectedRows] = useState([]);

    const [searchQueryManage, setSearchQueryManage] = useState("");

    const [ProducionIndividual, setProducionIndividual] = useState({
        vendor: "Please Select Vendor", fromdate: formattedToday, time: currtime, datemode: "Auto", datetimezone: "", category: "Please Select Subcategory",
        filename: "Please Select Category", unitid: "", alllogin: "Please Select AllLogin", user: "Please Select Loginid", mode: "", docnumber: "", doclink: "",
        statusmode: "Please Select Status", flagcount: 0, section: "1", addedby: "", updatedby: "", pendingpages: "", notes: "",
        totalpages: 0, completepages: 0, startpage: "Please Select Start Page", reason: "", startdate: formattedToday, starttime: currtime, startdatemode: "Auto",
    });


    const [ProducionIndividualChange, setProducionIndividualChange] = useState({
        vendor: "Please Select Vendor", fromdate: formattedToday, time: currtime, datemode: "Auto", datetimezone: "", category: "Please Select Subcategory",
        filename: "Please Select Category", unitid: "", alllogin: "Please Select AllLogin", user: "Please Select Loginid", mode: "", docnumber: "", doclink: "",
        statusmode: "Please Select Status", flagcount: "", section: "1", pendingpages: "",
        totalpages: "", completepages: "", startpage: "Please Select Start Page", reason: "", startdate: formattedToday, starttime: currtime, startdatemode: "Auto",
    });

    const handleChangephonenumberflagChange = (e) => {
        // Regular expression to match only positive numeric values
        const regex = /^[0-9]+$/; // Only allows positive integers

        const inputValue = e.target.value;

        // Check if the input value matches the regex or if it's empty (allowing backspace)
        if (regex.test(inputValue) || inputValue === "") {
            let difference = Number(ProducionIndividualChange.totalpages) - Number(inputValue)
            // Check if the input value exceeds totalpages
            const getstpage = Array.from(
                { length: inputValue - 0 },
                (_, index) => {
                    const startPageNumber = Number(inputValue) + index;
                    return startPageNumber;
                }
            )
            if (parseInt(inputValue) > parseInt(ProducionIndividualChange.totalpages)) {
                // alert("Completed pages cannot be greater than total pages.");

                setPopupContent("Completed pages cannot be greater than total pages");
                setPopupSeverity("warning");
                handleClickOpenPopup();
            } else {
                // Update the state with the valid numeric value
                setProducionIndividualChange({ ...ProducionIndividualChange, flagcount: inputValue, startpage: getstpage[0]+1, pendingpages: difference });
            }
        }
    };
    const handleChangephonenumbertotalChange = (e) => {
        // Regular expression to match only positive numeric values
        const regex = /^[0-9]+$/; // Only allows positive integers
        // const regex = /^\d*\.?\d*$/;

        const inputValue = e.target.value;

        // Check if the input value matches the regex or if it's empty (allowing backspace)
        if (regex.test(inputValue) || inputValue === "") {
            // Update the state with the valid numeric value
            let difference = Number(inputValue) - Number(0);
            const getstpage = Array.from(
                { length: inputValue - 0 },
                (_, index) => {
                    const startPageNumber = Number(0) + 1 + index;
                    return startPageNumber;
                }
            )
            setProducionIndividualChange({ ...ProducionIndividualChange, totalpages: inputValue, startpage: getstpage[0], flagcount: 0, pendingpages: difference });
        }
    };

    const [productionedit, setProductionEdit] = useState({
        vendor: "Please Select Vendor", fromdate: "", time: "", datemode: "", datetimezone: "", category: "Please Select Subcategory",
        filename: "Please Select Category", unitid: "", alllogin: "Please Select AllLogin", user: "Please Select Loginid", docnumber: "", doclink: "",
        flagcount: "", section: "",
    });
    const [projmaster, setProjmaster] = useState([]);
    const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, buttonStyles,
    } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    const [projectCheck, setProjectCheck] = useState(false);

    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();

    const [openview, setOpenview] = useState(false);
    const [openInfo, setOpeninfo] = useState(false);

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteproject, setDeleteproject] = useState({});
    const [isEditOpen, setIsEditOpen] = useState(false);

    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");


    let datemodes = isUserRoleCompare.includes("lpendingmanualentrylist") ||
        isUserRoleAccess.role.includes("Manager")
        ? [{ label: "Auto", value: "Auto" }, { label: "Manual", value: "Manual" }] : [{ label: "Auto", value: "Auto" }]


    //image
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, 'Pending Manual Entry List.png');
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };


    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };

    // Error Popup model

    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };

    // view model
    const handleClickOpenview = () => {
        setOpenview(true);
    };

    const handleCloseview = () => {
        setOpenview(false);
    };

    //check delete model
    const [isCheckOpen, setisCheckOpen] = useState(false);
    const handleClickOpenCheck = () => {
        setisCheckOpen(true);
    };
    const handleCloseCheck = () => {
        setisCheckOpen(false);
    };

    // info model
    const handleClickOpeninfo = () => {
        setOpeninfo(true);
    };

    const handleCloseinfo = () => {
        setOpeninfo(false);
    };

    //Delete model
    const handleClickOpen = () => {
        setIsDeleteOpen(true);
    };
    const handleCloseMod = () => {
        setIsDeleteOpen(false);
    };

    //Delete model
    const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

    const handleClickOpenalert = () => {
        if (selectedRows.length == 0) {
            setIsDeleteOpenalert(true);
        } else {
            setIsDeleteOpencheckbox(true);
        }
    };
    const handleCloseModalert = () => {
        setIsDeleteOpenalert(false);
    };

    //Delete model
    const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);

    const handleClickOpencheckbox = () => {
        setIsDeleteOpencheckbox(true);
    };
    const handleCloseModcheckbox = () => {
        setIsDeleteOpencheckbox(false);
    };

    // Error Popup model
    const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
    const [showAlertpop, setShowAlertpop] = useState();
    const handleClickOpenerrpop = () => {
        setIsErrorOpenpop(true);
    };
    const handleCloseerrpop = () => {
        setIsErrorOpenpop(false);
    };

    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
    };

    const username = isUserRoleAccess.username;
    const userData = {
        name: username,
        date: new Date(),
    };

    // Manage Columns
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleOpenManageColumns = (event) => {
        setAnchorEl(event.currentTarget);
        setManageColumnsOpen(true);
    };
    const handleCloseManageColumns = () => {
        setManageColumnsOpen(false);
        setSearchQueryManage("");
    };

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        vendor: true,
        datemode: true,
        fromdate: true,
        time: true,
        filename: true,
        category: true,
        unitid: true,
        user: true,
        section: true,
        flagcount: true,
        alllogin: true,
        docnumber: true,
        doclink: true,
        approvalstatus: true,
        lateentrystatus: true,
        startmode: true,
        startdate: true,
        starttime: true,
        status: true,
        totalpages: true,
        flagcount: true,
        pendingpages: true,
        startpage: true,
        reason: true,
        statusmode: true,
        enddate: true,
        endtime: true,
        notes: true,
        actions: true,
        actionsstatus: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);
    //Edit model...
    const handleClickOpenEdit = () => {
        setIsEditOpen(true);
    };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpen(false);
    };


    const editSubmit = async () => {
        if (ProducionIndividualChange.statusmode === "Please Select Status") {

            setPopupContentMalert("Please Select Status!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (ProducionIndividualChange.statusmode === "Completed" || ProducionIndividualChange.statusmode === "In Complete" || ProducionIndividualChange.statusmode === "Partial Complete" || ProducionIndividualChange.statusmode === "Started" || ProducionIndividualChange.statusmode === "Stop" || ProducionIndividualChange.statusmode === "Pause") {
            if (ProducionIndividualChange.fromdate === "") {

                setPopupContentMalert("Please Select End Date!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            } else if (ProducionIndividualChange.time === "") {

                setPopupContentMalert("Please Select End Time!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            } else if (ProducionIndividualChange.totalpages === "" || ProducionIndividualChange.totalpages === 0) {
                setPopupContentMalert("Please Enter Total Pages!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            } else if (ProducionIndividualChange.statusmode === "Completed" && (ProducionIndividualChange.flagcount === 0 || ProducionIndividualChange.flagcount === "")) {
                setPopupContentMalert("Please Enter Completed Pages!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            } else if (ProducionIndividualChange.statusmode === "Completed" && (ProducionIndividualChange.flagcount !== ProducionIndividualChange.totalpages)) {
                setPopupContentMalert("Completed Pages and Total pages count didn't match!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            } else if (ProducionIndividualChange.pendingpages === "") {
                setPopupContentMalert("Please Enter Pending Pages!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            } else if (ProducionIndividualChange.startdatemode === "") {
                setPopupContentMalert("Please Select Start Date Mode!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            } 
            // else if (ProducionIndividualChange.statusmode === "Completed" && ProducionIndividualChange.notes === "") {
            //     setPopupContentMalert("Please Enter Notes!");
            //     setPopupSeverityMalert("warning");
            //     handleClickOpenPopupMalert();
            // } else if (ProducionIndividualChange.statusmode === "Completed" && ProducionIndividualChange.remarks === "") {
            //     setPopupContentMalert("Please Enter Remarks!");
            //     setPopupSeverityMalert("warning");
            //     handleClickOpenPopupMalert();
            // } 
            else if ((ProducionIndividualChange.startdate === ProducionIndividualChange.fromdate) && (ProducionIndividualChange.starttime === ProducionIndividualChange.time)) {
                setPopupContentMalert("End Date/Time End Date must be greater than Start Date/Time!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            } else {
                sendEditRequest()
            }
        } else if (ProducionIndividualChange.statusmode === "Reject" || ProducionIndividualChange.statusmode === "Cancel") {
            if (ProducionIndividualChange.reason === "") {
                setPopupContentMalert("Please Enter Reason!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else {
                sendEditRequest()
            }
        }
    }

    // get single row to view....
    const getviewCode = async (e) => {
        try {
            let res = await axios.get(`${SERVICE.PRODUCTION_INDIVIDUAL_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setProductionEdit(res?.data?.sProductionIndividual);
            handleClickOpenview();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };


    const getCode = async (e) => {
        try {
            let res = await axios.get(`${SERVICE.PRODUCTION_INDIVIDUAL_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setProducionIndividualChange(res?.data?.sProductionIndividual);
            setAllUploadedFilesedit(res?.data?.sProductionIndividual.files);
            handleClickOpenEdit();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    let projectsid = ProducionIndividualChange._id;

    //editing the single data...
    const sendEditRequest = async () => {
        try {
            if (ProducionIndividualChange?.statusmode === "Reject" || ProducionIndividualChange?.statusmode === "Cancel") {
                let res = await axios.put(`${SERVICE.PRODUCTION_INDIVIDUAL_SINGLE}/${projectsid}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    reason: String(ProducionIndividualChange.reason),
                    statusmode: String(ProducionIndividualChange.statusmode),

                });
            } else {
                let res = await axios.put(`${SERVICE.PRODUCTION_INDIVIDUAL_SINGLE}/${projectsid}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    fromdate: String(ProducionIndividualChange.fromdate),
                    time: String(ProducionIndividualChange.time),
                    statusmode: String(ProducionIndividualChange.statusmode),
                    enddatemode: String(ProducionIndividualChange.enddatemode),
                    totalpages: String(ProducionIndividualChange.totalpages),
                    flagcount: String(ProducionIndividualChange.flagcount),
                    pendingpages: Number(ProducionIndividualChange.pendingpages),
                    startpage: String(ProducionIndividualChange.startpage),
                    reason: String(ProducionIndividualChange.reason),
                    remarks: String(ProducionIndividualChange.remarks),
                    notes: String(ProducionIndividualChange.notes),
                    files: allUploadedFilesedit.concat(refImageedit, refImageDragedit, capturedImagesedit),

                });
            }
            await fetchEmployee();
            fetchProductionIndividual();
            handleCloseModEdit();
            setPopupContent("Changed Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    //get all project.
    const fetchProductionIndividual = async () => {
        setPageName(!pageName)
        setProjectCheck(true);
        try {

            let res_project = await axios.post(SERVICE.PRODUCTION_INDIVIDUAL_PENDING, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                username: isUserRoleAccess.username,
                companyname: isUserRoleAccess.companyname,
                access: isUserRoleAccess.role
            });

            setProjmasterDup(res_project?.data?.result);
            setProjectCheck(false);
        } catch (err) { setProjectCheck(false); handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const [loading, setLoading] = useState(false)

    const [overallFilterdata, setOverallFilterdata] = useState([]);
    const [totalProjects, setTotalProjects] = useState(0);
    const [subcategoriesCount, setSubcategoriesCount] = useState(0);
    const [totalProjectsData, setTotalProjectsData] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [overalExcel, setoveralExcel] = useState([]);


    const fetchEmployee = async () => {
        setPageName(!pageName)
        setLoading(true)

        const queryParams = {
            page: Number(page),
            pageSize: Number(pageSize),
            // searchTerm: searchQuery,
            companyname: isUserRoleAccess.companyname,
            role: isUserRoleAccess.role,
            statusmode: ["Pause", "Stop", "In Complete", "Partial Complete"]
        };

        const allFilters = [
            ...additionalFilters,
            { column: selectedColumn, condition: selectedCondition, value: filterValue }
        ];
        // Only include advanced filters if they exist, otherwise just use regular searchQuery
        if (allFilters.length > 0 && selectedColumn !== "") {
            queryParams.allFilters = allFilters
            queryParams.logicOperator = logicOperator;
        } else if (searchQuery) {
            queryParams.searchQuery = searchQuery;
        }
        try {
            let res_employee = await axios.post(SERVICE.PRODUCTION_INDIVIDUAL_MANUALSTATUS, queryParams, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            const ans = res_employee?.data?.result?.length > 0 ? res_employee?.data?.result : []

            let res1 = await axios.get(SERVICE.GET_ATTENDANCE_CONTROL_CRITERIA_LAST_INDEX);
            let dataFromControlPanel = res1?.data?.attendancecontrolcriteria;


            const itemsWithSerialNumber = ans?.map((item, index) => {

                const fromDate = new Date(item.createdAt);

                const fromDaten = new Date(`${item.fromdate}T${item.time}:00`);

                let approvaldays = Number(dataFromControlPanel.approvalstatusDays) > 0 ? Number(dataFromControlPanel.approvalstatusDays) * 24 : 1
                let approvalhours = Number(dataFromControlPanel.approvalstatusHour) > 0 ? Number(dataFromControlPanel.approvalstatusHour) * 60 : 1
                let approvalmins = Number(dataFromControlPanel.approvalstatusMin) > 0 ? Number(dataFromControlPanel.approvalstatusMin) * 60 : 1

                let entrydays = Number(dataFromControlPanel.entrystatusDays) > 0 ? Number(dataFromControlPanel.entrystatusDays) * 24 : 1
                let entryhours = Number(dataFromControlPanel.entrystatusHour) > 0 ? Number(dataFromControlPanel.entrystatusHour) * 60 : 1
                let entrymins = Number(dataFromControlPanel.entrystatusMin) > 0 ? Number(dataFromControlPanel.entrystatusMin) * 60 : 1
                const fromDatePlus48Hours = new Date(fromDaten.getTime() + approvaldays * approvalhours * approvalmins * 1000);
                const currentDateTime = new Date();
                const fromDatePlus24Hours = new Date(fromDate.getTime() + entrydays * entryhours * entrymins * 1000);

                return {
                    ...item,
                    serialNumber: (page - 1) * pageSize + index + 1,
                    notes: (item.notes === "" || item.notes === undefined || item.notes === "undefined") ? "" : item.notes,
                    remarks: (item.remarks === "" || item.remarks === undefined || item.remarks === "undefined") ? "" : item.remarks,
                    fromdate: (item.fromdate === "" || item.fromdate === undefined || item.fromdate === "undefined") ? "" : moment(item.fromdate).format("DD/MM/YYYY"),
                    startdate: (item.startdate === "" || item.startdate === undefined || item.startdate === "undefined") ? "" : moment(item.startdate).format("DD/MM/YYYY"),
                    statusmode: item.statusmode === "Please Select Status" ? "" : item.statusmode,
                    startpage: item.startpage === "Please Select Start Page" ? "" : item.startpage,
                    lateentrystatus: (fromDate > fromDatePlus48Hours) ? "Late Entry" : "On Entry",
                    approvalstatus: (item.approvaldate === "" || item.approvaldate === null || item.approvaldate === undefined) && item.status === "Approved" ? "" :
                        ((new Date() <= fromDatePlus24Hours) && (item.approvaldate === "" || item.approvaldate === null || item.approvaldate === undefined)) ? "Pending" :
                            ((new Date() > fromDatePlus24Hours) && (item.approvaldate === "" || item.approvaldate === null || item.approvaldate === undefined)) ? "Late Not Approval" :
                                ((new Date(item.approvaldate) > fromDatePlus24Hours) && item.approvaldate) ? "Late Approval" :
                                    "On Approval"
                }
            });
            setProjmaster(itemsWithSerialNumber);

            setOverallFilterdata(res_employee?.data?.totalProjectsData?.length > 0 ?
                res_employee?.data?.totalProjectsData?.map((item, index) => {
                    const fromDate = new Date(item.createdAt);

                    const fromDaten = new Date(`${item.fromdate}T${item.time}:00`);

                    let approvaldays = Number(dataFromControlPanel.approvalstatusDays) > 0 ? Number(dataFromControlPanel.approvalstatusDays) * 24 : 1
                    let approvalhours = Number(dataFromControlPanel.approvalstatusHour) > 0 ? Number(dataFromControlPanel.approvalstatusHour) * 60 : 1
                    let approvalmins = Number(dataFromControlPanel.approvalstatusMin) > 0 ? Number(dataFromControlPanel.approvalstatusMin) * 60 : 1

                    let entrydays = Number(dataFromControlPanel.entrystatusDays) > 0 ? Number(dataFromControlPanel.entrystatusDays) * 24 : 1
                    let entryhours = Number(dataFromControlPanel.entrystatusHour) > 0 ? Number(dataFromControlPanel.entrystatusHour) * 60 : 1
                    let entrymins = Number(dataFromControlPanel.entrystatusMin) > 0 ? Number(dataFromControlPanel.entrystatusMin) * 60 : 1
                    const fromDatePlus48Hours = new Date(fromDaten.getTime() + approvaldays * approvalhours * approvalmins * 1000);
                    const currentDateTime = new Date();

                    const fromDatePlus24Hours = new Date(fromDate.getTime() + entrydays * entryhours * entrymins * 1000);


                    return {
                        ...item,
                        fromdate: (item.fromdate === "" || item.fromdate === undefined || item.fromdate === "undefined") ? "" : moment(item.fromdate).format("DD/MM/YYYY"),
                        startdate: (item.startdate === "" || item.startdate === undefined || item.startdate === "undefined") ? "" : moment(item.startdate).format("DD/MM/YYYY"),
                        statusmode: item.statusmode === "Please Select Status" ? "" : item.statusmode,
                        notes: (item.notes === "" || item.notes === undefined || item.notes === "undefined") ? "" : item.notes,
                        remarks: (item.remarks === "" || item.remarks === undefined || item.remarks === "undefined") ? "" : item.remarks,
                        startpage: item.startpage === "Please Select Start Page" ? "" : item.startpage,
                        lateentrystatus: (fromDate > fromDatePlus48Hours) ? "Late Entry" : "On Entry",
                        approvalstatus: (item.approvaldate === "" || item.approvaldate === null || item.approvaldate === undefined) && item.status === "Approved" ? "" :
                            ((new Date() <= fromDatePlus24Hours) && (item.approvaldate === "" || item.approvaldate === null || item.approvaldate === undefined)) ? "Pending" :
                                ((new Date() > fromDatePlus24Hours) && (item.approvaldate === "" || item.approvaldate === null || item.approvaldate === undefined)) ? "Late Not Approval" :
                                    ((new Date(item.approvaldate) > fromDatePlus24Hours) && item.approvaldate) ? "Late Approval" :
                                        "On Approval"

                    }
                }

                ) : []
            );
            setTotalProjects(ans?.length > 0 ? res_employee?.data?.totalProjects : 0);
            setTotalPages(ans?.length > 0 ? res_employee?.data?.totalPages : 0);
            setPageSize((data) => { return ans?.length > 0 ? data : 10 });
            setPage((data) => { return ans?.length > 0 ? data : 1 });
            setLoading(false)
        } catch (err) { setLoading(false); handleApiError(err, setShowAlert, handleClickOpenerr); }
    };


    useEffect(() => {
        fetchEmployee();
    }, [page, pageSize, searchQuery]);


    const fetchProductionIndividualOverallExcel = async () => {
        setPageName(!pageName)
        try {

            let res_employee = await axios.post(SERVICE.PRODUCTION_INDIVIDUAL_OVEALL_EXCEL_PENDING, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                statusmode: ["Pause", "Stop", "In Complete", "Partial Complete"]

            });

            const ans = res_employee?.data?.result?.length > 0 ? res_employee?.data?.result : []
            let res1 = await axios.get(SERVICE.GET_ATTENDANCE_CONTROL_CRITERIA_LAST_INDEX);
            let dataFromControlPanel = res1?.data?.attendancecontrolcriteria;


            const itemsWithSerialNumber = ans?.map((item, index) => {

                const fromDate = new Date(item.createdAt);

                const fromDaten = new Date(`${item.fromdate}T${item.time}:00`);

                let approvaldays = Number(dataFromControlPanel.approvalstatusDays) > 0 ? Number(dataFromControlPanel.approvalstatusDays) * 24 : 1
                let approvalhours = Number(dataFromControlPanel.approvalstatusHour) > 0 ? Number(dataFromControlPanel.approvalstatusHour) * 60 : 1
                let approvalmins = Number(dataFromControlPanel.approvalstatusMin) > 0 ? Number(dataFromControlPanel.approvalstatusMin) * 60 : 1

                let entrydays = Number(dataFromControlPanel.entrystatusDays) > 0 ? Number(dataFromControlPanel.entrystatusDays) * 24 : 1
                let entryhours = Number(dataFromControlPanel.entrystatusHour) > 0 ? Number(dataFromControlPanel.entrystatusHour) * 60 : 1
                let entrymins = Number(dataFromControlPanel.entrystatusMin) > 0 ? Number(dataFromControlPanel.entrystatusMin) * 60 : 1
                const fromDatePlus48Hours = new Date(fromDaten.getTime() + approvaldays * approvalhours * approvalmins * 1000);
                const currentDateTime = new Date();

                const fromDatePlus24Hours = new Date(fromDate.getTime() + entrydays * entryhours * entrymins * 1000);

                return {
                    ...item,
                    serialNumber: (page - 1) * pageSize + index + 1,
                    notes: (item.notes === "" || item.notes === undefined || item.notes === "undefined") ? "" : item.notes,
                    fromdate: moment(item.fromdate).format("DD/MM/YYYY"),
                    startdate: moment(item.startdate).format("DD/MM/YYYY"),
                    statusmode: item.statusmode === "Please Select Status" ? "" : item.statusmode,
                    startpage: item.startpage === "Please Select Start Page" ? "" : item.startpage,
                    lateentrystatus: (fromDate > fromDatePlus48Hours) ? "Late Entry" : "On Entry",
                    approvalstatus: (item.approvaldate === "" || item.approvaldate === null || item.approvaldate === undefined) && item.status === "Approved" ? "" :
                        ((new Date() <= fromDatePlus24Hours) && (item.approvaldate === "" || item.approvaldate === null || item.approvaldate === undefined)) ? "Pending" :
                            ((new Date() > fromDatePlus24Hours) && (item.approvaldate === "" || item.approvaldate === null || item.approvaldate === undefined)) ? "Late Not Approval" :
                                ((new Date(item.approvaldate) > fromDatePlus24Hours) && item.approvaldate) ? "Late Approval" :
                                    "On Approval"
                }
            });

            setoveralExcel(itemsWithSerialNumber);
        } catch (err) { setProjectCheck(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    useEffect(() => {
        fetchProductionIndividualOverallExcel()
    }, [])




    // pdf.....
    const columns = [
        { title: "Vendor", field: "vendor" },
        { title: "From Date", field: "datemode" },
        { title: "Date", field: "fromdate" },
        { title: "Time", field: "time" },
        { title: "Category", field: "filename" },
        { title: "SubCategory", field: "category" },
        { title: "Identifier", field: "unitid" },
        { title: "Login Id", field: "user" },
        { title: "Section", field: "section" },
        { title: "Flag Count", field: "flagcount" },
        { title: "Doc Number", field: "docnumber" },
        { title: "Doc Link", field: "doclink" },
        { title: "Start Date Mode", field: "startmode" },
        { title: "Start Date", field: "startdate" },
        { title: "Start Time", field: "starttime" },
        { title: "Status Mode", field: "statusmode" },
        { title: "Total Pages", field: "totalpages" },
        { title: "Pending Pages", field: "pendingpages" },
        { title: "Start Page", field: "startpage" },
        { title: "Remarks/Notes", field: "notes" },
        { title: "Approval Status", field: "approvalstatus" },
        { title: "Late Entry Status", field: "lateentrystatus" },

    ];

    // Excel
    const downloadPdf = (isfilter) => {
        setLoadingPdfExport(true);  // Start loader
        const doc = new jsPDF();

        let serialNumberCounter = 1;
        const columnsWithSerial = [
            { title: "SNo", dataKey: "serialNumber" },
            ...columns.map((col) => ({ ...col, dataKey: col.field })),
        ];

        axios.post(SERVICE.PRODUCTION_INDIVIDUALMANUAL_EXCEL_OVERALL, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            companyname: isUserRoleAccess.companyname,
            role: isUserRoleAccess.role,
            statusmode: ["Pause", "Stop", "In Complete", "Partial Complete"]
        })
            .then(response => {
                const result = response.data.result.map((t, index) => ({
                    serialNumber: index + 1,
                    vendor: t.vendor,
                    datemode: t.datemode,
                    fromdate: moment(t.fromdate).format("DD/MM/YYYY"),
                    time: t.time,
                    filename: t.filename,
                    category: t.category,
                    unitid: t.unitid,
                    user: t.user,
                    section: t.section,
                    flagcount: t.flagcount,
                    docnumber: t.docnumber,
                    doclink: t.doclink,
                    approvalstatus: t.approvalstatus,
                    lateentrystatus: t.lateentrystatus,

                    startmode: t.startmode,
                    startdate: moment(t.startdate).format("DD/MM/YYYY"),
                    starttime: t.starttime,
                    statusmode: t.statusmode === "Please Select Status" ? "" : t.statusmode,
                    totalpages: t.totalpages,
                    flagcount: t.flagcount,
                    startpage: t.startpage === "Please Select Start Page" ? "" : t.startpage,
                    pendingpages: t.pendingpages,
                    reason: t.reason,
                    notes: t.notes,
                }));

                const dataWithSerial = isfilter === "filtered"
                    ? rowDataTable.map(row => ({ ...row, serialNumber: serialNumberCounter++ }))
                    : result;

                doc.autoTable({
                    theme: "grid",
                    styles: {
                        fontSize: 4,
                        cellWidth: "auto"
                    },
                    columns: columnsWithSerial,
                    body: dataWithSerial,
                });

                doc.save("Pending Manual Entry List.pdf");
            })
            .catch(error => {
                console.error('Error:', error);
            })
            .finally(() => {
                setIsFilterOpen(false);
                setLoadingPdfExport(false); // Stop loader // Stop loader
            });
    };



    const fileName = "Pending Manual Entry List";


    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Pending Manual Entry List",
        pageStyle: "print",
    });

    const addSerialNumber = (datas) => {
        // const itemsWithSerialNumber = datas?.map((item, index) => ({
        //     ...item,
        //     // id: item._id,
        //     serialNumber: index + 1,
        // }));
        setItems(datas);
    };
    useEffect(() => {
        addSerialNumber(projmaster);
    }, [projmaster]);


    //Datatable
    const handlePageChange = (newPage) => {
        setPage(newPage);
        setSelectedRows([]);
        setSelectAllChecked(false);
    };

    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setSelectedRows([]);
        setSelectAllChecked(false);
        // setPage(1);
    };

    //datatable....
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setFilterValue(event.target.value);
        setPage(1);
    };

    // Split the search query into individual terms
    const searchTerms = searchQuery.toLowerCase().split(" ");

    // Modify the filtering logic to check each term
    const filteredDatas = items?.filter((item) => {
        return searchTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
    });

    const filteredData = overallFilterdata?.slice((page - 1) * pageSize, page * pageSize);
    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        };
    }, []);

    const [selectAllChecked, setSelectAllChecked] = useState(false);

    const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
        <div>
            <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
        </div>
    );

    const columnDataTable = [
        {
            field: "checkbox",
            headerName: "", // Default header name
            headerStyle: {
                fontWeight: "bold",
            },
            sortable: false,
            width: 90,
            filter: false,
            headerCheckboxSelection: true,
            checkboxSelection: true,
            hide: !columnVisibility.checkbox,
            headerClassName: "bold-header",
            pinned: "left",
            lockPinned: true,
        },

        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 100,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
            pinned: "left",
            lockPinned: true,
        },
        {
            field: "vendor", headerName: "Vendor", flex: 0, width: 150, hide: !columnVisibility.vendor, headerClassName: "bold-header", pinned: "left",
            lockPinned: true,
        },
        {
            field: "datemode", headerName: "Date Mode", flex: 0, width: 150, hide: !columnVisibility.datemode, headerClassName: "bold-header", pinned: "left",
            lockPinned: true,
        },
        {
            field: "fromdate", headerName: "Date", flex: 0, width: 150, hide: !columnVisibility.fromdate, headerClassName: "bold-header", pinned: "left",
            lockPinned: true,
        },
        { field: "time", headerName: "Time", flex: 0, width: 150, hide: !columnVisibility.time, headerClassName: "bold-header" },
        { field: "filename", headerName: "Category", flex: 0, width: 150, hide: !columnVisibility.filename, headerClassName: "bold-header" },
        { field: "category", headerName: "SubCategory", flex: 0, width: 150, hide: !columnVisibility.category, headerClassName: "bold-header" },
        { field: "unitid", headerName: "Identifier", flex: 0, width: 150, hide: !columnVisibility.unitid, headerClassName: "bold-header" },
        { field: "user", headerName: "Login Id", flex: 0, width: 150, hide: !columnVisibility.user, headerClassName: "bold-header" },
        { field: "section", headerName: "Section", flex: 0, width: 150, hide: !columnVisibility.section, headerClassName: "bold-header" },
        { field: "flagcount", headerName: "Flag Count", flex: 0, width: 150, hide: !columnVisibility.flagcount, headerClassName: "bold-header" },
        { field: "alllogin", headerName: "All Login", flex: 0, width: 150, hide: !columnVisibility.alllogin, headerClassName: "bold-header" },
        { field: "docnumber", headerName: "Doc Number", flex: 0, width: 150, hide: !columnVisibility.docnumber, headerClassName: "bold-header" },
        { field: "doclink", headerName: "Doc Link", flex: 0, width: 150, hide: !columnVisibility.doclink, headerClassName: "bold-header" },


        { field: "startmode", headerName: "Start Mode", flex: 0, width: 150, hide: !columnVisibility.startmode, headerClassName: "bold-header" },
        { field: "startdate", headerName: "Start Date", flex: 0, width: 150, hide: !columnVisibility.startdate, headerClassName: "bold-header" },
        { field: "starttime", headerName: "Start Time", flex: 0, width: 150, hide: !columnVisibility.starttime, headerClassName: "bold-header" },
        { field: "statusmode", headerName: "Status Mode", flex: 0, width: 150, hide: !columnVisibility.statusmode, headerClassName: "bold-header" },

        { field: "totalpages", headerName: "Total Pages", flex: 0, width: 150, hide: !columnVisibility.totalpages, headerClassName: "bold-header" },
        { field: "pendingpages", headerName: "Pending Pages", flex: 0, width: 150, hide: !columnVisibility.pendingpages, headerClassName: "bold-header" },
        { field: "startpage", headerName: "Start Page", flex: 0, width: 150, hide: !columnVisibility.startpage, headerClassName: "bold-header" },
        { field: "notes", headerName: "Remark/Notes", flex: 0, width: 150, hide: !columnVisibility.notes, headerClassName: "bold-header" },


        {
            field: "actionsstatus",
            headerName: "Status",
            flex: 0,
            width: 250,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.actionsstatus,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex", alignItems: "center" }}>
                    <Chip
                        sx={{ height: "25px", borderRadius: "0px" }}
                        color={"warning"}
                        variant="outlined"
                        label={params.data.approvalstatus}
                    />
                    &ensp;
                    <Chip
                        sx={{ height: "25px", borderRadius: "0px" }}
                        color={"success"}
                        variant="outlined"
                        label={params.data.lateentrystatus}
                    />
                </Grid>
            ),
        },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 350,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex", alignItems: "baseline" }}>

                    {(params.data.statusmode === "In Complete" || params.data.statusmode === "Partial Complete") ?
                        <Button
                            variant="contained"
                            size="small"
                            color="error"
                            onClick={() => {
                                getCode(params.data.id);
                            }}
                        >
                            Pending </Button>
                        : (params.data.statusmode === "Pause") ?
                            <Button
                                variant="contained"
                                size="small"
                                color="primary"
                                onClick={() => {
                                    getCode(params.data.id);
                                }}
                            >
                                PAUSE </Button> : (params.data.statusmode === "Stop") ?
                                <Button
                                    variant="contained"
                                    size="small"
                                    color="primary"
                                    onClick={() => {
                                        getCode(params.data.id);
                                    }}
                                >
                                    RESTART </Button> : ""
                    }
                    {isUserRoleCompare?.includes("vpendingmanualentrylist") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getviewCode(params.data.id);
                            }}
                        >
                            <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
                        </Button>
                    )}
                </Grid>
            ),
        },
    ];
    const filteredSelectedColumn = columnDataTable.filter(data => data.field !== 'checkbox' && data.field !== "actions" && data.field !== "serialNumber");

    const rowDataTable = items.map((item, index) => {

        return {
            id: item._id,
            serialNumber: item.serialNumber,
            vendor: item.vendor,
            datemode: item.datemode,
            fromdate: item.fromdate,
            time: item.time,
            filename: item.filename,
            category: item.category,
            unitid: item.unitid,
            user: item.user,
            section: item.section,
            flagcount: item.flagcount,
            alllogin: item.alllogin,
            docnumber: item.docnumber,
            doclink: item.doclink,
            approvalstatus: item.approvalstatus,
            lateentrystatus: item.lateentrystatus,
            startmode: item.startmode,
            startdate: item.startdate,
            starttime: item.starttime,
            statusmode: item.statusmode,
            totalpages: item.totalpages,
            flagcount: item.flagcount,
            startpage: item.startpage,
            pendingpages: item.pendingpages,
            reason: item.reason,
            enddate: item.enddate,
            endtime: item.endtime,
            notes: item.notes,

        };
    });
    const rowsWithCheckboxes = rowDataTable.map((row) => ({
        ...row,
        // Create a custom field for rendering the checkbox
        checkbox: selectedRows.includes(row.id),
    }));

    // Show All Columns functionality
    const handleShowAllColumns = () => {
        const updatedVisibility = { ...columnVisibility };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibility(updatedVisibility);
    };

    // // Function to filter columns based on search query
    const filteredColumns = columnDataTable.filter((column) => column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase()));
    // Manage Columns functionality
    const toggleColumnVisibility = (field) => {
        setColumnVisibility((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };

    // JSX for the "Manage Columns" popover content
    const manageColumnsContent = (
        <Box style={{ padding: "10px", minWidth: "325px", "& .MuiDialogContent-root": { padding: "10px 0" } }}>
            <Typography variant="h6">Manage Columns</Typography>
            <IconButton
                aria-label="close"
                onClick={handleCloseManageColumns}
                sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>
            <Box sx={{ position: "relative", margin: "10px" }}>
                <TextField label="Find column" variant="standard" fullWidth value={searchQueryManage} onChange={(e) => setSearchQueryManage(e.target.value)} sx={{ marginBottom: 5, position: "absolute" }} />
            </Box>
            <br />
            <br />
            <DialogContent sx={{ minWidth: "auto", height: "200px", position: "relative" }}>
                <List sx={{ overflow: "auto", height: "100%" }}>
                    {filteredColumns.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText
                                sx={{ display: "flex" }}
                                primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibility[column.field]} onChange={() => toggleColumnVisibility(column.field)} />}
                                secondary={column.field === "checkbox" ? "Checkbox" : column.headerName}
                            // secondary={column.headerName }
                            />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Grid container>
                    <Grid item md={4}>
                        <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibility(initialColumnVisibility)}>
                            Show All
                        </Button>
                    </Grid>
                    <Grid item md={4}></Grid>
                    <Grid item md={4}>
                        <Button
                            variant="text"
                            sx={{ textTransform: "none" }}
                            onClick={() => {
                                const newColumnVisibility = {};
                                columnDataTable.forEach((column) => {
                                    newColumnVisibility[column.field] = false; // Set hide property to true
                                });
                                setColumnVisibility(newColumnVisibility);
                            }}
                        >
                            Hide All
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Box>
    );

    useEffect(() => {
        fetchProductionIndividual();
    }, []);

    const [fileFormat, setFormat] = useState('')
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = fileFormat === "xl" ? '.xlsx' : '.csv';
    const exportToCSV = (csvData, fileName) => {
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    }

    const handleExportXL = async (isfilter) => {
        setloadingdeloverall(true); // Start loader here
        try {
            if (isfilter === "filtered") {
                exportToCSV(
                    rowDataTable?.map((t, index) => ({
                        Sno: index + 1,
                        "Vendor": t.vendor,
                        "Date Mode": t.datemode,
                        "Date": t.fromdate,
                        "Time": t.time,
                        "Category": t.filename,
                        "SubCategory": t.category,
                        "Identifier": t.unitid,
                        "Login Id": t.user,
                        "Section": t.section,
                        "Flag Count": t.flagcount,
                        "alllogin": t.alllogin,
                        "Doc Number": t.docnumber,
                        "Doc Link": t.doclink,
                        "Start Date Mode": t.startmode,
                        "Start Date": t.startdate,
                        "Start Time": t.starttime,
                        "Status Mode": t.statusmode,
                        "Total Pages": t.totalpages,
                        "Pending Pages": t.pendingpages,
                        "Start Page": t.startpage,
                        "Reamarks/Notes": t.notes,
                        "Approval Status": t.approvalstatus,
                        "Late Entry Status": t.lateentrystatus,
                    })),
                    fileName,
                );
                setIsFilterOpen(false);
            } else if (isfilter === "overall") {
                const response = await axios.post(SERVICE.PRODUCTION_INDIVIDUALMANUAL_EXCEL_OVERALL, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    companyname: isUserRoleAccess.companyname,
                    role: isUserRoleAccess.role,
                    statusmode: ["Pause", "Stop", "In Complete", "Partial Complete"]
                });

                const result = response.data.result.map((t, index) => ({
                    Sno: index + 1,
                    "Vendor": t.vendor,
                    "Date Mode": t.datemode,
                    "Date": moment(t.fromdate).format("DD/MM/YYYY"),
                    "Time": t.time,
                    "Category": t.filename,
                    "SubCategory": t.category,
                    "Identifier": t.unitid,
                    "Login Id": t.user,
                    "Section": t.section,
                    "Flag Count": t.flagcount,
                    "alllogin": t.alllogin,
                    "Doc Number": t.docnumber,
                    "Doc Link": t.doclink,
                    "Start Date Mode": t.startmode,
                    "Start Date": moment(t.startdate).format("DD/MM/YYYY"),
                    "Start Time": t.starttime,
                    "Status Mode": t.statusmode === "Please Select Status" ? "" : t.statusmode,
                    "Total Pages": t.totalpages,
                    "Pending Pages": t.pendingpages,
                    "Start Page": t.startpage === "Please Select Start Page" ? "" : t.startpage,
                    "Reamarks/Notes": t.notes,
                    "Approval Status": t.approvalstatus,
                    "Late Entry Status": t.lateentrystatus
                }));

                await exportToCSV(result, fileName); // Wait for the export to complete
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setloadingdeloverall(false); // Stop loader when done or on error
            setIsFilterOpen(false);
        }
    };

    const [refImageedit, setRefImageedit] = useState([]);
    const [previewURLedit, setPreviewURLedit] = useState(null);
    const [refImageDragedit, setRefImageDragedit] = useState([]);
    const [valNumedit, setValNumedit] = useState(0);
    const [isWebcamOpenedit, setIsWebcamOpenedit] = useState(false);
    const [capturedImagesedit, setCapturedImagesedit] = useState([]);
    const [getImgedit, setGetImgedit] = useState(null);
    const webcamOpenedit = () => {
        setIsWebcamOpenedit(true);
    };
    const webcamCloseedit = () => {
        setIsWebcamOpenedit(false);
        setGetImgedit("");
    };
    const webcamDataStoreedit = () => {
        webcamCloseedit();
        setGetImgedit("");
    };
    const showWebcamedit = () => {
        webcamOpenedit();
    };
    const [uploadPopupOpenedit, setUploadPopupOpenedit] = useState(false);
    const handleClickUploadPopupOpenedit = () => {
        setUploadPopupOpenedit(true);
    };
    const handleUploadPopupCloseedit = () => {
        setUploadPopupOpenedit(false);
        setGetImgedit("");
        setRefImageedit([]);
        setPreviewURLedit(null);
        setRefImageDragedit([]);
        setCapturedImagesedit([]);
    };
    const handleInputChangeedit = (event) => {
        const files = event.target.files;
        let newSelectedFiles = [...refImageedit];

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
                    setRefImageedit(newSelectedFiles);
                };
                reader.readAsDataURL(file);
            } else {
                setPopupContentMalert("Only Accept Images!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
        }
    };

    let combinedArray = allUploadedFilesedit.concat(
        refImageedit,
        refImageDragedit,
        capturedImagesedit
    );
    let uniqueValues = {};
    let resultArray = combinedArray.filter((item) => {
        if (!uniqueValues[item.name]) {
            uniqueValues[item.name] = true;
            return true;
        }
        return false;
    });

    //first deletefile
    const handleDeleteFileedit = (index) => {
        const newSelectedFiles = [...refImageedit];
        newSelectedFiles.splice(index, 1);
        setRefImageedit(newSelectedFiles);
    };

    const renderFilePreviewedit = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };
    const resetImageedit = () => {
        setGetImgedit("");
        setRefImageedit([]);
        setPreviewURLedit(null);
        setRefImageDragedit([]);
        setCapturedImagesedit([]);
    };
    const handleDragOveredit = (event) => { };
    const handleDropedit = (event) => {
        event.preventDefault();
        previewFileedit(event.dataTransfer.files[0]);
        const files = event.dataTransfer.files;
        let newSelectedFilesDrag = [...refImageDragedit];
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
                    setRefImageDragedit(newSelectedFilesDrag);
                };
                reader.readAsDataURL(file);
            } else {
                setPopupContentMalert("Only Accept Images!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
        }
    };
    const handleUploadOverAlledit = () => {
        setUploadPopupOpenedit(false);
    };
    const previewFileedit = (file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewURLedit(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };
    const handleRemoveFileedit = (index) => {
        const newSelectedFiles = [...refImageDragedit];
        newSelectedFiles.splice(index, 1);
        setRefImageDragedit(newSelectedFiles);
    };



    // Search bar
    const [anchorElSearch, setAnchorElSearch] = React.useState(null);
    const handleClickSearch = (event) => {
        setAnchorElSearch(event.currentTarget);
        localStorage.removeItem("filterModel");
    };
    const handleCloseSearch = () => {
        setAnchorElSearch(null);
        setSearchQuery("");
    };

    const openSearch = Boolean(anchorElSearch);
    const idSearch = openSearch ? 'simple-popover' : undefined;

    const handleAddFilter = () => {
        if (selectedColumn && filterValue || ["Blank", "Not Blank"].includes(selectedCondition)) {
            setAdditionalFilters([
                ...additionalFilters,
                { column: selectedColumn, condition: selectedCondition, value: filterValue }
            ]);
            setSelectedColumn("");
            setSelectedCondition("Contains");
            setFilterValue("");
        }
    };

    // Show filtered combination in the search bar
    const getSearchDisplay = () => {
        if (advancedFilter && advancedFilter.length > 0) {
            return advancedFilter.map((filter, index) => {
                let showname = columnDataTable.find(col => col.field === filter.column)?.headerName;
                return `${showname} ${filter.condition} "${filter.value}"`;
            }).join(' ' + (advancedFilter.length > 1 ? advancedFilter[1].condition : '') + ' ');
        }
        return searchQuery;
    };

    // Disable the search input if the search is active
    const isSearchDisabled = isSearchActive || additionalFilters.length > 0;

    const handleResetSearch = async () => {
        setLoading(true);

        // Reset all filters and pagination state
        setAdvancedFilter(null);
        setAdditionalFilters([]);
        setSearchQuery("");
        setIsSearchActive(false);
        setSelectedColumn("");
        setSelectedCondition("Contains");
        setFilterValue("");
        setLogicOperator("AND");
        setFilteredChanges(null);

        const queryParams = {
            page: Number(page),
            pageSize: Number(pageSize),
            // searchTerm: searchQuery,
            companyname: isUserRoleAccess.companyname,
            role: isUserRoleAccess.role,
            statusmode: ["Pause", "Stop", "In Complete", "Partial Complete"]
        };

        const allFilters = [];
        // Only include advanced filters if they exist, otherwise just use regular searchQuery
        if (allFilters.length > 0 && selectedColumn !== "") {
            queryParams.allFilters = allFilters
            queryParams.logicOperator = logicOperator;
        } else if (searchQuery) {
            queryParams.searchQuery = searchQuery;  // Use searchQuery for regular search
        }

        setPageName(!pageName)
        setLoading(true)
        try {
            let res_employee = await axios.post(SERVICE.PRODUCTION_INDIVIDUAL_MANUALSTATUS, queryParams, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const ans = res_employee?.data?.result?.length > 0 ? res_employee?.data?.result : []

            let res1 = await axios.get(SERVICE.GET_ATTENDANCE_CONTROL_CRITERIA_LAST_INDEX);
            let dataFromControlPanel = res1?.data?.attendancecontrolcriteria;


            const itemsWithSerialNumber = ans?.map((item, index) => {

                const fromDate = new Date(item.createdAt);

                const fromDaten = new Date(`${item.fromdate}T${item.time}:00`);

                let approvaldays = Number(dataFromControlPanel.approvalstatusDays) > 0 ? Number(dataFromControlPanel.approvalstatusDays) * 24 : 1
                let approvalhours = Number(dataFromControlPanel.approvalstatusHour) > 0 ? Number(dataFromControlPanel.approvalstatusHour) * 60 : 1
                let approvalmins = Number(dataFromControlPanel.approvalstatusMin) > 0 ? Number(dataFromControlPanel.approvalstatusMin) * 60 : 1

                let entrydays = Number(dataFromControlPanel.entrystatusDays) > 0 ? Number(dataFromControlPanel.entrystatusDays) * 24 : 1
                let entryhours = Number(dataFromControlPanel.entrystatusHour) > 0 ? Number(dataFromControlPanel.entrystatusHour) * 60 : 1
                let entrymins = Number(dataFromControlPanel.entrystatusMin) > 0 ? Number(dataFromControlPanel.entrystatusMin) * 60 : 1
                const fromDatePlus48Hours = new Date(fromDaten.getTime() + approvaldays * approvalhours * approvalmins * 1000);
                const currentDateTime = new Date();

                const fromDatePlus24Hours = new Date(fromDate.getTime() + entrydays * entryhours * entrymins * 1000);

                return {
                    ...item,
                    serialNumber: (page - 1) * pageSize + index + 1,
                    notes: (item.notes === "" || item.notes === undefined || item.notes === "undefined") ? "" : item.notes,
                    fromdate: (item.fromdate === "" || item.fromdate === undefined || item.fromdate === "undefined") ? "" : moment(item.fromdate).format("DD/MM/YYYY"),
                    startdate: (item.startdate === "" || item.startdate === undefined || item.startdate === "undefined") ? "" : moment(item.startdate).format("DD/MM/YYYY"),
                    statusmode: item.statusmode === "Please Select Status" ? "" : item.statusmode,
                    startpage: item.startpage === "Please Select Start Page" ? "" : item.startpage,
                    lateentrystatus: (fromDate > fromDatePlus48Hours) ? "Late Entry" : "On Entry",
                    approvalstatus: (item.approvaldate === "" || item.approvaldate === null || item.approvaldate === undefined) && item.status === "Approved" ? "" :
                        ((new Date() <= fromDatePlus24Hours) && (item.approvaldate === "" || item.approvaldate === null || item.approvaldate === undefined)) ? "Pending" :
                            ((new Date() > fromDatePlus24Hours) && (item.approvaldate === "" || item.approvaldate === null || item.approvaldate === undefined)) ? "Late Not Approval" :
                                ((new Date(item.approvaldate) > fromDatePlus24Hours) && item.approvaldate) ? "Late Approval" :
                                    "On Approval"
                }
            });


            setProjmaster(itemsWithSerialNumber);
            setItems(itemsWithSerialNumber);
            setOverallFilterdata(res_employee?.data?.totalProjectsData?.length > 0 ?
                res_employee?.data?.totalProjectsData?.map((item, index) => {
                    const fromDate = new Date(item.createdAt);

                    const fromDaten = new Date(`${item.fromdate}T${item.time}:00`);

                    let approvaldays = Number(dataFromControlPanel.approvalstatusDays) > 0 ? Number(dataFromControlPanel.approvalstatusDays) * 24 : 1
                    let approvalhours = Number(dataFromControlPanel.approvalstatusHour) > 0 ? Number(dataFromControlPanel.approvalstatusHour) * 60 : 1
                    let approvalmins = Number(dataFromControlPanel.approvalstatusMin) > 0 ? Number(dataFromControlPanel.approvalstatusMin) * 60 : 1

                    let entrydays = Number(dataFromControlPanel.entrystatusDays) > 0 ? Number(dataFromControlPanel.entrystatusDays) * 24 : 1
                    let entryhours = Number(dataFromControlPanel.entrystatusHour) > 0 ? Number(dataFromControlPanel.entrystatusHour) * 60 : 1
                    let entrymins = Number(dataFromControlPanel.entrystatusMin) > 0 ? Number(dataFromControlPanel.entrystatusMin) * 60 : 1
                    const fromDatePlus48Hours = new Date(fromDaten.getTime() + approvaldays * approvalhours * approvalmins * 1000);
                    const currentDateTime = new Date();

                    const fromDatePlus24Hours = new Date(fromDate.getTime() + entrydays * entryhours * entrymins * 1000);


                    return {
                        ...item,
                        fromdate: (item.fromdate === "" || item.fromdate === undefined || item.fromdate === "undefined") ? "" : moment(item.fromdate).format("DD/MM/YYYY"),
                        startdate: (item.startdate === "" || item.startdate === undefined || item.startdate === "undefined") ? "" : moment(item.startdate).format("DD/MM/YYYY"),
                        statusmode: item.statusmode === "Please Select Status" ? "" : item.statusmode,
                        startpage: item.startpage === "Please Select Start Page" ? "" : item.startpage,
                        lateentrystatus: (fromDate > fromDatePlus48Hours) ? "Late Entry" : "On Entry",
                        approvalstatus: (item.approvaldate === "" || item.approvaldate === null || item.approvaldate === undefined) && item.status === "Approved" ? "" :
                            ((new Date() <= fromDatePlus24Hours) && (item.approvaldate === "" || item.approvaldate === null || item.approvaldate === undefined)) ? "Pending" :
                                ((new Date() > fromDatePlus24Hours) && (item.approvaldate === "" || item.approvaldate === null || item.approvaldate === undefined)) ? "Late Not Approval" :
                                    ((new Date(item.approvaldate) > fromDatePlus24Hours) && item.approvaldate) ? "Late Approval" :
                                        "On Approval"

                    }
                }

                ) : []
            );
            setTotalProjects(ans?.length > 0 ? res_employee?.data?.totalProjects : 0);
            setTotalPages(ans?.length > 0 ? res_employee?.data?.totalPages : 0);
            setPageSize((data) => { return ans?.length > 0 ? data : 10 });
            setPage((data) => { return ans?.length > 0 ? data : 1 });


            setLoading(false)
        } catch (err) { setLoading(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };







    return (
        <Box>
            <Headtitle title={"Pending Manual Entry List"} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Pending Manual Entry List"
                modulename="Production"
                submodulename="Manual Entry"
                mainpagename="Pending Manual Entry List"
                subpagename=""
                subsubpagename=""
            />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lpendingmanualentrylist") && (
                <>
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Pending Manual Entry List</Typography>
                        </Grid>
                        <Grid container spacing={2} style={userStyle.dataTablestyle}>
                            <Grid item md={2} xs={12} sm={12}>
                                <Box>
                                    <label>Show entries:</label>
                                    <Select
                                        id="pageSizeSelect"
                                        value={pageSize}
                                        MenuProps={{
                                            PaperProps: {
                                                style: {
                                                    maxHeight: 180,
                                                    width: 80,
                                                },
                                            },
                                        }}
                                        onChange={handlePageSizeChange}
                                        sx={{ width: "77px" }}
                                    >
                                        <MenuItem value={1}>1</MenuItem>
                                        <MenuItem value={5}>5</MenuItem>
                                        <MenuItem value={10}>10</MenuItem>
                                        <MenuItem value={25}>25</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
                                        <MenuItem value={100}>100</MenuItem>
                                        <MenuItem value={totalProjects}>All</MenuItem>
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Box>
                                    {isUserRoleCompare?.includes("excelpendingmanualentrylist") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvpendingmanualentrylist") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printpendingmanualentrylist") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfpendingmanualentrylist") && (
                                        <>
                                            <Button
                                                sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true)
                                                }}
                                            >
                                                <FaFilePdf />
                                                &ensp;Export to PDF&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imagependingmanualentrylist") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                                                {" "}
                                                <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                                            </Button>
                                        </>
                                    )}
                                </Box>
                            </Grid>
                            <Grid item md={2} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <OutlinedInput size="small"
                                        id="outlined-adornment-weight"
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <FaSearch />
                                            </InputAdornment>
                                        }
                                        endAdornment={
                                            <InputAdornment position="end">
                                                {advancedFilter && (
                                                    <IconButton onClick={handleResetSearch}>
                                                        <MdClose />
                                                    </IconButton>
                                                )}
                                                <Tooltip title="Show search options">
                                                    <span>
                                                        <IoMdOptions style={{ cursor: 'pointer', }} onClick={handleClickSearch} />
                                                    </span>
                                                </Tooltip>
                                            </InputAdornment>}
                                        aria-describedby="outlined-weight-helper-text"
                                        inputProps={{ 'aria-label': 'weight', }}
                                        type="text"
                                        value={getSearchDisplay()}
                                        onChange={handleSearchChange}
                                        placeholder="Type to search..."
                                        disabled={!!advancedFilter}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br />
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
                            Show All Columns
                        </Button>
                        &ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
                            Manage Columns
                        </Button>
                        &ensp;
                        <br />

                        {loading ? (
                            <>
                                <Box sx={{ display: "flex", justifyContent: "center" }}>

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
                            </>
                        ) : (
                            <>

                                {/* <AggridTable
                                    rowDataTable={rowDataTable}
                                    columnDataTable={columnDataTable}
                                    columnVisibility={columnVisibility}
                                    page={page}
                                    setPage={setPage}
                                    pageSize={pageSize}
                                    totalPages={totalPages}
                                    setColumnVisibility={setColumnVisibility}
                                    isHandleChange={isHandleChange}
                                    items={items}
                                    selectedRows={selectedRows}
                                    setSelectedRows={setSelectedRows}
                                    gridRefTable={gridRefTable}
                                    paginated={true}
                                    filteredDatas={filteredDatas}
                                    totalDatas={totalProjects}
                                    searchQuery={searchQuery}
                                    handleShowAllColumns={handleShowAllColumns}
                                    setFilteredRowData={setFilteredRowData}
                                    filteredRowData={filteredRowData}
                                    setFilteredChanges={setFilteredChanges}
                                    filteredChanges={filteredChanges}
                                    gridRefTableImg={gridRefTableImg}
                                    itemsList={totalProjectsData}
                                /> */}
                                <AggridTableForPaginationTable
                                    rowDataTable={rowDataTable}
                                    columnDataTable={columnDataTable}
                                    columnVisibility={columnVisibility}
                                    page={page}
                                    setPage={setPage}
                                    pageSize={pageSize}
                                    totalPages={totalPages}
                                    setColumnVisibility={setColumnVisibility}
                                    selectedRows={selectedRows}
                                    setSelectedRows={setSelectedRows}
                                    gridRefTable={gridRefTable}
                                    totalDatas={totalProjects}
                                    setFilteredRowData={setFilteredRowData}
                                    filteredRowData={filteredRowData}
                                    gridRefTableImg={gridRefTableImg}
                                    itemsList={overallFilterdata}
                                />

                            </>)}
                        {/* ****** Table End ****** */}
                    </Box>
                </>
            )}
            {/* ****** Table End ****** */}

            {/* Manage Column */}
            <Popover
                id={idSearch}
                open={openSearch}
                anchorEl={anchorElSearch}
                onClose={handleCloseSearch}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }}
            >
                <Box style={{ padding: "10px", maxWidth: '450px' }}>
                    <Typography variant="h6">Advance Search</Typography>
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseSearch}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <DialogContent sx={{ width: "100%" }}>
                        <Box sx={{
                            width: '350px',
                            maxHeight: '400px',
                            overflow: 'hidden',
                            position: 'relative'
                        }}>
                            <Box sx={{
                                maxHeight: '300px',
                                overflowY: 'auto',
                                // paddingRight: '5px'
                            }}>
                                <Grid container spacing={1}>
                                    <Grid item md={12} sm={12} xs={12}>
                                        <Typography>Columns</Typography>
                                        <Select fullWidth size="small"
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 200,
                                                        width: "auto",
                                                    },
                                                },
                                            }}
                                            style={{ minWidth: 150 }}
                                            value={selectedColumn}
                                            onChange={(e) => setSelectedColumn(e.target.value)}
                                            displayEmpty
                                        >
                                            <MenuItem value="" disabled>Select Column</MenuItem>
                                            {filteredSelectedColumn.map((col) => (
                                                <MenuItem key={col.field} value={col.field}>
                                                    {col.headerName}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </Grid>
                                    <Grid item md={12} sm={12} xs={12}>
                                        <Typography>Operator</Typography>
                                        <Select fullWidth size="small"
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 200,
                                                        width: "auto",
                                                    },
                                                },
                                            }}
                                            style={{ minWidth: 150 }}
                                            value={selectedCondition}
                                            onChange={(e) => setSelectedCondition(e.target.value)}
                                            disabled={!selectedColumn}
                                        >
                                            {conditions.map((condition) => (
                                                <MenuItem key={condition} value={condition}>
                                                    {condition}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </Grid>
                                    <Grid item md={12} sm={12} xs={12}>
                                        <Typography>Value</Typography>
                                        <TextField fullWidth size="small"
                                            value={["Blank", "Not Blank"].includes(selectedCondition) ? "" : filterValue}
                                            onChange={(e) => setFilterValue(e.target.value)}
                                            disabled={["Blank", "Not Blank"].includes(selectedCondition)}
                                            placeholder={["Blank", "Not Blank"].includes(selectedCondition) ? "Disabled" : "Enter value"}
                                            sx={{
                                                '& .MuiOutlinedInput-root.Mui-disabled': {
                                                    backgroundColor: 'rgb(0 0 0 / 26%)',
                                                },
                                                '& .MuiOutlinedInput-input.Mui-disabled': {
                                                    cursor: 'not-allowed',
                                                },
                                            }}
                                        />
                                    </Grid>
                                    {additionalFilters.length > 0 && (
                                        <>
                                            <Grid item md={12} sm={12} xs={12}>
                                                <RadioGroup
                                                    row
                                                    value={logicOperator}
                                                    onChange={(e) => setLogicOperator(e.target.value)}
                                                >
                                                    <FormControlLabel value="AND" control={<Radio />} label="AND" />
                                                    <FormControlLabel value="OR" control={<Radio />} label="OR" />
                                                </RadioGroup>
                                            </Grid>
                                        </>
                                    )}
                                    {additionalFilters.length === 0 && (
                                        <Grid item md={4} sm={12} xs={12} >
                                            <Button variant="contained" onClick={handleAddFilter} sx={{ textTransform: "capitalize" }} disabled={["Blank", "Not Blank"].includes(selectedCondition) ? false : !filterValue || selectedColumn.length === 0}>
                                                Add Filter
                                            </Button>
                                        </Grid>
                                    )}

                                    <Grid item md={2} sm={12} xs={12}>
                                        <Button variant="contained" onClick={() => {
                                            fetchEmployee();
                                            setIsSearchActive(true);
                                            setAdvancedFilter([
                                                ...additionalFilters,
                                                { column: selectedColumn, condition: selectedCondition, value: filterValue }
                                            ])
                                        }} sx={{ textTransform: "capitalize" }} disabled={["Blank", "Not Blank"].includes(selectedCondition) ? false : !filterValue || selectedColumn.length === 0}>
                                            Search
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </DialogContent>
                </Box>
            </Popover>

            {/* view model */}
            <Dialog
                open={openview}
                onClose={handleClickOpenview}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="lg"
                sx={{ marginTop: "95px" }}
            >
                <Box sx={{ padding: '20px 50px' }}>
                    <>
                        <Typography sx={userStyle.HeaderText}> View Pending Manual Entry</Typography>
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        <b>   Vendor</b>
                                    </Typography>
                                    <Typography>
                                        {productionedit.vendor}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            {productionedit?.creationstatus != "" || undefined ? (
                                <>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                <b>  Start Date Mode</b>
                                            </Typography>
                                            <Typography>
                                                {productionedit.startmode}
                                            </Typography>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} sm={6} xs={12}>
                                        <Grid container spacing={2}>
                                            <Grid item md={6} sm={6} xs={12}>
                                                <Typography>
                                                    <b>  Start Date</b>
                                                </Typography>
                                                <Typography>
                                                    {moment(productionedit.startdate).format("DD/MM/YYYY")}

                                                </Typography>
                                            </Grid>
                                            <Grid item md={6} sm={6} xs={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        <b>   Start Time</b>
                                                    </Typography>
                                                    <Typography>
                                                        {productionedit.starttime}

                                                    </Typography>
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </>
                            ) : (
                                <>
                                    <Grid item md={4} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                <b>   Date Mode</b>
                                            </Typography>
                                            <Typography>
                                                {productionedit.datemode}
                                            </Typography>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} sm={6} xs={12}>
                                        <Grid container spacing={2}>
                                            <Grid item md={6} sm={6} xs={12}>
                                                <Typography>
                                                    <b>    Date</b>
                                                </Typography>
                                                <Typography>
                                                    {moment(productionedit.fromdate).format("DD/MM/YYYY")}

                                                </Typography>
                                            </Grid>
                                            <Grid item md={6} sm={6} xs={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        <b>    Time</b>
                                                    </Typography>
                                                    <Typography>
                                                        {productionedit.time}

                                                    </Typography>
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </>
                            )}
                            <Grid item md={4} sm={6} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        <b>   Category</b>
                                    </Typography>
                                    <Typography>
                                        {productionedit.filename}

                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} sm={6} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        <b>    Sub Category</b>
                                    </Typography>
                                    <Typography>
                                        {productionedit.category}

                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} sm={6} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        <b>    Identifier</b>
                                    </Typography>
                                    <Typography>
                                        {productionedit.unitid}

                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} sm={6} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        <b>    Login Id</b>
                                    </Typography>
                                    <Typography>
                                        {productionedit.user}

                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} sm={6} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        <b>    All Login</b>
                                    </Typography>
                                    <Typography>
                                        {productionedit.alllogin}

                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} sm={6} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        <b>    Section</b>
                                    </Typography>
                                    <Typography>
                                        {productionedit.section}

                                    </Typography>
                                </FormControl>
                            </Grid>
                            {productionedit?.creationstatus && (
                                <>
                                    <Grid item md={4} sm={6} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                <b>Total Pages</b>
                                            </Typography>
                                            <Typography>
                                                {productionedit.totalpages}

                                            </Typography>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} sm={6} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                <b>Completed Pages</b>
                                            </Typography>
                                            <Typography>
                                                {productionedit.flagcount}

                                            </Typography>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} sm={6} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                <b>Pending Pages</b>
                                            </Typography>
                                            <Typography>
                                                {productionedit.pendingpages}

                                            </Typography>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} sm={6} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                <b>Start Page</b>
                                            </Typography>
                                            <Typography>
                                                {productionedit.startpage}

                                            </Typography>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} sm={6} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                <b>Status</b>
                                            </Typography>
                                            <Typography>
                                                {productionedit.statusmode}

                                            </Typography>
                                        </FormControl>
                                    </Grid>
                                </>
                            )}

                            <Grid item md={4} sm={6} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        <b>   Doc Number</b>
                                    </Typography>
                                    <Typography>
                                        {productionedit.docnumber}

                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} sm={6} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        <b>       Doc Link</b>
                                    </Typography>
                                    <Typography>
                                        {productionedit.doclink}

                                    </Typography>
                                </FormControl>
                            </Grid>
                            {productionedit?.statusmode === "Completed" && (
                                <>
                                    <Grid item md={4} sm={6} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                <b> End Date Mode</b>
                                            </Typography>
                                            <Typography>
                                                {productionedit.enddatemode}

                                            </Typography>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} sm={6} xs={12}>
                                        <Grid container spacing={2}>
                                            <Grid item md={6} sm={6} xs={12}>
                                                <Typography>
                                                    <b>  End  Date</b>
                                                </Typography>
                                                <Typography>
                                                    {moment(productionedit.fromdate).format("DD/MM/YYYY")}

                                                </Typography>
                                            </Grid>
                                            <Grid item md={6} sm={6} xs={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        <b>  End  Time</b>
                                                    </Typography>
                                                    <Typography>
                                                        {productionedit.time}

                                                    </Typography>
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item md={6} sm={6} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                <b> Remarks</b>
                                            </Typography>
                                            <Typography>
                                                {productionedit.remarks}

                                            </Typography>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={6} sm={6} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                <b> Notes</b>
                                            </Typography>
                                            <Typography>
                                                {productionedit.notes}

                                            </Typography>
                                        </FormControl>
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <Typography>
                                            <b> Attachments</b>
                                        </Typography>
                                        {productionedit?.files?.map((file, index) => (
                                            <>
                                                <Grid container>
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
                                                                <img
                                                                    className={classes.preview}
                                                                    src={getFileIcon(file.name)}
                                                                    height="10"
                                                                    alt="file icon"
                                                                />
                                                            )}
                                                        </Box>
                                                    </Grid>
                                                    <Grid
                                                        item
                                                        md={8}
                                                        sm={8}
                                                        xs={8}
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
                                                                onClick={() => renderFilePreviewedit(file)}
                                                            >
                                                                <VisibilityOutlinedIcon
                                                                    style={{ fontsize: "12px", color: "#357AE8" }}
                                                                />
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </>
                                        ))}
                                    </Grid>
                                </>
                            )

                            }

                        </Grid>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={handleCloseview}>
                                {" "}
                                Back{" "}
                            </Button>
                        </Grid>
                    </>
                </Box>
            </Dialog>

            {/* ALERT DIALOG */}
            <Box>
                <Dialog open={isErrorOpenpop} onClose={handleCloseerrpop} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                        <Typography variant="h6">{showAlertpop}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="contained"
                            style={{ padding: "7px 13px", color: "white", background: "rgb(25, 118, 210)" }}
                            onClick={() => {
                                sendEditRequest();
                                handleCloseerrpop();
                            }}
                        >
                            ok
                        </Button>
                        <Button
                            style={{
                                backgroundColor: "#f4f4f4",
                                color: "#444",
                                boxShadow: "none",
                                borderRadius: "3px",
                                padding: "7px 13px",
                                border: "1px solid #0000006b",
                                "&:hover": {
                                    "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                                        backgroundColor: "#f4f4f4",
                                    },
                                },
                            }}
                            onClick={handleCloseerrpop}
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>

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
            <Box>
                {/* ALERT DIALOG */}
                <Dialog open={isDeleteOpenalert} onClose={handleCloseModalert} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "70px", color: "orange" }} />
                        <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
                            Please Select any Row
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus variant="contained" color="error" onClick={handleCloseModalert}>
                            {" "}
                            OK{" "}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
            {/*Export XL Data  */}
            <Dialog open={isFilterOpen} onClose={handleCloseFilterMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>

                    <IconButton
                        aria-label="close"
                        onClick={handleCloseFilterMod}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    {fileFormat === 'xl' ?
                        <FaFileExcel style={{ fontSize: "70px", color: "green" }} />
                        : <FaFileCsv style={{ fontSize: "70px", color: "green" }} />
                    }
                    <Typography variant="h5" sx={{ textAlign: "center" }}>
                        Choose Export
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        autoFocus variant="contained"
                        onClick={(e) => {
                            handleExportXL("filtered")
                        }}
                    >
                        Export Filtered Data
                    </Button>
                    <LoadingButton
                        autoFocus variant="contained"
                        onClick={(e) => {

                            handleExportXL("overall")

                        }}
                        loading={loadingdeloverall}
                        loadingPosition="end"
                    >
                        Export Over All Data
                    </LoadingButton>
                </DialogActions>
            </Dialog>
            {/*Export pdf Data  */}
            <Dialog open={isPdfFilterOpen} onClose={handleClosePdfFilterMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>
                    <IconButton
                        aria-label="close"
                        onClick={handleClosePdfFilterMod}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    <PictureAsPdfIcon sx={{ fontSize: "80px", color: "red" }} />
                    <Typography variant="h5" sx={{ textAlign: "center" }}>
                        Choose Export
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        onClick={(e) => {
                            downloadPdf("filtered")
                            setIsPdfFilterOpen(false);
                        }}
                    >
                        Export Filtered Data
                    </Button>
                    {/* <Button variant="contained"
                        onClick={(e) => {
                            downloadPdf("overall")
                            setIsPdfFilterOpen(false);
                        }}
                    >
                        Export Over All Data
                    </Button> */}
                    <LoadingButton
                        variant="contained"
                        onClick={(e) => {
                            downloadPdf("overall");
                            // setIsPdfFilterOpen(false);
                        }}
                        loading={loadingPdfExport}
                        loadingPosition="end"
                    >
                        Export Over All Data
                    </LoadingButton>
                </DialogActions>
            </Dialog>

            <Box>
                {/* Edit DIALOG */}
                <Dialog open={isEditOpen} onClose={handleCloseModEdit} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description"
                    fullWidth={true}
                    maxWidth="lg"
                    sx={{
                        overflow: "auto",
                        "& .MuiPaper-root": {
                            overflow: "auto",
                        },
                    }}

                >
                    <Box sx={{ padding: "20px" }}>
                        <>
                            <Grid container spacing={2}>
                                <Typography sx={userStyle.HeaderText}>Change Status <b style={{ color: "red" }}>Start Date&Time : {moment(ProducionIndividualChange.startdate).format("DD/MM/YYYY") + " " + ProducionIndividualChange.starttime}</b> </Typography>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Status <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={statuschange}
                                            styles={colourStyles}
                                            value={{ label: ProducionIndividualChange.statusmode, value: ProducionIndividualChange.statusmode }}
                                            onChange={(e) => {
                                                setProducionIndividualChange({ ...ProducionIndividualChange, statusmode: e.value });

                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                {(ProducionIndividualChange.statusmode === "Completed" || ProducionIndividualChange.statusmode === "In Complete" || ProducionIndividualChange.statusmode === "Partial Complete" || ProducionIndividualChange.statusmode === "Started" || ProducionIndividualChange.statusmode === "Stop" || ProducionIndividualChange.statusmode === "Pause") && (
                                    <>
                                        <Grid item md={2} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    End Date Mode <b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <Selects
                                                    options={datemodes}
                                                    styles={colourStyles}
                                                    value={{ label: ProducionIndividualChange.enddatemode, value: ProducionIndividualChange.enddatemode }}
                                                    onChange={(e) => {
                                                        setProducionIndividualChange({ ...ProducionIndividualChange, enddatemode: e.value });

                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4} sm={6} xs={12}>
                                            <Grid container spacing={2}>
                                                <Grid item md={6} sm={6} xs={12}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography>
                                                            End Date <b style={{ color: "red" }}>*</b>
                                                        </Typography>
                                                        <OutlinedInput
                                                            id="component-outlinedname"
                                                            type="date"
                                                            disabled={ProducionIndividualChange.enddatemode === 'Auto'}
                                                            value={ProducionIndividualChange.fromdate}
                                                            onChange={handleDateChangeEdit}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={6} sm={6} xs={12}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography>
                                                            End Time <b style={{ color: "red" }}>*</b>
                                                        </Typography>
                                                        <OutlinedInput
                                                            id="component-outlinedname"
                                                            type="time"
                                                            disabled={ProducionIndividualChange.enddatemode === 'Auto'}
                                                            value={
                                                                ProducionIndividualChange.time}
                                                            onChange={(e) => {

                                                                const selectedEndTime = e.target.value; // End time from input

                                                                // Parse the start and end times into hours and minutes
                                                                const [startHours, startMinutes] = ProducionIndividualChange.starttime === "" ?
                                                                    currtime?.split(":")?.map(Number) :
                                                                    ProducionIndividualChange.starttime?.split(":")?.map(Number);
                                                                const [endHours, endMinutes] = selectedEndTime.split(":").map(Number);

                                                                // Parse start date and end date
                                                                const startDate = new Date(ProducionIndividualChange.startdate || new Date()); // Start date
                                                                const endDate = new Date(ProducionIndividualChange.fromdate || new Date()); // End date

                                                                // Set time for startDate and endDate to be the hours and minutes from inputs
                                                                startDate.setHours(startHours, startMinutes, 0, 0); // Set start time
                                                                endDate.setHours(endHours, endMinutes, 0, 0); // Set end time

                                                                // Compare if the end date-time is before or equal to start date-time
                                                                if (endDate <= startDate) {
                                                                    setPopupContent("End date and time should be after the start date and time!");
                                                                    setPopupSeverity("warning");
                                                                    handleClickOpenPopup();
                                                                    setProducionIndividualChange({ ...ProducionIndividualChange, time: "" });
                                                                } else {
                                                                    setProducionIndividualChange({ ...ProducionIndividualChange, time: selectedEndTime });
                                                                }
                                                            }}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Total Pages <b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <OutlinedInput
                                                    id="component-outlinedname"
                                                    type="text"
                                                    placeholder="Please Enter Total Pages"
                                                    value={ProducionIndividualChange.totalpages}
                                                    onChange={(e) => handleChangephonenumbertotalChange(e)} />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Completed Pages <b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <OutlinedInput
                                                    id="component-outlinedname"
                                                    type="text"
                                                    placeholder="Please Enter Completed Pages"
                                                    value={ProducionIndividualChange.flagcount}
                                                    onChange={(e) => handleChangephonenumberflagChange(e)} />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Pending  Pages  <b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <OutlinedInput
                                                    id="component-outlinedname"
                                                    type="text"
                                                    placeholder="Please Enter Flag Count"
                                                    value={ProducionIndividualChange.pendingpages} />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} sm={6} xs={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Start Page  <b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <OutlinedInput
                                                    id="component-outlinedname"
                                                    type="text"
                                                    value={ProducionIndividualChange.startpage} />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={6}>
                                            <Typography>Attachment</Typography>
                                            <Box sx={{ display: "flex", justifyContent: "left" }}>
                                                <Button
                                                    variant="contained"
                                                    onClick={handleClickUploadPopupOpenedit}
                                                >
                                                    Upload
                                                </Button>
                                            </Box>
                                        </Grid>
                                        <Grid item md={6} xs={12} sm={6}>
                                            <FormControl fullWidth>
                                                <Typography>Remarks</Typography>
                                                <TextareaAutosize
                                                    aria-label="minimum height"
                                                    minRows={5}
                                                    value={ProducionIndividualChange.remarks}
                                                    onChange={(e) => {
                                                        setProducionIndividualChange({ ...ProducionIndividualChange, remarks: e.target.value });
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={6} xs={12} sm={6}>
                                            <FormControl fullWidth>
                                                <Typography>Notes</Typography>
                                                <TextareaAutosize
                                                    aria-label="minimum height"
                                                    minRows={5}
                                                    value={ProducionIndividualChange.notes}
                                                    onChange={(e) => {
                                                        setProducionIndividualChange({ ...ProducionIndividualChange, notes: e.target.value });
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                    </>
                                )}
                                {(ProducionIndividualChange.statusmode === "Reject" || ProducionIndividualChange.statusmode === "Cancel") && (
                                    <>
                                        <Grid item md={4} xs={12} sm={12}>
                                            <FormControl fullWidth>
                                                <Typography>Reason<b style={{ color: "red" }}>*</b></Typography>
                                                <TextareaAutosize
                                                    aria-label="minimum height"
                                                    minRows={5}
                                                    value={ProducionIndividualChange.reason}
                                                    onChange={(e) => {
                                                        setProducionIndividualChange({ ...ProducionIndividualChange, reason: e.target.value });


                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                    </>
                                )}
                            </Grid>
                            <br /> <br />
                            <Grid container spacing={2}>
                                <Grid item md={6} xs={12} sm={12}>
                                    <Button variant="contained" sx={buttonStyles.buttonsubmit}
                                        onClick={editSubmit}
                                    >
                                        {" "}
                                        Update
                                    </Button>
                                </Grid>
                                <Grid item md={6} xs={12} sm={12}>
                                    <Button sx={buttonStyles.btncancel} onClick={handleCloseModEdit}>
                                        {" "}
                                        Cancel{" "}
                                    </Button>
                                </Grid>
                            </Grid>
                        </>
                    </Box>
                </Dialog>
            </Box>



            {/* UPLOAD IMAGE DIALOG EDIT */}
            <Dialog
                open={uploadPopupOpenedit}
                onClose={handleUploadPopupCloseedit}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="md"
                sx={{ marginTop: "95px" }}
            >
                <DialogTitle
                    id="customized-dialog-title1"
                    sx={{ backgroundColor: "#e0e0e0", color: "#000", display: "flex" }}
                >
                    Upload Image Edit
                </DialogTitle>
                <DialogContent sx={{ minWidth: "750px", height: "850px" }}>
                    <Grid container spacing={2}>
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            <Typography variant="body2" style={{ marginTop: "5px" }}>
                                Max File size: 5MB
                            </Typography>
                            {/* {showDragField ? ( */}
                            <div onDragOver={handleDragOveredit} onDrop={handleDropedit}>
                                {previewURLedit && refImageDragedit.length > 0 ? (
                                    <>
                                        {refImageDragedit.map((file, index) => (
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
                                                <Button
                                                    onClick={() => handleRemoveFileedit(index)}
                                                    style={{ marginTop: "0px", color: "red" }}
                                                >
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
                            {/* ) : null} */}
                        </Grid>
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            <br />
                            <FormControl size="small" fullWidth>
                                <Grid sx={{ display: "flex" }}>
                                    <Button
                                        variant="contained"
                                        component="label"
                                        sx={userStyle.uploadbtn}
                                    >
                                        {" "}
                                        Upload
                                        <input
                                            type="file"
                                            multiple
                                            id="productimage"
                                            accept="image/*"
                                            hidden
                                            onChange={handleInputChangeedit}
                                        />
                                    </Button>
                                    &ensp;
                                    <Button
                                        variant="contained"
                                        onClick={showWebcamedit}
                                        sx={userStyle.uploadbtn}
                                    >
                                        Webcam
                                    </Button>
                                </Grid>
                            </FormControl>
                        </Grid>
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            {resultArray?.map((file, index) => (
                                <>
                                    <Grid container>
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
                                                    <img
                                                        className={classes.preview}
                                                        src={getFileIcon(file.name)}
                                                        height="10"
                                                        alt="file icon"
                                                    />
                                                )}
                                            </Box>
                                        </Grid>
                                        <Grid
                                            item
                                            md={8}
                                            sm={8}
                                            xs={8}
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
                                                    onClick={() => renderFilePreviewedit(file)}
                                                >
                                                    <VisibilityOutlinedIcon
                                                        style={{ fontsize: "12px", color: "#357AE8" }}
                                                    />
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
                                                    onClick={() => {
                                                        handleDeleteFileedit(index);
                                                    }}
                                                >
                                                    <FaTrash
                                                        style={{ color: "#a73131", fontSize: "12px" }}
                                                    />
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </>
                            ))}
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleUploadOverAlledit} variant="contained">
                        Ok
                    </Button>
                    <Button onClick={resetImageedit} sx={userStyle.btncancel}>
                        Reset
                    </Button>
                    <Button onClick={handleUploadPopupCloseedit} sx={userStyle.btncancel}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            {/* webcam alert start */}
            <Dialog
                open={isWebcamOpenedit}
                onClose={webcamCloseedit}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="sm"
                fullWidth={true}
            >
                <DialogContent
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        textAlign: "center",
                        alignItems: "center",
                    }}
                >
                    <Webcamimage
                        name={nameedit}
                        getImgedit={getImgedit}
                        setGetImgedit={setGetImgedit}
                        valNumedit={valNumedit}
                        setValNumedit={setValNumedit}
                        capturedImagesedit={capturedImagesedit}
                        setCapturedImagesedit={setCapturedImagesedit}
                        setRefImageedit={setRefImageedit}
                        setRefImageDragedit={setRefImageDragedit}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={webcamDataStoreedit}
                    >
                        OK
                    </Button>
                    <Button variant="contained" color="error" onClick={webcamCloseedit}>
                        CANCEL
                    </Button>
                </DialogActions>
            </Dialog>
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
            <ExportData
                isFilterOpen={isFilterOpen}
                handleCloseFilterMod={handleCloseFilterMod}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpen}
                isPdfFilterOpen={isPdfFilterOpen}
                setIsPdfFilterOpen={setIsPdfFilterOpen}
                handleClosePdfFilterMod={handleClosePdfFilterMod}
                // filteredDataTwo={filteredData ?? []}
                filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
                itemsTwo={overallFilterdata ?? []}
                filename={"Pending Manual Entry List"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
        </Box>
    );
}

export default PendingManualentrylist;