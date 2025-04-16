import React, { useContext, useEffect, useRef, useState, useMemo, useCallback } from "react";
import { FaEdit, FaFileCsv, FaFileExcel, FaFilePdf, FaPrint, FaSearch } from 'react-icons/fa';
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from "@mui/icons-material/Info";
import AssignmentReturnedIcon from '@mui/icons-material/AssignmentReturned';
import DeleteIcon from "@mui/icons-material/Delete";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ImageIcon from "@mui/icons-material/Image";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import LoadingButton from "@mui/lab/LoadingButton";
import {
    Accordion as MUIAccordion,
    AccordionSummary,
    AccordionDetails, Box, Button, Checkbox, Dialog, DialogActions, DialogContent, FormControl, Grid, IconButton, InputLabel, MenuItem, OutlinedInput, Paper, Popover, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextareaAutosize, Typography, InputAdornment, Tooltip
} from "@mui/material";
import FormControlLabel from '@mui/material/FormControlLabel';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import axios from "axios";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment-timezone";
import { ThreeDots } from "react-loader-spinner";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { userStyle, colourStyles } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";
import Webcamimage from "../hr/webcamprofile";
import { IoMdOptions } from "react-icons/io";
import { MdClose } from "react-icons/md";
import domtoimage from 'dom-to-image';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import ExportData from "../../components/ExportData";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";
import AlertDialog from "../../components/Alert";
import AdvancedSearchBar from '../../components/SearchbarEbList';
import ManageColumnsContent from "../../components/ManageColumn";
import ResizeObserver from 'resize-observer-polyfill';
import { FaTrash } from "react-icons/fa";
import csvIcon from "../../components/Assets/CSV.png";
import excelIcon from "../../components/Assets/excel-icon.png";
import fileIcon from "../../components/Assets/file-icons.png";
import pdfIcon from "../../components/Assets/pdf-icon.png";
import wordIcon from "../../components/Assets/word-icon.png";
import { makeStyles } from "@material-ui/core";

window.ResizeObserver = ResizeObserver;
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

function TeamAssetAcceptanceList() {
    const classes = useStyles();
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
    let today = new Date();

    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    let formattedDate = yyyy + "-" + mm + "-" + dd;

    const gridRefTableTeamLveVerif = useRef(null);
    const gridRefImageTeamLveVerif = useRef(null);
    const [isBtn, setIsBtn] = useState(false);
    const [Accessdrop, setAccesDrop] = useState("Employee");
    const [AccessdropEdit, setAccesDropEdit] = useState("Employee");
    const modeDropDowns = [
        { label: "My Hierarchy List", value: "myhierarchy" },
        { label: "All Hierarchy List", value: "allhierarchy" },
        { label: "My + All Hierarchy List", value: "myallhierarchy" },
    ];
    const sectorDropDowns = [
        { label: "Primary", value: "Primary" },
        { label: "Secondary", value: "Secondary" },
        { label: "Tertiary", value: "Tertiary" },
        { label: "All", value: "all" },
    ];
    const [modeselection, setModeSelection] = useState({
        label: "My Hierarchy List",
        value: "myhierarchy",
    });
    const [sectorSelection, setSectorSelection] = useState({
        label: "Primary",
        value: "Primary",
    });
    const [appleave, setAppleave] = useState({
        employeename: "Please Select Employee Name",
        employeeid: "",
        leavetype: "Please Select LeaveType",
        date: "",
        todate: "",
        reasonforleave: "",
        reportingto: "",
        department: "",
        designation: "",
        doj: "",
        availabledays: "",
        durationtype: "Random",
        weekoff: "",
        workmode: "",
    });

    const [appleaveEdit, setAppleaveEdit] = useState([]);
    const [selectStatus, setSelectStatus] = useState({});
    const [isApplyLeave, setIsApplyLeave] = useState([]);

    const [applyleaves, setApplyleaves] = useState([]);
    const [isChecked, setIsChecked] = useState(false);
    const [leaveId, setLeaveId] = useState("");
    const [allApplyleaveedit, setAllApplyleaveedit] = useState([]);
    const [relatedCountEdit, setRelatedCountEdit] = useState(0);
    const [selectedValue, setSelectedValue] = useState([]);

    // State to track advanced filter
    const [advancedFilter, setAdvancedFilter] = useState(null);
    const [gridApi, setGridApi] = useState(null);
    const [columnApi, setColumnApi] = useState(null);
    const [filteredDataItems, setFilteredDataItems] = useState(applyleaves);
    const [filteredRowData, setFilteredRowData] = useState([]);

    const [leave, setLeave] = useState("Please Select LeaveType");
    const [leaveEdit, setLeaveEdit] = useState("Please Select LeaveType");

    const { isUserRoleCompare, allProjects, isUserRoleAccess, pageName, setPageName, buttonStyles, } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);

    const [applyleaveCheck, setApplyleavecheck] = useState(true);

    const [selectedRows, setSelectedRows] = useState([]);

    const [statusOpen, setStatusOpen] = useState(false);
    const handleStatusOpen = () => { setStatusOpen(true); };
    const handleStatusClose = () => { setStatusOpen(false); };

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
    // page refersh reload
    const handleCloseFilterMod = () => { setIsFilterOpen(false); };
    const handleClosePdfFilterMod = () => { setIsPdfFilterOpen(false); };

    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
    const handleClickOpenPopupMalert = () => { setOpenPopupMalert(true); };
    const handleClosePopupMalert = () => { setOpenPopupMalert(false); };

    const [openPopup, setOpenPopup] = useState(false);
    const [popupContent, setPopupContent] = useState("");
    const [popupSeverity, setPopupSeverity] = useState("");
    const handleClickOpenPopup = () => { setOpenPopup(true); };
    const handleClosePopup = () => { setOpenPopup(false); }

    //Datatable
    const [pageTeamLveVerif, setPageTeamLveVerif] = useState(1);
    const [pageSizeTeamLveVerif, setPageSizeTeamLveVerif] = useState(10);
    const [searchQueryTeamLveVerif, setSearchQueryTeamLveVerif] = useState("");
    const [totalPagesTeamLveVerif, setTotalPagesTeamLveVerif] = useState(1);

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const handleClickOpenerr = () => { setIsErrorOpen(true); };
    const handleCloseerr = () => { setIsErrorOpen(false); };

    // Manage Columns
    const [searchQueryManageTeamLveVerif, setSearchQueryManageTeamLveVerif] = useState("");
    const [isManageColumnsOpenTeamLveVerif, setManageColumnsOpenTeamLveVerif] = useState(false);
    const [anchorElTeamLveVerif, setAnchorElTeamLveVerif] = useState(null);

    const handleOpenManageColumnsTeamLveVerif = (event) => {
        setAnchorElTeamLveVerif(event.currentTarget);
        setManageColumnsOpenTeamLveVerif(true);
    };
    const handleCloseManageColumnsTeamLveVerif = () => {
        setManageColumnsOpenTeamLveVerif(false);
        setSearchQueryManageTeamLveVerif("");
    };

    const openTeamLveVerif = Boolean(anchorElTeamLveVerif);
    const idTeamLveVerif = openTeamLveVerif ? "simple-popover" : undefined;

    // Search bar
    const [anchorElSearchTeamLveVerif, setAnchorElSearchTeamLveVerif] = React.useState(null);
    const handleClickSearchTeamLveVerif = (event) => {
        setAnchorElSearchTeamLveVerif(event.currentTarget);
    };
    const handleCloseSearchTeamLveVerif = () => {
        setAnchorElSearchTeamLveVerif(null);
        setSearchQueryTeamLveVerif("");
    };

    const openSearchTeamLveVerif = Boolean(anchorElSearchTeamLveVerif);
    const idSearchTeamLveVerif = openSearchTeamLveVerif ? 'simple-popover' : undefined;

    // Table row color
    const getRowStyle = (params) => {
        if (params.node.rowIndex % 2 === 0) {
            return { background: '#f0f0f0' }; // Even row
        } else {
            return { background: '#ffffff' }; // Odd row
        }
    }

    useEffect(() => {
        getapi();
    }, []);

    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                'Authorization': `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Team Asset Acceptance List"),
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

    const [isEditOpenCheckList, setIsEditOpenCheckList] = useState(false);
    const handleClickOpenEditCheckList = () => {
        setIsEditOpenCheckList(true);
    };
    const handleCloseModEditCheckList = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpenCheckList(false);
    };

    const [isCheckedList, setIsCheckedList] = useState([]);
    const [isCheckedListOverall, setIsCheckedListOverall] = useState(false);
    const overallCheckListChange = () => {
        let newArrayChecked = isCheckedList.map((item) => item = !isCheckedListOverall);

        let returnOverall = groupDetails.map((row) => {

            {
                if (row.checklist === "DateTime") {
                    if ((((row.data !== undefined && row.data !== "") || (row.files !== undefined)) && row.data.length === 16)) {
                        return true;
                    } else {
                        return false;
                    }
                }
                else if (row.checklist === "Date Multi Span") {
                    if ((((row.data !== undefined && row.data !== "") || (row.files !== undefined)) && row.data.length === 21)) {
                        return true;
                    } else {
                        return false;
                    }
                }
                else if (row.checklist === "Date Multi Span Time") {
                    if ((((row.data !== undefined && row.data !== "") || (row.files !== undefined)) && row.data.length === 33)) {
                        return true;
                    } else {
                        return false;
                    }
                }
                else if (row.checklist === "Date Multi Random Time") {
                    if ((((row.data !== undefined && row.data !== "") || (row.files !== undefined)) && row.data.length === 16)) {
                        return true;
                    } else {
                        return false;
                    }

                }
                else if (((row.data !== undefined && row.data !== "") || (row.files !== undefined))) {
                    return true;
                } else {
                    return false;
                }

            }

        })

        let allcondition = returnOverall.every((item) => item == true);

        if (allcondition) {
            setIsCheckedList(newArrayChecked);
            setIsCheckedListOverall(!isCheckedListOverall);
        } else {
            setPopupContentMalert("Please Fill all the Fields");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }

    }

    const handleCheckboxChange = (index) => {
        const newCheckedState = [...isCheckedList];
        newCheckedState[index] = !newCheckedState[index];

        let currentItem = groupDetails[index];

        let data = () => {
            if (currentItem.checklist === "DateTime") {
                if ((((currentItem.data !== undefined && currentItem.data !== "") || (currentItem.files !== undefined)) && currentItem.data.length === 16)) {
                    return true;
                } else {
                    return false;
                }
            }
            else if (currentItem.checklist === "Date Multi Span") {
                if ((((currentItem.data !== undefined && currentItem.data !== "") || (currentItem.files !== undefined)) && currentItem.data.length === 21)) {
                    return true;
                } else {
                    return false;
                }
            }
            else if (currentItem.checklist === "Date Multi Span Time") {
                if ((((currentItem.data !== undefined && currentItem.data !== "") || (currentItem.files !== undefined)) && currentItem.data.length === 33)) {
                    return true;
                } else {
                    return false;
                }
            }
            else if (currentItem.checklist === "Date Multi Random Time") {
                if ((((currentItem.data !== undefined && currentItem.data !== "") || (currentItem.files !== undefined)) && currentItem.data.length === 16)) {
                    return true;
                } else {
                    return false;
                }

            }
            else if (((currentItem.data !== undefined && currentItem.data !== "") || (currentItem.files !== undefined))) {
                return true;
            } else {
                return false;
            }
        }

        if (data()) {
            setIsCheckedList(newCheckedState);
            handleDataChange(newCheckedState[index], index, "Check Box");
            let overallChecked = newCheckedState.every((item) => item === true);

            if (overallChecked) {
                setIsCheckedListOverall(true);
            } else {
                setIsCheckedListOverall(false);
            }
        } else {
            setPopupContentMalert("Please Fill the Field");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }


    };

    let name = "create";

    //webcam
    const [isWebcamOpen, setIsWebcamOpen] = useState(false);
    const [getImg, setGetImg] = useState(null);
    const [isWebcamCapture, setIsWebcamCapture] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [capturedImages, setCapturedImages] = useState([]);
    const [valNum, setValNum] = useState(0);

    const webcamOpen = () => { setIsWebcamOpen(true); };
    const webcamClose = () => { setIsWebcamOpen(false); };
    const webcamDataStore = () => {
        setIsWebcamCapture(true);
        //popup close
        webcamClose();
    };

    //add webcamera popup
    const showWebcam = () => {
        webcamOpen();
    };

    const renderFilePreviewEdit = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };
    const handleFileDeleteEdit = (index) => {
        let getData = groupDetails[index];
        delete getData.files;
        let finalData = getData;

        let updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
    };

    const [assignDetails, setAssignDetails] = useState();
    const [groupDetails, setGroupDetails] = useState();
    const [datasAvailedDB, setDatasAvailedDB] = useState();
    const [disableInput, setDisableInput] = useState([]);
    const [getDetails, setGetDetails] = useState();


    const [dateValue, setDateValue] = useState([]);
    const [timeValue, setTimeValue] = useState([]);

    const [dateValueRandom, setDateValueRandom] = useState([]);
    const [timeValueRandom, setTimeValueRandom] = useState([]);

    const [dateValueMultiFrom, setDateValueMultiFrom] = useState([]);
    const [dateValueMultiTo, setDateValueMultiTo] = useState([]);
    const [postID, setPostID] = useState();
    const [pagesDetails, setPagesDetails] = useState({});
    const [fromWhere, setFromWhere] = useState("");

    const [firstDateValue, setFirstDateValue] = useState([]);
    const [firstTimeValue, setFirstTimeValue] = useState([]);
    const [secondDateValue, setSecondDateValue] = useState([]);
    const [secondTimeValue, setSecondTimeValue] = useState([]);

    const [isCheckList, setIsCheckList] = useState(true);

    let completedbyName = isUserRoleAccess.companyname;





    //---------------------------------------------------------------------------------------------------------------


    //------------------------------------------------------------------------------------------------------------

    const handleDataChange = (e, index, from, sub) => {

        let getData;
        let finalData;
        let updatedTodos;
        switch (from) {
            case 'Check Box':
                getData = groupDetails[index];
                finalData = {
                    ...getData, lastcheck: e
                }

                updatedTodos = [...groupDetails];
                updatedTodos[index] = finalData;
                setGroupDetails(updatedTodos);
                break;
            case 'Text Box':
                getData = groupDetails[index];
                finalData = {
                    ...getData, data: e.target.value
                }

                updatedTodos = [...groupDetails];
                updatedTodos[index] = finalData;
                setGroupDetails(updatedTodos);
                break;
            case 'Text Box-number':
                getData = groupDetails[index];
                finalData = {
                    ...getData, data: e.target.value
                }

                updatedTodos = [...groupDetails];
                updatedTodos[index] = finalData;
                setGroupDetails(updatedTodos);
                break;
            case 'Text Box-alpha':
                getData = groupDetails[index];
                finalData = {
                    ...getData, data: e.target.value
                }

                updatedTodos = [...groupDetails];
                updatedTodos[index] = finalData;
                setGroupDetails(updatedTodos);
                break;
            case 'Text Box-alphanumeric':
                getData = groupDetails[index];
                finalData = {
                    ...getData, data: e.target.value
                }

                updatedTodos = [...groupDetails];
                updatedTodos[index] = finalData;
                setGroupDetails(updatedTodos);
                break;
            case 'Attachments':
                getData = groupDetails[index];
                finalData = {
                    ...getData, files: e
                }

                updatedTodos = [...groupDetails];
                updatedTodos[index] = finalData;
                setGroupDetails(updatedTodos);
                break;
            case 'Pre-Value':
                break;
            case 'Date':
                getData = groupDetails[index];
                finalData = {
                    ...getData, data: e.target.value
                }

                updatedTodos = [...groupDetails];
                updatedTodos[index] = finalData;
                setGroupDetails(updatedTodos);
                break;
            case 'Time':
                getData = groupDetails[index];
                finalData = {
                    ...getData, data: e.target.value
                }

                updatedTodos = [...groupDetails];
                updatedTodos[index] = finalData;
                setGroupDetails(updatedTodos);
                break;
            case 'DateTime':
                if (sub == "date") {
                    getData = groupDetails[index];
                    finalData = {
                        ...getData, data: `${e} ${timeValue[index]}`
                    }

                    updatedTodos = [...groupDetails];
                    updatedTodos[index] = finalData;
                    setGroupDetails(updatedTodos);
                } else {
                    getData = groupDetails[index];
                    finalData = {
                        ...getData, data: `${dateValue[index]} ${e}`
                    }

                    updatedTodos = [...groupDetails];
                    updatedTodos[index] = finalData;
                    setGroupDetails(updatedTodos);
                }

                break;
            case 'Date Multi Span':
                if (sub == "fromdate") {
                    getData = groupDetails[index];
                    finalData = {
                        ...getData, data: `${e} ${dateValueMultiTo[index]}`
                    }

                    updatedTodos = [...groupDetails];
                    updatedTodos[index] = finalData;
                    setGroupDetails(updatedTodos);
                } else {
                    getData = groupDetails[index];
                    finalData = {
                        ...getData, data: `${dateValueMultiFrom[index]} ${e}`
                    }

                    updatedTodos = [...groupDetails];
                    updatedTodos[index] = finalData;
                    setGroupDetails(updatedTodos);
                }
                break;
            case 'Date Multi Span Time':
                if (sub == "fromdate") {
                    getData = groupDetails[index];
                    finalData = {
                        ...getData, data: `${e} ${firstTimeValue[index]}/${secondDateValue[index]} ${secondTimeValue[index]}`
                    }

                    updatedTodos = [...groupDetails];
                    updatedTodos[index] = finalData;
                    setGroupDetails(updatedTodos);
                } else if (sub == "fromtime") {
                    getData = groupDetails[index];
                    finalData = {
                        ...getData, data: `${firstDateValue[index]} ${e}/${secondDateValue[index]} ${secondTimeValue[index]}`
                    }

                    updatedTodos = [...groupDetails];
                    updatedTodos[index] = finalData;
                    setGroupDetails(updatedTodos);
                }
                else if (sub == "todate") {
                    getData = groupDetails[index];
                    finalData = {
                        ...getData, data: `${firstDateValue[index]} ${firstTimeValue[index]}/${e} ${secondTimeValue[index]}`
                    }

                    updatedTodos = [...groupDetails];
                    updatedTodos[index] = finalData;
                    setGroupDetails(updatedTodos);
                } else {
                    getData = groupDetails[index];
                    finalData = {
                        ...getData, data: `${firstDateValue[index]} ${firstTimeValue[index]}/${secondDateValue[index]} ${e}`
                    }

                    updatedTodos = [...groupDetails];
                    updatedTodos[index] = finalData;
                    setGroupDetails(updatedTodos);
                }
                break;
            case 'Date Multi Random':
                getData = groupDetails[index];
                finalData = {
                    ...getData, data: e.target.value
                }

                updatedTodos = [...groupDetails];
                updatedTodos[index] = finalData;
                setGroupDetails(updatedTodos);
                break;
            case 'Date Multi Random Time':

                if (sub == "date") {
                    getData = groupDetails[index];
                    finalData = {
                        ...getData, data: `${e} ${timeValueRandom[index]}`
                    }


                    updatedTodos = [...groupDetails];
                    updatedTodos[index] = finalData;
                    setGroupDetails(updatedTodos);
                } else {
                    getData = groupDetails[index];
                    finalData = {
                        ...getData, data: `${dateValueRandom[index]} ${e}`
                    }

                    updatedTodos = [...groupDetails];
                    updatedTodos[index] = finalData;
                    setGroupDetails(updatedTodos);
                }
                break;
            case 'Radio':
                getData = groupDetails[index];
                finalData = {
                    ...getData, data: e.target.value
                }

                updatedTodos = [...groupDetails];
                updatedTodos[index] = finalData;
                setGroupDetails(updatedTodos);
                break;
        }
    }

    const handleChangeImage = (event, index) => {

        const resume = event.target.files;


        const reader = new FileReader();
        const file = resume[0];
        reader.readAsDataURL(file);

        reader.onload = () => {
            handleDataChange(
                {
                    name: file.name,
                    preview: reader.result,
                    data: reader.result.split(",")[1],
                    remark: "resume file",
                }, index, "Attachments")

        };

    };



    // Show All Columns & Manage Columns
    const initialColumnVisibilityTeamLveVerif = {
        serialNumber: true,
        status: true,
        company: true,
        branch: true,
        unit: true,

        floor: true,
        area: true,
        location: true,
        assetmaterial: true,
        assetmaterialcode: true,
        assigndate: true,
        assigntime: true,
        companyto: true,
        branchto: true,
        unitto: true,
        teamto: true,
        employeenameto: true,

        actions: true,
    };

    const [columnVisibilityTeamLveVerif, setColumnVisibilityTeamLveVerif] = useState(initialColumnVisibilityTeamLveVerif);

    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
    };

    let dateselect = new Date();
    dateselect.setDate(dateselect.getDate() + 3);
    var ddt = String(dateselect.getDate()).padStart(2, "0");
    var mmt = String(dateselect.getMonth() + 1).padStart(2, "0");
    var yyyyt = dateselect.getFullYear();
    let formattedDatet = yyyyt + "-" + mmt + "-" + ddt;

    let datePresent = new Date();
    var ddp = String(datePresent.getDate());
    var mmp = String(datePresent.getMonth() + 1);
    var yyyyp = datePresent.getFullYear();
    let formattedDatePresent = yyyyp + "-" + mmp + "-" + ddp;

    // Assuming appleave.date is the "from date" and appleave.todate is the "to date"
    const calculateDaysDifference = () => {
        const fromDate = new Date(appleave.date).getTime();
        const toDate = new Date(appleave.todate).getTime();

        if (!isNaN(fromDate) && !isNaN(toDate)) {
            // Calculate the number of days between the two dates
            const daysDifference = Math.floor(
                (toDate - fromDate) / (1000 * 60 * 60 * 24)
            );
            return daysDifference + 1;
        }

        return 0; // Return 0 if either date is invalid
    };

    // Call the function and set the result in state or use it as needed
    const daysDifference = calculateDaysDifference();

    // Assuming appleave.date is the "from date" and appleave.todate is the "to date"
    const calculateDaysDifferenceEdit = () => {
        const fromDate = new Date(appleaveEdit.date).getTime();
        const toDate = new Date(appleaveEdit.todate).getTime();

        if (!isNaN(fromDate) && !isNaN(toDate)) {
            // Calculate the number of days between the two dates
            const daysDifferenceEdit = Math.floor(
                (toDate - fromDate) / (1000 * 60 * 60 * 24)
            );
            return daysDifferenceEdit + 1;
        }

        return 0; // Return 0 if either date is invalid
    };








    //Project updateby edit page...
    let updateby = appleaveEdit?.updatedby;
    let addedby = appleaveEdit?.addedby;
    let updatedByStatus = selectStatus.updatedby;

    let subprojectsid = appleaveEdit?._id;
    //editing the single data...



    const [leaveVerification, setLeaveVerification] = useState([]);
    //get all Sub vendormasters.


    //get all Sub vendormasters.
    const fetchApplyleave = async () => {
        setApplyleavecheck(false);
        setPageName(!pageName)
        try {
            let res_employee = await axios.post(SERVICE.TEAM_ASSET_DISTRIBUTION_LIST, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                hierachy: modeselection.value,
                sector: sectorSelection.value,
                username: isUserRoleAccess.companyname,
                team: isUserRoleAccess.team,
                pagename: "menuteamassetacceptancelist",
            });
            setApplyleavecheck(true);
            console.log(res_employee?.data, "res_employee?.data")
            if (res_employee?.data?.resultedTeam?.length > 0 && res_employee?.data?.resultAccessFilter?.length < 1 && ["myallhierarchy", "allhierarchy"]?.includes(modeselection.value)) {
                setIsBtn(false);
                setApplyleavecheck(true);
                alert("Some employees have not been given access to this page.")
            }
            let answer = res_employee?.data?.resultAccessFilter?.length > 0 ? res_employee?.data?.resultAccessFilter : [];
            setApplyleaves(answer?.map((item, index) => ({
                ...item, serialNumber: index + 1,
                id: item?._id,
                assigndate: moment(item?.assigndate).format("DD-MM-YYYY"),
                assigntime: moment(item.assigntime, "HH:mm").format("hh:mm A"),
                companyto: item?.companyto,
                unitto: item?.unitto?.join(","),
                teamto: item?.teamto?.join(","),
                branchto: item?.branchto?.join(","),
                employeenameto: item?.employeenameto?.join(","),
            })));
            setTotalPagesTeamLveVerif(Math.ceil(answer.length / pageSizeTeamLveVerif));
            // let Approve =
            //   isUserRoleAccess?.role?.includes("Manager") ||
            //     isUserRoleAccess?.role?.includes("HiringManager") ||
            //     isUserRoleAccess?.role?.includes("HR") ||
            //     isUserRoleAccess?.role?.includes("Superadmin")
            //     ? res_vendor?.data?.applyleaves.filter(
            //       (data) => data.status === "Approved"
            //     )
            //     : res_vendor?.data?.applyleaves.filter(
            //       (data) =>
            //         data.employeename === isUserRoleAccess.companyname &&
            //         data.status === "Approved"
            //     );
            setIsApplyLeave([]);
        } catch (err) { setApplyleavecheck(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    //id for login...
    let loginid = localStorage.LoginUserId;
    let authToken = localStorage.APIToken;

    useEffect(() => {
    }, [appleaveEdit, appleave,]);

    useEffect(() => {
        // fetchLeaveVerification();

    }, []);

    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        };
    }, []);

    const [items, setItems] = useState([]);

    const addSerialNumber = () => {
        const itemsWithSerialNumber = applyleaves?.map((item, index) => ({
            ...item,
        }));
        setItems(itemsWithSerialNumber);
        setFilteredDataItems(itemsWithSerialNumber);
    };

    useEffect(() => {
        addSerialNumber();
    }, [applyleaves]);


    const defaultColDef = useMemo(() => {
        return {
            filter: true,
            resizable: true,
            filterParams: {
                buttons: ["apply", "reset", "cancel"],
            },
        };
    }, []);

    const onGridReady = useCallback((params) => {
        setGridApi(params.api);
        setColumnApi(params.columnApi);
    }, []);

    // Function to handle filter changes
    const onFilterChanged = () => {
        if (gridApi) {
            const filterModel = gridApi.getFilterModel(); // Get the current filter model

            // Check if filters are active
            if (Object.keys(filterModel).length === 0) {
                // No filters active, clear the filtered data state
                setFilteredRowData([]);
            } else {
                // Filters are active, capture filtered data
                const filteredData = [];
                gridApi.forEachNodeAfterFilterAndSort((node) => {
                    filteredData.push(node.data); // Collect filtered row data
                });
                setFilteredRowData(filteredData);
            }
        }
    };

    const onPaginationChanged = useCallback(() => {
        if (gridRefTableTeamLveVerif.current) {
            const gridApi = gridRefTableTeamLveVerif.current.api;
            const currentPage = gridApi.paginationGetCurrentPage() + 1;
            const totalPagesTeamLveVerif = gridApi.paginationGetTotalPages();
            setPageTeamLveVerif(currentPage);
            setTotalPagesTeamLveVerif(totalPagesTeamLveVerif);
        }
    }, []);

    // Pagination for innter filter
    const getVisiblePageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 3;

        const startPage = Math.max(1, pageTeamLveVerif - 1);
        const endPage = Math.min(totalPagesTeamLveVerif, startPage + maxVisiblePages - 1);

        // Loop through and add visible pageTeamLveVerif numbers
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        // If there are more pages after the last visible pageTeamLveVerif, show ellipsis
        if (endPage < totalPagesTeamLveVerif) {
            pageNumbers.push("...");
        }

        return pageNumbers;
    };

    // Pagination for outer filter
    const filteredData = filteredDataItems?.slice((pageTeamLveVerif - 1) * pageSizeTeamLveVerif, pageTeamLveVerif * pageSizeTeamLveVerif);
    const totalPagesTeamLveVerifOuter = Math.ceil(filteredDataItems?.length / pageSizeTeamLveVerif);
    const visiblePages = Math.min(totalPagesTeamLveVerifOuter, 3);
    const firstVisiblePage = Math.max(1, pageTeamLveVerif - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPagesTeamLveVerifOuter);
    const pageNumbers = [];
    const indexOfLastItem = pageTeamLveVerif * pageSizeTeamLveVerif;
    const indexOfFirstItem = indexOfLastItem - pageSizeTeamLveVerif;
    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) { pageNumbers.push(i); }
    const renderStatusIconAndColor = (status) => {
        const iconProps = {
            size: "small",
            style: { marginRight: 4 },
        };

        let icon = <InfoIcon {...iconProps} />;
        let color = "#ccc"; // Default color
        let textcolor = "white";
        // Default color

        switch (status) {
            case "Yet To Accept":
                icon = <HourglassEmptyIcon {...iconProps} />;
                color = "orange";
                textcolor = "white";
                break;

            case "Accepted":
                icon = <CheckCircleIcon {...iconProps} />;
                color = "green";
                textcolor = "white";
                break;
            case "Returned":
                icon = <AssignmentReturnedIcon {...iconProps} />;
                color = "blue";
                textcolor = "white";
                break;
            default:
                icon = <InfoIcon {...iconProps} />;
                color = "#ccc"; // Default color
        }

        return { icon, color, textcolor };
    };

    const StatusButton = ({ status }) => {
        const { icon, color, textcolor } = renderStatusIconAndColor(status);

        return (
            <Tooltip title={status} arrow>
                <Button
                    variant="contained"
                    startIcon={icon}
                    sx={{
                        fontSize: "0.75rem",
                        padding: "2px 6px",
                        cursor: "default",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "150px",
                        minWidth: "100px",
                        display: "flex",
                        justifyContent: "flex-start",
                        color: textcolor,
                        backgroundColor: color,
                        "&:hover": {
                            backgroundColor: color,
                            overflow: "visible",
                            whiteSpace: "normal",
                            maxWidth: "none",
                        },
                    }}
                    disableElevation
                >
                    {status}
                </Button>
            </Tooltip>
        );
    };

    // get single row to view....
    const [maintenanceview, setMaintenanceview] = useState([]);


    const [accordianCreateView, setAccordianCreateView] = useState([]);
    // const getTextAfterFirstDash = (inputString) => {
    //     const parts = inputString.split('-');
    //     return parts.slice(1).join('-');
    // };
    function getTextAfterFirstDash(str1, str2) {
        // Use String.prototype.replace to remove the first occurrence of str1 from str2
        const newStr = str2.replace(new RegExp(`^${str1}[-]?`), "");
        return newStr;
    }
    const fetchUnAssignedIPAddress = async (assetmaterial, code, setState) => {
        const result = await getTextAfterFirstDash(assetmaterial, code);
        try {
            let response = await axios.post(`${SERVICE.ASSET_MATCHED_SUBCOMPONENT}`, {
                code: result
            }, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let mainArray = response?.data?.matchedObjects?.length > 0 ? response?.data?.matchedObjects : [];

            // List of desired keys
            const desiredKeys = [
                "type", "model", "size", "variant", "brand", "serial", "other", "capacity", "hdmiport",
                "vgaport", "dpport", "usbport", "paneltypescreen", "resolution", "connectivity",
                "daterate", "compatibledevice", "outputpower", "collingfancount", "clockspeed",
                "core", "speed", "frequency", "output", "ethernetports", "distance", "lengthname",
                "slot", "noofchannels", "colours", "code"
            ];

            // Filter the array
            let filteredArray = mainArray.map(obj => {
                // Filter the keys based on desiredKeys and conditions
                let filteredObject = {};
                desiredKeys.forEach(key => {
                    if (
                        obj[key] && // Check if the value exists (not undefined or null)
                        obj[key].trim() !== "" && // Ensure it's not empty
                        !obj[key].includes("Please Select") // Exclude "Please Select" values
                    ) {
                        filteredObject[key] = obj[key]; // Add the valid key-value pair
                    }
                });
                return filteredObject; // Return the filtered object
            }).filter(obj => Object.keys(obj).length > 0); // Exclude empty objects

            setState(filteredArray)
        } catch (err) {
            //   handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
            setState([]);
            console.log(err)
        }
    };

    const [openviewnear, setOpenviewnear] = useState(false);
    const renderFilePreview = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };
    // view model
    const handleClickOpenviewnear = () => {
        setOpenviewnear(true);
    };

    const handleCloseviewnear = () => {
        setOpenviewnear(false);
    };

    const Accordion = ({ data }) => {
        const capitalizeFirstLetter = (string) =>
            string.charAt(0).toUpperCase() + string.slice(1);

        return (
            <Box sx={{ margin: "20px" }}>
                {data.map((item, index) => (
                    <MUIAccordion key={index}>
                        {/* Accordion Title */}
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={`panel${index}-content`}
                            id={`panel${index}-header`}
                        >
                            <Typography variant="h6">
                                Specification - {item.code || `Item ${index + 1}`}
                            </Typography>
                        </AccordionSummary>

                        {/* Accordion Content */}
                        <AccordionDetails>
                            <Grid container spacing={2}>
                                {Object.keys(item)
                                    .filter((key) => key !== "code") // Exclude the code key
                                    .map((key, subIndex) => (
                                        <Grid item xs={12} sm={4} md={4} key={subIndex}>
                                            <Typography variant="subtitle1" fontWeight="bold">
                                                {capitalizeFirstLetter(key)}:
                                            </Typography>
                                            <Typography variant="body2">{item[key]}</Typography>
                                        </Grid>
                                    ))}
                            </Grid>
                        </AccordionDetails>
                    </MUIAccordion>
                ))}
            </Box>
        );
    };
    const getviewCodeNear = async (e) => {
        try {
            let res = await axios.get(`${SERVICE.EMPLOYEEASSET_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setMaintenanceview(res?.data?.semployeeasset);
            await fetchUnAssignedIPAddress(res?.data?.semployeeasset?.assetmaterial, res?.data?.semployeeasset?.assetmaterialcode, setAccordianCreateView);
            handleClickOpenviewnear();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    const [acceptLoader, setAcceptLoader] = useState("");

    const sendEditrequest = async (params) => {
        setPageName(!pageName)
        console.log(params)
        try {
            setAcceptLoader(params?.id)
            let res = await axios.put(
                `${SERVICE.EMPLOYEEASSET_SINGLE}/${params?.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    status: "Accepted",
                    accepteddateandtime: new Date(),
                    acceptedby: isUserRoleAccess?.companyname,
                }
            );
            const resultss = await getTextAfterFirstDash(params?.assetmaterial, params?.assetmaterialcode);

            let resss = await axios.put(
                `${SERVICE.ASSET_DISTRIBUTION_STATUS}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    code: resultss,
                    distributed: true,
                    distributedto: String(params?.employeenameto)
                }
            );
            setAcceptLoader("")
            await fetchApplyleave();
            //   handleCloseModEditNear();
            setPopupContent("Accepted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            setAcceptLoader("")
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    const columnDataTableTeamLveVerif = [
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 80,
            hide: !columnVisibilityTeamLveVerif.serialNumber,
            headerClassName: "bold-header", pinned: 'left', lockPinned: true,
        },
        {
            field: "status",
            headerName: "Status",
            flex: 0,
            width: 200,
            hide: !columnVisibilityTeamLveVerif.status,
            headerClassName: "bold-header",
            pinned: "left",
            lockPinned: true,
            cellStyle: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            },
            cellRenderer: (params) => (
                <>
                    {params?.data?.status && (
                        <StatusButton status={params.data.status} />
                    )}
                </>
            ),
        },

        {
            field: "company",
            headerName: "Company",
            flex: 0,
            width: 100,
            hide: !columnVisibilityTeamLveVerif.company,
            headerClassName: "bold-header",
        },
        {
            field: "branch",
            headerName: "Branch",
            flex: 0,
            width: 100,
            hide: !columnVisibilityTeamLveVerif.branch,
            headerClassName: "bold-header",
        },
        {
            field: "unit",
            headerName: "Unit",
            flex: 0,
            width: 100,
            hide: !columnVisibilityTeamLveVerif.unit,
            headerClassName: "bold-header",
        },
        {
            field: "floor",
            headerName: "Floor",
            flex: 0,
            width: 100,
            hide: !columnVisibilityTeamLveVerif.floor,
            headerClassName: "bold-header",
        },
        {
            field: "area",
            headerName: "Area",
            flex: 0,
            width: 100,
            hide: !columnVisibilityTeamLveVerif.area,
            headerClassName: "bold-header",
        },
        {
            field: "location",
            headerName: "Location",
            flex: 0,
            width: 100,
            hide: !columnVisibilityTeamLveVerif.location,
            headerClassName: "bold-header",
        },
        {
            field: "assetmaterial",
            headerName: "Asset Material",
            flex: 0,
            width: 160,
            hide: !columnVisibilityTeamLveVerif.assetmaterial,
            headerClassName: "bold-header",
        },
        {
            field: "assetmaterialcode",
            headerName: "Asset Material Code",
            flex: 0,
            width: 160,
            hide: !columnVisibilityTeamLveVerif.assetmaterialcode,
            headerClassName: "bold-header",
        },
        {
            field: "assigndate",
            headerName: "Assign Date",
            flex: 0,
            width: 160,
            hide: !columnVisibilityTeamLveVerif.assigndate,
            headerClassName: "bold-header",
        },
        {
            field: "assigntime",
            headerName: "Assign Time",
            flex: 0,
            width: 160,
            hide: !columnVisibilityTeamLveVerif.assigntime,
            headerClassName: "bold-header",
        },

        {
            field: "companyto",
            headerName: "To Company",
            flex: 0,
            width: 100,
            hide: !columnVisibilityTeamLveVerif.companyto,
            headerClassName: "bold-header",
        },
        {
            field: "branchto",
            headerName: "To Branch",
            flex: 0,
            width: 100,
            hide: !columnVisibilityTeamLveVerif.branchto,
            headerClassName: "bold-header",
        },
        {
            field: "unitto",
            headerName: "To Unit",
            flex: 0,
            width: 100,
            hide: !columnVisibilityTeamLveVerif.unitto,
            headerClassName: "bold-header",
        },
        {
            field: "teamto",
            headerName: "To team",
            flex: 0,
            width: 100,
            hide: !columnVisibilityTeamLveVerif.teamto,
            headerClassName: "bold-header",
        },
        {
            field: "employeenameto",
            headerName: "Employee Name",
            flex: 0,
            width: 250,
            hide: !columnVisibilityTeamLveVerif.employeenameto,
            headerClassName: "bold-header",
        },



        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 250,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibilityTeamLveVerif.actions,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>



                    {isUserRoleCompare?.includes("vindividualassetacceptancelist") && (

                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getviewCodeNear(params.data.id);
                            }}
                        >
                            <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("eremoteemployeedetailslist") && (
                        <>
                            {params.data.status === "Yet To Accept" && (


                                <LoadingButton
                                    variant="contained"
                                    color="success"
                                    onClick={() => {
                                        sendEditrequest(params.data);
                                    }}
                                    size="small"
                                    loading={acceptLoader === params?.data?.id}
                                    sx={buttonStyles.buttonsubmit}
                                    loadingPosition="end"

                                >
                                    Accept
                                </LoadingButton>
                            )}
                        </>

                    )}

                </Grid>
            ),
        },

    ];

    // Datatable
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQueryTeamLveVerif(value);
        applyNormalFilter(value);
        setFilteredRowData([]);
    };



    const applyNormalFilter = (searchValue) => {

        // Split the search query into individual terms
        const searchTerms = searchValue.toLowerCase().split(" ");

        // Modify the filtering logic to check each term
        const filtered = items?.filter((item) => {
            return searchTerms.every((term) =>
                Object.values(item).join(" ").toLowerCase().includes(term)
            );
        });
        setFilteredDataItems(filtered);
        setPageTeamLveVerif(1);
    };

    const applyAdvancedFilter = (filters, logicOperator) => {
        // Apply filtering logic with multiple conditions
        const filtered = items?.filter((item) => {
            return filters.reduce((acc, filter, index) => {
                const { column, condition, value } = filter;
                const itemValue = String(item[column])?.toLowerCase();
                const filterValue = String(value).toLowerCase();

                let match;
                switch (condition) {
                    case "Contains":
                        match = itemValue.includes(filterValue);
                        break;
                    case "Does Not Contain":
                        match = !itemValue?.includes(filterValue);
                        break;
                    case "Equals":
                        match = itemValue === filterValue;
                        break;
                    case "Does Not Equal":
                        match = itemValue !== filterValue;
                        break;
                    case "Begins With":
                        match = itemValue.startsWith(filterValue);
                        break;
                    case "Ends With":
                        match = itemValue.endsWith(filterValue);
                        break;
                    case "Blank":
                        match = !itemValue;
                        break;
                    case "Not Blank":
                        match = !!itemValue;
                        break;
                    default:
                        match = true;
                }

                // Combine conditions with AND/OR logic
                if (index === 0) {
                    return match; // First filter is applied directly
                } else if (logicOperator === "AND") {
                    return acc && match;
                } else {
                    return acc || match;
                }
            }, true);
        });

        setFilteredDataItems(filtered);
        setAdvancedFilter(filters);
        // handleCloseSearchTeamLveVerif(); 
    };

    // Undo filter funtion
    const handleResetSearch = () => {
        setAdvancedFilter(null);
        setSearchQueryTeamLveVerif("");
        setFilteredDataItems(applyleaves);
    };

    // Show filtered combination in the search bar
    const getSearchDisplay = () => {
        if (advancedFilter && advancedFilter.length > 0) {
            return advancedFilter.map((filter, index) => {
                let showname = columnDataTableTeamLveVerif.find(col => col.field === filter.column)?.headerName;
                return `${showname} ${filter.condition} "${filter.value}"`;
            }).join(' ' + (advancedFilter.length > 1 ? advancedFilter[1].condition : '') + ' ');
        }
        return searchQueryTeamLveVerif;
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPagesTeamLveVerif) {
            setPageTeamLveVerif(newPage);
            gridRefTableTeamLveVerif.current.api.paginationGoToPage(newPage - 1);
        }
    };

    const handlePageSizeChange = (e) => {
        const newSize = Number(e.target.value);
        setPageSizeTeamLveVerif(newSize);
        if (gridApi) {
            gridApi.paginationSetPageSize(newSize);
        }
    };

    // Show All Columns functionality
    const handleShowAllColumns = () => {
        const updatedVisibility = { ...columnVisibilityTeamLveVerif };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibilityTeamLveVerif(updatedVisibility);
    };

    useEffect(() => {
        // Retrieve column visibility from localStorage (if available)
        const savedVisibility = localStorage.getItem("columnVisibilityTeamLveVerif");
        if (savedVisibility) {
            setColumnVisibilityTeamLveVerif(JSON.parse(savedVisibility));
        }
    }, []);

    useEffect(() => {
        // Save column visibility to localStorage whenever it changes
        localStorage.setItem("columnVisibilityTeamLveVerif", JSON.stringify(columnVisibilityTeamLveVerif));
    }, [columnVisibilityTeamLveVerif]);

    // // Function to filter columns based on search query
    const filteredColumns = columnDataTableTeamLveVerif.filter((column) =>
        column.headerName.toLowerCase().includes(searchQueryManageTeamLveVerif.toLowerCase())
    );

    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // Manage Columns functionality
    const toggleColumnVisibility = (field) => {
        if (!gridApi) return;

        setColumnVisibilityTeamLveVerif((prevVisibility) => {
            const newVisibility = !prevVisibility[field];

            // Update the visibility in the grid
            gridApi.setColumnVisible(field, newVisibility);

            return {
                ...prevVisibility,
                [field]: newVisibility,
            };
        });
    };

    const handleColumnMoved = useCallback(debounce((event) => {
        if (!event.columnApi) return;

        const visible_columns = event.columnApi.getAllColumns().filter(col => {
            const colState = event.columnApi.getColumnState().find(state => state.colId === col.colId);
            return colState && !colState.hide;
        }).map(col => col.colId);

        setColumnVisibilityTeamLveVerif((prevVisibility) => {
            const updatedVisibility = { ...prevVisibility };

            // Ensure columns that are visible stay visible
            Object.keys(updatedVisibility).forEach(colId => {
                updatedVisibility[colId] = visible_columns.includes(colId);
            });

            return updatedVisibility;
        });
    }, 300), []);

    const handleColumnVisible = useCallback((event) => {
        const colId = event.column.getColId();

        // Update visibility based on event, but only when explicitly triggered by grid
        setColumnVisibilityTeamLveVerif((prevVisibility) => ({
            ...prevVisibility,
            [colId]: event.visible, // Set visibility directly from the event
        }));
    }, []);

    // Excel
    const [fileFormat, setFormat] = useState('');
    let exportColumnNamescrt = ["Status",
        "Company",
        "Branch",
        "Unit",
        "Floor",
        "Area",
        "Location",
        "Assetmaterial",
        "Assetmaterialcode",
        "Assigndate",
        "Assigntime",
        "ToCompany",
        "ToBranch",
        "ToUnit",
        "ToTeam",
        "ToEmployeename",
    ]
    let exportRowValuescrt = [
        "status",
        "company",
        "branch",
        "unit",
        "floor",
        "area",
        "location",
        "assetmaterial",
        "assetmaterialcode",
        "assigndate",
        "assigntime",
        "companyto",
        "branchto",
        "unitto",
        "teamto",
        "employeenameto",
    ]

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Team Asset Acceptance List",
        pageStyle: "print",
    });


    // image
    const handleCaptureImage = () => {
        if (gridRefImageTeamLveVerif.current) {
            domtoimage.toBlob(gridRefImageTeamLveVerif.current)
                .then((blob) => {
                    saveAs(blob, "TeamAssetAcceptanceList.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    return (
        <Box>
            <Headtitle title={"TEAM ASSET ACCEPTANCE LIST"} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Team Asset Acceptance List"
                modulename="Asset"
                submodulename="Asset Register"
                mainpagename="Team Asset Acceptance List"
                subpagename=""
                subsubpagename=""
            />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lteamassetacceptancelist") && (
                <>
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>
                                Team Asset Acceptance List
                            </Typography>
                        </Grid>
                        <Grid container spacing={2} style={userStyle.dataTablestyle}>
                            <Grid item md={2} xs={12} sm={12}>
                                <Box>
                                    <label>Show entries:</label>
                                    <Select
                                        id="pageSizeSelect"
                                        value={pageSizeTeamLveVerif}
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
                                        <MenuItem value={applyleaves?.length}>All</MenuItem>
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid
                                item
                                md={8}
                                xs={12}
                                sm={12}
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Box>
                                    {isUserRoleCompare?.includes(
                                        "excelteamassetacceptancelist"
                                    ) && (
                                            <>
                                                <Button onClick={(e) => {
                                                    setIsFilterOpen(true)
                                                    setFormat("xl")
                                                }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                            </>
                                        )}
                                    {isUserRoleCompare?.includes("csvteamassetacceptancelist") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes(
                                        "printteamassetacceptancelist"
                                    ) && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                    &ensp;
                                                    <FaPrint />
                                                    &ensp;Print&ensp;
                                                </Button>
                                            </>
                                        )}
                                    {isUserRoleCompare?.includes("pdfteamassetacceptancelist") && (
                                        <>
                                            <Button sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true)
                                                }}
                                            ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes(
                                        "imageteamassetacceptancelist"
                                    ) && (
                                            <Button
                                                sx={userStyle.buttongrp}
                                                onClick={handleCaptureImage}
                                            >
                                                {" "}
                                                <ImageIcon
                                                    sx={{ fontSize: "15px" }}
                                                /> &ensp;Image&ensp;{" "}
                                            </Button>
                                        )}
                                </Box>
                            </Grid>
                            <Grid item md={2} xs={6} sm={6}>
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
                                                        <IoMdOptions style={{ cursor: 'pointer', }} onClick={handleClickSearchTeamLveVerif} />
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
                        </Grid>  <br />
                        <Grid container spacing={2}>
                            <Grid item lg={1.5} md={1} xs={12} sm={6}>
                                <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
                                    Show All Columns
                                </Button>

                            </Grid>
                            <Grid item lg={1.5} md={1} xs={12} sm={6}>
                                <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsTeamLveVerif}>
                                    Manage Columns
                                </Button>

                            </Grid>
                            <Grid item lg={2} md={2.5} xs={12} sm={6}>
                                <Selects
                                    options={modeDropDowns}
                                    styles={colourStyles}
                                    value={{ label: modeselection.label, value: modeselection.value }}
                                    onChange={(e) => setModeSelection(e)}
                                />
                            </Grid>
                            <Grid item lg={2} md={2.5} xs={12} sm={6}>
                                <Selects
                                    options={sectorDropDowns}
                                    styles={colourStyles}
                                    value={{ label: sectorSelection.label, value: sectorSelection.value }}
                                    onChange={(e) => setSectorSelection(e)}
                                />
                            </Grid>
                            <Grid item lg={3} md={2} xs={12} sm={6}>
                                <LoadingButton loading={isBtn} variant="contained"
                                    onClick={(e) => fetchApplyleave(e)}
                                >Filter</LoadingButton>
                            </Grid>
                        </Grid>
                        <br />
                        {!applyleaveCheck ? (
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
                                <Box sx={{ width: "100%", }} className={"ag-theme-quartz"} ref={gridRefImageTeamLveVerif} >
                                    <AgGridReact
                                        rowData={filteredDataItems}
                                        columnDefs={columnDataTableTeamLveVerif.filter((column) => columnVisibilityTeamLveVerif[column.field])}
                                        ref={gridRefTableTeamLveVerif}
                                        defaultColDef={defaultColDef}
                                        domLayout={"autoHeight"}
                                        getRowStyle={getRowStyle}
                                        pagination={true}
                                        paginationPageSize={pageSizeTeamLveVerif}
                                        onPaginationChanged={onPaginationChanged}
                                        onGridReady={onGridReady}
                                        onColumnMoved={handleColumnMoved}
                                        onColumnVisible={handleColumnVisible}
                                        onFilterChanged={onFilterChanged}
                                        // suppressPaginationPanel={true}
                                        suppressSizeToFit={true}
                                        suppressAutoSize={true}
                                        suppressColumnVirtualisation={true}
                                        colResizeDefault={"shift"}
                                        cellSelection={true}
                                        copyHeadersToClipboard={true}
                                    />
                                </Box>
                                {/* <Box style={userStyle.dataTablestyle}>
                  <Box>
                    Showing{" "}
                    {
                      gridApi && gridApi.getFilterModel() && Object.keys(gridApi.getFilterModel()).length === 0 ? (
                        (filteredDataItems.length > 0 ? (pageTeamLveVerif - 1) * pageSizeTeamLveVerif + 1 : 0)
                      ) : (
                        filteredRowData.length > 0 ? (pageTeamLveVerif - 1) * pageSizeTeamLveVerif + 1 : 0
                      )
                    }{" "}to{" "}
                    {
                      gridApi && gridApi.getFilterModel() && Object.keys(gridApi.getFilterModel()).length === 0 ? (
                        Math.min(pageTeamLveVerif * pageSizeTeamLveVerif, filteredDataItems.length)
                      ) : (
                        filteredRowData.length > 0 ? Math.min(pageTeamLveVerif * pageSizeTeamLveVerif, filteredRowData.length) : 0
                      )
                    }{" "}of{" "}
                    {
                      gridApi && gridApi.getFilterModel() && Object.keys(gridApi.getFilterModel()).length === 0 ? (
                        filteredDataItems.length
                      ) : (
                        filteredRowData.length
                      )
                    } entries
                  </Box>
                  <Box>
                    <Button onClick={() => handlePageChange(1)} disabled={pageTeamLveVerif === 1} sx={userStyle.paginationbtn}  > <FirstPageIcon /> </Button>
                    <Button onClick={() => handlePageChange(pageTeamLveVerif - 1)} disabled={pageTeamLveVerif === 1} sx={userStyle.paginationbtn}  > <NavigateBeforeIcon />  </Button>
                    {getVisiblePageNumbers().map((pageNumber, index) => (
                      <Button
                        key={index}
                        onClick={() => pageNumber !== "..." && handlePageChange(pageNumber)}
                        sx={{
                          ...userStyle.paginationbtn,
                          ...(pageNumber === "..." && {
                            cursor: "default",
                            color: "black",
                            fontSize: '12px',
                            fontWeight: 'bold',
                            backgroundColor: "transparent",
                            border: "none",
                            "&:hover": {
                              backgroundColor: "transparent",
                              boxShadow: "none",
                            },
                          }),
                        }}
                        className={pageTeamLveVerif === pageNumber ? "active" : ""}
                        disabled={pageTeamLveVerif === pageNumber}
                      >
                        {pageNumber}
                      </Button>
                    ))}
                    <Button onClick={() => handlePageChange(pageTeamLveVerif + 1)} disabled={pageTeamLveVerif === totalPagesTeamLveVerif} sx={userStyle.paginationbtn} > <NavigateNextIcon /> </Button>
                    <Button onClick={() => handlePageChange(totalPagesTeamLveVerif)} disabled={pageTeamLveVerif === totalPagesTeamLveVerif} sx={userStyle.paginationbtn} ><LastPageIcon /> </Button>
                  </Box>
                </Box> */}
                            </>
                        )}
                    </Box>
                </>
            )}

            {/* Manage Column */}
            <Popover
                id={idTeamLveVerif}
                open={isManageColumnsOpenTeamLveVerif}
                anchorEl={anchorElTeamLveVerif}
                onClose={handleCloseManageColumnsTeamLveVerif}
                anchorOrigin={{ vertical: "bottom", horizontal: "left", }}
            >
                <ManageColumnsContent
                    handleClose={handleCloseManageColumnsTeamLveVerif}
                    searchQuery={searchQueryManageTeamLveVerif}
                    setSearchQuery={setSearchQueryManageTeamLveVerif}
                    filteredColumns={filteredColumns}
                    columnVisibility={columnVisibilityTeamLveVerif}
                    toggleColumnVisibility={toggleColumnVisibility}
                    setColumnVisibility={setColumnVisibilityTeamLveVerif}
                    initialColumnVisibility={initialColumnVisibilityTeamLveVerif}
                    columnDataTable={columnDataTableTeamLveVerif}
                />
            </Popover>

            {/* Search Bar */}
            <Popover
                id={idSearchTeamLveVerif}
                open={openSearchTeamLveVerif}
                anchorEl={anchorElSearchTeamLveVerif}
                onClose={handleCloseSearchTeamLveVerif}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }}
            >
                <AdvancedSearchBar columns={columnDataTableTeamLveVerif?.filter(data => data.field && data.field !== 'actions')} onSearch={applyAdvancedFilter} initialSearchValue={searchQueryTeamLveVerif} handleCloseSearch={handleCloseSearchTeamLveVerif} />
            </Popover>



            {/* ALERT DIALOG */}
            <Box>
                <Dialog
                    open={isErrorOpen}
                    onClose={handleCloseerr}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}          >
                        <Typography variant="h6">{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error" onClick={handleCloseerr}>
                            ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
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
            {/* EXTERNAL COMPONENTS -------------- END */}
            {/* PRINT PDF EXCEL CSV */}
            <ExportData
                isFilterOpen={isFilterOpen}
                handleCloseFilterMod={handleCloseFilterMod}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpen}
                isPdfFilterOpen={isPdfFilterOpen}
                setIsPdfFilterOpen={setIsPdfFilterOpen}
                handleClosePdfFilterMod={handleClosePdfFilterMod}
                filteredDataTwo={(filteredRowData.length > 0 ? filteredRowData : filteredData) ?? []}
                itemsTwo={items ?? []}
                filename={"TeamAssetAcceptanceList"}
                exportColumnNames={exportColumnNamescrt}
                exportRowValues={exportRowValuescrt}
                componentRef={componentRef}
            />


            <Dialog
                open={openviewnear}
                onClose={handleClickOpenviewnear}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="lg"
                fullWidth={true}
                sx={{ marginTop: "95px" }}
            >
                <Box sx={{ padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}>
                            {" "}
                            View Individual Asset Distribution
                        </Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Status</Typography>
                                    <Typography>{maintenanceview?.status}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Company</Typography>
                                    <Typography>{maintenanceview.company}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Branch</Typography>
                                    <Typography>{maintenanceview.branch}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Unit</Typography>
                                    <Typography>{maintenanceview.unit}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Floor</Typography>
                                    <Typography>{maintenanceview.floor}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Area</Typography>
                                    <Typography>{maintenanceview.area}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Location</Typography>
                                    <Typography>{maintenanceview.location}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Asset Material</Typography>
                                    <Typography>
                                        {maintenanceview?.assetmaterial}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Asset Material Code</Typography>
                                    <Typography>
                                        {maintenanceview?.assetmaterialcode}
                                    </Typography>
                                </FormControl>
                            </Grid>

                            {accordianCreateView?.length > 0 &&
                                <Grid item md={12} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Accordion data={accordianCreateView} />
                                    </FormControl>
                                </Grid>}
                            <Grid item xs={12} md={12}>
                                <Typography sx={userStyle.importheadtext}>
                                    Assigned Person
                                </Typography>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Assign Date</Typography>
                                    <Typography>
                                        {moment(maintenanceview.assigndate).format(
                                            "DD/MM/YYYY"
                                        )}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Assign Time</Typography>
                                    <Typography>  {moment(maintenanceview.assigntime, "HH:mm").format("hh:mm A")}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Company</Typography>
                                    <Typography>{maintenanceview?.company}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                                        Branch
                                    </Typography>
                                    <Typography>
                                        {maintenanceview?.branchto?.join(",")}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                                        Unit
                                    </Typography>
                                    <Typography>
                                        {maintenanceview?.unitto?.join(",")}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                                        Team
                                    </Typography>
                                    <Typography>
                                        {maintenanceview?.teamto?.join(",")}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={6} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                                        Employee Name
                                    </Typography>
                                    <Typography>
                                        {maintenanceview?.employeenameto?.join(",")}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid
                                item
                                lg={12}
                                md={12}
                                xs={12}
                                sm={12}
                                sx={{ marginTop: "20px" }}
                            >
                                <Typography sx={{ fontWeight: "bold", fontSize: "14px", marginBottom: "10px" }}>
                                    Images
                                </Typography>

                                {/* Headings */}
                                <Grid container spacing={2} sx={{ padding: "10px 0", backgroundColor: "#f5f5f5" }}>
                                    <Grid item md={1} sm={1} xs={1}>
                                        <Typography sx={{ fontWeight: "bold" }}>File</Typography>
                                    </Grid>
                                    <Grid item md={7} sm={7} xs={7}>
                                        <Typography sx={{ fontWeight: "bold" }}>File Name</Typography>
                                    </Grid>
                                    <Grid item md={3} sm={3} xs={3}>
                                        <Typography sx={{ fontWeight: "bold" }}>Remarks</Typography>
                                    </Grid>
                                    <Grid item md={1} sm={1} xs={1}>
                                        <Typography sx={{ fontWeight: "bold", textAlign: "center" }}></Typography>
                                    </Grid>
                                </Grid>

                                {/* File Data */}
                                {maintenanceview?.images?.length > 0 &&
                                    maintenanceview.images.map((file, index) => (
                                        <Grid
                                            container
                                            spacing={2}
                                            key={index}
                                            sx={{
                                                padding: "10px 0",
                                                borderBottom: "1px solid #e0e0e0",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Grid item md={1} sm={1} xs={1}>
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    {file?.type?.includes("image/") ? (
                                                        <img
                                                            src={file.preview}
                                                            alt={file.name}
                                                            height={40}
                                                            style={{
                                                                maxWidth: "100%",
                                                            }}
                                                        />
                                                    ) : (
                                                        <img
                                                            className={classes.preview}
                                                            src={getFileIcon(file.name)}
                                                            height={40}
                                                            alt="file icon"
                                                        />
                                                    )}
                                                </Box>
                                            </Grid>
                                            <Grid item md={7} sm={7} xs={7}>
                                                <Typography>{file.name || "Unnamed File"}</Typography>
                                            </Grid>
                                            <Grid item md={3} sm={3} xs={3}>
                                                <Typography>{file?.remarks || "No Remarks"}</Typography>
                                            </Grid>
                                            <Grid item md={1} sm={1} xs={1}>
                                                <VisibilityOutlinedIcon
                                                    style={{
                                                        fontSize: "24px",
                                                        color: "#357AE8",
                                                        cursor: "pointer",
                                                    }}
                                                    onClick={() => renderFilePreview(file)}
                                                />
                                            </Grid>
                                        </Grid>
                                    ))}
                            </Grid>
                        </Grid>
                        <br /> <br /> <br />
                        <Grid container spacing={2}>
                            <Button
                                variant="contained"
                                sx={buttonStyles.buttonsubmit}
                                onClick={handleCloseviewnear}
                            >
                                {" "}
                                Back{" "}
                            </Button>
                        </Grid>
                    </>
                </Box>
            </Dialog>
        </Box>
    );
}

export default TeamAssetAcceptanceList;