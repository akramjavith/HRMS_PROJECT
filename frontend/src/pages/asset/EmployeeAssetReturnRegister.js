import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import BlockIcon from '@mui/icons-material/Block';
import SchoolIcon from "@mui/icons-material/School";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import WorkIcon from "@mui/icons-material/Work";
import { MultiSelect } from "react-multi-select-component";
import LoadingButton from "@mui/lab/LoadingButton";
import DeleteIcon from "@mui/icons-material/Delete";
import {
    DeleteConfirmation, PleaseSelectRow,
} from "../../components/DeleteConfirmation.js";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoPopup from "../../components/InfoPopup.js";
import {
    Accordion as MUIAccordion,
    AccordionSummary,
    AccordionDetails,
    Box,
    Button,
    Dialog,
    Backdrop,
    DialogTitle,
    DialogActions,
    DialogContent,
    FormControl,
    LinearProgress,
    FormHelperText,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Popover,
    Select,
    TextField,
    Tooltip,
    Typography,
    OutlinedInput,
    InputAdornment,
    TextareaAutosize
} from "@mui/material";
import axios from "axios";
import "jspdf-autotable";
import moment from "moment-timezone";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../components/Errorhandling";
import {
    AuthContext,
    UserRoleAccessContext,
} from "../../context/Appcontext";
import { userStyle, colourStyles } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";
import Selects from "react-select";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import ErrorIcon from "@mui/icons-material/Error";
import ImageIcon from "@mui/icons-material/Image";
import InfoIcon from "@mui/icons-material/Info";
import WarningIcon from "@mui/icons-material/Warning";
import MergeTypeIcon from "@mui/icons-material/MergeType";
import SyncIcon from "@mui/icons-material/Sync";
import MuiInput from "@mui/material/Input";
import Switch from "@mui/material/Switch";
import { styled } from "@mui/system";
import domtoimage from 'dom-to-image';
import { saveAs } from "file-saver";
import { FaFileCsv, FaFileExcel } from "react-icons/fa";
import {
    NotificationContainer,
    NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import { Link, useNavigate } from "react-router-dom";
import AggregatedSearchBar from "../../components/AggregatedSearchBar";
import AggridTable from "../../components/AggridTable";
import AlertDialog from "../../components/Alert";
import ExportData from "../../components/ExportData";
import Headtitle from "../../components/Headtitle";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";
import CircularProgress from "@mui/material/CircularProgress";
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation'

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

const Input = styled(MuiInput)(({ theme }) => ({
    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
        display: "none !important",
    },
    "& input[type=number]": {
        MozAppearance: "textfield",
    },
}));

function EmployeeAssetReturnRegister() {
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

    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
    const gridRefTableImg = useRef(null);

    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
    const handleClickOpenPopupMalert = () => {
        setOpenPopupMalert(true);
        setIsLoading(false);
    };
    const handleClosePopupMalert = () => {
        setOpenPopupMalert(false);
        setIsLoading(false);
    };
    const [openPopup, setOpenPopup] = useState(false);
    const [popupContent, setPopupContent] = useState("");
    const [popupSeverity, setPopupSeverity] = useState("");
    const handleClickOpenPopup = () => {
        setOpenPopup(true);
        setIsLoading(false);
    };
    const handleClosePopup = () => {
        setOpenPopup(false);
        setIsLoading(false);
    };
    const navigate = useNavigate();

    let exportColumnNames = [
        "Company",
        "Branch",
        "Unit",
        "Team",
        "Employee",
        "AssetMaterial",
        "AssetMaterialCode",
        "ReturnDate",
        "ReturnTime",
        "Description",
    ];
    let exportRowValues = [
        "company",
        "branch",
        "unit",
        "team",
        "employee",
        "assetmaterial",
        "assetmaterialcode",
        "returndate",
        "returntime",
        "description",
    ];

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteData, setDeleteData] = useState({});
    //Delete model
    const handleClickOpenDelete = () => {
        setIsDeleteOpen(true);
    };
    const handleClickCloseDelete = () => {
        setIsDeleteOpen(false);
    };





    //Edit model...
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editDetails, setEditDetails] = useState({});
    const handleClickOpenEdit = () => {
        setIsEditOpen(true);
    };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpen(false);

        setUploadEdit([]);
        setUploadedImagesEdit([]);
        setUploadImagesDelete([]);
    };

    const deleteFunction = async () => {
        setPageName(!pageName);
        try {
            setIsLoading(true);
            await axios.delete(`${SERVICE.EMPLOYEEASSETRETURNREGISTER_SINGLE}/${deleteData?.id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            handleClickCloseDelete();
            setSelectedRows([]);
            setPage(1);
            setFilteredChanges(null)
            setFilteredRowData([]);
            await updateDistributionStatus(deleteData?.distributionid, "Accepted", deleteData?.assetmaterial, deleteData?.assetmaterialcode, deleteData?.employee);
            await fetchReturnData();
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
            handleClickCloseDelete();
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };

    const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
    const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);
    const handleClickOpenalert = () => {
        setIsHandleChange(true);
        if (selectedRows.length === 0) {
            setIsDeleteOpenalert(true);
        } else {
            setIsDeleteOpencheckbox(true);
        }
    };
    const handleCloseModalert = () => {
        setIsDeleteOpenalert(false);
    };


    const handleClickOpencheckbox = () => {
        setIsDeleteOpencheckbox(true);
    };
    const handleCloseModcheckbox = () => {
        setIsDeleteOpencheckbox(false);
    };
    const bulkdeleteFunction = async () => {
        setPageName(!pageName);
        try {
            setIsLoading(true);
            let distributionUpdateArray = employees?.filter(item => selectedRows?.includes(item?.id))?.map(data => data?.distributionid);

            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.EMPLOYEEASSETRETURNREGISTER_SINGLE}/${item}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });
            });
            await Promise.all(deletePromises);

            const updatepromise = distributionUpdateArray?.map((item) => {
                const formData = new FormData();
                const jsonData = {
                    status: "Accepted"
                }
                formData.append("jsonData", JSON.stringify(jsonData));
                return axios.put(`${SERVICE.EMPLOYEEASSET_SINGLE}/${item}`, formData, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },

                });
            });

            await Promise.all(updatepromise);
            setIsHandleChange(false);
            handleCloseModcheckbox();
            setSelectedRows([]);
            setSelectAllChecked(false);
            setPage(1);
            setFilteredChanges(null)
            setFilteredRowData([]);

            await fetchReturnData();
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
            handleClickCloseDelete();
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };

    // view model
    const [openview, setOpenview] = useState(false);
    const [viewDetails, setViewDetails] = useState({});
    const [infoDetails, setInfoDetails] = useState({});

    const handleClickOpenview = () => {
        setOpenview(true);
    };

    const handleCloseview = () => {
        setOpenview(false);
    };
    const [openInfo, setOpeninfo] = useState(false);
    const handleClickOpeninfo = () => {
        setOpeninfo(true);
    };
    const handleCloseinfo = () => {
        setOpeninfo(false);
    };

    const getview = async (e) => {
        try {
            let res = await axios.get(`${SERVICE.EMPLOYEEASSETRETURNREGISTER_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let singleUser = allUsersData?.find(item => item?.companyname === res?.data?.sassetreturn.employee)

            setViewDetails({
                ...res?.data?.sassetreturn,
                company: singleUser?.company,
                branch: singleUser?.branch,
                unit: singleUser?.unit,
                team: singleUser?.team,
            });
            await fetchComponents(res?.data?.sassetreturn?.assetmaterial, res?.data?.sassetreturn?.assetmaterialcode, setAccordianCreateView);
            handleClickOpenview();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    const [oldDistributionId, setOldDistributionId] = useState("")
    const getCode = async (e) => {
        try {
            let res = await axios.get(`${SERVICE.EMPLOYEEASSETRETURNREGISTER_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setOldDistributionId(res?.data?.sassetreturn?.distributionid || "");
            await fetchComponents(res?.data?.sassetreturn?.assetmaterial, res?.data?.sassetreturn?.assetmaterialcode, setAccordianCreateEdit);
            await fetchEmployeeDistribution(res?.data?.sassetreturn?.employee, setDistributionDetailsEdit)
            setEditDetails({
                ...res?.data?.sassetreturn,
                updatedby: res?.data?.sassetreturn?.updatedby?.length > 0 ? res?.data?.sassetreturn?.updatedby : [],
                company: res?.data?.sassetreturn?.company?.map((data) => ({
                    label: data,
                    value: data,
                })),
                branch: res?.data?.sassetreturn?.branch?.map((data) => ({
                    label: data,
                    value: data,
                })),
                unit: res?.data?.sassetreturn?.unit?.map((data) => ({
                    label: data,
                    value: data,
                })),
                team: res?.data?.sassetreturn?.team?.map((data) => ({
                    label: data,
                    value: data,
                })),
            });
            setUploadedImagesEdit(res?.data?.sassetreturn?.images)
            handleClickOpenEdit();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
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
            let res = await axios.get(`${SERVICE.EMPLOYEEASSETRETURNREGISTER_SINGLE}/${params?.id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let reurnData = res?.data?.sassetreturn;
            let distribution = await axios.get(`${SERVICE.EMPLOYEEASSET_SINGLE}/${reurnData?.distributionid}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let distributionData = distribution?.data?.semployeeasset;
            await fetchComponents(reurnData?.assetmaterial, reurnData?.assetmaterialcode, setAccordianCreateTransfer);
            setTransferDetails({
                assetmaterial: reurnData?.assetmaterial,
                assetmaterialcode: reurnData?.assetmaterialcode,
                transferdate: moment().format("YYYY-MM-DD"),
                transfertime: moment().format("HH:mm"),
                company: "",
                branch: [],
                unit: [],
                team: [],
                employee: "",
                assetcompany: distributionData?.company,
                assetbranch: distributionData?.branch,
                assetunit: distributionData?.unit,
                assetfloor: distributionData?.floor,
                assetarea: distributionData?.area,
                assetlocation: distributionData?.location,
            })
            handleClickOpenTransfer();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };


    const [employees, setEmployees] = useState([]);
    const [isManualUser, setIsManualUser] = useState([]);
    const [selectedUserType, setSelectedUserType] = useState("Employee");
    const [searchQuery, setSearchQuery] = useState("");
    const {
        isUserRoleAccess,
        isUserRoleCompare,
        isAssignBranch,
        allUnit,
        allTeam,
        allCompany,
        allBranchs,
        pageName,
        setPageName,
        buttonStyles,
        allUsersData,
        alldesignation
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
    }, []);

    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Employee Asset return Register"),
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

    const [distributionDetails, setDistributionDetails] = useState([]);
    const [distributionDetailsEdit, setDistributionDetailsEdit] = useState([]);
    const fetchEmployeeDistribution = async (employeename, setAssetState) => {
        try {
            let response = await axios.get(`${SERVICE.INDIVIDUAL_EMPLOYEE_ASSET}/?employeename=${employeename}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let datas =
                response?.data?.singleuserdata?.filter(data => data?.status === "Accepted");
            setAssetState(datas);
            console.log(datas, "datas")
        } catch (err) {
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };



    const customValueRendererRocketchatRole = (valueRocketchatTeamCat, _categoryname) => {
        return valueRocketchatTeamCat?.length
            ? valueRocketchatTeamCat.map(({ label }) => label)?.join(", ")
            : "Please Select Role";
    };


    const customValueRendererRocketchatRoleAdd = (valueRocketchatTeamCat, _categoryname) => {
        return valueRocketchatTeamCat?.length
            ? valueRocketchatTeamCat.map(({ label }) => label)?.join(", ")
            : "Please Select Role";
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
    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const { auth, setAuth } = useContext(AuthContext);
    const [isBtnFilter, setisBtnFilter] = useState(false);

    const [loader, setLoader] = useState(false);
    const [selectedOptionsCate, setSelectedOptionsCate] = useState([]);
    let [valueCate, setValueCate] = useState([]);

    let username = isUserRoleAccess.username;

    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");



    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "EmployeeAssetReturnRegister.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };

    const [checked, setChecked] = useState(false);

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

    // Copied fields Name
    const handleCopy = (message) => {
        NotificationManager.success(`${message} 👍`, "", 2000);
    };

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    const getRowClassName = (params) => {
        if (selectedRows.includes(params.row.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };

    // Function to render the status with icons and buttons
    const renderAccountStatus = (status) => {
        const iconProps = {
            size: "small",
            style: { marginRight: 4 },
        };

        let icon = <InfoIcon {...iconProps} />;
        let color = "#ccc"; // Default gray

        switch (status) {
            case "linked":
                icon = <CheckCircleIcon {...iconProps} />;
                color = "#4caf50"; // Green
                break;
            case "notlinked":
                icon = <ErrorIcon {...iconProps} />;
                color = "#ff9800"; // Orange
                break;
            case "mismatched":
                icon = <WarningIcon {...iconProps} />;
                color = "#f44336"; // Red
                break;
            default:
                icon = <InfoIcon {...iconProps} />;
                color = "#ccc"; // Default gray
        }

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
                    <Typography
                        variant="caption"
                        sx={{
                            fontSize: "0.7rem",
                            lineHeight: 1.2,
                        }}
                    >
                        {status}
                    </Typography>
                </Button>
            </Tooltip>
        );
    };
    const renderStatusIcon = (status) => {
        const iconProps = {
            size: "small",
            style: { marginRight: 4 },
        };

        let icon = <InfoIcon {...iconProps} />;
        let color = "#ccc"; // Default gray

        switch (status.toLowerCase()) {
            case "online":
                icon = <CheckCircleIcon {...iconProps} />;
                color = "#4caf50"; // Green
                break;
            case "offline":
                icon = <DoNotDisturbIcon {...iconProps} />;
                color = "#9e9e9e"; // Gray
                break;
            case "away":
                icon = <HourglassEmptyIcon {...iconProps} />;
                color = "#ff9800"; // Orange
                break;
            case "busy":
                icon = <ErrorIcon {...iconProps} />;
                color = "#f44336"; // Red
                break;
            default: // Custom or undefined status
                icon = <HelpOutlineIcon {...iconProps} />;
                color = "#00acc1"; // Cyan for custom status
        }

        return (
            <div style={{ display: "flex", alignItems: "center" }}>
                <div
                    style={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        backgroundColor: color,
                        marginRight: 4,
                    }}
                ></div>
                {status}
            </div>
        );
    };
    const renderWho = (who) => {
        if (!who) return null;
        const iconProps = {
            size: "small",
            style: { marginRight: 4 },
        };

        let icon = <InfoIcon {...iconProps} />;
        let color = "#ccc"; // Default color

        switch (who) {
            case "Employee":
                icon = <WorkIcon {...iconProps} />;
                color = "#1976d2"; // Blue
                break;
            case "Internship":
                icon = <SchoolIcon {...iconProps} />;
                color = "#4caf50"; // Green
                break;
            default:
                icon = <InfoIcon {...iconProps} />;
                color = "#ccc"; // Default gray
        }

        return (
            <Tooltip title={who} arrow>
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
                    <Typography
                        variant="caption"
                        sx={{
                            fontSize: "0.7rem",
                            lineHeight: 1.2,
                        }}
                    >
                        {who}
                    </Typography>
                </Button>
            </Tooltip>
        );
    };
    const renderRegistrationStatus = (status) => {
        if (!status) return null;
        const iconProps = {
            size: "small",
            style: { marginRight: 4 },
        };

        let icon = <InfoIcon {...iconProps} />;
        let color = "#ccc"; // Default color

        switch (status) {
            case "Active":
                icon = <CheckCircleIcon {...iconProps} />; // Icon for "Active"
                color = "#4caf50"; // Green
                break;
            case "Pending":
                icon = <HourglassEmptyIcon {...iconProps} />; // Icon for "Pending"
                color = "#ff9800"; // Orange
                break;
            case "Deactivated":
                icon = <BlockIcon {...iconProps} />; // Icon for "Deactivated"
                color = "#f44336"; // Red    
                break;
            default:
                icon = <InfoIcon {...iconProps} />;
                color = "#ccc"; // Default gray
        }

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
                    <Typography
                        variant="caption"
                        sx={{
                            fontSize: "0.7rem",
                            lineHeight: 1.2,
                        }}
                    >
                        {status}
                    </Typography>
                </Button>
            </Tooltip>
        );
    };

    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        actions: true,
        company: true,
        branch: true,
        unit: true,
        team: true,
        employee: true,
        assetmaterial: true,
        assetmaterialcode: true,
        returndate: true,
        returntime: true,
        description: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(
        initialColumnVisibility
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

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Employee Asset Return Register",
        pageStyle: "print",
    });

    //table entries ..,.
    const [items, setItems] = useState([]);

    const addSerialNumber = (data) => {

        setItems(data);
    };

    useEffect(() => {
        addSerialNumber(employees);
    }, [employees]);

    const [searchedString, setSearchedString] = useState("");
    const [isHandleChange, setIsHandleChange] = useState(false);
    const gridRefTable = useRef(null);

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



    const columnDataTable = [
        {
            field: "checkbox",
            headerName: "Checkbox", // Default header name
            headerStyle: {
                fontWeight: "bold", // Apply the font-weight style to make the header text bold
                // Add any other CSS styles as needed
            },

            sortable: false, // Optionally, you can make this column not sortable
            width: 50,
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
            width: 75,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
            pinned: "left",
            lockPinned: true,
        },


        {
            field: "company",
            headerName: "Company",
            flex: 0,
            width: 150,
            hide: !columnVisibility.company,
            headerClassName: "bold-header",
        },
        {
            field: "branch",
            headerName: "Branch",
            flex: 0,
            width: 150,
            hide: !columnVisibility.branch,
            headerClassName: "bold-header",
        },
        {
            field: "unit",
            headerName: "Unit",
            flex: 0,
            width: 150,
            hide: !columnVisibility.unit,
            headerClassName: "bold-header",
        },
        {
            field: "team",
            headerName: "Team",
            flex: 0,
            width: 150,
            hide: !columnVisibility.team,
            headerClassName: "bold-header",
        },

        {
            field: "employee",
            headerName: "Employee Name",
            flex: 0,
            width: 180,
            hide: !columnVisibility.employee,
            headerClassName: "bold-header",
        },
        {
            field: "assetmaterial",
            headerName: "Asset Material",
            flex: 0,
            width: 150,
            hide: !columnVisibility.assetmaterial,
            headerClassName: "bold-header",
        },
        {
            field: "assetmaterialcode",
            headerName: "Asset Material Code",
            flex: 0,
            width: 180,
            hide: !columnVisibility.assetmaterialcode,
            headerClassName: "bold-header",
        },
        {
            field: "returndate",
            headerName: "Return Date",
            flex: 0,
            width: 150,
            hide: !columnVisibility.returndate,
            headerClassName: "bold-header",
        },
        {
            field: "returntime",
            headerName: "Return Time",
            flex: 0,
            width: 150,
            hide: !columnVisibility.returntime,
            headerClassName: "bold-header",
        },
        {
            field: "description",
            headerName: "Description",
            flex: 0,
            width: 150,
            hide: !columnVisibility.description,
            headerClassName: "bold-header",
        },

        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 350,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.actions,
            cellStyle: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            },

            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    {isUserRoleCompare?.includes("eemployeeassetreturnregister") && params?.data?.editTable && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getCode(params?.data?.id)
                            }}
                        >
                            <EditOutlinedIcon sx={buttonStyles.buttonedit} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("demployeeassetreturnregister") && params?.data?.editTable && (
                        <Button
                            sx={userStyle.buttondelete}
                            onClick={(e) => {
                                //   rowData(params.data.id, params.data.name);
                                handleClickOpenDelete();
                                setDeleteData(params.data);
                            }}
                        >
                            <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("vemployeeassetreturnregister") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {


                                getview(params?.data?.id)
                            }}
                        >
                            <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("iemployeeassetreturnregister") && (
                        <Button
                            size="small"
                            sx={userStyle.actionbutton}
                            onClick={() => {
                                setInfoDetails(params?.data);
                                handleClickOpeninfo();
                            }}
                        >
                            <InfoOutlinedIcon sx={buttonStyles.buttoninfo} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("aemployeeassetdistributionregister") && params?.data?.transfer && (
                        <Button size="small" sx={{ backgroundColor: '#4caf50', color: '#fff', '&:hover': { backgroundColor: '#4caf50', color: '#fff' } }} onClick={() => { getCodeTransfer(params?.data) }} > <TransferWithinAStationIcon sx={{ marginRight: 1 }} /> Transfer </Button>
                    )}

                </Grid>
            ),
        },
    ];

    const rowDataTable = filteredData?.map((item, index) => {
        return {

            serialNumber: item?.serialNumber,
            id: item?.id,
            company: item?.company,
            branch: item?.branch,
            unit: item?.unit,
            team: item?.team,
            employee: item?.employee,
            distributionid: item?.distributionid,
            assetmaterial: item?.assetmaterial,
            assetmaterialcode: item?.assetmaterialcode,
            returntime: item?.returntime,
            returndate: item?.returndate,
            description: item?.description,
            transfer: item?.transfer,
            editTable: item?.editTable,
            addedby: item?.addedby,
            updatedby: item?.updatedby,
        };
    });
    const rowsWithCheckboxes = rowDataTable?.map((row) => ({
        ...row,
        // Create a custom field for rendering the checkbox
        checkbox: selectedRows.includes(row.id),
    }));

    // Show All Columns functionality
    const handleShowAllColumns = () => {
        setColumnVisibility(initialColumnVisibility);
    };

    // // Function to filter columns based on search query
    const filteredColumns = columnDataTable?.filter((column) =>
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
                    {filteredColumns?.map((column) => (
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

    //add function




    const editSubmit = (e) => {
        e.preventDefault();

        const isNameMatch = employees?.filter((item) => item?.id !== editDetails?._id)?.some(
            (item) =>
                item.employee?.trim().toLowerCase() === editDetails.employee?.trim().toLowerCase() &&
                item.assetmaterialcode?.trim().toLowerCase() === editDetails.assetmaterialcode?.trim().toLowerCase()
        );
        if (isNameMatch) {
            setPopupContentMalert("Data Already Exist!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (editDetails?.company?.length === 0) {
            setPopupContentMalert("Please Select Company!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (
            editDetails?.branch?.length === 0
        ) {
            setPopupContentMalert("Please Select Branch!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            editDetails?.unit?.length === 0
        ) {
            setPopupContentMalert("Please Select Unit!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            editDetails?.team?.length === 0
        ) {
            setPopupContentMalert("Please Select Team!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (
            editDetails?.employee === "" || !editDetails?.employee
        ) {
            setPopupContentMalert("Please Select Employee!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (
            editDetails?.assetmaterial === "" || !editDetails?.assetmaterial
        ) {
            setPopupContentMalert("Please Select Asset Material!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (
            editDetails?.assetmaterialcode === "" || !editDetails?.assetmaterialcode
        ) {
            setPopupContentMalert("Please Select Asset Material Code!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (
            editDetails?.returndate === "" || !editDetails?.returndate
        ) {
            setPopupContentMalert("Please Choose Return Date!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (
            editDetails?.returntime === "" || !editDetails?.returntime
        ) {
            setPopupContentMalert("Please Choose Return time!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if ([...uploadEdit,
        ...uploadedImagesEdit].length === 0) {
            setPopupContentMalert("Please Upload Image!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            sendEditRequest();
        }
    };


    const sendRequest = async () => {
        setPageName(!pageName);
        try {
            let singleUser = allUsersData?.find(item => item?.companyname === filterState?.employee)
            setIsLoading(true);

            let formData = new FormData();

            if (upload.length > 0) {
                upload.forEach((item, index) => {
                    formData.append("images", item.file); // Append image file
                    formData.append(`remarks[${index}]`, item.remarks || ""); // Append corresponding remark
                });
            }

            const jsonData = {
                company: [singleUser?.company],
                branch: [singleUser?.branch],
                unit: [singleUser?.unit],
                team: [singleUser?.team],
                employee: filterState?.employee || "",
                distributionid: filterState?.distributionid || "",
                assetmaterial: filterState?.assetmaterial || "",
                assetmaterialcode: filterState?.assetmaterialcode || "",
                returntime: filterState?.returntime || "",
                returndate: filterState?.returndate || "",
                description: filterState?.description || "",
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
            setFilteredChanges(null)
            setFilteredRowData([])

            await updateDistributionStatus(filterState?.distributionid, "Returned", filterState?.assetmaterial, filterState?.assetmaterialcode);
            await fetchReturnData();
            handleCloseModEdit();
            setPopupContent("Added Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setIsLoading(false);
            setUpload([]);

            setFilterState((prev) => ({
                type: "Individual",
                returndate: moment().format("YYYY-MM-DD"),
                returntime: moment().format("HH:mm"),
                description: "",
            }))
        } catch (err) {
            setIsLoading(false);
            console.log("Error Response:", err.response);
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
    const sendEditRequest = async () => {
        setPageName(!pageName);
        let singleUser = allUsersData?.find(item => item?.companyname === editDetails?.employee)
        try {
            setIsLoading(true);

            const formData = new FormData();

            if (uploadEdit.length > 0) {
                uploadEdit.forEach((item, index) => {
                    formData.append("images", item.file); // Append image file
                    formData.append(`remarks[${index}]`, item.remarks || ""); // Append corresponding remark
                });
            }


            if (uploadedImagesDelete.length > 0) {
                formData.append("uploadedImagesDelete", JSON.stringify(uploadedImagesDelete));
            }
            const jsonData = {
                uploadedImagesEdit: uploadedImagesEdit.length > 0 ? uploadedImagesEdit : [],
                company: [singleUser?.company],
                branch: [singleUser?.branch],
                unit: [singleUser?.unit],
                team: [singleUser?.team],
                employee: editDetails?.employee || "",
                distributionid: editDetails?.distributionid || "",
                assetmaterial: editDetails?.assetmaterial || "",
                assetmaterialcode: editDetails?.assetmaterialcode || "",
                returntime: editDetails?.returntime || "",
                returndate: editDetails?.returndate || "",
                description: editDetails?.description || "",
                updatedby: [
                    ...editDetails?.updatedby,
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            };
            formData.append("jsonData", JSON.stringify(jsonData));
            let res = await axios.put(
                `${SERVICE.EMPLOYEEASSETRETURNREGISTER_SINGLE}/${editDetails?._id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );
            setFilteredChanges(null)
            setFilteredRowData([]);
            if (oldDistributionId !== editDetails?.distributionid) {
                await updateDistributionStatus(editDetails?.distributionid, "Returned");
                await updateDistributionStatus(oldDistributionId, "Accepted", editDetails?.assetmaterial, editDetails?.assetmaterialcode, editDetails?.employee);
            }
            await fetchReturnData();
            handleCloseModEdit();
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
            console.log("Error Response:", err.response);
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


    const editSubmitNear = async (e) => {
        setPageName(!pageName)
        e.preventDefault();

        const isNameMatch = distributionDatas?.filter(data => data?.status !== "Returned").some(
            (item) =>
                item.assetmaterialcode === transferDetails.assetmaterialcode
        );
        if (transferDetails.transferdate === "") {
            setPopupContentMalert("Please Select AssignDate!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (transferDetails.transfertime === "") {
            setPopupContentMalert("Please Select AssignTime!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (transferDetails.company === "" || !transferDetails.company) {
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
        }

        else if (transferUpload.length === 0) {
            setPopupContentMalert("Please Upload Image!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (isNameMatch) {
            setPopupContentMalert("Data Already Exist!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else {
            sendTransferRequest();
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
                company: String(transferDetails?.assetcompany),
                branch: String(transferDetails?.assetbranch),
                unit: String(transferDetails?.assetunit),
                floor: String(transferDetails?.assetfloor),
                location: String(transferDetails?.assetlocation),
                area: String(transferDetails?.assetarea),
                employee: String(transferDetails?.employee),
                assetmaterial: transferDetails?.assetmaterial,
                assetmaterialcode: transferDetails?.assetmaterialcode,
                assetmaterialcheck: transferDetails.assetmaterialcheck,
                assigndate: String(transferDetails.transferdate),
                assigntime: String(transferDetails.transfertime),
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

            formData.append("jsonData", JSON.stringify(jsonData));
            let freqCreate = await axios.post(SERVICE.EMPLOYEEASSET_CREATE, formData, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },


            });

            await fetchReturnData();
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
    // const getTextAfterFirstDash = (inputString) => {
    //     const parts = inputString.split('-');
    //     return parts.slice(1).join('-');
    // };
    function getTextAfterFirstDash(str1, str2) {
        // Use String.prototype.replace to remove the first occurrence of str1 from str2
        const newStr = str2.replace(new RegExp(`^${str1}[-]?`), "");
        return newStr;
    }
    const updateDistributionStatus = async (id, status, assetmaterial, assetcode, employee) => {
        setPageName(!pageName)

        try {
            const formData = new FormData();
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
            if (status === "Returned" && assetcode && assetmaterial) {
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
            if (status === "Accepted" && assetcode && employee && assetmaterial) {
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

    const handleClear = (e) => {
        e.preventDefault();
        setSelectedOptionsBranch([]);
        setSelectedOptionsUnit([]);
        setSelectedOptionsTeam([]);
        setSelectedOptionsCompany([]);
        setValueCompanyCat([]);
        setValueBranchCat([]);
        setValueUnitCat([]);
        setValueTeamCat([]);
        setIsManualUser([])
        setChecked(false);
        setSelectedUserType("Employee");
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
    };

    const [isEditOpenCheckList, setIsEditOpenCheckList] = useState(false);
    const handleClickOpenEditCheckList = () => {
        setIsEditOpenCheckList(true);
    };
    const handleCloseModEditCheckList = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpenCheckList(false);
    };

    //webcam




    //add webcamera popup



    //------------------------------------------------------------------------------------------------------------





    const [employeeOptions, setEmployeeOptions] = useState([]);
    const [filterState, setFilterState] = useState({
        type: "Individual",
        employee: "",
        assetmaterial: "",
        assetmaterialcode: "",
        returndate: moment().format("YYYY-MM-DD"),
        returntime: moment().format("HH:mm"),
        description: "",
        distributionid: "",
    });


    const [upload, setUpload] = useState([]);
    const handleResumeUpload = (event) => {
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

        setUpload((prevFiles) => [
            ...prevFiles,
            ...filteredFiles.map((file) => ({
                file,
                remarks: ""
            })),
        ]);
    };
    const handleRemarkChangeUpload = (value, index) => {
        setUpload((prev) =>
            prev.map((file, i) =>
                i === index ? { ...file, remarks: value } : file
            )
        );
    };
    const [uploadEdit, setUploadEdit] = useState([]);
    const [uploadedImagesEdit, setUploadedImagesEdit] = useState([]);
    const [uploadedImagesDelete, setUploadImagesDelete] = useState([]);
    const handleResumeUploadEdit = (event) => {
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

        setUploadEdit((prevFiles) => [
            ...prevFiles,
            ...filteredFiles.map((file) => ({
                file,
                remarks: ""
            })),
        ]);
    };
    const handleRemarkChangeUploadEdit = (value, index) => {
        setUploadEdit((prev) =>
            prev.map((file, i) =>
                i === index ? { ...file, remarks: value } : file
            )
        );
    };

    const handleRemarkChangeUploadedEdit = (value, index) => {
        setUploadedImagesEdit((prev) =>
            prev.map((file, i) =>
                i === index ? { ...file, remarks: value } : file
            )
        );
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
    const handleFileDelete = (index) => {
        setUpload((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };
    const handleFileDeleteEdit = (index) => {
        setUploadEdit((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const handleFileDeleteEditUploaded = (index) => {
        setUploadedImagesEdit((prevFiles) => {
            const fileToDelete = prevFiles[index];

            // Store the deleted file separately
            setUploadImagesDelete((prevDeleted) => [...prevDeleted, fileToDelete]);

            // Remove from uploadedFiles state
            return prevFiles.filter((_, i) => i !== index);
        });

    };
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

    const [accordianCreate, setAccordianCreate] = useState([])
    const [accordianCreateEdit, setAccordianCreateEdit] = useState([]);
    const [accordianCreateTransfer, setAccordianCreateTransfer] = useState([]);
    const [accordianCreateView, setAccordianCreateView] = useState([]);


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


    //MULTISELECT ONCHANGE START
    const employemnetTypeOptions = [
        { label: "Employee", value: "Employee" },
        { label: "Internship", value: "Internship" },
    ]

    //Employement Type  multiselect
    const [selectedOptionsEmployementType, setSelectedOptionsEmployementType] = useState(employemnetTypeOptions);
    let [valueEmployementTypeCat, setValueEmployementTypeCat] = useState(["Employee", "Internship"]);

    const handleEmployementTypeChange = (options) => {
        setValueEmployementTypeCat(
            options?.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsEmployementType(options);
        setValueEmployeeCat([]);
        setSelectedOptionsEmployee([]);
    };

    const customValueRendererEmployementType = (valueEmployementTypeCat, _categoryname) => {
        return valueEmployementTypeCat?.length
            ? valueEmployementTypeCat?.map(({ label }) => label)?.join(", ")
            : "Please Select Employement Type";
    };
    //Account Status   multiselect





    let [valueStatusCat, setValueStatusCat] = useState([
        "Online",
        "Offline",
        "Away",
        "Busy",
    ]);


    //Registration Status   multiselect

    const RegistrationStatusOptions = [
        { label: "Active", value: "Active" },
        { label: "Pending", value: "Pending" },
        { label: "Deactivated", value: "Deactivated" },
    ]

        ;


    //company multiselect
    const [selectedOptionsCompany, setSelectedOptionsCompany] = useState([]);
    let [valueCompanyCat, setValueCompanyCat] = useState([]);

    const handleCompanyChange = (options) => {
        setValueCompanyCat(
            options?.map((a, index) => {
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
            ? valueCompanyCat?.map(({ label }) => label)?.join(", ")
            : "Please Select Company";
    };

    //branch multiselect
    const [selectedOptionsBranch, setSelectedOptionsBranch] = useState([]);
    let [valueBranchCat, setValueBranchCat] = useState([]);

    const handleBranchChange = (options) => {
        setValueBranchCat(
            options?.map((a, index) => {
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
            ? valueBranchCat?.map(({ label }) => label)?.join(", ")
            : "Please Select Branch";
    };

    //unit multiselect
    const [selectedOptionsUnit, setSelectedOptionsUnit] = useState([]);
    let [valueUnitCat, setValueUnitCat] = useState([]);

    const handleUnitChange = (options) => {
        setValueUnitCat(
            options?.map((a, index) => {
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
            ? valueUnitCat?.map(({ label }) => label)?.join(", ")
            : "Please Select Unit";
    };

    //team multiselect
    const [selectedOptionsTeam, setSelectedOptionsTeam] = useState([]);
    let [valueTeamCat, setValueTeamCat] = useState([]);

    const handleTeamChange = (options) => {
        setValueTeamCat(
            options?.map((a, index) => {
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
            ? valueTeamCat?.map(({ label }) => label)?.join(", ")
            : "Please Select Team";
    };

    //department multiselect
    const [selectedOptionsDepartment, setSelectedOptionsDepartment] = useState(
        []
    );
    let [valueDepartmentCat, setValueDepartmentCat] = useState([]);

    const handleDepartmentChange = (options) => {
        setValueDepartmentCat(
            options?.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsDepartment(options);
        setValueEmployeeCat([]);
        setSelectedOptionsEmployee([]);
    };

    const customValueRendererDepartment = (valueDepartmentCat, _categoryname) => {
        return valueDepartmentCat?.length
            ? valueDepartmentCat?.map(({ label }) => label)?.join(", ")
            : "Please Select Department";
    };
    //employee multiselect
    const [selectedOptionsEmployee, setSelectedOptionsEmployee] = useState([]);
    let [valueEmployeeCat, setValueEmployeeCat] = useState([]);

    const handleEmployeeChange = (options) => {
        setValueEmployeeCat(
            options?.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsEmployee(options);
    };

    const customValueRendererEmployee = (valueEmployeeCat, _categoryname) => {
        return valueEmployeeCat?.length
            ? valueEmployeeCat?.map(({ label }) => label)?.join(", ")
            : "Please Select Employee";
    };


    //designation multiselect
    const [selectedOptionsDesignation, setSelectedOptionsDesignation] = useState(
        []
    );
    let [valueDesignationCat, setValueDesignationCat] = useState([]);

    const handleDesignationChange = (options) => {
        setValueDesignationCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsDesignation(options);
        setValueEmployeeCat([]);
        setSelectedOptionsEmployee([]);
    };

    const customValueRendererDesignation = (valueDesignationCat, _categoryname) => {
        return valueDesignationCat?.length
            ? valueDesignationCat.map(({ label }) => label)?.join(", ")
            : "Please Select Designation";
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
        setValueDesignationCat([]);
        setSelectedOptionsDesignation([]);
        setValueEmployeeCat([]);
        setSelectedOptionsEmployee([]);
        setValueEmployementTypeCat([]);
        setSelectedOptionsEmployementType([]);
        setValueStatusCat([]);
        setEmployeeOptions([]);
        setIsManualUser([]);
        setUpload([]);
        setFilterState({
            ...filterState,
            type: "Individual",
            returndate: moment().format("YYYY-MM-DD"),
            returntime: moment().format("HH:mm"),
            description: "",
        });

        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
    };

    const [filterLoader, setFilterLoader] = useState(false);
    const [tableLoader, setTableLoader] = useState(false);
    const handleSubmit = () => {
        if (selectedOptionsCompany?.length === 0) {
            setPopupContentMalert("Please Select Company!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (
            selectedOptionsBranch?.length === 0
        ) {
            setPopupContentMalert("Please Select Branch!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            selectedOptionsUnit?.length === 0
        ) {
            setPopupContentMalert("Please Select Unit!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            selectedOptionsTeam?.length === 0
        ) {
            setPopupContentMalert("Please Select Team!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (
            filterState?.employee === "" || !filterState?.employee
        ) {
            setPopupContentMalert("Please Select Employee!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (
            filterState?.assetmaterial === "" || !filterState?.assetmaterial
        ) {
            setPopupContentMalert("Please Select Asset Material!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (
            filterState?.assetmaterialcode === "" || !filterState?.assetmaterialcode
        ) {
            setPopupContentMalert("Please Select Asset Material Code!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (
            filterState?.returndate === "" || !filterState?.returndate
        ) {
            setPopupContentMalert("Please Choose Return Date!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (
            filterState?.returntime === "" || !filterState?.returntime
        ) {
            setPopupContentMalert("Please Choose Return time!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (
            upload?.length === 0
        ) {
            setPopupContentMalert("Please Upload Image!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            sendRequest();
        }
    };

    useEffect(() => { fetchReturnData() }, [])
    const [distributionDatas, setDistributionDatas] = useState([])
    const fetchReturnData = async () => {
        setPageName(!pageName);
        setLoader(true);
        setisBtnFilter(true);
        setFilterLoader(true);
        setTableLoader(true);
        try {
            let response = await axios.post(
                SERVICE.EMPLOYEEASSETRETURNREGISTER,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    assignbranch: accessbranch,
                }
            );
            let res_project = await axios.get(SERVICE.EMPLOYEEASSET, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let distribution = res_project?.data?.employeeassets
            setDistributionDatas(distribution)

            const itemsWithSerialNumber = response?.data?.allassetreturn.map((item, index) => {
                // Get the current assetmaterialcode
                const currentCode = item?.assetmaterialcode;

                // Find all matching records in distribution
                const matchingRecords = distribution?.filter(
                    dist => dist?.assetmaterialcode === currentCode
                );

                // Check if all statuses are "Returned"
                const allReturned = matchingRecords.every(
                    record => record?.status === "Returned"
                );
                let editTable = false;
                if (matchingRecords?.length > 0) {
                    // Sort matchingRecords by createdAt in descending order
                    const sortedRecords = matchingRecords.sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                    );

                    // Take the most recent record and compare its _id
                    const mostRecentRecord = sortedRecords[0];
                    editTable = mostRecentRecord?._id === item?.distributionid;
                }

                return {
                    serialNumber: index + 1,
                    id: item._id,
                    company: item?.company?.join(","),
                    branch: item?.branch?.join(","),
                    unit: item?.unit?.join(","),
                    team: item?.team?.join(","),
                    employee: item?.employee,
                    distributionid: item?.distributionid,
                    assetmaterial: item?.assetmaterial,
                    assetmaterialcode: item?.assetmaterialcode,
                    returntime: moment(item?.returntime, "HH:mm").format("hh:mm A"),
                    returndate: moment(item?.returndate, "YYYY-MM-DD").format("DD-MM-YYYY"),
                    description: item?.description,
                    addedby: item?.addedby?.length > 0 ? item?.addedby : [],
                    updatedby: item?.updatedby?.length > 0 ? item?.updatedby : [],
                    transfer: allReturned, // Add transfer property based on status check
                    editTable: editTable, // Add editTable property based on status check
                };
            });


            setEmployees(itemsWithSerialNumber);

            setisBtnFilter(false);
            setLoader(false);
            setFilterLoader(false);
            setTableLoader(false);
        } catch (err) {
            setFilterLoader(false);
            setTableLoader(false);
            setLoader(false);
            setisBtnFilter(false);
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
        try {
            let selectedValues = accessbranch
                ?.map((data) => ({
                    company: data.company,
                    branch: data.branch,
                    unit: data.unit,
                }))
                ?.filter(
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
                ?.map((a, index) => {
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
                ?.filter(
                    (value, index, self) =>
                        index ===
                        self.findIndex(
                            (t) => t.company === value.company && t.branch === value.branch
                        )
                )
                ?.map((a, index) => {
                    return a.branch;
                });

            let mappedBranch = selectedValues
                ?.filter(
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
                ?.filter(
                    (value, index, self) =>
                        index ===
                        self.findIndex(
                            (t) =>
                                t.company === value.company &&
                                t.branch === value.branch &&
                                t.unit === value.unit
                        )
                )
                ?.map((a, index) => {
                    return a.unit;
                });

            let mappedUnit = selectedValues
                ?.filter(
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
                ?.map((u) => ({
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
                ?.map((u) => u.teamname);

            let mappedemployees = allUsersData
                ?.filter(
                    (u) =>
                        selectedCompany?.includes(u.company) &&
                        selectedBranch?.includes(u.branch) &&
                        selectedUnit?.includes(u.unit) &&
                        selectedTeam?.includes(u.team)
                )
                ?.map((u) => ({
                    label: u.companyname,
                    value: u.companyname,
                }));

            let employees = allUsersData
                ?.filter(
                    (u) =>
                        selectedCompany?.includes(u.company) &&
                        selectedBranch?.includes(u.branch) &&
                        selectedUnit?.includes(u.unit) &&
                        selectedTeam?.includes(u.team)
                )
                ?.map((u) => u.companyname);
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

    // useEffect(() => {
    //     handleAutoSelect();
    // }, [isAssignBranch]);

    //FILTER END

    return (
        <Box>
            <NotificationContainer />
            <Headtitle title={"EMPLOYEE ASSET RETURN REGISTER"} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Employee Asset Return Register"
                modulename="Asset"
                submodulename="Asset Register"
                mainpagename="Employee Asset Return Register"
                subpagename=""
                subsubpagename=""
            />
            {isUserRoleCompare?.includes("aemployeeassetreturnregister") && (
                <>
                    <Box sx={userStyle.dialogbox}>
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography sx={userStyle.importheadtext}>
                                        Add Employee Asset Return Register
                                    </Typography>
                                </Grid>

                                <Grid item xs={12}>
                                    <Grid container spacing={2}>

                                        <>
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
                                                            ?.filter((item, index, self) => {
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
                                                            setFilterState({
                                                                ...filterState,
                                                                employee: "",
                                                                assetmaterial: "",
                                                                assetmaterialcode: "",
                                                                distributionid: "",
                                                            });
                                                            setDistributionDetails([])
                                                        }}
                                                        valueRenderer={customValueRendererCompany}
                                                        labelledBy="Please Select Company"
                                                    />
                                                </FormControl>
                                            </Grid>
                                            {/* Branch Unit Team */}
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        {" "}
                                                        Branch <b style={{ color: "red" }}>*</b>
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
                                                            ?.filter((item, index, self) => {
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
                                                            setFilterState({
                                                                ...filterState,
                                                                employee: "",
                                                                assetmaterial: "",
                                                                assetmaterialcode: "",
                                                                distributionid: "",
                                                            });
                                                            setDistributionDetails([])
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
                                                            ?.filter((item, index, self) => {
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
                                                            setFilterState({
                                                                ...filterState,
                                                                employee: "",
                                                                assetmaterial: "",
                                                                assetmaterialcode: "",
                                                                distributionid: "",
                                                            });
                                                            setDistributionDetails([])
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
                                                            ?.map((u) => ({
                                                                ...u,
                                                                label: u.teamname,
                                                                value: u.teamname,
                                                            }))}
                                                        value={selectedOptionsTeam}
                                                        onChange={(e) => {
                                                            handleTeamChange(e);
                                                            setFilterState({
                                                                ...filterState,
                                                                employee: "",
                                                                assetmaterial: "",
                                                                assetmaterialcode: "",
                                                                distributionid: "",
                                                            });
                                                            setDistributionDetails([])
                                                        }}
                                                        valueRenderer={customValueRendererTeam}
                                                        labelledBy="Please Select Team"
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        Employee<b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    {/* <MultiSelect
                                                                options={allUsersData
                                                                    ?.filter((u) => {
                                                                        
                                                                        // If it contains both or is empty, apply no filtering on workmode
                                                                        return (
                                                                            valueCompanyCat?.includes(u.company) &&
                                                                            valueBranchCat?.includes(u.branch) &&
                                                                            valueUnitCat?.includes(u.unit) &&
                                                                            valueTeamCat?.includes(u.team)
                                                                        );
                                                                    })
                                                                    ?.map((u) => ({
                                                                        label: u.companyname,
                                                                        value: u.companyname,
                                                                    }))
                                                                }
                                                                value={selectedOptionsEmployee}
                                                                onChange={(e) => {
                                                                    handleEmployeeChange(e);
                                                                }}
                                                                valueRenderer={customValueRendererEmployee}
                                                                labelledBy="Please Select Employee"
                                                            /> */}
                                                    <Selects
                                                        options={allUsersData
                                                            ?.filter((u) => {

                                                                // If it contains both or is empty, apply no filtering on workmode
                                                                return (
                                                                    valueCompanyCat?.includes(u.company) &&
                                                                    valueBranchCat?.includes(u.branch) &&
                                                                    valueUnitCat?.includes(u.unit) &&
                                                                    valueTeamCat?.includes(u.team)
                                                                );
                                                            })
                                                            ?.map((u) => ({
                                                                label: u.companyname,
                                                                value: u.companyname,
                                                            }))
                                                        }
                                                        value={{
                                                            label: filterState?.employee ? filterState?.employee : "Please Select Employee",
                                                            value: filterState?.employee ? filterState?.employee : "Please Select Employee",
                                                        }}
                                                        onChange={(e) => {
                                                            setFilterState({
                                                                ...filterState,
                                                                employee: e.value,
                                                                assetmaterial: "",
                                                                assetmaterialcode: "",
                                                                distributionid: "",
                                                            });
                                                            fetchEmployeeDistribution(e.value, setDistributionDetails)
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        Asset Material<b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <Selects
                                                        options={distributionDetails?.map(data => ({
                                                            label: data?.assetmaterial,
                                                            value: data?.assetmaterial,
                                                        })).filter((item, index, self) => {
                                                            return (
                                                                self.findIndex(
                                                                    (i) =>
                                                                        i.label === item.label &&
                                                                        i.value === item.value
                                                                ) === index
                                                            );
                                                        })}
                                                        value={{
                                                            label: filterState?.assetmaterial ? filterState?.assetmaterial : "Please Select Asset Material",
                                                            value: filterState?.assetmaterial ? filterState?.assetmaterial : "Please Select Asset Material",
                                                        }}
                                                        onChange={(e) => {
                                                            setFilterState({
                                                                ...filterState,
                                                                assetmaterial: e.value,
                                                                assetmaterialcode: "",
                                                                distributionid: "",
                                                            });

                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        Asset Material Code<b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <Selects
                                                        options={distributionDetails?.filter(item => item?.assetmaterial === filterState?.assetmaterial)?.map(data => ({
                                                            label: data?.assetmaterialcode,
                                                            value: data?.assetmaterialcode,
                                                            distributionid: data?._id,
                                                        })).filter((item, index, self) => {
                                                            return (
                                                                self.findIndex(
                                                                    (i) =>
                                                                        i.label === item.label &&
                                                                        i.value === item.value
                                                                ) === index
                                                            );
                                                        })}
                                                        value={{
                                                            label: filterState?.assetmaterialcode ? filterState?.assetmaterialcode : "Please Select Asset Material Code",
                                                            value: filterState?.assetmaterialcode ? filterState?.assetmaterialcode : "Please Select Asset Material Code",
                                                        }}
                                                        onChange={(e) => {
                                                            setFilterState({
                                                                ...filterState,
                                                                assetmaterialcode: e.value,
                                                                distributionid: e.distributionid,
                                                            });
                                                            fetchComponents(filterState?.assetmaterial, e.value, setAccordianCreate);
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            {accordianCreate?.length > 0 &&
                                                <Grid item md={12} xs={12} sm={12}>
                                                    <FormControl fullWidth size="small">
                                                        <Accordion data={accordianCreate} />
                                                    </FormControl>
                                                </Grid>}
                                            <Grid item md={1.7} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        Return Date <b style={{ color: "red" }}>*</b>{" "}
                                                    </Typography>
                                                    <OutlinedInput
                                                        value={filterState.returndate}
                                                        type="date"
                                                        onChange={(e) => {
                                                            setFilterState({
                                                                ...filterState,
                                                                returndate: e.target.value,
                                                            });
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={1.3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        Return Time <b style={{ color: "red" }}>*</b>{" "}
                                                    </Typography>
                                                    <OutlinedInput
                                                        value={filterState.returntime}
                                                        type="time"
                                                        onChange={(e) => {
                                                            setFilterState({
                                                                ...filterState,
                                                                returntime: e.target.value,
                                                            });
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
                                                        value={filterState.description}
                                                        onChange={(e) => {
                                                            setFilterState({
                                                                ...filterState,
                                                                description: e.target.value,
                                                            });
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>

                                            <Grid
                                                item
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
                                                        accept="image/*"
                                                        name="file"
                                                        hidden
                                                        onChange={handleResumeUpload}
                                                    />
                                                </Button>
                                            </Grid>
                                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                                {upload?.length > 0 && upload?.map((data, index) => {
                                                    const fileURL = URL.createObjectURL(data.file); // Generate a URL for the file preview

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
                                                                    onChange={(e) => handleRemarkChangeUpload(e.target.value, index)}
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
                                                                    onClick={() => handleFileDelete(index)}
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
                                        </>
                                        <Grid item md={3} xs={12} sm={6} mt={3}>
                                            <div style={{ display: "flex", gap: "20px" }}>
                                                <LoadingButton
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={handleSubmit}
                                                    loading={filterLoader}
                                                    sx={buttonStyles.buttonsubmit}
                                                >
                                                    Submit
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
                                </Grid>
                            </Grid>
                        </>
                    </Box>
                </>
            )}
            <br />
            {tableLoader ? (
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
                <>
                    {isUserRoleCompare?.includes("lemployeeassetreturnregister") && (
                        <>
                            <Box sx={userStyle.container}>
                                {/* ******************************************************EXPORT Buttons****************************************************** */}
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Typography sx={userStyle.SubHeaderText}>
                                            Employee Asset Return Register
                                        </Typography>
                                    </Grid>

                                </Grid>
                                <br />
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
                                                <MenuItem value={employees?.length}>All</MenuItem>
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
                                                "excelemployeeassetreturnregister"
                                            ) && (
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
                                            {isUserRoleCompare?.includes(
                                                "csvemployeeassetreturnregister"
                                            ) && (
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
                                            {isUserRoleCompare?.includes(
                                                "printemployeeassetreturnregister"
                                            ) && (
                                                    <>
                                                        <Button
                                                            sx={userStyle.buttongrp}
                                                            onClick={handleprint}
                                                        >
                                                            &ensp;
                                                            <FaPrint />
                                                            &ensp;Print&ensp;
                                                        </Button>
                                                    </>
                                                )}
                                            {isUserRoleCompare?.includes(
                                                "pdfemployeeassetreturnregister"
                                            ) && (
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
                                            {isUserRoleCompare?.includes(
                                                "imageemployeeassetreturnregister"
                                            ) && (
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
                                    <Grid item md={2} xs={6} sm={6}>

                                        <AggregatedSearchBar
                                            columnDataTable={columnDataTable}
                                            setItems={setItems}
                                            addSerialNumber={addSerialNumber}
                                            setPage={setPage}
                                            maindatas={employees}
                                            setSearchedString={setSearchedString}
                                            searchQuery={searchQuery}
                                            setSearchQuery={setSearchQuery}
                                            paginated={false}
                                            totalDatas={employees}
                                        />
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
                                &emsp;
                                {/* {isUserRoleCompare?.includes("bdemployeeassetreturnregister") && (
                                    <Button
                                        variant="contained"
                                        color="error"
                                        sx={buttonStyles.buttonbulkdelete}
                                        onClick={handleClickOpenalert}
                                    >
                                        Bulk Delete
                                    </Button>
                                )} */}
                                <br />
                                <br />
                                <AggridTable
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
                                    paginated={false}
                                    filteredDatas={filteredDatas}
                                    // totalDatas={totalDatas}
                                    searchQuery={searchQuery}
                                    handleShowAllColumns={handleShowAllColumns}
                                    setFilteredRowData={setFilteredRowData}
                                    filteredRowData={filteredRowData}
                                    setFilteredChanges={setFilteredChanges}
                                    filteredChanges={filteredChanges}
                                    gridRefTableImg={gridRefTableImg}
                                    itemsList={employees}
                                />
                            </Box>
                        </>
                    )}
                </>
            )}

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
                filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
                itemsTwo={employees ?? []}
                filename={"EmployeeAssetReturnRegister"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />

            {/* EXTERNAL COMPONENTS -------------- END */}



            {/* view model */}
            <Dialog
                open={openview}
                onClose={handleClickOpenview}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth={true}
                maxWidth="lg"
                sx={{ marginTop: "50px" }}
            >
                <Box sx={{ padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}>
                            {" "}
                            View Employee Asset Return Register
                        </Typography>
                        <br />
                        <Grid container spacing={2}>


                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Company</Typography>
                                    <Typography>{viewDetails?.company}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Branch</Typography>
                                    <Typography>{viewDetails?.branch}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Unit</Typography>
                                    <Typography>{viewDetails?.unit}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Team</Typography>
                                    <Typography>{viewDetails?.team}</Typography>
                                </FormControl>
                            </Grid>

                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Employee Name</Typography>
                                    <Typography>{viewDetails.employee}</Typography>
                                </FormControl>
                            </Grid>

                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Asset Material</Typography>
                                    <Typography>{viewDetails.assetmaterial}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Asset Material Code</Typography>
                                    <Typography>{viewDetails.assetmaterialcode}</Typography>
                                </FormControl>
                            </Grid>
                            {accordianCreateView?.length > 0 &&
                                <Grid item md={12} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Accordion data={accordianCreateView} />
                                    </FormControl>
                                </Grid>}
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Return Date</Typography>
                                    <Typography>{moment(viewDetails.returndate, "YYYY-MM-DD").format("DD-MM-YYYY")}</Typography>

                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Return Time</Typography>
                                    <Typography>{moment(viewDetails?.returntime, "HH:mm").format("hh:mm A")}</Typography>

                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Description</Typography>
                                    <Typography>{viewDetails.description}</Typography>
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
                                {viewDetails?.images?.length > 0 &&
                                    viewDetails.images.map((file, index) => (
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
                        <br /> <br /> <br /> <br />
                        <Grid container spacing={2}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleCloseview}
                                sx={buttonStyles.btncancel}
                            >
                                Back
                            </Button>
                        </Grid>
                    </>
                </Box>
            </Dialog>


            {/* Edit DIALOG */}
            <Box>
                <Dialog
                    open={isEditOpen}
                    onClose={handleCloseModEdit}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="lg"
                    fullWidth={true}
                    sx={{

                        marginTop: "50px"
                    }}
                >
                    <Box sx={{ padding: "20px 50px" }}>
                        <>
                            <Grid container spacing={2}>
                                <Typography sx={userStyle.HeaderText}>
                                    Edit Employee Asset Return Details
                                </Typography>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>

                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Company<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect
                                            options={accessbranch
                                                ?.map((data) => ({
                                                    label: data.company,
                                                    value: data.company,
                                                }))
                                                ?.filter((item, index, self) => {
                                                    return (
                                                        self.findIndex(
                                                            (i) =>
                                                                i.label === item.label &&
                                                                i.value === item.value
                                                        ) === index
                                                    );
                                                })}
                                            value={editDetails?.company}
                                            onChange={(e) => {
                                                setEditDetails((prev) => ({
                                                    ...prev,
                                                    company: e,
                                                    branch: [],
                                                    unit: [],
                                                    team: [],
                                                    employee: "",
                                                    assetmaterial: "",
                                                    assetmaterialcode: "",
                                                    distributionid: "",
                                                }));
                                                setDistributionDetailsEdit([])
                                            }}
                                            valueRenderer={customValueRendererCompany}
                                            labelledBy="Please Select Company"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Branch<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect
                                            options={accessbranch
                                                ?.filter((comp) =>
                                                    editDetails?.company?.map(item => item.value)?.includes(comp.company)
                                                )
                                                ?.map((data) => ({
                                                    label: data.branch,
                                                    value: data.branch,
                                                }))
                                                ?.filter((item, index, self) => {
                                                    return (
                                                        self.findIndex(
                                                            (i) =>
                                                                i.label === item.label &&
                                                                i.value === item.value
                                                        ) === index
                                                    );
                                                })}
                                            value={editDetails?.branch}
                                            onChange={(e) => {
                                                setEditDetails((prev) => ({
                                                    ...prev,
                                                    branch: e,
                                                    unit: [],
                                                    team: [],
                                                    employee: "",
                                                    assetmaterial: "",
                                                    assetmaterialcode: "",
                                                    distributionid: "",
                                                }));
                                                setDistributionDetailsEdit([])
                                            }}
                                            valueRenderer={customValueRendererBranch}
                                            labelledBy="Please Select Branch"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Unit<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect
                                            options={accessbranch
                                                ?.filter(
                                                    (comp) =>
                                                        editDetails?.company?.map(item => item.value)?.includes(comp.company) &&
                                                        editDetails?.branch?.map(item => item.value)?.includes(comp.branch)
                                                )
                                                ?.map((data) => ({
                                                    label: data.unit,
                                                    value: data.unit,
                                                }))
                                                ?.filter((item, index, self) => {
                                                    return (
                                                        self.findIndex(
                                                            (i) =>
                                                                i.label === item.label &&
                                                                i.value === item.value
                                                        ) === index
                                                    );
                                                })}
                                            value={editDetails?.unit}
                                            onChange={(e) => {
                                                setEditDetails((prev) => ({
                                                    ...prev,
                                                    unit: e,
                                                    team: [],
                                                    employee: "",
                                                    assetmaterial: "",
                                                    assetmaterialcode: "",
                                                    distributionid: "",
                                                }));
                                                setDistributionDetailsEdit([])
                                            }}
                                            valueRenderer={customValueRendererUnit}
                                            labelledBy="Please Select Unit"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Team<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect
                                            options={allTeam
                                                ?.filter(
                                                    (u) =>
                                                        editDetails?.company?.map(item => item.value)?.includes(u.company) &&
                                                        editDetails?.branch?.map(item => item.value)?.includes(u.branch) &&
                                                        editDetails?.unit?.map(item => item.value)?.includes(u.unit)
                                                )
                                                ?.map((u) => ({
                                                    ...u,
                                                    label: u.teamname,
                                                    value: u.teamname,
                                                }))}
                                            value={editDetails?.team}
                                            onChange={(e) => {
                                                setEditDetails((prev) => ({
                                                    ...prev,
                                                    team: e,
                                                    employee: "",
                                                    assetmaterial: "",
                                                    assetmaterialcode: "",
                                                    distributionid: "",
                                                }));
                                                setDistributionDetailsEdit([])
                                            }}
                                            valueRenderer={customValueRendererTeam}
                                            labelledBy="Please Select Team"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Employee<b style={{ color: "red" }}>*</b>
                                        </Typography>

                                        <Selects
                                            options={allUsersData
                                                ?.filter((u) => {

                                                    // If it contains both or is empty, apply no filtering on workmode
                                                    return (
                                                        editDetails?.company?.map(item => item.value)?.includes(u.company) &&
                                                        editDetails?.branch?.map(item => item.value)?.includes(u.branch) &&
                                                        editDetails?.unit?.map(item => item.value)?.includes(u.unit) &&
                                                        editDetails?.team?.map(item => item.value)?.includes(u.team)
                                                    );
                                                })
                                                ?.map((u) => ({
                                                    label: u.companyname,
                                                    value: u.companyname,
                                                }))
                                            }
                                            value={{
                                                label: editDetails?.employee ? editDetails?.employee : "Please Select Employee",
                                                value: editDetails?.employee ? editDetails?.employee : "Please Select Employee",
                                            }}
                                            onChange={(e) => {
                                                setEditDetails((prev) => ({
                                                    ...prev,
                                                    employee: e.value,
                                                    assetmaterial: "",
                                                    assetmaterialcode: "",
                                                    distributionid: "",
                                                }));
                                                fetchEmployeeDistribution(e.value, setDistributionDetailsEdit)
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Asset Material<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={distributionDetailsEdit?.map(data => ({
                                                label: data?.assetmaterial,
                                                value: data?.assetmaterial,
                                            })).filter((item, index, self) => {
                                                return (
                                                    self.findIndex(
                                                        (i) =>
                                                            i.label === item.label &&
                                                            i.value === item.value
                                                    ) === index
                                                );
                                            })}
                                            value={{
                                                label: editDetails?.assetmaterial ? editDetails?.assetmaterial : "Please Select Asset Material",
                                                value: editDetails?.assetmaterial ? editDetails?.assetmaterial : "Please Select Asset Material",
                                            }}
                                            onChange={(e) => {
                                                setEditDetails((prev) => ({
                                                    ...prev,
                                                    assetmaterial: e.value,
                                                    assetmaterialcode: "",
                                                    distributionid: "",
                                                }));
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Asset Material Code<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={distributionDetailsEdit?.filter(item => item?.assetmaterial === editDetails?.assetmaterial)?.map(data => ({
                                                label: data?.assetmaterialcode,
                                                value: data?.assetmaterialcode,
                                                distributionid: data?._id,
                                            })).filter((item, index, self) => {
                                                return (
                                                    self.findIndex(
                                                        (i) =>
                                                            i.label === item.label &&
                                                            i.value === item.value
                                                    ) === index
                                                );
                                            })}
                                            value={{
                                                label: editDetails?.assetmaterialcode ? editDetails?.assetmaterialcode : "Please Select Asset Material Code",
                                                value: editDetails?.assetmaterialcode ? editDetails?.assetmaterialcode : "Please Select Asset Material Code",
                                            }}
                                            onChange={(e) => {

                                                setEditDetails((prev) => ({
                                                    ...prev,
                                                    assetmaterialcode: e.value,
                                                    distributionid: e.distributionid,
                                                }));
                                                fetchComponents(editDetails?.assetmaterial, e.value, setAccordianCreateEdit);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                {accordianCreateEdit?.length > 0 &&
                                    <Grid item md={12} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Accordion data={accordianCreateEdit} />
                                        </FormControl>
                                    </Grid>}
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Return Date <b style={{ color: "red" }}>*</b>{" "}
                                        </Typography>
                                        <OutlinedInput
                                            value={editDetails.returndate}
                                            type="date"
                                            onChange={(e) => {

                                                setEditDetails((prev) => ({
                                                    ...prev,
                                                    returndate: e.target.value,
                                                }));
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Return Time <b style={{ color: "red" }}>*</b>{" "}
                                        </Typography>
                                        <OutlinedInput
                                            value={editDetails.returntime}
                                            type="time"
                                            onChange={(e) => {

                                                setEditDetails((prev) => ({
                                                    ...prev,
                                                    returntime: e.target.value,
                                                }));
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Description
                                        </Typography>
                                        <TextareaAutosize
                                            aria-label="minimum height"
                                            minRows={2.5}
                                            value={editDetails.description}
                                            onChange={(e) => {

                                                setEditDetails((prev) => ({
                                                    ...prev,
                                                    description: e.target.value,
                                                }));
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={8} xs={12} sm={12}></Grid>
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
                                            onChange={handleResumeUploadEdit}
                                        />
                                    </Button>
                                </Grid>
                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                    {uploadEdit?.length > 0 && uploadEdit?.map((data, index) => {
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
                                                        onChange={(e) => handleRemarkChangeUploadEdit(e.target.value, index)}
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
                                                        onClick={() => renderFilePreview(data?.file)}
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
                                                        onClick={() => handleFileDeleteEdit(index)}
                                                    >
                                                        <FaTrash
                                                            style={{ fontSize: "18px", color: "#a73131" }}
                                                        />
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        )
                                    })}
                                    {uploadedImagesEdit?.length > 0 && uploadedImagesEdit?.map((data, index) => {
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
                                                        {data?.mimetype?.includes("image/") ? (
                                                            <img
                                                                src={data.preview ? data.preview : `${SERVICE.VEIW_ASSET_REGISTER_FILES}/${data.filename}`} // Use the correct server path
                                                                alt={data.name}
                                                                height={40}
                                                                style={{
                                                                    maxWidth: "100%",
                                                                }}
                                                            />
                                                        ) : (
                                                            <img
                                                                className={classes.preview}
                                                                src={getFileIcon(data.name)}
                                                                height={40}
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
                                                        {data.name}
                                                    </Typography>
                                                </Grid>

                                                {/* Remarks Input */}
                                                <Grid item md={4} sm={4} xs={4}>
                                                    <TextField
                                                        variant="outlined"
                                                        size="small"
                                                        placeholder="Enter remarks"
                                                        value={data?.remarks || ""}
                                                        onChange={(e) => handleRemarkChangeUploadedEdit(e.target.value, index)}
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
                                                        onClick={() => renderFilePreviewMulterUploaded(data)}
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
                                                        onClick={() => handleFileDeleteEditUploaded(index)}
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
                            </Grid>


                            <br /> <br />
                            <Grid
                                container
                                spacing={2}
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Grid item md={3} xs={12} sm={12}>
                                    <Button
                                        variant="contained"
                                        onClick={editSubmit}
                                        sx={buttonStyles.buttonsubmit}
                                    >
                                        {" "}
                                        Update
                                    </Button>
                                </Grid>
                                <br />
                                <Grid item md={3} xs={12} sm={12}>
                                    <Button
                                        sx={buttonStyles.btncancel}
                                        onClick={handleCloseModEdit}
                                    >
                                        {" "}
                                        Cancel{" "}
                                    </Button>
                                </Grid>
                            </Grid>
                        </>
                    </Box>
                </Dialog>
            </Box>


            {/* <LoadingBackdrop open={isLoading} /> */}

            <DeleteConfirmation
                open={isDeleteOpen}
                onClose={handleClickCloseDelete}
                onConfirm={deleteFunction}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />

            <InfoPopup
                openInfo={openInfo}
                handleCloseinfo={handleCloseinfo}
                heading="Employee Asset Return Register Info"
                addedby={infoDetails?.addedby}
                updateby={infoDetails?.updatedby}
            />


            {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
            <DeleteConfirmation
                open={isDeleteOpencheckbox}
                onClose={handleCloseModcheckbox}
                onConfirm={bulkdeleteFunction}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />
            {/* PLEASE SELECT ANY ROW */}
            <PleaseSelectRow
                open={isDeleteOpenalert}
                onClose={handleCloseModalert}
                message="Please Select any Row"
                iconColor="orange"
                buttonText="OK"
            />


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
                                Transfer Asset
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
                                                        .includes(comp.team)
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
                                    accept="image/*"
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
                                <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={editSubmitNear}>
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
        </Box>
    );
}

export default EmployeeAssetReturnRegister;