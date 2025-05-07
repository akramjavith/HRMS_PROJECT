import React, { useContext, useEffect, useRef, useState } from "react";
import { Box, Button, Grid, MenuItem, Popover, Select, Typography, FormControl, TextareaAutosize, OutlinedInput, Dialog, DialogContent, DialogActions, IconButton, Table, Paper, TableContainer, TableHead, TableRow, TableBody, TableCell } from "@mui/material";
import ExcelJS from "exceljs";
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
import MessageAlert from "../../../components/MessageAlert";
import AggregatedSearchBar from "../../../components/AggregatedSearchBar";
import AggridTable from "../../../components/AggridTable";
import domtoimage from 'dom-to-image';
import ManageColumnsContent from "../../../components/ManageColumn";

const RecheckReasonCellFive = ({ rowId, currentRecheckReason, onSave, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert, setPopupContent, setPopupSeverity, handleClickOpenPopup, auth, fetchAllPenaltyError, rowData }) => {
    const [localRecheckReason, setLocalRecheckReason] = useState(currentRecheckReason);

    const today = new Date();
    const date = today.toISOString().split('T')[0];
    const time = today.toTimeString().split(' ')[0].slice(0, 5);

    const handleSaveClick = async () => {
        onSave(localRecheckReason);
        if (localRecheckReason === '') {
            setPopupContentMalert("Please Enter Recheck Reason");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else {
            try {
                let res = await axios.post(SERVICE.PENALTYDAYUPLOAD_UPDATE_FOR_OVERALL, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    date: rowData.actualdate,
                    uploaddata_id: rowId,
                    history: [
                        // ...rowData.history,
                        {
                            tablename: 'Approval Employee Waiver_Wait',
                            date: date,
                            time: time,
                            status: "Recheck",
                            reason: localRecheckReason,
                            mode: "",
                        }
                    ]
                });
                await fetchAllPenaltyError();
                setPopupContent("Request Sent Successfully");
                setPopupSeverity("success");
                handleClickOpenPopup();
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
                        placeholder="Recheck Reason"
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
                <Button sx={{ textTransform: 'capitalize', background: '#1aa2aa', '&:hover': { background: '#1aa2aa' } }} variant="contained" size="small" onClick={handleSaveClick}>Recheck</Button>
            </Grid>
        </Grid >
    );
};

const RejectReasonCellFive = ({ rowId, currentRejectReason, onSave, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert, setPopupContent, setPopupSeverity, handleClickOpenPopup, auth, fetchAllPenaltyError, rowData }) => {
    const [localRejectReason, setLocalRejectReason] = useState(currentRejectReason);

    const today = new Date();
    const date = today.toISOString().split('T')[0];
    const time = today.toTimeString().split(' ')[0].slice(0, 5);

    const handleSaveClick = async () => {
        onSave(localRejectReason);
        if (localRejectReason === '') {
            setPopupContentMalert("Please Enter Reject Reason");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else {
            try {
                let res = await axios.post(SERVICE.PENALTYDAYUPLOAD_UPDATE_FOR_OVERALL, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    date: rowData.actualdate,
                    uploaddata_id: rowId,
                    history: [
                        // ...rowData.history,
                        {
                            tablename: 'Approval Employee Waiver_Wait',
                            date: date,
                            time: time,
                            status: "Reject",
                            reason: localRejectReason,
                            mode: "",
                        }
                    ]
                });
                await fetchAllPenaltyError();
                setPopupContent("Rejected Successfully");
                setPopupSeverity("success");
                handleClickOpenPopup();
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
                        value={localRejectReason}
                        placeholder="Reject Reason"
                        onChange={(e) => {
                            setLocalRejectReason(e.target.value);
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
                <Button sx={{ textTransform: 'capitalize' }} variant="contained" color="error" size="small" onClick={handleSaveClick}>Reject</Button>
            </Grid>
        </Grid>
    );
};

const ApproveCellFive = ({ rowId, currentRejectReason, onSave, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert, setPopupContent, setPopupSeverity, handleClickOpenPopup, auth, fetchAllPenaltyError, rowData }) => {
    const [localApproveReason, setLocalApproveReason] = useState(rowData.percentage);

    const today = new Date();
    const date = today.toISOString().split('T')[0];
    const time = today.toTimeString().split(' ')[0].slice(0, 5);

    const handleSaveClick = async () => {
        onSave(localApproveReason);
        if (localApproveReason === '') {
            setPopupContentMalert("Please Enter Percentage");
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
                    setPopupContentMalert(`This date range does not have any data matches. Please enter data in the 'Penalty Waiver' section for these dates.`);
                    setPopupSeverityMalert("warning");
                    handleClickOpenPopupMalert();
                } else {

                    let aggregatedData = [];
                    let finalData = [];

                    for (const dep of result || []) {

                        let res_penaltyError = await axios.post(SERVICE.PENALTYDAYUPLOAD_EMPLOYEEWISE_OVER_ALL_REPORT, {
                            empname: rowData.name,
                            department: rowData.department,
                            departmentlog: rowData.departmentlog,
                        }, {
                            headers: {
                                Authorization: `Bearer ${auth.APIToken}`,
                            },
                        });

                        finalData = res_penaltyError?.data?.penaltydayuploaddepdatas.filter(item => item.date >= dep.fromdate && item.date <= dep.todate) || [];

                        // get only approved in history
                        const calculateClientAmount = (empcode) => {
                            const filteredData = res_penaltyError?.data?.penaltydayuploaddepdatas?.filter((item) => {
                                return item.empcode === empcode && item.history?.some(
                                    (data) => data.mode === "Percentage" && data.status === "Approved"
                                );
                            }) || [];

                            return filteredData.reduce((total, item) => {
                                const sumApprovedAmounts = item.history
                                    .filter(data => data.mode === "Percentage" && data.status === "Approved")
                                    .reduce((sum, data) => sum + Number(data.calculatedamount || 0), 0);

                                return total + sumApprovedAmounts;
                            }, 0);
                        };

                        // get only approved in history
                        const calculateCount = (empcode) => {
                            const filteredData = res_penaltyError?.data?.penaltydayuploaddepdatas?.filter((item) => {
                                if (item.empcode === empcode && item.history?.length > 0) {
                                    const hasValidHistory = item.history.some(
                                        (data) => data.mode === "Percentage" && data.status === "Approved"
                                    );
                                    return hasValidHistory;
                                }
                                return false;
                            }) || [];

                            // console.log(filteredData, 'Filtered Data');
                            return filteredData.length > 0 ? filteredData.length : 0;
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
                                    // count: finalData.filter((entry) => entry.empcode === item.empcode).length,
                                    waiverallowupto: dep.waiverallowupto,
                                    waiveramountupto: dep.waiveramountupto,
                                    waiverpercentageupto: dep.waiverpercentageupto,
                                });
                            }

                            return acc;
                        }, []);

                        aggregatedData.push(...aggregatedForCurrentDep);

                    }
                    // console.log(aggregatedData, 'aggregatedData');

                    // Perform validation on aggregatedData
                    for (const data of aggregatedData) {
                        // Calculate approved amount,count and applied client amount, count
                        const totalAmount = data.totalappliedclientamount;
                        const remainingAmount = data.waiveramountupto - totalAmount;

                        // const totalCount = data.totalappliedcount + [rowData].length;
                        const totalCount = data.totalappliedcount;
                        const remainingCount = data.waiverallowupto - totalCount;

                        if (rowData.clientamount > remainingAmount) {
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
                        else if (totalAmount > data.waiveramountupto && totalCount <= data.waiverallowupto) {
                            setPopupContentMalert("Waiver amount is reached, you cannot apply.");
                            setPopupSeverityMalert("warning");
                            handleClickOpenPopupMalert();
                            return;
                        }
                        else if (localApproveReason > data.waiverpercentageupto) {
                            setPopupContentMalert(`You cannot approve percentage above ${data.waiverpercentageupto}`);
                            setPopupSeverityMalert("warning");
                            handleClickOpenPopupMalert();
                            return;
                        }
                        else if (totalCount > data.waiverallowupto && totalAmount <= data.waiveramountupto) {
                            setPopupContentMalert("Waiver count is reached, you cannot apply.");
                            setPopupSeverityMalert("warning");
                            handleClickOpenPopupMalert();
                            return;
                        }
                        else {

                            let res = await axios.post(SERVICE.PENALTYDAYUPLOAD_UPDATE_FOR_APPROVAL_EMPLOYEE_WAIVER, {
                                headers: {
                                    Authorization: `Bearer ${auth.APIToken}`,
                                },
                                date: rowData.actualdate,
                                uploaddata_id: rowId,
                                per: localApproveReason,
                                percentage: Number(rowData.amount) * (localApproveReason / 100),
                                history: [
                                    // ...rowData.history,
                                    {
                                        tablename: 'Approval Employee Waiver_Wait',
                                        date: date,
                                        time: time,
                                        status: "Approved",
                                        reason: "",
                                        mode: "Percentage",
                                        percentage: localApproveReason,
                                        calculatedamount: rowData.clientamount * (localApproveReason / 100),
                                    }
                                ]
                            });
                            await fetchAllPenaltyError();
                            setPopupContent("Approved Successfully");
                            setPopupSeverity("success");
                            handleClickOpenPopup();
                            // Calculate approved amount,count and applied client amount, count
                            const totalAmount = data.totalappliedclientamount;
                            const remainingAmount = data.waiveramountupto - (totalAmount !== 0 ? totalAmount : rowData.clientamount);

                            const totalCount = data.totalappliedcount + [rowData].length;
                            const remainingCount = data.waiverallowupto - totalCount;

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
            } catch (err) {
                handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
            }
        }
    };

    return (
        <Grid container>
            <Grid item xs={12} sm={12} md={12}>
                <FormControl size="small" fullWidth>
                    <OutlinedInput size="small"
                        type="number"
                        value={localApproveReason}
                        placeholder="Please Enter Percentage"
                        onChange={(e) => { setLocalApproveReason(e.target.value); }}
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
                        inputProps={{
                            style: { appearance: 'none' },
                        }}
                        sx={{
                            '& input[type=number]': {
                                appearance: 'none',
                                MozAppearance: 'textfield',
                                WebkitAppearance: 'none',
                            },
                            '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                                WebkitAppearance: 'none',
                                margin: 0,
                            },
                        }}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={9} md={9}>
                <Button sx={{ textTransform: 'capitalize', backgroundColor: '#28a745' }} variant="contained" size="small" onClick={handleSaveClick}>Approved</Button>
            </Grid>
        </Grid>
    );
};

function WaitForRecheckList({ waiverEmployeesFive, fetchAllPenaltyError, loader, tableCheck, setFilteredRowDataFive, filteredChangesFive, setFilteredChangesFive, filteredRowDataFive, setIsHandleChangeFive, isHandleChangeFive, setSearchedStringFive, searchedStringFive }) {

    let cellStyles = {
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        lineHeight: 'normal',
    }

    const gridRefTableFive = useRef(null);
    const gridRefTableImgFive = useRef(null);

    const { auth } = useContext(AuthContext);
    const { isUserRoleCompare } = useContext(UserRoleAccessContext);

    const [itemsFive, setItemsFive] = useState([]);
    const [selectedRowsFive, setSelectedRowsFive] = useState([]);

    const [recheckReasonsFive, setRecheckReasonsFive] = useState({});
    const [rejectReasonsFive, setRejectReasonsFive] = useState({});
    const [rowApprovedFive, setRowApprovedFive] = useState({});

    //Datatable
    const [pageFive, setPageFive] = useState(1);
    const [pageSizeFive, setPageSizeFive] = useState(10);
    const [searchQueryFive, setSearchQueryFive] = useState("");

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

    const [isFilterOpenFive, setIsFilterOpenFive] = useState(false);
    const [isPdfFilterOpenFive, setIsPdfFilterOpenFive] = useState(false);
    // pageFive refersh reload
    const handleCloseFilterModFive = () => { setIsFilterOpenFive(false); };
    const handleClosePdfFilterModFive = () => { setIsPdfFilterOpenFive(false); };

    // Manage Columns
    const [searchQueryManageFive, setSearchQueryManageFive] = useState("");
    const [isManageColumnsOpenFive, setManageColumnsOpenFive] = useState(false);
    const [anchorElFive, setAnchorElFive] = useState(null);

    const handleOpenManageColumnsFive = (event) => {
        setAnchorElFive(event.currentTarget);
        setManageColumnsOpenFive(true);
    };
    const handleCloseManageColumnsFive = () => {
        setManageColumnsOpenFive(false);
        setSearchQueryManageFive("");
    };

    const openFive = Boolean(anchorElFive);
    const idFive = openFive ? "simple-popover" : undefined;

    const modeOption = [
        { label: "NaN", value: "NaN" },
        { label: "Approved", value: "Approved" },
        { label: "Reject", value: "Reject" },
    ]

    // Show All Columns & Manage Columns
    const initialColumnVisibilityFive = {
        serialNumber: true,
        branch: true,
        unit: true,
        team: true,
        name: true,
        empcode: true,
        date: true,
        vendorname: true,
        process: true,
        totalfield: true,
        autoerror: true,
        manualerror: true,
        notvalidate: true,
        validateerror: true,
        waiver: true,
        waivererror: true,
        neterror: true,
        per: true,
        percentage: true,
        amount: true,
        requestreason: true,
        forwardreason: true,
        mode: true,
        overallhistory: true,
        monthhistory: true,
        approved: true,
        reject: true,
        recheck: true,
    };
    const [columnVisibilityFive, setColumnVisibilityFive] = useState(initialColumnVisibilityFive);

    // pageFive refersh reload code
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

    const addSerialNumberFive = (datas) => {
        setItemsFive(datas);
    };

    useEffect(() => {
        addSerialNumberFive(waiverEmployeesFive);
    }, [waiverEmployeesFive]);

    //Datatable
    const handlePageSizeChangeFive = (event) => {
        setPageSizeFive(Number(event.target.value));
        setSelectedRowsFive([]);
        setPageFive(1);
    };

    // Split the search query into individual terms
    const searchTermsFive = searchQueryFive.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatasFive = itemsFive?.filter((item) => {
        return searchTermsFive.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
        );
    });
    const filteredDataFive = filteredDatasFive?.slice((pageFive - 1) * pageSizeFive, pageFive * pageSizeFive);
    const totalPagesFive = Math.ceil(filteredDatasFive.length / pageSizeFive);
    const visiblePagesFive = Math.min(totalPagesFive, 3);
    const firstVisiblePageFive = Math.max(1, pageFive - 1);
    const lastVisiblePageFive = Math.min(firstVisiblePageFive + visiblePagesFive - 1, totalPagesFive);
    const pageNumbersFive = [];
    const indexOfLastItemFive = pageFive * pageSizeFive;
    const indexOfFirstItemFive = indexOfLastItemFive - pageSizeFive;
    for (let i = firstVisiblePageFive; i <= lastVisiblePageFive; i++) {
        pageNumbersFive.push(i);
    }

    const columnDataTableFive = [
        { field: "serialNumber", headerName: "SNo", flex: 0, width: 75, hide: !columnVisibilityFive.serialNumber, pinned: 'left', lockPinned: true, },
        { field: "branch", headerName: "Branch", flex: 0, width: 150, hide: !columnVisibilityFive.branch, },
        { field: "unit", headerName: "Unit", flex: 0, width: 100, hide: !columnVisibilityFive.unit, },
        { field: "team", headerName: "Team", flex: 0, width: 100, hide: !columnVisibilityFive.team, },
        { field: "name", headerName: "Employee Name", flex: 0, width: 250, hide: !columnVisibilityFive.name, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "empcode", headerName: "Employee Code", flex: 0, width: 150, hide: !columnVisibilityFive.empcode, },
        { field: "date", headerName: "Date", flex: 0, width: 120, hide: !columnVisibilityFive.date, },
        { field: "vendorname", headerName: "Vendor Name", flex: 0, width: 150, hide: !columnVisibilityFive.vendorname, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "process", headerName: "Process", flex: 0, width: 150, hide: !columnVisibilityFive.process, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "totalfield", headerName: "Total Field", flex: 0, width: 120, hide: !columnVisibilityFive.totalfield, },
        { field: "autoerror", headerName: "Auto Error", flex: 0, width: 120, hide: !columnVisibilityFive.autoerror, },
        { field: "manualerror", headerName: "Manual Error", flex: 0, width: 120, hide: !columnVisibilityFive.manualerror, },
        { field: "notvalidate", headerName: "Not Validate", flex: 0, width: 120, hide: !columnVisibilityFive.notvalidate, },
        { field: "validateerror", headerName: "Valid Error", flex: 0, width: 120, hide: !columnVisibilityFive.validateerror, },
        { field: "waiver", headerName: "Waiver %", flex: 0, width: 120, hide: !columnVisibilityFive.waiver, },
        { field: "waivererror", headerName: "Emp-Waiver", flex: 0, width: 120, hide: !columnVisibilityFive.waivererror, },
        { field: "neterror", headerName: "Net Error", flex: 0, width: 120, hide: !columnVisibilityFive.neterror, },
        { field: "per", headerName: "per%", flex: 0, width: 120, hide: !columnVisibilityFive.per, },
        { field: "percentage", headerName: "per%", flex: 0, width: 120, hide: !columnVisibilityFive.percentage, },
        { field: "amount", headerName: "Amount", flex: 0, width: 120, hide: !columnVisibilityFive.amount, },
        { field: "requestreason", headerName: "Request Reason", flex: 0, width: 250, hide: !columnVisibilityFive.requestreason, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "forwardreason", headerName: "Forward Reason", flex: 0, width: 250, hide: !columnVisibilityFive.forwardreason, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "mode", headerName: "Mode", flex: 0, width: 100, hide: !columnVisibilityFive.mode, },
        {
            field: "overallhistory", headerName: "History", flex: 0, width: 250, hide: !columnVisibilityFive.overallhistory, cellStyle: cellStyles, headerClass: 'header-wrap',
            cellRenderer: (params) => (
                <Grid >
                    <Typography variant="body2">Total Apply: {params.data.totalapply}</Typography>
                    <Typography variant="body2">Total Approved: {params.data.totalapproved}</Typography>
                    <Typography variant="body2">Total Reject: {params.data.totalreject}</Typography>
                    <Typography variant="body2">Total Amount: {params.data.totalamount}</Typography>
                    <Typography variant="body2">Total Waiver: {params.data.totalwaiver}</Typography>
                </Grid>
            ),
        },
        {
            field: "monthhistory", headerName: "Month History", flex: 0, width: 250, hide: !columnVisibilityFive.monthhistory, cellStyle: cellStyles, headerClass: 'header-wrap',
            cellRenderer: (params) => (
                <Grid >
                    <Typography variant="body2">Apply Number: {params.data.applynumber}</Typography>
                    <Typography variant="body2">Total Approved: {params.data.monthtotalapproved}</Typography>
                    <Typography variant="body2">Total Reject: {params.data.monthtotalreject}</Typography>
                    <Typography variant="body2">Total Pending: {params.data.monthtotalpending}</Typography>
                    <Typography variant="body2">Total Error: {params.data.monthtotalerror}</Typography>
                    <Typography variant="body2">Total Amount: {params.data.monthtotalamount}</Typography>
                    <Typography variant="body2">Total Waiver: {params.data.monthtotalwaiver}</Typography>
                </Grid>
            ),
        },
        {
            field: "approved", headerName: "Approved", flex: 0, width: 250, hide: !columnVisibilityFive.approved, sortable: false, filter: false,
            cellRenderer: (params) => (
                <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
                    <ApproveCellFive
                        rowId={params.data.id}
                        currentRejectReason={rowApprovedFive[params.data.id] || ""}
                        onSave={(rejectreason2) => {
                            setRowApprovedFive((prev) => ({
                                ...prev,
                                [params.data.id]: rejectreason2,
                            }));
                        }}
                        setPopupContentMalert={setPopupContentMalert} setPopupSeverityMalert={setPopupSeverityMalert} handleClickOpenPopupMalert={handleClickOpenPopupMalert}
                        setPopupContent={setPopupContent}
                        setPopupSeverity={setPopupSeverity}
                        handleClickOpenPopup={handleClickOpenPopup}
                        auth={auth} fetchAllPenaltyError={fetchAllPenaltyError} rowData={params.data}
                    />
                </Grid>
            ),
        },
        {
            field: "reject", headerName: "Reject", flex: 0, width: 250, hide: !columnVisibilityFive.reject, sortable: false, filter: false,
            cellRenderer: (params) => (
                <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
                    <RejectReasonCellFive
                        rowId={params.data.id}
                        currentRejectReason={rejectReasonsFive[params.data.id] || ""}
                        onSave={(rejectreason2) => {
                            setRejectReasonsFive((prev) => ({
                                ...prev,
                                [params.data.id]: rejectreason2,
                            }));
                        }}
                        setPopupContentMalert={setPopupContentMalert} setPopupSeverityMalert={setPopupSeverityMalert} handleClickOpenPopupMalert={handleClickOpenPopupMalert}
                        setPopupContent={setPopupContent}
                        setPopupSeverity={setPopupSeverity}
                        handleClickOpenPopup={handleClickOpenPopup}
                        auth={auth} fetchAllPenaltyError={fetchAllPenaltyError} rowData={params.data}
                    />
                </Grid>
            ),
        },
        {
            field: "recheck", headerName: "ReCheck", flex: 0, width: 250, hide: !columnVisibilityFive.recheck, sortable: false, filter: false,
            cellRenderer: (params) => (
                <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
                    <RecheckReasonCellFive
                        rowId={params.data.id}
                        currentRecheckReason={recheckReasonsFive[params.data.id] || ""}
                        onSave={(rejectreason) => {
                            setRecheckReasonsFive((prev) => ({
                                ...prev,
                                [params.data.id]: rejectreason,
                            }));
                        }}
                        setPopupContentMalert={setPopupContentMalert} setPopupSeverityMalert={setPopupSeverityMalert} handleClickOpenPopupMalert={handleClickOpenPopupMalert}
                        setPopupContent={setPopupContent}
                        setPopupSeverity={setPopupSeverity}
                        handleClickOpenPopup={handleClickOpenPopup}
                        auth={auth} fetchAllPenaltyError={fetchAllPenaltyError} rowData={params.data}
                    />
                </Grid>
            ),
        },
    ];

    const rowDataTableFive = filteredDataFive?.map((item, index) => {
        return {
            ...item,
        };
    });

    // Show All Columns functionality
    const handleShowAllColumnsFive = () => {
        const updatedVisibility = { ...columnVisibilityFive };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibilityFive(updatedVisibility);
    };

    // Function to filter columns based on search query
    const filteredColumnsFive = columnDataTableFive.filter((column) =>
        column.headerName.toLowerCase().includes(searchQueryManageFive.toLowerCase())
    );

    // Manage Columns functionality
    const toggleColumnVisibilityFive = (field) => {
        setColumnVisibilityFive((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };

    // Exports
    const [fileFormat, setFormat] = useState("");
    const fileExtension = fileFormat === "xl" ? 'xlsx' : 'csv';
    const handleExportXLFive = async (isfilter) => {
        let formattedData = [];
        let resultdata = (filteredChangesFive !== null ? filteredRowDataFive : rowDataTableFive) ?? [];

        if (isfilter === "filtered") {
            formattedData = resultdata.map((row, index) => {
                const overallHistory = [
                    `Total Apply: ${row.totalapply || ""}`,
                    `Total Approved: ${row.totalapproved || ""}`,
                    `Total Reject: ${row.totalreject || ""}`,
                    `Total Amount: ${row.totalamount || ""}`,
                    `Total Waiver: ${row.totalwaiver || ""}`,
                ].join("\n");

                const monthHistory = [
                    `Apply Number: ${row.applynumber || ""}`,
                    `Total Approved: ${row.monthtotalapproved || ""}`,
                    `Total Reject: ${row.monthtotalreject || ""}`,
                    `Total Pending: ${row.monthtotalpending}`,
                    `Total Error: ${row.monthtotalerror}`,
                    `Total Amount: ${row.monthtotalamount || ""}`,
                    `Total Waiver: ${row.monthtotalwaiver || ""}`,
                ].join("\n");

                return {
                    "SNo": index + 1,
                    "Branch": row.branch,
                    "Unit": row.unit,
                    "Team": row.team,
                    "Employee Name": row.name,
                    "Employee Code": row.empcode,
                    "Date": row.date,
                    "Vendor Name": row.vendorname,
                    "Process": row.process,
                    "Total Field": row.totalfield,
                    "Auto Error": row.autoerror,
                    "Manual Error": row.manualerror,
                    "Not Validate": row.notvalidate,
                    "Valid Error": row.validateerror,
                    "Waiver %": row.waiver,
                    "Emp-Waiver": row.waivererror,
                    "Net Error": row.neterror,
                    "per (%)": row.per,
                    "Percentage": row.percentage,
                    "Amount": row.amount,
                    "Request Reason": row.requestreason,
                    "Forward Reason": row.forwardreason,
                    "Mode": row.mode,
                    "History": overallHistory,
                    "Month History": monthHistory,
                };
            });
        } else if (isfilter === "overall") {
            formattedData = waiverEmployeesFive.map((row, index) => {
                const overallHistory = [
                    `Total Apply: ${row.totalapply || ""}`,
                    `Total Approved: ${row.totalapproved || ""}`,
                    `Total Reject: ${row.totalreject || ""}`,
                    `Total Amount: ${row.totalamount || ""}`,
                    `Total Waiver: ${row.totalwaiver || ""}`,
                ].join("\n");

                const monthHistory = [
                    `Apply Number: ${row.applynumber || ""}`,
                    `Total Approved: ${row.monthtotalapproved || ""}`,
                    `Total Reject: ${row.monthtotalreject || ""}`,
                    `Total Pending: ${row.monthtotalpending}`,
                    `Total Error: ${row.monthtotalerror}`,
                    `Total Amount: ${row.monthtotalamount || ""}`,
                    `Total Waiver: ${row.monthtotalwaiver || ""}`,
                ].join("\n");

                return {
                    "SNo": index + 1,
                    "Branch": row.branch,
                    "Unit": row.unit,
                    "Team": row.team,
                    "Employee Name": row.name,
                    "Employee Code": row.empcode,
                    "Date": row.date,
                    "Vendor Name": row.vendorname,
                    "Process": row.process,
                    "Total Field": row.totalfield,
                    "Auto Error": row.autoerror,
                    "Manual Error": row.manualerror,
                    "Not Validate": row.notvalidate,
                    "Valid Error": row.validateerror,
                    "Waiver %": row.waiver,
                    "Emp-Waiver": row.waivererror,
                    "Net Error": row.neterror,
                    "per (%)": row.per,
                    "Percentage": row.percentage,
                    "Amount": row.amount,
                    "Request Reason": row.requestreason,
                    "Forward Reason": row.forwardreason,
                    "Mode": row.mode,
                    "History": overallHistory,
                    "Month History": monthHistory,
                };
            });
        }

        // Create a new workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Table Data");

        // Add column headers
        worksheet.columns = [
            { header: "SNo", key: "SNo", width: 10 },
            { header: "Branch", key: "Branch", width: 15 },
            { header: "Unit", key: "Unit", width: 15 },
            { header: "Team", key: "Team", width: 15 },
            { header: "Employee Name", key: "Employee Name", width: 30 },
            { header: "Employee Code", key: "Employee Code", width: 15 },
            { header: "Date", key: "Date", width: 15 },
            { header: "Vendor Name", key: "Vendor Name", width: 15 },
            { header: "Process", key: "Process", width: 15 },
            { header: "Total Field", key: "Total Field", width: 15 },
            { header: "Auto Error", key: "Auto Error", width: 15 },
            { header: "Manual Error", key: "Manual Error", width: 15 },
            { header: "Not Validate", key: "Not Validate", width: 15 },
            { header: "Valid Error", key: "Valid Error", width: 15 },
            { header: "Waiver %", key: "Waiver %", width: 15 },
            { header: "Emp-Waiver", key: "Emp-Waiver", width: 15 },
            { header: "Net Error", key: "Net Error", width: 15 },
            { header: "per %", key: "per %", width: 15 },
            { header: "Percentage", key: "Percentage", width: 15 },
            { header: "Amount", key: "Amount", width: 15 },
            { header: "Request Reason", key: "Request Reason", width: 30 },
            { header: "Forward Reason", key: "Forward Reason", width: 30 },
            { header: "Mode", key: "Mode", width: 15 },
            { header: "History", key: "History", width: 30 },
            { header: "Month History", key: "Month History", width: 30 },
        ];

        // Add rows
        formattedData.forEach((data) => {
            worksheet.addRow(data);
        });

        // Apply text wrapping for specific columns
        worksheet.getColumn("History").eachCell((cell) => {
            cell.alignment = { wrapText: true, vertical: "top" };
        });

        worksheet.getColumn("Month History").eachCell((cell) => {
            cell.alignment = { wrapText: true, vertical: "top" };
        });

        // Export the file
        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), `Wait for ReCheck List.${fileExtension}`);
        setIsFilterOpenFive(false);
    };

    //print...
    const componentRefFive = useRef();
    const handleprintFive = useReactToPrint({
        content: () => componentRefFive.current,
        documentTitle: "Wait for ReCheck List",
        pageStyle: "print",
    });

    // pdf
    const downloadPdfFive = (isfilter) => {
        const doc = new jsPDF({ orientation: 'landscape' });

        // Define the table headers
        const headers = ['SNo', "Branch", "Unit", "Team", "Employee Name", "Employee Code", "Date", "Vendor Name", "Process", "Total Field", "Auto Error", "Manual Error",
            "Not Validate", "Valid Error", "Waiver %", "Emp-Waiver", "Net Error", "per (%)", "Percentage", "Amount", "Request Reason", "Forward Reason", "Mode", "History", "Month History"];

        let data = [];
        let resultdata = (filteredChangesFive !== null ? filteredRowDataFive : rowDataTableFive) ?? [];

        if (isfilter === "filtered") {
            data = resultdata.map((row, index) => {
                const overallHistory = [
                    `Total Apply: ${row.totalapply || ""}`,
                    `Total Approved: ${row.totalapproved || ""}`,
                    `Total Reject: ${row.totalreject || ""}`,
                    `Total Amount: ${row.totalamount || ""}`,
                    `Total Waiver: ${row.totalwaiver || ""}`,
                ].join("\n");

                const monthHistory = [
                    `Apply Number: ${row.applynumber || ""}`,
                    `Total Approved: ${row.monthtotalapproved || ""}`,
                    `Total Reject: ${row.monthtotalreject || ""}`,
                    `Total Pending: ${row.monthtotalpending}`,
                    `Total Error: ${row.monthtotalerror}`,
                    `Total Amount: ${row.monthtotalamount || ""}`,
                    `Total Waiver: ${row.monthtotalwaiver || ""}`,
                ].join("\n");

                return [
                    index + 1,
                    row.branch,
                    row.unit,
                    row.team,
                    row.name,
                    row.empcode,
                    row.date,
                    row.vendorname,
                    row.process,
                    row.totalfield,
                    row.autoerror,
                    row.manualerror,
                    row.notvalidate,
                    row.validateerror,
                    row.waiver,
                    row.waivererror,
                    row.neterror,
                    row.per,
                    row.percentage,
                    row.amount,
                    row.requestreason,
                    row.forwardreason,
                    row.mode,
                    overallHistory,
                    monthHistory,
                ];
            });
        } else if (isfilter === "overall") {
            data = waiverEmployeesFive.map((row, index) => {
                const overallHistory = [
                    `Total Apply: ${row.totalapply || ""}`,
                    `Total Approved: ${row.totalapproved || ""}`,
                    `Total Reject: ${row.totalreject || ""}`,
                    `Total Amount: ${row.totalamount || ""}`,
                    `Total Waiver: ${row.totalwaiver || ""}`,
                ].join("\n");

                const monthHistory = [
                    `Apply Number: ${row.applynumber || ""}`,
                    `Total Approved: ${row.monthtotalapproved || ""}`,
                    `Total Reject: ${row.monthtotalreject || ""}`,
                    `Total Pending: ${row.monthtotalpending}`,
                    `Total Error: ${row.monthtotalerror}`,
                    `Total Amount: ${row.monthtotalamount || ""}`,
                    `Total Waiver: ${row.monthtotalwaiver || ""}`,
                ].join("\n");

                return [
                    index + 1,
                    row.branch,
                    row.unit,
                    row.team,
                    row.name,
                    row.empcode,
                    row.date,
                    row.vendorname,
                    row.process,
                    row.totalfield,
                    row.autoerror,
                    row.manualerror,
                    row.notvalidate,
                    row.validateerror,
                    row.waiver,
                    row.waivererror,
                    row.neterror,
                    row.per,
                    row.percentage,
                    row.amount,
                    row.requestreason,
                    row.forwardreason,
                    row.mode,
                    overallHistory,
                    monthHistory,
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

        doc.save("Wait for ReCheck List.pdf");
    };

    //image
    const handleCaptureImageFive = () => {
        if (gridRefTableImgFive.current) {
            domtoimage.toBlob(gridRefTableImgFive.current)
                .then((blob) => {
                    saveAs(blob, "Wait for ReCheck List.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    return (
        <Box>
            <Headtitle title={"Approval Employee Waiver"} />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lapprovalemployeewaiver") && (
                <>
                    {tableCheck?.includes('Wait for ReCheck List') ?
                        <Box sx={userStyle.container}>
                            {/* ******************************************************EXPORT Buttons****************************************************** */}
                            <Grid item xs={8}>
                                <Typography sx={userStyle.importheadtext}>Wait for ReCheck List</Typography>
                            </Grid>
                            <Grid container spacing={2} style={userStyle.dataTablestyle}>
                                <Grid item md={2} xs={12} sm={12}>
                                    <Box>
                                        <label>Show entries:</label>
                                        <Select
                                            id="pageSizeSelect"
                                            value={pageSizeFive}
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 180,
                                                        width: 80,
                                                    },
                                                },
                                            }}
                                            onChange={handlePageSizeChangeFive}
                                            sx={{ width: "77px" }}
                                        >
                                            <MenuItem value={1}>1</MenuItem>
                                            <MenuItem value={5}>5</MenuItem>
                                            <MenuItem value={10}>10</MenuItem>
                                            <MenuItem value={25}>25</MenuItem>
                                            <MenuItem value={50}>50</MenuItem>
                                            <MenuItem value={100}>100</MenuItem>
                                            <MenuItem value={waiverEmployeesFive?.length}>All</MenuItem>
                                        </Select>
                                    </Box>
                                </Grid>
                                <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center", }}>
                                    <Box>
                                        {isUserRoleCompare?.includes("excelapprovalemployeewaiver") && (
                                            <>
                                                <Button onClick={(e) => { setIsFilterOpenFive(true); setFormat("xl"); }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("csvapprovalemployeewaiver") && (
                                            <>
                                                <Button onClick={(e) => { setIsFilterOpenFive(true); setFormat("csv"); }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("printapprovalemployeewaiver") && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={handleprintFive}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("pdfapprovalemployeewaiver") && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={() => { setIsPdfFilterOpenFive(true); }}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("imageapprovalemployeewaiver") && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={handleCaptureImageFive}><ImageIcon sx={{ fontSize: "15px" }} />{" "} &ensp;Image&ensp;</Button>
                                            </>
                                        )}
                                    </Box>
                                </Grid>
                                <Grid item md={2} xs={6} sm={6}>
                                    <Box>
                                        <AggregatedSearchBar
                                            columnDataTable={columnDataTableFive}
                                            setItems={setItemsFive}
                                            addSerialNumber={addSerialNumberFive}
                                            setPage={setPageFive}
                                            maindatas={waiverEmployeesFive}
                                            setSearchedString={setSearchedStringFive}
                                            searchQuery={searchQueryFive}
                                            setSearchQuery={setSearchQueryFive}
                                            paginated={false}
                                            totalDatas={waiverEmployeesFive}
                                        />
                                    </Box>
                                </Grid>
                            </Grid><br />
                            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumnsFive}>Show All Columns</Button>&ensp;
                            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsFive}>Manage Columns</Button><br /><br />
                            {loader ? (
                                <>
                                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                                        <ThreeDots
                                            height="80"
                                            width="80"
                                            radius="9"
                                            color="#1976d2"
                                            ariaLabel="Five-dots-loading"
                                            wrapperStyle={{}}
                                            wrapperClassName=""
                                            visible={true}
                                        />
                                    </Box>
                                </>
                            ) : (
                                <>
                                    <AggridTable
                                        rowDataTable={rowDataTableFive}
                                        columnDataTable={columnDataTableFive}
                                        columnVisibility={columnVisibilityFive}
                                        page={pageFive}
                                        setPage={setPageFive}
                                        pageSize={pageSizeFive}
                                        totalPages={totalPagesFive}
                                        setColumnVisibility={setColumnVisibilityFive}
                                        isHandleChange={isHandleChangeFive}
                                        items={itemsFive}
                                        selectedRows={selectedRowsFive}
                                        setSelectedRows={setSelectedRowsFive}
                                        gridRefTable={gridRefTableFive}
                                        paginated={false}
                                        filteredDatas={filteredDatasFive}
                                        // totalDatas={totalDatas}
                                        searchQuery={searchedStringFive}
                                        handleShowAllColumns={handleShowAllColumnsFive}
                                        setFilteredRowData={setFilteredRowDataFive}
                                        filteredRowData={filteredRowDataFive}
                                        setFilteredChanges={setFilteredChangesFive}
                                        filteredChanges={filteredChangesFive}
                                        gridRefTableImg={gridRefTableImgFive}
                                        itemsList={waiverEmployeesFive}
                                        pagenamecheck={'Approval Employee Waiver'}
                                    />
                                </>
                            )}
                        </Box> : null}
                </>
            )}

            {/* Manage Column */}
            <Popover
                id={idFive}
                open={isManageColumnsOpenFive}
                anchorEl={anchorElFive}
                onClose={handleCloseManageColumnsFive}
                anchorOrigin={{ vertical: "bottom", horizontal: "left", }}>
                <ManageColumnsContent
                    handleClose={handleCloseManageColumnsFive}
                    searchQuery={searchQueryManageFive}
                    setSearchQuery={setSearchQueryManageFive}
                    filteredColumns={filteredColumnsFive}
                    columnVisibility={columnVisibilityFive}
                    toggleColumnVisibility={toggleColumnVisibilityFive}
                    setColumnVisibility={setColumnVisibilityFive}
                    initialColumnVisibility={initialColumnVisibilityFive}
                    columnDataTable={columnDataTableFive}
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
            {/* EXTERNAL COMPONENTS -------------- END */}
            {/* print layout */}
            <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRefFive}>
                    <TableHead>
                        <TableRow>
                            <TableCell>SNo</TableCell>
                            <TableCell>Branch</TableCell>
                            <TableCell>Unit</TableCell>
                            <TableCell>Team</TableCell>
                            <TableCell>Employee Name</TableCell>
                            <TableCell>Employee Code</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Vendor Name</TableCell>
                            <TableCell>Process</TableCell>
                            <TableCell>Total Field</TableCell>
                            <TableCell>Auto Error</TableCell>
                            <TableCell>Manual Error</TableCell>
                            <TableCell>Not Validate</TableCell>
                            <TableCell>Valid Error</TableCell>
                            <TableCell>Waiver %</TableCell>
                            <TableCell>Emp-Waiver</TableCell>
                            <TableCell>Net Error</TableCell>
                            <TableCell>per %</TableCell>
                            <TableCell>Percentage</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Request Reason</TableCell>
                            <TableCell>Forward Reason</TableCell>
                            <TableCell>Mode</TableCell>
                            <TableCell>History</TableCell>
                            <TableCell>Month History</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody align="left">
                        {rowDataTableFive &&
                            rowDataTableFive.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{row.branch}</TableCell>
                                    <TableCell>{row.unit}</TableCell>
                                    <TableCell>{row.team}</TableCell>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>{row.empcode}</TableCell>
                                    <TableCell>{row.date}</TableCell>
                                    <TableCell>{row.vendorname}</TableCell>
                                    <TableCell>{row.process}</TableCell>
                                    <TableCell>{row.totalfield}</TableCell>
                                    <TableCell>{row.autoerror}</TableCell>
                                    <TableCell>{row.manualerror}</TableCell>
                                    <TableCell>{row.notvalidate}</TableCell>
                                    <TableCell>{row.validateerror}</TableCell>
                                    <TableCell>{row.waiver}</TableCell>
                                    <TableCell>{row.waivererror}</TableCell>
                                    <TableCell>{row.neterror}</TableCell>
                                    <TableCell>{row.per}</TableCell>
                                    <TableCell>{row.percentage}</TableCell>
                                    <TableCell>{row.amount}</TableCell>
                                    <TableCell>{row.requestreason}</TableCell>
                                    <TableCell>{row.forwardreason}</TableCell>
                                    <TableCell>{row.mode}</TableCell>
                                    <TableCell>
                                        <Box>
                                            <Typography>Total Apply: {row.totalapply}</Typography>
                                            <Typography>Total Approved: {row.totalapproved}</Typography>
                                            <Typography>Total Reject: {row.totalreject}</Typography>
                                            <Typography>Total Amount: {row.totalamount}</Typography>
                                            <Typography>Total Waiver: {row.totalwaiver}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box>
                                            <Typography>Apply Number: {row.applynumber}</Typography>
                                            <Typography>Total Approved: {row.monthtotalapproved}</Typography>
                                            <Typography>Total Reject: {row.monthtotalreject}</Typography>
                                            <Typography>Total Pending: {row.monthtotalpending}</Typography>
                                            <Typography>Total Error: {row.monthtotalerror}</Typography>
                                            <Typography>Total Amount: {row.monthtotalamount}</Typography>
                                            <Typography>Total Waiver: {row.monthtotalwaiver}</Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={isFilterOpenFive} onClose={handleCloseFilterModFive} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>

                    <IconButton
                        aria-label="close"
                        onClick={handleCloseFilterModFive}
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
                            handleExportXLFive("filtered")
                        }}
                    >
                        Export Filtered Data
                    </Button>
                    <Button autoFocus variant="contained"
                        onClick={(e) => {
                            handleExportXLFive("overall")
                        }}
                    >
                        Export Over All Data
                    </Button>
                </DialogActions>
            </Dialog>
            {/*Export pdf Data  */}
            <Dialog open={isPdfFilterOpenFive} onClose={handleClosePdfFilterModFive} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>
                    <IconButton
                        aria-label="close"
                        onClick={handleClosePdfFilterModFive}
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
                            downloadPdfFive("filtered")
                            setIsPdfFilterOpenFive(false);
                        }}
                    >
                        Export Filtered Data
                    </Button>
                    <Button variant="contained"
                        onClick={(e) => {
                            downloadPdfFive("overall")
                            setIsPdfFilterOpenFive(false);
                        }}
                    >
                        Export Over All Data
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default WaitForRecheckList;