import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import {
    Box,
    Button,
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
    OutlinedInput,
    Popover,
    Select,
    Switch,
    TextField,
    Typography
} from "@mui/material";
import axios from "axios";
import domtoimage from 'dom-to-image';
import { saveAs } from "file-saver";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { Link } from "react-router-dom";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import AggregatedSearchBar from '../../../components/AggregatedSearchBar';
import AggridTable from "../../../components/AggridTable";
import AlertDialog from "../../../components/Alert";
import { handleApiError } from "../../../components/Errorhandling";
import ExportData from "../../../components/ExportData";
import Headtitle from "../../../components/Headtitle";
import MessageAlert from "../../../components/MessageAlert";
import PageHeading from "../../../components/PageHeading";
import {
    AuthContext,
    UserRoleAccessContext,
} from "../../../context/Appcontext";
import { userStyle } from "../../../pageStyle";
import { SERVICE } from "../../../services/Baseservice";

function RequestVisitorFollowupFilter() {
    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
    const [searchedString, setSearchedString] = useState("")
    const [isHandleChange, setIsHandleChange] = useState(false);
    const [totalProjects, setTotalProjects] = useState(0);

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };

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

    const [fileFormat, setFormat] = useState("");

    let exportColumnNames = ["Company", "Branch",
        "Unit", "Date", "Visitor's ID", "Visitor Name",
        "Visitor Type", "Visitor Mode", "Visitor Purpose",
        "Visitor Contact No", "IN Time", "OUT Time",
    ];
    let exportRowValues = ["company",
        "branch", "unit", "date", "visitorid",
        "visitorname", "visitortype", "visitormode", "visitorpurpose",
        "visitorcontactnumber", "intime", "outtime"];


    const [vendormaster, setVendormaster] = useState([]);
    const [allData, setAllData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const { isUserRoleCompare, pageName, setPageName, buttonStyles, isAssignBranch, isUserRoleAccess } =
        useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    const [vendorCheck, setVendorcheck] = useState(false);
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectAllChecked, setSelectAllChecked] = useState(false);
    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const [filterState, setFilterState] = useState({
        fromdate: "",
        todate: "",
    });
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


                const remove = [window.location.pathname?.substring(1), window.location.pathname]
                return fetfinalurl?.some((item) => remove?.includes(item));
            })
            ?.map((data) => ({
                branch: data.branch,
                company: data.company,
                unit: data.unit,
            }));

    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        actions: true,
        checkbox: true,
        company: true,
        branch: true,
        unit: true,
        date: true,
        serialNumber: true,
        visitorid: true,
        visitorname: true,
        visitortype: true,
        visitormode: true,
        visitorpurpose: true,
        visitorcontactnumber: true,
        intime: true,
        outtime: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(
        initialColumnVisibility
    );

    const [filterUser, setFilterUser] = useState({
        company: "Please Select Company",
        branch: "Please Select Branch",
        fromdate: today,
        todate: today,
        type: "Please Select Type",
        percentage: "",
        day: "Today"
    });

    const daysoptions = [
        { label: "Yesterday", value: "Yesterday" },
        { label: "Last Week", value: "Last Week" },
        { label: "Last Month", value: "Last Month" },
        { label: "Today", value: "Today" },
        { label: "This Week", value: "This Week" },
        { label: "This Month", value: "This Month" },
        { label: "Custom Fields", value: "Custom Fields" },
    ]

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

    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("VisitorsDatewiseFilter"),
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


    useEffect(() => {
        getapi();
    }, []);

    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        };
    }, []);
    useEffect(() => {
        addSerialNumber(vendormaster);
    }, [vendormaster]);
    const gridRef = useRef(null);
    const gridRefTable = useRef(null);

    const searchOverAllTerms = searchQuery.toLowerCase().split(" ");
    const filteredDatas = items?.filter((item) => {
        return searchOverAllTerms.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
        );
    });
    const filteredData = filteredDatas.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    // Create a row data object for the DataGrid
    const rowDataTable = filteredData.map((item, index) => {
        return {
            id: item.id,
            serialNumber: item?.serialNumber,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            date: item.date,
            visitorid: item.visitorid,
            visitorname: item.visitorname,
            visitortype:
                item?.visitortype,
            visitormode:
                item?.visitormode,
            visitorpurpose:
                item?.visitorpurpose,
            visitorcontactnumber: item.visitorcontactnumber,
            intime: item?.intime,
            outtime: item?.outtime,
        };
    });
    const columnDataTable = [
        {
            field: "serialNumber",
            headerName: "S.No",
            flex: 0,
            width: 80,
            minHeight: "40px",
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
            pinned: 'left', lockPinned: true,

        },
        {
            field: "company",
            headerName: "Company",
            flex: 0,
            width: 80,
            minHeight: "40px",
            hide: !columnVisibility.company,
            headerClassName: "bold-header",
            pinned: 'left', lockPinned: true,

        },
        {
            field: "branch",
            headerName: "Branch",
            flex: 0,
            width: 100,
            minHeight: "40px",
            hide: !columnVisibility.branch,
            headerClassName: "bold-header",
        },
        {
            field: "unit",
            headerName: "Unit",
            flex: 0,
            width: 120,
            minHeight: "40px",
            hide: !columnVisibility.unit,
            headerClassName: "bold-header",
        },
        {
            field: "date",
            headerName: "Date",
            flex: 0,
            width: 120,
            minHeight: "40px",
            hide: !columnVisibility.date,
            headerClassName: "bold-header",
        },
        {
            field: "visitorid",
            headerName: "Visitor ID",
            flex: 0,
            width: 120,
            minHeight: "40px",
            hide: !columnVisibility.visitorid,
            headerClassName: "bold-header",
        },
        {
            field: "visitorname",
            headerName: "Visitor Name",
            flex: 0,
            width: 150,
            minHeight: "40px",
            hide: !columnVisibility.visitorname,
            headerClassName: "bold-header",
        },
        {
            field: "visitortype",
            headerName: "Visitor Type",
            flex: 0,
            width: 130,
            minHeight: "40px",
            hide: !columnVisibility.visitortype,
            headerClassName: "bold-header",
        },
        {
            field: "visitormode",
            headerName: "Visitor Mode",
            flex: 0,
            width: 130,
            minHeight: "40px",
            hide: !columnVisibility.visitormode,
            headerClassName: "bold-header",
        },
        {
            field: "visitorpurpose",
            headerName: "Visitor Purpose",
            flex: 0,
            width: 150,
            minHeight: "40px",
            hide: !columnVisibility.visitorpurpose,
            headerClassName: "bold-header",
        },
        {
            field: "visitorcontactnumber",
            headerName: "Visitor Contact Number",
            flex: 0,
            width: 150,
            minHeight: "40px",
            hide: !columnVisibility.visitorcontactnumber,
            headerClassName: "bold-header",
        },
        {
            field: "intime",
            headerName: "IN Time",
            flex: 0,
            width: 100,
            minHeight: "40px",
            hide: !columnVisibility.intime,
            headerClassName: "bold-header",
        },
        {
            field: "outtime",
            headerName: "OUT Time",
            flex: 0,
            width: 100,
            minHeight: "40px",
            hide: !columnVisibility.outtime,
            headerClassName: "bold-header",
        },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 180,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    {isUserRoleCompare?.includes("vrequestvisitorfollowup") && (
                        <Link
                            to={`/interactor/master/viewvisitors/${params.data.id}/datefilter`}
                            style={{ textDecoration: "none", color: "#fff", minWidth: "0px" }}
                        >
                            <Button variant="contained" sx={userStyle.buttonedit}>
                                view
                            </Button>
                        </Link>
                    )}
                </Grid>
            ),
        },
    ];

    // Manage Columns
    const handleOpenManageColumns = (event) => {
        setAnchorEl(event.currentTarget);
        setManageColumnsOpen(true);
    };
    const handleCloseManageColumns = () => {
        setManageColumnsOpen(false);
        setSearchQueryManage("");
    };
    const getRowClassName = (params) => {
        if (selectedRows.includes(params.row.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };
    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };
    // Function to filter columns based on search query
    const filteredColumns = columnDataTable.filter((column) =>
        column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase())
    );
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
                {" "}
                <CloseIcon />{" "}
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
                            Show All{" "}
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
                                    newColumnVisibility[column.field] = false;
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
    // Manage Columns functionality
    const toggleColumnVisibility = (field) => {
        setColumnVisibility((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };
    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    // Error Popup model
    const handleClickOpenerr = () => {
        setVendorcheck(false);
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };
    // Show All Columns functionality
    const handleShowAllColumns = () => {
        const updatedVisibility = { ...columnVisibility };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibility(updatedVisibility);
    };
    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
    };

    //get all  vendordetails.
    const fetchVendor = async () => {
        setPageName(!pageName);
        setVendorcheck(true);
        try {
            let res_vendor = await axios.post(
                SERVICE.ALL_VISITORS,
                {
                    assignbranch: accessbranch,
                },
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );

            const filtereddata = res_vendor?.data?.visitors.filter((item, index) => {
                const itemDate = new Date(item.requestvisitorfollowupdate);
                return (
                    itemDate >= new Date(filterUser.fromdate) &&
                    itemDate <= new Date(filterUser.todate) &&
                    (item.interactorstatus == "requestfollowupvisitor" || item?.requestvisitorfollowupstatus)
                );
            });

            setVendormaster(filtereddata?.map((item, index) => {
                return {
                    id: item._id,
                    serialNumber: index + 1,
                    company: item.company,
                    branch: item.branch,
                    unit: item.unit,
                    date: moment(item.date).format("DD-MM-YYYY"),
                    visitorid: item.visitorid,
                    visitorname: item.visitorname,
                    visitortype:
                        item?.followuparray[item?.followuparray?.length - 1]?.visitortype,
                    visitormode:
                        item?.followuparray[item?.followuparray?.length - 1]?.visitormode,
                    visitorpurpose:
                        item.followuparray[item?.followuparray?.length - 1]?.visitorpurpose,
                    visitorcontactnumber: item.visitorcontactnumber,
                    intime: item?.followuparray[item?.followuparray?.length - 1]?.intime,
                    outtime: item?.followuparray[item?.followuparray?.length - 1]?.outtime,
                };
            }));
            setTotalProjects(filtereddata?.length);
            // setAllData(res_vendor?.data?.visitors);
            setVendorcheck(false);
        } catch (err) {
            setVendorcheck(false);
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const handleClear = (e) => {
        e.preventDefault();
        setFilterUser({
            fromdate: today,
            todate: today,
            type: "Please Select Type",
            percentage: "",
            day: "Today"

        });
        setVendormaster([]);
        setSearchQuery("")
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
    };

    const filterData = () => {
        if (filterUser.fromdate === "") {
            setPopupContentMalert("Please Select From Date");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (filterUser.todate === "") {
            setPopupContentMalert("Please Select To Date");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else {
            setVendorcheck(true);
            fetchVendor();
        }
    };
    // pdf.....
    const gridRefTableImg = useRef(null);
    // image
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Request Visitors FollowUp Filter.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    // Excel
    const fileName = "Visitors";

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Request Visitors FollowUp Filter",
        pageStyle: "print",
    });
    const addSerialNumber = (datas) => {
        setItems(datas);
    };

    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setPage(1);
    };

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

    return (
        <Box>
            <Headtitle title={"REQUEST VISITORS FOLLOWUP FILTER"} />
            <PageHeading
                title="Request Visitors FollowUp Filter"
                modulename="Interactors"
                submodulename="Visitor"
                mainpagename="Request Visitors FollowUp Filter"
                subpagename=""
                subsubpagename=""
            />
            <br />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lrequestvisitorfollowup") && (
                <>
                    <Box sx={userStyle.container}>
                        <Grid container spacing={2}>
                            <Grid item xs={8}>
                                <Typography sx={userStyle.SubHeaderText}>
                                    Request Visitors FollowUp Filter List
                                </Typography>
                            </Grid>
                        </Grid>
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
                                        <MenuItem value={vendormaster?.length}>All</MenuItem>
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
                                        "excelrequestvisitorfollowup"
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
                                    {isUserRoleCompare?.includes("csvrequestvisitorfollowup") && (
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
                                        "printrequestvisitorfollowup"
                                    ) && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                    &ensp;
                                                    <FaPrint />
                                                    &ensp;Print&ensp;
                                                </Button>
                                            </>
                                        )}
                                    {isUserRoleCompare?.includes("pdfrequestvisitorfollowup") && (
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
                                        "imagerequestvisitorfollowup"
                                    ) && (
                                            <>
                                                <Button
                                                    sx={userStyle.buttongrp}
                                                    onClick={handleCaptureImage}
                                                >
                                                    {" "}
                                                    <ImageIcon sx={{ fontSize: "15px" }} />{" "}
                                                    &ensp;Image&ensp;{" "}
                                                </Button>
                                            </>
                                        )}
                                </Box>
                            </Grid>
                            <Grid item md={2} xs={6} sm={6}>
                                <AggregatedSearchBar
                                    columnDataTable={columnDataTable}
                                    setItems={setItems}
                                    addSerialNumber={addSerialNumber}
                                    setPage={setPage}
                                    maindatas={vendormaster}
                                    setSearchedString={setSearchedString}
                                    searchQuery={searchQuery}
                                    setSearchQuery={setSearchQuery}
                                    paginated={false}
                                    totalDatas={vendormaster}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={1}>
                            <Grid item md={3} xs={12} sm={12}>
                                <Typography>&nbsp;</Typography>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "left",
                                        flexWrap: "wrap",
                                        gap: "10px",
                                    }}
                                >
                                    <Button
                                        sx={userStyle.buttongrp}
                                        onClick={handleShowAllColumns}
                                    >
                                        Show All Columns
                                    </Button>
                                    <Button
                                        sx={userStyle.buttongrp}
                                        onClick={handleOpenManageColumns}
                                    >
                                        Manage Columns
                                    </Button>
                                </Box>
                            </Grid>
                            <Grid item md={2} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography sx={{ fontWeight: "500" }}>
                                        Days
                                    </Typography>
                                    <Selects
                                        options={daysoptions}
                                        // styles={colourStyles}
                                        value={{ label: filterUser.day, value: filterUser.day }}
                                        onChange={(e) => {
                                            handleChangeFilterDate(e);
                                            setFilterUser((prev) => ({ ...prev, day: e.value }))
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={2} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        {" "}
                                        From Date
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
                            <Grid item md={2} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        To Date
                                    </Typography>
                                    <OutlinedInput
                                        id="to-date"
                                        type="date"
                                        value={filterUser.todate}
                                        disabled={filterUser.day !== "Custom Fields"}
                                        onChange={(e) => {
                                            const selectedToDate = new Date(e.target.value);
                                            const selectedFromDate = new Date(filterUser.fromdate);
                                            const formattedDatePresent = new Date() // Assuming you have a function to format the current date
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
                            &ensp;
                            <Grid item md={1} xs={12} sm={12}>
                                <Typography>&nbsp;</Typography>
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        filterData();
                                    }}
                                    sx={buttonStyles.buttonsubmit}
                                >
                                    Filter
                                </Button>
                            </Grid>
                            &ensp;
                            <Grid item md={1} xs={12} sm={12}>
                                <Typography>&nbsp;</Typography>
                                <Button sx={buttonStyles.btncancel} onClick={handleClear}>
                                    Clear
                                </Button>
                            </Grid>
                        </Grid>
                        <br />
                        <br />
                        {vendorCheck ? (
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
                                totalDatas={totalProjects}
                                searchQuery={searchedString}
                                handleShowAllColumns={handleShowAllColumns}
                                setFilteredRowData={setFilteredRowData}
                                filteredRowData={filteredRowData}
                                setFilteredChanges={setFilteredChanges}
                                filteredChanges={filteredChanges}
                                gridRefTableImg={gridRefTableImg}
                                itemsList={vendormaster}
                            />
                        )}
                    </Box>
                </>
            )}

            {/* Manage Column */}
            <Popover
                id={id}
                open={isManageColumnsOpen}
                anchorEl={anchorEl}
                onClose={handleCloseManageColumns}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            >
                {" "}
                {manageColumnsContent}{" "}
            </Popover>
            {/* ALERT DIALOG */}
            <Box>
                <Dialog
                    open={isErrorOpen}
                    onClose={handleCloseerr}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent
                        sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
                    >
                        <Typography variant="h6">{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error" onClick={handleCloseerr}>
                            ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
            <br />
            <ExportData
                isFilterOpen={isFilterOpen}
                handleCloseFilterMod={handleCloseFilterMod}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpen}
                isPdfFilterOpen={isPdfFilterOpen}
                setIsPdfFilterOpen={setIsPdfFilterOpen}
                handleClosePdfFilterMod={handleClosePdfFilterMod}
                filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
                itemsTwo={vendormaster ?? []}
                filename={"Request Visitors FollowUp Filter"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
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
        </Box>
    );
}
export default RequestVisitorFollowupFilter;
