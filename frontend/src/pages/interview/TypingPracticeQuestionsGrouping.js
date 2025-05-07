import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import Selects from "react-select";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ErrorIcon from "@mui/icons-material/Error";
import MenuIcon from "@mui/icons-material/Menu";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import ImageIcon from "@mui/icons-material/Image";
import InfoIcon from "@mui/icons-material/Info";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SchoolIcon from "@mui/icons-material/School";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import WarningIcon from "@mui/icons-material/Warning";
import WorkIcon from "@mui/icons-material/Work";
import LoadingButton from "@mui/lab/LoadingButton";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { MultiSelect } from "react-multi-select-component";
import {
    statusOption,
    statusOptiontyping,
    validationOptions,
} from "../../components/Componentkeyword";
import {
    OutlinedInput,
    Backdrop,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    FormControl,
    TextareaAutosize,
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
    Typography
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Switch from "@mui/material/Switch";
import axios from "axios";
import domtoimage from 'dom-to-image';
import { saveAs } from "file-saver";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import {
    NotificationContainer,
    NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import AggregatedSearchBar from "../../components/AggregatedSearchBar";
import AggridTable from "../../components/AggridTable";
import AlertDialog from "../../components/Alert";
import {
    DeleteConfirmation, PleaseSelectRow,
} from "../../components/DeleteConfirmation.js";
import { handleApiError } from "../../components/Errorhandling";
import ExportData from "../../components/ExportData";
import Headtitle from "../../components/Headtitle";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";
import {
    AuthContext,
    UserRoleAccessContext,
} from "../../context/Appcontext";
import { userStyle, colourStyles } from "../../pageStyle.js";
import { SERVICE } from "../../services/Baseservice";





function TypingPracticeQuestionsGrouping() {

    const [isLoading, setIsLoading] = useState(false);

    const [practiceQuestions, setPracticeQuestions] = useState([])
    const getPracticeQuestions = async () => {
        setPageName(!pageName);
        try {
            let response = await axios.get(`${SERVICE.ALL_TYPING_PRACTICE_QUESTIONS}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let questions = response.data.allPracticeQuestions

            return questions?.length > 0 ? questions : [];
        } catch (err) {
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };



    const TypeOptions = [
        { label: "Individual", value: "Individual" },
        { label: "Company", value: "Company" },
        { label: "Branch", value: "Branch" },
        { label: "Unit", value: "Unit" },
        { label: "Team", value: "Team" },
        { label: "Department", value: "Department" },
        { label: "Designation", value: "Designation" },
    ];

    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
    const gridRefTableImg = useRef(null);

    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
    const handleClickOpenPopupMalert = () => {
        setOpenPopupMalert(true);
        setIsLoading(false);
        setUpdateLoader(false);
        setTableLoader(false);
        setFilterLoader(false);
    };
    const handleClosePopupMalert = () => {
        setOpenPopupMalert(false);
        setIsLoading(false);
        setUpdateLoader(false);
        setTableLoader(false);
        setFilterLoader(false);
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
        "Type",
        "Company",
        "Branch",
        "Unit",
        "Team",
        "Department",
        "Designation",
        "Employeename",
        "Category",
        "Sub Category",
        "Questions",
    ];
    let exportRowValues = [
        "type",
        "company",
        "branch",
        "unit",
        "team",
        "department",
        "designation",
        "employeename",
        "category",
        "subcategory",
        "questions",
    ];

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteData, setDeleteData] = useState({});
    const [deleteMessage, setDeleteMessage] = useState("Are You Sure?");
    const [bulkDeleteMessage, setBulkDeleteMessage] = useState("Are You Sure?");

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
    };

    const deleteFunction = async () => {
        setPageName(!pageName);
        try {
            setIsLoading(true);
            // let overallcheck = await axios.post(
            //     `${SERVICE.INTERVIEWVERIFICATION_OVERALLDELETE}`,
            //     {
            //         headers: {
            //             Authorization: `Bearer ${auth.APIToken}`,
            //         },
            //         category: deleteData?.category,
            //         subcategory: deleteData?.subcategory,
            //         question: deleteData?.question,
            //         mode: "Typing Test",
            //     }
            // );
            // if (overallcheck?.data?.mayidelete) {
            await axios.delete(`${SERVICE.SINGLE_TYPING_PRACTICE_QUESTIONS_GROUPING}/${deleteData?.id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setSelectedRows([]);
            setPage(1);
            setFilteredChanges(null)
            setFilteredRowData([]);

            await fetchReturnData();
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            // }
            handleClickCloseDelete();
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


    const overallBulkdelete = async (ids) => {
        setPageName(!pageName);
        try {
            let overallcheck = await axios.post(
                `${SERVICE.INTERVIEWVERIFICATION_OVERALLBULKDELETE}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    id: ids,
                }
            );

            setSelectedRows(overallcheck?.data?.result);
            setIsDeleteOpencheckbox(true);
        } catch (err) {
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
            let check = employees?.filter(data => selectedRows?.includes(data?.id))?.some(item => item?.responseexist)

            setBulkDeleteMessage(check ? "Are you sure? If you delete this grouping, the user may not be able to see their previous response." : "Are you Sure?")
            handleClickOpencheckbox();

            // overallBulkdelete(selectedRows);
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


            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.SINGLE_TYPING_PRACTICE_QUESTIONS_GROUPING}/${item}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });
            });
            await Promise.all(deletePromises);


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

            handleClickOpenview();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    const getCode = async (e) => {
        try {

            let res = await axios.get(`${SERVICE.SINGLE_TYPING_PRACTICE_QUESTIONS_GROUPING}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let response = res?.data?.singlePracticeQuestionsGrouping

            setEditDetails({
                _id: response?._id,
                type: response?.type,
                category: response?.category?.join(","),
                subcategory: response?.subcategory?.join(","),
                updatedby: response?.updatedby?.length > 0 ? response?.updatedby : [],

            });
            setValueCompanyEditCat(response?.company);
            setSelectedOptionsCompanyEdit(response?.company.map((t) => ({
                label: t,
                value: t,
            })));
            setValueBranchEditCat(response?.branch);
            setSelectedOptionsBranchEdit(response?.branch.map((t) => ({
                label: t,
                value: t,
            })));
            setValueUnitEditCat(response?.unit);
            setSelectedOptionsUnitEdit(response?.unit.map((t) => ({
                label: t,
                value: t,
            })));
            setValueTeamEditCat(response?.team);
            setSelectedOptionsTeamEdit(response?.team.map((t) => ({
                label: t,
                value: t,
            })));
            setValueDepartmentEditCat(response?.department);
            setSelectedOptionsDepartmentEdit(response?.department.map((t) => ({
                label: t,
                value: t,
            })));
            setValueDesignationEditCat(response?.designation);
            setSelectedOptionsDesignationEdit(response?.designation.map((t) => ({
                label: t,
                value: t,
            })));
            setValueEmployeeEditCat(response?.employeename);
            setSelectedOptionsEmployeeEdit(response?.employeename.map((t) => ({
                label: t,
                value: t,
            })));

            setValueQuestionsEditCat(response?.questionsid);
            let matechedQuestion = practiceQuestions?.filter(data => response?.questionsid?.includes(data?._id))?.map(quest => ({
                label: quest?.question,
                value: quest?.question,
            }))
            setSelectedOptionsQuestionsEdit(matechedQuestion);
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
            pagename: String("Practice Questions Grouping"),
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
                    saveAs(blob, "PracticeQuestionsGrouping.png");
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
        type: true,
        company: true,
        branch: true,
        unit: true,
        team: true,
        department: true,
        designation: true,
        employeename: true,
        category: true,
        subcategory: true,
        questions: true,

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
        documentTitle: "Practice Questions Grouping",
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
            field: "type",
            headerName: "Type",
            flex: 0,
            width: 120,
            hide: !columnVisibility.type,
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
            headerName: "Employee",
            flex: 0,
            width: 250,
            hide: !columnVisibility.employeename,
            headerClassName: "bold-header",
            renderCell: (params) => (
                <Grid
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between", // Ensures proper spacing between name and buttons
                        width: "100%", // Ensures the container takes up the full cell width
                    }}
                >
                    {/* Display Employee Name */}
                    <Typography
                        variant="body2"
                        sx={{
                            flexGrow: 1, // Allows the name to take remaining space
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            marginRight: 1,
                        }}
                        title={params.row.employeename} // Show full name on hover
                    >
                        {params.row.employeename || ""}
                    </Typography>
                </Grid>
            ),
        },


        {
            field: "category",
            headerName: "Category",
            flex: 0,
            width: 120,
            hide: !columnVisibility.category,
            headerClassName: "bold-header",
        },
        {
            field: "subcategory",
            headerName: "Sub Category",
            flex: 0,
            width: 150,
            hide: !columnVisibility.subcategory,
            headerClassName: "bold-header",
        },
        {
            field: "questions",
            headerName: "Questions",
            flex: 0,
            width: 200,
            hide: !columnVisibility.questions,
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
                    {isUserRoleCompare?.includes("epracticequestionsgrouping") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getCode(params?.data?.id)
                            }}
                        >
                            <EditOutlinedIcon sx={buttonStyles.buttonedit} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("dpracticequestionsgrouping") && (
                        <Button
                            sx={userStyle.buttondelete}
                            onClick={(e) => {
                                //   rowData(params.data.id, params.data.name);
                                setDeleteMessage(params?.data?.responseexist ? "Are you sure? If you delete this grouping, the user may not be able to see their previous response." : "Are you Sure?")
                                handleClickOpenDelete();
                                setDeleteData(params.data);
                            }}
                        >
                            <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("vpracticequestionsgrouping") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {

                                setViewDetails(params?.data);
                                handleClickOpenview();
                            }}
                        >
                            <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("ipracticequestionsgrouping") && (
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

                    &nbsp;
                    &nbsp;
                    {isUserRoleCompare?.includes("vpracticesession") && params?.data?.responseexist && (
                        <Button
                            variant="contained"
                            sx={{
                                minWidth: "15px",
                                padding: "6px 5px",
                            }}
                            onClick={() => {
                                window.open(`/grouptypingresponse/${params?.data?.id}`);
                            }}
                        >
                            <MenuIcon style={{ fontsize: "small" }} />
                        </Button>
                    )}
                </Grid>
            ),
        },
    ];

    const rowDataTable = filteredData?.map((item, index) => {
        return {

            serialNumber: item?.serialNumber,
            id: item?.id,
            type: item?.type,
            company: item?.company,
            branch: item?.branch,
            unit: item?.unit,
            team: item?.team,
            department: item?.department,
            designation: item?.designation,
            employeename: item?.employeename,
            category: item?.category,
            subcategory: item?.subcategory,
            questions: item?.questions,

            addedby: item?.addedby,
            updatedby: item?.updatedby,

            companyArray: item?.companyArray,
            branchArray: item?.branchArray,
            unitArray: item?.unitArray,
            teamArray: item?.teamArray,
            departmentArray: item?.departmentArray,
            designationArray: item?.designationArray,
            employeenameArray: item?.employeenameArray,
            categoryArray: item?.categoryArray,
            subcategoryArray: item?.subcategoryArray,
            questionsArray: item?.questionsArray,
            questionsWithAns: item?.questionsWithAns,
            responseexist: item?.responseexist,
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

    //overall edit popup
    const [openOverAllEditPopup, setOpenOverAllEditPopup] = useState(false);
    const handleOpenOverallEditPopup = () => {
        setOpenOverAllEditPopup(true);
    };
    const handleCloseOverallEditPopup = () => {
        setOpenOverAllEditPopup(false);
    };
    const [updateLoader, setUpdateLoader] = useState(false);
    const editSubmit = (e) => {
        setUpdateLoader(true);
        e.preventDefault();



        const commonConditions = (entry) =>
            entry.companyArray.some(company => valueCompanyEditCat.includes(company)) &&
            entry.categoryArray?.includes(editDetails.category) &&
            entry.subcategoryArray?.includes(editDetails.subcategory) &&
            entry.questionsid.some(qid => valueQuestionsEditCat.includes(qid))
        // Define specific conditions for each type
        const typeSpecificConditions = {
            Company: (entry) => true, // No additional checks for Company
            Branch: (entry) => entry.branchArray.some(branch => valueBranchEditCat.includes(branch)),
            Unit: (entry) =>
                entry.branchArray.some(branch => valueBranchEditCat.includes(branch)) &&
                entry.unitArray.some(unit => valueUnitEditCat.includes(unit)),
            Team: (entry) =>
                entry.branchArray.some(branch => valueBranchEditCat.includes(branch)) &&
                entry.unitArray.some(unit => valueUnitEditCat.includes(unit)) &&
                entry.teamArray.some(team => valueTeamEditCat.includes(team)),
            Individual: (entry) =>
                entry.branchArray.some(branch => valueBranchEditCat.includes(branch)) &&
                entry.unitArray.some(unit => valueUnitEditCat.includes(unit)) &&
                entry.teamArray.some(team => valueTeamEditCat.includes(team)) &&
                entry.employeenameArray.some(empname => valueEmployeeEditCat.includes(empname)),

            Department: (entry) =>
                entry.branchArray.some(branch => valueBranchEditCat.includes(branch)) &&
                entry.unitArray.some(unit => valueUnitEditCat.includes(unit)) &&
                entry.departmentArray.some(dept => valueDepartmentEditCat.includes(dept)),
            Designation: (entry) =>
                entry.branchArray.some(branch => valueBranchEditCat.includes(branch)) &&
                entry.unitArray.some(unit => valueUnitEditCat.includes(unit)) &&
                entry.designationArray.some(des => valueDesignationEditCat.includes(des)),


        };

        // Check for duplicates
        const isDuplicate = employees?.filter(data => data?._id !== editDetails?._id)?.some((entry) => {
            // Ensure the entry type matches filterState type
            if (entry?.type !== editDetails.type) return false;

            // Apply common and type-specific conditions
            return (
                commonConditions(entry) &&
                typeSpecificConditions[editDetails.type]?.(entry) // Call the appropriate function for type-specific checks
            );
        });
        if (
            isDuplicate
        ) {
            setPopupContentMalert("Data Already Exist!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else
            if (
                editDetails?.type === "Please Select Type" ||
                editDetails?.type === "" || !editDetails?.type
            ) {
                setPopupContentMalert("Please Select Type!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }

            else if (selectedOptionsCompanyEdit?.length === 0) {
                setPopupContentMalert("Please Select Company!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (
                ["Individual", "Branch", "Unit", "Team", "Department", "Designation"]?.includes(editDetails?.type) &&
                selectedOptionsBranchEdit?.length === 0
            ) {
                setPopupContentMalert("Please Select Branch!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } else if (
                ["Individual", "Unit", "Team", "Departmet", "Designation"]?.includes(editDetails?.type) &&
                selectedOptionsUnitEdit?.length === 0
            ) {
                setPopupContentMalert("Please Select Unit!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } else if (
                ["Individual", "Team",]?.includes(editDetails?.type) &&
                selectedOptionsTeamEdit?.length === 0
            ) {
                setPopupContentMalert("Please Select Team!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } else if (
                ["Individual"]?.includes(editDetails?.type) &&
                selectedOptionsEmployeeEdit?.length === 0
            ) {
                setPopupContentMalert("Please Select Employee!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }


            else if (
                editDetails?.type === "Department" &&
                selectedOptionsDepartmentEdit?.length === 0
            ) {
                setPopupContentMalert("Please Select Department!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (
                editDetails?.type === "Designation" &&
                selectedOptionsDesignationEdit?.length === 0
            ) {
                setPopupContentMalert("Please Select Designation!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (
                !editDetails?.category
            ) {
                setPopupContentMalert("Please Select Category!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (
                !editDetails?.subcategory
            ) {
                setPopupContentMalert("Please Select Sub Category!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (
                selectedOptionsQuestionsEdit?.length === 0
            ) {
                setPopupContentMalert("Please Select Questions!");
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


            let res = await axios.post(
                `${SERVICE.CREATE_TYPING_PRACTICE_QUESTIONS_GROUPING}`,
                {
                    category: [filterState?.category],
                    subcategory: [filterState?.subcategory],
                    type: filterState?.type,
                    company: valueCompanyCat,
                    branch: valueBranchCat,
                    unit: valueUnitCat,
                    team: valueTeamCat,
                    department: valueDepartmentCat,
                    designation: valueDesignationCat,
                    employeename: valueEmployeeCat,
                    questionsid: valueQuestionsCat,
                    addedby: [
                        {
                            name: String(isUserRoleAccess?.companyname),
                            date: String(new Date()),
                        },
                    ],
                },
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );
            setFilteredChanges(null)
            setFilteredRowData([])

            await fetchReturnData();
            handleCloseModEdit();
            setPopupContent("Added Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setIsLoading(false);
            setTableLoader(false);

            setFilterLoader(false);
        } catch (err) {
            setFilterLoader(false);
            setIsLoading(false);
            setTableLoader(false);
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
                `${SERVICE.SINGLE_TYPING_PRACTICE_QUESTIONS_GROUPING}/${editDetails?._id}`,
                {
                    category: [editDetails?.category],
                    subcategory: [editDetails?.subcategory],
                    type: editDetails?.type,
                    company: valueCompanyEditCat,
                    branch: valueBranchEditCat,
                    unit: valueUnitEditCat,
                    team: valueTeamEditCat,
                    department: valueDepartmentEditCat,
                    designation: valueDesignationEditCat,
                    employeename: valueEmployeeEditCat,
                    questionsid: valueQuestionsEditCat,
                    updatedby: [
                        ...editDetails?.updatedby,
                        {
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),
                        },
                    ],
                },
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );

            // await axios.put(`${SERVICE.INTERVIEWVERIFICATION_OVERALLEDIT}`, {
            //     headers: {
            //         Authorization: `Bearer ${auth.APIToken}`,
            //     },
            //     oldcategory: editDetails?.oldcategory,
            //     newcategory: editDetails?.category,
            //     oldsubcategory: editDetails?.oldsubcategory,
            //     newsubcategory: editDetails.subcategory,
            //     oldquestion: editDetails?.oldquestion,
            //     newquestion: editDetails?.question?.trim(),
            //     oldsubquestion: [],
            //     newsubquestion: [],
            //     mode: "Typing Test",
            // });
            setFilteredChanges(null)
            setFilteredRowData([]);

            await fetchReturnData();
            handleCloseModEdit();
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            handleCloseOverallEditPopup();
            setIsLoading(false);
            setUpdateLoader(false);
        } catch (err) {
            setIsLoading(false);
            setUpdateLoader(false);
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


    // const getTextAfterFirstDash = (inputString) => {
    //     const parts = inputString.split('-');
    //     return parts.slice(1).join('-');
    // };
    function getTextAfterFirstDash(str1, str2) {
        // Use String.prototype.replace to remove the first occurrence of str1 from str2
        const newStr = str2.replace(new RegExp(`^${str1}[-]?`), "");
        return newStr;
    }



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
        category: "",
        subcategory: "",

    });


    const [typingTestHours, setTypingTestHours] = useState();
    const [typingTestMinutes, setTypingTestMinutes] = useState();

    const [hrsOption, setHrsOption] = useState([]);
    const [minsOption, setMinsOption] = useState([]);






    const [typingTestHoursEdit, setTypingTestHoursEdit] = useState("Mins");
    const [typingTestMinutesEdit, setTypingTestMinutesEdit] = useState("Sec");




    //MULTISELECT ONCHANGE END
    const handleClearFilter = () => {
        setValueCompanyCat([]);
        setSelectedOptionsCompany([]);
        setValueBranchCat([]);
        setSelectedOptionsBranch([]);
        setValueUnitCat([]);
        setSelectedOptionsUnit([]);
        setValueDesignationCat([]);
        setSelectedOptionsDesignation([]);
        setValueTeamCat([]);
        setSelectedOptionsTeam([]);
        setValueDepartmentCat([]);
        setSelectedOptionsDepartment([]);
        setValueEmployeeCat([]);
        setSelectedOptionsEmployee([]);
        setEmployeeOptions([]);

        setSelectedOptionsQuestions([]);
        setValueQuestionsCat([])



        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
        setFilterState({
            type: "Individual",
            category: "",
            subcategory: "",

        });


    };

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

    //MUTILSELECT START
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


    //company multiselect edit
    const [selectedOptionsCompanyEdit, setSelectedOptionsCompanyEdit] = useState([]);
    let [valueCompanyEditCat, setValueCompanyEditCat] = useState([]);

    const handleCompanyEditChange = (options) => {
        setValueCompanyEditCat(
            options?.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsCompanyEdit(options);
        setValueBranchEditCat([]);
        setSelectedOptionsBranchEdit([]);
        setValueUnitEditCat([]);
        setSelectedOptionsUnitEdit([]);
        setValueTeamEditCat([]);
        setSelectedOptionsTeamEdit([]);
        setValueDepartmentEditCat([]);
        setSelectedOptionsDepartmentEdit([]);
        setValueEmployeeEditCat([]);
        setSelectedOptionsEmployeeEdit([]);

    };

    const customValueRendererCompanyEdit = (valueCompanyEditCat, _categoryname) => {
        return valueCompanyEditCat?.length
            ? valueCompanyEditCat?.map(({ label }) => label)?.join(", ")
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
    //branch multiselect edit
    const [selectedOptionsBranchEdit, setSelectedOptionsBranchEdit] = useState([]);
    let [valueBranchEditCat, setValueBranchEditCat] = useState([]);

    const handleBranchEditChange = (options) => {
        setValueBranchEditCat(
            options?.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsBranchEdit(options);
        setValueUnitEditCat([]);
        setSelectedOptionsUnitEdit([]);
        setValueTeamEditCat([]);
        setSelectedOptionsTeamEdit([]);
        setValueDepartmentEditCat([]);
        setSelectedOptionsDepartmentEdit([]);
        setValueEmployeeEditCat([]);
        setSelectedOptionsEmployeeEdit([]);
    };

    const customValueRendererBranchEdit = (valueBranchEditCat, _categoryname) => {
        return valueBranchEditCat?.length
            ? valueBranchEditCat?.map(({ label }) => label)?.join(", ")
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
    //unit multiselect
    const [selectedOptionsUnitEdit, setSelectedOptionsUnitEdit] = useState([]);
    let [valueUnitEditCat, setValueUnitEditCat] = useState([]);

    const handleUnitEditChange = (options) => {
        setValueUnitEditCat(
            options?.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsUnitEdit(options);
        setValueTeamEditCat([]);
        setSelectedOptionsTeamEdit([]);
        setValueDepartmentEditCat([]);
        setSelectedOptionsDepartmentEdit([]);
        setValueEmployeeEditCat([]);
        setSelectedOptionsEmployeeEdit([]);
    };

    const customValueRendererUnitEdit = (valueUnitEditCat, _categoryname) => {
        return valueUnitEditCat?.length
            ? valueUnitEditCat?.map(({ label }) => label)?.join(", ")
            : "Please Select Unit";
    };

    //team multiselect
    const [selectedOptionsTeam, setSelectedOptionsTeam] = useState([]);
    let [valueTeamCat, setValueTeamCat] = useState([]);

    const handleTeamChange = (options) => {
        let teamArray =
            options?.map((a, index) => {
                return a.value;
            })

        setValueTeamCat(teamArray);
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
    //team multiselect edit
    const [selectedOptionsTeamEdit, setSelectedOptionsTeamEdit] = useState([]);
    let [valueTeamEditCat, setValueTeamEditCat] = useState([]);

    const handleTeamEditChange = (options) => {
        setValueTeamEditCat(
            options?.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsTeamEdit(options);
        setValueDepartmentEditCat([]);
        setSelectedOptionsDepartmentEdit([]);
        setValueEmployeeEditCat([]);
        setSelectedOptionsEmployeeEdit([]);
    };

    const customValueRendererTeamEdit = (valueTeamEditCat, _categoryname) => {
        return valueTeamEditCat?.length
            ? valueTeamEditCat?.map(({ label }) => label)?.join(", ")
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

    //department multiselect edit
    const [selectedOptionsDepartmentEdit, setSelectedOptionsDepartmentEdit] = useState(
        []
    );
    let [valueDepartmentEditCat, setValueDepartmentEditCat] = useState([]);

    const handleDepartmentEditChange = (options) => {
        setValueDepartmentEditCat(
            options?.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsDepartmentEdit(options);
        setValueEmployeeEditCat([]);
        setSelectedOptionsEmployeeEdit([]);
    };

    const customValueRendererDepartmentEdit = (valueDepartmentEditCat, _categoryname) => {
        return valueDepartmentEditCat?.length
            ? valueDepartmentEditCat?.map(({ label }) => label)?.join(", ")
            : "Please Select Department";
    };
    //designation multiselect
    const [selectedOptionsDesignation, setSelectedOptionsDesignation] = useState(
        []
    );
    let [valueDesignationCat, setValueDesignationCat] = useState([]);

    const handleDesignationChange = (options) => {
        setValueDesignationCat(
            options?.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsDesignation(options);
        setValueEmployeeCat([]);
        setSelectedOptionsEmployee([]);
    };

    const customValueRendererDesignation = (valueDesignationCat, _categoryname) => {
        return valueDesignationCat?.length
            ? valueDesignationCat?.map(({ label }) => label)?.join(", ")
            : "Please Select Designation";
    };

    //Designation multiselect edit
    const [selectedOptionsDesignationEdit, setSelectedOptionsDesignationEdit] = useState(
        []
    );
    let [valueDesignationEditCat, setValueDesignationEditCat] = useState([]);

    const handleDesignationEditChange = (options) => {
        setValueDesignationEditCat(
            options?.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsDesignationEdit(options);
        setValueEmployeeEditCat([]);
        setSelectedOptionsEmployeeEdit([]);
    };

    const customValueRendererDesignationEdit = (valueDesignationEditCat, _categoryname) => {
        return valueDesignationEditCat?.length
            ? valueDesignationEditCat?.map(({ label }) => label)?.join(", ")
            : "Please Select Designation";
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
    //employee multiselect edit
    const [selectedOptionsEmployeeEdit, setSelectedOptionsEmployeeEdit] = useState([]);
    let [valueEmployeeEditCat, setValueEmployeeEditCat] = useState([]);

    const handleEmployeeEditChange = (options) => {
        setValueEmployeeEditCat(
            options?.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsEmployeeEdit(options);
    };

    const customValueRendererEmployeeEdit = (valueEmployeeEditCat, _categoryname) => {
        return valueEmployeeEditCat?.length
            ? valueEmployeeEditCat?.map(({ label }) => label)?.join(", ")
            : "Please Select Employee";
    };



    //questions multiselect
    const [selectedOptionsQuestions, setSelectedOptionsQuestions] = useState([]);
    let [valueQuestionsCat, setValueQuestionsCat] = useState([]);

    const handleQuestionsChange = (options) => {
        setValueQuestionsCat(
            options?.map((a, index) => {
                return a.questionid;
            })
        );
        setSelectedOptionsQuestions(options);
    };

    const customValueRendererQuestions = (valueQuestionsCat, _categoryname) => {
        return valueQuestionsCat?.length
            ? valueQuestionsCat?.map(({ label }) => label)?.join(", ")
            : "Please Select Questions";
    };
    //questions multiselect edit
    const [selectedOptionsQuestionsEdit, setSelectedOptionsQuestionsEdit] = useState([]);
    let [valueQuestionsEditCat, setValueQuestionsEditCat] = useState([]);

    const handleQuestionsEditChange = (options) => {
        setValueQuestionsEditCat(
            options?.map((a, index) => {
                return a.questionid;
            })
        );
        setSelectedOptionsQuestionsEdit(options);
    };

    const customValueRendererQuestionsEdit = (valueQuestionsEditCat, _categoryname) => {
        return valueQuestionsEditCat?.length
            ? valueQuestionsEditCat?.map(({ label }) => label)?.join(", ")
            : "Please Select Questions";
    };


    const [filterLoader, setFilterLoader] = useState(false);
    const [tableLoader, setTableLoader] = useState(false);
    const handleSubmit = () => {

        setTableLoader(true);
        // Define common conditions for all types
        const commonConditions = (entry) =>
            entry.companyArray.some(company => valueCompanyCat.includes(company)) &&
            entry.categoryArray?.includes(filterState.category) &&
            entry.subcategoryArray?.includes(filterState.subcategory) &&
            entry.questionsid.some(qid => valueQuestionsCat.includes(qid))
        // Define specific conditions for each type
        const typeSpecificConditions = {
            Company: (entry) => true, // No additional checks for Company
            Branch: (entry) => entry.branchArray.some(branch => valueBranchCat.includes(branch)),
            Unit: (entry) =>
                entry.branchArray.some(branch => valueBranchCat.includes(branch)) &&
                entry.unitArray.some(unit => valueUnitCat.includes(unit)),
            Team: (entry) =>
                entry.branchArray.some(branch => valueBranchCat.includes(branch)) &&
                entry.unitArray.some(unit => valueUnitCat.includes(unit)) &&
                entry.teamArray.some(team => valueTeamCat.includes(team)),
            Individual: (entry) =>
                entry.branchArray.some(branch => valueBranchCat.includes(branch)) &&
                entry.unitArray.some(unit => valueUnitCat.includes(unit)) &&
                entry.teamArray.some(team => valueTeamCat.includes(team)) &&
                entry.employeenameArray.some(empname => valueEmployeeCat.includes(empname)),

            Department: (entry) =>
                entry.branchArray.some(branch => valueBranchCat.includes(branch)) &&
                entry.unitArray.some(unit => valueUnitCat.includes(unit)) &&
                entry.departmentArray.some(dept => valueDepartmentCat.includes(dept)),
            Designation: (entry) =>
                entry.branchArray.some(branch => valueBranchCat.includes(branch)) &&
                entry.unitArray.some(unit => valueUnitCat.includes(unit)) &&
                entry.designationArray.some(des => valueDesignationCat.includes(des)),

        };

        // Check for duplicates
        const isDuplicate = employees.some((entry) => {
            // Ensure the entry type matches filterState type
            if (entry?.type !== filterState.type) return false;

            // Apply common and type-specific conditions
            return (
                commonConditions(entry) &&
                typeSpecificConditions[filterState.type]?.(entry) // Call the appropriate function for type-specific checks
            );
        });

        if (
            isDuplicate
        ) {
            setPopupContentMalert("Data Already Exist!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else
            if (
                filterState?.type === "Please Select Type" ||
                filterState?.type === "" ||
                !filterState?.type
            ) {
                setPopupContentMalert("Please Select Type!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (selectedOptionsCompany?.length === 0) {
                setPopupContentMalert("Please Select Company!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }

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
                ["Individual"]?.includes(filterState?.type) &&
                selectedOptionsEmployee?.length === 0
            ) {
                setPopupContentMalert("Please Select Employee!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (
                filterState?.type === "Department" &&
                selectedOptionsDepartment?.length === 0
            ) {
                setPopupContentMalert("Please Select Department!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (
                filterState?.type === "Designation" &&
                selectedOptionsDesignation?.length === 0
            ) {
                setPopupContentMalert("Please Select Designation!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (
                filterState?.category === "" || !filterState?.category
            ) {
                setPopupContentMalert("Please Select Category!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else if (
                filterState?.subcategory === "" || !filterState?.subcategory
            ) {
                setPopupContentMalert("Please Select Category!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }

            else if (
                selectedOptionsQuestions?.length === 0
            ) {
                setPopupContentMalert("Please Select Questions!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }

            else {
                sendRequest();
            }
    };

    useEffect(() => { fetchReturnData() }, [])
    const fetchReturnData = async () => {
        setPageName(!pageName);
        setLoader(true);
        setisBtnFilter(true);
        setFilterLoader(true);
        setTableLoader(true);
        try {

            let response = await axios.get(
                SERVICE.ALL_TYPING_PRACTICE_QUESTIONS_GROUPING,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );

            let preacticeQuestionsMaster = await getPracticeQuestions()
            setPracticeQuestions(preacticeQuestionsMaster);
            const itemsWithSerialNumber = response?.data?.allPracticeQuestionsGrouping?.map((item, index) => {

                let matechedQuestionDatas = preacticeQuestionsMaster?.filter(data => item?.questionsid?.includes(data?._id))
                let matechedQuestion = matechedQuestionDatas?.map(quest => quest?.question);



                let questionsWithAns = matechedQuestionDatas?.map((quest) => {
                    let speedCalculation = quest?.typingspeedvalidation === "Between" ? `${quest?.typingspeedvalidation} ${quest?.typingspeedfrom} to ${quest?.typingspeedto} wpm` : `${quest?.typingspeedvalidation} ${quest?.typingspeed} wpm`

                    let accuracyCalculation = quest?.typingaccuracyvalidation === "Between" ? `${quest?.typingaccuracyvalidation} ${quest?.typingaccuracyfrom} to ${quest?.typingaccuracyto} %` : `${quest?.typingaccuracyvalidation} ${quest?.typingaccuracy} %`

                    let mistakesCalculation = quest?.typingmistakesvalidation === "Between" ? `${quest?.typingmistakesvalidation} ${quest?.typingmistakesfrom} to ${quest?.typingmistakesto}` : `${quest?.typingmistakesvalidation} ${quest?.typingmistakes}`;

                    let duration = quest?.typingduration?.split(":")

                    return {
                        question: quest?.question || "",
                        speed: speedCalculation,
                        accuracy: accuracyCalculation,
                        mistakes: mistakesCalculation,
                        duration: `${duration?.length > 0 ? duration[0] : "00"} Mins ${duration?.length > 0 ? duration[1] : "00"} Sec`,
                    };
                });
                return {
                    ...item,
                    serialNumber: index + 1,
                    id: item._id,
                    questions: matechedQuestion?.join(",") || "",
                    questionsWithAns,
                    company: item?.company?.join(",") || "",
                    branch: item?.branch?.join(",") || "",
                    unit: item?.unit?.join(",") || "",
                    team: item?.team?.join(",") || "",
                    department: item?.department?.join(",") || "",
                    designation: item?.designation?.join(",") || "",
                    employeename: item?.employeename?.join(",") || "",
                    category: item?.category?.join(",") || "",
                    subcategory: item?.subcategory?.join(",") || "",

                    companyArray: item?.company,
                    branchArray: item?.branch,
                    unitArray: item?.unit,
                    teamArray: item?.team,
                    departmentArray: item?.department,
                    designationArray: item?.designation,
                    employeenameArray: item?.employeename,
                    categoryArray: item?.category,
                    subcategoryArray: item?.subcategory,
                    responseexist: item?.responseexist,
                    questionsArray: matechedQuestion?.length ? matechedQuestion : [],

                    addedby: item?.addedby?.length > 0 ? item?.addedby : [],
                    updatedby: item?.updatedby?.length > 0 ? item?.updatedby : [],

                };
            });

            setEmployees(itemsWithSerialNumber);

            setisBtnFilter(false);
            setLoader(false);
            setFilterLoader(false);
            setTableLoader(false);
        } catch (err) {
            console.log(err, "err")
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



    //FILTER END

    return (
        <Box>
            <NotificationContainer />
            <Headtitle title={"PRACTICE QUESTIONS GROUPING"} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Practice Questions Grouping"
                modulename="Typing Practice"
                submodulename="Practice Questions Grouping"
                mainpagename=""
                subpagename=""
                subsubpagename=""
            />
            {isUserRoleCompare?.includes("apracticequestionsgrouping") && (
                <>
                    <Box sx={userStyle.dialogbox}>
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography sx={userStyle.importheadtext}>
                                        Add Practice Questions Grouping
                                    </Typography>
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
                                                label:
                                                    !filterState.type ? "Please Select Type" : filterState.type,
                                                value:
                                                    !filterState.type ? "Please Select Type" : filterState.type,
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
                                                    Designation<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={alldesignation?.map(data => ({
                                                        label: data.name,
                                                        value: data.name,
                                                    }))?.filter((item, index, self) => {
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
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Category<b style={{ color: "red" }}>*</b>
                                        </Typography>

                                        <Selects
                                            options={practiceQuestions?.map(data => ({
                                                label: data?.category,
                                                value: data?.category,
                                            }))?.filter((item, index, self) => {
                                                return (
                                                    self.findIndex(
                                                        (i) =>
                                                            i.label === item.label &&
                                                            i.value === item.value
                                                    ) === index
                                                );
                                            })}
                                            value={{
                                                label: filterState?.category ? filterState?.category : "Please Select Category",
                                                value: filterState?.category ? filterState?.category : "Please Select Category",
                                            }}
                                            onChange={(e) => {

                                                setFilterState((prev) => ({
                                                    ...prev,
                                                    category: e.value,
                                                    subcategory: "",
                                                }));
                                                setSelectedOptionsQuestions([]);
                                                setValueQuestionsCat([])
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Sub Category<b style={{ color: "red" }}>*</b>
                                        </Typography>

                                        <Selects
                                            options={practiceQuestions
                                                ?.filter(
                                                    (item) =>
                                                        item.category === filterState?.category
                                                )
                                                ?.map((item) => {
                                                    return {
                                                        label: item?.subcategory,
                                                        value: item?.subcategory,
                                                    };
                                                })?.filter((item, index, self) => {
                                                    return (
                                                        self.findIndex(
                                                            (i) =>
                                                                i.label === item.label &&
                                                                i.value === item.value
                                                        ) === index
                                                    );
                                                })}
                                            value={{
                                                label: filterState?.subcategory ? filterState?.subcategory : "Please Select Sub Category",
                                                value: filterState?.subcategory ? filterState?.subcategory : "Please Select Sub Category",
                                            }}
                                            onChange={(e) => {
                                                setFilterState((prev) => ({
                                                    ...prev,
                                                    subcategory: e.value,
                                                }));
                                                setSelectedOptionsQuestions([]);
                                                setValueQuestionsCat([])
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Questions <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect
                                            options={practiceQuestions
                                                ?.filter(
                                                    (item) =>
                                                        item.category === filterState?.category &&
                                                        item.subcategory === filterState?.subcategory
                                                )
                                                ?.map((item) => {
                                                    return {
                                                        questionid: item?._id,
                                                        label: item?.question,
                                                        value: item?.question,
                                                    };
                                                })}

                                            value={selectedOptionsQuestions}
                                            onChange={(e) => {
                                                handleQuestionsChange(e);
                                            }}
                                            valueRenderer={customValueRendererQuestions}
                                            labelledBy="Please Select Questions"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container spacing={2}>

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
                    {isUserRoleCompare?.includes("lpracticequestionsgrouping") && (
                        <>
                            <Box sx={userStyle.container}>
                                {/* ******************************************************EXPORT Buttons****************************************************** */}
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Typography sx={userStyle.SubHeaderText}>
                                            List Practice Questions Grouping
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
                                                "excelpracticequestionsgrouping"
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
                                                "csvpracticequestionsgrouping"
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
                                                "printpracticequestionsgrouping"
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
                                                "pdfpracticequestionsgrouping"
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
                                                "imagepracticequestionsgrouping"
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
                                {isUserRoleCompare?.includes("bdpracticequestionsgrouping") && (
                                    <Button
                                        variant="contained"
                                        color="error"
                                        sx={buttonStyles.buttonbulkdelete}
                                        onClick={handleClickOpenalert}
                                    >
                                        Bulk Delete
                                    </Button>
                                )}
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
                filename={"PracticeQuestionsGrouping"}
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
                            View Practice Questions Grouping
                        </Typography>
                        <br />
                        <Grid container spacing={2}>


                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Type</Typography>
                                    <Typography>{viewDetails?.type}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Company</Typography>
                                    <Typography sx={{
                                        wordBreak: "break-word",
                                        overflowWrap: "break-word",
                                        whiteSpace: "pre-wrap",
                                    }}>{!["Individual"]?.includes(viewDetails.type) ? viewDetails.company : [...new Set(allUsersData?.filter((data) => viewDetails?.employeenameArray?.includes(data?.companyname))?.map(item => item.company))]?.join(",")}</Typography>
                                </FormControl>
                            </Grid>
                            {["Individual", "Branch", "Unit", "Team", "Department", "Designation"]?.includes(viewDetails.type) && (
                                <Grid item md={6} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6">Branch</Typography>
                                        <Typography sx={{
                                            wordBreak: "break-word",
                                            overflowWrap: "break-word",
                                            whiteSpace: "pre-wrap",
                                        }}>{!["Individual"]?.includes(viewDetails.type) ? viewDetails.branch : [...new Set(allUsersData?.filter((data) => viewDetails?.employeenameArray?.includes(data?.companyname))?.map(item => item.branch))]?.join(",")}</Typography>
                                    </FormControl>
                                </Grid>
                            )}
                            {["Individual", "Unit", "Team", "Department", "Designation"]?.includes(viewDetails.type) && (
                                <Grid item md={6} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6">Unit</Typography>
                                        <Typography sx={{
                                            wordBreak: "break-word",
                                            overflowWrap: "break-word",
                                            whiteSpace: "pre-wrap",
                                        }}>{!["Individual"]?.includes(viewDetails.type) ? viewDetails.unit : [...new Set(allUsersData?.filter((data) => viewDetails?.employeenameArray?.includes(data?.companyname))?.map(item => item.unit))]?.join(",")}</Typography>
                                    </FormControl>
                                </Grid>
                            )}
                            {["Individual", "Team"]?.includes(viewDetails.type) && (
                                <Grid item md={6} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6">Team</Typography>
                                        <Typography sx={{
                                            wordBreak: "break-word",
                                            overflowWrap: "break-word",
                                            whiteSpace: "pre-wrap",
                                        }}>{!["Individual"]?.includes(viewDetails.type) ? viewDetails.team : [...new Set(allUsersData?.filter((data) => viewDetails?.employeenameArray?.includes(data?.companyname))?.map(item => item.team))]?.join(",")}</Typography>
                                    </FormControl>
                                </Grid>)}

                            {["Department"]?.includes(viewDetails.type) && (
                                <Grid item md={6} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6">Department</Typography>
                                        <Typography sx={{
                                            wordBreak: "break-word",
                                            overflowWrap: "break-word",
                                            whiteSpace: "pre-wrap",
                                        }}>{viewDetails.department}</Typography>
                                    </FormControl>
                                </Grid>)}
                            {["Designation"]?.includes(viewDetails.type) && (
                                <Grid item md={6} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6">Designation</Typography>
                                        <Typography sx={{
                                            wordBreak: "break-word",
                                            overflowWrap: "break-word",
                                            whiteSpace: "pre-wrap",
                                        }}>{viewDetails.designation}</Typography>
                                    </FormControl>
                                </Grid>)}
                            {["Individual"]?.includes(viewDetails.type) && (
                                <Grid item md={6} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6">Employee</Typography>
                                        <Typography sx={{
                                            wordBreak: "break-word",
                                            overflowWrap: "break-word",
                                            whiteSpace: "pre-wrap",
                                        }}>{viewDetails.employeename}</Typography>
                                    </FormControl>
                                </Grid>)}
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Category</Typography>
                                    <Typography>{viewDetails?.category}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Sub Category</Typography>
                                    <Typography>{viewDetails?.subcategory}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={12} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Questions</Typography>
                                    {viewDetails?.questionsWithAns?.length > 0 ? (
                                        viewDetails?.questionsWithAns?.map((data, index) => (
                                            <Box key={index} sx={{ marginBottom: 2, padding: 1, border: "1px solid #ccc", borderRadius: 2 }}>
                                                <Typography variant="body1">
                                                    <strong>{index + 1}. {data.question}</strong>
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    <strong>Speed:</strong> {data.speed}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    <strong>Accuracy:</strong> {data.accuracy}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    <strong>Mistakes:</strong> {data.mistakes}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    <strong>Duration:</strong> {data.duration}
                                                </Typography>
                                            </Box>
                                        ))
                                    ) : (
                                        <Typography variant="body2" color="error">No questions available</Typography>
                                    )}
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
                    maxWidth="lg"
                    fullWidth={true}
                    sx={{
                        // overflow: "visible",
                        // "& .MuiPaper-root": {
                        //     overflow: "visible",
                        // },
                        marginTop: "50px"
                    }}
                >
                    <Box sx={{ padding: "20px 50px" }}>
                        <>
                            <Grid container spacing={2}>
                                <Typography sx={userStyle.HeaderText}>
                                    Edit Practice Questions Grouping
                                </Typography>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Type<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={TypeOptions}
                                            styles={colourStyles}
                                            value={{
                                                label:
                                                    !editDetails.type ? "Please Select Type" : editDetails.type,
                                                value:
                                                    !editDetails.type ? "Please Select Type" : editDetails.type,
                                            }}
                                            onChange={(e) => {
                                                setEditDetails((prev) => ({
                                                    ...prev,
                                                    type: e.value,
                                                }));
                                                setValueCompanyEditCat([]);
                                                setSelectedOptionsCompanyEdit([]);

                                                setValueBranchEditCat([]);
                                                setSelectedOptionsBranchEdit([]);

                                                setValueUnitEditCat([]);
                                                setSelectedOptionsUnitEdit([]);

                                                setValueTeamEditCat([]);
                                                setSelectedOptionsTeamEdit([]);

                                                setValueDepartmentEditCat([]);
                                                setSelectedOptionsDepartmentEdit([]);

                                                setValueDesignationEditCat([]);
                                                setSelectedOptionsDesignationEdit([]);

                                                setValueEmployeeEditCat([]);
                                                setSelectedOptionsEmployeeEdit([]);


                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
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
                                            value={selectedOptionsCompanyEdit}
                                            onChange={(e) => {
                                                handleCompanyEditChange(e);
                                            }}
                                            valueRenderer={customValueRendererCompany}
                                            labelledBy="Please Select Company"
                                        />
                                    </FormControl>
                                </Grid>
                                {["Individual", "Team"]?.includes(editDetails.type) ? (
                                    <>
                                        {/* Branch Unit Team */}
                                        <Grid item md={4} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    {" "}
                                                    Branch <b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={accessbranch
                                                        ?.filter((comp) =>
                                                            valueCompanyEditCat?.includes(comp.company)
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
                                                    value={selectedOptionsBranchEdit}
                                                    onChange={(e) => {
                                                        handleBranchEditChange(e);
                                                    }}
                                                    valueRenderer={customValueRendererBranch}
                                                    labelledBy="Please Select Branch"
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    {" "}
                                                    Unit<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={accessbranch
                                                        ?.filter(
                                                            (comp) =>
                                                                valueCompanyEditCat?.includes(comp.company) &&
                                                                valueBranchEditCat?.includes(comp.branch)
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
                                                    value={selectedOptionsUnitEdit}
                                                    onChange={(e) => {
                                                        handleUnitEditChange(e);
                                                    }}
                                                    valueRenderer={customValueRendererUnit}
                                                    labelledBy="Please Select Unit"
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4} xs={12} sm={6}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Team<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={allTeam
                                                        ?.filter(
                                                            (u) =>
                                                                valueCompanyEditCat?.includes(u.company) &&
                                                                valueBranchEditCat?.includes(u.branch) &&
                                                                valueUnitEditCat?.includes(u.unit)
                                                        )
                                                        ?.map((u) => ({
                                                            ...u,
                                                            label: u.teamname,
                                                            value: u.teamname,
                                                        }))}
                                                    value={selectedOptionsTeamEdit}
                                                    onChange={(e) => {
                                                        handleTeamEditChange(e);
                                                    }}
                                                    valueRenderer={customValueRendererTeam}
                                                    labelledBy="Please Select Team"
                                                />
                                            </FormControl>
                                        </Grid>

                                    </>
                                ) : ["Department"]?.includes(editDetails.type) ? (
                                    <>
                                        {/* Department */}
                                        <Grid item md={4} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    {" "}
                                                    Branch <b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={accessbranch
                                                        ?.filter((comp) =>
                                                            valueCompanyEditCat?.includes(comp.company)
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
                                                    value={selectedOptionsBranchEdit}
                                                    onChange={(e) => {
                                                        handleBranchEditChange(e);
                                                    }}
                                                    valueRenderer={customValueRendererBranch}
                                                    labelledBy="Please Select Branch"
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    {" "}
                                                    Unit<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={accessbranch
                                                        ?.filter(
                                                            (comp) =>
                                                                valueCompanyEditCat?.includes(comp.company) &&
                                                                valueBranchEditCat?.includes(comp.branch)
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
                                                    value={selectedOptionsUnitEdit}
                                                    onChange={(e) => {
                                                        handleUnitEditChange(e);
                                                    }}
                                                    valueRenderer={customValueRendererUnit}
                                                    labelledBy="Please Select Unit"
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4} xs={12} sm={6}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Department<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={departmentOptions}
                                                    value={selectedOptionsDepartmentEdit}
                                                    onChange={(e) => {
                                                        handleDepartmentEditChange(e);
                                                    }}
                                                    valueRenderer={customValueRendererDepartment}
                                                    labelledBy="Please Select Department"
                                                />
                                            </FormControl>
                                        </Grid>
                                    </>
                                ) : ["Designation"]?.includes(editDetails.type) ? (
                                    <>
                                        {/* Designation */}
                                        <Grid item md={4} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    {" "}
                                                    Branch <b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={accessbranch
                                                        ?.filter((comp) =>
                                                            valueCompanyEditCat?.includes(comp.company)
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
                                                    value={selectedOptionsBranchEdit}
                                                    onChange={(e) => {
                                                        handleBranchEditChange(e);
                                                    }}
                                                    valueRenderer={customValueRendererBranch}
                                                    labelledBy="Please Select Branch"
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    {" "}
                                                    Unit<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={accessbranch
                                                        ?.filter(
                                                            (comp) =>
                                                                valueCompanyEditCat?.includes(comp.company) &&
                                                                valueBranchEditCat?.includes(comp.branch)
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
                                                    value={selectedOptionsUnitEdit}
                                                    onChange={(e) => {
                                                        handleUnitEditChange(e);
                                                    }}
                                                    valueRenderer={customValueRendererUnit}
                                                    labelledBy="Please Select Unit"
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4} xs={12} sm={6}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Designation<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={alldesignation?.map(data => ({
                                                        label: data.name,
                                                        value: data.name,
                                                    }))?.filter((item, index, self) => {
                                                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                    })}
                                                    value={selectedOptionsDesignationEdit}
                                                    onChange={(e) => {
                                                        handleDesignationEditChange(e);
                                                    }}
                                                    valueRenderer={customValueRendererDesignation}
                                                    labelledBy="Please Select Designation"
                                                />
                                            </FormControl>
                                        </Grid>
                                    </>
                                ) : ["Branch"]?.includes(editDetails.type) ? (
                                    <>
                                        <Grid item md={4} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    {" "}
                                                    Branch <b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={accessbranch
                                                        ?.filter((comp) =>
                                                            valueCompanyEditCat?.includes(comp.company)
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
                                                    value={selectedOptionsBranchEdit}
                                                    onChange={(e) => {
                                                        handleBranchEditChange(e);
                                                    }}
                                                    valueRenderer={customValueRendererBranch}
                                                    labelledBy="Please Select Branch"
                                                />
                                            </FormControl>
                                        </Grid>

                                    </>
                                ) : ["Unit"]?.includes(editDetails.type) ? (
                                    <>
                                        <Grid item md={4} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    {" "}
                                                    Branch <b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={accessbranch
                                                        ?.filter((comp) =>
                                                            valueCompanyEditCat?.includes(comp.company)
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
                                                    value={selectedOptionsBranchEdit}
                                                    onChange={(e) => {
                                                        handleBranchEditChange(e);
                                                    }}
                                                    valueRenderer={customValueRendererBranch}
                                                    labelledBy="Please Select Branch"
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={4} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    {" "}
                                                    Unit<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={accessbranch
                                                        ?.filter(
                                                            (comp) =>
                                                                valueCompanyEditCat?.includes(comp.company) &&
                                                                valueBranchEditCat?.includes(comp.branch)
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
                                                    value={selectedOptionsUnitEdit}
                                                    onChange={(e) => {
                                                        handleUnitEditChange(e);
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
                                {["Individual"]?.includes(editDetails.type) && (
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Employee<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <MultiSelect
                                                options={allUsersData
                                                    ?.filter((u) => {

                                                        // If it contains both or is empty, apply no filtering on workmode
                                                        return (
                                                            valueCompanyEditCat?.includes(u.company) &&
                                                            valueBranchEditCat?.includes(u.branch) &&
                                                            valueUnitEditCat?.includes(u.unit) &&
                                                            valueTeamEditCat?.includes(u.team)
                                                        );
                                                    })
                                                    ?.map((u) => ({
                                                        label: u.companyname,
                                                        value: u.companyname,
                                                    }))
                                                }

                                                value={selectedOptionsEmployeeEdit}
                                                onChange={(e) => {
                                                    handleEmployeeEditChange(e);
                                                }}
                                                valueRenderer={customValueRendererEmployee}
                                                labelledBy="Please Select Employee"
                                            />
                                        </FormControl>
                                    </Grid>
                                )}
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Category<b style={{ color: "red" }}>*</b>
                                        </Typography>

                                        <Selects
                                            options={practiceQuestions?.map(data => ({
                                                label: data?.category,
                                                value: data?.category,
                                            }))?.filter((item, index, self) => {
                                                return (
                                                    self.findIndex(
                                                        (i) =>
                                                            i.label === item.label &&
                                                            i.value === item.value
                                                    ) === index
                                                );
                                            })}
                                            value={{
                                                label: editDetails?.category ? editDetails?.category : "Please Select Category",
                                                value: editDetails?.category ? editDetails?.category : "Please Select Category",
                                            }}
                                            onChange={(e) => {

                                                setEditDetails((prev) => ({
                                                    ...prev,
                                                    category: e.value,
                                                    subcategory: "",
                                                }));
                                                setSelectedOptionsQuestionsEdit([]);
                                                setValueQuestionsEditCat([])
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Sub Category<b style={{ color: "red" }}>*</b>
                                        </Typography>

                                        <Selects
                                            options={practiceQuestions
                                                ?.filter(
                                                    (item) =>
                                                        item.category === editDetails?.category
                                                )
                                                ?.map((item) => {
                                                    return {
                                                        label: item?.subcategory,
                                                        value: item?.subcategory,
                                                    };
                                                })?.filter((item, index, self) => {
                                                    return (
                                                        self.findIndex(
                                                            (i) =>
                                                                i.label === item.label &&
                                                                i.value === item.value
                                                        ) === index
                                                    );
                                                })}
                                            value={{
                                                label: editDetails?.subcategory ? editDetails?.subcategory : "Please Select Sub Category",
                                                value: editDetails?.subcategory ? editDetails?.subcategory : "Please Select Sub Category",
                                            }}
                                            onChange={(e) => {
                                                setEditDetails((prev) => ({
                                                    ...prev,
                                                    subcategory: e.value,
                                                }));
                                                setSelectedOptionsQuestionsEdit([]);
                                                setValueQuestionsEditCat([])
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Questions <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect
                                            options={practiceQuestions
                                                ?.filter(
                                                    (item) =>
                                                        item.category === editDetails?.category &&
                                                        item.subcategory === editDetails?.subcategory
                                                )
                                                ?.map((item) => {
                                                    return {
                                                        questionid: item?._id,
                                                        label: item?.question,
                                                        value: item?.question,
                                                    };
                                                })}

                                            value={selectedOptionsQuestionsEdit}
                                            onChange={(e) => {
                                                handleQuestionsEditChange(e);
                                            }}
                                            valueRenderer={customValueRendererQuestions}
                                            labelledBy="Please Select Questions"
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


            {/* <LoadingBackdrop open={isLoading} /> */}

            <DeleteConfirmation
                open={isDeleteOpen}
                onClose={handleClickCloseDelete}
                onConfirm={deleteFunction}
                title={deleteMessage}
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />

            <InfoPopup
                openInfo={openInfo}
                handleCloseinfo={handleCloseinfo}
                heading="Practice Questions Grouping Info"
                addedby={infoDetails?.addedby}
                updateby={infoDetails?.updatedby}
            />

            {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
            <DeleteConfirmation
                open={isDeleteOpencheckbox}
                onClose={handleCloseModcheckbox}
                onConfirm={bulkdeleteFunction}
                title={bulkDeleteMessage}
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />


            {/* 
            <Dialog
                open={isDeleteOpencheckbox}
                onClose={handleCloseModcheckbox}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent
                    sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
                >
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "80px", color: "orange" }}
                    />
                    <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
                        {selectedRows?.length === 0 ? (
                            <>
                                The Datas in the selected rows are already used in some pages,
                                you can't delete.
                            </>
                        ) : (
                            <>
                                Are you sure? Only {selectedRows?.length} datas can be deleted
                                remaining are used in some pages.
                            </>
                        )}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCloseModcheckbox}
                        sx={buttonStyles.btncancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        autoFocus
                        variant="contained"
                        color="error"
                        onClick={bulkdeleteFunction}
                    >
                        {" "}
                        OK{" "}
                    </Button>
                </DialogActions>
            </Dialog> */}
            {/* PLEASE SELECT ANY ROW */}
            <PleaseSelectRow
                open={isDeleteOpenalert}
                onClose={handleCloseModalert}
                message="Please Select any Row"
                iconColor="orange"
                buttonText="OK"
            />

            {/* bulk edit popup */}
            <Dialog
                open={openOverAllEditPopup}
                onClose={handleCloseOverallEditPopup}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent
                    sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
                >
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "80px", color: "orange" }}
                    />
                    <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
                        If this Question used in any of the pages that may also edits. Are
                        you sure?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCloseOverallEditPopup}
                        variant="outlined"
                        sx={buttonStyles.btncancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={(e) => sendEditRequest()}
                        autoFocus
                        variant="contained"
                        color="error"
                    >
                        {" "}
                        OK{" "}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default TypingPracticeQuestionsGrouping;