import CloseIcon from "@mui/icons-material/Close";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ImageIcon from "@mui/icons-material/Image";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import moment from "moment";
import LoadingButton from "@mui/lab/LoadingButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
    Accordion as MUIAccordion,
    AccordionSummary,
    AccordionDetails,
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Popover,
    Select,
    TextField,
    Typography, Tooltip,
} from "@mui/material";
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AssignmentReturnedIcon from '@mui/icons-material/AssignmentReturned';
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import AlertDialog from "../../components/Alert.js";
import { DeleteConfirmation } from "../../components/DeleteConfirmation.js";
import { handleApiError } from "../../components/Errorhandling.js";
import ExportData from "../../components/ExportData.js";
import Headtitle from "../../components/Headtitle.js";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert.js";
import PageHeading from "../../components/PageHeading.js";
import StyledDataGrid from "../../components/TableStyle.js";
import { UserRoleAccessContext } from "../../context/Appcontext.js";
import { AuthContext } from "../../context/Appcontext.js";
import { userStyle } from "../../pageStyle.js";
import { SERVICE } from "../../services/Baseservice.js";
import InfoIcon from "@mui/icons-material/Info";


import { FaTrash } from "react-icons/fa";
import csvIcon from "../../components/Assets/CSV.png";
import excelIcon from "../../components/Assets/excel-icon.png";
import fileIcon from "../../components/Assets/file-icons.png";
import pdfIcon from "../../components/Assets/pdf-icon.png";
import wordIcon from "../../components/Assets/word-icon.png";
import { makeStyles } from "@material-ui/core";

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

function IndividualEmployeeAssetDistribution() {

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
    //FILTER START
    const [interval, setInterval] = useState(1000);
    const [filterApplied, setFilterApplied] = useState(false);
    const [mikrotikMaster, setMikrotikMaster] = useState([])
    const [filterDatas, setFilterDatas] = useState({
        company: "Please Select Company",
        branch: "Please Select Branch",
        unit: "Please Select Unit",
        name: "Please Select Name",
        url: "",
        username: "",
        password: "",
    })
    const [filterFinal, setFilterFinal] = useState({
        url: "",
        username: "",
        password: "",
        company: "",
        branch: "",
        unit: "",
        name: "",
    })


    const [profileOptions, setProfileOptions] = useState([])







    //FILTER END





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


    let exportColumnNames = [
        "Status",
        // "Company",
        // "Branch",
        // "Unit",
        // "Floor",
        // "Area",
        // "Location",
        "Assetmaterial",
        "Assetmaterialcode",
        "Assigndate",
        "Assigntime",
        // "ToCompany",
        // "ToBranch",
        // "ToUnit",
        // "ToTeam",
        // "ToEmployeename",
    ];
    let exportRowValues = [
        "status",
        // "company",
        // "branch",
        // "unit",
        // "floor",
        // "area",
        // "location",
        "assetmaterial",
        "assetmaterialcode",
        "assigndate",
        "assigntime",
        // "companyto",
        // "branchto",
        // "unitto",
        // "teamto",
        // "employeenameto",
    ];



    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    function isValidURL(url) {
        setPageName(!pageName);
        try {
            new URL(url);
            return true;
        } catch (error) {
            return false;
        }
    }
    const ipRegex = /^$|^[0-9.]+$/;
    const [assetVariant, setAssetVariant] = useState({
        name: "",
        password: "",
        service: "any",
        profile: "",
        localaddress: "",
        remoteaddress: "",
        showpassword: false
    });
    const [assetVariantEdit, setAssetVariantEdit] = useState({
        name: "",
        password: "",
        service: "any",
        profile: "",
        localaddress: "",
        remoteaddress: "",
        showpassword: false
    });
    let serviceOptions = [
        { label: "any", value: "any" },
        { label: "async", value: "async" },
        { label: "l2tp", value: "l2tp" },
        { label: "ovpn", value: "ovpn" },
        { label: "pppoe", value: "pppoe" },
        { label: "pptp", value: "pptp" },
        { label: "sstp", value: "sstp" },
    ]
    const [teamsArray, setTeamsArray] = useState([]);
    const {
        isUserRoleCompare,
        isUserRoleAccess,
        pageName,
        setPageName,
        buttonStyles,
        isAssignBranch,
    } = useContext(UserRoleAccessContext);

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
                    data?.subsubpagenameurl?.length !== 0
                ) {
                    fetfinalurl = data.subsubpagenameurl;
                } else if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 &&
                    data?.mainpagenameurl?.length !== 0 &&
                    data?.subpagenameurl?.length !== 0
                ) {
                    fetfinalurl = data.subpagenameurl;
                } else if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 &&
                    data?.mainpagenameurl?.length !== 0
                ) {
                    fetfinalurl = data.mainpagenameurl;
                } else if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0
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

    useEffect(() => {
        getapi();
        fetchMikroTikSecrets();
    }, []);

    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Individual Asset Acceptance List"),
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

    const { auth } = useContext(AuthContext);
    const [loader, setLoader] = useState(false);
    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [isBtn, setIsBtn] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const [openview, setOpenview] = useState(false);
    const [openInfo, setOpeninfo] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDeleteOpenRestore, setIsDeleteOpenRestore] = useState(false);
    const [deleteAssetVariant, setDeleteAssetVariant] = useState({});

    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [allAssetVariantEdit, setAllAssetVariantEdit] = useState([]);
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
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
    const [columnVisibility, setColumnVisibility] = useState(
        initialColumnVisibility
    );

    //useEffect
    useEffect(() => {
        addSerialNumber(teamsArray);
    }, [teamsArray]);


    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        };
    }, []);

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };
    // Error Popup model
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };

    const [singleRow, setSingleRow] = useState({});
    // view model
    const handleClickOpenview = () => {
        setOpenview(true);
    };
    const handleCloseview = () => {
        setOpenview(false);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
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
    const handleClickOpenRestore = () => {
        setIsDeleteOpenRestore(true);
    };
    const handleCloseModRestore = () => {
        setIsDeleteOpenRestore(false);
    };
    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
    };
    // Manage Columns
    const handleOpenManageColumns = (event) => {
        setAnchorEl(event.currentTarget);
        setManageColumnsOpen(true);
    };
    const handleCloseManageColumns = () => {
        setManageColumnsOpen(false);
        setSearchQueryManage("");
    };
    //Delete model
    const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);

    const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
    const handleCloseModcheckbox = () => {
        setIsDeleteOpencheckbox(false);
    };

    const handleClickOpenalert = () => {
        if (selectedRows.length === 0) {
            setIsDeleteOpenalert(true);
        } else {
            setIsDeleteOpencheckbox(true);
        }
    };
    const handleCloseModalert = () => {
        setIsDeleteOpenalert(false);
    };
    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;
    const getRowClassName = (params) => {
        if (selectedRows.includes(params.row.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };


    //add model...
    const [isAddOpen, setIsAddOpen] = useState(false);
    const handleClickOpenAdd = () => {
        setIsAddOpen(true);
    };
    const handleCloseModAdd = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsAddOpen(false);
        setAssetVariant({
            name: "",
            password: "",
            service: "any",
            profile: "",
            localaddress: "",
            remoteaddress: "",
            showpassword: false
        });
    };
    //Edit model...
    const [isEditOpen, setIsEditOpen] = useState(false);
    const handleClickOpenEdit = () => {
        setIsEditOpen(true);
    };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpen(false);
    };


    //get all Asset Variant name.
    const fetchMikroTikSecrets = async () => {
        setPageName(!pageName);
        try {
            setLoader(true);
            let response = await axios.get(`${SERVICE.INDIVIDUAL_EMPLOYEE_ASSET}/?employeename=${isUserRoleAccess?.companyname}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let datas =
                response?.data?.singleuserdata
            setTeamsArray(datas);
            setLoader(false);
        } catch (err) {
            setLoader(false);
            console.log(err);
            let error = err.response?.data?.message;
            if (error) {
                setPopupContentMalert(error);
                setPopupSeverityMalert("error");
                handleClickOpenPopupMalert();
            } else {
                handleApiError(
                    err,
                    setPopupContentMalert,
                    setPopupSeverityMalert,
                    handleClickOpenPopupMalert
                );
            }
        }
    };

    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "Individual Asset Acceptance List.png");
                });
            });
        }
    };

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Individual Asset Acceptance List",
        pageStyle: "print",
    });

    //serial no for listing items
    const addSerialNumber = (profiledatas) => {
        const itemsWithSerialNumber = profiledatas?.map((item, index) => {


            return {
                ...item, // Original data
                serialNumber: index + 1, // Serial number
                id: item?._id,


                assigndate: moment(item?.assigndate).format("DD-MM-YYYY"),
                assigntime: moment(item.assigntime, "HH:mm").format("hh:mm A"),
                companyto: item?.companyto,
                unitto: item?.unitto?.join(","),
                teamto: item?.teamto?.join(","),
                branchto: item?.branchto?.join(","),
                employeenameto: item?.employeenameto?.join(","),
            };
        });
        // Update the state with the new items
        setItems(itemsWithSerialNumber);
    };
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
        setPage(1);
    };
    //datatable....
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setPage(1);
    };

    // Split the search query into individual terms
    const searchTerms = searchQuery.toLowerCase().split(" ");

    // Modify the filtering logic to check each term
    const filteredDatas = items?.filter((item) => {
        return searchTerms.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
        );
    });

    const filteredData = filteredDatas?.slice(
        (page - 1) * pageSize,
        page * pageSize
    );
    const totalPages = Math.ceil(filteredDatas?.length / pageSize);
    const visiblePages = Math.min(totalPages, 3);
    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(
        firstVisiblePage + visiblePages - 1,
        totalPages
    );
    const pageNumbers = [];
    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }

    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
        <div>
            <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
        </div>
    );
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
        try {
            setAcceptLoader(params?.id);

            const formData = new FormData();

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
                    distributedto: String(isUserRoleAccess?.companyname)
                }
            );
            setAcceptLoader("")
            await fetchMikroTikSecrets();
            //   handleCloseModEditNear();
            setPopupContent("Accepted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            setAcceptLoader("")
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    const columnDataTable = [

        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 100,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
        },

        {
            field: "status",
            headerName: "Status",
            flex: 0,
            width: 200,
            hide: !columnVisibility.status,
            headerClassName: "bold-header",
            pinned: "left",
            cellStyle: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            },
            renderCell: (params) => (
                <>
                    {params?.row?.status && (
                        <StatusButton status={params.row.status} />
                    )}
                </>
            ),
        },

        // {
        //     field: "company",
        //     headerName: "Company",
        //     flex: 0,
        //     width: 100,
        //     hide: !columnVisibility.company,
        //     headerClassName: "bold-header",
        // },
        // {
        //     field: "branch",
        //     headerName: "Branch",
        //     flex: 0,
        //     width: 100,
        //     hide: !columnVisibility.branch,
        //     headerClassName: "bold-header",
        // },
        // {
        //     field: "unit",
        //     headerName: "Unit",
        //     flex: 0,
        //     width: 100,
        //     hide: !columnVisibility.unit,
        //     headerClassName: "bold-header",
        // },
        // {
        //     field: "floor",
        //     headerName: "Floor",
        //     flex: 0,
        //     width: 100,
        //     hide: !columnVisibility.floor,
        //     headerClassName: "bold-header",
        // },
        // {
        //     field: "area",
        //     headerName: "Area",
        //     flex: 0,
        //     width: 100,
        //     hide: !columnVisibility.area,
        //     headerClassName: "bold-header",
        // },
        // {
        //     field: "location",
        //     headerName: "Location",
        //     flex: 0,
        //     width: 100,
        //     hide: !columnVisibility.location,
        //     headerClassName: "bold-header",
        // },
        {
            field: "assetmaterial",
            headerName: "Asset Material",
            flex: 0,
            width: 160,
            hide: !columnVisibility.assetmaterial,
            headerClassName: "bold-header",
        },
        {
            field: "assetmaterialcode",
            headerName: "Asset Material Code",
            flex: 0,
            width: 160,
            hide: !columnVisibility.assetmaterialcode,
            headerClassName: "bold-header",
        },
        {
            field: "assigndate",
            headerName: "Assign Date",
            flex: 0,
            width: 160,
            hide: !columnVisibility.assigndate,
            headerClassName: "bold-header",
        },
        {
            field: "assigntime",
            headerName: "Assign Time",
            flex: 0,
            width: 160,
            hide: !columnVisibility.assigntime,
            headerClassName: "bold-header",
        },

        // {
        //     field: "companyto",
        //     headerName: "To Company",
        //     flex: 0,
        //     width: 100,
        //     hide: !columnVisibility.companyto,
        //     headerClassName: "bold-header",
        // },
        // {
        //     field: "branchto",
        //     headerName: "To Branch",
        //     flex: 0,
        //     width: 100,
        //     hide: !columnVisibility.branchto,
        //     headerClassName: "bold-header",
        // },
        // {
        //     field: "unitto",
        //     headerName: "To Unit",
        //     flex: 0,
        //     width: 100,
        //     hide: !columnVisibility.unitto,
        //     headerClassName: "bold-header",
        // },
        // {
        //     field: "teamto",
        //     headerName: "To team",
        //     flex: 0,
        //     width: 100,
        //     hide: !columnVisibility.teamto,
        //     headerClassName: "bold-header",
        // },
        // {
        //     field: "employeenameto",
        //     headerName: "Employee Name",
        //     flex: 0,
        //     width: 250,
        //     hide: !columnVisibility.employeenameto,
        //     headerClassName: "bold-header",
        // },



        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 250,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",
            renderCell: (params) => (
                <Grid sx={{ display: "flex" }}>



                    {isUserRoleCompare?.includes("vindividualassetacceptancelist") && (

                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getviewCodeNear(params.row.id);
                            }}
                        >
                            <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("eindividualassetacceptancelist") && (
                        <>
                            {params.row.status === "Yet To Accept" && (


                                <LoadingButton
                                    variant="contained"
                                    color="success"
                                    onClick={() => {
                                        sendEditrequest(params.row);
                                    }}
                                    size="small"
                                    loading={acceptLoader === params?.row?.id}
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


    const rowDataTable = filteredData.map((item, index) => {
        return {
            id: item.id,
            serialNumber: item.serialNumber,
            status: item?.status,
            company: item?.company,
            branch: item?.branch,
            unit: item?.unit,
            floor: item?.floor,
            area: item?.area,
            location: item?.location,
            assetmaterial: item?.assetmaterial,
            assetmaterialcode: item?.assetmaterialcode,
            assigndate: item?.assigndate,
            assigntime: item?.assigntime,
            companyto: item?.companyto,
            branchto: item?.branchto,
            unitto: item?.unitto,
            teamto: item?.teamto,
            employeenameto: item?.employeenameto,
        };
    });

    const rowsWithCheckboxes = rowDataTable.map((row) => ({
        ...row,
        // Create a custom field for rendering the checkbox
        checkbox: selectedRows.includes(row.id),
    }));
    // Show All Columns functionality
    const handleShowAllColumns = () => {
        setColumnVisibility(initialColumnVisibility);
    };
    // Function to filter columns based on search query
    const filteredColumns = columnDataTable.filter((column) =>
        column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase())
    );
    // Manage Columns functionality
    const toggleColumnVisibility = (field) => {
        setColumnVisibility((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };
    // JSX for the "Manage Columns" popover content
    const manageColumnsContent = (
        <Box
            style={{
                padding: "10px",
                minWidth: "325px",
                "& .MuiDialogContent-root": { padding: "10px 0" },
            }}
        >
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
                <TextField
                    label="Find column"
                    variant="standard"
                    fullWidth
                    value={searchQueryManage}
                    onChange={(e) => setSearchQueryManage(e.target.value)}
                    sx={{ marginBottom: 5, position: "absolute" }}
                />
            </Box>
            <br />
            <br />
            <DialogContent
                sx={{ minWidth: "auto", height: "200px", position: "relative" }}
            >
                <List sx={{ overflow: "auto", height: "100%" }}>
                    {filteredColumns.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText
                                sx={{ display: "flex" }}
                                primary={
                                    <Switch
                                        sx={{ marginTop: "-5px" }}
                                        size="small"
                                        checked={columnVisibility[column.field]}
                                        onChange={() => toggleColumnVisibility(column.field)}
                                    />
                                }
                                secondary={
                                    column.field === "checkbox" ? "Checkbox" : column.headerName
                                }
                            />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Grid container>
                    <Grid item md={4}>
                        <Button
                            variant="text"
                            sx={{ textTransform: "none" }}
                            onClick={() => setColumnVisibility(initialColumnVisibility)}
                        >
                            {" "}
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
                            {" "}
                            Hide All
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Box>
    );

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };

    const [fileFormat, setFormat] = useState("");


    return (
        <Box>
            <Headtitle title={"INDIVIDUAL ASSET ACCEPTANCE LIST"} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Individual Asset Acceptance List"
                modulename="Asset"
                submodulename="Asset Register"
                mainpagename="Individual Asset Acceptance List"
                subpagename=""
                subsubpagename=""
            />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lindividualassetacceptancelist") && (
                <>
                    {loader ? (
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
                            {/* ******************************************************EXPORT Buttons****************************************************** */}

                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography sx={userStyle.importheadtext}>
                                        Individual Asset Acceptance List
                                    </Typography>
                                </Grid>

                            </Grid>
                            <br />
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
                                            <MenuItem value={teamsArray?.length}>
                                                All
                                            </MenuItem>
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
                                        {isUserRoleCompare?.includes("excelindividualassetacceptancelist") && (
                                            <>
                                                <Button
                                                    onClick={(e) => {
                                                        setIsFilterOpen(true);
                                                        setFormat("xl");
                                                    }}
                                                    sx={userStyle.buttongrp}
                                                >
                                                    <FaFileExcel />
                                                    &ensp;Export to Excel&ensp;
                                                </Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("csvindividualassetacceptancelist") && (
                                            <>
                                                <Button
                                                    onClick={(e) => {
                                                        setIsFilterOpen(true);
                                                        setFormat("csv");
                                                    }}
                                                    sx={userStyle.buttongrp}
                                                >
                                                    <FaFileCsv />
                                                    &ensp;Export to CSV&ensp;
                                                </Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("printindividualassetacceptancelist") && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                    &ensp;
                                                    <FaPrint />
                                                    &ensp;Print&ensp;
                                                </Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("pdfindividualassetacceptancelist") && (
                                            <>
                                                <Button
                                                    sx={userStyle.buttongrp}
                                                    onClick={() => {
                                                        setIsPdfFilterOpen(true);
                                                    }}
                                                >
                                                    <FaFilePdf />
                                                    &ensp;Export to PDF&ensp;
                                                </Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("imageindividualassetacceptancelist") && (
                                            <Button
                                                sx={userStyle.buttongrp}
                                                onClick={handleCaptureImage}
                                            >
                                                {" "}
                                                <ImageIcon sx={{ fontSize: "15px" }} />{" "}
                                                &ensp;Image&ensp;{" "}
                                            </Button>
                                        )}
                                    </Box>
                                </Grid>
                                <Grid item md={2} xs={12} sm={12}>
                                    <Box>
                                        <FormControl fullWidth size="small">
                                            <Typography>Search</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                value={searchQuery}
                                                onChange={handleSearchChange}
                                            />
                                        </FormControl>
                                    </Box>
                                </Grid>
                            </Grid>
                            <br />
                            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
                                Show All Columns
                            </Button>
                            &ensp;
                            <Button
                                sx={userStyle.buttongrp}
                                onClick={handleOpenManageColumns}
                            >
                                Manage Columns
                            </Button>

                            <br />
                            <br />
                            <Box
                                style={{
                                    width: "100%",
                                    overflowY: "hidden", // Hide the y-axis scrollbar
                                }}
                            >
                                <StyledDataGrid
                                    // onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
                                    rows={rowsWithCheckboxes}
                                    columns={columnDataTable.filter(
                                        (column) => columnVisibility[column.field]
                                    )}
                                    onSelectionModelChange={handleSelectionChange}
                                    selectionModel={selectedRows}
                                    autoHeight={true}
                                    ref={gridRef}
                                    density="compact"
                                    hideFooter
                                    getRowClassName={getRowClassName}
                                    disableRowSelectionOnClick
                                />
                            </Box>
                            <Box style={userStyle.dataTablestyle}>
                                <Box>
                                    Showing{" "}
                                    {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0} to{" "}
                                    {Math.min(page * pageSize, filteredDatas?.length)} of{" "}
                                    {filteredDatas?.length} entries
                                </Box>
                                <Box>
                                    <Button
                                        onClick={() => setPage(1)}
                                        disabled={page === 1}
                                        sx={userStyle.paginationbtn}
                                    >
                                        <FirstPageIcon />
                                    </Button>
                                    <Button
                                        onClick={() => handlePageChange(page - 1)}
                                        disabled={page === 1}
                                        sx={userStyle.paginationbtn}
                                    >
                                        <NavigateBeforeIcon />
                                    </Button>
                                    {pageNumbers?.map((pageNumber) => (
                                        <Button
                                            key={pageNumber}
                                            sx={userStyle.paginationbtn}
                                            onClick={() => handlePageChange(pageNumber)}
                                            className={page === pageNumber ? "active" : ""}
                                            disabled={page === pageNumber}
                                        >
                                            {pageNumber}
                                        </Button>
                                    ))}
                                    {lastVisiblePage < totalPages && <span>...</span>}
                                    <Button
                                        onClick={() => handlePageChange(page + 1)}
                                        disabled={page === totalPages}
                                        sx={userStyle.paginationbtn}
                                    >
                                        <NavigateNextIcon />
                                    </Button>
                                    <Button
                                        onClick={() => setPage(totalPages)}
                                        disabled={page === totalPages}
                                        sx={userStyle.paginationbtn}
                                    >
                                        <LastPageIcon />
                                    </Button>
                                </Box>
                            </Box>
                            {/* ****** Table End ****** */}
                        </Box>
                    )}
                </>
            )}
            {/* ****** Table End ****** */}
            {/* Manage Column */}
            <Popover
                id={id}
                open={isManageColumnsOpen}
                anchorEl={anchorEl}
                onClose={handleCloseManageColumns}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
            >
                {manageColumnsContent}
            </Popover>
            {/* view model */}
            <Dialog
                open={openview}
                onClose={handleClickOpenview}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="md"
                fullWidth={true}
                sx={{ marginTop: "50px" }}
            >
                <Box sx={{ padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}>
                            {" "}
                            View Mikrotik IP Pools
                        </Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Name</Typography>
                                    <Typography>{singleRow.name}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Addresses</Typography>
                                    <Typography>{singleRow.ranges}</Typography>
                                </FormControl>
                            </Grid>

                        </Grid>
                        <br /> <br /> <br />
                        <Grid container spacing={2} sx={{ marginLeft: "-2px" }}>
                            <Button
                                variant="contained"
                                sx={buttonStyles.btncancel}
                                onClick={handleCloseview}
                            >
                                Back
                            </Button>
                        </Grid>
                    </>
                </Box>
            </Dialog>


            <br />
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
            {/* PRINT PDF EXCEL CSV */}
            <ExportData
                isFilterOpen={isFilterOpen}
                handleCloseFilterMod={handleCloseFilterMod}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpen}
                isPdfFilterOpen={isPdfFilterOpen}
                setIsPdfFilterOpen={setIsPdfFilterOpen}
                handleClosePdfFilterMod={handleClosePdfFilterMod}
                filteredDataTwo={filteredData ?? []}
                itemsTwo={items ?? []}
                filename={"Individual Asset Acceptance List"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}

            <InfoPopup
                openInfo={openInfo}
                handleCloseinfo={handleCloseinfo}
                heading="Mikrotik IP Pools Info"
                addedby={singleRow?.addedby}
                updateby={singleRow?.updatedby}
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
                                    <Typography>{isUserRoleAccess?.company}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                                        Branch
                                    </Typography>
                                    <Typography>
                                        {isUserRoleAccess?.branch}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                                        Unit
                                    </Typography>
                                    <Typography>
                                        {isUserRoleAccess?.unit}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                                        Team
                                    </Typography>
                                    <Typography>
                                        {isUserRoleAccess?.team}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={6} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                                        Employee Name
                                    </Typography>
                                    <Typography>
                                        {isUserRoleAccess?.companyname}
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
            {/* EXTERNAL COMPONENTS -------------- END */}
        </Box>
    );
}

export default IndividualEmployeeAssetDistribution;