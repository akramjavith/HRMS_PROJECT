import React, { useContext, useEffect, useRef, useState } from "react";
import { Box, Button, FormControl, Grid, MenuItem, Popover, Select, Typography, TextareaAutosize, Dialog, DialogContent, DialogActions, IconButton, Table, Paper, TableContainer, TableHead, TableRow, TableBody, TableCell } from "@mui/material";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CloseIcon from "@mui/icons-material/Close";
import jsPDF from "jspdf";
import ImageIcon from "@mui/icons-material/Image";
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
import MessageAlert from "../../../components/MessageAlert";
import AggregatedSearchBar from "../../../components/AggregatedSearchBar";
import AggridTable from "../../../components/AggridTable";
import domtoimage from 'dom-to-image';
import ManageColumnsContent from "../../../components/ManageColumn";

const RecheckReasonCellThree = ({ rowId, currentRecheckReasonThree, onSave, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert, setPopupContent, setPopupSeverity, handleClickOpenPopup, auth, fetchAllClient, rowData }) => {
    const [localRecheckReasonThree, setLocalRecheckReasonThree] = useState('');

    const today = new Date();
    const date = today.toISOString().split('T')[0];
    const time = today.toTimeString().split(' ')[0].slice(0, 5);

    const handleSaveClick = async () => {
        onSave(localRecheckReasonThree);
        if (localRecheckReasonThree === '') {
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
                            tablename: 'Client Error Forward_Resent',
                            date: date,
                            time: time,
                            status: "Recheck",
                            reason: localRecheckReasonThree,
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
                        value={localRecheckReasonThree}
                        placeholder="Recheck Reason"
                        onChange={(e) => {
                            setLocalRecheckReasonThree(e.target.value);
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
                <Button sx={{ textTransform: 'capitalize' }} variant="contained" color="error" size="small" onClick={handleSaveClick}>Recheck</Button>
            </Grid>
        </Grid>
    );
};

const ForwardReasonCellThree = ({ rowId, currentForwardReasonThree, onSave, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert, setPopupContent, setPopupSeverity, handleClickOpenPopup, auth, fetchAllClient, rowData }) => {
    const [localForwardReasonThree, setLocalForwardReasonThree] = useState('');

    const today = new Date();
    const date = today.toISOString().split('T')[0];
    const time = today.toTimeString().split(' ')[0].slice(0, 5);

    const handleSaveClick = async () => {
        onSave(localForwardReasonThree);
        if (localForwardReasonThree === '') {
            setPopupContentMalert("Please Enter Forward Reason");
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
                            tablename: 'Client Error Forward_Resent',
                            date: date,
                            time: time,
                            status: "Forward",
                            reason: localForwardReasonThree,
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
                        value={localForwardReasonThree}
                        placeholder="Forward Reason"
                        onChange={(e) => {
                            setLocalForwardReasonThree(e.target.value);
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
                <Button sx={{ textTransform: 'capitalize' }} variant="contained" color="error" size="small" onClick={handleSaveClick}>Forward</Button>
            </Grid>
        </Grid>
    );
};

const ModeCellThree = ({ rowId, currentModeReason, onSave, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert, setPopupContent, setPopupSeverity, handleClickOpenPopup, auth, fetchAllClient, rowData }) => {
    const [localModeReason, setLocalModeReason] = useState('NaN');
    const modeOption = [
        { label: "NaN", value: "NaN" },
        { label: "Approved", value: "Approved" },
        { label: "Reject", value: "Reject" },
    ]

    const today = new Date();
    const date = today.toISOString().split('T')[0];
    const time = today.toTimeString().split(' ')[0].slice(0, 5);

    const handleSaveClick = async () => {
        onSave(localModeReason);
        if (localModeReason === '') {
            setPopupContentMalert("Please Select Mode");
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
                            tablename: 'Client Error Forward_Resent',
                            date: date,
                            time: time,
                            status: localModeReason,
                            reason: "",
                            mode: "Mode",
                        }
                    ]
                });
                await fetchAllClient();
                setPopupContent(`${localModeReason} Successfully`);
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
                    <Select size="small"
                        labelId="demo-select-small"
                        id="demo-select-small"
                        MenuProps={{
                            PaperProps: {
                                style: {
                                    maxHeight: 200,
                                    width: "auto",
                                },
                            },
                        }}
                        style={{ minWidth: 150, width: '230px' }}
                        // value={rowMode[params.data.id]?.mode ? rowMode[params.data.id]?.mode : params.data.mode}
                        value={localModeReason}
                        onChange={(e) => { setLocalModeReason(e.target.value); }}
                        inputProps={{ "aria-label": "Without label" }}
                    >
                        {modeOption?.map((d) => (
                            <MenuItem key={d._id} value={d.value}>
                                {d.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={9} md={9}>
                <Button sx={{ textTransform: 'capitalize' }} variant="contained" color="success" size="small" onClick={handleSaveClick}>Submit</Button>
            </Grid>
        </Grid>
    );
};

const RecheckReasonCellFour = ({ rowId, currentRecheckReasonFour, onSave, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert, setPopupContent, setPopupSeverity, handleClickOpenPopup, auth, fetchAllClient, rowData }) => {
    const [localRecheckReasonFour, setLocalRecheckReasonFour] = useState('');

    const today = new Date();
    const date = today.toISOString().split('T')[0];
    const time = today.toTimeString().split(' ')[0].slice(0, 5);

    const handleSaveClick = async () => {
        onSave(localRecheckReasonFour);
        if (localRecheckReasonFour === '') {
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
                            tablename: 'Client Error Forward_Recheck',
                            date: date,
                            time: time,
                            status: "Recheck",
                            reason: localRecheckReasonFour,
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
                        value={localRecheckReasonFour}
                        placeholder="Recheck Reason"
                        onChange={(e) => {
                            setLocalRecheckReasonFour(e.target.value);
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
                <Button sx={{ textTransform: 'capitalize' }} variant="contained" color="error" size="small" onClick={handleSaveClick}>Recheck</Button>
            </Grid>
        </Grid>
    );
};

const ForwardReasonCellFour = ({ rowId, currentForwardReasonFour, onSave, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert, setPopupContent, setPopupSeverity, handleClickOpenPopup, auth, fetchAllClient, rowData }) => {
    const [localForwardReasonFour, setLocalForwardReasonFour] = useState('');

    const today = new Date();
    const date = today.toISOString().split('T')[0];
    const time = today.toTimeString().split(' ')[0].slice(0, 5);

    const handleSaveClick = async () => {
        onSave(localForwardReasonFour);
        if (localForwardReasonFour === '') {
            setPopupContentMalert("Please Enter Forward Reason");
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
                            tablename: 'Client Error Forward_Recheck',
                            date: date,
                            time: time,
                            status: "Forward",
                            reason: localForwardReasonFour,
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
                        value={localForwardReasonFour}
                        placeholder="Forward Reason"
                        onChange={(e) => {
                            setLocalForwardReasonFour(e.target.value);
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
                <Button sx={{ textTransform: 'capitalize' }} variant="contained" color="error" size="small" onClick={handleSaveClick}>Forward</Button>
            </Grid>
        </Grid>
    );
};

const ModeCellFour = ({ rowId, currentModeReason, onSave, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert, setPopupContent, setPopupSeverity, handleClickOpenPopup, auth, fetchAllClient, rowData }) => {
    const [localModeReason, setLocalModeReason] = useState('NaN');
    const modeOption = [
        { label: "NaN", value: "NaN" },
        { label: "Approved", value: "Approved" },
        { label: "Reject", value: "Reject" },
    ]

    const today = new Date();
    const date = today.toISOString().split('T')[0];
    const time = today.toTimeString().split(' ')[0].slice(0, 5);

    const handleSaveClick = async () => {
        onSave(localModeReason);
        if (localModeReason === '') {
            setPopupContentMalert("Please Select Mode");
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
                            tablename: 'Client Error Forward_Recheck',
                            date: date,
                            time: time,
                            status: localModeReason,
                            reason: "",
                            mode: "Mode",
                        }
                    ]
                });
                await fetchAllClient();
                setPopupContent(`${localModeReason} Successfully`);
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
                    <Select size="small"
                        labelId="demo-select-small"
                        id="demo-select-small"
                        MenuProps={{
                            PaperProps: {
                                style: {
                                    maxHeight: 200,
                                    width: "auto",
                                },
                            },
                        }}
                        style={{ minWidth: 150, width: '230px' }}
                        // value={rowMode[params.data.id]?.mode ? rowMode[params.data.id]?.mode : params.data.mode}
                        value={localModeReason}
                        onChange={(e) => { setLocalModeReason(e.target.value); }}
                        inputProps={{ "aria-label": "Without label" }}
                    >
                        {modeOption?.map((d) => (
                            <MenuItem key={d._id} value={d.value}>
                                {d.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={9} md={9}>
                <Button sx={{ textTransform: 'capitalize' }} variant="contained" color="success" size="small" onClick={handleSaveClick}>Submit</Button>
            </Grid>
        </Grid>
    );
};

function ResentForwardEmployee({ clientErrorsThree, clientErrorsFour, fetchAllClient, loader, tableCheck, setFilteredRowDataThree, filteredChangesThree, setFilteredChangesThree, filteredRowDataThree, setIsHandleChangeThree, isHandleChangeThree, setSearchedStringThree, searchedStringThree, setFilteredRowDataFour, filteredChangesFour, setFilteredChangesFour, filteredRowDataFour, setIsHandleChangeFour, isHandleChangeFour, setSearchedStringFour, searchedStringFour }) {

    let cellStyles = {
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        lineHeight: 'normal',
        // fontSize: "12px"
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
    const [forwardReasonsThree, setForwardReasonsThree] = useState({});
    const [rowModeThree, setRowModeThree] = useState({});

    const [itemsFour, setItemsFour] = useState([]);
    const [selectedRowsFour, setSelectedRowsFour] = useState([]);
    const [recheckReasonsFour, setRecheckReasonsFour] = useState({});
    const [forwardReasonsFour, setForwardReasonsFour] = useState({});
    const [rowModeFour, setRowModeFour] = useState({});

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

    // Show All Columns & Manage Columns
    const initialColumnVisibilityThree = {
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
        requestreason: true,
        forwardreason: true,
        actions: true,
        mode: true,
        actions2: true
    };
    const [columnVisibilityThree, setColumnVisibilityThree] = useState(initialColumnVisibilityThree);

    // Show All Columns & Manage Columns second Table
    const initialColumnVisibilityFour = {
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
        requestreason: true,
        forwardreason: true,
        actions: true,
        mode: true,
        actions2: true
    };

    const [columnVisibilityFour, setColumnVisibilityFour] = useState(initialColumnVisibilityFour);

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

    const addSerialNumberThree = (datas) => {
        setItemsThree(datas);
    };

    useEffect(() => {
        addSerialNumberThree(clientErrorsThree);
    }, [clientErrorsThree]);

    // second Table
    const addSerialNumberFour = (datas) => {
        setItemsFour(datas);
    };

    useEffect(() => {
        addSerialNumberFour(clientErrorsFour);
    }, [clientErrorsFour]);

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
        { field: "level", headerName: "Level", flex: 0, width: 100, hide: !columnVisibilityThree.level, },
        { field: "vendor", headerName: "Vendor Name", flex: 0, width: 150, hide: !columnVisibilityThree.vendor, },
        { field: "branch", headerName: "Branch Name", flex: 0, width: 150, hide: !columnVisibilityThree.branch, },
        { field: "employeeid", headerName: "Employee Code", flex: 0, width: 150, hide: !columnVisibilityThree.employeeid, },
        { field: "employeename", headerName: "Employee Name", flex: 0, width: 250, hide: !columnVisibilityThree.employeename, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "loginid", headerName: "Login id", flex: 0, width: 120, hide: !columnVisibilityThree.loginid, },
        { field: "date", headerName: "Date", flex: 0, width: 120, hide: !columnVisibilityThree.date, },
        { field: "category", headerName: "Category", flex: 0, width: 250, hide: !columnVisibilityThree.category, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "subcategory", headerName: "Subcategory", flex: 0, width: 250, hide: !columnVisibilityThree.subcategory, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "documentnumber", headerName: "Document Number", flex: 0, width: 150, hide: !columnVisibilityThree.documentnumber, },
        { field: "fieldname", headerName: "Field Name", flex: 0, width: 150, hide: !columnVisibilityThree.fieldname, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "line", headerName: "Line", flex: 0, width: 100, hide: !columnVisibilityThree.line, },
        { field: "errorvalue", headerName: "Error Value", flex: 0, width: 250, hide: !columnVisibilityThree.errorvalue, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "correctvalue", headerName: "Correct Value", flex: 0, width: 250, hide: !columnVisibilityThree.correctvalue, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "clienterror", headerName: "Client Error", flex: 0, width: 250, hide: !columnVisibilityThree.clienterror, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "clientamount", headerName: "Client Amount", flex: 0, width: 100, hide: !columnVisibilityThree.clientamount, },
        { field: "percentage", headerName: "per%", flex: 0, width: 100, hide: !columnVisibilityThree.percentage, },
        { field: "amount", headerName: "Amount", flex: 0, width: 100, hide: !columnVisibilityThree.amount, },
        {
            field: "requestreason", headerName: "Request Reason", flex: 0, width: 250, hide: !columnVisibilityThree.requestreason, cellStyle: cellStyles, headerClass: 'header-wrap',
            cellRenderer: (params) => {
                const requestReasons = params.data.requestreason ? params.data.requestreason.split('\n') : [];
                return (
                    <Grid>
                        {requestReasons.map((line, index) => (
                            <Typography
                                key={index}
                                // sx={{ color: index > 0 && index < requestReasons.length - 1 ? 'red' : 'inherit', whiteSpace: "pre-wrap !important", lineHeight: 'normal' }}
                                sx={{ color: index === 1 ? 'red' : index > 0 && index < requestReasons.length - 1 ? 'red' : 'inherit', whiteSpace: "pre-wrap !important", }}
                            >
                                {line}
                            </Typography>
                        ))}
                    </Grid>
                );
            },
        },
        {
            field: "forwardreason", headerName: "Forward Reason", flex: 0, width: 250, hide: !columnVisibilityThree.forwardreason, cellStyle: cellStyles, headerClass: 'header-wrap',
            cellRenderer: (params) => {
                const forwardReasons = params.data.forwardreason ? params.data.forwardreason.split('\n') : [];
                return (
                    <Grid>
                        {forwardReasons.map((line, index) => (
                            <Typography
                                key={index}
                                sx={{ color: index > 0 && index < forwardReasons.length - 1 ? 'red' : 'inherit', whiteSpace: "pre-wrap !important", }}
                            >
                                {line}
                            </Typography>
                        ))}
                    </Grid>
                );
            },
        },
        {
            field: "actions", headerName: "Action", flex: 0, width: 350, hide: !columnVisibilityThree.actions, sortable: false, filter: false,
            cellRenderer: (params) => (
                <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
                    <RecheckReasonCellThree
                        rowId={params.data.id}
                        currentRecheckReasonThree={recheckReasonsThree[params.data.id] || ""}
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
                        auth={auth} fetchAllClient={fetchAllClient} rowData={params.data}
                    />
                </Grid>
            ),
        },
        {
            field: "mode", headerName: "Mode", flex: 0, width: 350, hide: !columnVisibilityThree.mode, sortable: false, filter: false,
            cellRenderer: (params) => (
                <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
                    <ModeCellThree
                        rowId={params.data.id}
                        currentModeReason={rowModeThree[params.data.id] || "NaN"}
                        onSave={(rejectreason2) => {
                            setRowModeThree((prev) => ({
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
            field: "actions", headerName: "Action", flex: 0, width: 350, hide: !columnVisibilityThree.actions,
            cellRenderer: (params) => (
                <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
                    <ForwardReasonCellThree
                        rowId={params.data.id}
                        currentForwardReasonThree={forwardReasonsThree[params.data.id] || ""}
                        onSave={(rejectreason2) => {
                            setForwardReasonsThree((prev) => ({
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
    ];

    // second table
    const columnDataTableFour = [
        { field: "serialNumber", headerName: "SNo", flex: 0, width: 75, hide: !columnVisibilityFour.serialNumber, pinned: 'left', lockPinned: true, },
        { field: "level", headerName: "Level", flex: 0, width: 100, hide: !columnVisibilityFour.level, },
        { field: "vendor", headerName: "Vendor Name", flex: 0, width: 150, hide: !columnVisibilityFour.vendor, },
        { field: "branch", headerName: "Branch Name", flex: 0, width: 150, hide: !columnVisibilityFour.branch, },
        { field: "employeeid", headerName: "Employee Code", flex: 0, width: 150, hide: !columnVisibilityFour.employeeid, },
        { field: "employeename", headerName: "Employee Name", flex: 0, width: 250, hide: !columnVisibilityFour.employeename, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "loginid", headerName: "Login id", flex: 0, width: 120, hide: !columnVisibilityFour.loginid, },
        { field: "date", headerName: "Date", flex: 0, width: 120, hide: !columnVisibilityFour.date, },
        { field: "category", headerName: "Category", flex: 0, width: 250, hide: !columnVisibilityFour.category, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "subcategory", headerName: "Subcategory", flex: 0, width: 250, hide: !columnVisibilityFour.subcategory, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "documentnumber", headerName: "Document Number", flex: 0, width: 150, hide: !columnVisibilityFour.documentnumber, },
        { field: "fieldname", headerName: "Field Name", flex: 0, width: 150, hide: !columnVisibilityFour.fieldname, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "line", headerName: "Line", flex: 0, width: 100, hide: !columnVisibilityFour.line, },
        { field: "errorvalue", headerName: "Error Value", flex: 0, width: 250, hide: !columnVisibilityFour.errorvalue, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "correctvalue", headerName: "Correct Value", flex: 0, width: 250, hide: !columnVisibilityFour.correctvalue, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "clienterror", headerName: "Client Error", flex: 0, width: 250, hide: !columnVisibilityFour.clienterror, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "clientamount", headerName: "Client Amount", flex: 0, width: 100, hide: !columnVisibilityFour.clientamount, },
        { field: "percentage", headerName: "per%", flex: 0, width: 100, hide: !columnVisibilityFour.percentage, },
        { field: "amount", headerName: "Amount", flex: 0, width: 100, hide: !columnVisibilityFour.amount, },
        {
            field: "requestreason", headerName: "Request Reason", flex: 0, width: 250, hide: !columnVisibilityFour.requestreason, cellStyle: cellStyles, headerClass: 'header-wrap',
            cellRenderer: (params) => {
                const requestReasons = params.data.requestreason ? params.data.requestreason.split('\n') : [];
                return (
                    <Grid>
                        {requestReasons.map((line, index) => (
                            <Typography
                                key={index}
                                sx={{ color: index > 0 && index < requestReasons.length - 1 ? 'red' : 'inherit', whiteSpace: "pre-wrap !important", lineHeight: 'normal' }}
                            >
                                {line}
                            </Typography>
                        ))}
                    </Grid>
                );
            },
        },
        {
            field: "forwardreason", headerName: "Forward Reason", flex: 0, width: 250, hide: !columnVisibilityFour.forwardreason, cellStyle: cellStyles, headerClass: 'header-wrap',
            cellRenderer: (params) => {
                const forwardReasons = params.data.forwardreason ? params.data.forwardreason.split('\n') : [];
                return (
                    <Grid>
                        {forwardReasons.map((line, index) => (
                            <Typography
                                key={index}
                                sx={{ color: index > 0 && index < forwardReasons.length - 1 ? 'red' : 'inherit', whiteSpace: "pre-wrap !important", lineHeight: 'normal' }}
                            >
                                {line}
                            </Typography>
                        ))}
                    </Grid>
                );
            },
        },
        {
            field: "actions", headerName: "Action", flex: 0, width: 350, hide: !columnVisibilityFour.actions, sortable: false, filter: false,
            cellRenderer: (params) => (
                <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
                    <RecheckReasonCellFour
                        rowId={params.data.id}
                        currentRecheckReasonFour={recheckReasonsFour[params.data.id] || ""}
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
                        auth={auth} fetchAllClient={fetchAllClient} rowData={params.data}
                    />
                </Grid>
            ),
        },
        {
            field: "mode", headerName: "Mode", flex: 0, width: 350, hide: !columnVisibilityFour.mode, sortable: false, filter: false,
            cellRenderer: (params) => (
                <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
                    <ModeCellFour
                        rowId={params.data.id}
                        currentModeReason={rowModeFour[params.data.id] || "NaN"}
                        onSave={(rejectreason2) => {
                            setRowModeFour((prev) => ({
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
            field: "actions", headerName: "Action", flex: 0, width: 350, hide: !columnVisibilityFour.actions,
            cellRenderer: (params) => (
                <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
                    <ForwardReasonCellFour
                        rowId={params.data.id}
                        currentForwardReasonFour={forwardReasonsFour[params.data.id] || ""}
                        onSave={(rejectreason) => {
                            setForwardReasonsFour((prev) => ({
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
    const fileNameThree = "Resent Forward Employee Client Error Waiver Request List";
    const fileTypeThree = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtensionThree = fileFormat === "xl" ? '.xlsx' : '.csv';
    const exportToCSVThree = (csvData, fileNameThree) => {
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileTypeThree });
        FileSaver.saveAs(data, fileNameThree + fileExtensionThree);
    }

    const handleExportXLThree = (isfilter) => {
        // Define the table headers
        const headers = ['SNo', 'Level', 'Vendor Name', 'Branch Name', 'Employee Code', 'Employee Name', 'Login id', 'Date', 'Category', 'SubCategory', 'Document Number', 'Field Name',
            'Line', 'Error Value', 'Correct Value', 'Client Error', 'Client Amount', 'per%', 'Amount', 'Request Reason', 'Forward Reason'];

        let data = [];
        let resultdata = (filteredChangesThree !== null ? filteredRowDataThree : rowDataTableThree) ?? [];

        if (isfilter === "filtered") {
            data = resultdata.map((row, index) => {
                const requestReasons = row.requestreason ? row.requestreason.split('\n').join('\r\n') : '';
                const forwardReasons = row.forwardreason ? row.forwardreason.split('\n').join('\r\n') : '';
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
                    row.line, row.errorvalue, row.correctvalue, row.clienterror, row.clientamount, row.percentage, row.amount,
                    requestReasons,
                    forwardReasons
                ];
            });
        } else if (isfilter === "overall") {
            data = clientErrorsThree.map((row, index) => {
                const requestReasons = row.requestreason ? row.requestreason.split('\n').join('\r\n') : '';
                const forwardReasons = row.forwardreason ? row.forwardreason.split('\n').join('\r\n') : '';
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
                    row.line, row.errorvalue, row.correctvalue, row.clienterror, row.clientamount, row.percentage, row.amount,
                    requestReasons,
                    forwardReasons
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
        exportToCSVThree(formattedData, fileNameThree);
        setIsFilterOpenThree(false);
    };

    const fileNameFour = "Recheck Employee Client Error Waiver Request List";
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
        const headers = ['SNo', 'Level', 'Vendor Name', 'Branch Name', 'Employee Code', 'Employee Name', 'Login id', 'Date', 'Category', 'SubCategory', 'Document Number', 'Field Name',
            'Line', 'Error Value', 'Correct Value', 'Client Error', 'Client Amount', 'per%', 'Amount', 'Request Reason', 'Forward Reason'];

        let data = [];
        let resultdata = (filteredChangesFour !== null ? filteredRowDataFour : rowDataTableFour) ?? [];

        if (isfilter === "filtered") {
            data = resultdata.map((row, index) => {
                const requestReasons = row.requestreason ? row.requestreason.split('\n').join('\r\n') : '';
                const forwardReasons = row.forwardreason ? row.forwardreason.split('\n').join('\r\n') : '';
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
                    row.line, row.errorvalue, row.correctvalue, row.clienterror, row.clientamount, row.percentage, row.amount,
                    requestReasons,
                    forwardReasons
                ];
            });
        } else if (isfilter === "overall") {
            data = clientErrorsFour.map((row, index) => {
                const requestReasons = row.requestreason ? row.requestreason.split('\n').join('\r\n') : '';
                const forwardReasons = row.forwardreason ? row.forwardreason.split('\n').join('\r\n') : '';
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
                    row.line, row.errorvalue, row.correctvalue, row.clienterror, row.clientamount, row.percentage, row.amount,
                    requestReasons,
                    forwardReasons
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
        documentTitle: "Resent Forward Employee Client Error Waiver Request List",
        pageStyle: "print",
    });

    //print...
    const componentRefFour = useRef();
    const handleprintFour = useReactToPrint({
        content: () => componentRefFour.current,
        documentTitle: "Recheck Employee Client Error Waiver Request List",
        pageStyle: "print",
    });

    const downloadPdfThree = (isfilter) => {
        const doc = new jsPDF({ orientation: 'landscape' });

        // Define the table headers
        const headers = ['SNo', 'Level', 'Vendor Name', 'Branch Name', 'Employee Code', 'Employee Name', 'Login id', 'Date', 'Category', 'SubCategory', 'Document Number', 'Field Name',
            'Line', 'Error Value', 'Correct Value', 'Client Error', 'Client Amount', 'per%', 'Amount', 'Request Reason', 'Forward Reason'];

        let data = [];
        let resultdata = (filteredChangesThree !== null ? filteredRowDataThree : rowDataTableThree) ?? [];

        if (isfilter === "filtered") {
            data = resultdata.map((row, index) => {
                const requestReasons = row.requestreason ? row.requestreason.split('\n').join('\r\n') : '';
                const forwardReasons = row.forwardreason ? row.forwardreason.split('\n').join('\r\n') : '';
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
                    row.line, row.errorvalue, row.correctvalue, row.clienterror, row.clientamount, row.percentage, row.amount,
                    requestReasons,
                    forwardReasons
                ];
            });
        } else if (isfilter === "overall") {
            data = clientErrorsThree.map((row, index) => {
                const requestReasons = row.requestreason ? row.requestreason.split('\n').join('\r\n') : '';
                const forwardReasons = row.forwardreason ? row.forwardreason.split('\n').join('\r\n') : '';
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
                    row.line, row.errorvalue, row.correctvalue, row.clienterror, row.clientamount, row.percentage, row.amount,
                    requestReasons,
                    forwardReasons
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
                startY: 20, // Threeust startY to leave space for headers
                margin: { top: 20, left: 10, right: 10, bottom: 10 }, // Threeust margin as needed
            });
        });

        doc.save("Resent Forward Employee Client Error Waiver Request List.pdf");
    };

    const downloadPdfFour = (isfilter) => {
        const doc = new jsPDF({ orientation: 'landscape' });

        // Define the table headers
        const headers = ['SNo', 'Level', 'Vendor Name', 'Branch Name', 'Employee Code', 'Employee Name', 'Login id', 'Date', 'Category', 'SubCategory', 'Document Number', 'Field Name',
            'Line', 'Error Value', 'Correct Value', 'Client Error', 'Client Amount', 'per%', 'Amount', 'Request Reason', 'Forward Reason'];

        let data = [];
        let resultdata = (filteredChangesFour !== null ? filteredRowDataFour : rowDataTableFour) ?? [];

        if (isfilter === "filtered") {
            data = resultdata.map((row, index) => {
                const requestReasons = row.requestreason ? row.requestreason.split('\n').join('\r\n') : '';
                const forwardReasons = row.forwardreason ? row.forwardreason.split('\n').join('\r\n') : '';
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
                    row.line, row.errorvalue, row.correctvalue, row.clienterror, row.clientamount, row.percentage, row.amount,
                    requestReasons,
                    forwardReasons
                ];
            });
        } else if (isfilter === "overall") {
            data = clientErrorsFour.map((row, index) => {
                const requestReasons = row.requestreason ? row.requestreason.split('\n').join('\r\n') : '';
                const forwardReasons = row.forwardreason ? row.forwardreason.split('\n').join('\r\n') : '';
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
                    row.line, row.errorvalue, row.correctvalue, row.clienterror, row.clientamount, row.percentage, row.amount,
                    requestReasons,
                    forwardReasons
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
                startY: 20, // Fourust startY to leave space for headers
                margin: { top: 20, left: 10, right: 10, bottom: 10 }, // Fourust margin as needed
            });
        });

        doc.save("Recheck Employee Client Error Waiver Request List.pdf");
    };

    //image
    const handleCaptureImageThree = () => {
        if (gridRefTableImgThree.current) {
            domtoimage.toBlob(gridRefTableImgThree.current)
                .then((blob) => {
                    saveAs(blob, "Resent Forward Employee Client Error Waiver Request List.png");
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
                    saveAs(blob, "Recheck Employee Client Error Waiver Request List.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    return (
        <Box>
            <Headtitle title={"Client Error Forward"} />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lclienterrorforward") && (
                <>
                    {tableCheck?.includes('Resent Forward Employee Client Error Waiver Request List') ?
                        <>
                            <Box sx={userStyle.container}>
                                {/* ******************************************************EXPORT Buttons****************************************************** */}
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext}>Resent Forward Employee Client Error Waiver Request List</Typography>
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
                                                <MenuItem value={clientErrorsThree?.length}>All</MenuItem>
                                            </Select>
                                        </Box>
                                    </Grid>
                                    <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center", }}>
                                        <Box>
                                            {isUserRoleCompare?.includes("excelclienterrorforward") && (
                                                <>
                                                    <Button onClick={(e) => { setIsFilterOpenThree(true); setFormat("xl"); }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("csvclienterrorforward") && (
                                                <>
                                                    <Button onClick={(e) => { setIsFilterOpenThree(true); setFormat("csv"); }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("printclienterrorforward") && (
                                                <>
                                                    <Button sx={userStyle.buttongrp} onClick={handleprintThree}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("pdfclienterrorforward") && (
                                                <>
                                                    <Button sx={userStyle.buttongrp} onClick={() => { setIsPdfFilterOpenThree(true); }}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("imageclienterrorforward") && (
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
                                                maindatas={clientErrorsThree}
                                                setSearchedString={setSearchedStringThree}
                                                searchQuery={searchQueryThree}
                                                setSearchQuery={setSearchQueryThree}
                                                paginated={false}
                                                totalDatas={clientErrorsThree}
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
                                            itemsList={clientErrorsThree}
                                            pagenamecheck={'Client Error Forward'}
                                        />
                                    </>
                                )}
                            </Box><br />
                        </> : null}
                    {/* Fourth Tabale  */}
                    {tableCheck?.includes('Recheck Employee Client Error Waiver Request List') ?
                        <Box sx={userStyle.container}>
                            {/* ******************************************************EXPORT Buttons****************************************************** */}
                            <Grid item xs={8}>
                                <Typography sx={userStyle.importheadtext}>Recheck Employee Client Error Waiver Request List</Typography>
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
                                            <MenuItem value={clientErrorsFour?.length}>All</MenuItem>
                                        </Select>
                                    </Box>
                                </Grid>
                                <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center", }}>
                                    <Box>
                                        {isUserRoleCompare?.includes("excelclienterrorforward") && (
                                            <>
                                                <Button onClick={(e) => { setIsFilterOpenFour(true); setFormat("xl"); }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("csvclienterrorforward") && (
                                            <>
                                                <Button onClick={(e) => { setIsFilterOpenFour(true); setFormat("csv"); }} sx={userStyle.buttongrp} ><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("printclienterrorforward") && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={handleprintFour} >&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("pdfclienterrorforward") && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={() => { setIsPdfFilterOpenFour(true); }}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("imageclienterrorforward") && (
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
                                            maindatas={clientErrorsFour}
                                            setSearchedString={setSearchedStringFour}
                                            searchQuery={searchQueryFour}
                                            setSearchQuery={setSearchQueryFour}
                                            paginated={false}
                                            totalDatas={clientErrorsFour}
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
                                        itemsList={clientErrorsFour}
                                        pagenamecheck={'Client Error Forward'}
                                    />
                                </>
                            )}
                        </Box> : null}
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
                            <TableCell>Client Amount</TableCell>
                            <TableCell>per %</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Request Reason</TableCell>
                            <TableCell>Forward Reason</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody align="left">
                        {rowDataTableThree &&
                            rowDataTableThree.map((row, index) => (
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
                                    <TableCell>{row.requestreason}</TableCell>
                                    <TableCell>{row.forwardreason}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* print layout */}
            <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRefFour}>
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
                            <TableCell>Client Amount</TableCell>
                            <TableCell>per %</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Request Reason</TableCell>
                            <TableCell>Forward Reason</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody align="left">
                        {rowDataTableFour &&
                            rowDataTableFour.map((row, index) => (
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
                                    <TableCell>{row.requestreason}</TableCell>
                                    <TableCell>{row.forwardreason}</TableCell>
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

export default ResentForwardEmployee;