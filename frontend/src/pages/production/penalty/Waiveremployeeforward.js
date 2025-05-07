import React, { useContext, useEffect, useRef, useState } from "react";
import { Box, Button, FormControl, Grid, MenuItem, Popover, Select, Typography, TextareaAutosize, CircularProgress, Dialog, DialogContent, DialogActions, IconButton, Table, Paper, TableContainer, TableHead, TableRow, TableBody, TableCell } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import LoadingButton from "@mui/lab/LoadingButton";
import Selects from "react-select";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CloseIcon from "@mui/icons-material/Close";
import jsPDF from "jspdf";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import axios from "axios";
import { saveAs } from "file-saver";
import "jspdf-autotable";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { MultiSelect } from "react-multi-select-component";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../../components/Errorhandling";
import Headtitle from "../../../components/Headtitle";
import { AuthContext, UserRoleAccessContext } from "../../../context/Appcontext";
import { userStyle, colourStyles } from "../../../pageStyle";
import { SERVICE } from "../../../services/Baseservice";
import { ThreeDots } from "react-loader-spinner";
import AlertDialog from "../../../components/Alert";
import MessageAlert from "../../../components/MessageAlert";
import PageHeading from "../../../components/PageHeading";
import AggregatedSearchBar from "../../../components/AggregatedSearchBar";
import AggridTable from "../../../components/AggridTable";
import domtoimage from 'dom-to-image';
import RecheckForwardEmployee from "./Recheckforwardemployee.js";
import ManageColumnsContent from "../../../components/ManageColumn";
import moment from 'moment';

const RecheckReasonCell = ({ rowId, currentRecheckReason, onSave, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert, setPopupContent, setPopupSeverity, handleClickOpenPopup, auth, fetchAllPenaltyError, rowData }) => {
    const [localRecheckReason, setLocalRecheckReason] = useState('');

    const today = new Date();
    const date = today.toISOString().split('T')[0];
    const time = today.toTimeString().split(' ')[0];

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
                            tablename: 'Waiver Employee Forward_NotForward',
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
                <Button sx={{ textTransform: 'capitalize' }} variant="contained" color="error" size="small" onClick={handleSaveClick}>Recheck</Button>
            </Grid>
        </Grid>
    );
};

const ForwardReasonCell = ({ rowId, currentForwardReason, onSave, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert, setPopupContent, setPopupSeverity, handleClickOpenPopup, auth, fetchAllPenaltyError, rowData }) => {
    const [localForwardReason, setLocalForwardReason] = useState('');

    const today = new Date();
    const date = today.toISOString().split('T')[0];
    const time = today.toTimeString().split(' ')[0];

    const handleSaveClick = async () => {
        onSave(localForwardReason);
        if (localForwardReason === '') {
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
                            tablename: 'Waiver Employee Forward_NotForward',
                            date: date,
                            time: time,
                            status: "Forward",
                            reason: localForwardReason,
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
                        value={localForwardReason}
                        placeholder="Forward Reason"
                        onChange={(e) => { setLocalForwardReason(e.target.value); }}
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

const ModeCell = ({ rowId, currentModeReason, onSave, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert, setPopupContent, setPopupSeverity, handleClickOpenPopup, auth, fetchAllPenaltyError, rowData }) => {
    const [localModeReason, setLocalModeReason] = useState('NaN');
    const modeOption = [
        { label: "NaN", value: "NaN" },
        { label: "Approved", value: "Approved" },
        { label: "Reject", value: "Reject" },
    ]

    const today = new Date();
    const date = today.toISOString().split('T')[0];
    const time = today.toTimeString().split(' ')[0];

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
                            tablename: 'Waiver Employee Forward_NotForward',
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

const RecheckReasonCellTwo = ({ rowId, currentRecheckReason, onSave, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert, setPopupContent, setPopupSeverity, handleClickOpenPopup, auth, fetchAllPenaltyError, rowData }) => {
    const [localRecheckReason, setLocalRecheckReason] = useState('');

    const today = new Date();
    const date = today.toISOString().split('T')[0];
    const time = today.toTimeString().split(' ')[0];

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
                            tablename: 'Waiver Employee Forward_Forward',
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
                <Button sx={{ textTransform: 'capitalize' }} variant="contained" color="error" size="small" onClick={handleSaveClick}>Recheck</Button>
            </Grid>
        </Grid>
    );
};

const ForwardReasonCellTwo = ({ rowId, currentForwardReason, onSave, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert, setPopupContent, setPopupSeverity, handleClickOpenPopup, auth, fetchAllPenaltyError, rowData }) => {
    const [localForwardReason, setLocalForwardReason] = useState('');

    const today = new Date();
    const date = today.toISOString().split('T')[0];
    const time = today.toTimeString().split(' ')[0];

    const handleSaveClick = async () => {
        onSave(localForwardReason);
        if (localForwardReason === '') {
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
                            tablename: 'Waiver Employee Forward_Forward',
                            date: date,
                            time: time,
                            status: "Forward",
                            reason: localForwardReason,
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
                        value={localForwardReason}
                        placeholder="Forward Reason"
                        onChange={(e) => { setLocalForwardReason(e.target.value); }}
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

const ModeCellTwo = ({ rowId, currentModeReason, onSave, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert, setPopupContent, setPopupSeverity, handleClickOpenPopup, auth, fetchAllPenaltyError, rowData }) => {
    const [localModeReason, setLocalModeReason] = useState('NaN');
    const modeOption = [
        { label: "NaN", value: "NaN" },
        { label: "Approved", value: "Approved" },
        { label: "Reject", value: "Reject" },
    ]

    const today = new Date();
    const date = today.toISOString().split('T')[0];
    const time = today.toTimeString().split(' ')[0];

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
                            tablename: 'Waiver Employee Forward_Forward',
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

function WaiverEmployeeForward() {

    let cellStyles = {
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        lineHeight: 'normal',
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
    const [waiverEmployees, setWaiverEmployees] = useState([]);
    const [waiverEmployeestwo, setWaiverEmployeestwo] = useState([]);
    const [waiverEmployeesThree, setWaiverEmployeesThree] = useState([]);
    const [waiverEmployeesFour, setWaiverEmployeesFour] = useState([]);
    const [items, setItems] = useState([]);
    const [itemstwo, setItemstwo] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedRowstwo, setSelectedRowstwo] = useState([]);
    const [loadingdeloverall, setloadingdeloverall] = useState(false);
    const [recheckReasons, setRecheckReasons] = useState({});
    const [forwardReasons, setForwardReasons] = useState({});
    const [rowMode, setRowMode] = useState({});
    const [recheckReasonstwo, setRecheckReasonstwo] = useState({});
    const [forwardReasonstwo, setForwardReasonstwo] = useState({});
    const [rowModetwo, setRowModetwo] = useState({});
    const [loader, setLoader] = useState(false);

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
                data.subpagename === "Waiver Employee Forward" &&
                data.subsubpagename === ""
        )?.listpageaccessmode || "Overall";

    const tableOptions = [
        { label: "Not Forward Employee Waiver Request List", value: "Not Forward Employee Waiver Request List" },
        { label: "Forward Employee Waiver Request List", value: "Forward Employee Waiver Request List" },
        { label: "ReCheck Forward Employee Waiver Request List", value: "ReCheck Forward Employee Waiver Request List" },
        { label: "ReCheck Employee Waiver Request List", value: "ReCheck Employee Waiver Request List" }
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

    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
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
    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

    // Show All Columns & Manage Columns second Table
    const initialColumnVisibilitytwo = {
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
            pagename: String("Waiver Employee Forward"),
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

    //get all project.
    const fetchAllPenaltyError = async () => {
        setPageName(!pageName);
        setLoader(true);
        try {
            let res = await axios.post(SERVICE.WAIVEREMPLOYEE_FORWARD_HIERARCHY, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                hierachy: modeselection.value,
                sector: sectorSelection.value,
                username: isUserRoleAccess?.companyname,
                listpageaccessmode: listpageaccessby,
                pagename: "menuwaiveremployeeforward",
            });
            console.log(res?.data, "resdata")
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

            if (valueTable?.includes('Not Forward Employee Waiver Request List')) {
                let firstTableData = res?.data?.resultAccessFilter?.filter(data => data.history?.length === 1)
                    ?.map((item, index) => {
                        const sentData = item.history?.find(data => data.status === "Sent");
                        return {
                            ...item,
                            id: item._id,
                            serialNumber: index + 1,
                            actualdate: item.date,
                            date: moment(item.date).format('DD/MM/YYYY'),
                            amount: item.amount,
                            mode: 'NaN',
                            requestreason: sentData ? sentData.reason : '',
                            forwardreason: '',
                        }
                    });
                setWaiverEmployees(firstTableData?.map((item, index) => ({ ...item, serialNumber: index + 1, })));
                // setFilteredRowData(firstTableData?.map((item, index) => ({ ...item, serialNumber: index + 1, })));
                setTableCheck(valueTable);
            }

            if (valueTable?.includes('Forward Employee Waiver Request List')) {
                let secondTableData = res?.data?.resultAccessFilter
                    ?.map((item) => {
                        const sentData = item.history?.find(data => data.status === "Sent");
                        const forwardData = item.history?.find(data => data.status === "Forward");
                        // const relevantHistory = item.history.filter(val =>
                        //     ["Recheck", "Sent Recheck", "Forward"].includes(val.status)
                        // );

                        // const reasons = relevantHistory.map(val => val.reason).join('\n');

                        if (item.history[item.history.length - 1]?.status === "Forward" && item.history[item.history.length - 1]?.tablename !== "Waiver Employee Forward_Forward") {
                            return {
                                ...item,
                                id: item._id,
                                actualdate: item.date,
                                date: moment(item.date).format('DD/MM/YYYY'),
                                requestreason: sentData ? sentData.reason : '',
                                forwardreason: forwardData ? forwardData.reason : '',
                                // forwardreason: reasons,
                            }
                        }
                        return null;
                    }).filter(Boolean);
                setWaiverEmployeestwo(secondTableData?.map((item, index) => ({ ...item, serialNumber: index + 1, })));
                // setFilteredRowDatatwo(secondTableData?.map((item, index) => ({ ...item, serialNumber: index + 1, })));
                setTableCheck(valueTable);
            }

            if (valueTable?.includes('ReCheck Forward Employee Waiver Request List')) {
                // console.log(res?.data?.resultAccessFilter)
                let thirdTableData = res?.data?.resultAccessFilter?.map((item) => {

                    const relevantRequestHistory = item.history.filter(val =>
                        ["Sent", "Recheck"].includes(val.status)
                    );

                    const relevantForwardHistory = item.history.filter(val =>
                        ["Forward"].includes(val.status)
                    );

                    const requestReasons = relevantRequestHistory.map(val => val.reason).join('\n');
                    const forwardReasons = relevantForwardHistory.map(val => val.reason).join('\n');
                    // console.log(item.history[item.history.length - 1]?.status, 'item.history[item.history.length - 1]?.status')
                    if (item.history[item.history.length - 1]?.status === "Sent Recheck") {
                        return {
                            ...item,
                            id: item._id,
                            actualdate: item.date,
                            date: moment(item.date).format('DD/MM/YYYY'),
                            mode: 'NaN',
                            requestreason: requestReasons,
                            forwardreason: forwardReasons ? forwardReasons : 'null',
                        };
                    }
                    return null;
                }).filter(Boolean);
                setWaiverEmployeesThree(thirdTableData?.map((item, index) => ({ ...item, serialNumber: index + 1, })));
                // setFilteredRowDataThree(thirdTableData?.map((item, index) => ({ ...item, serialNumber: index + 1, })));
                // console.log(thirdTableData);
                setTableCheck(valueTable);
            }

            if (valueTable?.includes('ReCheck Employee Waiver Request List')) {
                let fourthTableData = res?.data?.resultAccessFilter
                    ?.map((item) => {
                        const sentData = item.history?.find(data => data.status === "Sent");
                        const relevantHistory = item.history.filter(val =>
                            ["Recheck", "Sent Recheck"].includes(val.status)
                        );

                        const reasons = relevantHistory.map(val => val.reason).join('\n');

                        if (item.history[item.history.length - 1]?.status === "Recheck" && item.history[item.history.length - 1]?.tablename !== "Waiver Employee Forward_Recheck") {
                            return {
                                ...item,
                                id: item._id,
                                actualdate: item.date,
                                date: moment(item.date).format('DD/MM/YYYY'),
                                mode: 'NaN',
                                requestreason: sentData ? sentData.reason : '',
                                forwardreason: reasons,
                            }
                        }
                        return null;
                    }).filter(Boolean);
                setWaiverEmployeesFour(fourthTableData?.map((item, index) => ({ ...item, serialNumber: index + 1, })));
                // setFilteredRowDataFour(fourthTableData?.map((item, index) => ({ ...item, serialNumber: index + 1, })));
                setTableCheck(valueTable);
            }
            setLoader(false);
        } catch (err) {
            console.log(err.message)
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
        } else {
            fetchAllPenaltyError();
        }
    };

    const handleClear = () => {
        setPageName(!pageName);
        setSelectedTable([]);
        setValueTable([]);
        setTableCheck([]);
        setSectorSelection({ label: "Primary", value: "Primary" });
        setModeSelection({ label: "My Hierarchy List", value: "myhierarchy" });
        setWaiverEmployees([]);
        setWaiverEmployeestwo([]);
        setWaiverEmployeesThree([]);
        setWaiverEmployeesFour([]);
        setItems([]);
        setItemstwo([]);
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
    };

    const addSerialNumber = (datas) => {
        setItems(datas);
    };

    useEffect(() => {
        addSerialNumber(waiverEmployees);
    }, [waiverEmployees]);

    // second Table
    const addSerialNumbertwo = (datas) => {
        setItemstwo(datas);
    };

    useEffect(() => {
        addSerialNumbertwo(waiverEmployeestwo);
    }, [waiverEmployeestwo]);

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
        { field: "level", headerName: "Level", flex: 0, width: 100, hide: !columnVisibility.level, pinned: 'left', lockPinned: true, },
        { field: "name", headerName: "Employee Name", flex: 0, width: 250, hide: !columnVisibility.name, pinned: 'left', lockPinned: true, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "empcode", headerName: "Employee Code", flex: 0, width: 150, hide: !columnVisibility.empcode, pinned: 'left', lockPinned: true, },
        { field: "date", headerName: "Date", flex: 0, width: 150, hide: !columnVisibility.date, },
        { field: "vendorname", headerName: "Vendor Name", flex: 0, width: 150, hide: !columnVisibility.vendorname, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "process", headerName: "Process", flex: 0, width: 150, hide: !columnVisibility.process, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "totalfield", headerName: "Total Field", flex: 0, width: 120, hide: !columnVisibility.totalfield, },
        { field: "autoerror", headerName: "Auto Error", flex: 0, width: 120, hide: !columnVisibility.autoerror, },
        { field: "manualerror", headerName: "Manual Error", flex: 0, width: 120, hide: !columnVisibility.manualerror, },
        { field: "uploaderror", headerName: "Upload Error", flex: 0, width: 120, hide: !columnVisibility.uploaderror, },
        { field: "moved", headerName: "Moved", flex: 0, width: 150, hide: !columnVisibility.moved, },
        { field: "notupload", headerName: "Not Upload", flex: 0, width: 150, hide: !columnVisibility.notupload, },
        { field: "penalty", headerName: "Penalty", flex: 0, width: 100, hide: !columnVisibility.penalty, },
        { field: "nonpenalty", headerName: "Non Penalty", flex: 0, width: 120, hide: !columnVisibility.nonpenalty, },
        { field: "bulkupload", headerName: "Bulk Upload", flex: 0, width: 120, hide: !columnVisibility.bulkupload, },
        { field: "bulkkeying", headerName: "Bulk Keying", flex: 0, width: 120, hide: !columnVisibility.bulkkeying, },
        { field: "edited1", headerName: "Edited1", flex: 0, width: 100, hide: !columnVisibility.edited1, },
        { field: "edited2", headerName: "Edited2", flex: 0, width: 100, hide: !columnVisibility.edited2, },
        { field: "edited3", headerName: "Edited3", flex: 0, width: 100, hide: !columnVisibility.edited3, },
        { field: "edited4", headerName: "Edited4", flex: 0, width: 100, hide: !columnVisibility.edited4, },
        { field: "reject1", headerName: "Reject1", flex: 0, width: 100, hide: !columnVisibility.reject1, },
        { field: "reject2", headerName: "Reject2", flex: 0, width: 100, hide: !columnVisibility.reject2, },
        { field: "reject3", headerName: "Reject3", flex: 0, width: 100, hide: !columnVisibility.reject3, },
        { field: "reject4", headerName: "Reject4", flex: 0, width: 100, hide: !columnVisibility.reject4, },
        { field: "notvalidate", headerName: "Not Validate", flex: 0, width: 120, hide: !columnVisibility.notvalidate, },
        { field: "validateerror", headerName: "Valid Error", flex: 0, width: 120, hide: !columnVisibility.validateerror, },
        { field: "waiver", headerName: "Waiver %", flex: 0, width: 120, hide: !columnVisibility.waiver, },
        { field: "waivererror", headerName: "Emp-Waiver", flex: 0, width: 120, hide: !columnVisibility.waivererror, },
        { field: "neterror", headerName: "Net Error", flex: 0, width: 120, hide: !columnVisibility.neterror, },
        { field: "per", headerName: "per%", flex: 0, width: 120, hide: !columnVisibility.per, },
        { field: "percentage", headerName: "Percentage", flex: 0, width: 120, hide: !columnVisibility.percentage, },
        { field: "amount", headerName: "Amount", flex: 0, width: 120, hide: !columnVisibility.amount, },
        { field: "requestreason", headerName: "Request", flex: 0, width: 250, hide: !columnVisibility.requestreason, cellStyle: cellStyles, headerClass: 'header-wrap', },
        {
            field: "forwardreason", headerName: "Forward", flex: 0, width: 250, hide: !columnVisibility.forwardreason, cellStyle: cellStyles, headerClass: 'header-wrap',
            cellRenderer: (params) => {
                const forwardReasons = params.data.forwardreason ? params.data.forwardreason.split('\n') : [];
                // console.log(params.data.forwardreason, forwardReasons)
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
            field: "actions", headerName: "Action", flex: 0, width: 350, hide: !columnVisibility.actions, sortable: false, filter: false,
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
                        auth={auth} fetchAllPenaltyError={fetchAllPenaltyError} rowData={params.data}
                    />
                </Grid>
            ),
        },
        {
            field: "mode", headerName: "Mode", flex: 0, width: 350, hide: !columnVisibility.mode, sortable: false, filter: false,
            cellRenderer: (params) => (
                <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
                    <ModeCell
                        rowId={params.data.id}
                        currentModeReason={rowMode[params.data.id] || "NaN"}
                        onSave={(rejectreason2) => {
                            setRowMode((prev) => ({
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
            field: "actions", headerName: "Action", flex: 0, width: 350, hide: !columnVisibility.actions, sortable: false, filter: false,
            cellRenderer: (params) => (
                <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
                    <ForwardReasonCell
                        rowId={params.data.id}
                        currentForwardReason={forwardReasons[params.data.id] || ""}
                        onSave={(rejectreason2) => {
                            setForwardReasons((prev) => ({
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
    const columnDataTabletwo = [
        { field: "serialNumber", headerName: "SNo", flex: 0, width: 75, hide: !columnVisibilitytwo.serialNumber, pinned: 'left', lockPinned: true, },
        { field: "level", headerName: "Level", flex: 0, width: 100, hide: !columnVisibilitytwo.level, pinned: 'left', lockPinned: true, },
        { field: "name", headerName: "Employee Name", flex: 0, width: 250, hide: !columnVisibilitytwo.name, pinned: 'left', lockPinned: true, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "empcode", headerName: "Employee Code", flex: 0, width: 150, hide: !columnVisibilitytwo.empcode, pinned: 'left', lockPinned: true, },
        { field: "date", headerName: "Date", flex: 0, width: 150, hide: !columnVisibilitytwo.date, },
        { field: "vendorname", headerName: "Vendor Name", flex: 0, width: 150, hide: !columnVisibilitytwo.vendorname, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "process", headerName: "Process", flex: 0, width: 150, hide: !columnVisibilitytwo.process, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "totalfield", headerName: "Total Field", flex: 0, width: 120, hide: !columnVisibilitytwo.totalfield, },
        { field: "autoerror", headerName: "Auto Error", flex: 0, width: 120, hide: !columnVisibilitytwo.autoerror, },
        { field: "manualerror", headerName: "Manual Error", flex: 0, width: 120, hide: !columnVisibilitytwo.manualerror, },
        { field: "uploaderror", headerName: "Upload Error", flex: 0, width: 120, hide: !columnVisibilitytwo.uploaderror, },
        { field: "moved", headerName: "Moved", flex: 0, width: 150, hide: !columnVisibilitytwo.moved, },
        { field: "notupload", headerName: "Not Upload", flex: 0, width: 150, hide: !columnVisibilitytwo.notupload, },
        { field: "penalty", headerName: "Penalty", flex: 0, width: 100, hide: !columnVisibilitytwo.penalty, },
        { field: "nonpenalty", headerName: "Non Penalty", flex: 0, width: 120, hide: !columnVisibilitytwo.nonpenalty, },
        { field: "bulkupload", headerName: "Bulk Upload", flex: 0, width: 120, hide: !columnVisibilitytwo.bulkupload, },
        { field: "bulkkeying", headerName: "Bulk Keying", flex: 0, width: 120, hide: !columnVisibilitytwo.bulkkeying, },
        { field: "edited1", headerName: "Edited1", flex: 0, width: 100, hide: !columnVisibilitytwo.edited1, },
        { field: "edited2", headerName: "Edited2", flex: 0, width: 100, hide: !columnVisibilitytwo.edited2, },
        { field: "edited3", headerName: "Edited3", flex: 0, width: 100, hide: !columnVisibilitytwo.edited3, },
        { field: "edited4", headerName: "Edited4", flex: 0, width: 100, hide: !columnVisibilitytwo.edited4, },
        { field: "reject1", headerName: "Reject1", flex: 0, width: 100, hide: !columnVisibilitytwo.reject1, },
        { field: "reject2", headerName: "Reject2", flex: 0, width: 100, hide: !columnVisibilitytwo.reject2, },
        { field: "reject3", headerName: "Reject3", flex: 0, width: 100, hide: !columnVisibilitytwo.reject3, },
        { field: "reject4", headerName: "Reject4", flex: 0, width: 100, hide: !columnVisibilitytwo.reject4, },
        { field: "notvalidate", headerName: "Not Validate", flex: 0, width: 120, hide: !columnVisibilitytwo.notvalidate, },
        { field: "validateerror", headerName: "Valid Error", flex: 0, width: 120, hide: !columnVisibilitytwo.validateerror, },
        { field: "waiver", headerName: "Waiver %", flex: 0, width: 120, hide: !columnVisibilitytwo.waiver, },
        { field: "waivererror", headerName: "Emp-Waiver", flex: 0, width: 120, hide: !columnVisibilitytwo.waivererror, },
        { field: "neterror", headerName: "Net Error", flex: 0, width: 120, hide: !columnVisibilitytwo.neterror, },
        { field: "per", headerName: "per%", flex: 0, width: 120, hide: !columnVisibilitytwo.per, },
        { field: "percentage", headerName: "Percentage", flex: 0, width: 120, hide: !columnVisibilitytwo.percentage, },
        { field: "amount", headerName: "Amount", flex: 0, width: 120, hide: !columnVisibilitytwo.amount, },
        { field: "requestreason", headerName: "Request", flex: 0, width: 250, hide: !columnVisibilitytwo.requestreason, cellStyle: cellStyles, headerClass: 'header-wrap', },
        { field: "forwardreason", headerName: "Forward", flex: 0, width: 250, hide: !columnVisibilitytwo.forwardreason, cellStyle: cellStyles, headerClass: 'header-wrap', },
        // {
        //     field: "forwardreason", headerName: "Forward", flex: 0, width: 250, hide: !columnVisibilitytwo.forwardreason, cellStyle: cellStyles, headerClass: 'header-wrap',
        //     cellRenderer: (params) => {
        //         const forwardReasons = params.data.forwardreason ? params.data.forwardreason.split('\n') : [];
        //         // console.log(params.data.forwardreason, forwardReasons)
        //         return (
        //             <Grid>
        //                 {forwardReasons.map((line, index) => (
        //                     <Typography
        //                         key={index}
        //                         sx={{ color: index > 0 && index < forwardReasons.length - 1 ? 'red' : 'inherit', whiteSpace: "pre-wrap !important", lineHeight: 'normal' }}
        //                     >
        //                         {line}
        //                     </Typography>
        //                 ))}
        //             </Grid>
        //         );
        //     },
        // },
        {
            field: "actions", headerName: "Action", flex: 0, width: 350, hide: !columnVisibilitytwo.actions, sortable: false, filter: false,
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
                        auth={auth} fetchAllPenaltyError={fetchAllPenaltyError} rowData={params.data}
                    />
                </Grid>
            ),
        },
        {
            field: "mode", headerName: "Mode", flex: 0, width: 350, hide: !columnVisibilitytwo.mode, sortable: false, filter: false,
            cellRenderer: (params) => (
                <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
                    <ModeCellTwo
                        rowId={params.data.id}
                        currentModeReason={rowModetwo[params.data.id] || "NaN"}
                        onSave={(rejectreason2) => {
                            setRowModetwo((prev) => ({
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
            field: "actions", headerName: "Action", flex: 0, width: 350, hide: !columnVisibilitytwo.actions, sortable: false, filter: false,
            cellRenderer: (params) => (
                <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
                    <ForwardReasonCellTwo
                        rowId={params.data.id}
                        currentForwardReason={forwardReasonstwo[params.data.id] || ""}
                        onSave={(rejectreason2) => {
                            setForwardReasonstwo((prev) => ({
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

    // Exports
    const [fileFormat, setFormat] = useState("");
    const fileName = "Not Forward Employee Waiver Request List";
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = fileFormat === "xl" ? '.xlsx' : '.csv';
    const exportToCSV = (csvData, fileName) => {
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    }

    const handleExportXL = (isfilter) => {
        // Define the table headers
        const headers = ['SNo', 'Level', 'Employee Name', 'Employee Code', 'Date', 'Vendor Name', 'Process', 'Total Field', 'Auto Error', 'Manual Error', 'Upload Error', 'Moved', 'Not Upload', 'Penalty', 'Non Penalty', 'Bulk Upload', 'Bulk Keying',
            'Edited1', 'Edited2', 'Edited3', 'Edited4', 'Reject1', 'Reject2', 'Reject3', 'Reject4', 'Not Validate', 'Valid Error', 'Waiver %', 'Emp-Waiver', 'Net Error',
            'per%', 'Percentage', 'Amount', 'Request', 'Forward'];

        let data = [];
        let resultdata = (filteredChanges !== null ? filteredRowData : rowDataTable) ?? [];

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
            data = waiverEmployees.map((row, index) => {
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
        exportToCSV(formattedData, fileName);
        setIsFilterOpen(false);
    };

    const fileNametwo = "Forward Employee Waiver Request List";
    const fileTypetwo = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtensiontwo = fileFormat === "xl" ? '.xlsx' : '.csv';
    const exportToCSVtwo = (csvData, fileNametwo) => {
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileTypetwo });
        FileSaver.saveAs(data, fileNametwo + fileExtensiontwo);
    }

    const handleExportXLtwo = (isfilter) => {
        // Define the table headers
        const headers = ['SNo', 'Level', 'Employee Name', 'Employee Code', 'Date', 'Vendor Name', 'Process', 'Total Field', 'Auto Error', 'Manual Error', 'Upload Error', 'Moved', 'Not Upload', 'Penalty', 'Non Penalty', 'Bulk Upload', 'Bulk Keying',
            'Edited1', 'Edited2', 'Edited3', 'Edited4', 'Reject1', 'Reject2', 'Reject3', 'Reject4', 'Not Validate', 'Valid Error', 'Waiver %', 'Emp-Waiver', 'Net Error',
            'per%', 'Percentage', 'Amount', 'Request', 'Forward'];

        let data = [];
        let resultdata = (filteredChangestwo !== null ? filteredRowDatatwo : rowDataTabletwo) ?? [];

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
            data = waiverEmployeestwo.map((row, index) => {
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
        exportToCSVtwo(formattedData, fileNametwo);
        setIsFilterOpentwo(false);
    };


    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Not Forward Employee Waiver Request List",
        pageStyle: "print",
    });

    //print...
    const componentReftwo = useRef();
    const handleprinttwo = useReactToPrint({
        content: () => componentReftwo.current,
        documentTitle: "Forward Employee Waiver Request List",
        pageStyle: "print",
    });

    const downloadPdf = (isfilter) => {
        const doc = new jsPDF({ orientation: 'landscape' });

        // Define the table headers
        const headers = ['SNo', 'Level', 'Employee Name', 'Employee Code', 'Date', 'Vendor Name', 'Process', 'Total Field', 'Auto Error', 'Manual Error', 'Upload Error', 'Moved', 'Not Upload', 'Penalty', 'Non Penalty', 'Bulk Upload', 'Bulk Keying',
            'Edited1', 'Edited2', 'Edited3', 'Edited4', 'Reject1', 'Reject2', 'Reject3', 'Reject4', 'Not Validate', 'Valid Error', 'Waiver %', 'Emp-Waiver', 'Net Error',
            'per%', 'Percentage', 'Amount', 'Request', 'Forward'];

        let data = [];
        let resultdata = (filteredChanges !== null ? filteredRowData : rowDataTable) ?? [];

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
            data = waiverEmployees.map((row, index) => {
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

        doc.save("Not Forward Employee Waiver Request List.pdf");
    };

    const downloadPdftwo = (isfilter) => {
        const doc = new jsPDF({ orientation: 'landscape' });

        // Define the table headers
        const headers = ['SNo', 'Level', 'Employee Name', 'Employee Code', 'Date', 'Vendor Name', 'Process', 'Total Field', 'Auto Error', 'Manual Error', 'Upload Error', 'Moved', 'Not Upload', 'Penalty', 'Non Penalty', 'Bulk Upload', 'Bulk Keying',
            'Edited1', 'Edited2', 'Edited3', 'Edited4', 'Reject1', 'Reject2', 'Reject3', 'Reject4', 'Not Validate', 'Valid Error', 'Waiver %', 'Emp-Waiver', 'Net Error',
            'per%', 'Percentage', 'Amount', 'Request', 'Forward'];

        let data = [];
        let resultdata = (filteredChangestwo !== null ? filteredRowDatatwo : rowDataTabletwo) ?? [];

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
            data = waiverEmployeestwo.map((row, index) => {
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

        doc.save("Forward Employee Waiver Request List.pdf");
    };

    //image
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Not Forward Employee Waiver Request List.png");
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
                    saveAs(blob, "Forward Employee Waiver Request List.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    return (
        <Box>
            <Headtitle title={"Waiver Employee Forward"} />
            <PageHeading
                title="Waiver Employee Forward"
                modulename="Quality"
                submodulename="Penalty"
                mainpagename="Penalty Waiver"
                subpagename="Waiver Employee Forward"
                subsubpagename=""
            />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lwaiveremployeeforward") && (
                <>
                    <Box sx={userStyle.dialogbox}>
                        {/* <Grid container spacing={2}>
                            <Grid item xs={8}>
                                <Typography sx={userStyle.importheadtext}>Waiver Employee Forward</Typography>
                            </Grid>
                        </Grid><br /> */}
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
                    {tableCheck?.includes('Not Forward Employee Waiver Request List') ?
                        <>
                            <Box sx={userStyle.container}>
                                {/* ******************************************************EXPORT Buttons****************************************************** */}
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext}>Not Forward Employee Waiver Request List</Typography>
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
                                                <MenuItem value={waiverEmployees?.length}>All</MenuItem>
                                            </Select>
                                        </Box>
                                    </Grid>
                                    <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center", }}>
                                        <Box>
                                            {isUserRoleCompare?.includes("excelwaiveremployeeforward") && (
                                                <>
                                                    <Button onClick={(e) => { setIsFilterOpen(true); setFormat("xl"); }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("csvwaiveremployeeforward") && (
                                                <>
                                                    <Button onClick={(e) => { setIsFilterOpen(true); setFormat("csv"); }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("printwaiveremployeeforward") && (
                                                <>
                                                    <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("pdfwaiveremployeeforward") && (
                                                <>
                                                    <Button sx={userStyle.buttongrp} onClick={() => { setIsPdfFilterOpen(true); }}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("imagewaiveremployeeforward") && (
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
                                                maindatas={waiverEmployees}
                                                setSearchedString={setSearchedString}
                                                searchQuery={searchQuery}
                                                setSearchQuery={setSearchQuery}
                                                paginated={false}
                                                totalDatas={waiverEmployees}
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
                                            itemsList={waiverEmployees}
                                            pagenamecheck={'Client Error Forward'}
                                        />
                                    </>
                                )}
                            </Box><br />
                        </> : null}
                    {/* Second Tabale  */}
                    {tableCheck?.includes('Forward Employee Waiver Request List') ?
                        <>
                            <Box sx={userStyle.container}>
                                {/* ******************************************************EXPORT Buttons****************************************************** */}
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext}>Forward Employee Waiver Request List</Typography>
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
                                                <MenuItem value={waiverEmployeestwo?.length}>All</MenuItem>
                                            </Select>
                                        </Box>
                                    </Grid>
                                    <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center", }}>
                                        <Box>
                                            {isUserRoleCompare?.includes("excelwaiveremployeeforward") && (
                                                <>
                                                    <Button onClick={(e) => { setIsFilterOpentwo(true); setFormat("xl"); }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("csvwaiveremployeeforward") && (
                                                <>
                                                    <Button onClick={(e) => { setIsFilterOpentwo(true); setFormat("csv"); }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("printwaiveremployeeforward") && (
                                                <>
                                                    <Button sx={userStyle.buttongrp} onClick={handleprinttwo}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("pdfwaiveremployeeforward") && (
                                                <>
                                                    <Button sx={userStyle.buttongrp} onClick={() => { setIsPdfFilterOpentwo(true); }}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("imagewaiveremployeeforward") && (
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
                                                maindatas={waiverEmployeestwo}
                                                setSearchedString={setSearchedStringtwo}
                                                searchQuery={searchQuerytwo}
                                                setSearchQuery={setSearchQuerytwo}
                                                paginated={false}
                                                totalDatas={waiverEmployeestwo}
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
                                            itemsList={waiverEmployeestwo}
                                            pagenamecheck={'Client Error Forward'}
                                            fetchAllPenaltyError={fetchAllPenaltyError}
                                        />
                                    </>
                                )}
                            </Box><br />
                        </> : null}
                    <RecheckForwardEmployee waiverEmployeesThree={waiverEmployeesThree} waiverEmployeesFour={waiverEmployeesFour} fetchAllPenaltyError={fetchAllPenaltyError} loader={loader} tableCheck={tableCheck}
                        setFilteredRowDataThree={setFilteredRowDataThree} filteredChangesThree={filteredChangesThree} setFilteredChangesThree={setFilteredChangesThree} filteredRowDataThree={filteredRowDataThree} setIsHandleChangeThree={setIsHandleChangeThree} isHandleChangeThree={isHandleChangeThree} setSearchedStringThree={setSearchedStringThree} searchedStringThree={searchedStringThree}
                        setFilteredRowDataFour={setFilteredRowDataFour} filteredChangesFour={filteredChangesFour} setFilteredChangesFour={setFilteredChangesFour} filteredRowDataFour={filteredRowDataFour} setIsHandleChangeFour={setIsHandleChangeFour} isHandleChangeFour={isHandleChangeFour} setSearchedStringFour={setSearchedStringFour} searchedStringFour={searchedStringFour}
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
            {/* EXTERNAL COMPONENTS -------------- END */}
            {/* print layout */}
            <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRef}>
                    <TableHead>
                        <TableRow>
                            <TableCell>SNo</TableCell>
                            <TableCell>Level</TableCell>
                            <TableCell>Employee Name</TableCell>
                            <TableCell>Employee Code</TableCell>
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
                        {rowDataTable &&
                            rowDataTable.map((row, index) => (
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
                <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentReftwo}>
                    <TableHead>
                        <TableRow>
                            <TableCell>SNo</TableCell>
                            <TableCell>Level</TableCell>
                            <TableCell>Employee Name</TableCell>
                            <TableCell>Employee Code</TableCell>
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
                        {rowDataTabletwo &&
                            rowDataTabletwo.map((row, index) => (
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

export default WaiverEmployeeForward;