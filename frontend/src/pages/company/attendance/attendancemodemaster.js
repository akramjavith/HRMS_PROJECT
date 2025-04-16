import React, { useState, useEffect, useRef, useContext } from "react";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import StyledDataGrid from "../../../components/TableStyle";
import { handleApiError } from "../../../components/Errorhandling";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { FaFileExcel, FaFileCsv } from 'react-icons/fa';
import {
    Box,
    Typography,
    OutlinedInput,
    TableBody,
    TableRow,
    TableCell,
    Select,
    Paper,
    MenuItem,
    Dialog,
    DialogContent,
    DialogActions,
    FormControl,
    Grid,
    Table,
    TableHead,
    TableContainer,
    Button,
    List,
    ListItem,
    ListItemText,
    Popover,
    Checkbox,
    TextField,
    IconButton,
} from "@mui/material";
import { userStyle, colourStyles } from "../../../pageStyle";
import LoadingButton from "@mui/lab/LoadingButton";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import moment from "moment-timezone";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { UserRoleAccessContext } from "../../../context/Appcontext";
import { AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { saveAs } from "file-saver";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Selects from "react-select";

function AttendanceModeMaster() {
    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);

    // Error Popup model
    const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
    const [showAlertpop, setShowAlertpop] = useState();
    const handleClickOpenerrpop = () => {
        setIsErrorOpenpop(true);
    };
    const handleCloseerrpop = () => {
        setIsErrorOpenpop(false);
    };



    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [attMode, setAttmode] = useState({
        name: "",
        description: "",
        appliedthrough: "Auto",
        lop: false,
        loptype: "Half Day",
        criteria: "",
        target: true,
        paidleave: true,
        paidleavetype: "Half Day",
    });

    const appliedThrough = [
        { label: "Auto", value: "Auto" },
        { label: "Manual", value: "Manual" },
        { label: "Auto/Manual", value: "Auto/Manual" },
    ];
    const reduceOptions = [
        { label: "Half Day", value: "Half Day" },
        { label: "Full Day", value: "Full Day" },
        { label: "Double Day", value: "Double Day" }
    ];

    const reducePaidValueOptions = [
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
    ];

    const reducePaidOptions = [
        { label: "Half Day", value: "Half Day" },
        { label: "Full Day", value: "Full Day" },
        { label: "Double Day", value: "Double Day" }

    ];

    const [isCheckOpen, setisCheckOpen] = useState(false);
    const [selectedRowsCat, setSelectedRowsCat] = useState([]);

    const [ovProj, setOvProj] = useState("");
    const [ovProjCount, setOvProjCount] = useState("");
    const [getOverAllCount, setGetOverallCount] = useState("");

    //check delete model
    const [isbulkCheckOpen, setisCheckOpenbulk] = useState(false);
    const handleClickOpenCheckbulk = () => {
        setisCheckOpenbulk(true);
    };
    const handlebulkCloseCheck = () => {
        setSelectedRows([]);
        setSelectedRowsCat([]);
        setisCheckOpenbulk(false);
        setSelectAllChecked(false);
    };


    const [overalldeletecheck, setOveraldeletecheck] = useState({ ebuse: [] });

    const handleClickOpenCheck = (data) => {
        setisCheckOpen(true);
        // setOveraldeletecheck(data);
    };
    const handleCloseCheck = () => {
        setisCheckOpen(false);
    };


    const [attModeedit, setAttmodeEdit] = useState({});
    const [attModearr, setAttModearr] = useState([]);
    const { isUserRoleCompare, isUserRoleAccess } = useContext(
        UserRoleAccessContext
    );
    const { auth } = useContext(AuthContext);
    const [loader, setLoader] = useState(false);
    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const [openview, setOpenview] = useState(false);
    const [openInfo, setOpeninfo] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteAttMode, setDeleteAttMode] = useState({});
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [allAttModeEdit, setAllAttModeEdit] = useState([]);
    const [copiedData, setCopiedData] = useState("");
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        name: true,
        description: true,
        appliedthrough: true,
        lop: true,
        loptype: true,
        criteria: true,
        target: true,
        paidleave: true,
        paidleavetype: true,
        actions: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(
        initialColumnVisibility
    );

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };

    //useEffect
    useEffect(() => {
        addSerialNumber();
    }, [attModearr]);


    useEffect(() => {
        fetchAttMode();
        fetchAttModeAll();
    }, [isEditOpen]);

    useEffect(() => {
        fetchAttMode();
    }, []);
    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        };
    }, []);
    useEffect(() => {
        // Retrieve column visibility from localStorage (if available)
        const savedVisibility = localStorage.getItem("columnVisibility");
        if (savedVisibility) {
            setColumnVisibility(JSON.parse(savedVisibility));
        }
    }, []);
    useEffect(() => {
        // Save column visibility to localStorage whenever it changes
        localStorage.setItem("columnVisibility", JSON.stringify(columnVisibility));
    }, [columnVisibility]);

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };
    // Error Popup model
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
        setBtnSubmit(false);
    };
    // view model
    const handleClickOpenview = () => {
        setOpenview(true);
    };
    const handleCloseview = () => {
        setOpenview(false);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };
    // info model
    const handleClickOpeninfo = () => {
        setOpeninfo(true);
    };
    const handleCloseinfo = () => {
        setOpeninfo(false);
    };
    //Delete model
    const handleClickOpen = () => {
        setIsDeleteOpen(true);
    };
    const handleCloseMod = () => {
        setIsDeleteOpen(false);
    };
    // page refersh reload description
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
    };
    // Manage Columns
    const handleOpenManageColumns = (event) => {
        setAnchorEl(event.currentTarget);
        setManageColumnsOpen(true);
    };
    const handleCloseManageColumns = () => {
        setManageColumnsOpen(false);
        setSearchQueryManage("");
    };
    //Delete model
    const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);

    const handleClickOpencheckbox = () => {
        setIsDeleteOpencheckbox(true);
    };
    const handleCloseModcheckbox = () => {
        setIsDeleteOpencheckbox(false);
    };
    const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

    // const handleClickOpenalert = () => {
    //     if (selectedRows.length === 0) {
    //         setIsDeleteOpenalert(true);
    //     } else {
    //         setIsDeleteOpencheckbox(true);
    //     }
    // };

    const handleClickOpenalert = async () => {
        let value = [...new Set(selectedRowsCat.flat())]

        if (selectedRows.length === 0) {
            setIsDeleteOpenalert(true);
        } else {
            const [resebuse] = await Promise.all([
                axios.post(SERVICE.ATTENDANCE_STATUS_OVERALL_DELETE, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    checkstatus: value,
                }),

            ])

            setCheckUnit(resebuse?.data?.attendancestatusmaster)

            let Ebuse = resebuse?.data?.attendancestatusmaster.map(t => t.name).flat();


            if ((resebuse?.data?.attendancestatusmaster).length > 0) {
                handleClickOpenCheckbulk();
                // setOveraldeletecheck({ ...overalldeletecheck, ebuse: resebuse?.data?.ebuse, ebread: resebread?.data?.ebread, ebmaterial: resebmaterial?.data?.ebmaterial })
                setOveraldeletecheck({ ...overalldeletecheck, ebuse: [... new Set(Ebuse)] })

                setCheckUnit([])
            } else {
                setIsDeleteOpencheckbox(true);
            }
        }
    };

    const handleCloseModalert = () => {
        setIsDeleteOpenalert(false);
    };
    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;
    const getRowClassName = (params) => {
        if (selectedRows.includes(params.row.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };
    const [checkUnit, setCheckUnit] = useState()
    //set function to get particular row
    const rowData = async (id, name) => {
        console.log(name, "name")
        try {
            let res = await axios.get(
                `${SERVICE.ATTENDANCE_MODE_STATUS_SINGLE}/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );
            setDeleteAttMode(res?.data?.sattendancemodestatus);
            let resdev = await axios.post(SERVICE.ATTENDANCE_STATUS_OVERALL_DELETE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                checkstatus: [name],
            });
            console.log(resdev?.data, "dele")
            setCheckUnit(resdev?.data?.attendancestatusmaster);
            if (resdev?.data?.attendancestatusmaster?.length > 0) {
                handleClickOpenCheck();
            } else {
                handleClickOpen();
            }
            // handleClickOpen();
        } catch (err) { console.log(err, "eororororo"); handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    // Alert delete popup
    let assetid = deleteAttMode._id;
    const delBrand = async () => {
        try {
            await axios.delete(
                `${SERVICE.ATTENDANCE_MODE_STATUS_SINGLE}/${assetid}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );
            await fetchAttMode();
            handleCloseMod();
            setSelectedRows([]);
            setPage(1);
            setShowAlert(
                <>
                    <CheckCircleOutlineIcon
                        sx={{ fontSize: "100px", color: "#7ac767" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Deleted Successfully 👍"}
                    </p>
                </>
            );
            handleClickOpenerr();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    //add function
    const sendRequest = async () => {
        setBtnSubmit(true);
        try {
            let brandCreate = await axios.post(
                SERVICE.ATTENDANCE_MODE_STATUS_CREATE,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    name: String(attMode.name),
                    description: String(attMode.description),
                    appliedthrough: String(attMode.appliedthrough),
                    lop: Boolean(attMode.lop),
                    loptype: attMode.lop ? String(attMode.loptype) : "",
                    criteria: String(attMode.criteria),
                    target: Boolean(attMode.target),
                    paidleave: Boolean(attMode.paidleave),
                    paidleavetype: attMode.paidleave ? String(attMode.paidleavetype) : "",
                    addedby: [
                        {
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),
                        },
                    ],
                }
            );
            setBtnSubmit(false);
            await fetchAttMode();
            setAttmode({
                name: "",
                description: "",
                appliedthrough: "Auto",
                lop: false,
                loptype: "Half Day",
                criteria: "",
                target: true,
                paidleave: true,
                paidleavetype: "Half Day",
            });
            setShowAlert(
                <>
                    <CheckCircleOutlineIcon
                        sx={{ fontSize: "100px", color: "#7ac767" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Added Successfully 👍"}
                    </p>
                </>
            );
            handleClickOpenerr();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    const [btnSubmit, setBtnSubmit] = useState(false);
    //submit option for saving
    const handleSubmit = (e) => {
        e.preventDefault();
        const isNameMatch = attModearr?.some(
            (item) => item.name?.toLowerCase() === attMode.name?.toLowerCase()
        );
        if (attMode.name === "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Enter Name"}
                    </p>
                </>
            );
            handleClickOpenerr();
        } else if (isNameMatch) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Name already exists!"}
                    </p>
                </>
            );
            handleClickOpenerr();
        } else {
            sendRequest();
        }
    };

    const handleclear = (e) => {
        e.preventDefault();
        setAttmode({
            name: "",
            description: "",
            appliedthrough: "Auto",
            lop: false,
            loptype: "Half Day",
            criteria: "",
            target: true,
            paidleave: true,
            paidleavetype: "Half Day",
        });
        setShowAlert(
            <>
                <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "#7ac767" }} />
                <p style={{ fontSize: "20px", fontWeight: 900 }}>
                    {"Cleared Successfully 👍"}
                </p>
            </>
        );
        handleClickOpenerr();
    };
    //Edit model...
    const handleClickOpenEdit = () => {
        setIsEditOpen(true);
    };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpen(false);
    };
    //get single row to edit....
    const getCode = async (e, name) => {
        try {
            let res = await axios.get(
                `${SERVICE.ATTENDANCE_MODE_STATUS_SINGLE}/${e}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );
            setAttmodeEdit(res?.data?.sattendancemodestatus);
            setOvProj(name);
            getOverallEditSection(name);
            handleClickOpenEdit();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    // get single row to view....
    const getviewCode = async (e) => {
        try {
            let res = await axios.get(
                `${SERVICE.ATTENDANCE_MODE_STATUS_SINGLE}/${e}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );
            setAttmodeEdit(res?.data?.sattendancemodestatus);
            handleClickOpenview();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    // get single row to view....
    const getinfoCode = async (e) => {
        try {
            let res = await axios.get(
                `${SERVICE.ATTENDANCE_MODE_STATUS_SINGLE}/${e}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );
            setAttmodeEdit(res?.data?.sattendancemodestatus);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    //frequency master name updateby edit page...
    let updateby = attModeedit.updatedby;
    let addedby = attModeedit.addedby;
    let frequencyId = attModeedit._id;

    const getOverallEditSection = async (e) => {
        try {
            let res = await axios.post(SERVICE.ATTENDANCE_STATUS_OVERALL_EDIT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                oldname: e,
            });
            setOvProjCount(res?.data?.count);
            setGetOverallCount(`The ${e} is linked in
         ${res?.data?.ebuse?.length > 0 ? "Attendance Status Master ," : ""}
       
            } whether you want to do changes ..??`);
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    //overall edit section for all pages
    const getOverallEditSectionUpdate = async () => {
        try {
            let res = await axios.post(SERVICE.ATTENDANCE_STATUS_OVERALL_EDIT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                oldname: ovProj,
            });
            sendEditRequestOverall(
                res?.data?.ebuse,
            );
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    const sendEditRequestOverall = async (ebuse) => {
        try {
            if (ebuse.length > 0) {
                let answ = ebuse.map((d, i) => {
                    let res = axios.put(`${SERVICE.ATTENDANCE_STATUS_SINGLE}/${d._id}`, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        name: String(attModeedit.name),
                    });
                });
            }


        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };



    //editing the single data...
    const sendEditRequest = async () => {
        try {
            let res = await axios.put(
                `${SERVICE.ATTENDANCE_MODE_STATUS_SINGLE}/${frequencyId}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    name: String(attModeedit.name),
                    description: String(attModeedit.description),
                    appliedthrough: String(attModeedit.appliedthrough),
                    lop: Boolean(attModeedit.lop),
                    loptype: attModeedit.lop
                        ? String(
                            attModeedit.loptype === "" ? "Half Day" : attModeedit.loptype
                        )
                        : "",
                    criteria: String(attModeedit.criteria),
                    target: Boolean(attModeedit.target),
                    paidleave: Boolean(attModeedit.paidleave),
                    paidleavetype: attModeedit.paidleave
                        ? String(
                            attModeedit.paidleavetype === ""
                                ? "Half Day"
                                : attModeedit.paidleavetype
                        )
                        : "",
                    updatedby: [
                        ...updateby,
                        {
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),
                        },
                    ],
                }
            );
            await fetchAttMode();
            handleCloseModEdit();
            getOverallEditSectionUpdate();
            setShowAlert(
                <>
                    <CheckCircleOutlineIcon
                        sx={{ fontSize: "100px", color: "#7ac767" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Updated Successfully 👍"}
                    </p>
                </>
            );
            handleClickOpenerr();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    const editSubmit = (e) => {
        e.preventDefault();
        fetchAttModeAll();
        const isNameMatch = allAttModeEdit?.some(
            (item) => item.name?.toLowerCase() === attModeedit.name?.toLowerCase()
        );
        if (attModeedit.name === "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Enter Name"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (attModeedit.name != ovProj && ovProjCount > 0) {
            setShowAlertpop(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{getOverAllCount}</p>
                </>
            );
            handleClickOpenerrpop();
        }
        else if (isNameMatch) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Name already exists!"}
                    </p>
                </>
            );
            handleClickOpenerr();
        } else {
            sendEditRequest();
        }
    };
    //get all Attendance Status name.
    const fetchAttMode = async () => {
        try {
            let res_freq = await axios.get(SERVICE.ATTENDANCE_MODE_STATUS, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setAttModearr(res_freq?.data?.allattmodestatus);
            setLoader(true);
        } catch (err) { setLoader(true); handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    const delAreagrpcheckbox = async () => {
        try {
            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(
                    `${SERVICE.ATTENDANCE_MODE_STATUS_SINGLE}/${item}`,
                    {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                    }
                );
            });
            // Wait for all delete requests to complete
            await Promise.all(deletePromises);
            handleCloseModcheckbox();
            setSelectedRows([]);
            setSelectAllChecked(false);
            setPage(1);

            await fetchAttModeAll();
            setShowAlert(
                <>
                    <CheckCircleOutlineIcon
                        sx={{ fontSize: "100px", color: "#7ac767" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Deleted Successfully 👍"}
                    </p>
                </>
            );
            handleClickOpenerr();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };


    const delEbservicecheckboxWithoutLink = async () => {
        try {
            let valfilter = [
                ...overalldeletecheck.ebuse,
            ];

            let filtered = rowDataTable.filter(d => !valfilter.some(item => d.name === item))?.flatMap(d => selectedRows?.filter(item => d.id === item));

            const deletePromises = filtered?.map((item) => {
                return axios.delete(`${SERVICE.ATTENDANCE_MODE_STATUS_SINGLE}/${item}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });
            });

            // Wait for all delete requests to complete
            await Promise.all(deletePromises);

            handlebulkCloseCheck();
            setSelectedRows([]);
            setSelectAllChecked(false);
            setPage(1);
            setShowAlert(
                <>
                    <CheckCircleOutlineIcon
                        sx={{ fontSize: "100px", color: "#7ac767" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Deleted Successfully 👍"}
                    </p>
                </>
            );
            handleClickOpenerr();

            await fetchAttModeAll();
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };



    const getLinkedLabelItem = (overalldeletecheck) => {
        const { ebuse = [] } = overalldeletecheck;
        const labels = [];

        ebuse.forEach(item => labels.push(item));

        // Remove duplicates using a Set
        const uniqueLabels = [...new Set(labels)];

        return uniqueLabels.join(", ");
    };

    const getLinkedLabel = (overalldeletecheck) => {
        const { ebuse = [] } = overalldeletecheck;
        const labels = [];

        if (ebuse.length > 0) labels.push("Attendance Status Master");

        return labels.join(", ");
    };

    const getFilteredUnits = (attModearr, selectedRows, overalldeletecheck) => {
        const { ebuse = [] } = overalldeletecheck;
        const allConditions = [...new Set([...ebuse])];

        return attModearr.filter(d => selectedRows?.includes(d._id) && !allConditions.includes(d.name));
    };

    const shouldShowDeleteMessage = (attModearr, selectedRows, overalldeletecheck) => {
        return getFilteredUnits(attModearr, selectedRows, overalldeletecheck).length > 0;
    };

    const shouldEnableOkButton = (attModearr, selectedRows, overalldeletecheck) => {
        return getFilteredUnits(attModearr, selectedRows, overalldeletecheck).length === 0;
    };




    //get all Brand Type Name.
    const fetchAttModeAll = async () => {
        try {
            let res_freq = await axios.get(SERVICE.ATTENDANCE_MODE_STATUS, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setAttModearr(res_freq?.data?.allattmodestatus);
            setAllAttModeEdit(
                res_freq?.data?.allattmodestatus.filter(
                    (item) => item._id !== attModeedit._id
                )
            );
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    //serial no for listing items
    const addSerialNumber = () => {
        const itemsWithSerialNumber = attModearr?.map((item, index) => ({
            ...item,
            serialNumber: index + 1,
            lop: item.lop ? "Yes" : "No",
            target: item.target ? "Yes" : "No",
            paidleave: item.paidleave ? "Yes" : "No",
        }));
        setItems(itemsWithSerialNumber);
    };
    //Datatable
    const handlePageChange = (newPage) => {
        setPage(newPage);
        setSelectedRows([]);
        setSelectAllChecked(false);
    };
    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setSelectedRows([]);
        setSelectAllChecked(false);
        setPage(1);
    };
    //datatable....
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
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

    const filteredData = filteredDatas?.slice(
        (page - 1) * pageSize,
        page * pageSize
    );
    const totalPages = Math.ceil(filteredDatas?.length / pageSize);
    const visiblePages = Math.min(totalPages, 3);
    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(
        firstVisiblePage + visiblePages - 1,
        totalPages
    );
    const pageNumbers = [];
    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }

    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
        <div>
            <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
        </div>
    );
    const columnDataTable = [
        {
            field: "checkbox",
            headerName: "Checkbox", // Default header name
            headerStyle: {
                fontWeight: "bold", // Apply the font-weight style to make the header text bold
                // Add any other CSS styles as needed
            },
            renderHeader: (params) => (
                <CheckboxHeader
                    selectAllChecked={selectAllChecked}
                    onSelectAll={() => {
                        if (rowDataTable.length === 0) {
                            // Do not allow checking when there are no rows
                            return;
                        }
                        if (selectAllChecked) {
                            setSelectedRows([]);
                        } else {
                            const allRowIds = rowDataTable.map((row) => row.id);
                            const allRowIdsCat = rowDataTable.map((row) => row.name);
                            setSelectedRows(allRowIds);
                            setSelectedRowsCat(allRowIdsCat);
                        }
                        setSelectAllChecked(!selectAllChecked);
                    }}
                />
            ),

            renderCell: (params) => (
                <Checkbox
                    checked={selectedRows.includes(params.row.id)}
                    onChange={() => {
                        let updatedSelectedRows;
                        let updatedSelectedRowsCat;

                        if (selectedRows.includes(params.row.id)) {
                            updatedSelectedRows = selectedRows.filter(
                                (selectedId) => selectedId !== params.row.id
                            );
                            updatedSelectedRowsCat = selectedRowsCat.filter((selectedId) => selectedId !== params.row.name);
                        } else {
                            updatedSelectedRows = [...selectedRows, params.row.id];
                            updatedSelectedRowsCat = [...selectedRowsCat, params.row.name];
                        }
                        setSelectedRows(updatedSelectedRows);
                        setSelectedRowsCat(updatedSelectedRowsCat);

                        // Update the "Select All" checkbox based on whether all rows are selected
                        setSelectAllChecked(
                            updatedSelectedRows.length === filteredData.length
                        );
                    }}
                />
            ),
            sortable: false, // Optionally, you can make this column not sortable
            width: 90,
            hide: !columnVisibility.checkbox,
            headerClassName: "bold-header",
        },
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 80,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
        },
        {
            field: "name",
            headerName: "Name",
            flex: 0,
            width: 120,
            hide: !columnVisibility.name,
            headerClassName: "bold-header",
        },
        {
            field: "description",
            headerName: "Description",
            flex: 0,
            width: 150,
            hide: !columnVisibility.description,
            headerClassName: "bold-header",
        },
        {
            field: "appliedthrough",
            headerName: "Applied Through",
            flex: 0,
            width: 150,
            hide: !columnVisibility.appliedthrough,
            headerClassName: "bold-header",
        },
        {
            field: "lop",
            headerName: "LOP",
            flex: 0,
            width: 100,
            hide: !columnVisibility.lop,
            headerClassName: "bold-header",
        },
        {
            field: "loptype",
            headerName: "LOP Type",
            flex: 0,
            width: 120,
            hide: !columnVisibility.loptype,
            headerClassName: "bold-header",
        },
        {
            field: "criteria",
            headerName: "Criteria",
            flex: 0,
            width: 100,
            hide: !columnVisibility.criteria,
            headerClassName: "bold-header",
        },
        {
            field: "target",
            headerName: "Target",
            flex: 0,
            width: 100,
            hide: !columnVisibility.target,
            headerClassName: "bold-header",
        },
        {
            field: "paidleave",
            headerName: "Paid Present",
            flex: 0,
            width: 120,
            hide: !columnVisibility.paidleave,
            headerClassName: "bold-header",
        },
        {
            field: "paidleavetype",
            headerName: "Paid Present Type",
            flex: 0,
            width: 120,
            hide: !columnVisibility.paidleavetype,
            headerClassName: "bold-header",
        },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 250,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",
            renderCell: (params) => (
                <Grid sx={{ display: "flex" }}>
                    {isUserRoleCompare?.includes("eattendancemodemaster") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getCode(params.row.id, params.row.name);
                            }}
                        >
                            <EditOutlinedIcon style={{ fontsize: "large" }} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("dattendancemodemaster") && (
                        <Button
                            sx={userStyle.buttondelete}
                            onClick={(e) => {
                                rowData(params.row.id, params.row.name);
                            }}
                        >
                            <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("vattendancemodemaster") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getviewCode(params.row.id);
                            }}
                        >
                            <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("iattendancemodemaster") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                handleClickOpeninfo();
                                getinfoCode(params.row.id);
                            }}
                        >
                            <InfoOutlinedIcon style={{ fontsize: "large" }} />
                        </Button>
                    )}
                </Grid>
            ),
        },
    ];

    const rowDataTable = filteredData.map((item, index) => {
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            name: item.name,
            description: item.description,
            appliedthrough: item.appliedthrough,
            lop: item.lop,
            loptype: item.loptype,
            criteria: item.criteria,
            target: item.target,
            paidleave: item.paidleave,
            paidleavetype: item.paidleavetype,
        };
    });
    const rowsWithCheckboxes = rowDataTable.map((row) => ({
        ...row,
        // Create a custom field for rendering the checkbox
        checkbox: selectedRows.includes(row.id),
    }));
    // Show All Columns functionality
    const handleShowAllColumns = () => {
        const updatedVisibility = { ...columnVisibility };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibility(updatedVisibility);
    };
    // Function to filter columns based on search query
    const filteredColumns = columnDataTable.filter((column) =>
        column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase())
    );
    // Manage Columns functionality
    const toggleColumnVisibility = (field) => {
        setColumnVisibility((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };
    // JSX for the "Manage Columns" popover content
    const manageColumnsContent = (
        <Box
            style={{
                padding: "10px",
                minWidth: "325px",
                "& .MuiDialogContent-root": { padding: "10px 0" },
            }}
        >
            <Typography variant="h6">Manage Columns</Typography>
            <IconButton
                aria-label="close"
                onClick={handleCloseManageColumns}
                sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>
            <Box sx={{ position: "relative", margin: "10px" }}>
                <TextField
                    label="Find column"
                    variant="standard"
                    fullWidth
                    value={searchQueryManage}
                    onChange={(e) => setSearchQueryManage(e.target.value)}
                    sx={{ marginBottom: 5, position: "absolute" }}
                />
            </Box>
            <br />
            <br />
            <DialogContent
                sx={{ minWidth: "auto", height: "200px", position: "relative" }}
            >
                <List sx={{ overflow: "auto", height: "100%" }}>
                    {filteredColumns.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText
                                sx={{ display: "flex" }}
                                primary={
                                    <Switch
                                        sx={{ marginTop: "-5px" }}
                                        size="small"
                                        checked={columnVisibility[column.field]}
                                        onChange={() => toggleColumnVisibility(column.field)}
                                    />
                                }
                                secondary={
                                    column.field === "checkbox" ? "Checkbox" : column.headerName
                                }
                            />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Grid container>
                    <Grid item md={4}>
                        <Button
                            variant="text"
                            sx={{ textTransform: "none" }}
                            onClick={() => setColumnVisibility(initialColumnVisibility)}
                        >
                            {" "}
                            Show All
                        </Button>
                    </Grid>
                    <Grid item md={4}></Grid>
                    <Grid item md={4}>
                        <Button
                            variant="text"
                            sx={{ textTransform: "none" }}
                            onClick={() => {
                                const newColumnVisibility = {};
                                columnDataTable.forEach((column) => {
                                    newColumnVisibility[column.field] = false; // Set hide property to true
                                });
                                setColumnVisibility(newColumnVisibility);
                            }}
                        >
                            {" "}
                            Hide All
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Box>
    );

    // Excel
    const fileName = "Attendance Mode Master";
    const [fileFormat, setFormat] = useState('')
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
        if (isfilter === "filtered") {
            exportToCSV(
                rowDataTable?.map((t, index) => ({
                    "S.No": index + 1,
                    "Name": t.name,
                    "Description": t.description,
                    "Applied Through": t.appliedthrough,
                    "LOP": t.lop,
                    "Loptype": t.loptype,
                    "Criteria": t.criteria,
                    "Target": t.target,
                    "Paid Present": t.paidleave,
                    "Paid Present Type": t.paidleavetype,
                })),
                fileName,
            );
        } else if (isfilter === "overall") {
            exportToCSV(
                attModearr.map((t, index) => ({
                    "S.No": index + 1,
                    "Name": t.name,
                    "Description": t.description,
                    "Applied Through": t.appliedthrough,
                    "LOP": t.lop,
                    "Loptype": t.loptype,
                    "Criteria": t.criteria,
                    "Target": t.target ? 'YES' : 'NO',
                    "Paid Present": t.paidleave ? 'YES' : 'NO',
                    "Paid Present Type": t.paidleavetype,
                })),
                fileName,
            );

        }

        setIsFilterOpen(false)
    };

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Attendance Mode",
        pageStyle: "print",
    });

    // pdf.....
    const columns = [
        { title: "SNo", field: "serialNumber" },
        { title: "Name ", field: "name" },
        { title: "Description ", field: "description" },
        { title: "Applied Through", field: "appliedthrough" },
        { title: "LOP", field: "lop" },
        { title: "LOP Type", field: "loptype" },
        { title: "Criteria", field: "criteria" },
        { title: "Target", field: "target" },
        { title: "Paid Present", field: "paidleave" },
        { title: "Paid Present Type", field: "paidleavetype" },
    ];

    const downloadPdf = (isfilter) => {

        const doc = new jsPDF();

        // Initialize serial number counter
        let serialNumberCounter = 1;

        // Modify row data to include serial number
        const dataWithSerial = isfilter === "filtered" ?
            rowDataTable.map(row => ({ ...row, serialNumber: serialNumberCounter++ })) :
            attModearr.map(row => ({
                ...row,
                serialNumber: serialNumberCounter++,
                target: row.target ? 'YES' : 'NO',
                paidleave: row.paidleave ? 'YES' : 'NO',
            }));

        // Generate PDF
        doc.autoTable({
            theme: "grid",
            styles: { fontSize: 5 },
            columns: columns.map((col) => ({ ...col, dataKey: col.field })),
            body: dataWithSerial,
        });

        doc.save("Attendance Mode Master.pdf");
    };

    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "Attendance Mode Master.png");
                });
            });
        }
    };

    return (
        <Box>
            <Headtitle title={"ATTENDANCE MODE MASTER"} />
            {/* ****** Header Content ****** */}
            <Typography sx={userStyle.HeaderText}>Manage Attendance Mode</Typography>
            {!loader ? (
                <Box sx={userStyle.container}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            minHeight: "350px",
                        }}
                    >
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
                </Box>
            ) : (
                <>
                    {isUserRoleCompare?.includes("aattendancemodemaster") && (
                        <Box sx={userStyle.selectcontainer}>
                            <>
                                <Grid container spacing={2}>
                                    <Grid item xs={8}>
                                        <Typography sx={userStyle.importheadtext}>
                                            Add Attendance Mode
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <br />
                                <Grid container spacing={2}>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Name <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Name"
                                                value={attMode.name}
                                                onChange={(e) => {
                                                    setAttmode({
                                                        ...attMode,
                                                        name: e.target.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Description</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Description"
                                                value={attMode.description}
                                                onChange={(e) => {
                                                    setAttmode({
                                                        ...attMode,
                                                        description: e.target.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Applied Through</Typography>
                                            <Selects
                                                styles={colourStyles}
                                                options={appliedThrough}
                                                value={{
                                                    label: attMode.appliedthrough,
                                                    value: attMode.appliedthrough,
                                                }}
                                                onChange={(e) => {
                                                    setAttmode({
                                                        ...attMode,
                                                        appliedthrough: e.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item md={2} xs={12} sm={12}>
                                        <Typography>
                                            <b>LOP </b>
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid item md={4} xs={12} sm={6}>
                                                <Checkbox
                                                    sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                                    checked={attMode.lop}
                                                    value={attMode.lop}
                                                    onChange={(e) => {
                                                        setAttmode({
                                                            ...attMode,
                                                            lop: !attMode.lop,

                                                        });
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item md={2} xs={12} sm={12} marginTop={2}>
                                                {attMode.lop ? <span>Yes</span> : <span>No</span>}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    {
                                        attMode.lop ? (
                                            <Grid item md={2} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>LOP Type</Typography>
                                                    <Selects
                                                        maxMenuHeight={300}
                                                        options={reduceOptions}
                                                        value={{
                                                            label: attMode.loptype,
                                                            value: attMode.loptype,
                                                        }}
                                                        onChange={(e) => {
                                                            setAttmode({
                                                                ...attMode,
                                                                loptype: e.value,
                                                            });
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                        ) : (
                                            <Grid item md={2} xs={12} sm={12}>
                                                {" "}
                                            </Grid>
                                        )
                                    }

                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Criteria</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Criteria"
                                                value={attMode.criteria}
                                                onChange={(e) => {
                                                    setAttmode({
                                                        ...attMode,
                                                        criteria: e.target.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item md={4} xs={12} sm={12}>
                                        <Typography>
                                            <b>Target </b>
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid item md={3} xs={12} sm={6}>
                                                <Checkbox
                                                    sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                                    checked={attMode.target}
                                                    value={attMode.target}
                                                    onChange={(e) => {
                                                        setAttmode({
                                                            ...attMode,
                                                            target: !attMode.target,
                                                        });
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item md={3} xs={12} sm={12} marginTop={2}>
                                                {attMode.target ? <span>Yes</span> : <span>No</span>}
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid item md={4} xs={12} sm={12}>
                                        <Typography>
                                            <b>Paid Present </b>
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid item md={6} xs={12} sm={6}>
                                                <Selects
                                                    maxMenuHeight={300}
                                                    options={reducePaidValueOptions}
                                                    value={{
                                                        label:
                                                            attMode.paidleave ? "Yes" : "No",
                                                        value:
                                                            attMode.paidleave ? "Yes" : "No"
                                                    }}
                                                    onChange={(e) => {
                                                        setAttmode({
                                                            ...attMode,
                                                            paidleave: e.value === "Yes" ? true : false,
                                                        });
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item md={3} xs={12} sm={12} marginTop={2}>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    {
                                        attMode.paidleave ? (
                                            <Grid item md={2} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>Paid Present Type</Typography>
                                                    <Selects
                                                        maxMenuHeight={300}
                                                        options={reducePaidOptions}
                                                        value={{
                                                            label: attMode.paidleavetype,
                                                            value: attMode.paidleavetype,
                                                        }}
                                                        onChange={(e) => {
                                                            setAttmode({
                                                                ...attMode,
                                                                paidleavetype: e.value,
                                                            });
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                        ) : (
                                            <Grid item md={2} xs={12} sm={12}></Grid>
                                        )
                                    }

                                </Grid>
                                <br />
                                <br />
                                <Grid item md={12} sm={12} xs={12}>
                                    <br />
                                    <br />
                                    <Grid
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            gap: "15px",
                                        }}
                                    >
                                        <LoadingButton
                                            sx={{
                                                ...userStyle.buttonedit,
                                                marginLeft: "10px",
                                            }}
                                            variant="contained"
                                            loading={btnSubmit}
                                            style={{ minWidth: "0px" }}
                                            onClick={handleSubmit}
                                        >
                                            SAVE
                                        </LoadingButton>
                                        <Button sx={userStyle.btncancel} onClick={handleclear}>
                                            {" "}
                                            CLEAR
                                        </Button>
                                    </Grid>
                                </Grid>
                            </>
                        </Box>
                    )}
                </>
            )}
            <br /> <br />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lattendancemodemaster") && (
                <>
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>
                                Attendance Mode List
                            </Typography>
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
                                        {/* <MenuItem value={attModearr?.length}>All</MenuItem> */}
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid
                                item
                                md={8}
                                xs={12}
                                sm={12}
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Box>
                                    {isUserRoleCompare?.includes("excelattendancemodemaster") && (
                                        <>

                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvattendancemodemaster") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printattendancemodemaster") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfattendancemodemaster") && (
                                        <>
                                            <Button sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true)
                                                }}
                                            ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imageattendancemodemaster") && (
                                        <Button
                                            sx={userStyle.buttongrp}
                                            onClick={handleCaptureImage}
                                        >
                                            {" "}
                                            <ImageIcon
                                                sx={{ fontSize: "15px" }}
                                            /> &ensp;Image&ensp;{" "}
                                        </Button>
                                    )}
                                </Box>
                            </Grid>
                            <Grid item md={2} xs={12} sm={12}>
                                <Box>
                                    <FormControl fullWidth size="small">
                                        <Typography>Search</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={searchQuery}
                                            onChange={handleSearchChange}
                                        />
                                    </FormControl>
                                </Box>
                            </Grid>
                        </Grid>
                        <br />
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
                            Show All Columns
                        </Button>
                        &ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
                            Manage Columns
                        </Button>
                        &ensp;
                        {isUserRoleCompare?.includes("bdattendancemodemaster") && (
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleClickOpenalert}
                            >
                                Bulk Delete
                            </Button>
                        )}
                        <br />
                        <br />
                        <Box
                            style={{
                                width: "100%",
                                overflowY: "hidden", // Hide the y-axis scrollbar
                            }}
                        >
                            <StyledDataGrid
                                onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
                                rows={rowsWithCheckboxes}
                                columns={columnDataTable.filter(
                                    (column) => columnVisibility[column.field]
                                )}
                                onSelectionModelChange={handleSelectionChange}
                                selectionModel={selectedRows}
                                autoHeight={true}
                                ref={gridRef}
                                density="compact"
                                hideFooter
                                getRowClassName={getRowClassName}
                                disableRowSelectionOnClick
                            />
                        </Box>
                        <Box style={userStyle.dataTablestyle}>
                            <Box>
                                Showing{" "}
                                {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0} to{" "}
                                {Math.min(page * pageSize, filteredDatas?.length)} of{" "}
                                {filteredDatas?.length} entries
                            </Box>
                            <Box>
                                <Button
                                    onClick={() => setPage(1)}
                                    disabled={page === 1}
                                    sx={userStyle.paginationbtn}
                                >
                                    <FirstPageIcon />
                                </Button>
                                <Button
                                    onClick={() => handlePageChange(page - 1)}
                                    disabled={page === 1}
                                    sx={userStyle.paginationbtn}
                                >
                                    <NavigateBeforeIcon />
                                </Button>
                                {pageNumbers?.map((pageNumber) => (
                                    <Button
                                        key={pageNumber}
                                        sx={userStyle.paginationbtn}
                                        onClick={() => handlePageChange(pageNumber)}
                                        className={page === pageNumber ? "active" : ""}
                                        disabled={page === pageNumber}
                                    >
                                        {pageNumber}
                                    </Button>
                                ))}
                                {lastVisiblePage < totalPages && <span>...</span>}
                                <Button
                                    onClick={() => handlePageChange(page + 1)}
                                    disabled={page === totalPages}
                                    sx={userStyle.paginationbtn}
                                >
                                    <NavigateNextIcon />
                                </Button>
                                <Button
                                    onClick={() => setPage(totalPages)}
                                    disabled={page === totalPages}
                                    sx={userStyle.paginationbtn}
                                >
                                    <LastPageIcon />
                                </Button>
                            </Box>
                        </Box>
                        {/* ****** Table End ****** */}
                    </Box>
                </>
            )}
            {/* ****** Table End ****** */}
            {/* Manage Column */}
            <Popover
                id={id}
                open={isManageColumnsOpen}
                anchorEl={anchorEl}
                onClose={handleCloseManageColumns}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
            >
                {manageColumnsContent}
            </Popover>
            {/* print layout */}
            <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table
                    sx={{ minWidth: 700 }}
                    aria-label="customized table"
                    id="usertable"
                    ref={componentRef}
                >
                    <TableHead>
                        <TableRow>
                            <TableCell> SI.No</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Applied Through</TableCell>
                            <TableCell>LOP</TableCell>
                            <TableCell>LOP Type</TableCell>
                            <TableCell>Criteria</TableCell>
                            <TableCell>Target</TableCell>
                            <TableCell>Paid Present</TableCell>
                            <TableCell>Paid Present Type</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody align="left">
                        {rowDataTable &&
                            rowDataTable.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>{row.description}</TableCell>
                                    <TableCell>{row.appliedthrough}</TableCell>
                                    <TableCell>{row.lop}</TableCell>
                                    <TableCell>{row.loptype}</TableCell>
                                    <TableCell>{row.criteria}</TableCell>
                                    <TableCell>{row.target}</TableCell>
                                    <TableCell>{row.paidleave}</TableCell>
                                    <TableCell>{row.paidleavetype}</TableCell>
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
                            fetchAttMode()
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

            {/* this is info view details */}
            <Dialog
                open={openInfo}
                onClose={handleCloseinfo}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <Box sx={{ width: "550px", padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}>
                            Attendance Mode Info
                        </Typography>
                        <br />
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={12} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">addedby</Typography>
                                    <br />
                                    <Table>
                                        <TableHead>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                                {"SNO"}.
                                            </StyledTableCell>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                                {" "}
                                                {"UserName"}
                                            </StyledTableCell>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                                {" "}
                                                {"Date"}
                                            </StyledTableCell>
                                        </TableHead>
                                        <TableBody>
                                            {addedby?.map((item, i) => (
                                                <StyledTableRow>
                                                    <StyledTableCell
                                                        sx={{ padding: "5px 10px !important" }}
                                                    >
                                                        {i + 1}.
                                                    </StyledTableCell>
                                                    <StyledTableCell
                                                        sx={{ padding: "5px 10px !important" }}
                                                    >
                                                        {" "}
                                                        {item.name}
                                                    </StyledTableCell>
                                                    <StyledTableCell
                                                        sx={{ padding: "5px 10px !important" }}
                                                    >
                                                        {" "}
                                                        {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </FormControl>
                            </Grid>
                            <Grid item md={12} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Updated by</Typography>
                                    <br />
                                    <Table>
                                        <TableHead>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                                {"SNO"}.
                                            </StyledTableCell>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                                {" "}
                                                {"UserName"}
                                            </StyledTableCell>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                                {" "}
                                                {"Date"}
                                            </StyledTableCell>
                                        </TableHead>
                                        <TableBody>
                                            {updateby?.map((item, i) => (
                                                <StyledTableRow>
                                                    <StyledTableCell
                                                        sx={{ padding: "5px 10px !important" }}
                                                    >
                                                        {i + 1}.
                                                    </StyledTableCell>
                                                    <StyledTableCell
                                                        sx={{ padding: "5px 10px !important" }}
                                                    >
                                                        {" "}
                                                        {item.name}
                                                    </StyledTableCell>
                                                    <StyledTableCell
                                                        sx={{ padding: "5px 10px !important" }}
                                                    >
                                                        {" "}
                                                        {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br /> <br />
                        <br />
                        <Grid container spacing={2} sx={{ marginLeft: "-2px" }}>
                            <Button variant="contained" onClick={handleCloseinfo}>
                                {" "}
                                Back{" "}
                            </Button>
                        </Grid>
                    </>
                </Box>
            </Dialog>
            {/*DELETE ALERT DIALOG */}
            <Dialog
                open={isDeleteOpen}
                onClose={handleCloseMod}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent
                    sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
                >
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "80px", color: "orange" }}
                    />
                    <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
                        Are you sure?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCloseMod}
                        style={{
                            backgroundColor: "#f4f4f4",
                            color: "#444",
                            boxShadow: "none",
                            borderRadius: "3px",
                            border: "1px solid #0000006b",
                            "&:hover": {
                                "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                                    backgroundColor: "#f4f4f4",
                                },
                            },
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        autoFocus
                        variant="contained"
                        color="error"
                        onClick={(e) => delBrand(assetid)}
                    >
                        {" "}
                        OK{" "}
                    </Button>
                </DialogActions>
            </Dialog>
            {/* view model */}
            <Dialog
                open={openview}
                onClose={handleClickOpenview}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth="md"
            >
                <Box sx={{ padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}>
                            {" "}
                            View Attendance Mode
                        </Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Name</Typography>
                                    <Typography>{attModeedit.name}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Description</Typography>
                                    <Typography>{attModeedit.description}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Applied Through</Typography>
                                    <Typography>{attModeedit.appliedthrough}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">LOP</Typography>
                                    <Typography>{attModeedit.lop ? "Yes" : "No"}</Typography>
                                </FormControl>
                            </Grid>
                            {attModeedit.lop && (
                                <Grid item md={6} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6">LOP Type</Typography>
                                        <Typography>{attModeedit.loptype}</Typography>
                                    </FormControl>
                                </Grid>
                            )}
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Criteria</Typography>
                                    <Typography>{attModeedit.criteria}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Target</Typography>
                                    <Typography>{attModeedit.target ? "Yes" : "No"}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Paid Present</Typography>
                                    <Typography>
                                        {attModeedit.paidleave ? "Yes" : "No"}
                                    </Typography>
                                </FormControl>
                            </Grid>
                            {attModeedit.paidleave && (
                                <Grid item md={6} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6">Paid Present Type</Typography>
                                        <Typography>{attModeedit.paidleavetype}</Typography>
                                    </FormControl>
                                </Grid>
                            )}
                        </Grid>
                        <br /> <br /> <br />
                        <Grid container spacing={2} sx={{ marginLeft: "-2px" }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleCloseview}
                            >
                                Back
                            </Button>
                        </Grid>
                    </>
                </Box>
            </Dialog>
            {/* ALERT DIALOG */}
            <Box>
                <Dialog
                    open={isErrorOpen}
                    onClose={handleCloseerr}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent
                        sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
                    >
                        <Typography variant="h6">{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="contained"
                            style={{
                                padding: "7px 13px",
                                color: "white",
                                background: "rgb(25, 118, 210)",
                            }}
                            onClick={handleCloseerr}
                        >
                            ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
            {/* Bulk delete ALERT DIALOG */}
            <Dialog
                open={isDeleteOpenalert}
                onClose={handleCloseModalert}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent
                    sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
                >
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "70px", color: "orange" }}
                    />
                    <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
                        Please Select any Row
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        autoFocus
                        variant="contained"
                        color="error"
                        onClick={handleCloseModalert}
                    >
                        {" "}
                        OK{" "}
                    </Button>
                </DialogActions>
            </Dialog>
            <Box>
                <Dialog
                    open={isDeleteOpencheckbox}
                    onClose={handleCloseModcheckbox}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent
                        sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
                    >
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "80px", color: "orange" }}
                        />
                        <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
                            Are you sure?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>
                            Cancel
                        </Button>
                        <Button
                            autoFocus
                            variant="contained"
                            color="error"
                            onClick={(e) => delAreagrpcheckbox(e)}
                        >
                            {" "}
                            OK{" "}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
            {/* Edit DIALOG */}
            <Box>
                <Dialog
                    open={isEditOpen}
                    onClose={handleCloseModEdit}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="md"
                    fullWidth={true}
                >
                    <Box sx={{ padding: "20px 50px" }}>
                        <>
                            <Grid container spacing={2}>
                                <Typography sx={userStyle.HeaderText}>
                                    Edit Attendance Mode
                                </Typography>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={6} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Name <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            placeholder="Please Enter Name"
                                            value={attModeedit.name}
                                            onChange={(e) => {
                                                setAttmodeEdit({
                                                    ...attModeedit,
                                                    name: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={6} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Description</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            placeholder="Please Enter Description"
                                            value={attModeedit.description}
                                            onChange={(e) => {
                                                setAttmodeEdit({
                                                    ...attModeedit,
                                                    description: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={6} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Applied Through</Typography>
                                        <Selects
                                            styles={colourStyles}
                                            options={appliedThrough}
                                            value={{
                                                label: attModeedit.appliedthrough,
                                                value: attModeedit.appliedthrough,
                                            }}
                                            onChange={(e) => {
                                                setAttmodeEdit({
                                                    ...attModeedit,
                                                    appliedthrough: e.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item md={3} xs={12} sm={12}>
                                    <Typography>
                                        <b>LOP </b>
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item md={4} xs={12} sm={6}>
                                            <Checkbox
                                                sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                                checked={attModeedit.lop}
                                                value={attModeedit.lop}
                                                onChange={(e) => {
                                                    setAttmodeEdit({
                                                        ...attModeedit,
                                                        lop: !attModeedit.lop,
                                                    });
                                                }}
                                            />
                                        </Grid>
                                        <Grid item md={2} xs={12} sm={12} marginTop={2}>
                                            {attModeedit.lop ? <span>Yes</span> : <span>No</span>}
                                        </Grid>
                                    </Grid>
                                </Grid>

                                {attModeedit.lop && (
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>LOP Type</Typography>
                                            <Selects
                                                maxMenuHeight={300}
                                                options={reduceOptions}
                                                value={{
                                                    label:
                                                        attModeedit.loptype === ""
                                                            ? "Half Day"
                                                            : attModeedit.loptype,
                                                    value:
                                                        attModeedit.loptype === ""
                                                            ? "Half Day"
                                                            : attModeedit.loptype,
                                                }}
                                                onChange={(e) => {
                                                    setAttmodeEdit({
                                                        ...attModeedit,
                                                        loptype: e.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                )}

                                <Grid item md={6} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Criteria</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            placeholder="Please Enter Criteria"
                                            value={attModeedit.criteria}
                                            onChange={(e) => {
                                                setAttmodeEdit({
                                                    ...attModeedit,
                                                    criteria: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item md={6} xs={12} sm={12}>
                                    <Typography>
                                        <b>Target </b>
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item md={3} xs={12} sm={6}>
                                            <Checkbox
                                                sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
                                                checked={attModeedit.target}
                                                value={attModeedit.target}
                                                onChange={(e) => {
                                                    setAttmodeEdit({
                                                        ...attModeedit,
                                                        target: !attModeedit.target,
                                                    });
                                                }}
                                            />
                                        </Grid>
                                        <Grid item md={2} xs={12} sm={12} marginTop={2}>
                                            {attModeedit.target ? <span>Yes</span> : <span>No</span>}
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <Typography>
                                        <b>Paid Present </b>
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item md={8} xs={12} sm={6}>
                                            <Selects
                                                maxMenuHeight={300}
                                                options={reducePaidValueOptions}
                                                value={{
                                                    label:
                                                        attModeedit.paidleave ? "Yes" : "No",
                                                    value:
                                                        attModeedit.paidleave ? "Yes" : "No"
                                                }}
                                                onChange={(e) => {
                                                    setAttmodeEdit({
                                                        ...attModeedit,
                                                        paidleave: e.value === "Yes" ? true : false,
                                                    });
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>

                                {attModeedit.paidleave && (
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Paid Present Type</Typography>
                                            <Selects
                                                maxMenuHeight={300}
                                                options={reducePaidOptions}
                                                value={{
                                                    label:
                                                        attModeedit.paidleavetype === ""
                                                            ? "Half Day"
                                                            : attModeedit.paidleavetype,
                                                    value:
                                                        attModeedit.paidleavetype === ""
                                                            ? "Half Day"
                                                            : attModeedit.paidleavetype,
                                                }}
                                                onChange={(e) => {
                                                    setAttmodeEdit({
                                                        ...attModeedit,
                                                        paidleavetype: e.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                )}
                            </Grid>
                            <br /> <br /><br /><br />
                            <Grid
                                container
                                spacing={2}
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Grid item md={3} xs={12} sm={12}>
                                    <Button variant="contained" onClick={editSubmit}>
                                        {" "}
                                        Update
                                    </Button>
                                </Grid>
                                <br />
                                <Grid item md={3} xs={12} sm={12}>
                                    <Button sx={userStyle.btncancel} onClick={handleCloseModEdit}>
                                        {" "}
                                        Cancel{" "}
                                    </Button>
                                </Grid>
                            </Grid>
                        </>
                    </Box>
                </Dialog>

                <Dialog
                    open={isCheckOpen}
                    onClose={handleCloseCheck}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent
                        sx={{
                            width: "350px",
                            textAlign: "center",
                            alignItems: "center",
                        }}
                    >
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "80px", color: "orange" }}
                        />
                        <Typography
                            variant="h6"
                            sx={{ color: "black", textAlign: "center" }}
                        >
                            {checkUnit?.length > 0 ? (
                                <>
                                    <span
                                        style={{ fontWeight: "700", color: "#777" }}
                                    >{`${deleteAttMode.name} `}</span>
                                    was linked in{" "}
                                    <span style={{ fontWeight: "700" }}>Attendance Status Master</span>
                                </>
                            ) : (
                                ""
                            )}

                            {/* {overalldeletecheck?.length > 0 ? (
                    <>
                      <span
                        style={{ fontWeight: "700", color: "#777" }}
                      >{`${overalldeletecheck.map(
                        (item) => item.categoryname
                      )} `}</span>
                      was linked in{" "}
                      <span style={{ fontWeight: "700" }}>IP Master</span>{" "}
                      {categoryList.filter(
                        (d) =>
                          !overalldeletecheck.some(
                            (item) => d.categoryname === item.categoryname
                          )
                      ).length > 0 && (
                          <Typography>
                            Do You want to Delete others?...
                          </Typography>
                        )}
                    </>
                  ) : (
                    ""
                  )} */}
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        {checkUnit?.length > 0
                            // ||
                            //   categoryList.filter(
                            //     (d) =>
                            //       !overalldeletecheck.ipcategory.some(
                            //         (item) => d.categoryname === item.categoryname
                            //       )
                            //   ).length === 0
                            ? (
                                <Button
                                    onClick={handleCloseCheck}
                                    autoFocus
                                    variant="contained"
                                    color="error"
                                >
                                    {" "}
                                    OK{" "}
                                </Button>
                            ) : (
                                ""
                            )}
                        {/* {overalldeletecheck?.length > 0 &&
                  categoryList.filter(
                    (d) =>
                      !overalldeletecheck.some(
                        (item) => d.categoryname === item.categoryname
                      )
                  ).length > 0 ? (
                  <>
                    <Button
                      onClick={delReasoncheckboxWithoutLink}
                      variant="contained"
                    >
                      {" "}
                      Yes{" "}
                    </Button>
                    <Button
                      onClick={handleCloseCheck}
                      autoFocus
                      variant="contained"
                      color="error"
                    >
                      {" "}
                      Cancel{" "}
                    </Button>
                  </>
                ) : (
                  ""
                )} */}
                    </DialogActions>
                </Dialog>



                <Dialog open={isbulkCheckOpen} onClose={handlebulkCloseCheck} aria-labelledby="alert-dialog-title" maxWidth="sm" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ textAlign: "center", alignItems: "center" }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
                        <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
                            {(overalldeletecheck.ebuse?.length > 0) && (
                                <>
                                    <span style={{ fontWeight: "700", color: "#777" }}>
                                        {getLinkedLabelItem(overalldeletecheck)}
                                    </span>{' '}
                                    was linked in{' '}
                                    <span style={{ fontWeight: "700", color: "#777" }}>
                                        {getLinkedLabel(overalldeletecheck)}
                                    </span>
                                    {shouldShowDeleteMessage(attModearr, selectedRows, overalldeletecheck) && (
                                        <Typography>Do you want to delete others?...</Typography>
                                    )}
                                </>
                            )}
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        {shouldEnableOkButton(attModearr, selectedRows, overalldeletecheck) ? (
                            <Button onClick={handlebulkCloseCheck} autoFocus variant="contained" color="error"> OK </Button>
                        ) : null}
                        {shouldShowDeleteMessage(attModearr, selectedRows, overalldeletecheck) && (
                            <>
                                <Button onClick={delEbservicecheckboxWithoutLink} variant="contained"> Yes </Button>
                                <Button onClick={handlebulkCloseCheck} autoFocus variant="contained" color="error">Cancel</Button>
                            </>
                        )}
                    </DialogActions>
                </Dialog>



                <Box>
                    <Dialog
                        open={isErrorOpenpop}
                        onClose={handleCloseerrpop}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogContent
                            sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
                        >
                            <Typography variant="h6">{showAlertpop}</Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                variant="contained"
                                style={{
                                    padding: "7px 13px",
                                    color: "white",
                                    background: "rgb(25, 118, 210)",
                                }}
                                onClick={() => {
                                    sendEditRequest();
                                    handleCloseerrpop();
                                }}
                            >
                                ok
                            </Button>
                            <Button
                                style={{
                                    backgroundColor: "#f4f4f4",
                                    color: "#444",
                                    boxShadow: "none",
                                    borderRadius: "3px",
                                    padding: "7px 13px",
                                    border: "1px solid #0000006b",
                                    "&:hover": {
                                        "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                                            backgroundColor: "#f4f4f4",
                                        },
                                    },
                                }}
                                onClick={handleCloseerrpop}
                            >
                                Cancel
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Box>


            </Box>
            <br />
        </Box>
    );
}

export default AttendanceModeMaster;