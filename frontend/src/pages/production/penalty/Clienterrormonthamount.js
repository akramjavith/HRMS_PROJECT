import React, { useContext, useEffect, useRef, useState } from "react";
import { Box, Button, Dialog, FormControl, Grid, MenuItem, OutlinedInput, Popover, Select, Typography, } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import LoadingButton from "@mui/lab/LoadingButton";
import axios from "axios";
import { saveAs } from "file-saver";
import "jspdf-autotable";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../../components/Errorhandling";
import Headtitle from "../../../components/Headtitle";
import { AuthContext, UserRoleAccessContext } from "../../../context/Appcontext";
import { userStyle } from "../../../pageStyle";
import { SERVICE } from "../../../services/Baseservice";
import { ThreeDots } from "react-loader-spinner";
import AlertDialog from "../../../components/Alert";
import ExportData from "../../../components/ExportData";
import MessageAlert from "../../../components/MessageAlert";
import PageHeading from "../../../components/PageHeading";
import AggregatedSearchBar from "../../../components/AggregatedSearchBar";
import AggridTable from "../../../components/AggridTable";
import domtoimage from 'dom-to-image';
import ManageColumnsContent from "../../../components/ManageColumn";
import { DeleteConfirmation } from "../../../components/DeleteConfirmation.js";
import moment from 'moment';

function ClientErrorMonthAmount() {

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;

    const gridRefTable = useRef(null);
    const gridRefTableImg = useRef(null);

    const gridRefTableView = useRef(null);
    const gridRefTableImgView = useRef(null);

    const { auth } = useContext(AuthContext);
    const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);

    const [clientError, setClientError] = useState({ fromdate: today, todate: today, name: "" });
    const [clientErrorView, setClientErrorView] = useState([]);
    const [clientErrors, setClientErrors] = useState([]);
    const [items, setItems] = useState([]);
    const [itemsView, setItemsView] = useState([]);
    const [loader, setLoader] = useState(false);
    const [loaderView, setLoaderView] = useState(false);
    const [loadingdeloverall, setloadingdeloverall] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedRowsView, setSelectedRowsView] = useState([]);

    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
    const [isHandleChange, setIsHandleChange] = useState(false);
    const [searchedString, setSearchedString] = useState("");

    const [filteredRowDataView, setFilteredRowDataView] = useState([]);
    const [filteredChangesView, setFilteredChangesView] = useState(null);
    const [isHandleChangeView, setIsHandleChangeView] = useState(false);
    const [searchedStringView, setSearchedStringView] = useState("");

    // Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");

    const [pageView, setPageView] = useState(1);
    const [pageSizeView, setPageSizeView] = useState(10);
    const [searchQueryView, setSearchQueryView] = useState("");

    // View model
    const [openview, setOpenview] = useState(false);
    const handleClickOpenview = () => { setOpenview(true); };
    const handleCloseview = () => { setOpenview(false); };

    // Delete
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const handleClickOpen = () => { setIsDeleteOpen(true); };
    const handleCloseMod = () => { setIsDeleteOpen(false); };

    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
    const handleClickOpenPopupMalert = () => {
        setOpenPopupMalert(true);
        setloadingdeloverall(false);
    };
    const handleClosePopupMalert = () => { setOpenPopupMalert(false); };

    const [openPopup, setOpenPopup] = useState(false);
    const [popupContent, setPopupContent] = useState("");
    const [popupSeverity, setPopupSeverity] = useState("");
    const handleClickOpenPopup = () => { setOpenPopup(true); };
    const handleClosePopup = () => { setOpenPopup(false); };

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
    // page refersh reload
    const handleCloseFilterMod = () => { setIsFilterOpen(false); };
    const handleClosePdfFilterMod = () => { setIsPdfFilterOpen(false); };

    const [isFilterOpenView, setIsFilterOpenView] = useState(false);
    const [isPdfFilterOpenView, setIsPdfFilterOpenView] = useState(false);
    // page refersh reload
    const handleCloseFilterModView = () => { setIsFilterOpenView(false); };
    const handleClosePdfFilterModView = () => { setIsPdfFilterOpenView(false); };

    // Manage Columns
    const [searchQueryManage, setSearchQueryManage] = useState("");
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

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    const [searchQueryManageView, setSearchQueryManageView] = useState("");
    const [isManageColumnsOpenView, setManageColumnsOpenView] = useState(false);
    const [anchorElView, setAnchorElView] = useState(null);

    const handleOpenManageColumnsView = (event) => {
        setAnchorElView(event.currentTarget);
        setManageColumnsOpenView(true);
    };
    const handleCloseManageColumnsView = () => {
        setManageColumnsOpenView(false);
        setSearchQueryManageView("");
    };

    const openView = Boolean(anchorElView);
    const idView = openView ? "simple-popover" : undefined;

    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        fromdate: true,
        todate: true,
        name: true,
        username: true,
        createdate: true,
        actions: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

    const initialColumnVisibilityView = {
        serialNumber: true,
        fromdate: true,
        todate: true,
        employeeid: true,
        employeename: true,
        clientamount: true,
        waiveramount: true,
        totalamount: true,
    };

    const [columnVisibilityView, setColumnVisibilityView] = useState(initialColumnVisibilityView);

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

    //Access Module
    const pathname = window.location.pathname;
    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Client Error Month Amount"),
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

    //add function
    const sendRequest = async () => {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, "0");
        var mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
        var yyyy = today.getFullYear();
        today = yyyy + "-" + mm + "-" + dd;

        setPageName(!pageName)
        setloadingdeloverall(true);
        try {
            let grpcreate = await axios.post(SERVICE.CLIENTERRORMONTHAMOUNT_CREATE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                fromdate: String(clientError.fromdate),
                todate: String(clientError.todate),
                name: String(clientError.name),
                createdby: String(isUserRoleAccess.companyname),
            });
            setClientError(grpcreate.data);
            await fetchAllClient();
            setClientError({ fromdate: today, todate: today, name: "" });
            setPopupContent("Added Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setloadingdeloverall(false);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    //submit option for saving
    const handleSubmit = async (e) => {
        setPageName(!pageName);
        let res = await axios.get(SERVICE.CLIENTERRORMONTHAMOUNT, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
        });
        const overlappingDateRange = res?.data?.clienterrormonthamounts?.some((item) => {
            const itemFromDate = new Date(item.fromdate);
            const itemToDate = new Date(item.todate);
            const clientFromDate = new Date(clientError.fromdate);
            const clientToDate = new Date(clientError.todate);
            return (
                // clientError.name?.toLowerCase() === item.name?.toLowerCase() ||
                (
                    (clientFromDate >= itemFromDate && clientFromDate <= itemToDate) ||
                    (clientToDate >= itemFromDate && clientToDate <= itemToDate) ||
                    (clientFromDate <= itemFromDate && clientToDate >= itemToDate)
                )
            );
        });
        e.preventDefault();
        if (clientError.fromdate === '') {
            setPopupContentMalert("Please Select From Date");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (clientError.todate === '') {
            setPopupContentMalert("Please Select To Date");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (clientError.name === '') {
            setPopupContentMalert("Please Enter Name");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (overlappingDateRange) {
            setPopupContentMalert("Data Already Exists! Choose another date range.");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else {
            sendRequest();
        }
    };

    const fetchAllClient = async () => {
        setPageName(!pageName)
        try {
            let res = await axios.get(SERVICE.CLIENTERRORMONTHAMOUNT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setClientErrors(res?.data?.clienterrormonthamounts?.map((item, index) => ({
                ...item,
                id: item._id,
                serialNumber: index + 1,
                originalfromdate: item.fromdate,
                originaltodate: item.todate,
                fromdate: moment(item.fromdate).format("DD/MM/YYYY"),
                todate: moment(item.todate).format("DD/MM/YYYY"),
                username: item.createdby,
                createdate: moment(item.createdAt).format("DD/MM/YYYY H:mm:ss")
            })));
            setLoader(true);
        } catch (err) {
            setLoader(true);
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    useEffect(() => {
        fetchAllClient();
    }, []);

    const [deleteSource, setDeleteSource] = useState("");
    const rowData = async (id) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.CLIENTERRORMONTHAMOUNT_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setDeleteSource(res?.data?.sclienterrormonthamounts);
            handleClickOpen();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }

    // Alert delete popup
    let Sourcesid = deleteSource?._id;
    const delSource = async () => {
        setPageName(!pageName)
        try {
            if (Sourcesid) {
                await axios.delete(`${SERVICE.CLIENTERRORMONTHAMOUNT_SINGLE}/${Sourcesid}`, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    }
                });
                await fetchAllClient();
                setIsHandleChange(false);
                handleCloseMod();
                setPage(1)
            }
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    // get single row to view....
    const getViewCode = async (rowdata) => {
        setPageName(!pageName)
        try {
            let res = await axios.post(SERVICE.CLIENTERRORMONTHAMOUNT_CONSOLIDATE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                fromdate: rowdata.originalfromdate,
                todate: rowdata.originaltodate,
            });
            handleClickOpenview();
            setClientErrorView(res?.data?.aggregatedData?.map((item, index) => ({
                ...item,
                id: index + 1,
                serialNumber: index + 1,
                fromdate: moment(item.fromdate).format("DD/MM/YYYY"),
                todate: moment(item.todate).format("DD/MM/YYYY"),
                waiveramount: item.amount?.toFixed(2) || 0.00,
                totalamount: (item.clientamount - item.amount).toFixed(2) || 0.00,
            })));
            setLoaderView(true);
        } catch (err) {
            setLoaderView(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const addSerialNumber = (datas) => {
        setItems(datas);
    };

    useEffect(() => {
        addSerialNumber(clientErrors);
    }, [clientErrors]);

    const addSerialNumberView = (datas) => {
        setItemsView(datas);
    };

    useEffect(() => {
        addSerialNumberView(clientErrorView);
    }, [clientErrorView]);

    //Datatable
    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setPage(1);
    };

    const handlePageSizeChangeView = (event) => {
        setPageSize(Number(event.target.value));
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

    const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);
    const totalPages = Math.ceil(filteredDatas.length / pageSize);
    const visiblePages = Math.min(totalPages, 3);
    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);
    const pageNumbers = [];
    const indexOfLastItem = page * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;
    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }

    // Split the search query into individual terms
    const searchTermsView = searchQueryView.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatasView = itemsView?.filter((item) => {
        return searchTermsView.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
        );
    });

    const filteredDataView = filteredDatasView.slice((pageView - 1) * pageSizeView, pageView * pageSizeView);
    const totalPagesView = Math.ceil(filteredDatasView.length / pageSizeView);
    const visiblePagesView = Math.min(totalPagesView, 3);
    const firstVisiblePageView = Math.max(1, pageView - 1);
    const lastVisiblePageView = Math.min(firstVisiblePageView + visiblePagesView - 1, totalPagesView);
    const pageNumbersView = [];
    const indexOfLastItemView = pageView * pageSizeView;
    const indexOfFirstItemView = indexOfLastItemView - pageSizeView;
    for (let i = firstVisiblePageView; i <= lastVisiblePageView; i++) {
        pageNumbersView.push(i);
    }

    const columnDataTable = [
        { field: "serialNumber", headerName: "SNo", flex: 0, width: 75, hide: !columnVisibility.serialNumber, pinned: 'left', lockPinned: true },
        { field: "fromdate", headerName: "From Date", flex: 0, width: 130, hide: !columnVisibility.fromdate, },
        { field: "todate", headerName: "To Date", flex: 0, width: 130, hide: !columnVisibility.todate, },
        { field: "name", headerName: "Name", flex: 0, width: 230, hide: !columnVisibility.name, },
        { field: "username", headerName: "User Name", flex: 0, width: 230, hide: !columnVisibility.username, },
        { field: "createdate", headerName: "Create Date", flex: 0, width: 200, hide: !columnVisibility.createdate, },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 150,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.actions,
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    {isUserRoleCompare?.includes("vclienterrormonthamount") && (
                        <Button sx={userStyle.buttonedit} onClick={() => { getViewCode(params.data); }}>
                            <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("dclienterrormonthamount") && (
                        <Button sx={userStyle.buttondelete} onClick={(e) => { rowData(params.data.id) }}>
                            <DeleteOutlineOutlinedIcon style={{ fontsize: 'large' }} sx={buttonStyles.buttondelete} />
                        </Button>
                    )}
                </Grid>
            ),
        },
    ];

    const columnDataTableView = [
        { field: "serialNumber", headerName: "SNo", flex: 0, width: 75, hide: !columnVisibilityView.serialNumber, pinned: 'left', lockPinned: true },
        { field: "fromdate", headerName: "From Date", flex: 0, width: 130, hide: !columnVisibilityView.fromdate, },
        { field: "todate", headerName: "To Date", flex: 0, width: 130, hide: !columnVisibilityView.todate, },
        { field: "employeeid", headerName: "Emp Code", flex: 0, width: 130, hide: !columnVisibilityView.employeeid, },
        { field: "employeename", headerName: "Name", flex: 0, width: 250, hide: !columnVisibilityView.employeename, },
        { field: "clientamount", headerName: "Client Amount", flex: 0, width: 130, hide: !columnVisibilityView.clientamount, },
        { field: "waiveramount", headerName: "Waiver Amount", flex: 0, width: 130, hide: !columnVisibilityView.waiveramount, },
        { field: "totalamount", headerName: "Total Amount", flex: 0, width: 120, hide: !columnVisibilityView.totalamount, },
    ];

    const rowDataTable = filteredData.map((item, index) => {
        return {
            ...item,
        };
    });

    const rowDataTableView = filteredDataView.map((item, index) => {
        return {
            ...item,
        };
    });

    // Show All Columns functionality
    const handleShowAllColumns = () => {
        const updatedVisibility = { ...columnVisibility };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibility(updatedVisibility);
    };

    const handleShowAllColumnsView = () => {
        const updatedVisibilityView = { ...columnVisibilityView };
        for (const columnKey in updatedVisibilityView) {
            updatedVisibilityView[columnKey] = true;
        }
        setColumnVisibilityView(updatedVisibilityView);
    };

    // Function to filter columns based on search query
    const filteredColumns = columnDataTable.filter((column) =>
        column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase())
    );

    const filteredColumnsView = columnDataTableView.filter((column) =>
        column.headerName.toLowerCase().includes(searchQueryManageView.toLowerCase())
    );

    // Manage Columns functionality
    const toggleColumnVisibility = (field) => {
        setColumnVisibility((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };

    const toggleColumnVisibilityView = (field) => {
        setColumnVisibilityView((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };

    const [fileFormat, setFormat] = useState("");
    let exportColumnNames = ['From Date', 'To Date', 'Name', 'User Name', 'Create Date'];
    let exportRowValues = ['fromdate', 'todate', 'name', 'username', 'createdate'];

    let exportColumnNamesView = ['From Date', 'To Date', 'Emp Code', 'Name', 'Client Amount', 'Waiver Amount', 'Total Amount'];
    let exportRowValuesView = ['fromdate', 'todate', 'employeeid', 'employeename', 'clientamount', 'waiveramount', 'totalamount'];

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Client Error Month Amount List",
        pageStyle: "print",
    });

    const componentRefView = useRef();
    const handleprintView = useReactToPrint({
        content: () => componentRefView.current,
        documentTitle: "Client Error Month Amount Calculation List",
        pageStyle: "print",
    });

    //image
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Client Error Month Amount List.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    const handleCaptureImageView = () => {
        if (gridRefTableImgView.current) {
            domtoimage.toBlob(gridRefTableImgView.current)
                .then((blob) => {
                    saveAs(blob, "Client Error Month Amount Calculation List.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    return (
        <Box>
            <Headtitle title={"Client Error Month Amount"} />
            <PageHeading
                title="Client Error Month Amount"
                modulename="Quality"
                submodulename="Penalty"
                mainpagename="Penalty Calculation"
                subpagename="Client Error Month Amount"
                subsubpagename=""
            />
            {isUserRoleCompare?.includes("aclienterrormonthamount") && (
                <Box sx={userStyle.dialogbox}>
                    <Grid container spacing={2}>
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>
                                Add Client Error Month Amount
                            </Typography>
                        </Grid>
                    </Grid><br />
                    <Grid container spacing={2}>
                        <Grid item md={3} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography>From Date<b style={{ color: "red" }}>*</b></Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="date"
                                    value={clientError.fromdate}
                                    onChange={(e) => {
                                        const selectedDate = e.target.value;
                                        const currentDate = new Date().toISOString().split("T")[0];
                                        if (selectedDate <= currentDate) {
                                            setClientError({ ...clientError, fromdate: selectedDate });
                                        } else {
                                        }
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography>To Date<b style={{ color: "red" }}>*</b></Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="date"
                                    value={clientError.todate}
                                    onChange={(e) => {
                                        const selectedDate = e.target.value;
                                        const fromdateval = clientError.fromdate != "" && new Date(clientError.fromdate).toISOString().split("T")[0];
                                        if (clientError.fromdate == "") {
                                            setPopupContentMalert("Please Select From Date");
                                            setPopupSeverityMalert("warning");
                                            handleClickOpenPopupMalert();
                                        } else if (selectedDate < fromdateval) {
                                            setClientError({ ...clientError, todate: "" });
                                            setPopupContentMalert("To Date should be after or equal to From Date");
                                            setPopupSeverityMalert("warning");
                                            handleClickOpenPopupMalert();
                                        } else {
                                            setClientError({ ...clientError, todate: selectedDate });
                                        }
                                    }}
                                // inputProps={{ max: clientError.todate, min: clientError.fromdate !== "" ? clientError.fromdate : null }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography>Name<b style={{ color: "red" }}>*</b></Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="text"
                                    placeholder="Please Enter Name"
                                    value={clientError.name}
                                    onChange={(e) => {
                                        setClientError({ ...clientError, name: e.target.value });
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} sm={6} xs={6} marginTop={3}>
                            <LoadingButton
                                onClick={handleSubmit}
                                loading={loadingdeloverall}
                                sx={buttonStyles.buttonsubmit}
                                loadingPosition="end"
                                variant="contained"
                            >
                                Create
                            </LoadingButton>
                        </Grid>
                    </Grid>
                </Box>
            )}<br />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lclienterrormonthamount") && (
                <Box sx={userStyle.container}>
                    {/* ******************************************************EXPORT Buttons****************************************************** */}
                    <Grid item xs={8}>
                        <Typography sx={userStyle.importheadtext}>Client Error Month Amount List</Typography>
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
                                    <MenuItem value={clientErrors?.length}>All</MenuItem>
                                </Select>
                            </Box>
                        </Grid>
                        <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center", }}>
                            <Box>
                                {isUserRoleCompare?.includes("excelclienterrormonthamount") && (
                                    <>
                                        <Button onClick={(e) => { setIsFilterOpen(true); setFormat("xl"); }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                    </>
                                )}
                                {isUserRoleCompare?.includes("csvclienterrormonthamount") && (
                                    <>
                                        <Button onClick={(e) => { setIsFilterOpen(true); setFormat("csv"); }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                    </>
                                )}
                                {isUserRoleCompare?.includes("printclienterrormonthamount") && (
                                    <>
                                        <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                    </>
                                )}
                                {isUserRoleCompare?.includes("pdfclienterrormonthamount") && (
                                    <>
                                        <Button sx={userStyle.buttongrp} onClick={() => { setIsPdfFilterOpen(true); }}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                    </>
                                )}
                                {isUserRoleCompare?.includes("imageclienterrormonthamount") && (
                                    <>
                                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}><ImageIcon sx={{ fontSize: "15px" }} />{" "}&ensp;Image&ensp;</Button>
                                    </>
                                )}
                            </Box>
                        </Grid>
                        <Grid item md={2} xs={6} sm={6}>
                            <Box>
                                <AggregatedSearchBar
                                    columnDataTable={columnDataTable}
                                    setItems={setItems}
                                    addSerialNumber={addSerialNumber}
                                    setPage={setPage}
                                    maindatas={clientErrors}
                                    setSearchedString={setSearchedString}
                                    searchQuery={searchQuery}
                                    setSearchQuery={setSearchQuery}
                                    paginated={false}
                                    totalDatas={clientErrors}
                                />
                            </Box>
                        </Grid>
                    </Grid><br />
                    <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>Show All Columns</Button>&ensp;
                    <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>Manage Columns</Button><br /><br />
                    {!loader ? (
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
                                gridRefTable={gridRefTable}
                                paginated={false}
                                filteredDatas={filteredDatas}
                                // totalDatas={totalDatas}
                                selectedRows={selectedRows}
                                setSelectedRows={setSelectedRows}
                                searchQuery={searchedString}
                                handleShowAllColumns={handleShowAllColumns}
                                setFilteredRowData={setFilteredRowData}
                                filteredRowData={filteredRowData}
                                setFilteredChanges={setFilteredChanges}
                                filteredChanges={filteredChanges}
                                gridRefTableImg={gridRefTableImg}
                                itemsList={clientErrors}
                            />
                        </>
                    )}
                </Box>
            )}

            {/* View model */}
            <Dialog
                open={openview}
                onClose={handleClickOpenview}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="lg" fullWidth
                scroll="paper"
                sx={{ marginTop: '95px' }}
            >
                <Box sx={{ padding: "20px 20px" }}>
                    <Grid container spacing={2}>
                        <Grid item md={11} sx={6} xs={12}>
                            <Typography sx={userStyle.HeaderText}>Client Error Month Amount Calculation List</Typography>
                        </Grid>
                        <Grid item md={1} sx={6} xs={12}>
                            <Button variant="contained" sx={buttonStyles.btncancel} onClick={handleCloseview}>{" "}Back{" "}</Button>
                        </Grid>
                    </Grid><br />
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid container spacing={2} style={userStyle.dataTablestyle}>
                            <Grid item md={2} xs={12} sm={12}>
                                <Box>
                                    <label>Show entries:</label>
                                    <Select
                                        id="pageSizeSelect"
                                        value={pageSizeView}
                                        MenuProps={{
                                            PaperProps: {
                                                style: {
                                                    maxHeight: 180,
                                                    width: 80,
                                                },
                                            },
                                        }}
                                        onChange={handlePageSizeChangeView}
                                        sx={{ width: "77px" }}
                                    >
                                        <MenuItem value={1}>1</MenuItem>
                                        <MenuItem value={5}>5</MenuItem>
                                        <MenuItem value={10}>10</MenuItem>
                                        <MenuItem value={25}>25</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
                                        <MenuItem value={100}>100</MenuItem>
                                        <MenuItem value={clientErrorView?.length}>All</MenuItem>
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center", }}>
                                <Box>
                                    {isUserRoleCompare?.includes("excelclienterrormonthamount") && (
                                        <>
                                            <Button onClick={(e) => { setIsFilterOpenView(true); setFormat("xl"); }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvclienterrormonthamount") && (
                                        <>
                                            <Button onClick={(e) => { setIsFilterOpenView(true); setFormat("csv"); }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printclienterrormonthamount") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprintView}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfclienterrormonthamount") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={() => { setIsPdfFilterOpenView(true); }}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imageclienterrormonthamount") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleCaptureImageView}><ImageIcon sx={{ fontSize: "15px" }} />{" "}&ensp;Image&ensp;</Button>
                                        </>
                                    )}
                                </Box>
                            </Grid>
                            <Grid item md={2} xs={6} sm={6}>
                                <Box>
                                    <AggregatedSearchBar
                                        columnDataTable={columnDataTableView}
                                        setItems={setItemsView}
                                        addSerialNumber={addSerialNumberView}
                                        setPage={setPageView}
                                        maindatas={clientErrorView}
                                        setSearchedString={setSearchedStringView}
                                        searchQuery={searchQueryView}
                                        setSearchQuery={setSearchQueryView}
                                        paginated={false}
                                        totalDatas={clientErrorView}
                                    />
                                </Box>
                            </Grid>
                        </Grid><br />
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumnsView}>Show All Columns</Button>&ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsView}>Manage Columns</Button><br /><br />
                        {!loaderView ? (
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
                                <AggridTable
                                    rowDataTable={rowDataTableView}
                                    columnDataTable={columnDataTableView}
                                    columnVisibility={columnVisibilityView}
                                    page={pageView}
                                    setPage={setPageView}
                                    pageSize={pageSizeView}
                                    totalPages={totalPagesView}
                                    setColumnVisibility={setColumnVisibilityView}
                                    isHandleChange={isHandleChangeView}
                                    items={itemsView}
                                    gridRefTable={gridRefTableView}
                                    paginated={false}
                                    filteredDatas={filteredDatasView}
                                    // totalDatas={totalDatasView}
                                    selectedRows={selectedRowsView}
                                    setSelectedRows={setSelectedRowsView}
                                    searchQuery={searchedStringView}
                                    handleShowAllColumns={handleShowAllColumnsView}
                                    setFilteredRowData={setFilteredRowDataView}
                                    filteredRowData={filteredRowDataView}
                                    setFilteredChanges={setFilteredChangesView}
                                    filteredChanges={filteredChangesView}
                                    gridRefTableImg={gridRefTableImgView}
                                    itemsList={clientErrorView}
                                />
                            </>
                        )}
                    </Box>
                </Box>
            </Dialog>

            {/* Manage Column */}
            <Popover
                id={id}
                open={isManageColumnsOpen}
                anchorEl={anchorEl}
                onClose={handleCloseManageColumns}
                anchorOrigin={{ vertical: "bottom", horizontal: "left", }}
            >
                <ManageColumnsContent
                    handleClose={handleCloseManageColumns}
                    searchQuery={searchQueryManage}
                    setSearchQuery={setSearchQueryManage}
                    filteredColumns={filteredColumns}
                    columnVisibility={columnVisibility}
                    toggleColumnVisibility={toggleColumnVisibility}
                    setColumnVisibility={setColumnVisibility}
                    initialColumnVisibility={initialColumnVisibility}
                    columnDataTable={columnDataTable}
                />
            </Popover>

            {/* Manage Column */}
            <Popover
                id={idView}
                open={isManageColumnsOpenView}
                anchorEl={anchorElView}
                onClose={handleCloseManageColumnsView}
                anchorOrigin={{ vertical: "bottom", horizontal: "left", }}
            >
                <ManageColumnsContent
                    handleClose={handleCloseManageColumnsView}
                    searchQuery={searchQueryManageView}
                    setSearchQuery={setSearchQueryManageView}
                    filteredColumns={filteredColumnsView}
                    columnVisibility={columnVisibilityView}
                    toggleColumnVisibility={toggleColumnVisibilityView}
                    setColumnVisibility={setColumnVisibilityView}
                    initialColumnVisibility={initialColumnVisibilityView}
                    columnDataTable={columnDataTableView}
                />
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
                itemsTwo={clientErrors ?? []}
                filename={"Client Error Month Amount"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            <ExportData
                isFilterOpen={isFilterOpenView}
                handleCloseFilterMod={handleCloseFilterModView}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpenView}
                isPdfFilterOpen={isPdfFilterOpenView}
                setIsPdfFilterOpen={setIsPdfFilterOpenView}
                handleClosePdfFilterMod={handleClosePdfFilterModView}
                filteredDataTwo={(filteredChangesView !== null ? filteredRowDataView : rowDataTableView) ?? []}
                itemsTwo={clientErrorView ?? []}
                filename={"Client Error Month Amount Calculation"}
                exportColumnNames={exportColumnNamesView}
                exportRowValues={exportRowValuesView}
                componentRef={componentRefView}
            />
            <DeleteConfirmation
                open={isDeleteOpen}
                onClose={handleCloseMod}
                onConfirm={delSource}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />
            {/* EXTERNAL COMPONENTS -------------- END */}
        </Box>
    );
}

export default ClientErrorMonthAmount;