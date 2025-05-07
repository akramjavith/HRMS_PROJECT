import React, { useContext, useEffect, useRef, useState } from "react";
import { Box, Button, FormControl, Grid, MenuItem, Popover, Select, Typography, TextareaAutosize, CircularProgress } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import LoadingButton from "@mui/lab/LoadingButton";
import Selects from "react-select";
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
import ExportData from "../../../components/ExportData";
import MessageAlert from "../../../components/MessageAlert";
import PageHeading from "../../../components/PageHeading";
import AggregatedSearchBar from "../../../components/AggregatedSearchBar";
import AggridTable from "../../../components/AggridTable";
import domtoimage from 'dom-to-image';
import ResentForwardEmployee from './Resentforwardemployee'
import ManageColumnsContent from "../../../components/ManageColumn";
import moment from 'moment';

const RecheckReasonCell = ({ rowId, currentRecheckReason, onSave, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert, setPopupContent, setPopupSeverity, handleClickOpenPopup, auth, fetchAllClient, rowData }) => {
    const [localRecheckReason, setLocalRecheckReason] = useState('');

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
                            tablename: 'Client Error Forward_Forward',
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
                <Button sx={{ textTransform: 'capitalize' }} variant="contained" color="error" size="small" onClick={handleSaveClick}>Recheck</Button>
            </Grid>
        </Grid>
    );
};

const ForwardReasonCell = ({ rowId, currentForwardReason, onSave, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert, setPopupContent, setPopupSeverity, handleClickOpenPopup, auth, fetchAllClient, rowData }) => {
    const [localForwardReason, setLocalForwardReason] = useState('');

    const today = new Date();
    const date = today.toISOString().split('T')[0];
    const time = today.toTimeString().split(' ')[0].slice(0, 5);

    const handleSaveClick = async () => {
        onSave(localForwardReason);
        if (localForwardReason === '') {
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
                            tablename: 'Client Error Forward_Forward',
                            date: date,
                            time: time,
                            status: "Forward",
                            reason: localForwardReason,
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
                <Button sx={{ textTransform: 'capitalize' }} variant="contained" color="error" size="small" onClick={handleSaveClick}>Forward</Button>
            </Grid>
        </Grid>
    );
};

const ModeCell = ({ rowId, currentModeReason, onSave, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert, setPopupContent, setPopupSeverity, handleClickOpenPopup, auth, fetchAllClient, rowData }) => {
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
                            tablename: 'Client Error Forward_Forward',
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

function ClientErrorForward() {

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
    const [items, setItems] = useState([]);
    const [itemstwo, setItemstwo] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedRowstwo, setSelectedRowstwo] = useState([]);
    const [loadingdeloverall, setloadingdeloverall] = useState(false);
    const [recheckReasons, setRecheckReasons] = useState({});
    const [forwardReasons, setForwardReasons] = useState({});
    const [rowMode, setRowMode] = useState({});
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
                data.subpagename === "Client Error Forward" &&
                data.subsubpagename === ""
        )?.listpageaccessmode || "Overall";

    const tableOptions = [
        { label: "Forward Employee Client Error Waiver Request List", value: "Forward Employee Client Error Waiver Request List" },
        { label: "Forward Sent Employee Client Error Waiver Request List", value: "Forward Sent Employee Client Error Waiver Request List" },
        { label: "Resent Forward Employee Client Error Waiver Request List", value: "Resent Forward Employee Client Error Waiver Request List" },
        { label: "Recheck Employee Client Error Waiver Request List", value: "Recheck Employee Client Error Waiver Request List" }
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
        mode: true,
        actions2: true
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
        requestreason: true,
        forwardreason: true,
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
            pagename: String("Client Error Forward"),
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
    const fetchAllClient = async () => {
        setPageName(!pageName);
        setLoader(true);
        try {
            let res = await axios.post(SERVICE.CLIENT_ERROR_FORWARD_HIERARCHY, {
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

            if (valueTable?.includes('Forward Employee Client Error Waiver Request List')) {
                let firstTableData = res?.data?.resultAccessFilter?.filter(data => data.history?.length === 1)
                    ?.map((item, index) => {
                        const sentData = item.history?.find(data => data.status === "Sent");
                        return {
                            ...item,
                            id: item._id,
                            serialNumber: index + 1,
                            date: moment(item.date).format('DD/MM/YYYY'),
                            amount: item.amount.toFixed(2),
                            mode: 'NaN',
                            reason: sentData ? sentData.reason : '',
                        }
                    });
                setClientErrors(firstTableData?.map((item, index) => ({ ...item, serialNumber: index + 1, })));
                // setFilteredRowData(firstTableData?.map((item, index) => ({ ...item, serialNumber: index + 1, })));
                setTableCheck(valueTable);
            }

            if (valueTable?.includes('Forward Sent Employee Client Error Waiver Request List')) {
                let secondTableData = res?.data?.resultAccessFilter
                    ?.map((item) => {
                        const sentData = item.history?.find(data => data.status === "Sent");
                        const relevantHistory = item.history.filter(val =>
                            ["Recheck", "Sent Recheck", "Forward"].includes(val.status)
                        );

                        const reasons = relevantHistory.map(val => val.reason).join('\n');

                        if (item.history[item.history.length - 1]?.status === "Forward") {
                            return {
                                ...item,
                                id: item._id,
                                date: moment(item.date).format('DD/MM/YYYY'),
                                amount: item.amount.toFixed(2),
                                requestreason: sentData ? sentData.reason : '',
                                forwardreason: reasons,
                            }
                        }
                        return null;
                    }).filter(Boolean);
                setClientErrorstwo(secondTableData?.map((item, index) => ({ ...item, serialNumber: index + 1, })));
                // setFilteredRowDatatwo(secondTableData?.map((item, index) => ({ ...item, serialNumber: index + 1, })));
                setTableCheck(valueTable);
            }

            if (valueTable?.includes('Resent Forward Employee Client Error Waiver Request List')) {
                console.log(res?.data?.resultAccessFilter)
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
                            date: moment(item.date).format('DD/MM/YYYY'),
                            amount: item.amount.toFixed(2),
                            mode: 'NaN',
                            requestreason: requestReasons,
                            forwardreason: forwardReasons ? forwardReasons : 'null',
                        };
                    }
                    return null;
                }).filter(Boolean);
                setClientErrorsThree(thirdTableData?.map((item, index) => ({ ...item, serialNumber: index + 1, })));
                // setFilteredRowDataThree(thirdTableData?.map((item, index) => ({ ...item, serialNumber: index + 1, })));
                // console.log(thirdTableData);
                setTableCheck(valueTable);
            }

            if (valueTable?.includes('Recheck Employee Client Error Waiver Request List')) {
                let fourthTableData = res?.data?.resultAccessFilter
                    ?.map((item) => {
                        const sentData = item.history?.find(data => data.status === "Sent");
                        const relevantHistory = item.history.filter(val =>
                            ["Recheck", "Sent Recheck"].includes(val.status)
                        );

                        const reasons = relevantHistory.map(val => val.reason).join('\n');

                        if (item.history[item.history.length - 1]?.status === "Recheck") {
                            return {
                                ...item,
                                id: item._id,
                                date: moment(item.date).format('DD/MM/YYYY'),
                                amount: item.amount.toFixed(2),
                                mode: 'NaN',
                                requestreason: sentData ? sentData.reason : '',
                                forwardreason: reasons,
                            }
                        }
                        return null;
                    }).filter(Boolean);
                setClientErrorsFour(fourthTableData?.map((item, index) => ({ ...item, serialNumber: index + 1, })));
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
        { field: "reason", headerName: "Request Reason", flex: 0, width: 250, hide: !columnVisibility.reason, cellStyle: cellStyles, headerClass: 'header-wrap', },
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
                        auth={auth} fetchAllClient={fetchAllClient} rowData={params.data}
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
                        auth={auth} fetchAllClient={fetchAllClient} rowData={params.data}
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
        { field: "requestreason", headerName: "Request Reason", flex: 0, width: 250, hide: !columnVisibilitytwo.requestreason, cellStyle: cellStyles, headerClass: 'header-wrap', },
        {
            field: "forwardreason", headerName: "Forward Reason", flex: 0, width: 250, hide: !columnVisibilitytwo.forwardreason, cellStyle: cellStyles, headerClass: 'header-wrap',
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
    let exportColumnNames = ['Level', 'Vendor Name', 'Branch Name', 'Unit', 'Team', 'Employee Code', 'Employee Name', 'Login id', 'Date', 'Category', 'SubCategory', 'Document Number', 'Field Name',
        'Line', 'Error Value', 'Correct Value', 'Client Error', 'Client Amount', 'per%', 'Amount', 'Request Reason'];
    let exportRowValues = ['level', 'vendor', 'branch', 'unit', 'team', 'employeeid', 'employeename', 'loginid', 'date', 'category', 'subcategory', 'documentnumber', 'fieldname',
        'line', 'errorvalue', 'correctvalue', 'clienterror', 'clientamount', 'per', 'amount', 'reason'];

    let exportColumnNamestwo = ['Level', 'Vendor Name', 'Branch Name', 'Unit', 'Team', 'Employee Code', 'Employee Name', 'Login id', 'Date', 'Category', 'SubCategory', 'Document Number', 'Field Name',
        'Line', 'Error Value', 'Correct Value', 'Client Error', 'Client Amount', 'per%', 'Amount', 'Request Reason', 'Forward Reason'];
    let exportRowValuestwo = ['level', 'vendor', 'branch', 'unit', 'team', 'employeeid', 'employeename', 'loginid', 'date', 'category', 'subcategory', 'documentnumber', 'fieldname',
        'line', 'errorvalue', 'correctvalue', 'clienterror', 'clientamount', 'per', 'amount', 'requestreason', 'forwardReason'];

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Forward Employee Client Error Waiver Request List",
        pageStyle: "print",
    });

    //print...
    const componentReftwo = useRef();
    const handleprinttwo = useReactToPrint({
        content: () => componentReftwo.current,
        documentTitle: "Forward Sent Employee Client Error Waiver Request List",
        pageStyle: "print",
    });

    //image
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Forward Employee Client Error Waiver Request List.png");
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
                    saveAs(blob, "Forward Sent Employee Client Error Waiver Request List.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    return (
        <Box>
            <Headtitle title={"Client Error Forward"} />
            <PageHeading
                title="Client Error Forward"
                modulename="Quality"
                submodulename="Penalty"
                mainpagename="Penalty Waiver"
                subpagename="Client Error Forward"
                subsubpagename=""
            />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lclienterrorforward") && (
                <>
                    <Box sx={userStyle.dialogbox}>
                        {/* <Grid container spacing={2}>
                            <Grid item xs={8}>
                                <Typography sx={userStyle.importheadtext}>Client Error Forward</Typography>
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
                    {tableCheck?.includes('Forward Employee Client Error Waiver Request List') ?
                        <>
                            <Box sx={userStyle.container}>
                                {/* ******************************************************EXPORT Buttons****************************************************** */}
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext}>Forward Employee Client Error Waiver Request List</Typography>
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
                                            {isUserRoleCompare?.includes("excelclienterrorforward") && (
                                                <>
                                                    <Button onClick={(e) => { setIsFilterOpen(true); setFormat("xl"); }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("csvclienterrorforward") && (
                                                <>
                                                    <Button onClick={(e) => { setIsFilterOpen(true); setFormat("csv"); }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("printclienterrorforward") && (
                                                <>
                                                    <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("pdfclienterrorforward") && (
                                                <>
                                                    <Button sx={userStyle.buttongrp} onClick={() => { setIsPdfFilterOpen(true); }}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("imageclienterrorforward") && (
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
                                            pagenamecheck={'Client Error Forward'}
                                        />
                                    </>
                                )}
                            </Box><br />
                        </> : null}
                    {/* Second Tabale  */}
                    {tableCheck?.includes('Forward Sent Employee Client Error Waiver Request List') ?
                        <>
                            <Box sx={userStyle.container}>
                                {/* ******************************************************EXPORT Buttons****************************************************** */}
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext}>Forward Sent Employee Client Error Waiver Request List</Typography>
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
                                            {isUserRoleCompare?.includes("excelclienterrorforward") && (
                                                <>
                                                    <Button onClick={(e) => { setIsFilterOpentwo(true); setFormat("xl"); }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("csvclienterrorforward") && (
                                                <>
                                                    <Button onClick={(e) => { setIsFilterOpentwo(true); setFormat("csv"); }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("printclienterrorforward") && (
                                                <>
                                                    <Button sx={userStyle.buttongrp} onClick={handleprinttwo}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("pdfclienterrorforward") && (
                                                <>
                                                    <Button sx={userStyle.buttongrp} onClick={() => { setIsPdfFilterOpentwo(true); }}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("imageclienterrorforward") && (
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
                                            pagenamecheck={'Client Error Forward'}
                                            fetchAllClient={fetchAllClient}
                                        />
                                    </>
                                )}
                            </Box><br />
                        </> : null}
                    <ResentForwardEmployee clientErrorsThree={clientErrorsThree} clientErrorsFour={clientErrorsFour} fetchAllClient={fetchAllClient} loader={loader} tableCheck={tableCheck}
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
                filename={"Forward Employee Client Error Waiver Request List"}
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
                itemsTwo={clientErrorstwo ?? []}
                filename={"Forward Sent Employee Client Error Waiver Request List"}
                exportColumnNames={exportColumnNamestwo}
                exportRowValues={exportRowValuestwo}
                componentRef={componentReftwo}
            />
            {/* EXTERNAL COMPONENTS -------------- END */}
        </Box>
    );
}

export default ClientErrorForward;