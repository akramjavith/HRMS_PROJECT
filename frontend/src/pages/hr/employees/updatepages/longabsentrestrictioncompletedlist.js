import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import LoadingButton from "@mui/lab/LoadingButton";
import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Paper,
    Popover,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import axios from "axios";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../../../components/Errorhandling";
import {
    AuthContext,
    UserRoleAccessContext,
} from "../../../../context/Appcontext";
import { userStyle, colourStyles } from "../../../../pageStyle";
import { SERVICE } from "../../../../services/Baseservice";

import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ChecklistIcon from "@mui/icons-material/Checklist";
import CloseIcon from "@mui/icons-material/Close";
import ErrorIcon from "@mui/icons-material/Error";
import ImageIcon from "@mui/icons-material/Image";
import InfoIcon from "@mui/icons-material/Info";
import LoginIcon from "@mui/icons-material/Login";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import WarningIcon from "@mui/icons-material/Warning";
import FormControlLabel from "@mui/material/FormControlLabel";
import MuiInput from "@mui/material/Input";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import { styled } from "@mui/system";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FaFileCsv, FaFileExcel } from "react-icons/fa";
import { MultiSelect } from "react-multi-select-component";
import {
    NotificationContainer,
    NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import { Link, useNavigate } from "react-router-dom";
import AlertDialog from "../../../../components/Alert";
import ExportData from "../../../../components/ExportData";
import Headtitle from "../../../../components/Headtitle";
import MessageAlert from "../../../../components/MessageAlert";
import PageHeading from "../../../../components/PageHeading";
import Webcamimage from "../Webcamprofile";
import Selects from "react-select";
import AggregatedSearchBar from "../../../../components/AggregatedSearchBar";
import AggridTable from "../../../../components/AggridTable";

const Input = styled(MuiInput)(({ theme }) => ({
    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
        display: "none !important",
    },
    "& input[type=number]": {
        MozAppearance: "textfield",
    },
}));

function EmployeeDetailCompletedStatus() {
    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
    const gridRefTableImg = useRef(null);

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
    const navigate = useNavigate();

    let exportColumnNames = [
        "Current Status",
        "Company",
        "Branch",
        "Unit",
        "Team",
        "Emp Code",
        "Name",
    ];
    let exportRowValues = [
        "userstatus",
        "company",
        "branch",
        "unit",
        "team",
        "empcode",
        "companyname",
    ];

    const [employees, setEmployees] = useState([]);
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
            pagename: String("Long Absent Restrcition Completed List"),
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

    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "Long Absent Restrcition Completed List.png");
                });
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
    const renderStatus = (status, workmode) => {
        const iconProps = {
            size: "small",
            style: { marginRight: 4 },
        };

        let icon = <InfoIcon {...iconProps} />;
        let color = "#ccc"; // Default color

        switch (status) {
            case "Notice Period Applied":
            case "Notice Period Applied and Long Leave":
            case "Notice Period Applied and Long Absent":
                icon = <PauseCircleOutlineIcon {...iconProps} />;
                color = "#1976d2"; // Blue
                break;
            case "Notice Period Approved":
            case "Notice Period Approved and Long Leave":
            case "Notice Period Approved and Long Absent":
                icon = <CheckCircleIcon {...iconProps} />;
                color = "#4caf50"; // Green
                break;
            case "Notice Period Cancelled":
            case "Notice Period Cancelled and Long Leave":
            case "Notice Period Cancelled and Long Absent":
                icon = <ErrorIcon {...iconProps} />;
                color = "#9c27b0"; // Purple
                break;
            case "Notice Period Continue":
            case "Notice Period Continue and Long Leave":
            case "Notice Period Continue and Long Absent":
                icon = <WarningIcon {...iconProps} />;
                color = "#ff9800"; // Orange
                break;
            case "Notice Period Rejected":
            case "Notice Period Rejected and Long Leave":
            case "Notice Period Rejected and Long Absent":
                icon = <ErrorIcon {...iconProps} />;
                color = "#f44336"; // Red
                break;
            case "Notice Period Recheck":
            case "Notice Period Recheck and Long Leave":
            case "Notice Period Recheck and Long Absent":
                icon = <InfoIcon {...iconProps} />;
                color = "#00acc1"; // Cyan
                break;
            case "Long Leave":
                icon = <PauseCircleOutlineIcon {...iconProps} />;
                color = "#1976d2"; // Blue
                break;
            case "Long Absent":
                icon = <ErrorIcon {...iconProps} />;
                color = "#f44336"; // Red
                break;
            case "Live":
                icon = <CheckCircleIcon {...iconProps} />;
                color = "#4caf50"; // Green
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
                        {workmode === "Internship" ? `${"Intern"} ${status}` : `${status}`}
                    </Typography>
                </Button>
            </Tooltip>
        );
    };

    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        userstatus: true,
        company: true,
        branch: true,
        unit: true,
        team: true,
        empcode: true,
        companyname: true,
        actions: true,
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
        documentTitle: "Long Absent Restriction",
        pageStyle: "print",
    });

    //table entries ..,.
    const [items, setItems] = useState([]);

    const addSerialNumber = (data) => {
        const itemsWithSerialNumber = data?.map((item, index) => ({
            _id: item?._id,
            serialNumber: index + 1,
            company: item?.company,
            userstatus: item.userstatus,
            branch: item?.branch,
            unit: item?.unit,
            team: item?.team,
            empcode: item?.empcode,
            companyname: item?.companyname,
            username: item?.username,
            password: item?.originalpassword,
            firstname: item?.firstname,
            lastname: item?.lastname,
            adharnumber: item?.aadhar,
            pannumber: item?.panno,
            dateofbirth: item?.dob,
            workmode: item?.workmode,
            checklistassigned: item?.checklistassigned,
            address: `${item?.pstreet}, ${item?.pcity}, ${item?.ppincode}, ${item?.pstate}, ${item?.pcountry}`,
            longleaveabsentaprooveddate: item?.longleaveabsentaprooveddate,
            longleaveabsentaprooveddatechecklist:
                item?.longleaveabsentaprooveddatechecklist,
        }));
        setItems(itemsWithSerialNumber);
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
            field: "userstatus",
            headerName: "Current Status",
            flex: 0,
            width: 180,
            minHeight: "40px",
            cellStyle: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            },

            cellRenderer: (params) =>
                renderStatus(params?.data.userstatus, params?.data?.workmode),
            hide: !columnVisibility.userstatus,
            pinned: "left",
        },
        {
            field: "company",
            headerName: "Company",
            flex: 0,
            width: 200,
            hide: !columnVisibility.company,
            headerClassName: "bold-header",
            pinned: "left",
        },
        {
            field: "branch",
            headerName: "Branch",
            flex: 0,
            width: 200,
            hide: !columnVisibility.branch,
            headerClassName: "bold-header",
            pinned: "left",
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
            field: "empcode",
            headerName: "Emp Code",
            flex: 0,
            width: 200,
            hide: !columnVisibility.empcode,
            headerClassName: "bold-header",
            cellStyle: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            },

            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    <ListItem
                        sx={{
                            "&:hover": {
                                cursor: "pointer",
                                color: "blue",
                                textDecoration: "underline",
                            },
                        }}
                    >
                        <CopyToClipboard
                            onCopy={() => {
                                handleCopy("Copied Emp Code!");
                            }}
                            options={{ message: "Copied Emp Code!" }}
                            text={params?.data?.empcode}
                        >
                            <ListItemText primary={params?.data?.empcode} />
                        </CopyToClipboard>
                    </ListItem>
                </Grid>
            ),
        },
        {
            field: "companyname",
            headerName: "Name",
            flex: 0,
            width: 200,
            hide: !columnVisibility.companyname,
            headerClassName: "bold-header",
            cellStyle: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            },

            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    <ListItem
                        sx={{
                            "&:hover": {
                                cursor: "pointer",
                                color: "blue",
                                textDecoration: "underline",
                            },
                        }}
                    >
                        <CopyToClipboard
                            onCopy={() => {
                                handleCopy("Copied Name!");
                            }}
                            options={{ message: "Copied Name!" }}
                            text={params?.data?.companyname}
                        >
                            <ListItemText primary={params?.data?.companyname} />
                        </CopyToClipboard>
                    </ListItem>
                </Grid>
            ),
        },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 200,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.actions,
            cellStyle: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            },

            cellRenderer: (params) => (
                <>
                    {dateArray?.some((data) =>
                        params?.data?.longleaveabsentaprooveddate?.includes(data)
                    ) ? (
                        <LoadingButton
                            endIcon={<CheckCircleIcon />}
                            variant="contained"
                            color="success"
                            loading={params.data.id === btnLoading}
                            size="small"
                            style={{ margin: "4px" }}
                            onClick={() => {
                                // handleAllowLogin(params.data.id, "");
                            }}
                        >
                            Allowed Login
                        </LoadingButton>
                    ) : (
                        <>
                            {params?.data?.checklistassigned ? (
                                <LoadingButton
                                    endIcon={<LoginIcon />}
                                    variant="contained"
                                    color="primary"
                                    loading={params.data.id === btnLoading}
                                    // disabled={!params?.data?.checklistassigned}
                                    size="small"
                                    style={{ margin: "4px" }}
                                    onClick={() => {
                                        // handleAllowLogin(params.data.id, cuurrentDate);
                                        getCodeNew(params.data);
                                    }}
                                >
                                    Allow Login
                                </LoadingButton>
                            ) : (
                                <Link
                                    to="/interview/myinterviewchecklist"
                                    style={{
                                        textDecoration: "none",
                                        color: "white",
                                        float: "right",
                                    }}
                                    target="_blank"
                                >
                                    <LoadingButton
                                        endIcon={<ChecklistIcon />}
                                        variant="contained"
                                        color="error"
                                        // disabled={!params?.data?.checklistassigned}
                                        size="small"
                                        style={{ margin: "4px" }}
                                    >
                                        Assign Checklist
                                    </LoadingButton>
                                </Link>
                            )}
                        </>
                    )}
                </>
            ),
        },
    ];

    const rowDataTable = filteredData?.map((item, index) => {
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            userstatus: item.userstatus,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            team: item.team,
            empcode: item.empcode,
            companyname: item.companyname,
            username: item?.username,
            password: item?.password,
            email: item?.email,
            mobile: item?.mobile,
            firstname: item?.firstname,
            lastname: item?.lastname,
            adharnumber: item?.adharnumber,
            pannumber: item?.pannumber,
            dateofbirth: item?.dateofbirth,
            address: item?.address,
            checklistassigned: item?.checklistassigned,
            workmode: item?.workmode,
            longleaveabsentaprooveddate:
                item?.longleaveabsentaprooveddate?.length > 0
                    ? item?.longleaveabsentaprooveddate
                    : [],
            longleaveabsentaprooveddatechecklist:
                item?.longleaveabsentaprooveddatechecklist?.length > 0
                    ? item?.longleaveabsentaprooveddatechecklist
                    : [],
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
    const handleAllowLogin = async (row) => {
        try {
            setBtnloading(row?.id);
            let res = await axios.put(`${SERVICE.USER_SINGLE_PWD}/${row?.id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                longleaveabsentaprooveddate: dateArray,
            });
            await sendRequest();
            setPopupContent("Allowed Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setBtnloading("");
        } catch (err) {
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };

    //submit option for saving
    const handleSubmit = (e) => {
        e.preventDefault();
        // setIsActive(true)
        if (
            selectedOptionsCompany?.length === 0 &&
            selectedOptionsBranch?.length === 0 &&
            selectedOptionsUnit?.length === 0 &&
            selectedOptionsTeam?.length === 0
        ) {
            setPopupContentMalert("Please Select Any One Field");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else {
            sendRequest();
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
    const [isWebcamOpen, setIsWebcamOpen] = useState(false);
    const [getImg, setGetImg] = useState(null);
    const [isWebcamCapture, setIsWebcamCapture] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [capturedImages, setCapturedImages] = useState([]);
    const [valNum, setValNum] = useState(0);

    const webcamOpen = () => {
        setIsWebcamOpen(true);
    };
    const webcamClose = () => {
        setIsWebcamOpen(false);
    };
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

    const updateIndividualData = async (index) => {
        let searchItem = datasAvailedDB?.find(
            (item) =>
                item.commonid == postID &&
                item.module == "Human Resources" &&
                item.submodule == "HR" &&
                item.mainpage == "Employee" &&
                item.subpage == "Employee Status Details" &&
                item.subsubpage == "Long Absent Restriction List" &&
                item.status.toLowerCase() !== "completed"
        );

        let combinedGroups = groupDetails?.map((data) => {
            let check =
                (data.data !== undefined && data.data !== "") ||
                data.files !== undefined;

            if (check) {
                return {
                    ...data,
                    completedby: completedbyName,
                    completedat: new Date(),
                };
            } else {
                return {
                    ...data,
                    completedby: "",
                    completedat: "",
                };
            }
        });

        try {
            let objectID = combinedGroups[index]?._id;
            let objectData = combinedGroups[index];
            if (searchItem) {
                let assignbranches = await axios.put(
                    `${SERVICE.MYCHECKLIST_SINGLEBYOBJECTID}/${objectID}`,
                    {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        data: String(objectData?.data),
                        lastcheck: objectData?.lastcheck,
                        newFiles: objectData?.files,
                        completedby: objectData?.completedby,
                        completedat: objectData?.completedat,
                    }
                );
                let updateDate = await axios.put(
                    `${SERVICE.MYCHECKLIST_SINGLE}/${singleDataId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        longleaveabsentaprooveddatechecklist: dateArray,
                    }
                );
                await fecthDBDatas();
            } else {
                let assignbranches = await axios.post(`${SERVICE.MYCHECKLIST_CREATE}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    commonid: postID,
                    module: pagesDetails?.module,
                    submodule: pagesDetails?.submodule,
                    mainpage: pagesDetails?.mainpage,
                    subpage: pagesDetails?.subpage,
                    subsubpage: pagesDetails?.subsubpage,
                    category: assignDetails?.category,
                    subcategory: assignDetails?.subcategory,
                    candidatename: assignDetails?.fullname,
                    status: "progress",
                    longleaveabsentaprooveddatechecklist: dateArray,
                    groups: combinedGroups,
                    addedby: [
                        {
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),
                        },
                    ],
                });
                await fecthDBDatas();
            }

            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };

    async function fecthDBDatas() {
        try {
            let res = await axios.get(SERVICE.MYCHECKLIST);
            setDatasAvailedDB(res?.data?.mychecklist);

            let foundData = res?.data?.mychecklist?.find(
                (item) => item.commonid == postID
            );
            setGroupDetails(foundData?.groups);
        } catch (err) {
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    }

    const updateDateValuesAtIndex = (value, index) => {
        setDateValue((prevArray) => {
            const newArray = [...prevArray]; // Create a copy of the array
            newArray[index] = value; // Update value at the specified index
            return newArray; // Return the updated array
        });
        handleDataChange(value, index, "DateTime", "date");
    };

    const updateTimeValuesAtIndex = (value, index) => {
        setTimeValue((prevArray) => {
            const newArray = [...prevArray]; // Create a copy of the array
            newArray[index] = value; // Update value at the specified index
            return newArray; // Return the updated array
        });
        handleDataChange(value, index, "DateTime", "time");
    };
    //---------------------------------------------------------------------------------------------------------------

    const updateFromDateValueAtIndex = (value, index) => {
        setDateValueMultiFrom((prevArray) => {
            const newArray = [...prevArray]; // Create a copy of the array
            newArray[index] = value; // Update value at the specified index
            return newArray; // Return the updated array
        });
        handleDataChange(value, index, "Date Multi Span", "fromdate");
    };

    const updateToDateValueAtIndex = (value, index) => {
        setDateValueMultiTo((prevArray) => {
            const newArray = [...prevArray]; // Create a copy of the array
            newArray[index] = value; // Update value at the specified index
            return newArray; // Return the updated array
        });
        handleDataChange(value, index, "Date Multi Span", "todate");
    };
    //---------------------------------------------------------------------------------------------------------------------------------
    const updateDateValueAtIndex = (value, index) => {
        setDateValueRandom((prevArray) => {
            const newArray = [...prevArray]; // Create a copy of the array
            newArray[index] = value; // Update value at the specified index
            return newArray; // Return the updated array
        });
        handleDataChange(value, index, "Date Multi Random Time", "date");
    };

    const updateTimeValueAtIndex = (value, index) => {
        setTimeValueRandom((prevArray) => {
            const newArray = [...prevArray]; // Create a copy of the array
            newArray[index] = value; // Update value at the specified index
            return newArray; // Return the updated array
        });
        handleDataChange(value, index, "Date Multi Random Time", "time");
    };
    //---------------------------------------------------------------------------------------------------------------------------------------

    const updateFirstDateValuesAtIndex = (value, index) => {
        setFirstDateValue((prevArray) => {
            const newArray = [...prevArray]; // Create a copy of the array
            newArray[index] = value; // Update value at the specified index
            return newArray; // Return the updated array
        });
        handleDataChange(value, index, "Date Multi Span Time", "fromdate");
    };

    const updateFirstTimeValuesAtIndex = (value, index) => {
        setFirstTimeValue((prevArray) => {
            const newArray = [...prevArray]; // Create a copy of the array
            newArray[index] = value; // Update value at the specified index
            return newArray; // Return the updated array
        });
        handleDataChange(value, index, "Date Multi Span Time", "fromtime");
    };

    const updateSecondDateValuesAtIndex = (value, index) => {
        setSecondDateValue((prevArray) => {
            const newArray = [...prevArray]; // Create a copy of the array
            newArray[index] = value; // Update value at the specified index
            return newArray; // Return the updated array
        });
        handleDataChange(value, index, "Date Multi Span Time", "todate");
    };

    const updateSecondTimeValuesAtIndex = (value, index) => {
        setSecondTimeValue((prevArray) => {
            const newArray = [...prevArray]; // Create a copy of the array
            newArray[index] = value; // Update value at the specified index
            return newArray; // Return the updated array
        });
        handleDataChange(value, index, "Date Multi Span Time", "totime");
    };

    //------------------------------------------------------------------------------------------------------------

    const handleDataChange = (e, index, from, sub) => {
        let getData;
        let finalData;
        let updatedTodos;
        switch (from) {
            case "Check Box":
                getData = groupDetails[index];
                finalData = {
                    ...getData,
                    lastcheck: e,
                };

                updatedTodos = [...groupDetails];
                updatedTodos[index] = finalData;
                setGroupDetails(updatedTodos);
                break;
            case "Text Box":
                getData = groupDetails[index];
                finalData = {
                    ...getData,
                    data: e.target.value,
                };

                updatedTodos = [...groupDetails];
                updatedTodos[index] = finalData;
                setGroupDetails(updatedTodos);
                break;
            case "Text Box-number":
                getData = groupDetails[index];
                finalData = {
                    ...getData,
                    data: e.target.value,
                };

                updatedTodos = [...groupDetails];
                updatedTodos[index] = finalData;
                setGroupDetails(updatedTodos);
                break;
            case "Text Box-alpha":
                getData = groupDetails[index];
                finalData = {
                    ...getData,
                    data: e.target.value,
                };

                updatedTodos = [...groupDetails];
                updatedTodos[index] = finalData;
                setGroupDetails(updatedTodos);
                break;
            case "Text Box-alphanumeric":
                getData = groupDetails[index];
                finalData = {
                    ...getData,
                    data: e.target.value,
                };

                updatedTodos = [...groupDetails];
                updatedTodos[index] = finalData;
                setGroupDetails(updatedTodos);
                break;
            case "Attachments":
                getData = groupDetails[index];
                finalData = {
                    ...getData,
                    files: e,
                };

                updatedTodos = [...groupDetails];
                updatedTodos[index] = finalData;
                setGroupDetails(updatedTodos);
                break;
            case "Pre-Value":
                break;
            case "Date":
                getData = groupDetails[index];
                finalData = {
                    ...getData,
                    data: e.target.value,
                };

                updatedTodos = [...groupDetails];
                updatedTodos[index] = finalData;
                setGroupDetails(updatedTodos);
                break;
            case "Time":
                getData = groupDetails[index];
                finalData = {
                    ...getData,
                    data: e.target.value,
                };

                updatedTodos = [...groupDetails];
                updatedTodos[index] = finalData;
                setGroupDetails(updatedTodos);
                break;
            case "DateTime":
                if (sub == "date") {
                    getData = groupDetails[index];
                    finalData = {
                        ...getData,
                        data: `${e} ${timeValue[index]}`,
                    };

                    updatedTodos = [...groupDetails];
                    updatedTodos[index] = finalData;
                    setGroupDetails(updatedTodos);
                } else {
                    getData = groupDetails[index];
                    finalData = {
                        ...getData,
                        data: `${dateValue[index]} ${e}`,
                    };

                    updatedTodos = [...groupDetails];
                    updatedTodos[index] = finalData;
                    setGroupDetails(updatedTodos);
                }

                break;
            case "Date Multi Span":
                if (sub == "fromdate") {
                    getData = groupDetails[index];
                    finalData = {
                        ...getData,
                        data: `${e} ${dateValueMultiTo[index]}`,
                    };

                    updatedTodos = [...groupDetails];
                    updatedTodos[index] = finalData;
                    setGroupDetails(updatedTodos);
                } else {
                    getData = groupDetails[index];
                    finalData = {
                        ...getData,
                        data: `${dateValueMultiFrom[index]} ${e}`,
                    };

                    updatedTodos = [...groupDetails];
                    updatedTodos[index] = finalData;
                    setGroupDetails(updatedTodos);
                }
                break;
            case "Date Multi Span Time":
                if (sub == "fromdate") {
                    getData = groupDetails[index];
                    finalData = {
                        ...getData,
                        data: `${e} ${firstTimeValue[index]}/${secondDateValue[index]} ${secondTimeValue[index]}`,
                    };

                    updatedTodos = [...groupDetails];
                    updatedTodos[index] = finalData;
                    setGroupDetails(updatedTodos);
                } else if (sub == "fromtime") {
                    getData = groupDetails[index];
                    finalData = {
                        ...getData,
                        data: `${firstDateValue[index]} ${e}/${secondDateValue[index]} ${secondTimeValue[index]}`,
                    };

                    updatedTodos = [...groupDetails];
                    updatedTodos[index] = finalData;
                    setGroupDetails(updatedTodos);
                } else if (sub == "todate") {
                    getData = groupDetails[index];
                    finalData = {
                        ...getData,
                        data: `${firstDateValue[index]} ${firstTimeValue[index]}/${e} ${secondTimeValue[index]}`,
                    };

                    updatedTodos = [...groupDetails];
                    updatedTodos[index] = finalData;
                    setGroupDetails(updatedTodos);
                } else {
                    getData = groupDetails[index];
                    finalData = {
                        ...getData,
                        data: `${firstDateValue[index]} ${firstTimeValue[index]}/${secondDateValue[index]} ${e}`,
                    };

                    updatedTodos = [...groupDetails];
                    updatedTodos[index] = finalData;
                    setGroupDetails(updatedTodos);
                }
                break;
            case "Date Multi Random":
                getData = groupDetails[index];
                finalData = {
                    ...getData,
                    data: e.target.value,
                };

                updatedTodos = [...groupDetails];
                updatedTodos[index] = finalData;
                setGroupDetails(updatedTodos);
                break;
            case "Date Multi Random Time":
                if (sub == "date") {
                    getData = groupDetails[index];
                    finalData = {
                        ...getData,
                        data: `${e} ${timeValueRandom[index]}`,
                    };

                    updatedTodos = [...groupDetails];
                    updatedTodos[index] = finalData;
                    setGroupDetails(updatedTodos);
                } else {
                    getData = groupDetails[index];
                    finalData = {
                        ...getData,
                        data: `${dateValueRandom[index]} ${e}`,
                    };

                    updatedTodos = [...groupDetails];
                    updatedTodos[index] = finalData;
                    setGroupDetails(updatedTodos);
                }
                break;
            case "Radio":
                getData = groupDetails[index];
                finalData = {
                    ...getData,
                    data: e.target.value,
                };

                updatedTodos = [...groupDetails];
                updatedTodos[index] = finalData;
                setGroupDetails(updatedTodos);
                break;
        }
    };

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
                },
                index,
                "Attachments"
            );
        };
    };
    const [singleDataId, setSingleDataId] = useState("");
    const getCodeNew = async (details) => {
        setGetDetails(details);
        try {
            let res = await axios.get(SERVICE.MYCHECKLIST);
            setDatasAvailedDB(res?.data?.mychecklist);
            let searchItem = res?.data?.mychecklist?.find(
                (item) =>
                    item.commonid == details?.id &&
                    item.module == "Human Resources" &&
                    item.submodule == "HR" &&
                    item.mainpage == "Employee" &&
                    item.subpage == "Employee Status Details" &&
                    item.subsubpage == "Long Absent Restriction List" &&
                    item.status.toLowerCase() !== "completed"
            );
            if (!searchItem) {
                setPopupContentMalert("Please Assign Checklist at My CheckList Page");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
                // navigate("/interview/myinterviewchecklist");
                // window.open("/interview/myinterviewchecklist", "_blank");
            } else if (searchItem) {
                setAssignDetails(searchItem);
                setSingleDataId(searchItem?._id);
                setPostID(searchItem?.commonid);

                setGroupDetails(
                    searchItem?.groups?.map((data) => ({
                        ...data,
                        lastcheck: false,
                    }))
                );

                setIsCheckedList(searchItem?.groups?.map((data) => data.lastcheck));

                let forFillDetails = searchItem?.groups?.map((data) => {
                    if (data.checklist === "Date Multi Random Time") {
                        if (data?.data && data?.data !== "") {
                            const [date, time] = data?.data?.split(" ");
                            return { date, time };
                        }
                    } else {
                        return { date: "0", time: "0" };
                    }
                });

                let forDateSpan = searchItem?.groups?.map((data) => {
                    if (data.checklist === "Date Multi Span") {
                        if (data?.data && data?.data !== "") {
                            const [fromdate, todate] = data?.data?.split(" ");
                            return { fromdate, todate };
                        }
                    } else {
                        return { fromdate: "0", todate: "0" };
                    }
                });

                let forDateTime = searchItem?.groups?.map((data) => {
                    if (data.checklist === "DateTime") {
                        if (data?.data && data?.data !== "") {
                            const [date, time] = data?.data?.split(" ");
                            return { date, time };
                        }
                    } else {
                        return { date: "0", time: "0" };
                    }
                });

                let forDateMultiSpanTime = searchItem?.groups?.map((data) => {
                    if (data.checklist === "Date Multi Span Time") {
                        if (data?.data && data?.data !== "") {
                            const [from, to] = data?.data?.split("/");
                            const [fromdate, fromtime] = from?.split(" ");
                            const [todate, totime] = to?.split(" ");
                            return { fromdate, fromtime, todate, totime };
                        }
                    } else {
                        return { fromdate: "0", fromtime: "0", todate: "0", totime: "0" };
                    }
                });

                setDateValueMultiFrom(forDateSpan?.map((item) => item?.fromdate));
                setDateValueMultiTo(forDateSpan?.map((item) => item?.todate));

                setDateValueRandom(forFillDetails?.map((item) => item?.date));
                setTimeValueRandom(forFillDetails?.map((item) => item?.time));

                setDateValue(forDateTime?.map((item) => item?.date));
                setTimeValue(forDateTime?.map((item) => item?.time));

                setFirstDateValue(forDateMultiSpanTime?.map((item) => item?.fromdate));
                setFirstTimeValue(forDateMultiSpanTime?.map((item) => item?.fromtime));
                setSecondDateValue(forDateMultiSpanTime?.map((item) => item?.todate));
                setSecondTimeValue(forDateMultiSpanTime?.map((item) => item?.totime));

                setDisableInput(new Array(details?.groups?.length).fill(true));
                handleClickOpenEditCheckList();
            }
            // else {
            //   setIsCheckList(false);
            //   handleAllowLogin(details);
            // }
        } catch (err) {
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };
    let name = "create";
    const [statusOpen, setStatusOpen] = useState(false);
    const handleStatusOpen = () => {
        setStatusOpen(true);
    };
    const handleStatusClose = () => {
        setStatusOpen(false);
    };
    const sendEditStatus = async () => {
        try {
            setBtnloading(getDetails?.id);
            let res = await axios.put(
                `${SERVICE.USER_SINGLE_PWD}/${getDetails?.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    longleaveabsentaprooveddate: dateArray,
                }
            );
            await sendRequest();
            setPopupContent("Allowed Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setBtnloading("");
            handleStatusClose();
        } catch (err) {
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };

    const sendRequestCheckList = async () => {
        let combinedGroups = groupDetails?.map((data) => {
            let check =
                (data.data !== undefined && data.data !== "") ||
                data.files !== undefined;

            if (check) {
                return {
                    ...data,
                    completedby: completedbyName,
                    completedat: new Date(),
                };
            } else {
                return {
                    ...data,
                    completedby: "",
                    completedat: "",
                };
            }
        });

        try {
            let assignbranches = await axios.put(
                `${SERVICE.MYCHECKLIST_SINGLE}/${assignDetails?._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    commonid: assignDetails?.commonid,
                    module: assignDetails?.module,
                    submodule: assignDetails?.submodule,
                    mainpage: assignDetails?.mainpage,
                    subpage: assignDetails?.subpage,
                    subsubpage: assignDetails?.subsubpage,
                    category: assignDetails?.category,
                    subcategory: assignDetails?.subcategory,
                    candidatename: assignDetails?.fullname,
                    longleaveabsentaprooveddatechecklist: dateArray,
                    status: "Completed",
                    groups: combinedGroups,
                    updatedby: [
                        ...assignDetails?.updatedby,
                        {
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),
                        },
                    ],
                }
            );
            handleCloseModEditCheckList();
            setIsCheckedListOverall(false);
            sendEditStatus();
        } catch (err) {
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };

    const handleCheckListSubmit = async () => {
        let nextStep = isCheckedList.every((item) => item == true);

        if (!nextStep) {
            setPopupContentMalert("Please Check All the Fields!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else {
            sendRequestCheckList();
        }
    };

    const [isCheckedList, setIsCheckedList] = useState([]);
    const [isCheckedListOverall, setIsCheckedListOverall] = useState(false);
    const overallCheckListChange = () => {
        let newArrayChecked = isCheckedList?.map(
            (item) => (item = !isCheckedListOverall)
        );

        let returnOverall = groupDetails?.map((row) => {
            {
                if (row.checklist === "DateTime") {
                    if (
                        ((row.data !== undefined && row.data !== "") ||
                            row.files !== undefined) &&
                        row.data?.length === 16
                    ) {
                        return true;
                    } else {
                        return false;
                    }
                } else if (row.checklist === "Date Multi Span") {
                    if (
                        ((row.data !== undefined && row.data !== "") ||
                            row.files !== undefined) &&
                        row.data?.length === 21
                    ) {
                        return true;
                    } else {
                        return false;
                    }
                } else if (row.checklist === "Date Multi Span Time") {
                    if (
                        ((row.data !== undefined && row.data !== "") ||
                            row.files !== undefined) &&
                        row.data?.length === 33
                    ) {
                        return true;
                    } else {
                        return false;
                    }
                } else if (row.checklist === "Date Multi Random Time") {
                    if (
                        ((row.data !== undefined && row.data !== "") ||
                            row.files !== undefined) &&
                        row.data?.length === 16
                    ) {
                        return true;
                    } else {
                        return false;
                    }
                } else if (
                    (row.data !== undefined && row.data !== "") ||
                    row.files !== undefined
                ) {
                    return true;
                } else {
                    return false;
                }
            }
        });

        let allcondition = returnOverall.every((item) => item == true);

        if (allcondition) {
            setIsCheckedList(newArrayChecked);
            setIsCheckedListOverall(!isCheckedListOverall);
        } else {
            setPopupContentMalert("Please Fill all the Fields!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
    };
    const handleCheckboxChange = (index) => {
        const newCheckedState = [...isCheckedList];
        newCheckedState[index] = !newCheckedState[index];

        let currentItem = groupDetails[index];

        let data = () => {
            if (currentItem.checklist === "DateTime") {
                if (
                    ((currentItem.data !== undefined && currentItem.data !== "") ||
                        currentItem.files !== undefined) &&
                    currentItem.data?.length === 16
                ) {
                    return true;
                } else {
                    return false;
                }
            } else if (currentItem.checklist === "Date Multi Span") {
                if (
                    ((currentItem.data !== undefined && currentItem.data !== "") ||
                        currentItem.files !== undefined) &&
                    currentItem.data?.length === 21
                ) {
                    return true;
                } else {
                    return false;
                }
            } else if (currentItem.checklist === "Date Multi Span Time") {
                if (
                    ((currentItem.data !== undefined && currentItem.data !== "") ||
                        currentItem.files !== undefined) &&
                    currentItem.data?.length === 33
                ) {
                    return true;
                } else {
                    return false;
                }
            } else if (currentItem.checklist === "Date Multi Random Time") {
                if (
                    ((currentItem.data !== undefined && currentItem.data !== "") ||
                        currentItem.files !== undefined) &&
                    currentItem.data?.length === 16
                ) {
                    return true;
                } else {
                    return false;
                }
            } else if (
                (currentItem.data !== undefined && currentItem.data !== "") ||
                currentItem.files !== undefined
            ) {
                return true;
            } else {
                return false;
            }
        };

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
            setPopupContentMalert("Please Fill all the Fields!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
    };

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
        { label: "Department", value: "Department" },
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
        setEmployees([]);

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
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (selectedOptionsCompany?.length === 0) {
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
            ["Individual", "Branch", "Unit", "Team"]?.includes(filterState?.type) &&
            selectedOptionsBranch?.length === 0
        ) {
            setPopupContentMalert("Please Select Branch!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            ["Individual", "Unit", "Team"]?.includes(filterState?.type) &&
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
        } else {
            sendRequest();
        }
    };


    console.log(employees, "emps")
    const sendRequest = async () => {
        setPageName(!pageName);
        setLoader(true);
        setisBtnFilter(true);
        setFilterLoader(true);
        setTableLoader(true);
        try {
            let subprojectscreate = await axios.post(
                SERVICE.GETFILTEREUSERDATALONGABSEND_COMPLETED,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    company:
                        valueCompanyCat?.length > 0 ? valueCompanyCat : allAssignCompany,
                    branch: valueBranchCat?.length > 0 ? valueBranchCat : allAssignBranch,
                    unit: valueUnitCat?.length > 0 ? valueUnitCat : allAssignUnit,
                    team: valueTeamCat,
                    department: valueDepartmentCat,
                    employee: valueEmployeeCat,
                    filterin: selectedUserType,

                    module: "Human Resources",
                    submodule: "HR",
                    mainpage: "Employee",
                    subpage: "Employee Status Details",
                    subsubpage: "Long Absent Restriction List",
                    status: "completed",
                }
            );
            let ans = subprojectscreate?.data?.filterallDatauser?.filter((item) =>
                accessbranch.some(
                    (branch) =>
                        branch.company === item.company &&
                        branch.branch === item.branch &&
                        branch.unit === item.unit
                )
            );

            setEmployees(ans);
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
            <Headtitle title={"Long Absent Restriction"} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Long Absent Restrcition Completed List"
                modulename="Human Resources"
                submodulename="HR"
                mainpagename="Employee"
                subpagename="Employee Status Details"
                subsubpagename="Long Absent Restriction Completed List"
            />

            {isUserRoleCompare?.includes("alongabsentrestrictioncompletedlist") && (
                <>
                    <Box sx={userStyle.dialogbox}>
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography sx={userStyle.importheadtext}>
                                        Long Absent Restrcition Completed List
                                    </Typography>
                                </Grid>

                                <Grid item xs={12}>
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
                                                            ?.filter(
                                                                (u) =>
                                                                    valueCompanyCat?.includes(u.company) &&
                                                                    valueBranchCat?.includes(u.branch) &&
                                                                    valueUnitCat?.includes(u.unit) &&
                                                                    valueTeamCat?.includes(u.team)
                                                            )
                                                            ?.map((u) => ({
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
                    {isUserRoleCompare?.includes("llongabsentrestrictioncompletedlist") && (
                        <>
                            <Box sx={userStyle.container}>
                                {/* ******************************************************EXPORT Buttons****************************************************** */}
                                <Grid container spacing={2}>
                                    <Grid item xs={8}>
                                        <Typography sx={userStyle.SubHeaderText}>
                                            Long Absent Restriction Completed List
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        {isUserRoleCompare?.includes("lmychecklist") && (
                                            <>
                                                <Link
                                                    to="/interview/myinterviewchecklist"
                                                    style={{
                                                        textDecoration: "none",
                                                        color: "white",
                                                        float: "right",
                                                    }}
                                                    target="_blank"
                                                >
                                                    <Button variant="contained">My Check List</Button>
                                                </Link>
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
                                                "excellongabsentrestrictioncompletedlist"
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
                                                "csvlongabsentrestrictioncompletedlist"
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
                                                "printlongabsentrestrictioncompletedlist"
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
                                                "pdflongabsentrestrictioncompletedlist"
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
                                                "imagelongabsentrestrictioncompletedlist"
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
                                    searchQuery={searchedString}
                                    handleShowAllColumns={handleShowAllColumns}
                                    setFilteredRowData={setFilteredRowData}
                                    filteredRowData={filteredRowData}
                                    setFilteredChanges={setFilteredChanges}
                                    filteredChanges={filteredChanges}
                                    gridRefTableImg={gridRefTableImg}
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
                filteredDataTwo={filteredData ?? []}
                itemsTwo={items ?? []}
                filename={"Long Absent Restrcition Completed List"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />

            {/* EXTERNAL COMPONENTS -------------- END */}

            <Dialog
                open={isEditOpenCheckList}
                onClose={handleCloseModEditCheckList}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="xl"
                fullWidth={true}
                sx={{
                    overflow: "visible",
                    "& .MuiPaper-root": {
                        overflow: "auto",
                    },
                }}
            >
                <Box sx={{ padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.SubHeaderText}>My Check List</Typography>
                        <br />
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={12} xs={12} sm={12}>
                                <FormControl
                                    fullWidth
                                    size="small"
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        border: "1px solid black",
                                        borderRadius: "20px",
                                    }}
                                >
                                    <Typography sx={{ fontSize: "1rem", textAlign: "center" }}>
                                        Employee Name:{" "}
                                        <span
                                            style={{
                                                fontWeight: "500",
                                                fontSize: "1.2rem",
                                                display: "inline-block",
                                                textAlign: "center",
                                            }}
                                        >
                                            {" "}
                                            {`${getDetails?.companyname}`}
                                        </span>
                                    </Typography>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br />
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ fontSize: "1.2rem" }}>
                                            <Checkbox
                                                onChange={() => {
                                                    overallCheckListChange();
                                                }}
                                                checked={isCheckedListOverall}
                                            />
                                        </TableCell>
                                        <TableCell style={{ fontSize: "1.2rem" }}>
                                            Details
                                        </TableCell>
                                        <TableCell style={{ fontSize: "1.2rem" }}>Field</TableCell>
                                        <TableCell style={{ fontSize: "1.2rem" }}>
                                            Allotted To
                                        </TableCell>
                                        <TableCell style={{ fontSize: "1.2rem" }}>
                                            Completed By
                                        </TableCell>
                                        <TableCell style={{ fontSize: "1.2rem" }}>
                                            Completed At
                                        </TableCell>
                                        <TableCell style={{ fontSize: "1.2rem" }}>Status</TableCell>
                                        <TableCell style={{ fontSize: "1.2rem" }}>Action</TableCell>

                                        <TableCell style={{ fontSize: "1.2rem" }}>
                                            Category
                                        </TableCell>
                                        <TableCell style={{ fontSize: "1.2rem" }}>
                                            Sub Category
                                        </TableCell>

                                        {/* Add more table headers as needed */}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {groupDetails?.map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell style={{ fontSize: "1.2rem" }}>
                                                <Checkbox
                                                    onChange={() => {
                                                        handleCheckboxChange(index);
                                                    }}
                                                    checked={isCheckedList[index]}
                                                />
                                            </TableCell>

                                            <TableCell>{row.details}</TableCell>
                                            {(() => {
                                                switch (row.checklist) {
                                                    case "Text Box":
                                                        return (
                                                            <TableCell>
                                                                <OutlinedInput
                                                                    style={{ height: "32px" }}
                                                                    value={row.data}
                                                                    // disabled={disableInput[index]}
                                                                    onChange={(e) => {
                                                                        handleDataChange(e, index, "Text Box");
                                                                    }}
                                                                />
                                                            </TableCell>
                                                        );
                                                    case "Text Box-number":
                                                        return (
                                                            <TableCell>
                                                                <Input
                                                                    value={row.data}
                                                                    style={{ height: "32px" }}
                                                                    type="number"
                                                                    onChange={(e) => {
                                                                        handleDataChange(
                                                                            e,
                                                                            index,
                                                                            "Text Box-number"
                                                                        );
                                                                    }}
                                                                />
                                                            </TableCell>
                                                        );
                                                    case "Text Box-alpha":
                                                        return (
                                                            <TableCell>
                                                                <OutlinedInput
                                                                    style={{ height: "32px" }}
                                                                    value={row.data}
                                                                    onChange={(e) => {
                                                                        const inputValue = e.target.value;
                                                                        if (/^[a-zA-Z]*$/.test(inputValue)) {
                                                                            handleDataChange(
                                                                                e,
                                                                                index,
                                                                                "Text Box-alpha"
                                                                            );
                                                                        }
                                                                    }}
                                                                />
                                                            </TableCell>
                                                        );
                                                    case "Text Box-alphanumeric":
                                                        return (
                                                            <TableCell>
                                                                <OutlinedInput
                                                                    style={{ height: "32px" }}
                                                                    value={row.data}
                                                                    onChange={(e) => {
                                                                        const inputValue = e.target.value;
                                                                        if (/^[a-zA-Z0-9]*$/.test(inputValue)) {
                                                                            handleDataChange(
                                                                                e,
                                                                                index,
                                                                                "Text Box-alphanumeric"
                                                                            );
                                                                        }
                                                                    }}
                                                                    inputProps={{ pattern: "[A-Za-z0-9]*" }}
                                                                />
                                                            </TableCell>
                                                        );
                                                    case "Attachments":
                                                        return (
                                                            <TableCell>
                                                                <div>
                                                                    <InputLabel sx={{ m: 1 }}>File</InputLabel>

                                                                    <div>
                                                                        <Box
                                                                            sx={{
                                                                                display: "flex",
                                                                                marginTop: "10px",
                                                                                gap: "10px",
                                                                            }}
                                                                        >
                                                                            <Box item md={4} sm={4}>
                                                                                <section>
                                                                                    <input
                                                                                        type="file"
                                                                                        accept="*/*"
                                                                                        id={index}
                                                                                        onChange={(e) => {
                                                                                            handleChangeImage(e, index);
                                                                                        }}
                                                                                        style={buttonStyles.buttonsubmit}
                                                                                    />
                                                                                    <label htmlFor={index}>
                                                                                        <Typography
                                                                                            sx={buttonStyles.buttonsubmit}
                                                                                        >
                                                                                            Upload
                                                                                        </Typography>
                                                                                    </label>
                                                                                    <br />
                                                                                </section>
                                                                            </Box>

                                                                            <Box item md={4} sm={4}>
                                                                                <Button
                                                                                    onClick={showWebcam}
                                                                                    variant="contained"
                                                                                    sx={buttonStyles.buttonsubmit}
                                                                                >
                                                                                    <CameraAltIcon />
                                                                                </Button>
                                                                            </Box>
                                                                        </Box>
                                                                        {row.files && (
                                                                            <Grid container spacing={2}>
                                                                                <Grid item lg={8} md={8} sm={8} xs={8}>
                                                                                    <Typography>
                                                                                        {row.files.name}
                                                                                    </Typography>
                                                                                </Grid>
                                                                                <Grid
                                                                                    item
                                                                                    sx={{ cursor: "pointer" }}
                                                                                    lg={2}
                                                                                    md={2}
                                                                                    sm={2}
                                                                                    xs={2}
                                                                                    onClick={() =>
                                                                                        renderFilePreviewEdit(row.files)
                                                                                    }
                                                                                >
                                                                                    <VisibilityOutlinedIcon
                                                                                        sx={buttonStyles.buttonview}
                                                                                    />
                                                                                </Grid>
                                                                                <Grid item lg={1} md={1} sm={1} xs={1}>
                                                                                    <Button
                                                                                        sx={buttonStyles.buttondelete}
                                                                                        onClick={() =>
                                                                                            handleFileDeleteEdit(index)
                                                                                        }
                                                                                    >
                                                                                        <DeleteIcon />
                                                                                    </Button>
                                                                                </Grid>
                                                                            </Grid>
                                                                        )}
                                                                    </div>
                                                                    <Dialog
                                                                        open={isWebcamOpen}
                                                                        onClose={webcamClose}
                                                                        aria-labelledby="alert-dialog-title"
                                                                        aria-describedby="alert-dialog-description"
                                                                    >
                                                                        <DialogContent
                                                                            sx={{
                                                                                textAlign: "center",
                                                                                alignItems: "center",
                                                                            }}
                                                                        >
                                                                            <Webcamimage
                                                                                getImg={getImg}
                                                                                setGetImg={setGetImg}
                                                                                capturedImages={capturedImages}
                                                                                valNum={valNum}
                                                                                setValNum={setValNum}
                                                                                name={name}
                                                                            />
                                                                        </DialogContent>
                                                                        <DialogActions>
                                                                            <Button
                                                                                variant="contained"
                                                                                sx={buttonStyles.buttonsubmit}
                                                                                onClick={webcamDataStore}
                                                                            >
                                                                                OK
                                                                            </Button>
                                                                            <Button
                                                                                variant="contained"
                                                                                sx={buttonStyles.btncancel}
                                                                                onClick={webcamClose}
                                                                            >
                                                                                CANCEL
                                                                            </Button>
                                                                        </DialogActions>
                                                                    </Dialog>
                                                                </div>
                                                            </TableCell>
                                                        );
                                                    case "Pre-Value":
                                                        return (
                                                            <TableCell>
                                                                <Typography>{row?.data}</Typography>
                                                            </TableCell>
                                                        );
                                                    case "Date":
                                                        return (
                                                            <TableCell>
                                                                <OutlinedInput
                                                                    style={{ height: "32px" }}
                                                                    type="date"
                                                                    value={row.data}
                                                                    onChange={(e) => {
                                                                        handleDataChange(e, index, "Date");
                                                                    }}
                                                                />
                                                            </TableCell>
                                                        );
                                                    case "Time":
                                                        return (
                                                            <TableCell>
                                                                <OutlinedInput
                                                                    style={{ height: "32px" }}
                                                                    type="time"
                                                                    value={row.data}
                                                                    onChange={(e) => {
                                                                        handleDataChange(e, index, "Time");
                                                                    }}
                                                                />
                                                            </TableCell>
                                                        );
                                                    case "DateTime":
                                                        return (
                                                            <TableCell>
                                                                <Stack direction="row" spacing={2}>
                                                                    <OutlinedInput
                                                                        style={{ height: "32px" }}
                                                                        type="date"
                                                                        value={dateValue[index]}
                                                                        onChange={(e) => {
                                                                            updateDateValuesAtIndex(
                                                                                e.target.value,
                                                                                index
                                                                            );
                                                                        }}
                                                                    />
                                                                    <OutlinedInput
                                                                        type="time"
                                                                        style={{ height: "32px" }}
                                                                        value={timeValue[index]}
                                                                        onChange={(e) => {
                                                                            updateTimeValuesAtIndex(
                                                                                e.target.value,
                                                                                index
                                                                            );
                                                                        }}
                                                                    />
                                                                </Stack>
                                                            </TableCell>
                                                        );
                                                    case "Date Multi Span":
                                                        return (
                                                            <TableCell>
                                                                <Stack direction="row" spacing={2}>
                                                                    <OutlinedInput
                                                                        style={{ height: "32px" }}
                                                                        type="date"
                                                                        value={dateValueMultiFrom[index]}
                                                                        onChange={(e) => {
                                                                            updateFromDateValueAtIndex(
                                                                                e.target.value,
                                                                                index
                                                                            );
                                                                        }}
                                                                    />
                                                                    <OutlinedInput
                                                                        type="date"
                                                                        style={{ height: "32px" }}
                                                                        value={dateValueMultiTo[index]}
                                                                        onChange={(e) => {
                                                                            updateToDateValueAtIndex(
                                                                                e.target.value,
                                                                                index
                                                                            );
                                                                        }}
                                                                    />
                                                                </Stack>
                                                            </TableCell>
                                                        );
                                                    case "Date Multi Span Time":
                                                        return (
                                                            <TableCell>
                                                                <div
                                                                    style={{
                                                                        display: "flex",
                                                                        flexDirection: "column",
                                                                        gap: "10px",
                                                                    }}
                                                                >
                                                                    <Stack direction="row" spacing={2}>
                                                                        <OutlinedInput
                                                                            style={{ height: "32px" }}
                                                                            type="date"
                                                                            value={firstDateValue[index]}
                                                                            onChange={(e) => {
                                                                                updateFirstDateValuesAtIndex(
                                                                                    e.target.value,
                                                                                    index
                                                                                );
                                                                            }}
                                                                        />
                                                                        <OutlinedInput
                                                                            type="time"
                                                                            style={{ height: "32px" }}
                                                                            value={firstTimeValue[index]}
                                                                            onChange={(e) => {
                                                                                updateFirstTimeValuesAtIndex(
                                                                                    e.target.value,
                                                                                    index
                                                                                );
                                                                            }}
                                                                        />
                                                                    </Stack>
                                                                    <Stack direction="row" spacing={2}>
                                                                        <OutlinedInput
                                                                            type="date"
                                                                            style={{ height: "32px" }}
                                                                            value={secondDateValue[index]}
                                                                            onChange={(e) => {
                                                                                updateSecondDateValuesAtIndex(
                                                                                    e.target.value,
                                                                                    index
                                                                                );
                                                                            }}
                                                                        />
                                                                        <OutlinedInput
                                                                            style={{ height: "32px" }}
                                                                            type="time"
                                                                            value={secondTimeValue[index]}
                                                                            onChange={(e) => {
                                                                                updateSecondTimeValuesAtIndex(
                                                                                    e.target.value,
                                                                                    index
                                                                                );
                                                                            }}
                                                                        />
                                                                    </Stack>
                                                                </div>
                                                            </TableCell>
                                                        );
                                                    case "Date Multi Random":
                                                        return (
                                                            <TableCell>
                                                                <OutlinedInput
                                                                    style={{ height: "32px" }}
                                                                    type="date"
                                                                    value={row.data}
                                                                    onChange={(e) => {
                                                                        handleDataChange(
                                                                            e,
                                                                            index,
                                                                            "Date Multi Random"
                                                                        );
                                                                    }}
                                                                />
                                                            </TableCell>
                                                        );
                                                    case "Date Multi Random Time":
                                                        return (
                                                            <TableCell>
                                                                <Stack direction="row" spacing={2}>
                                                                    <OutlinedInput
                                                                        style={{ height: "32px" }}
                                                                        type="date"
                                                                        value={dateValueRandom[index]}
                                                                        onChange={(e) => {
                                                                            updateDateValueAtIndex(
                                                                                e.target.value,
                                                                                index
                                                                            );
                                                                        }}
                                                                    />
                                                                    <OutlinedInput
                                                                        type="time"
                                                                        style={{ height: "32px" }}
                                                                        value={timeValueRandom[index]}
                                                                        onChange={(e) => {
                                                                            updateTimeValueAtIndex(
                                                                                e.target.value,
                                                                                index
                                                                            );
                                                                        }}
                                                                    />
                                                                </Stack>
                                                            </TableCell>
                                                        );
                                                    case "Radio":
                                                        return (
                                                            <TableCell>
                                                                <FormControl component="fieldset">
                                                                    <RadioGroup
                                                                        value={row.data}
                                                                        sx={{
                                                                            display: "flex",
                                                                            flexDirection: "row !important",
                                                                        }}
                                                                        onChange={(e) => {
                                                                            handleDataChange(e, index, "Radio");
                                                                        }}
                                                                    >
                                                                        <FormControlLabel
                                                                            value="No"
                                                                            control={<Radio />}
                                                                            label="No"
                                                                        />
                                                                        <FormControlLabel
                                                                            value="Yes"
                                                                            control={<Radio />}
                                                                            label="Yes"
                                                                        />
                                                                    </RadioGroup>
                                                                </FormControl>
                                                            </TableCell>
                                                        );

                                                    default:
                                                        return <TableCell></TableCell>; // Default case
                                                }
                                            })()}
                                            <TableCell>
                                                <span>
                                                    {row?.employee &&
                                                        row?.employee?.map((data, index) => (
                                                            <Typography key={index} variant="body1">{`${index + 1
                                                                }.${data}, `}</Typography>
                                                        ))}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <Typography>{row?.completedby}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                {row.completedat &&
                                                    moment(row.completedat).format(
                                                        "DD-MM-YYYY hh:mm:ss A"
                                                    )}
                                            </TableCell>
                                            <TableCell>
                                                {row.checklist === "DateTime" ? (
                                                    ((row.data !== undefined && row.data !== "") ||
                                                        row.files !== undefined) &&
                                                        row.data?.length === 16 ? (
                                                        <Typography>Completed</Typography>
                                                    ) : (
                                                        <Typography>Pending</Typography>
                                                    )
                                                ) : row.checklist === "Date Multi Span" ? (
                                                    ((row.data !== undefined && row.data !== "") ||
                                                        row.files !== undefined) &&
                                                        row.data?.length === 21 ? (
                                                        <Typography>Completed</Typography>
                                                    ) : (
                                                        <Typography>Pending</Typography>
                                                    )
                                                ) : row.checklist === "Date Multi Span Time" ? (
                                                    ((row.data !== undefined && row.data !== "") ||
                                                        row.files !== undefined) &&
                                                        row.data?.length === 33 ? (
                                                        <Typography>Completed</Typography>
                                                    ) : (
                                                        <Typography>Pending</Typography>
                                                    )
                                                ) : row.checklist === "Date Multi Random Time" ? (
                                                    ((row.data !== undefined && row.data !== "") ||
                                                        row.files !== undefined) &&
                                                        row.data?.length === 16 ? (
                                                        <Typography>Completed</Typography>
                                                    ) : (
                                                        <Typography>Pending</Typography>
                                                    )
                                                ) : (row.data !== undefined && row.data !== "") ||
                                                    row.files !== undefined ? (
                                                    <Typography>Completed</Typography>
                                                ) : (
                                                    <Typography>Pending</Typography>
                                                )}
                                            </TableCell>

                                            <TableCell>
                                                {row.checklist === "DateTime" ? (
                                                    ((row.data !== undefined && row.data !== "") ||
                                                        row.files !== undefined) &&
                                                        row.data?.length === 16 ? (
                                                        <>
                                                            <IconButton
                                                                sx={{ color: "green", cursor: "pointer" }}
                                                                onClick={() => {
                                                                    updateIndividualData(index);
                                                                }}
                                                            >
                                                                <CheckCircleIcon />
                                                            </IconButton>
                                                        </>
                                                    ) : (
                                                        <IconButton
                                                            sx={{ color: "#1565c0", cursor: "pointer" }}
                                                            onClick={() => {
                                                                let itemValue = disableInput[index];
                                                                itemValue = false;
                                                                let spreadData = [...disableInput];
                                                                spreadData[index] = false;
                                                                setDisableInput(spreadData);
                                                            }}
                                                        >
                                                            <CheckCircleIcon />
                                                        </IconButton>
                                                    )
                                                ) : row.checklist === "Date Multi Span" ? (
                                                    ((row.data !== undefined && row.data !== "") ||
                                                        row.files !== undefined) &&
                                                        row.data?.length === 21 ? (
                                                        <>
                                                            <IconButton
                                                                sx={{ color: "green", cursor: "pointer" }}
                                                                onClick={() => {
                                                                    updateIndividualData(index);
                                                                }}
                                                            >
                                                                <CheckCircleIcon />
                                                            </IconButton>
                                                        </>
                                                    ) : (
                                                        <IconButton
                                                            sx={{ color: "#1565c0", cursor: "pointer" }}
                                                            onClick={() => {
                                                                let itemValue = disableInput[index];
                                                                itemValue = false;
                                                                let spreadData = [...disableInput];
                                                                spreadData[index] = false;
                                                                setDisableInput(spreadData);
                                                            }}
                                                        >
                                                            <CheckCircleIcon />
                                                        </IconButton>
                                                    )
                                                ) : row.checklist === "Date Multi Span Time" ? (
                                                    ((row.data !== undefined && row.data !== "") ||
                                                        row.files !== undefined) &&
                                                        row.data?.length === 33 ? (
                                                        <>
                                                            <IconButton
                                                                sx={{ color: "green", cursor: "pointer" }}
                                                                onClick={() => {
                                                                    updateIndividualData(index);
                                                                }}
                                                            >
                                                                <CheckCircleIcon />
                                                            </IconButton>
                                                        </>
                                                    ) : (
                                                        <IconButton
                                                            sx={{ color: "#1565c0", cursor: "pointer" }}
                                                            onClick={() => {
                                                                let itemValue = disableInput[index];
                                                                itemValue = false;
                                                                let spreadData = [...disableInput];
                                                                spreadData[index] = false;
                                                                setDisableInput(spreadData);
                                                            }}
                                                        >
                                                            <CheckCircleIcon />
                                                        </IconButton>
                                                    )
                                                ) : row.checklist === "Date Multi Random Time" ? (
                                                    ((row.data !== undefined && row.data !== "") ||
                                                        row.files !== undefined) &&
                                                        row.data?.length === 16 ? (
                                                        <>
                                                            <IconButton
                                                                sx={{ color: "green", cursor: "pointer" }}
                                                                onClick={() => {
                                                                    updateIndividualData(index);
                                                                }}
                                                            >
                                                                <CheckCircleIcon />
                                                            </IconButton>
                                                        </>
                                                    ) : (
                                                        <IconButton
                                                            sx={{ color: "#1565c0", cursor: "pointer" }}
                                                            onClick={() => {
                                                                let itemValue = disableInput[index];
                                                                itemValue = false;
                                                                let spreadData = [...disableInput];
                                                                spreadData[index] = false;
                                                                setDisableInput(spreadData);
                                                            }}
                                                        >
                                                            <CheckCircleIcon />
                                                        </IconButton>
                                                    )
                                                ) : (row.data !== undefined && row.data !== "") ||
                                                    row.files !== undefined ? (
                                                    <>
                                                        <IconButton
                                                            sx={{ color: "green", cursor: "pointer" }}
                                                            onClick={() => {
                                                                updateIndividualData(index);
                                                            }}
                                                        >
                                                            <CheckCircleIcon />
                                                        </IconButton>
                                                    </>
                                                ) : (
                                                    <IconButton
                                                        sx={{ color: "#1565c0", cursor: "pointer" }}
                                                        onClick={() => {
                                                            let itemValue = disableInput[index];
                                                            itemValue = false;
                                                            let spreadData = [...disableInput];
                                                            spreadData[index] = false;
                                                            setDisableInput(spreadData);
                                                        }}
                                                    >
                                                        <CheckCircleIcon />
                                                    </IconButton>
                                                )}
                                            </TableCell>

                                            <TableCell>{row.category}</TableCell>
                                            <TableCell>{row.subcategory}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <br /> <br /> <br />
                        <Grid container>
                            <Grid item md={1} sm={1}></Grid>
                            <Button
                                variant="contained"
                                onClick={handleCheckListSubmit}
                                sx={buttonStyles.buttonsubmit}
                            >
                                Submit
                            </Button>
                            <Grid item md={1} sm={1}></Grid>
                            <Button
                                sx={buttonStyles.btncancel}
                                onClick={handleCloseModEditCheckList}
                            >
                                Cancel
                            </Button>
                        </Grid>
                    </>
                </Box>
            </Dialog>
        </Box>
    );
}

export default EmployeeDetailCompletedStatus;
