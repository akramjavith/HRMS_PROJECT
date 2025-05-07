import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
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
    Typography
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
import { useNavigate, useParams } from "react-router-dom";
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
import { userStyle } from "../../pageStyle.js";
import { SERVICE } from "../../services/Baseservice";

import moment from "moment-timezone";



function GroupingPracticeSessionResponse() {
    const groupingid = useParams()?.groupingid;
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
                    "/interview/typingtestpracticequestionsgrouping",
                    "interview/typingtestpracticequestionsgrouping",
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
                    saveAs(blob, "GroupingPracticeSessionResponse.png");
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

            addedby: item?.addedby,
            updatedby: item?.updatedby,
            result: item?.result,
            overallresult: item?.overallresult,
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

















    const [filterLoader, setFilterLoader] = useState(false);
    const [tableLoader, setTableLoader] = useState(false);


    useEffect(() => { fetchReturnData() }, [])
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
                        groupingid: { $eq: groupingid },
                    }
                }
            ]

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

            const itemsWithSerialNumber = response?.data?.preacticeResponse?.map((item, index) => {


                let matechedQuestion = item?.result?.map(quest => quest?.question);


                return {
                    ...item,
                    serialNumber: index + 1,
                    id: item._id,
                    completedat: moment(item.createdAt).format("DD-MM-YYYY hh:mm:ss A"),
                    questions: matechedQuestion?.join(",") || "",
                    category: item?.category?.join(",") || "",
                    subcategory: item?.subcategory?.join(",") || "",
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
            <Headtitle title={"GROUPING PRACTICE SESSION RESPONSE"} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Grouping Practice Session Response"
                modulename="Typing Practice"
                submodulename="Practice Questions Grouping"
                mainpagename=""
                subpagename=""
                subsubpagename=""
            />

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
                                            List Grouping Practice Session Response
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
                filename={"GroupingPracticeSessionResponse"}
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
                            View Grouping Practice Session Response
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

export default GroupingPracticeSessionResponse;