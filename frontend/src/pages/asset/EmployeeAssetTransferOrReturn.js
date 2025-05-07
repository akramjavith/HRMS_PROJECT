import React, { useContext, useEffect, useRef, useState, useMemo, useCallback } from "react";
import { FaEdit, FaFileCsv, FaFileExcel, FaFilePdf, FaPrint, FaSearch } from 'react-icons/fa';
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation'
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
    AccordionSummary, TextField,
    AccordionDetails, Box, Button, Checkbox, Dialog, DialogActions, DialogContent, FormControl, Grid, IconButton, InputLabel, MenuItem, OutlinedInput, Paper, Popover, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextareaAutosize, Typography, InputAdornment, Tooltip, Backdrop,
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
import CircularProgress from "@mui/material/CircularProgress";
import { MultiSelect } from "react-multi-select-component";




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

function EmployeeAssetTransferOrReturn() {
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
    const [isLoading, setIsLoading] = useState(false);

    const LoadingBackdrop = ({ open }) => {
        return (
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.modal + 1 }}
                open={open}
            >
                <div className="pulsating-circle">
                    <CircularProgress color="inherit" className="loading-spinner" />
                </div>
                <Typography
                    variant="h6"
                    sx={{ marginLeft: 2, color: "#fff", fontWeight: "bold" }}
                >
                    Please Wait...
                </Typography>
            </Backdrop>
        );
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

    const { isUserRoleCompare, allProjects, isAssignBranch, isUserRoleAccess, pageName, setPageName, buttonStyles, allTeam,
        allUsersData, } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    const accessbranch = isUserRoleAccess?.role?.includes("Manager")
        ? isAssignBranch?.map((data) => ({
            branch: data.branch,
            company: data.company,
            unit: data.unit,
        }))
        : isAssignBranch
            ?.filter((data) => {
                let fetfinalurl = [];
                if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 &&
                    data?.mainpagenameurl?.length !== 0 &&
                    data?.subpagenameurl?.length !== 0 &&
                    data?.subsubpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
                ) {
                    fetfinalurl = data.subsubpagenameurl;
                } else if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 &&
                    data?.mainpagenameurl?.length !== 0 &&
                    data?.subpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
                ) {
                    fetfinalurl = data.subpagenameurl;
                } else if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 &&
                    data?.mainpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
                ) {
                    fetfinalurl = data.mainpagenameurl;
                } else if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
                ) {
                    fetfinalurl = data.submodulenameurl;
                } else if (data?.modulenameurl?.length !== 0) {
                    fetfinalurl = data.modulenameurl;
                } else {
                    fetfinalurl = [];
                }

                const remove = [
                    window.location.pathname?.substring(1),
                    window.location.pathname,
                ];
                return fetfinalurl?.some((item) => remove?.includes(item));
            })
            ?.map((data) => ({
                branch: data.branch,
                company: data.company,
                unit: data.unit,
            }));
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
    const handleClickOpenPopup = () => { setOpenPopup(true); setIsLoading(false); };
    const handleClosePopup = () => { setOpenPopup(false); setIsLoading(false); }

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
            pagename: String("Employee Asset Return/Transfer Register"),
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



    //transfer start

    const [transferDetails, setTransferDetails] = useState({
        assetmaterial: "",
        assetmaterialcode: "",
        transferdate: moment().format("YYYY-MM-DD"),
        transfertime: moment().format("HH:mm"),
        company: "",
        branch: [],
        unit: [],
        team: [],
        employee: "",
        assetcompany: "",
        assetbranch: "",
        assetunit: "",
        assetfloor: "",
        assetarea: "",
        assetlocation: "",
    })
    const [transferUpload, setTransferUpload] = useState([]);
    const [isTransferOpen, setIsTransferOpen] = useState(false);
    const handleClickOpenTransfer = () => {
        setIsTransferOpen(true);
    };
    const handleCloseModTransfer = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsTransferOpen(false);
        setTransferUpload([]);
        setAccordianCreateTransfer([]);
        setTransferDetails({
            assetmaterial: "",
            assetmaterialcode: "",
            transferdate: moment().format("YYYY-MM-DD"),
            transfertime: moment().format("HH:mm"),
            company: "",
            branch: [],
            unit: [],
            team: [],
            employee: "",
            assetcompany: "",
            assetbranch: "",
            assetunit: "",
            assetfloor: "",
            assetarea: "",
            assetlocation: "",
        })
    };
    const getCodeTransfer = async (params) => {
        try {


            let distribution = await axios.get(`${SERVICE.EMPLOYEEASSET_SINGLE}/${params?.id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let reurnData = distribution?.data?.semployeeasset;
            let singleUser = allUsersData?.find(item => item?.companyname === reurnData?.employeenameto[0])
            await fetchComponents(reurnData?.assetmaterial, reurnData?.assetmaterialcode, setAccordianCreateTransfer);
            setTransferDetails({
                distributionid: reurnData?._id,
                assetmaterial: reurnData?.assetmaterial,
                assetmaterialcode: reurnData?.assetmaterialcode,
                transferdate: moment().format("YYYY-MM-DD"),
                transfertime: moment().format("HH:mm"),
                company: "",
                branch: [],
                unit: [],
                team: [],
                employee: "",
                assetcompany: reurnData?.company,
                assetbranch: reurnData?.branch,
                assetunit: reurnData?.unit,
                assetfloor: reurnData?.floor,
                assetarea: reurnData?.area,
                assetlocation: reurnData?.location,
                returncompany: singleUser?.company,
                returnbranch: singleUser?.branch,
                returnunit: singleUser?.unit,
                returnteam: singleUser?.team,
                returnemployee: reurnData?.employeenameto[0],
            })
            handleClickOpenTransfer();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    const [returnUpload, setReturnUpload] = useState([]);
    const [isReturnOpen, setIsReturnOpen] = useState(false);
    const handleClickOpenReturn = () => {
        setIsReturnOpen(true);
    };
    const [returnDetails, setReturnDetails] = useState({
        assetmaterial: "",
        assetmaterialcode: "",
        returndate: moment().format("YYYY-MM-DD"),
        returntime: moment().format("HH:mm"),
        company: "",
        branch: [],
        unit: [],
        team: [],
        employee: "",
        assetcompany: "",
        assetbranch: "",
        assetunit: "",
        assetfloor: "",
        assetarea: "",
        assetlocation: "",
    })
    const handleCloseModReturn = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsReturnOpen(false);
        setReturnUpload([]);
        setAccordianCreateReturn([]);
        setReturnDetails({
            assetmaterial: "",
            assetmaterialcode: "",
            returndate: moment().format("YYYY-MM-DD"),
            returntime: moment().format("HH:mm"),
            company: "",
            branch: [],
            unit: [],
            team: [],
            employee: "",
            assetcompany: "",
            assetbranch: "",
            assetunit: "",
            assetfloor: "",
            assetarea: "",
            assetlocation: "",
            description: ""
        })
    };
    const getCodeReturn = async (params) => {
        try {
            let distribution = await axios.get(`${SERVICE.EMPLOYEEASSET_SINGLE}/${params?.id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let reurnData = distribution?.data?.semployeeasset;
            let singleUser = allUsersData?.find(item => item?.companyname === reurnData?.employeenameto[0])
            await fetchComponents(reurnData?.assetmaterial, reurnData?.assetmaterialcode, setAccordianCreateReturn);
            setReturnDetails({
                distributionid: reurnData?._id,
                assetmaterial: reurnData?.assetmaterial,
                assetmaterialcode: reurnData?.assetmaterialcode,
                returndate: moment().format("YYYY-MM-DD"),
                returntime: moment().format("HH:mm"),
                company: singleUser?.company,
                branch: singleUser?.branch,
                unit: singleUser?.unit,
                team: singleUser?.team,
                employee: reurnData?.employeenameto[0] || "",
                assetcompany: reurnData?.company,
                assetbranch: reurnData?.branch,
                assetunit: reurnData?.unit,
                assetfloor: reurnData?.floor,
                assetarea: reurnData?.area,
                assetlocation: reurnData?.location,
            })
            handleClickOpenReturn();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };


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


    const renderFilePreview = async (file) => {
        const url = window.URL.createObjectURL(file);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };
    const renderFilePreviewBase64 = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };

    const renderFilePreviewMulterUploaded = async (file) => {
        if (!file) return false;
        const imageUrl = `${SERVICE.VEIW_ASSET_REGISTER_FILES}/${file.filename}`;
        window.open(imageUrl, '_blank'); // Open image in a new tab
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
                    type: file.type,
                    remarks: ""
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

    const handleFileDeleteTransfer = (index) => {
        setTransferUpload((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };
    const handleResumeUploadTransfer = (event) => {
        const selectedFiles = Array.from(event.target.files); // Convert FileList to Array
        if (!selectedFiles.length) return;

        let largeFiles = []; // To store names of files larger than 1MB

        // Filter files that are <= 1MB (1,024,000 bytes)
        const filteredFiles = selectedFiles.filter((file) => {
            if (file.size > 1024000) {
                largeFiles.push(file.name); // Collect large file names
                return false;
            }
            return true;
        });

        // If there are large files, show a single popup message
        if (largeFiles.length > 0) {
            setPopupContentMalert(
                `The following files are larger than 1MB and will not be uploaded:\n${largeFiles.join(", ")}`
            );
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }

        if (filteredFiles.length === 0) return; // If no valid files, exit

        setTransferUpload((prevFiles) => [
            ...prevFiles,
            ...filteredFiles.map((file) => ({
                file,
                remarks: ""
            })),
        ]);
    };
    const handleRemarkChangeTransferUpload = (value, index) => {
        setTransferUpload((prev) =>
            prev.map((file, i) =>
                i === index ? { ...file, remarks: value } : file
            )
        );
    };
    const handleFileDeleteReturn = (index) => {
        setReturnUpload((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };
    const handleResumeUploadReturn = (event) => {
        const selectedFiles = Array.from(event.target.files); // Convert FileList to Array
        if (!selectedFiles.length) return;

        let largeFiles = []; // To store names of files larger than 1MB

        // Filter files that are <= 1MB (1,024,000 bytes)
        const filteredFiles = selectedFiles.filter((file) => {
            if (file.size > 1024000) {
                largeFiles.push(file.name); // Collect large file names
                return false;
            }
            return true;
        });

        // If there are large files, show a single popup message
        if (largeFiles.length > 0) {
            setPopupContentMalert(
                `The following files are larger than 1MB and will not be uploaded:\n${largeFiles.join(", ")}`
            );
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }

        if (filteredFiles.length === 0) return; // If no valid files, exit

        setReturnUpload((prevFiles) => [
            ...prevFiles,
            ...filteredFiles.map((file) => ({
                file,
                remarks: ""
            })),
        ]);
    };
    const handleRemarkChangeUploadReturn = (value, index) => {
        setReturnUpload((prev) =>
            prev.map((file, i) =>
                i === index ? { ...file, remarks: value } : file
            )
        );
    };
    const [accordianCreateView, setAccordianCreateView] = useState([]);
    const [accordianCreateTransfer, setAccordianCreateTransfer] = useState([]);
    const [accordianCreateReturn, setAccordianCreateReturn] = useState([]);
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
    // const renderFilePreview = async (file) => {
    //     const response = await fetch(file.preview);
    //     const blob = await response.blob();
    //     const url = window.URL.createObjectURL(blob);
    //     const link = document.createElement("a");
    //     link.href = url;
    //     window.open(link, "_blank");
    // };
    // view model
    const handleClickOpenviewnear = () => {
        setOpenviewnear(true);
    };

    const handleCloseviewnear = () => {
        setOpenviewnear(false);
    };

    const fetchComponents = async (assetmaterial, code, setState) => {
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
            }).filter(obj => Object.keys(obj).length > 1); // Exclude empty objects

            // console.log(filteredArray);
            setState(filteredArray)
            // console.log(response?.data?.matchedObjects, "response?.data?.matchedObjects");
        } catch (err) {
            //   handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
            setState([]);
            console.log(err)
        }
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
            setAcceptLoader(params?.id);
            let formData = new FormData();

            const jsonData = {
                status: "Accepted",
                accepteddateandtime: new Date(),
                acceptedby: isUserRoleAccess?.companyname,
            }
            formData.append("jsonData", JSON.stringify(jsonData));
            let res = await axios.put(
                `${SERVICE.EMPLOYEEASSET_SINGLE}/${params?.id}`, formData,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },

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
            await fetchListData();
            //   handleCloseModEditNear();
            setPopupContent("Accepted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            setAcceptLoader("")
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const editSubmitTransfer = async (e) => {
        setPageName(!pageName)
        e.preventDefault();

        const isNameMatch = distributionDatas?.filter(data => data?.status !== "Returned").some(
            (item) =>
                item.assetmaterialcode === transferDetails.assetmaterialcode
        );
        if (transferDetails.company === "" || !transferDetails.company) {
            setPopupContentMalert("Please Select Company!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (transferDetails.branch?.length === 0) {
            setPopupContentMalert("Please Select Branch!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (transferDetails.unit?.length === 0) {
            setPopupContentMalert("Please Select Unit!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (transferDetails.team?.length === 0) {
            setPopupContentMalert("Please Select Team!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (transferDetails.employee === "" || !transferDetails.employee) {
            setPopupContentMalert("Please Select Employee!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (transferDetails.transferdate === "") {
            setPopupContentMalert("Please Select AssignDate!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (transferDetails.transfertime === "") {
            setPopupContentMalert("Please Select AssignTime!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (transferUpload.length === 0) {
            setPopupContentMalert("Please Upload Image!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        // else if (isNameMatch) {
        //     setPopupContentMalert("Data Already Exist!");
        //     setPopupSeverityMalert("info");
        //     handleClickOpenPopupMalert();
        // }
        else {
            sendTransferRequest();
        }
    };
    const editSubmitReturn = async (e) => {
        setPageName(!pageName)
        e.preventDefault();
        console.log(distributionDatas, "distributionDatas")
        console.log(returnDetails, "returnDetails")
        const isNameMatch = distributionDatas?.filter(data => data?.status !== "Returned" && data?._id !== returnDetails.distributionid).some(
            (item) =>
                item.assetmaterialcode === returnDetails.assetmaterialcode
        );
        if (returnDetails.returndate === "") {
            setPopupContentMalert("Please Select AssignDate!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (returnDetails.returntime === "") {
            setPopupContentMalert("Please Select AssignTime!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (returnDetails.company === "" || !returnDetails.company) {
            setPopupContentMalert("Please Select Company!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (returnDetails.branch === "" || !returnDetails.branch) {
            setPopupContentMalert("Please Select Branch!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (returnDetails.unit === "" || !returnDetails.unit) {
            setPopupContentMalert("Please Select Unit!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (returnDetails.team === "" || !returnDetails.team) {
            setPopupContentMalert("Please Select Team!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (returnDetails.employee === "" || !returnDetails.employee) {
            setPopupContentMalert("Please Select Employee!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }

        else if (returnUpload.length === 0) {
            setPopupContentMalert("Please Upload Image!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (isNameMatch) {
            setPopupContentMalert("Data Already Exist!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else {
            sendReturnRequest();
        }
    };

    useEffect(() => { fetchDistributionData() }, [])
    const [distributionDatas, setDistributionDatas] = useState([])
    const fetchDistributionData = async () => {
        setPageName(!pageName);
        try {

            let res_project = await axios.get(SERVICE.EMPLOYEEASSET, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let distribution = res_project?.data?.employeeassets
            setDistributionDatas(distribution)


        } catch (err) {
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };

    const sendTransferRequest = async () => {
        setPageName(!pageName)


        try {
            setIsLoading(true);
            // let subarray = selectedOptionsMaterial.map((item) => item.value);


            let selectedUserData = allUsersData?.find(item => item?.companyname === transferDetails?.employee)
            // const mergedArray = subarray.reduce((acc, curr) => acc.concat(curr), []);


            let formData = new FormData();

            if (transferUpload.length > 0) {
                transferUpload.forEach((item, index) => {
                    formData.append("images", item.file); // Append image file
                    formData.append(`remarks[${index}]`, item.remarks || ""); // Append corresponding remark
                });
            }

            const jsonData = {
                company: [transferDetails?.returncompany],
                branch: [transferDetails?.returnbranch],
                unit: [transferDetails?.returnunit],
                team: [transferDetails?.returnteam],
                employee: transferDetails?.returnemployee || "",
                distributionid: transferDetails?.distributionid || "",
                assetmaterial: transferDetails?.assetmaterial || "",
                assetmaterialcode: transferDetails?.assetmaterialcode || "",
                returntime: transferDetails?.transfertime || "",
                returndate: transferDetails?.transferdate || "",
                description: transferDetails?.description || "",
                addedby: [
                    {
                        name: String(isUserRoleAccess?.companyname),
                        date: String(new Date()),
                    },
                ],
            }
            formData.append("jsonData", JSON.stringify(jsonData));
            // const mergedArray = subarray.reduce((acc, curr) => acc.concat(curr), []);

            let resReturn = await axios.post(
                `${SERVICE.EMPLOYEEASSETRETURNREGISTER_CREATE}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );


            await updateDistributionStatus(transferDetails?.distributionid, "Returned", transferDetails?.assetmaterialcode);
            let formDataNew = new FormData();

            if (transferUpload.length > 0) {
                transferUpload.forEach((item, index) => {
                    formDataNew.append("images", item.file); // Append image file
                    formDataNew.append(`remarks[${index}]`, item.remarks || ""); // Append corresponding remark
                });
            }
            const jsonDataNew = {
                company: String(transferDetails?.assetcompany),
                branch: String(transferDetails?.assetbranch),
                unit: String(transferDetails?.assetunit),
                floor: String(transferDetails?.assetfloor),
                location: String(transferDetails?.assetlocation),
                area: String(transferDetails?.assetarea),
                employee: String(transferDetails?.employee),
                assetmaterial: transferDetails?.assetmaterial,
                assetmaterialcode: transferDetails?.assetmaterialcode,
                assetmaterialcheck: transferDetails?.assetmaterialcheck,
                assigndate: String(transferDetails?.transferdate),
                assigntime: String(transferDetails?.transfertime),
                companyto: String(selectedUserData?.company),
                branchto: [selectedUserData?.branch],
                unitto: [selectedUserData?.unit],
                teamto: [selectedUserData?.team],
                employeenameto: [transferDetails?.employee],
                uniqueid: 1,
                status: "Yet To Accept",
                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            }
            formDataNew.append("jsonData", JSON.stringify(jsonDataNew));
            let freqCreate = await axios.post(SERVICE.EMPLOYEEASSET_CREATE, formDataNew, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },


            });

            await fetchListData();
            handleCloseModTransfer();
            setIsLoading(false);
            setPopupContent("Transfered Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            console.log(err)
            setIsLoading(false);
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    const sendReturnRequest = async () => {
        setPageName(!pageName)


        try {
            setIsLoading(true);
            // let subarray = selectedOptionsMaterial.map((item) => item.value);


            let singleUser = allUsersData?.find(item => item?.companyname === returnDetails?.employee)
            // const mergedArray = subarray.reduce((acc, curr) => acc.concat(curr), []);

            let formData = new FormData();

            if (returnUpload.length > 0) {
                returnUpload.forEach((item, index) => {
                    formData.append("images", item.file); // Append image file
                    formData.append(`remarks[${index}]`, item.remarks || ""); // Append corresponding remark
                });
            }

            const jsonData = {
                company: [singleUser?.company],
                branch: [singleUser?.branch],
                unit: [singleUser?.unit],
                team: [singleUser?.team],
                employee: returnDetails?.employee || "",
                distributionid: returnDetails?.distributionid || "",
                assetmaterial: returnDetails?.assetmaterial || "",
                assetmaterialcode: returnDetails?.assetmaterialcode || "",
                returntime: returnDetails?.returntime || "",
                returndate: returnDetails?.returndate || "",
                description: returnDetails?.description || "",
                addedby: [
                    {
                        name: String(isUserRoleAccess?.companyname),
                        date: String(new Date()),
                    },
                ],
            }
            formData.append("jsonData", JSON.stringify(jsonData));

            let res = await axios.post(
                `${SERVICE.EMPLOYEEASSETRETURNREGISTER_CREATE}`, formData,

                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );


            await updateDistributionStatus(returnDetails?.distributionid, "Returned", returnDetails?.assetmaterialcode);
            await fetchListData();
            handleCloseModReturn();
            setIsLoading(false);
            setPopupContent("Returned Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            console.log(err)
            setIsLoading(false);
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const updateDistributionStatus = async (id, status, assetmaterial, assetcode, employee) => {
        setPageName(!pageName)

        try {
            let formData = new FormData();

            const jsonData = {
                status
            }
            formData.append("jsonData", JSON.stringify(jsonData));
            let res = await axios.put(
                `${SERVICE.EMPLOYEEASSET_SINGLE}/${id}`, formData,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },


                }
            );

            if (status === "Returned" && assetcode) {
                const resultss = await getTextAfterFirstDash(assetmaterial, assetcode);

                let resss = await axios.put(
                    `${SERVICE.ASSET_DISTRIBUTION_STATUS}`,
                    {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        code: resultss,
                        distributed: false,
                        distributedto: ""
                    }
                );
            }
            if (status === "Accepted" && assetcode && employee) {
                const resultss = await getTextAfterFirstDash(assetmaterial, assetcode);

                let resss = await axios.put(
                    `${SERVICE.ASSET_DISTRIBUTION_STATUS}`,
                    {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        code: resultss,
                        distributed: true,
                        distributedto: employee || ""
                    }
                );
            }
        } catch (err) {
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
            width: 350,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibilityTeamLveVerif.actions,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>



                    {isUserRoleCompare?.includes("vemployeeassetreturn/transferregister") && (

                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getviewCodeNear(params.data.id);
                            }}
                        >
                            <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("aemployeeassetreturnregister") &&
                        (
                            <>
                                <LoadingButton
                                    variant="contained"
                                    color="success"
                                    onClick={() => {
                                        getCodeReturn(params.data);
                                    }}
                                    size="small"
                                    loading={acceptLoader === params?.data?.id}
                                    sx={buttonStyles.buttonsubmit}
                                    loadingPosition="end"
                                >
                                    Return
                                </LoadingButton>
                            </>

                        )}
                    &nbsp;
                    &nbsp;
                    &nbsp;
                    {isUserRoleCompare?.includes("aemployeeassetdistributionregister") && (
                        <Button size="small" sx={{ backgroundColor: '#4caf50', color: '#fff', '&:hover': { backgroundColor: '#4caf50', color: '#fff' } }} onClick={() => { getCodeTransfer(params?.data) }} > <TransferWithinAStationIcon sx={{ marginRight: 1 }} /> Transfer </Button>
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
        documentTitle: "Employee Asset Return/Transfer Register",
        pageStyle: "print",
    });


    // image
    const handleCaptureImage = () => {
        if (gridRefImageTeamLveVerif.current) {
            domtoimage.toBlob(gridRefImageTeamLveVerif.current)
                .then((blob) => {
                    saveAs(blob, "Employee Asset Return/Transfer Register.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };



    //FILTER START
    useEffect(() => {
        fetchDepartments();
    }, []);
    const [departmentOptions, setDepartmentOptions] = useState([]);
    const fetchDepartments = async () => {
        setPageName(!pageName);
        try {
            let req = await axios.get(SERVICE.DEPARTMENT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setDepartmentOptions(
                req?.data?.departmentdetails?.map((data) => ({
                    label: data?.deptname,
                    value: data?.deptname,
                }))
            );
        } catch (err) {
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };
    const [employeeOptions, setEmployeeOptions] = useState([]);
    const [filterState, setFilterState] = useState({
        type: "Individual",
        employeestatus: "Please Select Employee Status",
    });
    const EmployeeStatusOptions = [
        { label: "Live Employee", value: "Live Employee" },
        { label: "Releave Employee", value: "Releave Employee" },
        { label: "Absconded", value: "Absconded" },
        { label: "Hold", value: "Hold" },
        { label: "Terminate", value: "Terminate" },
    ];
    const TypeOptions = [
        { label: "Individual", value: "Individual" },
        // { label: "Department", value: "Department" },
        { label: "Company", value: "Company" },
        { label: "Branch", value: "Branch" },
        { label: "Unit", value: "Unit" },
        { label: "Team", value: "Team" },
    ];

    //MULTISELECT ONCHANGE START

    //company multiselect
    const [selectedOptionsCompany, setSelectedOptionsCompany] = useState([]);
    let [valueCompanyCat, setValueCompanyCat] = useState([]);

    const handleCompanyChange = (options) => {
        setValueCompanyCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsCompany(options);
        setValueBranchCat([]);
        setSelectedOptionsBranch([]);
        setValueUnitCat([]);
        setSelectedOptionsUnit([]);
        setValueTeamCat([]);
        setSelectedOptionsTeam([]);
        setValueDepartmentCat([]);
        setSelectedOptionsDepartment([]);
        setValueEmployeeCat([]);
        setSelectedOptionsEmployee([]);
    };

    const customValueRendererCompany = (valueCompanyCat, _categoryname) => {
        return valueCompanyCat?.length
            ? valueCompanyCat.map(({ label }) => label)?.join(", ")
            : "Please Select Company";
    };

    //branch multiselect
    const [selectedOptionsBranch, setSelectedOptionsBranch] = useState([]);
    let [valueBranchCat, setValueBranchCat] = useState([]);

    const handleBranchChange = (options) => {
        setValueBranchCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsBranch(options);
        setValueUnitCat([]);
        setSelectedOptionsUnit([]);
        setValueTeamCat([]);
        setSelectedOptionsTeam([]);
        setValueDepartmentCat([]);
        setSelectedOptionsDepartment([]);
        setValueEmployeeCat([]);
        setSelectedOptionsEmployee([]);
    };

    const customValueRendererBranch = (valueBranchCat, _categoryname) => {
        return valueBranchCat?.length
            ? valueBranchCat.map(({ label }) => label)?.join(", ")
            : "Please Select Branch";
    };

    //unit multiselect
    const [selectedOptionsUnit, setSelectedOptionsUnit] = useState([]);
    let [valueUnitCat, setValueUnitCat] = useState([]);

    const handleUnitChange = (options) => {
        setValueUnitCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsUnit(options);
        setValueTeamCat([]);
        setSelectedOptionsTeam([]);
        setValueDepartmentCat([]);
        setSelectedOptionsDepartment([]);
        setValueEmployeeCat([]);
        setSelectedOptionsEmployee([]);
    };

    const customValueRendererUnit = (valueUnitCat, _categoryname) => {
        return valueUnitCat?.length
            ? valueUnitCat.map(({ label }) => label)?.join(", ")
            : "Please Select Unit";
    };

    //team multiselect
    const [selectedOptionsTeam, setSelectedOptionsTeam] = useState([]);
    let [valueTeamCat, setValueTeamCat] = useState([]);

    const handleTeamChange = (options) => {
        setValueTeamCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsTeam(options);
        setValueDepartmentCat([]);
        setSelectedOptionsDepartment([]);
        setValueEmployeeCat([]);
        setSelectedOptionsEmployee([]);
    };

    const customValueRendererTeam = (valueTeamCat, _categoryname) => {
        return valueTeamCat?.length
            ? valueTeamCat.map(({ label }) => label)?.join(", ")
            : "Please Select Team";
    };

    //department multiselect
    const [selectedOptionsDepartment, setSelectedOptionsDepartment] = useState(
        []
    );
    let [valueDepartmentCat, setValueDepartmentCat] = useState([]);

    const handleDepartmentChange = (options) => {
        setValueDepartmentCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsDepartment(options);
        setValueEmployeeCat([]);
        setSelectedOptionsEmployee([]);
    };

    const customValueRendererDepartment = (valueDepartmentCat, _categoryname) => {
        return valueDepartmentCat?.length
            ? valueDepartmentCat.map(({ label }) => label)?.join(", ")
            : "Please Select Department";
    };
    //employee multiselect
    const [selectedOptionsEmployee, setSelectedOptionsEmployee] = useState([]);
    let [valueEmployeeCat, setValueEmployeeCat] = useState([]);

    const handleEmployeeChange = (options) => {
        setValueEmployeeCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsEmployee(options);
    };

    const customValueRendererEmployee = (valueEmployeeCat, _categoryname) => {
        return valueEmployeeCat?.length
            ? valueEmployeeCat.map(({ label }) => label)?.join(", ")
            : "Please Select Employee";
    };

    //MULTISELECT ONCHANGE END
    const handleClearFilter = () => {
        setValueCompanyCat([]);
        setSelectedOptionsCompany([]);
        setValueBranchCat([]);
        setSelectedOptionsBranch([]);
        setValueUnitCat([]);
        setSelectedOptionsUnit([]);
        setValueTeamCat([]);
        setSelectedOptionsTeam([]);
        setValueDepartmentCat([]);
        setSelectedOptionsDepartment([]);
        setValueEmployeeCat([]);
        setSelectedOptionsEmployee([]);
        setEmployeeOptions([]);
        setApplyleaves([]);
        setFilterState({
            type: "Individual",
            employeestatus: "Please Select Employee Status",
        });

        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
    };

    const [filterLoader, setFilterLoader] = useState(false);
    const [tableLoader, setTableLoader] = useState(false);
    const handleFilter = () => {
        if (
            filterState?.type === "Please Select Type" ||
            filterState?.type === ""
        ) {
            setPopupContentMalert("Please Select Type!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (selectedOptionsCompany?.length === 0) {
            setPopupContentMalert("Please Select Company!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        // else if (
        //   filterState?.employeestatus === "Please Select Employee Status" ||
        //   filterState?.employeestatus === ""
        // ) {
        //   setPopupContentMalert("Please Select Employee Status!");
        //   setPopupSeverityMalert("warning");
        //   handleClickOpenPopupMalert();
        // }
        else if (
            ["Individual", "Branch", "Unit", "Team"]?.includes(filterState?.type) &&
            selectedOptionsBranch?.length === 0
        ) {
            setPopupContentMalert("Please Select Branch!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (
            ["Individual", "Unit", "Team"]?.includes(filterState?.type) &&
            selectedOptionsUnit?.length === 0
        ) {
            setPopupContentMalert("Please Select Unit!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (
            ["Individual", "Team"]?.includes(filterState?.type) &&
            selectedOptionsTeam?.length === 0
        ) {
            setPopupContentMalert("Please Select Team!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (
            filterState?.type === "Individual" &&
            selectedOptionsEmployee?.length === 0
        ) {
            setPopupContentMalert("Please Select Employee!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (
            filterState?.type === "Department" &&
            selectedOptionsDepartment?.length === 0
        ) {
            setPopupContentMalert("Please Select Department!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else {
            fetchListData();
        }
    };

    const fetchListData = async () => {
        setFilterLoader(true);
        setTableLoader(true);
        setPageName(!pageName);
        try {
            let response = await axios.post(
                SERVICE.FILTER_DISTRIBUTION_LIST,
                {
                    company:
                        valueCompanyCat?.length > 0 ? valueCompanyCat : allAssignCompany,
                    branch: valueBranchCat?.length > 0 ? valueBranchCat : allAssignBranch,
                    unit: valueUnitCat?.length > 0 ? valueUnitCat : allAssignUnit,
                    team: valueTeamCat,
                    employee: valueEmployeeCat,
                    status: ["Accepted"],
                },
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );

            setApplyleaves(response.data.distributiondatas?.map((item, index) => ({
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
            await fetchDistributionData();

            setSearchQueryManageTeamLveVerif("");
            setFilterLoader(false);
            setTableLoader(false);
        } catch (err) {
            console.log(err);
            setFilterLoader(true);
            setTableLoader(true);
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };

    //auto select all dropdowns
    const [allAssignCompany, setAllAssignCompany] = useState([]);
    const [allAssignBranch, setAllAssignBranch] = useState([]);
    const [allAssignUnit, setAllAssignUnit] = useState([]);
    const handleAutoSelect = async () => {
        setPageName(!pageName);
        try {
            let selectedValues = accessbranch
                ?.map((data) => ({
                    company: data.company,
                    branch: data.branch,
                    unit: data.unit,
                }))
                .filter(
                    (value, index, self) =>
                        index ===
                        self.findIndex(
                            (t) =>
                                t.company === value.company &&
                                t.branch === value.branch &&
                                t.unit === value.unit
                        )
                );
            let selectedCompany = selectedValues
                ?.filter(
                    (value, index, self) =>
                        index === self.findIndex((t) => t.company === value.company)
                )
                .map((a, index) => {
                    return a.company;
                });

            let mappedCompany = selectedValues
                ?.filter(
                    (value, index, self) =>
                        index === self.findIndex((t) => t.company === value.company)
                )
                ?.map((data) => ({
                    label: data?.company,
                    value: data?.company,
                }));

            setValueCompanyCat(selectedCompany);
            setSelectedOptionsCompany(mappedCompany);

            let selectedBranch = selectedValues
                .filter(
                    (value, index, self) =>
                        index ===
                        self.findIndex(
                            (t) => t.company === value.company && t.branch === value.branch
                        )
                )
                .map((a, index) => {
                    return a.branch;
                });

            let mappedBranch = selectedValues
                .filter(
                    (value, index, self) =>
                        index ===
                        self.findIndex(
                            (t) => t.company === value.company && t.branch === value.branch
                        )
                )
                ?.map((data) => ({
                    label: data?.branch,
                    value: data?.branch,
                }));

            setValueBranchCat(selectedBranch);
            setSelectedOptionsBranch(mappedBranch);

            let selectedUnit = selectedValues
                .filter(
                    (value, index, self) =>
                        index ===
                        self.findIndex(
                            (t) =>
                                t.company === value.company &&
                                t.branch === value.branch &&
                                t.unit === value.unit
                        )
                )
                .map((a, index) => {
                    return a.unit;
                });

            let mappedUnit = selectedValues
                .filter(
                    (value, index, self) =>
                        index ===
                        self.findIndex(
                            (t) =>
                                t.company === value.company &&
                                t.branch === value.branch &&
                                t.unit === value.unit
                        )
                )
                ?.map((data) => ({
                    label: data?.unit,
                    value: data?.unit,
                }));

            setValueUnitCat(selectedUnit);
            setSelectedOptionsUnit(mappedUnit);

            let mappedTeam = allTeam
                ?.filter(
                    (u) =>
                        selectedCompany?.includes(u.company) &&
                        selectedBranch?.includes(u.branch) &&
                        selectedUnit?.includes(u.unit)
                )
                .map((u) => ({
                    label: u.teamname,
                    value: u.teamname,
                }));

            let selectedTeam = allTeam
                ?.filter(
                    (u) =>
                        selectedCompany?.includes(u.company) &&
                        selectedBranch?.includes(u.branch) &&
                        selectedUnit?.includes(u.unit)
                )
                .map((u) => u.teamname);

            let mappedemployees = allUsersData
                ?.filter(
                    (u) =>
                        selectedCompany?.includes(u.company) &&
                        selectedBranch?.includes(u.branch) &&
                        selectedUnit?.includes(u.unit) &&
                        selectedTeam?.includes(u.team) &&
                        u.workmode !== "Internship"
                )
                .map((u) => ({
                    label: u.companyname,
                    value: u.companyname,
                }));

            let employees = allUsersData
                ?.filter(
                    (u) =>
                        selectedCompany?.includes(u.company) &&
                        selectedBranch?.includes(u.branch) &&
                        selectedUnit?.includes(u.unit) &&
                        selectedTeam?.includes(u.team) &&
                        u.workmode !== "Internship"
                )
                .map((u) => u.companyname);
            setValueTeamCat(selectedTeam);
            setSelectedOptionsTeam(mappedTeam);
            setAllAssignCompany(selectedCompany);

            setAllAssignBranch(selectedBranch);

            setAllAssignUnit(selectedUnit);

            setValueEmployeeCat(employees);
            setSelectedOptionsEmployee(mappedemployees);
        } catch (err) {
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };

    useEffect(() => {
        handleAutoSelect();
    }, [isAssignBranch]);

    //FILTER END

    return (
        <Box>
            <Headtitle title={"EMPLOYEE ASSET RETURN/TRANSFER REGISTER"} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Employee Asset Return/Transfer Register"
                modulename="Asset"
                submodulename="Asset Register"
                mainpagename="Employee Asset Return/Transfer Register"
                subpagename=""
                subsubpagename=""
            />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lemployeeassetreturn/transferregister") && (
                <>
                    <Box sx={userStyle.selectcontainer}>
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext}>
                                        Employee Asset Return/Transfer Register Filter
                                    </Typography>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Type<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={TypeOptions}
                                            styles={colourStyles}
                                            value={{
                                                label: filterState.type ?? "Please Select Type",
                                                value: filterState.type ?? "Please Select Type",
                                            }}
                                            onChange={(e) => {
                                                setFilterState((prev) => ({
                                                    ...prev,
                                                    type: e.value,
                                                }));
                                                setValueCompanyCat([]);
                                                setSelectedOptionsCompany([]);
                                                setValueBranchCat([]);
                                                setSelectedOptionsBranch([]);
                                                setValueUnitCat([]);
                                                setSelectedOptionsUnit([]);
                                                setValueTeamCat([]);
                                                setSelectedOptionsTeam([]);
                                                setValueDepartmentCat([]);
                                                setSelectedOptionsDepartment([]);
                                                setValueEmployeeCat([]);
                                                setSelectedOptionsEmployee([]);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <Typography>
                                        Company<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <FormControl size="small" fullWidth>
                                        <MultiSelect
                                            options={accessbranch
                                                ?.map((data) => ({
                                                    label: data.company,
                                                    value: data.company,
                                                }))
                                                .filter((item, index, self) => {
                                                    return (
                                                        self.findIndex(
                                                            (i) =>
                                                                i.label === item.label &&
                                                                i.value === item.value
                                                        ) === index
                                                    );
                                                })}
                                            value={selectedOptionsCompany}
                                            onChange={(e) => {
                                                handleCompanyChange(e);
                                            }}
                                            valueRenderer={customValueRendererCompany}
                                            labelledBy="Please Select Company"
                                        />
                                    </FormControl>
                                </Grid>

                                {/* <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Employee Status<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={EmployeeStatusOptions}
                        styles={colourStyles}
                        value={{
                          label:
                            filterState.employeestatus ??
                            "Please Select Employee Status",
                          value:
                            filterState.employeestatus ??
                            "Please Select Employee Status",
                        }}
                        onChange={(e) => {
                          setFilterState((prev) => ({
                            ...prev,
                            employeestatus: e.value,
                          }));
                          setValueBranchCat([]);
                          setSelectedOptionsBranch([]);
                          setValueUnitCat([]);
                          setSelectedOptionsUnit([]);
                          setValueTeamCat([]);
                          setSelectedOptionsTeam([]);
                          setValueDepartmentCat([]);
                          setSelectedOptionsDepartment([]);
                          setValueEmployeeCat([]);
                          setSelectedOptionsEmployee([]);
                        }}
                      />
                    </FormControl>
                  </Grid> */}

                                {["Individual", "Team"]?.includes(filterState.type) ? (
                                    <>
                                        {/* Branch Unit Team */}
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    {" "}
                                                    Branch<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={accessbranch
                                                        ?.filter((comp) =>
                                                            valueCompanyCat?.includes(comp.company)
                                                        )
                                                        ?.map((data) => ({
                                                            label: data.branch,
                                                            value: data.branch,
                                                        }))
                                                        .filter((item, index, self) => {
                                                            return (
                                                                self.findIndex(
                                                                    (i) =>
                                                                        i.label === item.label &&
                                                                        i.value === item.value
                                                                ) === index
                                                            );
                                                        })}
                                                    value={selectedOptionsBranch}
                                                    onChange={(e) => {
                                                        handleBranchChange(e);
                                                    }}
                                                    valueRenderer={customValueRendererBranch}
                                                    labelledBy="Please Select Branch"
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    {" "}
                                                    Unit<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={accessbranch
                                                        ?.filter(
                                                            (comp) =>
                                                                valueCompanyCat?.includes(comp.company) &&
                                                                valueBranchCat?.includes(comp.branch)
                                                        )
                                                        ?.map((data) => ({
                                                            label: data.unit,
                                                            value: data.unit,
                                                        }))
                                                        .filter((item, index, self) => {
                                                            return (
                                                                self.findIndex(
                                                                    (i) =>
                                                                        i.label === item.label &&
                                                                        i.value === item.value
                                                                ) === index
                                                            );
                                                        })}
                                                    value={selectedOptionsUnit}
                                                    onChange={(e) => {
                                                        handleUnitChange(e);
                                                    }}
                                                    valueRenderer={customValueRendererUnit}
                                                    labelledBy="Please Select Unit"
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={6}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Team<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={allTeam
                                                        ?.filter(
                                                            (u) =>
                                                                valueCompanyCat?.includes(u.company) &&
                                                                valueBranchCat?.includes(u.branch) &&
                                                                valueUnitCat?.includes(u.unit)
                                                        )
                                                        .map((u) => ({
                                                            ...u,
                                                            label: u.teamname,
                                                            value: u.teamname,
                                                        }))}
                                                    value={selectedOptionsTeam}
                                                    onChange={(e) => {
                                                        handleTeamChange(e);
                                                    }}
                                                    valueRenderer={customValueRendererTeam}
                                                    labelledBy="Please Select Team"
                                                />
                                            </FormControl>
                                        </Grid>
                                    </>
                                ) : ["Department"]?.includes(filterState.type) ? (
                                    <>
                                        {/* Department */}
                                        <Grid item md={3} xs={12} sm={6}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Department<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={departmentOptions}
                                                    value={selectedOptionsDepartment}
                                                    onChange={(e) => {
                                                        handleDepartmentChange(e);
                                                    }}
                                                    valueRenderer={customValueRendererDepartment}
                                                    labelledBy="Please Select Department"
                                                />
                                            </FormControl>
                                        </Grid>
                                    </>
                                ) : ["Branch"]?.includes(filterState.type) ? (
                                    <>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    {" "}
                                                    Branch<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={accessbranch
                                                        ?.filter((comp) =>
                                                            valueCompanyCat?.includes(comp.company)
                                                        )
                                                        ?.map((data) => ({
                                                            label: data.branch,
                                                            value: data.branch,
                                                        }))
                                                        .filter((item, index, self) => {
                                                            return (
                                                                self.findIndex(
                                                                    (i) =>
                                                                        i.label === item.label &&
                                                                        i.value === item.value
                                                                ) === index
                                                            );
                                                        })}
                                                    value={selectedOptionsBranch}
                                                    onChange={(e) => {
                                                        handleBranchChange(e);
                                                    }}
                                                    valueRenderer={customValueRendererBranch}
                                                    labelledBy="Please Select Branch"
                                                />
                                            </FormControl>
                                        </Grid>
                                    </>
                                ) : ["Unit"]?.includes(filterState.type) ? (
                                    <>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    {" "}
                                                    Branch<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={accessbranch
                                                        ?.filter((comp) =>
                                                            valueCompanyCat?.includes(comp.company)
                                                        )
                                                        ?.map((data) => ({
                                                            label: data.branch,
                                                            value: data.branch,
                                                        }))
                                                        .filter((item, index, self) => {
                                                            return (
                                                                self.findIndex(
                                                                    (i) =>
                                                                        i.label === item.label &&
                                                                        i.value === item.value
                                                                ) === index
                                                            );
                                                        })}
                                                    value={selectedOptionsBranch}
                                                    onChange={(e) => {
                                                        handleBranchChange(e);
                                                    }}
                                                    valueRenderer={customValueRendererBranch}
                                                    labelledBy="Please Select Branch"
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    {" "}
                                                    Unit <b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={accessbranch
                                                        ?.filter(
                                                            (comp) =>
                                                                valueCompanyCat?.includes(comp.company) &&
                                                                valueBranchCat?.includes(comp.branch)
                                                        )
                                                        ?.map((data) => ({
                                                            label: data.unit,
                                                            value: data.unit,
                                                        }))
                                                        .filter((item, index, self) => {
                                                            return (
                                                                self.findIndex(
                                                                    (i) =>
                                                                        i.label === item.label &&
                                                                        i.value === item.value
                                                                ) === index
                                                            );
                                                        })}
                                                    value={selectedOptionsUnit}
                                                    onChange={(e) => {
                                                        handleUnitChange(e);
                                                    }}
                                                    valueRenderer={customValueRendererUnit}
                                                    labelledBy="Please Select Unit"
                                                />
                                            </FormControl>
                                        </Grid>
                                    </>
                                ) : (
                                    ""
                                )}
                                {["Individual"]?.includes(filterState.type) && (
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Employee<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <MultiSelect
                                                options={allUsersData
                                                    ?.filter(
                                                        (u) =>
                                                            valueCompanyCat?.includes(u.company) &&
                                                            valueBranchCat?.includes(u.branch) &&
                                                            valueUnitCat?.includes(u.unit) &&
                                                            valueTeamCat?.includes(u.team) &&
                                                            u.workmode !== "Internship"
                                                    )
                                                    .map((u) => ({
                                                        label: u.companyname,
                                                        value: u.companyname,
                                                    }))}
                                                value={selectedOptionsEmployee}
                                                onChange={(e) => {
                                                    handleEmployeeChange(e);
                                                }}
                                                valueRenderer={customValueRendererEmployee}
                                                labelledBy="Please Select Employee"
                                            />
                                        </FormControl>
                                    </Grid>
                                )}
                                <Grid item md={3} xs={12} sm={6} mt={3}>
                                    <div style={{ display: "flex", gap: "20px" }}>
                                        <LoadingButton
                                            variant="contained"
                                            color="primary"
                                            onClick={handleFilter}
                                            loading={filterLoader}
                                            sx={buttonStyles.buttonsubmit}
                                        >
                                            Filter
                                        </LoadingButton>

                                        <Button
                                            sx={buttonStyles.btncancel}
                                            onClick={handleClearFilter}
                                        >
                                            Clear
                                        </Button>
                                    </div>
                                </Grid>
                            </Grid>
                        </>
                    </Box>
                </>
            )} <br />
            {isUserRoleCompare?.includes("lemployeeassetreturn/transferregister") && (
                <>
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>
                                Employee Asset Return/Transfer Register List
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
                                        "excelemployeeassetreturn/transferregister"
                                    ) && (
                                            <>
                                                <Button onClick={(e) => {
                                                    setIsFilterOpen(true)
                                                    setFormat("xl")
                                                }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                            </>
                                        )}
                                    {isUserRoleCompare?.includes("csvemployeeassetreturn/transferregister") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes(
                                        "printemployeeassetreturn/transferregister"
                                    ) && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                    &ensp;
                                                    <FaPrint />
                                                    &ensp;Print&ensp;
                                                </Button>
                                            </>
                                        )}
                                    {isUserRoleCompare?.includes("pdfemployeeassetreturn/transferregister") && (
                                        <>
                                            <Button sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true)
                                                }}
                                            ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes(
                                        "imageemployeeassetreturn/transferregister"
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

                        </Grid>
                        <br />
                        {tableLoader ? (
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
                filename={"Employee Asset Return/Transfer Register"}
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
                                                    {file?.mimetype?.includes("image/") ? (
                                                        <img
                                                            src={file.preview ? file.preview : `${SERVICE.VEIW_ASSET_REGISTER_FILES}/${file.filename}`} // Use the correct server path
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
                                                    onClick={() => {
                                                        if (file.preview) {
                                                            renderFilePreviewBase64(file)
                                                        } else {
                                                            renderFilePreviewMulterUploaded(file)
                                                        }
                                                    }
                                                    }
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


            {/* Transfer DIALOG */}
            <Dialog
                open={isTransferOpen}
                onClose={handleCloseModTransfer}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="lg"
                fullWidth={true}

                sx={{
                    overflow: "auto",
                    "& .MuiPaper-root": {
                        overflow: "auto",
                    },
                    marginTop: "95px"
                }}
            >
                <Box sx={{ padding: "10px 20px", overflow: "auto" }}>
                    <>
                        <Grid container spacing={2}>
                            <Typography sx={userStyle.HeaderText}>
                                Return and Transfer Asset
                            </Typography>
                        </Grid>
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Company
                                    </Typography>
                                    <OutlinedInput
                                        readOnly
                                        id="component-outlined"
                                        type="text"
                                        value={transferDetails?.assetcompany}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Branch
                                    </Typography>
                                    <OutlinedInput
                                        readOnly
                                        id="component-outlined"
                                        type="text"
                                        value={transferDetails?.assetbranch}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Unit
                                    </Typography>
                                    <OutlinedInput
                                        readOnly
                                        id="component-outlined"
                                        type="text"
                                        value={transferDetails?.assetunit}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Floor
                                    </Typography>
                                    <OutlinedInput
                                        readOnly
                                        id="component-outlined"
                                        type="text"
                                        value={transferDetails?.assetfloor}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Area
                                    </Typography>
                                    <OutlinedInput
                                        readOnly
                                        id="component-outlined"
                                        type="text"
                                        value={transferDetails?.assetarea}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Location
                                    </Typography>
                                    <OutlinedInput
                                        readOnly
                                        id="component-outlined"
                                        type="text"
                                        value={transferDetails?.assetlocation}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Asset Material
                                    </Typography>
                                    <OutlinedInput
                                        readOnly
                                        id="component-outlined"
                                        type="text"
                                        value={transferDetails?.assetmaterial}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Asset Material Code
                                    </Typography>
                                    <OutlinedInput
                                        readOnly
                                        id="component-outlined"
                                        type="text"
                                        value={transferDetails?.assetmaterialcode}
                                    />
                                </FormControl>
                            </Grid>
                            {accordianCreateTransfer?.length > 0 &&
                                <Grid item md={12} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Accordion data={accordianCreateTransfer} />
                                    </FormControl>
                                </Grid>}
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Return Date
                                    </Typography>
                                    <OutlinedInput
                                        value={transferDetails.transferdate}
                                        type="date"
                                        // onChange={(e) => {
                                        //     setTransferDetails((prev) => ({
                                        //         ...prev,
                                        //         transferdate: e.target.value,
                                        //     }));
                                        // }}
                                        readOnly
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Return Time
                                    </Typography>
                                    <OutlinedInput
                                        value={transferDetails.transfertime}
                                        type="time"
                                        // onChange={(e) => {
                                        //     setTransferDetails((prev) => ({
                                        //         ...prev,
                                        //         transfertime: e.target.value,
                                        //     }));
                                        // }}
                                        readOnly
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Return To
                                    </Typography>
                                    <OutlinedInput
                                        readOnly
                                        id="component-outlined"
                                        type="text"
                                        value={transferDetails?.returnemployee}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Description
                                    </Typography>
                                    <TextareaAutosize
                                        aria-label="minimum height"
                                        minRows={2.5}
                                        value={transferDetails.description}
                                        onChange={(e) => {
                                            setTransferDetails((prev) => ({
                                                ...prev,
                                                description: e.target.value,
                                            }));
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <Typography sx={userStyle.importheadtext}>
                                    Assigned Person
                                </Typography>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Company<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Selects
                                        options={isAssignBranch
                                            ?.map((data) => ({
                                                label: data.company,
                                                value: data.company,
                                            }))
                                            .filter((item, index, self) => {
                                                return (
                                                    self.findIndex(
                                                        (i) =>
                                                            i.label === item.label && i.value === item.value
                                                    ) === index
                                                );
                                            })}
                                        styles={colourStyles}
                                        value={{
                                            label: transferDetails.company ? transferDetails.company : "Please Select Company",
                                            value: transferDetails.company ? transferDetails.company : "Please Select Company",
                                        }}
                                        onChange={(e) => {
                                            setTransferDetails((prev) => ({
                                                ...prev,
                                                company: e.value,
                                                branch: [],
                                                unit: [],
                                                team: [],
                                                employee: "",
                                            }));
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Branch<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <MultiSelect
                                        options={isAssignBranch
                                            ?.filter(
                                                (comp) =>
                                                    transferDetails.company === comp.company
                                            )
                                            ?.map((data) => ({
                                                label: data.branch,
                                                value: data.branch,
                                            }))
                                            .filter((item, index, self) => {
                                                return (
                                                    self.findIndex(
                                                        (i) =>
                                                            i.label === item.label && i.value === item.value
                                                    ) === index
                                                );
                                            })}
                                        value={transferDetails.branch}
                                        onChange={(e) => {
                                            setTransferDetails((prev) => ({
                                                ...prev,
                                                branch: e,
                                                unit: [],
                                                team: [],
                                                employee: "",
                                            }));
                                        }}
                                        valueRenderer={customValueRendererBranch}
                                        labelledBy="Please Select Branch"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Unit<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <MultiSelect
                                        options={isAssignBranch
                                            ?.filter(
                                                (comp) =>
                                                    transferDetails.company === comp.company &&
                                                    transferDetails.branch
                                                        .map((item) => item.value)
                                                        .includes(comp.branch)
                                            )
                                            ?.map((data) => ({
                                                label: data.unit,
                                                value: data.unit,
                                            }))
                                            .filter((item, index, self) => {
                                                return (
                                                    self.findIndex(
                                                        (i) =>
                                                            i.label === item.label && i.value === item.value
                                                    ) === index
                                                );
                                            })}
                                        value={transferDetails.unit}
                                        onChange={(e) => {
                                            setTransferDetails((prev) => ({
                                                ...prev,
                                                unit: e,
                                                team: [],
                                                employee: "",
                                            }));
                                        }}
                                        valueRenderer={customValueRendererUnit}
                                        labelledBy="Please Select Branch"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Team<b style={{ color: "red" }}>*</b>
                                    </Typography>

                                    <MultiSelect
                                        options={allTeam
                                            ?.filter(
                                                (comp) =>
                                                    transferDetails.company === comp.company &&
                                                    transferDetails.branch
                                                        .map((item) => item.value)
                                                        .includes(comp.branch) &&
                                                    transferDetails.unit
                                                        .map((item) => item.value)
                                                        .includes(comp.unit)
                                            )
                                            ?.map((data) => ({
                                                label: data.teamname,
                                                value: data.teamname,
                                            }))
                                            .filter((item, index, self) => {
                                                return (
                                                    self.findIndex(
                                                        (i) =>
                                                            i.label === item.label && i.value === item.value
                                                    ) === index
                                                );
                                            })}
                                        value={transferDetails.team}
                                        onChange={(e) => {
                                            setTransferDetails((prev) => ({
                                                ...prev,
                                                team: e,
                                                employee: "",
                                            }));
                                        }}
                                        valueRenderer={customValueRendererTeam}
                                        labelledBy="Please Select team"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Employee Name <b style={{ color: "red" }}>*</b>
                                    </Typography>

                                    <Selects
                                        options={allUsersData
                                            ?.filter(
                                                (comp) =>
                                                    transferDetails?.company === comp.company &&
                                                    transferDetails?.branch
                                                        .map((item) => item.value)
                                                        .includes(comp.branch) &&
                                                    transferDetails?.unit
                                                        .map((item) => item.value)
                                                        .includes(comp.unit) &&
                                                    transferDetails?.team
                                                        .map((item) => item.value)
                                                        .includes(comp.team) &&
                                                    transferDetails?.returnemployee !== comp?.companyname
                                            )
                                            ?.map((com) => ({
                                                ...com,
                                                label: com.companyname,
                                                value: com.companyname,
                                            }))}
                                        value={{
                                            label: transferDetails?.employee ? transferDetails?.employee : "Please Select Employee",
                                            value: transferDetails?.employee ? transferDetails?.employee : "Please Select Employee",
                                        }}
                                        onChange={(e) => {
                                            setTransferDetails((prev) => ({
                                                ...prev,
                                                employee: e.value,
                                            }));
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Assign Date <b style={{ color: "red" }}>*</b>{" "}
                                    </Typography>
                                    <OutlinedInput
                                        value={transferDetails.transferdate}
                                        type="date"
                                        onChange={(e) => {
                                            setTransferDetails((prev) => ({
                                                ...prev,
                                                transferdate: e.target.value,
                                            }));
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Assign Time <b style={{ color: "red" }}>*</b>{" "}
                                    </Typography>
                                    <OutlinedInput
                                        value={transferDetails.transfertime}
                                        type="time"
                                        onChange={(e) => {
                                            setTransferDetails((prev) => ({
                                                ...prev,
                                                transfertime: e.target.value,
                                            }));
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid
                            item
                            lg={2}
                            md={2}
                            xs={12}
                            sm={12}
                            sx={{ marginTop: "20px" }}
                        >
                            <Typography
                                sx={userStyle.importheadtext}
                                style={{ marginLeft: "5px" }}
                            >
                                Image <b style={{ color: "red" }}>*</b>
                            </Typography>
                            <Button variant="contained" size="small" component="label" sx={buttonStyles.buttonsubmit}>
                                Upload
                                <input
                                    type="file"
                                    id="resume"
                                    multiple
                                    // accept="image/*"
                                    name="file"
                                    hidden
                                    onChange={handleResumeUploadTransfer}
                                />
                            </Button>
                        </Grid>
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            {transferUpload?.length > 0 && transferUpload?.map((data, index) => {
                                const fileURL = URL.createObjectURL(data.file);
                                return (
                                    <Grid
                                        container
                                        key={index}
                                        alignItems="center"
                                        spacing={2}
                                        sx={{
                                            padding: "8px 0",
                                            borderBottom: "1px solid #ddd",
                                        }}
                                    >
                                        {/* File Icon */}
                                        <Grid item md={1} sm={2} xs={2}>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }}
                                            >
                                                {data?.file?.type?.includes("image/") ? (
                                                    <img
                                                        src={fileURL}
                                                        alt={data.file.name}
                                                        height={50}
                                                        style={{
                                                            maxWidth: "100%",
                                                        }}
                                                        onLoad={() => URL.revokeObjectURL(fileURL)} // Free up memory when image loads
                                                    />
                                                ) : (
                                                    <img
                                                        className={classes.preview}
                                                        src={getFileIcon(data.file.name)}
                                                        height="25"
                                                        alt="file icon"
                                                    />
                                                )}
                                            </Box>
                                        </Grid>

                                        {/* File Name */}
                                        <Grid item md={3} sm={3} xs={3}>
                                            <Typography
                                                variant="subtitle2"
                                                sx={{
                                                    whiteSpace: "nowrap",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                }}
                                            >
                                                {data.file.name}
                                            </Typography>
                                        </Grid>

                                        {/* Remarks Input */}
                                        <Grid item md={4} sm={4} xs={4}>
                                            <TextField
                                                variant="outlined"
                                                size="small"
                                                placeholder="Enter remarks"
                                                value={data?.remarks || ""}
                                                onChange={(e) => handleRemarkChangeTransferUpload(e.target.value, index)}
                                                fullWidth
                                            />
                                        </Grid>

                                        {/* View and Delete Icons */}
                                        <Grid
                                            item
                                            md={4}
                                            sm={3}
                                            xs={3}
                                            sx={{
                                                display: "flex",
                                                justifyContent: "flex-end",
                                                gap: 1,
                                            }}
                                        >
                                            <Button
                                                sx={{
                                                    padding: "6px",
                                                    minWidth: "36px",
                                                    borderRadius: "50%",
                                                    ":hover": {
                                                        backgroundColor: "#f0f0f0",
                                                    },
                                                }}
                                                onClick={() => renderFilePreview(data.file)}
                                            >
                                                <VisibilityOutlinedIcon
                                                    style={{ fontSize: "18px", color: "#357AE8" }}
                                                />
                                            </Button>
                                            <Button
                                                sx={{
                                                    padding: "6px",
                                                    minWidth: "36px",
                                                    borderRadius: "50%",
                                                    ":hover": {
                                                        backgroundColor: "#f0f0f0",
                                                    },
                                                }}
                                                onClick={() => handleFileDeleteTransfer(index)}
                                            >
                                                <FaTrash
                                                    style={{ fontSize: "18px", color: "#a73131" }}
                                                />
                                            </Button>
                                        </Grid>
                                    </Grid>
                                )
                            })}
                        </Grid>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12} sm={12}>
                                <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={editSubmitTransfer}>
                                    {" "}
                                    Submit
                                </Button>
                            </Grid>
                            <br />
                            <Grid item md={6} xs={12} sm={12}>
                                <Button
                                    sx={buttonStyles.btncancel}
                                    onClick={handleCloseModTransfer}
                                >
                                    {" "}
                                    Cancel{" "}
                                </Button>
                            </Grid>
                        </Grid>
                    </>
                </Box>
            </Dialog>
            {/* Return DIALOG */}
            <Dialog
                open={isReturnOpen}
                onClose={handleCloseModReturn}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="lg"
                fullWidth={true}

                sx={{
                    overflow: "auto",
                    "& .MuiPaper-root": {
                        overflow: "auto",
                    },
                    marginTop: "95px"
                }}
            >
                <Box sx={{ padding: "10px 20px", overflow: "auto" }}>
                    <>
                        <Grid container spacing={2}>
                            <Typography sx={userStyle.HeaderText}>
                                Return Asset
                            </Typography>
                        </Grid>
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Company
                                    </Typography>
                                    <OutlinedInput
                                        readOnly
                                        id="component-outlined"
                                        type="text"
                                        value={returnDetails?.assetcompany}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Branch
                                    </Typography>
                                    <OutlinedInput
                                        readOnly
                                        id="component-outlined"
                                        type="text"
                                        value={returnDetails?.assetbranch}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Unit
                                    </Typography>
                                    <OutlinedInput
                                        readOnly
                                        id="component-outlined"
                                        type="text"
                                        value={returnDetails?.assetunit}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Floor
                                    </Typography>
                                    <OutlinedInput
                                        readOnly
                                        id="component-outlined"
                                        type="text"
                                        value={returnDetails?.assetfloor}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Area
                                    </Typography>
                                    <OutlinedInput
                                        readOnly
                                        id="component-outlined"
                                        type="text"
                                        value={returnDetails?.assetarea}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Location
                                    </Typography>
                                    <OutlinedInput
                                        readOnly
                                        id="component-outlined"
                                        type="text"
                                        value={returnDetails?.assetlocation}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Asset Material
                                    </Typography>
                                    <OutlinedInput
                                        readOnly
                                        id="component-outlined"
                                        type="text"
                                        value={returnDetails?.assetmaterial}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Asset Material Code
                                    </Typography>
                                    <OutlinedInput
                                        readOnly
                                        id="component-outlined"
                                        type="text"
                                        value={returnDetails?.assetmaterialcode}
                                    />
                                </FormControl>
                            </Grid>
                            {accordianCreateReturn?.length > 0 &&
                                <Grid item md={12} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Accordion data={accordianCreateReturn} />
                                    </FormControl>
                                </Grid>}
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Return Date <b style={{ color: "red" }}>*</b>{" "}
                                    </Typography>
                                    <OutlinedInput
                                        value={returnDetails.returndate}
                                        type="date"
                                        onChange={(e) => {
                                            setReturnDetails((prev) => ({
                                                ...prev,
                                                returndate: e.target.value,
                                            }));
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Return Time <b style={{ color: "red" }}>*</b>{" "}
                                    </Typography>
                                    <OutlinedInput
                                        value={returnDetails.returntime}
                                        type="time"
                                        onChange={(e) => {
                                            setReturnDetails((prev) => ({
                                                ...prev,
                                                returntime: e.target.value,
                                            }));
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Description
                                    </Typography>
                                    <TextareaAutosize
                                        aria-label="minimum height"
                                        minRows={2.5}
                                        value={returnDetails.description}
                                        onChange={(e) => {
                                            setReturnDetails((prev) => ({
                                                ...prev,
                                                description: e.target.value,
                                            }));
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <Typography sx={userStyle.importheadtext}>
                                    Return Person
                                </Typography>
                            </Grid>
                            {/* <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Company<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Selects
                                        options={isAssignBranch
                                            ?.map((data) => ({
                                                label: data.company,
                                                value: data.company,
                                            }))
                                            .filter((item, index, self) => {
                                                return (
                                                    self.findIndex(
                                                        (i) =>
                                                            i.label === item.label && i.value === item.value
                                                    ) === index
                                                );
                                            })}
                                        styles={colourStyles}
                                        value={{
                                            label: returnDetails.company ? returnDetails.company : "Please Select Company",
                                            value: returnDetails.company ? returnDetails.company : "Please Select Company",
                                        }}
                                        onChange={(e) => {
                                            setReturnDetails((prev) => ({
                                                ...prev,
                                                company: e.value,
                                                branch: [],
                                                unit: [],
                                                team: [],
                                                employee: "",
                                            }));
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Branch<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <MultiSelect
                                        options={isAssignBranch
                                            ?.filter(
                                                (comp) =>
                                                    returnDetails.company === comp.company
                                            )
                                            ?.map((data) => ({
                                                label: data.branch,
                                                value: data.branch,
                                            }))
                                            .filter((item, index, self) => {
                                                return (
                                                    self.findIndex(
                                                        (i) =>
                                                            i.label === item.label && i.value === item.value
                                                    ) === index
                                                );
                                            })}
                                        value={returnDetails.branch}
                                        onChange={(e) => {
                                            setReturnDetails((prev) => ({
                                                ...prev,
                                                branch: e,
                                                unit: [],
                                                team: [],
                                                employee: "",
                                            }));
                                        }}
                                        valueRenderer={customValueRendererBranch}
                                        labelledBy="Please Select Branch"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Unit<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <MultiSelect
                                        options={isAssignBranch
                                            ?.filter(
                                                (comp) =>
                                                    returnDetails.company === comp.company &&
                                                    returnDetails.branch
                                                        .map((item) => item.value)
                                                        .includes(comp.branch)
                                            )
                                            ?.map((data) => ({
                                                label: data.unit,
                                                value: data.unit,
                                            }))
                                            .filter((item, index, self) => {
                                                return (
                                                    self.findIndex(
                                                        (i) =>
                                                            i.label === item.label && i.value === item.value
                                                    ) === index
                                                );
                                            })}
                                        value={returnDetails.unit}
                                        onChange={(e) => {
                                            setReturnDetails((prev) => ({
                                                ...prev,
                                                unit: e,
                                                team: [],
                                                employee: "",
                                            }));
                                        }}
                                        valueRenderer={customValueRendererUnit}
                                        labelledBy="Please Select Branch"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Team<b style={{ color: "red" }}>*</b>
                                    </Typography>

                                    <MultiSelect
                                        options={allTeam
                                            ?.filter(
                                                (comp) =>
                                                    returnDetails.company === comp.company &&
                                                    returnDetails.branch
                                                        .map((item) => item.value)
                                                        .includes(comp.branch) &&
                                                    returnDetails.unit
                                                        .map((item) => item.value)
                                                        .includes(comp.unit)
                                            )
                                            ?.map((data) => ({
                                                label: data.teamname,
                                                value: data.teamname,
                                            }))
                                            .filter((item, index, self) => {
                                                return (
                                                    self.findIndex(
                                                        (i) =>
                                                            i.label === item.label && i.value === item.value
                                                    ) === index
                                                );
                                            })}
                                        value={returnDetails.team}
                                        onChange={(e) => {
                                            setReturnDetails((prev) => ({
                                                ...prev,
                                                team: e,
                                                employee: "",
                                            }));
                                        }}
                                        valueRenderer={customValueRendererTeam}
                                        labelledBy="Please Select team"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Employee Name <b style={{ color: "red" }}>*</b>
                                    </Typography>

                                    <Selects
                                        options={allUsersData
                                            ?.filter(
                                                (comp) =>
                                                    returnDetails?.company === comp.company &&
                                                    returnDetails?.branch
                                                        .map((item) => item.value)
                                                        .includes(comp.branch) &&
                                                    returnDetails?.unit
                                                        .map((item) => item.value)
                                                        .includes(comp.unit) &&
                                                    returnDetails?.team
                                                        .map((item) => item.value)
                                                        .includes(comp.team)
                                            )
                                            ?.map((com) => ({
                                                ...com,
                                                label: com.companyname,
                                                value: com.companyname,
                                            }))}
                                        value={{
                                            label: returnDetails?.employee ? returnDetails?.employee : "Please Select Employee",
                                            value: returnDetails?.employee ? returnDetails?.employee : "Please Select Employee",
                                        }}
                                        onChange={(e) => {
                                            setReturnDetails((prev) => ({
                                                ...prev,
                                                employee: e.value,
                                            }));
                                        }}
                                    />
                                </FormControl>
                            </Grid> */}
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Company
                                    </Typography>
                                    <OutlinedInput
                                        readOnly
                                        id="component-outlined"
                                        type="text"
                                        value={returnDetails?.company}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Branch
                                    </Typography>
                                    <OutlinedInput
                                        readOnly
                                        id="component-outlined"
                                        type="text"
                                        value={returnDetails?.branch}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Unit
                                    </Typography>
                                    <OutlinedInput
                                        readOnly
                                        id="component-outlined"
                                        type="text"
                                        value={returnDetails?.unit}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Team
                                    </Typography>
                                    <OutlinedInput
                                        readOnly
                                        id="component-outlined"
                                        type="text"
                                        value={returnDetails?.team}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Employee
                                    </Typography>
                                    <OutlinedInput
                                        readOnly
                                        id="component-outlined"
                                        type="text"
                                        value={returnDetails?.employee}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid
                            item
                            lg={2}
                            md={2}
                            xs={12}
                            sm={12}
                            sx={{ marginTop: "20px" }}
                        >
                            <Typography
                                sx={userStyle.importheadtext}
                                style={{ marginLeft: "5px" }}
                            >
                                Image <b style={{ color: "red" }}>*</b>
                            </Typography>
                            <Button variant="contained" size="small" component="label" sx={buttonStyles.buttonsubmit}>
                                Upload
                                <input
                                    type="file"
                                    id="resume"
                                    multiple
                                    // accept="image/*"
                                    name="file"
                                    hidden
                                    onChange={handleResumeUploadReturn}
                                />
                            </Button>
                        </Grid>
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            {returnUpload?.length > 0 && returnUpload?.map((data, index) => {
                                const fileURL = URL.createObjectURL(data.file);
                                return (
                                    <Grid
                                        container
                                        key={index}
                                        alignItems="center"
                                        spacing={2}
                                        sx={{
                                            padding: "8px 0",
                                            borderBottom: "1px solid #ddd",
                                        }}
                                    >
                                        {/* File Icon */}
                                        <Grid item md={1} sm={2} xs={2}>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }}
                                            >
                                                {data?.file?.type?.includes("image/") ? (
                                                    <img
                                                        src={fileURL}
                                                        alt={data.file.name}
                                                        height={50}
                                                        style={{
                                                            maxWidth: "100%",
                                                        }}
                                                        onLoad={() => URL.revokeObjectURL(fileURL)} // Free up memory when image loads
                                                    />
                                                ) : (
                                                    <img
                                                        className={classes.preview}
                                                        src={getFileIcon(data.file.name)}
                                                        height="25"
                                                        alt="file icon"
                                                    />
                                                )}
                                            </Box>
                                        </Grid>

                                        {/* File Name */}
                                        <Grid item md={3} sm={3} xs={3}>
                                            <Typography
                                                variant="subtitle2"
                                                sx={{
                                                    whiteSpace: "nowrap",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                }}
                                            >
                                                {data.file.name}
                                            </Typography>
                                        </Grid>

                                        {/* Remarks Input */}
                                        <Grid item md={4} sm={4} xs={4}>
                                            <TextField
                                                variant="outlined"
                                                size="small"
                                                placeholder="Enter remarks"
                                                value={data?.remarks || ""}
                                                onChange={(e) => handleRemarkChangeUploadReturn(e.target.value, index)}
                                                fullWidth
                                            />
                                        </Grid>

                                        {/* View and Delete Icons */}
                                        <Grid
                                            item
                                            md={4}
                                            sm={3}
                                            xs={3}
                                            sx={{
                                                display: "flex",
                                                justifyContent: "flex-end",
                                                gap: 1,
                                            }}
                                        >
                                            <Button
                                                sx={{
                                                    padding: "6px",
                                                    minWidth: "36px",
                                                    borderRadius: "50%",
                                                    ":hover": {
                                                        backgroundColor: "#f0f0f0",
                                                    },
                                                }}
                                                onClick={() => renderFilePreview(data.file)}
                                            >
                                                <VisibilityOutlinedIcon
                                                    style={{ fontSize: "18px", color: "#357AE8" }}
                                                />
                                            </Button>
                                            <Button
                                                sx={{
                                                    padding: "6px",
                                                    minWidth: "36px",
                                                    borderRadius: "50%",
                                                    ":hover": {
                                                        backgroundColor: "#f0f0f0",
                                                    },
                                                }}
                                                onClick={() => handleFileDeleteReturn(index)}
                                            >
                                                <FaTrash
                                                    style={{ fontSize: "18px", color: "#a73131" }}
                                                />
                                            </Button>
                                        </Grid>
                                    </Grid>
                                )
                            })}
                        </Grid>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12} sm={12}>
                                <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={editSubmitReturn}>
                                    {" "}
                                    Submit
                                </Button>
                            </Grid>
                            <br />
                            <Grid item md={6} xs={12} sm={12}>
                                <Button
                                    sx={buttonStyles.btncancel}
                                    onClick={handleCloseModReturn}
                                >
                                    {" "}
                                    Cancel{" "}
                                </Button>
                            </Grid>
                        </Grid>
                    </>
                </Box>
            </Dialog>
            <LoadingBackdrop open={isLoading} />
        </Box>
    );
}

export default EmployeeAssetTransferOrReturn;