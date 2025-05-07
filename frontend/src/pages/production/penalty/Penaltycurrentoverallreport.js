import React, { useContext, useEffect, useRef, useState } from "react";
import { Box, Button, Grid, MenuItem, Popover, Select, Typography, FormControl, TextareaAutosize, OutlinedInput, Dialog, DialogContent, DialogActions, IconButton, Table, Paper, TableContainer, TableHead, TableRow, TableBody, TableCell } from "@mui/material";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from "jspdf";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import { saveAs } from "file-saver";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import "jspdf-autotable";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import Headtitle from "../../../components/Headtitle";
import { AuthContext, UserRoleAccessContext } from "../../../context/Appcontext";
import { handleApiError } from "../../../components/Errorhandling";
import { userStyle } from "../../../pageStyle";
import { ThreeDots } from "react-loader-spinner";
import AlertDialog from "../../../components/Alert";
import ExportData from "../../../components/ExportData";
import MessageAlert from "../../../components/MessageAlert";
import AggregatedSearchBar from "../../../components/AggregatedSearchBar";
import AggridTable from "../../../components/AggridTable";
import domtoimage from 'dom-to-image';
import ManageColumnsContent from "../../../components/ManageColumn";
import moment from "moment";

const ActionCell = ({ rowId, currentRejectReason, onSave, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert, setPopupContent, setPopupSeverity, handleClickOpenPopup, auth, filteredErrorData, rowData, isUserRoleAccess }) => {
    const [localRejectReason, setLocalRejectReason] = useState('');

    const today = new Date();
    const date = today.toISOString().split('T')[0];
    const time = today.toTimeString().split(' ')[0];

    const handleSaveClick = async () => {
        onSave(localRejectReason);
        if (localRejectReason === '') {
            setPopupContentMalert("Please Enter Reason");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else {
            try {
                let res_vendor = await axios.post(SERVICE.PENALTYWAIVERMASTER_FOR_PENALTYOVERALL_RESTRICTION, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    fromdate: rowData.actualdate,
                    todate: rowData.actualdate,
                    department: rowData.department,
                    employeename: rowData.name,
                    branch: rowData.branch,
                    processcode: rowData.processcode,
                });

                let result = res_vendor?.data?.penaltywaivermasters;

                if (result?.length === 0) {
                    setPopupContentMalert(`This date range does not have any data matches. Kindly contact the administrator to confirm the 'Penalty Waiver'.`);
                    setPopupSeverityMalert("warning");
                    handleClickOpenPopupMalert();
                } else {
                    let aggregatedData = [];
                    let finalData = [];

                    for (const dep of result || []) {

                        let res_penaltyError = await axios.post(SERVICE.PENALTYDAYUPLOAD_EMPLOYEEWISE_OVER_ALL_REPORT, {
                            empname: isUserRoleAccess.companyname,
                            department: isUserRoleAccess.department,
                            departmentlog: isUserRoleAccess.departmentlog,
                        }, {
                            headers: {
                                Authorization: `Bearer ${auth.APIToken}`,
                            },
                        });
                        // console.log(res_penaltyError?.data?.penaltydayuploaddepdatas, 'res_penaltyError?.data?.penaltydayuploaddepdatas')

                        finalData = res_penaltyError?.data?.penaltydayuploaddepdatas || [];

                        // get only apply data not includes approved in history
                        const calculateClientAmount = (empcode) => {
                            const filteredData = res_penaltyError?.data?.penaltydayuploaddepdatas?.filter((item) => {
                                if (item.empcode === empcode && item.history?.length > 0) {
                                    const hasValidHistory = item.history.some(
                                        (data) => data.mode === "Percentage" && data.status === "Approved"
                                    );
                                    return !hasValidHistory;
                                }
                                return false;
                            }) || [];

                            // console.log(filteredData, 'Filtered Data');
                            return filteredData.reduce((total, item) => total + item.clientamount, 0);
                        };

                        const calculateCount = (empcode) => {
                            const filteredData = res_penaltyError?.data?.penaltydayuploaddepdatas?.filter((item) => {
                                return item.empcode === empcode && item.history?.length > 0;
                            }) || [];

                            return filteredData.length;
                        };

                        const aggregatedForCurrentDep = finalData.reduce((acc, item) => {
                            const existingEmployee = acc.find((entry) => entry.empcode === item.empcode);
                            const totalClientAmount = calculateClientAmount(item.empcode)
                            const totalAppliedCount = calculateCount(item.empcode)

                            if (existingEmployee) {
                                existingEmployee.amount += Number(item.amount);
                                existingEmployee.percentage += Number(item.percentage);
                            } else {
                                acc.push({
                                    empcode: item.empcode,
                                    name: item.name,
                                    totalappliedclientamount: totalClientAmount,
                                    totalappliedcount: totalAppliedCount,
                                    amount: Number(item.amount),
                                    percentage: Number(item.percentage),
                                    waiverallowupto: dep.waiverallowupto,
                                    waiveramountupto: dep.waiveramountupto,
                                    waiverpercentageupto: dep.waiverpercentageupto,
                                    validitydays: dep.validitydays
                                });
                            }

                            return acc;
                        }, []);

                        aggregatedData.push(...aggregatedForCurrentDep);

                    }
                    // console.log(aggregatedData, 'aggregatedData');
                    // Convert createdAt to a moment object
                    let createdAtMoment = moment(rowData.createdAt);

                    // Calculate waiver close time (createdAt + validity days in hours)
                    let waiverCloseTime = createdAtMoment.add(rowData.validitydays * 24, "hours");

                    // Get remaining seconds instead of hours
                    let remainingSeconds = waiverCloseTime.diff(moment(), "seconds");

                    // Set waivercloseon message with precise timing
                    let waivercloseon =
                        remainingSeconds > 0
                            ? `${Math.floor(remainingSeconds / 3600)} Hours ${Math.floor((remainingSeconds % 3600) / 60)} Minutes ${remainingSeconds % 60} Seconds`
                            : "Request Hours Limit Closed";

                    // Perform validation on aggregatedData
                    for (const data of aggregatedData) {
                        // Calculate approved amount,count and applied client amount, count
                        const totalAmount = data.totalappliedclientamount;
                        const remainingAmount = data.waiveramountupto - totalAmount;
                        const totalCount = data.totalappliedcount;
                        const remainingCount = data.waiverallowupto - totalCount;

                        if (totalCount === data.waiverallowupto) {
                            setPopupContentMalert("Waiver count is reached, you cannot apply.");
                            setPopupSeverityMalert("warning");
                            handleClickOpenPopupMalert();
                            return;
                        }
                        else if (rowData.clientamount > remainingAmount) {
                            setPopupContentMalert(`You have only ${remainingAmount} amount to apply waiver.`);
                            setPopupSeverityMalert("warning");
                            handleClickOpenPopupMalert();
                            return;
                        }
                        else if ([rowData].length > remainingCount) {
                            setPopupContentMalert("Waiver count is reached, you cannot apply.");
                            setPopupSeverityMalert("warning");
                            handleClickOpenPopupMalert();
                            return;
                        }
                        else if ((totalCount > data.waiverallowupto && totalAmount <= data.waiveramountupto)) {
                            setPopupContentMalert("Waiver count is reached, you cannot apply.");
                            setPopupSeverityMalert("warning");
                            handleClickOpenPopupMalert();
                            return;
                        }
                        else if (totalAmount > data.waiveramountupto && totalCount <= data.waiverallowupto) {
                            setPopupContentMalert("Waiver amount is reached, you cannot apply.");
                            setPopupSeverityMalert("warning");
                            handleClickOpenPopupMalert();
                            return;
                        }
                        else {
                            if (waivercloseon === "Request Hours Limit Closed") {
                                await filteredErrorData();
                                setPopupContentMalert("Request Hours Limit Closed, you cannot apply.");
                                setPopupSeverityMalert("warning");
                                handleClickOpenPopupMalert();
                            } else {
                                let res = await axios.post(SERVICE.PENALTYDAYUPLOAD_UPDATE_FOR_OVERALL, {
                                    headers: {
                                        Authorization: `Bearer ${auth.APIToken}`,
                                    },
                                    date: rowData.actualdate,
                                    uploaddata_id: rowId,
                                    history: [
                                        {
                                            tablename: 'Penalty Over All Report_Current Process Table',
                                            date: date,
                                            time: time,
                                            status: "Sent",
                                            reason: localRejectReason,
                                            mode: "",
                                        }
                                    ]
                                });
                                await filteredErrorData();
                                setPopupContent("Request Sent Successfully");
                                setPopupSeverity("success");
                                handleClickOpenPopup();

                                // Calculate approved amount,count and applied client amount, count
                                const totalAmount = data.totalappliedclientamount;
                                const totalCount = data.totalappliedcount + [rowData].length;
                                const remainingCount = data.waiverallowupto - totalCount;

                                // Calculate remaining values
                                const remainingAmount = data.waiveramountupto - (totalAmount !== 0 ? totalAmount : rowData.clientamount);

                                // Create an array of remaining values with their labels
                                const remaining = [
                                    { type: "amount", value: remainingAmount },
                                    { type: "count", value: remainingCount }
                                ];

                                // Filter for positive remaining values and sort by the smallest
                                const sortedRemaining = remaining
                                    .filter(item => item.value > 0)
                                    .sort((a, b) => a.value - b.value);

                                // Show alert for the first least remaining value
                                if (sortedRemaining.length > 0) {
                                    const least = sortedRemaining[0];
                                    // console.log(least.value)
                                    let message;
                                    if (least.type === "count") {
                                        message = `You have remaining ${least.value} count to apply waiver.`;
                                    } else if (least.type === "amount") {
                                        message = `You have remaining ${least.value} amount to apply waiver.`;
                                    }

                                    setPopupContentMalert(message);
                                    setPopupSeverityMalert("info");
                                    handleClickOpenPopupMalert();
                                    return;
                                }
                            }
                        }
                    }
                }
            } catch (err) {
                handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
            }
        }
    };

    return (
        <Grid container>
            <Grid item xs={12} sm={12} md={12}>
                <FormControl size="small" fullWidth>
                    <TextareaAutosize
                        aria-label="maximum height"
                        minRows={3}
                        maxRows={3}
                        value={localRejectReason}
                        placeholder="Please Enter Reason"
                        onChange={(e) => { setLocalRejectReason(e.target.value); }}
                        onPaste={(e) => {
                            e.preventDefault();
                            setPopupContentMalert("Copy Paste not allowed, Please type the content manually");
                            setPopupSeverityMalert("warning");
                            handleClickOpenPopupMalert();
                        }}
                        onCopy={(e) => {
                            e.preventDefault();
                            setPopupContentMalert("Copy Paste not allowed, Please type the content manually");
                            setPopupSeverityMalert("warning");
                            handleClickOpenPopupMalert();
                        }}
                        style={{ resize: "none", fontSize: '1rem' }}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={9} md={9}>
                <Button sx={{ textTransform: 'capitalize' }} variant="contained" color="error" size="small" onClick={handleSaveClick}>Sent Request</Button>
            </Grid>
        </Grid>
    );
};

const RecheckReasonCell = ({ rowId, currentRecheckReason, onSave, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert, setPopupContent, setPopupSeverity, handleClickOpenPopup, auth, filteredErrorData, rowData }) => {
    const [localRecheckReason, setLocalRecheckReason] = useState('');

    const today = new Date();
    const date = today.toISOString().split('T')[0];
    // const time = today.toTimeString().split(' ')[0].slice(0, 5); // HH:MM
    const time = today.toTimeString().split(' ')[0]; // HH:MM:SS

    const handleSaveClick = async () => {
        onSave(localRecheckReason);
        if (localRecheckReason === '') {
            setPopupContentMalert("Please Enter Reason");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else {
            try {
                // Combine previousEntry date and time into a single moment object
                let previousEntryTime = moment(`${rowData.previousdate} ${rowData.previoustime}`, "YYYY-MM-DD HH:mm:ss");

                // Calculate waiver close time (previousEntryTime + validity days in hours)
                let waiverCloseTime = previousEntryTime.add(rowData.validitydays * 24, "hours");

                // Calculate remaining hours
                let remainingSeconds = waiverCloseTime.diff(moment(), "seconds");

                // Set waivercloseon message
                let waivercloseon = remainingSeconds > 0
                    ? `${Math.floor(remainingSeconds / 3600)} Hours ${Math.floor((remainingSeconds % 3600) / 60)} Minutes ${remainingSeconds % 60} Seconds`
                    : "Request Hours Limit Closed";

                if (waivercloseon === "Request Hours Limit Closed") {
                    await filteredErrorData();
                    setPopupContentMalert("Request Hours Limit Closed, you cannot apply.");
                    setPopupSeverityMalert("warning");
                    handleClickOpenPopupMalert();
                } else {
                    let res = await axios.post(SERVICE.PENALTYDAYUPLOAD_UPDATE_FOR_OVERALL, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        date: rowData.actualdate,
                        uploaddata_id: rowId,
                        history: [
                            // ...rowData.history,
                            {
                                tablename: 'Penalty Over All Report_Recheck',
                                date: date,
                                time: time,
                                status: "Sent Recheck",
                                reason: localRecheckReason,
                                mode: "",
                            }
                        ]
                    });
                    await filteredErrorData();
                    setPopupContent("Request Sent Successfully");
                    setPopupSeverity("success");
                    handleClickOpenPopup();
                }
            } catch (err) {
                handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
            }
        }
    };

    return (
        <Grid container>
            <Grid item xs={12} sm={12} md={12}>
                <FormControl size="small" fullWidth>
                    <TextareaAutosize fullWidth
                        aria-label="maximum height"
                        minRows={3}
                        maxRows={3}
                        value={localRecheckReason}
                        placeholder="Please Enter Reason"
                        onChange={(e) => {
                            setLocalRecheckReason(e.target.value);
                        }}
                        onPaste={(e) => {
                            e.preventDefault();
                            setPopupContentMalert("Copy Paste not allowed, Please type the content manually");
                            setPopupSeverityMalert("warning");
                            handleClickOpenPopupMalert();
                        }}
                        onCopy={(e) => {
                            e.preventDefault();
                            setPopupContentMalert("Copy Paste not allowed, Please type the content manually");
                            setPopupSeverityMalert("warning");
                            handleClickOpenPopupMalert();
                        }}
                        style={{ resize: "none", fontSize: '1rem' }}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={9} md={9}>
                <Button sx={{ textTransform: 'capitalize' }} variant="contained" color="error" size="small" onClick={handleSaveClick}>Sent Request</Button>
            </Grid>
        </Grid>
    );
};

function PenaltyCurrentOverAllReport({ penaltyErrorsThree, penaltyErrorsFour, filteredErrorData, loader, tableCheck, setFilteredRowDataThree, filteredChangesThree, setFilteredChangesThree, filteredRowDataThree, setIsHandleChangeThree, isHandleChangeThree, setSearchedStringThree, searchedStringThree, setFilteredRowDataFour, filteredChangesFour, setFilteredChangesFour, filteredRowDataFour, setIsHandleChangeFour, isHandleChangeFour, setSearchedStringFour, searchedStringFour, isUserRoleAccess }) {

    let cellStyles = {
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        lineHeight: 'normal',
    }

    const gridRefTableThree = useRef(null);
    const gridRefTableFour = useRef(null);
    const gridRefTableImgThree = useRef(null);
    const gridRefTableImgFour = useRef(null);

    const { auth } = useContext(AuthContext);
    const { isUserRoleCompare } = useContext(UserRoleAccessContext);

    const [itemsThree, setItemsThree] = useState([]);
    const [selectedRowsThree, setSelectedRowsThree] = useState([]);
    const [rejectReasonsThree, setRejectReasonsThree] = useState({});
    const [itemsFour, setItemsFour] = useState([]);
    const [selectedRowsFour, setSelectedRowsFour] = useState([]);
    const [recheckReasonsFour, setRecheckReasonsFour] = useState({});

    //Datatable
    const [pageThree, setPageThree] = useState(1);
    const [pageSizeThree, setPageSizeThree] = useState(10);
    const [searchQueryThree, setSearchQueryThree] = useState("");

    //Datatable second Table
    const [pageFour, setPageFour] = useState(1);
    const [pageSizeFour, setPageSizeFour] = useState(10);
    const [searchQueryFour, setSearchQueryFour] = useState("");

    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
    const handleClickOpenPopupMalert = () => { setOpenPopupMalert(true); };
    const handleClosePopupMalert = () => { setOpenPopupMalert(false); };

    const [openPopup, setOpenPopup] = useState(false);
    const [popupContent, setPopupContent] = useState("");
    const [popupSeverity, setPopupSeverity] = useState("");
    const handleClickOpenPopup = () => { setOpenPopup(true); };
    const handleClosePopup = () => { setOpenPopup(false); };

    const [isFilterOpenThree, setIsFilterOpenThree] = useState(false);
    const [isPdfFilterOpenThree, setIsPdfFilterOpenThree] = useState(false);
    // pageThree refersh reload
    const handleCloseFilterModThree = () => { setIsFilterOpenThree(false); };
    const handleClosePdfFilterModThree = () => { setIsPdfFilterOpenThree(false); };

    // second table
    const [isFilterOpenFour, setIsFilterOpenFour] = useState(false);
    const [isPdfFilterOpenFour, setIsPdfFilterOpenFour] = useState(false);
    // pageThree refersh reload
    const handleCloseFilterModFour = () => { setIsFilterOpenFour(false); };
    const handleClosePdfFilterModFour = () => { setIsPdfFilterOpenFour(false); };

    // Manage Columns
    const [searchQueryManageThree, setSearchQueryManageThree] = useState("");
    const [isManageColumnsOpenThree, setManageColumnsOpenThree] = useState(false);
    const [anchorElThree, setAnchorElThree] = useState(null);

    const handleOpenManageColumnsThree = (event) => {
        setAnchorElThree(event.currentTarget);
        setManageColumnsOpenThree(true);
    };
    const handleCloseManageColumnsThree = () => {
        setManageColumnsOpenThree(false);
        setSearchQueryManageThree("");
    };

    const openThree = Boolean(anchorElThree);
    const idThree = openThree ? "simple-popover" : undefined;

    // Manage Columns second Table
    const [searchQueryManageFour, setSearchQueryManageFour] = useState("");
    const [isManageColumnsOpenFour, setManageColumnsOpenFour] = useState(false);
    const [anchorElFour, setAnchorElFour] = useState(null);

    const handleOpenManageColumnsFour = (event) => {
        setAnchorElFour(event.currentTarget);
        setManageColumnsOpenFour(true);
    };
    const handleCloseManageColumnsFour = () => {
        setManageColumnsOpenFour(false);
        setSearchQueryManageFour("");
    };

    const openFour = Boolean(anchorElFour);
    const idFour = openFour ? "simple-popover" : undefined;

    // pageThree refersh reload code
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

    // Show All Columns & Manage Columns
    const initialColumnVisibilityThree = {
        serialNumber: true,
        name: true,
        empcode: true,
        date: true,
        vendorname: true,
        process: true,
        totalfield: true,
        autoerror: true,
        manualerror: true,
        uploaderror: true,
        moved: true,
        notupload: true,
        penalty: true,
        nonpenalty: true,
        bulkupload: true,
        bulkkeying: true,
        clientamount: true,
        edited1: true,
        edited2: true,
        edited3: true,
        edited4: true,
        reject1: true,
        reject2: true,
        reject3: true,
        reject4: true,
        notvalidate: true,
        validateerror: true,
        waiver: true,
        waivererror: true,
        neterror: true,
        per: true,
        percentage: true,
        amount: true,
        reason: true,
        waivercloseon: true,
        actions: true,
    };
    const [columnVisibilityThree, setColumnVisibilityThree] = useState(initialColumnVisibilityThree);

    // Show All Columns & Manage Columns second Table
    const initialColumnVisibilityFour = {
        serialNumber: true,
        name: true,
        empcode: true,
        date: true,
        vendorname: true,
        process: true,
        totalfield: true,
        autoerror: true,
        manualerror: true,
        uploaderror: true,
        moved: true,
        notupload: true,
        penalty: true,
        nonpenalty: true,
        bulkupload: true,
        bulkkeying: true,
        clientamount: true,
        edited1: true,
        edited2: true,
        edited3: true,
        edited4: true,
        reject1: true,
        reject2: true,
        reject3: true,
        reject4: true,
        notvalidate: true,
        validateerror: true,
        waiver: true,
        waivererror: true,
        neterror: true,
        per: true,
        percentage: true,
        amount: true,
        reason: true,
        waivercloseon: true,
        actions: true
    };

    const [columnVisibilityFour, setColumnVisibilityFour] = useState(initialColumnVisibilityFour);

    const addSerialNumberThree = (datas) => {
        setItemsThree(datas);
    };

    useEffect(() => {
        addSerialNumberThree(penaltyErrorsThree);
    }, [penaltyErrorsThree]);

    // second Table
    const addSerialNumberFour = (datas) => {
        setItemsFour(datas);
    };

    useEffect(() => {
        addSerialNumberFour(penaltyErrorsFour);
    }, [penaltyErrorsFour]);

    //Datatable
    const handlePageSizeChangeThree = (event) => {
        setPageSizeThree(Number(event.target.value));
        setSelectedRowsThree([]);
        setPageThree(1);
    };

    // Split the search query into individual terms
    const searchTermsThree = searchQueryThree.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatasThree = itemsThree?.filter((item) => {
        return searchTermsThree.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
        );
    });
    const filteredDataThree = filteredDatasThree.slice((pageThree - 1) * pageSizeThree, pageThree * pageSizeThree);
    const totalPagesThree = Math.ceil(filteredDatasThree.length / pageSizeThree);
    const visiblePagesThree = Math.min(totalPagesThree, 3);
    const firstVisiblePageThree = Math.max(1, pageThree - 1);
    const lastVisiblePageThree = Math.min(firstVisiblePageThree + visiblePagesThree - 1, totalPagesThree);
    const pageNumbersThree = [];
    const indexOfLastItemThree = pageThree * pageSizeThree;
    const indexOfFirstItemThree = indexOfLastItemThree - pageSizeThree;
    for (let i = firstVisiblePageThree; i <= lastVisiblePageThree; i++) {
        pageNumbersThree.push(i);
    }

    //Datatable second Table
    const handlePageSizeChangeFour = (event) => {
        setPageSizeFour(Number(event.target.value));
        setSelectedRowsFour([]);
        setPageFour(1);
    };

    // Split the search query into individual terms
    const searchTermsFour = searchQueryFour.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatasFour = itemsFour?.filter((item) => {
        return searchTermsFour.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
        );
    });
    const filteredDataFour = filteredDatasFour.slice((pageFour - 1) * pageSizeFour, pageFour * pageSizeFour);
    const totalPagesFour = Math.ceil(filteredDatasFour.length / pageSizeFour);
    const visiblePagesFour = Math.min(totalPagesFour, 3);
    const firstVisiblePageFour = Math.max(1, pageFour - 1);
    const lastVisiblePageFour = Math.min(firstVisiblePageFour + visiblePagesFour - 1, totalPagesFour);
    const pageNumbersFour = [];
    const indexOfLastItemFour = pageFour * pageSizeFour;
    const indexOfFirstItemFour = indexOfLastItemFour - pageSizeFour;
    for (let i = firstVisiblePageFour; i <= lastVisiblePageFour; i++) {
        pageNumbersFour.push(i);
    }

    const columnDataTableThree = [
        { field: "serialNumber", headerName: "SNo", flex: 0, width: 75, hide: !columnVisibilityThree.serialNumber, pinned: 'left', lockPinned: true, },
        { field: "name", headerName: "Employee Name", flex: 0, width: 250, hide: !columnVisibilityThree.name, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "empcode", headerName: "Employee Code", flex: 0, width: 150, hide: !columnVisibilityThree.empcode, },
        { field: "date", headerName: "Date", flex: 0, width: 150, hide: !columnVisibilityThree.date, },
        { field: "vendorname", headerName: "Vendor Name", flex: 0, width: 150, hide: !columnVisibilityThree.vendorname, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "process", headerName: "Process", flex: 0, width: 150, hide: !columnVisibilityThree.process, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "totalfield", headerName: "Total Field", flex: 0, width: 120, hide: !columnVisibilityThree.totalfield, },
        { field: "autoerror", headerName: "Auto Error", flex: 0, width: 120, hide: !columnVisibilityThree.autoerror, },
        { field: "manualerror", headerName: "Manual Error", flex: 0, width: 120, hide: !columnVisibilityThree.manualerror, },
        { field: "uploaderror", headerName: "Upload Error", flex: 0, width: 120, hide: !columnVisibilityThree.uploaderror, },
        { field: "moved", headerName: "Moved", flex: 0, width: 150, hide: !columnVisibilityThree.moved, },
        { field: "notupload", headerName: "Not Upload", flex: 0, width: 150, hide: !columnVisibilityThree.notupload, },
        { field: "penalty", headerName: "Penalty", flex: 0, width: 100, hide: !columnVisibilityThree.penalty, },
        { field: "nonpenalty", headerName: "Non Penalty", flex: 0, width: 120, hide: !columnVisibilityThree.nonpenalty, },
        { field: "bulkupload", headerName: "Bulk Upload", flex: 0, width: 120, hide: !columnVisibilityThree.bulkupload, },
        { field: "bulkkeying", headerName: "Bulk Keying", flex: 0, width: 120, hide: !columnVisibilityThree.bulkkeying, },
        { field: "edited1", headerName: "Edited1", flex: 0, width: 100, hide: !columnVisibilityThree.edited1, },
        { field: "edited2", headerName: "Edited2", flex: 0, width: 100, hide: !columnVisibilityThree.edited2, },
        { field: "edited3", headerName: "Edited3", flex: 0, width: 100, hide: !columnVisibilityThree.edited3, },
        { field: "edited4", headerName: "Edited4", flex: 0, width: 100, hide: !columnVisibilityThree.edited4, },
        { field: "reject1", headerName: "Reject1", flex: 0, width: 100, hide: !columnVisibilityThree.reject1, },
        { field: "reject2", headerName: "Reject2", flex: 0, width: 100, hide: !columnVisibilityThree.reject2, },
        { field: "reject3", headerName: "Reject3", flex: 0, width: 100, hide: !columnVisibilityThree.reject3, },
        { field: "reject4", headerName: "Reject4", flex: 0, width: 100, hide: !columnVisibilityThree.reject4, },
        { field: "notvalidate", headerName: "Not Validate", flex: 0, width: 120, hide: !columnVisibilityThree.notvalidate, },
        { field: "validateerror", headerName: "Valid Error", flex: 0, width: 120, hide: !columnVisibilityThree.validateerror, },
        { field: "waiver", headerName: "Waiver %", flex: 0, width: 120, hide: !columnVisibilityThree.waiver, },
        { field: "waivererror", headerName: "Emp-Waiver", flex: 0, width: 120, hide: !columnVisibilityThree.waivererror, },
        { field: "neterror", headerName: "Net Error", flex: 0, width: 120, hide: !columnVisibilityThree.neterror, },
        { field: "per", headerName: "per%", flex: 0, width: 120, hide: !columnVisibilityThree.per, },
        { field: "percentage", headerName: "Percentage", flex: 0, width: 120, hide: !columnVisibilityThree.percentage, },
        { field: "amount", headerName: "Amount", flex: 0, width: 120, hide: !columnVisibilityThree.amount, },
        { field: "reason", headerName: "Reason", flex: 0, width: 120, hide: !columnVisibilityThree.reason, },
        { field: "waivercloseon", headerName: "Waiver Close on", flex: 0, width: 120, hide: !columnVisibilityThree.waivercloseon, cellStyle: cellStyles, headerClass: 'header-wrap', },
        {
            field: "actions", headerName: "Action", flex: 0, width: 350, hide: !columnVisibilityThree.actions, sortable: false, filter: false,
            cellRenderer: (params) => (
                <Grid>
                    {
                        (params.data.history === undefined || params.data.history?.length === 0) ? (
                            <>
                                {params.data.waivercloseon === 'Request Hours Limit Closed' ? (
                                    "Closed"
                                ) : (
                                    <ActionCell
                                        rowId={params.data.id}
                                        currentRejectReason={rejectReasonsThree[params.data.id] || ""}
                                        onSave={(rejectreason) => {
                                            setRejectReasonsThree((prev) => ({
                                                ...prev,
                                                [params.data.id]: rejectreason,
                                            }));
                                        }}
                                        setPopupContentMalert={setPopupContentMalert} setPopupSeverityMalert={setPopupSeverityMalert} handleClickOpenPopupMalert={handleClickOpenPopupMalert}
                                        setPopupContent={setPopupContent}
                                        setPopupSeverity={setPopupSeverity}
                                        handleClickOpenPopup={handleClickOpenPopup}
                                        auth={auth} filteredErrorData={filteredErrorData} rowData={params.data} isUserRoleAccess={isUserRoleAccess}
                                    />
                                )}
                            </>
                        ) :
                            (params.data.history !== undefined && params.data.history?.length > 0
                                && (params.data.history[params.data.history.length - 1].tablename === "Client Error Waiver Approval_Approved"
                                    || params.data.history[params.data.history.length - 1].tablename === "Client Error Waiver Approval_Reject"
                                    || params.data.history[params.data.history.length - 1].tablename === "Client Error Waiver Approval_Resent"
                                    || params.data.history[params.data.history.length - 1].tablename === "Client Error Waiver Approval_NaN"
                                    || params.data.history[params.data.history.length - 1].tablename === "Client Error Waiver Approval_Wait"
                                )) ?
                                <>{params.data.history[params.data.history.length - 1].status}</>
                                : null
                    }
                </Grid>
            ),
        },
    ];

    // second table
    const columnDataTableFour = [
        { field: "serialNumber", headerName: "SNo", flex: 0, width: 75, hide: !columnVisibilityFour.serialNumber, pinned: 'left', lockPinned: true, },
        { field: "name", headerName: "Employee Name", flex: 0, width: 250, hide: !columnVisibilityFour.name, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "empcode", headerName: "Employee Code", flex: 0, width: 150, hide: !columnVisibilityFour.empcode, },
        { field: "date", headerName: "Date", flex: 0, width: 150, hide: !columnVisibilityFour.date, },
        { field: "vendorname", headerName: "Vendor Name", flex: 0, width: 150, hide: !columnVisibilityFour.vendorname, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "process", headerName: "Process", flex: 0, width: 150, hide: !columnVisibilityFour.process, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "totalfield", headerName: "Total Field", flex: 0, width: 120, hide: !columnVisibilityFour.totalfield, },
        { field: "autoerror", headerName: "Auto Error", flex: 0, width: 120, hide: !columnVisibilityFour.autoerror, },
        { field: "manualerror", headerName: "Manual Error", flex: 0, width: 120, hide: !columnVisibilityFour.manualerror, },
        { field: "uploaderror", headerName: "Upload Error", flex: 0, width: 120, hide: !columnVisibilityFour.uploaderror, },
        { field: "moved", headerName: "Moved", flex: 0, width: 150, hide: !columnVisibilityFour.moved, },
        { field: "notupload", headerName: "Not Upload", flex: 0, width: 150, hide: !columnVisibilityFour.notupload, },
        { field: "penalty", headerName: "Penalty", flex: 0, width: 100, hide: !columnVisibilityFour.penalty, },
        { field: "nonpenalty", headerName: "Non Penalty", flex: 0, width: 120, hide: !columnVisibilityFour.nonpenalty, },
        { field: "bulkupload", headerName: "Bulk Upload", flex: 0, width: 120, hide: !columnVisibilityFour.bulkupload, },
        { field: "bulkkeying", headerName: "Bulk Keying", flex: 0, width: 120, hide: !columnVisibilityFour.bulkkeying, },
        { field: "edited1", headerName: "Edited1", flex: 0, width: 100, hide: !columnVisibilityFour.edited1, },
        { field: "edited2", headerName: "Edited2", flex: 0, width: 100, hide: !columnVisibilityFour.edited2, },
        { field: "edited3", headerName: "Edited3", flex: 0, width: 100, hide: !columnVisibilityFour.edited3, },
        { field: "edited4", headerName: "Edited4", flex: 0, width: 100, hide: !columnVisibilityFour.edited4, },
        { field: "reject1", headerName: "Reject1", flex: 0, width: 100, hide: !columnVisibilityFour.reject1, },
        { field: "reject2", headerName: "Reject2", flex: 0, width: 100, hide: !columnVisibilityFour.reject2, },
        { field: "reject3", headerName: "Reject3", flex: 0, width: 100, hide: !columnVisibilityFour.reject3, },
        { field: "reject4", headerName: "Reject4", flex: 0, width: 100, hide: !columnVisibilityFour.reject4, },
        { field: "notvalidate", headerName: "Not Validate", flex: 0, width: 120, hide: !columnVisibilityFour.notvalidate, },
        { field: "validateerror", headerName: "Valid Error", flex: 0, width: 120, hide: !columnVisibilityFour.validateerror, },
        { field: "waiver", headerName: "Waiver %", flex: 0, width: 120, hide: !columnVisibilityFour.waiver, },
        { field: "waivererror", headerName: "Emp-Waiver", flex: 0, width: 120, hide: !columnVisibilityFour.waivererror, },
        { field: "neterror", headerName: "Net Error", flex: 0, width: 120, hide: !columnVisibilityFour.neterror, },
        { field: "per", headerName: "per%", flex: 0, width: 120, hide: !columnVisibilityFour.per, },
        { field: "percentage", headerName: "Percentage", flex: 0, width: 120, hide: !columnVisibilityFour.percentage, },
        { field: "amount", headerName: "Amount", flex: 0, width: 120, hide: !columnVisibilityFour.amount, },
        { field: "reason", headerName: "Reason", flex: 0, width: 120, hide: !columnVisibilityFour.reason, },
        { field: "waivercloseon", headerName: "Waiver Close on", flex: 0, width: 120, hide: !columnVisibilityFour.waivercloseon, cellStyle: cellStyles, headerClass: 'header-wrap', },
        {
            field: "actions", headerName: "Action", flex: 0, width: 350, hide: !columnVisibilityFour.actions, sortable: false, filter: false,
            cellRenderer: (params) => (
                <Grid>
                    {params.data.waivercloseon === 'Request Hours Limit Closed' ? (
                        "Closed"
                    ) : (
                        <RecheckReasonCell
                            rowId={params.data.id}
                            currentRecheckReason={recheckReasonsFour[params.data.id] || ""}
                            onSave={(rejectreason) => {
                                setRecheckReasonsFour((prev) => ({
                                    ...prev,
                                    [params.data.id]: rejectreason,
                                }));
                            }}
                            setPopupContentMalert={setPopupContentMalert} setPopupSeverityMalert={setPopupSeverityMalert} handleClickOpenPopupMalert={handleClickOpenPopupMalert}
                            setPopupContent={setPopupContent}
                            setPopupSeverity={setPopupSeverity}
                            handleClickOpenPopup={handleClickOpenPopup}
                            auth={auth} filteredErrorData={filteredErrorData} rowData={params.data}
                        />
                    )}
                </Grid>
            ),
        },
    ];

    const rowDataTableThree = filteredDataThree.map((item, index) => {
        return {
            ...item,
        };
    });
    // second Table
    const rowDataTableFour = filteredDataFour.map((item, index) => {
        return {
            ...item,
        };
    });

    // Show All Columns functionality
    const handleShowAllColumnsThree = () => {
        const updatedVisibility = { ...columnVisibilityThree };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibilityThree(updatedVisibility);
    };

    // Show All Columns functionality second Table
    const handleShowAllColumnsFour = () => {
        const updatedVisibility = { ...columnVisibilityFour };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibilityFour(updatedVisibility);
    };

    // Function to filter columns based on search query
    const filteredColumnsThree = columnDataTableThree.filter((column) =>
        column.headerName.toLowerCase().includes(searchQueryManageThree.toLowerCase())
    );

    // Function to filter columns based on search query second Table
    const filteredColumnsFour = columnDataTableFour.filter((column) =>
        column.headerName.toLowerCase().includes(searchQueryManageFour.toLowerCase())
    );

    // Manage Columns functionality
    const toggleColumnVisibilityThree = (field) => {
        setColumnVisibilityThree((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };

    // Manage Columns functionality secondtable
    const toggleColumnVisibilityFour = (field) => {
        setColumnVisibilityFour((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };

    // Exports
    const [fileFormat, setFormat] = useState("");
    let exportColumnNamesThree = ['Employee Name', 'Employee Code', 'Date', 'Vendor Name', 'Process', 'Total Field', 'Auto Error', 'Manual Error', 'Upload Error', 'Moved', 'Not Upload', 'Penalty', 'Non Penalty', 'Bulk Upload', 'Bulk Keying',
        'Edited1', 'Edited2', 'Edited3', 'Edited4', 'Reject1', 'Reject2', 'Reject3', 'Reject4', 'Not Validate', 'Valid Error', 'Waiver %', 'Emp-Waiver', 'Net Error',
        'per%', 'Percentage', 'Amount', 'Reason', 'Waiver Close on'];
    let exportRowValuesThree = ['name', 'empcode', 'date', 'vendorname', 'process', 'totalfield', 'autoerror', 'manualerror', 'uploaderror', 'moved', 'notupload', 'penalty', 'nonpenalty', 'bulkupload', 'bulkkeying',
        'edited1', 'edited2', 'edited3', 'edited4', 'reject1', 'reject2', 'reject3', 'reject4', 'notvalidate', 'validateerror', 'waiver', 'waivererror', 'neterror',
        'per', 'percentage', 'amount', 'reason', 'waivercloseon'];

    const fileNameFour = "ReCheck Current Process List";
    const fileTypeFour = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtensionFour = fileFormat === "xl" ? '.xlsx' : '.csv';
    const exportToCSVFour = (csvData, fileNameFour) => {
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileTypeFour });
        FileSaver.saveAs(data, fileNameFour + fileExtensionFour);
    }

    const handleExportXLFour = (isfilter) => {
        // Define the table headers
        const headers = ['SNo', 'Employee Name', 'Employee Code', 'Date', 'Vendor Name', 'Process', 'Total Field', 'Auto Error', 'Manual Error', 'Upload Error', 'Moved', 'Not Upload', 'Penalty', 'Non Penalty', 'Bulk Upload', 'Bulk Keying',
            'Edited1', 'Edited2', 'Edited3', 'Edited4', 'Reject1', 'Reject2', 'Reject3', 'Reject4', 'Not Validate', 'Valid Error', 'Waiver %', 'Emp-Waiver', 'Net Error',
            'per%', 'Percentage', 'Amount', 'Reason', 'Waiver Close on'];

        let data = [];
        let resultdata = (filteredChangesFour !== null ? filteredRowDataFour : rowDataTableFour) ?? [];

        if (isfilter === "filtered") {
            data = resultdata.map((row, index) => {
                const reasons = row.reason ? row.reason.split('\n').join('\r\n') : '';
                return [
                    index + 1,
                    row.name,
                    row.empcode,
                    row.date,
                    row.vendorname,
                    row.process,
                    row.totalfield,
                    row.autoerror,
                    row.manualerror,
                    row.uploaderror,
                    row.moved,
                    row.notupload,
                    row.penalty,
                    row.nonpenalty,
                    row.bulkupload,
                    row.bulkkeying,
                    row.edited1,
                    row.edited2,
                    row.edited3,
                    row.edited4,
                    row.reject1,
                    row.reject2,
                    row.reject3,
                    row.reject4,
                    row.notvalidate,
                    row.validateerror,
                    row.waiver,
                    row.waivererror,
                    row.neterror,
                    row.per,
                    row.percentage,
                    row.amount,
                    reasons,
                    row.waivercloseon,
                ];
            });
        } else if (isfilter === "overall") {
            data = penaltyErrorsFour.map((row, index) => {
                const reasons = row.reason ? row.reason.split('\n').join('\r\n') : '';
                return [
                    index + 1,
                    row.name,
                    row.empcode,
                    row.date,
                    row.vendorname,
                    row.process,
                    row.totalfield,
                    row.autoerror,
                    row.manualerror,
                    row.uploaderror,
                    row.moved,
                    row.notupload,
                    row.penalty,
                    row.nonpenalty,
                    row.bulkupload,
                    row.bulkkeying,
                    row.edited1,
                    row.edited2,
                    row.edited3,
                    row.edited4,
                    row.reject1,
                    row.reject2,
                    row.reject3,
                    row.reject4,
                    row.notvalidate,
                    row.validateerror,
                    row.waiver,
                    row.waivererror,
                    row.neterror,
                    row.per,
                    row.percentage,
                    row.amount,
                    reasons,
                    row.waivercloseon,
                ];
            });
        }

        // Add headers to the data array
        const formattedData = data.map(row => {
            const rowData = {};
            headers.forEach((header, index) => {
                rowData[header] = row[index];
            });
            return rowData;
        });

        // Export to CSV
        exportToCSVFour(formattedData, fileNameFour);
        setIsFilterOpenFour(false);
    };

    //print...
    const componentRefThree = useRef();
    const handleprintThree = useReactToPrint({
        content: () => componentRefThree.current,
        documentTitle: "Current Process List",
        pageStyle: "print",
    });

    //print...
    const componentRefFour = useRef();
    const handleprintFour = useReactToPrint({
        content: () => componentRefFour.current,
        documentTitle: "ReCheck Current Process List",
        pageStyle: "print",
    });

    // pdf
    const downloadPdfFour = (isfilter) => {
        const doc = new jsPDF({ orientation: 'landscape' });

        // Define the table headers
        const headers = ['SNo', 'Employee Name', 'Employee Code', 'Date', 'Vendor Name', 'Process', 'Total Field', 'Auto Error', 'Manual Error', 'Upload Error', 'Moved', 'Not Upload', 'Penalty', 'Non Penalty', 'Bulk Upload', 'Bulk Keying',
            'Edited1', 'Edited2', 'Edited3', 'Edited4', 'Reject1', 'Reject2', 'Reject3', 'Reject4', 'Not Validate', 'Valid Error', 'Waiver %', 'Emp-Waiver', 'Net Error',
            'per%', 'Percentage', 'Amount', 'Reason', 'Waiver Close on'];

        let data = [];
        let resultdata = (filteredChangesFour !== null ? filteredRowDataFour : rowDataTableFour) ?? [];


        if (isfilter === "filtered") {
            data = resultdata.map((row, index) => {
                const reasons = row.reason ? row.reason.split('\n').join('\r\n') : '';
                return [
                    index + 1,
                    row.name,
                    row.empcode,
                    row.date,
                    row.vendorname,
                    row.process,
                    row.totalfield,
                    row.autoerror,
                    row.manualerror,
                    row.uploaderror,
                    row.moved,
                    row.notupload,
                    row.penalty,
                    row.nonpenalty,
                    row.bulkupload,
                    row.bulkkeying,
                    row.edited1,
                    row.edited2,
                    row.edited3,
                    row.edited4,
                    row.reject1,
                    row.reject2,
                    row.reject3,
                    row.reject4,
                    row.notvalidate,
                    row.validateerror,
                    row.waiver,
                    row.waivererror,
                    row.neterror,
                    row.per,
                    row.percentage,
                    row.amount,
                    reasons,
                    row.waivercloseon,
                ];
            });
        } else if (isfilter === "overall") {
            data = penaltyErrorsFour.map((row, index) => {
                const reasons = row.reason ? row.reason.split('\n').join('\r\n') : '';
                return [
                    index + 1,
                    row.name,
                    row.empcode,
                    row.date,
                    row.vendorname,
                    row.process,
                    row.totalfield,
                    row.autoerror,
                    row.manualerror,
                    row.uploaderror,
                    row.moved,
                    row.notupload,
                    row.penalty,
                    row.nonpenalty,
                    row.bulkupload,
                    row.bulkkeying,
                    row.edited1,
                    row.edited2,
                    row.edited3,
                    row.edited4,
                    row.reject1,
                    row.reject2,
                    row.reject3,
                    row.reject4,
                    row.notvalidate,
                    row.validateerror,
                    row.waiver,
                    row.waivererror,
                    row.neterror,
                    row.per,
                    row.percentage,
                    row.amount,
                    reasons,
                    row.waivercloseon,
                ];
            });
        }

        // Split data into chunks to fit on pages
        const columnsPerSheet = 10; // Number of columns per sheet
        const chunks = [];

        for (let i = 0; i < headers.length; i += columnsPerSheet) {
            const chunkHeaders = headers.slice(i, i + columnsPerSheet);
            const chunkData = data.map(row => row.slice(i, i + columnsPerSheet + 1));

            chunks.push({ headers: chunkHeaders, data: chunkData });
        }

        chunks.forEach((chunk, index) => {
            if (index > 0) {
                doc.addPage({ orientation: "landscape" });
            }

            doc.autoTable({
                theme: "grid",
                styles: { fontSize: 8 },
                head: [chunk.headers],
                body: chunk.data,
                startY: 20,
                margin: { top: 20, left: 10, right: 10, bottom: 10 },
            });
        });

        doc.save("ReCheck Current Process List.pdf");
    };

    //image
    const handleCaptureImageThree = () => {
        if (gridRefTableImgThree.current) {
            domtoimage.toBlob(gridRefTableImgThree.current)
                .then((blob) => {
                    saveAs(blob, "Current Process List.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    //image second table
    const handleCaptureImageFour = () => {
        if (gridRefTableImgFour.current) {
            domtoimage.toBlob(gridRefTableImgFour.current)
                .then((blob) => {
                    saveAs(blob, "ReCheck Current Process List.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    return (
        <Box>
            <Headtitle title={"Penalty Over All Report"} />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lpenaltyoverallreport") && (
                <>
                    {tableCheck?.includes('Current Process List') ?
                        <>
                            <Box sx={userStyle.container}>
                                {/* ******************************************************EXPORT Buttons****************************************************** */}
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext}>Current Process List</Typography>
                                </Grid>
                                <Grid container spacing={2} style={userStyle.dataTablestyle}>
                                    <Grid item md={2} xs={12} sm={12}>
                                        <Box>
                                            <label>Show entries:</label>
                                            <Select
                                                id="pageSizeSelect"
                                                value={pageSizeThree}
                                                MenuProps={{
                                                    PaperProps: {
                                                        style: {
                                                            maxHeight: 180,
                                                            width: 80,
                                                        },
                                                    },
                                                }}
                                                onChange={handlePageSizeChangeThree}
                                                sx={{ width: "77px" }}
                                            >
                                                <MenuItem value={1}>1</MenuItem>
                                                <MenuItem value={5}>5</MenuItem>
                                                <MenuItem value={10}>10</MenuItem>
                                                <MenuItem value={25}>25</MenuItem>
                                                <MenuItem value={50}>50</MenuItem>
                                                <MenuItem value={100}>100</MenuItem>
                                                <MenuItem value={penaltyErrorsThree?.length}>All</MenuItem>
                                            </Select>
                                        </Box>
                                    </Grid>
                                    <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center", }}>
                                        <Box>
                                            {isUserRoleCompare?.includes("excelpenaltyoverallreport") && (
                                                <>
                                                    <Button onClick={(e) => { setIsFilterOpenThree(true); setFormat("xl"); }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("csvpenaltyoverallreport") && (
                                                <>
                                                    <Button onClick={(e) => { setIsFilterOpenThree(true); setFormat("csv"); }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("printpenaltyoverallreport") && (
                                                <>
                                                    <Button sx={userStyle.buttongrp} onClick={handleprintThree}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("pdfpenaltyoverallreport") && (
                                                <>
                                                    <Button sx={userStyle.buttongrp} onClick={() => { setIsPdfFilterOpenThree(true); }}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("imagepenaltyoverallreport") && (
                                                <>
                                                    <Button sx={userStyle.buttongrp} onClick={handleCaptureImageThree}><ImageIcon sx={{ fontSize: "15px" }} />{" "} &ensp;Image&ensp;</Button>
                                                </>
                                            )}
                                        </Box>
                                    </Grid>
                                    <Grid item md={2} xs={6} sm={6}>
                                        <Box>
                                            <AggregatedSearchBar
                                                columnDataTable={columnDataTableThree}
                                                setItems={setItemsThree}
                                                addSerialNumber={addSerialNumberThree}
                                                setPage={setPageThree}
                                                maindatas={penaltyErrorsThree}
                                                setSearchedString={setSearchedStringThree}
                                                searchQuery={searchQueryThree}
                                                setSearchQuery={setSearchQueryThree}
                                                paginated={false}
                                                totalDatas={penaltyErrorsThree}
                                            />
                                        </Box>
                                    </Grid>
                                </Grid><br />
                                <Button sx={userStyle.buttongrp} onClick={handleShowAllColumnsThree}>Show All Columns</Button>&ensp;
                                <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsThree}>Manage Columns</Button><br /><br />
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
                                            rowDataTable={rowDataTableThree}
                                            columnDataTable={columnDataTableThree}
                                            columnVisibility={columnVisibilityThree}
                                            page={pageThree}
                                            setPage={setPageThree}
                                            pageSize={pageSizeThree}
                                            totalPages={totalPagesThree}
                                            setColumnVisibility={setColumnVisibilityThree}
                                            isHandleChange={isHandleChangeThree}
                                            items={itemsThree}
                                            selectedRows={selectedRowsThree}
                                            setSelectedRows={setSelectedRowsThree}
                                            gridRefTable={gridRefTableThree}
                                            paginated={false}
                                            filteredDatas={filteredDatasThree}
                                            // totalDatas={totalDatas}
                                            searchQuery={searchedStringThree}
                                            handleShowAllColumns={handleShowAllColumnsThree}
                                            setFilteredRowData={setFilteredRowDataThree}
                                            filteredRowData={filteredRowDataThree}
                                            setFilteredChanges={setFilteredChangesThree}
                                            filteredChanges={filteredChangesThree}
                                            gridRefTableImg={gridRefTableImgThree}
                                            itemsList={penaltyErrorsThree}
                                            pagenamecheck={'Client Error Waiver Approval'}
                                        />
                                    </>
                                )}
                            </Box><br />
                        </> : null}
                    {tableCheck?.includes('ReCheck Current Process List') ?
                        <>
                            {/* Second Tabale  */}
                            <Box sx={userStyle.container}>
                                {/* ******************************************************EXPORT Buttons****************************************************** */}
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext}>ReCheck Current Process List</Typography>
                                </Grid>
                                <Grid container spacing={2} style={userStyle.dataTablestyle}>
                                    <Grid item md={2} xs={12} sm={12}>
                                        <Box>
                                            <label>Show entries:</label>
                                            <Select
                                                id="pageSizeSelect"
                                                value={pageSizeFour}
                                                MenuProps={{
                                                    PaperProps: {
                                                        style: {
                                                            maxHeight: 180,
                                                            width: 80,
                                                        },
                                                    },
                                                }}
                                                onChange={handlePageSizeChangeFour}
                                                sx={{ width: "77px" }}
                                            >
                                                <MenuItem value={1}>1</MenuItem>
                                                <MenuItem value={5}>5</MenuItem>
                                                <MenuItem value={10}>10</MenuItem>
                                                <MenuItem value={25}>25</MenuItem>
                                                <MenuItem value={50}>50</MenuItem>
                                                <MenuItem value={100}>100</MenuItem>
                                                <MenuItem value={penaltyErrorsFour?.length}>All</MenuItem>
                                            </Select>
                                        </Box>
                                    </Grid>
                                    <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center", }}>
                                        <Box>
                                            {isUserRoleCompare?.includes("excelpenaltyoverallreport") && (
                                                <>
                                                    <Button onClick={(e) => { setIsFilterOpenFour(true); setFormat("xl"); }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("csvpenaltyoverallreport") && (
                                                <>
                                                    <Button onClick={(e) => { setIsFilterOpenFour(true); setFormat("csv"); }} sx={userStyle.buttongrp} ><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("printpenaltyoverallreport") && (
                                                <>
                                                    <Button sx={userStyle.buttongrp} onClick={handleprintFour} >&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("pdfpenaltyoverallreport") && (
                                                <>
                                                    <Button sx={userStyle.buttongrp} onClick={() => { setIsPdfFilterOpenFour(true); }}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("imagepenaltyoverallreport") && (
                                                <>
                                                    <Button sx={userStyle.buttongrp} onClick={handleCaptureImageFour}><ImageIcon sx={{ fontSize: "15px" }} />{" "}&ensp;Image&ensp;</Button>
                                                </>
                                            )}
                                        </Box>
                                    </Grid>
                                    <Grid item md={2} xs={6} sm={6}>
                                        <Box>
                                            <AggregatedSearchBar
                                                columnDataTable={columnDataTableFour}
                                                setItems={setItemsFour}
                                                addSerialNumber={addSerialNumberFour}
                                                setPage={setPageFour}
                                                maindatas={penaltyErrorsFour}
                                                setSearchedString={setSearchedStringFour}
                                                searchQuery={searchQueryFour}
                                                setSearchQuery={setSearchQueryFour}
                                                paginated={false}
                                                totalDatas={penaltyErrorsFour}
                                            />
                                        </Box>
                                    </Grid>
                                </Grid><br />
                                <Button sx={userStyle.buttongrp} onClick={handleShowAllColumnsFour}>Show All Columns</Button>&ensp;
                                <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsFour}>Manage Columns</Button><br /><br />
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
                                            rowDataTable={rowDataTableFour}
                                            columnDataTable={columnDataTableFour}
                                            columnVisibility={columnVisibilityFour}
                                            page={pageFour}
                                            setPage={setPageFour}
                                            pageSize={pageSizeFour}
                                            totalPages={totalPagesFour}
                                            setColumnVisibility={setColumnVisibilityFour}
                                            isHandleChange={isHandleChangeFour}
                                            items={itemsFour}
                                            selectedRows={selectedRowsFour}
                                            setSelectedRows={setSelectedRowsFour}
                                            gridRefTable={gridRefTableFour}
                                            paginated={false}
                                            filteredDatas={filteredDatasFour}
                                            // totalDatas={totalDatas}
                                            searchQuery={searchedStringFour}
                                            handleShowAllColumns={handleShowAllColumnsFour}
                                            setFilteredRowData={setFilteredRowDataFour}
                                            filteredRowData={filteredRowDataFour}
                                            setFilteredChanges={setFilteredChangesFour}
                                            filteredChanges={filteredChangesFour}
                                            gridRefTableImg={gridRefTableImgFour}
                                            itemsList={penaltyErrorsFour}
                                            pagenamecheck={'Client Error Waiver Approval'}
                                        />
                                    </>
                                )}
                            </Box>
                        </> : null}
                </>
            )}

            {/* Manage Column */}
            <Popover
                id={idThree}
                open={isManageColumnsOpenThree}
                anchorEl={anchorElThree}
                onClose={handleCloseManageColumnsThree}
                anchorOrigin={{ vertical: "bottom", horizontal: "left", }}>
                <ManageColumnsContent
                    handleClose={handleCloseManageColumnsThree}
                    searchQuery={searchQueryManageThree}
                    setSearchQuery={setSearchQueryManageThree}
                    filteredColumns={filteredColumnsThree}
                    columnVisibility={columnVisibilityThree}
                    toggleColumnVisibility={toggleColumnVisibilityThree}
                    setColumnVisibility={setColumnVisibilityThree}
                    initialColumnVisibility={initialColumnVisibilityThree}
                    columnDataTable={columnDataTableThree}
                />
            </Popover>

            {/* Manage Column */}
            <Popover
                id={idFour}
                open={isManageColumnsOpenFour}
                anchorEl={anchorElFour}
                onClose={handleCloseManageColumnsFour}
                anchorOrigin={{ vertical: "bottom", horizontal: "left", }}>
                <ManageColumnsContent
                    handleClose={handleCloseManageColumnsFour}
                    searchQuery={searchQueryManageFour}
                    setSearchQuery={setSearchQueryManageFour}
                    filteredColumns={filteredColumnsFour}
                    columnVisibility={initialColumnVisibilityFour}
                    toggleColumnVisibility={toggleColumnVisibilityFour}
                    setColumnVisibility={setColumnVisibilityFour}
                    initialColumnVisibility={initialColumnVisibilityFour}
                    columnDataTable={columnDataTableFour}
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
                isFilterOpen={isFilterOpenThree}
                handleCloseFilterMod={handleCloseFilterModThree}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpenThree}
                isPdfFilterOpen={isPdfFilterOpenThree}
                setIsPdfFilterOpen={setIsPdfFilterOpenThree}
                handleClosePdfFilterMod={handleClosePdfFilterModThree}
                filteredDataTwo={(filteredChangesThree !== null ? filteredRowDataThree : rowDataTableThree) ?? []}
                itemsTwo={penaltyErrorsThree ?? []}
                filename={"Current Process List"}
                exportColumnNames={exportColumnNamesThree}
                exportRowValues={exportRowValuesThree}
                componentRef={componentRefThree}
            />
            {/* EXTERNAL COMPONENTS -------------- END */}
            {/* print layout */}
            <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRefFour}>
                    <TableHead>
                        <TableRow>
                            <TableCell>SNo</TableCell>
                            <TableCell>Employee Name</TableCell>
                            <TableCell>Employee Code</TableCell>
                            <TableCell>Employee Name</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Vendor Name</TableCell>
                            <TableCell>Process</TableCell>
                            <TableCell>Total Field</TableCell>
                            <TableCell>Auto Error</TableCell>
                            <TableCell>Manual Error</TableCell>
                            <TableCell>Upload Error</TableCell>
                            <TableCell>Moved</TableCell>
                            <TableCell>Not Upload</TableCell>
                            <TableCell>Penalty</TableCell>
                            <TableCell>Non Penalty</TableCell>
                            <TableCell>Bulk Upload</TableCell>
                            <TableCell>Bulk Keying</TableCell>
                            <TableCell>Edited1</TableCell>
                            <TableCell>Edited2</TableCell>
                            <TableCell>Edited3</TableCell>
                            <TableCell>Edited4</TableCell>
                            <TableCell>Reject1</TableCell>
                            <TableCell>Reject2</TableCell>
                            <TableCell>Reject3</TableCell>
                            <TableCell>Reject4</TableCell>
                            <TableCell>Not Valid</TableCell>
                            <TableCell>Valid Error</TableCell>
                            <TableCell>Waiver %</TableCell>
                            <TableCell>Emp-Waiver</TableCell>
                            <TableCell>Net Error</TableCell>
                            <TableCell>per %</TableCell>
                            <TableCell>Percentage</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Reason</TableCell>
                            <TableCell>Waiver Close on</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody align="left">
                        {rowDataTableFour &&
                            rowDataTableFour.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>{row.empcode}</TableCell>
                                    <TableCell>{row.date}</TableCell>
                                    <TableCell>{row.vendorname}</TableCell>
                                    <TableCell>{row.process}</TableCell>
                                    <TableCell>{row.totalfield}</TableCell>
                                    <TableCell>{row.autoerror}</TableCell>
                                    <TableCell>{row.manualerror}</TableCell>
                                    <TableCell>{row.uploaderror}</TableCell>
                                    <TableCell>{row.moved}</TableCell>
                                    <TableCell>{row.notupload}</TableCell>
                                    <TableCell>{row.penalty}</TableCell>
                                    <TableCell>{row.nonpenalty}</TableCell>
                                    <TableCell>{row.bulkupload}</TableCell>
                                    <TableCell>{row.bulkkeying}</TableCell>
                                    <TableCell>{row.edited1}</TableCell>
                                    <TableCell>{row.edited2}</TableCell>
                                    <TableCell>{row.edited3}</TableCell>
                                    <TableCell>{row.reject1}</TableCell>
                                    <TableCell>{row.reject2}</TableCell>
                                    <TableCell>{row.reject3}</TableCell>
                                    <TableCell>{row.reject4}</TableCell>
                                    <TableCell>{row.notvalid}</TableCell>
                                    <TableCell>{row.validateerror}</TableCell>
                                    <TableCell>{row.waiver}</TableCell>
                                    <TableCell>{row.waivererror}</TableCell>
                                    <TableCell>{row.neterror}</TableCell>
                                    <TableCell>{row.per}</TableCell>
                                    <TableCell>{row.percentage}</TableCell>
                                    <TableCell>{row.amount}</TableCell>
                                    <TableCell>{row.reason}</TableCell>
                                    <TableCell>{row.waivercloseon}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={isFilterOpenFour} onClose={handleCloseFilterModFour} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>

                    <IconButton
                        aria-label="close"
                        onClick={handleCloseFilterModFour}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    {fileFormat === 'xl' ?
                        <FaFileExcel style={{ fontSize: "70px", color: "green" }} />
                        : <FaFileCsv style={{ fontSize: "70px", color: "green" }} />
                    }
                    <Typography variant="h5" sx={{ textAlign: "center" }}>
                        Choose Export
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        autoFocus variant="contained"
                        onClick={(e) => {
                            handleExportXLFour("filtered")
                        }}
                    >
                        Export Filtered Data
                    </Button>
                    <Button autoFocus variant="contained"
                        onClick={(e) => {
                            handleExportXLFour("overall")
                        }}
                    >
                        Export Over All Data
                    </Button>
                </DialogActions>
            </Dialog>
            {/*Export pdf Data  */}
            <Dialog open={isPdfFilterOpenFour} onClose={handleClosePdfFilterModFour} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>
                    <IconButton
                        aria-label="close"
                        onClick={handleClosePdfFilterModFour}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    <PictureAsPdfIcon sx={{ fontSize: "80px", color: "red" }} />
                    <Typography variant="h5" sx={{ textAlign: "center" }}>
                        Choose Export
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        onClick={(e) => {
                            downloadPdfFour("filtered")
                            setIsPdfFilterOpenFour(false);
                        }}
                    >
                        Export Filtered Data
                    </Button>
                    <Button variant="contained"
                        onClick={(e) => {
                            downloadPdfFour("overall")
                            setIsPdfFilterOpenFour(false);
                        }}
                    >
                        Export Over All Data
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default PenaltyCurrentOverAllReport;