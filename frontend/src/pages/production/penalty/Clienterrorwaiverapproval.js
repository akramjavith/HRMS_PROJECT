import React, { useContext, useEffect, useRef, useState } from "react";
import { Box, Button, FormControl, Grid, MenuItem, Popover, Select, Typography, OutlinedInput, TextareaAutosize, Dialog, DialogContent, DialogActions, IconButton, Table, Paper, TableContainer, TableHead, TableRow, TableBody, TableCell, CircularProgress } from "@mui/material";
import ExcelJS from "exceljs";
import jsPDF from "jspdf";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import LoadingButton from "@mui/lab/LoadingButton";
import Selects from "react-select";
import axios from "axios";
import { saveAs } from "file-saver";
import "jspdf-autotable";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../../components/Errorhandling";
import { MultiSelect } from "react-multi-select-component";
import Headtitle from "../../../components/Headtitle";
import { AuthContext, UserRoleAccessContext } from "../../../context/Appcontext";
import { userStyle, colourStyles } from "../../../pageStyle";
import { SERVICE } from "../../../services/Baseservice";
import { ThreeDots } from "react-loader-spinner";
import AlertDialog from "../../../components/Alert";
import ExportData from "../../../components/ExportData";
import MessageAlert from "../../../components/MessageAlert";
import PageHeading from "../../../components/PageHeading";
import AggregatedSearchBar from "../../../components/AggregatedSearchBar";
import AggridTable from "../../../components/AggridTable";
import domtoimage from 'dom-to-image';
import ResentEmployeeClient from "./Resentemployeeclient.js";
import WaitRecheckEmployeeClient from "./Waitrecheckemployeeclient.js";
import ManageColumnsContent from "../../../components/ManageColumn";
import moment from 'moment';

const RecheckReasonCell = ({ rowId, currentRecheckReason, onSave, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert, setPopupContent, setPopupSeverity, handleClickOpenPopup, auth, fetchAllClient, rowData }) => {
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
                let res = await axios.put(`${SERVICE.PENALTYCLIENTERROR_SINGLE}/${rowId}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    history: [
                        ...rowData.history,
                        {
                            tablename: 'Client Error Waiver Approval_Approved',
                            date: date,
                            time: time,
                            status: "Recheck",
                            reason: localRecheckReason,
                            mode: "",
                        }
                    ]
                });
                await fetchAllClient();
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

const RejectReasonCell = ({ rowId, currentRejectReason, onSave, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert, setPopupContent, setPopupSeverity, handleClickOpenPopup, auth, fetchAllClient, rowData }) => {
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
                let res = await axios.put(`${SERVICE.PENALTYCLIENTERROR_SINGLE}/${rowId}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    history: [
                        ...rowData.history,
                        {
                            tablename: 'Client Error Waiver Approval_Approved',
                            date: date,
                            time: time,
                            status: "Reject",
                            reason: localRejectReason,
                            mode: "",
                        }
                    ]
                });
                await fetchAllClient();
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

const ApproveCell = ({ rowId, currentRejectReason, onSave, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert, setPopupContent, setPopupSeverity, handleClickOpenPopup, auth, fetchAllClient, rowData }) => {
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
                const [day, month, year] = rowData.date?.split('/');
                const rowformattedDate = `${year}-${month}-${day}`;

                let res_vendor = await axios.post(SERVICE.PENALTYWAIVERMASTER_FOR_CLIENTERROR_RESTRICTIONS_APPROVALPAGE, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    fromdate: rowformattedDate,
                    todate: rowformattedDate,
                    department: rowData.department,
                    employeename: rowData.employeename,
                    company: rowData.company,
                    branch: rowData.branch,
                    rowformattedDate: rowformattedDate,
                });

                let result = res_vendor?.data?.penaltywaivermasters;
                // console.log(result, 'result')
                if (result?.length === 0) {
                    setPopupContentMalert(`This date range does not have any data matches. Please enter data in the 'Penalty Waiver' section for these dates.`);
                    setPopupSeverityMalert("warning");
                    handleClickOpenPopupMalert();
                } else {

                    let aggregatedData = [];
                    let finalData = [];

                    for (const dep of result || []) {

                        let res_clientError = await axios.post(SERVICE.CLIENTERRORMONTHAMOUNT_WAIVER, {
                            fromdate: dep.fromdate,
                            todate: dep.todate,
                            companyname: rowData.employeename,
                        },
                            {
                                headers: {
                                    Authorization: `Bearer ${auth.APIToken}`,
                                },
                            }
                        );

                        finalData = res_clientError?.data?.finalData || [];

                        // get only approved in history
                        const calculateClientAmount = (employeeid) => {
                            const filteredData = res_clientError?.data?.finalData?.filter((item) => {
                                return item.employeeid === employeeid && item.history?.some(
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
                        const calculateCount = (employeeid) => {
                            const filteredData = res_clientError?.data?.finalData?.filter((item) => {
                                if (item.employeeid === employeeid && item.history?.length > 0) {
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
                            const existingEmployee = acc.find((entry) => entry.employeeid === item.employeeid);
                            const totalClientAmount = calculateClientAmount(item.employeeid)
                            const totalAppliedCount = calculateCount(item.employeeid)

                            if (existingEmployee) {
                                existingEmployee.amount += item.amount;
                                existingEmployee.percentage += item.percentage;
                            } else {
                                acc.push({
                                    employeeid: item.employeeid,
                                    employeename: item.employeename,
                                    clientamount: item.clientamount,
                                    totalappliedclientamount: totalClientAmount,
                                    totalappliedcount: totalAppliedCount,
                                    amount: item.amount,
                                    percentage: item.percentage,
                                    // count: finalData.filter((entry) => entry.employeeid === item.employeeid).length,
                                    clienterrocountupto: dep.clienterrocountupto,
                                    clienterroramount: dep.clienterroramount,
                                    clienterrorpercentage: dep.clienterrorpercentage,
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
                        const remainingAmount = data.clienterroramount - totalAmount;

                        const totalCount = data.totalappliedcount;
                        const remainingCount = data.clienterrocountupto - totalCount;

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
                        else if (totalAmount > data.clienterroramount && totalCount <= data.clienterrocountupto) {
                            setPopupContentMalert("Waiver amount is reached, you cannot apply.");
                            setPopupSeverityMalert("warning");
                            handleClickOpenPopupMalert();
                            return;
                        }
                        else if (localApproveReason > data.clienterrorpercentage) {
                            setPopupContentMalert(`You cannot approve percentage above ${data.clienterrorpercentage}`);
                            setPopupSeverityMalert("warning");
                            handleClickOpenPopupMalert();
                            return;
                        }
                        else if (totalCount > data.clienterrocountupto && totalAmount <= data.clienterroramount) {
                            setPopupContentMalert("Waiver count is reached, you cannot apply.");
                            setPopupSeverityMalert("warning");
                            handleClickOpenPopupMalert();
                            return;
                        }
                        else {
                            let res = await axios.put(`${SERVICE.PENALTYCLIENTERROR_SINGLE}/${rowId}`, {
                                headers: {
                                    Authorization: `Bearer ${auth.APIToken}`,
                                },
                                clientamount: rowData.clientamount,
                                percentage: localApproveReason,
                                amount: rowData.clientamount * (localApproveReason / 100),
                                history: [
                                    ...rowData.history,
                                    {
                                        tablename: 'Client Error Waiver Approval_Approved',
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
                            await fetchAllClient();
                            setPopupContent("Approved Successfully");
                            setPopupSeverity("success");
                            handleClickOpenPopup();

                            // Calculate approved amount,count and applied client amount, count
                            const totalAmount = data.totalappliedclientamount;
                            const remainingAmount = data.clienterroramount - (totalAmount !== 0 ? totalAmount : rowData.clientamount);

                            const totalCount = data.totalappliedcount + [rowData].length;
                            const remainingCount = data.clienterrocountupto - totalCount;

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
                <Button sx={{ textTransform: 'capitalize' }} variant="contained" color="success" size="small" onClick={handleSaveClick}>Submit</Button>
            </Grid>
        </Grid>
    );
};

const RecheckReasonCellTwo = ({ rowId, currentRecheckReason, onSave, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert, setPopupContent, setPopupSeverity, handleClickOpenPopup, auth, fetchAllClient, rowData }) => {
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
                let res = await axios.put(`${SERVICE.PENALTYCLIENTERROR_SINGLE}/${rowId}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    history: [
                        ...rowData.history,
                        {
                            tablename: 'Client Error Waiver Approval_Approved',
                            date: date,
                            time: time,
                            status: "Recheck",
                            reason: localRecheckReason,
                            mode: "",
                        }
                    ]
                });
                await fetchAllClient();
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

const RejectReasonCellTwo = ({ rowId, currentRejectReason, onSave, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert, setPopupContent, setPopupSeverity, handleClickOpenPopup, auth, fetchAllClient, rowData }) => {
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
                let res = await axios.put(`${SERVICE.PENALTYCLIENTERROR_SINGLE}/${rowId}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    history: [
                        ...rowData.history,
                        {
                            tablename: 'Client Error Waiver Approval_Reject',
                            date: date,
                            time: time,
                            status: "Reject",
                            reason: localRejectReason,
                            mode: "",
                        }
                    ]
                });
                await fetchAllClient();
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

const ApproveCellTwo = ({ rowId, currentRejectReason, onSave, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert, setPopupContent, setPopupSeverity, handleClickOpenPopup, auth, fetchAllClient, rowData }) => {
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
                const [day, month, year] = rowData.date?.split('/');
                const rowformattedDate = `${year}-${month}-${day}`;

                let res_vendor = await axios.post(SERVICE.PENALTYWAIVERMASTER_FOR_CLIENTERROR_RESTRICTIONS_APPROVALPAGE, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    fromdate: rowformattedDate,
                    todate: rowformattedDate,
                    department: rowData.department,
                    employeename: rowData.employeename,
                    company: rowData.company,
                    branch: rowData.branch,
                    rowformattedDate: rowformattedDate,
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

                        let res_clientError = await axios.post(SERVICE.CLIENTERRORMONTHAMOUNT_WAIVER, {
                            fromdate: dep.fromdate,
                            todate: dep.todate,
                            companyname: rowData.employeename,
                        },
                            {
                                headers: {
                                    Authorization: `Bearer ${auth.APIToken}`,
                                },
                            }
                        );

                        finalData = res_clientError?.data?.finalData || [];

                        // get only apply data not includes approved in history
                        const calculateClientAmount = (employeeid) => {
                            const filteredData = res_clientError?.data?.finalData?.filter((item) => {
                                return item.employeeid === employeeid && item.history?.some(
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

                        // get only apply data not includes approved in history
                        const calculateCount = (employeeid) => {
                            const filteredData = res_clientError?.data?.finalData?.filter((item) => {
                                if (item.employeeid === employeeid && item.history?.length > 0) {
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
                            const existingEmployee = acc.find((entry) => entry.employeeid === item.employeeid);
                            const totalClientAmount = calculateClientAmount(item.employeeid)
                            const totalAppliedCount = calculateCount(item.employeeid)

                            if (existingEmployee) {
                                existingEmployee.amount += item.amount;
                                existingEmployee.percentage += item.percentage;
                            } else {
                                acc.push({
                                    employeeid: item.employeeid,
                                    employeename: item.employeename,
                                    clientamount: item.clientamount,
                                    totalappliedclientamount: totalClientAmount,
                                    totalappliedcount: totalAppliedCount,
                                    amount: item.amount,
                                    percentage: item.percentage,
                                    // count: finalData.filter((entry) => entry.employeeid === item.employeeid).length,
                                    clienterrocountupto: dep.clienterrocountupto,
                                    clienterroramount: dep.clienterroramount,
                                    clienterrorpercentage: dep.clienterrorpercentage,
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
                        const remainingAmount = data.clienterroramount - totalAmount;

                        const totalCount = data.totalappliedcount;
                        const remainingCount = data.clienterrocountupto - totalCount;

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
                        else if (totalAmount > data.clienterroramount && totalCount <= data.clienterrocountupto) {
                            setPopupContentMalert("Waiver amount is reached, you cannot apply.");
                            setPopupSeverityMalert("warning");
                            handleClickOpenPopupMalert();
                            return;
                        }
                        else if (localApproveReason > data.clienterrorpercentage) {
                            setPopupContentMalert(`You cannot approve percentage above ${data.clienterrorpercentage}`);
                            setPopupSeverityMalert("warning");
                            handleClickOpenPopupMalert();
                            return;
                        }
                        else if (totalCount > data.clienterrocountupto && totalAmount <= data.clienterroramount) {
                            setPopupContentMalert("Waiver count is reached, you cannot apply.");
                            setPopupSeverityMalert("warning");
                            handleClickOpenPopupMalert();
                            return;
                        }
                        else {

                            let res = await axios.put(`${SERVICE.PENALTYCLIENTERROR_SINGLE}/${rowId}`, {
                                headers: {
                                    Authorization: `Bearer ${auth.APIToken}`,
                                },
                                clientamount: rowData.clientamount,
                                percentage: localApproveReason,
                                amount: rowData.clientamount * (localApproveReason / 100),
                                history: [
                                    ...rowData.history,
                                    {
                                        tablename: 'Client Error Waiver Approval_Resent',
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
                            await fetchAllClient();
                            setPopupContent("Approved Successfully");
                            setPopupSeverity("success");
                            handleClickOpenPopup();

                            // Calculate approved amount,count and applied client amount, count
                            const totalAmount = data.totalappliedclientamount;
                            const remainingAmount = data.clienterroramount - (totalAmount !== 0 ? totalAmount : rowData.clientamount);

                            const totalCount = data.totalappliedcount + [rowData].length;
                            const remainingCount = data.clienterrocountupto - totalCount;

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
                <Button sx={{ textTransform: 'capitalize' }} variant="contained" color="success" size="small" onClick={handleSaveClick}>Submit</Button>
            </Grid>
        </Grid>
    );
};

function ClientErrorWaiverApproval() {

    let cellStyles = {
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        lineHeight: 'normal',
        // fontSize: "12px"
    }

    const gridRefTable = useRef(null);
    const gridRefTabletwo = useRef(null);
    const gridRefTableImg = useRef(null);
    const gridRefTableImgtwo = useRef(null);

    const { auth } = useContext(AuthContext);
    const { isUserRoleCompare, isUserRoleAccess, listPageAccessMode, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);

    const [selectedTable, setSelectedTable] = useState([]);
    const [valueTable, setValueTable] = useState([]);
    const [tableCheck, setTableCheck] = useState([]);
    const [clientErrors, setClientErrors] = useState([]);
    const [clientErrorstwo, setClientErrorstwo] = useState([]);
    const [clientErrorsThree, setClientErrorsThree] = useState([]);
    const [clientErrorsFour, setClientErrorsFour] = useState([]);
    const [clientErrorsFive, setClientErrorsFive] = useState([]);
    const [items, setItems] = useState([]);
    const [itemstwo, setItemstwo] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedRowstwo, setSelectedRowstwo] = useState([]);
    const [loadingdeloverall, setloadingdeloverall] = useState(false);
    const [recheckReasons, setRecheckReasons] = useState({});
    const [rejectReasons, setRejectReasons] = useState({});
    const [rowApproved, setRowApproved] = useState({});
    const [btnSubmit, setBtnSubmit] = useState(false);
    const [rowIndex, setRowIndex] = useState();
    const [recheckReasonstwo, setRecheckReasonstwo] = useState({});
    const [rejectReasonstwo, setRejectReasonstwo] = useState({});
    const [rowApprovedtwo, setRowApprovedtwo] = useState({});
    const [btnSubmittwo, setBtnSubmittwo] = useState(false);
    const [rowIndextwo, setRowIndextwo] = useState();
    const [loader, setLoader] = useState(false);
    const [filterUser, setFilterUser] = useState({ fromdate: "", todate: "", });

    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
    const [isHandleChange, setIsHandleChange] = useState(false);
    const [searchedString, setSearchedString] = useState("");

    const [filteredRowDatatwo, setFilteredRowDatatwo] = useState([]);
    const [filteredChangestwo, setFilteredChangestwo] = useState(null);
    const [isHandleChangetwo, setIsHandleChangetwo] = useState(false);
    const [searchedStringtwo, setSearchedStringtwo] = useState("");

    const [filteredRowDataThree, setFilteredRowDataThree] = useState([]);
    const [filteredChangesThree, setFilteredChangesThree] = useState(null);
    const [isHandleChangeThree, setIsHandleChangeThree] = useState(false);
    const [searchedStringThree, setSearchedStringThree] = useState("");

    const [filteredRowDataFour, setFilteredRowDataFour] = useState([]);
    const [filteredChangesFour, setFilteredChangesFour] = useState(null);
    const [isHandleChangeFour, setIsHandleChangeFour] = useState(false);
    const [searchedStringFour, setSearchedStringFour] = useState("");

    const [filteredRowDataFive, setFilteredRowDataFive] = useState([]);
    const [filteredChangesFive, setFilteredChangesFive] = useState(null);
    const [isHandleChangeFive, setIsHandleChangeFive] = useState(false);
    const [searchedStringFive, setSearchedStringFive] = useState("");

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

    let listpageaccessby =
        listPageAccessMode?.find(
            (data) =>
                data.modulename === "Quality" &&
                data.submodulename === "Penalty" &&
                data.mainpagename === "Penalty Waiver" &&
                data.subpagename === "Client Error Waiver Approval" &&
                data.subsubpagename === ""
        )?.listpageaccessmode || "Overall";

    const tableOptions = [
        { label: "Approved Employee Client Error Waiver Request List", value: "Approved Employee Client Error Waiver Request List" },
        { label: "Reject Employee Client Error Waiver Request List", value: "Reject Employee Client Error Waiver Request List" },
        { label: "Resent Employee Client Error Waiver Request List", value: "Resent Employee Client Error Waiver Request List" },
        { label: "NaN Employee Client Error Waiver Request List", value: "NaN Employee Client Error Waiver Request List" },
        { label: "Wait Recheck Employee Client Error Waiver Request List", value: "Wait Recheck Employee Client Error Waiver Request List" }
    ];

    const modeDropDowns = [
        { label: "My Hierarchy List", value: "myhierarchy" },
        { label: "All Hierarchy List", value: "allhierarchy" },
        { label: "My + All Hierarchy List", value: "myallhierarchy" },
    ];
    const sectorDropDowns = [
        { label: "Primary", value: "Primary" },
        { label: "Secondary", value: "Secondary" },
        { label: "Tertiary", value: "Tertiary" },
        { label: "All", value: "all" },
    ];

    const [modeselection, setModeSelection] = useState({
        label: "My Hierarchy List",
        value: "myhierarchy",
    });
    const [sectorSelection, setSectorSelection] = useState({
        label: "Primary",
        value: "Primary",
    });

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

    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        level: true,
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
        clientamount: true,
        percentage: true,
        amount: true,
        overallhistory: true,
        monthhistory: true,
        requestreason: true,
        forwardreason: true,
        approved: true,
        reject: true,
        recheck: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

    // Show All Columns & Manage Columns second Table
    const initialColumnVisibilitytwo = {
        serialNumber: true,
        level: true,
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
        clientamount: true,
        percentage: true,
        amount: true,
        overallhistory: true,
        monthhistory: true,
        requestreason: true,
        forwardreason: true,
        approved: true,
        reject: true,
        recheck: true,
    };

    const [columnVisibilitytwo, setColumnVisibilitytwo] = useState(initialColumnVisibilitytwo);

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
            pagename: String("Client Error Waiver Approval"),
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

    //Table Mode multiselect
    const handleTableChange = (options) => {
        setValueTable(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedTable(options);
    };

    const customValueRendererCompany = (valueTable, _categoryname) => {
        return valueTable?.length
            ? valueTable.map(({ label }) => label)?.join(", ")
            : "Please Select Table Mode";
    };

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

    //get all project.
    // const fetchAllClient = async () => {
    //     setPageName(!pageName);
    //     setLoader(true);
    //     try {
    //         let res = await axios.post(SERVICE.CLIENT_ERROR_WAIVER_APPROVAL_HIERARCHY_WITH_DATE, {
    //             headers: {
    //                 Authorization: `Bearer ${auth.APIToken}`,
    //             },
    //             hierachy: modeselection.value,
    //             sector: sectorSelection.value,
    //             username: isUserRoleAccess?.companyname,
    //             listpageaccessmode: listpageaccessby,
    //             pagename: "menuclienterrorwaiverapproval",
    //             fromdate: filterUser.fromdate,
    //             todate: filterUser.todate
    //         });
    //         let resdep = await axios.post(SERVICE.CLIENT_ERROR_WAIVER_APPROVAL_DEPARTMENTMONTH_DATE_FILTER, {
    //             headers: {
    //                 Authorization: `Bearer ${auth.APIToken}`,
    //             },
    //             fromdate: filterUser.fromdate,
    //             todate: filterUser.todate
    //         });
    //         // console.log(res?.data?.resultAccessFilter, 'res?.data?.resultAccessFilter')
    //         // console.log(resdep?.data?.departmentdetails, 'departmentdetails')

    //         const groupedData = res?.data?.resultAccessFilter?.reduce((acc, item) => {
    //             const {
    //                 _id,
    //                 project,
    //                 category,
    //                 subcategory,
    //                 loginid,
    //                 vendor,
    //                 company,
    //                 branch,
    //                 unit,
    //                 team,
    //                 employeename,
    //                 employeeid,
    //                 date,
    //                 documentnumber,
    //                 documentlink,
    //                 fieldname,
    //                 line,
    //                 errorvalue, correctvalue, clienterror, errorstatus, clientamount, history, level, control
    //             } = item;

    //             const totalhistory = item.history ?? [];

    //             // Initialize entry if not present
    //             if (!acc[employeeid]) {
    //                 acc[employeeid] = {
    //                     _id,
    //                     project,
    //                     category,
    //                     subcategory,
    //                     loginid,
    //                     vendor,
    //                     company,
    //                     branch,
    //                     unit,
    //                     team,
    //                     employeename,
    //                     employeeid,
    //                     date,
    //                     documentnumber,
    //                     documentlink,
    //                     fieldname,
    //                     line,
    //                     errorvalue,
    //                     correctvalue,
    //                     clienterror,
    //                     errorstatus,
    //                     clientamount,
    //                     history,
    //                     level, control,
    //                     totalhistory: [],
    //                     totalapply: 0,
    //                     totalapproved: 0,
    //                     totalreject: 0,
    //                     totalamount: 0,
    //                     totalwaiver: 0,
    //                     documents: [],
    //                 };
    //             }

    //             // Combine history arrays and document numbers
    //             acc[employeeid].totalhistory = [...acc[employeeid].history, ...history];
    //             // acc[employeeid].history = [...acc[employeeid].history, ...history];
    //             acc[employeeid].documents.push(documentnumber);
    //             console.log(totalhistory)

    //             // Calculate totalapply, totalapproved, totalreject, and totalamount
    //             acc[employeeid].totalapply += totalhistory.filter(
    //                 data => data.status === "Sent" || data.status === "Sent Recheck"
    //             ).length;

    //             acc[employeeid].totalapproved += totalhistory.filter(
    //                 data => data.status === "Approved"
    //             ).length;

    //             acc[employeeid].totalreject += totalhistory.filter(
    //                 data => data.status === "Reject"
    //             ).length;

    //             acc[employeeid].totalamount += totalhistory
    //                 .filter(data => data.mode === "Percentage")
    //                 .reduce((sum, data) => sum + (data.calculatedamount || 0), 0);

    //             return acc;
    //         }, {});

    //         // Convert grouped data back to an array
    //         const firstTableData = res?.data?.resultAccessFilter?.map((item) => {
    //             const sentData = item.history?.find(data => data.status === "Sent");
    //             const forwardData = item.history?.find(data => data.status === "Forward");
    //             const groupedItem = groupedData[item.employeeid];
    //             // console.log(
    //             //     {
    //             //         ...item,
    //             //         id: item._id,
    //             //         date: moment(item.date).format('DD/MM/YYYY'),
    //             //         requestreason: sentData ? sentData.reason : '',
    //             //         forwardreason: forwardData ? forwardData.reason : '',
    //             //         totalhistory: groupedItem?.totalapply || [],
    //             //         totalapply: groupedItem?.totalapply || 0,
    //             //         totalapproved: groupedItem?.totalapproved || 0,
    //             //         totalreject: groupedItem?.totalreject || 0,
    //             //         totalamount: groupedItem?.totalamount || 0,
    //             //         totalwaiver: groupedItem?.totalwaiver || 0,
    //             //         applynumber: "",
    //             //         monthtotalapproved: "",
    //             //         monthtotalreject: "",
    //             //         monthtotalerror: "",
    //             //         monthtotalwaiver: "",
    //             //         monthtotalwaiveramount: ""
    //             //     }
    //             // )
    //             if (
    //                 item.history &&
    //                 ((item.history[item.history.length - 1]?.mode === "Mode" &&
    //                     item.history[item.history.length - 1]?.status === "Approved") ||
    //                     item.history[item.history.length - 1]?.status === "Forward")
    //             ) {
    //                 return {
    //                     ...item,
    //                     id: item._id,
    //                     date: moment(item.date).format('DD/MM/YYYY'),
    //                     requestreason: sentData ? sentData.reason : '',
    //                     forwardreason: forwardData ? forwardData.reason : '',
    //                     totalapply: groupedItem?.totalapply || 0,
    //                     totalapproved: groupedItem?.totalapproved || 0,
    //                     totalreject: groupedItem?.totalreject || 0,
    //                     totalamount: groupedItem?.totalamount || 0,
    //                     totalwaiver: groupedItem?.totalwaiver || 0,
    //                     applynumber: "",
    //                     monthtotalapproved: "",
    //                     monthtotalreject: "",
    //                     monthtotalerror: "",
    //                     monthtotalwaiver: "",
    //                     monthtotalwaiveramount: ""
    //                 }
    //             }
    //         }).filter(Boolean);

    //         // console.log(firstTableData);
    //         setClientErrors(firstTableData?.map((item, index) => ({ ...item, serialNumber: index + 1, })));
    //         let secondTableData = res?.data?.resultAccessFilter?.map((item) => {
    //             const sentData = item.history?.find(data => data.status === "Sent");
    //             const forwardData = item.history?.find(data => data.mode === "Mode" && data.status === "Reject");
    //             const groupedItem = groupedData[item.employeeid];

    //             if (item.history && (item.history[item.history.length - 1]?.mode === "Mode" && item.history[item.history.length - 1]?.status === "Reject")) {
    //                 return {
    //                     ...item,
    //                     id: item._id,
    //                     date: moment(item.date).format('DD/MM/YYYY'),
    //                     requestreason: sentData ? sentData.reason : '',
    //                     forwardreason: forwardData ? forwardData.reason : '',
    //                     totalapply: groupedItem?.totalapply || 0,
    //                     totalapproved: groupedItem?.totalapproved || 0,
    //                     totalreject: groupedItem?.totalreject || 0,
    //                     totalamount: groupedItem?.totalamount || 0,
    //                     totalwaiver: groupedItem?.totalwaiver || 0,
    //                     applynumber: "",
    //                     monthtotalapproved: "",
    //                     monthtotalreject: "",
    //                     monthtotalerror: "",
    //                     monthtotalwaiver: "",
    //                     monthtotalwaiveramount: ""
    //                 }
    //             }
    //             return null;
    //         }).filter(Boolean);
    //         setClientErrorstwo(secondTableData?.map((item, index) => ({ ...item, serialNumber: index + 1, })));
    //         let thirdTableData = res?.data?.resultAccessFilter?.filter(data => data.waiverrecheckstatus === "Sent Recheck")
    //             .map((item, index) => ({
    //                 ...item,
    //                 id: item._id,
    //                 serialNumber: index + 1,
    //                 date: moment(item.date).format('DD/MM/YYYY'),
    //             }))
    //         setClientErrorsThree([]);
    //         let fourthTableData = res?.data?.resultAccessFilter?.map((item) => {
    //             const sentData = item.history?.find(data => data.status === "Sent");
    //             const forwardData = item.history?.find(data => data.mode === "Mode" && data.status === "NaN");
    //             if (item.history[item.history.length - 1]?.mode === "Mode" && item.history[item.history.length - 1]?.status === "NaN") {
    //                 return {
    //                     ...item,
    //                     id: item._id,
    //                     date: moment(item.date).format('DD/MM/YYYY'),
    //                     requestreason: sentData ? sentData.reason : '',
    //                     forwardreason: forwardData ? forwardData.reason : '',
    //                 }
    //             }
    //             return null;
    //         }).filter(Boolean);
    //         setClientErrorsFour(fourthTableData?.map((item, index) => ({ ...item, serialNumber: index + 1, })));
    //         let fifthTableData = res?.data?.resultAccessFilter?.filter(data => data.waiverrecheckstatus === "Sent Recheck")
    //             .map((item, index) => ({
    //                 ...item,
    //                 id: item._id,
    //                 serialNumber: index + 1,
    //                 date: moment(item.date).format('DD/MM/YYYY'),
    //             }))

    //         setClientErrorsFive([]);
    //         setLoader(false);
    //     } catch (err) {
    //         setLoader(true);
    //         handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    //     }
    // };

    const fetchAllClient = async () => {
        setPageName(!pageName);
        setLoader(true);
        try {
            let res = await axios.post(SERVICE.CLIENT_ERROR_WAIVER_APPROVAL_HIERARCHY_WITH_DATE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                hierachy: modeselection.value,
                sector: sectorSelection.value,
                username: isUserRoleAccess?.companyname,
                listpageaccessmode: listpageaccessby,
                pagename: "menuclienterrorwaiverapproval",
                fromdate: filterUser.fromdate,
                todate: filterUser.todate
            });
            if (
                // (   // res?.data?.hierarchyfirstlevel > 0 &&
                //     res?.data?.filteredoverallsectorall > 0 &&
                //     res?.data?.resultAccessFilter?.length < 1 &&
                //     ["myallhierarchy", "allhierarchy"]?.includes(modeselection.value))

                // ||


                res?.data?.resultAccessFilterHierarchy > 0 &&
                res?.data?.resultAccessFilter?.length == 0 &&
                ["myallhierarchy", "allhierarchy"]?.includes(modeselection.value)


            ) {


                setLoader(true);
                alert("Some employees have not been given access to this page.");
            }

            let res_overall = await axios.post(SERVICE.CLIENT_ERROR_FORWARD_HIERARCHY, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                hierachy: modeselection.value,
                sector: sectorSelection.value,
                username: isUserRoleAccess?.companyname,
                listpageaccessmode: listpageaccessby,
                pagename: "menuclienterrorforward",
            });
            if (
                // (   // res_overall?.data?.hierarchyfirstlevel > 0 &&
                //     res_overall?.data?.filteredoverallsectorall > 0 &&
                //     res_overall?.data?.resultAccessFilter?.length < 1 &&
                //     ["myallhierarchy", "allhierarchy"]?.includes(modeselection.value))

                // ||


                res_overall?.data?.resultAccessFilterHierarchy > 0 &&
                res_overall?.data?.resultAccessFilter?.length == 0 &&
                ["myallhierarchy", "allhierarchy"]?.includes(modeselection.value)


            ) {


                setLoader(true);
                alert("Some employees have not been given access to this page.");
            }

            let res_nan = await axios.post(SERVICE.CLIENT_ERROR_WAIVER_APPROVAL_HIERARCHY_WITH_DATE_NAN_TABLE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                hierachy: modeselection.value,
                sector: sectorSelection.value,
                username: isUserRoleAccess?.companyname,
                listpageaccessmode: listpageaccessby,
                pagename: "menuclienterrorwaiverapproval",
                fromdate: filterUser.fromdate,
                todate: filterUser.todate
            });
            if (
                // (   // res_nan?.data?.hierarchyfirstlevel > 0 &&
                //     res_nan?.data?.filteredoverallsectorall > 0 &&
                //     res_nan?.data?.resultAccessFilter?.length < 1 &&
                //     ["myallhierarchy", "allhierarchy"]?.includes(modeselection.value))

                // ||


                res_nan?.data?.resultAccessFilterHierarchy > 0 &&
                res_nan?.data?.resultAccessFilter?.length == 0 &&
                ["myallhierarchy", "allhierarchy"]?.includes(modeselection.value)


            ) {

                setLoader(true);
                alert("Some employees have not been given access to this page.");
            }

            let resdep = await axios.post(SERVICE.CLIENT_ERROR_WAIVER_APPROVAL_DEPARTMENTMONTH_DATE_FILTER, {
                headers: { Authorization: `Bearer ${auth.APIToken}` },
                // department: item.department,
            });

            // Employees over error history
            const groupedData = res_overall?.data?.resultAccessFilter?.reduce((acc, item) => {
                const {
                    _id, project, category, subcategory, loginid, vendor, company, branch, unit,
                    team, employeename, employeeid, date, documentnumber, documentlink, fieldname, line,
                    errorvalue, correctvalue, clienterror, errorstatus, clientamount, history, level, control
                } = item;

                const totalhistory = item.history ?? [];
                const finaltotalhistory = [item.history[item.history?.length - 1]] ?? [];

                // Initialize entry if not present
                if (!acc[employeeid]) {
                    acc[employeeid] = {
                        _id, project, category, subcategory, loginid, vendor, company, branch, unit,
                        team, employeename, employeeid, date, documentnumber, documentlink, fieldname, line,
                        errorvalue, correctvalue, clienterror, errorstatus, clientamount, history, level, control,
                        totalhistory: [], finaltotalhistory: [], totalapply: 0, totalapproved: 0, totalreject: 0,
                        totalamount: 0, totalwaiver: 0, documents: [],
                    };
                }

                // Combine history arrays and document numbers
                acc[employeeid].totalhistory = [...acc[employeeid].history, ...history];
                acc[employeeid].finaltotalhistory.push(item.history[item.history?.length - 1]);
                acc[employeeid].documents.push(documentnumber);

                // Calculate totalapply, totalapproved, totalreject, and totalamount
                acc[employeeid].totalapply += totalhistory?.filter(
                    data => data.status === "Sent" || data.status === "Sent Recheck"
                ).length;

                acc[employeeid].totalapproved += finaltotalhistory?.filter(
                    data => data.mode === "Percentage" && data.status === "Approved"
                ).length;

                acc[employeeid].totalreject += finaltotalhistory?.filter(
                    data => (data.tablename === "Client Error Waiver Approval_Approved" ||
                        data.tablename === "Client Error Waiver Approval_Reject" ||
                        data.tablename === "Client Error Waiver Approval_Resent" ||
                        data.tablename === "Client Error Waiver Approval_NaN" ||
                        data.tablename === "Client Error Waiver Approval_Wait"
                    ) && data.status === "Reject"
                ).length;

                acc[employeeid].totalamount += totalhistory
                    ?.filter(data => data.mode === "Percentage")
                    ?.reduce((sum, data) => sum + (data.calculatedamount || 0), 0);

                return acc;
            }, {});

            // Employees month error history based on the department month set
            const matchedDepData = await Promise.all(
                res?.data?.resultAccessFilter?.map(async (item) => {
                    // Find the department match based on date range
                    const matchedDepartment = resdep?.data?.departmentdetails?.find(
                        (dep) =>
                            item.department === dep.department &&
                            item.date >= dep.fromdate &&
                            item.date <= dep.todate
                    );

                    return matchedDepartment ? { ...item, monthname: matchedDepartment.monthname } : null;
                })
            );

            const matchedDepDataNaN = await Promise.all(
                res_nan?.data?.resultAccessFilter?.map(async (item) => {

                    // Find the department match based on date range
                    const matchedDepartment = resdep?.data?.departmentdetails?.find(
                        (dep) =>
                            item.department === dep.department &&
                            item.date >= dep.fromdate &&
                            item.date <= dep.todate
                    );

                    return matchedDepartment ? { ...item, monthname: matchedDepartment.monthname } : null;
                })
            );

            // Remove null values (if no match found)
            const filteredData = matchedDepData.filter(Boolean);
            const filteredDataNaN = matchedDepDataNaN.filter(Boolean);

            // **Grouping Data by Month and Employee ID**
            const groupedMonthData = filteredData.reduce((acc, item) => {
                const {
                    employeeid, date, history, monthname
                } = item;

                const monthtotalhistory = history ?? [];
                const monthfinaltotalhistory = [history[history?.length - 1]] ?? [];

                // **Initialize month-based group for each employee**
                if (!acc[employeeid]) acc[employeeid] = {};

                if (!acc[employeeid][monthname]) {
                    acc[employeeid][monthname] = {
                        applynumber: 0,
                        monthtotalapproved: 0,
                        monthtotalreject: 0,
                    };
                }

                // **Calculate applynumber (Total Requests Sent)**
                acc[employeeid][monthname].applynumber += monthtotalhistory?.filter(
                    (data) => data.status === "Sent" || data.status === "Sent Recheck"
                ).length;

                // **Calculate monthtotalapproved (Total Approvals)**
                acc[employeeid][monthname].monthtotalapproved += monthfinaltotalhistory?.filter(
                    (data) => data.mode === "Percentage" && data.status === "Approved"
                ).length;

                // **Calculate monthtotalreject (Total Rejections)**
                acc[employeeid][monthname].monthtotalreject += monthfinaltotalhistory?.filter(
                    (data) => (data.tablename === "Client Error Waiver Approval_Approved" ||
                        data.tablename === "Client Error Waiver Approval_Reject" ||
                        data.tablename === "Client Error Waiver Approval_Resent" ||
                        data.tablename === "Client Error Waiver Approval_NaN" ||
                        data.tablename === "Client Error Waiver Approval_Wait"
                    ) && data.status === "Reject"
                ).length;

                return acc;
            }, {});

            if (valueTable?.includes('Approved Employee Client Error Waiver Request List')) {
                // Convert grouped data back to an array
                const firstTableData = filteredData?.map((item) => {
                    const sentData = item.history?.find(data => data.status === "Sent");
                    const forwardData = item.history?.find(data => data.status === "Forward");
                    const groupedItem = groupedData[item.employeeid];
                    const groupedItemMonth = groupedMonthData[item.employeeid];

                    if (
                        item.history &&
                        ((item.history[item.history.length - 1]?.mode === "Mode" &&
                            item.history[item.history.length - 1]?.status === "Approved") ||
                            item.history[item.history.length - 1]?.status === "Forward")
                    ) {
                        return {
                            ...item,
                            id: item._id,
                            date: moment(item.date).format('DD/MM/YYYY'),
                            amount: item.amount.toFixed(2),
                            percentage: 100,
                            requestreason: sentData ? sentData.reason : '',
                            forwardreason: forwardData ? forwardData.reason : '',
                            totalapply: groupedItem?.totalapply || 0,
                            totalapproved: groupedItem?.totalapproved || 0,
                            totalreject: groupedItem?.totalreject || 0,
                            totalamount: (groupedItem?.totalamount ? groupedItem?.totalamount.toFixed(2) : groupedItem?.totalamount) || 0,
                            totalwaiver: (groupedItem?.totalwaiver ? groupedItem?.totalwaiver.toFixed(2) : groupedItem?.totalwaiver) || 0,
                            // applynumber: groupedItemMonth?.applynumber || 0,
                            // monthtotalapproved: groupedItemMonth?.monthtotalapproved || 0,
                            // monthtotalreject: groupedItemMonth?.monthtotalreject || 0,
                            applynumber: groupedMonthData[item.employeeid]?.[item.monthname]?.applynumber || 0,
                            monthtotalapproved: groupedMonthData[item.employeeid]?.[item.monthname]?.monthtotalapproved || 0,
                            monthtotalreject: groupedMonthData[item.employeeid]?.[item.monthname]?.monthtotalreject || 0,
                            monthtotalerror: "",
                            monthtotalwaiver: "",
                            monthtotalwaiveramount: ""
                        }
                    }
                }).filter(Boolean);
                setClientErrors(firstTableData?.map((item, index) => ({ ...item, serialNumber: index + 1, })));
                setFilteredRowData(firstTableData?.map((item, index) => ({ ...item, serialNumber: index + 1, })));
                setTableCheck(valueTable);
            }

            if (valueTable?.includes('Reject Employee Client Error Waiver Request List')) {
                let secondTableData = filteredData?.map((item) => {
                    const sentData = item.history?.find(data => data.status === "Sent");
                    // const forwardData = item.history?.find(data => data.mode === "Mode" && data.status === "Reject");
                    const forwardData = item.history?.find(data => data.status === "Reject");
                    const groupedItem = groupedData[item.employeeid];
                    const groupedItemMonth = groupedMonthData[item.employeeid];

                    // if (item.history && (item.history[item.history.length - 1]?.mode === "Mode" && item.history[item.history.length - 1]?.status === "Reject")) {
                    if (item.history && item.history[item.history.length - 1]?.status === "Reject") {
                        return {
                            ...item,
                            id: item._id,
                            date: moment(item.date).format('DD/MM/YYYY'),
                            amount: item.amount.toFixed(2),
                            percentage: 100,
                            requestreason: sentData ? sentData.reason : '',
                            forwardreason: forwardData ? forwardData.reason : '',
                            totalapply: groupedItem?.totalapply || 0,
                            totalapproved: groupedItem?.totalapproved || 0,
                            totalreject: groupedItem?.totalreject || 0,
                            totalamount: (groupedItem?.totalamount ? groupedItem?.totalamount.toFixed(2) : groupedItem?.totalamount) || 0,
                            totalwaiver: (groupedItem?.totalwaiver ? groupedItem?.totalwaiver.toFixed(2) : groupedItem?.totalwaiver) || 0,
                            // applynumber: groupedItemMonth?.applynumber || 0,
                            // monthtotalapproved: groupedItemMonth?.monthtotalapproved || 0,
                            // monthtotalreject: groupedItemMonth?.monthtotalreject || 0,
                            applynumber: groupedMonthData[item.employeeid]?.[item.monthname]?.applynumber || 0,
                            monthtotalapproved: groupedMonthData[item.employeeid]?.[item.monthname]?.monthtotalapproved || 0,
                            monthtotalreject: groupedMonthData[item.employeeid]?.[item.monthname]?.monthtotalreject || 0,
                            monthtotalerror: "",
                            monthtotalwaiver: "",
                            monthtotalwaiveramount: ""
                        }
                    }
                    return null;
                }).filter(Boolean);
                setClientErrorstwo(secondTableData?.map((item, index) => ({ ...item, serialNumber: index + 1, })));
                setFilteredRowDatatwo(secondTableData?.map((item, index) => ({ ...item, serialNumber: index + 1, })));
                setTableCheck(valueTable);
            }

            if (valueTable?.includes('Resent Employee Client Error Waiver Request List')) {
                let thirdTableData = filteredData?.map((item) => {

                    const relevantRequestHistory = item.history.filter(val =>
                        ["Sent", "Recheck"].includes(val.status)
                    );

                    const relevantForwardHistory = item.history.filter(val =>
                        ["Forward"].includes(val.status)
                    );

                    const requestReasons = relevantRequestHistory.map(val => val.reason).join('\n');
                    const forwardReasons = relevantForwardHistory.map(val => val.reason).join('\n');
                    const groupedItem = groupedData[item.employeeid];
                    const groupedItemMonth = groupedMonthData[item.employeeid];

                    if (item.history[item.history.length - 1]?.status === "Sent Recheck") {
                        return {
                            ...item,
                            id: item._id,
                            date: moment(item.date).format('DD/MM/YYYY'),
                            amount: item.amount.toFixed(2),
                            percentage: 100,
                            mode: 'NaN',
                            requestreason: requestReasons,
                            forwardreason: forwardReasons ? forwardReasons : 'null',
                            totalapply: groupedItem?.totalapply || 0,
                            totalapproved: groupedItem?.totalapproved || 0,
                            totalreject: groupedItem?.totalreject || 0,
                            totalamount: (groupedItem?.totalamount ? groupedItem?.totalamount.toFixed(2) : groupedItem?.totalamount) || 0,
                            totalwaiver: (groupedItem?.totalwaiver ? groupedItem?.totalwaiver.toFixed(2) : groupedItem?.totalwaiver) || 0,
                            // applynumber: groupedItemMonth?.applynumber || 0,
                            // monthtotalapproved: groupedItemMonth?.monthtotalapproved || 0,
                            // monthtotalreject: groupedItemMonth?.monthtotalreject || 0,
                            applynumber: groupedMonthData[item.employeeid]?.[item.monthname]?.applynumber || 0,
                            monthtotalapproved: groupedMonthData[item.employeeid]?.[item.monthname]?.monthtotalapproved || 0,
                            monthtotalreject: groupedMonthData[item.employeeid]?.[item.monthname]?.monthtotalreject || 0,
                            monthtotalerror: "",
                            monthtotalwaiver: "",
                            monthtotalwaiveramount: ""
                        };
                    }
                    return null;
                }).filter(Boolean);
                setClientErrorsThree(thirdTableData?.map((item, index) => ({ ...item, serialNumber: index + 1, })));
                setFilteredRowDataThree(thirdTableData?.map((item, index) => ({ ...item, serialNumber: index + 1, })));
                setTableCheck(valueTable);
            }

            if (valueTable?.includes('NaN Employee Client Error Waiver Request List')) {
                let fourthTableData = filteredDataNaN?.map((item) => {
                    // const sentData = item.history?.find(data => data.status === "Sent");
                    // const forwardData = item.history?.find(data => data.mode === "Mode" && data.status === "NaN");
                    const groupedItem = groupedData[item.employeeid];
                    const groupedItemMonth = groupedMonthData[item.employeeid];
                    // if (item.history[item.history.length - 1]?.mode !== "Percentage" && item.history[item.history.length - 1]?.status === "Approved") {
                    return {
                        ...item,
                        id: item._id,
                        date: moment(item.date).format('DD/MM/YYYY'),
                        amount: item.amount.toFixed(2),
                        percentage: 100,
                        // requestreason: sentData ? sentData.reason : '',
                        // forwardreason: forwardData ? forwardData.reason : '',
                        requestreason: '',
                        forwardreason: '',
                        totalapply: groupedItem?.totalapply || 0,
                        totalapproved: groupedItem?.totalapproved || 0,
                        totalreject: groupedItem?.totalreject || 0,
                        totalamount: (groupedItem?.totalamount ? groupedItem?.totalamount.toFixed(2) : groupedItem?.totalamount) || 0,
                        totalwaiver: (groupedItem?.totalwaiver ? groupedItem?.totalwaiver.toFixed(2) : groupedItem?.totalwaiver) || 0,
                        // applynumber: groupedItemMonth?.applynumber || 0,
                        // monthtotalapproved: groupedItemMonth?.monthtotalapproved || 0,
                        // monthtotalreject: groupedItemMonth?.monthtotalreject || 0,
                        applynumber: groupedMonthData[item.employeeid]?.[item.monthname]?.applynumber || 0,
                        monthtotalapproved: groupedMonthData[item.employeeid]?.[item.monthname]?.monthtotalapproved || 0,
                        monthtotalreject: groupedMonthData[item.employeeid]?.[item.monthname]?.monthtotalreject || 0,
                        monthtotalerror: "",
                        monthtotalwaiver: "",
                        monthtotalwaiveramount: ""
                    }
                    // }
                    // return null;
                }).filter(Boolean);
                setClientErrorsFour(fourthTableData?.map((item, index) => ({ ...item, serialNumber: index + 1, })));
                setFilteredRowDataFour(fourthTableData?.map((item, index) => ({ ...item, serialNumber: index + 1, })));
                setTableCheck(valueTable);
            }

            if (valueTable?.includes('Wait Recheck Employee Client Error Waiver Request List')) {
                let fifthTableData = filteredData?.filter(data => data.history?.length === 1)
                    ?.map((item, index) => {
                        const sentData = item.history?.find(data => data.status === "Sent");
                        const groupedItem = groupedData[item.employeeid];
                        const groupedItemMonth = groupedMonthData[item.employeeid];
                        return {
                            ...item,
                            id: item._id,
                            date: moment(item.date).format('DD/MM/YYYY'),
                            amount: item.amount.toFixed(2),
                            percentage: 100,
                            requestreason: sentData ? sentData.reason : '',
                            forwardreason: '',
                            totalapply: groupedItem?.totalapply || 0,
                            totalapproved: groupedItem?.totalapproved || 0,
                            totalreject: groupedItem?.totalreject || 0,
                            totalamount: (groupedItem?.totalamount ? groupedItem?.totalamount.toFixed(2) : groupedItem?.totalamount) || 0,
                            totalwaiver: (groupedItem?.totalwaiver ? groupedItem?.totalwaiver.toFixed(2) : groupedItem?.totalwaiver) || 0,
                            // applynumber: groupedItemMonth?.applynumber || 0,
                            // monthtotalapproved: groupedItemMonth?.monthtotalapproved || 0,
                            // monthtotalreject: groupedItemMonth?.monthtotalreject || 0,
                            applynumber: groupedMonthData[item.employeeid]?.[item.monthname]?.applynumber || 0,
                            monthtotalapproved: groupedMonthData[item.employeeid]?.[item.monthname]?.monthtotalapproved || 0,
                            monthtotalreject: groupedMonthData[item.employeeid]?.[item.monthname]?.monthtotalreject || 0,
                            monthtotalerror: "",
                            monthtotalwaiver: "",
                            monthtotalwaiveramount: ""
                        }
                    }).filter(Boolean);
                setClientErrorsFive(fifthTableData?.map((item, index) => ({ ...item, serialNumber: index + 1, })));
                setFilteredRowDataFive(fifthTableData?.map((item, index) => ({ ...item, serialNumber: index + 1, })));
                setTableCheck(valueTable);
            }
            setLoader(false);
        } catch (err) {
            setLoader(true);
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    //submit option for saving
    const handleSubmit = (e) => {
        setPageName(!pageName)
        e.preventDefault();
        if (selectedTable.length === 0) {
            setPopupContentMalert("Please Select Table Mode");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (modeselection.value === "Please Select Mode") {
            setPopupContentMalert("Please Select Mode");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (sectorSelection.value === "Please Select Level") {
            setPopupContentMalert("Please Select Level");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (filterUser.fromdate === '' && filterUser.todate === '') {
            setPopupContentMalert("Please Select Date");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else {
            fetchAllClient();
        }
    };

    const handleClear = () => {
        setPageName(!pageName);
        setSelectedTable([]);
        setValueTable([]);
        setTableCheck([]);
        setSectorSelection({ label: "Primary", value: "Primary" });
        setModeSelection({ label: "My Hierarchy List", value: "myhierarchy" });
        setClientErrors([]);
        setClientErrorstwo([]);
        setClientErrorsThree([]);
        setClientErrorsFour([]);
        setClientErrorsFive([]);
        setItems([]);
        setItemstwo([]);
        const today = new Date();

        const formatDate = (date) => {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
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

    // second Table
    const addSerialNumbertwo = (datas) => {
        setItemstwo(datas);
    };

    useEffect(() => {
        addSerialNumbertwo(clientErrorstwo);
    }, [clientErrorstwo]);

    //Datatable
    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setSelectedRows([]);
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
        setSelectedRowstwo([]);
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

    const columnDataTable = [
        { field: "serialNumber", headerName: "SNo", flex: 0, width: 75, hide: !columnVisibility.serialNumber, pinned: 'left', lockPinned: true, },
        { field: "level", headerName: "Level", flex: 0, width: 100, hide: !columnVisibility.level, },
        { field: "vendor", headerName: "Vendor Name", flex: 0, width: 150, hide: !columnVisibility.vendor, },
        { field: "branch", headerName: "Branch Name", flex: 0, width: 150, hide: !columnVisibility.branch, },
        { field: "employeeid", headerName: "Employee Code", flex: 0, width: 150, hide: !columnVisibility.employeeid, },
        { field: "employeename", headerName: "Employee Name", flex: 0, width: 250, hide: !columnVisibility.employeename, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "loginid", headerName: "Login id", flex: 0, width: 120, hide: !columnVisibility.loginid, },
        { field: "date", headerName: "Date", flex: 0, width: 120, hide: !columnVisibility.date, },
        { field: "category", headerName: "Category", flex: 0, width: 250, hide: !columnVisibility.category, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "subcategory", headerName: "Subcategory", flex: 0, width: 250, hide: !columnVisibility.subcategory, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "documentnumber", headerName: "Document Number", flex: 0, width: 150, hide: !columnVisibility.documentnumber, },
        { field: "fieldname", headerName: "Field Name", flex: 0, width: 150, hide: !columnVisibility.fieldname, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "line", headerName: "Line", flex: 0, width: 100, hide: !columnVisibility.line, },
        { field: "errorvalue", headerName: "Error Value", flex: 0, width: 250, hide: !columnVisibility.errorvalue, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "correctvalue", headerName: "Correct Value", flex: 0, width: 250, hide: !columnVisibility.correctvalue, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "clienterror", headerName: "Client Error", flex: 0, width: 250, hide: !columnVisibility.clienterror, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "clientamount", headerName: "Client Amount", flex: 0, width: 100, hide: !columnVisibility.clientamount, },
        { field: "percentage", headerName: "per%", flex: 0, width: 100, hide: !columnVisibility.percentage, },
        { field: "amount", headerName: "Amount", flex: 0, width: 100, hide: !columnVisibility.amount, },
        {
            field: "overallhistory", headerName: "History", flex: 0, width: 250, hide: !columnVisibility.overallhistory, cellStyle: cellStyles, headerClass: 'header-wrap',
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
            field: "monthhistory", headerName: "Month History", flex: 0, width: 250, hide: !columnVisibility.monthhistory, cellStyle: cellStyles, headerClass: 'header-wrap',
            cellRenderer: (params) => (
                <Grid >
                    <Typography variant="body2">Apply Number: {params.data.applynumber}</Typography>
                    <Typography variant="body2">Total Approved: {params.data.monthtotalapproved}</Typography>
                    <Typography variant="body2">Total Reject: {params.data.monthtotalreject}</Typography>
                    <Typography variant="body2">Total Error: {params.data.monthtotalerror}</Typography>
                    <Typography variant="body2">Total Waiver: {params.data.monthtotalwaiver}</Typography>
                    <Typography variant="body2">Total Waiver Amount: {params.data.monthtotalwaiveramount}</Typography>
                </Grid>
            ),
        },
        { field: "requestreason", headerName: "Request Reason", flex: 0, width: 250, hide: !columnVisibility.requestreason, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "forwardreason", headerName: "Forward Reason", flex: 0, width: 250, hide: !columnVisibility.forwardreason, cellStyle: cellStyles, headerClass: 'header-wrap', },
        {
            field: "approved", headerName: "Approved", flex: 0, width: 250, hide: !columnVisibility.approved, sortable: false, filter: false,
            cellRenderer: (params) => (
                <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
                    <ApproveCell
                        rowId={params.data.id}
                        currentModeReason={rowApproved[params.data.id] || ''}
                        onSave={(rejectreason2) => {
                            setRowApproved((prev) => ({
                                ...prev,
                                [params.data.id]: rejectreason2,
                            }));
                        }}
                        setPopupContentMalert={setPopupContentMalert} setPopupSeverityMalert={setPopupSeverityMalert} handleClickOpenPopupMalert={handleClickOpenPopupMalert}
                        setPopupContent={setPopupContent}
                        setPopupSeverity={setPopupSeverity}
                        handleClickOpenPopup={handleClickOpenPopup}
                        auth={auth} fetchAllClient={fetchAllClient} rowData={params.data}
                    />
                </Grid>
            ),
        },
        {
            field: "reject", headerName: "Reject", flex: 0, width: 250, hide: !columnVisibility.reject, sortable: false, filter: false,
            cellRenderer: (params) => (
                <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
                    <RejectReasonCell
                        rowId={params.data.id}
                        currentRejectReason={rejectReasons[params.data.id] || ""}
                        onSave={(rejectreason2) => {
                            setRejectReasons((prev) => ({
                                ...prev,
                                [params.data.id]: rejectreason2,
                            }));
                        }}
                        setPopupContentMalert={setPopupContentMalert} setPopupSeverityMalert={setPopupSeverityMalert} handleClickOpenPopupMalert={handleClickOpenPopupMalert}
                        setPopupContent={setPopupContent}
                        setPopupSeverity={setPopupSeverity}
                        handleClickOpenPopup={handleClickOpenPopup}
                        auth={auth} fetchAllClient={fetchAllClient} rowData={params.data}
                    />
                </Grid>
            ),
        },
        {
            field: "recheck", headerName: "ReCheck", flex: 0, width: 250, hide: !columnVisibility.recheck, sortable: false, filter: false,
            cellRenderer: (params) => (
                <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
                    <RecheckReasonCell
                        rowId={params.data.id}
                        currentRecheckReason={recheckReasons[params.data.id] || ""}
                        onSave={(rejectreason) => {
                            setRecheckReasons((prev) => ({
                                ...prev,
                                [params.data.id]: rejectreason,
                            }));
                        }}
                        setPopupContentMalert={setPopupContentMalert} setPopupSeverityMalert={setPopupSeverityMalert} handleClickOpenPopupMalert={handleClickOpenPopupMalert}
                        setPopupContent={setPopupContent}
                        setPopupSeverity={setPopupSeverity}
                        handleClickOpenPopup={handleClickOpenPopup}
                        auth={auth} fetchAllClient={fetchAllClient} rowData={params.data}
                    />
                </Grid>
            ),
        },
    ];

    // second table
    const columnDataTabletwo = [
        { field: "serialNumber", headerName: "SNo", flex: 0, width: 75, hide: !columnVisibilitytwo.serialNumber, pinned: 'left', lockPinned: true, },
        { field: "level", headerName: "Level", flex: 0, width: 100, hide: !columnVisibilitytwo.level, },
        { field: "vendor", headerName: "Vendor Name", flex: 0, width: 150, hide: !columnVisibilitytwo.vendor, },
        { field: "branch", headerName: "Branch Name", flex: 0, width: 150, hide: !columnVisibilitytwo.branch, },
        { field: "employeeid", headerName: "Employee Code", flex: 0, width: 150, hide: !columnVisibilitytwo.employeeid, },
        { field: "employeename", headerName: "Employee Name", flex: 0, width: 250, hide: !columnVisibilitytwo.employeename, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "loginid", headerName: "Login id", flex: 0, width: 120, hide: !columnVisibilitytwo.loginid, },
        { field: "date", headerName: "Date", flex: 0, width: 120, hide: !columnVisibilitytwo.date, },
        { field: "category", headerName: "Category", flex: 0, width: 250, hide: !columnVisibilitytwo.category, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "subcategory", headerName: "Subcategory", flex: 0, width: 250, hide: !columnVisibilitytwo.subcategory, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "documentnumber", headerName: "Document Number", flex: 0, width: 150, hide: !columnVisibilitytwo.documentnumber, },
        { field: "fieldname", headerName: "Field Name", flex: 0, width: 150, hide: !columnVisibilitytwo.fieldname, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "line", headerName: "Line", flex: 0, width: 100, hide: !columnVisibilitytwo.line, },
        { field: "errorvalue", headerName: "Error Value", flex: 0, width: 250, hide: !columnVisibilitytwo.errorvalue, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "correctvalue", headerName: "Correct Value", flex: 0, width: 250, hide: !columnVisibilitytwo.correctvalue, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "clienterror", headerName: "Client Error", flex: 0, width: 250, hide: !columnVisibilitytwo.clienterror, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "clientamount", headerName: "Client Amount", flex: 0, width: 100, hide: !columnVisibilitytwo.clientamount, },
        { field: "percentage", headerName: "per%", flex: 0, width: 100, hide: !columnVisibilitytwo.percentage, },
        { field: "amount", headerName: "Amount", flex: 0, width: 100, hide: !columnVisibilitytwo.amount, },
        {
            field: "overallhistory", headerName: "History", flex: 0, width: 250, hide: !columnVisibilitytwo.overallhistory, cellStyle: cellStyles, headerClass: 'header-wrap',
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
            field: "monthhistory", headerName: "Month History", flex: 0, width: 250, hide: !columnVisibilitytwo.monthhistory, cellStyle: cellStyles, headerClass: 'header-wrap',
            cellRenderer: (params) => (
                <Grid >
                    <Typography variant="body2">Apply Number: {params.data.applynumber}</Typography>
                    <Typography variant="body2">Total Approved: {params.data.monthtotalapproved}</Typography>
                    <Typography variant="body2">Total Reject: {params.data.monthtotalreject}</Typography>
                    <Typography variant="body2">Total Error: {params.data.monthtotalerror}</Typography>
                    <Typography variant="body2">Total Waiver: {params.data.monthtotalwaiver}</Typography>
                    <Typography variant="body2">Total Waiver Amount: {params.data.monthtotalwaiveramount}</Typography>
                </Grid>
            ),
        },
        { field: "requestreason", headerName: "Request Reason", flex: 0, width: 250, hide: !columnVisibilitytwo.requestreason, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "forwardreason", headerName: "Forward Reason", flex: 0, width: 250, hide: !columnVisibilitytwo.forwardreason, cellStyle: cellStyles, headerClass: 'header-wrap', },
        {
            field: "approved", headerName: "Approved", flex: 0, width: 250, hide: !columnVisibilitytwo.approved, sortable: false, filter: false,
            cellRenderer: (params) => (
                <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
                    <ApproveCellTwo
                        rowId={params.data.id}
                        currentModeReason={rowApprovedtwo[params.data.id] || ""}
                        onSave={(rejectreason2) => {
                            setRowApprovedtwo((prev) => ({
                                ...prev,
                                [params.data.id]: rejectreason2,
                            }));
                        }}
                        setPopupContentMalert={setPopupContentMalert} setPopupSeverityMalert={setPopupSeverityMalert} handleClickOpenPopupMalert={handleClickOpenPopupMalert}
                        setPopupContent={setPopupContent}
                        setPopupSeverity={setPopupSeverity}
                        handleClickOpenPopup={handleClickOpenPopup}
                        auth={auth} fetchAllClient={fetchAllClient} rowData={params.data}
                    />
                </Grid>
            ),
        },
        {
            field: "reject", headerName: "Reject", flex: 0, width: 250, hide: !columnVisibilitytwo.reject, sortable: false, filter: false,
            cellRenderer: (params) => (
                <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
                    <RejectReasonCellTwo
                        rowId={params.data.id}
                        currentRejectReason={rejectReasonstwo[params.data.id] || ""}
                        onSave={(rejectreason2) => {
                            setRejectReasonstwo((prev) => ({
                                ...prev,
                                [params.data.id]: rejectreason2,
                            }));
                        }}
                        setPopupContentMalert={setPopupContentMalert} setPopupSeverityMalert={setPopupSeverityMalert} handleClickOpenPopupMalert={handleClickOpenPopupMalert}
                        setPopupContent={setPopupContent}
                        setPopupSeverity={setPopupSeverity}
                        handleClickOpenPopup={handleClickOpenPopup}
                        auth={auth} fetchAllClient={fetchAllClient} rowData={params.data}
                    />
                </Grid>
            ),
        },
        {
            field: "recheck", headerName: "ReCheck", flex: 0, width: 250, hide: !columnVisibilitytwo.recheck, sortable: false, filter: false,
            cellRenderer: (params) => (
                <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
                    <RecheckReasonCellTwo
                        rowId={params.data.id}
                        currentRecheckReason={recheckReasonstwo[params.data.id] || ""}
                        onSave={(rejectreason) => {
                            setRecheckReasonstwo((prev) => ({
                                ...prev,
                                [params.data.id]: rejectreason,
                            }));
                        }}
                        setPopupContentMalert={setPopupContentMalert} setPopupSeverityMalert={setPopupSeverityMalert} handleClickOpenPopupMalert={handleClickOpenPopupMalert}
                        setPopupContent={setPopupContent}
                        setPopupSeverity={setPopupSeverity}
                        handleClickOpenPopup={handleClickOpenPopup}
                        auth={auth} fetchAllClient={fetchAllClient} rowData={params.data}
                    />
                </Grid>
            ),
        },
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

    // Function to filter columns based on search query
    const filteredColumns = columnDataTable.filter((column) =>
        column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase())
    );

    // Function to filter columns based on search query second Table
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

    // Exports
    const [fileFormat, setFormat] = useState("");
    const fileExtension = fileFormat === "xl" ? 'xlsx' : 'csv';
    const handleExportXL = async (isfilter) => {
        let formattedData = [];
        let resultdata = (filteredChanges !== null ? filteredRowData : rowDataTable) ?? [];

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
                    `Total Error: ${row.monthtotalerror || ""}`,
                    `Total Waiver: ${row.monthtotalwaiver || ""}`,
                    `Total Waiver Amount: ${row.monthtotalwaiveramount || ""}`,
                ].join("\n");

                return {
                    "SNo": index + 1,
                    "Level": row.level,
                    "Vendor Name": row.vendor,
                    "Branch": row.branch,
                    "Employee Code": row.employeeid,
                    "Employee Name": row.employeename,
                    "Login id": row.loginid,
                    "Date": row.date,
                    "Category": row.category,
                    "Subcategory": row.subcategory,
                    "Document Number": row.documentnumber,
                    "Field Name": row.fieldname,
                    "Line": row.line,
                    "Error Value": row.errorvalue,
                    "Correct Value": row.correctvalue,
                    "Client Error": row.clienterror,
                    "Client Amount": row.clientamount,
                    "per (%)": row.percentage,
                    "Amount": row.amount,
                    "History": overallHistory,
                    "Month History": monthHistory,
                    "Request Reason": row.requestreason,
                    "Forward Reason": row.forwardreason,
                };
            });
        } else if (isfilter === "overall") {
            formattedData = clientErrors.map((row, index) => {
                // Add `overallhistory` data as separate lines
                const overallHistory = [
                    `Total Apply: ${row.totalapply || ""}`,
                    `Total Approved: ${row.totalapproved || ""}`,
                    `Total Reject: ${row.totalreject || ""}`,
                    `Total Amount: ${row.totalamount || ""}`,
                    `Total Waiver: ${row.totalwaiver || ""}`
                ].join("\n");

                // Add `monthhistory` data as separate lines
                const monthHistory = [
                    `Apply Number: ${row.applynumber || ""}`,
                    `Total Approved: ${row.monthtotalapproved || ""}`,
                    `Total Reject: ${row.monthtotalreject || ""}`,
                    `Total Error: ${row.monthtotalerror || ""}`,
                    `Total Waiver: ${row.monthtotalwaiver || ""}`,
                    `Total Waiver Amount: ${row.monthtotalwaiveramount || ""}`
                ].join("\n");

                return {
                    "SNo": index + 1,
                    "Level": row.level,
                    "Vendor Name": row.vendor,
                    "Branch": row.branch,
                    "Employee Code": row.employeeid,
                    "Employee Name": row.employeename,
                    "Login id": row.loginid,
                    "Date": row.date,
                    "Category": row.category,
                    "Subcategory": row.subcategory,
                    "Document Number": row.documentnumber,
                    "Field Name": row.fieldname,
                    "Line": row.line,
                    "Error Value": row.errorvalue,
                    "Correct Value": row.correctvalue,
                    "Client Error": row.clienterror,
                    "Client Amount": row.clientamount,
                    "per (%)": row.percentage,
                    "Amount": row.amount,
                    "History": overallHistory,
                    "Month History": monthHistory,
                    "Request Reason": row.requestreason,
                    "Forward Reason": row.forwardreason,
                };
            });
        }

        // Create a new workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Table Data");

        // Add column headers
        worksheet.columns = [
            { header: "SNo", key: "SNo", width: 10 },
            { header: "Level", key: "Level", width: 15 },
            { header: "Vendor Name", key: "Vendor Name", width: 20 },
            { header: "Branch", key: "Branch", width: 15 },
            { header: "Employee Code", key: "Employee Code", width: 20 },
            { header: "Employee Name", key: "Employee Name", width: 25 },
            { header: "Login id", key: "Login id", width: 20 },
            { header: "Date", key: "Date", width: 15 },
            { header: "Category", key: "Category", width: 20 },
            { header: "Subcategory", key: "Subcategory", width: 20 },
            { header: "Document Number", key: "Document Number", width: 20 },
            { header: "Field Name", key: "Field Name", width: 15 },
            { header: "Line", key: "Line", width: 10 },
            { header: "Error Value", key: "Error Value", width: 20 },
            { header: "Correct Value", key: "Correct Value", width: 20 },
            { header: "Client Error", key: "Client Error", width: 20 },
            { header: "Client Amount", key: "Client Amount", width: 15 },
            { header: "per (%)", key: "per (%)", width: 10 },
            { header: "Amount", key: "Amount", width: 15 },
            { header: "History", key: "History", width: 40 },
            { header: "Month History", key: "Month History", width: 40 },
            { header: "Request Reason", key: "Request Reason", width: 30 },
            { header: "Forward Reason", key: "Forward Reason", width: 30 },
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
        saveAs(new Blob([buffer]), `Approved Employee Client Error Waiver Request List.${fileExtension}`);
        setIsFilterOpen(false);
    };

    const handleExportXLtwo = async (isfilter) => {
        let formattedData = [];
        let resultdata = (filteredChangestwo !== null ? filteredRowDatatwo : rowDataTabletwo) ?? [];

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
                    `Total Error: ${row.monthtotalerror || ""}`,
                    `Total Waiver: ${row.monthtotalwaiver || ""}`,
                    `Total Waiver Amount: ${row.monthtotalwaiveramount || ""}`,
                ].join("\n");

                return {
                    "SNo": index + 1,
                    "Level": row.level,
                    "Vendor Name": row.vendor,
                    "Branch": row.branch,
                    "Employee Code": row.employeeid,
                    "Employee Name": row.employeename,
                    "Login id": row.loginid,
                    "Date": row.date,
                    "Category": row.category,
                    "Subcategory": row.subcategory,
                    "Document Number": row.documentnumber,
                    "Field Name": row.fieldname,
                    "Line": row.line,
                    "Error Value": row.errorvalue,
                    "Correct Value": row.correctvalue,
                    "Client Error": row.clienterror,
                    "Client Amount": row.clientamount,
                    "per (%)": row.percentage,
                    "Amount": row.amount,
                    "History": overallHistory,
                    "Month History": monthHistory,
                    "Request Reason": row.requestreason,
                    "Forward Reason": row.forwardreason,
                };
            });
        } else if (isfilter === "overall") {
            formattedData = clientErrorstwo.map((row, index) => {
                // Add `overallhistory` data as separate lines
                const overallHistory = [
                    `Total Apply: ${row.totalapply || ""}`,
                    `Total Approved: ${row.totalapproved || ""}`,
                    `Total Reject: ${row.totalreject || ""}`,
                    `Total Amount: ${row.totalamount || ""}`,
                    `Total Waiver: ${row.totalwaiver || ""}`
                ].join("\n");

                // Add `monthhistory` data as separate lines
                const monthHistory = [
                    `Apply Number: ${row.applynumber || ""}`,
                    `Total Approved: ${row.monthtotalapproved || ""}`,
                    `Total Reject: ${row.monthtotalreject || ""}`,
                    `Total Error: ${row.monthtotalerror || ""}`,
                    `Total Waiver: ${row.monthtotalwaiver || ""}`,
                    `Total Waiver Amount: ${row.monthtotalwaiveramount || ""}`
                ].join("\n");

                return {
                    "SNo": index + 1,
                    "Level": row.level,
                    "Vendor Name": row.vendor,
                    "Branch": row.branch,
                    "Employee Code": row.employeeid,
                    "Employee Name": row.employeename,
                    "Login id": row.loginid,
                    "Date": row.date,
                    "Category": row.category,
                    "Subcategory": row.subcategory,
                    "Document Number": row.documentnumber,
                    "Field Name": row.fieldname,
                    "Line": row.line,
                    "Error Value": row.errorvalue,
                    "Correct Value": row.correctvalue,
                    "Client Error": row.clienterror,
                    "Client Amount": row.clientamount,
                    "per (%)": row.percentage,
                    "Amount": row.amount,
                    "History": overallHistory,
                    "Month History": monthHistory,
                    "Request Reason": row.requestreason,
                    "Forward Reason": row.forwardreason,
                };
            });
        }

        // Create a new workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Table Data");

        // Add column headers
        worksheet.columns = [
            { header: "SNo", key: "SNo", width: 10 },
            { header: "Level", key: "Level", width: 15 },
            { header: "Vendor Name", key: "Vendor Name", width: 20 },
            { header: "Branch", key: "Branch", width: 15 },
            { header: "Employee Code", key: "Employee Code", width: 20 },
            { header: "Employee Name", key: "Employee Name", width: 25 },
            { header: "Login id", key: "Login id", width: 20 },
            { header: "Date", key: "Date", width: 15 },
            { header: "Category", key: "Category", width: 20 },
            { header: "Subcategory", key: "Subcategory", width: 20 },
            { header: "Document Number", key: "Document Number", width: 20 },
            { header: "Field Name", key: "Field Name", width: 15 },
            { header: "Line", key: "Line", width: 10 },
            { header: "Error Value", key: "Error Value", width: 20 },
            { header: "Correct Value", key: "Correct Value", width: 20 },
            { header: "Client Error", key: "Client Error", width: 20 },
            { header: "Client Amount", key: "Client Amount", width: 15 },
            { header: "per (%)", key: "per (%)", width: 10 },
            { header: "Amount", key: "Amount", width: 15 },
            { header: "History", key: "History", width: 40 },
            { header: "Month History", key: "Month History", width: 40 },
            { header: "Request Reason", key: "Request Reason", width: 30 },
            { header: "Forward Reason", key: "Forward Reason", width: 30 },
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
        saveAs(new Blob([buffer]), `Reject Employee Client Error Waiver Request List.${fileExtension}`);
        setIsPdfFilterOpentwo(false);
    };

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Approved Employee Client Error Waiver Request List",
        pageStyle: "print",
    });

    //print...
    const componentReftwo = useRef();
    const handleprinttwo = useReactToPrint({
        content: () => componentReftwo.current,
        documentTitle: "Reject Employee Client Error Waiver Request List",
        pageStyle: "print",
    });

    // pdf
    const downloadPdf = (isfilter) => {
        const doc = new jsPDF({ orientation: 'landscape' });

        // Define the table headers
        const headers = ['SNo', 'Level', 'Vendor Name', 'Branch Name', 'Employee Code', 'Employee Name', 'Login id', 'Date', 'Category', 'SubCategory', 'Document Number', 'Field Name',
            'Line', 'Error Value', 'Correct Value', 'Client Error', 'Client Amount', 'per%', 'Amount', 'History', 'Month History', 'Request Reason', 'Forward Reason'];

        let data = [];
        let resultdata = (filteredChanges !== null ? filteredRowData : rowDataTable) ?? [];


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
                    `Total Error: ${row.monthtotalerror || ""}`,
                    `Total Waiver: ${row.monthtotalwaiver || ""}`,
                    `Total Waiver Amount: ${row.monthtotalwaiveramount || ""}`,
                ].join("\n");

                return [
                    index + 1,
                    row.level,
                    row.vendor,
                    row.branch,
                    row.employeeid,
                    row.employeename,
                    row.loginid,
                    row.date,
                    row.category,
                    row.subcategory,
                    row.documentnumber,
                    row.fieldname,
                    row.line,
                    row.errorvalue,
                    row.correctvalue,
                    row.clienterror,
                    row.clientamount,
                    row.percentage,
                    row.amount,
                    overallHistory,
                    monthHistory,
                    row.requestreason,
                    row.forwardreason,
                ];
            });
        } else if (isfilter === "overall") {
            data = clientErrors.map((row, index) => {
                // Add `overallhistory` data as separate lines
                const overallHistory = [
                    `Total Apply: ${row.totalapply || ""}`,
                    `Total Approved: ${row.totalapproved || ""}`,
                    `Total Reject: ${row.totalreject || ""}`,
                    `Total Amount: ${row.totalamount || ""}`,
                    `Total Waiver: ${row.totalwaiver || ""}`
                ].join("\n");

                // Add `monthhistory` data as separate lines
                const monthHistory = [
                    `Apply Number: ${row.applynumber || ""}`,
                    `Total Approved: ${row.monthtotalapproved || ""}`,
                    `Total Reject: ${row.monthtotalreject || ""}`,
                    `Total Error: ${row.monthtotalerror || ""}`,
                    `Total Waiver: ${row.monthtotalwaiver || ""}`,
                    `Total Waiver Amount: ${row.monthtotalwaiveramount || ""}`
                ].join("\n");

                return [
                    index + 1,
                    row.level,
                    row.vendor,
                    row.branch,
                    row.employeeid,
                    row.employeename,
                    row.loginid,
                    row.date,
                    row.category,
                    row.subcategory,
                    row.documentnumber,
                    row.fieldname,
                    row.line,
                    row.errorvalue,
                    row.correctvalue,
                    row.clienterror,
                    row.clientamount,
                    row.percentage,
                    row.amount,
                    overallHistory,
                    monthHistory,
                    row.requestreason,
                    row.forwardreason,
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

        doc.save("Approved Employee Client Error Waiver Request List.pdf");
    };

    // pdf
    const downloadPdftwo = (isfilter) => {
        const doc = new jsPDF({ orientation: 'landscape' });

        // Define the table headers
        const headers = ['SNo', 'Level', 'Vendor Name', 'Branch Name', 'Employee Code', 'Employee Name', 'Login id', 'Date', 'Category', 'SubCategory', 'Document Number', 'Field Name',
            'Line', 'Error Value', 'Correct Value', 'Client Error', 'Client Amount', 'per%', 'Amount', 'History', 'Month History', 'Request Reason', 'Forward Reason'];

        let data = [];
        let resultdata = (filteredChangestwo !== null ? filteredRowDatatwo : rowDataTabletwo) ?? [];


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
                    `Total Error: ${row.monthtotalerror || ""}`,
                    `Total Waiver: ${row.monthtotalwaiver || ""}`,
                    `Total Waiver Amount: ${row.monthtotalwaiveramount || ""}`,
                ].join("\n");

                return [
                    index + 1,
                    row.level,
                    row.vendor,
                    row.branch,
                    row.employeeid,
                    row.employeename,
                    row.loginid,
                    row.date,
                    row.category,
                    row.subcategory,
                    row.documentnumber,
                    row.fieldname,
                    row.line,
                    row.errorvalue,
                    row.correctvalue,
                    row.clienterror,
                    row.clientamount,
                    row.percentage,
                    row.amount,
                    overallHistory,
                    monthHistory,
                    row.requestreason,
                    row.forwardreason,
                ];
            });
        } else if (isfilter === "overall") {
            data = clientErrorstwo.map((row, index) => {
                // Add `overallhistory` data as separate lines
                const overallHistory = [
                    `Total Apply: ${row.totalapply || ""}`,
                    `Total Approved: ${row.totalapproved || ""}`,
                    `Total Reject: ${row.totalreject || ""}`,
                    `Total Amount: ${row.totalamount || ""}`,
                    `Total Waiver: ${row.totalwaiver || ""}`
                ].join("\n");

                // Add `monthhistory` data as separate lines
                const monthHistory = [
                    `Apply Number: ${row.applynumber || ""}`,
                    `Total Approved: ${row.monthtotalapproved || ""}`,
                    `Total Reject: ${row.monthtotalreject || ""}`,
                    `Total Error: ${row.monthtotalerror || ""}`,
                    `Total Waiver: ${row.monthtotalwaiver || ""}`,
                    `Total Waiver Amount: ${row.monthtotalwaiveramount || ""}`
                ].join("\n");

                return [
                    index + 1,
                    row.level,
                    row.vendor,
                    row.branch,
                    row.employeeid,
                    row.employeename,
                    row.loginid,
                    row.date,
                    row.category,
                    row.subcategory,
                    row.documentnumber,
                    row.fieldname,
                    row.line,
                    row.errorvalue,
                    row.correctvalue,
                    row.clienterror,
                    row.clientamount,
                    row.percentage,
                    row.amount,
                    overallHistory,
                    monthHistory,
                    row.requestreason,
                    row.forwardreason,
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

        doc.save("Reject Employee Client Error Waiver Request List.pdf");
    };

    //image
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Approved Employee Client Error Waiver Request List.png");
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
                    saveAs(blob, "Reject Employee Client Error Waiver Request List.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    return (
        <Box>
            <Headtitle title={"Client Error Waiver Approval"} />
            <PageHeading
                title="Client Error Waiver Approval"
                modulename="Quality"
                submodulename="Penalty"
                mainpagename="Penalty Waiver"
                subpagename="Client Error Waiver Approval"
                subsubpagename=""
            />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lclienterrorwaiverapproval") && (
                <>
                    <Box sx={userStyle.dialogbox}>
                        <Grid container spacing={2}>
                            <Grid item xs={8}>
                                <Typography sx={userStyle.importheadtext}>Client Error Waiver Approval</Typography>
                            </Grid>
                        </Grid><br />
                        <Grid container spacing={2}>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Table Mode<b style={{ color: "red" }}>*</b></Typography>
                                    <MultiSelect
                                        options={tableOptions}
                                        value={selectedTable}
                                        onChange={(e) => {
                                            handleTableChange(e);
                                        }}
                                        valueRenderer={customValueRendererCompany}
                                        labelledBy="Please Select Table Mode"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography>Mode</Typography>
                                    <Selects
                                        options={modeDropDowns}
                                        styles={colourStyles}
                                        value={{ label: modeselection.label, value: modeselection.value, }}
                                        onChange={(e) => { setModeSelection(e); }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography>Level Mode</Typography>
                                    <Selects
                                        options={sectorDropDowns}
                                        styles={colourStyles}
                                        value={{ label: sectorSelection.label, value: sectorSelection.value, }}
                                        onChange={(e) => { setSectorSelection(e); }}
                                    />
                                </FormControl>
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
                            <Grid item md={1} sm={6} xs={6} marginTop={3}>
                                <LoadingButton
                                    onClick={handleSubmit}
                                    loading={loadingdeloverall}
                                    sx={buttonStyles.buttonsubmit}
                                    loadingPosition="end"
                                    variant="contained"
                                >
                                    Filter
                                </LoadingButton>
                            </Grid>
                            <Grid item lg={1} md={2} sm={2} xs={6}>
                                <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0, } })}>
                                    <Button sx={buttonStyles.btncancel} onClick={handleClear} > Clear </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box><br />
                    {loader && (
                        <Box sx={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 9999,
                        }}>
                            <CircularProgress size="3rem" />
                        </Box>
                    )}
                    {tableCheck?.includes('Approved Employee Client Error Waiver Request List') ?
                        <>
                            <Box sx={userStyle.container}>
                                {/* ******************************************************EXPORT Buttons****************************************************** */}
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext}>Approved Employee Client Error Waiver Request List</Typography>
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
                                            {isUserRoleCompare?.includes("excelclienterrorwaiverapproval") && (
                                                <>
                                                    <Button onClick={(e) => { setIsFilterOpen(true); setFormat("xl"); }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("csvclienterrorwaiverapproval") && (
                                                <>
                                                    <Button
                                                        onClick={(e) => { setIsFilterOpen(true); setFormat("csv"); }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("printclienterrorwaiverapproval") && (
                                                <>
                                                    <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("pdfclienterrorwaiverapproval") && (
                                                <>
                                                    <Button sx={userStyle.buttongrp} onClick={() => { setIsPdfFilterOpen(true); }}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("imageclienterrorwaiverapproval") && (
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
                                            itemsList={clientErrors}
                                            pagenamecheck={'Client Error Waiver Approval'}
                                        />
                                    </>
                                )}
                            </Box><br />
                        </> : null}
                    {/* Second Tabale  */}
                    {tableCheck?.includes('Reject Employee Client Error Waiver Request List') ?
                        <>
                            <Box sx={userStyle.container}>
                                {/* ******************************************************EXPORT Buttons****************************************************** */}
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext}>Reject Employee Client Error Waiver Request List</Typography>
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
                                                <MenuItem value={clientErrorstwo?.length}>All</MenuItem>
                                            </Select>
                                        </Box>
                                    </Grid>
                                    <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center", }}>
                                        <Box>
                                            {isUserRoleCompare?.includes("excelclienterrorwaiverapproval") && (
                                                <>
                                                    <Button onClick={(e) => { setIsFilterOpentwo(true); setFormat("xl"); }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("csvclienterrorwaiverapproval") && (
                                                <>
                                                    <Button onClick={(e) => { setIsFilterOpentwo(true); setFormat("csv"); }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("printclienterrorwaiverapproval") && (
                                                <>
                                                    <Button sx={userStyle.buttongrp} onClick={handleprinttwo} >&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("pdfclienterrorwaiverapproval") && (
                                                <>
                                                    <Button sx={userStyle.buttongrp} onClick={() => { setIsPdfFilterOpentwo(true); }}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("imageclienterrorwaiverapproval") && (
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
                                                maindatas={clientErrorstwo}
                                                setSearchedString={setSearchedStringtwo}
                                                searchQuery={searchQuerytwo}
                                                setSearchQuery={setSearchQuerytwo}
                                                paginated={false}
                                                totalDatas={clientErrorstwo}
                                            />
                                        </Box>
                                    </Grid>
                                </Grid><br />
                                <Button sx={userStyle.buttongrp} onClick={handleShowAllColumnstwo}>Show All Columns</Button>&ensp;
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
                                            selectedRows={selectedRowstwo}
                                            setSelectedRows={setSelectedRowstwo}
                                            gridRefTable={gridRefTabletwo}
                                            paginated={false}
                                            filteredDatas={filteredDatastwo}
                                            // totalDatas={totalDatas}
                                            searchQuery={searchedStringtwo}
                                            handleShowAllColumns={handleShowAllColumnstwo}
                                            setFilteredRowData={setFilteredRowDatatwo}
                                            filteredRowData={filteredRowDatatwo}
                                            setFilteredChanges={setFilteredChangestwo}
                                            filteredChanges={filteredChangestwo}
                                            gridRefTableImg={gridRefTableImgtwo}
                                            itemsList={clientErrorstwo}
                                            pagenamecheck={'Client Error Waiver Approval'}
                                        />
                                    </>
                                )}
                            </Box><br />
                        </> : null}
                    <ResentEmployeeClient clientErrorsThree={clientErrorsThree} clientErrorsFour={clientErrorsFour} fetchAllClient={fetchAllClient} loader={loader} tableCheck={tableCheck}
                        setFilteredRowDataThree={setFilteredRowDataThree} filteredChangesThree={filteredChangesThree} setFilteredChangesThree={setFilteredChangesThree} filteredRowDataThree={filteredRowDataThree} setIsHandleChangeThree={setIsHandleChangeThree} isHandleChangeThree={isHandleChangeThree} setSearchedStringThree={setSearchedStringThree} searchedStringThree={searchedStringThree}
                        setFilteredRowDataFour={setFilteredRowDataFour} filteredChangesFour={filteredChangesFour} setFilteredChangesFour={setFilteredChangesFour} filteredRowDataFour={filteredRowDataFour} setIsHandleChangeFour={setIsHandleChangeFour} isHandleChangeFour={isHandleChangeFour} setSearchedStringFour={setSearchedStringFour} searchedStringFour={searchedStringFour}
                    /><br />
                    <WaitRecheckEmployeeClient clientErrorsFive={clientErrorsFive} fetchAllClient={fetchAllClient} loader={loader} tableCheck={tableCheck}
                        setFilteredRowDataFive={setFilteredRowDataFive} filteredChangesFive={filteredChangesFive} setFilteredChangesFive={setFilteredChangesFive} filteredRowDataFive={filteredRowDataFive} setIsHandleChangeFive={setIsHandleChangeFive} isHandleChangeFive={isHandleChangeFive} setSearchedStringFive={setSearchedStringFive} searchedStringFive={searchedStringFive}
                    />
                </>
            )}

            {/* Manage Column */}
            <Popover
                id={id}
                open={isManageColumnsOpen}
                anchorEl={anchorEl}
                onClose={handleCloseManageColumns}
                anchorOrigin={{ vertical: "bottom", horizontal: "left", }}>
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
                anchorOrigin={{ vertical: "bottom", horizontal: "left", }}>
                <ManageColumnsContent
                    handleClose={handleCloseManageColumnstwo}
                    searchQuery={searchQueryManagetwo}
                    setSearchQuery={setSearchQueryManagetwo}
                    filteredColumns={filteredColumnstwo}
                    columnVisibility={initialColumnVisibilitytwo}
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
            {/* print layout */}
            <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRef}>
                    <TableHead>
                        <TableRow>
                            <TableCell>SNo</TableCell>
                            <TableCell>Level</TableCell>
                            <TableCell>Vendor Name</TableCell>
                            <TableCell>Branch Name</TableCell>
                            <TableCell>Employee Code</TableCell>
                            <TableCell>Employee Name</TableCell>
                            <TableCell>Login id</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Subcategory</TableCell>
                            <TableCell>Document Number</TableCell>
                            <TableCell>Field Name</TableCell>
                            <TableCell>Line</TableCell>
                            <TableCell>Error Value</TableCell>
                            <TableCell>Correct Value</TableCell>
                            <TableCell>Client Error</TableCell>
                            <TableCell>Client Amount</TableCell>
                            <TableCell>per %</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>History</TableCell>
                            <TableCell>Month History</TableCell>
                            <TableCell>Request Reason</TableCell>
                            <TableCell>Forward Reason</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody align="left">
                        {rowDataTable &&
                            rowDataTable.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{row.level}</TableCell>
                                    <TableCell>{row.vendor}</TableCell>
                                    <TableCell>{row.branch}</TableCell>
                                    <TableCell>{row.employeeid}</TableCell>
                                    <TableCell>{row.employeename}</TableCell>
                                    <TableCell>{row.loginid}</TableCell>
                                    <TableCell>{row.date}</TableCell>
                                    <TableCell>{row.category}</TableCell>
                                    <TableCell>{row.subcategory}</TableCell>
                                    <TableCell>{row.documentnumber}</TableCell>
                                    <TableCell>{row.fieldname}</TableCell>
                                    <TableCell>{row.line}</TableCell>
                                    <TableCell>{row.errorvalue}</TableCell>
                                    <TableCell>{row.correctvalue}</TableCell>
                                    <TableCell>{row.clienterror}</TableCell>
                                    <TableCell>{row.clientamount}</TableCell>
                                    <TableCell>{row.percentage}</TableCell>
                                    <TableCell>{row.amount}</TableCell>
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
                                            <Typography>Total Error: {row.monthtotalerror}</Typography>
                                            <Typography>Total Waiver: {row.monthtotalwaiver}</Typography>
                                            <Typography>Total Waiver Amount: {row.monthtotalwaiveramount}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>{row.requestreason}</TableCell>
                                    <TableCell>{row.forwardreason}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentReftwo}>
                    <TableHead>
                        <TableRow>
                            <TableCell>SNo</TableCell>
                            <TableCell>Level</TableCell>
                            <TableCell>Vendor Name</TableCell>
                            <TableCell>Branch Name</TableCell>
                            <TableCell>Employee Code</TableCell>
                            <TableCell>Employee Name</TableCell>
                            <TableCell>Login id</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Subcategory</TableCell>
                            <TableCell>Document Number</TableCell>
                            <TableCell>Field Name</TableCell>
                            <TableCell>Line</TableCell>
                            <TableCell>Error Value</TableCell>
                            <TableCell>Correct Value</TableCell>
                            <TableCell>Client Error</TableCell>
                            <TableCell>Client Amount</TableCell>
                            <TableCell>per %</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>History</TableCell>
                            <TableCell>Month History</TableCell>
                            <TableCell>Request Reason</TableCell>
                            <TableCell>Forward Reason</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody align="left">
                        {rowDataTabletwo &&
                            rowDataTabletwo.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{row.level}</TableCell>
                                    <TableCell>{row.vendor}</TableCell>
                                    <TableCell>{row.branch}</TableCell>
                                    <TableCell>{row.employeeid}</TableCell>
                                    <TableCell>{row.employeename}</TableCell>
                                    <TableCell>{row.loginid}</TableCell>
                                    <TableCell>{row.date}</TableCell>
                                    <TableCell>{row.category}</TableCell>
                                    <TableCell>{row.subcategory}</TableCell>
                                    <TableCell>{row.documentnumber}</TableCell>
                                    <TableCell>{row.fieldname}</TableCell>
                                    <TableCell>{row.line}</TableCell>
                                    <TableCell>{row.errorvalue}</TableCell>
                                    <TableCell>{row.correctvalue}</TableCell>
                                    <TableCell>{row.clienterror}</TableCell>
                                    <TableCell>{row.clientamount}</TableCell>
                                    <TableCell>{row.percentage}</TableCell>
                                    <TableCell>{row.amount}</TableCell>
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
                                            <Typography>Total Error: {row.monthtotalerror}</Typography>
                                            <Typography>Total Waiver: {row.monthtotalwaiver}</Typography>
                                            <Typography>Total Waiver Amount: {row.monthtotalwaiveramount}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>{row.requestreason}</TableCell>
                                    <TableCell>{row.forwardreason}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* EXTERNAL COMPONENTS -------------- END */}
            <Dialog open={isFilterOpen} onClose={handleCloseFilterMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>

                    <IconButton
                        aria-label="close"
                        onClick={handleCloseFilterMod}
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
                            handleExportXL("filtered")
                        }}
                    >
                        Export Filtered Data
                    </Button>
                    <Button autoFocus variant="contained"
                        onClick={(e) => {
                            handleExportXL("overall")
                        }}
                    >
                        Export Over All Data
                    </Button>
                </DialogActions>
            </Dialog>
            {/*Export pdf Data  */}
            <Dialog open={isPdfFilterOpen} onClose={handleClosePdfFilterMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>
                    <IconButton
                        aria-label="close"
                        onClick={handleClosePdfFilterMod}
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
                            downloadPdf("filtered")
                            setIsPdfFilterOpen(false);
                        }}
                    >
                        Export Filtered Data
                    </Button>
                    <Button variant="contained"
                        onClick={(e) => {
                            downloadPdf("overall")
                            setIsPdfFilterOpen(false);
                        }}
                    >
                        Export Over All Data
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={isFilterOpentwo} onClose={handleCloseFilterModtwo} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>

                    <IconButton
                        aria-label="close"
                        onClick={handleCloseFilterModtwo}
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
                            handleExportXLtwo("filtered")
                        }}
                    >
                        Export Filtered Data
                    </Button>
                    <Button autoFocus variant="contained"
                        onClick={(e) => {
                            handleExportXLtwo("overall")
                        }}
                    >
                        Export Over All Data
                    </Button>
                </DialogActions>
            </Dialog>
            {/*Export pdf Data  */}
            <Dialog open={isPdfFilterOpentwo} onClose={handleClosePdfFilterModtwo} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>
                    <IconButton
                        aria-label="close"
                        onClick={handleClosePdfFilterModtwo}
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
                            downloadPdftwo("filtered")
                            setIsPdfFilterOpentwo(false);
                        }}
                    >
                        Export Filtered Data
                    </Button>
                    <Button variant="contained"
                        onClick={(e) => {
                            downloadPdftwo("overall")
                            setIsPdfFilterOpentwo(false);
                        }}
                    >
                        Export Over All Data
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default ClientErrorWaiverApproval;