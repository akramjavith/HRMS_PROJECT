import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import LoadingButton from "@mui/lab/LoadingButton";
import {
    Box,
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    FormControl,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Paper,
    Popover,
    Select,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TextField,
    Typography,
    OutlinedInput,
} from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import domtoimage from 'dom-to-image';
import { saveAs } from "file-saver";
import "jspdf-autotable";
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
import { StyledTableCell, StyledTableRow } from "../../components/Table";
import AggregatedSearchBar from "../../components/AggregatedSearchBar";
import AggridTable from "../../components/AggridTable";
import AlertDialog from "../../components/Alert";
import {
    PleaseSelectRow
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
import Selects from "react-select";
import { MultiSelect } from "react-multi-select-component";
import moment from "moment-timezone";


function OverallTypingPracticeResponse() {
    const [isLoading, setIsLoading] = useState(false);



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
        "Speed in wpm",
        "Accuracy in %",
        "Mistakes",
        "Time (MM:SS)",
        "Status",
        "Attended Time",
    ];
    let exportRowValues = [

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
        "speed",
        "accuracy",
        "mistakes",
        "time",
        "status",
        "completedat",
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
    };

    const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
    const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);
    const handleClickOpenalert = () => {
        setIsHandleChange(true);
        if (selectedRows.length === 0) {
            setIsDeleteOpenalert(true);
        } else {
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






    const [employees, setEmployees] = useState([]);
    const [selectedUserType, setSelectedUserType] = useState("Employee");
    const [searchQuery, setSearchQuery] = useState("");
    const {
        isUserRoleAccess,
        isUserRoleCompare,
        isAssignBranch,
        pageName,
        setPageName,
        buttonStyles,
        allTeam,
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

    let username = isUserRoleAccess.username;

    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");



    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "OverallTypingPracticeResponse.png");
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




    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        actions: true,

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
        speed: true,
        accuracy: true,
        mistakes: true,
        time: true,
        status: true,
        completedat: true,

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
            field: "speed",
            headerName: "Speed in wpm",
            flex: 0,
            width: 200,
            hide: !columnVisibility.speed,
            headerClassName: "bold-header",
            cellRenderer: (params) => {
                const speedStatus = params.data.speedstatus; // Check speed status for the row
                const color = speedStatus ? "green" : "red"; // Green if true, red if false

                return (
                    <span style={{ color: color }}>
                        {params.value}
                    </span>
                );
            },
        },
        {
            field: "accuracy",
            headerName: "Accuracy in %",
            flex: 0,
            width: 200,
            hide: !columnVisibility.accuracy,
            headerClassName: "bold-header",
            cellRenderer: (params) => {
                const accStatus = params.data.accuracystatus; // Check speed status for the row
                const color = accStatus ? "green" : "red"; // Green if true, red if false

                return (
                    <span style={{ color: color }}>
                        {params.value}
                    </span>
                );
            },
        },
        {
            field: "mistakes",
            headerName: "Mistakes",
            flex: 0,
            width: 200,
            hide: !columnVisibility.mistakes,
            headerClassName: "bold-header",
            cellRenderer: (params) => {
                const accStatus = params.data.mistakesstatus; // Check speed status for the row
                const color = accStatus ? "green" : "red"; // Green if true, red if false

                return (
                    <span style={{ color: color }}>
                        {params.value}
                    </span>
                );
            },
        },
        {
            field: "time",
            headerName: "Time (MM:SS)",
            flex: 0,
            width: 200,
            hide: !columnVisibility.time,
            headerClassName: "bold-header",
        },
        {
            field: "status",
            headerName: "Status",
            flex: 0,
            width: 150,
            hide: !columnVisibility.status,
            headerClassName: "bold-header",
            cellRenderer: (params) => {
                const accStatus = params.data.individualresult; // Check speed status for the row
                const color = accStatus ? "green" : "red"; // Green if true, red if false

                return (
                    <span style={{ color: color }}>
                        {params.value}
                    </span>
                );
            },
        },
        {
            field: "completedat",
            headerName: "Attended Time",
            flex: 0,
            width: 150,
            hide: !columnVisibility.completedat,
            headerClassName: "bold-header",
        },


        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 100,
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
                    {isUserRoleCompare?.includes("voverallresponse") && (
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
            department: item?.department,
            designation: item?.designation,
            employeename: item?.employeename,
            category: item?.category,
            subcategory: item?.subcategory,
            questions: item?.questions,
            completedat: item?.completedat,
            speed: item?.speed,
            accuracy: item?.accuracy,
            mistakes: item?.mistakes,
            time: item?.time,
            status: item?.status,
            addedby: item?.addedby,
            updatedby: item?.updatedby,
            result: item?.result,
            overallresult: item?.overallresult,
            individualresult: item?.individualresult,
            speedstatus: item?.speedstatus,
            accuracystatus: item?.accuracystatus,
            mistakesstatus: item?.mistakesstatus,
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






    const daysoptions = [
        { label: "Yesterday", value: "Yesterday" },
        { label: "Last Week", value: "Last Week" },
        { label: "Last Month", value: "Last Month" },
        { label: "Today", value: "Today" },
        { label: "This Week", value: "This Week" },
        { label: "This Month", value: "This Month" },
        { label: "Custom Fields", value: "Custom Fields" },
    ]

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;

    const [filterUser, setFilterUser] = useState({
        day: "Today",
        fromtime: '00:00',
        totime: '23:59',
        fromdate: moment().format('YYYY-MM-DD'),
        todate: moment().format('YYYY-MM-DD'),
    });

    const handleChangeFilterDate = (e) => {
        let fromDate = '';
        let toDate = moment().format('YYYY-MM-DD');
        switch (e.value) {
            case 'Today':
                setFilterUser((prev) => ({ ...prev, fromdate: toDate, todate: toDate }))
                break;
            case 'Yesterday':
                fromDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
                toDate = fromDate; // Yesterday’s date
                setFilterUser((prev) => ({ ...prev, fromdate: fromDate, todate: toDate }))
                break;

            case 'Last Week':
                fromDate = moment().subtract(1, 'weeks').startOf('week').format('YYYY-MM-DD');
                toDate = moment().subtract(1, 'weeks').endOf('week').format('YYYY-MM-DD');
                setFilterUser((prev) => ({ ...prev, fromdate: fromDate, todate: toDate }))
                break;

            case 'This Week':
                fromDate = moment().startOf('week').format('YYYY-MM-DD');
                toDate = moment().endOf('week').format('YYYY-MM-DD');
                setFilterUser((prev) => ({ ...prev, fromdate: fromDate, todate: toDate }))
                break;

            case 'Last Month':
                fromDate = moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD');
                toDate = moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD');
                setFilterUser((prev) => ({ ...prev, fromdate: fromDate, todate: toDate }))
                break;

            case 'This Month':
                fromDate = moment().startOf('month').format('YYYY-MM-DD');
                toDate = moment().endOf('month').format('YYYY-MM-DD');
                setFilterUser((prev) => ({ ...prev, fromdate: fromDate, todate: toDate }))
                break;

            case 'Custom Fields':
                setFilterUser((prev) => ({ ...prev, fromdate: "", todate: "" }))
                break;
            default:
                return;
        }
    }











    const [filterLoader, setFilterLoader] = useState(false);
    const [tableLoader, setTableLoader] = useState(false);


    // useEffect(() => { fetchReturnData() }, [])



    //FILTER START
    useEffect(() => {
        fetchDepartments();
        getPracticeQuestions();
    }, []);
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
            setPracticeQuestions(questions)
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

    const TypeOptions = [
        { label: "Individual", value: "Individual" },
        { label: "Company", value: "Company" },
        { label: "Branch", value: "Branch" },
        { label: "Unit", value: "Unit" },
        { label: "Team", value: "Team" },
        { label: "Department", value: "Department" },
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
    //category multiselect
    const [selectedOptionsCategory, setSelectedOptionsCategory] = useState([]);
    let [valueCategoryCat, setValueCategoryCat] = useState([]);

    const handleCategoryChange = (options) => {
        setValueCategoryCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsCategory(options);
        setSelectedOptionsSubCategory([])
        setValueSubCategoryCat([])
        setSelectedOptionsQuestions([])
        setValueQuestionsCat([])
    };

    const customValueRendererCategory = (valueCategoryCat, _categoryname) => {
        return valueCategoryCat?.length
            ? valueCategoryCat.map(({ label }) => label)?.join(", ")
            : "Please Select Category";
    };
    //sub category multiselect
    const [selectedOptionsSubCategory, setSelectedOptionsSubCategory] = useState([]);
    let [valueSubCategoryCat, setValueSubCategoryCat] = useState([]);

    const handleSubCategoryChange = (options) => {
        setValueSubCategoryCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsSubCategory(options);
        setSelectedOptionsQuestions([])
        setValueQuestionsCat([])
    };

    const customValueRendererSubCategory = (valueSubCategoryCat, _Subcategoryname) => {
        return valueSubCategoryCat?.length
            ? valueSubCategoryCat.map(({ label }) => label)?.join(", ")
            : "Please Select Sub Category";
    };

    //status multiselect
    const [selectedOptionsQuestions, setSelectedOptionsQuestions] = useState([]);
    let [valueQuestionsCat, setValueQuestionsCat] = useState([]);

    const handleQuestionsChange = (options) => {
        setValueQuestionsCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsQuestions(options);
    };

    const customValueRendererQuestions = (valueSubCategoryCat, _Subcategoryname) => {
        return valueSubCategoryCat?.length
            ? valueSubCategoryCat.map(({ label }) => label)?.join(", ")
            : "Please Select Questions";
    };

    //status multiselect
    const [selectedOptionsStatus, setSelectedOptionsStatus] = useState([]);
    let [valueStatusCat, setValueStatusCat] = useState([]);

    const handleStatusChange = (options) => {
        setValueStatusCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsStatus(options);
    };

    const customValueRendererStatus = (valueSubCategoryCat, _Subcategoryname) => {
        return valueSubCategoryCat?.length
            ? valueSubCategoryCat.map(({ label }) => label)?.join(", ")
            : "Please Select Status";
    };

    //MULTISELECT ONCHANGE END
    const handleClearFilter = () => {
        setFilterUser({
            day: "Today",
            fromtime: '00:00',
            totime: '23:59',
            fromdate: moment().format('YYYY-MM-DD'),
            todate: moment().format('YYYY-MM-DD'),
        });
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

        setValueCategoryCat([]);
        setSelectedOptionsCategory([]);
        setSelectedOptionsSubCategory([])
        setValueSubCategoryCat([])
        setSelectedOptionsStatus([])
        setValueStatusCat([])
        setSelectedOptionsQuestions([])
        setValueQuestionsCat([])

        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
    };

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
            fetchReturnData();
        }
    };


    const fetchReturnData = async () => {
        setPageName(!pageName);
        setLoader(true);
        setisBtnFilter(true);
        setFilterLoader(true);
        setTableLoader(true);
        try {

            // ...(filterUser?.fromdate && filterUser?.day !== "" && filterUser?.todate
            //     ? [
            //         {
            //             $expr: {
            //                 $and: [
            //                     {
            //                         $gte: [
            //                             {
            //                                 $dateToString: {
            //                                     format: "%Y-%m-%d", // Extract YYYY-MM-DD
            //                                     date: "$createdAt",
            //                                 },
            //                             },
            //                             filterUser?.fromdate, // Ensure this is in "YYYY-MM-DD" format
            //                         ],
            //                     },
            //                     {
            //                         $lte: [
            //                             {
            //                                 $dateToString: {
            //                                     format: "%Y-%m-%d",
            //                                     date: "$createdAt",
            //                                 },
            //                             },
            //                             filterUser?.todate, // Ensure this is in "YYYY-MM-DD" format
            //                         ],
            //                     },
            //                 ],
            //             },
            //         },
            //     ]
            //     : []),

            // ...(filterUser?.fromtime && filterUser?.day !== "" && filterUser?.totime
            //     ? [
            //         {
            //             $expr: {
            //                 $and: [
            //                     {
            //                         $gte: [
            //                             {
            //                                 $add: [
            //                                     { $multiply: [{ $hour: "$createdAt" }, 60] }, // Convert hours to minutes
            //                                     { $minute: "$createdAt" }, // Add minutes
            //                                 ],
            //                             },
            //                             {
            //                                 $add: [
            //                                     {
            //                                         $multiply: [
            //                                             { $toInt: { $substr: [filterUser?.fromtime, 0, 2] } }, // Extract hour from "HH:mm"
            //                                             60,
            //                                         ],
            //                                     },
            //                                     { $toInt: { $substr: [filterUser?.fromtime, 3, 2] } }, // Extract minutes
            //                                 ],
            //                             },
            //                         ],
            //                     },
            //                     {
            //                         $lte: [
            //                             {
            //                                 $add: [
            //                                     { $multiply: [{ $hour: "$createdAt" }, 60] }, // Convert hours to minutes
            //                                     { $minute: "$createdAt" }, // Add minutes
            //                                 ],
            //                             },
            //                             {
            //                                 $add: [
            //                                     {
            //                                         $multiply: [
            //                                             { $toInt: { $substr: [filterUser?.totime, 0, 2] } }, // Extract hour from "HH:mm"
            //                                             60,
            //                                         ],
            //                                     },
            //                                     { $toInt: { $substr: [filterUser?.totime, 3, 2] } }, // Extract minutes
            //                                 ],
            //                             },
            //                         ],
            //                     },
            //                 ],
            //             },
            //         },
            //     ]
            //     : []),
            const pipeline = [
                // First, check what documents look like before unwinding
                {
                    $addFields: {
                        resultExists: { $gt: [{ $size: "$result" }, 0] }
                    }
                },

                // Ensure only documents with results are processed
                {
                    $match: {
                        resultExists: true, // This ensures we only process documents with a non-empty result array
                    }
                },

                // Now unwind the result field
                {
                    $unwind: {
                        path: "$result",
                        preserveNullAndEmptyArrays: true // Keeps docs where result might be null
                    }
                },

                // Set _id from the result field
                {
                    $set: {
                        _id: "$result._id"
                    }
                },

                // Now apply filtering conditions AFTER unwind
                {
                    $match: {
                        "company": { $in: valueCompanyCat.length > 0 ? valueCompanyCat : allAssignCompany },
                        "branch": { $in: valueBranchCat.length > 0 ? valueBranchCat : allAssignBranch },
                        "unit": { $in: valueUnitCat.length > 0 ? valueUnitCat : allAssignUnit },
                        ...(valueTeamCat.length > 0 && { "team": { $in: valueTeamCat } }),
                        ...(valueDepartmentCat.length > 0 && { "department": { $in: valueDepartmentCat } }),
                        ...(valueEmployeeCat.length > 0 && { "employeename": { $in: valueEmployeeCat } }),
                        ...(valueCategoryCat.length > 0 && { "category": { $in: valueCategoryCat } }),
                        ...(valueSubCategoryCat.length > 0 && { "subcategory": { $in: valueSubCategoryCat } }),
                        ...(valueQuestionsCat.length > 0 && { "result.question": { $in: valueQuestionsCat } }),
                        // Conditional filter for valueStatusCat
                        ...(valueStatusCat.length > 0
                            ? valueStatusCat.includes("Eligible") && valueStatusCat.includes("Not Eligible")
                                ? {} // No filter if both values are present
                                : valueStatusCat.includes("Eligible")
                                    ? { "result.individualresult": true }
                                    : { "result.individualresult": false }
                            : {} // No filter if array is empty
                        ),
                        // Date filtering condition
                        ...(filterUser?.fromdate && filterUser?.day !== "" && filterUser?.todate && {
                            $expr: {
                                $and: [
                                    {
                                        $gte: [
                                            {
                                                $dateToString: {
                                                    format: "%Y-%m-%d", // Format to "YYYY-MM-DD"
                                                    date: "$createdAt"
                                                }
                                            },
                                            filterUser.fromdate // Ensure this is in "YYYY-MM-DD" format
                                        ]
                                    },
                                    {
                                        $lte: [
                                            {
                                                $dateToString: {
                                                    format: "%Y-%m-%d",
                                                    date: "$createdAt"
                                                }
                                            },
                                            filterUser.todate // Ensure this is in "YYYY-MM-DD" format
                                        ]
                                    }
                                ]
                            }
                        })

                    }
                }
            ];



            let response = await axios.post(
                SERVICE.DYNAMIC_TYPING_SESSION_RESPONSE,
                {
                    pipeline
                },
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );
            console.log(response?.data?.preacticeResponse, "response?.data?.preacticeResponse")

            const itemsWithSerialNumber = response?.data?.preacticeResponse?.map((item, index) => {




                return {
                    ...item,
                    serialNumber: index + 1,
                    id: item._id,
                    completedat: moment(item.createdAt).format("DD-MM-YYYY hh:mm:ss A"),
                    questions: item?.result?.question || "",
                    speed: `${item?.result?.speed} / ${item?.result?.actualspeed}`,
                    accuracy: `${item?.result?.accuracy} / ${item?.result?.actualacuuracy}`,
                    mistakes: `${item?.result?.mistakes} / ${item?.result?.actualmistakes}`,
                    time: `${item?.result?.timetaken} / ${item?.result?.actualtime}`,
                    status: item?.result?.individualresult ? "Eligible" : "Not Eligible",
                    individualresult: item?.result?.individualresult ? true : false,
                    speedstatus: item?.result?.speedstatus ? true : false,
                    accuracystatus: item?.result?.accuracystatus ? true : false,
                    mistakesstatus: item?.result?.mistakesstatus ? true : false,
                    category: item?.category?.join(",") || "",
                    subcategory: item?.subcategory?.join(",") || "",
                    addedby: item?.addedby?.length > 0 ? item?.addedby : [],
                    updatedby: item?.updatedby?.length > 0 ? item?.updatedby : [],
                    result: [item?.result],

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
                        selectedTeam?.includes(u.team)
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
                        selectedTeam?.includes(u.team)
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
            <NotificationContainer />
            <Headtitle title={"OVERALL TYPING PRACTICE RESPONSE"} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Overall Typing Practice Response"
                modulename="Typing Practice"
                submodulename="Overall Response"
                mainpagename=""
                subpagename=""
                subsubpagename=""
            />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("loverallresponse") && (
                <>
                    <Box sx={userStyle.selectcontainer}>
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext}>
                                        Overall Typing Practice Response Filter
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
                                                            valueTeamCat?.includes(u.team)
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
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Category
                                        </Typography>
                                        <MultiSelect
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
                                            value={selectedOptionsCategory}
                                            onChange={(e) => {
                                                handleCategoryChange(e);
                                            }}
                                            valueRenderer={customValueRendererCategory}
                                            labelledBy="Please Select Category"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Sub Category
                                        </Typography>
                                        <MultiSelect
                                            options={practiceQuestions
                                                ?.filter(
                                                    (item) =>
                                                        valueCategoryCat?.includes(item.category)
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
                                            value={selectedOptionsSubCategory}
                                            onChange={(e) => {
                                                handleSubCategoryChange(e);
                                            }}
                                            valueRenderer={customValueRendererSubCategory}
                                            labelledBy="Please Select Sub Category"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Questions
                                        </Typography>
                                        <MultiSelect

                                            options={practiceQuestions
                                                ?.filter(
                                                    (item) =>
                                                        valueCategoryCat?.includes(item.category) &&
                                                        valueSubCategoryCat?.includes(item.subcategory)
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
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Status
                                        </Typography>
                                        <MultiSelect
                                            options={[
                                                { label: "Eligible", value: "Eligible" },
                                                { label: "Not Eligible", value: "Not Eligible" },
                                            ]}
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
                                    <FormControl fullWidth size="small">
                                        <Typography sx={{ fontWeight: "500" }}>
                                            Days
                                        </Typography>
                                        <Selects
                                            options={daysoptions}
                                            // styles={colourStyles}
                                            value={{ label: filterUser.day ? filterUser.day : "Please Select Days", value: filterUser.day ? filterUser.day : "Please Select Days" }}
                                            onChange={(e) => {
                                                handleChangeFilterDate(e);
                                                setFilterUser((prev) => ({ ...prev, day: e.value }))
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                {filterUser.day !== "" && <>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                {" "}
                                                From Date<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <OutlinedInput
                                                id="from-date"
                                                type="date"
                                                disabled={filterUser.day !== "Custom Fields"}
                                                value={filterUser.fromdate}
                                                onChange={(e) => {
                                                    const newFromDate = e.target.value;
                                                    setFilterUser((prevState) => ({
                                                        ...prevState,
                                                        fromdate: newFromDate,
                                                        todate: prevState.todate && new Date(prevState.todate) > new Date(newFromDate) ? prevState.todate : ""
                                                    }));
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                To Date<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <OutlinedInput
                                                id="to-date"
                                                type="date"
                                                value={filterUser.todate}
                                                disabled={filterUser.day !== "Custom Fields"}
                                                onChange={(e) => {
                                                    const selectedToDate = new Date(e.target.value);
                                                    const selectedFromDate = new Date(filterUser.fromdate);

                                                    if (selectedToDate >= selectedFromDate && selectedToDate >= new Date(selectedFromDate)) {
                                                        setFilterUser({
                                                            ...filterUser,
                                                            todate: e.target.value
                                                        });
                                                    } else {
                                                        setFilterUser({
                                                            ...filterUser,
                                                            todate: "" // Reset to empty string if the condition fails
                                                        });
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
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
                        </>
                    </Box>
                </>
            )} <br />
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
                    {isUserRoleCompare?.includes("loverallresponse") && (
                        <>
                            <Box sx={userStyle.container}>
                                {/* ******************************************************EXPORT Buttons****************************************************** */}
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Typography sx={userStyle.SubHeaderText}>
                                            List Overall Typing Practice Response
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
                                                "exceloverallresponse"
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
                                                "csvoverallresponse"
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
                                                "printoverallresponse"
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
                                                "pdfoverallresponse"
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
                                                "imageoverallresponse"
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
                filename={"OverallTypingPracticeResponse"}
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
                            View Overall Typing Practice Response
                        </Typography>
                        <br />
                        <Grid container spacing={2}>

                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Company</Typography>
                                    <Typography sx={{
                                        wordBreak: "break-word",
                                        overflowWrap: "break-word",
                                        whiteSpace: "pre-wrap",
                                    }}>{viewDetails.company}</Typography>
                                </FormControl>
                            </Grid>

                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Branch</Typography>
                                    <Typography sx={{
                                        wordBreak: "break-word",
                                        overflowWrap: "break-word",
                                        whiteSpace: "pre-wrap",
                                    }}>{viewDetails.branch}</Typography>
                                </FormControl>
                            </Grid>

                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Unit</Typography>
                                    <Typography sx={{
                                        wordBreak: "break-word",
                                        overflowWrap: "break-word",
                                        whiteSpace: "pre-wrap",
                                    }}>{viewDetails.unit}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Team</Typography>
                                    <Typography sx={{
                                        wordBreak: "break-word",
                                        overflowWrap: "break-word",
                                        whiteSpace: "pre-wrap",
                                    }}>{viewDetails.team}</Typography>
                                </FormControl>
                            </Grid>

                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Department</Typography>
                                    <Typography sx={{
                                        wordBreak: "break-word",
                                        overflowWrap: "break-word",
                                        whiteSpace: "pre-wrap",
                                    }}>{viewDetails.department}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Designation</Typography>
                                    <Typography sx={{
                                        wordBreak: "break-word",
                                        overflowWrap: "break-word",
                                        whiteSpace: "pre-wrap",
                                    }}>{viewDetails.designation}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Employee</Typography>
                                    <Typography sx={{
                                        wordBreak: "break-word",
                                        overflowWrap: "break-word",
                                        whiteSpace: "pre-wrap",
                                    }}>{viewDetails.employeename}</Typography>
                                </FormControl>
                            </Grid>
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
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Attended Time</Typography>
                                    <Typography>{viewDetails?.completedat}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={12} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Questions</Typography>
                                    {viewDetails?.result?.length > 0 && viewDetails?.result?.map((t, index) => {

                                        return (
                                            <>
                                                <Grid container spacing={2}>
                                                    <Grid
                                                        item
                                                        md={12}
                                                        xs={12}
                                                        sm={12}
                                                        style={{ marginTop: "20px" }}
                                                    >
                                                        <FormControl fullWidth size="small">
                                                            <Typography
                                                                style={{
                                                                    overflow: "hidden",
                                                                    textOverflow: "ellipsis",
                                                                    whiteSpace: "nowrap",
                                                                    maxWidth: "100%",
                                                                }}
                                                                title={t.question}
                                                            >
                                                                {index + 1} . {t.question}
                                                            </Typography>
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item md={8} xs={12} sm={12}>
                                                        {/* Table */}
                                                        <Container maxWidth="sm" style={{ marginTop: "20px" }}>
                                                            <TableContainer component={Paper}>
                                                                <Table
                                                                    aria-label="customized table"
                                                                    id="raisetickets"
                                                                // ref={componentRef}
                                                                >
                                                                    <TableHead
                                                                        sx={{ fontWeight: "600", textAlign: "center" }}
                                                                    >
                                                                        <StyledTableRow>
                                                                            <StyledTableCell
                                                                                sx={{
                                                                                    textAlign: "center",
                                                                                    justifyContent: "center",
                                                                                }}
                                                                            >
                                                                                <Box sx={userStyle.tableheadstyle}>
                                                                                    <Box
                                                                                        sx={{
                                                                                            textAlign: "center",
                                                                                            justifyContent: "center",
                                                                                        }}
                                                                                    >
                                                                                        Speed &nbsp; (
                                                                                        <span style={{ fontSize: "12px" }}>
                                                                                            {t?.actualspeed}
                                                                                        </span>
                                                                                        )
                                                                                    </Box>
                                                                                </Box>
                                                                            </StyledTableCell>
                                                                            <StyledTableCell
                                                                                sx={{
                                                                                    textAlign: "center",
                                                                                    justifyContent: "center",
                                                                                }}
                                                                            >
                                                                                <Box sx={userStyle.tableheadstyle}>
                                                                                    <Box
                                                                                        sx={{
                                                                                            textAlign: "center",
                                                                                            justifyContent: "center",
                                                                                        }}
                                                                                    >
                                                                                        Accuracy &nbsp; (
                                                                                        <span style={{ fontSize: "12px" }}>
                                                                                            {t?.actualacuuracy}
                                                                                        </span>
                                                                                        )
                                                                                    </Box>
                                                                                </Box>
                                                                            </StyledTableCell>
                                                                            <StyledTableCell
                                                                                sx={{
                                                                                    textAlign: "center",
                                                                                    justifyContent: "center",
                                                                                }}
                                                                            >
                                                                                <Box sx={userStyle.tableheadstyle}>
                                                                                    <Box
                                                                                        sx={{
                                                                                            textAlign: "center",
                                                                                            justifyContent: "center",
                                                                                        }}
                                                                                    >
                                                                                        Mistakes &nbsp; (
                                                                                        <span style={{ fontSize: "12px" }}>
                                                                                            {t?.actualmistakes}
                                                                                        </span>
                                                                                        )
                                                                                    </Box>
                                                                                </Box>
                                                                            </StyledTableCell>
                                                                            <StyledTableCell
                                                                                sx={{
                                                                                    textAlign: "center",
                                                                                    justifyContent: "center",
                                                                                }}
                                                                            >
                                                                                <Box sx={userStyle.tableheadstyle}>
                                                                                    <Box
                                                                                        sx={{
                                                                                            textAlign: "center",
                                                                                            justifyContent: "center",
                                                                                        }}
                                                                                    >
                                                                                        Time Taken (
                                                                                        <span style={{ fontSize: "12px" }}>
                                                                                            {t?.actualtime}
                                                                                        </span>
                                                                                        )
                                                                                    </Box>
                                                                                </Box>
                                                                            </StyledTableCell>
                                                                            <StyledTableCell
                                                                                sx={{
                                                                                    textAlign: "center",
                                                                                    justifyContent: "center",
                                                                                }}
                                                                            >
                                                                                <Box sx={userStyle.tableheadstyle}>
                                                                                    <Box
                                                                                        sx={{
                                                                                            textAlign: "center",
                                                                                            justifyContent: "center",
                                                                                        }}
                                                                                    >
                                                                                        Status
                                                                                    </Box>
                                                                                </Box>
                                                                            </StyledTableCell>
                                                                        </StyledTableRow>
                                                                    </TableHead>
                                                                    <TableBody align="left">
                                                                        {viewDetails?.result?.length > 0 ? (
                                                                            <StyledTableRow key={index}>
                                                                                <StyledTableCell>
                                                                                    {t?.speed}&nbsp; &nbsp;
                                                                                    {t?.speedstatus ? (
                                                                                        <CheckCircleIcon
                                                                                            color="success"
                                                                                            style={{
                                                                                                fontSize: "15px",
                                                                                                marginTop: "10px",
                                                                                            }}
                                                                                        />
                                                                                    ) : (
                                                                                        <CancelIcon
                                                                                            color="error"
                                                                                            style={{
                                                                                                fontSize: "15px",
                                                                                                marginTop: "7px",
                                                                                            }}
                                                                                        />
                                                                                    )}
                                                                                </StyledTableCell>
                                                                                <StyledTableCell>
                                                                                    {t?.accuracy}&nbsp; &nbsp;
                                                                                    {t?.accuracystatus ? (
                                                                                        <CheckCircleIcon
                                                                                            color="success"
                                                                                            style={{
                                                                                                fontSize: "15px",
                                                                                                marginTop: "7px",
                                                                                            }}
                                                                                        />
                                                                                    ) : (
                                                                                        <CancelIcon
                                                                                            color="error"
                                                                                            style={{
                                                                                                fontSize: "15px",
                                                                                                marginTop: "7px",
                                                                                            }}
                                                                                        />
                                                                                    )}
                                                                                </StyledTableCell>
                                                                                <StyledTableCell>
                                                                                    {t?.mistakes}&nbsp; &nbsp;
                                                                                    {t?.mistakesstatus ? (
                                                                                        <CheckCircleIcon
                                                                                            color="success"
                                                                                            style={{
                                                                                                fontSize: "15px",
                                                                                                marginTop: "7px",
                                                                                            }}
                                                                                        />
                                                                                    ) : (
                                                                                        <CancelIcon
                                                                                            color="error"
                                                                                            style={{
                                                                                                fontSize: "15px",
                                                                                                marginTop: "7px",
                                                                                            }}
                                                                                        />
                                                                                    )}
                                                                                </StyledTableCell>
                                                                                <StyledTableCell>
                                                                                    {t?.timetaken}
                                                                                </StyledTableCell>
                                                                                <StyledTableCell>
                                                                                    {t?.individualresult ? (
                                                                                        <CheckCircleIcon color="success" />
                                                                                    ) : (
                                                                                        <CancelIcon color="error" />
                                                                                    )}
                                                                                </StyledTableCell>
                                                                            </StyledTableRow>
                                                                        ) : (
                                                                            <StyledTableRow>
                                                                                <StyledTableCell
                                                                                    colSpan={12}
                                                                                    sx={{
                                                                                        height: "50px",
                                                                                    }}
                                                                                    align="center"
                                                                                >
                                                                                    No Data Available
                                                                                </StyledTableCell>
                                                                            </StyledTableRow>
                                                                        )}
                                                                    </TableBody>
                                                                </Table>
                                                            </TableContainer>
                                                        </Container>
                                                    </Grid>
                                                </Grid>
                                                <br />
                                            </>
                                        );
                                    })}

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




            {/* <LoadingBackdrop open={isLoading} /> */}


            <InfoPopup
                openInfo={openInfo}
                handleCloseinfo={handleCloseinfo}
                heading="Practice Session Info"
                addedby={infoDetails?.addedby}
                updateby={infoDetails?.updatedby}
            />





            {/* PLEASE SELECT ANY ROW */}
            <PleaseSelectRow
                open={isDeleteOpenalert}
                onClose={handleCloseModalert}
                message="Please Select any Row"
                iconColor="orange"
                buttonText="OK"
            />


        </Box>
    );
}

export default OverallTypingPracticeResponse;