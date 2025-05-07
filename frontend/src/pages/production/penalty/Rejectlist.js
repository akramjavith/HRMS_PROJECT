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

const RecheckReasonCellThree = ({ rowId, currentRecheckReason, onSave, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert, setPopupContent, setPopupSeverity, handleClickOpenPopup, auth, fetchAllPenaltyError, rowData }) => {
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
                            tablename: 'Approval Employee Waiver_Reject',
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

const RejectReasonCellThree = ({ rowId, currentRejectReason, onSave, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert, setPopupContent, setPopupSeverity, handleClickOpenPopup, auth, fetchAllPenaltyError, rowData }) => {
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
                            tablename: 'Approval Employee Waiver_Reject',
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

const ApproveCellThree = ({ rowId, currentRejectReason, onSave, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert, setPopupContent, setPopupSeverity, handleClickOpenPopup, auth, fetchAllPenaltyError, rowData }) => {
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
                                        tablename: 'Approval Employee Waiver_Reject',
                                        date: date,
                                        time: time,
                                        status: "Approved",
                                        reason: "",
                                        mode: "Percentage",
                                        percentage: localApproveReason,
                                        calculatedamount: Number(rowData.amount) * (localApproveReason / 100),
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
                        // placeholder="Please Enter Percentage"
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

const RecheckReasonCellFour = ({ rowId, currentRecheckReason, onSave, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert, setPopupContent, setPopupSeverity, handleClickOpenPopup, auth, fetchAllPenaltyError, rowData }) => {
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
                            tablename: 'Approval Employee Waiver_NaN',
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

const RejectReasonCellFour = ({ rowId, currentRejectReason, onSave, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert, setPopupContent, setPopupSeverity, handleClickOpenPopup, auth, fetchAllPenaltyError, rowData }) => {
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
                            tablename: 'Approval Employee Waiver_NaN',
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

const ApproveCellFour = ({ rowId, currentRejectReason, onSave, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert, setPopupContent, setPopupSeverity, handleClickOpenPopup, auth, fetchAllPenaltyError, rowData }) => {
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
                                        tablename: 'Approval Employee Waiver_NaN',
                                        date: date,
                                        time: time,
                                        status: "Approved",
                                        reason: "",
                                        mode: "Percentage",
                                        percentage: localApproveReason,
                                        calculatedamount: Number(rowData.amount) * (localApproveReason / 100),
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
                        // placeholder="Please Enter Percentage"
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

function RejectList({ waiverEmployeesThree, waiverEmployeesFour, fetchAllPenaltyError, loader, tableCheck, setFilteredRowDataThree, filteredChangesThree, setFilteredChangesThree, filteredRowDataThree, setIsHandleChangeThree, isHandleChangeThree, setSearchedStringThree, searchedStringThree, setFilteredRowDataFour, filteredChangesFour, setFilteredChangesFour, filteredRowDataFour, setIsHandleChangeFour, isHandleChangeFour, setSearchedStringFour, searchedStringFour }) {

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
    const [recheckReasonsThree, setRecheckReasonsThree] = useState({});
    const [rejectReasonsThree, setRejectReasonsThree] = useState({});
    const [rowApprovedThree, setRowApprovedThree] = useState({});
    const [itemsFour, setItemsFour] = useState([]);
    const [selectedRowsFour, setSelectedRowsFour] = useState([]);
    const [recheckReasonsFour, setRecheckReasonsFour] = useState({});
    const [rejectReasonsFour, setRejectReasonsFour] = useState({});
    const [rowApprovedFour, setRowApprovedFour] = useState({});

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
    const [columnVisibilityThree, setColumnVisibilityThree] = useState(initialColumnVisibilityThree);

    // Show All Columns & Manage Columns second Table
    const initialColumnVisibilityFour = {
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

    const [columnVisibilityFour, setColumnVisibilityFour] = useState(initialColumnVisibilityFour);

    const addSerialNumberThree = (datas) => {
        setItemsThree(datas);
    };

    useEffect(() => {
        addSerialNumberThree(waiverEmployeesThree);
    }, [waiverEmployeesThree]);

    // second Table
    const addSerialNumberFour = (datas) => {
        setItemsFour(datas);
    };

    useEffect(() => {
        addSerialNumberFour(waiverEmployeesFour);
    }, [waiverEmployeesFour]);

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
        { field: "branch", headerName: "Branch", flex: 0, width: 150, hide: !columnVisibilityThree.branch, },
        { field: "unit", headerName: "Unit", flex: 0, width: 100, hide: !columnVisibilityThree.unit, },
        { field: "team", headerName: "Team", flex: 0, width: 100, hide: !columnVisibilityThree.team, },
        { field: "name", headerName: "Employee Name", flex: 0, width: 250, hide: !columnVisibilityThree.name, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "empcode", headerName: "Employee Code", flex: 0, width: 150, hide: !columnVisibilityThree.empcode, },
        { field: "date", headerName: "Date", flex: 0, width: 120, hide: !columnVisibilityThree.date, },
        { field: "vendorname", headerName: "Vendor Name", flex: 0, width: 150, hide: !columnVisibilityThree.vendorname, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "process", headerName: "Process", flex: 0, width: 150, hide: !columnVisibilityThree.process, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "totalfield", headerName: "Total Field", flex: 0, width: 120, hide: !columnVisibilityThree.totalfield, },
        { field: "autoerror", headerName: "Auto Error", flex: 0, width: 120, hide: !columnVisibilityThree.autoerror, },
        { field: "manualerror", headerName: "Manual Error", flex: 0, width: 120, hide: !columnVisibilityThree.manualerror, },
        { field: "notvalidate", headerName: "Not Validate", flex: 0, width: 120, hide: !columnVisibilityThree.notvalidate, },
        { field: "validateerror", headerName: "Valid Error", flex: 0, width: 120, hide: !columnVisibilityThree.validateerror, },
        { field: "waiver", headerName: "Waiver %", flex: 0, width: 120, hide: !columnVisibilityThree.waiver, },
        { field: "waivererror", headerName: "Emp-Waiver", flex: 0, width: 120, hide: !columnVisibilityThree.waivererror, },
        { field: "neterror", headerName: "Net Error", flex: 0, width: 120, hide: !columnVisibilityThree.neterror, },
        { field: "per", headerName: "per%", flex: 0, width: 120, hide: !columnVisibilityThree.per, },
        { field: "percentage", headerName: "per%", flex: 0, width: 120, hide: !columnVisibilityThree.percentage, },
        { field: "amount", headerName: "Amount", flex: 0, width: 120, hide: !columnVisibilityThree.amount, },
        { field: "requestreason", headerName: "Request Reason", flex: 0, width: 250, hide: !columnVisibilityThree.requestreason, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "forwardreason", headerName: "Forward Reason", flex: 0, width: 250, hide: !columnVisibilityThree.forwardreason, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "mode", headerName: "Mode", flex: 0, width: 100, hide: !columnVisibilityThree.mode, },
        {
            field: "overallhistory", headerName: "History", flex: 0, width: 250, hide: !columnVisibilityThree.overallhistory, cellStyle: cellStyles, headerClass: 'header-wrap',
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
            field: "monthhistory", headerName: "Month History", flex: 0, width: 250, hide: !columnVisibilityThree.monthhistory, cellStyle: cellStyles, headerClass: 'header-wrap',
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
            field: "approved", headerName: "Approved", flex: 0, width: 250, hide: !columnVisibilityThree.approved, sortable: false, filter: false,
            cellRenderer: (params) => (
                <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
                    <ApproveCellThree
                        rowId={params.data.id}
                        currentRejectReason={rowApprovedThree[params.data.id] || ""}
                        onSave={(rejectreason2) => {
                            setRowApprovedThree((prev) => ({
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
            field: "reject", headerName: "Reject", flex: 0, width: 250, hide: !columnVisibilityThree.reject, sortable: false, filter: false,
            cellRenderer: (params) => (
                <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
                    <RejectReasonCellThree
                        rowId={params.data.id}
                        currentRejectReason={rejectReasonsThree[params.data.id] || ""}
                        onSave={(rejectreason2) => {
                            setRejectReasonsThree((prev) => ({
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
            field: "recheck", headerName: "ReCheck", flex: 0, width: 250, hide: !columnVisibilityThree.recheck, sortable: false, filter: false,
            cellRenderer: (params) => (
                <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
                    <RecheckReasonCellThree
                        rowId={params.data.id}
                        currentRecheckReason={recheckReasonsThree[params.data.id] || ""}
                        onSave={(rejectreason) => {
                            setRecheckReasonsThree((prev) => ({
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

    // second table
    const columnDataTableFour = [
        { field: "serialNumber", headerName: "SNo", flex: 0, width: 75, hide: !columnVisibilityFour.serialNumber, pinned: 'left', lockPinned: true, },
        { field: "branch", headerName: "Branch", flex: 0, width: 150, hide: !columnVisibilityFour.branch, },
        { field: "unit", headerName: "Unit", flex: 0, width: 100, hide: !columnVisibilityFour.unit, },
        { field: "team", headerName: "Team", flex: 0, width: 100, hide: !columnVisibilityFour.team, },
        { field: "name", headerName: "Employee Name", flex: 0, width: 250, hide: !columnVisibilityFour.name, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "empcode", headerName: "Employee Code", flex: 0, width: 150, hide: !columnVisibilityFour.empcode, },
        { field: "date", headerName: "Date", flex: 0, width: 120, hide: !columnVisibilityFour.date, },
        { field: "vendorname", headerName: "Vendor Name", flex: 0, width: 150, hide: !columnVisibilityFour.vendorname, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "process", headerName: "Process", flex: 0, width: 150, hide: !columnVisibilityFour.process, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "totalfield", headerName: "Total Field", flex: 0, width: 120, hide: !columnVisibilityFour.totalfield, },
        { field: "autoerror", headerName: "Auto Error", flex: 0, width: 120, hide: !columnVisibilityFour.autoerror, },
        { field: "manualerror", headerName: "Manual Error", flex: 0, width: 120, hide: !columnVisibilityFour.manualerror, },
        { field: "notvalidate", headerName: "Not Validate", flex: 0, width: 120, hide: !columnVisibilityFour.notvalidate, },
        { field: "validateerror", headerName: "Valid Error", flex: 0, width: 120, hide: !columnVisibilityFour.validateerror, },
        { field: "waiver", headerName: "Waiver %", flex: 0, width: 120, hide: !columnVisibilityFour.waiver, },
        { field: "waivererror", headerName: "Emp-Waiver", flex: 0, width: 120, hide: !columnVisibilityFour.waivererror, },
        { field: "neterror", headerName: "Net Error", flex: 0, width: 120, hide: !columnVisibilityFour.neterror, },
        { field: "per", headerName: "per%", flex: 0, width: 120, hide: !columnVisibilityFour.per, },
        { field: "percentage", headerName: "per%", flex: 0, width: 120, hide: !columnVisibilityFour.percentage, },
        { field: "amount", headerName: "Amount", flex: 0, width: 120, hide: !columnVisibilityFour.amount, },
        { field: "requestreason", headerName: "Request Reason", flex: 0, width: 250, hide: !columnVisibilityFour.requestreason, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "forwardreason", headerName: "Forward Reason", flex: 0, width: 250, hide: !columnVisibilityFour.forwardreason, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "mode", headerName: "Mode", flex: 0, width: 100, hide: !columnVisibilityFour.mode, },
        {
            field: "overallhistory", headerName: "History", flex: 0, width: 250, hide: !columnVisibilityFour.overallhistory, cellStyle: cellStyles, headerClass: 'header-wrap',
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
            field: "monthhistory", headerName: "Month History", flex: 0, width: 250, hide: !columnVisibilityFour.monthhistory, cellStyle: cellStyles, headerClass: 'header-wrap',
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
            field: "approved", headerName: "Approved", flex: 0, width: 250, hide: !columnVisibilityFour.approved, sortable: false, filter: false,
            cellRenderer: (params) => (
                <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
                    <ApproveCellFour
                        rowId={params.data.id}
                        currentRejectReason={rowApprovedFour[params.data.id] || ""}
                        onSave={(rejectreason2) => {
                            setRowApprovedFour((prev) => ({
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
            field: "reject", headerName: "Reject", flex: 0, width: 250, hide: !columnVisibilityFour.reject, sortable: false, filter: false,
            cellRenderer: (params) => (
                <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
                    <RejectReasonCellFour
                        rowId={params.data.id}
                        currentRejectReason={rejectReasonsFour[params.data.id] || ""}
                        onSave={(rejectreason2) => {
                            setRejectReasonsFour((prev) => ({
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
            field: "recheck", headerName: "ReCheck", flex: 0, width: 250, hide: !columnVisibilityFour.recheck, sortable: false, filter: false,
            cellRenderer: (params) => (
                <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
                    <RecheckReasonCellFour
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
                        auth={auth} fetchAllPenaltyError={fetchAllPenaltyError} rowData={params.data}
                    />
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
    const fileExtension = fileFormat === "xl" ? 'xlsx' : 'csv';
    const handleExportXLThree = async (isfilter) => {
        let formattedData = [];
        let resultdata = (filteredChangesThree !== null ? filteredRowDataThree : rowDataTableThree) ?? [];

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
            formattedData = waiverEmployeesThree.map((row, index) => {
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
        saveAs(new Blob([buffer]), `Reject List.${fileExtension}`);
        setIsFilterOpenThree(false);
    };

    const handleExportXLFour = async (isfilter) => {
        let formattedData = [];
        let resultdata = (filteredChangesFour !== null ? filteredRowDataFour : rowDataTableFour) ?? [];

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
            formattedData = waiverEmployeesFour.map((row, index) => {
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
        saveAs(new Blob([buffer]), `NaN List.${fileExtension}`);
        setIsFilterOpenFour(false);
    };

    //print...
    const componentRefThree = useRef();
    const handleprintThree = useReactToPrint({
        content: () => componentRefThree.current,
        documentTitle: "Reject List",
        pageStyle: "print",
    });

    //print...
    const componentRefFour = useRef();
    const handleprintFour = useReactToPrint({
        content: () => componentRefFour.current,
        documentTitle: "NaN List",
        pageStyle: "print",
    });

    // pdf
    const downloadPdfThree = (isfilter) => {
        const doc = new jsPDF({ orientation: 'landscape' });

        // Define the table headers
        const headers = ['SNo', "Branch", "Unit", "Team", "Employee Name", "Employee Code", "Date", "Vendor Name", "Process", "Total Field", "Auto Error", "Manual Error",
            "Not Validate", "Valid Error", "Waiver %", "Emp-Waiver", "Net Error", "per (%)", "Percentage", "Amount", "Request Reason", "Forward Reason", "Mode", "History", "Month History"];

        let data = [];
        let resultdata = (filteredChangesThree !== null ? filteredRowDataThree : rowDataTableThree) ?? [];


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
            data = waiverEmployeesThree.map((row, index) => {
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

        doc.save("Reject List.pdf");
    };

    // pdf
    const downloadPdfFour = (isfilter) => {
        const doc = new jsPDF({ orientation: 'landscape' });

        // Define the table headers
        const headers = ['SNo', "Branch", "Unit", "Team", "Employee Name", "Employee Code", "Date", "Vendor Name", "Process", "Total Field", "Auto Error", "Manual Error",
            "Not Validate", "Valid Error", "Waiver %", "Emp-Waiver", "Net Error", "per (%)", "Percentage", "Amount", "Request Reason", "Forward Reason", "Mode", "History", "Month History"];

        let data = [];
        let resultdata = (filteredChangesFour !== null ? filteredRowDataFour : rowDataTableFour) ?? [];


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
            data = waiverEmployeesFour.map((row, index) => {
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

        doc.save("NaN List.pdf");
    };

    //image
    const handleCaptureImageThree = () => {
        if (gridRefTableImgThree.current) {
            domtoimage.toBlob(gridRefTableImgThree.current)
                .then((blob) => {
                    saveAs(blob, "Reject List.png");
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
                    saveAs(blob, "NaN List.png");
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
                    {tableCheck?.includes('Reject List') ?
                        <>
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
                                                <MenuItem value={waiverEmployeesThree?.length}>All</MenuItem>
                                            </Select>
                                        </Box>
                                    </Grid>
                                    <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center", }}>
                                        <Box>
                                            {isUserRoleCompare?.includes("excelapprovalemployeewaiver") && (
                                                <>
                                                    <Button onClick={(e) => { setIsFilterOpenThree(true); setFormat("xl"); }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("csvapprovalemployeewaiver") && (
                                                <>
                                                    <Button onClick={(e) => { setIsFilterOpenThree(true); setFormat("csv"); }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("printapprovalemployeewaiver") && (
                                                <>
                                                    <Button sx={userStyle.buttongrp} onClick={handleprintThree}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("pdfapprovalemployeewaiver") && (
                                                <>
                                                    <Button sx={userStyle.buttongrp} onClick={() => { setIsPdfFilterOpenThree(true); }}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("imageapprovalemployeewaiver") && (
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
                                                maindatas={waiverEmployeesThree}
                                                setSearchedString={setSearchedStringThree}
                                                searchQuery={searchQueryThree}
                                                setSearchQuery={setSearchQueryThree}
                                                paginated={false}
                                                totalDatas={waiverEmployeesThree}
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
                                            itemsList={waiverEmployeesThree}
                                            pagenamecheck={'Approval Employee Waiver'}
                                        />
                                    </>
                                )}
                            </Box><br />
                        </> : null}
                    {tableCheck?.includes('NaN List') ?
                        <>
                            {/* Second Tabale  */}
                            <Box sx={userStyle.container}>
                                {/* ******************************************************EXPORT Buttons****************************************************** */}
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext}>NaN List</Typography>
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
                                                <MenuItem value={waiverEmployeesFour?.length}>All</MenuItem>
                                            </Select>
                                        </Box>
                                    </Grid>
                                    <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center", }}>
                                        <Box>
                                            {isUserRoleCompare?.includes("excelapprovalemployeewaiver") && (
                                                <>
                                                    <Button onClick={(e) => { setIsFilterOpenFour(true); setFormat("xl"); }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("csvapprovalemployeewaiver") && (
                                                <>
                                                    <Button onClick={(e) => { setIsFilterOpenFour(true); setFormat("csv"); }} sx={userStyle.buttongrp} ><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("printapprovalemployeewaiver") && (
                                                <>
                                                    <Button sx={userStyle.buttongrp} onClick={handleprintFour} >&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("pdfapprovalemployeewaiver") && (
                                                <>
                                                    <Button sx={userStyle.buttongrp} onClick={() => { setIsPdfFilterOpenFour(true); }}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("imageapprovalemployeewaiver") && (
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
                                                maindatas={waiverEmployeesFour}
                                                setSearchedString={setSearchedStringFour}
                                                searchQuery={searchQueryFour}
                                                setSearchQuery={setSearchQueryFour}
                                                paginated={false}
                                                totalDatas={waiverEmployeesFour}
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
                                            itemsList={waiverEmployeesFour}
                                            pagenamecheck={'Approval Employee Waiver'}
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
            {/* EXTERNAL COMPONENTS -------------- END */}
            {/* print layout */}
            <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRefThree}>
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
                        {rowDataTableThree &&
                            rowDataTableThree.map((row, index) => (
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
            <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRefFour}>
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
                        {rowDataTableFour &&
                            rowDataTableFour.map((row, index) => (
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
            <Dialog open={isFilterOpenThree} onClose={handleCloseFilterModThree} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseFilterModThree}
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
                            handleExportXLThree("filtered")
                        }}
                    >
                        Export Filtered Data
                    </Button>
                    <Button autoFocus variant="contained"
                        onClick={(e) => {
                            handleExportXLThree("overall")
                        }}
                    >
                        Export Over All Data
                    </Button>
                </DialogActions>
            </Dialog>
            {/*Export pdf Data  */}
            <Dialog open={isPdfFilterOpenThree} onClose={handleClosePdfFilterModThree} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>
                    <IconButton
                        aria-label="close"
                        onClick={handleClosePdfFilterModThree}
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
                            downloadPdfThree("filtered")
                            setIsPdfFilterOpenThree(false);
                        }}
                    >
                        Export Filtered Data
                    </Button>
                    <Button variant="contained"
                        onClick={(e) => {
                            downloadPdfThree("overall")
                            setIsPdfFilterOpenThree(false);
                        }}
                    >
                        Export Over All Data
                    </Button>
                </DialogActions>
            </Dialog>
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

export default RejectList;