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

const RecheckReasonCellThree = ({ rowId, currentRecheckReasonThree, onSave, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert, setPopupContent, setPopupSeverity, handleClickOpenPopup, auth, fetchAllPenaltyError, rowData }) => {
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
                let res = await axios.post(SERVICE.PENALTYDAYUPLOAD_UPDATE_FOR_OVERALL, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    date: rowData.actualdate,
                    uploaddata_id: rowId,
                    history: [
                        // ...rowData.history,
                        {
                            tablename: 'Waiver Employee Forward_Resent',
                            date: date,
                            time: time,
                            status: "Recheck",
                            reason: localRecheckReasonThree,
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

const ForwardReasonCellThree = ({ rowId, currentForwardReasonThree, onSave, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert, setPopupContent, setPopupSeverity, handleClickOpenPopup, auth, fetchAllPenaltyError, rowData }) => {
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
                let res = await axios.post(SERVICE.PENALTYDAYUPLOAD_UPDATE_FOR_OVERALL, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    date: rowData.actualdate,
                    uploaddata_id: rowId,
                    history: [
                        // ...rowData.history,
                        {
                            tablename: 'Waiver Employee Forward_Resent',
                            date: date,
                            time: time,
                            status: "Forward",
                            reason: localForwardReasonThree,
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
                <Button sx={{ textTransform: 'capitalize', backgroundColor: '#007bff' }} variant="contained" size="small" onClick={handleSaveClick}>Forward</Button>
            </Grid>
        </Grid>
    );
};

const ModeCellThree = ({ rowId, currentModeReason, onSave, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert, setPopupContent, setPopupSeverity, handleClickOpenPopup, auth, fetchAllPenaltyError, rowData }) => {
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
                let res = await axios.post(SERVICE.PENALTYDAYUPLOAD_UPDATE_FOR_OVERALL, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    date: rowData.actualdate,
                    uploaddata_id: rowId,
                    history: [
                        // ...rowData.history,
                        {
                            tablename: 'Waiver Employee Forward_Resent',
                            date: date,
                            time: time,
                            status: localModeReason,
                            reason: "",
                            mode: "Mode",
                        }
                    ]
                });
                await fetchAllPenaltyError();
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

const RecheckReasonCellFour = ({ rowId, currentRecheckReasonFour, onSave, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert, setPopupContent, setPopupSeverity, handleClickOpenPopup, auth, fetchAllPenaltyError, rowData }) => {
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
                let res = await axios.post(SERVICE.PENALTYDAYUPLOAD_UPDATE_FOR_OVERALL, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    date: rowData.actualdate,
                    uploaddata_id: rowId,
                    history: [
                        // ...rowData.history,
                        {
                            tablename: 'Waiver Employee Forward_Recheck',
                            date: date,
                            time: time,
                            status: "Recheck",
                            reason: localRecheckReasonFour,
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

const ForwardReasonCellFour = ({ rowId, currentForwardReasonFour, onSave, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert, setPopupContent, setPopupSeverity, handleClickOpenPopup, auth, fetchAllPenaltyError, rowData }) => {
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
                let res = await axios.post(SERVICE.PENALTYDAYUPLOAD_UPDATE_FOR_OVERALL, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    date: rowData.actualdate,
                    uploaddata_id: rowId,
                    history: [
                        // ...rowData.history,
                        {
                            tablename: 'Waiver Employee Forward_Recheck',
                            date: date,
                            time: time,
                            status: "Forward",
                            reason: localForwardReasonFour,
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
                <Button sx={{ textTransform: 'capitalize', backgroundColor: '#007bff' }} variant="contained" size="small" onClick={handleSaveClick}>Forward</Button>
            </Grid>
        </Grid>
    );
};

const ModeCellFour = ({ rowId, currentModeReason, onSave, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert, setPopupContent, setPopupSeverity, handleClickOpenPopup, auth, fetchAllPenaltyError, rowData }) => {
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
                let res = await axios.post(SERVICE.PENALTYDAYUPLOAD_UPDATE_FOR_OVERALL, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    date: rowData.actualdate,
                    uploaddata_id: rowId,
                    history: [
                        // ...rowData.history,
                        {
                            tablename: 'Waiver Employee Forward_Recheck',
                            date: date,
                            time: time,
                            status: localModeReason,
                            reason: "",
                            mode: "Mode",
                        }
                    ]
                });
                await fetchAllPenaltyError();
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

function RecheckForwardEmployee({ waiverEmployeesThree, waiverEmployeesFour, fetchAllPenaltyError, loader, tableCheck, setFilteredRowDataThree, filteredChangesThree, setFilteredChangesThree, filteredRowDataThree, setIsHandleChangeThree, isHandleChangeThree, setSearchedStringThree, searchedStringThree, setFilteredRowDataFour, filteredChangesFour, setFilteredChangesFour, filteredRowDataFour, setIsHandleChangeFour, isHandleChangeFour, setSearchedStringFour, searchedStringFour }) {

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
        history: true,
        monthhistory: true,
        requestreason: true,
        forwardreason: true,
        request: true,
        forward: true,
        recheck: true,
        mode: true,
        actions: true,
    };
    const [columnVisibilityThree, setColumnVisibilityThree] = useState(initialColumnVisibilityThree);

    // Show All Columns & Manage Columns second Table
    const initialColumnVisibilityFour = {
        serialNumber: true,
        level: true,
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
        history: true,
        monthhistory: true,
        requestreason: true,
        forwardreason: true,
        request: true,
        forward: true,
        recheck: true,
        mode: true,
        actions: true,
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
        { field: "level", headerName: "Level", flex: 0, width: 100, hide: !columnVisibilityThree.level, },
        { field: "name", headerName: "Employee Name", flex: 0, width: 250, hide: !columnVisibilityThree.name, pinned: 'left', lockPinned: true, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "empcode", headerName: "Employee Code", flex: 0, width: 150, hide: !columnVisibilityThree.empcode, pinned: 'left', lockPinned: true, },
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
        {
            field: "requestreason", headerName: "Request", flex: 0, width: 250, hide: !columnVisibilityThree.requestreason, cellStyle: cellStyles, headerClass: 'header-wrap',
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
            field: "forwardreason", headerName: "Forward", flex: 0, width: 250, hide: !columnVisibilityThree.forwardreason, cellStyle: cellStyles, headerClass: 'header-wrap',
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
                        auth={auth} fetchAllPenaltyError={fetchAllPenaltyError} rowData={params.data}
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
                        auth={auth} fetchAllPenaltyError={fetchAllPenaltyError} rowData={params.data}
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
                        auth={auth} fetchAllPenaltyError={fetchAllPenaltyError} rowData={params.data}
                    />
                </Grid>
            ),
        },
    ];

    // second table
    const columnDataTableFour = [
        { field: "serialNumber", headerName: "SNo", flex: 0, width: 75, hide: !columnVisibilityFour.serialNumber, pinned: 'left', lockPinned: true, },
        { field: "level", headerName: "Level", flex: 0, width: 100, hide: !columnVisibilityFour.level, },
        { field: "name", headerName: "Employee Name", flex: 0, width: 250, hide: !columnVisibilityFour.name, pinned: 'left', lockPinned: true, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "empcode", headerName: "Employee Code", flex: 0, width: 150, hide: !columnVisibilityFour.empcode, pinned: 'left', lockPinned: true, },
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
        {
            field: "requestreason", headerName: "Request", flex: 0, width: 250, hide: !columnVisibilityFour.requestreason, cellStyle: cellStyles, headerClass: 'header-wrap',
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
            field: "forwardreason", headerName: "Forward", flex: 0, width: 250, hide: !columnVisibilityFour.forwardreason, cellStyle: cellStyles, headerClass: 'header-wrap',
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
                        auth={auth} fetchAllPenaltyError={fetchAllPenaltyError} rowData={params.data}
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
                        auth={auth} fetchAllPenaltyError={fetchAllPenaltyError} rowData={params.data}
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
    const fileNameThree = "ReCheck Forward Employee Waiver Request List";
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
        const headers = ['SNo', 'Level', 'Employee Name', 'Employee Code', 'Date', 'Vendor Name', 'Process', 'Total Field', 'Auto Error', 'Manual Error', 'Upload Error', 'Moved', 'Not Upload', 'Penalty', 'Non Penalty', 'Bulk Upload', 'Bulk Keying',
            'Edited1', 'Edited2', 'Edited3', 'Edited4', 'Reject1', 'Reject2', 'Reject3', 'Reject4', 'Not Validate', 'Valid Error', 'Waiver %', 'Emp-Waiver', 'Net Error',
            'per%', 'Percentage', 'Amount', 'Request', 'Forward'];

        let data = [];
        let resultdata = (filteredChangesThree !== null ? filteredRowDataThree : rowDataTableThree) ?? [];

        if (isfilter === "filtered") {
            data = resultdata.map((row, index) => {
                const requestReasons = row.requestreason ? row.requestreason.split('\n').join('\r\n') : '';
                const forwardReasons = row.forwardreason ? row.forwardreason.split('\n').join('\r\n') : '';
                return [
                    index + 1,
                    row.level,
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
                    requestReasons,
                    forwardReasons
                ];
            });
        } else if (isfilter === "overall") {
            data = waiverEmployeesThree.map((row, index) => {
                const requestReasons = row.requestreason ? row.requestreason.split('\n').join('\r\n') : '';
                const forwardReasons = row.forwardreason ? row.forwardreason.split('\n').join('\r\n') : '';
                return [
                    index + 1,
                    row.level,
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

    const fileNameFour = "ReCheck Employee Waiver Request List";
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
        const headers = ['SNo', 'Level', 'Employee Name', 'Employee Code', 'Date', 'Vendor Name', 'Process', 'Total Field', 'Auto Error', 'Manual Error', 'Upload Error', 'Moved', 'Not Upload', 'Penalty', 'Non Penalty', 'Bulk Upload', 'Bulk Keying',
            'Edited1', 'Edited2', 'Edited3', 'Edited4', 'Reject1', 'Reject2', 'Reject3', 'Reject4', 'Not Validate', 'Valid Error', 'Waiver %', 'Emp-Waiver', 'Net Error',
            'per%', 'Percentage', 'Amount', 'Request', 'Forward'];

        let data = [];
        let resultdata = (filteredChangesFour !== null ? filteredRowDataFour : rowDataTableFour) ?? [];

        if (isfilter === "filtered") {
            data = resultdata.map((row, index) => {
                const requestReasons = row.requestreason ? row.requestreason.split('\n').join('\r\n') : '';
                const forwardReasons = row.forwardreason ? row.forwardreason.split('\n').join('\r\n') : '';
                return [
                    index + 1,
                    row.level,
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
                    requestReasons,
                    forwardReasons
                ];
            });
        } else if (isfilter === "overall") {
            data = waiverEmployeesFour.map((row, index) => {
                const requestReasons = row.requestreason ? row.requestreason.split('\n').join('\r\n') : '';
                const forwardReasons = row.forwardreason ? row.forwardreason.split('\n').join('\r\n') : '';
                return [
                    index + 1,
                    row.level,
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
        documentTitle: "ReCheck Forward Employee Waiver Request List",
        pageStyle: "print",
    });

    //print...
    const componentRefFour = useRef();
    const handleprintFour = useReactToPrint({
        content: () => componentRefFour.current,
        documentTitle: "ReCheck Employee Waiver Request List",
        pageStyle: "print",
    });

    const downloadPdfThree = (isfilter) => {
        const doc = new jsPDF({ orientation: 'landscape' });

        // Define the table headers
        const headers = ['SNo', 'Level', 'Employee Name', 'Employee Code', 'Date', 'Vendor Name', 'Process', 'Total Field', 'Auto Error', 'Manual Error', 'Upload Error', 'Moved', 'Not Upload', 'Penalty', 'Non Penalty', 'Bulk Upload', 'Bulk Keying',
            'Edited1', 'Edited2', 'Edited3', 'Edited4', 'Reject1', 'Reject2', 'Reject3', 'Reject4', 'Not Validate', 'Valid Error', 'Waiver %', 'Emp-Waiver', 'Net Error',
            'per%', 'Percentage', 'Amount', 'Request', 'Forward'];

        let data = [];
        let resultdata = (filteredChangesThree !== null ? filteredRowDataThree : rowDataTableThree) ?? [];

        if (isfilter === "filtered") {
            data = resultdata.map((row, index) => {
                const requestReasons = row.requestreason ? row.requestreason.split('\n').join('\r\n') : '';
                const forwardReasons = row.forwardreason ? row.forwardreason.split('\n').join('\r\n') : '';
                return [
                    index + 1,
                    row.level,
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
                    requestReasons,
                    forwardReasons
                ];
            });
        } else if (isfilter === "overall") {
            data = waiverEmployeesThree.map((row, index) => {
                const requestReasons = row.requestreason ? row.requestreason.split('\n').join('\r\n') : '';
                const forwardReasons = row.forwardreason ? row.forwardreason.split('\n').join('\r\n') : '';
                return [
                    index + 1,
                    row.level,
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

        doc.save("ReCheck Forward Employee Waiver Request List.pdf");
    };

    const downloadPdfFour = (isfilter) => {
        const doc = new jsPDF({ orientation: 'landscape' });

        // Define the table headers
        const headers = ['SNo', 'Level', 'Employee Name', 'Employee Code', 'Date', 'Vendor Name', 'Process', 'Total Field', 'Auto Error', 'Manual Error', 'Upload Error', 'Moved', 'Not Upload', 'Penalty', 'Non Penalty', 'Bulk Upload', 'Bulk Keying',
            'Edited1', 'Edited2', 'Edited3', 'Edited4', 'Reject1', 'Reject2', 'Reject3', 'Reject4', 'Not Validate', 'Valid Error', 'Waiver %', 'Emp-Waiver', 'Net Error',
            'per%', 'Percentage', 'Amount', 'Request', 'Forward'];

        let data = [];
        let resultdata = (filteredChangesFour !== null ? filteredRowDataFour : rowDataTableFour) ?? [];

        if (isfilter === "filtered") {
            data = resultdata.map((row, index) => {
                const requestReasons = row.requestreason ? row.requestreason.split('\n').join('\r\n') : '';
                const forwardReasons = row.forwardreason ? row.forwardreason.split('\n').join('\r\n') : '';
                return [
                    index + 1,
                    row.level,
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
                    requestReasons,
                    forwardReasons
                ];
            });
        } else if (isfilter === "overall") {
            data = waiverEmployeesFour.map((row, index) => {
                const requestReasons = row.requestreason ? row.requestreason.split('\n').join('\r\n') : '';
                const forwardReasons = row.forwardreason ? row.forwardreason.split('\n').join('\r\n') : '';
                return [
                    index + 1,
                    row.level,
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

        doc.save("ReCheck Employee Waiver Request List.pdf");
    };

    //image
    const handleCaptureImageThree = () => {
        if (gridRefTableImgThree.current) {
            domtoimage.toBlob(gridRefTableImgThree.current)
                .then((blob) => {
                    saveAs(blob, "ReCheck Forward Employee Waiver Request List.png");
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
                    saveAs(blob, "ReCheck Employee Waiver Request List.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    return (
        <Box>
            <Headtitle title={"Waiver Employee Forward"} />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lwaiveremployeeforward") && (
                <>
                    {tableCheck?.includes('ReCheck Forward Employee Waiver Request List') ?
                        <>
                            <Box sx={userStyle.container}>
                                {/* ******************************************************EXPORT Buttons****************************************************** */}
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext}>ReCheck Forward Employee Waiver Request List</Typography>
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
                                            {isUserRoleCompare?.includes("excelwaiveremployeeforward") && (
                                                <>
                                                    <Button onClick={(e) => { setIsFilterOpenThree(true); setFormat("xl"); }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("csvwaiveremployeeforward") && (
                                                <>
                                                    <Button onClick={(e) => { setIsFilterOpenThree(true); setFormat("csv"); }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("printwaiveremployeeforward") && (
                                                <>
                                                    <Button sx={userStyle.buttongrp} onClick={handleprintThree}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("pdfwaiveremployeeforward") && (
                                                <>
                                                    <Button sx={userStyle.buttongrp} onClick={() => { setIsPdfFilterOpenThree(true); }}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("imagewaiveremployeeforward") && (
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
                                            pagenamecheck={'Client Error Forward'}
                                        />
                                    </>
                                )}
                            </Box><br />
                        </> : null}
                    {/* Fourth Tabale  */}
                    {tableCheck?.includes('ReCheck Employee Waiver Request List') ?
                        <Box sx={userStyle.container}>
                            {/* ******************************************************EXPORT Buttons****************************************************** */}
                            <Grid item xs={8}>
                                <Typography sx={userStyle.importheadtext}>ReCheck Employee Waiver Request List</Typography>
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
                                        {isUserRoleCompare?.includes("excelwaiveremployeeforward") && (
                                            <>
                                                <Button onClick={(e) => { setIsFilterOpenFour(true); setFormat("xl"); }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("csvwaiveremployeeforward") && (
                                            <>
                                                <Button onClick={(e) => { setIsFilterOpenFour(true); setFormat("csv"); }} sx={userStyle.buttongrp} ><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("printwaiveremployeeforward") && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={handleprintFour} >&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("pdfwaiveremployeeforward") && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={() => { setIsPdfFilterOpenFour(true); }}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("imagewaiveremployeeforward") && (
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
                            <TableCell>Request</TableCell>
                            <TableCell>Forward</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody align="left">
                        {rowDataTableThree &&
                            rowDataTableThree.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{row.level}</TableCell>
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
                            <TableCell>Request</TableCell>
                            <TableCell>Forward</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody align="left">
                        {rowDataTableFour &&
                            rowDataTableFour.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{row.level}</TableCell>
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

export default RecheckForwardEmployee;