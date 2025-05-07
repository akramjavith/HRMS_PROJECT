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
import {
    DeleteConfirmation,
} from "../../components/DeleteConfirmation.js";
import {
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
const Input = styled(MuiInput)(({ theme }) => ({
    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
        display: "none !important",
    },
    "& input[type=number]": {
        MozAppearance: "textfield",
    },
}));

function RocketChatUsersList() {

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
        "Account Status",
        "Status",
        "Registration Status",
        "Employment Type",
        "Name",
        "Username",
        "Password",
        "Rocketchat Roles",
        "Rocketchat Email",
        "Company",
        "Branch",
        "Unit",
        "Team",
        "Department",
        "Designation",
        "Employee Name",
        "Employee Code",
    ];
    let exportRowValues = [
        "accountstatus",
        "rocketchatstatus",
        "registrationstatus",
        "workmode",
        "rocketchatname",
        "rocketchatusername",
        "password",
        "rocketchatroles",
        "rocketchatemail",
        "company",
        "branch",
        "unit",
        "team",
        "department",
        "designation",
        "employeename",
        "employeecode",
    ];

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteData, setDeleteData] = useState(false);
    //Delete model
    const handleClickOpenDelete = () => {
        setIsDeleteOpen(true);
    };
    const handleClickCloseDelete = () => {
        setIsDeleteOpen(false);
    };


    //Add model...
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [addDetails, setAddDetails] = useState({
        rocketchatname: "",
        rocketchatusername: "",
        password: "",
        showpassword: false,
        rocketchatemail: "",
        rocketchatroles: [],
    });
    const handleClickOpenAdd = () => {
        setIsAddOpen(true);
    };
    const handleClickCloseAdd = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsAddOpen(false);
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
    };

    const deleteFunction = async () => {
        setPageName(!pageName);
        try {
            setIsLoading(true);
            await axios.post(`${SERVICE.DELETE_ROCKETCHAT_USER}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                userid: deleteData?.id,
                employeeid: deleteData?.employeeid || null,
            });
            handleClickCloseDelete();
            setSelectedRows([]);
            setPage(1);
            setFilteredChanges(null)
            setFilteredRowData([]);
            await fetchRocketChatUsers();
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

    const handleClickOpenview = () => {
        setOpenview(true);
    };

    const handleCloseview = () => {
        setOpenview(false);
    };

    const [employees, setEmployees] = useState([]);
    const [employeesOverall, setEmployeesoverall] = useState([]);
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
            pagename: String("ConnecTTS users List"),
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
    useEffect(() => {
        fetchRockeChatRoles()
    }, [])
    const [rocketChatRolesOptions, setRocketChatRolesOptions] = useState([])
    const fetchRockeChatRoles = async () => {
        try {
            let response = await axios.get(SERVICE.GET_ROCKETCHAT_ROLES, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            setRocketChatRolesOptions(response?.data?.rocketchatRoles?.map((data) => ({
                value: data?._id,
                label: data?._id,
            })));
        } catch (err) {
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };

    const handleRocketchatRoleChange = (options) => {
        setEditDetails((prev) => ({ ...prev, rocketchatroles: options }))
    };

    const customValueRendererRocketchatRole = (valueRocketchatTeamCat, _categoryname) => {
        return valueRocketchatTeamCat?.length
            ? valueRocketchatTeamCat.map(({ label }) => label)?.join(", ")
            : "Please Select Role";
    };
    const handleRocketchatRoleChangeAdd = (options) => {
        setAddDetails((prev) => ({ ...prev, rocketchatroles: options }))
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
                    saveAs(blob, "ConnecTTSUsersList.png");
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
        accountstatus: true,
        registrationstatus: true,
        rocketchatstatus: true,
        workmode: true,
        rocketchatname: true,
        rocketchatusername: true,
        password: true,
        rocketchatroles: true,
        rocketchatemail: true,
        company: true,
        branch: true,
        unit: true,
        team: true,
        department: true,
        designation: true,
        employeename: true,
        employeecode: true,
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
        documentTitle: "ConnecTTS Users List",
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

    let cuurrentDate = moment().format("DD-MM-YYYY");
    const tomorrow = moment().add(1, "days").format("DD-MM-YYYY");
    const dayAfterTomorrow = moment().add(2, "days").format("DD-MM-YYYY");

    // Create an array of dates
    const dateArray = [cuurrentDate, tomorrow, dayAfterTomorrow];

    const columnDataTable = [
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 75,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
            pinned: "left",
        },

        {
            field: "accountstatus",
            headerName: "Account Status",
            flex: 0,
            width: 180,
            minHeight: "40px",
            cellStyle: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            },

            cellRenderer: (params) =>
                renderAccountStatus(params?.data.accountstatus),
            hide: !columnVisibility.accountstatus,
            pinned: "left",
        },
        {
            field: "rocketchatstatus",
            headerName: "Status",
            flex: 0,
            width: 180,
            minHeight: "40px",
            cellStyle: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            },

            cellRenderer: (params) =>
                renderStatusIcon(params?.data.rocketchatstatus),
            hide: !columnVisibility.rocketchatstatus,
            pinned: "left",
        },
        {
            field: "registrationstatus",
            headerName: "Registration Status",
            flex: 0,
            width: 150,
            minHeight: "40px",
            cellStyle: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            },

            cellRenderer: (params) => renderRegistrationStatus(params?.data.registrationstatus),
            hide: !columnVisibility.registrationstatus,
        },
        {
            field: "workmode",
            headerName: "Employment Type",
            flex: 0,
            width: 150,
            minHeight: "40px",
            cellStyle: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            },

            cellRenderer: (params) => renderWho(params?.data.workmode),
            hide: !columnVisibility.workmode,
        },
        {
            field: "rocketchatname",
            headerName: "Name",
            flex: 0,
            width: 200,
            hide: !columnVisibility.rocketchatname,
            headerClassName: "bold-header",
        },
        {
            field: "rocketchatusername",
            headerName: "Username",
            flex: 0,
            width: 200,
            hide: !columnVisibility.rocketchatusername,
            headerClassName: "bold-header",
        },
        {
            field: "password",
            headerName: "Password",
            flex: 0,
            width: 180,
            hide: !columnVisibility.password,
            headerClassName: "bold-header",
        },
        {
            field: "rocketchatroles",
            headerName: "Rocketchat Roles",
            flex: 0,
            width: 200,
            hide: !columnVisibility.rocketchatroles,
            headerClassName: "bold-header",
        },
        {
            field: "rocketchatemail",
            headerName: "Rocketchat Email",
            flex: 0,
            width: 150,
            hide: !columnVisibility.rocketchatemail,
            headerClassName: "bold-header",
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
            field: "department",
            headerName: "Department",
            flex: 0,
            width: 150,
            hide: !columnVisibility.department,
            headerClassName: "bold-header",
        },
        {
            field: "designation",
            headerName: "Designation",
            flex: 0,
            width: 150,
            hide: !columnVisibility.designation,
            headerClassName: "bold-header",
        },
        {
            field: "employeename",
            headerName: "Employee Name",
            flex: 0,
            width: 180,
            hide: !columnVisibility.employeename,
            headerClassName: "bold-header",
        },
        {
            field: "employeecode",
            headerName: "Employee Code",
            flex: 0,
            width: 150,
            hide: !columnVisibility.employeecode,
            headerClassName: "bold-header",
        },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 400,
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
                    {isUserRoleCompare?.includes("econnecttsuserslist") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                setEditDetails({
                                    ...params?.data,
                                    showpassword: false,
                                    password: "",
                                    rocketchatroles: params?.data?.rocketchatroles?.split(",")?.map((data) => ({
                                        label: data,
                                        value: data,
                                    }))
                                })
                                handleClickOpenEdit();
                            }}
                        >
                            <EditOutlinedIcon sx={buttonStyles.buttonedit} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("dconnecttsuserslist") && (
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
                    {isUserRoleCompare?.includes("vconnecttsuserslist") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                setViewDetails(params?.data)
                                handleClickOpenview()
                            }}
                        >
                            <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
                        </Button>
                    )}
                    {params?.data.accountstatus === "notlinked" && params?.data.registrationstatus !== "Deactivated" && (
                        <Tooltip title="Merge this Connects account details in hrms" arrow>

                            <Button
                                sx={{
                                    backgroundColor: "#FFA726", // Orange color for attention
                                    color: "#FFFFFF", // White text color
                                    "&:hover": {
                                        backgroundColor: "#FF9800", // Darker orange on hover
                                    },
                                    marginLeft: "10px", // Spacing between buttons
                                    fontSize: "0.8rem", // Smaller font size
                                    padding: "4px 8px", // Compact padding for smaller button
                                    textTransform: "none", // Avoid uppercase transformation for better readability
                                }}
                                size="small"
                                onClick={() => {
                                    handleMergeAccount(params?.data, "merge"); // Function to handle merging accounts
                                }}
                            >
                                <MergeTypeIcon sx={{ marginRight: "5px", fontSize: "1rem" }} /> {/* Merge icon */}
                                Merge Account
                            </Button>
                        </Tooltip>
                    )}
                    {params?.data.accountstatus === "linked" && params?.data.registrationstatus !== "Deactivated" && (
                        <Tooltip title="Sync this account to update its details in hrms" arrow>
                            <Button
                                sx={{
                                    backgroundColor: "#1976D2", // Blue color to indicate sync
                                    color: "#FFFFFF", // White text for visibility
                                    "&:hover": {
                                        backgroundColor: "#1565C0", // Darker blue on hover
                                    },
                                    marginLeft: "10px", // Spacing between buttons
                                    fontSize: "0.8rem", // Smaller font size
                                    padding: "4px 8px", // Compact padding for smaller button
                                    textTransform: "none", // Avoid uppercase transformation for better readability
                                }}
                                size="small"
                                onClick={() => {
                                    handleMergeAccount(params?.data, "sync"); // Function to handle syncing accounts
                                }}
                            >
                                <SyncIcon sx={{ marginRight: "5px", fontSize: "1rem" }} /> {/* Sync icon */}
                                Sync Account
                            </Button>
                        </Tooltip>
                    )}
                    {params?.data.registrationstatus === "Deactivated" && (
                        <Tooltip title="Activate this User Account in ConnecTTS" arrow>
                        <Button
                            sx={{
                                backgroundColor: "#4CAF50", // Green for activation
                                color: "#FFFFFF", // White text for visibility
                                "&:hover": {
                                    backgroundColor: "#388E3C", // Darker green on hover
                                },
                                marginLeft: "10px", // Spacing between buttons
                                fontSize: "0.8rem", // Smaller font size
                                padding: "4px 8px", // Compact padding for smaller button
                                textTransform: "none", // Avoid uppercase transformation for better readability
                            }}
                            size="small"
                            onClick={() => { 
                                deactivateRocketChatAccount(params?.data, "activate"); // Activate user account
                            }}
                        >
                            <CheckCircleIcon sx={{ marginRight: "5px", fontSize: "1rem" }} /> {/* Activation icon */}
                            Activate Account
                        </Button>
                    </Tooltip>
                    )}

                </Grid>
            ),
        },
    ];

    const rowDataTable = filteredData?.map((item, index) => {
        return {

            serialNumber: item?.serialNumber,
            id: item?.id,
            accountstatus: item?.accountstatus,
            rocketchatname: item?.rocketchatname,
            rocketchatusername: item?.rocketchatusername,
            rocketchatemail: item?.rocketchatemail,
            rocketchatstatus: item?.rocketchatstatus,
            rocketchatactive: item?.rocketchatactive,
            rocketchattype: item?.rocketchattype,
            rocketchatroles: item?.rocketchatroles,
            registrationstatus: item?.registrationstatus,

            company: item?.company,
            branch: item?.branch,
            unit: item?.unit,
            team: item?.team,
            department: item?.department,
            designation: item?.designation,
            employeecode: item?.employeecode,
            username: item?.username,
            employeename: item?.employeename,
            workmode: item?.workmode,
            employeeid: item?.employeeid,
            password: item?.password,

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

    const [btnLoading, setBtnloading] = useState("");
    const [manulUpdate, setManualUpdate] = useState("");


    function isValidEmail(email) {
        // Regular expression for a simple email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    const editSubmit = (e) => {
        e.preventDefault();

        const isNameMatch = employees?.filter((item) => item?.id !== editDetails.id)?.some(
            (item) =>
                item.rocketchatusername?.trim().toLowerCase() === editDetails.rocketchatusername?.trim().toLowerCase()
        );
        if (isNameMatch) {
            setPopupContentMalert("User Already Exist!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (editDetails.rocketchatname?.trim() === "") {
            setPopupContentMalert("Please Enter Name!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }

        else if (editDetails.rocketchatusername?.trim() === "") {
            setPopupContentMalert("Please Enter Username!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (editDetails.password !== "" && editDetails.password?.length < 6) {
            setPopupContentMalert("Password must be atleast 6 characters long!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (editDetails.rocketchatemail === "") {
            setPopupContentMalert("Please Enter Email!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (editDetails.rocketchatemail !== "" && !isValidEmail(editDetails.rocketchatemail)) {
            setPopupContentMalert("Please Enter Valid Email!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }

        else if (editDetails.rocketchatroles.length === 0) {
            setPopupContentMalert("Please Select Roles!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }

        else {
            sendEditRequest();
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();

        const isNameMatch = employees?.some(
            (item) =>
                item.rocketchatusername?.trim().toLowerCase() === addDetails.rocketchatusername?.trim().toLowerCase()
        );
        if (isNameMatch) {
            setPopupContentMalert("User Already Exist!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (addDetails.rocketchatname?.trim() === "") {
            setPopupContentMalert("Please Enter Name!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }

        else if (addDetails.rocketchatusername?.trim() === "") {
            setPopupContentMalert("Please Enter Username!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (addDetails.password === "") {
            setPopupContentMalert("Please Enter Password!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (addDetails.password !== "" && addDetails.password?.length < 6) {
            setPopupContentMalert("Password must be atleast 6 characters long!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (addDetails.rocketchatemail === "") {
            setPopupContentMalert("Please Enter Email!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (addDetails.rocketchatemail !== "" && !isValidEmail(addDetails.rocketchatemail)) {
            setPopupContentMalert("Please Enter Valid Email!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }

        else if (addDetails.rocketchatroles.length === 0) {
            setPopupContentMalert("Please Select Roles!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }

        else {
            sendRequest();

        }
    };

    const sendRequest = async () => {
        setPageName(!pageName);
        try {
            setIsLoading(true);
            let res = await axios.post(
                `${SERVICE.CREATE_ROCKETCHAT_USER}`,
                {
                    name: addDetails.rocketchatname,
                    username: addDetails.rocketchatusername,
                    password: addDetails.password,
                    email: addDetails.rocketchatemail,
                    roles: addDetails.rocketchatroles?.map(item => item.value),
                },
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );
            setFilteredChanges(null)
            setFilteredRowData([])
            await fetchRocketChatUsers();
            handleCloseModEdit();
            setPopupContent("Created Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            handleClickCloseAdd();
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
    const sendEditRequest = async () => {
        setPageName(!pageName);

        try {
            setIsLoading(true);
            let res = await axios.put(
                `${SERVICE.UPDATE_ROCKETCHAT_USER_DETAILS}`,
                {
                    id: String(editDetails.id),
                    name: editDetails.rocketchatname,
                    username: editDetails.rocketchatusername,
                    password: editDetails.password === "" ? null : editDetails.password,
                    email: editDetails.rocketchatemail,
                    employeeid: editDetails?.employeeid || null,
                    roles: editDetails.rocketchatroles?.map(item => item.value),
                },
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );
            setFilteredChanges(null)
            setFilteredRowData([])
            await fetchRocketChatUsers();
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

    const deactivateRocketChatAccount = async (rowData, nextstatus) => {
        setPageName(!pageName);
        try {
            setIsLoading(true);

            await axios.post(
                `${SERVICE.ACTIVESTATUS_ROCKETCHAT_USER}`,
                {
                    roccketchatUserId: rowData?.id,
                    activeStatus: true
                },
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );

            if (rowData?.accountstatus === "linked") {
                await handleMergeAccount(rowData, nextstatus)
            } else {
                setPopupContent(`User Activated Successfully`);
                setPopupSeverity("success");
                handleClickOpenPopup();
            }
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

    //submit option for saving

    const handleMergeAccount = async (rowData, from) => {
        let successMessage = from === "merge" ? "Merged"
            : from ===  "sync" ? "Synced"
                :  from === "activate" ? "Activated"
                    : "Synced"
        setPageName(!pageName);
        try {
            setIsLoading(true);
            let res = await axios.post(
                `${SERVICE.MERGE_ROCKETCHAT_ACCOUNT}`,
                {
                    rocketchatUserId: rowData?.id,
                    employeeid: rowData?.employeeid,
                },
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );
            setFilteredChanges(null)
            setFilteredRowData([])
            await fetchRocketChatUsers();
            handleCloseModEdit();
            setPopupContent(`User ${successMessage} Successfully`);
            setPopupSeverity("success");
            handleClickOpenPopup();
            handleClickCloseAdd();
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
        setEmployees([]);
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




    //FILTER START
    useEffect(() => {
        fetchDepartments();
    }, []);
    const [departmentOptions, setDepartmentOptions] = useState([]);
    const fetchDepartments = async () => {
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
        { label: "Company", value: "Company" },
        { label: "Branch", value: "Branch" },
        { label: "Unit", value: "Unit" },
        { label: "Team", value: "Team" },
        { label: "Department", value: "Department" },
        { label: "Designation", value: "Designation" },
    ];

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

    const accountStatusOptions = [
        { label: "Linked", value: "Linked" },
        { label: "Not Linked", value: "Not Linked" },
        { label: "Mismatched", value: "Mismatched" },
    ]
    const [selectedOptionsAccountStatus, setSelectedOptionsAccountStatus] = useState([
        { label: "Linked", value: "Linked" },
        { label: "Not Linked", value: "Not Linked" },
    ]);
    let [valueAccountStatusCat, setValueAccountStatusCat] = useState([
        "Linked",
        "Not Linked",
        // "Mismatched",
    ]);

    const handleAccountStatusChange = (options) => {
        let arrayString = options?.map((a, index) => {
            return a.value;
        })

        setValueAccountStatusCat(arrayString);
        setSelectedOptionsAccountStatus(options);
        if (arrayString?.includes("Mismatched")) {
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
            setFilterState((prev) => ({
                ...prev,
                type: "Mismatched",
            }));
            setSelectedOptionsEmployementType(employemnetTypeOptions);
            setValueEmployementTypeCat(["Employee", "Internship"]);
        } else {
            setFilterState((prev) => ({
                ...prev,
                type: "Individual",
            }));
        }
    };

    const customValueRendererAccountStatus = (valueAccountStatusCat, _categoryname) => {
        return valueAccountStatusCat?.length
            ? valueAccountStatusCat?.map(({ label }) => label)?.join(", ")
            : "Please Select Account Status";
    };
    // Status   multiselect

    const statusOptions = [
        { label: "Online", value: "Online" },
        { label: "Offline", value: "Offline" },
        { label: "Away", value: "Away" },
        { label: "Busy", value: "Busy" },
    ]

    const [selectedOptionsStatus, setSelectedOptionsStatus] = useState(statusOptions);
    let [valueStatusCat, setValueStatusCat] = useState([
        "Online",
        "Offline",
        "Away",
        "Busy",
    ]);

    const handleStatusChange = (options) => {
        setValueStatusCat(
            options?.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsStatus(options);
    };

    const customValueRendererStatus = (valueStatusCat, _categoryname) => {
        return valueStatusCat?.length
            ? valueStatusCat?.map(({ label }) => label)?.join(", ")
            : "Please Select Status";
    };
    //Registration Status   multiselect

    const RegistrationStatusOptions = [
        { label: "Active", value: "Active" },
        { label: "Pending", value: "Pending" },
        { label: "Deactivated", value: "Deactivated" },
    ]

    const [selectedOptionsRegistrationStatus, setSelectedOptionsRegistrationStatus] = useState(RegistrationStatusOptions);
    let [valueRegistrationStatusCat, setValueRegistrationStatusCat] = useState([
        "Active",
        "Pending",
        "Deactivated",
    ]);

    const handleRegistrationStatusChange = (options) => {
        setValueRegistrationStatusCat(
            options?.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsRegistrationStatus(options);
    };

    const customValueRendererRegistrationStatus = (valueRegistrationStatusCat, _categoryname) => {
        return valueRegistrationStatusCat?.length
            ? valueRegistrationStatusCat?.map(({ label }) => label)?.join(", ")
            : "Please Select Registration Status";
    };
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
        setValueAccountStatusCat([]);
        setSelectedOptionsAccountStatus([]);
        setValueRegistrationStatusCat([]);
        setSelectedOptionsRegistrationStatus([]);
        setValueStatusCat([]);
        setSelectedOptionsStatus([]);
        setEmployeeOptions([]);
        setEmployees([]);
        setIsManualUser([]);

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
            selectedOptionsEmployementType?.length === 0
        ) {
            setPopupContentMalert("Please Select Employement Type!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (
            filterState?.type === "Please Select Type" ||
            filterState?.type === ""
        ) {
            setPopupContentMalert("Please Select Type!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (selectedOptionsCompany?.length === 0 && !valueAccountStatusCat?.includes("Mismatched")) {
            setPopupContentMalert("Please Select Company!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        // else if (
        //   filterState?.employeestatus === "Please Select Employee Status" ||
        //   filterState?.employeestatus === ""
        // ) {
        //   setPopupContentMalert("Please Select Employee Status!");
        //   setPopupSeverityMalert("info");
        //   handleClickOpenPopupMalert();
        // }
        else if (
            ["Individual", "Branch", "Unit", "Team", "Department", "Designation"]?.includes(filterState?.type) &&
            selectedOptionsBranch?.length === 0
        ) {
            setPopupContentMalert("Please Select Branch!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            ["Individual", "Unit", "Team", "Departmet", "Designation"]?.includes(filterState?.type) &&
            selectedOptionsUnit?.length === 0
        ) {
            setPopupContentMalert("Please Select Unit!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            ["Individual", "Team"]?.includes(filterState?.type) &&
            selectedOptionsTeam?.length === 0
        ) {
            setPopupContentMalert("Please Select Team!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            filterState?.type === "Individual" &&
            selectedOptionsEmployee?.length === 0
        ) {
            setPopupContentMalert("Please Select Employee!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            filterState?.type === "Department" &&
            selectedOptionsDepartment?.length === 0
        ) {
            setPopupContentMalert("Please Select Department!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            filterState?.type === "Designation" &&
            selectedOptionsDesignation?.length === 0
        ) {
            setPopupContentMalert("Please Select Designation!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else {
            fetchRocketChatUsers();
        }
    };

    // useEffect(() => {
    //     fetchRocketChatUsers();
    // }, [])

    const fetchRocketChatUsers = async () => {
        setPageName(!pageName);
        setLoader(true);
        setisBtnFilter(true);
        setFilterLoader(true);
        setTableLoader(true);
        try {
            let response = await axios.post(
                SERVICE.ROCKETCHAT_COMBINED_USERS,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    type: filterState?.type,
                    company:
                        valueCompanyCat?.length > 0 ? valueCompanyCat : allAssignCompany,
                    branch: valueBranchCat?.length > 0 ? valueBranchCat : allAssignBranch,
                    unit: valueUnitCat?.length > 0 ? valueUnitCat : allAssignUnit,
                    team: valueTeamCat || [],
                    department: valueDepartmentCat || [],
                    designation: valueDesignationCat || [],
                    employee: valueEmployeeCat || [],
                    employementtype: valueEmployementTypeCat || [],
                    accountstatus: valueAccountStatusCat || [],
                    status: valueStatusCat || [],
                    registrationstatus: valueRegistrationStatusCat || [],
                }
            );
            // let answer = subprojectscreate?.data?.filterallDatauser?.filter((item) =>
            //     accessbranch.some(
            //         (branch) =>
            //             branch.company === item.company &&
            //             branch.branch === item.branch &&
            //             branch.unit === item.unit
            //     )
            // );





            const itemsWithSerialNumber = response?.data?.mergedusers.map((item, index) => ({

                serialNumber: index + 1,
                id: item._id,
                accountstatus: item?.accountstatus,
                rocketchatname: item?.rocketchat?.name,
                rocketchatusername: item?.rocketchat?.username,
                rocketchatemail: item?.rocketchat?.email,
                rocketchatroles: item?.rocketchat?.roles?.join(","),
                rocketchatstatus: item?.rocketchat?.status,
                rocketchatactive: item?.rocketchat?.active,
                rocketchattype: item?.rocketchat?.type,
                registrationstatus: item?.rocketchat?.registrationstatus,

                company: item?.local?.company,
                branch: item?.local?.branch,
                unit: item?.local?.unit,
                team: item?.local?.team,
                department: item?.local?.department,
                designation: item?.local?.designation,
                employeecode: item?.local?.employeecode,
                username: item?.local?.username,
                employeename: item?.local?.employeename,
                workmode: item?.local?.workmode,
                employeeid: item?.local?.employeeid,
                password: item?.local?.password,

            }));


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

    useEffect(() => {
        handleAutoSelect();
    }, [isAssignBranch]);

    //FILTER END

    return (
        <Box>
            <NotificationContainer />
            <Headtitle title={"CONNECTTS USERS LIST"} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="ConnecTTS Users List"
                modulename="connecTTS"
                submodulename="ConnecTTS Users List"
                mainpagename=""
                subpagename=""
                subsubpagename=""
            />
            {isUserRoleCompare?.includes("aconnecttsuserslist") && (
                <>
                    <Box sx={userStyle.dialogbox}>
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography sx={userStyle.importheadtext}>
                                        Filter ConnecTTS Users List
                                    </Typography>
                                </Grid>

                                <Grid item xs={12}>
                                    <Grid container spacing={2}>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <Typography>
                                                Account Status
                                            </Typography>
                                            <FormControl size="small" fullWidth>
                                                <MultiSelect
                                                    options={accountStatusOptions}
                                                    value={selectedOptionsAccountStatus}
                                                    onChange={(e) => {
                                                        handleAccountStatusChange(e);
                                                    }}
                                                    valueRenderer={customValueRendererAccountStatus}
                                                    labelledBy="Please Select Account Status"
                                                />
                                            </FormControl>
                                        </Grid>
                                        {!valueAccountStatusCat?.includes("Mismatched") &&
                                            <Grid item md={3} xs={12} sm={12}>
                                                <Typography>
                                                    Employement Type<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <FormControl size="small" fullWidth>
                                                    <MultiSelect
                                                        options={employemnetTypeOptions}
                                                        value={selectedOptionsEmployementType}
                                                        onChange={(e) => {
                                                            handleEmployementTypeChange(e);
                                                        }}
                                                        valueRenderer={customValueRendererEmployementType}
                                                        labelledBy="Please Select Employement Type"
                                                    />
                                                </FormControl>
                                            </Grid>}

                                        <Grid item md={3} xs={12} sm={12}>
                                            <Typography>
                                                Status
                                            </Typography>
                                            <FormControl size="small" fullWidth>
                                                <MultiSelect
                                                    options={statusOptions}
                                                    value={selectedOptionsStatus}
                                                    onChange={(e) => {
                                                        handleStatusChange(e);
                                                    }}
                                                    valueRenderer={customValueRendererStatus}
                                                    labelledBy="Please Select Status"
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <Typography>
                                                Registration Status
                                            </Typography>
                                            <FormControl size="small" fullWidth>
                                                <MultiSelect
                                                    options={RegistrationStatusOptions}
                                                    value={selectedOptionsRegistrationStatus}
                                                    onChange={(e) => {
                                                        handleRegistrationStatusChange(e);
                                                    }}
                                                    valueRenderer={customValueRendererRegistrationStatus}
                                                    labelledBy="Please Select Registration Status"
                                                />
                                            </FormControl>
                                        </Grid>

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
                                                        setValueDesignationCat([]);
                                                        setSelectedOptionsDesignation([]);
                                                        setValueEmployeeCat([]);
                                                        setSelectedOptionsEmployee([]);
                                                    }}
                                                    isDisabled={valueAccountStatusCat?.includes("Mismatched")}
                                                />
                                            </FormControl>
                                        </Grid>
                                        {!valueAccountStatusCat?.includes("Mismatched") &&
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
                                                            }}
                                                            valueRenderer={customValueRendererCompany}
                                                            labelledBy="Please Select Company"
                                                        />
                                                    </FormControl>
                                                </Grid>



                                                {["Individual", "Team"]?.includes(filterState.type) ? (
                                                    <>
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
                                                ) : ["Designation"]?.includes(filterState.type) ? (
                                                    <>
                                                        {/* Designation */}
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
                                                                    Designation<b style={{ color: "red" }}>*</b>
                                                                </Typography>
                                                                <MultiSelect
                                                                    options={alldesignation?.map(data => ({
                                                                        label: data.name,
                                                                        value: data.name,
                                                                    })).filter((item, index, self) => {
                                                                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                                    })}
                                                                    value={selectedOptionsDesignation}
                                                                    onChange={(e) => {
                                                                        handleDesignationChange(e);
                                                                    }}
                                                                    valueRenderer={customValueRendererDesignation}
                                                                    labelledBy="Please Select Designation"
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
                                                                    ?.filter((u) => {
                                                                        // Check if valueEmployementTypeCat contains only "Internship"
                                                                        if (valueEmployementTypeCat?.length === 1 && valueEmployementTypeCat.includes("Internship")) {
                                                                            return (
                                                                                u.workmode === "Internship" &&
                                                                                valueCompanyCat?.includes(u.company) &&
                                                                                valueBranchCat?.includes(u.branch) &&
                                                                                valueUnitCat?.includes(u.unit) &&
                                                                                valueTeamCat?.includes(u.team)
                                                                            );
                                                                        }
                                                                        // Check if valueEmployementTypeCat contains only "Employee"
                                                                        if (valueEmployementTypeCat?.length === 1 && valueEmployementTypeCat.includes("Employee")) {
                                                                            return (
                                                                                u.workmode !== "Internship" &&
                                                                                valueCompanyCat?.includes(u.company) &&
                                                                                valueBranchCat?.includes(u.branch) &&
                                                                                valueUnitCat?.includes(u.unit) &&
                                                                                valueTeamCat?.includes(u.team)
                                                                            );
                                                                        }
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
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                )}
                                            </>}
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
                    {isUserRoleCompare?.includes("lconnecttsuserslist") && (
                        <>
                            <Box sx={userStyle.container}>
                                {/* ******************************************************EXPORT Buttons****************************************************** */}
                                <Grid container spacing={2}>
                                    <Grid item xs={10}>
                                        <Typography sx={userStyle.SubHeaderText}>
                                            ConnecTTS Users List
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={2}>
                                        {isUserRoleCompare?.includes("aconnecttsuserslist") && (
                                            <>
                                                {/* <Link
                                                    to="/interview/myinterviewchecklist"
                                                    style={{
                                                        textDecoration: "none",
                                                        color: "white",
                                                        float: "right",
                                                    }}
                                                    target="_blank"
                                                > */}
                                                <Button variant="contained" onClick={() => {
                                                    setAddDetails({
                                                        rocketchatname: "",
                                                        rocketchatusername: "",
                                                        password: "",
                                                        showpassword: false,
                                                        rocketchatemail: "",
                                                        rocketchatroles: [],
                                                    });
                                                    handleClickOpenAdd()
                                                }}>ADD USER</Button>
                                                {/* </Link> */}
                                            </>
                                        )}
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
                                                "excelconnecttsuserslist"
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
                                                "csvconnecttsuserslist"
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
                                                "printconnecttsuserslist"
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
                                                "pdfconnecttsuserslist"
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
                                                "imageconnecttsuserslist"
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
                                &ensp;
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
                filename={"ConnecTTSUsersList"}
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
                            View ConnecTTS User Details
                        </Typography>
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Account Status</Typography>
                                    <Typography>{viewDetails.accountstatus}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Status</Typography>
                                    <Typography>{viewDetails.rocketchatstatus}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Employment Type</Typography>
                                    <Typography>{viewDetails.workmode}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Name</Typography>
                                    <Typography>{viewDetails.rocketchatname}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Username</Typography>
                                    <Typography>{viewDetails.rocketchatusername}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Password</Typography>
                                    <Typography>{viewDetails.password}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Company</Typography>
                                    <Typography>{viewDetails.company}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Branch</Typography>
                                    <Typography>{viewDetails.branch}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Unit</Typography>
                                    <Typography>{viewDetails.unit}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Team</Typography>
                                    <Typography>{viewDetails.team}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Department</Typography>
                                    <Typography>{viewDetails.department}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Designation</Typography>
                                    <Typography>{viewDetails.designation}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Employee Name</Typography>
                                    <Typography>{viewDetails.employeename}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Employee Code</Typography>
                                    <Typography>{viewDetails.employeecode}</Typography>
                                </FormControl>
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
                    maxWidth="md"
                    fullWidth={true}
                    sx={{
                        overflow: "visible",
                        "& .MuiPaper-root": {
                            overflow: "visible",
                        },
                    }}
                >
                    <Box sx={{ padding: "20px 50px" }}>
                        <>
                            <Grid container spacing={2}>
                                <Typography sx={userStyle.HeaderText}>
                                    Edit ConnecTTS User Details
                                </Typography>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Name<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={editDetails.rocketchatname}
                                            onChange={(e) => {
                                                setEditDetails((prev) => ({
                                                    ...prev,
                                                    rocketchatname: e.target.value,
                                                }));
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Username<b style={{ color: "red" }}>*</b>
                                        </Typography>

                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={editDetails.rocketchatusername}
                                            onChange={(e) => {
                                                setEditDetails((prev) => ({
                                                    ...prev,
                                                    rocketchatusername: e.target.value?.toLowerCase(),
                                                }));
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Password
                                        </Typography>
                                        <OutlinedInput
                                            placeholder="Please Enter Password"
                                            id="outlined-adornment-password"
                                            type={editDetails?.showpassword ? "text" : "password"}
                                            value={editDetails.password}
                                            onChange={(e) => {
                                                setEditDetails((prev) => ({
                                                    ...prev,
                                                    password: e.target.value,
                                                }));
                                            }}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onMouseDown={(event) => {
                                                            event.preventDefault();
                                                        }}
                                                        onClick={(e) => {
                                                            setEditDetails((prev) => ({
                                                                ...prev,
                                                                showpassword: !editDetails?.showpassword,
                                                            }));
                                                        }}
                                                        edge="end"
                                                    >
                                                        {!editDetails.showpassword ? (
                                                            <VisibilityOff sx={{ fontSize: "25px" }} />
                                                        ) : (
                                                            <Visibility sx={{ fontSize: "25px" }} />
                                                        )}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                        />
                                        <FormHelperText sx={{ color: "#6c757d" }}>
                                            Fill this field only if you want to change the password.
                                        </FormHelperText>
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Email<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined-email"
                                            type="email" // Change type to "email"
                                            placeholder="Please Enter Email" // Optional placeholder
                                            value={editDetails.rocketchatemail} // Change field name to match email
                                            onChange={(e) => {
                                                setEditDetails((prev) => ({
                                                    ...prev,
                                                    rocketchatemail: e.target.value, // Update corresponding state field
                                                }));
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Role<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect
                                            options={rocketChatRolesOptions}
                                            value={editDetails?.rocketchatroles}
                                            onChange={(e) => {
                                                handleRocketchatRoleChange(e);
                                            }}
                                            valueRenderer={customValueRendererRocketchatRole}
                                            labelledBy="Please Select Role"
                                        />
                                    </FormControl>
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
            {/* Add DIALOG */}
            <Box>
                <Dialog
                    open={isAddOpen}
                    onClose={handleClickCloseAdd}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="md"
                    fullWidth={true}
                    sx={{
                        overflow: "visible",
                        "& .MuiPaper-root": {
                            overflow: "visible",
                        },
                    }}
                >
                    <Box sx={{ padding: "20px 50px" }}>
                        <>
                            <Grid container spacing={2}>
                                <Typography sx={userStyle.HeaderText}>
                                    Create New ConnecTTS User
                                </Typography>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Name<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            placeholder="Please Enter Name"
                                            value={addDetails.rocketchatname}
                                            onChange={(e) => {
                                                setAddDetails((prev) => ({
                                                    ...prev,
                                                    rocketchatname: e.target.value,
                                                }));
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Username<b style={{ color: "red" }}>*</b>
                                        </Typography>

                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            placeholder="Please Enter Username"
                                            value={addDetails.rocketchatusername}
                                            onChange={(e) => {
                                                setAddDetails((prev) => ({
                                                    ...prev,
                                                    rocketchatusername: e.target.value?.toLowerCase(),
                                                }));
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Password<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            placeholder="Please Enter Password"
                                            id="outlined-adornment-password"
                                            type={addDetails?.showpassword ? "text" : "password"}
                                            value={addDetails.password}
                                            onChange={(e) => {
                                                setAddDetails((prev) => ({
                                                    ...prev,
                                                    password: e.target.value,
                                                }));
                                            }}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onMouseDown={(event) => {
                                                            event.preventDefault();
                                                        }}
                                                        onClick={(e) => {
                                                            setAddDetails((prev) => ({
                                                                ...prev,
                                                                showpassword: !addDetails?.showpassword,
                                                            }));
                                                        }}
                                                        edge="end"
                                                    >
                                                        {!addDetails.showpassword ? (
                                                            <VisibilityOff sx={{ fontSize: "25px" }} />
                                                        ) : (
                                                            <Visibility sx={{ fontSize: "25px" }} />
                                                        )}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Email<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined-email"
                                            type="email" // Change type to "email"
                                            placeholder="Please Enter Email" // Optional placeholder
                                            value={addDetails.rocketchatemail} // Change field name to match email
                                            onChange={(e) => {
                                                setAddDetails((prev) => ({
                                                    ...prev,
                                                    rocketchatemail: e.target.value, // Update corresponding state field
                                                }));
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Role<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect
                                            options={rocketChatRolesOptions}
                                            value={addDetails?.rocketchatroles}
                                            onChange={(e) => {
                                                handleRocketchatRoleChangeAdd(e);
                                            }}
                                            valueRenderer={customValueRendererRocketchatRoleAdd}
                                            labelledBy="Please Select Role"
                                        />
                                    </FormControl>
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
                                        onClick={handleSubmit}
                                        sx={buttonStyles.buttonsubmit}
                                    >
                                        Create
                                    </Button>
                                </Grid>
                                <br />
                                <Grid item md={3} xs={12} sm={12}>
                                    <Button
                                        sx={buttonStyles.btncancel}
                                        onClick={handleClickCloseAdd}
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

            <LoadingBackdrop open={isLoading} />

            <DeleteConfirmation
                open={isDeleteOpen}
                onClose={handleClickCloseDelete}
                onConfirm={deleteFunction}
                title="Are you sure? Do You Want to Delete this User from Rocket Chat?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />
        </Box>
    );
}

export default RocketChatUsersList;