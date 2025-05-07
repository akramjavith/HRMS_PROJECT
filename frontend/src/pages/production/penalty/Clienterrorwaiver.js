import React, { useContext, useEffect, useRef, useState } from "react";
import { Box, Button, FormControl, Grid, MenuItem, OutlinedInput, Popover, Select, Typography, Dialog, DialogContent, DialogActions, IconButton, } from "@mui/material";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CloseIcon from "@mui/icons-material/Close";
import jsPDF from "jspdf";
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
import AggridTable from "../../../components/AggridTable";
import domtoimage from 'dom-to-image';
import ManageColumnsContent from "../../../components/ManageColumn";
import moment from "moment";
import TextareaAutosize from "@mui/material/TextareaAutosize";

const ScrollingText = ({ text }) => {
    const containerRef = useRef(null);
    const textRef = useRef(null);

    useEffect(() => {
        const containerWidth = containerRef.current.offsetWidth;
        const textElement = textRef.current;

        if (!textElement) return; // Add a null check here

        const textWidth = textElement.offsetWidth;
        let position = 0;

        const scrollText = () => {
            position -= 1;
            if (position < -textWidth) {
                position = containerWidth;
            }
            textElement.style.transform = `translateX(${position}px)`;
            requestAnimationFrame(scrollText);
        };

        scrollText();

        return () => cancelAnimationFrame(scrollText);
    }, []);

    return (
        <Grid item xs={8} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", }}>
            <Typography sx={userStyle.importheadtext}>{"Current Client Error List"}</Typography>
            <div ref={containerRef} style={{ overflow: "hidden", width: "50%", whiteSpace: "nowrap" }}>
                <span ref={textRef} style={{ color: "red", display: "inline-block" }}>{text}</span>
            </div>
        </Grid>
    );
};

const ActionCell = ({ rowId, currentRejectReason, onSave, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert, setPopupContent, setPopupSeverity, handleClickOpenPopup, auth, filteredErrorData, rowData, isUserRoleAccess }) => {
    const [localRejectReason, setLocalRejectReason] = useState('');

    const today = new Date();
    const date = today.toISOString().split('T')[0];
    const time = today.toTimeString().split(' ')[0].slice(0, 5);

    const handleSaveClick = async () => {
        onSave(localRejectReason);
        if (localRejectReason === '') {
            setPopupContentMalert("Please Enter Reason");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else {
            try {
                const [day, month, year] = rowData.date?.split('/');
                const rowformattedDate = `${year}-${month}-${day}`;

                const uniqueEntriesProcess = {};
                isUserRoleAccess.processlog?.forEach(entry => {
                    const entryDate = new Date(entry.date); // Parse the startdate into a date object
                    const key = entry.date;
                    if (!(key in uniqueEntriesProcess)) {
                        uniqueEntriesProcess[key] = entry;
                    }
                });

                const uniqueProcessLog = Object.values(uniqueEntriesProcess);

                // Find the relevant log entry for the given date     
                const relevantProcessLogEntry = uniqueProcessLog
                    .filter(log => log.date <= rowformattedDate)
                    .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

                let res_vendor = await axios.post(SERVICE.PENALTYWAIVERMASTER_FOR_CLIENTERROR_RESTRICTIONS, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    fromdate: rowformattedDate,
                    todate: rowformattedDate,
                    department: rowData.department,
                    employeename: rowData.employeename,
                    company: rowData.company,
                    branch: rowData.branch,
                    process: (relevantProcessLogEntry && relevantProcessLogEntry.process),
                });

                let result = res_vendor?.data?.penaltywaivermasters;

                // console.log(result.length, 'result')
                if (result?.length === 0) {
                    setPopupContentMalert(`This date range does not have any data matches. Kindly contact the administrator to confirm the 'Penalty Waiver'.`);
                    setPopupSeverityMalert("warning");
                    handleClickOpenPopupMalert();
                } else {

                    let aggregatedData = [];
                    let finalData = [];

                    for (const dep of result || []) {

                        let res_clientError = await axios.post(SERVICE.CLIENTERRORMONTHAMOUNT_WAIVER, {
                            fromdate: dep.fromdate,
                            todate: dep.todate,
                            companyname: isUserRoleAccess.companyname,
                        },
                            {
                                headers: {
                                    Authorization: `Bearer ${auth.APIToken}`,
                                },
                            }
                        );
                        // console.log(res_clientError?.data?.finalData, 'res_clientError?.data?.finalData')

                        finalData = res_clientError?.data?.finalData || [];

                        // get only apply data not includes approved in history
                        const calculateClientAmount = (employeeid) => {
                            const filteredData = res_clientError?.data?.finalData?.filter((item) => {
                                if (item.employeeid === employeeid && item.history?.length > 0) {
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

                        const calculateCount = (employeeid) => {
                            const filteredData = res_clientError?.data?.finalData?.filter((item) => {
                                return item.employeeid === employeeid && item.history?.length > 0;
                            }) || [];

                            return filteredData.length;
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
                        // const remainingAmount = data.clienterroramount - (totalAmount !== 0 ? totalAmount : rowData.clientamount);

                        // const totalCount = data.count + data.totalappliedcount;
                        // const remainingCount = data.clienterrocountupto - totalCount;
                        // console.log(data.totalappliedcount, 'data.totalappliedcount')
                        // const totalCount = data.totalappliedcount + [rowData].length;
                        const totalCount = data.totalappliedcount;

                        // console.log(totalCount, 'totalCount')
                        // const totalCount = data.totalappliedcount;
                        const remainingCount = data.clienterrocountupto - totalCount;

                        // const remainingCount = data.clienterrocountupto - (totalCount !== 0 ? totalCount : [rowData].length);

                        // console.log(totalCount !== 0 ? totalCount : [rowData].length, 'len')
                        // console.log(data.clienterrocountupto - (totalCount !== 0 ? totalCount : [rowData].length), 'rowdatacount')
                        // console.log(data.clienterrocountupto - totalCount, 'sec')

                        // console.log(totalAmount, totalCount, 'totalAppliedAmount')
                        // console.log(remainingAmount, remainingCount, 'remainingAmount')
                        // console.log(totalCount, remainingCount, totalCount > remainingCount)
                        // console.log(rowData.clientamount, remainingAmount, rowData.clientamount > remainingAmount)
                        // console.log(remainingCount, 'remainingCount')

                        if (totalCount === data.clienterrocountupto) {
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
                        else if ((totalCount > data.clienterrocountupto && totalAmount <= data.clienterroramount)) {
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
                        // else if (data.percentage > data.clienterrorpercentage &&
                        //     totalAmount <= data.clienterroramount &&
                        //     totalCount <= data.clienterrocountupto) {
                        //     setPopupContentMalert("Waiver percentage is reached, you cannot apply.");
                        //     setPopupSeverityMalert("warning");
                        //     handleClickOpenPopupMalert();
                        //     return;
                        // }
                        else {
                            // console.log(rowId, 'rowId')
                            let res = await axios.put(`${SERVICE.PENALTYCLIENTERROR_SINGLE}/${rowId}`, {
                                headers: {
                                    Authorization: `Bearer ${auth.APIToken}`,
                                },
                                history: [
                                    {
                                        tablename: 'Client Error Waiver_Current Table',
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
                            // const totalCount = data.count + data.totalappliedcount;
                            // const totalCount = data.totalappliedcount;
                            const totalCount = data.totalappliedcount + [rowData].length;
                            const remainingCount = data.clienterrocountupto - totalCount;

                            // Calculate remaining values
                            // const remainingAmount = data.clienterroramount - totalAmount;
                            const remainingAmount = data.clienterroramount - (totalAmount !== 0 ? totalAmount : rowData.clientamount);

                            // const remainingCount = data.clienterrocountupto - (totalCount !== 0 ? totalCount : [rowData].length);
                            // console.log(remainingCount, 'remainingCount')

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
                <Button sx={{ textTransform: 'capitalize' }} variant="contained" color="error" size="small" onClick={handleSaveClick}>Apply</Button>
            </Grid>
        </Grid>
    );
};

const RecheckReasonCell = ({ rowId, currentRecheckReason, onSave, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert, setPopupContent, setPopupSeverity, handleClickOpenPopup, auth, filteredErrorData, rowData }) => {
    const [localRecheckReason, setLocalRecheckReason] = useState('');

    const today = new Date();
    const date = today.toISOString().split('T')[0];
    const time = today.toTimeString().split(' ')[0].slice(0, 5);

    const handleSaveClick = async () => {
        onSave(localRecheckReason);
        if (localRecheckReason === '') {
            setPopupContentMalert("Please Enter Reason");
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
                            tablename: 'Client Error Waiver_Recheck',
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
                <Button sx={{ textTransform: 'capitalize' }} variant="contained" color="error" size="small" onClick={handleSaveClick}>Apply</Button>
            </Grid>
        </Grid>
    );
};

function ClientErrorWaiver() {

    let cellStyles = {
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        lineHeight: 'normal',
        // fontSize: "12px"
    }

    const gridRefTable = useRef(null);
    const gridRefTableTwo = useRef(null);
    const gridRefTableImg = useRef(null);
    const gridRefTableImgTwo = useRef(null);

    const { auth } = useContext(AuthContext);
    const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);

    const [filterUser, setFilterUser] = useState({ fromdate: "", todate: "", });
    const [clientErrors, setClientErrors] = useState([]);
    const [clientErrorsTwo, setClientErrorsTwo] = useState([]);
    const [items, setItems] = useState([]);
    const [itemsTwo, setItemsTwo] = useState([]);
    const [loader, setLoader] = useState(false);
    const [loadingdeloverall, setloadingdeloverall] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedRowsTwo, setSelectedRowsTwo] = useState([]);
    const [rejectReasons, setRejectReasons] = useState({});
    const [recheckReasons, setRecheckReasons] = useState({});

    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
    const [isHandleChange, setIsHandleChange] = useState(false);
    const [searchedString, setSearchedString] = useState("");

    const [filteredRowDataTwo, setFilteredRowDataTwo] = useState([]);
    const [filteredChangesTwo, setFilteredChangesTwo] = useState(null);
    const [isHandleChangeTwo, setIsHandleChangeTwo] = useState(false);
    const [searchedStringTwo, setSearchedStringTwo] = useState("");

    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");

    //Datatable second Table
    const [pageTwo, setPageTwo] = useState(1);
    const [pageSizeTwo, setPageSizeTwo] = useState(10);
    const [searchQueryTwo, setSearchQueryTwo] = useState("");

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
    const [isFilterOpenTwo, setIsFilterOpenTwo] = useState(false);
    const [isPdfFilterOpenTwo, setIsPdfFilterOpenTwo] = useState(false);
    // page refersh reload
    const handleCloseFilterModTwo = () => { setIsFilterOpenTwo(false); };
    const handleClosePdfFilterModTwo = () => { setIsPdfFilterOpenTwo(false); };

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
    const [searchQueryManageTwo, setSearchQueryManageTwo] = useState("");
    const [isManageColumnsOpenTwo, setManageColumnsOpenTwo] = useState(false);
    const [anchorElTwo, setAnchorElTwo] = useState(null);

    const handleOpenManageColumnsTwo = (event) => {
        setAnchorElTwo(event.currentTarget);
        setManageColumnsOpenTwo(true);
    };
    const handleCloseManageColumnsTwo = () => {
        setManageColumnsOpenTwo(false);
        setSearchQueryManageTwo("");
    };

    const openTwo = Boolean(anchorElTwo);
    const idTwo = openTwo ? "simple-popover" : undefined;

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
        reason: true,
        actions: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

    // Show All Columns & Manage Columns second Table
    const initialColumnVisibilityTwo = {
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
        clientamount: true,
        percentage: true,
        amount: true,
        reason: true,
        actions: true,
    };

    const [columnVisibilityTwo, setColumnVisibilityTwo] = useState(initialColumnVisibilityTwo);

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
            pagename: String("Client Error Waiver"),
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
            let res_vendor = await axios.post(SERVICE.CLIENTERRORMONTHAMOUNT_WAIVER, {
                fromdate: filterUser.fromdate,
                todate: filterUser.todate,
                companyname: isUserRoleAccess.companyname
            }, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            let itemsWithSerialNumber = res_vendor?.data?.finalData?.map((item, index) => {
                const sentData = item.history?.find(data => data.status === "Sent");
                return {
                    ...item,
                    id: item._id,
                    serialNumber: index + 1,
                    date: moment(item.date).format('DD/MM/YYYY'),
                    reason: item.history.length > 0
                        ? (item.history[item.history.length - 1].mode === "Percentage" && item.history[item.history.length - 1].status === "Approved")
                            ? (sentData && sentData.reason)
                            : item.history[item.history.length - 1].reason
                        : "",
                }
            });
            setClientErrors(itemsWithSerialNumber);
            // setFilteredRowData(itemsWithSerialNumber);

            let itemsWithSerialNumberTwo = res_vendor?.data?.finalData
                ?.filter(data => Array.isArray(data.history) && data.history.length > 0)
                ?.map((item, index) => {

                    const relevantHistory = item.history.filter(val =>
                        ["Sent", "Recheck"].includes(val.status)
                    );

                    const reasons = relevantHistory.map(val => val.reason).join('\n');

                    if (item.history[item.history.length - 1]?.status === "Recheck") {
                        return {
                            ...item,
                            id: item._id,
                            date: moment(item.date).format('DD/MM/YYYY'),
                            reason: reasons,
                        };
                    }
                    return null;
                }).filter(Boolean);
            setClientErrorsTwo(itemsWithSerialNumberTwo?.map((item, index) => ({ ...item, serialNumber: index + 1, })));
            // setFilteredRowDataTwo(itemsWithSerialNumberTwo?.map((item, index) => ({ ...item, serialNumber: index + 1, })));
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
        setItemsTwo([]);
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

    const addSerialNumberTwo = (datas) => {
        setItemsTwo(datas);
    };

    useEffect(() => {
        addSerialNumberTwo(clientErrorsTwo);
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

    const filteredData = filteredDatas?.slice((page - 1) * pageSize, page * pageSize);
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
    const handlePageSizeChangeTwo = (event) => {
        setPageSizeTwo(Number(event.target.value));
        setPageTwo(1);
    };

    // Split the search query into individual terms
    const searchTermsTwo = searchQueryTwo.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatasTwo = itemsTwo?.filter((item) => {
        return searchTermsTwo.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
        );
    });

    const filteredDataTwo = filteredDatasTwo?.slice((pageTwo - 1) * pageSizeTwo, pageTwo * pageSizeTwo);
    const totalPagesTwo = Math.ceil(filteredDatasTwo.length / pageSizeTwo);
    const visiblePagesTwo = Math.min(totalPagesTwo, 3);
    const firstVisiblePageTwo = Math.max(1, pageTwo - 1);
    const lastVisiblePageTwo = Math.min(firstVisiblePageTwo + visiblePagesTwo - 1, totalPagesTwo);
    const pageNumbersTwo = [];
    const indexOfLastItemTwo = pageTwo * pageSizeTwo;
    const indexOfFirstItemTwo = indexOfLastItemTwo - pageSizeTwo;
    for (let i = firstVisiblePageTwo; i <= lastVisiblePageTwo; i++) {
        pageNumbersTwo.push(i);
    }

    const columnDataTable = [
        { field: "serialNumber", headerName: "SNo", flex: 0, width: 75, hide: !columnVisibility.serialNumber, pinned: 'left', lockPinned: true, },
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
        { field: "clienterror", headerName: "Client Error", flex: 0, width: 100, hide: !columnVisibility.clienterror, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "clientamount", headerName: "Client Amount", flex: 0, width: 100, hide: !columnVisibility.clientamount, },
        { field: "percentage", headerName: "per%", flex: 0, width: 100, hide: !columnVisibility.percentage, },
        { field: "amount", headerName: "Amount", flex: 0, width: 100, hide: !columnVisibility.amount, },
        { field: "reason", headerName: "Reason", flex: 0, width: 250, hide: !columnVisibility.reason, cellStyle: cellStyles, headerClass: 'header-wrap', },
        {
            field: "actions", headerName: "Action", flex: 0, width: 350, hide: !columnVisibility.actions, sortable: false, filter: false,
            cellRenderer: (params) => (
                <Grid>
                    {
                        (params.data.history === undefined || params.data.history?.length === 0) ? (
                            <ActionCell
                                rowId={params.data.id}
                                currentRejectReason={rejectReasons[params.data.id] || ""}
                                onSave={(rejectreason) => {
                                    setRejectReasons((prev) => ({
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
    const columnDataTableTwo = [
        { field: "serialNumber", headerName: "SNo", flex: 0, width: 75, hide: !columnVisibilityTwo.serialNumber, pinned: 'left', lockPinned: true, },
        { field: "vendor", headerName: "Vendor Name", flex: 0, width: 150, hide: !columnVisibilityTwo.vendor, },
        { field: "branch", headerName: "Branch Name", flex: 0, width: 150, hide: !columnVisibilityTwo.branch, },
        { field: "employeeid", headerName: "Employee Code", flex: 0, width: 150, hide: !columnVisibilityTwo.employeeid, },
        { field: "employeename", headerName: "Employee Name", flex: 0, width: 250, hide: !columnVisibilityTwo.employeename, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "loginid", headerName: "Login id", flex: 0, width: 120, hide: !columnVisibilityTwo.loginid, },
        { field: "date", headerName: "Date", flex: 0, width: 120, hide: !columnVisibilityTwo.date, },
        { field: "category", headerName: "Category", flex: 0, width: 250, hide: !columnVisibilityTwo.category, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "subcategory", headerName: "Subcategory", flex: 0, width: 250, hide: !columnVisibilityTwo.subcategory, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "documentnumber", headerName: "Document Number", flex: 0, width: 150, hide: !columnVisibilityTwo.documentnumber, },
        { field: "fieldname", headerName: "Field Name", flex: 0, width: 150, hide: !columnVisibilityTwo.fieldname, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "line", headerName: "Line", flex: 0, width: 100, hide: !columnVisibilityTwo.line, },
        { field: "errorvalue", headerName: "Error Value", flex: 0, width: 250, hide: !columnVisibilityTwo.errorvalue, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "correctvalue", headerName: "Correct Value", flex: 0, width: 250, hide: !columnVisibilityTwo.correctvalue, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "clienterror", headerName: "Client Error", flex: 0, width: 100, hide: !columnVisibilityTwo.clienterror, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "clientamount", headerName: "Client Amount", flex: 0, width: 100, hide: !columnVisibilityTwo.clientamount, },
        { field: "percentage", headerName: "per%", flex: 0, width: 100, hide: !columnVisibilityTwo.percentage, },
        { field: "amount", headerName: "Amount", flex: 0, width: 100, hide: !columnVisibilityTwo.amount, },
        {
            field: "reason", headerName: "Reason", flex: 0, width: 250, hide: !columnVisibilityTwo.reason, cellStyle: cellStyles, headerClass: 'header-wrap',
            cellRenderer: (params) => {
                const reasons = params.data.reason ? params.data.reason.split('\n') : [];
                return (
                    <Grid>
                        {reasons.map((line, index) => (
                            <Typography
                                key={index}
                                sx={{ color: index === 1 ? 'red' : index > 0 && index < reasons.length - 1 ? 'red' : 'inherit', whiteSpace: "pre-wrap !important", }}
                            >
                                {line}
                            </Typography>
                        ))}
                    </Grid>
                );
            },
        },
        {
            field: "actions", headerName: "Action", flex: 0, width: 350, hide: !columnVisibilityTwo.actions, sortable: false, filter: false,
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
                        auth={auth} filteredErrorData={filteredErrorData} rowData={params.data}
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
    const rowDataTableTwo = filteredDataTwo.map((item, index) => {
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
    const handleShowAllColumnsTwo = () => {
        const updatedVisibility = { ...columnVisibilityTwo };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibilityTwo(updatedVisibility);
    };

    // Function to filter columns based on search query
    const filteredColumns = columnDataTable.filter((column) =>
        column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase())
    );

    // Function to filter columns based on search query second Table
    const filteredColumnsTwo = columnDataTableTwo.filter((column) =>
        column.headerName.toLowerCase().includes(searchQueryManageTwo.toLowerCase())
    );

    // Manage Columns functionality
    const toggleColumnVisibility = (field) => {
        setColumnVisibility((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };

    // Manage Columns functionality secondtable
    const toggleColumnVisibilityTwo = (field) => {
        setColumnVisibilityTwo((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };

    const [fileFormat, setFormat] = useState("");
    let exportColumnNames = ['Vendor Name', 'Branch Name', 'Employee Code', 'Employee Name', 'Login id', 'Date', 'Category', 'Subcategory', 'Document Number', 'Field Name', 'Line', 'Error Value', 'Correct Value', 'Client Error', 'Client Amount', 'Per%', 'Amount', 'Reason'];
    let exportRowValues = ['vendor', 'branch', 'employeeid', 'employeename', 'loginid', 'date', 'category', 'subcategory', 'documentnumber', 'fieldname', 'line', 'errorvalue', 'correctvalue', 'clienterror', 'clientamount', 'percentage', 'amount', 'reason'];

    const fileNameTwo = "Recheck Client Error List";
    const fileTypeTwo = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtensionTwo = fileFormat === "xl" ? '.xlsx' : '.csv';
    const exportToCSVTwo = (csvData, fileNameTwo) => {
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileTypeTwo });
        FileSaver.saveAs(data, fileNameTwo + fileExtensionTwo);
    }

    const handleExportXLTwo = (isfilter) => {
        // Define the table headers
        const headers = ['SNo', 'Vendor Name', 'Branch Name', 'Employee Code', 'Employee Name', 'Login id', 'Date', 'Category', 'Subcategory', 'Document Number', 'Field Name', 'Line', 'Error Value', 'Correct Value', 'Client Error', 'Client Amount', 'Per%', 'Amount', 'Reason'];

        let data = [];
        let resultdata = (filteredChangesTwo !== null ? filteredRowDataTwo : rowDataTableTwo) ?? [];

        if (isfilter === "filtered") {
            data = resultdata.map((row, index) => {
                const reasons = row.reason ? row.reason.split('\n').join('\r\n') : '';
                return [
                    index + 1,
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
                    row.line, row.errorvalue, row.correctvalue, row.clienterror, row.clientamount, row.percentage, row.amount,
                    reasons,
                ];
            });
        } else if (isfilter === "overall") {
            data = clientErrorsTwo.map((row, index) => {
                const reasons = row.reason ? row.reason.split('\n').join('\r\n') : '';
                return [
                    index + 1,
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
                    row.line, row.errorvalue, row.correctvalue, row.clienterror, row.clientamount, row.percentage, row.amount,
                    reasons,
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
        exportToCSVTwo(formattedData, fileNameTwo);
        setIsFilterOpenTwo(false);
    };

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Current Client Error List",
        pageStyle: "print",
    });

    //print...
    const componentRefTwo = useRef();
    const handleprintTwo = useReactToPrint({
        content: () => componentRefTwo.current,
        documentTitle: "Recheck Client Error List",
        pageStyle: "print",
    });

    const downloadPdfTwo = (isfilter) => {
        const doc = new jsPDF({ orientation: 'landscape' });

        // Define the table headers
        const headers = ['SNo', 'Vendor Name', 'Branch Name', 'Employee Code', 'Employee Name', 'Login id', 'Date', 'Category', 'Subcategory', 'Document Number', 'Field Name', 'Line', 'Error Value', 'Correct Value', 'Client Error', 'Client Amount', 'Per%', 'Amount', 'Reason'];

        let data = [];
        let resultdata = (filteredChangesTwo !== null ? filteredRowDataTwo : rowDataTableTwo) ?? [];

        if (isfilter === "filtered") {
            data = resultdata.map((row, index) => {
                const reasons = row.reason ? row.reason.split('\n').join('\r\n') : '';
                return [
                    index + 1,
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
                    row.line, row.errorvalue, row.correctvalue, row.clienterror, row.clientamount, row.percentage, row.amount,
                    reasons,
                ];
            });
        } else if (isfilter === "overall") {
            data = clientErrorsTwo.map((row, index) => {
                const reasons = row.reason ? row.reason.split('\n').join('\r\n') : '';
                return [
                    index + 1,
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
                    row.line, row.errorvalue, row.correctvalue, row.clienterror, row.clientamount, row.percentage, row.amount,
                    reasons,
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
                doc.addPage({ orientation: "landscape" }); // Add a new landscape page for each chunk, except the first one
            }

            doc.autoTable({
                theme: "grid",
                styles: { fontSize: 8 },
                head: [chunk.headers],
                body: chunk.data,
                startY: 20, // Twoust startY to leave space for headers
                margin: { top: 20, left: 10, right: 10, bottom: 10 }, // Twoust margin as needed
            });
        });

        doc.save("Recheck Client Error List.pdf");
    };

    //image
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Client Client Error List.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    //image second table
    const handleCaptureImageTwo = () => {
        if (gridRefTableImgTwo.current) {
            domtoimage.toBlob(gridRefTableImgTwo.current)
                .then((blob) => {
                    saveAs(blob, "Recheck Client Error.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    return (
        <Box>
            <Headtitle title={"Client Error Waiver"} />
            <PageHeading
                title="Client Error Waiver"
                modulename="Quality"
                submodulename="Penalty"
                mainpagename="Penalty Waiver"
                subpagename="Client Error Waiver"
                subsubpagename=""
            />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lclienterrorwaiver") && (
                <>
                    <Box sx={userStyle.selectcontainer}>
                        <Grid container spacing={2}>
                            {/* <Grid item md={12} sm={12} xs={12}>
                                <Typography sx={userStyle.importheadtext}> Client Error Waiver</Typography>
                            </Grid> */}
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
                                    <LoadingButton onClick={handleSubmit} loading={loadingdeloverall} sx={buttonStyles.buttonsubmit} loadingPosition="end" variant="contained">Get List</LoadingButton>
                                </Box>
                            </Grid>
                            <Grid item lg={1} md={2} sm={2} xs={6}>
                                <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0, } })}>
                                    <Button sx={buttonStyles.btncancel} onClick={handleClear}>Clear</Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box> <br />
                    {/* First Table */}
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <ScrollingText text="Make sure that the data matches the category and subcategory for client error rates. If it's not found, please notify the manager." />
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
                                    {isUserRoleCompare?.includes("excelclienterrorwaiver") && (
                                        <>
                                            <Button onClick={(e) => { setIsFilterOpen(true); setFormat("xl"); }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvclienterrorwaiver") && (
                                        <>
                                            <Button onClick={(e) => { setIsFilterOpen(true); setFormat("csv"); }} sx={userStyle.buttongrp}><FaFileCsv /> &ensp;Export to CSV&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printclienterrorwaiver") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint} >&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfclienterrorwaiver") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={() => { setIsPdfFilterOpen(true); }}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imageclienterrorwaiver") && (
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
                        </Grid> <br />
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}> Show All Columns</Button>&ensp;
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
                                    pagenamecheck={"Client Error Waiver_Current"}
                                />
                            </>
                        )}
                    </Box><br />
                    {/* Second Table */}
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Recheck Client Error List</Typography>
                        </Grid>
                        <Grid container spacing={2} style={userStyle.dataTablestyle}>
                            <Grid item md={2} xs={12} sm={12}>
                                <Box>
                                    <label>Show entries:</label>
                                    <Select
                                        id="pageSizeSelect"
                                        value={pageSizeTwo}
                                        MenuProps={{
                                            PaperProps: {
                                                style: {
                                                    maxHeight: 180,
                                                    width: 80,
                                                },
                                            },
                                        }}
                                        onChange={handlePageSizeChangeTwo}
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
                            <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center", }}>
                                <Box>
                                    {isUserRoleCompare?.includes("excelclienterrorwaiver") && (
                                        <>
                                            <Button onClick={(e) => { setIsFilterOpenTwo(true); setFormat("xl"); }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvclienterrorwaiver") && (
                                        <>
                                            <Button onClick={(e) => { setIsFilterOpenTwo(true); setFormat("csv"); }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printclienterrorwaiver") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprintTwo}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfclienterrorwaiver") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={() => { setIsPdfFilterOpenTwo(true); }}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imageclienterrorwaiver") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleCaptureImageTwo}><ImageIcon sx={{ fontSize: "15px" }} />{" "}&ensp;Image&ensp;</Button>
                                        </>
                                    )}
                                </Box>
                            </Grid>
                            <Grid item md={2} xs={6} sm={6}>
                                <Box>
                                    <AggregatedSearchBar
                                        columnDataTable={columnDataTableTwo}
                                        setItems={setItemsTwo}
                                        addSerialNumber={addSerialNumberTwo}
                                        setPage={setPageTwo}
                                        maindatas={clientErrorsTwo}
                                        setSearchedString={setSearchedStringTwo}
                                        searchQuery={searchQueryTwo}
                                        setSearchQuery={setSearchQueryTwo}
                                        paginated={false}
                                        totalDatas={clientErrorsTwo}
                                    />
                                </Box>
                            </Grid>
                        </Grid><br />
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumnsTwo}>Show All Columns</Button>&ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsTwo}>Manage Columns</Button><br /><br />
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
                                    rowDataTable={rowDataTableTwo}
                                    columnDataTable={columnDataTableTwo}
                                    columnVisibility={columnVisibilityTwo}
                                    page={pageTwo}
                                    setPage={setPageTwo}
                                    pageSize={pageSizeTwo}
                                    totalPages={totalPagesTwo}
                                    setColumnVisibility={setColumnVisibilityTwo}
                                    isHandleChange={isHandleChangeTwo}
                                    items={itemsTwo}
                                    gridRefTable={gridRefTableTwo}
                                    paginated={false}
                                    filteredDatas={filteredDatasTwo}
                                    // totalDatas={totalDatas}
                                    selectedRows={selectedRowsTwo}
                                    setSelectedRows={setSelectedRowsTwo}
                                    searchQuery={searchedStringTwo}
                                    handleShowAllColumns={handleShowAllColumnsTwo}
                                    setFilteredRowData={setFilteredRowDataTwo}
                                    filteredRowData={filteredRowDataTwo}
                                    setFilteredChanges={setFilteredChangesTwo}
                                    filteredChanges={filteredChangesTwo}
                                    gridRefTableImg={gridRefTableImgTwo}
                                    itemsList={clientErrorsTwo}
                                    pagenamecheck={"Client Error Waiver_Recheck"}
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
                id={idTwo}
                open={isManageColumnsOpenTwo}
                anchorEl={anchorElTwo}
                onClose={handleCloseManageColumnsTwo}
                anchorOrigin={{ vertical: "bottom", horizontal: "left", }}>
                <ManageColumnsContent
                    handleClose={handleCloseManageColumnsTwo}
                    searchQuery={searchQueryManageTwo}
                    setSearchQuery={setSearchQueryManageTwo}
                    filteredColumns={filteredColumnsTwo}
                    columnVisibility={columnVisibilityTwo}
                    toggleColumnVisibility={toggleColumnVisibilityTwo}
                    setColumnVisibility={setColumnVisibilityTwo}
                    initialColumnVisibility={initialColumnVisibilityTwo}
                    columnDataTable={columnDataTableTwo}
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
                filename={"Current Client Error"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            {/* second Table */}
            {/* EXTERNAL COMPONENTS -------------- END */}
            <Dialog open={isFilterOpenTwo} onClose={handleCloseFilterModTwo} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>

                    <IconButton
                        aria-label="close"
                        onClick={handleCloseFilterModTwo}
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
                            handleExportXLTwo("filtered")
                        }}
                    >
                        Export Filtered Data
                    </Button>
                    <Button autoFocus variant="contained"
                        onClick={(e) => {
                            handleExportXLTwo("overall")
                        }}
                    >
                        Export Over All Data
                    </Button>
                </DialogActions>
            </Dialog>
            {/*Export pdf Data  */}
            <Dialog open={isPdfFilterOpenTwo} onClose={handleClosePdfFilterModTwo} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>
                    <IconButton
                        aria-label="close"
                        onClick={handleClosePdfFilterModTwo}
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
                            downloadPdfTwo("filtered")
                            setIsPdfFilterOpenTwo(false);
                        }}
                    >
                        Export Filtered Data
                    </Button>
                    <Button variant="contained"
                        onClick={(e) => {
                            downloadPdfTwo("overall")
                            setIsPdfFilterOpenTwo(false);
                        }}
                    >
                        Export Over All Data
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default ClientErrorWaiver;