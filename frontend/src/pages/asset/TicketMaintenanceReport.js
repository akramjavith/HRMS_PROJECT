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


function TicketMaintenanceReport() {
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
        "Ticket Status",
        "Ticket Number",
        "Raised By",
        "Raised Date/Time",
        "Resolved By",
        "Resolved Date/Time",
        "Material Name",
        "Material Code",
        "Material Status",
    ];
    let exportRowValues = [
        "raiseself",
        "raiseticketcount",
        "raisedby",
        "raiseddate",
        "ticketclosed",
        "resolvedate",
        "materialnamecut",
        "materialname",
        "materialstatus",
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
        allfloor,
        alllocationgrouping,
        allareagrouping,
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
                    saveAs(blob, "TicketMaintenanceReport.png");
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

        raiseself: true,
        raiseticketcount: true,
        raisedby: true,
        raiseddate: true,
        ticketclosed: true,
        resolvedate: true,
        materialnamecut: true,
        materialname: true,
        materialstatus: true,

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
        documentTitle: "Ticket Maintenance Report",
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
            field: "raiseself",
            headerName: "Ticket Status",
            flex: 0,
            width: 140,
            minHeight: "40px",
            hide: !columnVisibility.raiseself,
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    <Grid item md={3} xs={12} sm={12}>
                        <Typography sx={{
                            color: params.data.raiseself === "Open" ? "red" :
                                params.data.raiseself === "Resolved" ? "green" :
                                    params.data.raiseself === "Details Needed" ? "blue" :
                                        params.data.raiseself === "Closed" ? 'Orange' :
                                            params.data.raiseself === "Forwarded" ? "palevioletred" :
                                                params.data.raiseself === "Reject" ? "darkmagenta"
                                                    : 'violet'
                        }}
                        >{params.data.raiseself}</Typography>            </Grid>

                </Grid>

            ),
        },
        {
            field: "raiseticketcount",
            headerName: "Ticket Number",
            flex: 0,
            width: 140,
            hide: !columnVisibility.raiseticketcount,
        },
        {
            field: "raisedby",
            headerName: "Raised By",
            flex: 0,
            width: 150,
            hide: !columnVisibility.raisedby,
        },
        {
            field: "raiseddate",
            headerName: "Raised Date/Time",
            flex: 0,
            width: 150,
            hide: !columnVisibility.raiseddate,
        },
        {
            field: "ticketclosed",
            headerName: "Resolved By",
            flex: 0,
            width: 150,
            hide: !columnVisibility.ticketclosed,
        },
        {
            field: "resolvedate",
            headerName: "Resolved Date/Time",
            flex: 0,
            width: 150,
            hide: !columnVisibility.resolvedate,
        },
        {
            field: "materialnamecut",
            headerName: "Material Name",
            flex: 0,
            width: 130,
            hide: !columnVisibility.materialnamecut,
        },
        {
            field: "materialname",
            headerName: "Material Code",
            flex: 0,
            width: 150,
            hide: !columnVisibility.materialname,
        },
        {
            field: "materialstatus",
            headerName: "Material Status",
            flex: 0,
            width: 150,
            hide: !columnVisibility.materialstatus, cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    <Grid item md={3} xs={12} sm={12}>
                        <Typography sx={{
                            color: params.data.materialstatus === "Damage" ? "red" :
                                params.data.materialstatus === "In Working" ? "green"
                                    : 'yellow'
                        }}
                        >{params.data.materialstatus}</Typography>            </Grid>

                </Grid>

            ),
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
                    {isUserRoleCompare?.includes("vticketmaintenancereport") && (
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
            raiseself: item?.raiseself,
            raiseticketcount: item?.raiseticketcount,
            raisedby: item?.raisedby,
            raiseddate: item?.raiseddate,
            ticketclosed: item?.ticketclosed,
            resolvedate: item?.resolvedate,
            materialnamecut: item?.materialnamecut,
            materialname: item?.materialname,
            materialstatus: item?.materialstatus,
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
    const [filterState, setFilterState] = useState({
        company: [],
        branch: [],
        unit: [],
        floor: [],
        area: [],
        location: [],
        assetmaterial: [],
        assetmaterialcode: [],
    });
    const [filterUser, setFilterUser] = useState({
        day: "Today",
        fromtime: '00:00',
        totime: '23:59',
        fromdate: moment().format('YYYY-MM-DD'), todate: moment().format('YYYY-MM-DD')
    });
    const customValueRendererCompany = (valueCompanyCat, placeholder) => {
        return valueCompanyCat?.length
            ? valueCompanyCat.map(({ label }) => label)?.join(", ")
            : `Please Select Company`;
    };
    const customValueRendererBranch = (valueCompanyCat, placeholder) => {
        return valueCompanyCat?.length
            ? valueCompanyCat.map(({ label }) => label)?.join(", ")
            : `Please Select Branch`;
    };
    const customValueRendererUnit = (valueCompanyCat, placeholder) => {
        return valueCompanyCat?.length
            ? valueCompanyCat.map(({ label }) => label)?.join(", ")
            : `Please Select Unit`;
    };
    const customValueRendererFloor = (valueCompanyCat, placeholder) => {
        return valueCompanyCat?.length
            ? valueCompanyCat.map(({ label }) => label)?.join(", ")
            : `Please Select Floor`;
    };
    const customValueRendererArea = (valueCompanyCat, placeholder) => {
        return valueCompanyCat?.length
            ? valueCompanyCat.map(({ label }) => label)?.join(", ")
            : `Please Select Area`;
    };
    const customValueRendererLocation = (valueCompanyCat, placeholder) => {
        return valueCompanyCat?.length
            ? valueCompanyCat.map(({ label }) => label)?.join(", ")
            : `Please Select Location`;
    };
    const customValueRendererAssetMaterial = (valueCompanyCat, placeholder) => {
        return valueCompanyCat?.length
            ? valueCompanyCat.map(({ label }) => label)?.join(", ")
            : `Please Select Asset Material`;
    };
    const customValueRendererAssetMaterialCode = (valueCompanyCat, placeholder) => {
        return valueCompanyCat?.length
            ? valueCompanyCat.map(({ label }) => label)?.join(", ")
            : `Please Select AssetMaterialCode`;
    };
    const [materialOpt, setMaterialopt] = useState([]);
    useEffect(() => { fetchMaterial() }, [])
    const fetchMaterial = async (e) => {
        try {
            let res = await axios.get(SERVICE.ASSETMATERIALIP, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            setMaterialopt(res?.data?.assetmaterialip);
            console.log(res?.data?.assetmaterialip, "res?.data?.assetmaterialip");
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };



    //MULTISELECT ONCHANGE END
    const handleClearFilter = () => {
        setFilterUser({
            day: "Today",
            fromtime: '00:00',
            totime: '23:59',
            fromdate: moment().format('YYYY-MM-DD'), todate: moment().format('YYYY-MM-DD')
        });

        setFilterState({
            company: [],
            branch: [],
            unit: [],
            floor: [],
            area: [],
            location: [],
            assetmaterial: [],
            assetmaterialcode: [],
        });



        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
    };

    const handleFilter = () => {
        if (
            filterState?.company?.length === 0
        ) {
            setPopupContentMalert("Please Select Company!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (
            filterState?.branch?.length === 0
        ) {
            setPopupContentMalert("Please Select Branch!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (
            filterState?.unit?.length === 0
        ) {
            setPopupContentMalert("Please Select Unit!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (
            filterState?.floor?.length === 0
        ) {
            setPopupContentMalert("Please Select Floor!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (
            filterState?.location?.length === 0
        ) {
            setPopupContentMalert("Please Select Location!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (
            filterState?.assetmaterial?.length === 0
        ) {
            setPopupContentMalert("Please Select Asset Material!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (
            filterState?.assetmaterialcode?.length === 0
        ) {
            setPopupContentMalert("Please Select Asset Material Code!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (filterUser.day === "Custom Fields" && (!filterUser.fromdate || !filterUser.todate)) {
            setPopupContentMalert("Please Select All Date Fields!");
            setPopupSeverityMalert("info");
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


            const pipeline = [
                {
                    $match: {
                        materialname: {
                            $in: filterState?.assetmaterialcode?.length > 0
                                ? filterState.assetmaterialcode.map((data) => data.value)
                                : [],
                        },
                        // Check that taskassignedto array exists and is not empty
                        taskassignedto: { $exists: true, $ne: [], $not: { $size: 0 } },
                    },
                },
                // Add the date filter conditionally if filterUser.day is not empty
                // ...(filterUser?.day
                //     ? [
                //         {
                //             $addFields: {
                //                 // Convert raiseddate from string to ISODate format
                //                 raisedDateISO: {
                //                     $dateFromString: {
                //                         dateString: "$raiseddate",
                //                         format: "%d-%m-%Y %H:%M:%S %p",
                //                     },
                //                 },
                //             },
                //         },
                //         {
                //             $match: {
                //                 raisedDateISO: {
                //                     $gte: new Date(`${filterUser?.fromdate}T00:00:00`),
                //                     $lte: new Date(`${filterUser?.todate}T23:59:59`),
                //                 },
                //             },
                //         },
                //     ]
                //     : []),
            ];




            let response = await axios.post(
                SERVICE.DYNAMIC_TICKET_CONTROLLER,
                {
                    pipeline
                },
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );

            const fromDate = new Date(filterUser?.fromdate); // Assuming fromdate is in "YYYY-MM-DD" format
            const toDate = new Date(filterUser?.todate); // Assuming todate is in "YYYY-MM-DD" format
            const isDayFilterActive = filterUser?.day && filterUser.day !== "";
            let filteredDatasss;
            if (isDayFilterActive) {
                filteredDatasss = response?.data?.raiseticket.filter((item) => {
                    // Convert raiseddate to ISODate and check if it falls in the range
                    let isDateInRange = true;
                    if (isDayFilterActive) {
                        // Splitting the date and time
                        const [day, month, year, hours, minutes, seconds, period] = item.raiseddate.split(/[- :]/);

                        // Construct a proper date-time string
                        const time = `${hours}:${minutes}:${seconds} ${period}`;
                        const dateString = `${year}-${month}-${day} ${time}`;

                        // Convert to a Date object
                        const isoDate = new Date(dateString);

                        // Check if date is valid
                        if (!isNaN(isoDate.getTime())) {
                            isDateInRange = isoDate >= fromDate && isoDate <= new Date(toDate.getTime() + 86399999); // Include end of the day
                        } else {
                            console.error("Invalid Date:", dateString);
                        }
                    }

                    return isDateInRange;
                });

            } else {
                filteredDatasss = response?.data?.raiseticket
            }
            // Filtering logic


            const itemsWithSerialNumber = filteredDatasss?.map((item, index) => {




                return {
                    ...item,
                    serialNumber: index + 1,
                    id: item._id,
                    raiseself: item?.raiseself,
                    raiseticketcount: item?.raiseticketcount,
                    raisedby: item?.raisedby,
                    raiseddate: item?.raiseddate,
                    ticketclosed: item?.ticketclosed,
                    resolvedate: item?.resolvedate,
                    materialnamecut: item?.materialnamecut,
                    materialname: item?.materialname,
                    materialstatus: item?.materialstatus,
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





    return (
        <Box>
            <NotificationContainer />
            <Headtitle title={"TICKET MAINTENANCE REPORT"} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Ticket Maintenance Report"
                modulename="Asset"
                submodulename="Maintenance"
                mainpagename="Ticket Maintenance Report"
                subpagename=""
                subsubpagename=""
            />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lticketmaintenancereport") && (
                <>
                    <Box sx={userStyle.selectcontainer}>
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext}>
                                        Ticket Maintenance Filter
                                    </Typography>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={3} xs={12} sm={12}>
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
                                                .filter((item, index, self) => {
                                                    return (
                                                        self.findIndex(
                                                            (i) =>
                                                                i.label === item.label &&
                                                                i.value === item.value
                                                        ) === index
                                                    );
                                                })}
                                            value={filterState?.company}
                                            onChange={(e) => {
                                                setFilterState((prev) => ({
                                                    ...prev,
                                                    company: e,
                                                    branch: [],
                                                    unit: [],
                                                    floor: [],
                                                    area: [],
                                                    location: [],
                                                    assetmaterial: [],
                                                    assetmaterialcode: [],
                                                }))
                                            }}
                                            valueRenderer={customValueRendererCompany}
                                            labelledBy="Please Select Company"
                                        />

                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            {" "}
                                            Branch<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect
                                            options={accessbranch
                                                ?.filter((comp) =>
                                                    filterState?.company?.map(items => items?.value)?.includes(comp.company)
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
                                            value={filterState?.branch}
                                            onChange={(e) => {
                                                setFilterState((prev) => ({
                                                    ...prev,
                                                    branch: e,
                                                    unit: [],
                                                    floor: [],
                                                    area: [],
                                                    location: [],
                                                    assetmaterial: [],
                                                    assetmaterialcode: [],
                                                }))
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
                                                        filterState?.company?.map(items => items?.value)?.includes(comp.company) &&
                                                        filterState?.branch?.map(items => items?.value)?.includes(comp.branch)
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
                                            value={filterState?.unit}
                                            onChange={(e) => {
                                                setFilterState((prev) => ({
                                                    ...prev,
                                                    unit: e,
                                                    floor: [],
                                                    area: [],
                                                    location: [],
                                                    assetmaterial: [],
                                                    assetmaterialcode: [],
                                                }))
                                            }}
                                            valueRenderer={customValueRendererUnit}
                                            labelledBy="Please Select Unit"
                                        />

                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Floor<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect
                                            options={allfloor
                                                ?.filter(
                                                    (comp) =>
                                                        filterState?.branch?.map(items => items?.value)?.includes(comp.branch)
                                                )
                                                ?.map((data) => ({
                                                    label: data.name,
                                                    value: data.name,
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
                                            value={filterState?.floor}
                                            onChange={(e) => {
                                                setFilterState((prev) => ({
                                                    ...prev,
                                                    floor: e,
                                                    area: [],
                                                    location: [],
                                                    assetmaterial: [],
                                                    assetmaterialcode: [],
                                                }))
                                            }}
                                            valueRenderer={customValueRendererFloor}

                                            labelledBy="Please Select Floor"
                                        />

                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Area<b style={{ color: "red" }}>*</b>
                                        </Typography>

                                        <MultiSelect
                                            options={allareagrouping
                                                ?.filter(
                                                    (comp) =>
                                                        filterState?.branch?.map(items => items?.value)?.includes(comp.branch) &&
                                                        filterState?.floor?.map(items => items?.value)?.includes(comp.floor)
                                                )?.flatMap((data) => data.area)
                                                ?.map((data) => ({
                                                    label: data,
                                                    value: data,
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
                                            value={filterState?.area}
                                            onChange={(e) => {
                                                setFilterState((prev) => ({
                                                    ...prev,
                                                    area: e,
                                                    location: [],
                                                    assetmaterial: [],
                                                    assetmaterialcode: [],
                                                }))
                                            }}
                                            valueRenderer={customValueRendererArea}

                                            labelledBy="Please Select Area"
                                        />

                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Location<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect
                                            options={alllocationgrouping
                                                ?.filter(
                                                    (comp) =>
                                                        filterState?.branch?.map(items => items?.value)?.includes(comp.branch) &&
                                                        filterState?.floor?.map(items => items?.value)?.includes(comp.floor) &&
                                                        filterState?.area?.map(items => items?.value)?.includes(comp.area)
                                                )?.flatMap((data) => data.location)
                                                ?.map((data) => ({
                                                    label: data,
                                                    value: data,
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
                                            value={filterState?.location}
                                            onChange={(e) => {
                                                setFilterState((prev) => ({
                                                    ...prev,
                                                    location: e,
                                                    assetmaterial: [],
                                                    assetmaterialcode: [],
                                                }))
                                            }}
                                            valueRenderer={customValueRendererLocation}

                                            labelledBy="Please Select Location"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Asset Material<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect
                                            options={Array.from(
                                                new Set(
                                                    materialOpt
                                                        .filter(
                                                            (subpro) =>
                                                                filterState?.location?.map(items => items?.value)?.includes(subpro.location)
                                                                &&
                                                                subpro.empdistribution === true &&
                                                                filterState?.company?.map(items => items?.value)?.includes(subpro.company)
                                                                &&
                                                                filterState?.branch?.map(items => items?.value)?.includes(subpro.branch)
                                                                &&
                                                                filterState?.unit?.map(items => items?.value)?.includes(subpro.unit)
                                                                &&
                                                                filterState?.floor?.map(items => items?.value)?.includes(subpro.floor)
                                                                &&
                                                                filterState?.area?.map(items => items?.value)?.includes(subpro.area)

                                                        )
                                                        // .map((t) => t.component)
                                                        // .reduce((acc, curr) => acc.concat(curr), [])
                                                        .map((t) => ({
                                                            ...t,
                                                            label: t?.assetmaterial,
                                                            value: t?.assetmaterial,
                                                        }))
                                                        .reduce((acc, curr) => {
                                                            if (
                                                                !acc.some(
                                                                    (obj) => obj.value === curr.value
                                                                )
                                                            ) {
                                                                acc.push(curr);
                                                            }
                                                            return acc;
                                                        }, [])
                                                )
                                            )}
                                            value={filterState?.assetmaterial}
                                            onChange={(e) => {
                                                setFilterState((prev) => ({
                                                    ...prev,
                                                    assetmaterial: e,
                                                    assetmaterialcode: [],
                                                }))
                                            }}
                                            valueRenderer={customValueRendererAssetMaterial}

                                            labelledBy="Please Select Asset Material"
                                        />

                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Asset Material Code<b style={{ color: "red" }}>*</b>
                                        </Typography>

                                        <MultiSelect
                                            options={Array.from(
                                                new Set(
                                                    materialOpt
                                                        .filter(
                                                            (subpro) =>
                                                                filterState?.location?.map(items => items?.value)?.includes(subpro.location)
                                                                &&
                                                                subpro.empdistribution === true &&
                                                                filterState?.company?.map(items => items?.value)?.includes(subpro.company)
                                                                &&
                                                                filterState?.branch?.map(items => items?.value)?.includes(subpro.branch)
                                                                &&
                                                                filterState?.unit?.map(items => items?.value)?.includes(subpro.unit)
                                                                &&
                                                                filterState?.floor?.map(items => items?.value)?.includes(subpro.floor)
                                                                &&
                                                                filterState?.area?.map(items => items?.value)?.includes(subpro.area)
                                                                &&
                                                                filterState?.assetmaterial?.map(items => items?.value)?.includes(subpro.assetmaterial)
                                                        )
                                                        .map((t) => t.component)
                                                        .reduce((acc, curr) => acc.concat(curr), [])
                                                        .map((t) => ({
                                                            ...t,
                                                            label: t,
                                                            value: t,
                                                        }))
                                                        .reduce((acc, curr) => {
                                                            if (
                                                                !acc.some(
                                                                    (obj) => obj.value === curr.value
                                                                )
                                                            ) {
                                                                acc.push(curr);
                                                            }
                                                            return acc;
                                                        }, [])
                                                )
                                            )}
                                            value={filterState?.assetmaterialcode}
                                            onChange={(e) => {
                                                setFilterState((prev) => ({
                                                    ...prev,
                                                    assetmaterialcode: e
                                                }))
                                            }}
                                            valueRenderer={customValueRendererAssetMaterialCode}

                                            labelledBy="Please Select Asset Material Code"
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
                    {isUserRoleCompare?.includes("lticketmaintenancereport") && (
                        <>
                            <Box sx={userStyle.container}>
                                {/* ******************************************************EXPORT Buttons****************************************************** */}
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Typography sx={userStyle.SubHeaderText}>
                                            List Ticket Maintenance Report
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
                                                "excelticketmaintenancereport"
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
                                                "csvticketmaintenancereport"
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
                                                "printticketmaintenancereport"
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
                                                "pdfticketmaintenancereport"
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
                                                "imageticketmaintenancereport"
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
                filename={"TicketMaintenanceReport"}
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
                            View Ticket Maintenance Report
                        </Typography>
                        <br />
                        <Grid container spacing={2}>

                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Ticket Status</Typography>
                                    <Typography sx={{
                                        wordBreak: "break-word",
                                        overflowWrap: "break-word",
                                        whiteSpace: "pre-wrap",
                                    }}>{viewDetails?.raiseself}</Typography>
                                </FormControl>
                            </Grid>

                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Ticket Number</Typography>
                                    <Typography sx={{
                                        wordBreak: "break-word",
                                        overflowWrap: "break-word",
                                        whiteSpace: "pre-wrap",
                                    }}>{viewDetails?.raiseticketcount}</Typography>
                                </FormControl>
                            </Grid>

                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Raised By</Typography>
                                    <Typography sx={{
                                        wordBreak: "break-word",
                                        overflowWrap: "break-word",
                                        whiteSpace: "pre-wrap",
                                    }}>{viewDetails?.raisedby}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Raised Date/Time</Typography>
                                    <Typography sx={{
                                        wordBreak: "break-word",
                                        overflowWrap: "break-word",
                                        whiteSpace: "pre-wrap",
                                    }}>{viewDetails?.raiseddate}</Typography>
                                </FormControl>
                            </Grid>

                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Resolved By</Typography>
                                    <Typography sx={{
                                        wordBreak: "break-word",
                                        overflowWrap: "break-word",
                                        whiteSpace: "pre-wrap",
                                    }}>{viewDetails?.ticketclosed}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Resolved Date/Time</Typography>
                                    <Typography sx={{
                                        wordBreak: "break-word",
                                        overflowWrap: "break-word",
                                        whiteSpace: "pre-wrap",
                                    }}>{viewDetails?.resolvedate}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Material Name</Typography>
                                    <Typography sx={{
                                        wordBreak: "break-word",
                                        overflowWrap: "break-word",
                                        whiteSpace: "pre-wrap",
                                    }}>{viewDetails?.materialnamecut}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Material Code</Typography>
                                    <Typography>{viewDetails?.materialname}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Material Status</Typography>
                                    <Typography>{viewDetails?.materialstatus}</Typography>
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

export default TicketMaintenanceReport;