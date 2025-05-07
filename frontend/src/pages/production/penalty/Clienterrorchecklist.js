import React, { useContext, useEffect, useRef, useState, useCallback } from "react";
import { Box, Button, FormControl, Grid, MenuItem, OutlinedInput, Popover, Select, Typography, } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import LoadingButton from "@mui/lab/LoadingButton";
import Selects from "react-select";
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
import ManageColumnsContent from "../../../components/ManageColumn";
import AggridTable from "../../../components/AggridTable";
import domtoimage from 'dom-to-image';
import moment from "moment";
import { DeleteConfirmation } from "../../../components/DeleteConfirmation.js";

const ActionCell = ({ rowId, currentRejectReason, onSave, onApprove, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert, setPopupContent, setPopupSeverity, handleClickOpenPopup, auth, filteredErrorData }) => {
    const [showRejectReason, setShowRejectReason] = useState(false);
    const [localRejectReason, setLocalRejectReason] = useState(currentRejectReason);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    const handleRejectClick = () => {
        setShowRejectReason((prev) => !prev);
    };

    const handleSaveClick = async () => {
        onSave(localRejectReason);
        if (localRejectReason === '') {
            setPopupContentMalert("Please Enter Reject Reason");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else {
            try {
                let res = await axios.put(`${SERVICE.PENALTYCLIENTERROR_SINGLE}/${rowId}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    errorstatus: String("Rejected"),
                    rejectreason: String(localRejectReason),
                });
                await filteredErrorData();
                setPopupContent("Updated Successfully");
                setPopupSeverity("success");
                handleClickOpenPopup();
                setShowRejectReason(false);
            } catch (err) {
                handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
            }
        }
    };

    const handleApproveClick = () => {
        setShowConfirmDialog(true);
        setShowRejectReason(false);
    };

    const handleConfirmApprove = async () => {
        onApprove(rowId); // Call the onApprove callback with the row ID
        try {
            let res = await axios.put(`${SERVICE.PENALTYCLIENTERROR_SINGLE}/${rowId}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                errorstatus: String("Approved"),
            });
            await filteredErrorData();
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setShowConfirmDialog(false);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const handleCancelApprove = () => {
        setShowConfirmDialog(false);
    };

    return (
        <Grid container>
            <Grid item xs={12} sm={3} md={3}>
                <Button variant="contained" color="primary" size="small" sx={{ textTransform: 'capitalize' }} onClick={handleApproveClick}>Approve</Button>
            </Grid>
            <Grid item xs={12} sm={9} md={9}>
                {showRejectReason && (
                    <FormControl size="small">
                        <OutlinedInput
                            placeholder="Reject Reason"
                            variant="outlined"
                            size="small"
                            value={localRejectReason}
                            onChange={(e) => setLocalRejectReason(e.target.value)}
                            fullWidth
                            onPaste={(e) => e.preventDefault()} // Disable paste
                            onCopy={(e) => e.preventDefault()} // Disable copy
                        />
                    </FormControl>
                )}
            </Grid>
            <Grid item xs={12} sm={3} md={3}>
                <Button variant="contained" color="error" size="small" sx={{ textTransform: 'capitalize' }} onClick={handleRejectClick}>Reject</Button>
            </Grid>
            <Grid item xs={12} sm={9} md={9}>
                {showRejectReason && (
                    <Button sx={{ textTransform: 'capitalize' }} variant="contained" color="error" size="small" onClick={handleSaveClick}>Save Reject</Button>
                )}
            </Grid>
            <DeleteConfirmation
                open={showConfirmDialog}
                onClose={handleCancelApprove}
                onConfirm={handleConfirmApprove}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />
        </Grid>
    );
};

function ClientErrorMonthAmount() {

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;

    const gridRefTable = useRef(null);
    const gridRefTabletwo = useRef(null);
    const gridRefTableImg = useRef(null);
    const gridRefTableImgtwo = useRef(null);

    const { auth } = useContext(AuthContext);
    const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);

    const [filterUser, setFilterUser] = useState({ fromdate: "", todate: "", });
    const [clientErrors, setClientErrors] = useState([]);
    const [clientErrorsTwo, setClientErrorsTwo] = useState([]);
    const [loader, setLoader] = useState(false);
    const [loadingdeloverall, setloadingdeloverall] = useState(false);
    const [items, setItems] = useState([]);
    const [itemstwo, setItemstwo] = useState([]);
    const [rejectReasons, setRejectReasons] = useState({});
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedRowstwo, setSelectedRowstwo] = useState([]);

    // State to track advanced filter
    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
    const [isHandleChange, setIsHandleChange] = useState(false);
    const [searchedString, setSearchedString] = useState("");

    const [filteredRowDatatwo, setFilteredRowDatatwo] = useState([]);
    const [filteredChangestwo, setFilteredChangestwo] = useState(null);
    const [isHandleChangetwo, setIsHandleChangetwo] = useState(false);
    const [searchedStringtwo, setSearchedStringtwo] = useState("");

    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");

    //Datatable second Table
    const [pagetwo, setPagetwo] = useState(1);
    const [pageSizetwo, setPageSizetwo] = useState(10);
    const [searchQuerytwo, setSearchQuerytwo] = useState("");

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

    // second table
    const [isFilterOpentwo, setIsFilterOpentwo] = useState(false);
    const [isPdfFilterOpentwo, setIsPdfFilterOpentwo] = useState(false);
    // page refersh reload
    const handleCloseFilterModtwo = () => { setIsFilterOpentwo(false); };
    const handleClosePdfFilterModtwo = () => { setIsPdfFilterOpentwo(false); };

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

    // Manage Columns second Table
    const [searchQueryManagetwo, setSearchQueryManagetwo] = useState("");
    const [isManageColumnsOpentwo, setManageColumnsOpentwo] = useState(false);
    const [anchorEltwo, setAnchorEltwo] = useState(null);
    const handleOpenManageColumnstwo = (event) => {
        setAnchorEltwo(event.currentTarget);
        setManageColumnsOpentwo(true);
    };
    const handleCloseManageColumnstwo = () => {
        setManageColumnsOpentwo(false);
        setSearchQueryManagetwo("");
    };

    const opentwo = Boolean(anchorEltwo);
    const idtwo = opentwo ? "simple-popover" : undefined;

    const [selectedMode, setSelectedMode] = useState("Last Week");
    const mode = [
        { label: "Today", value: "Today" },
        { label: "Tomorrow", value: "Tomorrow" },
        { label: "Yesterday", value: "Yesterday" },
        { label: "This Week", value: "This Week" },
        { label: "This Month", value: "This Month" },
        { label: "Last Week", value: "Last Week" },
        { label: "Last Month", value: "Last Month" },
        { label: "Custom", value: "Custom" }
    ]

    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        };
    }, []);

    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
    };

    //Access Module
    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Client Error CheckList"),
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

    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        vendor: true,
        branch: true,
        employeeid: true,
        employeename: true,
        loginid: true,
        date: true,
        category: true,
        subcategory: true,
        documentnumber: true,
        fieldname: true,
        line: true,
        errorvalue: true,
        correctvalue: true,
        clienterror: true,
        actions: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

    // Show All Columns & Manage Columns second Table
    const initialColumnVisibilitytwo = {
        serialNumber: true,
        vendor: true,
        branch: true,
        employeeid: true,
        employeename: true,
        loginid: true,
        date: true,
        category: true,
        subcategory: true,
        documentnumber: true,
        fieldname: true,
        line: true,
        errorvalue: true,
        correctvalue: true,
        clienterror: true,
        rejectreason: true,
    };
    const [columnVisibilitytwo, setColumnVisibilitytwo] = useState(initialColumnVisibilitytwo);

    useEffect(() => {
        const today = new Date();

        const formatDate = (date) => {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
            const year = date.getFullYear();
            return `${year}-${month}-${day}`;
        };

        if (selectedMode === "Last Week") {
            const startOfLastWeek = new Date(today);
            startOfLastWeek.setDate(today.getDate() - (today.getDay() + 6) % 7 - 7); // Last Monday
            const endOfLastWeek = new Date(startOfLastWeek);
            endOfLastWeek.setDate(startOfLastWeek.getDate() + 6); // Last Sunday
            setFilterUser({ fromdate: formatDate(startOfLastWeek), todate: formatDate(endOfLastWeek) })
        }
    }, []);

    const getDateRange = (mode) => {
        const today = new Date();
        let fromdate, todate;

        const formatDate = (date) => {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
        };

        switch (mode) {
            case "Today":
                fromdate = todate = formatDate(today);
                break;
            case "Tomorrow":
                const tomorrow = new Date(today);
                tomorrow.setDate(today.getDate() + 1);
                fromdate = todate = formatDate(tomorrow);
                break;
            case "Yesterday":
                const yesterday = new Date(today);
                yesterday.setDate(today.getDate() - 1);
                fromdate = todate = formatDate(yesterday);
                break;
            case "This Week":
                const startOfThisWeek = new Date(today);
                startOfThisWeek.setDate(today.getDate() - (today.getDay() + 6) % 7); // Monday
                const endOfThisWeek = new Date(startOfThisWeek);
                endOfThisWeek.setDate(startOfThisWeek.getDate() + 6); // Sunday
                fromdate = formatDate(startOfThisWeek);
                todate = formatDate(endOfThisWeek);
                break;
            case "This Month":
                fromdate = formatDate(new Date(today.getFullYear(), today.getMonth(), 1));
                todate = formatDate(new Date(today.getFullYear(), today.getMonth() + 1, 0));
                break;
            case "Last Week":
                const startOfLastWeek = new Date(today);
                startOfLastWeek.setDate(today.getDate() - (today.getDay() + 6) % 7 - 7); // Last Monday
                const endOfLastWeek = new Date(startOfLastWeek);
                endOfLastWeek.setDate(startOfLastWeek.getDate() + 6); // Last Sunday
                fromdate = formatDate(startOfLastWeek);
                todate = formatDate(endOfLastWeek);
                break;
            case "Last Month":
                fromdate = formatDate(new Date(today.getFullYear(), today.getMonth() - 1, 1)); // 1st of last month
                todate = formatDate(new Date(today.getFullYear(), today.getMonth(), 0)); // Last day of last month
                break;
            default:
                fromdate = todate = "";
        }

        return { fromdate, todate };
    };

    const formatDateForInput = (date) => {
        if (isNaN(date.getTime())) {
            return ''; // Return empty if the date is invalid
        }
        return date.toISOString().split("T")[0]; // Converts date to 'yyyy-MM-dd' format
    };

    const filteredErrorData = async () => {
        setPageName(!pageName)
        setLoader(true);
        setloadingdeloverall(true);
        try {
            let res_vendor = await axios.post(SERVICE.PENALTYCLIENTERROR_DATE_FILTER, {
                fromdate: filterUser.fromdate,
                todate: filterUser.todate
            }, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            let itemsWithSerialNumber = res_vendor?.data?.penaltyclienterror?.map((item, index) => (
                {
                    ...item,
                    id: item._id,
                    serialNumber: index + 1,
                    date: moment(item.date).format('DD/MM/YYYY'),
                    errorstatus: item.errorstatus === "Approved" ? "Approved" : "Not Yet"
                })
            );
            let itemsWithSerialNumberTwo = res_vendor?.data?.rejectedpenaltyclienterror?.map((item, index) => (
                {
                    ...item,
                    id: item._id,
                    serialNumber: index + 1,
                    date: moment(item.date).format('DD/MM/YYYY'),
                })
            );
            setClientErrors(itemsWithSerialNumber);
            setFilteredRowData(itemsWithSerialNumber);
            setClientErrorsTwo(itemsWithSerialNumberTwo);
            setLoader(false);
            setloadingdeloverall(false);
        } catch (err) {
            setLoader(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    }

    //submit option for saving
    const handleSubmit = (e) => {
        e.preventDefault();
        if (filterUser.fromdate === '' && filterUser.todate === '') {
            setPopupContentMalert("Please Select Date");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else {
            filteredErrorData();
        }
    };

    const handleClear = () => {
        setPageName(!pageName);
        setSelectedMode("Last Week");
        setClientErrors([]);
        setClientErrorsTwo([]);
        setItems([]);
        const today = new Date();

        const formatDate = (date) => {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
            const year = date.getFullYear();
            return `${year}-${month}-${day}`;
        };

        const startOfLastWeek = new Date(today);
        startOfLastWeek.setDate(today.getDate() - (today.getDay() + 6) % 7 - 7); // Last Monday
        const endOfLastWeek = new Date(startOfLastWeek);
        endOfLastWeek.setDate(startOfLastWeek.getDate() + 6); // Last Sunday
        setFilterUser({ fromdate: formatDate(startOfLastWeek), todate: formatDate(endOfLastWeek) })

        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
    };

    const addSerialNumber = (datas) => {
        setItems(datas);
    };

    useEffect(() => {
        addSerialNumber(clientErrors);
    }, [clientErrors]);

    const addSerialNumbertwo = (datas) => {
        setItemstwo(datas);
    };

    useEffect(() => {
        addSerialNumbertwo(clientErrorsTwo);
    }, [clientErrorsTwo]);

    //Datatable
    const handlePageSizeChange = (event) => {
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

    //Datatable second Table
    const handlePageSizeChangetwo = (event) => {
        setPageSizetwo(Number(event.target.value));
        setPagetwo(1);
    };

    // Split the search query into individual terms
    const searchTermstwo = searchQuerytwo.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatastwo = itemstwo?.filter((item) => {
        return searchTermstwo.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
        );
    });

    const filteredDatatwo = filteredDatastwo.slice((pagetwo - 1) * pageSizetwo, pagetwo * pageSizetwo);
    const totalPagestwo = Math.ceil(filteredDatastwo.length / pageSizetwo);
    const visiblePagestwo = Math.min(totalPagestwo, 3);
    const firstVisiblePagetwo = Math.max(1, pagetwo - 1);
    const lastVisiblePagetwo = Math.min(firstVisiblePagetwo + visiblePagestwo - 1, totalPagestwo);
    const pageNumberstwo = [];
    const indexOfLastItemtwo = pagetwo * pageSizetwo;
    const indexOfFirstItemtwo = indexOfLastItemtwo - pageSizetwo;
    for (let i = firstVisiblePagetwo; i <= lastVisiblePagetwo; i++) {
        pageNumberstwo.push(i);
    }

    const handleApprove = (rowId) => {
        console.log(`Approve button clicked for row ${rowId}`);
    };

    const columnDataTable = [
        { field: "serialNumber", headerName: "SNo", flex: 0, width: 75, hide: !columnVisibility.serialNumber, pinned: 'left', lockPinned: true, },
        { field: "vendor", headerName: "Vendor Name", flex: 0, width: 150, hide: !columnVisibility.vendor, },
        { field: "branch", headerName: "Branch Name", flex: 0, width: 150, hide: !columnVisibility.branch, headerClassName: "bold-header", },
        { field: "employeeid", headerName: "Employee Code", flex: 0, width: 150, hide: !columnVisibility.employeeid, },
        { field: "employeename", headerName: "Employee Name", flex: 0, width: 250, hide: !columnVisibility.employeename, },
        { field: "loginid", headerName: "Login id", flex: 0, width: 120, hide: !columnVisibility.loginid, },
        { field: "date", headerName: "Date", flex: 0, width: 120, hide: !columnVisibility.date, headerClassName: "bold-header", },
        { field: "category", headerName: "Category", flex: 0, width: 250, hide: !columnVisibility.category, },
        { field: "subcategory", headerName: "Subcategory", flex: 0, width: 250, hide: !columnVisibility.subcategory, },
        { field: "documentnumber", headerName: "Document Number", flex: 0, width: 150, hide: !columnVisibility.documentnumber, },
        { field: "fieldname", headerName: "Field Name", flex: 0, width: 150, hide: !columnVisibility.fieldname, },
        { field: "line", headerName: "Line", flex: 0, width: 100, hide: !columnVisibility.line, },
        { field: "errorvalue", headerName: "Error Value", flex: 0, width: 250, hide: !columnVisibility.errorvalue, },
        { field: "correctvalue", headerName: "Correct Value", flex: 0, width: 250, hide: !columnVisibility.correctvalue, },
        { field: "clienterror", headerName: "Client Error", flex: 0, width: 250, hide: !columnVisibility.clienterror, },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 400,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.actions,
            cellRenderer: (params) => (
                <Grid>
                    {params.data.errorstatus === "Approved" ?
                        <Button variant="contained" color="success" size="small" sx={{ textTransform: 'capitalize', cursor: 'default' }}>{params.data.errorstatus}</Button>
                        :
                        <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
                            <ActionCell
                                rowId={params.data.id}
                                currentRejectReason={rejectReasons[params.data.id] || ""}
                                onSave={(rejectreason) => {
                                    setRejectReasons((prev) => ({
                                        ...prev,
                                        [params.data.id]: rejectreason,
                                    }));
                                }}
                                onApprove={handleApprove}
                                setPopupContentMalert={setPopupContentMalert} setPopupSeverityMalert={setPopupSeverityMalert} handleClickOpenPopupMalert={handleClickOpenPopupMalert}
                                setPopupContent={setPopupContent}
                                setPopupSeverity={setPopupSeverity}
                                handleClickOpenPopup={handleClickOpenPopup}
                                auth={auth} filteredErrorData={filteredErrorData}
                            />
                        </Grid>
                    }
                </Grid>
            ),
        },
    ];

    // second table
    const columnDataTabletwo = [
        { field: "serialNumber", headerName: "SNo", flex: 0, width: 75, hide: !columnVisibilitytwo.serialNumber, pinned: 'left', lockPinned: true, },
        { field: "vendor", headerName: "Vendor Name", flex: 0, width: 150, hide: !columnVisibilitytwo.vendor, },
        { field: "branch", headerName: "Branch Name", flex: 0, width: 150, hide: !columnVisibilitytwo.branch, },
        { field: "employeeid", headerName: "Employee Code", flex: 0, width: 150, hide: !columnVisibilitytwo.employeeid, },
        { field: "employeename", headerName: "Employee Name", flex: 0, width: 250, hide: !columnVisibilitytwo.employeename, },
        { field: "loginid", headerName: "Login id", flex: 0, width: 120, hide: !columnVisibilitytwo.loginid, },
        { field: "date", headerName: "Date", flex: 0, width: 120, hide: !columnVisibilitytwo.date, },
        { field: "category", headerName: "Category", flex: 0, width: 250, hide: !columnVisibilitytwo.category, headerClassName: "bold-header", },
        { field: "subcategory", headerName: "Subcategory", flex: 0, width: 250, hide: !columnVisibilitytwo.subcategory, },
        { field: "documentnumber", headerName: "Document Number", flex: 0, width: 150, hide: !columnVisibilitytwo.documentnumber, },
        { field: "fieldname", headerName: "Field Name", flex: 0, width: 150, hide: !columnVisibilitytwo.fieldname, },
        { field: "line", headerName: "Line", flex: 0, width: 100, hide: !columnVisibilitytwo.line, },
        { field: "errorvalue", headerName: "Error Value", flex: 0, width: 250, hide: !columnVisibilitytwo.errorvalue, },
        { field: "correctvalue", headerName: "Correct Value", flex: 0, width: 250, hide: !columnVisibilitytwo.correctvalue, },
        { field: "clienterror", headerName: "Client Error", flex: 0, width: 250, hide: !columnVisibilitytwo.clienterror, },
        { field: "rejectreason", headerName: "Reason", flex: 0, width: 250, hide: !columnVisibilitytwo.rejectreason, },
    ];

    const rowDataTable = filteredData.map((item, index) => {
        return {
            ...item,
        };
    });

    // second Table
    const rowDataTabletwo = filteredDatatwo.map((item, index) => {
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

    // Show All Columns functionality second Table
    const handleShowAllColumnstwo = () => {
        const updatedVisibility = { ...columnVisibilitytwo };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibilitytwo(updatedVisibility);
    };

    // // Function to filter columns based on search query
    const filteredColumns = columnDataTable.filter((column) =>
        column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase())
    );

    // // Function to filter columns based on search query second Table
    const filteredColumnstwo = columnDataTabletwo.filter((column) =>
        column.headerName.toLowerCase().includes(searchQueryManagetwo.toLowerCase())
    );

    // Manage Columns functionality
    const toggleColumnVisibility = (field) => {
        setColumnVisibility((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };

    // Manage Columns functionality secondtable
    const toggleColumnVisibilitytwo = (field) => {
        setColumnVisibilitytwo((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };

    const [fileFormat, setFormat] = useState("");
    let exportColumnNames = ['Vendor Name', 'Branch Name', 'Employee Code', 'Employee Name', 'Login id', 'Date', 'Category', 'Subcategory', 'Document Number', 'Field Name', 'Line', 'Error Value', 'Correct Value', 'Client Error', 'Status'];
    let exportRowValues = ['vendor', 'branch', 'employeeid', 'employeename', 'loginid', 'date', 'category', 'subcategory', 'documentnumber', 'fieldname', 'line', 'errorvalue', 'correctvalue', 'clienterror', 'errorstatus'];

    let exportColumnNamestwo = ['Vendor Name', 'Branch Name', 'Employee Code', 'Employee Name', 'Login id', 'Date', 'Category', 'Subcategory', 'Document Number', 'Field Name', 'Line', 'Error Value', 'Correct Value', 'Client Error', 'Reason'];
    let exportRowValuestwo = ['vendor', 'branch', 'employeeid', 'employeename', 'loginid', 'date', 'category', 'subcategory', 'documentnumber', 'fieldname', 'line', 'errorvalue', 'correctvalue', 'clienterror', 'rejectreason'];

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Approve List",
        pageStyle: "print",
    });

    //print...
    const componentReftwo = useRef();
    const handleprinttwo = useReactToPrint({
        content: () => componentReftwo.current,
        documentTitle: "Reject List",
        pageStyle: "print",
    });

    //image
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Approve List.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    //image second table
    const handleCaptureImagetwo = () => {
        if (gridRefTableImgtwo.current) {
            domtoimage.toBlob(gridRefTableImgtwo.current)
                .then((blob) => {
                    saveAs(blob, "Reject List.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    return (
        <Box>
            <Headtitle title={"Client Error Checklist"} />
            <PageHeading
                title="Client Error Checklist"
                modulename="Quality"
                submodulename="Penalty"
                mainpagename="Process Penalty"
                subpagename="Client Error CheckList"
                subsubpagename=""
            />
            {isUserRoleCompare?.includes("lclienterrorchecklist") && (
                <>
                    <Box sx={userStyle.selectcontainer}>
                        <Grid container spacing={2}>
                            <Grid item md={12} sm={12} xs={12}>
                                <Typography sx={userStyle.importheadtext}> Client Error Checklist</Typography>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography> Filter Mode<b style={{ color: "red" }}>*</b> </Typography>
                                    <Selects
                                        labelId="mode-select-label"
                                        options={mode}
                                        value={{ label: selectedMode, value: selectedMode }}
                                        onChange={(selectedOption) => {
                                            // Reset the date fields to empty strings
                                            let fromdate = '';
                                            let todate = '';

                                            // If a valid option is selected, get the date range
                                            if (selectedOption.value) {
                                                const dateRange = getDateRange(selectedOption.value);
                                                fromdate = dateRange.fromdate; // Already formatted in 'dd-MM-yyyy'
                                                todate = dateRange.todate; // Already formatted in 'dd-MM-yyyy'
                                            }
                                            // Set the state with formatted dates
                                            setFilterUser({
                                                ...filterUser,
                                                fromdate: formatDateForInput(new Date(fromdate.split('-').reverse().join('-'))), // Convert to 'yyyy-MM-dd'
                                                todate: formatDateForInput(new Date(todate.split('-').reverse().join('-'))), // Convert to 'yyyy-MM-dd'
                                            });
                                            setSelectedMode(selectedOption.value); // Update the mode
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography> From Date<b style={{ color: "red" }}>*</b>{" "} </Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="date"
                                        disabled={selectedMode != "Custom"}
                                        value={filterUser.fromdate}
                                        onChange={(e) => {
                                            const selectedDate = e.target.value;
                                            // Ensure that the selected date is not in the future
                                            const currentDate = new Date().toISOString().split("T")[0];
                                            if (selectedDate <= currentDate) {
                                                setFilterUser({ ...filterUser, fromdate: selectedDate, todate: selectedDate });
                                            } else {
                                                // Handle the case where the selected date is in the future (optional)
                                                // You may choose to show a message or take other actions.
                                            }
                                        }}
                                        // Set the max attribute to the current date
                                        inputProps={{ max: new Date().toISOString().split("T")[0] }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>{" "} To Date<b style={{ color: "red" }}>*</b>{" "}</Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="date"
                                        disabled={selectedMode != "Custom"}
                                        value={filterUser.todate}
                                        onChange={(e) => {
                                            const selectedDate = e.target.value;
                                            // Ensure that the selected date is not in the future
                                            const currentDate = new Date().toISOString().split("T")[0];
                                            const fromdateval = filterUser.fromdate != "" && new Date(filterUser.fromdate).toISOString().split("T")[0];
                                            if (filterUser.fromdate == "") {
                                                setPopupContentMalert("Please Select From Date");
                                                setPopupSeverityMalert("warning");
                                                handleClickOpenPopupMalert();
                                            } else if (selectedDate < fromdateval) {
                                                setFilterUser({ ...filterUser, todate: "" });
                                                setPopupContentMalert("To Date should be after or equal to From Date");
                                                setPopupSeverityMalert("warning");
                                                handleClickOpenPopupMalert();
                                            } else if (selectedDate <= currentDate) {
                                                setFilterUser({ ...filterUser, todate: selectedDate });
                                            } else {
                                            }
                                        }}
                                        // Set the max attribute to the current date
                                        inputProps={{ max: new Date().toISOString().split("T")[0], min: filterUser.fromdate !== "" ? filterUser.fromdate : null }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item lg={1.5} md={2} sm={2} xs={6} >
                                <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0, } })}>
                                    <LoadingButton onClick={handleSubmit} loading={loadingdeloverall} sx={buttonStyles.buttonsubmit} loadingPosition="end" variant="contained" >Get List</LoadingButton>
                                </Box>
                            </Grid>
                            <Grid item lg={1} md={2} sm={2} xs={6}>
                                <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0, } })}>
                                    <Button sx={buttonStyles.btncancel} onClick={handleClear} > Clear </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box> <br />

                    {/* ****** Table Start ****** */}
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Approve List</Typography>
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
                            <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center", }} >
                                <Box>
                                    {isUserRoleCompare?.includes("excelclienterrorchecklist") && (
                                        <>
                                            <Button onClick={(e) => { setIsFilterOpen(true); setFormat("xl"); }} sx={userStyle.buttongrp}><FaFileExcel /> &ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvclienterrorchecklist") && (
                                        <>
                                            <Button onClick={(e) => { setIsFilterOpen(true); setFormat("csv"); }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printclienterrorchecklist") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfclienterrorchecklist") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={() => { setIsPdfFilterOpen(true); }}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imageclienterrorchecklist") && (
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
                        </Grid>
                        <br />
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>Show All Columns</Button>&ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>Manage Columns</Button><br /><br />
                        {loader ? (
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
                                    gridRefTableImg={gridRefTableImg}
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
                                    itemsList={clientErrors}
                                    pagenamecheck={"Client Error CheckList"}
                                />
                            </>
                        )}
                    </Box><br />

                    {/* Second Tabale  */}
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Reject List</Typography>
                        </Grid>
                        <Grid container spacing={2} style={userStyle.dataTablestyle}>
                            <Grid item md={2} xs={12} sm={12}>
                                <Box>
                                    <label>Show entries:</label>
                                    <Select
                                        id="pageSizeSelect"
                                        value={pageSizetwo}
                                        MenuProps={{
                                            PaperProps: {
                                                style: {
                                                    maxHeight: 180,
                                                    width: 80,
                                                },
                                            },
                                        }}
                                        onChange={handlePageSizeChangetwo}
                                        sx={{ width: "77px" }}
                                    >
                                        <MenuItem value={1}>1</MenuItem>
                                        <MenuItem value={5}>5</MenuItem>
                                        <MenuItem value={10}>10</MenuItem>
                                        <MenuItem value={25}>25</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
                                        <MenuItem value={100}>100</MenuItem>
                                        <MenuItem value={clientErrorsTwo?.length}>All</MenuItem>
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center", }} >
                                <Box>
                                    {isUserRoleCompare?.includes("excelclienterrorchecklist") && (
                                        <>
                                            <Button onClick={(e) => { setIsFilterOpentwo(true); setFormat("xl"); }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvclienterrorchecklist") && (
                                        <>
                                            <Button onClick={(e) => { setIsFilterOpentwo(true); setFormat("csv"); }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printclienterrorchecklist") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprinttwo}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfclienterrorchecklist") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={() => { setIsPdfFilterOpentwo(true); }}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imageclienterrorchecklist") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleCaptureImagetwo}><ImageIcon sx={{ fontSize: "15px" }} />{" "}&ensp;Image&ensp;</Button>
                                        </>
                                    )}
                                </Box>
                            </Grid>
                            <Grid item md={2} xs={6} sm={6}>
                                <Box>
                                    <AggregatedSearchBar
                                        columnDataTable={columnDataTabletwo}
                                        setItems={setItemstwo}
                                        addSerialNumber={addSerialNumbertwo}
                                        setPage={setPagetwo}
                                        maindatas={clientErrorsTwo}
                                        setSearchedString={setSearchedStringtwo}
                                        searchQuery={searchQuerytwo}
                                        setSearchQuery={setSearchQuerytwo}
                                        paginated={false}
                                        totalDatas={clientErrorsTwo}
                                    />
                                </Box>
                            </Grid>
                        </Grid><br />
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumnstwo}>Show All Columns</Button> &ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnstwo}>Manage Columns</Button><br /><br />
                        {loader ? (
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
                                    rowDataTable={rowDataTabletwo}
                                    columnDataTable={columnDataTabletwo}
                                    columnVisibility={columnVisibilitytwo}
                                    page={pagetwo}
                                    setPage={setPagetwo}
                                    pageSize={pageSizetwo}
                                    totalPages={totalPagestwo}
                                    setColumnVisibility={setColumnVisibilitytwo}
                                    isHandleChange={isHandleChangetwo}
                                    items={itemstwo}
                                    gridRefTable={gridRefTabletwo}
                                    paginated={false}
                                    filteredDatas={filteredDatastwo}
                                    // totalDatas={totalDatas}
                                    selectedRows={selectedRowstwo}
                                    setSelectedRows={setSelectedRowstwo}
                                    searchQuery={searchedStringtwo}
                                    handleShowAllColumns={handleShowAllColumnstwo}
                                    setFilteredRowData={setFilteredRowDatatwo}
                                    filteredRowData={filteredRowDatatwo}
                                    setFilteredChanges={setFilteredChangestwo}
                                    filteredChanges={filteredChangestwo}
                                    gridRefTableImg={gridRefTableImgtwo}
                                    itemsList={clientErrorsTwo}
                                />
                            </>
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
                anchorOrigin={{ vertical: "bottom", horizontal: "left", }} >
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
                id={idtwo}
                open={isManageColumnsOpentwo}
                anchorEl={anchorEltwo}
                onClose={handleCloseManageColumnstwo}
                anchorOrigin={{ vertical: "bottom", horizontal: "left", }} >
                <ManageColumnsContent
                    handleClose={handleCloseManageColumnstwo}
                    searchQuery={searchQueryManagetwo}
                    setSearchQuery={setSearchQueryManagetwo}
                    filteredColumns={filteredColumnstwo}
                    columnVisibility={columnVisibilitytwo}
                    toggleColumnVisibility={toggleColumnVisibilitytwo}
                    setColumnVisibility={setColumnVisibilitytwo}
                    initialColumnVisibility={initialColumnVisibilitytwo}
                    columnDataTable={columnDataTabletwo}
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
                filename={"Approve List"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            {/* second Table */}
            <ExportData
                isFilterOpen={isFilterOpentwo}
                handleCloseFilterMod={handleCloseFilterModtwo}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpentwo}
                isPdfFilterOpen={isPdfFilterOpentwo}
                setIsPdfFilterOpen={setIsPdfFilterOpentwo}
                handleClosePdfFilterMod={handleClosePdfFilterModtwo}
                filteredDataTwo={(filteredChangestwo !== null ? filteredRowDatatwo : rowDataTabletwo) ?? []}
                itemsTwo={clientErrorsTwo ?? []}
                filename={"Reject List"}
                exportColumnNames={exportColumnNamestwo}
                exportRowValues={exportRowValuestwo}
                componentRef={componentReftwo}
            />
            {/* EXTERNAL COMPONENTS -------------- END */}
        </Box>
    );
}

export default ClientErrorMonthAmount;